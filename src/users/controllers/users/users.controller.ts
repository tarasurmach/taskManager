import {
    Body, ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param, ParseIntPipe,
    Post,
    Res, UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe,

} from '@nestjs/common';
import {CreateUserDto} from "../../dtos/CreateUser.dto.js";
import {Response} from "express";
import {UsersService} from "../../services/users/users.service.js";
import {SerializedUser} from "../../types/index.js";
import {GoogleOauth2Guard} from "../../../auth/guards/google-oauth2.guard.js";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {
    }
    @Post("/")
    @UsePipes(ValidationPipe)
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const result = await this.userService.createUser(createUserDto);
        console.log(result)
        res.status(HttpStatus.CREATED).json({result})
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("/username/:username")
    getUser(@Param("username") username:string, @Res() res: Response) {
        const result = this.userService.getUser(username);
        if(!result) {
            return res.status(HttpStatus.NOT_FOUND).json({message:"User not found"});
        }
        res.status(HttpStatus.OK).json({result: new SerializedUser()})
    }
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("/:id")
    getUserById(@Param("id", ParseIntPipe) id:number, @Res() res:Response) {
        const result = this.userService.getUserById(id);
        res.status(200).json({result});

    }
    @Get("/")
    async getAll() {
        const result = await this.userService.getAll()
        console.log(result)
        return result
    }
}
