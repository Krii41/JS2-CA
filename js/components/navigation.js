import { getAccessToken } from "../utils/storage.js";
import { removeAccessToken } from "../utils/storage.js";

export function setupNavigation() {
    const loginLink = document.querySelector("#login-link");
    const profileLink = document.querySelector("#profile-link");
    const logoutBtn = document.querySelector("#logout-btn");

    const token = getAccessToken("accessToken");

    loginLink.hidden = Boolean(token);
    profileLink.hidden = !token;
    
    if (logoutBtn) {
        logoutBtn.hidden = !token;
        logoutBtn.addEventListener("click", handleLogout);
    }
}

function handleLogout() {
    removeAccessToken();
    localStorage.removeItem("username");
    const feedUrl = new URL("../../index.html", import.meta.url);
    window.location.href = feedUrl.href;
}