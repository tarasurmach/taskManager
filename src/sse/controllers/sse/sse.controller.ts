import {Controller, Sse, UseGuards} from '@nestjs/common';
import {SseService} from "../../services/sse/sse.service.js";
import {AccessTokenGuard} from "../../../auth/guards/access-token.guard.js";
import {User} from "../../../utils/decorators/current-user.decorator.js";
import {finalize, map} from "rxjs";


@Controller('sse')
export class SseController {
    constructor(private readonly sseService:SseService) {
    }

    @Sse("/notifications")
    @UseGuards(AccessTokenGuard)
    getNotifications(@User("userId") userId:string) {
        let count = 0;
        const subject = this.sseService.addClient(userId);
        setInterval(()=>{
            subject.next(JSON.stringify({data:count++}))
        }, 1500);

        return subject.asObservable().pipe(map((data:string)=>{
            return JSON.stringify(data)
        }), finalize(()=>{
            this.sseService.removeClient(userId);
            subject.complete();
        }))
    }
}
