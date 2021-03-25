import page from '../node_modules/page/page.mjs';

import homePage from './views/home.js';
import editPage from './views/edit.js';
import loginPage from './views/login.js';
import createPage from './views/create.js';
import browsePage from './views/browse.js';
import myTeamsPage from './views/myTeams.js';
import detailsPage from './views/details.js';
import registerPage from './views/register.js';
import { logout as logoutAPI } from './api/data.js';
import { render } from '../node_modules/lit-html/lit-html.js';

const main = document.querySelector('main');
document.getElementById('logoutBtn').addEventListener('click', logout);

page('/', decorateContext, homePage);
page('/login', decorateContext, loginPage);
page('/browse', decorateContext, browsePage);
page('/create', decorateContext, createPage);
page('/edit/:id', decorateContext, editPage);
page('/index.html', decorateContext, homePage);
page('/my-teams', decorateContext, myTeamsPage);
page('/register', decorateContext, registerPage);
page('/details/:id', decorateContext, detailsPage);

setUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.setUserNav = setUserNav;
    ctx.render = (content) => render(content, main);
    next();
}

export function setUserNav() {
    const auth = sessionStorage.getItem('auth');
    if (auth !== null) {
        [...document.querySelectorAll('nav a.guest')].forEach((a) => (a.style.display = 'none'));
        [...document.querySelectorAll('nav a.user')].forEach((a) => (a.style.display = 'block'));
    } else {
        [...document.querySelectorAll('nav a.user')].forEach((a) => (a.style.display = 'none'));
        [...document.querySelectorAll('nav a.guest')].forEach((a) => (a.style.display = 'block'));
    }
}

async function logout() {
    await logoutAPI();
    setUserNav();
    page.redirect('/');
}
