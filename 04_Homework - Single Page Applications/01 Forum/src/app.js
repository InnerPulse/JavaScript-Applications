import { request } from './api.js';
import setupView from './setupView.js';
import { generateTopic } from './dom.js';
import { setupCreate as createPost } from './createPost.js';
import { setupCreate as createComment } from './createComment.js';

(() => {
    const form = document.querySelector('form');
    form.addEventListener('submit', createPost);
    form.querySelector('#cancelBtn').addEventListener('click', resetForm);
    document.body.querySelector('a').addEventListener('click', setupView);
    document.querySelector('.topic-title').addEventListener('click', createComment);

    loadAllPosts();
})();

export async function loadAllPosts() {
    const postSection = document.querySelector('.topic-title');
    postSection.innerHTML = 'Loading...';
    const data = await request('http://localhost:3030/jsonstore/collections/myboard/posts');
    postSection.innerHTML = '';

    Object.values(data)
        .map(generateTopic)
        .forEach((post) => postSection.append(post));
}

function resetForm(e) {
    e.preventDefault();
    this.form.reset();
}
