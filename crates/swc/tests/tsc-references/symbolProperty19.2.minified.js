//// [symbolProperty19.ts]
var i = {
    [Symbol.iterator]: {
        p: null
    },
    [Symbol.toStringTag]: ()=>({
            p: void 0
        })
}, it = i[Symbol.iterator], str = i[Symbol.toStringTag]();
