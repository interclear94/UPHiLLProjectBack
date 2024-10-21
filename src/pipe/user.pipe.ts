import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { signinSchema, signupSchema, duplication, findidSchema, findpwSchema, updatePwSchema, updateNkSchema, pointStackSchema } from "src/dto/user.dto";

// 회원가입
export class SignUpPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            console.log(value);
            // DTO에서 가져온 스키마로 유효성 검사
            signupSchema.parse(value);
            return value;
        } catch (error) {
            console.log(error)
            throw new BadRequestException(error, 'SignUpPipe');
        }
    }
}

// 로그인
export class SignInPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            console.log(value);
            // DTO에서 가져온 스키마로 유효성 검사
            signinSchema.parse(value);
            return value;
        } catch (error) {
            throw new BadRequestException(error, 'SignInPipe');
        }
    }
}

export class dupliCPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const data = duplication.parse(value);
            console.log(data, 'dupliCPipe', 'data');
            return data;
        } catch (error) {
            throw new BadRequestException(error, 'dupliCPipe');
        }
    }
}

export class findIDPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            findidSchema.parse(value);
            return value;
        } catch (error) {
            throw new BadRequestException(error, 'findIDPipe');
        }
    }
}

export class findPWPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const data = findpwSchema.parse(value);
            console.log(data, 'findPWPipe', 'data')
            return data;
        } catch (error) {
            throw new BadRequestException(error, 'findPWPipe');
        }
    }
}

export class updatePwPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            updatePwSchema.parse(value);
            return value;
        } catch (error) {
            throw new BadRequestException(error, 'updatePwPipe');
        }
    }
}

export class updateNkPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            updateNkSchema.parse(value);
            return value;
        } catch (error) {
            throw new BadRequestException(error, 'updateNkPipe');
        }
    }
}

export class pointStackPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const data = pointStackSchema.parse(value);
            console.log(data, 'pointStackPipe')
            return data
        } catch (error) {
            throw new BadRequestException(error, 'pointStackPipe');
        }
    }
}