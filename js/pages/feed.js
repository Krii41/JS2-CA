import { setupNavigation } from "../components/navigation.js";
import { createPostCard } from "../components/postCard.js";
import { getAccessToken } from "../utils/storage.js";

setupNavigation();

const postsContainer = document.getElementById("posts-container");
const BASE_URL = "https://v2.api.noroff.dev";
const POSTS_URL = `${BASE_URL}/social/posts?_author=true`;

const NOROFF_API_KEY = "22146ae1-9235-42a3-b8fa-1201b08208ce";

async function fetchPosts() {
    try {
        const accessToken = getAccessToken("accessToken");
        console.log(accessToken);

        const fetchOptions = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Noroff-API-Key': NOROFF_API_KEY
            }
            
        }

        const response = await fetch(POSTS_URL, fetchOptions);
        const result = await response.json();
        return result.data;

    } catch (error) {
        console.log(error);
    }
}

fetchPosts();

async function main() {
    const posts = await fetchPosts();
    
    posts.forEach((post) => {
        const postCard = createPostCard(post);
        postsContainer.appendChild(postCard);
    });
}

main();