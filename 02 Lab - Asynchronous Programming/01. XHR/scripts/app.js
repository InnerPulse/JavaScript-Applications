// Disclaimer:
// I'm very aware that nowadays the majority of the time we don't use the following approach.
// This is done for educational purposes only!
// For future tasks I will use async/await and not so often then/catch techniques.

function loadRepos() {
    const url = 'https://api.github.com/users/testnakov/repos';
    const httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener('readystatechange', () => {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            document.getElementById('res').textContent =
                httpRequest.responseText;
        }
    });
    httpRequest.open('GET', url);
    httpRequest.send();
}
