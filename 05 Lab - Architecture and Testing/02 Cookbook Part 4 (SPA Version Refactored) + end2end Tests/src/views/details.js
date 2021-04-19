import { e } from '../dom.js';
import { getRecipeById, deleteRecipeById } from '../api/data.js';

function createRecipeCard(recipe, goTo, deleteRecipe) {
	const result = e(
		'article',
		{},
		e('h2', {}, recipe.name),
		e(
			'div',
			{ className: 'band' },
			e('div', { className: 'thumb' }, e('img', { src: recipe.img })),
			e(
				'div',
				{ className: 'ingredients' },
				e('h3', {}, 'Ingredients:'),
				e(
					'ul',
					{},
					recipe.ingredients.map((i) => e('li', {}, i))
				)
			)
		),
		e(
			'div',
			{ className: 'description' },
			e('h3', {}, 'Preparation:'),
			recipe.steps.map((s) => e('p', {}, s))
		)
	);

	const userId = sessionStorage.getItem('userId');
	if (userId != null && recipe._ownerId === userId) {
		result.appendChild(
			e(
				'div',
				{ className: 'controls' },
				e('button', { onClick: () => goTo('edit', recipe._id) }, '\u270E Edit'),
				e('button', { onClick: onDelete }, '\u2716 Delete')
			)
		);
	}

	return result;

	function onDelete() {
		const confirmed = confirm(`Are you sure you want to delete ${recipe.name}?`);
		if (confirmed) {
			deleteRecipe(recipe._id);
		}
	}
}

export function setupDetails(section, navigation) {
	return showDetails;

	async function showDetails(id) {
		section.innerHTML = 'Loading&hellip;';

		const recipe = await getRecipeById(id);
		section.innerHTML = '';
		section.appendChild(createRecipeCard(recipe, navigation.goTo, deleteRecipe));

		return section;
	}

	async function deleteRecipe(id) {
		await deleteRecipeById(id);

		section.innerHTML = '';
		section.appendChild(e('article', {}, e('h2', {}, 'Recipe deleted')));
	}
}
