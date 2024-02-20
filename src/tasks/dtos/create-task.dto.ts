import {
    IsArray,
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";

export class CreateTaskDto {

    @IsString()
    @MinLength(1)
    @MaxLength(30)
    title:string;

    @IsString()
    @IsOptional()
    description?:string

    @IsDateString()
    @IsOptional()
    dueDate?:Date

    @IsNumber()
    @IsNotEmpty()
    user:number

    @IsArray()
    @IsOptional()
    assignees:number[]

}