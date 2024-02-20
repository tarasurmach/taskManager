import {IsEmail, isEmail, IsNumber, IsString, MinLength} from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsEmail()
    email:string

    @IsString()
    @MinLength(6)
    username:string;


    @IsString()
    @MinLength(8)
    password:string



}