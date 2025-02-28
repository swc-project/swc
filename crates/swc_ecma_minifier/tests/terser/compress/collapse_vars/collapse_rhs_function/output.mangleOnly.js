var n, o;
function t() {
    n = function() {};
    o = function() {};
    return function() {};
}
var c = t();
console.log(n === o, o === c, c === n);
