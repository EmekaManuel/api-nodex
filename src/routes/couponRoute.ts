import express from 'express';
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  redeemCoupon,
  updateCoupon,
} from '../controllers/coupon';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/coupon-list', getAllCoupons);
router.post('/redeem', authMiddleware, redeemCoupon);
router.post('/create-coupon', authMiddleware, isAdmin, createCoupon);

router.get('/:id', authMiddleware, getCouponById);
router.put('/edit-coupon/:id', authMiddleware, isAdmin, updateCoupon);

router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

export default router;
