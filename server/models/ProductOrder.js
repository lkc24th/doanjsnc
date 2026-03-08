// đóng vai trò giỏ hàng đã thanh toán
const {DataTypes} = require("sequelize");
const sequelize = require(".../config/db");

const ProductOrder = sequelize.define("ProductOrder", {
    id_order: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_product: {
        type: DataTypes.INTEGER, 
        primaryKey: true
    },
    product_quantity: {
        type: DataTypes.INTEGER
    },
    product_price: {
        type: DataTypes.INTEGER
    }
},{tableName: "products_orders"});

module.exports = ProductOrder;