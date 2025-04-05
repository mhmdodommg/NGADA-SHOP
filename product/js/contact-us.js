document.addEventListener("DOMContentLoaded", function() {
    let links = document.querySelectorAll(".menu a");
    let currentUrl = window.location.pathname.split("/").pop(); // جلب اسم الصفحة فقط

    links.forEach(link => {
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    let sidebar = document.querySelector(".sidebar");
    let toggleBtn = document.querySelector(".toggle-btn");

    if (sidebar && toggleBtn) {
        let arrow = toggleBtn.querySelector("span");

        toggleBtn.addEventListener("click", function () {  
            let sidebarRight = parseInt(window.getComputedStyle(sidebar).getPropertyValue("right"));  

            if (sidebarRight < 0) {   
                sidebar.style.right = "0";  
                arrow.style.transform = "rotate(180deg)";  
            } else {  
                sidebar.style.right = "-60vw";  
                arrow.style.transform = "rotate(0deg)";  
            }  
        });
    }

    // تأكد من تحميل EmailJS
    emailjs.init("BR-pdJ93C_hnGq59O"); // ضع الـ Public Key الخاص بك هنا

    document.querySelector(".contact-form").addEventListener("submit", function (event) {
        event.preventDefault(); // منع التحديث التلقائي للصفحة

        // جمع البيانات من الحقول
        let userName = document.querySelector("input[type='text']").value;
        let userEmail = document.querySelector("input[type='email']").value;
        let userMessage = document.querySelector("textarea").value;

        // عرض القيم في الكونسول للتأكد منها
        console.log("الاسم:", userName);
        console.log("البريد الإلكتروني:", userEmail);
        console.log("الرسالة:", userMessage);

        // إرسال البيانات إلى EmailJS
        emailjs.send("service_8d1wqlm", "template_viim4i9", {
            user_name: userName,
            user_email: userEmail,
            message: userMessage,
            date: new Date().toLocaleString()
        }).then(function (response) {
            Swal.fire({
    title: "تم الإرسال بنجاح!",
    text: "شكرًا لتواصلك معنا، سنرد عليك قريبًا.",
    icon: "success",
    confirmButtonText: "حسنًا",
    customClass: {
        popup: 'custom-alert' // يمكنك إضافة كلاس خاص لتعديل التصميم بالـ CSS
    }
});
            console.log("استجابة النجاح:", response);
        }).catch(function (error) {
            alert("حدث خطأ أثناء الإرسال، حاول مرة أخرى.");
            console.error("تفاصيل الخطأ:", error);
        });

        // إعادة تعيين الحقول بعد الإرسال
        document.querySelector(".contact-form").reset();
    });
});    
;