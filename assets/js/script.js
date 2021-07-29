//get element from index.html
var buttonEl = document.getElementById('search');
//var cityNameEl = document.getElementById('city').value;
var appid = 'c37f222d1be87273f5169d1997df3ab3';
var listEl = document.getElementById('searchHistory');

var historySearch = JSON.parse(localStorage.getItem('city') || []);


//var historySearch = localStorage.getItem('city');
//var historySearch = localStorage.getItem('city') || [];
//console.log(historySearch.length);

var cityNameEl = document.getElementById('city');
var temperature = document.getElementById('temp');
var wind = document.getElementById('wind');
var humidity = document.getElementById('humidity');
var currentDay = moment().format('d/MM/YYYY');
var iconEl = document.getElementById('icon');
var uvEl = document.getElementById('uv');
var card1 = document.getElementById('1');



var getSingleForecast = function(searchCity){
    ///fetch call to get everything but UV value
    
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
                temperature.textContent = 'Temperature: ' + data.main.temp + " F"; // add F for temp
             
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
                            var uvValue = data[0].value;
                    
                            uvEl.innerHTML ='UV-Index: ' + uvValue;
                            if(uvValue>=1 && uvValue<=2 ){
                                uvEl.className = "bg-success"
                            }
                            if(uvValue>=3 && uvValue<=5 ){
                                uvEl.className = "bgYellow"
                            }
                            if(uvValue>=6 && uvValue<=7 ){
                                uvEl.className = "bg-warning"
                            }
                            if(uvValue>=8 && uvValue<=10 ){
                                uvEl.className = "bg-danger"
                            }
                            if(uvValue>=11 ){
                                uvEl.className = "bgPurple"
                            }
                           
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
var fiveDayForecast = function(searchCity){
   
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
                    var path = "https://openweathermap.org/img/wn/" + logo + "@2x.png";
                    
                    //display text content of each day
                    document.getElementById(i).innerHTML = `
                    <p>${moment().add(i+1,'days').calendar(null, {
                        sameDay: 'M/DD/YYYY',
                        nextDay: 'M/DD/YYYY',
                        nextWeek: 'M/DD/YYYY',
                        lastDay: 'M/DD/YYYY',
                        lastWeek: 'M/DD/YYYY',
                        sameElse: 'M/DD/YYYY'
                    }) }</p>
                    <img src="${path}"/> <br>
                    <p> Temp: ${fiveCast[i].main.temp} F</p>
                    <p> Wind: ${fiveCast[i].wind.speed} MPH</p>
                    <p> Humidity: ${fiveCast[i].main.humidity}%</p>`;
              
                }
               
              
            })
        }
    })
}

var populate = function(cityValue){
    var liEl = document.createElement('button');
    liEl.classList = 'btn btn-secondary btn-lg btn-block'
    liEl.textContent = cityValue;
    liEl.addEventListener('click',getData);
    listEl.appendChild(liEl);

}
//<button type="button" class="btn btn-secondary btn-lg btn-block">Block level button</button>

var getData = function(event){
    event.preventDefault();
    fiveDayForecast(event.target.textContent);
    getSingleForecast(event.target.textContent);
    console.log(this);

}

var loadHistory = function(){
    for (var i=0; i<historySearch.length; i++){
        populate(historySearch[i]);
    }
    console.log(historySearch)

    //listEl.appendChild(historySearch);
}

var saveSearch = function(searchCity) {
    historySearch.push(searchCity);
    console.log(searchCity);
    localStorage.setItem('city',JSON.stringify(historySearch));
}

loadHistory();
buttonEl.addEventListener('click',() => {
    var searchCity = document.getElementById('input').value;
    populate(searchCity);
    fiveDayForecast(searchCity);
    getSingleForecast(searchCity);  
    saveSearch(searchCity);
    //document.getElementById('input').value = '';
    
});
