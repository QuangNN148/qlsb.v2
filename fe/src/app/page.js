'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [type, setType] = useState('thang');

  const handleSelect = () => {
    router.push(`/thong-ke?kieu=${type}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thống Kê Doanh Thu</h1>
      <div className="mb-4">
        <label htmlFor="type" className="mr-2">Chọn loại thống kê:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded mr-2"
        >
          <option value="thang">Theo tháng</option>
          <option value="quy">Theo quý</option>
          <option value="nam">Theo năm</option>
        </select>
        <button
          onClick={handleSelect}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Xem thống kê
        </button>
      </div>
    </div>
  );
}