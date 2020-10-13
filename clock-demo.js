// A console clock for javascript, written in a declarative
// functional style
// Based on a similar example in "Learning React" (O'REILLY
// 2020) by Alex Banks and Eve Porcello
"use strict"

const clearConsole = () => console.clear()

const getCurrentTime = () => new Date()

const writeToConsole = message => console.log(message)

const oneSecond = () => 1000

const timezones = () => [
  {
    city: "Calgary",
    offsetFromPacificStandardTime: 1
  },
  {
    city: "Honolulu",
    offsetFromPacificStandardTime: -3
  },
  {
    city: "Tijuana",
    offsetFromPacificStandardTime: 0
  }
]

// handle hours values outside 0...23
let normalizeHours = (hrs) => {
  if (hrs < 0) {
    return 24 + hrs
  } else {
    return hrs % 24;
  }
}

const isPM = clockTime =>
  clockTime.hours > 12;

const buildClockTime = date => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
})

const doubleDigits = clockTime =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(clockTime)

const twelveHourTime = clockTime =>
  (
    {
      ...clockTime,
      hours: isPM(clockTime) ? clockTime.hours - 12 : clockTime.hours,
      ampm: isPM(clockTime) ? "PM" : "AM"
    }
  )


// Compose -- A higher-order function to support a declarative style:

const compose = (...fns) => arg =>
  fns.reduce(
    (composed, f) => f(composed),
    arg
  )


// Other higher-order functions:

const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key]
})

const setTimezone = cityName => clockTime => {
  let timezone = timezones().find(timezone => cityName === timezone.city)
  let offset = timezone.offsetFromPacificStandardTime

  if (offset < -23 || offset > 23) {
    throw "Offsets must be within 23 hours of the local timezone."
  }

  return {
    ...clockTime,
    offsetInHours: offset,
    city: timezone.city,
    hours: normalizeHours(clockTime.hours + offset),
  }
}

const format = formatString => clockTime =>
  formatString.replace("hh", clockTime.hours)
    .replace("mm", clockTime.minutes)
    .replace("ss", clockTime.seconds)
    .replace("tz_offset", clockTime.offsetInHours)
    .replace("am_pm", clockTime.ampm)
    .replace("tz_city", clockTime.city)


// The main function:

const tickTock = () =>
  setInterval(
    compose(
      clearConsole,
      getCurrentTime,
      buildClockTime,
      setTimezone("Honolulu"),
      twelveHourTime,
      doubleDigits,
      format("hh:mm:ss am_pm (tz_city timezone offset of tz_offset hour)"),
      writeToConsole,
    ),
    oneSecond()
  )

tickTock()
