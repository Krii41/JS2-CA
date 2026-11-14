import { getAccessToken } from "../utils/storage.js";


const BASE_URL = "https://v2.api.noroff.dev";
const POSTS_URL = `${BASE_URL}/social/posts?_author=true`;

const NOROFF_API_KEY = "22146ae1-9235-42a3-b8fa-1201b08208ce";

/**
 * Fetches all posts from API.
 * 
 * @async
 * @returns {Promise<Object[]>} An array of post objects.
 */
export async function fetchPosts() {
    const accessToken = getAccessToken("accessToken");

    const fetchOptions = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Noroff-API-Key': NOROFF_API_KEY
        }

    }

    const response = await fetch(POSTS_URL, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0].message || "Failed to fetch posts");
    }

    return result.data;
}

/**
 * Fetches a single post by its ID from API.
 * 
 * @async
 * @param {number} id - The ID of the post to fetch.
 * @returns {Promise<Object>} Requested post data.
 */
export async function fetchPostById(id) {
    const accessToken = getAccessToken("accessToken");

    const response = await fetch(
        `${BASE_URL}/social/posts/${id}?_author=true&_comments=true&_reactions=true`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": NOROFF_API_KEY,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error("Failed to fetch post");
    }

    return result.data;
}

/**
 * Sends new post data to API to create a post.
 * 
 * @async
 * @param {Object} postData - The data for the new post.
 * @returns {Promise<Object>} - The new post.
 */
export async function createPost(postData) {
    const accessToken = getAccessToken("accessToken");

    const response = await fetch(`${BASE_URL}/social/posts`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": NOROFF_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Failed to create post");
    }

    return result.data;

}

/**
 * Updates an existing post.
 * 
 * @async
 * @param {number} postId - The ID of the post to update.
 * @param {Object} postData - The updated post data.
 * @returns {Promise<Object>} The updated post object.
 */
export async function editPost(postId, postData) {
    const accessToken = getAccessToken("accessToken");

    const response = await fetch(`${BASE_URL}/social/posts/${postId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": NOROFF_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Failed to update post");
    }

    return result.data;
}

/**
 * Deletes the existing post from API
 * 
 * @async
 * @param {number} postId - The ID of the post to be deleted.
 * @returns {Promise<void>} Resolves when the post is deleted
 */
export async function deletePost(postId) {
    const accessToken = getAccessToken("accessToken");

    const response = await fetch(`${BASE_URL}/social/posts/${postId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": NOROFF_API_KEY,
            },
        });

    if (!response.ok) {
        throw new Error("Unable to delete post");
    }
}

/**
 * Creates a new comment on a post using API.
 * 
 * @async
 * @param {number} postId - The ID of the post to be comment on.
 * @param {Object} commentData  - The comment data to submit.
 * @returns {Promise<Object>}  The created comment data.
 */
export async function createComment(postId, commentData) {
    const accessToken = getAccessToken("accessToken");

    const response = await fetch(`${BASE_URL}/social/posts/${postId}/comment`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": NOROFF_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
        });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Unable to add comment");
    }

    return result.data;

}

/**
 * Adds or removes an emoji reaction on a post.
 * 
 * @async
 * @param {number} postId - The ID of the post to react to.. 
 * @param {string} symbol -The emoji used for the reaction.
 * @returns {Promise<Object>} The updated reaction data.
 */
export async function reactToPost(postId, symbol) {
    const accessToken = getAccessToken("accessToken");

    const response = await fetch(`${BASE_URL}/social/posts/${postId}/react/${encodeURIComponent(symbol)}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": NOROFF_API_KEY,
            },
        });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Unable to react to popst");
    }

    return result.data;
}