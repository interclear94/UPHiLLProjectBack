import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AuthCode } from './model/AuthCode.Model';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class AppService {
  constructor(@InjectModel(AuthCode) private authcode: typeof AuthCode,
    private sequelize: Sequelize) {
    try {
      this.authcode.findAll().then((result) => {
        if (result.length === 0) {
          const content = readFileSync(join(__dirname, "..", "static", "sql", "AuthInit.sql"), { encoding: 'utf8' });
          this.sequelize.query(content.toString());
        }
      }).catch((error) => {
        console.error(error);
      })
    } catch (error) {
      console.error(error)
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
