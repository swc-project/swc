var x;
x = 1;
x = true;
x = '';
x = {
};
class C {
}
var c;
x = C;
x = c;
var i;
x = i;
var M1;
(function(M) {
    M.x = 1;
})(M1 || (M1 = {
}));
x = M1;
function f(a) {
    x = a;
}
x = f;
