function n(n, t) {
    var c = n.constructor, o = t.constructor;
    if (c !== o && !(_.isFunction(c) && c instanceof c && _.isFunction(o) && o instanceof o)) {
        return false;
    }
}
