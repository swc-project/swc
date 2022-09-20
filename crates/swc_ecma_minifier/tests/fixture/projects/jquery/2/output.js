jQuery.extend = jQuery.fn.extend = function() {
    var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
    if ("boolean" == typeof target) {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    "object" == typeof target || jQuery.isFunction(target) || (target = {});
    if (length === i) {
        target = this;
        --i;
    }
    for(; i < length; i++)if (null != (options = arguments[i])) for(name in options){
        src = target[name];
        if (target !== (copy = options[name])) {
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                if (copyIsArray) {
                    copyIsArray = !1;
                    clone = src && jQuery.isArray(src) ? src : [];
                } else clone = src && jQuery.isPlainObject(src) ? src : {};
                target[name] = jQuery.extend(deep, clone, copy);
            } else void 0 !== copy && (target[name] = copy);
        }
    }
    return target;
};
