var submitbtnEl = document.querySelector("#city-search-btn")
var apiKey = "bd5a58178316cda8b0caab30e7d7b1d2"
var cityInput = document.querySelector("#citysearch");

var searchBtnHandler = function (event) {
  // will listen for the click of the search button and execute ... many things 
  event.preventDefault();
  var city = cityInput.value.trim();
  if (city){
    getCityCoords(city);
  } else {
    alert("Please enter a City Name");
  }
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

var getCityInfo = function(coords, cityName){
  console.log(coords.lat, coords.lon)

  var weatherUrl =`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
      .then(function(data){
        console.log(data);
        console.log(cityName);
      })
}

var saveCity = function () {
  //saves selected city to local storage 
}

var cityOptionsCreator = function () {
  //this will create the clickable city options below search bar 
}


submitbtnEl.addEventListener("click", searchBtnHandler)
