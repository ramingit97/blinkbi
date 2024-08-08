import { Request,Response,NextFunction } from "express";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { UserRegisterDto } from "../users/dto/register-user.dto";
const multer = require('multer');

import jwt from "jsonwebtoken";
export function simpleMiddleware(req:Request,res:Response,next:NextFunction){
    next();
}

export function simpleMiddleware2(req:Request,res:Response,next:NextFunction){
    next();
}


export function validationMiddleware(req:Request,res:Response,next:NextFunction){
    const instance = plainToClass(UserRegisterDto,req.body);
    validate(instance).then((errors)=>{
        let errorLists:any[] =[]
        if(errors.length){
            errors.map(error=>{
                console.log(error.constraints);
                let r:any = error.constraints
                errorLists.push(...Object.values(r))
            })
            console.log(errorLists,"errorLists");
            res.status(422).send(errorLists)
        }
        else{
            req.body = instance;
            next()
        }
    })
}

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    try {
      const authorization = req.headers.authorization;
      if(!authorization){
        return res.status(401).send("Unathorized error")
      }
 
      const accessToken = authorization.split(' ')[1];
      if(!accessToken){
        return res.status(401).send("Unathorized error")
      }
 

        const userData = jwt.verify(accessToken,"JWT_ACCESS_SECRET")
      
      req.user = userData;
       next();
    } 
    catch (error) {
        res.status(401).send("Unathorized error")
    }
 }


 const multerOptions = () => {

    const multerStorage = multer.memoryStorage();
  
    const multerFilter = function (req:any, file:any, cb:any) {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        console.log('1212');
        
        // cb(new ApiError('Only Images allowed', 400), false);
      }
    };
  
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  
    return upload;
  };


