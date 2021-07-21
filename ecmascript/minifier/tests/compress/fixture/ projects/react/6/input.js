
function Component(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

Component.prototype.setState = function (partialState, callback) {
    if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
        {
            throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        }
    }

    this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


{
    var deprecatedAPIs = {
        isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };

    var defineDeprecationWarning = function (methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
            get: function () {
                warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

                return undefined;
            }
        });
    };

    for (var fnName in deprecatedAPIs) {
        if (deprecatedAPIs.hasOwnProperty(fnName)) {
            defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        }
    }
}

function ComponentDummy() { }

ComponentDummy.prototype = Component.prototype;
/**
 * Convenience component with default shallow equality check for sCU.
 */

function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

assign(pureComponentPrototype, Component.prototype);

pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
    var refObject = {
        current: null
    };

    {
        Object.seal(refObject);
    }

    return refObject;
}

function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
}

function getContextName(type) {
    return type.displayName || 'Context';
}

function getComponentName(type) {
    if (type == null) {
        // Host root, text node or just invalid type.
        return null;
    }

    {
        if (typeof type.tag === 'number') {
            error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
        }
    }

    if (typeof type === 'function') {
        return type.displayName || type.name || null;
    }

    if (typeof type === 'string') {
        return type;
    }

    switch (type) {
        case exports.Fragment:
            return 'Fragment';

        case REACT_PORTAL_TYPE:
            return 'Portal';

        case exports.Profiler:
            return 'Profiler';

        case exports.StrictMode:
            return 'StrictMode';

        case exports.Suspense:
            return 'Suspense';

        case REACT_SUSPENSE_LIST_TYPE:
            return 'SuspenseList';
    }

    if (typeof type === 'object') {
        switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + '.Consumer';

            case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + '.Provider';

            case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, 'ForwardRef');

            case REACT_MEMO_TYPE:
                return getComponentName(type.type);

            case REACT_BLOCK_TYPE:
                return getComponentName(type._render);

            case REACT_LAZY_TYPE:
                {
                    var lazyComponent = type;
                    var payload = lazyComponent._payload;
                    var init = lazyComponent._init;

                    try {
                        return getComponentName(init(payload));
                    } catch (x) {
                        return null;
                    }
                }
        }
    }

    return null;
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};
var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

{
    didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
    {
        if (hasOwnProperty$1.call(config, 'ref')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

            if (getter && getter.isReactWarning) {
                return false;
            }
        }
    }

    return config.ref !== undefined;
}

function hasValidKey(config) {
    {
        if (hasOwnProperty$1.call(config, 'key')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

            if (getter && getter.isReactWarning) {
                return false;
            }
        }
    }

    return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
        {
            if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;

                error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
            }
        }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true
    });
}

function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
        {
            if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;

                error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
            }
        }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
        get: warnAboutAccessingRef,
        configurable: true
    });
}

function warnIfStringRefCannotBeAutoConverted(config) {
    {
        if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
            var componentName = getComponentName(ReactCurrentOwner.current.type);

            if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

                didWarnAboutStringRefs[componentName] = true;
            }
        }
    }
}