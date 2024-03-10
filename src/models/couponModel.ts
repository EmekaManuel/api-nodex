import mongoose, { Schema } from 'mongoose';

interface Coupon {
  code: string;
  expiryDate: Date;
  discount: string;
  isRedeemed: boolean;
}

const couponSchema: Schema<Coupon> = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  isRedeemed: {
    type: Boolean,
    default: false,
  },
});

//Export the model
const CouponModel = mongoose.model<Coupon>('Coupon', couponSchema);
export default CouponModel;
