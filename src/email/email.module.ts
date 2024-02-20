import { Module } from '@nestjs/common';
import {EmailController} from "./controller/email/email.controller.js";
import {EmailService} from "./services/email/email.service.js";
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../users/services/users/users.service.js";
import {UsersModule} from "../users/users.module.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../typeorm/index.js";


@Module({
    imports:[
        MailerModule.forRootAsync({
            inject:[ConfigService],
            useFactory:async (config:ConfigService) => ({
                transport:{
                    service:"gmail",
                    host:config.get<string>("MAIL_HOST"),
                    port:+config.get<number>("MAIL_PORT"),
                    secure:false,
                    auth:{
                        user:config.get<string>("MAIL_USER"),
                        pass:config.get<string>("MAIL_PASS")

                    },

                    defaults: {
                        from: '"NestJS Mailer" <noreply@example.com>',
                    },
                    tls:{
                        rejectUnauthorized:false,

                    },
                    debug:true
                }
            })
        })],
    controllers:[EmailController],
    providers:[EmailService]
})
export class EmailModule {}
