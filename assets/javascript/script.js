//Storing html elements in variables
const searchbarContent = document.querySelector('.searchbar-content');
const searchbarInput = searchbarContent.querySelector('.searchbar-input');
const searchButton = searchbarContent.querySelector('.search-button');
const historyContent = document.querySelector('.history-content');

const cityName = document.querySelector('.city-name');
const weatherPicture = document.querySelector('.weather-picture');
const weatherTemperature = document.querySelector('.weather-temperature');
const weatherHumidity = document.querySelector('.weather-humidity');
const weatherWindSpeed = document.querySelector('.weather-wind-speed');
const weatherUvIndex = document.querySelector('.weather-uv-index');

let searchText;

//Event listener for when the search button is pressed
searchButton.addEventListener('click', function () {

    //The input value submitted gets stored into the searchText variable
    searchText = searchbarInput.value;
    console.log(searchText);

    //Making a promise to get the api data from url depending on what the user input is within the search field
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchbarInput.value + '&units=imperial&appid=32e2f43ba93ca7e7987d0e123e9c252a')

        //Then once we have the response, it gets converted into javascript object notation
        .then(response => response.json())

        //Then with the data from the response I console log the data
        .then(data => {
            console.log(data)

            //Storing the data we recieved into variables by targeting the index value
            let nameValue = data['name'];
            let pictureValue = data['weather'][0]['icon']
            let temperatureValue = 'Temperature: ' + data['main']['temp'] + '°F';
            let humidityValue = 'Humidity: ' + data['main']['humidity'] + '%';
            let windspeedValue = 'Wind Speed: ' + data['wind']['speed'] + ' MPH';

            //Storing the lattitude and longitude into variables so we can get the uv index
            let lattitude = data['coord']['lat'];
            // console.log(lattitude);
            let longitude = data['coord']['lon'];
            // console.log(longitude);

            //Setting the inner html elements with the data I stored into variables
            cityName.innerHTML = '<h2>' + nameValue + ' (' + (moment().format('M') + "/" + moment().format('D') + '/' + moment().format('YYYY')) + ')' + '</h2>';

            weatherPicture.setAttribute("src", "https://openweathermap.org/img/wn/" + pictureValue + "@2x.png");
            // weatherPicture.setAttribute("alt",response.data[weather][0][description]);



            weatherTemperature.innerHTML = temperatureValue;
            weatherHumidity.innerHTML = humidityValue;
            weatherWindSpeed.innerHTML = windspeedValue;

            //Creating a nested fetch to get the uv index using the data we stored in the variables lattitude and longitude
            fetch('http://api.openweathermap.org/data/2.5/uvi?lat=' + lattitude + '&lon=' + longitude + '&appid=32e2f43ba93ca7e7987d0e123e9c252a')
                .then(responseTwo => responseTwo.json())
                .then(dataTwo => {
                    console.log(dataTwo)

                    let uvIndex = document.createElement('span');
                    uvIndex.setAttribute('class', 'badge badge-danger');
                    uvIndex.innerHTML = dataTwo['value'];

                    weatherUvIndex.innerHTML = 'UV Index: ';
                    weatherUvIndex.append(uvIndex);


                    //Need to store search values into local storage
                    //Retrieve search values from local storage
                    //Create a clickable history list under the searchbar
                    //Create the 5 day forecast
                    //Append the weather picture next to the city name and date
                    //WeatherPicture alt text not working, throwing errors
                    //How do I adjust the size of the badge for the uv index
                    //Fix the searchbar sizing for mobile display







                })
        })


        //If the search value is not equal to a valid city name, this error will be alerted
        .catch(err => alert('Wrong city name!'))
});
