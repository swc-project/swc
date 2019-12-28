const browserslist = require('browserslist')
let target = JSON.parse(process.argv[1]);

target = target.browsers ? target.browsers : target;
target = Array.isArray(target) ? target : (typeof target === 'string' ? [target] : Object.keys(target).map((k) => `${k} ${target[k]}`));
target = target.filter(v => !v.startsWith('esmodules') && !!v);

// console.log('Target: ', target);

const browsers = browserslist(target && target.length ? target : undefined, {
    mobileToDesktop: true,
});
console.log(JSON.stringify(browsers));