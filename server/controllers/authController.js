const bcrypt = require('bcrypt');//là thư viện,Hash (mã hóa một chiều) mật khẩu của người dùng trước khi lưu vào database.
const jwt = require('jsonwebtoken');// là thư viện
const { User } = require('../models');
const { Op, fn, col, where } = require('sequelize');

const normalizeRestoreChoice = (value) => {
    if (value === true) return true;
    if (value === false || value === undefined || value === null) return false;
    if (typeof value === 'string') {
        return ['true', '1', 'yes', 'co'].includes(value.trim().toLowerCase());
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    return false;
};

// Đăng ký tài khoản
exports.register = async (req, res) => {
    try {
        const { username, password, phone, address, role, confirm_restore } = req.body || {};
        const normalizedUsername = typeof username === 'string' ? username.trim() : '';
        const wantsRestore = normalizeRestoreChoice(confirm_restore);

        if (!normalizedUsername || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ username và password!'
            });
        }

        // Kiểm tra username đã tồn tại, bao gồm cả bản ghi đã xóa mềm
        const existingUser = await User.findOne({
            paranoid: false,
            where: where(fn('LOWER', col('username')), normalizedUsername.toLowerCase())
        });

        if (existingUser && !existingUser.deletedAt) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
        }

        if (existingUser && existingUser.deletedAt && !wantsRestore) {
            return res.status(409).json({
                message: 'Tài khoản đã tồn tại trong danh sách xóa mềm. Bạn có muốn khôi phục không?',
                can_restore: true,
                target: {
                    type: 'user',
                    id_user: existingUser.id_user,
                    username: existingUser.username
                }
            });
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;//10 kí tự salt
        const hashedPassword = await bcrypt.hash(password, saltRounds);//gọi hàm

        if (existingUser && existingUser.deletedAt && wantsRestore) {
            await existingUser.restore();
            await existingUser.update({
                username: normalizedUsername,
                password: hashedPassword,
                phone,
                address,
                role: role || existingUser.role || 'Customer'
            });

            return res.status(200).json({
                message: 'Khôi phục tài khoản thành công!',
                user: {
                    id_user: existingUser.id_user,
                    username: existingUser.username,
                    role: existingUser.role
                }
            });
        }

        // Tạo user mới
        const newUser = await User.create({
            username: normalizedUsername,
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

// Admin: Lấy toàn bộ danh sách user (không bao gồm user đã xóa mềm)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id_user', 'username', 'phone', 'address', 'role', 'createdAt', 'updatedAt'],
            order: [['id_user', 'ASC']]
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Lấy thông tin user theo id
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ['id_user', 'username', 'phone', 'address', 'role', 'createdAt', 'updatedAt']
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

// Admin xóa mềm user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }

        await user.destroy();
        res.json({ message: 'Xóa mềm user thành công!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách user đã xóa mềm
exports.getDeletedUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null
                }
            },
            attributes: ['id_user', 'username', 'phone', 'address', 'role', 'createdAt', 'updatedAt', 'deletedAt']
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Khôi phục user đã xóa mềm
exports.restoreUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { paranoid: false });

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại!' });
        }

        if (!user.deletedAt) {
            return res.status(400).json({ message: 'User chưa bị xóa mềm!' });
        }

        await user.restore();
        res.json({ message: 'Khôi phục user thành công!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
