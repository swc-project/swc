console.log(
    (function () {
        var w, _i, _len, _ref, _results;
        for (
            _results = [],
                _i = 0,
                _len = (_ref = "test".trim().split(" ")).length;
            _i < _len;
            _i++
        )
            (w = _ref[_i]), _results.push(w.toLowerCase());
        return _results;
    })()
);
