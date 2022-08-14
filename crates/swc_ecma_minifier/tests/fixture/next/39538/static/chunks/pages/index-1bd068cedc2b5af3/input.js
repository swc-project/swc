(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 1412:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _defineProperty;
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}


/***/ }),

/***/ 5702:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(1107);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 9838:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _defineProperty = (__webpack_require__(1412)/* ["default"] */ .Z);
var _slicedToArray = (__webpack_require__(8693)/* ["default"] */ .Z);
var _toConsumableArray = (__webpack_require__(9947)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = Image;
var _extends = (__webpack_require__(2769)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(4507)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(8167)/* ["default"] */ .Z);
var _object_without_properties_loose = (__webpack_require__(4719)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(959));
var _head = _interop_require_default(__webpack_require__(4357));
var _imageConfig = __webpack_require__(1773);
var _useIntersection = __webpack_require__(757);
var _imageConfigContext = __webpack_require__(9664);
var _utils = __webpack_require__(8827);
var _normalizeTrailingSlash = __webpack_require__(8236);
function Image(_param) {
    var src = _param.src, sizes = _param.sizes, _unoptimized = _param.unoptimized, unoptimized = _unoptimized === void 0 ? false : _unoptimized, _priority = _param.priority, priority = _priority === void 0 ? false : _priority, loading = _param.loading, _lazyRoot = _param.lazyRoot, lazyRoot = _lazyRoot === void 0 ? null : _lazyRoot, lazyBoundary = _param.lazyBoundary, className = _param.className, quality = _param.quality, width = _param.width, height = _param.height, style = _param.style, objectFit = _param.objectFit, objectPosition = _param.objectPosition, onLoadingComplete = _param.onLoadingComplete, _placeholder = _param.placeholder, placeholder = _placeholder === void 0 ? "empty" : _placeholder, blurDataURL = _param.blurDataURL, all = _object_without_properties_loose(_param, [
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
    var configContext = (0, _react).useContext(_imageConfigContext.ImageConfigContext);
    var config = (0, _react).useMemo(function() {
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
        // Override default layout if the user specified one:
        if (rest.layout) layout = rest.layout;
        // Remove property so it's not spread on <img>:
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
                // The config object is internal only so we must
                // not pass it to the user-defined loader()
                return customImageLoader(opts);
            }, loader = _tmp, _tmp;
        }
        // Remove property so it's not spread on <img>
        delete rest.loader;
    }
    var staticSrc = "";
    if (isStaticImport(src)) {
        var staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
            throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(staticImageData)));
        }
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!layout || layout !== "fill") {
            height = height || staticImageData.height;
            width = width || staticImageData.width;
            if (!staticImageData.height || !staticImageData.width) {
                throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(staticImageData)));
            }
        }
    }
    src = typeof src === "string" ? src : staticSrc;
    var isLazy = !priority && (loading === "lazy" || typeof loading === "undefined");
    if (src.startsWith("data:") || src.startsWith("blob:")) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true;
        isLazy = false;
    }
    if ( true && loadedImageURLs.has(src)) {
        isLazy = false;
    }
    if (experimentalUnoptimized) {
        unoptimized = true;
    }
    var ref = _slicedToArray((0, _react).useState(false), 2), blurComplete = ref[0], setBlurComplete = ref[1];
    var ref1 = _slicedToArray((0, _useIntersection).useIntersection({
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
    if (false) { var overwrittenStyles, url, urlStr, VALID_BLUR_EXT; }
    var imgStyle = Object.assign({}, style, layoutStyle);
    var blurStyle = placeholder === "blur" && !blurComplete ? {
        backgroundSize: objectFit || "cover",
        backgroundPosition: objectPosition || "0% 0%",
        filter: "blur(20px)",
        backgroundImage: 'url("'.concat(blurDataURL, '")')
    } : {};
    if (layout === "fill") {
        // <Image src="i.png" layout="fill" />
        wrapperStyle.display = "block";
        wrapperStyle.position = "absolute";
        wrapperStyle.top = 0;
        wrapperStyle.left = 0;
        wrapperStyle.bottom = 0;
        wrapperStyle.right = 0;
    } else if (typeof widthInt !== "undefined" && typeof heightInt !== "undefined") {
        // <Image src="i.png" width="100" height="100" />
        var quotient = heightInt / widthInt;
        var paddingTop = isNaN(quotient) ? "100%" : "".concat(quotient * 100, "%");
        if (layout === "responsive") {
            // <Image src="i.png" width="100" height="100" layout="responsive" />
            wrapperStyle.display = "block";
            wrapperStyle.position = "relative";
            hasSizer = true;
            sizerStyle.paddingTop = paddingTop;
        } else if (layout === "intrinsic") {
            // <Image src="i.png" width="100" height="100" layout="intrinsic" />
            wrapperStyle.display = "inline-block";
            wrapperStyle.position = "relative";
            wrapperStyle.maxWidth = "100%";
            hasSizer = true;
            sizerStyle.maxWidth = "100%";
            sizerSvgUrl = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(widthInt, "%27%20height=%27").concat(heightInt, "%27/%3e");
        } else if (layout === "fixed") {
            // <Image src="i.png" width="100" height="100" layout="fixed" />
            wrapperStyle.display = "inline-block";
            wrapperStyle.position = "relative";
            wrapperStyle.width = widthInt;
            wrapperStyle.height = heightInt;
        }
    } else {
        // <Image src="i.png" />
        if (false) {}
    }
    var imgAttributes = {
        src: emptyDataURL,
        srcSet: undefined,
        sizes: undefined
    };
    if (isVisible) {
        imgAttributes = generateImgAttrs({
            config: config,
            src: src,
            unoptimized: unoptimized,
            layout: layout,
            width: widthInt,
            quality: qualityInt,
            sizes: sizes,
            loader: loader
        });
    }
    var srcString = src;
    if (false) { var fullUrl; }
    var imageSrcSetPropName = "imagesrcset";
    var imageSizesPropName = "imagesizes";
    if (true) {
        imageSrcSetPropName = "imageSrcSet";
        imageSizesPropName = "imageSizes";
    }
    var _obj;
    var linkProps = (_obj = {}, // Note: imagesrcset and imagesizes are not in the link element type with react 17.
    _defineProperty(_obj, imageSrcSetPropName, imgAttributes.srcSet), _defineProperty(_obj, imageSizesPropName, imgAttributes.sizes), _obj);
    var useLayoutEffect =  false ? 0 : _react.default.useLayoutEffect;
    var onLoadingCompleteRef = (0, _react).useRef(onLoadingComplete);
    var previousImageSrc = (0, _react).useRef(src);
    (0, _react).useEffect(function() {
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
        "aria-hidden": true,
        src: sizerSvgUrl
    }) : null) : null, /*#__PURE__*/ _react.default.createElement(ImageElement, Object.assign({}, imgElementArgs))), priority ? // for browsers that do not support `imagesrcset`, and in those cases
    // it would likely cause the incorrect image to be preloaded.
    //
    // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
    /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("link", Object.assign({
        key: "__nimg-" + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
        rel: "preload",
        as: "image",
        href: imgAttributes.srcSet ? undefined : imgAttributes.src
    }, linkProps))) : null);
}
var ref = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false} || {}, _experimentalRemotePatterns = ref.experimentalRemotePatterns, experimentalRemotePatterns = _experimentalRemotePatterns === void 0 ? [] : _experimentalRemotePatterns, experimentalUnoptimized = ref.experimentalUnoptimized;
var configEnv = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false};
var loadedImageURLs = new Set();
var allImgs = new Map();
var perfObserver;
var emptyDataURL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
if (false) {}
var VALID_LOADING_VALUES = (/* unused pure expression or super */ null && ([
    "lazy",
    "eager",
    undefined
]));
var loaders = new Map([
    [
        "default",
        defaultLoader
    ],
    [
        "imgix",
        imgixLoader
    ],
    [
        "cloudinary",
        cloudinaryLoader
    ],
    [
        "akamai",
        akamaiLoader
    ],
    [
        "custom",
        customLoader
    ], 
]);
var VALID_LAYOUT_VALUES = (/* unused pure expression or super */ null && ([
    "fill",
    "fixed",
    "intrinsic",
    "responsive",
    undefined, 
]));
function isStaticRequire(src) {
    return src.default !== undefined;
}
function isStaticImageData(src) {
    return src.src !== undefined;
}
function isStaticImport(src) {
    return typeof src === "object" && (isStaticRequire(src) || isStaticImageData(src));
}
function getWidths(param, width, layout, sizes) {
    var deviceSizes = param.deviceSizes, allSizes = param.allSizes;
    if (sizes && (layout === "fill" || layout === "responsive")) {
        // Find all the "vw" percent sizes used in the sizes prop
        var viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
        var percentSizes = [];
        for(var match; match = viewportWidthRe.exec(sizes); match){
            percentSizes.push(parseInt(match[2]));
        }
        if (percentSizes.length) {
            var _Math;
            var smallestRatio = (_Math = Math).min.apply(_Math, _toConsumableArray(percentSizes)) * 0.01;
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
    if (typeof width !== "number" || layout === "fill" || layout === "responsive") {
        return {
            widths: deviceSizes,
            kind: "w"
        };
    }
    var widths = _toConsumableArray(new Set(// > are actually 3x in the green color, but only 1.5x in the red and
    // > blue colors. Showing a 3x resolution image in the app vs a 2x
    // > resolution image will be visually the same, though the 3x image
    // > takes significantly more data. Even true 3x resolution screens are
    // > wasteful as the human eye cannot see that level of detail without
    // > something like a magnifying glass.
    // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
    [
        width,
        width * 2 /*, width * 3*/ 
    ].map(function(w) {
        return allSizes.find(function(p) {
            return p >= w;
        }) || allSizes[allSizes.length - 1];
    })));
    return {
        widths: widths,
        kind: "x"
    };
}
function generateImgAttrs(param) {
    var config = param.config, src = param.src, unoptimized = param.unoptimized, layout = param.layout, width = param.width, quality = param.quality, sizes = param.sizes, loader = param.loader;
    if (unoptimized) {
        return {
            src: src,
            srcSet: undefined,
            sizes: undefined
        };
    }
    var ref = getWidths(config, width, layout, sizes), widths = ref.widths, kind = ref.kind;
    var last = widths.length - 1;
    return {
        sizes: !sizes && kind === "w" ? "100vw" : sizes,
        srcSet: widths.map(function(w, i) {
            return "".concat(loader({
                config: config,
                src: src,
                quality: quality,
                width: w
            }), " ").concat(kind === "w" ? w : i + 1).concat(kind);
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
    if (typeof x === "number") {
        return x;
    }
    if (typeof x === "string") {
        return parseInt(x, 10);
    }
    return undefined;
}
function defaultImageLoader(loaderProps) {
    var ref;
    var loaderKey = ((ref = loaderProps.config) == null ? void 0 : ref.loader) || "default";
    var load = loaders.get(loaderKey);
    if (load) {
        return load(loaderProps);
    }
    throw new Error('Unknown "loader" found in "next.config.js". Expected: '.concat(_imageConfig.VALID_LOADERS.join(", "), ". Received: ").concat(loaderKey));
}
// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(img, src, layout, placeholder, onLoadingCompleteRef, setBlurComplete) {
    if (!img || img.src === emptyDataURL || img["data-loaded-src"] === src) {
        return;
    }
    img["data-loaded-src"] = src;
    var p = "decode" in img ? img.decode() : Promise.resolve();
    p.catch(function() {}).then(function() {
        if (!img.parentNode) {
            // Exit early in case of race condition:
            // - onload() is called
            // - decode() is called but incomplete
            // - unmount is called
            // - decode() completes
            return;
        }
        loadedImageURLs.add(src);
        if (placeholder === "blur") {
            setBlurComplete(true);
        }
        if (onLoadingCompleteRef == null ? void 0 : onLoadingCompleteRef.current) {
            var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
            // Pass back read-only primitive values but not the
            // underlying DOM element because it could be misused.
            onLoadingCompleteRef.current({
                naturalWidth: naturalWidth,
                naturalHeight: naturalHeight
            });
        }
        if (false) { var parent, ref; }
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
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("img", Object.assign({}, rest, imgAttributes, {
        decoding: "async",
        "data-nimg": layout,
        className: className,
        style: _extends({}, imgStyle, blurStyle),
        ref: (0, _react).useCallback(function(img) {
            if (false) {}
            setIntersection(img);
            if (img == null ? void 0 : img.complete) {
                handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
            }
        }, [
            setIntersection,
            srcString,
            layout,
            placeholder,
            onLoadingCompleteRef,
            setBlurComplete, 
        ]),
        onLoad: function(event) {
            var img = event.currentTarget;
            handleLoading(img, srcString, layout, placeholder, onLoadingCompleteRef, setBlurComplete);
            if (onLoad) {
                onLoad(event);
            }
        },
        onError: function(event) {
            if (placeholder === "blur") {
                // If the real image fails to load, this will still remove the placeholder.
                setBlurComplete(true);
            }
            if (onError) {
                onError(event);
            }
        }
    })), (isLazy || placeholder === "blur") && /*#__PURE__*/ _react.default.createElement("noscript", null, /*#__PURE__*/ _react.default.createElement("img", Object.assign({}, rest, generateImgAttrs({
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
    return src[0] === "/" ? src.slice(1) : src;
}
function imgixLoader(param) {
    var config = param.config, src = param.src, width = param.width, quality = param.quality;
    // Demo: https://static.imgix.net/daisy.png?auto=format&fit=max&w=300
    var url = new URL("".concat(config.path).concat(normalizeSrc(src)));
    var params = url.searchParams;
    // auto params can be combined with comma separation, or reiteration
    params.set("auto", params.getAll("auto").join(",") || "format");
    params.set("fit", params.get("fit") || "max");
    params.set("w", params.get("w") || width.toString());
    if (quality) {
        params.set("q", quality.toString());
    }
    return url.href;
}
function akamaiLoader(param) {
    var config = param.config, src = param.src, width = param.width;
    return "".concat(config.path).concat(normalizeSrc(src), "?imwidth=").concat(width);
}
function cloudinaryLoader(param) {
    var config = param.config, src = param.src, width = param.width, quality = param.quality;
    // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
    var params = [
        "f_auto",
        "c_limit",
        "w_" + width,
        "q_" + (quality || "auto")
    ];
    var paramsString = params.join(",") + "/";
    return "".concat(config.path).concat(paramsString).concat(normalizeSrc(src));
}
function customLoader(param) {
    var src = param.src;
    throw new Error('Image with src "'.concat(src, '" is missing "loader" prop.') + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader");
}
function defaultLoader(param) {
    var config = param.config, src = param.src, width = param.width, quality = param.quality;
    if (false) { var hasMatch, parsedSrc, missingValues; }
    if (src.endsWith(".svg") && !config.dangerouslyAllowSVG) {
        // Special case to make svg serve as-is to avoid proxying
        // through the built-in Image Optimization API.
        return src;
    }
    return "".concat((0, _normalizeTrailingSlash).normalizePathTrailingSlash(config.path), "?url=").concat(encodeURIComponent(src), "&w=").concat(width, "&q=").concat(quality || 75);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=image.js.map


/***/ }),

/***/ 757:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _slicedToArray = (__webpack_require__(8693)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.useIntersection = useIntersection;
var _react = __webpack_require__(959);
var _requestIdleCallback = __webpack_require__(6501);
var hasIntersectionObserver = typeof IntersectionObserver === "function";
function useIntersection(param) {
    var rootRef = param.rootRef, rootMargin = param.rootMargin, disabled = param.disabled;
    var isDisabled = disabled || !hasIntersectionObserver;
    var unobserve = (0, _react).useRef();
    var ref = _slicedToArray((0, _react).useState(false), 2), visible = ref[0], setVisible = ref[1];
    var ref1 = _slicedToArray((0, _react).useState(null), 2), element = ref1[0], setElement = ref1[1];
    (0, _react).useEffect(function() {
        if (hasIntersectionObserver) {
            if (unobserve.current) {
                unobserve.current();
                unobserve.current = undefined;
            }
            if (isDisabled || visible) return;
            if (element && element.tagName) {
                unobserve.current = observe(element, function(isVisible) {
                    return isVisible && setVisible(isVisible);
                }, {
                    root: rootRef == null ? void 0 : rootRef.current,
                    rootMargin: rootMargin
                });
            }
            return function() {
                unobserve.current == null ? void 0 : unobserve.current();
                unobserve.current = undefined;
            };
        } else {
            if (!visible) {
                var idleCallback = (0, _requestIdleCallback).requestIdleCallback(function() {
                    return setVisible(true);
                });
                return function() {
                    return (0, _requestIdleCallback).cancelIdleCallback(idleCallback);
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
    var resetVisible = (0, _react).useCallback(function() {
        setVisible(false);
    }, []);
    return [
        setElement,
        visible,
        resetVisible
    ];
}
var observers = new Map();
var idList = [];
function observe(element, callback, options) {
    var ref = createObserver(options), id = ref.id, observer = ref.observer, elements = ref.elements;
    elements.set(element, callback);
    observer.observe(element);
    return function unobserve() {
        elements.delete(element);
        observer.unobserve(element);
        // Destroy observer when there's nothing left to watch:
        if (elements.size === 0) {
            observer.disconnect();
            observers.delete(id);
            var index = idList.findIndex(function(obj) {
                return obj.root === id.root && obj.margin === id.margin;
            });
            if (index > -1) {
                idList.splice(index, 1);
            }
        }
    };
}
function createObserver(options) {
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
            if (callback && isVisible) {
                callback(isVisible);
            }
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
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-intersection.js.map


/***/ }),

/***/ 1107:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ pages; }
});

// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.2.0/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(1527);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@12.2.5_biqbaboplfbrettd7655fr4n2y/node_modules/next/head.js
var head = __webpack_require__(6224);
var head_default = /*#__PURE__*/__webpack_require__.n(head);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@12.2.5_biqbaboplfbrettd7655fr4n2y/node_modules/next/image.js
var next_image = __webpack_require__(8206);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.2.0/node_modules/react/index.js
var react = __webpack_require__(959);
// EXTERNAL MODULE: ./styles/Home.module.css
var Home_module = __webpack_require__(9915);
var Home_module_default = /*#__PURE__*/__webpack_require__.n(Home_module);
;// CONCATENATED MODULE: ./utils/image.ts
var IMAGE_SIZE = 40;
var preloadImage = function() {
    new Image(IMAGE_SIZE, IMAGE_SIZE).src = "/vercel.svg";
};

;// CONCATENATED MODULE: ./pages/index.tsx






var Home = function() {
    (0,react.useEffect)(function() {
        console.log(IMAGE_SIZE);
        preloadImage();
    }, []);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (Home_module_default()).container,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)((head_default()), {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("title", {
                        children: "Create Next App"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("meta", {
                        name: "description",
                        content: "Generated by create next app"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("link", {
                        rel: "icon",
                        href: "/favicon.ico"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("main", {
                className: (Home_module_default()).main,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("h1", {
                        className: (Home_module_default()).title,
                        children: [
                            "Welcome to ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                                href: "https://nextjs.org",
                                children: "Next.js!"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        className: (Home_module_default()).description,
                        children: [
                            "Get started by editing",
                            " ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("code", {
                                className: (Home_module_default()).code,
                                children: "pages/index.tsx"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: (Home_module_default()).grid,
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("a", {
                                href: "https://nextjs.org/docs",
                                className: (Home_module_default()).card,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                        children: "Documentation →"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "Find in-depth information about Next.js features and API."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("a", {
                                href: "https://nextjs.org/learn",
                                className: (Home_module_default()).card,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                        children: "Learn →"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "Learn about Next.js in an interactive course with quizzes!"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("a", {
                                href: "https://github.com/vercel/next.js/tree/canary/examples",
                                className: (Home_module_default()).card,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                        children: "Examples →"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "Discover and deploy boilerplate example Next.js projects."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("a", {
                                href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                className: (Home_module_default()).card,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                        children: "Deploy →"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "Instantly deploy your Next.js site to a public URL with Vercel."
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("footer", {
                className: (Home_module_default()).footer,
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("a", {
                    href: "https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: [
                        "Powered by",
                        " ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                            className: (Home_module_default()).logo,
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)((image_default()), {
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
/* harmony default export */ var pages = (Home);


/***/ }),

/***/ 9915:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__bCOhY","main":"Home_main__nLjiQ","footer":"Home_footer____T7K","title":"Home_title__T09hD","description":"Home_description__41Owk","code":"Home_code__suPER","grid":"Home_grid__GxQ85","card":"Home_card___LpL1","logo":"Home_logo__27_tb"};

/***/ }),

/***/ 6224:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(4357)


/***/ }),

/***/ 8206:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(9838)


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(5702); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);