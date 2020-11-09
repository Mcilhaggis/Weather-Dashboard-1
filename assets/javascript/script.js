//Storing html elements in variables
let searchbarContent = document.querySelector('.searchbar-content');
let searchbarInput = searchbarContent.querySelector('.searchbar-input');
let searchButton = searchbarContent.querySelector('.search-button');
let historyContent = document.querySelector('.history-content');
let cityName = document.querySelector('.city-name');
let weatherTemperature = document.querySelector('.weather-temperature');
let weatherHumidity = document.querySelector('.weather-humidity');
let weatherWindSpeed = document.querySelector('.weather-wind-speed');
let weatherUvIndex = document.querySelector('.weather-uv-index');
let fiveDayForecast = document.querySelector('.forecast');
//Global variable to store the search input and api key
let searchText;
let apiKey = '32e2f43ba93ca7e7987d0e123e9c252a';
let searchHistory = [];
let getWeather = () => {
    //Making a promise to get the api data from url depending on what the user input is within the search field
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchbarInput.value + '&units=imperial&appid=' + apiKey)
        //Then once we have the response, it gets converted into javascript object notation
        .then(response => response.json())
        //Then with the data from the response I console log the data
        .then(data => {
            console.log(data)
            //Storing the data we recieved into variables by targeting the index value
            let pictureValue = data['weather'][0]['icon']
            let nameValue = data['name'];
            let temperatureValue = 'Temperature: ' + data['main']['temp'] + '°F';
            let humidityValue = 'Humidity: ' + data['main']['humidity'] + '%';
            let windspeedValue = 'Wind Speed: ' + data['wind']['speed'] + ' MPH';
            //Storing the lattitude and longitude into variables so we can get the uv index
            let lattitude = data['coord']['lat'];
            // console.log(lattitude);
            let longitude = data['coord']['lon'];
            // console.log(longitude);
            //Creaing a new image html element that I will append on to the city name
            let weatherPicture = document.createElement('img');
            weatherPicture.setAttribute("src", "https://openweathermap.org/img/wn/" + pictureValue + "@2x.png");
            weatherPicture.setAttribute("alt", data['weather'][0]['description']);
            //Setting the inner html elements with the data I stored into variables
            cityName.innerHTML = nameValue + ' (' + (moment().format('M/D/YYYY')) + ')';
            //Appending the weather icon on to the end of the city name
            cityName.append(weatherPicture);
            weatherTemperature.innerHTML = temperatureValue;
            weatherHumidity.innerHTML = humidityValue;
            weatherWindSpeed.innerHTML = windspeedValue;
            //Creating a nested fetch to get the uv index using the data we stored in the variables lattitude and longitude
            fetch('http://api.openweathermap.org/data/2.5/uvi?lat=' + lattitude + '&lon=' + longitude + '&appid=' + apiKey)
                .then(responseTwo => responseTwo.json())
                .then(dataTwo => {
                    console.log(dataTwo)
                    //Creating a span tag that will append onto the uv index html element
                    let uvIndex = document.createElement('span');
                    uvIndex.setAttribute('class', 'badge badge-danger');
                    uvIndex.innerHTML = dataTwo['value'];
                    weatherUvIndex.innerHTML = 'UV Index: ';
                    weatherUvIndex.append(uvIndex);
                    //Creating a fetch for the 5 day forecast
                    fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + searchbarInput.value + '&units=imperial&appid=' + apiKey)
                        .then(responseThree => responseThree.json())
                        .then(dataThree => {
                            console.log(dataThree)
                            //Creating a variable to hold the list contents
                            let holdContent = dataThree['list'];
                            // console.log(holdContent);
                            //Created a for loop that iterates by 8 through an array with the length of 40
                            for (let i = 0; i < holdContent.length; i += 8) {
                                // console.log(holdContent[i])
                                let forecastDate = new Date(holdContent[i]['dt'] * 1000);
                                // console.log(forecastDate)
                                let forecastDay = forecastDate.getDate() + 1;
                                // console.log(forecastDay)
                                let forecastMonth = forecastDate.getMonth() + 1;
                                // console.log(forecastMonth)                        
                                let forecastYear = forecastDate.getFullYear();
                                // console.log(forecastYear)
                                //Create a div tag that appends to the html element with the class name of forecast
                                let divElement = document.createElement('div');
                                divElement.setAttribute('class', 'col bg-primary text-white ml-3 mb-3 rounded');
                                fiveDayForecast.append(divElement);
                                let htmlForecastDate = document.createElement("p");
                                htmlForecastDate.setAttribute("class", "mt-3 mb-0 forecast-date");
                                htmlForecastDate.innerHTML = '<b>' + forecastMonth + "/" + forecastDay + "/" + forecastYear + '</b>';
                                divElement.append(htmlForecastDate);
                                let forecastPicture = holdContent[i]['weather'][0]['icon'];
                                // console.log(forecastPicture);
                                const htmlForecastWeather = document.createElement("img");
                                htmlForecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastPicture + ".png");
                                htmlForecastWeather.setAttribute("alt", forecastPicture);
                                divElement.append(htmlForecastWeather);
                                let forecastTemp = holdContent[i]['main']['temp'];
                                // console.log(forecastTemp);
                                const htmlForecastTemp = document.createElement('p');
                                htmlForecastTemp.innerHTML = 'Temp: ' + forecastTemp + '°F';
                                divElement.append(htmlForecastTemp);
                                let forecastHumidity = holdContent[i]['main']['humidity'];
                                // console.log(forecastHumidity);
                                const htmlForecastHumidity = document.createElement("p");
                                htmlForecastHumidity.innerHTML = "Humidity: " + forecastHumidity + '%';
                                divElement.append(htmlForecastHumidity);
                            }
                        })
                })
        })
        //If the search value is not equal to a valid city name, this error will be alerted
        .catch(err => alert('Wrong city name!'))
}

//Event listener for when the search button is pressed
searchButton.addEventListener('click', function () {

    //Clear the 5-Day forecast element each time the search button is clicked
    $('.forecast').empty();

    //The input value submitted gets stored into the searchText variable
    searchText = searchbarInput.value;
    // console.log(searchText);

    SearchHistory = JSON.parse(localStorage.getItem('City') || []);

    searchHistory.push(searchText);

    localStorage.setItem('City', JSON.stringify(searchText));

   
    // console.log(searchHistory);

    getWeather();
    renderSearchHistory();
});

//Created a function that will render the search history under the searchbar
let renderSearchHistory = () => {

    //This for loop will create the HTML elements each time the search button is clicked
    for (let i = 0; i < searchHistory.length; i++) {


        historyItem = document.createElement('input');
        historyItem.setAttribute('type', 'text');
        historyItem.setAttribute('readonly', true);
        historyItem.setAttribute('class', 'history-form form-control d-block bg-white');
        historyItem.setAttribute('value', searchHistory[i]);

        

        historyContent.append(historyItem);
        searchHistory = [];

        historyItem.addEventListener('click', function () {

            //Clear the 5-Day forecast element each time the search button is clicked
            $('.forecast').empty();

            getWeather();

        });



    }
}