const {Sequelize} = require("sequelize");
const sequelize = new Sequelize("tram_huong", "root", "123456", {
    host: "localhost",
    dialect: "mysql",//SQL có rất nhiều dialect: MySQL dialect, PostgreSQL dialect, Oracle dialect, SQL Server (T-SQL) dialect…Biến thể nhỏ của một ngôn ngữ lập trình
    logging: false,
    define: {
        timestamps: false //Theo dõi lịch sử thay đổi
    }

}); 

module.exports = sequelize;
   
   



