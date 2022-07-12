// @target: es6
var o = {
    [+"foo"] (y) {
        return y.length;
    },
    [+"bar"]: (y)=>y.length
};
