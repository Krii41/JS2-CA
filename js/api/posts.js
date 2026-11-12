import { getAccessToken } from "../utils/storage.js";


const BASE_URL = "https://v2.api.noroff.dev";
const POSTS_URL = `${BASE_URL}/social/posts?_author=true`;

const NOROFF_API_KEY = "22146ae1-9235-42a3-b8fa-1201b08208ce";

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

// help with ai
export async function fetchPostById(id) {
    const accessToken = getAccessToken("accessToken");

    const response = await fetch (
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
