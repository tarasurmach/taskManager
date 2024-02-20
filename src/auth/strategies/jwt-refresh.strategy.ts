import {PassportStrategy} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {AuthService} from "../services/auth/auth.service.js";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Request} from "express";
import cookieExtractor from "../utils/cookie-extractor.js";
import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(configService:ConfigService, private authService:AuthService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: configService.get<string>("REFRESH_TOKEN"),
                passReqToCallback:false,
                ignoreExpiration:false
            }

        );
    }
    async validate(payload:{username:string}) {
        console.log(payload.username +  "--- Refresh payload")
        const isValidToken = !! await this.authService.verifyRefresh(payload.username);
        if(!isValidToken) throw new UnauthorizedException("Invalid refresh token")
        console.log("cvalid")
        return payload;

    }
}