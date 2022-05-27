function a(b, c, d) {
    function f(b) {
        var a = b.prototype;
        return !!(a && a.isReactComponent);
    }
    if (b == null) {
        return "";
    }
    if (typeof b === "function") {
        {
            return describeNativeComponentFrame(b, f(b));
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
                    var e = b;
                    var g = e._payload;
                    var h = e._init;
                    try {
                        return a(h(g), c, d);
                    } catch (i) {}
                }
        }
    }
    return "";
}
