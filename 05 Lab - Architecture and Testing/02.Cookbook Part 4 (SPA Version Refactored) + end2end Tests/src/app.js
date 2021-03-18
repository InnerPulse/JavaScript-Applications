import { setupHome } from './views/home.js';
import { setupEdit } from './views/edit.js';
import { setupLogin } from './views/login.js';
import { setupCreate } from './views/create.js';
import { setupDetails } from './views/details.js';
import { setupCatalog } from './views/catalog.js';
import { createNavigation } from './navigation.js';
import { setupRegister } from './views/register.js';
import { logout as apiLogout } from './api/data.js';

window.addEventListener('load', async () => {
	const nav = document.querySelector('nav');
	const main = document.querySelector('main');
	const navigation = createNavigation(main, nav);

	navigation.registerView('home', document.getElementById('home'), setupHome);
	navigation.registerView('catalog', document.getElementById('catalog'), setupCatalog, 'catalogLink');
	navigation.registerView('details', document.getElementById('details'), setupDetails);
	navigation.registerView('login', document.getElementById('login'), setupLogin, 'loginLink');
	navigation.registerView('register', document.getElementById('register'), setupRegister, 'registerLink');
	navigation.registerView('create', document.getElementById('create'), setupCreate, 'createLink');
	navigation.registerView('edit', document.getElementById('edit'), setupEdit);
	document.getElementById('views').remove();

	navigation.setUserNav();
	document.getElementById('logoutBtn').addEventListener('click', logout);

	// Start application in catalog view
	navigation.goTo('home');

	async function logout() {
		try {
			await apiLogout();
			navigation.setUserNav();
			navigation.goTo('home');
		} catch (err) {
			alert(err.message);
		}
	}
});
