var a, b;
function c() {
    a = function() {};
    b = function() {};
    return function() {};
}
var d = c();
console.log(a === b, b === d, d === a);
