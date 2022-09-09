export const obj = {
    position: function() {
        if (!this[0]) {
            return;
        }
        var t, e, r = {
            top: 0,
            left: 0
        }, o = this[0];
        if (jQuery.css(o, "position") === "fixed") {
            e = o.getBoundingClientRect();
        } else {
            t = this.offsetParent();
            e = this.offset();
            if (!jQuery.nodeName(t[0], "html")) {
                r = t.offset();
            }
            r.top += jQuery.css(t[0], "borderTopWidth", true);
            r.left += jQuery.css(t[0], "borderLeftWidth", true);
        }
        return {
            top: e.top - r.top - jQuery.css(o, "marginTop", true),
            left: e.left - r.left - jQuery.css(o, "marginLeft", true)
        };
    }
};
