function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
for(var _loop = function(i) {
    var C = function() {
        "use strict";
        _classCallCheck(this, C), this.prop = i;
    };
    arr.push(C);
}, arr = [], i = 0; i < 10; ++i)_loop(i);
