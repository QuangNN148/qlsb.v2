# Frontend với Next.js

## I. Cài đặt

```sh
npx create-next-app@latest frontend --js --tailwind --eslint --app --import-alias "@/*" --src-dir --no-experimental-app --turbopack --yes
cd frontend
# axios để gọi API, classnames để gộp CSS, date-fns để xử lý ngày tháng.
npm install axios classnames date-fns
```

## II. Cấu trúc thư mục

```plaintext
frontend/
├── public/                     # Thư mục chứa tài nguyên tĩnh
├── src/
│   ├── app/                    # Các trang của ứng dụng
│   │   └── page.tsx            # Giao diện chính
│   ├── components/             # Các component tái sử dụng
│   │   ├── BangDoanhThu.tsx    # Bảng doanh thu theo tháng,quý,năm
│   │   ├── ChiTietHoaDon.tsx  # Danh sách chi tiết hóa đơn theo tháng,quý,năm
│   │   ├── FilterBar.tsx       # Thanh điều khiển chọn kiểu thống kê theo tháng/quý/năm
│   │   ├── ThongKePage.tsx #Xử lí chức năng thống kê
│   │   ├── CheckoutPage.tsx #Xử lí chức năng cập nhật mặt hàng đã dùng trong buổi...
│   │   ├── DatSanPage.tsx  # Xử lí chức năng đặt sân
│   │   ├── SanBongPage.tsx  # Xử lí chức năng quản lí thông tin sân bóng
│   │   ├──ThanhToanPage.tsx  # Xử lí chức năng thanh toán
│   │
│   │
│   ├── lib/
│   │   └── api.ts              # Gọi API
│   ├── types/
│   │   └── types.ts            # Định nghĩa kiểu dữ liệu
├── tailwind.config.js          # Cấu hình Tailwind
```

## III. Tích hợp API

_todo_

## IV. Tính năng

- Thống kê doanh thu theo tháng/quý/năm
- Quản lý sân bóng (thêm, sửa, xóa)
- Đặt sân (tìm sân trống, đặt sân)

### 1. Thống kê

#### So sánh Recharts và Chart.js

So sánh hai thư viện mạnh mẽ: **Recharts** (chuyên React) và **Chart.js** (phổ thông):

| Tiêu chí                  | **Recharts**                | **Chart.js (qua react-chartjs-2)** |
| ------------------------- | --------------------------- | ---------------------------------- |
| Dành riêng cho React      | ✅ Rất hợp                  | ❌ Cần wrapper                    |
| Cú pháp JSX trực quan     | ✅ Rất tốt                  | 😐 Khó hơn                        |
| Tùy biến kiểu biểu đồ     | Dễ                          | Nhiều, phức tạp                    |
| Tài liệu chính chủ        | ✅ Có                       | ✅ Có                             |
| Khả năng mở rộng nâng cao | ⚠️ Hạn chế khi nhiều trục   | ✅ Mạnh mẽ hơn                    |

**Kết luận:** Chọn **Recharts** vì dễ tích hợp, dễ tùy biến, cú pháp JSX giống các component khác.

#### Cài đặt

```sh
npm install recharts
```

Các biểu đồ có thể triển khai:

| Loại biểu đồ | Mô tả                               |
| ------------ | ----------------------------------- |
| 📊 BarChart  | Tổng doanh thu theo tháng, quý, năm |
| 📈 LineChart | Biến động doanh thu theo thời gian  |
| 🍩 PieChart  | Tỉ lệ doanh thu từ các mặt hàng     |
| 🧱 AreaChart | So sánh thuê sân vs. đồ ăn          |

### 2. Quản lý sân bóng

_todo_

### 3. Đặt sân

Module **Đặt sân** gồm:
- Trang `/dat-san` (Next.js route) sử dụng component `DatSanPage`.
- Giao diện quy trình đặt sân: tìm sân trống, chọn khách hàng, nhập thời gian, nhập giá thuê, tính tiền, xác nhận đặt sân.
- Đã thêm link menu **Đặt sân** vào layout để dễ truy cập.

## V. Chạy ứng dụng

```sh
npm run dev
```

## VI. Truy cập ứng dụng

Mở trình duyệt và truy cập vào địa chỉ: [http://localhost:3000](http://localhost:3000)

