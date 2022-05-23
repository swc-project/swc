function forEach(obj, iterator, context) {
    var key;
    if (obj) {
        if (isFunction(obj)) for(key in obj)"prototype" != key && "length" != key && "name" != key && obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
        else if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context);
        else if (isArrayLike(obj)) for(key = 0; key < obj.length; key++)iterator.call(context, obj[key], key);
        else for(key in obj)obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
    }
    return obj;
}
