import { request } from './api.js';
import { showDetails } from './details.js';
import { uploadImageToImgBB } from './api.js';

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const uploadedImg = document.getElementById('uploadImgFromCreate');
    const movie = {
        title: formData.get('title'),
        description: formData.get('description'),
        img: formData.get('imageUrl'),
    };

    if (Object.keys(movie).map(Boolean).includes(false)) {
        return alert('All fields are required!');
    } else if (movie.img.slice(0, 4) != 'http' && uploadedImg.files.length == 0) {
        return alert('Please include valid url for image!');
    }

    if (uploadedImg.files.length) {
        const file = uploadedImg.files[0];
        const url = await uploadImageToImgBB(file);
        movie.img = url;
    }

    const response = await request('http://localhost:3030/data/movies', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': JSON.parse(sessionStorage.getItem('auth')).authToken,
        },
        body: JSON.stringify(movie),
    });

    if (response) {
        const movie = response;
        showDetails(movie._id);
    }
}

let main, section;

export function setupCreate(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showCreate() {
    main.innerHTML = '';
    main.appendChild(section);
}
