import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/model/User.Model';
import { JwtModule } from '@nestjs/jwt';
import { KaKaoStrategy } from './kakao.strategy';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(), SequelizeModule.forFeature([User]), JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: {
      expiresIn: "30m"
    }
  })],
  controllers: [UserController],
  providers: [UserService, {
    provide: "KAKAO_STRATEGY",
    useClass: KaKaoStrategy
  }],
})
export class UserModule { }
