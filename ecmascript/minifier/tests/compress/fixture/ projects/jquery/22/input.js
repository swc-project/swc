export const obj = {
    set: function (elem, value, extra) {
        var styles = extra && getStyles(elem);
        return setPositiveNumber(elem, value, extra ?
            augmentWidthOrHeight(
                elem,
                name,
                extra,
                jQuery.support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box",
                styles
            ) : 0
        );
    }
}