import express from 'express';
import { updateOrderStatus, createOrder, getOrder, getUserOrders, getAllOrders, initiatePayment, verifyPayment } from "../controllers/order.controller.js"
const router = express.Router();


router.get('/', getAllOrders);

router.post('/', createOrder);

router.get('/:orderId', getOrder);

router.get('/user/:userId', getUserOrders);

router.patch('/:orderId/status', updateOrderStatus);

router.post('/payment/initiate', initiatePayment);
router.post('/payment/verify', verifyPayment);

export default router;

