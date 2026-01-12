(function(Test) {
    (function(Inner) {
        Inner.c = 3;
    })(Inner || (Inner = {}));
})(Test || (Test = {}));
(function(Test) {
    (function(Other) {})(Other || (Other = {}));
})(Test || (Test = {}));
