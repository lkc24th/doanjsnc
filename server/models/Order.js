const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id_order: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    id_user: { 
        type: DataTypes.INTEGER 
    },
    order_date: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    total_amount: { 
        type: DataTypes.INTEGER 
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled'),
        defaultValue: 'Pending'
    }
}, { tableName: 'orders' });

module.exports = Order;