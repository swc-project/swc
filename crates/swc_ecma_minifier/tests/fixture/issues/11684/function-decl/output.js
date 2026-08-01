function Zero() {
    this.kind = "zero";
}
function One(value) {
    this.value = value;
}
function Destructured({ value }, other) {
    this.value = value, this.other = other;
}
function Default(value = 1, other) {
    this.value = value, this.other = other;
}
out.Zero = Zero, out.zero = new Zero(), out.One = One, out.one = new One(1), out.Destructured = Destructured, out.destructured = new Destructured({
    value: 1
}, 2), out.Default = Default, out.default = new Default(void 0, 2);
