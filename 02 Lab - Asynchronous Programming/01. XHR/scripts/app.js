// Disclaimer:
// I'm very aware that nowadays we don't use the following approach on the majority of the websites,
// here is done for educational purposes only!
// For future tasks I will use async/await and not so often then/catch.

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
