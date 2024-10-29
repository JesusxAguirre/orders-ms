import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // @IsNumber()
  // @IsPositive()
  // totalAmount: number;
  // @IsInt()
  // @IsPositive()
  // totalItems: number;
  // @IsEnum(OrderStatusList, {
  //   message: `Invalid order status, must be one of ${OrderStatusList}`,
  // })
  // @IsOptional()
  // status = OrderStatus.PENDING;
}
