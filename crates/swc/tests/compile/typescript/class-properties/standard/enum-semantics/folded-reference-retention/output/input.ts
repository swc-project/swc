import { effect } from "values";
(function(Closed) {
    (function(Child) {
        (function(Source) {
            Source[Source["A"] = 9] = "A";
        })(Child.Source || (Child.Source = {}));
    })(Closed.Child || (Closed.Child = {}));
})(Closed || (Closed = {}));
var Dynamic = function(Dynamic) {
    Dynamic[Dynamic["A"] = 9] = "A";
    Dynamic[Dynamic["B"] = effect(9)] = "B";
    Dynamic[Dynamic["C"] = Dynamic.B + 9] = "C";
    return Dynamic;
}(Dynamic || {});
var Writable = /*#__PURE__*/ function(Writable) {
    Writable[Writable["A"] = 13] = "A";
    return Writable;
}(Writable || {});
Writable.A++;
export const result = [
    9,
    9,
    Dynamic.B,
    Dynamic.C,
    13
];
var Closed;
