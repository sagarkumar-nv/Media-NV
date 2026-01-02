import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerService } from './customer/customer.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerModule } from './customer/customer.module';
import { MynameController } from './myname/myname.controller';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { UserRolesController } from './user-roles/user-roles.controller';
import { ExceptionController } from './exception/exception.controller';

@Module({
  imports: [CustomerModule],
  controllers: [AppController, CustomerController, MynameController, ProductController, UserRolesController, ExceptionController],
  providers: [AppService, CustomerService, ProductService],
})
export class AppModule {}
