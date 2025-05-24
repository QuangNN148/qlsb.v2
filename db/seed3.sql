-- Chèn dữ liệu vào khach_hang
INSERT INTO khach_hang (ho_ten, sdt, email) VALUES
('Nguyen Van A', '0901234567', 'nva@example.com'),
('Tran Thi B', '0912345678', 'ttb@example.com');

-- Chèn dữ liệu vào phieu_dat_san
INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc) VALUES
(1, '2023-03-10', 500000, 100000),
(1, '2024-06-15', 600000, 120000),
(2, '2025-01-20', 700000, 150000);

-- Chèn dữ liệu vào hoa_don
INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai) VALUES
(1, '2023-03-15', 500000, 400000, 100000),
(1, '2023-07-20', 550000, 550000, 0),
(2, '2024-06-20', 600000, 500000, 100000),
(2, '2024-09-10', 650000, 650000, 0),
(3, '2025-01-25', 700000, 600000, 100000),
(3, '2025-04-05', 720000, 720000, 0);