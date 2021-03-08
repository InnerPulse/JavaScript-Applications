document.querySelector('form').addEventListener('submit', onRegisterSubmit);

async function onRegisterSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePassword = formData.get('rePass');

    // check inputs 
    if ([email, password].map(Boolean).includes(false)) {
        return alert('All fields are required!');
    } else if (password != rePassword) {
        return alert("Passwords don't match!");
    }

    // if valid inputs - extracting the token and save it in session storage
    const response = await fetch('http://localhost:3030/users/register', {
        method: 'post',
        headers: { 'Content-Type': 'applications/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
    }

    const data = await response.json();
    sessionStorage.setItem('userToken', data.accessToken);

    window.location.pathname = 'index.html';
}
