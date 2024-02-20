import {BadRequestException, createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Request} from "express";
export interface Sorting  {
    property:string;
    direction:string;
}
export const sortingParams = createParamDecorator((validParams, ctx:ExecutionContext) => {
    const req:Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if(!sort) return null;
    if(typeof validParams !== "object") throw new BadRequestException("Invalid sort args");
    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if(!sort.match(sortPattern)) throw new BadRequestException("Invalid sort params");
    const [property, direction] = sort.split(":");
    if(!validParams.includes(property)) throw new BadRequestException("Invalid sort property: " + property);
    return {property, direction};

})