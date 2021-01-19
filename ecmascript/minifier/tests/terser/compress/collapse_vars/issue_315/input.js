console.log(
    (function (s) {
        var w, _i, _len, _ref, _results;
        _ref = s.trim().split(" ");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            w = _ref[_i];
            _results.push(w.toLowerCase());
        }
        return _results;
    })("test")
);
