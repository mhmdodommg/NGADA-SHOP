// ============== إعدادات الثوابت ==============
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_1ep3hzt',
    TEMPLATE_ID: 'template_7trdh9j',
    PUBLIC_KEY: 'BR-pdJ93C_hnGq59O'
};

const CART_ANIMATION_DURATION = 300;
const ALERT_DISPLAY_TIME = 5000;

// ============== حالة السلة ==============
const cartState = {
    items: [],
    count: 0,
    total: 0,
    isOpen: false
};

// ============== تهيئة التطبيق ==============
document.addEventListener("DOMContentLoaded", () => {
    console.log("تم تحميل المتجر بنجاح 🛒");
    
    // إنشاء overlay ديناميكياً إذا لم يكن موجوداً
    if (!document.getElementById('overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.className = 'hidden';
        document.body.appendChild(overlay);
    }
    
    try {
        initServices().then(() => {
            initUI();
            bindEvents(); // أضفت هذا السطر الذي كان ناقصاً
        }).catch(error => {
            console.error("حدث خطأ في تهيئة الخدمات:", error);
            initUI();
            bindEvents(); // أضفت هذا السطر الذي كان ناقصاً
        });
    } catch (error) {
        console.error("حدث خطأ في التهيئة:", error);
        showAlert("حدث خطأ في تحميل المتجر، يرجى تحديث الصفحة", 'error');
    }
});

// ============== إدارة الخدمات ==============
async function initServices() {
    if (typeof emailjs === 'undefined') {
        console.warn("EmailJS غير متاح، سيتم استخدام وضع المحاكاة");
        return;
    }
    
    try {
        if (!EMAILJS_CONFIG.PUBLIC_KEY) {
            throw new Error("مفتاح EmailJS غير معرّف");
        }    
        
        await emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log("EmailJS جاهز للاستخدام");
    } catch (error) {
        console.error("خطأ في تهيئة EmailJS:", error);
        throw error; 
    }
}

// ============== إدارة الواجهة ==============
function initUI() {
    setupDynamicStyles(); // أضفت هذا السطر الذي كان ناقصاً
    setActiveMenu();
    updateCartUI();
    animateProducts();
}

function setActiveMenu() {
    const currentUrl = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-menu a").forEach(link => {
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function animateProducts() {
    document.querySelectorAll('.product').forEach((product, index) => {
        setTimeout(() => {
            product.classList.add('show');
        }, index * 100);
    });
}

// ============== إدارة الأحداث ==============
function bindEvents() {
    bindCartEvents();
    bindScrollEvents();
    bindCheckoutEvents();
}

function setupDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* تأكيد على ظهور نموذج الدفع */
        #checkout-form:not(.hidden) {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            animation: fadeIn 0.3s ease-out;
        }
        
        #overlay:not(.hidden) {
            display: block !important;
            opacity: 1 !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -55%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        /* تأكيد على أن النموذج سيكون فوق كل العناصر */
        #checkout-form {
            z-index: 1001 !important;
        }
        
        /* إصلاح مشكلة التراكب مع السلة */
        .cart-popup {
            z-index: 8;
        }
    `;
    document.head.appendChild(style);
}

function forceShowCheckoutForm() {
    const formEl = document.getElementById('checkout-form');
    const overlay = document.getElementById('overlay');
    
    if (!formEl || !overlay) {
        console.error('العناصر المطلوبة غير موجودة');
        return;
    }

    // إظهار النموذج مع التأكد من التصميم
    formEl.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // إضافة تأثيرات التركيز على الحقول
    setTimeout(() => {
        const firstInput = formEl.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
    
    // منع إغلاق النموذج عند النقر داخله
    formEl.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // إغلاق النموذج عند النقر على overlay
    overlay.addEventListener('click', closeCheckoutForm);
}

function showCheckoutForm() {
    if (cartState.count === 0) {
        showAlert('السلة فارغة! لا يمكن إتمام الطلب', 'warning');
        return;
    }
    
    // استخدام الدالة المحسنة
    forceShowCheckoutForm();
}


function bindCartEvents() {
    // 1. أحداث إضافة المنتجات إلى السلة
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(btn);
        });
    });

    // 2. حدث حذف العناصر من السلة (الجزء الذي ذكرته)
    document.getElementById('cart-items')?.addEventListener('click', (e) => {
        if (e.target.closest('.cart-item-remove')) {
            e.preventDefault();
            e.stopPropagation(); // ⚠️ مهم لمنع تداخل الأحداث
            const index = parseInt(e.target.closest('.cart-item-remove').dataset.index);
            removeFromCart(index);
        }
    });

    // 3. حدث زر إغلاق السلة (X)
    document.querySelector('.close-cart-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeCart();
    });

    // 4. أحداث أخرى (إغلاق عند النقر خارج السلة)
    document.addEventListener('click', (e) => {
    const cartWindow = document.getElementById('cart-window');
    const isClickInsideCart = cartWindow?.contains(e.target);
    const isClickOnCartIcon = e.target.closest('.cart-icon-link');
    const isClickOnAlert = e.target.closest('.alert'); // ⚠️ الجديد: استثناء الـ Alert
    
    if (cartState.isOpen && !isClickInsideCart && !isClickOnCartIcon && !isClickOnAlert) {
        closeCart();
    }
});
}   
    
    // أيقونة السلة
    const cartIcon = document.querySelector('.cart-icon-link');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }
    
    // إغلاق السلة عند النقر خارجها
    document.addEventListener('click', (e) => {
        const cartWindow = document.getElementById('cart-window');
        const isClickInsideCart = cartWindow?.contains(e.target);
        const isClickOnCartIcon = e.target.closest('.cart-icon-link');
        
        if (cartState.isOpen && !isClickInsideCart && !isClickOnCartIcon) {
            closeCart();
        }
    });
    
    // أحداث إزالة العناصر من السلة
 
function removeFromCart(index) {
    if (index >= 0 && index < cartState.items.length) {
        const removedItem = cartState.items.splice(index, 1)[0];
        updateCartState();
        updateCartUI();
        showAlert(`تم إزالة ${removedItem.name} من السلة`, 'success');
        
        // تأكيد إبقاء السلة مفتوحة حتى لو كانت فارغة
        if (cartState.items.length === 0) {
            console.log("السلة فارغة لكن لن تغلق تلقائياً");
           
        }
    }
}
function bindScrollEvents() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const threshold = 100; // المسافة التي يجب التمرير قبل تفعيل التأثير
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            // عند الرجوع لأعلى الصفحة
            navbar.classList.remove('hidden');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > threshold) {
            // عند النزول لأسفل
            navbar.classList.add('hidden');
        } else if (currentScroll < lastScroll) {
            // عند الصعود لأعلى
            navbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
}
function bindCheckoutEvents() {
    // إزالة الأحداث القديمة أولاً لمنع التكرار
    const submitBtn = document.querySelector('.form-buttons .btn');
    const closeBtn = document.querySelector('.form-buttons .btn-secondary');
    
    submitBtn?.removeEventListener('click', handleOrderSubmission);
    closeBtn?.removeEventListener('click', closeCheckoutForm);
    
    // زر إتمام الطلب
    document.querySelector('.final-checkout-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        showCheckoutForm();
    });
    
    // زر إغلاق نموذج الدفع (بدون أي تحقق)
    closeBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        closeCheckoutForm();
    });
    
    // زر تأكيد الطلب (مع التحقق)
    submitBtn?.addEventListener('click', handleOrderSubmission);
    
    // تحديث طريقة الدفع
    document.getElementById('payment-method')?.addEventListener('change', function(e) {
        updatePaymentInfo(e.target.value);
    });
}
// دالة منفصلة لمعالجة الإرسال
function handleOrderSubmission(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    const submitBtn = e.target;
    submitBtn.disabled = true;
    
    // فقط استدع submitOrder إذا كان الزر هو زر الإرسال
    if (submitBtn.classList.contains('submit-btn')) {
        submitOrder().finally(() => {
            submitBtn.disabled = false;
        });
    } else {
        submitBtn.disabled = false;
    }
}
// ============== إدارة السلة ==============
function addToCart(button) {
    try {
        const product = getProductData(button);
        if (!product) return;
        
        if (isProductInCart(product.id)) {
            showAlert('هذا المنتج موجود بالفعل في السلة', 'info');
            return;
        }
        
        cartState.items.push(product);
        updateCartState();
        updateCartUI();
        showAlert(`تمت إضافة ${product.name} إلى السلة`, 'success');
        
        animateCartIcon();
    } catch (error) {
        console.error('خطأ في إضافة المنتج:', error);
        showAlert('حدث خطأ أثناء إضافة المنتج', 'error');
    }
}

function getProductData(button) {
    const productElement = button.closest('.product');
    if (!productElement) {
        console.error('عنصر المنتج غير موجود');
        return null;
    }
    
    return {
        id: button.dataset.id || generateProductId(productElement),
        name: button.dataset.name || productElement.querySelector('h2')?.textContent || 'منتج غير معروف',
        price: parseFloat(button.dataset.price) || 0,
        image: productElement.querySelector('img')?.src || ''
    };
}

function generateProductId(element) {
    return 'prod-' + Math.random().toString(36).substr(2, 9);
}

function isProductInCart(productId) {
    return cartState.items.some(item => item.id === productId);
}

function updateCartState() {
    cartState.count = cartState.items.length;
    cartState.total = cartState.items.reduce((sum, item) => sum + item.price, 0);
}

function updateCartUI() {
    // تحديث العداد
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        countEl.textContent = cartState.count;
        countEl.style.display = cartState.count > 0 ? 'inline-block' : 'none';
    }
    
    // تحديث قائمة المنتجات
    const itemsEl = document.getElementById('cart-items');
    if (itemsEl) {
        itemsEl.innerHTML = '';
        
        cartState.items.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="60" height="60">
                <div class="cart-item-info">
                    <h3>${sanitizeHTML(item.name)}</h3>
                    <span class="cart-item-price">${item.price.toFixed(2)} جنيه</span>
                </div>
                <button class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            itemsEl.appendChild(li);
        });
    }
    
    // تحديث الإجمالي
    const totalEl = document.getElementById('total-price');
    if (totalEl) {
        totalEl.textContent = cartState.total.toFixed(2);
    }
}


function openCart() {
    if (!cartState.isOpen) {
        cartState.isOpen = true;
        const cartEl = document.getElementById('cart-window');
        const overlay = document.getElementById('overlay');
        
        if (cartEl) cartEl.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartUI();
    }
}
function toggleCart() {
    cartState.isOpen ? closeCart() : openCart();
}

function clearCart(showMessage = true) {
    cartState.items = [];
    updateCartState();
    updateCartUI();
    if (showMessage) {
        showAlert('تم إفراغ سلة التسوق', 'success');
    }
}

function closeCart() {
    // تأكد أن السلة مفتوحة قبل الإغلاق
    if (!cartState.isOpen) return;

    cartState.isOpen = false;
    const cartEl = document.getElementById('cart-window');
    const overlay = document.getElementById('overlay');
    
    if (cartEl) cartEl.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon-link');
    if (cartIcon) {
        cartIcon.classList.add('animate');
        setTimeout(() => {
            cartIcon.classList.remove('animate');
        }, 500);
    }
}

// ============== إدارة الطلبات ==============
function closeCheckoutForm() {
    const formEl = document.getElementById('checkout-form');
    const overlay = document.getElementById('overlay');
    
    if (formEl && overlay) {
        formEl.style.opacity = '0';
        formEl.style.transform = 'translate(-50%, -55%)';
        
        setTimeout(() => {
            formEl.classList.add('hidden');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
            formEl.style.opacity = '';
            formEl.style.transform = '';
        }, 300);
    }
}
function updatePaymentInfo(method) {
    document.querySelectorAll('[id$="-info"]').forEach(el => {
        el.classList.add('hidden');
    });
    
    if (method !== 'cash') {
        const infoElement = document.getElementById(`${method}-info`);
        if (infoElement) {
            infoElement.classList.remove('hidden');
        }
    }
}

function getOrderData() {
    return {
        name: document.getElementById('customer-name').value.trim(),
        phone: document.getElementById('customer-phone').value.trim(),
        address: document.getElementById('customer-address').value.trim(),
        paymentMethod: document.getElementById('payment-method').value,
        items: cartState.items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
        })),
        total: cartState.total
    };
}
let isOrderProcessing = false;
let lastOrderTime = 0;

async function submitOrder() {
    // 1. التحقق من أن السلة غير فارغة
    if (cartState.items.length === 0) {
        showAlert('السلة فارغة! أضف منتجات أولاً', 'warning');
        return;
    }

    // 2. منع التكرار: تحقق من الوقت منذ آخر طلب
    const now = Date.now();
    if (isOrderProcessing || (now - lastOrderTime < 5000)) {
        showAlert('جاري معالجة طلبك السابق...', 'info');
        return;
    }

    // 3. إعداد حالة الطلب
    isOrderProcessing = true;
    lastOrderTime = now;
    const submitButton = document.querySelector('.submit-btn');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    }

    try {
        // 4. جمع بيانات الطلب
        const orderData = {
            ...getOrderData(),
            orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString()
        };

        // 5. التحقق من صحة البيانات
        validateOrderData(orderData);

        // 6. إظهار حالة التحميل
        showAlert('جاري تأكيد طلبك، الرجاء الانتظار...', 'info');

        // 7. محاولة الإرسال
        const result = await sendOrder(orderData);

        // 8. عند النجاح
        showAlert(`تم تأكيد طلبك بنجاح! رقم الطلب: ${orderData.orderId}`, 'success');
        clearCart(false);
        closeCheckoutForm();

        return result;

    } catch (error) {
        // 9. معالجة الأخطاء
        console.error('فشل إرسال الطلب:', error);
        showAlert(`حدث خطأ: ${error.message || 'يرجى المحاولة لاحقاً'}`, 'error');
        throw error;

    } finally {
        // 10. إعادة تعيين الحالة
        isOrderProcessing = false;
        const submitButton = document.querySelector('.submit-btn');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'إتمام الطلب';
        }
    }
}


function validateOrderData(data) {
    const errors = [];
    if (!data.name) errors.push('الاسم مطلوب');
    if (!data.phone || !/^[0-9]{10,}$/.test(data.phone)) errors.push('رقم هاتف غير صالح');
    if (!data.address) errors.push('العنوان مطلوب');
    if (data.items.length === 0) errors.push('لا توجد عناصر في السلة');
    if (errors.length > 0) throw new Error(errors.join(' | '));
}
function getOrderData() {
    return {
        name: sanitizeInput(document.getElementById('customer-name').value),
        phone: sanitizeInput(document.getElementById('customer-phone').value),
        whatsapp: sanitizeInput(document.getElementById('customer-whatsapp').value || 'غير محدد'), // هذا السطر الجديد
        address: sanitizeInput(document.getElementById('customer-address').value),
        paymentMethod: document.getElementById('payment-method').value,
        termsAccepted: document.getElementById('terms-checkbox').checked,
        items: cartState.items,
        total: cartState.total
    };
}

async function sendOrder(data) {
    const invoice = generateInvoice(data);
    
    if (typeof emailjs !== 'undefined') {
        return emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            {
                customer_name: data.name,
                customer_phone: data.phone,
                customer_whatsapp: data.whatsapp, // هذا السطر الجديد
                customer_address: data.address,
                order_details: invoice,
                total_price: data.total.toFixed(2),
                payment_method: data.paymentMethod === "cash" ? "الدفع عند الاستلام" : "فوري"
            }
        );
    }
    
    // وضع المحاكاة
    console.log('تفاصيل الطلب (محاكاة):', invoice);
    return Promise.resolve();
}
function generateInvoice(data) {
    let invoice = `فاتورة طلب جديد:\n\n`;
    invoice += `العميل: ${data.name}\n`;
    invoice += `رقم الهاتف: ${data.phone}\n`;
    invoice += `رقم الواتساب: ${data.whatsapp}\n`;
    invoice += `العنوان: ${data.address}\n\n`;
    invoice += `المنتجات:\n`;
       
    data.items.forEach((item, index) => {
        invoice += `${index + 1}. ${item.name} - ${item.price.toFixed(2)} جنيه\n`;
    });
    
    invoice += `\nالإجمالي: ${data.total.toFixed(2)} جنيه\n`;
    invoice += `طريقة الدفع: ${data.paymentMethod === "cash" ? "الدفع عند الاستلام" : "فوري"}`;
    
    return invoice;
}
function handleOrderError(error) {
    console.error('فشل إرسال الطلب:', error);
    // إخفاء رسالة "جاري المعالجة" أولاً
    document.querySelectorAll('.alert').forEach(alert => {
        if (alert.textContent.includes('جاري معالجة')) {
            alert.remove();
        }
    });
    showAlert(error.message || 'حدث خطأ أثناء إرسال الطلب', 'error');
}
// ============== أدوات مساعدة ==============
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${sanitizeHTML(message)}</span>
        <button class="alert-close">&times;</button>
    `;
    
    // منع انتشار النقر داخل الـ Alert بالكامل
    alert.addEventListener('click', (e) => {
        e.stopPropagation(); // ⚠️ مهم جداً
    });

    const container = getAlertContainer();
    container.appendChild(alert);
    
    // إغلاق الـ Alert عند النقر على الزر
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.remove();
    });
    
    setTimeout(() => {
        alert.remove();
    }, ALERT_DISPLAY_TIME);
}
function getAlertContainer() {
    let container = document.getElementById('alert-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alert-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1003;
        `;
        document.body.appendChild(container);
    }
    return container;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function sanitizeInput(input) {
    return input.trim()
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ===== الكود المعدل للإضافة إلى المفضلة =====
document.addEventListener('DOMContentLoaded', function() {
    // تحديث العداد أولاً
    updateWishlistCount();
    
    // تعطيل الحدث القديم إذا كان موجوداً
    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
        btn.removeEventListener('click', handleWishlistClick);
    });
    
    // إضافة الحدث الجديد
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-wishlist')) {
            handleWishlistClick(e);
        }
    });
});

function handleWishlistClick(e) {
    e.preventDefault();
    const btn = e.target.closest('.add-to-wishlist');
    const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: btn.dataset.price,
        image: btn.dataset.image,
        // إضافة أي بيانات أخرى تحتاجها صفحة المفضلة
        category: btn.dataset.category || 'غير محدد'
    };

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingIndex = favorites.findIndex(p => p.id === product.id);

    if (existingIndex === -1) {
        favorites.push(product);
        btn.innerHTML = '<i class="fas fa-heart" style="color: #e74c3c"></i>';
        showAlert('تمت الإضافة إلى المفضلة ♥', 'success');
    } else {
        favorites.splice(existingIndex, 1);
        btn.innerHTML = '<i class="far fa-heart"></i>';
        showAlert('تمت الإزالة من المفضلة', 'info');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateWishlistCount();
}

// ===== دالة تحديث العداد (المعدلة) =====
function updateWishlistCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const countElement = document.getElementById('wishlist-count'); // تأكد من أن الهوية صحيحة
    
    if (countElement) {
        countElement.textContent = favorites.length;
        countElement.style.display = favorites.length > 0 ? 'inline-block' : 'none';
    }
    
    // هذه السطر الجديد مهم لتحديث الصفحة عند العودة
    window.dispatchEvent(new Event('storage'));
}