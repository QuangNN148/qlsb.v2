const express = require('express');
const router = express.Router();
const db = require('../database');
// const sqlite3 = require('sqlite3').verbose();

// const db = new sqlite3.Database('../../../db/qlsb.db', (err) => {
//   if (err) {
//     console.error('Lỗi khi kết nối đến cơ sở dữ liệu:', err.message);
//   } else {
//     console.log('Kết nối thành công đến cơ sở dữ liệu SQLite!');
//   }
// });

// Tìm sân trống
router.get('/san-trong', (req, res) => {
  const { khung_gio, loai_san, ngay_bat_dau, ngay_ket_thuc } = req.query;

  if (!khung_gio || !ngay_bat_dau || !ngay_ket_thuc) {
    return res.status(400).json({ error: 'Thiếu khung_gio, ngay_bat_dau hoặc ngay_ket_thuc' });
  }

  const query = `
    SELECT id, ten_san, loai_san, mo_ta
    FROM san_bong
    WHERE id NOT IN (
      SELECT san_bong_id
      FROM chi_tiet_dat_san
      WHERE khung_gio = ?
        AND ngay_bat_dau <= ?
        AND ngay_ket_thuc >= ?
    )
    ${loai_san ? 'AND loai_san = ?' : ''};
  `;
  const params = [khung_gio, ngay_ket_thuc, ngay_bat_dau];
  if (loai_san) params.push(loai_san);

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
});

// Tìm khách hàng
router.get('/khach-hang', (req, res) => {
  const { ho_ten } = req.query;
  if (!ho_ten) return res.status(400).json({ error: 'Thiếu ho_ten' });

  const query = `SELECT id, ho_ten, sdt, email FROM khach_hang WHERE ho_ten LIKE ?`;
  db.all(query, [`%${ho_ten}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
});

// Thêm khách hàng mới
router.post('/khach-hang', (req, res) => {
  const { ho_ten, sdt, email } = req.body;
  if (!ho_ten) return res.status(400).json({ error: 'Thiếu ho_ten' });

  const query = `INSERT INTO khach_hang (ho_ten, sdt, email) VALUES (?, ?, ?)`;
  db.run(query, [ho_ten, sdt || null, email || null], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ho_ten, sdt, email });
  });
});

// Tạo phiếu đặt sân
router.post('/phieu-dat-san', (req, res) => {
  const { khach_hang_id, ngay_dat, chi_tiet, tong_tien_du_kien, tien_dat_coc } = req.body;

  if (!khach_hang_id || !ngay_dat || !chi_tiet || !tong_tien_du_kien || !tien_dat_coc) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  db.run(
    `INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc) VALUES (?, ?, ?, ?)`,
    [khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const phieu_dat_san_id = this.lastID;
      const chi_tiet_queries = chi_tiet.map(() => (
        `INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_mot_buoi)
         VALUES (?, ?, ?, ?, ?, ?)`
      ));

      db.serialize(() => {
        chi_tiet.forEach((ct, index) => {
          db.run(chi_tiet_queries[index], [
            phieu_dat_san_id,
            ct.san_bong_id,
            ct.khung_gio,
            ct.ngay_bat_dau,
            ct.ngay_ket_thuc,
            ct.gia_thue_mot_buoi
          ], (err) => {
            if (err) console.error('Lỗi khi chèn chi tiết:', err.message);
          });
        });
      });

      res.json({ message: 'Phiếu đặt sân đã được tạo', phieu_dat_san_id });
    }
  );
});

module.exports = router;