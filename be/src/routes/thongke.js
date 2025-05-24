const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/thong-ke?type=thang&year=2025
router.get('/', (req, res) => {
    const { kieu, year } = req.query;

    // Kiểm tra giá trị type hợp lệ
    if (!['thang', 'quy', 'nam'].includes(kieu)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    // Xác định cách nhóm dữ liệu
    let groupBy;
    if (kieu === 'thang') {
        groupBy = "strftime('%Y-%m', ngay_thanh_toan)";
    } else if (kieu === 'quy') {
        groupBy = "strftime('%Y', ngay_thanh_toan) || '-Q' || ((cast(strftime('%m', ngay_thanh_toan) as integer)-1)/3 + 1)";
    } else {
        groupBy = "strftime('%Y', ngay_thanh_toan)";
    }

    // Xây dựng câu truy vấn
    let query;
    let params = [];
    
    if (year) {
        // Nếu có tham số year, chỉ lấy dữ liệu của năm đó
        query = `
            SELECT ${groupBy} AS ky_thong_ke,
                   SUM(tong_tien) AS tong_doanh_thu
            FROM hoa_don
            WHERE strftime('%Y', ngay_thanh_toan) = ?
            GROUP BY ky_thong_ke
            ORDER BY ky_thong_ke DESC;
        `;
        params = [year];
    } else {
        // Nếu không có year, lấy tất cả dữ liệu
        query = `
            SELECT ${groupBy} AS ky_thong_ke,
                   SUM(tong_tien) AS tong_doanh_thu
            FROM hoa_don
            GROUP BY ky_thong_ke
            ORDER BY ky_thong_ke DESC;
        `;
    }

    // Thực thi truy vấn
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;