export const standardTime = (time) => {
  // time is in format HH:MM (24 hour format)
  let hours = time.split(':')[0]
  let minutes = time.split(':')[1]
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${hours}:${minutes} ${ampm}`
  // now time is in format HH:MM AM/PM
}