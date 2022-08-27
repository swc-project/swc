//// [symbolProperty1.ts]
var s;
var x = {
    [s]: 0,
    [s] () {},
    get [s] () {
        return 0;
    }
};
