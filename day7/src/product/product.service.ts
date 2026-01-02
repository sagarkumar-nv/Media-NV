import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    private products = [
        {id: 1, name: "Product A", price: 100},
        {id: 2, name: "Product B", price: 200},
        {id: 3, name: "Product C", price: 300}
    ];
    getAllProducts() {
        return this.products;
    }
    getProductById(id: number) {
        return this.products.find((s) => s.id === id);
    }
}
