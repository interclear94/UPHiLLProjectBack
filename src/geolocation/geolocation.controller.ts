import { Controller, Get, Query, Req } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import axios from 'axios';
@Controller('geolocation')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) { }
  @Get('elevation')
  async getEval(@Req() req: Request, @Query('lat') lat: string, @Query('lng') lng: string) {
    //console.log(req)
    //console.log(lat, lng)
    // const key = encodeURIComponent('AIzaSyAX8e2e9Y1BQkvz78gNKyu1Hgpv9LFF4OI')
    // console.log(key)
    // 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/elevation/json?locations=37.48358627393053,126.92450764132326&key=AIzaSyAX8e2e9Y1BQkvz78gNKyu1Hgpv9LFF4OI


    const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=AIzaSyBgnYYe51LyTb86entOMxRAFb4izXdnwB4`;
    console.log(url)
    const { data } = await axios.get(url);
    console.log(data)
    //const { data } = await axios.get(`https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=AIzaSyBgnYYe51LyTb86entOMxRAFb4izXdnwB4`)
    return data
  }
}
