let ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    "use strict";
    _inherits(ColouredCanvasElement, CanvasElement);
    var _super = _create_super(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _class_call_check(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _create_class(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                _get(_get_prototype_of(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden);
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
