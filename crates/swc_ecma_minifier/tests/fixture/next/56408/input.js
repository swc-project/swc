exports.id = 675;
exports.ids = [675];
exports.modules = {

    /***/
    5251:
        /***/
        ((module, exports, __webpack_require__) => {

            "use strict";
            /* __next_internal_client_entry_do_not_use__  cjs */
            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "Image", ({
                enumerable: true,
                get: function () {
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
            const configEnv = {
                "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
                "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384],
                "path": "/_next/image",
                "loader": "default",
                "dangerouslyAllowSVG": false,
                "unoptimized": false
            };
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
                p.catch(() => { }).then(() => {
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
                            isDefaultPrevented: () => prevented,
                            isPropagationStopped: () => stopped,
                            persist: () => { },
                            preventDefault: () => {
                                prevented = true;
                                event.preventDefault();
                            },
                            stopPropagation: () => {
                                stopped = true;
                                event.stopPropagation();
                            }
                        });
                    }
                    if (onLoadingCompleteRef == null ? void 0 : onLoadingCompleteRef.current) {
                        onLoadingCompleteRef.current(img);
                    }
                    if (false) { }
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
            const ImageElement = /*#__PURE__*/ (0, _react.forwardRef)((param, forwardedRef) => {
                let {
                    src,
                    srcSet,
                    sizes,
                    height,
                    width,
                    decoding,
                    className,
                    style,
                    fetchPriority,
                    placeholder,
                    loading,
                    unoptimized,
                    fill,
                    onLoadRef,
                    onLoadingCompleteRef,
                    setBlurComplete,
                    setShowAltText,
                    onLoad,
                    onError,
                    ...rest
                } = param;
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
                    ref: (0, _react.useCallback)((img) => {
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
                        if (false) { }
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
                    onLoad: (event) => {
                        const img = event.currentTarget;
                        handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized);
                    },
                    onError: (event) => {
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
                let {
                    isAppRouter,
                    imgAttributes
                } = param;
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
            const Image = /*#__PURE__*/ (0, _react.forwardRef)((props, forwardedRef) => {
                const pagesRouter = (0, _react.useContext)(_routercontextsharedruntime.RouterContext);
                // We're in the app directory if there is no pages router.
                const isAppRouter = !pagesRouter;
                const configContext = (0, _react.useContext)(_imageconfigcontextsharedruntime.ImageConfigContext);
                const config = (0, _react.useMemo)(() => {
                    const c = configEnv || configContext || _imageconfig.imageConfigDefault;
                    const allSizes = [
                        ...c.deviceSizes,
                        ...c.imageSizes
                    ].sort((a, b) => a - b);
                    const deviceSizes = c.deviceSizes.sort((a, b) => a - b);
                    return {
                        ...c,
                        allSizes,
                        deviceSizes
                    };
                }, [
                    configContext
                ]);
                const {
                    onLoad,
                    onLoadingComplete
                } = props;
                const onLoadRef = (0, _react.useRef)(onLoad);
                (0, _react.useEffect)(() => {
                    onLoadRef.current = onLoad;
                }, [
                    onLoad
                ]);
                const onLoadingCompleteRef = (0, _react.useRef)(onLoadingComplete);
                (0, _react.useEffect)(() => {
                    onLoadingCompleteRef.current = onLoadingComplete;
                }, [
                    onLoadingComplete
                ]);
                const [blurComplete, setBlurComplete] = (0, _react.useState)(false);
                const [showAltText, setShowAltText] = (0, _react.useState)(false);
                const {
                    props: imgAttributes,
                    meta: imgMeta
                } = (0, _getimgprops.getImgProps)(props, {
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


            /***/
        }),

    /***/
    4234:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "isInAmpMode", ({
                enumerable: true,
                get: function () {
                    return isInAmpMode;
                }
            }));

            function isInAmpMode(param) {
                let {
                    ampFirst = false, hybrid = false, hasQuery = false
                } = param === void 0 ? {} : param;
                return ampFirst || hybrid && hasQuery;
            } //# sourceMappingURL=amp-mode.js.map


            /***/
        }),

    /***/
    842:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "getImgProps", ({
                enumerable: true,
                get: function () {
                    return getImgProps;
                }
            }));
            const _warnonce = __webpack_require__(807);
            const _imageblursvg = __webpack_require__(5542);
            const _imageconfig = __webpack_require__(8352);
            const VALID_LOADING_VALUES = ( /* unused pure expression or super */ null && ([
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
                let {
                    deviceSizes,
                    allSizes
                } = param;
                if (sizes) {
                    // Find all the "vw" percent sizes used in the sizes prop
                    const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
                    const percentSizes = [];
                    for (let match; match = viewportWidthRe.exec(sizes); match) {
                        percentSizes.push(parseInt(match[2]));
                    }
                    if (percentSizes.length) {
                        const smallestRatio = Math.min(...percentSizes) * 0.01;
                        return {
                            widths: allSizes.filter((s) => s >= deviceSizes[0] * smallestRatio),
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
                    ...new Set( // > are actually 3x in the green color, but only 1.5x in the red and
                        // > blue colors. Showing a 3x resolution image in the app vs a 2x
                        // > resolution image will be visually the same, though the 3x image
                        // > takes significantly more data. Even true 3x resolution screens are
                        // > wasteful as the human eye cannot see that level of detail without
                        // > something like a magnifying glass.
                        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
                        [
                            width,
                            width * 2 /*, width * 3*/
                        ].map((w) => allSizes.find((p) => p >= w) || allSizes[allSizes.length - 1]))
                ];
                return {
                    widths,
                    kind: "x"
                };
            }

            function generateImgAttrs(param) {
                let {
                    config,
                    src,
                    unoptimized,
                    width,
                    quality,
                    sizes,
                    loader
                } = param;
                if (unoptimized) {
                    return {
                        src,
                        srcSet: undefined,
                        sizes: undefined
                    };
                }
                const {
                    widths,
                    kind
                } = getWidths(config, width, sizes);
                const last = widths.length - 1;
                return {
                    sizes: !sizes && kind === "w" ? "100vw" : sizes,
                    srcSet: widths.map((w, i) => loader({
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
                let {
                    src,
                    sizes,
                    unoptimized = false,
                    priority = false,
                    loading,
                    className,
                    quality,
                    width,
                    height,
                    fill = false,
                    style,
                    onLoad,
                    onLoadingComplete,
                    placeholder = "empty",
                    blurDataURL,
                    fetchPriority,
                    layout,
                    objectFit,
                    objectPosition,
                    lazyBoundary,
                    lazyRoot,
                    ...rest
                } = param;
                const {
                    imgConf,
                    showAltText,
                    blurComplete,
                    defaultLoader
                } = _state;
                let config;
                let c = imgConf || _imageconfig.imageConfigDefault;
                if ("allSizes" in c) {
                    config = c;
                } else {
                    const allSizes = [
                        ...c.deviceSizes,
                        ...c.imageSizes
                    ].sort((a, b) => a - b);
                    const deviceSizes = c.deviceSizes.sort((a, b) => a - b);
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
                    loader = (obj) => {
                        const {
                            config: _,
                            ...opts
                        } = obj;
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
                if (false) { }
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
                    :
                    null;
                let placeholderStyle = backgroundImage ? {
                    backgroundSize: imgStyle.objectFit || "cover",
                    backgroundPosition: imgStyle.objectPosition || "50% 50%",
                    backgroundRepeat: "no-repeat",
                    backgroundImage
                } : {};
                if (false) { }
                const imgAttributes = generateImgAttrs({
                    config,
                    src,
                    unoptimized,
                    width: widthInt,
                    quality: qualityInt,
                    sizes,
                    loader
                });
                if (false) { }
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


            /***/
        }),

    /***/
    1192:
        /***/
        ((module, exports, __webpack_require__) => {

            "use strict";
            /* __next_internal_client_entry_do_not_use__  cjs */
            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                defaultHead: function () {
                    return defaultHead;
                },
                default: function () {
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
                    /*#__PURE__*/
                    _react.default.createElement("meta", {
                        charSet: "utf-8"
                    })
                ];
                if (!inAmpMode) {
                    head.push( /*#__PURE__*/ _react.default.createElement("meta", {
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
                    return list.concat(_react.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild) => {
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
            */
            function unique() {
                const keys = new Set();
                const tags = new Set();
                const metaTypes = new Set();
                const metaCategories = {};
                return (h) => {
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
                    switch (h.type) {
                        case "title":
                        case "base":
                            if (tags.has(h.type)) {
                                isUnique = false;
                            } else {
                                tags.add(h.type);
                            }
                            break;
                        case "meta":
                            for (let i = 0, len = METATYPES.length; i < len; i++) {
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
             */
            function reduceComponents(headChildrenElements, props) {
                const {
                    inAmpMode
                } = props;
                return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead(inAmpMode).reverse()).filter(unique()).reverse().map((c, i) => {
                    const key = c.key || i;
                    if (true && !inAmpMode) {
                        if (c.type === "link" && c.props["href"] && // TODO(prateekbh@): Replace this with const from `constants` when the tree shaking works.
                            [
                                "https://fonts.googleapis.com/css",
                                "https://use.typekit.net/"
                            ].some((url) => c.props["href"].startsWith(url))) {
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
                    if (false) { }
                    return /*#__PURE__*/ _react.default.cloneElement(c, {
                        key
                    });
                });
            }
            /**
             * This component injects elements to `<head>` of your page.
             * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
             */
            function Head(param) {
                let {
                    children
                } = param;
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


            /***/
        }),

    /***/
    5542:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";
            /**
             * A shared function, used on both client and server, to generate a SVG blur placeholder.
             */
            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "getImageBlurSvg", ({
                enumerable: true,
                get: function () {
                    return getImageBlurSvg;
                }
            }));

            function getImageBlurSvg(param) {
                let {
                    widthInt,
                    heightInt,
                    blurWidth,
                    blurHeight,
                    blurDataURL,
                    objectFit
                } = param;
                const std = 20;
                const svgWidth = blurWidth ? blurWidth * 40 : widthInt;
                const svgHeight = blurHeight ? blurHeight * 40 : heightInt;
                const viewBox = svgWidth && svgHeight ? "viewBox='0 0 " + svgWidth + " " + svgHeight + "'" : "";
                const preserveAspectRatio = viewBox ? "none" : objectFit === "contain" ? "xMidYMid" : objectFit === "cover" ? "xMidYMid slice" : "none";
                return "%3Csvg xmlns='http://www.w3.org/2000/svg' " + viewBox + "%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='" + std + "'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='" + std + "'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='" + preserveAspectRatio + "' style='filter: url(%23b);' href='" + blurDataURL + "'/%3E%3C/svg%3E";
            } //# sourceMappingURL=image-blur-svg.js.map


            /***/
        }),

    /***/
    8352:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                VALID_LOADERS: function () {
                    return VALID_LOADERS;
                },
                imageConfigDefault: function () {
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


            /***/
        }),

    /***/
    8514:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                default: function () {
                    return _default;
                },
                unstable_getImgProps: function () {
                    return unstable_getImgProps;
                }
            });
            const _interop_require_default = __webpack_require__(2147);
            const _getimgprops = __webpack_require__(842);
            const _warnonce = __webpack_require__(807);
            const _imagecomponent = __webpack_require__(5251);
            const _imageloader = /*#__PURE__*/ _interop_require_default._(__webpack_require__(5156));
            const unstable_getImgProps = (imgProps) => {
                (0, _warnonce.warnOnce)("Warning: unstable_getImgProps() is experimental and may change or be removed at any time. Use at your own risk.");
                const {
                    props
                } = (0, _getimgprops.getImgProps)(imgProps, {
                    defaultLoader: _imageloader.default,
                    // This is replaced by webpack define plugin
                    imgConf: {
                        "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
                        "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384],
                        "path": "/_next/image",
                        "loader": "default",
                        "dangerouslyAllowSVG": false,
                        "unoptimized": false
                    }
                });
                for (const [key, value] of Object.entries(props)) {
                    if (value === undefined) {
                        delete props[key];
                    }
                }
                return {
                    props
                };
            };
            const _default = _imagecomponent.Image; //# sourceMappingURL=image-external.js.map


            /***/
        }),

    /***/
    5156:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "default", ({
                enumerable: true,
                get: function () {
                    return _default;
                }
            }));

            function defaultLoader(param) {
                let {
                    config,
                    src,
                    width,
                    quality
                } = param;
                if (false) { }
                return config.path + "?url=" + encodeURIComponent(src) + "&w=" + width + "&q=" + (quality || 75) + (false ? 0 : "");
            }
            // We use this to determine if the import is the default loader
            // or a custom loader defined by the user in next.config.js
            defaultLoader.__next_img_default = true;
            const _default = defaultLoader; //# sourceMappingURL=image-loader.js.map


            /***/
        }),

    /***/
    2543:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "default", ({
                enumerable: true,
                get: function () {
                    return SideEffect;
                }
            }));
            const _interop_require_wildcard = __webpack_require__(4009);
            const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(9885));
            const isServer = "undefined" === "undefined";
            const useClientOnlyLayoutEffect = isServer ? () => { } : _react.useLayoutEffect;
            const useClientOnlyEffect = isServer ? () => { } : _react.useEffect;

            function SideEffect(props) {
                const {
                    headManager,
                    reduceComponentsToState
                } = props;

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
                useClientOnlyLayoutEffect(() => {
                    var _headManager_mountedInstances;
                    headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.add(props.children);
                    return () => {
                        var _headManager_mountedInstances;
                        headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.delete(props.children);
                    };
                });
                // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
                // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
                // being rendered, we only trigger the method from the last one.
                // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
                // singleton in the layout effect pass, and actually trigger it in the effect pass.
                useClientOnlyLayoutEffect(() => {
                    if (headManager) {
                        headManager._pendingUpdate = emitChange;
                    }
                    return () => {
                        if (headManager) {
                            headManager._pendingUpdate = emitChange;
                        }
                    };
                });
                useClientOnlyEffect(() => {
                    if (headManager && headManager._pendingUpdate) {
                        headManager._pendingUpdate();
                        headManager._pendingUpdate = null;
                    }
                    return () => {
                        if (headManager && headManager._pendingUpdate) {
                            headManager._pendingUpdate();
                            headManager._pendingUpdate = null;
                        }
                    };
                });
                return null;
            } //# sourceMappingURL=side-effect.js.map


            /***/
        }),

    /***/
    807:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "warnOnce", ({
                enumerable: true,
                get: function () {
                    return warnOnce;
                }
            }));
            let warnOnce = (_) => { };
            if (false) { } //# sourceMappingURL=warn-once.js.map


            /***/
        }),

    /***/
    3093:
        /***/
        ((module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                RSC: function () {
                    return RSC;
                },
                ACTION: function () {
                    return ACTION;
                },
                NEXT_ROUTER_STATE_TREE: function () {
                    return NEXT_ROUTER_STATE_TREE;
                },
                NEXT_ROUTER_PREFETCH: function () {
                    return NEXT_ROUTER_PREFETCH;
                },
                NEXT_URL: function () {
                    return NEXT_URL;
                },
                RSC_CONTENT_TYPE_HEADER: function () {
                    return RSC_CONTENT_TYPE_HEADER;
                },
                RSC_VARY_HEADER: function () {
                    return RSC_VARY_HEADER;
                },
                FLIGHT_PARAMETERS: function () {
                    return FLIGHT_PARAMETERS;
                },
                NEXT_RSC_UNION_QUERY: function () {
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


            /***/
        }),

    /***/
    8582:
        /***/
        ((module) => {

            "use strict";

            (() => {
                "use strict";
                if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
                var e = {};
                (() => {
                    var r = e;
                    /*!
                     * cookie
                     * Copyright(c) 2012-2014 Roman Shtylman
                     * Copyright(c) 2015 Douglas Christopher Wilson
                     * MIT Licensed
                     */
                    r.parse = parse;
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
                        for (var p = 0; p < o.length; p++) {
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
                            switch (u) {
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


            /***/
        }),

    /***/
    2982:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            /**
             * Tokenize input string.
             */
            function lexer(str) {
                var tokens = [];
                var i = 0;
                while (i < str.length) {
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
                        while (j < str.length) {
                            var code = str.charCodeAt(j);
                            if ( // `0-9`
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
                        while (j < str.length) {
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
             */
            function parse(str, options) {
                if (options === void 0) {
                    options = {};
                }
                var tokens = lexer(str);
                var _a = options.prefixes,
                    prefixes = _a === void 0 ? "./" : _a;
                var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
                var result = [];
                var key = 0;
                var i = 0;
                var path = "";
                var tryConsume = function (type) {
                    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
                };
                var mustConsume = function (type) {
                    var value = tryConsume(type);
                    if (value !== undefined) return value;
                    var _a = tokens[i],
                        nextType = _a.type,
                        index = _a.index;
                    throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
                };
                var consumeText = function () {
                    var result = "";
                    var value;
                    // tslint:disable-next-line
                    while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
                        result += value;
                    }
                    return result;
                };
                while (i < tokens.length) {
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
             */
            function compile(str, options) {
                return tokensToFunction(parse(str, options), options);
            }
            exports.compile = compile;
            /**
             * Expose a method for transforming tokens into the path function.
             */
            function tokensToFunction(tokens, options) {
                if (options === void 0) {
                    options = {};
                }
                var reFlags = flags(options);
                var _a = options.encode,
                    encode = _a === void 0 ? function (x) {
                        return x;
                    } : _a,
                    _b = options.validate,
                    validate = _b === void 0 ? true : _b;
                // Compile all the tokens into regexps.
                var matches = tokens.map(function (token) {
                    if (typeof token === "object") {
                        return new RegExp("^(?:" + token.pattern + ")$", reFlags);
                    }
                });
                return function (data) {
                    var path = "";
                    for (var i = 0; i < tokens.length; i++) {
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
                            for (var j = 0; j < value.length; j++) {
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
             */
            function match(str, options) {
                var keys = [];
                var re = pathToRegexp(str, keys, options);
                return regexpToFunction(re, keys, options);
            }
            exports.match = match;
            /**
             * Create a path match function from `path-to-regexp` output.
             */
            function regexpToFunction(re, keys, options) {
                if (options === void 0) {
                    options = {};
                }
                var _a = options.decode,
                    decode = _a === void 0 ? function (x) {
                        return x;
                    } : _a;
                return function (pathname) {
                    var m = re.exec(pathname);
                    if (!m) return false;
                    var path = m[0],
                        index = m.index;
                    var params = Object.create(null);
                    var _loop_1 = function (i) {
                        // tslint:disable-next-line
                        if (m[i] === undefined) return "continue";
                        var key = keys[i - 1];
                        if (key.modifier === "*" || key.modifier === "+") {
                            params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                                return decode(value, key);
                            });
                        } else {
                            params[key.name] = decode(m[i], key);
                        }
                    };
                    for (var i = 1; i < m.length; i++) {
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
             */
            function escapeString(str) {
                return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
            }
            /**
             * Get the flags for a regexp from the options.
             */
            function flags(options) {
                return options && options.sensitive ? "" : "i";
            }
            /**
             * Pull out keys from a regexp.
             */
            function regexpToRegexp(path, keys) {
                if (!keys) return path;
                // Use a negative lookahead to match only capturing groups.
                var groups = path.source.match(/\((?!\?)/g);
                if (groups) {
                    for (var i = 0; i < groups.length; i++) {
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
             */
            function arrayToRegexp(paths, keys, options) {
                var parts = paths.map(function (path) {
                    return pathToRegexp(path, keys, options).source;
                });
                return new RegExp("(?:" + parts.join("|") + ")", flags(options));
            }
            /**
             * Create a path regexp from string input.
             */
            function stringToRegexp(path, keys, options) {
                return tokensToRegexp(parse(path, options), keys, options);
            }
            /**
             * Expose a function for taking tokens and returning a RegExp.
             */
            function tokensToRegexp(tokens, keys, options) {
                if (options === void 0) {
                    options = {};
                }
                var _a = options.strict,
                    strict = _a === void 0 ? false : _a,
                    _b = options.start,
                    start = _b === void 0 ? true : _b,
                    _c = options.end,
                    end = _c === void 0 ? true : _c,
                    _d = options.encode,
                    encode = _d === void 0 ? function (x) {
                        return x;
                    } : _d;
                var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
                var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
                var route = start ? "^" : "";
                // Iterate over the tokens and create our regexp string.
                for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
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
             */
            function pathToRegexp(path, keys, options) {
                if (path instanceof RegExp) return regexpToRegexp(path, keys);
                if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
                return stringToRegexp(path, keys, options);
            }
            exports.pathToRegexp = pathToRegexp; //# sourceMappingURL=index.js.map


            /***/
        }),

    /***/
    1209:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                NEXT_QUERY_PARAM_PREFIX: function () {
                    return NEXT_QUERY_PARAM_PREFIX;
                },
                PRERENDER_REVALIDATE_HEADER: function () {
                    return PRERENDER_REVALIDATE_HEADER;
                },
                PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function () {
                    return PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER;
                },
                NEXT_CACHE_TAGS_HEADER: function () {
                    return NEXT_CACHE_TAGS_HEADER;
                },
                NEXT_CACHE_SOFT_TAGS_HEADER: function () {
                    return NEXT_CACHE_SOFT_TAGS_HEADER;
                },
                NEXT_CACHE_REVALIDATED_TAGS_HEADER: function () {
                    return NEXT_CACHE_REVALIDATED_TAGS_HEADER;
                },
                NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function () {
                    return NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER;
                },
                NEXT_CACHE_TAG_MAX_LENGTH: function () {
                    return NEXT_CACHE_TAG_MAX_LENGTH;
                },
                NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function () {
                    return NEXT_CACHE_SOFT_TAG_MAX_LENGTH;
                },
                NEXT_CACHE_IMPLICIT_TAG_ID: function () {
                    return NEXT_CACHE_IMPLICIT_TAG_ID;
                },
                CACHE_ONE_YEAR: function () {
                    return CACHE_ONE_YEAR;
                },
                MIDDLEWARE_FILENAME: function () {
                    return MIDDLEWARE_FILENAME;
                },
                MIDDLEWARE_LOCATION_REGEXP: function () {
                    return MIDDLEWARE_LOCATION_REGEXP;
                },
                INSTRUMENTATION_HOOK_FILENAME: function () {
                    return INSTRUMENTATION_HOOK_FILENAME;
                },
                PAGES_DIR_ALIAS: function () {
                    return PAGES_DIR_ALIAS;
                },
                DOT_NEXT_ALIAS: function () {
                    return DOT_NEXT_ALIAS;
                },
                ROOT_DIR_ALIAS: function () {
                    return ROOT_DIR_ALIAS;
                },
                APP_DIR_ALIAS: function () {
                    return APP_DIR_ALIAS;
                },
                RSC_MOD_REF_PROXY_ALIAS: function () {
                    return RSC_MOD_REF_PROXY_ALIAS;
                },
                RSC_ACTION_VALIDATE_ALIAS: function () {
                    return RSC_ACTION_VALIDATE_ALIAS;
                },
                RSC_ACTION_PROXY_ALIAS: function () {
                    return RSC_ACTION_PROXY_ALIAS;
                },
                RSC_ACTION_CLIENT_WRAPPER_ALIAS: function () {
                    return RSC_ACTION_CLIENT_WRAPPER_ALIAS;
                },
                PUBLIC_DIR_MIDDLEWARE_CONFLICT: function () {
                    return PUBLIC_DIR_MIDDLEWARE_CONFLICT;
                },
                SSG_GET_INITIAL_PROPS_CONFLICT: function () {
                    return SSG_GET_INITIAL_PROPS_CONFLICT;
                },
                SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function () {
                    return SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
                },
                SERVER_PROPS_SSG_CONFLICT: function () {
                    return SERVER_PROPS_SSG_CONFLICT;
                },
                STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function () {
                    return STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
                },
                SERVER_PROPS_EXPORT_ERROR: function () {
                    return SERVER_PROPS_EXPORT_ERROR;
                },
                GSP_NO_RETURNED_VALUE: function () {
                    return GSP_NO_RETURNED_VALUE;
                },
                GSSP_NO_RETURNED_VALUE: function () {
                    return GSSP_NO_RETURNED_VALUE;
                },
                UNSTABLE_REVALIDATE_RENAME_ERROR: function () {
                    return UNSTABLE_REVALIDATE_RENAME_ERROR;
                },
                GSSP_COMPONENT_MEMBER_ERROR: function () {
                    return GSSP_COMPONENT_MEMBER_ERROR;
                },
                NON_STANDARD_NODE_ENV: function () {
                    return NON_STANDARD_NODE_ENV;
                },
                SSG_FALLBACK_EXPORT_ERROR: function () {
                    return SSG_FALLBACK_EXPORT_ERROR;
                },
                ESLINT_DEFAULT_DIRS: function () {
                    return ESLINT_DEFAULT_DIRS;
                },
                ESLINT_PROMPT_VALUES: function () {
                    return ESLINT_PROMPT_VALUES;
                },
                SERVER_RUNTIME: function () {
                    return SERVER_RUNTIME;
                },
                WEBPACK_LAYERS: function () {
                    return WEBPACK_LAYERS;
                },
                WEBPACK_RESOURCE_QUERIES: function () {
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
            const ESLINT_PROMPT_VALUES = [{
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
             */
            const WEBPACK_LAYERS_NAMES = {
                /**
                 * The layer for the shared code between the client and server bundles.
                 */
                shared: "shared",
                /**
                 * React Server Components layer (rsc).
                 */
                reactServerComponents: "rsc",
                /**
                 * Server Side Rendering layer for app (ssr).
                 */
                serverSideRendering: "ssr",
                /**
                 * The browser client bundle layer for actions.
                 */
                actionBrowser: "action-browser",
                /**
                 * The layer for the API routes.
                 */
                api: "api",
                /**
                 * The layer for the middleware code.
                 */
                middleware: "middleware",
                /**
                 * The layer for assets on the edge.
                 */
                edgeAsset: "edge-asset",
                /**
                 * The browser client bundle layer for App directory.
                 */
                appPagesBrowser: "app-pages-browser",
                /**
                 * The server bundle layer for metadata routes.
                 */
                appMetadataRoute: "app-metadata-route",
                /**
                 * The layer for the server bundle for App Route handlers.
                 */
                appRouteHandler: "app-route-handler"
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


            /***/
        }),

    /***/
    6885:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                fillMetadataSegment: function () {
                    return fillMetadataSegment;
                },
                normalizeMetadataRoute: function () {
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
             */
            function getMetadataRouteSuffix(page) {
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
                const {
                    name,
                    ext
                } = _path.default.parse(imageSegment);
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
                    const {
                        dir,
                        name: baseName,
                        ext
                    } = _path.default.parse(route);
                    const isStaticRoute = (0, _ismetadataroute.isStaticMetadataRoute)(page);
                    route = _path.default.posix.join(dir, `${baseName}${suffix ? `-${suffix}` : ""}${ext}`, isStaticRoute ? "" : "[[...__metadata_id__]]", "route");
                }
                return route;
            } //# sourceMappingURL=get-metadata-route.js.map


            /***/
        }),

    /***/
    3223:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                STATIC_METADATA_IMAGES: function () {
                    return STATIC_METADATA_IMAGES;
                },
                isMetadataRouteFile: function () {
                    return isMetadataRouteFile;
                },
                isStaticMetadataRouteFile: function () {
                    return isStaticMetadataRouteFile;
                },
                isStaticMetadataRoute: function () {
                    return isStaticMetadataRoute;
                },
                isMetadataRoute: function () {
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
            const getExtensionRegexString = (extensions) => `(?:${extensions.join("|")})`;

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
                return metadataRouteFilesRegex.some((r) => r.test(normalizedAppDirRelativePath));
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


            /***/
        }),

    /***/
    994:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "getCookieParser", ({
                enumerable: true,
                get: function () {
                    return getCookieParser;
                }
            }));

            function getCookieParser(headers) {
                return function parseCookie() {
                    const {
                        cookie
                    } = headers;
                    if (!cookie) {
                        return {};
                    }
                    const {
                        parse: parseCookieFn
                    } = __webpack_require__(8582);
                    return parseCookieFn(Array.isArray(cookie) ? cookie.join("; ") : cookie);
                };
            } //# sourceMappingURL=get-cookie-parser.js.map


            /***/
        }),

    /***/
    6098:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                INTERCEPTION_ROUTE_MARKERS: function () {
                    return INTERCEPTION_ROUTE_MARKERS;
                },
                isInterceptionRouteAppPath: function () {
                    return isInterceptionRouteAppPath;
                },
                extractInterceptionRouteInformation: function () {
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
                return path.split("/").find((segment) => INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m))) !== undefined;
            }

            function extractInterceptionRouteInformation(path) {
                let interceptingRoute, marker, interceptedRoute;
                for (const segment of path.split("/")) {
                    marker = INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m));
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
                switch (marker) {
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


            /***/
        }),

    /***/
    1645:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                normalizeVercelUrl: function () {
                    return normalizeVercelUrl;
                },
                interpolateDynamicPath: function () {
                    return interpolateDynamicPath;
                },
                getUtils: function () {
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
                    for (const key of Object.keys(_parsedUrl.query)) {
                        if (key !== _constants.NEXT_QUERY_PARAM_PREFIX && key.startsWith(_constants.NEXT_QUERY_PARAM_PREFIX) || (paramKeys || Object.keys(defaultRouteRegex.groups)).includes(key)) {
                            delete _parsedUrl.query[key];
                        }
                    }
                    req.url = (0, _url.format)(_parsedUrl);
                }
            }

            function interpolateDynamicPath(pathname, params, defaultRouteRegex) {
                if (!defaultRouteRegex) return pathname;
                for (const param of Object.keys(defaultRouteRegex.groups)) {
                    const {
                        optional,
                        repeat
                    } = defaultRouteRegex.groups[param];
                    let builtParam = `[${repeat ? "..." : ""}${param}]`;
                    if (optional) {
                        builtParam = `[${builtParam}]`;
                    }
                    const paramIdx = pathname.indexOf(builtParam);
                    if (paramIdx > -1) {
                        let paramValue;
                        const value = params[param];
                        if (Array.isArray(value)) {
                            paramValue = value.map((v) => v && encodeURIComponent(v)).join("/");
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

            function getUtils({
                page,
                i18n,
                basePath,
                rewrites,
                pageIsDynamic,
                trailingSlash,
                caseSensitive
            }) {
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
                    const matchesPage = () => {
                        const fsPathnameNoSlash = (0, _removetrailingslash.removeTrailingSlash)(fsPathname || "");
                        return fsPathnameNoSlash === (0, _removetrailingslash.removeTrailingSlash)(page) || (dynamicRouteMatcher == null ? void 0 : dynamicRouteMatcher(fsPathnameNoSlash));
                    };
                    const checkRewrite = (rewrite) => {
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
                            const {
                                parsedDestination,
                                destQuery
                            } = (0, _preparedestination.prepareDestination)({
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
                    for (const rewrite of rewrites.beforeFiles || []) {
                        checkRewrite(rewrite);
                    }
                    if (fsPathname !== page) {
                        let finished = false;
                        for (const rewrite of rewrites.afterFiles || []) {
                            finished = checkRewrite(rewrite);
                            if (finished) break;
                        }
                        if (!finished && !matchesPage()) {
                            for (const rewrite of rewrites.fallback || []) {
                                finished = checkRewrite(rewrite);
                                if (finished) break;
                            }
                        }
                    }
                    return rewriteParams;
                }

                function getParamsFromRouteMatches(req, renderOpts, detectedLocale) {
                    return (0, _routematcher.getRouteMatcher)(function () {
                        const {
                            groups,
                            routeKeys
                        } = defaultRouteRegex;
                        return {
                            re: {
                                // Simulate a RegExp match from the \`req.url\` input
                                exec: (str) => {
                                    const obj = Object.fromEntries(new URLSearchParams(str));
                                    const matchesHasLocale = i18n && detectedLocale && obj["1"] === detectedLocale;
                                    for (const key of Object.keys(obj)) {
                                        const value = obj[key];
                                        if (key !== _constants.NEXT_QUERY_PARAM_PREFIX && key.startsWith(_constants.NEXT_QUERY_PARAM_PREFIX)) {
                                            const normalizedKey = key.substring(_constants.NEXT_QUERY_PARAM_PREFIX.length);
                                            obj[normalizedKey] = value;
                                            delete obj[key];
                                        }
                                    }
                                    // favor named matches if available
                                    const routeKeyNames = Object.keys(routeKeys || {});
                                    const filterLocaleItem = (val) => {
                                        if (i18n) {
                                            // locale items can be included in route-matches
                                            // for fallback SSG pages so ensure they are
                                            // filtered
                                            const isCatchAll = Array.isArray(val);
                                            const _val = isCatchAll ? val[0] : val;
                                            if (typeof _val === "string" && i18n.locales.some((item) => {
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
                                    if (routeKeyNames.every((name) => obj[name])) {
                                        return routeKeyNames.reduce((prev, keyName) => {
                                            const paramName = routeKeys == null ? void 0 : routeKeys[keyName];
                                            if (paramName && !filterLocaleItem(obj[keyName])) {
                                                prev[groups[paramName].pos] = obj[keyName];
                                            }
                                            return prev;
                                        }, {});
                                    }
                                    return Object.keys(obj).reduce((prev, key) => {
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
                    params = Object.keys(defaultRouteRegex.groups).reduce((prev, key) => {
                        let value = params[key];
                        if (typeof value === "string") {
                            value = (0, _apppaths.normalizeRscPath)(value, true);
                        }
                        if (Array.isArray(value)) {
                            value = value.map((val) => {
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
                        const isDefaultValue = Array.isArray(defaultValue) ? defaultValue.some((defaultVal) => {
                            return Array.isArray(value) ? value.some((val) => val.includes(defaultVal)) : value == null ? void 0 : value.includes(defaultVal);
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
                    normalizeVercelUrl: (req, trustQuery, paramKeys) => normalizeVercelUrl(req, trustQuery, paramKeys, pageIsDynamic, defaultRouteRegex),
                    interpolateDynamicPath: (pathname, params) => interpolateDynamicPath(pathname, params, defaultRouteRegex)
                };
            } //# sourceMappingURL=server-utils.js.map


            /***/
        }),

    /***/
    9405:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";
            // regexp is based on https://github.com/sindresorhus/escape-string-regexp

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "escapeStringRegexp", ({
                enumerable: true,
                get: function () {
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


            /***/
        }),

    /***/
    889:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";
            // http://www.cse.yorku.ca/~oz/hash.html

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                djb2Hash: function () {
                    return djb2Hash;
                },
                hexHash: function () {
                    return hexHash;
                }
            });

            function djb2Hash(str) {
                let hash = 5381;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = (hash << 5) + hash + char;
                }
                return Math.abs(hash);
            }

            function hexHash(str) {
                return djb2Hash(str).toString(36).slice(0, 5);
            } //# sourceMappingURL=hash.js.map


            /***/
        }),

    /***/
    3688:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "normalizeLocalePath", ({
                enumerable: true,
                get: function () {
                    return normalizeLocalePath;
                }
            }));

            function normalizeLocalePath(pathname, locales) {
                let detectedLocale;
                // first item will be empty string from splitting at first char
                const pathnameParts = pathname.split("/");
                (locales || []).some((locale) => {
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


            /***/
        }),

    /***/
    7001:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            "use strict";
            /**
             * This module is for next.js server internal usage of path module.
             * It will use native path module for nodejs runtime.
             * It will use path-browserify polyfill for edge runtime.
             */
            let path;
            if (false) { } else {
                path = __webpack_require__(1017);
            }
            module.exports = path; //# sourceMappingURL=path.js.map


            /***/
        }),

    /***/
    6800:
        /***/
        ((__unused_webpack_module, exports) => {

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
                get: function () {
                    return ensureLeadingSlash;
                }
            }));

            function ensureLeadingSlash(path) {
                return path.startsWith("/") ? path : "/" + path;
            } //# sourceMappingURL=ensure-leading-slash.js.map


            /***/
        }),

    /***/
    4029:
        /***/
        ((__unused_webpack_module, exports) => {

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
                get: function () {
                    return normalizePathSep;
                }
            }));

            function normalizePathSep(path) {
                return path.replace(/\\/g, "/");
            } //# sourceMappingURL=normalize-path-sep.js.map


            /***/
        }),

    /***/
    4547:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                normalizeAppPath: function () {
                    return normalizeAppPath;
                },
                normalizeRscPath: function () {
                    return normalizeRscPath;
                }
            });
            const _ensureleadingslash = __webpack_require__(6800);
            const _segment = __webpack_require__(3391);

            function normalizeAppPath(route) {
                return (0, _ensureleadingslash.ensureLeadingSlash)(route.split("/").reduce((pathname, segment, index, segments) => {
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


            /***/
        }),

    /***/
    2730:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "parseRelativeUrl", ({
                enumerable: true,
                get: function () {
                    return parseRelativeUrl;
                }
            }));
            const _utils = __webpack_require__(2261);
            const _querystring = __webpack_require__(5588);

            function parseRelativeUrl(url, base) {
                const globalBase = new URL(true ? "http://n" : 0);
                const resolvedBase = base ? new URL(base, globalBase) : url.startsWith(".") ? new URL(true ? "http://n" : 0) : globalBase;
                const {
                    pathname,
                    searchParams,
                    search,
                    hash,
                    href,
                    origin
                } = new URL(url, resolvedBase);
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


            /***/
        }),

    /***/
    7037:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "parseUrl", ({
                enumerable: true,
                get: function () {
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


            /***/
        }),

    /***/
    4016:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "getPathMatch", ({
                enumerable: true,
                get: function () {
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
                 */
                return (pathname, params) => {
                    // If no pathname is provided it's not a match.
                    if (typeof pathname !== "string") return false;
                    const match = matcher(pathname);
                    // If the path did not match `false` will be returned.
                    if (!match) return false;
                    /**
                     * If unnamed params are not allowed they must be removed from
                     * the matched parameters. path-to-regexp uses "string" for named and
                     * "number" for unnamed parameters.
                     */
                    if (options == null ? void 0 : options.removeUnnamedParams) {
                        for (const key of keys) {
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


            /***/
        }),

    /***/
    3682:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                matchHas: function () {
                    return matchHas;
                },
                compileNonPath: function () {
                    return compileNonPath;
                },
                prepareDestination: function () {
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
             */
            function getSafeParamName(paramName) {
                let newParamName = "";
                for (let i = 0; i < paramName.length; i++) {
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
                const hasMatch = (hasItem) => {
                    let value;
                    let key = hasItem.key;
                    switch (hasItem.type) {
                        case "header": {
                            key = key.toLowerCase();
                            value = req.headers[key];
                            break;
                        }
                        case "cookie": {
                            if ("cookies" in req) {
                                value = req.cookies[hasItem.key];
                            } else {
                                const cookies = (0, _getcookieparser.getCookieParser)(req.headers)();
                                value = cookies[hasItem.key];
                            }
                            break;
                        }
                        case "query": {
                            value = query[key];
                            break;
                        }
                        case "host": {
                            const {
                                host
                            } = (req == null ? void 0 : req.headers) || {};
                            // remove port from host if present
                            const hostname = host == null ? void 0 : host.split(":")[0].toLowerCase();
                            value = hostname;
                            break;
                        }
                        default: {
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
                                    Object.keys(matches.groups).forEach((groupKey) => {
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
                const allMatch = has.every((item) => hasMatch(item)) && !missing.some((item) => hasMatch(item));
                if (allMatch) {
                    return params;
                }
                return false;
            }

            function compileNonPath(value, params) {
                if (!value.includes(":")) {
                    return value;
                }
                for (const key of Object.keys(params)) {
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
                })) {
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
                destPathParamKeys.forEach((key) => destParams.push(key.name));
                destHostnameParamKeys.forEach((key) => destParams.push(key.name));
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
                for (const [key, strOrArray] of Object.entries(destQuery)) {
                    // the value needs to start with a forward-slash to be compiled
                    // correctly
                    if (Array.isArray(strOrArray)) {
                        destQuery[key] = strOrArray.map((value) => compileNonPath(unescapeSegments(value), args.params));
                    } else if (typeof strOrArray === "string") {
                        destQuery[key] = compileNonPath(unescapeSegments(strOrArray), args.params);
                    }
                }
                // add path params to query if it's not a redirect and not
                // already defined in destination query or path
                let paramKeys = Object.keys(args.params).filter((name) => name !== "nextInternalLocale");
                if (args.appendParamsToQuery && !paramKeys.some((key) => destParams.includes(key))) {
                    for (const key of paramKeys) {
                        if (!(key in destQuery)) {
                            destQuery[key] = args.params[key];
                        }
                    }
                }
                let newUrl;
                // The compiler also that the interception route marker is an unnamed param, hence '0',
                // so we need to add it to the params object.
                if ((0, _interceptionroutes.isInterceptionRouteAppPath)(destPath)) {
                    for (const segment of destPath.split("/")) {
                        const marker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m));
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


            /***/
        }),

    /***/
    5588:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                searchParamsToUrlQuery: function () {
                    return searchParamsToUrlQuery;
                },
                urlQueryToSearchParams: function () {
                    return urlQueryToSearchParams;
                },
                assign: function () {
                    return assign;
                }
            });

            function searchParamsToUrlQuery(searchParams) {
                const query = {};
                searchParams.forEach((value, key) => {
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
                Object.entries(urlQuery).forEach((param) => {
                    let [key, value] = param;
                    if (Array.isArray(value)) {
                        value.forEach((item) => result.append(key, stringifyUrlQueryParam(item)));
                    } else {
                        result.set(key, stringifyUrlQueryParam(value));
                    }
                });
                return result;
            }

            function assign(target) {
                for (var _len = arguments.length, searchParamsList = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    searchParamsList[_key - 1] = arguments[_key];
                }
                searchParamsList.forEach((searchParams) => {
                    Array.from(searchParams.keys()).forEach((key) => target.delete(key));
                    searchParams.forEach((value, key) => target.append(key, value));
                });
                return target;
            } //# sourceMappingURL=querystring.js.map


            /***/
        }),

    /***/
    2664:
        /***/
        ((__unused_webpack_module, exports) => {

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
                get: function () {
                    return removeTrailingSlash;
                }
            }));

            function removeTrailingSlash(route) {
                return route.replace(/\/$/, "") || "/";
            } //# sourceMappingURL=remove-trailing-slash.js.map


            /***/
        }),

    /***/
    4727:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "getRouteMatcher", ({
                enumerable: true,
                get: function () {
                    return getRouteMatcher;
                }
            }));
            const _utils = __webpack_require__(2261);

            function getRouteMatcher(param) {
                let {
                    re,
                    groups
                } = param;
                return (pathname) => {
                    const routeMatch = re.exec(pathname);
                    if (!routeMatch) {
                        return false;
                    }
                    const decode = (param) => {
                        try {
                            return decodeURIComponent(param);
                        } catch (_) {
                            throw new _utils.DecodeError("failed to decode param");
                        }
                    };
                    const params = {};
                    Object.keys(groups).forEach((slugName) => {
                        const g = groups[slugName];
                        const m = routeMatch[g.pos];
                        if (m !== undefined) {
                            params[slugName] = ~m.indexOf("/") ? m.split("/").map((entry) => decode(entry)) : g.repeat ? [
                                decode(m)
                            ] : decode(m);
                        }
                    });
                    return params;
                };
            } //# sourceMappingURL=route-matcher.js.map


            /***/
        }),

    /***/
    6136:
        /***/
        ((__unused_webpack_module, exports, __webpack_require__) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                getRouteRegex: function () {
                    return getRouteRegex;
                },
                getNamedRouteRegex: function () {
                    return getNamedRouteRegex;
                },
                getNamedMiddlewareRegex: function () {
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
             */
            function parseParameter(param) {
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
                    parameterizedRoute: segments.map((segment) => {
                        const markerMatch = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m));
                        const paramMatches = segment.match(/\[((?:\[.*\])|.+)\]/) // Check for parameters
                            ;
                        if (markerMatch && paramMatches) {
                            const {
                                key,
                                optional,
                                repeat
                            } = parseParameter(paramMatches[1]);
                            groups[key] = {
                                pos: groupIndex++,
                                repeat,
                                optional
                            };
                            return "/" + (0, _escaperegexp.escapeStringRegexp)(markerMatch) + "([^/]+?)";
                        } else if (paramMatches) {
                            const {
                                key,
                                repeat,
                                optional
                            } = parseParameter(paramMatches[1]);
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
                const {
                    parameterizedRoute,
                    groups
                } = getParametrizedRoute(normalizedRoute);
                return {
                    re: new RegExp("^" + parameterizedRoute + "(?:/)?$"),
                    groups: groups
                };
            }
            /**
             * Builds a function to generate a minimal routeKey using only a-z and minimal
             * number of characters.
             */
            function buildGetSafeRouteKey() {
                let i = 0;
                return () => {
                    let routeKey = "";
                    let j = ++i;
                    while (j > 0) {
                        routeKey += String.fromCharCode(97 + (j - 1) % 26);
                        j = Math.floor((j - 1) / 26);
                    }
                    return routeKey;
                };
            }

            function getSafeKeyFromSegment(param) {
                let {
                    getSafeRouteKey,
                    segment,
                    routeKeys,
                    keyPrefix
                } = param;
                const {
                    key,
                    optional,
                    repeat
                } = parseParameter(segment);
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
                    namedParameterizedRoute: segments.map((segment) => {
                        const hasInterceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m) => segment.startsWith(m));
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
                const {
                    parameterizedRoute
                } = getParametrizedRoute(normalizedRoute);
                const {
                    catchAll = true
                } = options;
                if (parameterizedRoute === "/") {
                    let catchAllRegex = catchAll ? ".*" : "";
                    return {
                        namedRegex: "^/" + catchAllRegex + "$"
                    };
                }
                const {
                    namedParameterizedRoute
                } = getNamedParametrizedRoute(normalizedRoute, false);
                let catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
                return {
                    namedRegex: "^" + namedParameterizedRoute + catchAllGroupedRegex + "$"
                };
            } //# sourceMappingURL=route-regex.js.map


            /***/
        }),

    /***/
    3391:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            Object.defineProperty(exports, "isGroupSegment", ({
                enumerable: true,
                get: function () {
                    return isGroupSegment;
                }
            }));

            function isGroupSegment(segment) {
                // Use array[0] for performant purpose
                return segment[0] === "(" && segment.endsWith(")");
            } //# sourceMappingURL=segment.js.map


            /***/
        }),

    /***/
    2261:
        /***/
        ((__unused_webpack_module, exports) => {

            "use strict";

            Object.defineProperty(exports, "__esModule", ({
                value: true
            }));
            0 && (0);

            function _export(target, all) {
                for (var name in all) Object.defineProperty(target, name, {
                    enumerable: true,
                    get: all[name]
                });
            }
            _export(exports, {
                WEB_VITALS: function () {
                    return WEB_VITALS;
                },
                execOnce: function () {
                    return execOnce;
                },
                isAbsoluteUrl: function () {
                    return isAbsoluteUrl;
                },
                getLocationOrigin: function () {
                    return getLocationOrigin;
                },
                getURL: function () {
                    return getURL;
                },
                getDisplayName: function () {
                    return getDisplayName;
                },
                isResSent: function () {
                    return isResSent;
                },
                normalizeRepeatedSlashes: function () {
                    return normalizeRepeatedSlashes;
                },
                loadGetInitialProps: function () {
                    return loadGetInitialProps;
                },
                SP: function () {
                    return SP;
                },
                ST: function () {
                    return ST;
                },
                DecodeError: function () {
                    return DecodeError;
                },
                NormalizeError: function () {
                    return NormalizeError;
                },
                PageNotFoundError: function () {
                    return PageNotFoundError;
                },
                MissingStaticPage: function () {
                    return MissingStaticPage;
                },
                MiddlewareNotFoundError: function () {
                    return MiddlewareNotFoundError;
                },
                stringifyError: function () {
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
                return function () {
                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
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
            const isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX.test(url);

            function getLocationOrigin() {
                const {
                    protocol,
                    hostname,
                    port
                } = window.location;
                return protocol + "//" + hostname + (port ? ":" + port : "");
            }

            function getURL() {
                const {
                    href
                } = window.location;
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
                if (false) {
                    var _App_prototype;
                }
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
                if (false) { }
                return props;
            }
            const SP = typeof performance !== "undefined";
            const ST = SP && [
                "mark",
                "measure",
                "getEntriesByName"
            ].every((method) => typeof performance[method] === "function");
            class DecodeError extends Error { }
            class NormalizeError extends Error { }
            class PageNotFoundError extends Error {
                constructor(page) {
                    super();
                    this.code = "ENOENT";
                    this.name = "PageNotFoundError";
                    this.message = "Cannot find module for page: " + page;
                }
            }
            class MissingStaticPage extends Error {
                constructor(page, message) {
                    super();
                    this.message = "Failed to load static file for page: " + page + " " + message;
                }
            }
            class MiddlewareNotFoundError extends Error {
                constructor() {
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


            /***/
        }),

    /***/
    2999:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            "use strict";

            module.exports = __webpack_require__(316).vendored.contexts.AmpContext;

            //# sourceMappingURL=amp-context.js.map

            /***/
        }),

    /***/
    5851:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            "use strict";

            module.exports = __webpack_require__(316).vendored.contexts.HeadManagerContext;

            //# sourceMappingURL=head-manager-context.js.map

            /***/
        }),

    /***/
    7927:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            "use strict";

            module.exports = __webpack_require__(316).vendored.contexts.ImageConfigContext;

            //# sourceMappingURL=image-config-context.js.map

            /***/
        }),

    /***/
    713:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            "use strict";

            module.exports = __webpack_require__(316).vendored.contexts.RouterContext;

            //# sourceMappingURL=router-context.js.map

            /***/
        }),

    /***/
    80:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            "use strict";

            module.exports = __webpack_require__(316).vendored["react-shared"].ReactJsxRuntime;

            //# sourceMappingURL=react-jsx-runtime.js.map

            /***/
        }),

    /***/
    2451:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            module.exports = __webpack_require__(8514)


            /***/
        }),

    /***/
    4334:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            "use strict";
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */



            var ReactPropTypesSecret = __webpack_require__(6066);

            function emptyFunction() { }

            function emptyFunctionWithReset() { }
            emptyFunctionWithReset.resetWarningCache = emptyFunction;

            module.exports = function () {
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


            /***/
        }),

    /***/
    5601:
        /***/
        ((module, __unused_webpack_exports, __webpack_require__) => {

            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            if (false) {
                var throwOnDirectAccess, ReactIs;
            } else {
                // By explicitly using `prop-types` you are opting into new production behavior.
                // http://fb.me/prop-types-in-prod
                module.exports = __webpack_require__(4334)();
            }


            /***/
        }),

    /***/
    6066:
        /***/
        ((module) => {

            "use strict";
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */



            var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

            module.exports = ReactPropTypesSecret;


            /***/
        }),

    /***/
    4622:
        /***/
        (function (__unused_webpack_module, exports, __webpack_require__) {

            ! function (e, t) {
                true ? t(exports, __webpack_require__(9885), __webpack_require__(5601)) : 0
            }(this, (function (e, t, n) {
                "use strict";

                function r(e) {
                    return e && "object" == typeof e && "default" in e ? e : {
                        default: e
                    }
                }
                var o = r(t),
                    i = r(n);

                function a(e, t) {
                    var n = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                        var r = Object.getOwnPropertySymbols(e);
                        t && (r = r.filter((function (t) {
                            return Object.getOwnPropertyDescriptor(e, t).enumerable
                        }))), n.push.apply(n, r)
                    }
                    return n
                }

                function c(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? a(Object(n), !0).forEach((function (t) {
                            u(e, t, n[t])
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach((function (t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                        }))
                    }
                    return e
                }

                function u(e, t, n) {
                    return t in e ? Object.defineProperty(e, t, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = n, e
                }

                function l(e, t) {
                    if (null == e) return {};
                    var n, r, o = function (e, t) {
                        if (null == e) return {};
                        var n, r, o = {},
                            i = Object.keys(e);
                        for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || (o[n] = e[n]);
                        return o
                    }(e, t);
                    if (Object.getOwnPropertySymbols) {
                        var i = Object.getOwnPropertySymbols(e);
                        for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n])
                    }
                    return o
                }

                function s(e, t) {
                    return function (e) {
                        if (Array.isArray(e)) return e
                    }(e) || function (e, t) {
                        var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                        if (null == n) return;
                        var r, o, i = [],
                            a = !0,
                            c = !1;
                        try {
                            for (n = n.call(e); !(a = (r = n.next()).done) && (i.push(r.value), !t || i.length !== t); a = !0);
                        } catch (e) {
                            c = !0, o = e
                        } finally {
                            try {
                                a || null == n.return || n.return()
                            } finally {
                                if (c) throw o
                            }
                        }
                        return i
                    }(e, t) || p(e, t) || function () {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function f(e) {
                    return function (e) {
                        if (Array.isArray(e)) return d(e)
                    }(e) || function (e) {
                        if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
                    }(e) || p(e) || function () {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function p(e, t) {
                    if (e) {
                        if ("string" == typeof e) return d(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? d(e, t) : void 0
                    }
                }

                function d(e, t) {
                    (null == t || t > e.length) && (t = e.length);
                    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                    return r
                }

                function v(e, t, n, r) {
                    return new (n || (n = Promise))((function (o, i) {
                        function a(e) {
                            try {
                                u(r.next(e))
                            } catch (e) {
                                i(e)
                            }
                        }

                        function c(e) {
                            try {
                                u(r.throw(e))
                            } catch (e) {
                                i(e)
                            }
                        }

                        function u(e) {
                            var t;
                            e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                                e(t)
                            }))).then(a, c)
                        }
                        u((r = r.apply(e, t || [])).next())
                    }))
                }

                function m(e, t) {
                    var n, r, o, i, a = {
                        label: 0,
                        sent: function () {
                            if (1 & o[0]) throw o[1];
                            return o[1]
                        },
                        trys: [],
                        ops: []
                    };
                    return i = {
                        next: c(0),
                        throw: c(1),
                        return: c(2)
                    }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
                        return this
                    }), i;

                    function c(i) {
                        return function (c) {
                            return function (i) {
                                if (n) throw new TypeError("Generator is already executing.");
                                for (; a;) try {
                                    if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                                    switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
                                        case 0:
                                        case 1:
                                            o = i;
                                            break;
                                        case 4:
                                            return a.label++, {
                                                value: i[1],
                                                done: !1
                                            };
                                        case 5:
                                            a.label++, r = i[1], i = [0];
                                            continue;
                                        case 7:
                                            i = a.ops.pop(), a.trys.pop();
                                            continue;
                                        default:
                                            if (!(o = a.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                                                a = 0;
                                                continue
                                            }
                                            if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
                                                a.label = i[1];
                                                break
                                            }
                                            if (6 === i[0] && a.label < o[1]) {
                                                a.label = o[1], o = i;
                                                break
                                            }
                                            if (o && a.label < o[2]) {
                                                a.label = o[2], a.ops.push(i);
                                                break
                                            }
                                            o[2] && a.ops.pop(), a.trys.pop();
                                            continue
                                    }
                                    i = t.call(e, a)
                                } catch (e) {
                                    i = [6, e], r = 0
                                } finally {
                                        n = o = 0
                                    }
                                if (5 & i[0]) throw i[1];
                                return {
                                    value: i[0] ? i[1] : void 0,
                                    done: !0
                                }
                            }([i, c])
                        }
                    }
                }

                function g(e, t) {
                    var n = "function" == typeof Symbol && e[Symbol.iterator];
                    if (!n) return e;
                    var r, o, i = n.call(e),
                        a = [];
                    try {
                        for (;
                            (void 0 === t || t-- > 0) && !(r = i.next()).done;) a.push(r.value)
                    } catch (e) {
                        o = {
                            error: e
                        }
                    } finally {
                        try {
                            r && !r.done && (n = i.return) && n.call(i)
                        } finally {
                            if (o) throw o.error
                        }
                    }
                    return a
                }

                function y(e, t, n) {
                    if (n || 2 === arguments.length)
                        for (var r, o = 0, i = t.length; o < i; o++) !r && o in t || (r || (r = Array.prototype.slice.call(t, 0, o)), r[o] = t[o]);
                    return e.concat(r || Array.prototype.slice.call(t))
                }
                var b = new Map([
                    ["aac", "audio/aac"],
                    ["abw", "application/x-abiword"],
                    ["arc", "application/x-freearc"],
                    ["avif", "image/avif"],
                    ["avi", "video/x-msvideo"],
                    ["azw", "application/vnd.amazon.ebook"],
                    ["bin", "application/octet-stream"],
                    ["bmp", "image/bmp"],
                    ["bz", "application/x-bzip"],
                    ["bz2", "application/x-bzip2"],
                    ["cda", "application/x-cdf"],
                    ["csh", "application/x-csh"],
                    ["css", "text/css"],
                    ["csv", "text/csv"],
                    ["doc", "application/msword"],
                    ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
                    ["eot", "application/vnd.ms-fontobject"],
                    ["epub", "application/epub+zip"],
                    ["gz", "application/gzip"],
                    ["gif", "image/gif"],
                    ["heic", "image/heic"],
                    ["heif", "image/heif"],
                    ["htm", "text/html"],
                    ["html", "text/html"],
                    ["ico", "image/vnd.microsoft.icon"],
                    ["ics", "text/calendar"],
                    ["jar", "application/java-archive"],
                    ["jpeg", "image/jpeg"],
                    ["jpg", "image/jpeg"],
                    ["js", "text/javascript"],
                    ["json", "application/json"],
                    ["jsonld", "application/ld+json"],
                    ["mid", "audio/midi"],
                    ["midi", "audio/midi"],
                    ["mjs", "text/javascript"],
                    ["mp3", "audio/mpeg"],
                    ["mp4", "video/mp4"],
                    ["mpeg", "video/mpeg"],
                    ["mpkg", "application/vnd.apple.installer+xml"],
                    ["odp", "application/vnd.oasis.opendocument.presentation"],
                    ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
                    ["odt", "application/vnd.oasis.opendocument.text"],
                    ["oga", "audio/ogg"],
                    ["ogv", "video/ogg"],
                    ["ogx", "application/ogg"],
                    ["opus", "audio/opus"],
                    ["otf", "font/otf"],
                    ["png", "image/png"],
                    ["pdf", "application/pdf"],
                    ["php", "application/x-httpd-php"],
                    ["ppt", "application/vnd.ms-powerpoint"],
                    ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
                    ["rar", "application/vnd.rar"],
                    ["rtf", "application/rtf"],
                    ["sh", "application/x-sh"],
                    ["svg", "image/svg+xml"],
                    ["swf", "application/x-shockwave-flash"],
                    ["tar", "application/x-tar"],
                    ["tif", "image/tiff"],
                    ["tiff", "image/tiff"],
                    ["ts", "video/mp2t"],
                    ["ttf", "font/ttf"],
                    ["txt", "text/plain"],
                    ["vsd", "application/vnd.visio"],
                    ["wav", "audio/wav"],
                    ["weba", "audio/webm"],
                    ["webm", "video/webm"],
                    ["webp", "image/webp"],
                    ["woff", "font/woff"],
                    ["woff2", "font/woff2"],
                    ["xhtml", "application/xhtml+xml"],
                    ["xls", "application/vnd.ms-excel"],
                    ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
                    ["xml", "application/xml"],
                    ["xul", "application/vnd.mozilla.xul+xml"],
                    ["zip", "application/zip"],
                    ["7z", "application/x-7z-compressed"],
                    ["mkv", "video/x-matroska"],
                    ["mov", "video/quicktime"],
                    ["msg", "application/vnd.ms-outlook"]
                ]);

                function h(e, t) {
                    var n = function (e) {
                        var t = e.name;
                        if (t && -1 !== t.lastIndexOf(".") && !e.type) {
                            var n = t.split(".").pop().toLowerCase(),
                                r = b.get(n);
                            r && Object.defineProperty(e, "type", {
                                value: r,
                                writable: !1,
                                configurable: !1,
                                enumerable: !0
                            })
                        }
                        return e
                    }(e);
                    if ("string" != typeof n.path) {
                        var r = e.webkitRelativePath;
                        Object.defineProperty(n, "path", {
                            value: "string" == typeof t ? t : "string" == typeof r && r.length > 0 ? r : e.name,
                            writable: !1,
                            configurable: !1,
                            enumerable: !0
                        })
                    }
                    return n
                }
                var w = [".DS_Store", "Thumbs.db"];

                function D(e) {
                    return "object" == typeof e && null !== e
                }

                function x(e) {
                    return O(e.target.files).map((function (e) {
                        return h(e)
                    }))
                }

                function F(e) {
                    return v(this, void 0, void 0, (function () {
                        return m(this, (function (t) {
                            switch (t.label) {
                                case 0:
                                    return [4, Promise.all(e.map((function (e) {
                                        return e.getFile()
                                    })))];
                                case 1:
                                    return [2, t.sent().map((function (e) {
                                        return h(e)
                                    }))]
                            }
                        }))
                    }))
                }

                function j(e, t) {
                    return v(this, void 0, void 0, (function () {
                        var n;
                        return m(this, (function (r) {
                            switch (r.label) {
                                case 0:
                                    return e.items ? (n = O(e.items).filter((function (e) {
                                        return "file" === e.kind
                                    })), "drop" !== t ? [2, n] : [4, Promise.all(n.map(E))]) : [3, 2];
                                case 1:
                                    return [2, A(k(r.sent()))];
                                case 2:
                                    return [2, A(O(e.files).map((function (e) {
                                        return h(e)
                                    })))]
                            }
                        }))
                    }))
                }

                function A(e) {
                    return e.filter((function (e) {
                        return -1 === w.indexOf(e.name)
                    }))
                }

                function O(e) {
                    if (null === e) return [];
                    for (var t = [], n = 0; n < e.length; n++) {
                        var r = e[n];
                        t.push(r)
                    }
                    return t
                }

                function E(e) {
                    if ("function" != typeof e.webkitGetAsEntry) return P(e);
                    var t = e.webkitGetAsEntry();
                    return t && t.isDirectory ? C(t) : P(e)
                }

                function k(e) {
                    return e.reduce((function (e, t) {
                        return y(y([], g(e), !1), g(Array.isArray(t) ? k(t) : [t]), !1)
                    }), [])
                }

                function P(e) {
                    var t = e.getAsFile();
                    if (!t) return Promise.reject("".concat(e, " is not a File"));
                    var n = h(t);
                    return Promise.resolve(n)
                }

                function S(e) {
                    return v(this, void 0, void 0, (function () {
                        return m(this, (function (t) {
                            return [2, e.isDirectory ? C(e) : z(e)]
                        }))
                    }))
                }

                function C(e) {
                    var t = e.createReader();
                    return new Promise((function (e, n) {
                        var r = [];
                        ! function o() {
                            var i = this;
                            t.readEntries((function (t) {
                                return v(i, void 0, void 0, (function () {
                                    var i, a, c;
                                    return m(this, (function (u) {
                                        switch (u.label) {
                                            case 0:
                                                if (t.length) return [3, 5];
                                                u.label = 1;
                                            case 1:
                                                return u.trys.push([1, 3, , 4]), [4, Promise.all(r)];
                                            case 2:
                                                return i = u.sent(), e(i), [3, 4];
                                            case 3:
                                                return a = u.sent(), n(a), [3, 4];
                                            case 4:
                                                return [3, 6];
                                            case 5:
                                                c = Promise.all(t.map(S)), r.push(c), o(), u.label = 6;
                                            case 6:
                                                return [2]
                                        }
                                    }))
                                }))
                            }), (function (e) {
                                n(e)
                            }))
                        }()
                    }))
                }

                function z(e) {
                    return v(this, void 0, void 0, (function () {
                        return m(this, (function (t) {
                            return [2, new Promise((function (t, n) {
                                e.file((function (n) {
                                    var r = h(n, e.fullPath);
                                    t(r)
                                }), (function (e) {
                                    n(e)
                                }))
                            }))]
                        }))
                    }))
                }
                var R = "file-invalid-type",
                    T = "file-too-large",
                    I = "file-too-small",
                    M = "too-many-files",
                    L = {
                        FileInvalidType: R,
                        FileTooLarge: T,
                        FileTooSmall: I,
                        TooManyFiles: M
                    },
                    _ = function (e) {
                        e = Array.isArray(e) && 1 === e.length ? e[0] : e;
                        var t = Array.isArray(e) ? "one of ".concat(e.join(", ")) : e;
                        return {
                            code: R,
                            message: "File type must be ".concat(t)
                        }
                    },
                    B = function (e) {
                        return {
                            code: T,
                            message: "File is larger than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                        }
                    },
                    K = function (e) {
                        return {
                            code: I,
                            message: "File is smaller than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                        }
                    },
                    q = {
                        code: M,
                        message: "Too many files"
                    };

                function U(e, t) {
                    var n = "application/x-moz-file" === e.type || function (e, t) {
                        if (e && t) {
                            var n = Array.isArray(t) ? t : t.split(","),
                                r = e.name || "",
                                o = (e.type || "").toLowerCase(),
                                i = o.replace(/\/.*$/, "");
                            return n.some((function (e) {
                                var t = e.trim().toLowerCase();
                                return "." === t.charAt(0) ? r.toLowerCase().endsWith(t) : t.endsWith("/*") ? i === t.replace(/\/.*$/, "") : o === t
                            }))
                        }
                        return !0
                    }(e, t);
                    return [n, n ? null : _(t)]
                }

                function W(e, t, n) {
                    if ($(e.size))
                        if ($(t) && $(n)) {
                            if (e.size > n) return [!1, B(n)];
                            if (e.size < t) return [!1, K(t)]
                        } else {
                            if ($(t) && e.size < t) return [!1, K(t)];
                            if ($(n) && e.size > n) return [!1, B(n)]
                        } return [!0, null]
                }

                function $(e) {
                    return null != e
                }

                function G(e) {
                    var t = e.files,
                        n = e.accept,
                        r = e.minSize,
                        o = e.maxSize,
                        i = e.multiple,
                        a = e.maxFiles,
                        c = e.validator;
                    return !(!i && t.length > 1 || i && a >= 1 && t.length > a) && t.every((function (e) {
                        var t = s(U(e, n), 1)[0],
                            i = s(W(e, r, o), 1)[0],
                            a = c ? c(e) : null;
                        return t && i && !a
                    }))
                }

                function H(e) {
                    return "function" == typeof e.isPropagationStopped ? e.isPropagationStopped() : void 0 !== e.cancelBubble && e.cancelBubble
                }

                function N(e) {
                    return e.dataTransfer ? Array.prototype.some.call(e.dataTransfer.types, (function (e) {
                        return "Files" === e || "application/x-moz-file" === e
                    })) : !!e.target && !!e.target.files
                }

                function Y(e) {
                    e.preventDefault()
                }

                function J(e) {
                    return -1 !== e.indexOf("MSIE") || -1 !== e.indexOf("Trident/")
                }

                function Q(e) {
                    return -1 !== e.indexOf("Edge/")
                }

                function V() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.navigator.userAgent;
                    return J(e) || Q(e)
                }

                function X() {
                    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                    return function (e) {
                        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) r[o - 1] = arguments[o];
                        return t.some((function (t) {
                            return !H(e) && t && t.apply(void 0, [e].concat(r)), H(e)
                        }))
                    }
                }

                function Z() {
                    return "showOpenFilePicker" in window
                }

                function ee(e) {
                    return $(e) ? [{
                        description: "Files",
                        accept: Object.entries(e).filter((function (e) {
                            var t = s(e, 2),
                                n = t[0],
                                r = t[1],
                                o = !0;
                            return oe(n) || (console.warn('Skipped "'.concat(n, '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')), o = !1), Array.isArray(r) && r.every(ie) || (console.warn('Skipped "'.concat(n, '" because an invalid file extension was provided.')), o = !1), o
                        })).reduce((function (e, t) {
                            var n = s(t, 2),
                                r = n[0],
                                o = n[1];
                            return c(c({}, e), {}, u({}, r, o))
                        }), {})
                    }] : e
                }

                function te(e) {
                    if ($(e)) return Object.entries(e).reduce((function (e, t) {
                        var n = s(t, 2),
                            r = n[0],
                            o = n[1];
                        return [].concat(f(e), [r], f(o))
                    }), []).filter((function (e) {
                        return oe(e) || ie(e)
                    })).join(",")
                }

                function ne(e) {
                    return e instanceof DOMException && ("AbortError" === e.name || e.code === e.ABORT_ERR)
                }

                function re(e) {
                    return e instanceof DOMException && ("SecurityError" === e.name || e.code === e.SECURITY_ERR)
                }

                function oe(e) {
                    return "audio/*" === e || "video/*" === e || "image/*" === e || "text/*" === e || /\w+\/[-+.\w]+/g.test(e)
                }

                function ie(e) {
                    return /^.*\.[\w]+$/.test(e)
                }
                var ae = ["children"],
                    ce = ["open"],
                    ue = ["refKey", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"],
                    le = ["refKey", "onChange", "onClick"],
                    se = t.forwardRef((function (e, n) {
                        var r = e.children,
                            i = de(l(e, ae)),
                            a = i.open,
                            u = l(i, ce);
                        return t.useImperativeHandle(n, (function () {
                            return {
                                open: a
                            }
                        }), [a]), o.default.createElement(t.Fragment, null, r(c(c({}, u), {}, {
                            open: a
                        })))
                    }));
                se.displayName = "Dropzone";
                var fe = {
                    disabled: !1,
                    getFilesFromEvent: function (e) {
                        return v(this, void 0, void 0, (function () {
                            return m(this, (function (t) {
                                return D(e) && D(e.dataTransfer) ? [2, j(e.dataTransfer, e.type)] : function (e) {
                                    return D(e) && D(e.target)
                                }(e) ? [2, x(e)] : Array.isArray(e) && e.every((function (e) {
                                    return "getFile" in e && "function" == typeof e.getFile
                                })) ? [2, F(e)] : [2, []]
                            }))
                        }))
                    },
                    maxSize: 1 / 0,
                    minSize: 0,
                    multiple: !0,
                    maxFiles: 0,
                    preventDropOnDocument: !0,
                    noClick: !1,
                    noKeyboard: !1,
                    noDrag: !1,
                    noDragEventsBubbling: !1,
                    validator: null,
                    useFsAccessApi: !0,
                    autoFocus: !1
                };
                se.defaultProps = fe, se.propTypes = {
                    children: i.default.func,
                    accept: i.default.objectOf(i.default.arrayOf(i.default.string)),
                    multiple: i.default.bool,
                    preventDropOnDocument: i.default.bool,
                    noClick: i.default.bool,
                    noKeyboard: i.default.bool,
                    noDrag: i.default.bool,
                    noDragEventsBubbling: i.default.bool,
                    minSize: i.default.number,
                    maxSize: i.default.number,
                    maxFiles: i.default.number,
                    disabled: i.default.bool,
                    getFilesFromEvent: i.default.func,
                    onFileDialogCancel: i.default.func,
                    onFileDialogOpen: i.default.func,
                    useFsAccessApi: i.default.bool,
                    autoFocus: i.default.bool,
                    onDragEnter: i.default.func,
                    onDragLeave: i.default.func,
                    onDragOver: i.default.func,
                    onDrop: i.default.func,
                    onDropAccepted: i.default.func,
                    onDropRejected: i.default.func,
                    onError: i.default.func,
                    validator: i.default.func
                };
                var pe = {
                    isFocused: !1,
                    isFileDialogActive: !1,
                    isDragActive: !1,
                    isDragAccept: !1,
                    isDragReject: !1,
                    acceptedFiles: [],
                    fileRejections: []
                };

                function de() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        n = c(c({}, fe), e),
                        r = n.accept,
                        o = n.disabled,
                        i = n.getFilesFromEvent,
                        a = n.maxSize,
                        p = n.minSize,
                        d = n.multiple,
                        v = n.maxFiles,
                        m = n.onDragEnter,
                        g = n.onDragLeave,
                        y = n.onDragOver,
                        b = n.onDrop,
                        h = n.onDropAccepted,
                        w = n.onDropRejected,
                        D = n.onFileDialogCancel,
                        x = n.onFileDialogOpen,
                        F = n.useFsAccessApi,
                        j = n.autoFocus,
                        A = n.preventDropOnDocument,
                        O = n.noClick,
                        E = n.noKeyboard,
                        k = n.noDrag,
                        P = n.noDragEventsBubbling,
                        S = n.onError,
                        C = n.validator,
                        z = t.useMemo((function () {
                            return te(r)
                        }), [r]),
                        R = t.useMemo((function () {
                            return ee(r)
                        }), [r]),
                        T = t.useMemo((function () {
                            return "function" == typeof x ? x : me
                        }), [x]),
                        I = t.useMemo((function () {
                            return "function" == typeof D ? D : me
                        }), [D]),
                        M = t.useRef(null),
                        L = t.useRef(null),
                        _ = t.useReducer(ve, pe),
                        B = s(_, 2),
                        K = B[0],
                        $ = B[1],
                        J = K.isFocused,
                        Q = K.isFileDialogActive,
                        oe = t.useRef("undefined" != typeof window && window.isSecureContext && F && Z()),
                        ie = function () {
                            !oe.current && Q && setTimeout((function () {
                                L.current && (L.current.files.length || ($({
                                    type: "closeDialog"
                                }), I()))
                            }), 300)
                        };
                    t.useEffect((function () {
                        return window.addEventListener("focus", ie, !1),
                            function () {
                                window.removeEventListener("focus", ie, !1)
                            }
                    }), [L, Q, I, oe]);
                    var ae = t.useRef([]),
                        ce = function (e) {
                            M.current && M.current.contains(e.target) || (e.preventDefault(), ae.current = [])
                        };
                    t.useEffect((function () {
                        return A && (document.addEventListener("dragover", Y, !1), document.addEventListener("drop", ce, !1)),
                            function () {
                                A && (document.removeEventListener("dragover", Y), document.removeEventListener("drop", ce))
                            }
                    }), [M, A]), t.useEffect((function () {
                        return !o && j && M.current && M.current.focus(),
                            function () { }
                    }), [M, j, o]);
                    var se = t.useCallback((function (e) {
                        S ? S(e) : console.error(e)
                    }), [S]),
                        de = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e), ae.current = [].concat(f(ae.current), [e.target]), N(e) && Promise.resolve(i(e)).then((function (t) {
                                if (!H(e) || P) {
                                    var n = t.length,
                                        r = n > 0 && G({
                                            files: t,
                                            accept: z,
                                            minSize: p,
                                            maxSize: a,
                                            multiple: d,
                                            maxFiles: v,
                                            validator: C
                                        });
                                    $({
                                        isDragAccept: r,
                                        isDragReject: n > 0 && !r,
                                        isDragActive: !0,
                                        type: "setDraggedFiles"
                                    }), m && m(e)
                                }
                            })).catch((function (e) {
                                return se(e)
                            }))
                        }), [i, m, se, P, z, p, a, d, v, C]),
                        ge = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e);
                            var t = N(e);
                            if (t && e.dataTransfer) try {
                                e.dataTransfer.dropEffect = "copy"
                            } catch (e) { }
                            return t && y && y(e), !1
                        }), [y, P]),
                        ye = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e);
                            var t = ae.current.filter((function (e) {
                                return M.current && M.current.contains(e)
                            })),
                                n = t.indexOf(e.target); - 1 !== n && t.splice(n, 1), ae.current = t, t.length > 0 || ($({
                                    type: "setDraggedFiles",
                                    isDragActive: !1,
                                    isDragAccept: !1,
                                    isDragReject: !1
                                }), N(e) && g && g(e))
                        }), [M, g, P]),
                        be = t.useCallback((function (e, t) {
                            var n = [],
                                r = [];
                            e.forEach((function (e) {
                                var t = s(U(e, z), 2),
                                    o = t[0],
                                    i = t[1],
                                    c = s(W(e, p, a), 2),
                                    u = c[0],
                                    l = c[1],
                                    f = C ? C(e) : null;
                                if (o && u && !f) n.push(e);
                                else {
                                    var d = [i, l];
                                    f && (d = d.concat(f)), r.push({
                                        file: e,
                                        errors: d.filter((function (e) {
                                            return e
                                        }))
                                    })
                                }
                            })), (!d && n.length > 1 || d && v >= 1 && n.length > v) && (n.forEach((function (e) {
                                r.push({
                                    file: e,
                                    errors: [q]
                                })
                            })), n.splice(0)), $({
                                acceptedFiles: n,
                                fileRejections: r,
                                type: "setFiles"
                            }), b && b(n, r, t), r.length > 0 && w && w(r, t), n.length > 0 && h && h(n, t)
                        }), [$, d, z, p, a, v, b, h, w, C]),
                        he = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e), ae.current = [], N(e) && Promise.resolve(i(e)).then((function (t) {
                                H(e) && !P || be(t, e)
                            })).catch((function (e) {
                                return se(e)
                            })), $({
                                type: "reset"
                            })
                        }), [i, be, se, P]),
                        we = t.useCallback((function () {
                            if (oe.current) {
                                $({
                                    type: "openDialog"
                                }), T();
                                var e = {
                                    multiple: d,
                                    types: R
                                };
                                window.showOpenFilePicker(e).then((function (e) {
                                    return i(e)
                                })).then((function (e) {
                                    be(e, null), $({
                                        type: "closeDialog"
                                    })
                                })).catch((function (e) {
                                    ne(e) ? (I(e), $({
                                        type: "closeDialog"
                                    })) : re(e) ? (oe.current = !1, L.current ? (L.current.value = null, L.current.click()) : se(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))) : se(e)
                                }))
                            } else L.current && ($({
                                type: "openDialog"
                            }), T(), L.current.value = null, L.current.click())
                        }), [$, T, I, F, be, se, R, d]),
                        De = t.useCallback((function (e) {
                            M.current && M.current.isEqualNode(e.target) && (" " !== e.key && "Enter" !== e.key && 32 !== e.keyCode && 13 !== e.keyCode || (e.preventDefault(), we()))
                        }), [M, we]),
                        xe = t.useCallback((function () {
                            $({
                                type: "focus"
                            })
                        }), []),
                        Fe = t.useCallback((function () {
                            $({
                                type: "blur"
                            })
                        }), []),
                        je = t.useCallback((function () {
                            O || (V() ? setTimeout(we, 0) : we())
                        }), [O, we]),
                        Ae = function (e) {
                            return o ? null : e
                        },
                        Oe = function (e) {
                            return E ? null : Ae(e)
                        },
                        Ee = function (e) {
                            return k ? null : Ae(e)
                        },
                        ke = function (e) {
                            P && e.stopPropagation()
                        },
                        Pe = t.useMemo((function () {
                            return function () {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                                    t = e.refKey,
                                    n = void 0 === t ? "ref" : t,
                                    r = e.role,
                                    i = e.onKeyDown,
                                    a = e.onFocus,
                                    s = e.onBlur,
                                    f = e.onClick,
                                    p = e.onDragEnter,
                                    d = e.onDragOver,
                                    v = e.onDragLeave,
                                    m = e.onDrop,
                                    g = l(e, ue);
                                return c(c(u({
                                    onKeyDown: Oe(X(i, De)),
                                    onFocus: Oe(X(a, xe)),
                                    onBlur: Oe(X(s, Fe)),
                                    onClick: Ae(X(f, je)),
                                    onDragEnter: Ee(X(p, de)),
                                    onDragOver: Ee(X(d, ge)),
                                    onDragLeave: Ee(X(v, ye)),
                                    onDrop: Ee(X(m, he)),
                                    role: "string" == typeof r && "" !== r ? r : "presentation"
                                }, n, M), o || E ? {} : {
                                    tabIndex: 0
                                }), g)
                            }
                        }), [M, De, xe, Fe, je, de, ge, ye, he, E, k, o]),
                        Se = t.useCallback((function (e) {
                            e.stopPropagation()
                        }), []),
                        Ce = t.useMemo((function () {
                            return function () {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                                    t = e.refKey,
                                    n = void 0 === t ? "ref" : t,
                                    r = e.onChange,
                                    o = e.onClick,
                                    i = l(e, le),
                                    a = u({
                                        accept: z,
                                        multiple: d,
                                        type: "file",
                                        style: {
                                            display: "none"
                                        },
                                        onChange: Ae(X(r, he)),
                                        onClick: Ae(X(o, Se)),
                                        tabIndex: -1
                                    }, n, L);
                                return c(c({}, a), i)
                            }
                        }), [L, r, d, he, o]);
                    return c(c({}, K), {}, {
                        isFocused: J && !o,
                        getRootProps: Pe,
                        getInputProps: Ce,
                        rootRef: M,
                        inputRef: L,
                        open: Ae(we)
                    })
                }

                function ve(e, t) {
                    switch (t.type) {
                        case "focus":
                            return c(c({}, e), {}, {
                                isFocused: !0
                            });
                        case "blur":
                            return c(c({}, e), {}, {
                                isFocused: !1
                            });
                        case "openDialog":
                            return c(c({}, pe), {}, {
                                isFileDialogActive: !0
                            });
                        case "closeDialog":
                            return c(c({}, e), {}, {
                                isFileDialogActive: !1
                            });
                        case "setDraggedFiles":
                            return c(c({}, e), {}, {
                                isDragActive: t.isDragActive,
                                isDragAccept: t.isDragAccept,
                                isDragReject: t.isDragReject
                            });
                        case "setFiles":
                            return c(c({}, e), {}, {
                                acceptedFiles: t.acceptedFiles,
                                fileRejections: t.fileRejections
                            });
                        case "reset":
                            return c({}, pe);
                        default:
                            return e
                    }
                }

                function me() { }
                e.ErrorCode = L, e.default = se, e.useDropzone = de, Object.defineProperty(e, "__esModule", {
                    value: !0
                })
            }));


            /***/
        })

};;