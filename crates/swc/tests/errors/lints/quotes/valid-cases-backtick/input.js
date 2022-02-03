var s = "double quotes string";

// valid cases

var foo = `bar`;
var foo = `bar 'baz'`;
var foo = `bar \"baz\"`;
var foo = 1;
var foo = "a string containing `backtick` quotes";
var foo = `bar 'foo' baz` + `bar`;

() => {
    "use strict";
    var foo = `backtick`;
};

() => {
    "use strict";
    "use strong";
    "use asm";
    var foo = `backtick`;
};

// TODO: "error: 'import', and 'export' cannot be used outside of module code"
// () => {
//     import "a";
//     // prettier-ignore
//     import 'b';
// };

// () => {
//     import a from "a";
//     // prettier-ignore
//     import b from 'b';
// };

// () => {
//     // prettier-ignore
//     import { "a" as b, 'c' as d } from 'mod';
// };

// prettier-ignore
var obj = {"key0": 0, 'key1': 1};

// prettier-ignore
class Foo1 { 'bar'(){} }

// prettier-ignore
class Foo2 { static ''(){} }

// prettier-ignore
class C { "double"; 'single'; }
