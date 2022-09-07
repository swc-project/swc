"use strict";
console.log(typeof f, typeof o, 1);
if (console.log(typeof f, typeof o, 2)) console.log(typeof f, typeof o, 3);
else {
    console.log(typeof e, typeof o, 4);
    function e() {}
    console.log(typeof e, typeof o, 5);
}
function o() {}
console.log(typeof f, typeof o, 6);
