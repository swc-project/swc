define(function () {
    function fn() {}
    if (fn()) return void fn();
});
