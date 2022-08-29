export const obj = {
    set: function(o, r, n) {
        var s = n && getStyles(o);
        return setPositiveNumber(o, r, n ? augmentWidthOrHeight(o, name, n, jQuery.support.boxSizing && jQuery.css(o, "boxSizing", false, s) === "border-box", s) : 0);
    }
};
