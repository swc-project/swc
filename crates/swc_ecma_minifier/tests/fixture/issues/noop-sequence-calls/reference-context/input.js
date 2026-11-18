function noop() {}
const object = {
    method() {
        "use strict";
        console.log(this === undefined);
    },
};
(noop(), object.method)();
(noop(), object.method)?.();
(noop(), object.method)``;

globalThis.sequenceScope = "global";
function indirectEval(sequenceScope) {
    return (noop(), eval)("sequenceScope");
}
console.log(indirectEval("local"));
const target = { value: 1 };
console.log(delete (noop(), target.value), target.value);
try {
    console.log(typeof (noop(), missingSequenceValue));
} catch (error) {
    console.log(error.name);
}
