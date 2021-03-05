(function solution() {
    const optionsMenu = document.getElementById('posts');
    document.getElementById('btnLoadPosts').addEventListener('click', () => loadPosts(optionsMenu));
    document.getElementById('btnViewPost').addEventListener('click', () => getComments(optionsMenu));
})();

async function loadPosts(options) {
    try {
        const url = 'http://localhost:3030/jsonstore/blog/posts';

        const response = await fetch(url);
        const data = await response.json();

        options.length = 0;
        return Object.values(data).forEach((v) => {
            const option = createOption(v.title, v.id);
            option.value = v.id;
            options.add(option);
        });
    } catch (error) {
        alert(error);
    }
}

async function getComments(options) {
    if (options.value) {
        const commentsUrl = 'http://localhost:3030/jsonstore/blog/comments';
        const postUrl = 'http://localhost:3030/jsonstore/blog/posts/' + options.value;

        const [postResponse, commentsResponse] = await Promise.all([fetch(postUrl), fetch(commentsUrl)]);

        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();

        const commentsArea = document.getElementById('post-comments');
        document.getElementById('post-body').textContent = postData.body;
        document.getElementById('post-title').textContent = postData.title;

        commentsArea.innerHTML = '';
        const comments = Object.values(commentsData).filter((c) => c.postId === options.value);
        comments.map(createComment).forEach((c) => commentsArea.append(c));
    } else {
        return alert('You need to load posts first!');
    }
}

function createOption(txt, value) {
    const option = document.createElement('option');
    option.text = txt;
    option.value = value;

    return option;
}

function createComment(data) {
    const comment = document.createElement('li');
    comment.textContent = data.text;
    comment.id = data.id;
    return comment;
}
