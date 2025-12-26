function withContext(ComposedComponent) {
    var WithContext;
    return WithContext = /*#__PURE__*/ function(Component1) {
        "use strict";
        _inherits(WithContext, Component1);
        function WithContext() {
            _class_call_check(this, WithContext);
            return _call_super(this, WithContext, arguments);
        }
        return WithContext;
    }(Component), _define_property(WithContext, "propTypes", {
        context: PropTypes.shape({
            addCss: PropTypes.func,
            setTitle: PropTypes.func,
            setMeta: PropTypes.func
        })
    }), WithContext;
}
