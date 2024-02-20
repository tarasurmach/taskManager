import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Req,
    Res,
    HttpException,
    Post,
    Body,
    UsePipes,
    ValidationPipe, UseGuards
} from '@nestjs/common';
import {CustomersService} from "../../services/customers/customers.service.js";
import {Request, Response} from "express";
import {CreateCustomerDto} from "../../dtos/CreateCustomer.dto.js";
import {AccessTokenGuard} from "../../../auth/guards/access-token.guard.js";


@Controller('customers')
export class CustomersController {
    constructor(private customerService: CustomersService) {
    }
    @UseGuards(AccessTokenGuard)
    @Get("/")
    getCustomers(@Req() req: Request) {
        console.log("req user:::")
        console.log(req.user)
        console.log(":::req.user")
        return this.customerService.findAll();
    }
    @Get("/:id")
    getCustomer(@Param("id", ParseIntPipe) id:number, @Req() req:Request, @Res() res: Response) {
        const result = this.customerService.findCustomer(id);
        if(result) {
            return res.status(200).json({result});
        }
        throw new HttpException({message:"User not found"}, 404);
    }
    @Post("/")
    @UsePipes(ValidationPipe)
    createCustomer(@Req() req: Request, @Body() createCustomerDto: CreateCustomerDto, @Res() res: Response) {
        console.log(createCustomerDto)
        const result = this.customerService.createCustomer(createCustomerDto);
        if(!result) throw new HttpException({message:"Couldn't create customer"}, 400);
        res.status(200).json({result})
    }
}
