//// [validMultipleVariableDeclarations.ts]
// all expected to be valid
var x;
var x = 2;
if (true) {
    var x = 3;
    for(var x = 0;;){}
}
var x = undefined;
// new declaration space, making redeclaring x as a string valid
function declSpace() {
    var x = 'this is a string';
}
var p;
var p = {
    x: 1,
    y: 2
};
var p = {
    x: 0,
    y: undefined
};
var p = {
    x: 1,
    y: undefined
};
var p = {
    x: 1,
    y: 2
};
var p = {
    x: 0,
    y: undefined
};
var p;
var fn = function fn(s) {
    return 42;
};
var fn = function(s) {
    return 3;
};
var fn;
var fn;
var fn = null;
var fn;
var a;
var a = [
    'a',
    'b'
];
var a = [];
var a = [];
var a = new Array();
var a;
