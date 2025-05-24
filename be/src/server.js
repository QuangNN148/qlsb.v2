const express = require('express');
const cors = require('cors');
const thongKeRoutes = require('./routes/thongke');
const chiTietRoutes = require('./routes/chitiet');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/thong-ke', thongKeRoutes);
app.use('/api/thong-ke/chi-tiet', chiTietRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});