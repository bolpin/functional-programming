"use strict"
const oneSecond = () => 1000

const trace = label => value => {
  console.log(`
    ${ JSON.stringify(value) }`);
  return value;
};

const currentTime = () => new Date()

// 1
const writeToConsole = msg => console.log(msg)

// 2
const clearConsole = () => console.clear()

// 3
const pipe = (...fns) => arg =>
  fns.reduce(
    (composed, fn) => fn(composed),
    arg
  )

// 4
const buildClockTime = arg => ({
  hours: arg.getHours(),
  minutes: arg.getMinutes(),
  seconds: arg.getSeconds()
})


// 5
const format = template => clockTime =>
  template.replace("hh", clockTime.hours)
    .replace("mm", clockTime.minutes)
    .replace("ss", clockTime.seconds)
    .replace("ampm", clockTime.ampm)

// 6
const doubleDigitTime = clockTime =>
  pipe(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(clockTime)

// 7
const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? `0${clockTime[key]}` : clockTime[key]
})

// 8
const twelveHourTime = clockTime => {
  const isPM = clockTime => clockTime.hours >= 12;

  return {
    ...clockTime,
    hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
    ampm: isPM(clockTime) ? "PM" : "AM"
  }
}
const run = () => {
  setInterval(
    pipe(
      clearConsole,
      //trace("before currentTime"),
      currentTime,
      //trace("before buildClockTime"),
      buildClockTime,
      //trace("before twelveHourTime"),
      twelveHourTime,
      //trace("before doubleDigitTime"),
      doubleDigitTime,
      //trace("before format"),
      format("The current local time is hh:mm:ss ampm"),
      //trace("before writeToConsole"),
      writeToConsole
    )
    , oneSecond()
  )
}

run()























const cities = () => [
  {
    name: "Calgary",
    offsetFromPacificStandardTime: 1,
  },
  {
    name: "Honolulu",
    offsetFromPacificStandardTime: -3,
  },
  {
    name: "Seattle",
    offsetFromPacificStandardTime: 0,
  }
]

