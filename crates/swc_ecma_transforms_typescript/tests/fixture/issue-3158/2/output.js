var Test;
(function(Test1) {
    function abc() {
        return 10;
    }
    Test1.abc = abc;
    var foo = Test1.foo = function() {
        return 20;
    };
    function xyz() {
        return abc() * foo();
    }
    Test1.xyz = xyz;
})(Test || (Test = {
}));
Test.xyz();
