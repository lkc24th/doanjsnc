const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'tram_huong',
    connectionLimit: 5
});

async function main() {
    console.log("Testing MariaDB connection...");
    try {
        const conn = await pool.getConnection();
        console.log("Connected successfully!");
        const [rows] = await conn.query("SELECT 1 as val");
        console.log("Query result:", rows);
        conn.release();
    } catch (err) {
        console.error("Connection error:", err);
    } finally {
        await pool.end();
    }
}
main();
