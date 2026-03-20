const jwt = require('jsonwebtoken');

// Middleware xác thực JWT token
exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token không được cung cấp!' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        
        req.user = decoded; // Lưu thông tin user vào request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn!' });
        }
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }
};

// Middleware kiểm tra quyền Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Quyền truy cập bị từ chối. Chỉ dành cho Admin!' });
    }
};

// Middleware kiểm tra quyền Employee hoặc Admin
exports.isEmployee = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Employee')) {
        next();
    } else {
        res.status(403).json({ message: 'Quyền truy cập bị từ chối. Chỉ dành cho nhân viên!' });
    }
};