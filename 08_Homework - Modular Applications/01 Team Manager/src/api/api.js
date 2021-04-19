import { setUserNav } from '../app.js';
import page from '../../node_modules/page/page.mjs';

export const settings = { host: '' };

export async function get(url) {
    return await request(url, getOptions());
}

export async function del(url) {
    return await request(url, getOptions('delete'));
}

export async function put(url, data) {
    return await request(url, getOptions('put', data));
}

export async function post(url, data) {
    return await request(url, getOptions('post', data));
}

export async function logout() {
    const result = await get(settings.host + '/users/logout');

    sessionStorage.removeItem('auth');
    return result;
}

export async function login(email, password) {
    const result = await post(settings.host + '/users/login', { email, password });
    result.email = email;

    sessionStorage.setItem('auth', JSON.stringify(result));
    return result;
}

export async function register(email, password, username) {
    const result = await post(settings.host + '/users/register', { email, password, username });
    const { _id, accessToken } = result;

    sessionStorage.setItem('auth', JSON.stringify({ email, _id, username, accessToken }));
    return result;
}

function getOptions(method = 'get', body) {
    const options = {
        method,
        headers: {},
    };

    const auth = sessionStorage.getItem('auth');
    if (auth != null) {
        options.headers['X-Authorization'] = JSON.parse(auth).accessToken;
    }

    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    return options;
}

async function request(url, options) {
    try {
        const response = await fetch(url, options);

        if (response.ok === false) {
            const err = await response.json();
            throw new Error(err.message);
        }

        try {
            // logout return empty body and the server still returns content type as 'application/json'
            // so I can't check if content type is present therefor that's why I'm using an extra try catch block
            return await response.json();
        } catch (err) {
            return response;
        }
    } catch (err) {
        if (err.message === "Login or password don't match") {
            throw err;
        }

        if (err.message === 'A user with the same email already exists') {
            throw err;
        }

        if (err.message === 'Invalid access token') {
            sessionStorage.removeItem('auth');

            alert(err.message + '!');
            setUserNav();
            page.redirect('/');
            throw err;
        }

        alert(err.message + '!');
        throw err;
    }
}
