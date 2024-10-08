import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { signupSchema, signinSchema } from 'src/dto/user.dto';
import { User } from 'src/model/User.Model';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import { KaKaoStrategy } from './kakao.strategy';

type signupDTO = z.infer<typeof signupSchema>;
type signinDTO = z.infer<typeof signinSchema>;

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        private readonly jwt: JwtService,
        @Inject("KAKAO_STRATEGY") private readonly kakaoStrategy: KaKaoStrategy) { }

    // 유저 회원가입
    async signup(signupUser: signupDTO) {
        try {
            const { userid, userpw, nickname, name, phone, birth } = signupUser;

            const salt = 10;
            const password = userpw;
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log(hashedPassword);
            return await this.userModel.create({
                userid, userpw: hashedPassword, nickname, name, phone, birth
            })
        } catch (error) {
            console.log("signup service error")
        }
    }

    // 유저 로그인
    async signin(signinUser: signinDTO) {
        const { userid, userpw } = signinUser;
        const user = await this.userModel.findOne({ where: { userid } });
        const upw = await bcrypt.compare(userpw, user.userpw);
        console.log(user);

        if (!user) {
            throw new BadRequestException('유저 정보가 맞지 많아요')
        }

        if (user.userpw !== userpw) {
            throw new BadRequestException('비밀번호가 맞지 않아요');
        }

        return user;
    }

    // 유저 토큰
    userToken(signin: signinDTO) {
        const { userid, userpw } = signin
        const payload = { userid, userpw }

        // 토큰 생성
        return this.jwt.sign(payload, { expiresIn: 60 * 30 * 1000 });
        // console.log(payload);
        // return {
        //     access_token: this.jwt.sign(signin, { expiresIn: 60 * 30 * 1000 })
        // }
    }

    // 토큰 복호화
    verifyToken(jwt: string) {
        return this.jwt.verify(jwt);
    }

    // async validateKaKao(code: string): Promise<any> {
    //     // const user = await this.kakaoStrategy.validate("","","",code);
    //     // console.log(code);
    //     // return this.userToken(user);

    //     const { access_token, refresh_token, profile } = await this.kakaoStrategy.getKakaoUser(code);
    // }
}
