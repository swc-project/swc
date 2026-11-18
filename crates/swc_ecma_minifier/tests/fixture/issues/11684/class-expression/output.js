out.zero = new class {
    constructor(){
        this.kind = "zero";
    }
}(), out.one = new class {
    constructor(value){
        this.value = value;
    }
}(1), out.destructured = new class {
    constructor({ value }){
        this.value = value;
    }
}({
    value: 1
}), out.derived = new class extends Base {
    constructor(value){
        super(value);
    }
}(1);
