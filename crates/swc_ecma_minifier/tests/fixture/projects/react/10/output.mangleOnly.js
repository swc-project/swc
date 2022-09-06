function e(n, r, t) {
    function o(e) {
        var n = e.prototype;
        return !!(n && n.isReactComponent);
    }
    if (n == null) {
        return "";
    }
    if (typeof n === "function") {
        {
            return describeNativeComponentFrame(n, o(n));
        }
    }
    if (typeof n === "string") {
        return describeBuiltInComponentFrame(n);
    }
    switch(n){
        case exports.Suspense:
            return describeBuiltInComponentFrame("Suspense");
        case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
    }
    if (typeof n === "object") {
        switch(n.$$typeof){
            case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(n.render);
            case REACT_MEMO_TYPE:
                return e(n.type, r, t);
            case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(n._render);
            case REACT_LAZY_TYPE:
                {
                    var i = n;
                    var s = i._payload;
                    var c = i._init;
                    try {
                        return e(c(s), r, t);
                    } catch (u) {}
                }
        }
    }
    return "";
}
