import homePage from './views/home.js';
import editPage from './views/edit.js';
import { page, render } from './lib.js';
import loginPage from './views/login.js';
import createPage from './views/create.js';
import detailsPage from './views/details.js';
import registerPage from './views/register.js';
import profilePage from './views/myProfile.js';
import allMemesPage from './views/allMemes.js';
import { logout as apiLogout } from './api/data.js';

const main = document.querySelector('main');
document.getElementById('logoutBtn').addEventListener('click', logout);

page('/', decorateContext, homePage);
page('/login', decorateContext, loginPage);
page('/edit/:id', decorateContext, editPage);
page('/create', decorateContext, createPage);
page('/register', decorateContext, registerPage);
page('/all-memes', decorateContext, allMemesPage);
page('/details/:id', decorateContext, detailsPage);
page('/my-profile', decorateContext, profilePage);

setUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    next();
}

export default function setUserNav() {
    if (sessionStorage.getItem('auth')) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('user').style.display = 'block';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}

async function logout() {
    await apiLogout();
    setUserNav();
    page.redirect('/');
}
