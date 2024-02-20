import {Injectable, OnModuleDestroy, MessageEvent, BadRequestException} from '@nestjs/common';
import {EventEmitter2, OnEvent} from "@nestjs/event-emitter";
import {Subject} from "rxjs";
import {NotifyTask} from "../../../utils/events/sse/task/NotifyTask.js";

@Injectable()
export class SseService implements OnModuleDestroy {
    private readonly clients: Map<string, Subject<MessageEvent|string>> = new Map();

    constructor() {

    }
    addClient(clientId:string) {
        const subject = new Subject<string|MessageEvent>()
        this.clients.set(clientId, subject)
        return subject
    }
    removeClient(clientId:string) {
        const subject = this.clients.get(clientId);
        if(!subject) return;
        subject.complete();
        this.clients.delete(clientId);
    }
    notify(clientId:number, type:string, data:Object) {
        console.log("listener triggered");
        console.log(data)
        const client = this.clients.get(clientId.toString());
        if(!client || !(client instanceof Subject)) return;
        const message:MessageEvent = {
            type,
            data
        };
        client.next(message);
    }
    /*@OnEvent("task.notify")
    emitEvent(event:NotifyTask) {
        console.log("listener triggered");
        console.log(event)
        const {assigneeId, ...rest} = event;
        const subject = this.clients.get(assigneeId);
        if(!subject || !(subject instanceof Subject)) return;

        const message: MessageEvent = {
            type:"notification",
            data:rest
        }

        subject.next(JSON.stringify(message))
    }*/
    /*emitEvent(clientId:string, eventData:string) {
        const message:MessageEvent = {
            type:"notification",
            data:eventData,

        }
        console.log("emitting event")
        const client = this.clients.get(clientId);
        if(!client || !(client instanceof Subject)) return;
        client.next(message)
    }*/
    onModuleDestroy(): any {
        this.clients.forEach(client => {
            client.complete();
        })
    }
    activeClients() {
        return this.clients
    }

}
