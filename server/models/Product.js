const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
    id_product: {
        type: DataTypes.INTEGER, 
        primaryKey: true, autoIncrement: true
    },
    product_name: {
        type: DataTypes.STRING(256)
    },
    product_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_category: {
        type: DataTypes.INTEGER
    },
    product_status: {
        type: DataTypes.BOOLEAN,////mysql đang thiếu
        defaultValue: true  
    }
    },{
    timestamps: true,
    paranoid: true
});
module.exports = Product;
