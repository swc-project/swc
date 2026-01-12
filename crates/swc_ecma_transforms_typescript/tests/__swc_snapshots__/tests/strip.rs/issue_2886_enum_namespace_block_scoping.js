var Enum1 = /*#__PURE__*/ function(Enum1) {
    Enum1[Enum1["test"] = 1] = "test";
    return Enum1;
}({});
export { Enum1 as Enum };
(function(Namespace1) {
    var Enum1 = /*#__PURE__*/ function(Enum1) {
        Enum1[Enum1["test"] = 1] = "test";
        return Enum1;
    }(Enum1 || {});
    Namespace1.Enum = Enum1;
    var Enum1 = /*#__PURE__*/ function(Enum1) {
        Enum1[Enum1["test2"] = 1] = "test2";
        return Enum1;
    }(Enum1 || {});
    Namespace1.Enum = Enum1;
})(Namespace1 || (Namespace1 = {}));
{
    enum Enum {
        test = 1
    }
    namespace Namespace {
        export enum Enum {
            test = 1
        }
    }
}{
    enum Enum {
        test = 1
    }
    namespace Namespace {
        export enum Enum {
            test = 1
        }
    }
}
