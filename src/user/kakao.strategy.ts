import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-kakao'

@Injectable()
export class KaKaoStrategy extends PassportStrategy(Strategy, "kakao") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>("KAKAO_CLIENT_ID"),
            callbackURL: configService.get<string>("KAKAO_CALLBACK_URL")
        })
    }

    async validate(access_token: string, refresh_token: string, user: Profile, done: any) {
        try {
            const { id, username, _json } = user;

            const userResult = {
                id,
                username,
                profileImage: _json.properties.profile_image,
                email: _json.kakao_account.email
            };

            done(null, userResult)
        } catch (error) { console.error(error) }
    }
}