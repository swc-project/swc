var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return 0 !== a || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (null == a || null == b) return a === b;
    a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return !1;
    switch(className){
        // Strings, numbers, dates, and booleans are compared by value.
        case "[object String]":
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return a == String(b);
        case "[object Number]":
            // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
            // other numeric values.
            return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
        case "[object Date]":
        case "[object Boolean]":
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case "[object RegExp]":
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    if ("object" != typeof a || "object" != typeof b) return !1;
    for(// Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length; length--;)// Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] == a) return bStack[length] == b;
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) return !1;
    // Add the first object to the stack of traversed objects.
    aStack.push(a), bStack.push(b);
    var size = 0, result = !0;
    // Recursively compare objects and arrays.
    if ("[object Array]" == className) {
        if (result = // Compare array lengths to determine if a deep comparison is necessary.
        (size = a.length) == b.length) // Deep compare the contents, ignoring non-numeric properties.
        for(; size-- && (result = eq(a[size], b[size], aStack, bStack)););
    } else {
        // Deep compare objects.
        for(var key in a)if (_.has(a, key) && (// Count the expected number of properties.
        size++, !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))) break;
        // Ensure that both objects contain the same number of properties.
        if (result) {
            for(key in b)if (_.has(b, key) && !size--) break;
            result = !size;
        }
    }
    return(// Remove the first object from the stack of traversed objects.
    aStack.pop(), bStack.pop(), result);
};
