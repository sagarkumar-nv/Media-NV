import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
    getCategory() {
        return ['Mobile', 'Laptop', 'Tablet']
    }
}
