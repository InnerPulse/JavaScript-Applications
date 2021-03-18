import * as api from './data.js';
import { layoutTemplate } from './main.js';
import { render } from '../node_modules/lit-html/lit-html.js';

const onSubmit = {
    'add-form': onCreateSubmit,
    'edit-form': onEditSubmit,
};

const ctx = {
    list: [],
    async load() {
        ctx.list = await api.getAllBooks();
        update();
    },
    async onEdit(id) {
        const book = ctx.list.find((b) => b._id == id);

        ctx.list = await api.getAllBooks();
        update(book);
    },
    async onDelete(id) {
        const confirmed = confirm('Are you sure you want to delete this book?');
        if (confirmed) {
            await api.deleteBook(id);
        }

        ctx.list = await api.getAllBooks();
        update();
    },
};

document.body.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit[e.target.id](formData, e.target);
});

start();

async function start() {
    update();
}

function update(bookToEdit) {
    const result = layoutTemplate(ctx, bookToEdit);
    render(result, document.body);
}

async function onCreateSubmit(formData, form) {
    const book = {
        title: formData.get('title'),
        author: formData.get('author'),
    };
    await api.createBook(book);
    form.reset();

    ctx.list = await api.getAllBooks();
    update();
}

async function onEditSubmit(formData, form) {
    const id = formData.get('_id');

    const book = {
        title: formData.get('title'),
        author: formData.get('author'),
    };

    await api.updateBook(id, book);
    form.reset();

    ctx.list = await api.getAllBooks();
    update();
}
