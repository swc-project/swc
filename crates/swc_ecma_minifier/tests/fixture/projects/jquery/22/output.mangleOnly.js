export const obj = {
    set: function(o, s, t) {
        var n = t && getStyles(o);
        return setPositiveNumber(o, s, t ? augmentWidthOrHeight(o, name, t, jQuery.support.boxSizing && jQuery.css(o, "boxSizing", false, n) === "border-box", n) : 0);
    }
};
