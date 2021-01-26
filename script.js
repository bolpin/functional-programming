"use strict"
const oneSecond = () => 1000

const trace = label => value => {
  console.log(`
    ${ JSON.stringify(value) }`);
  return value;
};

const currentTime = () => new Date()

const writeToConsole = msg => console.log(msg)

const clearConsole = () => console.clear()

const pipe = (...fns) => arg =>
  fns.reduce(
    (composed, fn) => fn(composed),
    arg
  )

const buildClockTime = arg => ({
  hours: arg.getHours(),
  minutes: arg.getMinutes(),
  seconds: arg.getSeconds()
})


const format = template => clockTime =>
  template.replace("hh", clockTime.hours)
    .replace("mm", clockTime.minutes)
    .replace("ss", clockTime.seconds)
    .replace("ampm", clockTime.ampm)

const doubleDigitTime = clockTime =>
  pipe(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(clockTime)

const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? `0${clockTime[key]}` : clockTime[key]
})

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














