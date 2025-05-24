'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DoanhThu() {
  const searchParams = useSearchParams();
  const kieu = searchParams.get('kieu') || 'thang';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3001/api/thong-ke?kieu=${kieu}`);
        setData(response.data || []);   
        console.log(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Lỗi khi lấy dữ liệu');
      }
      setLoading(false);
    };
    fetchData();
  }, [kieu]);

  const formatKyThongKe = (ky) => {
    if (kieu === 'thang') {
      const [year, month] = ky.split('-');
      return `Tháng ${parseInt(month)}/${year}`;
    } else if (kieu === 'quy') {
      const [year, quarter] = ky.split('-Q');
      return `Quý ${quarter}/${year}`;
    } else {
      return `Năm ${ky}`;
    }
  };

  const getChiTietParams = (ky) => {
    if (kieu === 'thang') {
      const [year, month] = ky.split('-');
      return { kieu: 'thang', thang: parseInt(month), nam: year };
    } else if (kieu === 'quy') {
      const [year, quarter] = ky.split('-Q');
      return { kieu: 'quy', quy: `Q${quarter}`, nam: year };
    } else {
      return { kieu: 'nam', nam: ky };
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thống Kê Doanh Thu</h1>
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        Quay lại chọn loại thống kê
      </Link>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Thời gian</th>
              <th className="border p-2">Tổng doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ky_thong_ke} className="hover:bg-gray-100 cursor-pointer">
                <td className="border p-2">
                  <Link
                    href={{
                      pathname: '/thong-ke/chi-tiet',
                      query: getChiTietParams(item.ky_thong_ke),
                    }}
                  >
                    {formatKyThongKe(item.ky_thong_ke)}
                  </Link>
                </td>
                <td className="border p-2">{item.tong_doanh_thu.toLocaleString('vi-VN')} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}