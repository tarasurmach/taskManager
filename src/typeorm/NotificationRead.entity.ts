import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity.js";
import {Notification} from "./Notification.entity.js";

@Entity()
export class NotificationRead {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => User)
    @JoinColumn({name:"user_id"})
    user:User;

    @ManyToOne(() => Notification)
    @JoinColumn({name:"notification_id"})
    notification:Notification;

    @Column({name:"is_read", type:"boolean", default:false})
    isRead:boolean;

}