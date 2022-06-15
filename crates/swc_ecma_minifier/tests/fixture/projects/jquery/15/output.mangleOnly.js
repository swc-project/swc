export const obj = {
    position: function() {
        if (!this[0]) {
            return;
        }
        var a, b, c = {
            top: 0,
            left: 0
        }, d = this[0];
        if (jQuery.css(d, "position") === "fixed") {
            b = d.getBoundingClientRect();
        } else {
            a = this.offsetParent();
            b = this.offset();
            if (!jQuery.nodeName(a[0], "html")) {
                c = a.offset();
            }
            c.top += jQuery.css(a[0], "borderTopWidth", true);
            c.left += jQuery.css(a[0], "borderLeftWidth", true);
        }
        return {
            top: b.top - c.top - jQuery.css(d, "marginTop", true),
            left: b.left - c.left - jQuery.css(d, "marginLeft", true)
        };
    }
};
