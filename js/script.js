document.addEventListener("DOMContentLoaded", function () {
   // ربط دالة توجيه المستخدم بعد التأخير بجميع الروابط
    function redirectAfterDelay(event) {  
        event.preventDefault();
        let link = event.target.closest("a");
        if (link) {
            setTimeout(() => {
                window.location.href = link.getAttribute("href");
            }, 1000); // تأخير لمدة ثانية
        
        }}
           // ✅ البحث داخل المكتبة
    let searchInput = document.getElementById('search');
    let resultsContainer = document.getElementById('search-results');
    let resultsList = document.getElementById('results-list');

    if (searchInput && resultsContainer && resultsList) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.trim().toLowerCase();
            const books = [
{ title: 'أيفون ١١ برو ماكس', url: 'product/product6.html'},
{ title: 'كريم كريفي', url: 'product/' },
{ title: 'شبشب بيتي', url: 'product/product5.html' },
{ title: 'شبشب بيتي أسود', url: '/' },
{ title: 'فرشاة شعر', url: '/' },
{ title: 'دبدوب كبير', url: '/' },
{ title: 'طلاء اظافر', url: 'product/product1.html'},
{ title: 'حذاء رياضي', url: 'product/product2.html'},
               ];

            resultsList.innerHTML = '';
                        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));

            if (filteredBooks.length > 0) {
                resultsContainer.style.display = 'block';
                filteredBooks.forEach(book => {
                    const listItem = document.createElement('li');
                    const linkItem = document.createElement('a');
                    linkItem.textContent = book.title;
                    linkItem.href = book.url;
                    listItem.appendChild(linkItem);
                    resultsList.appendChild(listItem);
                });
            } else {
                resultsContainer.style.display = 'none';
            }
        });

        document.addEventListener('click', function (event) {
            if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    }
const texts = ["مرحبًا بك في متجر مدينة نقادة", "اكتشف أفضل المنتجات", "تسوق الآن بأفضل الأسعار","تسوق من بيتك الآن"];
let index = 0;
let charIndex = 0;
let currentText = "";
let isDeleting = false;

function typeEffect() {
let display = document.getElementById("auto-type");

if (!isDeleting && charIndex < texts[index].length) {  
    currentText += texts[index][charIndex];  
    charIndex++;  
} else if (isDeleting && charIndex > 0) {  
    currentText = currentText.slice(0, -1);  
    charIndex--;  
} else {  
    isDeleting = !isDeleting;  
    if (!isDeleting) index = (index + 1) % texts.length;  
}  

display.innerHTML = currentText;  
setTimeout(typeEffect, isDeleting ? 80 : 120);

}
typeEffect();
            
let products = document.querySelectorAll(".product");  
products.forEach((product) => {  
    product.classList.add("show");  
});  

emailjs.init("BR-pdJ93C_hnGq59O");

});

let cartCount = 0;
let cartItems = [];
let totalPrice = 0;

function addToCart(button) {
let productName = button.getAttribute("data-name");
let productPrice = parseFloat(button.getAttribute("data-price"));

cartCount++;  
document.getElementById("cart-count").innerText = cartCount;  

cartItems.push({ name: productName, price: productPrice });  
totalPrice += productPrice;

}

function toggleCartPopup() {
let cartPopup = document.getElementById("cart-popup");
let cartList = document.getElementById("cart-items");
let totalDisplay = document.getElementById("total-price");

cartList.innerHTML = "";  
cartItems.forEach((item, index) => {  
    let li = document.createElement("li");  
    li.innerHTML = `${item.name} - ${item.price} جنيه <button onclick="removeFromCart(${index})">❌</button>`;  
    cartList.appendChild(li);  
});  

totalDisplay.innerText = totalPrice.toFixed(2);  
cartPopup.style.display = (cartPopup.style.display === "block") ? "none" : "block";

}

function removeFromCart(index) {
totalPrice -= cartItems[index].price;
cartItems.splice(index, 1);
cartCount--;

document.getElementById("cart-count").innerText = cartCount;  
  
// تحديث قائمة السلة بدون إغلاقها  
let cartList = document.getElementById("cart-items");  
let totalDisplay = document.getElementById("total-price");  
cartList.innerHTML = "";   

cartItems.forEach((item, idx) => {  
    let li = document.createElement("li");  
    li.innerHTML = `${item.name} - ${item.price} جنيه <button onclick="removeFromCart(${idx})">❌</button>`;  
    cartList.appendChild(li);  
});  

totalDisplay.innerText = totalPrice.toFixed(2);

}

function clearCart() {
cartItems = [];
cartCount = 0;
totalPrice = 0;

document.getElementById("cart-count").innerText = cartCount;  
toggleCartPopup();

}
// **إتمام الطلب**  
function checkout() {  
    if (totalPrice === 0) {  
        let emptyCartMessage = document.getElementById("empty-cart-message");  
        emptyCartMessage.innerText = "⚠️ السلة فارغة!، لا يمكن إتمام الطلب";  
        emptyCartMessage.style.display = "block";  

        setTimeout(() => {  
            emptyCartMessage.style.display = "none";  
        }, 3000);  

        return;  
    }  

    let checkoutForm = document.getElementById("checkout-form");  
    checkoutForm.classList.remove("hidden");  
}  

function submitOrder() {  
    let name = document.getElementById("customer-name").value.trim();  
    let phone = document.getElementById("customer-phone").value.trim();  
    let whatsapp = document.getElementById("customer-whatsapp").value.trim();  
    let address = document.getElementById("customer-address").value.trim();  
    let paymentMethod = document.getElementById("payment-method").value;  
    let termsAccepted = document.getElementById("terms-checkbox").checked; // ✅ التحقق من الموافقة على الشروط  

    if (!name || !phone || !whatsapp || !address) {  
        alert("يرجى إدخال جميع البيانات المطلوبة!");  
        return;  
    }  

    if (!termsAccepted) {  
        alert("يجب الموافقة على الشروط والأحكام قبل إتمام الطلب!");  
        return;  
    }  

    let invoice = `🛒 *فاتورة طلب جديد:*\n\n👤 *العميل:* ${name}\n📞 *رقم الهاتف:* ${phone}\n💬 *واتساب:* ${whatsapp}\n📍 *العنوان:* ${address}\n\n📦 *المنتجات:* \n`;  

    cartItems.forEach((item, index) => {  
        invoice += `${index + 1}. ${item.name} - ${item.price} جنيه\n`;  
    });  

    invoice += `\n💰 *الإجمالي:* ${totalPrice.toFixed(2)} جنيه`;  
    invoice += `\n💳 *طريقة الدفع:* ${paymentMethod === "cash" ? "الدفع عند الاستلام" : "فوري"}`;  

    emailjs.send("service_1ep3hzt", "template_7trdh9j", {  
        customer_name: name,  
        customer_phone: phone,  
        customer_whatsapp: whatsapp,  
        customer_address: address,  
        order_details: invoice,  
        total_price: totalPrice.toFixed(2),  
        payment_method: paymentMethod === "cash" ? "الدفع عند الاستلام" : "فوري"  
    }).then(() => {  
        alert("تم إرسال الطلب بنجاح!");  
        document.getElementById("customer-name").value = "";  
        document.getElementById("customer-phone").value = "";  
        document.getElementById("customer-whatsapp").value = "";  
        document.getElementById("customer-address").value = "";  
        document.getElementById("terms-checkbox").checked = false; // ✅ إعادة ضبط الموافقة  

        cartItems = [];  
        cartCount = 0;  
        totalPrice = 0;  
        document.getElementById("cart-count").innerText = cartCount;  
        document.getElementById("cart-items").innerHTML = "";  
        document.getElementById("total-price").innerText = "0";  
        document.getElementById("checkout-form").classList.add("hidden");  
        toggleCartPopup();  
    }).catch(error => {  
        alert("حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى!");  
        console.error("Error:", error);  
    });
}
function openTermsPopup() {
    document.getElementById("terms-popup").style.display = "block";
}

function closeTermsPopup() {
    document.getElementById("terms-popup").style.display = "none";
}
function togglePaymentInfo() {
    let paymentMethod = document.getElementById("payment-method").value;
    let fawryInfo = document.getElementById("fawry-info");

    if (paymentMethod === "fawry") {
        fawryInfo.classList.remove("hidden"); // إظهار البيانات
    } else {
        fawryInfo.classList.add("hidden"); // إخفاء البيانات
    }
}
function closeCheckout() {  
    document.getElementById("checkout-form").classList.add("hidden");  
} 

// دالة لفتح النافذة المنبثقة
function openPopup(id) {
document.getElementById(id).style.display = "block";
document.getElementById("popup-overlay").style.display = "block";
}

// دالة لإغلاق النافذة المنبثقة
function closePopup(id) {
document.getElementById(id).style.display = "none";
document.getElementById("popup-overlay").style.display = "none";
}

// دالة لفتح وإغلاق الحلول عند الضغط
function toggleSolution(id) {
let solution = document.getElementById(id);
if (solution.style.display === "block") {
solution.style.display = "none";
} else {
solution.style.display = "block";
}
}
function closeAllPopups() {
let popups = document.querySelectorAll('.popup');
popups.forEach(popup => popup.style.display = "none");
document.getElementById("popup-overlay").style.display = "none";
}

function toggleSolution(id) {
var solutions = document.querySelectorAll(".solution");

solutions.forEach((sol) => {    
    if (sol.id !== id) {    
        sol.style.maxHeight = "0px";    
        setTimeout(() => {    
            sol.style.display = "none";    
        }, 500);    
    }    
});  
                    
var solution = document.getElementById(id);    
if (solution.style.display === "none" || solution.style.display === "") {    
    solution.style.display = "block";    
    solution.style.maxHeight = solution.scrollHeight + "px";    
} else {    
    solution.style.maxHeight = "0px";    
    setTimeout(() => {    
        solution.style.display = "none";    
    }, 500);}   
}
   document.addEventListener("DOMContentLoaded", function() {
    let links = document.querySelectorAll(".menu a");
    let currentUrl = window.location.pathname.split("/").pop(); // جلب اسم الصفحة فقط

    // لو الرابط فاضي (يعني في الصفحة الرئيسية)، نعتبرها index.html
    if (currentUrl === "") {
        currentUrl = "index.html";  // أو اسم صفحتك الرئيسية لو مختلف
    }

    links.forEach(link => {
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
        }
    });
});
