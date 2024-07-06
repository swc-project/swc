/** @license React v17.0.1
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== process.env.NODE_ENV && function() {
    var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd, prefix, componentFrameCache, propTypesMisspellWarningShown, _assign = require("object-assign"), REACT_ELEMENT_TYPE = 0xeac7, REACT_PORTAL_TYPE = 0xeaca;
    exports.Fragment = 0xeacb, exports.StrictMode = 0xeacc, exports.Profiler = 0xead2;
    var REACT_PROVIDER_TYPE = 0xeacd, REACT_CONTEXT_TYPE = 0xeace, REACT_FORWARD_REF_TYPE = 0xead0;
    exports.Suspense = 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = 0xead8, REACT_MEMO_TYPE = 0xead3, REACT_LAZY_TYPE = 0xead4, REACT_BLOCK_TYPE = 0xead9, REACT_SERVER_BLOCK_TYPE = 0xeada, REACT_FUNDAMENTAL_TYPE = 0xead5, REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1, REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
    if ("function" == typeof Symbol && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor("react.element"), REACT_PORTAL_TYPE = symbolFor("react.portal"), exports.Fragment = symbolFor("react.fragment"), exports.StrictMode = symbolFor("react.strict_mode"), exports.Profiler = symbolFor("react.profiler"), REACT_PROVIDER_TYPE = symbolFor("react.provider"), REACT_CONTEXT_TYPE = symbolFor("react.context"), REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref"), exports.Suspense = symbolFor("react.suspense"), REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list"), REACT_MEMO_TYPE = symbolFor("react.memo"), REACT_LAZY_TYPE = symbolFor("react.lazy"), REACT_BLOCK_TYPE = symbolFor("react.block"), REACT_SERVER_BLOCK_TYPE = symbolFor("react.server.block"), REACT_FUNDAMENTAL_TYPE = symbolFor("react.fundamental"), symbolFor("react.scope"), symbolFor("react.opaque.id"), REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode"), symbolFor("react.offscreen"), REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
    }
    var MAYBE_ITERATOR_SYMBOL = "function" == typeof Symbol && Symbol.iterator;
    function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" != typeof maybeIterable) return null;
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" == typeof maybeIterator ? maybeIterator : null;
    }
    /**
     * Keeps track of the current dispatcher.
     */ var ReactCurrentDispatcher = {
        /**
       * @internal
       * @type {ReactComponent}
       */ current: null
    }, ReactCurrentOwner = {
        /**
       * @internal
       * @type {ReactComponent}
       */ current: null
    }, ReactDebugCurrentFrame = {}, currentExtraStackFrame = null;
    ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
        currentExtraStackFrame = stack;
    }, ReactDebugCurrentFrame.getCurrentStack = null, ReactDebugCurrentFrame.getStackAddendum = function() {
        var stack = ""; // Add an extra top frame while an element is being validated
        currentExtraStackFrame && (stack += currentExtraStackFrame);
        var impl = ReactDebugCurrentFrame.getCurrentStack;
        return impl && (stack += impl() || ""), stack;
    };
    var ReactSharedInternals = {
        ReactCurrentDispatcher: ReactCurrentDispatcher,
        ReactCurrentBatchConfig: {
            transition: 0
        },
        ReactCurrentOwner: ReactCurrentOwner,
        IsSomeRendererActing: {
            current: !1
        },
        // Used by renderers to avoid bundling object-assign twice in UMD bundles:
        assign: _assign
    };
    // by calls to these methods by a Babel plugin.
    //
    // In PROD (or in packages without access to React internals),
    // they are left as they are instead.
    function warn(format) {
        for(var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
        printWarning("warn", format, args);
    }
    function error(format) {
        for(var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)args[_key2 - 1] = arguments[_key2];
        printWarning("error", format, args);
    }
    function printWarning(level, format, args) {
        var stack = ReactSharedInternals.ReactDebugCurrentFrame.getStackAddendum();
        "" !== stack && (format += "%s", args = args.concat([
            stack
        ]));
        var argsWithFormat = args.map(function(item) {
            return "" + item;
        }); // Careful: RN currently depends on this prefix
        argsWithFormat.unshift("Warning: " + format), // breaks IE9: https://github.com/facebook/react/issues/13610
        // eslint-disable-next-line react-internal/no-production-logging
        Function.prototype.apply.call(console[level], console, argsWithFormat);
    }
    ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
    var didWarnStateUpdateForUnmountedComponent = {};
    function warnNoop(publicInstance, callerName) {
        var _constructor = publicInstance.constructor, componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass", warningKey = componentName + "." + callerName;
        !didWarnStateUpdateForUnmountedComponent[warningKey] && (error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName), didWarnStateUpdateForUnmountedComponent[warningKey] = !0);
    }
    /**
     * This is the abstract API for an update queue.
     */ var ReactNoopUpdateQueue = {
        /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */ isMounted: function(publicInstance) {
            return !1;
        },
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
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */ enqueueForceUpdate: function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
        },
        /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */ enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, "replaceState");
        },
        /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} Name of the calling function in the public API.
       * @internal
       */ enqueueSetState: function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, "setState");
        }
    }, emptyObject = {};
    /**
     * Base class helpers for the updating state of a component.
     */ function Component(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, // renderer.
        this.updater = updater || ReactNoopUpdateQueue;
    }
    Object.freeze(emptyObject), Component.prototype.isReactComponent = {}, /**
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
     */ Component.prototype.setState = function(partialState, callback) {
        if (!("object" == typeof partialState || "function" == typeof partialState || null == partialState)) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, partialState, callback, "setState");
    }, /**
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
     */ Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    var deprecatedAPIs = {
        isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
    }, defineDeprecationWarning = function(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
            get: function() {
                warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
            }
        });
    };
    for(var fnName in deprecatedAPIs)deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    function ComponentDummy() {}
    /**
     * Convenience component with default shallow equality check for sCU.
     */ function PureComponent(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
    }
    ComponentDummy.prototype = Component.prototype;
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    function getContextName(type) {
        return type.displayName || "Context";
    }
    function getComponentName(type) {
        if (null == type) // Host root, text node or just invalid type.
        return null;
        if ("number" == typeof type.tag && error("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), "function" == typeof type) return type.displayName || type.name || null;
        if ("string" == typeof type) return type;
        switch(type){
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
        if ("object" == typeof type) switch(type.$$typeof){
            case REACT_CONTEXT_TYPE:
                return getContextName(type) + ".Consumer";
            case REACT_PROVIDER_TYPE:
                return getContextName(type._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
                var innerType, wrapperName, functionName;
                return innerType = type.render, wrapperName = "ForwardRef", functionName = innerType.displayName || innerType.name || "", type.displayName || ("" !== functionName ? wrapperName + "(" + functionName + ")" : wrapperName);
            case REACT_MEMO_TYPE:
                return getComponentName(type.type);
            case REACT_BLOCK_TYPE:
                return getComponentName(type._render);
            case REACT_LAZY_TYPE:
                var payload = type._payload, init = type._init;
                try {
                    return getComponentName(init(payload));
                } catch (x) {}
        }
        return null;
    }
    pureComponentPrototype.constructor = PureComponent, _assign(pureComponentPrototype, Component.prototype), pureComponentPrototype.isPureReactComponent = !0;
    var hasOwnProperty = Object.prototype.hasOwnProperty, RESERVED_PROPS = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };
    function hasValidRef(config) {
        if (hasOwnProperty.call(config, "ref")) {
            var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.ref;
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    didWarnAboutStringRefs = {};
    /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, instanceof check
     * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} props
     * @param {*} key
     * @param {string|object} ref
     * @param {*} owner
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @internal
     */ var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type: type,
            key: key,
            ref: ref,
            props: props,
            // Record the component responsible for creating this element.
            _owner: owner
        };
        return(// The validation flag is currently mutative. We put it on
        // an external backing store so that we can freeze the whole object.
        // This can be replaced with a WeakMap once they are implemented in
        // commonly used development environments.
        element._store = {}, // the validation flag non-enumerable (where possible, which should
        // include every environment we run tests in), so the test framework
        // ignores it.
        Object.defineProperty(element._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: !1
        }), Object.defineProperty(element, "_self", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: self
        }), // equal for testing purposes and therefore we hide it from enumeration.
        Object.defineProperty(element, "_source", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: source
        }), Object.freeze && (Object.freeze(element.props), Object.freeze(element)), element);
    };
    /**
     * Create and return a new ReactElement of the given type.
     * See https://reactjs.org/docs/react-api.html#createelement
     */ function createElement(type, config, children) {
        var propName, props = {}, key = null, ref = null, self = null, source = null;
        if (null != config) for(propName in hasValidRef(config) && (ref = config.ref, function(config) {
            if ("string" == typeof config.ref && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
                var componentName = getComponentName(ReactCurrentOwner.current.type);
                didWarnAboutStringRefs[componentName] || (error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref), didWarnAboutStringRefs[componentName] = !0);
            }
        }(config)), hasValidKey(config) && (key = "" + config.key), self = void 0 === config.__self ? null : config.__self, source = void 0 === config.__source ? null : config.__source, config)hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (props[propName] = config[propName]);
         // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (childrenLength > 1) {
            for(var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)childArray[i] = arguments[i + 2];
            Object.freeze && Object.freeze(childArray), props.children = childArray;
        } // Resolve default props
        if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for(propName in defaultProps)void 0 === props[propName] && (props[propName] = defaultProps[propName]);
        }
        if (key || ref) {
            var warnAboutAccessingKey, warnAboutAccessingRef, displayName = "function" == typeof type ? type.displayName || type.name || "Unknown" : type;
            key && ((warnAboutAccessingKey = function() {
                specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
            }).isReactWarning = !0, Object.defineProperty(props, "key", {
                get: warnAboutAccessingKey,
                configurable: !0
            })), ref && ((warnAboutAccessingRef = function() {
                specialPropRefWarningShown || (specialPropRefWarningShown = !0, error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
            }).isReactWarning = !0, Object.defineProperty(props, "ref", {
                get: warnAboutAccessingRef,
                configurable: !0
            }));
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    }
    /**
     * Clone and return a new ReactElement using element as the starting point.
     * See https://reactjs.org/docs/react-api.html#cloneelement
     */ function cloneElement(element, config, children) {
        if (!(null != element)) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
        var propName, defaultProps, props = _assign({}, element.props), key = element.key, ref = element.ref, self = element._self, source = element._source, owner = element._owner; // Reserved names are extracted
        if (null != config) for(propName in hasValidRef(config) && (// Silently steal the ref from the parent.
        ref = config.ref, owner = ReactCurrentOwner.current), hasValidKey(config) && (key = "" + config.key), element.type && element.type.defaultProps && (defaultProps = element.type.defaultProps), config)hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (void 0 === config[propName] && void 0 !== defaultProps ? // Resolve default props
        props[propName] = defaultProps[propName] : props[propName] = config[propName]);
         // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (childrenLength > 1) {
            for(var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)childArray[i] = arguments[i + 2];
            props.children = childArray;
        }
        return ReactElement(element.type, key, ref, self, source, owner, props);
    }
    /**
     * Verifies the object is a ReactElement.
     * See https://reactjs.org/docs/react-api.html#isvalidelement
     * @param {?object} object
     * @return {boolean} True if `object` is a ReactElement.
     * @final
     */ function isValidElement(object) {
        return "object" == typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    /**
     * TODO: Test that a single child and an array with one item have the same key
     * pattern.
     */ var didWarnAboutMaps = !1, userProvidedKeyEscapeRegex = /\/+/g;
    function escapeUserProvidedKey(text) {
        return text.replace(userProvidedKeyEscapeRegex, "$&/");
    }
    /**
     * Generate a key string that identifies a element within a set.
     *
     * @param {*} element A element that could contain a manual key.
     * @param {number} index Index that is used if a manual key is not provided.
     * @return {string}
     */ function getElementKey(element, index) {
        // Do some typechecking here since we call this blindly. We want to ensure
        // that we don't block potential future ES APIs.
        if ("object" == typeof element && null !== element && null != element.key) {
            var key, escaperLookup;
            // Explicit key
            return key = "" + element.key, escaperLookup = {
                "=": "=0",
                ":": "=2"
            }, "$" + key.replace(/[=:]/g, function(match) {
                return escaperLookup[match];
            });
        } // Implicit key determined by the index in the set
        return index.toString(36);
    }
    /**
     * Maps children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenmap
     *
     * The provided mapFunction(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} func The map function.
     * @param {*} context Context for mapFunction.
     * @return {object} Object containing the ordered map of results.
     */ function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        return !function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
            var type = typeof children;
            ("undefined" === type || "boolean" === type) && // All of the above are perceived as null.
            (children = null);
            var invokeCallback = !1;
            if (null === children) invokeCallback = !0;
            else switch(type){
                case "string":
                case "number":
                    invokeCallback = !0;
                    break;
                case "object":
                    switch(children.$$typeof){
                        case REACT_ELEMENT_TYPE:
                        case REACT_PORTAL_TYPE:
                            invokeCallback = !0;
                    }
            }
            if (invokeCallback) {
                var oldElement, newKey, _child = children, mappedChild = callback(_child), childKey = "" === nameSoFar ? "." + getElementKey(_child, 0) : nameSoFar;
                if (Array.isArray(mappedChild)) {
                    var escapedChildKey = "";
                    null != childKey && (escapedChildKey = escapeUserProvidedKey(childKey) + "/"), mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                        return c;
                    });
                } else null != mappedChild && (isValidElement(mappedChild) && (oldElement = mappedChild, newKey = // traverseAllChildren used to do for objects as children
                escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                (mappedChild.key && (!_child || _child.key !== mappedChild.key // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                ) ? escapeUserProvidedKey("" + mappedChild.key) + "/" : "") + childKey, mappedChild = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props)), array.push(mappedChild));
                return 1;
            }
            var subtreeCount = 0, nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":"; // Count of children found in the current subtree.
            if (Array.isArray(children)) for(var i = 0; i < children.length; i++)nextName = nextNamePrefix + getElementKey(child = children[i], i), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            else {
                var iteratorFn = getIteratorFn(children);
                if ("function" == typeof iteratorFn) {
                    var child, nextName, step, iterableChildren = children;
                    // Warn about using Maps as children
                    iteratorFn === iterableChildren.entries && (didWarnAboutMaps || warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = !0);
                    for(var iterator = iteratorFn.call(iterableChildren), ii = 0; !(step = iterator.next()).done;)nextName = nextNamePrefix + getElementKey(child = step.value, ii++), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
                } else if ("object" === type) {
                    var childrenString = "" + children;
                    throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === childrenString ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
                }
            }
            return subtreeCount;
        }(children, result, "", "", function(child) {
            return func.call(context, child, count++);
        }), result;
    }
    function lazyInitializer(payload) {
        if (-1 === payload._status) {
            var thenable = (0, payload._result)(); // Transition to the next state.
            payload._status = 0, payload._result = thenable, thenable.then(function(moduleObject) {
                if (0 === payload._status) {
                    var defaultExport = moduleObject.default;
                    void 0 === defaultExport && error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject), payload._status = 1, payload._result = defaultExport;
                }
            }, function(error) {
                0 === payload._status && (payload._status = 2, payload._result = error);
            });
        }
        if (1 === payload._status) return payload._result;
        throw payload._result;
    }
    function isValidElementType(type) {
        return "string" == typeof type || "function" == typeof type || type === exports.Fragment || type === exports.Profiler || type === REACT_DEBUG_TRACING_MODE_TYPE || type === exports.StrictMode || type === exports.Suspense || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || "object" == typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE);
    }
    function resolveDispatcher() {
        var dispatcher = ReactCurrentDispatcher.current;
        if (!(null !== dispatcher)) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
        return dispatcher;
    }
    // Helpers to patch console.logs to avoid logging during side-effect free
    // replaying on render function. This currently only patches the object
    // lazily which won't cover if the log function was extracted eagerly.
    // We could also eagerly patch the method.
    var disabledDepth = 0;
    function disabledLog() {}
    disabledLog.__reactDisabledLog = !0;
    var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
    function describeBuiltInComponentFrame(name, source, ownerFn) {
        if (void 0 === prefix) // Extract the VM specific prefix used by each line.
        try {
            throw Error();
        } catch (x) {
            var match = x.stack.trim().match(/\n( *(at )?)/);
            prefix = match && match[1] || "";
        }
         // We use the prefix to ensure our stacks line up with native stack frames.
        return "\n" + prefix + name;
    }
    var reentry = !1;
    function describeNativeComponentFrame(fn, construct) {
        // If something asked for a stack inside a fake render, it should get ignored.
        if (!fn || reentry) return "";
        var control, previousDispatcher, frame = componentFrameCache.get(fn);
        if (void 0 !== frame) return frame;
        reentry = !0;
        var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.
        Error.prepareStackTrace = void 0, previousDispatcher = ReactCurrentDispatcher$1.current, // for warnings.
        ReactCurrentDispatcher$1.current = null, function() {
            if (0 === disabledDepth) {
                /* eslint-disable react-internal/no-production-logging */ prevLog = console.log, prevInfo = console.info, prevWarn = console.warn, prevError = console.error, prevGroup = console.group, prevGroupCollapsed = console.groupCollapsed, prevGroupEnd = console.groupEnd;
                var props = {
                    configurable: !0,
                    enumerable: !0,
                    value: disabledLog,
                    writable: !0
                }; // $FlowFixMe Flow thinks console is immutable.
                Object.defineProperties(console, {
                    info: props,
                    log: props,
                    warn: props,
                    error: props,
                    group: props,
                    groupCollapsed: props,
                    groupEnd: props
                });
            /* eslint-enable react-internal/no-production-logging */ }
            disabledDepth++;
        }();
        try {
            // This should throw.
            if (construct) {
                // Something should be setting the props in the constructor.
                var Fake = function() {
                    throw Error();
                }; // $FlowFixMe
                if (Object.defineProperty(Fake.prototype, "props", {
                    set: function() {
                        // We use a throwing setter instead of frozen or non-writable props
                        // because that won't throw in a non-strict mode function.
                        throw Error();
                    }
                }), "object" == typeof Reflect && Reflect.construct) {
                    // We construct a different control for this case to include any extra
                    // frames added by the construct call.
                    try {
                        Reflect.construct(Fake, []);
                    } catch (x) {
                        control = x;
                    }
                    Reflect.construct(fn, [], Fake);
                } else {
                    try {
                        Fake.call();
                    } catch (x) {
                        control = x;
                    }
                    fn.call(Fake.prototype);
                }
            } else {
                try {
                    throw Error();
                } catch (x) {
                    control = x;
                }
                fn();
            }
        } catch (sample) {
            // This is inlined manually because closure doesn't do it for us.
            if (sample && control && "string" == typeof sample.stack) {
                for(// This extracts the first frame from the sample that isn't also in the control.
                // Skipping one frame that we assume is the frame that calls the two.
                var sampleLines = sample.stack.split("\n"), controlLines = control.stack.split("\n"), s = sampleLines.length - 1, c = controlLines.length - 1; s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c];)// We expect at least one stack frame to be shared.
                // Typically this will be the root most one. However, stack frames may be
                // cut off due to maximum stack limits. In this case, one maybe cut off
                // earlier than the other. We assume that the sample is longer or the same
                // and there for cut off earlier. So we should find the root most frame in
                // the sample somewhere in the control.
                c--;
                for(; s >= 1 && c >= 0; s--, c--)// Next we find the first one that isn't the same which should be the
                // frame that called our sample function and the control.
                if (sampleLines[s] !== controlLines[c]) {
                    // In V8, the first line is describing the message but other VMs don't.
                    // If we're about to return the first line, and the control is also on the same
                    // line, that's a pretty good indicator that our sample threw at same line as
                    // the control. I.e. before we entered the sample frame. So we ignore this result.
                    // This can happen if you passed a class to function component, or non-function.
                    if (1 !== s || 1 !== c) do // The next one that isn't the same should be our match though.
                    if (s--, --c < 0 || sampleLines[s] !== controlLines[c]) {
                        // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        return "function" == typeof fn && componentFrameCache.set(fn, _frame), _frame;
                    }
                    while (s >= 1 && c >= 0)
                    break;
                }
            }
        } finally{
            reentry = !1, ReactCurrentDispatcher$1.current = previousDispatcher, function() {
                if (0 == --disabledDepth) {
                    /* eslint-disable react-internal/no-production-logging */ var props = {
                        configurable: !0,
                        enumerable: !0,
                        writable: !0
                    }; // $FlowFixMe Flow thinks console is immutable.
                    Object.defineProperties(console, {
                        log: _assign({}, props, {
                            value: prevLog
                        }),
                        info: _assign({}, props, {
                            value: prevInfo
                        }),
                        warn: _assign({}, props, {
                            value: prevWarn
                        }),
                        error: _assign({}, props, {
                            value: prevError
                        }),
                        group: _assign({}, props, {
                            value: prevGroup
                        }),
                        groupCollapsed: _assign({}, props, {
                            value: prevGroupCollapsed
                        }),
                        groupEnd: _assign({}, props, {
                            value: prevGroupEnd
                        })
                    });
                /* eslint-enable react-internal/no-production-logging */ }
                disabledDepth < 0 && error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }(), Error.prepareStackTrace = previousPrepareStackTrace;
        } // Fallback to just using the name if we couldn't make it throw.
        var name = fn ? fn.displayName || fn.name : "", syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        return "function" == typeof fn && componentFrameCache.set(fn, syntheticFrame), syntheticFrame;
    }
    function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (null == type) return "";
        if ("function" == typeof type) return describeNativeComponentFrame(type, !!((prototype = type.prototype) && prototype.isReactComponent));
        if ("string" == typeof type) return describeBuiltInComponentFrame(type);
        switch(type){
            case exports.Suspense:
                return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
        }
        if ("object" == typeof type) switch(type.$$typeof){
            case REACT_FORWARD_REF_TYPE:
                return describeNativeComponentFrame(type.render, !1);
            case REACT_MEMO_TYPE:
                // Memo may contain any component type so we recursively resolve it.
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_BLOCK_TYPE:
                return describeNativeComponentFrame(type._render, !1);
            case REACT_LAZY_TYPE:
                var prototype, payload = type._payload, init = type._init;
                try {
                    // Lazy may contain any component type so we recursively resolve it.
                    return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {}
        }
        return "";
    }
    componentFrameCache = new ("function" == typeof WeakMap ? WeakMap : Map)();
    var loggedTypeFailures = {}, ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
    function setCurrentlyValidatingElement(element) {
        if (element) {
            var owner = element._owner, stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
        } else ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
    function setCurrentlyValidatingElement$1(element) {
        if (element) {
            var owner = element._owner;
            currentExtraStackFrame = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
        } else currentExtraStackFrame = null;
    }
    function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
            var name = getComponentName(ReactCurrentOwner.current.type);
            if (name) return "\n\nCheck the render method of `" + name + "`.";
        }
        return "";
    }
    propTypesMisspellWarningShown = !1;
    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */ var ownerHasKeyUseWarning = {};
    /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     */ function validateExplicitKey(element, parentType) {
        if (element._store && !element._store.validated && null == element.key) {
            element._store.validated = !0;
            var currentComponentErrorInfo = function(parentType) {
                var info = getDeclarationErrorAddendum();
                if (!info) {
                    var parentName = "string" == typeof parentType ? parentType : parentType.displayName || parentType.name;
                    parentName && (info = "\n\nCheck the top-level render call using <" + parentName + ">.");
                }
                return info;
            }(parentType);
            if (!ownerHasKeyUseWarning[currentComponentErrorInfo]) {
                ownerHasKeyUseWarning[currentComponentErrorInfo] = !0;
                // property, it may be the creator of the child that's responsible for
                // assigning it a key.
                var childOwner = "";
                element && element._owner && element._owner !== ReactCurrentOwner.current && // Give the component that originally created this child.
                (childOwner = " It was passed a child from " + getComponentName(element._owner.type) + "."), setCurrentlyValidatingElement$1(element), error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner), setCurrentlyValidatingElement$1(null);
            }
        }
    }
    /**
     * Ensure that every element either is passed in a static location, in an
     * array with an explicit keys property defined, or in an object literal
     * with valid key property.
     *
     * @internal
     * @param {ReactNode} node Statically passed child of any type.
     * @param {*} parentType node's parent's type.
     */ function validateChildKeys(node, parentType) {
        if ("object" == typeof node) {
            if (Array.isArray(node)) for(var i = 0; i < node.length; i++){
                var child = node[i];
                isValidElement(child) && validateExplicitKey(child, parentType);
            }
            else if (isValidElement(node)) // This element was passed in a valid location.
            node._store && (node._store.validated = !0);
            else if (node) {
                var iteratorFn = getIteratorFn(node);
                if ("function" == typeof iteratorFn && iteratorFn !== node.entries) for(var step, iterator = iteratorFn.call(node); !(step = iterator.next()).done;)isValidElement(step.value) && validateExplicitKey(step.value, parentType);
            }
        }
    }
    /**
     * Given an element, validate that its props follow the propTypes definition,
     * provided by the type.
     *
     * @param {ReactElement} element
     */ function validatePropTypes(element) {
        var propTypes, type = element.type;
        if (null != type && "string" != typeof type) {
            if ("function" == typeof type) propTypes = type.propTypes;
            else {
                if ("object" != typeof type || type.$$typeof !== REACT_FORWARD_REF_TYPE && // Note: Memo only checks outer props here.
                // Inner props are checked in the reconciler.
                type.$$typeof !== REACT_MEMO_TYPE) return;
                propTypes = type.propTypes;
            }
            if (propTypes) {
                // Intentionally inside to avoid triggering lazy initializers:
                var name = getComponentName(type);
                !function(typeSpecs, values, location, componentName, element) {
                    // $FlowFixMe This is okay but Flow doesn't know it.
                    var has = Function.call.bind(Object.prototype.hasOwnProperty);
                    for(var typeSpecName in typeSpecs)if (has(typeSpecs, typeSpecName)) {
                        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
                        // fail the render phase where it didn't fail before. So we log it.
                        // After these have been cleaned up, we'll let them throw.
                        try {
                            // This is intentionally an invariant that gets caught. It's the same
                            // behavior as without this statement except with a better message.
                            if ("function" != typeof typeSpecs[typeSpecName]) {
                                var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                                throw err.name = "Invariant Violation", err;
                            }
                            error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                        } catch (ex) {
                            error$1 = ex;
                        }
                        !error$1 || error$1 instanceof Error || (setCurrentlyValidatingElement(element), error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (// Only monitor this failure once because there tends to be a lot of the
                        // same error.
                        loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error("Failed %s type: %s", location, error$1.message), setCurrentlyValidatingElement(null));
                    }
                }(propTypes, element.props, "prop", name, element);
            } else void 0 === type.PropTypes || propTypesMisspellWarningShown || (propTypesMisspellWarningShown = !0, error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", getComponentName(type) || "Unknown"));
            "function" != typeof type.getDefaultProps || type.getDefaultProps.isReactClassApproved || error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
    }
    function createElementWithValidation(type, props, children) {
        var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
        // succeed and there will likely be errors in render.
        if (!validType) {
            var typeString, info = "";
            (void 0 === type || "object" == typeof type && null !== type && 0 === Object.keys(type).length) && (info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var sourceInfo = function(elementProps) {
                if (null != elementProps) {
                    var source;
                    return void 0 !== (source = elementProps.__source) ? "\n\nCheck your code at " + source.fileName.replace(/^.*[\\\/]/, "") + ":" + source.lineNumber + "." : "";
                }
                return "";
            }(props);
            sourceInfo ? info += sourceInfo : info += getDeclarationErrorAddendum(), null === type ? typeString = "null" : Array.isArray(type) ? typeString = "array" : void 0 !== type && type.$$typeof === REACT_ELEMENT_TYPE ? (typeString = "<" + (getComponentName(type.type) || "Unknown") + " />", info = " Did you accidentally export a JSX literal instead of a component?") : typeString = typeof type, error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
        }
        var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
        // TODO: Drop this when these are no longer allowed as the type argument.
        if (null == element) return element;
         // Skip key warning if the type isn't valid since our key validation logic
        // doesn't expect a non-string/function type and can throw confusing errors.
        // We don't want exception behavior to differ between dev and prod.
        // (Rendering will throw with a helpful message and as soon as the type is
        // fixed, the key warnings will appear.)
        if (validType) for(var i = 2; i < arguments.length; i++)validateChildKeys(arguments[i], type);
        return type === exports.Fragment ? /**
     * Given a fragment, validate that it can only be provided with fragment props
     * @param {ReactElement} fragment
     */ function(fragment) {
            for(var keys = Object.keys(fragment.props), i = 0; i < keys.length; i++){
                var key = keys[i];
                if ("children" !== key && "key" !== key) {
                    setCurrentlyValidatingElement$1(fragment), error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key), setCurrentlyValidatingElement$1(null);
                    break;
                }
            }
            null !== fragment.ref && (setCurrentlyValidatingElement$1(fragment), error("Invalid attribute `ref` supplied to `React.Fragment`."), setCurrentlyValidatingElement$1(null));
        }(element) : validatePropTypes(element), element;
    }
    var didWarnAboutDeprecatedCreateFactory = !1;
    try {
        Object.freeze({});
    /* eslint-enable no-new */ } catch (e) {}
    exports.Children = {
        map: mapChildren,
        forEach: /**
     * Iterates through children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
     *
     * The provided forEachFunc(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} forEachFunc
     * @param {*} forEachContext Context for forEachContext.
     */ function(children, forEachFunc, forEachContext) {
            mapChildren(children, function() {
                forEachFunc.apply(this, arguments); // Don't return anything.
            }, forEachContext);
        },
        count: /**
     * Count the number of children that are typically specified as
     * `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrencount
     *
     * @param {?*} children Children tree container.
     * @return {number} The number of children.
     */ function(children) {
            var n = 0;
            return mapChildren(children, function() {
                n++; // Don't return anything
            }), n;
        },
        toArray: /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
     */ function(children) {
            return mapChildren(children, function(child) {
                return child;
            }) || [];
        },
        only: /**
     * Returns the first child in a collection of children and verifies that there
     * is only one child in the collection.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenonly
     *
     * The current implementation of this function assumes that a single child gets
     * passed without a wrapper, but the purpose of this helper function is to
     * abstract away the particular structure of children.
     *
     * @param {?object} children Child collection structure.
     * @return {ReactElement} The first and only `ReactElement` contained in the
     * structure.
     */ function(children) {
            if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
            return children;
        }
    }, exports.Component = Component, exports.PureComponent = PureComponent, exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals, exports.cloneElement = function(element, props, children) {
        for(var newElement = cloneElement.apply(this, arguments), i = 2; i < arguments.length; i++)validateChildKeys(arguments[i], newElement.type);
        return validatePropTypes(newElement), newElement;
    }, exports.createContext = function(defaultValue, calculateChangedBits) {
        void 0 === calculateChangedBits ? calculateChangedBits = null : null !== calculateChangedBits && "function" != typeof calculateChangedBits && error("createContext: Expected the optional second argument to be a function. Instead received: %s", calculateChangedBits);
        var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            _calculateChangedBits: calculateChangedBits,
            // As a workaround to support multiple concurrent renderers, we categorize
            // some renderers as primary and others as secondary. We only expect
            // there to be two concurrent renderers at most: React Native (primary) and
            // Fabric (secondary); React DOM (primary) and React ART (secondary).
            // Secondary renderers store their context values on separate fields.
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            // Used to track how many concurrent renderers this context currently
            // supports within in a single renderer. Such as parallel server rendering.
            _threadCount: 0,
            // These are circular
            Provider: null,
            Consumer: null
        };
        context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context
        };
        var hasWarnedAboutUsingNestedContextConsumers = !1, hasWarnedAboutUsingConsumerProvider = !1, hasWarnedAboutDisplayNameOnConsumer = !1, Consumer = {
            $$typeof: REACT_CONTEXT_TYPE,
            _context: context,
            _calculateChangedBits: context._calculateChangedBits
        };
        return Object.defineProperties(Consumer, {
            Provider: {
                get: function() {
                    return hasWarnedAboutUsingConsumerProvider || (hasWarnedAboutUsingConsumerProvider = !0, error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), context.Provider;
                },
                set: function(_Provider) {
                    context.Provider = _Provider;
                }
            },
            _currentValue: {
                get: function() {
                    return context._currentValue;
                },
                set: function(_currentValue) {
                    context._currentValue = _currentValue;
                }
            },
            _currentValue2: {
                get: function() {
                    return context._currentValue2;
                },
                set: function(_currentValue2) {
                    context._currentValue2 = _currentValue2;
                }
            },
            _threadCount: {
                get: function() {
                    return context._threadCount;
                },
                set: function(_threadCount) {
                    context._threadCount = _threadCount;
                }
            },
            Consumer: {
                get: function() {
                    return hasWarnedAboutUsingNestedContextConsumers || (hasWarnedAboutUsingNestedContextConsumers = !0, error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), context.Consumer;
                }
            },
            displayName: {
                get: function() {
                    return context.displayName;
                },
                set: function(displayName) {
                    hasWarnedAboutDisplayNameOnConsumer || (warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName), hasWarnedAboutDisplayNameOnConsumer = !0);
                }
            }
        }), context.Consumer = Consumer, context._currentRenderer = null, context._currentRenderer2 = null, context;
    }, exports.createElement = createElementWithValidation, exports.createFactory = function(type) {
        var validatedFactory = createElementWithValidation.bind(null, type);
        return validatedFactory.type = type, didWarnAboutDeprecatedCreateFactory || (didWarnAboutDeprecatedCreateFactory = !0, warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(validatedFactory, "type", {
            enumerable: !1,
            get: function() {
                return warn("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
                    value: type
                }), type;
            }
        }), validatedFactory;
    }, exports.createRef = // an immutable object with a single mutable value
    function() {
        var refObject = {
            current: null
        };
        return Object.seal(refObject), refObject;
    }, exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : "function" != typeof render ? error("forwardRef requires a render function but was given %s.", null === render ? "null" : typeof render) : 0 !== render.length && 2 !== render.length && error("forwardRef render functions accept exactly two parameters: props and ref. %s", 1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), null != render && (null != render.defaultProps || null != render.propTypes) && error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var ownName, elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render: render
        };
        return Object.defineProperty(elementType, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
                return ownName;
            },
            set: function(name) {
                ownName = name, null == render.displayName && (render.displayName = name);
            }
        }), elementType;
    }, exports.isValidElement = isValidElement, exports.lazy = function(ctor) {
        var defaultProps, propTypes, lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: {
                // We use these fields to store the result.
                _status: -1,
                _result: ctor
            },
            _init: lazyInitializer
        };
        return Object.defineProperties(lazyType, {
            defaultProps: {
                configurable: !0,
                get: function() {
                    return defaultProps;
                },
                set: function(newDefaultProps) {
                    error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), defaultProps = newDefaultProps, // $FlowFixMe
                    Object.defineProperty(lazyType, "defaultProps", {
                        enumerable: !0
                    });
                }
            },
            propTypes: {
                configurable: !0,
                get: function() {
                    return propTypes;
                },
                set: function(newPropTypes) {
                    error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), propTypes = newPropTypes, // $FlowFixMe
                    Object.defineProperty(lazyType, "propTypes", {
                        enumerable: !0
                    });
                }
            }
        }), lazyType;
    }, exports.memo = function(type, compare) {
        isValidElementType(type) || error("memo: The first argument must be a component. Instead received: %s", null === type ? "null" : typeof type);
        var ownName, elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type: type,
            compare: void 0 === compare ? null : compare
        };
        return Object.defineProperty(elementType, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
                return ownName;
            },
            set: function(name) {
                ownName = name, null == type.displayName && (type.displayName = name);
            }
        }), elementType;
    }, exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
    }, exports.useContext = function(Context, unstable_observedBits) {
        var dispatcher = resolveDispatcher();
        if (void 0 !== unstable_observedBits && error("useContext() second argument is reserved for future use in React. Passing it is not supported. You passed: %s.%s", unstable_observedBits, "number" == typeof unstable_observedBits && Array.isArray(arguments[2]) ? "\n\nDid you call array.map(useContext)? Calling Hooks inside a loop is not supported. Learn more at https://reactjs.org/link/rules-of-hooks" : ""), void 0 !== Context._context) {
            var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
            // and nobody should be using this in existing code.
            realContext.Consumer === Context ? error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : realContext.Provider === Context && error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return dispatcher.useContext(Context, unstable_observedBits);
    }, exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
    }, exports.useEffect = function(create, deps) {
        return resolveDispatcher().useEffect(create, deps);
    }, exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
    }, exports.useLayoutEffect = function(create, deps) {
        return resolveDispatcher().useLayoutEffect(create, deps);
    }, exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
    }, exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
    }, exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
    }, exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
    }, exports.version = "17.0.1";
}();
