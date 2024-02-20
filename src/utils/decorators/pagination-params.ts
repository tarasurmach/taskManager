import {BadRequestException, createParamDecorator, ExecutionContext} from "@nestjs/common";


export interface PaginationParams {
    page:number;
    offset:number;
    limit:number;
    size:number;
}
export const paginationParams = createParamDecorator((_, ctx:ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string) ?? 1;
    const size = parseInt(req.query.size as string) ?? 10;

    if(isNaN(page) || page < 0 || isNaN(size) || size < 0) {
        throw new BadRequestException("Invalid pagination params");
    }
    if(size > 100) {
        throw new BadRequestException("Invalid pagination params: Max size(100) exceeded");
    }
    const offset = (page - 1) * size;
    return {page, offset, limit:size, size}
})