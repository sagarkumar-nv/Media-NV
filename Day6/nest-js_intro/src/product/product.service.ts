import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    private products = [
        { id: 1, name: 'Product A', price: 100 },
        { id: 2, name: 'Product B', price: 150 },
        { id: 3, name: 'Product C', price: 200 },
    ];
    getAllProducts() {
        return this.products;
    }
    getProductById(id: number) {
        return this.products.find(product => product.id === id);
    }
}
