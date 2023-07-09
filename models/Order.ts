import { Schema, model, SchemaTypes  } from "mongoose";
import { OrderModel, SingleOrderItemModel } from '../types'

const SingleOrderItemSchema = new Schema<SingleOrderItemModel>({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
      type: SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
});

const OrderSchema = new Schema<OrderModel>({
    tax: {
        type: Number,
        required: true,
      },
      shippingFee: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      orderItems: [SingleOrderItemSchema],
      status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default: 'pending',
      },
      createdBy: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
      clientSecret: {
        type: String,
        required: true,
      },
      paymentIntentId: {
        type: String,
      },
},{ 
    timestamps: true 
});

export default model<OrderModel>('Order', OrderSchema);