(function() {
    if (typeof Symbol === "function" && Symbol.for) {
        var a = Symbol.for;
        REACT_ELEMENT_TYPE = a("react.element");
        REACT_PORTAL_TYPE = a("react.portal");
        exports.Fragment = a("react.fragment");
        exports.StrictMode = a("react.strict_mode");
        exports.Profiler = a("react.profiler");
        REACT_PROVIDER_TYPE = a("react.provider");
        REACT_CONTEXT_TYPE = a("react.context");
        REACT_FORWARD_REF_TYPE = a("react.forward_ref");
        exports.Suspense = a("react.suspense");
        REACT_SUSPENSE_LIST_TYPE = a("react.suspense_list");
        REACT_MEMO_TYPE = a("react.memo");
        REACT_LAZY_TYPE = a("react.lazy");
        REACT_BLOCK_TYPE = a("react.block");
        REACT_SERVER_BLOCK_TYPE = a("react.server.block");
        REACT_FUNDAMENTAL_TYPE = a("react.fundamental");
        REACT_SCOPE_TYPE = a("react.scope");
        REACT_OPAQUE_ID_TYPE = a("react.opaque.id");
        REACT_DEBUG_TRACING_MODE_TYPE = a("react.debug_trace_mode");
        REACT_OFFSCREEN_TYPE = a("react.offscreen");
        REACT_LEGACY_HIDDEN_TYPE = a("react.legacy_hidden");
    }
})();
