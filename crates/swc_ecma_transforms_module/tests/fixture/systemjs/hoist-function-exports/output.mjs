System.register([
    "./evens"
], function(_export, _context) {
    "use strict";
    var a, i, isEven, isOdd, j, p;
    function nextOdd(n) {
        return p = isEven(n) ? n + 1 : n + 2, _export("p", p), p;
    }
    _export({
        isOdd: void 0,
        nextOdd: nextOdd,
        p: void 0
    });
    return {
        setters: [
            function(_evens_ns) {
                isEven = _evens_ns.isEven;
            }
        ],
        execute: function() {
            _export("p", p = 5);
            for(a in b);
            for(i = 0, j = 0;;);
            _export("isOdd", isOdd = function(isEven) {
                return function(n) {
                    return !isEven(n);
                };
            }(isEven));
        }
    };
});
