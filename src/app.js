const getLocation = async (city) => {
  try {
    const fetchLocation = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=f9da36c47afb640c01a7345ae6827eb7`
    );
    const responseData = await fetchLocation.json();
    return [
      responseData[0].local_names.pl,
      responseData[0].lat,
      responseData[0].lon,
    ];
  } catch (error) {
    console.error(error);
  }
};

const getWeather = async (cord) => {
  const lat = cord[1];
  const lon = cord[2];
  try {
    const fetchWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=f9da36c47afb640c01a7345ae6827eb7`
    );
    const { main, wind, weather } = await fetchWeather.json();

    return [main, wind, weather];
  } catch (error) {
    console.error(error);
  }
};

const renderWeather = async (e) => {
  e.preventDefault();
  const weatherWrapper = document.querySelector(".weather--wrapper");
  const city = document.querySelector("#search__city").value;
  const cityData = await getLocation(city);

  const [main, wind, weather] = await getWeather(cityData);
  weatherWrapper.classList.add("show");
  weatherWrapper.classList.replace("fadein", "fadeout");
  if (!document.querySelector(".weather")) {
    weatherWrapper.classList.add("fadein");
  }
  const render = () => {
    weatherWrapper.innerHTML = `<div class="weather">
    <h1 class="weather__city">${cityData[0]}</h1>
    <img src="https://openweathermap.org/img/wn/${
      weather[0].icon
    }@2x.png" class="weather__icon">
    <span class="weather__temp">${Math.floor(main.temp)}<sup>&deg;C</sup></span>
    <span class="weather__condition">${weather[0].description}</span>
    <div class="condition--group">
      <div class="condition">
        <i class="fa-solid fa-wind condition__icon"></i>
        <div class="condition__info">
          <span class="condition__info--data">${Math.floor(
            wind.speed
          )} km/h</span>
          <span class="condition__info--name">Wind</span>
        </div>
      </div>
      <div class="condition">
      <img src="images/humidility.png" class="condition__icon">
        <div class="condition__info">
          <span class="condition__info--data">${Math.floor(
            main.humidity
          )}%</span>
          <span class="condition__info--name">Humidility</span>
        </div>
      </div>
      <div class="condition">
        <img src="images/pressure.png" class="condition__icon">
        <div class="condition__info">
          <span class="condition__info--data">${main.pressure} hPa</span>
          <span class="condition__info--name">Pressure</span>
        </div>
      </div>
    </div>
  </div>`;
    weatherWrapper.classList.replace("fadeout", "fadein");
  };
  document.querySelector(".weather") ? setTimeout(render, 200) : render();
};

document
  .querySelector(".search__input--button")
  .addEventListener("click", renderWeather);
