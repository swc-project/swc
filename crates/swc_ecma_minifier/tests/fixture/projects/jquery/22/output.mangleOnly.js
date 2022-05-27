export const obj = {
    set: function(a, d, b) {
        var c = b && getStyles(a);
        return setPositiveNumber(a, d, b ? augmentWidthOrHeight(a, name, b, jQuery.support.boxSizing && jQuery.css(a, "boxSizing", false, c) === "border-box", c) : 0);
    }
};
