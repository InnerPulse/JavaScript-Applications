window.addEventListener('load', () => loadRecipes());

async function loadRecipes() {
    const url = 'http://localhost:3030/jsonstore/cookbook/recipes';
    const mainElement = document.querySelector('body > main');

    try {
        const response = await fetch(url);
        const recipes = await response.json();

        if (response.ok == false) {
            throw new Error(response.statusText);
            // Behavior of statusText of an error in Chrome is different than in Mozilla!
            // Tested in Mozilla.
        }
        mainElement.innerHTML = '';

        Object.values(recipes)
            .map(createPreview)
            .forEach((r) => mainElement.append(r));
    } catch (error) {
        alert(error.message);
    }
}

function createPreview(recipe) {
    const result = e('article', { className: 'preview' },
        e('div', { className: 'title' }, e('h2', {}, recipe.name)),
        e('div', { className: 'small' }, e('img', { src: recipe.img }))
    );

    result.addEventListener('click', () =>
        getRecipeDetails(recipe._id, result)
    );
    return result;
}

async function getRecipeDetails(id, preview) {
    const url = `http://localhost:3030/jsonstore/cookbook/details/${id}`; 
    // the way the id is implemented could result in a HTML injection but this will never be done in production
    // without validation function even though in this particular case the id doesn't come from the outside.
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok == false) {
        throw new Error(response.statusText);
        // Behavior of statusText of an error in Chrome is different than in Mozilla!
        // Tested in Mozilla.
    }

    const result = e('article', {},
        e('h2', { className: 'cardH2', onClick: toggleCard }),
        e('div', { className: 'band' },
            e('div', { className: 'thumb' }, e('img', { src: data.img })),
            e('div', { className: 'ingredients' },
                e('h3', {}, 'ingredients'),
                e('ul', {}, data.ingredients.map((i) => e('li', {}, i)))
            )
        ),
        e('div', { className: 'description' },
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
    const element = document.createElement(type);

    for (const [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            element.addEventListener(attr.substring(2).toLowerCase(), value);
        } else {
            element[attr] = value;
        }
    }

    content
        .reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), [])
        .forEach((e) => {
            if (typeof e == 'string' || typeof e == 'number') {
                const node = document.createTextNode(e);
                element.append(node);
            } else {
                element.append(e);
            }
        });

    return element;
}
