import {IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class NotificationDto {
    @IsString()
    @IsNotEmpty()

    content:string;

    @IsNumber()
    @IsNotEmpty()
    sender:number;

    @IsNumber({}, {each:true})
    @IsNotEmpty()
    receivers:number[];

    @IsBoolean()
    read:boolean
}