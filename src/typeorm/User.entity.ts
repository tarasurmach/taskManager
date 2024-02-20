import {Column, Entity,  PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Unique(["email", "username"])
export class User {
    @PrimaryGeneratedColumn({
        type:"int"
    })
    id:number;
    @Column()
    username:string;

    @Column()
    email:string;

    @Column()
    password:string
}