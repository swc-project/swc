(() => {
    const log = [];
    const foo = (n) => {
        log.push(n);
        return () => { };
    };
    const computed = {
        get method() { log.push(log.length); return Symbol('method'); },
        get field() { log.push(log.length); return Symbol('field'); },
        get getter() { log.push(log.length); return Symbol('getter'); },
        get setter() { log.push(log.length); return Symbol('setter'); },
        get accessor() { log.push(log.length); return Symbol('accessor'); },
    };
    @foo(0)
    class Foo extends (foo(1), Object) {
        @foo(2)
        [computed.method]() { }
        @foo(4)
        static [computed.method]() { }
        @foo(6)
        [computed.field];
        @foo(8)
        static [computed.field];
        @foo(10)
        get [computed.getter]() { return; }
        @foo(12)
        static get [computed.getter]() { return; }
        @foo(14)
        set [computed.setter](x) { }
        @foo(16)
        static set [computed.setter](x) { }
        @foo(18)
        accessor [computed.accessor];
        @foo(20)
        static accessor [computed.accessor];
    }
    assertEq(() => '' + log, '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21');
})();
