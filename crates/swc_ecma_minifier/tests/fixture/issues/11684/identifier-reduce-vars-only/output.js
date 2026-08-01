function FunctionCtor(value) {
    this.value = value;
}
out.FunctionCtor = FunctionCtor;
out.functionCtor = new FunctionCtor(1);
class ClassCtor {
    constructor(value){
        this.value = value;
    }
}
out.ClassCtor = ClassCtor;
out.classCtor = new ClassCtor(1);
