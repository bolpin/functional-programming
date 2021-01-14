// For instructional purposes.
//
// A console clock for javascript, written in a declarative
// functional style.  Originally based on a similar example
// in "Learning React" (O'REILLY 2020) by Alex Banks and
// Eve Porcello
"use strict"
const fetch = require("node-fetch")
const fs = require('fs')

const cities = JSON.parse(fs.readFileSync('cities.json'))

const keys = JSON.parse(fs.readFileSync('keys.json'))
const {weatherApiKey} = keys

const waitingForDataMessage = "[waiting to fetch ...]"
let latestWeatherDescription = waitingForDataMessage
let latestWeatherHumidity = waitingForDataMessage
let latestWeatherTemperature = waitingForDataMessage
let latestWeatherPressure = waitingForDataMessage

const clearConsole = () => console.clear()

const writeToConsole = message => console.log(message)

const getCurrentTime = () => new Date()

const oneSecond = () => 1000

const saveWeather = (weatherData) => {
  let {weather, main: {humidity, pressure, temp}} = weatherData
  let {description} = weather[0]

  latestWeatherDescription = description
  latestWeatherTemperature = temp - 273.15
  latestWeatherPressure = pressure
  latestWeatherHumidity = humidity
}

const updateWeather = cityName =>
  fetch(weatherUrl(cityName))
    .then(response => response.json())
    .then(data => saveWeather(data))

const weatherUrl = cityName => {
  let city = cities.find(c => c.name === cityName)
  let {lat, lon} = city

  return `https:\/\/api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`
}

// we don't need to fetch the weather more than a few times
// per minute
const setWeather = cityName => clockTime => {
  if ([0, 15, 30, 45].includes(clockTime.seconds)) {
    updateWeather(cityName)
  }

  return {
    ...clockTime,
    weatherCity: cityName,
    weatherDescription: latestWeatherDescription,
    weatherHumidity: latestWeatherHumidity,
    weatherTemperature: latestWeatherTemperature,
    weatherPressure: latestWeatherPressure
  }
}

const buildClockTime = date => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
})

const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key]
})

const doubleDigitTime = clockTime =>
  pipe(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(clockTime)

const twelveHourTime = clockTime => {
  const isPM = clockTime => clockTime.hours > 11;

  return {
    ...clockTime,
    hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
    ampm: isPM(clockTime) ? "PM" : "AM"
  }
}


// pipe -- to support a declarative, readable style:
const pipe = (...fns) => arg =>
  fns.reduce(
    (composed, fn) => fn(composed),
    arg
  )


const setTimezone = cityName => clockTime => {
  let city = cities.find(city => cityName === city.name)
  let offset = city.offsetFromPacificTime

  // handle hours values outside 0...23
  let normalizeHours = (hrs) => {
    if (hrs < 0) { return 24 + hrs }
    return hrs % 24
  }

  if (offset < -23 || offset > 23) {
    throw "Offsets must be within 23 hours of the local timezone."
  }

  return {
    ...clockTime,
    offsetInHours: offset,
    city: city.name,
    hours: normalizeHours(clockTime.hours + offset),
  }
}

const setLocalTim = cityName => clockTime => {
  let city = cities.find(city => cityName === city.name)
  return {
    ...clockTime,
    timsLastName: cities.find(city => cityName === city.name).tim
  }
}

const format = template => clockTime =>
  template.replace("hh", clockTime.hours)
    .replace("mm", clockTime.minutes)
    .replace("ss", clockTime.seconds)
    .replace("<ampm>", clockTime.ampm)
    .replace("<city>", clockTime.city)
    .replace("<weather>", clockTime.weatherDescription)
    .replace("<weathercity>", clockTime.weatherCity)
    .replace("<humidity>", clockTime.weatherHumidity)
    .replace("<pressure>", clockTime.weatherPressure)
    .replace("<temperature>", clockTime.weatherTemperature)
    .replace("<LastName>", clockTime.timsLastName)

const city = "Seattle"

// The main function:
const run = () =>
  setInterval(
    pipe(
      clearConsole,
      getCurrentTime,
      buildClockTime,
      setTimezone(city),
      setWeather(city),
      setLocalTim(city),
      twelveHourTime,
      doubleDigitTime,
      format(`hh:mm:ss <ampm> in downtown <city>.

         Local Tim is Tim <LastName>.

         The weather is <weather> in <weathercity>.
         <temperature>° Celcius.
         Atmospheric pressure is <pressure> hPa.
         Humidity is <humidity>%.`),
      writeToConsole,
    ),
    oneSecond()
  )

run()
