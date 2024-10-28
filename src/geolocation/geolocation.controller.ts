import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import axios from 'axios';
@Controller('geolocation')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) { }
  @Post('elevation')
  async getEval(@Req() req: Request, @Body('lat') lat: string, @Body('lng') lng: string) {
    try {
      //console.log(req)
      //console.log(lat, lng)
      // const key = encodeURIComponent('AIzaSyAX8e2e9Y1BQkvz78gNKyu1Hgpv9LFF4OI')
      // console.log(key)
      // 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/elevation/json?locations=37.48358627393053,126.92450764132326&key=AIzaSyAX8e2e9Y1BQkvz78gNKyu1Hgpv9LFF4OI
      console.log(req)
      const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=AIzaSyBgnYYe51LyTb86entOMxRAFb4izXdnwB4`;
      console.log(url)
      const { data } = await axios.get(url);
      console.log(data)
      //const { data } = await axios.get(`https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=AIzaSyBgnYYe51LyTb86entOMxRAFb4izXdnwB4`)
      return data.results[0].elevation;
    } catch (error) {
      console.error(error);
    }
  }
}
