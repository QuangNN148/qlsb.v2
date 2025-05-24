const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    const { kieu, thang, quy, nam } = req.query;

    // Kiểm tra kieu hợp lệ
    if (!['thang', 'quy', 'nam'].includes(kieu)) {
        return res.status(400).json({ error: 'Invalid kieu' });
    }

    // Kiểm tra định dạng nam
    if (!nam || !/^\d{4}$/.test(nam)) {
        return res.status(400).json({ error: 'Invalid nam format' });
    }

    // Xây dựng câu truy vấn và tham số
    let query = `
        SELECT 
            hd.id,
            kh.ho_ten,
            sb.ten_san,
            sb.loai_san,
            hd.ngay_thanh_toan,
            ctds.khung_gio,
            hd.tong_tien
        FROM hoa_don hd
        JOIN phieu_dat_san pds ON hd.phieu_dat_san_id = pds.id
        JOIN khach_hang kh ON pds.khach_hang_id = kh.id
        JOIN chi_tiet_dat_san ctds ON pds.id = ctds.phieu_dat_san_id
        JOIN san_bong sb ON ctds.san_bong_id = sb.id
    `;
    let params = [];
    let whereClause = '';

    if (kieu === 'thang') {
        if (!thang || !/^(0?[1-9]|1[0-2])$/.test(thang)) {
            return res.status(400).json({ error: 'Invalid thang format (1-12)' });
        }
        whereClause = `WHERE strftime('%Y', hd.ngay_thanh_toan) = ? AND strftime('%m', hd.ngay_thanh_toan) = ?`;
        params = [nam, thang.padStart(2, '0')]; // Đảm bảo tháng có 2 chữ số (VD: 05)
    } else if (kieu === 'quy') {
        if (!quy || !/^Q[1-4]$/.test(quy)) {
            return res.status(400).json({ error: 'Invalid quy format (Q1-Q4)' });
        }
        const quarter = parseInt(quy.replace('Q', ''));
        const monthStart = (quarter - 1) * 3 + 1;
        const monthEnd = quarter * 3;
        whereClause = `WHERE strftime('%Y', hd.ngay_thanh_toan) = ? AND cast(strftime('%m', hd.ngay_thanh_toan) as integer) BETWEEN ? AND ?`;
        params = [nam, monthStart, monthEnd];
    } else if (kieu === 'nam') {
        whereClause = `WHERE strftime('%Y', hd.ngay_thanh_toan) = ?`;
        params = [nam];
    }

    query += ` ${whereClause} ORDER BY hd.ngay_thanh_toan DESC`;

    // Thực thi truy vấn
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(
            rows.map(row => ({
                id: row.id,
                ho_ten: row.ho_ten,
                ten_san: row.ten_san,
                loai_san: row.loai_san,
                ngay_gio: `${row.ngay_thanh_toan} ${row.khung_gio}`,
                tong_tien: row.tong_tien
            }))
        );
    });
});

module.exports = router;