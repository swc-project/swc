import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, Explicit);
        this.n = 17;
    }
    swcHelpers.createClass(Explicit, [
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
        swcHelpers.classCallCheck(this, Contextual);
        this.n = 21;
    }
    swcHelpers.createClass(Contextual, [
        {
            key: "x",
            get: function get() {
                return this.n;
            } // inside a class, so already correct
        }
    ]);
    return Contextual;
}();
