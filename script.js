// ==== 1️⃣ Fake Login với tài khoản cố định ====
function fakeLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    if (username === "havoloca" && password === "anhhdmin") {
        document.getElementById("loadingMessage").classList.remove("hidden");

        setTimeout(() => {
            window.location.href = "admin.html"; // Chuyển hướng sang Admin Panel
        }, 2000); // Delay 2s cho chuyên nghiệp
    } else {
        document.getElementById("errorMessage").innerText = "Sai tài khoản hoặc mật khẩu!";
    }
}

// ==== 2️⃣ Fake Log System ====
function executeCommand(command, player = "") {
    let logList = document.getElementById("logList");
    let logEntry = document.createElement("li");

    let playerText = player ? ` cho người chơi "${player}"` : "";
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] Lệnh "${command}"${playerText} đã được thực thi thành công.`;
    
    logList.appendChild(logEntry);
    logList.scrollTop = logList.scrollHeight;
}

// ==== 3️⃣ Fake Thêm 120H Robux ====
document.addEventListener("DOMContentLoaded", function () {
    let addRobuxBtn = document.getElementById("fakeAddRobux");
    
    if (addRobuxBtn) {
        addRobuxBtn.addEventListener("click", function () {
            let pendingRobux = document.getElementById("pendingRobux");
            let currentRobux = parseInt(pendingRobux.innerText);
            let newRobux = currentRobux + 2310;

            pendingRobux.innerText = newRobux;
            alert("Thêm 120H Robux thành công!");
        });
    }
});
