// array literals are widened upon assignment according to their element type

var a = []; // any[]
var a = [,,];

var a = [null, null];
var a = [undefined, undefined];

var b = [[], [null, null]]; // any[][]
var b = [[], []];
var b = [[undefined, undefined]];

var c = [[[]]]; // any[][][]
var c = [[[null]],[undefined]]

// no widening when one or more elements are non-widening

var x: undefined = undefined;

var d = [x];
var d = [, x];
var d = [undefined, x];
