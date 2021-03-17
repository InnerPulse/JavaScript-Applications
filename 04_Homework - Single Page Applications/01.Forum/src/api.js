export async function request(url, options) {
    try {
        debugger;
        const response = await fetch(url, options);

        if (response.ok != true) {
            const error = await response.json();
            alert(error.message);
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        alert(error);
        throw new Error(error);
    }
}
