function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
    function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
    }

    if (type == null) {
        return "";
    }

    if (typeof type === "function") {
        {
            return describeNativeComponentFrame(type, shouldConstruct(type));
        }
    }

    if (typeof type === "string") {
        return describeBuiltInComponentFrame(type);
    }

    switch (type) {
        case exports.Suspense:
            return describeBuiltInComponentFrame("Suspense");

        case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
    }

    if (typeof type === "object") {
        switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);

            case REACT_MEMO_TYPE:
                // Memo may contain any component type so we recursively resolve it.
                return describeUnknownElementTypeFrameInDEV(
                    type.type,
                    source,
                    ownerFn
                );

            case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(type._render);

            case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;

                try {
                    // Lazy may contain any component type so we recursively resolve it.
                    return describeUnknownElementTypeFrameInDEV(
                        init(payload),
                        source,
                        ownerFn
                    );
                } catch (x) {}
            }
        }
    }

    return "";
}
