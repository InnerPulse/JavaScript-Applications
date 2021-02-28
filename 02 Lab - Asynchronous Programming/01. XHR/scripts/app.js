// Disclaimer:
// The task is to make XHR (XmlHttpRequest) for educational purposes only!
// I'm very aware that nowadays we don't use XHR on the majority of websites.
// For future tasks I will use async/await and not so often then/catch.

function loadRepos() {
  const url = 'https://api.github.com/users/testnakov/repos';
  const httpRequest = new XMLHttpRequest();
  httpRequest.addEventListener('readystatechange', () => {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      document.getElementById('res').textContent = httpRequest.responseText;
    }
  });
  httpRequest.open('GET', url);
  httpRequest.send();
}
