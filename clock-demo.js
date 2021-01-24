"use strict"

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


const oneSecond = () => 1000

const writeToConsole = message => console.log(message)

const clearConsole = () => console.clear()

const buildClockTime = date => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
})

const doubleDigits = clockTime =>
  pipe(
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

const isPM = clockTime =>
  clockTime.hours > 12;

const pipe = (...fns) => arg =>
  fns.reduce(
    (accumulated, f) => f(accumulated),
    arg
  )

const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key]
})

const format = formatString => clockTime =>
  formatString.replace("hh", clockTime.hours)
    .replace("mm", clockTime.minutes)
    .replace("ss", clockTime.seconds)
    .replace("tz_offset", clockTime.offsetInHours)
    .replace("am_pm", clockTime.ampm)
    .replace("tz_city", clockTime.city)

const tickTock = () =>
  setInterval(
    pipe(
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
