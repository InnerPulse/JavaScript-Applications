import { request } from './api.js';
import { showHome } from './home.js';
import { uploadImageToImgBB } from './api.js';

let main, section;

export function setupEdit(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
}

export async function showEdit(event) {
    main.innerHTML = '';
    main.appendChild(section);

    const movieId = event.target.parentNode.parentNode.parentNode.id;
    const [titleInput, imgInput] = section.querySelectorAll('form input.form-control');
    const descriptionInput = section.querySelector('form textarea');
    section.querySelector('form').addEventListener('submit', (event) => onSubmit(event, movieId));

    const { _ownerId, title, description, img, _id } = await loadMovieForUpdate(movieId);
    imgInput.value = img;
    titleInput.value = title;
    descriptionInput.value = description;
}

async function loadMovieForUpdate(id) {
    return await request('http://localhost:3030/data/movies/' + id);
}

async function onSubmit(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const uploadedImg = document.getElementById('uploadImgFromEdit');
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

    const response = await request('http://localhost:3030/data/movies/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': JSON.parse(sessionStorage.getItem('auth')).authToken,
        },
        body: JSON.stringify(movie),
    });

    if (response) {
        showHome();
    }
}
