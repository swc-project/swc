
const getToken = message => /token=(\w+)/.exec(message || getRequest()?.message)?.[1]

console.log('PASS')