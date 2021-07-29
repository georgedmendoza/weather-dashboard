//get element from index.html
var buttonEl = document.getElementById('search');
//var cityNameEl = document.getElementById('city').value;
var appid = 'c37f222d1be87273f5169d1997df3ab3';
var cityNameEl = document.getElementById('city');
var temperature = document.getElementById('temp');
var wind = document.getElementById('wind');
var humidity = document.getElementById('humidity');
var currentDay = moment().format('d/MM/YYYY');
var iconEl = document.getElementById('icon');
var uvEl = document.getElementById('uv');
var card1 = document.getElementById('1');


var getSingleForecast = function(){
    ///fetch call to get everything but UV value
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
                var logo = data.weather[0].icon;
                iconEl.setAttribute("src","https://openweathermap.org/img/wn/" + logo + "@2x.png");
                iconEl.setAttribute("alt", data.weather[0].description)

                cityNameEl.textContent = data.name + ' ' + currentDay;
                // console.log(data);
                temperature.textContent = 'Temperature: ' + data.main.temp; // add F for temp
                wind.textContent = 'Wind: ' + data.wind.speed + ' MPH'
                humidity.textContent = 'Humidity: ' + data.main.humidity + '%'
                console.log(data.weather[0].icon);
                
                //fetch call for UV value
                var uvApi = 'https://api.openweathermap.org/data/2.5/uvi/forecast?lat='+
                data.coord.lat + '&lon=' + data.coord.lon + '&appid=' + appid +
                '&cnt=1';
                fetch(uvApi)
                .then(function(response){
                    if(response.ok){
                        response.json().then(function(data){
                            uvEl.innerHTML ='UV-Index: ' + data[0].value;
                        })
                    }
                })
            });
            
        }else{
            alert('Somethings wrong with the request')
        } 
    })
    .catch(function(error){
        alert('Unable to process request')
    });  
};

//function to request 5-day forecast
var fiveDayForecast = function(){
    var searchCity = document.getElementById('input').value;
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + 
    searchCity +
    '&units=imperial' +
    '&appid=' + appid

    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //create array list with each desired day in it
                console.log(data);
                var fiveCast = [data.list[1], data.list[9],data.list[17], data.list[25],data.list[33]];
                console.log(fiveCast[0]);
                console.log(fiveCast[0].weather[0].icon);
                console.log(fiveCast[0].wind.speed);
                var day1El = document.getElementById('day1');
                //day1El.setAttribute("src","https://openweathermap.org/img/wn/" + fiveCast[0].weather[0].icon + "@2x.png");
                //day1El.setAttribute("alt", fiveCast[0].weather[0].description)

                for(var i=0; i<fiveCast.length; i++){
                    var logo = fiveCast[i].weather[0].icon;
                    var pic = document.createElement('img');
                    //pic.setAttribute("src","https://openweathermap.org/img/wn/" + logo + "@2x.png");
                    //pic.setAttribute("alt", fiveCast[i].weather[0].description)
                    //call each div class
                    document.getElementById(i).innerHTML = 
                    moment().add(i+1,'days').calendar(null, {
                        sameDay: 'M/DD/YYYY',
                        nextDay: 'M/DD/YYYY',
                        nextWeek: 'M/DD/YYYY',
                        lastDay: 'M/DD/YYYY',
                        lastWeek: 'M/DD/YYYY',
                        sameElse: 'M/DD/YYYY'
                    }) +'<p></p>'+ logo +'<p></p>'+
                    'temp: '+ fiveCast[i].main.temp +'<p></p>'+ 
                    ' Wind: '+ fiveCast[i].wind.speed +'<p></p>'+
                    'Humidity: '+ fiveCast[i].main.humidity;
              
                }
               
              
            })
        }
    })
}

var historySearch = [];

var loadHistory = function(){

    historySearch = localStorage.getItem('city');
    console.log(historySearch)
}

var saveSearch = function() {
    
    var searchInput = document.getElementById('input').value;
    historySearch.push(searchInput);
    console.log(searchInput);
    localStorage.setItem('city',JSON.stringify(historySearch));
}


buttonEl.addEventListener('click',() => {
    fiveDayForecast();
    getSingleForecast();
    loadHistory();
    saveSearch();
   
});
