(function(Direct) {})(Direct || (Direct = {}));
(function(Aliased) {})(Aliased || (Aliased = {}));
(function(Nested) {
    (function(Inner) {})(Nested.Inner || (Nested.Inner = {}));
})(Nested || (Nested = {}));
(function(Dotted) {
    (function(Inner) {})(Dotted.Inner || (Dotted.Inner = {}));
})(Dotted || (Dotted = {}));
(function(Values) {
    Values.X = 1;
})(Values || (Values = {}));
(function(ValueAlias) {
    ValueAlias.X = Values.X;
})(ValueAlias || (ValueAlias = {}));
const observed = [
    Direct,
    Aliased,
    Nested.Inner,
    Dotted.Inner,
    ValueAlias.X
];
var Direct, Aliased, Nested, Dotted, Values, ValueAlias;
