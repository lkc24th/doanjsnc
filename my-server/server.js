const http = require('http');

const server = http.createServer((req, res) => {

    // 1. Thiết lập Header để trình duyệt hiểu đây là JSON và cho phép truy cập (CORS)

    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', '*'); 

    // 2. Điều hướng (Routing)

    if (req.url === '/' && req.method === 'GET') {

        res.statusCode = 200;

        res.end(JSON.stringify({ 

            status: "Success", 

            message: "Chào mừng bạn đến với Modern Web API" 

        }));

    } 

    else if (req.url === '/users' && req.method === 'GET') {

        const users = [

            { id: 1, name: "Nguyen Van A" },

            { id: 2, name: "Tran Thi B" }

        ];

        res.statusCode = 200;

        res.end(JSON.stringify(users));

    } 

    else {

        res.statusCode = 404;

        res.end(JSON.stringify({ error: "Đường dẫn không tồn tại" }));

    }

});
// 3. Chạy Server tại cổng 3000

const PORT = 3000;

server.listen(PORT, () => {

    console.log(`Server đang chạy tại http://localhost:${PORT}`);

});