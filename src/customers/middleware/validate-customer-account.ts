import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";

export class ValidateCustomerAccount implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): any {
        
    }
}