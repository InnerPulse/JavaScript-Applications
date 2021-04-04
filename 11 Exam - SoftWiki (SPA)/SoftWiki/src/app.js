import { page, render } from './lib.js';
import { logout as apiLogout } from './api/data.js';

import homePage from './views/home.js';
import editPage from './views/edit.js';
import loginPage from './views/login.js';
import createPage from './views/create.js';
import searchPage from './views/search.js';
import detailsPage from './views/details.js';
import registerPage from './views/register.js';
import cataloguePage from './views/catalogue.js';

page('/', decorateContext, homePage);
page('/login', decorateContext, loginPage);
page('/edit/:id', decorateContext, editPage);
page('/create', decorateContext, createPage);
page('/search/', decorateContext, searchPage);
page('/register', decorateContext, registerPage);
page('/catalogue', decorateContext, cataloguePage);
page('/details/:id', decorateContext, detailsPage);

const main = document.getElementById('main-content');
document.getElementById('logoutBtn').addEventListener('click', logout);

setUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.setUserNav = setUserNav;
    ctx.render = (content) => render(content, main);
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
