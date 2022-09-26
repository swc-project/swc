(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        405
    ],
    {
        9361: function(__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;
            __webpack_unused_export__ = {
                value: true
            };
            exports.Z = function(obj, key, value) {
                if (key in obj) Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
                else obj[key] = value;
                return obj;
            };
        },
        8312: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return __webpack_require__(5075);
                }
            ]);
            if (false) ;
        },
        8045: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var _defineProperty = __webpack_require__(9361).Z;
            var _slicedToArray = __webpack_require__(4941).Z;
            var _toConsumableArray = __webpack_require__(3929).Z;
            "client";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = function(_param) {
                var src = _param.src, sizes = _param.sizes, _unoptimized = _param.unoptimized, unoptimized = void 0 !== _unoptimized && _unoptimized, _priority = _param.priority, priority = void 0 !== _priority && _priority, loading = _param.loading, _lazyRoot = _param.lazyRoot, lazyRoot = void 0 === _lazyRoot ? null : _lazyRoot, lazyBoundary = _param.lazyBoundary, className = _param.className, quality = _param.quality, width = _param.width, height = _param.height, style = _param.style, objectFit = _param.objectFit, objectPosition = _param.objectPosition, onLoadingComplete = _param.onLoadingComplete, _placeholder = _param.placeholder, placeholder = void 0 === _placeholder ? "empty" : _placeholder, blurDataURL = _param.blurDataURL, all = _object_without_properties_loose(_param, [
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
                ]);
                var configContext = _react.useContext(_imageConfigContext.ImageConfigContext);
                var config = _react.useMemo(function() {
                    var c = configEnv || configContext || _imageConfig.imageConfigDefault;
                    var allSizes = _toConsumableArray(c.deviceSizes).concat(_toConsumableArray(c.imageSizes)).sort(function(a, b) {
                        return a - b;
                    });
                    var deviceSizes = c.deviceSizes.sort(function(a, b) {
                        return a - b;
                    });
                    return _extends({}, c, {
                        allSizes: allSizes,
                        deviceSizes: deviceSizes
                    });
                }, [
                    configContext
                ]);
                var rest = all;
                var layout = sizes ? "responsive" : "intrinsic";
                if ("layout" in rest) {
                    if (rest.layout) layout = rest.layout;
                    delete rest.layout;
                }
                var loader = defaultImageLoader;
                if ("loader" in rest) {
                    if (rest.loader) {
                        var customImageLoader = rest.loader;
                        var _tmp;
                        _tmp = function(obj) {
                            var _ = obj.config, opts = _object_without_properties_loose(obj, [
                                "config"
                            ]);
                            return customImageLoader(opts);
                        }, loader = _tmp;
                    }
                    delete rest.loader;
                }
                var staticSrc = "";
                var src1;
                if ("object" == typeof (src1 = src) && (isStaticRequire(src1) || void 0 !== src1.src)) {
                    var staticImageData = isStaticRequire(src) ? src.default : src;
                    if (!staticImageData.src) {
                        throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(staticImageData)));
                    }
                    blurDataURL = blurDataURL || staticImageData.blurDataURL;
                    staticSrc = staticImageData.src;
                    if (!layout || "fill" !== layout) {
                        height = height || staticImageData.height;
                        width = width || staticImageData.width;
                        if (!staticImageData.height || !staticImageData.width) {
                            throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(staticImageData)));
                        }
                    }
                }
                src = "string" == typeof src ? src : staticSrc;
                var isLazy = !priority && ("lazy" === loading || void 0 === loading);
                if (src.startsWith("data:") || src.startsWith("blob:")) {
                    unoptimized = true;
                    isLazy = false;
                }
                if (loadedImageURLs.has(src)) isLazy = false;
                if (config.unoptimized) unoptimized = true;
                var ref = _slicedToArray(_react.useState(false), 2), blurComplete = ref[0], setBlurComplete = ref[1];
                var ref1 = _slicedToArray(_useIntersection.useIntersection({
                    rootRef: lazyRoot,
                    rootMargin: lazyBoundary || "200px",
                    disabled: !isLazy
                }), 3), setIntersection = ref1[0], isIntersected = ref1[1], resetIntersected = ref1[2];
                var isVisible = !isLazy || isIntersected;
                var wrapperStyle = {
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
                };
                var sizerStyle = {
                    boxSizing: "border-box",
                    display: "block",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0
                };
                var hasSizer = false;
                var sizerSvgUrl;
                var layoutStyle = {
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
                };
                var widthInt = getInt(width);
                var heightInt = getInt(height);
                var qualityInt = getInt(quality);
                if (false) var overwrittenStyles, url, urlStr, VALID_BLUR_EXT;
                var imgStyle = Object.assign({}, style, layoutStyle);
                var blurStyle = "blur" !== placeholder || blurComplete ? {} : {
                    backgroundSize: objectFit || "cover",
                    backgroundPosition: objectPosition || "0% 0%",
                    filter: "blur(20px)",
                    backgroundImage: 'url("'.concat(blurDataURL, '")')
                };
                if ("fill" === layout) {
                    wrapperStyle.display = "block";
                    wrapperStyle.position = "absolute";
                    wrapperStyle.top = 0;
                    wrapperStyle.left = 0;
                    wrapperStyle.bottom = 0;
                    wrapperStyle.right = 0;
                } else if (void 0 !== widthInt && void 0 !== heightInt) {
                    var quotient = heightInt / widthInt;
                    var paddingTop = isNaN(quotient) ? "100%" : "".concat(100 * quotient, "%");
                    if ("responsive" === layout) {
                        wrapperStyle.display = "block";
                        wrapperStyle.position = "relative";
                        hasSizer = true;
                        sizerStyle.paddingTop = paddingTop;
                    } else if ("intrinsic" === layout) {
                        wrapperStyle.display = "inline-block";
                        wrapperStyle.position = "relative";
                        wrapperStyle.maxWidth = "100%";
                        hasSizer = true;
                        sizerStyle.maxWidth = "100%";
                        sizerSvgUrl = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(widthInt, "%27%20height=%27").concat(heightInt, "%27/%3e");
                    } else if ("fixed" === layout) {
                        wrapperStyle.display = "inline-block";
                        wrapperStyle.position = "relative";
                        wrapperStyle.width = widthInt;
                        wrapperStyle.height = heightInt;
                    }
                } else {
                    if (false) ;
                }
                var imgAttributes = {
                    src: emptyDataURL,
                    srcSet: void 0,
                    sizes: void 0
                };
                if (isVisible) imgAttributes = generateImgAttrs({
                    config: config,
                    src: src,
                    unoptimized: unoptimized,
                    layout: layout,
                    width: widthInt,
                    quality: qualityInt,
                    sizes: sizes,
                    loader: loader
                });
                var srcString = src;
                if (false) var fullUrl;
                var imageSrcSetPropName = "imagesrcset";
                var imageSizesPropName = "imagesizes";
                if (true) {
                    imageSrcSetPropName = "imageSrcSet";
                    imageSizesPropName = "imageSizes";
                }
                var _obj;
                var linkProps = (_obj = {}, _defineProperty(_obj, imageSrcSetPropName, imgAttributes.srcSet), _defineProperty(_obj, imageSizesPropName, imgAttributes.sizes), _defineProperty(_obj, "crossOrigin", rest.crossOrigin), _obj);
                var useLayoutEffect = _react.default.useLayoutEffect;
                var onLoadingCompleteRef = _react.useRef(onLoadingComplete);
                var previousImageSrc = _react.useRef(src);
                _react.useEffect(function() {
                    onLoadingCompleteRef.current = onLoadingComplete;
                }, [
                    onLoadingComplete
                ]);
                useLayoutEffect(function() {
                    if (previousImageSrc.current !== src) {
                        resetIntersected();
                        previousImageSrc.current = src;
                    }
                }, [
                    resetIntersected,
                    src
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
                }, rest);
                return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("span", {
                    style: wrapperStyle
                }, hasSizer ? _react.default.createElement("span", {
                    style: sizerStyle
                }, sizerSvgUrl ? _react.default.createElement("img", {
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
                    "aria-hidden": true,
                    src: sizerSvgUrl
                }) : null) : null, _react.default.createElement(ImageElement, Object.assign({}, imgElementArgs))), priority ? _react.default.createElement(_head.default, null, _react.default.createElement("link", Object.assign({
                    key: "__nimg-" + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
                    rel: "preload",
                    as: "image",
                    href: imgAttributes.srcSet ? void 0 : imgAttributes.src
                }, linkProps))) : null);
            };
            var _extends = __webpack_require__(6495).Z;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            var _object_without_properties_loose = __webpack_require__(7273).Z;
            var _react = _interop_require_wildcard(__webpack_require__(7294));
            var _head = _interop_require_default(__webpack_require__(5443));
            var _imageConfig = __webpack_require__(9309);
            var _useIntersection = __webpack_require__(7190);
            var _imageConfigContext = __webpack_require__(9977);
            var _utils = __webpack_require__(3794);
            var _normalizeTrailingSlash = __webpack_require__(2392);
            "client";
            function normalizeSrc(src) {
                return "/" === src[0] ? src.slice(1) : src;
            }
            var configEnv = {
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
                dangerouslyAllowSVG: false,
                unoptimized: false
            };
            var loadedImageURLs = new Set();
            var allImgs = new Map();
            var perfObserver;
            var emptyDataURL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            if (false) ;
            var VALID_LOADING_VALUES = null;
            var loaders = new Map([
                [
                    "default",
                    function(param) {
                        var config = param.config, src = param.src, width = param.width, quality = param.quality;
                        if (false) var hasMatch, parsedSrc, missingValues;
                        if (src.endsWith(".svg") && !config.dangerouslyAllowSVG) {
                            return src;
                        }
                        return "".concat(_normalizeTrailingSlash.normalizePathTrailingSlash(config.path), "?url=").concat(encodeURIComponent(src), "&w=").concat(width, "&q=").concat(quality || 75);
                    }
                ],
                [
                    "imgix",
                    function(param) {
                        var config = param.config, src = param.src, width = param.width, quality = param.quality;
                        var url = new URL("".concat(config.path).concat(normalizeSrc(src)));
                        var params = url.searchParams;
                        params.set("auto", params.getAll("auto").join(",") || "format");
                        params.set("fit", params.get("fit") || "max");
                        params.set("w", params.get("w") || width.toString());
                        if (quality) params.set("q", quality.toString());
                        return url.href;
                    }
                ],
                [
                    "cloudinary",
                    function(param) {
                        var config = param.config, src = param.src, width = param.width, quality = param.quality;
                        var params = [
                            "f_auto",
                            "c_limit",
                            "w_" + width,
                            "q_" + (quality || "auto")
                        ];
                        var paramsString = params.join(",") + "/";
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
            var VALID_LAYOUT_VALUES = null;
            function isStaticRequire(src) {
                return void 0 !== src.default;
            }
            function generateImgAttrs(param) {
                var config = param.config, src = param.src, unoptimized = param.unoptimized, layout = param.layout, width = param.width, quality = param.quality, sizes = param.sizes, loader = param.loader;
                if (unoptimized) {
                    return {
                        src: src,
                        srcSet: void 0,
                        sizes: void 0
                    };
                }
                var ref = function(param, width, layout, sizes) {
                    var deviceSizes = param.deviceSizes, allSizes = param.allSizes;
                    if (sizes && ("fill" === layout || "responsive" === layout)) {
                        var viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
                        var percentSizes = [];
                        for(var match; match = viewportWidthRe.exec(sizes); match)percentSizes.push(parseInt(match[2]));
                        if (percentSizes.length) {
                            var _Math;
                            var smallestRatio = 0.01 * (_Math = Math).min.apply(_Math, _toConsumableArray(percentSizes));
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
                    if ("number" != typeof width || "fill" === layout || "responsive" === layout) {
                        return {
                            widths: deviceSizes,
                            kind: "w"
                        };
                    }
                    var widths = _toConsumableArray(new Set([
                        width,
                        2 * width
                    ].map(function(w) {
                        return allSizes.find(function(p) {
                            return p >= w;
                        }) || allSizes[allSizes.length - 1];
                    })));
                    return {
                        widths: widths,
                        kind: "x"
                    };
                }(config, width, layout, sizes), widths = ref.widths, kind = ref.kind;
                var last = widths.length - 1;
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
                    src: loader({
                        config: config,
                        src: src,
                        quality: quality,
                        width: widths[last]
                    })
                };
            }
            function getInt(x) {
                if ("number" == typeof x) {
                    return x;
                }
                if ("string" == typeof x) {
                    return parseInt(x, 10);
                }
                return;
            }
            function defaultImageLoader(loaderProps) {
                var ref;
                var loaderKey = (null == (ref = loaderProps.config) ? void 0 : ref.loader) || "default";
                var load = loaders.get(loaderKey);
                if (load) {
                    return load(loaderProps);
                }
                throw Error('Unknown "loader" found in "next.config.js". Expected: '.concat(_imageConfig.VALID_LOADERS.join(", "), ". Received: ").concat(loaderKey));
            }
            function handleLoading(img, src, layout, placeholder, onLoadingCompleteRef, setBlurComplete) {
                if (!img || img.src === emptyDataURL || img["data-loaded-src"] === src) {
                    return;
                }
                img["data-loaded-src"] = src;
                var p = "decode" in img ? img.decode() : Promise.resolve();
                p.catch(function() {}).then(function() {
                    if (!img.parentNode) {
                        return;
                    }
                    loadedImageURLs.add(src);
                    if ("blur" === placeholder) setBlurComplete(true);
                    if (null == onLoadingCompleteRef ? void 0 : onLoadingCompleteRef.current) {
                        var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
                        onLoadingCompleteRef.current({
                            naturalWidth: naturalWidth,
                            naturalHeight: naturalHeight
                        });
                    }
                    if (false) var parent, ref;
                });
            }
            var ImageElement = function(_param) {
                var imgAttributes = _param.imgAttributes, heightInt = _param.heightInt, widthInt = _param.widthInt, qualityInt = _param.qualityInt, layout = _param.layout, className = _param.className, imgStyle = _param.imgStyle, blurStyle = _param.blurStyle, isLazy = _param.isLazy, placeholder = _param.placeholder, loading = _param.loading, srcString = _param.srcString, config = _param.config, unoptimized = _param.unoptimized, loader = _param.loader, onLoadingCompleteRef = _param.onLoadingCompleteRef, setBlurComplete = _param.setBlurComplete, setIntersection = _param.setIntersection, onLoad = _param.onLoad, onError = _param.onError, isVisible = _param.isVisible, noscriptSizes = _param.noscriptSizes, rest = _object_without_properties_loose(_param, [
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
                loading = isLazy ? "lazy" : loading;
                return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("img", Object.assign({}, rest, imgAttributes, {
                    decoding: "async",
                    "data-nimg": layout,
                    className: className,
                    style: _extends({}, imgStyle, blurStyle),
                    ref: _react.useCallback(function(img) {
                        if (false) ;
                        setIntersection(img);
                        if (null == img ? void 0 : img.complete) handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
                    }, [
                        setIntersection,
                        srcString,
                        layout,
                        placeholder,
                        onLoadingCompleteRef,
                        setBlurComplete
                    ]),
                    onLoad: function(event) {
                        var img = event.currentTarget;
                        handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
                        if (onLoad) onLoad(event);
                    },
                    onError: function(event) {
                        if ("blur" === placeholder) setBlurComplete(true);
                        if (onError) onError(event);
                    }
                })), (isLazy || "blur" === placeholder) && _react.default.createElement("noscript", null, _react.default.createElement("img", Object.assign({}, rest, generateImgAttrs({
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
                    loading: loading
                }))));
            };
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        7190: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var _slicedToArray = __webpack_require__(4941).Z;
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.useIntersection = function(param) {
                var rootRef = param.rootRef, rootMargin = param.rootMargin, disabled = param.disabled;
                var isDisabled = disabled || !hasIntersectionObserver;
                var ref = _slicedToArray(_react.useState(false), 2), visible = ref[0], setVisible = ref[1];
                var ref1 = _slicedToArray(_react.useState(null), 2), element = ref1[0], setElement = ref1[1];
                _react.useEffect(function() {
                    if (hasIntersectionObserver) {
                        if (isDisabled || visible) return;
                        if (element && element.tagName) {
                            var element1, callback;
                            var ref, id, observer, elements;
                            var unobserve = (element1 = element, callback = function(isVisible) {
                                return isVisible && setVisible(isVisible);
                            }, id = (ref = function(options) {
                                var id = {
                                    root: options.root || null,
                                    margin: options.rootMargin || ""
                                };
                                var existing = idList.find(function(obj) {
                                    return obj.root === id.root && obj.margin === id.margin;
                                });
                                var instance;
                                if (existing) {
                                    instance = observers.get(existing);
                                    if (instance) {
                                        return instance;
                                    }
                                }
                                var elements = new Map();
                                var observer = new IntersectionObserver(function(entries) {
                                    entries.forEach(function(entry) {
                                        var callback = elements.get(entry.target);
                                        var isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
                                        if (callback && isVisible) callback(isVisible);
                                    });
                                }, options);
                                instance = {
                                    id: id,
                                    observer: observer,
                                    elements: elements
                                };
                                idList.push(id);
                                observers.set(id, instance);
                                return instance;
                            }({
                                root: null == rootRef ? void 0 : rootRef.current,
                                rootMargin: rootMargin
                            })).id, observer = ref.observer, (elements = ref.elements).set(element1, callback), observer.observe(element1), function unobserve() {
                                elements.delete(element1);
                                observer.unobserve(element1);
                                if (0 === elements.size) {
                                    observer.disconnect();
                                    observers.delete(id);
                                    var index = idList.findIndex(function(obj) {
                                        return obj.root === id.root && obj.margin === id.margin;
                                    });
                                    if (index > -1) idList.splice(index, 1);
                                }
                            });
                            return unobserve;
                        }
                    } else {
                        if (!visible) {
                            var idleCallback = _requestIdleCallback.requestIdleCallback(function() {
                                return setVisible(true);
                            });
                            return function() {
                                return _requestIdleCallback.cancelIdleCallback(idleCallback);
                            };
                        }
                    }
                }, [
                    element,
                    isDisabled,
                    rootMargin,
                    rootRef,
                    visible
                ]);
                var resetVisible = _react.useCallback(function() {
                    setVisible(false);
                }, []);
                return [
                    setElement,
                    visible,
                    resetVisible
                ];
            };
            var _react = __webpack_require__(7294);
            var _requestIdleCallback = __webpack_require__(9311);
            var hasIntersectionObserver = "function" == typeof IntersectionObserver;
            var observers = new Map();
            var idList = [];
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        5075: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
            var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9008);
            var next_head__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);
            var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9260);
            var next_image__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
            var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(214);
            var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__);
            var Home = function() {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().container,
                    children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(next_head__WEBPACK_IMPORTED_MODULE_1___default(), {
                            children: [
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("title", {
                                    children: "Create Next App"
                                }),
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("meta", {
                                    name: "description",
                                    content: "Generated by create next app"
                                }),
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("link", {
                                    rel: "icon",
                                    href: "/favicon.ico"
                                })
                            ]
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", {
                            className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().main,
                            children: [
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1", {
                                    className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().title,
                                    children: [
                                        "Welcome to ",
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
                                            href: "https://nextjs.org",
                                            children: "Next.js!"
                                        })
                                    ]
                                }),
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                    className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().description,
                                    children: [
                                        "Get started by editing",
                                        " ",
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", {
                                            className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().code,
                                            children: "pages/index.tsx"
                                        })
                                    ]
                                }),
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().grid,
                                    children: [
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                                            href: "https://nextjs.org/docs",
                                            className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().card,
                                            children: [
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                                                    children: "Documentation →"
                                                }),
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                    children: "Find in-depth information about Next.js features and API."
                                                })
                                            ]
                                        }),
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                                            href: "https://nextjs.org/learn",
                                            className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().card,
                                            children: [
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                                                    children: "Learn →"
                                                }),
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                    children: "Learn about Next.js in an interactive course with quizzes!"
                                                })
                                            ]
                                        }),
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                                            href: "https://github.com/vercel/next.js/tree/canary/examples",
                                            className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().card,
                                            children: [
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                                                    children: "Examples →"
                                                }),
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                    children: "Discover and deploy boilerplate example Next.js projects."
                                                })
                                            ]
                                        }),
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                                            href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                            className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().card,
                                            children: [
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                                                    children: "Deploy →"
                                                }),
                                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                    children: "Instantly deploy your Next.js site to a public URL with Vercel."
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("footer", {
                            className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().footer,
                            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                                href: "https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: [
                                    "Powered by",
                                    " ",
                                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                        className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default().logo,
                                        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_image__WEBPACK_IMPORTED_MODULE_2___default(), {
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
            __webpack_exports__["default"] = Home;
        },
        214: function(module) {
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
        },
        9008: function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(5443);
        },
        9260: function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(8045);
        }
    },
    function(__webpack_require__) {
        var __webpack_exec__ = function(moduleId) {
            return __webpack_require__(__webpack_require__.s = moduleId);
        };
        __webpack_require__.O(0, [
            774,
            888,
            179
        ], function() {
            return __webpack_exec__(8312);
        });
        var __webpack_exports__ = __webpack_require__.O();
        _N_E = __webpack_exports__;
    }
]);
