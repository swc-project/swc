function call(f, ...args) {
    return f(...args);
}
function callr(args, f) {
    return f(...args);
}
function bind(f, x) {
    return (...rest)=>f(x, ...rest);
}
f2 = f1 = f2, f1(42, "hello", !0), f1(t3[0], t3[1], t3[2]), f1(...t3), f1(42, ...t2), f1(42, "hello", ...t1), f1(42, "hello", !0, ...t0), f1(ns[0], ns[1], !0), f1(...ns, !0), f2(42, "hello", !0), f2(t3[0], t3[1], t3[2]), f2(...t3), f2(42, ...t2), f2(42, "hello", ...t1), f2(42, "hello", !0, ...t0), f2(ns[0], ns[1], !0), f2(...ns, !0), f10(42, "hello", !0), f10(42, "hello"), f10(42), f10(), f10(...t3), f10(42, ...t2), f10(42, "hello", ...t1), f10(42, "hello", !0, ...t0), f10(...ns, !0), f11(42, "hello", !0), f11(42, "hello"), f11(42), f11(), f11(...t3), f11(42, ...t2), f11(42, "hello", ...t1), f11(42, "hello", !0, ...t0), f11(...ns, !0), call((x, y)=>x + y, 10, 20), call((x, y)=>x + y, 10, "hello"), call(f15, "hello", 42), call(f16, "hello", 42), call(f16, "hello", 42), callr(sn, (x, y)=>x + y), callr(sn, f15), callr(sn, f16);
const f21 = bind(f20, 42), f22 = bind(f21, "hello"), f23 = bind(f22, !0);
f20(42, "hello", !0), f21("hello", !0), f22(!0), f23();
const g21 = bind(g20, 42), g22 = bind(g21, "hello"), g23 = bind(g22, !0);
g20(42, "hello", !0), g20(42, "hello"), g20(42), g21("hello", !0), g21("hello"), g21(), g22(!0), g22(), g23(), f30(42, (x)=>"" + x, (x)=>x + 1), events.emit('move', 10, 'left'), events.emit('jump', 20, 'up'), events.emit('stop', 'Bye!'), events.emit('done'), ff1 = ff2, ff1 = ff3, ff1 = ff4;
