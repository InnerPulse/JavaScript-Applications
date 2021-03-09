(() => {
    document.getElementById('loadBooks').addEventListener('click', loadAllBooks);
    document.getElementById('createForm').addEventListener('submit', addNewBook);
    // loadAllBooks(); not required to automatically load data by the description
})();

async function loadAllBooks() {
    const tableBody = document.querySelector('tbody');
    const books = await request('http://localhost:3030/jsonstore/collections/books');

    if (!books) {
        return;
    }

    tableBody.innerHTML = '';
    const rows = Object.entries(books).map(buildBook);
    rows.forEach((b) => tableBody.append(b));
}

async function addNewBook(event) {
    event.preventDefault();
    const formInputs = [...event.target.querySelectorAll('input')];
    const values = formInputs.map((e) => e.value);
    const [title, author] = values;

    if (values.map(Boolean).includes(false)) {
        return alert('All fields are required!');
    }

    const result = await request('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify({ title, author }),
    });

    if (!result) {
        return;
    }

    event.target.reset();
    // loadAllBooks();  or without sending a request to the server I can do the following ->
    return document.querySelector('tbody').append(buildBook([result._id, { title, author }]));
}

async function deleteBook(event) {
    const bookId = event.target.parentNode.parentNode.id;
    const confirmed = confirm('Are you sure you want to delete this book?');
    const bookName = event.target.parentNode.parentNode.children[0].textContent;

    if (confirmed) {
        const response = await request(`http://localhost:3030/jsonstore/collections/books/${bookId}`, {
            method: 'delete',
            headers: { 'Content-Type': 'Application/json' },
        });

        if (!response) {
            return;
        }

        // return loadAllBooks(); - updates the book list
        // or if we don't want to send request to the server we can do the following:
        event.target.parentNode.parentNode.remove();
    }
}

async function editBook(event) {
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('createForm').style.display = 'none';

    const bookId = event.target.parentNode.parentNode.id;
    const [title, author] = [...event.target.parentNode.parentNode.children].map((e) => e.textContent);

    const [titleInput, authorInput] = editForm.querySelectorAll('input');
    titleInput.value = title;
    authorInput.value = author;

    document.getElementById('editForm').addEventListener('submit', (ev) => updateBook(ev, bookId));
}

async function updateBook(ev, id) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const title = formData.get('title');
    const author = formData.get('author');

    await request(`http://localhost:3030/jsonstore/collections/books/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author }),
    });

    document.getElementById('editForm').style.display = 'none';
    document.getElementById('createForm').style.display = 'block';

    ev.target.reset();
    loadAllBooks();
}

function buildBook([id, { title, author }]) {
    const tr = buildElements('tr', null, { id });
    const tdTitle = buildElements('td', title);
    const tdAuthor = buildElements('td', author);

    const btnsWrapper = buildElements('td');
    const editBtn = buildElements('button', 'Edit');
    const dltBtn = buildElements('button', 'Delete');

    btnsWrapper.append(editBtn, dltBtn);
    tr.append(tdTitle, tdAuthor, btnsWrapper);

    return tr;
}

async function request(url, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok == false) {
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

function buildElements(type, txt, attributes) {
    const element = document.createElement(type);
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    }
    if (txt) {
        element.textContent = txt;
        if (txt == 'Edit' || txt == 'Delete') {
            element.addEventListener('click', txt == 'Edit' ? editBook : deleteBook);
        }
    }
    return element;
}
