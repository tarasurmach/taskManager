import {Exclude} from "class-transformer";

export interface User {
    username:string;
    password:string;
}
export interface Payload {
    userId:number,
    username:string
}

export class SerializedUser {
    id:number;
    username:string;
    @Exclude()
    password:string;
    email:string;


}