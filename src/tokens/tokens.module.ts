import { ContainerModule, interfaces } from "inversify";
import { TYPES } from "../types";
import { Repository, getRepository } from "typeorm";
import { TokenEntity } from "./tokens.entity";
import { TokenService } from "./tokens.service";
import { TokenRepository } from "./tokens.repo";
const userModule = new ContainerModule((bind:interfaces.Bind)=>{
    bind<TokenService>(TYPES.TokenService).to(TokenService)
    bind<TokenRepository>(TYPES.TokenRepo).to(TokenRepository)


})

export default {
    module:userModule
}