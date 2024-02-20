import {IsEmail, IsNumber, IsString, Min, MinLength} from "class-validator";

export class CreateCustomerDto {
    @IsNumber()
    readonly id:number;
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(6)
    name:string;

}