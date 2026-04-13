const { Product, Category } = require("../models");
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

const normalizeStatus = (statusValue) => {
    if (statusValue === undefined) {
        return undefined;
    }

    if (typeof statusValue === 'boolean') {
        return statusValue;
    }

    if (typeof statusValue === 'number') {
        if (statusValue === 1) return true;
        if (statusValue === 0) return false;
    }

    if (typeof statusValue === 'string') {
        const normalized = statusValue.trim().toLowerCase();
        if (['true', '1', 'active', 'on'].includes(normalized)) return true;
        if (['false', '0', 'inactive', 'off'].includes(normalized)) return false;
    }

    return undefined;
};

const buildProductPayload = (body = {}) => {
    const payload = {};

    if (body.product_name !== undefined) payload.product_name = body.product_name;
    if (body.product_price !== undefined) payload.product_price = body.product_price;
    if (body.id_category !== undefined) payload.id_category = body.id_category;

    const normalizedStatus = normalizeStatus(body.product_status ?? body.status);
    if (normalizedStatus !== undefined) {
        payload.product_status = normalizedStatus;
    }

    return payload;
};

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const where = {};
        const normalizedStatus = normalizeStatus(req.query.status ?? req.query.product_status);
        if (normalizedStatus !== undefined) {
            where.product_status = normalizedStatus;
        }

        const products = await Product.findAll({
            where,
            include: [{ model: Category, attributes: ['category_name'] }]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [{ model: Category, attributes: ['category_name'] }]
        });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Tạo sản phẩm mới
exports.createProducts = async (req, res) => {
    try {
        const payload = buildProductPayload(req.body);
        const wantsRestore = normalizeRestoreChoice(req.body?.confirm_restore);

        const rawProductName = payload.product_name;
        const productName = typeof rawProductName === 'string' ? rawProductName.trim() : '';
        if (!productName) {
            return res.status(400).json({ message: 'Vui lòng nhập tên sản phẩm' });
        }
        payload.product_name = productName;

        const existingProduct = await Product.findOne({
            paranoid: false,
            where: where(fn('LOWER', col('product_name')), productName.toLowerCase())
        });

        if (existingProduct && !existingProduct.deletedAt) {
            return res.status(400).json({ message: 'Sản phẩm đã tồn tại' });
        }

        if (existingProduct && existingProduct.deletedAt && !wantsRestore) {
            return res.status(409).json({
                message: 'Sản phẩm đã tồn tại trong danh sách xóa mềm. Bạn có muốn khôi phục không?',
                can_restore: true,
                target: {
                    type: 'product',
                    id_product: existingProduct.id_product,
                    product_name: existingProduct.product_name
                }
            });
        }

        if (existingProduct && existingProduct.deletedAt && wantsRestore) {
            await existingProduct.restore();
            await existingProduct.update(payload);
            return res.status(200).json({
                message: 'Khôi phục sản phẩm thành công!',
                product: existingProduct
            });
        }

        const newProduct = await Product.create(payload);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = buildProductPayload(req.body);

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu hợp lệ để cập nhật" });
        }

        const [updated] = await Product.update(payload, {
            where: { id_product: id }
        });
        if (updated) {
            const updatedProduct = await Product.findByPk(id);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        await product.destroy();
        res.json({ message: "Xóa mềm sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const where = { id_category: categoryId };

        const normalizedStatus = normalizeStatus(req.query.status ?? req.query.product_status);
        if (normalizedStatus !== undefined) {
            where.product_status = normalizedStatus;
        }

        const products = await Product.findAll({
            where,
            include: [{ model: Category, attributes: ['category_name'] }]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách sản phẩm đã xóa mềm
exports.getDeletedProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null
                }
            },
            include: [{ model: Category, attributes: ['category_name'] }]
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Khôi phục sản phẩm đã xóa mềm
exports.restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, { paranoid: false });

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        if (!product.deletedAt) {
            return res.status(400).json({ message: 'Sản phẩm chưa bị xóa mềm' });
        }

        await product.restore();
        res.json({ message: 'Khôi phục sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};