export const obj = {
    set: function(a, b, c) {
        var d = c && getStyles(a);
        return setPositiveNumber(a, b, c ? augmentWidthOrHeight(a, name, c, jQuery.support.boxSizing && jQuery.css(a, "boxSizing", false, d) === "border-box", d) : 0);
    }
};
