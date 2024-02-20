import { Module } from '@nestjs/common';
import { SseService } from './services/sse/sse.service';
import { SseController } from './controllers/sse/sse.controller';
import {EventEmitter2} from "@nestjs/event-emitter";
import {UsersModule} from "../users/users.module.js";

@Module({
  providers: [SseService, EventEmitter2],
  controllers: [SseController],
  imports:[UsersModule],
  exports:[SseService]

})
export class SseModule {}
