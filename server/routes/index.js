const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');
const productCtrl = require('../controllers/productController');
const orderCtrl = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// Auth Routes
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// Product Routes
router.get('/products', productCtrl.getAllProducts);
router.post('/products', authMiddleware, productCtrl.createProduct);

// Order Routes
router.get('/orders', authMiddleware, orderCtrl.getUserOrders);

module.exports = router;