import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config';
import cookie from 'cookie-parser'
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }), SequelizeModule.forRoot({
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      dialect: process.env.DATABASE_TYPE as Dialect,
      synchronize: true,
      autoLoadModels: true, //process.env.DATABASE_TYPE
    }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: "30m"
      }
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookie).forRoutes("*")
  }
}
