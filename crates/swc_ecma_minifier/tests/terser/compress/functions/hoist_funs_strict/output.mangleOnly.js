"use strict";
console.log(typeof f, typeof b, 1);
if (console.log(typeof f, typeof b, 2)) console.log(typeof f, typeof b, 3);
else {
    console.log(typeof a, typeof b, 4);
    function a() {}
    console.log(typeof a, typeof b, 5);
}
function b() {}
console.log(typeof f, typeof b, 6);
