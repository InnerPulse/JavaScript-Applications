(function attachEvents2() {
    document.getElementById('submit').addEventListener('click', getWeather);
})();

async function getWeather() {
    const cityCodes = {
        'New York': 'ny',
        London: 'london',
        Barcelona: 'barcelona',
    };

    const symbols = {
        Sunny: '&#x2600',
        'Partly sunny': '&#x26C5',
        Overcast: '&#x2601',
        Rain: '&#x2614',
        Degree: '&#176',
    };

    document.getElementById('forecast').style.display = 'block';
    const cityName = document.getElementById('location').value;
    const currentForecast = document.getElementById('current');
    currentForecast.querySelector('.forecast')?.remove();
    const upcomingForecast = document.getElementById('upcoming');
    upcomingForecast.querySelector('.forecast-info')?.remove();
    const currentConditionBanner = document.querySelector('#current > div');
    currentConditionBanner.textContent = 'Current conditions';

    if (Object.keys(cityCodes).includes(cityName)) {
        const code = await getCode(cityName);
        const [current, upcoming] = await Promise.all([getCurrent(code), getUpcoming(code)]);

        displayCurrent(current, symbols);
        displayUpcoming(upcoming, symbols);
    } else {
        return (currentConditionBanner.textContent = 'Error - Wrong city name!');
    }

    function displayCurrent(data, symbols) {
        const currentWrapper = e('div', null, 'forecast');
        const conditionSymbol = e('span', null, 'condition symbol');
        conditionSymbol.innerHTML = symbols[data.forecast.condition];
        const condition = e('span', null, 'condition');
        const cityName = e('span', data.name, 'forecast-data');
        const temperature = e('span', null, 'forecast-data');
        temperature.innerHTML = `${data.forecast.low}${symbols.Degree}/${data.forecast.high}${symbols.Degree}`;
        const weather = e('span', data.forecast.condition, 'forecast-data');

        append(
            currentForecast,
            append(currentWrapper, conditionSymbol, append(condition, cityName, temperature, weather))
        );
    }

    function displayUpcoming(data, symbols) {
        const upcomingWrapper = e('div', null, 'forecast-info');
        data.forecast
            .map((d) => {
                const day = e('span', null, 'upcoming');
                const symbol = e('span', null, 'symbol');
                symbol.innerHTML = symbols[d.condition];
                const temperature = e('span', null, 'forecast-data');
                temperature.innerHTML = `${d.low}${symbols.Degree}/${d.high}${symbols.Degree}`;
                const weather = e('span', d.condition, 'forecast-data');

                return append(day, symbol, temperature, weather);
            })
            .forEach((d) => append(upcomingForecast, append(upcomingWrapper, d)));
    }
}

async function getCode(cityName) {
    try {
        const url = 'http://localhost:3030/jsonstore/forecaster/locations';

        const response = await fetch(url);
        const data = await response.json();

        return data.find((x) => x.name.toLowerCase() == cityName.toLowerCase()).code;
    } catch (error) {
        alert(error);
    }
}

async function getCurrent(code) {
    try {
        const url = 'http://localhost:3030/jsonstore/forecaster/today/' + code;

        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        alert(error);
    }
}

async function getUpcoming(code) {
    try {
        const url = 'http://localhost:3030/jsonstore/forecaster/upcoming/' + code;

        const response = await fetch(url);
        const data = await response.json();

        return data;
    } catch (error) {
        alert(error);
    }
}

function e(type, txtContent, className) {
    const element = document.createElement(type);
    if (txtContent) {
        element.textContent = txtContent;
    }
    if (className) {
        element.className = className;
    }
    return element;
}

function append(main, ...rest) {
    while (rest.length) {
        main.append(rest.shift());
    }
    return main;
}
