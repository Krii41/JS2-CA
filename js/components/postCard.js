import { editPost } from "../api/posts.js";
import { deletePost } from "../api/posts.js";
import { reactToPost } from "../api/posts.js";

export function createPostCard(post, isSinglePost = false) {
    const postContainer = document.createElement("div");
    postContainer.classList.add("post-container");
    postContainer.dataset.postId = post.id;

    postContainer.append(
        createPostHeader(post),
        createPostContent(post),
        createPostActions(post, isSinglePost)
    );

    return postContainer;
}

// help with ai to figure out the file path
const assetsPath =
    window.location.pathname.includes("/post/") ||
        window.location.pathname.includes("/profile")
        ? "../assets/icon/"
        : "assets/icon/";

function createPostHeader(post) {
    const loggedInUser = localStorage.getItem("username");

    const postHeader = document.createElement("div");
    postHeader.classList.add("post-header");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");

    const avatarImg = document.createElement("img");
    avatarImg.src = post.author?.avatar?.url || "assets/images/avatar.png";
    avatarImg.alt = post.author?.avatar?.alt || "User avatar";

    avatar.appendChild(avatarImg);

    const postAuthor = document.createElement("div");
    postAuthor.classList.add("post-author");

    const authorName = document.createElement("h4");
    authorName.textContent = post.author?.name || "Unknown user";

    const authorLink = document.createElement("a");

    const profilePath =
        window.location.pathname.includes("/profile/") ||
            window.location.pathname.includes("/post/")
            ? "../profile/index.html"
            : "profile/index.html";

    if (post.author?.name) {
        authorLink.href = `${profilePath}?name=${encodeURIComponent(post.author.name)}`;
    }

    authorLink.appendChild(authorName);

    const postDate = document.createElement("span");
    postDate.classList.add("post-date");
    postDate.textContent = new Date(post.created).toLocaleDateString("en-GB");

    postAuthor.append(authorLink, postDate);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-post");
    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";

    postHeader.append(avatar, postAuthor);

    if (loggedInUser && loggedInUser === post.author?.name) {
        postHeader.appendChild(deleteBtn);
    }

    deleteBtn.addEventListener("click", async () => {
        const confirmed = confirm("Are you sure?");

        if (!confirmed) return;

        try {
            await deletePost(post.id);

            const postCard = deleteBtn.closest(".post-container");
            postCard.remove();

            alert("Post deleted!");
        } catch (error) {
            console.error(error);
            alert("Unable to delete post.")
        }
    });

    return postHeader;
}

function createPostContent(post) {
    const postContent = document.createElement("div");
    postContent.classList.add("post-content");

    const postImg = document.createElement("div");
    postImg.classList.add("post-img");

    const postTitle = document.createElement("h4");
    postTitle.classList.add("post-title");
    postTitle.textContent = post.title;

    const postBody = document.createElement("p");
    postBody.classList.add("post-body");
    postBody.textContent = post.body || "";

    if (post.media?.url) {
        const image = document.createElement("img");

        image.src = post.media?.url;
        image.alt = post.media?.alt || post.title;

        postImg.appendChild(image);
        postContent.appendChild(postImg);
    }

    postContent.append(postTitle, postBody);

    return postContent;
}

function createPostActions(post, isSinglePost) {
    const loggedInUser = localStorage.getItem("username");
    const isOwner = loggedInUser && loggedInUser === post.author?.name;

    const postActions = document.createElement("div");
    postActions.classList.add("post-actions");

    const postActionsLeft = document.createElement("div");
    postActionsLeft.classList.add("post-actions-left");

    const postActionsRight = document.createElement("div");
    postActionsRight.classList.add("post-actions-right");

    const viewPost = document.createElement("a");
    viewPost.classList.add("view-post");
    const postPagePath =
        window.location.pathname.includes("/profile/")
            ? "../post/index.html"
            : "post/index.html";

    viewPost.href = `${postPagePath}?id=${post.id}`;

    const viewIcon = document.createElement("img");
    viewIcon.src = "assets/icon/eye.png";
    viewIcon.alt = "View post";
    viewIcon.src = `${assetsPath}eye.png`;

    viewPost.appendChild(viewIcon);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.type = "button";

    const editIcon = document.createElement("img");
    editIcon.src = "assets/icon/edit.png";
    editIcon.alt = "Edit post";
    editIcon.src = `${assetsPath}edit.png`;

    editBtn.appendChild(editIcon);

    if (!isSinglePost) {
        postActionsLeft.appendChild(viewPost);
    }

    if (isOwner) {
        postActionsLeft.appendChild(editBtn);
    }

    editBtn.addEventListener("click", () => {
        const postCard = editBtn.closest(".post-container");

        const title = postCard.querySelector(".post-title");
        const body = postCard.querySelector(".post-body");

        title.contentEditable = "true";
        body.contentEditable = "true";

        title.focus();

        const imageInput = document.createElement("input");

        imageInput.type = "url";
        imageInput.placeholder = "Image URL";
        imageInput.value = post.media?.url || "";
        imageInput.classList.add("edit-image-input");

        body.after(imageInput);

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.textContent = "Save";
        saveBtn.classList.add("save-btn");

        editBtn.after(saveBtn);
        editBtn.hidden = true;

        saveBtn.addEventListener("click", async () => {
            const updateData = {
                title: title.textContent.trim(),
                body: body.textContent.trim(),
                media: imageInput.value.trim()
                    ? {
                        url: imageInput.value.trim(),
                        alt: title.textContent.trim(),
                    }
                    : null,
            };

            try {
                await editPost(post.id, updateData);

                title.contentEditable = "false";
                body.contentEditable = "false";

                imageInput.remove();
                saveBtn.remove();
                editBtn.hidden = false;

                alert("Post updated successfully!");
            } catch (error) {
                console.error(error);
                alert("Unable to update post");
            }
        });
    })

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.type = "button";

    const likeIcon = document.createElement("img");
    likeIcon.src = "assets/icon/heart.png";
    likeIcon.alt = "";
    likeIcon.src = `${assetsPath}heart.png`;

    const likeCount = document.createElement("p");
    likeCount.classList.add("action-count-like");
    likeCount.textContent = post._count?.reactions ?? 0;

    likeBtn.append(likeIcon, likeCount);
    likeBtn.setAttribute("aria-label", "React to post");

    likeBtn.addEventListener("click", async () => {
        try {
            const result = await reactToPost(post.id, "❤️")

            const totalReactions = result.reactions.reduce(
                (total, reaction) => total + reaction.count,
                0
            );

            console.log("Reaction result:", result);
            likeCount.textContent = totalReactions;
        } catch (error) {
            console.error(error);
            alert("Unable to like post.");
        }
    })

    const commentBtn = document.createElement("button");
    commentBtn.classList.add("comment-btn");
    commentBtn.type = "button";

    const commentIcon = document.createElement("img");
    commentIcon.src = "assets/icon/comment.png";
    commentIcon.alt = "";
    commentIcon.src = `${assetsPath}comment.png`;

    const commentCount = document.createElement("p");
    commentCount.classList.add("action-count-comment");
    commentCount.textContent = post._count?.comments ?? 0;

    commentBtn.append(commentIcon, commentCount);
    commentBtn.setAttribute("aria-label", "Comment on post");

    commentBtn.addEventListener("click", () => {
        if (!isSinglePost) {
            window.location.href = `post/index.html?id=${post.id}`;
        } else {
            document.querySelector("comment-body").focus();
        }
    });

    postActionsRight.append(likeBtn, commentBtn);

    postActions.append(postActionsLeft, postActionsRight);

    return postActions;
}
