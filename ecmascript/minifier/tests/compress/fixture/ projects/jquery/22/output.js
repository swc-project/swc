export const obj = {
    set: function (
        elem, value, extra
    ) {
        var styles = extra && getStyles(
            elem
        );
        return setPositiveNumber(
            0,
            value,
            extra
                ? augmentWidthOrHeight(
                    elem,
                    name,
                    extra,
                    jQuery.support.boxSizing &&
                    "border-box" === jQuery.css(
                        elem,
                        "boxSizing",
                        !1,
                        styles
                    ),
                    styles,
                )
                : 0,
        );
    },
}