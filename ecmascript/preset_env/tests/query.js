const browserslist = require('browserslist')
let target = JSON.parse(process.argv[2]);

target = target.browsers ? target.browsers : target;
target = Array.isArray(target) ? target : (typeof target === 'string' ? [target] : Object.keys(target).map((k) => `${k} ${target[k]}`));
target = target.filter(v => !v.startsWith('esmodules'));

// console.log('Target: ', target);

const browsers = browserslist(target)
console.log(JSON.stringify(browsers))
