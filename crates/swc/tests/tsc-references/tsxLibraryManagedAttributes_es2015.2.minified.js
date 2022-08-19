class Component extends ReactComponent {
}
Component.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node,
    baz: PropTypes.string.isRequired
}, Component.defaultProps = {
    foo: 42
}, PropTypes.number, PropTypes.node.isRequired;
class BothWithSpecifiedGeneric extends ReactComponent {
}
BothWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node,
    baz: PropTypes.number.isRequired
}, BothWithSpecifiedGeneric.defaultProps = {
    foo: "yo"
}, PropTypes.string, PropTypes.node.isRequired;
