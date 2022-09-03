//// [symbolProperty18.ts]
var i = {
    [Symbol.iterator]: 0,
    [Symbol.toStringTag]: ()=>"",
    set [Symbol.toPrimitive] (p){}
}, it = i[Symbol.iterator], str = i[Symbol.toStringTag]();
i[Symbol.toPrimitive] = !1;
