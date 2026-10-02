function labels(arr) {
    first: second: third: for(var _iterator = _create_for_of_iterator_helper_loose(arr), _step; !(_step = _iterator()).done;){
        const item = _step.value;
        if (item === 1) continue first;
        if (item === 2) continue second;
        if (item === 3) continue third;
        if (item === 4) break first;
        if (item === 5) break second;
        if (item === 6) break third;
    }
    first: second: third: for(let _i = 0, _iter = [
        1,
        2,
        3
    ]; _i < _iter.length; _i++){
        const item = _iter[_i];
        if (item === 1) continue first;
        if (item === 2) continue second;
        break third;
    }
}
