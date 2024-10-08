import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { signupSchema, signinSchema, findidSchema, dupliEmail, dupliNickname, findpwSchema, updatePwSchema } from 'src/dto/user.dto';
import { User } from 'src/model/User.Model';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';

type signupDTO = z.infer<typeof signupSchema>;
type signinDTO = z.infer<typeof signinSchema>;
type dupliEDTO = z.infer<typeof dupliEmail>;
type dupliNDTO = z.infer<typeof dupliNickname>;
type findidDTO = z.infer<typeof findidSchema>;
type findpwDTO = z.infer<typeof findpwSchema>;
type updateDTO = z.infer<typeof updatePwSchema>;

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        private readonly jwt: JwtService) { }

    // 유저 회원가입
    async signup(signupUser: signupDTO) {
        try {
            const { userid, userpw, nickname, name, phone, birth } = signupUser;

            console.log(userid);
            const dupliNickname = await this.userModel.findOne({ where: { nickname } });
            console.log(dupliNickname);

            if (dupliNickname) {
                throw new BadRequestException("이미 가입 되어 있는 닉네임 정보 입니다.");
            }

            const salt = 10;
            const password = userpw;
            const hashedPassword = await bcrypt.hash(password, salt);
            // console.log(hashedPassword);
            return await this.userModel.create({
                userid, userpw: hashedPassword, nickname, name, phone, birth
            })
        } catch (error) {
            console.error(error);
            console.log("signup service error");
        }
    }

    // 유저 로그인
    async signin(signinUser: signinDTO) {
        const { userid, userpw } = signinUser;
        const user = await this.userModel.findOne({ where: { userid } });
        const upw = await bcrypt.compare(userpw, user.userpw);
        // console.log(userpw);
        // console.log(user.userpw);
        // console.log(upw);

        if (!user) {
            throw new BadRequestException('유저 정보가 맞지 많아요')
        }

        if (!upw) {
            throw new BadRequestException('비밀번호가 맞지 않아요');
        }

        return user;
    }

    // 아이디 중복 검사
    async dupliEmail(user: dupliEDTO) {
        const { userid } = user;
        const data = await this.userModel.findOne({ where: { userid } });
        console.log(data, 'data')

        if (data) {
            return data.dataValues.userid;
        }
        return null;
    }

    // 닉네임 중복 검사
    async dupliNickName(user: dupliNDTO) {
        const { nickname } = user;
        const data = await this.userModel.findOne({ where: { nickname } });
        console.log(data, 'service')

        if (data) {
            return data.dataValues.nickname;
        }
        return null;
    }

    // 아이디 찾기, 휴대폰 번호로 조회
    async findId(user: findidDTO) {
        const { phone } = user
        const data = await this.userModel.findOne({ where: { phone } })

        if (data) {
            return data.dataValues.userid;
        }
        return null;
    }

    // 비밀번호 찾기
    async findPw(user: findpwDTO) {
        const { userid } = user;
        const data = await this.userModel.findOne({ where: { userid } });

        if (data) {
            return true
        }
        return false;
    }

    // 비밀번호 변경
    async updatePw(user: updateDTO) {
        const { userid, userpw } = user

        const salt = 10;
        const password = userpw;
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword, 'hash');
        const data = await this.userModel.update({ userpw: hashedPassword }, { where: { userid } })
        console.log(data, 'service');
        return data;
    }

    // 유저 토큰
    userToken(signin: signinDTO) {
        const { userid } = signin
        const payload = { userid }

        // 토큰 생성
        return this.jwt.sign(payload, { expiresIn: 60 * 30 * 1000 });
    }

    // 토큰 복호화
    verifyToken(jwt: string) {
        return this.jwt.verify(jwt);
    }
}
