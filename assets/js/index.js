var submitbtnEl = document.querySelector("#city-search-btn")
var apiKey = "bd5a58178316cda8b0caab30e7d7b1d2"
var cityInput = document.querySelector("#citysearch");
var searchHistory = [];
var forecastEl = document.querySelector("#forecast-container")
var cityHistory = document.querySelector("#city-history");
var currentCityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#current-date");
var currentTempEl = document.querySelector("#current-temp");
var currentWindEl = document.querySelector("#current-wind");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentUvEl = document.querySelector("#current-uv");

var searchBtnHandler = function (event) {
  // will listen for the click of the search button and execute ... many things 
  event.preventDefault();
  var city = cityInput.value.trim();
  if (city) {
    saveCity(city);
    createCityButton(city);
    getCityCoords(city);
  } else {
    alert("Please enter a City Name");
  };
};

var getCityCoords = function (cityName) {
  //will call api for city information passed by search 
  var geoIdUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  fetch(geoIdUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getCityInfo(data.coord, cityName);
    })
}

var getCityInfo = function (coords, cityName) {

  var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentWeatherGenerator(data.current, cityName);
      forecastGenerator(data.daily.slice(1,6));
    })
}

var saveCity = function (city) {
  //saves selected city to local storage 
  var local = localStorage.getItem("cities")
  if (local) {
    searchHistory = JSON.parse(local)
  }
  searchHistory.push(city)
  localStorage.setItem("cities", JSON.stringify(searchHistory))
}

var cityOptionsCreator = function () {
  //this will create the clickable city options below search bar from local storage
  var local = localStorage.getItem("cities")
  //console.log(local);
  if (local) {
    searchHistory = JSON.parse(local)
  }
  searchHistory.forEach(city => {
    createCityButton(city);
  });
}

var createCityButton = function (cityName) {
  //this will create clikcable city on submit 
  var cityBtnEl = document.createElement("button")
  cityBtnEl.textContent = cityName
  cityBtnEl.addEventListener("click", function () {
    getCityCoords(cityName)
  })
  cityHistory.appendChild(cityBtnEl);
}

var currentWeatherGenerator = function (currentWeather, cityName) {
  currentCityNameEl.textContent = cityName;
  var currentDate = new Date(currentWeather.dt * 1000)
  currentDateEl.textContent = currentDate;
  currentTempEl.textContent = "Temp: " + Math.floor(currentWeather.temp - 273.15) + "°C"
  currentWindEl.textContent = "Wind: " + Math.floor(currentWeather.wind_speed * 3.6) + " KPH"
  currentHumidityEl.textContent = "Humidity: " + currentWeather.humidity + "%";
  currentUvEl.textContent = "UV: " + currentWeather.uvi;
}

var forecastGenerator = function (forecast) {
  console.log(forecast);
  forecastEl.innerHTML = "";
  forecast.forEach(day => {
    var cardEl = document.createElement("div")
    cardEl.classList = "card col bg-dark"

    var dateEl = document.createElement("h5");
    dateEl.className = "card-title";
    dateEl.textContent = new Date(day.dt * 1000);

    var cardIconEl = document.createElement("img")
    cardIconEl.src = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`

    var infoList = document.createElement("ul")
    infoList.classList = "list-group list-group-flush";

    var tempItem = document.createElement("li");
    tempItem.textContent = "Temp: " + Math.floor(day.temp.day - 273.15) + "°C";
    var windItem = document.createElement("li");
    windItem.textContent = "Wind: " + Math.floor(day.wind_speed * 3.6) + " KPH";
    var humidityItem = document.createElement("li");
    humidityItem.textContent = "Humidity: " + day.humidity + "%";

    infoList.appendChild(tempItem);
    infoList.appendChild(windItem);
    infoList.appendChild(humidityItem);

    cardEl.appendChild(dateEl);
    cardEl.appendChild(cardIconEl);
    cardEl.appendChild(infoList);

    forecastEl.appendChild(cardEl);

  })
}

cityOptionsCreator();
submitbtnEl.addEventListener("click", searchBtnHandler)
