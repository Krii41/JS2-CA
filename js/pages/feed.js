import { setupNavigation } from "../components/navigation.js";
import { createPostCard } from "../components/postCard.js";
import { fetchPosts } from "../api/posts.js";

setupNavigation();

const postsContainer = document.getElementById("posts-container");

async function main() {
    try {
        const posts = await fetchPosts();
    
        posts.forEach((post) => {
            const postCard = createPostCard(post);
            postsContainer.appendChild(postCard);
    });
    } catch (error) {
        console.error(error);

        const errorMessage = document.createElement("p");
        errorMessage.classList.add("post-container","error-message");
        errorMessage.textContent = "Unable to load posts. Please try again later...";

        postsContainer.appendChild(errorMessage);
    }
}

main();