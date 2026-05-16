d(function() {
    var obj_key = "some string", b = function() {
        return a, obj_key;
    };
    return function() {
        return b;
    };
});
