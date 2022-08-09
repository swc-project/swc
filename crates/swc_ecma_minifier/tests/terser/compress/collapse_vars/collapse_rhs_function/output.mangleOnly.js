var n, o;
function t() {
    n = function() {};
    o = function() {};
    return function() {};
}
var u = t();
console.log(n === o, o === u, u === n);
