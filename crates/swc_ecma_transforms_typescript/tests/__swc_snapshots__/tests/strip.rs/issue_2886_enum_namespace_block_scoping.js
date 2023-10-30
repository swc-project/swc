export var Enum;
(function(Enum) {
    Enum[Enum["test"] = 1] = "test";
})(Enum || (Enum = {}));
var Namespace;
(function(Namespace) {
    let Enum;
    (function(Enum) {
        Enum[Enum["test"] = 1] = "test";
    })(Enum = Namespace.Enum || (Namespace.Enum = {}));
    (function(Enum) {
        Enum[Enum["test2"] = 1] = "test2";
    })(Enum = Namespace.Enum || (Namespace.Enum = {}));
})(Namespace || (Namespace = {}));
{
    let Enum;
    (function(Enum) {
        Enum[Enum["test"] = 1] = "test";
    })(Enum || (Enum = {}));
    let Namespace;
    (function(Namespace) {
        let Enum;
        (function(Enum) {
            Enum[Enum["test"] = 1] = "test";
        })(Enum = Namespace.Enum || (Namespace.Enum = {}));
    })(Namespace || (Namespace = {}));
}{
    let Enum;
    (function(Enum) {
        Enum[Enum["test"] = 1] = "test";
    })(Enum || (Enum = {}));
    let Namespace;
    (function(Namespace) {
        let Enum;
        (function(Enum) {
            Enum[Enum["test"] = 1] = "test";
        })(Enum = Namespace.Enum || (Namespace.Enum = {}));
    })(Namespace || (Namespace = {}));
}
