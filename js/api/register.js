const BASE_URL = "https://v2.api.noroff.dev";
const BASE_URL_AUTH = `${BASE_URL}/auth/register`;



export async function registerUser(userData) {
        const postData = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        };

        const response = await fetch(BASE_URL_AUTH, postData);
        const result = await response.json();
        
        if(!response.ok) {
            throw new Error(result.errors?.[0]?.message || "Registration failed");
        }

        return result;
}





