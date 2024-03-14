import mongoose, { Document, Schema, Types } from 'mongoose';

interface CartItem {
  product: Types.ObjectId;
  count: number;
}

interface Cart extends Document {
  cartOwner: Types.ObjectId;
  items: CartItem[];
  total: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<Cart>(
  {
    cartOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        count: { type: Number, default: 1 },
      },
    ],
    total: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const CartModel = mongoose.model<Cart>('Cart', cartSchema);

export default CartModel;
