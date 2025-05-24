const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();


// Kết nối tới cơ sở dữ liệu SQLite
const db = new sqlite3.Database('../db/qlsb.db', (err) => {
    if (err) {
        console.error('Lỗi khi kết nối đến cơ sở dữ liệu:', err.message);
    } else {
        console.log('Kết nối thành công đến cơ sở dữ liệu SQLite!');
    }
});

// Middleware để parse JSON
app.use(express.json());

// Route ví dụ: Lấy tất cả dữ liệu từ một bảng (giả sử bảng tên là "users")
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM khach_hang'; // Thay "users" bằng tên bảng thực tế trong qlsb.db
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Thành công',
            data: rows
        });
    });
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});