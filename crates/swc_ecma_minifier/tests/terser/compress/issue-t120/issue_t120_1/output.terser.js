function foo(node) {
    for (var i; (i = void 0), (i = node.data) && i.a != i.b; ) node = node.data;
    return node;
}
var x = { a: 1, b: 2, data: { a: "hello" } };
console.log(foo(x).a, foo({ a: "world" }).a);
