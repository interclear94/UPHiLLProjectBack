import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [process.env.ENV === "development" ? "http://locahost:3000" : "http://aws주소"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  })

  // Swagger 설정
  const config = new DocumentBuilder().setTitle("ergani API").setDescription("ergani api 문서입니다.").addTag("User").addTag("Post").addTag("Comment").addTag("Reply").addTag("PostLikes").addTag("CommentLikes").addTag("ReplyLikes").addBearerAuth(
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

  await app.listen(3000);
}
bootstrap();
