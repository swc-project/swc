var a, b;
function d() {
    a = function() {};
    b = function() {};
    return function() {};
}
var c = d();
console.log(a === b, b === c, c === a);
