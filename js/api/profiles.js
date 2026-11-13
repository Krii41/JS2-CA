import { getAccessToken } from "../utils/storage.js";

const BASE_URL = "https://v2.api.noroff.dev";
const NOROFF_API_KEY = "22146ae1-9235-42a3-b8fa-1201b08208ce";

export async function fetchProfile(username) {
  const accessToken = getAccessToken("accessToken");

  const response = await fetch(
    `${BASE_URL}/social/profiles/${encodeURIComponent(username)}?_posts=true&_followers=true&_following=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Unable to load profile");
  }

  return result.data;
}

export async function followUser(username) {
  const accessToken = getAccessToken("accessToken");

  const response = await fetch(
    `${BASE_URL}/social/profiles/${encodeURIComponent(username)}/follow`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || "Unable to follow user");
  }

  return result.data;
}

export async function unfollowUser(username) {
  const accessToken = getAccessToken("accessToken");

  const response = await fetch(
    `${BASE_URL}/social/profiles/${encodeURIComponent(username)}/unfollow`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || "Unable to unfollow user");
  }

  return result.data;
}