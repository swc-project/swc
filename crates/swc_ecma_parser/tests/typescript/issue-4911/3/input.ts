var h = D((q, C) => {
    "use strict";

    var g = {
        extname: function (e) {
            for (var r = -1, i = 0, l = -1, s = !0, n = 0, t = e.length - 1; t >= 0; --t) {
                l === -1 && (s = !1, l = t + 1), a === 46 ? r === -1 ? r = t : n !== 1 && (n = 1) : r !== -1 && (n = -1)
            }
            return r === -1 || l === -1 || n === 0 || n === 1 && r === l - 1 && r === i + 1 ? "" : e.slice(r, l)
        },
        format: function (e) {
            if (e === null || typeof e != "object") throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
            return _("/", e)
        },
    };
});