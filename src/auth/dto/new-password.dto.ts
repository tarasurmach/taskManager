import {IsNotEmpty, IsString} from "class-validator";
import {Match} from "./reset-password.dto.js";


export class NewPasswordDto {
    @IsString()
    @IsNotEmpty()
    oldPassword:string

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    @Match<NewPasswordDto>("password")
    password2:string

}