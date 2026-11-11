export function createCommentCard(comment) {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("existing-comment");

    const postHeader = document.createElement("div");
    postHeader.classList.add("post-header");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");

    const avatarImg = document.createElement("img");
    avatarImg.src = comment.author?.avatar?.url || "../assets/images/avatar.png";
    avatarImg.alt = comment.author?.avatar?.alt || "User avatar";

    const postAuthor = document.createElement("div");
    postAuthor.classList.add("post-author");

    const authorName = document.createElement("h4");
    authorName.textContent = comment.author?.name || "Unknown user";

    const postDate = document.createElement("span");
    postDate.classList.add("post-date");
    postDate.textContent = new Date(comment.created).toLocaleDateString("en-GB");

    const postBody = document.createElement("div");
    postBody.classList.add("post-body");

    const text = document.createElement("p");
    text.textContent = comment.body;

    postBody.appendChild(text);
    avatar.appendChild(avatarImg);
    postAuthor.append(authorName, postDate);
    postHeader.append(avatar, postAuthor);
    commentContainer.append(postHeader, postBody);

    return commentContainer;

}