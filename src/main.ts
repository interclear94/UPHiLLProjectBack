import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ["http://127.0.0.1:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  })

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("UPHiLL API")
    .setDescription("UPHiLL API문서")
    .addTag("카카오")
    .addTag("User")
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
  // Swagger 설정

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(4000);
}

bootstrap();