export const obj = {
    style: function(elem, name, value, extra) {
        // Don't set styles on text and comment nodes
        if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
            // Make sure that we're working with the right name
            var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
            // Check if we're setting a value
            if (name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], void 0 === value) return(// If a hook was provided get the non-computed value from there
            hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name]);
            // Make sure that NaN and null values aren't set. See: #7116
            if ("string" == (type = typeof value) && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), // Fixes bug #9237
            type = "number"), !(null == value || "number" === type && isNaN(value)) && ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), jQuery.support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), !hooks || !("set" in hooks) || void 0 !== (value = hooks.set(elem, value, extra)))) // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
            // Fixes bug #5509
            try {
                style[name] = value;
            } catch (e) {}
        }
    }
};
