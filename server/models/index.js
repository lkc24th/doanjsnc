// const User = require("./User");
// const Product = require("./Product");
// const Order = require("./Order");
// const Category = require("./Category");
// const ProductOrder = require("./ProductOrder");
// //1 danh mục có nhiều sản phẩm
// Category.hasMany(Product, { foreignKey: "id_category"});
// Product.belongTo(Category, {foreignKey: "id_category"});
// //1 user có nhiều đơn hàng
// User.hasMany(Order, {foreignKey: "id_user"});
// Order.belongTo(User, {foreignKey: "id_user"});

// Product.belongsToMany(Order, {
//     through: ProductOrder,// bởi vì bảng trung gian
//     foreignKey: "id_product",
//     otherKey: "id_order"// kháo ngoại bên kia trong bảng trung gian
// });
// Order.belongsToMany(Product, {
//     through: ProductOrder,
//     foreignKey: "id_order",
//     otherKey: "id_product"
// });

// module.exports = {User, Product, Category, Order, Product, ProductOrder, sequelize};

// models/index.js
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const Category = require("./Category");
const ProductOrder = require("./ProductOrder");

// 1 danh mục có nhiều sản phẩm
Category.hasMany(Product, { foreignKey: "id_category" });
Product.belongsTo(Category, { foreignKey: "id_category" }); // Thêm 's' vào belongsTo

// 1 user có nhiều đơn hàng
User.hasMany(Order, { foreignKey: "id_user" });
Order.belongsTo(User, { foreignKey: "id_user" });

// Quan hệ n-n giữa Product và Order qua ProductOrder
Product.belongsToMany(Order, {
    through: ProductOrder,
    foreignKey: "id_product",
    otherKey: "id_order"
});
Order.belongsToMany(Product, {
    through: ProductOrder,
    foreignKey: "id_order",
    otherKey: "id_product"
});

// Xuất sequelize để sync ở app.js
const sequelize = require('../config/db'); 

module.exports = { User, Product, Category, Order, ProductOrder, sequelize };