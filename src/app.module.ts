import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as cookie from 'cookie-parser'
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [SequelizeModule.forRoot({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
      process.env.ENV === "development" ? ".env" : ".env.production"
    ]
  }),

  JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: {
      expiresIn: "30m"
    }
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookie).forRoutes("*")
  }
}
