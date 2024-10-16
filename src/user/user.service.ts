import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { signupSchema, signinSchema, findidSchema, duplication, findpwSchema, updatePwSchema } from 'src/dto/user.dto';
import { User } from 'src/model/User.Model';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import sequelize from 'sequelize';

type signupDTO = z.infer<typeof signupSchema>;
type signinDTO = z.infer<typeof signinSchema>;
type dupliCDTO = z.infer<typeof duplication>;
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
            const { email, userName, nickName, birthDate, phoneNumber, password } = signupUser;

            const birth = new Date(birthDate);
            const today = new Date();

            if (birth > today) {
                throw new BadRequestException('생년월일은 오늘 이전이어야 합니다.')
            }

            const salt = 10;
            const hashedPassword = await bcrypt.hash(password, salt);
            // console.log(hashedPassword);
            return await this.userModel.create({
                email, userName, nickName, birthDate, phoneNumber, password: hashedPassword
            })
        } catch (error) {
            console.error(error);
            console.log("signup service error");
        }
    }

    // 유저 로그인
    async signin(signinUser: signinDTO) {
        const { email, password } = signinUser;
        const user = await this.userModel.findOne({ where: { email } });
        const upw = await bcrypt.compare(password, user.password);

        if (upw === false) {
            throw new BadRequestException(2);
        }

        return user;
    }

    /**
     * 아이디 또는 닉네임 중복 검사
     * @param user.userid
     * @param user.nickname 
     * @returns userid, nickname
     */
    async duplication(user: dupliCDTO) {
        const Op = sequelize.Op

        const { email = null, nickName = null, phoneNumber = null } = user;

        const data = await this.userModel.findOne({ where: { [Op.or]: [{ email }, { nickName }, { phoneNumber }] } });

        console.log(data, 'data')

        if (data) {
            if (email) {
                throw new BadRequestException("아이디가 중복 되었습니다.")
            }

            if (nickName) {
                throw new BadRequestException("닉네임이 중복 되었습니다.")
            }

            if (phoneNumber) {
                throw new BadRequestException("연락처가 중복 되었습니다.")
            }
        }

        return null;
    }

    // 아이디 찾기, 휴대폰 번호로 조회
    async findId(user: findidDTO) {
        const { phoneNumber } = user
        const data = await this.userModel.findOne({ where: { phoneNumber } })

        if (data) {
            return data.dataValues.email;
        }
        return null;
    }

    // 비밀번호 찾기
    async findPw(user: findpwDTO) {
        const { email } = user;
        const data = await this.userModel.findOne({ where: { email } });

        if (data) {
            return true
        }
        return false;
    }

    // 비밀번호 변경
    async updatePw(user: updateDTO) {
        const { email, password } = user

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword, 'hash');
        const data = await this.userModel.update({ password: hashedPassword }, { where: { email } })
        console.log(data, 'service');
        return data;
    }

    async deleteUser(token: string) {
        try {
            const decodedToken = this.jwt.verify(token);
            console.log(decodedToken);
            const email = decodedToken.email;

            const result = await this.userModel.destroy({ where: { email } })

            if (result === 0) {
                throw new BadRequestException('유저를 찾을 수 없습니다.')
            }

            return { success: true, message: "회원 탈퇴가 완료되었습니다." };
        }
        catch (error) {
            throw new BadRequestException(error, 'deleteUser');
        }
    }

    // 유저 토큰
    userToken(signin: signinDTO) {
        const { email } = signin
        const payload = { email }

        // 토큰 생성
        return this.jwt.sign(payload, { expiresIn: 60 * 30 * 1000 });
    }

    // 토큰 복호화
    verifyToken(jwt: string) {
        return this.jwt.verify(jwt);
    }
}
