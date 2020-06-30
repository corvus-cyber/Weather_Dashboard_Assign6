
$(document).ready(function(){
  var location; 
  //This is an array where we will store locations
  var locationHistory = []; 
  var currentDay = moment().format('MMMM Do YYYY');
  var currentDayOfWeek = moment().format("dddd");
  var currentInfo = " (" + currentDayOfWeek + ", " + currentDay + ")";
  $(".date").text(currentInfo);
  showLocalStorage();
  


  $(".search").click(function(){
    event.preventDefault();
    location = $("#cityName").val();
    locationHistory.push(location);
    developWeather(false);
  })

  $("li").click(function(){
    location = $(this).text();
    developWeather(true);
  })

  function developWeather(clicked){
    if (location!== "" && clicked === false){
      var list = $("<li>").text(location);
      list.addClass("list-group-item");
      $(".list-group").append(list);
      console.log(locationHistory)
      localStorage.setItem("locationHistory", JSON.stringify(locationHistory));
    }
    // Here we are building the URL we need to query the basic weather database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=166a433c57516f51dfab1f7edaed8413";

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {
        // Log the queryURL
        console.log(queryURL);
        // Log the resulting object
        console.log(response);
        // Transfer content to HTML
        $(".city").text(response.name);
        var weatherImg = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
        $(".weather-image").attr("src", weatherImg);
        $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $(".humidity").text("Humidity: " + response.main.humidity + " %");
        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        // add temp content to html
        $(".tempF").text("Temperature (F) " + tempF.toFixed(2) + " °F");
        //Add latitude and longitude 
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;

        //Here we are building the URL we need to query the UV index
        var uvQueryUrl= "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=166a433c57516f51dfab1f7edaed8413";

        //Here we run our uvindex Ajax call 
        $.ajax({
          url: uvQueryUrl,
          method: "GET"
        })
          .then(function(response){
            //add uvi index to html
            var uv = response.current.uvi;
            $("#uv-container").text("UV Index:  ");
            console.log(uv);
            $("#uv-text").text(uv);
            //We now colorcode the index
            if (uv < 3){
              $("#uv-text").addClass("good")
            }
            else if (uv > 7){
              $("#uv-text").addClass("bad")
            }
            else {
              $("#uv-text").addClass("ok")
            } 
            $(".forecast").empty();
            var forecastH2 = $("<h2>").text("Five Day Forecast");
            $(".forecast").append(forecastH2)
            //use a forloop to create a forecast of the next five days
            for (i = 1; i < 6; i++ ){
              var timeStamp = response.daily[i].dt * 1000;
              //use moment.js to display the upcoming dates
              var dateLine = new Date(timeStamp);
              var calendar = {year: 'numeric', month: 'numeric', day: 'numeric'};
              var forecastTime = dateLine.toLocaleString("en-US", calendar);
              var forecastCard = $("<div>").addClass("timeCard");
              var insertTime = $("<p>").text(forecastTime);
              //attach the date to the forecast div
              forecastCard.append(insertTime);
              //now build and display weather image
              var weatherImg = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
              var forecastImg = $("<img>").attr("src", weatherImg);
              forecastCard.append(forecastImg);
              //set temperature for every day
              var tempF = ((response.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2);
              var tempPar = $("<p>").text("Temp: " + tempF + " °F")
              forecastCard.append(tempPar);
              //set humidity for every day
              var humidity = $("<p>").text("Humidity: " + response.daily[i].humidity + " %");
              forecastCard.append(humidity);
              //Append the div to the html div
              $(".forecast").append(forecastCard);   
            }
          })
      });
  }

  function showLocalStorage(){
    $(".list-group").empty();
    //locationHistory = JSON.parse(localStorage.getItem("locationHistory"));
    if (locationHistory!= undefined){
      locationHistory=JSON.parse(localStorage.getItem("locationHistory"));
      location=locationHistory[locationHistory.length-1];
    }
    developWeather(false);
    //create forloop to take from localStorarge and display on list
    for (i=0; i < locationHistory.length; i++){
      var list = $("<li>").text(locationHistory[i]);
      list.addClass("list-group-item");
      $(".list-group").append(list);
    }
  }
})