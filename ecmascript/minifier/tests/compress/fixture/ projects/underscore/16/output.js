function foo() {
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
}
