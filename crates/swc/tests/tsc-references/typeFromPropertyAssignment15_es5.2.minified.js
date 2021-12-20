function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var inner, Outer = {
};
Outer.Inner = (function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function _class() {
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, _class), this.x = 1;
    }
    return protoProps = [
        {
            key: "m",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = _class).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
})(), inner.x, inner.m();
var inno = new Outer.Inner();
inno.x, inno.m();
