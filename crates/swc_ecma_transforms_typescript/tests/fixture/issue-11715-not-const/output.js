const annotated = "s";
const asserted = "s";
const constAsserted = "s";
let mutable = "s";
var hoisted = "s";
const { destructured } = {
    destructured: "s"
};
const poisoned = "s";
var TypeAnnotation = function(TypeAnnotation) {
    TypeAnnotation[TypeAnnotation["A"] = annotated] = "A";
    TypeAnnotation["B"] = "b";
    return TypeAnnotation;
}(TypeAnnotation || {});
var TypeAssertion = function(TypeAssertion) {
    TypeAssertion[TypeAssertion["A"] = asserted] = "A";
    TypeAssertion[TypeAssertion["B"] = constAsserted] = "B";
    return TypeAssertion;
}(TypeAssertion || {});
var NotConstBinding = function(NotConstBinding) {
    NotConstBinding[NotConstBinding["A"] = mutable] = "A";
    NotConstBinding[NotConstBinding["B"] = hoisted] = "B";
    NotConstBinding[NotConstBinding["C"] = destructured] = "C";
    return NotConstBinding;
}(NotConstBinding || {});
var AssertionOnReference = function(AssertionOnReference) {
    AssertionOnReference[AssertionOnReference["A"] = poisoned] = "A";
    AssertionOnReference["B"] = "b";
    return AssertionOnReference;
}(AssertionOnReference || {});
var ForwardReference = function(ForwardReference) {
    ForwardReference[ForwardReference["A"] = declaredLater] = "A";
    ForwardReference["B"] = "b";
    return ForwardReference;
}(ForwardReference || {});
const declaredLater = "s";
