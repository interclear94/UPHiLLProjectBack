import { BadRequestException, Injectable, Put, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Avatar } from 'src/model/Avatar.Model';
import { Product } from 'src/model/Product.Model';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/User.Model';
import { Order } from 'src/model/Order.model';
import { AuthCode } from 'src/model/AuthCode.Model';
import { rmSync, readFileSync } from 'fs'
import { Sequelize } from 'sequelize-typescript';
import { join } from 'path';

const ItemCount = 12;

@Injectable()
export class ShopService {
    constructor(@InjectModel(Product) private product: typeof Product,
        @InjectModel(Avatar) private avatar: typeof Product,
        @InjectModel(User) private user: typeof User,
        @InjectModel(Order) private order: typeof Order,
        private jwt: JwtService
    ) { }


    /**
     * 특정 상품의 총 갯수 조회
     * @param type 
     * @returns 
     */
    async getPage(type: string) {
        try {
            const totalPage = Math.ceil(await this.product.count({ where: { type } }) / ItemCount);
            return totalPage;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }


    /**
     * 타입에 따른 모든 상품리스트
     * @param type
     * @returns productList || null
     */
    async findAll(type: string, page = 1 as number, token: string) {
        try {
            const { email } = this.jwt.verify(token);
            return await this.product.findAll({
                where: { type },
                offset: Number((page - 1) * ItemCount),
                limit: ItemCount,
                include: [{
                    model: Order,
                    required: false,
                    where: { email }
                }]
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    /**
     * 유저가 보유한 상품
     * @param type
     * @returns productList || null
     */
    async myStorage(type: string, page = 1 as number, usage: boolean) {
        try {
            //const { email } = this.jwt.verify(token);
            console.log(usage)
            const data = await this.order.findAll({
                where: { email: 'user', usage },
                offset: Number((page - 1) * ItemCount),
                limit: ItemCount,
                include: [{
                    model: Product,
                    where: { type },
                }],
            });
            console.log(data)
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * 조회한 상품의 상세내용
     * @param id 
     * @returns 
     */
    async findOne(id: number) {
        try {
            return await this.product.findOne({ where: { id } });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * 관리자에 의한 상품 추가
     * 요청한 유저가 관리자 권한이 없다면 에러
     * @param body 
     * @param file 
     */
    async createProduct(token: string, body: any, file: Express.Multer.File) {
        try {
            const { } = this.jwt.verify(token);
            // 권한 확인
            const isAdmin = await this.authCheck('admin');
            if (!isAdmin) {
                throw new UnauthorizedException("current user is not admin");
            }
            body.image = `/imgs/${file.filename}`
            await this.product.create(body);
            console.log("success insert");
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 관리자의 상품 변경
     * 이미지에 관한 정보가 없을 수 있다
     * @param body
     * @Param file
     * @returns boolean
     */
    async updateProduct(body: any, file?: Express.Multer.File) {
        try {
            if (file) {
                body.img = file.filename;
            }
            await this.product.update(body, { where: { id: body.productId } });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }

    }
    /**
     * 관리되지 않는 상품을 삭제
     * @param id 
     * @returns boolean
     */
    async deleteProduct(id: number): Promise<boolean> {
        try {
            await this.product.destroy({ where: { id } });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 상품 구매에 의해 사용자 포인트 차감과 구매내역 추가
     * @param token 
     * @param productId 
     * @returns 
     */
    async buy(token: string, productId: number): Promise<boolean> {
        try {
            const { email } = this.tokenVerify(token);

            const date = new Date();
            console.log(productId)
            const { dataValues: userInfo } = await this.user.findOne({ where: { email } });
            const { dataValues: productInfo } = await this.product.findOne({ where: { id: productId } });
            console.log(productInfo.id)
            // 상품 구매에 의한 사용자 포인트 차감
            await this.user.update({ point: parseInt(userInfo.point) - parseInt(productInfo.price) }, { where: { email } })

            // 구매내역 추가
            await this.order.create({
                email,
                data: date,
                productid: productInfo.id,
                price: parseInt(productInfo.price),
            })

            return true;
        } catch (error) {
            console.log(error);
            return false
        }
    }

    /**
     * 토큰 복호화
     * @param token 
     * @returns 
     */
    tokenVerify(token: string): any {
        try {
            const userInfo = this.jwt.verify(token);
            return userInfo;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async authCheck(email: string) {
        try {
            // 권한 확인
            const { dataValues: { authcodes: { dataValues: { dscr } } } } = await this.user.findOne({ where: { email }, include: [AuthCode] })

            if (dscr !== '관리자') {
                return false
            }
            return true
        } catch (error) {
            console.error(error);
        }
    }
    async setUsage(orderId: number) {
        this.order.update({ usage: true }, { where: { id: orderId } })
    }
}
