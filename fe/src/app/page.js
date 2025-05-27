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
    <div className="container mx-auto p-6 bg-gradient-to-br from-sky-50 to-indigo-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-8">
        <h1 className="text-3xl font-bold text-sky-950 mb-8 text-center">
          Thống Kê Doanh Thu
        </h1>
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
    </div>
  );
}