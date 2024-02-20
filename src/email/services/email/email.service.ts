import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";

import {OnEvent} from "@nestjs/event-emitter";
import {WelcomeEmail} from "../../../utils/events/email/auth/WelcomeEmail.js";
import {PasswordEmail} from "../../../utils/events/email/auth/PasswordEmail.js";
import {AssignTask} from "../../../utils/events/email/task/AssignTasks.js";
import {User} from "../../../typeorm/index.js";
import {SendCredentials} from "../../../utils/events/email/auth/SendCredentials.js";

@Injectable()
export class EmailService {
    constructor(private readonly mailerService:MailerService) {
    }
    @OnEvent("auth.welcome")
    async sendWelcomeEmail(event:WelcomeEmail) {
        await this.mailerService.sendMail({
            to:event.payload.email,
            subject:"Welcome to Nestjs App",
            template:`Hello... YOU (${event.payload.username})`
        })
    }
    @OnEvent("auth.credentials")
    async sendCredentials({email, username, password}:SendCredentials) {
        await this.mailerService.sendMail({
            to:email,
            subject:"Welcome to Nestjs App",
            html: `
                <p>Hello, ${email.split("@")[0]},</p>
                <p>Welcome to NestJS App! Your account has been created.</p>
                <p>Your temporary password is: <b>${password}</b> </p>
                <p>Your username is: <b>${username}</b> </p>
                <p>You can use these credentials to access our services. You can also change them at your convenience</p>
      `,
        })
    }
    @OnEvent("auth.password")
    async sendForgotPassword({email, url}:PasswordEmail) {
        await this.mailerService.sendMail({
            to:email,
            subject:"Password reset",
            html:`

                <p>Here is your password reset url: </p>
                <b>${url}</b>
            `
        })
    }
    @OnEvent("task.assign")
    async sendAssignedTask(obj:AssignTask&User) {
        console.log(obj)
        await this.mailerService.sendMail({
            to:obj.email,
            subject: "New task assigned",
            html: `
                <h3>You were assigned a new task</h3>
                <div> 
                <p>Task title: ${obj.title}</p>
                <br>
                <p>Assigned by: ${obj.author}</p>
                ${obj.dueDate && `<p>Due date: ${obj.dueDate.toString()}</p>`}}
                </div>
            `
        })
    }


}
