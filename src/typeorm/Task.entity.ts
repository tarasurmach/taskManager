import {Column, JoinTable, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity.js";


@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @Column({nullable:true})
    description:string

    @Column({type:"timestamp", nullable:true})
    dueDate:Date

    @CreateDateColumn({name:"created_at"})
    createdAt:Date

    @ManyToOne(() => User)
    @JoinColumn({name:"author_id"})
    author:User

    @ManyToMany(()=> User, {cascade:true})
    @JoinTable({
        name:"task_assignee",
        joinColumn:{name:"userId", referencedColumnName:"id"},
        inverseJoinColumn:{name:"assigneeId", referencedColumnName:"id"}
    })
    assignees:User[]
}