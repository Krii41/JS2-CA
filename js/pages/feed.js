import { setupNavigation } from "../components/navigation.js";
import { createPostCard } from "../components/postCard.js";
import { fetchPosts } from "../api/posts.js";
import { getAccessToken } from "../utils/storage.js";
import { createPost } from "../api/posts.js";
import { fetchPostById } from "../api/posts.js";

setupNavigation();

const postsContainer = document.getElementById("posts-container");
const createPostForm = document.querySelector(".new-post-form");
const token = getAccessToken("accessToken");

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
        errorMessage.classList.add("post-container", "error-message");
        errorMessage.textContent = "Unable to load posts. Please try again later...";

        postsContainer.appendChild(errorMessage);
    }
}

main();


async function handleCreatePost(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formFields = Object.fromEntries(formData);

    if (formFields.media) {
        formFields.media = {
            url: formFields.media,
            alt: formFields.title,
        };
    } else {
        delete formFields.media;
    }

    try {
        const newPost = await createPost(formFields);
        const completePost = await fetchPostById(newPost.id);
        const postCard = createPostCard(completePost);
        postsContainer.prepend(postCard);
        createPostForm.reset();

        alert("Your post has been published!");

    } catch (error) {
        console.error(error);
        alert("Unable to create post. Please try again.");
    }
}

createPostForm.addEventListener("submit", handleCreatePost);