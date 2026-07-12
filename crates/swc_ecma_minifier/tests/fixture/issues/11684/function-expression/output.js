out.zero = new function() {
    this.kind = "zero";
}(), out.one = new function(value) {
    this.value = value;
}(1), out.destructured = new function({ value }) {
    this.value = value;
}({
    value: 1
});
