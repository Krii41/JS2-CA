import { loginUser } from "../api/login.js";
import { saveAccessToken } from "../utils/storage.js";

const loginForm = document.querySelector("#login-form");

async function loginFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formFields = Object.fromEntries(formData);

    try {
        const result = await loginUser(formFields);

        const accessToken = result.data.accessToken;
        saveAccessToken("accessToken", accessToken);

        window.location.href = "../index.html";
    } catch (error) {
        alert(error.message);
    }
}

loginForm.addEventListener("submit", loginFormSubmit);


