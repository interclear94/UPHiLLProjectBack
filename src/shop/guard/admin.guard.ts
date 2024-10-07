import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

/**
 * 관리자의 권한을 확인하여 일반 유저의 접근을 제한
 */
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //const { cookies: { token } } = context.switchToHttp().getRequest();
        try {

            const jwt = new JwtService();

            const userInfo: any = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhbWRpbiIsImF1dGhjb2RlIjoiMDEiLCJpYXQiOjE3Mjc3NzA0MTgsImV4cCI6MTcyNzc3MjIxOH0.pM1niSDr8bFAZpTOFBphQhE0TJI__1HLSnyYjuZxxyU", {
                secret: process.env.JWT_KEY
            })

            if (!userInfo) {
                throw new UnauthorizedException();
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}