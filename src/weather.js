import { hoursToMilliseconds } from 'date-fns';

// import { format, parseISO } from 'date-fns';
const ct = require('countries-and-timezones');

let apiKey = "ca588f406b51fb1542b1d900b0a9364e";

async function fetchLocation(query) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`);
        let responseJson = await response.json();
    
        return responseJson;
    } catch(err) {
        console.error(err);
    }
}

function getCountryName(countryCode) {
    return ct.getCountry(countryCode).name;
}

function getLocationTime(countryCode) {
    let locationTimezone = ct.getCountry(countryCode).timezones[0];

    let time = new Date().toLocaleString("en-US", { timeZone: locationTimezone });

    return dateToString(time);
}

function dateToString(string) {
    let newString = string.split(',');
    let date = newString[0].split('/');
    let time = newString[1].split(':');
    let PMorAM = time[2].split(' ');

    let dateString = `${getDateName(date[0])}, ${date[1]}th ${toMonthName(date[0])} ${date[2]}`;
    let hourString = `${time[0]}:${time[1]} ${PMorAM[1]}`;

    return [dateString, hourString];
}

function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleDateString("en-US", {
        month: 'long',
    });
}

function getDateName(dateStr) {
    let date = new Date();
    date.setDate(dateStr);
    
    return date.toLocaleDateString("en-US", {
        weekday: 'long',
    });
}

export {
    fetchLocation,
    getCountryName,
    getLocationTime
}