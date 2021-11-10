define(function () {
    function fn() {}
    if (fn()) {
        fn();
        return void 0;
    }
});
