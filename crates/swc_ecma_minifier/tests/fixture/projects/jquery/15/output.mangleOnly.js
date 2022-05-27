export const obj = {
    position: function() {
        if (!this[0]) {
            return;
        }
        var a, c, b = {
            top: 0,
            left: 0
        }, d = this[0];
        if (jQuery.css(d, "position") === "fixed") {
            c = d.getBoundingClientRect();
        } else {
            a = this.offsetParent();
            c = this.offset();
            if (!jQuery.nodeName(a[0], "html")) {
                b = a.offset();
            }
            b.top += jQuery.css(a[0], "borderTopWidth", true);
            b.left += jQuery.css(a[0], "borderLeftWidth", true);
        }
        return {
            top: c.top - b.top - jQuery.css(d, "marginTop", true),
            left: c.left - b.left - jQuery.css(d, "marginLeft", true)
        };
    }
};
