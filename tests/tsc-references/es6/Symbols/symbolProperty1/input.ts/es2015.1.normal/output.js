//@target: ES6
var s;
var x = {
    [s]: 0,
    [s] () {
    },
    get [s] () {
        return 0;
    }
};
