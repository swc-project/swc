globalThis.sequenceScope = "global", (()=>{
    function noop() {}
    let object = {
        value: "bound",
        method () {
            "use strict";
            return void 0 === this ? "unbound" : this.value;
        }
    };
    globalThis.sequenceReferences = {
        call: function() {
            return (0, object.method)();
        },
        optionalCall: function() {
            return (0, object.method)?.();
        },
        taggedTemplate: function() {
            return (0, object.method)``;
        },
        indirectEval: function() {
            return (noop(), eval)("sequenceScope");
        },
        deleteValue: function() {
            return [
                !0,
                1
            ];
        },
        typeofMissing: function() {
            try {
                return typeof (noop(), missingSequenceValue);
            } catch (error) {
                return error.name;
            }
        }
    };
})(), console.log(globalThis.sequenceReferences.call()), console.log(globalThis.sequenceReferences.optionalCall()), console.log(globalThis.sequenceReferences.taggedTemplate()), console.log(globalThis.sequenceReferences.indirectEval()), console.log(JSON.stringify(globalThis.sequenceReferences.deleteValue())), console.log(globalThis.sequenceReferences.typeofMissing());
