jQuery.extend = jQuery.fn.extend = function() {
    var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
    for("boolean" == typeof target && (deep = target, target = arguments[1] || {}, // skip the boolean and the target
    i = 2), "object" == typeof target || jQuery.isFunction(target) || (target = {}), length === i && (target = this, --i); i < length; i++)// Only deal with non-null/undefined values
    if (null != (options = arguments[i])) // Extend the base object
    for(name in options)// Prevent never-ending loop
    src = target[name], target !== (copy = options[name]) && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, // Never move original objects, clone them
    target[name] = jQuery.extend(deep, clone, copy)) : void 0 !== copy && (target[name] = copy));
    // Return the modified object
    return target;
};
