var i = {
    [Symbol.iterator]: 0,
    [Symbol.toStringTag]: ()=>"",
    set [Symbol.toPrimitive] (p){}
};
i[Symbol.iterator], i[Symbol.toStringTag](), i[Symbol.toPrimitive] = !1;
