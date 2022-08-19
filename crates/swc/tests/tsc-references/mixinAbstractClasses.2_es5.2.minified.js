import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var AbstractBase = function AbstractBase() {
    "use strict";
    _class_call_check(this, AbstractBase);
};
new (function(baseClass) {
    "use strict";
    _inherits(MixinClass, baseClass);
    var _super = _create_super(MixinClass);
    function MixinClass() {
        return _class_call_check(this, MixinClass), _super.apply(this, arguments);
    }
    var _proto = MixinClass.prototype;
    return _proto.mixinMethod = function() {}, MixinClass;
}(AbstractBase))();
