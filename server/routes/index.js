const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');//iport controller
const productCtrl = require('../controllers/productController');
const categoryCtrl = require('../controllers/categoryController');
const orderCtrl = require('../controllers/orderController');
const { verifyToken, isAdmin, isEmployee } = require('../middleware/auth');

// ========== Auth Routes ==========
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', verifyToken, authCtrl.getMe);
router.get('/protected', verifyToken, authCtrl.protectedExample);

// ========== Category Routes ==========
router.get('/categories', categoryCtrl.getAllCategories);
router.get('/categories/:id', categoryCtrl.getCategoryById);
router.post('/categories', categoryCtrl.createCategory);
//router.post('/categories', verifyToken, isAdmin, categoryCtrl.createCategory);
router.put('/categories/:id',categoryCtrl.updateCategory);
// router.put('/categories/:id', verifyToken, isAdmin, categoryCtrl.updateCategory);
router.delete('/categories/:id', categoryCtrl.deleteCategory);//nên dùng soft delete
// router.delete('/categories/:id', verifyToken, isAdmin, categoryCtrl.deleteCategory);

// ========== Product Routes ==========
router.get('/products', productCtrl.getAllProducts);
router.get('/products/:id', productCtrl.getProductById);
//category/:categoryId/products
router.get('/products/category/:categoryId', productCtrl.getProductsByCategory);//,nhóm category đưa hàm pro qua cate
router.post('/products', productCtrl.createProducts);
// router.post('/products', verifyToken, isAdmin, productCtrl.createProducts);
router.put('/products/:id', productCtrl.updateProduct);
// router.put('/products/:id', verifyToken, isAdmin, productCtrl.updateProduct);
router.delete('/products/:id',productCtrl.deleteProduct);
// router.delete('/products/:id', verifyToken, isAdmin, productCtrl.deleteProduct);

// ========== Order Routes ==========
// User: Lấy đơn hàng của mình
router.get('/orders',orderCtrl.getUserOrders);
// router.get('/orders', verifyToken, orderCtrl.getUserOrders);
// User: Tạo đơn hàng mới
router.post('/orders', orderCtrl.createOrder);
// router.post('/orders', verifyToken, orderCtrl.createOrder);
// Admin/Employee: Lấy tất cả đơn hàng
router.get('/orders/all', orderCtrl.getAllOrders);
// router.get('/orders/all', verifyToken, isEmployee, orderCtrl.getAllOrders);
// Admin/Employee: Cập nhật trạng thái đơn hàng
router.put('/orders/:id/status', orderCtrl.updateStatus);
// router.put('/orders/:id/status', verifyToken, isEmployee, orderCtrl.updateStatus);
// Admin: Xem doanh thu
router.get('/revenue', orderCtrl.getRevenue);
// router.get('/revenue', verifyToken, isAdmin, orderCtrl.getRevenue);

module.exports = router;