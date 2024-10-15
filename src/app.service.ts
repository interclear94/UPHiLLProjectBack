import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AuthCode } from './model/AuthCode.Model';
import { join } from 'path';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { User } from './model/User.Model';
@Injectable()
export class AppService {
  constructor(@InjectModel(AuthCode) private authcode: typeof AuthCode,
    private sequelize: Sequelize, private config: ConfigService, @InjectModel(User) private user: typeof User) {
    const init = async () => {
      this.initAdminCode();
      await this.initAdminUser();
    }
    init();
  }

  /**
   * 초기 관리자 유저의 설정
   */
  async initAdminUser() {
    try {
      const adminId = this.config.get("ADMIN_USER_ID");
      const adminPW = await hash(this.config.get("ADMIN_USER_PASSWORD"), 10);
      const admin = await this.user.findOne({ where: { userid: adminId } });
      if (!admin) {
        await this.user.create({
          userid: adminId,
          userpw: adminPW,
          auth: 2
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 초기 관리자 유저에 관한 권한 코드 설정
   */
  initAdminCode() {
    try {
      this.authcode.findAll().then((result) => {
        if (result.length === 0) {
          const content = readFileSync(join(__dirname, "static", "sql", "AuthInit.sql"), { encoding: 'utf8' });
          this.sequelize.query(content.toString());
        }
      }).catch((error) => {
        console.error("에러발생", error);
      })
    } catch (error) {
      console.error(error)
    }
  }

}

