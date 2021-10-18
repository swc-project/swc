function _templateObject() {
    var strings, raw, data = (strings = [
        "Hello world!"
    ], raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    })));
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
var CtorTag = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, CtorTag);
};
CtorTag(_templateObject());
