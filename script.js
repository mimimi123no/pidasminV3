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
// HỆ THỐNG ADMIN DASHBOARD
// ==========================================
const translations = {
    vi: { title: "Tổng quan bảng điều khiển" },
    en: { title: "Dashboard Overview" }
};

const INITIAL_SERVER_POOL = 0;

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
        poolElem.innerText = currentPool.toLocaleString() + " R$";
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
        
        // Kích hoạt Fake Ping
        setInterval(() => {
            let ping = Math.floor(Math.random() * (60 - 25 + 1)) + 25; // Random ping từ 25ms đến 60ms
            if(document.getElementById('pingValue')) {
                document.getElementById('pingValue').innerText = ping;
            }
        }, 2000);
    }
});

function changeLanguage() {
    let lang = document.getElementById("languageSelect").value;
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

function clearLogs() {
    let logList = document.getElementById("logList");
    if (logList) {
        logList.innerHTML = "<li>[System] Logs have been cleared by Admin.</li>";
    }
}

// ==========================================
// HỆ THỐNG DATABASE PLAYER & ACTIONS
// ==========================================
function getVictimsDB() {
    return JSON.parse(localStorage.getItem('robloxVictimsDB')) || {};
}
function saveVictimsDB(db) {
    localStorage.setItem('robloxVictimsDB', JSON.stringify(db));
}

let isScanning = false;

function scanPlayer() {
    if (isScanning) return;
    let playerName = document.getElementById('playerName').value.trim();
    if (!playerName) { alert("Vui lòng nhập tên Target!"); return; }

    isScanning = true;
    let targetRobuxElem = document.getElementById('targetRobux');
    let db = getVictimsDB();

    if (typeof db[playerName] === 'undefined') {
        db[playerName] = Math.floor(Math.random() * 80000) + 100;
        saveVictimsDB(db);
    }
    
    let actualRobux = db[playerName];
    logAction(`[HACKING] Connecting to API to fetch data for [${playerName}]...`);
    
    let counter = 0;
    let scanInterval = setInterval(() => {
        targetRobuxElem.innerText = Math.floor(Math.random() * 999999).toLocaleString() + " R$";
        counter++;

        if (counter > 40) { 
            clearInterval(scanInterval);
            targetRobuxElem.innerText = actualRobux.toLocaleString() + " R$";
            targetRobuxElem.style.color = "#10b981"; 
            setTimeout(() => { targetRobuxElem.style.color = ""; }, 1000);

            logAction(`[SUCCESS] Info retrieved. [${playerName}] has ${actualRobux.toLocaleString()} R$.`);
            isScanning = false;
        }
    }, 35);
}

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
    else if (command === 'Kick') {
        logAction(`[SYSTEM] Sending Kick signal to [${playerName}]'s client...`);
        setTimeout(() => {
            logAction(`[SUCCESS] User [${playerName}] was kicked from the server (Connection Lost).`);
        }, 800);
    }
    else if (command === 'Freeze') {
        logAction(`[SYSTEM] Injecting freeze script into [${playerName}]'s humanoid...`);
        setTimeout(() => {
            logAction(`[SUCCESS] User [${playerName}] movement has been disabled.`);
        }, 800);
    }
    else if (command === 'Custom Inject') {
        let amountInput = document.getElementById('customRobuxAmount').value;
        let amountToInject = parseInt(amountInput);

        if (isNaN(amountToInject) || amountToInject <= 0) {
            alert("Vui lòng nhập số Robux hợp lệ!");
            return;
        }

        let currentServerPool = getServerPool();

        if (amountToInject > currentServerPool) {
            alert(`Lỗi: Ví chỉ còn ${currentServerPool.toLocaleString()} R$. Vui lòng Buy Robux thêm!`);
            return;
        }

        logAction(`[SYSTEM] Extracting ${amountToInject.toLocaleString()} R$ from Wallet...`);
        
        setTimeout(() => {
            let newServerPool = currentServerPool - amountToInject;
            localStorage.setItem('robloxServerPoolDB', newServerPool);
            updateServerPoolDOM();

            let serverElem = document.getElementById('serverPoolRobux');
            serverElem.style.color = "#ef4444";
            setTimeout(() => { serverElem.style.color = "#f59e0b"; }, 1000);

            db[playerName] = db[playerName] + amountToInject;
            saveVictimsDB(db);
            
            let targetElem = document.getElementById('targetRobux');
            targetElem.innerText = db[playerName].toLocaleString() + " R$";
            targetElem.style.color = "#3b82f6";
            setTimeout(() => { targetElem.style.color = ""; }, 1000);
            
            logAction(`[SUCCESS] Transferred to [${playerName}]. Wallet remaining: ${newServerPool.toLocaleString()} R$.`);
            document.getElementById('customRobuxAmount').value = '';
        }, 1500);
    }
}

// ==========================================
// HỆ THỐNG PROMO CODE GENERATOR
// ==========================================
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let p1 = ''; let p2 = '';
    for(let i=0; i<4; i++) {
        p1 += chars.charAt(Math.floor(Math.random() * chars.length));
        p2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    let fullCode = `RBX-2026-${p1}-${p2}`; // Sử dụng context năm 2026
    
    document.getElementById('generatedCode').value = fullCode;
    logAction(`[SYSTEM] Generated new unredeemed Promo Code: ${fullCode}`);
}

function copyCode() {
    let codeInput = document.getElementById('generatedCode');
    if (!codeInput.value) {
        alert("Vui lòng tạo code trước!");
        return;
    }
    codeInput.select();
    codeInput.setSelectionRange(0, 99999); // Cho mobile
    navigator.clipboard.writeText(codeInput.value);
    
    logAction(`[SYSTEM] Copied code ${codeInput.value} to clipboard.`);
    alert("Đã copy code: " + codeInput.value);
}

// ==========================================
// HỆ THỐNG MUA ROBUX VÀO VÍ
// ==========================================
function openBuyModal() {
    document.getElementById('buyModal').classList.remove('hidden');
    document.getElementById('paymentSetup').classList.remove('hidden');
    document.getElementById('checkoutArea').classList.add('hidden');
    document.getElementById('bankSelect').value = "";
    document.getElementById('usdAmount').value = 1;
}

function closeBuyModal() {
    document.getElementById('buyModal').classList.add('hidden');
}

function addPaymentMethod() {
    let bank = document.getElementById('bankSelect').value;
    if(!bank) { 
        alert("Vui lòng chọn Ngân hàng hoặc Visa!"); 
        return; 
    }
    
    alert("Đã liên kết " + bank + " thành công!");
    
    document.getElementById('paymentSetup').classList.add('hidden');
    document.getElementById('checkoutArea').classList.remove('hidden');
    document.getElementById('activeBank').innerText = bank;
}

function confirmPurchase() {
    let usdInput = document.getElementById('usdAmount').value;
    let usd = parseInt(usdInput);
    
    if (isNaN(usd) || usd <= 0) {
        alert("Số tiền không hợp lệ!");
        return;
    }

    let robuxEarned = usd * 800;
    
    let currentPool = getServerPool();
    let newPool = currentPool + robuxEarned;
    localStorage.setItem('robloxServerPoolDB', newPool);
    
    updateServerPoolDOM(); 
    
    logAction(`[BILLING] Đã nạp $${usd} qua ${document.getElementById('activeBank').innerText}. Nhận ${robuxEarned.toLocaleString()} R$ vào Ví.`);
    
    alert(`Thanh toán thành công! Ví đã được cộng ${robuxEarned.toLocaleString()} R$.`);
    closeBuyModal();
}
