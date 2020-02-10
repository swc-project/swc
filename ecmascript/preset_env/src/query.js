"use strict";

var browserslist;
try{
    browserslist = require('browserslist');
} catch (e){
    console.error('swc: You have to install `browserslist` to use `env`');
    process.exit(1);
}


var target = JSON.parse(process.argv[1]);
target = target.browsers ? target.browsers : target;
target = Array.isArray(target) ? target : typeof target === 'string' ? [target] : Object.keys(target).map(function (k) {
    return k + " " + target[k];
});
target = target.filter(function (v) {
    return !v.startsWith('esmodules') && !!v;
}); // console.log('Target: ', target);

var browsers = browserslist(target && target.length ? target : undefined, {
    mobileToDesktop: true
});
browsers = browsers.filter(function (v) {
    return !v.includes("TP");
});
console.log(JSON.stringify(browsers));