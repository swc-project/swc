const annotated: string = "s";
const asserted = "s" as string;
const constAsserted = "s" as const;
let mutable = "s";
var hoisted = "s";
const { destructured } = { destructured: "s" };
const poisoned = "s";

enum TypeAnnotation {
    A = annotated,
    B = "b",
}

enum TypeAssertion {
    A = asserted,
    B = constAsserted,
}

enum NotConstBinding {
    A = mutable,
    B = hoisted,
    C = destructured,
}

enum AssertionOnReference {
    A = poisoned as string,
    B = "b",
}

enum ForwardReference {
    A = declaredLater,
    B = "b",
}

const declaredLater = "s";
