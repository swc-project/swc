// @jsx: preserve
// @strict: true
class Component extends ReactComponent {
}
Component.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node,
    baz: PropTypes.string.isRequired
};
Component.defaultProps = {
    foo: 42
};
const a = /*#__PURE__*/ React.createElement(Component, {
    foo: 12,
    bar: "yes",
    baz: "yeah"
});
const b = /*#__PURE__*/ React.createElement(Component, {
    foo: 12
}); // Error, missing required prop bar
const c = /*#__PURE__*/ React.createElement(Component, {
    bar: "yes",
    baz: "yeah"
});
const d = /*#__PURE__*/ React.createElement(Component, {
    bar: "yes",
    baz: "yo",
    bat: "ohno"
}); // Error, baz not a valid prop
const e = /*#__PURE__*/ React.createElement(Component, {
    foo: 12,
    bar: null,
    baz: "cool"
}); // bar is nullable/undefinable since it's not marked `isRequired`
const f = /*#__PURE__*/ React.createElement(Component, {
    foo: 12,
    bar: "yeah",
    baz: null
}); // Error, baz is _not_ nullable/undefinable since it's marked `isRequired`
class JustPropTypes extends ReactComponent {
}
JustPropTypes.propTypes = {
    foo: PropTypes.number,
    bar: PropTypes.node.isRequired
};
const g = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: 12,
    bar: "ok"
});
const h = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: "no"
}); // error, wrong type
const i = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: null,
    bar: "ok"
});
const j = /*#__PURE__*/ React.createElement(JustPropTypes, {
    foo: 12,
    bar: null
}); // error, bar is required
class JustDefaultProps extends ReactComponent {
}
JustDefaultProps.defaultProps = {
    foo: 42
};
const k = /*#__PURE__*/ React.createElement(JustDefaultProps, {
    foo: 12
});
const l = /*#__PURE__*/ React.createElement(JustDefaultProps, {
    foo: 12,
    bar: "ok"
}); // error, no prop named bar
const m = /*#__PURE__*/ React.createElement(JustDefaultProps, {
    foo: "no"
}); // error, wrong type
class BothWithSpecifiedGeneric extends ReactComponent {
}
BothWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node,
    baz: PropTypes.number.isRequired
};
BothWithSpecifiedGeneric.defaultProps = {
    foo: "yo"
};
const n = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "fine",
    bar: "yes",
    baz: 12
});
const o = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "no"
}); // Error, missing required prop bar
const p = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12
});
const q = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    bar: "yes",
    baz: 12,
    bat: "ohno"
}); // Error, baz not a valid prop
const r = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "no",
    bar: null,
    baz: 0
}); // bar is nullable/undefinable since it's not marked `isRequired`
const s = /*#__PURE__*/ React.createElement(BothWithSpecifiedGeneric, {
    foo: "eh",
    bar: "yeah",
    baz: null
}); // Error, baz is _not_ nullable/undefinable since it's marked `isRequired`
class JustPropTypesWithSpecifiedGeneric extends ReactComponent {
}
JustPropTypesWithSpecifiedGeneric.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.node.isRequired
};
const t = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "nice",
    bar: "ok"
});
const u = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: 12
}); // error, wrong type
const v = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: null,
    bar: "ok"
}); // generic overrides propTypes required-ness, null isn't valid
const w = /*#__PURE__*/ React.createElement(JustPropTypesWithSpecifiedGeneric, {
    foo: "cool",
    bar: null
}); // error, bar is required
class JustDefaultPropsWithSpecifiedGeneric extends ReactComponent {
}
JustDefaultPropsWithSpecifiedGeneric.defaultProps = {
    foo: "no"
};
const x = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "eh"
});
const y = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: "no",
    bar: "ok"
}); // error, no prop named bar
const z = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, {
    foo: 12
}); // error, wrong type
const aa = /*#__PURE__*/ React.createElement(JustDefaultPropsWithSpecifiedGeneric, null);
