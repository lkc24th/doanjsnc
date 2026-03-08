const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
    id_category: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true },
    category_name: { 
        type: DataTypes.STRING(256), 
        allowNull: false 
    }
}, { tableName: 'categories' });

module.exports = Category;