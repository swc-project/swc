function FunctionCtor(value) {
    this.value = value;
}
out.FunctionCtor = FunctionCtor, out.functionCtor = new FunctionCtor(effect("function-used"), effect("function-extra-a"), effect("function-extra-b"));
class ClassCtor {
    constructor(value){
        this.value = value;
    }
}
function Zero() {
    this.kind = "zero";
}
out.ClassCtor = ClassCtor, out.classCtor = new ClassCtor(effect("class-used"), effect("class-extra-a"), effect("class-extra-b")), out.Zero = Zero, out.sequence = new Zero(effect("sequence")), out.conditional = new Zero(condition && effect("yes"));
