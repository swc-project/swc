//// [thisPropertyAssignmentInherited.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var Element = function() {
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
export var HTMLElement = function(Element) {
    _inherits(HTMLElement, Element);
    var _super = _create_super(HTMLElement);
    function HTMLElement() {
        return _class_call_check(this, HTMLElement), _super.apply(this, arguments);
    }
    return HTMLElement;
}(_wrap_native_super(Element));
export var TextElement = function(HTMLElement) {
    _inherits(TextElement, HTMLElement);
    var _super = _create_super(TextElement);
    function TextElement() {
        return _class_call_check(this, TextElement), _super.apply(this, arguments);
    }
    return TextElement.prototype.toString = function() {}, _create_class(TextElement, [
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
