import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const dotenv = require('dotenv')
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ["https://uphillmountain.store"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  })

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("UPHiLL API")
    .setDescription("UPHiLL API문서")
    .addTag("kakao")
    .addTag("user")
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