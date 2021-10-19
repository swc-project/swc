class clodule1 {
    static sfn(id) {
        return 42;
    }
}
(function(clodule) {
    function fn(x, y) {
        return clodule1.sfn('a');
    }
    clodule.fn = fn;
})(clodule1 || (clodule1 = {
}));
