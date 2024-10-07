import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

export class ProductTypeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const { body, originalUrl } = context.switchToHttp().getRequest();
        const params = originalUrl.split("/");
        const type = params[params.length - 1];
        console.log(type)
        body.type = type
        return next.handle();
    }
}