// @strictNullChecks: true
var result;
var result2;
if (!(result instanceof RegExp)) {
    result = result2;
} else if (!result.global) {}
class C {
    validate() {
        return {};
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
    // In 4.1, we introduced a change which _fixed_ a bug with CFA
    // correctly setting this to be the right object. With 4.2,
    // we reverted that fix in #42231 which brought behavior back to
    // before 4.1.
    if (v.onChanges) {
        v.onChanges({});
    }
}
