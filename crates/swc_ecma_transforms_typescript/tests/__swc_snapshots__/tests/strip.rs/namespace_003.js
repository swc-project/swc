(function(Test) {
    (function(Inner) {
        Inner.c = 3;
    })(Test.Inner || (Test.Inner = {}));
})(Test || (Test = {}));
var Test;
