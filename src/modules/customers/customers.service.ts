import { ICustomerDto } from './customers.interface';
import { Repository } from 'typeorm';
import { injectable,inject } from "inversify";
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { CustomerRepository } from './customers.repo';
@injectable()
export class CustomerService {
    constructor(
        @inject(TYPES.CustomerRepo) private repo:CustomerRepository,
        @inject(TYPES.ConfigService) private config:IConfigService,
    ) {}

    async findCustomer(gsm_number:number){
        let findToken:any = await this.repo.findById(gsm_number)
        return findToken
    }    

    async findCustomers(){
        return await this.repo.findAll()
    }

    async createCustomer(customer:any){
        const user = await this.repo.createCustomer(customer);
        console.log("user",user);
        return user;
    }
    async topUp(gsm_number:number,amount:number){
        const user = await this.repo.topUp(gsm_number,amount);
        console.log("user",user);
        return user;
    }

    async refund(gsm_number:number,amount:number){
        const user = await this.repo.refund(gsm_number,amount);
        console.log("user",user);
        return user;
    }


    async transfer(gsm_number1:number,gsm_number2:number,amount:number){
        return this.repo.transfer(gsm_number1,gsm_number2,amount);
    }


   

}