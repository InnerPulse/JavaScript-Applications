(async function getRecipesList() {
    const token = sessionStorage.getItem('userToken');

    if (token) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        document.getElementById('guest').style.display = 'inline-block';
    }

    const main = document.querySelector('main');

    try {
        const response = await fetch('http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg');
        const recipes = await response.json();

        if (!response.ok) {
            return alert(response.statusText || response.status);
            // Behavior of statusText of an error in Chrome is different than in Mozilla!
            // Tested in Mozilla. In Chrome the result of it is empty string.
        }

        main.innerHTML = '';

        Object.values(recipes)
            .map(createPreview)
            .forEach((r) => main.append(r));
    } catch (error) {
        return alert(error.message);
    }
})();

async function logout() {
    const token = sessionStorage.getItem('userToken');
    const response = await fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: { 'X-Authorization': token },
    });

    if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
    }

    sessionStorage.removeItem('userToken');
    window.location.pathname = 'index.html';
}

function createPreview(recipe) {
    const result = e(
        'article',
        { className: 'preview' },
        e('div', { className: 'title' }, e('h2', {}, recipe.name)),
        e('div', { className: 'small' }, e('img', { src: recipe.img }))
    );

    result.addEventListener('click', () => getRecipeDetails(recipe._id, result));
    return result;
}

async function getRecipeDetails(id, preview) {
    const url = `http://localhost:3030/data/recipes/${id}`;
    // the way the id is implemented could result in a HTML injection but this will never be done in production
    // without validation function even though in this particular case the id doesn't come from the outside.
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok == false) {
        alert(response.statusText || response.status);
    }

    const result = e(
        'article',
        {},
        e('h2', { onClick: toggleCard }, data.name),
        e(
            'div',
            { className: 'band' },
            e('div', { className: 'thumb' }, e('img', { src: data.img })),
            e(
                'div',
                { className: 'ingredients' },
                e('h3', {}, 'Ingredients:'),
                e(
                    'ul',
                    {},
                    data.ingredients.map((i) => e('li', {}, i))
                )
            )
        ),
        e(
            'div',
            { className: 'description' },
            e('h3', {}, 'Preparation:'),
            data.steps.map((s) => e('p', {}, s))
        )
    );

    preview.replaceWith(result);

    function toggleCard() {
        result.replaceWith(preview);
    }
}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach((e) => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}
