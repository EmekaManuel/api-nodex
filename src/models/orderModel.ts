import mongoose, { Document, Schema, Types } from 'mongoose';

interface Product {
  product: Types.ObjectId;
  color: string;
  count: number;
}

enum OrderStatus {
  CREATED = 'created',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

interface Order extends Document {
  orderBy: Types.ObjectId;
  products: Product[];
  paymentIntent: any;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<Order>(
  {
    orderBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        color: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
    paymentIntent: { type: Schema.Types.Mixed },
    orderStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.CREATED },
  },
  { timestamps: true },
);

const OrderModel = mongoose.model<Order>('Order', orderSchema);

export default OrderModel;
