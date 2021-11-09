function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var arr, i, tmp = Symbol.iterator, SymbolIterator = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function SymbolIterator() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, SymbolIterator);
    }
    return Constructor = SymbolIterator, protoProps = [
        {
            key: "next",
            value: function() {
                return {
                    value: Symbol(),
                    done: !1
                };
            }
        },
        {
            key: tmp,
            value: function() {
                return this;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), SymbolIterator;
}(), ref = (i = 2, function(arr) {
    if (Array.isArray(arr)) return arr;
}(arr = new SymbolIterator) || function(arr, i) {
    var _arr = [], _n = !0, _d = !1, _e = void 0;
    try {
        for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
    } catch (err) {
        _d = !0, _e = err;
    } finally{
        try {
            _n || null == _i.return || _i.return();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}(arr, i) || function() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}());
ref[0], ref[1];
