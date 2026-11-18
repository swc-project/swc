function FunctionCtor(value) {
    this.value = value;
}

out.FunctionCtor = FunctionCtor;
out.functionCtor = new FunctionCtor(
    effect("function-used"),
    1,
    effect("function-extra-a"),
    2,
    effect("function-extra-b")
);

class ClassCtor {
    constructor(value) {
        this.value = value;
    }
}

out.ClassCtor = ClassCtor;
out.classCtor = new ClassCtor(
    effect("class-used"),
    1,
    effect("class-extra-a"),
    2,
    effect("class-extra-b")
);

function Zero() {
    this.kind = "zero";
}

out.Zero = Zero;
out.sequence = new Zero(1, (2, effect("sequence")), 3);
out.conditional = new Zero(1, condition ? effect("yes") : 2, 3);
