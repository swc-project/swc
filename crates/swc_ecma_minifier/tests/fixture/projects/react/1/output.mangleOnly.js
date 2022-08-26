(function() {
    if (typeof Symbol === "function" && Symbol.for) {
        var e = Symbol.for;
        REACT_ELEMENT_TYPE = e("react.element");
        REACT_PORTAL_TYPE = e("react.portal");
        exports.Fragment = e("react.fragment");
        exports.StrictMode = e("react.strict_mode");
        exports.Profiler = e("react.profiler");
        REACT_PROVIDER_TYPE = e("react.provider");
        REACT_CONTEXT_TYPE = e("react.context");
        REACT_FORWARD_REF_TYPE = e("react.forward_ref");
        exports.Suspense = e("react.suspense");
        REACT_SUSPENSE_LIST_TYPE = e("react.suspense_list");
        REACT_MEMO_TYPE = e("react.memo");
        REACT_LAZY_TYPE = e("react.lazy");
        REACT_BLOCK_TYPE = e("react.block");
        REACT_SERVER_BLOCK_TYPE = e("react.server.block");
        REACT_FUNDAMENTAL_TYPE = e("react.fundamental");
        REACT_SCOPE_TYPE = e("react.scope");
        REACT_OPAQUE_ID_TYPE = e("react.opaque.id");
        REACT_DEBUG_TRACING_MODE_TYPE = e("react.debug_trace_mode");
        REACT_OFFSCREEN_TYPE = e("react.offscreen");
        REACT_LEGACY_HIDDEN_TYPE = e("react.legacy_hidden");
    }
})();
