//// [symbolProperty2.ts]
var s = Symbol(), x = {
    [s]: 0,
    [s] () {},
    get [s] () {
        return 0;
    }
};
