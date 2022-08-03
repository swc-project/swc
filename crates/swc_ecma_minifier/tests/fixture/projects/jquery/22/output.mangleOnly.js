export const obj = {
    set: function(s, t, n) {
        var o = n && getStyles(s);
        return setPositiveNumber(s, t, n ? augmentWidthOrHeight(s, name, n, jQuery.support.boxSizing && jQuery.css(s, "boxSizing", false, o) === "border-box", o) : 0);
    }
};
