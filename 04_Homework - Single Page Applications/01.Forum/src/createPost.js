import { request } from './api.js';
import { loadAllPosts } from './app.js';

export async function setupCreate(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const [title, userName, postText] = [
        formData.get('topicName'),
        formData.get('username'),
        formData.get('postText'),
    ];

    if ([title, userName, postText].map(Boolean).includes(false)) {
        alert('All fields are required!');
        throw new Error('Empty fields!');
    }

    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    const dateAndTime = `${date} ${time}`;
    const subscribers = Math.round(Math.random() * (2000 - 50));

    event.target.reset();

    const newTopic = { title, userName, postText, subscribers, dateAndTime };
    create(newTopic);
}

async function create(data) {
    const response = await request('http://localhost:3030/jsonstore/collections/myboard/posts', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response) {
        loadAllPosts();
    }
}
