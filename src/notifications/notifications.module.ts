import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification/notification.controller';
import { NotificationService } from './services/notification/notification.service';
import {SseModule} from "../sse/sse.module.js";

import {TypeOrmModule} from "@nestjs/typeorm";
import {Notification} from "../typeorm/Notification.entity.js";
import {NotificationRead} from "../typeorm/NotificationRead.entity.js";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports:[SseModule, TypeOrmModule.forFeature([Notification, NotificationRead])]
})
export class NotificationsModule {}
