// capture references to important DOM elements
var weatherContainer = document.getElementById('weather');
var formEl = document.querySelector('form');
var inputEl = document.querySelector('input');


formEl.onsubmit = function(e) { //CONVERT TO ARROW FUNCTION
  // prevent the page from refreshing
  e.preventDefault();

  // capture user's input from form field
  var userInput = inputEl.value.trim()
  // abort API call if user entered no value
  if (!userInput) return
  // call the API and then update the page
  

 getWeather(userInput)
    .then(displayWeatherInfo)
    .catch(displayLocNotFound)


  // reset form field to a blank state
  inputEl.value = ""
}

// calls the OpenWeather API and returns an object of weather info
getWeather = (query) => {
  // default search to USA
  if (!query.includes(",")) query += ',us'
  // return the fetch call which returns a promise
  // allows us to call .then on this function
  return fetch(
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    query +
    '&units=imperial&appid=6efff70fe1477748e31c17d1c504635f'
  )
    .then(function(res) { //CONVERT TO ASYNC/AWAIT
      return res.json()
    })
    
    .then(function(data) { //CONVERT TO ASYNC/AWAIT
      // location not found, throw error/reject promise
      if (data.cod === "404") throw new Error('location not found')
      // create weather icon URL
      var iconUrl = 'https://openweathermap.org/img/wn/' +
        data.weather[0].icon +
        '@2x.png'
      var description = data.weather[0].description
      var actualTemp = data.main.temp
      var feelsLikeTemp = data.main.feels_like
      var place = data.name + ", " + data.sys.country
      // create JS date object from Unix timestamp
      var updatedAt = new Date(data.dt * 1000)
      // this object is used by displayWeatherInfo to update the HTML
      return {
        coords: data.coord.lat + ',' + data.coord.lon,
        description: description,
        iconUrl: iconUrl,
        actualTemp: actualTemp,
        feelsLikeTemp: feelsLikeTemp,
        place: place,
        updatedAt: updatedAt
      }
    })
}


// show error message when location isn't found
const displayLocNotFound = () => {
  // clears any previous weather info
  weatherContainer.innerHTML = "";
  // create h2, add error msg, and add to page
  var errMsg = document.createElement('h2')
  errMsg.textContent = "Location not found"
  weatherContainer.appendChild(errMsg)
}

// updates HTML to display weather info
const displayWeatherInfo = (weatherObj) => {
  weatherContainer.innerHTML = ``;

  const { 
    coords: coords1, 
    description: description1, 
    iconUrl: iconUrl1, 
    actualTemp: actualTemp1, 
    feelsLikeTemp: feelsLikeTemp1, 
    place: place1, 
    updatedAt: updatedAt1
  } = weatherObj

  // inserts a linebreak <br> to weather section tag
  addBreak = () => {
    weatherContainer.appendChild(
      document.createElement('br')
    )
  }

  // weather location element
  var placeName = document.createElement('h2')
  placeName.textContent = weatherObj.place
  weatherContainer.appendChild(placeName)

  // map link element based on lat/long
  var whereLink = document.createElement('a')
  whereLink.textContent = "Click to view map"
  whereLink.href = "https://www.google.com/maps/search/?api=1&query=" + weatherObj.coords
  whereLink.target = "__BLANK"
  weatherContainer.appendChild(whereLink)

  // weather icon img
  var icon = document.createElement('img')
  icon.src = weatherObj.iconUrl
  weatherContainer.appendChild(icon)

  // weather description
  var description = document.createElement('p')
  description.textContent = weatherObj.description
  description.style.textTransform = 'capitalize'
  weatherContainer.appendChild(description)

  addBreak()

  // current temperature
  var temp = document.createElement('p')

  //Text literal used
  temp.textContent = `Current: ${weatherObj.actualTemp} ° F`
  weatherContainer.appendChild(temp)

  // "feels like" temperature
  var feelsLikeTemp = document.createElement('p')

  //Text literal used
  feelsLikeTemp.textContent = `Feels like: ${weatherObj.feelsLikeTemp} ° F`
  weatherContainer.appendChild(feelsLikeTemp)

  addBreak()

  // time weather was last updated
  var updatedAt = document.createElement('p')

  //Text literal used
  updatedAt.textContent = `Last updated: 
  ${weatherObj.updatedAt.toLocaleTimeString(
        'en-US', { hour: 'numeric', minute: '2-digit'}
  )}`

  weatherContainer.appendChild(updatedAt)

}