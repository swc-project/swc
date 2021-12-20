var result;
var result2;
if (!(result instanceof RegExp)) {
    result = result2;
} else if (!result.global) {
}
class C {
    validate() {
        return {
        };
    }
}
function foo() {
    let v = null;
    if (v instanceof C) {
        v // Validator & Partial<OnChanges> & C
        ;
    }
    v // Validator & Partial<OnChanges> via subtype reduction
    ;
    if (v.onChanges) {
        v.onChanges({
        });
    }
}
