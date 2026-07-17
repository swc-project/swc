class Global {
    constructor(value){
        this.value = value;
    }
}
function constructUnknown(Global) {
    return new Global(1, 2, 3);
}
function constructLocal() {
    class Global {
        constructor(first, second){
            this.first = first, this.second = second;
        }
    }
    return out.Local = Global, new Global(1, 2);
}
out.Global = Global, out.global = new Global(1), out.constructUnknown = constructUnknown, out.constructLocal = constructLocal;
class MutableClass {
}
function MutableFunction() {}
condition && (MutableClass = ExternalClass), out.MutableClass = MutableClass, out.mutableClass = new MutableClass(1, 2, 3), condition && (MutableFunction = ExternalFunction), out.MutableFunction = MutableFunction, out.mutableFunction = new MutableFunction(1, 2, 3);
var DifferentArity = function(value) {
    this.value = value;
};
condition && (DifferentArity = function(first, second) {
    this.first = first, this.second = second;
}), out.DifferentArity = DifferentArity, out.differentArity = new DifferentArity(1, 2, 3);
var SameArity = function(value) {
    this.value = value;
};
function constructAfterEval() {
    class EvalMutable {
    }
    return eval("EvalMutable = ExternalClass"), new EvalMutable(1, 2, 3);
}
condition && (SameArity = class {
    constructor(value){
        this.value = value;
    }
}), out.SameArity = SameArity, out.sameArity = new SameArity(1), out.constructAfterEval = constructAfterEval;
