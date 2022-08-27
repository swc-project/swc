//// [ES5For-of9.ts]
function foo() {
    return {
        x: 0
    };
}
for(var _i = 0, _iter = []; _i < _iter.length; _i++){
    foo().x = _iter[_i];
    for(var _i1 = 0, _iter1 = []; _i1 < _iter1.length; _i1++)foo().x = _iter1[_i1], foo().x;
}
