export const obj = {
    setOffset: function (elem, options, i) {
        var position = jQuery.css(elem, "position");

        // set position first, in-case top/left are set even on static elem
        if (position === "static") {
            elem.style.position = "relative";
        }

        var curElem = jQuery(elem),
            curOffset = curElem.offset(),
            curCSSTop = jQuery.css(elem, "top"),
            curCSSLeft = jQuery.css(elem, "left"),
            calculatePosition =
                (position === "absolute" || position === "fixed") &&
                jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
            props = {},
            curPosition = {},
            curTop,
            curLeft;

        // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
        if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
        } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
        }

        if (jQuery.isFunction(options)) {
            options = options.call(elem, i, curOffset);
        }

        if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
        }
        if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
        }

        if ("using" in options) {
            options.using.call(elem, props);
        } else {
            curElem.css(props);
        }
    },
};
