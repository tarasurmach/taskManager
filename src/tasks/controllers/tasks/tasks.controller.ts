import {Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe, Put} from '@nestjs/common';
import {CreateTaskDto} from "../../dtos/create-task.dto.js";
import {User} from "../../../utils/decorators/current-user.decorator.js";
import {TasksService} from "../../services/tasks/tasks.service.js";
import {AccessTokenGuard} from "../../../auth/guards/access-token.guard.js";

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService:TasksService) {

    }
    @UseGuards(AccessTokenGuard)
    @Post("/")
    @UsePipes(ValidationPipe)
    private async createTask(@Body() body: CreateTaskDto, @User() user:Express.User) {
        return this.taskService.create(body, user);

    }
    @Get("/:userId")
    private getUserTasks(@Param("userId") userId:string) {
        console.log(userId)
        return this.taskService.getUserTasks(+userId)

    }
    @Get("/assigned/:userId")
    private getAssignedTasks(@Param("userId") userId:string) {
        return this.taskService.getAssignedTasks(+userId)
    }
    @UseGuards(AccessTokenGuard)
    @Put("/edit")
    @UsePipes(ValidationPipe)
    private updateTasks(@Body() body: CreateTaskDto & {id:number}, @User("userId") userId:string) {
        return this.taskService.updateTasks(body, +userId)
    }


}
