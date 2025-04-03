
function fakeLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    if (username === "havoloca" && password === "anhhdmin") {
        document.getElementById("loadingMessage").classList.remove("hidden");

        setTimeout(() => {
            window.location.href = "admin.html";
        }, 2000);
    } else {
        document.getElementById("errorMessage").innerText = "Wrong account or password!";
    }
}


function executeCommand(command, player = "") {
    let logList = document.getElementById("logList");
    let logEntry = document.createElement("li");

    let playerText = player ? ` cho người chơi "${player}"` : "";
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] command "${command}"${playerText} trying to complete!`;
    
    logList.appendChild(logEntry);
    logList.scrollTop = logList.scrollHeight;
}


document.addEventListener("DOMContentLoaded", function () {
    let addRobuxBtn = document.getElementById("fakeAddRobux");
    
    if (addRobuxBtn) {
        addRobuxBtn.addEventListener("click", function () {
            let pendingRobux = document.getElementById("pendingRobux");
            let currentRobux = parseInt(pendingRobux.innerText);
            let newRobux = currentRobux + 2310;

            pendingRobux.innerText = newRobux;
            alert("We are trying to add 120H Robux 0.002% success rate!");
        });
    }
});
