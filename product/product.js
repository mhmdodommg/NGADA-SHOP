document.addEventListener("DOMContentLoaded", function() {
    let quantityInput = document.getElementById("quantity");
    let plusBtn = document.querySelector(".plus");
    let minusBtn = document.querySelector(".minus");
    let totalPriceElement = document.getElementById("total"); 
    let unitPrice = parseFloat(document.querySelector(".quantity-selector").getAttribute("data-price")) || 0; // جلب السعر

    console.log("Unit Price:", unitPrice); // تحقق من القيمة في Console

    function updateTotal() {
        let quantity = parseInt(quantityInput.value);
        totalPriceElement.textContent = (quantity * unitPrice).toFixed(2); 
    }

    plusBtn.addEventListener("click", function() {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateTotal();
    });

    minusBtn.addEventListener("click", function() {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateTotal();
        }        
    });

    updateTotal(); 
});
// إدارة السلة
let cartCount = 0;
let cartItems = [];
let totalPrice = 0;

function addToCart(button) {
let productName = button.getAttribute("data-name");
let productPrice = parseFloat(button.getAttribute("data-price"));
let quantity = parseInt(document.getElementById("quantity").value);

if (quantity < 1) {  
    alert("الرجاء اختيار كمية صحيحة!");  
    return;  
}  

cartCount += quantity;  
document.getElementById("cart-count").innerText = cartCount;  

cartItems.push({ name: productName, price: productPrice, quantity: quantity });  
totalPrice += productPrice * quantity;  

updateCartPopup();

}
function clearCart() {
    cartItems = [];  
    cartCount = 0;  
    totalPrice = 0;  
    document.getElementById("cart-count").innerText = cartCount;  
    document.getElementById("cart-items").innerHTML = "";  
    document.getElementById("total-price").innerText = "0";  
}

function toggleCartPopup() {
let cartPopup = document.getElementById("cart-popup");
cartPopup.style.display = (cartPopup.style.display === "block") ? "none" : "block";
}

function updateCartPopup() {
let cartList = document.getElementById("cart-items");
let totalDisplay = document.getElementById("total-price");

cartList.innerHTML = "";  
cartItems.forEach((item, index) => {  
    let li = document.createElement("li");  
    li.innerHTML = `${item.name} (x${item.quantity}) - ${item.price * item.quantity} جنيه   
                    <button onclick="removeFromCart(${index})">❌</button>`;  
    cartList.appendChild(li);  
});  

totalDisplay.innerText = totalPrice.toFixed(2);

}

function removeFromCart(index) {
totalPrice -= cartItems[index].price * cartItems[index].quantity;
cartCount -= cartItems[index].quantity;
cartItems.splice(index, 1);

document.getElementById("cart-count").innerText = cartCount;  
updateCartPopup();

}

// إتمام الطلب
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
emailjs.init("BR-pdJ93C_hnGq59O");

