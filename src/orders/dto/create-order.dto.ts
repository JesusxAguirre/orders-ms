import { OrderStatus } from '@prisma/client';
import {
  IsDecimal,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDate,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';

export class CreateOrderDto {
  @IsDecimal()
  @IsPositive()
  total_amount: number;

  @IsInt()
  @IsPositive()
  total_items: number;

  @IsEnum(OrderStatusList, {
    message: `Invalid order status, must be one of ${OrderStatusList}`,
  })
  @IsOptional()
  status = OrderStatus.PENDING;
}
