function e(r, t, n) {
    function u(e) {
        var r = e.prototype;
        return !!(r && r.isReactComponent);
    }
    if (r == null) {
        return "";
    }
    if (typeof r === "function") {
        {
            return describeNativeComponentFrame(r, u(r));
        }
    }
    if (typeof r === "string") {
        return describeBuiltInComponentFrame(r);
    }
    switch(r){
        case exports.Suspense:
            return describeBuiltInComponentFrame("Suspense");
        case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
    }
    if (typeof r === "object") {
        switch(r.$$typeof){
            case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(r.render);
            case REACT_MEMO_TYPE:
                return e(r.type, t, n);
            case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(r._render);
            case REACT_LAZY_TYPE:
                {
                    var s = r;
                    var c = s._payload;
                    var a = s._init;
                    try {
                        return e(a(c), t, n);
                    } catch (i) {}
                }
        }
    }
    return "";
}
