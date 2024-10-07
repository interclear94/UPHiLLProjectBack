import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";


export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const date = new Date();

        const req = context.switchToHttp().getRequest();

        const log = `${req.originalUrl} ${date.toLocaleString}`

        return next.handle().pipe(
            tap(() => {
                const _date = new Date();
                const time = _date.getTime() - date.getTime() + "ms";
                console.log(log, time)
            }),
            map((data) => ({ mykey: "hyeok", data: { id: "hyeok" } }))
        );
    }
}

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     console.log('Before...');

//     const now = Date.now();
//     return next
//       .handle()
//       .pipe(
//         tap(() => console.log(`After... ${Date.now() - now}ms`)),
//       );
//   }
// }