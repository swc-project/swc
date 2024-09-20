!/** @license React v17.0.2
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? factory(exports, require("react")) : "function" == typeof define && define.amd ? define([
        "exports",
        "react"
    ], factory) : factory((global = global || self).ReactDOM = {}, global.React);
}(this, function(exports1, React) {
    "use strict";
    var func, _discreteUpdatesImpl, _flushDiscreteUpdatesImpl, _batchedEventUpdatesImpl, devToolsConfig, findFiberByHostInstance, ReactCurrentDispatcher, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd, prefix, componentFrameCache, didWarnValueDefaultValue$1, reusableSVGContainer, attemptUserBlockingHydration, attemptContinuousHydration, attemptHydrationAtCurrentPriority, attemptHydrationAtPriority, lastMovementX, lastMovementY, lastMouseEvent, warnedUnknownTags, suppressHydrationWarning, validatePropertiesInDevelopment, warnForTextDifference, warnForPropDifference, warnForExtraAttributes, warnForInvalidEventListener, canDiffStyleForHydrationWarning, normalizeMarkupForTextOrAttribute, normalizeHTML, SUPPRESS_HYDRATION_WARNING$1, fiberStack, warnedAboutMissingGetChildContext, rendererSigil, didWarnUpdateInsideUpdate, currentlyProcessingQueue, didWarnAboutStateAssignmentForComponent, didWarnAboutUninitializedState, didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate, didWarnAboutLegacyLifecyclesAndDerivedState, didWarnAboutUndefinedDerivedState, warnOnUndefinedDerivedState, warnOnInvalidCallback, didWarnAboutDirectlyAssigningPropsToState, didWarnAboutContextTypeAndContextTypes, didWarnAboutInvalidateContextType, didWarnAboutMaps, didWarnAboutGenerators, didWarnAboutStringRefs, ownerHasKeyUseWarning, ownerHasFunctionTypeWarning, rendererSigil$1, didWarnAboutMismatchedHooksForComponent, didWarnAboutUseOpaqueIdentifier, didWarnAboutBadClass, didWarnAboutModulePatternComponent, didWarnAboutContextTypeOnFunctionComponent, didWarnAboutGetDerivedStateOnFunctionComponent, didWarnAboutFunctionRefs, didWarnAboutReassigningProps, didWarnAboutRevealOrder, didWarnAboutTailOptions, appendAllChildren, updateHostContainer, updateHostComponent$1, updateHostText$1, beginWork$1, didWarnAboutUpdateInRenderForAnotherComponent, hasBadMapPolyfill, didWarnAboutNestedUpdates, didWarnAboutFindNodeInStrictMode, topLevelUpdateWarnings, ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
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
    if (!React) throw Error("ReactDOM was loaded before React. Make sure you load the React package before loading ReactDOM.");
    var allNativeEvents = new Set(), registrationNameDependencies = {}, possibleRegistrationNames = {};
    function registerTwoPhaseEvent(registrationName, dependencies) {
        registerDirectEvent(registrationName, dependencies), registerDirectEvent(registrationName + "Capture", dependencies);
    }
    function registerDirectEvent(registrationName, dependencies) {
        registrationNameDependencies[registrationName] && error("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", registrationName), registrationNameDependencies[registrationName] = dependencies, possibleRegistrationNames[registrationName.toLowerCase()] = registrationName, "onDoubleClick" === registrationName && (possibleRegistrationNames.ondblclick = registrationName);
        for(var i = 0; i < dependencies.length; i++)allNativeEvents.add(dependencies[i]);
    }
    var canUseDOM = !!("undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement), ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", ROOT_ATTRIBUTE_NAME = "data-reactroot", VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$"), hasOwnProperty = Object.prototype.hasOwnProperty, illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
        return !!hasOwnProperty.call(validatedAttributeNameCache, attributeName) || !hasOwnProperty.call(illegalAttributeNameCache, attributeName) && (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName) ? (validatedAttributeNameCache[attributeName] = !0, !0) : (illegalAttributeNameCache[attributeName] = !0, error("Invalid attribute name: `%s`", attributeName), !1));
    }
    function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
        return null !== propertyInfo ? 0 === propertyInfo.type : !isCustomComponentTag && !!(name.length > 2) && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]);
    }
    function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
        if (null !== propertyInfo && 0 === propertyInfo.type) return !1;
        switch(typeof value){
            case "function":
            case "symbol":
                // eslint-disable-line
                return !0;
            case "boolean":
                if (isCustomComponentTag) return !1;
                if (null !== propertyInfo) return !propertyInfo.acceptsBooleans;
                var prefix = name.toLowerCase().slice(0, 5);
                return "data-" !== prefix && "aria-" !== prefix;
            default:
                return !1;
        }
    }
    function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
        if (null == value || shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag)) return !0;
        if (isCustomComponentTag) return !1;
        if (null !== propertyInfo) switch(propertyInfo.type){
            case 3:
                return !value;
            case 4:
                return !1 === value;
            case 5:
                return isNaN(value);
            case 6:
                return isNaN(value) || value < 1;
        }
        return !1;
    }
    function getPropertyInfo(name) {
        return properties.hasOwnProperty(name) ? properties[name] : null;
    }
    function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL, removeEmptyString) {
        this.acceptsBooleans = 2 === type || 3 === type || 4 === type, this.attributeName = attributeName, this.attributeNamespace = attributeNamespace, this.mustUseProperty = mustUseProperty, this.propertyName = name, this.type = type, this.sanitizeURL = sanitizeURL, this.removeEmptyString = removeEmptyString;
    } // When adding attributes to this list, be sure to also add them to
    // the `possibleStandardNames` module to ensure casing and incorrect
    // name warnings.
    var properties = {}; // These props are reserved by React. They shouldn't be written to the DOM.
    [
        "children",
        "dangerouslySetInnerHTML",
        // elements (not just inputs). Now that ReactDOMInput assigns to the
        // defaultValue property -- do we need this?
        "defaultValue",
        "defaultChecked",
        "innerHTML",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
        "style"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 0, !1, name, null, !1, !1);
    }), // This is a mapping from React prop names to the attribute names.
    [
        [
            "acceptCharset",
            "accept-charset"
        ],
        [
            "className",
            "class"
        ],
        [
            "htmlFor",
            "for"
        ],
        [
            "httpEquiv",
            "http-equiv"
        ]
    ].forEach(function(_ref) {
        var name = _ref[0], attributeName = _ref[1];
        properties[name] = new PropertyInfoRecord(name, 1, !1, attributeName, null, !1, !1);
    }), // In React, we let users pass `true` and `false` even though technically
    // these aren't boolean attributes (they are coerced to strings).
    [
        "contentEditable",
        "draggable",
        "spellCheck",
        "value"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 2, !1, name.toLowerCase(), null, !1, !1);
    }), // In React, we let users pass `true` and `false` even though technically
    // these aren't boolean attributes (they are coerced to strings).
    // Since these are SVG attributes, their attribute names are case-sensitive.
    [
        "autoReverse",
        "externalResourcesRequired",
        "focusable",
        "preserveAlpha"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 2, !1, name, null, !1, !1);
    }), [
        "allowFullScreen",
        "async",
        // on the client side because the browsers are inconsistent. Instead we call focus().
        "autoFocus",
        "autoPlay",
        "controls",
        "default",
        "defer",
        "disabled",
        "disablePictureInPicture",
        "disableRemotePlayback",
        "formNoValidate",
        "hidden",
        "loop",
        "noModule",
        "noValidate",
        "open",
        "playsInline",
        "readOnly",
        "required",
        "reversed",
        "scoped",
        "seamless",
        "itemScope"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 3, !1, name.toLowerCase(), null, !1, !1);
    }), // rather than attributes. These are all booleans.
    [
        "checked",
        // disabled with `removeAttribute`. We have special logic for handling this.
        "multiple",
        "muted",
        "selected"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 3, !0, name, null, !1, !1);
    }), // booleans, but can also accept a string value.
    [
        "capture",
        "download"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 4, !1, name, null, !1, !1);
    }), [
        "cols",
        "rows",
        "size",
        "span"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 6, !1, name, null, !1, !1);
    }), [
        "rowSpan",
        "start"
    ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(name, 5, !1, name.toLowerCase(), null, !1, !1);
    });
    var CAMELIZE = /[\-\:]([a-z])/g, capitalize = function(token) {
        return token[1].toUpperCase();
    };
    // or boolean value assignment. Regular attributes that just accept strings
    // and have the same names are omitted, just like in the HTML attribute filter.
    // Some of these attributes can be hard to find. This list was created by
    // scraping the MDN documentation.
    [
        "accent-height",
        "alignment-baseline",
        "arabic-form",
        "baseline-shift",
        "cap-height",
        "clip-path",
        "clip-rule",
        "color-interpolation",
        "color-interpolation-filters",
        "color-profile",
        "color-rendering",
        "dominant-baseline",
        "enable-background",
        "fill-opacity",
        "fill-rule",
        "flood-color",
        "flood-opacity",
        "font-family",
        "font-size",
        "font-size-adjust",
        "font-stretch",
        "font-style",
        "font-variant",
        "font-weight",
        "glyph-name",
        "glyph-orientation-horizontal",
        "glyph-orientation-vertical",
        "horiz-adv-x",
        "horiz-origin-x",
        "image-rendering",
        "letter-spacing",
        "lighting-color",
        "marker-end",
        "marker-mid",
        "marker-start",
        "overline-position",
        "overline-thickness",
        "paint-order",
        "panose-1",
        "pointer-events",
        "rendering-intent",
        "shape-rendering",
        "stop-color",
        "stop-opacity",
        "strikethrough-position",
        "strikethrough-thickness",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "text-anchor",
        "text-decoration",
        "text-rendering",
        "underline-position",
        "underline-thickness",
        "unicode-bidi",
        "unicode-range",
        "units-per-em",
        "v-alphabetic",
        "v-hanging",
        "v-ideographic",
        "v-mathematical",
        "vector-effect",
        "vert-adv-y",
        "vert-origin-x",
        "vert-origin-y",
        "word-spacing",
        "writing-mode",
        "xmlns:xlink",
        "x-height"
    ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(name, 1, !1, attributeName, null, !1, !1);
    }), [
        "xlink:actuate",
        "xlink:arcrole",
        "xlink:role",
        "xlink:show",
        "xlink:title",
        "xlink:type"
    ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(name, 1, !1, attributeName, "http://www.w3.org/1999/xlink", !1, !1);
    }), [
        "xml:base",
        "xml:lang",
        "xml:space"
    ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(name, 1, !1, attributeName, "http://www.w3.org/XML/1998/namespace", !1, !1);
    }), // The attribute name is case-sensitive in SVG so we can't just use
    // the React name like we do for attributes that exist only in HTML.
    [
        "tabIndex",
        "crossOrigin"
    ].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(attributeName, 1, !1, attributeName.toLowerCase(), null, !1, !1);
    }), properties.xlinkHref = new PropertyInfoRecord("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), [
        "src",
        "href",
        "action",
        "formAction"
    ].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(attributeName, 1, !1, attributeName.toLowerCase(), null, !0, !0);
    });
    // and any newline or tab are filtered out as if they're not part of the URL.
    // https://url.spec.whatwg.org/#url-parsing
    // Tab or newline are defined as \r\n\t:
    // https://infra.spec.whatwg.org/#ascii-tab-or-newline
    // A C0 control is a code point in the range \u0000 NULL to \u001F
    // INFORMATION SEPARATOR ONE, inclusive:
    // https://infra.spec.whatwg.org/#c0-control-or-space
    /* eslint-disable max-len */ var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, didWarn = !1;
    function sanitizeURL(url) {
        !didWarn && isJavaScriptProtocol.test(url) && (didWarn = !0, error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url)));
    }
    /**
   * Get the value for a attribute on a node. Only used in DEV for SSR validation.
   * The third argument is used as a hint of what the expected value is. Some
   * attributes have multiple equivalent values.
   */ function getValueForAttribute(node, name, expected) {
        if (isAttributeNameSafe(name)) {
            // the next prop is different than the server value, so just return
            // expected
            if (null !== (value = expected) && "object" == typeof value && value.$$typeof === REACT_OPAQUE_ID_TYPE) return expected;
            if (!node.hasAttribute(name)) return void 0 === expected ? void 0 : null;
            var value, value1 = node.getAttribute(name);
            return value1 === "" + expected ? expected : value1;
        } // If the object is an opaque reference ID, it's expected that
    }
    /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */ function setValueForProperty(node, name, value, isCustomComponentTag) {
        var propertyInfo = getPropertyInfo(name);
        if (!shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag)) {
            if (shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) && (value = null), isCustomComponentTag || null === propertyInfo) {
                isAttributeNameSafe(name) && (null === value ? node.removeAttribute(name) : node.setAttribute(name, "" + value));
                return;
            }
            if (propertyInfo.mustUseProperty) {
                var propertyName = propertyInfo.propertyName;
                if (null === value) {
                    var type = propertyInfo.type;
                    node[propertyName] = 3 !== type && "";
                } else // Contrary to `setAttribute`, object properties are properly
                // `toString`ed by IE8/9.
                node[propertyName] = value;
                return;
            } // The rest are treated as attributes with special cases.
            var attributeName = propertyInfo.attributeName, attributeNamespace = propertyInfo.attributeNamespace;
            if (null === value) node.removeAttribute(attributeName);
            else {
                var attributeValue, _type = propertyInfo.type;
                3 === _type || 4 === _type && !0 === value ? // If attribute type is boolean, we know for sure it won't be an execution sink
                // and we won't require Trusted Type here.
                attributeValue = "" : (attributeValue = "" + value, propertyInfo.sanitizeURL && sanitizeURL(attributeValue.toString())), attributeNamespace ? node.setAttributeNS(attributeNamespace, attributeName, attributeValue) : node.setAttribute(attributeName, attributeValue);
            }
        }
    }
    var _assign = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.assign, REACT_ELEMENT_TYPE = 0xeac7, REACT_PORTAL_TYPE = 0xeaca, REACT_FRAGMENT_TYPE = 0xeacb, REACT_STRICT_MODE_TYPE = 0xeacc, REACT_PROFILER_TYPE = 0xead2, REACT_PROVIDER_TYPE = 0xeacd, REACT_CONTEXT_TYPE = 0xeace, REACT_FORWARD_REF_TYPE = 0xead0, REACT_SUSPENSE_TYPE = 0xead1, REACT_SUSPENSE_LIST_TYPE = 0xead8, REACT_MEMO_TYPE = 0xead3, REACT_LAZY_TYPE = 0xead4, REACT_BLOCK_TYPE = 0xead9, REACT_SCOPE_TYPE = 0xead7, REACT_OPAQUE_ID_TYPE = 0xeae0, REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1, REACT_OFFSCREEN_TYPE = 0xeae2, REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
    if ("function" == typeof Symbol && Symbol.for) {
        var symbolFor = Symbol.for;
        REACT_ELEMENT_TYPE = symbolFor("react.element"), REACT_PORTAL_TYPE = symbolFor("react.portal"), REACT_FRAGMENT_TYPE = symbolFor("react.fragment"), REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode"), REACT_PROFILER_TYPE = symbolFor("react.profiler"), REACT_PROVIDER_TYPE = symbolFor("react.provider"), REACT_CONTEXT_TYPE = symbolFor("react.context"), REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref"), REACT_SUSPENSE_TYPE = symbolFor("react.suspense"), REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list"), REACT_MEMO_TYPE = symbolFor("react.memo"), REACT_LAZY_TYPE = symbolFor("react.lazy"), REACT_BLOCK_TYPE = symbolFor("react.block"), symbolFor("react.server.block"), symbolFor("react.fundamental"), symbolFor("react.scope"), REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id"), REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode"), REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen"), REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
    }
    var MAYBE_ITERATOR_SYMBOL = "function" == typeof Symbol && Symbol.iterator;
    function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" != typeof maybeIterable) return null;
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" == typeof maybeIterator ? maybeIterator : null;
    }
    // Helpers to patch console.logs to avoid logging during side-effect free
    // replaying on render function. This currently only patches the object
    // lazily which won't cover if the log function was extracted eagerly.
    // We could also eagerly patch the method.
    var disabledDepth = 0;
    function disabledLog() {}
    function disableLogs() {
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
    }
    function reenableLogs() {
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
    }
    disabledLog.__reactDisabledLog = !0;
    var ReactCurrentDispatcher1 = ReactSharedInternals.ReactCurrentDispatcher;
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
        Error.prepareStackTrace = void 0, previousDispatcher = ReactCurrentDispatcher1.current, // for warnings.
        ReactCurrentDispatcher1.current = null, disableLogs();
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
            reentry = !1, ReactCurrentDispatcher1.current = previousDispatcher, reenableLogs(), Error.prepareStackTrace = previousPrepareStackTrace;
        } // Fallback to just using the name if we couldn't make it throw.
        var name = fn ? fn.displayName || fn.name : "", syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        return "function" == typeof fn && componentFrameCache.set(fn, syntheticFrame), syntheticFrame;
    }
    componentFrameCache = new ("function" == typeof WeakMap ? WeakMap : Map)();
    function getStackByFiberInDevAndProd(workInProgress) {
        try {
            var info = "", node = workInProgress;
            do info += function(fiber) {
                switch(fiber._debugOwner && fiber._debugOwner.type, fiber._debugSource, fiber.tag){
                    case 5:
                        return describeBuiltInComponentFrame(fiber.type);
                    case 16:
                        return describeBuiltInComponentFrame("Lazy");
                    case 13:
                        return describeBuiltInComponentFrame("Suspense");
                    case 19:
                        return describeBuiltInComponentFrame("SuspenseList");
                    case 0:
                    case 2:
                    case 15:
                        return describeNativeComponentFrame(fiber.type, !1);
                    case 11:
                        return describeNativeComponentFrame(fiber.type.render, !1);
                    case 22:
                        return describeNativeComponentFrame(fiber.type._render, !1);
                    case 1:
                        return describeNativeComponentFrame(fiber.type, !0);
                    default:
                        return "";
                }
            }(node), node = node.return;
            while (node)
            return info;
        } catch (x) {
            return "\nError generating stack: " + x.message + "\n" + x.stack;
        }
    }
    function getContextName(type) {
        return type.displayName || "Context";
    }
    function getComponentName(type) {
        if (null == type) // Host root, text node or just invalid type.
        return null;
        if ("number" == typeof type.tag && error("Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue."), "function" == typeof type) return type.displayName || type.name || null;
        if ("string" == typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
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
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame, current = null, isRendering = !1;
    function getCurrentFiberOwnerNameInDevOrNull() {
        if (null === current) return null;
        var owner = current._debugOwner;
        return null != owner ? getComponentName(owner.type) : null;
    }
    function getCurrentFiberStackInDev() {
        return null === current ? "" : getStackByFiberInDevAndProd(current) // Safe because if current fiber exists, we are reconciling,
        ;
    }
    function resetCurrentFiber() {
        ReactDebugCurrentFrame.getCurrentStack = null, current = null, isRendering = !1;
    }
    function setCurrentFiber(fiber) {
        ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackInDev, current = fiber, isRendering = !1;
    }
    function getToStringValue(value) {
        switch(typeof value){
            case "boolean":
            case "number":
            case "object":
            case "string":
            case "undefined":
                return value;
            default:
                // function, symbol are assigned as empty strings
                return "";
        }
    }
    var hasReadOnlyValue = {
        button: !0,
        checkbox: !0,
        image: !0,
        hidden: !0,
        radio: !0,
        reset: !0,
        submit: !0
    };
    function checkControlledValueProps(tagName, props) {
        hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || null == props.value || error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), props.onChange || props.readOnly || props.disabled || null == props.checked || error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function isCheckable(elem) {
        var type = elem.type, nodeName = elem.nodeName;
        return nodeName && "input" === nodeName.toLowerCase() && ("checkbox" === type || "radio" === type);
    }
    function getTracker(node) {
        return node._valueTracker;
    }
    function track(node) {
        !getTracker(node) && (node._valueTracker = function(node) {
            var valueField = isCheckable(node) ? "checked" : "value", descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField), currentValue = "" + node[valueField];
            // and don't track value will cause over reporting of changes,
            // but it's better then a hard failure
            // (needed for certain tests that spyOn input values and Safari)
            if (!node.hasOwnProperty(valueField) && void 0 !== descriptor && "function" == typeof descriptor.get && "function" == typeof descriptor.set) {
                var get = descriptor.get, set = descriptor.set;
                return Object.defineProperty(node, valueField, {
                    configurable: !0,
                    get: function() {
                        return get.call(this);
                    },
                    set: function(value) {
                        currentValue = "" + value, set.call(this, value);
                    }
                }), // but it triggers a bug in IE11 and Edge 14/15.
                // Calling defineProperty() again should be equivalent.
                // https://github.com/facebook/react/issues/11768
                Object.defineProperty(node, valueField, {
                    enumerable: descriptor.enumerable
                }), {
                    getValue: function() {
                        return currentValue;
                    },
                    setValue: function(value) {
                        currentValue = "" + value;
                    },
                    stopTracking: function() {
                        node._valueTracker = null, delete node[valueField];
                    }
                };
            }
        }(node)); // TODO: Once it's just Fiber we can move this to node._wrapperState
    }
    function updateValueIfChanged(node) {
        if (!node) return !1;
        var value, tracker = getTracker(node); // if there is no tracker at this point it's unlikely
        // that trying again will succeed
        if (!tracker) return !0;
        var lastValue = tracker.getValue(), nextValue = (value = "", node ? value = isCheckable(node) ? node.checked ? "true" : "false" : node.value : value);
        return nextValue !== lastValue && (tracker.setValue(nextValue), !0);
    }
    function getActiveElement(doc) {
        if (void 0 === (doc = doc || ("undefined" != typeof document ? document : void 0))) return null;
        try {
            return doc.activeElement || doc.body;
        } catch (e) {
            return doc.body;
        }
    }
    var didWarnValueDefaultValue = !1, didWarnCheckedDefaultChecked = !1, didWarnControlledToUncontrolled = !1, didWarnUncontrolledToControlled = !1;
    function isControlled(props) {
        return "checkbox" === props.type || "radio" === props.type ? null != props.checked : null != props.value;
    }
    /**
   * Implements an <input> host component that allows setting these optional
   * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
   *
   * If `checked` or `value` are not supplied (or null/undefined), user actions
   * that affect the checked state or value will trigger updates to the element.
   *
   * If they are supplied (and not null/undefined), the rendered element will not
   * trigger updates to the element. Instead, the props must change in order for
   * the rendered element to be updated.
   *
   * The rendered element will be initialized as unchecked (or `defaultChecked`)
   * with an empty value (or `defaultValue`).
   *
   * See http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
   */ function getHostProps(element, props) {
        var checked = props.checked;
        return _assign({}, props, {
            defaultChecked: void 0,
            defaultValue: void 0,
            value: void 0,
            checked: null != checked ? checked : element._wrapperState.initialChecked
        });
    }
    function initWrapperState(element, props) {
        checkControlledValueProps("input", props), void 0 === props.checked || void 0 === props.defaultChecked || didWarnCheckedDefaultChecked || (error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", getCurrentFiberOwnerNameInDevOrNull() || "A component", props.type), didWarnCheckedDefaultChecked = !0), void 0 === props.value || void 0 === props.defaultValue || didWarnValueDefaultValue || (error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", getCurrentFiberOwnerNameInDevOrNull() || "A component", props.type), didWarnValueDefaultValue = !0);
        var defaultValue = null == props.defaultValue ? "" : props.defaultValue;
        element._wrapperState = {
            initialChecked: null != props.checked ? props.checked : props.defaultChecked,
            initialValue: getToStringValue(null != props.value ? props.value : defaultValue),
            controlled: isControlled(props)
        };
    }
    function updateChecked(element, props) {
        var checked = props.checked;
        null != checked && setValueForProperty(element, "checked", checked, !1);
    }
    function updateWrapper(element, props) {
        var controlled = isControlled(props);
        element._wrapperState.controlled || !controlled || didWarnUncontrolledToControlled || (error("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), didWarnUncontrolledToControlled = !0), !element._wrapperState.controlled || controlled || didWarnControlledToUncontrolled || (error("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), didWarnControlledToUncontrolled = !0), updateChecked(element, props);
        var value = getToStringValue(props.value), type = props.type;
        if (null != value) "number" === type ? (0 === value && "" === element.value || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        element.value != value) && (element.value = "" + value) : element.value !== "" + value && (element.value = "" + value);
        else if ("submit" === type || "reset" === type) {
            // Submit/reset inputs need the attribute removed completely to avoid
            // blank-text buttons.
            element.removeAttribute("value");
            return;
        }
        props.hasOwnProperty("value") ? setDefaultValue(element, props.type, value) : props.hasOwnProperty("defaultValue") && setDefaultValue(element, props.type, getToStringValue(props.defaultValue)), null == props.checked && null != props.defaultChecked && (element.defaultChecked = !!props.defaultChecked);
    }
    function postMountWrapper(element, props, isHydrating) {
        // from being lost during SSR hydration.
        if (props.hasOwnProperty("value") || props.hasOwnProperty("defaultValue")) {
            var type = props.type;
            // default value provided by the browser. See: #12872
            if (("submit" === type || "reset" === type) && (void 0 === props.value || null === props.value)) return;
            var initialValue = "" + element._wrapperState.initialValue; // Do not assign value if it is already set. This prevents user text input
            isHydrating || initialValue === element.value || (element.value = initialValue), // Otherwise, the value attribute is synchronized to the property,
            // so we assign defaultValue to the same thing as the value property
            // assignment step above.
            element.defaultValue = initialValue;
        } // Normally, we'd just do `node.checked = node.checked` upon initial mount, less this bug
        // this is needed to work around a chrome bug where setting defaultChecked
        // will sometimes influence the value of checked (even after detachment).
        // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=608416
        // We need to temporarily unset name to avoid disrupting radio button groups.
        var name = element.name;
        "" !== name && (element.name = ""), // When syncing the checked attribute, both the checked property and
        // attribute are assigned at the same time using defaultChecked. This uses:
        //
        //   1. The checked React property when present
        //   2. The defaultChecked React property when present
        //   3. Otherwise, false
        element.defaultChecked = !element.defaultChecked, element.defaultChecked = !!element._wrapperState.initialChecked, "" !== name && (element.name = name);
    }
    // For number inputs, the display value loses trailing decimal points. For email inputs,
    // Chrome raises "The specified value <x> is not a valid email address".
    //
    // Here we check to see if the defaultValue has actually changed, avoiding these problems
    // when the user is inputting text
    //
    // https://github.com/facebook/react/issues/7253
    function setDefaultValue(node, type, value) {
        // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
        ("number" !== type || getActiveElement(node.ownerDocument) !== node) && (null == value ? node.defaultValue = "" + node._wrapperState.initialValue : node.defaultValue !== "" + value && (node.defaultValue = "" + value));
    }
    var didWarnSelectedSetOnOption = !1, didWarnInvalidChild = !1;
    /**
   * Implements an <option> host component that warns when `selected` is set.
   */ function validateProps(element, props) {
        "object" == typeof props.children && null !== props.children && React.Children.forEach(props.children, function(child) {
            null != child && "string" != typeof child && "number" != typeof child && "string" == typeof child.type && (didWarnInvalidChild || (didWarnInvalidChild = !0, error("Only strings and numbers are supported as <option> children.")));
        }), null == props.selected || didWarnSelectedSetOnOption || (error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), didWarnSelectedSetOnOption = !0);
    }
    function getHostProps$1(element, props) {
        var children, content, hostProps = _assign({
            children: void 0
        }, props), content1 = (children = props.children, content = "", // during validateProps() which runs for hydration too.
        // Note that this would throw on non-element objects.
        // Elements are stringified (which is normally irrelevant
        // but matters for <fbt>).
        React.Children.forEach(children, function(child) {
            null != child && (content += child);
        // Instead, this is done separately below so that
        // it happens during the hydration code path too.
        }), content);
        return content1 && (hostProps.children = content1), hostProps;
    }
    function getDeclarationErrorAddendum() {
        var ownerName = getCurrentFiberOwnerNameInDevOrNull();
        return ownerName ? "\n\nCheck the render method of `" + ownerName + "`." : "";
    }
    didWarnValueDefaultValue$1 = !1;
    var valuePropNames = [
        "value",
        "defaultValue"
    ];
    function updateOptions(node, multiple, propValue, setDefaultSelected) {
        var options = node.options;
        if (multiple) {
            for(var selectedValue = {}, i = 0; i < propValue.length; i++)// Prefix to avoid chaos with special keys.
            selectedValue["$" + propValue[i]] = !0;
            for(var _i = 0; _i < options.length; _i++){
                var selected = selectedValue.hasOwnProperty("$" + options[_i].value);
                options[_i].selected !== selected && (options[_i].selected = selected), selected && setDefaultSelected && (options[_i].defaultSelected = !0);
            }
        } else {
            for(var _selectedValue = "" + getToStringValue(propValue), defaultSelected = null, _i2 = 0; _i2 < options.length; _i2++){
                if (options[_i2].value === _selectedValue) {
                    options[_i2].selected = !0, setDefaultSelected && (options[_i2].defaultSelected = !0);
                    return;
                }
                null !== defaultSelected || options[_i2].disabled || (defaultSelected = options[_i2]);
            }
            null !== defaultSelected && (defaultSelected.selected = !0);
        }
    }
    /**
   * Implements a <select> host component that allows optionally setting the
   * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
   * stringable. If `multiple` is true, the prop must be an array of stringables.
   *
   * If `value` is not supplied (or null/undefined), user actions that change the
   * selected option will trigger updates to the rendered options.
   *
   * If it is supplied (and not null/undefined), the rendered options will not
   * update in response to user actions. Instead, the `value` prop must change in
   * order for the rendered options to update.
   *
   * If `defaultValue` is provided, any options with the supplied values will be
   * selected.
   */ function getHostProps$2(element, props) {
        return _assign({}, props, {
            value: void 0
        });
    }
    function initWrapperState$1(element, props) {
        !/**
   * Validation function for `value` and `defaultValue`.
   */ function(props) {
            checkControlledValueProps("select", props);
            for(var i = 0; i < valuePropNames.length; i++){
                var propName = valuePropNames[i];
                if (null != props[propName]) {
                    var isArray = Array.isArray(props[propName]);
                    props.multiple && !isArray ? error("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", propName, getDeclarationErrorAddendum()) : !props.multiple && isArray && error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", propName, getDeclarationErrorAddendum());
                }
            }
        }(props), element._wrapperState = {
            wasMultiple: !!props.multiple
        }, void 0 === props.value || void 0 === props.defaultValue || didWarnValueDefaultValue$1 || (error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), didWarnValueDefaultValue$1 = !0);
    }
    var didWarnValDefaultVal = !1;
    /**
   * Implements a <textarea> host component that allows setting `value`, and
   * `defaultValue`. This differs from the traditional DOM API because value is
   * usually set as PCDATA children.
   *
   * If `value` is not supplied (or null/undefined), user actions that affect the
   * value will trigger updates to the element.
   *
   * If `value` is supplied (and not null/undefined), the rendered element will
   * not trigger updates to the element. Instead, the `value` prop must change in
   * order for the rendered element to be updated.
   *
   * The rendered element will be initialized with an empty value, the prop
   * `defaultValue` if specified, or the children content (deprecated).
   */ function getHostProps$3(element, props) {
        if (null != props.dangerouslySetInnerHTML) throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
         // Always set children to the same thing. In IE9, the selection range will
        return _assign({}, props, {
            value: void 0,
            defaultValue: void 0,
            children: "" + element._wrapperState.initialValue
        });
    }
    function initWrapperState$2(element, props) {
        checkControlledValueProps("textarea", props), void 0 === props.value || void 0 === props.defaultValue || didWarnValDefaultVal || (error("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", getCurrentFiberOwnerNameInDevOrNull() || "A component"), didWarnValDefaultVal = !0);
        var initialValue = props.value; // Only bother fetching default value if we're going to use it
        if (null == initialValue) {
            var children = props.children, defaultValue = props.defaultValue;
            if (null != children) {
                if (error("Use the `defaultValue` or `value` props instead of setting children on <textarea>."), null != defaultValue) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
                if (Array.isArray(children)) {
                    if (!(children.length <= 1)) throw Error("<textarea> can only have at most one child.");
                    children = children[0];
                }
                defaultValue = children;
            }
            null == defaultValue && (defaultValue = ""), initialValue = defaultValue;
        }
        element._wrapperState = {
            initialValue: getToStringValue(initialValue)
        };
    }
    function updateWrapper$1(element, props) {
        var value = getToStringValue(props.value), defaultValue = getToStringValue(props.defaultValue);
        if (null != value) {
            // Cast `value` to a string to ensure the value is set correctly. While
            // browsers typically do this as necessary, jsdom doesn't.
            var newValue = "" + value; // To avoid side effects (such as losing text selection), only set value if changed
            newValue !== element.value && (element.value = newValue), null == props.defaultValue && element.defaultValue !== newValue && (element.defaultValue = newValue);
        }
        null != defaultValue && (element.defaultValue = "" + defaultValue);
    }
    function postMountWrapper$3(element, props) {
        // available until after the component has mounted.
        var textContent = element.textContent; // Only set node.value if textContent is equal to the expected
        // initial value. In IE10/IE11 there is a bug where the placeholder attribute
        // will populate textContent as well.
        // https://developer.microsoft.com/microsoft-edge/platform/issues/101525/
        textContent === element._wrapperState.initialValue && "" !== textContent && null !== textContent && (element.value = textContent);
    }
    var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml", SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    function getIntrinsicNamespace(type) {
        switch(type){
            case "svg":
                return SVG_NAMESPACE;
            case "math":
                return "http://www.w3.org/1998/Math/MathML";
            default:
                return HTML_NAMESPACE;
        }
    }
    function getChildNamespace(parentNamespace, type) {
        return null == parentNamespace || parentNamespace === HTML_NAMESPACE ? getIntrinsicNamespace(type) : parentNamespace === SVG_NAMESPACE && "foreignObject" === type ? HTML_NAMESPACE : parentNamespace;
    }
    /**
   * Set the innerHTML property of a node
   *
   * @param {DOMElement} node
   * @param {string} html
   * @internal
   */ var setInnerHTML = (func = function(node, html) {
        if (node.namespaceURI === SVG_NAMESPACE && !("innerHTML" in node)) {
            // IE does not have innerHTML for SVG nodes, so instead we inject the
            // new markup in a temp node and then move the child nodes across into
            // the target node
            (reusableSVGContainer = reusableSVGContainer || document.createElement("div")).innerHTML = "<svg>" + html.valueOf().toString() + "</svg>";
            for(var svgNode = reusableSVGContainer.firstChild; node.firstChild;)node.removeChild(node.firstChild);
            for(; svgNode.firstChild;)node.appendChild(svgNode.firstChild);
            return;
        }
        node.innerHTML = html;
    }, "undefined" != typeof MSApp && MSApp.execUnsafeLocalFunction ? function(arg0, arg1, arg2, arg3) {
        MSApp.execUnsafeLocalFunction(function() {
            return func(arg0, arg1, arg2, arg3);
        });
    } : func), setTextContent = function(node, text) {
        if (text) {
            var firstChild = node.firstChild;
            if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
                firstChild.nodeValue = text;
                return;
            }
        }
        node.textContent = text;
    }, shorthandToLonghand = {
        animation: [
            "animationDelay",
            "animationDirection",
            "animationDuration",
            "animationFillMode",
            "animationIterationCount",
            "animationName",
            "animationPlayState",
            "animationTimingFunction"
        ],
        background: [
            "backgroundAttachment",
            "backgroundClip",
            "backgroundColor",
            "backgroundImage",
            "backgroundOrigin",
            "backgroundPositionX",
            "backgroundPositionY",
            "backgroundRepeat",
            "backgroundSize"
        ],
        backgroundPosition: [
            "backgroundPositionX",
            "backgroundPositionY"
        ],
        border: [
            "borderBottomColor",
            "borderBottomStyle",
            "borderBottomWidth",
            "borderImageOutset",
            "borderImageRepeat",
            "borderImageSlice",
            "borderImageSource",
            "borderImageWidth",
            "borderLeftColor",
            "borderLeftStyle",
            "borderLeftWidth",
            "borderRightColor",
            "borderRightStyle",
            "borderRightWidth",
            "borderTopColor",
            "borderTopStyle",
            "borderTopWidth"
        ],
        borderBlockEnd: [
            "borderBlockEndColor",
            "borderBlockEndStyle",
            "borderBlockEndWidth"
        ],
        borderBlockStart: [
            "borderBlockStartColor",
            "borderBlockStartStyle",
            "borderBlockStartWidth"
        ],
        borderBottom: [
            "borderBottomColor",
            "borderBottomStyle",
            "borderBottomWidth"
        ],
        borderColor: [
            "borderBottomColor",
            "borderLeftColor",
            "borderRightColor",
            "borderTopColor"
        ],
        borderImage: [
            "borderImageOutset",
            "borderImageRepeat",
            "borderImageSlice",
            "borderImageSource",
            "borderImageWidth"
        ],
        borderInlineEnd: [
            "borderInlineEndColor",
            "borderInlineEndStyle",
            "borderInlineEndWidth"
        ],
        borderInlineStart: [
            "borderInlineStartColor",
            "borderInlineStartStyle",
            "borderInlineStartWidth"
        ],
        borderLeft: [
            "borderLeftColor",
            "borderLeftStyle",
            "borderLeftWidth"
        ],
        borderRadius: [
            "borderBottomLeftRadius",
            "borderBottomRightRadius",
            "borderTopLeftRadius",
            "borderTopRightRadius"
        ],
        borderRight: [
            "borderRightColor",
            "borderRightStyle",
            "borderRightWidth"
        ],
        borderStyle: [
            "borderBottomStyle",
            "borderLeftStyle",
            "borderRightStyle",
            "borderTopStyle"
        ],
        borderTop: [
            "borderTopColor",
            "borderTopStyle",
            "borderTopWidth"
        ],
        borderWidth: [
            "borderBottomWidth",
            "borderLeftWidth",
            "borderRightWidth",
            "borderTopWidth"
        ],
        columnRule: [
            "columnRuleColor",
            "columnRuleStyle",
            "columnRuleWidth"
        ],
        columns: [
            "columnCount",
            "columnWidth"
        ],
        flex: [
            "flexBasis",
            "flexGrow",
            "flexShrink"
        ],
        flexFlow: [
            "flexDirection",
            "flexWrap"
        ],
        font: [
            "fontFamily",
            "fontFeatureSettings",
            "fontKerning",
            "fontLanguageOverride",
            "fontSize",
            "fontSizeAdjust",
            "fontStretch",
            "fontStyle",
            "fontVariant",
            "fontVariantAlternates",
            "fontVariantCaps",
            "fontVariantEastAsian",
            "fontVariantLigatures",
            "fontVariantNumeric",
            "fontVariantPosition",
            "fontWeight",
            "lineHeight"
        ],
        fontVariant: [
            "fontVariantAlternates",
            "fontVariantCaps",
            "fontVariantEastAsian",
            "fontVariantLigatures",
            "fontVariantNumeric",
            "fontVariantPosition"
        ],
        gap: [
            "columnGap",
            "rowGap"
        ],
        grid: [
            "gridAutoColumns",
            "gridAutoFlow",
            "gridAutoRows",
            "gridTemplateAreas",
            "gridTemplateColumns",
            "gridTemplateRows"
        ],
        gridArea: [
            "gridColumnEnd",
            "gridColumnStart",
            "gridRowEnd",
            "gridRowStart"
        ],
        gridColumn: [
            "gridColumnEnd",
            "gridColumnStart"
        ],
        gridColumnGap: [
            "columnGap"
        ],
        gridGap: [
            "columnGap",
            "rowGap"
        ],
        gridRow: [
            "gridRowEnd",
            "gridRowStart"
        ],
        gridRowGap: [
            "rowGap"
        ],
        gridTemplate: [
            "gridTemplateAreas",
            "gridTemplateColumns",
            "gridTemplateRows"
        ],
        listStyle: [
            "listStyleImage",
            "listStylePosition",
            "listStyleType"
        ],
        margin: [
            "marginBottom",
            "marginLeft",
            "marginRight",
            "marginTop"
        ],
        marker: [
            "markerEnd",
            "markerMid",
            "markerStart"
        ],
        mask: [
            "maskClip",
            "maskComposite",
            "maskImage",
            "maskMode",
            "maskOrigin",
            "maskPositionX",
            "maskPositionY",
            "maskRepeat",
            "maskSize"
        ],
        maskPosition: [
            "maskPositionX",
            "maskPositionY"
        ],
        outline: [
            "outlineColor",
            "outlineStyle",
            "outlineWidth"
        ],
        overflow: [
            "overflowX",
            "overflowY"
        ],
        padding: [
            "paddingBottom",
            "paddingLeft",
            "paddingRight",
            "paddingTop"
        ],
        placeContent: [
            "alignContent",
            "justifyContent"
        ],
        placeItems: [
            "alignItems",
            "justifyItems"
        ],
        placeSelf: [
            "alignSelf",
            "justifySelf"
        ],
        textDecoration: [
            "textDecorationColor",
            "textDecorationLine",
            "textDecorationStyle"
        ],
        textEmphasis: [
            "textEmphasisColor",
            "textEmphasisStyle"
        ],
        transition: [
            "transitionDelay",
            "transitionDuration",
            "transitionProperty",
            "transitionTimingFunction"
        ],
        wordWrap: [
            "overflowWrap"
        ]
    }, isUnitlessNumber = {
        animationIterationCount: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridArea: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        // SVG-related properties
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0
    }, prefixes = [
        "Webkit",
        "ms",
        "Moz",
        "O"
    ];
    /**
   * Convert a value into the proper css writable value. The style name `name`
   * should be logical (no hyphens), as specified
   * in `CSSProperty.isUnitlessNumber`.
   *
   * @param {string} name CSS property name such as `topMargin`.
   * @param {*} value CSS property value such as `10px`.
   * @return {string} Normalized style value with dimensions applied.
   */ function dangerousStyleValue(name, value, isCustomProperty) {
        return null == value || "boolean" == typeof value || "" === value ? "" : isCustomProperty || "number" != typeof value || 0 === value || isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name] ? ("" + value).trim() : value + "px";
    }
    // infinite loop, because it iterates over the newly added props too.
    Object.keys(isUnitlessNumber).forEach(function(prop) {
        prefixes.forEach(function(prefix) {
            isUnitlessNumber[prefix + prop.charAt(0).toUpperCase() + prop.substring(1)] = isUnitlessNumber[prop];
        });
    });
    var uppercasePattern = /([A-Z])/g, msPattern = /^ms-/, warnValidStyle = function() {}, badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/, msPattern$1 = /^-ms-/, hyphenPattern = /-(.)/g, badStyleValueWithSemicolonPattern = /;\s*$/, warnedStyleNames = {}, warnedStyleValues = {}, warnedForNaNValue = !1, warnedForInfinityValue = !1, warnHyphenatedStyleName = function(name) {
        (!warnedStyleNames.hasOwnProperty(name) || !warnedStyleNames[name]) && (warnedStyleNames[name] = !0, error("Unsupported style property %s. Did you mean %s?", name, name.replace(msPattern$1, "ms-").replace(hyphenPattern, function(_, character) {
            return character.toUpperCase();
        })));
    }, warnBadVendoredStyleName = function(name) {
        (!warnedStyleNames.hasOwnProperty(name) || !warnedStyleNames[name]) && (warnedStyleNames[name] = !0, error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1)));
    }, warnStyleValueWithSemicolon = function(name, value) {
        (!warnedStyleValues.hasOwnProperty(value) || !warnedStyleValues[value]) && (warnedStyleValues[value] = !0, error('Style property values shouldn\'t contain a semicolon. Try "%s: %s" instead.', name, value.replace(badStyleValueWithSemicolonPattern, "")));
    }, warnStyleValueIsNaN = function(name, value) {
        !warnedForNaNValue && (warnedForNaNValue = !0, error("`NaN` is an invalid value for the `%s` css style property.", name));
    }, warnStyleValueIsInfinity = function(name, value) {
        !warnedForInfinityValue && (warnedForInfinityValue = !0, error("`Infinity` is an invalid value for the `%s` css style property.", name));
    }, warnValidStyle$1 = function(name, value) {
        name.indexOf("-") > -1 ? warnHyphenatedStyleName(name) : badVendoredStyleNamePattern.test(name) ? warnBadVendoredStyleName(name) : badStyleValueWithSemicolonPattern.test(value) && warnStyleValueWithSemicolon(name, value), "number" != typeof value || (isNaN(value) ? warnStyleValueIsNaN(name, value) : isFinite(value) || warnStyleValueIsInfinity(name, value));
    };
    /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   */ function setValueForStyles(node, styles) {
        var style = node.style;
        for(var styleName in styles)if (styles.hasOwnProperty(styleName)) {
            var isCustomProperty = 0 === styleName.indexOf("--");
            isCustomProperty || warnValidStyle$1(styleName, styles[styleName]);
            var styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);
            "float" === styleName && (styleName = "cssFloat"), isCustomProperty ? style.setProperty(styleName, styleValue) : style[styleName] = styleValue;
        }
    }
    /**
   * Given {color: 'red', overflow: 'hidden'} returns {
   *   color: 'color',
   *   overflowX: 'overflow',
   *   overflowY: 'overflow',
   * }. This can be read as "the overflowY property was set by the overflow
   * shorthand". That is, the values are the property that each was derived from.
   */ function expandShorthandMap(styles) {
        var expanded = {};
        for(var key in styles)for(var longhands = shorthandToLonghand[key] || [
            key
        ], i = 0; i < longhands.length; i++)expanded[longhands[i]] = key;
        return expanded;
    }
    // `omittedCloseTags` except that `menuitem` should still have its closing tag.
    var voidElementTags = _assign({
        menuitem: !0
    }, {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
    });
    function assertValidProps(tag, props) {
        if (props) {
            if (voidElementTags[tag] && !(null == props.children && null == props.dangerouslySetInnerHTML)) throw Error(tag + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
            if (null != props.dangerouslySetInnerHTML) {
                if (null != props.children) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
                if (!("object" == typeof props.dangerouslySetInnerHTML && "__html" in props.dangerouslySetInnerHTML)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
            }
            if (!props.suppressContentEditableWarning && props.contentEditable && null != props.children && error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), !(null == props.style || "object" == typeof props.style)) throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
        } // Note the use of `==` which checks for null or undefined.
    }
    function isCustomComponent(tagName, props) {
        if (-1 === tagName.indexOf("-")) return "string" == typeof props.is;
        switch(tagName){
            // These are reserved SVG and MathML elements.
            // We don't mind this list too much because we expect it to never grow.
            // The alternative is to track the namespace in a few places which is convoluted.
            // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
            case "annotation-xml":
            case "color-profile":
            case "font-face":
            case "font-face-src":
            case "font-face-uri":
            case "font-face-format":
            case "font-face-name":
            case "missing-glyph":
                return !1;
            default:
                return !0;
        }
    }
    // When adding attributes to the HTML or SVG allowed attribute list, be sure to
    // also add them to this module to ensure casing and incorrect name
    // warnings.
    var possibleStandardNames = {
        // HTML
        accept: "accept",
        acceptcharset: "acceptCharset",
        "accept-charset": "acceptCharset",
        accesskey: "accessKey",
        action: "action",
        allowfullscreen: "allowFullScreen",
        alt: "alt",
        as: "as",
        async: "async",
        autocapitalize: "autoCapitalize",
        autocomplete: "autoComplete",
        autocorrect: "autoCorrect",
        autofocus: "autoFocus",
        autoplay: "autoPlay",
        autosave: "autoSave",
        capture: "capture",
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        challenge: "challenge",
        charset: "charSet",
        checked: "checked",
        children: "children",
        cite: "cite",
        class: "className",
        classid: "classID",
        classname: "className",
        cols: "cols",
        colspan: "colSpan",
        content: "content",
        contenteditable: "contentEditable",
        contextmenu: "contextMenu",
        controls: "controls",
        controlslist: "controlsList",
        coords: "coords",
        crossorigin: "crossOrigin",
        dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
        data: "data",
        datetime: "dateTime",
        default: "default",
        defaultchecked: "defaultChecked",
        defaultvalue: "defaultValue",
        defer: "defer",
        dir: "dir",
        disabled: "disabled",
        disablepictureinpicture: "disablePictureInPicture",
        disableremoteplayback: "disableRemotePlayback",
        download: "download",
        draggable: "draggable",
        enctype: "encType",
        enterkeyhint: "enterKeyHint",
        for: "htmlFor",
        form: "form",
        formmethod: "formMethod",
        formaction: "formAction",
        formenctype: "formEncType",
        formnovalidate: "formNoValidate",
        formtarget: "formTarget",
        frameborder: "frameBorder",
        headers: "headers",
        height: "height",
        hidden: "hidden",
        high: "high",
        href: "href",
        hreflang: "hrefLang",
        htmlfor: "htmlFor",
        httpequiv: "httpEquiv",
        "http-equiv": "httpEquiv",
        icon: "icon",
        id: "id",
        innerhtml: "innerHTML",
        inputmode: "inputMode",
        integrity: "integrity",
        is: "is",
        itemid: "itemID",
        itemprop: "itemProp",
        itemref: "itemRef",
        itemscope: "itemScope",
        itemtype: "itemType",
        keyparams: "keyParams",
        keytype: "keyType",
        kind: "kind",
        label: "label",
        lang: "lang",
        list: "list",
        loop: "loop",
        low: "low",
        manifest: "manifest",
        marginwidth: "marginWidth",
        marginheight: "marginHeight",
        max: "max",
        maxlength: "maxLength",
        media: "media",
        mediagroup: "mediaGroup",
        method: "method",
        min: "min",
        minlength: "minLength",
        multiple: "multiple",
        muted: "muted",
        name: "name",
        nomodule: "noModule",
        nonce: "nonce",
        novalidate: "noValidate",
        open: "open",
        optimum: "optimum",
        pattern: "pattern",
        placeholder: "placeholder",
        playsinline: "playsInline",
        poster: "poster",
        preload: "preload",
        profile: "profile",
        radiogroup: "radioGroup",
        readonly: "readOnly",
        referrerpolicy: "referrerPolicy",
        rel: "rel",
        required: "required",
        reversed: "reversed",
        role: "role",
        rows: "rows",
        rowspan: "rowSpan",
        sandbox: "sandbox",
        scope: "scope",
        scoped: "scoped",
        scrolling: "scrolling",
        seamless: "seamless",
        selected: "selected",
        shape: "shape",
        size: "size",
        sizes: "sizes",
        span: "span",
        spellcheck: "spellCheck",
        src: "src",
        srcdoc: "srcDoc",
        srclang: "srcLang",
        srcset: "srcSet",
        start: "start",
        step: "step",
        style: "style",
        summary: "summary",
        tabindex: "tabIndex",
        target: "target",
        title: "title",
        type: "type",
        usemap: "useMap",
        value: "value",
        width: "width",
        wmode: "wmode",
        wrap: "wrap",
        // SVG
        about: "about",
        accentheight: "accentHeight",
        "accent-height": "accentHeight",
        accumulate: "accumulate",
        additive: "additive",
        alignmentbaseline: "alignmentBaseline",
        "alignment-baseline": "alignmentBaseline",
        allowreorder: "allowReorder",
        alphabetic: "alphabetic",
        amplitude: "amplitude",
        arabicform: "arabicForm",
        "arabic-form": "arabicForm",
        ascent: "ascent",
        attributename: "attributeName",
        attributetype: "attributeType",
        autoreverse: "autoReverse",
        azimuth: "azimuth",
        basefrequency: "baseFrequency",
        baselineshift: "baselineShift",
        "baseline-shift": "baselineShift",
        baseprofile: "baseProfile",
        bbox: "bbox",
        begin: "begin",
        bias: "bias",
        by: "by",
        calcmode: "calcMode",
        capheight: "capHeight",
        "cap-height": "capHeight",
        clip: "clip",
        clippath: "clipPath",
        "clip-path": "clipPath",
        clippathunits: "clipPathUnits",
        cliprule: "clipRule",
        "clip-rule": "clipRule",
        color: "color",
        colorinterpolation: "colorInterpolation",
        "color-interpolation": "colorInterpolation",
        colorinterpolationfilters: "colorInterpolationFilters",
        "color-interpolation-filters": "colorInterpolationFilters",
        colorprofile: "colorProfile",
        "color-profile": "colorProfile",
        colorrendering: "colorRendering",
        "color-rendering": "colorRendering",
        contentscripttype: "contentScriptType",
        contentstyletype: "contentStyleType",
        cursor: "cursor",
        cx: "cx",
        cy: "cy",
        d: "d",
        datatype: "datatype",
        decelerate: "decelerate",
        descent: "descent",
        diffuseconstant: "diffuseConstant",
        direction: "direction",
        display: "display",
        divisor: "divisor",
        dominantbaseline: "dominantBaseline",
        "dominant-baseline": "dominantBaseline",
        dur: "dur",
        dx: "dx",
        dy: "dy",
        edgemode: "edgeMode",
        elevation: "elevation",
        enablebackground: "enableBackground",
        "enable-background": "enableBackground",
        end: "end",
        exponent: "exponent",
        externalresourcesrequired: "externalResourcesRequired",
        fill: "fill",
        fillopacity: "fillOpacity",
        "fill-opacity": "fillOpacity",
        fillrule: "fillRule",
        "fill-rule": "fillRule",
        filter: "filter",
        filterres: "filterRes",
        filterunits: "filterUnits",
        floodopacity: "floodOpacity",
        "flood-opacity": "floodOpacity",
        floodcolor: "floodColor",
        "flood-color": "floodColor",
        focusable: "focusable",
        fontfamily: "fontFamily",
        "font-family": "fontFamily",
        fontsize: "fontSize",
        "font-size": "fontSize",
        fontsizeadjust: "fontSizeAdjust",
        "font-size-adjust": "fontSizeAdjust",
        fontstretch: "fontStretch",
        "font-stretch": "fontStretch",
        fontstyle: "fontStyle",
        "font-style": "fontStyle",
        fontvariant: "fontVariant",
        "font-variant": "fontVariant",
        fontweight: "fontWeight",
        "font-weight": "fontWeight",
        format: "format",
        from: "from",
        fx: "fx",
        fy: "fy",
        g1: "g1",
        g2: "g2",
        glyphname: "glyphName",
        "glyph-name": "glyphName",
        glyphorientationhorizontal: "glyphOrientationHorizontal",
        "glyph-orientation-horizontal": "glyphOrientationHorizontal",
        glyphorientationvertical: "glyphOrientationVertical",
        "glyph-orientation-vertical": "glyphOrientationVertical",
        glyphref: "glyphRef",
        gradienttransform: "gradientTransform",
        gradientunits: "gradientUnits",
        hanging: "hanging",
        horizadvx: "horizAdvX",
        "horiz-adv-x": "horizAdvX",
        horizoriginx: "horizOriginX",
        "horiz-origin-x": "horizOriginX",
        ideographic: "ideographic",
        imagerendering: "imageRendering",
        "image-rendering": "imageRendering",
        in2: "in2",
        in: "in",
        inlist: "inlist",
        intercept: "intercept",
        k1: "k1",
        k2: "k2",
        k3: "k3",
        k4: "k4",
        k: "k",
        kernelmatrix: "kernelMatrix",
        kernelunitlength: "kernelUnitLength",
        kerning: "kerning",
        keypoints: "keyPoints",
        keysplines: "keySplines",
        keytimes: "keyTimes",
        lengthadjust: "lengthAdjust",
        letterspacing: "letterSpacing",
        "letter-spacing": "letterSpacing",
        lightingcolor: "lightingColor",
        "lighting-color": "lightingColor",
        limitingconeangle: "limitingConeAngle",
        local: "local",
        markerend: "markerEnd",
        "marker-end": "markerEnd",
        markerheight: "markerHeight",
        markermid: "markerMid",
        "marker-mid": "markerMid",
        markerstart: "markerStart",
        "marker-start": "markerStart",
        markerunits: "markerUnits",
        markerwidth: "markerWidth",
        mask: "mask",
        maskcontentunits: "maskContentUnits",
        maskunits: "maskUnits",
        mathematical: "mathematical",
        mode: "mode",
        numoctaves: "numOctaves",
        offset: "offset",
        opacity: "opacity",
        operator: "operator",
        order: "order",
        orient: "orient",
        orientation: "orientation",
        origin: "origin",
        overflow: "overflow",
        overlineposition: "overlinePosition",
        "overline-position": "overlinePosition",
        overlinethickness: "overlineThickness",
        "overline-thickness": "overlineThickness",
        paintorder: "paintOrder",
        "paint-order": "paintOrder",
        panose1: "panose1",
        "panose-1": "panose1",
        pathlength: "pathLength",
        patterncontentunits: "patternContentUnits",
        patterntransform: "patternTransform",
        patternunits: "patternUnits",
        pointerevents: "pointerEvents",
        "pointer-events": "pointerEvents",
        points: "points",
        pointsatx: "pointsAtX",
        pointsaty: "pointsAtY",
        pointsatz: "pointsAtZ",
        prefix: "prefix",
        preservealpha: "preserveAlpha",
        preserveaspectratio: "preserveAspectRatio",
        primitiveunits: "primitiveUnits",
        property: "property",
        r: "r",
        radius: "radius",
        refx: "refX",
        refy: "refY",
        renderingintent: "renderingIntent",
        "rendering-intent": "renderingIntent",
        repeatcount: "repeatCount",
        repeatdur: "repeatDur",
        requiredextensions: "requiredExtensions",
        requiredfeatures: "requiredFeatures",
        resource: "resource",
        restart: "restart",
        result: "result",
        results: "results",
        rotate: "rotate",
        rx: "rx",
        ry: "ry",
        scale: "scale",
        security: "security",
        seed: "seed",
        shaperendering: "shapeRendering",
        "shape-rendering": "shapeRendering",
        slope: "slope",
        spacing: "spacing",
        specularconstant: "specularConstant",
        specularexponent: "specularExponent",
        speed: "speed",
        spreadmethod: "spreadMethod",
        startoffset: "startOffset",
        stddeviation: "stdDeviation",
        stemh: "stemh",
        stemv: "stemv",
        stitchtiles: "stitchTiles",
        stopcolor: "stopColor",
        "stop-color": "stopColor",
        stopopacity: "stopOpacity",
        "stop-opacity": "stopOpacity",
        strikethroughposition: "strikethroughPosition",
        "strikethrough-position": "strikethroughPosition",
        strikethroughthickness: "strikethroughThickness",
        "strikethrough-thickness": "strikethroughThickness",
        string: "string",
        stroke: "stroke",
        strokedasharray: "strokeDasharray",
        "stroke-dasharray": "strokeDasharray",
        strokedashoffset: "strokeDashoffset",
        "stroke-dashoffset": "strokeDashoffset",
        strokelinecap: "strokeLinecap",
        "stroke-linecap": "strokeLinecap",
        strokelinejoin: "strokeLinejoin",
        "stroke-linejoin": "strokeLinejoin",
        strokemiterlimit: "strokeMiterlimit",
        "stroke-miterlimit": "strokeMiterlimit",
        strokewidth: "strokeWidth",
        "stroke-width": "strokeWidth",
        strokeopacity: "strokeOpacity",
        "stroke-opacity": "strokeOpacity",
        suppresscontenteditablewarning: "suppressContentEditableWarning",
        suppresshydrationwarning: "suppressHydrationWarning",
        surfacescale: "surfaceScale",
        systemlanguage: "systemLanguage",
        tablevalues: "tableValues",
        targetx: "targetX",
        targety: "targetY",
        textanchor: "textAnchor",
        "text-anchor": "textAnchor",
        textdecoration: "textDecoration",
        "text-decoration": "textDecoration",
        textlength: "textLength",
        textrendering: "textRendering",
        "text-rendering": "textRendering",
        to: "to",
        transform: "transform",
        typeof: "typeof",
        u1: "u1",
        u2: "u2",
        underlineposition: "underlinePosition",
        "underline-position": "underlinePosition",
        underlinethickness: "underlineThickness",
        "underline-thickness": "underlineThickness",
        unicode: "unicode",
        unicodebidi: "unicodeBidi",
        "unicode-bidi": "unicodeBidi",
        unicoderange: "unicodeRange",
        "unicode-range": "unicodeRange",
        unitsperem: "unitsPerEm",
        "units-per-em": "unitsPerEm",
        unselectable: "unselectable",
        valphabetic: "vAlphabetic",
        "v-alphabetic": "vAlphabetic",
        values: "values",
        vectoreffect: "vectorEffect",
        "vector-effect": "vectorEffect",
        version: "version",
        vertadvy: "vertAdvY",
        "vert-adv-y": "vertAdvY",
        vertoriginx: "vertOriginX",
        "vert-origin-x": "vertOriginX",
        vertoriginy: "vertOriginY",
        "vert-origin-y": "vertOriginY",
        vhanging: "vHanging",
        "v-hanging": "vHanging",
        videographic: "vIdeographic",
        "v-ideographic": "vIdeographic",
        viewbox: "viewBox",
        viewtarget: "viewTarget",
        visibility: "visibility",
        vmathematical: "vMathematical",
        "v-mathematical": "vMathematical",
        vocab: "vocab",
        widths: "widths",
        wordspacing: "wordSpacing",
        "word-spacing": "wordSpacing",
        writingmode: "writingMode",
        "writing-mode": "writingMode",
        x1: "x1",
        x2: "x2",
        x: "x",
        xchannelselector: "xChannelSelector",
        xheight: "xHeight",
        "x-height": "xHeight",
        xlinkactuate: "xlinkActuate",
        "xlink:actuate": "xlinkActuate",
        xlinkarcrole: "xlinkArcrole",
        "xlink:arcrole": "xlinkArcrole",
        xlinkhref: "xlinkHref",
        "xlink:href": "xlinkHref",
        xlinkrole: "xlinkRole",
        "xlink:role": "xlinkRole",
        xlinkshow: "xlinkShow",
        "xlink:show": "xlinkShow",
        xlinktitle: "xlinkTitle",
        "xlink:title": "xlinkTitle",
        xlinktype: "xlinkType",
        "xlink:type": "xlinkType",
        xmlbase: "xmlBase",
        "xml:base": "xmlBase",
        xmllang: "xmlLang",
        "xml:lang": "xmlLang",
        xmlns: "xmlns",
        "xml:space": "xmlSpace",
        xmlnsxlink: "xmlnsXlink",
        "xmlns:xlink": "xmlnsXlink",
        xmlspace: "xmlSpace",
        y1: "y1",
        y2: "y2",
        y: "y",
        ychannelselector: "yChannelSelector",
        z: "z",
        zoomandpan: "zoomAndPan"
    }, ariaProperties = {
        "aria-current": 0,
        // state
        "aria-details": 0,
        "aria-disabled": 0,
        // state
        "aria-hidden": 0,
        // state
        "aria-invalid": 0,
        // state
        "aria-keyshortcuts": 0,
        "aria-label": 0,
        "aria-roledescription": 0,
        // Widget Attributes
        "aria-autocomplete": 0,
        "aria-checked": 0,
        "aria-expanded": 0,
        "aria-haspopup": 0,
        "aria-level": 0,
        "aria-modal": 0,
        "aria-multiline": 0,
        "aria-multiselectable": 0,
        "aria-orientation": 0,
        "aria-placeholder": 0,
        "aria-pressed": 0,
        "aria-readonly": 0,
        "aria-required": 0,
        "aria-selected": 0,
        "aria-sort": 0,
        "aria-valuemax": 0,
        "aria-valuemin": 0,
        "aria-valuenow": 0,
        "aria-valuetext": 0,
        // Live Region Attributes
        "aria-atomic": 0,
        "aria-busy": 0,
        "aria-live": 0,
        "aria-relevant": 0,
        // Drag-and-Drop Attributes
        "aria-dropeffect": 0,
        "aria-grabbed": 0,
        // Relationship Attributes
        "aria-activedescendant": 0,
        "aria-colcount": 0,
        "aria-colindex": 0,
        "aria-colspan": 0,
        "aria-controls": 0,
        "aria-describedby": 0,
        "aria-errormessage": 0,
        "aria-flowto": 0,
        "aria-labelledby": 0,
        "aria-owns": 0,
        "aria-posinset": 0,
        "aria-rowcount": 0,
        "aria-rowindex": 0,
        "aria-rowspan": 0,
        "aria-setsize": 0
    }, warnedProperties = {}, rARIA = RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$"), rARIACamel = RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$"), hasOwnProperty$1 = Object.prototype.hasOwnProperty, didWarnValueNull = !1, validateProperty$1 = function() {}, warnedProperties$1 = {}, _hasOwnProperty = Object.prototype.hasOwnProperty, EVENT_NAME_REGEX = /^on./, INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/, rARIA$1 = RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$"), rARIACamel$1 = RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
    validateProperty$1 = function(tagName, name, value, eventRegistry) {
        if (_hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) return !0;
        var lowerCasedName = name.toLowerCase();
        if ("onfocusin" === lowerCasedName || "onfocusout" === lowerCasedName) return error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), warnedProperties$1[name] = !0, !0;
         // We can't rely on the event system being injected on the server.
        if (null != eventRegistry) {
            var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
            if (registrationNameDependencies.hasOwnProperty(name)) return !0;
            var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
            if (null != registrationName) return error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName), warnedProperties$1[name] = !0, !0;
            if (EVENT_NAME_REGEX.test(name)) return error("Unknown event handler property `%s`. It will be ignored.", name), warnedProperties$1[name] = !0, !0;
        } else if (EVENT_NAME_REGEX.test(name)) return INVALID_EVENT_NAME_REGEX.test(name) && error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name), warnedProperties$1[name] = !0, !0;
         // Let the ARIA attribute hook validate ARIA attributes
        if (rARIA$1.test(name) || rARIACamel$1.test(name)) return !0;
        if ("innerhtml" === lowerCasedName) return error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), warnedProperties$1[name] = !0, !0;
        if ("aria" === lowerCasedName) return error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), warnedProperties$1[name] = !0, !0;
        if ("is" === lowerCasedName && null != value && "string" != typeof value) return error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value), warnedProperties$1[name] = !0, !0;
        if ("number" == typeof value && isNaN(value)) return error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name), warnedProperties$1[name] = !0, !0;
        var propertyInfo = getPropertyInfo(name), isReserved = null !== propertyInfo && 0 === propertyInfo.type;
        if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
            var standardName = possibleStandardNames[lowerCasedName];
            if (standardName !== name) return error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName), warnedProperties$1[name] = !0, !0;
        } else if (!isReserved && name !== lowerCasedName) return(// Unknown attributes should have lowercase casing since that's how they
        // will be cased anyway with server rendering.
        error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName), warnedProperties$1[name] = !0, !0);
        return "boolean" == typeof value && shouldRemoveAttributeWithWarning(name, value, propertyInfo, !1) ? (value ? error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name) : error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name), warnedProperties$1[name] = !0, !0) : !!isReserved || (shouldRemoveAttributeWithWarning(name, value, propertyInfo, !1) ? (warnedProperties$1[name] = !0, !1) : (("false" === value || "true" === value) && null !== propertyInfo && 3 === propertyInfo.type && (error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, "false" === value ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value), warnedProperties$1[name] = !0), !0)) // Now that we've validated casing, do not validate
        ;
    };
    var warnUnknownProperties = function(type, props, eventRegistry) {
        var unknownProps = [];
        for(var key in props)validateProperty$1(type, key, props[key], eventRegistry) || unknownProps.push(key);
        var unknownPropString = unknownProps.map(function(prop) {
            return "`" + prop + "`";
        }).join(", ");
        1 === unknownProps.length ? error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type) : unknownProps.length > 1 && error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
    };
    /**
   * Gets the target node from a native browser event by accounting for
   * inconsistencies in browser DOM APIs.
   *
   * @param {object} nativeEvent Native browser event.
   * @return {DOMEventTarget} Target node.
   */ function getEventTarget(nativeEvent) {
        // Fallback to nativeEvent.srcElement for IE9
        // https://github.com/facebook/react/issues/12506
        var target = nativeEvent.target || nativeEvent.srcElement || window; // Normalize SVG <use> element events #4963
        // @see http://www.quirksmode.org/js/events_properties.html
        return target.correspondingUseElement && (target = target.correspondingUseElement), 3 === target.nodeType ? target.parentNode : target;
    }
    var restoreImpl = null, restoreTarget = null, restoreQueue = null;
    function restoreStateOfTarget(target) {
        // We perform this translation at the end of the event loop so that we
        // always receive the correct fiber here
        var internalInstance = getInstanceFromNode(target);
        if (internalInstance) {
            if ("function" != typeof restoreImpl) throw Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
            var stateNode = internalInstance.stateNode; // Guard against Fiber being unmounted.
            if (stateNode) {
                var _props = getFiberCurrentPropsFromNode(stateNode);
                restoreImpl(internalInstance.stateNode, internalInstance.type, _props);
            }
        }
    }
    function enqueueStateRestore(target) {
        restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [
            target
        ] : restoreTarget = target;
    }
    function restoreStateIfNeeded() {
        if (restoreTarget) {
            var target = restoreTarget, queuedTargets = restoreQueue;
            if (restoreTarget = null, restoreQueue = null, restoreStateOfTarget(target), queuedTargets) for(var i = 0; i < queuedTargets.length; i++)restoreStateOfTarget(queuedTargets[i]);
        }
    }
    // the renderer. Such as when we're dispatching events or if third party
    // libraries need to call batchedUpdates. Eventually, this API will go away when
    // everything is batched by default. We'll then have a similar API to opt-out of
    // scheduled work and instead do synchronous work.
    // Defaults
    var batchedUpdatesImpl = function(fn, bookkeeping) {
        return fn(bookkeeping);
    }, discreteUpdatesImpl = function(fn, a, b, c, d) {
        return fn(a, b, c, d);
    }, flushDiscreteUpdatesImpl = function() {}, batchedEventUpdatesImpl = batchedUpdatesImpl, isInsideEventHandler = !1, isBatchingEventUpdates = !1;
    function finishEventHandler() {
        (null !== restoreTarget || null !== restoreQueue) && (// If a controlled event was fired, we may need to restore the state of
        // the DOM node back to the controlled value. This is necessary when React
        // bails out of the update without touching the DOM.
        flushDiscreteUpdatesImpl(), restoreStateIfNeeded());
    }
    /**
   * @param {object} inst The instance, which is the source of events.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */ function getListener(inst, registrationName) {
        var stateNode = inst.stateNode;
        if (null === stateNode) // Work in progress (ex: onload events in incremental mode).
        return null;
        var props = getFiberCurrentPropsFromNode(stateNode);
        if (null === props) // Work in progress.
        return null;
        var listener = props[registrationName];
        if (function(name, type, props) {
            switch(name){
                case "onClick":
                case "onClickCapture":
                case "onDoubleClick":
                case "onDoubleClickCapture":
                case "onMouseDown":
                case "onMouseDownCapture":
                case "onMouseMove":
                case "onMouseMoveCapture":
                case "onMouseUp":
                case "onMouseUpCapture":
                case "onMouseEnter":
                    return !!(props.disabled && ("button" === type || "input" === type || "select" === type || "textarea" === type));
                default:
                    return !1;
            }
        }(registrationName, inst.type, props)) return null;
        if (!(!listener || "function" == typeof listener)) throw Error("Expected `" + registrationName + "` listener to be a function, instead got a value of `" + typeof listener + "` type.");
        return listener;
    }
    var passiveBrowserEventsSupported = !1; // Check if browser support events with passive listeners
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
    if (canUseDOM) try {
        var options = {}; // $FlowFixMe: Ignore Flow complaining about needing a value
        Object.defineProperty(options, "passive", {
            get: function() {
                passiveBrowserEventsSupported = !0;
            }
        }), window.addEventListener("test", options, options), window.removeEventListener("test", options, options);
    } catch (e) {
        passiveBrowserEventsSupported = !1;
    }
    function invokeGuardedCallbackProd(name, func, context, a, b, c, d, e, f) {
        var funcArgs = Array.prototype.slice.call(arguments, 3);
        try {
            func.apply(context, funcArgs);
        } catch (error) {
            this.onError(error);
        }
    }
    var invokeGuardedCallbackImpl = invokeGuardedCallbackProd;
    // In DEV mode, we swap out invokeGuardedCallback for a special version
    // that plays more nicely with the browser's DevTools. The idea is to preserve
    // "Pause on exceptions" behavior. Because React wraps all user-provided
    // functions in invokeGuardedCallback, and the production version of
    // invokeGuardedCallback uses a try-catch, all user exceptions are treated
    // like caught exceptions, and the DevTools won't pause unless the developer
    // takes the extra step of enabling pause on caught exceptions. This is
    // unintuitive, though, because even though React has caught the error, from
    // the developer's perspective, the error is uncaught.
    //
    // To preserve the expected "Pause on exceptions" behavior, we don't use a
    // try-catch in DEV. Instead, we synchronously dispatch a fake event to a fake
    // DOM node, and call the user-provided callback from inside an event handler
    // for that fake event. If the callback throws, the error is "captured" using
    // a global event handler. But because the error happens in a different
    // event loop context, it does not interrupt the normal program flow.
    // Effectively, this gives us try-catch behavior without actually using
    // try-catch. Neat!
    // Check that the browser supports the APIs we need to implement our special
    // DEV version of invokeGuardedCallback
    if ("undefined" != typeof window && "function" == typeof window.dispatchEvent && "undefined" != typeof document && "function" == typeof document.createEvent) {
        var fakeNode = document.createElement("react");
        invokeGuardedCallbackImpl = function(name, func, context, a, b, c, d, e, f) {
            // If document doesn't exist we know for sure we will crash in this method
            // when we call document.createEvent(). However this can cause confusing
            // errors: https://github.com/facebookincubator/create-react-app/issues/3482
            // So we preemptively throw with a better message instead.
            if (!("undefined" != typeof document)) throw Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
            var error, evt = document.createEvent("Event"), didCall = !1, didError = !0, windowEvent = window.event, windowEventDescriptor = Object.getOwnPropertyDescriptor(window, "event");
            function restoreAfterDispatch() {
                // We immediately remove the callback from event listeners so that
                // nested `invokeGuardedCallback` calls do not clash. Otherwise, a
                // nested call would trigger the fake event handlers of any call higher
                // in the stack.
                fakeNode.removeEventListener(evtType, callCallback, !1), void 0 !== window.event && window.hasOwnProperty("event") && (window.event = windowEvent);
            } // Create an event handler for our fake event. We will synchronously
            // dispatch our fake event using `dispatchEvent`. Inside the handler, we
            // call the user-provided callback.
            var funcArgs = Array.prototype.slice.call(arguments, 3);
            function callCallback() {
                didCall = !0, restoreAfterDispatch(), func.apply(context, funcArgs), didError = !1;
            } // Create a global error event handler. We use this to capture the value
            var didSetError = !1, isCrossOriginError = !1;
            function handleWindowError(event) {
                if (error = event.error, didSetError = !0, null === error && 0 === event.colno && 0 === event.lineno && (isCrossOriginError = !0), event.defaultPrevented && null != error && "object" == typeof error) try {
                    error._suppressLogging = !0;
                } catch (inner) {
                // Ignore.
                }
            } // Create a fake event type.
            var evtType = "react-" + (name || "invokeguardedcallback"); // Attach our event handlers
            if (window.addEventListener("error", handleWindowError), fakeNode.addEventListener(evtType, callCallback, !1), // errors, it will trigger our global error handler.
            evt.initEvent(evtType, !1, !1), fakeNode.dispatchEvent(evt), windowEventDescriptor && Object.defineProperty(window, "event", windowEventDescriptor), didCall && didError && (didSetError ? isCrossOriginError && (error = Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : // The callback errored, but the error event never fired.
            error = Error("An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the \"Pause on exceptions\" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue."), this.onError(error)), window.removeEventListener("error", handleWindowError), !didCall) return(// Something went really wrong, and our event was not dispatched.
            // https://github.com/facebook/react/issues/16734
            // https://github.com/facebook/react/issues/16585
            // Fall back to the production implementation.
            restoreAfterDispatch(), invokeGuardedCallbackProd.apply(this, arguments));
        };
    }
    var invokeGuardedCallbackImpl$1 = invokeGuardedCallbackImpl, hasError = !1, caughtError = null, hasRethrowError = !1, rethrowError = null, reporter = {
        onError: function(error) {
            hasError = !0, caughtError = error;
        }
    };
    /**
   * Call a function while guarding against errors that happens within it.
   * Returns an error if it throws, otherwise null.
   *
   * In production, this is implemented using a try-catch. The reason we don't
   * use a try-catch directly is so that we can swap out a different
   * implementation in DEV mode.
   *
   * @param {String} name of the guard to use for logging or debugging
   * @param {Function} func The function to invoke
   * @param {*} context The context to use when calling the function
   * @param {...*} args Arguments for function
   */ function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {
        hasError = !1, caughtError = null, invokeGuardedCallbackImpl$1.apply(reporter, arguments);
    }
    function clearCaughtError() {
        if (hasError) {
            var error = caughtError;
            return hasError = !1, caughtError = null, error;
        }
        throw Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    var _ReactInternals$Sched = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Scheduler, unstable_cancelCallback = _ReactInternals$Sched.unstable_cancelCallback, unstable_now = _ReactInternals$Sched.unstable_now, unstable_scheduleCallback = _ReactInternals$Sched.unstable_scheduleCallback, unstable_shouldYield = _ReactInternals$Sched.unstable_shouldYield, unstable_requestPaint = _ReactInternals$Sched.unstable_requestPaint, unstable_runWithPriority = (_ReactInternals$Sched.unstable_getFirstCallbackNode, _ReactInternals$Sched.unstable_runWithPriority), unstable_getCurrentPriorityLevel = (_ReactInternals$Sched.unstable_next, _ReactInternals$Sched.unstable_continueExecution, _ReactInternals$Sched.unstable_pauseExecution, _ReactInternals$Sched.unstable_getCurrentPriorityLevel), unstable_ImmediatePriority = _ReactInternals$Sched.unstable_ImmediatePriority, unstable_UserBlockingPriority = _ReactInternals$Sched.unstable_UserBlockingPriority, unstable_NormalPriority = _ReactInternals$Sched.unstable_NormalPriority, unstable_LowPriority = _ReactInternals$Sched.unstable_LowPriority, unstable_IdlePriority = _ReactInternals$Sched.unstable_IdlePriority, unstable_flushAllWithoutAsserting = (_ReactInternals$Sched.unstable_forceFrameRate, _ReactInternals$Sched.unstable_flushAllWithoutAsserting);
    /**
   * `ReactInstanceMap` maintains a mapping from a public facing stateful
   * instance (key) and the internal representation (value). This allows public
   * methods to accept the user facing instance as an argument and map them back
   * to internal methods.
   *
   * Note that this module is currently shared and assumed to be stateless.
   * If this becomes an actual Map, that will break.
   */ function get(key) {
        return key._reactInternals;
    }
    var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
    function getNearestMountedFiber(fiber) {
        var node = fiber, nearestMounted = fiber;
        if (fiber.alternate) for(; node.return;)node = node.return;
        else {
            // If there is no alternate, this might be a new tree that isn't inserted
            // yet. If it is, then it will have a pending insertion effect on it.
            var nextNode = node;
            do (1026 & (node = nextNode).flags) != /*                      */ 0 && // This is an insertion or in-progress hydration. The nearest possible
            // mounted fiber is the parent but we need to continue to figure out
            // if that one is still mounted.
            (nearestMounted = node.return), nextNode = node.return;
            while (nextNode)
        }
        return 3 === node.tag ? nearestMounted : null // If we didn't hit the root, that means that we're in an disconnected tree
        ;
    }
    function getSuspenseInstanceFromFiber(fiber) {
        if (13 === fiber.tag) {
            var suspenseState = fiber.memoizedState;
            if (null === suspenseState) {
                var current = fiber.alternate;
                null !== current && (suspenseState = current.memoizedState);
            }
            if (null !== suspenseState) return suspenseState.dehydrated;
        }
        return null;
    }
    function getContainerFromFiber(fiber) {
        return 3 === fiber.tag ? fiber.stateNode.containerInfo : null;
    }
    function assertIsMounted(fiber) {
        if (getNearestMountedFiber(fiber) !== fiber) throw Error("Unable to find node on an unmounted component.");
    }
    function findCurrentFiberUsingSlowPath(fiber) {
        var alternate = fiber.alternate;
        if (!alternate) {
            // If there is no alternate, then we only need to check if it is mounted.
            var nearestMounted = getNearestMountedFiber(fiber);
            if (!(null !== nearestMounted)) throw Error("Unable to find node on an unmounted component.");
            return nearestMounted !== fiber ? null : fiber;
        } // If we have two possible branches, we'll walk backwards up to the root
        for(// to see what path the root points to. On the way we may hit one of the
        // special cases and we'll deal with them.
        var a = fiber, b = alternate;;){
            var parentA = a.return;
            if (null === parentA) break;
            var parentB = parentA.alternate;
            if (null === parentB) {
                // There is no alternate. This is an unusual case. Currently, it only
                // happens when a Suspense component is hidden. An extra fragment fiber
                // is inserted in between the Suspense fiber and its children. Skip
                // over this extra fragment fiber and proceed to the next parent.
                var nextParent = parentA.return;
                if (null !== nextParent) {
                    a = b = nextParent;
                    continue;
                } // If there's no parent, we're at the root.
                break;
            } // If both copies of the parent fiber point to the same child, we can
            // assume that the child is current. This happens when we bailout on low
            // priority: the bailed out fiber's child reuses the current child.
            if (parentA.child === parentB.child) {
                for(var child = parentA.child; child;){
                    if (child === a) return(// We've determined that A is the current branch.
                    assertIsMounted(parentA), fiber);
                    if (child === b) return(// We've determined that B is the current branch.
                    assertIsMounted(parentA), alternate);
                    child = child.sibling;
                } // We should never have an alternate for any mounting node. So the only
                throw Error("Unable to find node on an unmounted component.");
            }
            if (a.return !== b.return) // The return pointer of A and the return pointer of B point to different
            // fibers. We assume that return pointers never criss-cross, so A must
            // belong to the child set of A.return, and B must belong to the child
            // set of B.return.
            a = parentA, b = parentB;
            else {
                for(// The return pointers point to the same fiber. We'll have to use the
                // default, slow path: scan the child sets of each parent alternate to see
                // which child belongs to which set.
                //
                // Search parent A's child set
                var didFindChild = !1, _child = parentA.child; _child;){
                    if (_child === a) {
                        didFindChild = !0, a = parentA, b = parentB;
                        break;
                    }
                    if (_child === b) {
                        didFindChild = !0, b = parentA, a = parentB;
                        break;
                    }
                    _child = _child.sibling;
                }
                if (!didFindChild) {
                    for(// Search parent B's child set
                    _child = parentB.child; _child;){
                        if (_child === a) {
                            didFindChild = !0, a = parentB, b = parentA;
                            break;
                        }
                        if (_child === b) {
                            didFindChild = !0, b = parentB, a = parentA;
                            break;
                        }
                        _child = _child.sibling;
                    }
                    if (!didFindChild) throw Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
                }
            }
            if (a.alternate !== b) throw Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
        } // If the root is not a host container, we're in a disconnected tree. I.e.
        // unmounted.
        if (3 !== a.tag) throw Error("Unable to find node on an unmounted component.");
        return a.stateNode.current === a ? fiber : alternate // Otherwise B has to be current branch.
        ;
    }
    function findCurrentHostFiber(parent) {
        var currentParent = findCurrentFiberUsingSlowPath(parent);
        if (!currentParent) return null;
         // Next we'll drill down this component to find the first HostComponent/Text.
        for(var node = currentParent;;){
            if (5 === node.tag || 6 === node.tag) return node;
            if (node.child) {
                node.child.return = node, node = node.child;
                continue;
            }
            if (node === currentParent) break;
            for(; !node.sibling;){
                if (!node.return || node.return === currentParent) return null;
                node = node.return;
            }
            node.sibling.return = node.return, node = node.sibling;
        } // Flow needs the return null here, but ESLint complains about it.
        // eslint-disable-next-line no-unreachable
        return null;
    }
    function doesFiberContain(parentFiber, childFiber) {
        for(var node = childFiber, parentFiberAlternate = parentFiber.alternate; null !== node;){
            if (node === parentFiber || node === parentFiberAlternate) return !0;
            node = node.return;
        }
        return !1;
    }
    var hasScheduledReplayAttempt = !1, queuedDiscreteEvents = [], queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = new Map(), queuedPointerCaptures = new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = [
        "mousedown",
        "mouseup",
        "touchcancel",
        "touchend",
        "touchstart",
        "auxclick",
        "dblclick",
        "pointercancel",
        "pointerdown",
        "pointerup",
        "dragend",
        "dragstart",
        "drop",
        "compositionend",
        "compositionstart",
        "keydown",
        "keypress",
        "keyup",
        "input",
        "textInput",
        "copy",
        "cut",
        "paste",
        "click",
        "change",
        "contextmenu",
        "reset",
        "submit"
    ]; // The queue of discrete events to be replayed.
    function isReplayableDiscreteEvent(eventType) {
        return discreteReplayableEvents.indexOf(eventType) > -1;
    }
    function createQueuedReplayableEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        return {
            blockedOn: blockedOn,
            domEventName: domEventName,
            eventSystemFlags: 16 | eventSystemFlags,
            nativeEvent: nativeEvent,
            targetContainers: [
                targetContainer
            ]
        };
    }
    function queueDiscreteEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        var queuedEvent = createQueuedReplayableEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent);
        queuedDiscreteEvents.push(queuedEvent);
    } // Resets the replaying for this type of continuous event to no event.
    function clearIfContinuousEvent(domEventName, nativeEvent) {
        switch(domEventName){
            case "focusin":
            case "focusout":
                queuedFocus = null;
                break;
            case "dragenter":
            case "dragleave":
                queuedDrag = null;
                break;
            case "mouseover":
            case "mouseout":
                queuedMouse = null;
                break;
            case "pointerover":
            case "pointerout":
                var pointerId = nativeEvent.pointerId;
                queuedPointers.delete(pointerId);
                break;
            case "gotpointercapture":
            case "lostpointercapture":
                var _pointerId = nativeEvent.pointerId;
                queuedPointerCaptures.delete(_pointerId);
        }
    }
    function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent) {
            var queuedEvent = createQueuedReplayableEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent);
            if (null !== blockedOn) {
                var _fiber2 = getInstanceFromNode(blockedOn);
                null !== _fiber2 && // Attempt to increase the priority of this target.
                attemptContinuousHydration(_fiber2);
            }
            return queuedEvent;
        } // If we have already queued this exact event, then it's because
        // the different event systems have different DOM event listeners.
        // We can accumulate the flags, and the targetContainers, and
        // store a single event to be replayed.
        existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
        var targetContainers = existingQueuedEvent.targetContainers;
        return null !== targetContainer && -1 === targetContainers.indexOf(targetContainer) && targetContainers.push(targetContainer), existingQueuedEvent;
    }
    function attemptReplayContinuousQueuedEvent(queuedEvent) {
        if (null !== queuedEvent.blockedOn) return !1;
        for(var targetContainers = queuedEvent.targetContainers; targetContainers.length > 0;){
            var targetContainer = targetContainers[0], nextBlockedOn = attemptToDispatchEvent(queuedEvent.domEventName, queuedEvent.eventSystemFlags, targetContainer, queuedEvent.nativeEvent);
            if (null !== nextBlockedOn) {
                // We're still blocked. Try again later.
                var _fiber3 = getInstanceFromNode(nextBlockedOn);
                return null !== _fiber3 && attemptContinuousHydration(_fiber3), queuedEvent.blockedOn = nextBlockedOn, !1;
            } // This target container was successfully dispatched. Try the next.
            targetContainers.shift();
        }
        return !0;
    }
    function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
        attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
    }
    function replayUnblockedEvents() {
        for(hasScheduledReplayAttempt = !1; queuedDiscreteEvents.length > 0;){
            var nextDiscreteEvent = queuedDiscreteEvents[0];
            if (null !== nextDiscreteEvent.blockedOn) {
                // We're still blocked.
                // Increase the priority of this boundary to unblock
                // the next discrete event.
                var _fiber4 = getInstanceFromNode(nextDiscreteEvent.blockedOn);
                null !== _fiber4 && attemptUserBlockingHydration(_fiber4);
                break;
            }
            for(var targetContainers = nextDiscreteEvent.targetContainers; targetContainers.length > 0;){
                var targetContainer = targetContainers[0], nextBlockedOn = attemptToDispatchEvent(nextDiscreteEvent.domEventName, nextDiscreteEvent.eventSystemFlags, targetContainer, nextDiscreteEvent.nativeEvent);
                if (null !== nextBlockedOn) {
                    // We're still blocked. Try again later.
                    nextDiscreteEvent.blockedOn = nextBlockedOn;
                    break;
                } // This target container was successfully dispatched. Try the next.
                targetContainers.shift();
            }
            null === nextDiscreteEvent.blockedOn && // We've successfully replayed the first event. Let's try the next one.
            queuedDiscreteEvents.shift();
        } // Next replay any continuous events.
        null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null), null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null), null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null), queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap), queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
    }
    function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
        queuedEvent.blockedOn !== unblocked || (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = !0, // now unblocked. This first might not actually be unblocked yet.
        // We could check it early to avoid scheduling an unnecessary callback.
        unstable_scheduleCallback(unstable_NormalPriority, replayUnblockedEvents)));
    }
    function retryIfBlockedOn(unblocked) {
        // Mark anything that was blocked on this as no longer blocked
        // and eligible for a replay.
        if (queuedDiscreteEvents.length > 0) {
            scheduleCallbackIfUnblocked(queuedDiscreteEvents[0], unblocked); // This is a exponential search for each boundary that commits. I think it's
            // worth it because we expect very few discrete events to queue up and once
            // we are actually fully unblocked it will be fast to replay them.
            for(var i = 1; i < queuedDiscreteEvents.length; i++){
                var queuedEvent = queuedDiscreteEvents[i];
                queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null);
            }
        }
        null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked), null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked), null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
        var unblock = function(queuedEvent) {
            return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
        };
        queuedPointers.forEach(unblock), queuedPointerCaptures.forEach(unblock);
        for(var _i = 0; _i < queuedExplicitHydrationTargets.length; _i++){
            var queuedTarget = queuedExplicitHydrationTargets[_i];
            queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
        }
        for(; queuedExplicitHydrationTargets.length > 0;){
            var nextExplicitTarget = queuedExplicitHydrationTargets[0];
            if (null !== nextExplicitTarget.blockedOn) break;
            !function(queuedTarget) {
                // TODO: This function shares a lot of logic with attemptToDispatchEvent.
                // Try to unify them. It's a bit tricky since it would require two return
                // values.
                var targetInst = getClosestInstanceFromNode(queuedTarget.target);
                if (null !== targetInst) {
                    var nearestMounted = getNearestMountedFiber(targetInst);
                    if (null !== nearestMounted) {
                        var tag = nearestMounted.tag;
                        if (13 === tag) {
                            var instance = getSuspenseInstanceFromFiber(nearestMounted);
                            if (null !== instance) {
                                // We're blocked on hydrating this boundary.
                                // Increase its priority.
                                queuedTarget.blockedOn = instance, attemptHydrationAtPriority(queuedTarget.lanePriority, function() {
                                    unstable_runWithPriority(queuedTarget.priority, function() {
                                        attemptHydrationAtCurrentPriority(nearestMounted);
                                    });
                                });
                                return;
                            }
                        } else if (3 === tag && nearestMounted.stateNode.hydrate) {
                            queuedTarget.blockedOn = getContainerFromFiber(nearestMounted); // We don't currently have a way to increase the priority of
                            // a root other than sync.
                            return;
                        }
                    }
                }
                queuedTarget.blockedOn = null;
            }(nextExplicitTarget), null === nextExplicitTarget.blockedOn && // We're unblocked.
            queuedExplicitHydrationTargets.shift();
        }
    }
    /**
   * Generate a mapping of standard vendor prefixes using the defined style property and event name.
   *
   * @param {string} styleProp
   * @param {string} eventName
   * @returns {object}
   */ function makePrefixMap(styleProp, eventName) {
        var prefixes = {};
        return prefixes[styleProp.toLowerCase()] = eventName.toLowerCase(), prefixes["Webkit" + styleProp] = "webkit" + eventName, prefixes["Moz" + styleProp] = "moz" + eventName, prefixes;
    }
    /**
   * A list of event names to a configurable list of vendor prefixes.
   */ var vendorPrefixes = {
        animationend: makePrefixMap("Animation", "AnimationEnd"),
        animationiteration: makePrefixMap("Animation", "AnimationIteration"),
        animationstart: makePrefixMap("Animation", "AnimationStart"),
        transitionend: makePrefixMap("Transition", "TransitionEnd")
    }, prefixedEventNames = {}, style = {};
    /**
   * Attempts to determine the correct vendor prefixed event name.
   *
   * @param {string} eventName
   * @returns {string}
   */ function getVendorPrefixedEventName(eventName) {
        if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
        if (!vendorPrefixes[eventName]) return eventName;
        var prefixMap = vendorPrefixes[eventName];
        for(var styleProp in prefixMap)if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) return prefixedEventNames[eventName] = prefixMap[styleProp];
        return eventName;
    }
    !canUseDOM || (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
    var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = new Map(), eventPriorities = new Map();
    /**
   * Turns
   * ['abort', ...]
   *
   * into
   *
   * topLevelEventsToReactNames = new Map([
   *   ['abort', 'onAbort'],
   * ]);
   *
   * and registers them.
   */ function registerSimplePluginEventsAndSetTheirPriorities(eventTypes, priority) {
        // As the event types are in pairs of two, we need to iterate
        // through in twos. The events are in pairs of two to save code
        // and improve init perf of processing this array, as it will
        // result in far fewer object allocations and property accesses
        // if we only use three arrays to process all the categories of
        // instead of tuples.
        for(var i = 0; i < eventTypes.length; i += 2){
            var topEvent = eventTypes[i], event = eventTypes[i + 1], reactName = "on" + (event[0].toUpperCase() + event.slice(1));
            eventPriorities.set(topEvent, priority), topLevelEventsToReactNames.set(topEvent, reactName), registerTwoPhaseEvent(reactName, [
                topEvent
            ]);
        }
    }
    var _ReactInternals$Sched$1 = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.SchedulerTracing, __interactionsRef = _ReactInternals$Sched$1.__interactionsRef, __subscriberRef = _ReactInternals$Sched$1.__subscriberRef, unstable_getThreadID = (_ReactInternals$Sched$1.unstable_clear, _ReactInternals$Sched$1.unstable_getCurrent, _ReactInternals$Sched$1.unstable_getThreadID), unstable_wrap = (_ReactInternals$Sched$1.unstable_subscribe, _ReactInternals$Sched$1.unstable_trace, _ReactInternals$Sched$1.unstable_unsubscribe, _ReactInternals$Sched$1.unstable_wrap);
    // Provide explicit error message when production+profiling bundle of e.g.
    // react-dom is used with production (non-profiling) bundle of
    // scheduler/tracing
    if (!(null != __interactionsRef && null != __interactionsRef.current)) throw Error("It is not supported to run the profiling version of a renderer (for example, `react-dom/profiling`) without also replacing the `scheduler/tracing` module with `scheduler/tracing-profiling`. Your bundler might have a setting for aliasing both modules. Learn more at https://reactjs.org/link/profiling");
    unstable_now();
    // Used by getHighestPriorityLanes and getNextLanes:
    var return_highestLanePriority = 8;
    function getHighestPriorityLanes(lanes) {
        if ((/*                        */ 1 & lanes) != /*                        */ 0) return return_highestLanePriority = 15, 1;
        if ((/*                 */ 2 & lanes) != 0) return return_highestLanePriority = 14, 2;
        if ((/*      */ 4 & lanes) != 0) return return_highestLanePriority = 13, 4;
        var inputDiscreteLanes = /*                    */ 24 & lanes;
        if (0 !== inputDiscreteLanes) return return_highestLanePriority = 12, inputDiscreteLanes;
        if ((/*           */ 32 & lanes) != 0) return return_highestLanePriority = 11, 32;
        var inputContinuousLanes = /*                  */ 192 & lanes;
        if (0 !== inputContinuousLanes) return return_highestLanePriority = 10, inputContinuousLanes;
        if ((/*            */ 256 & lanes) != 0) return return_highestLanePriority = 9, 256;
        var defaultLanes = /*                   */ 3584 & lanes;
        if (0 !== defaultLanes) return return_highestLanePriority = 8, defaultLanes;
        if ((/*                */ 4096 & lanes) != 0) return return_highestLanePriority = 7, 4096;
        var transitionLanes = /*                       */ 4186112 & lanes;
        if (0 !== transitionLanes) return return_highestLanePriority = 6, transitionLanes;
        var retryLanes = /*                            */ 62914560 & lanes;
        if (0 !== retryLanes) return return_highestLanePriority = 5, retryLanes;
        if (/*          */ 67108864 & lanes) return return_highestLanePriority = 4, 67108864;
        if ((/*               */ 134217728 & lanes) != 0) return return_highestLanePriority = 3, 134217728;
        var idleLanes = /*                             */ 805306368 & lanes;
        return 0 !== idleLanes ? (return_highestLanePriority = 2, idleLanes) : (/*                   */ 1073741824 & lanes) != 0 ? (return_highestLanePriority = 1, 1073741824) : (error("Should have found matching lanes. This is a bug in React."), return_highestLanePriority = 8, lanes);
    }
    function getNextLanes(root, wipLanes) {
        // Early bailout if there's no pending work left.
        var index, pendingLanes = root.pendingLanes;
        if (0 === pendingLanes) return return_highestLanePriority = 0, 0;
        var nextLanes = 0, nextLanePriority = 0, expiredLanes = root.expiredLanes, suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes;
        if (0 !== expiredLanes) nextLanes = expiredLanes, nextLanePriority = return_highestLanePriority = 15;
        else {
            // Do not work on any idle work until all the non-idle work has finished,
            // even if the work is suspended.
            var nonIdlePendingLanes = /*                                 */ 134217727 & pendingLanes;
            if (0 !== nonIdlePendingLanes) {
                var nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;
                if (0 !== nonIdleUnblockedLanes) nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes), nextLanePriority = return_highestLanePriority;
                else {
                    var nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;
                    0 !== nonIdlePingedLanes && (nextLanes = getHighestPriorityLanes(nonIdlePingedLanes), nextLanePriority = return_highestLanePriority);
                }
            } else {
                // The only remaining work is Idle.
                var unblockedLanes = pendingLanes & ~suspendedLanes;
                0 !== unblockedLanes ? (nextLanes = getHighestPriorityLanes(unblockedLanes), nextLanePriority = return_highestLanePriority) : 0 !== pingedLanes && (nextLanes = getHighestPriorityLanes(pingedLanes), nextLanePriority = return_highestLanePriority);
            }
        }
        if (0 === nextLanes) // This should only be reachable if we're suspended
        // TODO: Consider warning in this path if a fallback timer is not scheduled.
        return 0;
         // If there are higher priority lanes, we'll include them even if they
        // it and we'll lose our progress. We should only do this if the new lanes are
        // higher priority.
        if (// are suspended.
        nextLanes = pendingLanes & (((index = 31 - clz32(nextLanes)) < 0 ? 0 : 1 << index) << 1) - 1, 0 !== wipLanes && wipLanes !== nextLanes && // If we already suspended with a delay, then interrupting is fine. Don't
        // bother waiting until the root is complete.
        (wipLanes & suspendedLanes) == 0) {
            if (getHighestPriorityLanes(wipLanes), nextLanePriority <= return_highestLanePriority) return wipLanes;
            return_highestLanePriority = nextLanePriority;
        } // Check for entangled lanes and add them to the batch.
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
        var entangledLanes = root.entangledLanes;
        if (0 !== entangledLanes) for(var entanglements = root.entanglements, lanes = nextLanes & entangledLanes; lanes > 0;){
            var index1 = pickArbitraryLaneIndex(lanes), lane = 1 << index1;
            nextLanes |= entanglements[index1], lanes &= ~lane;
        }
        return nextLanes;
    }
    function getLanesToRetrySynchronouslyOnError(root) {
        var everythingButOffscreen = -1073741825 & root.pendingLanes;
        return 0 !== everythingButOffscreen ? everythingButOffscreen : 1073741824 & everythingButOffscreen ? 1073741824 : 0;
    }
    function includesNonIdleWork(lanes) {
        return (134217727 & lanes) != 0;
    }
    function includesOnlyRetries(lanes) {
        return (62914560 & lanes) === lanes;
    }
    // be a pure function, so that it always returns the same lane for given inputs.
    function findUpdateLane(lanePriority, wipLanes) {
        switch(lanePriority){
            case 0:
            case 6:
            case 5:
                break;
            case 15:
                return 1;
            case 14:
                return 2;
            case 12:
                var _lane = pickArbitraryLane(24 & ~wipLanes);
                if (/*                          */ 0 === _lane) // Shift to the next priority level
                return findUpdateLane(10, wipLanes);
                return _lane;
            case 10:
                var _lane2 = pickArbitraryLane(192 & ~wipLanes);
                if (0 === _lane2) // Shift to the next priority level
                return findUpdateLane(8, wipLanes);
                return _lane2;
            case 8:
                var _lane3 = pickArbitraryLane(3584 & ~wipLanes);
                return 0 === _lane3 && 0 === // If all the default lanes are already being worked on, look for a
                // lane in the transition range.
                (_lane3 = pickArbitraryLane(4186112 & ~wipLanes)) && // All the transition lanes are taken, too. This should be very
                // rare, but as a last resort, pick a default lane. This will have
                // the effect of interrupting the current work-in-progress render.
                (_lane3 = pickArbitraryLane(3584)), _lane3;
            case 2:
                var lane = pickArbitraryLane(805306368 & ~wipLanes);
                return 0 === lane && (lane = pickArbitraryLane(805306368)), lane;
        }
        throw Error("Invalid update priority: " + lanePriority + ". This is a bug in React.");
    } // To ensure consistency across multiple updates in the same event, this should
    function pickArbitraryLane(lanes) {
        // This wrapper function gets inlined. Only exists so to communicate that it
        // doesn't matter which bit is selected; you can pick any bit without
        // affecting the algorithms where its used. Here I'm using
        // getHighestPriorityLane because it requires the fewest operations.
        return lanes & -lanes;
    }
    function pickArbitraryLaneIndex(lanes) {
        return 31 - clz32(lanes);
    }
    function includesSomeLane(a, b) {
        return (a & b) != 0;
    }
    function createLaneMap(initial) {
        for(var laneMap = [], i = 0; i < 31; i++)laneMap.push(initial);
        return laneMap;
    }
    function markRootUpdated(root, updateLane, eventTime) {
        root.pendingLanes |= updateLane;
        // it's not practical to try every single possible combination. We need a
        // heuristic to decide which lanes to attempt to render, and in which batches.
        // For now, we use the same heuristic as in the old ExpirationTimes model:
        // retry any lane at equal or lower priority, but don't try updates at higher
        // priority without also including the lower priority updates. This works well
        // when considering updates across different priority levels, but isn't
        // sufficient for updates within the same priority, since we want to treat
        // those updates as parallel.
        // Unsuspend any update at equal or lower priority.
        var higherPriorityLanes = updateLane - 1; // Turns 0b1000 into 0b0111
        root.suspendedLanes &= higherPriorityLanes, root.pingedLanes &= higherPriorityLanes, // recent event, and we assume time is monotonically increasing.
        root.eventTimes[pickArbitraryLaneIndex(updateLane)] = eventTime;
    }
    function markRootPinged(root, pingedLanes, eventTime) {
        root.pingedLanes |= root.suspendedLanes & pingedLanes;
    }
    function markRootMutableRead(root, updateLane) {
        root.mutableReadLanes |= updateLane & root.pendingLanes;
    }
    var clz32 = Math.clz32 ? Math.clz32 : function(lanes) {
        return 0 === lanes ? 32 : 31 - (log(lanes) / LN2 | 0) | 0;
    }, log = Math.log, LN2 = Math.LN2, _enabled = !0; // Count leading zeros. Only used on lanes, so assume input is an integer.
    function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
        var timeStamp;
        nativeEvent.timeStamp, isInsideEventHandler || flushDiscreteUpdatesImpl(), function(fn, a, b, c, d) {
            var prevIsInsideEventHandler = isInsideEventHandler;
            isInsideEventHandler = !0;
            try {
                return discreteUpdatesImpl(fn, a, b, c, d);
            } finally{
                (isInsideEventHandler = prevIsInsideEventHandler) || finishEventHandler();
            }
        }(dispatchEvent, domEventName, eventSystemFlags, container, nativeEvent);
    }
    function dispatchUserBlockingUpdate(domEventName, eventSystemFlags, container, nativeEvent) {
        unstable_runWithPriority(unstable_UserBlockingPriority, dispatchEvent.bind(null, domEventName, eventSystemFlags, container, nativeEvent));
    }
    function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        if (_enabled) {
            var allowReplay = !0;
            if (// TODO: replaying capture phase events is currently broken
            // because we used to do it during top-level native bubble handlers
            // but now we use different bubble and capture handlers.
            // In eager mode, we attach capture listeners early, so we need
            // to filter them out until we fix the logic to handle them correctly.
            // This could've been outside the flag but I put it inside to reduce risk.
            (allowReplay = (4 & eventSystemFlags) == 0) && queuedDiscreteEvents.length > 0 && isReplayableDiscreteEvent(domEventName)) {
                // If we already have a queue of discrete events, and this is another discrete
                // event, then we can't dispatch it regardless of its target, since they
                // need to dispatch in order.
                queueDiscreteEvent(null, domEventName, eventSystemFlags, targetContainer, nativeEvent);
                return;
            }
            var blockedOn = attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent);
            if (null === blockedOn) {
                // We successfully dispatched this event.
                allowReplay && clearIfContinuousEvent(domEventName, nativeEvent);
                return;
            }
            if (allowReplay) {
                if (isReplayableDiscreteEvent(domEventName)) {
                    // This this to be replayed later once the target is available.
                    queueDiscreteEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent);
                    return;
                }
                if (function(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
                    // These set relatedTarget to null because the replayed event will be treated as if we
                    // moved from outside the window (no target) onto the target once it hydrates.
                    // Instead of mutating we could clone the event.
                    switch(domEventName){
                        case "focusin":
                            return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
                        case "dragenter":
                            return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
                        case "mouseover":
                            return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
                        case "pointerover":
                            var pointerId = nativeEvent.pointerId;
                            return queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)), !0;
                        case "gotpointercapture":
                            var _pointerId2 = nativeEvent.pointerId;
                            return queuedPointerCaptures.set(_pointerId2, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(_pointerId2) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)), !0;
                    }
                    return !1;
                } // Check if this target is unblocked. Returns true if it's unblocked.
                (blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) return;
                 // We need to clear only if we didn't queue because
                // queueing is accummulative.
                clearIfContinuousEvent(domEventName, nativeEvent);
            } // This is not replayable so we'll invoke it but without a target,
            // in case the event system needs to trace it.
            dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
        }
    } // Attempt dispatching an event. Returns a SuspenseInstance or Container if it's blocked.
    function attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
        var targetInst = getClosestInstanceFromNode(getEventTarget(nativeEvent));
        if (null !== targetInst) {
            var nearestMounted = getNearestMountedFiber(targetInst);
            if (null === nearestMounted) // This tree has been unmounted already. Dispatch without a target.
            targetInst = null;
            else {
                var tag = nearestMounted.tag;
                if (13 === tag) {
                    var instance = getSuspenseInstanceFromFiber(nearestMounted);
                    if (null !== instance) // Queue the event to be replayed later. Abort dispatching since we
                    // don't want this event dispatched twice through the event system.
                    // TODO: If this is the first discrete event in the queue. Schedule an increased
                    // priority for this boundary.
                    return instance;
                     // This shouldn't happen, something went wrong but to avoid blocking
                    // the whole system, dispatch the event without a target.
                    // TODO: Warn.
                    targetInst = null;
                } else if (3 === tag) {
                    if (nearestMounted.stateNode.hydrate) // If this happens during a replay something went wrong and it might block
                    // the whole system.
                    return getContainerFromFiber(nearestMounted);
                    targetInst = null;
                } else nearestMounted !== targetInst && // If we get an event (ex: img onload) before committing that
                // component's mount, ignore it for now (that is, treat it as if it was an
                // event on a non-React tree). We might also consider queueing events and
                // dispatching them after the mount.
                (targetInst = null);
            }
        }
        return dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer), null;
    }
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
   */ var root = null, startText = null, fallbackText = null;
    function getData() {
        if (fallbackText) return fallbackText;
        var start, end, startValue = startText, startLength = startValue.length, endValue = getText(), endLength = endValue.length;
        for(start = 0; start < startLength && startValue[start] === endValue[start]; start++);
        var minEnd = startLength - start;
        for(end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++);
        var sliceTail = end > 1 ? 1 - end : void 0;
        return fallbackText = endValue.slice(start, sliceTail);
    }
    function getText() {
        return "value" in root ? root.value : root.textContent;
    }
    /**
   * `charCode` represents the actual "character code" and is safe to use with
   * `String.fromCharCode`. As such, only keys that correspond to printable
   * characters produce a valid `charCode`, the only exception to this is Enter.
   * The Tab-key is considered non-printable and does not have a `charCode`,
   * presumably because it does not produce a tab-character in browsers.
   *
   * @param {object} nativeEvent Native browser event.
   * @return {number} Normalized `charCode` property.
   */ function getEventCharCode(nativeEvent) {
        var charCode, keyCode = nativeEvent.keyCode;
        return(// Must not discard the (non-)printable Enter-key.
        ("charCode" in nativeEvent ? 0 === (charCode = nativeEvent.charCode) && 13 === keyCode && (charCode = 13) : // IE8 does not implement `charCode`, but `keyCode` has the correct value.
        charCode = keyCode, 10 === charCode && (charCode = 13), charCode >= 32 || 13 === charCode) ? charCode : 0);
    }
    function functionThatReturnsTrue() {
        return !0;
    }
    function functionThatReturnsFalse() {
        return !1;
    } // This is intentionally a factory so that we have different returned constructors.
    // If we had a single constructor, it would be megamorphic and engines would deopt.
    function createSyntheticEvent(Interface) {
        /**
     * Synthetic events are dispatched by event plugins, typically in response to a
     * top-level event delegation handler.
     *
     * These systems should generally use pooling to reduce the frequency of garbage
     * collection. The system should check `isPersistent` to determine whether the
     * event should be released into the pool after being dispatched. Users that
     * need a persisted event should invoke `persist`.
     *
     * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
     * normalizing browser quirks. Subclasses do not necessarily have to implement a
     * DOM interface; custom application-specific events can also subclass this.
     */ function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
            for(var _propName in this._reactName = reactName, this._targetInst = targetInst, this.type = reactEventType, this.nativeEvent = nativeEvent, this.target = nativeEventTarget, this.currentTarget = null, Interface)if (Interface.hasOwnProperty(_propName)) {
                var normalize = Interface[_propName];
                normalize ? this[_propName] = normalize(nativeEvent) : this[_propName] = nativeEvent[_propName];
            }
            return (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : !1 === nativeEvent.returnValue) ? this.isDefaultPrevented = functionThatReturnsTrue : this.isDefaultPrevented = functionThatReturnsFalse, this.isPropagationStopped = functionThatReturnsFalse, this;
        }
        return _assign(SyntheticBaseEvent.prototype, {
            preventDefault: function() {
                this.defaultPrevented = !0;
                var event = this.nativeEvent;
                event && (event.preventDefault ? event.preventDefault() : "unknown" != typeof event.returnValue && (event.returnValue = !1), this.isDefaultPrevented = functionThatReturnsTrue);
            },
            stopPropagation: function() {
                var event = this.nativeEvent;
                event && (event.stopPropagation ? event.stopPropagation() : "unknown" != typeof event.cancelBubble && // The ChangeEventPlugin registers a "propertychange" event for
                // IE. This event does not support bubbling or cancelling, and
                // any references to cancelBubble throw "Member not found".  A
                // typeof check of "unknown" circumvents this issue (and is also
                // IE specific).
                (event.cancelBubble = !0), this.isPropagationStopped = functionThatReturnsTrue);
            },
            /**
       * We release all dispatched `SyntheticEvent`s after each event loop, adding
       * them back into the pool. This allows a way to hold onto a reference that
       * won't be added back into the pool.
       */ persist: function() {
            // Modern event system doesn't use pooling.
            },
            /**
       * Checks if this event should be released back into the pool.
       *
       * @return {boolean} True if this should not be released, false otherwise.
       */ isPersistent: functionThatReturnsTrue
        }), SyntheticBaseEvent;
    }
    /**
   * @interface Event
   * @see http://www.w3.org/TR/DOM-Level-3-Events/
   */ var EventInterface = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(event) {
            return event.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0
    }, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = _assign({}, EventInterface, {
        view: 0,
        detail: 0
    }), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), MouseEventInterface = _assign({}, UIEventInterface, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: getEventModifierState,
        button: 0,
        buttons: 0,
        relatedTarget: function(event) {
            return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
        },
        movementX: function(event) {
            return "movementX" in event ? event.movementX : (event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : (lastMovementX = 0, lastMovementY = 0), lastMouseEvent = event), lastMovementX);
        },
        movementY: function(event) {
            return "movementY" in event ? event.movementY : lastMovementY // Don't need to call updateMouseMovementPolyfillState() here
            ;
        }
    }), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), SyntheticDragEvent = createSyntheticEvent(_assign({}, MouseEventInterface, {
        dataTransfer: 0
    })), SyntheticFocusEvent = createSyntheticEvent(_assign({}, UIEventInterface, {
        relatedTarget: 0
    })), SyntheticAnimationEvent = createSyntheticEvent(_assign({}, EventInterface, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    })), SyntheticClipboardEvent = createSyntheticEvent(_assign({}, EventInterface, {
        clipboardData: function(event) {
            return "clipboardData" in event ? event.clipboardData : window.clipboardData;
        }
    })), SyntheticCompositionEvent = createSyntheticEvent(_assign({}, EventInterface, {
        data: 0
    })), normalizeKey = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, translateToKey = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, modifierKeyToProp = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    // getModifierState. If getModifierState is not supported, we map it to a set of
    // modifier keys exposed by the event. In this case, Lock-keys are not supported.
    function modifierStateGetter(keyArg) {
        var nativeEvent = this.nativeEvent;
        if (nativeEvent.getModifierState) return nativeEvent.getModifierState(keyArg);
        var keyProp = modifierKeyToProp[keyArg];
        return !!keyProp && !!nativeEvent[keyProp];
    }
    function getEventModifierState(nativeEvent) {
        return modifierStateGetter;
    }
    var SyntheticKeyboardEvent = createSyntheticEvent(_assign({}, UIEventInterface, {
        key: /**
   * @param {object} nativeEvent Native browser event.
   * @return {string} Normalized `key` property.
   */ function(nativeEvent) {
            if (nativeEvent.key) {
                // Normalize inconsistent values reported by browsers due to
                // implementations of a working draft specification.
                // FireFox implements `key` but returns `MozPrintableKey` for all
                // printable characters (normalized to `Unidentified`), ignore it.
                var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
                if ("Unidentified" !== key) return key;
            } // Browser does not implement `key`, polyfill as much of it as we can.
            if ("keypress" === nativeEvent.type) {
                var charCode = getEventCharCode(nativeEvent); // The enter-key is technically both printable and non-printable and can
                // thus be captured by `keypress`, no other non-printable key should.
                return 13 === charCode ? "Enter" : String.fromCharCode(charCode);
            }
            return "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: getEventModifierState,
        // Legacy Interface
        charCode: function(event) {
            return(// `charCode` is the result of a KeyPress event and represents the value of
            // the actual printable character.
            // KeyPress is deprecated, but its replacement is not yet final and not
            // implemented in any major browser. Only KeyPress has charCode.
            "keypress" === event.type ? getEventCharCode(event) : 0);
        },
        keyCode: function(event) {
            return(// `keyCode` is the result of a KeyDown/Up event and represents the value of
            // physical keyboard key.
            // The actual meaning of the value depends on the users' keyboard layout
            // which cannot be detected. Assuming that it is a US keyboard layout
            // provides a surprisingly accurate mapping for US and European users.
            // Due to this, it is left to the user to implement at this time.
            "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0);
        },
        which: function(event) {
            return(// `which` is an alias for either `keyCode` or `charCode` depending on the
            // type of the event.
            "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0);
        }
    })), SyntheticPointerEvent = createSyntheticEvent(_assign({}, MouseEventInterface, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    })), SyntheticTouchEvent = createSyntheticEvent(_assign({}, UIEventInterface, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: getEventModifierState
    })), SyntheticTransitionEvent = createSyntheticEvent(_assign({}, EventInterface, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    })), SyntheticWheelEvent = createSyntheticEvent(_assign({}, MouseEventInterface, {
        deltaX: function(event) {
            return "deltaX" in event ? event.deltaX // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
             : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
        },
        deltaY: function(event) {
            return "deltaY" in event ? event.deltaY // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
             : "wheelDeltaY" in event ? -event.wheelDeltaY // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
             : "wheelDelta" in event ? -event.wheelDelta : 0;
        },
        deltaZ: 0,
        // Browsers without "deltaMode" is reporting in raw wheel delta where one
        // notch on the scroll is always +/- 120, roughly equivalent to pixels.
        // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
        // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
        deltaMode: 0
    })), END_KEYCODES = [
        9,
        13,
        27,
        32
    ], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
    canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
    // directly represent `beforeInput`. The IE `textinput` event is not as
    // useful, so we don't use it.
    var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11), hasSpaceKeypress = !1; // In IE9+, we have access to composition events, but the data supplied
    /**
   * Does our fallback mode think that this event is the end of composition?
   */ function isFallbackCompositionEnd(domEventName, nativeEvent) {
        switch(domEventName){
            case "keyup":
                // Command keys insert or clear IME input.
                return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
            case "keydown":
                // Expect IME keyCode on each keydown. If we get any other
                // code we must have exited earlier.
                return 229 !== nativeEvent.keyCode;
            case "keypress":
            case "mousedown":
            case "focusout":
                // Events are not possible without cancelling IME.
                return !0;
            default:
                return !1;
        }
    }
    /**
   * Google Input Tools provides composition data via a CustomEvent,
   * with the `data` property populated in the `detail` object. If this
   * is available on the event object, use it. If not, this is a plain
   * composition event and we have nothing special to extract.
   *
   * @param {object} nativeEvent
   * @return {?string}
   */ function getDataFromCustomEvent(nativeEvent) {
        var detail = nativeEvent.detail;
        return "object" == typeof detail && "data" in detail ? detail.data : null;
    }
    /**
   * Check if a composition event was triggered by Korean IME.
   * Our fallback mode does not work well with IE's Korean IME,
   * so just use native composition events when Korean IME is used.
   * Although CompositionEvent.locale property is deprecated,
   * it is available in IE, where our fallback mode is enabled.
   *
   * @param {object} nativeEvent
   * @return {boolean}
   */ function isUsingKoreanIME(nativeEvent) {
        return "ko" === nativeEvent.locale;
    } // Track the current IME composition status, if any.
    var isComposing = !1, supportedInputTypes = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    };
    function isTextInputElement(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName;
    }
    function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
        // Flag this event loop as needing state restore.
        enqueueStateRestore(target);
        var listeners = accumulateTwoPhaseListeners(inst, "onChange");
        if (listeners.length > 0) {
            var event = new SyntheticEvent("onChange", "change", null, nativeEvent, target);
            dispatchQueue.push({
                event: event,
                listeners: listeners
            });
        }
    }
    /**
   * For IE shims
   */ var activeElement = null, activeElementInst = null;
    function runEventInBatch(dispatchQueue) {
        processDispatchQueue(dispatchQueue, 0);
    }
    function getInstIfValueChanged(targetInst) {
        if (updateValueIfChanged(getNodeFromInstance(targetInst))) return targetInst;
    }
    function getTargetInstForChangeEvent(domEventName, targetInst) {
        if ("change" === domEventName) return targetInst;
    }
    /**
   * SECTION: handle `input` event
   */ var isInputEventSupported = !1;
    /**
   * (For IE <=9) Removes the event listeners from the currently-tracked element,
   * if any exists.
   */ function stopWatchingForValueChange() {
        activeElement && (activeElement.detachEvent("onpropertychange", handlePropertyChange), activeElement = null, activeElementInst = null);
    }
    /**
   * (For IE <=9) Handles a propertychange event, sending a `change` event if
   * the value of the active element has changed.
   */ function handlePropertyChange(nativeEvent) {
        if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst)) {
            var dispatchQueue;
            createAndAccumulateChangeEvent(dispatchQueue = [], activeElementInst, nativeEvent, getEventTarget(nativeEvent)), // other events and have it go through ReactBrowserEventEmitter. Since it
            // doesn't, we manually listen for the events and so we have to enqueue and
            // process the abstract event manually.
            //
            // Batching is necessary here in order to ensure that all event handlers run
            // before the next rerender (including event handlers attached to ancestor
            // elements instead of directly on the input). Without this, controlled
            // components don't work properly in conjunction with event bubbling because
            // the component is rerendered and the value reverted before all the event
            // handlers can run. See https://github.com/facebook/react/issues/708.
            function(fn, bookkeeping) {
                if (isInsideEventHandler) // If we are currently inside another batch, we need to wait until it
                // fully completes before restoring state.
                return fn(bookkeeping);
                isInsideEventHandler = !0;
                try {
                    return batchedUpdatesImpl(fn, bookkeeping);
                } finally{
                    isInsideEventHandler = !1, finishEventHandler();
                }
            }(runEventInBatch, dispatchQueue);
        }
    }
    function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
        if ("focusin" === domEventName) // In IE9, propertychange fires for most input events but is buggy and
        // doesn't fire when text is deleted, but conveniently, selectionchange
        // appears to fire in all of the remaining cases so we catch those and
        // forward the event if the value has changed
        // In either case, we don't want to call the event handler if the value
        // is changed from JS so we redefine a setter for `.value` that updates
        // our activeElementValue variable, allowing us to ignore those changes
        //
        // stopWatching() should be a noop here but we call it just in case we
        // missed a blur event somehow.
        stopWatchingForValueChange(), activeElement = target, activeElementInst = targetInst, activeElement.attachEvent("onpropertychange", handlePropertyChange);
        else "focusout" === domEventName && stopWatchingForValueChange();
    } // For IE8 and IE9.
    function getTargetInstForInputEventPolyfill(domEventName, targetInst) {
        if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName) // On the selectionchange event, the target is just document which isn't
        // helpful for us so just check activeElement instead.
        //
        // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
        // propertychange on the first input event after setting `value` from a
        // script and fires only keydown, keypress, keyup. Catching keyup usually
        // gets it and catching keydown lets us fire an event for the first
        // keystroke if user does a key repeat (it'll be a little delayed: right
        // before the second keystroke). Other input methods (e.g., paste) seem to
        // fire selectionchange normally.
        return getInstIfValueChanged(activeElementInst);
    }
    function getTargetInstForClickEvent(domEventName, targetInst) {
        if ("click" === domEventName) return getInstIfValueChanged(targetInst);
    }
    function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
        if ("input" === domEventName || "change" === domEventName) return getInstIfValueChanged(targetInst);
    }
    canUseDOM && // IE9 claims to support the input event but fails to trigger it when
    // deleting text, so we ignore its input events.
    (isInputEventSupported = /**
   * Checks if an event is supported in the current execution environment.
   *
   * NOTE: This will not work correctly for non-generic events such as `change`,
   * `reset`, `load`, `error`, and `select`.
   *
   * Borrows from Modernizr.
   *
   * @param {string} eventNameSuffix Event name, e.g. "click".
   * @return {boolean} True if the event is supported.
   * @internal
   * @license Modernizr 3.0.0pre (Custom Build) | MIT
   */ function(eventNameSuffix) {
        if (!canUseDOM) return !1;
        var eventName = "on" + eventNameSuffix, isSupported = eventName in document;
        if (!isSupported) {
            var element = document.createElement("div");
            element.setAttribute(eventName, "return;"), isSupported = "function" == typeof element[eventName];
        }
        return isSupported;
    }("input") && (!document.documentMode || document.documentMode > 9));
    var objectIs = "function" == typeof Object.is ? Object.is : /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */ function(x, y) {
        return x === y && (0 !== x || 1 / x == 1 / y) || x != x && y != y // eslint-disable-line no-self-compare
        ;
    }, hasOwnProperty$2 = Object.prototype.hasOwnProperty;
    /**
   * Performs equality by iterating through keys on an object and returning false
   * when any key has values which are not strictly equal between the arguments.
   * Returns true when the values of all keys are strictly equal.
   */ function shallowEqual(objA, objB) {
        if (objectIs(objA, objB)) return !0;
        if ("object" != typeof objA || null === objA || "object" != typeof objB || null === objB) return !1;
        var keysA = Object.keys(objA), keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return !1;
         // Test for A's keys different from B.
        for(var i = 0; i < keysA.length; i++)if (!hasOwnProperty$2.call(objB, keysA[i]) || !objectIs(objA[keysA[i]], objB[keysA[i]])) return !1;
        return !0;
    }
    /**
   * Given any node return the first leaf node without children.
   *
   * @param {DOMElement|DOMTextNode} node
   * @return {DOMElement|DOMTextNode}
   */ function getLeafNode(node) {
        for(; node && node.firstChild;)node = node.firstChild;
        return node;
    }
    /**
   * Get object describing the nodes which contain characters at offset.
   *
   * @param {DOMElement|DOMTextNode} root
   * @param {number} offset
   * @return {?object}
   */ function getNodeForCharacterOffset(root, offset) {
        for(var node = getLeafNode(root), nodeStart = 0, nodeEnd = 0; node;){
            if (3 === node.nodeType) {
                if (nodeEnd = nodeStart + node.textContent.length, nodeStart <= offset && nodeEnd >= offset) return {
                    node: node,
                    offset: offset - nodeStart
                };
                nodeStart = nodeEnd;
            }
            node = getLeafNode(/**
   * Get the next sibling within a container. This will walk up the
   * DOM if a node's siblings have been exhausted.
   *
   * @param {DOMElement|DOMTextNode} node
   * @return {?DOMElement|DOMTextNode}
   */ function(node) {
                for(; node;){
                    if (node.nextSibling) return node.nextSibling;
                    node = node.parentNode;
                }
            }(node));
        }
    }
    function isTextNode(node) {
        return node && 3 === node.nodeType;
    }
    function getActiveElementDeep() {
        for(var win = window, element = getActiveElement(); element instanceof win.HTMLIFrameElement && function(iframe) {
            try {
                // Accessing the contentDocument of a HTMLIframeElement can cause the browser
                // to throw, e.g. if it has a cross-origin src attribute.
                // Safari will show an error in the console when the access results in "Blocked a frame with origin". e.g:
                // iframe.contentDocument.defaultView;
                // A safety way is to access one of the cross origin properties: Window or Location
                // Which might result in "SecurityError" DOM Exception and it is compatible to Safari.
                // https://html.spec.whatwg.org/multipage/browsers.html#integration-with-idl
                return "string" == typeof iframe.contentWindow.location.href;
            } catch (err) {
                return !1;
            }
        }(element);)element = getActiveElement((win = element.contentWindow).document);
        return element;
    }
    /**
   * @ReactInputSelection: React input selection module. Based on Selection.js,
   * but modified to be suitable for react and has a couple of bug fixes (doesn't
   * assume buttons have range selections allowed).
   * Input selection module for React.
   */ /**
   * @hasSelectionCapabilities: we get the element types that support selection
   * from https://html.spec.whatwg.org/#do-not-apply, looking at `selectionStart`
   * and `selectionEnd` rows.
   */ function hasSelectionCapabilities(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
    }
    var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && document.documentMode <= 11, activeElement$1 = null, activeElementInst$1 = null, lastSelection = null, mouseDown = !1;
    /**
   * Poll selection to see whether it's changed.
   *
   * @param {object} nativeEvent
   * @param {object} nativeEventTarget
   * @return {?SyntheticEvent}
   */ function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
        // Ensure we have the right element, and that the user is not dragging a
        // selection (this matches native `select` event behavior). In HTML5, select
        // fires only on input and textarea thus if there's no focused element we
        // won't dispatch.
        var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
        if (!mouseDown && null != activeElement$1 && activeElement$1 === getActiveElement(doc)) {
            var currentSelection = /**
   * Get an object which is a unique representation of the current selection.
   *
   * The return value will not be consistent across nodes or browsers, but
   * two identical selections on the same node will return identical objects.
   */ function(node) {
                if ("selectionStart" in node && hasSelectionCapabilities(node)) return {
                    start: node.selectionStart,
                    end: node.selectionEnd
                };
                var selection = (node.ownerDocument && node.ownerDocument.defaultView || window).getSelection();
                return {
                    anchorNode: selection.anchorNode,
                    anchorOffset: selection.anchorOffset,
                    focusNode: selection.focusNode,
                    focusOffset: selection.focusOffset
                };
            }(activeElement$1);
            if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
                lastSelection = currentSelection;
                var listeners = accumulateTwoPhaseListeners(activeElementInst$1, "onSelect");
                if (listeners.length > 0) {
                    var event = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget);
                    dispatchQueue.push({
                        event: event,
                        listeners: listeners
                    }), event.target = activeElement$1;
                }
            }
        } // Only fire when selection has actually changed.
    }
    registerSimplePluginEventsAndSetTheirPriorities([
        'cancel',
        'cancel',
        'click',
        'click',
        'close',
        'close',
        'contextmenu',
        'contextMenu',
        'copy',
        'copy',
        'cut',
        'cut',
        'auxclick',
        'auxClick',
        'dblclick',
        'doubleClick',
        'dragend',
        'dragEnd',
        'dragstart',
        'dragStart',
        'drop',
        'drop',
        'focusin',
        'focus',
        'focusout',
        'blur',
        'input',
        'input',
        'invalid',
        'invalid',
        'keydown',
        'keyDown',
        'keypress',
        'keyPress',
        'keyup',
        'keyUp',
        'mousedown',
        'mouseDown',
        'mouseup',
        'mouseUp',
        'paste',
        'paste',
        'pause',
        'pause',
        'play',
        'play',
        'pointercancel',
        'pointerCancel',
        'pointerdown',
        'pointerDown',
        'pointerup',
        'pointerUp',
        'ratechange',
        'rateChange',
        'reset',
        'reset',
        'seeked',
        'seeked',
        'submit',
        'submit',
        'touchcancel',
        'touchCancel',
        'touchend',
        'touchEnd',
        'touchstart',
        'touchStart',
        'volumechange',
        'volumeChange'
    ], 0), registerSimplePluginEventsAndSetTheirPriorities([
        'drag',
        'drag',
        'dragenter',
        'dragEnter',
        'dragexit',
        'dragExit',
        'dragleave',
        'dragLeave',
        'dragover',
        'dragOver',
        'mousemove',
        'mouseMove',
        'mouseout',
        'mouseOut',
        'mouseover',
        'mouseOver',
        'pointermove',
        'pointerMove',
        'pointerout',
        'pointerOut',
        'pointerover',
        'pointerOver',
        'scroll',
        'scroll',
        'toggle',
        'toggle',
        'touchmove',
        'touchMove',
        'wheel',
        'wheel'
    ], 1), registerSimplePluginEventsAndSetTheirPriorities([
        "abort",
        "abort",
        ANIMATION_END,
        "animationEnd",
        ANIMATION_ITERATION,
        "animationIteration",
        ANIMATION_START,
        "animationStart",
        "canplay",
        "canPlay",
        "canplaythrough",
        "canPlayThrough",
        "durationchange",
        "durationChange",
        "emptied",
        "emptied",
        "encrypted",
        "encrypted",
        "ended",
        "ended",
        "error",
        "error",
        "gotpointercapture",
        "gotPointerCapture",
        "load",
        "load",
        "loadeddata",
        "loadedData",
        "loadedmetadata",
        "loadedMetadata",
        "loadstart",
        "loadStart",
        "lostpointercapture",
        "lostPointerCapture",
        "playing",
        "playing",
        "progress",
        "progress",
        "seeking",
        "seeking",
        "stalled",
        "stalled",
        "suspend",
        "suspend",
        "timeupdate",
        "timeUpdate",
        TRANSITION_END,
        "transitionEnd",
        "waiting",
        "waiting"
    ], 2), function(eventTypes, priority) {
        for(var i = 0; i < eventTypes.length; i++)eventPriorities.set(eventTypes[i], 0);
    }([
        "change",
        "selectionchange",
        "textInput",
        "compositionstart",
        "compositionend",
        "compositionupdate"
    ], 0), registerDirectEvent("onMouseEnter", [
        "mouseout",
        "mouseover"
    ]), registerDirectEvent("onMouseLeave", [
        "mouseout",
        "mouseover"
    ]), registerDirectEvent("onPointerEnter", [
        "pointerout",
        "pointerover"
    ]), registerDirectEvent("onPointerLeave", [
        "pointerout",
        "pointerover"
    ]), registerTwoPhaseEvent("onChange", [
        "change",
        "click",
        "focusin",
        "focusout",
        "input",
        "keydown",
        "keyup",
        "selectionchange"
    ]), registerTwoPhaseEvent("onSelect", [
        "focusout",
        "contextmenu",
        "dragend",
        "focusin",
        "keydown",
        "keyup",
        "mousedown",
        "mouseup",
        "selectionchange"
    ]), registerTwoPhaseEvent("onBeforeInput", [
        "compositionend",
        "keypress",
        "textInput",
        "paste"
    ]), registerTwoPhaseEvent("onCompositionEnd", [
        "compositionend",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown"
    ]), registerTwoPhaseEvent("onCompositionStart", [
        "compositionstart",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown"
    ]), registerTwoPhaseEvent("onCompositionUpdate", [
        "compositionupdate",
        "focusout",
        "keydown",
        "keypress",
        "keyup",
        "mousedown"
    ]);
    var mediaEventTypes = [
        "abort",
        "canplay",
        "canplaythrough",
        "durationchange",
        "emptied",
        "encrypted",
        "ended",
        "error",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "seeked",
        "seeking",
        "stalled",
        "suspend",
        "timeupdate",
        "volumechange",
        "waiting"
    ], nonDelegatedEvents = new Set([
        "cancel",
        "close",
        "invalid",
        "load",
        "scroll",
        "toggle"
    ].concat(mediaEventTypes)); // We should not delegate these events to the container, but rather
    function executeDispatch(event, listener, currentTarget) {
        var type = event.type || "unknown-event";
        event.currentTarget = currentTarget, /**
   * Same as invokeGuardedCallback, but instead of returning an error, it stores
   * it in a global so it can be rethrown by `rethrowCaughtError` later.
   * TODO: See if caughtError and rethrowError can be unified.
   *
   * @param {String} name of the guard to use for logging or debugging
   * @param {Function} func The function to invoke
   * @param {*} context The context to use when calling the function
   * @param {...*} args Arguments for function
   */ function(name, func, context, a, b, c, d, e, f) {
            if (invokeGuardedCallback.apply(this, arguments), hasError) {
                var error = clearCaughtError();
                hasRethrowError || (hasRethrowError = !0, rethrowError = error);
            }
        }(type, listener, void 0, event), event.currentTarget = null;
    }
    function processDispatchQueue(dispatchQueue, eventSystemFlags) {
        for(var inCapturePhase = (4 & eventSystemFlags) != 0, i = 0; i < dispatchQueue.length; i++){
            var _dispatchQueue$i = dispatchQueue[i];
            !function(event, dispatchListeners, inCapturePhase) {
                var previousInstance;
                if (inCapturePhase) for(var i = dispatchListeners.length - 1; i >= 0; i--){
                    var _dispatchListeners$i = dispatchListeners[i], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget, listener = _dispatchListeners$i.listener;
                    if (instance !== previousInstance && event.isPropagationStopped()) return;
                    executeDispatch(event, listener, currentTarget), previousInstance = instance;
                }
                else for(var _i = 0; _i < dispatchListeners.length; _i++){
                    var _dispatchListeners$_i = dispatchListeners[_i], _instance = _dispatchListeners$_i.instance, _currentTarget = _dispatchListeners$_i.currentTarget, _listener = _dispatchListeners$_i.listener;
                    if (_instance !== previousInstance && event.isPropagationStopped()) return;
                    executeDispatch(event, _listener, _currentTarget), previousInstance = _instance;
                }
            }(_dispatchQueue$i.event, _dispatchQueue$i.listeners, inCapturePhase); //  event system doesn't use pooling.
        } // This would be a good time to rethrow if any of the event handlers threw.
        !/**
   * During execution of guarded functions we will capture the first error which
   * we will rethrow to be handled by the top level error handler.
   */ function() {
            if (hasRethrowError) {
                var error = rethrowError;
                throw hasRethrowError = !1, rethrowError = null, error;
            }
        }();
    }
    function listenToNonDelegatedEvent(domEventName, targetElement) {
        var listenerSet = getEventListenerSet(targetElement), listenerSetKey = getListenerSetKey(domEventName, !1);
        listenerSet.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, !1), listenerSet.add(listenerSetKey));
    }
    var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
    function listenToAllSupportedEvents(rootContainerElement) {
        !rootContainerElement[listeningMarker] && (rootContainerElement[listeningMarker] = !0, allNativeEvents.forEach(function(domEventName) {
            nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, !1, rootContainerElement, null), listenToNativeEvent(domEventName, !0, rootContainerElement, null);
        }));
    }
    function listenToNativeEvent(domEventName, isCapturePhaseListener, rootContainerElement, targetElement) {
        var eventSystemFlags = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, target = rootContainerElement;
        // register it to the root container. Otherwise, we should
        // register the event to the target element and mark it as
        // a non-delegated event.
        if ("selectionchange" === domEventName && 9 !== rootContainerElement.nodeType && (target = rootContainerElement.ownerDocument), null !== targetElement && !isCapturePhaseListener && nonDelegatedEvents.has(domEventName)) {
            // For all non-delegated events, apart from scroll, we attach
            // their event listeners to the respective elements that their
            // events fire on. That means we can skip this step, as event
            // listener has already been added previously. However, we
            // special case the scroll event because the reality is that any
            // element can scroll.
            // TODO: ideally, we'd eventually apply the same logic to all
            // events from the nonDelegatedEvents list. Then we can remove
            // this special case and use the same logic for all events.
            if ("scroll" !== domEventName) return;
            eventSystemFlags |= 2, target = targetElement;
        }
        var listenerSet = getEventListenerSet(target), listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);
        listenerSet.has(listenerSetKey) || (isCapturePhaseListener && (eventSystemFlags |= 4), addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener), listenerSet.add(listenerSetKey));
    }
    function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener, isDeferredListenerForLegacyFBSupport) {
        var passive, passive1, unsubscribeListener, listener = function(targetContainer, domEventName, eventSystemFlags) {
            var priority, listenerWrapper;
            switch(void 0 === (priority = eventPriorities.get(domEventName)) ? 2 : priority){
                case 0:
                    listenerWrapper = dispatchDiscreteEvent;
                    break;
                case 1:
                    listenerWrapper = dispatchUserBlockingUpdate;
                    break;
                default:
                    listenerWrapper = dispatchEvent;
            }
            return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
        }(targetContainer, domEventName, eventSystemFlags), isPassiveListener = void 0; // If passive option is not supported, then the event will be
        passiveBrowserEventsSupported && ("touchstart" === domEventName || "touchmove" === domEventName || "wheel" === domEventName) && (isPassiveListener = !0), isCapturePhaseListener ? void 0 !== isPassiveListener ? (passive = isPassiveListener, targetContainer.addEventListener(domEventName, listener, {
            capture: !0,
            passive: passive
        })) : targetContainer.addEventListener(domEventName, listener, !0) : void 0 !== isPassiveListener ? (passive1 = isPassiveListener, targetContainer.addEventListener(domEventName, listener, {
            passive: passive1
        })) : targetContainer.addEventListener(domEventName, listener, !1);
    }
    function isMatchingRootContainer(grandContainer, targetContainer) {
        return grandContainer === targetContainer || 8 === grandContainer.nodeType && grandContainer.parentNode === targetContainer;
    }
    function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
        var ancestorInst = targetInst;
        if ((1 & eventSystemFlags) == 0 && (2 & eventSystemFlags) == 0 && null !== targetInst) {
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
            var node = targetInst;
            mainLoop: for(;;){
                if (null === node) return;
                var nodeTag = node.tag;
                if (3 === nodeTag || 4 === nodeTag) {
                    var container = node.stateNode.containerInfo;
                    if (isMatchingRootContainer(container, targetContainer)) break;
                    if (4 === nodeTag) for(// The target is a portal, but it's not the rootContainer we're looking for.
                    // Normally portals handle their own events all the way down to the root.
                    // So we should be able to stop now. However, we don't know if this portal
                    // was part of *our* root.
                    var grandNode = node.return; null !== grandNode;){
                        var grandTag = grandNode.tag;
                        if ((3 === grandTag || 4 === grandTag) && isMatchingRootContainer(grandNode.stateNode.containerInfo, targetContainer)) // This is the rootContainer we're looking for and we found it as
                        // a parent of the Portal. That means we can ignore it because the
                        // Portal will bubble through to us.
                        return;
                        grandNode = grandNode.return;
                    }
                     // Now we need to find it's corresponding host fiber in the other
                    // tree. To do this we can use getClosestInstanceFromNode, but we
                    // need to validate that the fiber is a host instance, otherwise
                    // we need to traverse up through the DOM till we find the correct
                    // node that is from the other tree.
                    for(; null !== container;){
                        var parentNode = getClosestInstanceFromNode(container);
                        if (null === parentNode) return;
                        var parentTag = parentNode.tag;
                        if (5 === parentTag || 6 === parentTag) {
                            node = ancestorInst = parentNode;
                            continue mainLoop;
                        }
                        container = container.parentNode;
                    }
                }
                node = node.return;
            }
        }
        !function(fn, a, b) {
            if (isBatchingEventUpdates) // If we are currently inside another batch, we need to wait until it
            // fully completes before restoring state.
            return fn(void 0, void 0);
            isBatchingEventUpdates = !0;
            try {
                return batchedEventUpdatesImpl(fn, void 0, void 0);
            } finally{
                isBatchingEventUpdates = !1, finishEventHandler();
            }
        }(function() {
            var targetInst, nativeEventTarget, dispatchQueue;
            return targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), void (function(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
                // event's native "bubble" phase, which means that we're
                // not in the capture phase. That's because we emulate
                // the capture phase here still. This is a trade-off,
                // because in an ideal world we would not emulate and use
                // the phases properly, like we do with the SimpleEvent
                // plugin. However, the plugins below either expect
                // emulation (EnterLeave) or use state localized to that
                // plugin (BeforeInput, Change, Select). The state in
                // these modules complicates things, as you'll essentially
                // get the case where the capture phase event might change
                // state, only for the following bubble event to come in
                // later and not trigger anything as the state now
                // invalidates the heuristics of the event plugin. We
                // could alter all these plugins to work in such ways, but
                // that might cause other unknown side-effects that we
                // can't forsee right now.
                if (// TODO: we should remove the concept of a "SimpleEventPlugin".
                // This is the basic functionality of the event system. All
                // the other plugins are essentially polyfills. So the plugin
                // should probably be inlined somewhere and have its logic
                // be core the to event system. This would potentially allow
                // us to ship builds of React without the polyfilled plugins below.
                function(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
                    var reactName = topLevelEventsToReactNames.get(domEventName);
                    if (void 0 !== reactName) {
                        var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
                        switch(domEventName){
                            case "keypress":
                                // Firefox creates a keypress event for function keys too. This removes
                                // the unwanted keypress events. Enter is however both printable and
                                // non-printable. One would expect Tab to be as well (but it isn't).
                                if (0 === getEventCharCode(nativeEvent)) return;
                            /* falls through */ case "keydown":
                            case "keyup":
                                SyntheticEventCtor = SyntheticKeyboardEvent;
                                break;
                            case "focusin":
                                reactEventType = "focus", SyntheticEventCtor = SyntheticFocusEvent;
                                break;
                            case "focusout":
                                reactEventType = "blur", SyntheticEventCtor = SyntheticFocusEvent;
                                break;
                            case "beforeblur":
                            case "afterblur":
                                SyntheticEventCtor = SyntheticFocusEvent;
                                break;
                            case "click":
                                // Firefox creates a click event on right mouse clicks. This removes the
                                // unwanted click events.
                                if (2 === nativeEvent.button) return;
                            /* falls through */ case "auxclick":
                            case "dblclick":
                            case "mousedown":
                            case "mousemove":
                            case "mouseup":
                            /* falls through */ case "mouseout":
                            case "mouseover":
                            case "contextmenu":
                                SyntheticEventCtor = SyntheticMouseEvent;
                                break;
                            case "drag":
                            case "dragend":
                            case "dragenter":
                            case "dragexit":
                            case "dragleave":
                            case "dragover":
                            case "dragstart":
                            case "drop":
                                SyntheticEventCtor = SyntheticDragEvent;
                                break;
                            case "touchcancel":
                            case "touchend":
                            case "touchmove":
                            case "touchstart":
                                SyntheticEventCtor = SyntheticTouchEvent;
                                break;
                            case ANIMATION_END:
                            case ANIMATION_ITERATION:
                            case ANIMATION_START:
                                SyntheticEventCtor = SyntheticAnimationEvent;
                                break;
                            case TRANSITION_END:
                                SyntheticEventCtor = SyntheticTransitionEvent;
                                break;
                            case "scroll":
                                SyntheticEventCtor = SyntheticUIEvent;
                                break;
                            case "wheel":
                                SyntheticEventCtor = SyntheticWheelEvent;
                                break;
                            case "copy":
                            case "cut":
                            case "paste":
                                SyntheticEventCtor = SyntheticClipboardEvent;
                                break;
                            case "gotpointercapture":
                            case "lostpointercapture":
                            case "pointercancel":
                            case "pointerdown":
                            case "pointermove":
                            case "pointerout":
                            case "pointerover":
                            case "pointerup":
                                SyntheticEventCtor = SyntheticPointerEvent;
                        }
                        var inCapturePhase = (4 & eventSystemFlags) != 0, _listeners = function(targetFiber, reactName, nativeEventType, inCapturePhase, accumulateTargetOnly) {
                            for(var reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName, listeners = [], instance = targetFiber, lastHostComponent = null; null !== instance;){
                                var _instance2 = instance, stateNode = _instance2.stateNode; // Handle listeners that are on HostComponents (i.e. <div>)
                                if (5 === _instance2.tag && null !== stateNode && (lastHostComponent = stateNode, null !== reactEventName)) {
                                    var listener = getListener(instance, reactEventName);
                                    null != listener && listeners.push(createDispatchListener(instance, listener, lastHostComponent));
                                } // If we are only accumulating events for the target, then we don't
                                // continue to propagate through the React fiber tree to find other
                                // listeners.
                                if (accumulateTargetOnly) break;
                                instance = instance.return;
                            }
                            return listeners;
                        } // We should only use this function for:
                        (targetInst, reactName, nativeEvent.type, inCapturePhase, !inCapturePhase && // TODO: ideally, we'd eventually add all events from
                        // nonDelegatedEvents list in DOMPluginEventSystem.
                        // Then we can remove this special list.
                        // This is a breaking change that can wait until React 18.
                        "scroll" === domEventName);
                        if (_listeners.length > 0) {
                            // Intentionally create event lazily.
                            var _event = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget);
                            dispatchQueue.push({
                                event: _event,
                                listeners: _listeners
                            });
                        }
                    }
                }(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags), (7 & eventSystemFlags) == 0) /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   */ (function(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
                    var win, from, to, isOverEvent = "mouseover" === domEventName || "pointerover" === domEventName, isOutEvent = "mouseout" === domEventName || "pointerout" === domEventName;
                    if (isOverEvent && (16 & eventSystemFlags) == 0) {
                        // If this is an over event with a target, we might have already dispatched
                        // the event in the out event of the other target. If this is replayed,
                        // then it's because we couldn't dispatch against this target previously
                        // so we have to do it now instead.
                        var related = nativeEvent.relatedTarget || nativeEvent.fromElement;
                        if (related && (getClosestInstanceFromNode(related) || related[internalContainerInstanceKey])) return;
                    }
                    if (isOutEvent || isOverEvent) {
                        if (nativeEventTarget.window === nativeEventTarget) // `nativeEventTarget` is probably a window object.
                        win = nativeEventTarget;
                        else {
                            // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
                            var doc = nativeEventTarget.ownerDocument;
                            win = doc ? doc.defaultView || doc.parentWindow : window;
                        }
                        if (isOutEvent) {
                            var _related = nativeEvent.relatedTarget || nativeEvent.toElement;
                            if (from = targetInst, null !== (to = _related ? getClosestInstanceFromNode(_related) : null)) {
                                var nearestMounted = getNearestMountedFiber(to);
                                (to !== nearestMounted || 5 !== to.tag && 6 !== to.tag) && (to = null);
                            }
                        } else // Moving to a node from outside the window.
                        from = null, to = targetInst;
                        if (from !== to) {
                            var dispatchQueue1, leaveEvent, enterEvent, from1, to1, common, SyntheticEventCtor = SyntheticMouseEvent, leaveEventType = "onMouseLeave", enterEventType = "onMouseEnter", eventTypePrefix = "mouse";
                            ("pointerout" === domEventName || "pointerover" === domEventName) && (SyntheticEventCtor = SyntheticPointerEvent, leaveEventType = "onPointerLeave", enterEventType = "onPointerEnter", eventTypePrefix = "pointer");
                            var fromNode = null == from ? win : getNodeFromInstance(from), toNode = null == to ? win : getNodeFromInstance(to), leave = new SyntheticEventCtor(leaveEventType, eventTypePrefix + "leave", from, nativeEvent, nativeEventTarget);
                            leave.target = fromNode, leave.relatedTarget = toNode;
                            var enter = null; // We should only process this nativeEvent if we are processing
                            if (getClosestInstanceFromNode(nativeEventTarget) === targetInst) {
                                var enterEvent1 = new SyntheticEventCtor(enterEventType, eventTypePrefix + "enter", to, nativeEvent, nativeEventTarget);
                                enterEvent1.target = toNode, enterEvent1.relatedTarget = fromNode, enter = enterEvent1;
                            }
                            dispatchQueue1 = dispatchQueue, leaveEvent = leave, enterEvent = enter, from1 = from, to1 = to, common = from1 && to1 ? /**
   * Return the lowest common ancestor of A and B, or null if they are in
   * different trees.
   */ function(instA, instB) {
                                for(var nodeA = instA, nodeB = instB, depthA = 0, tempA = nodeA; tempA; tempA = getParent(tempA))depthA++;
                                for(var depthB = 0, tempB = nodeB; tempB; tempB = getParent(tempB))depthB++;
                                 // If A is deeper, crawl up.
                                for(; depthA - depthB > 0;)nodeA = getParent(nodeA), depthA--;
                                 // If B is deeper, crawl up.
                                for(; depthB - depthA > 0;)nodeB = getParent(nodeB), depthB--;
                                 // Walk in lockstep until we find a match.
                                for(var depth = depthA; depth--;){
                                    if (nodeA === nodeB || null !== nodeB && nodeA === nodeB.alternate) return nodeA;
                                    nodeA = getParent(nodeA), nodeB = getParent(nodeB);
                                }
                                return null;
                            }(from1, to1) : null, null !== from1 && accumulateEnterLeaveListenersForEvent(dispatchQueue1, leaveEvent, from1, common, !1), null !== to1 && null !== enterEvent && accumulateEnterLeaveListenersForEvent(dispatchQueue1, enterEvent, to1, common, !0);
                        }
                    }
                })(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags), /**
   * This plugin creates an `onChange` event that normalizes change events
   * across form elements. This event fires at a time when it's possible to
   * change the element's value without seeing a flicker.
   *
   * Supported elements are:
   * - input (see `isTextInputElement`)
   * - textarea
   * - select
   */ function(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
                    var node, state, nodeName, nodeName1, getTargetInstFunc, handleEventFunc, targetNode = targetInst ? getNodeFromInstance(targetInst) : window;
                    if ("select" === (nodeName = targetNode.nodeName && targetNode.nodeName.toLowerCase()) || "input" === nodeName && "file" === targetNode.type ? getTargetInstFunc = getTargetInstForChangeEvent : isTextInputElement(targetNode) ? isInputEventSupported ? getTargetInstFunc = getTargetInstForInputOrChangeEvent : (getTargetInstFunc = getTargetInstForInputEventPolyfill, handleEventFunc = handleEventsForInputEventPolyfill) : (nodeName1 = targetNode.nodeName) && "input" === nodeName1.toLowerCase() && ("checkbox" === targetNode.type || "radio" === targetNode.type) && (getTargetInstFunc = getTargetInstForClickEvent), getTargetInstFunc) {
                        var inst = getTargetInstFunc(domEventName, targetInst);
                        if (inst) {
                            createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, nativeEventTarget);
                            return;
                        }
                    }
                    handleEventFunc && handleEventFunc(domEventName, targetNode, targetInst), "focusout" !== domEventName || !(state = (node = targetNode)._wrapperState) || !state.controlled || "number" !== node.type || // If controlled, assign the value attribute to the current value on blur
                    setDefaultValue(node, "number", node.value);
                }(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget), /**
   * This plugin creates an `onSelect` event that normalizes select events
   * across form elements.
   *
   * Supported elements are:
   * - input (see `isTextInputElement`)
   * - textarea
   * - contentEditable
   *
   * This differs from native browser implementations in the following ways:
   * - Fires on contentEditable fields as well as inputs.
   * - Fires for collapsed selection.
   * - Fires after user input.
   */ function(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
                    var targetNode = targetInst ? getNodeFromInstance(targetInst) : window;
                    switch(domEventName){
                        // Track the input node that has focus.
                        case "focusin":
                            (isTextInputElement(targetNode) || "true" === targetNode.contentEditable) && (activeElement$1 = targetNode, activeElementInst$1 = targetInst, lastSelection = null);
                            break;
                        case "focusout":
                            activeElement$1 = null, activeElementInst$1 = null, lastSelection = null;
                            break;
                        // Don't fire the event while the user is dragging. This matches the
                        // semantics of the native select event.
                        case "mousedown":
                            mouseDown = !0;
                            break;
                        case "contextmenu":
                        case "mouseup":
                        case "dragend":
                            mouseDown = !1, constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
                            break;
                        // Chrome and IE fire non-standard event when selection is changed (and
                        // sometimes when it hasn't). IE's event fires out of order with respect
                        // to key and input events on deletion, so we discard it.
                        //
                        // Firefox doesn't support selectionchange, so check selection status
                        // after each key entry. The selection changes after keydown and before
                        // keyup, but we check on keydown as well in the case of holding down a
                        // key, when multiple keydown events are fired but only one keyup is.
                        // This is also our approach for IE handling, for the reason above.
                        case "selectionchange":
                            if (skipSelectionChangeEvent) break;
                        // falls through
                        case "keydown":
                        case "keyup":
                            constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
                    }
                }(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget), /**
   * @return {?object} A SyntheticCompositionEvent.
   */ function(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
                    if (canUseCompositionEvent) eventType = /**
   * Translate native top level events into event types.
   */ function(domEventName) {
                        switch(domEventName){
                            case "compositionstart":
                                return "onCompositionStart";
                            case "compositionend":
                                return "onCompositionEnd";
                            case "compositionupdate":
                                return "onCompositionUpdate";
                        }
                    }(domEventName);
                    else if (isComposing) isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd");
                    else "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
                    if (eventType) {
                        useFallbackCompositionData && !isUsingKoreanIME(nativeEvent) && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = getText(), isComposing = !0));
                        var eventType, fallbackData, listeners = accumulateTwoPhaseListeners(targetInst, eventType);
                        if (listeners.length > 0) {
                            var event = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget);
                            if (dispatchQueue.push({
                                event: event,
                                listeners: listeners
                            }), fallbackData) // Inject data generated from fallback path into the synthetic event.
                            // This matches the property of native CompositionEventInterface.
                            event.data = fallbackData;
                            else {
                                var customData = getDataFromCustomEvent(nativeEvent);
                                null !== customData && (event.data = customData);
                            }
                        }
                    }
                }(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget), /**
   * Extract a SyntheticInputEvent for `beforeInput`, based on either native
   * `textInput` or fallback behavior.
   *
   * @return {?object} A SyntheticInputEvent.
   */ function(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
                    // be fired.
                    if (chars = canUseTextInputEvent ? function(domEventName, nativeEvent) {
                        switch(domEventName){
                            case "compositionend":
                                return getDataFromCustomEvent(nativeEvent);
                            case "keypress":
                                if (32 !== nativeEvent.which) return null;
                                return hasSpaceKeypress = !0, " ";
                            case "textInput":
                                // Record the characters to be added to the DOM.
                                var chars = nativeEvent.data; // If it's a spacebar character, assume that we have already handled
                                // it at the keypress level and bail immediately. Android Chrome
                                // doesn't give us keycodes, so we need to ignore it.
                                if (" " === chars && hasSpaceKeypress) return null;
                                return chars;
                            default:
                                // For other native event types, do nothing.
                                return null;
                        }
                    }(domEventName, nativeEvent) : /**
   * For browsers that do not provide the `textInput` event, extract the
   * appropriate string to use for SyntheticInputEvent.
   */ function(domEventName, nativeEvent) {
                        // If we are currently composing (IME) and using a fallback to do so,
                        // try to extract the composed characters from the fallback object.
                        // If composition event is available, we extract a string only at
                        // compositionevent, otherwise extract it at fallback events.
                        if (isComposing) {
                            if ("compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent)) {
                                var chars = getData();
                                return root = null, startText = null, fallbackText = null, isComposing = !1, chars;
                            }
                            return null;
                        }
                        switch(domEventName){
                            case "paste":
                            default:
                                // If a paste event occurs after a keypress, throw out the input
                                // chars. Paste events should not lead to BeforeInput events.
                                return null;
                            case "keypress":
                                /**
         * As of v27, Firefox may fire keypress events even when no character
         * will be inserted. A few possibilities:
         *
         * - `which` is `0`. Arrow keys, Esc key, etc.
         *
         * - `which` is the pressed key code, but no char is available.
         *   Ex: 'AltGr + d` in Polish. There is no modified character for
         *   this key combination and no character is inserted into the
         *   document, but FF fires the keypress for char code `100` anyway.
         *   No `input` event will occur.
         *
         * - `which` is the pressed key code, but a command combination is
         *   being used. Ex: `Cmd+C`. No character is inserted, and no
         *   `input` event will occur.
         */ if (!((nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
                                !(nativeEvent.ctrlKey && nativeEvent.altKey))) {
                                    // IE fires the `keypress` event when a user types an emoji via
                                    // Touch keyboard of Windows.  In such a case, the `char` property
                                    // holds an emoji character like `\uD83D\uDE0A`.  Because its length
                                    // is 2, the property `which` does not represent an emoji correctly.
                                    // In such a case, we directly return the `char` property instead of
                                    // using `which`.
                                    if (nativeEvent.char && nativeEvent.char.length > 1) return nativeEvent.char;
                                    if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
                                }
                                return null;
                            case "compositionend":
                                return useFallbackCompositionData && !isUsingKoreanIME(nativeEvent) ? null : nativeEvent.data;
                        }
                    }(domEventName, nativeEvent)) {
                        var chars, listeners = accumulateTwoPhaseListeners(targetInst, "onBeforeInput");
                        if (listeners.length > 0) {
                            var event = new SyntheticCompositionEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget);
                            dispatchQueue.push({
                                event: event,
                                listeners: listeners
                            }), event.data = chars;
                        }
                    }
                }(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
            } // List of events that need to be individually attached to media elements.
            (dispatchQueue = [], domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags), processDispatchQueue(dispatchQueue, eventSystemFlags));
        });
    }
    function createDispatchListener(instance, listener, currentTarget) {
        return {
            instance: instance,
            listener: listener,
            currentTarget: currentTarget
        };
    }
    // - BeforeInputEventPlugin
    // - ChangeEventPlugin
    // - SelectEventPlugin
    // This is because we only process these plugins
    // in the bubble phase, so we need to accumulate two
    // phase event listeners (via emulation).
    function accumulateTwoPhaseListeners(targetFiber, reactName) {
        for(var captureName = reactName + "Capture", listeners = [], instance = targetFiber; null !== instance;){
            var _instance3 = instance, stateNode = _instance3.stateNode; // Handle listeners that are on HostComponents (i.e. <div>)
            if (5 === _instance3.tag && null !== stateNode) {
                var captureListener = getListener(instance, captureName);
                null != captureListener && listeners.unshift(createDispatchListener(instance, captureListener, stateNode));
                var bubbleListener = getListener(instance, reactName);
                null != bubbleListener && listeners.push(createDispatchListener(instance, bubbleListener, stateNode));
            }
            instance = instance.return;
        }
        return listeners;
    }
    function getParent(inst) {
        if (null === inst) return null;
        do inst = inst.return; // TODO: If this is a HostRoot we might want to bail out.
        while (inst && 5 !== inst.tag)
        return inst || null;
    }
    function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
        for(var registrationName = event._reactName, listeners = [], instance = target; null !== instance && instance !== common;){
            var _instance4 = instance, alternate = _instance4.alternate, stateNode = _instance4.stateNode, tag = _instance4.tag;
            if (null !== alternate && alternate === common) break;
            if (5 === tag && null !== stateNode) {
                if (inCapturePhase) {
                    var captureListener = getListener(instance, registrationName);
                    null != captureListener && listeners.unshift(createDispatchListener(instance, captureListener, stateNode));
                } else if (!inCapturePhase) {
                    var bubbleListener = getListener(instance, registrationName);
                    null != bubbleListener && listeners.push(createDispatchListener(instance, bubbleListener, stateNode));
                }
            }
            instance = instance.return;
        }
        0 !== listeners.length && dispatchQueue.push({
            event: event,
            listeners: listeners
        });
    } // We should only use this function for:
    function getListenerSetKey(domEventName, capture) {
        return domEventName + "__" + (capture ? "capture" : "bubble");
    }
    var didWarnInvalidHydration = !1, DANGEROUSLY_SET_INNER_HTML = "dangerouslySetInnerHTML", SUPPRESS_CONTENT_EDITABLE_WARNING = "suppressContentEditableWarning", SUPPRESS_HYDRATION_WARNING = "suppressHydrationWarning", AUTOFOCUS = "autoFocus", CHILDREN = "children", STYLE = "style", HTML$1 = "__html";
    warnedUnknownTags = {
        // There are working polyfills for <dialog>. Let people use it.
        dialog: !0,
        // Electron ships a custom <webview> tag to display external web content in
        // an isolated frame and process.
        // This tag is not present in non Electron environments such as JSDom which
        // is often used for testing purposes.
        // @see https://electronjs.org/docs/api/webview-tag
        webview: !0
    }, validatePropertiesInDevelopment = function(type, props) {
        var type1, props1, type2, props2, type3, props3, eventRegistry;
        isCustomComponent(type1 = type, props1 = props) || function(type, props) {
            var invalidProps = [];
            for(var key in props)!function(tagName, name) {
                if (hasOwnProperty$1.call(warnedProperties, name) && warnedProperties[name]) return !0;
                if (rARIACamel.test(name)) {
                    var ariaName = "aria-" + name.slice(4).toLowerCase(), correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
                    // DOM properties, then it is an invalid aria-* attribute.
                    if (null == correctName) return error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name), warnedProperties[name] = !0, !0;
                     // aria-* attributes should be lowercase; suggest the lowercase version.
                    if (name !== correctName) return error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName), warnedProperties[name] = !0, !0;
                }
                if (rARIA.test(name)) {
                    var lowerCasedName = name.toLowerCase(), standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
                    // DOM properties, then it is an invalid aria-* attribute.
                    if (null == standardName) return warnedProperties[name] = !0, !1;
                     // aria-* attributes should be lowercase; suggest the lowercase version.
                    name !== standardName && (error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName), warnedProperties[name] = !0);
                }
                return !0;
            }(0, key) && invalidProps.push(key);
            var unknownPropString = invalidProps.map(function(prop) {
                return "`" + prop + "`";
            }).join(", ");
            1 === invalidProps.length ? error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type) : invalidProps.length > 1 && error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
        }(type1, props1), type2 = type, props2 = props, ("input" === type2 || "textarea" === type2 || "select" === type2) && (null == props2 || null !== props2.value || didWarnValueNull || (didWarnValueNull = !0, "select" === type2 && props2.multiple ? error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type2) : error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type2))), type3 = type, props3 = props, eventRegistry = {
            registrationNameDependencies: registrationNameDependencies,
            possibleRegistrationNames: possibleRegistrationNames
        }, isCustomComponent(type3, props3) || warnUnknownProperties(type3, props3, eventRegistry);
    }, // browsers. It adds spaces and sorts the properties in some
    // non-alphabetical order. Handling that would require sorting CSS
    // properties in the client & server versions or applying
    // `expectedStyle` to a temporary DOM node to read its `style` attribute
    // normalized. Since it only affects IE, we're skipping style warnings
    // in that browser completely in favor of doing all that work.
    // See https://github.com/facebook/react/issues/11807
    canDiffStyleForHydrationWarning = canUseDOM && !document.documentMode;
    // It also can turn \u0000 into \uFFFD inside attributes.
    // https://www.w3.org/TR/html5/single-page.html#preprocessing-the-input-stream
    // If we have a mismatch, it might be caused by that.
    // We will still patch up in this case but not fire the warning.
    var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
    function getOwnerDocumentFromRootContainer(rootContainerElement) {
        return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
    }
    function noop() {}
    function trapClickOnNonInteractiveElement(node) {
        // Mobile Safari does not fire properly bubble click events on
        // non-interactive elements, which means delegated click listeners do not
        // fire. The workaround for this bug involves attaching an empty click
        // listener on the target node.
        // https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
        // Just set it using the onclick property so that we don't have to manage any
        // bookkeeping for it. Not sure if we need to clear it when the listener is
        // removed.
        // TODO: Only do this for the relevant Safaris maybe?
        node.onclick = noop;
    }
    function warnForUnmatchedText(textNode, text) {
        warnForTextDifference(textNode.nodeValue, text);
    }
    function warnForDeletedHydratableElement(parentNode, child) {
        !didWarnInvalidHydration && (didWarnInvalidHydration = !0, error("Did not expect server HTML to contain a <%s> in <%s>.", child.nodeName.toLowerCase(), parentNode.nodeName.toLowerCase()));
    }
    function warnForDeletedHydratableText(parentNode, child) {
        !didWarnInvalidHydration && (didWarnInvalidHydration = !0, error('Did not expect server HTML to contain the text node "%s" in <%s>.', child.nodeValue, parentNode.nodeName.toLowerCase()));
    }
    function warnForInsertedHydratedElement(parentNode, tag, props) {
        !didWarnInvalidHydration && (didWarnInvalidHydration = !0, error("Expected server HTML to contain a matching <%s> in <%s>.", tag, parentNode.nodeName.toLowerCase()));
    }
    function warnForInsertedHydratedText(parentNode, text) {
        "" !== text && !didWarnInvalidHydration && (didWarnInvalidHydration = !0, error('Expected server HTML to contain a matching text node for "%s" in <%s>.', text, parentNode.nodeName.toLowerCase()));
    }
    normalizeMarkupForTextOrAttribute = function(markup) {
        return ("string" == typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
    }, warnForTextDifference = function(serverText, clientText) {
        if (!didWarnInvalidHydration) {
            var normalizedClientText = normalizeMarkupForTextOrAttribute(clientText), normalizedServerText = normalizeMarkupForTextOrAttribute(serverText);
            normalizedServerText !== normalizedClientText && (didWarnInvalidHydration = !0, error('Text content did not match. Server: "%s" Client: "%s"', normalizedServerText, normalizedClientText));
        }
    }, warnForPropDifference = function(propName, serverValue, clientValue) {
        if (!didWarnInvalidHydration) {
            var normalizedClientValue = normalizeMarkupForTextOrAttribute(clientValue), normalizedServerValue = normalizeMarkupForTextOrAttribute(serverValue);
            normalizedServerValue !== normalizedClientValue && (didWarnInvalidHydration = !0, error("Prop `%s` did not match. Server: %s Client: %s", propName, JSON.stringify(normalizedServerValue), JSON.stringify(normalizedClientValue)));
        }
    }, warnForExtraAttributes = function(attributeNames) {
        if (!didWarnInvalidHydration) {
            didWarnInvalidHydration = !0;
            var names = [];
            attributeNames.forEach(function(name) {
                names.push(name);
            }), error("Extra attributes from the server: %s", names);
        }
    }, warnForInvalidEventListener = function(registrationName, listener) {
        !1 === listener ? error("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", registrationName, registrationName, registrationName) : error("Expected `%s` listener to be a function, instead got a value of `%s` type.", registrationName, typeof listener);
    }, // can be used for comparison.
    normalizeHTML = function(parent, html) {
        // We could have created a separate document here to avoid
        // re-initializing custom elements if they exist. But this breaks
        // how <noscript> is being handled. So we use the same document.
        // See the discussion in https://github.com/facebook/react/pull/11157.
        var testElement = parent.namespaceURI === HTML_NAMESPACE ? parent.ownerDocument.createElement(parent.tagName) : parent.ownerDocument.createElementNS(parent.namespaceURI, parent.tagName);
        return testElement.innerHTML = html, testElement.innerHTML;
    };
    var validateDOMNesting = function() {}, updatedAncestorInfo = function() {}, specialTags = [
        "address",
        "applet",
        "area",
        "article",
        "aside",
        "base",
        "basefont",
        "bgsound",
        "blockquote",
        "body",
        "br",
        "button",
        "caption",
        "center",
        "col",
        "colgroup",
        "dd",
        "details",
        "dir",
        "div",
        "dl",
        "dt",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "frame",
        "frameset",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "iframe",
        "img",
        "input",
        "isindex",
        "li",
        "link",
        "listing",
        "main",
        "marquee",
        "menu",
        "menuitem",
        "meta",
        "nav",
        "noembed",
        "noframes",
        "noscript",
        "object",
        "ol",
        "p",
        "param",
        "plaintext",
        "pre",
        "script",
        "section",
        "select",
        "source",
        "style",
        "summary",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "title",
        "tr",
        "track",
        "ul",
        "wbr",
        "xmp"
    ], inScopeTags = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
    ], buttonScopeTags = inScopeTags.concat([
        "button"
    ]), impliedEndTags = [
        "dd",
        "dt",
        "li",
        "option",
        "optgroup",
        "p",
        "rp",
        "rt"
    ], emptyAncestorInfo = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
    };
    updatedAncestorInfo = function(oldInfo, tag) {
        var ancestorInfo = _assign({}, oldInfo || emptyAncestorInfo), info = {
            tag: tag
        };
        return -1 !== inScopeTags.indexOf(tag) && (ancestorInfo.aTagInScope = null, ancestorInfo.buttonTagInScope = null, ancestorInfo.nobrTagInScope = null), -1 !== buttonScopeTags.indexOf(tag) && (ancestorInfo.pTagInButtonScope = null), -1 !== specialTags.indexOf(tag) && "address" !== tag && "div" !== tag && "p" !== tag && (ancestorInfo.listItemTagAutoclosing = null, ancestorInfo.dlItemTagAutoclosing = null), ancestorInfo.current = info, "form" === tag && (ancestorInfo.formTag = info), "a" === tag && (ancestorInfo.aTagInScope = info), "button" === tag && (ancestorInfo.buttonTagInScope = info), "nobr" === tag && (ancestorInfo.nobrTagInScope = info), "p" === tag && (ancestorInfo.pTagInButtonScope = info), "li" === tag && (ancestorInfo.listItemTagAutoclosing = info), ("dd" === tag || "dt" === tag) && (ancestorInfo.dlItemTagAutoclosing = info), ancestorInfo;
    };
    /**
     * Returns whether
     */ var isTagValidWithParent = function(tag, parentTag) {
        // First, let's check if we're in an unusual parsing mode...
        switch(parentTag){
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
            case "select":
                return "option" === tag || "optgroup" === tag || "#text" === tag;
            case "optgroup":
                return "option" === tag || "#text" === tag;
            // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
            // but
            case "option":
                return "#text" === tag;
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
            // No special behavior since these rules fall back to "in body" mode for
            // all except special table nodes which cause bad parsing behavior anyway.
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
            case "tr":
                return "th" === tag || "td" === tag || "style" === tag || "script" === tag || "template" === tag;
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
            case "tbody":
            case "thead":
            case "tfoot":
                return "tr" === tag || "style" === tag || "script" === tag || "template" === tag;
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
            case "colgroup":
                return "col" === tag || "template" === tag;
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
            case "table":
                return "caption" === tag || "colgroup" === tag || "tbody" === tag || "tfoot" === tag || "thead" === tag || "style" === tag || "script" === tag || "template" === tag;
            // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
            case "head":
                return "base" === tag || "basefont" === tag || "bgsound" === tag || "link" === tag || "meta" === tag || "title" === tag || "noscript" === tag || "noframes" === tag || "style" === tag || "script" === tag || "template" === tag;
            // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
            case "html":
                return "head" === tag || "body" === tag || "frameset" === tag;
            case "frameset":
                return "frame" === tag;
            case "#document":
                return "html" === tag;
        } // Probably in the "in body" parsing mode, so we outlaw only tag combos
        // where the parsing rules cause implicit opens or closes to be added.
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
        switch(tag){
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
                return "h1" !== parentTag && "h2" !== parentTag && "h3" !== parentTag && "h4" !== parentTag && "h5" !== parentTag && "h6" !== parentTag;
            case "rp":
            case "rt":
                return -1 === impliedEndTags.indexOf(parentTag);
            case "body":
            case "caption":
            case "col":
            case "colgroup":
            case "frameset":
            case "frame":
            case "head":
            case "html":
            case "tbody":
            case "td":
            case "tfoot":
            case "th":
            case "thead":
            case "tr":
                // These tags are only valid with a few parents that have special child
                // parsing rules -- if we're down here, then none of those matched and
                // so we allow it only if we don't know what the parent is, as all other
                // cases are invalid.
                return null == parentTag;
        }
        return !0;
    }, findInvalidAncestorForTag = function(tag, ancestorInfo) {
        switch(tag){
            case "address":
            case "article":
            case "aside":
            case "blockquote":
            case "center":
            case "details":
            case "dialog":
            case "dir":
            case "div":
            case "dl":
            case "fieldset":
            case "figcaption":
            case "figure":
            case "footer":
            case "header":
            case "hgroup":
            case "main":
            case "menu":
            case "nav":
            case "ol":
            case "p":
            case "section":
            case "summary":
            case "ul":
            case "pre":
            case "listing":
            case "table":
            case "hr":
            case "xmp":
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
                return ancestorInfo.pTagInButtonScope;
            case "form":
                return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;
            case "li":
                return ancestorInfo.listItemTagAutoclosing;
            case "dd":
            case "dt":
                return ancestorInfo.dlItemTagAutoclosing;
            case "button":
                return ancestorInfo.buttonTagInScope;
            case "a":
                // Spec says something about storing a list of markers, but it sounds
                // equivalent to this check.
                return ancestorInfo.aTagInScope;
            case "nobr":
                return ancestorInfo.nobrTagInScope;
        }
        return null;
    }, didWarn$1 = {};
    validateDOMNesting = function(childTag, childText, ancestorInfo) {
        var parentInfo = (ancestorInfo = ancestorInfo || emptyAncestorInfo).current, parentTag = parentInfo && parentInfo.tag;
        null != childText && (null != childTag && error("validateDOMNesting: when childText is passed, childTag should be null"), childTag = "#text");
        var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo, invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo), invalidParentOrAncestor = invalidParent || invalidAncestor;
        if (invalidParentOrAncestor) {
            var ancestorTag = invalidParentOrAncestor.tag, warnKey = !!invalidParent + "|" + childTag + "|" + ancestorTag;
            if (!didWarn$1[warnKey]) {
                didWarn$1[warnKey] = !0;
                var tagDisplayName = childTag, whitespaceInfo = "";
                if ("#text" === childTag ? /\S/.test(childText) ? tagDisplayName = "Text nodes" : (tagDisplayName = "Whitespace text nodes", whitespaceInfo = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : tagDisplayName = "<" + childTag + ">", invalidParent) {
                    var info = "";
                    "table" === ancestorTag && "tr" === childTag && (info += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), error("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", tagDisplayName, ancestorTag, whitespaceInfo, info);
                } else error("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", tagDisplayName, ancestorTag);
            }
        }
    }, SUPPRESS_HYDRATION_WARNING$1 = "suppressHydrationWarning";
    var eventsEnabled = null, selectionInformation = null;
    function shouldAutoFocusHostComponent(type, props) {
        switch(type){
            case "button":
            case "input":
            case "select":
            case "textarea":
                return !!props.autoFocus;
        }
        return !1;
    }
    function shouldSetTextContent(type, props) {
        return "textarea" === type || "option" === type || "noscript" === type || "string" == typeof props.children || "number" == typeof props.children || "object" == typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
    }
    // if a component just imports ReactDOM (e.g. for findDOMNode).
    // Some environments might not have setTimeout or clearTimeout.
    var scheduleTimeout = "function" == typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" == typeof clearTimeout ? clearTimeout : void 0;
    function clearContainer(container) {
        if (1 === container.nodeType) container.textContent = "";
        else if (9 === container.nodeType) {
            var body = container.body;
            null != body && (body.textContent = "");
        }
    } // -------------------
    function getNextHydratable(node) {
        // Skip non-hydratable nodes.
        for(; null != node; node = node.nextSibling){
            var nodeType = node.nodeType;
            if (1 === nodeType || 3 === nodeType) break;
        }
        return node;
    }
    function getNextHydratableSibling(instance) {
        return getNextHydratable(instance.nextSibling);
    }
    function getFirstHydratableChild(parentInstance) {
        return getNextHydratable(parentInstance.firstChild);
    }
    // SuspenseInstance. I.e. if its previous sibling is a Comment with
    // SUSPENSE_x_START_DATA. Otherwise, null.
    function getParentSuspenseInstance(targetInstance) {
        for(var node = targetInstance.previousSibling, depth = 0; node;){
            if (8 === node.nodeType) {
                var data = node.data;
                if ("$" === data || "$!" === data || "$?" === data) {
                    if (0 === depth) return node;
                    depth--;
                } else "/$" === data && depth++;
            }
            node = node.previousSibling;
        }
        return null;
    }
    var clientId = 0;
    function makeClientIdInDEV(warnOnAccessInDEV) {
        var id = "r:" + (clientId++).toString(36);
        return {
            toString: function() {
                return warnOnAccessInDEV(), id;
            },
            valueOf: function() {
                return warnOnAccessInDEV(), id;
            }
        };
    }
    var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey;
    // If the target node is part of a hydrated or not yet rendered subtree, then
    // this may also return a SuspenseComponent or HostRoot to indicate that.
    // Conceptually the HostRoot fiber is a child of the Container node. So if you
    // pass the Container node as the targetNode, you will not actually get the
    // HostRoot back. To get to the HostRoot, you need to pass a child of it.
    // The same thing applies to Suspense boundaries.
    function getClosestInstanceFromNode(targetNode) {
        var targetInst = targetNode[internalInstanceKey];
        if (targetInst) // Don't return HostRoot or SuspenseComponent here.
        return targetInst;
         // If the direct event target isn't a React owned DOM node, we need to look
        for(// to see if one of its parents is a React owned DOM node.
        var parentNode = targetNode.parentNode; parentNode;){
            if (// We'll check if this is a container root that could include
            // React nodes in the future. We need to check this first because
            // if we're a child of a dehydrated container, we need to first
            // find that inner container before moving on to finding the parent
            // instance. Note that we don't check this field on  the targetNode
            // itself because the fibers are conceptually between the container
            // node and the first child. It isn't surrounding the container node.
            // If it's not a container, we check if it's an instance.
            targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
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
                var alternate = targetInst.alternate;
                if (null !== targetInst.child || null !== alternate && null !== alternate.child) for(// Next we need to figure out if the node that skipped past is
                // nested within a dehydrated boundary and if so, which one.
                var suspenseInstance = getParentSuspenseInstance(targetNode); null !== suspenseInstance;){
                    // We found a suspense instance. That means that we haven't
                    // hydrated it yet. Even though we leave the comments in the
                    // DOM after hydrating, and there are boundaries in the DOM
                    // that could already be hydrated, we wouldn't have found them
                    // through this pass since if the target is hydrated it would
                    // have had an internalInstanceKey on it.
                    // Let's get the fiber associated with the SuspenseComponent
                    // as the deepest instance.
                    var targetSuspenseInst = suspenseInstance[internalInstanceKey];
                    if (targetSuspenseInst) return targetSuspenseInst;
                     // If we don't find a Fiber on the comment, it might be because
                    // we haven't gotten to hydrate it yet. There might still be a
                    // parent boundary that hasn't above this one so we need to find
                    // the outer most that is known.
                    suspenseInstance = getParentSuspenseInstance(suspenseInstance); // If we don't find one, then that should mean that the parent
                // host component also hasn't hydrated yet. We can return it
                // below since it will bail out on the isMounted check later.
                }
                return targetInst;
            }
            parentNode = (targetNode = parentNode).parentNode;
        }
        return null;
    }
    /**
   * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
   * instance, or null if the node was not rendered by this React.
   */ function getInstanceFromNode(node) {
        var inst = node[internalInstanceKey] || node[internalContainerInstanceKey];
        return inst && (5 === inst.tag || 6 === inst.tag || 13 === inst.tag || 3 === inst.tag) ? inst : null;
    }
    /**
   * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
   * DOM node.
   */ function getNodeFromInstance(inst) {
        if (5 === inst.tag || 6 === inst.tag) // In Fiber this, is just the state node right now. We assume it will be
        // a host component or host text.
        return inst.stateNode;
         // Without this first invariant, passing a non-DOM-component triggers the next
        throw Error("getNodeFromInstance: Invalid argument.");
    }
    function getFiberCurrentPropsFromNode(node) {
        return node[internalPropsKey] || null;
    }
    function getEventListenerSet(node) {
        var elementListenerSet = node[internalEventHandlersKey];
        return void 0 === elementListenerSet && (elementListenerSet = node[internalEventHandlersKey] = new Set()), elementListenerSet;
    }
    var loggedTypeFailures = {}, ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
    function setCurrentlyValidatingElement(element) {
        if (element) {
            var owner = element._owner, stack = function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
                if (null == type) return "";
                if ("function" == typeof type) return describeNativeComponentFrame(type, !!((prototype = type.prototype) && prototype.isReactComponent));
                if ("string" == typeof type) return describeBuiltInComponentFrame(type);
                switch(type){
                    case REACT_SUSPENSE_TYPE:
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
            }(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
        } else ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
    function checkPropTypes(typeSpecs, values, location, componentName, element) {
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
    }
    var valueStack = [];
    fiberStack = [];
    var index = -1;
    function createCursor(defaultValue) {
        return {
            current: defaultValue
        };
    }
    function pop(cursor, fiber) {
        if (index < 0) {
            error("Unexpected pop.");
            return;
        }
        fiber !== fiberStack[index] && error("Unexpected Fiber popped."), cursor.current = valueStack[index], valueStack[index] = null, fiberStack[index] = null, index--;
    }
    function push(cursor, value, fiber) {
        valueStack[++index] = cursor.current, fiberStack[index] = fiber, cursor.current = value;
    }
    warnedAboutMissingGetChildContext = {};
    var emptyContextObject = {};
    Object.freeze(emptyContextObject);
    var contextStackCursor = createCursor(emptyContextObject), didPerformWorkStackCursor = createCursor(!1), previousContext = emptyContextObject; // A cursor to a boolean indicating whether the context has changed.
    function getUnmaskedContext(workInProgress, Component, didPushOwnContextIfProvider) {
        return didPushOwnContextIfProvider && isContextProvider(Component) ? previousContext : contextStackCursor.current;
    }
    function cacheContext(workInProgress, unmaskedContext, maskedContext) {
        var instance = workInProgress.stateNode;
        instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext, instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
    }
    function getMaskedContext(workInProgress, unmaskedContext) {
        var type = workInProgress.type, contextTypes = type.contextTypes;
        if (!contextTypes) return emptyContextObject;
         // Avoid recreating masked context unless unmasked context has changed.
        // Failing to do this will result in unnecessary calls to componentWillReceiveProps.
        // This may trigger infinite loops if componentWillReceiveProps calls setState.
        var instance = workInProgress.stateNode;
        if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) return instance.__reactInternalMemoizedMaskedChildContext;
        var context = {};
        for(var key in contextTypes)context[key] = unmaskedContext[key];
        return checkPropTypes(contextTypes, context, "context", getComponentName(type) || "Unknown"), instance && cacheContext(workInProgress, unmaskedContext, context), context;
    }
    function hasContextChanged() {
        return didPerformWorkStackCursor.current;
    }
    function isContextProvider(type) {
        return null != type.childContextTypes;
    }
    function popContext(fiber) {
        pop(didPerformWorkStackCursor, fiber), pop(contextStackCursor, fiber);
    }
    function popTopLevelContextObject(fiber) {
        pop(didPerformWorkStackCursor, fiber), pop(contextStackCursor, fiber);
    }
    function pushTopLevelContextObject(fiber, context, didChange) {
        if (contextStackCursor.current !== emptyContextObject) throw Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        push(contextStackCursor, context, fiber), push(didPerformWorkStackCursor, didChange, fiber);
    }
    function processChildContext(fiber, type, parentContext) {
        var instance = fiber.stateNode, childContextTypes = type.childContextTypes;
        // It has only been added in Fiber to match the (unintentional) behavior in Stack.
        if ("function" != typeof instance.getChildContext) {
            var componentName = getComponentName(type) || "Unknown";
            return warnedAboutMissingGetChildContext[componentName] || (warnedAboutMissingGetChildContext[componentName] = !0, error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName)), parentContext;
        }
        var childContext = instance.getChildContext();
        for(var contextKey in childContext)if (!(contextKey in childContextTypes)) throw Error((getComponentName(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
        return checkPropTypes(childContextTypes, childContext, "child context", getComponentName(type) || "Unknown"), _assign({}, parentContext, childContext);
    }
    function pushContextProvider(workInProgress) {
        var instance = workInProgress.stateNode, memoizedMergedChildContext = instance && instance.__reactInternalMemoizedMergedChildContext || emptyContextObject; // We push the context as early as possible to ensure stack integrity.
        return(// Inherit the parent's did-perform-work value to avoid inadvertently blocking updates.
        previousContext = contextStackCursor.current, push(contextStackCursor, memoizedMergedChildContext, workInProgress), push(didPerformWorkStackCursor, didPerformWorkStackCursor.current, workInProgress), !0);
    }
    function invalidateContextProvider(workInProgress, type, didChange) {
        var instance = workInProgress.stateNode;
        if (!instance) throw Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (didChange) {
            // Merge parent and own context.
            // Skip this if we're not updating due to sCU.
            // This avoids unnecessarily recomputing memoized values.
            var mergedContext = processChildContext(workInProgress, type, previousContext);
            instance.__reactInternalMemoizedMergedChildContext = mergedContext, // It is important to unwind the context in the reverse order.
            pop(didPerformWorkStackCursor, workInProgress), pop(contextStackCursor, workInProgress), push(contextStackCursor, mergedContext, workInProgress), push(didPerformWorkStackCursor, didChange, workInProgress);
        } else pop(didPerformWorkStackCursor, workInProgress), push(didPerformWorkStackCursor, didChange, workInProgress);
    }
    var rendererID = null, injectedHook = null, hasLoggedError = !1, isDevToolsPresent = "undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__;
    // Provide explicit error message when production+profiling bundle of e.g.
    // react-dom is used with production (non-profiling) bundle of
    // scheduler/tracing
    if (!(null != __interactionsRef && null != __interactionsRef.current)) throw Error("It is not supported to run the profiling version of a renderer (for example, `react-dom/profiling`) without also replacing the `scheduler/tracing` module with `scheduler/tracing-profiling`. Your bundler might have a setting for aliasing both modules. Learn more at https://reactjs.org/link/profiling");
    var fakeCallbackNode = {}, requestPaint = void 0 !== unstable_requestPaint ? unstable_requestPaint : function() {}, syncQueue = null, immediateQueueCallbackNode = null, isFlushingSyncQueue = !1, initialTimeMs$1 = unstable_now(), now = initialTimeMs$1 < 10000 ? unstable_now : function() {
        return unstable_now() - initialTimeMs$1;
    }; // Except for NoPriority, these correspond to Scheduler priorities. We use
    function getCurrentPriorityLevel() {
        switch(unstable_getCurrentPriorityLevel()){
            case unstable_ImmediatePriority:
                return 99;
            case unstable_UserBlockingPriority:
                return 98;
            case unstable_NormalPriority:
                return 97;
            case unstable_LowPriority:
                return 96;
            case unstable_IdlePriority:
                return 95;
            default:
                throw Error("Unknown priority level.");
        }
    }
    function reactPriorityToSchedulerPriority(reactPriorityLevel) {
        switch(reactPriorityLevel){
            case 99:
                return unstable_ImmediatePriority;
            case 98:
                return unstable_UserBlockingPriority;
            case 97:
                return unstable_NormalPriority;
            case 96:
                return unstable_LowPriority;
            case 95:
                return unstable_IdlePriority;
            default:
                throw Error("Unknown priority level.");
        }
    }
    function runWithPriority$1(reactPriorityLevel, fn) {
        return unstable_runWithPriority(reactPriorityToSchedulerPriority(reactPriorityLevel), fn);
    }
    function scheduleCallback(reactPriorityLevel, callback, options) {
        return unstable_scheduleCallback(reactPriorityToSchedulerPriority(reactPriorityLevel), callback, options);
    }
    function flushSyncCallbackQueue() {
        if (null !== immediateQueueCallbackNode) {
            var node = immediateQueueCallbackNode;
            immediateQueueCallbackNode = null, unstable_cancelCallback(node);
        }
        flushSyncCallbackQueueImpl();
    }
    function flushSyncCallbackQueueImpl() {
        if (!isFlushingSyncQueue && null !== syncQueue) {
            // Prevent re-entrancy.
            isFlushingSyncQueue = !0;
            var i = 0;
            try {
                var _queue = syncQueue;
                runWithPriority$1(99, function() {
                    for(; i < _queue.length; i++){
                        var callback = _queue[i];
                        do callback = callback(!0);
                        while (null !== callback)
                    }
                }), syncQueue = null;
            } catch (error) {
                throw null !== syncQueue && (syncQueue = syncQueue.slice(i + 1)), unstable_scheduleCallback(unstable_ImmediatePriority, flushSyncCallbackQueue), error;
            } finally{
                isFlushingSyncQueue = !1;
            }
        }
    }
    // TODO: this is special because it gets imported during build.
    var ReactVersion = "17.0.2", ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig, ReactStrictModeWarnings = {
        recordUnsafeLifecycleWarnings: function(fiber, instance) {},
        flushPendingUnsafeLifecycleWarnings: function() {},
        recordLegacyContextWarning: function(fiber, instance) {},
        flushLegacyContextWarning: function() {},
        discardPendingWarnings: function() {}
    }, findStrictRoot = function(fiber) {
        for(var maybeStrictRoot = null, node = fiber; null !== node;)1 & node.mode && (maybeStrictRoot = node), node = node.return;
        return maybeStrictRoot;
    }, setToSortedString = function(set) {
        var array = [];
        return set.forEach(function(value) {
            array.push(value);
        }), array.sort().join(", ");
    }, pendingComponentWillMountWarnings = [], pendingUNSAFE_ComponentWillMountWarnings = [], pendingComponentWillReceivePropsWarnings = [], pendingUNSAFE_ComponentWillReceivePropsWarnings = [], pendingComponentWillUpdateWarnings = [], pendingUNSAFE_ComponentWillUpdateWarnings = [], didWarnAboutUnsafeLifecycles = new Set();
    ReactStrictModeWarnings.recordUnsafeLifecycleWarnings = function(fiber, instance) {
        // Dedup strategy: Warn once per component.
        !didWarnAboutUnsafeLifecycles.has(fiber.type) && ("function" == typeof instance.componentWillMount && // Don't warn about react-lifecycles-compat polyfilled components.
        !0 !== instance.componentWillMount.__suppressDeprecationWarning && pendingComponentWillMountWarnings.push(fiber), 1 & fiber.mode && "function" == typeof instance.UNSAFE_componentWillMount && pendingUNSAFE_ComponentWillMountWarnings.push(fiber), "function" == typeof instance.componentWillReceiveProps && !0 !== instance.componentWillReceiveProps.__suppressDeprecationWarning && pendingComponentWillReceivePropsWarnings.push(fiber), 1 & fiber.mode && "function" == typeof instance.UNSAFE_componentWillReceiveProps && pendingUNSAFE_ComponentWillReceivePropsWarnings.push(fiber), "function" == typeof instance.componentWillUpdate && !0 !== instance.componentWillUpdate.__suppressDeprecationWarning && pendingComponentWillUpdateWarnings.push(fiber), 1 & fiber.mode && "function" == typeof instance.UNSAFE_componentWillUpdate && pendingUNSAFE_ComponentWillUpdateWarnings.push(fiber));
    }, ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings = function() {
        // We do an initial pass to gather component names
        var componentWillMountUniqueNames = new Set();
        pendingComponentWillMountWarnings.length > 0 && (pendingComponentWillMountWarnings.forEach(function(fiber) {
            componentWillMountUniqueNames.add(getComponentName(fiber.type) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
        }), pendingComponentWillMountWarnings = []);
        var UNSAFE_componentWillMountUniqueNames = new Set();
        pendingUNSAFE_ComponentWillMountWarnings.length > 0 && (pendingUNSAFE_ComponentWillMountWarnings.forEach(function(fiber) {
            UNSAFE_componentWillMountUniqueNames.add(getComponentName(fiber.type) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
        }), pendingUNSAFE_ComponentWillMountWarnings = []);
        var componentWillReceivePropsUniqueNames = new Set();
        pendingComponentWillReceivePropsWarnings.length > 0 && (pendingComponentWillReceivePropsWarnings.forEach(function(fiber) {
            componentWillReceivePropsUniqueNames.add(getComponentName(fiber.type) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
        }), pendingComponentWillReceivePropsWarnings = []);
        var UNSAFE_componentWillReceivePropsUniqueNames = new Set();
        pendingUNSAFE_ComponentWillReceivePropsWarnings.length > 0 && (pendingUNSAFE_ComponentWillReceivePropsWarnings.forEach(function(fiber) {
            UNSAFE_componentWillReceivePropsUniqueNames.add(getComponentName(fiber.type) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
        }), pendingUNSAFE_ComponentWillReceivePropsWarnings = []);
        var componentWillUpdateUniqueNames = new Set();
        pendingComponentWillUpdateWarnings.length > 0 && (pendingComponentWillUpdateWarnings.forEach(function(fiber) {
            componentWillUpdateUniqueNames.add(getComponentName(fiber.type) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
        }), pendingComponentWillUpdateWarnings = []);
        var UNSAFE_componentWillUpdateUniqueNames = new Set();
        pendingUNSAFE_ComponentWillUpdateWarnings.length > 0 && (pendingUNSAFE_ComponentWillUpdateWarnings.forEach(function(fiber) {
            UNSAFE_componentWillUpdateUniqueNames.add(getComponentName(fiber.type) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
        }), pendingUNSAFE_ComponentWillUpdateWarnings = []), UNSAFE_componentWillMountUniqueNames.size > 0 && error("Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n\nPlease update the following components: %s", setToSortedString(UNSAFE_componentWillMountUniqueNames)), UNSAFE_componentWillReceivePropsUniqueNames.size > 0 && error("Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state\n\nPlease update the following components: %s", setToSortedString(UNSAFE_componentWillReceivePropsUniqueNames)), UNSAFE_componentWillUpdateUniqueNames.size > 0 && error("Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n\nPlease update the following components: %s", setToSortedString(UNSAFE_componentWillUpdateUniqueNames)), componentWillMountUniqueNames.size > 0 && warn("componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", setToSortedString(componentWillMountUniqueNames)), componentWillReceivePropsUniqueNames.size > 0 && warn("componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state\n* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", setToSortedString(componentWillReceivePropsUniqueNames)), componentWillUpdateUniqueNames.size > 0 && warn("componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", setToSortedString(componentWillUpdateUniqueNames));
    };
    var pendingLegacyContextWarning = new Map(), didWarnAboutLegacyContext = new Set(); // Tracks components we have already warned about.
    function resolveDefaultProps(Component, baseProps) {
        if (Component && Component.defaultProps) {
            // Resolve default props. Taken from ReactElement
            var props = _assign({}, baseProps), defaultProps = Component.defaultProps;
            for(var propName in defaultProps)void 0 === props[propName] && (props[propName] = defaultProps[propName]);
            return props;
        }
        return baseProps;
    }
    ReactStrictModeWarnings.recordLegacyContextWarning = function(fiber, instance) {
        var strictRoot = findStrictRoot(fiber);
        if (null === strictRoot) {
            error("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
            return;
        } // Dedup strategy: Warn once per component.
        if (!didWarnAboutLegacyContext.has(fiber.type)) {
            var warningsForRoot = pendingLegacyContextWarning.get(strictRoot);
            (null != fiber.type.contextTypes || null != fiber.type.childContextTypes || null !== instance && "function" == typeof instance.getChildContext) && (void 0 === warningsForRoot && (warningsForRoot = [], pendingLegacyContextWarning.set(strictRoot, warningsForRoot)), warningsForRoot.push(fiber));
        }
    }, ReactStrictModeWarnings.flushLegacyContextWarning = function() {
        pendingLegacyContextWarning.forEach(function(fiberArray, strictRoot) {
            if (0 !== fiberArray.length) {
                var firstFiber = fiberArray[0], uniqueNames = new Set();
                fiberArray.forEach(function(fiber) {
                    uniqueNames.add(getComponentName(fiber.type) || "Component"), didWarnAboutLegacyContext.add(fiber.type);
                });
                var sortedNames = setToSortedString(uniqueNames);
                try {
                    setCurrentFiber(firstFiber), error("Legacy context API has been detected within a strict-mode tree.\n\nThe old API will be supported in all 16.x releases, but applications using it should migrate to the new version.\n\nPlease update the following components: %s\n\nLearn more about this warning here: https://reactjs.org/link/legacy-context", sortedNames);
                } finally{
                    resetCurrentFiber();
                }
            }
        });
    }, ReactStrictModeWarnings.discardPendingWarnings = function() {
        pendingComponentWillMountWarnings = [], pendingUNSAFE_ComponentWillMountWarnings = [], pendingComponentWillReceivePropsWarnings = [], pendingUNSAFE_ComponentWillReceivePropsWarnings = [], pendingComponentWillUpdateWarnings = [], pendingUNSAFE_ComponentWillUpdateWarnings = [], pendingLegacyContextWarning = new Map();
    };
    var valueCursor = createCursor(null);
    // Use this to detect multiple renderers using the same context
    rendererSigil = {};
    var currentlyRenderingFiber = null, lastContextDependency = null, lastContextWithAllBitsObserved = null, isDisallowedContextReadInDEV = !1;
    function resetContextDependencies() {
        // This is called right before React yields execution, to ensure `readContext`
        // cannot be called outside the render phase.
        currentlyRenderingFiber = null, lastContextDependency = null, lastContextWithAllBitsObserved = null, isDisallowedContextReadInDEV = !1;
    }
    function pushProvider(providerFiber, nextValue) {
        var context = providerFiber.type._context;
        push(valueCursor, context._currentValue, providerFiber), context._currentValue = nextValue, void 0 !== context._currentRenderer && null !== context._currentRenderer && context._currentRenderer !== rendererSigil && error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), context._currentRenderer = rendererSigil;
    }
    function popProvider(providerFiber) {
        var currentValue = valueCursor.current;
        pop(valueCursor, providerFiber), providerFiber.type._context._currentValue = currentValue;
    }
    function scheduleWorkOnParentPath(parent, renderLanes) {
        for(// Update the child lanes of all the ancestors, including the alternates.
        var node = parent; null !== node;){
            var alternate = node.alternate;
            if ((node.childLanes & renderLanes) === renderLanes) {
                if (null === alternate || (alternate.childLanes & renderLanes) === renderLanes) break;
                alternate.childLanes = alternate.childLanes | renderLanes;
            } else node.childLanes = node.childLanes | renderLanes, null !== alternate && (alternate.childLanes = alternate.childLanes | renderLanes);
            node = node.return;
        }
    }
    function prepareToReadContext(workInProgress, renderLanes) {
        currentlyRenderingFiber = workInProgress, lastContextDependency = null, lastContextWithAllBitsObserved = null;
        var a, dependencies = workInProgress.dependencies;
        null !== dependencies && null !== dependencies.firstContext && (a = dependencies.lanes, (a & renderLanes) != 0 && (didReceiveUpdate = !0), dependencies.firstContext = null);
    }
    function readContext(context, observedBits) {
        if (isDisallowedContextReadInDEV && error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."), lastContextWithAllBitsObserved === context) ;
        else if (!1 === observedBits || 0 === observedBits) ;
        else {
            "number" != typeof observedBits || 1073741823 === observedBits ? (// Observe all updates.
            lastContextWithAllBitsObserved = context, resolvedObservedBits = 1073741823) : resolvedObservedBits = observedBits;
            var resolvedObservedBits, contextItem = {
                context: context,
                observedBits: resolvedObservedBits,
                next: null
            };
            if (null === lastContextDependency) {
                if (!(null !== currentlyRenderingFiber)) throw Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
                 // This is the first dependency for this component. Create a new list.
                lastContextDependency = contextItem, currentlyRenderingFiber.dependencies = {
                    lanes: 0,
                    firstContext: contextItem,
                    responders: null
                };
            } else // Append a new context item.
            lastContextDependency = lastContextDependency.next = contextItem;
        }
        return context._currentValue;
    }
    var hasForceUpdate = !1;
    function initializeUpdateQueue(fiber) {
        var queue = {
            baseState: fiber.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: {
                pending: null
            },
            effects: null
        };
        fiber.updateQueue = queue;
    }
    function cloneUpdateQueue(current, workInProgress) {
        // Clone the update queue from current. Unless it's already a clone.
        var queue = workInProgress.updateQueue, currentQueue = current.updateQueue;
        if (queue === currentQueue) {
            var clone = {
                baseState: currentQueue.baseState,
                firstBaseUpdate: currentQueue.firstBaseUpdate,
                lastBaseUpdate: currentQueue.lastBaseUpdate,
                shared: currentQueue.shared,
                effects: currentQueue.effects
            };
            workInProgress.updateQueue = clone;
        }
    }
    function createUpdate(eventTime, lane) {
        return {
            eventTime: eventTime,
            lane: lane,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        };
    }
    function enqueueUpdate(fiber, update) {
        var updateQueue = fiber.updateQueue;
        if (null !== updateQueue) {
            var sharedQueue = updateQueue.shared, pending = sharedQueue.pending;
            null === pending ? // This is the first update. Create a circular list.
            update.next = update : (update.next = pending.next, pending.next = update), sharedQueue.pending = update, currentlyProcessingQueue !== sharedQueue || didWarnUpdateInsideUpdate || (error("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), didWarnUpdateInsideUpdate = !0);
        }
    }
    function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
        // Captured updates are updates that are thrown by a child during the render
        // phase. They should be discarded if the render is aborted. Therefore,
        // we should only put them on the work-in-progress queue, not the current one.
        var queue = workInProgress.updateQueue, current = workInProgress.alternate; // Check if the work-in-progress queue is a clone.
        if (null !== current) {
            var currentQueue = current.updateQueue;
            if (queue === currentQueue) {
                // The work-in-progress queue is the same as current. This happens when
                // we bail out on a parent fiber that then captures an error thrown by
                // a child. Since we want to append the update only to the work-in
                // -progress queue, we need to clone the updates. We usually clone during
                // processUpdateQueue, but that didn't happen in this case because we
                // skipped over the parent when we bailed out.
                var newFirst = null, newLast = null, firstBaseUpdate = queue.firstBaseUpdate;
                if (null !== firstBaseUpdate) {
                    // Loop through the updates and clone them.
                    var update = firstBaseUpdate;
                    do {
                        var clone = {
                            eventTime: update.eventTime,
                            lane: update.lane,
                            tag: update.tag,
                            payload: update.payload,
                            callback: update.callback,
                            next: null
                        };
                        null === newLast ? newFirst = newLast = clone : (newLast.next = clone, newLast = clone), update = update.next;
                    }while (null !== update) // Append the captured update the end of the cloned list.
                    null === newLast ? newFirst = newLast = capturedUpdate : (newLast.next = capturedUpdate, newLast = capturedUpdate);
                } else // There are no base updates.
                newFirst = newLast = capturedUpdate;
                queue = {
                    baseState: currentQueue.baseState,
                    firstBaseUpdate: newFirst,
                    lastBaseUpdate: newLast,
                    shared: currentQueue.shared,
                    effects: currentQueue.effects
                }, workInProgress.updateQueue = queue;
                return;
            }
        } // Append the update to the end of the list.
        var lastBaseUpdate = queue.lastBaseUpdate;
        null === lastBaseUpdate ? queue.firstBaseUpdate = capturedUpdate : lastBaseUpdate.next = capturedUpdate, queue.lastBaseUpdate = capturedUpdate;
    }
    function processUpdateQueue(workInProgress, props, instance, renderLanes) {
        // This is always non-null on a ClassComponent or HostRoot
        var queue = workInProgress.updateQueue;
        hasForceUpdate = !1, currentlyProcessingQueue = queue.shared;
        var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
        if (null !== pendingQueue) {
            queue.shared.pending = null;
            // and last so that it's non-circular.
            var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
            lastPendingUpdate.next = null, null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate, lastBaseUpdate = lastPendingUpdate;
            // we need to transfer the updates to that queue, too. Because the base
            // queue is a singly-linked list with no cycles, we can append to both
            // lists and take advantage of structural sharing.
            // TODO: Pass `current` as argument
            var current = workInProgress.alternate;
            if (null !== current) {
                // This is always non-null on a ClassComponent or HostRoot
                var currentQueue = current.updateQueue, currentLastBaseUpdate = currentQueue.lastBaseUpdate;
                currentLastBaseUpdate !== lastBaseUpdate && (null === currentLastBaseUpdate ? currentQueue.firstBaseUpdate = firstPendingUpdate : currentLastBaseUpdate.next = firstPendingUpdate, currentQueue.lastBaseUpdate = lastPendingUpdate);
            }
        } // These values may change as we process the queue.
        if (null !== firstBaseUpdate) {
            for(// Iterate through the list of updates to compute the result.
            var newState = queue.baseState, newLanes = 0, newBaseState = null, newFirstBaseUpdate = null, newLastBaseUpdate = null, update = firstBaseUpdate;;){
                var updateLane = update.lane, updateEventTime = update.eventTime;
                if ((renderLanes & updateLane) === updateLane) {
                    // This update does have sufficient priority.
                    if (null !== newLastBaseUpdate) {
                        var _clone = {
                            eventTime: updateEventTime,
                            // This update is going to be committed so we never want uncommit
                            // it. Using NoLane works because 0 is a subset of all bitmasks, so
                            // this will never be skipped by the check above.
                            lane: 0,
                            tag: update.tag,
                            payload: update.payload,
                            callback: update.callback,
                            next: null
                        };
                        newLastBaseUpdate = newLastBaseUpdate.next = _clone;
                    } // Process this update.
                    if (newState = function(workInProgress, queue, update, prevState, nextProps, instance) {
                        switch(update.tag){
                            case 1:
                                var payload = update.payload;
                                if ("function" == typeof payload) {
                                    isDisallowedContextReadInDEV = !0;
                                    var nextState = payload.call(instance, prevState, nextProps);
                                    if (1 & workInProgress.mode) {
                                        disableLogs();
                                        try {
                                            payload.call(instance, prevState, nextProps);
                                        } finally{
                                            reenableLogs();
                                        }
                                    }
                                    return isDisallowedContextReadInDEV = !1, nextState;
                                } // State object
                                return payload;
                            case 3:
                                workInProgress.flags = -4097 & workInProgress.flags | /*                   */ 64;
                            // Intentional fallthrough
                            case 0:
                                var partialState, _payload = update.payload;
                                if ("function" == typeof _payload) {
                                    if (isDisallowedContextReadInDEV = !0, partialState = _payload.call(instance, prevState, nextProps), 1 & workInProgress.mode) {
                                        disableLogs();
                                        try {
                                            _payload.call(instance, prevState, nextProps);
                                        } finally{
                                            reenableLogs();
                                        }
                                    }
                                    isDisallowedContextReadInDEV = !1;
                                } else // Partial state object
                                partialState = _payload;
                                if (null == partialState) break;
                                 // Merge the partial state and the previous state.
                                return _assign({}, prevState, partialState);
                            case 2:
                                hasForceUpdate = !0;
                        }
                        return prevState;
                    }(workInProgress, 0, update, newState, props, instance), null !== update.callback) {
                        workInProgress.flags |= /*                     */ 32;
                        var effects = queue.effects;
                        null === effects ? queue.effects = [
                            update
                        ] : effects.push(update);
                    }
                } else {
                    // Priority is insufficient. Skip this update. If this is the first
                    // skipped update, the previous update/state is the new base
                    // update/state.
                    var clone = {
                        eventTime: updateEventTime,
                        lane: updateLane,
                        tag: update.tag,
                        payload: update.payload,
                        callback: update.callback,
                        next: null
                    };
                    null === newLastBaseUpdate ? (newFirstBaseUpdate = newLastBaseUpdate = clone, newBaseState = newState) : newLastBaseUpdate = newLastBaseUpdate.next = clone, newLanes |= updateLane;
                }
                if (null === (update = update.next)) {
                    if (null === (pendingQueue = queue.shared.pending)) break;
                    // An update was scheduled from inside a reducer. Add the new
                    // pending updates to the end of the list and keep processing.
                    var _lastPendingUpdate = pendingQueue, _firstPendingUpdate = _lastPendingUpdate.next; // Intentionally unsound. Pending updates form a circular list, but we
                    _lastPendingUpdate.next = null, update = _firstPendingUpdate, queue.lastBaseUpdate = _lastPendingUpdate, queue.shared.pending = null;
                }
            }
            null === newLastBaseUpdate && (newBaseState = newState), queue.baseState = newBaseState, queue.firstBaseUpdate = newFirstBaseUpdate, queue.lastBaseUpdate = newLastBaseUpdate, // This should be fine because the only two other things that contribute to
            // expiration time are props and context. We're already in the middle of the
            // begin phase by the time we start processing the queue, so we've already
            // dealt with the props. Context in components that specify
            // shouldComponentUpdate is tricky; but we'll have to account for
            // that regardless.
            function(lane) {
                workInProgressRootSkippedLanes |= lane;
            }(newLanes), workInProgress.lanes = newLanes, workInProgress.memoizedState = newState;
        }
        currentlyProcessingQueue = null;
    }
    didWarnUpdateInsideUpdate = !1, currentlyProcessingQueue = null;
    function commitUpdateQueue(finishedWork, finishedQueue, instance) {
        // Commit the effects
        var effects = finishedQueue.effects;
        if (finishedQueue.effects = null, null !== effects) for(var i = 0; i < effects.length; i++){
            var effect = effects[i], callback = effect.callback;
            null !== callback && (effect.callback = null, function(callback, context) {
                if ("function" != typeof callback) throw Error("Invalid argument passed as callback. Expected a function. Instead received: " + callback);
                callback.call(context);
            }(callback, instance));
        }
    }
    var fakeInternalInstance = {}, isArray = Array.isArray, emptyRefsObject = new React.Component().refs;
    didWarnAboutStateAssignmentForComponent = new Set(), didWarnAboutUninitializedState = new Set(), didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = new Set(), didWarnAboutLegacyLifecyclesAndDerivedState = new Set(), didWarnAboutDirectlyAssigningPropsToState = new Set(), didWarnAboutUndefinedDerivedState = new Set(), didWarnAboutContextTypeAndContextTypes = new Set(), didWarnAboutInvalidateContextType = new Set();
    var didWarnOnInvalidCallback = new Set();
    function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
        var prevState = workInProgress.memoizedState;
        if (1 & workInProgress.mode) {
            disableLogs();
            try {
                // Invoke the function an extra time to help detect side-effects.
                getDerivedStateFromProps(nextProps, prevState);
            } finally{
                reenableLogs();
            }
        }
        var partialState = getDerivedStateFromProps(nextProps, prevState);
        warnOnUndefinedDerivedState(ctor, partialState);
        var memoizedState = null == partialState ? prevState : _assign({}, prevState, partialState);
        workInProgress.memoizedState = memoizedState, 0 === workInProgress.lanes && (workInProgress.updateQueue.baseState = memoizedState);
    }
    warnOnInvalidCallback = function(callback, callerName) {
        if (null !== callback && "function" != typeof callback) {
            var key = callerName + "_" + callback;
            didWarnOnInvalidCallback.has(key) || (didWarnOnInvalidCallback.add(key), error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback));
        }
    }, warnOnUndefinedDerivedState = function(type, partialState) {
        if (void 0 === partialState) {
            var componentName = getComponentName(type) || "Component";
            didWarnAboutUndefinedDerivedState.has(componentName) || (didWarnAboutUndefinedDerivedState.add(componentName), error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName));
        }
    }, // it causes problems. This is meant to give a nicer error message for
    // ReactDOM15.unstable_renderSubtreeIntoContainer(reactDOM16Component,
    // ...)) which otherwise throws a "_processChildContext is not a function"
    // exception.
    Object.defineProperty(fakeInternalInstance, "_processChildContext", {
        enumerable: !1,
        value: function() {
            throw Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
    }), Object.freeze(fakeInternalInstance);
    var classComponentUpdater = {
        isMounted: function(component) {
            var owner = ReactCurrentOwner.current;
            if (null !== owner && 1 === owner.tag) {
                var instance = owner.stateNode;
                instance._warnedAboutRefsInRender || error("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", getComponentName(owner.type) || "A component"), instance._warnedAboutRefsInRender = !0;
            }
            var fiber = get(component);
            return !!fiber && getNearestMountedFiber(fiber) === fiber;
        },
        enqueueSetState: function(inst, payload, callback) {
            var fiber = get(inst), eventTime = requestEventTime(), lane = requestUpdateLane(fiber), update = createUpdate(eventTime, lane);
            update.payload = payload, null != callback && (warnOnInvalidCallback(callback, "setState"), update.callback = callback), enqueueUpdate(fiber, update), scheduleUpdateOnFiber(fiber, lane, eventTime);
        },
        enqueueReplaceState: function(inst, payload, callback) {
            var fiber = get(inst), eventTime = requestEventTime(), lane = requestUpdateLane(fiber), update = createUpdate(eventTime, lane);
            update.tag = 1, update.payload = payload, null != callback && (warnOnInvalidCallback(callback, "replaceState"), update.callback = callback), enqueueUpdate(fiber, update), scheduleUpdateOnFiber(fiber, lane, eventTime);
        },
        enqueueForceUpdate: function(inst, callback) {
            var fiber = get(inst), eventTime = requestEventTime(), lane = requestUpdateLane(fiber), update = createUpdate(eventTime, lane);
            update.tag = 2, null != callback && (warnOnInvalidCallback(callback, "forceUpdate"), update.callback = callback), enqueueUpdate(fiber, update), scheduleUpdateOnFiber(fiber, lane, eventTime);
        }
    };
    function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
        var instance = workInProgress.stateNode;
        if ("function" == typeof instance.shouldComponentUpdate) {
            if (1 & workInProgress.mode) {
                disableLogs();
                try {
                    // Invoke the function an extra time to help detect side-effects.
                    instance.shouldComponentUpdate(newProps, newState, nextContext);
                } finally{
                    reenableLogs();
                }
            }
            var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
            return void 0 === shouldUpdate && error("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", getComponentName(ctor) || "Component"), shouldUpdate;
        }
        return !ctor.prototype || !ctor.prototype.isPureReactComponent || !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
    }
    function adoptClassInstance(workInProgress, instance) {
        instance.updater = classComponentUpdater, workInProgress.stateNode = instance, instance._reactInternals = workInProgress, instance._reactInternalInstance = fakeInternalInstance;
    }
    function constructClassInstance(workInProgress, ctor, props) {
        var isLegacyContextConsumer = !1, unmaskedContext = emptyContextObject, context = emptyContextObject, contextType = ctor.contextType;
        if ("contextType" in ctor && !(null === contextType || void 0 !== contextType && contextType.$$typeof === REACT_CONTEXT_TYPE && void 0 === contextType._context) && !didWarnAboutInvalidateContextType.has(ctor)) {
            didWarnAboutInvalidateContextType.add(ctor);
            var addendum = "";
            addendum = void 0 === contextType ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : "object" != typeof contextType ? " However, it is set to a " + typeof contextType + "." : contextType.$$typeof === REACT_PROVIDER_TYPE ? " Did you accidentally pass the Context.Provider instead?" : void 0 !== contextType._context ? " Did you accidentally pass the Context.Consumer instead?" : " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.", error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentName(ctor) || "Component", addendum);
        }
        if ("object" == typeof contextType && null !== contextType ? context = readContext(contextType) : (unmaskedContext = getUnmaskedContext(workInProgress, ctor, !0), context = (isLegacyContextConsumer = null != ctor.contextTypes) ? getMaskedContext(workInProgress, unmaskedContext) : emptyContextObject), 1 & workInProgress.mode) {
            disableLogs();
            try {
                new ctor(props, context); // eslint-disable-line no-new
            } finally{
                reenableLogs();
            }
        }
        var instance = new ctor(props, context), state = workInProgress.memoizedState = null !== instance.state && void 0 !== instance.state ? instance.state : null;
        if (adoptClassInstance(workInProgress, instance), "function" == typeof ctor.getDerivedStateFromProps && null === state) {
            var componentName = getComponentName(ctor) || "Component";
            didWarnAboutUninitializedState.has(componentName) || (didWarnAboutUninitializedState.add(componentName), error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, null === instance.state ? "null" : "undefined", componentName));
        } // If new component APIs are defined, "unsafe" lifecycles won't be called.
        // Warn about these lifecycles if they are present.
        // Don't warn about react-lifecycles-compat polyfilled methods though.
        if ("function" == typeof ctor.getDerivedStateFromProps || "function" == typeof instance.getSnapshotBeforeUpdate) {
            var foundWillMountName = null, foundWillReceivePropsName = null, foundWillUpdateName = null;
            if ("function" == typeof instance.componentWillMount && !0 !== instance.componentWillMount.__suppressDeprecationWarning ? foundWillMountName = "componentWillMount" : "function" == typeof instance.UNSAFE_componentWillMount && (foundWillMountName = "UNSAFE_componentWillMount"), "function" == typeof instance.componentWillReceiveProps && !0 !== instance.componentWillReceiveProps.__suppressDeprecationWarning ? foundWillReceivePropsName = "componentWillReceiveProps" : "function" == typeof instance.UNSAFE_componentWillReceiveProps && (foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps"), "function" == typeof instance.componentWillUpdate && !0 !== instance.componentWillUpdate.__suppressDeprecationWarning ? foundWillUpdateName = "componentWillUpdate" : "function" == typeof instance.UNSAFE_componentWillUpdate && (foundWillUpdateName = "UNSAFE_componentWillUpdate"), null !== foundWillMountName || null !== foundWillReceivePropsName || null !== foundWillUpdateName) {
                var _componentName = getComponentName(ctor) || "Component", newApiName = "function" == typeof ctor.getDerivedStateFromProps ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
                didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName) || (didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName), error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, null !== foundWillMountName ? "\n  " + foundWillMountName : "", null !== foundWillReceivePropsName ? "\n  " + foundWillReceivePropsName : "", null !== foundWillUpdateName ? "\n  " + foundWillUpdateName : ""));
            }
        }
        return isLegacyContextConsumer && cacheContext(workInProgress, unmaskedContext, context), instance;
    }
    function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
        var oldState = instance.state;
        if ("function" == typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext), "function" == typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext), instance.state !== oldState) {
            var componentName = getComponentName(workInProgress.type) || "Component";
            didWarnAboutStateAssignmentForComponent.has(componentName) || (didWarnAboutStateAssignmentForComponent.add(componentName), error("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", componentName)), classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
        }
    } // Invokes the mount life-cycles on a previously never rendered instance.
    function mountClassInstance(workInProgress, ctor, newProps, renderLanes) {
        instance = workInProgress.stateNode, name = getComponentName(ctor) || "Component", instance.render || (ctor.prototype && "function" == typeof ctor.prototype.render ? error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name) : error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name)), !instance.getInitialState || instance.getInitialState.isReactClassApproved || instance.state || error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name), instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved && error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name), instance.propTypes && error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name), instance.contextType && error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name), instance.contextTypes && error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name), ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor) && (didWarnAboutContextTypeAndContextTypes.add(ctor), error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name)), "function" == typeof instance.componentShouldUpdate && error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name), ctor.prototype && ctor.prototype.isPureReactComponent && void 0 !== instance.shouldComponentUpdate && error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentName(ctor) || "A pure component"), "function" == typeof instance.componentDidUnmount && error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name), "function" == typeof instance.componentDidReceiveProps && error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name), "function" == typeof instance.componentWillRecieveProps && error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name), "function" == typeof instance.UNSAFE_componentWillRecieveProps && error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name), hasMutatedProps = instance.props !== newProps, void 0 !== instance.props && hasMutatedProps && error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name), instance.defaultProps && error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name), "function" != typeof instance.getSnapshotBeforeUpdate || "function" == typeof instance.componentDidUpdate || didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor) || (didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor), error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentName(ctor))), "function" == typeof instance.getDerivedStateFromProps && error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name), "function" == typeof instance.getDerivedStateFromError && error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name), "function" == typeof ctor.getSnapshotBeforeUpdate && error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name), (_state = instance.state) && ("object" != typeof _state || isArray(_state)) && error("%s.state: must be set to an object or null", name), "function" == typeof instance.getChildContext && "object" != typeof ctor.childContextTypes && error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
        var instance, name, hasMutatedProps, _state, oldState, instance1 = workInProgress.stateNode;
        instance1.props = newProps, instance1.state = workInProgress.memoizedState, instance1.refs = emptyRefsObject, initializeUpdateQueue(workInProgress);
        var contextType = ctor.contextType;
        if ("object" == typeof contextType && null !== contextType) instance1.context = readContext(contextType);
        else {
            var unmaskedContext = getUnmaskedContext(workInProgress, ctor, !0);
            instance1.context = getMaskedContext(workInProgress, unmaskedContext);
        }
        if (instance1.state === newProps) {
            var componentName = getComponentName(ctor) || "Component";
            didWarnAboutDirectlyAssigningPropsToState.has(componentName) || (didWarnAboutDirectlyAssigningPropsToState.add(componentName), error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName));
        }
        1 & workInProgress.mode && ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress, instance1), ReactStrictModeWarnings.recordUnsafeLifecycleWarnings(workInProgress, instance1), processUpdateQueue(workInProgress, newProps, instance1, renderLanes), instance1.state = workInProgress.memoizedState;
        var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
        "function" == typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps), instance1.state = workInProgress.memoizedState), "function" != typeof ctor.getDerivedStateFromProps && "function" != typeof instance1.getSnapshotBeforeUpdate && ("function" == typeof instance1.UNSAFE_componentWillMount || "function" == typeof instance1.componentWillMount) && (oldState = instance1.state, "function" == typeof instance1.componentWillMount && instance1.componentWillMount(), "function" == typeof instance1.UNSAFE_componentWillMount && instance1.UNSAFE_componentWillMount(), oldState !== instance1.state && (error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentName(workInProgress.type) || "Component"), classComponentUpdater.enqueueReplaceState(instance1, instance1.state, null)), // process them now.
        processUpdateQueue(workInProgress, newProps, instance1, renderLanes), instance1.state = workInProgress.memoizedState), "function" == typeof instance1.componentDidMount && (workInProgress.flags |= /*                       */ 4);
    }
    var warnForMissingKey = function(child, returnFiber) {};
    didWarnAboutMaps = !1, didWarnAboutGenerators = !1, didWarnAboutStringRefs = {}, /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */ ownerHasKeyUseWarning = {}, ownerHasFunctionTypeWarning = {}, warnForMissingKey = function(child, returnFiber) {
        if (null !== child && "object" == typeof child && child._store && !child._store.validated && null == child.key) {
            if ("object" != typeof child._store) throw Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
            child._store.validated = !0;
            var componentName = getComponentName(returnFiber.type) || "Component";
            !ownerHasKeyUseWarning[componentName] && (ownerHasKeyUseWarning[componentName] = !0, error('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
        }
    };
    var isArray$1 = Array.isArray;
    function coerceRef(returnFiber, current, element) {
        var mixedRef = element.ref;
        if (null !== mixedRef && "function" != typeof mixedRef && "object" != typeof mixedRef) {
            // TODO: Clean this up once we turn on the string ref warning for
            // everyone, because the strict mode case will no longer be relevant
            if (1 & returnFiber.mode && // We warn in ReactElement.js if owner and self are equal for string refs
            // because these cannot be automatically converted to an arrow function
            // using a codemod. Therefore, we don't have to warn about string refs again.
            !(element._owner && element._self && element._owner.stateNode !== element._self)) {
                var componentName = getComponentName(returnFiber.type) || "Component";
                didWarnAboutStringRefs[componentName] || (error('A string ref, "%s", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', mixedRef), didWarnAboutStringRefs[componentName] = !0);
            }
            if (element._owner) {
                var inst, owner = element._owner;
                if (owner) {
                    if (1 !== owner.tag) throw Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
                    inst = owner.stateNode;
                }
                if (!inst) throw Error("Missing owner for string ref " + mixedRef + ". This error is likely caused by a bug in React. Please file an issue.");
                var stringRef = "" + mixedRef; // Check if previous string ref matches new string ref
                if (null !== current && null !== current.ref && "function" == typeof current.ref && current.ref._stringRef === stringRef) return current.ref;
                var ref = function(value) {
                    var refs = inst.refs;
                    refs === emptyRefsObject && // This is a lazy pooled frozen object, so we need to initialize.
                    (refs = inst.refs = {}), null === value ? delete refs[stringRef] : refs[stringRef] = value;
                };
                return ref._stringRef = stringRef, ref;
            }
            if ("string" != typeof mixedRef) throw Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
            if (!element._owner) throw Error("Element ref was specified as a string (" + mixedRef + ") but no owner was set. This could happen for one of the following reasons:\n1. You may be adding a ref to a function component\n2. You may be adding a ref to a component that was not created inside a component's render method\n3. You have multiple copies of React loaded\nSee https://reactjs.org/link/refs-must-have-owner for more information.");
        }
        return mixedRef;
    }
    function throwOnInvalidObjectType(returnFiber, newChild) {
        if ("textarea" !== returnFiber.type) throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === Object.prototype.toString.call(newChild) ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : newChild) + "). If you meant to render a collection of children, use an array instead.");
    }
    function warnOnFunctionType(returnFiber) {
        var componentName = getComponentName(returnFiber.type) || "Component";
        !ownerHasFunctionTypeWarning[componentName] && (ownerHasFunctionTypeWarning[componentName] = !0, error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it."));
    } // We avoid inlining this to avoid potential deopts from using try/catch.
    // to be able to optimize each path individually by branching early. This needs
    // a compiler or we can do it manually. Helpers that don't need this branching
    // live outside of this function.
    function ChildReconciler(shouldTrackSideEffects) {
        function deleteChild(returnFiber, childToDelete) {
            if (shouldTrackSideEffects) {
                // At this point, the return fiber's effect list is empty except for
                // deletions, so we can just append the deletion to the list. The remaining
                // effects aren't added until the complete phase. Once we implement
                // resuming, this may not be true.
                var last = returnFiber.lastEffect;
                null !== last ? (last.nextEffect = childToDelete, returnFiber.lastEffect = childToDelete) : returnFiber.firstEffect = returnFiber.lastEffect = childToDelete, childToDelete.nextEffect = null, childToDelete.flags = /*                     */ 8;
            } // Deletions are added in reversed order so we add it to the front.
        }
        function deleteRemainingChildren(returnFiber, currentFirstChild) {
            if (!shouldTrackSideEffects) // Noop.
            return null;
             // TODO: For the shouldClone case, this could be micro-optimized a bit by
            for(// assuming that after the first child we've already added everything.
            var childToDelete = currentFirstChild; null !== childToDelete;)deleteChild(returnFiber, childToDelete), childToDelete = childToDelete.sibling;
            return null;
        }
        function mapRemainingChildren(returnFiber, currentFirstChild) {
            for(// Add the remaining children to a temporary map so that we can find them by
            // keys quickly. Implicit (null) keys get added to this set with their index
            // instead.
            var existingChildren = new Map(), existingChild = currentFirstChild; null !== existingChild;)null !== existingChild.key ? existingChildren.set(existingChild.key, existingChild) : existingChildren.set(existingChild.index, existingChild), existingChild = existingChild.sibling;
            return existingChildren;
        }
        function useFiber(fiber, pendingProps) {
            // We currently set sibling to null and index to 0 here because it is easy
            // to forget to do before returning it. E.g. for the single child case.
            var clone = createWorkInProgress(fiber, pendingProps);
            return clone.index = 0, clone.sibling = null, clone;
        }
        function placeChild(newFiber, lastPlacedIndex, newIndex) {
            if (newFiber.index = newIndex, !shouldTrackSideEffects) // Noop.
            return lastPlacedIndex;
            var current = newFiber.alternate;
            if (null === current) return(// This is an insertion.
            newFiber.flags = /*                    */ 2, lastPlacedIndex);
            var oldIndex = current.index;
            return oldIndex < lastPlacedIndex ? (// This is a move.
            newFiber.flags = 2, lastPlacedIndex) : oldIndex;
        }
        function placeSingleChild(newFiber) {
            return shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags = 2), newFiber;
        }
        function updateTextNode(returnFiber, current, textContent, lanes) {
            if (null === current || 6 !== current.tag) {
                // Insert
                var created = createFiberFromText(textContent, returnFiber.mode, lanes);
                return created.return = returnFiber, created;
            }
            // Update
            var existing = useFiber(current, textContent);
            return existing.return = returnFiber, existing;
        }
        function updateElement(returnFiber, current, element, lanes) {
            if (null !== current && (current.elementType === element.type || // Keep this check inline so it only runs on the false path:
            isCompatibleFamilyForHotReloading(current, element))) {
                // Move based on index
                var existing = useFiber(current, element.props);
                return existing.ref = coerceRef(returnFiber, current, element), existing.return = returnFiber, existing._debugSource = element._source, existing._debugOwner = element._owner, existing;
            } // Insert
            var created = createFiberFromElement(element, returnFiber.mode, lanes);
            return created.ref = coerceRef(returnFiber, current, element), created.return = returnFiber, created;
        }
        function updatePortal(returnFiber, current, portal, lanes) {
            if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) {
                // Insert
                var created = createFiberFromPortal(portal, returnFiber.mode, lanes);
                return created.return = returnFiber, created;
            }
            // Update
            var existing = useFiber(current, portal.children || []);
            return existing.return = returnFiber, existing;
        }
        function updateFragment(returnFiber, current, fragment, lanes, key) {
            if (null === current || 7 !== current.tag) {
                // Insert
                var created = createFiberFromFragment(fragment, returnFiber.mode, lanes, key);
                return created.return = returnFiber, created;
            }
            // Update
            var existing = useFiber(current, fragment);
            return existing.return = returnFiber, existing;
        }
        function createChild(returnFiber, newChild, lanes) {
            if ("string" == typeof newChild || "number" == typeof newChild) {
                // Text nodes don't have keys. If the previous node is implicitly keyed
                // we can continue to replace it without aborting even if it is not a text
                // node.
                var created = createFiberFromText("" + newChild, returnFiber.mode, lanes);
                return created.return = returnFiber, created;
            }
            if ("object" == typeof newChild && null !== newChild) {
                switch(newChild.$$typeof){
                    case REACT_ELEMENT_TYPE:
                        var _created = createFiberFromElement(newChild, returnFiber.mode, lanes);
                        return _created.ref = coerceRef(returnFiber, null, newChild), _created.return = returnFiber, _created;
                    case REACT_PORTAL_TYPE:
                        var _created2 = createFiberFromPortal(newChild, returnFiber.mode, lanes);
                        return _created2.return = returnFiber, _created2;
                }
                if (isArray$1(newChild) || getIteratorFn(newChild)) {
                    var _created3 = createFiberFromFragment(newChild, returnFiber.mode, lanes, null);
                    return _created3.return = returnFiber, _created3;
                }
                throwOnInvalidObjectType(returnFiber, newChild);
            }
            return "function" == typeof newChild && warnOnFunctionType(returnFiber), null;
        }
        function updateSlot(returnFiber, oldFiber, newChild, lanes) {
            // Update the fiber if the keys match, otherwise return null.
            var key = null !== oldFiber ? oldFiber.key : null;
            if ("string" == typeof newChild || "number" == typeof newChild) return(// Text nodes don't have keys. If the previous node is implicitly keyed
            // we can continue to replace it without aborting even if it is not a text
            // node.
            null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes));
            if ("object" == typeof newChild && null !== newChild) {
                switch(newChild.$$typeof){
                    case REACT_ELEMENT_TYPE:
                        if (newChild.key !== key) return null;
                        if (newChild.type === REACT_FRAGMENT_TYPE) return updateFragment(returnFiber, oldFiber, newChild.props.children, lanes, key);
                        return updateElement(returnFiber, oldFiber, newChild, lanes);
                    case REACT_PORTAL_TYPE:
                        if (newChild.key === key) return updatePortal(returnFiber, oldFiber, newChild, lanes);
                        return null;
                }
                if (isArray$1(newChild) || getIteratorFn(newChild)) return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
                throwOnInvalidObjectType(returnFiber, newChild);
            }
            return "function" == typeof newChild && warnOnFunctionType(returnFiber), null;
        }
        function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
            if ("string" == typeof newChild || "number" == typeof newChild) return updateTextNode(returnFiber, existingChildren.get(newIdx) || null, "" + newChild, lanes);
            if ("object" == typeof newChild && null !== newChild) {
                switch(newChild.$$typeof){
                    case REACT_ELEMENT_TYPE:
                        var _matchedFiber = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null;
                        if (newChild.type === REACT_FRAGMENT_TYPE) return updateFragment(returnFiber, _matchedFiber, newChild.props.children, lanes, newChild.key);
                        return updateElement(returnFiber, _matchedFiber, newChild, lanes);
                    case REACT_PORTAL_TYPE:
                        return updatePortal(returnFiber, existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, newChild, lanes);
                }
                if (isArray$1(newChild) || getIteratorFn(newChild)) return updateFragment(returnFiber, existingChildren.get(newIdx) || null, newChild, lanes, null);
                throwOnInvalidObjectType(returnFiber, newChild);
            }
            return "function" == typeof newChild && warnOnFunctionType(returnFiber), null;
        }
        /**
     * Warns if there is a duplicate or missing key
     */ function warnOnInvalidKey(child, knownKeys, returnFiber) {
            if ("object" != typeof child || null === child) return knownKeys;
            switch(child.$$typeof){
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                    warnForMissingKey(child, returnFiber);
                    var key = child.key;
                    if ("string" != typeof key) break;
                    if (null === knownKeys) {
                        (knownKeys = new Set()).add(key);
                        break;
                    }
                    if (!knownKeys.has(key)) {
                        knownKeys.add(key);
                        break;
                    }
                    error("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", key);
            }
            return knownKeys;
        }
        return(// itself. They will be added to the side-effect list as we pass through the
        // children and the parent.
        function(returnFiber, currentFirstChild, newChild, lanes) {
            // This function is not recursive.
            // If the top level item is an array, we treat it as a set of children,
            // not as a fragment. Nested arrays on the other hand will be treated as
            // fragment nodes. Recursion happens at the normal flow.
            // Handle top level unkeyed fragments as if they were arrays.
            // This leads to an ambiguity between <>{[...]}</> and <>...</>.
            // We treat the ambiguous cases above the same.
            var isUnkeyedTopLevelFragment = "object" == typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key;
            isUnkeyedTopLevelFragment && (newChild = newChild.props.children);
            var isObject = "object" == typeof newChild && null !== newChild;
            if (isObject) switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(function(returnFiber, currentFirstChild, element, lanes) {
                        for(var key = element.key, child = currentFirstChild; null !== child;){
                            // TODO: If key === null and child.key === null, then this only applies to
                            // the first item in the list.
                            if (child.key === key) {
                                if (7 === child.tag) {
                                    if (element.type === REACT_FRAGMENT_TYPE) {
                                        deleteRemainingChildren(returnFiber, child.sibling);
                                        var existing = useFiber(child, element.props.children);
                                        return existing.return = returnFiber, existing._debugSource = element._source, existing._debugOwner = element._owner, existing;
                                    }
                                } else if (child.elementType === element.type || // Keep this check inline so it only runs on the false path:
                                isCompatibleFamilyForHotReloading(child, element)) {
                                    deleteRemainingChildren(returnFiber, child.sibling);
                                    var _existing3 = useFiber(child, element.props);
                                    return _existing3.ref = coerceRef(returnFiber, child, element), _existing3.return = returnFiber, _existing3._debugSource = element._source, _existing3._debugOwner = element._owner, _existing3;
                                }
                                 // Didn't match.
                                deleteRemainingChildren(returnFiber, child);
                                break;
                            }
                            deleteChild(returnFiber, child), child = child.sibling;
                        }
                        if (element.type === REACT_FRAGMENT_TYPE) {
                            var created = createFiberFromFragment(element.props.children, returnFiber.mode, lanes, element.key);
                            return created.return = returnFiber, created;
                        }
                        var _created4 = createFiberFromElement(element, returnFiber.mode, lanes);
                        return _created4.ref = coerceRef(returnFiber, currentFirstChild, element), _created4.return = returnFiber, _created4;
                    }(returnFiber, currentFirstChild, newChild, lanes));
                case REACT_PORTAL_TYPE:
                    return placeSingleChild(function(returnFiber, currentFirstChild, portal, lanes) {
                        for(var key = portal.key, child = currentFirstChild; null !== child;){
                            // TODO: If key === null and child.key === null, then this only applies to
                            // the first item in the list.
                            if (child.key === key) {
                                if (4 === child.tag && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
                                    deleteRemainingChildren(returnFiber, child.sibling);
                                    var existing = useFiber(child, portal.children || []);
                                    return existing.return = returnFiber, existing;
                                }
                                deleteRemainingChildren(returnFiber, child);
                                break;
                            }
                            deleteChild(returnFiber, child), child = child.sibling;
                        }
                        var created = createFiberFromPortal(portal, returnFiber.mode, lanes);
                        return created.return = returnFiber, created;
                    } // This API will tag the children with the side-effect of the reconciliation
                    (returnFiber, currentFirstChild, newChild, lanes));
            }
            if ("string" == typeof newChild || "number" == typeof newChild) return placeSingleChild(function(returnFiber, currentFirstChild, textContent, lanes) {
                // There's no need to check for keys on text nodes since we don't have a
                // way to define them.
                if (null !== currentFirstChild && 6 === currentFirstChild.tag) {
                    // We already have an existing node so let's just update it and delete
                    // the rest.
                    deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                    var existing = useFiber(currentFirstChild, textContent);
                    return existing.return = returnFiber, existing;
                } // The existing first child is not a text node so we need to create one
                // and delete the existing ones.
                deleteRemainingChildren(returnFiber, currentFirstChild);
                var created = createFiberFromText(textContent, returnFiber.mode, lanes);
                return created.return = returnFiber, created;
            }(returnFiber, currentFirstChild, "" + newChild, lanes));
            if (isArray$1(newChild)) return function(returnFiber, currentFirstChild, newChildren, lanes) {
                for(var knownKeys = null, i = 0; i < newChildren.length; i++)knownKeys = warnOnInvalidKey(newChildren[i], knownKeys, returnFiber);
                for(// First, validate keys.
                var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, lastPlacedIndex = 0, newIdx = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++){
                    oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
                    var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
                    if (null === newFiber) {
                        // TODO: This breaks on empty slots like null children. That's
                        // unfortunate because it triggers the slow path all the time. We need
                        // a better way to communicate whether this was a miss or null,
                        // boolean, undefined, etc.
                        null === oldFiber && (oldFiber = nextOldFiber);
                        break;
                    }
                    shouldTrackSideEffects && oldFiber && null === newFiber.alternate && // We matched the slot, but we didn't reuse the existing fiber, so we
                    // need to delete the existing child.
                    deleteChild(returnFiber, oldFiber), lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx), null === previousNewFiber ? // TODO: Move out of the loop. This only happens for the first run.
                    resultingFirstChild = newFiber : // TODO: Defer siblings if we're not at the right index for this slot.
                    // I.e. if we had null values before, then we want to defer this
                    // for each null value. However, we also don't want to call updateSlot
                    // with the previous one.
                    previousNewFiber.sibling = newFiber, previousNewFiber = newFiber, oldFiber = nextOldFiber;
                }
                if (newIdx === newChildren.length) return(// We've reached the end of the new children. We can delete the rest.
                deleteRemainingChildren(returnFiber, oldFiber), resultingFirstChild);
                if (null === oldFiber) {
                    // If we don't have any more existing children we can choose a fast path
                    // since the rest will all be insertions.
                    for(; newIdx < newChildren.length; newIdx++){
                        var _newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
                        null !== _newFiber && (lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx), null === previousNewFiber ? // TODO: Move out of the loop. This only happens for the first run.
                        resultingFirstChild = _newFiber : previousNewFiber.sibling = _newFiber, previousNewFiber = _newFiber);
                    }
                    return resultingFirstChild;
                } // Add all children to a key map for quick lookups.
                for(var existingChildren = mapRemainingChildren(returnFiber, oldFiber); newIdx < newChildren.length; newIdx++){
                    var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);
                    null !== _newFiber2 && (shouldTrackSideEffects && null !== _newFiber2.alternate && // The new fiber is a work in progress, but if there exists a
                    // current, that means that we reused the fiber. We need to delete
                    // it from the child list so that we don't add it to the deletion
                    // list.
                    existingChildren.delete(null === _newFiber2.key ? newIdx : _newFiber2.key), lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx), null === previousNewFiber ? resultingFirstChild = _newFiber2 : previousNewFiber.sibling = _newFiber2, previousNewFiber = _newFiber2);
                }
                return shouldTrackSideEffects && // Any existing children that weren't consumed above were deleted. We need
                // to add them to the deletion list.
                existingChildren.forEach(function(child) {
                    return deleteChild(returnFiber, child);
                }), resultingFirstChild;
            }(returnFiber, currentFirstChild, newChild, lanes);
            if (getIteratorFn(newChild)) return function(returnFiber, currentFirstChild, newChildrenIterable, lanes) {
                // This is the same implementation as reconcileChildrenArray(),
                // but using the iterator instead.
                var iteratorFn = getIteratorFn(newChildrenIterable);
                if ("function" != typeof iteratorFn) throw Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
                "function" == typeof Symbol && // $FlowFixMe Flow doesn't know about toStringTag
                "Generator" === newChildrenIterable[Symbol.toStringTag] && (didWarnAboutGenerators || error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), didWarnAboutGenerators = !0), newChildrenIterable.entries === iteratorFn && (didWarnAboutMaps || error("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = !0);
                // We'll get a different iterator later for the main pass.
                var _newChildren = iteratorFn.call(newChildrenIterable);
                if (_newChildren) for(var knownKeys = null, _step = _newChildren.next(); !_step.done; _step = _newChildren.next())knownKeys = warnOnInvalidKey(_step.value, knownKeys, returnFiber);
                var newChildren = iteratorFn.call(newChildrenIterable);
                if (!(null != newChildren)) throw Error("An iterable object provided no iterator.");
                for(var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, lastPlacedIndex = 0, newIdx = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()){
                    oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
                    var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
                    if (null === newFiber) {
                        // TODO: This breaks on empty slots like null children. That's
                        // unfortunate because it triggers the slow path all the time. We need
                        // a better way to communicate whether this was a miss or null,
                        // boolean, undefined, etc.
                        null === oldFiber && (oldFiber = nextOldFiber);
                        break;
                    }
                    shouldTrackSideEffects && oldFiber && null === newFiber.alternate && // We matched the slot, but we didn't reuse the existing fiber, so we
                    // need to delete the existing child.
                    deleteChild(returnFiber, oldFiber), lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx), null === previousNewFiber ? // TODO: Move out of the loop. This only happens for the first run.
                    resultingFirstChild = newFiber : // TODO: Defer siblings if we're not at the right index for this slot.
                    // I.e. if we had null values before, then we want to defer this
                    // for each null value. However, we also don't want to call updateSlot
                    // with the previous one.
                    previousNewFiber.sibling = newFiber, previousNewFiber = newFiber, oldFiber = nextOldFiber;
                }
                if (step.done) return(// We've reached the end of the new children. We can delete the rest.
                deleteRemainingChildren(returnFiber, oldFiber), resultingFirstChild);
                if (null === oldFiber) {
                    // If we don't have any more existing children we can choose a fast path
                    // since the rest will all be insertions.
                    for(; !step.done; newIdx++, step = newChildren.next()){
                        var _newFiber3 = createChild(returnFiber, step.value, lanes);
                        null !== _newFiber3 && (lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx), null === previousNewFiber ? // TODO: Move out of the loop. This only happens for the first run.
                        resultingFirstChild = _newFiber3 : previousNewFiber.sibling = _newFiber3, previousNewFiber = _newFiber3);
                    }
                    return resultingFirstChild;
                } // Add all children to a key map for quick lookups.
                for(var existingChildren = mapRemainingChildren(returnFiber, oldFiber); !step.done; newIdx++, step = newChildren.next()){
                    var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, lanes);
                    null !== _newFiber4 && (shouldTrackSideEffects && null !== _newFiber4.alternate && // The new fiber is a work in progress, but if there exists a
                    // current, that means that we reused the fiber. We need to delete
                    // it from the child list so that we don't add it to the deletion
                    // list.
                    existingChildren.delete(null === _newFiber4.key ? newIdx : _newFiber4.key), lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx), null === previousNewFiber ? resultingFirstChild = _newFiber4 : previousNewFiber.sibling = _newFiber4, previousNewFiber = _newFiber4);
                }
                return shouldTrackSideEffects && // Any existing children that weren't consumed above were deleted. We need
                // to add them to the deletion list.
                existingChildren.forEach(function(child) {
                    return deleteChild(returnFiber, child);
                }), resultingFirstChild;
            }(returnFiber, currentFirstChild, newChild, lanes);
            if (isObject && throwOnInvalidObjectType(returnFiber, newChild), "function" == typeof newChild && warnOnFunctionType(returnFiber), void 0 === newChild && !isUnkeyedTopLevelFragment) // If the new child is undefined, and the return fiber is a composite
            // component, throw an error. If Fiber return types are disabled,
            // we already threw above.
            switch(returnFiber.tag){
                case 1:
                    if (returnFiber.stateNode.render._isMockFunction) break;
                // Intentionally fall through to the next case, which handles both
                // functions and classes
                // eslint-disable-next-lined no-fallthrough
                case 22:
                case 0:
                case 11:
                case 15:
                    throw Error((getComponentName(returnFiber.type) || "Component") + "(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.");
            }
             // Remaining cases are all treated as empty.
            return deleteRemainingChildren(returnFiber, currentFirstChild);
        });
    }
    var reconcileChildFibers = ChildReconciler(!0), mountChildFibers = ChildReconciler(!1), NO_CONTEXT = {}, contextStackCursor$1 = createCursor(NO_CONTEXT), contextFiberStackCursor = createCursor(NO_CONTEXT), rootInstanceStackCursor = createCursor(NO_CONTEXT);
    function requiredContext(c) {
        if (!(c !== NO_CONTEXT)) throw Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
        return c;
    }
    function getRootHostContainer() {
        return requiredContext(rootInstanceStackCursor.current);
    }
    function pushHostContainer(fiber, nextRootInstance) {
        // Push current root instance onto the stack;
        // This allows us to reset root when portals are popped.
        push(rootInstanceStackCursor, nextRootInstance, fiber), // This enables us to pop only Fibers that provide unique contexts.
        push(contextFiberStackCursor, fiber, fiber), // However, we can't just call getRootHostContext() and push it because
        // we'd have a different number of entries on the stack depending on
        // whether getRootHostContext() throws somewhere in renderer code or not.
        // So we push an empty value first. This lets us safely unwind on errors.
        push(contextStackCursor$1, NO_CONTEXT, fiber);
        var nextRootContext = function(rootContainerInstance) {
            var type, namespace, nodeType = rootContainerInstance.nodeType;
            switch(nodeType){
                case 9:
                case 11:
                    type = 9 === nodeType ? "#document" : "#fragment";
                    var root = rootContainerInstance.documentElement;
                    namespace = root ? root.namespaceURI : getChildNamespace(null, "");
                    break;
                default:
                    var container = 8 === nodeType ? rootContainerInstance.parentNode : rootContainerInstance;
                    namespace = getChildNamespace(container.namespaceURI || null, type = container.tagName);
            }
            var validatedTag = type.toLowerCase();
            return {
                namespace: namespace,
                ancestorInfo: updatedAncestorInfo(null, validatedTag)
            };
        }(nextRootInstance); // Now that we know this function doesn't throw, replace it.
        pop(contextStackCursor$1, fiber), push(contextStackCursor$1, nextRootContext, fiber);
    }
    function popHostContainer(fiber) {
        pop(contextStackCursor$1, fiber), pop(contextFiberStackCursor, fiber), pop(rootInstanceStackCursor, fiber);
    }
    function getHostContext() {
        return requiredContext(contextStackCursor$1.current);
    }
    function pushHostContext(fiber) {
        requiredContext(rootInstanceStackCursor.current);
        var type, context = requiredContext(contextStackCursor$1.current), nextContext = (type = fiber.type, {
            namespace: getChildNamespace(context.namespace, type),
            ancestorInfo: updatedAncestorInfo(context.ancestorInfo, type)
        });
        context !== nextContext && (// This enables us to pop only Fibers that provide unique contexts.
        push(contextFiberStackCursor, fiber, fiber), push(contextStackCursor$1, nextContext, fiber)); // Track the context and the Fiber that provided it.
    }
    function popHostContext(fiber) {
        // Do not pop unless this Fiber provided the current context.
        // pushHostContext() only pushes Fibers that provide unique contexts.
        contextFiberStackCursor.current === fiber && (pop(contextStackCursor$1, fiber), pop(contextFiberStackCursor, fiber));
    }
    var suspenseStackCursor = createCursor(0);
    function findFirstSuspended(row) {
        for(var node = row; null !== node;){
            if (13 === node.tag) {
                var state = node.memoizedState;
                if (null !== state) {
                    var dehydrated = state.dehydrated;
                    if (null === dehydrated || "$?" === dehydrated.data || "$!" === dehydrated.data) return node;
                }
            } else if (19 === node.tag && // revealOrder undefined can't be trusted because it don't
            // keep track of whether it suspended or not.
            void 0 !== node.memoizedProps.revealOrder) {
                if ((64 & node.flags) != 0) return node;
            } else if (null !== node.child) {
                node.child.return = node, node = node.child;
                continue;
            }
            if (node === row) break;
            for(; null === node.sibling;){
                if (null === node.return || node.return === row) return null;
                node = node.return;
            }
            node.sibling.return = node.return, node = node.sibling;
        }
        return null;
    }
    // This may have been an insertion or a hydration.
    var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = !1;
    function deleteHydratableInstance(returnFiber, instance) {
        switch(returnFiber.tag){
            case 3:
                parentContainer = returnFiber.stateNode.containerInfo, 1 === instance.nodeType ? warnForDeletedHydratableElement(parentContainer, instance) : 8 === instance.nodeType || warnForDeletedHydratableText(parentContainer, instance);
                break;
            case 5:
                returnFiber.type, parentProps = returnFiber.memoizedProps, parentInstance = returnFiber.stateNode, !0 !== parentProps[SUPPRESS_HYDRATION_WARNING$1] && (1 === instance.nodeType ? warnForDeletedHydratableElement(parentInstance, instance) : 8 === instance.nodeType || warnForDeletedHydratableText(parentInstance, instance));
        }
        var fiber, parentContainer, parentType, parentProps, parentInstance, childToDelete = ((fiber = createFiber(5, null, null, 0)).elementType = "DELETED", fiber.type = "DELETED", fiber);
        childToDelete.stateNode = instance, childToDelete.return = returnFiber, childToDelete.flags = 8, null !== returnFiber.lastEffect ? (returnFiber.lastEffect.nextEffect = childToDelete, returnFiber.lastEffect = childToDelete) : returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    function insertNonHydratedInstance(returnFiber, fiber) {
        switch(fiber.flags = -1025 & fiber.flags | 2, returnFiber.tag){
            case 3:
                var parentContainer = returnFiber.stateNode.containerInfo;
                switch(fiber.tag){
                    case 5:
                        var type = fiber.type;
                        fiber.pendingProps, warnForInsertedHydratedElement(parentContainer, type);
                        break;
                    case 6:
                        warnForInsertedHydratedText(parentContainer, fiber.pendingProps);
                }
                break;
            case 5:
                returnFiber.type;
                var parentProps = returnFiber.memoizedProps, parentInstance = returnFiber.stateNode;
                switch(fiber.tag){
                    case 5:
                        var _type = fiber.type;
                        fiber.pendingProps, !0 !== parentProps[SUPPRESS_HYDRATION_WARNING$1] && warnForInsertedHydratedElement(parentInstance, _type);
                        break;
                    case 6:
                        var _text = fiber.pendingProps;
                        !0 !== parentProps[SUPPRESS_HYDRATION_WARNING$1] && warnForInsertedHydratedText(parentInstance, _text);
                        break;
                    case 13:
                        parentProps[SUPPRESS_HYDRATION_WARNING$1];
                }
                break;
            default:
                return;
        }
    }
    function tryHydrate(fiber, nextInstance) {
        switch(fiber.tag){
            case 5:
                var type = fiber.type;
                fiber.pendingProps;
                var instance = 1 !== nextInstance.nodeType || type.toLowerCase() !== nextInstance.nodeName.toLowerCase() ? null : nextInstance;
                if (null !== instance) return fiber.stateNode = instance, !0;
                return !1;
            case 6:
                var textInstance = "" === fiber.pendingProps || 3 !== nextInstance.nodeType ? null : nextInstance;
                if (null !== textInstance) return fiber.stateNode = textInstance, !0;
                return !1;
            default:
                return !1;
        }
    }
    function tryToClaimNextHydratableInstance(fiber) {
        if (isHydrating) {
            var nextInstance = nextHydratableInstance;
            if (!nextInstance) {
                // Nothing to hydrate. Make it an insertion.
                insertNonHydratedInstance(hydrationParentFiber, fiber), isHydrating = !1, hydrationParentFiber = fiber;
                return;
            }
            var firstAttemptedInstance = nextInstance;
            if (!tryHydrate(fiber, nextInstance)) {
                if (!// If we can't hydrate this instance let's try the next one.
                // We use this as a heuristic. It's based on intuition and not data so it
                // might be flawed or unnecessary.
                (nextInstance = getNextHydratableSibling(firstAttemptedInstance)) || !tryHydrate(fiber, nextInstance)) {
                    // Nothing to hydrate. Make it an insertion.
                    insertNonHydratedInstance(hydrationParentFiber, fiber), isHydrating = !1, hydrationParentFiber = fiber;
                    return;
                } // We matched the next one, we'll now assume that the first one was
                // superfluous and we'll delete it. Since we can't eagerly delete it
                // we'll have to schedule a deletion. To do that, this node needs a dummy
                // fiber associated with it.
                deleteHydratableInstance(hydrationParentFiber, firstAttemptedInstance);
            }
            hydrationParentFiber = fiber, nextHydratableInstance = getFirstHydratableChild(nextInstance);
        }
    }
    function popToNextHostParent(fiber) {
        for(var parent = fiber.return; null !== parent && 5 !== parent.tag && 3 !== parent.tag && 13 !== parent.tag;)parent = parent.return;
        hydrationParentFiber = parent;
    }
    function popHydrationState(fiber) {
        if (fiber !== hydrationParentFiber) // We're deeper than the current hydration context, inside an inserted
        // tree.
        return !1;
        if (!isHydrating) return(// If we're not currently hydrating but we're in a hydration context, then
        // we were an insertion and now need to pop up reenter hydration of our
        // siblings.
        popToNextHostParent(fiber), isHydrating = !0, !1);
        var type = fiber.type; // If we have any remaining hydratable nodes, we need to delete them now.
        // We only do this deeper than head and body since they tend to have random
        // other nodes in them. We also ignore components with pure text content in
        // side of them.
        // TODO: Better heuristic.
        if (5 !== fiber.tag || "head" !== type && "body" !== type && !shouldSetTextContent(type, fiber.memoizedProps)) for(var nextInstance = nextHydratableInstance; nextInstance;)deleteHydratableInstance(fiber, nextInstance), nextInstance = getNextHydratableSibling(nextInstance);
        return popToNextHostParent(fiber), nextHydratableInstance = 13 === fiber.tag ? function(fiber) {
            var suspenseState = fiber.memoizedState, suspenseInstance = null !== suspenseState ? suspenseState.dehydrated : null;
            if (!suspenseInstance) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
            return function(suspenseInstance) {
                for(var node = suspenseInstance.nextSibling, depth = 0; node;){
                    if (8 === node.nodeType) {
                        var data = node.data;
                        if ("/$" === data) {
                            if (0 === depth) return getNextHydratableSibling(node);
                            depth--;
                        } else ("$" === data || "$!" === data || "$?" === data) && depth++;
                    }
                    node = node.nextSibling;
                } // TODO: Warn, we didn't find the end comment boundary.
                return null;
            } // Returns the SuspenseInstance if this node is a direct child of a
            (suspenseInstance);
        }(fiber) : hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null, !0;
    }
    function resetHydrationState() {
        hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = !1;
    }
    // and should be reset before starting a new render.
    // This tracks which mutable sources need to be reset after a render.
    var workInProgressSources = [];
    function resetWorkInProgressVersions() {
        for(var i = 0; i < workInProgressSources.length; i++)workInProgressSources[i]._workInProgressVersionPrimary = null;
        workInProgressSources.length = 0;
    }
    function setWorkInProgressVersion(mutableSource, version) {
        mutableSource._workInProgressVersionPrimary = version, workInProgressSources.push(mutableSource);
    }
    // Used to detect multiple renderers using the same mutable source.
    rendererSigil$1 = {};
    var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher, ReactCurrentBatchConfig$1 = ReactSharedInternals.ReactCurrentBatchConfig;
    didWarnAboutUseOpaqueIdentifier = {}, didWarnAboutMismatchedHooksForComponent = new Set();
    // These are set right before calling the component.
    var renderLanes = 0, currentlyRenderingFiber$1 = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = !1, didScheduleRenderPhaseUpdateDuringThisPass = !1, currentHookNameInDev = null, hookTypesDev = null, hookTypesUpdateIndexDev = -1, ignorePreviousDependencies = !1; // The work-in-progress fiber. I've named it differently to distinguish it from
    function mountHookTypesDev() {
        var hookName = currentHookNameInDev;
        null === hookTypesDev ? hookTypesDev = [
            hookName
        ] : hookTypesDev.push(hookName);
    }
    function updateHookTypesDev() {
        var hookName = currentHookNameInDev;
        null !== hookTypesDev && hookTypesDev[++hookTypesUpdateIndexDev] !== hookName && function(currentHookName) {
            var componentName = getComponentName(currentlyRenderingFiber$1.type);
            if (!didWarnAboutMismatchedHooksForComponent.has(componentName) && (didWarnAboutMismatchedHooksForComponent.add(componentName), null !== hookTypesDev)) {
                for(var table = "", i = 0; i <= hookTypesUpdateIndexDev; i++){
                    // lol @ IE not supporting String#repeat
                    for(var oldHookName = hookTypesDev[i], newHookName = i === hookTypesUpdateIndexDev ? currentHookName : oldHookName, row = i + 1 + ". " + oldHookName; row.length < 30;)row += " ";
                    row += newHookName + "\n", table += row;
                }
                error("React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks\n\n   Previous render            Next render\n   ------------------------------------------------------\n%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n", componentName, table);
            }
        }(hookName);
    }
    function checkDepsAreArrayDev(deps) {
        null == deps || Array.isArray(deps) || // Verify deps, but only on mount to avoid extra checks.
        // It's unlikely their type would change as usually you define them inline.
        error("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", currentHookNameInDev, typeof deps);
    }
    function throwInvalidHookError() {
        throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
    }
    function areHookInputsEqual(nextDeps, prevDeps) {
        if (ignorePreviousDependencies) // Only true when this component is being hot reloaded.
        return !1;
        if (null === prevDeps) return error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev), !1;
        // Don't bother comparing lengths in prod because these arrays should be
        // passed inline.
        nextDeps.length !== prevDeps.length && error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + prevDeps.join(", ") + "]", "[" + nextDeps.join(", ") + "]");
        for(var i = 0; i < prevDeps.length && i < nextDeps.length; i++)if (!objectIs(nextDeps[i], prevDeps[i])) return !1;
        return !0;
    }
    function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
        renderLanes = nextRenderLanes, currentlyRenderingFiber$1 = workInProgress, hookTypesDev = null !== current ? current._debugHookTypes : null, hookTypesUpdateIndexDev = -1, ignorePreviousDependencies = null !== current && current.type !== workInProgress.type, workInProgress.memoizedState = null, workInProgress.updateQueue = null, workInProgress.lanes = 0, null !== current && null !== current.memoizedState ? ReactCurrentDispatcher$1.current = HooksDispatcherOnUpdateInDEV : null !== hookTypesDev ? // This dispatcher handles an edge case where a component is updating,
        // but no stateful hooks have been used.
        // We want to match the production code behavior (which will use HooksDispatcherOnMount),
        // but with the extra DEV validation to ensure hooks ordering hasn't changed.
        // This dispatcher does that.
        ReactCurrentDispatcher$1.current = HooksDispatcherOnMountWithHookTypesInDEV : ReactCurrentDispatcher$1.current = HooksDispatcherOnMountInDEV;
        var children = Component(props, secondArg); // Check if there was a render phase update
        if (didScheduleRenderPhaseUpdateDuringThisPass) {
            // Keep rendering in a loop for as long as render phase updates continue to
            // be scheduled. Use a counter to prevent infinite loops.
            var numberOfReRenders = 0;
            do {
                if (didScheduleRenderPhaseUpdateDuringThisPass = !1, !(numberOfReRenders < 25)) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
                numberOfReRenders += 1, // Even when hot reloading, allow dependencies to stabilize
                // after first render to prevent infinite render phase updates.
                ignorePreviousDependencies = !1, currentHook = null, workInProgressHook = null, workInProgress.updateQueue = null, // Also validate hook order for cascading updates.
                hookTypesUpdateIndexDev = -1, ReactCurrentDispatcher$1.current = HooksDispatcherOnRerenderInDEV, children = Component(props, secondArg);
            }while (didScheduleRenderPhaseUpdateDuringThisPass)
        } // We can assume the previous dispatcher is always this one, since we set it
        // at the beginning of the render phase and there's no re-entrancy.
        ReactCurrentDispatcher$1.current = ContextOnlyDispatcher, workInProgress._debugHookTypes = hookTypesDev;
        // hookTypesDev could catch more cases (e.g. context) but only in DEV bundles.
        var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
        if (renderLanes = 0, currentlyRenderingFiber$1 = null, currentHook = null, workInProgressHook = null, currentHookNameInDev = null, hookTypesDev = null, hookTypesUpdateIndexDev = -1, didScheduleRenderPhaseUpdate = !1, didRenderTooFewHooks) throw Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
        return children;
    }
    function bailoutHooks(current, workInProgress, lanes) {
        workInProgress.updateQueue = current.updateQueue, workInProgress.flags &= -517, current.lanes = current.lanes & ~lanes;
    }
    function resetHooksAfterThrow() {
        if (// We can assume the previous dispatcher is always this one, since we set it
        // at the beginning of the render phase and there's no re-entrancy.
        ReactCurrentDispatcher$1.current = ContextOnlyDispatcher, didScheduleRenderPhaseUpdate) {
            for(// There were render phase updates. These are only valid for this render
            // phase, which we are now aborting. Remove the updates from the queues so
            // they do not persist to the next render. Do not remove updates from hooks
            // that weren't processed.
            //
            // Only reset the updates from the queue if it has a clone. If it does
            // not have a clone, that means it wasn't processed, and the updates were
            // scheduled before we entered the render phase.
            var hook = currentlyRenderingFiber$1.memoizedState; null !== hook;){
                var queue = hook.queue;
                null !== queue && (queue.pending = null), hook = hook.next;
            }
            didScheduleRenderPhaseUpdate = !1;
        }
        renderLanes = 0, currentlyRenderingFiber$1 = null, currentHook = null, workInProgressHook = null, hookTypesDev = null, hookTypesUpdateIndexDev = -1, currentHookNameInDev = null, isUpdatingOpaqueValueInRenderPhase = !1, didScheduleRenderPhaseUpdateDuringThisPass = !1;
    }
    function mountWorkInProgressHook() {
        var hook = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return null === workInProgressHook ? // This is the first hook in the list
        currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook : // Append to the end of the list
        workInProgressHook = workInProgressHook.next = hook, workInProgressHook;
    }
    function updateWorkInProgressHook() {
        if (null === currentHook) {
            var nextCurrentHook, nextWorkInProgressHook, current = currentlyRenderingFiber$1.alternate;
            nextCurrentHook = null !== current ? current.memoizedState : null;
        } else nextCurrentHook = currentHook.next;
        if (null !== (nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber$1.memoizedState : workInProgressHook.next)) nextWorkInProgressHook = // There's already a work-in-progress. Reuse it.
        (workInProgressHook = nextWorkInProgressHook).next, currentHook = nextCurrentHook;
        else {
            // Clone from the current hook.
            if (!(null !== nextCurrentHook)) throw Error("Rendered more hooks than during the previous render.");
            var newHook = {
                memoizedState: (currentHook = nextCurrentHook).memoizedState,
                baseState: currentHook.baseState,
                baseQueue: currentHook.baseQueue,
                queue: currentHook.queue,
                next: null
            };
            null === workInProgressHook ? // This is the first hook in the list.
            currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook : // Append to the end of the list.
            workInProgressHook = workInProgressHook.next = newHook;
        }
        return workInProgressHook;
    }
    function basicStateReducer(state, action) {
        // $FlowFixMe: Flow doesn't like mixed types
        return "function" == typeof action ? action(state) : action;
    }
    function mountReducer(reducer, initialArg, init) {
        var initialState, hook = mountWorkInProgressHook();
        initialState = void 0 !== init ? init(initialArg) : initialArg, hook.memoizedState = hook.baseState = initialState;
        var queue = hook.queue = {
            pending: null,
            dispatch: null,
            lastRenderedReducer: reducer,
            lastRenderedState: initialState
        }, dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
        return [
            hook.memoizedState,
            dispatch
        ];
    }
    function updateReducer(reducer, initialArg, init) {
        var hook = updateWorkInProgressHook(), queue = hook.queue;
        if (!(null !== queue)) throw Error("Should have a queue. This is likely a bug in React. Please file an issue.");
        queue.lastRenderedReducer = reducer;
        var current = currentHook, baseQueue = current.baseQueue, pendingQueue = queue.pending; // The last rebase update that is NOT part of the base state.
        if (null !== pendingQueue) {
            // We have new updates that haven't been processed yet.
            // We'll add them to the base queue.
            if (null !== baseQueue) {
                // Merge the pending queue and the base queue.
                var baseFirst = baseQueue.next, pendingFirst = pendingQueue.next;
                baseQueue.next = pendingFirst, pendingQueue.next = baseFirst;
            }
            current.baseQueue !== baseQueue && // Internal invariant that should never happen, but feasibly could in
            // the future if we implement resuming, or some form of that.
            error("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), current.baseQueue = baseQueue = pendingQueue, queue.pending = null;
        }
        if (null !== baseQueue) {
            // We have a queue to process.
            var first = baseQueue.next, newState = current.baseState, newBaseState = null, newBaseQueueFirst = null, newBaseQueueLast = null, update = first;
            do {
                var updateLane = update.lane;
                if ((renderLanes & updateLane) === updateLane) {
                    // This update does have sufficient priority.
                    if (null !== newBaseQueueLast) {
                        var _clone = {
                            // This update is going to be committed so we never want uncommit
                            // it. Using NoLane works because 0 is a subset of all bitmasks, so
                            // this will never be skipped by the check above.
                            lane: 0,
                            action: update.action,
                            eagerReducer: update.eagerReducer,
                            eagerState: update.eagerState,
                            next: null
                        };
                        newBaseQueueLast = newBaseQueueLast.next = _clone;
                    } // Process this update.
                    // If this update was processed eagerly, and its reducer matches the
                    // current reducer, we can use the eagerly computed state.
                    newState = update.eagerReducer === reducer ? update.eagerState : reducer(newState, update.action);
                } else {
                    // Priority is insufficient. Skip this update. If this is the first
                    // skipped update, the previous update/state is the new base
                    // update/state.
                    var clone = {
                        lane: updateLane,
                        action: update.action,
                        eagerReducer: update.eagerReducer,
                        eagerState: update.eagerState,
                        next: null
                    };
                    null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = clone, newBaseState = newState) : newBaseQueueLast = newBaseQueueLast.next = clone, // TODO: Don't need to accumulate this. Instead, we can remove
                    // renderLanes from the original lanes.
                    currentlyRenderingFiber$1.lanes = currentlyRenderingFiber$1.lanes | updateLane, function(lane) {
                        workInProgressRootSkippedLanes |= lane;
                    }(updateLane);
                }
                update = update.next;
            }while (null !== update && update !== first)
            null === newBaseQueueLast ? newBaseState = newState : newBaseQueueLast.next = newBaseQueueFirst, objectIs(newState, hook.memoizedState) || (didReceiveUpdate = !0), hook.memoizedState = newState, hook.baseState = newBaseState, hook.baseQueue = newBaseQueueLast, queue.lastRenderedState = newState;
        }
        var dispatch = queue.dispatch;
        return [
            hook.memoizedState,
            dispatch
        ];
    }
    function rerenderReducer(reducer, initialArg, init) {
        var hook = updateWorkInProgressHook(), queue = hook.queue;
        if (!(null !== queue)) throw Error("Should have a queue. This is likely a bug in React. Please file an issue.");
        queue.lastRenderedReducer = reducer; // This is a re-render. Apply the new render phase updates to the previous
        // work-in-progress hook.
        var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
        if (null !== lastRenderPhaseUpdate) {
            // The queue doesn't persist past this render pass.
            queue.pending = null;
            var firstRenderPhaseUpdate = lastRenderPhaseUpdate.next, update = firstRenderPhaseUpdate;
            do newState = reducer(newState, update.action), update = update.next;
            while (update !== firstRenderPhaseUpdate) // Mark that the fiber performed work, but only if the new state is
            objectIs(newState, hook.memoizedState) || (didReceiveUpdate = !0), hook.memoizedState = newState, null === hook.baseQueue && (hook.baseState = newState), queue.lastRenderedState = newState;
        }
        return [
            newState,
            dispatch
        ];
    }
    function readFromUnsubcribedMutableSource(root, source, getSnapshot) {
        null == source._currentPrimaryRenderer ? source._currentPrimaryRenderer = rendererSigil$1 : source._currentPrimaryRenderer !== rendererSigil$1 && error("Detected multiple renderers concurrently rendering the same mutable source. This is currently unsupported.");
        var subset, version = (0, source._getVersion)(source._source), isSafeToReadFromSource = !1, currentRenderVersion = source._workInProgressVersionPrimary; // Is it safe for this component to read from this source during the current render?
        if (null !== currentRenderVersion ? // It's safe to read if the store hasn't been mutated since the last time
        // we read something.
        isSafeToReadFromSource = currentRenderVersion === version : // If there's no version, then this is the first time we've read from the
        // source during the current render pass, so we need to do a bit more work.
        // What we need to determine is if there are any hooks that already
        // subscribed to the source, and if so, whether there are any pending
        // mutations that haven't been synchronized yet.
        //
        // If there are no pending mutations, then `root.mutableReadLanes` will be
        // empty, and we know we can safely read.
        //
        // If there *are* pending mutations, we may still be able to safely read
        // if the currently rendering lanes are inclusive of the pending mutation
        // lanes, since that guarantees that the value we're about to read from
        // the source is consistent with the values that we read during the most
        // recent mutation.
        (isSafeToReadFromSource = (renderLanes & (subset = root.mutableReadLanes)) === subset) && // If it's safe to read from this source during the current render,
        // store the version in case other components read from it.
        // A changed version number will let those components know to throw and restart the render.
        setWorkInProgressVersion(source, version), isSafeToReadFromSource) {
            var snapshot = getSnapshot(source._source);
            return "function" == typeof snapshot && error("Mutable source should not return a function as the snapshot value. Functions may close over mutable values and cause tearing."), snapshot;
        }
        throw workInProgressSources.push(source), Error("Cannot read from mutable source during the current render without tearing. This is a bug in React. Please file an issue.");
    }
    function useMutableSource(hook, source, getSnapshot, subscribe) {
        var root = workInProgressRoot;
        if (!(null !== root)) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        var getVersion = source._getVersion, version = getVersion(source._source), dispatcher = ReactCurrentDispatcher$1.current, _dispatcher$useState = dispatcher.useState(function() {
            return readFromUnsubcribedMutableSource(root, source, getSnapshot);
        }), currentSnapshot = _dispatcher$useState[0], setSnapshot = _dispatcher$useState[1], snapshot = currentSnapshot, stateHook = workInProgressHook, memoizedState = hook.memoizedState, refs = memoizedState.refs, prevGetSnapshot = refs.getSnapshot, prevSource = memoizedState.source, prevSubscribe = memoizedState.subscribe, fiber = currentlyRenderingFiber$1;
        //
        // If either the source or the subscription have changed we can't can't trust the update queue.
        // Maybe the source changed in a way that the old subscription ignored but the new one depends on.
        //
        // If the getSnapshot function changed, we also shouldn't rely on the update queue.
        // It's possible that the underlying source was mutated between the when the last "change" event fired,
        // and when the current render (with the new getSnapshot function) is processed.
        //
        // In both cases, we need to throw away pending updates (since they are no longer relevant)
        // and treat reading from the source as we do in the mount case.
        if (hook.memoizedState = {
            refs: refs,
            source: source,
            subscribe: subscribe
        }, dispatcher.useEffect(function() {
            if (refs.getSnapshot = getSnapshot, // but this hook recreates the queue in certain cases  to avoid updates from stale sources.
            // handleChange() below needs to reference the dispatch function without re-subscribing,
            // so we use a ref to ensure that it always has the latest version.
            refs.setSnapshot = setSnapshot, !objectIs(version, getVersion(source._source))) {
                var maybeNewSnapshot = getSnapshot(source._source);
                "function" == typeof maybeNewSnapshot && error("Mutable source should not return a function as the snapshot value. Functions may close over mutable values and cause tearing."), objectIs(snapshot, maybeNewSnapshot) || (setSnapshot(maybeNewSnapshot), markRootMutableRead(root, requestUpdateLane(fiber))), // there may be state updates already scheduled from the old source.
                // Entangle the updates so that they render in the same batch.
                function(root, entangledLanes) {
                    root.entangledLanes |= entangledLanes;
                    for(var entanglements = root.entanglements, lanes = entangledLanes; lanes > 0;){
                        var index = pickArbitraryLaneIndex(lanes), lane = 1 << index;
                        entanglements[index] |= entangledLanes, lanes &= ~lane;
                    }
                }(root, root.mutableReadLanes);
            }
        }, [
            getSnapshot,
            source,
            subscribe
        ]), dispatcher.useEffect(function() {
            var unsubscribe = subscribe(source._source, function() {
                var latestGetSnapshot = refs.getSnapshot, latestSetSnapshot = refs.setSnapshot;
                try {
                    latestSetSnapshot(latestGetSnapshot(source._source)); // Record a pending mutable source update with the same expiration time.
                    var lane = requestUpdateLane(fiber);
                    markRootMutableRead(root, lane);
                } catch (error) {
                    // A selector might throw after a source mutation.
                    // e.g. it might try to read from a part of the store that no longer exists.
                    // In this case we should still schedule an update with React.
                    // Worst case the selector will throw again and then an error boundary will handle it.
                    latestSetSnapshot(function() {
                        throw error;
                    });
                }
            });
            return "function" != typeof unsubscribe && error("Mutable source subscribe function must return an unsubscribe function."), unsubscribe;
        }, [
            source,
            subscribe
        ]), !objectIs(prevGetSnapshot, getSnapshot) || !objectIs(prevSource, source) || !objectIs(prevSubscribe, subscribe)) {
            // Create a new queue and setState method,
            // So if there are interleaved updates, they get pushed to the older queue.
            // When this becomes current, the previous queue and dispatch method will be discarded,
            // including any interleaving updates that occur.
            var newQueue = {
                pending: null,
                dispatch: null,
                lastRenderedReducer: basicStateReducer,
                lastRenderedState: snapshot
            };
            newQueue.dispatch = setSnapshot = dispatchAction.bind(null, currentlyRenderingFiber$1, newQueue), stateHook.queue = newQueue, stateHook.baseQueue = null, snapshot = readFromUnsubcribedMutableSource(root, source, getSnapshot), stateHook.memoizedState = stateHook.baseState = snapshot;
        }
        return snapshot;
    }
    function mountMutableSource(source, getSnapshot, subscribe) {
        var hook = mountWorkInProgressHook();
        return hook.memoizedState = {
            refs: {
                getSnapshot: getSnapshot,
                setSnapshot: null
            },
            source: source,
            subscribe: subscribe
        }, useMutableSource(hook, source, getSnapshot, subscribe);
    }
    function updateMutableSource(source, getSnapshot, subscribe) {
        return useMutableSource(updateWorkInProgressHook(), source, getSnapshot, subscribe);
    }
    function mountState(initialState) {
        var hook = mountWorkInProgressHook();
        "function" == typeof initialState && // $FlowFixMe: Flow doesn't like mixed types
        (initialState = initialState()), hook.memoizedState = hook.baseState = initialState;
        var queue = hook.queue = {
            pending: null,
            dispatch: null,
            lastRenderedReducer: basicStateReducer,
            lastRenderedState: initialState
        }, dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
        return [
            hook.memoizedState,
            dispatch
        ];
    }
    function pushEffect(tag, create, destroy, deps) {
        var effect = {
            tag: tag,
            create: create,
            destroy: destroy,
            deps: deps,
            // Circular
            next: null
        }, componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;
        if (null === componentUpdateQueue) componentUpdateQueue = {
            lastEffect: null
        }, currentlyRenderingFiber$1.updateQueue = componentUpdateQueue, componentUpdateQueue.lastEffect = effect.next = effect;
        else {
            var lastEffect = componentUpdateQueue.lastEffect;
            if (null === lastEffect) componentUpdateQueue.lastEffect = effect.next = effect;
            else {
                var firstEffect = lastEffect.next;
                lastEffect.next = effect, effect.next = firstEffect, componentUpdateQueue.lastEffect = effect;
            }
        }
        return effect;
    }
    function mountRef(initialValue) {
        var hook = mountWorkInProgressHook(), ref = {
            current: initialValue
        };
        return Object.seal(ref), hook.memoizedState = ref, ref;
    }
    function updateRef(initialValue) {
        return updateWorkInProgressHook().memoizedState;
    }
    function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
        var hook = mountWorkInProgressHook();
        currentlyRenderingFiber$1.flags |= fiberFlags, hook.memoizedState = pushEffect(/* */ 1 | hookFlags, create, void 0, void 0 === deps ? null : deps);
    }
    function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
        var hook = updateWorkInProgressHook(), nextDeps = void 0 === deps ? null : deps, destroy = void 0;
        if (null !== currentHook) {
            var prevEffect = currentHook.memoizedState;
            if (destroy = prevEffect.destroy, null !== nextDeps && areHookInputsEqual(nextDeps, prevEffect.deps)) {
                pushEffect(hookFlags, create, destroy, nextDeps);
                return;
            }
        }
        currentlyRenderingFiber$1.flags |= fiberFlags, hook.memoizedState = pushEffect(1 | hookFlags, create, destroy, nextDeps);
    }
    function mountEffect(create, deps) {
        return "undefined" != typeof jest && warnIfNotCurrentlyActingEffectsInDEV(currentlyRenderingFiber$1), mountEffectImpl(516, /*   */ 4, create, deps);
    }
    function updateEffect(create, deps) {
        return "undefined" != typeof jest && warnIfNotCurrentlyActingEffectsInDEV(currentlyRenderingFiber$1), updateEffectImpl(516, 4, create, deps);
    }
    function mountLayoutEffect(create, deps) {
        return mountEffectImpl(4, /*    */ 2, create, deps);
    }
    function updateLayoutEffect(create, deps) {
        return updateEffectImpl(4, 2, create, deps);
    }
    function imperativeHandleEffect(create, ref) {
        if ("function" == typeof ref) return ref(create()), function() {
            ref(null);
        };
        if (null != ref) {
            ref.hasOwnProperty("current") || error("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(ref).join(", ") + "}");
            var _inst2 = create();
            return ref.current = _inst2, function() {
                ref.current = null;
            };
        }
    }
    function mountImperativeHandle(ref, create, deps) {
        "function" != typeof create && error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", null !== create ? typeof create : "null");
        var effectDeps = null != deps ? deps.concat([
            ref
        ]) : null;
        return mountEffectImpl(4, 2, imperativeHandleEffect.bind(null, create, ref), effectDeps);
    }
    function updateImperativeHandle(ref, create, deps) {
        "function" != typeof create && error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", null !== create ? typeof create : "null");
        var effectDeps = null != deps ? deps.concat([
            ref
        ]) : null;
        return updateEffectImpl(4, 2, imperativeHandleEffect.bind(null, create, ref), effectDeps);
    }
    function mountDebugValue(value, formatterFn) {
    // This hook is normally a no-op.
    // The react-debug-hooks package injects its own implementation
    // so that e.g. DevTools can display custom hook values.
    }
    function mountCallback(callback, deps) {
        return mountWorkInProgressHook().memoizedState = [
            callback,
            void 0 === deps ? null : deps
        ], callback;
    }
    function updateCallback(callback, deps) {
        var hook = updateWorkInProgressHook(), nextDeps = void 0 === deps ? null : deps, prevState = hook.memoizedState;
        return null !== prevState && null !== nextDeps && areHookInputsEqual(nextDeps, prevState[1]) ? prevState[0] : (hook.memoizedState = [
            callback,
            nextDeps
        ], callback);
    }
    function mountMemo(nextCreate, deps) {
        var hook = mountWorkInProgressHook(), nextValue = nextCreate();
        return hook.memoizedState = [
            nextValue,
            void 0 === deps ? null : deps
        ], nextValue;
    }
    function updateMemo(nextCreate, deps) {
        var hook = updateWorkInProgressHook(), nextDeps = void 0 === deps ? null : deps, prevState = hook.memoizedState;
        if (null !== prevState && null !== nextDeps && areHookInputsEqual(nextDeps, prevState[1])) return prevState[0];
        var nextValue = nextCreate();
        return hook.memoizedState = [
            nextValue,
            nextDeps
        ], nextValue;
    }
    function mountDeferredValue(value) {
        var _mountState = mountState(value), prevValue = _mountState[0], setValue = _mountState[1];
        return mountEffect(function() {
            var prevTransition = ReactCurrentBatchConfig$1.transition;
            ReactCurrentBatchConfig$1.transition = 1;
            try {
                setValue(value);
            } finally{
                ReactCurrentBatchConfig$1.transition = prevTransition;
            }
        }, [
            value
        ]), prevValue;
    }
    function updateDeferredValue(value) {
        var _updateState = updateReducer(basicStateReducer), prevValue = _updateState[0], setValue = _updateState[1];
        return updateEffect(function() {
            var prevTransition = ReactCurrentBatchConfig$1.transition;
            ReactCurrentBatchConfig$1.transition = 1;
            try {
                setValue(value);
            } finally{
                ReactCurrentBatchConfig$1.transition = prevTransition;
            }
        }, [
            value
        ]), prevValue;
    }
    function rerenderDeferredValue(value) {
        var _rerenderState = rerenderReducer(basicStateReducer), prevValue = _rerenderState[0], setValue = _rerenderState[1];
        return updateEffect(function() {
            var prevTransition = ReactCurrentBatchConfig$1.transition;
            ReactCurrentBatchConfig$1.transition = 1;
            try {
                setValue(value);
            } finally{
                ReactCurrentBatchConfig$1.transition = prevTransition;
            }
        }, [
            value
        ]), prevValue;
    }
    function startTransition(setPending, callback) {
        var priorityLevel = getCurrentPriorityLevel();
        runWithPriority$1(priorityLevel < 98 ? 98 : priorityLevel, function() {
            setPending(!0);
        }), runWithPriority$1(priorityLevel > 97 ? 97 : priorityLevel, function() {
            var prevTransition = ReactCurrentBatchConfig$1.transition;
            ReactCurrentBatchConfig$1.transition = 1;
            try {
                setPending(!1), callback();
            } finally{
                ReactCurrentBatchConfig$1.transition = prevTransition;
            }
        });
    }
    function mountTransition() {
        var _mountState2 = mountState(!1), isPending = _mountState2[0], setPending = _mountState2[1], start = startTransition.bind(null, setPending); // The `start` method can be stored on a ref, since `setPending`
        return mountRef(start), [
            start,
            isPending
        ];
    }
    function updateTransition() {
        var isPending = updateReducer(basicStateReducer)[0];
        return [
            updateRef().current,
            isPending
        ];
    }
    function rerenderTransition() {
        var isPending = rerenderReducer(basicStateReducer)[0];
        return [
            updateRef().current,
            isPending
        ];
    }
    var isUpdatingOpaqueValueInRenderPhase = !1;
    function warnOnOpaqueIdentifierAccessInDEV(fiber) {
        // TODO: Should warn in effects and callbacks, too
        var name = getComponentName(fiber.type) || "Unknown";
        isRendering && !didWarnAboutUseOpaqueIdentifier[name] && (error("The object passed back from useOpaqueIdentifier is meant to be passed through to attributes only. Do not read the value directly."), didWarnAboutUseOpaqueIdentifier[name] = !0);
    }
    function mountOpaqueIdentifier() {
        var makeId = makeClientIdInDEV.bind(null, warnOnOpaqueIdentifierAccessInDEV.bind(null, currentlyRenderingFiber$1));
        if (isHydrating) {
            var attemptToReadValue, didUpgrade = !1, fiber = currentlyRenderingFiber$1, id = {
                $$typeof: REACT_OPAQUE_ID_TYPE,
                toString: attemptToReadValue = function() {
                    throw didUpgrade || (// Only upgrade once. This works even inside the render phase because
                    // the update is added to a shared queue, which outlasts the
                    // in-progress render.
                    didUpgrade = !0, isUpdatingOpaqueValueInRenderPhase = !0, setId(makeId()), isUpdatingOpaqueValueInRenderPhase = !1, warnOnOpaqueIdentifierAccessInDEV(fiber)), Error("The object passed back from useOpaqueIdentifier is meant to be passed through to attributes only. Do not read the value directly.");
                },
                valueOf: attemptToReadValue
            }, setId = mountState(id)[1];
            return (2 & currentlyRenderingFiber$1.mode) == 0 && (currentlyRenderingFiber$1.flags |= 516, pushEffect(5, function() {
                setId(makeId());
            }, void 0, null)), id;
        }
        var _id = makeId();
        return mountState(_id), _id;
    }
    function updateOpaqueIdentifier() {
        return updateReducer(basicStateReducer)[0];
    }
    function rerenderOpaqueIdentifier() {
        return rerenderReducer(basicStateReducer)[0];
    }
    function dispatchAction(fiber, queue, action) {
        "function" == typeof arguments[3] && error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
        var eventTime = requestEventTime(), lane = requestUpdateLane(fiber), update = {
            lane: lane,
            action: action,
            eagerReducer: null,
            eagerState: null,
            next: null
        }, pending = queue.pending;
        null === pending ? // This is the first update. Create a circular list.
        update.next = update : (update.next = pending.next, pending.next = update), queue.pending = update;
        var alternate = fiber.alternate;
        if (fiber === currentlyRenderingFiber$1 || null !== alternate && alternate === currentlyRenderingFiber$1) // This is a render phase update. Stash it in a lazily-created map of
        // queue -> linked list of updates. After this render pass, we'll restart
        // and apply the stashed updates on top of the work-in-progress hook.
        didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = !0;
        else {
            if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes)) {
                // The queue is currently empty, which means we can eagerly compute the
                // next state before entering the render phase. If the new state is the
                // same as the current state, we may be able to bail out entirely.
                var prevDispatcher, lastRenderedReducer = queue.lastRenderedReducer;
                if (null !== lastRenderedReducer) {
                    prevDispatcher = ReactCurrentDispatcher$1.current, ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
                    try {
                        var currentState = queue.lastRenderedState, eagerState = lastRenderedReducer(currentState, action);
                        if (// it, on the update object. If the reducer hasn't changed by the
                        // time we enter the render phase, then the eager state can be used
                        // without calling the reducer again.
                        update.eagerReducer = lastRenderedReducer, update.eagerState = eagerState, objectIs(eagerState, currentState)) // Fast path. We can bail out without scheduling React to re-render.
                        // It's still possible that we'll need to rebase this update later,
                        // if the component re-renders for a different reason and by that
                        // time the reducer has changed.
                        return;
                    } catch (error) {
                    // Suppress the error. It will throw again in the render phase.
                    } finally{
                        ReactCurrentDispatcher$1.current = prevDispatcher;
                    }
                }
            }
            "undefined" != typeof jest && (warnIfNotScopedWithMatchingAct(fiber), warnIfNotCurrentlyActingUpdatesInDev(fiber)), scheduleUpdateOnFiber(fiber, lane, eventTime);
        }
    }
    var ContextOnlyDispatcher = {
        readContext: readContext,
        useCallback: throwInvalidHookError,
        useContext: throwInvalidHookError,
        useEffect: throwInvalidHookError,
        useImperativeHandle: throwInvalidHookError,
        useLayoutEffect: throwInvalidHookError,
        useMemo: throwInvalidHookError,
        useReducer: throwInvalidHookError,
        useRef: throwInvalidHookError,
        useState: throwInvalidHookError,
        useDebugValue: throwInvalidHookError,
        useDeferredValue: throwInvalidHookError,
        useTransition: throwInvalidHookError,
        useMutableSource: throwInvalidHookError,
        useOpaqueIdentifier: throwInvalidHookError,
        unstable_isNewReconciler: !1
    }, HooksDispatcherOnMountInDEV = null, HooksDispatcherOnMountWithHookTypesInDEV = null, HooksDispatcherOnUpdateInDEV = null, HooksDispatcherOnRerenderInDEV = null, InvalidNestedHooksDispatcherOnMountInDEV = null, InvalidNestedHooksDispatcherOnUpdateInDEV = null, InvalidNestedHooksDispatcherOnRerenderInDEV = null, warnInvalidContextAccess = function() {
        error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
    }, warnInvalidHookAccess = function() {
        error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
    };
    HooksDispatcherOnMountInDEV = {
        readContext: function(context, observedBits) {
            return readContext(context, observedBits);
        },
        useCallback: function(callback, deps) {
            return currentHookNameInDev = "useCallback", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountCallback(callback, deps);
        },
        useContext: function(context, observedBits) {
            return currentHookNameInDev = "useContext", mountHookTypesDev(), readContext(context, observedBits);
        },
        useEffect: function(create, deps) {
            return currentHookNameInDev = "useEffect", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountEffect(create, deps);
        },
        useImperativeHandle: function(ref, create, deps) {
            return currentHookNameInDev = "useImperativeHandle", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountImperativeHandle(ref, create, deps);
        },
        useLayoutEffect: function(create, deps) {
            return currentHookNameInDev = "useLayoutEffect", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountLayoutEffect(create, deps);
        },
        useMemo: function(create, deps) {
            currentHookNameInDev = "useMemo", mountHookTypesDev(), checkDepsAreArrayDev(deps);
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountMemo(create, deps);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useReducer: function(reducer, initialArg, init) {
            currentHookNameInDev = "useReducer", mountHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountReducer(reducer, initialArg, init);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useRef: function(initialValue) {
            return currentHookNameInDev = "useRef", mountHookTypesDev(), mountRef(initialValue);
        },
        useState: function(initialState) {
            currentHookNameInDev = "useState", mountHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountState(initialState);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useDebugValue: function(value, formatterFn) {
            return currentHookNameInDev = "useDebugValue", mountHookTypesDev(), mountDebugValue();
        },
        useDeferredValue: function(value) {
            return currentHookNameInDev = "useDeferredValue", mountHookTypesDev(), mountDeferredValue(value);
        },
        useTransition: function() {
            return currentHookNameInDev = "useTransition", mountHookTypesDev(), mountTransition();
        },
        useMutableSource: function(source, getSnapshot, subscribe) {
            return currentHookNameInDev = "useMutableSource", mountHookTypesDev(), mountMutableSource(source, getSnapshot, subscribe);
        },
        useOpaqueIdentifier: function() {
            return currentHookNameInDev = "useOpaqueIdentifier", mountHookTypesDev(), mountOpaqueIdentifier();
        },
        unstable_isNewReconciler: !1
    }, HooksDispatcherOnMountWithHookTypesInDEV = {
        readContext: function(context, observedBits) {
            return readContext(context, observedBits);
        },
        useCallback: function(callback, deps) {
            return currentHookNameInDev = "useCallback", updateHookTypesDev(), mountCallback(callback, deps);
        },
        useContext: function(context, observedBits) {
            return currentHookNameInDev = "useContext", updateHookTypesDev(), readContext(context, observedBits);
        },
        useEffect: function(create, deps) {
            return currentHookNameInDev = "useEffect", updateHookTypesDev(), mountEffect(create, deps);
        },
        useImperativeHandle: function(ref, create, deps) {
            return currentHookNameInDev = "useImperativeHandle", updateHookTypesDev(), mountImperativeHandle(ref, create, deps);
        },
        useLayoutEffect: function(create, deps) {
            return currentHookNameInDev = "useLayoutEffect", updateHookTypesDev(), mountLayoutEffect(create, deps);
        },
        useMemo: function(create, deps) {
            currentHookNameInDev = "useMemo", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountMemo(create, deps);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useReducer: function(reducer, initialArg, init) {
            currentHookNameInDev = "useReducer", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountReducer(reducer, initialArg, init);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useRef: function(initialValue) {
            return currentHookNameInDev = "useRef", updateHookTypesDev(), mountRef(initialValue);
        },
        useState: function(initialState) {
            currentHookNameInDev = "useState", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountState(initialState);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useDebugValue: function(value, formatterFn) {
            return currentHookNameInDev = "useDebugValue", updateHookTypesDev(), mountDebugValue();
        },
        useDeferredValue: function(value) {
            return currentHookNameInDev = "useDeferredValue", updateHookTypesDev(), mountDeferredValue(value);
        },
        useTransition: function() {
            return currentHookNameInDev = "useTransition", updateHookTypesDev(), mountTransition();
        },
        useMutableSource: function(source, getSnapshot, subscribe) {
            return currentHookNameInDev = "useMutableSource", updateHookTypesDev(), mountMutableSource(source, getSnapshot, subscribe);
        },
        useOpaqueIdentifier: function() {
            return currentHookNameInDev = "useOpaqueIdentifier", updateHookTypesDev(), mountOpaqueIdentifier();
        },
        unstable_isNewReconciler: !1
    }, HooksDispatcherOnUpdateInDEV = {
        readContext: function(context, observedBits) {
            return readContext(context, observedBits);
        },
        useCallback: function(callback, deps) {
            return currentHookNameInDev = "useCallback", updateHookTypesDev(), updateCallback(callback, deps);
        },
        useContext: function(context, observedBits) {
            return currentHookNameInDev = "useContext", updateHookTypesDev(), readContext(context, observedBits);
        },
        useEffect: function(create, deps) {
            return currentHookNameInDev = "useEffect", updateHookTypesDev(), updateEffect(create, deps);
        },
        useImperativeHandle: function(ref, create, deps) {
            return currentHookNameInDev = "useImperativeHandle", updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
        },
        useLayoutEffect: function(create, deps) {
            return currentHookNameInDev = "useLayoutEffect", updateHookTypesDev(), updateLayoutEffect(create, deps);
        },
        useMemo: function(create, deps) {
            currentHookNameInDev = "useMemo", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return updateMemo(create, deps);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useReducer: function(reducer, initialArg, init) {
            currentHookNameInDev = "useReducer", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return updateReducer(reducer, initialArg, init);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useRef: function(initialValue) {
            return currentHookNameInDev = "useRef", updateHookTypesDev(), updateRef();
        },
        useState: function(initialState) {
            currentHookNameInDev = "useState", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return updateReducer(basicStateReducer);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useDebugValue: function(value, formatterFn) {
            return currentHookNameInDev = "useDebugValue", updateHookTypesDev(), mountDebugValue();
        },
        useDeferredValue: function(value) {
            return currentHookNameInDev = "useDeferredValue", updateHookTypesDev(), updateDeferredValue(value);
        },
        useTransition: function() {
            return currentHookNameInDev = "useTransition", updateHookTypesDev(), updateTransition();
        },
        useMutableSource: function(source, getSnapshot, subscribe) {
            return currentHookNameInDev = "useMutableSource", updateHookTypesDev(), updateMutableSource(source, getSnapshot, subscribe);
        },
        useOpaqueIdentifier: function() {
            return currentHookNameInDev = "useOpaqueIdentifier", updateHookTypesDev(), updateReducer(basicStateReducer)[0];
        },
        unstable_isNewReconciler: !1
    }, HooksDispatcherOnRerenderInDEV = {
        readContext: function(context, observedBits) {
            return readContext(context, observedBits);
        },
        useCallback: function(callback, deps) {
            return currentHookNameInDev = "useCallback", updateHookTypesDev(), updateCallback(callback, deps);
        },
        useContext: function(context, observedBits) {
            return currentHookNameInDev = "useContext", updateHookTypesDev(), readContext(context, observedBits);
        },
        useEffect: function(create, deps) {
            return currentHookNameInDev = "useEffect", updateHookTypesDev(), updateEffect(create, deps);
        },
        useImperativeHandle: function(ref, create, deps) {
            return currentHookNameInDev = "useImperativeHandle", updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
        },
        useLayoutEffect: function(create, deps) {
            return currentHookNameInDev = "useLayoutEffect", updateHookTypesDev(), updateLayoutEffect(create, deps);
        },
        useMemo: function(create, deps) {
            currentHookNameInDev = "useMemo", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnRerenderInDEV;
            try {
                return updateMemo(create, deps);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useReducer: function(reducer, initialArg, init) {
            currentHookNameInDev = "useReducer", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnRerenderInDEV;
            try {
                return rerenderReducer(reducer, initialArg, init);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useRef: function(initialValue) {
            return currentHookNameInDev = "useRef", updateHookTypesDev(), updateRef();
        },
        useState: function(initialState) {
            currentHookNameInDev = "useState", updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnRerenderInDEV;
            try {
                return rerenderReducer(basicStateReducer);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useDebugValue: function(value, formatterFn) {
            return currentHookNameInDev = "useDebugValue", updateHookTypesDev(), mountDebugValue();
        },
        useDeferredValue: function(value) {
            return currentHookNameInDev = "useDeferredValue", updateHookTypesDev(), rerenderDeferredValue(value);
        },
        useTransition: function() {
            return currentHookNameInDev = "useTransition", updateHookTypesDev(), rerenderTransition();
        },
        useMutableSource: function(source, getSnapshot, subscribe) {
            return currentHookNameInDev = "useMutableSource", updateHookTypesDev(), updateMutableSource(source, getSnapshot, subscribe);
        },
        useOpaqueIdentifier: function() {
            return currentHookNameInDev = "useOpaqueIdentifier", updateHookTypesDev(), rerenderReducer(basicStateReducer)[0];
        },
        unstable_isNewReconciler: !1
    }, InvalidNestedHooksDispatcherOnMountInDEV = {
        readContext: function(context, observedBits) {
            return warnInvalidContextAccess(), readContext(context, observedBits);
        },
        useCallback: function(callback, deps) {
            return currentHookNameInDev = "useCallback", warnInvalidHookAccess(), mountHookTypesDev(), mountCallback(callback, deps);
        },
        useContext: function(context, observedBits) {
            return currentHookNameInDev = "useContext", warnInvalidHookAccess(), mountHookTypesDev(), readContext(context, observedBits);
        },
        useEffect: function(create, deps) {
            return currentHookNameInDev = "useEffect", warnInvalidHookAccess(), mountHookTypesDev(), mountEffect(create, deps);
        },
        useImperativeHandle: function(ref, create, deps) {
            return currentHookNameInDev = "useImperativeHandle", warnInvalidHookAccess(), mountHookTypesDev(), mountImperativeHandle(ref, create, deps);
        },
        useLayoutEffect: function(create, deps) {
            return currentHookNameInDev = "useLayoutEffect", warnInvalidHookAccess(), mountHookTypesDev(), mountLayoutEffect(create, deps);
        },
        useMemo: function(create, deps) {
            currentHookNameInDev = "useMemo", warnInvalidHookAccess(), mountHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountMemo(create, deps);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useReducer: function(reducer, initialArg, init) {
            currentHookNameInDev = "useReducer", warnInvalidHookAccess(), mountHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountReducer(reducer, initialArg, init);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useRef: function(initialValue) {
            return currentHookNameInDev = "useRef", warnInvalidHookAccess(), mountHookTypesDev(), mountRef(initialValue);
        },
        useState: function(initialState) {
            currentHookNameInDev = "useState", warnInvalidHookAccess(), mountHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
            try {
                return mountState(initialState);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useDebugValue: function(value, formatterFn) {
            return currentHookNameInDev = "useDebugValue", warnInvalidHookAccess(), mountHookTypesDev(), mountDebugValue();
        },
        useDeferredValue: function(value) {
            return currentHookNameInDev = "useDeferredValue", warnInvalidHookAccess(), mountHookTypesDev(), mountDeferredValue(value);
        },
        useTransition: function() {
            return currentHookNameInDev = "useTransition", warnInvalidHookAccess(), mountHookTypesDev(), mountTransition();
        },
        useMutableSource: function(source, getSnapshot, subscribe) {
            return currentHookNameInDev = "useMutableSource", warnInvalidHookAccess(), mountHookTypesDev(), mountMutableSource(source, getSnapshot, subscribe);
        },
        useOpaqueIdentifier: function() {
            return currentHookNameInDev = "useOpaqueIdentifier", warnInvalidHookAccess(), mountHookTypesDev(), mountOpaqueIdentifier();
        },
        unstable_isNewReconciler: !1
    }, InvalidNestedHooksDispatcherOnUpdateInDEV = {
        readContext: function(context, observedBits) {
            return warnInvalidContextAccess(), readContext(context, observedBits);
        },
        useCallback: function(callback, deps) {
            return currentHookNameInDev = "useCallback", warnInvalidHookAccess(), updateHookTypesDev(), updateCallback(callback, deps);
        },
        useContext: function(context, observedBits) {
            return currentHookNameInDev = "useContext", warnInvalidHookAccess(), updateHookTypesDev(), readContext(context, observedBits);
        },
        useEffect: function(create, deps) {
            return currentHookNameInDev = "useEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffect(create, deps);
        },
        useImperativeHandle: function(ref, create, deps) {
            return currentHookNameInDev = "useImperativeHandle", warnInvalidHookAccess(), updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
        },
        useLayoutEffect: function(create, deps) {
            return currentHookNameInDev = "useLayoutEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateLayoutEffect(create, deps);
        },
        useMemo: function(create, deps) {
            currentHookNameInDev = "useMemo", warnInvalidHookAccess(), updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return updateMemo(create, deps);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useReducer: function(reducer, initialArg, init) {
            currentHookNameInDev = "useReducer", warnInvalidHookAccess(), updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return updateReducer(reducer, initialArg, init);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useRef: function(initialValue) {
            return currentHookNameInDev = "useRef", warnInvalidHookAccess(), updateHookTypesDev(), updateRef();
        },
        useState: function(initialState) {
            currentHookNameInDev = "useState", warnInvalidHookAccess(), updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return updateReducer(basicStateReducer);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useDebugValue: function(value, formatterFn) {
            return currentHookNameInDev = "useDebugValue", warnInvalidHookAccess(), updateHookTypesDev(), mountDebugValue();
        },
        useDeferredValue: function(value) {
            return currentHookNameInDev = "useDeferredValue", warnInvalidHookAccess(), updateHookTypesDev(), updateDeferredValue(value);
        },
        useTransition: function() {
            return currentHookNameInDev = "useTransition", warnInvalidHookAccess(), updateHookTypesDev(), updateTransition();
        },
        useMutableSource: function(source, getSnapshot, subscribe) {
            return currentHookNameInDev = "useMutableSource", warnInvalidHookAccess(), updateHookTypesDev(), updateMutableSource(source, getSnapshot, subscribe);
        },
        useOpaqueIdentifier: function() {
            return currentHookNameInDev = "useOpaqueIdentifier", warnInvalidHookAccess(), updateHookTypesDev(), updateReducer(basicStateReducer)[0];
        },
        unstable_isNewReconciler: !1
    }, InvalidNestedHooksDispatcherOnRerenderInDEV = {
        readContext: function(context, observedBits) {
            return warnInvalidContextAccess(), readContext(context, observedBits);
        },
        useCallback: function(callback, deps) {
            return currentHookNameInDev = "useCallback", warnInvalidHookAccess(), updateHookTypesDev(), updateCallback(callback, deps);
        },
        useContext: function(context, observedBits) {
            return currentHookNameInDev = "useContext", warnInvalidHookAccess(), updateHookTypesDev(), readContext(context, observedBits);
        },
        useEffect: function(create, deps) {
            return currentHookNameInDev = "useEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffect(create, deps);
        },
        useImperativeHandle: function(ref, create, deps) {
            return currentHookNameInDev = "useImperativeHandle", warnInvalidHookAccess(), updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
        },
        useLayoutEffect: function(create, deps) {
            return currentHookNameInDev = "useLayoutEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateLayoutEffect(create, deps);
        },
        useMemo: function(create, deps) {
            currentHookNameInDev = "useMemo", warnInvalidHookAccess(), updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return updateMemo(create, deps);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useReducer: function(reducer, initialArg, init) {
            currentHookNameInDev = "useReducer", warnInvalidHookAccess(), updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return rerenderReducer(reducer, initialArg, init);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useRef: function(initialValue) {
            return currentHookNameInDev = "useRef", warnInvalidHookAccess(), updateHookTypesDev(), updateRef();
        },
        useState: function(initialState) {
            currentHookNameInDev = "useState", warnInvalidHookAccess(), updateHookTypesDev();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
            try {
                return rerenderReducer(basicStateReducer);
            } finally{
                ReactCurrentDispatcher$1.current = prevDispatcher;
            }
        },
        useDebugValue: function(value, formatterFn) {
            return currentHookNameInDev = "useDebugValue", warnInvalidHookAccess(), updateHookTypesDev(), mountDebugValue();
        },
        useDeferredValue: function(value) {
            return currentHookNameInDev = "useDeferredValue", warnInvalidHookAccess(), updateHookTypesDev(), rerenderDeferredValue(value);
        },
        useTransition: function() {
            return currentHookNameInDev = "useTransition", warnInvalidHookAccess(), updateHookTypesDev(), rerenderTransition();
        },
        useMutableSource: function(source, getSnapshot, subscribe) {
            return currentHookNameInDev = "useMutableSource", warnInvalidHookAccess(), updateHookTypesDev(), updateMutableSource(source, getSnapshot, subscribe);
        },
        useOpaqueIdentifier: function() {
            return currentHookNameInDev = "useOpaqueIdentifier", warnInvalidHookAccess(), updateHookTypesDev(), rerenderReducer(basicStateReducer)[0];
        },
        unstable_isNewReconciler: !1
    };
    var commitTime = 0, profilerStartTime = -1;
    function startProfilerTimer(fiber) {
        profilerStartTime = unstable_now(), fiber.actualStartTime < 0 && (fiber.actualStartTime = unstable_now());
    }
    function stopProfilerTimerIfRunningAndRecordDelta(fiber, overrideBaseTime) {
        if (profilerStartTime >= 0) {
            var elapsedTime = unstable_now() - profilerStartTime;
            fiber.actualDuration += elapsedTime, overrideBaseTime && (fiber.selfBaseDuration = elapsedTime), profilerStartTime = -1;
        }
    }
    function transferActualDuration(fiber) {
        for(// Transfer time spent rendering these children so we don't lose it
        // after we rerender. This is used as a helper in special cases
        // where we should count the work of multiple passes.
        var child = fiber.child; child;)fiber.actualDuration += child.actualDuration, child = child.sibling;
    }
    var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner, didReceiveUpdate = !1;
    function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
        null === current ? // If this is a fresh new component that hasn't been rendered yet, we
        // won't update its child set by applying minimal side-effects. Instead,
        // we will add them all to the child before it gets rendered. That means
        // we can optimize this reconciliation pass by not tracking side-effects.
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes) : // If the current child is the same as the work in progress, it means that
        // we haven't yet started any work on these children. Therefore, we use
        // the clone algorithm to create a copy of all the current children.
        // If we had any progressed work already, that is invalid at this point so
        // let's throw it out.
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
    }
    function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {
        if (workInProgress.type !== workInProgress.elementType) {
            // Lazy component props can't be validated in createElement
            // because they're only guaranteed to be resolved here.
            var nextChildren, innerPropTypes = Component.propTypes;
            innerPropTypes && checkPropTypes(innerPropTypes, nextProps, "prop", getComponentName(Component));
        }
        var render = Component.render, ref = workInProgress.ref;
        if (prepareToReadContext(workInProgress, renderLanes), ReactCurrentOwner$1.current = workInProgress, isRendering = !0, nextChildren = renderWithHooks(current, workInProgress, render, nextProps, ref, renderLanes), 1 & workInProgress.mode) {
            disableLogs();
            try {
                nextChildren = renderWithHooks(current, workInProgress, render, nextProps, ref, renderLanes);
            } finally{
                reenableLogs();
            }
        }
        return (isRendering = !1, null === current || didReceiveUpdate) ? (workInProgress.flags |= /*                */ 1, reconcileChildren(current, workInProgress, nextChildren, renderLanes), workInProgress.child) : (bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)) // React DevTools reads this flag.
        ;
    }
    function updateMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {
        if (null === current) {
            var type, type1 = Component.type;
            if ("function" == typeof (type = type1) && !shouldConstruct$1(type) && void 0 === type.defaultProps && null === Component.compare && // SimpleMemoComponent codepath doesn't resolve outer props either.
            void 0 === Component.defaultProps) {
                var resolvedType = type1;
                return resolvedType = resolveFunctionForHotReloading(type1), // and with only the default shallow comparison, we upgrade it
                // to a SimpleMemoComponent to allow fast path updates.
                workInProgress.tag = 15, workInProgress.type = resolvedType, validateFunctionComponentInDev(workInProgress, type1), updateSimpleMemoComponent(current, workInProgress, resolvedType, nextProps, updateLanes, renderLanes);
            }
            var innerPropTypes = type1.propTypes;
            innerPropTypes && // Inner memo component props aren't currently validated in createElement.
            // We could move it there, but we'd still need this for lazy code path.
            checkPropTypes(innerPropTypes, nextProps, "prop", getComponentName(type1));
            var child = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress, workInProgress.mode, renderLanes);
            return child.ref = workInProgress.ref, child.return = workInProgress, workInProgress.child = child, child;
        }
        var _type = Component.type, _innerPropTypes = _type.propTypes;
        _innerPropTypes && // Inner memo component props aren't currently validated in createElement.
        // We could move it there, but we'd still need this for lazy code path.
        checkPropTypes(_innerPropTypes, nextProps, "prop", getComponentName(_type));
        var currentChild = current.child; // This is always exactly one child
        if (!((updateLanes & renderLanes) != 0)) {
            // This will be the props with resolved defaultProps,
            // unlike current.memoizedProps which will be the unresolved ones.
            var prevProps = currentChild.memoizedProps, compare = Component.compare; // Default to shallow comparison
            if ((compare = null !== compare ? compare : shallowEqual)(prevProps, nextProps) && current.ref === workInProgress.ref) return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
        } // React DevTools reads this flag.
        workInProgress.flags |= 1;
        var newChild = createWorkInProgress(currentChild, nextProps);
        return newChild.ref = workInProgress.ref, newChild.return = workInProgress, workInProgress.child = newChild, newChild;
    }
    function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, updateLanes, renderLanes) {
        if (workInProgress.type !== workInProgress.elementType) {
            // Lazy component props can't be validated in createElement
            // because they're only guaranteed to be resolved here.
            var outerMemoType = workInProgress.elementType;
            if (outerMemoType.$$typeof === REACT_LAZY_TYPE) {
                // We warn when you define propTypes on lazy()
                // so let's just skip over it to find memo() outer wrapper.
                // Inner props for memo are validated later.
                var lazyComponent = outerMemoType, payload = lazyComponent._payload, init = lazyComponent._init;
                try {
                    outerMemoType = init(payload);
                } catch (x) {
                    outerMemoType = null;
                } // Inner propTypes will be validated in the function component path.
                var outerPropTypes = outerMemoType && outerMemoType.propTypes;
                outerPropTypes && checkPropTypes(outerPropTypes, nextProps, "prop", getComponentName(outerMemoType));
            }
        }
        if (null !== current && shallowEqual(current.memoizedProps, nextProps) && current.ref === workInProgress.ref && // Prevent bailout if the implementation changed due to hot reload.
        workInProgress.type === current.type) {
            if (didReceiveUpdate = !1, !((renderLanes & updateLanes) != 0)) return(// The pending lanes were cleared at the beginning of beginWork. We're
            // about to bail out, but there might be other lanes that weren't
            // included in the current render. Usually, the priority level of the
            // remaining updates is accumlated during the evaluation of the
            // component (i.e. when processing the update queue). But since since
            // we're bailing out early *without* evaluating the component, we need
            // to account for it here, too. Reset to the value of the current fiber.
            // NOTE: This only applies to SimpleMemoComponent, not MemoComponent,
            // because a MemoComponent fiber does not have hooks or an update queue;
            // rather, it wraps around an inner component, which may or may not
            // contains hooks.
            // TODO: Move the reset at in beginWork out of the common path so that
            // this is no longer necessary.
            workInProgress.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes));
            (/* */ 16384 & current.flags) != 0 && // This is a special case that only exists for legacy mode.
            // See https://github.com/facebook/react/pull/19216.
            (didReceiveUpdate = !0);
        }
        return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
    }
    function updateOffscreenComponent(current, workInProgress, renderLanes) {
        var nextBaseLanes, _subtreeRenderLanes, nextProps = workInProgress.pendingProps, nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
        if ("hidden" === nextProps.mode || "unstable-defer-without-hiding" === nextProps.mode) {
            if ((4 & workInProgress.mode) == 0) workInProgress.memoizedState = {
                baseLanes: 0
            }, pushRenderLanes(workInProgress, renderLanes);
            else if ((1073741824 & renderLanes) != 0) workInProgress.memoizedState = {
                baseLanes: 0
            }, pushRenderLanes(workInProgress, null !== prevState ? prevState.baseLanes : renderLanes);
            else {
                nextBaseLanes = null !== prevState ? prevState.baseLanes | renderLanes : renderLanes, markSpawnedWork(1073741824), workInProgress.lanes = workInProgress.childLanes = 1073741824;
                var _nextState = {
                    baseLanes: nextBaseLanes
                };
                return workInProgress.memoizedState = _nextState, // to avoid a push/pop misalignment.
                pushRenderLanes(workInProgress, nextBaseLanes), null;
            }
        } else null !== prevState ? (_subtreeRenderLanes = prevState.baseLanes | renderLanes, workInProgress.memoizedState = null) : // We weren't previously hidden, and we still aren't, so there's nothing
        // special to do. Need to push to the stack regardless, though, to avoid
        // a push/pop misalignment.
        _subtreeRenderLanes = renderLanes, pushRenderLanes(workInProgress, _subtreeRenderLanes);
        return reconcileChildren(current, workInProgress, nextChildren, renderLanes), workInProgress.child;
    } // Note: These happen to have identical begin phases, for now. We shouldn't hold
    function markRef(current, workInProgress) {
        var ref = workInProgress.ref;
        (null === current && null !== ref || null !== current && current.ref !== ref) && // Schedule a Ref effect
        (workInProgress.flags |= /*                          */ 128);
    }
    function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
        if (workInProgress.type !== workInProgress.elementType) {
            // Lazy component props can't be validated in createElement
            // because they're only guaranteed to be resolved here.
            var context, nextChildren, innerPropTypes = Component.propTypes;
            innerPropTypes && checkPropTypes(innerPropTypes, nextProps, "prop", getComponentName(Component));
        }
        var unmaskedContext = getUnmaskedContext(workInProgress, Component, !0);
        if (context = getMaskedContext(workInProgress, unmaskedContext), prepareToReadContext(workInProgress, renderLanes), ReactCurrentOwner$1.current = workInProgress, isRendering = !0, nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes), 1 & workInProgress.mode) {
            disableLogs();
            try {
                nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes);
            } finally{
                reenableLogs();
            }
        }
        return (isRendering = !1, null === current || didReceiveUpdate) ? (workInProgress.flags |= 1, reconcileChildren(current, workInProgress, nextChildren, renderLanes), workInProgress.child) : (bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)) // React DevTools reads this flag.
        ;
    }
    function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
        if (workInProgress.type !== workInProgress.elementType) {
            // Lazy component props can't be validated in createElement
            // because they're only guaranteed to be resolved here.
            var hasContext, shouldUpdate, innerPropTypes = Component.propTypes;
            innerPropTypes && checkPropTypes(innerPropTypes, nextProps, "prop", getComponentName(Component));
        }
        isContextProvider(Component) ? (hasContext = !0, pushContextProvider(workInProgress)) : hasContext = !1, prepareToReadContext(workInProgress, renderLanes), null === workInProgress.stateNode ? (null !== current && (// A class component without an instance only mounts if it suspended
        // inside a non-concurrent tree, in an inconsistent state. We want to
        // treat it like a new mount, even though an empty version of it already
        // committed. Disconnect the alternate pointers.
        current.alternate = null, workInProgress.alternate = null, workInProgress.flags |= 2), constructClassInstance(workInProgress, Component, nextProps), mountClassInstance(workInProgress, Component, nextProps, renderLanes), shouldUpdate = !0) : // In a resume, we'll already have an instance we can reuse.
        shouldUpdate = null === current ? function(workInProgress, ctor, newProps, renderLanes) {
            var instance = workInProgress.stateNode, oldProps = workInProgress.memoizedProps;
            instance.props = oldProps;
            var oldContext = instance.context, contextType = ctor.contextType, nextContext = emptyContextObject;
            if ("object" == typeof contextType && null !== contextType) nextContext = readContext(contextType);
            else {
                var nextLegacyUnmaskedContext = getUnmaskedContext(workInProgress, ctor, !0);
                nextContext = getMaskedContext(workInProgress, nextLegacyUnmaskedContext);
            }
            var getDerivedStateFromProps = ctor.getDerivedStateFromProps, hasNewLifecycles = "function" == typeof getDerivedStateFromProps || "function" == typeof instance.getSnapshotBeforeUpdate;
            hasNewLifecycles || "function" != typeof instance.UNSAFE_componentWillReceiveProps && "function" != typeof instance.componentWillReceiveProps || oldProps === newProps && oldContext === nextContext || callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext), hasForceUpdate = !1;
            var oldState = workInProgress.memoizedState, newState = instance.state = oldState;
            if (processUpdateQueue(workInProgress, newProps, instance, renderLanes), newState = workInProgress.memoizedState, oldProps === newProps && oldState === newState && !hasContextChanged() && !hasForceUpdate) return "function" == typeof instance.componentDidMount && (workInProgress.flags |= 4), !1;
            "function" == typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps), newState = workInProgress.memoizedState);
            var shouldUpdate = hasForceUpdate || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
            return shouldUpdate ? (hasNewLifecycles || "function" != typeof instance.UNSAFE_componentWillMount && "function" != typeof instance.componentWillMount || ("function" == typeof instance.componentWillMount && instance.componentWillMount(), "function" == typeof instance.UNSAFE_componentWillMount && instance.UNSAFE_componentWillMount()), "function" == typeof instance.componentDidMount && (workInProgress.flags |= 4)) : ("function" == typeof instance.componentDidMount && (workInProgress.flags |= 4), // memoized state to indicate that this work can be reused.
            workInProgress.memoizedProps = newProps, workInProgress.memoizedState = newState), // if shouldComponentUpdate returns false.
            instance.props = newProps, instance.state = newState, instance.context = nextContext, shouldUpdate;
        } // Invokes the update life-cycles and returns false if it shouldn't rerender.
        (workInProgress, Component, nextProps, renderLanes) : function(current, workInProgress, ctor, newProps, renderLanes) {
            var instance = workInProgress.stateNode;
            cloneUpdateQueue(current, workInProgress);
            var unresolvedOldProps = workInProgress.memoizedProps, oldProps = workInProgress.type === workInProgress.elementType ? unresolvedOldProps : resolveDefaultProps(workInProgress.type, unresolvedOldProps);
            instance.props = oldProps;
            var unresolvedNewProps = workInProgress.pendingProps, oldContext = instance.context, contextType = ctor.contextType, nextContext = emptyContextObject;
            if ("object" == typeof contextType && null !== contextType) nextContext = readContext(contextType);
            else {
                var nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, !0);
                nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
            }
            var getDerivedStateFromProps = ctor.getDerivedStateFromProps, hasNewLifecycles = "function" == typeof getDerivedStateFromProps || "function" == typeof instance.getSnapshotBeforeUpdate;
            hasNewLifecycles || "function" != typeof instance.UNSAFE_componentWillReceiveProps && "function" != typeof instance.componentWillReceiveProps || unresolvedOldProps === unresolvedNewProps && oldContext === nextContext || callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext), hasForceUpdate = !1;
            var oldState = workInProgress.memoizedState, newState = instance.state = oldState;
            if (processUpdateQueue(workInProgress, newProps, instance, renderLanes), newState = workInProgress.memoizedState, unresolvedOldProps === unresolvedNewProps && oldState === newState && !hasContextChanged() && !hasForceUpdate) return "function" == typeof instance.componentDidUpdate && (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) && (workInProgress.flags |= 4), "function" == typeof instance.getSnapshotBeforeUpdate && (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) && (workInProgress.flags |= /*                     */ 256), !1;
            "function" == typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps), newState = workInProgress.memoizedState);
            var shouldUpdate = hasForceUpdate || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
            return shouldUpdate ? (hasNewLifecycles || "function" != typeof instance.UNSAFE_componentWillUpdate && "function" != typeof instance.componentWillUpdate || ("function" == typeof instance.componentWillUpdate && instance.componentWillUpdate(newProps, newState, nextContext), "function" == typeof instance.UNSAFE_componentWillUpdate && instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext)), "function" == typeof instance.componentDidUpdate && (workInProgress.flags |= 4), "function" == typeof instance.getSnapshotBeforeUpdate && (workInProgress.flags |= 256)) : ("function" == typeof instance.componentDidUpdate && (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) && (workInProgress.flags |= 4), "function" == typeof instance.getSnapshotBeforeUpdate && (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) && (workInProgress.flags |= 256), // memoized props/state to indicate that this work can be reused.
            workInProgress.memoizedProps = newProps, workInProgress.memoizedState = newState), // if shouldComponentUpdate returns false.
            instance.props = newProps, instance.state = newState, instance.context = nextContext, shouldUpdate;
        }(current, workInProgress, Component, nextProps, renderLanes);
        var nextUnitOfWork = finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes), inst = workInProgress.stateNode;
        return shouldUpdate && inst.props !== nextProps && (didWarnAboutReassigningProps || error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentName(workInProgress.type) || "a component"), didWarnAboutReassigningProps = !0), nextUnitOfWork;
    }
    function finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes) {
        // Refs should update even if shouldComponentUpdate returns false
        markRef(current, workInProgress);
        var nextChildren, nextChildren1, didCaptureError = (64 & workInProgress.flags) != 0;
        if (!shouldUpdate && !didCaptureError) return hasContext && invalidateContextProvider(workInProgress, Component, !1), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
        var instance = workInProgress.stateNode; // Rerender
        if (ReactCurrentOwner$1.current = workInProgress, didCaptureError && "function" != typeof Component.getDerivedStateFromError) // If we captured an error, but getDerivedStateFromError is not defined,
        // unmount all the children. componentDidCatch will schedule an update to
        // re-render a fallback. This is temporary until we migrate everyone to
        // the new API.
        // TODO: Warn in a future release.
        nextChildren1 = null, profilerStartTime = -1;
        else {
            if (isRendering = !0, nextChildren1 = instance.render(), 1 & workInProgress.mode) {
                disableLogs();
                try {
                    instance.render();
                } finally{
                    reenableLogs();
                }
            }
            isRendering = !1;
        } // React DevTools reads this flag.
        return (workInProgress.flags |= 1, null !== current && didCaptureError) ? (nextChildren = nextChildren1, // This function is fork of reconcileChildren. It's used in cases where we
        // want to reconcile without matching against the existing set. This has the
        // effect of all current children being unmounted; even if the type and key
        // are the same, the old child is unmounted and a new child is created.
        //
        // To do this, we're going to go through the reconcile algorithm twice. In
        // the first pass, we schedule a deletion for all the current children by
        // passing null.
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes), // pass null in place of where we usually pass the current child set. This has
        // the effect of remounting all children regardless of whether their
        // identities match.
        workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes)) : reconcileChildren(current, workInProgress, nextChildren1, renderLanes), // TODO: Restructure so we never read values from the instance.
        workInProgress.memoizedState = instance.state, hasContext && invalidateContextProvider(workInProgress, Component, !0), workInProgress.child;
    }
    function pushHostRootContext(workInProgress) {
        var root = workInProgress.stateNode;
        root.pendingContext ? pushTopLevelContextObject(workInProgress, root.pendingContext, root.pendingContext !== root.context) : root.context && // Should always be set
        pushTopLevelContextObject(workInProgress, root.context, !1), pushHostContainer(workInProgress, root.containerInfo);
    }
    function validateFunctionComponentInDev(workInProgress, Component) {
        if (Component && Component.childContextTypes && error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component"), null !== workInProgress.ref) {
            var info = "", ownerName = getCurrentFiberOwnerNameInDevOrNull();
            ownerName && (info += "\n\nCheck the render method of `" + ownerName + "`.");
            var warningKey = ownerName || workInProgress._debugID || "", debugSource = workInProgress._debugSource;
            debugSource && (warningKey = debugSource.fileName + ":" + debugSource.lineNumber), didWarnAboutFunctionRefs[warningKey] || (didWarnAboutFunctionRefs[warningKey] = !0, error("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", info));
        }
        if ("function" == typeof Component.getDerivedStateFromProps) {
            var _componentName3 = getComponentName(Component) || "Unknown";
            didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] || (error("%s: Function components do not support getDerivedStateFromProps.", _componentName3), didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = !0);
        }
        if ("object" == typeof Component.contextType && null !== Component.contextType) {
            var _componentName4 = getComponentName(Component) || "Unknown";
            didWarnAboutContextTypeOnFunctionComponent[_componentName4] || (error("%s: Function components do not support contextType.", _componentName4), didWarnAboutContextTypeOnFunctionComponent[_componentName4] = !0);
        }
    }
    didWarnAboutBadClass = {}, didWarnAboutModulePatternComponent = {}, didWarnAboutContextTypeOnFunctionComponent = {}, didWarnAboutGetDerivedStateOnFunctionComponent = {}, didWarnAboutFunctionRefs = {}, didWarnAboutReassigningProps = !1, didWarnAboutRevealOrder = {}, didWarnAboutTailOptions = {};
    var SUSPENDED_MARKER = {
        dehydrated: null,
        retryLane: 0
    };
    function mountSuspenseOffscreenState(renderLanes) {
        return {
            baseLanes: renderLanes
        };
    }
    function updateSuspenseOffscreenState(prevOffscreenState, renderLanes) {
        return {
            baseLanes: prevOffscreenState.baseLanes | renderLanes
        };
    } // TODO: Probably should inline this back
    function getRemainingWorkInPrimaryTree(current, renderLanes) {
        // TODO: Should not remove render lanes that were pinged during this render
        return current.childLanes & ~renderLanes;
    }
    function updateSuspenseComponent(current, workInProgress, renderLanes) {
        var nextProps = workInProgress.pendingProps; // This is used by DevTools to force a boundary to suspend.
        shouldSuspendImpl(workInProgress) && (workInProgress.flags |= 64);
        var suspenseContext = suspenseStackCursor.current, showFallback = !1;
        if ((64 & workInProgress.flags) == 0 && (suspenseContext1 = suspenseContext, // If we're already showing a fallback, there are cases where we need to
        // remain on that fallback regardless of whether the content has resolved.
        // For example, SuspenseList coordinates when nested content appears.
        null !== (current1 = current) && null === current1.memoizedState ? 1 : (2 & suspenseContext1) == 0 // Not currently showing content. Consult the Suspense context.
        )) // Attempting the main content
        (null === current || null !== current.memoizedState) && void 0 !== nextProps.fallback && !0 !== nextProps.unstable_avoidThisFallback && (suspenseContext |= 1);
        else // Something in this boundary's subtree already suspended. Switch to
        // rendering the fallback children.
        showFallback = !0, workInProgress.flags &= -65;
        // boundary's children. This involves some custom reconcilation logic. Two
        // main reasons this is so complicated.
        //
        // First, Legacy Mode has different semantics for backwards compatibility. The
        // primary tree will commit in an inconsistent state, so when we do the
        // second pass to render the fallback, we do some exceedingly, uh, clever
        // hacks to make that not totally break. Like transferring effects and
        // deletions from hidden tree. In Concurrent Mode, it's much simpler,
        // because we bailout on the primary tree completely and leave it in its old
        // state, no effects. Same as what we do for Offscreen (except that
        // Offscreen doesn't have the first render pass).
        //
        // Second is hydration. During hydration, the Suspense fiber has a slightly
        // different layout, where the child points to a dehydrated fragment, which
        // contains the DOM rendered by the server.
        //
        // Third, even if you set all that aside, Suspense is like error boundaries in
        // that we first we try to render one tree, and if that fails, we render again
        // and switch to a different tree. Like a try/catch block. So we have to track
        // which branch we're currently rendering. Ideally we would model this using
        // a stack.
        if (push(suspenseStackCursor, suspenseContext &= 1, workInProgress), null === current) {
            // Initial mount
            // If we're currently hydrating, try to hydrate this boundary.
            // But only if this has a fallback.
            void 0 !== nextProps.fallback && tryToClaimNextHydratableInstance(workInProgress);
            var suspenseContext1, current1, workInProgress1, renderLanes1, workInProgress2, primaryChildren, renderLanes2, primaryChildFragment, nextPrimaryChildren = nextProps.children, nextFallbackChildren = nextProps.fallback;
            if (showFallback) {
                var fallbackFragment = mountSuspenseFallbackChildren(workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
                return workInProgress.child.memoizedState = mountSuspenseOffscreenState(renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, fallbackFragment;
            }
            if ("number" != typeof nextProps.unstable_expectedLoadTime) {
                return workInProgress2 = workInProgress, primaryChildren = nextPrimaryChildren, renderLanes2 = renderLanes, (primaryChildFragment = createFiberFromOffscreen({
                    mode: "visible",
                    children: primaryChildren
                }, workInProgress2.mode, renderLanes2, null)).return = workInProgress2, workInProgress2.child = primaryChildFragment, primaryChildFragment;
            }
            // This is a CPU-bound tree. Skip this tree and show a placeholder to
            // unblock the surrounding content. Then immediately retry after the
            // initial commit.
            var _fallbackFragment = mountSuspenseFallbackChildren(workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
            return workInProgress.child.memoizedState = mountSuspenseOffscreenState(renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, // get it started back up to attempt the next item. While in terms of
            // priority this work has the same priority as this current render, it's
            // not part of the same transition once the transition has committed. If
            // it's sync, we still want to yield so that it can be painted.
            // Conceptually, this is really the same as pinging. We can use any
            // RetryLane even if it's the one currently rendering since we're leaving
            // it behind on this node.
            workInProgress.lanes = /*                  */ 33554432, markSpawnedWork(33554432), _fallbackFragment;
        }
        if (null !== current.memoizedState) {
            if (showFallback) {
                var _nextFallbackChildren2 = nextProps.fallback, _fallbackChildFragment = updateSuspenseFallbackChildren(current, workInProgress, nextProps.children, _nextFallbackChildren2, renderLanes), _primaryChildFragment3 = workInProgress.child, prevOffscreenState = current.child.memoizedState;
                return _primaryChildFragment3.memoizedState = null === prevOffscreenState ? mountSuspenseOffscreenState(renderLanes) : updateSuspenseOffscreenState(prevOffscreenState, renderLanes), _primaryChildFragment3.childLanes = getRemainingWorkInPrimaryTree(current, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, _fallbackChildFragment;
            }
            var _primaryChildFragment4 = updateSuspensePrimaryChildren(current, workInProgress, nextProps.children, renderLanes);
            return workInProgress.memoizedState = null, _primaryChildFragment4;
        }
        // The current tree is not already showing a fallback.
        if (showFallback) {
            // Timed out.
            var _nextFallbackChildren3 = nextProps.fallback, _fallbackChildFragment2 = updateSuspenseFallbackChildren(current, workInProgress, nextProps.children, _nextFallbackChildren3, renderLanes), _primaryChildFragment5 = workInProgress.child, _prevOffscreenState = current.child.memoizedState;
            return _primaryChildFragment5.memoizedState = null === _prevOffscreenState ? mountSuspenseOffscreenState(renderLanes) : updateSuspenseOffscreenState(_prevOffscreenState, renderLanes), _primaryChildFragment5.childLanes = getRemainingWorkInPrimaryTree(current, renderLanes), // fallback children.
            workInProgress.memoizedState = SUSPENDED_MARKER, _fallbackChildFragment2;
        }
        var _primaryChildFragment6 = updateSuspensePrimaryChildren(current, workInProgress, nextProps.children, renderLanes);
        return workInProgress.memoizedState = null, _primaryChildFragment6;
    }
    function mountSuspenseFallbackChildren(workInProgress, primaryChildren, fallbackChildren, renderLanes) {
        var primaryChildFragment, fallbackChildFragment, mode = workInProgress.mode, progressedPrimaryFragment = workInProgress.child, primaryChildProps = {
            mode: "hidden",
            children: primaryChildren
        };
        return (2 & mode) == 0 && null !== progressedPrimaryFragment ? (// In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (primaryChildFragment = progressedPrimaryFragment).childLanes = 0, primaryChildFragment.pendingProps = primaryChildProps, 8 & workInProgress.mode && (// Reset the durations from the first pass so they aren't included in the
        // final amounts. This seems counterintuitive, since we're intentionally
        // not measuring part of the render phase, but this makes it match what we
        // do in Concurrent Mode.
        primaryChildFragment.actualDuration = 0, primaryChildFragment.actualStartTime = -1, primaryChildFragment.selfBaseDuration = 0, primaryChildFragment.treeBaseDuration = 0)) : primaryChildFragment = createFiberFromOffscreen(primaryChildProps, mode, 0, null), fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null), primaryChildFragment.return = workInProgress, fallbackChildFragment.return = workInProgress, primaryChildFragment.sibling = fallbackChildFragment, workInProgress.child = primaryChildFragment, fallbackChildFragment;
    }
    function updateSuspensePrimaryChildren(current, workInProgress, primaryChildren, renderLanes) {
        var currentPrimaryChildFragment = current.child, currentFallbackChildFragment = currentPrimaryChildFragment.sibling, primaryChildFragment = createWorkInProgress(currentPrimaryChildFragment, {
            mode: "visible",
            children: primaryChildren
        });
        return (2 & workInProgress.mode) == 0 && (primaryChildFragment.lanes = renderLanes), primaryChildFragment.return = workInProgress, primaryChildFragment.sibling = null, null !== currentFallbackChildFragment && (// Delete the fallback child fragment
        currentFallbackChildFragment.nextEffect = null, currentFallbackChildFragment.flags = 8, workInProgress.firstEffect = workInProgress.lastEffect = currentFallbackChildFragment), workInProgress.child = primaryChildFragment, primaryChildFragment;
    }
    function updateSuspenseFallbackChildren(current, workInProgress, primaryChildren, fallbackChildren, renderLanes) {
        var primaryChildFragment, fallbackChildFragment, mode = workInProgress.mode, currentPrimaryChildFragment = current.child, currentFallbackChildFragment = currentPrimaryChildFragment.sibling, primaryChildProps = {
            mode: "hidden",
            children: primaryChildren
        };
        if (// In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (2 & mode) == 0 && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        workInProgress.child !== currentPrimaryChildFragment) {
            (primaryChildFragment = workInProgress.child).childLanes = 0, primaryChildFragment.pendingProps = primaryChildProps, 8 & workInProgress.mode && (// Reset the durations from the first pass so they aren't included in the
            // final amounts. This seems counterintuitive, since we're intentionally
            // not measuring part of the render phase, but this makes it match what we
            // do in Concurrent Mode.
            primaryChildFragment.actualDuration = 0, primaryChildFragment.actualStartTime = -1, primaryChildFragment.selfBaseDuration = currentPrimaryChildFragment.selfBaseDuration, primaryChildFragment.treeBaseDuration = currentPrimaryChildFragment.treeBaseDuration);
            // However, since we're going to remain on the fallback, we no longer want
            // to delete it. So we need to remove it from the list. Deletions are stored
            // on the same list as effects. We want to keep the effects from the primary
            // tree. So we copy the primary child fragment's effect list, which does not
            // include the fallback deletion effect.
            var progressedLastEffect = primaryChildFragment.lastEffect;
            null !== progressedLastEffect ? (workInProgress.firstEffect = primaryChildFragment.firstEffect, workInProgress.lastEffect = progressedLastEffect, progressedLastEffect.nextEffect = null) : // TODO: Reset this somewhere else? Lol legacy mode is so weird.
            workInProgress.firstEffect = workInProgress.lastEffect = null;
        } else primaryChildFragment = createWorkInProgress(currentPrimaryChildFragment, primaryChildProps);
        return null !== currentFallbackChildFragment ? fallbackChildFragment = createWorkInProgress(currentFallbackChildFragment, fallbackChildren) : (fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null), // mounted but this is a new fiber.
        fallbackChildFragment.flags |= 2), fallbackChildFragment.return = workInProgress, primaryChildFragment.return = workInProgress, primaryChildFragment.sibling = fallbackChildFragment, workInProgress.child = primaryChildFragment, fallbackChildFragment;
    }
    function scheduleWorkOnFiber(fiber, renderLanes) {
        fiber.lanes = fiber.lanes | renderLanes;
        var alternate = fiber.alternate;
        null !== alternate && (alternate.lanes = alternate.lanes | renderLanes), scheduleWorkOnParentPath(fiber.return, renderLanes);
    }
    function validateSuspenseListNestedChild(childSlot, index) {
        var isArray = Array.isArray(childSlot), isIterable = !isArray && "function" == typeof getIteratorFn(childSlot);
        if (isArray || isIterable) {
            var type = isArray ? "array" : "iterable";
            return error("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", type, index, type), !1;
        }
        return !0;
    }
    function initSuspenseListRenderState(workInProgress, isBackwards, tail, lastContentRow, tailMode, lastEffectBeforeRendering) {
        var renderState = workInProgress.memoizedState;
        null === renderState ? workInProgress.memoizedState = {
            isBackwards: isBackwards,
            rendering: null,
            renderingStartTime: 0,
            last: lastContentRow,
            tail: tail,
            tailMode: tailMode,
            lastEffect: lastEffectBeforeRendering
        } : (// We can reuse the existing object from previous renders.
        renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.lastEffect = lastEffectBeforeRendering);
    } // This can end up rendering this component multiple passes.
    // The first pass splits the children fibers into two sets. A head and tail.
    // We first render the head. If anything is in fallback state, we do another
    // pass through beginWork to rerender all children (including the tail) with
    // the force suspend context. If the first render didn't have anything in
    // in fallback state. Then we render each row in the tail one-by-one.
    // That happens in the completeWork phase without going back to beginWork.
    function updateSuspenseListComponent(current, workInProgress, renderLanes) {
        var nextProps = workInProgress.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail, newChildren = nextProps.children;
        !function(revealOrder) {
            if (void 0 !== revealOrder && "forwards" !== revealOrder && "backwards" !== revealOrder && "together" !== revealOrder && !didWarnAboutRevealOrder[revealOrder]) {
                if (didWarnAboutRevealOrder[revealOrder] = !0, "string" == typeof revealOrder) switch(revealOrder.toLowerCase()){
                    case "together":
                    case "forwards":
                    case "backwards":
                        error('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', revealOrder, revealOrder.toLowerCase());
                        break;
                    case "forward":
                    case "backward":
                        error('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', revealOrder, revealOrder.toLowerCase());
                        break;
                    default:
                        error('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', revealOrder);
                }
                else error('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', revealOrder);
            }
        }(revealOrder), void 0 === tailMode || didWarnAboutTailOptions[tailMode] || ("collapsed" !== tailMode && "hidden" !== tailMode ? (didWarnAboutTailOptions[tailMode] = !0, error('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', tailMode)) : "forwards" !== revealOrder && "backwards" !== revealOrder && (didWarnAboutTailOptions[tailMode] = !0, error('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', tailMode))), function(children, revealOrder) {
            if (("forwards" === revealOrder || "backwards" === revealOrder) && null != children && !1 !== children) {
                if (Array.isArray(children)) {
                    for(var i = 0; i < children.length; i++)if (!validateSuspenseListNestedChild(children[i], i)) return;
                } else {
                    var iteratorFn = getIteratorFn(children);
                    if ("function" == typeof iteratorFn) {
                        var childrenIterator = iteratorFn.call(children);
                        if (childrenIterator) for(var step = childrenIterator.next(), _i = 0; !step.done; step = childrenIterator.next()){
                            if (!validateSuspenseListNestedChild(step.value, _i)) return;
                            _i++;
                        }
                    } else error('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', revealOrder);
                }
            }
        }(newChildren, revealOrder), reconcileChildren(current, workInProgress, newChildren, renderLanes);
        var suspenseContext = suspenseStackCursor.current;
        if ((2 & suspenseContext) != 0 ? (suspenseContext = 1 & suspenseContext | 2, workInProgress.flags |= 64) : (null !== current && (64 & current.flags) != 0 && // If we previously forced a fallback, we need to schedule work
        // on any nested boundaries to let them know to try to render
        // again. This is the same as context updating.
        function(workInProgress, firstChild, renderLanes) {
            for(// Mark any Suspense boundaries with fallbacks as having work to do.
            // If they were previously forced into fallbacks, they may now be able
            // to unblock.
            var node = firstChild; null !== node;){
                if (13 === node.tag) null !== node.memoizedState && scheduleWorkOnFiber(node, renderLanes);
                else if (19 === node.tag) // If the tail is hidden there might not be an Suspense boundaries
                // to schedule work on. In this case we have to schedule it on the
                // list itself.
                // We don't have to traverse to the children of the list since
                // the list will propagate the change when it rerenders.
                scheduleWorkOnFiber(node, renderLanes);
                else if (null !== node.child) {
                    node.child.return = node, node = node.child;
                    continue;
                }
                if (node === workInProgress) return;
                for(; null === node.sibling;){
                    if (null === node.return || node.return === workInProgress) return;
                    node = node.return;
                }
                node.sibling.return = node.return, node = node.sibling;
            }
        }(workInProgress, workInProgress.child, renderLanes), suspenseContext &= 1), push(suspenseStackCursor, suspenseContext, workInProgress), (2 & workInProgress.mode) == 0) // In legacy mode, SuspenseList doesn't work so we just
        // use make it a noop by treating it as the default revealOrder.
        workInProgress.memoizedState = null;
        else switch(revealOrder){
            case "forwards":
                var tail, lastContentRow = function(firstChild) {
                    for(// This is going to find the last row among these children that is already
                    // showing content on the screen, as opposed to being in fallback state or
                    // new. If a row has multiple Suspense boundaries, any of them being in the
                    // fallback state, counts as the whole row being in a fallback state.
                    // Note that the "rows" will be workInProgress, but any nested children
                    // will still be current since we haven't rendered them yet. The mounted
                    // order may not be the same as the new order. We use the new order.
                    var row = firstChild, lastContentRow = null; null !== row;){
                        var currentRow = row.alternate; // New rows can't be content rows.
                        null !== currentRow && null === findFirstSuspended(currentRow) && (lastContentRow = row), row = row.sibling;
                    }
                    return lastContentRow;
                }(workInProgress.child);
                null === lastContentRow ? (// The whole list is part of the tail.
                // TODO: We could fast path by just rendering the tail now.
                tail = workInProgress.child, workInProgress.child = null) : (// Disconnect the tail rows after the content row.
                // We're going to render them separately later.
                tail = lastContentRow.sibling, lastContentRow.sibling = null), initSuspenseListRenderState(workInProgress, !1, tail, lastContentRow, tailMode, workInProgress.lastEffect);
                break;
            case "backwards":
                // We're going to find the first row that has existing content.
                // At the same time we're going to reverse the list of everything
                // we pass in the meantime. That's going to be our tail in reverse
                // order.
                var _tail = null, row = workInProgress.child;
                for(workInProgress.child = null; null !== row;){
                    var currentRow = row.alternate; // New rows can't be content rows.
                    if (null !== currentRow && null === findFirstSuspended(currentRow)) {
                        // This is the beginning of the main content.
                        workInProgress.child = row;
                        break;
                    }
                    var nextRow = row.sibling;
                    row.sibling = _tail, _tail = row, row = nextRow;
                } // TODO: If workInProgress.child is null, we can continue on the tail immediately.
                initSuspenseListRenderState(workInProgress, !0, _tail, null, tailMode, workInProgress.lastEffect);
                break;
            case "together":
                initSuspenseListRenderState(workInProgress, !1, null, null, void 0, workInProgress.lastEffect);
                break;
            default:
                // The default reveal order is the same as not having
                // a boundary.
                workInProgress.memoizedState = null;
        }
        return workInProgress.child;
    }
    var hasWarnedAboutUsingNoValuePropOnContextProvider = !1, hasWarnedAboutUsingContextAsConsumer = !1;
    function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
        return (null !== current && // Reuse previous dependencies
        (workInProgress.dependencies = current.dependencies), profilerStartTime = -1, function(lane) {
            workInProgressRootSkippedLanes |= lane;
        }(workInProgress.lanes), (renderLanes & workInProgress.childLanes) != 0) ? (!// This fiber doesn't have work, but its subtree does. Clone the child
        // fibers and continue.
        function(current, workInProgress) {
            if (!(null === current || workInProgress.child === current.child)) throw Error("Resuming work not yet implemented.");
            if (null !== workInProgress.child) {
                var currentChild = workInProgress.child, newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
                for(workInProgress.child = newChild, newChild.return = workInProgress; null !== currentChild.sibling;)currentChild = currentChild.sibling, (newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps)).return = workInProgress;
                newChild.sibling = null;
            }
        } // Reset a workInProgress child set to prepare it for a second pass.
        (current, workInProgress), workInProgress.child) : null;
    }
    function beginWork(current, workInProgress, renderLanes) {
        var updateLanes = workInProgress.lanes;
        if (workInProgress._debugNeedsRemount && null !== current) // This will restart the begin phase with a new fiber.
        return function(current, oldWorkInProgress, newWorkInProgress) {
            var returnFiber = oldWorkInProgress.return;
            if (null === returnFiber) throw Error("Cannot swap the root fiber.");
             // Disconnect from the old current.
            if (// It will get deleted.
            current.alternate = null, oldWorkInProgress.alternate = null, newWorkInProgress.index = oldWorkInProgress.index, newWorkInProgress.sibling = oldWorkInProgress.sibling, newWorkInProgress.return = oldWorkInProgress.return, newWorkInProgress.ref = oldWorkInProgress.ref, oldWorkInProgress === returnFiber.child) returnFiber.child = newWorkInProgress;
            else {
                var prevSibling = returnFiber.child;
                if (null === prevSibling) throw Error("Expected parent to have a child.");
                for(; prevSibling.sibling !== oldWorkInProgress;)if (null === (prevSibling = prevSibling.sibling)) throw Error("Expected to find the previous sibling.");
                prevSibling.sibling = newWorkInProgress;
            } // Delete the old fiber and place the new one.
            // Since the old fiber is disconnected, we have to schedule it manually.
            var last = returnFiber.lastEffect;
            return null !== last ? (last.nextEffect = current, returnFiber.lastEffect = current) : returnFiber.firstEffect = returnFiber.lastEffect = current, current.nextEffect = null, current.flags = 8, newWorkInProgress.flags |= 2, newWorkInProgress;
        }(current, workInProgress, createFiberFromTypeAndProps(workInProgress.type, workInProgress.key, workInProgress.pendingProps, workInProgress._debugOwner || null, workInProgress.mode, workInProgress.lanes));
        if (null !== current) {
            if (current.memoizedProps !== workInProgress.pendingProps || hasContextChanged() || // Force a re-render if the implementation changed due to hot reload:
            workInProgress.type !== current.type) // If props or context changed, mark the fiber as having performed work.
            // This may be unset if the props are determined to be equal later (memo).
            didReceiveUpdate = !0;
            else if ((renderLanes & updateLanes) != 0) // This is a special case that only exists for legacy mode.
            // See https://github.com/facebook/react/pull/19216.
            didReceiveUpdate = (16384 & current.flags) != 0;
            else {
                // the begin phase. There's still some bookkeeping we that needs to be done
                // in this optimized path, mostly pushing stuff onto the stack.
                switch(didReceiveUpdate = !1, workInProgress.tag){
                    case 3:
                        pushHostRootContext(workInProgress), resetHydrationState();
                        break;
                    case 5:
                        pushHostContext(workInProgress);
                        break;
                    case 1:
                        isContextProvider(workInProgress.type) && pushContextProvider(workInProgress);
                        break;
                    case 4:
                        pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
                        break;
                    case 10:
                        var newValue = workInProgress.memoizedProps.value;
                        pushProvider(workInProgress, newValue);
                        break;
                    case 12:
                        (renderLanes & workInProgress.childLanes) != 0 && (workInProgress.flags |= 4);
                        // These are reset during render to allow the DevTools commit hook a chance to read them,
                        var stateNode = workInProgress.stateNode;
                        stateNode.effectDuration = 0, stateNode.passiveEffectDuration = 0;
                        break;
                    case 13:
                        if (null !== workInProgress.memoizedState) {
                            if ((renderLanes & workInProgress.child.childLanes) != 0) // The primary children have pending work. Use the normal path
                            // to attempt to render the primary children again.
                            return updateSuspenseComponent(current, workInProgress, renderLanes);
                            // The primary child fragment does not have pending work marked
                            // on it
                            newContext1 = 1 & suspenseStackCursor.current, push(suspenseStackCursor, newContext1, workInProgress); // The primary children do not have pending work with sufficient
                            // priority. Bailout.
                            var newContext, newContext1, child = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
                            if (null !== child) // The fallback children have pending work. Skip over the
                            // primary children and work on the fallback.
                            return child.sibling;
                            return null;
                        }
                        newContext = 1 & suspenseStackCursor.current, push(suspenseStackCursor, newContext, workInProgress);
                        break;
                    case 19:
                        var newContext2, didSuspendBefore = (64 & current.flags) != 0, _hasChildWork = (renderLanes & workInProgress.childLanes) != 0;
                        if (didSuspendBefore) {
                            if (_hasChildWork) // If something was in fallback state last time, and we have all the
                            // same children then we're still in progressive loading state.
                            // Something might get unblocked by state updates or retries in the
                            // tree which will affect the tail. So we need to use the normal
                            // path to compute the correct tail.
                            return updateSuspenseListComponent(current, workInProgress, renderLanes);
                             // If none of the children had any work, that means that none of
                            // them got retried so they'll still be blocked in the same way
                            // as before. We can fast bail out.
                            workInProgress.flags |= 64;
                        } // If nothing suspended before and we're rendering the same children,
                        // then the tail doesn't matter. Anything new that suspends will work
                        // in the "together" mode, so we can continue from the state we had.
                        var renderState = workInProgress.memoizedState;
                        if (null !== renderState && (// Reset to the "together" mode in case we've started a different
                        // update in the past but didn't complete it.
                        renderState.rendering = null, renderState.tail = null, renderState.lastEffect = null), newContext2 = suspenseStackCursor.current, push(suspenseStackCursor, newContext2, workInProgress), !_hasChildWork) // If none of the children had any work, that means that none of
                        // them got retried so they'll still be blocked in the same way
                        // as before. We can fast bail out.
                        return null;
                        break;
                    case 23:
                    case 24:
                        return(// Need to check if the tree still needs to be deferred. This is
                        // almost identical to the logic used in the normal update path,
                        // so we'll just enter that. The only difference is we'll bail out
                        // at the next level instead of this one, because the child props
                        // have not changed. Which is fine.
                        // TODO: Probably should refactor `beginWork` to split the bailout
                        // path from the normal path. I'm tempted to do a labeled break here
                        // but I won't :)
                        workInProgress.lanes = 0, updateOffscreenComponent(current, workInProgress, renderLanes));
                }
                return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
            }
        } else didReceiveUpdate = !1;
         // Before entering the begin phase, clear pending update priority.
        switch(// TODO: This assumes that we're about to evaluate the component and process
        // the update queue. However, there's an exception: SimpleMemoComponent
        // sometimes bails out later in the begin phase. This indicates that we should
        // move this assignment out of the common path and into each branch.
        workInProgress.lanes = 0, workInProgress.tag){
            case 2:
                return function(_current, workInProgress, Component, renderLanes) {
                    null !== _current && (// An indeterminate component only mounts if it suspended inside a non-
                    // concurrent tree, in an inconsistent state. We want to treat it like
                    // a new mount, even though an empty version of it already committed.
                    // Disconnect the alternate pointers.
                    _current.alternate = null, workInProgress.alternate = null, workInProgress.flags |= 2);
                    var context, value, props = workInProgress.pendingProps, unmaskedContext = getUnmaskedContext(workInProgress, Component, !1);
                    if (context = getMaskedContext(workInProgress, unmaskedContext), prepareToReadContext(workInProgress, renderLanes), Component.prototype && "function" == typeof Component.prototype.render) {
                        var componentName = getComponentName(Component) || "Unknown";
                        didWarnAboutBadClass[componentName] || (error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName), didWarnAboutBadClass[componentName] = !0);
                    }
                    // Support for module components is deprecated and is removed behind a flag.
                    // Whether or not it would crash later, we want to show a good message in DEV first.
                    if (1 & workInProgress.mode && ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress, null), isRendering = !0, ReactCurrentOwner$1.current = workInProgress, value = renderWithHooks(null, workInProgress, Component, props, context, renderLanes), isRendering = !1, workInProgress.flags |= 1, "object" == typeof value && null !== value && "function" == typeof value.render && void 0 === value.$$typeof) {
                        var _componentName = getComponentName(Component) || "Unknown";
                        didWarnAboutModulePatternComponent[_componentName] || (error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName), didWarnAboutModulePatternComponent[_componentName] = !0);
                    }
                    if (// Run these checks in production only if the flag is off.
                    // Eventually we'll delete this branch altogether.
                    "object" == typeof value && null !== value && "function" == typeof value.render && void 0 === value.$$typeof) {
                        var _componentName2 = getComponentName(Component) || "Unknown";
                        didWarnAboutModulePatternComponent[_componentName2] || (error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2), didWarnAboutModulePatternComponent[_componentName2] = !0), workInProgress.tag = 1, workInProgress.memoizedState = null, workInProgress.updateQueue = null;
                        // During mounting we don't know the child context yet as the instance doesn't exist.
                        // We will invalidate the child context in finishClassComponent() right after rendering.
                        var hasContext = !1;
                        isContextProvider(Component) ? (hasContext = !0, pushContextProvider(workInProgress)) : hasContext = !1, workInProgress.memoizedState = null !== value.state && void 0 !== value.state ? value.state : null, initializeUpdateQueue(workInProgress);
                        var getDerivedStateFromProps = Component.getDerivedStateFromProps;
                        return "function" == typeof getDerivedStateFromProps && applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, props), adoptClassInstance(workInProgress, value), mountClassInstance(workInProgress, Component, props, renderLanes), finishClassComponent(null, workInProgress, Component, !0, hasContext, renderLanes);
                    }
                    if (// Proceed under the assumption that this is a function component
                    workInProgress.tag = 0, 1 & workInProgress.mode) {
                        disableLogs();
                        try {
                            value = renderWithHooks(null, workInProgress, Component, props, context, renderLanes);
                        } finally{
                            reenableLogs();
                        }
                    }
                    return reconcileChildren(null, workInProgress, value, renderLanes), validateFunctionComponentInDev(workInProgress, Component), workInProgress.child;
                }(current, workInProgress, workInProgress.type, renderLanes);
            case 16:
                var elementType = workInProgress.elementType;
                return function(_current, workInProgress, elementType, updateLanes, renderLanes) {
                    null !== _current && (// A lazy component only mounts if it suspended inside a non-
                    // concurrent tree, in an inconsistent state. We want to treat it like
                    // a new mount, even though an empty version of it already committed.
                    // Disconnect the alternate pointers.
                    _current.alternate = null, workInProgress.alternate = null, workInProgress.flags |= 2);
                    var child, props = workInProgress.pendingProps, payload = elementType._payload, Component = (0, elementType._init)(payload);
                    workInProgress.type = Component;
                    var resolvedTag = workInProgress.tag = function(Component) {
                        if ("function" == typeof Component) return shouldConstruct$1(Component) ? 1 : 0;
                        if (null != Component) {
                            var $$typeof = Component.$$typeof;
                            if ($$typeof === REACT_FORWARD_REF_TYPE) return 11;
                            if ($$typeof === REACT_MEMO_TYPE) return 14;
                        }
                        return 2;
                    } // This is used to create an alternate fiber to do work on.
                    (Component), resolvedProps = resolveDefaultProps(Component, props);
                    switch(resolvedTag){
                        case 0:
                            return validateFunctionComponentInDev(workInProgress, Component), workInProgress.type = Component = resolveFunctionForHotReloading(Component), updateFunctionComponent(null, workInProgress, Component, resolvedProps, renderLanes);
                        case 1:
                            return workInProgress.type = Component = resolveFunctionForHotReloading(Component), updateClassComponent(null, workInProgress, Component, resolvedProps, renderLanes);
                        case 11:
                            return workInProgress.type = Component = resolveForwardRefForHotReloading(Component), updateForwardRef(null, workInProgress, Component, resolvedProps, renderLanes);
                        case 14:
                            if (workInProgress.type !== workInProgress.elementType) {
                                var outerPropTypes = Component.propTypes;
                                outerPropTypes && checkPropTypes(outerPropTypes, resolvedProps, "prop", getComponentName(Component));
                            }
                            return updateMemoComponent(null, workInProgress, Component, resolveDefaultProps(Component.type, resolvedProps), updateLanes, renderLanes);
                    }
                    var hint = "";
                    throw null !== Component && "object" == typeof Component && Component.$$typeof === REACT_LAZY_TYPE && (hint = " Did you wrap a component in React.lazy() more than once?"), Error("Element type is invalid. Received a promise that resolves to: " + Component + ". Lazy element type must resolve to a class or function." + hint);
                }(current, workInProgress, elementType, updateLanes, renderLanes);
            case 0:
                var _Component = workInProgress.type, unresolvedProps = workInProgress.pendingProps, resolvedProps = workInProgress.elementType === _Component ? unresolvedProps : resolveDefaultProps(_Component, unresolvedProps);
                return updateFunctionComponent(current, workInProgress, _Component, resolvedProps, renderLanes);
            case 1:
                var _Component2 = workInProgress.type, _unresolvedProps = workInProgress.pendingProps, _resolvedProps = workInProgress.elementType === _Component2 ? _unresolvedProps : resolveDefaultProps(_Component2, _unresolvedProps);
                return updateClassComponent(current, workInProgress, _Component2, _resolvedProps, renderLanes);
            case 3:
                return function(current, workInProgress, renderLanes) {
                    pushHostRootContext(workInProgress);
                    var updateQueue = workInProgress.updateQueue;
                    if (!(null !== current && null !== updateQueue)) throw Error("If the root does not have an updateQueue, we should have already bailed out. This error is likely caused by a bug in React. Please file an issue.");
                    var nextProps = workInProgress.pendingProps, prevState = workInProgress.memoizedState, prevChildren = null !== prevState ? prevState.element : null;
                    cloneUpdateQueue(current, workInProgress), processUpdateQueue(workInProgress, nextProps, null, renderLanes);
                    // being called "element".
                    var nextChildren = workInProgress.memoizedState.element;
                    if (nextChildren === prevChildren) return resetHydrationState(), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
                    var root = workInProgress.stateNode;
                    if (root.hydrate && (nextHydratableInstance = getFirstHydratableChild(workInProgress.stateNode.containerInfo), hydrationParentFiber = workInProgress, isHydrating = !0, 1)) {
                        var mutableSourceEagerHydrationData = root.mutableSourceEagerHydrationData;
                        if (null != mutableSourceEagerHydrationData) for(var i = 0; i < mutableSourceEagerHydrationData.length; i += 2)setWorkInProgressVersion(mutableSourceEagerHydrationData[i], mutableSourceEagerHydrationData[i + 1]);
                        var child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
                        workInProgress.child = child;
                        for(var node = child; node;)// Mark each child as hydrating. This is a fast path to know whether this
                        // tree is part of a hydrating tree. This is used to determine if a child
                        // node has fully mounted yet, and for scheduling event replaying.
                        // Conceptually this is similar to Placement in that a new subtree is
                        // inserted into the React tree here. It just happens to not need DOM
                        // mutations because it already exists.
                        node.flags = -3 & node.flags | /*                    */ 1024, node = node.sibling;
                    } else // Otherwise reset hydration state in case we aborted and resumed another
                    // root.
                    reconcileChildren(current, workInProgress, nextChildren, renderLanes), resetHydrationState();
                    return workInProgress.child;
                }(current, workInProgress, renderLanes);
            case 5:
                return pushHostContext(workInProgress), null === current && tryToClaimNextHydratableInstance(workInProgress), type1 = workInProgress.type, nextProps = workInProgress.pendingProps, prevProps = null !== current ? current.memoizedProps : null, nextChildren = nextProps.children, shouldSetTextContent(type1, nextProps) ? // We special case a direct text child of a host node. This is a common
                // case. We won't handle it as a reified child. We will instead handle
                // this in the host environment that also has access to this prop. That
                // avoids allocating another HostText fiber and traversing it.
                nextChildren = null : null !== prevProps && shouldSetTextContent(type1, prevProps) && // If we're switching from a direct text child to a normal child, or to
                // empty, we need to schedule the text content to be reset.
                (workInProgress.flags |= /*                 */ 16), markRef(current, workInProgress), reconcileChildren(current, workInProgress, nextChildren, renderLanes), workInProgress.child;
            case 6:
                return null === current && tryToClaimNextHydratableInstance(workInProgress), null;
            case 13:
                return updateSuspenseComponent(current, workInProgress, renderLanes);
            case 4:
                return pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo), nextChildren1 = workInProgress.pendingProps, null === current ? // Portals are special because we don't append the children during mount
                // but at commit. Therefore we need to track insertions which the normal
                // flow doesn't do during mount. This doesn't happen at the root because
                // the root always starts with a "current" with a null child.
                // TODO: Consider unifying this with how the root works.
                workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren1, renderLanes) : reconcileChildren(current, workInProgress, nextChildren1, renderLanes), workInProgress.child;
            case 11:
                var type = workInProgress.type, _unresolvedProps2 = workInProgress.pendingProps, _resolvedProps2 = workInProgress.elementType === type ? _unresolvedProps2 : resolveDefaultProps(type, _unresolvedProps2);
                return updateForwardRef(current, workInProgress, type, _resolvedProps2, renderLanes);
            case 7:
                return nextChildren2 = workInProgress.pendingProps, reconcileChildren(current, workInProgress, nextChildren2, renderLanes), workInProgress.child;
            case 8:
                return nextChildren3 = workInProgress.pendingProps.children, reconcileChildren(current, workInProgress, nextChildren3, renderLanes), workInProgress.child;
            case 12:
                return workInProgress.flags |= 4, (stateNode1 = workInProgress.stateNode).effectDuration = 0, stateNode1.passiveEffectDuration = 0, nextChildren4 = workInProgress.pendingProps.children, reconcileChildren(current, workInProgress, nextChildren4, renderLanes), workInProgress.child;
            case 10:
                return function(current, workInProgress, renderLanes) {
                    var context = workInProgress.type._context, newProps = workInProgress.pendingProps, oldProps = workInProgress.memoizedProps, newValue = newProps.value;
                    "value" in newProps || hasWarnedAboutUsingNoValuePropOnContextProvider || (hasWarnedAboutUsingNoValuePropOnContextProvider = !0, error("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
                    var providerPropTypes = workInProgress.type.propTypes;
                    if (providerPropTypes && checkPropTypes(providerPropTypes, newProps, "prop", "Context.Provider"), pushProvider(workInProgress, newValue), null !== oldProps) {
                        var changedBits = function(context, newValue, oldValue) {
                            if (objectIs(oldValue, newValue)) // No change
                            return 0;
                            var changedBits = "function" == typeof context._calculateChangedBits ? context._calculateChangedBits(oldValue, newValue) : 1073741823;
                            return (1073741823 & changedBits) !== changedBits && error("calculateChangedBits: Expected the return value to be a 31-bit integer. Instead received: %s", changedBits), 0 | changedBits;
                        }(context, newValue, oldProps.value);
                        if (0 === changedBits) // No change. Bailout early if children are the same.
                        {
                            if (oldProps.children === newProps.children && !hasContextChanged()) return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
                        } else // The context value changed. Search for matching consumers and schedule
                        // them to update.
                        !function(workInProgress, context, changedBits, renderLanes) {
                            var fiber = workInProgress.child;
                            for(null !== fiber && // Set the return pointer of the child to the work-in-progress fiber.
                            (fiber.return = workInProgress); null !== fiber;){
                                var nextFiber = void 0, list = fiber.dependencies; // Visit this fiber.
                                if (null !== list) {
                                    nextFiber = fiber.child;
                                    for(var dependency = list.firstContext; null !== dependency;){
                                        // Check if the context matches.
                                        if (dependency.context === context && (dependency.observedBits & changedBits) != 0) {
                                            // Match! Schedule an update on this fiber.
                                            if (1 === fiber.tag) {
                                                // Schedule a force update on the work-in-progress.
                                                var update = createUpdate(-1, pickArbitraryLane(renderLanes));
                                                update.tag = 2, // update to the current fiber, too, which means it will persist even if
                                                // this render is thrown away. Since it's a race condition, not sure it's
                                                // worth fixing.
                                                enqueueUpdate(fiber, update);
                                            }
                                            fiber.lanes = fiber.lanes | renderLanes;
                                            var alternate = fiber.alternate;
                                            null !== alternate && (alternate.lanes = alternate.lanes | renderLanes), scheduleWorkOnParentPath(fiber.return, renderLanes), list.lanes = list.lanes | renderLanes;
                                            break;
                                        }
                                        dependency = dependency.next;
                                    }
                                } else // Don't scan deeper if this is a matching provider
                                nextFiber = 10 === fiber.tag && fiber.type === workInProgress.type ? null : fiber.child;
                                if (null !== nextFiber) // Set the return pointer of the child to the work-in-progress fiber.
                                nextFiber.return = fiber;
                                else for(// No child. Traverse to next sibling.
                                nextFiber = fiber; null !== nextFiber;){
                                    if (nextFiber === workInProgress) {
                                        // We're back to the root of this subtree. Exit.
                                        nextFiber = null;
                                        break;
                                    }
                                    var sibling = nextFiber.sibling;
                                    if (null !== sibling) {
                                        // Set the return pointer of the sibling to the work-in-progress fiber.
                                        sibling.return = nextFiber.return, nextFiber = sibling;
                                        break;
                                    } // No more siblings. Traverse up.
                                    nextFiber = nextFiber.return;
                                }
                                fiber = nextFiber;
                            }
                        }(workInProgress, context, changedBits, renderLanes);
                    }
                    return reconcileChildren(current, workInProgress, newProps.children, renderLanes), workInProgress.child;
                }(current, workInProgress, renderLanes);
            case 9:
                return current1 = current, workInProgress1 = workInProgress, renderLanes1 = renderLanes, void 0 === (context = workInProgress1.type)._context ? context === context.Consumer || hasWarnedAboutUsingContextAsConsumer || (hasWarnedAboutUsingContextAsConsumer = !0, error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")) : context = context._context, "function" != typeof (render = (newProps = workInProgress1.pendingProps).children) && error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), prepareToReadContext(workInProgress1, renderLanes1), newValue1 = readContext(context, newProps.unstable_observedBits), ReactCurrentOwner$1.current = workInProgress1, isRendering = !0, newChildren = render(newValue1), isRendering = !1, workInProgress1.flags |= 1, reconcileChildren(current1, workInProgress1, newChildren, renderLanes1), workInProgress1.child;
            case 14:
                var _type2 = workInProgress.type, _resolvedProps3 = resolveDefaultProps(_type2, workInProgress.pendingProps);
                if (workInProgress.type !== workInProgress.elementType) {
                    var outerPropTypes = _type2.propTypes;
                    outerPropTypes && checkPropTypes(outerPropTypes, _resolvedProps3, "prop", getComponentName(_type2));
                }
                return _resolvedProps3 = resolveDefaultProps(_type2.type, _resolvedProps3), updateMemoComponent(current, workInProgress, _type2, _resolvedProps3, updateLanes, renderLanes);
            case 15:
                return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, updateLanes, renderLanes);
            case 17:
                var current1, workInProgress1, renderLanes1, newChildren, context, newProps, render, newValue1, type1, nextProps, prevProps, nextChildren, nextChildren1, nextChildren2, nextChildren3, stateNode1, nextChildren4, hasContext, _Component3 = workInProgress.type, _unresolvedProps4 = workInProgress.pendingProps, _resolvedProps4 = workInProgress.elementType === _Component3 ? _unresolvedProps4 : resolveDefaultProps(_Component3, _unresolvedProps4);
                return null !== current && (// An incomplete component only mounts if it suspended inside a non-
                // concurrent tree, in an inconsistent state. We want to treat it like
                // a new mount, even though an empty version of it already committed.
                // Disconnect the alternate pointers.
                current.alternate = null, workInProgress.alternate = null, workInProgress.flags |= 2), workInProgress.tag = 1, isContextProvider(_Component3) ? (hasContext = !0, pushContextProvider(workInProgress)) : hasContext = !1, prepareToReadContext(workInProgress, renderLanes), constructClassInstance(workInProgress, _Component3, _resolvedProps4), mountClassInstance(workInProgress, _Component3, _resolvedProps4, renderLanes), finishClassComponent(null, workInProgress, _Component3, !0, hasContext, renderLanes);
            case 19:
                return updateSuspenseListComponent(current, workInProgress, renderLanes);
            case 20:
            case 21:
            case 22:
                break;
            case 23:
            case 24:
                return updateOffscreenComponent(current, workInProgress, renderLanes);
        }
        throw Error("Unknown unit of work tag (" + workInProgress.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function markUpdate(workInProgress) {
        // Tag the fiber with an update effect. This turns a Placement into
        // a PlacementAndUpdate.
        workInProgress.flags |= 4;
    }
    function markRef$1(workInProgress) {
        workInProgress.flags |= 128;
    }
    function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
        if (!isHydrating) switch(renderState.tailMode){
            case "hidden":
                for(// Any insertions at the end of the tail list after this point
                // should be invisible. If there are already mounted boundaries
                // anything before them are not considered for collapsing.
                // Therefore we need to go through the whole tail to find if
                // there are any.
                var tailNode = renderState.tail, lastTailNode = null; null !== tailNode;)null !== tailNode.alternate && (lastTailNode = tailNode), tailNode = tailNode.sibling;
                 // Next we're simply going to delete all insertions after the
                // last rendered item.
                null === lastTailNode ? // All remaining items in the tail are insertions.
                renderState.tail = null : // Detach the insertion after the last node that was already
                // inserted.
                lastTailNode.sibling = null;
                break;
            case "collapsed":
                for(// Any insertions at the end of the tail list after this point
                // should be invisible. If there are already mounted boundaries
                // anything before them are not considered for collapsing.
                // Therefore we need to go through the whole tail to find if
                // there are any.
                var _tailNode = renderState.tail, _lastTailNode = null; null !== _tailNode;)null !== _tailNode.alternate && (_lastTailNode = _tailNode), _tailNode = _tailNode.sibling;
                 // Next we're simply going to delete all insertions after the
                // last rendered item.
                null === _lastTailNode ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : // We suspended during the head. We want to show at least one
                // row at the tail. So we'll keep on and cut off the rest.
                renderState.tail.sibling = null : // Detach the insertion after the last node that was already
                // inserted.
                _lastTailNode.sibling = null;
        }
    }
    function completeWork(current, workInProgress, renderLanes) {
        var newProps = workInProgress.pendingProps;
        switch(workInProgress.tag){
            case 2:
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14:
                return null;
            case 1:
            case 17:
                return isContextProvider(workInProgress.type) && popContext(workInProgress), null;
            case 3:
                popHostContainer(workInProgress), popTopLevelContextObject(workInProgress), resetWorkInProgressVersions();
                var fiberRoot = workInProgress.stateNode;
                return fiberRoot.pendingContext && (fiberRoot.context = fiberRoot.pendingContext, fiberRoot.pendingContext = null), null !== current && null !== current.child || (popHydrationState(workInProgress) ? // If we hydrated, then we'll need to schedule an update for
                // the commit side-effects on the root.
                markUpdate(workInProgress) : fiberRoot.hydrate || // Schedule an effect to clear this container at the start of the next commit.
                // This handles the case of React rendering into a container with previous children.
                // It's also safe to do for updates too, because current.child would only be null
                // if the previous render was null (so the the container would already be empty).
                (workInProgress.flags |= 256)), updateHostContainer(workInProgress), null;
            case 5:
                popHostContext(workInProgress);
                var rootContainerInstance = getRootHostContainer(), type = workInProgress.type;
                if (null !== current && null != workInProgress.stateNode) updateHostComponent$1(current, workInProgress, type, newProps, rootContainerInstance), current.ref !== workInProgress.ref && markRef$1(workInProgress);
                else {
                    if (!newProps) {
                        if (!(null !== workInProgress.stateNode)) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
                         // This can happen when we abort work.
                        return null;
                    }
                    var currentHostContext = getHostContext(); // TODO: Move createInstance to beginWork and keep it on a context
                    if (popHydrationState(workInProgress)) {
                        // TODO: Move this and createInstance step into the beginPhase
                        // to consolidate.
                        if (instance = workInProgress.stateNode, type1 = workInProgress.type, props = workInProgress.memoizedProps, rootContainerInstance1 = 0, hostContext = currentHostContext, hostInst = workInProgress, instance[internalInstanceKey] = hostInst, node = instance, props1 = props, node[internalPropsKey] = props1, updatePayload = function(domElement, tag, rawProps, parentNamespace, rootContainerElement) {
                            switch(suppressHydrationWarning = !0 === rawProps[SUPPRESS_HYDRATION_WARNING], isCustomComponentTag = isCustomComponent(tag, rawProps), validatePropertiesInDevelopment(tag, rawProps), tag){
                                case "dialog":
                                    listenToNonDelegatedEvent("cancel", domElement), listenToNonDelegatedEvent("close", domElement);
                                    break;
                                case "iframe":
                                case "object":
                                case "embed":
                                    // We listen to this event in case to ensure emulated bubble
                                    // listeners still fire for the load event.
                                    listenToNonDelegatedEvent("load", domElement);
                                    break;
                                case "video":
                                case "audio":
                                    // We listen to these events in case to ensure emulated bubble
                                    // listeners still fire for all the media events.
                                    for(var isCustomComponentTag, extraAttributeNames, i = 0; i < mediaEventTypes.length; i++)listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
                                    break;
                                case "source":
                                    // We listen to this event in case to ensure emulated bubble
                                    // listeners still fire for the error event.
                                    listenToNonDelegatedEvent("error", domElement);
                                    break;
                                case "img":
                                case "image":
                                case "link":
                                    // We listen to these events in case to ensure emulated bubble
                                    // listeners still fire for error and load events.
                                    listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
                                    break;
                                case "details":
                                    // We listen to this event in case to ensure emulated bubble
                                    // listeners still fire for the toggle event.
                                    listenToNonDelegatedEvent("toggle", domElement);
                                    break;
                                case "input":
                                    initWrapperState(domElement, rawProps), // listeners still fire for the invalid event.
                                    listenToNonDelegatedEvent("invalid", domElement);
                                    break;
                                case "option":
                                    validateProps(domElement, rawProps);
                                    break;
                                case "select":
                                    initWrapperState$1(domElement, rawProps), // listeners still fire for the invalid event.
                                    listenToNonDelegatedEvent("invalid", domElement);
                                    break;
                                case "textarea":
                                    initWrapperState$2(domElement, rawProps), // listeners still fire for the invalid event.
                                    listenToNonDelegatedEvent("invalid", domElement);
                            }
                            assertValidProps(tag, rawProps), extraAttributeNames = new Set();
                            for(var attributes = domElement.attributes, _i = 0; _i < attributes.length; _i++)switch(attributes[_i].name.toLowerCase()){
                                // Built-in SSR attribute is allowed
                                case "data-reactroot":
                                // Controlled attributes are not validated
                                // TODO: Only ignore them on controlled tags.
                                case "value":
                                case "checked":
                                case "selected":
                                    break;
                                default:
                                    // Intentionally use the original name.
                                    // See discussion in https://github.com/facebook/react/pull/10676.
                                    extraAttributeNames.add(attributes[_i].name);
                            }
                            var updatePayload = null;
                            for(var propKey in rawProps)if (rawProps.hasOwnProperty(propKey)) {
                                var nextProp = rawProps[propKey];
                                if (propKey === CHILDREN) // For text content children we compare against textContent. This
                                // might match additional HTML that is hidden when we read it using
                                // textContent. E.g. "foo" will match "f<span>oo</span>" but that still
                                // satisfies our requirement. Our requirement is not to produce perfect
                                // HTML and attributes. Ideally we should preserve structure but it's
                                // ok not to if the visible content is still enough to indicate what
                                // even listeners these nodes might be wired up to.
                                // TODO: Warn if there is more than a single textNode as a child.
                                // TODO: Should we use domElement.firstChild.nodeValue to compare?
                                "string" == typeof nextProp ? domElement.textContent !== nextProp && (suppressHydrationWarning || warnForTextDifference(domElement.textContent, nextProp), updatePayload = [
                                    CHILDREN,
                                    nextProp
                                ]) : "number" == typeof nextProp && domElement.textContent !== "" + nextProp && (suppressHydrationWarning || warnForTextDifference(domElement.textContent, nextProp), updatePayload = [
                                    CHILDREN,
                                    "" + nextProp
                                ]);
                                else if (registrationNameDependencies.hasOwnProperty(propKey)) null != nextProp && ("function" != typeof nextProp && warnForInvalidEventListener(propKey, nextProp), "onScroll" === propKey && listenToNonDelegatedEvent("scroll", domElement));
                                else if (// Convince Flow we've calculated it (it's DEV-only in this method.)
                                "boolean" == typeof isCustomComponentTag) {
                                    // Validate that the properties correspond to their expected values.
                                    var serverValue = void 0, propertyInfo = getPropertyInfo(propKey);
                                    if (suppressHydrationWarning) ;
                                    else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING || // Controlled attributes are not validated
                                    // TODO: Only ignore them on controlled tags.
                                    "value" === propKey || "checked" === propKey || "selected" === propKey) ;
                                    else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
                                        var serverHTML = domElement.innerHTML, nextHtml = nextProp ? nextProp[HTML$1] : void 0;
                                        if (null != nextHtml) {
                                            var expectedHTML = normalizeHTML(domElement, nextHtml);
                                            expectedHTML !== serverHTML && warnForPropDifference(propKey, serverHTML, expectedHTML);
                                        }
                                    } else if (propKey === STYLE) {
                                        if (// $FlowFixMe - Should be inferred as not undefined.
                                        extraAttributeNames.delete(propKey), canDiffStyleForHydrationWarning) {
                                            var expectedStyle = /**
   * Operations for dealing with CSS properties.
   */ /**
   * This creates a string that is expected to be equivalent to the style
   * attribute generated by server-side rendering. It by-passes warnings and
   * security checks so it's not safe to use this value for anything other than
   * comparison. It is only used in DEV for SSR validation.
   */ function(styles) {
                                                var serialized = "", delimiter = "";
                                                for(var styleName in styles)if (styles.hasOwnProperty(styleName)) {
                                                    var styleValue = styles[styleName];
                                                    if (null != styleValue) {
                                                        var isCustomProperty = 0 === styleName.indexOf("--");
                                                        serialized += delimiter + (isCustomProperty ? styleName : styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")) + ":", serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty), delimiter = ";";
                                                    }
                                                }
                                                return serialized || null;
                                            }(nextProp);
                                            expectedStyle !== (serverValue = domElement.getAttribute("style")) && warnForPropDifference(propKey, serverValue, expectedStyle);
                                        }
                                    } else if (isCustomComponentTag) // $FlowFixMe - Should be inferred as not undefined.
                                    extraAttributeNames.delete(propKey.toLowerCase()), serverValue = getValueForAttribute(domElement, propKey, nextProp), nextProp !== serverValue && warnForPropDifference(propKey, serverValue, nextProp);
                                    else if (!shouldIgnoreAttribute(propKey, propertyInfo, isCustomComponentTag) && !shouldRemoveAttribute(propKey, nextProp, propertyInfo, isCustomComponentTag)) {
                                        var isMismatchDueToBadCasing = !1;
                                        if (null !== propertyInfo) // $FlowFixMe - Should be inferred as not undefined.
                                        extraAttributeNames.delete(propertyInfo.attributeName), serverValue = /**
   * Get the value for a property on a node. Only used in DEV for SSR validation.
   * The "expected" argument is used as a hint of what the expected value is.
   * Some properties have multiple equivalent values.
   */ function(node, name, expected, propertyInfo) {
                                            if (propertyInfo.mustUseProperty) return node[propertyInfo.propertyName];
                                            propertyInfo.sanitizeURL && // If we haven't fully disabled javascript: URLs, and if
                                            // the hydration is successful of a javascript: URL, we
                                            // still want to warn on the client.
                                            sanitizeURL("" + expected);
                                            var attributeName = propertyInfo.attributeName, stringValue = null;
                                            if (4 === propertyInfo.type) {
                                                if (node.hasAttribute(attributeName)) {
                                                    var value = node.getAttribute(attributeName);
                                                    return "" === value || (shouldRemoveAttribute(name, expected, propertyInfo, !1) ? value : value === "" + expected ? expected : value);
                                                }
                                            } else if (node.hasAttribute(attributeName)) {
                                                if (shouldRemoveAttribute(name, expected, propertyInfo, !1)) // We had an attribute but shouldn't have had one, so read it
                                                // for the error message.
                                                return node.getAttribute(attributeName);
                                                if (3 === propertyInfo.type) // If this was a boolean, it doesn't matter what the value is
                                                // the fact that we have it is the same as the expected.
                                                return expected;
                                                 // Even if this property uses a namespace we use getAttribute
                                                // because we assume its namespaced name is the same as our config.
                                                // To use getAttributeNS we need the local name which we don't have
                                                // in our config atm.
                                                stringValue = node.getAttribute(attributeName);
                                            }
                                            return shouldRemoveAttribute(name, expected, propertyInfo, !1) ? null === stringValue ? expected : stringValue : stringValue === "" + expected ? expected : stringValue;
                                        }(domElement, propKey, nextProp, propertyInfo);
                                        else {
                                            var ownNamespace = parentNamespace;
                                            if (ownNamespace === HTML_NAMESPACE && (ownNamespace = getIntrinsicNamespace(tag)), ownNamespace === HTML_NAMESPACE) // $FlowFixMe - Should be inferred as not undefined.
                                            extraAttributeNames.delete(propKey.toLowerCase());
                                            else {
                                                var standardName = function(propName) {
                                                    var lowerCasedName = propName.toLowerCase();
                                                    return possibleStandardNames.hasOwnProperty(lowerCasedName) && possibleStandardNames[lowerCasedName] || null;
                                                }(propKey);
                                                null !== standardName && standardName !== propKey && (// If an SVG prop is supplied with bad casing, it will
                                                // be successfully parsed from HTML, but will produce a mismatch
                                                // (and would be incorrectly rendered on the client).
                                                // However, we already warn about bad casing elsewhere.
                                                // So we'll skip the misleading extra mismatch warning in this case.
                                                isMismatchDueToBadCasing = !0, extraAttributeNames.delete(standardName)), extraAttributeNames.delete(propKey);
                                            }
                                            serverValue = getValueForAttribute(domElement, propKey, nextProp);
                                        }
                                        nextProp === serverValue || isMismatchDueToBadCasing || warnForPropDifference(propKey, serverValue, nextProp);
                                    }
                                }
                            }
                            switch(extraAttributeNames.size > 0 && !suppressHydrationWarning && // $FlowFixMe - Should be inferred as not undefined.
                            warnForExtraAttributes(extraAttributeNames), tag){
                                case "input":
                                    // TODO: Make sure we check if this is still unmounted or do any clean
                                    // up necessary since we never stop tracking anymore.
                                    track(domElement), postMountWrapper(domElement, rawProps, !0);
                                    break;
                                case "textarea":
                                    // TODO: Make sure we check if this is still unmounted or do any clean
                                    // up necessary since we never stop tracking anymore.
                                    track(domElement), postMountWrapper$3(domElement);
                                    break;
                                case "select":
                                case "option":
                                    break;
                                default:
                                    "function" == typeof rawProps.onClick && // TODO: This cast may not be sound for SVG, MathML or custom elements.
                                    trapClickOnNonInteractiveElement(domElement);
                            }
                            return updatePayload;
                        }(instance, type1, props, hostContext.namespace), workInProgress.updateQueue = updatePayload, null !== updatePayload) // If changes to the hydrated node need to be applied at the
                        // commit-phase we mark this as such.
                        markUpdate(workInProgress);
                    } else {
                        var instance, type1, props, rootContainerInstance1, hostContext, hostInst, node, props1, updatePayload, instance1 = function(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
                            if (validateDOMNesting(type, null, hostContext.ancestorInfo), "string" == typeof props.children || "number" == typeof props.children) {
                                var hostInst, node, props1, string = "" + props.children, ownAncestorInfo = updatedAncestorInfo(hostContext.ancestorInfo, type);
                                validateDOMNesting(null, string, ownAncestorInfo);
                            }
                            var domElement = function(type, props, rootContainerElement, parentNamespace) {
                                // tags get no namespace.
                                var isCustomComponentTag, domElement, ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement), namespaceURI = parentNamespace;
                                if (namespaceURI === HTML_NAMESPACE && (namespaceURI = getIntrinsicNamespace(type)), namespaceURI === HTML_NAMESPACE) {
                                    if ((isCustomComponentTag = isCustomComponent(type, props)) || type === type.toLowerCase() || error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type), "script" === type) {
                                        // Create the script via .innerHTML so its "parser-inserted" flag is
                                        // set to true and it does not execute
                                        var div = ownerDocument.createElement("div");
                                        div.innerHTML = "<script></script>"; // eslint-disable-line
                                        // This is guaranteed to yield a script element.
                                        var firstChild = div.firstChild;
                                        domElement = div.removeChild(firstChild);
                                    } else if ("string" == typeof props.is) // $FlowIssue `createElement` should be updated for Web Components
                                    domElement = ownerDocument.createElement(type, {
                                        is: props.is
                                    });
                                    else // attributes on `select`s needs to be added before `option`s are inserted.
                                    // This prevents:
                                    // - a bug where the `select` does not scroll to the correct option because singular
                                    //  `select` elements automatically pick the first item #13222
                                    // - a bug where the `select` set the first item as selected despite the `size` attribute #14239
                                    // See https://github.com/facebook/react/issues/13222
                                    // and https://github.com/facebook/react/issues/14239
                                    if (// Separate else branch instead of using `props.is || undefined` above because of a Firefox bug.
                                    // See discussion in https://github.com/facebook/react/pull/6896
                                    // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
                                    domElement = ownerDocument.createElement(type), "select" === type) {
                                        var node = domElement;
                                        props.multiple ? node.multiple = !0 : props.size && // Setting a size greater than 1 causes a select to behave like `multiple=true`, where
                                        // it is possible that no option is selected.
                                        //
                                        // This is only necessary when a select in "single selection mode".
                                        (node.size = props.size);
                                    }
                                } else domElement = ownerDocument.createElementNS(namespaceURI, type);
                                return namespaceURI !== HTML_NAMESPACE || isCustomComponentTag || "[object HTMLUnknownElement]" !== Object.prototype.toString.call(domElement) || Object.prototype.hasOwnProperty.call(warnedUnknownTags, type) || (warnedUnknownTags[type] = !0, error("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", type)), domElement;
                            }(type, props, rootContainerInstance, hostContext.namespace);
                            return hostInst = internalInstanceHandle, domElement[internalInstanceKey] = hostInst, node = domElement, props1 = props, node[internalPropsKey] = props1, domElement;
                        }(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
                        // (eg DOM renderer supports auto-focus for certain elements).
                        // Make sure such renderers get scheduled for later work.
                        appendAllChildren(instance1, workInProgress, !1, !1), workInProgress.stateNode = instance1, !function(domElement, tag, rawProps, rootContainerElement) {
                            var element, props, value, props1, isCustomComponentTag = isCustomComponent(tag, rawProps);
                            switch(validatePropertiesInDevelopment(tag, rawProps), tag){
                                case "dialog":
                                    listenToNonDelegatedEvent("cancel", domElement), listenToNonDelegatedEvent("close", domElement), props1 = rawProps;
                                    break;
                                case "iframe":
                                case "object":
                                case "embed":
                                    // We listen to this event in case to ensure emulated bubble
                                    // listeners still fire for the load event.
                                    listenToNonDelegatedEvent("load", domElement), props1 = rawProps;
                                    break;
                                case "video":
                                case "audio":
                                    // We listen to these events in case to ensure emulated bubble
                                    // listeners still fire for all the media events.
                                    for(var i = 0; i < mediaEventTypes.length; i++)listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
                                    props1 = rawProps;
                                    break;
                                case "source":
                                    // We listen to this event in case to ensure emulated bubble
                                    // listeners still fire for the error event.
                                    listenToNonDelegatedEvent("error", domElement), props1 = rawProps;
                                    break;
                                case "img":
                                case "image":
                                case "link":
                                    // We listen to these events in case to ensure emulated bubble
                                    // listeners still fire for error and load events.
                                    listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement), props1 = rawProps;
                                    break;
                                case "details":
                                    // We listen to this event in case to ensure emulated bubble
                                    // listeners still fire for the toggle event.
                                    listenToNonDelegatedEvent("toggle", domElement), props1 = rawProps;
                                    break;
                                case "input":
                                    initWrapperState(domElement, rawProps), props1 = getHostProps(domElement, rawProps), // listeners still fire for the invalid event.
                                    listenToNonDelegatedEvent("invalid", domElement);
                                    break;
                                case "option":
                                    validateProps(domElement, rawProps), props1 = getHostProps$1(domElement, rawProps);
                                    break;
                                case "select":
                                    initWrapperState$1(domElement, rawProps), props1 = getHostProps$2(domElement, rawProps), // listeners still fire for the invalid event.
                                    listenToNonDelegatedEvent("invalid", domElement);
                                    break;
                                case "textarea":
                                    initWrapperState$2(domElement, rawProps), props1 = getHostProps$3(domElement, rawProps), // listeners still fire for the invalid event.
                                    listenToNonDelegatedEvent("invalid", domElement);
                                    break;
                                default:
                                    props1 = rawProps;
                            }
                            switch(assertValidProps(tag, props1), function(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
                                for(var propKey in nextProps)if (nextProps.hasOwnProperty(propKey)) {
                                    var nextProp = nextProps[propKey];
                                    if (propKey === STYLE) nextProp && // Freeze the next style object so that we can assume it won't be
                                    // mutated. We have already warned for this in the past.
                                    Object.freeze(nextProp), setValueForStyles(domElement, nextProp);
                                    else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
                                        var nextHtml = nextProp ? nextProp[HTML$1] : void 0;
                                        null != nextHtml && setInnerHTML(domElement, nextHtml);
                                    } else propKey === CHILDREN ? "string" == typeof nextProp ? ("textarea" !== tag || "" !== nextProp) && setTextContent(domElement, nextProp) : "number" == typeof nextProp && setTextContent(domElement, "" + nextProp) : propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING || propKey === AUTOFOCUS || (registrationNameDependencies.hasOwnProperty(propKey) ? null != nextProp && ("function" != typeof nextProp && warnForInvalidEventListener(propKey, nextProp), "onScroll" === propKey && listenToNonDelegatedEvent("scroll", domElement)) : null != nextProp && setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag));
                                }
                            }(tag, domElement, 0, props1, isCustomComponentTag), tag){
                                case "input":
                                    // TODO: Make sure we check if this is still unmounted or do any clean
                                    // up necessary since we never stop tracking anymore.
                                    track(domElement), postMountWrapper(domElement, rawProps, !1);
                                    break;
                                case "textarea":
                                    // TODO: Make sure we check if this is still unmounted or do any clean
                                    // up necessary since we never stop tracking anymore.
                                    track(domElement), postMountWrapper$3(domElement);
                                    break;
                                case "option":
                                    element = domElement, null != (props = rawProps).value && element.setAttribute("value", "" + getToStringValue(props.value));
                                    break;
                                case "select":
                                    domElement.multiple = !!rawProps.multiple, null != (value = rawProps.value) ? updateOptions(domElement, !!rawProps.multiple, value, !1) : null != rawProps.defaultValue && updateOptions(domElement, !!rawProps.multiple, rawProps.defaultValue, !0);
                                    break;
                                default:
                                    "function" == typeof props1.onClick && // TODO: This cast may not be sound for SVG, MathML or custom elements.
                                    trapClickOnNonInteractiveElement(domElement);
                            }
                        } // Calculate the diff between the two objects.
                        (instance1, type, newProps, 0), shouldAutoFocusHostComponent(type, newProps) && markUpdate(workInProgress);
                    }
                    null !== workInProgress.ref && // If there is a ref on a host node we need to schedule a callback
                    markRef$1(workInProgress);
                }
                return null;
            case 6:
                if (current && null != workInProgress.stateNode) {
                    var oldText = current.memoizedProps; // If we have an alternate, that means this is an update and we need
                    // to schedule a side-effect to do the updates.
                    updateHostText$1(current, workInProgress, oldText, newProps);
                } else {
                    if ("string" != typeof newProps && !(null !== workInProgress.stateNode)) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
                    var hostInst1, textNode, _rootContainerInstance = getRootHostContainer(), _currentHostContext = getHostContext();
                    if (popHydrationState(workInProgress)) (function(fiber) {
                        var hostInst, textInstance = fiber.stateNode, textContent = fiber.memoizedProps, shouldUpdate = (hostInst = fiber, textInstance[internalInstanceKey] = hostInst, textInstance.nodeValue !== textContent);
                        if (shouldUpdate) {
                            // We assume that prepareToHydrateHostTextInstance is called in a context where the
                            // hydration parent is the parent host component of this host text.
                            var returnFiber = hydrationParentFiber;
                            if (null !== returnFiber) switch(returnFiber.tag){
                                case 3:
                                    returnFiber.stateNode.containerInfo, warnForUnmatchedText(textInstance, textContent);
                                    break;
                                case 5:
                                    returnFiber.type;
                                    var parentProps = returnFiber.memoizedProps;
                                    returnFiber.stateNode, !0 !== parentProps[SUPPRESS_HYDRATION_WARNING$1] && warnForUnmatchedText(textInstance, textContent);
                            }
                        }
                        return shouldUpdate;
                    })(workInProgress) && markUpdate(workInProgress);
                    else {
                        workInProgress.stateNode = (validateDOMNesting(null, newProps, _currentHostContext.ancestorInfo), hostInst1 = workInProgress, (textNode = getOwnerDocumentFromRootContainer(_rootContainerInstance).createTextNode(newProps))[internalInstanceKey] = hostInst1, textNode);
                    }
                }
                return null;
            case 13:
                pop(suspenseStackCursor, workInProgress);
                var nextState = workInProgress.memoizedState;
                if ((64 & workInProgress.flags) != 0) return(// Something suspended. Re-render with the fallback children.
                workInProgress.lanes = renderLanes, (8 & workInProgress.mode) != 0 && transferActualDuration(workInProgress), workInProgress);
                var nextDidTimeout = null !== nextState, prevDidTimeout = !1;
                return null === current ? void 0 !== workInProgress.memoizedProps.fallback && popHydrationState(workInProgress) : prevDidTimeout = null !== current.memoizedState, nextDidTimeout && !prevDidTimeout && (2 & workInProgress.mode) != 0 && (null === current && !0 !== workInProgress.memoizedProps.unstable_avoidThisFallback || (1 & suspenseStackCursor.current) != 0 ? 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3) : ((0 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus) && (workInProgressRootExitStatus = 4), null !== workInProgressRoot && (includesNonIdleWork(workInProgressRootSkippedLanes) || includesNonIdleWork(workInProgressRootUpdatedLanes)) && // Mark the current render as suspended so that we switch to working on
                // the updates that were skipped. Usually we only suspend at the end of
                // the render phase.
                // TODO: We should probably always mark the root as suspended immediately
                // (inside this function), since by suspending at the end of the render
                // phase introduces a potential mistake where we suspend lanes that were
                // pinged or updated while we were rendering.
                markRootSuspended$1(workInProgressRoot, workInProgressRootRenderLanes))), (nextDidTimeout || prevDidTimeout) && // If this boundary just timed out, schedule an effect to attach a
                // retry listener to the promise. This flag is also used to hide the
                // primary children. In mutation mode, we also need the flag to
                // *unhide* children that were previously hidden, so check if this
                // is currently timed out, too.
                (workInProgress.flags |= 4), null;
            case 4:
                return popHostContainer(workInProgress), updateHostContainer(workInProgress), null === current && listenToAllSupportedEvents(workInProgress.stateNode.containerInfo), null;
            case 10:
                return(// Pop provider fiber
                popProvider(workInProgress), null);
            case 19:
                pop(suspenseStackCursor, workInProgress);
                var renderState = workInProgress.memoizedState;
                if (null === renderState) // We're running in the default, "independent" mode.
                // We don't do anything in this mode.
                return null;
                var didSuspendAlready = (64 & workInProgress.flags) != 0, renderedTail = renderState.rendering;
                if (null === renderedTail) {
                    // We just rendered the head.
                    if (didSuspendAlready) cutOffTailIfNeeded(renderState, !1);
                    else {
                        if (!(0 === workInProgressRootExitStatus && (null === current || (64 & current.flags) == 0))) for(var row = workInProgress.child; null !== row;){
                            var suspended = findFirstSuspended(row);
                            if (null !== suspended) {
                                didSuspendAlready = !0, workInProgress.flags |= 64, cutOffTailIfNeeded(renderState, !1);
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
                                var newContext, newThennables = suspended.updateQueue;
                                return null !== newThennables && (workInProgress.updateQueue = newThennables, workInProgress.flags |= 4), null === renderState.lastEffect && (workInProgress.firstEffect = null), workInProgress.lastEffect = renderState.lastEffect, !function(workInProgress, lanes) {
                                    for(var child = workInProgress.child; null !== child;)(function(workInProgress, renderLanes) {
                                        // This resets the Fiber to what createFiber or createWorkInProgress would
                                        // have set the values to before during the first pass. Ideally this wouldn't
                                        // be necessary but unfortunately many code paths reads from the workInProgress
                                        // when they should be reading from current and writing to workInProgress.
                                        // We assume pendingProps, index, key, ref, return are still untouched to
                                        // avoid doing another reconciliation.
                                        // Reset the effect tag but keep any Placement tags, since that's something
                                        // that child fiber is setting, not the reconciliation.
                                        workInProgress.flags &= 2, workInProgress.nextEffect = null, workInProgress.firstEffect = null, workInProgress.lastEffect = null;
                                        var current = workInProgress.alternate;
                                        if (null === current) // Reset to createFiber's initial values.
                                        workInProgress.childLanes = 0, workInProgress.lanes = renderLanes, workInProgress.child = null, workInProgress.memoizedProps = null, workInProgress.memoizedState = null, workInProgress.updateQueue = null, workInProgress.dependencies = null, workInProgress.stateNode = null, // Note: We don't reset the actualTime counts. It's useful to accumulate
                                        // actual time across multiple render passes.
                                        workInProgress.selfBaseDuration = 0, workInProgress.treeBaseDuration = 0;
                                        else {
                                            // Reset to the cloned values that createWorkInProgress would've.
                                            workInProgress.childLanes = current.childLanes, workInProgress.lanes = current.lanes, workInProgress.child = current.child, workInProgress.memoizedProps = current.memoizedProps, workInProgress.memoizedState = current.memoizedState, workInProgress.updateQueue = current.updateQueue, workInProgress.type = current.type;
                                            // it cannot be shared with the current fiber.
                                            var currentDependencies = current.dependencies;
                                            workInProgress.dependencies = null === currentDependencies ? null : {
                                                lanes: currentDependencies.lanes,
                                                firstContext: currentDependencies.firstContext
                                            }, // Note: We don't reset the actualTime counts. It's useful to accumulate
                                            // actual time across multiple render passes.
                                            workInProgress.selfBaseDuration = current.selfBaseDuration, workInProgress.treeBaseDuration = current.treeBaseDuration;
                                        }
                                    })(child, lanes), child = child.sibling;
                                }(workInProgress, renderLanes), newContext = 1 & suspenseStackCursor.current | 2, push(suspenseStackCursor, newContext, workInProgress), workInProgress.child;
                            }
                            row = row.sibling;
                        }
                        null !== renderState.tail && now() > workInProgressRootRenderTargetTime && (// We have already passed our CPU deadline but we still have rows
                        // left in the tail. We'll just give up further attempts to render
                        // the main content and only render fallbacks.
                        workInProgress.flags |= 64, didSuspendAlready = !0, cutOffTailIfNeeded(renderState, !1), // to get it started back up to attempt the next item. While in terms
                        // of priority this work has the same priority as this current render,
                        // it's not part of the same transition once the transition has
                        // committed. If it's sync, we still want to yield so that it can be
                        // painted. Conceptually, this is really the same as pinging.
                        // We can use any RetryLane even if it's the one currently rendering
                        // since we're leaving it behind on this node.
                        workInProgress.lanes = 33554432, markSpawnedWork(33554432));
                    } // Next we're going to render the tail.
                } else {
                    // Append the rendered row to the child list.
                    if (!didSuspendAlready) {
                        var _suspended = findFirstSuspended(renderedTail);
                        if (null !== _suspended) {
                            workInProgress.flags |= 64, didSuspendAlready = !0;
                            // get lost if this row ends up dropped during a second pass.
                            var _newThennables = _suspended.updateQueue;
                            if (null !== _newThennables && (workInProgress.updateQueue = _newThennables, workInProgress.flags |= 4), cutOffTailIfNeeded(renderState, !0), null === renderState.tail && "hidden" === renderState.tailMode && !renderedTail.alternate && !isHydrating // We don't cut it if we're hydrating.
                            ) {
                                // We need to delete the row we just rendered.
                                // Reset the effect list to what it was before we rendered this
                                // child. The nested children have already appended themselves.
                                var lastEffect = workInProgress.lastEffect = renderState.lastEffect; // Remove any effects that were appended after this point.
                                return null !== lastEffect && (lastEffect.nextEffect = null), null;
                            }
                        } else 2 * // The time it took to render last row is greater than the remaining
                        // time we have to render. So rendering one more row would likely
                        // exceed it.
                        now() - renderState.renderingStartTime > workInProgressRootRenderTargetTime && 1073741824 !== renderLanes && (// We have now passed our CPU deadline and we'll just give up further
                        // attempts to render the main content and only render fallbacks.
                        // The assumption is that this is usually faster.
                        workInProgress.flags |= 64, didSuspendAlready = !0, cutOffTailIfNeeded(renderState, !1), // to get it started back up to attempt the next item. While in terms
                        // of priority this work has the same priority as this current render,
                        // it's not part of the same transition once the transition has
                        // committed. If it's sync, we still want to yield so that it can be
                        // painted. Conceptually, this is really the same as pinging.
                        // We can use any RetryLane even if it's the one currently rendering
                        // since we're leaving it behind on this node.
                        workInProgress.lanes = 33554432, markSpawnedWork(33554432));
                    }
                    if (renderState.isBackwards) // The effect list of the backwards tail will have been added
                    // to the end. This breaks the guarantee that life-cycles fire in
                    // sibling order but that isn't a strong guarantee promised by React.
                    // Especially since these might also just pop in during future commits.
                    // Append to the beginning of the list.
                    renderedTail.sibling = workInProgress.child, workInProgress.child = renderedTail;
                    else {
                        var previousSibling = renderState.last;
                        null !== previousSibling ? previousSibling.sibling = renderedTail : workInProgress.child = renderedTail, renderState.last = renderedTail;
                    }
                }
                if (null !== renderState.tail) {
                    // We still have tail rows to render.
                    // Pop a row.
                    var next = renderState.tail;
                    renderState.rendering = next, renderState.tail = next.sibling, renderState.lastEffect = workInProgress.lastEffect, renderState.renderingStartTime = now(), next.sibling = null;
                    // TODO: We can probably just avoid popping it instead and only
                    // setting it the first time we go from not suspended to suspended.
                    var suspenseContext = suspenseStackCursor.current;
                    return didSuspendAlready ? suspenseContext = 1 & suspenseContext | 2 : suspenseContext &= 1, push(suspenseStackCursor, suspenseContext, workInProgress), next;
                }
                return null;
            case 20:
            case 21:
            case 22:
                break;
            case 23:
            case 24:
                if (popRenderLanes(workInProgress), null !== current) {
                    var _nextState = workInProgress.memoizedState;
                    null !== current.memoizedState != (null !== _nextState) && "unstable-defer-without-hiding" !== newProps.mode && (workInProgress.flags |= 4);
                }
                return null;
        }
        throw Error("Unknown unit of work tag (" + workInProgress.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function unwindInterruptedWork(interruptedWork) {
        switch(interruptedWork.tag){
            case 1:
                null != interruptedWork.type.childContextTypes && popContext(interruptedWork);
                break;
            case 3:
                popHostContainer(interruptedWork), popTopLevelContextObject(interruptedWork), resetWorkInProgressVersions();
                break;
            case 5:
                popHostContext(interruptedWork);
                break;
            case 4:
                popHostContainer(interruptedWork);
                break;
            case 13:
            case 19:
                pop(suspenseStackCursor, interruptedWork);
                break;
            case 10:
                popProvider(interruptedWork);
                break;
            case 23:
            case 24:
                popRenderLanes(interruptedWork);
        }
    }
    function createCapturedValue(value, source) {
        // If the value is an error, call this function immediately after it is thrown
        // so the stack is accurate.
        return {
            value: value,
            source: source,
            stack: getStackByFiberInDevAndProd(source)
        };
    }
    function logCapturedError(boundary, errorInfo) {
        try {
            var errorBoundaryMessage, error = errorInfo.value, source = errorInfo.source, stack = errorInfo.stack;
            // `preventDefault()` in window `error` handler.
            // We record this information as an expando on the error.
            if (null != error && error._suppressLogging) {
                if (1 === boundary.tag) // The error is recoverable and was silenced.
                // Ignore it and don't print the stack addendum.
                // This is handy for testing error boundaries without noise.
                return;
                 // The error is fatal. Since the silencing might have
                // been accidental, we'll surface it anyway.
                // However, the browser would have silenced the original error
                // so we'll print it first, and then print the stack addendum.
                console.error(error); // Don't transform to our wrapper
            // For a more detailed description of this block, see:
            // https://github.com/facebook/react/pull/13384
            }
            var componentName = source ? getComponentName(source.type) : null, errorBoundaryName = getComponentName(boundary.type);
            errorBoundaryMessage = errorBoundaryName ? "React will try to recreate this component tree from scratch using the error boundary you provided, " + errorBoundaryName + "." : "Consider adding an error boundary to your tree to customize error handling behavior.\nVisit https://reactjs.org/link/error-boundaries to learn more about error boundaries.";
            // We don't include the original error message and JS stack because the browser
            // has already printed it. Even if the application swallows the error, it is still
            // displayed by the browser thanks to the DEV-only fake event trick in ReactErrorUtils.
            console.error((componentName ? "The above error occurred in the <" + componentName + "> component:" : "The above error occurred in one of your React components:") + "\n" + (null !== stack ? stack : "") + "\n\n" + errorBoundaryMessage); // Don't transform to our wrapper
        } catch (e) {
            // This method must not throw, or React internal state will get messed up.
            // If console.error is overridden, or logCapturedError() shows a dialog that throws,
            // we want to report this error outside of the normal stack as a last resort.
            // https://github.com/facebook/react/issues/13188
            setTimeout(function() {
                throw e;
            });
        }
    }
    // Mutation mode
    appendAllChildren = function(parent, workInProgress, needsVisibilityToggle, isHidden) {
        for(// We only have the top Fiber that was created but we need recurse down its
        // children to find all the terminal nodes.
        var node = workInProgress.child; null !== node;){
            if (5 === node.tag || 6 === node.tag) !function(parentInstance, child) {
                parentInstance.appendChild(child);
            }(parent, node.stateNode);
            else if (4 === node.tag) ;
            else if (null !== node.child) {
                node.child.return = node, node = node.child;
                continue;
            }
            if (node === workInProgress) return;
            for(; null === node.sibling;){
                if (null === node.return || node.return === workInProgress) return;
                node = node.return;
            }
            node.sibling.return = node.return, node = node.sibling;
        }
    }, updateHostContainer = function(workInProgress) {
    // Noop
    }, updateHostComponent$1 = function(current, workInProgress, type, newProps, rootContainerInstance) {
        // If we have an alternate, that means this is an update and we need to
        // schedule a side-effect to do the updates.
        var oldProps = current.memoizedProps;
        if (oldProps !== newProps) {
            // component is hitting the resume path. Figure out why. Possibly
            // related to `hidden`.
            var updatePayload = function(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
                if (typeof newProps.children != typeof oldProps.children && ("string" == typeof newProps.children || "number" == typeof newProps.children)) {
                    var string = "" + newProps.children, ownAncestorInfo = updatedAncestorInfo(hostContext.ancestorInfo, type);
                    validateDOMNesting(null, string, ownAncestorInfo);
                }
                return function(domElement, tag, lastRawProps, nextRawProps, rootContainerElement) {
                    validatePropertiesInDevelopment(tag, nextRawProps);
                    var lastProps, nextProps, propKey, styleName, updatePayload = null;
                    switch(tag){
                        case "input":
                            lastProps = getHostProps(domElement, lastRawProps), nextProps = getHostProps(domElement, nextRawProps), updatePayload = [];
                            break;
                        case "option":
                            lastProps = getHostProps$1(domElement, lastRawProps), nextProps = getHostProps$1(domElement, nextRawProps), updatePayload = [];
                            break;
                        case "select":
                            lastProps = getHostProps$2(domElement, lastRawProps), nextProps = getHostProps$2(domElement, nextRawProps), updatePayload = [];
                            break;
                        case "textarea":
                            lastProps = getHostProps$3(domElement, lastRawProps), nextProps = getHostProps$3(domElement, nextRawProps), updatePayload = [];
                            break;
                        default:
                            lastProps = lastRawProps, nextProps = nextRawProps, "function" != typeof lastProps.onClick && "function" == typeof nextProps.onClick && // TODO: This cast may not be sound for SVG, MathML or custom elements.
                            trapClickOnNonInteractiveElement(domElement);
                    }
                    assertValidProps(tag, nextProps);
                    var styleUpdates = null;
                    for(propKey in lastProps)if (!nextProps.hasOwnProperty(propKey) && lastProps.hasOwnProperty(propKey) && null != lastProps[propKey]) {
                        if (propKey === STYLE) {
                            var lastStyle = lastProps[propKey];
                            for(styleName in lastStyle)lastStyle.hasOwnProperty(styleName) && (styleUpdates || (styleUpdates = {}), styleUpdates[styleName] = "");
                        } else propKey !== DANGEROUSLY_SET_INNER_HTML && propKey !== CHILDREN && propKey !== SUPPRESS_CONTENT_EDITABLE_WARNING && propKey !== SUPPRESS_HYDRATION_WARNING && propKey !== AUTOFOCUS && (registrationNameDependencies.hasOwnProperty(propKey) ? updatePayload || (updatePayload = []) : // For all other deleted properties we add it to the queue. We use
                        // the allowed property list in the commit phase instead.
                        (updatePayload = updatePayload || []).push(propKey, null));
                    }
                    for(propKey in nextProps){
                        var nextProp = nextProps[propKey], lastProp = null != lastProps ? lastProps[propKey] : void 0;
                        if (nextProps.hasOwnProperty(propKey) && nextProp !== lastProp && (null != nextProp || null != lastProp)) {
                            if (propKey === STYLE) {
                                if (nextProp && // Freeze the next style object so that we can assume it won't be
                                // mutated. We have already warned for this in the past.
                                Object.freeze(nextProp), lastProp) {
                                    // Unset styles on `lastProp` but not on `nextProp`.
                                    for(styleName in lastProp)!lastProp.hasOwnProperty(styleName) || nextProp && nextProp.hasOwnProperty(styleName) || (styleUpdates || (styleUpdates = {}), styleUpdates[styleName] = "");
                                     // Update styles that changed since `lastProp`.
                                    for(styleName in nextProp)nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName] && (styleUpdates || (styleUpdates = {}), styleUpdates[styleName] = nextProp[styleName]);
                                } else styleUpdates || (updatePayload || (updatePayload = []), updatePayload.push(propKey, styleUpdates)), styleUpdates = nextProp;
                            } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
                                var nextHtml = nextProp ? nextProp[HTML$1] : void 0, lastHtml = lastProp ? lastProp[HTML$1] : void 0;
                                null != nextHtml && lastHtml !== nextHtml && (updatePayload = updatePayload || []).push(propKey, nextHtml);
                            } else propKey === CHILDREN ? ("string" == typeof nextProp || "number" == typeof nextProp) && (updatePayload = updatePayload || []).push(propKey, "" + nextProp) : propKey !== SUPPRESS_CONTENT_EDITABLE_WARNING && propKey !== SUPPRESS_HYDRATION_WARNING && (registrationNameDependencies.hasOwnProperty(propKey) ? (null != nextProp && ("function" != typeof nextProp && warnForInvalidEventListener(propKey, nextProp), "onScroll" === propKey && listenToNonDelegatedEvent("scroll", domElement)), updatePayload || lastProp === nextProp || // This is a special case. If any listener updates we need to ensure
                            // that the "current" props pointer gets updated so we need a commit
                            // to update this element.
                            (updatePayload = [])) : "object" == typeof nextProp && null !== nextProp && nextProp.$$typeof === REACT_OPAQUE_ID_TYPE ? // If we encounter useOpaqueReference's opaque object, this means we are hydrating.
                            // In this case, call the opaque object's toString function which generates a new client
                            // ID so client and server IDs match and throws to rerender.
                            nextProp.toString() : // For any other property we always add it to the queue and then we
                            // filter it out using the allowed property list during the commit.
                            (updatePayload = updatePayload || []).push(propKey, nextProp));
                        }
                    }
                    return styleUpdates && (/**
   * When mixing shorthand and longhand property names, we warn during updates if
   * we expect an incorrect result to occur. In particular, we warn for:
   *
   * Updating a shorthand property (longhand gets overwritten):
   *   {font: 'foo', fontVariant: 'bar'} -> {font: 'baz', fontVariant: 'bar'}
   *   becomes .style.font = 'baz'
   * Removing a shorthand property (longhand gets lost too):
   *   {font: 'foo', fontVariant: 'bar'} -> {fontVariant: 'bar'}
   *   becomes .style.font = ''
   * Removing a longhand property (should revert to shorthand; doesn't):
   *   {font: 'foo', fontVariant: 'bar'} -> {font: 'foo'}
   *   becomes .style.fontVariant = ''
   */ function(styleUpdates, nextStyles) {
                        if (nextStyles) {
                            var expandedUpdates = expandShorthandMap(styleUpdates), expandedStyles = expandShorthandMap(nextStyles), warnedAbout = {};
                            for(var key in expandedUpdates){
                                var originalKey = expandedUpdates[key], correctOriginalKey = expandedStyles[key];
                                if (correctOriginalKey && originalKey !== correctOriginalKey) {
                                    var value, warningKey = originalKey + "," + correctOriginalKey;
                                    if (warnedAbout[warningKey]) continue;
                                    warnedAbout[warningKey] = !0, error("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", null == (value = styleUpdates[originalKey]) || "boolean" == typeof value || "" === value ? "Removing" : "Updating", originalKey, correctOriginalKey);
                                }
                            }
                        }
                    }(styleUpdates, nextProps[STYLE]), (updatePayload = updatePayload || []).push(STYLE, styleUpdates)), updatePayload;
                } // Apply the diff.
                (domElement, type, oldProps, newProps);
            }(workInProgress.stateNode, type, oldProps, newProps, 0, getHostContext()); // TODO: Type this specific to this type of component.
            workInProgress.updateQueue = updatePayload, updatePayload && markUpdate(workInProgress);
        } // If we get updated because one of our children updated, we don't
    }, updateHostText$1 = function(current, workInProgress, oldText, newText) {
        // If the text differs, mark it as an update. All the work in done in commitWork.
        oldText !== newText && markUpdate(workInProgress);
    };
    var PossiblyWeakMap$1 = "function" == typeof WeakMap ? WeakMap : Map;
    function createRootErrorUpdate(fiber, errorInfo, lane) {
        var update = createUpdate(-1, lane); // Unmount the root by rendering null.
        update.tag = 3, // being called "element".
        update.payload = {
            element: null
        };
        var error = errorInfo.value;
        return update.callback = function() {
            onUncaughtError(error), logCapturedError(fiber, errorInfo);
        }, update;
    }
    function createClassErrorUpdate(fiber, errorInfo, lane) {
        var update = createUpdate(-1, lane);
        update.tag = 3;
        var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
        if ("function" == typeof getDerivedStateFromError) {
            var error$1 = errorInfo.value;
            update.payload = function() {
                return logCapturedError(fiber, errorInfo), getDerivedStateFromError(error$1);
            };
        }
        var inst = fiber.stateNode;
        return null !== inst && "function" == typeof inst.componentDidCatch ? update.callback = function() {
            markFailedErrorBoundaryForHotReloading(fiber), "function" != typeof getDerivedStateFromError && (instance = this, null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = new Set([
                instance
            ]) : legacyErrorBoundariesThatAlreadyFailed.add(instance), logCapturedError(fiber, errorInfo));
            var instance, error$1 = errorInfo.value, stack = errorInfo.stack;
            this.componentDidCatch(error$1, {
                componentStack: null !== stack ? stack : ""
            }), "function" == typeof getDerivedStateFromError || (1 & fiber.lanes) != 0 || error("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", getComponentName(fiber.type) || "Unknown");
        } : update.callback = function() {
            markFailedErrorBoundaryForHotReloading(fiber);
        }, update;
    }
    var didWarnAboutUndefinedSnapshotBeforeUpdate = null;
    didWarnAboutUndefinedSnapshotBeforeUpdate = new Set();
    var PossiblyWeakSet = "function" == typeof WeakSet ? WeakSet : Set, callComponentWillUnmountWithTimer = function(current, instance) {
        instance.props = current.memoizedProps, instance.state = current.memoizedState, instance.componentWillUnmount();
    };
    function safelyDetachRef(current) {
        var ref = current.ref;
        null !== ref && ("function" == typeof ref ? (invokeGuardedCallback(null, ref, null, null), hasError && captureCommitPhaseError(current, clearCaughtError())) : ref.current = null);
    }
    function hideOrUnhideAllChildren(finishedWork, isHidden) {
        for(// We only have the top Fiber that was inserted but we need to recurse down its
        // children to find all the terminal nodes.
        var node = finishedWork;;){
            if (5 === node.tag) {
                var instance = node.stateNode;
                isHidden ? function(instance) {
                    var style = instance.style;
                    "function" == typeof style.setProperty ? style.setProperty("display", "none", "important") : style.display = "none";
                }(instance) : function(instance, props) {
                    var styleProp = props.style, display = null != styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                    instance.style.display = dangerousStyleValue("display", display);
                }(node.stateNode, node.memoizedProps);
            } else if (6 === node.tag) {
                var text, _instance3 = node.stateNode;
                isHidden ? _instance3.nodeValue = "" : (text = node.memoizedProps, _instance3.nodeValue = text);
            } else if ((23 === node.tag || 24 === node.tag) && null !== node.memoizedState && node !== finishedWork) ;
            else if (null !== node.child) {
                node.child.return = node, node = node.child;
                continue;
            }
            if (node === finishedWork) return;
            for(; null === node.sibling;){
                if (null === node.return || node.return === finishedWork) return;
                node = node.return;
            }
            node.sibling.return = node.return, node = node.sibling;
        }
    }
    // deletion, so don't let them throw. Host-originating errors should
    // interrupt deletion, so it's okay
    function commitUnmount(finishedRoot, current, renderPriorityLevel) {
        switch(!function(fiber) {
            if (injectedHook && "function" == typeof injectedHook.onCommitFiberUnmount) try {
                injectedHook.onCommitFiberUnmount(rendererID, fiber);
            } catch (err) {
                hasLoggedError || (hasLoggedError = !0, error("React instrumentation encountered an error: %s", err));
            }
        }(current), current.tag){
            case 0:
            case 11:
            case 14:
            case 15:
            case 22:
                var updateQueue = current.updateQueue;
                if (null !== updateQueue) {
                    var lastEffect = updateQueue.lastEffect;
                    if (null !== lastEffect) {
                        var firstEffect = lastEffect.next, effect = firstEffect;
                        do {
                            var _effect2 = effect, destroy = _effect2.destroy, tag = _effect2.tag;
                            void 0 !== destroy && ((4 & tag) != /*  */ 0 ? enqueuePendingPassiveHookEffectUnmount(current, effect) : (invokeGuardedCallback(null, destroy, null), hasError && captureCommitPhaseError(current, clearCaughtError()))), effect = effect.next;
                        }while (effect !== firstEffect)
                    }
                }
                return;
            case 1:
                safelyDetachRef(current);
                var instance = current.stateNode;
                "function" == typeof instance.componentWillUnmount && (invokeGuardedCallback(null, callComponentWillUnmountWithTimer, null, current, instance), hasError && captureCommitPhaseError(current, clearCaughtError()));
                return;
            case 5:
                safelyDetachRef(current);
                return;
            case 4:
                unmountHostComponents(finishedRoot, current);
                return;
            case 20:
            case 18:
            case 21:
                return;
        }
    }
    function detachFiberMutation(fiber) {
        // Cut off the return pointers to disconnect it from the tree. Ideally, we
        // should clear the child pointer of the parent alternate to let this
        // get GC:ed but we don't know which for sure which parent is the current
        // one so we'll settle for GC:ing the subtree of this child. This child
        // itself will be GC:ed when the parent updates the next time.
        // Note: we cannot null out sibling here, otherwise it can cause issues
        // with findDOMNode and how it requires the sibling field to carry out
        // traversal in a later effect. See PR #16820. We now clear the sibling
        // field after effects, see: detachFiberAfterEffects.
        //
        // Don't disconnect stateNode now; it will be detached in detachFiberAfterEffects.
        // It may be required if the current component is an error boundary,
        // and one of its descendants throws while unmounting a passive effect.
        fiber.alternate = null, fiber.child = null, fiber.dependencies = null, fiber.firstEffect = null, fiber.lastEffect = null, fiber.memoizedProps = null, fiber.memoizedState = null, fiber.pendingProps = null, fiber.return = null, fiber.updateQueue = null, fiber._debugOwner = null;
    }
    function isHostParent(fiber) {
        return 5 === fiber.tag || 3 === fiber.tag || 4 === fiber.tag;
    }
    function commitPlacement(finishedWork) {
        var parent, isContainer, parentFiber = function(fiber) {
            for(var parent = fiber.return; null !== parent;){
                if (isHostParent(parent)) return parent;
                parent = parent.return;
            }
            throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        }(finishedWork), parentStateNode = parentFiber.stateNode; // Note: these two variables *must* always be updated together.
        switch(parentFiber.tag){
            case 5:
                parent = parentStateNode, isContainer = !1;
                break;
            case 3:
            case 4:
                parent = parentStateNode.containerInfo, isContainer = !0;
                break;
            default:
                throw Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
        }
        16 & parentFiber.flags && (setTextContent(parent, ""), parentFiber.flags &= -17);
        var before = function(fiber) {
            // We're going to search forward into the tree until we find a sibling host
            // node. Unfortunately, if multiple insertions are done in a row we have to
            // search past them. This leads to exponential search for the next sibling.
            // TODO: Find a more efficient way to do this.
            var node = fiber;
            siblings: for(;;){
                // If we didn't find anything, let's try the next sibling.
                for(; null === node.sibling;){
                    if (null === node.return || isHostParent(node.return)) // If we pop out of the root or hit the parent the fiber we are the
                    // last sibling.
                    return null;
                    node = node.return;
                }
                for(node.sibling.return = node.return, node = node.sibling; 5 !== node.tag && 6 !== node.tag && 18 !== node.tag;){
                    // If it is not host node and, we might have a host node inside it.
                    // Try to search down until we find one.
                    if (2 & node.flags || null === node.child || 4 === node.tag) continue siblings;
                     // If we don't have a child, try the siblings instead.
                    node.child.return = node, node = node.child;
                } // Check if this host node is stable or about to be placed.
                if (!(2 & node.flags)) // Found it!
                return node.stateNode;
            }
        }(finishedWork); // We only have the top Fiber that was inserted but we need to recurse down its
        // children to find all the terminal nodes.
        isContainer ? function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
            var tag = node.tag, isHost = 5 === tag || 6 === tag;
            if (isHost) {
                var parentNode, reactRootContainer, stateNode = isHost ? node.stateNode : node.stateNode.instance;
                before ? 8 === parent.nodeType ? parent.parentNode.insertBefore(stateNode, before) : parent.insertBefore(stateNode, before) : (8 === parent.nodeType ? (parentNode = parent.parentNode).insertBefore(stateNode, parent) : (parentNode = parent).appendChild(stateNode), null == parent._reactRootContainer && null === parentNode.onclick && // TODO: This cast may not be sound for SVG, MathML or custom elements.
                trapClickOnNonInteractiveElement(parentNode));
            } else if (4 === tag) ;
            else {
                var child = node.child;
                if (null !== child) {
                    insertOrAppendPlacementNodeIntoContainer(child, before, parent);
                    for(var sibling = child.sibling; null !== sibling;)insertOrAppendPlacementNodeIntoContainer(sibling, before, parent), sibling = sibling.sibling;
                }
            }
        }(finishedWork, before, parent) : function insertOrAppendPlacementNode(node, before, parent) {
            var tag = node.tag, isHost = 5 === tag || 6 === tag;
            if (isHost) {
                var stateNode = isHost ? node.stateNode : node.stateNode.instance;
                before ? function(parentInstance, child, beforeChild) {
                    parentInstance.insertBefore(child, beforeChild);
                }(parent, stateNode, before) : function(parentInstance, child) {
                    parentInstance.appendChild(child);
                }(parent, stateNode);
            } else if (4 === tag) ;
            else {
                var child = node.child;
                if (null !== child) {
                    insertOrAppendPlacementNode(child, before, parent);
                    for(var sibling = child.sibling; null !== sibling;)insertOrAppendPlacementNode(sibling, before, parent), sibling = sibling.sibling;
                }
            }
        }(finishedWork, before, parent);
    }
    function unmountHostComponents(finishedRoot, current, renderPriorityLevel) {
        for(// We only have the top Fiber that was deleted but we need to recurse down its
        // children to find all the terminal nodes.
        var currentParent, currentParentIsContainer, node = current, currentParentIsValid = !1;;){
            if (!currentParentIsValid) {
                var container, child, parent = node.return;
                findParent: for(;;){
                    if (!(null !== parent)) throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
                    var parentStateNode = parent.stateNode;
                    switch(parent.tag){
                        case 5:
                            currentParent = parentStateNode, currentParentIsContainer = !1;
                            break findParent;
                        case 3:
                        case 4:
                            currentParent = parentStateNode.containerInfo, currentParentIsContainer = !0;
                            break findParent;
                    }
                    parent = parent.return;
                }
                currentParentIsValid = !0;
            }
            if (5 === node.tag || 6 === node.tag) // node from the tree.
            (!function(finishedRoot, root, renderPriorityLevel) {
                for(// While we're inside a removed host node we don't want to call
                // removeChild on the inner nodes because they're removed by the top
                // call anyway. We also want to call componentWillUnmount on all
                // composites before this host node is removed from the tree. Therefore
                // we do an inner loop while we're still inside the host node.
                var node = root;;){
                    // Skip portals because commitUnmount() currently visits them recursively.
                    if (commitUnmount(finishedRoot, node), null !== node.child && // If we use mutation we drill down into portals using commitUnmount above.
                    // If we don't use mutation we drill down into portals here instead.
                    4 !== node.tag) {
                        node.child.return = node, node = node.child;
                        continue;
                    }
                    if (node === root) return;
                    for(; null === node.sibling;){
                        if (null === node.return || node.return === root) return;
                        node = node.return;
                    }
                    node.sibling.return = node.return, node = node.sibling;
                }
            }(finishedRoot, node), currentParentIsContainer) ? (container = currentParent, child = node.stateNode, 8 === container.nodeType ? container.parentNode.removeChild(child) : container.removeChild(child)) : !function(parentInstance, child) {
                parentInstance.removeChild(child);
            }(currentParent, node.stateNode); // Don't visit children because we already visited them.
            else if (4 === node.tag) {
                if (null !== node.child) {
                    // When we go into a portal, it becomes the parent to remove from.
                    // We will reassign it back when we pop the portal on the way up.
                    currentParent = node.stateNode.containerInfo, currentParentIsContainer = !0, node.child.return = node, node = node.child;
                    continue;
                }
            } else if (commitUnmount(finishedRoot, node), null !== node.child) {
                node.child.return = node, node = node.child;
                continue;
            }
            if (node === current) return;
            for(; null === node.sibling;){
                if (null === node.return || node.return === current) return;
                4 === (node = node.return).tag && // When we go out of the portal, we need to restore the parent.
                // Since we don't keep a stack of them, we will search for it.
                (currentParentIsValid = !1);
            }
            node.sibling.return = node.return, node = node.sibling;
        }
    }
    function commitWork(current, finishedWork) {
        switch(finishedWork.tag){
            case 0:
            case 11:
            case 14:
            case 15:
            case 22:
                !function(tag, finishedWork) {
                    var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
                    if (null !== lastEffect) {
                        var firstEffect = lastEffect.next, effect = firstEffect;
                        do {
                            if ((3 & effect.tag) === tag) {
                                // Unmount
                                var destroy = effect.destroy;
                                effect.destroy = void 0, void 0 !== destroy && destroy();
                            }
                            effect = effect.next;
                        }while (effect !== firstEffect)
                    }
                }(3, finishedWork);
                return;
            case 1:
            case 12:
            case 17:
                return;
            case 5:
                var finishedWork1, instance = finishedWork.stateNode;
                if (null != instance) {
                    // Commit the work prepared earlier.
                    var node, props, newProps = finishedWork.memoizedProps, oldProps = null !== current ? current.memoizedProps : newProps, type = finishedWork.type, updatePayload = finishedWork.updateQueue; // For hydration we reuse the update path but we treat the oldProps
                    if (finishedWork.updateQueue = null, null !== updatePayload) {
                        node = instance, props = newProps, node[internalPropsKey] = props, function(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
                            var wasMultiple, value;
                            // changed.
                            switch("input" === tag && "radio" === nextRawProps.type && null != nextRawProps.name && updateChecked(domElement, nextRawProps), isCustomComponent(tag, lastRawProps), function(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag) {
                                // TODO: Handle wasCustomComponentTag
                                for(var i = 0; i < updatePayload.length; i += 2){
                                    var propKey = updatePayload[i], propValue = updatePayload[i + 1];
                                    propKey === STYLE ? setValueForStyles(domElement, propValue) : propKey === DANGEROUSLY_SET_INNER_HTML ? setInnerHTML(domElement, propValue) : propKey === CHILDREN ? setTextContent(domElement, propValue) : setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
                                }
                            }(domElement, updatePayload, 0, isCustomComponent(tag, nextRawProps)), tag){
                                case "input":
                                    // Update the wrapper around inputs *after* updating props. This has to
                                    // happen after `updateDOMProperties`. Otherwise HTML5 input validations
                                    // raise warnings and prevent the new value from being assigned.
                                    updateWrapper(domElement, nextRawProps);
                                    break;
                                case "textarea":
                                    updateWrapper$1(domElement, nextRawProps);
                                    break;
                                case "select":
                                    // <select> value update needs to occur after <option> children
                                    // reconciliation
                                    wasMultiple = domElement._wrapperState.wasMultiple, domElement._wrapperState.wasMultiple = !!nextRawProps.multiple, null != (value = nextRawProps.value) ? updateOptions(domElement, !!nextRawProps.multiple, value, !1) : !!nextRawProps.multiple !== wasMultiple && (null != nextRawProps.defaultValue ? updateOptions(domElement, !!nextRawProps.multiple, nextRawProps.defaultValue, !0) : // Revert the select back to its default unselected state.
                                    updateOptions(domElement, !!nextRawProps.multiple, nextRawProps.multiple ? [] : "", !1));
                            }
                        }(instance, updatePayload, type, oldProps, newProps);
                    }
                }
                return;
            case 6:
                if (!(null !== finishedWork.stateNode)) throw Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
                var textInstance = finishedWork.stateNode, newText = finishedWork.memoizedProps;
                null !== current && current.memoizedProps, textInstance.nodeValue = newText;
                return;
            case 3:
                var _root = finishedWork.stateNode;
                _root.hydrate && (// We've just hydrated. No need to hydrate again.
                _root.hydrate = !1, // Retry if any event replaying was blocked on this.
                retryIfBlockedOn(_root.containerInfo));
                return;
            case 13:
                null !== (finishedWork1 = finishedWork).memoizedState && (globalMostRecentFallbackTime = now(), hideOrUnhideAllChildren(finishedWork1.child, !0)), attachSuspenseRetryListeners(finishedWork);
                return;
            case 19:
                attachSuspenseRetryListeners(finishedWork);
                return;
            case 20:
            case 21:
                break;
            case 23:
            case 24:
                var newState = finishedWork.memoizedState;
                hideOrUnhideAllChildren(finishedWork, null !== newState);
                return;
        }
        throw Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
    }
    function attachSuspenseRetryListeners(finishedWork) {
        // If this boundary just timed out, then it will have a set of wakeables.
        // For each wakeable, attach a listener so that when it resolves, React
        // attempts to re-render the boundary in the primary (pre-timeout) state.
        var wakeables = finishedWork.updateQueue;
        if (null !== wakeables) {
            finishedWork.updateQueue = null;
            var retryCache = finishedWork.stateNode;
            null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet()), wakeables.forEach(function(wakeable) {
                // Memoize using the boundary fiber to prevent redundant listeners.
                var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
                retryCache.has(wakeable) || (!0 !== wakeable.__reactDoNotTraceInteractions && (retry = unstable_wrap(retry)), retryCache.add(wakeable), wakeable.then(retry, retry));
            });
        }
    } // This function detects when a Suspense boundary goes from visible to hidden.
    if ("function" == typeof Symbol && Symbol.for) {
        var symbolFor$1 = Symbol.for;
        symbolFor$1("selector.component"), symbolFor$1("selector.has_pseudo_class"), symbolFor$1("selector.role"), symbolFor$1("selector.test_id"), symbolFor$1("selector.text");
    }
    var commitHooks = [], ceil = Math.ceil, ReactCurrentDispatcher$2 = ReactSharedInternals.ReactCurrentDispatcher, ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner, IsSomeRendererActing = ReactSharedInternals.IsSomeRendererActing, executionContext = /*             */ 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, subtreeRenderLanes = 0, subtreeRenderLanesCursor = createCursor(0), workInProgressRootExitStatus = 0, workInProgressRootFatalError = null, workInProgressRootIncludedLanes = 0, workInProgressRootSkippedLanes = 0, workInProgressRootUpdatedLanes = 0, workInProgressRootPingedLanes = 0, mostRecentlyUpdatedRoot = null, globalMostRecentFallbackTime = 0, workInProgressRootRenderTargetTime = 1 / 0;
    function resetRenderTimer() {
        workInProgressRootRenderTargetTime = now() + 500;
    }
    var nextEffect = null, hasUncaughtError = !1, firstUncaughtError = null, legacyErrorBoundariesThatAlreadyFailed = null, rootDoesHavePassiveEffects = !1, rootWithPendingPassiveEffects = null, pendingPassiveEffectsRenderPriority = 90, pendingPassiveEffectsLanes = 0, pendingPassiveHookEffectsMount = [], pendingPassiveHookEffectsUnmount = [], rootsWithPendingDiscreteUpdates = null, nestedUpdateCount = 0, rootWithNestedUpdates = null, nestedPassiveUpdateCount = 0, spawnedWorkDuringRender = null, currentEventTime = -1, currentEventWipLanes = 0, currentEventPendingLanes = 0, isFlushingPassiveEffects = !1, focusedInstanceHandle = null, shouldFireAfterActiveInstanceBlur = !1;
    function requestEventTime() {
        return (48 & executionContext) != 0 ? now() : -1 !== currentEventTime ? currentEventTime : currentEventTime = now() // We're not inside React, so we may be in the middle of a browser event.
        ;
    }
    function requestUpdateLane(fiber) {
        // Special cases
        var wipLanes, lane, lane1, mode = fiber.mode;
        if ((2 & mode) == 0) return 1;
         // The algorithm for assigning an update to a lane should be stable for all
        if ((4 & mode) == 0) return 99 === getCurrentPriorityLevel() ? 1 : 2;
        if (0 === currentEventWipLanes && (currentEventWipLanes = workInProgressRootIncludedLanes), 0 !== ReactCurrentBatchConfig.transition) return 0 !== currentEventPendingLanes && (currentEventPendingLanes = null !== mostRecentlyUpdatedRoot ? mostRecentlyUpdatedRoot.pendingLanes : 0), wipLanes = currentEventWipLanes, 0 === (lane = pickArbitraryLane(4186112 & ~currentEventPendingLanes)) && 0 === // If all lanes have pending work, look for a lane that isn't currently
        // being worked on.
        (lane = pickArbitraryLane(4186112 & ~wipLanes)) && // If everything is being worked on, pick any lane. This has the
        // effect of interrupting the current work-in-progress.
        (lane = pickArbitraryLane(4186112)), lane;
         // TODO: Remove this dependency on the Scheduler priority.
        // To do that, we're replacing it with an update lane priority.
        var schedulerPriority = getCurrentPriorityLevel(); // The old behavior was using the priority level of the Scheduler.
        return(// TODO: Temporary. We're removing the concept of discrete updates.
        (/*         */ 4 & executionContext) != 0 && 98 === schedulerPriority ? findUpdateLane(12, currentEventWipLanes) : findUpdateLane(function(schedulerPriorityLevel) {
            switch(schedulerPriorityLevel){
                case 99:
                    return 15;
                case 98:
                    return 10;
                case 97:
                case 96:
                    // TODO: Handle LowSchedulerPriority, somehow. Maybe the same lane as hydration.
                    return 8;
                case 95:
                    return 2;
                default:
                    return 0;
            }
        }(schedulerPriority), currentEventWipLanes));
    }
    function scheduleUpdateOnFiber(fiber, lane, eventTime) {
        (function() {
            if (nestedUpdateCount > 50) throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
            nestedPassiveUpdateCount > 50 && (nestedPassiveUpdateCount = 0, error("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
        })(), function(fiber) {
            if (isRendering && (/*                */ 16 & executionContext) != 0 && !isUpdatingOpaqueValueInRenderPhase) switch(fiber.tag){
                case 0:
                case 11:
                case 15:
                    var renderingComponentName = workInProgress && getComponentName(workInProgress.type) || "Unknown"; // Dedupe by the rendering component because it's the one that needs to be fixed.
                    didWarnAboutUpdateInRenderForAnotherComponent.has(renderingComponentName) || (didWarnAboutUpdateInRenderForAnotherComponent.add(renderingComponentName), error("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", getComponentName(fiber.type) || "Unknown", renderingComponentName, renderingComponentName));
                    break;
                case 1:
                    didWarnAboutUpdateInRender || (error("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), didWarnAboutUpdateInRender = !0);
            }
        } // a 'shared' variable that changes when act() opens/closes in tests.
        (fiber);
        var root = markUpdateLaneFromFiberToRoot(fiber, lane);
        if (null === root) return function(fiber) {
            var tag = fiber.tag;
            if ((3 === tag || 1 === tag || 0 === tag || 11 === tag || 14 === tag || 15 === tag || 22 === tag) && (/*     */ 8192 & fiber.flags) == 0) {
                // the problematic code almost always lies inside that component.
                var componentName = getComponentName(fiber.type) || "ReactComponent";
                if (null !== didWarnStateUpdateForUnmountedComponent) {
                    if (didWarnStateUpdateForUnmountedComponent.has(componentName)) return;
                    didWarnStateUpdateForUnmountedComponent.add(componentName);
                } else didWarnStateUpdateForUnmountedComponent = new Set([
                    componentName
                ]);
                if (isFlushingPassiveEffects) ;
                else {
                    var previousFiber = current;
                    try {
                        setCurrentFiber(fiber), error("Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in %s.", 1 === tag ? "the componentWillUnmount method" : "a useEffect cleanup function");
                    } finally{
                        previousFiber ? setCurrentFiber(fiber) : resetCurrentFiber();
                    }
                }
            } // If there are pending passive effects unmounts for this Fiber,
        }(fiber), null;
         // Mark that the root has a pending update.
        markRootUpdated(root, lane, eventTime), root === workInProgressRoot && (workInProgressRootUpdatedLanes |= lane, 4 === workInProgressRootExitStatus && // The root already suspended with a delay, which means this render
        // definitely won't finish. Since we have a new update, let's mark it as
        // suspended now, right before marking the incoming update. This has the
        // effect of interrupting the current render and switching to the update.
        // TODO: Make sure this doesn't override pings that happen while we've
        // already started rendering.
        markRootSuspended$1(root, workInProgressRootRenderLanes)); // TODO: requestUpdateLanePriority also reads the priority. Pass the
        // priority as an argument to that function and this one.
        var priorityLevel = getCurrentPriorityLevel();
        1 === lane ? // Check if we're inside unbatchedUpdates
        (/*       */ 8 & executionContext) != 0 && // Check if we're not already rendering
        (48 & executionContext) == 0 ? (// Register pending interactions on the root to avoid losing traced interaction data.
        schedulePendingInteractions(root, lane), // root inside of batchedUpdates should be synchronous, but layout updates
        // should be deferred until the end of the batch.
        performSyncWorkOnRoot(root)) : (ensureRootIsScheduled(root, eventTime), schedulePendingInteractions(root, lane), 0 === executionContext && (// Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        resetRenderTimer(), flushSyncCallbackQueue())) : ((4 & executionContext) != 0 && // Only updates at user-blocking priority or greater are considered
        // discrete, even inside a discrete event.
        (98 === priorityLevel || 99 === priorityLevel) && (null === rootsWithPendingDiscreteUpdates ? rootsWithPendingDiscreteUpdates = new Set([
            root
        ]) : rootsWithPendingDiscreteUpdates.add(root)), ensureRootIsScheduled(root, eventTime), schedulePendingInteractions(root, lane)), // `requestUpdateLane`. We assume it's the same as the root being updated,
        // since in the common case of a single root app it probably is. If it's not
        // the same root, then it's not a huge deal, we just might batch more stuff
        // together more than necessary.
        mostRecentlyUpdatedRoot = root;
    } // This is split into a separate function so we can mark a fiber with pending
    // work without treating it as a typical update that originates from an event;
    // e.g. retrying a Suspense boundary isn't an update, but it does schedule work
    // on a fiber.
    function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
        // Update the source fiber's lanes
        sourceFiber.lanes = sourceFiber.lanes | lane;
        var alternate = sourceFiber.alternate;
        null !== alternate && (alternate.lanes = alternate.lanes | lane), null === alternate && (1026 & sourceFiber.flags) != 0 && warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
        for(var node = sourceFiber, parent = sourceFiber.return; null !== parent;)(parent.childLanes = parent.childLanes | lane, null !== (alternate = parent.alternate)) ? alternate.childLanes = alternate.childLanes | lane : (1026 & parent.flags) != 0 && warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber), node = parent, parent = parent.return;
        return 3 === node.tag ? node.stateNode : null;
    } // Use this function to schedule a task for a root. There's only one task per
    // root; if a task was already scheduled, we'll check to make sure the priority
    // of the existing task is the same as the priority of the next level that the
    // root has work on. This function is called on every update, and right before
    // exiting a task.
    function ensureRootIsScheduled(root, currentTime) {
        var callback, newCallbackNode, existingCallbackNode = root.callbackNode; // Check if any lanes are being starved by other work. If so, mark them as
        !// expired so we know to work on those next.
        function(root, currentTime) {
            for(// TODO: This gets called every time we yield. We can optimize by storing
            // the earliest expiration time on the root. Then use that to quickly bail out
            // of this function.
            var pendingLanes = root.pendingLanes, suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes, expirationTimes = root.expirationTimes, lanes = pendingLanes; lanes > 0;){
                var index = pickArbitraryLaneIndex(lanes), lane = 1 << index, expirationTime = expirationTimes[index];
                -1 === expirationTime ? ((lane & suspendedLanes) == 0 || (lane & pingedLanes) != 0) && // Assumes timestamps are monotonically increasing.
                (expirationTimes[index] = function(lane, currentTime) {
                    // TODO: Expiration heuristic is constant per lane, so could use a map.
                    getHighestPriorityLanes(lane);
                    var priority = return_highestLanePriority;
                    return priority >= 10 ? currentTime + 250 : priority >= 6 ? currentTime + 5000 : -1;
                }(lane, currentTime)) : expirationTime <= currentTime && // This lane expired
                (root.expiredLanes |= lane), lanes &= ~lane;
            }
        } // This returns the highest priority pending lanes regardless of whether they
        (root, currentTime);
        var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : 0), newCallbackPriority = return_highestLanePriority; // This returns the priority level computed during the `getNextLanes` call.
        if (0 === nextLanes) {
            // Special case: There's nothing to work on.
            null !== existingCallbackNode && (existingCallbackNode !== fakeCallbackNode && unstable_cancelCallback(existingCallbackNode), root.callbackNode = null, root.callbackPriority = 0);
            return;
        } // Check if there's an existing task. We may be able to reuse it.
        if (null !== existingCallbackNode) {
            if (root.callbackPriority === newCallbackPriority) // The priority hasn't changed. We can reuse the existing task. Exit.
            return;
             // The priority changed. Cancel the existing callback. We'll schedule a new
            // one below.
            existingCallbackNode !== fakeCallbackNode && unstable_cancelCallback(existingCallbackNode);
        } // Schedule a new callback.
        15 === newCallbackPriority ? (callback = performSyncWorkOnRoot.bind(null, root), null === syncQueue ? (syncQueue = [
            callback
        ], immediateQueueCallbackNode = unstable_scheduleCallback(unstable_ImmediatePriority, flushSyncCallbackQueueImpl)) : // Push onto existing queue. Don't need to schedule a callback because
        // we already scheduled one when we created the queue.
        syncQueue.push(callback), // Special case: Sync React callbacks are scheduled on a special
        // internal queue
        newCallbackNode = fakeCallbackNode) : newCallbackNode = 14 === newCallbackPriority ? scheduleCallback(99, performSyncWorkOnRoot.bind(null, root)) : scheduleCallback(function(lanePriority) {
            switch(lanePriority){
                case 15:
                case 14:
                    return 99;
                case 13:
                case 12:
                case 11:
                case 10:
                    return 98;
                case 9:
                case 8:
                case 7:
                case 6:
                case 4:
                case 5:
                    return 97;
                case 3:
                case 2:
                case 1:
                    return 95;
                case 0:
                    return 90;
                default:
                    throw Error("Invalid update priority: " + lanePriority + ". This is a bug in React.");
            }
        }(newCallbackPriority), performConcurrentWorkOnRoot.bind(null, root)), root.callbackPriority = newCallbackPriority, root.callbackNode = newCallbackNode;
    } // This is the entry point for every concurrent task, i.e. anything that
    // goes through Scheduler.
    function performConcurrentWorkOnRoot(root) {
        if (// Since we know we're in a React event, we can clear the current
        // event time. The next update will compute a new event time.
        currentEventTime = -1, currentEventWipLanes = 0, currentEventPendingLanes = 0, (48 & executionContext) != 0) throw Error("Should not already be working.");
         // Flush any pending passive effects before deciding which lanes to work on,
        // in case they schedule additional work.
        var originalCallbackNode = root.callbackNode;
        if (flushPassiveEffects() && root.callbackNode !== originalCallbackNode) // The current task was canceled. Exit. We don't need to call
        // `ensureRootIsScheduled` because the check above implies either that
        // there's a new task, or that there's no remaining work on this root.
        return null;
         // Determine the next expiration time to work on, using the fields stored
        // on the root.
        var lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : 0);
        if (0 === lanes) // Defensive coding. This is never expected to happen.
        return null;
        var exitStatus = function(root, lanes) {
            var prevExecutionContext = executionContext;
            executionContext |= 16;
            var prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
            (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) && (resetRenderTimer(), prepareFreshStack(root, lanes), startWorkOnPendingInteractions(root, lanes));
            for(var prevInteractions = pushInteractions(root);;)try {
                !/** @noinline */ function() {
                    // Perform work until Scheduler asks us to yield
                    for(; null !== workInProgress && !unstable_shouldYield();)performUnitOfWork(workInProgress);
                }();
                break;
            } catch (thrownValue) {
                handleError(root, thrownValue);
            }
            return (resetContextDependencies(), popInteractions(prevInteractions), ReactCurrentDispatcher$2.current = prevDispatcher, executionContext = prevExecutionContext, null !== workInProgress) ? 0 : (workInProgressRoot = null, workInProgressRootRenderLanes = 0, workInProgressRootExitStatus);
        }(root, lanes);
        if ((workInProgressRootIncludedLanes & workInProgressRootUpdatedLanes) != 0) // The render included lanes that were updated during the render phase.
        // For example, when unhiding a hidden tree, we include all the lanes
        // that were previously skipped when the tree was hidden. That set of
        // lanes is a superset of the lanes we started rendering with.
        //
        // So we'll throw out the current work and restart.
        prepareFreshStack(root, 0);
        else if (0 !== exitStatus) {
            if (2 === exitStatus && (executionContext |= /*       */ 64, root.hydrate && (root.hydrate = !1, clearContainer(root.containerInfo)), 0 !== // synchronously to block concurrent data mutations, and we'll includes
            // all pending updates are included. If it still fails after the second
            // attempt, we'll give up and commit the resulting tree.
            (lanes = getLanesToRetrySynchronouslyOnError(root)) && (exitStatus = renderRootSync(root, lanes))), 1 === exitStatus) {
                var fatalError = workInProgressRootFatalError;
                throw prepareFreshStack(root, 0), markRootSuspended$1(root, lanes), ensureRootIsScheduled(root, now()), fatalError;
            } // We now have a consistent tree. The next step is either to commit it,
            // or, if something suspended, wait to commit it after a timeout.
            var finishedWork = root.current.alternate;
            root.finishedWork = finishedWork, root.finishedLanes = lanes, function(root, exitStatus, lanes) {
                switch(exitStatus){
                    case 0:
                    case 1:
                        throw Error("Root did not complete. This is a bug in React.");
                    // Flow knows about invariant, so it complains if I add a break
                    // statement, but eslint doesn't know about invariant, so it complains
                    // if I do. eslint-disable-next-line no-fallthrough
                    case 2:
                    case 5:
                        // We should have already attempted to retry this tree. If we reached
                        // this point, it errored again. Commit it.
                        commitRoot(root);
                        break;
                    case 3:
                        // should immediately commit it or wait a bit.
                        if (markRootSuspended$1(root, lanes), includesOnlyRetries(lanes) && // do not delay if we're inside an act() scope
                        !function() {
                            // Never force flush in production. This function should get stripped out.
                            return actingUpdatesScopeDepth > 0;
                        }()) {
                            // This render only included retries, no updates. Throttle committing
                            // retries so that we don't show too many loading states too quickly.
                            var msUntilTimeout = globalMostRecentFallbackTime + 500 - now(); // Don't bother with a very short suspense time.
                            if (msUntilTimeout > 10) {
                                if (0 !== getNextLanes(root, 0)) break;
                                var suspendedLanes = root.suspendedLanes;
                                if ((suspendedLanes & lanes) !== lanes) {
                                    requestEventTime(), markRootPinged(root, suspendedLanes);
                                    break;
                                } // The render is suspended, it hasn't timed out, and there's no
                                // lower priority work to do. Instead of committing the fallback
                                // immediately, wait for more data to arrive.
                                root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), msUntilTimeout);
                                break;
                            }
                        } // The work expired. Commit immediately.
                        commitRoot(root);
                        break;
                    case 4:
                        if (markRootSuspended$1(root, lanes), (4186112 & lanes) === lanes) break;
                        if (!function() {
                            return actingUpdatesScopeDepth > 0;
                        }()) {
                            // This is not a transition, but we did trigger an avoided state.
                            // Schedule a placeholder to display after a short delay, using the Just
                            // Noticeable Difference.
                            // TODO: Is the JND optimization worth the added complexity? If this is
                            // the only reason we track the event time, then probably not.
                            // Consider removing.
                            var timeElapsed, mostRecentEventTime = function(root, lanes) {
                                for(var eventTimes = root.eventTimes, mostRecentEventTime = -1; lanes > 0;){
                                    var index = pickArbitraryLaneIndex(lanes), lane = 1 << index, eventTime = eventTimes[index];
                                    eventTime > mostRecentEventTime && (mostRecentEventTime = eventTime), lanes &= ~lane;
                                }
                                return mostRecentEventTime;
                            }(root, lanes), timeElapsedMs = now() - mostRecentEventTime, _msUntilTimeout = ((timeElapsed = timeElapsedMs) < 120 ? 120 : timeElapsed < 480 ? 480 : timeElapsed < 1080 ? 1080 : timeElapsed < 1920 ? 1920 : timeElapsed < 3000 ? 3000 : timeElapsed < 4320 ? 4320 : 1960 * ceil(timeElapsed / 1960)) - timeElapsedMs;
                            if (_msUntilTimeout > 10) {
                                // Instead of committing the fallback immediately, wait for more data
                                // to arrive.
                                root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), _msUntilTimeout);
                                break;
                            }
                        } // Commit the placeholder.
                        commitRoot(root);
                        break;
                    default:
                        throw Error("Unknown root exit status.");
                }
            }(root, exitStatus, lanes);
        }
        return (ensureRootIsScheduled(root, now()), root.callbackNode === originalCallbackNode) ? performConcurrentWorkOnRoot.bind(null, root) : null;
    }
    function markRootSuspended$1(root, suspendedLanes) {
        // When suspending, we should always exclude lanes that were pinged or (more
        // rarely, since we try to avoid it) updated during the render phase.
        // TODO: Lol maybe there's a better way to factor this besides this
        // obnoxiously named function :)
        suspendedLanes &= ~workInProgressRootPingedLanes, function(root, suspendedLanes) {
            root.suspendedLanes |= suspendedLanes, root.pingedLanes &= ~suspendedLanes;
            for(var expirationTimes = root.expirationTimes, lanes = suspendedLanes; lanes > 0;){
                var index = pickArbitraryLaneIndex(lanes), lane = 1 << index;
                expirationTimes[index] = -1, lanes &= ~lane;
            }
        }(root, suspendedLanes &= ~workInProgressRootUpdatedLanes);
    } // This is the entry point for synchronous tasks that don't go
    // through Scheduler
    function performSyncWorkOnRoot(root) {
        if ((48 & executionContext) != 0) throw Error("Should not already be working.");
        if (flushPassiveEffects(), root === workInProgressRoot && (a = root.expiredLanes, (a & workInProgressRootRenderLanes) != 0) ? (exitStatus = renderRootSync(root, // There's a partial tree, and at least one of its lanes has expired. Finish
        // rendering it before rendering the rest of the expired work.
        lanes = workInProgressRootRenderLanes), (workInProgressRootIncludedLanes & workInProgressRootUpdatedLanes) != 0 && (// The render included lanes that were updated during the render phase.
        // For example, when unhiding a hidden tree, we include all the lanes
        // that were previously skipped when the tree was hidden. That set of
        // lanes is a superset of the lanes we started rendering with.
        //
        // Note that this only happens when part of the tree is rendered
        // concurrently. If the whole tree is rendered synchronously, then there
        // are no interleaved events.
        lanes = getNextLanes(root, lanes), exitStatus = renderRootSync(root, lanes))) : (lanes = getNextLanes(root, 0), exitStatus = renderRootSync(root, lanes)), 0 !== root.tag && 2 === exitStatus && (executionContext |= 64, root.hydrate && (root.hydrate = !1, clearContainer(root.containerInfo)), 0 !== // synchronously to block concurrent data mutations, and we'll includes
        // all pending updates are included. If it still fails after the second
        // attempt, we'll give up and commit the resulting tree.
        (lanes = getLanesToRetrySynchronouslyOnError(root)) && (exitStatus = renderRootSync(root, lanes))), 1 === exitStatus) {
            var a, lanes, exitStatus, fatalError = workInProgressRootFatalError;
            throw prepareFreshStack(root, 0), markRootSuspended$1(root, lanes), ensureRootIsScheduled(root, now()), fatalError;
        } // We now have a consistent tree. Because this is a sync render, we
        // will commit it even if something suspended.
        var finishedWork = root.current.alternate;
        return root.finishedWork = finishedWork, root.finishedLanes = lanes, commitRoot(root), // pending level.
        ensureRootIsScheduled(root, now()), null;
    }
    function batchedUpdates$1(fn, a) {
        var prevExecutionContext = executionContext;
        executionContext |= /*               */ 1;
        try {
            return fn(a);
        } finally{
            0 === (executionContext = prevExecutionContext) && (// Flush the immediate callbacks that were scheduled during this batch
            resetRenderTimer(), flushSyncCallbackQueue());
        }
    }
    function unbatchedUpdates(fn, a) {
        var prevExecutionContext = executionContext;
        executionContext &= -2, executionContext |= 8;
        try {
            return fn(a);
        } finally{
            0 === (executionContext = prevExecutionContext) && (// Flush the immediate callbacks that were scheduled during this batch
            resetRenderTimer(), flushSyncCallbackQueue());
        }
    }
    function flushSync(fn, a) {
        var prevExecutionContext = executionContext;
        if ((48 & prevExecutionContext) != 0) return error("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), fn(a);
        executionContext |= 1;
        try {
            if (fn) return runWithPriority$1(99, fn.bind(null, a));
            return;
        } finally{
            executionContext = prevExecutionContext, // Note that this will happen even if batchedUpdates is higher up
            // the stack.
            flushSyncCallbackQueue();
        }
    }
    function pushRenderLanes(fiber, lanes) {
        push(subtreeRenderLanesCursor, subtreeRenderLanes, fiber), subtreeRenderLanes |= lanes, workInProgressRootIncludedLanes |= lanes;
    }
    function popRenderLanes(fiber) {
        subtreeRenderLanes = subtreeRenderLanesCursor.current, pop(subtreeRenderLanesCursor, fiber);
    }
    function prepareFreshStack(root, lanes) {
        root.finishedWork = null, root.finishedLanes = 0;
        var timeoutHandle = root.timeoutHandle;
        if (-1 !== timeoutHandle && (// The root previous suspended and scheduled a timeout to commit a fallback
        // state. Now that we have additional work, cancel the timeout.
        root.timeoutHandle = -1, cancelTimeout(timeoutHandle)), null !== workInProgress) for(var interruptedWork = workInProgress.return; null !== interruptedWork;)unwindInterruptedWork(interruptedWork), interruptedWork = interruptedWork.return;
        workInProgressRoot = root, workInProgress = createWorkInProgress(root.current, null), workInProgressRootRenderLanes = subtreeRenderLanes = workInProgressRootIncludedLanes = lanes, workInProgressRootExitStatus = 0, workInProgressRootFatalError = null, workInProgressRootSkippedLanes = 0, workInProgressRootUpdatedLanes = 0, workInProgressRootPingedLanes = 0, spawnedWorkDuringRender = null, ReactStrictModeWarnings.discardPendingWarnings();
    }
    function handleError(root, thrownValue) {
        for(;;){
            var erroredWork = workInProgress;
            try {
                if (// Reset module-level state that was set during the render phase.
                resetContextDependencies(), resetHooksAfterThrow(), resetCurrentFiber(), // separate issue. Write a regression test using string refs.
                ReactCurrentOwner$2.current = null, null === erroredWork || null === erroredWork.return) {
                    // Expected to be working on a non-root fiber. This is a fatal error
                    // because there's no ancestor that can handle it; the root is
                    // supposed to capture all errors that weren't caught by an error
                    // boundary.
                    workInProgressRootExitStatus = 1, workInProgressRootFatalError = thrownValue, // sibling, or the parent if there are no siblings. But since the root
                    // has no siblings nor a parent, we set it to null. Usually this is
                    // handled by `completeUnitOfWork` or `unwindWork`, but since we're
                    // intentionally not calling those, we need set it here.
                    // TODO: Consider calling `unwindWork` to pop the contexts.
                    workInProgress = null;
                    return;
                }
                8 & erroredWork.mode && // Record the time spent rendering before an error was thrown. This
                // avoids inaccurate Profiler durations in the case of a
                // suspended render.
                stopProfilerTimerIfRunningAndRecordDelta(erroredWork, !0), function(root, returnFiber, sourceFiber, value, rootRenderLanes) {
                    if (// The source fiber did not complete.
                    sourceFiber.flags |= /*                   */ 2048, sourceFiber.firstEffect = sourceFiber.lastEffect = null, null !== value && "object" == typeof value && "function" == typeof value.then) {
                        // This is a wakeable.
                        var wakeable = value;
                        if ((2 & sourceFiber.mode) == 0) {
                            // Reset the memoizedState to what it was before we attempted
                            // to render it.
                            var currentSource = sourceFiber.alternate;
                            currentSource ? (sourceFiber.updateQueue = currentSource.updateQueue, sourceFiber.memoizedState = currentSource.memoizedState, sourceFiber.lanes = currentSource.lanes) : (sourceFiber.updateQueue = null, sourceFiber.memoizedState = null);
                        }
                        var hasInvisibleParentBoundary = (1 & suspenseStackCursor.current) != 0, _workInProgress = returnFiber; // Schedule the nearest Suspense to re-render the timed out view.
                        do {
                            if (13 === _workInProgress.tag && function(workInProgress, hasInvisibleParent) {
                                // If it was the primary children that just suspended, capture and render the
                                // fallback. Otherwise, don't capture and bubble to the next boundary.
                                var nextState = workInProgress.memoizedState;
                                if (null !== nextState) return null !== nextState.dehydrated;
                                var props = workInProgress.memoizedProps; // In order to capture, the Suspense component must have a fallback prop.
                                return void 0 !== props.fallback && (!0 !== props.unstable_avoidThisFallback || !hasInvisibleParent) // Regular boundaries always capture.
                                ;
                            }(_workInProgress, hasInvisibleParentBoundary)) {
                                // Found the nearest boundary.
                                // Stash the promise on the boundary fiber. If the boundary times out, we'll
                                // attach another listener to flip the boundary back to its normal state.
                                var wakeables = _workInProgress.updateQueue;
                                if (null === wakeables) {
                                    var updateQueue = new Set();
                                    updateQueue.add(wakeable), _workInProgress.updateQueue = updateQueue;
                                } else wakeables.add(wakeable);
                                 // If the boundary is outside of blocking mode, we should *not*
                                // suspend the commit. Pretend as if the suspended component rendered
                                // null and keep rendering. In the commit phase, we'll schedule a
                                // subsequent synchronous update to re-render the Suspense.
                                //
                                // Note: It doesn't matter whether the component that suspended was
                                // inside a blocking mode tree. If the Suspense is outside of it, we
                                // should *not* suspend the commit.
                                if ((2 & _workInProgress.mode) == 0) {
                                    if (_workInProgress.flags |= 64, sourceFiber.flags |= 16384, // But we shouldn't call any lifecycle methods or callbacks. Remove
                                    // all lifecycle effect tags.
                                    sourceFiber.flags &= -2981, 1 === sourceFiber.tag) {
                                        if (null === sourceFiber.alternate) // This is a new mount. Change the tag so it's not mistaken for a
                                        // completed class component. For example, we should not call
                                        // componentWillUnmount if it is deleted.
                                        sourceFiber.tag = 17;
                                        else {
                                            // When we try rendering again, we should not reuse the current fiber,
                                            // since it's known to be in an inconsistent state. Use a force update to
                                            // prevent a bail out.
                                            var update = createUpdate(-1, 1);
                                            update.tag = 2, enqueueUpdate(sourceFiber, update);
                                        }
                                    } // The source fiber did not complete. Mark it with Sync priority to
                                    // indicate that it still has pending work.
                                    sourceFiber.lanes = 1 | sourceFiber.lanes;
                                    return;
                                } // Confirmed that the boundary is in a concurrent mode tree. Continue
                                // with the normal suspend path.
                                //
                                // After this we'll use a set of heuristics to determine whether this
                                // render pass will run to completion or restart or "suspend" the commit.
                                // The actual logic for this is spread out in different places.
                                //
                                // This first principle is that if we're going to suspend when we complete
                                // a root, then we should also restart if we get an update or ping that
                                // might unsuspend it, and vice versa. The only reason to suspend is
                                // because you think you might want to restart before committing. However,
                                // it doesn't make sense to restart only while in the period we're suspended.
                                //
                                // Restarting too aggressively is also not good because it starves out any
                                // intermediate loading state. So we use heuristics to determine when.
                                // Suspense Heuristics
                                //
                                // If nothing threw a Promise or all the same fallbacks are already showing,
                                // then don't suspend/restart.
                                //
                                // If this is an initial render of a new tree of Suspense boundaries and
                                // those trigger a fallback, then don't suspend/restart. We want to ensure
                                // that we can show the initial loading state as quickly as possible.
                                //
                                // If we hit a "Delayed" case, such as when we'd switch from content back into
                                // a fallback, then we should always suspend/restart. Transitions apply
                                // to this case. If none is defined, JND is used instead.
                                //
                                // If we're already showing a fallback and it gets "retried", allowing us to show
                                // another level, but there's still an inner boundary that would show a fallback,
                                // then we suspend/restart for 500ms since the last time we showed a fallback
                                // anywhere in the tree. This effectively throttles progressive loading into a
                                // consistent train of commits. This also gives us an opportunity to restart to
                                // get to the completed state slightly earlier.
                                //
                                // If there's ambiguity due to batching it's resolved in preference of:
                                // 1) "delayed", 2) "initial render", 3) "retry".
                                //
                                // We want to ensure that a "busy" state doesn't get force committed. We want to
                                // ensure that new initial loading states can commit as soon as possible.
                                (function(root, wakeable, lanes) {
                                    // Attach a listener to the promise to "ping" the root and retry. But only if
                                    // one does not already exist for the lanes we're currently rendering (which
                                    // acts like a "thread ID" here).
                                    var threadIDs, pingCache = root.pingCache;
                                    if (null === pingCache ? (pingCache = root.pingCache = new PossiblyWeakMap$1(), threadIDs = new Set(), pingCache.set(wakeable, threadIDs)) : void 0 === (threadIDs = pingCache.get(wakeable)) && (threadIDs = new Set(), pingCache.set(wakeable, threadIDs)), !threadIDs.has(lanes)) {
                                        // Memoize using the thread ID to prevent redundant listeners.
                                        threadIDs.add(lanes);
                                        var ping = pingSuspendedRoot.bind(null, root, wakeable, lanes);
                                        wakeable.then(ping, ping);
                                    }
                                })(root, wakeable, rootRenderLanes), _workInProgress.flags |= /*                */ 4096, _workInProgress.lanes = rootRenderLanes;
                                return;
                            } // This boundary already captured during this render. Continue to the next
                            // boundary.
                            _workInProgress = _workInProgress.return;
                        }while (null !== _workInProgress) // No boundary was found. Fallthrough to error mode.
                        // TODO: Use invariant so the message is stripped in prod?
                        value = Error((getComponentName(sourceFiber.type) || "A React component") + " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.");
                    } // We didn't find a boundary that could handle this type of exception. Start
                    5 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2), value = createCapturedValue(value, sourceFiber);
                    var workInProgress = returnFiber;
                    do {
                        switch(workInProgress.tag){
                            case 3:
                                var _errorInfo = value;
                                workInProgress.flags |= 4096;
                                var lane = pickArbitraryLane(rootRenderLanes);
                                workInProgress.lanes = workInProgress.lanes | lane;
                                var _update = createRootErrorUpdate(workInProgress, _errorInfo, lane);
                                enqueueCapturedUpdate(workInProgress, _update);
                                return;
                            case 1:
                                // Capture and retry
                                var errorInfo = value, ctor = workInProgress.type, instance = workInProgress.stateNode;
                                if ((64 & workInProgress.flags) == 0 && ("function" == typeof ctor.getDerivedStateFromError || null !== instance && "function" == typeof instance.componentDidCatch && !isAlreadyFailedLegacyErrorBoundary(instance))) {
                                    workInProgress.flags |= 4096;
                                    var _lane = pickArbitraryLane(rootRenderLanes);
                                    workInProgress.lanes = workInProgress.lanes | _lane; // Schedule the error boundary to re-render using updated state
                                    var _update2 = createClassErrorUpdate(workInProgress, errorInfo, _lane);
                                    enqueueCapturedUpdate(workInProgress, _update2);
                                    return;
                                }
                        }
                        workInProgress = workInProgress.return;
                    }while (null !== workInProgress)
                }(root, erroredWork.return, erroredWork, thrownValue, workInProgressRootRenderLanes), completeUnitOfWork(erroredWork);
            } catch (yetAnotherThrownValue) {
                // Something in the return path also threw.
                thrownValue = yetAnotherThrownValue, workInProgress === erroredWork && null !== erroredWork ? workInProgress = // If this boundary has already errored, then we had trouble processing
                // the error. Bubble it to the next boundary.
                erroredWork = erroredWork.return : erroredWork = workInProgress;
                continue;
            } // Return to the normal work loop.
            return;
        }
    }
    function pushDispatcher() {
        var prevDispatcher = ReactCurrentDispatcher$2.current;
        return (ReactCurrentDispatcher$2.current = ContextOnlyDispatcher, null === prevDispatcher) ? ContextOnlyDispatcher : prevDispatcher;
    }
    function pushInteractions(root) {
        var prevInteractions = __interactionsRef.current;
        return __interactionsRef.current = root.memoizedInteractions, prevInteractions;
    }
    function popInteractions(prevInteractions) {
        __interactionsRef.current = prevInteractions;
    }
    function markSkippedUpdateLanes(lane) {
        workInProgressRootSkippedLanes |= lane;
    }
    function renderRootSync(root, lanes) {
        var prevExecutionContext = executionContext;
        executionContext |= 16;
        var prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
        (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) && (prepareFreshStack(root, lanes), startWorkOnPendingInteractions(root, lanes));
        for(var prevInteractions = pushInteractions(root);;)try {
            !/** @noinline */ function() {
                // Already timed out, so perform work without checking if we need to yield.
                for(; null !== workInProgress;)performUnitOfWork(workInProgress);
            }();
            break;
        } catch (thrownValue) {
            handleError(root, thrownValue);
        }
        if (resetContextDependencies(), popInteractions(prevInteractions), executionContext = prevExecutionContext, ReactCurrentDispatcher$2.current = prevDispatcher, null !== workInProgress) throw Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
        return workInProgressRoot = null, workInProgressRootRenderLanes = 0, workInProgressRootExitStatus;
    } // The work loop is an extremely hot path. Tell Closure not to inline it.
    function performUnitOfWork(unitOfWork) {
        // The current, flushed, state of this fiber is the alternate. Ideally
        // nothing should rely on this, but relying on it here means that we don't
        // need an additional field on the work in progress.
        var next, current = unitOfWork.alternate;
        setCurrentFiber(unitOfWork), (8 & unitOfWork.mode) != 0 ? (startProfilerTimer(unitOfWork), next = beginWork$1(current, unitOfWork, subtreeRenderLanes), stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, !0)) : next = beginWork$1(current, unitOfWork, subtreeRenderLanes), resetCurrentFiber(), unitOfWork.memoizedProps = unitOfWork.pendingProps, null === next ? // If this doesn't spawn new work, complete the current work.
        completeUnitOfWork(unitOfWork) : workInProgress = next, ReactCurrentOwner$2.current = null;
    }
    function completeUnitOfWork(unitOfWork) {
        // Attempt to complete the current unit of work, then move to the next
        // sibling. If there are no more siblings, return to the parent fiber.
        var completedWork = unitOfWork;
        do {
            // The current, flushed, state of this fiber is the alternate. Ideally
            // nothing should rely on this, but relying on it here means that we don't
            // need an additional field on the work in progress.
            var current = completedWork.alternate, returnFiber = completedWork.return;
            if ((2048 & completedWork.flags) == 0) {
                setCurrentFiber(completedWork);
                var next = void 0;
                if ((8 & completedWork.mode) == 0 ? next = completeWork(current, completedWork, subtreeRenderLanes) : (startProfilerTimer(completedWork), next = completeWork(current, completedWork, subtreeRenderLanes), stopProfilerTimerIfRunningAndRecordDelta(completedWork, !1)), resetCurrentFiber(), null !== next) {
                    // Completing this fiber spawned new work. Work on that next.
                    workInProgress = next;
                    return;
                }
                (function(completedWork) {
                    if (24 !== // TODO: Move this check out of the hot path by moving `resetChildLanes`
                    // to switch statement in `completeWork`.
                    completedWork.tag && 23 !== completedWork.tag || null === completedWork.memoizedState || (1073741824 & subtreeRenderLanes) != 0 || (4 & completedWork.mode) == 0) {
                        var newChildLanes = 0; // Bubble up the earliest expiration time.
                        if ((8 & completedWork.mode) != 0) {
                            for(// In profiling mode, resetChildExpirationTime is also used to reset
                            // profiler durations.
                            var actualDuration = completedWork.actualDuration, treeBaseDuration = completedWork.selfBaseDuration, shouldBubbleActualDurations = null === completedWork.alternate || completedWork.child !== completedWork.alternate.child, child = completedWork.child; null !== child;)newChildLanes |= child.lanes | child.childLanes, shouldBubbleActualDurations && (actualDuration += child.actualDuration), treeBaseDuration += child.treeBaseDuration, child = child.sibling;
                            if (13 === completedWork.tag && null !== completedWork.memoizedState) {
                                // Don't count time spent in a timed out Suspense subtree as part of the base duration.
                                var primaryChildFragment = completedWork.child;
                                null !== primaryChildFragment && (treeBaseDuration -= primaryChildFragment.treeBaseDuration);
                            }
                            completedWork.actualDuration = actualDuration, completedWork.treeBaseDuration = treeBaseDuration;
                        } else for(var _child = completedWork.child; null !== _child;)newChildLanes |= _child.lanes | _child.childLanes, _child = _child.sibling;
                        completedWork.childLanes = newChildLanes;
                    }
                })(completedWork), null !== returnFiber && // Do not append effects to parents if a sibling failed to complete
                (2048 & returnFiber.flags) == 0 && (null === returnFiber.firstEffect && (returnFiber.firstEffect = completedWork.firstEffect), null !== completedWork.lastEffect && (null !== returnFiber.lastEffect && (returnFiber.lastEffect.nextEffect = completedWork.firstEffect), returnFiber.lastEffect = completedWork.lastEffect), completedWork.flags > 1 && (null !== returnFiber.lastEffect ? returnFiber.lastEffect.nextEffect = completedWork : returnFiber.firstEffect = completedWork, returnFiber.lastEffect = completedWork));
            } else {
                // This fiber did not complete because something threw. Pop values off
                // the stack without entering the complete phase. If this is a boundary,
                // capture values if possible.
                var _next = function(workInProgress, renderLanes) {
                    switch(workInProgress.tag){
                        case 1:
                            isContextProvider(workInProgress.type) && popContext(workInProgress);
                            var flags = workInProgress.flags;
                            if (4096 & flags) return workInProgress.flags = -4097 & flags | 64, (8 & workInProgress.mode) != 0 && transferActualDuration(workInProgress), workInProgress;
                            return null;
                        case 3:
                            popHostContainer(workInProgress), popTopLevelContextObject(workInProgress), resetWorkInProgressVersions();
                            var _flags = workInProgress.flags;
                            if ((64 & _flags) != 0) throw Error("The root failed to unmount after an error. This is likely a bug in React. Please file an issue.");
                            return workInProgress.flags = -4097 & _flags | 64, workInProgress;
                        case 5:
                            return(// TODO: popHydrationState
                            popHostContext(workInProgress), null);
                        case 13:
                            pop(suspenseStackCursor, workInProgress);
                            var _flags2 = workInProgress.flags;
                            if (4096 & _flags2) return workInProgress.flags = -4097 & _flags2 | 64, (8 & workInProgress.mode) != 0 && transferActualDuration(workInProgress), workInProgress;
                            return null;
                        case 19:
                            // caught by a nested boundary. If not, it should bubble through.
                            return pop(suspenseStackCursor, workInProgress), null;
                        case 4:
                            return popHostContainer(workInProgress), null;
                        case 10:
                            return popProvider(workInProgress), null;
                        case 23:
                        case 24:
                            return popRenderLanes(workInProgress), null;
                        default:
                            return null;
                    }
                }(completedWork); // Because this fiber did not complete, don't reset its expiration time.
                if (null !== _next) {
                    // If completing this work spawned new work, do that next. We'll come
                    // back here again.
                    // Since we're restarting, remove anything that is not a host effect
                    // from the effect tag.
                    _next.flags &= /*               */ 2047, workInProgress = _next;
                    return;
                }
                if ((8 & completedWork.mode) != 0) {
                    // Record the render duration for the fiber that errored.
                    stopProfilerTimerIfRunningAndRecordDelta(completedWork, !1); // Include the time spent working on failed children before continuing.
                    for(var actualDuration = completedWork.actualDuration, child = completedWork.child; null !== child;)actualDuration += child.actualDuration, child = child.sibling;
                    completedWork.actualDuration = actualDuration;
                }
                null !== returnFiber && (// Mark the parent fiber as incomplete and clear its effect list.
                returnFiber.firstEffect = returnFiber.lastEffect = null, returnFiber.flags |= 2048);
            }
            var siblingFiber = completedWork.sibling;
            if (null !== siblingFiber) {
                // If there is more work to do in this returnFiber, do that next.
                workInProgress = siblingFiber;
                return;
            } // Otherwise, return to the parent
            workInProgress = completedWork = returnFiber;
        }while (null !== completedWork) // We've reached the root.
        0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
    }
    function commitRoot(root) {
        return runWithPriority$1(99, commitRootImpl.bind(null, root, getCurrentPriorityLevel())), null;
    }
    function commitRootImpl(root, renderPriorityLevel) {
        do // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
        // means `flushPassiveEffects` will sometimes result in additional
        // passive effects. So we need to keep flushing in a loop until there are
        // no more pending effects.
        // TODO: Might be better if `flushPassiveEffects` did not automatically
        // flush synchronous work at the end, to avoid factoring hazards like this.
        flushPassiveEffects();
        while (null !== rootWithPendingPassiveEffects)
        if (ReactStrictModeWarnings.flushLegacyContextWarning(), ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings(), (48 & executionContext) != 0) throw Error("Should not already be working.");
        var firstEffect, finishedWork = root.finishedWork, lanes = root.finishedLanes;
        if (null === finishedWork) return null;
        if (root.finishedWork = null, root.finishedLanes = 0, !(finishedWork !== root.current)) throw Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
         // commitRoot never returns a continuation; it always finishes synchronously.
        // So we can clear these now to allow a new callback to be scheduled.
        root.callbackNode = null;
        // pending time is whatever is left on the root fiber.
        var remainingLanes = finishedWork.lanes | finishedWork.childLanes;
        if (!function(root, remainingLanes) {
            var noLongerPendingLanes = root.pendingLanes & ~remainingLanes;
            root.pendingLanes = remainingLanes, root.suspendedLanes = 0, root.pingedLanes = 0, root.expiredLanes &= remainingLanes, root.mutableReadLanes &= remainingLanes, root.entangledLanes &= remainingLanes;
            for(var entanglements = root.entanglements, eventTimes = root.eventTimes, expirationTimes = root.expirationTimes, lanes = noLongerPendingLanes; lanes > 0;){
                var index = pickArbitraryLaneIndex(lanes), lane = 1 << index;
                entanglements[index] = 0, eventTimes[index] = -1, expirationTimes[index] = -1, lanes &= ~lane;
            }
        }(root, remainingLanes), null !== rootsWithPendingDiscreteUpdates && !((24 & remainingLanes) != 0) && rootsWithPendingDiscreteUpdates.has(root) && rootsWithPendingDiscreteUpdates.delete(root), root === workInProgressRoot && (// We can reset these now that they are finished.
        workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0), finishedWork.flags > 1 ? null !== finishedWork.lastEffect ? (finishedWork.lastEffect.nextEffect = finishedWork, firstEffect = finishedWork.firstEffect) : firstEffect = finishedWork : // There is no effect on the root.
        firstEffect = finishedWork.firstEffect, null !== firstEffect) {
            var containerInfo, focusedElem, input, selection, containerInfo1, prevExecutionContext = executionContext;
            executionContext |= /*                */ 32;
            var prevInteractions = pushInteractions(root); // Reset this to null before calling lifecycles
            ReactCurrentOwner$2.current = null, containerInfo = root.containerInfo, eventsEnabled = _enabled, selectionInformation = {
                focusedElem: focusedElem = getActiveElementDeep(),
                selectionRange: hasSelectionCapabilities(focusedElem) ? ("selectionStart" in (input = focusedElem) ? {
                    start: input.selectionStart,
                    end: input.selectionEnd
                } : /**
   * @param {DOMElement} outerNode
   * @return {?object}
   */ function(outerNode) {
                    var ownerDocument = outerNode.ownerDocument, win = ownerDocument && ownerDocument.defaultView || window, selection = win.getSelection && win.getSelection();
                    if (!selection || 0 === selection.rangeCount) return null;
                    var anchorNode = selection.anchorNode, anchorOffset = selection.anchorOffset, focusNode = selection.focusNode, focusOffset = selection.focusOffset; // In Firefox, anchorNode and focusNode can be "anonymous divs", e.g. the
                    // up/down buttons on an <input type="number">. Anonymous divs do not seem to
                    // expose properties, triggering a "Permission denied error" if any of its
                    // properties are accessed. The only seemingly possible way to avoid erroring
                    // is to access a property that typically works for non-anonymous divs and
                    // catch any error that may otherwise arise. See
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
                    try {
                        /* eslint-disable no-unused-expressions */ anchorNode.nodeType, focusNode.nodeType;
                    /* eslint-enable no-unused-expressions */ } catch (e) {
                        return null;
                    }
                    return(/**
   * Returns {start, end} where `start` is the character/codepoint index of
   * (anchorNode, anchorOffset) within the textContent of `outerNode`, and
   * `end` is the index of (focusNode, focusOffset).
   *
   * Returns null if you pass in garbage input but we should probably just crash.
   *
   * Exported only for testing.
   */ function(outerNode, anchorNode, anchorOffset, focusNode, focusOffset) {
                        var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = outerNode, parentNode = null;
                        outer: for(;;){
                            for(var next = null; node === anchorNode && (0 === anchorOffset || 3 === node.nodeType) && (start = length + anchorOffset), node === focusNode && (0 === focusOffset || 3 === node.nodeType) && (end = length + focusOffset), 3 === node.nodeType && (length += node.nodeValue.length), null !== (next = node.firstChild);)parentNode = node, node = next;
                            for(;;){
                                if (node === outerNode) break outer;
                                if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset && (start = length), parentNode === focusNode && ++indexWithinFocus === focusOffset && (end = length), null !== (next = node.nextSibling)) break;
                                parentNode = (node = parentNode).parentNode;
                            } // Moving from `node` to its next sibling `next`.
                            node = next;
                        }
                        return -1 === start || -1 === end ? null : {
                            start: start,
                            end: end
                        };
                    }(outerNode, anchorNode, anchorOffset, focusNode, focusOffset));
                }(input)) || {
                    start: 0,
                    end: 0
                } : null
            }, _enabled = !1, // of the effect list for each phase: all mutation effects come before all
            // layout effects, and so on.
            // The first phase a "before mutation" phase. We use this phase to read the
            // state of the host tree right before we mutate it. This is where
            // getSnapshotBeforeUpdate is called.
            focusedInstanceHandle = null, shouldFireAfterActiveInstanceBlur = !1, nextEffect = firstEffect;
            do if (invokeGuardedCallback(null, commitBeforeMutationEffects, null), hasError) {
                if (!(null !== nextEffect)) throw Error("Should be working on an effect.");
                var error1 = clearCaughtError();
                captureCommitPhaseError(nextEffect, error1), nextEffect = nextEffect.nextEffect;
            }
            while (null !== nextEffect) // We no longer need to track the active instance fiber
            focusedInstanceHandle = null, commitTime = unstable_now(), nextEffect = firstEffect;
            do if (invokeGuardedCallback(null, commitMutationEffects, null, root, renderPriorityLevel), hasError) {
                if (!(null !== nextEffect)) throw Error("Should be working on an effect.");
                var _error = clearCaughtError();
                captureCommitPhaseError(nextEffect, _error), nextEffect = nextEffect.nextEffect;
            }
            while (null !== nextEffect)
            containerInfo1 = root.containerInfo, /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */ function(priorSelectionInformation) {
                var node, curFocusedElem = getActiveElementDeep(), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
                if (curFocusedElem !== priorFocusedElem && (node = priorFocusedElem) && node.ownerDocument && function containsNode(outerNode, innerNode) {
                    if (!outerNode || !innerNode) return !1;
                    if (outerNode === innerNode) return !0;
                    if (isTextNode(outerNode)) return !1;
                    if (isTextNode(innerNode)) return containsNode(outerNode, innerNode.parentNode);
                    if ("contains" in outerNode) return outerNode.contains(innerNode);
                    else if (outerNode.compareDocumentPosition) return !!(16 & outerNode.compareDocumentPosition(innerNode));
                    else return !1;
                }(node.ownerDocument.documentElement, node)) {
                    null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem) && (input = priorFocusedElem, start = (offsets = priorSelectionRange).start, void 0 === (end = offsets.end) && (end = start), "selectionStart" in input ? (input.selectionStart = start, input.selectionEnd = Math.min(end, input.value.length)) : /**
   * In modern non-IE browsers, we can support both forward and backward
   * selections.
   *
   * Note: IE10+ supports the Selection object, but it does not support
   * the `extend` method, which means that even in modern IE, it's not possible
   * to programmatically create a backward selection. Thus, for all IE
   * versions, we use the old IE API to create our selections.
   *
   * @param {DOMElement|DOMTextNode} node
   * @param {object} offsets
   */ function(node, offsets) {
                        var doc = node.ownerDocument || document, win = doc && doc.defaultView || window;
                        // (For instance: TinyMCE editor used in a list component that supports pasting to add more,
                        // fails when pasting 100+ items)
                        if (win.getSelection) {
                            var selection = win.getSelection(), length = node.textContent.length, start = Math.min(offsets.start, length), end = void 0 === offsets.end ? start : Math.min(offsets.end, length);
                            // Flip backward selections, so we can set with a single range.
                            if (!selection.extend && start > end) {
                                var temp = end;
                                end = start, start = temp;
                            }
                            var startMarker = getNodeForCharacterOffset(node, start), endMarker = getNodeForCharacterOffset(node, end);
                            if (startMarker && endMarker) {
                                if (1 === selection.rangeCount && selection.anchorNode === startMarker.node && selection.anchorOffset === startMarker.offset && selection.focusNode === endMarker.node && selection.focusOffset === endMarker.offset) return;
                                var range = doc.createRange();
                                range.setStart(startMarker.node, startMarker.offset), selection.removeAllRanges(), start > end ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                            }
                        }
                    }(input, offsets)); // Focusing a node can change the scroll position, which is undesirable
                    for(var input, offsets, start, end, ancestors = [], ancestor = priorFocusedElem; ancestor = ancestor.parentNode;)1 === ancestor.nodeType && ancestors.push({
                        element: ancestor,
                        left: ancestor.scrollLeft,
                        top: ancestor.scrollTop
                    });
                    "function" == typeof priorFocusedElem.focus && priorFocusedElem.focus();
                    for(var i = 0; i < ancestors.length; i++){
                        var info = ancestors[i];
                        info.element.scrollLeft = info.left, info.element.scrollTop = info.top;
                    }
                }
            }(selectionInformation), _enabled = !!eventsEnabled, eventsEnabled = null, selectionInformation = null, // the mutation phase, so that the previous tree is still current during
            // componentWillUnmount, but before the layout phase, so that the finished
            // work is current during componentDidMount/Update.
            root.current = finishedWork, // the host tree after it's been mutated. The idiomatic use case for this is
            // layout, but class component lifecycles also fire here for legacy reasons.
            nextEffect = firstEffect;
            do if (invokeGuardedCallback(null, commitLayoutEffects, null, root, lanes), hasError) {
                if (!(null !== nextEffect)) throw Error("Should be working on an effect.");
                var _error2 = clearCaughtError();
                captureCommitPhaseError(nextEffect, _error2), nextEffect = nextEffect.nextEffect;
            }
            while (null !== nextEffect)
            nextEffect = null, // opportunity to paint.
            requestPaint(), popInteractions(prevInteractions), executionContext = prevExecutionContext;
        } else // No effects.
        root.current = finishedWork, commitTime = unstable_now();
        var rootDidHavePassiveEffects = rootDoesHavePassiveEffects;
        if (rootDoesHavePassiveEffects) // This commit has passive effects. Stash a reference to them. But don't
        // schedule a callback until after flushing layout work.
        rootDoesHavePassiveEffects = !1, rootWithPendingPassiveEffects = root, pendingPassiveEffectsLanes = lanes, pendingPassiveEffectsRenderPriority = renderPriorityLevel;
        else for(// We are done with the effect chain at this point so let's clear the
        // nextEffect pointers to assist with GC. If we have passive effects, we'll
        // clear this in flushPassiveEffects.
        nextEffect = firstEffect; null !== nextEffect;){
            var nextNextEffect = nextEffect.nextEffect;
            nextEffect.nextEffect = null, 8 & nextEffect.flags && detachFiberAfterEffects(nextEffect), nextEffect = nextNextEffect;
        }
         // Read this again, since an effect might have updated it
        if (0 !== (remainingLanes = root.pendingLanes)) {
            if (null !== spawnedWorkDuringRender) {
                var expirationTimes = spawnedWorkDuringRender;
                spawnedWorkDuringRender = null;
                for(var i = 0; i < expirationTimes.length; i++)scheduleInteractions(root, expirationTimes[i], root.memoizedInteractions);
            }
            schedulePendingInteractions(root, remainingLanes);
        } else // If there's no remaining work, we can clear the set of already failed
        // error boundaries.
        legacyErrorBoundariesThatAlreadyFailed = null;
        if (rootDidHavePassiveEffects || // If there are no passive effects, then we can complete the pending interactions.
        // Otherwise, we'll wait until after the passive effects are flushed.
        // Wait to do this until after remaining work has been scheduled,
        // so that we don't prematurely signal complete for interactions when there's e.g. hidden work.
        finishPendingInteractions(root, lanes), 1 === remainingLanes ? root === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root) : nestedUpdateCount = 0, !function(root, priorityLevel) {
            if (injectedHook && "function" == typeof injectedHook.onCommitFiberRoot) try {
                var didError = (64 & root.current.flags) == 64;
                injectedHook.onCommitFiberRoot(rendererID, root, priorityLevel, didError);
            } catch (err) {
                hasLoggedError || (hasLoggedError = !0, error("React instrumentation encountered an error: %s", err));
            }
        }(finishedWork.stateNode, renderPriorityLevel), commitHooks.forEach(function(commitHook) {
            return commitHook();
        }), // additional work on this root is scheduled.
        ensureRootIsScheduled(root, now()), hasUncaughtError) {
            hasUncaughtError = !1;
            var _error3 = firstUncaughtError;
            throw firstUncaughtError = null, _error3;
        }
        return (8 & executionContext) != 0 || flushSyncCallbackQueue(), null;
    }
    function commitBeforeMutationEffects() {
        for(; null !== nextEffect;){
            var current = nextEffect.alternate;
            !shouldFireAfterActiveInstanceBlur && null !== focusedInstanceHandle && ((8 & nextEffect.flags) != 0 ? doesFiberContain(nextEffect, focusedInstanceHandle) && (shouldFireAfterActiveInstanceBlur = !0) : 13 === nextEffect.tag && // It returns false if the boundary is already hidden.
            // TODO: Use an effect tag.
            function(current, finishedWork) {
                if (null !== current) {
                    var oldState = current.memoizedState;
                    if (null === oldState || null !== oldState.dehydrated) {
                        var newState = finishedWork.memoizedState;
                        return null !== newState && null === newState.dehydrated;
                    }
                }
                return !1;
            }(current, nextEffect) && doesFiberContain(nextEffect, focusedInstanceHandle) && (shouldFireAfterActiveInstanceBlur = !0));
            var flags = nextEffect.flags;
            (256 & flags) != 0 && (setCurrentFiber(nextEffect), function(current, finishedWork) {
                switch(finishedWork.tag){
                    case 0:
                    case 11:
                    case 15:
                    case 22:
                    case 5:
                    case 6:
                    case 4:
                    case 17:
                        return;
                    case 1:
                        if (256 & finishedWork.flags && null !== current) {
                            var prevProps = current.memoizedProps, prevState = current.memoizedState, instance = finishedWork.stateNode;
                            finishedWork.type !== finishedWork.elementType || didWarnAboutReassigningProps || (instance.props !== finishedWork.memoizedProps && error("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentName(finishedWork.type) || "instance"), instance.state !== finishedWork.memoizedState && error("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentName(finishedWork.type) || "instance"));
                            var snapshot = instance.getSnapshotBeforeUpdate(finishedWork.elementType === finishedWork.type ? prevProps : resolveDefaultProps(finishedWork.type, prevProps), prevState), didWarnSet = didWarnAboutUndefinedSnapshotBeforeUpdate;
                            void 0 !== snapshot || didWarnSet.has(finishedWork.type) || (didWarnSet.add(finishedWork.type), error("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", getComponentName(finishedWork.type))), instance.__reactInternalSnapshotBeforeUpdate = snapshot;
                        }
                        return;
                    case 3:
                        256 & finishedWork.flags && clearContainer(finishedWork.stateNode.containerInfo);
                        return;
                }
                throw Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
            }(current, nextEffect), resetCurrentFiber()), (/*                      */ 512 & flags) == 0 || rootDoesHavePassiveEffects || (rootDoesHavePassiveEffects = !0, scheduleCallback(97, function() {
                return flushPassiveEffects(), null;
            })), nextEffect = nextEffect.nextEffect;
        }
    }
    function commitMutationEffects(root, renderPriorityLevel) {
        // TODO: Should probably move the bulk of this function to commitWork.
        for(; null !== nextEffect;){
            setCurrentFiber(nextEffect);
            var flags = nextEffect.flags;
            if (16 & flags && setTextContent(nextEffect.stateNode, ""), 128 & flags) {
                var current = nextEffect.alternate;
                null !== current && function(current) {
                    var currentRef = current.ref;
                    null !== currentRef && ("function" == typeof currentRef ? currentRef(null) : currentRef.current = null);
                } // User-originating errors (lifecycles and refs) should not interrupt
                (current);
            } // The following switch statement is only concerned about placement,
            switch(1038 & flags){
                case 2:
                    commitPlacement(nextEffect), // inserted, before any life-cycles like componentDidMount gets called.
                    // TODO: findDOMNode doesn't rely on this any more but isMounted does
                    // and isMounted is deprecated anyway so we should be able to kill this.
                    nextEffect.flags &= -3;
                    break;
                case /*           */ 6:
                    // Placement
                    commitPlacement(nextEffect), // inserted, before any life-cycles like componentDidMount gets called.
                    nextEffect.flags &= -3, commitWork(nextEffect.alternate, nextEffect);
                    break;
                case 1024:
                    nextEffect.flags &= -1025;
                    break;
                case /*           */ 1028:
                    nextEffect.flags &= -1025, commitWork(nextEffect.alternate, nextEffect);
                    break;
                case 4:
                    commitWork(nextEffect.alternate, nextEffect);
                    break;
                case 8:
                    !function(finishedRoot, current, renderPriorityLevel) {
                        // Recursively delete all host nodes from the parent.
                        // Detach refs and call componentWillUnmount() on the whole subtree.
                        unmountHostComponents(finishedRoot, current);
                        var alternate = current.alternate;
                        detachFiberMutation(current), null !== alternate && detachFiberMutation(alternate);
                    }(root, nextEffect);
            }
            resetCurrentFiber(), nextEffect = nextEffect.nextEffect;
        }
    }
    function commitLayoutEffects(root, committedLanes) {
        for(; null !== nextEffect;){
            setCurrentFiber(nextEffect);
            var flags = nextEffect.flags;
            36 & flags && function(finishedRoot, current, finishedWork, committedLanes) {
                switch(finishedWork.tag){
                    case 0:
                    case 11:
                    case 15:
                    case 22:
                        (function(tag, finishedWork) {
                            var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
                            if (null !== lastEffect) {
                                var firstEffect = lastEffect.next, effect = firstEffect;
                                do {
                                    if ((3 & effect.tag) === tag) {
                                        // Mount
                                        var create = effect.create;
                                        effect.destroy = create();
                                        var destroy = effect.destroy;
                                        if (void 0 !== destroy && "function" != typeof destroy) {
                                            var addendum = void 0;
                                            error("An effect function must not return anything besides a function, which is used for clean-up.%s", null === destroy ? " You returned null. If your effect does not require clean up, return undefined (or nothing)." : "function" == typeof destroy.then ? "\n\nIt looks like you wrote useEffect(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:\n\nuseEffect(() => {\n  async function fetchData() {\n    // You can await here\n    const response = await MyAPI.getData(someId);\n    // ...\n  }\n  fetchData();\n}, [someId]); // Or [] if effect doesn't need props or state\n\nLearn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching" : " You returned: " + destroy);
                                        }
                                    }
                                    effect = effect.next;
                                }while (effect !== firstEffect)
                            }
                        })(3, finishedWork), function(finishedWork) {
                            var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
                            if (null !== lastEffect) {
                                var firstEffect = lastEffect.next, effect = firstEffect;
                                do {
                                    var fiber, effect1, _effect = effect, next = _effect.next, tag = _effect.tag;
                                    (4 & tag) != 0 && (1 & tag) != 0 && (enqueuePendingPassiveHookEffectUnmount(finishedWork, effect), fiber = finishedWork, effect1 = effect, pendingPassiveHookEffectsMount.push(effect1, fiber), rootDoesHavePassiveEffects || (rootDoesHavePassiveEffects = !0, scheduleCallback(97, function() {
                                        return flushPassiveEffects(), null;
                                    }))), effect = next;
                                }while (effect !== firstEffect)
                            }
                        }(finishedWork);
                        return;
                    case 1:
                        var instance = finishedWork.stateNode;
                        if (4 & finishedWork.flags) {
                            if (null === current) finishedWork.type !== finishedWork.elementType || didWarnAboutReassigningProps || (instance.props !== finishedWork.memoizedProps && error("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentName(finishedWork.type) || "instance"), instance.state !== finishedWork.memoizedState && error("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentName(finishedWork.type) || "instance")), instance.componentDidMount();
                            else {
                                var prevProps = finishedWork.elementType === finishedWork.type ? current.memoizedProps : resolveDefaultProps(finishedWork.type, current.memoizedProps), prevState = current.memoizedState;
                                finishedWork.type !== finishedWork.elementType || didWarnAboutReassigningProps || (instance.props !== finishedWork.memoizedProps && error("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentName(finishedWork.type) || "instance"), instance.state !== finishedWork.memoizedState && error("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentName(finishedWork.type) || "instance")), instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
                            }
                        } // TODO: I think this is now always non-null by the time it reaches the
                        // commit phase. Consider removing the type check.
                        var updateQueue = finishedWork.updateQueue;
                        null !== updateQueue && (finishedWork.type !== finishedWork.elementType || didWarnAboutReassigningProps || (instance.props !== finishedWork.memoizedProps && error("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentName(finishedWork.type) || "instance"), instance.state !== finishedWork.memoizedState && error("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentName(finishedWork.type) || "instance")), // but instead we rely on them being set during last render.
                        // TODO: revisit this when we implement resuming.
                        commitUpdateQueue(finishedWork, updateQueue, instance));
                        return;
                    case 3:
                        // TODO: I think this is now always non-null by the time it reaches the
                        // commit phase. Consider removing the type check.
                        var _updateQueue = finishedWork.updateQueue;
                        if (null !== _updateQueue) {
                            var _instance = null;
                            if (null !== finishedWork.child) switch(finishedWork.child.tag){
                                case 5:
                                case 1:
                                    _instance = finishedWork.child.stateNode;
                            }
                            commitUpdateQueue(finishedWork, _updateQueue, _instance);
                        }
                        return;
                    case 5:
                        var _instance2 = finishedWork.stateNode; // Renderers may schedule work to be done after host components are mounted
                        // (eg DOM renderer may schedule auto-focus for inputs and form controls).
                        // These effects should only be committed when components are first mounted,
                        // aka when there is no current/alternate.
                        if (null === current && 4 & finishedWork.flags) shouldAutoFocusHostComponent(finishedWork.type, finishedWork.memoizedProps) && _instance2.focus();
                        return;
                    case 6:
                    case 4:
                    case 19:
                    case 17:
                    case 20:
                    case 21:
                    case 23:
                    case 24:
                        // We have no life-cycles associated with text.
                        return;
                    case 12:
                        var _finishedWork$memoize2 = finishedWork.memoizedProps, onRender = (_finishedWork$memoize2.onCommit, _finishedWork$memoize2.onRender);
                        finishedWork.stateNode.effectDuration;
                        var commitTime1 = commitTime;
                        "function" == typeof onRender && onRender(finishedWork.memoizedProps.id, null === current ? "mount" : "update", finishedWork.actualDuration, finishedWork.treeBaseDuration, finishedWork.actualStartTime, commitTime1, finishedRoot.memoizedInteractions);
                        return;
                    case 13:
                        (function(finishedRoot, finishedWork) {
                            if (null === finishedWork.memoizedState) {
                                var current = finishedWork.alternate;
                                if (null !== current) {
                                    var prevState = current.memoizedState;
                                    if (null !== prevState) {
                                        var suspenseInstance = prevState.dehydrated;
                                        null !== suspenseInstance && // Retry if any event replaying was blocked on this.
                                        retryIfBlockedOn(suspenseInstance);
                                    }
                                }
                            }
                        })(0, finishedWork);
                        return;
                }
                throw Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
            }(root, nextEffect.alternate, nextEffect), 128 & flags && function(finishedWork) {
                var ref = finishedWork.ref;
                if (null !== ref) {
                    var instanceToUse, instance = finishedWork.stateNode;
                    finishedWork.tag, instanceToUse = instance, "function" == typeof ref ? ref(instanceToUse) : (ref.hasOwnProperty("current") || error("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", getComponentName(finishedWork.type)), ref.current = instanceToUse);
                }
            }(nextEffect), resetCurrentFiber(), nextEffect = nextEffect.nextEffect;
        }
    }
    function flushPassiveEffects() {
        // Returns whether passive effects were flushed.
        if (90 !== pendingPassiveEffectsRenderPriority) {
            var priorityLevel = pendingPassiveEffectsRenderPriority > 97 ? 97 : pendingPassiveEffectsRenderPriority;
            return pendingPassiveEffectsRenderPriority = 90, runWithPriority$1(priorityLevel, flushPassiveEffectsImpl);
        }
        return !1;
    }
    function enqueuePendingPassiveHookEffectUnmount(fiber, effect) {
        pendingPassiveHookEffectsUnmount.push(effect, fiber), fiber.flags |= 8192;
        var alternate = fiber.alternate;
        null !== alternate && (alternate.flags |= 8192), rootDoesHavePassiveEffects || (rootDoesHavePassiveEffects = !0, scheduleCallback(97, function() {
            return flushPassiveEffects(), null;
        }));
    }
    function invokePassiveEffectCreate(effect) {
        var create = effect.create;
        effect.destroy = create();
    }
    function flushPassiveEffectsImpl() {
        if (null === rootWithPendingPassiveEffects) return !1;
        var root = rootWithPendingPassiveEffects, lanes = pendingPassiveEffectsLanes;
        if (rootWithPendingPassiveEffects = null, pendingPassiveEffectsLanes = 0, (48 & executionContext) != 0) throw Error("Cannot flush passive effects while already rendering.");
        isFlushingPassiveEffects = !0;
        var prevExecutionContext = executionContext;
        executionContext |= 32;
        var prevInteractions = pushInteractions(root), unmountEffects = pendingPassiveHookEffectsUnmount; // It's important that ALL pending passive effect destroy functions are called
        pendingPassiveHookEffectsUnmount = [];
        for(var i = 0; i < unmountEffects.length; i += 2){
            var _effect = unmountEffects[i], fiber = unmountEffects[i + 1], destroy = _effect.destroy;
            _effect.destroy = void 0, fiber.flags &= -8193;
            var alternate = fiber.alternate;
            if (null !== alternate && (alternate.flags &= -8193), "function" == typeof destroy) {
                if (setCurrentFiber(fiber), invokeGuardedCallback(null, destroy, null), hasError) {
                    if (!(null !== fiber)) throw Error("Should be working on an effect.");
                    captureCommitPhaseError(fiber, clearCaughtError());
                }
                resetCurrentFiber();
            }
        } // Second pass: Create new passive effects.
        var mountEffects = pendingPassiveHookEffectsMount;
        pendingPassiveHookEffectsMount = [];
        for(var _i = 0; _i < mountEffects.length; _i += 2){
            var _effect2 = mountEffects[_i], _fiber = mountEffects[_i + 1];
            if (setCurrentFiber(_fiber), invokeGuardedCallback(null, invokePassiveEffectCreate, null, _effect2), hasError) {
                if (!(null !== _fiber)) throw Error("Should be working on an effect.");
                captureCommitPhaseError(_fiber, clearCaughtError());
            }
            resetCurrentFiber();
        } // Note: This currently assumes there are no passive effects on the root fiber
        for(// because the root is not part of its own effect list.
        // This could change in the future.
        var effect = root.current.firstEffect; null !== effect;){
            var nextNextEffect = effect.nextEffect; // Remove nextEffect pointer to assist GC
            effect.nextEffect = null, 8 & effect.flags && detachFiberAfterEffects(effect), effect = nextNextEffect;
        }
        return popInteractions(prevInteractions), finishPendingInteractions(root, lanes), isFlushingPassiveEffects = !1, executionContext = prevExecutionContext, flushSyncCallbackQueue(), // exceeds the limit, we'll fire a warning.
        nestedPassiveUpdateCount = null === rootWithPendingPassiveEffects ? 0 : nestedPassiveUpdateCount + 1, !0;
    }
    function isAlreadyFailedLegacyErrorBoundary(instance) {
        return null !== legacyErrorBoundariesThatAlreadyFailed && legacyErrorBoundariesThatAlreadyFailed.has(instance);
    }
    var onUncaughtError = function(error) {
        hasUncaughtError || (hasUncaughtError = !0, firstUncaughtError = error);
    };
    function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
        var update = createRootErrorUpdate(rootFiber, createCapturedValue(error, sourceFiber), 1);
        enqueueUpdate(rootFiber, update);
        var eventTime = requestEventTime(), root = markUpdateLaneFromFiberToRoot(rootFiber, 1);
        null !== root && (markRootUpdated(root, 1, eventTime), ensureRootIsScheduled(root, eventTime), schedulePendingInteractions(root, 1));
    }
    function captureCommitPhaseError(sourceFiber, error) {
        if (3 === sourceFiber.tag) {
            // Error was thrown at the root. There is no parent, so the root
            // itself should capture it.
            captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
            return;
        }
        for(var fiber = sourceFiber.return; null !== fiber;){
            if (3 === fiber.tag) {
                captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
                return;
            }
            if (1 === fiber.tag) {
                var ctor = fiber.type, instance = fiber.stateNode;
                if ("function" == typeof ctor.getDerivedStateFromError || "function" == typeof instance.componentDidCatch && !isAlreadyFailedLegacyErrorBoundary(instance)) {
                    var errorInfo = createCapturedValue(error, sourceFiber), update = createClassErrorUpdate(fiber, errorInfo, 1);
                    enqueueUpdate(fiber, update);
                    var eventTime = requestEventTime(), root = markUpdateLaneFromFiberToRoot(fiber, 1);
                    if (null !== root) markRootUpdated(root, 1, eventTime), ensureRootIsScheduled(root, eventTime), schedulePendingInteractions(root, 1);
                    else // This component has already been unmounted.
                    // We can't schedule any follow up work for the root because the fiber is already unmounted,
                    // but we can still call the log-only boundary so the error isn't swallowed.
                    //
                    // TODO This is only a temporary bandaid for the old reconciler fork.
                    // We can delete this special case once the new fork is merged.
                    if ("function" == typeof instance.componentDidCatch && !isAlreadyFailedLegacyErrorBoundary(instance)) try {
                        instance.componentDidCatch(error, errorInfo);
                    } catch (errorToIgnore) {
                    // TODO Ignore this error? Rethrow it?
                    // This is kind of an edge case.
                    }
                    return;
                }
            }
            fiber = fiber.return;
        }
    }
    function pingSuspendedRoot(root, wakeable, pingedLanes) {
        var pingCache = root.pingCache;
        null !== pingCache && // The wakeable resolved, so we no longer need to memoize, because it will
        // never be thrown again.
        pingCache.delete(wakeable);
        var eventTime = requestEventTime();
        markRootPinged(root, pingedLanes), workInProgressRoot === root && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && includesOnlyRetries(workInProgressRootRenderLanes) && now() - globalMostRecentFallbackTime < 500 ? // Restart from the root.
        prepareFreshStack(root, 0) : // Even though we can't restart right now, we might get an
        // opportunity later. So we mark this render as having a ping.
        workInProgressRootPingedLanes |= pingedLanes), ensureRootIsScheduled(root, eventTime), schedulePendingInteractions(root, pingedLanes);
    }
    function resolveRetryWakeable(boundaryFiber, wakeable) {
        var retryCache, retryLane, eventTime, root, lane, mode;
        null !== (retryCache = boundaryFiber.stateNode) && // The wakeable resolved, so we no longer need to memoize, because it will
        // never be thrown again.
        retryCache.delete(wakeable), 0 == (retryLane = 0) && (retryLane = (2 & (mode = boundaryFiber.mode)) == 0 ? 1 : (4 & mode) == 0 ? 99 === getCurrentPriorityLevel() ? 1 : 2 : (0 === currentEventWipLanes && (currentEventWipLanes = workInProgressRootIncludedLanes), 0 === (lane = pickArbitraryLane(62914560 & ~currentEventWipLanes)) && (lane = pickArbitraryLane(62914560)), lane) // See `requestUpdateLane` for explanation of `currentEventWipLanes`
        ), eventTime = requestEventTime(), null !== (root = markUpdateLaneFromFiberToRoot(boundaryFiber, retryLane)) && (markRootUpdated(root, retryLane, eventTime), ensureRootIsScheduled(root, eventTime), schedulePendingInteractions(root, retryLane));
    } // Computes the next Just Noticeable Difference (JND) boundary.
    var didWarnStateUpdateForNotYetMountedComponent = null;
    function warnAboutUpdateOnNotYetMountedFiberInDEV(fiber) {
        if ((16 & executionContext) == 0 && 6 & fiber.mode) {
            var tag = fiber.tag;
            if (2 === tag || 3 === tag || 1 === tag || 0 === tag || 11 === tag || 14 === tag || 15 === tag || 22 === tag) {
                // the problematic code almost always lies inside that component.
                var componentName = getComponentName(fiber.type) || "ReactComponent";
                if (null !== didWarnStateUpdateForNotYetMountedComponent) {
                    if (didWarnStateUpdateForNotYetMountedComponent.has(componentName)) return;
                    didWarnStateUpdateForNotYetMountedComponent.add(componentName);
                } else didWarnStateUpdateForNotYetMountedComponent = new Set([
                    componentName
                ]);
                var previousFiber = current;
                try {
                    setCurrentFiber(fiber), error("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
                } finally{
                    previousFiber ? setCurrentFiber(fiber) : resetCurrentFiber();
                }
            } // We show the whole stack but dedupe on the top component's name because
        }
    }
    var didWarnStateUpdateForUnmountedComponent = null;
    beginWork$1 = function(current, unitOfWork, lanes) {
        // If a component throws an error, we replay it again in a synchronously
        // dispatched event, so that the debugger will treat it as an uncaught
        // error See ReactErrorUtils for more information.
        // Before entering the begin phase, copy the work-in-progress onto a dummy
        // fiber. If beginWork throws, we'll use this to reset the state.
        var originalWorkInProgressCopy = assignFiberPropertiesInDEV(null, unitOfWork);
        try {
            return beginWork(current, unitOfWork, lanes);
        } catch (originalError) {
            if (null !== originalError && "object" == typeof originalError && "function" == typeof originalError.then) // Don't replay promises. Treat everything else like an error.
            throw originalError;
             // Keep this code in sync with handleError; any changes here must have
            if (// corresponding changes there.
            resetContextDependencies(), resetHooksAfterThrow(), // same fiber again.
            // Unwind the failed stack frame
            unwindInterruptedWork(unitOfWork), assignFiberPropertiesInDEV(unitOfWork, originalWorkInProgressCopy), 8 & unitOfWork.mode && // Reset the profiler timer.
            startProfilerTimer(unitOfWork), invokeGuardedCallback(null, beginWork, null, current, unitOfWork, lanes), hasError) // Rethrow this error instead of the original one.
            throw clearCaughtError();
            // This branch is reachable if the render phase is impure.
            throw originalError;
        }
    };
    var didWarnAboutUpdateInRender = !1;
    didWarnAboutUpdateInRenderForAnotherComponent = new Set();
    var IsThisRendererActing = {
        current: !1
    };
    function warnIfNotScopedWithMatchingAct(fiber) {
        if (!0 === IsSomeRendererActing.current && !0 !== IsThisRendererActing.current) {
            var previousFiber = current;
            try {
                setCurrentFiber(fiber), error("It looks like you're using the wrong act() around your test interactions.\nBe sure to use the matching version of act() corresponding to your renderer:\n\n// for react-dom:\nimport {act} from 'react-dom/test-utils';\n// ...\nact(() => ...);\n\n// for react-test-renderer:\nimport TestRenderer from react-test-renderer';\nconst {act} = TestRenderer;\n// ...\nact(() => ...);");
            } finally{
                previousFiber ? setCurrentFiber(fiber) : resetCurrentFiber();
            }
        }
    }
    function warnIfNotCurrentlyActingEffectsInDEV(fiber) {
        (1 & fiber.mode) != 0 && !1 === IsSomeRendererActing.current && !1 === IsThisRendererActing.current && error("An update to %s ran an effect, but was not wrapped in act(...).\n\nWhen testing, code that causes React state updates should be wrapped into act(...):\n\nact(() => {\n  /* fire events that update state */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act", getComponentName(fiber.type));
    }
    var warnIfNotCurrentlyActingUpdatesInDev = function(fiber) {
        if (0 === executionContext && !1 === IsSomeRendererActing.current && !1 === IsThisRendererActing.current) {
            var previousFiber = current;
            try {
                setCurrentFiber(fiber), error("An update to %s inside a test was not wrapped in act(...).\n\nWhen testing, code that causes React state updates should be wrapped into act(...):\n\nact(() => {\n  /* fire events that update state */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act", getComponentName(fiber.type));
            } finally{
                previousFiber ? setCurrentFiber(fiber) : resetCurrentFiber();
            }
        }
    }, didWarnAboutUnmockedScheduler = !1; // In tests, we want to enforce a mocked scheduler.
    function computeThreadID(root, lane) {
        // Interaction threads are unique per root and expiration time.
        // NOTE: Intentionally unsound cast. All that matters is that it's a number
        // and it represents a batch of work. Could make a helper function instead,
        // but meh this is fine for now.
        return 1000 * lane + root.interactionThreadID;
    }
    function markSpawnedWork(lane) {
        null === spawnedWorkDuringRender ? spawnedWorkDuringRender = [
            lane
        ] : spawnedWorkDuringRender.push(lane);
    }
    function scheduleInteractions(root, lane, interactions) {
        if (interactions.size > 0) {
            var pendingInteractionMap = root.pendingInteractionMap, pendingInteractions = pendingInteractionMap.get(lane);
            null != pendingInteractions ? interactions.forEach(function(interaction) {
                !pendingInteractions.has(interaction) && // Update the pending async work count for previously unscheduled interaction.
                interaction.__count++, pendingInteractions.add(interaction);
            }) : (pendingInteractionMap.set(lane, new Set(interactions)), interactions.forEach(function(interaction) {
                interaction.__count++;
            }));
            var subscriber = __subscriberRef.current;
            if (null !== subscriber) {
                var threadID = computeThreadID(root, lane);
                subscriber.onWorkScheduled(interactions, threadID);
            }
        }
    }
    function schedulePendingInteractions(root, lane) {
        scheduleInteractions(root, lane, __interactionsRef.current);
    }
    function startWorkOnPendingInteractions(root, lanes) {
        // we can accurately attribute time spent working on it, And so that cascading
        // work triggered during the render phase will be associated with it.
        var interactions = new Set();
        if (root.pendingInteractionMap.forEach(function(scheduledInteractions, scheduledLane) {
            (lanes & scheduledLane) != 0 && scheduledInteractions.forEach(function(interaction) {
                return interactions.add(interaction);
            });
        }), // We can re-use it in hot functions like performConcurrentWorkOnRoot()
        // without having to recalculate it. We will also use it in commitWork() to
        // pass to any Profiler onRender() hooks. This also provides DevTools with a
        // way to access it when the onCommitRoot() hook is called.
        root.memoizedInteractions = interactions, interactions.size > 0) {
            var subscriber = __subscriberRef.current;
            if (null !== subscriber) {
                var threadID = computeThreadID(root, lanes);
                try {
                    subscriber.onWorkStarted(interactions, threadID);
                } catch (error) {
                    // If the subscriber throws, rethrow it in a separate task
                    scheduleCallback(99, function() {
                        throw error;
                    });
                }
            }
        }
    }
    function finishPendingInteractions(root, committedLanes) {
        var subscriber, remainingLanesAfterCommit = root.pendingLanes;
        try {
            if (subscriber = __subscriberRef.current, null !== subscriber && root.memoizedInteractions.size > 0) {
                // FIXME: More than one lane can finish in a single commit.
                var threadID = computeThreadID(root, committedLanes);
                subscriber.onWorkStopped(root.memoizedInteractions, threadID);
            }
        } catch (error) {
            // If the subscriber throws, rethrow it in a separate task
            scheduleCallback(99, function() {
                throw error;
            });
        } finally{
            // Clear completed interactions from the pending Map.
            // Unless the render was suspended or cascading work was scheduled,
            // In which case– leave pending interactions until the subsequent render.
            var pendingInteractionMap = root.pendingInteractionMap;
            pendingInteractionMap.forEach(function(scheduledInteractions, lane) {
                // Only decrement the pending interaction count if we're done.
                // If there's still work at the current priority,
                // That indicates that we are waiting for suspense data.
                (remainingLanesAfterCommit & lane) != 0 || (pendingInteractionMap.delete(lane), scheduledInteractions.forEach(function(interaction) {
                    if (interaction.__count--, null !== subscriber && 0 === interaction.__count) try {
                        subscriber.onInteractionScheduledWorkCompleted(interaction);
                    } catch (error) {
                        // If the subscriber throws, rethrow it in a separate task
                        scheduleCallback(99, function() {
                            throw error;
                        });
                    }
                }));
            });
        }
    } // `act` testing API
    function shouldForceFlushFallbacksInDEV() {
        return actingUpdatesScopeDepth > 0;
    }
    // so we can tell if any async act() calls try to run in parallel.
    var actingUpdatesScopeDepth = 0;
    function detachFiberAfterEffects(fiber) {
        fiber.sibling = null, fiber.stateNode = null;
    }
    var resolveFamily = null, failedBoundaries = null; // $FlowFixMe Flow gets confused by a WeakSet feature check below.
    function resolveFunctionForHotReloading(type) {
        if (null === resolveFamily) // Hot reloading is disabled.
        return type;
        var family = resolveFamily(type);
        return void 0 === family ? type : family.current // Use the latest known implementation.
        ;
    }
    function resolveForwardRefForHotReloading(type) {
        if (null === resolveFamily) // Hot reloading is disabled.
        return type;
        var family = resolveFamily(type);
        if (void 0 === family) {
            // Check if we're dealing with a real forwardRef. Don't want to crash early.
            if (null != type && "function" == typeof type.render) {
                // ForwardRef is special because its resolved .type is an object,
                // but it's possible that we only have its inner render function in the map.
                // If that inner render function is different, we'll build a new forwardRef type.
                var currentRender = resolveFunctionForHotReloading(type.render);
                if (type.render !== currentRender) {
                    var syntheticType = {
                        $$typeof: REACT_FORWARD_REF_TYPE,
                        render: currentRender
                    };
                    return void 0 !== type.displayName && (syntheticType.displayName = type.displayName), syntheticType;
                }
            }
            return type;
        } // Use the latest known implementation.
        return family.current;
    }
    function isCompatibleFamilyForHotReloading(fiber, element) {
        if (null === resolveFamily) // Hot reloading is disabled.
        return !1;
        var prevType = fiber.elementType, nextType = element.type, needsCompareFamilies = !1, $$typeofNextType = "object" == typeof nextType && null !== nextType ? nextType.$$typeof : null;
        switch(fiber.tag){
            case 1:
                "function" == typeof nextType && (needsCompareFamilies = !0);
                break;
            case 0:
                "function" == typeof nextType ? needsCompareFamilies = !0 : $$typeofNextType === REACT_LAZY_TYPE && // We don't know the inner type yet.
                // We're going to assume that the lazy inner type is stable,
                // and so it is sufficient to avoid reconciling it away.
                // We're not going to unwrap or actually use the new lazy type.
                (needsCompareFamilies = !0);
                break;
            case 11:
                $$typeofNextType === REACT_FORWARD_REF_TYPE ? needsCompareFamilies = !0 : $$typeofNextType === REACT_LAZY_TYPE && (needsCompareFamilies = !0);
                break;
            case 14:
            case 15:
                $$typeofNextType === REACT_MEMO_TYPE ? // TODO: if it was but can no longer be simple,
                // we shouldn't set this.
                needsCompareFamilies = !0 : $$typeofNextType === REACT_LAZY_TYPE && (needsCompareFamilies = !0);
                break;
            default:
                return !1;
        } // Check if both types have a family and it's the same one.
        if (needsCompareFamilies) {
            // Note: memo() and forwardRef() we'll compare outer rather than inner type.
            // This means both of them need to be registered to preserve state.
            // If we unwrapped and compared the inner types for wrappers instead,
            // then we would risk falsely saying two separate memo(Foo)
            // calls are equivalent because they wrap the same Foo function.
            var prevFamily = resolveFamily(prevType);
            if (void 0 !== prevFamily && prevFamily === resolveFamily(nextType)) return !0;
        }
        return !1;
    }
    function markFailedErrorBoundaryForHotReloading(fiber) {
        null !== resolveFamily && "function" == typeof WeakSet && (null === failedBoundaries && (failedBoundaries = new WeakSet()), failedBoundaries.add(fiber));
    }
    hasBadMapPolyfill = !1;
    try {
        Object.preventExtensions({});
    /* eslint-enable no-new */ } catch (e) {
        // TODO: Consider warning about bad polyfills
        hasBadMapPolyfill = !0;
    }
    var debugCounter = 1;
    function FiberNode(tag, pendingProps, key, mode) {
        // Instance
        this.tag = tag, this.key = key, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = pendingProps, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = mode, this.flags = 0, this.nextEffect = null, this.firstEffect = null, this.lastEffect = null, this.lanes = 0, this.childLanes = 0, this.alternate = null, // Note: The following is done to avoid a v8 performance cliff.
        //
        // Initializing the fields below to smis and later updating them with
        // double values will cause Fibers to end up having separate shapes.
        // This behavior/bug has something to do with Object.preventExtension().
        // Fortunately this only impacts DEV builds.
        // Unfortunately it makes React unusably slow for some applications.
        // To work around this, initialize the fields below with doubles.
        //
        // Learn more about this here:
        // https://github.com/facebook/react/issues/14365
        // https://bugs.chromium.org/p/v8/issues/detail?id=8538
        this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, // This won't trigger the performance cliff mentioned above,
        // and it simplifies other profiler code (including DevTools).
        this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, // This isn't directly used but is handy for debugging internals:
        this._debugID = debugCounter++, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, hasBadMapPolyfill || "function" != typeof Object.preventExtensions || Object.preventExtensions(this);
    } // This is a constructor function, rather than a POJO constructor, still
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
    var createFiber = function(tag, pendingProps, key, mode) {
        // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
        return new FiberNode(tag, pendingProps, key, mode);
    };
    function shouldConstruct$1(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
    }
    function createWorkInProgress(current, pendingProps) {
        var workInProgress = current.alternate;
        null === workInProgress ? (// We use a double buffering pooling technique because we know that we'll
        // only ever need at most two versions of a tree. We pool the "other" unused
        // node that we're free to reuse. This is lazily created to avoid allocating
        // extra objects for things that are never updated. It also allow us to
        // reclaim the extra memory if needed.
        (workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode)).elementType = current.elementType, workInProgress.type = current.type, workInProgress.stateNode = current.stateNode, // DEV-only fields
        workInProgress._debugID = current._debugID, workInProgress._debugSource = current._debugSource, workInProgress._debugOwner = current._debugOwner, workInProgress._debugHookTypes = current._debugHookTypes, workInProgress.alternate = current, current.alternate = workInProgress) : (workInProgress.pendingProps = pendingProps, workInProgress.type = current.type, // Reset the effect tag.
        workInProgress.flags = 0, workInProgress.nextEffect = null, workInProgress.firstEffect = null, workInProgress.lastEffect = null, // We intentionally reset, rather than copy, actualDuration & actualStartTime.
        // This prevents time from endlessly accumulating in new commits.
        // This has the downside of resetting values for different priority renders,
        // But works for yielding (the common case) and should support resuming.
        workInProgress.actualDuration = 0, workInProgress.actualStartTime = -1), workInProgress.childLanes = current.childLanes, workInProgress.lanes = current.lanes, workInProgress.child = current.child, workInProgress.memoizedProps = current.memoizedProps, workInProgress.memoizedState = current.memoizedState, workInProgress.updateQueue = current.updateQueue;
        // it cannot be shared with the current fiber.
        var currentDependencies = current.dependencies;
        switch(workInProgress.dependencies = null === currentDependencies ? null : {
            lanes: currentDependencies.lanes,
            firstContext: currentDependencies.firstContext
        }, workInProgress.sibling = current.sibling, workInProgress.index = current.index, workInProgress.ref = current.ref, workInProgress.selfBaseDuration = current.selfBaseDuration, workInProgress.treeBaseDuration = current.treeBaseDuration, workInProgress._debugNeedsRemount = current._debugNeedsRemount, workInProgress.tag){
            case 2:
            case 0:
            case 15:
            case 1:
                workInProgress.type = resolveFunctionForHotReloading(current.type);
                break;
            case 11:
                workInProgress.type = resolveForwardRefForHotReloading(current.type);
        }
        return workInProgress;
    } // Used to reuse a Fiber for a second pass.
    function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
        var pendingProps1, mode1, lanes1, key1, fiber, pendingProps2, mode2, lanes2, fiber1, pendingProps3, mode3, lanes3, fiber2, pendingProps4, mode4, lanes4, fiber3, fiberTag = 2, resolvedType = type; // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
        if ("function" == typeof type) shouldConstruct$1(type) && (fiberTag = 1), resolvedType = resolveFunctionForHotReloading(resolvedType);
        else if ("string" == typeof type) fiberTag = 5;
        else getTag: switch(type){
            case REACT_FRAGMENT_TYPE:
                return createFiberFromFragment(pendingProps.children, mode, lanes, key);
            case REACT_DEBUG_TRACING_MODE_TYPE:
                fiberTag = 8, mode |= 16;
                break;
            case REACT_STRICT_MODE_TYPE:
                fiberTag = 8, mode |= 1;
                break;
            case REACT_PROFILER_TYPE:
                return pendingProps1 = pendingProps, mode1 = mode, lanes1 = lanes, key1 = key, "string" != typeof pendingProps1.id && error('Profiler must specify an "id" as a prop'), (fiber = createFiber(12, pendingProps1, key1, 8 | mode1)).elementType = REACT_PROFILER_TYPE, fiber.type = REACT_PROFILER_TYPE, fiber.lanes = lanes1, fiber.stateNode = {
                    effectDuration: 0,
                    passiveEffectDuration: 0
                }, fiber;
            case REACT_SUSPENSE_TYPE:
                return pendingProps2 = pendingProps, mode2 = mode, lanes2 = lanes, // This needs to be fixed in getComponentName so that it relies on the tag
                // instead.
                (fiber1 = createFiber(13, pendingProps2, key, mode2)).type = REACT_SUSPENSE_TYPE, fiber1.elementType = REACT_SUSPENSE_TYPE, fiber1.lanes = lanes2, fiber1;
            case REACT_SUSPENSE_LIST_TYPE:
                return pendingProps3 = pendingProps, mode3 = mode, lanes3 = lanes, // TODO: The SuspenseListComponent fiber shouldn't have a type. It has a tag.
                // This needs to be fixed in getComponentName so that it relies on the tag
                // instead.
                (fiber2 = createFiber(19, pendingProps3, key, mode3)).type = REACT_SUSPENSE_LIST_TYPE, fiber2.elementType = REACT_SUSPENSE_LIST_TYPE, fiber2.lanes = lanes3, fiber2;
            case REACT_OFFSCREEN_TYPE:
                return createFiberFromOffscreen(pendingProps, mode, lanes, key);
            case REACT_LEGACY_HIDDEN_TYPE:
                return pendingProps4 = pendingProps, mode4 = mode, lanes4 = lanes, (fiber3 = createFiber(24, pendingProps4, key, mode4)).type = REACT_LEGACY_HIDDEN_TYPE, fiber3.elementType = REACT_LEGACY_HIDDEN_TYPE, fiber3.lanes = lanes4, fiber3;
            default:
                if ("object" == typeof type && null !== type) switch(type.$$typeof){
                    case REACT_PROVIDER_TYPE:
                        fiberTag = 10;
                        break getTag;
                    case REACT_CONTEXT_TYPE:
                        // This is a consumer
                        fiberTag = 9;
                        break getTag;
                    case REACT_FORWARD_REF_TYPE:
                        fiberTag = 11, resolvedType = resolveForwardRefForHotReloading(resolvedType);
                        break getTag;
                    case REACT_MEMO_TYPE:
                        fiberTag = 14;
                        break getTag;
                    case REACT_LAZY_TYPE:
                        fiberTag = 16, resolvedType = null;
                        break getTag;
                    case REACT_BLOCK_TYPE:
                        fiberTag = 22;
                        break getTag;
                }
                var info = "";
                (void 0 === type || "object" == typeof type && null !== type && 0 === Object.keys(type).length) && (info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
                var ownerName = owner ? getComponentName(owner.type) : null;
                throw ownerName && (info += "\n\nCheck the render method of `" + ownerName + "`."), Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (null == type ? type : typeof type) + "." + info);
        }
        var fiber4 = createFiber(fiberTag, pendingProps, key, mode);
        return fiber4.elementType = type, fiber4.type = resolvedType, fiber4.lanes = lanes, fiber4._debugOwner = owner, fiber4;
    }
    function createFiberFromElement(element, mode, lanes) {
        var owner = null;
        owner = element._owner;
        var fiber = createFiberFromTypeAndProps(element.type, element.key, element.props, owner, mode, lanes);
        return fiber._debugSource = element._source, fiber._debugOwner = element._owner, fiber;
    }
    function createFiberFromFragment(elements, mode, lanes, key) {
        var fiber = createFiber(7, elements, key, mode);
        return fiber.lanes = lanes, fiber;
    }
    function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
        var fiber = createFiber(23, pendingProps, key, mode); // TODO: The OffscreenComponent fiber shouldn't have a type. It has a tag.
        return fiber.type = REACT_OFFSCREEN_TYPE, fiber.elementType = REACT_OFFSCREEN_TYPE, fiber.lanes = lanes, fiber;
    }
    function createFiberFromText(content, mode, lanes) {
        var fiber = createFiber(6, content, null, mode);
        return fiber.lanes = lanes, fiber;
    }
    function createFiberFromPortal(portal, mode, lanes) {
        var fiber = createFiber(4, null !== portal.children ? portal.children : [], portal.key, mode);
        return fiber.lanes = lanes, fiber.stateNode = {
            containerInfo: portal.containerInfo,
            pendingChildren: null,
            // Used by persistent updates
            implementation: portal.implementation
        }, fiber;
    } // Used for stashing WIP properties to replay failed work in DEV.
    function assignFiberPropertiesInDEV(target, source) {
        return null === target && // This Fiber's initial properties will always be overwritten.
        // We only use a Fiber to ensure the same hidden class so DEV isn't slow.
        (target = createFiber(2, null, null, 0)), // We tried to use Object.assign() instead but this is called in
        // the hottest path, and Object.assign() was too slow:
        // https://github.com/facebook/react/issues/12502
        // This code is DEV-only so size is not a concern.
        target.tag = source.tag, target.key = source.key, target.elementType = source.elementType, target.type = source.type, target.stateNode = source.stateNode, target.return = source.return, target.child = source.child, target.sibling = source.sibling, target.index = source.index, target.ref = source.ref, target.pendingProps = source.pendingProps, target.memoizedProps = source.memoizedProps, target.updateQueue = source.updateQueue, target.memoizedState = source.memoizedState, target.dependencies = source.dependencies, target.mode = source.mode, target.flags = source.flags, target.nextEffect = source.nextEffect, target.firstEffect = source.firstEffect, target.lastEffect = source.lastEffect, target.lanes = source.lanes, target.childLanes = source.childLanes, target.alternate = source.alternate, target.actualDuration = source.actualDuration, target.actualStartTime = source.actualStartTime, target.selfBaseDuration = source.selfBaseDuration, target.treeBaseDuration = source.treeBaseDuration, target._debugID = source._debugID, target._debugSource = source._debugSource, target._debugOwner = source._debugOwner, target._debugNeedsRemount = source._debugNeedsRemount, target._debugHookTypes = source._debugHookTypes, target;
    }
    function FiberRootNode(containerInfo, tag, hydrate) {
        switch(this.tag = tag, this.containerInfo = containerInfo, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = -1, this.context = null, this.pendingContext = null, this.hydrate = hydrate, this.callbackNode = null, this.callbackPriority = 0, this.eventTimes = createLaneMap(0), this.expirationTimes = createLaneMap(-1), this.pendingLanes = 0, this.suspendedLanes = 0, this.pingedLanes = 0, this.expiredLanes = 0, this.mutableReadLanes = 0, this.finishedLanes = 0, this.entangledLanes = 0, this.entanglements = createLaneMap(0), this.mutableSourceEagerHydrationData = null, this.interactionThreadID = unstable_getThreadID(), this.memoizedInteractions = new Set(), this.pendingInteractionMap = new Map(), tag){
            case 1:
                this._debugRootType = "createBlockingRoot()";
                break;
            case 2:
                this._debugRootType = "createRoot()";
                break;
            case 0:
                this._debugRootType = "createLegacyRoot()";
        }
    }
    function updateContainer(element, container, parentComponent, callback) {
        !function(root, children) {
            if (injectedHook && "function" == typeof injectedHook.onScheduleFiberRoot) try {
                injectedHook.onScheduleFiberRoot(rendererID, root, children);
            } catch (err) {
                hasLoggedError || (hasLoggedError = !0, error("React instrumentation encountered an error: %s", err));
            }
        }(container, element);
        var current$1 = container.current, eventTime = requestEventTime();
        // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
        "undefined" != typeof jest && (!1 === didWarnAboutUnmockedScheduler && void 0 === unstable_flushAllWithoutAsserting && (2 & current$1.mode || 4 & current$1.mode) && (didWarnAboutUnmockedScheduler = !0, error("In Concurrent or Sync modes, the \"scheduler\" module needs to be mocked to guarantee consistent behaviour across tests and browsers. For example, with jest: \njest.mock('scheduler', () => require('scheduler/unstable_mock'));\n\nFor more info, visit https://reactjs.org/link/mock-scheduler")), warnIfNotScopedWithMatchingAct(current$1));
        var lane = requestUpdateLane(current$1), context = function(parentComponent) {
            if (!parentComponent) return emptyContextObject;
            var fiber = get(parentComponent), parentContext = function(fiber) {
                // Currently this is only used with renderSubtreeIntoContainer; not sure if it
                // makes sense elsewhere
                if (!(getNearestMountedFiber(fiber) === fiber && 1 === fiber.tag)) throw Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
                var node = fiber;
                do {
                    switch(node.tag){
                        case 3:
                            return node.stateNode.context;
                        case 1:
                            if (isContextProvider(node.type)) return node.stateNode.__reactInternalMemoizedMergedChildContext;
                    }
                    node = node.return;
                }while (null !== node)
                throw Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
            }(fiber);
            if (1 === fiber.tag) {
                var Component = fiber.type;
                if (isContextProvider(Component)) return processChildContext(fiber, Component, parentContext);
            }
            return parentContext;
        }(parentComponent);
        null === container.context ? container.context = context : container.pendingContext = context, isRendering && null !== current && !didWarnAboutNestedUpdates && (didWarnAboutNestedUpdates = !0, error("Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.\n\nCheck the render method of %s.", getComponentName(current.type) || "Unknown"));
        var update = createUpdate(eventTime, lane); // Caution: React DevTools currently depends on this property
        return(// being called "element".
        update.payload = {
            element: element
        }, null !== (callback = void 0 === callback ? null : callback) && ("function" != typeof callback && error("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callback), update.callback = callback), enqueueUpdate(current$1, update), scheduleUpdateOnFiber(current$1, lane, eventTime), lane);
    }
    function getPublicRootInstance(container) {
        var containerFiber = container.current;
        return containerFiber.child ? (containerFiber.child.tag, containerFiber.child.stateNode) : null;
    }
    function markRetryLaneImpl(fiber, retryLane) {
        var a, suspenseState = fiber.memoizedState;
        null !== suspenseState && null !== suspenseState.dehydrated && (suspenseState.retryLane = 0 !== (a = suspenseState.retryLane) && a < retryLane ? a : retryLane);
    } // Increases the priority of thennables when they resolve within this boundary.
    function markRetryLaneIfNotHydrated(fiber, retryLane) {
        markRetryLaneImpl(fiber, retryLane);
        var alternate = fiber.alternate;
        alternate && markRetryLaneImpl(alternate, retryLane);
    }
    function findHostInstanceWithNoPortals(fiber) {
        var hostFiber = function(parent) {
            var currentParent = findCurrentFiberUsingSlowPath(parent);
            if (!currentParent) return null;
             // Next we'll drill down this component to find the first HostComponent/Text.
            for(var node = currentParent;;){
                if (5 === node.tag || 6 === node.tag) return node;
                if (node.child && 4 !== node.tag) {
                    node.child.return = node, node = node.child;
                    continue;
                }
                if (node === currentParent) break;
                for(; !node.sibling;){
                    if (!node.return || node.return === currentParent) return null;
                    node = node.return;
                }
                node.sibling.return = node.return, node = node.sibling;
            } // Flow needs the return null here, but ESLint complains about it.
            // eslint-disable-next-line no-unreachable
            return null;
        }(fiber);
        return null === hostFiber ? null : 20 === hostFiber.tag ? hostFiber.stateNode.instance : hostFiber.stateNode;
    }
    didWarnAboutNestedUpdates = !1, didWarnAboutFindNodeInStrictMode = {};
    var shouldSuspendImpl = function(fiber) {
        return !1;
    }, overrideHookState = null, overrideHookStateDeletePath = null, overrideHookStateRenamePath = null, overrideProps = null, overridePropsDeletePath = null, overridePropsRenamePath = null, scheduleUpdate = null, setSuspenseHandler = null, copyWithDeleteImpl = function(obj, path, index) {
        var key = path[index], updated = Array.isArray(obj) ? obj.slice() : _assign({}, obj);
        return index + 1 === path.length ? Array.isArray(updated) ? updated.splice(key, 1) : delete updated[key] : updated[key] = copyWithDeleteImpl(obj[key], path, index + 1), updated;
    }, copyWithDelete = function(obj, path) {
        return copyWithDeleteImpl(obj, path, 0);
    }, copyWithRenameImpl = function(obj, oldPath, newPath, index) {
        var oldKey = oldPath[index], updated = Array.isArray(obj) ? obj.slice() : _assign({}, obj);
        return index + 1 === oldPath.length ? (updated[newPath[index]] = updated[oldKey], Array.isArray(updated) ? updated.splice(oldKey, 1) : delete updated[oldKey]) : // $FlowFixMe number or string is fine here
        updated[oldKey] = copyWithRenameImpl(// $FlowFixMe number or string is fine here
        obj[oldKey], oldPath, newPath, index + 1), updated;
    }, copyWithRename = function(obj, oldPath, newPath) {
        if (oldPath.length !== newPath.length) {
            warn("copyWithRename() expects paths of the same length");
            return;
        }
        for(var i = 0; i < newPath.length - 1; i++)if (oldPath[i] !== newPath[i]) {
            warn("copyWithRename() expects paths to be the same except for the deepest key");
            return;
        }
        return copyWithRenameImpl(obj, oldPath, newPath, 0);
    }, copyWithSetImpl = function(obj, path, index, value) {
        if (index >= path.length) return value;
        var key = path[index], updated = Array.isArray(obj) ? obj.slice() : _assign({}, obj);
        return updated[key] = copyWithSetImpl(obj[key], path, index + 1, value), updated;
    }, copyWithSet = function(obj, path, value) {
        return copyWithSetImpl(obj, path, 0, value);
    }, findHook = function(fiber, id) {
        for(// For now, the "id" of stateful hooks is just the stateful hook index.
        // This may change in the future with e.g. nested hooks.
        var currentHook = fiber.memoizedState; null !== currentHook && id > 0;)currentHook = currentHook.next, id--;
        return currentHook;
    };
    function ReactDOMRoot(container, options) {
        this._internalRoot = createRootImpl(container, 2, options);
    }
    function ReactDOMBlockingRoot(container, tag, options) {
        this._internalRoot = createRootImpl(container, tag, options);
    }
    function createRootImpl(container, tag, options) {
        // Tag is either LegacyRoot or Concurrent Root
        var root, mode, uninitializedFiber, hostRoot, hydrate = null != options && !0 === options.hydrate;
        null != options && options.hydrationOptions;
        var mutableSources = null != options && null != options.hydrationOptions && options.hydrationOptions.mutableSources || null, root1 = (root = new FiberRootNode(container, tag, hydrate), mode = 2 === tag ? 7 : 1 === tag ? 3 : 0, isDevToolsPresent && // Always collect profile timings when DevTools are present.
        // This enables DevTools to start capturing timing at any point–
        // Without some nodes in the tree having empty base times.
        (mode |= 8), uninitializedFiber = createFiber(3, null, null, mode), root.current = uninitializedFiber, uninitializedFiber.stateNode = root, initializeUpdateQueue(uninitializedFiber), root);
        if (hostRoot = root1.current, container[internalContainerInstanceKey] = hostRoot, container.nodeType, listenToAllSupportedEvents(8 === container.nodeType ? container.parentNode : container), mutableSources) for(var i = 0; i < mutableSources.length; i++)!// This ensures that the version used for server rendering matches the one
        // that is eventually read during hydration.
        // If they don't match there's a potential tear and a full deopt render is required.
        function(root, mutableSource) {
            var version = (0, mutableSource._getVersion)(mutableSource._source); // TODO Clear this data once all pending hydration work is finished.
            // Retaining it forever may interfere with GC.
            null == root.mutableSourceEagerHydrationData ? root.mutableSourceEagerHydrationData = [
                mutableSource,
                version
            ] : root.mutableSourceEagerHydrationData.push(mutableSource, version);
        }(root1, mutableSources[i]);
        return root1;
    }
    function isValidContainer(node) {
        return !!(node && (1 === node.nodeType || 9 === node.nodeType || 11 === node.nodeType || 8 === node.nodeType && " react-mount-point-unstable " === node.nodeValue));
    }
    overrideHookState = function(fiber, id, path, value) {
        var hook = findHook(fiber, id);
        if (null !== hook) {
            var newState = copyWithSet(hook.memoizedState, path, value);
            hook.memoizedState = newState, hook.baseState = newState, // because there is no update we can add for useReducer hooks that won't trigger an error.
            // (There's no appropriate action type for DevTools overrides.)
            // As a result though, React will see the scheduled update as a noop and bailout.
            // Shallow cloning props works as a workaround for now to bypass the bailout check.
            fiber.memoizedProps = _assign({}, fiber.memoizedProps), scheduleUpdateOnFiber(fiber, 1, -1);
        }
    }, overrideHookStateDeletePath = function(fiber, id, path) {
        var hook = findHook(fiber, id);
        if (null !== hook) {
            var newState = copyWithDelete(hook.memoizedState, path);
            hook.memoizedState = newState, hook.baseState = newState, // because there is no update we can add for useReducer hooks that won't trigger an error.
            // (There's no appropriate action type for DevTools overrides.)
            // As a result though, React will see the scheduled update as a noop and bailout.
            // Shallow cloning props works as a workaround for now to bypass the bailout check.
            fiber.memoizedProps = _assign({}, fiber.memoizedProps), scheduleUpdateOnFiber(fiber, 1, -1);
        }
    }, overrideHookStateRenamePath = function(fiber, id, oldPath, newPath) {
        var hook = findHook(fiber, id);
        if (null !== hook) {
            var newState = copyWithRename(hook.memoizedState, oldPath, newPath);
            hook.memoizedState = newState, hook.baseState = newState, // because there is no update we can add for useReducer hooks that won't trigger an error.
            // (There's no appropriate action type for DevTools overrides.)
            // As a result though, React will see the scheduled update as a noop and bailout.
            // Shallow cloning props works as a workaround for now to bypass the bailout check.
            fiber.memoizedProps = _assign({}, fiber.memoizedProps), scheduleUpdateOnFiber(fiber, 1, -1);
        }
    }, overrideProps = function(fiber, path, value) {
        fiber.pendingProps = copyWithSet(fiber.memoizedProps, path, value), fiber.alternate && (fiber.alternate.pendingProps = fiber.pendingProps), scheduleUpdateOnFiber(fiber, 1, -1);
    }, overridePropsDeletePath = function(fiber, path) {
        fiber.pendingProps = copyWithDelete(fiber.memoizedProps, path), fiber.alternate && (fiber.alternate.pendingProps = fiber.pendingProps), scheduleUpdateOnFiber(fiber, 1, -1);
    }, overridePropsRenamePath = function(fiber, oldPath, newPath) {
        fiber.pendingProps = copyWithRename(fiber.memoizedProps, oldPath, newPath), fiber.alternate && (fiber.alternate.pendingProps = fiber.pendingProps), scheduleUpdateOnFiber(fiber, 1, -1);
    }, scheduleUpdate = function(fiber) {
        scheduleUpdateOnFiber(fiber, 1, -1);
    }, setSuspenseHandler = function(newShouldSuspendImpl) {
        shouldSuspendImpl = newShouldSuspendImpl;
    }, ReactDOMRoot.prototype.render = ReactDOMBlockingRoot.prototype.render = function(children) {
        var root = this._internalRoot;
        "function" == typeof arguments[1] && error("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
        var container = root.containerInfo;
        if (8 !== container.nodeType) {
            var hostInstance = findHostInstanceWithNoPortals(root.current);
            hostInstance && hostInstance.parentNode !== container && error("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
        updateContainer(children, root, null, null);
    }, ReactDOMRoot.prototype.unmount = ReactDOMBlockingRoot.prototype.unmount = function() {
        "function" == typeof arguments[0] && error("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
        var root = this._internalRoot, container = root.containerInfo;
        updateContainer(null, root, null, function() {
            container[internalContainerInstanceKey] = null;
        });
    };
    var ReactCurrentOwner$3 = ReactSharedInternals.ReactCurrentOwner, warnedAboutHydrateAPI = !1;
    function getReactRootElementInContainer(container) {
        return container ? 9 === container.nodeType ? container.documentElement : container.firstChild : null;
    }
    function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
        topLevelUpdateWarnings(container), callerName = "render", null !== (callback1 = void 0 === callback ? null : callback) && "function" != typeof callback1 && error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback1);
        // member of intersection type." Whyyyyyy.
        var callback1, callerName, fiberRoot, root = container._reactRootContainer;
        if (root) {
            if (fiberRoot = root._internalRoot, "function" == typeof callback) {
                var _originalCallback = callback;
                callback = function() {
                    var instance = getPublicRootInstance(fiberRoot);
                    _originalCallback.call(instance);
                };
            } // Update
            updateContainer(children, fiberRoot, parentComponent, callback);
        } else {
            if (fiberRoot = // Initial mount
            (root = container._reactRootContainer = function(container, forceHydrate) {
                var shouldHydrate = forceHydrate || !!((rootElement = getReactRootElementInContainer(container)) && 1 === rootElement.nodeType && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)); // First clear any existing content.
                if (!shouldHydrate) for(var rootElement, rootSibling, warned = !1; rootSibling = container.lastChild;)!warned && 1 === rootSibling.nodeType && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME) && (warned = !0, error("render(): Target node has markup rendered by React, but there are unrelated nodes as well. This is most commonly caused by white-space inserted around server-rendered markup.")), container.removeChild(rootSibling);
                return !shouldHydrate || forceHydrate || warnedAboutHydrateAPI || (warnedAboutHydrateAPI = !0, warn("render(): Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v18. Replace the ReactDOM.render() call with ReactDOM.hydrate() if you want React to attach to the server HTML.")), new ReactDOMBlockingRoot(container, 0, shouldHydrate ? {
                    hydrate: !0
                } : void 0);
            }(container, forceHydrate))._internalRoot, "function" == typeof callback) {
                var originalCallback = callback;
                callback = function() {
                    var instance = getPublicRootInstance(fiberRoot);
                    originalCallback.call(instance);
                };
            } // Initial mount should not be batched.
            unbatchedUpdates(function() {
                updateContainer(children, fiberRoot, parentComponent, callback);
            });
        }
        return getPublicRootInstance(fiberRoot);
    }
    topLevelUpdateWarnings = function(container) {
        if (container._reactRootContainer && 8 !== container.nodeType) {
            var hostInstance = findHostInstanceWithNoPortals(container._reactRootContainer._internalRoot.current);
            hostInstance && hostInstance.parentNode !== container && error("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
        }
        var isRootRenderedBySomeReact = !!container._reactRootContainer, rootEl = getReactRootElementInContainer(container);
        rootEl && getInstanceFromNode(rootEl) && !isRootRenderedBySomeReact && error("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), 1 === container.nodeType && container.tagName && "BODY" === container.tagName.toUpperCase() && error("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    }, attemptUserBlockingHydration = function(fiber) {
        13 === fiber.tag && (scheduleUpdateOnFiber(fiber, 4, requestEventTime()), markRetryLaneIfNotHydrated(fiber, 4));
    }, attemptContinuousHydration = function(fiber) {
        13 === fiber.tag && (scheduleUpdateOnFiber(fiber, 67108864, requestEventTime()), markRetryLaneIfNotHydrated(fiber, 67108864));
    }, attemptHydrationAtCurrentPriority = function(fiber) {
        if (13 === fiber.tag) {
            var eventTime = requestEventTime(), lane = requestUpdateLane(fiber);
            scheduleUpdateOnFiber(fiber, lane, eventTime), markRetryLaneIfNotHydrated(fiber, lane);
        }
    }, attemptHydrationAtPriority = function(priority, fn) {
        return fn();
    };
    var didWarnAboutUnstableCreatePortal = !1;
    function createPortal$1(children, container) {
        var key = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        if (!isValidContainer(container)) throw Error("Target container is not a DOM element.");
         // TODO: pass ReactDOM portal implementation as third argument
        // $FlowFixMe The Flow type is opaque but there's no way to actually create it.
        return function(children, containerInfo, implementation) {
            var key = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
            return {
                // This tag allow us to uniquely identify this as a React Portal
                $$typeof: REACT_PORTAL_TYPE,
                key: null == key ? null : "" + key,
                children: children,
                containerInfo: containerInfo,
                implementation: implementation
            };
        }(children, container, null, key);
    }
    if (("function" != typeof Map || // $FlowIssue Flow incorrectly thinks Map has no prototype
    null == Map.prototype || "function" != typeof Map.prototype.forEach || "function" != typeof Set || // $FlowIssue Flow incorrectly thinks Set has no prototype
    null == Set.prototype || "function" != typeof Set.prototype.clear || "function" != typeof Set.prototype.forEach) && error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), restoreImpl = function(domElement, tag, props) {
        var value;
        switch(tag){
            case "input":
                updateWrapper(domElement, props), function(rootNode, props) {
                    var name = props.name;
                    if ("radio" === props.type && null != name) {
                        for(var queryRoot = rootNode; queryRoot.parentNode;)queryRoot = queryRoot.parentNode;
                         // If `rootNode.form` was non-null, then we could try `form.elements`,
                        for(var group = queryRoot.querySelectorAll("input[name=" + JSON.stringify("" + name) + '][type="radio"]'), i = 0; i < group.length; i++){
                            var otherNode = group[i];
                            if (otherNode !== rootNode && otherNode.form === rootNode.form) {
                                // and the same name are rendered into the same form (same as #1939).
                                // That's probably okay; we don't support it just as we don't support
                                // mixing React radio buttons with non-React ones.
                                var otherProps = getFiberCurrentPropsFromNode(otherNode);
                                if (!otherProps) throw Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
                                 // We need update the tracked value on the named cousin since the value
                                // was changed but the input saw no event or value set
                                updateValueIfChanged(otherNode), // was previously checked to update will cause it to be come re-checked
                                // as appropriate.
                                updateWrapper(otherNode, otherProps);
                            } // This will throw if radio buttons rendered by different copies of React
                        }
                    }
                } // In Chrome, assigning defaultValue to certain input types triggers input validation.
                (domElement, props);
                return;
            case "textarea":
                // DOM component is still mounted; update
                updateWrapper$1(domElement, props);
                return;
            case "select":
                null != (value = props.value) && updateOptions(domElement, !!props.multiple, value, !1);
                return;
        }
    }, _discreteUpdatesImpl = function(fn, a, b, c, d) {
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        try {
            return runWithPriority$1(98, fn.bind(null, a, b, c, d));
        } finally{
            0 === (executionContext = prevExecutionContext) && (// Flush the immediate callbacks that were scheduled during this batch
            resetRenderTimer(), flushSyncCallbackQueue());
        }
    }, _flushDiscreteUpdatesImpl = function() {
        // TODO: Should be able to flush inside batchedUpdates, but not inside `act`.
        // However, `act` uses `batchedUpdates`, so there's no way to distinguish
        // those two cases. Need to fix this before exposing flushDiscreteUpdates
        // as a public API.
        if ((49 & executionContext) != 0) {
            (16 & executionContext) != 0 && error("unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering.");
            // This is probably a nested event dispatch triggered by a lifecycle/effect,
            // like `el.focus()`. Exit.
            return;
        }
        (function() {
            if (null !== rootsWithPendingDiscreteUpdates) {
                // For each root with pending discrete updates, schedule a callback to
                // immediately flush them.
                var roots = rootsWithPendingDiscreteUpdates;
                rootsWithPendingDiscreteUpdates = null, roots.forEach(function(root) {
                    root.expiredLanes |= 24 & root.pendingLanes, ensureRootIsScheduled(root, now());
                });
            } // Now flush the immediate queue.
            flushSyncCallbackQueue();
        })(), // they fire before the next serial event.
        flushPassiveEffects();
    }, _batchedEventUpdatesImpl = function(fn, a) {
        var prevExecutionContext = executionContext;
        executionContext |= /*                 */ 2;
        try {
            return fn(a);
        } finally{
            0 === (executionContext = prevExecutionContext) && (// Flush the immediate callbacks that were scheduled during this batch
            resetRenderTimer(), flushSyncCallbackQueue());
        }
    }, batchedUpdatesImpl = batchedUpdates$1, discreteUpdatesImpl = _discreteUpdatesImpl, flushDiscreteUpdatesImpl = _flushDiscreteUpdatesImpl, batchedEventUpdatesImpl = _batchedEventUpdatesImpl, findFiberByHostInstance = (devToolsConfig = {
        findFiberByHostInstance: getClosestInstanceFromNode,
        bundleType: 1,
        version: ReactVersion,
        rendererPackageName: "react-dom"
    }).findFiberByHostInstance, ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher, !function(internals) {
        if ("undefined" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) // No DevTools
        return !1;
        var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.isDisabled) // This isn't a real property on the hook, but it can be set to opt out
        // of DevTools integration and associated warnings and logs.
        // https://github.com/facebook/react/issues/3877
        return !0;
        if (!hook.supportsFiber) return error("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
        try {
            rendererID = hook.inject(internals), injectedHook = hook;
        } catch (err) {
            error("React instrumentation encountered an error: %s.", err);
        } // DevTools exists
        return !0;
    }({
        bundleType: devToolsConfig.bundleType,
        version: devToolsConfig.version,
        rendererPackageName: devToolsConfig.rendererPackageName,
        rendererConfig: devToolsConfig.rendererConfig,
        overrideHookState: overrideHookState,
        overrideHookStateDeletePath: overrideHookStateDeletePath,
        overrideHookStateRenamePath: overrideHookStateRenamePath,
        overrideProps: overrideProps,
        overridePropsDeletePath: overridePropsDeletePath,
        overridePropsRenamePath: overridePropsRenamePath,
        setSuspenseHandler: setSuspenseHandler,
        scheduleUpdate: scheduleUpdate,
        currentDispatcherRef: ReactCurrentDispatcher,
        findHostInstanceByFiber: function(fiber) {
            var hostFiber = findCurrentHostFiber(fiber);
            return null === hostFiber ? null : hostFiber.stateNode;
        },
        findFiberByHostInstance: findFiberByHostInstance || function(instance) {
            return null;
        },
        // React Refresh
        findHostInstancesForRefresh: function(root, families) {
            var hostInstances = new Set(), types = new Set(families.map(function(family) {
                return family.current;
            }));
            return function findHostInstancesForMatchingFibersRecursively(fiber, types, hostInstances) {
                var child = fiber.child, sibling = fiber.sibling, tag = fiber.tag, type = fiber.type, candidateType = null;
                switch(tag){
                    case 0:
                    case 15:
                    case 1:
                        candidateType = type;
                        break;
                    case 11:
                        candidateType = type.render;
                }
                var didMatch = !1;
                null !== candidateType && types.has(candidateType) && (didMatch = !0), didMatch ? // We have a match. This only drills down to the closest host components.
                // There's no need to search deeper because for the purpose of giving
                // visual feedback, "flashing" outermost parent rectangles is sufficient.
                function(fiber, hostInstances) {
                    if (!function(fiber, hostInstances) {
                        for(var node = fiber, foundHostInstances = !1;;){
                            if (5 === node.tag) // We got a match.
                            foundHostInstances = !0, hostInstances.add(node.stateNode);
                            else if (null !== node.child) {
                                node.child.return = node, node = node.child;
                                continue;
                            }
                            if (node === fiber) return foundHostInstances;
                            for(; null === node.sibling;){
                                if (null === node.return || node.return === fiber) return foundHostInstances;
                                node = node.return;
                            }
                            node.sibling.return = node.return, node = node.sibling;
                        }
                        return !1;
                    }(fiber, hostInstances)) for(var node = fiber;;){
                        switch(node.tag){
                            case 5:
                                hostInstances.add(node.stateNode);
                                return;
                            case 4:
                            case 3:
                                hostInstances.add(node.stateNode.containerInfo);
                                return;
                        }
                        if (null === node.return) throw Error("Expected to reach root first.");
                        node = node.return;
                    }
                     // If we didn't find any host children, fallback to closest host parent.
                }(fiber, hostInstances) : null !== child && findHostInstancesForMatchingFibersRecursively(child, types, hostInstances), null !== sibling && findHostInstancesForMatchingFibersRecursively(sibling, types, hostInstances);
            }(root.current, types, hostInstances), hostInstances;
        },
        scheduleRefresh: function(root, update) {
            if (null !== resolveFamily) {
                var staleFamilies = update.staleFamilies, updatedFamilies = update.updatedFamilies;
                flushPassiveEffects(), flushSync(function() {
                    (function scheduleFibersWithFamiliesRecursively(fiber, updatedFamilies, staleFamilies) {
                        var alternate = fiber.alternate, child = fiber.child, sibling = fiber.sibling, tag = fiber.tag, type = fiber.type, candidateType = null;
                        switch(tag){
                            case 0:
                            case 15:
                            case 1:
                                candidateType = type;
                                break;
                            case 11:
                                candidateType = type.render;
                        }
                        if (null === resolveFamily) throw Error("Expected resolveFamily to be set during hot reload.");
                        var needsRender = !1, needsRemount = !1;
                        if (null !== candidateType) {
                            var family = resolveFamily(candidateType);
                            void 0 !== family && (staleFamilies.has(family) ? needsRemount = !0 : updatedFamilies.has(family) && (1 === tag ? needsRemount = !0 : needsRender = !0));
                        }
                        null !== failedBoundaries && (failedBoundaries.has(fiber) || null !== alternate && failedBoundaries.has(alternate)) && (needsRemount = !0), needsRemount && (fiber._debugNeedsRemount = !0), (needsRemount || needsRender) && scheduleUpdateOnFiber(fiber, 1, -1), null === child || needsRemount || scheduleFibersWithFamiliesRecursively(child, updatedFamilies, staleFamilies), null !== sibling && scheduleFibersWithFamiliesRecursively(sibling, updatedFamilies, staleFamilies);
                    })(root.current, updatedFamilies, staleFamilies);
                });
            }
        },
        scheduleRoot: function(root, element) {
            root.context === emptyContextObject && (flushPassiveEffects(), flushSync(function() {
                updateContainer(element, root, null, null);
            }));
        },
        setRefreshHandler: function(handler) {
            resolveFamily = handler;
        },
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: function() {
            return current;
        }
    }) && canUseDOM && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && -1 === navigator.userAgent.indexOf("Edge") || navigator.userAgent.indexOf("Firefox") > -1)) {
        var protocol = window.location.protocol; // Don't warn in exotic cases like chrome-extension://.
        /^(https?|file):$/.test(protocol) && // eslint-disable-next-line react-internal/no-production-logging
        console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + ("file:" === protocol ? "\nYou might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq" : ""), "font-weight:bold");
    }
    exports1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
        // Keep in sync with ReactTestUtils.js, and ReactTestUtilsAct.js.
        // This is an array for better minification.
        Events: [
            getInstanceFromNode,
            getNodeFromInstance,
            getFiberCurrentPropsFromNode,
            enqueueStateRestore,
            restoreStateIfNeeded,
            flushPassiveEffects,
            IsThisRendererActing
        ]
    }, exports1.createPortal = createPortal$1, exports1.findDOMNode = function(componentOrElement) {
        var owner = ReactCurrentOwner$3.current;
        return (null !== owner && null !== owner.stateNode && (owner.stateNode._warnedAboutRefsInRender || error("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", getComponentName(owner.type) || "A component"), owner.stateNode._warnedAboutRefsInRender = !0), null == componentOrElement) ? null : 1 === componentOrElement.nodeType ? componentOrElement : function(component, methodName) {
            var fiber = get(component);
            if (void 0 === fiber) {
                if ("function" == typeof component.render) throw Error("Unable to find node on an unmounted component.");
                throw Error("Argument appears to not be a ReactComponent. Keys: " + Object.keys(component));
            }
            var hostFiber = findCurrentHostFiber(fiber);
            if (null === hostFiber) return null;
            if (1 & hostFiber.mode) {
                var componentName = getComponentName(fiber.type) || "Component";
                if (!didWarnAboutFindNodeInStrictMode[componentName]) {
                    didWarnAboutFindNodeInStrictMode[componentName] = !0;
                    var previousFiber = current;
                    try {
                        setCurrentFiber(hostFiber), 1 & fiber.mode ? error("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", methodName, methodName, componentName) : error("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", methodName, methodName, componentName);
                    } finally{
                        // Ideally this should reset to previous but this shouldn't be called in
                        // render and there's another warning for that anyway.
                        previousFiber ? setCurrentFiber(previousFiber) : resetCurrentFiber();
                    }
                }
            }
            return hostFiber.stateNode;
        }(componentOrElement, "findDOMNode");
    }, exports1.flushSync = flushSync, exports1.hydrate = function(element, container, callback) {
        if (!isValidContainer(container)) throw Error("Target container is not a DOM element.");
        return container[internalContainerInstanceKey] && void 0 === container._reactRootContainer && error("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOM.createRoot(). This is not supported. Did you mean to call createRoot(container, {hydrate: true}).render(element)?"), legacyRenderSubtreeIntoContainer(null, element, container, !0, callback);
    }, exports1.render = function(element, container, callback) {
        if (!isValidContainer(container)) throw Error("Target container is not a DOM element.");
        return container[internalContainerInstanceKey] && void 0 === container._reactRootContainer && error("You are calling ReactDOM.render() on a container that was previously passed to ReactDOM.createRoot(). This is not supported. Did you mean to call root.render(element)?"), legacyRenderSubtreeIntoContainer(null, element, container, !1, callback);
    }, exports1.unmountComponentAtNode = function(container) {
        if (!isValidContainer(container)) throw Error("unmountComponentAtNode(...): Target container is not a DOM element.");
        if (container[internalContainerInstanceKey] && void 0 === container._reactRootContainer && error("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOM.createRoot(). This is not supported. Did you mean to call root.unmount()?"), container._reactRootContainer) {
            var rootEl = getReactRootElementInContainer(container);
            // get `true` twice. That's probably fine?
            return rootEl && !getInstanceFromNode(rootEl) && error("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React."), unbatchedUpdates(function() {
                legacyRenderSubtreeIntoContainer(null, null, container, !1, function() {
                    // $FlowFixMe This should probably use `delete container._reactRootContainer`
                    container._reactRootContainer = null, container[internalContainerInstanceKey] = null;
                });
            }), !0;
        }
        var _rootEl = getReactRootElementInContainer(container), hasNonRootReactChild = !!(_rootEl && getInstanceFromNode(_rootEl)), isContainerReactRoot = 1 === container.nodeType && isValidContainer(container.parentNode) && !!container.parentNode._reactRootContainer;
        return hasNonRootReactChild && error("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", isContainerReactRoot ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component."), !1;
    }, exports1.unstable_batchedUpdates = batchedUpdates$1, exports1.unstable_createPortal = function(children, container) {
        var key = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        return didWarnAboutUnstableCreatePortal || (didWarnAboutUnstableCreatePortal = !0, warn('The ReactDOM.unstable_createPortal() alias has been deprecated, and will be removed in React 18+. Update your code to use ReactDOM.createPortal() instead. It has the exact same API, but without the "unstable_" prefix.')), createPortal$1(children, container, key);
    }, exports1.unstable_renderSubtreeIntoContainer = function(parentComponent, element, containerNode, callback) {
        return function(parentComponent, element, containerNode, callback) {
            if (!isValidContainer(containerNode)) throw Error("Target container is not a DOM element.");
            if (!(null != parentComponent && void 0 !== parentComponent._reactInternals)) throw Error("parentComponent must be a valid React Component");
            return legacyRenderSubtreeIntoContainer(parentComponent, element, containerNode, !1, callback);
        }(parentComponent, element, containerNode, callback);
    }, exports1.version = ReactVersion;
});
