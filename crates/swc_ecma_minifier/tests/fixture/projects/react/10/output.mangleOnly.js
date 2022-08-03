function r(e, t, n) {
    function u(r) {
        var e = r.prototype;
        return !!(e && e.isReactComponent);
    }
    if (e == null) {
        return "";
    }
    if (typeof e === "function") {
        {
            return describeNativeComponentFrame(e, u(e));
        }
    }
    if (typeof e === "string") {
        return describeBuiltInComponentFrame(e);
    }
    switch(e){
        case exports.Suspense:
            return describeBuiltInComponentFrame("Suspense");
        case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
    }
    if (typeof e === "object") {
        switch(e.$$typeof){
            case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(e.render);
            case REACT_MEMO_TYPE:
                return r(e.type, t, n);
            case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(e._render);
            case REACT_LAZY_TYPE:
                {
                    var a = e;
                    var c = a._payload;
                    var i = a._init;
                    try {
                        return r(i(c), t, n);
                    } catch (o) {}
                }
        }
    }
    return "";
}
