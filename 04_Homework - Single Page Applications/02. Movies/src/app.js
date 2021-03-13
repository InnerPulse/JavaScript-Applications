import { setupHome, showHome } from './home.js';
import { setupLogin, showLogin } from './login.js';
import { setupRegister, showRegister } from './register.js';
import { setupDetails } from './details.js';
import { setupCreate, showCreate } from './create.js';
import { setupEdit } from './edit.js';
import { logout } from './logout.js';

const main = document.querySelector('main');

const links = {
    homeLink: showHome,
    loginLink: showLogin,
    createLink: showCreate,
    registerLink: showRegister,
};

setupSection('home-page', setupHome);
setupSection('form-login', setupLogin);
setupSection('form-sign-up', setupRegister);
setupSection('movie-details', setupDetails);
setupSection('add-movie', setupCreate);
setupSection('edit-movie', setupEdit);

setupNavigation();

// Start application in home view
showHome();

function setupSection(sectionId, setup) {
    const section = document.getElementById(sectionId);
    setup(main, section);
}

export function setupNavigation() {
    const auth = sessionStorage.getItem('auth');
    if (auth != null) {
        document.getElementById('createLink').style.display = 'inline-block';
        document.getElementById('welcome-msg').textContent = `Welcome ${JSON.parse(auth).email}`;
        [...document.querySelectorAll('nav .user')].forEach((l) => (l.style.display = 'block'));
        [...document.querySelectorAll('nav .guest')].forEach((l) => (l.style.display = 'none'));
    } else {
        document.getElementById('createLink').style.display = 'none';
        [...document.querySelectorAll('nav .user')].forEach((l) => (l.style.display = 'none'));
        [...document.querySelectorAll('nav .guest')].forEach((l) => (l.style.display = 'block'));
    }
}

(function addEvents() {
    document.querySelector('nav').addEventListener('click', (event) => {
        const view = links[event.target.id];
        if (typeof view == 'function') {
            event.preventDefault();
            view();
        }
    });
    document.getElementById('createLink').addEventListener('click', (event) => {
        event.preventDefault();
        showCreate();
    });
    document.getElementById('logoutBtn').addEventListener('click', logout);
})();
