const host = 'http://localhost:3030/jsonstore/collections/books';

async function request(url, options) {
    return await (await fetch(url, options)).json();
}

async function getAllBooks() {
    return Object.entries(await request(host)).map(([k, v]) => Object.assign(v, { _id: k }));
}

async function getBookById(id) {
    return await request(host + '/' + id);
}

async function updateBook(id, book) {
    return await request(host + '/' + id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
}

async function createBook(book) {
    return await request(host, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
}

async function deleteBook(id) {
    return await request(host + '/' + id, {
        method: 'delete',
    });
}

export { getAllBooks, getBookById, updateBook, createBook, deleteBook };
