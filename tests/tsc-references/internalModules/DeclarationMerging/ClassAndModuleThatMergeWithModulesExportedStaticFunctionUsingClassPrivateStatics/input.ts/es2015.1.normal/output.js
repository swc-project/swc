class clodule {
    static sfn(id) {
        return 42;
    }
}
(function(clodule1) {
    function fn(x, y) {
        return clodule.sfn('a');
    }
    clodule1.fn = fn;
})(clodule || (clodule = {
}));
