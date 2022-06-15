// @module: commonjs
// @target: ES5
export default function Foo() {};
var Foo;
(function(Foo) {
    var x;
    Foo.x = x;
})(Foo || (Foo = {}));
