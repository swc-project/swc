"use strict";
console.log(typeof f, typeof g, 1);
if (console.log(typeof f, typeof g, 2)) console.log(typeof f, typeof g, 3);
else {
    console.log(typeof f, typeof g, 4);
    function f() {}
    console.log(typeof f, typeof g, 5);
}
function g() {}
console.log(typeof f, typeof g, 6);
