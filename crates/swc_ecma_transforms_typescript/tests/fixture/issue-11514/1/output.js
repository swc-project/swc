(function(Test) {
    Test.a = 1;
})(Test || (Test = {}));
(function(Test) {
    Test.b = Test.a + 1;
})(Test || (Test = {}));
export var Test;
