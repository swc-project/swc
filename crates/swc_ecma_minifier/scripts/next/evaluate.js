const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');

const obj = eval(`(${data})`)

console.log(obj)