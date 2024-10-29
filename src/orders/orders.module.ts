import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from 'src/config';
import { PRODUCT_SERVICE } from 'src/config/service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: env.productsMicroserviceHost,
          port: env.productsMicroservicePort,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
