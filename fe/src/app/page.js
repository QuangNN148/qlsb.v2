'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-sky-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-sky-950 mb-8 text-center">
          Hệ Thống Quản Lý Sân Bóng
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Đặt Sân */}
          <Link href="/dat-san" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition duration-300 ease-in-out">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-sky-900 mb-2">Đặt Sân</h2>
              <p className="text-sky-600">Đặt sân bóng, xem lịch trống và quản lý lịch đặt sân.</p>
            </div>
          </Link>

          {/* Card Thanh Toán */}
          <Link href="/thanh-toan" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition duration-300 ease-in-out">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-emerald-900 mb-2">Thanh Toán</h2>
              <p className="text-emerald-600">Xử lý thanh toán, in hóa đơn và quản lý công nợ.</p>
            </div>
          </Link>

          {/* Card Thống Kê */}
          <Link href="/thong-ke" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition duration-300 ease-in-out">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-indigo-900 mb-2">Thống Kê</h2>
              <p className="text-indigo-600">Xem báo cáo doanh thu theo tháng, quý và năm.</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Thông tin hệ thống</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sky-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-sky-600">Giờ mở cửa</p>
                <p className="font-medium">06:00 - 22:00</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-sky-600">Liên hệ</p>
                <p className="font-medium">0123 456 789</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-sky-600">Địa chỉ</p>
                <p className="font-medium">123 Đường ABC, Quận XYZ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}