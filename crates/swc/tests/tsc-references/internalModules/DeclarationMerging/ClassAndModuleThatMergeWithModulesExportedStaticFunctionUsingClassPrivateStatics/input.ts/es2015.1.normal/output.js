class clodule {
    static sfn(id) {
        return 42;
    }
}
(function(clodule) {
    function fn(x, y) {
        return clodule.sfn('a');
    }
    clodule.fn = fn;
})(clodule || (clodule = {
}));
