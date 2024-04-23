//// [forStatementsMultipleValidDecl.ts]
// all expected to be valid
for(var x;;){}
for(var x = 2;;){}
for(var x = undefined;;){}
// new declaration space, making redeclaring x as a string valid
function declSpace() {
    for(var x = 'this is a string';;){}
}
for(var p;;){}
for(var p = {
    x: 1,
    y: 2
};;){}
for(var p = {
    x: 0,
    y: undefined
};;){}
for(var p = {
    x: 1,
    y: undefined
};;){}
for(var p = {
    x: 1,
    y: 2
};;){}
for(var p = {
    x: 0,
    y: undefined
};;){}
for(var p;;){}
for(var fn = function fn(s) {
    return 42;
};;){}
for(var fn = function(s) {
    return 3;
};;){}
for(var fn;;){}
for(var fn;;){}
for(var fn = null;;){}
for(var fn;;){}
for(var a;;){}
for(var a = [
    'a',
    'b'
];;){}
for(var a = [];;){}
for(var a = [];;){}
for(var a = new Array();;){}
for(var a;;){}
