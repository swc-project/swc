var i, a, c = new class {
    foo(x) {
        return x;
    }
}();
c = i, i = c = a, i = a, a = c, a = i, c.foo("hi"), c.foo("bye"), c.foo("hm");
