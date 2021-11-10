(function() {
    function a() {
        (function() {
            b('c');
        }());
    }
    a();
}());
