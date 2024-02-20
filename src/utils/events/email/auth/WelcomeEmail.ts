import {SerializedUser} from "../../../../users/types/index.js";

export class WelcomeEmail {
    constructor(public payload:SerializedUser) {
    }
}