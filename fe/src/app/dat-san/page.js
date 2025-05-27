'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function DatSan() {
  const [step, setStep] = useState(1);
  const [khungGio, setKhungGio] = useState('');
  const [loaiSan, setLoaiSan] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');
  const [sanTrong, setSanTrong] = useState([]);
  const [hoTen, setHoTen] = useState('');
  const [khachHangList, setKhachHangList] = useState([]);
  const [khachHang, setKhachHang] = useState(null);
  const [newKhachHang, setNewKhachHang] = useState({ ho_ten: '', sdt: '', email: '' });
  const [selectedSan, setSelectedSan] = useState(null);
  const [giaThue, setGiaThue] = useState(0);
  const [error, setError] = useState(null);
  const [phieuDatSan, setPhieuDatSan] = useState(null);

  const findSanTrong = async () => {
    if (!khungGio || !ngayBatDau || !ngayKetThuc) {
      setError('Vui lòng nhập đầy đủ khung giờ, ngày bắt đầu và ngày kết thúc');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3001/api/dat-san/san-trong', {
        params: { khung_gio: khungGio, loai_san: loaiSan, ngay_bat_dau: ngayBatDau, ngay_ket_thuc: ngayKetThuc }
      });
      setSanTrong(response.data.data);
      setError(null);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tìm sân trống');
    }
  };

  const findKhachHang = async () => {
    if (!hoTen) {
      setError('Vui lòng nhập tên khách hàng');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3001/api/dat-san/khach-hang', {
        params: { ho_ten: hoTen }
      });
      setKhachHangList(response.data.data);
      setError(null);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tìm khách hàng');
    }
  };

  const addNewKhachHang = async () => {
    if (!newKhachHang.ho_ten) {
      setError('Vui lòng nhập tên khách hàng mới');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/dat-san/khach-hang', newKhachHang);
      setKhachHang(response.data);
      setError(null);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi thêm khách hàng');
    }
  };

  const calculateTongTien = () => {
    const start = new Date(ngayBatDau);
    const end = new Date(ngayKetThuc);
    const weeks = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
    const tongBuoi = weeks; // Assume 1 session per week
    const tongTien = tongBuoi * giaThue;
    const tienDatCoc = tongTien * 0.1;
    return { tongBuoi, tongTien, tienDatCoc };
  };

  const confirmPhieuDatSan = async () => {
    if (!khachHang || !selectedSan || !giaThue) {
      setError('Vui lòng chọn sân và nhập giá thuê');
      return;
    }
    const { tongBuoi, tongTien, tienDatCoc } = calculateTongTien();
    const phieu = {
      khach_hang_id: khachHang.id,
      ngay_dat: new Date().toISOString().split('T')[0],
      chi_tiet: [{
        san_bong_id: selectedSan.id,
        khung_gio: khungGio,
        ngay_bat_dau: ngayBatDau,
        ngay_ket_thuc: ngayKetThuc,
        gia_thue_mot_buoi: giaThue
      }],
      tong_tien_du_kien: tongTien,
      tien_dat_coc: tienDatCoc
    };
    try {
      const response = await axios.post('http://localhost:3001/api/dat-san/phieu-dat-san', phieu);
      setPhieuDatSan({ ...phieu, id: response.data.phieu_dat_san_id });
      setError(null);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tạo phiếu đặt sân');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đặt Sân</h1>
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">Quay lại</Link>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {step === 1 && (
        <div>
          <h2 className="text-xl mb-2">Bước 1: Tìm sân trống</h2>
          <div className="mb-4">
            <label className="block mb-1">Khung giờ (VD: 17:00-19:00):</label>
            <input
              type="text"
              value={khungGio}
              onChange={(e) => setKhungGio(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Loại sân (VD: 5v5, 7v7):</label>
            <input
              type="text"
              value={loaiSan}
              onChange={(e) => setLoaiSan(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Ngày bắt đầu:</label>
            <input
              type="date"
              value={ngayBatDau}
              onChange={(e) => setNgayBatDau(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Ngày kết thúc:</label>
            <input
              type="date"
              value={ngayKetThuc}
              onChange={(e) => setNgayKetThuc(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <button
            onClick={findSanTrong}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Tìm sân trống
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl mb-2">Bước 2: Chọn sân</h2>
          {sanTrong.length > 0 ? (
            <table className="w-full border-collapse border mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Tên sân</th>
                  <th className="border p-2">Loại sân</th>
                  <th className="border p-2">Mô tả</th>
                  <th className="border p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sanTrong.map((san) => (
                  <tr key={san.id}>
                    <td className="border p-2">{san.ten_san}</td>
                    <td className="border p-2">{san.loai_san}</td>
                    <td className="border p-2">{san.mo_ta}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => { setSelectedSan(san); setStep(3); }}
                        className="bg-green-600 text-white p-1 rounded"
                      >
                        Chọn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không có sân trống</p>
          )}
          <button
            onClick={() => setStep(1)}
            className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl mb-2">Bước 3: Tìm hoặc thêm khách hàng</h2>
          <div className="mb-4">
            <label className="block mb-1">Tên khách hàng:</label>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <button
              onClick={findKhachHang}
              className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700"
            >
              Tìm khách hàng
            </button>
          </div>
          {khachHangList.length > 0 && (
            <table className="w-full border-collapse border mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Tên khách hàng</th>
                  <th className="border p-2">SĐT</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {khachHangList.map((kh) => (
                  <tr key={kh.id}>
                    <td className="border p-2">{kh.ho_ten}</td>
                    <td className="border p-2">{kh.sdt}</td>
                    <td className="border p-2">{kh.email}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => { setKhachHang(kh); setStep(4); }}
                        className="bg-green-600 text-white p-1 rounded"
                      >
                        Chọn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mb-4">
            <h3 className="text-lg mb-2">Thêm khách hàng mới</h3>
            <input
              type="text"
              placeholder="Họ tên"
              value={newKhachHang.ho_ten}
              onChange={(e) => setNewKhachHang({ ...newKhachHang, ho_ten: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="SĐT"
              value={newKhachHang.sdt}
              onChange={(e) => setNewKhachHang({ ...newKhachHang, sdt: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newKhachHang.email}
              onChange={(e) => setNewKhachHang({ ...newKhachHang, email: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <button
              onClick={addNewKhachHang}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Thêm khách hàng mới
            </button>
          </div>
          <button
            onClick={() => setStep(2)}
            className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl mb-2">Bước 4: Nhập giá thuê và xác nhận</h2>
          <div className="mb-4">
            <label className="block mb-1">Giá thuê một buổi (VNĐ):</label>
            <input
              type="number"
              value={giaThue}
              onChange={(e) => setGiaThue(Number(e.target.value))}
              className="p-2 border rounded w-full"
            />
          </div>
          <button
            onClick={confirmPhieuDatSan}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Xác nhận phiếu đặt sân
          </button>
          <button
            onClick={() => setStep(3)}
            className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 ml-2"
          >
            Quay lại
          </button>
        </div>
      )}

      {step === 5 && phieuDatSan && (
        <div>
          <h2 className="text-xl mb-2">Bước 5: Phiếu đặt sân</h2>
          <div className="border p-4 mb-4">
            <p><strong>Ngày đặt:</strong> {phieuDatSan.ngay_dat}</p>
            <p><strong>Khách hàng:</strong> {khachHang.ho_ten}</p>
            <p><strong>SĐT:</strong> {khachHang.sdt || 'N/A'}</p>
            <p><strong>Email:</strong> {khachHang.email || 'N/A'}</p>
            <h3 className="text-lg mt-2">Chi tiết đặt sân:</h3>
            <table className="w-full border-collapse border mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Tên sân</th>
                  <th className="border p-2">Khung giờ</th>
                  <th className="border p-2">Ngày bắt đầu</th>
                  <th className="border p-2">Ngày kết thúc</th>
                  <th className="border p-2">Giá thuê một buổi</th>
                </tr>
              </thead>
              <tbody>
                {phieuDatSan.chi_tiet.map((ct, index) => (
                  <tr key={index}>
                    <td className="border p-2">{selectedSan.ten_san}</td>
                    <td className="border p-2">{ct.khung_gio}</td>
                    <td className="border p-2">{ct.ngay_bat_dau}</td>
                    <td className="border p-2">{ct.ngay_ket_thuc}</td>
                    <td className="border p-2">{ct.gia_thue_mot_buoi.toLocaleString('vi-VN')} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p><strong>Tổng số buổi:</strong> {calculateTongTien().tongBuoi}</p>
            <p><strong>Tổng tiền dự kiến:</strong> {phieuDatSan.tong_tien_du_kien.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Tiền đặt cọc:</strong> {phieuDatSan.tien_dat_coc.toLocaleString('vi-VN')} VNĐ</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            In phiếu đặt sân
          </button>
          <Link href="/" className="text-blue-600 hover:underline ml-4">
            Hoàn tất
          </Link>
        </div>
      )}
    </div>
  );
}