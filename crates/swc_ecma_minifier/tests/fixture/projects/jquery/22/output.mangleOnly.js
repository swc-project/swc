export const obj = {
    set: function(e, t, r) {
        var o = r && getStyles(e);
        return setPositiveNumber(e, t, r ? augmentWidthOrHeight(e, name, r, jQuery.support.boxSizing && jQuery.css(e, "boxSizing", false, o) === "border-box", o) : 0);
    }
};
