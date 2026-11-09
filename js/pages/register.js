import { registerUser } from "../api/register.js";

const registerForm = document.querySelector("#register-form");

async function registerFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formFields = Object.fromEntries(formData);

    if (formFields.password !== formFields.confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    delete formFields.confirmPassword;
    
    // this try catch is from ai
    try {
        await registerUser(formFields);
        window.location.href = "../login/index.html";
    } catch (error) {
        alert(error.message);
    }
}

registerForm.addEventListener("submit", registerFormSubmit);