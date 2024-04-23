//// [ES5For-of37.ts]
for(var _i = 0, _iter = [
    0,
    1,
    2,
    3,
    4
]; _i < _iter.length; _i++){
    var i = _iter[_i];
    try {
        for(var _i1 = 0, _iter1 = [
            1,
            2,
            3
        ]; _i1 < _iter1.length; _i1++)if (_iter1[_i1], 2 === i) throw Error('ERR');
        console.log(i);
    } catch (err) {
        console.log('E %s %s', i, err);
    }
}
