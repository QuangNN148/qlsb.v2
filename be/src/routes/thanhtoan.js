const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./qlsb.db', (err) => {
  if (err) console.error('Lỗi kết nối CSDL:', err.message);
  else console.log('Kết nối CSDL SQLite thành công!');
});

// Tìm khách hàng theo tên
router.get('/khach-hang', (req, res) => {
  const { ho_ten } = req.query;
  if (!ho_ten) return res.status(400).json({ error: 'Thiếu ho_ten' });

  const query = `SELECT id, ho_ten, sdt, email FROM khach_hang WHERE ho_ten LIKE ?`;
  db.all(query, [`%${ho_ten}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
});

// Lấy danh sách phiếu đặt sân của khách hàng
router.get('/phieu-dat-san/:khach_hang_id', (req, res) => {
  const { khach_hang_id } = req.params;
  const query = `
    SELECT id, ngay_dat, tong_tien_du_kien, tien_dat_coc
    FROM phieu_dat_san
    WHERE khach_hang_id = ? AND trang_thai = 'chua_thanh_toan';
  `;
  db.all(query, [khach_hang_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
});

// Lấy chi tiết phiếu đặt sân và mặt hàng phát sinh
router.get('/phieu-dat-san/:id/chi-tiet', (req, res) => {
  const { id } = req.params;

  // Lấy chi tiết thuê sân
  const query1 = `
    SELECT ctds.id, ctds.san_bong_id, sb.ten_san, sb.loai_san, ctds.khung_gio, 
           ctds.ngay_bat_dau, ctds.ngay_ket_thuc, ctds.gia_thue_mot_buoi
    FROM chi_tiet_dat_san ctds
    JOIN san_bong sb ON ctds.san_bong_id = sb.id
    WHERE ctds.phieu_dat_san_id = ?;
  `;
  // Lấy mặt hàng phát sinh
  const query2 = `
    SELECT ctsu.ngay_su_dung, ctsu.mat_hang_id, mh.ma_mh, mh.ten_mh, mh.don_gia, 
           ctsu.so_luong, (mh.don_gia * ctsu.so_luong) AS thanh_tien
    FROM chi_tiet_su_dung ctsu
    JOIN mat_hang mh ON ctsu.mat_hang_id = mh.id
    WHERE ctsu.phieu_dat_san_id = ?
    ORDER BY ctsu.ngay_su_dung;
  `;
  // Lấy dư nợ cũ
  const query3 = `
    SELECT SUM(tien_con_no) AS du_no
    FROM hoa_don
    WHERE phieu_dat_san_id IN (
        SELECT id FROM phieu_dat_san WHERE khach_hang_id = (
            SELECT khach_hang_id FROM phieu_dat_san WHERE id = ?
        )
    );
  `;

  db.all(query1, [id], (err1, chi_tiet_dat) => {
    if (err1) return res.status(500).json({ error: err1.message });
    db.all(query2, [id], (err2, mat_hang) => {
      if (err2) return res.status(500).json({ error: err2.message });
      db.get(query3, [id], (err3, du_no) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({
          chi_tiet_dat,
          mat_hang,
          du_no: du_no?.du_no || 0
        });
      });
    });
  });
});

// Cập nhật mặt hàng phát sinh
router.post('/mat-hang', (req, res) => {
  const { phieu_dat_san_id, mat_hang_id, ngay_su_dung, so_luong } = req.body;
  if (!phieu_dat_san_id || !mat_hang_id || !ngay_su_dung || !so_luong) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  const checkQuery = `
    SELECT id
    FROM chi_tiet_su_dung
    WHERE phieu_dat_san_id = ? AND mat_hang_id = ? AND ngay_su_dung = ?;
  `;
  db.get(checkQuery, [phieu_dat_san_id, mat_hang_id, ngay_su_dung], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      const updateQuery = `UPDATE chi_tiet_su_dung SET so_luong = ? WHERE id = ?`;
      db.run(updateQuery, [so_luong, row.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cập nhật mặt hàng thành công' });
      });
    } else {
      const insertQuery = `
        INSERT INTO chi_tiet_su_dung (phieu_dat_san_id, mat_hang_id, ngay_su_dung, so_luong)
        VALUES (?, ?, ?, ?);
      `;
      db.run(insertQuery, [phieu_dat_san_id, mat_hang_id, ngay_su_dung, so_luong], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Thêm mặt hàng thành công' });
      });
    }
  });
});

// Lưu hóa đơn thanh toán
router.post('/hoa-don', (req, res) => {
  const { phieu_dat_san_id, ngay_thanh_toan, tong_tien_thue, tong_tien_mat_hang, 
          tong_tien_phai_tra, tien_thuc_tra, tien_con_no } = req.body;

  if (!phieu_dat_san_id || !ngay_thanh_toan || !tong_tien_thue || !tong_tien_mat_hang || 
      !tong_tien_phai_tra || !tien_thuc_tra) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  db.run(
    `INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien_thue, 
                         tong_tien_mat_hang, tong_tien_phai_tra, tien_thuc_tra, tien_con_no)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [phieu_dat_san_id, ngay_thanh_toan, tong_tien_thue, tong_tien_mat_hang, 
     tong_tien_phai_tra, tien_thuc_tra, tien_con_no],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.run(
        `UPDATE phieu_dat_san SET trang_thai = 'da_thanh_toan' WHERE id = ?`,
        [phieu_dat_san_id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Hóa đơn đã được tạo', hoa_don_id: this.lastID });
        }
      );
    }
  );
});

module.exports = router;