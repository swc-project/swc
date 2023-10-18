exports.id = 675;
exports.ids = [675];
exports.modules = {

/***/ 5251:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "Image", ({
    enumerable: true,
    get: function() {
        return Image;
    }
}));
const _interop_require_default = __webpack_require__(2147);
const _interop_require_wildcard = __webpack_require__(4009);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(9885));
const _reactdom = /*#__PURE__*/ _interop_require_default._(__webpack_require__(8908));
const _head = /*#__PURE__*/ _interop_require_default._(__webpack_require__(1192));
const _getimgprops = __webpack_require__(842);
const _imageconfig = __webpack_require__(8352);
const _imageconfigcontextsharedruntime = __webpack_require__(7927);
const _warnonce = __webpack_require__(807);
const _routercontextsharedruntime = __webpack_require__(713);
const _imageloader = /*#__PURE__*/ _interop_require_default._(__webpack_require__(5156));
// This is replaced by webpack define plugin
const configEnv = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false,"unoptimized":false};
if (true) {
    globalThis.__NEXT_IMAGE_IMPORTED = true;
}
// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized) {
    const src = img == null ? void 0 : img.src;
    if (!img || img["data-loaded-src"] === src) {
        return;
    }
    img["data-loaded-src"] = src;
    const p = "decode" in img ? img.decode() : Promise.resolve();
    p.catch(()=>{}).then(()=>{
        if (!img.parentElement || !img.isConnected) {
            // Exit early in case of race condition:
            // - onload() is called
            // - decode() is called but incomplete
            // - unmount is called
            // - decode() completes
            return;
        }
        if (placeholder !== "empty") {
            setBlurComplete(true);
        }
        if (onLoadRef == null ? void 0 : onLoadRef.current) {
            // Since we don't have the SyntheticEvent here,
            // we must create one with the same shape.
            // See https://reactjs.org/docs/events.html
            const event = new Event("load");
            Object.defineProperty(event, "target", {
                writable: false,
                value: img
            });
            let prevented = false;
            let stopped = false;
            onLoadRef.current({
                ...event,
                nativeEvent: event,
                currentTarget: img,
                target: img,
                isDefaultPrevented: ()=>prevented,
                isPropagationStopped: ()=>stopped,
                persist: ()=>{},
                preventDefault: ()=>{
                    prevented = true;
                    event.preventDefault();
                },
                stopPropagation: ()=>{
                    stopped = true;
                    event.stopPropagation();
                }
            });
        }
        if (onLoadingCompleteRef == null ? void 0 : onLoadingCompleteRef.current) {
            onLoadingCompleteRef.current(img);
        }
        if (false) {}
    });
}
function getDynamicProps(fetchPriority) {
    const [majorStr, minorStr] = _react.version.split(".");
    const major = parseInt(majorStr, 10);
    const minor = parseInt(minorStr, 10);
    if (major > 18 || major === 18 && minor >= 3) {
        // In React 18.3.0 or newer, we must use camelCase
        // prop to avoid "Warning: Invalid DOM property".
        // See https://github.com/facebook/react/pull/25927
        return {
            fetchPriority
        };
    }
    // In React 18.2.0 or older, we must use lowercase prop
    // to avoid "Warning: Invalid DOM property".
    return {
        fetchpriority: fetchPriority
    };
}
const ImageElement = /*#__PURE__*/ (0, _react.forwardRef)((param, forwardedRef)=>{
    let { src, srcSet, sizes, height, width, decoding, className, style, fetchPriority, placeholder, loading, unoptimized, fill, onLoadRef, onLoadingCompleteRef, setBlurComplete, setShowAltText, onLoad, onError, ...rest } = param;
    return /*#__PURE__*/ _react.default.createElement("img", {
        ...rest,
        ...getDynamicProps(fetchPriority),
        // It's intended to keep `loading` before `src` because React updates
        // props in order which causes Safari/Firefox to not lazy load properly.
        // See https://github.com/facebook/react/issues/25883
        loading: loading,
        width: width,
        height: height,
        decoding: decoding,
        "data-nimg": fill ? "fill" : "1",
        className: className,
        style: style,
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        sizes: sizes,
        srcSet: srcSet,
        src: src,
        ref: (0, _react.useCallback)((img)=>{
            if (forwardedRef) {
                if (typeof forwardedRef === "function") forwardedRef(img);
                else if (typeof forwardedRef === "object") {
                    // @ts-ignore - .current is read only it's usually assigned by react internally
                    forwardedRef.current = img;
                }
            }
            if (!img) {
                return;
            }
            if (onError) {
                // If the image has an error before react hydrates, then the error is lost.
                // The workaround is to wait until the image is mounted which is after hydration,
                // then we set the src again to trigger the error handler (if there was an error).
                // eslint-disable-next-line no-self-assign
                img.src = img.src;
            }
            if (false) {}
            if (img.complete) {
                handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized);
            }
        }, [
            src,
            placeholder,
            onLoadRef,
            onLoadingCompleteRef,
            setBlurComplete,
            onError,
            unoptimized,
            forwardedRef
        ]),
        onLoad: (event)=>{
            const img = event.currentTarget;
            handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized);
        },
        onError: (event)=>{
            // if the real image fails to load, this will ensure "alt" is visible
            setShowAltText(true);
            if (placeholder !== "empty") {
                // If the real image fails to load, this will still remove the placeholder.
                setBlurComplete(true);
            }
            if (onError) {
                onError(event);
            }
        }
    });
});
function ImagePreload(param) {
    let { isAppRouter, imgAttributes } = param;
    const opts = {
        as: "image",
        imageSrcSet: imgAttributes.srcSet,
        imageSizes: imgAttributes.sizes,
        crossOrigin: imgAttributes.crossOrigin,
        referrerPolicy: imgAttributes.referrerPolicy,
        ...getDynamicProps(imgAttributes.fetchPriority)
    };
    if (isAppRouter && _reactdom.default.preload) {
        // See https://github.com/facebook/react/pull/26940
        _reactdom.default.preload(imgAttributes.src, opts);
        return null;
    }
    return /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("link", {
        key: "__nimg-" + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
        rel: "preload",
        // Note how we omit the `href` attribute, as it would only be relevant
        // for browsers that do not support `imagesrcset`, and in those cases
        // it would cause the incorrect image to be preloaded.
        //
        // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
        href: imgAttributes.srcSet ? undefined : imgAttributes.src,
        ...opts
    }));
}
const Image = /*#__PURE__*/ (0, _react.forwardRef)((props, forwardedRef)=>{
    const pagesRouter = (0, _react.useContext)(_routercontextsharedruntime.RouterContext);
    // We're in the app directory if there is no pages router.
    const isAppRouter = !pagesRouter;
    const configContext = (0, _react.useContext)(_imageconfigcontextsharedruntime.ImageConfigContext);
    const config = (0, _react.useMemo)(()=>{
        const c = configEnv || configContext || _imageconfig.imageConfigDefault;
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        return {
            ...c,
            allSizes,
            deviceSizes
        };
    }, [
        configContext
    ]);
    const { onLoad, onLoadingComplete } = props;
    const onLoadRef = (0, _react.useRef)(onLoad);
    (0, _react.useEffect)(()=>{
        onLoadRef.current = onLoad;
    }, [
        onLoad
    ]);
    const onLoadingCompleteRef = (0, _react.useRef)(onLoadingComplete);
    (0, _react.useEffect)(()=>{
        onLoadingCompleteRef.current = onLoadingComplete;
    }, [
        onLoadingComplete
    ]);
    const [blurComplete, setBlurComplete] = (0, _react.useState)(false);
    const [showAltText, setShowAltText] = (0, _react.useState)(false);
    const { props: imgAttributes, meta: imgMeta } = (0, _getimgprops.getImgProps)(props, {
        defaultLoader: _imageloader.default,
        imgConf: config,
        blurComplete,
        showAltText
    });
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(ImageElement, {
        ...imgAttributes,
        unoptimized: imgMeta.unoptimized,
        placeholder: imgMeta.placeholder,
        fill: imgMeta.fill,
        onLoadRef: onLoadRef,
        onLoadingCompleteRef: onLoadingCompleteRef,
        setBlurComplete: setBlurComplete,
        setShowAltText: setShowAltText,
        ref: forwardedRef
    }), imgMeta.priority ? /*#__PURE__*/ _react.default.createElement(ImagePreload, {
        isAppRouter: isAppRouter,
        imgAttributes: imgAttributes
    }) : null);
});
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=image-component.js.map


/***/ }),

/***/ 4234:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "isInAmpMode", ({
    enumerable: true,
    get: function() {
        return isInAmpMode;
    }
}));
function isInAmpMode(param) {
    let { ampFirst = false, hybrid = false, hasQuery = false } = param === void 0 ? {} : param;
    return ampFirst || hybrid && hasQuery;
} //# sourceMappingURL=amp-mode.js.map


/***/ }),

/***/ 842:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getImgProps", ({
    enumerable: true,
    get: function() {
        return getImgProps;
    }
}));
const _warnonce = __webpack_require__(807);
const _imageblursvg = __webpack_require__(5542);
const _imageconfig = __webpack_require__(8352);
const VALID_LOADING_VALUES = (/* unused pure expression or super */ null && ([
    "lazy",
    "eager",
    undefined
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
const allImgs = new Map();
let perfObserver;
function getInt(x) {
    if (typeof x === "undefined") {
        return x;
    }
    if (typeof x === "number") {
        return Number.isFinite(x) ? x : NaN;
    }
    if (typeof x === "string" && /^[0-9]+$/.test(x)) {
        return parseInt(x, 10);
    }
    return NaN;
}
function getWidths(param, width, sizes) {
    let { deviceSizes, allSizes } = param;
    if (sizes) {
        // Find all the "vw" percent sizes used in the sizes prop
        const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
        const percentSizes = [];
        for(let match; match = viewportWidthRe.exec(sizes); match){
            percentSizes.push(parseInt(match[2]));
        }
        if (percentSizes.length) {
            const smallestRatio = Math.min(...percentSizes) * 0.01;
            return {
                widths: allSizes.filter((s)=>s >= deviceSizes[0] * smallestRatio),
                kind: "w"
            };
        }
        return {
            widths: allSizes,
            kind: "w"
        };
    }
    if (typeof width !== "number") {
        return {
            widths: deviceSizes,
            kind: "w"
        };
    }
    const widths = [
        ...new Set(// > are actually 3x in the green color, but only 1.5x in the red and
        // > blue colors. Showing a 3x resolution image in the app vs a 2x
        // > resolution image will be visually the same, though the 3x image
        // > takes significantly more data. Even true 3x resolution screens are
        // > wasteful as the human eye cannot see that level of detail without
        // > something like a magnifying glass.
        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
        [
            width,
            width * 2 /*, width * 3*/ 
        ].map((w)=>allSizes.find((p)=>p >= w) || allSizes[allSizes.length - 1]))
    ];
    return {
        widths,
        kind: "x"
    };
}
function generateImgAttrs(param) {
    let { config, src, unoptimized, width, quality, sizes, loader } = param;
    if (unoptimized) {
        return {
            src,
            srcSet: undefined,
            sizes: undefined
        };
    }
    const { widths, kind } = getWidths(config, width, sizes);
    const last = widths.length - 1;
    return {
        sizes: !sizes && kind === "w" ? "100vw" : sizes,
        srcSet: widths.map((w, i)=>loader({
                config,
                src,
                quality,
                width: w
            }) + " " + (kind === "w" ? w : i + 1) + kind).join(", "),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
            config,
            src,
            quality,
            width: widths[last]
        })
    };
}
function getImgProps(param, _state) {
    let { src, sizes, unoptimized = false, priority = false, loading, className, quality, width, height, fill = false, style, onLoad, onLoadingComplete, placeholder = "empty", blurDataURL, fetchPriority, layout, objectFit, objectPosition, lazyBoundary, lazyRoot, ...rest } = param;
    const { imgConf, showAltText, blurComplete, defaultLoader } = _state;
    let config;
    let c = imgConf || _imageconfig.imageConfigDefault;
    if ("allSizes" in c) {
        config = c;
    } else {
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        config = {
            ...c,
            allSizes,
            deviceSizes
        };
    }
    let loader = rest.loader || defaultLoader;
    // Remove property so it's not spread on <img> element
    delete rest.loader;
    delete rest.srcSet;
    // This special value indicates that the user
    // didn't define a "loader" prop or "loader" config.
    const isDefaultLoader = "__next_img_default" in loader;
    if (isDefaultLoader) {
        if (config.loader === "custom") {
            throw new Error('Image with src "' + src + '" is missing "loader" prop.' + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader");
        }
    } else {
        // The user defined a "loader" prop or config.
        // Since the config object is internal only, we
        // must not pass it to the user-defined "loader".
        const customImageLoader = loader;
        loader = (obj)=>{
            const { config: _, ...opts } = obj;
            return customImageLoader(opts);
        };
    }
    if (layout) {
        if (layout === "fill") {
            fill = true;
        }
        const layoutToStyle = {
            intrinsic: {
                maxWidth: "100%",
                height: "auto"
            },
            responsive: {
                width: "100%",
                height: "auto"
            }
        };
        const layoutToSizes = {
            responsive: "100vw",
            fill: "100vw"
        };
        const layoutStyle = layoutToStyle[layout];
        if (layoutStyle) {
            style = {
                ...style,
                ...layoutStyle
            };
        }
        const layoutSizes = layoutToSizes[layout];
        if (layoutSizes && !sizes) {
            sizes = layoutSizes;
        }
    }
    let staticSrc = "";
    let widthInt = getInt(width);
    let heightInt = getInt(height);
    let blurWidth;
    let blurHeight;
    if (isStaticImport(src)) {
        const staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
            throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received " + JSON.stringify(staticImageData));
        }
        if (!staticImageData.height || !staticImageData.width) {
            throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received " + JSON.stringify(staticImageData));
        }
        blurWidth = staticImageData.blurWidth;
        blurHeight = staticImageData.blurHeight;
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!fill) {
            if (!widthInt && !heightInt) {
                widthInt = staticImageData.width;
                heightInt = staticImageData.height;
            } else if (widthInt && !heightInt) {
                const ratio = widthInt / staticImageData.width;
                heightInt = Math.round(staticImageData.height * ratio);
            } else if (!widthInt && heightInt) {
                const ratio = heightInt / staticImageData.height;
                widthInt = Math.round(staticImageData.width * ratio);
            }
        }
    }
    src = typeof src === "string" ? src : staticSrc;
    let isLazy = !priority && (loading === "lazy" || typeof loading === "undefined");
    if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
        // https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true;
        isLazy = false;
    }
    if (config.unoptimized) {
        unoptimized = true;
    }
    if (isDefaultLoader && src.endsWith(".svg") && !config.dangerouslyAllowSVG) {
        // Special case to make svg serve as-is to avoid proxying
        // through the built-in Image Optimization API.
        unoptimized = true;
    }
    if (priority) {
        fetchPriority = "high";
    }
    const qualityInt = getInt(quality);
    if (false) {}
    const imgStyle = Object.assign(fill ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit,
        objectPosition
    } : {}, showAltText ? {} : {
        color: "transparent"
    }, style);
    const backgroundImage = !blurComplete && placeholder !== "empty" ? placeholder === "blur" ? 'url("data:image/svg+xml;charset=utf-8,' + (0, _imageblursvg.getImageBlurSvg)({
        widthInt,
        heightInt,
        blurWidth,
        blurHeight,
        blurDataURL: blurDataURL || "",
        objectFit: imgStyle.objectFit
    }) + '")' : 'url("' + placeholder + '")' // assume `data:image/`
     : null;
    let placeholderStyle = backgroundImage ? {
        backgroundSize: imgStyle.objectFit || "cover",
        backgroundPosition: imgStyle.objectPosition || "50% 50%",
        backgroundRepeat: "no-repeat",
        backgroundImage
    } : {};
    if (false) {}
    const imgAttributes = generateImgAttrs({
        config,
        src,
        unoptimized,
        width: widthInt,
        quality: qualityInt,
        sizes,
        loader
    });
    if (false) {}
    const props = {
        ...rest,
        loading: isLazy ? "lazy" : loading,
        fetchPriority,
        width: widthInt,
        height: heightInt,
        decoding: "async",
        className,
        style: {
            ...imgStyle,
            ...placeholderStyle
        },
        sizes: imgAttributes.sizes,
        srcSet: imgAttributes.srcSet,
        src: imgAttributes.src
    };
    const meta = {
        unoptimized,
        priority,
        placeholder,
        fill
    };
    return {
        props,
        meta
    };
} //# sourceMappingURL=get-img-props.js.map


/***/ }),

/***/ 1192:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    defaultHead: function() {
        return defaultHead;
    },
    default: function() {
        return _default;
    }
});
const _interop_require_default = __webpack_require__(2147);
const _interop_require_wildcard = __webpack_require__(4009);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(9885));
const _sideeffect = /*#__PURE__*/ _interop_require_default._(__webpack_require__(2543));
const _ampcontextsharedruntime = __webpack_require__(2999);
const _headmanagercontextsharedruntime = __webpack_require__(5851);
const _ampmode = __webpack_require__(4234);
const _warnonce = __webpack_require__(807);
function defaultHead(inAmpMode) {
    if (inAmpMode === void 0) inAmpMode = false;
    const head = [
        /*#__PURE__*/ _react.default.createElement("meta", {
            charSet: "utf-8"
        })
    ];
    if (!inAmpMode) {
        head.push(/*#__PURE__*/ _react.default.createElement("meta", {
            name: "viewport",
            content: "width=device-width"
        }));
    }
    return head;
}
function onlyReactElement(list, child) {
    // React children can be "string" or "number" in this case we ignore them for backwards compat
    if (typeof child === "string" || typeof child === "number") {
        return list;
    }
    // Adds support for React.Fragment
    if (child.type === _react.default.Fragment) {
        return list.concat(_react.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild)=>{
            if (typeof fragmentChild === "string" || typeof fragmentChild === "number") {
                return fragmentList;
            }
            return fragmentList.concat(fragmentChild);
        }, []));
    }
    return list.concat(child);
}
const METATYPES = [
    "name",
    "httpEquiv",
    "charSet",
    "itemProp"
];
/*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/ function unique() {
    const keys = new Set();
    const tags = new Set();
    const metaTypes = new Set();
    const metaCategories = {};
    return (h)=>{
        let isUnique = true;
        let hasKey = false;
        if (h.key && typeof h.key !== "number" && h.key.indexOf("$") > 0) {
            hasKey = true;
            const key = h.key.slice(h.key.indexOf("$") + 1);
            if (keys.has(key)) {
                isUnique = false;
            } else {
                keys.add(key);
            }
        }
        // eslint-disable-next-line default-case
        switch(h.type){
            case "title":
            case "base":
                if (tags.has(h.type)) {
                    isUnique = false;
                } else {
                    tags.add(h.type);
                }
                break;
            case "meta":
                for(let i = 0, len = METATYPES.length; i < len; i++){
                    const metatype = METATYPES[i];
                    if (!h.props.hasOwnProperty(metatype)) continue;
                    if (metatype === "charSet") {
                        if (metaTypes.has(metatype)) {
                            isUnique = false;
                        } else {
                            metaTypes.add(metatype);
                        }
                    } else {
                        const category = h.props[metatype];
                        const categories = metaCategories[metatype] || new Set();
                        if ((metatype !== "name" || !hasKey) && categories.has(category)) {
                            isUnique = false;
                        } else {
                            categories.add(category);
                            metaCategories[metatype] = categories;
                        }
                    }
                }
                break;
        }
        return isUnique;
    };
}
/**
 *
 * @param headChildrenElements List of children of <Head>
 */ function reduceComponents(headChildrenElements, props) {
    const { inAmpMode } = props;
    return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead(inAmpMode).reverse()).filter(unique()).reverse().map((c, i)=>{
        const key = c.key || i;
        if ( true && !inAmpMode) {
            if (c.type === "link" && c.props["href"] && // TODO(prateekbh@): Replace this with const from `constants` when the tree shaking works.
            [
                "https://fonts.googleapis.com/css",
                "https://use.typekit.net/"
            ].some((url)=>c.props["href"].startsWith(url))) {
                const newProps = {
                    ...c.props || {}
                };
                newProps["data-href"] = newProps["href"];
                newProps["href"] = undefined;
                // Add this attribute to make it easy to identify optimized tags
                newProps["data-optimized-fonts"] = true;
                return /*#__PURE__*/ _react.default.cloneElement(c, newProps);
            }
        }
        if (false) {}
        return /*#__PURE__*/ _react.default.cloneElement(c, {
            key
        });
    });
}
/**
 * This component injects elements to `<head>` of your page.
 * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
 */ function Head(param) {
    let { children } = param;
    const ampState = (0, _react.useContext)(_ampcontextsharedruntime.AmpStateContext);
    const headManager = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    return /*#__PURE__*/ _react.default.createElement(_sideeffect.default, {
        reduceComponentsToState: reduceComponents,
        headManager: headManager,
        inAmpMode: (0, _ampmode.isInAmpMode)(ampState)
    }, children);
}
const _default = Head;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head.js.map


/***/ }),

/***/ 5542:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * A shared function, used on both client and server, to generate a SVG blur placeholder.
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getImageBlurSvg", ({
    enumerable: true,
    get: function() {
        return getImageBlurSvg;
    }
}));
function getImageBlurSvg(param) {
    let { widthInt, heightInt, blurWidth, blurHeight, blurDataURL, objectFit } = param;
    const std = 20;
    const svgWidth = blurWidth ? blurWidth * 40 : widthInt;
    const svgHeight = blurHeight ? blurHeight * 40 : heightInt;
    const viewBox = svgWidth && svgHeight ? "viewBox='0 0 " + svgWidth + " " + svgHeight + "'" : "";
    const preserveAspectRatio = viewBox ? "none" : objectFit === "contain" ? "xMidYMid" : objectFit === "cover" ? "xMidYMid slice" : "none";
    return "%3Csvg xmlns='http://www.w3.org/2000/svg' " + viewBox + "%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='" + std + "'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='" + std + "'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='" + preserveAspectRatio + "' style='filter: url(%23b);' href='" + blurDataURL + "'/%3E%3C/svg%3E";
} //# sourceMappingURL=image-blur-svg.js.map


/***/ }),

/***/ 8352:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    VALID_LOADERS: function() {
        return VALID_LOADERS;
    },
    imageConfigDefault: function() {
        return imageConfigDefault;
    }
});
const VALID_LOADERS = [
    "default",
    "imgix",
    "cloudinary",
    "akamai",
    "custom"
];
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
    path: "/_next/image",
    loader: "default",
    loaderFile: "",
    domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 60,
    formats: [
        "image/webp"
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
    contentDispositionType: "inline",
    remotePatterns: [],
    unoptimized: false
}; //# sourceMappingURL=image-config.js.map


/***/ }),

/***/ 8514:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    unstable_getImgProps: function() {
        return unstable_getImgProps;
    }
});
const _interop_require_default = __webpack_require__(2147);
const _getimgprops = __webpack_require__(842);
const _warnonce = __webpack_require__(807);
const _imagecomponent = __webpack_require__(5251);
const _imageloader = /*#__PURE__*/ _interop_require_default._(__webpack_require__(5156));
const unstable_getImgProps = (imgProps)=>{
    (0, _warnonce.warnOnce)("Warning: unstable_getImgProps() is experimental and may change or be removed at any time. Use at your own risk.");
    const { props } = (0, _getimgprops.getImgProps)(imgProps, {
        defaultLoader: _imageloader.default,
        // This is replaced by webpack define plugin
        imgConf: {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false,"unoptimized":false}
    });
    for (const [key, value] of Object.entries(props)){
        if (value === undefined) {
            delete props[key];
        }
    }
    return {
        props
    };
};
const _default = _imagecomponent.Image; //# sourceMappingURL=image-external.js.map


/***/ }),

/***/ 5156:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return _default;
    }
}));
function defaultLoader(param) {
    let { config, src, width, quality } = param;
    if (false) {}
    return config.path + "?url=" + encodeURIComponent(src) + "&w=" + width + "&q=" + (quality || 75) + ( false ? 0 : "");
}
// We use this to determine if the import is the default loader
// or a custom loader defined by the user in next.config.js
defaultLoader.__next_img_default = true;
const _default = defaultLoader; //# sourceMappingURL=image-loader.js.map


/***/ }),

/***/ 2543:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return SideEffect;
    }
}));
const _interop_require_wildcard = __webpack_require__(4009);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(9885));
const isServer = "undefined" === "undefined";
const useClientOnlyLayoutEffect = isServer ? ()=>{} : _react.useLayoutEffect;
const useClientOnlyEffect = isServer ? ()=>{} : _react.useEffect;
function SideEffect(props) {
    const { headManager, reduceComponentsToState } = props;
    function emitChange() {
        if (headManager && headManager.mountedInstances) {
            const headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
            headManager.updateHead(reduceComponentsToState(headElements, props));
        }
    }
    if (isServer) {
        var _headManager_mountedInstances;
        headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.add(props.children);
        emitChange();
    }
    useClientOnlyLayoutEffect(()=>{
        var _headManager_mountedInstances;
        headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.add(props.children);
        return ()=>{
            var _headManager_mountedInstances;
            headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.delete(props.children);
        };
    });
    // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
    // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
    // being rendered, we only trigger the method from the last one.
    // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
    // singleton in the layout effect pass, and actually trigger it in the effect pass.
    useClientOnlyLayoutEffect(()=>{
        if (headManager) {
            headManager._pendingUpdate = emitChange;
        }
        return ()=>{
            if (headManager) {
                headManager._pendingUpdate = emitChange;
            }
        };
    });
    useClientOnlyEffect(()=>{
        if (headManager && headManager._pendingUpdate) {
            headManager._pendingUpdate();
            headManager._pendingUpdate = null;
        }
        return ()=>{
            if (headManager && headManager._pendingUpdate) {
                headManager._pendingUpdate();
                headManager._pendingUpdate = null;
            }
        };
    });
    return null;
} //# sourceMappingURL=side-effect.js.map


/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "warnOnce", ({
    enumerable: true,
    get: function() {
        return warnOnce;
    }
}));
let warnOnce = (_)=>{};
if (false) {} //# sourceMappingURL=warn-once.js.map


/***/ }),

/***/ 3093:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RSC: function() {
        return RSC;
    },
    ACTION: function() {
        return ACTION;
    },
    NEXT_ROUTER_STATE_TREE: function() {
        return NEXT_ROUTER_STATE_TREE;
    },
    NEXT_ROUTER_PREFETCH: function() {
        return NEXT_ROUTER_PREFETCH;
    },
    NEXT_URL: function() {
        return NEXT_URL;
    },
    RSC_CONTENT_TYPE_HEADER: function() {
        return RSC_CONTENT_TYPE_HEADER;
    },
    RSC_VARY_HEADER: function() {
        return RSC_VARY_HEADER;
    },
    FLIGHT_PARAMETERS: function() {
        return FLIGHT_PARAMETERS;
    },
    NEXT_RSC_UNION_QUERY: function() {
        return NEXT_RSC_UNION_QUERY;
    }
});
const RSC = "RSC";
const ACTION = "Next-Action";
const NEXT_ROUTER_STATE_TREE = "Next-Router-State-Tree";
const NEXT_ROUTER_PREFETCH = "Next-Router-Prefetch";
const NEXT_URL = "Next-Url";
const RSC_CONTENT_TYPE_HEADER = "text/x-component";
const RSC_VARY_HEADER = RSC + ", " + NEXT_ROUTER_STATE_TREE + ", " + NEXT_ROUTER_PREFETCH + ", " + NEXT_URL;
const FLIGHT_PARAMETERS = [
    [
        RSC
    ],
    [
        NEXT_ROUTER_STATE_TREE
    ],
    [
        NEXT_ROUTER_PREFETCH
    ]
];
const NEXT_RSC_UNION_QUERY = "_rsc";
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-router-headers.js.map


/***/ }),

/***/ 8582:
/***/ ((module) => {

"use strict";

(()=>{
    "use strict";
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var e = {};
    (()=>{
        var r = e;
        /*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ r.parse = parse;
        r.serialize = serialize;
        var i = decodeURIComponent;
        var t = encodeURIComponent;
        var a = /; */;
        var n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        function parse(e, r) {
            if (typeof e !== "string") {
                throw new TypeError("argument str must be a string");
            }
            var t = {};
            var n = r || {};
            var o = e.split(a);
            var s = n.decode || i;
            for(var p = 0; p < o.length; p++){
                var f = o[p];
                var u = f.indexOf("=");
                if (u < 0) {
                    continue;
                }
                var v = f.substr(0, u).trim();
                var c = f.substr(++u, f.length).trim();
                if ('"' == c[0]) {
                    c = c.slice(1, -1);
                }
                if (undefined == t[v]) {
                    t[v] = tryDecode(c, s);
                }
            }
            return t;
        }
        function serialize(e, r, i) {
            var a = i || {};
            var o = a.encode || t;
            if (typeof o !== "function") {
                throw new TypeError("option encode is invalid");
            }
            if (!n.test(e)) {
                throw new TypeError("argument name is invalid");
            }
            var s = o(r);
            if (s && !n.test(s)) {
                throw new TypeError("argument val is invalid");
            }
            var p = e + "=" + s;
            if (null != a.maxAge) {
                var f = a.maxAge - 0;
                if (isNaN(f) || !isFinite(f)) {
                    throw new TypeError("option maxAge is invalid");
                }
                p += "; Max-Age=" + Math.floor(f);
            }
            if (a.domain) {
                if (!n.test(a.domain)) {
                    throw new TypeError("option domain is invalid");
                }
                p += "; Domain=" + a.domain;
            }
            if (a.path) {
                if (!n.test(a.path)) {
                    throw new TypeError("option path is invalid");
                }
                p += "; Path=" + a.path;
            }
            if (a.expires) {
                if (typeof a.expires.toUTCString !== "function") {
                    throw new TypeError("option expires is invalid");
                }
                p += "; Expires=" + a.expires.toUTCString();
            }
            if (a.httpOnly) {
                p += "; HttpOnly";
            }
            if (a.secure) {
                p += "; Secure";
            }
            if (a.sameSite) {
                var u = typeof a.sameSite === "string" ? a.sameSite.toLowerCase() : a.sameSite;
                switch(u){
                    case true:
                        p += "; SameSite=Strict";
                        break;
                    case "lax":
                        p += "; SameSite=Lax";
                        break;
                    case "strict":
                        p += "; SameSite=Strict";
                        break;
                    case "none":
                        p += "; SameSite=None";
                        break;
                    default:
                        throw new TypeError("option sameSite is invalid");
                }
            }
            return p;
        }
        function tryDecode(e, r) {
            try {
                return r(e);
            } catch (r) {
                return e;
            }
        }
    })();
    module.exports = e;
})();


/***/ }),

/***/ 2982:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/**
 * Tokenize input string.
 */ function lexer(str) {
    var tokens = [];
    var i = 0;
    while(i < str.length){
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({
                type: "MODIFIER",
                index: i,
                value: str[i++]
            });
            continue;
        }
        if (char === "\\") {
            tokens.push({
                type: "ESCAPED_CHAR",
                index: i++,
                value: str[i++]
            });
            continue;
        }
        if (char === "{") {
            tokens.push({
                type: "OPEN",
                index: i,
                value: str[i++]
            });
            continue;
        }
        if (char === "}") {
            tokens.push({
                type: "CLOSE",
                index: i,
                value: str[i++]
            });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while(j < str.length){
                var code = str.charCodeAt(j);
                if (// `0-9`
                code >= 48 && code <= 57 || // `A-Z`
                code >= 65 && code <= 90 || // `a-z`
                code >= 97 && code <= 122 || // `_`
                code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name) throw new TypeError("Missing parameter name at " + i);
            tokens.push({
                type: "NAME",
                index: i,
                value: name
            });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError('Pattern cannot start with "?" at ' + j);
            }
            while(j < str.length){
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                } else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at " + j);
                    }
                }
                pattern += str[j++];
            }
            if (count) throw new TypeError("Unbalanced pattern at " + i);
            if (!pattern) throw new TypeError("Missing pattern at " + i);
            tokens.push({
                type: "PATTERN",
                index: i,
                value: pattern
            });
            i = j;
            continue;
        }
        tokens.push({
            type: "CHAR",
            index: i,
            value: str[i++]
        });
    }
    tokens.push({
        type: "END",
        index: i,
        value: ""
    });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */ function parse(str, options) {
    if (options === void 0) {
        options = {};
    }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function(type) {
        if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
    };
    var mustConsume = function(type) {
        var value = tryConsume(type);
        if (value !== undefined) return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };
    var consumeText = function() {
        var result = "";
        var value;
        // tslint:disable-next-line
        while(value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")){
            result += value;
        }
        return result;
    };
    while(i < tokens.length){
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
exports.parse = parse;
/**
 * Compile a string to a template function for the path.
 */ function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
exports.compile = compile;
/**
 * Expose a method for transforming tokens into the path function.
 */ function tokensToFunction(tokens, options) {
    if (options === void 0) {
        options = {};
    }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function(x) {
        return x;
    } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function(token) {
        if (typeof token === "object") {
            return new RegExp("^(?:" + token.pattern + ")$", reFlags);
        }
    });
    return function(data) {
        var path = "";
        for(var i = 0; i < tokens.length; i++){
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError('Expected "' + token.name + '" to not repeat, but got an array');
                }
                if (value.length === 0) {
                    if (optional) continue;
                    throw new TypeError('Expected "' + token.name + '" to not be empty');
                }
                for(var j = 0; j < value.length; j++){
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"');
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"');
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional) continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError('Expected "' + token.name + '" to be ' + typeOfMessage);
        }
        return path;
    };
}
exports.tokensToFunction = tokensToFunction;
/**
 * Create path match function from `path-to-regexp` spec.
 */ function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
}
exports.match = match;
/**
 * Create a path match function from `path-to-regexp` output.
 */ function regexpToFunction(re, keys, options) {
    if (options === void 0) {
        options = {};
    }
    var _a = options.decode, decode = _a === void 0 ? function(x) {
        return x;
    } : _a;
    return function(pathname) {
        var m = re.exec(pathname);
        if (!m) return false;
        var path = m[0], index = m.index;
        var params = Object.create(null);
        var _loop_1 = function(i) {
            // tslint:disable-next-line
            if (m[i] === undefined) return "continue";
            var key = keys[i - 1];
            if (key.modifier === "*" || key.modifier === "+") {
                params[key.name] = m[i].split(key.prefix + key.suffix).map(function(value) {
                    return decode(value, key);
                });
            } else {
                params[key.name] = decode(m[i], key);
            }
        };
        for(var i = 1; i < m.length; i++){
            _loop_1(i);
        }
        return {
            path: path,
            index: index,
            params: params
        };
    };
}
exports.regexpToFunction = regexpToFunction;
/**
 * Escape a regular expression string.
 */ function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */ function flags(options) {
    return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */ function regexpToRegexp(path, keys) {
    if (!keys) return path;
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for(var i = 0; i < groups.length; i++){
            keys.push({
                name: i,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
        }
    }
    return path;
}
/**
 * Transform an array into a regexp.
 */ function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function(path) {
        return pathToRegexp(path, keys, options).source;
    });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
}
/**
 * Create a path regexp from string input.
 */ function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */ function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) {
        options = {};
    }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
        return x;
    } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : "";
    // Iterate over the tokens and create our regexp string.
    for(var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++){
        var token = tokens_1[_i];
        if (typeof token === "string") {
            route += escapeString(encode(token));
        } else {
            var prefix = escapeString(encode(token.prefix));
            var suffix = escapeString(encode(token.suffix));
            if (token.pattern) {
                if (keys) keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        var mod = token.modifier === "*" ? "?" : "";
                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                    } else {
                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                    }
                } else {
                    route += "(" + token.pattern + ")" + token.modifier;
                }
            } else {
                route += "(?:" + prefix + suffix + ")" + token.modifier;
            }
        }
    }
    if (end) {
        if (!strict) route += delimiter + "?";
        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    } else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string" ? delimiter.indexOf(endToken[endToken.length - 1]) > -1 : endToken === undefined;
        if (!strict) {
            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
        }
        if (!isEndDelimited) {
            route += "(?=" + delimiter + "|" + endsWith + ")";
        }
    }
    return new RegExp(route, flags(options));
}
exports.tokensToRegexp = tokensToRegexp;
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */ function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp) return regexpToRegexp(path, keys);
    if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
}
exports.pathToRegexp = pathToRegexp; //# sourceMappingURL=index.js.map


/***/ }),

/***/ 1209:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    NEXT_QUERY_PARAM_PREFIX: function() {
        return NEXT_QUERY_PARAM_PREFIX;
    },
    PRERENDER_REVALIDATE_HEADER: function() {
        return PRERENDER_REVALIDATE_HEADER;
    },
    PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function() {
        return PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER;
    },
    NEXT_CACHE_TAGS_HEADER: function() {
        return NEXT_CACHE_TAGS_HEADER;
    },
    NEXT_CACHE_SOFT_TAGS_HEADER: function() {
        return NEXT_CACHE_SOFT_TAGS_HEADER;
    },
    NEXT_CACHE_REVALIDATED_TAGS_HEADER: function() {
        return NEXT_CACHE_REVALIDATED_TAGS_HEADER;
    },
    NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function() {
        return NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER;
    },
    NEXT_CACHE_TAG_MAX_LENGTH: function() {
        return NEXT_CACHE_TAG_MAX_LENGTH;
    },
    NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function() {
        return NEXT_CACHE_SOFT_TAG_MAX_LENGTH;
    },
    NEXT_CACHE_IMPLICIT_TAG_ID: function() {
        return NEXT_CACHE_IMPLICIT_TAG_ID;
    },
    CACHE_ONE_YEAR: function() {
        return CACHE_ONE_YEAR;
    },
    MIDDLEWARE_FILENAME: function() {
        return MIDDLEWARE_FILENAME;
    },
    MIDDLEWARE_LOCATION_REGEXP: function() {
        return MIDDLEWARE_LOCATION_REGEXP;
    },
    INSTRUMENTATION_HOOK_FILENAME: function() {
        return INSTRUMENTATION_HOOK_FILENAME;
    },
    PAGES_DIR_ALIAS: function() {
        return PAGES_DIR_ALIAS;
    },
    DOT_NEXT_ALIAS: function() {
        return DOT_NEXT_ALIAS;
    },
    ROOT_DIR_ALIAS: function() {
        return ROOT_DIR_ALIAS;
    },
    APP_DIR_ALIAS: function() {
        return APP_DIR_ALIAS;
    },
    RSC_MOD_REF_PROXY_ALIAS: function() {
        return RSC_MOD_REF_PROXY_ALIAS;
    },
    RSC_ACTION_VALIDATE_ALIAS: function() {
        return RSC_ACTION_VALIDATE_ALIAS;
    },
    RSC_ACTION_PROXY_ALIAS: function() {
        return RSC_ACTION_PROXY_ALIAS;
    },
    RSC_ACTION_CLIENT_WRAPPER_ALIAS: function() {
        return RSC_ACTION_CLIENT_WRAPPER_ALIAS;
    },
    PUBLIC_DIR_MIDDLEWARE_CONFLICT: function() {
        return PUBLIC_DIR_MIDDLEWARE_CONFLICT;
    },
    SSG_GET_INITIAL_PROPS_CONFLICT: function() {
        return SSG_GET_INITIAL_PROPS_CONFLICT;
    },
    SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function() {
        return SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
    },
    SERVER_PROPS_SSG_CONFLICT: function() {
        return SERVER_PROPS_SSG_CONFLICT;
    },
    STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function() {
        return STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
    },
    SERVER_PROPS_EXPORT_ERROR: function() {
        return SERVER_PROPS_EXPORT_ERROR;
    },
    GSP_NO_RETURNED_VALUE: function() {
        return GSP_NO_RETURNED_VALUE;
    },
    GSSP_NO_RETURNED_VALUE: function() {
        return GSSP_NO_RETURNED_VALUE;
    },
    UNSTABLE_REVALIDATE_RENAME_ERROR: function() {
        return UNSTABLE_REVALIDATE_RENAME_ERROR;
    },
    GSSP_COMPONENT_MEMBER_ERROR: function() {
        return GSSP_COMPONENT_MEMBER_ERROR;
    },
    NON_STANDARD_NODE_ENV: function() {
        return NON_STANDARD_NODE_ENV;
    },
    SSG_FALLBACK_EXPORT_ERROR: function() {
        return SSG_FALLBACK_EXPORT_ERROR;
    },
    ESLINT_DEFAULT_DIRS: function() {
        return ESLINT_DEFAULT_DIRS;
    },
    ESLINT_PROMPT_VALUES: function() {
        return ESLINT_PROMPT_VALUES;
    },
    SERVER_RUNTIME: function() {
        return SERVER_RUNTIME;
    },
    WEBPACK_LAYERS: function() {
        return WEBPACK_LAYERS;
    },
    WEBPACK_RESOURCE_QUERIES: function() {
        return WEBPACK_RESOURCE_QUERIES;
    }
});
const NEXT_QUERY_PARAM_PREFIX = "nxtP";
const PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
const PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = "x-prerender-revalidate-if-generated";
const NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags";
const NEXT_CACHE_SOFT_TAGS_HEADER = "x-next-cache-soft-tags";
const NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags";
const NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = "x-next-revalidate-tag-token";
const NEXT_CACHE_TAG_MAX_LENGTH = 256;
const NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
const NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_";
const CACHE_ONE_YEAR = 31536000;
const MIDDLEWARE_FILENAME = "middleware";
const MIDDLEWARE_LOCATION_REGEXP = `(?:src/)?${MIDDLEWARE_FILENAME}`;
const INSTRUMENTATION_HOOK_FILENAME = "instrumentation";
const PAGES_DIR_ALIAS = "private-next-pages";
const DOT_NEXT_ALIAS = "private-dot-next";
const ROOT_DIR_ALIAS = "private-next-root-dir";
const APP_DIR_ALIAS = "private-next-app-dir";
const RSC_MOD_REF_PROXY_ALIAS = "next/dist/build/webpack/loaders/next-flight-loader/module-proxy";
const RSC_ACTION_VALIDATE_ALIAS = "private-next-rsc-action-validate";
const RSC_ACTION_PROXY_ALIAS = "private-next-rsc-action-proxy";
const RSC_ACTION_CLIENT_WRAPPER_ALIAS = "private-next-rsc-action-client-wrapper";
const PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`;
const SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;
const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;
const SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`;
const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = `can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`;
const SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`;
const GSP_NO_RETURNED_VALUE = "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
const GSSP_NO_RETURNED_VALUE = "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
const UNSTABLE_REVALIDATE_RENAME_ERROR = "The `unstable_revalidate` property is available for general use.\n" + "Please use `revalidate` instead.";
const GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`;
const NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`;
const SSG_FALLBACK_EXPORT_ERROR = `Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`;
const ESLINT_DEFAULT_DIRS = [
    "app",
    "pages",
    "components",
    "lib",
    "src"
];
const ESLINT_PROMPT_VALUES = [
    {
        title: "Strict",
        recommended: true,
        config: {
            extends: "next/core-web-vitals"
        }
    },
    {
        title: "Base",
        config: {
            extends: "next"
        }
    },
    {
        title: "Cancel",
        config: null
    }
];
const SERVER_RUNTIME = {
    edge: "edge",
    experimentalEdge: "experimental-edge",
    nodejs: "nodejs"
};
/**
 * The names of the webpack layers. These layers are the primitives for the
 * webpack chunks.
 */ const WEBPACK_LAYERS_NAMES = {
    /**
   * The layer for the shared code between the client and server bundles.
   */ shared: "shared",
    /**
   * React Server Components layer (rsc).
   */ reactServerComponents: "rsc",
    /**
   * Server Side Rendering layer for app (ssr).
   */ serverSideRendering: "ssr",
    /**
   * The browser client bundle layer for actions.
   */ actionBrowser: "action-browser",
    /**
   * The layer for the API routes.
   */ api: "api",
    /**
   * The layer for the middleware code.
   */ middleware: "middleware",
    /**
   * The layer for assets on the edge.
   */ edgeAsset: "edge-asset",
    /**
   * The browser client bundle layer for App directory.
   */ appPagesBrowser: "app-pages-browser",
    /**
   * The server bundle layer for metadata routes.
   */ appMetadataRoute: "app-metadata-route",
    /**
   * The layer for the server bundle for App Route handlers.
   */ appRouteHandler: "app-route-handler"
};
const WEBPACK_LAYERS = {
    ...WEBPACK_LAYERS_NAMES,
    GROUP: {
        server: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler
        ],
        nonClientServerTarget: [
            // plus middleware and pages api
            WEBPACK_LAYERS_NAMES.middleware,
            WEBPACK_LAYERS_NAMES.api
        ],
        app: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser
        ]
    }
};
const WEBPACK_RESOURCE_QUERIES = {
    edgeSSREntry: "__next_edge_ssr_entry__",
    metadata: "__next_metadata__",
    metadataRoute: "__next_metadata_route__",
    metadataImageMeta: "__next_metadata_image_meta__"
}; //# sourceMappingURL=constants.js.map


/***/ }),

/***/ 6885:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    fillMetadataSegment: function() {
        return fillMetadataSegment;
    },
    normalizeMetadataRoute: function() {
        return normalizeMetadataRoute;
    }
});
const _ismetadataroute = __webpack_require__(3223);
const _path = /*#__PURE__*/ _interop_require_default(__webpack_require__(7001));
const _serverutils = __webpack_require__(1645);
const _routeregex = __webpack_require__(6136);
const _hash = __webpack_require__(889);
const _apppaths = __webpack_require__(4547);
const _normalizepathsep = __webpack_require__(4029);
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/*
 * If there's special convention like (...) or @ in the page path,
 * Give it a unique hash suffix to avoid conflicts
 *
 * e.g.
 * /app/open-graph.tsx -> /open-graph/route
 * /app/(post)/open-graph.tsx -> /open-graph/route-[0-9a-z]{6}
 */ function getMetadataRouteSuffix(page) {
    let suffix = "";
    if (page.includes("(") && page.includes(")") || page.includes("@")) {
        suffix = (0, _hash.djb2Hash)(page).toString(36).slice(0, 6);
    }
    return suffix;
}
function fillMetadataSegment(segment, params, imageSegment) {
    const pathname = (0, _apppaths.normalizeAppPath)(segment);
    const routeRegex = (0, _routeregex.getNamedRouteRegex)(pathname, false);
    const route = (0, _serverutils.interpolateDynamicPath)(pathname, params, routeRegex);
    const suffix = getMetadataRouteSuffix(segment);
    const routeSuffix = suffix ? `-${suffix}` : "";
    const { name, ext } = _path.default.parse(imageSegment);
    return (0, _normalizepathsep.normalizePathSep)(_path.default.join(route, `${name}${routeSuffix}${ext}`));
}
function normalizeMetadataRoute(page) {
    if (!(0, _ismetadataroute.isMetadataRoute)(page)) {
        return page;
    }
    let route = page;
    let suffix = "";
    if (page === "/robots") {
        route += ".txt";
    } else if (page === "/manifest") {
        route += ".webmanifest";
    } else if (page.endsWith("/sitemap")) {
        route += ".xml";
    } else {
        // Remove the file extension, e.g. /route-path/robots.txt -> /route-path
        const pathnamePrefix = page.slice(0, -(_path.default.basename(page).length + 1));
        suffix = getMetadataRouteSuffix(pathnamePrefix);
    }
    // Support both /<metadata-route.ext> and custom routes /<metadata-route>/route.ts.
    // If it's a metadata file route, we need to append /[id]/route to the page.
    if (!route.endsWith("/route")) {
        const { dir, name: baseName, ext } = _path.default.parse(route);
        const isStaticRoute = (0, _ismetadataroute.isStaticMetadataRoute)(page);
        route = _path.default.posix.join(dir, `${baseName}${suffix ? `-${suffix}` : ""}${ext}`, isStaticRoute ? "" : "[[...__metadata_id__]]", "route");
    }
    return route;
} //# sourceMappingURL=get-metadata-route.js.map


/***/ }),

/***/ 3223:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    STATIC_METADATA_IMAGES: function() {
        return STATIC_METADATA_IMAGES;
    },
    isMetadataRouteFile: function() {
        return isMetadataRouteFile;
    },
    isStaticMetadataRouteFile: function() {
        return isStaticMetadataRouteFile;
    },
    isStaticMetadataRoute: function() {
        return isStaticMetadataRoute;
    },
    isMetadataRoute: function() {
        return isMetadataRoute;
    }
});
const _normalizepathsep = __webpack_require__(4029);
const STATIC_METADATA_IMAGES = {
    icon: {
        filename: "icon",
        extensions: [
            "ico",
            "jpg",
            "jpeg",
            "png",
            "svg"
        ]
    },
    apple: {
        filename: "apple-icon",
        extensions: [
            "jpg",
            "jpeg",
            "png"
        ]
    },
    favicon: {
        filename: "favicon",
        extensions: [
            "ico"
        ]
    },
    openGraph: {
        filename: "opengraph-image",
        extensions: [
            "jpg",
            "jpeg",
            "png",
            "gif"
        ]
    },
    twitter: {
        filename: "twitter-image",
        extensions: [
            "jpg",
            "jpeg",
            "png",
            "gif"
        ]
    }
};
// Match routes that are metadata routes, e.g. /sitemap.xml, /favicon.<ext>, /<icon>.<ext>, etc.
// TODO-METADATA: support more metadata routes with more extensions
const defaultExtensions = [
    "js",
    "jsx",
    "ts",
    "tsx"
];
const getExtensionRegexString = (extensions)=>`(?:${extensions.join("|")})`;
function isMetadataRouteFile(appDirRelativePath, pageExtensions, withExtension) {
    const metadataRouteFilesRegex = [
        new RegExp(`^[\\\\/]robots${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat("txt"))}$` : ""}`),
        new RegExp(`^[\\\\/]manifest${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat("webmanifest", "json"))}$` : ""}`),
        new RegExp(`^[\\\\/]favicon\\.ico$`),
        new RegExp(`[\\\\/]sitemap${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat("xml"))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.icon.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.icon.extensions))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.apple.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.apple.extensions))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.openGraph.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.openGraph.extensions))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.twitter.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.twitter.extensions))}$` : ""}`)
    ];
    const normalizedAppDirRelativePath = (0, _normalizepathsep.normalizePathSep)(appDirRelativePath);
    return metadataRouteFilesRegex.some((r)=>r.test(normalizedAppDirRelativePath));
}
function isStaticMetadataRouteFile(appDirRelativePath) {
    return isMetadataRouteFile(appDirRelativePath, [], true);
}
function isStaticMetadataRoute(page) {
    return page === "/robots" || page === "/manifest" || isStaticMetadataRouteFile(page);
}
function isMetadataRoute(route) {
    let page = route.replace(/^\/?app\//, "").replace(/\/route$/, "");
    if (page[0] !== "/") page = "/" + page;
    return !page.endsWith("/page") && isMetadataRouteFile(page, defaultExtensions, false);
} //# sourceMappingURL=is-metadata-route.js.map


/***/ }),

/***/ 994:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getCookieParser", ({
    enumerable: true,
    get: function() {
        return getCookieParser;
    }
}));
function getCookieParser(headers) {
    return function parseCookie() {
        const { cookie } = headers;
        if (!cookie) {
            return {};
        }
        const { parse: parseCookieFn } = __webpack_require__(8582);
        return parseCookieFn(Array.isArray(cookie) ? cookie.join("; ") : cookie);
    };
} //# sourceMappingURL=get-cookie-parser.js.map


/***/ }),

/***/ 6098:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERCEPTION_ROUTE_MARKERS: function() {
        return INTERCEPTION_ROUTE_MARKERS;
    },
    isInterceptionRouteAppPath: function() {
        return isInterceptionRouteAppPath;
    },
    extractInterceptionRouteInformation: function() {
        return extractInterceptionRouteInformation;
    }
});
const _apppaths = __webpack_require__(4547);
const INTERCEPTION_ROUTE_MARKERS = [
    "(..)(..)",
    "(.)",
    "(..)",
    "(...)"
];
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split("/").find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute, marker, interceptedRoute;
    for (const segment of path.split("/")){
        marker = INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        if (marker) {
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
        }
    }
    if (!interceptingRoute || !marker || !interceptedRoute) {
        throw new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`);
    }
    interceptingRoute = (0, _apppaths.normalizeAppPath)(interceptingRoute) // normalize the path, e.g. /(blog)/feed -> /feed
    ;
    switch(marker){
        case "(.)":
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === "/") {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + "/" + interceptedRoute;
            }
            break;
        case "(..)":
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === "/") {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`);
            }
            interceptedRoute = interceptingRoute.split("/").slice(0, -1).concat(interceptedRoute).join("/");
            break;
        case "(...)":
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = "/" + interceptedRoute;
            break;
        case "(..)(..)":
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split("/");
            if (splitInterceptingRoute.length <= 2) {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`);
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join("/");
            break;
        default:
            throw new Error("Invariant: unexpected marker");
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
} //# sourceMappingURL=interception-routes.js.map


/***/ }),

/***/ 1645:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    normalizeVercelUrl: function() {
        return normalizeVercelUrl;
    },
    interpolateDynamicPath: function() {
        return interpolateDynamicPath;
    },
    getUtils: function() {
        return getUtils;
    }
});
const _url = __webpack_require__(7310);
const _normalizelocalepath = __webpack_require__(3688);
const _pathmatch = __webpack_require__(4016);
const _routeregex = __webpack_require__(6136);
const _routematcher = __webpack_require__(4727);
const _preparedestination = __webpack_require__(3682);
const _removetrailingslash = __webpack_require__(2664);
const _apppaths = __webpack_require__(4547);
const _constants = __webpack_require__(1209);
function normalizeVercelUrl(req, trustQuery, paramKeys, pageIsDynamic, defaultRouteRegex) {
    // make sure to normalize req.url on Vercel to strip dynamic params
    // from the query which are added during routing
    if (pageIsDynamic && trustQuery && defaultRouteRegex) {
        const _parsedUrl = (0, _url.parse)(req.url, true);
        delete _parsedUrl.search;
        for (const key of Object.keys(_parsedUrl.query)){
            if (key !== _constants.NEXT_QUERY_PARAM_PREFIX && key.startsWith(_constants.NEXT_QUERY_PARAM_PREFIX) || (paramKeys || Object.keys(defaultRouteRegex.groups)).includes(key)) {
                delete _parsedUrl.query[key];
            }
        }
        req.url = (0, _url.format)(_parsedUrl);
    }
}
function interpolateDynamicPath(pathname, params, defaultRouteRegex) {
    if (!defaultRouteRegex) return pathname;
    for (const param of Object.keys(defaultRouteRegex.groups)){
        const { optional, repeat } = defaultRouteRegex.groups[param];
        let builtParam = `[${repeat ? "..." : ""}${param}]`;
        if (optional) {
            builtParam = `[${builtParam}]`;
        }
        const paramIdx = pathname.indexOf(builtParam);
        if (paramIdx > -1) {
            let paramValue;
            const value = params[param];
            if (Array.isArray(value)) {
                paramValue = value.map((v)=>v && encodeURIComponent(v)).join("/");
            } else if (value) {
                paramValue = encodeURIComponent(value);
            } else {
                paramValue = "";
            }
            pathname = pathname.slice(0, paramIdx) + paramValue + pathname.slice(paramIdx + builtParam.length);
        }
    }
    return pathname;
}
function getUtils({ page, i18n, basePath, rewrites, pageIsDynamic, trailingSlash, caseSensitive }) {
    let defaultRouteRegex;
    let dynamicRouteMatcher;
    let defaultRouteMatches;
    if (pageIsDynamic) {
        defaultRouteRegex = (0, _routeregex.getNamedRouteRegex)(page, false);
        dynamicRouteMatcher = (0, _routematcher.getRouteMatcher)(defaultRouteRegex);
        defaultRouteMatches = dynamicRouteMatcher(page);
    }
    function handleRewrites(req, parsedUrl) {
        const rewriteParams = {};
        let fsPathname = parsedUrl.pathname;
        const matchesPage = ()=>{
            const fsPathnameNoSlash = (0, _removetrailingslash.removeTrailingSlash)(fsPathname || "");
            return fsPathnameNoSlash === (0, _removetrailingslash.removeTrailingSlash)(page) || (dynamicRouteMatcher == null ? void 0 : dynamicRouteMatcher(fsPathnameNoSlash));
        };
        const checkRewrite = (rewrite)=>{
            const matcher = (0, _pathmatch.getPathMatch)(rewrite.source + (trailingSlash ? "(/)?" : ""), {
                removeUnnamedParams: true,
                strict: true,
                sensitive: !!caseSensitive
            });
            let params = matcher(parsedUrl.pathname);
            if ((rewrite.has || rewrite.missing) && params) {
                const hasParams = (0, _preparedestination.matchHas)(req, parsedUrl.query, rewrite.has, rewrite.missing);
                if (hasParams) {
                    Object.assign(params, hasParams);
                } else {
                    params = false;
                }
            }
            if (params) {
                const { parsedDestination, destQuery } = (0, _preparedestination.prepareDestination)({
                    appendParamsToQuery: true,
                    destination: rewrite.destination,
                    params: params,
                    query: parsedUrl.query
                });
                // if the rewrite destination is external break rewrite chain
                if (parsedDestination.protocol) {
                    return true;
                }
                Object.assign(rewriteParams, destQuery, params);
                Object.assign(parsedUrl.query, parsedDestination.query);
                delete parsedDestination.query;
                Object.assign(parsedUrl, parsedDestination);
                fsPathname = parsedUrl.pathname;
                if (basePath) {
                    fsPathname = fsPathname.replace(new RegExp(`^${basePath}`), "") || "/";
                }
                if (i18n) {
                    const destLocalePathResult = (0, _normalizelocalepath.normalizeLocalePath)(fsPathname, i18n.locales);
                    fsPathname = destLocalePathResult.pathname;
                    parsedUrl.query.nextInternalLocale = destLocalePathResult.detectedLocale || params.nextInternalLocale;
                }
                if (fsPathname === page) {
                    return true;
                }
                if (pageIsDynamic && dynamicRouteMatcher) {
                    const dynamicParams = dynamicRouteMatcher(fsPathname);
                    if (dynamicParams) {
                        parsedUrl.query = {
                            ...parsedUrl.query,
                            ...dynamicParams
                        };
                        return true;
                    }
                }
            }
            return false;
        };
        for (const rewrite of rewrites.beforeFiles || []){
            checkRewrite(rewrite);
        }
        if (fsPathname !== page) {
            let finished = false;
            for (const rewrite of rewrites.afterFiles || []){
                finished = checkRewrite(rewrite);
                if (finished) break;
            }
            if (!finished && !matchesPage()) {
                for (const rewrite of rewrites.fallback || []){
                    finished = checkRewrite(rewrite);
                    if (finished) break;
                }
            }
        }
        return rewriteParams;
    }
    function getParamsFromRouteMatches(req, renderOpts, detectedLocale) {
        return (0, _routematcher.getRouteMatcher)(function() {
            const { groups, routeKeys } = defaultRouteRegex;
            return {
                re: {
                    // Simulate a RegExp match from the \`req.url\` input
                    exec: (str)=>{
                        const obj = Object.fromEntries(new URLSearchParams(str));
                        const matchesHasLocale = i18n && detectedLocale && obj["1"] === detectedLocale;
                        for (const key of Object.keys(obj)){
                            const value = obj[key];
                            if (key !== _constants.NEXT_QUERY_PARAM_PREFIX && key.startsWith(_constants.NEXT_QUERY_PARAM_PREFIX)) {
                                const normalizedKey = key.substring(_constants.NEXT_QUERY_PARAM_PREFIX.length);
                                obj[normalizedKey] = value;
                                delete obj[key];
                            }
                        }
                        // favor named matches if available
                        const routeKeyNames = Object.keys(routeKeys || {});
                        const filterLocaleItem = (val)=>{
                            if (i18n) {
                                // locale items can be included in route-matches
                                // for fallback SSG pages so ensure they are
                                // filtered
                                const isCatchAll = Array.isArray(val);
                                const _val = isCatchAll ? val[0] : val;
                                if (typeof _val === "string" && i18n.locales.some((item)=>{
                                    if (item.toLowerCase() === _val.toLowerCase()) {
                                        detectedLocale = item;
                                        renderOpts.locale = detectedLocale;
                                        return true;
                                    }
                                    return false;
                                })) {
                                    // remove the locale item from the match
                                    if (isCatchAll) {
                                        val.splice(0, 1);
                                    }
                                    // the value is only a locale item and
                                    // shouldn't be added
                                    return isCatchAll ? val.length === 0 : true;
                                }
                            }
                            return false;
                        };
                        if (routeKeyNames.every((name)=>obj[name])) {
                            return routeKeyNames.reduce((prev, keyName)=>{
                                const paramName = routeKeys == null ? void 0 : routeKeys[keyName];
                                if (paramName && !filterLocaleItem(obj[keyName])) {
                                    prev[groups[paramName].pos] = obj[keyName];
                                }
                                return prev;
                            }, {});
                        }
                        return Object.keys(obj).reduce((prev, key)=>{
                            if (!filterLocaleItem(obj[key])) {
                                let normalizedKey = key;
                                if (matchesHasLocale) {
                                    normalizedKey = parseInt(key, 10) - 1 + "";
                                }
                                return Object.assign(prev, {
                                    [normalizedKey]: obj[key]
                                });
                            }
                            return prev;
                        }, {});
                    }
                },
                groups
            };
        }())(req.headers["x-now-route-matches"]);
    }
    function normalizeDynamicRouteParams(params, ignoreOptional) {
        let hasValidParams = true;
        if (!defaultRouteRegex) return {
            params,
            hasValidParams: false
        };
        params = Object.keys(defaultRouteRegex.groups).reduce((prev, key)=>{
            let value = params[key];
            if (typeof value === "string") {
                value = (0, _apppaths.normalizeRscPath)(value, true);
            }
            if (Array.isArray(value)) {
                value = value.map((val)=>{
                    if (typeof val === "string") {
                        val = (0, _apppaths.normalizeRscPath)(val, true);
                    }
                    return val;
                });
            }
            // if the value matches the default value we can't rely
            // on the parsed params, this is used to signal if we need
            // to parse x-now-route-matches or not
            const defaultValue = defaultRouteMatches[key];
            const isOptional = defaultRouteRegex.groups[key].optional;
            const isDefaultValue = Array.isArray(defaultValue) ? defaultValue.some((defaultVal)=>{
                return Array.isArray(value) ? value.some((val)=>val.includes(defaultVal)) : value == null ? void 0 : value.includes(defaultVal);
            }) : value == null ? void 0 : value.includes(defaultValue);
            if (isDefaultValue || typeof value === "undefined" && !(isOptional && ignoreOptional)) {
                hasValidParams = false;
            }
            // non-provided optional values should be undefined so normalize
            // them to undefined
            if (isOptional && (!value || Array.isArray(value) && value.length === 1 && // fallback optional catch-all SSG pages have
            // [[...paramName]] for the root path on Vercel
            (value[0] === "index" || value[0] === `[[...${key}]]`))) {
                value = undefined;
                delete params[key];
            }
            // query values from the proxy aren't already split into arrays
            // so make sure to normalize catch-all values
            if (value && typeof value === "string" && defaultRouteRegex.groups[key].repeat) {
                value = value.split("/");
            }
            if (value) {
                prev[key] = value;
            }
            return prev;
        }, {});
        return {
            params,
            hasValidParams
        };
    }
    return {
        handleRewrites,
        defaultRouteRegex,
        dynamicRouteMatcher,
        defaultRouteMatches,
        getParamsFromRouteMatches,
        normalizeDynamicRouteParams,
        normalizeVercelUrl: (req, trustQuery, paramKeys)=>normalizeVercelUrl(req, trustQuery, paramKeys, pageIsDynamic, defaultRouteRegex),
        interpolateDynamicPath: (pathname, params)=>interpolateDynamicPath(pathname, params, defaultRouteRegex)
    };
} //# sourceMappingURL=server-utils.js.map


/***/ }),

/***/ 9405:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// regexp is based on https://github.com/sindresorhus/escape-string-regexp

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "escapeStringRegexp", ({
    enumerable: true,
    get: function() {
        return escapeStringRegexp;
    }
}));
const reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
const reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
function escapeStringRegexp(str) {
    // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
    if (reHasRegExp.test(str)) {
        return str.replace(reReplaceRegExp, "\\$&");
    }
    return str;
} //# sourceMappingURL=escape-regexp.js.map


/***/ }),

/***/ 889:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// http://www.cse.yorku.ca/~oz/hash.html

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    djb2Hash: function() {
        return djb2Hash;
    },
    hexHash: function() {
        return hexHash;
    }
});
function djb2Hash(str) {
    let hash = 5381;
    for(let i = 0; i < str.length; i++){
        const char = str.charCodeAt(i);
        hash = (hash << 5) + hash + char;
    }
    return Math.abs(hash);
}
function hexHash(str) {
    return djb2Hash(str).toString(36).slice(0, 5);
} //# sourceMappingURL=hash.js.map


/***/ }),

/***/ 3688:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "normalizeLocalePath", ({
    enumerable: true,
    get: function() {
        return normalizeLocalePath;
    }
}));
function normalizeLocalePath(pathname, locales) {
    let detectedLocale;
    // first item will be empty string from splitting at first char
    const pathnameParts = pathname.split("/");
    (locales || []).some((locale)=>{
        if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
            detectedLocale = locale;
            pathnameParts.splice(1, 1);
            pathname = pathnameParts.join("/") || "/";
            return true;
        }
        return false;
    });
    return {
        pathname,
        detectedLocale
    };
} //# sourceMappingURL=normalize-locale-path.js.map


/***/ }),

/***/ 7001:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * This module is for next.js server internal usage of path module.
 * It will use native path module for nodejs runtime.
 * It will use path-browserify polyfill for edge runtime.
 */ 
let path;
if (false) {} else {
    path = __webpack_require__(1017);
}
module.exports = path; //# sourceMappingURL=path.js.map


/***/ }),

/***/ 6800:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * For a given page path, this function ensures that there is a leading slash.
 * If there is not a leading slash, one is added, otherwise it is noop.
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "ensureLeadingSlash", ({
    enumerable: true,
    get: function() {
        return ensureLeadingSlash;
    }
}));
function ensureLeadingSlash(path) {
    return path.startsWith("/") ? path : "/" + path;
} //# sourceMappingURL=ensure-leading-slash.js.map


/***/ }),

/***/ 4029:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * For a given page path, this function ensures that there is no backslash
 * escaping slashes in the path. Example:
 *  - `foo\/bar\/baz` -> `foo/bar/baz`
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "normalizePathSep", ({
    enumerable: true,
    get: function() {
        return normalizePathSep;
    }
}));
function normalizePathSep(path) {
    return path.replace(/\\/g, "/");
} //# sourceMappingURL=normalize-path-sep.js.map


/***/ }),

/***/ 4547:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    normalizeAppPath: function() {
        return normalizeAppPath;
    },
    normalizeRscPath: function() {
        return normalizeRscPath;
    }
});
const _ensureleadingslash = __webpack_require__(6800);
const _segment = __webpack_require__(3391);
function normalizeAppPath(route) {
    return (0, _ensureleadingslash.ensureLeadingSlash)(route.split("/").reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if ((0, _segment.isGroupSegment)(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === "@") {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === "page" || segment === "route") && index === segments.length - 1) {
            return pathname;
        }
        return pathname + "/" + segment;
    }, ""));
}
function normalizeRscPath(pathname, enabled) {
    return enabled ? pathname.replace(/\.rsc($|\?)/, "$1") : pathname;
} //# sourceMappingURL=app-paths.js.map


/***/ }),

/***/ 2730:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "parseRelativeUrl", ({
    enumerable: true,
    get: function() {
        return parseRelativeUrl;
    }
}));
const _utils = __webpack_require__(2261);
const _querystring = __webpack_require__(5588);
function parseRelativeUrl(url, base) {
    const globalBase = new URL( true ? "http://n" : 0);
    const resolvedBase = base ? new URL(base, globalBase) : url.startsWith(".") ? new URL( true ? "http://n" : 0) : globalBase;
    const { pathname, searchParams, search, hash, href, origin } = new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw new Error("invariant: invalid relative URL, router received " + url);
    }
    return {
        pathname,
        query: (0, _querystring.searchParamsToUrlQuery)(searchParams),
        search,
        hash,
        href: href.slice(globalBase.origin.length)
    };
} //# sourceMappingURL=parse-relative-url.js.map


/***/ }),

/***/ 7037:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "parseUrl", ({
    enumerable: true,
    get: function() {
        return parseUrl;
    }
}));
const _querystring = __webpack_require__(5588);
const _parserelativeurl = __webpack_require__(2730);
function parseUrl(url) {
    if (url.startsWith("/")) {
        return (0, _parserelativeurl.parseRelativeUrl)(url);
    }
    const parsedURL = new URL(url);
    return {
        hash: parsedURL.hash,
        hostname: parsedURL.hostname,
        href: parsedURL.href,
        pathname: parsedURL.pathname,
        port: parsedURL.port,
        protocol: parsedURL.protocol,
        query: (0, _querystring.searchParamsToUrlQuery)(parsedURL.searchParams),
        search: parsedURL.search
    };
} //# sourceMappingURL=parse-url.js.map


/***/ }),

/***/ 4016:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getPathMatch", ({
    enumerable: true,
    get: function() {
        return getPathMatch;
    }
}));
const _pathtoregexp = __webpack_require__(2982);
function getPathMatch(path, options) {
    const keys = [];
    const regexp = (0, _pathtoregexp.pathToRegexp)(path, keys, {
        delimiter: "/",
        sensitive: typeof (options == null ? void 0 : options.sensitive) === "boolean" ? options.sensitive : false,
        strict: options == null ? void 0 : options.strict
    });
    const matcher = (0, _pathtoregexp.regexpToFunction)((options == null ? void 0 : options.regexModifier) ? new RegExp(options.regexModifier(regexp.source), regexp.flags) : regexp, keys);
    /**
   * A matcher function that will check if a given pathname matches the path
   * given in the builder function. When the path does not match it will return
   * `false` but if it does it will return an object with the matched params
   * merged with the params provided in the second argument.
   */ return (pathname, params)=>{
        // If no pathname is provided it's not a match.
        if (typeof pathname !== "string") return false;
        const match = matcher(pathname);
        // If the path did not match `false` will be returned.
        if (!match) return false;
        /**
     * If unnamed params are not allowed they must be removed from
     * the matched parameters. path-to-regexp uses "string" for named and
     * "number" for unnamed parameters.
     */ if (options == null ? void 0 : options.removeUnnamedParams) {
            for (const key of keys){
                if (typeof key.name === "number") {
                    delete match.params[key.name];
                }
            }
        }
        return {
            ...params,
            ...match.params
        };
    };
} //# sourceMappingURL=path-match.js.map


/***/ }),

/***/ 3682:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    matchHas: function() {
        return matchHas;
    },
    compileNonPath: function() {
        return compileNonPath;
    },
    prepareDestination: function() {
        return prepareDestination;
    }
});
const _pathtoregexp = __webpack_require__(2982);
const _escaperegexp = __webpack_require__(9405);
const _parseurl = __webpack_require__(7037);
const _interceptionroutes = __webpack_require__(6098);
const _approuterheaders = __webpack_require__(3093);
const _getcookieparser = __webpack_require__(994);
/**
 * Ensure only a-zA-Z are used for param names for proper interpolating
 * with path-to-regexp
 */ function getSafeParamName(paramName) {
    let newParamName = "";
    for(let i = 0; i < paramName.length; i++){
        const charCode = paramName.charCodeAt(i);
        if (charCode > 64 && charCode < 91 || // A-Z
        charCode > 96 && charCode < 123 // a-z
        ) {
            newParamName += paramName[i];
        }
    }
    return newParamName;
}
function escapeSegment(str, segmentName) {
    return str.replace(new RegExp(":" + (0, _escaperegexp.escapeStringRegexp)(segmentName), "g"), "__ESC_COLON_" + segmentName);
}
function unescapeSegments(str) {
    return str.replace(/__ESC_COLON_/gi, ":");
}
function matchHas(req, query, has, missing) {
    if (has === void 0) has = [];
    if (missing === void 0) missing = [];
    const params = {};
    const hasMatch = (hasItem)=>{
        let value;
        let key = hasItem.key;
        switch(hasItem.type){
            case "header":
                {
                    key = key.toLowerCase();
                    value = req.headers[key];
                    break;
                }
            case "cookie":
                {
                    if ("cookies" in req) {
                        value = req.cookies[hasItem.key];
                    } else {
                        const cookies = (0, _getcookieparser.getCookieParser)(req.headers)();
                        value = cookies[hasItem.key];
                    }
                    break;
                }
            case "query":
                {
                    value = query[key];
                    break;
                }
            case "host":
                {
                    const { host } = (req == null ? void 0 : req.headers) || {};
                    // remove port from host if present
                    const hostname = host == null ? void 0 : host.split(":")[0].toLowerCase();
                    value = hostname;
                    break;
                }
            default:
                {
                    break;
                }
        }
        if (!hasItem.value && value) {
            params[getSafeParamName(key)] = value;
            return true;
        } else if (value) {
            const matcher = new RegExp("^" + hasItem.value + "$");
            const matches = Array.isArray(value) ? value.slice(-1)[0].match(matcher) : value.match(matcher);
            if (matches) {
                if (Array.isArray(matches)) {
                    if (matches.groups) {
                        Object.keys(matches.groups).forEach((groupKey)=>{
                            params[groupKey] = matches.groups[groupKey];
                        });
                    } else if (hasItem.type === "host" && matches[0]) {
                        params.host = matches[0];
                    }
                }
                return true;
            }
        }
        return false;
    };
    const allMatch = has.every((item)=>hasMatch(item)) && !missing.some((item)=>hasMatch(item));
    if (allMatch) {
        return params;
    }
    return false;
}
function compileNonPath(value, params) {
    if (!value.includes(":")) {
        return value;
    }
    for (const key of Object.keys(params)){
        if (value.includes(":" + key)) {
            value = value.replace(new RegExp(":" + key + "\\*", "g"), ":" + key + "--ESCAPED_PARAM_ASTERISKS").replace(new RegExp(":" + key + "\\?", "g"), ":" + key + "--ESCAPED_PARAM_QUESTION").replace(new RegExp(":" + key + "\\+", "g"), ":" + key + "--ESCAPED_PARAM_PLUS").replace(new RegExp(":" + key + "(?!\\w)", "g"), "--ESCAPED_PARAM_COLON" + key);
        }
    }
    value = value.replace(/(:|\*|\?|\+|\(|\)|\{|\})/g, "\\$1").replace(/--ESCAPED_PARAM_PLUS/g, "+").replace(/--ESCAPED_PARAM_COLON/g, ":").replace(/--ESCAPED_PARAM_QUESTION/g, "?").replace(/--ESCAPED_PARAM_ASTERISKS/g, "*");
    // the value needs to start with a forward-slash to be compiled
    // correctly
    return (0, _pathtoregexp.compile)("/" + value, {
        validate: false
    })(params).slice(1);
}
function prepareDestination(args) {
    const query = Object.assign({}, args.query);
    delete query.__nextLocale;
    delete query.__nextDefaultLocale;
    delete query.__nextDataReq;
    delete query.__nextInferredLocaleFromDefault;
    delete query[_approuterheaders.NEXT_RSC_UNION_QUERY];
    let escapedDestination = args.destination;
    for (const param of Object.keys({
        ...args.params,
        ...query
    })){
        escapedDestination = escapeSegment(escapedDestination, param);
    }
    const parsedDestination = (0, _parseurl.parseUrl)(escapedDestination);
    const destQuery = parsedDestination.query;
    const destPath = unescapeSegments("" + parsedDestination.pathname + (parsedDestination.hash || ""));
    const destHostname = unescapeSegments(parsedDestination.hostname || "");
    const destPathParamKeys = [];
    const destHostnameParamKeys = [];
    (0, _pathtoregexp.pathToRegexp)(destPath, destPathParamKeys);
    (0, _pathtoregexp.pathToRegexp)(destHostname, destHostnameParamKeys);
    const destParams = [];
    destPathParamKeys.forEach((key)=>destParams.push(key.name));
    destHostnameParamKeys.forEach((key)=>destParams.push(key.name));
    const destPathCompiler = (0, _pathtoregexp.compile)(destPath, // have already validated before we got to this point and validating
    // breaks compiling destinations with named pattern params from the source
    // e.g. /something:hello(.*) -> /another/:hello is broken with validation
    // since compile validation is meant for reversing and not for inserting
    // params from a separate path-regex into another
    {
        validate: false
    });
    const destHostnameCompiler = (0, _pathtoregexp.compile)(destHostname, {
        validate: false
    });
    // update any params in query values
    for (const [key, strOrArray] of Object.entries(destQuery)){
        // the value needs to start with a forward-slash to be compiled
        // correctly
        if (Array.isArray(strOrArray)) {
            destQuery[key] = strOrArray.map((value)=>compileNonPath(unescapeSegments(value), args.params));
        } else if (typeof strOrArray === "string") {
            destQuery[key] = compileNonPath(unescapeSegments(strOrArray), args.params);
        }
    }
    // add path params to query if it's not a redirect and not
    // already defined in destination query or path
    let paramKeys = Object.keys(args.params).filter((name)=>name !== "nextInternalLocale");
    if (args.appendParamsToQuery && !paramKeys.some((key)=>destParams.includes(key))) {
        for (const key of paramKeys){
            if (!(key in destQuery)) {
                destQuery[key] = args.params[key];
            }
        }
    }
    let newUrl;
    // The compiler also that the interception route marker is an unnamed param, hence '0',
    // so we need to add it to the params object.
    if ((0, _interceptionroutes.isInterceptionRouteAppPath)(destPath)) {
        for (const segment of destPath.split("/")){
            const marker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
            if (marker) {
                args.params["0"] = marker;
                break;
            }
        }
    }
    try {
        newUrl = destPathCompiler(args.params);
        const [pathname, hash] = newUrl.split("#");
        parsedDestination.hostname = destHostnameCompiler(args.params);
        parsedDestination.pathname = pathname;
        parsedDestination.hash = "" + (hash ? "#" : "") + (hash || "");
        delete parsedDestination.search;
    } catch (err) {
        if (err.message.match(/Expected .*? to not repeat, but got an array/)) {
            throw new Error("To use a multi-match in the destination you must add `*` at the end of the param name to signify it should repeat. https://nextjs.org/docs/messages/invalid-multi-match");
        }
        throw err;
    }
    // Query merge order lowest priority to highest
    // 1. initial URL query values
    // 2. path segment values
    // 3. destination specified query values
    parsedDestination.query = {
        ...query,
        ...parsedDestination.query
    };
    return {
        newUrl,
        destQuery,
        parsedDestination
    };
} //# sourceMappingURL=prepare-destination.js.map


/***/ }),

/***/ 5588:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    },
    assign: function() {
        return assign;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    searchParams.forEach((value, key)=>{
        if (typeof query[key] === "undefined") {
            query[key] = value;
        } else if (Array.isArray(query[key])) {
            query[key].push(value);
        } else {
            query[key] = [
                query[key],
                value
            ];
        }
    });
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === "string" || typeof param === "number" && !isNaN(param) || typeof param === "boolean") {
        return String(param);
    } else {
        return "";
    }
}
function urlQueryToSearchParams(urlQuery) {
    const result = new URLSearchParams();
    Object.entries(urlQuery).forEach((param)=>{
        let [key, value] = param;
        if (Array.isArray(value)) {
            value.forEach((item)=>result.append(key, stringifyUrlQueryParam(item)));
        } else {
            result.set(key, stringifyUrlQueryParam(value));
        }
    });
    return result;
}
function assign(target) {
    for(var _len = arguments.length, searchParamsList = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        searchParamsList[_key - 1] = arguments[_key];
    }
    searchParamsList.forEach((searchParams)=>{
        Array.from(searchParams.keys()).forEach((key)=>target.delete(key));
        searchParams.forEach((value, key)=>target.append(key, value));
    });
    return target;
} //# sourceMappingURL=querystring.js.map


/***/ }),

/***/ 2664:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * Removes the trailing slash for a given route or page path. Preserves the
 * root page. Examples:
 *   - `/foo/bar/` -> `/foo/bar`
 *   - `/foo/bar` -> `/foo/bar`
 *   - `/` -> `/`
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "removeTrailingSlash", ({
    enumerable: true,
    get: function() {
        return removeTrailingSlash;
    }
}));
function removeTrailingSlash(route) {
    return route.replace(/\/$/, "") || "/";
} //# sourceMappingURL=remove-trailing-slash.js.map


/***/ }),

/***/ 4727:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getRouteMatcher", ({
    enumerable: true,
    get: function() {
        return getRouteMatcher;
    }
}));
const _utils = __webpack_require__(2261);
function getRouteMatcher(param) {
    let { re, groups } = param;
    return (pathname)=>{
        const routeMatch = re.exec(pathname);
        if (!routeMatch) {
            return false;
        }
        const decode = (param)=>{
            try {
                return decodeURIComponent(param);
            } catch (_) {
                throw new _utils.DecodeError("failed to decode param");
            }
        };
        const params = {};
        Object.keys(groups).forEach((slugName)=>{
            const g = groups[slugName];
            const m = routeMatch[g.pos];
            if (m !== undefined) {
                params[slugName] = ~m.indexOf("/") ? m.split("/").map((entry)=>decode(entry)) : g.repeat ? [
                    decode(m)
                ] : decode(m);
            }
        });
        return params;
    };
} //# sourceMappingURL=route-matcher.js.map


/***/ }),

/***/ 6136:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getRouteRegex: function() {
        return getRouteRegex;
    },
    getNamedRouteRegex: function() {
        return getNamedRouteRegex;
    },
    getNamedMiddlewareRegex: function() {
        return getNamedMiddlewareRegex;
    }
});
const _interceptionroutes = __webpack_require__(6098);
const _escaperegexp = __webpack_require__(9405);
const _removetrailingslash = __webpack_require__(2664);
const NEXT_QUERY_PARAM_PREFIX = "nxtP";
const NEXT_INTERCEPTION_MARKER_PREFIX = "nxtI";
/**
 * Parses a given parameter from a route to a data structure that can be used
 * to generate the parametrized route. Examples:
 *   - `[...slug]` -> `{ key: 'slug', repeat: true, optional: true }`
 *   - `...slug` -> `{ key: 'slug', repeat: true, optional: false }`
 *   - `[foo]` -> `{ key: 'foo', repeat: false, optional: true }`
 *   - `bar` -> `{ key: 'bar', repeat: false, optional: false }`
 */ function parseParameter(param) {
    const optional = param.startsWith("[") && param.endsWith("]");
    if (optional) {
        param = param.slice(1, -1);
    }
    const repeat = param.startsWith("...");
    if (repeat) {
        param = param.slice(3);
    }
    return {
        key: param,
        repeat,
        optional
    };
}
function getParametrizedRoute(route) {
    const segments = (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split("/");
    const groups = {};
    let groupIndex = 1;
    return {
        parameterizedRoute: segments.map((segment)=>{
            const markerMatch = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
            const paramMatches = segment.match(/\[((?:\[.*\])|.+)\]/) // Check for parameters
            ;
            if (markerMatch && paramMatches) {
                const { key, optional, repeat } = parseParameter(paramMatches[1]);
                groups[key] = {
                    pos: groupIndex++,
                    repeat,
                    optional
                };
                return "/" + (0, _escaperegexp.escapeStringRegexp)(markerMatch) + "([^/]+?)";
            } else if (paramMatches) {
                const { key, repeat, optional } = parseParameter(paramMatches[1]);
                groups[key] = {
                    pos: groupIndex++,
                    repeat,
                    optional
                };
                return repeat ? optional ? "(?:/(.+?))?" : "/(.+?)" : "/([^/]+?)";
            } else {
                return "/" + (0, _escaperegexp.escapeStringRegexp)(segment);
            }
        }).join(""),
        groups
    };
}
function getRouteRegex(normalizedRoute) {
    const { parameterizedRoute, groups } = getParametrizedRoute(normalizedRoute);
    return {
        re: new RegExp("^" + parameterizedRoute + "(?:/)?$"),
        groups: groups
    };
}
/**
 * Builds a function to generate a minimal routeKey using only a-z and minimal
 * number of characters.
 */ function buildGetSafeRouteKey() {
    let i = 0;
    return ()=>{
        let routeKey = "";
        let j = ++i;
        while(j > 0){
            routeKey += String.fromCharCode(97 + (j - 1) % 26);
            j = Math.floor((j - 1) / 26);
        }
        return routeKey;
    };
}
function getSafeKeyFromSegment(param) {
    let { getSafeRouteKey, segment, routeKeys, keyPrefix } = param;
    const { key, optional, repeat } = parseParameter(segment);
    // replace any non-word characters since they can break
    // the named regex
    let cleanedKey = key.replace(/\W/g, "");
    if (keyPrefix) {
        cleanedKey = "" + keyPrefix + cleanedKey;
    }
    let invalidKey = false;
    // check if the key is still invalid and fallback to using a known
    // safe key
    if (cleanedKey.length === 0 || cleanedKey.length > 30) {
        invalidKey = true;
    }
    if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
        invalidKey = true;
    }
    if (invalidKey) {
        cleanedKey = getSafeRouteKey();
    }
    if (keyPrefix) {
        routeKeys[cleanedKey] = "" + keyPrefix + key;
    } else {
        routeKeys[cleanedKey] = "" + key;
    }
    return repeat ? optional ? "(?:/(?<" + cleanedKey + ">.+?))?" : "/(?<" + cleanedKey + ">.+?)" : "/(?<" + cleanedKey + ">[^/]+?)";
}
function getNamedParametrizedRoute(route, prefixRouteKeys) {
    const segments = (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split("/");
    const getSafeRouteKey = buildGetSafeRouteKey();
    const routeKeys = {};
    return {
        namedParameterizedRoute: segments.map((segment)=>{
            const hasInterceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m)=>segment.startsWith(m));
            const paramMatches = segment.match(/\[((?:\[.*\])|.+)\]/) // Check for parameters
            ;
            if (hasInterceptionMarker && paramMatches) {
                return getSafeKeyFromSegment({
                    getSafeRouteKey,
                    segment: paramMatches[1],
                    routeKeys,
                    keyPrefix: prefixRouteKeys ? NEXT_INTERCEPTION_MARKER_PREFIX : undefined
                });
            } else if (paramMatches) {
                return getSafeKeyFromSegment({
                    getSafeRouteKey,
                    segment: paramMatches[1],
                    routeKeys,
                    keyPrefix: prefixRouteKeys ? NEXT_QUERY_PARAM_PREFIX : undefined
                });
            } else {
                return "/" + (0, _escaperegexp.escapeStringRegexp)(segment);
            }
        }).join(""),
        routeKeys
    };
}
function getNamedRouteRegex(normalizedRoute, prefixRouteKey) {
    const result = getNamedParametrizedRoute(normalizedRoute, prefixRouteKey);
    return {
        ...getRouteRegex(normalizedRoute),
        namedRegex: "^" + result.namedParameterizedRoute + "(?:/)?$",
        routeKeys: result.routeKeys
    };
}
function getNamedMiddlewareRegex(normalizedRoute, options) {
    const { parameterizedRoute } = getParametrizedRoute(normalizedRoute);
    const { catchAll = true } = options;
    if (parameterizedRoute === "/") {
        let catchAllRegex = catchAll ? ".*" : "";
        return {
            namedRegex: "^/" + catchAllRegex + "$"
        };
    }
    const { namedParameterizedRoute } = getNamedParametrizedRoute(normalizedRoute, false);
    let catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
    return {
        namedRegex: "^" + namedParameterizedRoute + catchAllGroupedRegex + "$"
    };
} //# sourceMappingURL=route-regex.js.map


/***/ }),

/***/ 3391:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "isGroupSegment", ({
    enumerable: true,
    get: function() {
        return isGroupSegment;
    }
}));
function isGroupSegment(segment) {
    // Use array[0] for performant purpose
    return segment[0] === "(" && segment.endsWith(")");
} //# sourceMappingURL=segment.js.map


/***/ }),

/***/ 2261:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    isResSent: function() {
        return isResSent;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    DecodeError: function() {
        return DecodeError;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    "CLS",
    "FCP",
    "FID",
    "INP",
    "LCP",
    "TTFB"
];
function execOnce(fn) {
    let used = false;
    let result;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port ? ":" + port : "");
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === "string" ? Component : Component.displayName || Component.name || "Unknown";
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split("?");
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, "/").replace(/\/\/+/g, "/") + (urlParts[1] ? "?" + urlParts.slice(1).join("?") : "");
}
async function loadGetInitialProps(App, ctx) {
    if (false) { var _App_prototype; }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = '"' + getDisplayName(App) + '.getInitialProps()" should resolve to an object. But found "' + props + '" instead.';
        throw new Error(message);
    }
    if (false) {}
    return props;
}
const SP = typeof performance !== "undefined";
const ST = SP && [
    "mark",
    "measure",
    "getEntriesByName"
].every((method)=>typeof performance[method] === "function");
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = "ENOENT";
        this.name = "PageNotFoundError";
        this.message = "Cannot find module for page: " + page;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = "Failed to load static file for page: " + page + " " + message;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = "ENOENT";
        this.message = "Cannot find the middleware module";
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
} //# sourceMappingURL=utils.js.map


/***/ }),

/***/ 2999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(316).vendored.contexts.AmpContext;

//# sourceMappingURL=amp-context.js.map

/***/ }),

/***/ 5851:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(316).vendored.contexts.HeadManagerContext;

//# sourceMappingURL=head-manager-context.js.map

/***/ }),

/***/ 7927:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(316).vendored.contexts.ImageConfigContext;

//# sourceMappingURL=image-config-context.js.map

/***/ }),

/***/ 713:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(316).vendored.contexts.RouterContext;

//# sourceMappingURL=router-context.js.map

/***/ }),

/***/ 80:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(316).vendored["react-shared"].ReactJsxRuntime;

//# sourceMappingURL=react-jsx-runtime.js.map

/***/ }),

/***/ 2451:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(8514)


/***/ }),

/***/ 4334:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(6066);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 5601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(4334)();
}


/***/ }),

/***/ 6066:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 4622:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

!function(e,t){ true?t(exports,__webpack_require__(9885),__webpack_require__(5601)):0}(this,(function(e,t,n){"use strict";function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var o=r(t),i=r(n);function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function s(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,o,i=[],a=!0,c=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(e){c=!0,o=e}finally{try{a||null==n.return||n.return()}finally{if(c)throw o}}return i}(e,t)||p(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e){return function(e){if(Array.isArray(e))return d(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||p(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){if(e){if("string"==typeof e)return d(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(e,t):void 0}}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function v(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{u(r.next(e))}catch(e){i(e)}}function c(e){try{u(r.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,c)}u((r=r.apply(e,t||[])).next())}))}function m(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}function g(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=i.return)&&n.call(i)}finally{if(o)throw o.error}}return a}function y(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))}var b=new Map([["aac","audio/aac"],["abw","application/x-abiword"],["arc","application/x-freearc"],["avif","image/avif"],["avi","video/x-msvideo"],["azw","application/vnd.amazon.ebook"],["bin","application/octet-stream"],["bmp","image/bmp"],["bz","application/x-bzip"],["bz2","application/x-bzip2"],["cda","application/x-cdf"],["csh","application/x-csh"],["css","text/css"],["csv","text/csv"],["doc","application/msword"],["docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],["eot","application/vnd.ms-fontobject"],["epub","application/epub+zip"],["gz","application/gzip"],["gif","image/gif"],["heic","image/heic"],["heif","image/heif"],["htm","text/html"],["html","text/html"],["ico","image/vnd.microsoft.icon"],["ics","text/calendar"],["jar","application/java-archive"],["jpeg","image/jpeg"],["jpg","image/jpeg"],["js","text/javascript"],["json","application/json"],["jsonld","application/ld+json"],["mid","audio/midi"],["midi","audio/midi"],["mjs","text/javascript"],["mp3","audio/mpeg"],["mp4","video/mp4"],["mpeg","video/mpeg"],["mpkg","application/vnd.apple.installer+xml"],["odp","application/vnd.oasis.opendocument.presentation"],["ods","application/vnd.oasis.opendocument.spreadsheet"],["odt","application/vnd.oasis.opendocument.text"],["oga","audio/ogg"],["ogv","video/ogg"],["ogx","application/ogg"],["opus","audio/opus"],["otf","font/otf"],["png","image/png"],["pdf","application/pdf"],["php","application/x-httpd-php"],["ppt","application/vnd.ms-powerpoint"],["pptx","application/vnd.openxmlformats-officedocument.presentationml.presentation"],["rar","application/vnd.rar"],["rtf","application/rtf"],["sh","application/x-sh"],["svg","image/svg+xml"],["swf","application/x-shockwave-flash"],["tar","application/x-tar"],["tif","image/tiff"],["tiff","image/tiff"],["ts","video/mp2t"],["ttf","font/ttf"],["txt","text/plain"],["vsd","application/vnd.visio"],["wav","audio/wav"],["weba","audio/webm"],["webm","video/webm"],["webp","image/webp"],["woff","font/woff"],["woff2","font/woff2"],["xhtml","application/xhtml+xml"],["xls","application/vnd.ms-excel"],["xlsx","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],["xml","application/xml"],["xul","application/vnd.mozilla.xul+xml"],["zip","application/zip"],["7z","application/x-7z-compressed"],["mkv","video/x-matroska"],["mov","video/quicktime"],["msg","application/vnd.ms-outlook"]]);function h(e,t){var n=function(e){var t=e.name;if(t&&-1!==t.lastIndexOf(".")&&!e.type){var n=t.split(".").pop().toLowerCase(),r=b.get(n);r&&Object.defineProperty(e,"type",{value:r,writable:!1,configurable:!1,enumerable:!0})}return e}(e);if("string"!=typeof n.path){var r=e.webkitRelativePath;Object.defineProperty(n,"path",{value:"string"==typeof t?t:"string"==typeof r&&r.length>0?r:e.name,writable:!1,configurable:!1,enumerable:!0})}return n}var w=[".DS_Store","Thumbs.db"];function D(e){return"object"==typeof e&&null!==e}function x(e){return O(e.target.files).map((function(e){return h(e)}))}function F(e){return v(this,void 0,void 0,(function(){return m(this,(function(t){switch(t.label){case 0:return[4,Promise.all(e.map((function(e){return e.getFile()})))];case 1:return[2,t.sent().map((function(e){return h(e)}))]}}))}))}function j(e,t){return v(this,void 0,void 0,(function(){var n;return m(this,(function(r){switch(r.label){case 0:return e.items?(n=O(e.items).filter((function(e){return"file"===e.kind})),"drop"!==t?[2,n]:[4,Promise.all(n.map(E))]):[3,2];case 1:return[2,A(k(r.sent()))];case 2:return[2,A(O(e.files).map((function(e){return h(e)})))]}}))}))}function A(e){return e.filter((function(e){return-1===w.indexOf(e.name)}))}function O(e){if(null===e)return[];for(var t=[],n=0;n<e.length;n++){var r=e[n];t.push(r)}return t}function E(e){if("function"!=typeof e.webkitGetAsEntry)return P(e);var t=e.webkitGetAsEntry();return t&&t.isDirectory?C(t):P(e)}function k(e){return e.reduce((function(e,t){return y(y([],g(e),!1),g(Array.isArray(t)?k(t):[t]),!1)}),[])}function P(e){var t=e.getAsFile();if(!t)return Promise.reject("".concat(e," is not a File"));var n=h(t);return Promise.resolve(n)}function S(e){return v(this,void 0,void 0,(function(){return m(this,(function(t){return[2,e.isDirectory?C(e):z(e)]}))}))}function C(e){var t=e.createReader();return new Promise((function(e,n){var r=[];!function o(){var i=this;t.readEntries((function(t){return v(i,void 0,void 0,(function(){var i,a,c;return m(this,(function(u){switch(u.label){case 0:if(t.length)return[3,5];u.label=1;case 1:return u.trys.push([1,3,,4]),[4,Promise.all(r)];case 2:return i=u.sent(),e(i),[3,4];case 3:return a=u.sent(),n(a),[3,4];case 4:return[3,6];case 5:c=Promise.all(t.map(S)),r.push(c),o(),u.label=6;case 6:return[2]}}))}))}),(function(e){n(e)}))}()}))}function z(e){return v(this,void 0,void 0,(function(){return m(this,(function(t){return[2,new Promise((function(t,n){e.file((function(n){var r=h(n,e.fullPath);t(r)}),(function(e){n(e)}))}))]}))}))}var R="file-invalid-type",T="file-too-large",I="file-too-small",M="too-many-files",L={FileInvalidType:R,FileTooLarge:T,FileTooSmall:I,TooManyFiles:M},_=function(e){e=Array.isArray(e)&&1===e.length?e[0]:e;var t=Array.isArray(e)?"one of ".concat(e.join(", ")):e;return{code:R,message:"File type must be ".concat(t)}},B=function(e){return{code:T,message:"File is larger than ".concat(e," ").concat(1===e?"byte":"bytes")}},K=function(e){return{code:I,message:"File is smaller than ".concat(e," ").concat(1===e?"byte":"bytes")}},q={code:M,message:"Too many files"};function U(e,t){var n="application/x-moz-file"===e.type||function(e,t){if(e&&t){var n=Array.isArray(t)?t:t.split(","),r=e.name||"",o=(e.type||"").toLowerCase(),i=o.replace(/\/.*$/,"");return n.some((function(e){var t=e.trim().toLowerCase();return"."===t.charAt(0)?r.toLowerCase().endsWith(t):t.endsWith("/*")?i===t.replace(/\/.*$/,""):o===t}))}return!0}(e,t);return[n,n?null:_(t)]}function W(e,t,n){if($(e.size))if($(t)&&$(n)){if(e.size>n)return[!1,B(n)];if(e.size<t)return[!1,K(t)]}else{if($(t)&&e.size<t)return[!1,K(t)];if($(n)&&e.size>n)return[!1,B(n)]}return[!0,null]}function $(e){return null!=e}function G(e){var t=e.files,n=e.accept,r=e.minSize,o=e.maxSize,i=e.multiple,a=e.maxFiles,c=e.validator;return!(!i&&t.length>1||i&&a>=1&&t.length>a)&&t.every((function(e){var t=s(U(e,n),1)[0],i=s(W(e,r,o),1)[0],a=c?c(e):null;return t&&i&&!a}))}function H(e){return"function"==typeof e.isPropagationStopped?e.isPropagationStopped():void 0!==e.cancelBubble&&e.cancelBubble}function N(e){return e.dataTransfer?Array.prototype.some.call(e.dataTransfer.types,(function(e){return"Files"===e||"application/x-moz-file"===e})):!!e.target&&!!e.target.files}function Y(e){e.preventDefault()}function J(e){return-1!==e.indexOf("MSIE")||-1!==e.indexOf("Trident/")}function Q(e){return-1!==e.indexOf("Edge/")}function V(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.navigator.userAgent;return J(e)||Q(e)}function X(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return t.some((function(t){return!H(e)&&t&&t.apply(void 0,[e].concat(r)),H(e)}))}}function Z(){return"showOpenFilePicker"in window}function ee(e){return $(e)?[{description:"Files",accept:Object.entries(e).filter((function(e){var t=s(e,2),n=t[0],r=t[1],o=!0;return oe(n)||(console.warn('Skipped "'.concat(n,'" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')),o=!1),Array.isArray(r)&&r.every(ie)||(console.warn('Skipped "'.concat(n,'" because an invalid file extension was provided.')),o=!1),o})).reduce((function(e,t){var n=s(t,2),r=n[0],o=n[1];return c(c({},e),{},u({},r,o))}),{})}]:e}function te(e){if($(e))return Object.entries(e).reduce((function(e,t){var n=s(t,2),r=n[0],o=n[1];return[].concat(f(e),[r],f(o))}),[]).filter((function(e){return oe(e)||ie(e)})).join(",")}function ne(e){return e instanceof DOMException&&("AbortError"===e.name||e.code===e.ABORT_ERR)}function re(e){return e instanceof DOMException&&("SecurityError"===e.name||e.code===e.SECURITY_ERR)}function oe(e){return"audio/*"===e||"video/*"===e||"image/*"===e||"text/*"===e||/\w+\/[-+.\w]+/g.test(e)}function ie(e){return/^.*\.[\w]+$/.test(e)}var ae=["children"],ce=["open"],ue=["refKey","role","onKeyDown","onFocus","onBlur","onClick","onDragEnter","onDragOver","onDragLeave","onDrop"],le=["refKey","onChange","onClick"],se=t.forwardRef((function(e,n){var r=e.children,i=de(l(e,ae)),a=i.open,u=l(i,ce);return t.useImperativeHandle(n,(function(){return{open:a}}),[a]),o.default.createElement(t.Fragment,null,r(c(c({},u),{},{open:a})))}));se.displayName="Dropzone";var fe={disabled:!1,getFilesFromEvent:function(e){return v(this,void 0,void 0,(function(){return m(this,(function(t){return D(e)&&D(e.dataTransfer)?[2,j(e.dataTransfer,e.type)]:function(e){return D(e)&&D(e.target)}(e)?[2,x(e)]:Array.isArray(e)&&e.every((function(e){return"getFile"in e&&"function"==typeof e.getFile}))?[2,F(e)]:[2,[]]}))}))},maxSize:1/0,minSize:0,multiple:!0,maxFiles:0,preventDropOnDocument:!0,noClick:!1,noKeyboard:!1,noDrag:!1,noDragEventsBubbling:!1,validator:null,useFsAccessApi:!0,autoFocus:!1};se.defaultProps=fe,se.propTypes={children:i.default.func,accept:i.default.objectOf(i.default.arrayOf(i.default.string)),multiple:i.default.bool,preventDropOnDocument:i.default.bool,noClick:i.default.bool,noKeyboard:i.default.bool,noDrag:i.default.bool,noDragEventsBubbling:i.default.bool,minSize:i.default.number,maxSize:i.default.number,maxFiles:i.default.number,disabled:i.default.bool,getFilesFromEvent:i.default.func,onFileDialogCancel:i.default.func,onFileDialogOpen:i.default.func,useFsAccessApi:i.default.bool,autoFocus:i.default.bool,onDragEnter:i.default.func,onDragLeave:i.default.func,onDragOver:i.default.func,onDrop:i.default.func,onDropAccepted:i.default.func,onDropRejected:i.default.func,onError:i.default.func,validator:i.default.func};var pe={isFocused:!1,isFileDialogActive:!1,isDragActive:!1,isDragAccept:!1,isDragReject:!1,acceptedFiles:[],fileRejections:[]};function de(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=c(c({},fe),e),r=n.accept,o=n.disabled,i=n.getFilesFromEvent,a=n.maxSize,p=n.minSize,d=n.multiple,v=n.maxFiles,m=n.onDragEnter,g=n.onDragLeave,y=n.onDragOver,b=n.onDrop,h=n.onDropAccepted,w=n.onDropRejected,D=n.onFileDialogCancel,x=n.onFileDialogOpen,F=n.useFsAccessApi,j=n.autoFocus,A=n.preventDropOnDocument,O=n.noClick,E=n.noKeyboard,k=n.noDrag,P=n.noDragEventsBubbling,S=n.onError,C=n.validator,z=t.useMemo((function(){return te(r)}),[r]),R=t.useMemo((function(){return ee(r)}),[r]),T=t.useMemo((function(){return"function"==typeof x?x:me}),[x]),I=t.useMemo((function(){return"function"==typeof D?D:me}),[D]),M=t.useRef(null),L=t.useRef(null),_=t.useReducer(ve,pe),B=s(_,2),K=B[0],$=B[1],J=K.isFocused,Q=K.isFileDialogActive,oe=t.useRef("undefined"!=typeof window&&window.isSecureContext&&F&&Z()),ie=function(){!oe.current&&Q&&setTimeout((function(){L.current&&(L.current.files.length||($({type:"closeDialog"}),I()))}),300)};t.useEffect((function(){return window.addEventListener("focus",ie,!1),function(){window.removeEventListener("focus",ie,!1)}}),[L,Q,I,oe]);var ae=t.useRef([]),ce=function(e){M.current&&M.current.contains(e.target)||(e.preventDefault(),ae.current=[])};t.useEffect((function(){return A&&(document.addEventListener("dragover",Y,!1),document.addEventListener("drop",ce,!1)),function(){A&&(document.removeEventListener("dragover",Y),document.removeEventListener("drop",ce))}}),[M,A]),t.useEffect((function(){return!o&&j&&M.current&&M.current.focus(),function(){}}),[M,j,o]);var se=t.useCallback((function(e){S?S(e):console.error(e)}),[S]),de=t.useCallback((function(e){e.preventDefault(),e.persist(),ke(e),ae.current=[].concat(f(ae.current),[e.target]),N(e)&&Promise.resolve(i(e)).then((function(t){if(!H(e)||P){var n=t.length,r=n>0&&G({files:t,accept:z,minSize:p,maxSize:a,multiple:d,maxFiles:v,validator:C});$({isDragAccept:r,isDragReject:n>0&&!r,isDragActive:!0,type:"setDraggedFiles"}),m&&m(e)}})).catch((function(e){return se(e)}))}),[i,m,se,P,z,p,a,d,v,C]),ge=t.useCallback((function(e){e.preventDefault(),e.persist(),ke(e);var t=N(e);if(t&&e.dataTransfer)try{e.dataTransfer.dropEffect="copy"}catch(e){}return t&&y&&y(e),!1}),[y,P]),ye=t.useCallback((function(e){e.preventDefault(),e.persist(),ke(e);var t=ae.current.filter((function(e){return M.current&&M.current.contains(e)})),n=t.indexOf(e.target);-1!==n&&t.splice(n,1),ae.current=t,t.length>0||($({type:"setDraggedFiles",isDragActive:!1,isDragAccept:!1,isDragReject:!1}),N(e)&&g&&g(e))}),[M,g,P]),be=t.useCallback((function(e,t){var n=[],r=[];e.forEach((function(e){var t=s(U(e,z),2),o=t[0],i=t[1],c=s(W(e,p,a),2),u=c[0],l=c[1],f=C?C(e):null;if(o&&u&&!f)n.push(e);else{var d=[i,l];f&&(d=d.concat(f)),r.push({file:e,errors:d.filter((function(e){return e}))})}})),(!d&&n.length>1||d&&v>=1&&n.length>v)&&(n.forEach((function(e){r.push({file:e,errors:[q]})})),n.splice(0)),$({acceptedFiles:n,fileRejections:r,type:"setFiles"}),b&&b(n,r,t),r.length>0&&w&&w(r,t),n.length>0&&h&&h(n,t)}),[$,d,z,p,a,v,b,h,w,C]),he=t.useCallback((function(e){e.preventDefault(),e.persist(),ke(e),ae.current=[],N(e)&&Promise.resolve(i(e)).then((function(t){H(e)&&!P||be(t,e)})).catch((function(e){return se(e)})),$({type:"reset"})}),[i,be,se,P]),we=t.useCallback((function(){if(oe.current){$({type:"openDialog"}),T();var e={multiple:d,types:R};window.showOpenFilePicker(e).then((function(e){return i(e)})).then((function(e){be(e,null),$({type:"closeDialog"})})).catch((function(e){ne(e)?(I(e),$({type:"closeDialog"})):re(e)?(oe.current=!1,L.current?(L.current.value=null,L.current.click()):se(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))):se(e)}))}else L.current&&($({type:"openDialog"}),T(),L.current.value=null,L.current.click())}),[$,T,I,F,be,se,R,d]),De=t.useCallback((function(e){M.current&&M.current.isEqualNode(e.target)&&(" "!==e.key&&"Enter"!==e.key&&32!==e.keyCode&&13!==e.keyCode||(e.preventDefault(),we()))}),[M,we]),xe=t.useCallback((function(){$({type:"focus"})}),[]),Fe=t.useCallback((function(){$({type:"blur"})}),[]),je=t.useCallback((function(){O||(V()?setTimeout(we,0):we())}),[O,we]),Ae=function(e){return o?null:e},Oe=function(e){return E?null:Ae(e)},Ee=function(e){return k?null:Ae(e)},ke=function(e){P&&e.stopPropagation()},Pe=t.useMemo((function(){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.refKey,n=void 0===t?"ref":t,r=e.role,i=e.onKeyDown,a=e.onFocus,s=e.onBlur,f=e.onClick,p=e.onDragEnter,d=e.onDragOver,v=e.onDragLeave,m=e.onDrop,g=l(e,ue);return c(c(u({onKeyDown:Oe(X(i,De)),onFocus:Oe(X(a,xe)),onBlur:Oe(X(s,Fe)),onClick:Ae(X(f,je)),onDragEnter:Ee(X(p,de)),onDragOver:Ee(X(d,ge)),onDragLeave:Ee(X(v,ye)),onDrop:Ee(X(m,he)),role:"string"==typeof r&&""!==r?r:"presentation"},n,M),o||E?{}:{tabIndex:0}),g)}}),[M,De,xe,Fe,je,de,ge,ye,he,E,k,o]),Se=t.useCallback((function(e){e.stopPropagation()}),[]),Ce=t.useMemo((function(){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.refKey,n=void 0===t?"ref":t,r=e.onChange,o=e.onClick,i=l(e,le),a=u({accept:z,multiple:d,type:"file",style:{display:"none"},onChange:Ae(X(r,he)),onClick:Ae(X(o,Se)),tabIndex:-1},n,L);return c(c({},a),i)}}),[L,r,d,he,o]);return c(c({},K),{},{isFocused:J&&!o,getRootProps:Pe,getInputProps:Ce,rootRef:M,inputRef:L,open:Ae(we)})}function ve(e,t){switch(t.type){case"focus":return c(c({},e),{},{isFocused:!0});case"blur":return c(c({},e),{},{isFocused:!1});case"openDialog":return c(c({},pe),{},{isFileDialogActive:!0});case"closeDialog":return c(c({},e),{},{isFileDialogActive:!1});case"setDraggedFiles":return c(c({},e),{},{isDragActive:t.isDragActive,isDragAccept:t.isDragAccept,isDragReject:t.isDragReject});case"setFiles":return c(c({},e),{},{acceptedFiles:t.acceptedFiles,fileRejections:t.fileRejections});case"reset":return c({},pe);default:return e}}function me(){}e.ErrorCode=L,e.default=se,e.useDropzone=de,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9maWxlLXNlbGVjdG9yL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi9ub2RlX21vZHVsZXMvZmlsZS1zZWxlY3Rvci9kaXN0L2VzNS9maWxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2ZpbGUtc2VsZWN0b3IvZGlzdC9lczUvZmlsZS1zZWxlY3Rvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9hdHRyLWFjY2VwdC9kaXN0L2VzL2luZGV4LmpzIiwiLi4vc3JjL3V0aWxzL2luZGV4LmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcclxuICAgIGlmIChyZWNlaXZlciA9PT0gbnVsbCB8fCAodHlwZW9mIHJlY2VpdmVyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiByZWNlaXZlciAhPT0gXCJmdW5jdGlvblwiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB1c2UgJ2luJyBvcGVyYXRvciBvbiBub24tb2JqZWN0XCIpO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcclxufVxyXG4iLCJleHBvcnQgdmFyIENPTU1PTl9NSU1FX1RZUEVTID0gbmV3IE1hcChbXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9CYXNpY3Nfb2ZfSFRUUC9NSU1FX3R5cGVzL0NvbW1vbl90eXBlc1xuICAgIFsnYWFjJywgJ2F1ZGlvL2FhYyddLFxuICAgIFsnYWJ3JywgJ2FwcGxpY2F0aW9uL3gtYWJpd29yZCddLFxuICAgIFsnYXJjJywgJ2FwcGxpY2F0aW9uL3gtZnJlZWFyYyddLFxuICAgIFsnYXZpZicsICdpbWFnZS9hdmlmJ10sXG4gICAgWydhdmknLCAndmlkZW8veC1tc3ZpZGVvJ10sXG4gICAgWydhencnLCAnYXBwbGljYXRpb24vdm5kLmFtYXpvbi5lYm9vayddLFxuICAgIFsnYmluJywgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSddLFxuICAgIFsnYm1wJywgJ2ltYWdlL2JtcCddLFxuICAgIFsnYnonLCAnYXBwbGljYXRpb24veC1iemlwJ10sXG4gICAgWydiejInLCAnYXBwbGljYXRpb24veC1iemlwMiddLFxuICAgIFsnY2RhJywgJ2FwcGxpY2F0aW9uL3gtY2RmJ10sXG4gICAgWydjc2gnLCAnYXBwbGljYXRpb24veC1jc2gnXSxcbiAgICBbJ2NzcycsICd0ZXh0L2NzcyddLFxuICAgIFsnY3N2JywgJ3RleHQvY3N2J10sXG4gICAgWydkb2MnLCAnYXBwbGljYXRpb24vbXN3b3JkJ10sXG4gICAgWydkb2N4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50J10sXG4gICAgWydlb3QnLCAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnXSxcbiAgICBbJ2VwdWInLCAnYXBwbGljYXRpb24vZXB1Yit6aXAnXSxcbiAgICBbJ2d6JywgJ2FwcGxpY2F0aW9uL2d6aXAnXSxcbiAgICBbJ2dpZicsICdpbWFnZS9naWYnXSxcbiAgICBbJ2hlaWMnLCAnaW1hZ2UvaGVpYyddLFxuICAgIFsnaGVpZicsICdpbWFnZS9oZWlmJ10sXG4gICAgWydodG0nLCAndGV4dC9odG1sJ10sXG4gICAgWydodG1sJywgJ3RleHQvaHRtbCddLFxuICAgIFsnaWNvJywgJ2ltYWdlL3ZuZC5taWNyb3NvZnQuaWNvbiddLFxuICAgIFsnaWNzJywgJ3RleHQvY2FsZW5kYXInXSxcbiAgICBbJ2phcicsICdhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmUnXSxcbiAgICBbJ2pwZWcnLCAnaW1hZ2UvanBlZyddLFxuICAgIFsnanBnJywgJ2ltYWdlL2pwZWcnXSxcbiAgICBbJ2pzJywgJ3RleHQvamF2YXNjcmlwdCddLFxuICAgIFsnanNvbicsICdhcHBsaWNhdGlvbi9qc29uJ10sXG4gICAgWydqc29ubGQnLCAnYXBwbGljYXRpb24vbGQranNvbiddLFxuICAgIFsnbWlkJywgJ2F1ZGlvL21pZGknXSxcbiAgICBbJ21pZGknLCAnYXVkaW8vbWlkaSddLFxuICAgIFsnbWpzJywgJ3RleHQvamF2YXNjcmlwdCddLFxuICAgIFsnbXAzJywgJ2F1ZGlvL21wZWcnXSxcbiAgICBbJ21wNCcsICd2aWRlby9tcDQnXSxcbiAgICBbJ21wZWcnLCAndmlkZW8vbXBlZyddLFxuICAgIFsnbXBrZycsICdhcHBsaWNhdGlvbi92bmQuYXBwbGUuaW5zdGFsbGVyK3htbCddLFxuICAgIFsnb2RwJywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uJ10sXG4gICAgWydvZHMnLCAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldCddLFxuICAgIFsnb2R0JywgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCddLFxuICAgIFsnb2dhJywgJ2F1ZGlvL29nZyddLFxuICAgIFsnb2d2JywgJ3ZpZGVvL29nZyddLFxuICAgIFsnb2d4JywgJ2FwcGxpY2F0aW9uL29nZyddLFxuICAgIFsnb3B1cycsICdhdWRpby9vcHVzJ10sXG4gICAgWydvdGYnLCAnZm9udC9vdGYnXSxcbiAgICBbJ3BuZycsICdpbWFnZS9wbmcnXSxcbiAgICBbJ3BkZicsICdhcHBsaWNhdGlvbi9wZGYnXSxcbiAgICBbJ3BocCcsICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCddLFxuICAgIFsncHB0JywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J10sXG4gICAgWydwcHR4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nXSxcbiAgICBbJ3JhcicsICdhcHBsaWNhdGlvbi92bmQucmFyJ10sXG4gICAgWydydGYnLCAnYXBwbGljYXRpb24vcnRmJ10sXG4gICAgWydzaCcsICdhcHBsaWNhdGlvbi94LXNoJ10sXG4gICAgWydzdmcnLCAnaW1hZ2Uvc3ZnK3htbCddLFxuICAgIFsnc3dmJywgJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ10sXG4gICAgWyd0YXInLCAnYXBwbGljYXRpb24veC10YXInXSxcbiAgICBbJ3RpZicsICdpbWFnZS90aWZmJ10sXG4gICAgWyd0aWZmJywgJ2ltYWdlL3RpZmYnXSxcbiAgICBbJ3RzJywgJ3ZpZGVvL21wMnQnXSxcbiAgICBbJ3R0ZicsICdmb250L3R0ZiddLFxuICAgIFsndHh0JywgJ3RleHQvcGxhaW4nXSxcbiAgICBbJ3ZzZCcsICdhcHBsaWNhdGlvbi92bmQudmlzaW8nXSxcbiAgICBbJ3dhdicsICdhdWRpby93YXYnXSxcbiAgICBbJ3dlYmEnLCAnYXVkaW8vd2VibSddLFxuICAgIFsnd2VibScsICd2aWRlby93ZWJtJ10sXG4gICAgWyd3ZWJwJywgJ2ltYWdlL3dlYnAnXSxcbiAgICBbJ3dvZmYnLCAnZm9udC93b2ZmJ10sXG4gICAgWyd3b2ZmMicsICdmb250L3dvZmYyJ10sXG4gICAgWyd4aHRtbCcsICdhcHBsaWNhdGlvbi94aHRtbCt4bWwnXSxcbiAgICBbJ3hscycsICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXSxcbiAgICBbJ3hsc3gnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnXSxcbiAgICBbJ3htbCcsICdhcHBsaWNhdGlvbi94bWwnXSxcbiAgICBbJ3h1bCcsICdhcHBsaWNhdGlvbi92bmQubW96aWxsYS54dWwreG1sJ10sXG4gICAgWyd6aXAnLCAnYXBwbGljYXRpb24vemlwJ10sXG4gICAgWyc3eicsICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnXSxcbiAgICAvLyBPdGhlcnNcbiAgICBbJ21rdicsICd2aWRlby94LW1hdHJvc2thJ10sXG4gICAgWydtb3YnLCAndmlkZW8vcXVpY2t0aW1lJ10sXG4gICAgWydtc2cnLCAnYXBwbGljYXRpb24vdm5kLm1zLW91dGxvb2snXVxuXSk7XG5leHBvcnQgZnVuY3Rpb24gdG9GaWxlV2l0aFBhdGgoZmlsZSwgcGF0aCkge1xuICAgIHZhciBmID0gd2l0aE1pbWVUeXBlKGZpbGUpO1xuICAgIGlmICh0eXBlb2YgZi5wYXRoICE9PSAnc3RyaW5nJykgeyAvLyBvbiBlbGVjdHJvbiwgcGF0aCBpcyBhbHJlYWR5IHNldCB0byB0aGUgYWJzb2x1dGUgcGF0aFxuICAgICAgICB2YXIgd2Via2l0UmVsYXRpdmVQYXRoID0gZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGg7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCAncGF0aCcsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IHBhdGhcbiAgICAgICAgICAgICAgICAvLyBJZiA8aW5wdXQgd2Via2l0ZGlyZWN0b3J5PiBpcyBzZXQsXG4gICAgICAgICAgICAgICAgLy8gdGhlIEZpbGUgd2lsbCBoYXZlIGEge3dlYmtpdFJlbGF0aXZlUGF0aH0gcHJvcGVydHlcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTElucHV0RWxlbWVudC93ZWJraXRkaXJlY3RvcnlcbiAgICAgICAgICAgICAgICA6IHR5cGVvZiB3ZWJraXRSZWxhdGl2ZVBhdGggPT09ICdzdHJpbmcnICYmIHdlYmtpdFJlbGF0aXZlUGF0aC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgID8gd2Via2l0UmVsYXRpdmVQYXRoXG4gICAgICAgICAgICAgICAgICAgIDogZmlsZS5uYW1lLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmO1xufVxuZnVuY3Rpb24gd2l0aE1pbWVUeXBlKGZpbGUpIHtcbiAgICB2YXIgbmFtZSA9IGZpbGUubmFtZTtcbiAgICB2YXIgaGFzRXh0ZW5zaW9uID0gbmFtZSAmJiBuYW1lLmxhc3RJbmRleE9mKCcuJykgIT09IC0xO1xuICAgIGlmIChoYXNFeHRlbnNpb24gJiYgIWZpbGUudHlwZSkge1xuICAgICAgICB2YXIgZXh0ID0gbmFtZS5zcGxpdCgnLicpXG4gICAgICAgICAgICAucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdmFyIHR5cGUgPSBDT01NT05fTUlNRV9UWVBFUy5nZXQoZXh0KTtcbiAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlLCAndHlwZScsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogdHlwZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlsZTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbGUuanMubWFwIiwiaW1wb3J0IHsgX19hd2FpdGVyLCBfX2dlbmVyYXRvciwgX19yZWFkLCBfX3NwcmVhZEFycmF5IH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyB0b0ZpbGVXaXRoUGF0aCB9IGZyb20gJy4vZmlsZSc7XG52YXIgRklMRVNfVE9fSUdOT1JFID0gW1xuICAgIC8vIFRodW1ibmFpbCBjYWNoZSBmaWxlcyBmb3IgbWFjT1MgYW5kIFdpbmRvd3NcbiAgICAnLkRTX1N0b3JlJyxcbiAgICAnVGh1bWJzLmRiJyAvLyBXaW5kb3dzXG5dO1xuLyoqXG4gKiBDb252ZXJ0IGEgRHJhZ0V2ZW50J3MgRGF0YVRyYXNmZXIgb2JqZWN0IHRvIGEgbGlzdCBvZiBGaWxlIG9iamVjdHNcbiAqIE5PVEU6IElmIHNvbWUgb2YgdGhlIGl0ZW1zIGFyZSBmb2xkZXJzLFxuICogZXZlcnl0aGluZyB3aWxsIGJlIGZsYXR0ZW5lZCBhbmQgcGxhY2VkIGluIHRoZSBzYW1lIGxpc3QgYnV0IHRoZSBwYXRocyB3aWxsIGJlIGtlcHQgYXMgYSB7cGF0aH0gcHJvcGVydHkuXG4gKlxuICogRVhQRVJJTUVOVEFMOiBBIGxpc3Qgb2YgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1IYW5kbGUgb2JqZWN0cyBjYW4gYWxzbyBiZSBwYXNzZWQgYXMgYW4gYXJnXG4gKiBhbmQgYSBsaXN0IG9mIEZpbGUgb2JqZWN0cyB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSBldnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudChldnQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIGlmIChpc09iamVjdChldnQpICYmIGlzRGF0YVRyYW5zZmVyKGV2dC5kYXRhVHJhbnNmZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGdldERhdGFUcmFuc2ZlckZpbGVzKGV2dC5kYXRhVHJhbnNmZXIsIGV2dC50eXBlKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0NoYW5nZUV2dChldnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGdldElucHV0RmlsZXMoZXZ0KV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGV2dCkgJiYgZXZ0LmV2ZXJ5KGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiAnZ2V0RmlsZScgaW4gaXRlbSAmJiB0eXBlb2YgaXRlbS5nZXRGaWxlID09PSAnZnVuY3Rpb24nOyB9KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBnZXRGc0hhbmRsZUZpbGVzKGV2dCldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFtdXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBpc0RhdGFUcmFuc2Zlcih2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSk7XG59XG5mdW5jdGlvbiBpc0NoYW5nZUV2dCh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgaXNPYmplY3QodmFsdWUudGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KHYpIHtcbiAgICByZXR1cm4gdHlwZW9mIHYgPT09ICdvYmplY3QnICYmIHYgIT09IG51bGw7XG59XG5mdW5jdGlvbiBnZXRJbnB1dEZpbGVzKGV2dCkge1xuICAgIHJldHVybiBmcm9tTGlzdChldnQudGFyZ2V0LmZpbGVzKS5tYXAoZnVuY3Rpb24gKGZpbGUpIHsgcmV0dXJuIHRvRmlsZVdpdGhQYXRoKGZpbGUpOyB9KTtcbn1cbi8vIEVlIGV4cGVjdCBlYWNoIGhhbmRsZSB0byBiZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbUZpbGVIYW5kbGVcbmZ1bmN0aW9uIGdldEZzSGFuZGxlRmlsZXMoaGFuZGxlcykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZpbGVzO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChoYW5kbGVzLm1hcChmdW5jdGlvbiAoaCkgeyByZXR1cm4gaC5nZXRGaWxlKCk7IH0pKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBmaWxlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGZpbGVzLm1hcChmdW5jdGlvbiAoZmlsZSkgeyByZXR1cm4gdG9GaWxlV2l0aFBhdGgoZmlsZSk7IH0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXREYXRhVHJhbnNmZXJGaWxlcyhkdCwgdHlwZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZW1zLCBmaWxlcztcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkdC5pdGVtcykgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gZnJvbUxpc3QoZHQuaXRlbXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLmtpbmQgPT09ICdmaWxlJzsgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFjY29yZGluZyB0byBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9kbmQuaHRtbCNkbmRldmVudHMsXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgJ2RyYWdzdGFydCcgYW5kICdkcm9wJyBoYXMgYWNjZXNzIHRvIHRoZSBkYXRhIChzb3VyY2Ugbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgIT09ICdkcm9wJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGl0ZW1zXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChpdGVtcy5tYXAodG9GaWxlUHJvbWlzZXMpKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBmaWxlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5vSWdub3JlZEZpbGVzKGZsYXR0ZW4oZmlsZXMpKV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIgLypyZXR1cm4qLywgbm9JZ25vcmVkRmlsZXMoZnJvbUxpc3QoZHQuZmlsZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChmaWxlKSB7IHJldHVybiB0b0ZpbGVXaXRoUGF0aChmaWxlKTsgfSkpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBub0lnbm9yZWRGaWxlcyhmaWxlcykge1xuICAgIHJldHVybiBmaWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHsgcmV0dXJuIEZJTEVTX1RPX0lHTk9SRS5pbmRleE9mKGZpbGUubmFtZSkgPT09IC0xOyB9KTtcbn1cbi8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCBBcnJheS5mcm9tKClcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2Zyb20jQnJvd3Nlcl9jb21wYXRpYmlsaXR5XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZUxpc3Rcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EYXRhVHJhbnNmZXJJdGVtTGlzdFxuZnVuY3Rpb24gZnJvbUxpc3QoaXRlbXMpIHtcbiAgICBpZiAoaXRlbXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB2YXIgZmlsZXMgPSBbXTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZTogcHJlZmVyLWZvci1vZlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGZpbGUgPSBpdGVtc1tpXTtcbiAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVzO1xufVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RhdGFUcmFuc2Zlckl0ZW1cbmZ1bmN0aW9uIHRvRmlsZVByb21pc2VzKGl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0ud2Via2l0R2V0QXNFbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gZnJvbURhdGFUcmFuc2Zlckl0ZW0oaXRlbSk7XG4gICAgfVxuICAgIHZhciBlbnRyeSA9IGl0ZW0ud2Via2l0R2V0QXNFbnRyeSgpO1xuICAgIC8vIFNhZmFyaSBzdXBwb3J0cyBkcm9wcGluZyBhbiBpbWFnZSBub2RlIGZyb20gYSBkaWZmZXJlbnQgd2luZG93IGFuZCBjYW4gYmUgcmV0cmlldmVkIHVzaW5nXG4gICAgLy8gdGhlIERhdGFUcmFuc2Zlckl0ZW0uZ2V0QXNGaWxlKCkgQVBJXG4gICAgLy8gTk9URTogRmlsZVN5c3RlbUVudHJ5LmZpbGUoKSB0aHJvd3MgaWYgdHJ5aW5nIHRvIGdldCB0aGUgZmlsZVxuICAgIGlmIChlbnRyeSAmJiBlbnRyeS5pc0RpcmVjdG9yeSkge1xuICAgICAgICByZXR1cm4gZnJvbURpckVudHJ5KGVudHJ5KTtcbiAgICB9XG4gICAgcmV0dXJuIGZyb21EYXRhVHJhbnNmZXJJdGVtKGl0ZW0pO1xufVxuZnVuY3Rpb24gZmxhdHRlbihpdGVtcykge1xuICAgIHJldHVybiBpdGVtcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZmlsZXMpIHsgcmV0dXJuIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFjYyksIGZhbHNlKSwgX19yZWFkKChBcnJheS5pc0FycmF5KGZpbGVzKSA/IGZsYXR0ZW4oZmlsZXMpIDogW2ZpbGVzXSkpLCBmYWxzZSk7IH0sIFtdKTtcbn1cbmZ1bmN0aW9uIGZyb21EYXRhVHJhbnNmZXJJdGVtKGl0ZW0pIHtcbiAgICB2YXIgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIlwiLmNvbmNhdChpdGVtLCBcIiBpcyBub3QgYSBGaWxlXCIpKTtcbiAgICB9XG4gICAgdmFyIGZ3cCA9IHRvRmlsZVdpdGhQYXRoKGZpbGUpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZndwKTtcbn1cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRW50cnlcbmZ1bmN0aW9uIGZyb21FbnRyeShlbnRyeSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGVudHJ5LmlzRGlyZWN0b3J5ID8gZnJvbURpckVudHJ5KGVudHJ5KSA6IGZyb21GaWxlRW50cnkoZW50cnkpXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbURpcmVjdG9yeUVudHJ5XG5mdW5jdGlvbiBmcm9tRGlyRW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVhZGVyID0gZW50cnkuY3JlYXRlUmVhZGVyKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gcmVhZEVudHJpZXMoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZpbGVTeXN0ZW1EaXJlY3RvcnlFbnRyeS9jcmVhdGVSZWFkZXJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlU3lzdGVtRGlyZWN0b3J5UmVhZGVyL3JlYWRFbnRyaWVzXG4gICAgICAgICAgICByZWFkZXIucmVhZEVudHJpZXMoZnVuY3Rpb24gKGJhdGNoKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVzLCBlcnJfMSwgaXRlbXM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhYmF0Y2gubGVuZ3RoKSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChlbnRyaWVzKV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycl8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBQcm9taXNlLmFsbChiYXRjaC5tYXAoZnJvbUVudHJ5KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGl0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSByZWFkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZEVudHJpZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDY6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlYWRFbnRyaWVzKCk7XG4gICAgfSk7XG59XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVN5c3RlbUZpbGVFbnRyeVxuZnVuY3Rpb24gZnJvbUZpbGVFbnRyeShlbnRyeSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ3cCA9IHRvRmlsZVdpdGhQYXRoKGZpbGUsIGVudHJ5LmZ1bGxQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZndwKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWxlLXNlbGVjdG9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoZmlsZSwgYWNjZXB0ZWRGaWxlcykge1xuICBpZiAoZmlsZSAmJiBhY2NlcHRlZEZpbGVzKSB7XG4gICAgdmFyIGFjY2VwdGVkRmlsZXNBcnJheSA9IEFycmF5LmlzQXJyYXkoYWNjZXB0ZWRGaWxlcykgPyBhY2NlcHRlZEZpbGVzIDogYWNjZXB0ZWRGaWxlcy5zcGxpdCgnLCcpO1xuICAgIHZhciBmaWxlTmFtZSA9IGZpbGUubmFtZSB8fCAnJztcbiAgICB2YXIgbWltZVR5cGUgPSAoZmlsZS50eXBlIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBiYXNlTWltZVR5cGUgPSBtaW1lVHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJyk7XG4gICAgcmV0dXJuIGFjY2VwdGVkRmlsZXNBcnJheS5zb21lKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB2YXIgdmFsaWRUeXBlID0gdHlwZS50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKHZhbGlkVHlwZS5jaGFyQXQoMCkgPT09ICcuJykge1xuICAgICAgICByZXR1cm4gZmlsZU5hbWUudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCh2YWxpZFR5cGUpO1xuICAgICAgfSBlbHNlIGlmICh2YWxpZFR5cGUuZW5kc1dpdGgoJy8qJykpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBzb21ldGhpbmcgbGlrZSBhIGltYWdlLyogbWltZSB0eXBlXG4gICAgICAgIHJldHVybiBiYXNlTWltZVR5cGUgPT09IHZhbGlkVHlwZS5yZXBsYWNlKC9cXC8uKiQvLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtaW1lVHlwZSA9PT0gdmFsaWRUeXBlO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59OyIsImltcG9ydCBhY2NlcHRzIGZyb20gXCJhdHRyLWFjY2VwdFwiO1xuXG4vLyBFcnJvciBjb2Rlc1xuZXhwb3J0IGNvbnN0IEZJTEVfSU5WQUxJRF9UWVBFID0gXCJmaWxlLWludmFsaWQtdHlwZVwiO1xuZXhwb3J0IGNvbnN0IEZJTEVfVE9PX0xBUkdFID0gXCJmaWxlLXRvby1sYXJnZVwiO1xuZXhwb3J0IGNvbnN0IEZJTEVfVE9PX1NNQUxMID0gXCJmaWxlLXRvby1zbWFsbFwiO1xuZXhwb3J0IGNvbnN0IFRPT19NQU5ZX0ZJTEVTID0gXCJ0b28tbWFueS1maWxlc1wiO1xuXG5leHBvcnQgY29uc3QgRXJyb3JDb2RlID0ge1xuICBGaWxlSW52YWxpZFR5cGU6IEZJTEVfSU5WQUxJRF9UWVBFLFxuICBGaWxlVG9vTGFyZ2U6IEZJTEVfVE9PX0xBUkdFLFxuICBGaWxlVG9vU21hbGw6IEZJTEVfVE9PX1NNQUxMLFxuICBUb29NYW55RmlsZXM6IFRPT19NQU5ZX0ZJTEVTLFxufTtcblxuLy8gRmlsZSBFcnJvcnNcbmV4cG9ydCBjb25zdCBnZXRJbnZhbGlkVHlwZVJlamVjdGlvbkVyciA9IChhY2NlcHQpID0+IHtcbiAgYWNjZXB0ID0gQXJyYXkuaXNBcnJheShhY2NlcHQpICYmIGFjY2VwdC5sZW5ndGggPT09IDEgPyBhY2NlcHRbMF0gOiBhY2NlcHQ7XG4gIGNvbnN0IG1lc3NhZ2VTdWZmaXggPSBBcnJheS5pc0FycmF5KGFjY2VwdClcbiAgICA/IGBvbmUgb2YgJHthY2NlcHQuam9pbihcIiwgXCIpfWBcbiAgICA6IGFjY2VwdDtcbiAgcmV0dXJuIHtcbiAgICBjb2RlOiBGSUxFX0lOVkFMSURfVFlQRSxcbiAgICBtZXNzYWdlOiBgRmlsZSB0eXBlIG11c3QgYmUgJHttZXNzYWdlU3VmZml4fWAsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VG9vTGFyZ2VSZWplY3Rpb25FcnIgPSAobWF4U2l6ZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIGNvZGU6IEZJTEVfVE9PX0xBUkdFLFxuICAgIG1lc3NhZ2U6IGBGaWxlIGlzIGxhcmdlciB0aGFuICR7bWF4U2l6ZX0gJHtcbiAgICAgIG1heFNpemUgPT09IDEgPyBcImJ5dGVcIiA6IFwiYnl0ZXNcIlxuICAgIH1gLFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFRvb1NtYWxsUmVqZWN0aW9uRXJyID0gKG1pblNpemUpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBjb2RlOiBGSUxFX1RPT19TTUFMTCxcbiAgICBtZXNzYWdlOiBgRmlsZSBpcyBzbWFsbGVyIHRoYW4gJHttaW5TaXplfSAke1xuICAgICAgbWluU2l6ZSA9PT0gMSA/IFwiYnl0ZVwiIDogXCJieXRlc1wiXG4gICAgfWAsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgVE9PX01BTllfRklMRVNfUkVKRUNUSU9OID0ge1xuICBjb2RlOiBUT09fTUFOWV9GSUxFUyxcbiAgbWVzc2FnZTogXCJUb28gbWFueSBmaWxlc1wiLFxufTtcblxuLy8gRmlyZWZveCB2ZXJzaW9ucyBwcmlvciB0byA1MyByZXR1cm4gYSBib2d1cyBNSU1FIHR5cGUgZm9yIGV2ZXJ5IGZpbGUgZHJhZywgc28gZHJhZ292ZXJzIHdpdGhcbi8vIHRoYXQgTUlNRSB0eXBlIHdpbGwgYWx3YXlzIGJlIGFjY2VwdGVkXG5leHBvcnQgZnVuY3Rpb24gZmlsZUFjY2VwdGVkKGZpbGUsIGFjY2VwdCkge1xuICBjb25zdCBpc0FjY2VwdGFibGUgPVxuICAgIGZpbGUudHlwZSA9PT0gXCJhcHBsaWNhdGlvbi94LW1vei1maWxlXCIgfHwgYWNjZXB0cyhmaWxlLCBhY2NlcHQpO1xuICByZXR1cm4gW1xuICAgIGlzQWNjZXB0YWJsZSxcbiAgICBpc0FjY2VwdGFibGUgPyBudWxsIDogZ2V0SW52YWxpZFR5cGVSZWplY3Rpb25FcnIoYWNjZXB0KSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVNYXRjaFNpemUoZmlsZSwgbWluU2l6ZSwgbWF4U2l6ZSkge1xuICBpZiAoaXNEZWZpbmVkKGZpbGUuc2l6ZSkpIHtcbiAgICBpZiAoaXNEZWZpbmVkKG1pblNpemUpICYmIGlzRGVmaW5lZChtYXhTaXplKSkge1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IG1heFNpemUpIHJldHVybiBbZmFsc2UsIGdldFRvb0xhcmdlUmVqZWN0aW9uRXJyKG1heFNpemUpXTtcbiAgICAgIGlmIChmaWxlLnNpemUgPCBtaW5TaXplKSByZXR1cm4gW2ZhbHNlLCBnZXRUb29TbWFsbFJlamVjdGlvbkVycihtaW5TaXplKV07XG4gICAgfSBlbHNlIGlmIChpc0RlZmluZWQobWluU2l6ZSkgJiYgZmlsZS5zaXplIDwgbWluU2l6ZSlcbiAgICAgIHJldHVybiBbZmFsc2UsIGdldFRvb1NtYWxsUmVqZWN0aW9uRXJyKG1pblNpemUpXTtcbiAgICBlbHNlIGlmIChpc0RlZmluZWQobWF4U2l6ZSkgJiYgZmlsZS5zaXplID4gbWF4U2l6ZSlcbiAgICAgIHJldHVybiBbZmFsc2UsIGdldFRvb0xhcmdlUmVqZWN0aW9uRXJyKG1heFNpemUpXTtcbiAgfVxuICByZXR1cm4gW3RydWUsIG51bGxdO1xufVxuXG5mdW5jdGlvbiBpc0RlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0ZpbGVbXX0gb3B0aW9ucy5maWxlc1xuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IFtvcHRpb25zLmFjY2VwdF1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5taW5TaXplXVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFNpemVdXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm11bHRpcGxlXVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heEZpbGVzXVxuICogQHBhcmFtIHsoZjogRmlsZSkgPT4gRmlsZUVycm9yfEZpbGVFcnJvcltdfG51bGx9IFtvcHRpb25zLnZhbGlkYXRvcl1cbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGxGaWxlc0FjY2VwdGVkKHtcbiAgZmlsZXMsXG4gIGFjY2VwdCxcbiAgbWluU2l6ZSxcbiAgbWF4U2l6ZSxcbiAgbXVsdGlwbGUsXG4gIG1heEZpbGVzLFxuICB2YWxpZGF0b3IsXG59KSB7XG4gIGlmIChcbiAgICAoIW11bHRpcGxlICYmIGZpbGVzLmxlbmd0aCA+IDEpIHx8XG4gICAgKG11bHRpcGxlICYmIG1heEZpbGVzID49IDEgJiYgZmlsZXMubGVuZ3RoID4gbWF4RmlsZXMpXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBmaWxlcy5ldmVyeSgoZmlsZSkgPT4ge1xuICAgIGNvbnN0IFthY2NlcHRlZF0gPSBmaWxlQWNjZXB0ZWQoZmlsZSwgYWNjZXB0KTtcbiAgICBjb25zdCBbc2l6ZU1hdGNoXSA9IGZpbGVNYXRjaFNpemUoZmlsZSwgbWluU2l6ZSwgbWF4U2l6ZSk7XG4gICAgY29uc3QgY3VzdG9tRXJyb3JzID0gdmFsaWRhdG9yID8gdmFsaWRhdG9yKGZpbGUpIDogbnVsbDtcbiAgICByZXR1cm4gYWNjZXB0ZWQgJiYgc2l6ZU1hdGNoICYmICFjdXN0b21FcnJvcnM7XG4gIH0pO1xufVxuXG4vLyBSZWFjdCdzIHN5bnRoZXRpYyBldmVudHMgaGFzIGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkLFxuLy8gYnV0IHRvIHJlbWFpbiBjb21wYXRpYmlsaXR5IHdpdGggb3RoZXIgbGlicyAoUHJlYWN0KSBmYWxsIGJhY2tcbi8vIHRvIGNoZWNrIGV2ZW50LmNhbmNlbEJ1YmJsZVxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KSB7XG4gIGlmICh0eXBlb2YgZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBldmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBldmVudC5jYW5jZWxCdWJibGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4gZXZlbnQuY2FuY2VsQnViYmxlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXZ0V2l0aEZpbGVzKGV2ZW50KSB7XG4gIGlmICghZXZlbnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgcmV0dXJuICEhZXZlbnQudGFyZ2V0ICYmICEhZXZlbnQudGFyZ2V0LmZpbGVzO1xuICB9XG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EYXRhVHJhbnNmZXIvdHlwZXNcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxfRHJhZ19hbmRfRHJvcF9BUEkvUmVjb21tZW5kZWRfZHJhZ190eXBlcyNmaWxlXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc29tZS5jYWxsKFxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlcyxcbiAgICAodHlwZSkgPT4gdHlwZSA9PT0gXCJGaWxlc1wiIHx8IHR5cGUgPT09IFwiYXBwbGljYXRpb24veC1tb3otZmlsZVwiXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tpbmRGaWxlKGl0ZW0pIHtcbiAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiICYmIGl0ZW0gIT09IG51bGwgJiYgaXRlbS5raW5kID09PSBcImZpbGVcIjtcbn1cblxuLy8gYWxsb3cgdGhlIGVudGlyZSBkb2N1bWVudCB0byBiZSBhIGRyYWcgdGFyZ2V0XG5leHBvcnQgZnVuY3Rpb24gb25Eb2N1bWVudERyYWdPdmVyKGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIGlzSWUodXNlckFnZW50KSB7XG4gIHJldHVybiAoXG4gICAgdXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpICE9PSAtMSB8fCB1c2VyQWdlbnQuaW5kZXhPZihcIlRyaWRlbnQvXCIpICE9PSAtMVxuICApO1xufVxuXG5mdW5jdGlvbiBpc0VkZ2UodXNlckFnZW50KSB7XG4gIHJldHVybiB1c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2UvXCIpICE9PSAtMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSWVPckVkZ2UodXNlckFnZW50ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpIHtcbiAgcmV0dXJuIGlzSWUodXNlckFnZW50KSB8fCBpc0VkZ2UodXNlckFnZW50KTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIHVzZWQgdG8gY29tcG9zZSBldmVudCBoYW5kbGVyc1xuICogVGhleSBhcmUgZXhlY3V0ZWQgaW4gb3JkZXIgdW50aWwgb25lIG9mIHRoZW0gY2FsbHMgYGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKClgLlxuICogTm90ZSB0aGF0IHRoZSBjaGVjayBpcyBkb25lIG9uIHRoZSBmaXJzdCBpbnZva2UgdG9vLFxuICogbWVhbmluZyB0aGF0IGlmIHByb3BhZ2F0aW9uIHdhcyBzdG9wcGVkIGJlZm9yZSBpbnZva2luZyB0aGUgZm5zLFxuICogbm8gaGFuZGxlcnMgd2lsbCBiZSBleGVjdXRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbnMgdGhlIGV2ZW50IGhhbmxkZXIgZnVuY3Rpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGV2ZW50IGhhbmRsZXIgdG8gYWRkIHRvIGFuIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2VFdmVudEhhbmRsZXJzKC4uLmZucykge1xuICByZXR1cm4gKGV2ZW50LCAuLi5hcmdzKSA9PlxuICAgIGZucy5zb21lKChmbikgPT4ge1xuICAgICAgaWYgKCFpc1Byb3BhZ2F0aW9uU3RvcHBlZChldmVudCkgJiYgZm4pIHtcbiAgICAgICAgZm4oZXZlbnQsIC4uLmFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBjYW5Vc2VGaWxlU3lzdGVtQWNjZXNzQVBJIGNoZWNrcyBpZiB0aGUgW0ZpbGUgU3lzdGVtIEFjY2VzcyBBUEldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlX1N5c3RlbV9BY2Nlc3NfQVBJKVxuICogaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5Vc2VGaWxlU3lzdGVtQWNjZXNzQVBJKCkge1xuICByZXR1cm4gXCJzaG93T3BlbkZpbGVQaWNrZXJcIiBpbiB3aW5kb3c7XG59XG5cbi8qKlxuICogQ29udmVydCB0aGUgYHthY2NlcHR9YCBkcm9wem9uZSBwcm9wIHRvIHRoZVxuICogYHt0eXBlc31gIG9wdGlvbiBmb3IgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL3dpbmRvdy9zaG93T3BlbkZpbGVQaWNrZXJcbiAqXG4gKiBAcGFyYW0ge0FjY2VwdFByb3B9IGFjY2VwdFxuICogQHJldHVybnMge3thY2NlcHQ6IHN0cmluZ1tdfVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGlja2VyT3B0aW9uc0Zyb21BY2NlcHQoYWNjZXB0KSB7XG4gIGlmIChpc0RlZmluZWQoYWNjZXB0KSkge1xuICAgIGNvbnN0IGFjY2VwdEZvclBpY2tlciA9IE9iamVjdC5lbnRyaWVzKGFjY2VwdClcbiAgICAgIC5maWx0ZXIoKFttaW1lVHlwZSwgZXh0XSkgPT4ge1xuICAgICAgICBsZXQgb2sgPSB0cnVlO1xuXG4gICAgICAgIGlmICghaXNNSU1FVHlwZShtaW1lVHlwZSkpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgU2tpcHBlZCBcIiR7bWltZVR5cGV9XCIgYmVjYXVzZSBpdCBpcyBub3QgYSB2YWxpZCBNSU1FIHR5cGUuIENoZWNrIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUVFAvQmFzaWNzX29mX0hUVFAvTUlNRV90eXBlcy9Db21tb25fdHlwZXMgZm9yIGEgbGlzdCBvZiB2YWxpZCBNSU1FIHR5cGVzLmBcbiAgICAgICAgICApO1xuICAgICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXh0KSB8fCAhZXh0LmV2ZXJ5KGlzRXh0KSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBTa2lwcGVkIFwiJHttaW1lVHlwZX1cIiBiZWNhdXNlIGFuIGludmFsaWQgZmlsZSBleHRlbnNpb24gd2FzIHByb3ZpZGVkLmBcbiAgICAgICAgICApO1xuICAgICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2s7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZShcbiAgICAgICAgKGFnZywgW21pbWVUeXBlLCBleHRdKSA9PiAoe1xuICAgICAgICAgIC4uLmFnZyxcbiAgICAgICAgICBbbWltZVR5cGVdOiBleHQsXG4gICAgICAgIH0pLFxuICAgICAgICB7fVxuICAgICAgKTtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICAvLyBkZXNjcmlwdGlvbiBpcyByZXF1aXJlZCBkdWUgdG8gaHR0cHM6Ly9jcmJ1Zy5jb20vMTI2NDcwOFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJGaWxlc1wiLFxuICAgICAgICBhY2NlcHQ6IGFjY2VwdEZvclBpY2tlcixcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuICByZXR1cm4gYWNjZXB0O1xufVxuXG4vKipcbiAqIENvbnZlcnQgdGhlIGB7YWNjZXB0fWAgZHJvcHpvbmUgcHJvcCB0byBhbiBhcnJheSBvZiBNSU1FIHR5cGVzL2V4dGVuc2lvbnMuXG4gKiBAcGFyYW0ge0FjY2VwdFByb3B9IGFjY2VwdFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjY2VwdFByb3BBc0FjY2VwdEF0dHIoYWNjZXB0KSB7XG4gIGlmIChpc0RlZmluZWQoYWNjZXB0KSkge1xuICAgIHJldHVybiAoXG4gICAgICBPYmplY3QuZW50cmllcyhhY2NlcHQpXG4gICAgICAgIC5yZWR1Y2UoKGEsIFttaW1lVHlwZSwgZXh0XSkgPT4gWy4uLmEsIG1pbWVUeXBlLCAuLi5leHRdLCBbXSlcbiAgICAgICAgLy8gU2lsZW50bHkgZGlzY2FyZCBpbnZhbGlkIGVudHJpZXMgYXMgcGlja2VyT3B0aW9uc0Zyb21BY2NlcHQgd2FybnMgYWJvdXQgdGhlc2VcbiAgICAgICAgLmZpbHRlcigodikgPT4gaXNNSU1FVHlwZSh2KSB8fCBpc0V4dCh2KSlcbiAgICAgICAgLmpvaW4oXCIsXCIpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdiBpcyBhbiBleGNlcHRpb24gY2F1c2VkIGJ5IGFib3J0aW5nIGEgcmVxdWVzdCAoZS5nIHdpbmRvdy5zaG93T3BlbkZpbGVQaWNrZXIoKSkuXG4gKlxuICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01FeGNlcHRpb24uXG4gKiBAcGFyYW0ge2FueX0gdlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdiBpcyBhbiBhYm9ydCBleGNlcHRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Fib3J0KHYpIHtcbiAgcmV0dXJuIChcbiAgICB2IGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uICYmXG4gICAgKHYubmFtZSA9PT0gXCJBYm9ydEVycm9yXCIgfHwgdi5jb2RlID09PSB2LkFCT1JUX0VSUilcbiAgKTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB2IGlzIGEgc2VjdXJpdHkgZXJyb3IuXG4gKlxuICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01FeGNlcHRpb24uXG4gKiBAcGFyYW0ge2FueX0gdlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdiBpcyBhIHNlY3VyaXR5IGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTZWN1cml0eUVycm9yKHYpIHtcbiAgcmV0dXJuIChcbiAgICB2IGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uICYmXG4gICAgKHYubmFtZSA9PT0gXCJTZWN1cml0eUVycm9yXCIgfHwgdi5jb2RlID09PSB2LlNFQ1VSSVRZX0VSUilcbiAgKTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB2IGlzIGEgTUlNRSB0eXBlIHN0cmluZy5cbiAqXG4gKiBTZWUgYWNjZXB0ZWQgZm9ybWF0OiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvaW5wdXQvZmlsZSN1bmlxdWVfZmlsZV90eXBlX3NwZWNpZmllcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTUlNRVR5cGUodikge1xuICByZXR1cm4gKFxuICAgIHYgPT09IFwiYXVkaW8vKlwiIHx8XG4gICAgdiA9PT0gXCJ2aWRlby8qXCIgfHxcbiAgICB2ID09PSBcImltYWdlLypcIiB8fFxuICAgIHYgPT09IFwidGV4dC8qXCIgfHxcbiAgICAvXFx3K1xcL1stKy5cXHddKy9nLnRlc3QodilcbiAgKTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB2IGlzIGEgZmlsZSBleHRlbnNpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gdlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFeHQodikge1xuICByZXR1cm4gL14uKlxcLltcXHddKyQvLnRlc3Qodik7XG59XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdC48c3RyaW5nLCBzdHJpbmdbXT59IEFjY2VwdFByb3BcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEZpbGVFcnJvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1lc3NhZ2VcbiAqIEBwcm9wZXJ0eSB7RXJyb3JDb2RlfHN0cmluZ30gY29kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1wiZmlsZS1pbnZhbGlkLXR5cGVcInxcImZpbGUtdG9vLWxhcmdlXCJ8XCJmaWxlLXRvby1zbWFsbFwifFwidG9vLW1hbnktZmlsZXNcIn0gRXJyb3JDb2RlXG4gKi9cbiIsIi8qIGVzbGludCBwcmVmZXItdGVtcGxhdGU6IDAgKi9cbmltcG9ydCBSZWFjdCwge1xuICBmb3J3YXJkUmVmLFxuICBGcmFnbWVudCxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlSW1wZXJhdGl2ZUhhbmRsZSxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlUmVmLFxufSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcbmltcG9ydCB7IGZyb21FdmVudCB9IGZyb20gXCJmaWxlLXNlbGVjdG9yXCI7XG5pbXBvcnQge1xuICBhY2NlcHRQcm9wQXNBY2NlcHRBdHRyLFxuICBhbGxGaWxlc0FjY2VwdGVkLFxuICBjb21wb3NlRXZlbnRIYW5kbGVycyxcbiAgZmlsZUFjY2VwdGVkLFxuICBmaWxlTWF0Y2hTaXplLFxuICBjYW5Vc2VGaWxlU3lzdGVtQWNjZXNzQVBJLFxuICBpc0Fib3J0LFxuICBpc0V2dFdpdGhGaWxlcyxcbiAgaXNJZU9yRWRnZSxcbiAgaXNQcm9wYWdhdGlvblN0b3BwZWQsXG4gIGlzU2VjdXJpdHlFcnJvcixcbiAgb25Eb2N1bWVudERyYWdPdmVyLFxuICBwaWNrZXJPcHRpb25zRnJvbUFjY2VwdCxcbiAgVE9PX01BTllfRklMRVNfUkVKRUNUSU9OLFxufSBmcm9tIFwiLi91dGlscy9pbmRleFwiO1xuXG4vKipcbiAqIENvbnZlbmllbmNlIHdyYXBwZXIgY29tcG9uZW50IGZvciB0aGUgYHVzZURyb3B6b25lYCBob29rXG4gKlxuICogYGBganN4XG4gKiA8RHJvcHpvbmU+XG4gKiAgIHsoe2dldFJvb3RQcm9wcywgZ2V0SW5wdXRQcm9wc30pID0+IChcbiAqICAgICA8ZGl2IHsuLi5nZXRSb290UHJvcHMoKX0+XG4gKiAgICAgICA8aW5wdXQgey4uLmdldElucHV0UHJvcHMoKX0gLz5cbiAqICAgICAgIDxwPkRyYWcgJ24nIGRyb3Agc29tZSBmaWxlcyBoZXJlLCBvciBjbGljayB0byBzZWxlY3QgZmlsZXM8L3A+XG4gKiAgICAgPC9kaXY+XG4gKiAgICl9XG4gKiA8L0Ryb3B6b25lPlxuICogYGBgXG4gKi9cbmNvbnN0IERyb3B6b25lID0gZm9yd2FyZFJlZigoeyBjaGlsZHJlbiwgLi4ucGFyYW1zIH0sIHJlZikgPT4ge1xuICBjb25zdCB7IG9wZW4sIC4uLnByb3BzIH0gPSB1c2VEcm9wem9uZShwYXJhbXMpO1xuXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCAoKSA9PiAoeyBvcGVuIH0pLCBbb3Blbl0pO1xuXG4gIC8vIFRPRE86IEZpZ3VyZSBvdXQgd2h5IHJlYWN0LXN0eWxlZ3VpZGlzdCBjYW5ub3QgY3JlYXRlIGRvY3MgaWYgd2UgZG9uJ3QgcmV0dXJuIGEganN4IGVsZW1lbnRcbiAgcmV0dXJuIDxGcmFnbWVudD57Y2hpbGRyZW4oeyAuLi5wcm9wcywgb3BlbiB9KX08L0ZyYWdtZW50Pjtcbn0pO1xuXG5Ecm9wem9uZS5kaXNwbGF5TmFtZSA9IFwiRHJvcHpvbmVcIjtcblxuLy8gQWRkIGRlZmF1bHQgcHJvcHMgZm9yIHJlYWN0LWRvY2dlblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBkaXNhYmxlZDogZmFsc2UsXG4gIGdldEZpbGVzRnJvbUV2ZW50OiBmcm9tRXZlbnQsXG4gIG1heFNpemU6IEluZmluaXR5LFxuICBtaW5TaXplOiAwLFxuICBtdWx0aXBsZTogdHJ1ZSxcbiAgbWF4RmlsZXM6IDAsXG4gIHByZXZlbnREcm9wT25Eb2N1bWVudDogdHJ1ZSxcbiAgbm9DbGljazogZmFsc2UsXG4gIG5vS2V5Ym9hcmQ6IGZhbHNlLFxuICBub0RyYWc6IGZhbHNlLFxuICBub0RyYWdFdmVudHNCdWJibGluZzogZmFsc2UsXG4gIHZhbGlkYXRvcjogbnVsbCxcbiAgdXNlRnNBY2Nlc3NBcGk6IHRydWUsXG4gIGF1dG9Gb2N1czogZmFsc2UsXG59O1xuXG5Ecm9wem9uZS5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbkRyb3B6b25lLnByb3BUeXBlcyA9IHtcbiAgLyoqXG4gICAqIFJlbmRlciBmdW5jdGlvbiB0aGF0IGV4cG9zZXMgdGhlIGRyb3B6b25lIHN0YXRlIGFuZCBwcm9wIGdldHRlciBmbnNcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJhbXMuZ2V0Um9vdFByb3BzIFJldHVybnMgdGhlIHByb3BzIHlvdSBzaG91bGQgYXBwbHkgdG8gdGhlIHJvb3QgZHJvcCBjb250YWluZXIgeW91IHJlbmRlclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJhbXMuZ2V0SW5wdXRQcm9wcyBSZXR1cm5zIHRoZSBwcm9wcyB5b3Ugc2hvdWxkIGFwcGx5IHRvIGhpZGRlbiBmaWxlIGlucHV0IHlvdSByZW5kZXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcGFyYW1zLm9wZW4gT3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZ1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0ZvY3VzZWQgRHJvcHpvbmUgYXJlYSBpcyBpbiBmb2N1c1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0ZpbGVEaWFsb2dBY3RpdmUgRmlsZSBkaWFsb2cgaXMgb3BlbmVkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zLmlzRHJhZ0FjdGl2ZSBBY3RpdmUgZHJhZyBpcyBpbiBwcm9ncmVzc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcy5pc0RyYWdBY2NlcHQgRHJhZ2dlZCBmaWxlcyBhcmUgYWNjZXB0ZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBwYXJhbXMuaXNEcmFnUmVqZWN0IFNvbWUgZHJhZ2dlZCBmaWxlcyBhcmUgcmVqZWN0ZWRcbiAgICogQHBhcmFtIHtGaWxlW119IHBhcmFtcy5hY2NlcHRlZEZpbGVzIEFjY2VwdGVkIGZpbGVzXG4gICAqIEBwYXJhbSB7RmlsZVJlamVjdGlvbltdfSBwYXJhbXMuZmlsZVJlamVjdGlvbnMgUmVqZWN0ZWQgZmlsZXMgYW5kIHdoeSB0aGV5IHdlcmUgcmVqZWN0ZWRcbiAgICovXG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogU2V0IGFjY2VwdGVkIGZpbGUgdHlwZXMuXG4gICAqIENoZWNrb3V0IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS93aW5kb3cvc2hvd09wZW5GaWxlUGlja2VyIHR5cGVzIG9wdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICogS2VlcCBpbiBtaW5kIHRoYXQgbWltZSB0eXBlIGRldGVybWluYXRpb24gaXMgbm90IHJlbGlhYmxlIGFjcm9zcyBwbGF0Zm9ybXMuIENTViBmaWxlcyxcbiAgICogZm9yIGV4YW1wbGUsIGFyZSByZXBvcnRlZCBhcyB0ZXh0L3BsYWluIHVuZGVyIG1hY09TIGJ1dCBhcyBhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwgdW5kZXJcbiAgICogV2luZG93cy4gSW4gc29tZSBjYXNlcyB0aGVyZSBtaWdodCBub3QgYmUgYSBtaW1lIHR5cGUgc2V0IGF0IGFsbCAoaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0LWRyb3B6b25lL3JlYWN0LWRyb3B6b25lL2lzc3Vlcy8yNzYpLlxuICAgKi9cbiAgYWNjZXB0OiBQcm9wVHlwZXMub2JqZWN0T2YoUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZykpLFxuXG4gIC8qKlxuICAgKiBBbGxvdyBkcmFnICduJyBkcm9wIChvciBzZWxlY3Rpb24gZnJvbSB0aGUgZmlsZSBkaWFsb2cpIG9mIG11bHRpcGxlIGZpbGVzXG4gICAqL1xuICBtdWx0aXBsZTogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIElmIGZhbHNlLCBhbGxvdyBkcm9wcGVkIGl0ZW1zIHRvIHRha2Ugb3ZlciB0aGUgY3VycmVudCBicm93c2VyIHdpbmRvd1xuICAgKi9cbiAgcHJldmVudERyb3BPbkRvY3VtZW50OiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgZGlzYWJsZXMgY2xpY2sgdG8gb3BlbiB0aGUgbmF0aXZlIGZpbGUgc2VsZWN0aW9uIGRpYWxvZ1xuICAgKi9cbiAgbm9DbGljazogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIElmIHRydWUsIGRpc2FibGVzIFNQQUNFL0VOVEVSIHRvIG9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2cuXG4gICAqIE5vdGUgdGhhdCBpdCBhbHNvIHN0b3BzIHRyYWNraW5nIHRoZSBmb2N1cyBzdGF0ZS5cbiAgICovXG4gIG5vS2V5Ym9hcmQ6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBkaXNhYmxlcyBkcmFnICduJyBkcm9wXG4gICAqL1xuICBub0RyYWc6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBzdG9wcyBkcmFnIGV2ZW50IHByb3BhZ2F0aW9uIHRvIHBhcmVudHNcbiAgICovXG4gIG5vRHJhZ0V2ZW50c0J1YmJsaW5nOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogTWluaW11bSBmaWxlIHNpemUgKGluIGJ5dGVzKVxuICAgKi9cbiAgbWluU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICogTWF4aW11bSBmaWxlIHNpemUgKGluIGJ5dGVzKVxuICAgKi9cbiAgbWF4U2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgLyoqXG4gICAqIE1heGltdW0gYWNjZXB0ZWQgbnVtYmVyIG9mIGZpbGVzXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDAgd2hpY2ggbWVhbnMgdGhlcmUgaXMgbm8gbGltaXRhdGlvbiB0byBob3cgbWFueSBmaWxlcyBhcmUgYWNjZXB0ZWQuXG4gICAqL1xuICBtYXhGaWxlczogUHJvcFR5cGVzLm51bWJlcixcblxuICAvKipcbiAgICogRW5hYmxlL2Rpc2FibGUgdGhlIGRyb3B6b25lXG4gICAqL1xuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIHRvIHByb3ZpZGUgYSBjdXN0b20gZmlsZSBhZ2dyZWdhdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAgICovXG4gIGdldEZpbGVzRnJvbUV2ZW50OiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gY2xvc2luZyB0aGUgZmlsZSBkaWFsb2cgd2l0aCBubyBzZWxlY3Rpb25cbiAgICovXG4gIG9uRmlsZURpYWxvZ0NhbmNlbDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIG9wZW5pbmcgdGhlIGZpbGUgZGlhbG9nXG4gICAqL1xuICBvbkZpbGVEaWFsb2dPcGVuOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogU2V0IHRvIHRydWUgdG8gdXNlIHRoZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZV9TeXN0ZW1fQWNjZXNzX0FQSVxuICAgKiB0byBvcGVuIHRoZSBmaWxlIHBpY2tlciBpbnN0ZWFkIG9mIHVzaW5nIGFuIGA8aW5wdXQgdHlwZT1cImZpbGVcIj5gIGNsaWNrIGV2ZW50LlxuICAgKi9cbiAgdXNlRnNBY2Nlc3NBcGk6IFByb3BUeXBlcy5ib29sLFxuXG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSB0byBmb2N1cyB0aGUgcm9vdCBlbGVtZW50IG9uIHJlbmRlclxuICAgKi9cbiAgYXV0b0ZvY3VzOiBQcm9wVHlwZXMuYm9vbCxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcmFnZW50ZXJgIGV2ZW50IG9jY3Vycy5cbiAgICpcbiAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50XG4gICAqL1xuICBvbkRyYWdFbnRlcjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJhZ2xlYXZlYCBldmVudCBvY2N1cnNcbiAgICpcbiAgICogQHBhcmFtIHtEcmFnRXZlbnR9IGV2ZW50XG4gICAqL1xuICBvbkRyYWdMZWF2ZTogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZSBgZHJhZ292ZXJgIGV2ZW50IG9jY3Vyc1xuICAgKlxuICAgKiBAcGFyYW0ge0RyYWdFdmVudH0gZXZlbnRcbiAgICovXG4gIG9uRHJhZ092ZXI6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyb3BgIGV2ZW50IG9jY3Vycy5cbiAgICogTm90ZSB0aGF0IHRoaXMgY2FsbGJhY2sgaXMgaW52b2tlZCBhZnRlciB0aGUgYGdldEZpbGVzRnJvbUV2ZW50YCBjYWxsYmFjayBpcyBkb25lLlxuICAgKlxuICAgKiBGaWxlcyBhcmUgYWNjZXB0ZWQgb3IgcmVqZWN0ZWQgYmFzZWQgb24gdGhlIGBhY2NlcHRgLCBgbXVsdGlwbGVgLCBgbWluU2l6ZWAgYW5kIGBtYXhTaXplYCBwcm9wcy5cbiAgICogYGFjY2VwdGAgbXVzdCBiZSBhIHZhbGlkIFtNSU1FIHR5cGVdKGh0dHA6Ly93d3cuaWFuYS5vcmcvYXNzaWdubWVudHMvbWVkaWEtdHlwZXMvbWVkaWEtdHlwZXMueGh0bWwpIGFjY29yZGluZyB0byBbaW5wdXQgZWxlbWVudCBzcGVjaWZpY2F0aW9uXShodHRwczovL3d3dy53My5vcmcvd2lraS9IVE1ML0VsZW1lbnRzL2lucHV0L2ZpbGUpIG9yIGEgdmFsaWQgZmlsZSBleHRlbnNpb24uXG4gICAqIElmIGBtdWx0aXBsZWAgaXMgc2V0IHRvIGZhbHNlIGFuZCBhZGRpdGlvbmFsIGZpbGVzIGFyZSBkcm9wcGVkLFxuICAgKiBhbGwgZmlsZXMgYmVzaWRlcyB0aGUgZmlyc3Qgd2lsbCBiZSByZWplY3RlZC5cbiAgICogQW55IGZpbGUgd2hpY2ggZG9lcyBub3QgaGF2ZSBhIHNpemUgaW4gdGhlIFtgbWluU2l6ZWAsIGBtYXhTaXplYF0gcmFuZ2UsIHdpbGwgYmUgcmVqZWN0ZWQgYXMgd2VsbC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBgb25Ecm9wYCBjYWxsYmFjayB3aWxsIGFsd2F5cyBiZSBpbnZva2VkIHJlZ2FyZGxlc3MgaWYgdGhlIGRyb3BwZWQgZmlsZXMgd2VyZSBhY2NlcHRlZCBvciByZWplY3RlZC5cbiAgICogSWYgeW91J2QgbGlrZSB0byByZWFjdCB0byBhIHNwZWNpZmljIHNjZW5hcmlvLCB1c2UgdGhlIGBvbkRyb3BBY2NlcHRlZGAvYG9uRHJvcFJlamVjdGVkYCBwcm9wcy5cbiAgICpcbiAgICogYG9uRHJvcGAgd2lsbCBwcm92aWRlIHlvdSB3aXRoIGFuIGFycmF5IG9mIFtGaWxlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZSkgb2JqZWN0cyB3aGljaCB5b3UgY2FuIHRoZW4gcHJvY2VzcyBhbmQgc2VuZCB0byBhIHNlcnZlci5cbiAgICogRm9yIGV4YW1wbGUsIHdpdGggW1N1cGVyQWdlbnRdKGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9zdXBlcmFnZW50KSBhcyBhIGh0dHAvYWpheCBsaWJyYXJ5OlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBmdW5jdGlvbiBvbkRyb3AoYWNjZXB0ZWRGaWxlcykge1xuICAgKiAgIGNvbnN0IHJlcSA9IHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gICAqICAgYWNjZXB0ZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgKiAgICAgcmVxLmF0dGFjaChmaWxlLm5hbWUsIGZpbGUpXG4gICAqICAgfSlcbiAgICogICByZXEuZW5kKGNhbGxiYWNrKVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge0ZpbGVbXX0gYWNjZXB0ZWRGaWxlc1xuICAgKiBAcGFyYW0ge0ZpbGVSZWplY3Rpb25bXX0gZmlsZVJlamVjdGlvbnNcbiAgICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICAgKi9cbiAgb25Ecm9wOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ2IgZm9yIHdoZW4gdGhlIGBkcm9wYCBldmVudCBvY2N1cnMuXG4gICAqIE5vdGUgdGhhdCBpZiBubyBmaWxlcyBhcmUgYWNjZXB0ZWQsIHRoaXMgY2FsbGJhY2sgaXMgbm90IGludm9rZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZVtdfSBmaWxlc1xuICAgKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudFxuICAgKi9cbiAgb25Ecm9wQWNjZXB0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKlxuICAgKiBDYiBmb3Igd2hlbiB0aGUgYGRyb3BgIGV2ZW50IG9jY3Vycy5cbiAgICogTm90ZSB0aGF0IGlmIG5vIGZpbGVzIGFyZSByZWplY3RlZCwgdGhpcyBjYWxsYmFjayBpcyBub3QgaW52b2tlZC5cbiAgICpcbiAgICogQHBhcmFtIHtGaWxlUmVqZWN0aW9uW119IGZpbGVSZWplY3Rpb25zXG4gICAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50XG4gICAqL1xuICBvbkRyb3BSZWplY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLyoqXG4gICAqIENiIGZvciB3aGVuIHRoZXJlJ3Mgc29tZSBlcnJvciBmcm9tIGFueSBvZiB0aGUgcHJvbWlzZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yXG4gICAqL1xuICBvbkVycm9yOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKipcbiAgICogQ3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb24uIEl0IG11c3QgcmV0dXJuIG51bGwgaWYgdGhlcmUncyBubyBlcnJvcnMuXG4gICAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICAgKiBAcmV0dXJucyB7RmlsZUVycm9yfEZpbGVFcnJvcltdfG51bGx9XG4gICAqL1xuICB2YWxpZGF0b3I6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRHJvcHpvbmU7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yIHRoZSBgZHJhZ2VudGVyYCxcbiAqIGBkcmFnb3ZlcmAgYW5kIGBkcmFnbGVhdmVgIGV2ZW50cy5cbiAqIEl0IGlzIG5vdCBpbnZva2VkIGlmIHRoZSBpdGVtcyBhcmUgbm90IGZpbGVzIChzdWNoIGFzIGxpbmssIHRleHQsIGV0Yy4pLlxuICpcbiAqIEBjYWxsYmFjayBkcmFnQ2JcbiAqIEBwYXJhbSB7RHJhZ0V2ZW50fSBldmVudFxuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yIHRoZSBgZHJvcGAgb3IgaW5wdXQgY2hhbmdlIGV2ZW50LlxuICogSXQgaXMgbm90IGludm9rZWQgaWYgdGhlIGl0ZW1zIGFyZSBub3QgZmlsZXMgKHN1Y2ggYXMgbGluaywgdGV4dCwgZXRjLikuXG4gKlxuICogQGNhbGxiYWNrIGRyb3BDYlxuICogQHBhcmFtIHtGaWxlW119IGFjY2VwdGVkRmlsZXMgTGlzdCBvZiBhY2NlcHRlZCBmaWxlc1xuICogQHBhcmFtIHtGaWxlUmVqZWN0aW9uW119IGZpbGVSZWplY3Rpb25zIExpc3Qgb2YgcmVqZWN0ZWQgZmlsZXMgYW5kIHdoeSB0aGV5IHdlcmUgcmVqZWN0ZWRcbiAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAqL1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIGZvciB0aGUgYGRyb3BgIG9yIGlucHV0IGNoYW5nZSBldmVudC5cbiAqIEl0IGlzIG5vdCBpbnZva2VkIGlmIHRoZSBpdGVtcyBhcmUgZmlsZXMgKHN1Y2ggYXMgbGluaywgdGV4dCwgZXRjLikuXG4gKlxuICogQGNhbGxiYWNrIGRyb3BBY2NlcHRlZENiXG4gKiBAcGFyYW0ge0ZpbGVbXX0gZmlsZXMgTGlzdCBvZiBhY2NlcHRlZCBmaWxlcyB0aGF0IG1lZXQgdGhlIGdpdmVuIGNyaXRlcmlhXG4gKiAoYGFjY2VwdGAsIGBtdWx0aXBsZWAsIGBtaW5TaXplYCwgYG1heFNpemVgKVxuICogQHBhcmFtIHsoRHJhZ0V2ZW50fEV2ZW50KX0gZXZlbnQgQSBkcmFnIGV2ZW50IG9yIGlucHV0IGNoYW5nZSBldmVudCAoaWYgZmlsZXMgd2VyZSBzZWxlY3RlZCB2aWEgdGhlIGZpbGUgZGlhbG9nKVxuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgZm9yIHRoZSBgZHJvcGAgb3IgaW5wdXQgY2hhbmdlIGV2ZW50LlxuICpcbiAqIEBjYWxsYmFjayBkcm9wUmVqZWN0ZWRDYlxuICogQHBhcmFtIHtGaWxlW119IGZpbGVzIExpc3Qgb2YgcmVqZWN0ZWQgZmlsZXMgdGhhdCBkbyBub3QgbWVldCB0aGUgZ2l2ZW4gY3JpdGVyaWFcbiAqIChgYWNjZXB0YCwgYG11bHRpcGxlYCwgYG1pblNpemVgLCBgbWF4U2l6ZWApXG4gKiBAcGFyYW0geyhEcmFnRXZlbnR8RXZlbnQpfSBldmVudCBBIGRyYWcgZXZlbnQgb3IgaW5wdXQgY2hhbmdlIGV2ZW50IChpZiBmaWxlcyB3ZXJlIHNlbGVjdGVkIHZpYSB0aGUgZmlsZSBkaWFsb2cpXG4gKi9cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBhZ2dyZWdhdGUgZmlsZXMsXG4gKiBpbiBhIGFzeW5jaHJvbm91cyBmYXNoaW9uLCBmcm9tIGRyYWcgb3IgaW5wdXQgY2hhbmdlIGV2ZW50cy5cbiAqXG4gKiBAY2FsbGJhY2sgZ2V0RmlsZXNGcm9tRXZlbnRcbiAqIEBwYXJhbSB7KERyYWdFdmVudHxFdmVudCl9IGV2ZW50IEEgZHJhZyBldmVudCBvciBpbnB1dCBjaGFuZ2UgZXZlbnQgKGlmIGZpbGVzIHdlcmUgc2VsZWN0ZWQgdmlhIHRoZSBmaWxlIGRpYWxvZylcbiAqIEByZXR1cm5zIHsoRmlsZVtdfFByb21pc2U8RmlsZVtdPil9XG4gKi9cblxuLyoqXG4gKiBBbiBvYmplY3Qgd2l0aCB0aGUgY3VycmVudCBkcm9wem9uZSBzdGF0ZS5cbiAqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBEcm9wem9uZVN0YXRlXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRm9jdXNlZCBEcm9wem9uZSBhcmVhIGlzIGluIGZvY3VzXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRmlsZURpYWxvZ0FjdGl2ZSBGaWxlIGRpYWxvZyBpcyBvcGVuZWRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNEcmFnQWN0aXZlIEFjdGl2ZSBkcmFnIGlzIGluIHByb2dyZXNzXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRHJhZ0FjY2VwdCBEcmFnZ2VkIGZpbGVzIGFyZSBhY2NlcHRlZFxuICogQHByb3BlcnR5IHtib29sZWFufSBpc0RyYWdSZWplY3QgU29tZSBkcmFnZ2VkIGZpbGVzIGFyZSByZWplY3RlZFxuICogQHByb3BlcnR5IHtGaWxlW119IGFjY2VwdGVkRmlsZXMgQWNjZXB0ZWQgZmlsZXNcbiAqIEBwcm9wZXJ0eSB7RmlsZVJlamVjdGlvbltdfSBmaWxlUmVqZWN0aW9ucyBSZWplY3RlZCBmaWxlcyBhbmQgd2h5IHRoZXkgd2VyZSByZWplY3RlZFxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IHdpdGggdGhlIGRyb3B6b25lIG1ldGhvZHMuXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gRHJvcHpvbmVNZXRob2RzXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRSb290UHJvcHMgUmV0dXJucyB0aGUgcHJvcHMgeW91IHNob3VsZCBhcHBseSB0byB0aGUgcm9vdCBkcm9wIGNvbnRhaW5lciB5b3UgcmVuZGVyXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRJbnB1dFByb3BzIFJldHVybnMgdGhlIHByb3BzIHlvdSBzaG91bGQgYXBwbHkgdG8gaGlkZGVuIGZpbGUgaW5wdXQgeW91IHJlbmRlclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3BlbiBPcGVuIHRoZSBuYXRpdmUgZmlsZSBzZWxlY3Rpb24gZGlhbG9nXG4gKi9cblxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICBpc0ZpbGVEaWFsb2dBY3RpdmU6IGZhbHNlLFxuICBpc0RyYWdBY3RpdmU6IGZhbHNlLFxuICBpc0RyYWdBY2NlcHQ6IGZhbHNlLFxuICBpc0RyYWdSZWplY3Q6IGZhbHNlLFxuICBhY2NlcHRlZEZpbGVzOiBbXSxcbiAgZmlsZVJlamVjdGlvbnM6IFtdLFxufTtcblxuLyoqXG4gKiBBIFJlYWN0IGhvb2sgdGhhdCBjcmVhdGVzIGEgZHJhZyAnbicgZHJvcCBhcmVhLlxuICpcbiAqIGBgYGpzeFxuICogZnVuY3Rpb24gTXlEcm9wem9uZShwcm9wcykge1xuICogICBjb25zdCB7Z2V0Um9vdFByb3BzLCBnZXRJbnB1dFByb3BzfSA9IHVzZURyb3B6b25lKHtcbiAqICAgICBvbkRyb3A6IGFjY2VwdGVkRmlsZXMgPT4ge1xuICogICAgICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIEZpbGUgb2JqZWN0cywgZS5nLiB1cGxvYWQgdG8gc29tZSBzZXJ2ZXJcbiAqICAgICB9XG4gKiAgIH0pO1xuICogICByZXR1cm4gKFxuICogICAgIDxkaXYgey4uLmdldFJvb3RQcm9wcygpfT5cbiAqICAgICAgIDxpbnB1dCB7Li4uZ2V0SW5wdXRQcm9wcygpfSAvPlxuICogICAgICAgPHA+RHJhZyBhbmQgZHJvcCBzb21lIGZpbGVzIGhlcmUsIG9yIGNsaWNrIHRvIHNlbGVjdCBmaWxlczwvcD5cbiAqICAgICA8L2Rpdj5cbiAqICAgKVxuICogfVxuICogYGBgXG4gKlxuICogQGZ1bmN0aW9uIHVzZURyb3B6b25lXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gKiBAcGFyYW0ge2ltcG9ydChcIi4vdXRpbHNcIikuQWNjZXB0UHJvcH0gW3Byb3BzLmFjY2VwdF0gU2V0IGFjY2VwdGVkIGZpbGUgdHlwZXMuXG4gKiBDaGVja291dCBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3Nob3dPcGVuRmlsZVBpY2tlciB0eXBlcyBvcHRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKiBLZWVwIGluIG1pbmQgdGhhdCBtaW1lIHR5cGUgZGV0ZXJtaW5hdGlvbiBpcyBub3QgcmVsaWFibGUgYWNyb3NzIHBsYXRmb3Jtcy4gQ1NWIGZpbGVzLFxuICogZm9yIGV4YW1wbGUsIGFyZSByZXBvcnRlZCBhcyB0ZXh0L3BsYWluIHVuZGVyIG1hY09TIGJ1dCBhcyBhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwgdW5kZXJcbiAqIFdpbmRvd3MuIEluIHNvbWUgY2FzZXMgdGhlcmUgbWlnaHQgbm90IGJlIGEgbWltZSB0eXBlIHNldCBhdCBhbGwgKGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdC1kcm9wem9uZS9yZWFjdC1kcm9wem9uZS9pc3N1ZXMvMjc2KS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm11bHRpcGxlPXRydWVdIEFsbG93IGRyYWcgJ24nIGRyb3AgKG9yIHNlbGVjdGlvbiBmcm9tIHRoZSBmaWxlIGRpYWxvZykgb2YgbXVsdGlwbGUgZmlsZXNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLnByZXZlbnREcm9wT25Eb2N1bWVudD10cnVlXSBJZiBmYWxzZSwgYWxsb3cgZHJvcHBlZCBpdGVtcyB0byB0YWtlIG92ZXIgdGhlIGN1cnJlbnQgYnJvd3NlciB3aW5kb3dcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm5vQ2xpY2s9ZmFsc2VdIElmIHRydWUsIGRpc2FibGVzIGNsaWNrIHRvIG9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2dcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm5vS2V5Ym9hcmQ9ZmFsc2VdIElmIHRydWUsIGRpc2FibGVzIFNQQUNFL0VOVEVSIHRvIG9wZW4gdGhlIG5hdGl2ZSBmaWxlIHNlbGVjdGlvbiBkaWFsb2cuXG4gKiBOb3RlIHRoYXQgaXQgYWxzbyBzdG9wcyB0cmFja2luZyB0aGUgZm9jdXMgc3RhdGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5ub0RyYWc9ZmFsc2VdIElmIHRydWUsIGRpc2FibGVzIGRyYWcgJ24nIGRyb3BcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLm5vRHJhZ0V2ZW50c0J1YmJsaW5nPWZhbHNlXSBJZiB0cnVlLCBzdG9wcyBkcmFnIGV2ZW50IHByb3BhZ2F0aW9uIHRvIHBhcmVudHNcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcHJvcHMubWluU2l6ZT0wXSBNaW5pbXVtIGZpbGUgc2l6ZSAoaW4gYnl0ZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gW3Byb3BzLm1heFNpemU9SW5maW5pdHldIE1heGltdW0gZmlsZSBzaXplIChpbiBieXRlcylcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BzLmRpc2FibGVkPWZhbHNlXSBFbmFibGUvZGlzYWJsZSB0aGUgZHJvcHpvbmVcbiAqIEBwYXJhbSB7Z2V0RmlsZXNGcm9tRXZlbnR9IFtwcm9wcy5nZXRGaWxlc0Zyb21FdmVudF0gVXNlIHRoaXMgdG8gcHJvdmlkZSBhIGN1c3RvbSBmaWxlIGFnZ3JlZ2F0b3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9wcy5vbkZpbGVEaWFsb2dDYW5jZWxdIENiIGZvciB3aGVuIGNsb3NpbmcgdGhlIGZpbGUgZGlhbG9nIHdpdGggbm8gc2VsZWN0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy51c2VGc0FjY2Vzc0FwaV0gU2V0IHRvIHRydWUgdG8gdXNlIHRoZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZV9TeXN0ZW1fQWNjZXNzX0FQSVxuICogdG8gb3BlbiB0aGUgZmlsZSBwaWNrZXIgaW5zdGVhZCBvZiB1c2luZyBhbiBgPGlucHV0IHR5cGU9XCJmaWxlXCI+YCBjbGljayBldmVudC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b0ZvY3VzIFNldCB0byB0cnVlIHRvIGF1dG8gZm9jdXMgdGhlIHJvb3QgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9wcy5vbkZpbGVEaWFsb2dPcGVuXSBDYiBmb3Igd2hlbiBvcGVuaW5nIHRoZSBmaWxlIGRpYWxvZ1xuICogQHBhcmFtIHtkcmFnQ2J9IFtwcm9wcy5vbkRyYWdFbnRlcl0gQ2IgZm9yIHdoZW4gdGhlIGBkcmFnZW50ZXJgIGV2ZW50IG9jY3Vycy5cbiAqIEBwYXJhbSB7ZHJhZ0NifSBbcHJvcHMub25EcmFnTGVhdmVdIENiIGZvciB3aGVuIHRoZSBgZHJhZ2xlYXZlYCBldmVudCBvY2N1cnNcbiAqIEBwYXJhbSB7ZHJhZ0NifSBbcHJvcHMub25EcmFnT3Zlcl0gQ2IgZm9yIHdoZW4gdGhlIGBkcmFnb3ZlcmAgZXZlbnQgb2NjdXJzXG4gKiBAcGFyYW0ge2Ryb3BDYn0gW3Byb3BzLm9uRHJvcF0gQ2IgZm9yIHdoZW4gdGhlIGBkcm9wYCBldmVudCBvY2N1cnMuXG4gKiBOb3RlIHRoYXQgdGhpcyBjYWxsYmFjayBpcyBpbnZva2VkIGFmdGVyIHRoZSBgZ2V0RmlsZXNGcm9tRXZlbnRgIGNhbGxiYWNrIGlzIGRvbmUuXG4gKlxuICogRmlsZXMgYXJlIGFjY2VwdGVkIG9yIHJlamVjdGVkIGJhc2VkIG9uIHRoZSBgYWNjZXB0YCwgYG11bHRpcGxlYCwgYG1pblNpemVgIGFuZCBgbWF4U2l6ZWAgcHJvcHMuXG4gKiBgYWNjZXB0YCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGtleXMgYXMgYSB2YWxpZCBbTUlNRSB0eXBlXShodHRwOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL21lZGlhLXR5cGVzL21lZGlhLXR5cGVzLnhodG1sKSBhY2NvcmRpbmcgdG8gW2lucHV0IGVsZW1lbnQgc3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly93d3cudzMub3JnL3dpa2kvSFRNTC9FbGVtZW50cy9pbnB1dC9maWxlKSBhbmQgdGhlIHZhbHVlIGFuIGFycmF5IG9mIGZpbGUgZXh0ZW5zaW9ucyAob3B0aW9uYWwpLlxuICogSWYgYG11bHRpcGxlYCBpcyBzZXQgdG8gZmFsc2UgYW5kIGFkZGl0aW9uYWwgZmlsZXMgYXJlIGRyb3BwZWQsXG4gKiBhbGwgZmlsZXMgYmVzaWRlcyB0aGUgZmlyc3Qgd2lsbCBiZSByZWplY3RlZC5cbiAqIEFueSBmaWxlIHdoaWNoIGRvZXMgbm90IGhhdmUgYSBzaXplIGluIHRoZSBbYG1pblNpemVgLCBgbWF4U2l6ZWBdIHJhbmdlLCB3aWxsIGJlIHJlamVjdGVkIGFzIHdlbGwuXG4gKlxuICogTm90ZSB0aGF0IHRoZSBgb25Ecm9wYCBjYWxsYmFjayB3aWxsIGFsd2F5cyBiZSBpbnZva2VkIHJlZ2FyZGxlc3MgaWYgdGhlIGRyb3BwZWQgZmlsZXMgd2VyZSBhY2NlcHRlZCBvciByZWplY3RlZC5cbiAqIElmIHlvdSdkIGxpa2UgdG8gcmVhY3QgdG8gYSBzcGVjaWZpYyBzY2VuYXJpbywgdXNlIHRoZSBgb25Ecm9wQWNjZXB0ZWRgL2BvbkRyb3BSZWplY3RlZGAgcHJvcHMuXG4gKlxuICogYG9uRHJvcGAgd2lsbCBwcm92aWRlIHlvdSB3aXRoIGFuIGFycmF5IG9mIFtGaWxlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZSkgb2JqZWN0cyB3aGljaCB5b3UgY2FuIHRoZW4gcHJvY2VzcyBhbmQgc2VuZCB0byBhIHNlcnZlci5cbiAqIEZvciBleGFtcGxlLCB3aXRoIFtTdXBlckFnZW50XShodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvc3VwZXJhZ2VudCkgYXMgYSBodHRwL2FqYXggbGlicmFyeTpcbiAqXG4gKiBgYGBqc1xuICogZnVuY3Rpb24gb25Ecm9wKGFjY2VwdGVkRmlsZXMpIHtcbiAqICAgY29uc3QgcmVxID0gcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgYWNjZXB0ZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICogICAgIHJlcS5hdHRhY2goZmlsZS5uYW1lLCBmaWxlKVxuICogICB9KVxuICogICByZXEuZW5kKGNhbGxiYWNrKVxuICogfVxuICogYGBgXG4gKiBAcGFyYW0ge2Ryb3BBY2NlcHRlZENifSBbcHJvcHMub25Ecm9wQWNjZXB0ZWRdXG4gKiBAcGFyYW0ge2Ryb3BSZWplY3RlZENifSBbcHJvcHMub25Ecm9wUmVqZWN0ZWRdXG4gKiBAcGFyYW0geyhlcnJvcjogRXJyb3IpID0+IHZvaWR9IFtwcm9wcy5vbkVycm9yXVxuICpcbiAqIEByZXR1cm5zIHtEcm9wem9uZVN0YXRlICYgRHJvcHpvbmVNZXRob2RzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlRHJvcHpvbmUocHJvcHMgPSB7fSkge1xuICBjb25zdCB7XG4gICAgYWNjZXB0LFxuICAgIGRpc2FibGVkLFxuICAgIGdldEZpbGVzRnJvbUV2ZW50LFxuICAgIG1heFNpemUsXG4gICAgbWluU2l6ZSxcbiAgICBtdWx0aXBsZSxcbiAgICBtYXhGaWxlcyxcbiAgICBvbkRyYWdFbnRlcixcbiAgICBvbkRyYWdMZWF2ZSxcbiAgICBvbkRyYWdPdmVyLFxuICAgIG9uRHJvcCxcbiAgICBvbkRyb3BBY2NlcHRlZCxcbiAgICBvbkRyb3BSZWplY3RlZCxcbiAgICBvbkZpbGVEaWFsb2dDYW5jZWwsXG4gICAgb25GaWxlRGlhbG9nT3BlbixcbiAgICB1c2VGc0FjY2Vzc0FwaSxcbiAgICBhdXRvRm9jdXMsXG4gICAgcHJldmVudERyb3BPbkRvY3VtZW50LFxuICAgIG5vQ2xpY2ssXG4gICAgbm9LZXlib2FyZCxcbiAgICBub0RyYWcsXG4gICAgbm9EcmFnRXZlbnRzQnViYmxpbmcsXG4gICAgb25FcnJvcixcbiAgICB2YWxpZGF0b3IsXG4gIH0gPSB7XG4gICAgLi4uZGVmYXVsdFByb3BzLFxuICAgIC4uLnByb3BzLFxuICB9O1xuXG4gIGNvbnN0IGFjY2VwdEF0dHIgPSB1c2VNZW1vKCgpID0+IGFjY2VwdFByb3BBc0FjY2VwdEF0dHIoYWNjZXB0KSwgW2FjY2VwdF0pO1xuICBjb25zdCBwaWNrZXJUeXBlcyA9IHVzZU1lbW8oKCkgPT4gcGlja2VyT3B0aW9uc0Zyb21BY2NlcHQoYWNjZXB0KSwgW2FjY2VwdF0pO1xuXG4gIGNvbnN0IG9uRmlsZURpYWxvZ09wZW5DYiA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHR5cGVvZiBvbkZpbGVEaWFsb2dPcGVuID09PSBcImZ1bmN0aW9uXCIgPyBvbkZpbGVEaWFsb2dPcGVuIDogbm9vcCksXG4gICAgW29uRmlsZURpYWxvZ09wZW5dXG4gICk7XG4gIGNvbnN0IG9uRmlsZURpYWxvZ0NhbmNlbENiID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgdHlwZW9mIG9uRmlsZURpYWxvZ0NhbmNlbCA9PT0gXCJmdW5jdGlvblwiID8gb25GaWxlRGlhbG9nQ2FuY2VsIDogbm9vcCxcbiAgICBbb25GaWxlRGlhbG9nQ2FuY2VsXVxuICApO1xuXG4gIC8qKlxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge1JlYWN0Lk11dGFibGVSZWZPYmplY3Q8SFRNTEVsZW1lbnQ+fVxuICAgKi9cbiAgY29uc3Qgcm9vdFJlZiA9IHVzZVJlZihudWxsKTtcblxuICBjb25zdCBpbnB1dFJlZiA9IHVzZVJlZihudWxsKTtcblxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcbiAgY29uc3QgeyBpc0ZvY3VzZWQsIGlzRmlsZURpYWxvZ0FjdGl2ZSB9ID0gc3RhdGU7XG5cbiAgY29uc3QgZnNBY2Nlc3NBcGlXb3Jrc1JlZiA9IHVzZVJlZihcbiAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICB3aW5kb3cuaXNTZWN1cmVDb250ZXh0ICYmXG4gICAgICB1c2VGc0FjY2Vzc0FwaSAmJlxuICAgICAgY2FuVXNlRmlsZVN5c3RlbUFjY2Vzc0FQSSgpXG4gICk7XG5cbiAgLy8gVXBkYXRlIGZpbGUgZGlhbG9nIGFjdGl2ZSBzdGF0ZSB3aGVuIHRoZSB3aW5kb3cgaXMgZm9jdXNlZCBvblxuICBjb25zdCBvbldpbmRvd0ZvY3VzID0gKCkgPT4ge1xuICAgIC8vIEV4ZWN1dGUgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZmlsZSBkaWFsb2cgaXMgb3BlbmVkIGluIHRoZSBicm93c2VyXG4gICAgaWYgKCFmc0FjY2Vzc0FwaVdvcmtzUmVmLmN1cnJlbnQgJiYgaXNGaWxlRGlhbG9nQWN0aXZlKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGlucHV0UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICBjb25zdCB7IGZpbGVzIH0gPSBpbnB1dFJlZi5jdXJyZW50O1xuXG4gICAgICAgICAgaWYgKCFmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogXCJjbG9zZURpYWxvZ1wiIH0pO1xuICAgICAgICAgICAgb25GaWxlRGlhbG9nQ2FuY2VsQ2IoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDMwMCk7XG4gICAgfVxuICB9O1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgb25XaW5kb3dGb2N1cywgZmFsc2UpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIG9uV2luZG93Rm9jdXMsIGZhbHNlKTtcbiAgICB9O1xuICB9LCBbaW5wdXRSZWYsIGlzRmlsZURpYWxvZ0FjdGl2ZSwgb25GaWxlRGlhbG9nQ2FuY2VsQ2IsIGZzQWNjZXNzQXBpV29ya3NSZWZdKTtcblxuICBjb25zdCBkcmFnVGFyZ2V0c1JlZiA9IHVzZVJlZihbXSk7XG4gIGNvbnN0IG9uRG9jdW1lbnREcm9wID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKHJvb3RSZWYuY3VycmVudCAmJiByb290UmVmLmN1cnJlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgLy8gSWYgd2UgaW50ZXJjZXB0ZWQgYW4gZXZlbnQgZm9yIG91ciBpbnN0YW5jZSwgbGV0IGl0IHByb3BhZ2F0ZSBkb3duIHRvIHRoZSBpbnN0YW5jZSdzIG9uRHJvcCBoYW5kbGVyXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IFtdO1xuICB9O1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHByZXZlbnREcm9wT25Eb2N1bWVudCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIG9uRG9jdW1lbnREcmFnT3ZlciwgZmFsc2UpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgb25Eb2N1bWVudERyb3AsIGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHByZXZlbnREcm9wT25Eb2N1bWVudCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgb25Eb2N1bWVudERyYWdPdmVyKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgb25Eb2N1bWVudERyb3ApO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtyb290UmVmLCBwcmV2ZW50RHJvcE9uRG9jdW1lbnRdKTtcblxuICAvLyBBdXRvIGZvY3VzIHRoZSByb290IHdoZW4gYXV0b0ZvY3VzIGlzIHRydWVcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWRpc2FibGVkICYmIGF1dG9Gb2N1cyAmJiByb290UmVmLmN1cnJlbnQpIHtcbiAgICAgIHJvb3RSZWYuY3VycmVudC5mb2N1cygpO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4ge307XG4gIH0sIFtyb290UmVmLCBhdXRvRm9jdXMsIGRpc2FibGVkXSk7XG5cbiAgY29uc3Qgb25FcnJDYiA9IHVzZUNhbGxiYWNrKFxuICAgIChlKSA9PiB7XG4gICAgICBpZiAob25FcnJvcikge1xuICAgICAgICBvbkVycm9yKGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTGV0IHRoZSB1c2VyIGtub3cgc29tZXRoaW5nJ3MgZ29uZSB3cm9uZyBpZiB0aGV5IGhhdmVuJ3QgcHJvdmlkZWQgdGhlIG9uRXJyb3IgY2IuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbb25FcnJvcl1cbiAgKTtcblxuICBjb25zdCBvbkRyYWdFbnRlckNiID0gdXNlQ2FsbGJhY2soXG4gICAgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gUGVyc2lzdCBoZXJlIGJlY2F1c2Ugd2UgbmVlZCB0aGUgZXZlbnQgbGF0ZXIgYWZ0ZXIgZ2V0RmlsZXNGcm9tRXZlbnQoKSBpcyBkb25lXG4gICAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgICBzdG9wUHJvcGFnYXRpb24oZXZlbnQpO1xuXG4gICAgICBkcmFnVGFyZ2V0c1JlZi5jdXJyZW50ID0gWy4uLmRyYWdUYXJnZXRzUmVmLmN1cnJlbnQsIGV2ZW50LnRhcmdldF07XG5cbiAgICAgIGlmIChpc0V2dFdpdGhGaWxlcyhldmVudCkpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGdldEZpbGVzRnJvbUV2ZW50KGV2ZW50KSlcbiAgICAgICAgICAudGhlbigoZmlsZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChpc1Byb3BhZ2F0aW9uU3RvcHBlZChldmVudCkgJiYgIW5vRHJhZ0V2ZW50c0J1YmJsaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlsZUNvdW50ID0gZmlsZXMubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgaXNEcmFnQWNjZXB0ID1cbiAgICAgICAgICAgICAgZmlsZUNvdW50ID4gMCAmJlxuICAgICAgICAgICAgICBhbGxGaWxlc0FjY2VwdGVkKHtcbiAgICAgICAgICAgICAgICBmaWxlcyxcbiAgICAgICAgICAgICAgICBhY2NlcHQ6IGFjY2VwdEF0dHIsXG4gICAgICAgICAgICAgICAgbWluU2l6ZSxcbiAgICAgICAgICAgICAgICBtYXhTaXplLFxuICAgICAgICAgICAgICAgIG11bHRpcGxlLFxuICAgICAgICAgICAgICAgIG1heEZpbGVzLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRvcixcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBpc0RyYWdSZWplY3QgPSBmaWxlQ291bnQgPiAwICYmICFpc0RyYWdBY2NlcHQ7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgaXNEcmFnQWNjZXB0LFxuICAgICAgICAgICAgICBpc0RyYWdSZWplY3QsXG4gICAgICAgICAgICAgIGlzRHJhZ0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdHlwZTogXCJzZXREcmFnZ2VkRmlsZXNcIixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAob25EcmFnRW50ZXIpIHtcbiAgICAgICAgICAgICAgb25EcmFnRW50ZXIoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlKSA9PiBvbkVyckNiKGUpKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtcbiAgICAgIGdldEZpbGVzRnJvbUV2ZW50LFxuICAgICAgb25EcmFnRW50ZXIsXG4gICAgICBvbkVyckNiLFxuICAgICAgbm9EcmFnRXZlbnRzQnViYmxpbmcsXG4gICAgICBhY2NlcHRBdHRyLFxuICAgICAgbWluU2l6ZSxcbiAgICAgIG1heFNpemUsXG4gICAgICBtdWx0aXBsZSxcbiAgICAgIG1heEZpbGVzLFxuICAgICAgdmFsaWRhdG9yLFxuICAgIF1cbiAgKTtcblxuICBjb25zdCBvbkRyYWdPdmVyQ2IgPSB1c2VDYWxsYmFjayhcbiAgICAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgICBzdG9wUHJvcGFnYXRpb24oZXZlbnQpO1xuXG4gICAgICBjb25zdCBoYXNGaWxlcyA9IGlzRXZ0V2l0aEZpbGVzKGV2ZW50KTtcbiAgICAgIGlmIChoYXNGaWxlcyAmJiBldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuICAgICAgICB9IGNhdGNoIHt9IC8qIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZW1wdHkgKi9cbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0ZpbGVzICYmIG9uRHJhZ092ZXIpIHtcbiAgICAgICAgb25EcmFnT3ZlcihldmVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFtvbkRyYWdPdmVyLCBub0RyYWdFdmVudHNCdWJibGluZ11cbiAgKTtcblxuICBjb25zdCBvbkRyYWdMZWF2ZUNiID0gdXNlQ2FsbGJhY2soXG4gICAgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgc3RvcFByb3BhZ2F0aW9uKGV2ZW50KTtcblxuICAgICAgLy8gT25seSBkZWFjdGl2YXRlIG9uY2UgdGhlIGRyb3B6b25lIGFuZCBhbGwgY2hpbGRyZW4gaGF2ZSBiZWVuIGxlZnRcbiAgICAgIGNvbnN0IHRhcmdldHMgPSBkcmFnVGFyZ2V0c1JlZi5jdXJyZW50LmZpbHRlcihcbiAgICAgICAgKHRhcmdldCkgPT4gcm9vdFJlZi5jdXJyZW50ICYmIHJvb3RSZWYuY3VycmVudC5jb250YWlucyh0YXJnZXQpXG4gICAgICApO1xuICAgICAgLy8gTWFrZSBzdXJlIHRvIHJlbW92ZSBhIHRhcmdldCBwcmVzZW50IG11bHRpcGxlIHRpbWVzIG9ubHkgb25jZVxuICAgICAgLy8gKEZpcmVmb3ggbWF5IGZpcmUgZHJhZ2VudGVyL2RyYWdsZWF2ZSBtdWx0aXBsZSB0aW1lcyBvbiB0aGUgc2FtZSBlbGVtZW50KVxuICAgICAgY29uc3QgdGFyZ2V0SWR4ID0gdGFyZ2V0cy5pbmRleE9mKGV2ZW50LnRhcmdldCk7XG4gICAgICBpZiAodGFyZ2V0SWR4ICE9PSAtMSkge1xuICAgICAgICB0YXJnZXRzLnNwbGljZSh0YXJnZXRJZHgsIDEpO1xuICAgICAgfVxuICAgICAgZHJhZ1RhcmdldHNSZWYuY3VycmVudCA9IHRhcmdldHM7XG4gICAgICBpZiAodGFyZ2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBcInNldERyYWdnZWRGaWxlc1wiLFxuICAgICAgICBpc0RyYWdBY3RpdmU6IGZhbHNlLFxuICAgICAgICBpc0RyYWdBY2NlcHQ6IGZhbHNlLFxuICAgICAgICBpc0RyYWdSZWplY3Q6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc0V2dFdpdGhGaWxlcyhldmVudCkgJiYgb25EcmFnTGVhdmUpIHtcbiAgICAgICAgb25EcmFnTGVhdmUoZXZlbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3Jvb3RSZWYsIG9uRHJhZ0xlYXZlLCBub0RyYWdFdmVudHNCdWJibGluZ11cbiAgKTtcblxuICBjb25zdCBzZXRGaWxlcyA9IHVzZUNhbGxiYWNrKFxuICAgIChmaWxlcywgZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGFjY2VwdGVkRmlsZXMgPSBbXTtcbiAgICAgIGNvbnN0IGZpbGVSZWplY3Rpb25zID0gW107XG5cbiAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgY29uc3QgW2FjY2VwdGVkLCBhY2NlcHRFcnJvcl0gPSBmaWxlQWNjZXB0ZWQoZmlsZSwgYWNjZXB0QXR0cik7XG4gICAgICAgIGNvbnN0IFtzaXplTWF0Y2gsIHNpemVFcnJvcl0gPSBmaWxlTWF0Y2hTaXplKGZpbGUsIG1pblNpemUsIG1heFNpemUpO1xuICAgICAgICBjb25zdCBjdXN0b21FcnJvcnMgPSB2YWxpZGF0b3IgPyB2YWxpZGF0b3IoZmlsZSkgOiBudWxsO1xuXG4gICAgICAgIGlmIChhY2NlcHRlZCAmJiBzaXplTWF0Y2ggJiYgIWN1c3RvbUVycm9ycykge1xuICAgICAgICAgIGFjY2VwdGVkRmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgZXJyb3JzID0gW2FjY2VwdEVycm9yLCBzaXplRXJyb3JdO1xuXG4gICAgICAgICAgaWYgKGN1c3RvbUVycm9ycykge1xuICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzLmNvbmNhdChjdXN0b21FcnJvcnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZpbGVSZWplY3Rpb25zLnB1c2goeyBmaWxlLCBlcnJvcnM6IGVycm9ycy5maWx0ZXIoKGUpID0+IGUpIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKFxuICAgICAgICAoIW11bHRpcGxlICYmIGFjY2VwdGVkRmlsZXMubGVuZ3RoID4gMSkgfHxcbiAgICAgICAgKG11bHRpcGxlICYmIG1heEZpbGVzID49IDEgJiYgYWNjZXB0ZWRGaWxlcy5sZW5ndGggPiBtYXhGaWxlcylcbiAgICAgICkge1xuICAgICAgICAvLyBSZWplY3QgZXZlcnl0aGluZyBhbmQgZW1wdHkgYWNjZXB0ZWQgZmlsZXNcbiAgICAgICAgYWNjZXB0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgICAgZmlsZVJlamVjdGlvbnMucHVzaCh7IGZpbGUsIGVycm9yczogW1RPT19NQU5ZX0ZJTEVTX1JFSkVDVElPTl0gfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhY2NlcHRlZEZpbGVzLnNwbGljZSgwKTtcbiAgICAgIH1cblxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICBhY2NlcHRlZEZpbGVzLFxuICAgICAgICBmaWxlUmVqZWN0aW9ucyxcbiAgICAgICAgdHlwZTogXCJzZXRGaWxlc1wiLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChvbkRyb3ApIHtcbiAgICAgICAgb25Ecm9wKGFjY2VwdGVkRmlsZXMsIGZpbGVSZWplY3Rpb25zLCBldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlUmVqZWN0aW9ucy5sZW5ndGggPiAwICYmIG9uRHJvcFJlamVjdGVkKSB7XG4gICAgICAgIG9uRHJvcFJlamVjdGVkKGZpbGVSZWplY3Rpb25zLCBldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhY2NlcHRlZEZpbGVzLmxlbmd0aCA+IDAgJiYgb25Ecm9wQWNjZXB0ZWQpIHtcbiAgICAgICAgb25Ecm9wQWNjZXB0ZWQoYWNjZXB0ZWRGaWxlcywgZXZlbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW1xuICAgICAgZGlzcGF0Y2gsXG4gICAgICBtdWx0aXBsZSxcbiAgICAgIGFjY2VwdEF0dHIsXG4gICAgICBtaW5TaXplLFxuICAgICAgbWF4U2l6ZSxcbiAgICAgIG1heEZpbGVzLFxuICAgICAgb25Ecm9wLFxuICAgICAgb25Ecm9wQWNjZXB0ZWQsXG4gICAgICBvbkRyb3BSZWplY3RlZCxcbiAgICAgIHZhbGlkYXRvcixcbiAgICBdXG4gICk7XG5cbiAgY29uc3Qgb25Ecm9wQ2IgPSB1c2VDYWxsYmFjayhcbiAgICAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBQZXJzaXN0IGhlcmUgYmVjYXVzZSB3ZSBuZWVkIHRoZSBldmVudCBsYXRlciBhZnRlciBnZXRGaWxlc0Zyb21FdmVudCgpIGlzIGRvbmVcbiAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAgIHN0b3BQcm9wYWdhdGlvbihldmVudCk7XG5cbiAgICAgIGRyYWdUYXJnZXRzUmVmLmN1cnJlbnQgPSBbXTtcblxuICAgICAgaWYgKGlzRXZ0V2l0aEZpbGVzKGV2ZW50KSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoZ2V0RmlsZXNGcm9tRXZlbnQoZXZlbnQpKVxuICAgICAgICAgIC50aGVuKChmaWxlcykgPT4ge1xuICAgICAgICAgICAgaWYgKGlzUHJvcGFnYXRpb25TdG9wcGVkKGV2ZW50KSAmJiAhbm9EcmFnRXZlbnRzQnViYmxpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0RmlsZXMoZmlsZXMsIGV2ZW50KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZSkgPT4gb25FcnJDYihlKSk7XG4gICAgICB9XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IFwicmVzZXRcIiB9KTtcbiAgICB9LFxuICAgIFtnZXRGaWxlc0Zyb21FdmVudCwgc2V0RmlsZXMsIG9uRXJyQ2IsIG5vRHJhZ0V2ZW50c0J1YmJsaW5nXVxuICApO1xuXG4gIC8vIEZuIGZvciBvcGVuaW5nIHRoZSBmaWxlIGRpYWxvZyBwcm9ncmFtbWF0aWNhbGx5XG4gIGNvbnN0IG9wZW5GaWxlRGlhbG9nID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIC8vIE5vIHBvaW50IHRvIHVzZSBGUyBhY2Nlc3MgQVBJcyBpZiBjb250ZXh0IGlzIG5vdCBzZWN1cmVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TZWN1cml0eS9TZWN1cmVfQ29udGV4dHMjZmVhdHVyZV9kZXRlY3Rpb25cbiAgICBpZiAoZnNBY2Nlc3NBcGlXb3Jrc1JlZi5jdXJyZW50KSB7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IFwib3BlbkRpYWxvZ1wiIH0pO1xuICAgICAgb25GaWxlRGlhbG9nT3BlbkNiKCk7XG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvd2luZG93L3Nob3dPcGVuRmlsZVBpY2tlclxuICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgbXVsdGlwbGUsXG4gICAgICAgIHR5cGVzOiBwaWNrZXJUeXBlcyxcbiAgICAgIH07XG4gICAgICB3aW5kb3dcbiAgICAgICAgLnNob3dPcGVuRmlsZVBpY2tlcihvcHRzKVxuICAgICAgICAudGhlbigoaGFuZGxlcykgPT4gZ2V0RmlsZXNGcm9tRXZlbnQoaGFuZGxlcykpXG4gICAgICAgIC50aGVuKChmaWxlcykgPT4ge1xuICAgICAgICAgIHNldEZpbGVzKGZpbGVzLCBudWxsKTtcbiAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFwiY2xvc2VEaWFsb2dcIiB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgLy8gQWJvcnRFcnJvciBtZWFucyB0aGUgdXNlciBjYW5jZWxlZFxuICAgICAgICAgIGlmIChpc0Fib3J0KGUpKSB7XG4gICAgICAgICAgICBvbkZpbGVEaWFsb2dDYW5jZWxDYihlKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogXCJjbG9zZURpYWxvZ1wiIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXNTZWN1cml0eUVycm9yKGUpKSB7XG4gICAgICAgICAgICBmc0FjY2Vzc0FwaVdvcmtzUmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIENPUlMsIHNvIGNhbm5vdCB1c2UgdGhpcyBBUElcbiAgICAgICAgICAgIC8vIFRyeSB1c2luZyB0aGUgaW5wdXRcbiAgICAgICAgICAgIGlmIChpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICAgIGlucHV0UmVmLmN1cnJlbnQudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICBpbnB1dFJlZi5jdXJyZW50LmNsaWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvbkVyckNiKFxuICAgICAgICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgIFwiQ2Fubm90IG9wZW4gdGhlIGZpbGUgcGlja2VyIGJlY2F1c2UgdGhlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GaWxlX1N5c3RlbV9BY2Nlc3NfQVBJIGlzIG5vdCBzdXBwb3J0ZWQgYW5kIG5vIDxpbnB1dD4gd2FzIHByb3ZpZGVkLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbkVyckNiKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlucHV0UmVmLmN1cnJlbnQpIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogXCJvcGVuRGlhbG9nXCIgfSk7XG4gICAgICBvbkZpbGVEaWFsb2dPcGVuQ2IoKTtcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQudmFsdWUgPSBudWxsO1xuICAgICAgaW5wdXRSZWYuY3VycmVudC5jbGljaygpO1xuICAgIH1cbiAgfSwgW1xuICAgIGRpc3BhdGNoLFxuICAgIG9uRmlsZURpYWxvZ09wZW5DYixcbiAgICBvbkZpbGVEaWFsb2dDYW5jZWxDYixcbiAgICB1c2VGc0FjY2Vzc0FwaSxcbiAgICBzZXRGaWxlcyxcbiAgICBvbkVyckNiLFxuICAgIHBpY2tlclR5cGVzLFxuICAgIG11bHRpcGxlLFxuICBdKTtcblxuICAvLyBDYiB0byBvcGVuIHRoZSBmaWxlIGRpYWxvZyB3aGVuIFNQQUNFL0VOVEVSIG9jY3VycyBvbiB0aGUgZHJvcHpvbmVcbiAgY29uc3Qgb25LZXlEb3duQ2IgPSB1c2VDYWxsYmFjayhcbiAgICAoZXZlbnQpID0+IHtcbiAgICAgIC8vIElnbm9yZSBrZXlib2FyZCBldmVudHMgYnViYmxpbmcgdXAgdGhlIERPTSB0cmVlXG4gICAgICBpZiAoIXJvb3RSZWYuY3VycmVudCB8fCAhcm9vdFJlZi5jdXJyZW50LmlzRXF1YWxOb2RlKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIGV2ZW50LmtleSA9PT0gXCIgXCIgfHxcbiAgICAgICAgZXZlbnQua2V5ID09PSBcIkVudGVyXCIgfHxcbiAgICAgICAgZXZlbnQua2V5Q29kZSA9PT0gMzIgfHxcbiAgICAgICAgZXZlbnQua2V5Q29kZSA9PT0gMTNcbiAgICAgICkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuRmlsZURpYWxvZygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3Jvb3RSZWYsIG9wZW5GaWxlRGlhbG9nXVxuICApO1xuXG4gIC8vIFVwZGF0ZSBmb2N1cyBzdGF0ZSBmb3IgdGhlIGRyb3B6b25lXG4gIGNvbnN0IG9uRm9jdXNDYiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IFwiZm9jdXNcIiB9KTtcbiAgfSwgW10pO1xuICBjb25zdCBvbkJsdXJDYiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IFwiYmx1clwiIH0pO1xuICB9LCBbXSk7XG5cbiAgLy8gQ2IgdG8gb3BlbiB0aGUgZmlsZSBkaWFsb2cgd2hlbiBjbGljayBvY2N1cnMgb24gdGhlIGRyb3B6b25lXG4gIGNvbnN0IG9uQ2xpY2tDYiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAobm9DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEluIElFMTEvRWRnZSB0aGUgZmlsZS1icm93c2VyIGRpYWxvZyBpcyBibG9ja2luZywgdGhlcmVmb3JlLCB1c2Ugc2V0VGltZW91dCgpXG4gICAgLy8gdG8gZW5zdXJlIFJlYWN0IGNhbiBoYW5kbGUgc3RhdGUgY2hhbmdlc1xuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0LWRyb3B6b25lL3JlYWN0LWRyb3B6b25lL2lzc3Vlcy80NTBcbiAgICBpZiAoaXNJZU9yRWRnZSgpKSB7XG4gICAgICBzZXRUaW1lb3V0KG9wZW5GaWxlRGlhbG9nLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3BlbkZpbGVEaWFsb2coKTtcbiAgICB9XG4gIH0sIFtub0NsaWNrLCBvcGVuRmlsZURpYWxvZ10pO1xuXG4gIGNvbnN0IGNvbXBvc2VIYW5kbGVyID0gKGZuKSA9PiB7XG4gICAgcmV0dXJuIGRpc2FibGVkID8gbnVsbCA6IGZuO1xuICB9O1xuXG4gIGNvbnN0IGNvbXBvc2VLZXlib2FyZEhhbmRsZXIgPSAoZm4pID0+IHtcbiAgICByZXR1cm4gbm9LZXlib2FyZCA/IG51bGwgOiBjb21wb3NlSGFuZGxlcihmbik7XG4gIH07XG5cbiAgY29uc3QgY29tcG9zZURyYWdIYW5kbGVyID0gKGZuKSA9PiB7XG4gICAgcmV0dXJuIG5vRHJhZyA/IG51bGwgOiBjb21wb3NlSGFuZGxlcihmbik7XG4gIH07XG5cbiAgY29uc3Qgc3RvcFByb3BhZ2F0aW9uID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKG5vRHJhZ0V2ZW50c0J1YmJsaW5nKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZ2V0Um9vdFByb3BzID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgKHtcbiAgICAgICAgcmVmS2V5ID0gXCJyZWZcIixcbiAgICAgICAgcm9sZSxcbiAgICAgICAgb25LZXlEb3duLFxuICAgICAgICBvbkZvY3VzLFxuICAgICAgICBvbkJsdXIsXG4gICAgICAgIG9uQ2xpY2ssXG4gICAgICAgIG9uRHJhZ0VudGVyLFxuICAgICAgICBvbkRyYWdPdmVyLFxuICAgICAgICBvbkRyYWdMZWF2ZSxcbiAgICAgICAgb25Ecm9wLFxuICAgICAgICAuLi5yZXN0XG4gICAgICB9ID0ge30pID0+ICh7XG4gICAgICAgIG9uS2V5RG93bjogY29tcG9zZUtleWJvYXJkSGFuZGxlcihcbiAgICAgICAgICBjb21wb3NlRXZlbnRIYW5kbGVycyhvbktleURvd24sIG9uS2V5RG93bkNiKVxuICAgICAgICApLFxuICAgICAgICBvbkZvY3VzOiBjb21wb3NlS2V5Ym9hcmRIYW5kbGVyKFxuICAgICAgICAgIGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uRm9jdXMsIG9uRm9jdXNDYilcbiAgICAgICAgKSxcbiAgICAgICAgb25CbHVyOiBjb21wb3NlS2V5Ym9hcmRIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uQmx1ciwgb25CbHVyQ2IpKSxcbiAgICAgICAgb25DbGljazogY29tcG9zZUhhbmRsZXIoY29tcG9zZUV2ZW50SGFuZGxlcnMob25DbGljaywgb25DbGlja0NiKSksXG4gICAgICAgIG9uRHJhZ0VudGVyOiBjb21wb3NlRHJhZ0hhbmRsZXIoXG4gICAgICAgICAgY29tcG9zZUV2ZW50SGFuZGxlcnMob25EcmFnRW50ZXIsIG9uRHJhZ0VudGVyQ2IpXG4gICAgICAgICksXG4gICAgICAgIG9uRHJhZ092ZXI6IGNvbXBvc2VEcmFnSGFuZGxlcihcbiAgICAgICAgICBjb21wb3NlRXZlbnRIYW5kbGVycyhvbkRyYWdPdmVyLCBvbkRyYWdPdmVyQ2IpXG4gICAgICAgICksXG4gICAgICAgIG9uRHJhZ0xlYXZlOiBjb21wb3NlRHJhZ0hhbmRsZXIoXG4gICAgICAgICAgY29tcG9zZUV2ZW50SGFuZGxlcnMob25EcmFnTGVhdmUsIG9uRHJhZ0xlYXZlQ2IpXG4gICAgICAgICksXG4gICAgICAgIG9uRHJvcDogY29tcG9zZURyYWdIYW5kbGVyKGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uRHJvcCwgb25Ecm9wQ2IpKSxcbiAgICAgICAgcm9sZTogdHlwZW9mIHJvbGUgPT09IFwic3RyaW5nXCIgJiYgcm9sZSAhPT0gXCJcIiA/IHJvbGUgOiBcInByZXNlbnRhdGlvblwiLFxuICAgICAgICBbcmVmS2V5XTogcm9vdFJlZixcbiAgICAgICAgLi4uKCFkaXNhYmxlZCAmJiAhbm9LZXlib2FyZCA/IHsgdGFiSW5kZXg6IDAgfSA6IHt9KSxcbiAgICAgICAgLi4ucmVzdCxcbiAgICAgIH0pLFxuICAgIFtcbiAgICAgIHJvb3RSZWYsXG4gICAgICBvbktleURvd25DYixcbiAgICAgIG9uRm9jdXNDYixcbiAgICAgIG9uQmx1ckNiLFxuICAgICAgb25DbGlja0NiLFxuICAgICAgb25EcmFnRW50ZXJDYixcbiAgICAgIG9uRHJhZ092ZXJDYixcbiAgICAgIG9uRHJhZ0xlYXZlQ2IsXG4gICAgICBvbkRyb3BDYixcbiAgICAgIG5vS2V5Ym9hcmQsXG4gICAgICBub0RyYWcsXG4gICAgICBkaXNhYmxlZCxcbiAgICBdXG4gICk7XG5cbiAgY29uc3Qgb25JbnB1dEVsZW1lbnRDbGljayA9IHVzZUNhbGxiYWNrKChldmVudCkgPT4ge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgZ2V0SW5wdXRQcm9wcyA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgICh7IHJlZktleSA9IFwicmVmXCIsIG9uQ2hhbmdlLCBvbkNsaWNrLCAuLi5yZXN0IH0gPSB7fSkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dFByb3BzID0ge1xuICAgICAgICAgIGFjY2VwdDogYWNjZXB0QXR0cixcbiAgICAgICAgICBtdWx0aXBsZSxcbiAgICAgICAgICB0eXBlOiBcImZpbGVcIixcbiAgICAgICAgICBzdHlsZTogeyBkaXNwbGF5OiBcIm5vbmVcIiB9LFxuICAgICAgICAgIG9uQ2hhbmdlOiBjb21wb3NlSGFuZGxlcihjb21wb3NlRXZlbnRIYW5kbGVycyhvbkNoYW5nZSwgb25Ecm9wQ2IpKSxcbiAgICAgICAgICBvbkNsaWNrOiBjb21wb3NlSGFuZGxlcihcbiAgICAgICAgICAgIGNvbXBvc2VFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIG9uSW5wdXRFbGVtZW50Q2xpY2spXG4gICAgICAgICAgKSxcbiAgICAgICAgICB0YWJJbmRleDogLTEsXG4gICAgICAgICAgW3JlZktleV06IGlucHV0UmVmLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaW5wdXRQcm9wcyxcbiAgICAgICAgICAuLi5yZXN0LFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICBbaW5wdXRSZWYsIGFjY2VwdCwgbXVsdGlwbGUsIG9uRHJvcENiLCBkaXNhYmxlZF1cbiAgKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGlzRm9jdXNlZDogaXNGb2N1c2VkICYmICFkaXNhYmxlZCxcbiAgICBnZXRSb290UHJvcHMsXG4gICAgZ2V0SW5wdXRQcm9wcyxcbiAgICByb290UmVmLFxuICAgIGlucHV0UmVmLFxuICAgIG9wZW46IGNvbXBvc2VIYW5kbGVyKG9wZW5GaWxlRGlhbG9nKSxcbiAgfTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Ryb3B6b25lU3RhdGV9IHN0YXRlXG4gKiBAcGFyYW0ge3t0eXBlOiBzdHJpbmd9ICYgRHJvcHpvbmVTdGF0ZX0gYWN0aW9uXG4gKiBAcmV0dXJucyB7RHJvcHpvbmVTdGF0ZX1cbiAqL1xuZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIFwiZm9jdXNcIjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBpc0ZvY3VzZWQ6IHRydWUsXG4gICAgICB9O1xuICAgIGNhc2UgXCJibHVyXCI6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgICAgIH07XG4gICAgY2FzZSBcIm9wZW5EaWFsb2dcIjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmluaXRpYWxTdGF0ZSxcbiAgICAgICAgaXNGaWxlRGlhbG9nQWN0aXZlOiB0cnVlLFxuICAgICAgfTtcbiAgICBjYXNlIFwiY2xvc2VEaWFsb2dcIjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBpc0ZpbGVEaWFsb2dBY3RpdmU6IGZhbHNlLFxuICAgICAgfTtcbiAgICBjYXNlIFwic2V0RHJhZ2dlZEZpbGVzXCI6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaXNEcmFnQWN0aXZlOiBhY3Rpb24uaXNEcmFnQWN0aXZlLFxuICAgICAgICBpc0RyYWdBY2NlcHQ6IGFjdGlvbi5pc0RyYWdBY2NlcHQsXG4gICAgICAgIGlzRHJhZ1JlamVjdDogYWN0aW9uLmlzRHJhZ1JlamVjdCxcbiAgICAgIH07XG4gICAgY2FzZSBcInNldEZpbGVzXCI6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgYWNjZXB0ZWRGaWxlczogYWN0aW9uLmFjY2VwdGVkRmlsZXMsXG4gICAgICAgIGZpbGVSZWplY3Rpb25zOiBhY3Rpb24uZmlsZVJlamVjdGlvbnMsXG4gICAgICB9O1xuICAgIGNhc2UgXCJyZXNldFwiOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uaW5pdGlhbFN0YXRlLFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5leHBvcnQgeyBFcnJvckNvZGUgfSBmcm9tIFwiLi91dGlsc1wiO1xuIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwidmFsdWUiLCJzdGVwIiwibmV4dCIsImUiLCJyZWplY3RlZCIsInJlc3VsdCIsImRvbmUiLCJ0aGVuIiwiYXBwbHkiLCJfX2dlbmVyYXRvciIsImJvZHkiLCJmIiwieSIsInQiLCJnIiwiXyIsImxhYmVsIiwic2VudCIsInRyeXMiLCJvcHMiLCJ2ZXJiIiwidGhyb3ciLCJyZXR1cm4iLCJTeW1ib2wiLCJpdGVyYXRvciIsInRoaXMiLCJuIiwidiIsIm9wIiwiVHlwZUVycm9yIiwiY2FsbCIsInBvcCIsImxlbmd0aCIsInB1c2giLCJfX3JlYWQiLCJvIiwibSIsInIiLCJpIiwiYXIiLCJlcnJvciIsIl9fc3ByZWFkQXJyYXkiLCJ0byIsImZyb20iLCJwYWNrIiwiYXJndW1lbnRzIiwibCIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJDT01NT05fTUlNRV9UWVBFUyIsIk1hcCIsInRvRmlsZVdpdGhQYXRoIiwiZmlsZSIsInBhdGgiLCJuYW1lIiwibGFzdEluZGV4T2YiLCJ0eXBlIiwiZXh0Iiwic3BsaXQiLCJ0b0xvd2VyQ2FzZSIsImdldCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwid2l0aE1pbWVUeXBlIiwid2Via2l0UmVsYXRpdmVQYXRoIiwiRklMRVNfVE9fSUdOT1JFIiwiaXNPYmplY3QiLCJnZXRJbnB1dEZpbGVzIiwiZXZ0IiwiZnJvbUxpc3QiLCJ0YXJnZXQiLCJmaWxlcyIsIm1hcCIsImdldEZzSGFuZGxlRmlsZXMiLCJoYW5kbGVzIiwiX2EiLCJhbGwiLCJoIiwiZ2V0RmlsZSIsImdldERhdGFUcmFuc2ZlckZpbGVzIiwiZHQiLCJpdGVtcyIsImZpbHRlciIsIml0ZW0iLCJraW5kIiwidG9GaWxlUHJvbWlzZXMiLCJub0lnbm9yZWRGaWxlcyIsImZsYXR0ZW4iLCJpbmRleE9mIiwid2Via2l0R2V0QXNFbnRyeSIsImZyb21EYXRhVHJhbnNmZXJJdGVtIiwiZW50cnkiLCJpc0RpcmVjdG9yeSIsImZyb21EaXJFbnRyeSIsInJlZHVjZSIsImFjYyIsImlzQXJyYXkiLCJnZXRBc0ZpbGUiLCJmd3AiLCJmcm9tRW50cnkiLCJmcm9tRmlsZUVudHJ5IiwicmVhZGVyIiwiY3JlYXRlUmVhZGVyIiwiZW50cmllcyIsInJlYWRFbnRyaWVzIiwiX3RoaXMiLCJiYXRjaCIsImVycl8xIiwiZXJyIiwiZnVsbFBhdGgiLCJGSUxFX0lOVkFMSURfVFlQRSIsIkZJTEVfVE9PX0xBUkdFIiwiRklMRV9UT09fU01BTEwiLCJUT09fTUFOWV9GSUxFUyIsIkVycm9yQ29kZSIsIkZpbGVJbnZhbGlkVHlwZSIsIkZpbGVUb29MYXJnZSIsIkZpbGVUb29TbWFsbCIsIlRvb01hbnlGaWxlcyIsImdldEludmFsaWRUeXBlUmVqZWN0aW9uRXJyIiwiYWNjZXB0IiwibWVzc2FnZVN1ZmZpeCIsImpvaW4iLCJjb2RlIiwibWVzc2FnZSIsImdldFRvb0xhcmdlUmVqZWN0aW9uRXJyIiwibWF4U2l6ZSIsImdldFRvb1NtYWxsUmVqZWN0aW9uRXJyIiwibWluU2l6ZSIsIlRPT19NQU5ZX0ZJTEVTX1JFSkVDVElPTiIsImZpbGVBY2NlcHRlZCIsImlzQWNjZXB0YWJsZSIsImFjY2VwdGVkRmlsZXMiLCJhY2NlcHRlZEZpbGVzQXJyYXkiLCJmaWxlTmFtZSIsIm1pbWVUeXBlIiwiYmFzZU1pbWVUeXBlIiwicmVwbGFjZSIsInNvbWUiLCJ2YWxpZFR5cGUiLCJ0cmltIiwiY2hhckF0IiwiZW5kc1dpdGgiLCJhY2NlcHRzIiwiZmlsZU1hdGNoU2l6ZSIsImlzRGVmaW5lZCIsInNpemUiLCJhbGxGaWxlc0FjY2VwdGVkIiwibXVsdGlwbGUiLCJtYXhGaWxlcyIsInZhbGlkYXRvciIsImV2ZXJ5IiwiYWNjZXB0ZWQiLCJzaXplTWF0Y2giLCJjdXN0b21FcnJvcnMiLCJpc1Byb3BhZ2F0aW9uU3RvcHBlZCIsImV2ZW50IiwiY2FuY2VsQnViYmxlIiwiaXNFdnRXaXRoRmlsZXMiLCJkYXRhVHJhbnNmZXIiLCJ0eXBlcyIsIm9uRG9jdW1lbnREcmFnT3ZlciIsInByZXZlbnREZWZhdWx0IiwiaXNJZSIsInVzZXJBZ2VudCIsImlzRWRnZSIsImlzSWVPckVkZ2UiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJjb21wb3NlRXZlbnRIYW5kbGVycyIsImZucyIsImFyZ3MiLCJmbiIsImNhblVzZUZpbGVTeXN0ZW1BY2Nlc3NBUEkiLCJwaWNrZXJPcHRpb25zRnJvbUFjY2VwdCIsImRlc2NyaXB0aW9uIiwib2siLCJpc01JTUVUeXBlIiwiY29uc29sZSIsIndhcm4iLCJpc0V4dCIsImFnZyIsImFjY2VwdFByb3BBc0FjY2VwdEF0dHIiLCJhIiwiaXNBYm9ydCIsIkRPTUV4Y2VwdGlvbiIsIkFCT1JUX0VSUiIsImlzU2VjdXJpdHlFcnJvciIsIlNFQ1VSSVRZX0VSUiIsInRlc3QiLCJEcm9wem9uZSIsImZvcndhcmRSZWYiLCJyZWYiLCJjaGlsZHJlbiIsInVzZURyb3B6b25lIiwib3BlbiIsInByb3BzIiwidXNlSW1wZXJhdGl2ZUhhbmRsZSIsIlJlYWN0IiwiRnJhZ21lbnQiLCJkaXNwbGF5TmFtZSIsImRlZmF1bHRQcm9wcyIsImRpc2FibGVkIiwiZ2V0RmlsZXNGcm9tRXZlbnQiLCJpc0NoYW5nZUV2dCIsIkluZmluaXR5IiwicHJldmVudERyb3BPbkRvY3VtZW50Iiwibm9DbGljayIsIm5vS2V5Ym9hcmQiLCJub0RyYWciLCJub0RyYWdFdmVudHNCdWJibGluZyIsInVzZUZzQWNjZXNzQXBpIiwiYXV0b0ZvY3VzIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiZnVuYyIsIm9iamVjdE9mIiwiYXJyYXlPZiIsInN0cmluZyIsImJvb2wiLCJudW1iZXIiLCJvbkZpbGVEaWFsb2dDYW5jZWwiLCJvbkZpbGVEaWFsb2dPcGVuIiwib25EcmFnRW50ZXIiLCJvbkRyYWdMZWF2ZSIsIm9uRHJhZ092ZXIiLCJvbkRyb3AiLCJvbkRyb3BBY2NlcHRlZCIsIm9uRHJvcFJlamVjdGVkIiwib25FcnJvciIsImluaXRpYWxTdGF0ZSIsImlzRm9jdXNlZCIsImlzRmlsZURpYWxvZ0FjdGl2ZSIsImlzRHJhZ0FjdGl2ZSIsImlzRHJhZ0FjY2VwdCIsImlzRHJhZ1JlamVjdCIsImZpbGVSZWplY3Rpb25zIiwiYWNjZXB0QXR0ciIsInVzZU1lbW8iLCJwaWNrZXJUeXBlcyIsIm9uRmlsZURpYWxvZ09wZW5DYiIsIm5vb3AiLCJvbkZpbGVEaWFsb2dDYW5jZWxDYiIsInJvb3RSZWYiLCJ1c2VSZWYiLCJpbnB1dFJlZiIsInVzZVJlZHVjZXIiLCJyZWR1Y2VyIiwic3RhdGUiLCJkaXNwYXRjaCIsImZzQWNjZXNzQXBpV29ya3NSZWYiLCJpc1NlY3VyZUNvbnRleHQiLCJvbldpbmRvd0ZvY3VzIiwiY3VycmVudCIsInNldFRpbWVvdXQiLCJ1c2VFZmZlY3QiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRyYWdUYXJnZXRzUmVmIiwib25Eb2N1bWVudERyb3AiLCJjb250YWlucyIsImRvY3VtZW50IiwiZm9jdXMiLCJvbkVyckNiIiwidXNlQ2FsbGJhY2siLCJvbkRyYWdFbnRlckNiIiwicGVyc2lzdCIsInN0b3BQcm9wYWdhdGlvbiIsImZpbGVDb3VudCIsImNhdGNoIiwib25EcmFnT3ZlckNiIiwiaGFzRmlsZXMiLCJkcm9wRWZmZWN0Iiwib25EcmFnTGVhdmVDYiIsInRhcmdldHMiLCJ0YXJnZXRJZHgiLCJzcGxpY2UiLCJzZXRGaWxlcyIsImZvckVhY2giLCJhY2NlcHRFcnJvciIsInNpemVFcnJvciIsImVycm9ycyIsIm9uRHJvcENiIiwib3BlbkZpbGVEaWFsb2ciLCJvcHRzIiwic2hvd09wZW5GaWxlUGlja2VyIiwiY2xpY2siLCJFcnJvciIsIm9uS2V5RG93bkNiIiwiaXNFcXVhbE5vZGUiLCJrZXkiLCJrZXlDb2RlIiwib25Gb2N1c0NiIiwib25CbHVyQ2IiLCJvbkNsaWNrQ2IiLCJjb21wb3NlSGFuZGxlciIsImNvbXBvc2VLZXlib2FyZEhhbmRsZXIiLCJjb21wb3NlRHJhZ0hhbmRsZXIiLCJnZXRSb290UHJvcHMiLCJyZWZLZXkiLCJyb2xlIiwib25LZXlEb3duIiwib25Gb2N1cyIsIm9uQmx1ciIsIm9uQ2xpY2siLCJyZXN0IiwidGFiSW5kZXgiLCJvbklucHV0RWxlbWVudENsaWNrIiwiZ2V0SW5wdXRQcm9wcyIsIm9uQ2hhbmdlIiwiaW5wdXRQcm9wcyIsInN0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


/***/ })

};
;