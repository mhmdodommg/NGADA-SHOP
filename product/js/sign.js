import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBDD1D5UBcYWp_A57mkjpDK9P14Blqx_kk",
    authDomain: "mmgworks-bb8a5.firebaseapp.com",
    projectId: "mmgworks-bb8a5",
    storageBucket: "mmgworks-bb8a5.appspot.com",
    messagingSenderId: "122666065256",
    appId: "1:122666065256:web:02e9e5615a13df5b4fcadd",
    measurementId: "G-DLJ6XKK8PS"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const usersRef = collection(db, "users");

document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 JavaScript Loaded");

    // التحقق من تسجيل الدخول عند تحميل الصفحة
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        displayUserData(user);
        document.querySelector(".login-container").classList.add("hidden");
        document.getElementById("user-info").classList.remove("hidden");
    }

    // تسجيل الدخول
    const loginForm = document.getElementById("login-form");
    const loginBtn = document.querySelector(".login-btn");

    if (loginForm && loginBtn) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log("📌 تسجيل الدخول بدأ");

            // تغيير النص إلى "جاري تسجيل الدخول"
            loginBtn.textContent = "جاري تسجيل الدخول...";
            loginBtn.disabled = true;

            const input = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const errorMsg = document.getElementById("login-error");

            errorMsg.classList.add("hidden");

            if (!input || !password) {
                showError("❌ يرجى ملء جميع الحقول!");
                loginBtn.textContent = "تسجيل الدخول";
                loginBtn.disabled = false;
                return;
            }

            if (password.length < 8) {
                showError("❌ يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل!");
                loginBtn.textContent = "تسجيل الدخول";
                loginBtn.disabled = false;
                return;
            }

            let email = input;

            // إذا كان المستخدم لا يحتوي على @ في اسم المستخدم، نبحث عن البريد الإلكتروني في قاعدة البيانات
            if (!input.includes("@")) {
                try {
                    const q = query(usersRef, where("username", "==", input));
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        showError("❌ اسم المستخدم غير موجود!");
                        loginBtn.textContent = "تسجيل الدخول";
                        loginBtn.disabled = false;
                        return;
                    }

                    email = querySnapshot.docs[0].data().email;
                } catch (error) {
                    console.error("❌ خطأ أثناء البحث عن اسم المستخدم:", error);
                    showError("❌ حدث خطأ أثناء التحقق من اسم المستخدم!");
                    loginBtn.textContent = "تسجيل الدخول";
                    loginBtn.disabled = false;
                    return;
                }
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("✅ تسجيل الدخول ناجح:", user);

                const userData = {
                    username: user.displayName || "مستخدم",
                    email: user.email,
                    profileImage: user.photoURL || "https://www.example.com/default-avatar.png" // صورة افتراضية
                };
                sessionStorage.setItem("loggedInUser", JSON.stringify(userData));

                showSuccessPopup();
            } catch (error) {
                console.error("❌ خطأ أثناء تسجيل الدخول:", error);
                showError("❌ البريد الإلكتروني أو كلمة المرور غير صحيحة!");
                loginBtn.textContent = "تسجيل الدخول";
                loginBtn.disabled = false;
            }
        });
    }

    // تسجيل الخروج
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {
            console.log("🔴 زر تسجيل الخروج تم النقر عليه");
            await signOut(auth);
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "sign.html";
        });
    }

    // إظهار وإخفاء كلمة المرور
    const passwordField = document.getElementById("password");
    const togglePassword = document.querySelector(".toggle-password");

    if (togglePassword && passwordField) {
        togglePassword.addEventListener("click", function () {
            if (passwordField.type === "password") {
                passwordField.type = "text";
                togglePassword.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                passwordField.type = "password";
                togglePassword.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    }

    // تسجيل الدخول باستخدام Google
    const googleLoginBtn = document.getElementById("google-login-btn");
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", async function (event) {
            event.preventDefault();
            console.log("🔵 تسجيل الدخول عبر Google");

            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("✅ تسجيل الدخول عبر Google ناجح:", user);

                const userData = {
                    username: user.displayName || "مستخدم",
                    email: user.email,
                    profileImage: user.photoURL || "https://www.example.com/default-avatar.png" // صورة افتراضية
                };
                sessionStorage.setItem("loggedInUser", JSON.stringify(userData));

                showSuccessPopup();
            } catch (error) {
                console.error("❌ خطأ أثناء تسجيل الدخول عبر Google:", error);
                showError("❌ حدث خطأ أثناء تسجيل الدخول عبر Google!");
            }
        });
    }

    // التحقق من وجود صورة مرفوعة سابقًا في LocalStorage
    const userProfileImage = localStorage.getItem("profileImage");

    // إذا كان هناك صورة محفوظة، استخدمها
    if (userProfileImage) {
        document.getElementById("user-profile-image").src = userProfileImage;
    }

    // تحميل الصورة
    const uploadImageInput = document.getElementById("upload-profile-image");
    const profileImageElement = document.getElementById("user-profile-image");

    uploadImageInput.addEventListener("change", async function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async function () {
                const imageUrl = reader.result;

                // حفظ الرابط في LocalStorage
                localStorage.setItem("profileImage", imageUrl);

                // تحديث صورة الملف الشخصي
                profileImageElement.src = imageUrl;
            };
            reader.readAsDataURL(file);
        }
    });

    // استرجاع تاريخ الميلاد المحفوظ من localStorage وعرضه في الحقل
    const savedBirthday = localStorage.getItem("userBirthday");
    if (savedBirthday) {
        document.getElementById("user-birthday-input").value = savedBirthday;
    }
// حفظ تاريخ الميلاد عند النقر على زر "حفظ"
document.getElementById("save-profile-btn").addEventListener("click", function () {
    // الحصول على تاريخ الميلاد من input
    const userBirthday = document.getElementById("user-birthday-input").value;

    // تغيير النص إلى "جاري الحفظ"
    const saveButton = document.getElementById("save-profile-btn");
    saveButton.textContent = "جاري الحفظ...";
    saveButton.disabled = true;

    if (userBirthday) {
        // حفظ تاريخ الميلاد في localStorage
        localStorage.setItem("userBirthday", userBirthday);
        console.log("✅ تم حفظ تاريخ الميلاد:", userBirthday);

        // بعد الحفظ تغيير النص إلى "تم الحفظ بنجاح"
        setTimeout(function () {
            saveButton.textContent = "تم الحفظ بنجاح!";
            saveButton.disabled = false;

            // إعادة النص إلى "حفظ" بعد 2 ثانية من النجاح
            setTimeout(function () {
                saveButton.textContent = "حفظ";
            }, 2000); // بعد ثانيتين يعيد النص إلى "حفظ"
        }, 1000); // بعد ثانية يظهر النص "تم الحفظ بنجاح"
    } else {
        console.log("❌ يرجى تحديد تاريخ الميلاد.");
        saveButton.textContent = "حفظ";
        saveButton.disabled = false;
    }
});
});

// دالة عرض البوب أب عند تسجيل الدخول
function showSuccessPopup() {
    const popup = document.getElementById("login-popup");
    if (popup) {
        popup.classList.remove("hidden");
        popup.style.display = "block";
        popup.style.opacity = "1";

        setTimeout(() => {
            popup.style.opacity = "0";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        }, 3000);
    } else {
        console.error("❌ عنصر popup غير موجود!");
    }
}

// دالة عرض بيانات المستخدم بعد تسجيل الدخول
function displayUserData(user) {
    document.getElementById("user-name").textContent = user.username;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-profile-image").src = user.profileImage || "https://www.example.com/default-avatar.png";
}

// دالة عرض رسالة الخطأ وإخفائها بعد ٣ ثوانٍ
function showError(message) {
    const errorMsg = document.getElementById("login-error");
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.remove("hidden");

        setTimeout(() => {
            errorMsg.classList.add("hidden");
        }, 3000);
    }
}
