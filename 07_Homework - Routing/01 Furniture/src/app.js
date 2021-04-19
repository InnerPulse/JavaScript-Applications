import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js';

import { logout } from './api/data.js';
import { editPage } from './views/edit.js';
import { loginPage } from './views/login.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { catalogPage } from './views/catalog.js';
import { registerPage } from './views/register.js';
import { myFurniturePage } from './views/myFurniture.js';

// window.api = api; delete
const main = document.querySelector('.container');

page('/', decorateContext, catalogPage);
page('/login', decorateContext, loginPage);
page('/edit/:id', decorateContext, editPage);
page('/create', decorateContext, createPage);
page('/register', decorateContext, registerPage);
page('/details/:id', decorateContext, detailsPage);
page('/my-furniture', decorateContext, myFurniturePage);

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    page.redirect('/');
    setUserNav();
});

setUserNav();

// start application
page.start();

function decorateContext(ctx, next) {
    ctx.setUserNav = setUserNav;
    ctx.render = (content) => render(content, main);
    next();
}

export function setUserNav() {
    const userId = sessionStorage.getItem('userId');
    if (userId !== null) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('user').style.display = 'inline-block';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}
