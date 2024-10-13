import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { signupSchema, signinSchema, findidSchema, dupliEmail, dupliNickname, findpwSchema, updatePwSchema, deleteSchema } from 'src/dto/user.dto';
import { Request, Response } from 'express';
import { UserInterceptor } from './interceptor/user.interceptor';
import { SignInPipe, SignUpPipe } from 'src/pipe/user.pipe';
import { z } from 'zod';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

type signupDTO = z.infer<typeof signupSchema>;
type signinDTO = z.infer<typeof signinSchema>;
type dupliEDTO = z.infer<typeof dupliEmail>;
type dupliNDTO = z.infer<typeof dupliNickname>;
type findidDTO = z.infer<typeof findidSchema>;
type findpwDTO = z.infer<typeof findpwSchema>;
type updateDTO = z.infer<typeof updatePwSchema>;
type deleteDTO = z.infer<typeof deleteSchema>;

@ApiTags("유저")
@UseInterceptors(UserInterceptor)
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
        userid: { type: "string" },
        userpw: { type: "string" },
        nickname: { type: "string" },
        name: { type: "string" },
        phone: { type: "string" },
        birth: { type: "string" }
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
        userid: { type: "string" },
        userpw: { type: "string" }
      }
    }
  })
  async signin(@Body(SignInPipe) signin: signinDTO, @Req() req: Request, @Res() res: Response) {
    try {
      console.log('signin');
      const result = await this.userService.signin(signin);
      // console.log(result, "result");

      const token = this.userService.userToken(result);
      // console.log(token, "token");

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
      const result = await this.userService.signup({
        userid: user.id,
        userpw: "",
        nickname: "",
        name: user.username,
        phone: "",
        birth: "",
      })
      console.log(user, "kakaoUser");
      console.log(result, 'result');

      const token = this.userService.userToken(user);
      const date = new Date();
      date.setMinutes(date.getMinutes() + 30);
      res.cookie("token", token, { httpOnly: true, expires: date })
      res.send();
      // 로그인 후 창으로 넘어가야 함(send, redirect)
      // 사용자 정보로 jwt 토큰
    } catch (error) {
      console.error(error)
      throw new BadRequestException('KaKaO Login Error')
    }
  }

  // 아이디 중복검사
  @Post("/duplication/userid")
  @ApiOperation({ summary: "아이디 중복 검사" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userid: { type: "string" }
      }
    }
  })
  async dupliEmail(@Body() findEmail: dupliEDTO) {
    const data = await this.userService.dupliEmail(findEmail);
    console.log(data, 'controller');
    return data
  }

  // 닉네임 중복검사
  @Post("/duplication/nickname")
  @ApiOperation({ summary: "닉네임 중복 검사" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        nickname: { type: "string" }
      }
    }
  })
  async duplinickname(@Body() findNickname: dupliNDTO) {
    const data = await this.userService.dupliNickName(findNickname);
    console.log(data);
    return data;
  }

  // 아이디 찾기
  @Post("/findid")
  @ApiOperation({ summary: "아이디 찾기" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        phone: { type: "string" }
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
        userid: { type: "string" }
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
        userid: { type: "string" },
        userpw: { type: "string" }
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
