import {IsNotEmpty, IsNumber} from "class-validator";
import {PrimaryGeneratedColumn} from "typeorm";

export class TokenDto {
    @PrimaryGeneratedColumn()
    id:number;

    @IsNotEmpty()
    @IsNumber()
    userId:number;



}