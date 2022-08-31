//// [symbolProperty19.ts]
var i = {
    [Symbol.iterator]: {
        p: null
    },
    [Symbol.toStringTag]: ()=>({
            p: void 0
        })
};
i[Symbol.iterator], i[Symbol.toStringTag]();
