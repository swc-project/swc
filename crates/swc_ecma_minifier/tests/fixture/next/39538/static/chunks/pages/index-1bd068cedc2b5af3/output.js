(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        405
    ],
    {
        /***/ 1412: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            exports.Z = function(obj, key, value) {
                return key in obj ? Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : obj[key] = value, obj;
            };
        /***/ },
        /***/ 5702: /***/ function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return __webpack_require__(1107);
                }
            ]);
        /***/ },
        /***/ 9838: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var _defineProperty = __webpack_require__(1412)/* ["default"] */ .Z, _slicedToArray = __webpack_require__(8693)/* ["default"] */ .Z, _toConsumableArray = __webpack_require__(9947)/* ["default"] */ .Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = function(_param) {
                var src, sizerSvgUrl, _obj, src1 = _param.src, sizes = _param.sizes, _unoptimized = _param.unoptimized, unoptimized = void 0 !== _unoptimized && _unoptimized, _priority = _param.priority, priority = void 0 !== _priority && _priority, loading = _param.loading, _lazyRoot = _param.lazyRoot, lazyBoundary = _param.lazyBoundary, className = _param.className, quality = _param.quality, width = _param.width, height = _param.height, style = _param.style, objectFit = _param.objectFit, objectPosition = _param.objectPosition, onLoadingComplete = _param.onLoadingComplete, _placeholder = _param.placeholder, placeholder = void 0 === _placeholder ? "empty" : _placeholder, blurDataURL = _param.blurDataURL, all = _object_without_properties_loose(_param, [
                    "src",
                    "sizes",
                    "unoptimized",
                    "priority",
                    "loading",
                    "lazyRoot",
                    "lazyBoundary",
                    "className",
                    "quality",
                    "width",
                    "height",
                    "style",
                    "objectFit",
                    "objectPosition",
                    "onLoadingComplete",
                    "placeholder",
                    "blurDataURL"
                ]), configContext = _react.useContext(_imageConfigContext.ImageConfigContext), config = _react.useMemo(function() {
                    var c = configEnv || configContext || _imageConfig.imageConfigDefault, allSizes = _toConsumableArray(c.deviceSizes).concat(_toConsumableArray(c.imageSizes)).sort(function(a, b) {
                        return a - b;
                    }), deviceSizes = c.deviceSizes.sort(function(a, b) {
                        return a - b;
                    });
                    return _extends({}, c, {
                        allSizes: allSizes,
                        deviceSizes: deviceSizes
                    });
                }, [
                    configContext
                ]), layout = sizes ? "responsive" : "intrinsic";
                "layout" in all && (all.layout && (layout = all.layout), // Remove property so it's not spread on <img>:
                delete all.layout);
                var loader = defaultImageLoader;
                if ("loader" in all) {
                    if (all.loader) {
                        var customImageLoader = all.loader;
                        loader = function(obj) {
                            // The config object is internal only so we must
                            // not pass it to the user-defined loader()
                            return obj.config, customImageLoader(_object_without_properties_loose(obj, [
                                "config"
                            ]));
                        };
                    }
                    // Remove property so it's not spread on <img>
                    delete all.loader;
                }
                var staticSrc = "";
                if ("object" == typeof (src = src1) && (isStaticRequire(src) || void 0 !== src.src)) {
                    var staticImageData = isStaticRequire(src1) ? src1.default : src1;
                    if (!staticImageData.src) throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(staticImageData)));
                    if (blurDataURL = blurDataURL || staticImageData.blurDataURL, staticSrc = staticImageData.src, (!layout || "fill" !== layout) && (height = height || staticImageData.height, width = width || staticImageData.width, !staticImageData.height || !staticImageData.width)) throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(staticImageData)));
                }
                var isLazy = !priority && ("lazy" === loading || void 0 === loading);
                ((src1 = "string" == typeof src1 ? src1 : staticSrc).startsWith("data:") || src1.startsWith("blob:")) && (// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
                unoptimized = !0, isLazy = !1), loadedImageURLs.has(src1) && (isLazy = !1), experimentalUnoptimized && (unoptimized = !0);
                var ref = _slicedToArray(_react.useState(!1), 2), blurComplete = ref[0], setBlurComplete = ref[1], ref1 = _slicedToArray(_useIntersection.useIntersection({
                    rootRef: void 0 === _lazyRoot ? null : _lazyRoot,
                    rootMargin: lazyBoundary || "200px",
                    disabled: !isLazy
                }), 3), setIntersection = ref1[0], isIntersected = ref1[1], resetIntersected = ref1[2], isVisible = !isLazy || isIntersected, wrapperStyle = {
                    boxSizing: "border-box",
                    display: "block",
                    overflow: "hidden",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0
                }, sizerStyle = {
                    boxSizing: "border-box",
                    display: "block",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0
                }, hasSizer = !1, widthInt = getInt(width), heightInt = getInt(height), qualityInt = getInt(quality), imgStyle = Object.assign({}, style, {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    boxSizing: "border-box",
                    padding: 0,
                    border: "none",
                    margin: "auto",
                    display: "block",
                    width: 0,
                    height: 0,
                    minWidth: "100%",
                    maxWidth: "100%",
                    minHeight: "100%",
                    maxHeight: "100%",
                    objectFit: objectFit,
                    objectPosition: objectPosition
                }), blurStyle = "blur" !== placeholder || blurComplete ? {} : {
                    backgroundSize: objectFit || "cover",
                    backgroundPosition: objectPosition || "0% 0%",
                    filter: "blur(20px)",
                    backgroundImage: 'url("'.concat(blurDataURL, '")')
                };
                if ("fill" === layout) // <Image src="i.png" layout="fill" />
                wrapperStyle.display = "block", wrapperStyle.position = "absolute", wrapperStyle.top = 0, wrapperStyle.left = 0, wrapperStyle.bottom = 0, wrapperStyle.right = 0;
                else if (void 0 !== widthInt && void 0 !== heightInt) {
                    // <Image src="i.png" width="100" height="100" />
                    var quotient = heightInt / widthInt, paddingTop = isNaN(quotient) ? "100%" : "".concat(100 * quotient, "%");
                    "responsive" === layout ? (// <Image src="i.png" width="100" height="100" layout="responsive" />
                    wrapperStyle.display = "block", wrapperStyle.position = "relative", hasSizer = !0, sizerStyle.paddingTop = paddingTop) : "intrinsic" === layout ? (// <Image src="i.png" width="100" height="100" layout="intrinsic" />
                    wrapperStyle.display = "inline-block", wrapperStyle.position = "relative", wrapperStyle.maxWidth = "100%", hasSizer = !0, sizerStyle.maxWidth = "100%", sizerSvgUrl = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(widthInt, "%27%20height=%27").concat(heightInt, "%27/%3e")) : "fixed" === layout && (// <Image src="i.png" width="100" height="100" layout="fixed" />
                    wrapperStyle.display = "inline-block", wrapperStyle.position = "relative", wrapperStyle.width = widthInt, wrapperStyle.height = heightInt);
                }
                var imgAttributes = {
                    src: emptyDataURL,
                    srcSet: void 0,
                    sizes: void 0
                };
                isVisible && (imgAttributes = generateImgAttrs({
                    config: config,
                    src: src1,
                    unoptimized: unoptimized,
                    layout: layout,
                    width: widthInt,
                    quality: qualityInt,
                    sizes: sizes,
                    loader: loader
                }));
                var srcString = src1, imageSizesPropName = "imagesizes";
                imageSizesPropName = "imageSizes";
                var linkProps = (_defineProperty(_obj = {}, "imageSrcSet", imgAttributes.srcSet), _defineProperty(_obj, imageSizesPropName, imgAttributes.sizes), _obj), useLayoutEffect = _react.default.useLayoutEffect, onLoadingCompleteRef = _react.useRef(onLoadingComplete), previousImageSrc = _react.useRef(src1);
                _react.useEffect(function() {
                    onLoadingCompleteRef.current = onLoadingComplete;
                }, [
                    onLoadingComplete
                ]), useLayoutEffect(function() {
                    previousImageSrc.current !== src1 && (resetIntersected(), previousImageSrc.current = src1);
                }, [
                    resetIntersected,
                    src1
                ]);
                var imgElementArgs = _extends({
                    isLazy: isLazy,
                    imgAttributes: imgAttributes,
                    heightInt: heightInt,
                    widthInt: widthInt,
                    qualityInt: qualityInt,
                    layout: layout,
                    className: className,
                    imgStyle: imgStyle,
                    blurStyle: blurStyle,
                    loading: loading,
                    config: config,
                    unoptimized: unoptimized,
                    placeholder: placeholder,
                    loader: loader,
                    srcString: srcString,
                    onLoadingCompleteRef: onLoadingCompleteRef,
                    setBlurComplete: setBlurComplete,
                    setIntersection: setIntersection,
                    isVisible: isVisible,
                    noscriptSizes: sizes
                }, all);
                return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("span", {
                    style: wrapperStyle
                }, hasSizer ? /*#__PURE__*/ _react.default.createElement("span", {
                    style: sizerStyle
                }, sizerSvgUrl ? /*#__PURE__*/ _react.default.createElement("img", {
                    style: {
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0
                    },
                    alt: "",
                    "aria-hidden": !0,
                    src: sizerSvgUrl
                }) : null) : null, /*#__PURE__*/ _react.default.createElement(ImageElement, Object.assign({}, imgElementArgs))), priority ? // it would likely cause the incorrect image to be preloaded.
                //
                // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
                /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("link", Object.assign({
                    key: "__nimg-" + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
                    rel: "preload",
                    as: "image",
                    href: imgAttributes.srcSet ? void 0 : imgAttributes.src
                }, linkProps))) : null);
            };
            var _extends = __webpack_require__(2769)/* ["default"] */ .Z, _interop_require_default = __webpack_require__(4507)/* ["default"] */ .Z, _interop_require_wildcard = __webpack_require__(8167)/* ["default"] */ .Z, _object_without_properties_loose = __webpack_require__(4719)/* ["default"] */ .Z, _react = _interop_require_wildcard(__webpack_require__(959)), _head = _interop_require_default(__webpack_require__(4357)), _imageConfig = __webpack_require__(1773), _useIntersection = __webpack_require__(757), _imageConfigContext = __webpack_require__(9664);
            __webpack_require__(8827);
            var _normalizeTrailingSlash = __webpack_require__(8236), ref = {
                deviceSizes: [
                    640,
                    750,
                    828,
                    1080,
                    1200,
                    1920,
                    2048,
                    3840
                ],
                imageSizes: [
                    16,
                    32,
                    48,
                    64,
                    96,
                    128,
                    256,
                    384
                ],
                path: "/_next/image",
                loader: "default",
                dangerouslyAllowSVG: !1
            }, experimentalUnoptimized = (ref.experimentalRemotePatterns, ref.experimentalUnoptimized), configEnv = {
                deviceSizes: [
                    640,
                    750,
                    828,
                    1080,
                    1200,
                    1920,
                    2048,
                    3840
                ],
                imageSizes: [
                    16,
                    32,
                    48,
                    64,
                    96,
                    128,
                    256,
                    384
                ],
                path: "/_next/image",
                loader: "default",
                dangerouslyAllowSVG: !1
            }, loadedImageURLs = new Set(), emptyDataURL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", loaders = new Map([
                [
                    "default",
                    function(param) {
                        var config = param.config, src = param.src, width = param.width, quality = param.quality;
                        return src.endsWith(".svg") && !config.dangerouslyAllowSVG ? src : "".concat(_normalizeTrailingSlash.normalizePathTrailingSlash(config.path), "?url=").concat(encodeURIComponent(src), "&w=").concat(width, "&q=").concat(quality || 75);
                    }
                ],
                [
                    "imgix",
                    function(param) {
                        var config = param.config, src = param.src, width = param.width, quality = param.quality, url = new URL("".concat(config.path).concat(normalizeSrc(src))), params = url.searchParams;
                        return(// auto params can be combined with comma separation, or reiteration
                        params.set("auto", params.getAll("auto").join(",") || "format"), params.set("fit", params.get("fit") || "max"), params.set("w", params.get("w") || width.toString()), quality && params.set("q", quality.toString()), url.href);
                    }
                ],
                [
                    "cloudinary",
                    function(param) {
                        var config = param.config, src = param.src, paramsString = [
                            "f_auto",
                            "c_limit",
                            "w_" + param.width,
                            "q_" + (param.quality || "auto")
                        ].join(",") + "/";
                        return "".concat(config.path).concat(paramsString).concat(normalizeSrc(src));
                    }
                ],
                [
                    "akamai",
                    function(param) {
                        var config = param.config, src = param.src, width = param.width;
                        return "".concat(config.path).concat(normalizeSrc(src), "?imwidth=").concat(width);
                    }
                ],
                [
                    "custom",
                    function(param) {
                        var src = param.src;
                        throw Error('Image with src "'.concat(src, '" is missing "loader" prop.') + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader");
                    }
                ]
            ]);
            function isStaticRequire(src) {
                return void 0 !== src.default;
            }
            function generateImgAttrs(param) {
                var config = param.config, src = param.src, unoptimized = param.unoptimized, layout = param.layout, width = param.width, quality = param.quality, sizes = param.sizes, loader = param.loader;
                if (unoptimized) return {
                    src: src,
                    srcSet: void 0,
                    sizes: void 0
                };
                var ref = function(param, width, layout, sizes) {
                    var deviceSizes = param.deviceSizes, allSizes = param.allSizes;
                    if (sizes && ("fill" === layout || "responsive" === layout)) {
                        for(// Find all the "vw" percent sizes used in the sizes prop
                        var viewportWidthRe = /(^|\s)(1?\d?\d)vw/g, percentSizes = []; match = viewportWidthRe.exec(sizes); match)percentSizes.push(parseInt(match[2]));
                        if (percentSizes.length) {
                            var match, _Math, smallestRatio = 0.01 * (_Math = Math).min.apply(_Math, _toConsumableArray(percentSizes));
                            return {
                                widths: allSizes.filter(function(s) {
                                    return s >= deviceSizes[0] * smallestRatio;
                                }),
                                kind: "w"
                            };
                        }
                        return {
                            widths: allSizes,
                            kind: "w"
                        };
                    }
                    return "number" != typeof width || "fill" === layout || "responsive" === layout ? {
                        widths: deviceSizes,
                        kind: "w"
                    } : {
                        widths: _toConsumableArray(new Set(// > blue colors. Showing a 3x resolution image in the app vs a 2x
                        // > resolution image will be visually the same, though the 3x image
                        // > takes significantly more data. Even true 3x resolution screens are
                        // > wasteful as the human eye cannot see that level of detail without
                        // > something like a magnifying glass.
                        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
                        [
                            width,
                            2 /*, width * 3*/  * width
                        ].map(function(w) {
                            return allSizes.find(function(p) {
                                return p >= w;
                            }) || allSizes[allSizes.length - 1];
                        }))),
                        kind: "x"
                    };
                }(config, width, layout, sizes), widths = ref.widths, kind = ref.kind, last = widths.length - 1;
                return {
                    sizes: sizes || "w" !== kind ? sizes : "100vw",
                    srcSet: widths.map(function(w, i) {
                        return "".concat(loader({
                            config: config,
                            src: src,
                            quality: quality,
                            width: w
                        }), " ").concat("w" === kind ? w : i + 1).concat(kind);
                    }).join(", "),
                    // It's intended to keep `src` the last attribute because React updates
                    // attributes in order. If we keep `src` the first one, Safari will
                    // immediately start to fetch `src`, before `sizes` and `srcSet` are even
                    // updated by React. That causes multiple unnecessary requests if `srcSet`
                    // and `sizes` are defined.
                    // This bug cannot be reproduced in Chrome or Firefox.
                    src: loader({
                        config: config,
                        src: src,
                        quality: quality,
                        width: widths[last]
                    })
                };
            }
            function getInt(x) {
                return "number" == typeof x ? x : "string" == typeof x ? parseInt(x, 10) : void 0;
            }
            function defaultImageLoader(loaderProps) {
                var ref, loaderKey = (null == (ref = loaderProps.config) ? void 0 : ref.loader) || "default", load = loaders.get(loaderKey);
                if (load) return load(loaderProps);
                throw Error('Unknown "loader" found in "next.config.js". Expected: '.concat(_imageConfig.VALID_LOADERS.join(", "), ". Received: ").concat(loaderKey));
            }
            // See https://stackoverflow.com/q/39777833/266535 for why we use this ref
            // handler instead of the img's onLoad attribute.
            function handleLoading(img, src, layout, placeholder, onLoadingCompleteRef, setBlurComplete) {
                img && img.src !== emptyDataURL && img["data-loaded-src"] !== src && (img["data-loaded-src"] = src, ("decode" in img ? img.decode() : Promise.resolve()).catch(function() {}).then(function() {
                    if (img.parentNode && (loadedImageURLs.add(src), "blur" === placeholder && setBlurComplete(!0), null == onLoadingCompleteRef ? void 0 : onLoadingCompleteRef.current)) {
                        var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
                        // Pass back read-only primitive values but not the
                        // underlying DOM element because it could be misused.
                        onLoadingCompleteRef.current({
                            naturalWidth: naturalWidth,
                            naturalHeight: naturalHeight
                        });
                    }
                }));
            }
            var ImageElement = function(_param) {
                var imgAttributes = _param.imgAttributes, widthInt = (_param.heightInt, _param.widthInt), qualityInt = _param.qualityInt, layout = _param.layout, className = _param.className, imgStyle = _param.imgStyle, blurStyle = _param.blurStyle, isLazy = _param.isLazy, placeholder = _param.placeholder, loading = _param.loading, srcString = _param.srcString, config = _param.config, unoptimized = _param.unoptimized, loader = _param.loader, onLoadingCompleteRef = _param.onLoadingCompleteRef, setBlurComplete = _param.setBlurComplete, setIntersection = _param.setIntersection, onLoad = _param.onLoad, onError = _param.onError, noscriptSizes = (_param.isVisible, _param.noscriptSizes), rest = _object_without_properties_loose(_param, [
                    "imgAttributes",
                    "heightInt",
                    "widthInt",
                    "qualityInt",
                    "layout",
                    "className",
                    "imgStyle",
                    "blurStyle",
                    "isLazy",
                    "placeholder",
                    "loading",
                    "srcString",
                    "config",
                    "unoptimized",
                    "loader",
                    "onLoadingCompleteRef",
                    "setBlurComplete",
                    "setIntersection",
                    "onLoad",
                    "onError",
                    "isVisible",
                    "noscriptSizes"
                ]);
                return loading = isLazy ? "lazy" : loading, /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("img", Object.assign({}, rest, imgAttributes, {
                    decoding: "async",
                    "data-nimg": layout,
                    className: className,
                    style: _extends({}, imgStyle, blurStyle),
                    ref: _react.useCallback(function(img) {
                        setIntersection(img), (null == img ? void 0 : img.complete) && handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
                    }, [
                        setIntersection,
                        srcString,
                        layout,
                        placeholder,
                        onLoadingCompleteRef,
                        setBlurComplete
                    ]),
                    onLoad: function(event) {
                        handleLoading(event.currentTarget, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete), onLoad && onLoad(event);
                    },
                    onError: function(event) {
                        "blur" === placeholder && // If the real image fails to load, this will still remove the placeholder.
                        setBlurComplete(!0), onError && onError(event);
                    }
                })), (isLazy || "blur" === placeholder) && /*#__PURE__*/ _react.default.createElement("noscript", null, /*#__PURE__*/ _react.default.createElement("img", Object.assign({}, rest, generateImgAttrs({
                    config: config,
                    src: srcString,
                    unoptimized: unoptimized,
                    layout: layout,
                    width: widthInt,
                    quality: qualityInt,
                    sizes: noscriptSizes,
                    loader: loader
                }), {
                    decoding: "async",
                    "data-nimg": layout,
                    style: imgStyle,
                    className: className,
                    // @ts-ignore - TODO: upgrade to `@types/react@17`
                    loading: loading
                }))));
            };
            function normalizeSrc(src) {
                return "/" === src[0] ? src.slice(1) : src;
            }
            ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 757: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var _slicedToArray = __webpack_require__(8693)/* ["default"] */ .Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.useIntersection = function(param) {
                var rootRef = param.rootRef, rootMargin = param.rootMargin, isDisabled = param.disabled || !hasIntersectionObserver, unobserve = _react.useRef(), ref = _slicedToArray(_react.useState(!1), 2), visible = ref[0], setVisible = ref[1], ref1 = _slicedToArray(_react.useState(null), 2), element = ref1[0], setElement = ref1[1];
                return _react.useEffect(function() {
                    if (hasIntersectionObserver) {
                        if (unobserve.current && (unobserve.current(), unobserve.current = void 0), !isDisabled && !visible) {
                            var callback, ref, id, observer, elements;
                            return element && element.tagName && (unobserve.current = (callback = function(isVisible) {
                                return isVisible && setVisible(isVisible);
                            }, id = (ref = function(options) {
                                var instance, id = {
                                    root: options.root || null,
                                    margin: options.rootMargin || ""
                                }, existing = idList.find(function(obj) {
                                    return obj.root === id.root && obj.margin === id.margin;
                                });
                                if (existing && (instance = observers.get(existing))) return instance;
                                var elements = new Map();
                                return instance = {
                                    id: id,
                                    observer: new IntersectionObserver(function(entries) {
                                        entries.forEach(function(entry) {
                                            var callback = elements.get(entry.target), isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
                                            callback && isVisible && callback(isVisible);
                                        });
                                    }, options),
                                    elements: elements
                                }, idList.push(id), observers.set(id, instance), instance;
                            }({
                                root: null == rootRef ? void 0 : rootRef.current,
                                rootMargin: rootMargin
                            })).id, observer = ref.observer, (elements = ref.elements).set(element, callback), observer.observe(element), function() {
                                // Destroy observer when there's nothing left to watch:
                                if (elements.delete(element), observer.unobserve(element), 0 === elements.size) {
                                    observer.disconnect(), observers.delete(id);
                                    var index = idList.findIndex(function(obj) {
                                        return obj.root === id.root && obj.margin === id.margin;
                                    });
                                    index > -1 && idList.splice(index, 1);
                                }
                            })), function() {
                                null == unobserve.current || unobserve.current(), unobserve.current = void 0;
                            };
                        }
                    } else if (!visible) {
                        var idleCallback = _requestIdleCallback.requestIdleCallback(function() {
                            return setVisible(!0);
                        });
                        return function() {
                            return _requestIdleCallback.cancelIdleCallback(idleCallback);
                        };
                    }
                }, [
                    element,
                    isDisabled,
                    rootMargin,
                    rootRef,
                    visible
                ]), [
                    setElement,
                    visible,
                    _react.useCallback(function() {
                        setVisible(!1);
                    }, [])
                ];
            };
            var _react = __webpack_require__(959), _requestIdleCallback = __webpack_require__(6501), hasIntersectionObserver = "function" == typeof IntersectionObserver, observers = new Map(), idList = [];
            ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 1107: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            // ESM COMPAT FLAG
            __webpack_require__.r(__webpack_exports__), // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return /* binding */ pages;
                }
            });
            // EXTERNAL MODULE: ./node_modules/.pnpm/react@18.2.0/node_modules/react/jsx-runtime.js
            var jsx_runtime = __webpack_require__(1527), head = __webpack_require__(6224), head_default = /*#__PURE__*/ __webpack_require__.n(head), next_image = __webpack_require__(8206), image_default = /*#__PURE__*/ __webpack_require__.n(next_image), react = __webpack_require__(959), Home_module = __webpack_require__(9915), Home_module_default = /*#__PURE__*/ __webpack_require__.n(Home_module), preloadImage = function() {
                new Image(40, 40).src = "/vercel.svg";
            }, pages = function() {
                return (0, react.useEffect)(function() {
                    console.log(40), preloadImage();
                }, []), /*#__PURE__*/ (0, jsx_runtime.jsxs)("div", {
                    className: Home_module_default().container,
                    children: [
                        /*#__PURE__*/ (0, jsx_runtime.jsxs)(head_default(), {
                            children: [
                                /*#__PURE__*/ (0, jsx_runtime.jsx)("title", {
                                    children: "Create Next App"
                                }),
                                /*#__PURE__*/ (0, jsx_runtime.jsx)("meta", {
                                    name: "description",
                                    content: "Generated by create next app"
                                }),
                                /*#__PURE__*/ (0, jsx_runtime.jsx)("link", {
                                    rel: "icon",
                                    href: "/favicon.ico"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, jsx_runtime.jsxs)("main", {
                            className: Home_module_default().main,
                            children: [
                                /*#__PURE__*/ (0, jsx_runtime.jsxs)("h1", {
                                    className: Home_module_default().title,
                                    children: [
                                        "Welcome to ",
                                        /*#__PURE__*/ (0, jsx_runtime.jsx)("a", {
                                            href: "https://nextjs.org",
                                            children: "Next.js!"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0, jsx_runtime.jsxs)("p", {
                                    className: Home_module_default().description,
                                    children: [
                                        "Get started by editing",
                                        " ",
                                        /*#__PURE__*/ (0, jsx_runtime.jsx)("code", {
                                            className: Home_module_default().code,
                                            children: "pages/index.tsx"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0, jsx_runtime.jsxs)("div", {
                                    className: Home_module_default().grid,
                                    children: [
                                        /*#__PURE__*/ (0, jsx_runtime.jsxs)("a", {
                                            href: "https://nextjs.org/docs",
                                            className: Home_module_default().card,
                                            children: [
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("h2", {
                                                    children: "Documentation →"
                                                }),
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("p", {
                                                    children: "Find in-depth information about Next.js features and API."
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0, jsx_runtime.jsxs)("a", {
                                            href: "https://nextjs.org/learn",
                                            className: Home_module_default().card,
                                            children: [
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("h2", {
                                                    children: "Learn →"
                                                }),
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("p", {
                                                    children: "Learn about Next.js in an interactive course with quizzes!"
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0, jsx_runtime.jsxs)("a", {
                                            href: "https://github.com/vercel/next.js/tree/canary/examples",
                                            className: Home_module_default().card,
                                            children: [
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("h2", {
                                                    children: "Examples →"
                                                }),
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("p", {
                                                    children: "Discover and deploy boilerplate example Next.js projects."
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0, jsx_runtime.jsxs)("a", {
                                            href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                            className: Home_module_default().card,
                                            children: [
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("h2", {
                                                    children: "Deploy →"
                                                }),
                                                /*#__PURE__*/ (0, jsx_runtime.jsx)("p", {
                                                    children: "Instantly deploy your Next.js site to a public URL with Vercel."
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, jsx_runtime.jsx)("footer", {
                            className: Home_module_default().footer,
                            children: /*#__PURE__*/ (0, jsx_runtime.jsxs)("a", {
                                href: "https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: [
                                    "Powered by",
                                    " ",
                                    /*#__PURE__*/ (0, jsx_runtime.jsx)("span", {
                                        className: Home_module_default().logo,
                                        children: /*#__PURE__*/ (0, jsx_runtime.jsx)(image_default(), {
                                            src: "/vercel.svg",
                                            alt: "Vercel Logo",
                                            width: 72,
                                            height: 16
                                        })
                                    })
                                ]
                            })
                        })
                    ]
                });
            };
        /***/ },
        /***/ 9915: /***/ function(module) {
            // extracted by mini-css-extract-plugin
            module.exports = {
                container: "Home_container__bCOhY",
                main: "Home_main__nLjiQ",
                footer: "Home_footer____T7K",
                title: "Home_title__T09hD",
                description: "Home_description__41Owk",
                code: "Home_code__suPER",
                grid: "Home_grid__GxQ85",
                card: "Home_card___LpL1",
                logo: "Home_logo__27_tb"
            };
        /***/ },
        /***/ 6224: /***/ function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(4357);
        /***/ },
        /***/ 8206: /***/ function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(9838);
        /***/ }
    },
    /******/ function(__webpack_require__) {
        /******/ __webpack_require__.O(0, [
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 5702);
        }), /******/ _N_E = __webpack_require__.O();
    /******/ }
]);
