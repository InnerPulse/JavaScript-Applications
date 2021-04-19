import { e } from './dom.js';
import { build } from './dom.js';
import { request } from './api.js';
import { showDetails } from './details.js';
import { setupNavigation } from './app.js';

async function getMovies() {
    const data = await request('http://localhost:3030/data/movies');
    return data;
}

function createMoviePreview({ _id, _ownerId, title, img }) {
    const wrapper = e('div', null, 'card mb-4', { _ownerId, _id });
    const image = e('img', null, 'card-img-top', { src: img, alt: 'Card image cap', width: '400' });
    const body = e('div', null, 'card-body');
    const h4 = e('h4', title, 'card-title');
    const footer = e('footer', null, 'card-footer');
    const infoBtn = e('button', 'Details', 'btn btn-info movieDetailsLink', { id: _id });

    const movieCard = build(wrapper, image, build(body, h4), build(footer, infoBtn));
    return movieCard;
}

let main, section, container;

export function setupHome(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
    container = section.querySelector('.card-deck.d-flex.justify-content-center');

    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('movieDetailsLink')) {
            showDetails(event.target.id);
        }
    });
}

export async function showHome() {
    container.innerHTML = 'Loading&hellip;';
    // hellip means horizontal ellipsis -> the fancy way ot putting three dots haha
    main.innerHTML = '';
    main.appendChild(section);

    const movies = await getMovies();
    const cards = movies.map(createMoviePreview);
    const fragment = document.createDocumentFragment();
    cards.forEach((c) => fragment.appendChild(c));

    container.innerHTML = '';
    container.appendChild(fragment);
    setupNavigation();
}
