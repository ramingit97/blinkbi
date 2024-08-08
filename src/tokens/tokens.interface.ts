export interface IToken{
    access_token:string;
    refresh_token:string;
}


export interface ITokenPayload{
    [key:string]:string| number;
}

export interface ITokenDto{
    deviceId:string,
    user_id:number,
    refresh_token:string
}