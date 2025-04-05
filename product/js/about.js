document.addEventListener("DOMContentLoaded", function() {
    let links = document.querySelectorAll(".menu a");
    let currentUrl = window.location.pathname.split("/").pop(); // جلب اسم الصفحة فقط

    links.forEach(link => {
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
        }
    });
});