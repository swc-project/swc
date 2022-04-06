!function(global, factory) {
    'object' == typeof exports && 'undefined' != typeof module ? factory(exports) : 'function' == typeof define && define.amd ? define([
        'exports'
    ], factory) : factory((global = global || self).React = {});
}(this, function(exports) {
    'use strict';
    var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd, prefix, componentFrameCache, propTypesMisspellWarningShown, requestHostCallback, requestHostTimeout, cancelHostTimeout, shouldYieldToHost, requestPaint, getCurrentTime, forceFrameRate, REACT_ELEMENT_TYPE = 0xeac7, REACT_PORTAL_TYPE = 0xeaca;
    exports.Fragment = 0xeacb, exports.StrictMode = 0xeacc, exports.Profiler = 0xead2;
    var REACT_PROVIDER_TYPE = 0xeacd, REACT_CONTEXT_TYPE = 0xeace, REACT_FORWARD_REF_TYPE = 0xead0;
    exports.Suspense = 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = 0xead8, REACT_MEMO_TYPE = 0xead3, REACT_LAZY_TYPE = 0xead4, REACT_BLOCK_TYPE = 0xead9, REACT_SERVER_BLOCK_TYPE = 0xeada, REACT_FUNDAMENTAL_TYPE = 0xead5, REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1, REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
    if ('function' == typeof Symbol && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor('react.element'), REACT_PORTAL_TYPE = symbolFor('react.portal'), exports.Fragment = symbolFor('react.fragment'), exports.StrictMode = symbolFor('react.strict_mode'), exports.Profiler = symbolFor('react.profiler'), REACT_PROVIDER_TYPE = symbolFor('react.provider'), REACT_CONTEXT_TYPE = symbolFor('react.context'), REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref'), exports.Suspense = symbolFor('react.suspense'), REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list'), REACT_MEMO_TYPE = symbolFor('react.memo'), REACT_LAZY_TYPE = symbolFor('react.lazy'), REACT_BLOCK_TYPE = symbolFor('react.block'), REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block'), REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental'), symbolFor('react.scope'), symbolFor('react.opaque.id'), REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode'), symbolFor('react.offscreen'), REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
    }
    var MAYBE_ITERATOR_SYMBOL = 'function' == typeof Symbol && Symbol.iterator;
    function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || 'object' != typeof maybeIterable) return null;
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable['@@iterator'];
        return 'function' == typeof maybeIterator ? maybeIterator : null;
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty, _assign = function(to, from) {
        for(var key in from)hasOwnProperty.call(from, key) && (to[key] = from[key]);
    }, assign = Object.assign || function(target, sources) {
        if (null == target) throw new TypeError('Object.assign target cannot be null or undefined');
        for(var to = Object(target), nextIndex = 1; nextIndex < arguments.length; nextIndex++){
            var nextSource = arguments[nextIndex];
            null != nextSource && _assign(to, Object(nextSource));
        }
        return to;
    }, ReactCurrentDispatcher = {
        current: null
    }, ReactCurrentBatchConfig = {
        transition: 0
    }, ReactCurrentOwner = {
        current: null
    }, ReactDebugCurrentFrame = {}, currentExtraStackFrame = null;
    ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
        currentExtraStackFrame = stack;
    }, ReactDebugCurrentFrame.getCurrentStack = null, ReactDebugCurrentFrame.getStackAddendum = function() {
        var stack = '';
        currentExtraStackFrame && (stack += currentExtraStackFrame);
        var impl = ReactDebugCurrentFrame.getCurrentStack;
        return impl && (stack += impl() || ''), stack;
    };
    var IsSomeRendererActing = {
        current: !1
    }, ReactSharedInternals = {
        ReactCurrentDispatcher: ReactCurrentDispatcher,
        ReactCurrentBatchConfig: ReactCurrentBatchConfig,
        ReactCurrentOwner: ReactCurrentOwner,
        IsSomeRendererActing: IsSomeRendererActing,
        assign: assign
    };
    function warn(format) {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
        printWarning('warn', format, args);
    }
    function error1(format) {
        for(var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)args[_key2 - 1] = arguments[_key2];
        printWarning('error', format, args);
    }
    function printWarning(level, format, args) {
        var stack = ReactSharedInternals.ReactDebugCurrentFrame.getStackAddendum();
        '' !== stack && (format += '%s', args = args.concat([
            stack
        ]));
        var argsWithFormat = args.map(function(item) {
            return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format), Function.prototype.apply.call(console[level], console, argsWithFormat);
    }
    ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
    var didWarnStateUpdateForUnmountedComponent = {};
    function warnNoop(publicInstance, callerName) {
        var _constructor = publicInstance.constructor, componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass', warningKey = componentName + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (error1("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName), didWarnStateUpdateForUnmountedComponent[warningKey] = !0);
    }
    var ReactNoopUpdateQueue = {
        isMounted: function(publicInstance) {
            return !1;
        },
        enqueueForceUpdate: function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, 'forceUpdate');
        },
        enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, 'replaceState');
        },
        enqueueSetState: function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, 'setState');
        }
    }, emptyObject = {};
    function Component(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
    }
    Object.freeze(emptyObject), Component.prototype.isReactComponent = {}, Component.prototype.setState = function(partialState, callback) {
        if (!('object' == typeof partialState || 'function' == typeof partialState || null == partialState)) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, partialState, callback, 'setState');
    }, Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
    };
    var deprecatedAPIs = {
        isMounted: [
            'isMounted',
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
            'replaceState',
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
    }, defineDeprecationWarning = function(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
            get: function() {
                warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
            }
        });
    };
    for(var fnName in deprecatedAPIs)deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    function ComponentDummy() {}
    function PureComponent(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
    }
    ComponentDummy.prototype = Component.prototype;
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    function getContextName(type) {
        return type.displayName || 'Context';
    }
    function getComponentName(type) {
        if (null == type) return null;
        if ('number' == typeof type.tag && error1("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), 'function' == typeof type) return type.displayName || type.name || null;
        if ('string' == typeof type) return type;
        switch(type){
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
        if ('object' == typeof type) switch(type.$$typeof){
            case REACT_CONTEXT_TYPE:
                return getContextName(type) + '.Consumer';
            case REACT_PROVIDER_TYPE:
                return getContextName(type._context) + '.Provider';
            case REACT_FORWARD_REF_TYPE:
                return outerType = type, innerType = type.render, wrapperName = 'ForwardRef', functionName = innerType.displayName || innerType.name || '', outerType.displayName || ('' !== functionName ? wrapperName + "(" + functionName + ")" : wrapperName);
            case REACT_MEMO_TYPE:
                return getComponentName(type.type);
            case REACT_BLOCK_TYPE:
                return getComponentName(type._render);
            case REACT_LAZY_TYPE:
                var outerType, innerType, wrapperName, functionName, lazyComponent = type, payload = lazyComponent._payload, init = lazyComponent._init;
                try {
                    return getComponentName(init(payload));
                } catch (x) {
                    return null;
                }
        }
        return null;
    }
    pureComponentPrototype.constructor = PureComponent, assign(pureComponentPrototype, Component.prototype), pureComponentPrototype.isPureReactComponent = !0;
    var hasOwnProperty$1 = Object.prototype.hasOwnProperty, RESERVED_PROPS = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };
    function hasValidRef(config) {
        if (hasOwnProperty$1.call(config, 'ref')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.ref;
    }
    function hasValidKey(config) {
        if (hasOwnProperty$1.call(config, 'key')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    didWarnAboutStringRefs = {};
    var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            ref: ref,
            props: props,
            _owner: owner
        };
        return element._store = {}, Object.defineProperty(element._store, 'validated', {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: !1
        }), Object.defineProperty(element, '_self', {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: self
        }), Object.defineProperty(element, '_source', {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: source
        }), Object.freeze && (Object.freeze(element.props), Object.freeze(element)), element;
    };
    function createElement(type, config1, children) {
        var propName, props = {}, key = null, ref = null, self = null, source = null;
        if (null != config1) for(propName in hasValidRef(config1) && (ref = config1.ref, function(config) {
            if ('string' == typeof config.ref && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
                var componentName = getComponentName(ReactCurrentOwner.current.type);
                didWarnAboutStringRefs[componentName] || (error1('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref), didWarnAboutStringRefs[componentName] = !0);
            }
        }(config1)), hasValidKey(config1) && (key = '' + config1.key), self = void 0 === config1.__self ? null : config1.__self, source = void 0 === config1.__source ? null : config1.__source, config1)hasOwnProperty$1.call(config1, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (props[propName] = config1[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (childrenLength > 1) {
            for(var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)childArray[i] = arguments[i + 2];
            Object.freeze && Object.freeze(childArray), props.children = childArray;
        }
        if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for(propName in defaultProps)void 0 === props[propName] && (props[propName] = defaultProps[propName]);
        }
        if (key || ref) {
            var props1, displayName, warnAboutAccessingKey, props2, displayName1, warnAboutAccessingRef, displayName2 = 'function' == typeof type ? type.displayName || type.name || 'Unknown' : type;
            key && (props1 = props, displayName = displayName2, (warnAboutAccessingKey = function() {
                specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, error1("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName));
            }).isReactWarning = !0, Object.defineProperty(props1, 'key', {
                get: warnAboutAccessingKey,
                configurable: !0
            })), ref && (props2 = props, displayName1 = displayName2, (warnAboutAccessingRef = function() {
                specialPropRefWarningShown || (specialPropRefWarningShown = !0, error1("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName1));
            }).isReactWarning = !0, Object.defineProperty(props2, 'ref', {
                get: warnAboutAccessingRef,
                configurable: !0
            }));
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    }
    function cloneElement(element, config, children) {
        if (!(null != element)) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
        var propName, defaultProps, props = assign({}, element.props), key = element.key, ref = element.ref, self = element._self, source = element._source, owner = element._owner;
        if (null != config) for(propName in hasValidRef(config) && (ref = config.ref, owner = ReactCurrentOwner.current), hasValidKey(config) && (key = '' + config.key), element.type && element.type.defaultProps && (defaultProps = element.type.defaultProps), config)hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName) && (void 0 === config[propName] && void 0 !== defaultProps ? props[propName] = defaultProps[propName] : props[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (childrenLength > 1) {
            for(var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)childArray[i] = arguments[i + 2];
            props.children = childArray;
        }
        return ReactElement(element.type, key, ref, self, source, owner, props);
    }
    function isValidElement(object) {
        return 'object' == typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var didWarnAboutMaps = !1, userProvidedKeyEscapeRegex = /\/+/g;
    function escapeUserProvidedKey(text) {
        return text.replace(userProvidedKeyEscapeRegex, '$&/');
    }
    function getElementKey(element, index) {
        if ('object' == typeof element && null !== element && null != element.key) {
            var key, escaperLookup;
            return key = '' + element.key, escaperLookup = {
                '=': '=0',
                ':': '=2'
            }, '$' + key.replace(/[=:]/g, function(match) {
                return escaperLookup[match];
            });
        }
        return index.toString(36);
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        ('undefined' === type || 'boolean' === type) && (children = null);
        var invokeCallback = !1;
        if (null === children) invokeCallback = !0;
        else switch(type){
            case 'string':
            case 'number':
                invokeCallback = !0;
                break;
            case 'object':
                switch(children.$$typeof){
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                        invokeCallback = !0;
                }
        }
        if (invokeCallback) {
            var oldElement, newKey, _child = children, mappedChild = callback(_child), childKey = '' === nameSoFar ? '.' + getElementKey(_child, 0) : nameSoFar;
            if (Array.isArray(mappedChild)) {
                var escapedChildKey = '';
                null != childKey && (escapedChildKey = escapeUserProvidedKey(childKey) + '/'), mapIntoArray(mappedChild, array, escapedChildKey, '', function(c) {
                    return c;
                });
            } else null != mappedChild && (isValidElement(mappedChild) && (mappedChild = (oldElement = mappedChild, newKey = escapedPrefix + (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey, ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props))), array.push(mappedChild));
            return 1;
        }
        var subtreeCount = 0, nextNamePrefix = '' === nameSoFar ? '.' : nameSoFar + ':';
        if (Array.isArray(children)) for(var i = 0; i < children.length; i++)nextName = nextNamePrefix + getElementKey(child = children[i], i), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        else {
            var iteratorFn = getIteratorFn(children);
            if ('function' == typeof iteratorFn) {
                var child, nextName, step, iterableChildren = children;
                iteratorFn === iterableChildren.entries && (didWarnAboutMaps || warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = !0);
                for(var iterator = iteratorFn.call(iterableChildren), ii = 0; !(step = iterator.next()).done;)nextName = nextNamePrefix + getElementKey(child = step.value, ii++), subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            } else if ('object' === type) {
                var childrenString = '' + children;
                throw Error("Objects are not valid as a React child (found: " + ('[object Object]' === childrenString ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). If you meant to render a collection of children, use an array instead.");
            }
        }
        return subtreeCount;
    }
    function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        return mapIntoArray(children, result, '', '', function(child) {
            return func.call(context, child, count++);
        }), result;
    }
    function lazyInitializer(payload) {
        if (-1 === payload._status) {
            var thenable = (0, payload._result)(), pending = payload;
            pending._status = 0, pending._result = thenable, thenable.then(function(moduleObject) {
                if (0 === payload._status) {
                    var defaultExport = moduleObject.default;
                    void 0 === defaultExport && error1("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
                    var resolved = payload;
                    resolved._status = 1, resolved._result = defaultExport;
                }
            }, function(error) {
                if (0 === payload._status) {
                    var rejected = payload;
                    rejected._status = 2, rejected._result = error;
                }
            });
        }
        if (1 === payload._status) return payload._result;
        throw payload._result;
    }
    function isValidElementType(type) {
        return 'string' == typeof type || 'function' == typeof type || type === exports.Fragment || type === exports.Profiler || type === REACT_DEBUG_TRACING_MODE_TYPE || type === exports.StrictMode || type === exports.Suspense || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || 'object' == typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE);
    }
    function resolveDispatcher() {
        var dispatcher = ReactCurrentDispatcher.current;
        if (!(null !== dispatcher)) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
        return dispatcher;
    }
    var disabledDepth = 0;
    function disabledLog() {}
    disabledLog.__reactDisabledLog = !0;
    var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
    function describeBuiltInComponentFrame(name, source, ownerFn) {
        if (void 0 === prefix) try {
            throw Error();
        } catch (x) {
            var match = x.stack.trim().match(/\n( *(at )?)/);
            prefix = match && match[1] || '';
        }
        return '\n' + prefix + name;
    }
    var reentry = !1;
    function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry) return '';
        var control, previousDispatcher, frame = componentFrameCache.get(fn);
        if (void 0 !== frame) return frame;
        reentry = !0;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0, previousDispatcher = ReactCurrentDispatcher$1.current, ReactCurrentDispatcher$1.current = null, function() {
            if (0 === disabledDepth) {
                prevLog = console.log, prevInfo = console.info, prevWarn = console.warn, prevError = console.error, prevGroup = console.group, prevGroupCollapsed = console.groupCollapsed, prevGroupEnd = console.groupEnd;
                var props = {
                    configurable: !0,
                    enumerable: !0,
                    value: disabledLog,
                    writable: !0
                };
                Object.defineProperties(console, {
                    info: props,
                    log: props,
                    warn: props,
                    error: props,
                    group: props,
                    groupCollapsed: props,
                    groupEnd: props
                });
            }
            disabledDepth++;
        }();
        try {
            if (construct) {
                var Fake = function() {
                    throw Error();
                };
                if (Object.defineProperty(Fake.prototype, 'props', {
                    set: function() {
                        throw Error();
                    }
                }), 'object' == typeof Reflect && Reflect.construct) {
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
            if (sample && control && 'string' == typeof sample.stack) {
                for(var sampleLines = sample.stack.split('\n'), controlLines = control.stack.split('\n'), s = sampleLines.length - 1, c = controlLines.length - 1; s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c];)c--;
                for(; s >= 1 && c >= 0; s--, c--)if (sampleLines[s] !== controlLines[c]) {
                    if (1 !== s || 1 !== c) do if (s--, --c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = '\n' + sampleLines[s].replace(' at new ', ' at ');
                        return 'function' == typeof fn && componentFrameCache.set(fn, _frame), _frame;
                    }
                    while (s >= 1 && c >= 0)
                    break;
                }
            }
        } finally{
            reentry = !1, ReactCurrentDispatcher$1.current = previousDispatcher, function() {
                if (0 == --disabledDepth) {
                    var props = {
                        configurable: !0,
                        enumerable: !0,
                        writable: !0
                    };
                    Object.defineProperties(console, {
                        log: assign({}, props, {
                            value: prevLog
                        }),
                        info: assign({}, props, {
                            value: prevInfo
                        }),
                        warn: assign({}, props, {
                            value: prevWarn
                        }),
                        error: assign({}, props, {
                            value: prevError
                        }),
                        group: assign({}, props, {
                            value: prevGroup
                        }),
                        groupCollapsed: assign({}, props, {
                            value: prevGroupCollapsed
                        }),
                        groupEnd: assign({}, props, {
                            value: prevGroupEnd
                        })
                    });
                }
                disabledDepth < 0 && error1("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }(), Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : '', syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';
        return 'function' == typeof fn && componentFrameCache.set(fn, syntheticFrame), syntheticFrame;
    }
    function describeFunctionComponentFrame(fn, source, ownerFn) {
        return describeNativeComponentFrame(fn, !1);
    }
    function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (null == type) return '';
        if ('function' == typeof type) {
            var prototype;
            return describeNativeComponentFrame(type, !!((prototype = type.prototype) && prototype.isReactComponent));
        }
        if ('string' == typeof type) return describeBuiltInComponentFrame(type);
        switch(type){
            case exports.Suspense:
                return describeBuiltInComponentFrame('Suspense');
            case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame('SuspenseList');
        }
        if ('object' == typeof type) switch(type.$$typeof){
            case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_BLOCK_TYPE:
                return describeFunctionComponentFrame(type._render);
            case REACT_LAZY_TYPE:
                var lazyComponent = type, payload = lazyComponent._payload, init = lazyComponent._init;
                try {
                    return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {}
        }
        return '';
    }
    componentFrameCache = new ('function' == typeof WeakMap ? WeakMap : Map)();
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
            if (name) return '\n\nCheck the render method of `' + name + '`.';
        }
        return '';
    }
    propTypesMisspellWarningShown = !1;
    var ownerHasKeyUseWarning = {};
    function validateExplicitKey(element, parentType1) {
        if (element._store && !element._store.validated && null == element.key) {
            element._store.validated = !0;
            var currentComponentErrorInfo = function(parentType) {
                var info = getDeclarationErrorAddendum();
                if (!info) {
                    var parentName = 'string' == typeof parentType ? parentType : parentType.displayName || parentType.name;
                    parentName && (info = "\n\nCheck the top-level render call using <" + parentName + ">.");
                }
                return info;
            }(parentType1);
            if (!ownerHasKeyUseWarning[currentComponentErrorInfo]) {
                ownerHasKeyUseWarning[currentComponentErrorInfo] = !0;
                var childOwner = '';
                element && element._owner && element._owner !== ReactCurrentOwner.current && (childOwner = " It was passed a child from " + getComponentName(element._owner.type) + "."), setCurrentlyValidatingElement$1(element), error1('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner), setCurrentlyValidatingElement$1(null);
            }
        }
    }
    function validateChildKeys(node, parentType) {
        if ('object' == typeof node) {
            if (Array.isArray(node)) for(var i = 0; i < node.length; i++){
                var child = node[i];
                isValidElement(child) && validateExplicitKey(child, parentType);
            }
            else if (isValidElement(node)) node._store && (node._store.validated = !0);
            else if (node) {
                var iteratorFn = getIteratorFn(node);
                if ('function' == typeof iteratorFn && iteratorFn !== node.entries) for(var step, iterator = iteratorFn.call(node); !(step = iterator.next()).done;)isValidElement(step.value) && validateExplicitKey(step.value, parentType);
            }
        }
    }
    function validatePropTypes(element1) {
        var propTypes, type = element1.type;
        if (null != type && 'string' != typeof type) {
            if ('function' == typeof type) propTypes = type.propTypes;
            else {
                if ('object' != typeof type || type.$$typeof !== REACT_FORWARD_REF_TYPE && type.$$typeof !== REACT_MEMO_TYPE) return;
                propTypes = type.propTypes;
            }
            if (propTypes) {
                var name = getComponentName(type);
                !function(typeSpecs, values, location, componentName, element) {
                    var has = Function.call.bind(Object.prototype.hasOwnProperty);
                    for(var typeSpecName in typeSpecs)if (has(typeSpecs, typeSpecName)) {
                        var error$1 = void 0;
                        try {
                            if ('function' != typeof typeSpecs[typeSpecName]) {
                                var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                                throw err.name = 'Invariant Violation', err;
                            }
                            error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
                        } catch (ex) {
                            error$1 = ex;
                        }
                        !error$1 || error$1 instanceof Error || (setCurrentlyValidatingElement(element), error1("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || 'React class', location, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error1('Failed %s type: %s', location, error$1.message), setCurrentlyValidatingElement(null));
                    }
                }(propTypes, element1.props, 'prop', name, element1);
            } else void 0 === type.PropTypes || propTypesMisspellWarningShown || (propTypesMisspellWarningShown = !0, error1('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', getComponentName(type) || 'Unknown'));
            'function' != typeof type.getDefaultProps || type.getDefaultProps.isReactClassApproved || error1("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
    }
    function createElementWithValidation(type, props, children) {
        var validType = isValidElementType(type);
        if (!validType) {
            var typeString, elementProps, info = '';
            (void 0 === type || 'object' == typeof type && null !== type && 0 === Object.keys(type).length) && (info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
            var sourceInfo = null != (elementProps = props) ? function(source) {
                if (void 0 !== source) {
                    var fileName = source.fileName.replace(/^.*[\\\/]/, ''), lineNumber = source.lineNumber;
                    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
                }
                return '';
            }(elementProps.__source) : '';
            sourceInfo ? info += sourceInfo : info += getDeclarationErrorAddendum(), null === type ? typeString = 'null' : Array.isArray(type) ? typeString = 'array' : void 0 !== type && type.$$typeof === REACT_ELEMENT_TYPE ? (typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />", info = ' Did you accidentally export a JSX literal instead of a component?') : typeString = typeof type, error1("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
        }
        var element = createElement.apply(this, arguments);
        if (null == element) return element;
        if (validType) for(var i1 = 2; i1 < arguments.length; i1++)validateChildKeys(arguments[i1], type);
        return type === exports.Fragment ? function(fragment) {
            for(var keys = Object.keys(fragment.props), i = 0; i < keys.length; i++){
                var key = keys[i];
                if ('children' !== key && 'key' !== key) {
                    setCurrentlyValidatingElement$1(fragment), error1("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key), setCurrentlyValidatingElement$1(null);
                    break;
                }
            }
            null !== fragment.ref && (setCurrentlyValidatingElement$1(fragment), error1('Invalid attribute `ref` supplied to `React.Fragment`.'), setCurrentlyValidatingElement$1(null));
        }(element) : validatePropTypes(element), element;
    }
    var didWarnAboutDeprecatedCreateFactory = !1;
    if ('object' == typeof performance && 'function' == typeof performance.now) {
        var localPerformance = performance;
        getCurrentTime = function() {
            return localPerformance.now();
        };
    } else {
        var localDate = Date, initialTime = localDate.now();
        getCurrentTime = function() {
            return localDate.now() - initialTime;
        };
    }
    if ('undefined' == typeof window || 'function' != typeof MessageChannel) {
        var _callback = null, _timeoutID = null, _flushCallback = function() {
            if (null !== _callback) try {
                var currentTime = getCurrentTime(), hasRemainingTime = !0;
                _callback(hasRemainingTime, currentTime), _callback = null;
            } catch (e) {
                throw setTimeout(_flushCallback, 0), e;
            }
        };
        requestHostCallback = function(cb) {
            null !== _callback ? setTimeout(requestHostCallback, 0, cb) : (_callback = cb, setTimeout(_flushCallback, 0));
        }, requestHostTimeout = function(cb, ms) {
            _timeoutID = setTimeout(cb, ms);
        }, cancelHostTimeout = function() {
            clearTimeout(_timeoutID);
        }, shouldYieldToHost = function() {
            return !1;
        }, requestPaint = forceFrameRate = function() {};
    } else {
        var _setTimeout = window.setTimeout, _clearTimeout = window.clearTimeout;
        if ('undefined' != typeof console) {
            var requestAnimationFrame = window.requestAnimationFrame, cancelAnimationFrame = window.cancelAnimationFrame;
            'function' != typeof requestAnimationFrame && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), 'function' != typeof cancelAnimationFrame && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");
        }
        var isMessageLoopRunning = !1, scheduledHostCallback = null, taskTimeoutID = -1, yieldInterval = 5, deadline = 0;
        shouldYieldToHost = function() {
            return getCurrentTime() >= deadline;
        }, requestPaint = function() {}, forceFrameRate = function(fps) {
            if (fps < 0 || fps > 125) {
                console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
                return;
            }
            yieldInterval = fps > 0 ? Math.floor(1000 / fps) : 5;
        };
        var performWorkUntilDeadline = function() {
            if (null !== scheduledHostCallback) {
                var currentTime = getCurrentTime();
                deadline = currentTime + yieldInterval;
                var hasTimeRemaining = !0;
                try {
                    scheduledHostCallback(hasTimeRemaining, currentTime) ? port.postMessage(null) : (isMessageLoopRunning = !1, scheduledHostCallback = null);
                } catch (error) {
                    throw port.postMessage(null), error;
                }
            } else isMessageLoopRunning = !1;
        }, channel = new MessageChannel(), port = channel.port2;
        channel.port1.onmessage = performWorkUntilDeadline, requestHostCallback = function(callback) {
            scheduledHostCallback = callback, isMessageLoopRunning || (isMessageLoopRunning = !0, port.postMessage(null));
        }, requestHostTimeout = function(callback, ms) {
            taskTimeoutID = _setTimeout(function() {
                callback(getCurrentTime());
            }, ms);
        }, cancelHostTimeout = function() {
            _clearTimeout(taskTimeoutID), taskTimeoutID = -1;
        };
    }
    function push(heap, node) {
        var index = heap.length;
        heap.push(node), siftUp(heap, node, index);
    }
    function peek(heap) {
        var first = heap[0];
        return void 0 === first ? null : first;
    }
    function pop(heap) {
        var first = heap[0];
        if (void 0 === first) return null;
        var last = heap.pop();
        return last !== first && (heap[0] = last, siftDown(heap, last, 0)), first;
    }
    function siftUp(heap, node, i) {
        for(var index = i;;){
            var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
            if (!(void 0 !== parent && compare1(parent, node) > 0)) return;
            heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
        }
    }
    function siftDown(heap, node, i) {
        for(var index = i, length = heap.length; index < length;){
            var leftIndex = (index + 1) * 2 - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
            if (void 0 !== left && 0 > compare1(left, node)) void 0 !== right && 0 > compare1(right, left) ? (heap[index] = right, heap[rightIndex] = node, index = rightIndex) : (heap[index] = left, heap[leftIndex] = node, index = leftIndex);
            else {
                if (!(void 0 !== right && 0 > compare1(right, node))) return;
                heap[index] = right, heap[rightIndex] = node, index = rightIndex;
            }
        }
    }
    function compare1(a, b) {
        var diff = a.sortIndex - b.sortIndex;
        return 0 !== diff ? diff : a.id - b.id;
    }
    var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = !1, isHostCallbackScheduled = !1, isHostTimeoutScheduled = !1;
    function advanceTimers(currentTime) {
        for(var timer = peek(timerQueue); null !== timer;){
            if (null === timer.callback) pop(timerQueue);
            else {
                if (!(timer.startTime <= currentTime)) return;
                pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
            }
            timer = peek(timerQueue);
        }
    }
    function handleTimeout(currentTime) {
        if (isHostTimeoutScheduled = !1, advanceTimers(currentTime), !isHostCallbackScheduled) {
            if (null !== peek(taskQueue)) isHostCallbackScheduled = !0, requestHostCallback(flushWork);
            else {
                var firstTimer = peek(timerQueue);
                null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
            }
        }
    }
    function flushWork(hasTimeRemaining, initialTime) {
        isHostCallbackScheduled = !1, isHostTimeoutScheduled && (isHostTimeoutScheduled = !1, cancelHostTimeout()), isPerformingWork = !0;
        var previousPriorityLevel = currentPriorityLevel;
        try {
            return workLoop(hasTimeRemaining, initialTime);
        } finally{
            currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = !1;
        }
    }
    function workLoop(hasTimeRemaining, initialTime) {
        var currentTime = initialTime;
        for(advanceTimers(currentTime), currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost()));){
            var callback = currentTask.callback;
            if ('function' == typeof callback) {
                currentTask.callback = null, currentPriorityLevel = currentTask.priorityLevel;
                var didUserCallbackTimeout = currentTask.expirationTime <= currentTime, continuationCallback = callback(didUserCallbackTimeout);
                currentTime = getCurrentTime(), 'function' == typeof continuationCallback ? currentTask.callback = continuationCallback : currentTask === peek(taskQueue) && pop(taskQueue), advanceTimers(currentTime);
            } else pop(taskQueue);
            currentTask = peek(taskQueue);
        }
        if (null !== currentTask) return !0;
        var firstTimer = peek(timerQueue);
        return null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime), !1;
    }
    function unstable_getCurrentPriorityLevel() {
        return currentPriorityLevel;
    }
    var unstable_requestPaint = requestPaint, Scheduler = Object.freeze({
        __proto__: null,
        unstable_ImmediatePriority: 1,
        unstable_UserBlockingPriority: 2,
        unstable_NormalPriority: 3,
        unstable_IdlePriority: 5,
        unstable_LowPriority: 4,
        unstable_runWithPriority: function(priorityLevel, eventHandler) {
            switch(priorityLevel){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                default:
                    priorityLevel = 3;
            }
            var previousPriorityLevel = currentPriorityLevel;
            currentPriorityLevel = priorityLevel;
            try {
                return eventHandler();
            } finally{
                currentPriorityLevel = previousPriorityLevel;
            }
        },
        unstable_next: function(eventHandler) {
            switch(currentPriorityLevel){
                case 1:
                case 2:
                case 3:
                    priorityLevel = 3;
                    break;
                default:
                    priorityLevel = currentPriorityLevel;
            }
            var priorityLevel, previousPriorityLevel = currentPriorityLevel;
            currentPriorityLevel = priorityLevel;
            try {
                return eventHandler();
            } finally{
                currentPriorityLevel = previousPriorityLevel;
            }
        },
        unstable_scheduleCallback: function(priorityLevel, callback, options) {
            var startTime, timeout, currentTime = getCurrentTime();
            if ('object' == typeof options && null !== options) {
                var delay = options.delay;
                startTime = 'number' == typeof delay && delay > 0 ? currentTime + delay : currentTime;
            } else startTime = currentTime;
            switch(priorityLevel){
                case 1:
                    timeout = -1;
                    break;
                case 2:
                    timeout = 250;
                    break;
                case 5:
                    timeout = 1073741823;
                    break;
                case 4:
                    timeout = 10000;
                    break;
                case 3:
                default:
                    timeout = 5000;
            }
            var expirationTime = startTime + timeout, newTask = {
                id: taskIdCounter++,
                callback: callback,
                priorityLevel: priorityLevel,
                startTime: startTime,
                expirationTime: expirationTime,
                sortIndex: -1
            };
            return startTime > currentTime ? (newTask.sortIndex = startTime, push(timerQueue, newTask), null === peek(taskQueue) && newTask === peek(timerQueue) && (isHostTimeoutScheduled ? cancelHostTimeout() : isHostTimeoutScheduled = !0, requestHostTimeout(handleTimeout, startTime - currentTime))) : (newTask.sortIndex = expirationTime, push(taskQueue, newTask), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = !0, requestHostCallback(flushWork))), newTask;
        },
        unstable_cancelCallback: function(task) {
            task.callback = null;
        },
        unstable_wrapCallback: function(callback) {
            var parentPriorityLevel = currentPriorityLevel;
            return function() {
                var previousPriorityLevel = currentPriorityLevel;
                currentPriorityLevel = parentPriorityLevel;
                try {
                    return callback.apply(this, arguments);
                } finally{
                    currentPriorityLevel = previousPriorityLevel;
                }
            };
        },
        unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel,
        get unstable_shouldYield () {
            return shouldYieldToHost;
        },
        unstable_requestPaint: unstable_requestPaint,
        unstable_continueExecution: function() {
            isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = !0, requestHostCallback(flushWork));
        },
        unstable_pauseExecution: function() {},
        unstable_getFirstCallbackNode: function() {
            return peek(taskQueue);
        },
        get unstable_now () {
            return getCurrentTime;
        },
        get unstable_forceFrameRate () {
            return forceFrameRate;
        },
        unstable_Profiling: null
    }), interactionIDCounter = 0, threadIDCounter = 0, interactionsRef = null, subscriberRef = null;
    function unstable_getThreadID() {
        return ++threadIDCounter;
    }
    interactionsRef = {
        current: new Set()
    }, subscriberRef = {
        current: null
    };
    var subscribers = null;
    function onInteractionTraced(interaction) {
        var didCatchError = !1, caughtError = null;
        if (subscribers.forEach(function(subscriber) {
            try {
                subscriber.onInteractionTraced(interaction);
            } catch (error) {
                didCatchError || (didCatchError = !0, caughtError = error);
            }
        }), didCatchError) throw caughtError;
    }
    function onInteractionScheduledWorkCompleted(interaction) {
        var didCatchError = !1, caughtError = null;
        if (subscribers.forEach(function(subscriber) {
            try {
                subscriber.onInteractionScheduledWorkCompleted(interaction);
            } catch (error) {
                didCatchError || (didCatchError = !0, caughtError = error);
            }
        }), didCatchError) throw caughtError;
    }
    function onWorkScheduled(interactions, threadID) {
        var didCatchError = !1, caughtError = null;
        if (subscribers.forEach(function(subscriber) {
            try {
                subscriber.onWorkScheduled(interactions, threadID);
            } catch (error) {
                didCatchError || (didCatchError = !0, caughtError = error);
            }
        }), didCatchError) throw caughtError;
    }
    function onWorkStarted(interactions, threadID) {
        var didCatchError = !1, caughtError = null;
        if (subscribers.forEach(function(subscriber) {
            try {
                subscriber.onWorkStarted(interactions, threadID);
            } catch (error) {
                didCatchError || (didCatchError = !0, caughtError = error);
            }
        }), didCatchError) throw caughtError;
    }
    function onWorkStopped(interactions, threadID) {
        var didCatchError = !1, caughtError = null;
        if (subscribers.forEach(function(subscriber) {
            try {
                subscriber.onWorkStopped(interactions, threadID);
            } catch (error) {
                didCatchError || (didCatchError = !0, caughtError = error);
            }
        }), didCatchError) throw caughtError;
    }
    function onWorkCanceled(interactions, threadID) {
        var didCatchError = !1, caughtError = null;
        if (subscribers.forEach(function(subscriber) {
            try {
                subscriber.onWorkCanceled(interactions, threadID);
            } catch (error) {
                didCatchError || (didCatchError = !0, caughtError = error);
            }
        }), didCatchError) throw caughtError;
    }
    subscribers = new Set();
    var ReactSharedInternals$1 = {
        ReactCurrentDispatcher: ReactCurrentDispatcher,
        ReactCurrentOwner: ReactCurrentOwner,
        IsSomeRendererActing: IsSomeRendererActing,
        ReactCurrentBatchConfig: ReactCurrentBatchConfig,
        assign: assign,
        Scheduler: Scheduler,
        SchedulerTracing: Object.freeze({
            __proto__: null,
            get __interactionsRef () {
                return interactionsRef;
            },
            get __subscriberRef () {
                return subscriberRef;
            },
            unstable_clear: function(callback) {
                var prevInteractions = interactionsRef.current;
                interactionsRef.current = new Set();
                try {
                    return callback();
                } finally{
                    interactionsRef.current = prevInteractions;
                }
            },
            unstable_getCurrent: function() {
                return interactionsRef.current;
            },
            unstable_getThreadID: unstable_getThreadID,
            unstable_trace: function(name, timestamp, callback) {
                var returnValue, threadID = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0, interaction = {
                    __count: 1,
                    id: interactionIDCounter++,
                    name: name,
                    timestamp: timestamp
                }, prevInteractions = interactionsRef.current, interactions = new Set(prevInteractions);
                interactions.add(interaction), interactionsRef.current = interactions;
                var subscriber = subscriberRef.current;
                try {
                    null !== subscriber && subscriber.onInteractionTraced(interaction);
                } finally{
                    try {
                        null !== subscriber && subscriber.onWorkStarted(interactions, threadID);
                    } finally{
                        try {
                            returnValue = callback();
                        } finally{
                            interactionsRef.current = prevInteractions;
                            try {
                                null !== subscriber && subscriber.onWorkStopped(interactions, threadID);
                            } finally{
                                interaction.__count--, null !== subscriber && 0 === interaction.__count && subscriber.onInteractionScheduledWorkCompleted(interaction);
                            }
                        }
                    }
                }
                return returnValue;
            },
            unstable_wrap: function(callback) {
                var threadID = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, wrappedInteractions = interactionsRef.current, subscriber = subscriberRef.current;
                null !== subscriber && subscriber.onWorkScheduled(wrappedInteractions, threadID), wrappedInteractions.forEach(function(interaction) {
                    interaction.__count++;
                });
                var hasRun = !1;
                function wrapped() {
                    var returnValue, prevInteractions = interactionsRef.current;
                    interactionsRef.current = wrappedInteractions, subscriber = subscriberRef.current;
                    try {
                        try {
                            null !== subscriber && subscriber.onWorkStarted(wrappedInteractions, threadID);
                        } finally{
                            try {
                                returnValue = callback.apply(void 0, arguments);
                            } finally{
                                interactionsRef.current = prevInteractions, null !== subscriber && subscriber.onWorkStopped(wrappedInteractions, threadID);
                            }
                        }
                        return returnValue;
                    } finally{
                        hasRun || (hasRun = !0, wrappedInteractions.forEach(function(interaction) {
                            interaction.__count--, null !== subscriber && 0 === interaction.__count && subscriber.onInteractionScheduledWorkCompleted(interaction);
                        }));
                    }
                }
                return wrapped.cancel = function() {
                    subscriber = subscriberRef.current;
                    try {
                        null !== subscriber && subscriber.onWorkCanceled(wrappedInteractions, threadID);
                    } finally{
                        wrappedInteractions.forEach(function(interaction) {
                            interaction.__count--, subscriber && 0 === interaction.__count && subscriber.onInteractionScheduledWorkCompleted(interaction);
                        });
                    }
                }, wrapped;
            },
            unstable_subscribe: function(subscriber) {
                subscribers.add(subscriber), 1 === subscribers.size && (subscriberRef.current = {
                    onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
                    onInteractionTraced: onInteractionTraced,
                    onWorkCanceled: onWorkCanceled,
                    onWorkScheduled: onWorkScheduled,
                    onWorkStarted: onWorkStarted,
                    onWorkStopped: onWorkStopped
                });
            },
            unstable_unsubscribe: function(subscriber) {
                subscribers.delete(subscriber), 0 === subscribers.size && (subscriberRef.current = null);
            }
        })
    };
    ReactSharedInternals$1.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
    try {
        var frozenObject = Object.freeze({});
        new Map([
            [
                frozenObject,
                null
            ]
        ]), new Set([
            frozenObject
        ]);
    } catch (e) {}
    exports.Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(children, function() {
                forEachFunc.apply(this, arguments);
            }, forEachContext);
        },
        count: function(children) {
            var n = 0;
            return mapChildren(children, function() {
                n++;
            }), n;
        },
        toArray: function(children) {
            return mapChildren(children, function(child) {
                return child;
            }) || [];
        },
        only: function(children) {
            if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
            return children;
        }
    }, exports.Component = Component, exports.PureComponent = PureComponent, exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals$1, exports.cloneElement = function(element, props, children) {
        for(var newElement = cloneElement.apply(this, arguments), i = 2; i < arguments.length; i++)validateChildKeys(arguments[i], newElement.type);
        return validatePropTypes(newElement), newElement;
    }, exports.createContext = function(defaultValue, calculateChangedBits) {
        void 0 === calculateChangedBits ? calculateChangedBits = null : null !== calculateChangedBits && 'function' != typeof calculateChangedBits && error1("createContext: Expected the optional second argument to be a function. Instead received: %s", calculateChangedBits);
        var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            _calculateChangedBits: calculateChangedBits,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
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
                    return hasWarnedAboutUsingConsumerProvider || (hasWarnedAboutUsingConsumerProvider = !0, error1("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), context.Provider;
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
                    return hasWarnedAboutUsingNestedContextConsumers || (hasWarnedAboutUsingNestedContextConsumers = !0, error1("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), context.Consumer;
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
        return validatedFactory.type = type, didWarnAboutDeprecatedCreateFactory || (didWarnAboutDeprecatedCreateFactory = !0, warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(validatedFactory, 'type', {
            enumerable: !1,
            get: function() {
                return warn("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, 'type', {
                    value: type
                }), type;
            }
        }), validatedFactory;
    }, exports.createRef = function() {
        var refObject = {
            current: null
        };
        return Object.seal(refObject), refObject;
    }, exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? error1("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : 'function' != typeof render ? error1('forwardRef requires a render function but was given %s.', null === render ? 'null' : typeof render) : 0 !== render.length && 2 !== render.length && error1('forwardRef render functions accept exactly two parameters: props and ref. %s', 1 === render.length ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.'), null != render && (null != render.defaultProps || null != render.propTypes) && error1("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var ownName, elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render: render
        };
        return Object.defineProperty(elementType, 'displayName', {
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
                    error1("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), defaultProps = newDefaultProps, Object.defineProperty(lazyType, 'defaultProps', {
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
                    error1("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), propTypes = newPropTypes, Object.defineProperty(lazyType, 'propTypes', {
                        enumerable: !0
                    });
                }
            }
        }), lazyType;
    }, exports.memo = function(type, compare) {
        isValidElementType(type) || error1("memo: The first argument must be a component. Instead received: %s", null === type ? 'null' : typeof type);
        var ownName, elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type: type,
            compare: void 0 === compare ? null : compare
        };
        return Object.defineProperty(elementType, 'displayName', {
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
        if (void 0 !== unstable_observedBits && error1("useContext() second argument is reserved for future use in React. Passing it is not supported. You passed: %s.%s", unstable_observedBits, 'number' == typeof unstable_observedBits && Array.isArray(arguments[2]) ? "\n\nDid you call array.map(useContext)? Calling Hooks inside a loop is not supported. Learn more at https://reactjs.org/link/rules-of-hooks" : ''), void 0 !== Context._context) {
            var realContext = Context._context;
            realContext.Consumer === Context ? error1("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : realContext.Provider === Context && error1("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
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
    }, exports.version = '17.0.2';
});
