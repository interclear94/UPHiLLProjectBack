import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";


export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const date = new Date();

        const req = context.switchToHttp().getRequest();

        const log = `${req.originalUrl} ${date.toLocaleString}`

        const { type, data } = context.switchToHttp().getRequest().body;

        context.switchToHttp().getRequest().body[type] = data

        return next.handle().pipe(
            tap(() => {
                const _date = new Date();
                const time = _date.getTime() - date.getTime() + "ms";
                console.log(log, time)
            })
        );
    }
}