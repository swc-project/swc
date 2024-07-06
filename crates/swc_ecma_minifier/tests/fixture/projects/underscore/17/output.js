export function foo() {
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
}
