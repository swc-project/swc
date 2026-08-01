out.fnArguments = new function() {
    this.count = arguments.length;
}(1, 2, 3), out.fnLexicalArguments = new function() {
    this.count = arguments.length;
}(1, 2, 3), out.fnDefaultArguments = new function(value = arguments[1]) {
    this.value = value;
}(void 0, "fallback", "extra"), out.fnEval = new function() {
    eval("this.count = arguments.length");
}(1, 2, 3), out.fnRest = new function(...values1) {
    this.count = values1.length;
}(1, 2, 3), out.fnSpread = new function() {
    this.kind = "spread";
}(...values, 1), out.classArguments = new class {
    constructor(){
        this.count = arguments.length;
    }
}(1, 2, 3), out.classLexicalArguments = new class {
    constructor(){
        this.count = arguments.length;
    }
}(1, 2, 3), out.classDefaultArguments = new class {
    constructor(value = arguments[1]){
        this.value = value;
    }
}(void 0, "fallback", "extra"), out.classEval = new class {
    constructor(){
        eval("this.count = arguments.length");
    }
}(1, 2, 3), out.classRest = new class {
    constructor(...values1){
        this.count = values1.length;
    }
}(1, 2, 3), out.classSpread = new class {
    constructor(){
        this.kind = "spread";
    }
}(...values, 1), out.defaultClass = new class {
}(1, 2, 3), out.defaultDerivedClass = new class extends Base {
}(1, 2, 3), out.unknown = new Constructor(1, 2, 3);
