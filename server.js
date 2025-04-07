const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات السيرفر
app.use(express.json());
app.use(express.static(path.join(__dirname, 'product')));  // عرض الملفات من مجلد "product"

// المسار الخاص بالتقييمات
app.use('/api/ratings', require('./product/rating-app/api/ratings.js'));  // ربط السيرفر بـ ratings.js

// السيرفر يبدأ هنا
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
