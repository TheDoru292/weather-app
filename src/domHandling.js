import { fetchLocation, getCountryName, getLocationTime } from "./weather";

let json;

function initialization() {
  getLocation("London");
  addEventToInput();
}

function addEventToInput() {
  const form = document.querySelector("form");
  const search = document.querySelector("#search");

  form.addEventListener("submit", (e) => {
    getLocation(search.value);
    e.preventDefault();
  });

  search.addEventListener("invalid", (e) => {
    if (search.validity.valueMissing) {
      search.setCustomValidity("Location must not be empty!");
    }
  });
}

async function getLocation(location) {
  json = await fetchLocation(location);

  if (typeof json === "object") {
    createPageContent();
    getLocationTime(json.sys.country);
  } else if (typeof json === "number") {
    throwError(json);
  }
}

function throwError(code) {
  const container = document.querySelector(".error");

  const errorMessage = document.createElement("p");
  errorMessage.textContent = `Error code: ${code}`;

  container.append(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 6000);
}

function createPageContent() {
  const date = getLocationTime(json.sys.country);

  const divContainer = document.querySelector(".container");
  checkForTime(date[1], divContainer);

  const container = document.querySelector(".info");
  container.textContent = "";

  const basicContainer = document.createElement("div");
  basicContainer.className = "basic";

  const location = document.createElement("h1");
  location.textContent = `${json.name}, ${getCountryName(json.sys.country)}`;

  const status = document.createElement("h2");
  status.textContent = `${json.weather[0].description}`;

  const dateContainer = document.createElement("div");
  dateContainer.className = "date-container";

  const dateAndDay = document.createElement("p");
  dateAndDay.textContent = date[0];

  const time = document.createElement("p");
  time.textContent = date[1];

  const temperature = document.createElement("p");
  temperature.className = "temp";
  temperature.textContent = `${json.main.temp}`;

  const sup = document.createElement("sup");
  sup.textContent = "°C";

  const otherInfo = document.createElement("div");
  otherInfo.classList = "other-info";

  const feelsLike = document.createElement("p");
  feelsLike.className = "temp-like";
  feelsLike.textContent = `Feels like: ${json.main.feels_like}`;

  const humidity = document.createElement("p");
  humidity.textContent = `Humidity: ${json.main.humidity}%`;

  const wind = document.createElement("p");
  wind.textContent = `Wind: ${json.wind.speed} KM`;

  const feelsLikeContainer = document.createElement("div");
  feelsLikeContainer.className = "feel-container";

  const tempSup = document.createElement("sup");
  tempSup.textContent = "°C";

  basicContainer.append(location, status);
  dateContainer.append(dateAndDay, time);
  feelsLikeContainer.append(feelsLike, sup);
  otherInfo.append(feelsLikeContainer, humidity, wind);
  temperature.appendChild(tempSup);
  container.append(basicContainer, dateContainer, temperature, otherInfo);
}

function checkForTime(time, container) {
  let newTime = time.split(" ");
  let hour = newTime[1].split(":");

  if (
    (hour[0] < 12 && hour[0] > 9 && newTime[2] === "PM") ||
    (hour[0] < 7 && newTime[2] === "AM")
  ) {
    container.style.backgroundImage = "url('../dist/assets/night.jpg')";
    container.style.color = "white";
  } else if (hour[0] > 6 && hour[0] < 12 && newTime[2] === "AM") {
    container.style.backgroundImage = "url('../dist/assets/day.jpg')";
    container.style.color = "white";
  } else if (hour[0] < 9 && hour[0] >= 1 && newTime[2] === "PM") {
    container.style.backgroundImage = "url('../dist/assets/evening.jpg')";
    container.style.color = "white";
  }
}

export { initialization, getLocationTime };
