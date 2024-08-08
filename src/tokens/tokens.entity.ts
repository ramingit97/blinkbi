import {Entity,Column,PrimaryGeneratedColumn,BaseEntity} from 'typeorm'


@Entity('tokens')
export class TokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    refresh_token:string;

    @Column()
    user_id:number;
    

    @Column()
    deviceId:string;
}