class Global {
    constructor(value) {
        this.value = value;
    }
}

out.Global = Global;
out.global = new Global(1, 2, 3);

function constructUnknown(Global) {
    return new Global(1, 2, 3);
}

out.constructUnknown = constructUnknown;

function constructLocal() {
    class Global {
        constructor(first, second) {
            this.first = first;
            this.second = second;
        }
    }

    out.Local = Global;
    return new Global(1, 2, 3, 4);
}

out.constructLocal = constructLocal;

class MutableClass {}

if (condition) {
    MutableClass = ExternalClass;
}

out.MutableClass = MutableClass;
out.mutableClass = new MutableClass(1, 2, 3);

function MutableFunction() {}

if (condition) {
    MutableFunction = ExternalFunction;
}

out.MutableFunction = MutableFunction;
out.mutableFunction = new MutableFunction(1, 2, 3);

var DifferentArity = function (value) {
    this.value = value;
};

if (condition) {
    DifferentArity = function (first, second) {
        this.first = first;
        this.second = second;
    };
}

out.DifferentArity = DifferentArity;
out.differentArity = new DifferentArity(1, 2, 3);

var SameArity = function (value) {
    this.value = value;
};

if (condition) {
    SameArity = class {
        constructor(value) {
            this.value = value;
        }
    };
}

out.SameArity = SameArity;
out.sameArity = new SameArity(1, 2, 3);

function constructAfterEval() {
    class EvalMutable {}

    eval("EvalMutable = ExternalClass");
    return new EvalMutable(1, 2, 3);
}

out.constructAfterEval = constructAfterEval;
