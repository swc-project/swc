class Component extends ReactComponent {
}
Component.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node,
    baz: PropTypes.string.isRequired
}, Component.defaultProps = {
    foo: 42
}, React.createElement(Component, {
    foo: 12,
    bar: "yes",
    baz: "yeah"
}), React.createElement(Component, {
    foo: 12
}), React.createElement(Component, {
    bar: "yes",
    baz: "yeah"
}), React.createElement(Component, {
    bar: "yes",
    baz: "yo",
    bat: "ohno"
}), React.createElement(Component, {
    foo: 12,
    bar: null,
    baz: "cool"
}), React.createElement(Component, {
    foo: 12,
    bar: "yeah",
    baz: null
});
class JustPropTypes extends ReactComponent {
}
JustPropTypes.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
}, React.createElement(JustPropTypes, {
    foo: 12,
    bar: "ok"
}), React.createElement(JustPropTypes, {
    foo: "no"
}), React.createElement(JustPropTypes, {
    foo: null,
    bar: "ok"
}), React.createElement(JustPropTypes, {
    foo: 12,
    bar: null
});
class JustDefaultProps extends ReactComponent {
}
JustDefaultProps.defaultProps = {
    foo: 42
}, React.createElement(JustDefaultProps, {
    foo: 12
}), React.createElement(JustDefaultProps, {
    foo: 12,
    bar: "ok"
}), React.createElement(JustDefaultProps, {
    foo: "no"
});
class BothWithSpecifiedGeneric extends ReactComponent {
}
BothWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node,
    baz: PropTypes.number.isRequired
}, BothWithSpecifiedGeneric.defaultProps = {
    foo: "yo"
}, React.createElement(BothWithSpecifiedGeneric, {
    foo: "fine",
    bar: "yes",
    baz: 12
}), React.createElement(BothWithSpecifiedGeneric, {
    foo: "no"
}), React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12
}), React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12,
    bat: "ohno"
}), React.createElement(BothWithSpecifiedGeneric, {
    foo: "no",
    bar: null,
    baz: 0
}), React.createElement(BothWithSpecifiedGeneric, {
    foo: "eh",
    bar: "yeah",
    baz: null
});
class JustPropTypesWithSpecifiedGeneric extends ReactComponent {
}
JustPropTypesWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
}, React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "nice",
    bar: "ok"
}), React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: 12
}), React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: null,
    bar: "ok"
}), React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "cool",
    bar: null
});
class JustDefaultPropsWithSpecifiedGeneric extends ReactComponent {
}
JustDefaultPropsWithSpecifiedGeneric.defaultProps = {
    foo: "no"
}, React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "eh"
}), React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "no",
    bar: "ok"
}), React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: 12
}), React.createElement(JustDefaultPropsWithSpecifiedGeneric, null);
