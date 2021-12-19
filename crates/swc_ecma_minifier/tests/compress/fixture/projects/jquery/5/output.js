export const obj = {
    each: function(obj1, callback, args) {
        var i = 0, length = obj1.length, isArray = isArraylike(obj1);
        if (args) {
            if (isArray) for(; i < length && !1 !== callback.apply(obj1[i], args); i++);
            else for(i in obj1)if (!1 === callback.apply(obj1[i], args)) break;
        } else if (isArray) for(; i < length && !1 !== callback.call(obj1[i], i, obj1[i]); i++);
        else for(i in obj1)if (!1 === callback.call(obj1[i], i, obj1[i])) break;
        return obj1;
    }
};
