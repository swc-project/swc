// Pretend that `Reflect.construct` isn't supported.
this.Reflect = undefined;
this.HTMLElement = function() {
    // Here, `this.HTMLElement` is this function, not the original HTMLElement
    // constructor. `this.constructor` should be this function too, but isn't.
    constructor = this.constructor;
};
var constructor;
let CustomElement = /*#__PURE__*/ function(HTMLElement) {
    "use strict";
    _inherits(CustomElement, HTMLElement);
    function CustomElement() {
        _class_call_check(this, CustomElement);
        return _call_super(this, CustomElement, arguments);
    }
    return CustomElement;
}(_wrap_native_super(HTMLElement));
;
new CustomElement();
expect(constructor).toBe(CustomElement);
