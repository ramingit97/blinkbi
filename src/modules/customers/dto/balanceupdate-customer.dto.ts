import { IsDateString,IsInt,IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateCustomerBalanceDto{
    @IsNotEmpty()
    @IsNumber({},{message:"Gsm number is not valid"})
    gsm_number:number;

    
    @IsNotEmpty()
    @Min(0)
    @IsNumber({},{message:"Balance is not valid"})
    balance:number;
}