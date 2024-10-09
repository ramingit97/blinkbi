import { ContainerModule, interfaces } from "inversify";
import { TYPES } from "../../types";
import { CustomerService } from "./customers.service";
import { CustomerRepository } from "./customers.repo";
import { CustomerController } from "./customers.controller";
const customerModule = new ContainerModule((bind:interfaces.Bind)=>{
    bind<CustomerController>(TYPES.CustomerController).to(CustomerController)
    bind<CustomerService>(TYPES.CustomerService).to(CustomerService)
    bind<CustomerRepository>(TYPES.CustomerRepo).to(CustomerRepository)
})

export default {
    module:customerModule,
    controllers:[CustomerController]
}