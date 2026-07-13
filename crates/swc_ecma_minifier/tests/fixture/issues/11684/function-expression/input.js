out.zero = new (function () {
    this.kind = "zero";
})(1, 2);

out.one = new (function (value) {
    this.value = value;
})(1, 2, 3);

out.destructured = new (function ({ value }) {
    this.value = value;
})({ value: 1 }, 2, 3);
