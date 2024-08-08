import { Repository, getRepository } from "typeorm";
import { inject, injectable } from "inversify";
import { TokenEntity } from "./tokens.entity";
import { ITokenDto } from "./tokens.interface";


@injectable()
export class TokenRepository{
    constructor(private readonly userRepo: Repository<TokenEntity>) {}

    async findToken(refresh_token:string|undefined,deviceId:string){
        let findToken:TokenEntity|null = await TokenEntity.findOne({where:{refresh_token,deviceId}})
        return findToken
    }

    async save(token:ITokenDto){
        let tokenEntity = new TokenEntity()
        Object.assign(tokenEntity,token);
        return await TokenEntity.save(tokenEntity) ;
    }

    async update(data:any){
        let res = await TokenEntity.update({user_id:data.user_id},{refresh_token:data.refresh_token})
        return res;
    }
    
}