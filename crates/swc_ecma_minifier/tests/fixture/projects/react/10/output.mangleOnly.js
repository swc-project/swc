function a(b, c, d) {
    function e(a) {
        var b = a.prototype;
        return !!(b && b.isReactComponent);
    }
    if (b == null) {
        return "";
    }
    if (typeof b === "function") {
        {
            return describeNativeComponentFrame(b, e(b));
        }
    }
    if (typeof b === "string") {
        return describeBuiltInComponentFrame(b);
    }
    switch(b){
        case exports.Suspense:
            return describeBuiltInComponentFrame("Suspense");
        case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
    }
    if (typeof b === "object") {
        switch(b.$$typeof){
            case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(b.render);
            case REACT_MEMO_TYPE:
                return a(b.type, c, d);
            case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(b._render);
            case REACT_LAZY_TYPE:
                {
                    var f = b;
                    var g = f._payload;
                    var h = f._init;
                    try {
                        return a(h(g), c, d);
                    } catch (i) {}
                }
        }
    }
    return "";
}
