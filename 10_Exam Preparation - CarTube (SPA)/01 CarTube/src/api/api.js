import { page } from '../lib.js';
import setUserNav from '../app.js';

export const settings = { host: '' };

export async function get(url) {
    return await request(url, getOptions());
}

export async function del(url) {
    return await request(url, getOptions('delete'));
}

export async function post(url, data) {
    return await request(url, getOptions('post', data));
}

export async function put(url, data) {
    return await request(url, getOptions('put', data));
}

export async function logout() {
    const response = await get(settings.host + '/users/logout');
    sessionStorage.removeItem('auth');

    return response;
}

export async function login(username, password) {
    const response = await post(settings.host + '/users/login', { username, password });
    const { _id, accessToken, gender } = response;
    sessionStorage.setItem('auth', JSON.stringify({ _id, accessToken, username, gender }));

    return response;
}

export async function register(username, password) {
    const response = await post(settings.host + '/users/register', { username, password });
    const { _id, accessToken } = response;
    sessionStorage.setItem('auth', JSON.stringify({ _id, accessToken, username }));

    return response;
}

function getOptions(method = 'get', body) {
    const options = { method, headers: {} };

    if (sessionStorage.getItem('auth')) {
        options.headers['X-Authorization'] = JSON.parse(sessionStorage.getItem('auth')).accessToken;
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
        } catch (error) {
            return response;
        }
    } catch (err) {
        if (err.message === 'Invalid access token') {
            sessionStorage.removeItem('auth');

            alert(err.message + '!');
            setUserNav();
            page.redirect('/');
            throw err;
        }

        alert(err.message);
        throw err;
    }
}
