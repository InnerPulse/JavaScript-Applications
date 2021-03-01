async function loadCommits() {
    const ul = document.getElementById('commits');
    const repo = document.getElementById('repo').value;
    const username = document.getElementById('username').value;

    const url = `https://api.github.com/repos/${username}/${repo}/commits`;

    ul.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return e(null, response);
        }

        data.forEach(({ commit }) => e(commit));

        function e(commit, err) {
            const liElement = document.createElement('li');

            if (!commit) {
                liElement.textContent = `Error: ${err.status} (${err.statusText})`;
                console.log(err);
                // error.statusText supported only in Mozilla, in Chrome we get empty string!
            } else {
                liElement.textContent = `${commit.author.name}: ${commit.message}`;
            }
            return ul.append(liElement);
        }
    } catch (error) {
        return alert(error);
    }
}
