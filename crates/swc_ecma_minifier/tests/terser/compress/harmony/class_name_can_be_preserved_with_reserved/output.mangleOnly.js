function a() {
    class a {
    }
    a.bar;
    class b {
    }
    b.foo;
}
function b() {
    var a = class a {
    };
    a.bar;
    var b = class a {
    };
    b.bar;
}
