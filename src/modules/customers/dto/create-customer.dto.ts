import { IsDateString,IsInt,IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateCustomerDto{
    @IsNotEmpty()
    @IsString({message:"Name is not valid"})
    name:string;

    @IsNotEmpty()
    @IsString({message:"Surname is not valid"})
    surname:string;

    @IsDateString({},{message:"Birthdate is not valid"})
    birth_date:string;
    

    @IsNotEmpty()
    @IsNumber({},{message:"Gsm number is not valid"})
    gsm_number:number;

    
    @IsNotEmpty()
    @Min(0)
    @IsNumber({},{message:"Balance is not valid"})
    balance:number;
}