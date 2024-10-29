import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto, ResponsePaginationDto } from 'src/core';
import { changeOrderStatusDto } from './dto/change-order-status.dto';
import { PRODUCT_SERVICE } from 'src/config';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      //1 Confirmar los ids de los products
      const producIds = createOrderDto.items.map((item) => item.productId);

      const products = await firstValueFrom(
        this.productsClient.send('validate_products', producIds),
      );

      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;
        return acc + price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      return await this.order.create({
        data: {
          totalAmount,
          totalItems,
          orderItems: {
            createMany: {
              data: createOrderDto.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: parseFloat(
                  products.find((product) => product.id === item.productId)
                    .price,
                ),
              })),
            },
          },
        },
        include: {
          orderItems: {
            select: {
              productId: true,
              quantity: true,
              price: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new RpcException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.order.count();

    const orders = await this.order.findMany({
      skip: page * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new ResponsePaginationDto({
      page: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: orders,
    });
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: {
        id: id,
      },
    });

    if (!order) {
      throw new RpcException({
        message: `Order with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return order;
  }

  async changeOrderStatus(changeOrderStatusDto: changeOrderStatusDto) {
    const order = await this.findOne(changeOrderStatusDto.id);

    if (order.status === changeOrderStatusDto.status) {
      throw new RpcException({
        message: `Order w ith id ${changeOrderStatusDto.id} already has status ${changeOrderStatusDto.status}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    await this.order.update({
      where: {
        id: changeOrderStatusDto.id,
      },
      data: {
        status: changeOrderStatusDto.status,
      },
    });

    return await this.findOne(changeOrderStatusDto.id);
  }
}
