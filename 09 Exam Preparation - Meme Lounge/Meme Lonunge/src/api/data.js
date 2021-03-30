import * as api from './api.js';

const host = 'http://localhost:3030';
api.settings.host = host;

export const login = api.login;
export const logout = api.logout;
export const register = api.register;

// meme collection
export async function createMeme(body) {
    return await api.post(host + '/data/memes', body);
}

export async function getMemeById(id) {
    return await api.get(host + '/data/memes/' + id);
}

export async function deleteMeme(id) {
    return await api.del(host + '/data/memes/' + id);
}

export async function editMeme(id, body) {
    return await api.put(host + '/data/memes/' + id, body);
}

export async function getAllMemes() {
    return await api.get(host + '/data/memes?sortBy=_createdOn%20desc');
}

export async function getUserMemes(userId) {
    return await api.get(host + `/data/memes?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);
}
