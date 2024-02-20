import {BadRequestException, Injectable} from '@nestjs/common';
import {ApplyValidation, validateParameter} from "../../../utils/decorators/validate-parameter.decorator.js";
import {NotificationDto} from "../../dtos/Notification.dto.js";
import {SseService} from "../../../sse/services/sse/sse.service.js";
import {OnEvent} from "@nestjs/event-emitter";
import {NotifyTask} from "../../../utils/events/sse/task/NotifyTask.js";
import {In, Repository} from "typeorm";
import {Notification} from "../../../typeorm/Notification.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {NotificationRead} from "../../../typeorm/NotificationRead.entity.js";
import {User} from "../../../typeorm/index.js";
import {Filtering} from "../../../utils/decorators/filter-params.decorator.js";
import {PaginationParams} from "../../../utils/decorators/pagination-params.js";

@Injectable()
export class NotificationService {
    constructor(private readonly sseService:SseService,
                @InjectRepository(Notification) private readonly notificationRepo:Repository<Notification>,
                @InjectRepository(NotificationRead) private readonly notificationReadRepo:Repository<NotificationRead>
                ) {

    }
    async getNotifications(userId:number, pagination:PaginationParams) {
        return  await this.notificationReadRepo.createQueryBuilder("notificationRead").leftJoinAndSelect("notificationRead.notification", "notification")
            .leftJoinAndSelect("notificationRead.user", "user")
            .where("user.id = :userId", {userId})
            .orderBy("notification.createdAt", "DESC")
            .skip(pagination.offset)
            .limit(pagination.limit)
            .getMany()

    }
    @ApplyValidation(NotificationDto)
    async createNotification(@validateParameter body:NotificationDto) {
        let notification = new Notification();
        notification.content = body.content;
        notification.sender = {id:+body.sender} as User;
        notification = await this.notificationRepo.save(notification);
        if(!notification) throw new BadRequestException("Failed to create notification");
        console.log(notification);
        const result = await Promise.all(body.receivers.map(receiver => {
            return this.createNotificationRead(notification, receiver);
        }));
        if(!result) {
            throw new BadRequestException("Failed to create notification_read")
        }
        return notification;

    }
    async createNotificationRead(notification:Notification, receiver:number) {
        const obj = this.notificationReadRepo.create({user:{id:notification.sender.id}, notification, isRead:false});
        return this.notificationReadRepo.save(obj)
    }
    @OnEvent("task.notify")
    async sendNotification(event:NotifyTask) {
        const content = `${event.author.username} assigned you a new task: ${event.title}`
        const obj:NotificationDto = {content, read:false, receivers:event.assignees, sender:event.author.id};
        const notification = await this.createNotification(obj);
        event.assignees.forEach(assignee => {
            this.sseService.notify(assignee, "notification", notification)
        })
    }

    async readNotification(userId:string, ids:number[]) {
        const notifications = await this.notificationRepo.findBy({id:In(ids)})
        const notificationReads = await this.notificationReadRepo.findBy({notification:In(notifications), user:{id:+userId}});
        return Promise.all( notificationReads.map(notif => {
            notif.isRead = true;
            return this.notificationReadRepo.save(notif);
        })).catch((err:unknown) => {
            if(err instanceof Error) {
                throw new BadRequestException("Failed to mark notification as read");
            }
        });


    }
}

