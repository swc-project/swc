function foo() {
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
        // Compare array lengths to determine if a deep comparison is necessary.
        size = a.length;
        result = size == b.length;
        if (result) {
            // Deep compare the contents, ignoring non-numeric properties.
            while (size--) {
                if (!(result = eq(a[size], b[size], aStack, bStack))) break;
            }
        }
    } else {
        // Deep compare objects.
        for (var key in a) {
            if (_.has(a, key)) {
                // Count the expected number of properties.
                size++;
                // Deep compare each member.
                if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
            }
        }
        // Ensure that both objects contain the same number of properties.
        if (result) {
            for (key in b) {
                if (_.has(b, key) && !(size--)) break;
            }
            result = !size;
        }
    }
}