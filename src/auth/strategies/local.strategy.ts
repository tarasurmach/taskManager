import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../services/auth/auth.service.js";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
        super();


    }
    async validate(username:string, password:string) {
        console.log("huh?? : " + username + password)
        const user = await this.authService.validateUser({username, password});
        if(!user) throw new UnauthorizedException();
        return user;
    }

}