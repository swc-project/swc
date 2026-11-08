//// [newWithSpreadES6.ts]
function f(x, y) {}
class B {
    constructor(x, y, ...z){}
}
new f(1, 2), new f(1, 2, ...void 0), new f(1, 2, ...void 0, "string"), [
    ...void 0,
    ...void 0
], new f(1, 2, ...void 0, ...void 0), new f(1, 2)(), new f(1, 2, ...void 0)(), new f(1, 2, ...void 0, "string")(), new (void 0).f(1, 2, "string"), new (void 0).f(1, 2, ...void 0), new (void 0).f(1, 2, ...void 0, "string"), new (void 0).f(1, 2, "string"), new (void 0).f(1, 2, ...void 0), new (void 0).f(1, 2, ...void 0, "string"), new (void 0)[1].f(1, 2, "string"), new (void 0)[1].f(1, 2, ...void 0), new (void 0)[1].f(1, 2, ...void 0, "string"), new (void 0)["a-b"].f(1, 2, "string"), new (void 0)["a-b"].f(1, 2, ...void 0), new (void 0)["a-b"].f(1, 2, ...void 0, "string"), new B(1, 2, "string"), new B(1, 2, ...void 0), new B(1, 2, ...void 0, "string"), new (void 0)["a-b"](1, 2, "string"), new (void 0)["a-b"](1, 2, ...void 0), new (void 0)["a-b"](1, 2, ...void 0, "string"), new (void 0)["a-b"](1, 2, "string"), new (void 0)["a-b"](1, 2, ...void 0), new (void 0)["a-b"](1, 2, ...void 0, "string"), new (void 0)[1]["a-b"](1, 2, "string"), new (void 0)[1]["a-b"](1, 2, ...void 0), new (void 0)[1]["a-b"](1, 2, ...void 0, "string"), new (void 0)["a-b"]["a-b"](1, 2, "string"), new (void 0)["a-b"]["a-b"](1, 2, ...void 0), new (void 0)["a-b"]["a-b"](1, 2, ...void 0, "string"), new (void 0)["a-b"][1](1, 2, "string"), new (void 0)["a-b"][1](1, 2, ...void 0), new (void 0)["a-b"][1](1, 2, ...void 0, "string");
