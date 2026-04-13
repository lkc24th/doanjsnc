// Đây là file khởi tạo server chính.
// 
// Vai trò:
// 
// khởi tạo Express
// 
// cấu hình middleware
// 
// import routes
// 
// chạy server
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });//Nạp thư viện dotenv từ server/.env
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Tram Huong API nhóm 2!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Đã xảy ra lỗi server!' });
});

// Kết nối database và khởi động server
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Kết nối database thành công!');

        app.listen(PORT, () => {
            console.log(` Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(' Không thể kết nối database:', error);
        process.exit(1);
    }
};

startServer();
