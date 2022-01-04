(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[3921],{

/***/ 8045:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
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
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
__webpack_unused_export__ = ({
    value: true
});
exports["default"] = Image;
var _react = _interopRequireDefault(__webpack_require__(7294));
var _head = _interopRequireDefault(__webpack_require__(5443));
var _toBase64 = __webpack_require__(6978);
var _imageConfig = __webpack_require__(5809);
var _useIntersection = __webpack_require__(7190);
function _defineProperty1(obj, key, value) {
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _objectSpread(target) {
    var _arguments = arguments, _loop = function(i) {
        var source = _arguments[i] != null ? _arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty1(target, key, source[key]);
        });
    };
    for(var i = 1; i < arguments.length; i++)_loop(i);
    return target;
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {
    };
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {
    };
    var target = {
    };
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
var loadedImageURLs = new Set();
var allImgs = new Map();
var perfObserver;
var emptyDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
if (false) {}
var VALID_LOADING_VALUES = [
    'lazy',
    'eager',
    undefined
];
var loaders = new Map([
    [
        'default',
        defaultLoader
    ],
    [
        'imgix',
        imgixLoader
    ],
    [
        'cloudinary',
        cloudinaryLoader
    ],
    [
        'akamai',
        akamaiLoader
    ],
    [
        'custom',
        customLoader
    ], 
]);
var VALID_LAYOUT_VALUES = [
    'fill',
    'fixed',
    'intrinsic',
    'responsive',
    undefined, 
];
function isStaticRequire(src) {
    return src.default !== undefined;
}
function isStaticImageData(src) {
    return src.src !== undefined;
}
function isStaticImport(src) {
    return typeof src === 'object' && (isStaticRequire(src) || isStaticImageData(src));
}
var ref1 = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default"} || _imageConfig.imageConfigDefault, configDeviceSizes = ref1.deviceSizes, configImageSizes = ref1.imageSizes, configLoader = ref1.loader, configPath = ref1.path, configDomains = ref1.domains;
// sort smallest to largest
var allSizes = _toConsumableArray(configDeviceSizes).concat(_toConsumableArray(configImageSizes));
configDeviceSizes.sort(function(a, b) {
    return a - b;
});
allSizes.sort(function(a, b) {
    return a - b;
});
function getWidths(width, layout, sizes) {
    if (sizes && (layout === 'fill' || layout === 'responsive')) {
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
                    return s >= configDeviceSizes[0] * smallestRatio;
                }),
                kind: 'w'
            };
        }
        return {
            widths: allSizes,
            kind: 'w'
        };
    }
    if (typeof width !== 'number' || layout === 'fill' || layout === 'responsive') {
        return {
            widths: configDeviceSizes,
            kind: 'w'
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
        kind: 'x'
    };
}
function generateImgAttrs(param) {
    var src = param.src, unoptimized = param.unoptimized, layout = param.layout, width = param.width, quality = param.quality, sizes = param.sizes, loader = param.loader;
    if (unoptimized) {
        return {
            src: src,
            srcSet: undefined,
            sizes: undefined
        };
    }
    var ref = getWidths(width, layout, sizes), widths = ref.widths, kind = ref.kind;
    var last = widths.length - 1;
    return {
        sizes: !sizes && kind === 'w' ? '100vw' : sizes,
        srcSet: widths.map(function(w, i) {
            return "".concat(loader({
                src: src,
                quality: quality,
                width: w
            }), " ").concat(kind === 'w' ? w : i + 1).concat(kind);
        }).join(', '),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
            src: src,
            quality: quality,
            width: widths[last]
        })
    };
}
function getInt(x) {
    if (typeof x === 'number') {
        return x;
    }
    if (typeof x === 'string') {
        return parseInt(x, 10);
    }
    return undefined;
}
function defaultImageLoader(loaderProps) {
    var load = loaders.get(configLoader);
    if (load) {
        return load(_objectSpread({
            root: configPath
        }, loaderProps));
    }
    throw new Error("Unknown \"loader\" found in \"next.config.js\". Expected: ".concat(_imageConfig.VALID_LOADERS.join(', '), ". Received: ").concat(configLoader));
}
// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(img, src, layout, placeholder, onLoadingComplete) {
    if (!img) {
        return;
    }
    var handleLoad = function() {
        if (img.src !== emptyDataURL) {
            var p = 'decode' in img ? img.decode() : Promise.resolve();
            p.catch(function() {
            }).then(function() {
                if (placeholder === 'blur') {
                    img.style.filter = 'none';
                    img.style.backgroundSize = 'none';
                    img.style.backgroundImage = 'none';
                }
                loadedImageURLs.add(src);
                if (onLoadingComplete) {
                    var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
                    // Pass back read-only primitive values but not the
                    // underlying DOM element because it could be misused.
                    onLoadingComplete({
                        naturalWidth: naturalWidth,
                        naturalHeight: naturalHeight
                    });
                }
                if (false) { var parent, ref; }
            });
        }
    };
    if (img.complete) {
        // If the real image fails to load, this will still remove the placeholder.
        // This is the desired behavior for now, and will be revisited when error
        // handling is worked on for the image component itself.
        handleLoad();
    } else {
        img.onload = handleLoad;
    }
}
var _obj;
function Image(_param) {
    var src = _param.src, sizes = _param.sizes, _unoptimized = _param.unoptimized, unoptimized = _unoptimized === void 0 ? false : _unoptimized, _priority = _param.priority, priority = _priority === void 0 ? false : _priority, loading = _param.loading, _lazyBoundary = _param.lazyBoundary, lazyBoundary = _lazyBoundary === void 0 ? '200px' : _lazyBoundary, className = _param.className, quality = _param.quality, width = _param.width, height = _param.height, objectFit = _param.objectFit, objectPosition = _param.objectPosition, onLoadingComplete = _param.onLoadingComplete, _loader = _param.loader, loader = _loader === void 0 ? defaultImageLoader : _loader, _placeholder = _param.placeholder, placeholder = _placeholder === void 0 ? 'empty' : _placeholder, blurDataURL = _param.blurDataURL, all = _objectWithoutProperties(_param, [
        "src",
        "sizes",
        "unoptimized",
        "priority",
        "loading",
        "lazyBoundary",
        "className",
        "quality",
        "width",
        "height",
        "objectFit",
        "objectPosition",
        "onLoadingComplete",
        "loader",
        "placeholder",
        "blurDataURL"
    ]);
    var rest = all;
    var layout = sizes ? 'responsive' : 'intrinsic';
    if ('layout' in rest) {
        // Override default layout if the user specified one:
        if (rest.layout) layout = rest.layout;
        // Remove property so it's not spread into image:
        delete rest['layout'];
    }
    var staticSrc = '';
    if (isStaticImport(src)) {
        var staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
            throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(staticImageData)));
        }
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!layout || layout !== 'fill') {
            height = height || staticImageData.height;
            width = width || staticImageData.width;
            if (!staticImageData.height || !staticImageData.width) {
                throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(staticImageData)));
            }
        }
    }
    src = typeof src === 'string' ? src : staticSrc;
    var widthInt = getInt(width);
    var heightInt = getInt(height);
    var qualityInt = getInt(quality);
    var isLazy = !priority && (loading === 'lazy' || typeof loading === 'undefined');
    if (src.startsWith('data:') || src.startsWith('blob:')) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true;
        isLazy = false;
    }
    if ( true && loadedImageURLs.has(src)) {
        isLazy = false;
    }
    if (false) { var url, urlStr, VALID_BLUR_EXT; }
    var ref2 = _slicedToArray((0, _useIntersection).useIntersection({
        rootMargin: lazyBoundary,
        disabled: !isLazy
    }), 2), setRef = ref2[0], isIntersected = ref2[1];
    var isVisible = !isLazy || isIntersected;
    var wrapperStyle = {
        boxSizing: 'border-box',
        display: 'block',
        overflow: 'hidden',
        width: 'initial',
        height: 'initial',
        background: 'none',
        opacity: 1,
        border: 0,
        margin: 0,
        padding: 0
    };
    var sizerStyle = {
        boxSizing: 'border-box',
        display: 'block',
        width: 'initial',
        height: 'initial',
        background: 'none',
        opacity: 1,
        border: 0,
        margin: 0,
        padding: 0
    };
    var hasSizer = false;
    var sizerSvg;
    var imgStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        boxSizing: 'border-box',
        padding: 0,
        border: 'none',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        objectFit: objectFit,
        objectPosition: objectPosition
    };
    var blurStyle = placeholder === 'blur' ? {
        filter: 'blur(20px)',
        backgroundSize: objectFit || 'cover',
        backgroundImage: "url(\"".concat(blurDataURL, "\")"),
        backgroundPosition: objectPosition || '0% 0%'
    } : {
    };
    if (layout === 'fill') {
        // <Image src="i.png" layout="fill" />
        wrapperStyle.display = 'block';
        wrapperStyle.position = 'absolute';
        wrapperStyle.top = 0;
        wrapperStyle.left = 0;
        wrapperStyle.bottom = 0;
        wrapperStyle.right = 0;
    } else if (typeof widthInt !== 'undefined' && typeof heightInt !== 'undefined') {
        // <Image src="i.png" width="100" height="100" />
        var quotient = heightInt / widthInt;
        var paddingTop = isNaN(quotient) ? '100%' : "".concat(quotient * 100, "%");
        if (layout === 'responsive') {
            // <Image src="i.png" width="100" height="100" layout="responsive" />
            wrapperStyle.display = 'block';
            wrapperStyle.position = 'relative';
            hasSizer = true;
            sizerStyle.paddingTop = paddingTop;
        } else if (layout === 'intrinsic') {
            // <Image src="i.png" width="100" height="100" layout="intrinsic" />
            wrapperStyle.display = 'inline-block';
            wrapperStyle.position = 'relative';
            wrapperStyle.maxWidth = '100%';
            hasSizer = true;
            sizerStyle.maxWidth = '100%';
            sizerSvg = "<svg width=\"".concat(widthInt, "\" height=\"").concat(heightInt, "\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"/>");
        } else if (layout === 'fixed') {
            // <Image src="i.png" width="100" height="100" layout="fixed" />
            wrapperStyle.display = 'inline-block';
            wrapperStyle.position = 'relative';
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
    var imageSrcSetPropName = 'imagesrcset';
    var imageSizesPropName = 'imagesizes';
    if (false) {}
    var linkProps = (_obj = {
    }, // Note: imagesrcset and imagesizes are not in the link element type with react 17.
    _defineProperty(_obj, imageSrcSetPropName, imgAttributes.srcSet), _defineProperty(_obj, imageSizesPropName, imgAttributes.sizes), _obj);
    return(/*#__PURE__*/ _react.default.createElement("span", {
        style: wrapperStyle
    }, hasSizer ? /*#__PURE__*/ _react.default.createElement("span", {
        style: sizerStyle
    }, sizerSvg ? /*#__PURE__*/ _react.default.createElement("img", {
        style: {
            display: 'block',
            maxWidth: '100%',
            width: 'initial',
            height: 'initial',
            background: 'none',
            opacity: 1,
            border: 0,
            margin: 0,
            padding: 0
        },
        alt: "",
        "aria-hidden": true,
        src: "data:image/svg+xml;base64,".concat((0, _toBase64).toBase64(sizerSvg))
    }) : null) : null, /*#__PURE__*/ _react.default.createElement("img", Object.assign({
    }, rest, imgAttributes, {
        decoding: "async",
        "data-nimg": layout,
        className: className,
        ref: function(img) {
            setRef(img);
            handleLoading(img, srcString, layout, placeholder, onLoadingComplete);
        },
        style: _objectSpread({
        }, imgStyle, blurStyle)
    })), /*#__PURE__*/ _react.default.createElement("noscript", null, /*#__PURE__*/ _react.default.createElement("img", Object.assign({
    }, rest, generateImgAttrs({
        src: src,
        unoptimized: unoptimized,
        layout: layout,
        width: widthInt,
        quality: qualityInt,
        sizes: sizes,
        loader: loader
    }), {
        decoding: "async",
        "data-nimg": layout,
        style: imgStyle,
        className: className,
        // @ts-ignore - TODO: upgrade to `@types/react@17`
        loading: loading || 'lazy'
    }))), priority ? // for browsers that do not support `imagesrcset`, and in those cases
    // it would likely cause the incorrect image to be preloaded.
    //
    // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
    /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("link", Object.assign({
        key: '__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
        rel: "preload",
        as: "image",
        href: imgAttributes.srcSet ? undefined : imgAttributes.src
    }, linkProps))) : null));
}
function normalizeSrc(src) {
    return src[0] === '/' ? src.slice(1) : src;
}
function imgixLoader(param) {
    var root = param.root, src = param.src, width = param.width, quality = param.quality;
    // Demo: https://static.imgix.net/daisy.png?auto=format&fit=max&w=300
    var url = new URL("".concat(root).concat(normalizeSrc(src)));
    var params = url.searchParams;
    params.set('auto', params.get('auto') || 'format');
    params.set('fit', params.get('fit') || 'max');
    params.set('w', params.get('w') || width.toString());
    if (quality) {
        params.set('q', quality.toString());
    }
    return url.href;
}
function akamaiLoader(param) {
    var root = param.root, src = param.src, width = param.width;
    return "".concat(root).concat(normalizeSrc(src), "?imwidth=").concat(width);
}
function cloudinaryLoader(param) {
    var root = param.root, src = param.src, width = param.width, quality = param.quality;
    // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
    var params = [
        'f_auto',
        'c_limit',
        'w_' + width,
        'q_' + (quality || 'auto')
    ];
    var paramsString = params.join(',') + '/';
    return "".concat(root).concat(paramsString).concat(normalizeSrc(src));
}
function customLoader(param) {
    var src = param.src;
    throw new Error("Image with src \"".concat(src, "\" is missing \"loader\" prop.") + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader");
}
function defaultLoader(param) {
    var root = param.root, src = param.src, width = param.width, quality = param.quality;
    if (false) { var parsedSrc, missingValues; }
    return "".concat(root, "?url=").concat(encodeURIComponent(src), "&w=").concat(width, "&q=").concat(quality || 75);
} //# sourceMappingURL=image.js.map


/***/ }),

/***/ 7190:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.useIntersection = useIntersection;
var _react = __webpack_require__(7294);
var _requestIdleCallback = __webpack_require__(9311);
var hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
function useIntersection(param) {
    var rootMargin = param.rootMargin, disabled = param.disabled;
    var isDisabled = disabled || !hasIntersectionObserver;
    var unobserve = (0, _react).useRef();
    var ref = _slicedToArray((0, _react).useState(false), 2), visible = ref[0], setVisible = ref[1];
    var setRef = (0, _react).useCallback(function(el) {
        if (unobserve.current) {
            unobserve.current();
            unobserve.current = undefined;
        }
        if (isDisabled || visible) return;
        if (el && el.tagName) {
            unobserve.current = observe(el, function(isVisible) {
                return isVisible && setVisible(isVisible);
            }, {
                rootMargin: rootMargin
            });
        }
    }, [
        isDisabled,
        rootMargin,
        visible
    ]);
    (0, _react).useEffect(function() {
        if (!hasIntersectionObserver) {
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
        visible
    ]);
    return [
        setRef,
        visible
    ];
}
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
        }
    };
}
var observers = new Map();
function createObserver(options) {
    var id = options.rootMargin || '';
    var instance = observers.get(id);
    if (instance) {
        return instance;
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
    observers.set(id, instance = {
        id: id,
        observer: observer,
        elements: elements
    });
    return instance;
} //# sourceMappingURL=use-intersection.js.map


/***/ }),

/***/ 638:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;

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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
__webpack_unused_export__ = ({
    value: true
});
__webpack_unused_export__ = noSSR;
exports["default"] = dynamic;
var _react = _interopRequireDefault(__webpack_require__(7294));
var _loadable = _interopRequireDefault(__webpack_require__(4302));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var isServerSide = "object" === 'undefined';
function noSSR(LoadableInitializer, loadableOptions) {
    // Removing webpack and modules means react-loadable won't try preloading
    delete loadableOptions.webpack;
    delete loadableOptions.modules;
    // This check is necessary to prevent react-loadable from initializing on the server
    if (!isServerSide) {
        return LoadableInitializer(loadableOptions);
    }
    var Loading = loadableOptions.loading;
    // This will only be rendered on the server side
    return function() {
        /*#__PURE__*/ return _react.default.createElement(Loading, {
            error: null,
            isLoading: true,
            pastDelay: false,
            timedOut: false
        });
    };
}
function dynamic(dynamicOptions, options) {
    var loadableFn = _loadable.default;
    var loadableOptions = {
        // A loading component is not required, so we default it
        loading: function(param) {
            var error = param.error, isLoading = param.isLoading, pastDelay = param.pastDelay;
            if (!pastDelay) return null;
            if (false) {}
            return null;
        }
    };
    // Support for direct import(), eg: dynamic(import('../hello-world'))
    // Note that this is only kept for the edge case where someone is passing in a promise as first argument
    // The react-loadable babel plugin will turn dynamic(import('../hello-world')) into dynamic(() => import('../hello-world'))
    // To make sure we don't execute the import without rendering first
    if (_instanceof(dynamicOptions, Promise)) {
        loadableOptions.loader = function() {
            return dynamicOptions;
        };
    // Support for having import as a function, eg: dynamic(() => import('../hello-world'))
    } else if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    // Support for having first argument being options, eg: dynamic({loader: import('../hello-world')})
    } else if (typeof dynamicOptions === 'object') {
        loadableOptions = _objectSpread({
        }, loadableOptions, dynamicOptions);
    }
    // Support for passing options, eg: dynamic(import('../hello-world'), {loading: () => <p>Loading something</p>})
    loadableOptions = _objectSpread({
    }, loadableOptions, options);
    var suspenseOptions = loadableOptions;
    if (true) {
        // Error if react root is not enabled and `suspense` option is set to true
        if ( true && suspenseOptions.suspense) {
            // TODO: add error doc when this feature is stable
            throw new Error("Invalid suspense option usage in next/dynamic. Read more: https://nextjs.org/docs/messages/invalid-dynamic-suspense");
        }
    }
    if (suspenseOptions.suspense) {
        return loadableFn(suspenseOptions);
    }
    // coming from build/babel/plugins/react-loadable-plugin.js
    if (loadableOptions.loadableGenerated) {
        loadableOptions = _objectSpread({
        }, loadableOptions, loadableOptions.loadableGenerated);
        delete loadableOptions.loadableGenerated;
    }
    // support for disabling server side rendering, eg: dynamic(import('../hello-world'), {ssr: false})
    if (typeof loadableOptions.ssr === 'boolean') {
        if (!loadableOptions.ssr) {
            delete loadableOptions.ssr;
            return noSSR(loadableFn, loadableOptions);
        }
        delete loadableOptions.ssr;
    }
    return loadableFn(loadableOptions);
} //# sourceMappingURL=dynamic.js.map


/***/ }),

/***/ 6319:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.LoadableContext = void 0;
var _react = _interopRequireDefault(__webpack_require__(7294));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var LoadableContext = _react.default.createContext(null);
exports.LoadableContext = LoadableContext;
if (false) {} //# sourceMappingURL=loadable-context.js.map


/***/ }),

/***/ 4302:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(7294));
var _useSubscription = __webpack_require__(7161);
var _loadableContext = __webpack_require__(6319);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var ALL_INITIALIZERS = [];
var READY_INITIALIZERS = [];
var initialized = false;
function load(loader) {
    var promise = loader();
    var state = {
        loading: true,
        loaded: null,
        error: null
    };
    state.promise = promise.then(function(loaded) {
        state.loading = false;
        state.loaded = loaded;
        return loaded;
    }).catch(function(err) {
        state.loading = false;
        state.error = err;
        throw err;
    });
    return state;
}
function resolve(obj) {
    return obj && obj.__esModule ? obj.default : obj;
}
function createLoadableComponent(loadFn, options) {
    var init = function init() {
        if (!subscription) {
            var sub = new LoadableSubscription(loadFn, opts);
            subscription = {
                getCurrentValue: sub.getCurrentValue.bind(sub),
                subscribe: sub.subscribe.bind(sub),
                retry: sub.retry.bind(sub),
                promise: sub.promise.bind(sub)
            };
        }
        return subscription.promise();
    };
    var LoadableImpl = function LoadableImpl(props, ref) {
        init();
        var context = _react.default.useContext(_loadableContext.LoadableContext);
        var state = (0, _useSubscription).useSubscription(subscription);
        _react.default.useImperativeHandle(ref, function() {
            return {
                retry: subscription.retry
            };
        }, []);
        if (context && Array.isArray(opts.modules)) {
            opts.modules.forEach(function(moduleName) {
                context(moduleName);
            });
        }
        return _react.default.useMemo(function() {
            if (state.loading || state.error) {
                return _react.default.createElement(opts.loading, {
                    isLoading: state.loading,
                    pastDelay: state.pastDelay,
                    timedOut: state.timedOut,
                    error: state.error,
                    retry: subscription.retry
                });
            } else if (state.loaded) {
                return _react.default.createElement(resolve(state.loaded), props);
            } else {
                return null;
            }
        }, [
            props,
            state
        ]);
    };
    var LazyImpl = function LazyImpl(props, ref) {
        return _react.default.createElement(opts.lazy, _objectSpread({
        }, props, {
            ref: ref
        }));
    };
    var opts = Object.assign({
        loader: null,
        loading: null,
        delay: 200,
        timeout: null,
        webpack: null,
        modules: null,
        suspense: false
    }, options);
    if (opts.suspense) {
        opts.lazy = _react.default.lazy(opts.loader);
    }
    var subscription = null;
    // Server only
    if (false) {}
    // Client only
    if (!initialized && "object" !== 'undefined' && typeof opts.webpack === 'function' && "function" === 'function' && !opts.suspense) {
        var moduleIds = opts.webpack();
        READY_INITIALIZERS.push(function(ids) {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = moduleIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var moduleId = _step.value;
                    if (ids.indexOf(moduleId) !== -1) {
                        return init();
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });
    }
    var LoadableComponent = opts.suspense ? LazyImpl : LoadableImpl;
    LoadableComponent.preload = function() {
        return !opts.suspense && init();
    };
    LoadableComponent.displayName = 'LoadableComponent';
    return _react.default.forwardRef(LoadableComponent);
}
var LoadableSubscription = /*#__PURE__*/ function() {
    function LoadableSubscription(loadFn, opts) {
        _classCallCheck(this, LoadableSubscription);
        this._loadFn = loadFn;
        this._opts = opts;
        this._callbacks = new Set();
        this._delay = null;
        this._timeout = null;
        this.retry();
    }
    _createClass(LoadableSubscription, [
        {
            key: "promise",
            value: function promise() {
                return this._res.promise;
            }
        },
        {
            key: "retry",
            value: function retry() {
                var _this = this;
                this._clearTimeouts();
                this._res = this._loadFn(this._opts.loader);
                this._state = {
                    pastDelay: false,
                    timedOut: false
                };
                var ref = this, res = ref._res, opts = ref._opts;
                if (res.loading) {
                    if (typeof opts.delay === 'number') {
                        if (opts.delay === 0) {
                            this._state.pastDelay = true;
                        } else {
                            var _this1 = this;
                            this._delay = setTimeout(function() {
                                _this1._update({
                                    pastDelay: true
                                });
                            }, opts.delay);
                        }
                    }
                    if (typeof opts.timeout === 'number') {
                        var _this2 = this;
                        this._timeout = setTimeout(function() {
                            _this2._update({
                                timedOut: true
                            });
                        }, opts.timeout);
                    }
                }
                this._res.promise.then(function() {
                    _this._update({
                    });
                    _this._clearTimeouts();
                }).catch(function(_err) {
                    _this._update({
                    });
                    _this._clearTimeouts();
                });
                this._update({
                });
            }
        },
        {
            key: "_update",
            value: function _update(partial) {
                this._state = _objectSpread({
                }, this._state, {
                    error: this._res.error,
                    loaded: this._res.loaded,
                    loading: this._res.loading
                }, partial);
                this._callbacks.forEach(function(callback) {
                    return callback();
                });
            }
        },
        {
            key: "_clearTimeouts",
            value: function _clearTimeouts() {
                clearTimeout(this._delay);
                clearTimeout(this._timeout);
            }
        },
        {
            key: "getCurrentValue",
            value: function getCurrentValue() {
                return this._state;
            }
        },
        {
            key: "subscribe",
            value: function subscribe(callback) {
                var _this = this;
                this._callbacks.add(callback);
                return function() {
                    _this._callbacks.delete(callback);
                };
            }
        }
    ]);
    return LoadableSubscription;
}();
function Loadable(opts) {
    return createLoadableComponent(load, opts);
}
function flushInitializers(initializers, ids) {
    var promises = [];
    while(initializers.length){
        var init = initializers.pop();
        promises.push(init(ids));
    }
    return Promise.all(promises).then(function() {
        if (initializers.length) {
            return flushInitializers(initializers, ids);
        }
    });
}
Loadable.preloadAll = function() {
    return new Promise(function(resolveInitializers, reject) {
        flushInitializers(ALL_INITIALIZERS).then(resolveInitializers, reject);
    });
};
Loadable.preloadReady = function(param) {
    var ids = param === void 0 ? [] : param;
    return new Promise(function(resolvePreload) {
        var res = function() {
            initialized = true;
            return resolvePreload();
        };
        // We always will resolve, errors should be handled within loading UIs.
        flushInitializers(READY_INITIALIZERS, ids).then(res, res);
    });
};
if (true) {
    window.__NEXT_PRELOADREADY = Loadable.preloadReady;
}
var _default = Loadable;
exports["default"] = _default; //# sourceMappingURL=loadable.js.map


/***/ }),

/***/ 6978:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.toBase64 = toBase64;
function toBase64(str) {
    if (false) {} else {
        return window.btoa(str);
    }
} //# sourceMappingURL=to-base-64.js.map


/***/ }),

/***/ 5809:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
const VALID_LOADERS = [
    'default',
    'imgix',
    'cloudinary',
    'akamai',
    'custom', 
];
exports.VALID_LOADERS = VALID_LOADERS;
const imageConfigDefault = {
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
    path: '/_next/image',
    loader: 'default',
    domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 60,
    formats: [
        'image/webp'
    ]
};
exports.imageConfigDefault = imageConfigDefault;

//# sourceMappingURL=image-config.js.map

/***/ }),

/***/ 5152:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(638)


/***/ }),

/***/ 9008:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(5443)


/***/ }),

/***/ 5675:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(8045)


/***/ })

}]);