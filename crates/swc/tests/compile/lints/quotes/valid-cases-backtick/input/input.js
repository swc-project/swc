"use strict";
var v = "use strict";
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

function f() {
    "use strict";
    var foo = `backtick`;
}

() => {
    "use strict";
    "use strong";
    "use asm";
    var foo = `backtick`;
};

// prettier-ignore
var obj = {"key0": 0, 'key1': 1};

// prettier-ignore
class Foo1 { 'bar'(){} }

// prettier-ignore
class Foo2 { static ''(){} }

// prettier-ignore
class C { "double"; 'single'; }
