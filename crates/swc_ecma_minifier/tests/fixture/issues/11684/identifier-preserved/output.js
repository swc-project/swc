function FunctionArguments() {
    this.count = arguments.length;
}
function FunctionLexicalArguments() {
    this.count = arguments.length;
}
function FunctionDefaultArguments(value = arguments[1]) {
    this.value = value;
}
function FunctionEval() {
    eval("this.count = arguments.length");
}
function FunctionRest(...values1) {
    this.count = values1.length;
}
function FunctionSpread(value) {
    this.value = value;
}
out.FunctionArguments = FunctionArguments, out.functionArguments = new FunctionArguments(1, 2, 3), out.FunctionLexicalArguments = FunctionLexicalArguments, out.functionLexicalArguments = new FunctionLexicalArguments(1, 2, 3), out.FunctionDefaultArguments = FunctionDefaultArguments, out.functionDefaultArguments = new FunctionDefaultArguments(void 0, "fallback", "extra"), out.FunctionEval = FunctionEval, out.functionEval = new FunctionEval(1, 2, 3), out.FunctionRest = FunctionRest, out.functionRest = new FunctionRest(1, 2, 3), out.FunctionSpread = FunctionSpread, out.functionSpread = new FunctionSpread(...values, 1);
class ClassArguments {
    constructor(){
        this.count = arguments.length;
    }
}
out.ClassArguments = ClassArguments, out.classArguments = new ClassArguments(1, 2, 3);
class ClassLexicalArguments {
    constructor(){
        this.count = arguments.length;
    }
}
out.ClassLexicalArguments = ClassLexicalArguments, out.classLexicalArguments = new ClassLexicalArguments(1, 2, 3);
class ClassDefaultArguments {
    constructor(value = arguments[1]){
        this.value = value;
    }
}
out.ClassDefaultArguments = ClassDefaultArguments, out.classDefaultArguments = new ClassDefaultArguments(void 0, "fallback", "extra");
class ClassEval {
    constructor(){
        eval("this.count = arguments.length");
    }
}
out.ClassEval = ClassEval, out.classEval = new ClassEval(1, 2, 3);
class ClassRest {
    constructor(...values1){
        this.count = values1.length;
    }
}
out.ClassRest = ClassRest, out.classRest = new ClassRest(1, 2, 3);
class ClassSpread {
    constructor(value){
        this.value = value;
    }
}
out.ClassSpread = ClassSpread, out.classSpread = new ClassSpread(...values, 1);
