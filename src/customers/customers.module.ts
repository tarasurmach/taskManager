import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { CustomersController } from './controllers/customers/customers.controller';
import { CustomersService } from './services/customers/customers.service';
import {ValidateCustomerMiddleware} from "./middleware/validateCustomer.middleware.js";

@Module({
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule implements NestModule{
  configure(consumer:MiddlewareConsumer) {
    consumer.apply(ValidateCustomerMiddleware).forRoutes({
      path:"/customers/:id",
      method:0
    })
  }
}
