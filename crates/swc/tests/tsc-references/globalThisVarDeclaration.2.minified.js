//// [b.js]
this.a, this.b, // DOM access is not supported until the index signature is handled more strictly
self.a, self.b, window.a, window.b, top.a, top.b;
//// [actual.ts]
this.a, this.b, // same here -- no DOM access to globalThis yet
self.a, self.b, window.a, window.b, top.a, top.b;
