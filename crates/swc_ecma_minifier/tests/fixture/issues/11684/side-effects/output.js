out.fn = new function(value) {
    this.value = value;
}(effect("used"), effect("fn-a"), effect("fn-b")), out.class = new class {
    constructor(value){
        this.value = value;
    }
}(effect("used"), effect("class-a"), effect("class-b")), out.sequence = new function() {
    this.kind = "sequence";
}(effect("sequence")), out.conditional = new class {
    constructor(){
        this.kind = "conditional";
    }
}(condition && effect("yes"));
