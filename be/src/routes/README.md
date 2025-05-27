# QLSB
## Kịch bản kiểm thử

### Tc1:Thống kê theo tháng.
- Quản lí click chọn thống kê theo tháng.
- Truy vấn API dự kiến: http://localhost:3000/api/thong-ke?type=thang
- HT hiện bảng thống kê theo tháng theo chiều thời gian từ gần nhất đến xa nhất so với hiện tại
|Thời gian|Doanh thu|
|---------|---------|
|5/2025|1.000.000|
|------|---------|
|4/2025|500.000|
|------|-------|
- QL nhấp chọn dòng 5/2025
- Truy vấn API dự kiến: http://localhost:3000/api/thong-ke/chi-tiet?type=thang&month=5&year=2025
- HT hiện bảng danh sách chi tiết các hoá đơn trong thời gian tháng 5/2025
|id|Thời gian|Tên sân|Tên khách hàng|Kiểu sân|Tổng tiền|
|--|---------|-------|--------------|--------|---------|
|1|16:00 10/5/2025|1|Nguyễn Văn An|Mini|600.000|
|-|---------------|-|-------------|----|-------|
|2|15:00 8/5/2025|2|Trần Thị Bình|Mini|400.000|
|-|--------------|-|-------------|----|-------|
### Tc2:Thống kê theo quý.
- Quản lí click chọn thống kê theo quý.
- Truy vấn API dự kiến: http://localhost:3000/api/thong-ke?type=quy
- HT hiện bảng thống kê theo tháng theo chiều thời gian từ gần nhất đến xa nhất so với hiện tại
|Thời gian|Doanh thu|
|---------|---------|
|Q2/2025  |2.000.000|
|---------|---------|
|Q1/2025  |1.000.000|
|---------|---------|
- QL nhấp chọn dòng Q2/2025
- Truy vấn API dự kiến: http://localhost:3000/api/thong-ke/chi-tiet?type=quy&quater=Q2&year=2025
- HT hiện bảng danh sách chi tiết các hoá đơn trong thời gian Q2/2025
|id|Thời gian|Tên sân|Tên khách hàng|Kiểu sân|Tổng tiền|
|--|---------|-------|--------------|--------|---------|
|1|16:00 10/5/2025|1|Nguyễn Văn An|Mini|600.000|
|-|---------------|-|-------------|----|-------|
|2|15:00 8/5/2025|2|Trần Thị Bình|Mini|400.000|
|-|--------------|-|-------------|----|-------|
### Tc3:Thống kê theo năm.
- Quản lí click chọn thống kê theo năm.
- Truy vấn API dự kiến: http://localhost:3000/api/thong-ke?type=nam
- HT hiện bảng thống kê theo tháng theo chiều thời gian từ gần nhất đến xa nhất so với hiện tại
|Thời gian|Doanh thu|
|---------|---------|
|2025|200.000.000|
|----|-----------|
|2024|100.000.000|
|----|-----------|
- QL nhấp chọn dòng 2025
- Truy vấn API dự kiến: http://localhost:3000/api/thong-ke/chi-tiet?type=nam&year=2025
- HT hiện bảng danh sách chi tiết các hoá đơn trong thời gian 2025
|id|Thời gian|Tên sân|Tên khách hàng|Kiểu sân|Tổng tiền|
|--|---------|-------|--------------|--------|---------|
|1|16:00 10/5/2025|1|Nguyễn Văn An|Mini|600.000|
|-|---------------|-|-------------|----|-------|
|2|15:00 8/5/2025|2|Trần Thị Bình|Mini|400.000|
|-|--------------|-|-------------|----|-------|

