//Function and variable of the same name in same declaration space
//Function overload with different name from implementation signature 
var M;
(function(M) {
    var fn1 = function fn1() {
    };
    var fn2 = function fn2() {
    };
    var fn1;
    var fn2;
})(M || (M = {
}));
function fn3() {
}
var fn3;
function func() {
    var fn4 = function fn4() {
    };
    var fn5 = function fn5() {
    };
    var fn4;
    var fn5;
}
function overrr() {
}
