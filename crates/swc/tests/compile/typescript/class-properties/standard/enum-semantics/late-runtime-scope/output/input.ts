var Outer = /*#__PURE__*/ function(Outer) {
    Outer[Outer["A"] = 1] = "A";
    return Outer;
}(Outer || {});
function read() {
    let Local = /*#__PURE__*/ function(Local) {
        Local[Local["A"] = 11] = "A";
        return Local;
    }({});
    (function(Values) {
        (function(Inner) {
            Inner[Inner["A"] = 17] = "A";
        })(Values.Inner || (Values.Inner = {}));
        const Alias = Values.Inner;
        function object() {
            return Alias;
        }
        Values.object = object;
    })(Values || (Values = {}));
    return [
        1,
        Local,
        Values.object()
    ];
    var Values;
}
export const result = read();
