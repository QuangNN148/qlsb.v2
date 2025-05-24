import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Thống Kê Doanh Thu',
  description: 'Ứng dụng thống kê doanh thu sân bóng',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Quản Lý Sân Bóng</h1>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:underline">Thống Kê Doanh Thu</a>
              </li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}