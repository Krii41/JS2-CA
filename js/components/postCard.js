export function createPostCard(post) {
    const postContainer = document.createElement("div");
    postContainer.classList.add("post-container");
    postContainer.dataset.postId = post.id;
    
    postContainer.append(
        createPostHeader(post),
        createPostContent(post),
        createPostActions(post)
    );
    
    return postContainer;
}

function createPostHeader(post) {
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

    const postDate = document.createElement("span");
    postDate.classList.add("post-date");
    postDate.textContent = new Date(post.created).toLocaleDateString("en-GB");

    postAuthor.append(authorName, postDate);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-post");
    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";

    postHeader.append(avatar, postAuthor, deleteBtn);

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

function createPostActions(post) {
    const postActions = document.createElement("div");
    postActions.classList.add("post-actions");

    const postActionsLeft = document.createElement("div");
    postActionsLeft.classList.add("post-actions-left");

    const postActionsRight = document.createElement("div");
    postActionsRight.classList.add("post-actions-right");

    const viewPost = document.createElement("a");
    viewPost.classList.add("view-post");
    viewPost.href = `post/index.html?id=${post.id}`;

    const viewIcon = document.createElement("img");
    viewIcon.src = "assets/icon/eye.png";
    viewIcon.alt = "View post";

    viewPost.appendChild(viewIcon);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.type = "button";

    const editIcon = document.createElement("img");
    editIcon.src = "assets/icon/edit.png";
    editIcon.alt = "Edit post";

    editBtn.appendChild(editIcon);

    postActionsLeft.append(viewPost, editBtn);

    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.type = "button";

    const likeIcon = document.createElement("img");
    likeIcon.src = "assets/icon/heart.png";
    likeIcon.alt = "";

    const likeCount = document.createElement("p");
    likeCount.classList.add("action-count-like");
    likeCount.textContent = post._count?.reactions ?? 0;

    likeBtn.append(likeIcon, likeCount);
    likeBtn.setAttribute("aria-label", "React to post");

    const commentBtn = document.createElement("button");
    commentBtn.classList.add("comment-btn");
    commentBtn.type = "button";

    const commentIcon = document.createElement("img");
    commentIcon.src = "assets/icon/comment.png";
    commentIcon.alt = "";

    const commentCount = document.createElement("p");
    commentCount.classList.add("action-count-comment");
    commentCount.textContent = post._count?.comments ?? 0;

    commentBtn.append(commentIcon, commentCount);
    commentBtn.setAttribute("aria-label", "Comment on post");

    postActionsRight.append(likeBtn, commentBtn);

    postActions.append(postActionsLeft, postActionsRight);
    
    return postActions;
}
