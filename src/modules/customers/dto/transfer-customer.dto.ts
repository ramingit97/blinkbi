import { IsDateString,IsInt,IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class TransferCustomerDto{
    @IsNotEmpty()
    @IsString({message:"Customer 1 is not valid"})
    gsm_number1:number;

    @IsNotEmpty()
    @IsString({message:"Surname is not valid"})
    gsm_number2:number;

    @IsNotEmpty()
    @IsNumber({},{message:"Gsm number is not valid"})
    amount:number;
}