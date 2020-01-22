const browserslist = require('browserslist')
let target = JSON.parse(process.argv[1]);

target = target.browsers ? target.browsers : target;
target = Array.isArray(target) ? target : (typeof target === 'string' ? [target] : Object.keys(target).map((k) => `${k} ${target[k]}`));
target = target.filter(v => !v.startsWith('esmodules') && !!v);

// console.log('Target: ', target);

let browsers = browserslist(target && target.length ? target : undefined, {
    mobileToDesktop: true,
});
browsers = browsers.filter((v) => !v.includes("TP"))
console.log(JSON.stringify(browsers));