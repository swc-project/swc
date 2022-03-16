class Component extends ReactComponent {
}
Component.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node,
    baz: PropTypes.string.isRequired
}, Component.defaultProps = {
    foo: 42
}, (class extends ReactComponent {
}).propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
}, (class extends ReactComponent {
}).defaultProps = {
    foo: 42
};
class BothWithSpecifiedGeneric extends ReactComponent {
}
BothWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node,
    baz: PropTypes.number.isRequired
}, BothWithSpecifiedGeneric.defaultProps = {
    foo: "yo"
}, (class extends ReactComponent {
}).propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
}, (class extends ReactComponent {
}).defaultProps = {
    foo: "no"
};
