import {PassportStrategy} from "@nestjs/passport";

import {AuthService} from "../services/auth/auth.service.js";
import {Injectable, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly authService:AuthService, readonly config:ConfigService) {

        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:config.get<string>("ACCESS_TOKEN"),

        });
    }
    async validate(payload) {
        if(!payload.userId) throw new InternalServerErrorException()
        const isValid = (await this.authService.verifyToken(+payload.userId));
        if(!isValid) throw new UnauthorizedException("Invalid token");
        console.log("sdassasasas")
        return payload;
    }
}