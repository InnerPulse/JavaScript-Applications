import { request } from './api.js';
import { showHome } from './home.js';
import { setupNavigation } from './app.js';

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const [email, password] = [formData.get('email'), formData.get('password')];

    const response = await request('http://localhost:3030/users/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (response) {
        event.target.reset();
        sessionStorage.setItem(
            'auth',
            JSON.stringify({
                userId: response._id,
                email: response.email,
                authToken: response.accessToken,
            })
        );

        showHome();
        setupNavigation();
    }
}

let main, section;

export function setupLogin(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showLogin() {
    main.innerHTML = '';
    main.appendChild(section);
}
