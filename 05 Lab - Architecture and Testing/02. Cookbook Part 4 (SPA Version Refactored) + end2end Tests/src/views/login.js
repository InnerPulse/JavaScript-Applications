import { login } from '../api/data.js';

export function setupLogin(section, navigation) {
	const form = section.querySelector('form');

	form.addEventListener('submit', (ev) => {
		ev.preventDefault();
		const formData = new FormData(ev.target);
		const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});

		if ([data.email, data.password].map(Boolean).includes(false)) {
			return alert('All fields are required!');
		}

		onSubmit(data);
	});

	return showLogin;

	function showLogin() {
		return section;
	}

	async function onSubmit(data) {
		if (data.email === '' || data.password === '') {
			return alert('All fields are required!');
		}

		await login(data.email, data.password);
		document.getElementById('loginForm').reset();

		document.getElementById('guest').style.display = 'none';
		document.getElementById('user').style.display = 'inline-block';

		navigation.goTo('catalog');
	}
}
