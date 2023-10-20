//// [thisTypeInAccessors.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var explicit = {
    n: 12,
    get x () {
        return this.n;
    },
    set x (n){
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
    set x (n){
        this.n = n;
    }
};
var copiedFromGetterUnannotated = {
    n: 16,
    get x () {
        return this.n;
    },
    set x (n){
        this.n = n;
    }
};
var Explicit = /*#__PURE__*/ function() {
    "use strict";
    function Explicit() {
        _class_call_check(this, Explicit);
        this.n = 17;
    }
    _create_class(Explicit, [
        {
            key: "x",
            get: function get() {
                return this.n;
            },
            set: function set(n1) {
                this.n = n1;
            }
        }
    ]);
    return Explicit;
}();
var Contextual = /*#__PURE__*/ function() {
    "use strict";
    function Contextual() {
        _class_call_check(this, Contextual);
        this.n = 21;
    }
    _create_class(Contextual, [
        {
            key: "x",
            get: function get() {
                return this.n;
            } // inside a class, so already correct
        }
    ]);
    return Contextual;
}();
