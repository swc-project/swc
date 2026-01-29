// Test multiple merged namespace declarations with cross-references
(function(Test) {
    Test.a = 1;
})(Test || (Test = {}));
(function(Test) {
    Test.b = Test.a + 1;
})(Test || (Test = {}));
(function(Test) {
    Test.c = Test.a + Test.b;
})(Test || (Test = {}));
// Non-exported namespace
(function(Local) {
    Local.x = 10;
})(Local || (Local = {}));
(function(Local) {
    Local.y = Local.x + 1;
})(Local || (Local = {}));
var Local;
export var Test;
