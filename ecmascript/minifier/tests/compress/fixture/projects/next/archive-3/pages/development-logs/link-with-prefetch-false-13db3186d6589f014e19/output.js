(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        574, 
    ],
    {
        3824: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _slicedToArray = __webpack_require__(3408);
            exports.default = void 0;
            var _react = _interopRequireDefault(__webpack_require__(2735)), _router = __webpack_require__(1073), _router1 = __webpack_require__(6409), _useIntersection = __webpack_require__(4770), prefetched = {
            };
            function prefetch(router, href, as, options) {
                if (router && _router.isLocalURL(href)) {
                    router.prefetch(href, as, options).catch(function(err) {
                    });
                    var curLocale = options && void 0 !== options.locale ? options.locale : router && router.locale;
                    prefetched[href + "%" + as + (curLocale ? "%" + curLocale : "")] = !0;
                }
            }
            function isModifiedEvent(event) {
                var target = event.currentTarget.target;
                return target && "_self" !== target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.nativeEvent && 2 === event.nativeEvent.which;
            }
            function linkClicked(e, router, href, as, replace, shallow, scroll, locale) {
                "A" === e.currentTarget.nodeName && (isModifiedEvent(e) || !_router.isLocalURL(href)) || (e.preventDefault(), null == scroll && as.indexOf("#") >= 0 && (scroll = !1), router[replace ? "replace" : "push"](href, as, {
                    shallow: shallow,
                    locale: locale,
                    scroll: scroll
                }));
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
                    props.as, 
                ]), href = _react$default$useMem.href, as = _react$default$useMem.as, children = props.children, replace = props.replace, shallow = props.shallow, scroll = props.scroll, locale = props.locale;
                "string" == typeof children && (children = _react.default.createElement("a", null, children));
                var childRef = (child = _react.default.Children.only(children)) && "object" == typeof child && child.ref, _useIntersection3 = _slicedToArray(_useIntersection.useIntersection({
                    rootMargin: "200px"
                }), 2), setIntersectionRef = _useIntersection3[0], isVisible = _useIntersection3[1], setRef = _react.default.useCallback(function(el) {
                    setIntersectionRef(el), childRef && ("function" == typeof childRef ? childRef(el) : "object" == typeof childRef && (childRef.current = el));
                }, [
                    childRef,
                    setIntersectionRef, 
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
                    router, 
                ]);
                var childProps = {
                    ref: setRef,
                    onClick: function(e) {
                        child.props && "function" == typeof child.props.onClick && child.props.onClick(e), e.defaultPrevented || linkClicked(e, router, href, as, replace, shallow, scroll, locale);
                    }
                };
                if (childProps.onMouseEnter = function(e) {
                    _router.isLocalURL(href) && (child.props && "function" == typeof child.props.onMouseEnter && child.props.onMouseEnter(e), prefetch(router, href, as, {
                        priority: !0
                    }));
                }, props.passHref || "a" === child.type && !("href" in child.props)) {
                    var curLocale = void 0 !== locale ? locale : router && router.locale, localeDomain = router && router.isLocaleDomain && _router.getDomainLocale(as, curLocale, router && router.locales, router && router.domainLocales);
                    childProps.href = localeDomain || _router.addBasePath(_router.addLocale(as, curLocale, router && router.defaultLocale));
                }
                return _react.default.cloneElement(child, childProps);
            };
        },
        4770: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            __webpack_require__(3408), Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.useIntersection = useIntersection, __webpack_require__(2735), __webpack_require__(6933), "undefined" != typeof IntersectionObserver, new Map();
        },
        4592: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return PrefetchFalsePage;
                }
            });
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4512), next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2865);
            function PrefetchFalsePage() {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_1__.default, {
                        href: "/about",
                        prefetch: !1,
                        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
                            children: "Prefetch set to false"
                        })
                    })
                });
            }
        },
        819: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/development-logs/link-with-prefetch-false", function() {
                    return __webpack_require__(4592);
                }, ]);
        },
        2865: function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(3824);
        }
    }, function(__webpack_require__) {
        __webpack_require__.O(0, [
            774,
            888,
            179, 
        ], function() {
            return __webpack_require__(__webpack_require__.s = 819);
        }), _N_E = __webpack_require__.O();
    }, ]);
