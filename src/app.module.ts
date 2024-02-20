import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { UsersController } from './users/controllers/users/users.controller';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";

import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { EmailController } from './email/controller/email/email.controller';
import { EmailModule } from './email/email.module';

import {EventEmitterModule} from "@nestjs/event-emitter";

import {dataSourceOptions} from "../db/dataSource.js";
import { TasksModule } from './tasks/tasks.module';
import { SseModule } from './sse/sse.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [CustomersModule,  UsersModule, TypeOrmModule.forRoot(dataSourceOptions),  EventEmitterModule.forRoot(), AuthModule, ConfigModule.forRoot({
    isGlobal:true,
  }), EmailModule, TasksModule, SseModule, NotificationsModule],
  controllers: [ UsersController, EmailController],
  providers: [],

})
export class AppModule {

}