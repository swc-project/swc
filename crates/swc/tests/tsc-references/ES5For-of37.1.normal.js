//// [ES5For-of37.ts]
// https://github.com/microsoft/TypeScript/issues/30083
for(var _i = 0, _iter = [
    0,
    1,
    2,
    3,
    4
]; _i < _iter.length; _i++){
    var i = _iter[_i];
    try {
        // Ensure catch binding for the following loop is reset per iteration:
        for(var _i1 = 0, _iter1 = [
            1,
            2,
            3
        ]; _i1 < _iter1.length; _i1++){
            var j = _iter1[_i1];
            if (i === 2) {
                throw new Error('ERR');
            }
        }
        console.log(i);
    } catch (err) {
        console.log('E %s %s', i, err);
    }
}
