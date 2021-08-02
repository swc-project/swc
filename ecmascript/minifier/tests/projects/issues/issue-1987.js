/*!*************************************************!*\
  !*** ./node_modules/rc-virtual-list/es/List.js ***!
  \*************************************************/
/*! exports provided: RawList, default */
/*! exports used: default */
/***/ (function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    /* unused harmony export RawList */
    var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
		/*! react */ "react"
    );
    var react__WEBPACK_IMPORTED_MODULE_0___default =
		/*#__PURE__*/ __webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
    var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
		/*! classnames */ "./node_modules/classnames/index.js"
    );
    var classnames__WEBPACK_IMPORTED_MODULE_1___default =
		/*#__PURE__*/ __webpack_require__.n(
        classnames__WEBPACK_IMPORTED_MODULE_1__
    );
    var _Filler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
		/*! ./Filler */ "./node_modules/rc-virtual-list/es/Filler.js"
    );
    var _ScrollBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
		/*! ./ScrollBar */ "./node_modules/rc-virtual-list/es/ScrollBar.js"
    );
    var _hooks_useChildren__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
		/*! ./hooks/useChildren */ "./node_modules/rc-virtual-list/es/hooks/useChildren.js"
    );
    var _hooks_useHeights__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
		/*! ./hooks/useHeights */ "./node_modules/rc-virtual-list/es/hooks/useHeights.js"
    );
    var _hooks_useScrollTo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
		/*! ./hooks/useScrollTo */ "./node_modules/rc-virtual-list/es/hooks/useScrollTo.js"
    );
    var _hooks_useDiffItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
		/*! ./hooks/useDiffItem */ "./node_modules/rc-virtual-list/es/hooks/useDiffItem.js"
    );
    var _hooks_useFrameWheel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
		/*! ./hooks/useFrameWheel */ "./node_modules/rc-virtual-list/es/hooks/useFrameWheel.js"
    );
    var _hooks_useMobileTouchMove__WEBPACK_IMPORTED_MODULE_9__ =
        __webpack_require__(
			/*! ./hooks/useMobileTouchMove */ "./node_modules/rc-virtual-list/es/hooks/useMobileTouchMove.js"
        );
    var _hooks_useOriginScroll__WEBPACK_IMPORTED_MODULE_10__ =
        __webpack_require__(
			/*! ./hooks/useOriginScroll */ "./node_modules/rc-virtual-list/es/hooks/useOriginScroll.js"
        );
    var _excluded = [
        "prefixCls",
        "className",
        "height",
        "itemHeight",
        "fullHeight",
        "style",
        "data",
        "children",
        "itemKey",
        "virtual",
        "component",
        "onScroll",
    ];

    function _extends() {
        _extends =
            Object.assign ||
            function (target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            };
        return _extends.apply(this, arguments);
    }

    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            if (enumerableOnly) {
                symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                });
            }
            keys.push.apply(keys, symbols);
        }
        return keys;
    }

    function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {};
            if (i % 2) {
                ownKeys(Object(source), true).forEach(function (key) {
                    _defineProperty(target, key, source[key]);
                });
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(source)
                );
            } else {
                ownKeys(Object(source)).forEach(function (key) {
                    Object.defineProperty(
                        target,
                        key,
                        Object.getOwnPropertyDescriptor(source, key)
                    );
                });
            }
        }
        return target;
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true,
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }

    function _slicedToArray(arr, i) {
        return (
            _arrayWithHoles(arr) ||
            _iterableToArrayLimit(arr, i) ||
            _unsupportedIterableToArray(arr, i) ||
            _nonIterableRest()
        );
    }

    function _nonIterableRest() {
        throw new TypeError(
            "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
    }

    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (
            n === "Arguments" ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
            return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }

    function _iterableToArrayLimit(arr, i) {
        var _i =
            arr == null
                ? null
                : (typeof Symbol !== "undefined" && arr[Symbol.iterator]) ||
                arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for (i = 0; i < sourceSymbolKeys.length; i++) {
                key = sourceSymbolKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key))
                    continue;
                target[key] = source[key];
            }
        }
        return target;
    }

    function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }
        return target;
    }

    var EMPTY_DATA = [];
    var ScrollStyle = {
        overflowY: "auto",
        overflowAnchor: "none",
    };
    function RawList(props, ref) {
        var _props$prefixCls = props.prefixCls,
            prefixCls =
                _props$prefixCls === void 0
                    ? "rc-virtual-list"
                    : _props$prefixCls,
            className = props.className,
            height = props.height,
            itemHeight = props.itemHeight,
            _props$fullHeight = props.fullHeight,
            fullHeight =
                _props$fullHeight === void 0 ? true : _props$fullHeight,
            style = props.style,
            data = props.data,
            children = props.children,
            itemKey = props.itemKey,
            virtual = props.virtual,
            _props$component = props.component,
            Component = _props$component === void 0 ? "div" : _props$component,
            onScroll = props.onScroll,
            restProps = _objectWithoutProperties(props, _excluded); // ================================= MISC =================================

        var useVirtual = !!(virtual !== false && height && itemHeight);
        var inVirtual = useVirtual && data && itemHeight * data.length > height;

        var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(
            0
        ),
            _useState2 = _slicedToArray(_useState, 2),
            scrollTop = _useState2[0],
            setScrollTop = _useState2[1];

        var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(
            false
        ),
            _useState4 = _slicedToArray(_useState3, 2),
            scrollMoving = _useState4[0],
            setScrollMoving = _useState4[1];

        var mergedClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()(
            prefixCls,
            className
        );
        var mergedData = data || EMPTY_DATA;
        var componentRef = Object(
            react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
        )();
        var fillerInnerRef = Object(
            react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
        )();
        var scrollBarRef = Object(
            react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
        )(); // Hack on scrollbar to enable flash call
        // =============================== Item Key ===============================

        var getKey = react__WEBPACK_IMPORTED_MODULE_0__["useCallback"](
            function (item) {
                if (typeof itemKey === "function") {
                    return itemKey(item);
                }

                return item === null || item === void 0
                    ? void 0
                    : item[itemKey];
            },
            [itemKey]
        );
        var sharedConfig = {
            getKey: getKey,
        }; // ================================ Scroll ================================

        function syncScrollTop(newTop) {
            setScrollTop(function (origin) {
                var value;

                if (typeof newTop === "function") {
                    value = newTop(origin);
                } else {
                    value = newTop;
                }

                var alignedTop = keepInRange(value);
                componentRef.current.scrollTop = alignedTop;
                return alignedTop;
            });
        } // ================================ Legacy ================================
        // Put ref here since the range is generate by follow

        var rangeRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])({
            start: 0,
            end: mergedData.length,
        });
        var diffItemRef = Object(
            react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
        )();

        var _useDiffItem = Object(
            _hooks_useDiffItem__WEBPACK_IMPORTED_MODULE_7__[
					/* default */ "a"
            ]
        )(mergedData, getKey),
            _useDiffItem2 = _slicedToArray(_useDiffItem, 1),
            diffItem = _useDiffItem2[0];

        diffItemRef.current = diffItem; // ================================ Height ================================

        var _useHeights = Object(
            _hooks_useHeights__WEBPACK_IMPORTED_MODULE_5__[
					/* default */ "a"
            ]
        )(getKey, null, null),
            _useHeights2 = _slicedToArray(_useHeights, 4),
            setInstanceRef = _useHeights2[0],
            collectHeight = _useHeights2[1],
            heights = _useHeights2[2],
            heightUpdatedMark = _useHeights2[3]; // ========================== Visible Calculation =========================

        var _React$useMemo = react__WEBPACK_IMPORTED_MODULE_0__["useMemo"](
            function () {
                if (!useVirtual) {
                    return {
                        scrollHeight: undefined,
                        start: 0,
                        end: mergedData.length - 1,
                        offset: undefined,
                    };
                } // Always use virtual scroll bar in avoid shaking

                // Always use virtual scroll bar in avoid shaking
                if (!inVirtual) {
                    var _fillerInnerRef$curre;

                    return {
                        scrollHeight:
                            ((_fillerInnerRef$curre =
                                fillerInnerRef.current) === null ||
                                _fillerInnerRef$curre === void 0
                                ? void 0
                                : _fillerInnerRef$curre.offsetHeight) || 0,
                        start: 0,
                        end: mergedData.length - 1,
                        offset: undefined,
                    };
                }

                var itemTop = 0;
                var startIndex;
                var startOffset;
                var endIndex;
                var dataLen = mergedData.length;

                for (var i = 0; i < dataLen; i += 1) {
                    var item = mergedData[i];
                    var key = getKey(item);
                    var cacheHeight = heights.get(key);
                    var currentItemBottom =
                        itemTop +
                        (cacheHeight === undefined
                            ? itemHeight
                            : cacheHeight); // Check item top in the range

                    // Check item top in the range
                    if (
                        currentItemBottom >= scrollTop &&
                        startIndex === undefined
                    ) {
                        startIndex = i;
                        startOffset = itemTop;
                    } // Check item bottom in the range. We will render additional one item for motion usage

                    // Check item bottom in the range. We will render additional one item for motion usage
                    if (
                        currentItemBottom > scrollTop + height &&
                        endIndex === undefined
                    ) {
                        endIndex = i;
                    }

                    itemTop = currentItemBottom;
                } // Fallback to normal if not match. This code should never reach

                /* istanbul ignore next */

                // Fallback to normal if not match. This code should never reach

                /* istanbul ignore next */
                if (startIndex === undefined) {
                    startIndex = 0;
                    startOffset = 0;
                }

                if (endIndex === undefined) {
                    endIndex = mergedData.length - 1;
                } // Give cache to improve scroll experience

                // Give cache to improve scroll experience
                endIndex = Math.min(endIndex + 1, mergedData.length);
                return {
                    scrollHeight: itemTop,
                    start: startIndex,
                    end: endIndex,
                    offset: startOffset,
                };
            },
            [
                inVirtual,
                useVirtual,
                scrollTop,
                mergedData,
                heightUpdatedMark,
                height,
            ]
        ),
            scrollHeight = _React$useMemo.scrollHeight,
            start = _React$useMemo.start,
            end = _React$useMemo.end,
            offset = _React$useMemo.offset;

        rangeRef.current.start = start;
        rangeRef.current.end = end; // =============================== In Range ===============================

        var maxScrollHeight = scrollHeight - height;
        var maxScrollHeightRef = Object(
            react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
        )(maxScrollHeight);
        maxScrollHeightRef.current = maxScrollHeight;

        function keepInRange(newScrollTop) {
            var newTop = newScrollTop;

            if (!Number.isNaN(maxScrollHeightRef.current)) {
                newTop = Math.min(newTop, maxScrollHeightRef.current);
            }

            newTop = Math.max(newTop, 0);
            return newTop;
        }

        var isScrollAtTop = scrollTop <= 0;
        var isScrollAtBottom = scrollTop >= maxScrollHeight;
        var originScroll = Object(
            _hooks_useOriginScroll__WEBPACK_IMPORTED_MODULE_10__[
				/* default */ "a"
            ]
        )(isScrollAtTop, isScrollAtBottom); // ================================ Scroll ================================

        function onScrollBar(newScrollTop) {
            var newTop = newScrollTop;
            syncScrollTop(newTop);
        } // When data size reduce. It may trigger native scroll event back to fit scroll position

        function onFallbackScroll(e) {
            var newScrollTop = e.currentTarget.scrollTop;

            if (newScrollTop !== scrollTop) {
                syncScrollTop(newScrollTop);
            } // Trigger origin onScroll

            onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
        } // Since this added in global,should use ref to keep update

        var _useFrameWheel = Object(
            _hooks_useFrameWheel__WEBPACK_IMPORTED_MODULE_8__[
					/* default */ "a"
            ]
        )(useVirtual, isScrollAtTop, isScrollAtBottom, function (offsetY) {
            syncScrollTop(function (top) {
                var newTop = top + offsetY;
                return newTop;
            });
        }),
            _useFrameWheel2 = _slicedToArray(_useFrameWheel, 2),
            onRawWheel = _useFrameWheel2[0],
            onFireFoxScroll = _useFrameWheel2[1]; // Mobile touch move

        Object(
            _hooks_useMobileTouchMove__WEBPACK_IMPORTED_MODULE_9__[
				/* default */ "a"
            ]
        )(useVirtual, componentRef, function (deltaY, smoothOffset) {
            if (originScroll(deltaY, smoothOffset)) {
                return false;
            }

            onRawWheel({
                preventDefault: function preventDefault() { },
                deltaY: deltaY,
            });
            return true;
        });
        react__WEBPACK_IMPORTED_MODULE_0__["useLayoutEffect"](
            function () {
                // Firefox only
                function onMozMousePixelScroll(e) {
                    if (useVirtual) {
                        e.preventDefault();
                    }
                }

                componentRef.current.addEventListener("wheel", onRawWheel);
                componentRef.current.addEventListener(
                    "DOMMouseScroll",
                    onFireFoxScroll
                );
                componentRef.current.addEventListener(
                    "MozMousePixelScroll",
                    onMozMousePixelScroll
                );
                return function () {
                    componentRef.current.removeEventListener(
                        "wheel",
                        onRawWheel
                    );
                    componentRef.current.removeEventListener(
                        "DOMMouseScroll",
                        onFireFoxScroll
                    );
                    componentRef.current.removeEventListener(
                        "MozMousePixelScroll",
                        onMozMousePixelScroll
                    );
                };
            },
            [useVirtual]
        ); // ================================= Ref ==================================

        var scrollTo = Object(
            _hooks_useScrollTo__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"]
        )(
            componentRef,
            mergedData,
            heights,
            itemHeight,
            getKey,
            collectHeight,
            syncScrollTop,
            function () {
                var _scrollBarRef$current;

                (_scrollBarRef$current = scrollBarRef.current) === null ||
                    _scrollBarRef$current === void 0
                    ? void 0
                    : _scrollBarRef$current.delayHidden();
            }
        );
        react__WEBPACK_IMPORTED_MODULE_0__["useImperativeHandle"](
            ref,
            function () {
                return {
                    scrollTo: scrollTo,
                };
            }
        ); // ================================ Render ================================

        var listChildren = Object(
            _hooks_useChildren__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"]
        )(mergedData, start, end, setInstanceRef, children, sharedConfig);
        var componentStyle = null;

        if (height) {
            componentStyle = _objectSpread(
                _defineProperty(
                    {},
                    fullHeight ? "height" : "maxHeight",
                    height
                ),
                ScrollStyle
            );

            if (useVirtual) {
                componentStyle.overflowY = "hidden";

                if (scrollMoving) {
                    componentStyle.pointerEvents = "none";
                }
            }
        }

        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__[
            "createElement"
        ](
            "div",
            _extends(
                {
                    style: _objectSpread(
                        _objectSpread({}, style),
                        {},
                        {
                            position: "relative",
                        }
                    ),
                    className: mergedClassName,
                },
                restProps
            ),
			/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__["createElement"](
                Component,
                {
                    className: "".concat(prefixCls, "-holder"),
                    style: componentStyle,
                    ref: componentRef,
                    onScroll: onFallbackScroll,
                },
				/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__[
                    "createElement"
                ](
                    _Filler__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"],
                    {
                        prefixCls: prefixCls,
                        height: scrollHeight,
                        offset: offset,
                        onInnerResize: collectHeight,
                        ref: fillerInnerRef,
                    },
                    listChildren
                )
            ),
            useVirtual &&
				/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__[
                "createElement"
            ](_ScrollBar__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"], {
                ref: scrollBarRef,
                prefixCls: prefixCls,
                scrollTop: scrollTop,
                height: height,
                scrollHeight: scrollHeight,
                count: mergedData.length,
                onScroll: onScrollBar,
                onStartMove: function onStartMove() {
                    setScrollMoving(true);
                },
                onStopMove: function onStopMove() {
                    setScrollMoving(false);
                },
            })
        );
    }
    var List =
		/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__["forwardRef"](RawList);
    List.displayName = "List";
	/* harmony default export */ __webpack_exports__["a"] = List;

    /***/
})(
	/*!*************************************************!*\
  !*** ./node_modules/rc-virtual-list/es/List.js ***!
  \*************************************************/
	/*! exports provided: RawList, default */
	/*! exports used: default */
	/***/ function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* unused harmony export RawList */
        var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
			/*! react */ "react"
        );
        var react__WEBPACK_IMPORTED_MODULE_0___default =
			/*#__PURE__*/ __webpack_require__.n(
            react__WEBPACK_IMPORTED_MODULE_0__
        );
        var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
			/*! classnames */ "./node_modules/classnames/index.js"
        );
        var classnames__WEBPACK_IMPORTED_MODULE_1___default =
			/*#__PURE__*/ __webpack_require__.n(
            classnames__WEBPACK_IMPORTED_MODULE_1__
        );
        var _Filler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
			/*! ./Filler */ "./node_modules/rc-virtual-list/es/Filler.js"
        );
        var _ScrollBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
			/*! ./ScrollBar */ "./node_modules/rc-virtual-list/es/ScrollBar.js"
        );
        var _hooks_useChildren__WEBPACK_IMPORTED_MODULE_4__ =
            __webpack_require__(
				/*! ./hooks/useChildren */ "./node_modules/rc-virtual-list/es/hooks/useChildren.js"
            );
        var _hooks_useHeights__WEBPACK_IMPORTED_MODULE_5__ =
            __webpack_require__(
				/*! ./hooks/useHeights */ "./node_modules/rc-virtual-list/es/hooks/useHeights.js"
            );
        var _hooks_useScrollTo__WEBPACK_IMPORTED_MODULE_6__ =
            __webpack_require__(
				/*! ./hooks/useScrollTo */ "./node_modules/rc-virtual-list/es/hooks/useScrollTo.js"
            );
        var _hooks_useDiffItem__WEBPACK_IMPORTED_MODULE_7__ =
            __webpack_require__(
				/*! ./hooks/useDiffItem */ "./node_modules/rc-virtual-list/es/hooks/useDiffItem.js"
            );
        var _hooks_useFrameWheel__WEBPACK_IMPORTED_MODULE_8__ =
            __webpack_require__(
				/*! ./hooks/useFrameWheel */ "./node_modules/rc-virtual-list/es/hooks/useFrameWheel.js"
            );
        var _hooks_useMobileTouchMove__WEBPACK_IMPORTED_MODULE_9__ =
            __webpack_require__(
				/*! ./hooks/useMobileTouchMove */ "./node_modules/rc-virtual-list/es/hooks/useMobileTouchMove.js"
            );
        var _hooks_useOriginScroll__WEBPACK_IMPORTED_MODULE_10__ =
            __webpack_require__(
				/*! ./hooks/useOriginScroll */ "./node_modules/rc-virtual-list/es/hooks/useOriginScroll.js"
            );
        var _excluded = [
            "prefixCls",
            "className",
            "height",
            "itemHeight",
            "fullHeight",
            "style",
            "data",
            "children",
            "itemKey",
            "virtual",
            "component",
            "onScroll",
        ];

        function _extends() {
            _extends =
                Object.assign ||
                function (target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i];
                        for (var key in source) {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    source,
                                    key
                                )
                            ) {
                                target[key] = source[key];
                            }
                        }
                    }
                    return target;
                };
            return _extends.apply(this, arguments);
        }

        function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);
            if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                if (enumerableOnly) {
                    symbols = symbols.filter(function (sym) {
                        return Object.getOwnPropertyDescriptor(
                            object,
                            sym
                        ).enumerable;
                    });
                }
                keys.push.apply(keys, symbols);
            }
            return keys;
        }

        function _objectSpread(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i] != null ? arguments[i] : {};
                if (i % 2) {
                    ownKeys(Object(source), true).forEach(function (key) {
                        _defineProperty(target, key, source[key]);
                    });
                } else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(
                        target,
                        Object.getOwnPropertyDescriptors(source)
                    );
                } else {
                    ownKeys(Object(source)).forEach(function (key) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(source, key)
                        );
                    });
                }
            }
            return target;
        }

        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true,
                });
            } else {
                obj[key] = value;
            }
            return obj;
        }

        function _slicedToArray(arr, i) {
            return (
                _arrayWithHoles(arr) ||
                _iterableToArrayLimit(arr, i) ||
                _unsupportedIterableToArray(arr, i) ||
                _nonIterableRest()
            );
        }

        function _nonIterableRest() {
            throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
        }

        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (
                n === "Arguments" ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
            )
                return _arrayLikeToArray(o, minLen);
        }

        function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) {
                arr2[i] = arr[i];
            }
            return arr2;
        }

        function _iterableToArrayLimit(arr, i) {
            var _i =
                arr == null
                    ? null
                    : (typeof Symbol !== "undefined" && arr[Symbol.iterator]) ||
                    arr["@@iterator"];
            if (_i == null) return;
            var _arr = [];
            var _n = true;
            var _d = false;
            var _s, _e;
            try {
                for (
                    _i = _i.call(arr);
                    !(_n = (_s = _i.next()).done);
                    _n = true
                ) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"] != null) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }

        function _arrayWithHoles(arr) {
            if (Array.isArray(arr)) return arr;
        }

        function _objectWithoutProperties(source, excluded) {
            if (source == null) return {};
            var target = _objectWithoutPropertiesLoose(source, excluded);
            var key, i;
            if (Object.getOwnPropertySymbols) {
                var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
                for (i = 0; i < sourceSymbolKeys.length; i++) {
                    key = sourceSymbolKeys[i];
                    if (excluded.indexOf(key) >= 0) continue;
                    if (
                        !Object.prototype.propertyIsEnumerable.call(source, key)
                    )
                        continue;
                    target[key] = source[key];
                }
            }
            return target;
        }

        function _objectWithoutPropertiesLoose(source, excluded) {
            if (source == null) return {};
            var target = {};
            var sourceKeys = Object.keys(source);
            var key, i;
            for (i = 0; i < sourceKeys.length; i++) {
                key = sourceKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                target[key] = source[key];
            }
            return target;
        }

        var EMPTY_DATA = [];
        var ScrollStyle = {
            overflowY: "auto",
            overflowAnchor: "none",
        };
        function RawList(props, ref) {
            var _props$prefixCls = props.prefixCls,
                prefixCls =
                    _props$prefixCls === void 0
                        ? "rc-virtual-list"
                        : _props$prefixCls,
                className = props.className,
                height = props.height,
                itemHeight = props.itemHeight,
                _props$fullHeight = props.fullHeight,
                fullHeight =
                    _props$fullHeight === void 0 ? true : _props$fullHeight,
                style = props.style,
                data = props.data,
                children = props.children,
                itemKey = props.itemKey,
                virtual = props.virtual,
                _props$component = props.component,
                Component =
                    _props$component === void 0 ? "div" : _props$component,
                onScroll = props.onScroll,
                restProps = _objectWithoutProperties(props, _excluded); // ================================= MISC =================================

            var useVirtual = !!(virtual !== false && height && itemHeight);
            var inVirtual =
                useVirtual && data && itemHeight * data.length > height;

            var _useState = Object(
                react__WEBPACK_IMPORTED_MODULE_0__["useState"]
            )(0),
                _useState2 = _slicedToArray(_useState, 2),
                scrollTop = _useState2[0],
                setScrollTop = _useState2[1];

            var _useState3 = Object(
                react__WEBPACK_IMPORTED_MODULE_0__["useState"]
            )(false),
                _useState4 = _slicedToArray(_useState3, 2),
                scrollMoving = _useState4[0],
                setScrollMoving = _useState4[1];

            var mergedClassName =
                classnames__WEBPACK_IMPORTED_MODULE_1___default()(
                    prefixCls,
                    className
                );
            var mergedData = data || EMPTY_DATA;
            var componentRef = Object(
                react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
            )();
            var fillerInnerRef = Object(
                react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
            )();
            var scrollBarRef = Object(
                react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
            )(); // Hack on scrollbar to enable flash call
            // =============================== Item Key ===============================

            var getKey = react__WEBPACK_IMPORTED_MODULE_0__["useCallback"](
                function (item) {
                    if (typeof itemKey === "function") {
                        return itemKey(item);
                    }

                    return item === null || item === void 0
                        ? void 0
                        : item[itemKey];
                },
                [itemKey]
            );
            var sharedConfig = {
                getKey: getKey,
            }; // ================================ Scroll ================================

            function syncScrollTop(newTop) {
                setScrollTop(function (origin) {
                    var value;

                    if (typeof newTop === "function") {
                        value = newTop(origin);
                    } else {
                        value = newTop;
                    }

                    var alignedTop = keepInRange(value);
                    componentRef.current.scrollTop = alignedTop;
                    return alignedTop;
                });
            } // ================================ Legacy ================================
            // Put ref here since the range is generate by follow

            var rangeRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(
                {
                    start: 0,
                    end: mergedData.length,
                }
            );
            var diffItemRef = Object(
                react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
            )();

            var _useDiffItem = Object(
                _hooks_useDiffItem__WEBPACK_IMPORTED_MODULE_7__[
						/* default */ "a"
                ]
            )(mergedData, getKey),
                _useDiffItem2 = _slicedToArray(_useDiffItem, 1),
                diffItem = _useDiffItem2[0];

            diffItemRef.current = diffItem; // ================================ Height ================================

            var _useHeights = Object(
                _hooks_useHeights__WEBPACK_IMPORTED_MODULE_5__[
						/* default */ "a"
                ]
            )(getKey, null, null),
                _useHeights2 = _slicedToArray(_useHeights, 4),
                setInstanceRef = _useHeights2[0],
                collectHeight = _useHeights2[1],
                heights = _useHeights2[2],
                heightUpdatedMark = _useHeights2[3]; // ========================== Visible Calculation =========================

            var _React$useMemo = react__WEBPACK_IMPORTED_MODULE_0__["useMemo"](
                function () {
                    if (!useVirtual) {
                        return {
                            scrollHeight: undefined,
                            start: 0,
                            end: mergedData.length - 1,
                            offset: undefined,
                        };
                    } // Always use virtual scroll bar in avoid shaking

                    // Always use virtual scroll bar in avoid shaking
                    if (!inVirtual) {
                        var _fillerInnerRef$curre;

                        return {
                            scrollHeight:
                                ((_fillerInnerRef$curre =
                                    fillerInnerRef.current) === null ||
                                    _fillerInnerRef$curre === void 0
                                    ? void 0
                                    : _fillerInnerRef$curre.offsetHeight) ||
                                0,
                            start: 0,
                            end: mergedData.length - 1,
                            offset: undefined,
                        };
                    }

                    var itemTop = 0;
                    var startIndex;
                    var startOffset;
                    var endIndex;
                    var dataLen = mergedData.length;

                    for (var i = 0; i < dataLen; i += 1) {
                        var item = mergedData[i];
                        var key = getKey(item);
                        var cacheHeight = heights.get(key);
                        var currentItemBottom =
                            itemTop +
                            (cacheHeight === undefined
                                ? itemHeight
                                : cacheHeight); // Check item top in the range

                        // Check item top in the range
                        if (
                            currentItemBottom >= scrollTop &&
                            startIndex === undefined
                        ) {
                            startIndex = i;
                            startOffset = itemTop;
                        } // Check item bottom in the range. We will render additional one item for motion usage

                        // Check item bottom in the range. We will render additional one item for motion usage
                        if (
                            currentItemBottom > scrollTop + height &&
                            endIndex === undefined
                        ) {
                            endIndex = i;
                        }

                        itemTop = currentItemBottom;
                    } // Fallback to normal if not match. This code should never reach

                    /* istanbul ignore next */

                    // Fallback to normal if not match. This code should never reach

                    /* istanbul ignore next */
                    if (startIndex === undefined) {
                        startIndex = 0;
                        startOffset = 0;
                    }

                    if (endIndex === undefined) {
                        endIndex = mergedData.length - 1;
                    } // Give cache to improve scroll experience

                    // Give cache to improve scroll experience
                    endIndex = Math.min(endIndex + 1, mergedData.length);
                    return {
                        scrollHeight: itemTop,
                        start: startIndex,
                        end: endIndex,
                        offset: startOffset,
                    };
                },
                [
                    inVirtual,
                    useVirtual,
                    scrollTop,
                    mergedData,
                    heightUpdatedMark,
                    height,
                ]
            ),
                scrollHeight = _React$useMemo.scrollHeight,
                start = _React$useMemo.start,
                end = _React$useMemo.end,
                offset = _React$useMemo.offset;

            rangeRef.current.start = start;
            rangeRef.current.end = end; // =============================== In Range ===============================

            var maxScrollHeight = scrollHeight - height;
            var maxScrollHeightRef = Object(
                react__WEBPACK_IMPORTED_MODULE_0__["useRef"]
            )(maxScrollHeight);
            maxScrollHeightRef.current = maxScrollHeight;

            function keepInRange(newScrollTop) {
                var newTop = newScrollTop;

                if (!Number.isNaN(maxScrollHeightRef.current)) {
                    newTop = Math.min(newTop, maxScrollHeightRef.current);
                }

                newTop = Math.max(newTop, 0);
                return newTop;
            }

            var isScrollAtTop = scrollTop <= 0;
            var isScrollAtBottom = scrollTop >= maxScrollHeight;
            var originScroll = Object(
                _hooks_useOriginScroll__WEBPACK_IMPORTED_MODULE_10__[
					/* default */ "a"
                ]
            )(isScrollAtTop, isScrollAtBottom); // ================================ Scroll ================================

            function onScrollBar(newScrollTop) {
                var newTop = newScrollTop;
                syncScrollTop(newTop);
            } // When data size reduce. It may trigger native scroll event back to fit scroll position

            function onFallbackScroll(e) {
                var newScrollTop = e.currentTarget.scrollTop;

                if (newScrollTop !== scrollTop) {
                    syncScrollTop(newScrollTop);
                } // Trigger origin onScroll

                onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
            } // Since this added in global,should use ref to keep update

            var _useFrameWheel = Object(
                _hooks_useFrameWheel__WEBPACK_IMPORTED_MODULE_8__[
						/* default */ "a"
                ]
            )(
                useVirtual,
                isScrollAtTop,
                isScrollAtBottom,
                function (offsetY) {
                    syncScrollTop(function (top) {
                        var newTop = top + offsetY;
                        return newTop;
                    });
                }
            ),
                _useFrameWheel2 = _slicedToArray(_useFrameWheel, 2),
                onRawWheel = _useFrameWheel2[0],
                onFireFoxScroll = _useFrameWheel2[1]; // Mobile touch move

            Object(
                _hooks_useMobileTouchMove__WEBPACK_IMPORTED_MODULE_9__[
					/* default */ "a"
                ]
            )(useVirtual, componentRef, function (deltaY, smoothOffset) {
                if (originScroll(deltaY, smoothOffset)) {
                    return false;
                }

                onRawWheel({
                    preventDefault: function preventDefault() { },
                    deltaY: deltaY,
                });
                return true;
            });
            react__WEBPACK_IMPORTED_MODULE_0__["useLayoutEffect"](
                function () {
                    // Firefox only
                    function onMozMousePixelScroll(e) {
                        if (useVirtual) {
                            e.preventDefault();
                        }
                    }

                    componentRef.current.addEventListener("wheel", onRawWheel);
                    componentRef.current.addEventListener(
                        "DOMMouseScroll",
                        onFireFoxScroll
                    );
                    componentRef.current.addEventListener(
                        "MozMousePixelScroll",
                        onMozMousePixelScroll
                    );
                    return function () {
                        componentRef.current.removeEventListener(
                            "wheel",
                            onRawWheel
                        );
                        componentRef.current.removeEventListener(
                            "DOMMouseScroll",
                            onFireFoxScroll
                        );
                        componentRef.current.removeEventListener(
                            "MozMousePixelScroll",
                            onMozMousePixelScroll
                        );
                    };
                },
                [useVirtual]
            ); // ================================= Ref ==================================

            var scrollTo = Object(
                _hooks_useScrollTo__WEBPACK_IMPORTED_MODULE_6__[
					/* default */ "a"
                ]
            )(
                componentRef,
                mergedData,
                heights,
                itemHeight,
                getKey,
                collectHeight,
                syncScrollTop,
                function () {
                    var _scrollBarRef$current;

                    (_scrollBarRef$current = scrollBarRef.current) === null ||
                        _scrollBarRef$current === void 0
                        ? void 0
                        : _scrollBarRef$current.delayHidden();
                }
            );
            react__WEBPACK_IMPORTED_MODULE_0__["useImperativeHandle"](
                ref,
                function () {
                    return {
                        scrollTo: scrollTo,
                    };
                }
            ); // ================================ Render ================================

            var listChildren = Object(
                _hooks_useChildren__WEBPACK_IMPORTED_MODULE_4__[
					/* default */ "a"
                ]
            )(mergedData, start, end, setInstanceRef, children, sharedConfig);
            var componentStyle = null;

            if (height) {
                componentStyle = _objectSpread(
                    _defineProperty(
                        {},
                        fullHeight ? "height" : "maxHeight",
                        height
                    ),
                    ScrollStyle
                );

                if (useVirtual) {
                    componentStyle.overflowY = "hidden";

                    if (scrollMoving) {
                        componentStyle.pointerEvents = "none";
                    }
                }
            }

            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__[
                "createElement"
            ](
                "div",
                _extends(
                    {
                        style: _objectSpread(
                            _objectSpread({}, style),
                            {},
                            {
                                position: "relative",
                            }
                        ),
                        className: mergedClassName,
                    },
                    restProps
                ),
				/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__[
                    "createElement"
                ](
                    Component,
                    {
                        className: "".concat(prefixCls, "-holder"),
                        style: componentStyle,
                        ref: componentRef,
                        onScroll: onFallbackScroll,
                    },
					/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__[
                        "createElement"
                    ](
                        _Filler__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"],
                        {
                            prefixCls: prefixCls,
                            height: scrollHeight,
                            offset: offset,
                            onInnerResize: collectHeight,
                            ref: fillerInnerRef,
                        },
                        listChildren
                    )
                ),
                useVirtual &&
					/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__[
                    "createElement"
                ](
                    _ScrollBar__WEBPACK_IMPORTED_MODULE_3__[
							/* default */ "a"
                    ],
                    {
                        ref: scrollBarRef,
                        prefixCls: prefixCls,
                        scrollTop: scrollTop,
                        height: height,
                        scrollHeight: scrollHeight,
                        count: mergedData.length,
                        onScroll: onScrollBar,
                        onStartMove: function onStartMove() {
                            setScrollMoving(true);
                        },
                        onStopMove: function onStopMove() {
                            setScrollMoving(false);
                        },
                    }
                )
            );
        }
        var List =
			/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__["forwardRef"](
            RawList
        );
        List.displayName = "List";
		/* harmony default export */ __webpack_exports__["a"] = List;

        /***/
    }
);