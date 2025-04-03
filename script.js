
let currentLanguage = "en";
const translations = {
    vi: {
        title: "Admin Dashboard V2",
        viewers: "👁 20 người đang xem",
        pendingRobux: "Pending Robux 💰",
        addRobux: "Thêm 120 Robux",
        banPlayer: "Ban Player",
        addRobuxBtn: "Add Robux",
        logSystem: "Log System",
        successMessage: "Lệnh đã được thực thi thành công.",
        changeLang: "Đã chuyển đổi ngôn ngữ sang"
    },
    en: {
        title: "Admin Dashboard V2",
        viewers: "👁 20 viewers online",
        pendingRobux: "Pending Robux 💰",
        addRobux: "Add 120 Robux",
        banPlayer: "Ban Player",
        addRobuxBtn: "Add Robux",
        logSystem: "Log System",
        successMessage: "Command executed successfully.",
        changeLang: "Language changed to"
    },
    ru: {
        title: "Панель администратора V2",
        viewers: "👁 20 зрителей онлайн",
        pendingRobux: "Ожидающий Robux 💰",
        addRobux: "Добавить 120 Robux",
        banPlayer: "Заблокировать игрока",
        addRobuxBtn: "Добавить Robux",
        logSystem: "Система логов",
        successMessage: "Команда успешно выполнена.",
        changeLang: "Язык изменен на"
    },
    zh: {
        title: "管理员仪表板 V2",
        viewers: "👁 20 人在线",
        pendingRobux: "待处理的 Robux 💰",
        addRobux: "添加 120 Robux",
        banPlayer: "封禁玩家",
        addRobuxBtn: "添加 Robux",
        logSystem: "日志系统",
        successMessage: "命令已成功执行。",
        changeLang: "语言已更改为"
    },
    fr: {
        title: "Tableau de bord Admin V2",
        viewers: "👁 20 spectateurs en ligne",
        pendingRobux: "Robux en attente 💰",
        addRobux: "Ajouter 120 Robux",
        banPlayer: "Bannir un joueur",
        addRobuxBtn: "Ajouter des Robux",
        logSystem: "Système de logs",
        successMessage: "Commande exécutée avec succès.",
        changeLang: "Langue changée en"
    },
    th: {
        title: "แดชบอร์ดผู้ดูแลระบบ V2",
        viewers: "👁 มีผู้ชมออนไลน์ 20 คน",
        pendingRobux: "รอการอนุมัติ Robux 💰",
        addRobux: "เพิ่ม 120 Robux",
        banPlayer: "แบนผู้เล่น",
        addRobuxBtn: "เพิ่ม Robux",
        logSystem: "ระบบบันทึก",
        successMessage: "คำสั่งดำเนินการสำเร็จ",
        changeLang: "เปลี่ยนภาษาเป็น"
    },
    lo: {
        title: "ແຜງຄວບຄຸມ V2",
        viewers: "👁 20 ຄົນກຳລັງເບິ່ງ",
        pendingRobux: "ລໍຖ້າ Robux 💰",
        addRobux: "ເພີ່ມ 120 Robux",
        banPlayer: "ແບນຜູ້ໃຊ້",
        addRobuxBtn: "ເພີ່ມ Robux",
        logSystem: "ລະບົບບັນທຶກ",
        successMessage: "ຄຳສັ່ງຖືກດຳເນີນການສຳເລັດ",
        changeLang: "ປ່ຽນພາສາເປັນ"
    },
    id: {
        title: "Dasbor Admin V2",
        viewers: "👁 20 penonton online",
        pendingRobux: "Robux yang tertunda 💰",
        addRobux: "Tambahkan 120 Robux",
        banPlayer: "Blokir Pemain",
        addRobuxBtn: "Tambahkan Robux",
        logSystem: "Sistem Log",
        successMessage: "Perintah berhasil dijalankan.",
        changeLang: "Bahasa telah diubah menjadi"
    },
    ph: {
        title: "Admin Dashboard V2",
        viewers: "👁 20 manonood online",
        pendingRobux: "Pending Robux 💰",
        addRobux: "Magdagdag ng 120 Robux",
        banPlayer: "Ban Player",
        addRobuxBtn: "Magdagdag ng Robux",
        logSystem: "Sistema ng Log",
        successMessage: "Matagumpay na naisakatuparan ang utos.",
        changeLang: "Wika ay nabago sa"
    }
};


function changeLanguage() {
    let lang = document.getElementById("languageSelect").value;
    currentLanguage = lang;

    document.querySelector("h1").innerText = translations[lang].title;
    document.querySelector(".dashboard-box p").innerText = translations[lang].viewers;
    document.getElementById("pendingRobux").previousSibling.textContent = translations[lang].pendingRobux + " ";
    document.getElementById("fakeAddRobux").innerText = translations[lang].addRobux;
    document.querySelectorAll("button")[1].innerText = translations[lang].banPlayer;
    document.querySelectorAll("button")[2].innerText = translations[lang].addRobuxBtn;
    document.querySelector("h2").innerText = translations[lang].logSystem;

    alert(`${translations[lang].changeLang}: ${lang.toUpperCase()}`);
}


function executeCommand(command, player = "") {
    let logList = document.getElementById("logList");
    let logEntry = document.createElement("li");
    
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${translations[currentLanguage].successMessage} (${command} ${player ? `cho ${player}` : ""})`;
    logList.appendChild(logEntry);
}


document.addEventListener("DOMContentLoaded", function () {
    let addRobuxBtn = document.getElementById("fakeAddRobux");
    if (addRobuxBtn) {
        addRobuxBtn.addEventListener("click", function () {
            let pendingRobux = document.getElementById("pendingRobux");
            pendingRobux.innerText = parseInt(pendingRobux.innerText) + 2310;
            alert(translations[currentLanguage].addRobux + " LOADing");
        });
    }
});
