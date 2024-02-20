import { Injectable } from '@nestjs/common';
import {CreateCustomerDto} from "../../dtos/CreateCustomer.dto.js";


@Injectable()
export class CustomersService {
    private users = [{id:1, email:"wtf@gmail.com", name:"Taras", createdAt:new Date()}, {id:2, email:"huh@gmail.com",name:"Break", createdAt:new Date()},]
    findCustomer(userId:number) {
        return this.users.find(({id})=> id === userId)
    }
    findAll() {
        return this.users;
    }
    createCustomer(dto:CreateCustomerDto) {
        const customer = {...dto, createdAt:new Date()};
        this.users.push(customer);
        return customer;
    }

}
