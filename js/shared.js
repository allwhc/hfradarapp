// ===== CONFIG =====
var SERVER_URL = "https://hfradarsite.pythonanywhere.com";
var DEFAULT_SITES = ["Cuda","Kalp","Mach","Yanm","Wasi","Jgri","Gopa","Puri","Ptbl","Htby"];
var ADMIN_PWD = "niot@321";
var MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ===== HELPERS =====
function getServerUrl() {
    return localStorage.getItem("hfr_server_url") || SERVER_URL;
}
function getSitesList() {
    var stored = localStorage.getItem("hfr_sites_list");
    if (stored) { try { return JSON.parse(stored); } catch(e) {} }
    return DEFAULT_SITES;
}
function getAppPassword() {
    return localStorage.getItem("hfr_app_pwd") || "";
}
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function getDayName(year, month, day) {
    return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date(year, month - 1, day).getDay()];
}
function getPrevMonthYear() {
    var now = new Date();
    var m = now.getMonth(); // 0-indexed
    var y = now.getFullYear();
    if (m === 0) { m = 12; y--; }
    return { month: m, year: y };
}

// ===== TOAST =====
function showToast(msg, duration) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function() { t.classList.remove("show"); }, duration || 2500);
}

// ===== NAV =====
function initNav(activePage) {
    var menuBtn = document.getElementById("menuToggle");
    var sideMenu = document.getElementById("sideMenu");
    var overlay = document.getElementById("overlay");

    if (menuBtn) {
        menuBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            sideMenu.classList.add("open");
            overlay.classList.add("show");
        });
    }
    if (overlay) {
        overlay.addEventListener("click", function() {
            sideMenu.classList.remove("open");
            overlay.classList.remove("show");
        });
    }

    // Mark active link
    var links = document.querySelectorAll(".side-menu-list a");
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute("data-page") === activePage) {
            links[i].classList.add("active");
        }
    }
}

// ===== PASSWORD MODAL =====
var _pwdCallback = null;
function showPasswordModal(title, msg, callback) {
    var modal = document.getElementById("passwordModal");
    if (!modal) return;
    document.getElementById("pwdModalTitle").textContent = title || "Authorization Required";
    document.getElementById("pwdModalMsg").textContent = msg || "";
    document.getElementById("pwdModalInput").value = "";
    modal.style.display = "flex";
    _pwdCallback = callback;
    setTimeout(function() { document.getElementById("pwdModalInput").focus(); }, 100);
}
function closePasswordModal(confirmed) {
    document.getElementById("passwordModal").style.display = "none";
    if (_pwdCallback) {
        var val = document.getElementById("pwdModalInput").value;
        _pwdCallback(confirmed ? val : null);
        _pwdCallback = null;
    }
}

// ===== API =====
function apiPost(url, data, onSuccess, onError) {
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(function(r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
    })
    .then(function(json) { onSuccess(json); })
    .catch(function(err) { onError(err.message || "Network error"); });
}
