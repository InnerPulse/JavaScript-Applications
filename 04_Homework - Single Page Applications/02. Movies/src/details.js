import { e } from './dom.js';
import { build } from './dom.js';
import { request } from './api.js';
import { showHome } from './home.js';
import { showEdit } from './edit.js';

let main, section;

async function getMovieById(id) {
    const movie = await request('http://localhost:3030/data/movies/' + id);
    return movie;
}

async function getLikesByMovieId(movieId) {
    const likes = request(
        `http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22&distinct=_ownerId&count`
    );

    return likes;
}

async function getOwnLikeByMovieId(movieId) {
    if (sessionStorage.getItem('auth') != null) {
        const userId = JSON.parse(sessionStorage.getItem('auth')).userId;
        const likes = request(
            `http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userId}%22 `
        );

        return likes;
    }
}

async function editMovie(event) {
    event.preventDefault();
    showEdit(event);
}

async function deleteMovie(event) {
    event.preventDefault();
    const confirmed = confirm('Are you sure you want to delete this movie?');

    if (confirmed) {
        const movieId = event.target.parentNode.parentNode.parentNode.id;
        const response = await request('http://localhost:3030/data/movies/' + movieId, {
            method: 'delete',
            headers: {
                'X-Authorization': JSON.parse(sessionStorage.getItem('auth')).authToken,
            },
        });

        if (response) {
            alert('Movie deleted!');
            showHome();
        }
    }
}

function createMovieCard({ _id, _ownerId, title, description, img }, likes, ownLike) {
    const controls = [];

    const wrapper = e('div', null, 'container', { id: _id, ownerId: _ownerId });
    const content = e('div', null, 'row bg-light text-dark');
    const titleHeader = e('h1', `Movie title: ${title}`);
    const head = e('div', null, 'col-md-8');
    const image = e('img', null, 'img-thumbnail', { src: img, alt: 'Movie' });
    const body = e('div', null, 'col-md-4 text-center', { id: 'movieCard' });
    const descriptionHeader = e('h3', 'Movie Description');
    const paragraph = e('p', description);
    const delBtn = e('a', 'Delete', 'btn btn-danger', { href: '#' }, deleteMovie);
    const editBtn = e('a', 'Edit', 'btn btn-warning', { href: '#' }, editMovie);
    const likeBtn = e('a', 'Like', 'btn btn-primary', { href: '#' }, likeMove);
    const liked = e('span', likes + ' like' + (likes === 1 ? '' : 's'), 'enrolled-span');

    if (sessionStorage.getItem('auth') != null) {
        const userId = JSON.parse(sessionStorage.getItem('auth')).userId;
        if (userId == _ownerId) {
            controls.push(editBtn, delBtn);
        } else if (ownLike.length == 0) {
            controls.push(likeBtn);
        }
    }

    controls.push(liked);
    const result = build(
        wrapper,
        build(
            content,
            titleHeader,
            build(head, image),
            build(body, descriptionHeader, paragraph, ...controls)
        )
    );

    return result;

    async function likeMove(event) {
        event.preventDefault();
        const response = await request('http://localhost:3030/data/likes', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': JSON.parse(sessionStorage.getItem('auth')).authToken,
            },
            body: JSON.stringify({ movieId: _id }),
        });

        if (response) {
            likes++;
            event.target.remove();
            liked.textContent = likes + ' like' + (likes === 1 ? '' : 's');
        }
    }
}

export function setupDetails(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
}

export async function showDetails(id) {
    section.innerHTML = 'Loading&hellip;';
    main.innerHTML = '';
    main.appendChild(section);

    const [movie, likes, ownLike] = await Promise.all([
        getMovieById(id),
        getLikesByMovieId(id),
        getOwnLikeByMovieId(id),
    ]);

    const card = createMovieCard(movie, likes, ownLike);
    section.innerHTML = '';
    section.appendChild(card);
}
