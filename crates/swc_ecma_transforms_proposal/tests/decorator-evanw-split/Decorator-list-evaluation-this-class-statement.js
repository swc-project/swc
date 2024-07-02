(() => {
    const log = [];
    const dummy = () => { };
    const ctx = {
        foo(n) {
            log.push(n);
        }
    };
    function wrapper() {
        @(assertEq(() => this.foo(0), undefined), dummy)
        class Foo extends (assertEq(() => this.foo(1), undefined), Object) {
            @(assertEq(() => this.foo(2), undefined), dummy)
            method() { }
            @(assertEq(() => this.foo(3), undefined), dummy)
            static method() { }
            @(assertEq(() => this.foo(4), undefined), dummy)
            field;
            @(assertEq(() => this.foo(5), undefined), dummy)
            static field;
            @(assertEq(() => this.foo(6), undefined), dummy)
            get getter() { return; }
            @(assertEq(() => this.foo(7), undefined), dummy)
            static get getter() { return; }
            @(assertEq(() => this.foo(8), undefined), dummy)
            set setter(x) { }
            @(assertEq(() => this.foo(9), undefined), dummy)
            static set setter(x) { }
            @(assertEq(() => this.foo(10), undefined), dummy)
            accessor accessor;
            @(assertEq(() => this.foo(11), undefined), dummy)
            static accessor accessor;
        }
    }
    wrapper.call(ctx);
    assertEq(() => '' + log, '0,1,2,3,4,5,6,7,8,9,10,11');
})();
