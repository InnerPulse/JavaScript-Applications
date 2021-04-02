import * as api from './api.js';

const host = 'http://localhost:3030';
api.settings.host = host;

export const login = api.login;
export const logout = api.logout;
export const register = api.register;

// vehicle collection
export async function deleteAd(id) {
    return await api.del(host + '/data/cars/' + id);
}

export async function getAdById(id) {
    return await api.get(host + '/data/cars/' + id);
}

export async function createAd(body) {
    return await api.post(host + '/data/cars', body);
}

export async function editAd(id, body) {
    return await api.put(host + '/data/cars/' + id, body);
}

export async function search(query) {
    return await api.get(host + '/data/cars?where=year%3D' + query);
}

export async function getAllAds() {
    return await api.get(host + '/data/cars?sortBy=_createdOn%20desc');
}

export async function getUserAds(userId) {
    return await api.get(host + `/data/cars?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);
}
