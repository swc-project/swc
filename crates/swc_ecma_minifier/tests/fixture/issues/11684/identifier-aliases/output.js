function FunctionTarget(value) {
    this.value = value;
}
var FunctionAlias = FunctionTarget;
out.FunctionAlias = FunctionAlias;
out.functionAlias = new FunctionAlias(1, 2, 3);
class ClassTarget {
    constructor(value){
        this.value = value;
    }
}
var ClassAlias = ClassTarget;
out.ClassAlias = ClassAlias;
out.classAlias = new ClassAlias(1, 2, 3);
var { DestructuredCtor } = constructors;
out.DestructuredCtor = DestructuredCtor;
out.destructured = new DestructuredCtor(1, 2, 3);
