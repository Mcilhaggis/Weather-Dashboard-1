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




//Global variable to store the search input
let searchText;

// let storageArray = [];
// let storage = localStorage.getItem('City') || [];
// let cityParse = JSON.parse(storage);
// console.log(storage);

//Event listener for when the search button is pressed
searchButton.addEventListener('click', function () {

    //The input value submitted gets stored into the searchText variable
    searchText = searchbarInput.value;
    // console.log(searchText);


    // storage.push(searchText)
    // console.log(storageArray)
    // localStorage.setItem('City', JSON.stringify(storage));
    // console.log(typeof storage);
    // storageArray = [];


    //Making a promise to get the api data from url depending on what the user input is within the search field
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchbarInput.value + '&units=imperial&appid=32e2f43ba93ca7e7987d0e123e9c252a')

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
            cityName.innerHTML = nameValue + ' (' + (moment().format('M') + "/" + moment().format('D') + '/' + moment().format('YYYY')) + ')';
            //Appending the weather icon on to the end of the city name
            cityName.append(weatherPicture);

            weatherTemperature.innerHTML = temperatureValue;
            weatherHumidity.innerHTML = humidityValue;
            weatherWindSpeed.innerHTML = windspeedValue;

            //Creating a nested fetch to get the uv index using the data we stored in the variables lattitude and longitude
            fetch('http://api.openweathermap.org/data/2.5/uvi?lat=' + lattitude + '&lon=' + longitude + '&appid=32e2f43ba93ca7e7987d0e123e9c252a')
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
                    fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + searchbarInput.value + '&units=imperial&appid=32e2f43ba93ca7e7987d0e123e9c252a')
                        .then(responseThree => responseThree.json())
                        .then(dataThree => {
                            console.log(dataThree)

                            let fiveDayForecast = document.querySelector('.forecast');

                            let holdContent = dataThree['list'];
                            // console.log(holdContent);

                            

                            for (let i = 0; i < holdContent.length; i += 8) {
                                console.log(holdContent[i])

                                let forecastDate = new Date(holdContent[i]['dt'] * 1000);
                                // console.log(forecastDate)

                                let forecastDay = forecastDate.getDate() + 1;
                                // console.log(forecastDay)

                                let forecastMonth = forecastDate.getMonth() + 1;
                                // console.log(forecastMonth)                        

                                let forecastYear = forecastDate.getFullYear();
                                // console.log(forecastYear)



                                // let forecastDateEl = document.createElement("p");
                                // forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                                // forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                                // fiveDayForecast.append(forecastDateEl);

                                let forecastPicture = holdContent[i]['weather'][0]['icon'];
                                // console.log(forecastPicture);

                                let forecastTemp = holdContent[i]['main']['temp'];
                                // console.log(forecastTemp);

                                let forecastHumidity = holdContent[i]['main']['humidity'];
                                // console.log(forecastHumidity);

                                let htmlForecastTemp = document.createElement('p');
                                htmlForecastTemp.innerHTML = 'Temp: ' + forecastTemp + '°F';
                                holdContent[i].appendChild(htmlForecastTemp);


                                // fiveDayForecast.innerhtml = forecastTemp;


                            }
                        })
                })
        })
        //If the search value is not equal to a valid city name, this error will be alerted
        .catch(err => alert('Wrong city name!'))
});

                    //Need to store search values into local storage
                    //Retrieve search values from local storage
                    //Create a clickable history list under the searchbar
                    //How do I adjust the size of the badge for the uv index
                    //Fix the searchbar sizing for mobile display
                    //Implement time zones to display correct date
                    //5 day forecast coming off page
