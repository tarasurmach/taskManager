import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Task, User} from "../../../typeorm/index.js";
import {Repository} from "typeorm";
import {CreateTaskDto} from "../../dtos/create-task.dto.js";
import {serialized, UsersService} from "../../../users/services/users/users.service.js";
import {EventEmitter2} from "@nestjs/event-emitter";
import {AssignTask} from "../../../utils/events/email/task/AssignTasks.js";
import {NotifyTask} from "../../../utils/events/sse/task/NotifyTask.js";
import {SerializedUser} from "../../../users/types/index.js";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private readonly taskRepo:Repository<Task>,
        private readonly userService:UsersService,
        private readonly eventEmitter:EventEmitter2
        ) {

    }
    async create(body:CreateTaskDto, user:Record<string, number|string>) {
        const author = await this.userService.getById(+user.userId);
        if(!author) throw new BadRequestException("Invalid author");
        const assignees = await this.userService.getByIds(body.assignees);
        const task = this.taskRepo.create({...body, assignees:assignees.map(serialized), author});
        const result = await this.taskRepo.save(task);
        this.assignTasks(task, assignees.map(serialized));
        return result
    }

    assignTasks(task:Task, assignees:SerializedUser[]) {
        this.eventEmitter.emit("task.notify", new NotifyTask(assignees.map(({id})=>id), task.id, task.author, task.title))
        assignees.forEach(assignee => {
            this.eventEmitter.emit("task.assign", new AssignTask(task.author.username, task.title, task.dueDate, assignee));
        })
    }
    unAssignTasks(task:Task, users:User[]) {
        users.forEach(user => {
            this.eventEmitter.emit("task.dismiss", new AssignTask(task.author.username, task.title, task.dueDate, user))
        })
    }
    async updateTasks(body:CreateTaskDto & {id:number}, userId:number) {
        const author = await this.userService.getById(userId);
        if(!author) throw new BadRequestException("Invalid author");
        const assignees = await this.userService.getByIds(body.assignees);
        const task = await this.taskRepo.findOne({where:{id:body.id}, relations:["author", "assignees"]});

        const newAssignees = assignees.filter(assignee => !task.assignees.some(asgn => asgn.id === assignee.id));
        const assigneesToDismiss = task.assignees.filter(assignee => !body.assignees.includes(assignee.id));

        const newTask = {...task, assignees};
        if(!task) throw new BadRequestException("Task doesn't exist");
        this.assignTasks(newTask, newAssignees);
        this.unAssignTasks(newTask, assigneesToDismiss);
        return this.taskRepo.save(newTask);
    }
    deleteTask(id:number) {
        return this.taskRepo.delete({id});
    }
    async getAssignedTasks(id:number) {
        const user = await this.userService.getUserById(id);
        return this.taskRepo.find({relations:["assignees", "author"], where:{assignees:user}});
    }
    getUserTasks(id:number) {
        return this.taskRepo.find({where:{author:{id}},relations:["assignees", "author"]});
    }

}
