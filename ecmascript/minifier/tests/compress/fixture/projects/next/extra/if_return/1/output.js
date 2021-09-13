export function foo() {
    var obj;
    return state.loading || state.error ? _react.default.createElement(opts.loading, {
        isLoading: state.loading,
        pastDelay: state.pastDelay,
        timedOut: state.timedOut,
        error: state.error,
        retry: subscription.retry
    }) : state.loaded ? _react.default.createElement((obj = state.loaded) && obj.__esModule ? obj.default : obj, props) : null;
}
