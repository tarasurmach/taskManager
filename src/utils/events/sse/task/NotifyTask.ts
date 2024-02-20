import {SerializedUser} from "../../../../users/types/index.js";

export class NotifyTask {
    constructor(public assignees:number[], public taskId:number, public author:SerializedUser, public title:string) {

    }
}

