let cities = [];
let apiKey = '745cbb713a047695c07ef19d3aefc656'

let cityFormEl = document.querySelector("#city-search");
let cityInputEl = document.querySelector("#city");
let weatherContainerEl = document.querySelector("#current-weather");
let cityNameEl = document.querySelector("#cityName");
let forecastTitle = document.querySelector("#forecast");
let forecastContainerEl = document.querySelector("#five-day")
let pastSearchButtonEl = document.querySelector("#past-search")

let formSubmitHandler = function(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
    saveSearch();
    pastSearch();
}

let saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

let getCityWeather = function(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    let apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    console.log(apiURL)

   fetch(apiURL)
    .then(function(response) {
       response.json().then(function(data) {
        console.log("Current Weather", data);
           // displaying Current Weather
           cityNameEl.textContent = data.name;
           document.getElementById("temperature").textContent = "Temperature: " + data.main.temp + "ºF"
           document.getElementById("humidity").textContent = "Humidity: " + data.main.humidity + "%"
           document.getElementById("windSpeed").textContent = "Wind Speed: " + data.wind.speed + " MPH"
           let lat = data.coord.lat
           let lon = data.coord.lon
           getForecastWeather(lat, lon)
        }); 
    });
};

let getForecastWeather = function(lat, lon) {
    let forecastURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`

    fetch(forecastURL)
    .then(function(response){
        response.json().then(function(data) {
            console.log("Forecast Weather", data);
        })
    })
}

document.getElementById("search-btn").addEventListener('click', getCityWeather)