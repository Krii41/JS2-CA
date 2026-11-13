import { setupNavigation } from "../components/navigation.js";
import { fetchPostById } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";
import { createCommentCard } from "../components/commentCard.js";
import { createComment } from "../api/posts.js";

setupNavigation();

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const singlePostContainer = document.getElementById("single-post-container");
const commentForm = document.querySelector("#comment-form");
const commentsList = document.querySelector(".comments-list");
const noComments = document.querySelector(".no-comments");

async function fetchSinglePost() {
    try {
        if (!postId) {
            throw new Error("Post ID is missing");
        }

        const post = await fetchPostById(postId);
        const postCard = createPostCard(post, true);

        singlePostContainer.appendChild(postCard);



        const comments = post.comments ?? [];

        comments.sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
        });

        if (comments.length === 0) {
            noComments.hidden = false;
        } else {
            comments.forEach((comment) => {
                const commentCard = createCommentCard(comment);
                commentsList.appendChild(commentCard);
            });
        }

    } catch (error) {
        console.error(error);

        const errorMessage = document.createElement("p");
        errorMessage.classList.add("post-container", "error-message");
        errorMessage.textContent = "Unable to load this post. Please try again later...";

        singlePostContainer.appendChild(errorMessage);
    }
}

fetchSinglePost();

commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(commentForm);
    const commentData = Object.fromEntries(formData);

    try {
        await createComment(postId, commentData);

        commentForm.reset();
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert("Unable to publish comment.");
    }
})