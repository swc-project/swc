var A;
(function(A1) {
    A1.x = 'hello world';
    var y = 12;
})(A || (A = {
}));
var x;
var x = A.x;
// Error, since y is not exported
var y = A.y;
