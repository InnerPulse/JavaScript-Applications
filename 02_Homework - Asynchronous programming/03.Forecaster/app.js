(function attachEvents() {
    const input = document.getElementById('location');
    const currentForecast = document.getElementById('current');
    const upcomingForecast = document.getElementById('upcoming');
    const displayError = document.querySelector('#current > div');
    document.getElementById('submit').addEventListener('click', forecast);

    async function forecast() {
        currentForecast.querySelector('.forecast')?.remove();
        upcomingForecast.querySelector('.forecast-info')?.remove();
        displayError.textContent = 'Current conditions';
        document.getElementById('forecast').style.display = 'block';

        try {
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

            const cityCode = cityCodes[input.value];
            const todayURL = `http://localhost:3030/jsonstore/forecaster/today/${cityCode}`;
            const upcomingURL = `http://localhost:3030/jsonstore/forecaster/upcoming/${cityCode}`;

            const [todayResponse, upcomingResponse] = await Promise.all([
                fetch(todayURL),
                fetch(upcomingURL),
            ]);

            const todayData = await todayResponse.json();
            const upcomingData = await upcomingResponse.json();

            // for todays weather
            const currentWrapper = e('div', null, 'forecast');
            const conditionSymbol = e('span', null, 'condition symbol');
            conditionSymbol.innerHTML = symbols[todayData.forecast.condition];
            const condition = e('span', null, 'condition');
            const cityName = e('span', todayData.name, 'forecast-data');
            const temperature = e('span', null, 'forecast-data');
            temperature.innerHTML = `${todayData.forecast.low}${symbols.Degree}/${todayData.forecast.high}${symbols.Degree}`;
            const weather = e(
                'span',
                todayData.forecast.condition,
                'forecast-data'
            );

            append(condition, cityName, temperature, weather);
            append(currentWrapper, conditionSymbol, condition);
            append(currentForecast, currentWrapper);

            // for upcoming weather
            const upcomingWrapper = e('div', null, 'forecast-info');
            upcomingData.forecast
                .map((d) => {
                    const day = e('span', null, 'upcoming');
                    const symbol = e('span', null, 'symbol');
                    symbol.innerHTML = symbols[d.condition];
                    const temperature = e('span', null, 'forecast-data');
                    temperature.innerHTML = `${d.low}${symbols.Degree}/${d.high}${symbols.Degree}`;
                    const weather = e('span', d.condition, 'forecast-data');

                    return append(day, symbol, temperature, weather);
                })
                .forEach((d) =>
                    append(upcomingForecast, append(upcomingWrapper, d))
                );
        } catch (error) {
            displayError.textContent = 'Error';
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
})();

