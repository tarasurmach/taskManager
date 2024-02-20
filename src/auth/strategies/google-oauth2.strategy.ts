import {PassportStrategy} from "@nestjs/passport";
import {Profile, Strategy, VerifyCallback} from "passport-google-oauth20"
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import {AuthService} from "../services/auth/auth.service.js";
import {serialized} from "../../users/services/users/users.service.js";


@Injectable()
export class GoogleOauth2Strategy extends PassportStrategy(Strategy, "google") {
    constructor(config:ConfigService, private readonly authService:AuthService) {
        super({
            clientID:config.get<string>("Client_ID"),
            clientSecret:config.get<string>("Client_Secret"),
            callbackURL:config.get<string>("Callback_URL"),
            scope:["profile", "email"]
        });
    }
    async validate(accessToken:string, refreshToken:string, profile:Profile, done:VerifyCallback) {
        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile);
        const email = profile.emails[0].value;
        const result = await this.authService.validateUserByEmail(email);
        console.log("before result/user")
        if(result) {
            console.log("Result:")
            console.log(result)
            done(null, serialized(result) );
        }else {

            console.log("New user:")
            const newUser = await this.authService.createNewUser(email);
            console.log(newUser)
            if(newUser) done(null, serialized(newUser))
        }




    }
}