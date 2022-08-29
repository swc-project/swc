//// [symbolProperty5.ts]
var x = {
    [Symbol.iterator]: 0,
    [Symbol.toPrimitive] () {},
    get [Symbol.toStringTag] () {
        return 0;
    }
};
