function loadRepos() {
  const username = document.getElementById('username').value;
  const url = `https://api.github.com/users/${username}/repos`;

  fetch(url)
    .then((response) => {
      if (response.status == 404) {
        throw new Error('User not found')
      }
      return response.json() // I return so I don't get undefined in the consol 
    })
    .then(data => {
		const ulElement = document.getElementById('repos')
		ulElement.innerHTML = ''
		data.forEach(r => {
			const liElement = document.createElement('li')
			const aElement = document.createElement('a')
			aElement.setAttribute('href', r.html_url)
			aElement.textContent = r.full_name

			liElement.append(aElement)
			ulElement.append(liElement)
		})
	})
  .catch(error => {
    alert(error.message)
  })

  // More readable way of doing the same as what I've done on lines 5 to 7 is below:

    const requestPromise = fetch(url);
    requestPromise.then(handleResponse);

    function handleResponse(response) {
       const dataPromise = response.json();
       dataPromise.then(handleData);
    }

    function handleData(data) {
  		// processing data...
    }
}
