extend1({
    init: function() {
        this // this: IndexedWithThis because of contextual typing.
        ;
        // this.mine
        this.willDestroy;
    },
    mine: 12,
    foo: function() {
        this.url; // this: any because 'foo' matches the string indexer
        this.willDestroy;
    }
});
extend2({
    init: function() {
        this // this: IndexedWithoutThis because of contextual typing
        ;
        this.mine;
    },
    mine: 13,
    foo: function() {
        this // this: IndexedWithoutThis because of contextual typing
        ;
        this.mine;
    }
});
simple({
    foo: function(n) {
        return n.length + this.bar();
    },
    bar: function() {
        return 14;
    }
});
