function withContext(ComposedComponent) {
    var _WithContext;
    return _WithContext = /*#__PURE__*/ function(Component1) {
        "use strict";
        _inherits(WithContext, Component1);
        function WithContext() {
            _class_call_check(this, WithContext);
            return _call_super(this, WithContext, arguments);
        }
        return WithContext;
    }(Component), _define_property(_WithContext, "propTypes", {
        context: PropTypes.shape({
            addCss: PropTypes.func,
            setTitle: PropTypes.func,
            setMeta: PropTypes.func
        })
    }), _WithContext;
}
