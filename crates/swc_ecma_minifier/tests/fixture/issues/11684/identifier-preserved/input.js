function FunctionArguments() {
    this.count = arguments.length;
}

out.FunctionArguments = FunctionArguments;
out.functionArguments = new FunctionArguments(1, 2, 3);

function FunctionLexicalArguments() {
    this.count = (() => arguments.length)();
}

out.FunctionLexicalArguments = FunctionLexicalArguments;
out.functionLexicalArguments = new FunctionLexicalArguments(1, 2, 3);

function FunctionDefaultArguments(value = arguments[1]) {
    this.value = value;
}

out.FunctionDefaultArguments = FunctionDefaultArguments;
out.functionDefaultArguments = new FunctionDefaultArguments(undefined, "fallback", "extra");

function FunctionEval() {
    eval("this.count = arguments.length");
}

out.FunctionEval = FunctionEval;
out.functionEval = new FunctionEval(1, 2, 3);

function FunctionRest(...values) {
    this.count = values.length;
}

out.FunctionRest = FunctionRest;
out.functionRest = new FunctionRest(1, 2, 3);

function FunctionSpread(value) {
    this.value = value;
}

out.FunctionSpread = FunctionSpread;
out.functionSpread = new FunctionSpread(...values, 1);

class ClassArguments {
    constructor() {
        this.count = arguments.length;
    }
}

out.ClassArguments = ClassArguments;
out.classArguments = new ClassArguments(1, 2, 3);

class ClassLexicalArguments {
    constructor() {
        this.count = (() => arguments.length)();
    }
}

out.ClassLexicalArguments = ClassLexicalArguments;
out.classLexicalArguments = new ClassLexicalArguments(1, 2, 3);

class ClassDefaultArguments {
    constructor(value = arguments[1]) {
        this.value = value;
    }
}

out.ClassDefaultArguments = ClassDefaultArguments;
out.classDefaultArguments = new ClassDefaultArguments(undefined, "fallback", "extra");

class ClassEval {
    constructor() {
        eval("this.count = arguments.length");
    }
}

out.ClassEval = ClassEval;
out.classEval = new ClassEval(1, 2, 3);

class ClassRest {
    constructor(...values) {
        this.count = values.length;
    }
}

out.ClassRest = ClassRest;
out.classRest = new ClassRest(1, 2, 3);

class ClassSpread {
    constructor(value) {
        this.value = value;
    }
}

out.ClassSpread = ClassSpread;
out.classSpread = new ClassSpread(...values, 1);
