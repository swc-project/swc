export const obj = {
    style: function(elem, name, value, extra) {
        if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
            var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
            if (name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], void 0 === value) return hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name];
            if ("string" == (type = typeof value) && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), type = "number"), !(null == value || "number" === type && isNaN(value)) && ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), jQuery.support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), !hooks || !("set" in hooks) || void 0 !== (value = hooks.set(elem, value, extra)))) try {
                style[name] = value;
            } catch (e) {}
        }
    }
};
