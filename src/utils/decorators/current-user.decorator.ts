import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const User = createParamDecorator(
    (data:unknown, ctx:ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return typeof data === "string" ? request.user[data] : request.user;
    }
)