const bcrypt = require('bcrypt');//là thư viện,Hash (mã hóa một chiều) mật khẩu của người dùng trước khi lưu vào database.
const jwt = require('jsonwebtoken');// là thư viện
const { User } = require('../models');

// Đăng ký tài khoản
exports.register = async (req, res) => {
    try {
        const { username, password, phone, address, role } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ username và password!'
            });
        }

        // Kiểm tra username đã tồn tại chưa
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;//10 kí tự salt
        const hashedPassword = await bcrypt.hash(password, saltRounds);//gọi hàm

        // Tạo user mới
        const newUser = await User.create({
            username,
            password: hashedPassword,
            phone,
            address,
            role: role || 'Customer' // Mặc định là Customer
        });

        res.status(201).json({
            message: 'Đăng ký thành công!',
            user: {
                id_user: newUser.id_user,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ username và password!'
            });
        }

        // Tìm user theo username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập không tồn tại!' });
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mật khẩu không đúng!' });
        }

        const token = jwt.sign(
            {
                id_user: user.id_user,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({//res
            message: 'Đăng nhập thành công!',// tar về token
            token,// giá trị
            user: {
                id_user: user.id_user,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id_user, {
            attributes: ['id_user', 'username', 'phone', 'address', 'role']
        });
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route mẫu để test middleware verifyToken end-to-end
exports.protectedExample = async (req, res) => {
    try {
        res.json({
            message: 'Token hợp lệ. Bạn đã truy cập route cần đăng nhập.',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
