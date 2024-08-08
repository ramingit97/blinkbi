import { injectable } from "inversify";
import Controller from "../utils/controller.decorator";
import { NextFunction, Request, Response } from "express";
import { Get } from "../utils/handlers.decorator";
import { BaseController } from "../common/base.controller";


@injectable()
@Controller("/posts")
export class PostController extends BaseController {
    @Get("")
    async allPosts(req:Request,res:Response,next:NextFunction){
        return [{"ramin":"true"}];
    }
    
  }