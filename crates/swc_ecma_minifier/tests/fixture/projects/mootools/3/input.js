function foo() {
    this.$chk = function (obj) {
        return !!(obj || obj === 0);
    };
}
