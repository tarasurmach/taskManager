import { Module } from '@nestjs/common';
import {UsersService} from "./services/users/users.service.js";
import {UsersController} from "./controllers/users/users.controller.js";
import {User, Token} from "../typeorm/index.js";
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
    providers:[UsersService],
    controllers:[UsersController],
    imports:[TypeOrmModule.forFeature([User, Token])],
    exports:[UsersService, ]
})
export class UsersModule {
}
