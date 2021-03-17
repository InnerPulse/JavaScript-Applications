import { createRecipe } from '../api/data.js';

export function setupCreate(section, navigation) {
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

	return showCreate;

	function showCreate() {
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

		try {
			const result = await createRecipe(body);
			document.getElementById('createForm').reset();
			navigation.goTo('details', result._id);
		} catch (error) {
			alert(error.message);
		}
	}
}
