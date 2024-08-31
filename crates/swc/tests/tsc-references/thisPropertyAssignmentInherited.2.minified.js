//// [thisPropertyAssignmentInherited.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
export var Element = /*#__PURE__*/ function() {
    function Element() {
        _class_call_check(this, Element);
    }
    return Element.prototype.cloneNode = function() {
        return this;
    }, _create_class(Element, [
        {
            key: "textContent",
            get: function() {
                return '';
            },
            set: function(x) {}
        }
    ]), Element;
}();
export var HTMLElement = /*#__PURE__*/ function(Element) {
    function HTMLElement() {
        return _class_call_check(this, HTMLElement), _call_super(this, HTMLElement, arguments);
    }
    return _inherits(HTMLElement, Element), HTMLElement;
}(_wrap_native_super(Element));
export var TextElement = /*#__PURE__*/ function(HTMLElement) {
    function TextElement() {
        return _class_call_check(this, TextElement), _call_super(this, TextElement, arguments);
    }
    return _inherits(TextElement, HTMLElement), TextElement.prototype.toString = function() {}, _create_class(TextElement, [
        {
            key: "innerHTML",
            get: function() {
                return this.textContent;
            },
            set: function(html) {
                this.textContent = html;
            }
        }
    ]), TextElement;
}(_wrap_native_super(HTMLElement));
