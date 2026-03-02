// ==========================================
// HỆ THỐNG XÁC THỰC (ĐĂNG NHẬP / ĐĂNG KÝ)
// ==========================================

// Chuyển đổi giữa 2 form
function toggleAuth() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('registerForm').classList.toggle('hidden');
    document.getElementById('loginError').innerText = '';
    document.getElementById('regError').innerText = '';
    document.getElementById('regSuccess').innerText = '';
}

// Xử lý Đăng Ký
function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    
    // Lấy database giả từ localStorage (hoặc tạo mới nếu chưa có)
    let usersDB = JSON.parse(localStorage.getItem('robloxAdminDB')) || {};

    if (usersDB[user]) {
        document.getElementById('regError').innerText = "Tên đăng nhập đã tồn tại!";
        document.getElementById('regSuccess').innerText = "";
        return;
    }

    // Lưu user mới
    usersDB[user] = { password: pass, role: 'admin' };
    localStorage.setItem('robloxAdminDB', JSON.stringify(usersDB));
    
    document.getElementById('regError').innerText = "";
    document.getElementById('regSuccess').innerText = "Đăng ký thành công! Hãy đăng nhập.";
    document.getElementById('regUser').value = '';
    document.getElementById('regPass').value = '';
    
    setTimeout(toggleAuth, 1500); // Tự động chuyển qua form login sau 1.5s
}

// Xử lý Đăng Nhập
function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    
    let usersDB = JSON.parse(localStorage.getItem('robloxAdminDB')) || {};
    const btn = document.getElementById('loginBtn');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

    setTimeout(() => {
        if (usersDB[user] && usersDB[user].password === pass) {
            // Lưu phiên đăng nhập
            sessionStorage.setItem('loggedInUser', user);
            window.location.href = 'admin.html';
        } else {
            document.getElementById('loginError').innerText = "Sai tài khoản hoặc mật khẩu!";
            btn.innerHTML = 'Login';
        }
    }, 800); // Giả lập độ trễ mạng
}

// Đăng xuất
function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// ==========================================
// HỆ THỐNG ADMIN DASHBOARD
// ==========================================

const translations = {
    vi: {
        title: "Tổng quan bảng điều khiển",
        successMessage: "Lệnh thực thi thành công",
        noPlayer: "Vui lòng nhập tên người chơi!",
        addRobux: "Đang nạp Robux vào hệ thống..."
    },
    en: {
        title: "Dashboard Overview",
        successMessage: "Command executed successfully",
        noPlayer: "Please enter a player name!",
        addRobux: "Injecting Robux to system..."
    }
};

let currentLanguage = "en";

// Chạy khi trang load xong
document.addEventListener("DOMContentLoaded", function () {
    // 1. Kiểm tra xem đang ở trang nào để xử lý Auth
    if (window.location.pathname.includes('admin.html')) {
        const currentUser = sessionStorage.getItem('loggedInUser');
        if (!currentUser) {
            alert("Bạn chưa đăng nhập! Đang chuyển hướng về trang chủ...");
            window.location.href = 'index.html';
            return;
        }
        // Hiển thị tên người dùng
        const displayElem = document.getElementById('displayUsername');
        if (displayElem) displayElem.innerText = currentUser;
    }

    // 2. Nút thêm Robux giả
    let addRobuxBtn = document.getElementById("fakeAddRobux");
    if (addRobuxBtn) {
        addRobuxBtn.addEventListener("click", function () {
            let pendingRobux = document.getElementById("pendingRobux");
            let btn = this;
            let originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            logAction(`[SYSTEM] ${translations[currentLanguage].addRobux}`);

            setTimeout(() => {
                let currentVal = parseInt(pendingRobux.innerText.replace(/,/g, ''));
                pendingRobux.innerText = (currentVal + 120000).toLocaleString();
                btn.innerHTML = originalText;
                btn.disabled = false;
                logAction(`[SUCCESS] Thêm 120,000 Robux vào hàng chờ.`);
            }, 1500);
        });
    }
});

// Đổi ngôn ngữ
function changeLanguage() {
    let lang = document.getElementById("languageSelect").value;
    currentLanguage = lang;
    document.getElementById("dashboardTitle").innerText = translations[lang].title;
    logAction(`[SYSTEM] Language changed to ${lang.toUpperCase()}`);
}

// Ghi log ra màn hình
function logAction(message) {
    let logList = document.getElementById("logList");
    if (!logList) return;
    
    let logEntry = document.createElement("li");
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logList.prepend(logEntry); // Thêm log mới lên đầu
}

// Thực thi lệnh (Ban, Add Robux...)
function executeCommand(command, player = "") {
    if ((command.includes('Ban') || command.includes('Add Robux')) && player.trim() === "") {
        alert(translations[currentLanguage].noPlayer);
        return;
    }
    
    let target = player ? `=> Target: ${player}` : "";
    logAction(`[API Request] Đang gửi lệnh: ${command} ${target}...`);

    setTimeout(() => {
        logAction(`[API Response] ${translations[currentLanguage].successMessage}: ${command}`);
        if(player) document.getElementById('playerName').value = ''; // Xóa trắng ô input sau khi nhập
    }, 1000); // Giả lập thời gian load server
}
