//// [newWithSpreadES6.ts]
var a, b, c, d, e, g, h, i;
function f(x, y, ...z) {}
class B {
    constructor(x, y, ...z){}
}
new f(1, 2, "string"), new f(1, 2, ...a), new f(1, 2, ...a, "string"), new function(...x) {}(...a, ...a), new f(1, 2, ...a, ...a), new f(1, 2, "string")(), new f(1, 2, ...a)(), new f(1, 2, ...a, "string")(), new b.f(1, 2, "string"), new b.f(1, 2, ...a), new b.f(1, 2, ...a, "string"), new b.f(1, 2, "string"), new b.f(1, 2, ...a), new b.f(1, 2, ...a, "string"), new d[1].f(1, 2, "string"), new d[1].f(1, 2, ...a), new d[1].f(1, 2, ...a, "string"), new e["a-b"].f(1, 2, "string"), new e["a-b"].f(1, 2, ...a), new e["a-b"].f(1, 2, ...a, "string"), new B(1, 2, "string"), new B(1, 2, ...a), new B(1, 2, ...a, "string"), new c["a-b"](1, 2, "string"), new c["a-b"](1, 2, ...a), new c["a-b"](1, 2, ...a, "string"), new c["a-b"](1, 2, "string"), new c["a-b"](1, 2, ...a), new c["a-b"](1, 2, ...a, "string"), new g[1]["a-b"](1, 2, "string"), new g[1]["a-b"](1, 2, ...a), new g[1]["a-b"](1, 2, ...a, "string"), new h["a-b"]["a-b"](1, 2, "string"), new h["a-b"]["a-b"](1, 2, ...a), new h["a-b"]["a-b"](1, 2, ...a, "string"), new i["a-b"][1](1, 2, "string"), new i["a-b"][1](1, 2, ...a), new i["a-b"][1](1, 2, ...a, "string");
