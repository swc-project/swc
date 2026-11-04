(function(N) {})(N || (N = {}));
export { N };
(function(Default) {})(Default || (Default = {}));
export default Default;
(function(Public) {})(Public || (Public = {}));
(function(Nested) {
    (function(Qualified) {})(Nested.Qualified || (Nested.Qualified = {}));
})(Nested || (Nested = {}));
const nested = Nested.Qualified;
(function(Aliased) {})(Aliased || (Aliased = {}));
const Alias = Aliased;
const alias = Alias;
var N, Default, Nested, Aliased;
export var Public;
