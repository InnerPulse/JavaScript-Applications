import { register } from '../api/data.js';

export function setupRegister(section, navigation) {
	const form = section.querySelector('form');

	form.addEventListener('submit', (ev) => {
		ev.preventDefault();
		const formData = new FormData(ev.target);
		onSubmit([...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {}));
	});

	return showRegister;

	function showRegister() {
		return section;
	}

	async function onSubmit(data) {
		if (data.password != data.rePass) {
			return alert("Passwords don't match!");
		}

		if (data.email === '' || data.password === '') {
			return alert('All fields are required!');
		}

		await register(data.email, data.password);
		document.getElementById('registerForm').reset();

		document.getElementById('guest').style.display = 'none';
		document.getElementById('user').style.display = 'inline-block';

		navigation.goTo('catalog');
	}
}
