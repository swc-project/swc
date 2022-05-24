[](function () {
    var a = function () {
        b(function () {
            b(a);
        });
    };
});
