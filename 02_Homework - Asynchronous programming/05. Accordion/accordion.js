window.onload = solution;

async function solution() {
    this.content = {};
    const articles = await getArticles();
    const IDs = articles.map((a) => a._id);

    for (const id of IDs) {
        content[id] = await getContent(id);
    }

    articles.map(createArticle).forEach((a) => document.getElementById('main').append(a));
}

async function getArticles() {
    try {
        const url = 'http://localhost:3030/jsonstore/advanced/articles/list';
        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        alert(error);
    }
}

async function getContent(id) {
    try {
        const url = 'http://localhost:3030/jsonstore/advanced/articles/details/' + id;
        const response = await fetch(url);
        const data = await response.json();

        return data.content;
    } catch (error) {
        alert(error);
    }
}

function createArticle(article) {
    const wrapper = create('div', null, 'accordion');
    const head = create('div', null, 'head');
    const title = create('span', article.title);
    const btn = create('button', 'More', 'button', { id: article._id });
    const hidden = create('div', null, 'extra');
    const paragraph = create('p', this.content[article._id]);

    btn.addEventListener('click', () => {
        hidden.style.display = hidden.style.display === 'block' ? 'none' : 'block';
        btn.textContent = btn.textContent === 'More' ? 'Less' : 'More';
    });

    return build(wrapper, build(head, title, btn), build(hidden, paragraph));
}

function create(type, txt, className, attributes) {
    const element = document.createElement(type);
    if (txt) {
        element.textContent = txt;
    }
    if (className) {
        element.className = className;
    }
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    }
    return element;
}

function build(main, ...rest) {
    while (rest.length) {
        main.append(rest.shift());
    }
    return main;
}
