out.fn = new (function () {
    this.kind = "function";
})(1, 2, 3);

out.class = new (class {
    constructor() {
        this.kind = "class";
    }
})(1, 2, 3);
