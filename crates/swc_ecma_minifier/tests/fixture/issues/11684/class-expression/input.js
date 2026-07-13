out.zero = new (class {
    constructor() {
        this.kind = "zero";
    }
})(1, 2);

out.one = new (class {
    constructor(value) {
        this.value = value;
    }
})(1, 2, 3);

out.destructured = new (class {
    constructor({ value }) {
        this.value = value;
    }
})({ value: 1 }, 2, 3);

out.derived = new (class extends Base {
    constructor(value) {
        super(value);
    }
})(1, 2, 3);
