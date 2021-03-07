let cities = [];
let apiKey = '745cbb713a047695c07ef19d3aefc656'

let cityInputEl = document.querySelector("#city");
let cityNameEl = document.querySelector("#cityName");
let fiveDayContainerEl = document.querySelector("#five-day")

function getCityWeather(event) {
    event.preventDefault();
    let city = cityInputEl.value.trim();
    let apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    console.log(apiURL);

    fetch(apiURL)
        .then(function (response) {
            return response.json().then(function (data) {
                console.log("Current Weather", data);
                // displaying Current Weather
                const milliseconds = data.dt * 1000;
                const dateObject = new Date(milliseconds);
                const humanDate = dateObject.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });

                document.querySelector(".five-header").classList.remove("hide");
                cityNameEl.textContent = data.name;
                document.getElementById("date").textContent = humanDate;
                document.getElementById("icon").setAttribute("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
                document.getElementById("temperature").textContent = "Temperature: " + data.main.temp + "ºF";
                document.getElementById("humidity").textContent = "Humidity: " + data.main.humidity + "%";
                document.getElementById("windSpeed").textContent = "Wind Speed: " + data.wind.speed + " MPH";
                let lat = data.coord.lat;
                let lon = data.coord.lon;
                getForecastWeather(lat, lon);
            });
        });
}

let getForecastWeather = function (lat, lon) {
    let forecastURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`

    fetch(forecastURL)
        .then(function (response) {
            return response.json().then(function (data) {
                console.log("Forecast Weather", data);
                let uvIndex = $("#uvIndex")
                document.getElementById("uvIndex").textContent = "UV Index: " + data.current.uvi;
                if (data.current.uvi < 2) {
                    uvIndex.addClass("low")
                } else if (data.current.uvi > 2 && data.current.uvi < 8) {
                    uvIndex.addClass("med");
                } else if (data.current.uvi > 8) {
                    uvIndex.addClass("high")
                }
                //Creating 5-day forecast cards
                let fiveForecastEl = $(".five-forecast")
                fiveForecastEl.text("")
                for (let i = 1; i < 6; i++) {
                    //Changing date from UNIX date to Human Date
                    const milliseconds = data.daily[i].dt * 1000
                    const dateObject = new Date(milliseconds)
                    const humanDate = dateObject.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })

                    //Creating the daily cards
                    let newDayCardEl = $("<div>")
                    newDayCardEl.addClass("col-lg-2 col-md-2 col-sm-12 card text-center five-day");
                    newDayCardEl.appendTo(fiveForecastEl)
                    let newCardBodyEl = $("<div>")
                    newCardBodyEl.addClass("card-body");
                    newCardBodyEl.appendTo(newDayCardEl)
                    let cardH3El = $("<h3>")
                    cardH3El.addClass("card-title five-date");
                    cardH3El.text(humanDate)
                    cardH3El.appendTo(newCardBodyEl)
                    let cardIconEl = $("<img>")
                    cardIconEl.addClass("five-img");
                    cardIconEl.attr("src", "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png")
                    cardIconEl.appendTo(newCardBodyEl)
                    let cardTempEl = $("<p>")
                    cardTempEl.addClass("card-text five-temp");
                    cardTempEl.text(data.daily[i].temp.day + "ºF")
                    cardTempEl.appendTo(newCardBodyEl)
                    let cardHumidEl = $("<p>")
                    cardHumidEl.addClass("card-text five-humid");
                    cardHumidEl.text(data.daily[i].humidity + "%")
                    cardHumidEl.appendTo(newCardBodyEl)

                }
            })
        })
}

document.getElementById("search-btn").addEventListener('click', getCityWeather)