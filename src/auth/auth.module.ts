import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import {UsersService} from "../users/services/users/users.service.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../typeorm/index.js";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local.strategy.js";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {JwtRefreshStrategy} from "./strategies/jwt-refresh.strategy.js";

import {JwtAccessStrategy} from "./strategies/jwt-access.strategy.js";

import {EmailModule} from "../email/email.module.js";

import {Token} from "../typeorm/Token.entity.js";
import {GoogleOauth2Strategy} from "./strategies/google-oauth2.strategy.js";

@Module({
  controllers: [AuthController],
  providers: [
      AuthService,
      UsersService,
      LocalStrategy,
      JwtRefreshStrategy,
      JwtAccessStrategy,
      GoogleOauth2Strategy,
      JwtService,




  ],
  imports:[
      TypeOrmModule.forFeature([User, Token]),
      PassportModule.register({session:true}),
      JwtModule,
      EmailModule
  ]

})
export class AuthModule {}
