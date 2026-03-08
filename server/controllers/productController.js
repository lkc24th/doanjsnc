// const {Product, Category} = require("../models");

// exports.getAllProducts = async (req, res) => {// lấy tất acr sp
//     try{
//         const product = await Product.findAll({
//         include: [{ model: Category, attributes: ['category_name']}]
//         });

//     }catch (error) {
//         res.status(500).json({ message:  "Lỗi server khi lấy sản phẩm" });
//     }
// };
// exports.createProducts = async (req, res) => {
//     try{
//         const  newProduct = await Product.create(req.body);
//         res.status(201).json(newProduct);
//     }catch{
//         res.status(400).json({ message: error.message});
//     }
// };
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ // đổi tên biến cho rõ ràng
            include: [{ model: Category, attributes: ['category_name'] }]
        });
        res.json(products); // PHẢI CÓ dòng này để trả dữ liệu về client
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
    }
};

exports.createProducts = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body); // Sửa thành .create
        res.status(201).json(newProduct);
    } catch (error) { // Thêm biến error vào đây
        res.status(400).json({ message: error.message });
    }
};