import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { signupSchema, signinSchema } from 'src/dto/user.dto';
import { Response } from 'express';
import { UserInterceptor } from './interceptor/user.interceptor';
import { SignInPipe, SignUpPipe } from 'src/pipe/user.pipe';
import { z } from 'zod';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

type signupDTO = z.infer<typeof signupSchema>;
type signinDTO = z.infer<typeof signinSchema>;

@ApiTags("유저")
@UseInterceptors(UserInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // 회원가입
  @Post("/signup")
  @ApiOperation({ summary: "회원가입" })
  @ApiConsumes("multipart/form-data")
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
  async signup(@Body(SignUpPipe) signup: signupDTO, @Req() req: Request, @Res() res: Response) {
    try {
      console.log('signup');
      const result = await this.userService.signup(signup);
      console.log(result, "222")
      res.send(result)
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // 로그인
  @Post("/signin")
  @ApiOperation({ summary: "로그인" })
  async signin(@Body(SignInPipe) signin: signinDTO, @Req() req: Request, @Res() res: Response) {
    try {
      console.log(req.headers, "headers");
      console.log('signin');
      const _result = signinSchema.safeParse(req.body);
      const result = await this.userService.signin(signin);
      console.log(_result);

      const token = await this.userService.userToken(result);

      const date = new Date();
      date.setTime(date.getTime() + (5 * 60 * 60 * 1000));

      res.cookie('token', token, { httpOnly: true, expires: date, sameSite: 'none', secure: true, path: '/', domain: 'localhost' });
      res.json({ token })

    } catch (error) {
      throw new BadRequestException('Login Error');
    }
  }


  @Get("kakao")
  @UseGuards(AuthGuard("kakao"))
  kakaoLogin() { }

  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoLoginCallback(@Req() req, @Res() res: Response) {
    // const { access_token, refresh_token } = await this.userService.getJWT(req.user.kakaoid)
    // res.cookie('accessToken', access_token, {httpOnly:true});
    // res.cookie('refreshToken', refresh_token, {httpOnly:true});
    // res.cookie('isLoggedIn', true, {httpOnly:false});
    // return res.redirect(this.UserServer.get('CLIENT_URL'));
    try {
      console.log(req);
      const { user } = req;

      const token = this.userService.userToken(user);
      const date = new Date();
      date.setMinutes(date.getMinutes() + 30);
      res.cookie("token", token, { httpOnly: true, expires: date })
      res.send();
      // res.cookie(code, code):
      // 쿠키 만들고
      // 리다이렉트 걸기
      // 사용자 정보로 jwt 토큰
    } catch (error) {
      console.error(error)
    }
  }
}
