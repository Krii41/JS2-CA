export function createEditForm(post) {
    const form = document.createElement("form");
    form.classList.add("edit-post-form");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.value = post.title;
    titleInput.required = true;

    form.appendChild(titleInput);

    

    return form;
}