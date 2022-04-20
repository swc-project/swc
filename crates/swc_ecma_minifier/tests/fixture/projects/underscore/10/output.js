var eq = function(a, b, aStack, bStack) {
    if (a === b) return 0 !== a || 1 / a == 1 / b;
    if (null == a || null == b) return a === b;
    a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
    var className = toString.call(a);
    if (className != toString.call(b)) return !1;
    switch(className){
        case '[object String]':
            return a == String(b);
        case '[object Number]':
            return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a == +b;
        case '[object RegExp]':
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    if ('object' != typeof a || 'object' != typeof b) return !1;
    for(var length = aStack.length; length--;)if (aStack[length] == a) return bStack[length] == b;
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) return !1;
    aStack.push(a), bStack.push(b);
    var size = 0, result = !0;
    if ('[object Array]' == className) {
        if (result = (size = a.length) == b.length) for(; size-- && (result = eq(a[size], b[size], aStack, bStack)););
    } else {
        for(var key in a)if (_.has(a, key) && (size++, !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))) break;
        if (result) {
            for(key in b)if (_.has(b, key) && !size--) break;
            result = !size;
        }
    }
    return aStack.pop(), bStack.pop(), result;
};
