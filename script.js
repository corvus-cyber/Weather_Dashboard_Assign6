
$(document).ready(function(){
  var location;  
  var APIKey = "166a433c57516f51dfab1f7edaed8413";

  developWeather();

  function developWeather(){
    if (location!== ""){
      var list = $("<li>").text(location);
      list.addClass("list-group-item");
      $(".list-group").append(list)
    }

  }

    // Here we are building the URL we need to query the database
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

        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        
        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // add temp content to html
        $(".temp").text("Temperature (K) " + response.main.temp);
        $(".tempF").text("Temperature (F) " + tempF.toFixed(2));

        // Log the data in the console as well
        console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature (F): " + tempF);
      });
  
  $(".search").click(function(){
    event.preventDefault();
    location = $("#cityName").val();
    developWeather();
  })

  $(".list-group-item").click(function(){
    location = $(this).text();
    developWeather();
  })
})