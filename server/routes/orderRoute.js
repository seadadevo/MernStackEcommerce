import express from "express";
import { cancelOrder, createOrder, deleteOrder, getAllOrders, getMyOrders, getOrderDetails, getSalesStatus, getTopSellingProducts, updateOrderStatus } from "../controllers/orderContrller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router()


router.post('/add', isAuthenticated ,  createOrder);
router.get('/my-orders', isAuthenticated ,  getMyOrders);
router.get('/details/:orderId', isAuthenticated ,  getOrderDetails);
router.put('/cancel/:orderId', isAuthenticated ,  cancelOrder);


router.use(isAuthenticated, restrictTo("admin"))

router.get('/admin/all',  getAllOrders);
router.put('/admin/update/:orderId',  updateOrderStatus);
router.delete('/admin/delete/:orderId' ,  deleteOrder);
router.get('/admin/sales-stats' ,  getSalesStatus);
router.get('/admin/top-selling' ,  getTopSellingProducts);


export default router;