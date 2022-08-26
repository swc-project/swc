export const obj = {
    position: function() {
        if (!this[0]) {
            return;
        }
        var t, e, o = {
            top: 0,
            left: 0
        }, s = this[0];
        if (jQuery.css(s, "position") === "fixed") {
            e = s.getBoundingClientRect();
        } else {
            t = this.offsetParent();
            e = this.offset();
            if (!jQuery.nodeName(t[0], "html")) {
                o = t.offset();
            }
            o.top += jQuery.css(t[0], "borderTopWidth", true);
            o.left += jQuery.css(t[0], "borderLeftWidth", true);
        }
        return {
            top: e.top - o.top - jQuery.css(s, "marginTop", true),
            left: e.left - o.left - jQuery.css(s, "marginLeft", true)
        };
    }
};
