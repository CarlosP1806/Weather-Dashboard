const searchBtn = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-input")

searchBtn.addEventListener("click", function () {
    const city = searchInput.value;

    addHistory(city);
    getApiCall(city);
});

// Start the API calls to retrieve forecast by city
function getApiCall(city) {
    const requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
        + city
        + "&limit=5&appid=be73356b0367c0e1c765ccb14bf2a6bb";

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Get latitude and longitude of city
            const lat = data[0].lat;
            const lon = data[0].lon;
            const cty = data[0].name;
            processCoords(lat, lon, cty);
        });
}

// Get weather forecast according to lat and lon
function processCoords(lat, lon, cty) {
    const requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="
        + lat
        + "&lon="
        + lon
        + "&appid=be73356b0367c0e1c765ccb14bf2a6bb";
    
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            createElements(data, cty);
        });
}

// Create html elements according to weather data
function createElements(data, cty) {
    console.log(data);

    // Store values
    const weather = data.current.weather[0].main;
    const temp = parseInt(data.current.temp - 273);
    const wind = data.current.wind_speed;
    const humidity = data.current.humidity;
    const uv = data.current.uvi;
    const date = moment.unix(data.current.dt);

    // Clear previusly created content
    const content = document.querySelector(".content");
    content.innerHTML = "";

    // Create current secton
    const current = document.createElement("section");
    current.classList.add("current-info");

    // Create data elements 
    const cityTitle = document.createElement("h2");

    cityTitle.textContent = cty + " (" +date.format("DD/MM/YYYY") + ")";

    // Image
    const image = document.createElement("img");

    switch(weather) {
        case "Rain":
            image.setAttribute("src", "./Assets/Images/rain.png");
            break;
        
        case "Clear":
            image.setAttribute("src", "./Assets/Images/clear.png");
            break;

        case "Clouds":
            image.setAttribute("src", "./Assets/Images/clouds.png");
            break;

        case "Mist":
            image.setAttribute("src", "./Assets/Images/mist.png");
            break;

        case "Snow":
            image.setAttribute("src", "./Assets/Images/snow.png");
            break;
    }
    
    cityTitle.appendChild(image);

    const cityTemp = document.createElement("p");
    cityTemp.textContent = "Temp: " + temp + " °C";

    const cityWind = document.createElement("p");
    cityWind.textContent = "Wind: " + wind + " meters/sec";

    const cityHumidity = document.createElement("p");
    cityHumidity.textContent = "Humidity: " + humidity + "%";

    const cityUV = document.createElement("p");
    cityUV.textContent = "UV Index: ";

    const uvBox = document.createElement("div");
    uvBox.textContent = uv;
    cityUV.appendChild(uvBox);

    if(uv <= 2) cityUV.classList.add("green");
    else if(uv <= 5) cityUV.classList.add("yellow");
    else cityUV.classList.add("red");

    // Append to section
    current.appendChild(cityTitle);
    current.appendChild(cityTemp);
    current.appendChild(cityWind);
    current.appendChild(cityHumidity);
    current.appendChild(cityUV);

    content.appendChild(current);

    // Create forecast section
    const forecast = document.createElement("section");
    forecast.classList.add("forecast");

    const forecastTitle = document.createElement("h2");
    forecastTitle.textContent = "5-Day Forecast";

    const cardContainer = document.createElement("section");
    cardContainer.classList.add("card-container");

    // Create cards
    for(let i = 1; i <= 5; i++) {
        const card = document.createElement("card");
        card.classList.add("card");

        // Retrieve Data
        const date = moment.unix(data.daily[i].dt);
        const weatherForecast = data.daily[i].weather[0].main;
        //console.log(weatherForecast);
        const tempForecast = parseInt(data.daily[i].temp.day - 273);
        const humidityForecast = data.daily[i].humidity;
        const windForecast = data.daily[i].wind_speed;

        const dateEl = document.createElement("h3");
        dateEl.textContent = date.format("DD/MM/YYYY");

        const imageEl = document.createElement("img");
        
        switch(weatherForecast) {
            case "Rain":
                imageEl.setAttribute("src", "./Assets/Images/rain.png");
                break;
            
            case "Clear":
                imageEl.setAttribute("src", "./Assets/Images/clear.png");
                break;

            case "Clouds":
                imageEl.setAttribute("src", "./Assets/Images/clouds.png");
                break;
            
            case "Mist":
                imageEl.setAttribute("src", "./Assets/Images/mist.png");
                break;

            case "Snow":
                image.setAttribute("src", "./Assets/Images/snow.png");
                break;
        }

        const tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + tempForecast + " °C";
        
        const windEl = document.createElement("p");
        windEl.textContent = "Wind: " + windForecast + " m/s";

        const humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidityForecast + "%";

        // Append Data
        card.appendChild(dateEl);
        card.appendChild(imageEl);
        card.appendChild(tempEl);
        card.appendChild(windEl);
        card.appendChild(humidityEl);

        cardContainer.appendChild(card);
    }

    forecast.appendChild(forecastTitle);
    forecast.appendChild(cardContainer);

    content.appendChild(forecast);
}

// Search history
const historyDiv = document.querySelector(".history");
let cityCounter = localStorage.getItem("counter");

function createHistory() {
    historyDiv.innerHTML = "";
    for(let i = 1; i <= 10; i++) {
        if(localStorage.getItem(i)) {
            const historyButton = document.createElement("button");
            historyButton.textContent = localStorage.getItem(i);
            historyDiv.appendChild(historyButton);
        }
    }
}

function addHistory(city) {
    cityCounter = (cityCounter) % 10 + 1;
    localStorage.setItem("counter", cityCounter);
    localStorage.setItem(cityCounter, city);

    createHistory();
}

historyDiv.addEventListener("click", function(event) {
    const cityClicked = event.target;
    const city = cityClicked.textContent;

    getApiCall(city);
});

// When initializing page, create history according to local storage
createHistory();