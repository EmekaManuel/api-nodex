import { Request, Response } from 'express';
import Coupon from '../../models/couponModel';
import asyncHandler from 'express-async-handler';

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.body.code || !req.body.discount || !req.body.expiryDate) {
      res.status(400).json({ message: 'code, discount, and expiryDate fields are required' });
      return;
    }
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json(newCoupon);
  } catch (error: any) {
    console.error('error creating coupon', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const redeemCoupon = asyncHandler(async (req: Request, res: Response) => {
  try {
    const couponCode = req.body.couponCode;
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    if (coupon.isRedeemed) {
      res.status(400).json({ message: 'Coupon has already been redeemed by another user' });
      return;
    }

    const currentDate = new Date();

    if (currentDate > coupon.expiryDate) {
      res.status(400).json({ message: 'Coupon has expired' });
      return;
    }

    coupon.isRedeemed = true;
    const redeemedCoupon = await coupon.save();

    res.json({ message: 'Coupon redeemed successfully', redeemedCoupon });
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error('error fetching all coupons', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getCouponById = asyncHandler(async (req: Request, res: Response) => {
  const couponId = req.params.id;
  try {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      res.status(400).json({ message: "this coupon code doesn't exist" });
    }
    res.status(200).json({ message: 'coupon found', coupon });
  } catch (error) {
    console.error('error fetching the coupon:', couponId);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const couponId = req.params.id;
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, req.body, { new: true });
    if (!updatedCoupon) {
      res.status(400).json({ message: "this coupon doesn't exist" });
    }
    res.status(200).json({ message: 'coupon updated successfully', updatedCoupon });
  } catch (error) {
    console.error('error fetching the coupon:', couponId);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const couponId = req.params.id;
  const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
  if (!deletedCoupon) {
    res.status(404).json({ message: 'Coupon not found' });
    return;
  }
  res.json({ message: 'Coupon deleted successfully' });
});
