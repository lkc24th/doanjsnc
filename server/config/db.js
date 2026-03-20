require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME || "tram_huong",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "123456",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql",
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: false
        }
    }
);

module.exports = sequelize;