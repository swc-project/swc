(function() {
    function bar() {
        window.data = 1;
    }
    window.bar = bar;
    bar();
})();
