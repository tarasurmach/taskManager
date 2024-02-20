import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn} from "typeorm";
import {User} from "./User.entity.js";


@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({nullable:true})
    token:string;

    @CreateDateColumn({name:"createdAt"})
    createdAt:Date

    @ManyToOne(()=> User)
    @JoinColumn({name:"userId"})
    user:User

    get isValid() {
        const now = new Date().getTime();
        const validity = 10 * 60 * 1000;
        const createdAt = this.createdAt.getTime();
        return (now - createdAt) < validity
    }
}