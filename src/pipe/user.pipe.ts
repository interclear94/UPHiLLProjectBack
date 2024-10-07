import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
import { signinSchema, signupSchema } from "src/dto/user.dto";
import { Pipe } from "stream";

const regs =
{
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
    password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
}

const loginRegex = (key: string, value: string) => {
    if (!regs[key].test(value)) {
        throw new BadRequestException(`${key} 형식에 맞지 않음`);
    }
}

// 이메일 정규식
export class UserEmailPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
            if (!emailRegex.test(value.userid)) {
                throw new BadRequestException("이메일 양식이 잘못 됐습니다.")
            }
        } catch (error) {
            throw new BadRequestException("User Login DTO Error");
        }
    }
}

// 비밀번호 정규식
export class UserPwdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
            if (!pwdRegex.test(value.userpw)) {
                throw new BadRequestException("비밀번호 양식이 잘못 됐습니다.")
            }
        } catch (error) {
            throw new BadRequestException("User Pwd DTO Error")
        }
    }
}

// 닉네임 조건
export class UserNicknamePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const { nickname } = value
        const result = signupSchema.safeParse({ nickname });
        console.log(result);

        if (!result.success) {
            throw new BadRequestException('닉네임 양식에 맞지 않아요')
        }

        return value;
    }
}

export class UserNamePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const nameRegex = /^[a-zA-Z가-힣\s-]{2,5}$/;
            if (!nameRegex.test(value.name)) {
                throw new BadRequestException("이름을 다시 입력해주세요.")
            }
        } catch (error) {
            throw new BadRequestException('User Name DTO Error')
        }
    }
}

export class UserPhonePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            // const
        } catch (error) {

        }
    }
}

// 로그인 파이프
export class UserSigninPipe implements PipeTransform {
    constructor(private userDTOBody: ZodSchema) { }
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            Object.keys
            Object.keys(value).map(e => {
                loginRegex(e, value[e]);
            })

            // 
            // for (let key of Object.keys(value)) {
            //     emailRegex(key, value[key]);
            // }

            const parseValue = this.userDTOBody.safeParse(value)
            console.log(parseValue)

            if (parseValue.success) {
                return value;
            } else {
                return ("조건에 맞지 않아요.")
            }
        } catch (error) {
            throw new BadRequestException("user login DTO error");
        }
    }
}


// 회원가입 파이프
export class UserSignupPipe implements PipeTransform {
    length: string = null
    constructor(length: string) {
        this.length = length;
    }
    transform(value: any, metadata: ArgumentMetadata) {

    }
}

// 이메일
// 비밀번호
// 


export class SignInPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            // DTO에서 가져온 스키마로 유효성 검사
            signinSchema.parse(value);
            return value;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

export class SignUpPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            signinSchema.parse(value);
            return value;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

}