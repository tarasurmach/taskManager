import {HttpException, HttpStatus} from "@nestjs/common";

export class UserNotFoundException extends HttpException {
    constructor(msg?:string) {
        super(msg ?? "User not found", HttpStatus.BAD_REQUEST);
    }
}