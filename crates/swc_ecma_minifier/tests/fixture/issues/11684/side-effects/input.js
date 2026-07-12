out.fn = new (function (value) {
    this.value = value;
})(effect("used"), 1, effect("fn-a"), 2, effect("fn-b"));

out.class = new (class {
    constructor(value) {
        this.value = value;
    }
})(effect("used"), 1, effect("class-a"), 2, effect("class-b"));

out.sequence = new (function () {
    this.kind = "sequence";
})(1, (2, effect("sequence")), 3);

out.conditional = new (class {
    constructor() {
        this.kind = "conditional";
    }
})(1, condition ? effect("yes") : 2, 3);
