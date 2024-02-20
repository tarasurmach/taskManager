import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks/tasks.controller';
import { TasksService } from './services/tasks/tasks.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "../typeorm/index.js";

import {UsersModule} from "../users/users.module.js";
import {EmailModule} from "../email/email.module.js";

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports:[TypeOrmModule.forFeature([Task]), UsersModule, EmailModule]
})
export class TasksModule {}
