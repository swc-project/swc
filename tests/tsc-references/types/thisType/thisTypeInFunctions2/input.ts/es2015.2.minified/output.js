extend1({
    init () {
        this.willDestroy;
    },
    mine: 12,
    foo () {
        this.url, this.willDestroy;
    }
}), extend2({
    init () {
        this.mine;
    },
    mine: 13,
    foo () {
        this.mine;
    }
}), simple({
    foo (n) {
        return n.length + this.bar();
    },
    bar () {
        return 14;
    }
});
