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
});