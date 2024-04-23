(function() {
    var a;
    eval('a');
    function b() {
        a = a += 1; // eval makes dynamic
    }
}());
