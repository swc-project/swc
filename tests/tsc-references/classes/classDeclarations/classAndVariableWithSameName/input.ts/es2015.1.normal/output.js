class C {
} // error
var C = ''; // error
var M;
(function(M) {
    class D {
    }
    var D = 1; // error
})(M || (M = {
}));
