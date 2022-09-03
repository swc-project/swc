//// [b.js]
var a = 10;
this.a, this.b, globalThis.a, globalThis.b, self.a, self.b, window.a, window.b, top.a, top.b;
//// [actual.ts]
var b = 10;
this.a, this.b, globalThis.a, globalThis.b, self.a, self.b, window.a, window.b, top.a, top.b;
