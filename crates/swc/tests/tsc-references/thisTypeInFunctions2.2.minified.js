//// [thisTypeInFunctions2.ts]
extend1({
    init: function() {
        this.willDestroy;
    },
    mine: 12,
    foo: function() {
        this.url, this.willDestroy;
    }
}), extend2({
    init: function() {
        this.mine;
    },
    mine: 13,
    foo: function() {
        this.mine;
    }
}), simple({
    foo: function(n) {
        return n.length + this.bar();
    },
    bar: function() {
        return 14;
    }
});
