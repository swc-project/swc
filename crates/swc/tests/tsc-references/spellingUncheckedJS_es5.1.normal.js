import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @noEmit: true
// @allowJs: true
// @filename: spellingUncheckedJS.js
export var inModule = 1;
inmodule.toFixed();
function f() {
    // @ts-expect-error
    "this is fine";
    var locals = 2 + true;
    locale.toFixed();
    // @ts-expect-error
    localf.toExponential();
}
var Classe = /*#__PURE__*/ function() {
    "use strict";
    function Classe() {
        _class_call_check(this, Classe);
        this.non = "oui";
    }
    var _proto = Classe.prototype;
    _proto.methode = function methode() {
        // no error on 'this' references
        return this.none;
    };
    return Classe;
}();
var Derivee = /*#__PURE__*/ function(Classe) {
    "use strict";
    _inherits(Derivee, Classe);
    var _super = _create_super(Derivee);
    function Derivee() {
        _class_call_check(this, Derivee);
        return _super.apply(this, arguments);
    }
    var _proto = Derivee.prototype;
    _proto.methode = function methode() {
        // no error on 'super' references
        return _get(_get_prototype_of(Derivee.prototype), "none", this);
    };
    return Derivee;
}(Classe);
var object = {
    spaaace: 3
};
object.spaaaace // error on read
;
object.spaace = 12 // error on write
;
object.fresh = 12 // OK
;
other.puuuce // OK, from another file
;
new Date().getGMTDate() // OK, from another file
;
// No suggestions for globals from other files
var atoc = setIntegral(function() {
    return console.log("ok");
}, 500);
AudioBuffin // etc
;
Jimmy;
Jon;
// @filename: other.js
var Jimmy = 1;
var John = 2;
Jon // error, it's from the same file
;
var other = {
    puuce: 4
};
