export const obj = {
    each: function(obj, callback, args) {
        var i = 0, length = obj.length, isArray = isArraylike(obj);
        if (args) {
            if (isArray) for(; i < length && !1 !== callback.apply(obj[i], args); i++);
            else for(i in obj)if (!1 === callback.apply(obj[i], args)) break;
        } else if (isArray) for(; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++);
        else for(i in obj)if (!1 === callback.call(obj[i], i, obj[i])) break;
        return obj;
    }
};
