//// [symbolProperty1.ts]
var s, x = {
    [s]: 0,
    [s] () {},
    get [s] () {
        return 0;
    }
};
