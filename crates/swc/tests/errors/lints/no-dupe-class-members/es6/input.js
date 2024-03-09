() => {
    class A {
        foo() {}
        foo() {}
    }
};

() => {
    !class A { foo() {} foo() {} };
};

() => {
    class A { 'foo'() {} 'foo'() {} }
};

() => {
    class A { 10() {} 1e1() {} }
};

() => {
    class A { ['foo']() {} ['foo']() {} }
};


() => {
    class A { static ['foo']() {} static foo() {} }
};


() => {
    class A {
        set foo(value) {}
        set ['foo'](val) {}
    }
}

() => {
    class A { ''() {} ['']() {} }
};

() => {
    class A { [`foo`]() {} [`foo`]() {} }
};

() => {
    class A { static get [`foo`]() {} static get ['foo']() {} }
}

() => {
    class A { foo() {} [`foo`]() {} }
}

() => {
    class A { get [`foo`]() {} 'foo'() {} }
}

() => {
    class A { static 'foo'() {} static [`foo`]() {} }
}

() => {
    class A { ['constructor']() {} ['constructor']() {} }
}

() => {
    class A { [123]() {} [123]() {} }
}

() => {
    class A { [0x10]() {} 16() {} }
}

() => {
    class A { [123.00]() {} [`123`]() {} }
};

() => {
    class A { [null]() {} 'null'() {} }
}

() => {
    class A { foo() {} foo() {} foo() {} }
}

() => {
    class A { static foo() {} static foo() {} }
}

() => {
    class A { foo() {} get foo() {} }
}

() => {
    class A { set foo(value) {} foo() {} }
}

() => {
    class A { foo; foo; }
}

() => {
    class A { #priv() {} #priv() {} }
}

() => {
    class A { #priv; #priv() {} }
}

// Valid

() => {
    class A { foo() {} bar() {} }
}

() => {
    class A { static foo() {} foo() {} }
}

() => {
    class A { get foo() {} set foo(value) {} }
}

() => {
    class A { static foo() {} get foo() {} set foo(value) {} }
}

() => {
    class A { foo() { } }
    class B { foo() { } }
}

() => {
    class A { [foo]() {} foo() {} }
}

() => {
    class A { 'foo'() {} 'bar'() {} baz() {} }
}

() => {
    class A { *'foo'() {} *'bar'() {} *baz() {} }
}

() => {
    class A { get 'foo'() {} get 'bar'() {} get baz() {} }
}

() => {
    class A { 1() {} 2() {} }
}

() => {
    class A { ['foo']() {} ['bar']() {} }
}

() => {
    class A { [`foo`]() {} [`bar`]() {} }
}

() => {
    class A { [12]() {} [123]() {} }
}

() => {
    class A { [1.0]() {} ['1.0']() {} }
}

() => {
    class A { [0x1]() {} [`0x1`]() {} }
}

() => {
    class A { [null]() {} ['']() {} }
}

() => {
    class A { get ['foo']() {} set ['foo'](value) {} }
}

() => {
    class A { ['foo']() {} static ['foo']() {} }
}

() => {
    class A { ['constructor']() {} constructor() {} }
}

() => {
    class A { 'constructor'() {} [`constructor`]() {} }
}

() => {
    class A { foo; static foo; }
}

() => {
    class A { foo; #foo; }
}

() => {
    class A { '#foo'; #foo; }
}
