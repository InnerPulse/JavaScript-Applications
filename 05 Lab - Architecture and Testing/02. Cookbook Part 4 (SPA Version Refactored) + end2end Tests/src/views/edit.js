import { getRecipeById, editRecipeById } from '../api/data.js';

export function setupEdit(section, navigation) {
	let recipeId;
	const form = section.querySelector('form');

	form.addEventListener('submit', (ev) => {
		ev.preventDefault();
		const formData = new FormData(ev.target);
		const data = [...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {});

		if ([data.name, data.img, data.ingredients.length, data.steps.length].map(Boolean).includes(false)) {
			return alert('All fields are required!');
		}

		onSubmit(data);
	});

	return showEdit;

	async function showEdit(id) {
		recipeId = id;
		const recipe = await getRecipeById(recipeId);

		section.querySelector('[name="img"]').value = recipe.img;
		section.querySelector('[name="name"]').value = recipe.name;
		section.querySelector('[name="steps"]').value = recipe.steps.join('\n');
		section.querySelector('[name="ingredients"]').value = recipe.ingredients.join('\n');

		return section;
	}

	async function onSubmit(data) {
		const body = {
			name: data.name,
			img: data.img,
			ingredients: data.ingredients
				.split('\n')
				.map((l) => l.trim())
				.filter((l) => l != ''),
			steps: data.steps
				.split('\n')
				.map((l) => l.trim())
				.filter((l) => l != ''),
		};

		await editRecipeById(recipeId, body);
		document.getElementById('editForm').reset();
		navigation.goTo('details', recipeId);
	}
}
