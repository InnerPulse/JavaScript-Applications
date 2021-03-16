import * as api from './api.js';

const host = 'http://localhost:3030';
api.settings.host = host;

export const login = api.login;
export const logout = api.logout;
export const register = api.register;

export async function getRecipeCount() {
	return api.get(host + '/data/recipes?count ');
}

export async function getRecipeById(id) {
	return await api.get(host + '/data/recipes/' + id);
}

export async function deleteRecipeById(id) {
	return await api.del(host + '/data/recipes/' + id);
}

export async function createRecipe(recipe) {
	return await api.post(host + '/data/recipes', recipe);
}

export async function editRecipeById(id, recipe) {
	return await api.put(host + '/data/recipes/' + id, recipe);
}

export async function getRecipes(page) {
	return await api.get(
		host + '/data/recipes?select=' + encodeURIComponent('_id,name,img') + `&offset=${(page - 1) * 2}&pageSize=2`
	);
}

export async function getRecent() {
    return await api.get(
		host + '/data/recipes?select=' + encodeURIComponent('_id,name,img') + '&sortBy=' + encodeURIComponent('_createdOn desc')
	);
}
