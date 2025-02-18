import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import jwt from "jsonwebtoken"






@Injectable()
export class Protect implements CanActivate{
    constructor(private jwtservice: JwtService){}
    async canActivate(context: ExecutionContext):  Promise<boolean>  {

        const request = context.switchToHttp().getRequest()
        const token = request.headers.authorization?.split(' ')[1]
        if(!token){
            throw new UnauthorizedException('u dont have permission')
        }
        try {
            const payload = await this.jwtservice.verify(token, { 
                ignoreExpiration: false,
            });
            request.userId = payload.userId;
            console.log('Token is valid');
            return true;
          } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
        //return true
    }
}