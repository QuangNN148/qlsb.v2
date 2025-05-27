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
    <div className="container mx-auto p-6 bg-gradient-to-br from-sky-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sky-950">Đặt Sân</h1>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 1: Tìm sân trống</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sky-800 font-medium mb-2">Khung giờ:</label>
                  <input
                    type="text"
                    placeholder="VD: 17:00-19:00"
                    value={khungGio}
                    onChange={(e) => setKhungGio(e.target.value)}
                    className="w-full p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sky-800 font-medium mb-2">Loại sân:</label>
                  <input
                    type="text"
                    placeholder="VD: 5v5, 7v7"
                    value={loaiSan}
                    onChange={(e) => setLoaiSan(e.target.value)}
                    className="w-full p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sky-800 font-medium mb-2">Ngày bắt đầu:</label>
                  <input
                    type="date"
                    value={ngayBatDau}
                    onChange={(e) => setNgayBatDau(e.target.value)}
                    className="w-full p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sky-800 font-medium mb-2">Ngày kết thúc:</label>
                  <input
                    type="date"
                    value={ngayKetThuc}
                    onChange={(e) => setNgayKetThuc(e.target.value)}
                    className="w-full p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={findSanTrong}
              className="mt-6 w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 active:bg-sky-800 transition duration-150 ease-in-out font-medium text-lg shadow-sm hover:shadow-md border border-sky-700"
            >
              Tìm sân trống
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 2: Chọn sân</h2>
            {sanTrong.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white/50">
                  <thead>
                    <tr className="bg-sky-100/80">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Tên sân</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Loại sân</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Mô tả</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-sky-900">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {sanTrong.map((san) => (
                      <tr key={san.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 font-medium text-sky-900">{san.ten_san}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                            {san.loai_san}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sky-800">{san.mo_ta}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => { setSelectedSan(san); setStep(3); }}
                            className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition duration-150 ease-in-out"
                          >
                            Chọn sân
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-sky-800">Không có sân trống</div>
            )}
            <button
              onClick={() => setStep(1)}
              className="mt-6 inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 3: Tìm hoặc thêm khách hàng</h2>
            <div className="space-y-6">
              <div className="bg-white/70 rounded-lg p-4">
                <label className="block text-sky-800 font-medium mb-2">Tìm khách hàng:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tên khách hàng..."
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    className="flex-1 p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  />
                  <button
                    onClick={findKhachHang}
                    className="px-6 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-150 ease-in-out"
                  >
                    Tìm
                  </button>
                </div>
              </div>

              {khachHangList.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white/50">
                    <thead>
                      <tr className="bg-sky-100/80">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Tên khách hàng</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">SĐT</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Email</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-sky-900">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {khachHangList.map((kh) => (
                        <tr key={kh.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 font-medium text-sky-900">{kh.ho_ten}</td>
                          <td className="px-6 py-4 text-sky-800">{kh.sdt || 'N/A'}</td>
                          <td className="px-6 py-4 text-sky-800">{kh.email || 'N/A'}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => { setKhachHang(kh); setStep(4); }}
                              className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition duration-150 ease-in-out"
                            >
                              Chọn
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="bg-white/70 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-sky-900 mb-4">Thêm khách hàng mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Họ tên"
                    value={newKhachHang.ho_ten}
                    onChange={(e) => setNewKhachHang({ ...newKhachHang, ho_ten: e.target.value })}
                    className="p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  />
                  <input
                    type="text"
                    placeholder="SĐT"
                    value={newKhachHang.sdt}
                    onChange={(e) => setNewKhachHang({ ...newKhachHang, sdt: e.target.value })}
                    className="p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newKhachHang.email}
                    onChange={(e) => setNewKhachHang({ ...newKhachHang, email: e.target.value })}
                    className="p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out md:col-span-2"
                  />
                </div>
                <button
                  onClick={addNewKhachHang}
                  className="mt-4 w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition duration-150 ease-in-out"
                >
                  Thêm khách hàng mới
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Quay lại
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 4: Nhập giá thuê và xác nhận</h2>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-sky-800 font-medium mb-2">Giá thuê một buổi (VNĐ):</label>
                <input
                  type="number"
                  value={giaThue}
                  onChange={(e) => setGiaThue(Number(e.target.value))}
                  className="w-full p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                  placeholder="Nhập giá thuê..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={confirmPhieuDatSan}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-150 ease-in-out"
                >
                  Xác nhận phiếu đặt sân
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 5 && phieuDatSan && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 5: Phiếu đặt sân</h2>
            <div className="bg-white/70 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sky-800">
                <div>
                  <p className="font-medium">Ngày đặt:</p>
                  <p className="text-sky-900">{phieuDatSan.ngay_dat}</p>
                </div>
                <div>
                  <p className="font-medium">Khách hàng:</p>
                  <p className="text-sky-900">{khachHang.ho_ten}</p>
                </div>
                <div>
                  <p className="font-medium">SĐT:</p>
                  <p className="text-sky-900">{khachHang.sdt || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-sky-900">{khachHang.email || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sky-900 mb-4">Chi tiết đặt sân:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white/50">
                    <thead>
                      <tr className="bg-sky-100/80">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Tên sân</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Khung giờ</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Ngày bắt đầu</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Ngày kết thúc</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">Giá thuê một buổi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {phieuDatSan.chi_tiet.map((ct, index) => (
                        <tr key={index} className="hover:bg-sky-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 font-medium text-sky-900">{selectedSan.ten_san}</td>
                          <td className="px-6 py-4 text-sky-800">{ct.khung_gio}</td>
                          <td className="px-6 py-4 text-sky-800">{ct.ngay_bat_dau}</td>
                          <td className="px-6 py-4 text-sky-800">{ct.ngay_ket_thuc}</td>
                          <td className="px-6 py-4 text-right text-emerald-700 font-medium">
                            {ct.gia_thue_mot_buoi.toLocaleString('vi-VN')} VNĐ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-sky-50/50 rounded-lg p-4 space-y-2">
                <p className="flex justify-between">
                  <span className="font-medium text-sky-900">Tổng số buổi:</span>
                  <span className="text-sky-800">{calculateTongTien().tongBuoi} buổi</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-sky-900">Tổng tiền dự kiến:</span>
                  <span className="text-emerald-700 font-semibold">{phieuDatSan.tong_tien_du_kien.toLocaleString('vi-VN')} VNĐ</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-sky-900">Tiền đặt cọc:</span>
                  <span className="text-emerald-700 font-semibold">{phieuDatSan.tien_dat_coc.toLocaleString('vi-VN')} VNĐ</span>
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition duration-150 ease-in-out"
                >
                  In phiếu đặt sân
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out"
                >
                  Hoàn tất
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}