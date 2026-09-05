namespace Foo {
    export var a;
    var b;
}

var a, b, c;

namespace Foo {
    var b;
    foo(a);
    foo(b);
    foo(c);
}
