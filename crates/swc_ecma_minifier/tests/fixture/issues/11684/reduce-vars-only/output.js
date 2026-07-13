out.fn = new function() {
    this.kind = "function";
}();
out.class = new class {
    constructor(){
        this.kind = "class";
    }
}();
