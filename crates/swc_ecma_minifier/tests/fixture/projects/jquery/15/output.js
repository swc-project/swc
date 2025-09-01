export const obj = {
    position: function() {
        if (this[0]) {
            var offsetParent, offset, parentOffset = {
                top: 0,
                left: 0
            }, elem = this[0];
            // Subtract parent offsets and element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            return "fixed" === jQuery.css(elem, "position") ? // we assume that getBoundingClientRect is available when computed position is fixed
            offset = elem.getBoundingClientRect() : (// Get *real* offsetParent
            offsetParent = this.offsetParent(), // Get correct offsets
            offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), // Add offsetParent borders
            parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), {
                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
            };
        }
    }
};
