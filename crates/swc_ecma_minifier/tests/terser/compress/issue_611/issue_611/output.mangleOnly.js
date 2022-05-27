define(function() {
    function a() {}
    if (a()) {
        a();
        return void 0;
    }
});
