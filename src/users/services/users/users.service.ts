import {HttpException, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../../dtos/CreateUser.dto.js";
import {plainToInstance} from "class-transformer";
import {SerializedUser} from "../../types/index.js";
import {UserNotFoundException} from "../../exceptions/UserNotFound.exception.js";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../typeorm/index.js";
import {Repository, FindOptionsWhere, In} from "typeorm";
import {hash} from "bcrypt";
import {Token} from "../../../typeorm/Token.entity.js";
import {randomBytes, createHash} from "crypto"
import {generateFromEmail} from "unique-username-generator";
import {generate} from "generate-password";


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepo:Repository<User>, @InjectRepository(Token) private readonly tokenRepo:Repository<Token>) {

    }
    async getUser(username:string) {
        const result = await this.userRepo.findOneBy({username});
        if(!result) throw  new HttpException("User with such username doesn't exist", 404);
        return serialized(result)
    }
    async getById(id:number) {
        return this.userRepo.findOneBy({id})
    }
    async getUserById(id:number) {
        const result = await this.userRepo.findOneBy({id});
        if(!result) throw new UserNotFoundException();
        return serialized(result);

    }
    async createUser({username, password, email}:CreateUserDto) {
        const exists = await this.userRepo.findOneBy([{username}, {email}]);
        if(exists) throw new HttpException("User with such username already exists", 409);
        const hashed = await hash(password, 10);
        let result = this.userRepo.create({email, username, password:hashed});
        return this.userRepo.save(result);

    }
    async generateUserFromEmail(email:string) {
        let username:string, exists:boolean=true;
        do {
            username = generateFromEmail(email, 3);
            exists = await this.userRepo.exist({where:{username}})
        }while(exists);
        const password = generate({
            length:12,
            uppercase:true,
            symbols:true,
            lowercase:true
        });
        const hashed = await hash(password, 10);
        const result = this.userRepo.create({email, username, password:hashed});
        await this.userRepo.save(result);
        return {...result, password}

    }
    getAll() {
        return this.userRepo.find()
    }
    async getOne(options:FindOptionsWhere<CreateUserDto>) {
        return serialized(await this.userRepo.findOneBy(options));

    }
    async getOneBy(options:FindOptionsWhere<CreateUserDto&{id:number}>) {
        return this.userRepo.findOneBy(options);

    }

    async getToken(userId:number, token:string) {
        return this.tokenRepo.findOneBy({user:{id:userId}, token});
    }
    async createToken(user:SerializedUser) {
        const token = randomBytes(20).toString("hex");
        const hashed = createHash("sha256").update(token).digest("hex");
        const result = this.tokenRepo.create({token:hashed, user});
        return this.tokenRepo.save(result)

    }

    async updatePassword(user:User, password:string) {
        password = await hash(password, 10);
        user.password = password;
        const result = await this.userRepo.save(user)
        return serialized(result);
    }
    removeToken(token:Token) {
        this.tokenRepo.remove(token).then()
    }
    getByIds(ids:number[]) {
        return this.userRepo.findBy({id:In(ids)})
    }
}

export const serialized = (user:User) => {
    return plainToInstance(SerializedUser, user);
}