export async function request(url, options) {
    try {
        const response = await fetch(url, options);

        if (response.ok != true) {
            const error = await response.json();
            alert(error.message);
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return alert(error);
    }
}
