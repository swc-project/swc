export function foo() {
    if (state.loading || state.error) return _react.default.createElement(opts.loading, {
        isLoading: state.loading,
        pastDelay: state.pastDelay,
        timedOut: state.timedOut,
        error: state.error,
        retry: subscription.retry
    });
    if (!state.loaded) return null;
    var a;
    return _react.default.createElement((a = state.loaded) && a.__esModule ? a.default : a, props);
}
