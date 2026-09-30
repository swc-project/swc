const f = (a = void 0)=>a, g = (a, b = void 0, c)=>[
        a,
        b,
        c
    ], h = async (a = void 0)=>a;
console.log(f(2), f.length), console.log(g.length, g(1, 2, 3).join(",")), console.log(h.length);
