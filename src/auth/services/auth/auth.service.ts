import {
    BadRequestException,
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {serialized, UsersService} from "../../../users/services/users/users.service.js";
import {CreateUserDto} from "../../../users/dtos/CreateUser.dto.js";
import {SerializedUser, User} from "../../../users/types/index.js";
import {compare} from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {EventEmitter2} from "@nestjs/event-emitter";
import {WelcomeEmail} from "../../../utils/events/email/auth/WelcomeEmail.js";
import {PasswordEmail} from "../../../utils/events/email/auth/PasswordEmail.js";
import {NewPasswordDto} from "../../dto/new-password.dto.js";
import {SendCredentials} from "../../../utils/events/email/auth/SendCredentials.js";

@Injectable()
export class AuthService {
    constructor(private userService:UsersService, private jwtService:JwtService, private config:ConfigService, private readonly eventEmitter:EventEmitter2) {
        console.log(this.eventEmitter)
    }
    async validateUser({username, password}:User) {
        const foundUser = await this.userService.getOneBy({username});
        console.log(foundUser)
        if(!foundUser) throw new HttpException("Such user doesn't exist", 400);
        const match = await compare(password, foundUser.password);
        if(!match) return null;
        return serialized(foundUser);

    }
    async logIn(user: SerializedUser) {
        const [accessToken, refreshToken] = await this.signTokens(user.id.toString(), user.username);
        return {result:user, accessToken, refreshToken};
    }
    async signUp(body:CreateUserDto) {
        const result  = await this.userService.createUser(body);
        if(!result) throw new BadRequestException("Couldn't create new user");
        const [accessToken, refreshToken] = await this.signTokens(result.id.toString(), result.username);

        this.eventEmitter.emit("auth.welcome", new WelcomeEmail(result))
        return {result, accessToken, refreshToken};

    }
    verifyToken(userId:number) {
        if(typeof userId !== "number") throw new UnauthorizedException()
        return this.userService.getUserById(userId )

    }
    verifyRefresh(username:string) {
        return this.userService.getUser(username)
    }
    async sendEmail(email:string) {
        const user = await this.userService.getOne({email});
        if(!user) throw new BadRequestException("User with such email doesn't exist");
        this.eventEmitter.emit("auth.welcome", new WelcomeEmail(user));

    }
    async refresh({username}:{username:string}) {
        const user = await this.userService.getUser(username);
        if(!user) throw new NotFoundException("User not found");
        const accessToken = await this.signToken({username:user.username, userId:user.id}, "ACCESS_TOKEN", "15s");
        return {accessToken, userId:user.id, username:user.username}
    }
    private signToken(payload:Record<string, any>, secret:string, expiresIn="15m") {
        return this.jwtService.signAsync(payload, {secret:this.config.get<string>(secret), expiresIn})
    }
    private signTokens(userId:string, username:string) {
        return Promise.all([
            this.signToken({userId, username}, "ACCESS_TOKEN", "15m"),
            this.signToken({username}, "REFRESH_TOKEN", "1h")
        ])
    }
    async forgotPassword(email:string) {
        const user = await this.userService.getOne({email});
        if(!user) throw new BadRequestException();
        const tokenObj = await this.userService.createToken(user)
        if(!tokenObj) throw new BadRequestException("Error generating token");
        const resetUrl = `http://localhost:3000/auth/password-reset/${tokenObj.token}`
        this.eventEmitter.emit("auth.password", new PasswordEmail(resetUrl, user.email))
    }
    async resetPassword(body:Record<string, string>) {
        const user = await this.userService.getUserById(+body.userId);
        if(!user) throw new BadRequestException("No user found");
        const token = await this.userService.getToken(user.id, body.token);
        if(!token || !token.isValid) throw new BadRequestException("Invalid token");
        this.userService.removeToken(token)
        return this.userService.updatePassword(user, body.password);
    }
    async newPassword(body:NewPasswordDto, id:number) {
        const user = await this.userService.getOneBy({id});
        if(!user) throw new BadRequestException("User not found");
        const match = await compare(body.oldPassword, user.password);
        if(!match) throw new BadRequestException("Incorrect password");
        return this.userService.updatePassword(user, body.password)
    }
    async createNewUser(email:string) {
        const user = await this.userService.generateUserFromEmail(email);
        this.eventEmitter.emit("auth.credentials", new SendCredentials(email, user.username, user.password))
        return user;
    }
    async validateUserByEmail(email:string) {
        return this.userService.getOneBy({email});
    }

}
