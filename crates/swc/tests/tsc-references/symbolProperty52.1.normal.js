//// [symbolProperty52.ts]
var obj = {
    [Symbol.nonsense]: 0
};
obj = {};
obj[Symbol.nonsense];
