'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ThongKe() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [type, setType] = useState('thang');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chiTietData, setChiTietData] = useState([]);

  // Lấy params từ URL cho chi tiết
  const kieu = searchParams.get('kieu');
  const thang = searchParams.get('thang');
  const quy = searchParams.get('quy');
  const nam = searchParams.get('nam');

  useEffect(() => {
    if (kieu) {
      setType(kieu);
      setStep(2);
      fetchDoanhThu(kieu);
    }
  }, [kieu]);

  useEffect(() => {
    if (kieu && nam) {
      setStep(3);
      fetchChiTiet();
    }
  }, [kieu, thang, quy, nam]);

  const fetchDoanhThu = async (loaiThongKe) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/thong-ke?kieu=${loaiThongKe}`);
      setData(response.data || []);   
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi lấy dữ liệu');
    }
    setLoading(false);
  };

  const fetchChiTiet = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:3001/api/thong-ke/chi-tiet?kieu=${kieu}&nam=${nam}`;
      if (kieu === 'thang') url += `&thang=${thang}`;
      if (kieu === 'quy') url += `&quy=${quy}`;
      const response = await axios.get(url);
      setChiTietData(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi lấy dữ liệu chi tiết');
    }
    setLoading(false);
  };

  const handleSelect = () => {
    setStep(2);
    fetchDoanhThu(type);
  };

  const formatKyThongKe = (ky) => {
    if (type === 'thang') {
      const [year, month] = ky.split('-');
      return `Tháng ${parseInt(month)}/${year}`;
    } else if (type === 'quy') {
      const [year, quarter] = ky.split('-Q');
      return `Quý ${quarter}/${year}`;
    } else {
      return `Năm ${ky}`;
    }
  };

  const formatChiTietTitle = () => {
    if (kieu === 'thang') return `Chi tiết hóa đơn - Tháng ${thang}/${nam}`;
    if (kieu === 'quy') return `Chi tiết hóa đơn - Quý ${quy.replace('Q', '')}/${nam}`;
    return `Chi tiết hóa đơn - Năm ${nam}`;
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-sky-50 to-indigo-50 min-h-screen">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-8">
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-sky-950 mb-8 text-center">
              Thống Kê Doanh Thu
            </h1>
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <label 
                    htmlFor="type" 
                    className="text-lg font-medium text-sky-900"
                  >
                    Chọn loại thống kê:
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border border-sky-200 rounded-lg bg-white/70 
                      focus:ring-2 focus:ring-sky-400 focus:border-sky-400 
                      transition duration-150 ease-in-out text-sky-900"
                  >
                    <option value="thang">Theo tháng</option>
                    <option value="quy">Theo quý</option>
                    <option value="nam">Theo năm</option>
                  </select>
                </div>
                <button
                  onClick={handleSelect}
                  className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg 
                    hover:bg-sky-700 active:bg-sky-800
                    transition duration-150 ease-in-out font-medium text-lg 
                    shadow-sm hover:shadow-md border border-sky-700"
                >
                  Xem thống kê
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-sky-950">Thống Kê Doanh Thu</h1>
              <button 
                onClick={() => setStep(1)}
                className="inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Quay lại chọn loại thống kê
              </button>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
              </div>
            )}

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

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white/50">
                  <thead>
                    <tr className="bg-sky-100/80">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">
                        Thời gian
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">
                        Tổng doanh thu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {data.map((item) => (
                      <tr key={item.ky_thong_ke} className="hover:bg-sky-50/50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <Link
                            href={{
                              pathname: '/thong-ke',
                              query: {
                                kieu: type,
                                ...(type === 'thang' && { thang: item.ky_thong_ke.split('-')[1] }),
                                ...(type === 'quy' && { quy: `Q${item.ky_thong_ke.split('-Q')[1]}` }),
                                nam: type === 'nam' ? item.ky_thong_ke : item.ky_thong_ke.split('-')[0]
                              },
                            }}
                            className="text-sky-700 hover:text-sky-900 font-medium"
                          >
                            {formatKyThongKe(item.ky_thong_ke)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-700">
                          {item.tong_doanh_thu.toLocaleString('vi-VN')} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-sky-950">{formatChiTietTitle()}</h1>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition duration-150 ease-in-out gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Quay lại bảng doanh thu
              </button>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
              </div>
            )}

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

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white/50">
                  <thead>
                    <tr className="bg-sky-100/80">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Tên khách hàng</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Tên sân</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Kiểu sân</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">Ngày giờ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-sky-900">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {chiTietData.map((item) => (
                      <tr key={item.id} className="hover:bg-sky-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sky-700">{item.id}</td>
                        <td className="px-6 py-4 font-medium text-sky-900">{item.ho_ten}</td>
                        <td className="px-6 py-4 text-sky-800">{item.ten_san}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">
                            {item.loai_san}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sky-700">{item.ngay_gio}</td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-700">
                          {item.tong_tien.toLocaleString('vi-VN')} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}