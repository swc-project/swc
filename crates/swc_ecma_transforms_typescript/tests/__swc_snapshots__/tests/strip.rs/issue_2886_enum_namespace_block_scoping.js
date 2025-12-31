export var Enum = /*#__PURE__*/ function(Enum) {
    Enum[Enum["test"] = 1] = "test";
    return Enum;
}({});
(function(Namespace) {
    (function(Enum) {
        Enum[Enum["test"] = 1] = "test";
    })(Namespace.Enum || (Namespace.Enum = {}));
    (function(Enum) {
        Enum[Enum["test2"] = 1] = "test2";
    })(Namespace.Enum);
})(Namespace || (Namespace = {}));
{
    let Enum = /*#__PURE__*/ function(Enum) {
        Enum[Enum["test"] = 1] = "test";
        return Enum;
    }({});
    (function(Namespace1) {
        (function(Enum) {
            Enum[Enum["test"] = 1] = "test";
        })(Namespace1.Enum || (Namespace1.Enum = {}));
    })(Namespace1 || (Namespace1 = {}));
    var Namespace, Namespace1;
}{
    let Enum = /*#__PURE__*/ function(Enum) {
        Enum[Enum["test"] = 1] = "test";
        return Enum;
    }({});
    (function(Namespace2) {
        (function(Enum) {
            Enum[Enum["test"] = 1] = "test";
        })(Namespace2.Enum || (Namespace2.Enum = {}));
    })(Namespace2 || (Namespace2 = {}));
    var Namespace2;
}
