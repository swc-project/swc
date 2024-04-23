//// [ES5For-of34.ts]
function foo() {
    return {
        x: 0
    };
}
for(var _i = 0, _iter = [
    'a',
    'b',
    'c'
]; _i < _iter.length; _i++){
    foo().x = _iter[_i];
    var p = foo().x;
}
