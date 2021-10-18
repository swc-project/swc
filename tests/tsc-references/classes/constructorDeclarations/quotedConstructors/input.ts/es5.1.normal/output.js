function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    console.log(this);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
    console.log(this);
};
var tmp = 'constructor';
var E = /*#__PURE__*/ function() {
    "use strict";
    function E() {
        _classCallCheck(this, E);
    }
    _createClass(E, [
        {
            key: tmp,
            value: function value() {
                console.log(this);
            }
        }
    ]);
    return E;
}();
new function _class() {
    "use strict";
    _classCallCheck(this, _class);
    console.log(this);
};
var o = {
    "constructor": function() {
    }
};
var F = function F() {
    "use strict";
    _classCallCheck(this, F);
    console.log(this);
};
