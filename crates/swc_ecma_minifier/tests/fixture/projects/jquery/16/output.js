export const obj = {
    setOffset: function(elem, options, i) {
        var position = jQuery.css(elem, "position");
        "static" === position && (elem.style.position = "relative");
        var curTop, curLeft, curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [
            curCSSTop,
            curCSSLeft
        ]) > -1, props = {}, curPosition = {};
        calculatePosition ? (curTop = (curPosition = curElem.position()).top, curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), jQuery.isFunction(options) && (options = options.call(elem, i, curOffset)), null != options.top && (props.top = options.top - curOffset.top + curTop), null != options.left && (props.left = options.left - curOffset.left + curLeft), "using" in options ? options.using.call(elem, props) : curElem.css(props);
    }
};
