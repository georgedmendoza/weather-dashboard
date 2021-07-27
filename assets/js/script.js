//get element from index.html
var buttonEl = document.getElementById('search');
//var cityNameEl = document.getElementById('city').value;
var appid = 'c37f222d1be87273f5169d1997df3ab3';
var cityNameEl = document.getElementById('city');
var temperature = document.getElementById('temp');
var wind = document.getElementById('wind');

var getSingleForecast = function(){
    var searchCity = document.getElementById('input').value;
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + 
    searchCity +
    '&units=imperial' +
    '&appid=' + appid

    fetch(apiUrl)
    .then(function(response) {
        //if request was successful 
        if(response.ok){
            response.json().then(function(data){
                console.log(data.name);
                cityNameEl.textContent = data.name; //add moment data here;
                console.log(data);
                console.log(data.main)
                temperature.textContent = 'Temperature: ' + data.main.temp; // add F for temp
                wind.textContent = 'Wind: ' + data.wind.speed + ' MPH'
                console.log(data.wind.speed);
            });
        }else{
            alert('Somethings wrong with the request')
        } 
    })
    .catch(function(error){
        alert('Unable to process request')
    });  
};

buttonEl.addEventListener('click',getSingleForecast);

