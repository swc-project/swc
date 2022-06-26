var x;
x = 1;
x = true;
x = '';
x = {};
class C {
}
var c;
x = C;
x = c;
var i;
x = i;
var M;
(function(M) {
    var x = M.x = 1;
})(M || (M = {}));
x = M;
function f(a) {
    x = a;
}
x = f;
