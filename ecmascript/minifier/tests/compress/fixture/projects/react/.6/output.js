function Component(
    props, context, updater
) {
    (this.props = props),
        (this.context = context),
        (this.refs = emptyObject),
        (this.updater = updater || ReactNoopUpdateQueue);
}
(Component.prototype.isReactComponent = {
}),
    (Component.prototype.setState = function (
        partialState, callback
    ) {
        if (
            "object" != typeof partialState &&
            "function" != typeof partialState &&
            null != partialState
        )
            throw Error(
                "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
            );
        this.updater.enqueueSetState(
            this,
            partialState,
            callback,
            "setState"
        );
    }),
    (Component.prototype.forceUpdate = function (
        callback
    ) {
        this.updater.enqueueForceUpdate(
            this,
            callback,
            "forceUpdate"
        );
    });
var deprecatedAPIs = {
    isMounted: [
        "isMounted",
        "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.",
    ],
    replaceState: [
        "replaceState",
        "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236).",
    ],
},
    defineDeprecationWarning = function (
        methodName, info
    ) {
        Object.defineProperty(
            Component.prototype,
            methodName,
            {
                get: function (
                ) {
                    warn(
                        "%s(...) is deprecated in plain JavaScript React classes. %s",
                        info[0],
                        info[1],
                    );
                },
            }
        );
    };
for (var fnName in deprecatedAPIs)
    deprecatedAPIs.hasOwnProperty(
        fnName
    ) &&
        defineDeprecationWarning(
            fnName,
            deprecatedAPIs[fnName]
        );
function ComponentDummy(
) { }
function PureComponent(
    props, context, updater
) {
    (this.props = props),
        (this.context = context),
        (this.refs = emptyObject),
        (this.updater = updater || ReactNoopUpdateQueue);
}
ComponentDummy.prototype = Component.prototype;
var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy(
));
function getContextName(
    type
) {
    return type.displayName || "Context";
}
function getComponentName(
    type
) {
    if (null == type) return null;
    if (
        ("number" == typeof type.tag &&
            error(
                "Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue.",
            ),
            "function" == typeof type)
    )
        return type.displayName || type.name || null;
    if ("string" == typeof type) return type;
    switch (type) {
        case exports.Fragment:
            return "Fragment";
        case REACT_PORTAL_TYPE:
            return "Portal";
        case exports.Profiler:
            return "Profiler";
        case exports.StrictMode:
            return "StrictMode";
        case exports.Suspense:
            return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
    }
    if ("object" == typeof type)
        switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
                return getContextName(
                    type
                ) + ".Consumer";
            case REACT_PROVIDER_TYPE:
                return getContextName(
                    type._context
                ) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
                return (
                    (outerType = type),
                    (innerType = type.render),
                    (wrapperName = "ForwardRef"),
                    (functionName = innerType.displayName || innerType.name || ""),
                    outerType.displayName ||
                    ("" !== functionName
                        ? wrapperName + "(" + functionName + ")"
                        : wrapperName)
                );
            case REACT_MEMO_TYPE:
                return getComponentName(
                    type.type
                );
            case REACT_BLOCK_TYPE:
                return getComponentName(
                    type._render
                );
            case REACT_LAZY_TYPE:
                var lazyComponent = type,
                    payload = lazyComponent._payload,
                    init = lazyComponent._init;
                try {
                    return getComponentName(
                        init(
                            payload
                        )
                    );
                } catch (x) {
                    return null;
                }
        }
    var outerType, innerType, wrapperName, functionName;
    return null;
}
(pureComponentPrototype.constructor = PureComponent),
    assign(
        pureComponentPrototype,
        Component.prototype
    ),
    (pureComponentPrototype.isPureReactComponent = !0);
var specialPropKeyWarningShown,
    specialPropRefWarningShown,
    didWarnAboutStringRefs,
    hasOwnProperty$1 = Object.prototype.hasOwnProperty,
    RESERVED_PROPS = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0,
    };
function hasValidRef(
    config
) {
    if (hasOwnProperty$1.call(
        config,
        "ref"
    )) {
        var getter = Object.getOwnPropertyDescriptor(
            config,
            "ref"
        ).get;
        if (getter && getter.isReactWarning) return !1;
    }
    return void 0 !== config.ref;
}
function hasValidKey(
    config
) {
    if (hasOwnProperty$1.call(
        config,
        "key"
    )) {
        var getter = Object.getOwnPropertyDescriptor(
            config,
            "key"
        ).get;
        if (getter && getter.isReactWarning) return !1;
    }
    return void 0 !== config.key;
}
function defineKeyPropWarningGetter(
    props, displayName
) {
    var warnAboutAccessingKey = function (
    ) {
        specialPropKeyWarningShown ||
            ((specialPropKeyWarningShown = !0),
                error(
                    "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    displayName,
                ));
    };
    (warnAboutAccessingKey.isReactWarning = !0),
        Object.defineProperty(
            props,
            "key",
            {
                get: warnAboutAccessingKey,
                configurable: !0,
            }
        );
}
function defineRefPropWarningGetter(
    props, displayName
) {
    var warnAboutAccessingRef = function (
    ) {
        specialPropRefWarningShown ||
            ((specialPropRefWarningShown = !0),
                error(
                    "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    displayName,
                ));
    };
    (warnAboutAccessingRef.isReactWarning = !0),
        Object.defineProperty(
            props,
            "ref",
            {
                get: warnAboutAccessingRef,
                configurable: !0,
            }
        );
}
function warnIfStringRefCannotBeAutoConverted(
    config
) {
    if (
        "string" == typeof config.ref &&
        ReactCurrentOwner.current &&
        config.__self &&
        ReactCurrentOwner.current.stateNode !== config.__self
    ) {
        var componentName = getComponentName(
            ReactCurrentOwner.current.type
        );
        didWarnAboutStringRefs[componentName] ||
            (error(
                'Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',
                componentName,
                config.ref,
            ),
                (didWarnAboutStringRefs[componentName] = !0));
    }
}
didWarnAboutStringRefs = {
};