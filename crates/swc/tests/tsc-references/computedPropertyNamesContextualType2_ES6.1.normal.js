//// [computedPropertyNamesContextualType2_ES6.ts]
var o = {
    [+"foo"] (y) {
        return y.length;
    },
    [+"bar"]: (y)=>y.length
};
