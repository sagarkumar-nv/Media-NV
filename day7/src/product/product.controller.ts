import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '../guards/auth/auth.guard'

@Controller('product')
export class ProductController {
        constructor(private readonly productService: ProductService) {} 

        @Get()
        @UseGuards(AuthGuard)       // Authorization
        getProducts() {
            return this.productService.getAllProducts();
        }

        @Get(':id')
        getProduct(@Param('id') id: string) {
            return this.productService.getProductById(Number(id));
        }
}
