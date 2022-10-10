//// [callWithSpreadES6.ts]
var a, obj, xa;
obj.foo(1, 2, "abc"), obj.foo(1, 2, ...a), obj.foo(1, 2, ...a, "abc"), obj.foo(1, 2, "abc"), obj.foo(1, 2, ...a), obj.foo(1, 2, ...a, "abc"), xa[1].foo(1, 2, "abc"), xa[1].foo(1, 2, ...a), xa[1].foo(1, 2, ...a, "abc"), xa[1].foo(...[
    1,
    2,
    "abc"
]);
