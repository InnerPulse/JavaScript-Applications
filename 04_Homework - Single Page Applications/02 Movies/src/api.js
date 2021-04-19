import { showHome } from './home.js';
import { setupNavigation } from './app.js';

export async function request(url, options) {
    try {
        const response = await fetch(url, options);

        if (url.includes('logout')) {
            return response;
        }

        if (response.ok != true) {
            const error = await response.json();
            alert(error.message);

            if (error.message == 'Invalid access token') {
                sessionStorage.removeItem('auth');
                showHome();
                setupNavigation();
            }

            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return alert(error);
    }
}

export async function uploadImageToImgBB(file) {
    const apiKey = 'a8c2bc24f67578e5763a82fbae79e864';

    const formData = new FormData();
    formData.append('image', file);

    const data = await request(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'post',
        mode: 'cors',
        body: formData,
    });

    return data.data.url;
}
