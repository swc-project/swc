(function(Test) {
    function abc() {
        return 10;
    }
    Test.abc = abc;
    Test.foo = function() {
        return 20;
    };
    function xyz() {
        return abc() * foo();
    }
    Test.xyz = xyz;
})(Test || (Test = {}));
Test.xyz();
