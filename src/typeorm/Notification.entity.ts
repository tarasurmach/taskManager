import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./User.entity.js";


@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar", nullable:false})
    content:string;

    @ManyToOne(()=> User)
    @JoinColumn({name:"sender"})
    sender:User;

    /*@ManyToMany(()=>User, {cascade:true})
    @JoinTable({
        name:"notification_user",
        joinColumn:{name:"user_id", referencedColumnName:"id"},
        inverseJoinColumn:{name:"notification_id", referencedColumnName:"id"}
    })
    receivers:User[];*/

    @CreateDateColumn({name:"created_at"})
    createdAt:Date

}