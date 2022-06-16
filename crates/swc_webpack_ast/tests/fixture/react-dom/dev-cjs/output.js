if (process.env.NODE_ENV !== "production") {
    var React = require('react');
    var _assign = require('object-assign');
    var Scheduler = require('scheduler');
    var tracing = require('scheduler/tracing');
    var ReactSharedInternals;
    var ReactDebugCurrentFrame;
    var stack;
    var argsWithFormat; // Careful: RN currently depends on this prefix
    var FunctionComponent;
    var ClassComponent;
    var IndeterminateComponent; // Before we know whether it is function or class
    var HostRoot; // Root of a host tree. Could be nested inside another node.
    var HostPortal; // A subtree. Could be an entry point to a different renderer.
    var HostComponent;
    var HostText;
    var Fragment;
    var Mode;
    var ContextConsumer;
    var ContextProvider;
    var ForwardRef;
    var Profiler;
    var SuspenseComponent;
    var MemoComponent;
    var SimpleMemoComponent;
    var LazyComponent;
    var IncompleteClassComponent;
    var DehydratedFragment;
    var SuspenseListComponent;
    var FundamentalComponent;
    var ScopeComponent;
    var Block;
    var OffscreenComponent;
    var LegacyHiddenComponent;
    // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.
    var enableProfilerTimer; // Record durations for commit and passive effects phases.
    var enableFundamentalAPI; // Experimental Scope support.
    var enableNewReconciler; // Errors that are thrown while unmounting (or after in the case of passive effects)
    var warnAboutStringRefs;
    var allNativeEvents;
    /**
  * Mapping from registration name to event name
  */ var registrationNameDependencies;
    /**
  * Mapping from lowercase registration names to the properly cased version,
  * used to warn in the case of missing event handlers. Available
  * only in true.
  * @type {Object}
  */ var possibleRegistrationNames; // Trust the developer to only use possibleRegistrationNames in true
    var lowerCasedName;
    var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');
    // A reserved attribute.
    // It is handled by React separately and shouldn't be written to the DOM.
    var RESERVED; // A simple string attribute.
    // Attributes that aren't in the filter are presumed to have this type.
    var STRING; // A string attribute that accepts booleans in React. In HTML, these are called
    // "enumerated" attributes with "true" and "false" as possible values.
    // When true, it should be set to a "true" string.
    // When false, it should be set to a "false" string.
    var BOOLEANISH_STRING; // A real boolean attribute.
    // When true, it should be present (set either to an empty string or its name).
    // When false, it should be omitted.
    var BOOLEAN; // An attribute that can be used as a flag as well as with a value.
    // When true, it should be present (set either to an empty string or its name).
    // When false, it should be omitted.
    // For any other value, should be present with that value.
    var OVERLOADED_BOOLEAN; // An attribute that must be numeric or parse as a numeric.
    // When falsy, it should be removed.
    var NUMERIC; // An attribute that must be positive numeric or parse as a positive numeric.
    // When falsy, it should be removed.
    var POSITIVE_NUMERIC;
    /* eslint-disable max-len */ var ATTRIBUTE_NAME_START_CHAR;
    /* eslint-enable max-len */ var ATTRIBUTE_NAME_CHAR;
    var ROOT_ATTRIBUTE_NAME;
    var VALID_ATTRIBUTE_NAME_REGEX;
    var hasOwnProperty;
    var illegalAttributeNameCache;
    var validatedAttributeNameCache;
    switch(null){
        case 'boolean':
            var prefix;
    }
    // the `possibleStandardNames` module to ensure casing and incorrect
    // name warnings.
    var properties; // These props are reserved by React. They shouldn't be written to the DOM.
    var reservedProps;
    (function() {
        var name, attributeName;
    }); // These are "enumerated" HTML attributes that accept "true" and "false".
    var CAMELIZE;
    var capitalize; // This is a list of all SVG attributes that need special casing, namespacing,
    (function() {
        var name;
    }); // String SVG attributes with the xlink namespace.
    (function() {
        var name;
    }); // String SVG attributes with the xml namespace.
    (function() {
        var name;
    }); // These attribute exists both in HTML and SVG.
    // These will also need to accept Trusted Types object in the future.
    var xlinkHref;
    // and any newline or tab are filtered out as if they're not part of the URL.
    // https://url.spec.whatwg.org/#url-parsing
    // Tab or newline are defined as \r\n\t:
    // https://infra.spec.whatwg.org/#ascii-tab-or-newline
    // A C0 control is a code point in the range \u0000 NULL to \u001F
    // INFORMATION SEPARATOR ONE, inclusive:
    // https://infra.spec.whatwg.org/#c0-control-or-space
    /* eslint-disable max-len */ var isJavaScriptProtocol;
    var didWarn;
    var propertyName;
    var attributeName;
    var stringValue;
    var value;
    var value1;
    var propertyInfo;
    var _attributeName;
    var mustUseProperty;
    var propertyName1;
    var type;
    var attributeName1, attributeNamespace;
    var _type;
    var attributeValue;
    // ATTENTION
    // When adding new symbols to this file,
    // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var REACT_ELEMENT_TYPE;
    var REACT_PORTAL_TYPE;
    var REACT_FRAGMENT_TYPE;
    var REACT_STRICT_MODE_TYPE;
    var REACT_PROFILER_TYPE;
    var REACT_PROVIDER_TYPE;
    var REACT_CONTEXT_TYPE;
    var REACT_FORWARD_REF_TYPE;
    var REACT_SUSPENSE_TYPE;
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
    var MAYBE_ITERATOR_SYMBOL;
    var FAUX_ITERATOR_SYMBOL;
    var maybeIterator;
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
    var props; // $FlowFixMe Flow thinks console is immutable.
    /* eslint-disable react-internal/no-production-logging */ var props1; // $FlowFixMe Flow thinks console is immutable.
    var ReactCurrentDispatcher;
    var prefix1;
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
        case null:
            var lazyComponent;
            var payload;
            var init;
    }
    var owner;
    var source;
    var info;
    var node;
    var functionName;
    switch(null){
        case null:
            var context;
        case null:
            var provider;
        case null:
            var lazyComponent1;
            var payload1;
            var init1;
    }
    var ReactDebugCurrentFrame1;
    var current;
    var isRendering;
    var owner1;
    var hasReadOnlyValue;
    var type1;
    var nodeName;
    var value2;
    var valueField;
    var descriptor;
    var currentValue; // if someone has already defined a value or Safari, then bail
    var get, set;
    var tracker;
    var tracker1; // if there is no tracker at this point it's unlikely
    var lastValue;
    var nextValue;
    var didWarnValueDefaultValue;
    var didWarnCheckedDefaultChecked;
    var didWarnControlledToUncontrolled;
    var didWarnUncontrolledToControlled;
    var usesChecked;
    var node1;
    var checked;
    var hostProps;
    var node2;
    var defaultValue;
    var node3;
    var checked1;
    var node4;
    var controlled;
    var value3;
    var type2;
    var node5; // Do not assign value if it is already set. This prevents user text input
    var type3;
    var isButton; // Avoid setting value attribute on submit/reset inputs as it overrides the
    var initialValue; // Do not assign value if it is already set. This prevents user text input
    // this is needed to work around a chrome bug where setting defaultChecked
    // will sometimes influence the value of checked (even after detachment).
    // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=608416
    // We need to temporarily unset name to avoid disrupting radio button groups.
    var name1;
    var node6;
    var name2;
    var queryRoot;
    // but that sometimes behaves strangely in IE8. We could also try using
    // `form.getElementsByName`, but that will only return direct children
    // and won't include inputs that use the HTML5 `form=` attribute. Since
    // the input might not even be in a form. It might not even be in the
    // document. Let's just use the local `querySelectorAll` to ensure we don't
    // miss anything.
    var group;
    var otherNode;
    // and the same name are rendered into the same form (same as #1939).
    // That's probably okay; we don't support it just as we don't support
    // mixing React radio buttons with non-React ones.
    var otherProps;
    var didWarnSelectedSetOnOption;
    var didWarnInvalidChild;
    var content; // Flatten children. We'll warn if they are invalid
    var hostProps1;
    var content1;
    var didWarnValueDefaultValue$1;
    var ownerName;
    var valuePropNames;
    var propName;
    var isArray;
    var options;
    var selectedValues;
    var selectedValue;
    var selected;
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    var _selectedValue;
    var defaultSelected;
    var node7;
    var node8;
    var value4;
    var node9;
    var wasMultiple;
    var value5;
    var node10;
    var value6;
    var didWarnValDefaultVal;
    var node11;
    // get reset if `textContent` is mutated.  We could add a check in setTextContent
    // to only set the value if/when the value differs from the node value (which would
    // completely solve this IE9 bug), but Sebastian+Sophie seemed to like this
    // solution. The value can be a boolean or object so that's why it's forced
    // to be a string.
    var hostProps2;
    var node12;
    var initialValue1; // Only bother fetching default value if we're going to use it
    var children, defaultValue1;
    var node13;
    var value7;
    var defaultValue2;
    // Cast `value` to a string to ensure the value is set correctly. While
    // browsers typically do this as necessary, jsdom doesn't.
    var newValue; // To avoid side effects (such as losing text selection), only set value if changed
    var node14; // This is in postMount because we need access to the DOM node, which is not
    // available until after the component has mounted.
    var textContent; // Only set node.value if textContent is equal to the expected
    var HTML_NAMESPACE;
    var MATH_NAMESPACE;
    var SVG_NAMESPACE;
    var Namespaces; // Assumes there is no parent namespace.
    /* globals MSApp */ /**
  * Create a function which has 'unsafe' privileges (required by windows8 apps)
  */ var createMicrosoftUnsafeLocalFunction;
    var reusableSVGContainer;
    /**
  * Set the innerHTML property of a node
  *
  * @param {DOMElement} node
  * @param {string} html
  * @internal
  */ var setInnerHTML = function() {
        var svgNode;
    };
    /**
  * HTML nodeType values that represent the type of the node
  */ var ELEMENT_NODE;
    var TEXT_NODE;
    var COMMENT_NODE;
    var DOCUMENT_NODE;
    var DOCUMENT_FRAGMENT_NODE;
    /**
  * Set the textContent property of a node. For text updates, it's faster
  * to set the `nodeValue` of the Text node directly instead of using
  * `.textContent` which will remove the existing node and create a new one.
  *
  * @param {DOMElement} node
  * @param {string} text
  * @internal
  */ var setTextContent = function() {
        var firstChild;
    };
    // List derived from Gecko source code:
    // https://github.com/mozilla/gecko-dev/blob/4e638efc71/layout/style/test/property_database.js
    var shorthandToLonghand;
    /**
  * CSS properties which accept numbers but are not in units of "px".
  */ var isUnitlessNumber;
    /**
  * Support style names that may come passed in prefixed by adding permutations
  * of vendor prefixes.
  */ var prefixes; // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
    // Note that we've removed escapeTextForBrowser() calls here since the
    // whole string will be escaped when the attribute is injected into
    // the markup. If you provide unsafe user data here they can inject
    // arbitrary CSS which may be problematic (I couldn't repro this):
    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
    // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
    // This is not an XSS hole but instead a potential CSS injection issue
    // which has lead to a greater discussion about how we're going to
    // trust URLs moving forward. See #2115901
    var isEmpty;
    var uppercasePattern;
    var msPattern;
    var warnValidStyle;
    // 'msTransform' is correct, but the other prefixes should be capitalized
    var badVendoredStyleNamePattern;
    var msPattern$1;
    var hyphenPattern; // style values shouldn't contain a semicolon
    var badStyleValueWithSemicolonPattern;
    var warnedStyleNames;
    var warnedStyleValues;
    var warnedForNaNValue;
    var warnedForInfinityValue;
    var camelize;
    var warnHyphenatedStyleName;
    var warnBadVendoredStyleName;
    var warnStyleValueWithSemicolon;
    var warnStyleValueIsNaN;
    var warnStyleValueIsInfinity;
    var warnValidStyle$1;
    var serialized;
    var delimiter;
    var styleName;
    var styleValue;
    var isCustomProperty;
    var style;
    var styleName1;
    var isCustomProperty1;
    var styleValue1;
    var expanded;
    var key;
    var longhands;
    var expandedUpdates;
    var expandedStyles;
    var warnedAbout;
    var key1;
    var originalKey;
    var correctOriginalKey;
    var warningKey;
    // For HTML, certain tags should omit their close tag. We keep a list for
    // those special-case tags.
    var omittedCloseTags;
    // `omittedCloseTags` except that `menuitem` should still have its closing tag.
    var voidElementTags;
    var HTML;
    // When adding attributes to the HTML or SVG allowed attribute list, be sure to
    // also add them to this module to ensure casing and incorrect name
    // warnings.
    var possibleStandardNames;
    var ariaProperties;
    var warnedProperties;
    var rARIA;
    var rARIACamel;
    var hasOwnProperty$1;
    var ariaName;
    var correctName; // If this is an aria-* attribute, but is not listed in the known DOM
    var lowerCasedName1;
    var standardName; // If this is an aria-* attribute, but is not listed in the known DOM
    var invalidProps;
    var key2;
    var isValid;
    var unknownPropString;
    var didWarnValueNull;
    var validateProperty$1;
    var warnedProperties$1;
    var _hasOwnProperty;
    var EVENT_NAME_REGEX;
    var INVALID_EVENT_NAME_REGEX;
    var rARIA$1;
    var rARIACamel$1;
    (function() {
        var lowerCasedName;
        var registrationNameDependencies, possibleRegistrationNames;
        var registrationName;
        var propertyInfo;
        var isReserved; // Known attributes should match the casing specified in the property config.
        var standardName;
    });
    var warnUnknownProperties = function() {
        var unknownProps;
        var key;
        var isValid;
        var unknownPropString;
    };
    var IS_EVENT_HANDLE_NON_MANAGED_NODE;
    var IS_NON_DELEGATED;
    var IS_CAPTURE_PHASE;
    var IS_REPLAYED;
    // set to LEGACY_FB_SUPPORT. LEGACY_FB_SUPPORT only gets set when
    // we call willDeferLaterForLegacyFBSupport, thus not bailing out
    // will result in endless cycles like an infinite loop.
    // We also don't want to defer during event replaying.
    var SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS;
    // Fallback to nativeEvent.srcElement for IE9
    // https://github.com/facebook/react/issues/12506
    var target; // Normalize SVG <use> element events #4963
    var restoreImpl;
    var restoreTarget;
    var restoreQueue;
    // We perform this translation at the end of the event loop so that we
    // always receive the correct fiber here
    var internalInstance;
    var stateNode; // Guard against Fiber being unmounted.
    var _props;
    var target1;
    var queuedTargets;
    // the renderer. Such as when we're dispatching events or if third party
    // libraries need to call batchedUpdates. Eventually, this API will go away when
    // everything is batched by default. We'll then have a similar API to opt-out of
    // scheduled work and instead do synchronous work.
    // Defaults
    var batchedUpdatesImpl;
    var discreteUpdatesImpl;
    var flushDiscreteUpdatesImpl;
    var batchedEventUpdatesImpl;
    var isInsideEventHandler;
    var isBatchingEventUpdates;
    // Here we wait until all updates have propagated, which is important
    // when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    // Then we restore state of any controlled component.
    var controlledComponentsHavePendingUpdates;
    var prevIsInsideEventHandler;
    var stateNode1;
    var props2;
    var listener;
    var passiveBrowserEventsSupported; // Check if browser support events with passive listeners
    var options1; // $FlowFixMe: Ignore Flow complaining about needing a value
    var funcArgs;
    var invokeGuardedCallbackImpl;
    var fakeNode;
    (function invokeGuardedCallbackDev() {
        var evt;
        var didCall; // Keeps track of whether the user-provided callback threw an error. We
        // set this to true at the beginning, then set it to false right after
        // calling the function. If the function errors, `didError` will never be
        // set to false. This strategy works even if the browser is flaky and
        // fails to call our global error handler, because it doesn't rely on
        // the error event at all.
        var didError; // Keeps track of the value of window.event so that we can reset it
        // during the callback to let user code access window.event in the
        // browsers that support it.
        var windowEvent; // Keeps track of the descriptor of window.event to restore it after event
        // dispatching: https://github.com/facebook/react/issues/13688
        var windowEventDescriptor;
        // dispatch our fake event using `dispatchEvent`. Inside the handler, we
        // call the user-provided callback.
        var funcArgs;
        // that was thrown. It's possible that this error handler will fire more
        // than once; for example, if non-React code also calls `dispatchEvent`
        // and a handler for that event throws. We should be resilient to most of
        // those cases. Even if our error event handler fires more than once, the
        // last error event is always used. If the callback actually does error,
        // we know that the last error event is the correct one, because it's not
        // possible for anything else to have happened in between our callback
        // erroring and the code that follows the `dispatchEvent` call below. If
        // the callback doesn't error, but the error event was fired, we know to
        // ignore it because `didError` will be false, as described above.
        var error; // Use this to track whether the error event is ever called.
        var didSetError;
        var isCrossOriginError;
        var evtType; // Attach our event handlers
    });
    var invokeGuardedCallbackImpl$1;
    var hasError;
    var caughtError; // Used by event system to capture/rethrow the first error.
    var hasRethrowError;
    var rethrowError;
    var reporter;
    var error;
    var error1;
    var error2;
    // Don't change these two values. They're used by React Dev Tools.
    var NoFlags;
    var PerformedWork; // You can change the rest (and add more).
    var Placement;
    var Update;
    var PlacementAndUpdate;
    var Deletion;
    var ContentReset;
    var Callback;
    var DidCapture;
    var Ref;
    var Snapshot;
    var Passive; // TODO (effects) Remove this bit once the new reconciler is synced to the old.
    var PassiveUnmountPendingDev;
    var Hydrating;
    var HydratingAndUpdate; // Passive & Update & Callback & Ref & Snapshot
    var LifecycleEffectMask; // Union of all host effects
    var HostEffectMask; // These are not really side effects, but we still reuse this field.
    var Incomplete;
    var ShouldCapture;
    var ForceUpdateForLegacySuspense; // Static tags describe aspects of a fiber that are not specific to a render,
    var ReactCurrentOwner;
    var node15;
    var nearestMounted;
    // If there is no alternate, this might be a new tree that isn't inserted
    // yet. If it is, then it will have a pending insertion effect on it.
    var nextNode;
    var suspenseState;
    var current1;
    var owner2;
    var ownerFiber;
    var instance;
    var fiber;
    var alternate;
    // If there is no alternate, then we only need to check if it is mounted.
    var nearestMounted1;
    // to see what path the root points to. On the way we may hit one of the
    // special cases and we'll deal with them.
    var a;
    var b;
    var parentA;
    var parentB;
    // There is no alternate. This is an unusual case. Currently, it only
    // happens when a Suspense component is hidden. An extra fragment fiber
    // is inserted in between the Suspense fiber and its children. Skip
    // over this extra fragment fiber and proceed to the next parent.
    var nextParent;
    var child;
    // The return pointers point to the same fiber. We'll have to use the
    // default, slow path: scan the child sets of each parent alternate to see
    // which child belongs to which set.
    //
    // Search parent A's child set
    var didFindChild;
    var _child;
    var currentParent;
    var node16;
    var currentParent1;
    var node17;
    var node18;
    var parentFiberAlternate;
    var attemptUserBlockingHydration;
    var attemptContinuousHydration;
    var attemptHydrationAtCurrentPriority;
    var attemptHydrationAtPriority;
    var hasScheduledReplayAttempt; // The queue of discrete events to be replayed.
    var queuedDiscreteEvents; // Indicates if any continuous event targets are non-null for early bailout.
    // if the last target was dehydrated.
    var queuedFocus;
    var queuedDrag;
    var queuedMouse; // For pointer events there can be one latest event per pointerId.
    var queuedPointers;
    var queuedPointerCaptures; // We could consider replaying selectionchange and touchmoves too.
    var queuedExplicitHydrationTargets;
    var discreteReplayableEvents;
    var queuedEvent;
    switch(null){
        case 'pointerout':
            var pointerId;
        case 'lostpointercapture':
            var _pointerId;
    }
    var queuedEvent1;
    var _fiber2;
    var targetContainers;
    // These set relatedTarget to null because the replayed event will be treated as if we
    // moved from outside the window (no target) onto the target once it hydrates.
    // Instead of mutating we could clone the event.
    switch(null){
        case 'focusin':
            var focusEvent;
        case 'dragenter':
            var dragEvent;
        case 'mouseover':
            var mouseEvent;
        case 'pointerover':
            var pointerEvent;
            var pointerId1;
        case 'gotpointercapture':
            var _pointerEvent;
            var _pointerId2;
    }
    // TODO: This function shares a lot of logic with attemptToDispatchEvent.
    // Try to unify them. It's a bit tricky since it would require two return
    // values.
    var targetInst;
    var nearestMounted2;
    var tag;
    var instance1;
    var root;
    var targetContainers1;
    var targetContainer;
    var nextBlockedOn;
    // We're still blocked. Try again later.
    var _fiber3;
    var nextDiscreteEvent;
    // We're still blocked.
    // Increase the priority of this boundary to unblock
    // the next discrete event.
    var _fiber4;
    var targetContainers2;
    var targetContainer1;
    var nextBlockedOn1;
    var queuedEvent2;
    var unblock;
    var queuedTarget;
    var nextExplicitTarget;
    var DiscreteEvent;
    var UserBlockingEvent;
    var ContinuousEvent;
    var prefixes1;
    /**
  * A list of event names to a configurable list of vendor prefixes.
  */ var vendorPrefixes;
    /**
  * Event names that have already been detected and prefixed (if applicable).
  */ var prefixedEventNames;
    /**
  * Element to check for prefixes on.
  */ var style1;
    var prefixMap;
    var styleProp;
    var ANIMATION_END;
    var ANIMATION_ITERATION;
    var ANIMATION_START;
    var TRANSITION_END;
    var topLevelEventsToReactNames;
    var eventPriorities; // We store most of the events in this module in pairs of two strings so we can re-use
    // the code required to apply the same logic for event prioritization and that of the
    // SimpleEventPlugin. This complicates things slightly, but the aim is to reduce code
    // duplication (for which there would be quite a bit). For the events that are not needed
    // for the SimpleEventPlugin (otherDiscreteEvents) we process them separately as an
    // array of top level events.
    // Lastly, we ignore prettier so we can keep the formatting sane.
    // prettier-ignore
    var discreteEventPairsForSimpleEventPlugin;
    var otherDiscreteEvents;
    var userBlockingPairsForSimpleEventPlugin; // prettier-ignore
    var continuousPairsForSimpleEventPlugin;
    var topEvent;
    var event;
    var capitalizedEvent;
    var reactName;
    var priority; // Default to a ContinuousEvent. Note: we might
    var Scheduler_now;
    // ascending numbers so we can compare them like numbers. They start at 90 to
    // avoid clashing with Scheduler's priorities.
    var ImmediatePriority;
    var UserBlockingPriority;
    var NormalPriority;
    var LowPriority;
    var IdlePriority; // NoPriority is the absence of priority. Also React-only.
    var NoPriority;
    var initialTimeMs; // If the initial timestamp is reasonably small, use Scheduler's `now` directly.
    var SyncLanePriority;
    var SyncBatchedLanePriority;
    var InputDiscreteHydrationLanePriority;
    var InputDiscreteLanePriority;
    var InputContinuousHydrationLanePriority;
    var InputContinuousLanePriority;
    var DefaultHydrationLanePriority;
    var DefaultLanePriority;
    var TransitionHydrationPriority;
    var TransitionPriority;
    var RetryLanePriority;
    var SelectiveHydrationLanePriority;
    var IdleHydrationLanePriority;
    var IdleLanePriority;
    var OffscreenLanePriority;
    var NoLanePriority;
    var TotalLanes;
    var NoLanes;
    var NoLane;
    var SyncLane;
    var SyncBatchedLane;
    var InputDiscreteHydrationLane;
    var InputDiscreteLanes;
    var InputContinuousHydrationLane;
    var InputContinuousLanes;
    var DefaultHydrationLane;
    var DefaultLanes;
    var TransitionHydrationLane;
    var TransitionLanes;
    var RetryLanes;
    var SomeRetryLane;
    var SelectiveHydrationLane;
    var NonIdleLanes;
    var IdleHydrationLane;
    var IdleLanes;
    var OffscreenLane;
    var NoTimestamp;
    // Used by getHighestPriorityLanes and getNextLanes:
    var return_highestLanePriority;
    var inputDiscreteLanes;
    var inputContinuousLanes;
    var defaultLanes;
    var transitionLanes;
    var retryLanes;
    var idleLanes;
    // Early bailout if there's no pending work left.
    var pendingLanes;
    var nextLanes;
    var nextLanePriority;
    var expiredLanes;
    var suspendedLanes;
    var pingedLanes; // Check if any work has expired.
    // Do not work on any idle work until all the non-idle work has finished,
    // even if the work is suspended.
    var nonIdlePendingLanes;
    var nonIdleUnblockedLanes;
    var nonIdlePingedLanes;
    // The only remaining work is Idle.
    var unblockedLanes;
    var wipLanePriority;
    //
    // A lane is said to be entangled with another when it's not allowed to render
    // in a batch that does not also include the other lane. Typically we do this
    // when multiple updates have the same source, and we only want to respond to
    // the most recent event from that source.
    //
    // Note that we apply entanglements *after* checking for partial work above.
    // This means that if a lane is entangled during an interleaved event while
    // it's already rendering, we won't interrupt it. This is intentional, since
    // entanglement is usually "best effort": we'll try our best to render the
    // lanes in the same batch, but it's not worth throwing out partially
    // completed work in order to do it.
    //
    // For those exceptions where entanglement is semantically important, like
    // useMutableSource, we should ensure that there is no partial work at the
    // time we apply the entanglement.
    var entangledLanes;
    var entanglements;
    var lanes;
    var index;
    var lane;
    var eventTimes;
    var mostRecentEventTime;
    var index1;
    var lane1;
    var eventTime;
    var priority1;
    // TODO: This gets called every time we yield. We can optimize by storing
    // the earliest expiration time on the root. Then use that to quickly bail out
    // of this function.
    var pendingLanes1;
    var suspendedLanes1;
    var pingedLanes1;
    var expirationTimes; // Iterate through the pending lanes and check if we've reached their
    // expiration time. If so, we'll assume the update is being starved and mark
    // it as expired to force it to finish.
    var lanes1;
    var index2;
    var lane2;
    var expirationTime;
    var everythingButOffscreen;
    switch(null){
        case null:
            var _lane;
        case null:
            var _lane2;
        case null:
            var _lane3;
        case null:
            var lane3;
    }
    // First look for lanes that are completely unclaimed, i.e. have no
    // pending work.
    var lane4;
    // This is a fork of `findUpdateLane` designed specifically for Suspense
    // "retries" — a special update that attempts to flip a Suspense boundary
    // from its placeholder state to its primary/resolved state.
    var lane5;
    // This finds the most significant non-zero bit.
    var index3;
    // Intentionally pushing one by one.
    // https://v8.dev/blog/elements-kinds#avoid-creating-holes
    var laneMap;
    // it's not practical to try every single possible combination. We need a
    // heuristic to decide which lanes to attempt to render, and in which batches.
    // For now, we use the same heuristic as in the old ExpirationTimes model:
    // retry any lane at equal or lower priority, but don't try updates at higher
    // priority without also including the lower priority updates. This works well
    // when considering updates across different priority levels, but isn't
    // sufficient for updates within the same priority, since we want to treat
    // those updates as parallel.
    // Unsuspend any update at equal or lower priority.
    var higherPriorityLanes; // Turns 0b1000 into 0b0111
    var eventTimes1;
    var index4; // We can always overwrite an existing timestamp because we prefer the most
    var expirationTimes1;
    var lanes2;
    var index5;
    var lane6;
    var noLongerPendingLanes;
    var entanglements1;
    var eventTimes2;
    var expirationTimes2; // Clear the lanes that no longer have pending work
    var lanes3;
    var index6;
    var lane7;
    var entanglements2;
    var lanes4;
    var index7;
    var lane8;
    var clz32; // Count leading zeros. Only used on lanes, so assume input is an integer.
    // Based on:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
    var log;
    var LN2;
    // Intentionally not named imports because Rollup would use dynamic dispatch for
    var UserBlockingPriority$1, runWithPriority; // TODO: can we stop exporting these?
    var _enabled; // This is exported in FB builds for use by legacy FB layer infra.
    var eventPriority;
    var listenerWrapper;
    var allowReplay;
    var blockedOn;
    // TODO: Warn if _enabled is false.
    var nativeEventTarget;
    var targetInst1;
    var nearestMounted3;
    var tag1;
    var instance2;
    var root1;
    /**
  * These variables store information about text content of a target node,
  * allowing comparison of content before and after a given event.
  *
  * Identify the node where selection currently begins, then observe
  * both its text content and its current position in the DOM. Since the
  * browser may natively replace the target node during composition, we can
  * use its position to find its replacement.
  *
  *
  */ var root2;
    var startText;
    var fallbackText;
    var start;
    var startValue;
    var startLength;
    var end;
    var endValue;
    var endLength;
    var minEnd;
    var sliceTail;
    var charCode;
    var keyCode;
    var _propName;
    var normalize;
    var defaultPrevented;
    (function() {
        var event;
    }), function() {
        var event;
    };
    /**
  * @interface Event
  * @see http://www.w3.org/TR/DOM-Level-3-Events/
  */ var EventInterface;
    var SyntheticEvent;
    var UIEventInterface;
    var SyntheticUIEvent;
    var lastMovementX;
    var lastMovementY;
    var lastMouseEvent;
    /**
  * @interface MouseEvent
  * @see http://www.w3.org/TR/DOM-Level-3-Events/
  */ var MouseEventInterface;
    var SyntheticMouseEvent;
    /**
  * @interface DragEvent
  * @see http://www.w3.org/TR/DOM-Level-3-Events/
  */ var DragEventInterface;
    var SyntheticDragEvent;
    /**
  * @interface FocusEvent
  * @see http://www.w3.org/TR/DOM-Level-3-Events/
  */ var FocusEventInterface;
    var SyntheticFocusEvent;
    /**
  * @interface Event
  * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
  * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
  */ var AnimationEventInterface;
    var SyntheticAnimationEvent;
    /**
  * @interface Event
  * @see http://www.w3.org/TR/clipboard-apis/
  */ var ClipboardEventInterface;
    var SyntheticClipboardEvent;
    /**
  * @interface Event
  * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
  */ var CompositionEventInterface;
    var SyntheticCompositionEvent;
    /**
  * @interface Event
  * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
  *      /#events-inputevents
  */ // Happens to share the same list for now.
    var SyntheticInputEvent;
    /**
  * Normalization of deprecated HTML5 `key` values
  * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
  */ var normalizeKey;
    /**
  * Translation from legacy `keyCode` to HTML5 `key`
  * Only special keys supported, all others depend on keyboard layout or browser
  * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
  */ var translateToKey;
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.
    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key3;
    var charCode1; // The enter-key is technically both printable and non-printable and can
    /**
  * Translation from modifier key to the associated property in the event.
  * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
  */ var modifierKeyToProp; // Older browsers (Safari <= 10, iOS Safari <= 10.2) do not support
    var syntheticEvent;
    var nativeEvent;
    var keyProp;
    /**
  * @interface KeyboardEvent
  * @see http://www.w3.org/TR/DOM-Level-3-Events/
  */ var KeyboardEventInterface;
    var SyntheticKeyboardEvent;
    /**
  * @interface PointerEvent
  * @see http://www.w3.org/TR/pointerevents/
  */ var PointerEventInterface;
    var SyntheticPointerEvent;
    /**
  * @interface TouchEvent
  * @see http://www.w3.org/TR/touch-events/
  */ var TouchEventInterface;
    var SyntheticTouchEvent;
    /**
  * @interface Event
  * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
  * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
  */ var TransitionEventInterface;
    var SyntheticTransitionEvent;
    /**
  * @interface WheelEvent
  * @see http://www.w3.org/TR/DOM-Level-3-Events/
  */ var WheelEventInterface;
    var SyntheticWheelEvent;
    var END_KEYCODES; // Tab, Return, Esc, Space
    var START_KEYCODE;
    var canUseCompositionEvent;
    var documentMode;
    // directly represent `beforeInput`. The IE `textinput` event is not as
    // useful, so we don't use it.
    var canUseTextInputEvent; // In IE9+, we have access to composition events, but the data supplied
    // by the native compositionend event may be incorrect. Japanese ideographic
    // spaces, for instance (\u3000) are not recorded correctly.
    var useFallbackCompositionData;
    var SPACEBAR_CODE;
    var SPACEBAR_CHAR;
    var hasSpaceKeypress;
    var detail;
    var isComposing;
    var eventType;
    var fallbackData;
    var listeners;
    var event1;
    var customData;
    switch(null){
        case 'keypress':
            /**
        * If native `textInput` events are available, our goal is to make
        * use of them. However, there is a special case: the spacebar key.
        * In Webkit, preventing default on a spacebar `textInput` event
        * cancels character insertion, but it *also* causes the browser
        * to fall back to its default spacebar behavior of scrolling the
        * page.
        *
        * Tracking at:
        * https://code.google.com/p/chromium/issues/detail?id=355103
        *
        * To avoid this issue, use the keypress event as if no `textInput`
        * event is available.
        */ var which;
        case 'textInput':
            // Record the characters to be added to the DOM.
            var chars; // If it's a spacebar character, assume that we have already handled
    }
    var chars1;
    var chars2;
    var listeners1;
    var event2;
    /**
  * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
  */ var supportedInputTypes;
    var nodeName1;
    var eventName;
    var isSupported;
    var element;
    var listeners2;
    var event3;
    /**
  * For IE shims
  */ var activeElement;
    var activeElementInst;
    var nodeName2;
    var dispatchQueue;
    var targetNode;
    /**
  * SECTION: handle `input` event
  */ var isInputEventSupported;
    // Use the `click` event to detect changes to checkbox and radio inputs.
    // This approach works across all browsers, whereas `change` does not fire
    // until `blur` in IE8.
    var nodeName3;
    var state;
    var targetNode1;
    var getTargetInstFunc, handleEventFunc;
    var inst;
    var isOverEvent;
    var isOutEvent;
    // If this is an over event with a target, we might have already dispatched
    // the event in the out event of the other target. If this is replayed,
    // then it's because we couldn't dispatch against this target previously
    // so we have to do it now instead.
    var related;
    var win; // TODO: why is this nullable in the types but we read from it?
    // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
    var doc;
    var from;
    var to;
    var _related;
    var nearestMounted4;
    var SyntheticEventCtor;
    var leaveEventType;
    var enterEventType;
    var eventTypePrefix;
    var fromNode;
    var toNode;
    var leave;
    var enter; // We should only process this nativeEvent if we are processing
    // the first ancestor. Next time, we will ignore the event.
    var nativeTargetInst;
    var enterEvent;
    var objectIs;
    var hasOwnProperty$2;
    var keysA;
    var keysB;
    var node19;
    var nodeStart;
    var nodeEnd;
    var ownerDocument;
    var win1;
    var selection;
    var anchorNode, anchorOffset, focusNode, focusOffset; // In Firefox, anchorNode and focusNode can be "anonymous divs", e.g. the
    var length;
    var start1;
    var end1;
    var indexWithinAnchor;
    var indexWithinFocus;
    var node20;
    var parentNode;
    var next;
    var doc1;
    var win2; // Edge fails with "Object expected" in some scenarios.
    var selection1;
    var length1;
    var start2;
    var end2; // IE 11 uses modern selection, but doesn't support the extend method.
    var temp;
    var startMarker;
    var endMarker;
    var range;
    var win3;
    var element1;
    var nodeName4;
    var focusedElem;
    var curFocusedElem;
    var priorFocusedElem;
    var priorSelectionRange;
    var ancestors;
    var ancestor;
    var info1;
    var selection2;
    var start3;
    var end3;
    var skipSelectionChangeEvent;
    var activeElement$1;
    var activeElementInst$1;
    var lastSelection;
    var mouseDown;
    var win4;
    var selection3;
    // Ensure we have the right element, and that the user is not dragging a
    // selection (this matches native `select` event behavior). In HTML5, select
    // fires only on input and textarea thus if there's no focused element we
    // won't dispatch.
    var doc2;
    var currentSelection;
    var listeners3;
    var event4;
    var targetNode2;
    var reactName1;
    var SyntheticEventCtor1;
    var reactEventType;
    var inCapturePhase;
    // Some events don't bubble in the browser.
    // In the past, React has always bubbled them, but this can be surprising.
    // We're going to try aligning closer to the browser behavior by not bubbling
    // them in React either. We'll start by not bubbling onScroll, and then expand.
    var accumulateTargetOnly;
    var _listeners;
    // Intentionally create event lazily.
    var _event;
    var shouldProcessPolyfillPlugins; // We don't process these events unless we are in the
    var mediaEventTypes; // We should not delegate these events to the container, but rather
    // set them on the actual target element itself. This is primarily
    // because these events do not consistently bubble in the DOM.
    var nonDelegatedEvents;
    var type4;
    var previousInstance;
    var _dispatchListeners$i, instance3, currentTarget, listener1;
    var _dispatchListeners$_i, _instance, _currentTarget, _listener;
    var inCapturePhase1;
    var _dispatchQueue$i, event5, listeners4;
    var nativeEventTarget1;
    var dispatchQueue1;
    var isCapturePhaseListener;
    var listenerSet;
    var listenerSetKey;
    var listeningMarker;
    var eventSystemFlags;
    var target2; // selectionchange needs to be attached to the document
    var listenerSet1;
    var listenerSetKey1; // If the listener entry is empty or we should upgrade, then
    var listener2; // If passive option is not supported, then the event will be
    // active and not passive.
    var isPassiveListener;
    var unsubscribeListener; // When legacyFBSupport is enabled, it's for when we
    var ancestorInst;
    var targetContainerNode; // If we are using the legacy FB support flag, we
    // The below logic attempts to work out if we need to change
    // the target fiber to a different ancestor. We had similar logic
    // in the legacy event system, except the big difference between
    // systems is that the modern event system now has an event listener
    // attached to each React Root and React Portal Root. Together,
    // the DOM nodes representing these roots are the "rootContainer".
    // To figure out which ancestor instance we should use, we traverse
    // up the fiber tree from the target instance and attempt to find
    // root boundaries that match that of our current "rootContainer".
    // If we find that "rootContainer", we find the parent fiber
    // sub-tree for that root and make that our ancestor instance.
    var node21;
    var nodeTag;
    var container1;
    // The target is a portal, but it's not the rootContainer we're looking for.
    // Normally portals handle their own events all the way down to the root.
    // So we should be able to stop now. However, we don't know if this portal
    // was part of *our* root.
    var grandNode;
    var grandTag;
    var grandContainer;
    var parentNode1;
    var parentTag;
    var captureName;
    var reactEventName;
    var listeners5;
    var instance4;
    var lastHostComponent; // Accumulate all instances and listeners via the target -> root path.
    var _instance2, stateNode2, tag2; // Handle listeners that are on HostComponents (i.e. <div>)
    var listener3;
    var captureName1;
    var listeners6;
    var instance5; // Accumulate all instances and listeners via the target -> root path.
    var _instance3, stateNode3, tag3; // Handle listeners that are on HostComponents (i.e. <div>)
    var currentTarget1;
    var captureListener;
    var bubbleListener;
    var nodeA;
    var nodeB;
    var depthA;
    var depthB;
    var depth;
    var registrationName;
    var listeners7;
    var instance6;
    var _instance4, alternate1, stateNode4, tag4;
    var currentTarget2;
    var captureListener1;
    var bubbleListener1;
    var common;
    var didWarnInvalidHydration;
    var DANGEROUSLY_SET_INNER_HTML;
    var SUPPRESS_CONTENT_EDITABLE_WARNING;
    var SUPPRESS_HYDRATION_WARNING;
    var AUTOFOCUS;
    var CHILDREN;
    var STYLE;
    var HTML$1;
    var HTML_NAMESPACE$1;
    var warnedUnknownTags;
    var suppressHydrationWarning;
    var validatePropertiesInDevelopment;
    var warnForTextDifference;
    var warnForPropDifference;
    var warnForExtraAttributes;
    var warnForInvalidEventListener;
    var canDiffStyleForHydrationWarning;
    var normalizeMarkupForTextOrAttribute;
    var normalizeHTML;
    // It also can turn \u0000 into \uFFFD inside attributes.
    // https://www.w3.org/TR/html5/single-page.html#preprocessing-the-input-stream
    // If we have a mismatch, it might be caused by that.
    // We will still patch up in this case but not fire the warning.
    var NORMALIZE_NEWLINES_REGEX;
    var NORMALIZE_NULL_AND_REPLACEMENT_REGEX;
    (function() {
        var markupString;
    });
    (function() {
        var normalizedClientText;
        var normalizedServerText;
    });
    (function() {
        var normalizedClientValue;
        var normalizedServerValue;
    });
    (function() {
        var names;
    });
    (function() {
        // We could have created a separate document here to avoid
        // re-initializing custom elements if they exist. But this breaks
        // how <noscript> is being handled. So we use the same document.
        // See the discussion in https://github.com/facebook/react/pull/11157.
        var testElement;
    });
    var propKey;
    var nextProp;
    var nextHtml;
    // Avoid setting initial textContent when the text is empty. In IE11 setting
    // textContent on a <textarea> will cause the placeholder to not
    // show within the <textarea> until it has been focused and blurred again.
    // https://github.com/facebook/react/issues/6731#issuecomment-254874553
    var canSetTextContent;
    var propKey1;
    var propValue;
    var isCustomComponentTag; // We create tags in the namespace of their parent container, except HTML
    // tags get no namespace.
    var ownerDocument1;
    var domElement;
    var namespaceURI;
    // Create the script via .innerHTML so its "parser-inserted" flag is
    // set to true and it does not execute
    var div;
    // This is guaranteed to yield a script element.
    var firstChild;
    var node22;
    var isCustomComponentTag1;
    var props3;
    var updatePayload;
    var lastProps;
    var nextProps;
    var propKey2;
    var styleName2;
    var styleUpdates;
    var lastStyle;
    var nextProp1;
    var lastProp;
    var nextHtml1;
    var lastHtml;
    var wasCustomComponentTag;
    var isCustomComponentTag2; // Apply the diff.
    var lowerCasedName2;
    var isCustomComponentTag3;
    var extraAttributeNames;
    var attributes;
    var name3;
    var updatePayload1;
    var propKey3;
    var nextProp2;
    // Validate that the properties correspond to their expected values.
    var serverValue;
    var propertyInfo1;
    var serverHTML;
    var nextHtml2;
    var expectedHTML;
    var expectedStyle;
    var isMismatchDueToBadCasing;
    var ownNamespace;
    var standardName1;
    var isDifferent;
    var validateDOMNesting;
    var updatedAncestorInfo;
    // This validation code was written based on the HTML5 parsing spec:
    // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
    //
    // Note: this does not catch all invalid nesting, nor does it try to (as it's
    // not clear what practical benefit doing so provides); instead, we warn only
    // for cases where the parser will give a parse tree differing from what React
    // intended. For example, <b><div></div></b> is invalid but we don't warn
    // because it still parses correctly; we do warn for other cases like nested
    // <p> tags where the beginning of the second element implicitly closes the
    // first, causing a confusing mess.
    // https://html.spec.whatwg.org/multipage/syntax.html#special
    var specialTags; // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
    var inScopeTags; // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-button-scope
    var buttonScopeTags; // https://html.spec.whatwg.org/multipage/syntax.html#generate-implied-end-tags
    var impliedEndTags;
    var emptyAncestorInfo;
    (function() {
        var ancestorInfo;
        var info;
    });
    /**
    * Returns whether
    */ var isTagValidWithParent;
    /**
    * Returns whether
    */ var findInvalidAncestorForTag;
    var didWarn$1;
    (function() {
        var parentInfo;
        var parentTag;
        var invalidParent;
        var invalidAncestor;
        var invalidParentOrAncestor;
        var ancestorTag;
        var warnKey;
        var tagDisplayName;
        var whitespaceInfo;
        var info;
    });
    var SUPPRESS_HYDRATION_WARNING$1;
    var SUSPENSE_START_DATA;
    var SUSPENSE_END_DATA;
    var SUSPENSE_PENDING_START_DATA;
    var SUSPENSE_FALLBACK_START_DATA;
    var STYLE$1;
    var eventsEnabled;
    var selectionInformation;
    var type5;
    var namespace;
    var nodeType;
    switch(null){
        case null:
            var root3;
        default:
            var container2;
            var ownNamespace1;
    }
    var validatedTag;
    var ancestorInfo;
    var parentHostContextDev;
    var namespace1;
    var ancestorInfo1;
    var activeInstance;
    var parentNamespace;
    // TODO: take namespace into account when validating.
    var hostContextDev;
    var string;
    var ownAncestorInfo;
    var domElement1;
    var hostContextDev1;
    var string1;
    var ownAncestorInfo1;
    var hostContextDev2;
    var textNode;
    // if a component just imports ReactDOM (e.g. for findDOMNode).
    // Some environments might not have setTimeout or clearTimeout.
    var scheduleTimeout;
    var cancelTimeout;
    var noTimeout; // -------------------
    var parentNode2;
    // If something inside a portal is clicked, that click should bubble
    // through the React tree. However, on Mobile Safari the click would
    // never bubble through the *DOM* tree unless an ancestor with onclick
    // event exists. So we wouldn't see it and dispatch it.
    // This is why we ensure that non React root containers have inline onclick
    // defined.
    // https://github.com/facebook/react/issues/11918
    var reactRootContainer;
    var style2;
    var styleProp1;
    var display;
    var body;
    var nodeType1;
    var parentNamespace1;
    var hostContextDev3;
    var node23; // Skip past all nodes within this suspense boundary.
    // There might be nested nodes so we need to keep track of how
    // deep we are and only break out when we're back on top.
    var depth1;
    var data;
    var node24; // Skip past all nodes within this suspense boundary.
    // There might be nested nodes so we need to keep track of how
    // deep we are and only break out when we're back on top.
    var depth2;
    var data1;
    var clientId;
    var id;
    var randomKey;
    var internalInstanceKey;
    var internalPropsKey;
    var internalContainerInstanceKey;
    var internalEventHandlersKey;
    var targetInst2;
    // to see if one of its parents is a React owned DOM node.
    var parentNode3;
    // Since this wasn't the direct target of the event, we might have
    // stepped past dehydrated DOM nodes to get here. However they could
    // also have been non-React nodes. We need to answer which one.
    // If we the instance doesn't have any children, then there can't be
    // a nested suspense boundary within it. So we can use this as a fast
    // bailout. Most of the time, when people add non-React children to
    // the tree, it is using a ref to a child-less DOM node.
    // Normally we'd only need to check one of the fibers because if it
    // has ever gone from having children to deleting them or vice versa
    // it would have deleted the dehydrated boundary nested inside already.
    // However, since the HostRoot starts out with an alternate it might
    // have one on the alternate so we need to check in case this was a
    // root.
    var alternate2;
    // Next we need to figure out if the node that skipped past is
    // nested within a dehydrated boundary and if so, which one.
    var suspenseInstance;
    // We found a suspense instance. That means that we haven't
    // hydrated it yet. Even though we leave the comments in the
    // DOM after hydrating, and there are boundaries in the DOM
    // that could already be hydrated, we wouldn't have found them
    // through this pass since if the target is hydrated it would
    // have had an internalInstanceKey on it.
    // Let's get the fiber associated with the SuspenseComponent
    // as the deepest instance.
    var targetSuspenseInst;
    var inst1;
    var elementListenerSet;
    var loggedTypeFailures;
    var ReactDebugCurrentFrame$1;
    var owner3;
    var stack1;
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has;
    var typeSpecName;
    var error$1; // Prop type validation may throw. In case they do, we don't want to
    var err;
    var valueStack;
    var fiberStack;
    var index8;
    var warnedAboutMissingGetChildContext;
    var emptyContextObject;
    var contextStackCursor; // A cursor to a boolean indicating whether the context has changed.
    var didPerformWorkStackCursor; // Keep track of the previous context object that was on the stack.
    // We use this to get access to the parent context after we have already
    // pushed the next context provider, and now need to merge their contexts.
    var previousContext;
    var instance7;
    var type6;
    var contextTypes;
    // Failing to do this will result in unnecessary calls to componentWillReceiveProps.
    // This may trigger infinite loops if componentWillReceiveProps calls setState.
    var instance8;
    var context1;
    var key4;
    var name4;
    var childContextTypes;
    var instance9;
    var childContextTypes1; // TODO (bvaughn) Replace this behavior with an invariant() in the future.
    var componentName;
    var childContext;
    var contextKey;
    var name5;
    var instance10; // We push the context as early as possible to ensure stack integrity.
    // If the instance does not exist yet, we will push null at first,
    // and replace it on the stack later when invalidating the context.
    var memoizedMergedChildContext; // Remember the parent context so we can merge with it later.
    var instance11;
    // Merge parent and own context.
    // Skip this if we're not updating due to sCU.
    // This avoids unnecessarily recomputing memoized values.
    var mergedContext;
    var node25;
    switch(null){
        case null:
            var Component;
    }
    var LegacyRoot;
    var BlockingRoot;
    var ConcurrentRoot;
    var rendererID;
    var injectedHook;
    var hasLoggedError;
    var isDevToolsPresent;
    var hook;
    var didError;
    var Scheduler_runWithPriority, Scheduler_scheduleCallback, Scheduler_cancelCallback, Scheduler_shouldYield, Scheduler_requestPaint, Scheduler_now$1, Scheduler_getCurrentPriorityLevel, Scheduler_ImmediatePriority, Scheduler_UserBlockingPriority, Scheduler_NormalPriority, Scheduler_LowPriority, Scheduler_IdlePriority;
    var fakeCallbackNode; // Except for NoPriority, these correspond to Scheduler priorities. We use
    // ascending numbers so we can compare them like numbers. They start at 90 to
    // avoid clashing with Scheduler's priorities.
    var ImmediatePriority$1;
    var UserBlockingPriority$2;
    var NormalPriority$1;
    var LowPriority$1;
    var IdlePriority$1; // NoPriority is the absence of priority. Also React-only.
    var NoPriority$1;
    var shouldYield;
    var requestPaint;
    var syncQueue;
    var immediateQueueCallbackNode;
    var isFlushingSyncQueue;
    var initialTimeMs$1; // If the initial timestamp is reasonably small, use Scheduler's `now` directly.
    // This will be the case for modern browsers that support `performance.now`. In
    // older browsers, Scheduler falls back to `Date.now`, which returns a Unix
    // timestamp. In that case, subtract the module initialization time to simulate
    // the behavior of performance.now and keep our times small enough to fit
    // within 32 bits.
    // TODO: Consider lifting this into Scheduler.
    var now;
    var priorityLevel;
    var priorityLevel1;
    var node26;
    var i;
    var _isSync2;
    var _queue;
    (function() {
        var callback;
    });
    // TODO: this is special because it gets imported during build.
    var ReactVersion;
    var NoMode;
    var StrictMode; // TODO: Remove BlockingMode and ConcurrentMode by reading from the root
    // tag instead
    var BlockingMode;
    var ConcurrentMode;
    var ProfileMode;
    var DebugTracingMode;
    var ReactCurrentBatchConfig;
    var NoTransition;
    var ReactStrictModeWarnings;
    var findStrictRoot = function() {
        var maybeStrictRoot;
        var node;
    };
    var setToSortedString = function() {
        var array;
    };
    var pendingComponentWillMountWarnings;
    var pendingUNSAFE_ComponentWillMountWarnings;
    var pendingComponentWillReceivePropsWarnings;
    var pendingUNSAFE_ComponentWillReceivePropsWarnings;
    var pendingComponentWillUpdateWarnings;
    var pendingUNSAFE_ComponentWillUpdateWarnings; // Tracks components we have already warned about.
    var didWarnAboutUnsafeLifecycles;
    (function() {
        // We do an initial pass to gather component names
        var componentWillMountUniqueNames;
        var UNSAFE_componentWillMountUniqueNames;
        var componentWillReceivePropsUniqueNames;
        var UNSAFE_componentWillReceivePropsUniqueNames;
        var componentWillUpdateUniqueNames;
        var UNSAFE_componentWillUpdateUniqueNames;
        var sortedNames;
        var _sortedNames;
        var _sortedNames2;
        var _sortedNames3;
        var _sortedNames4;
        var _sortedNames5;
    });
    var pendingLegacyContextWarning; // Tracks components we have already warned about.
    var didWarnAboutLegacyContext;
    (function() {
        var strictRoot;
        var warningsForRoot;
    });
    (function() {
        (function() {
            var firstFiber;
            var uniqueNames;
            var sortedNames;
        });
    });
    // Resolve default props. Taken from ReactElement
    var props4;
    var defaultProps;
    var propName1;
    // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
    // Math.pow(2, 30) - 1
    // 0b111111111111111111111111111111
    var MAX_SIGNED_31_BIT_INT;
    var valueCursor;
    var rendererSigil;
    var currentlyRenderingFiber;
    var lastContextDependency;
    var lastContextWithAllBitsObserved;
    var isDisallowedContextReadInDEV;
    var context2;
    var currentValue1;
    var context3;
    var changedBits;
    // Update the child lanes of all the ancestors, including the alternates.
    var node27;
    var alternate3;
    var fiber1;
    var nextFiber; // Visit this fiber.
    var list;
    var dependency;
    // Schedule a force update on the work-in-progress.
    var update;
    var alternate4;
    var sibling;
    var dependencies;
    var firstContext;
    var resolvedObservedBits; // Avoid deopting on observable arguments or heterogeneous types.
    var contextItem;
    var UpdateState;
    var ReplaceState;
    var ForceUpdate;
    var CaptureUpdate; // Global state that is reset at the beginning of calling `processUpdateQueue`.
    // It should only be read right after calling `processUpdateQueue`, via
    // `checkHasForceUpdateAfterProcessing`.
    var hasForceUpdate;
    var didWarnUpdateInsideUpdate;
    var currentlyProcessingQueue;
    var queue;
    // Clone the update queue from current. Unless it's already a clone.
    var queue1;
    var currentQueue;
    var clone;
    var update1;
    var updateQueue;
    var sharedQueue;
    var pending;
    // Captured updates are updates that are thrown by a child during the render
    // phase. They should be discarded if the render is aborted. Therefore,
    // we should only put them on the work-in-progress queue, not the current one.
    var queue2; // Check if the work-in-progress queue is a clone.
    var current2;
    var currentQueue1;
    // The work-in-progress queue is the same as current. This happens when
    // we bail out on a parent fiber that then captures an error thrown by
    // a child. Since we want to append the update only to the work-in
    // -progress queue, we need to clone the updates. We usually clone during
    // processUpdateQueue, but that didn't happen in this case because we
    // skipped over the parent when we bailed out.
    var newFirst;
    var newLast;
    var firstBaseUpdate;
    // Loop through the updates and clone them.
    var update2;
    var clone1;
    var lastBaseUpdate;
    switch(null){
        case null:
            var payload2;
            var nextState;
        // Intentional fallthrough
        case null:
            var _payload;
            var partialState;
    }
    // This is always non-null on a ClassComponent or HostRoot
    var queue3;
    var firstBaseUpdate1;
    var lastBaseUpdate1; // Check if there are pending updates. If so, transfer them to the base queue.
    var pendingQueue;
    // and last so that it's non-circular.
    var lastPendingUpdate;
    var firstPendingUpdate;
    // we need to transfer the updates to that queue, too. Because the base
    // queue is a singly-linked list with no cycles, we can append to both
    // lists and take advantage of structural sharing.
    // TODO: Pass `current` as argument
    var current3;
    // This is always non-null on a ClassComponent or HostRoot
    var currentQueue2;
    var currentLastBaseUpdate;
    // Iterate through the list of updates to compute the result.
    var newState; // TODO: Don't need to accumulate this. Instead, we can remove renderLanes
    // from the original lanes.
    var newLanes;
    var newBaseState;
    var newFirstBaseUpdate;
    var newLastBaseUpdate;
    var update3;
    var updateLane;
    var updateEventTime;
    // Priority is insufficient. Skip this update. If this is the first
    // skipped update, the previous update/state is the new base
    // update/state.
    var clone2;
    var _clone;
    var callback;
    var effects;
    // An update was scheduled from inside a reducer. Add the new
    // pending updates to the end of the list and keep processing.
    var _lastPendingUpdate; // Intentionally unsound. Pending updates form a circular list, but we
    // unravel them when transferring them to the base queue.
    var _firstPendingUpdate;
    // Commit the effects
    var effects1;
    var effect;
    var callback1;
    var fakeInternalInstance;
    var isArray1; // React.Component uses a shared frozen object by default.
    // We'll use it to determine whether we need to initialize legacy refs.
    var emptyRefsObject;
    var didWarnAboutStateAssignmentForComponent;
    var didWarnAboutUninitializedState;
    var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
    var didWarnAboutLegacyLifecyclesAndDerivedState;
    var didWarnAboutUndefinedDerivedState;
    var warnOnUndefinedDerivedState;
    var warnOnInvalidCallback;
    var didWarnAboutDirectlyAssigningPropsToState;
    var didWarnAboutContextTypeAndContextTypes;
    var didWarnAboutInvalidateContextType;
    var didWarnOnInvalidCallback;
    (function() {
        var key;
    });
    (function() {
        var componentName;
    }); // This is so gross but it's at least non-critical and can be removed if
    var prevState;
    var partialState1;
    var memoizedState;
    // Queue is always non-null for classes
    var updateQueue1;
    var classComponentUpdater = (function() {
        var fiber;
        var eventTime;
        var lane;
        var update;
    }, function() {
        var fiber;
        var eventTime;
        var lane;
        var update;
    });
    var instance12;
    var shouldUpdate;
    var instance13;
    var name6;
    var renderPresent;
    var hasMutatedProps;
    var _state;
    var isLegacyContextConsumer;
    var unmaskedContext;
    var context4;
    var contextType;
    var isValid1; // Not a <Context.Consumer>
    var addendum;
    var contextTypes1;
    var instance14;
    var state1;
    var componentName1;
    var foundWillMountName;
    var foundWillReceivePropsName;
    var foundWillUpdateName;
    var _componentName;
    var newApiName;
    var oldState;
    var oldState1;
    var componentName2;
    var instance15;
    var contextType1;
    var unmaskedContext1;
    var componentName3;
    var getDerivedStateFromProps;
    var instance16;
    var oldProps;
    var oldContext;
    var contextType2;
    var nextContext;
    var nextLegacyUnmaskedContext;
    var getDerivedStateFromProps1;
    var hasNewLifecycles; // Note: During these life-cycles, instance.props/instance.state are what
    var oldState2;
    var newState1;
    var shouldUpdate1;
    var instance17;
    var unresolvedOldProps;
    var oldProps1;
    var unresolvedNewProps;
    var oldContext1;
    var contextType3;
    var nextContext1;
    var nextUnmaskedContext;
    var getDerivedStateFromProps2;
    var hasNewLifecycles1; // Note: During these life-cycles, instance.props/instance.state are what
    var oldState3;
    var newState2;
    var shouldUpdate2;
    var didWarnAboutMaps;
    var didWarnAboutGenerators;
    var didWarnAboutStringRefs;
    var ownerHasKeyUseWarning;
    var ownerHasFunctionTypeWarning;
    var warnForMissingKey;
    (function() {
        var componentName;
    });
    var isArray$1;
    var mixedRef;
    var componentName4;
    var owner4;
    var inst2;
    var ownerFiber1;
    var stringRef; // Check if previous string ref matches new string ref
    var ref = function() {
        var refs;
    };
    var componentName5;
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.
    var last;
    // assuming that after the first child we've already added everything.
    var childToDelete;
    // Add the remaining children to a temporary map so that we can find them by
    // keys quickly. Implicit (null) keys get added to this set with their index
    // instead.
    var existingChildren;
    var existingChild;
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    var clone3;
    var current4;
    var oldIndex;
    // Insert
    var created;
    // Update
    var existing;
    // Move based on index
    var existing1;
    var created1;
    // Insert
    var created2;
    // Update
    var existing2;
    // Insert
    var created3;
    // Update
    var existing3;
    // Text nodes don't have keys. If the previous node is implicitly keyed
    // we can continue to replace it without aborting even if it is not a text
    // node.
    var created4;
    switch(null){
        case null:
            var _created;
        case null:
            var _created2;
    }
    var _created3;
    // Update the fiber if the keys match, otherwise return null.
    var key5;
    // Text nodes don't have keys, so we neither have to check the old nor
    // new node for the key. If both are text nodes, they match.
    var matchedFiber;
    switch(null){
        case null:
            var _matchedFiber;
        case null:
            var _matchedFiber2;
    }
    var _matchedFiber3;
    switch(null){
        case null:
            var key6;
    }
    // First, validate keys.
    var knownKeys;
    var child1;
    var resultingFirstChild;
    var previousNewFiber;
    var oldFiber;
    var lastPlacedIndex;
    var newIdx;
    var nextOldFiber;
    var newFiber;
    var _newFiber;
    var existingChildren1; // Keep scanning and use the map to restore deleted items as moves.
    var _newFiber2;
    // This is the same implementation as reconcileChildrenArray(),
    // but using the iterator instead.
    var iteratorFn;
    // We'll get a different iterator later for the main pass.
    var _newChildren;
    var knownKeys1;
    var _step;
    var child2;
    var newChildren;
    var resultingFirstChild1;
    var previousNewFiber1;
    var oldFiber1;
    var lastPlacedIndex1;
    var newIdx1;
    var nextOldFiber1;
    var step;
    var newFiber1;
    var _newFiber3;
    var existingChildren2; // Keep scanning and use the map to restore deleted items as moves.
    var _newFiber4;
    var existing4;
    var created5;
    var key7;
    var child3;
    switch(null){
        case null:
            var existing5;
        // We intentionally fallthrough here if enableBlocksAPI is not on.
        // eslint-disable-next-lined no-fallthrough
        default:
            var _existing3;
    } // Didn't match.
    var created6;
    var _created4;
    var key8;
    var child4;
    var existing6;
    var created7;
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.
    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    var isUnkeyedTopLevelFragment;
    var isObject;
    // If the new child is undefined, and the return fiber is a composite
    // component, throw an error. If Fiber return types are disabled,
    // we already threw above.
    switch(null){
        case null:
            var instance18;
    }
    var reconcileChildFibers;
    var mountChildFibers;
    var currentChild;
    var newChild;
    var child5;
    var NO_CONTEXT;
    var contextStackCursor$1;
    var contextFiberStackCursor;
    var rootInstanceStackCursor;
    var rootInstance;
    var nextRootContext; // Now that we know this function doesn't throw, replace it.
    var context5;
    var rootInstance1;
    var context6;
    var nextContext2; // Don't push this Fiber's context unless it's unique.
    var DefaultSuspenseContext; // The Suspense Context is split into two parts. The lower bits is
    // inherited deeply down the subtree. The upper bits only affect
    // this immediate suspense boundary and gets reset each new
    // boundary or suspense list.
    var SubtreeSuspenseContextMask; // Subtree Flags:
    // InvisibleParentSuspenseContext indicates that one of our parent Suspense
    // boundaries is not currently showing visible main content.
    // Either because it is already showing a fallback or is not mounted at all.
    // We can use this to determine if it is desirable to trigger a fallback at
    // the parent. If not, then we might need to trigger undesirable boundaries
    // and/or suspend the commit to avoid hiding the parent content.
    var InvisibleParentSuspenseContext; // Shallow Flags:
    // ForceSuspenseFallback can be used by SuspenseList to force newly added
    // items into their fallback state during one of the render passes.
    var ForceSuspenseFallback;
    var suspenseStackCursor;
    // If it was the primary children that just suspended, capture and render the
    // fallback. Otherwise, don't capture and bubble to the next boundary.
    var nextState1;
    var props5; // In order to capture, the Suspense component must have a fallback prop.
    var node28;
    var state2;
    var dehydrated;
    var didSuspend;
    var NoFlags$1; // Represents whether effect should fire.
    var HasEffect; // Represents the phase in which the effect (not the clean-up) fires.
    var Layout;
    var Passive$1;
    // This may have been an insertion or a hydration.
    var hydrationParentFiber;
    var nextHydratableInstance;
    var isHydrating;
    var parentInstance;
    var childToDelete1;
    switch(null){
        case null:
            var parentContainer;
            switch(null){
                case null:
                    var type7;
                    var props6;
                case null:
                    var text;
            }
        case null:
            var parentType;
            var parentProps;
            var parentInstance1;
            switch(null){
                case null:
                    var _type1;
                    var _props1;
                case null:
                    var _text;
            }
    }
    switch(null){
        case null:
            var type8;
            var props7;
            var instance19;
        case null:
            var text1;
            var textInstance;
    }
    var nextInstance;
    var firstAttemptedInstance;
    var instance20;
    var updatePayload2; // TODO: Type this specific to this type of component.
    var textInstance1;
    var textContent1;
    var shouldUpdate3;
    // We assume that prepareToHydrateHostTextInstance is called in a context where the
    // hydration parent is the parent host component of this host text.
    var returnFiber;
    switch(null){
        case null:
            var parentContainer1;
        case null:
            var parentType1;
            var parentProps1;
            var parentInstance2;
    }
    var suspenseState1;
    var suspenseInstance1;
    var parent;
    var type9; // If we have any remaining hydratable nodes, we need to delete them now.
    var nextInstance1;
    // and should be reset before starting a new render.
    // This tracks which mutable sources need to be reset after a render.
    var workInProgressSources;
    var rendererSigil$1;
    var mutableSource;
    var ReactCurrentDispatcher$1, ReactCurrentBatchConfig$1;
    var didWarnAboutMismatchedHooksForComponent;
    var didWarnAboutUseOpaqueIdentifier;
    // These are set right before calling the component.
    var renderLanes; // The work-in-progress fiber. I've named it differently to distinguish it from
    // the work-in-progress hook.
    var currentlyRenderingFiber$1; // Hooks are stored as a linked list on the fiber's memoizedState field. The
    // current hook list is the list that belongs to the current fiber. The
    // work-in-progress hook list is a new list that will be added to the
    // work-in-progress fiber.
    var currentHook;
    var workInProgressHook; // Whether an update was scheduled at any point during the render phase. This
    // does not get reset if we do another render pass; only when we're completely
    // finished evaluating this component. This is an optimization so we know
    // whether we need to clear render phase updates after a throw.
    var didScheduleRenderPhaseUpdate; // Where an update was scheduled only during the current render pass. This
    // gets reset after each attempt.
    // TODO: Maybe there's some way to consolidate this with
    // `didScheduleRenderPhaseUpdate`. Or with `numberOfReRenders`.
    var didScheduleRenderPhaseUpdateDuringThisPass;
    var RE_RENDER_LIMIT; // In DEV, this is the name of the currently executing primitive hook
    var currentHookNameInDev; // In DEV, this list ensures that hooks are called in the same order between renders.
    // The list stores the order of hooks used during the initial render (mount).
    // Subsequent renders (updates) reference this list.
    var hookTypesDev;
    var hookTypesUpdateIndexDev; // In DEV, this tracks whether currently rendering component needs to ignore
    // the dependencies for Hooks that need them (e.g. useEffect or useMemo).
    // When true, such Hooks will always be "remounted". Only used during hot reload.
    var ignorePreviousDependencies;
    var hookName;
    var hookName1;
    var componentName6;
    var table;
    var secondColumnStart;
    var oldHookName;
    var newHookName;
    var row; // Extra space so second column lines up
    var children1; // Check if there was a render phase update
    // Keep rendering in a loop for as long as render phase updates continue to
    // be scheduled. Use a counter to prevent infinite loops.
    var numberOfReRenders;
    // hookTypesDev could catch more cases (e.g. context) but only in DEV bundles.
    var didRenderTooFewHooks;
    // There were render phase updates. These are only valid for this render
    // phase, which we are now aborting. Remove the updates from the queues so
    // they do not persist to the next render. Do not remove updates from hooks
    // that weren't processed.
    //
    // Only reset the updates from the queue if it has a clone. If it does
    // not have a clone, that means it wasn't processed, and the updates were
    // scheduled before we entered the render phase.
    var hook1;
    var queue4;
    var hook2;
    // This function is used both for updates and for re-renders triggered by a
    // render phase update. It assumes there is either a current hook we can
    // clone, or a work-in-progress hook from a previous render pass that we can
    // use as a base. When we reach the end of the base list, we must switch to
    // the dispatcher used for mounts.
    var nextCurrentHook;
    var current5;
    var nextWorkInProgressHook;
    var newHook;
    var hook3;
    var initialState;
    var queue5;
    var dispatch;
    var hook4;
    var queue6;
    var current6; // The last rebase update that is NOT part of the base state.
    var baseQueue; // The last pending update that hasn't been processed yet.
    var pendingQueue1;
    // Merge the pending queue and the base queue.
    var baseFirst;
    var pendingFirst;
    // We have a queue to process.
    var first;
    var newState3;
    var newBaseState1;
    var newBaseQueueFirst;
    var newBaseQueueLast;
    var update4;
    var updateLane1;
    // Priority is insufficient. Skip this update. If this is the first
    // skipped update, the previous update/state is the new base
    // update/state.
    var clone4;
    var _clone1;
    var action;
    var dispatch1;
    var hook5;
    var queue7;
    // work-in-progress hook.
    var dispatch2;
    var lastRenderPhaseUpdate;
    var newState4;
    var firstRenderPhaseUpdate;
    var update5;
    // Process this render phase update. We don't have to check the
    // priority because it will always be the same as the current
    // render's.
    var action1;
    var getVersion;
    var version; // Is it safe for this component to read from this source during the current render?
    var isSafeToReadFromSource; // Check the version first.
    // If this render has already been started with a specific version,
    // we can use it alone to determine if we can safely read from the source.
    var currentRenderVersion;
    var snapshot;
    var root4;
    var getVersion1;
    var version1;
    var dispatcher; // eslint-disable-next-line prefer-const
    var _dispatcher$useState, currentSnapshot, setSnapshot;
    var snapshot1; // Grab a handle to the state hook as well.
    // We use it to clear the pending update queue if we have a new source.
    var stateHook;
    var memoizedState1;
    var refs;
    var prevGetSnapshot;
    var prevSource;
    var prevSubscribe;
    var fiber2;
    (function() {
        var maybeNewVersion;
        var maybeNewSnapshot;
        var lane;
    }); // If we got a new source or subscribe function, re-subscribe in a passive effect.
    (function() {
        var handleChange = function() {
            var latestGetSnapshot;
            var latestSetSnapshot;
            var lane;
        };
        var unsubscribe;
    }); // If any of the inputs to useMutableSource change, reading is potentially unsafe.
    // Create a new queue and setState method,
    // So if there are interleaved updates, they get pushed to the older queue.
    // When this becomes current, the previous queue and dispatch method will be discarded,
    // including any interleaving updates that occur.
    var newQueue;
    var hook6;
    var hook7;
    var hook8;
    var queue8;
    var dispatch3;
    var effect1;
    var componentUpdateQueue;
    var lastEffect;
    var firstEffect;
    var hook9;
    var ref1;
    var hook10;
    var hook11;
    var nextDeps;
    var hook12;
    var nextDeps1;
    var destroy;
    var prevEffect;
    var prevDeps;
    var refCallback;
    var _inst;
    var refObject;
    var _inst2;
    var effectDeps;
    var effectDeps1;
    var updateDebugValue;
    var hook13;
    var nextDeps2;
    var hook14;
    var nextDeps3;
    var prevState1;
    var prevDeps1;
    var hook15;
    var nextDeps4;
    var nextValue1;
    var hook16;
    var nextDeps5;
    var prevState2;
    var prevDeps2;
    var nextValue2;
    var _mountState, prevValue, setValue;
    (function() {
        var prevTransition;
    });
    var _updateState, prevValue1, setValue1;
    (function() {
        var prevTransition;
    });
    var _rerenderState, prevValue2, setValue2;
    (function() {
        var prevTransition;
    });
    var priorityLevel2;
    (function() {
        var prevTransition;
    });
    var _mountState2, isPending, setPending; // The `start` method can be stored on a ref, since `setPending`
    // never changes.
    var start4;
    var _updateState2, isPending1;
    var startRef;
    var start5;
    var _rerenderState2, isPending2;
    var startRef1;
    var start6;
    var isUpdatingOpaqueValueInRenderPhase;
    // TODO: Should warn in effects and callbacks, too
    var name7;
    var makeId;
    var didUpgrade;
    var fiber3;
    var readValue;
    var id1;
    var setId;
    var _id;
    var id2;
    var id3;
    var eventTime1;
    var lane9;
    var update6; // Append the update to the end of the list.
    var pending1;
    var alternate5;
    // The queue is currently empty, which means we can eagerly compute the
    // next state before entering the render phase. If the new state is the
    // same as the current state, we may be able to bail out entirely.
    var lastRenderedReducer;
    var prevDispatcher;
    var currentState;
    var eagerState; // Stash the eagerly computed state, and the reducer used to compute
    var ContextOnlyDispatcher;
    var HooksDispatcherOnMountInDEV;
    var HooksDispatcherOnMountWithHookTypesInDEV;
    var HooksDispatcherOnUpdateInDEV;
    var HooksDispatcherOnRerenderInDEV;
    var InvalidNestedHooksDispatcherOnMountInDEV;
    var InvalidNestedHooksDispatcherOnUpdateInDEV;
    var InvalidNestedHooksDispatcherOnRerenderInDEV;
    var warnInvalidContextAccess;
    var warnInvalidHookAccess;
    (function() {
        var prevDispatcher;
    }), function() {
        var prevDispatcher;
    };
    (function() {
        var prevDispatcher;
    }), function() {
        var prevDispatcher;
    };
    (function() {
        var prevDispatcher;
    }), function() {
        var prevDispatcher;
    };
    (function() {
        var prevDispatcher;
    }), function() {
        var prevDispatcher;
    };
    (function() {
        var prevDispatcher;
    }), function() {
        var prevDispatcher;
    };
    (function() {
        var prevDispatcher;
    }), function() {
        var prevDispatcher;
    };
    (function() {
        var prevDispatcher;
    }), function() {
        var prevDispatcher;
    };
    var now$1;
    var commitTime;
    var profilerStartTime;
    var elapsedTime;
    // Transfer time spent rendering these children so we don't lose it
    // after we rerender. This is used as a helper in special cases
    // where we should count the work of multiple passes.
    var child6;
    var ReactCurrentOwner$1;
    var didReceiveUpdate;
    var didWarnAboutBadClass;
    var didWarnAboutModulePatternComponent;
    var didWarnAboutContextTypeOnFunctionComponent;
    var didWarnAboutGetDerivedStateOnFunctionComponent;
    var didWarnAboutFunctionRefs;
    var didWarnAboutReassigningProps;
    var didWarnAboutRevealOrder;
    var didWarnAboutTailOptions;
    // Lazy component props can't be validated in createElement
    // because they're only guaranteed to be resolved here.
    var innerPropTypes;
    var render;
    var ref2; // The rest is a fork of updateFunctionComponent
    var nextChildren;
    var type10;
    var resolvedType;
    var innerPropTypes1;
    var child7;
    var _type2;
    var _innerPropTypes;
    var currentChild1; // This is always exactly one child
    // This will be the props with resolved defaultProps,
    // unlike current.memoizedProps which will be the unresolved ones.
    var prevProps; // Default to shallow comparison
    var compare;
    var newChild1;
    // Lazy component props can't be validated in createElement
    // because they're only guaranteed to be resolved here.
    var outerMemoType;
    // We warn when you define propTypes on lazy()
    // so let's just skip over it to find memo() outer wrapper.
    // Inner props for memo are validated later.
    var lazyComponent2;
    var payload3;
    var init2;
    var outerPropTypes;
    var prevProps1;
    var nextProps1;
    var nextChildren1;
    var prevState3;
    // In legacy sync mode, don't defer the subtree. Render it now.
    // TODO: Figure out what we should do in Blocking mode.
    var nextState2;
    var nextBaseLanes;
    var prevBaseLanes;
    var _nextState;
    // Rendering at offscreen, so we can clear the base lanes.
    var _nextState2;
    var subtreeRenderLanes;
    var _subtreeRenderLanes;
    // ourselves to this constraint, though. If the behavior diverges, we should
    // fork the function.
    var updateLegacyHiddenComponent;
    var nextChildren2;
    var nextChildren3;
    // These are reset during render to allow the DevTools commit hook a chance to read them,
    var stateNode5;
    var nextProps2;
    var nextChildren4;
    var ref3;
    // Lazy component props can't be validated in createElement
    // because they're only guaranteed to be resolved here.
    var innerPropTypes2;
    var context7;
    var unmaskedContext2;
    var nextChildren5;
    // Lazy component props can't be validated in createElement
    // because they're only guaranteed to be resolved here.
    var innerPropTypes3;
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    var hasContext;
    var instance21;
    var shouldUpdate4;
    var nextUnitOfWork;
    var inst3;
    var didCaptureError;
    var instance22; // Rerender
    var nextChildren6;
    var root5;
    var updateQueue2;
    var nextProps3;
    var prevState4;
    var prevChildren;
    var nextState3; // Caution: React DevTools currently depends on this property
    // being called "element".
    var nextChildren7;
    var root6;
    var mutableSourceEagerHydrationData;
    var mutableSource1;
    var version2;
    var child8;
    var node29;
    var type11;
    var nextProps4;
    var prevProps2;
    var nextChildren8;
    var isDirectTextChild;
    var props8;
    var lazyComponent3;
    var payload4;
    var init3;
    var Component1; // Store the unwrapped component in the type.
    var resolvedTag;
    var resolvedProps;
    var child9;
    switch(null){
        case null:
            var outerPropTypes1;
    }
    var hint;
    // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    var hasContext1;
    var props9;
    var context8;
    var unmaskedContext3;
    var value8;
    var componentName7;
    var _componentName1;
    var _componentName2;
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    var hasContext2;
    var getDerivedStateFromProps3;
    var info2;
    var ownerName1;
    var warningKey1;
    var debugSource;
    var _componentName3;
    var _componentName4;
    var SUSPENDED_MARKER;
    var suspenseState2;
    var nextProps5; // This is used by DevTools to force a boundary to suspend.
    var suspenseContext;
    var showFallback;
    var didSuspend1;
    var nextPrimaryChildren;
    var nextFallbackChildren;
    var fallbackFragment;
    var primaryChildFragment;
    // This is a CPU-bound tree. Skip this tree and show a placeholder to
    // unblock the surrounding content. Then immediately retry after the
    // initial commit.
    var _fallbackFragment;
    var _primaryChildFragment;
    // This is an update.
    // If the current fiber has a SuspenseState, that means it's already showing
    // a fallback.
    var prevState5;
    var _nextFallbackChildren2;
    var _nextPrimaryChildren2;
    var _fallbackChildFragment;
    var _primaryChildFragment3;
    var prevOffscreenState;
    var _nextPrimaryChildren3;
    var _primaryChildFragment4;
    // Timed out.
    var _nextFallbackChildren3;
    var _nextPrimaryChildren4;
    var _fallbackChildFragment2;
    var _primaryChildFragment5;
    var _prevOffscreenState;
    // Still haven't timed out. Continue rendering the children, like we
    // normally do.
    var _nextPrimaryChildren5;
    var _primaryChildFragment6;
    var mode;
    var primaryChildProps;
    var primaryChildFragment1;
    var mode1;
    var progressedPrimaryFragment;
    var primaryChildProps1;
    var primaryChildFragment2;
    var fallbackChildFragment;
    var currentPrimaryChildFragment;
    var currentFallbackChildFragment;
    var primaryChildFragment3;
    var mode2;
    var currentPrimaryChildFragment1;
    var currentFallbackChildFragment1;
    var primaryChildProps2;
    var primaryChildFragment4;
    var progressedPrimaryFragment1;
    // However, since we're going to remain on the fallback, we no longer want
    // to delete it. So we need to remove it from the list. Deletions are stored
    // on the same list as effects. We want to keep the effects from the primary
    // tree. So we copy the primary child fragment's effect list, which does not
    // include the fallback deletion effect.
    var progressedLastEffect;
    var fallbackChildFragment1;
    var alternate6;
    // Mark any Suspense boundaries with fallbacks as having work to do.
    // If they were previously forced into fallbacks, they may now be able
    // to unblock.
    var node30;
    var state3;
    // This is going to find the last row among these children that is already
    // showing content on the screen, as opposed to being in fallback state or
    // new. If a row has multiple Suspense boundaries, any of them being in the
    // fallback state, counts as the whole row being in a fallback state.
    // Note that the "rows" will be workInProgress, but any nested children
    // will still be current since we haven't rendered them yet. The mounted
    // order may not be the same as the new order. We use the new order.
    var row1;
    var lastContentRow;
    var currentRow; // New rows can't be content rows.
    var isArray2;
    var isIterable;
    var type12;
    var iteratorFn1;
    var childrenIterator;
    var step1;
    var _i;
    var renderState;
    var nextProps6;
    var revealOrder;
    var tailMode;
    var newChildren1;
    var suspenseContext1;
    var shouldForceFallback;
    var didSuspendBefore;
    switch(null){
        case 'forwards':
            var lastContentRow1;
            var tail;
        case 'backwards':
            // We're going to find the first row that has existing content.
            // At the same time we're going to reverse the list of everything
            // we pass in the meantime. That's going to be our tail in reverse
            // order.
            var _tail;
            var row2;
            var currentRow1; // New rows can't be content rows.
            var nextRow;
    }
    var nextChildren9;
    var hasWarnedAboutUsingNoValuePropOnContextProvider;
    var providerType;
    var context9;
    var newProps;
    var oldProps2;
    var newValue1;
    var providerPropTypes;
    var oldValue;
    var changedBits1;
    var newChildren2;
    var hasWarnedAboutUsingContextAsConsumer;
    var context10; // The logic below for Context differs depending on PROD or DEV mode. In
    var newProps1;
    var render1;
    var newValue2;
    var newChildren3;
    var returnFiber1;
    var prevSibling;
    // Since the old fiber is disconnected, we have to schedule it manually.
    var last1;
    var updateLanes;
    var oldProps3;
    var newProps2;
    // the begin phase. There's still some bookkeeping we that needs to be done
    // in this optimized path, mostly pushing stuff onto the stack.
    switch(null){
        case null:
            var Component2;
        case null:
            var newValue3;
        case null:
            // Profiler should only call onRender when one of its descendants actually rendered.
            var hasChildWork;
            // These are reset during render to allow the DevTools commit hook a chance to read them,
            var stateNode6;
        case null:
            var state4;
            // whether to retry the primary children, or to skip over it and
            // go straight to the fallback. Check the priority of the primary
            // child fragment.
            var primaryChildFragment5;
            var primaryChildLanes;
            // priority. Bailout.
            var child10;
        case null:
            var didSuspendBefore1;
            var _hasChildWork;
            // then the tail doesn't matter. Anything new that suspends will work
            // in the "together" mode, so we can continue from the state we had.
            var renderState1;
    }
    switch(null){
        case null:
            var elementType;
        case null:
            var _Component;
            var unresolvedProps;
            var resolvedProps1;
        case null:
            var _Component2;
            var _unresolvedProps;
            var _resolvedProps;
        case null:
            var type13;
            var _unresolvedProps2;
            var _resolvedProps2;
        case null:
            var _type21;
            var _unresolvedProps3; // Resolve outer props first, then resolve inner props.
            var _resolvedProps3;
            var outerPropTypes2;
        case null:
            var _Component3;
            var _unresolvedProps4;
            var _resolvedProps4;
    }
    var appendAllChildren;
    var updateHostContainer;
    var updateHostComponent$1;
    var updateHostText$1;
    (function() {
        // We only have the top Fiber that was created but we need recurse down its
        // children to find all the terminal nodes.
        var node;
    });
    (function() {
        // If we have an alternate, that means this is an update and we need to
        // schedule a side-effect to do the updates.
        var oldProps;
        // have newProps so we'll have to reuse them.
        // TODO: Split the update API as separate for the props vs. children.
        // Even better would be if children weren't special cased at all tho.
        var instance;
        var currentHostContext; // TODO: Experiencing an error where oldProps is null. Suggests a host
        // component is hitting the resume path. Figure out why. Possibly
        // related to `hidden`.
        var updatePayload; // TODO: Type this specific to this type of component.
    });
    switch(null){
        case 'hidden':
            // Any insertions at the end of the tail list after this point
            // should be invisible. If there are already mounted boundaries
            // anything before them are not considered for collapsing.
            // Therefore we need to go through the whole tail to find if
            // there are any.
            var tailNode;
            var lastTailNode;
        case 'collapsed':
            // Any insertions at the end of the tail list after this point
            // should be invisible. If there are already mounted boundaries
            // anything before them are not considered for collapsing.
            // Therefore we need to go through the whole tail to find if
            // there are any.
            var _tailNode;
            var _lastTailNode;
    }
    var newProps3;
    switch(null){
        case null:
            var Component3;
        case null:
            var fiberRoot;
            // If we hydrated, pop so that we can delete any remaining children
            // that weren't hydrated.
            var wasHydrated;
        case null:
            var rootContainerInstance;
            var type14;
            var currentHostContext; // TODO: Move createInstance to beginWork and keep it on a context
            // "stack" as the parent. Then append children as we go in beginWork
            // or completeWork depending on whether we want to add them top->down or
            // bottom->up. Top->down is faster in IE11.
            var _wasHydrated;
            var instance23;
        case null:
            var newText;
            var oldText; // If we have an alternate, that means this is an update and we need
            var _rootContainerInstance;
            var _currentHostContext;
            var _wasHydrated2;
        case null:
            var nextState4;
            var nextDidTimeout;
            var prevDidTimeout;
            var prevState6;
            // TODO: Move this back to throwException because this is too late
            // if this is a large tree which is common for initial loads. We
            // don't know if we should restart a render or not until we get
            // this marker, and this is too late.
            // If this render already had a ping or lower pri updates,
            // and this is the first time we know we're going to suspend we
            // should be able to immediately restart from within throwException.
            var hasInvisibleChildContext;
        case null:
            // Same as class component case. I put it down here so that the tags are
            // sequential to ensure this switch is compiled to a jump table.
            var _Component1;
        case null:
            var renderState2;
            var didSuspendAlready;
            var renderedTail;
            // This is the first pass. We need to figure out if anything is still
            // suspended in the rendered set.
            // If new content unsuspended, but there's still some content that
            // didn't. Then we need to do a second pass that forces everything
            // to keep showing their fallbacks.
            // We might be suspended if something in this render pass suspended, or
            // something in the previous committed pass suspended. Otherwise,
            // there's no chance so we can skip the expensive call to
            // findFirstSuspended.
            var cannotBeSuspended;
            var row3;
            var suspended;
            // part of the second pass. In that case nothing will subscribe to
            // its thennables. Instead, we'll transfer its thennables to the
            // SuspenseList so that it can retry if they resolve.
            // There might be multiple of these in the list but since we're
            // going to wait for all of them anyway, it doesn't really matter
            // which ones gets to ping. In theory we could get clever and keep
            // track of how many dependencies remain but it gets tricky because
            // in the meantime, we can add/remove/change items and dependencies.
            // We might bail out of the loop before finding any but that
            // doesn't matter since that means that the other boundaries that
            // we did find already has their listeners attached.
            var newThennables;
            var _suspended;
            // get lost if this row ends up dropped during a second pass.
            var _newThennables;
            // We need to delete the row we just rendered.
            // Reset the effect list to what it was before we rendered this
            // child. The nested children have already appended themselves.
            var lastEffect1; // Remove any effects that were appended after this point.
            var previousSibling;
            // We still have tail rows to render.
            // Pop a row.
            var next1;
            // TODO: We can probably just avoid popping it instead and only
            // setting it the first time we go from not suspended to suspended.
            var suspenseContext2;
        case null:
            var _nextState1;
            var _prevState;
            var prevIsHidden;
            var nextIsHidden;
    }
    switch(null){
        case null:
            var Component4;
            var flags;
        case null:
            var _flags;
        case null:
            var _flags2;
    }
    switch(null){
        case null:
            var childContextTypes2;
    }
    var logError; // Allow injected showErrorDialog() to prevent default console.error logging.
    var error3;
    var source1;
    var stack2;
    var componentStack; // Browsers support silencing uncaught errors by calling
    var componentName8;
    var componentNameMessage;
    var errorBoundaryMessage;
    var errorBoundaryName;
    var combinedMessage; // In development, we provide our own message with just the component stack.
    var PossiblyWeakMap$1;
    var update7; // Unmount the root by rendering null.
    var error4;
    var update8;
    var getDerivedStateFromError;
    var error$11;
    var inst4;
    (function callback() {
        var error$1;
        var stack;
    });
    // Attach a listener to the promise to "ping" the root and retry. But only if
    // one does not already exist for the lanes we're currently rendering (which
    // acts like a "thread ID" here).
    var pingCache;
    var threadIDs;
    var ping;
    // This is a wakeable.
    var wakeable;
    // Reset the memoizedState to what it was before we attempted
    // to render it.
    var currentSource;
    var hasInvisibleParentBoundary; // Schedule the nearest Suspense to re-render the timed out view.
    var _workInProgress;
    // Found the nearest boundary.
    // Stash the promise on the boundary fiber. If the boundary times out, we'll
    // attach another listener to flip the boundary back to its normal state.
    var wakeables;
    var updateQueue3;
    var currentSourceFiber;
    // When we try rendering again, we should not reuse the current fiber,
    // since it's known to be in an inconsistent state. Use a force update to
    // prevent a bail out.
    var update9;
    var workInProgress;
    switch(null){
        case null:
            var _errorInfo;
            var lane10;
            var _update;
        case null:
            // Capture and retry
            var errorInfo;
            var ctor;
            var instance24;
            var _lane1;
            var _update2;
    }
    var didWarnAboutUndefinedSnapshotBeforeUpdate;
    var PossiblyWeakSet;
    var callComponentWillUnmountWithTimer; // Capture errors so they don't interrupt unmounting.
    var unmountError;
    var ref4;
    var refError;
    var error5;
    switch(null){
        case null:
            var prevProps3;
            var prevState7;
            var instance25; // We could update instance props and state here,
            var snapshot2;
            var didWarnSet;
        case null:
            var root7;
    }
    var updateQueue4;
    var lastEffect2;
    var firstEffect1;
    var effect2;
    // Unmount
    var destroy1;
    var updateQueue5;
    var lastEffect3;
    var firstEffect2;
    var effect3;
    // Mount
    var create;
    var destroy2;
    var addendum1;
    var updateQueue6;
    var lastEffect4;
    var firstEffect3;
    var effect4;
    var _effect, next2, tag5;
    switch(null){
        case null:
            var instance26;
            var prevProps4;
            var prevState8; // We could update instance props and state here,
            // commit phase. Consider removing the type check.
            var updateQueue7;
        case null:
            // TODO: I think this is now always non-null by the time it reaches the
            // commit phase. Consider removing the type check.
            var _updateQueue;
            var _instance1;
        case null:
            var _instance21; // Renderers may schedule work to be done after host components are mounted
            var type15;
            var props10;
        case null:
            var _finishedWork$memoize2, onCommit, onRender;
            var effectDuration;
            var commitTime1;
    }
    // We only have the top Fiber that was inserted but we need to recurse down its
    // children to find all the terminal nodes.
    var node31;
    var instance27;
    var _instance31;
    var ref5;
    var instance28;
    var instanceToUse;
    var currentRef;
    switch(null){
        case null:
            var updateQueue8;
            var lastEffect5;
            var firstEffect4;
            var effect5;
            var _effect2, destroy3, tag6;
        case null:
            var instance29;
    }
    // While we're inside a removed host node we don't want to call
    // removeChild on the inner nodes because they're removed by the top
    // call anyway. We also want to call componentWillUnmount on all
    // composites before this host node is removed from the tree. Therefore
    // we do an inner loop while we're still inside the host node.
    var node32;
    var parent1;
    // We're going to search forward into the tree until we find a sibling host
    // node. Unfortunately, if multiple insertions are done in a row we have to
    // search past them. This leads to exponential search for the next sibling.
    // TODO: Find a more efficient way to do this.
    var node33;
    var parentFiber; // Note: these two variables *must* always be updated together.
    var parent2;
    var isContainer;
    var parentStateNode;
    var before; // We only have the top Fiber that was inserted but we need to recurse down its
    var tag7;
    var isHost;
    var stateNode7;
    var child11;
    var sibling1;
    var tag8;
    var isHost1;
    var stateNode8;
    var child12;
    var sibling2;
    // We only have the top Fiber that was deleted but we need to recurse down its
    // children to find all the terminal nodes.
    var node34; // Each iteration, currentParent is populated with node's host parent if not
    // currentParentIsValid.
    var currentParentIsValid; // Note: these two variables *must* always be updated together.
    var currentParent2;
    var currentParentIsContainer;
    var parent3;
    var parentStateNode1;
    var alternate7;
    switch(null){
        case null:
            var instance30;
            // Commit the work prepared earlier.
            var newProps4; // For hydration we reuse the update path but we treat the oldProps
            // as the newProps. The updatePayload will contain the real change in
            // this case.
            var oldProps4;
            var type16; // TODO: Type the updateQueue to be specific to host components.
            var updatePayload3;
        case null:
            var textInstance2;
            var newText1; // For hydration we reuse the update path but we treat the oldProps
            // as the newProps. The updatePayload will contain the real change in
            // this case.
            var oldText1;
        case null:
            var _root;
        case null:
            var newState5;
            var isHidden;
    }
    var newState6;
    // Hide the Offscreen component that contains the primary children. TODO:
    // Ideally, this effect would have been scheduled on the Offscreen fiber
    // itself. That's how unhiding works: the Offscreen component schedules an
    // effect on itself. However, in this case, the component didn't complete,
    // so the fiber was never added to the effect list in the normal path. We
    // could have appended it to the effect list in the Suspense component's
    // second pass, but doing it this way is less complicated. This would be
    // simpler if we got rid of the effect list and traversed the tree, like
    // we're planning to do.
    var primaryChildParent;
    var newState7;
    var current7;
    var prevState9;
    var suspenseInstance2;
    // If this boundary just timed out, then it will have a set of wakeables.
    // For each wakeable, attach a listener so that when it resolves, React
    // attempts to re-render the boundary in the primary (pre-timeout) state.
    var wakeables1;
    var retryCache;
    (function() {
        // Memoize using the boundary fiber to prevent redundant listeners.
        var retry;
    });
    var oldState4;
    var newState8;
    var COMPONENT_TYPE;
    var HAS_PSEUDO_CLASS_TYPE;
    var ROLE_TYPE;
    var TEST_NAME_TYPE;
    var TEXT_TYPE;
    var symbolFor$1;
    var commitHooks;
    var ceil;
    var ReactCurrentDispatcher$2, ReactCurrentOwner$2, IsSomeRendererActing;
    var NoContext;
    var BatchedContext;
    var EventContext;
    var DiscreteEventContext;
    var LegacyUnbatchedContext;
    var RenderContext;
    var CommitContext;
    var RetryAfterError;
    var RootIncomplete;
    var RootFatalErrored;
    var RootErrored;
    var RootSuspended;
    var RootSuspendedWithDelay;
    var RootCompleted; // Describes where we are in the React execution stack
    var executionContext; // The root we're working on
    var workInProgressRoot; // The fiber we're working on
    var workInProgress1; // The lanes we're rendering
    var workInProgressRootRenderLanes; // Stack that allows components to change the render lanes for its subtree
    // This is a superset of the lanes we started working on at the root. The only
    // case where it's different from `workInProgressRootRenderLanes` is when we
    // enter a subtree that is hidden and needs to be unhidden: Suspense and
    // Offscreen component.
    //
    // Most things in the work loop should deal with workInProgressRootRenderLanes.
    // Most things in begin/complete phases should deal with subtreeRenderLanes.
    var subtreeRenderLanes1;
    var subtreeRenderLanesCursor; // Whether to root completed, errored, suspended, etc.
    var workInProgressRootExitStatus; // A fatal error, if one is thrown
    var workInProgressRootFatalError; // "Included" lanes refer to lanes that were worked on during this render. It's
    // slightly different than `renderLanes` because `renderLanes` can change as you
    // enter and exit an Offscreen tree. This value is the combination of all render
    // lanes for the entire render phase.
    var workInProgressRootIncludedLanes; // The work left over by components that were visited during this render. Only
    // includes unprocessed updates, not work in bailed out children.
    var workInProgressRootSkippedLanes; // Lanes that were updated (in an interleaved event) during this render.
    var workInProgressRootUpdatedLanes; // Lanes that were pinged (in an interleaved event) during this render.
    var workInProgressRootPingedLanes;
    var mostRecentlyUpdatedRoot; // The most recent time we committed a fallback. This lets us ensure a train
    // model where we don't commit new loading states in too quick succession.
    var globalMostRecentFallbackTime;
    var FALLBACK_THROTTLE_MS; // The absolute time for when we should start giving up on rendering
    // more and prefer CPU suspense heuristics instead.
    var workInProgressRootRenderTargetTime; // How long a render is supposed to take before we start following CPU
    // suspense heuristics and opt out of rendering more content.
    var RENDER_TIMEOUT_MS;
    var nextEffect;
    var hasUncaughtError;
    var firstUncaughtError;
    var legacyErrorBoundariesThatAlreadyFailed;
    var rootDoesHavePassiveEffects;
    var rootWithPendingPassiveEffects;
    var pendingPassiveEffectsRenderPriority;
    var pendingPassiveEffectsLanes;
    var pendingPassiveHookEffectsMount;
    var pendingPassiveHookEffectsUnmount;
    var rootsWithPendingDiscreteUpdates; // Use these to prevent an infinite loop of nested updates
    var NESTED_UPDATE_LIMIT;
    var nestedUpdateCount;
    var rootWithNestedUpdates;
    var NESTED_PASSIVE_UPDATE_LIMIT;
    var nestedPassiveUpdateCount; // Marks the need to reschedule pending interactions at these lanes
    // during the commit phase. This enables them to be traced across components
    // that spawn new work during render. E.g. hidden boundaries, suspended SSR
    // hydration or SuspenseList.
    // TODO: Can use a bitmask instead of an array
    var spawnedWorkDuringRender; // If two updates are scheduled within the same event, we should treat their
    // event times as simultaneous, even if the actual clock time has advanced
    // between the first and second call.
    var currentEventTime;
    var currentEventWipLanes;
    var currentEventPendingLanes; // Dev only flag that tracks if passive effects are currently being flushed.
    // We warn about state updates for unmounted components differently in this case.
    var isFlushingPassiveEffects;
    var focusedInstanceHandle;
    var shouldFireAfterActiveInstanceBlur;
    // Special cases
    var mode3;
    var isTransition;
    // To do that, we're replacing it with an update lane priority.
    var schedulerPriority; // The old behavior was using the priority level of the Scheduler.
    // This couples React to the Scheduler internals, so we're replacing it
    // with the currentUpdateLanePriority above. As an example of how this
    // could be problematic, if we're not inside `Scheduler.runWithPriority`,
    // then we'll get the priority of the current running Scheduler task,
    // which is probably not what we want.
    var lane11;
    var schedulerLanePriority;
    // This is a fork of `requestUpdateLane` designed specifically for Suspense
    // "retries" — a special update that attempts to flip a Suspense boundary
    // from its placeholder state to its primary/resolved state.
    // Special cases
    var mode4;
    var root8;
    // priority as an argument to that function and this one.
    var priorityLevel3;
    var alternate8;
    var node35;
    var parent4;
    var root9;
    var existingCallbackNode; // Check if any lanes are being starved by other work. If so, mark them as
    var nextLanes1; // This returns the priority level computed during the `getNextLanes` call.
    var newCallbackPriority;
    var existingCallbackPriority;
    var newCallbackNode;
    var schedulerPriorityLevel;
    // in case they schedule additional work.
    var originalCallbackNode;
    var didFlushPassiveEffects;
    // on the root.
    var lanes5;
    var exitStatus;
    var fatalError;
    // or, if something suspended, wait to commit it after a timeout.
    var finishedWork;
    switch(null){
        case null:
            // This render only included retries, no updates. Throttle committing
            // retries so that we don't show too many loading states too quickly.
            var msUntilTimeout; // Don't bother with a very short suspense time.
            var nextLanes2;
            var suspendedLanes2;
            // We should prefer to render the fallback of at the last
            // suspended level. Ping the last suspended level to try
            // rendering it again.
            // FIXME: What if the suspended lanes are Idle? Should not restart.
            var eventTime2;
        case null:
            // This is not a transition, but we did trigger an avoided state.
            // Schedule a placeholder to display after a short delay, using the Just
            // Noticeable Difference.
            // TODO: Is the JND optimization worth the added complexity? If this is
            // the only reason we track the event time, then probably not.
            // Consider removing.
            var mostRecentEventTime1;
            var eventTimeMs;
            var timeElapsedMs;
            var _msUntilTimeout; // Don't bother with a very short suspense time.
    }
    var lanes6;
    var exitStatus1;
    var fatalError1;
    // will commit it even if something suspended.
    var finishedWork1;
    // For each root with pending discrete updates, schedule a callback to
    // immediately flush them.
    var roots;
    var prevExecutionContext;
    var prevExecutionContext1;
    var prevExecutionContext2;
    var prevExecutionContext3;
    var prevExecutionContext4;
    var timeoutHandle;
    var interruptedWork;
    var erroredWork;
    var prevDispatcher1;
    var prevInteractions;
    var prevExecutionContext5;
    var prevDispatcher2; // If the root or lanes have changed, throw out the existing stack
    var prevInteractions1;
    var prevExecutionContext6;
    var prevDispatcher3; // If the root or lanes have changed, throw out the existing stack
    var prevInteractions2;
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    var current8;
    var next3;
    // Attempt to complete the current unit of work, then move to the next
    // sibling. If there are no more siblings, return to the parent fiber.
    var completedWork;
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    var current9;
    var returnFiber2; // Check if the work completed or if something threw.
    var next4;
    // side-effects. We can perform certain side-effects earlier if needed,
    // by doing multiple passes over the effect list. We don't want to
    // schedule our own side-effect on our own list because if end up
    // reusing children we'll schedule this effect onto itself since we're
    // at the end.
    var flags1; // Skip both NoWork and PerformedWork tags when creating the effect
    // This fiber did not complete because something threw. Pop values off
    // the stack without entering the complete phase. If this is a boundary,
    // capture values if possible.
    var _next; // Because this fiber did not complete, don't reset its expiration time.
    var actualDuration;
    var child13;
    var siblingFiber;
    var newChildLanes; // Bubble up the earliest expiration time.
    // In profiling mode, resetChildExpirationTime is also used to reset
    // profiler durations.
    var actualDuration1;
    var treeBaseDuration; // When a fiber is cloned, its actualDuration is reset to 0. This value will
    // only be updated if work is done on the fiber (i.e. it doesn't bailout).
    // When work is done, it should bubble to the parent's actualDuration. If
    // the fiber has not been cloned though, (meaning no work was done), then
    // this value will reflect the amount of time spent working on a previous
    // render. In that case it should not bubble. We determine whether it was
    // cloned by comparing the child pointer.
    var shouldBubbleActualDurations;
    var child14;
    var isTimedOutSuspense;
    // Don't count time spent in a timed out Suspense subtree as part of the base duration.
    var primaryChildFragment6;
    var _child1;
    var renderPriorityLevel;
    var finishedWork2;
    var lanes7;
    // pending time is whatever is left on the root fiber.
    var remainingLanes;
    var firstEffect5;
    var prevExecutionContext7;
    var prevInteractions3; // Reset this to null before calling lifecycles
    var error6;
    var _error;
    var _error2;
    var rootDidHavePassiveEffects;
    var nextNextEffect;
    var expirationTimes3;
    var _error3;
    var current10;
    var flags2;
    var flags3;
    var current11;
    // updates, and deletions. To avoid needing to add a case for every possible
    // bitmap value, we remove the secondary effects from the effect tag and
    // switch on that value.
    var primaryFlags;
    switch(null){
        case null:
            var _current;
        case null:
            var _current2;
        case null:
            var _current3;
    }
    var flags4;
    var current12;
    var priorityLevel4;
    var alternate9;
    var create1;
    var root10;
    var lanes8;
    var prevExecutionContext8;
    var prevInteractions4; // It's important that ALL pending passive effect destroy functions are called
    // before ANY passive effect create functions are called.
    // Otherwise effects in sibling components might interfere with each other.
    // e.g. a destroy function in one component may unintentionally override a ref
    // value set by a create function in another component.
    // Layout effects have the same constraint.
    // First pass: Destroy stale passive effects.
    var unmountEffects;
    var _effect1;
    var fiber4;
    var destroy4;
    var alternate10;
    var error7;
    var mountEffects;
    var _effect21;
    var _fiber;
    var _error4;
    // because the root is not part of its own effect list.
    // This could change in the future.
    var effect6;
    var nextNextEffect1; // Remove nextEffect pointer to assist GC
    var onUncaughtError;
    var errorInfo1;
    var update10;
    var eventTime3;
    var root11;
    var fiber5;
    var ctor1;
    var instance31;
    var errorInfo2;
    var update11;
    var eventTime4;
    var root12;
    var pingCache1;
    var eventTime5;
    var eventTime6;
    var root13;
    var retryLane; // Default
    var retryCache1;
    var didWarnStateUpdateForNotYetMountedComponent;
    var tag9;
    // the problematic code almost always lies inside that component.
    var componentName9;
    var previousFiber;
    var didWarnStateUpdateForUnmountedComponent;
    var tag10;
    // the problematic code almost always lies inside that component.
    var componentName10;
    var previousFiber1;
    var beginWork$1;
    var dummyFiber;
    (function() {
        // If a component throws an error, we replay it again in a synchronously
        // dispatched event, so that the debugger will treat it as an uncaught
        // error See ReactErrorUtils for more information.
        // Before entering the begin phase, copy the work-in-progress onto a dummy
        // fiber. If beginWork throws, we'll use this to reset the state.
        var originalWorkInProgressCopy;
        var replayError; // `invokeGuardedCallback` sometimes sets an expando `_suppressLogging`.
    });
    var didWarnAboutUpdateInRender;
    var didWarnAboutUpdateInRenderForAnotherComponent;
    switch(null){
        case null:
            var renderingComponentName; // Dedupe by the rendering component because it's the one that needs to be fixed.
            var dedupeKey;
            var setStateComponentName;
    }
    var IsThisRendererActing;
    var previousFiber2;
    var previousFiber3;
    var warnIfNotCurrentlyActingUpdatesInDev; // In tests, we want to enforce a mocked scheduler.
    var didWarnAboutUnmockedScheduler; // TODO Before we release concurrent mode, revisit this and decide whether a mocked
    var pendingInteractionMap;
    var pendingInteractions;
    var subscriber;
    var threadID;
    // we can accurately attribute time spent working on it, And so that cascading
    // work triggered during the render phase will be associated with it.
    var interactions;
    var subscriber1;
    var threadID1;
    var remainingLanesAfterCommit;
    var subscriber2;
    // FIXME: More than one lane can finish in a single commit.
    var threadID2;
    // Clear completed interactions from the pending Map.
    // Unless the render was suspended or cascading work was scheduled,
    // In which case– leave pending interactions until the subsequent render.
    var pendingInteractionMap1;
    // so we can tell if any async act() calls try to run in parallel.
    var actingUpdatesScopeDepth;
    var resolveFamily; // $FlowFixMe Flow gets confused by a WeakSet feature check below.
    var failedBoundaries;
    var setRefreshHandler;
    var family;
    var family1;
    // ForwardRef is special because its resolved .type is an object,
    // but it's possible that we only have its inner render function in the map.
    // If that inner render function is different, we'll build a new forwardRef type.
    var currentRender;
    var syntheticType;
    var prevType;
    var nextType; // If we got here, we know types aren't === equal.
    var needsCompareFamilies;
    var $$typeofNextType;
    // Note: memo() and forwardRef() we'll compare outer rather than inner type.
    // This means both of them need to be registered to preserve state.
    // If we unwrapped and compared the inner types for wrappers instead,
    // then we would risk falsely saying two separate memo(Foo)
    // calls are equivalent because they wrap the same Foo function.
    var prevFamily;
    var scheduleRefresh = function() {
        var staleFamilies, updatedFamilies;
    };
    var scheduleRoot;
    var alternate11, child15, sibling3, tag11, type17;
    var candidateType;
    var needsRender;
    var needsRemount;
    var family2;
    var findHostInstancesForRefresh = function() {
        var hostInstances;
        var types;
    };
    var child16, sibling4, tag12, type18;
    var candidateType1;
    var didMatch;
    var foundHostInstances;
    var node36;
    var node37;
    var foundHostInstances1;
    var hasBadMapPolyfill;
    var nonExtensibleObject;
    var debugCounter;
    // please ensure we do the following:
    // 1) Nobody should add any instance methods on this. Instance methods can be
    //    more difficult to predict when they get optimized and they are almost
    //    never inlined properly in static compilers.
    // 2) Nobody should rely on `instanceof Fiber` for type testing. We should
    //    always know when it is a fiber.
    // 3) We might want to experiment with using numeric keys since they are easier
    //    to optimize in a non-JIT environment.
    // 4) We can easily go from a constructor to a createFiber object literal if that
    //    is faster.
    // 5) It should be easy to port this to a C struct and keep a C implementation
    //    compatible.
    var createFiber;
    var prototype1;
    var $$typeof;
    var workInProgress2;
    // it cannot be shared with the current fiber.
    var currentDependencies;
    var current13;
    // it cannot be shared with the current fiber.
    var currentDependencies1;
    var mode5;
    var fiberTag; // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
    var resolvedType1;
    switch(null){
        // eslint-disable-next-line no-fallthrough
        default:
            var info3;
            var ownerName2;
    }
    var fiber6;
    var owner5;
    var type19;
    var key9;
    var pendingProps;
    var fiber7;
    var fiber8;
    var fiber9; // TODO: The Profiler fiber shouldn't have a type. It has a tag.
    var fiber10; // TODO: The SuspenseComponent fiber shouldn't have a type. It has a tag.
    var fiber11;
    var fiber12; // TODO: The OffscreenComponent fiber shouldn't have a type. It has a tag.
    var fiber13; // TODO: The LegacyHidden fiber shouldn't have a type. It has a tag.
    var fiber14;
    var fiber15; // TODO: These should not need a type.
    var pendingProps1;
    var fiber16;
    var root14;
    // stateNode is any.
    var uninitializedFiber;
    var getVersion2;
    var version3; // TODO Clear this data once all pending hydration work is finished.
    var key10;
    var didWarnAboutNestedUpdates;
    var didWarnAboutFindNodeInStrictMode;
    var fiber17;
    var parentContext;
    var Component5;
    var fiber18;
    var hostFiber;
    var componentName11;
    var previousFiber4;
    var current$1;
    var eventTime7;
    var lane12;
    var context11;
    var update12; // Caution: React DevTools currently depends on this property
    var containerFiber;
    var suspenseState3;
    var alternate12;
    var eventTime8;
    var lane13;
    var eventTime9;
    var lane14;
    var eventTime10;
    var lane15;
    var hostFiber1;
    var shouldSuspendImpl;
    var overrideHookState;
    var overrideHookStateDeletePath;
    var overrideHookStateRenamePath;
    var overrideProps;
    var overridePropsDeletePath;
    var overridePropsRenamePath;
    var scheduleUpdate;
    var setSuspenseHandler;
    var copyWithDeleteImpl = function() {
        var key;
        var updated;
    };
    var copyWithDelete;
    var copyWithRenameImpl = function() {
        var oldKey;
        var updated;
        var newKey; // $FlowFixMe number or string is fine here
    };
    var copyWithRename;
    var copyWithSetImpl = function() {
        var key;
        var updated; // $FlowFixMe number or string is fine here
    };
    var copyWithSet;
    var findHook = function() {
        // For now, the "id" of stateful hooks is just the stateful hook index.
        // This may change in the future with e.g. nested hooks.
        var currentHook;
    }; // Support DevTools editable values for useState and useReducer.
    (function() {
        var hook;
        var newState;
    });
    (function() {
        var hook;
        var newState;
    });
    (function() {
        var hook;
        var newState;
    }); // Support DevTools props for function components, forwardRef, memo, host components, etc.
    var hostFiber2;
    var findFiberByHostInstance;
    var ReactCurrentDispatcher1;
    (function() {
        var root;
        var container1;
        var hostInstance;
    });
    (function() {
        var root;
        var container1;
    });
    // Tag is either LegacyRoot or Concurrent Root
    var hydrate;
    var hydrationCallbacks;
    var mutableSources;
    var root15;
    var containerNodeType;
    var rootContainerElement;
    var mutableSource2;
    var ReactCurrentOwner$3;
    var topLevelUpdateWarnings;
    var warnedAboutHydrateAPI;
    (function() {
        var hostInstance;
        var isRootRenderedBySomeReact = !!container._reactRootContainer;
        var rootEl;
        var hasNonRootReactChild = !!(rootEl && getInstanceFromNode(rootEl));
    });
    var rootElement;
    var shouldHydrate; // First clear any existing content.
    var warned;
    var rootSibling;
    // member of intersection type." Whyyyyyy.
    var root16;
    var fiberRoot1;
    var originalCallback;
    (function() {
        var instance;
    });
    var _originalCallback;
    (function() {
        var instance;
    });
    var owner6;
    var warnedAboutRefsInRender;
    var isModernRoot;
    var isModernRoot1;
    var isModernRoot2;
    var rootEl;
    var renderedByDifferentReact;
    var _rootEl;
    var hasNonRootReactChild = !!(_rootEl && getInstanceFromNode(_rootEl)); // Check if the container itself is a React root node.
    var isContainerReactRoot = !container.parentNode._reactRootContainer;
    var didWarnAboutUnstableCreatePortal;
    var key11;
    var key12;
    var Internals;
    var foundDevTools;
    var protocol; // Don't warn in exotic cases like chrome-extension://.
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = null;
    exports.createPortal = null;
    exports.findDOMNode = null;
    exports.flushSync = null;
    exports.hydrate = null;
    exports.render = null;
    exports.unmountComponentAtNode = null;
    exports.unstable_batchedUpdates = null;
    exports.unstable_createPortal = null;
    exports.unstable_renderSubtreeIntoContainer = null;
    exports.version = null;
}
