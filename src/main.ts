import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
        origin: ["http://localhost:3000", "http://localhost:5500", "http://192.168.0.166:3000"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    })

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle("UPHiLL API")
        .setDescription("UPHiLL API문서")
        .addTag("shop")
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                name: 'JWT',
                in: 'header',
            },
            'access-token',
        ).build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(4000);
}
bootstrap();
