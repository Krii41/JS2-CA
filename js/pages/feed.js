import { setupNavigation } from "../components/navigation.js";
import { getAccessToken } from "../utils/storage.js";
import { createPostCard } from "../components/postCard.js";
import { fetchPosts } from "../api/posts.js";
import { createPost } from "../api/posts.js";
import { fetchPostById } from "../api/posts.js";

setupNavigation();

const postsContainer = document.getElementById("posts-container");
const createPostForm = document.querySelector(".new-post-form");
const searchInput = document.querySelector("#search-input");
const searchContainer = document.querySelector(".search");
const searchToggle = document.querySelector(".search-toggle");

let allPosts = [];

/**
 * Renders an array of post in the feed.
 * 
 * @param {Array<Object>} posts - The posts to display
 * @returns {void}
 */

function renderPosts(posts) {
    postsContainer.innerHTML = "";

    if (posts.length === 0) {
        const noPosts = document.createElement("p");
        noPosts.classList.add("no-posts");
        noPosts.textContent = "No posts found. Try another search!";

        postsContainer.appendChild(noPosts);
        return;
    }

    posts.forEach((post) => {
        const postCard = createPostCard(post);
        postsContainer.appendChild(postCard);
    })
}

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    const filteredPosts = allPosts.filter((post) => {
        const title = (post.title || "").toLowerCase();
        const body = (post.body || "").toLowerCase();

        return title.includes(searchTerm) || body.includes(searchTerm);
    });

    renderPosts(filteredPosts);
})

searchToggle.addEventListener("click", () => {
    const isActive = searchContainer.classList.toggle("active");

    searchToggle.setAttribute("aria-expanded", isActive);

    if (isActive) {
        searchInput.focus();
    }
})

/**
 * Checks the users login status and displays the appropriate content.
 * Fetches the posts for logged-in users.
 * 
 * @async
 * @returns {Promise<void>}
 */

async function main() {
    const token = getAccessToken("accessToken");

    if (!token) {
        document.querySelector(".create-post").hidden = true;

        const loginMessage = document.createElement("p");

        loginMessage.textContent =
            "Log in to explore the latest posts and join the conversation!";

        loginMessage.classList.add("login-message");

        postsContainer.appendChild(loginMessage);

        return;
    }

    document.querySelector(".create-post").hidden = false;

    const username = localStorage.getItem("username");

    const usernameElement = document.querySelector(
        ".create-post .post-author h4"
    );

    if (usernameElement && username) {
        usernameElement.textContent = username;
    }

    try {
        allPosts = await fetchPosts();

        renderPosts(allPosts);

    } catch (error) {
        console.error(error);

        const errorMessage = document.createElement("p");
        errorMessage.classList.add("post-container", "error-message");
        errorMessage.textContent = "Oops! Something went wrong while loading posts. Please try again.";

        postsContainer.appendChild(errorMessage);
    }
}

main();

/**
 * Creates new post and shows alert message whether post is published or not.
 * Collects form data and sends it to the API.
 * 
 * @async
 * @param {SubmitEvent} e - Form submission event.
 * @returns {Promise<void>}
 */

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

