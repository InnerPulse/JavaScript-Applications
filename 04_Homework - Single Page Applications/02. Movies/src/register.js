import { request } from './api.js';
import { showHome } from './home.js';
import { setupNavigation } from './app.js';

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const [email, password, rePass] = [
        formData.get('email'),
        formData.get('password'),
        formData.get('repeatPassword'),
    ];

    if (email == '' || password == '') {
        return alert('All fields are required!');
    } else if (password !== rePass) {
        return alert("Passwords don't match!");
    }

    const response = await request('http://localhost:3030/users/register', {
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

export function setupRegister(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    section.querySelector('form').addEventListener('submit', onSubmit);
}

export async function showRegister() {
    main.innerHTML = '';
    main.appendChild(section);
}
