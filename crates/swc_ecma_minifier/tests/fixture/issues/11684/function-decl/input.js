function Zero() {
    this.kind = "zero";
}

out.Zero = Zero;
out.zero = new Zero(1, 2, 3);

function One(value) {
    this.value = value;
}

out.One = One;
out.one = new One(1, 2, 3);

function Destructured({ value }, other) {
    this.value = value;
    this.other = other;
}

out.Destructured = Destructured;
out.destructured = new Destructured({ value: 1 }, 2, 3, 4);

function Default(value = 1, other) {
    this.value = value;
    this.other = other;
}

out.Default = Default;
out.default = new Default(undefined, 2, 3, 4);
