import { IToken, ITokenDto, ITokenPayload } from './tokens.interface';
import { Repository } from 'typeorm';
import { injectable,inject } from "inversify";
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { HttpError } from '../errors/http-error.class';
import { TokenEntity } from './tokens.entity';
import { TokenRepository } from './tokens.repo';
import jwt from "jsonwebtoken";
import {  generateDeviceId } from '../users/user.service';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/repo/user.repo';
@injectable()
export class TokenService {

    constructor(
        @inject(TYPES.TokenRepo) private repo:TokenRepository,
        @inject(TYPES.ConfigService) private config:IConfigService,
        @inject(TYPES.UserRepo) private userRepository:UserRepository,
    ) {}

    async findToken(refresh_token:string,deviceId:string){
        let findToken:any = await this.repo.findToken(refresh_token,deviceId)
        return findToken
    }    

    async generateTokens(payload:ITokenPayload){
        const tokens = {
            access_token: await jwt.sign(payload,this.config.get("JWT_ACCESS_SECRET"),{
                expiresIn:this.config.get("ACCESS_EXPIRED")
              }),
              refresh_token: await jwt.sign(payload,this.config.get("JWT_REFRESH_SECRET"),{
                expiresIn:this.config.get("REFRESH_EXPIRED")
              }),
        }
       
        return tokens;
    }

    async saveTokens(data:ITokenDto):Promise<any>{
        // let findToken:TokenEntity|null = await this.repo.findToken(data.refresh_token,data.deviceId);
        // if(findToken){
        //     let res = await this.repo.update(data)
        //     return findToken;
        // }
        
        let saveToken = this.repo.save(data);
        return saveToken;
    }


    async refreshToken(data:{refreshToken:string,deviceId:string}){
        try{
            const decoded:any = await jwt.verify(data.refreshToken,this.config.get("JWT_REFRESH_SECRET"))
            
            let findToken:TokenEntity|null = await this.repo.findToken(data.refreshToken,data.deviceId);
            if(!findToken){
                throw new HttpError(502,'Refresh token expired')
            }
            const deviceId = generateDeviceId();

            let user:User|null = await this.userRepository.findById(decoded.id);

            if(!user){
                throw new HttpError(502,'User not found')
            }

            let newTokens = await this.generateTokens(
                {email:user.email,id:user.id,deviceId}
            )
            return newTokens;
        }
        catch(e){
            console.log('err',e);
            throw new HttpError(502,'Refresh token expired')
        }
    }

}