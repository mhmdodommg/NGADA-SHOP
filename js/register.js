// ✅ استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ✅ إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBDD1D5UBcYWp_A57mkjpDK9P14Blqx_kk",
    authDomain: "mmgworks-bb8a5.firebaseapp.com",
    projectId: "mmgworks-bb8a5",
    storageBucket: "mmgworks-bb8a5.appspot.com",
    messagingSenderId: "122666065256",
    appId: "1:122666065256:web:02e9e5615a13df5b4fcadd",
    measurementId: "G-DLJ6XKK8PS"
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 تم تحميل الصفحة.");

    const registerForm = document.getElementById("register-form");
    const errorMsg = document.getElementById("register-error");
    const submitButton = document.getElementById("register-submit");

    if (!registerForm) {
        console.error("❌ لم يتم العثور على نموذج التسجيل!");
        return;
    }

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        console.log("📌 بدأ التسجيل...");

        const username = document.getElementById("new-username").value.trim();
        const email = document.getElementById("new-email").value.trim().toLowerCase();
        const password = document.getElementById("new-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        errorMsg.classList.add("hidden");

        if (!username || !email || !password || !confirmPassword) {
            showError("❌ يرجى ملء جميع الحقول!");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("❌ البريد الإلكتروني غير صالح!");
            return;
        }

        if (password.length < 8) {
            showError("❌ كلمة المرور قصيرة جدًا!");
            return;
        }

        if (password !== confirmPassword) {
            showError("❌ كلمات المرور غير متطابقة!");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "⏳ جاري التسجيل...";

        try {
            console.log("✅ إنشاء الحساب...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("✅ الحساب تم إنشاؤه:", user);

            console.log("✅ تحديث بيانات المستخدم...");
            await updateProfile(user, { displayName: username });

            console.log("✅ حفظ بيانات المستخدم في Firestore...");
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            });

            console.log("✅ التسجيل ناجح! سيتم توجيهك إلى صفحة تسجيل الدخول.");
            showPopup();
        } catch (error) {
            console.error("❌ خطأ أثناء التسجيل:", error.message);
            showError(`❌ ${translateFirebaseError(error.code)}`);
            resetButton();
        }
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove("hidden");

        setTimeout(() => {
            errorMsg.classList.add("hidden");
        }, 3000); // تختفي الرسالة بعد ٣ ثوانٍ
    }

    function resetButton() {
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "إنشاء حساب";
        }, 2000); // الزر يرجع بعد ثانيتين إذا فشل التسجيل
    }

    function translateFirebaseError(errorCode) {
        const errorMessages = {
            "auth/email-already-in-use": "❌ البريد الإلكتروني مستخدم!",
            "auth/invalid-email": "❌ البريد غير صحيح!",
            "auth/weak-password": "❌ كلمة المرور ضعيفة!",
            "auth/operation-not-allowed": "❌ تسجيل الحسابات معطل!",
            "auth/network-request-failed": "❌ لا يوجد إنترنت!",
            "auth/internal-error": "❌ خطأ داخلي، حاول لاحقًا!"
        };
        return errorMessages[errorCode] || "❌ حدث خطأ!";
    }
});

// ✅ عرض البوب أب وإعادة التوجيه
function showPopup() {
    const popup = document.getElementById("success-popup");

    if (!popup) {
        console.error("❌ البوب أب غير موجود!");
        return;
    }

    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
        closePopup();
        window.location.href = "sign.html"; // تحويل المستخدم بعد ٣ ثواني
    }, 3000);
}

// ✅ إغلاق البوب أب
function closePopup() {
    const popup = document.getElementById("success-popup");
    if (popup) {
        popup.classList.remove("show");
    }
}