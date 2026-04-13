const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User",{ //.define() là hàm dùng để:Định nghĩa một Model (mô hình dữ liệu),Model đại diện cho 1 bảng trong database.
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(11),
        },
    address: {
        type: DataTypes.STRING(256),
    },
    role:{
        type: DataTypes.ENUM("Admin", "Employee", "Customer"), defaultValue:"Customer"}//Nếu khi tạo user mà không truyền role, thì tự động gán là 'Customer'.
    }, {
        timestamps: true,
        paranoid: true
    });//ect cấu hình (options) truyền vào hàm .define() của Sequelize.
    
module.exports = User;// xuất modul anyf ra ngoài để các file khác sd
    
  
