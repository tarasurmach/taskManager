import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser"
import * as passport from "passport";
import * as session from "express-session";
import {UsersService} from "./users/services/users/users.service.js";
import {SerializedUser} from "./users/types/index.js";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const userService = app.get(UsersService);
    console.log(userService)
    app.use(cookieParser());
    app.use(
        session({
            secret:"session_secret",
            saveUninitialized:false,
            resave:false,
            cookie:{
            maxAge:60000
            }
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())
    passport.serializeUser((user:unknown, done) => {
        console.log("SERIALIZING")
        console.log(user)
        done(null, (user as SerializedUser).id);
    });

    passport.deserializeUser((id:number, done) => {
        console.log("DESERIALIZING")
        console.log(id);
        userService.getUserById(id).then((user:unknown) => {
            done(null, user as Express.User);
        }).catch(e =>{
            done(e, null)
        })

    });

    await app.listen(config.get<number>("PORT"));
}
bootstrap().then();
