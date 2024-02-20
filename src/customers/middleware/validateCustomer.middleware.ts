import {HttpStatus, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class ValidateCustomerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): any {
        console.log("Hello world, I'm inside validateCustomer middleware");
        const auth = req.headers.authorization;
        if(!auth || !auth.startsWith("Bearer")) {
            return res.status(HttpStatus.FORBIDDEN).json({message:"No auth token provided"});
        }
        const token = auth.split(" ")[1];
        if(token !== "123") {
            return res.status(HttpStatus.UNAUTHORIZED).json({message:"Unauthorized"});
        }
        next()

    }
}