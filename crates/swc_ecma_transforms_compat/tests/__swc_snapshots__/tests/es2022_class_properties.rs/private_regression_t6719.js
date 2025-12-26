function withContext(ComposedComponent) {
    var _propTypes = new WeakMap(), WithContext;
    return WithContext = class WithContext extends Component {
    }, _propTypes.set(WithContext, {
        writable: true,
        value: {
            context: PropTypes.shape({
                addCss: PropTypes.func,
                setTitle: PropTypes.func,
                setMeta: PropTypes.func
            })
        }
    }), WithContext;
}
