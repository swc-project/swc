(function() {
    if (typeof Symbol === "function" && Symbol.for) {
        var r = Symbol.for;
        REACT_ELEMENT_TYPE = r("react.element");
        REACT_PORTAL_TYPE = r("react.portal");
        exports.Fragment = r("react.fragment");
        exports.StrictMode = r("react.strict_mode");
        exports.Profiler = r("react.profiler");
        REACT_PROVIDER_TYPE = r("react.provider");
        REACT_CONTEXT_TYPE = r("react.context");
        REACT_FORWARD_REF_TYPE = r("react.forward_ref");
        exports.Suspense = r("react.suspense");
        REACT_SUSPENSE_LIST_TYPE = r("react.suspense_list");
        REACT_MEMO_TYPE = r("react.memo");
        REACT_LAZY_TYPE = r("react.lazy");
        REACT_BLOCK_TYPE = r("react.block");
        REACT_SERVER_BLOCK_TYPE = r("react.server.block");
        REACT_FUNDAMENTAL_TYPE = r("react.fundamental");
        REACT_SCOPE_TYPE = r("react.scope");
        REACT_OPAQUE_ID_TYPE = r("react.opaque.id");
        REACT_DEBUG_TRACING_MODE_TYPE = r("react.debug_trace_mode");
        REACT_OFFSCREEN_TYPE = r("react.offscreen");
        REACT_LEGACY_HIDDEN_TYPE = r("react.legacy_hidden");
    }
})();
