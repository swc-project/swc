const FunctionBinding = function (value) {
    this.value = value;
};

out.FunctionBinding = FunctionBinding;
out.functionBinding = new FunctionBinding(1, 2, 3);

let ClassBinding = class {
    constructor(value) {
        this.value = value;
    }
};

out.ClassBinding = ClassBinding;
out.classBinding = new ClassBinding(1, 2, 3);

let AssignedFunction;
AssignedFunction = function (first, second) {
    this.first = first;
    this.second = second;
};

out.AssignedFunction = AssignedFunction;
out.assignedFunction = new AssignedFunction(1, 2, 3, 4);

let AssignedClass;
AssignedClass = class {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
};

out.AssignedClass = AssignedClass;
out.assignedClass = new AssignedClass(1, 2, 3, 4);
