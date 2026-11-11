import { setupNavigation } from "../components/navigation.js";
import { fetchPostById } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";
import { createCommentCard } from "../components/commentCard.js";

setupNavigation();

const singlePostContainer = document.getElementById("single-post-container");

async function fetchSinglePost() {
    try {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("id");

        if (!postId) {
            throw new Error("Post ID is missing");
        }

        const post = await fetchPostById(postId);
        const postCard = createPostCard(post, true);

        singlePostContainer.appendChild(postCard);

        
        const noComments = document.querySelector(".no-comments");

        const comments = post.comments ?? [];

        if (comments.length === 0) {
            noComments.hidden = false;
        } else {
            comments.forEach((comment) => {
                const commentsList = document.querySelector(".comments-list");
                const commentCard = createCommentCard(comment);
                commentsList.appendChild(commentCard);
            });
        }   

    } catch (error) {
        console.error(error);

        console.error(error);

        const errorMessage = document.createElement("p");
        errorMessage.classList.add("post-container","error-message");
        errorMessage.textContent = "Unable to load this post. Please try again later...";

        singlePostContainer.appendChild(errorMessage);
    }
}

fetchSinglePost();