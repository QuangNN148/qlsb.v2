'use client';
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

// Loading overlay component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-sky-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white/90 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sky-900 font-medium">Đang xử lý...</p>
      </div>
    </div>
  </div>
);

// Confirmation dialog component
const ConfirmDialog = ({ onConfirm, onCancel, amount }) => (
  <div className="fixed inset-0 bg-sky-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-lg w-full mx-4">
      <h3 className="text-xl font-semibold text-sky-900 mb-4">Xác nhận thanh toán</h3>
      <p className="text-sky-800 mb-6">
        Bạn có chắc chắn muốn xác nhận thanh toán với số tiền{' '}
        <span className="font-semibold text-emerald-700">
          {amount.toLocaleString('vi-VN')} VNĐ
        </span>
        ?
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out"
        >
          Hủy bỏ
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-150 ease-in-out"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
);

// Formatting utilities
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0';
  return amount.toLocaleString('vi-VN');
};

const parseCurrency = (value) => {
  if (!value) return 0;
  // Remove all non-digit characters
  const number = value.replace(/[^\d]/g, '');
  return parseInt(number, 10);
};

// Progress indicator component
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    'Tìm khách hàng',
    'Chọn khách hàng',
    'Chọn phiếu đặt sân',
    'Xác nhận thanh toán',
    'Hoàn tất'
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index + 1 <= currentStep
                ? 'bg-sky-600 text-white'
                : 'bg-sky-100 text-sky-400'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 w-16 mx-2 ${
                index + 1 < currentStep ? 'bg-sky-600' : 'bg-sky-100'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <span key={index} className={`text-sm ${
            index + 1 <= currentStep ? 'text-sky-600' : 'text-sky-400'
          }`}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function ThanhToan() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hoTen, setHoTen] = useState('');
  const [khachHangList, setKhachHangList] = useState([]);
  const [khachHang, setKhachHang] = useState(null);
  const [phieuDatSanList, setPhieuDatSanList] = useState([]);
  const [selectedPhieu, setSelectedPhieu] = useState(null);
  const [chiTietDat, setChiTietDat] = useState([]);
  const [matHang, setMatHang] = useState([]);
  const [duNo, setDuNo] = useState(0);
  const [tienThucTra, setTienThucTra] = useState(0);
  const [error, setError] = useState(null);

  const calculateTongTien = () => {
    const tongTienThue = chiTietDat.reduce((sum, item) => {
      const start = new Date(item.ngay_bat_dau);
      const end = new Date(item.ngay_ket_thuc);
      const weeks = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
      return sum + (weeks * item.gia_thue_mot_buoi);
    }, 0);

    const tongTienMatHang = chiTietMuaHang.reduce((sum, item) => {
      return sum + (item.so_luong * item.gia_ban);  
    }, 0);

    const tongTienPhaiTra = tongTienThue + tongTienMatHang;
    const tienConNo = tongTienPhaiTra - tienDaDong;

    return {
      tongTienThue,
      tongTienMatHang,  
      tongTienPhaiTra,
      tienConNo
    };
  };

  const findKhachHang = async () => {
    if (!hoTen) {
      setError('Vui lòng nhập tên khách hàng');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/thanh-toan/khach-hang', {
        params: { ho_ten: hoTen }
      });
      setKhachHangList(response.data.data);
      setError(null);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tìm khách hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const getPhieuDatSan = async (khach_hang_id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/thanh-toan/phieu-dat-san/${khach_hang_id}`);
      setPhieuDatSanList(response.data.data);
      setError(null);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi lấy phiếu đặt sân');
    } finally {
      setIsLoading(false);
    }
  };

  const getChiTietPhieu = async (phieu_id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/thanh-toan/phieu-dat-san/${phieu_id}/chi-tiet`);
      setChiTietDat(response.data.chi_tiet_dat);
      setMatHang(response.data.mat_hang);
      setDuNo(response.data.du_no);
      setError(null);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi lấy chi tiết phiếu');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMatHang = async (mat_hang_id, ngay_su_dung, so_luong) => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3001/api/thanh-toan/mat-hang', {
        phieu_dat_san_id: selectedPhieu.id,
        mat_hang_id,
        ngay_su_dung,
        so_luong
      });
      await getChiTietPhieu(selectedPhieu.id); // Refresh data
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi cập nhật mặt hàng');
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    if (tienThucTra <= 0 || tienThucTra > calculateTongTien().tongTienPhaiTra) {
      setError('Số tiền thanh toán không hợp lệ');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmHoaDon = async () => {
    setIsLoading(true);
    const { tongTienThue, tongTienMatHang, tongTienPhaiTra, tienConNo } = calculateTongTien();
    try {
      await axios.post('http://localhost:3001/api/thanh-toan/hoa-don', {
        phieu_dat_san_id: selectedPhieu.id,
        ngay_thanh_toan: new Date().toISOString().split('T')[0],
        tong_tien_thue: tongTienThue,
        tong_tien_mat_hang: tongTienMatHang,
        tong_tien_phai_tra: tongTienPhaiTra,
        tien_thuc_tra: tienThucTra,
        tien_con_no: tienConNo
      });
      setError(null);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tạo hóa đơn');
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {showConfirmDialog && (
        <ConfirmDialog
          onConfirm={confirmHoaDon}
          onCancel={() => setShowConfirmDialog(false)}
          amount={tienThucTra}
        />
      )}
      <div className="container mx-auto p-6 bg-gradient-to-br from-sky-50 to-indigo-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-sky-950">Thanh Toán</h1>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out gap-2 no-print"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại
            </Link>
          </div>

        <ProgressSteps currentStep={step} />
        
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

        {/* Step 1: Search customer */}
        {step === 1 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 1: Tìm khách hàng</h2>
            <div className="bg-white/70 rounded-lg p-6">
              <label className="block text-sky-800 font-medium mb-2">Tên khách hàng:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  placeholder="Nhập tên khách hàng..."
                  className="flex-1 p-3 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out"
                />
                <button
                  onClick={findKhachHang}
                  className="px-6 bg-sky-600 text-white rounded-lg hover:bg-sky-700 active:bg-sky-800 transition duration-150 ease-in-out font-medium"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select customer */}
        {step === 2 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 2: Chọn khách hàng</h2>
            {khachHangList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white/50 mb-6">
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
                            onClick={() => { setKhachHang(kh); getPhieuDatSan(kh.id); }}
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
            ) : (
              <div className="bg-white/70 rounded-lg p-6 text-center text-sky-800">
                Không tìm thấy khách hàng nào.
              </div>
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

        {/* Step 3: Select booking */}
        {step === 3 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 3: Chọn phiếu đặt sân</h2>
            {phieuDatSanList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white/50 mb-6">
                  <thead>
                    <tr className="bg-sky-100/80">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Ngày đặt</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">Tổng tiền dự kiến</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">Tiền đặt cọc</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-sky-900">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {phieuDatSanList.map((phieu) => (
                      <tr key={phieu.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 font-medium text-sky-900">#{phieu.id}</td>
                        <td className="px-6 py-4 text-sky-800">{phieu.ngay_dat}</td>
                        <td className="px-6 py-4 text-right text-emerald-700 font-medium">
                          {phieu.tong_tien_du_kien.toLocaleString('vi-VN')} VNĐ
                        </td>
                        <td className="px-6 py-4 text-right text-emerald-700 font-medium">
                          {phieu.tien_dat_coc.toLocaleString('vi-VN')} VNĐ
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => { setSelectedPhieu(phieu); getChiTietPhieu(phieu.id); }}
                            className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition duration-150 ease-in-out"
                          >
                            Thanh toán
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/70 rounded-lg p-6 text-center text-sky-800">
                Không có phiếu đặt sân nào.
              </div>
            )}
            
            <button
              onClick={() => setStep(2)}
              className="mt-6 inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại
            </button>
          </div>
        )}

        {/* Step 4: Edit invoice */}
        {step === 4 && selectedPhieu && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 4: Xem và chỉnh sửa hóa đơn</h2>
            <div className="bg-white/70 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sky-900"><span className="font-medium">Khách hàng:</span> {khachHang.ho_ten}</p>
                  <p className="text-sky-900"><span className="font-medium">SĐT:</span> {khachHang.sdt || 'N/A'}</p>
                  <p className="text-sky-900"><span className="font-medium">Email:</span> {khachHang.email || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sky-900 bg-red-50/50 p-2 rounded-lg">
                    <span className="font-medium text-red-700">Dư nợ cũ:</span> 
                    <span className="text-red-700"> {duNo.toLocaleString('vi-VN')} VNĐ</span>
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-4">Chi tiết thuê sân</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white/50 mb-6">
                  <thead>
                    <tr className="bg-sky-100/80">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Tên sân</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Loại sân</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Khung giờ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Ngày bắt đầu</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Ngày kết thúc</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">Giá thuê/buổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {chiTietDat.map((ct) => (
                      <tr key={ct.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 font-medium text-sky-900">{ct.ten_san}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                            {ct.loai_san}
                          </span>
                        </td>
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
              </div>              <h3 className="text-xl font-semibold text-sky-900 mb-4">Mặt hàng phát sinh</h3>
              {matHang.length > 0 ? (
                Object.entries(
                  matHang.reduce((acc, item) => {
                    acc[item.ngay_su_dung] = acc[item.ngay_su_dung] || [];
                    acc[item.ngay_su_dung].push(item);
                    return acc;
                  }, {})
                ).map(([ngay, items]) => (
                  <div key={ngay} className="mb-4">
                    <h4 className="text-lg font-medium text-sky-900 mb-3">
                      Ngày: <span className="text-sky-700">{ngay}</span>
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-white/50">
                        <thead>
                          <tr className="bg-sky-100/80">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Mã MH</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Tên MH</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">Đơn giá</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-sky-900">Số lượng</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">Thành tiền</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-sky-900">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100">
                          {items.map((item) => (
                            <tr key={item.mat_hang_id} className="hover:bg-sky-50/50 transition-colors duration-150">
                              <td className="px-6 py-4 font-medium text-sky-900">{item.ma_mh}</td>
                              <td className="px-6 py-4 text-sky-800">{item.ten_mh}</td>
                              <td className="px-6 py-4 text-right text-sky-800">
                                {item.don_gia.toLocaleString('vi-VN')} VNĐ
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <input
                                    type="number"
                                    value={item.so_luong}
                                    onChange={(e) => updateMatHang(item.mat_hang_id, item.ngay_su_dung, Number(e.target.value))}
                                    className="w-20 text-center p-2 border border-sky-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                    min="0"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right font-medium text-emerald-700">
                                {item.thanh_tien.toLocaleString('vi-VN')} VNĐ
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => updateMatHang(item.mat_hang_id, item.ngay_su_dung, 0)}
                                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-150 ease-in-out text-sm"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/70 rounded-lg p-6 text-center text-sky-800">
                  Không có mặt hàng phát sinh.
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-150 ease-in-out"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Success message */}
        {step === 5 && (
          <div className="bg-white/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-sky-900 mb-6">Bước 5: Hoàn tất</h2>
            <div className="bg-white/70 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.293-11.293a1 1 0 00-1.414 0L10 10.586 8.121 8.707a1 1 0 00-1.415 1.415l2.879 2.878a1 1 0 001.415 0l5.657-5.657a1 1 0 00-1.415-1.415L10 13.586l-2.879-2.878a1 1 0 00-1.415 1.415L10 15.586l4.293-4.293a1 1 0 000-1.415z" clipRule="evenodd" />
              </svg>
              <p className="text-sky-800 text-lg mb-4">
                Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.
              </p>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-150 ease-in-out"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
