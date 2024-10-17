import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ShopService } from './shop.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AdminGuard } from 'src/shop/guard/admin.guard';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductInfoPipe } from 'src/shop/pipe/product.pipe';
import { productInfoSchema } from 'src/shop/schema/product.schema';
import { ProductTypeInterceptor } from 'src/shop/intercepter/productType.interceptor';

@ApiTags("shop")
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @ApiOperation({ summary: 'productList item count' })
  @ApiResponse({ status: 200, description: 'find success' })
  @ApiParam({ name: 'product', type: 'string', description: 'product type' })
  @Get("/:product/count")
  async getPage(@Param('product') type: string) {
    try {
      return await this.shopService.getPage(type);
    } catch (error) {
      console.error(error);
      return 0;
    }
  }


  @ApiOperation({ summary: 'productList find' })
  @ApiResponse({ status: 200, description: 'find success' })
  @ApiResponse({ status: 403, description: 'not find Resource' })
  @ApiParam({ name: 'product', type: 'string', description: 'product type' })
  @Get(":product")
  async productListAll(@Param("product") type: string, @Query('page', ParseIntPipe) page: number, @Req() req: Request) {
    console.log("product List");
    try {
      //const { cookies: { token } } = req;
      const data = await this.shopService.findAll(type, page);
      return data

    } catch (error) {
      console.error(error);
      return null;
    }
  }


  @ApiOperation({ summary: 'productList find' })
  @ApiResponse({ status: 200, description: 'find success' })
  @ApiResponse({ status: 403, description: 'not find Resource' })
  @ApiParam({ name: 'product', type: 'string', description: 'product type' })
  @Get("mybox/:product")
  async getMybox(@Param("product") type: string, @Query("page", ParseIntPipe) page: number) {
    console.log("여기 옴")
    const data = await this.shopService.myStorage(type, page);
    console.log("test", data)
    return data;
  }

  @Get("detail/:id")
  async getProductInfo(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.shopService.findOne(id);
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  @Post(":product")
  @ApiOperation({ summary: "product info create" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'file', format: 'binary' },
        name: { type: 'string', example: 'test' },
        price: { type: 'number', example: 0 },
        dscr: { type: 'string', example: '' },
        type: { type: 'string', example: 'product' }
      }
    }
  })
  //@UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(ProductTypeInterceptor)
  async createProduct(@Req() req: Request, @UploadedFile() file: Express.Multer.File, @Body() body: Request) {
    try {
      if (Object.keys(body).length === 0 || file === null) {
        throw new BadRequestException("No required data");
      }
      //const { cookies: { token } } = req;
      const token = null;
      await this.shopService.createProduct(token, body, file);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }


  @Put(":product")
  @ApiOperation({ summary: 'product info update' })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'file', format: 'binary' },
        name: { type: 'string', example: 'test' },
        price: { type: 'number', example: 0 },
        dscr: { type: 'string', example: '' },
        type: { type: 'string', example: 'product' }
      }
    }
  })
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    try {
      const { body } = req;
      if (Object.keys(body).length === 0) {
        throw new BadRequestException("No required data");
      }
      await this.shopService.updateProduct(body, file);
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Delete(":productId")
  @UseGuards(AdminGuard)
  async deleteProduct(@Param("productId", ParseIntPipe) id: number) {
    try {
      return await this.shopService.deleteProduct(id);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number', example: "0" },
      }
    }
  })
  @Put("product/buy")
  async buy(@Req() req: Request, @Body("productId", ParseIntPipe) productId: number) {
    try {
      // const { cookies: { token } } = req;
      const token = null;
      return await this.shopService.buy(token, productId);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
