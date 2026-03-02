// ==========================================
// HỆ THỐNG AUTH
// ==========================================
function toggleAuth() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('registerForm').classList.toggle('hidden');
    document.getElementById('loginError').innerText = '';
    document.getElementById('regError').innerText = '';
    document.getElementById('regSuccess').innerText = '';
}

function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    let usersDB = JSON.parse(localStorage.getItem('robloxAdminDB')) || {};

    if (usersDB[user]) {
        document.getElementById('regError').innerText = "Tên đăng nhập đã tồn tại!";
        return;
    }
    usersDB[user] = { password: pass, role: 'admin' };
    localStorage.setItem('robloxAdminDB', JSON.stringify(usersDB));
    
    document.getElementById('regSuccess').innerText = "Đăng ký thành công! Hãy đăng nhập.";
    setTimeout(toggleAuth, 1500);
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    let usersDB = JSON.parse(localStorage.getItem('robloxAdminDB')) || {};
    const btn = document.getElementById('loginBtn');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    setTimeout(() => {
        if (usersDB[user] && usersDB[user].password === pass) {
            sessionStorage.setItem('loggedInUser', user);
            window.location.href = 'admin.html';
        } else {
            document.getElementById('loginError').innerText = "Sai tài khoản hoặc mật khẩu!";
            btn.innerHTML = 'Login';
        }
    }, 800);
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// ==========================================
// HỆ THỐNG ADMIN DASHBOARD & FAKE DATABASE
// ==========================================
const translations = {
    vi: { title: "Tổng quan bảng điều khiển" },
    en: { title: "Dashboard Overview" }
};
let currentLanguage = "en";

// Khởi tạo và lấy Dữ liệu Máy chủ
const INITIAL_SERVER_POOL = 12992349394287;

function getServerPool() {
    let pool = localStorage.getItem('robloxServerPoolDB');
    if (pool === null) {
        localStorage.setItem('robloxServerPoolDB', INITIAL_SERVER_POOL);
        return INITIAL_SERVER_POOL;
    }
    return parseInt(pool);
}

function updateServerPoolDOM() {
    let currentPool = getServerPool();
    let poolElem = document.getElementById('serverPoolRobux');
    if (poolElem) {
        poolElem.innerText = currentPool.toLocaleString();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes('admin.html')) {
        const currentUser = sessionStorage.getItem('loggedInUser');
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
        if(document.getElementById('displayUsername')) {
            document.getElementById('displayUsername').innerText = currentUser;
        }
        updateServerPoolDOM();
    }
});

function changeLanguage() {
    let lang = document.getElementById("languageSelect").value;
    currentLanguage = lang;
    document.getElementById("dashboardTitle").innerText = translations[lang].title;
    logAction(`[SYSTEM] Language set to ${lang.toUpperCase()}`);
}

function logAction(message) {
    let logList = document.getElementById("logList");
    if (!logList) return;
    let logEntry = document.createElement("li");
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logList.prepend(logEntry);
}

// Lấy Database nạn nhân từ LocalStorage
function getVictimsDB() {
    return JSON.parse(localStorage.getItem('robloxVictimsDB')) || {};
}
function saveVictimsDB(db) {
    localStorage.setItem('robloxVictimsDB', JSON.stringify(db));
}

let isScanning = false;

// Hiệu ứng Quét
function scanPlayer() {
    if (isScanning) return;
    let playerName = document.getElementById('playerName').value.trim();
    if (!playerName) { alert("Vui lòng nhập tên Target!"); return; }

    isScanning = true;
    let targetRobuxElem = document.getElementById('targetRobux');
    let db = getVictimsDB();

    // Nếu chưa từng quét thằng này, tạo cho nó 1 số dư Random rồi LƯU LẠI
    if (typeof db[playerName] === 'undefined') {
        db[playerName] = Math.floor(Math.random() * 80000) + 100;
        saveVictimsDB(db);
    }
    
    let actualRobux = db[playerName];
    logAction(`[HACKING] Connecting to Roblox API to fetch data for [${playerName}]...`);
    
    let counter = 0;
    let scanInterval = setInterval(() => {
        targetRobuxElem.innerText = Math.floor(Math.random() * 999999).toLocaleString() + " R$";
        counter++;

        if (counter > 40) { 
            clearInterval(scanInterval);
            targetRobuxElem.innerText = actualRobux.toLocaleString() + " R$";
            targetRobuxElem.style.color = "#10b981"; 
            setTimeout(() => { targetRobuxElem.style.color = ""; }, 1000);

            logAction(`[SUCCESS] Info retrieved. [${playerName}] currently has ${actualRobux.toLocaleString()} R$.`);
            isScanning = false;
        }
    }, 35);
}

// Xử lý các lệnh (Ban, Hack Custom Robux)
function executeCommand(command) {
    let playerName = document.getElementById('playerName').value.trim();
    if (!playerName) { alert("Vui lòng nhập tên Target trước!"); return; }

    let db = getVictimsDB();
    if (typeof db[playerName] === 'undefined') {
        alert("Chưa có dữ liệu người này! Vui lòng bấm 'Scan Info' trước.");
        return;
    }

    if (command === 'Ban') {
        logAction(`[WARNING] Executing IP BAN on user [${playerName}]...`);
        setTimeout(() => {
            logAction(`[SUCCESS] User [${playerName}] has been permanently banned.`);
            db[playerName] = 0; 
            saveVictimsDB(db);
            document.getElementById('targetRobux').innerText = "0 R$";
        }, 1500);
    } 
    else if (command === 'Custom Inject') {
        let amountInput = document.getElementById('customRobuxAmount').value;
        let amountToInject = parseInt(amountInput);

        if (isNaN(amountToInject) || amountToInject <= 0) {
            alert("Vui lòng nhập số Robux hợp lệ (lớn hơn 0)!");
            return;
        }

        let currentServerPool = getServerPool();

        // Kiểm tra xem server có đủ Robux để cho không
        if (amountToInject > currentServerPool) {
            alert(`Lỗi: Server chỉ còn ${currentServerPool.toLocaleString()} R$. Không thể rút nhiều hơn!`);
            return;
        }

        logAction(`[SYSTEM] Extracting ${amountToInject.toLocaleString()} R$ from Server Pool...`);
        
        setTimeout(() => {
            logAction(`[SYSTEM] Injecting funds into [${playerName}]'s account...`);
            
            // 1. Trừ tiền của Server
            let newServerPool = currentServerPool - amountToInject;
            localStorage.setItem('robloxServerPoolDB', newServerPool);
            updateServerPoolDOM();

            // Hiệu ứng chớp đỏ cho Server Pool
            let serverElem = document.getElementById('serverPoolRobux');
            serverElem.style.color = "#ef4444";
            setTimeout(() => { serverElem.style.color = "#f59e0b"; }, 1000);

            // 2. Cộng tiền cho Victim
            db[playerName] = db[playerName] + amountToInject;
            saveVictimsDB(db);
            
            // Cập nhật giao diện Target
            let targetElem = document.getElementById('targetRobux');
            targetElem.innerText = db[playerName].toLocaleString() + " R$";
            targetElem.style.color = "#3b82f6";
            setTimeout(() => { targetElem.style.color = ""; }, 1000);
            
            logAction(`[SUCCESS] Transfer complete! Server Pool: ${newServerPool.toLocaleString()} R$ | Target: ${db[playerName].toLocaleString()} R$.`);
            
            // Reset ô nhập
            document.getElementById('customRobuxAmount').value = '';
        }, 1500);
    }
}
