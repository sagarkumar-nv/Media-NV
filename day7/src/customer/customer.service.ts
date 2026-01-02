import { Injectable } from '@nestjs/common';
import { Customer } from './interfaces/customer.interface';
import { CreateCustomerDTO } from './dto/create.customer.dto';

@Injectable()
export class CustomerService {
   private customers: Customer[] =[];

   getAllCustomers() : Customer[] {
    return this.customers;
   }

   addCustomer(createCustomerDto: CreateCustomerDTO):
   Customer {
            const newCustomer: Customer = {
                id: Date.now(),
                ...createCustomerDto
            }
            this.customers.push(newCustomer);
            return newCustomer;
   }
}
