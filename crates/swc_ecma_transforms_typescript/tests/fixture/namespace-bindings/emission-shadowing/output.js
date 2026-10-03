const value = 43;
(function(Outer) {
    Outer.value = 5;
    function shadow(value) {
        return value;
    }
    Outer.shadow = shadow;
    (function(Child) {
        Child.value = 7;
        function nested(value) {
            return value + Outer.value;
        }
        Child.nested = nested;
    })(Outer.Child || (Outer.Child = {}));
})(Outer || (Outer = {}));
(function(Outer) {
    Outer.merged = Outer.value;
})(Outer || (Outer = {}));
export const result = [
    value,
    Outer.shadow(11),
    Outer.Child.nested(13),
    Outer.merged
];
var Outer;
