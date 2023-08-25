//// [newWithSpreadES6.ts]
var a, b, c, d, e, g, h, i;
function f(x, y, ...z) {}
class B {
    constructor(x, y, ...z){}
}
// Basic expression
new f(1, 2, "string"), new f(1, 2, ...a), new f(1, 2, ...a, "string"), // Multiple spreads arguments
new function(...x) {}(...a, ...a), new f(1, 2, ...a, ...a), // Call expression
new f(1, 2, "string")(), new f(1, 2, ...a)(), new f(1, 2, ...a, "string")(), // Property access expression
new b.f(1, 2, "string"), new b.f(1, 2, ...a), new b.f(1, 2, ...a, "string"), // Parenthesised expression
new b.f(1, 2, "string"), new b.f(1, 2, ...a), new b.f(1, 2, ...a, "string"), // Element access expression
new d[1].f(1, 2, "string"), new d[1].f(1, 2, ...a), new d[1].f(1, 2, ...a, "string"), // Element access expression with a punctuated key
new e["a-b"].f(1, 2, "string"), new e["a-b"].f(1, 2, ...a), new e["a-b"].f(1, 2, ...a, "string"), // Basic expression
new B(1, 2, "string"), new B(1, 2, ...a), new B(1, 2, ...a, "string"), // Property access expression
new c["a-b"](1, 2, "string"), new c["a-b"](1, 2, ...a), new c["a-b"](1, 2, ...a, "string"), // Parenthesised expression
new c["a-b"](1, 2, "string"), new c["a-b"](1, 2, ...a), new c["a-b"](1, 2, ...a, "string"), // Element access expression
new g[1]["a-b"](1, 2, "string"), new g[1]["a-b"](1, 2, ...a), new g[1]["a-b"](1, 2, ...a, "string"), // Element access expression with a punctuated key
new h["a-b"]["a-b"](1, 2, "string"), new h["a-b"]["a-b"](1, 2, ...a), new h["a-b"]["a-b"](1, 2, ...a, "string"), // Element access expression with a number
new i["a-b"][1](1, 2, "string"), new i["a-b"][1](1, 2, ...a), new i["a-b"][1](1, 2, ...a, "string");
