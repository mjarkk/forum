export const functions = {
  dateToString: (msg) =>
    msg.split('-').map((el, i) => 
      (i == 1) ? // check it the item is the time
        el.split(':').slice(0,2).join(':') + // get the hours + minutes
        el.slice(-2) : // add am or pm
        el + ' ' // return the date with a space at the end
    ),
  dateToNum: (input) => {
    // TODO: return a date as number
    return false
  }
}