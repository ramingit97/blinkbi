import { injectable,inject } from "inversify";
import { UserLoginDto } from "./dto/login-user.dto";
import { UserRepository } from "./repo/user.repo";
import { TYPES } from "../types";
import { HttpError } from "../errors/http-error.class";
import { User } from "./user.entity";
import { TokenService } from "../tokens/tokens.service";
import { IToken } from "../tokens/tokens.interface";
const bcrypt = require("bcrypt");
import { v4 as uuidv4 } from "uuid";


export function generateDeviceId() {
    return uuidv4();;
  }

@injectable()
export class UserService{

    constructor(
        @inject(TYPES.UserRepo) private userRepository:UserRepository,
        @inject(TYPES.TokenService) private tokenService:TokenService,
    
    ) {}

    async createUser(body:any){
        const newUser = new User(body.email,body.name,body.password);
        let res = await this.registration(newUser);
        return res;
    }

    async login(userData:UserLoginDto){
        const deviceId = generateDeviceId();
        const user = await this.validate(userData.email,userData.password);
        console.log('user',user);
        
        let tokens:IToken = await this.tokenService.generateTokens({email:userData.email,id:user.id,deviceId})
        await this.tokenService.saveTokens({
            deviceId,
            user_id:user.id,
            refresh_token:tokens.refresh_token
        })
        return {
            ...tokens,
            deviceId
        };
    }

    async registration(userData:User){
        const candidate = await this.userRepository.findByEmail(userData.email);
        if(candidate){
            throw new HttpError(404,'User with email already exists')
        }
        const hashPassword = await bcrypt.hash(userData.password,3);
        const newUser = new User(userData.email,userData.name,userData.password);
        await newUser.setPassword(userData.password,10)
        
        const user = await this.userRepository.createUser(newUser);

        const tokens = await this.tokenService.generateTokens({...newUser});
        await this.tokenService.saveTokens({
            deviceId:generateDeviceId(),
            user_id:newUser.id,
            refresh_token:tokens.refresh_token
        })
        return {user:newUser,...tokens}
    }


    async allUsers(){
        return this.userRepository.findAll(); 
        // throw new Error("Errrorrorro cixdi");
    }

    async getUserById(id:number){
        let findUser =await this.userRepository.findById(id); 
        if(!findUser){
            throw new HttpError(404,'User not found')
        }
        return findUser;
    }

    async validate(email:string,password:string){
        const user = await this.userRepository.findUser(email);
        if(!user){
            throw new HttpError(404,"User with email not found")
        }

        const userEntity = await new User(user.email,user.name,user.password);
        await userEntity.setHashPassword(user.password);
        const isCorrectPassword = await userEntity.validatePassword(password);
        if(!isCorrectPassword){
            throw new HttpError(404,"User with email not found")
        }
        return user;
    }



    async refreshToken(data:{refreshToken:string,deviceId:string}){
        return this.tokenService.refreshToken(data)
    }


    validateUser: (dto: UserLoginDto) => true
}