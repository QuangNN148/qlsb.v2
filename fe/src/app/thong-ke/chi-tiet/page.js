'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ChiTiet() {
  const searchParams = useSearchParams();
  const kieu = searchParams.get('kieu');
  const thang = searchParams.get('thang');
  const quy = searchParams.get('quy');
  const nam = searchParams.get('nam');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `http://localhost:3001/api/thong-ke/chi-tiet?kieu=${kieu}&nam=${nam}`;
        if (kieu === 'thang') url += `&thang=${thang}`;
        if (kieu === 'quy') url += `&quy=${quy}`;
        const response = await axios.get(url);
        setData(response.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Lỗi khi lấy dữ liệu chi tiết');
      }
      setLoading(false);
    };
    if (kieu && nam) fetchData();
  }, [kieu, thang, quy, nam]);

  const formatTitle = () => {
    if (kieu === 'thang') return `Chi tiết hóa đơn - Tháng ${thang}/${nam}`;
    if (kieu === 'quy') return `Chi tiết hóa đơn - Quý ${quy.replace('Q', '')}/${nam}`;
    return `Chi tiết hóa đơn - Năm ${nam}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{formatTitle()}</h1>
      <Link href="/thong-ke" className="text-blue-600 hover:underline mb-4 inline-block">
        Quay lại bảng doanh thu
      </Link>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Tên khách hàng</th>
              <th className="border p-2">Tên sân</th>
              <th className="border p-2">Kiểu sân</th>
              <th className="border p-2">Ngày giờ</th>
              <th className="border p-2">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.ho_ten}</td>
                <td className="border p-2">{item.ten_san}</td>
                <td className="border p-2">{item.loai_san}</td>
                <td className="border p-2">{item.ngay_gio}</td>
                <td className="border p-2">{item.tong_tien.toLocaleString('vi-VN')} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}