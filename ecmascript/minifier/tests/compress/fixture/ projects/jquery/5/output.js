export const obj = {
    each: function (
        obj, callback, args
    ) {
        var i = 0,
            length = obj.length,
            isArray = isArraylike(
                obj
            );
        if (args) {
            if (isArray)
                for (; i < length; i++)
                    if (!1 === callback.apply(
                        obj[i],
                        args
                    )) break;
                    else
                        for (i in obj) if (!1 === callback.apply(
                            obj[i],
                            args
                        )) break;
        } else if (isArray)
            for (; i < length; i++)
                if (!1 === callback.call(
                    obj[i],
                    i,
                    obj[i]
                )) break;
                else
                    for (i in obj) if (!1 === callback.call(
                        obj[i],
                        i,
                        obj[i]
                    )) break;
        return obj;
    }
}