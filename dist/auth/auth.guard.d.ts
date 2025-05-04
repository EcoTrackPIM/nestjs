import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
export declare class Protect implements CanActivate {
    private jwtservice;
    constructor(jwtservice: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
