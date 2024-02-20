import {Body, Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {AccessTokenGuard} from "../../../auth/guards/access-token.guard.js";
import {User} from "../../../utils/decorators/current-user.decorator.js";
import {NotificationService} from "../../services/notification/notification.service.js";
import {Filtering, filterParams} from "../../../utils/decorators/filter-params.decorator.js";
import {PaginationParams, paginationParams} from "../../../utils/decorators/pagination-params.js";

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService:NotificationService) {
    }
    @Get("/")
    @UseGuards(AccessTokenGuard)
    private getAll(@User("userId") userId:string,   @paginationParams() pagination:PaginationParams) {
        return this.notificationService.getNotifications(+userId, pagination)
    }
    @Patch("/")
    private markRead(@User("userId") userId:string, @Body() body:{notifications:number[]}) {

        return this.notificationService.readNotification(userId, body.notifications);


    }

}
