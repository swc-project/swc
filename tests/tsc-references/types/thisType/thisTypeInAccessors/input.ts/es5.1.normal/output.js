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
var explicit = {
    n: 12,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
};
var copiedFromGetter = {
    n: 14,
    get x () {
        return this.n;
    },
    set x (n){
        this.n = n;
    }
};
var copiedFromSetter = {
    n: 15,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
};
var copiedFromGetterUnannotated = {
    n: 16,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
};
var Explicit = /*#__PURE__*/ function() {
    "use strict";
    function Explicit() {
        _classCallCheck(this, Explicit);
        this.n = 17;
    }
    _createClass(Explicit, [
        {
            key: "x",
            get: function get() {
                return this.n;
            },
            set: function set(n) {
                this.n = n;
            }
        }
    ]);
    return Explicit;
}();
var Contextual = /*#__PURE__*/ function() {
    "use strict";
    function Contextual() {
        _classCallCheck(this, Contextual);
        this.n = 21;
    }
    _createClass(Contextual, [
        {
            key: "x",
            get: function get() {
                return this.n;
            } // inside a class, so already correct
        }
    ]);
    return Contextual;
}();
