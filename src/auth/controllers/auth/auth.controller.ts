import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {LocalAuthGuard} from "../../guards/local-auth.guard.js";
import {Request, Response} from "express";
import {AuthService} from "../../services/auth/auth.service.js";
import {CreateUserDto} from "../../../users/dtos/CreateUser.dto.js";
import {SerializedUser} from "../../../users/types/index.js";
import {RefreshTokenGuard} from "../../guards/refresh-token.guard.js";
import {ForgotPasswordDto} from "../../dto/forgot-password.dto.js";
import {ResetPasswordDto} from "../../dto/reset-password.dto.js";
import {NewPasswordDto} from "../../dto/new-password.dto.js";
import {AccessTokenGuard} from "../../guards/access-token.guard.js";
import {User} from "../../../utils/decorators/current-user.decorator.js";
import {GoogleOauth2Guard} from "../../guards/google-oauth2.guard.js";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ) {
    }


    @Post("/login")
    @UseGuards(LocalAuthGuard)
    private async login(@User() user:SerializedUser, @Res() res: Response) {
        console.log(user)

        const {result, refreshToken, accessToken} = await this.authService.logIn(user);
        res
            .cookie("token", refreshToken, {httpOnly:true, maxAge:7 * 24 * 60 * 60 *1000})
            .status(HttpStatus.OK).json({result:{...result, accessToken}});
    }
    @Post("/register")
    private async signUp(@Body() body : CreateUserDto, @Res() res:Response) {
        const {result, refreshToken, accessToken} = await this.authService.signUp(body);
        res.cookie("token", refreshToken, {httpOnly:true, maxAge:7 * 24 * 60 * 60 *1000}).status(HttpStatus.OK).json({result:{...result, accessToken}});

    }

    @Get("/refresh")
    @UseGuards(RefreshTokenGuard)
    private async refresh(@Req() req: Request) {
        console.log("req user");
        console.log(req.user)
        return {result: await this.authService.refresh(req.user as {username:string})}
    }

    @Get("/email")
    private async sendEmail(@Body("email") email:string) {
        return this.authService.sendEmail(email)
    }
    @Post("/reset/:userId/:token")
    @UsePipes(ValidationPipe)
    private async resetPassword(@Body() body:ResetPasswordDto, @Param("userId") userId:string, @Param("token") token:string) {
        return this.authService.resetPassword({...body, userId, token})
    }
    @Post("/forgot")
    @UsePipes(ValidationPipe)
    private async forgotPassword(@Body() {email}:ForgotPasswordDto) {
        this.authService.forgotPassword(email).then();
    }
    @UseGuards(AccessTokenGuard)
    @Post("/new-password")
    @UsePipes(ValidationPipe)
    private newPassword(@Body() body: NewPasswordDto, @User("userId") userId:number) {
        return this.authService.newPassword( body, userId)
    }

    @Get("/google/login")
    @UseGuards(GoogleOauth2Guard)
    private async handleLogin() {
        return {msg:"Google auth!"}
    }

    @Get("/google/redirect")
    @UseGuards(GoogleOauth2Guard)
    private async googleRedirect(@User() user:SerializedUser, @Res() res:Response) {
        const {result, refreshToken, accessToken} = await this.authService.logIn(user );
        res.cookie("token", refreshToken, {httpOnly:true, maxAge:7 * 24 * 60 * 60 *1000})
            .status(HttpStatus.OK).json({result:{...result, accessToken}});

    }
}
