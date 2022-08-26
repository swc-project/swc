"use strict";
console.log(typeof f, typeof t, 1);
if (console.log(typeof f, typeof t, 2)) console.log(typeof f, typeof t, 3);
else {
    console.log(typeof o, typeof t, 4);
    function o() {}
    console.log(typeof o, typeof t, 5);
}
function t() {}
console.log(typeof f, typeof t, 6);
