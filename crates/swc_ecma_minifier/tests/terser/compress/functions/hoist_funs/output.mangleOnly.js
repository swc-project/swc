console.log(typeof a, typeof b, 1);
if (console.log(typeof a, typeof b, 2)) console.log(typeof a, typeof b, 3);
else {
    console.log(typeof a, typeof b, 4);
    function a() {}
    console.log(typeof a, typeof b, 5);
}
function b() {}
console.log(typeof a, typeof b, 6);
