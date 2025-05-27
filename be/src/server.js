const express = require('express');
const cors = require('cors');
const thongKeRoutes = require('./routes/thongke');
const chiTietRoutes = require('./routes/chitiet');
const datSanRoutes = require('./routes/datsan');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/thong-ke', thongKeRoutes);
app.use('/api/thong-ke/chi-tiet', chiTietRoutes);
app.use('/api/dat-san',datSanRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});