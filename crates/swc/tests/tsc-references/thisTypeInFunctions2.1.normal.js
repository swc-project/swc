//// [thisTypeInFunctions2.ts]
extend1({
    init: function init() {
        this // this: IndexedWithThis because of contextual typing.
        ;
        // this.mine
        this.willDestroy;
    },
    mine: 12,
    foo: function foo() {
        this.url; // this: any because 'foo' matches the string indexer
        this.willDestroy;
    }
});
extend2({
    init: function init() {
        this // this: IndexedWithoutThis because of contextual typing
        ;
        this.mine;
    },
    mine: 13,
    foo: function foo() {
        this // this: IndexedWithoutThis because of contextual typing
        ;
        this.mine;
    }
});
simple({
    foo: function foo(n) {
        return n.length + this.bar();
    },
    bar: function bar() {
        return 14;
    }
});
