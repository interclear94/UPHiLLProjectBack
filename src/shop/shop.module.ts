import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Avatar } from 'src/model/Avatar.Model';
import { Product } from 'src/model/Product.Model';
import { UploadService } from './upload/shop.upload';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/model/User.Model';
import { Order } from 'src/model/Order.model';
import { MulterModule } from '@nestjs/platform-express';
import { ProductInfoPipe } from 'src/shop/pipe/product.pipe';
import { AuthCode } from 'src/model/AuthCode.Model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forFeature([Avatar, Product, User, Order, AuthCode]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: "30m"
      }
    }),
    MulterModule.registerAsync({
      useClass: UploadService
    })],
  controllers: [ShopController],
  providers: [ShopService, ProductInfoPipe],
})
export class ShopModule { }
