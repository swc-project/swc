// it is an error to have duplicate index signatures of the same kind in a type
var test;
(function(test) {
    class C {
    }
    var a;
})(test || (test = {
}));
