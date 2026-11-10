export function saveAccessToken(key, value) {
    localStorage.setItem(key, value);
}

export function getAccessToken(key) {
    return localStorage.getItem(key);
}

export function removeAccessToken() {
    localStorage.removeItem("accessToken");
}