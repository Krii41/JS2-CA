import { setupNavigation } from "../components/navigation.js";
import { fetchProfile } from "../api/profiles.js";
import { createPostCard } from "../components/postCard.js";
import { followUser, unfollowUser } from "../api/profiles.js";

setupNavigation();

const params = new URLSearchParams(window.location.search);
const loggedInUser = localStorage.getItem("username");
const username = params.get("name") || loggedInUser;
const profile = await fetchProfile(username);
const profileName = document.querySelector(".user-profile h2");
const profileEmail = document.querySelector(".user-profile p");
const profileAvatar = document.querySelector(".avatar.profile img");
const postsCount = document.querySelector(".posts-count .stat-number");
const followersCount = document.querySelector(".followers-count .stat-number");
const followingCount = document.querySelector(".following-count .stat-number");
const postsContainer = document.querySelector(".posts-container");
const followBtn = document.querySelector(".follow-btn");

function displayProfile(profile) {
    const profileHeading = document.querySelector(".profile-header h1");
    profileName.textContent = profile.name;
    profileEmail.textContent = profile.email;
    postsCount.textContent = profile._count?.posts ?? 0;
    followersCount.textContent = profile._count?.followers ?? 0;
    followingCount.textContent = profile._count?.following ?? 0;

    const isOwnProfile = profile.name === loggedInUser;
    followBtn.hidden = isOwnProfile;

    let isFollowing = profile.followers?.some(
        (follower) => follower.name === loggedInUser
    ) ?? false;

    followBtn.textContent = isFollowing ? "Unfollow" : "Follow";

    followBtn.onclick = async () => {
        followBtn.disabled = true;

        try {
            if (isFollowing) {
                await unfollowUser(profile.name);
            } else {
                await followUser(profile.name);
            }

            isFollowing = !isFollowing;

            followBtn.textContent = isFollowing ? "Unfollow" : "Follow";

            followersCount.textContent =
                Number(followersCount.textContent) + (isFollowing ? 1 : -1);

        } catch (error) {
            console.error(error);
            alert("Unable to update follow status.");
        } finally {
            followBtn.disabled = false;
        }
    };

    profileHeading.textContent = isOwnProfile
        ? "My Profile"
        : `${profile.name}'s Profile`;

    profileAvatar.src =
        profile.avatar?.url || "..assets/images/smile.png";

    profileAvatar.alt = `${profile.name}'s avatar`;
}

displayProfile(profile);

function displayProfilePosts(profile) {
    postsContainer.replaceChildren();

    const posts = profile.posts ?? [];

    if (posts.length === 0) {
        const message = document.createElement("p");
        message.classList.add("no-posts");
        message.textContent = "No posts yet.";
        postsContainer.appendChild(message);
        return;
    }

    posts.sort((a, b) => new Date(b.created) - new Date(a.created));

    posts.forEach((post) => {
        const postWithAuthor = {
            ...post,
            author: post.author ?? profile,
        };

        const postCard = createPostCard(postWithAuthor);
        postsContainer.appendChild(postCard);
    });
}

displayProfile(profile);
displayProfilePosts(profile);