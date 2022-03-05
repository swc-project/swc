import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, Classe);
        this.non = 'oui';
    }
    swcHelpers.createClass(Classe, [
        {
            key: "methode",
            value: function methode() {
                // no error on 'this' references
                return this.none;
            }
        }
    ]);
    return Classe;
}();
var Derivee = /*#__PURE__*/ function(Classe) {
    "use strict";
    swcHelpers.inherits(Derivee, Classe);
    var _super = swcHelpers.createSuper(Derivee);
    function Derivee() {
        swcHelpers.classCallCheck(this, Derivee);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Derivee, [
        {
            key: "methode",
            value: function methode() {
                // no error on 'super' references
                return swcHelpers.get(swcHelpers.getPrototypeOf(Derivee.prototype), "none", this);
            }
        }
    ]);
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
    return console.log('ok');
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
