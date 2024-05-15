"use strict";
exports.id = 451;
exports.ids = [451];
exports.modules = {

/***/ 4451:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
    Head: function() {
        return Head;
    },
    Html: function() {
        return Html;
    },
    Main: function() {
        return Main;
    },
    NextScript: function() {
        return NextScript;
    },
    /**
 * `Document` component handles the initial `document` markup and renders only on the server side.
 * Commonly used for implementing server side rendering for `css-in-js` libraries.
 */ default: function() {
        return Document;
    }
});
const _jsxruntime = __webpack_require__(997);
const _react = /*#__PURE__*/ _interop_require_wildcard(__webpack_require__(6689));
const _constants = __webpack_require__(6537);
const _getpagefiles = __webpack_require__(1021);
const _htmlescape = __webpack_require__(6280);
const _iserror = /*#__PURE__*/ _interop_require_default(__webpack_require__(6896));
const _htmlcontextsharedruntime = __webpack_require__(8392);
const _encodeuripath = __webpack_require__(7926);
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
/** Set of pages that have triggered a large data warning on production mode. */ const largePageDataWarnings = new Set();
function getDocumentFiles(buildManifest, pathname, inAmpMode) {
    const sharedFiles = (0, _getpagefiles.getPageFiles)(buildManifest, "/_app");
    const pageFiles =  true && inAmpMode ? [] : (0, _getpagefiles.getPageFiles)(buildManifest, pathname);
    return {
        sharedFiles,
        pageFiles,
        allFiles: [
            ...new Set([
                ...sharedFiles,
                ...pageFiles
            ])
        ]
    };
}
function getPolyfillScripts(context, props) {
    // polyfills.js has to be rendered as nomodule without async
    // It also has to be the first script to load
    const { assetPrefix, buildManifest, assetQueryString, disableOptimizedLoading, crossOrigin } = context;
    return buildManifest.polyfillFiles.filter((polyfill)=>polyfill.endsWith(".js") && !polyfill.endsWith(".module.js")).map((polyfill)=>/*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
            defer: !disableOptimizedLoading,
            nonce: props.nonce,
            crossOrigin: props.crossOrigin || crossOrigin,
            noModule: true,
            src: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(polyfill)}${assetQueryString}`
        }, polyfill));
}
function hasComponentProps(child) {
    return !!child && !!child.props;
}
function AmpStyles({ styles }) {
    if (!styles) return null;
    // try to parse styles from fragment for backwards compat
    const curStyles = Array.isArray(styles) ? styles : [];
    if (styles.props && // @ts-ignore Property 'props' does not exist on type ReactElement
    Array.isArray(styles.props.children)) {
        const hasStyles = (el)=>{
            var _el_props_dangerouslySetInnerHTML, _el_props;
            return el == null ? void 0 : (_el_props = el.props) == null ? void 0 : (_el_props_dangerouslySetInnerHTML = _el_props.dangerouslySetInnerHTML) == null ? void 0 : _el_props_dangerouslySetInnerHTML.__html;
        };
        // @ts-ignore Property 'props' does not exist on type ReactElement
        styles.props.children.forEach((child)=>{
            if (Array.isArray(child)) {
                child.forEach((el)=>hasStyles(el) && curStyles.push(el));
            } else if (hasStyles(child)) {
                curStyles.push(child);
            }
        });
    }
    /* Add custom styles before AMP styles to prevent accidental overrides */ return /*#__PURE__*/ (0, _jsxruntime.jsx)("style", {
        "amp-custom": "",
        dangerouslySetInnerHTML: {
            __html: curStyles.map((style)=>style.props.dangerouslySetInnerHTML.__html).join("").replace(/\/\*# sourceMappingURL=.*\*\//g, "").replace(/\/\*@ sourceURL=.*?\*\//g, "")
        }
    });
}
function getDynamicChunks(context, props, files) {
    const { dynamicImports, assetPrefix, isDevelopment, assetQueryString, disableOptimizedLoading, crossOrigin } = context;
    return dynamicImports.map((file)=>{
        if (!file.endsWith(".js") || files.allFiles.includes(file)) return null;
        return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
            async: !isDevelopment && disableOptimizedLoading,
            defer: !disableOptimizedLoading,
            src: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
            nonce: props.nonce,
            crossOrigin: props.crossOrigin || crossOrigin
        }, file);
    });
}
function getScripts(context, props, files) {
    var _buildManifest_lowPriorityFiles;
    const { assetPrefix, buildManifest, isDevelopment, assetQueryString, disableOptimizedLoading, crossOrigin } = context;
    const normalScripts = files.allFiles.filter((file)=>file.endsWith(".js"));
    const lowPriorityScripts = (_buildManifest_lowPriorityFiles = buildManifest.lowPriorityFiles) == null ? void 0 : _buildManifest_lowPriorityFiles.filter((file)=>file.endsWith(".js"));
    return [
        ...normalScripts,
        ...lowPriorityScripts
    ].map((file)=>{
        return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
            src: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
            nonce: props.nonce,
            async: !isDevelopment && disableOptimizedLoading,
            defer: !disableOptimizedLoading,
            crossOrigin: props.crossOrigin || crossOrigin
        }, file);
    });
}
function getPreNextWorkerScripts(context, props) {
    const { assetPrefix, scriptLoader, crossOrigin, nextScriptWorkers } = context;
    // disable `nextScriptWorkers` in edge runtime
    if (!nextScriptWorkers || "nodejs" === "edge") return null;
    try {
        let { partytownSnippet } = require("@builder.io/partytown/integration");
        const children = Array.isArray(props.children) ? props.children : [
            props.children
        ];
        // Check to see if the user has defined their own Partytown configuration
        const userDefinedConfig = children.find((child)=>{
            var _child_props_dangerouslySetInnerHTML, _child_props;
            return hasComponentProps(child) && (child == null ? void 0 : (_child_props = child.props) == null ? void 0 : (_child_props_dangerouslySetInnerHTML = _child_props.dangerouslySetInnerHTML) == null ? void 0 : _child_props_dangerouslySetInnerHTML.__html.length) && "data-partytown-config" in child.props;
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                !userDefinedConfig && /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    "data-partytown-config": "",
                    dangerouslySetInnerHTML: {
                        __html: `
            partytown = {
              lib: "${assetPrefix}/_next/static/~partytown/"
            };
          `
                    }
                }),
                /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    "data-partytown": "",
                    dangerouslySetInnerHTML: {
                        __html: partytownSnippet()
                    }
                }),
                (scriptLoader.worker || []).map((file, index)=>{
                    const { strategy, src, children: scriptChildren, dangerouslySetInnerHTML, ...scriptProps } = file;
                    let srcProps = {};
                    if (src) {
                        // Use external src if provided
                        srcProps.src = src;
                    } else if (dangerouslySetInnerHTML && dangerouslySetInnerHTML.__html) {
                        // Embed inline script if provided with dangerouslySetInnerHTML
                        srcProps.dangerouslySetInnerHTML = {
                            __html: dangerouslySetInnerHTML.__html
                        };
                    } else if (scriptChildren) {
                        // Embed inline script if provided with children
                        srcProps.dangerouslySetInnerHTML = {
                            __html: typeof scriptChildren === "string" ? scriptChildren : Array.isArray(scriptChildren) ? scriptChildren.join("") : ""
                        };
                    } else {
                        throw new Error("Invalid usage of next/script. Did you forget to include a src attribute or an inline script? https://nextjs.org/docs/messages/invalid-script");
                    }
                    return /*#__PURE__*/ (0, _react.createElement)("script", {
                        ...srcProps,
                        ...scriptProps,
                        type: "text/partytown",
                        key: src || index,
                        nonce: props.nonce,
                        "data-nscript": "worker",
                        crossOrigin: props.crossOrigin || crossOrigin
                    });
                })
            ]
        });
    } catch (err) {
        if ((0, _iserror.default)(err) && err.code !== "MODULE_NOT_FOUND") {
            console.warn(`Warning: ${err.message}`);
        }
        return null;
    }
}
function getPreNextScripts(context, props) {
    const { scriptLoader, disableOptimizedLoading, crossOrigin } = context;
    const webWorkerScripts = getPreNextWorkerScripts(context, props);
    const beforeInteractiveScripts = (scriptLoader.beforeInteractive || []).filter((script)=>script.src).map((file, index)=>{
        const { strategy, ...scriptProps } = file;
        return /*#__PURE__*/ (0, _react.createElement)("script", {
            ...scriptProps,
            key: scriptProps.src || index,
            defer: scriptProps.defer ?? !disableOptimizedLoading,
            nonce: props.nonce,
            "data-nscript": "beforeInteractive",
            crossOrigin: props.crossOrigin || crossOrigin
        });
    });
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
        children: [
            webWorkerScripts,
            beforeInteractiveScripts
        ]
    });
}
function getHeadHTMLProps(props) {
    const { crossOrigin, nonce, ...restProps } = props;
    // This assignment is necessary for additional type checking to avoid unsupported attributes in <head>
    const headProps = restProps;
    return headProps;
}
function getAmpPath(ampPath, asPath) {
    return ampPath || `${asPath}${asPath.includes("?") ? "&" : "?"}amp=1`;
}
function getNextFontLinkTags(nextFontManifest, dangerousAsPath, assetPrefix = "") {
    if (!nextFontManifest) {
        return {
            preconnect: null,
            preload: null
        };
    }
    const appFontsEntry = nextFontManifest.pages["/_app"];
    const pageFontsEntry = nextFontManifest.pages[dangerousAsPath];
    const preloadedFontFiles = Array.from(new Set([
        ...appFontsEntry ?? [],
        ...pageFontsEntry ?? []
    ]));
    // If no font files should preload but there's an entry for the path, add a preconnect tag.
    const preconnectToSelf = !!(preloadedFontFiles.length === 0 && (appFontsEntry || pageFontsEntry));
    return {
        preconnect: preconnectToSelf ? /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
            "data-next-font": nextFontManifest.pagesUsingSizeAdjust ? "size-adjust" : "",
            rel: "preconnect",
            href: "/",
            crossOrigin: "anonymous"
        }) : null,
        preload: preloadedFontFiles ? preloadedFontFiles.map((fontFile)=>{
            const ext = /\.(woff|woff2|eot|ttf|otf)$/.exec(fontFile)[1];
            return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                rel: "preload",
                href: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(fontFile)}`,
                as: "font",
                type: `font/${ext}`,
                crossOrigin: "anonymous",
                "data-next-font": fontFile.includes("-s") ? "size-adjust" : ""
            }, fontFile);
        }) : null
    };
}
class Head extends _react.default.Component {
    static #_ = this.contextType = _htmlcontextsharedruntime.HtmlContext;
    getCssLinks(files) {
        const { assetPrefix, assetQueryString, dynamicImports, crossOrigin, optimizeCss, optimizeFonts } = this.context;
        const cssFiles = files.allFiles.filter((f)=>f.endsWith(".css"));
        const sharedFiles = new Set(files.sharedFiles);
        // Unmanaged files are CSS files that will be handled directly by the
        // webpack runtime (`mini-css-extract-plugin`).
        let unmangedFiles = new Set([]);
        let dynamicCssFiles = Array.from(new Set(dynamicImports.filter((file)=>file.endsWith(".css"))));
        if (dynamicCssFiles.length) {
            const existing = new Set(cssFiles);
            dynamicCssFiles = dynamicCssFiles.filter((f)=>!(existing.has(f) || sharedFiles.has(f)));
            unmangedFiles = new Set(dynamicCssFiles);
            cssFiles.push(...dynamicCssFiles);
        }
        let cssLinkElements = [];
        cssFiles.forEach((file)=>{
            const isSharedFile = sharedFiles.has(file);
            if (!optimizeCss) {
                cssLinkElements.push(/*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
                    as: "style",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                }, `${file}-preload`));
            }
            const isUnmanagedFile = unmangedFiles.has(file);
            cssLinkElements.push(/*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                nonce: this.props.nonce,
                rel: "stylesheet",
                href: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
                crossOrigin: this.props.crossOrigin || crossOrigin,
                "data-n-g": isUnmanagedFile ? undefined : isSharedFile ? "" : undefined,
                "data-n-p": isUnmanagedFile ? undefined : isSharedFile ? undefined : ""
            }, file));
        });
        if ( true && optimizeFonts) {
            cssLinkElements = this.makeStylesheetInert(cssLinkElements);
        }
        return cssLinkElements.length === 0 ? null : cssLinkElements;
    }
    getPreloadDynamicChunks() {
        const { dynamicImports, assetPrefix, assetQueryString, crossOrigin } = this.context;
        return dynamicImports.map((file)=>{
            if (!file.endsWith(".js")) {
                return null;
            }
            return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                rel: "preload",
                href: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
                as: "script",
                nonce: this.props.nonce,
                crossOrigin: this.props.crossOrigin || crossOrigin
            }, file);
        }) // Filter out nulled scripts
        .filter(Boolean);
    }
    getPreloadMainLinks(files) {
        const { assetPrefix, assetQueryString, scriptLoader, crossOrigin } = this.context;
        const preloadFiles = files.allFiles.filter((file)=>{
            return file.endsWith(".js");
        });
        return [
            ...(scriptLoader.beforeInteractive || []).map((file)=>/*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: file.src,
                    as: "script",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                }, file.src)),
            ...preloadFiles.map((file)=>/*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
                    as: "script",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                }, file))
        ];
    }
    getBeforeInteractiveInlineScripts() {
        const { scriptLoader } = this.context;
        const { nonce, crossOrigin } = this.props;
        return (scriptLoader.beforeInteractive || []).filter((script)=>!script.src && (script.dangerouslySetInnerHTML || script.children)).map((file, index)=>{
            const { strategy, children, dangerouslySetInnerHTML, src, ...scriptProps } = file;
            let html = "";
            if (dangerouslySetInnerHTML && dangerouslySetInnerHTML.__html) {
                html = dangerouslySetInnerHTML.__html;
            } else if (children) {
                html = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
            }
            return /*#__PURE__*/ (0, _react.createElement)("script", {
                ...scriptProps,
                dangerouslySetInnerHTML: {
                    __html: html
                },
                key: scriptProps.id || index,
                nonce: nonce,
                "data-nscript": "beforeInteractive",
                crossOrigin: crossOrigin || undefined
            });
        });
    }
    getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files);
    }
    getPreNextScripts() {
        return getPreNextScripts(this.context, this.props);
    }
    getScripts(files) {
        return getScripts(this.context, this.props, files);
    }
    getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props);
    }
    makeStylesheetInert(node) {
        return _react.default.Children.map(node, (c)=>{
            var _c_props, _c_props1;
            if ((c == null ? void 0 : c.type) === "link" && (c == null ? void 0 : (_c_props = c.props) == null ? void 0 : _c_props.href) && _constants.OPTIMIZED_FONT_PROVIDERS.some(({ url })=>{
                var _c_props_href, _c_props;
                return c == null ? void 0 : (_c_props = c.props) == null ? void 0 : (_c_props_href = _c_props.href) == null ? void 0 : _c_props_href.startsWith(url);
            })) {
                const newProps = {
                    ...c.props || {},
                    "data-href": c.props.href,
                    href: undefined
                };
                return /*#__PURE__*/ _react.default.cloneElement(c, newProps);
            } else if (c == null ? void 0 : (_c_props1 = c.props) == null ? void 0 : _c_props1.children) {
                const newProps = {
                    ...c.props || {},
                    children: this.makeStylesheetInert(c.props.children)
                };
                return /*#__PURE__*/ _react.default.cloneElement(c, newProps);
            }
            return c;
        // @types/react bug. Returned value from .map will not be `null` if you pass in `[null]`
        }).filter(Boolean);
    }
    render() {
        const { styles, ampPath, inAmpMode, hybridAmp, canonicalBase, __NEXT_DATA__, dangerousAsPath, headTags, unstable_runtimeJS, unstable_JsPreload, disableOptimizedLoading, optimizeCss, optimizeFonts, assetPrefix, nextFontManifest } = this.context;
        const disableRuntimeJS = unstable_runtimeJS === false;
        const disableJsPreload = unstable_JsPreload === false || !disableOptimizedLoading;
        this.context.docComponentsRendered.Head = true;
        let { head } = this.context;
        let cssPreloads = [];
        let otherHeadElements = [];
        if (head) {
            head.forEach((child)=>{
                if (child && child.type === "link" && child.props["rel"] === "preload" && child.props["as"] === "style") {
                    if (this.context.strictNextHead) {
                        cssPreloads.push(/*#__PURE__*/ _react.default.cloneElement(child, {
                            "data-next-head": ""
                        }));
                    } else {
                        cssPreloads.push(child);
                    }
                } else {
                    if (child) {
                        if (this.context.strictNextHead) {
                            otherHeadElements.push(/*#__PURE__*/ _react.default.cloneElement(child, {
                                "data-next-head": ""
                            }));
                        } else {
                            otherHeadElements.push(child);
                        }
                    }
                }
            });
            head = cssPreloads.concat(otherHeadElements);
        }
        let children = _react.default.Children.toArray(this.props.children).filter(Boolean);
        // show a warning if Head contains <title> (only in development)
        if (false) {}
        if ( true && optimizeFonts && !( true && inAmpMode)) {
            children = this.makeStylesheetInert(children);
        }
        let hasAmphtmlRel = false;
        let hasCanonicalRel = false;
        // show warning and remove conflicting amp head tags
        head = _react.default.Children.map(head || [], (child)=>{
            if (!child) return child;
            const { type, props } = child;
            if ( true && inAmpMode) {
                let badProp = "";
                if (type === "meta" && props.name === "viewport") {
                    badProp = 'name="viewport"';
                } else if (type === "link" && props.rel === "canonical") {
                    hasCanonicalRel = true;
                } else if (type === "script") {
                    // only block if
                    // 1. it has a src and isn't pointing to ampproject's CDN
                    // 2. it is using dangerouslySetInnerHTML without a type or
                    // a type of text/javascript
                    if (props.src && props.src.indexOf("ampproject") < -1 || props.dangerouslySetInnerHTML && (!props.type || props.type === "text/javascript")) {
                        badProp = "<script";
                        Object.keys(props).forEach((prop)=>{
                            badProp += ` ${prop}="${props[prop]}"`;
                        });
                        badProp += "/>";
                    }
                }
                if (badProp) {
                    console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://nextjs.org/docs/messages/conflicting-amp-tag`);
                    return null;
                }
            } else {
                // non-amp mode
                if (type === "link" && props.rel === "amphtml") {
                    hasAmphtmlRel = true;
                }
            }
            return child;
        // @types/react bug. Returned value from .map will not be `null` if you pass in `[null]`
        });
        const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page,  true && inAmpMode);
        const nextFontLinkTags = getNextFontLinkTags(nextFontManifest, dangerousAsPath, assetPrefix);
        return /*#__PURE__*/ (0, _jsxruntime.jsxs)("head", {
            ...getHeadHTMLProps(this.props),
            children: [
                this.context.isDevelopment && /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                    children: [
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("style", {
                            "data-next-hide-fouc": true,
                            "data-ampdevmode":  true && inAmpMode ? "true" : undefined,
                            dangerouslySetInnerHTML: {
                                __html: `body{display:none}`
                            }
                        }),
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("noscript", {
                            "data-next-hide-fouc": true,
                            "data-ampdevmode":  true && inAmpMode ? "true" : undefined,
                            children: /*#__PURE__*/ (0, _jsxruntime.jsx)("style", {
                                dangerouslySetInnerHTML: {
                                    __html: `body{display:block}`
                                }
                            })
                        })
                    ]
                }),
                head,
                this.context.strictNextHead ? null : /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
                    name: "next-head-count",
                    content: _react.default.Children.count(head || []).toString()
                }),
                children,
                optimizeFonts && /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
                    name: "next-font-preconnect"
                }),
                nextFontLinkTags.preconnect,
                nextFontLinkTags.preload,
                 true && inAmpMode && /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                    children: [
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
                            name: "viewport",
                            content: "width=device-width,minimum-scale=1,initial-scale=1"
                        }),
                        !hasCanonicalRel && /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                            rel: "canonical",
                            href: canonicalBase + (__webpack_require__(3454).cleanAmpPath)(dangerousAsPath)
                        }),
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                            rel: "preload",
                            as: "script",
                            href: "https://cdn.ampproject.org/v0.js"
                        }),
                        /*#__PURE__*/ (0, _jsxruntime.jsx)(AmpStyles, {
                            styles: styles
                        }),
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("style", {
                            "amp-boilerplate": "",
                            dangerouslySetInnerHTML: {
                                __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
                            }
                        }),
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("noscript", {
                            children: /*#__PURE__*/ (0, _jsxruntime.jsx)("style", {
                                "amp-boilerplate": "",
                                dangerouslySetInnerHTML: {
                                    __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`
                                }
                            })
                        }),
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                            async: true,
                            src: "https://cdn.ampproject.org/v0.js"
                        })
                    ]
                }),
                !( true && inAmpMode) && /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                    children: [
                        !hasAmphtmlRel && hybridAmp && /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                            rel: "amphtml",
                            href: canonicalBase + getAmpPath(ampPath, dangerousAsPath)
                        }),
                        this.getBeforeInteractiveInlineScripts(),
                        !optimizeCss && this.getCssLinks(files),
                        !optimizeCss && /*#__PURE__*/ (0, _jsxruntime.jsx)("noscript", {
                            "data-n-css": this.props.nonce ?? ""
                        }),
                        !disableRuntimeJS && !disableJsPreload && this.getPreloadDynamicChunks(),
                        !disableRuntimeJS && !disableJsPreload && this.getPreloadMainLinks(files),
                        !disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(),
                        !disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(),
                        !disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files),
                        !disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files),
                        optimizeCss && this.getCssLinks(files),
                        optimizeCss && /*#__PURE__*/ (0, _jsxruntime.jsx)("noscript", {
                            "data-n-css": this.props.nonce ?? ""
                        }),
                        this.context.isDevelopment && // this element is used to mount development styles so the
                        // ordering matches production
                        // (by default, style-loader injects at the bottom of <head />)
                        /*#__PURE__*/ (0, _jsxruntime.jsx)("noscript", {
                            id: "__next_css__DO_NOT_USE__"
                        }),
                        styles || null
                    ]
                }),
                /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, {}, ...headTags || [])
            ]
        });
    }
}
function handleDocumentScriptLoaderItems(scriptLoader, __NEXT_DATA__, props) {
    var _children_find_props, _children_find, _children_find_props1, _children_find1;
    if (!props.children) return;
    const scriptLoaderItems = [];
    const children = Array.isArray(props.children) ? props.children : [
        props.children
    ];
    const headChildren = (_children_find = children.find((child)=>child.type === Head)) == null ? void 0 : (_children_find_props = _children_find.props) == null ? void 0 : _children_find_props.children;
    const bodyChildren = (_children_find1 = children.find((child)=>child.type === "body")) == null ? void 0 : (_children_find_props1 = _children_find1.props) == null ? void 0 : _children_find_props1.children;
    // Scripts with beforeInteractive can be placed inside Head or <body> so children of both needs to be traversed
    const combinedChildren = [
        ...Array.isArray(headChildren) ? headChildren : [
            headChildren
        ],
        ...Array.isArray(bodyChildren) ? bodyChildren : [
            bodyChildren
        ]
    ];
    _react.default.Children.forEach(combinedChildren, (child)=>{
        var _child_type;
        if (!child) return;
        // When using the `next/script` component, register it in script loader.
        if ((_child_type = child.type) == null ? void 0 : _child_type.__nextScript) {
            if (child.props.strategy === "beforeInteractive") {
                scriptLoader.beforeInteractive = (scriptLoader.beforeInteractive || []).concat([
                    {
                        ...child.props
                    }
                ]);
                return;
            } else if ([
                "lazyOnload",
                "afterInteractive",
                "worker"
            ].includes(child.props.strategy)) {
                scriptLoaderItems.push(child.props);
                return;
            }
        }
    });
    __NEXT_DATA__.scriptLoader = scriptLoaderItems;
}
class NextScript extends _react.default.Component {
    static #_ = this.contextType = _htmlcontextsharedruntime.HtmlContext;
    getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files);
    }
    getPreNextScripts() {
        return getPreNextScripts(this.context, this.props);
    }
    getScripts(files) {
        return getScripts(this.context, this.props, files);
    }
    getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props);
    }
    static getInlineScriptSource(context) {
        const { __NEXT_DATA__, largePageDataBytes } = context;
        try {
            const data = JSON.stringify(__NEXT_DATA__);
            if (largePageDataWarnings.has(__NEXT_DATA__.page)) {
                return (0, _htmlescape.htmlEscapeJsonString)(data);
            }
            const bytes =  false ? 0 : Buffer.from(data).byteLength;
            const prettyBytes = (__webpack_require__(6793)/* ["default"] */ .Z);
            if (largePageDataBytes && bytes > largePageDataBytes) {
                if (true) {
                    largePageDataWarnings.add(__NEXT_DATA__.page);
                }
                console.warn(`Warning: data for page "${__NEXT_DATA__.page}"${__NEXT_DATA__.page === context.dangerousAsPath ? "" : ` (path "${context.dangerousAsPath}")`} is ${prettyBytes(bytes)} which exceeds the threshold of ${prettyBytes(largePageDataBytes)}, this amount of data can reduce performance.\nSee more info here: https://nextjs.org/docs/messages/large-page-data`);
            }
            return (0, _htmlescape.htmlEscapeJsonString)(data);
        } catch (err) {
            if ((0, _iserror.default)(err) && err.message.indexOf("circular structure") !== -1) {
                throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`);
            }
            throw err;
        }
    }
    render() {
        const { assetPrefix, inAmpMode, buildManifest, unstable_runtimeJS, docComponentsRendered, assetQueryString, disableOptimizedLoading, crossOrigin } = this.context;
        const disableRuntimeJS = unstable_runtimeJS === false;
        docComponentsRendered.NextScript = true;
        if ( true && inAmpMode) {
            if (true) {
                return null;
            }
            const ampDevFiles = [
                ...buildManifest.devFiles,
                ...buildManifest.polyfillFiles,
                ...buildManifest.ampDevFiles
            ];
            return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                children: [
                    disableRuntimeJS ? null : /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                        id: "__NEXT_DATA__",
                        type: "application/json",
                        nonce: this.props.nonce,
                        crossOrigin: this.props.crossOrigin || crossOrigin,
                        dangerouslySetInnerHTML: {
                            __html: NextScript.getInlineScriptSource(this.context)
                        },
                        "data-ampdevmode": true
                    }),
                    ampDevFiles.map((file)=>/*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                            src: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
                            nonce: this.props.nonce,
                            crossOrigin: this.props.crossOrigin || crossOrigin,
                            "data-ampdevmode": true
                        }, file))
                ]
            });
        }
        if (false) {}
        const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page,  true && inAmpMode);
        return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                !disableRuntimeJS && buildManifest.devFiles ? buildManifest.devFiles.map((file)=>/*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                        src: `${assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(file)}${assetQueryString}`,
                        nonce: this.props.nonce,
                        crossOrigin: this.props.crossOrigin || crossOrigin
                    }, file)) : null,
                disableRuntimeJS ? null : /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    id: "__NEXT_DATA__",
                    type: "application/json",
                    nonce: this.props.nonce,
                    crossOrigin: this.props.crossOrigin || crossOrigin,
                    dangerouslySetInnerHTML: {
                        __html: NextScript.getInlineScriptSource(this.context)
                    }
                }),
                disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(),
                disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(),
                disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files),
                disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files)
            ]
        });
    }
}
function Html(props) {
    const { inAmpMode, docComponentsRendered, locale, scriptLoader, __NEXT_DATA__ } = (0, _htmlcontextsharedruntime.useHtmlContext)();
    docComponentsRendered.Html = true;
    handleDocumentScriptLoaderItems(scriptLoader, __NEXT_DATA__, props);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("html", {
        ...props,
        lang: props.lang || locale || undefined,
        amp:  true && inAmpMode ? "" : undefined,
        "data-ampdevmode":  true && inAmpMode && "production" !== "production" ? 0 : undefined
    });
}
function Main() {
    const { docComponentsRendered } = (0, _htmlcontextsharedruntime.useHtmlContext)();
    docComponentsRendered.Main = true;
    // @ts-ignore
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("next-js-internal-body-render-target", {});
}
class Document extends _react.default.Component {
    /**
   * `getInitialProps` hook returns the context object with the addition of `renderPage`.
   * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
   */ static getInitialProps(ctx) {
        return ctx.defaultGetInitialProps(ctx);
    }
    render() {
        return /*#__PURE__*/ (0, _jsxruntime.jsxs)(Html, {
            children: [
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Head, {}),
                /*#__PURE__*/ (0, _jsxruntime.jsxs)("body", {
                    children: [
                        /*#__PURE__*/ (0, _jsxruntime.jsx)(Main, {}),
                        /*#__PURE__*/ (0, _jsxruntime.jsx)(NextScript, {})
                    ]
                })
            ]
        });
    }
}
// Add a special property to the built-in `Document` component so later we can
// identify if a user customized `Document` is used or not.
const InternalFunctionDocument = function InternalFunctionDocument() {
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)(Html, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)(Head, {}),
            /*#__PURE__*/ (0, _jsxruntime.jsxs)("body", {
                children: [
                    /*#__PURE__*/ (0, _jsxruntime.jsx)(Main, {}),
                    /*#__PURE__*/ (0, _jsxruntime.jsx)(NextScript, {})
                ]
            })
        ]
    });
};
Document[_constants.NEXT_BUILTIN_DOCUMENT] = InternalFunctionDocument; //# sourceMappingURL=_document.js.map


/***/ }),

/***/ 6537:
/***/ ((module, exports, __webpack_require__) => {


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
    APP_BUILD_MANIFEST: function() {
        return APP_BUILD_MANIFEST;
    },
    APP_CLIENT_INTERNALS: function() {
        return APP_CLIENT_INTERNALS;
    },
    APP_PATHS_MANIFEST: function() {
        return APP_PATHS_MANIFEST;
    },
    APP_PATH_ROUTES_MANIFEST: function() {
        return APP_PATH_ROUTES_MANIFEST;
    },
    AUTOMATIC_FONT_OPTIMIZATION_MANIFEST: function() {
        return AUTOMATIC_FONT_OPTIMIZATION_MANIFEST;
    },
    BARREL_OPTIMIZATION_PREFIX: function() {
        return BARREL_OPTIMIZATION_PREFIX;
    },
    BLOCKED_PAGES: function() {
        return BLOCKED_PAGES;
    },
    BUILD_ID_FILE: function() {
        return BUILD_ID_FILE;
    },
    BUILD_MANIFEST: function() {
        return BUILD_MANIFEST;
    },
    CLIENT_PUBLIC_FILES_PATH: function() {
        return CLIENT_PUBLIC_FILES_PATH;
    },
    CLIENT_REFERENCE_MANIFEST: function() {
        return CLIENT_REFERENCE_MANIFEST;
    },
    CLIENT_STATIC_FILES_PATH: function() {
        return CLIENT_STATIC_FILES_PATH;
    },
    CLIENT_STATIC_FILES_RUNTIME_AMP: function() {
        return CLIENT_STATIC_FILES_RUNTIME_AMP;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN_APP;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL;
    },
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH: function() {
        return CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH;
    },
    CLIENT_STATIC_FILES_RUNTIME_WEBPACK: function() {
        return CLIENT_STATIC_FILES_RUNTIME_WEBPACK;
    },
    COMPILER_INDEXES: function() {
        return COMPILER_INDEXES;
    },
    COMPILER_NAMES: function() {
        return COMPILER_NAMES;
    },
    CONFIG_FILES: function() {
        return CONFIG_FILES;
    },
    DEFAULT_RUNTIME_WEBPACK: function() {
        return DEFAULT_RUNTIME_WEBPACK;
    },
    DEFAULT_SANS_SERIF_FONT: function() {
        return DEFAULT_SANS_SERIF_FONT;
    },
    DEFAULT_SERIF_FONT: function() {
        return DEFAULT_SERIF_FONT;
    },
    DEV_CLIENT_PAGES_MANIFEST: function() {
        return DEV_CLIENT_PAGES_MANIFEST;
    },
    DEV_MIDDLEWARE_MANIFEST: function() {
        return DEV_MIDDLEWARE_MANIFEST;
    },
    EDGE_RUNTIME_WEBPACK: function() {
        return EDGE_RUNTIME_WEBPACK;
    },
    EDGE_UNSUPPORTED_NODE_APIS: function() {
        return EDGE_UNSUPPORTED_NODE_APIS;
    },
    EXPORT_DETAIL: function() {
        return EXPORT_DETAIL;
    },
    EXPORT_MARKER: function() {
        return EXPORT_MARKER;
    },
    FUNCTIONS_CONFIG_MANIFEST: function() {
        return FUNCTIONS_CONFIG_MANIFEST;
    },
    GOOGLE_FONT_PROVIDER: function() {
        return GOOGLE_FONT_PROVIDER;
    },
    IMAGES_MANIFEST: function() {
        return IMAGES_MANIFEST;
    },
    INTERCEPTION_ROUTE_REWRITE_MANIFEST: function() {
        return INTERCEPTION_ROUTE_REWRITE_MANIFEST;
    },
    INTERNAL_HEADERS: function() {
        return INTERNAL_HEADERS;
    },
    MIDDLEWARE_BUILD_MANIFEST: function() {
        return MIDDLEWARE_BUILD_MANIFEST;
    },
    MIDDLEWARE_MANIFEST: function() {
        return MIDDLEWARE_MANIFEST;
    },
    MIDDLEWARE_REACT_LOADABLE_MANIFEST: function() {
        return MIDDLEWARE_REACT_LOADABLE_MANIFEST;
    },
    MODERN_BROWSERSLIST_TARGET: function() {
        return _modernbrowserslisttarget.default;
    },
    NEXT_BUILTIN_DOCUMENT: function() {
        return NEXT_BUILTIN_DOCUMENT;
    },
    NEXT_FONT_MANIFEST: function() {
        return NEXT_FONT_MANIFEST;
    },
    OPTIMIZED_FONT_PROVIDERS: function() {
        return OPTIMIZED_FONT_PROVIDERS;
    },
    PAGES_MANIFEST: function() {
        return PAGES_MANIFEST;
    },
    PHASE_DEVELOPMENT_SERVER: function() {
        return PHASE_DEVELOPMENT_SERVER;
    },
    PHASE_EXPORT: function() {
        return PHASE_EXPORT;
    },
    PHASE_INFO: function() {
        return PHASE_INFO;
    },
    PHASE_PRODUCTION_BUILD: function() {
        return PHASE_PRODUCTION_BUILD;
    },
    PHASE_PRODUCTION_SERVER: function() {
        return PHASE_PRODUCTION_SERVER;
    },
    PHASE_TEST: function() {
        return PHASE_TEST;
    },
    PRERENDER_MANIFEST: function() {
        return PRERENDER_MANIFEST;
    },
    REACT_LOADABLE_MANIFEST: function() {
        return REACT_LOADABLE_MANIFEST;
    },
    ROUTES_MANIFEST: function() {
        return ROUTES_MANIFEST;
    },
    RSC_MODULE_TYPES: function() {
        return RSC_MODULE_TYPES;
    },
    SERVER_DIRECTORY: function() {
        return SERVER_DIRECTORY;
    },
    SERVER_FILES_MANIFEST: function() {
        return SERVER_FILES_MANIFEST;
    },
    SERVER_PROPS_ID: function() {
        return SERVER_PROPS_ID;
    },
    SERVER_REFERENCE_MANIFEST: function() {
        return SERVER_REFERENCE_MANIFEST;
    },
    STATIC_PROPS_ID: function() {
        return STATIC_PROPS_ID;
    },
    STATIC_STATUS_PAGES: function() {
        return STATIC_STATUS_PAGES;
    },
    STRING_LITERAL_DROP_BUNDLE: function() {
        return STRING_LITERAL_DROP_BUNDLE;
    },
    SUBRESOURCE_INTEGRITY_MANIFEST: function() {
        return SUBRESOURCE_INTEGRITY_MANIFEST;
    },
    SYSTEM_ENTRYPOINTS: function() {
        return SYSTEM_ENTRYPOINTS;
    },
    TRACE_OUTPUT_VERSION: function() {
        return TRACE_OUTPUT_VERSION;
    },
    TURBO_TRACE_DEFAULT_MEMORY_LIMIT: function() {
        return TURBO_TRACE_DEFAULT_MEMORY_LIMIT;
    },
    UNDERSCORE_NOT_FOUND_ROUTE: function() {
        return UNDERSCORE_NOT_FOUND_ROUTE;
    },
    UNDERSCORE_NOT_FOUND_ROUTE_ENTRY: function() {
        return UNDERSCORE_NOT_FOUND_ROUTE_ENTRY;
    }
});
const _interop_require_default = __webpack_require__(8445);
const _modernbrowserslisttarget = /*#__PURE__*/ _interop_require_default._(__webpack_require__(8609));
const COMPILER_NAMES = {
    client: "client",
    server: "server",
    edgeServer: "edge-server"
};
const INTERNAL_HEADERS = [
    "x-invoke-error",
    "x-invoke-output",
    "x-invoke-path",
    "x-invoke-query",
    "x-invoke-status",
    "x-middleware-invoke"
];
const COMPILER_INDEXES = {
    [COMPILER_NAMES.client]: 0,
    [COMPILER_NAMES.server]: 1,
    [COMPILER_NAMES.edgeServer]: 2
};
const UNDERSCORE_NOT_FOUND_ROUTE = "/_not-found";
const UNDERSCORE_NOT_FOUND_ROUTE_ENTRY = "" + UNDERSCORE_NOT_FOUND_ROUTE + "/page";
const PHASE_EXPORT = "phase-export";
const PHASE_PRODUCTION_BUILD = "phase-production-build";
const PHASE_PRODUCTION_SERVER = "phase-production-server";
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";
const PHASE_TEST = "phase-test";
const PHASE_INFO = "phase-info";
const PAGES_MANIFEST = "pages-manifest.json";
const APP_PATHS_MANIFEST = "app-paths-manifest.json";
const APP_PATH_ROUTES_MANIFEST = "app-path-routes-manifest.json";
const BUILD_MANIFEST = "build-manifest.json";
const APP_BUILD_MANIFEST = "app-build-manifest.json";
const FUNCTIONS_CONFIG_MANIFEST = "functions-config-manifest.json";
const SUBRESOURCE_INTEGRITY_MANIFEST = "subresource-integrity-manifest";
const NEXT_FONT_MANIFEST = "next-font-manifest";
const EXPORT_MARKER = "export-marker.json";
const EXPORT_DETAIL = "export-detail.json";
const PRERENDER_MANIFEST = "prerender-manifest.json";
const ROUTES_MANIFEST = "routes-manifest.json";
const IMAGES_MANIFEST = "images-manifest.json";
const SERVER_FILES_MANIFEST = "required-server-files.json";
const DEV_CLIENT_PAGES_MANIFEST = "_devPagesManifest.json";
const MIDDLEWARE_MANIFEST = "middleware-manifest.json";
const DEV_MIDDLEWARE_MANIFEST = "_devMiddlewareManifest.json";
const REACT_LOADABLE_MANIFEST = "react-loadable-manifest.json";
const AUTOMATIC_FONT_OPTIMIZATION_MANIFEST = "font-manifest.json";
const SERVER_DIRECTORY = "server";
const CONFIG_FILES = [
    "next.config.js",
    "next.config.mjs"
];
const BUILD_ID_FILE = "BUILD_ID";
const BLOCKED_PAGES = [
    "/_document",
    "/_app",
    "/_error"
];
const CLIENT_PUBLIC_FILES_PATH = "public";
const CLIENT_STATIC_FILES_PATH = "static";
const STRING_LITERAL_DROP_BUNDLE = "__NEXT_DROP_CLIENT_FILE__";
const NEXT_BUILTIN_DOCUMENT = "__NEXT_BUILTIN_DOCUMENT__";
const BARREL_OPTIMIZATION_PREFIX = "__barrel_optimize__";
const CLIENT_REFERENCE_MANIFEST = "client-reference-manifest";
const SERVER_REFERENCE_MANIFEST = "server-reference-manifest";
const MIDDLEWARE_BUILD_MANIFEST = "middleware-build-manifest";
const MIDDLEWARE_REACT_LOADABLE_MANIFEST = "middleware-react-loadable-manifest";
const INTERCEPTION_ROUTE_REWRITE_MANIFEST = "interception-route-rewrite-manifest";
const CLIENT_STATIC_FILES_RUNTIME_MAIN = "main";
const CLIENT_STATIC_FILES_RUNTIME_MAIN_APP = "" + CLIENT_STATIC_FILES_RUNTIME_MAIN + "-app";
const APP_CLIENT_INTERNALS = "app-pages-internals";
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = "react-refresh";
const CLIENT_STATIC_FILES_RUNTIME_AMP = "amp";
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = "webpack";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = "polyfills";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(CLIENT_STATIC_FILES_RUNTIME_POLYFILLS);
const DEFAULT_RUNTIME_WEBPACK = "webpack-runtime";
const EDGE_RUNTIME_WEBPACK = "edge-runtime-webpack";
const STATIC_PROPS_ID = "__N_SSG";
const SERVER_PROPS_ID = "__N_SSP";
const GOOGLE_FONT_PROVIDER = "https://fonts.googleapis.com/";
const OPTIMIZED_FONT_PROVIDERS = [
    {
        url: GOOGLE_FONT_PROVIDER,
        preconnect: "https://fonts.gstatic.com"
    },
    {
        url: "https://use.typekit.net",
        preconnect: "https://use.typekit.net"
    }
];
const DEFAULT_SERIF_FONT = {
    name: "Times New Roman",
    xAvgCharWidth: 821,
    azAvgWidth: 854.3953488372093,
    unitsPerEm: 2048
};
const DEFAULT_SANS_SERIF_FONT = {
    name: "Arial",
    xAvgCharWidth: 904,
    azAvgWidth: 934.5116279069767,
    unitsPerEm: 2048
};
const STATIC_STATUS_PAGES = [
    "/500"
];
const TRACE_OUTPUT_VERSION = 1;
const TURBO_TRACE_DEFAULT_MEMORY_LIMIT = 6000;
const RSC_MODULE_TYPES = {
    client: "client",
    server: "server"
};
const EDGE_UNSUPPORTED_NODE_APIS = [
    "clearImmediate",
    "setImmediate",
    "BroadcastChannel",
    "ByteLengthQueuingStrategy",
    "CompressionStream",
    "CountQueuingStrategy",
    "DecompressionStream",
    "DomException",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "TransformStreamDefaultController",
    "WritableStreamDefaultController"
];
const SYSTEM_ENTRYPOINTS = new Set([
    CLIENT_STATIC_FILES_RUNTIME_MAIN,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
    CLIENT_STATIC_FILES_RUNTIME_AMP,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP
]);
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=constants.js.map


/***/ }),

/***/ 7926:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "encodeURIPath", ({
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
}));
function encodeURIPath(file) {
    return file.split("/").map((p)=>encodeURIComponent(p)).join("/");
} //# sourceMappingURL=encode-uri-path.js.map


/***/ }),

/***/ 391:
/***/ ((__unused_webpack_module, exports) => {


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
    getObjectClassLabel: function() {
        return getObjectClassLabel;
    },
    isPlainObject: function() {
        return isPlainObject;
    }
});
function getObjectClassLabel(value) {
    return Object.prototype.toString.call(value);
}
function isPlainObject(value) {
    if (getObjectClassLabel(value) !== "[object Object]") {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    /**
   * this used to be previously:
   *
   * `return prototype === null || prototype === Object.prototype`
   *
   * but Edge Runtime expose Object from vm, being that kind of type-checking wrongly fail.
   *
   * It was changed to the current implementation since it's resilient to serialization.
   */ return prototype === null || prototype.hasOwnProperty("isPrototypeOf");
} //# sourceMappingURL=is-plain-object.js.map


/***/ }),

/***/ 8609:
/***/ ((module) => {

// Note: This file is JS because it's used by the taskfile-swc.js file, which is JS.
// Keep file changes in sync with the corresponding `.d.ts` files.
/**
 * These are the browser versions that support all of the following:
 * static import: https://caniuse.com/es6-module
 * dynamic import: https://caniuse.com/es6-module-dynamic-import
 * import.meta: https://caniuse.com/mdn-javascript_operators_import_meta
 */ 
const MODERN_BROWSERSLIST_TARGET = [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
];
module.exports = MODERN_BROWSERSLIST_TARGET; //# sourceMappingURL=modern-browserslist-target.js.map


/***/ }),

/***/ 5006:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "denormalizePagePath", ({
    enumerable: true,
    get: function() {
        return denormalizePagePath;
    }
}));
const _utils = __webpack_require__(7592);
const _normalizepathsep = __webpack_require__(9565);
function denormalizePagePath(page) {
    let _page = (0, _normalizepathsep.normalizePathSep)(page);
    return _page.startsWith("/index/") && !(0, _utils.isDynamicRoute)(_page) ? _page.slice(6) : _page !== "/index" ? _page : "/";
} //# sourceMappingURL=denormalize-page-path.js.map


/***/ }),

/***/ 7094:
/***/ ((__unused_webpack_module, exports) => {

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

/***/ 3581:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "normalizePagePath", ({
    enumerable: true,
    get: function() {
        return normalizePagePath;
    }
}));
const _ensureleadingslash = __webpack_require__(7094);
const _utils = __webpack_require__(7592);
const _utils1 = __webpack_require__(5298);
function normalizePagePath(page) {
    const normalized = /^\/index(\/|$)/.test(page) && !(0, _utils.isDynamicRoute)(page) ? "/index" + page : page === "/" ? "/index" : (0, _ensureleadingslash.ensureLeadingSlash)(page);
    if (true) {
        const { posix } = __webpack_require__(1017);
        const resolvedPage = posix.normalize(normalized);
        if (resolvedPage !== normalized) {
            throw new _utils1.NormalizeError("Requested and resolved page mismatch: " + normalized + " " + resolvedPage);
        }
    }
    return normalized;
} //# sourceMappingURL=normalize-page-path.js.map


/***/ }),

/***/ 9565:
/***/ ((__unused_webpack_module, exports) => {

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

/***/ 5866:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
    normalizeRscURL: function() {
        return normalizeRscURL;
    }
});
const _ensureleadingslash = __webpack_require__(7094);
const _segment = __webpack_require__(3944);
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
function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, "$1");
} //# sourceMappingURL=app-paths.js.map


/***/ }),

/***/ 7592:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
    getSortedRoutes: function() {
        return _sortedroutes.getSortedRoutes;
    },
    isDynamicRoute: function() {
        return _isdynamic.isDynamicRoute;
    }
});
const _sortedroutes = __webpack_require__(8903);
const _isdynamic = __webpack_require__(7892); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 7892:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "isDynamicRoute", ({
    enumerable: true,
    get: function() {
        return isDynamicRoute;
    }
}));
const _interceptionroutes = __webpack_require__(6106);
// Identify /[param]/ in route string
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
function isDynamicRoute(route) {
    if ((0, _interceptionroutes.isInterceptionRouteAppPath)(route)) {
        route = (0, _interceptionroutes.extractInterceptionRouteInformation)(route).interceptedRoute;
    }
    return TEST_ROUTE.test(route);
} //# sourceMappingURL=is-dynamic.js.map


/***/ }),

/***/ 8903:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getSortedRoutes", ({
    enumerable: true,
    get: function() {
        return getSortedRoutes;
    }
}));
class UrlNode {
    insert(urlPath) {
        this._insert(urlPath.split("/").filter(Boolean), [], false);
    }
    smoosh() {
        return this._smoosh();
    }
    _smoosh(prefix) {
        if (prefix === void 0) prefix = "/";
        const childrenPaths = [
            ...this.children.keys()
        ].sort();
        if (this.slugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[]"), 1);
        }
        if (this.restSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[...]"), 1);
        }
        if (this.optionalRestSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[[...]]"), 1);
        }
        const routes = childrenPaths.map((c)=>this.children.get(c)._smoosh("" + prefix + c + "/")).reduce((prev, curr)=>[
                ...prev,
                ...curr
            ], []);
        if (this.slugName !== null) {
            routes.push(...this.children.get("[]")._smoosh(prefix + "[" + this.slugName + "]/"));
        }
        if (!this.placeholder) {
            const r = prefix === "/" ? "/" : prefix.slice(0, -1);
            if (this.optionalRestSlugName != null) {
                throw new Error('You cannot define a route with the same specificity as a optional catch-all route ("' + r + '" and "' + r + "[[..." + this.optionalRestSlugName + ']]").');
            }
            routes.unshift(r);
        }
        if (this.restSlugName !== null) {
            routes.push(...this.children.get("[...]")._smoosh(prefix + "[..." + this.restSlugName + "]/"));
        }
        if (this.optionalRestSlugName !== null) {
            routes.push(...this.children.get("[[...]]")._smoosh(prefix + "[[..." + this.optionalRestSlugName + "]]/"));
        }
        return routes;
    }
    _insert(urlPaths, slugNames, isCatchAll) {
        if (urlPaths.length === 0) {
            this.placeholder = false;
            return;
        }
        if (isCatchAll) {
            throw new Error("Catch-all must be the last part of the URL.");
        }
        // The next segment in the urlPaths list
        let nextSegment = urlPaths[0];
        // Check if the segment matches `[something]`
        if (nextSegment.startsWith("[") && nextSegment.endsWith("]")) {
            // Strip `[` and `]`, leaving only `something`
            let segmentName = nextSegment.slice(1, -1);
            let isOptional = false;
            if (segmentName.startsWith("[") && segmentName.endsWith("]")) {
                // Strip optional `[` and `]`, leaving only `something`
                segmentName = segmentName.slice(1, -1);
                isOptional = true;
            }
            if (segmentName.startsWith("...")) {
                // Strip `...`, leaving only `something`
                segmentName = segmentName.substring(3);
                isCatchAll = true;
            }
            if (segmentName.startsWith("[") || segmentName.endsWith("]")) {
                throw new Error("Segment names may not start or end with extra brackets ('" + segmentName + "').");
            }
            if (segmentName.startsWith(".")) {
                throw new Error("Segment names may not start with erroneous periods ('" + segmentName + "').");
            }
            function handleSlug(previousSlug, nextSlug) {
                if (previousSlug !== null) {
                    // If the specific segment already has a slug but the slug is not `something`
                    // This prevents collisions like:
                    // pages/[post]/index.js
                    // pages/[id]/index.js
                    // Because currently multiple dynamic params on the same segment level are not supported
                    if (previousSlug !== nextSlug) {
                        // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                        throw new Error("You cannot use different slug names for the same dynamic path ('" + previousSlug + "' !== '" + nextSlug + "').");
                    }
                }
                slugNames.forEach((slug)=>{
                    if (slug === nextSlug) {
                        throw new Error('You cannot have the same slug name "' + nextSlug + '" repeat within a single dynamic path');
                    }
                    if (slug.replace(/\W/g, "") === nextSegment.replace(/\W/g, "")) {
                        throw new Error('You cannot have the slug names "' + slug + '" and "' + nextSlug + '" differ only by non-word symbols within a single dynamic path');
                    }
                });
                slugNames.push(nextSlug);
            }
            if (isCatchAll) {
                if (isOptional) {
                    if (this.restSlugName != null) {
                        throw new Error('You cannot use both an required and optional catch-all route at the same level ("[...' + this.restSlugName + ']" and "' + urlPaths[0] + '" ).');
                    }
                    handleSlug(this.optionalRestSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.optionalRestSlugName = segmentName;
                    // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                    nextSegment = "[[...]]";
                } else {
                    if (this.optionalRestSlugName != null) {
                        throw new Error('You cannot use both an optional and required catch-all route at the same level ("[[...' + this.optionalRestSlugName + ']]" and "' + urlPaths[0] + '").');
                    }
                    handleSlug(this.restSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.restSlugName = segmentName;
                    // nextSegment is overwritten to [...] so that it can later be sorted specifically
                    nextSegment = "[...]";
                }
            } else {
                if (isOptional) {
                    throw new Error('Optional route parameters are not yet supported ("' + urlPaths[0] + '").');
                }
                handleSlug(this.slugName, segmentName);
                // slugName is kept as it can only be one particular slugName
                this.slugName = segmentName;
                // nextSegment is overwritten to [] so that it can later be sorted specifically
                nextSegment = "[]";
            }
        }
        // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode
        if (!this.children.has(nextSegment)) {
            this.children.set(nextSegment, new UrlNode());
        }
        this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
    }
    constructor(){
        this.placeholder = true;
        this.children = new Map();
        this.slugName = null;
        this.restSlugName = null;
        this.optionalRestSlugName = null;
    }
}
function getSortedRoutes(normalizedPages) {
    // First the UrlNode is created, and every UrlNode can have only 1 dynamic segment
    // Eg you can't have pages/[post]/abc.js and pages/[hello]/something-else.js
    // Only 1 dynamic segment per nesting level
    // So in the case that is test/integration/dynamic-routing it'll be this:
    // pages/[post]/comments.js
    // pages/blog/[post]/comment/[id].js
    // Both are fine because `pages/[post]` and `pages/blog` are on the same level
    // So in this case `UrlNode` created here has `this.slugName === 'post'`
    // And since your PR passed through `slugName` as an array basically it'd including it in too many possibilities
    // Instead what has to be passed through is the upwards path's dynamic names
    const root = new UrlNode();
    // Here the `root` gets injected multiple paths, and insert will break them up into sublevels
    normalizedPages.forEach((pagePath)=>root.insert(pagePath));
    // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
    return root.smoosh();
} //# sourceMappingURL=sorted-routes.js.map


/***/ }),

/***/ 3944:
/***/ ((__unused_webpack_module, exports) => {


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
    DEFAULT_SEGMENT_KEY: function() {
        return DEFAULT_SEGMENT_KEY;
    },
    PAGE_SEGMENT_KEY: function() {
        return PAGE_SEGMENT_KEY;
    },
    isGroupSegment: function() {
        return isGroupSegment;
    }
});
function isGroupSegment(segment) {
    // Use array[0] for performant purpose
    return segment[0] === "(" && segment.endsWith(")");
}
const PAGE_SEGMENT_KEY = "__PAGE__";
const DEFAULT_SEGMENT_KEY = "__DEFAULT__"; //# sourceMappingURL=segment.js.map


/***/ }),

/***/ 5298:
/***/ ((__unused_webpack_module, exports) => {


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
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
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

/***/ 6896:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
        return isError;
    },
    getProperError: function() {
        return getProperError;
    }
});
const _isplainobject = __webpack_require__(391);
function isError(err) {
    return typeof err === 'object' && err !== null && 'name' in err && 'message' in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if (false) {}
    return new Error((0, _isplainobject.isPlainObject)(err) ? JSON.stringify(err) : err + '');
}

//# sourceMappingURL=is-error.js.map

/***/ }),

/***/ 6793:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/ 
__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return prettyBytes;
    }
}));
const UNITS = [
    'B',
    'kB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB'
];
/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/ const toLocaleString = (number, locale)=>{
    let result = number;
    if (typeof locale === 'string') {
        result = number.toLocaleString(locale);
    } else if (locale === true) {
        result = number.toLocaleString();
    }
    return result;
};
function prettyBytes(number, options) {
    if (!Number.isFinite(number)) {
        throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
    }
    options = Object.assign({}, options);
    if (options.signed && number === 0) {
        return ' 0 B';
    }
    const isNegative = number < 0;
    const prefix = isNegative ? '-' : options.signed ? '+' : '';
    if (isNegative) {
        number = -number;
    }
    if (number < 1) {
        const numberString = toLocaleString(number, options.locale);
        return prefix + numberString + ' B';
    }
    const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1);
    number = Number((number / Math.pow(1000, exponent)).toPrecision(3));
    const numberString = toLocaleString(number, options.locale);
    const unit = UNITS[exponent];
    return prefix + numberString + ' ' + unit;
}

//# sourceMappingURL=pretty-bytes.js.map

/***/ }),

/***/ 6106:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
    extractInterceptionRouteInformation: function() {
        return extractInterceptionRouteInformation;
    },
    isInterceptionRouteAppPath: function() {
        return isInterceptionRouteAppPath;
    }
});
const _apppaths = __webpack_require__(5866);
const INTERCEPTION_ROUTE_MARKERS = [
    '(..)(..)',
    '(.)',
    '(..)',
    '(...)'
];
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split('/').find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute, marker, interceptedRoute;
    for (const segment of path.split('/')){
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
        case '(.)':
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === '/') {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + '/' + interceptedRoute;
            }
            break;
        case '(..)':
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === '/') {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`);
            }
            interceptedRoute = interceptingRoute.split('/').slice(0, -1).concat(interceptedRoute).join('/');
            break;
        case '(...)':
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = '/' + interceptedRoute;
            break;
        case '(..)(..)':
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split('/');
            if (splitInterceptingRoute.length <= 2) {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`);
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join('/');
            break;
        default:
            throw new Error('Invariant: unexpected marker');
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
}

//# sourceMappingURL=interception-routes.js.map

/***/ }),

/***/ 167:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


if (false) {} else {
    if (false) {} else if (false) {} else {
        module.exports = __webpack_require__(2785);
    }
}

//# sourceMappingURL=module.compiled.js.map

/***/ }),

/***/ 8392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


module.exports = __webpack_require__(167).vendored.contexts.HtmlContext;

//# sourceMappingURL=html-context.js.map

/***/ }),

/***/ 1021:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getPageFiles", ({
    enumerable: true,
    get: function() {
        return getPageFiles;
    }
}));
const _denormalizepagepath = __webpack_require__(5006);
const _normalizepagepath = __webpack_require__(3581);
function getPageFiles(buildManifest, page) {
    const normalizedPage = (0, _denormalizepagepath.denormalizePagePath)((0, _normalizepagepath.normalizePagePath)(page));
    let files = buildManifest.pages[normalizedPage];
    if (!files) {
        console.warn(`Could not find files for ${normalizedPage} in .next/build-manifest.json`);
        return [];
    }
    return files;
}

//# sourceMappingURL=get-page-files.js.map

/***/ }),

/***/ 6280:
/***/ ((__unused_webpack_module, exports) => {

// This utility is based on https://github.com/zertosh/htmlescape
// License: https://github.com/zertosh/htmlescape/blob/0527ca7156a524d256101bb310a9f970f63078ad/LICENSE

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
    ESCAPE_REGEX: function() {
        return ESCAPE_REGEX;
    },
    htmlEscapeJsonString: function() {
        return htmlEscapeJsonString;
    }
});
const ESCAPE_LOOKUP = {
    '&': '\\u0026',
    '>': '\\u003e',
    '<': '\\u003c',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
const ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function htmlEscapeJsonString(str) {
    return str.replace(ESCAPE_REGEX, (match)=>ESCAPE_LOOKUP[match]);
}

//# sourceMappingURL=htmlescape.js.map

/***/ }),

/***/ 3454:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


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
    cleanAmpPath: function() {
        return cleanAmpPath;
    },
    debounce: function() {
        return debounce;
    },
    isBlockedPage: function() {
        return isBlockedPage;
    }
});
const _constants = __webpack_require__(6537);
function isBlockedPage(page) {
    return _constants.BLOCKED_PAGES.includes(page);
}
function cleanAmpPath(pathname) {
    if (pathname.match(/\?amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/\?amp=(y|yes|true|1)&?/, '?');
    }
    if (pathname.match(/&amp=(y|yes|true|1)/)) {
        pathname = pathname.replace(/&amp=(y|yes|true|1)/, '');
    }
    pathname = pathname.replace(/\?$/, '');
    return pathname;
}
function debounce(fn, ms, maxWait = Infinity) {
    let timeoutId;
    // The time the debouncing function was first called during this debounce queue.
    let startTime = 0;
    // The time the debouncing function was last called.
    let lastCall = 0;
    // The arguments and this context of the last call to the debouncing function.
    let args, context;
    // A helper used to that either invokes the debounced function, or
    // reschedules the timer if a more recent call was made.
    function run() {
        const now = Date.now();
        const diff = lastCall + ms - now;
        // If the diff is non-positive, then we've waited at least `ms`
        // milliseconds since the last call. Or if we've waited for longer than the
        // max wait time, we must call the debounced function.
        if (diff <= 0 || startTime + maxWait >= now) {
            // It's important to clear the timeout id before invoking the debounced
            // function, in case the function calls the debouncing function again.
            timeoutId = undefined;
            fn.apply(context, args);
        } else {
            // Else, a new call was made after the original timer was scheduled. We
            // didn't clear the timeout (doing so is very slow), so now we need to
            // reschedule the timer for the time difference.
            timeoutId = setTimeout(run, diff);
        }
    }
    return function(...passedArgs) {
        // The arguments and this context of the most recent call are saved so the
        // debounced function can be invoked with them later.
        args = passedArgs;
        context = this;
        // Instead of constantly clearing and scheduling a timer, we record the
        // time of the last call. If a second call comes in before the timer fires,
        // then we'll reschedule in the run function. Doing this is considerably
        // faster.
        lastCall = Date.now();
        // Only schedule a new timer if we're not currently waiting.
        if (timeoutId === undefined) {
            startTime = lastCall;
            timeoutId = setTimeout(run, ms);
        }
    };
}

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 8445:
/***/ ((__unused_webpack_module, exports) => {



exports._ = exports._interop_require_default = _interop_require_default;
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}


/***/ })

};
;