import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookie from 'cookie-parser'
import { JwtModule } from '@nestjs/jwt';
import { ShopModule } from './shop/shop.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { AuthCode } from './model/AuthCode.Model';
import { UserModule } from './user/user.module';
import { Dialect } from 'sequelize';
import { User } from './model/User.Model';
import { Product } from './model/Product.Model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DATABASE_TYPE as Dialect,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      autoLoadModels: true,
      synchronize: true
    }), SequelizeModule.forFeature([AuthCode, User, Product]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: "30m"
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "static")
    }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: "30m"
      }
    }),
    ShopModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookie).forRoutes("*");
  }
}
