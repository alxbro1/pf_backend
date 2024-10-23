import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { db } from "../../config/db";
import { orders, ordersDetails } from "../../../db/schemas/orders.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class ordersRepository {
    async create(data: CreateOrderDto){
        const order = await db.insert(orders).values({userId:data.userId, mpOrderId:data.mpOrderID}).returning() as any
        console.log(order)
        if(!order[0] || !order[0].id) throw new BadRequestException("Error creating order")
        const ordersDetailsObj = data.products.map((product) => {
            return {
                orderId: order[0].id,
                productId: product.productId,
                quantity: product.quantity,
                price: product.price
            }
        })

        const orderDetails = await db.insert(ordersDetails).values(ordersDetailsObj).execute()   

        if(!orderDetails){
            throw new BadGatewayException("Error creating order details")
        }

        return order[0].id
    }

    async updateToPayment(data: any){
        console.log(data)
        const dbResponse = await db.update(orders)
          .set({ mpOrderId: data.mpOrder, isPaid: data.paid,  orderEstatus: data.status})
          .where(eq(orders.id, data.order))
          .execute();
          console.log(dbResponse)
        return dbResponse;
    }
}