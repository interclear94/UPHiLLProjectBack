import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { signupSchema, signinSchema, findidSchema, duplication, findpwSchema, updatePwSchema, deleteSchema } from 'src/dto/user.dto';
import { Response } from 'express';
import { UserInterceptor } from './interceptor/user.interceptor';
import { SignInPipe, SignUpPipe } from 'src/pipe/user.pipe';
import { z } from 'zod';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

type signupDTO = z.infer<typeof signupSchema>;
type signinDTO = z.infer<typeof signinSchema>;
type dupliCDTO = z.infer<typeof duplication>;
type findidDTO = z.infer<typeof findidSchema>;
type findpwDTO = z.infer<typeof findpwSchema>;
type updateDTO = z.infer<typeof updatePwSchema>;
type deleteDTO = z.infer<typeof deleteSchema>;

@ApiTags("유저")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // 회원가입
  @Post("signup")
  @ApiOperation({ summary: "회원가입" })
  @ApiConsumes("application/json")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        userName: { type: "string" },
        nickName: { type: "string" },
        birthDate: { type: "string" },
        phoneNumber: { type: "string" },
        password: { type: "string" },
        checkPassword: { type: "string" }
      }
    }
  })
  async signup(@Body(SignUpPipe) signup: signupDTO, @Res() res: Response) {
    try {
      // console.log('signup');
      const result = await this.userService.signup(signup);
      // console.log(result, "result");
      res.send(result);
    } catch (error) {
      // console.error(error);
      throw new BadRequestException(error);
    }
  }

  // 로그인
  @Post("/signin")
  @ApiOperation({ summary: "로그인" })
  @ApiConsumes("application/json")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" }
      }
    }
  })
  async signin(@Body(SignInPipe) signin: signinDTO, @Res() res: Response) {
    try {
      console.log('signin');
      const result = await this.userService.signin(signin);

      const token = this.userService.userToken(result);

      const date = new Date();
      date.setTime(date.getTime() + (5 * 60 * 60 * 1000));

      res.cookie('token', token, { httpOnly: true, expires: date, sameSite: 'none', secure: true, path: '/', domain: 'localhost' });
      res.json({ token })

    } catch (error) {
      throw new BadRequestException('아이디가 맞지 않아요');
    }
  }

  // 카카오 로그인
  @Get("kakao")
  @UseGuards(AuthGuard("kakao"))
  kakaoLogin() { }

  // 카카오 콜백
  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoLoginCallback(@Req() req: any, @Res() res: Response) {
    try {
      const { user } = req;

      const date = new Date();

      await this.userService.signup({
        email: user.id,
        userName: user.username,
        nickName: user._json.properties.nickname,
        birthDate: date,
        phoneNumber: "010-1234-5678",
        password: "",
      })

      const token = this.userService.userToken(user);
      date.setMinutes(date.getMinutes() + 30);
      res.cookie("token", token, { httpOnly: true, expires: date })
      res.send('성공');

    } catch (error) {
      throw new BadRequestException('Kakao Controller Error')
    }
  }

  // 아이디 또는 닉네임 중복검사
  @Post("/duplication")
  @UseInterceptors(UserInterceptor)
  @ApiOperation({ summary: "아이디 또는 닉네임 중복 검사" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        nickName: { type: "string" }
      }
    }
  })
  async duplication(@Body() duplication: dupliCDTO) {
    const data = await this.userService.duplication(duplication);
    console.log(data, 'controller');
    return data
  }

  // 아이디 찾기
  @Post("/findid")
  @ApiOperation({ summary: "아이디 찾기" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        phoneNumber: { type: "string" }
      }
    }
  })
  async findId(@Body() findid: findidDTO) {
    const data = await this.userService.findId(findid)
    console.log(data);
    return data;
  }

  // 비밀번호 찾기
  @Post("/findpw")
  @ApiOperation({ summary: "비밀번호 찾기" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" }
      }
    }
  })
  async findpw(@Body() findpw: findpwDTO) {
    const data = await this.userService.findPw(findpw);
    return data;
  }

  // 비밀번호 수정
  @Put("/mypage")
  @ApiOperation({ summary: "비밀번호 변경" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" }
      }
    }
  })
  async updatePw(@Body() updatepw: updateDTO) {
    const data = await this.userService.updatePw(updatepw);
    console.log(data, 'controller');
    return data;
  }

  // 회원 탈퇴
  @Delete("delete")
  @ApiOperation({ summary: "회원 탈퇴" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        token: { type: "string" }
      }
    }
  })
  async deleteUser(@Body() deleteUser: deleteDTO, @Res() res: Response) {
    try {
      const { token } = deleteUser;
      console.log(token);

      if (!token) {
        throw new BadRequestException('토큰이 없습니다.')
      }

      const result = await this.userService.deleteUser(token);

      res.clearCookie('token');
      return res.json(result);
    } catch (error) {
      throw new BadRequestException(error, 'deleteUser')
    }
  }
}
