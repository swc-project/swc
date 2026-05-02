(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        739
    ],
    {
        /***/ 3824: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj, _slicedToArray = __webpack_require__(3408);
            exports.default = void 0;
            var _react = (obj = __webpack_require__(2735)) && obj.__esModule ? obj : {
                default: obj
            }, _router = __webpack_require__(1073), _router1 = __webpack_require__(6409), _useIntersection = __webpack_require__(4770), prefetched = {};
            function prefetch(router, href, as, options) {
                if (router && _router.isLocalURL(href)) {
                    // We need to handle a prefetch error here since we may be
                    // loading with priority which can reject but we don't
                    // want to force navigation since this is only a prefetch
                    router.prefetch(href, as, options).catch(function(err) {});
                    var curLocale = options && void 0 !== options.locale ? options.locale : router && router.locale; // Join on an invalid URI character
                    prefetched[href + "%" + as + (curLocale ? "%" + curLocale : "")] = !0;
                }
            }
            exports.default = function(props) {
                var child, p = !1 !== props.prefetch, router = _router1.useRouter(), _react$default$useMem = _react.default.useMemo(function() {
                    var _resolveHref2 = _slicedToArray(_router.resolveHref(router, props.href, !0), 2), resolvedHref = _resolveHref2[0], resolvedAs = _resolveHref2[1];
                    return {
                        href: resolvedHref,
                        as: props.as ? _router.resolveHref(router, props.as) : resolvedAs || resolvedHref
                    };
                }, [
                    router,
                    props.href,
                    props.as
                ]), href = _react$default$useMem.href, as = _react$default$useMem.as, children = props.children, replace = props.replace, shallow = props.shallow, scroll = props.scroll, locale = props.locale;
                "string" == typeof children && (children = /*#__PURE__*/ _react.default.createElement("a", null, children));
                var childRef = (child = _react.default.Children.only(children)) && "object" == typeof child && child.ref, _useIntersection3 = _slicedToArray(_useIntersection.useIntersection({
                    rootMargin: "200px"
                }), 2), setIntersectionRef = _useIntersection3[0], isVisible = _useIntersection3[1], setRef = _react.default.useCallback(function(el) {
                    setIntersectionRef(el), childRef && ("function" == typeof childRef ? childRef(el) : "object" == typeof childRef && (childRef.current = el));
                }, [
                    childRef,
                    setIntersectionRef
                ]);
                _react.default.useEffect(function() {
                    var shouldPrefetch = isVisible && p && _router.isLocalURL(href), curLocale = void 0 !== locale ? locale : router && router.locale, isPrefetched = prefetched[href + "%" + as + (curLocale ? "%" + curLocale : "")];
                    shouldPrefetch && !isPrefetched && prefetch(router, href, as, {
                        locale: curLocale
                    });
                }, [
                    as,
                    href,
                    isVisible,
                    locale,
                    p,
                    router
                ]);
                var childProps = {
                    ref: setRef,
                    onClick: function(e) {
                        var scroll1, target;
                        child.props && "function" == typeof child.props.onClick && child.props.onClick(e), e.defaultPrevented || (scroll1 = scroll, "A" === e.currentTarget.nodeName && ((target = e.currentTarget.target) && "_self" !== target || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.nativeEvent && 2 === e.nativeEvent.which || !_router.isLocalURL(href)) || (e.preventDefault(), null == scroll1 && as.indexOf("#") >= 0 && (scroll1 = !1), router[replace ? "replace" : "push"](href, as, {
                            shallow: shallow,
                            locale: locale,
                            scroll: scroll1
                        })));
                    }
                };
                // defined, we specify the current 'href', so that repetition is not needed by the user
                if (childProps.onMouseEnter = function(e) {
                    _router.isLocalURL(href) && (child.props && "function" == typeof child.props.onMouseEnter && child.props.onMouseEnter(e), prefetch(router, href, as, {
                        priority: !0
                    }));
                }, props.passHref || "a" === child.type && !("href" in child.props)) {
                    var curLocale = void 0 !== locale ? locale : router && router.locale; // we only render domain locales if we are currently on a domain locale
                    childProps.href = router && router.isLocaleDomain && _router.getDomainLocale(as, curLocale, router && router.locales, router && router.domainLocales) || _router.addBasePath(_router.addLocale(as, curLocale, router && router.defaultLocale));
                }
                return /*#__PURE__*/ _react.default.cloneElement(child, childProps);
            };
        /***/ },
        /***/ 4770: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _slicedToArray = __webpack_require__(3408);
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.useIntersection = function(_ref) {
                var rootMargin = _ref.rootMargin, isDisabled = _ref.disabled || !hasIntersectionObserver, unobserve = _react.useRef(), _useState2 = _slicedToArray(_react.useState(!1), 2), visible = _useState2[0], setVisible = _useState2[1], setRef = _react.useCallback(function(el) {
                    var _createObserver, id, observer, elements;
                    unobserve.current && (unobserve.current(), unobserve.current = void 0), !isDisabled && !visible && el && el.tagName && (id = (_createObserver = function(options) {
                        var id = options.rootMargin || "", instance = observers.get(id);
                        if (instance) return instance;
                        var elements = new Map(), observer = new IntersectionObserver(function(entries) {
                            entries.forEach(function(entry) {
                                var callback = elements.get(entry.target), isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
                                callback && isVisible && callback(isVisible);
                            });
                        }, options);
                        return observers.set(id, instance = {
                            id: id,
                            observer: observer,
                            elements: elements
                        }), instance;
                    }({
                        rootMargin: rootMargin
                    })).id, observer = _createObserver.observer, (elements = _createObserver.elements).set(el, function(isVisible) {
                        return isVisible && setVisible(isVisible);
                    }), observer.observe(el), unobserve.current = function() {
                        elements.delete(el), observer.unobserve(el), 0 === elements.size && (observer.disconnect(), observers.delete(id));
                    });
                }, [
                    isDisabled,
                    rootMargin,
                    visible
                ]);
                return _react.useEffect(function() {
                    if (!hasIntersectionObserver && !visible) {
                        var idleCallback = _requestIdleCallback.requestIdleCallback(function() {
                            return setVisible(!0);
                        });
                        return function() {
                            return _requestIdleCallback.cancelIdleCallback(idleCallback);
                        };
                    }
                }, [
                    visible
                ]), [
                    setRef,
                    visible
                ];
            };
            var _react = __webpack_require__(2735), _requestIdleCallback = __webpack_require__(6933), hasIntersectionObserver = "u" > typeof IntersectionObserver, observers = new Map();
        /***/ },
        /***/ 1618: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4512), next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2865);
            /* harmony default export */ __webpack_exports__.default = function() {
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_1__.default, {
                        href: "/dynamic/no-chunk",
                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
                            children: "No Chunk"
                        })
                    })
                });
            };
        /***/ },
        /***/ 9575: /***/ function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/dynamic",
                function() {
                    return __webpack_require__(1618);
                }
            ]);
        /***/ },
        /***/ 2865: /***/ function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(3824);
        /***/ }
    },
    /******/ function(__webpack_require__) {
        /******/ __webpack_require__.O(0, [
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 9575);
        }), /******/ _N_E = __webpack_require__.O();
    /******/ }
]);
