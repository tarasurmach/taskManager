import {ArgumentsHost, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";

export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const response = host.switchToHttp().getResponse();
        const status  = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({message:exception.message})
    }
}