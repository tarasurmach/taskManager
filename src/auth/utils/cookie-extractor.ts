import {Request} from "express";

export default (request:Request) => {
    return request.cookies["token"]
}