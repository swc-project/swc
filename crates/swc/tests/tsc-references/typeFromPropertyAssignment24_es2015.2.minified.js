Outer.Inner.Message = function() {}, new Outer.Inner().name, x.name;
var x, Outer = {};
Outer.Inner = class {
    name() {
        return 'hi';
    }
};
