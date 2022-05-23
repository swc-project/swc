function foo() {
    this.$chk = function(obj) {
        return !!(obj || 0 === obj);
    };
}
