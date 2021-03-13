import { request } from './api.js';
import { showHome } from './home.js';
import { setupNavigation } from './app.js';

export async function logout() {
    if (sessionStorage.getItem('auth') != null) {
        const token = JSON.parse(sessionStorage.getItem('auth')).authToken;

        await request('http://localhost:3030/users/logout', {
            method: 'get',
            headers: { 'X-Authorization': token },
        });

        sessionStorage.removeItem('auth');
        showHome();
        setupNavigation();
    }
}
