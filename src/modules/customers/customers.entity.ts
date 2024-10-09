import {Entity,Column,PrimaryGeneratedColumn,BaseEntity,ObjectIdColumn} from 'typeorm'
import { v4 as uuidv4 } from 'uuid';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
    @ObjectIdColumn({type:"uuid"})
    id:string;

    @Column({name:"name"})
    name:string;

    @Column({name:"surname"})
    surmame:string;

    @Column({type:"date",name:"birth_date"})
    birth_date:Date;

    @Column({type:"number",name:"gsm_number"})
    gsm_number:number;


    @Column({type:"number",default:100})
    balance:number;
    
}