var A1;
(function(A) {
    A.x = 'hello world';
    var y = 12;
})(A1 || (A1 = {
}));
var x;
var x = A1.x;
// Error, since y is not exported
var y = A1.y;
