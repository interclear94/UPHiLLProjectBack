import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "../user.service";

export class UserGuard implements CanActivate {
    constructor(private readonly userService: UserService) {

    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { cookies: { token } } = context.switchToHttp().getRequest();
        if (!token) {
            throw new UnauthorizedException('토큰이 없어용 ,,')
        }

        const user = this.userService.verifyToken(token);
        console.log(user, 'guard');
        return true;
    }
}
