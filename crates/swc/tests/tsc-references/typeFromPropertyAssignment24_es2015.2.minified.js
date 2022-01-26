Outer.Inner.Message = function() {}, new Outer.Inner().name;
var Outer = {};
Outer.Inner = class {
    name() {
        return "hi";
    }
};
