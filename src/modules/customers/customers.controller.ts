import { Response,Request,NextFunction,CookieOptions} from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../../common/base.controller";
import { ILogger } from "../../logger/logger.interface";
import { TYPES } from "../../types";
import { IConfigService } from "../../config/config.service.interface";
import Controller from "../../utils/controller.decorator";
import { Get, Post } from "../../utils/handlers.decorator";
import { CustomerService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { ValidateMiddleware } from "../../common/validate.middleware";
import { Middleware } from "../../utils/middleware.decorator";
import { TransferCustomerDto } from "./dto/transfer-customer.dto";

@injectable()
@Controller("/customers")
export class CustomerController extends BaseController{
    constructor(
        @inject(TYPES.ILogger) private logger:ILogger,
        @inject(TYPES.CustomerService) private service:CustomerService,
        @inject(TYPES.ConfigService) private config:IConfigService
    ){
        super();
    }

    @Get("/list")
    async allCustomers(req:Request,res:Response,next:NextFunction){
        let result = await this.service.findCustomers();
        return result;
    }

    @Get("/:id")
    async findOneCustomer(req:Request,res:Response,next:NextFunction){
        const {id} = req.params; 
        return this.service.findCustomer(+id);
    }

    @Post("/create")
    @Middleware([new ValidateMiddleware(CreateCustomerDto)])
    async create({body}:Request<{},{},CreateCustomerDto>,res:Response,next:NextFunction){
        const result = await this.service.createCustomer(body);
        return ({
            message:"Customer created successfully",
            data:result
        });
    }

    @Post("/transfer")
    @Middleware([new ValidateMiddleware(TransferCustomerDto)])
    async transfer({body}:Request<{},{},TransferCustomerDto>,res:Response,next:NextFunction){
        await this.service.transfer(+body.gsm_number1,+body.gsm_number2,body.amount)
        return {
            message:`Transfer successfully from ${body.gsm_number1} to ${body.gsm_number2}`
        }
    }

}