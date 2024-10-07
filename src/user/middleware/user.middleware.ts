import { NestMiddleware } from "@nestjs/common";

export class UserMiddleware implements NestMiddleware {
    use(req: any, res: any, next: (error?: Error | any) => void) {

        console.log(`${req.method} : ${req.originalUrl}`)
        next();
    }
}