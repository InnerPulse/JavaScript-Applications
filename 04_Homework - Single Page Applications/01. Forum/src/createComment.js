import { request } from './api.js';
import setupView from './setupView.js';
import { generateComment } from './dom.js';

export async function setupCreate(event) {
    event.preventDefault();

    if (event.target.tagName != 'H2') {
        return;
    }

    const postId = event.target.parentNode.id;
    const response = await request('http://localhost:3030/jsonstore/collections/myboard/posts/' + postId);
    const { title, dateAndTime, subscribers } = response;

    setupView();
    document.getElementById('postTitle').textContent = title;
    document.getElementById('postTime').textContent = dateAndTime;
    document.getElementById('postSubscribers').textContent = subscribers;

    if (document.getElementById('commentsSubmitForm').onsubmit === null) {
        document.getElementById('commentsSubmitForm').onsubmit = async (event) =>
            createNewComment(event, postId);
    }

    [...document.getElementById('commentsSection').children]
        .filter((e) => e.classList.contains('comment'))
        .forEach((c) => c.remove());

    loadAllComments(postId);
}

async function createNewComment(event, postId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const [commentContent, userName] = [formData.get('postText'), formData.get('username')];

    if ([commentContent, userName].map(Boolean).includes(false)) {
        alert('All fields are required!');
        throw new Error('Empty fields!');
    }

    const newDate = new Date();
    const date = newDate.toISOString().slice(0, 10);
    const time = newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
    const dateAndTime = `${date} ${time}`;
    const likes = Math.round(Math.random() * (25 - 2));

    const comment = { commentContent, userName, dateAndTime, likes, postId };

    const response = await request('http://localhost:3030/jsonstore/collections/myboard/comments', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
    });

    if (response) {
        event.target.reset();
        loadAllComments(postId);
    }
}

async function loadAllComments(id) {
    const commentsSection = document.getElementById('commentsSection');
    const commentForm = document.getElementById('addCommentForm');
    [...commentsSection.children].filter((e) => e.classList.contains('comment')).forEach((c) => c.remove());

    const data = await request('http://localhost:3030/jsonstore/collections/myboard/comments');

    Object.values(data)
        .filter((c) => c.postId == id)
        .map(generateComment)
        .forEach((c) => commentsSection.insertBefore(c, commentForm));
}
