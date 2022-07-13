// @allowJs: true
// @checkJs: true
// @strict: true
// @noEmit: true
// @Filename: ex.d.ts
export class Crunch {
}
// @Filename: use.js
var ex = require('./ex');
// values work
var crunch = new ex.Crunch(1);
crunch.n;
// types work
/**
 * @param {ex.Greatest} greatest
 * @param {ex.Crunch} wrap
 */ function f(greatest, wrap) {
    greatest.day;
    wrap.n;
}
