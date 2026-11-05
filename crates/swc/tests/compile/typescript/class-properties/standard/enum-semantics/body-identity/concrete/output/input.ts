import { value } from "dependency";
(function(Merged) {
    (function(Nested) {
        Nested.result = value;
    })(Merged.Nested || (Merged.Nested = {}));
})(Merged || (Merged = {}));
(function(Signatures) {
    (function(Nested) {})(Signatures.Nested || (Signatures.Nested = {}));
})(Signatures || (Signatures = {}));
(function(Dotted) {
    (function(Inner) {
        (function(Deep) {
            Deep.result = value;
        })(Inner.Deep || (Inner.Deep = {}));
    })(Dotted.Inner || (Dotted.Inner = {}));
})(Dotted || (Dotted = {}));
export const result = [
    Merged.Nested.result,
    Dotted.Inner.Deep.result,
    1
];
var Merged, Signatures, Dotted;
