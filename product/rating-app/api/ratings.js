const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// مسار الملف الذي يخزن فيه التقييمات
const ratingsFile = path.join(__dirname, 'ratings.json');

// تأكد أن الملف موجود
if (!fs.existsSync(ratingsFile)) {
    fs.writeFileSync(ratingsFile, JSON.stringify({})); // حفظ البيانات بشكل فارغ لكل منتج بدلاً من مصفوفة عامة
}

// إرجاع التقييمات الخاصة بمنتج معين
router.get('/', (req, res) => {
    const { productId } = req.query; // جلب productId من الاستعلام

    if (!productId) {
        return res.status(400).json({ error: 'productId مفقود' });
    }

    try {
        const data = fs.readFileSync(ratingsFile);
        const ratings = JSON.parse(data);

        // إرجاع التقييمات الخاصة بالمنتج المطلوب
        if (ratings[productId]) {
            res.json(ratings[productId]);
        } else {
            res.json([]); // إذا لم يكن هناك تقييمات لهذا المنتج
        }
    } catch (error) {
        res.status(500).json({ error: 'خطأ في قراءة التقييمات' });
    }
});

// حفظ تقييم جديد
router.post('/', (req, res) => {
    const { productId, username, rating, comment } = req.body;

    if (!productId || !username || !rating || !comment) {
        return res.status(400).json({ error: 'البيانات ناقصة' });
    }

    try {
        const data = fs.readFileSync(ratingsFile);
        const ratings = JSON.parse(data);

        // إذا لم يكن هناك تقييمات للمنتج، أنشئ مصفوفة جديدة له
        if (!ratings[productId]) {
            ratings[productId] = [];
        }

        // أضف التقييم الجديد
        ratings[productId].push({ username, rating, comment });

        // احفظ التقييمات مرة أخرى
        fs.writeFileSync(ratingsFile, JSON.stringify(ratings, null, 2));

        res.status(201).json({ message: 'تم حفظ التقييم بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في حفظ التقييم' });
    }
});

module.exports = router;
