import {User} from "../../../../typeorm/index.js";

export class AssignTask {
    constructor(public author:string, public title:string, public dueDate:Date, assignee:User, ) {

        for (let key in assignee) {
            this[key] = assignee[key]
        }
    }
}