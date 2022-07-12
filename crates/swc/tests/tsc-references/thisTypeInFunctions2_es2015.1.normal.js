// @noImplicitAny: true
// @noImplicitThis: true
extend1({
    init () {
        this // this: IndexedWithThis because of contextual typing.
        ;
        // this.mine
        this.willDestroy;
    },
    mine: 12,
    foo () {
        this.url; // this: any because 'foo' matches the string indexer
        this.willDestroy;
    }
});
extend2({
    init () {
        this // this: IndexedWithoutThis because of contextual typing
        ;
        this.mine;
    },
    mine: 13,
    foo () {
        this // this: IndexedWithoutThis because of contextual typing
        ;
        this.mine;
    }
});
simple({
    foo (n) {
        return n.length + this.bar();
    },
    bar () {
        return 14;
    }
});
