import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { z } from 'zod';


export class ProductInfoPipe implements PipeTransform {
    constructor(private readonly z: z.Schema) {

    }
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            value.price = parseInt(value.price)
            this.z.parse(value);
            return value;
        } catch (error) {
            console.error(error);
            throw new BadRequestException("data type error");
        }
    }
}