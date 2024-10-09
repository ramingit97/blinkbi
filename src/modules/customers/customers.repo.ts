import { DataSource, Repository, getConnection, getRepository } from "typeorm";
import { inject, injectable } from "inversify";

import { CustomerEntity } from "./customers.entity";
import { HttpError } from "../../errors/http-error.class";

@injectable()
export class CustomerRepository{
    private repo: Repository<CustomerEntity>;

    constructor(@inject(DataSource) dataSource: DataSource) {
      // Получаем репозиторий с помощью getRepository
      this.repo = getRepository(CustomerEntity);
    }


    async createCustomer(user:CustomerEntity){
        let findCustomerWithGsmNumber = await this.repo.findOne({
            where:{gsm_number:user.gsm_number}
        })
        if(findCustomerWithGsmNumber){
            throw new HttpError(403,`Customer with gsm number ${findCustomerWithGsmNumber.gsm_number} found`)
        }
        let res = await this.repo.save(user)
        return res;
    }

    async findAll(){
        return await this.repo.find();
    }

    async findByEmail(email:string){

    }


    async findById(gsm_number:number):Promise<CustomerEntity|null>{
        return await this.repo.findOne({where:{gsm_number}});
    }

    async findUser(id:string){
    }

    async deleteUser(id:string){
    }

    async transfer(gsm_number1:number,gsm_number2:number,amount:number){
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.startTransaction();

        let findCustomer1 = await this.findById(gsm_number1);
        let findCustomer2 = await this.findById(gsm_number2);
        if(!findCustomer1){
            throw new HttpError(404,`Customer with gsm number ${gsm_number1} not found`)
        }
        if(!findCustomer2){
            throw new HttpError(404,`Customer with gsm number ${gsm_number2} not found`)
        }

        if(findCustomer1.balance < amount){
            throw new HttpError(403,`Unsifficent balance : customer ${findCustomer1.name}`)
        }
        
        try {
            await queryRunner.manager.update(CustomerEntity,{
                gsm_number:gsm_number1
            } ,{
                balance:findCustomer1.balance - amount
            });
            await queryRunner.manager.update(CustomerEntity, {
                gsm_number:gsm_number2
            },{
                balance:findCustomer2.balance + amount
            });
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }


    }
}