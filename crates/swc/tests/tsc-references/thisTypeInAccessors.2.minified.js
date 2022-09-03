//// [thisTypeInAccessors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var explicit = {
    n: 12,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
}, copiedFromGetter = {
    n: 14,
    get x () {
        return this.n;
    },
    set x (n){
        this.n = n;
    }
}, copiedFromSetter = {
    n: 15,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
}, copiedFromGetterUnannotated = {
    n: 16,
    get x () {
        return this.n;
    },
    set x (_this){
        this.n = n;
    }
}, Explicit = function() {
    "use strict";
    function Explicit() {
        _class_call_check(this, Explicit), this.n = 17;
    }
    return _create_class(Explicit, [
        {
            key: "x",
            get: function() {
                return this.n;
            },
            set: function(n1) {
                this.n = n1;
            }
        }
    ]), Explicit;
}(), Contextual = function() {
    "use strict";
    function Contextual() {
        _class_call_check(this, Contextual), this.n = 21;
    }
    return _create_class(Contextual, [
        {
            key: "x",
            get: function() {
                return this.n;
            }
        }
    ]), Contextual;
}();
