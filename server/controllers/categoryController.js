const { Category } = require("../models");

// Lấy tất cả danh mục(đọc)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();// tương tự eloquent
        res.json(categories);//trả dữ liệu về kiểu json(object) /xml(dạng thẻ)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo danh mục mới(thêm)
exports.createCategory = async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật danh mục(sửa)
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Category.update(req.body, {
            where: { id_category: id }
        });
        if (updated) {
            const updatedCategory = await Category.findByPk(id);
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: "Không tìm thấy danh mục" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Category.destroy({
            where: { id_category: id }
        });
        if (deleted) {
            res.json({ message: "Xóa danh mục thành công" });
        } else {
            res.status(404).json({ message: "Không tìm thấy danh mục" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
