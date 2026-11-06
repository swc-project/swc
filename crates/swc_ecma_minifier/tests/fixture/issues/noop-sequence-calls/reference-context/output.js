function noop() {}
const object = {
    method () {
        "use strict";
        console.log(void 0 === this);
    }
};
function indirectEval(sequenceScope) {
    return (noop(), eval)("sequenceScope");
}
(0, object.method)(), (0, object.method)?.(), (0, object.method)``, globalThis.sequenceScope = "global", console.log(indirectEval("local"));
const target = {
    value: 1
};
console.log(delete (0, target.value), target.value);
try {
    console.log(typeof (noop(), missingSequenceValue));
} catch (error) {
    console.log(error.name);
}
