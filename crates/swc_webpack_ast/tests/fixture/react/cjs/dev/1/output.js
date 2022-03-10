if (process.env.NODE_ENV !== "production") {
    var _assign = require("object-assign");
    // TODO: this is special because it gets imported during build.
    var ReactVersion;
    // ATTENTION
    // When adding new symbols to this file,
    // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var REACT_ELEMENT_TYPE;
    var REACT_PORTAL_TYPE;
    exports.Fragment = null;
    exports.StrictMode = null;
    exports.Profiler = null;
    var REACT_PROVIDER_TYPE;
    var REACT_CONTEXT_TYPE;
    var REACT_FORWARD_REF_TYPE;
    exports.Suspense = null;
    var REACT_SUSPENSE_LIST_TYPE;
    var REACT_MEMO_TYPE;
    var REACT_LAZY_TYPE;
    var REACT_BLOCK_TYPE;
    var REACT_SERVER_BLOCK_TYPE;
    var REACT_FUNDAMENTAL_TYPE;
    var REACT_SCOPE_TYPE;
    var REACT_OPAQUE_ID_TYPE;
    var REACT_DEBUG_TRACING_MODE_TYPE;
    var REACT_OFFSCREEN_TYPE;
    var REACT_LEGACY_HIDDEN_TYPE;
    var symbolFor;
    exports.Fragment = null;
    exports.StrictMode = null;
    exports.Profiler = null;
    exports.Suspense = null;
    var MAYBE_ITERATOR_SYMBOL;
    var FAUX_ITERATOR_SYMBOL;
    var maybeIterator;
    /**
         * Keeps track of the current dispatcher.
         */ var ReactCurrentDispatcher;
    /**
         * Keeps track of the current batch's configuration such as how long an update
         * should suspend for if it needs to.
         */ var ReactCurrentBatchConfig;
    /**
         * Keeps track of the current owner.
         *
         * The current owner is the component who should own any components that are
         * currently being constructed.
         */ var ReactCurrentOwner;
    var ReactDebugCurrentFrame;
    var currentExtraStackFrame;
    (function() {
        var stack; // Add an extra top frame while an element is being validated
        var impl;
    });
    /**
         * Used by act() to track whether you're inside an act() scope.
         */ var IsSomeRendererActing;
    var ReactSharedInternals;
    var ReactDebugCurrentFrame1;
    var stack;
    var argsWithFormat; // Careful: RN currently depends on this prefix
    var didWarnStateUpdateForUnmountedComponent;
    var _constructor;
    var componentName;
    var warningKey;
    /**
         * This is the abstract API for an update queue.
         */ var ReactNoopUpdateQueue;
    var emptyObject;
    var deprecatedAPIs;
    var defineDeprecationWarning;
    var fnName;
    var pureComponentPrototype;
    var refObject;
    var functionName;
    switch(null){
        case exports.Fragment:
        case exports.Profiler:
        case exports.StrictMode:
        case exports.Suspense:
    }
    switch(null){
        case null:
            var context;
        case null:
            var provider;
        case null:
            var lazyComponent;
            var payload;
            var init;
    }
    var hasOwnProperty;
    var RESERVED_PROPS;
    var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
    var getter;
    var getter1;
    var warnAboutAccessingKey;
    var warnAboutAccessingRef;
    var componentName1;
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
         */ var ReactElement = function() {
        var element;
    };
    var propName; // Reserved names are extracted
    var props;
    var key;
    var ref;
    var self;
    var source;
    // the newly allocated props object.
    var childrenLength;
    var childArray;
    var defaultProps;
    var displayName;
    var newElement;
    var propName1; // Original props are copied
    var props1; // Reserved names are extracted
    var key1;
    var ref1; // Self is preserved since the owner is preserved.
    var self1; // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source1; // Owner will be preserved, unless ref is overridden
    var owner;
    var defaultProps1;
    // the newly allocated props object.
    var childrenLength1;
    var childArray1;
    var SEPARATOR;
    var SUBSEPARATOR;
    var escapeRegex;
    var escaperLookup;
    var escapedString;
    /**
         * TODO: Test that a single child and an array with one item have the same key
         * pattern.
         */ var didWarnAboutMaps;
    var userProvidedKeyEscapeRegex;
    var type;
    var invokeCallback;
    var _child;
    var mappedChild; // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows:
    var childKey;
    var escapedChildKey;
    var child;
    var nextName;
    var subtreeCount; // Count of children found in the current subtree.
    var nextNamePrefix;
    var iteratorFn;
    var iterableChildren;
    var iterator;
    var step;
    var ii;
    var childrenString;
    var result;
    var count;
    var n;
    var context1;
    var hasWarnedAboutUsingNestedContextConsumers;
    var hasWarnedAboutUsingConsumerProvider;
    var hasWarnedAboutDisplayNameOnConsumer;
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer; // $FlowFixMe: Flow complains about not setting a value, which is intentional here
    var Uninitialized;
    var Pending;
    var Resolved;
    var Rejected;
    var ctor;
    var thenable; // Transition to the next state.
    var pending;
    (function() {
        var defaultExport;
        var resolved;
    }), function() {
        // Transition to the next state.
        var rejected;
    };
    var payload1;
    var lazyType;
    // In production, this would just set it on the object.
    var defaultProps2;
    var propTypes; // $FlowFixMe
    var elementType;
    var ownName;
    // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.
    var enableScopeAPI; // Experimental Create Event Handle API.
    exports.Fragment, exports.Profiler, exports.StrictMode, exports.Suspense;
    var elementType1;
    var ownName1;
    var dispatcher;
    var dispatcher1;
    var realContext; // Don't deduplicate because this legitimately causes bugs
    var dispatcher2;
    var dispatcher3;
    var dispatcher4;
    var dispatcher5;
    var dispatcher6;
    var dispatcher7;
    var dispatcher8;
    var dispatcher9;
    var dispatcher10;
    // Helpers to patch console.logs to avoid logging during side-effect free
    // replaying on render function. This currently only patches the object
    // lazily which won't cover if the log function was extracted eagerly.
    // We could also eagerly patch the method.
    var disabledDepth;
    var prevLog;
    var prevInfo;
    var prevWarn;
    var prevError;
    var prevGroup;
    var prevGroupCollapsed;
    var prevGroupEnd;
    var props2; // $FlowFixMe Flow thinks console is immutable.
    /* eslint-disable react-internal/no-production-logging */ var props3; // $FlowFixMe Flow thinks console is immutable.
    var ReactCurrentDispatcher$1;
    var prefix;
    var match;
    var reentry;
    var componentFrameCache;
    var PossiblyWeakMap;
    var frame;
    var control;
    var previousPrepareStackTrace; // $FlowFixMe It does accept undefined.
    var previousDispatcher;
    // Something should be setting the props in the constructor.
    var Fake; // $FlowFixMe
    // This extracts the first frame from the sample that isn't also in the control.
    // Skipping one frame that we assume is the frame that calls the two.
    var sampleLines;
    var controlLines;
    var s;
    var c;
    // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
    var _frame;
    var name;
    var syntheticFrame;
    var prototype;
    switch(null){
        case exports.Suspense:
    }
    switch(null){
        case null:
            var lazyComponent1;
            var payload2;
            var init1;
    }
    var loggedTypeFailures;
    var ReactDebugCurrentFrame$1;
    var owner1;
    var stack1;
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has;
    var typeSpecName;
    var error$1; // Prop type validation may throw. In case they do, we don't want to
    var err;
    var owner2;
    var stack2;
    var propTypesMisspellWarningShown;
    var name1;
    var fileName;
    var lineNumber;
    /**
         * Warn if there's no key explicitly set on dynamic arrays of children or
         * object keys are not valid. This allows us to keep track of children between
         * updates.
         */ var ownerHasKeyUseWarning;
    var info;
    var parentName;
    var currentComponentErrorInfo;
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.
    var childOwner;
    var child1;
    var iteratorFn1;
    var iterator1;
    var step1;
    var type1;
    var propTypes1;
    // Intentionally inside to avoid triggering lazy initializers:
    var name2;
    var _name;
    var keys;
    var key2;
    var validType; // We warn in this case but don't throw. We expect the element creation to
    var info1;
    var sourceInfo;
    var typeString;
    var element; // The result can be nullish if a mock or a custom function is used.
    exports.Fragment;
    var didWarnAboutDeprecatedCreateFactory;
    var validatedFactory;
    var newElement1;
    var frozenObject;
    var createElement$1;
    var cloneElement$1;
    var createFactory;
    var Children;
    exports.Children = null;
    exports.Component = null;
    exports.PureComponent = null;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = null;
    exports.cloneElement = null;
    exports.createContext = null;
    exports.createElement = null;
    exports.createFactory = null;
    exports.createRef = null;
    exports.forwardRef = null;
    exports.isValidElement = null;
    exports.lazy = null;
    exports.memo = null;
    exports.useCallback = null;
    exports.useContext = null;
    exports.useDebugValue = null;
    exports.useEffect = null;
    exports.useImperativeHandle = null;
    exports.useLayoutEffect = null;
    exports.useMemo = null;
    exports.useReducer = null;
    exports.useRef = null;
    exports.useState = null;
    exports.version = null;
}
