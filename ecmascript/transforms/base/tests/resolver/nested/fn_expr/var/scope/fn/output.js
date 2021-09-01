var Test = function() {
    var Test1 = function() {
        function Test2() {
        }
        return Test2;
    }();
    return Test1;
}();
