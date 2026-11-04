var s = "double quotes string";

// valid cases

// prettier-ignore
var foo = 'bar';
var foo = 1;
var foo = "'";

// prettier-ignore
class C { 'f'; 'm'() {} }

var foo = `back\ntick`;
var foo = `back\rtick`;
var foo = `back\u2028tick`;
var foo = `back\u2029tick`;
var foo = `back\\\\\ntick`;
var foo = `back\\\\\\\\\ntick`;
var foo = `\n`;

// prettier-ignore
var foo = `bar 'foo' baz` + 'bar';
var foo = `back${x}tick`;
var foo = tag`backtick`;
var foo = `bar 'foo' baz` + "bar";
