//// [thisPropertyAssignmentInherited.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var Element = /*#__PURE__*/ function() {
    "use strict";
    function Element() {
        _class_call_check(this, Element);
    }
    var _proto = Element.prototype;
    _proto.cloneNode = function cloneNode() {
        return this;
    };
    _create_class(Element, [
        {
            key: "textContent",
            get: /**
   * @returns {String}
   */ function get() {
                return '';
            },
            set: function set(x) {}
        }
    ]);
    return Element;
}();
export var HTMLElement = /*#__PURE__*/ function(Element) {
    "use strict";
    _inherits(HTMLElement, Element);
    var _super = _create_super(HTMLElement);
    function HTMLElement() {
        _class_call_check(this, HTMLElement);
        return _super.apply(this, arguments);
    }
    return HTMLElement;
}(_wrap_native_super(Element));
export var TextElement = /*#__PURE__*/ function(HTMLElement) {
    "use strict";
    _inherits(TextElement, HTMLElement);
    var _super = _create_super(TextElement);
    function TextElement() {
        _class_call_check(this, TextElement);
        return _super.apply(this, arguments);
    }
    var _proto = TextElement.prototype;
    _proto.toString = function toString() {};
    _create_class(TextElement, [
        {
            key: "innerHTML",
            get: function get() {
                return this.textContent;
            },
            set: function set(html) {
                this.textContent = html;
            }
        }
    ]);
    return TextElement;
}(_wrap_native_super(HTMLElement));
