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
router.get('/me', verifyToken, authCtrl.getMe);//trả về in4 của chính ng đn
router.get('/protected', verifyToken, authCtrl.protectedExample);//test token có đúng hay không

// ========== Category Routes ==========
router.get('/categories', categoryCtrl.getAllCategories);
router.get('/categories/deleted', verifyToken, isAdmin, categoryCtrl.getDeletedCategories);//Xem toàn bộ danh mục đã bị xóa mềm
router.get('/categories/:id', categoryCtrl.getCategoryById);
router.get('/category/:categoryId/products', productCtrl.getProductsByCategory);
// router.post('/categories', categoryCtrl.createCategory);
router.post('/categories', verifyToken, isAdmin, categoryCtrl.createCategory);
// router.put('/categories/:id',categoryCtrl.updateCategory);
router.put('/categories/:id', verifyToken, isAdmin, categoryCtrl.updateCategory);
router.patch('/categories/:id/restore', verifyToken, isAdmin, categoryCtrl.restoreCategory);//khôi phục danh mục  đã xoá mềm
// router.delete('/categories/:id', categoryCtrl.deleteCategory);//nên dùng soft delete
router.delete('/categories/:id', verifyToken, isAdmin, categoryCtrl.deleteCategory);//đã chuỷen qua xoá mềm

// ========== Product Routes ==========
router.get('/products', productCtrl.getAllProducts);
router.get('/products/deleted', verifyToken, isAdmin, productCtrl.getDeletedProducts);
router.get('/products/:id', productCtrl.getProductById);
//category/:categoryId/products
//,nhóm category đưa hàm pro qua cate
router.post('/products', productCtrl.createProducts);
// router.post('/products', verifyToken, isAdmin, productCtrl.createProducts);
router.put('/products/:id', productCtrl.updateProduct);
// router.put('/products/:id', verifyToken, isAdmin, productCtrl.updateProduct);
router.patch('/products/:id/restore', verifyToken, isAdmin, productCtrl.restoreProduct);//khôi phục sp đã xoá mềm
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
router.get('/orders/deleted', verifyToken, isEmployee, orderCtrl.getDeletedOrders);//ds bị xoá mềm
// router.get('/orders/all', verifyToken, isEmployee, orderCtrl.getAllOrders);
// Admin/Employee: Lấy chi tiết đơn hàng theo ID
router.get('/orders/:id', verifyToken, isEmployee, orderCtrl.getOrderById);
// Admin/Employee: Cập nhật trạng thái đơn hàng
router.put('/orders/:id/status', orderCtrl.updateStatus);//ngang này xong
// router.put('/orders/:id/status', verifyToken, isEmployee, orderCtrl.updateStatus);
router.patch('/orders/:id/restore', verifyToken, isEmployee, orderCtrl.restoreOrder);
router.delete('/orders/:id', verifyToken, isEmployee, orderCtrl.deleteOrder);
// Admin: Xem doanh thu
// router.get('/revenue', orderCtrl.getRevenue);
router.get('/revenue', verifyToken, isAdmin, orderCtrl.getRevenue);

// ========== User Routes ==========test postman thiếu phần này
router.post('/users', verifyToken, isAdmin, authCtrl.register); // thêm user mới
router.get('/users', verifyToken, isAdmin, authCtrl.getAllUsers);//in ra hết user
router.get('/users/deleted', verifyToken, isAdmin, authCtrl.getDeletedUsers);//ds user đã xóa mềm
router.get('/users/:id', verifyToken, isAdmin, authCtrl.getUserById);//lấy user theo id
router.patch('/users/restore', verifyToken, isAdmin, authCtrl.getDeletedUsers);//lấy danh sách user đã xóa mềm (không cần id)
router.delete('/users/:id', verifyToken, isAdmin, authCtrl.deleteUser);//xoá mềm user

module.exports = router;