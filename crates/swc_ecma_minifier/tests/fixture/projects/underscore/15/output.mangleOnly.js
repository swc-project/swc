function a(a, b) {
    var c = a.constructor, d = b.constructor;
    if (c !== d && !(_.isFunction(c) && c instanceof c && _.isFunction(d) && d instanceof d)) {
        return false;
    }
}
