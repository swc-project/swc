d(function () {
    var obj = {
        key: "some string"
    }, b = function () {
        return a, obj.key;
    };
    return function () {
        return b;
    };
});
