function a(c, d) {
    var a = c.constructor, b = d.constructor;
    if (a !== b && !(_.isFunction(a) && a instanceof a && _.isFunction(b) && b instanceof b)) {
        return false;
    }
}
