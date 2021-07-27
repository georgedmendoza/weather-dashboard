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
var card1 = document.getElementById('card1');

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
                //assign variables to each day 
                console.log(data);
                var fiveCast = [data.list[1], data.list[9],data.list[17], data.list[25],data.list[33]];
                console.log(fiveCast[0].main.temp);

                card1.innerHTML = 
                '<h6></h6>' + currentDay + '<br></br>' +
                '<p>Temp: </p>' + fiveCast[0].main.temp  ;

                var day1= data.list[1];
                console.log(day1);
                //card1.innerHTML = data.list[1]
              
            })
        }
    })
}



buttonEl.addEventListener('click',() => {
    fiveDayForecast();
    getSingleForecast();
});

// var fiveDayForecast = function(){
//     //call to get id
//     var searchCity = document.getElementById('input').value;
//     var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + 
//     searchCity +
//     '&units=imperial' +
//     '&appid=' + appid
//     fetch(apiUrl)
//     .then(function(response){
//         if(response.ok){
//             response.json().then(function(data){
//                 var id = (data.id);
//                 console.log(id);
//                 //call to get 5-day forecast 
//                 var apiFive = 'https://api.openweathermap.org/data/2.5/forecast?id='+
//                 id + '&appid=' + appid

//                 fetch(apiFive)
//                 .then(function(resp){
//                     if(resp.ok){
//                         resp.json().then(function(dat){
//                             console.log(dat);
//                         })
//                     }
//                 })
//             })
//         }
//     })
    
// }