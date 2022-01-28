export function foo(
) {
    if (state.loading || state.error)
        return _react.default.createElement(
            opts.loading,
            {
                isLoading: state.loading,
                pastDelay: state.pastDelay,
                timedOut: state.timedOut,
                error: state.error,
                retry: subscription.retry,
            }
        );
    if (!state.loaded) return null;
    var obj;
    return _react.default.createElement(
        (obj = state.loaded) && obj.__esModule ? obj.default : obj,
        props
    );
}
