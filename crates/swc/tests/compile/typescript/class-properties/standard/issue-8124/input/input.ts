namespace Foo {
    export var a = 1;
    for (var a; a < 5; a++) { }
}

namespace Bar {
    export var b = 2;
    var b = 3;
}