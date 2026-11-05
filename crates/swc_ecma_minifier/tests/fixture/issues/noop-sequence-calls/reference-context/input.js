globalThis.sequenceScope = "global";

(() => {
    function noop() {}
    const object = {
        value: "bound",
        method() {
            "use strict";
            return this === undefined ? "unbound" : this.value;
        },
    };

    function call() {
        return (noop(), object.method)();
    }

    function optionalCall() {
        return (noop(), object.method)?.();
    }

    function taggedTemplate() {
        return (noop(), object.method)``;
    }

    function indirectEval() {
        const sequenceScope = "local";
        return (noop(), eval)("sequenceScope");
    }

    function deleteValue() {
        const target = { value: 1 };
        return [delete (noop(), target.value), target.value];
    }

    function typeofMissing() {
        try {
            return typeof (noop(), missingSequenceValue);
        } catch (error) {
            return error.name;
        }
    }

    globalThis.sequenceReferences = {
        call,
        optionalCall,
        taggedTemplate,
        indirectEval,
        deleteValue,
        typeofMissing,
    };
})();

console.log(globalThis.sequenceReferences.call());
console.log(globalThis.sequenceReferences.optionalCall());
console.log(globalThis.sequenceReferences.taggedTemplate());
console.log(globalThis.sequenceReferences.indirectEval());
console.log(JSON.stringify(globalThis.sequenceReferences.deleteValue()));
console.log(globalThis.sequenceReferences.typeofMissing());
