class ExplicitDerived extends Base {
    constructor(value) {
        super(value);
    }
}

out.ExplicitDerived = ExplicitDerived;
out.explicitDerived = new ExplicitDerived(1, 2, 3);

class NestedFunctionArguments {
    constructor(value) {
        function count() {
            return arguments.length;
        }

        this.value = value;
        this.count = count(1, 2, 3);
    }
}

out.NestedFunctionArguments = NestedFunctionArguments;
out.nestedFunctionArguments = new NestedFunctionArguments(1, 2, 3);

class MethodArguments {
    constructor(value) {
        this.value = value;
    }

    count() {
        return arguments.length;
    }
}

out.MethodArguments = MethodArguments;
out.methodArguments = new MethodArguments(1, 2, 3);

class StructuredParameters {
    constructor({ value }, other = 2) {
        this.value = value;
        this.other = other;
    }
}

out.StructuredParameters = StructuredParameters;
out.structuredParameters = new StructuredParameters({ value: 1 }, undefined, 3, 4);
