(() => {
    var __webpack_modules__ = {
        6461: (t, e, r) => {
            "use strict";
            t.exports = {
                FileSystemCache: r(3312),
                MaxAge: r(7070),
                oneBehindFetch: r(534),
                log: r(6167),
                isAmp: r(4462)
            }
        },
        3312: (t, e, r) => {
            "use strict";
            const i = r(7147).promises;
            const {
                existsSync: s,
                mkdirSync: n
            } = r(7147);
            const a = r(6113);
            const o = r(6167);
            const l = r(7330);
            const c = r(1017);
            const u = {
                baseDir: c.join(__dirname, ".cache"),
                log: o,
                maxItems: 50
            };
            class FileSystemCache {
                static create(t = {}) {
                    return new FileSystemCache(Object.assign(u, t))
                }
                constructor(t) {
                    this.opts = t;
                    this.cache = new l(t.maxItems)
                }
                async get(t, e = null) {
                    let r = this.cache.get(t);
                    if (r) {
                        return r
                    }
                    const s = this.createCacheFileName(t);
                    try {
                        const e = await i.readFile(s, "utf-8");
                        r = JSON.parse(e);
                        this.cache.set(t, r)
                    } catch (t) {
                        r = e
                    }
                    return r
                }
                async set(t, e) {
                    try {
                        this.cache.set(t, e);
                        if (!s(this.opts.baseDir)) {
                            n(this.opts.baseDir)
                        }
                        const r = this.createCacheFileName(t);
                        return i.writeFile(r, JSON.stringify(e, null, ""), "utf-8")
                    } catch (t) {
                        this.opts.log.error("Could not write cache file", t)
                    }
                }
                async clear() {
                    const t = this.opts.baseDir;
                    if (!s(t)) {
                        return
                    }
                    let e = await i.readdir(t, {
                        withFileTypes: true
                    });
                    await Promise.all(e.map((e => {
                        let r = c.join(t, e.name);
                        return e.isFile() && e.name.endsWith(".json") ? i.unlink(r) : Promise.resolve()
                    })))
                }
                createCacheFileName(t) {
                    const e = a.createHash("md5").update(t).digest("hex");
                    return c.join(this.opts.baseDir, e + ".json")
                }
                async deleteDir_(t) {
                    let e = await i.readdir(t, {
                        withFileTypes: true
                    });
                    await Promise.all(e.map((e => {
                        let r = c.join(t, e.name);
                        return e.isDirectory() ? this.deleteDir_(r) : i.unlink(r)
                    })));
                    await i.rmdir(t)
                }
            }
            t.exports = FileSystemCache
        },
        4462: t => {
            "use strict";
            const e = "<html";
            t.exports = function isAmp(t) {
                let r = t.indexOf(e);
                if (r === -1) {
                    return false
                }
                r += e.length;
                const i = t.indexOf(">", r);
                if (i === -1) {
                    return false
                }
                let s = t.substring(r, i).split(/\s+/);
                s = s.map((t => t.split("=")[0]));
                return s.includes("amp") || s.includes("⚡")
            }
        },
        6167: t => {
            "use strict";
            class Log {
                constructor(t = "", e = false, r = console) {
                    this.tag_ = t;
                    this.verbose_ = e;
                    this.prefix_ = t ? this.inverse_(t) : "";
                    this.output_ = r
                }
                debug(t, ...e) {
                    if (!this.verbose_) {
                        return
                    }
                    this.log_(this.output_.log, this.dim_(t), e)
                }
                log(t, ...e) {
                    this.info(t, ...e)
                }
                info(t, ...e) {
                    this.log_(this.output_.log, t, ...e)
                }
                success(t, ...e) {
                    this.log_(this.output_.log, this.green_("SUCCESS " + t), e)
                }
                warn(t, ...e) {
                    this.log_(this.output_.warn, this.yellow_("WARNING " + t), e)
                }
                error(t, ...e) {
                    this.output_.log("\n");
                    this.log_(this.output_.error, this.red_("ERROR " + t), e);
                    this.output_.log("\n")
                }
                verbose(t = true) {
                    this.verbose_ = !!t
                }
                tag(t) {
                    if (this.tag_) {
                        t = this.tag_ + " " + t
                    }
                    return new Log(t, this.verbose_, this.output_)
                }
                log_(t, e, r) {
                    if (this.prefix_) {
                        e = this.prefix_ + " " + e
                    }
                    if (r) {
                        t(...[e].concat(r))
                    } else {
                        t(e)
                    }
                }
                inverse_(t) {
                    return `${t}`
                }
                dim_(t) {
                    return `${t}`
                }
                green_(t) {
                    return `${t}`
                }
                yellow_(t) {
                    return `${t}`
                }
                red_(t) {
                    return `${t}`
                }
            }
            t.exports = new Log
        },
        7070: t => {
            "use strict";
            const e = {
                value: 0,
                isExpired: () => true
            };
            class MaxAge {
                static zero() {
                    return e
                }
                static parse(t) {
                    if (!t) {
                        return MaxAge.zero()
                    }
                    const e = t.match(/max-age=([0-9]+)[^0-9]?/i);
                    if (!e) {
                        return MaxAge.zero()
                    }
                    return MaxAge.create(e[1])
                }
                static create(t) {
                    if (!Number.isInteger(t)) {
                        t = parseInt(t, 10)
                    }
                    return new MaxAge(Date.now(), t)
                }
                static fromObject(t, e) {
                    return new MaxAge(t, e)
                }
                constructor(t, e) {
                    this.timestampInMs_ = t;
                    this.value = e
                }
                isExpired(t = Date.now()) {
                    const e = this.value * 1e3;
                    return this.timestampInMs_ + e < t
                }
                toObject() {
                    return {
                        timestampInMs: this.timestampInMs_,
                        maxAge: this.maxAge
                    }
                }
            }
            t.exports = MaxAge
        },
        534: (t, e, r) => {
            "use strict";
            let i = r(9796);
            const s = r(7070);
            const n = new Map;
            async function oneBehindFetch(t, e) {
                let r = n.get(t);
                if (!r) {
                    r = {
                        maxAge: Promise.resolve(s.zero())
                    };
                    n.set(t, r)
                }
                const a = await r.maxAge;
                if (!a.isExpired()) {
                    const t = await r.responsePromise;
                    return t.clone()
                }
                const o = r.responsePromise;
                const l = i(t, e);
                r = {
                    responsePromise: l,
                    maxAge: l.then((t => s.parse(t.headers.get("cache-control"))))
                };
                n.set(t, r);
                const c = o || l;
                const u = await c;
                return u.clone()
            }
            oneBehindFetch.clearCache = () => n.clear();
            oneBehindFetch.setDelegate = t => i = t;
            t.exports = oneBehindFetch
        },
        6657: (t, e, r) => {
            "use strict";
            const {
                DomTransformer: i,
                TRANSFORMATIONS_AMP_FIRST: s,
                TRANSFORMATIONS_PAIRED_AMP: n,
                DEFAULT_CONFIG: a
            } = r(4234);
            const o = r(7731);
            t.exports = {
                create: (t = a) => new i(t),
                TRANSFORMATIONS_AMP_FIRST: s,
                TRANSFORMATIONS_PAIRED_AMP: n,
                DEFAULT_CONFIG: a,
                NodeUtils: o
            }
        },
        1497: (t, e, r) => {
            "mode strict";
            const {
                hasAttribute: i
            } = r(7731);
            t.exports = {
                AMP_TAGS: ["amp", "⚡", "⚡4ads", "amp4ads", "⚡4email", "amp4email"],
                AMP_CACHE_HOST: "https://cdn.ampproject.org",
                AMP_VALIDATION_RULES_URL: "https://cdn.ampproject.org/v0/validator.json",
                AMP_FORMATS: ["AMP", "AMP4EMAIL", "AMP4ADS"],
                AMP_RUNTIME_CSS_PATH: "/v0.css",
                appendRuntimeVersion: (t, e) => t + "/rtv/" + e,
                isTemplate: t => {
                    if (t.tagName === "template") {
                        return true
                    }
                    if (t.tagName === "script" && i(t, "template") && t.attribs.template === "amp-mustache") {
                        return true
                    }
                    return false
                },
                isAmpStory: t => {
                    for (const e of t.children) {
                        if (isAmpScriptImport(e) && e.attribs["custom-element"] === "amp-story") {
                            return true
                        }
                    }
                    return false
                }
            };

            function isAmpScriptImport(t) {
                if (t.tagName !== "script") {
                    return false
                }
                if (!t.attribs) {
                    return false
                }
                const e = t.attribs["custom-element"] || t.attribs["custom-template"] || "";
                if (!e.startsWith("amp-")) {
                    return false
                }
                return true
            }
        },
        4234: (t, e, r) => {
            function __ncc_wildcard$0(t) {
                if (t === "AddAmpLink") return r(1401);
                else if (t === "AddBlurryImagePlaceholders") return r(7334);
                else if (t === "AddMandatoryTags") return r(6765);
                else if (t === "AddTransformedFlag") return r(5544);
                else if (t === "AmpBoilerplateTransformer") return r(334);
                else if (t === "AmpScriptCsp") return r(5452);
                else if (t === "ApplyCommonAttributes") return r(4554);
                else if (t === "ApplyLayout") return r(7832);
                else if (t === "AutoExtensionImporter") return r(4502);
                else if (t === "GoogleFontsPreconnect") return r(9222);
                else if (t === "Markdown") return r(1169);
                else if (t === "MinifyHtml") return r(6618);
                else if (t === "OptimizeImages") return r(8445);
                else if (t === "PreloadHeroImage") return r(5525);
                else if (t === "PreloadImages") return r(1523);
                else if (t === "PruneDuplicateResourceHints") return r(1545);
                else if (t === "RemoveAmpAttribute") return r(9609);
                else if (t === "RemoveCspNonce") return r(4851);
                else if (t === "ReorderHeadTransformer") return r(710);
                else if (t === "RewriteAmpUrls") return r(9020);
                else if (t === "SeparateKeyframes") return r(5463);
                else if (t === "ServerSideRendering") return r(696)
            }
            "use strict";
            const i = r(8819);
            const s = r(8499);
            let n = r(9796);
            const a = r(4544);
            const o = r(7571);
            const l = ["AddMandatoryTags", "Markdown", "AutoExtensionImporter", "OptimizeImages", "PreloadHeroImage", "ServerSideRendering", "AmpBoilerplateTransformer", "ReorderHeadTransformer", "RewriteAmpUrls", "GoogleFontsPreconnect", "PruneDuplicateResourceHints", "SeparateKeyframes", "AddTransformedFlag", "MinifyHtml", "AmpScriptCsp"];
            const c = ["AutoExtensionImporter", "AddAmpLink", "OptimizeImages", "PreloadHeroImage", "ServerSideRendering", "RemoveAmpAttribute", "AmpBoilerplateTransformer", "ReorderHeadTransformer", "RewriteAmpUrls", "GoogleFontsPreconnect", "PruneDuplicateResourceHints", "AddBlurryImagePlaceholders", "SeparateKeyframes", "AddTransformedFlag", "MinifyHtml", "AmpScriptCsp"];
            const u = {
                fetch: n,
                log: s,
                transformations: l,
                verbose: false
            };
            class DomTransformer {
                constructor(t = u) {
                    this.setConfig(t)
                }
                async transformHtml(t, e) {
                    const r = await i.parse(t);
                    await this.transformTree(r, e);
                    return i.serialize(r)
                }
                async transformTree(t, e = {}) {
                    s.verbose(e.verbose || false);
                    const r = await o(this.config, e);
                    const sequence = async (e, i) => {
                        await e;
                        return i.transform(t, r)
                    };
                    return this.transformers_.reduce(sequence, Promise.resolve())
                }
                setConfig(t) {
                    this.config = Object.assign({}, u, t);
                    if (!this.config.runtimeVersion) {
                        this.config.runtimeVersion = new a(this.config.fetch)
                    }
                    s.verbose(this.config.verbose);
                    this.initTransformers_(this.config)
                }
                initTransformers_(t) {
                    this.transformers_ = t.transformations.map((e => {
                        if (typeof e === "string") {
                            e = __ncc_wildcard$0(e)
                        }
                        return new e(t)
                    }))
                }
            }
            t.exports = {
                DomTransformer: DomTransformer,
                DEFAULT_CONFIG: u,
                TRANSFORMATIONS_AMP_FIRST: l,
                TRANSFORMATIONS_PAIRED_AMP: c
            }
        },
        1993: t => {
            "mode strict";
            t.exports = {
                isRenderDelayingExtension: function (t) {
                    if (t.tagName !== "script") {
                        return false
                    }
                    const e = t.attribs["custom-element"];
                    return e === "amp-dynamic-css-classes" || e === "amp-experiment" || e === "amp-story"
                },
                isCustomElement: function (t) {
                    return t.tagName && t.tagName.startsWith("amp-")
                }
            }
        },
        187: t => {
            "use strict";

            function findMetaViewport(t) {
                for (let e = t.firstChild; e !== null; e = e.nextSibling) {
                    if (e.tagName === "meta" && e.attribs.name === "viewport") {
                        return e
                    }
                }
                return null
            }

            function skipNodeAndChildren(t) {
                if (t.nextSibling) {
                    return t.nextSibling
                }
                return skipNodeAndChildren(t.parent)
            }
            t.exports = {
                findMetaViewport: findMetaViewport,
                skipNodeAndChildren: skipNodeAndChildren
            }
        },
        7731: (t, e, r) => {
            "use strict";
            const {
                Element: i,
                DataNode: s
            } = r(8436);
            const {
                removeElement: n,
                append: a,
                prepend: o
            } = r(3790);
            const nextNode = function (t) {
                const e = t.firstChild;
                if (e) {
                    return e
                }
                let r = t;
                while (r) {
                    const t = r.nextSibling;
                    if (t) {
                        return t
                    }
                    r = r.parent
                }
                return null
            };
            const remove = function (t) {
                n(t)
            };
            const appendChild = function (t, e) {
                if (!e) {
                    return
                }
                e.parent = t;
                if (t.children.push(e) !== 1) {
                    const r = t.children[t.children.length - 2];
                    r.next = e;
                    e.prev = r;
                    e.next = null
                }
            };
            const insertBefore = function (t, e, r) {
                if (r) {
                    o(r, e);
                    return
                }
                appendChild(t, e)
            };
            const insertAfter = function (t, e, r) {
                if (r) {
                    a(r, e);
                    return
                }
                appendChild(t, e)
            };
            const appendAll = function (t, e) {
                if (!e) {
                    return
                }
                for (let r = 0, i = e.length; r < i; r++) {
                    appendChild(t, e[r])
                }
            };
            const firstChildByTag = function (t, e) {
                if (!t || !t.children) {
                    return null
                }
                return t.children.find((t => t.tagName && t.tagName === e))
            };
            const hasAttribute = function (t, e) {
                if (!t.attribs) return false;
                return e in t.attribs
            };
            const move = function (t, e) {
                remove(t);
                appendChild(e, t)
            };
            const createElement = (t, e) => new i(t, e);
            const insertText = (t, e) => {
                const r = new s("text", e);
                appendChild(t, r)
            };
            const createDocType = () => {
                const t = new s("directive", "!doctype html");
                return t
            };
            t.exports = {
                appendChild: appendChild,
                appendAll: appendAll,
                insertAfter: insertAfter,
                nextNode: nextNode,
                remove: remove,
                createDocType: createDocType,
                createElement: createElement,
                insertText: insertText,
                insertBefore: insertBefore,
                hasAttribute: hasAttribute,
                firstChildByTag: firstChildByTag,
                move: move
            }
        },
        815: t => {
            "use strict";
            const e = ["px", "em", "rem", "vh", "vw", "vmin", "vmax"];
            const r = ["nodisplay", "fixed", "responsive", "fixed-height", "fill", "container", "flex-item", "fluid", "intrinsic"];
            const i = ["fixed", "fixed-height", "responsive", "fill", "flex-item", "intrinsic"];
            const s = cssLength("1", false, false);
            const n = cssLength("auto", true, false);
            const a = cssLength("44px", false, false);
            const o = cssLength("60px", false, false);

            function getLayoutClass(t) {
                if (!t) {
                    return t
                }
                return "i-amphtml-layout-" + t
            }

            function calculateHeight(t, e, r) {
                if ((t === "" || t === "fixed" || t === "fixed-height") && !e.isSet) {
                    switch (r) {
                        case "amp-analytics":
                            return s;
                        case "amp-audio":
                            return n;
                        case "amp-pixel":
                            return s;
                        case "amp-social-share":
                            return a;
                        default:
                    }
                }
                return e
            }

            function calculateWidth(t, e, r) {
                if ((t === "" || t === "fixed") && !e.isSet) {
                    switch (r) {
                        case "amp-analytics":
                            return s;
                        case "amp-audio":
                            return n;
                        case "amp-pixel":
                            return s;
                        case "amp-social-share":
                            return o;
                        default:
                    }
                }
                return e
            }

            function isLayoutSizeDefined(t) {
                return i.indexOf(t) > -1
            }

            function getCssLengthStyle(t, e) {
                if (!t.isSet) {
                    return ""
                }
                if (t.isAuto) {
                    return `${e}:auto;`
                }
                return `${e}:${t.numeral}${t.unit};`
            }

            function parseLayout(t) {
                if (!t) {
                    return ""
                }
                t = t.toLowerCase();
                if (r.indexOf(t) > -1) {
                    return t
                }
                return ""
            }

            function calculateLayout(t, e, r, i, s) {
                if (t !== "") {
                    return t
                }
                if (!e.isSet && !r.isSet) {
                    return "container"
                }
                if (r.isSet && (!e.isSet || e.isAuto)) {
                    return "fixed-height"
                }
                if (r.isSet && e.isSet && (i || s)) {
                    return "responsive"
                }
                return "fixed"
            }

            function cssLength(t, r = false, i = false) {
                const s = {
                    isValid: false,
                    isSet: false,
                    isAuto: false,
                    isFluid: false,
                    numeral: Number.NaN,
                    unit: "px"
                };
                if (t === null) {
                    s.isValid = true;
                    return s
                }
                s.isSet = true;
                if (t === "auto") {
                    s.isAuto = true;
                    s.isValid = r;
                    return s
                }
                if (t === "fluid") {
                    s.isFluid = true;
                    s.isValid = i;
                    return s
                }
                const n = /(\d+(?:\.\d+)?)(.*)/;
                const a = n.exec(t);
                if (!a) {
                    return s
                }
                s.numeral = Number.parseFloat(a[1]);
                t = a[2];
                if (t === "") {
                    s.unit = "px";
                    s.isValid = true;
                    return s
                }
                if (e.indexOf(t) > -1) {
                    s.isValid = true;
                    s.unit = t
                }
                return s
            }

            function getLayoutSizeDefinedClass() {
                return "i-amphtml-layout-size-defined"
            }
            t.exports = {
                parseLayout: parseLayout,
                cssLength: cssLength,
                getLayoutClass: getLayoutClass,
                calculateHeight: calculateHeight,
                calculateWidth: calculateWidth,
                isLayoutSizeDefined: isLayoutSizeDefined,
                getCssLengthStyle: getCssLengthStyle,
                calculateLayout: calculateLayout,
                getLayoutSizeDefinedClass: getLayoutSizeDefinedClass
            }
        },
        8098: (t, e, r) => {
            "use strict";
            const i = r(7310).URL;
            const {
                join: s,
                resolve: n
            } = r(1017);
            const a = "https://example.com";
            class PathResolver {
                constructor(t = "") {
                    if (typeof t === "function") {
                        this.implementation = t
                    } else {
                        this.implementation = this.createStaticResolver(t)
                    }
                }
                resolve(t, e) {
                    return this.implementation(t, e)
                }
                createStaticResolver(t) {
                    let e = false;
                    try {
                        new i(t);
                        e = true
                    } catch (t) { }
                    return r => {
                        try {
                            if (e) {
                                return new i(r, t).toString()
                            } else {
                                return new i(r).toString()
                            }
                        } catch (t) { }
                        r = new i(r, a).pathname.substring(1);
                        return n(s(t, r))
                    }
                }
            }
            t.exports = PathResolver
        },
        3800: (t, e, r) => {
            "use strict";
            const {
                AMP_CACHE_HOST: i,
                appendRuntimeVersion: s
            } = r(1497);

            function calculateHost({
                ampUrlPrefix: t = i,
                ampRuntimeVersion: e,
                lts: r = false,
                rtv: n = false
            }) {
                if (r && n) {
                    throw new Error("lts flag is not compatible with runtime version parameter")
                }
                t = t.replace(/\/$/, "");
                if (e && n) {
                    t = s(t, e)
                } else if (r) {
                    t += "/lts"
                }
                return t
            }
            t.exports = {
                calculateHost: calculateHost
            }
        },
        8819: (t, e, r) => {
            "use strict";
            const {
                Parser: i
            } = r(91);
            const {
                DomHandler: s,
                NodeWithChildren: n
            } = r(8436);
            const {
                appendAll: a
            } = r(7731);
            const o = r(9312)["default"];
            const l = {
                decodeEntities: false
            };
            class TreeParser {
                constructor(t) {
                    this.options = t
                }
                parse(t) {
                    return new Promise(((e, r) => {
                        const o = new s(((t, i) => {
                            if (t) {
                                r(t)
                            } else {
                                const t = new n("root", []);
                                a(t, i);
                                e(t)
                            }
                        }), this.options);
                        const l = new i(o, this.options);
                        l.write(t.trim());
                        l.end()
                    }))
                }
                serialize(t) {
                    return o(t, {})
                }
            }
            t.exports = new TreeParser(l);
            t.exports.TreeParser = TreeParser
        },
        5265: t => {
            "use strict";
            const isValidImageSrcURL = t => {
                try {
                    return new URL(t, "https://example.com").protocol.startsWith("http")
                } catch (t) {
                    return false
                }
            };
            t.exports = {
                isValidImageSrcURL: isValidImageSrcURL
            }
        },
        7785: (t, e, r) => {
            "use strict";
            const {
                FileSystemCache: i
            } = r(6461);
            const s = r(1017);
            const n = r(8499);
            const a = i.create({
                log: n,
                baseDir: r.ab + ".cache"
            });
            t.exports = a
        },
        7980: (t, e, r) => {
            "use strict";
            const i = r(3605);
            const s = /^https?:\/\/|^\/\//i;

            function fetchImageDimensions(t) {
                if (s.test(t)) {
                    return fetchImageDimensionsFromUrl(t)
                }
                return fetchImageDimensionsFromFile(t)
            }

            function fetchImageDimensionsFromUrl(t) {
                return probe(t)
            }
            async function fetchImageDimensionsFromFile(t) {
                if (!i("fs")) {
                    throw new Error("No access to the file system")
                }
                const e = r(7147);
                if (!e.existsSync(t)) {
                    throw new Error("Could not resolve file: " + t)
                }
                const s = e.createReadStream(t);
                return probe(s)
            }

            function probe(t) {
                if (!i("probe-image-size")) {
                    throw new Error("Missing optional dependency: probe-image-size")
                }
                return r(8520)(t)
            }
            t.exports = {
                fetchImageDimensions: fetchImageDimensions,
                fetchImageDimensionsFromFile: fetchImageDimensionsFromFile,
                fetchImageDimensionsFromUrl: fetchImageDimensionsFromUrl
            }
        },
        7571: (t, e, r) => {
            "mode strict";
            const i = r(9219);
            const {
                MaxAge: s
            } = r(6461);
            const {
                AMP_CACHE_HOST: n,
                AMP_RUNTIME_CSS_PATH: a,
                AMP_VALIDATION_RULES_URL: o,
                appendRuntimeVersion: l
            } = r(1497);
            const c = "validator-rules";
            const u = 10 * 60;
            const d = r(7785);
            async function fetchRuntimeParameters(t, e = {}) {
                const r = Object.assign({}, e);
                r.verbose = e.verbose || t.verbose || false;
                const i = initValidatorRules(r, e, t);
                await initRuntimeVersion(r, e, t);
                await initRuntimeStyles(r, t);
                await i;
                return r
            }
            async function initValidatorRules(t, e, r) {
                try {
                    t.validatorRules = e.validatorRules || r.validatorRules || await fetchValidatorRulesFromCache_(r)
                } catch (t) {
                    r.log.error("Could not fetch validator rules", t)
                }
            }
            async function fetchValidatorRulesFromCache_(t) {
                if (t.cache === false) {
                    return fetchValidatorRules_(t)
                }
                let e = await d.get("validator-rules");
                let r;
                if (!e) {
                    r = await fetchValidatorRules_(t);
                    t.log.debug("Downloaded AMP validation rules");
                    d.set(c, r.raw)
                } else {
                    r = await i.fetch({
                        rules: e
                    })
                }
                return r
            }
            async function fetchValidatorRules_(t) {
                const e = await t.fetch(o);
                if (!e.ok) {
                    return null
                }
                return i.fetch({
                    rules: await e.json()
                })
            }
            async function initRuntimeStyles(t, e) {
                try {
                    t.ampRuntimeStyles = t.ampRuntimeStyles || await fetchAmpRuntimeStyles_(e, t.ampUrlPrefix, t.ampRuntimeVersion)
                } catch (t) {
                    e.log.error("Could not fetch AMP runtime CSS", t)
                }
            }
            async function initRuntimeVersion(t, e, r) {
                t.lts = e.lts || r.lts || false;
                t.rtv = e.rtv || r.rtv || false;
                let {
                    ampUrlPrefix: i,
                    ampRuntimeVersion: s,
                    lts: n
                } = t;
                if (n && s) {
                    r.log.warn("`ampRuntimeVersion` and `lts` cannot be defined at the same time. Using LTS version.");
                    s = ""
                }
                try {
                    t.ampRuntimeVersion = s || await fetchAmpRuntimeVersion_({
                        config: r,
                        ampUrlPrefix: i,
                        lts: n
                    })
                } catch (t) {
                    r.log.error("Could not fetch latest AMP runtime version", t)
                }
            }
            async function fetchAmpRuntimeVersion_(t) {
                if (t.config.cache === false) {
                    return (await fetchLatestRuntimeData_(t)).version
                }
                const e = t.ampUrlPrefix + "-" + t.lts;
                let r = await d.get(e);
                if (!r) {
                    r = await fetchLatestRuntimeData_(t, e);
                    t.config.log.debug("Downloaded AMP runtime v" + r.version)
                } else if (s.fromObject(r.maxAge).isExpired()) {
                    fetchLatestRuntimeData_(e, t)
                }
                return r.version
            }
            async function fetchLatestRuntimeData_({
                config: t,
                ampUrlPrefix: e,
                lts: r
            }, i = null) {
                let a;
                a = {
                    version: await t.runtimeVersion.currentVersion({
                        ampUrlPrefix: e,
                        lts: r
                    }),
                    maxAge: s.create(u).toObject()
                };
                if (!a.version && e !== n) {
                    t.log.error(`Could not download runtime version from ${e}. Falling back to ${n}`);
                    a = await fetchLatestRuntimeData_({
                        config: t,
                        ampUrlPrefix: n,
                        lts: r
                    }, i)
                } else if (a.version && i) {
                    d.set(i, a)
                }
                return a
            }
            async function fetchAmpRuntimeStyles_(t, e, r) {
                if (e && !isAbsoluteUrl_(e)) {
                    t.log.warn(`AMP runtime styles cannot be fetched from relative ampUrlPrefix, please use the 'ampRuntimeStyles' parameter to provide the correct runtime style. Falling back to latest v0.css on ${n}`);
                    e = n;
                    r = r || await t.runtimeVersion.currentVersion()
                }
                const i = l(e || n, r) + a;
                const s = await downloadAmpRuntimeStyles_(t, i);
                if (!s) {
                    t.log.error(`Could not download ${i}. Falling back to latest v0.css.`);
                    if (e || r) {
                        return fetchAmpRuntimeStyles_(t, n, await t.runtimeVersion.currentVersion())
                    } else {
                        return ""
                    }
                }
                return s
            }
            async function downloadAmpRuntimeStyles_(t, e) {
                let r;
                if (t.cache !== false) {
                    r = await d.get(e)
                }
                if (!r) {
                    const i = await t.fetch(e);
                    if (!i.ok) {
                        return null
                    }
                    r = await i.text();
                    if (!r.includes("i-amphtml-ssr")) {
                        r += `amp-img[i-amphtml-ssr]:not(.i-amphtml-element):not([layout=container])>*{display: block;}`
                    }
                    t.log.debug(`Downloaded AMP runtime styles from ${e}`);
                    if (t.cache !== false) {
                        d.set(e, r)
                    }
                }
                return r
            }

            function isAbsoluteUrl_(t) {
                try {
                    new URL(t);
                    return true
                } catch (t) {
                    return false
                }
            }
            t.exports = fetchRuntimeParameters
        },
        2333: t => {
            const e = {
                "&": "\\u0026",
                ">": "\\u003e",
                "<": "\\u003c",
                "\u2028": "\\u2028",
                "\u2029": "\\u2029"
            };
            const r = /[&><\u2028\u2029]/g;
            t.exports = function htmlEscapeJsonString(t) {
                return t.replace(r, (t => e[t]))
            }
        },
        3605: t => {
            function isDependencyInstalled(t) {
                try {
                    require.resolve(t);
                    return true
                } catch (t) {
                    return false
                }
            }
            t.exports = isDependencyInstalled
        },
        8499: (t, e, r) => {
            "use strict";
            const {
                log: i
            } = r(6461);
            t.exports = i.tag("AMP Optimizer")
        },
        9344: t => {
            "use strict";
            let e;
            let r;
            const parseSizes = t => {
                const e = {
                    defaultValue: "",
                    values: []
                };
                if (!t) {
                    return e
                }
                const r = t.trim().split(/\s*,\s*/);
                for (let i = 0; i < r.length; i++) {
                    const s = r[i];
                    if (i === r.length - 1) {
                        e.defaultValue = s.trim()
                    } else {
                        const r = s.split(/\)\s+/);
                        if (r.length !== 2) {
                            throw new Error(`Invalid sizes definition '${t}'`)
                        }
                        e.values.push({
                            media: `${r[0]})`,
                            size: r[1]
                        })
                    }
                }
                return e
            };
            t.exports = parseSizes
        },
        1401: (t, e, r) => {
            "use strict";
            const {
                firstChildByTag: i,
                createElement: s,
                appendChild: n
            } = r(7731);
            class AddAmpLink {
                transform(t, e) {
                    if (!e.ampUrl) return;
                    const r = i(t, "html");
                    if (!r) return;
                    const a = i(r, "head");
                    if (!a) return;
                    const o = s("link", {
                        rel: "amphtml",
                        href: e.ampUrl
                    });
                    n(a, o)
                }
            }
            t.exports = AddAmpLink
        },
        7334: (t, e, r) => {
            const i = r(3605);
            const {
                createElement: s,
                appendChild: n,
                nextNode: a,
                firstChildByTag: o
            } = r(7731);
            const {
                URL: l
            } = r(7310);
            const {
                skipNodeAndChildren: c
            } = r(187);
            const u = r(8098);
            const d = 60;
            const h = 100;
            const f = 30;
            const p = -1;
            const m = {
                "#": "%23",
                "%": "%25",
                ":": "%3A",
                "<": "%3C",
                ">": "%3E",
                '"': "'"
            };
            const g = new RegExp(Object.keys(m).join("|"), "g");

            function escaper(t) {
                return m[t]
            }
            class AddBlurryImagePlaceholders {
                constructor(t) {
                    this.log_ = t.log.tag("AddBlurryImagePlaceholders");
                    this.blurredPlaceholders_ = !!t.blurredPlaceholders;
                    if (!this.blurredPlaceholders_) {
                        this.log_.debug("disabled");
                        return
                    }
                    if (!i("jimp") || !i("lru-cache")) {
                        this.log_.warn("jimp and lru-cache need to be installed via `npm install jimp lru-cache` " + "for this transformer to work");
                        this.blurredPlaceholders_ = false;
                        return
                    }
                    this.jimp = r(1742);
                    this.maxBlurredPlaceholders_ = t.maxBlurredPlaceholders || h;
                    this.pathResolver_ = new u(t.imageBasePath);
                    const e = t.blurredPlaceholdersCacheSize || f;
                    if (e === p) {
                        this.log_.debug("caching all placeholders");
                        this.cache_ = new Map
                    } else if (e > 0) {
                        const t = r(7330);
                        this.log_.debug("using LRU cache for regularily used placeholders", e);
                        this.cache_ = new t({
                            max: e
                        })
                    } else {
                        this.log_.debug("caching disabled")
                    }
                }
                transform(t, e) {
                    if (!this.blurredPlaceholders_) {
                        return
                    }
                    const r = o(t, "html");
                    const i = o(r, "body");
                    const s = [];
                    let l = 0;
                    for (let t = i; t !== null; t = a(t)) {
                        const {
                            tagName: r
                        } = t;
                        let i;
                        if (r === "template") {
                            t = c(t);
                            continue
                        }
                        if (r === "amp-img") {
                            i = t.attribs.src
                        }
                        if (r === "amp-video" && t.attribs.poster) {
                            i = t.attribs.poster
                        }
                        if (this.shouldAddBlurryPlaceholder_(t, i, r)) {
                            l++;
                            const r = this.addBlurryPlaceholder_(i, e).then((e => {
                                t.attribs.noloading = "";
                                n(t, e)
                            }));
                            s.push(r);
                            if (l >= this.maxBlurredPlaceholders_) {
                                break
                            }
                        }
                    }
                    return Promise.all(s)
                }
                async addBlurryPlaceholder_(t, e) {
                    const r = s("img", {
                        class: "i-amphtml-blurry-placeholder",
                        placeholder: "",
                        src: t,
                        alt: ""
                    });
                    try {
                        const i = await this.getCachedDataURI(t, e);
                        let s = `<svg xmlns="http://www.w3.org/2000/svg"\n                      xmlns:xlink="http://www.w3.org/1999/xlink"\n                      viewBox="0 0 ${i.width} ${i.height}">\n                      <filter id="b" color-interpolation-filters="sRGB">\n                        <feGaussianBlur stdDeviation=".5"></feGaussianBlur>\n                        <feComponentTransfer>\n                          <feFuncA type="discrete" tableValues="1 1"></feFuncA>\n                        </feComponentTransfer>\n                      </filter>\n                      <image filter="url(#b)" x="0" y="0"\n                        height="100%" width="100%"\n                        xlink:href="${i.src}">\n                      </image>\n                    </svg>`;
                        s = s.replace(/\s+/g, " ");
                        s = s.replace(/> </g, "><");
                        s = s.replace(g, escaper);
                        r.attribs.src = "data:image/svg+xml;charset=utf-8," + s;
                        this.log_.debug(t, "[SUCCESS]")
                    } catch (e) {
                        this.log_.debug(t, "[FAIL]");
                        this.log_.error(e.message)
                    }
                    return r
                }
                getCachedDataURI(t, e) {
                    const r = this.pathResolver_.resolve(t, e);
                    if (this.cache_) {
                        const e = this.cache_.get(r);
                        if (e) {
                            this.log_.debug(t, "[CACHE HIT]");
                            return e
                        }
                        this.log_.debug(t, "[CACHE MISS]")
                    }
                    const i = this.getDataURI_(r);
                    if (this.cache_) {
                        this.cache_.set(r, i)
                    }
                    return i
                }
                async getDataURI_(t) {
                    const e = await this.jimp.read(t);
                    const r = this.getBitmapDimensions_(e.bitmap.width, e.bitmap.height);
                    e.resize(r.width, r.height, this.jimp.RESIZE_BEZIER);
                    const i = {
                        src: await e.getBase64Async("image/png"),
                        width: r.width,
                        height: r.height
                    };
                    return i
                }
                getBitmapDimensions_(t, e) {
                    const r = t / e;
                    let i = d / r;
                    i = Math.sqrt(i);
                    const s = d / i;
                    return {
                        width: Math.round(s),
                        height: Math.round(i)
                    }
                }
                hasPlaceholder_(t) {
                    return t.childNodes.find((t => t.attribs && t.attribs.placeholder !== undefined)) !== undefined
                }
                shouldAddBlurryPlaceholder_(t, e, r) {
                    if (!e) {
                        return false
                    }
                    if (this.hasPlaceholder_(t)) {
                        return false
                    }
                    const i = new l(e, "https://example.com");
                    if (!i.pathname.endsWith(".jpg") && !i.pathname.endsWith("jpeg")) {
                        return false
                    }
                    if (t.attribs.noloading != null) {
                        return false
                    }
                    const s = r == "amp-video";
                    const n = r == "amp-img" && (t.attribs.layout == "intrinsic" || t.attribs.layout == "responsive" || t.attribs.layout == "fill");
                    return s || n
                }
            }
            t.exports = AddBlurryImagePlaceholders
        },
        6765: (t, e, r) => {
            "use strict";
            const {
                move: i,
                insertText: s,
                appendChild: n,
                insertBefore: a,
                createDocType: o,
                createElement: l,
                firstChildByTag: c
            } = r(7731);
            const {
                AMP_FORMATS: u,
                AMP_TAGS: d
            } = r(1497);
            const h = "AMP";
            const f = "data-auto";
            const p = {
                AMP: [{
                    matcher: {
                        tagName: "meta",
                        attribs: {
                            charset: "utf-8"
                        }
                    },
                    node: {
                        tagName: "meta",
                        attribs: {
                            charset: "utf-8"
                        }
                    }
                }, {
                    matcher: {
                        tagName: "meta",
                        attribs: {
                            name: "viewport"
                        }
                    },
                    node: {
                        tagName: "meta",
                        attribs: {
                            name: "viewport",
                            content: "width=device-width,minimum-scale=1,initial-scale=1"
                        }
                    }
                }, {
                    matcher: {
                        tagName: "noscript"
                    },
                    node: {
                        tagName: "noscript",
                        children: [{
                            tagName: "style",
                            attribs: {
                                "amp-boilerplate": ""
                            },
                            text: "body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}"
                        }]
                    }
                }, {
                    matcher: {
                        tagName: "style",
                        attribs: {
                            "amp-boilerplate": ""
                        }
                    },
                    node: {
                        tagName: "style",
                        attribs: {
                            "amp-boilerplate": ""
                        },
                        text: "body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}"
                    }
                }, {
                    matcher: {
                        tagName: "script",
                        attribs: {
                            src: /^https:\/\/.+\/v0\.js$/
                        }
                    },
                    node: {
                        tagName: "script",
                        attribs: {
                            async: "",
                            src: "https://cdn.ampproject.org/v0.js"
                        }
                    }
                }, {
                    matcher: {
                        tagName: "link",
                        attribs: {
                            rel: "canonical"
                        }
                    },
                    node: {
                        tagName: "link",
                        attribs: {
                            rel: "canonical",
                            href: (t, e) => {
                                if (!t.canonical) {
                                    e.warn("No canonical param is given. Setting canonical href to `.`");
                                    t.canonical = "."
                                }
                                return t.canonical
                            }
                        }
                    }
                }]
            };
            class AddMandatoryTags {
                constructor(t) {
                    this.enabled = t.autoAddBoilerplate !== false && t.autoAddMandatoryTags !== false;
                    this.format = t.format || h;
                    this.log_ = t.log.tag("AddMandatoryTags")
                }
                async transform(t, e) {
                    if (!this.enabled) {
                        return
                    }
                    if (!u.includes(this.format)) {
                        this.log_.error("Unknown AMPHTML format", this.format);
                        return
                    }
                    const r = p[this.format];
                    if (!r) {
                        this.log_.info("Unsupported AMP format", this.format);
                        return
                    }
                    let i = c(t, "html");
                    if (!i) {
                        i = this.createHtml5Document(t)
                    }
                    let s = t.children.find((t => t.type === "directive" && t.name === "!doctype"));
                    if (!s) {
                        s = o();
                        a(t, s, t.firstChild)
                    }
                    if (!Object.keys(i.attribs).some((t => d.includes(t)))) {
                        i.attribs[this.format.toLowerCase()] = ""
                    }
                    let h = c(i, "head");
                    if (!h) {
                        h = l("head");
                        n(i, h)
                    }
                    const f = new Set(r);
                    let m = h.firstChild;
                    while (m) {
                        if (m.tagName) {
                            f.forEach((t => {
                                if (this.matchSpec(t.matcher, m)) {
                                    f.delete(t)
                                }
                            }))
                        }
                        m = m.nextSibling
                    }
                    for (const t of f) {
                        this.addNode(h, t.node, e)
                    }
                }
                matchSpec(t, e) {
                    if (t.tagName !== e.tagName) {
                        return false
                    }
                    if (!t.attribs) {
                        return true
                    }
                    for (const [r, i] of Object.entries(t.attribs)) {
                        const t = e.attribs[r];
                        if (i instanceof RegExp) {
                            if (!i.test(t)) {
                                return false
                            }
                        } else if (t !== i) {
                            return false
                        }
                    }
                    return true
                }
                addNode(t, e, r) {
                    const i = {};
                    i[f] = "";
                    const s = l(e.tagName, i);
                    this.addAttributes(e, s, r);
                    this.addChildren(e, s, r);
                    this.addText(e, s, r);
                    n(t, s)
                }
                addText(t, e, r) {
                    if (!t.text) {
                        return
                    }
                    let i;
                    if (typeof t.text === "function") {
                        i = t.text(r, this.log_)
                    } else {
                        i = t.text
                    }
                    s(e, i)
                }
                addChildren(t, e, r) {
                    if (!t.children) {
                        return
                    }
                    for (const i of t.children) {
                        this.addNode(e, i, r)
                    }
                }
                addAttributes(t, e, r) {
                    if (!t.attribs) {
                        return
                    }
                    for (const [i, s] of Object.entries(t.attribs)) {
                        if (typeof s === "function") {
                            e.attribs[i] = s(r, this.log_)
                        } else {
                            e.attribs[i] = s
                        }
                    }
                }
                createHtml5Document(t) {
                    const e = l("html", {});
                    const r = this.createOrMoveElement(t, e, "head");
                    const i = this.createOrMoveElement(t, e, "body");
                    this.copyTagsToHeadAndBody(t, r, i);
                    n(t, e);
                    return e
                }
                createOrMoveElement(t, e, r) {
                    const s = c(t, r) || l(r);
                    i(s, e);
                    return s
                }
                copyTagsToHeadAndBody(t, e, r) {
                    let s = t.firstChild;
                    while (s) {
                        const t = s;
                        s = t.next;
                        if (t.type === "directive") { } else if (t.tagName === "title") {
                            i(t, e)
                        } else {
                            i(t, r)
                        }
                    }
                }
            }
            t.exports = AddMandatoryTags
        },
        5544: (t, e, r) => {
            "use strict";
            const {
                firstChildByTag: i
            } = r(7731);
            class AddTransformedFlag {
                transform(t) {
                    const e = i(t, "html");
                    if (!e) return;
                    e.attribs.transformed = "self;v=1"
                }
            }
            t.exports = AddTransformedFlag
        },
        334: (t, e, r) => {
            "use strict";
            const {
                insertText: i,
                hasAttribute: s,
                firstChildByTag: n
            } = r(7731);
            class AmpBoilerplateTransformer {
                constructor(t) {
                    this.fetch_ = t.fetch;
                    this.runtimeVersion_ = t.runtimeVersion;
                    this.log_ = t.log.tag("AmpBoilerplateTransformer")
                }
                transform(t, e) {
                    const r = n(t, "html");
                    const s = n(r, "head");
                    if (!s) {
                        return
                    }
                    const a = this._findAmpRuntimeStyle(s);
                    if (!a) {
                        return
                    }
                    let {
                        ampRuntimeVersion: o,
                        ampRuntimeStyles: l
                    } = e;
                    if (!o || !l) {
                        this.log_.error("Missing parameters both ampRuntimeVersion and ampRuntimeStyles need to be present");
                        return
                    }
                    a.attribs["i-amphtml-version"] = o;
                    i(a, l)
                }
                _findAmpRuntimeStyle(t) {
                    let e = t.firstChild;
                    while (e) {
                        if (s(e, "amp-runtime")) {
                            return e
                        }
                        e = e.nextSibling
                    }
                    return null
                }
            }
            t.exports = AmpBoilerplateTransformer
        },
        5452: (t, e, r) => {
            "use strict";
            const {
                remove: i,
                appendChild: s,
                createElement: n,
                nextNode: a,
                firstChildByTag: o
            } = r(7731);
            const {
                calculateHash: l
            } = r(1815);
            class AmpScriptCsp {
                transform(t) {
                    const e = o(t, "html");
                    if (!e) return;
                    const r = o(e, "head");
                    if (!r) return;
                    const s = o(e, "body");
                    if (!s) return;
                    const n = this._findOrCreateCspMeta(r);
                    const a = (n.attribs.content || "").trim().split(/\s+/);
                    const c = new Set(a);
                    c.delete("");
                    const u = this._findAllInlineScripts(s);
                    for (const t of u) {
                        const e = t.children[0] ? t.children[0].data : "";
                        c.add(l(e))
                    }
                    const d = Array.from(c).join(" ");
                    if (d === "") {
                        i(n);
                        return
                    }
                    n.attribs.content = d
                }
                _findAllInlineScripts(t) {
                    const e = [];
                    let r = t;
                    while (r !== null) {
                        if (r.tagName === "script" && r.attribs.target === "amp-script") {
                            e.push(r)
                        }
                        r = a(r)
                    }
                    return e
                }
                _findOrCreateCspMeta(t) {
                    for (let e = t.firstChild; e !== null; e = e.nextSibling) {
                        if (e.tagName === "meta" && e.attribs.name === "amp-script-src") {
                            return e
                        }
                    }
                    const e = n("meta", {
                        name: "amp-script-src"
                    });
                    s(t, e);
                    return e
                }
            }
            t.exports = AmpScriptCsp
        },
        4554: (t, e, r) => {
            "use strict";
            const i = r(9344);
            const {
                appendChild: s,
                createElement: n,
                insertText: a,
                hasAttribute: o
            } = r(7731);
            const {
                isCustomElement: l
            } = r(1993);
            const c = "i-amp-";
            class MediaTransformer {
                constructor() {
                    this.media = new Map
                }
                transform(t, e) {
                    let r = t.attribs.media.replace(/\s+/g, " ");
                    r = r.trim();
                    if (!r) {
                        return false
                    }
                    if (r[0] === "(") {
                        r = `all and ${r}`
                    }
                    if (r.startsWith("not ")) {
                        r = r.substring(4)
                    } else {
                        r = `not ${r}`
                    }
                    this.addMedia(r, `#${e}`);
                    return true
                }
                addMedia(t, e) {
                    let r = this.media.get(t);
                    if (!r) {
                        r = [];
                        this.media.set(t, r)
                    }
                    r.push(e)
                }
                toString() {
                    let t = "";
                    for (const [e, r] of this.media.entries()) {
                        t += `@media ${e}{${r.join(",")}{display:none}}`
                    }
                    return t
                }
            }
            class SizesTransformer {
                constructor() {
                    this.sizes = []
                }
                transform(t, e) {
                    if (!t.attribs.srcset) {
                        return false
                    }
                    const r = i(t.attribs.sizes);
                    if (!r.defaultValue) {
                        return false
                    }
                    this.addSizes(e, r);
                    return true
                }
                addSizes(t, e) {
                    this.sizes.push({
                        id: t,
                        defaultSize: e.defaultValue,
                        sizes: e.values.reverse()
                    })
                }
                toString() {
                    let t = "";
                    for (const {
                        sizes: e,
                        defaultSize: r,
                        id: i
                    } of this.sizes) {
                        const s = `#${i}`;
                        t += `${s}{width:${r}}`;
                        for (const r of e) {
                            t += `@media ${r.media}{${s}{width:${r.size}}}`
                        }
                    }
                    return t
                }
            }
            class HeightsTransformer {
                constructor() {
                    this.heights = []
                }
                transform(t, e) {
                    const r = i(t.attribs.heights);
                    if (!r.defaultValue) {
                        return false
                    }
                    this.addHeights(e, r);
                    return true
                }
                addHeights(t, e) {
                    this.heights.push({
                        id: t,
                        defaultHeight: e.defaultValue,
                        heights: e.values.reverse()
                    })
                }
                toString() {
                    let t = "";
                    for (const {
                        heights: e,
                        defaultHeight: r,
                        id: i
                    } of this.heights) {
                        const s = `#${i}>:first-child`;
                        t += `${s}{padding-top:${r}}`;
                        for (const r of e) {
                            t += `@media ${r.media}{${s}{padding-top:${r.size}}}`
                        }
                    }
                    return t
                }
            }
            class ApplyCommonAttributes {
                constructor(t) {
                    this.log = t;
                    this.canRemoveBoilerplate = true;
                    this.counter = 0;
                    this.nodesToTransform = [];
                    this.ids = new Set;
                    this.transformedNodes = [];
                    this.attributeTransformations = {
                        media: new MediaTransformer,
                        sizes: new SizesTransformer,
                        heights: new HeightsTransformer
                    }
                }
                addNode(t) {
                    if (!t.attribs) {
                        return
                    }
                    if (o(t, "id")) {
                        this.ids.add(t.attribs.id)
                    }
                    if (l(t)) {
                        this.nodesToTransform.push(t)
                    }
                }
                apply() {
                    for (const t of this.nodesToTransform) {
                        for (const [e, r] of Object.entries(this.attributeTransformations)) {
                            if (o(t, e)) {
                                try {
                                    const e = this.getOrCreateId(t);
                                    const i = r.transform(t, e);
                                    this.transformedNodes.push(t);
                                    if (i && !t.attribs.id) {
                                        t.attribs.id = e
                                    } else {
                                        this.counter--
                                    }
                                } catch (r) {
                                    this.log.debug(`Cannot remove boilerplate. Failed transforming ${e}="${t.attribs[e]}".`, r);
                                    this.canRemoveBoilerplate = false
                                }
                            }
                        }
                    }
                }
                applyToCustomStyles(t, e) {
                    const r = Object.values(this.attributeTransformations).join("");
                    if (!r) {
                        return
                    }
                    if (!e) {
                        e = n("style", {
                            "amp-custom": ""
                        });
                        s(t, e)
                    }
                    if (e.children.length === 0) {
                        a(e, "")
                    }
                    e.children[0].data += r;
                    for (const t of this.transformedNodes) {
                        for (const e of Object.keys(this.attributeTransformations)) {
                            delete t.attribs[e]
                        }
                    }
                }
                getOrCreateId(t) {
                    if (o(t, "id")) {
                        return t.attribs.id
                    }
                    t.attribs = t.attribs || [];
                    const e = c + this.counter;
                    this.counter++;
                    if (this.ids.has(e)) {
                        return this.getOrCreateId(t)
                    }
                    return e
                }
            }
            t.exports = ApplyCommonAttributes
        },
        7832: (t, e, r) => {
            "use strict";
            const {
                hasAttribute: i,
                insertBefore: s,
                createElement: n,
                appendChild: a
            } = r(7731);
            const {
                parseLayout: o,
                cssLength: l,
                calculateHeight: c,
                calculateWidth: u,
                calculateLayout: d,
                getLayoutClass: h,
                isLayoutSizeDefined: f,
                getLayoutSizeDefinedClass: p
            } = r(815);
            const m = ["", "nodisplay", "fixed", "fixed-height", "responsive", "container", "fill", "flex-item", "intrinsic"];

            function isSupportedLayout(t) {
                return m.indexOf(t) > -1
            }

            function getAttributeOrNull(t, e) {
                return i(t, e) ? t.attribs[e] : null
            }

            function addClass(t, e) {
                t.attribs.class = i(t, "class") ? t.attribs.class + " " + e : e
            }

            function apply(t, e, r, i) {
                addClass(i, h(t));
                if (f(t)) {
                    addClass(i, p())
                }
                let s = "";
                switch (t) {
                    case "nodisplay":
                        i.attribs.hidden = "hidden";
                        break;
                    case "fixed":
                        s = `width:${e.numeral}${e.unit};height:${r.numeral}${r.unit};`;
                        break;
                    case "fixed-height":
                        s = `height:${r.numeral}${r.unit};`;
                        break;
                    case "responsive":
                        break;
                    case "intrinsic":
                        break;
                    case "fill":
                    case "container":
                        break;
                    case "flex-item":
                        if (e.isSet) {
                            s = `width:${e.numeral}${e.unit};`
                        }
                        if (r.isSet) {
                            s += `height:${r.numeral}${r.unit};`
                        }
                        break;
                    default:
                }
                i.attribs.style = s + (i.attribs.style ? i.attribs.style : "");
                if (i.attribs.style === "") {
                    delete i.attribs.style
                }
                i.attribs["i-amphtml-layout"] = t
            }

            function maybeAddSizerInto(t, e, r, i) {
                if (!r.isSet || r.numeral === 0 || !i.isSet || r.unit !== i.unit) {
                    return
                }
                let n = null;
                if (e === "responsive") {
                    n = createResponsiveSizer(r, i)
                } else if (e === "intrinsic") {
                    n = createIntrinsicSizer(r, i)
                }
                if (n) {
                    const e = t.firstChild;
                    s(t, n, e)
                }
            }

            function createResponsiveSizer(t, e) {
                const r = e.numeral / t.numeral * 100;
                const i = n("i-amphtml-sizer", {
                    style: `display:block;padding-top:${parseFloat(r.toFixed(4))}%`
                });
                return i
            }

            function createIntrinsicSizer(t, e) {
                const r = n("i-amphtml-sizer", {
                    class: "i-amphtml-sizer"
                });
                const i = n("img", {
                    alt: "",
                    "aria-hidden": "true",
                    class: "i-amphtml-intrinsic-sizer",
                    role: "presentation",
                    src: `data:image/svg+xml;charset=utf-8,<svg height="${e.numeral}" width="${t.numeral}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`
                });
                a(r, i);
                return r
            }
            t.exports = {
                applyLayout: function (t, e) {
                    const r = o(t.attribs.layout);
                    const i = getAttributeOrNull(t, "width");
                    const s = l(i, true, false);
                    if (!s.isValid) {
                        e.debug("cannot perform SSR: invalid input width\n", i);
                        return false
                    }
                    const n = getAttributeOrNull(t, "height");
                    const a = l(n, true, r === "fluid");
                    if (!a.isValid) {
                        e.debug("cannot perform SSR: invalid input height\n", n);
                        return false
                    }
                    const h = c(r, a, t.tagName);
                    const f = u(r, s, t.tagName);
                    const p = d(r, f, h, getAttributeOrNull(t, "sizes"), getAttributeOrNull(t, "heights"));
                    if (!isSupportedLayout(p)) {
                        e.debug("cannot perform SSR: unsupported layout", p);
                        return false
                    }
                    apply(p, f, h, t);
                    maybeAddSizerInto(t, p, f, h);
                    return true
                }
            }
        },
        4502: (t, e, r) => {
            "use strict";
            const {
                nextNode: i,
                insertAfter: s,
                createElement: n,
                firstChildByTag: a
            } = r(7731);
            const {
                findMetaViewport: o
            } = r(187);
            const {
                AMP_FORMATS: l,
                AMP_CACHE_HOST: c
            } = r(1497);
            const u = "bind";
            const d = "data-amp-bind-";
            const h = "AMP";
            const f = new Map([
                ["mask", "amp-inputmask"],
                ["lightbox", "amp-lightbox-gallery"]
            ]);
            const p = Array.from(f.values());
            class AutoExtensionImporter {
                constructor(t) {
                    this.enabled = t.autoExtensionImport !== false;
                    this.format = t.format || h;
                    this.log_ = t.log.tag("AutoExtensionImporter");
                    this.experimentBindAttributeEnabled = t.experimentBindAttribute === true;
                    this.extensionVersions = t.extensionVersions || {}
                }
                createExtensionsSpec(t) {
                    const e = t.validatorRules;
                    const r = new Map;
                    for (const t of e.extensions) {
                        if (t.htmlFormat.includes(this.format)) {
                            r.set(t.name, {
                                name: t.name,
                                type: t.extensionType === "CUSTOM_TEMPLATE" ? "custom-template" : "custom-element",
                                version: t.version.filter((t => t !== "latest"))
                            })
                        }
                    }
                    const i = new Map;
                    const s = new Map;
                    const n = new Map;
                    for (const t of e.getTagsForFormat(this.format)) {
                        const e = t.tagName.toLowerCase();
                        if (e.startsWith("amp-")) {
                            let r = t.requiresExtension || [];
                            r = r.filter((t => !p.includes(t)));
                            i.set(e, r)
                        }
                        const r = new Set;
                        for (const i of t.attrs) {
                            if (f.has(i.name)) {
                                i.requiresExtension = [f.get(i.name)]
                            }
                            if (i.requiresExtension && i.requiresExtension.length > 0) {
                                const t = s.get(e) || [];
                                t.push(i);
                                s.set(e, t)
                            }
                            if (i.name.startsWith("[")) {
                                r.add(i.name.substring(1, i.name.length - 1))
                            }
                        }
                        n.set(e, r)
                    }
                    return {
                        extensionsMap: r,
                        tagToExtensionsMapping: i,
                        tagToAttributeMapping: s,
                        tagToBindAttributeMapping: n
                    }
                }
                async transform(t, e) {
                    if (!this.enabled) {
                        return
                    }
                    if (!e.validatorRules) {
                        this.log_.error("Missing validation rules, cannot auto import extensions");
                        return
                    }
                    if (!this.extensionSpec_) {
                        this.extensionSpec_ = this.createExtensionsSpec(e)
                    }
                    if (!l.includes(this.format)) {
                        this.log_.error("Unsupported AMPHTML format", this.format);
                        return
                    }
                    const r = a(t, "html");
                    if (!r) return;
                    const i = a(r, "head");
                    if (!i) return;
                    const u = a(r, "body");
                    if (!u) return;
                    const d = new Set;
                    const h = new Set;
                    this.findExistingExtensionsAndExtensionsToImportInHead_(i, d, h);
                    await this.findExtensionsToImportInBody_(u, d);
                    if (d.length === 0) {
                        return
                    }
                    const f = o(i);
                    const p = c;
                    for (const t of d) {
                        if (h.has(t)) {
                            continue
                        }
                        const e = this.extensionSpec_.extensionsMap.get(t.trim());
                        this.log_.debug("auto importing", t);
                        let r = e.version[e.version.length - 1];
                        if (this.extensionVersions[t]) {
                            r = this.extensionVersions[t]
                        }
                        const a = {
                            async: "",
                            src: `${p}/v0/${t}-${r}.js`
                        };
                        a[e.type] = t;
                        const o = n("script", a);
                        s(i, o, f)
                    }
                }
                findExistingExtensionsAndExtensionsToImportInHead_(t, e, r) {
                    let s = t;
                    while (s) {
                        const t = this.getCustomElement_(s);
                        if (t) {
                            r.add(t)
                        } else if (s.tagName === "script" && s.attribs["id"] === "amp-access") {
                            e.add("amp-access");
                            e.add("amp-analytics");
                            const t = this.getJson(s);
                            if (t.vendor === "laterpay") {
                                e.add("amp-access-laterpay")
                            }
                        } else if (s.tagName === "script" && s.attribs["id"] === "amp-subscriptions") {
                            e.add("amp-subscriptions");
                            e.add("amp-analytics");
                            const t = this.getJson(s);
                            if (t.services && t.services.length) {
                                for (const r of t.services) {
                                    if (r.serviceId === "subscribe.google.com") {
                                        e.add("amp-subscriptions-google")
                                    }
                                }
                            }
                        }
                        s = i(s)
                    }
                }
                getJson(t) {
                    for (const e of t.children || []) {
                        if (!e.data) {
                            continue
                        }
                        try {
                            return JSON.parse(e.data)
                        } catch (t) {
                            this.log_.error('Could not parse JSON in <script id="amp-access">', t.message)
                        }
                    }
                    return {}
                }
                async findExtensionsToImportInBody_(t, e) {
                    let r = t;
                    while (r !== null) {
                        if (r.tagName) {
                            this.addRequiredExtensionByTag_(r, e);
                            this.addRequiredExtensionByAttributes_(r, e)
                        }
                        r = i(r)
                    }
                }
                addRequiredExtensionByTag_(t, e) {
                    const r = this.extensionSpec_.tagToExtensionsMapping.get(t.tagName);
                    if (r) {
                        r.forEach((t => e.add(t)))
                    }
                    if (t.tagName === "template" && t.attribs.type) {
                        e.add(t.attribs.type)
                    }
                }
                addRequiredExtensionByAttributes_(t, e) {
                    if (!t.tagName || !t.attribs) {
                        return
                    }
                    const r = this.extensionSpec_.tagToAttributeMapping;
                    const i = r.get(t.tagName) || [];
                    i.forEach((r => {
                        if (t.attribs[r.name] !== undefined) {
                            r.requiresExtension.forEach((t => {
                                e.add(t)
                            }))
                        }
                    }));
                    if (t.tagName === "form") {
                        e.add("amp-form")
                    }
                    const s = this.extensionSpec_.tagToBindAttributeMapping;
                    const n = Object.keys(t.attribs);
                    if (n.some((t => t.startsWith("[") || t.startsWith(d)))) {
                        e.add("amp-bind")
                    }
                    if (this.experimentBindAttributeEnabled) {
                        const r = s.get(t.tagName);
                        let i = false;
                        for (const s of n) {
                            if (!s.startsWith(u)) {
                                continue
                            }
                            const n = s.substring(u.length);
                            if (r.has(n)) {
                                const e = `${d}${n}`;
                                t.attribs[e] = t.attribs[s];
                                delete t.attribs[s];
                                i = true
                            }
                            if (i) {
                                e.add("amp-bind")
                            }
                        }
                    }
                }
                getCustomElement_(t) {
                    if (t.tagName !== "script") {
                        return ""
                    }
                    const e = t.attribs["custom-element"] || t.attribs["custom-template"] || "";
                    if (!e) {
                        return ""
                    }
                    if (!e.startsWith("amp-")) {
                        return ""
                    }
                    return e
                }
            }
            t.exports = AutoExtensionImporter
        },
        9222: (t, e, r) => {
            "use strict";
            const {
                insertAfter: i,
                createElement: s,
                firstChildByTag: n
            } = r(7731);
            const {
                findMetaViewport: a
            } = r(187);
            class GoogleFontsPreconnect {
                constructor(t) {
                    this.log_ = t.log.tag("GoogleFontsPreconnect")
                }
                transform(t) {
                    const e = n(t, "html");
                    if (!e) {
                        return
                    }
                    const r = n(e, "head");
                    if (!r) {
                        return
                    }
                    for (let t = r.firstChild; t !== null; t = t.nextSibling) {
                        if (this.isGoogleFontsLinkNode_(t)) {
                            const t = s("link", {
                                rel: "dns-prefetch preconnect",
                                href: "https://fonts.gstatic.com",
                                crossorigin: ""
                            });
                            const e = a(r);
                            i(r, t, e);
                            this.log_.debug('adding <link rel="dns=prefetch preconnect" href="' + t.attribs.href + '">');
                            return
                        }
                    }
                }
                isGoogleFontsLinkNode_(t) {
                    return t.tagName === "link" && t.attribs.rel === "stylesheet" && t.attribs.href.startsWith("https://fonts.googleapis.com")
                }
            }
            t.exports = GoogleFontsPreconnect
        },
        1169: (t, e, r) => {
            "use strict";
            const i = r(8098);
            const {
                fetchImageDimensions: s
            } = r(7980);
            const {
                remove: n,
                insertAfter: a,
                createElement: o,
                firstChildByTag: l,
                nextNode: c
            } = r(7731);
            const u = "intrinsic";
            const d = 320;
            class Markdown {
                constructor(t) {
                    this.log = t.log;
                    this.enabled = !!t.markdown;
                    this.pathResolver = new i(t.imageBasePath)
                }
                async transform(t, e) {
                    if (!this.enabled) {
                        return
                    }
                    const r = l(t, "html");
                    if (!r) {
                        return
                    }
                    const i = l(r, "body");
                    if (!i) {
                        return
                    }
                    let s = i;
                    const n = [];
                    while (s) {
                        const t = c(s);
                        if (s.tagName === "img") {
                            n.push(this.transformImg(s, e))
                        }
                        s = t
                    }
                    return Promise.all(n)
                }
                async transformImg(t, e) {
                    const r = t.attribs && t.attribs.src;
                    if (!r) {
                        return
                    }
                    const i = this.pathResolver.resolve(r, e);
                    let o;
                    try {
                        o = await s(i)
                    } catch (t) {
                        this.log.warn(t.message);
                        return
                    }
                    const l = this.createAmpImgOrAmpAnim(o, t);
                    a(t.parent, l, t);
                    n(t)
                }
                createAmpImgOrAmpAnim(t, e) {
                    const r = t.type === "gif" ? "amp-anim" : "amp-img";
                    const i = o(r, e.attribs);
                    i.attribs.width = e.attribs.width || String(t.width);
                    i.attribs.height = e.attribs.height || String(t.height);
                    this.addLayout(i, t);
                    return i
                }
                addLayout(t, e) {
                    if (e.width < d) {
                        return
                    }
                    t.attribs.layout = u
                }
            }
            t.exports = Markdown
        },
        6618: (t, e, r) => {
            "use strict";
            const {
                minify: i
            } = r(6794);
            const {
                remove: s
            } = r(7731);
            const n = r(3444);
            const a = r(2333);
            const o = /^\s*__[a-bA-Z0-9_-]+__\s*$/;
            class MinifyHtml {
                constructor(t) {
                    this.opts = {
                        minify: t.minify !== false,
                        minifyAmpScript: true,
                        minifyJSON: true,
                        collapseWhitespace: true,
                        removeComments: true,
                        canCollapseWhitespace: true,
                        inBody: false,
                        commentIgnorePattern: o
                    };
                    this.log = t.log.tag("MinifyHtml")
                }
                async transform(t) {
                    if (!this.opts.minify) {
                        return
                    }
                    const e = [];
                    await this.minifyNode(t, this.opts, e);
                    for (const t of e) {
                        s(t)
                    }
                }
                async minifyNode(t, e, r) {
                    if (t.type === "text") {
                        this.minifyTextNode(t, e, r)
                    } else if (t.type === "comment") {
                        this.minifyCommentNode(t, e, r)
                    } else if (t.tagName === "script") {
                        await this.minifyScriptNode(t, e)
                    }
                    const i = Object.assign({}, e);
                    if (e.canCollapseWhitespace && !this.canCollapseWhitespace(t.tagName)) {
                        i.canCollapseWhitespace = false
                    }
                    if (t.tagName === "head" || t.tagName === "html") {
                        i.inBody = false
                    } else if (t.tagName === "body") {
                        i.inBody = true
                    }
                    const s = [];
                    for (const e of t.children || []) {
                        s.push(this.minifyNode(e, i, r))
                    }
                    return Promise.all(s)
                }
                minifyTextNode(t, e, r) {
                    if (!t.data || !e.collapseWhitespace) {
                        return
                    }
                    if (e.canCollapseWhitespace) {
                        t.data = n(t.data)
                    }
                    if (!e.inBody) {
                        t.data = t.data.trim()
                    }
                    if (t.data.length === 0) {
                        r.push(t)
                    }
                }
                minifyCommentNode(t, e, r) {
                    if (!t.data || !e.removeComments) {
                        return
                    }
                    if (e.commentIgnorePattern.test(t.data)) {
                        return
                    }
                    r.push(t)
                }
                async minifyScriptNode(t, e) {
                    const r = this.isJson(t);
                    const i = !r && this.isInlineAmpScript(t);
                    for (const s of t.children || []) {
                        if (!s.data) {
                            continue
                        }
                        if (r && e.minifyJSON) {
                            this.minifyJson(s)
                        } else if (i && e.minifyAmpScript) {
                            await this.minifyAmpScript(s)
                        }
                    }
                }
                async minifyAmpScript(t) {
                    try {
                        const e = await i(t.data, {});
                        if (e.error) {
                            this.log.warn("Could not minify inline amp-script", t.data, `${e.error.name}: ${e.error.message}`);
                            return
                        }
                        t.data = e.code
                    } catch (t) {
                        this.log.warn("Failed minifying inline amp-script", t)
                    }
                }
                minifyJson(t) {
                    try {
                        let e = JSON.stringify(JSON.parse(t.data), null, "");
                        e = a(e);
                        t.data = e
                    } catch (e) {
                        this.log.warn("Invalid JSON", t.data)
                    }
                }
                isInlineAmpScript(t) {
                    return t.attribs && t.attribs.type === "text/plain" && t.attribs.target === "amp-script"
                }
                isJson(t) {
                    return t.attribs && (t.attribs.type === "application/json" || t.attribs.type === "application/ld+json")
                }
                canCollapseWhitespace(t) {
                    return "script" !== t && "style" !== t && "pre" !== t && "textarea" !== t
                }
                canTrimWhitespace(t) {
                    return t !== "pre" && t !== "textarea"
                }
            }
            t.exports = MinifyHtml
        },
        8445: (t, e, r) => {
            "use strict";
            const {
                hasAttribute: i,
                nextNode: s,
                firstChildByTag: n
            } = r(7731);
            const {
                skipNodeAndChildren: a
            } = r(187);
            const {
                isValidImageSrcURL: o
            } = r(5265);
            const l = 100;
            const c = [39, 47, 56, 68, 82, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1e3, 1200, 1440, 1750, 2e3, 2500];
            const u = c[c - 1];
            const d = 3;
            class SrcsetWidth {
                constructor(t, e = -1, r = d) {
                    this.widthList_ = [];
                    this.setBaseWidth(t, e, r)
                }
                setBaseWidth(t, e = -1, r = d) {
                    this.widthList_.length = 0;
                    let i = -1;
                    if (e > 0 && t > e) {
                        return
                    }
                    for (let s = r; s > 0; --s) {
                        let r = this.roundUp(t * s);
                        if (e > 0 && r > e) {
                            r = e
                        }
                        if (r != i) {
                            this.widthList_.push(r)
                        }
                        i = r
                    }
                }
                moreWidth() {
                    return this.widthList_.length > 0
                }
                nextWidth() {
                    return this.widthList_.pop()
                }
                isValid() {
                    return this.widthList_.length > 1
                }
                roundUp(t) {
                    for (const e of c) {
                        if (e > t) {
                            return e
                        }
                    }
                    return c[c.length - 1]
                }
            }
            class OptimizeImages {
                constructor(t) {
                    this.log = t.log;
                    this.imageOptimizer = t.imageOptimizer;
                    this.maxImageWidth = u;
                    this.maxSrcsetValues = d
                }
                async transform(t) {
                    if (!this.imageOptimizer) {
                        return
                    }
                    const e = n(t, "html");
                    const r = n(e, "body");
                    let i = r;
                    const o = [];
                    while (i !== null) {
                        if (i.tagName === "template") {
                            i = a(i)
                        } else {
                            if (i.tagName === "amp-img") {
                                o.push(this.optimizeImage(i))
                            }
                            i = s(i)
                        }
                    }
                    return Promise.all(o)
                }
                async optimizeImage(t) {
                    if (i(t, "srcset")) {
                        return
                    }
                    if (!i(t, "src")) {
                        return
                    }
                    const e = t.attribs.src;
                    if (!o(e)) {
                        return
                    }
                    if (e.endsWith(",")) {
                        return
                    }
                    const r = t.attribs.width;
                    if (isNaN(Number.parseInt(r))) {
                        return
                    }
                    const {
                        layout: s,
                        height: n,
                        sizes: a
                    } = t.attribs;
                    const c = s === "responsive" || !s && n && a;
                    if (c && r < l) {
                        return
                    }
                    const u = new SrcsetWidth(r, this.maxImageWidth, this.maxSrcsetValues);
                    if (!u.isValid()) {
                        return
                    }
                    let d = "";
                    while (u.moreWidth()) {
                        const t = u.nextWidth();
                        try {
                            const r = await this.imageOptimizer(e, t);
                            if (r) {
                                d += `${r} ${t}w${u.moreWidth() ? ", " : ""}`
                            }
                        } catch (t) {
                            this.log.error("Exception when optimizing image", e, t)
                        }
                    }
                    if (d) {
                        t.attribs.srcset = d;
                        this.log.debug("Generating img srcset", e, t.attribs.srcset)
                    }
                }
            }
            t.exports = OptimizeImages
        },
        5525: (t, e, r) => {
            "use strict";
            const {
                appendChild: i,
                createElement: s,
                hasAttribute: n,
                insertAfter: a,
                nextNode: o,
                firstChildByTag: l
            } = r(7731);
            const {
                findMetaViewport: c,
                skipNodeAndChildren: u
            } = r(187);
            const {
                isValidImageSrcURL: d
            } = r(5265);
            const h = r(1497);
            const f = 150;
            const p = 2;
            class PreloadHeroImage {
                constructor(t) {
                    this.log = t.log;
                    this.enabled = t.preloadHeroImage !== false
                }
                async transform(t, e) {
                    if (!this.enabled || e.preloadHeroImage === false) {
                        return
                    }
                    const r = l(t, "html");
                    const i = l(r, "head");
                    const s = l(r, "body");
                    if (!s || !i) return;
                    const n = this.findHeroImages(s);
                    let a = c(i);
                    let o = n.length;
                    if (o > p) {
                        this.log.warn(`Found ${o} hero elements on the page. AMP currently only supports a maximum of ${p} elements.`);
                        o = p
                    }
                    const u = h.isAmpStory(i);
                    for (let t = 0; t < o; t++) {
                        const e = n[t];
                        this.generatePreload(e, i, a);
                        if (!u) {
                            this.generateImg(e.ampImg)
                        }
                    }
                }
                generatePreload(t, e, r) {
                    if (t.srcset) {
                        this.log.debug("Could not preload hero image as it's using srcset, which is currently only supported Chromium-based browsers (see https://web.dev/preload-responsive-images/).", t.src);
                        return
                    }
                    if (this.hasExistingImagePreload(e, t.src)) {
                        return
                    }
                    const i = s("link", {
                        rel: "preload",
                        href: t.src,
                        as: "image",
                        "data-hero": ""
                    });
                    if (t.media) {
                        i.attribs.media = t.media
                    }
                    a(e, i, r)
                }
                hasExistingImagePreload(t, e) {
                    return t.children.some((t => {
                        if (t.tagName !== "link") {
                            return false
                        }
                        if (!n(t, "rel")) {
                            return false
                        }
                        if (t.attribs.rel !== "preload") {
                            return false
                        }
                        if (t.attribs.as !== "image") {
                            return false
                        }
                        return t.attribs.href === e
                    }))
                }
                findHeroImages(t) {
                    let e = null;
                    let r = [];
                    let i = t;
                    while (i !== null) {
                        this.addImageWithDataHero(i, r);
                        if (!e && r.length === 0) {
                            e = this.isCandidateHeroImage(i)
                        }
                        if (h.isTemplate(i)) {
                            i = u(i)
                        } else {
                            i = o(i)
                        }
                    }
                    if (r.length > 0) {
                        return r
                    }
                    if (e) {
                        return [e]
                    }
                    return []
                }
                addImageWithDataHero(t, e) {
                    if (t.tagName === "amp-img" && n(t, "data-hero")) {
                        const {
                            src: r,
                            media: i,
                            srcset: s
                        } = t.attribs;
                        e.push({
                            ampImg: t,
                            src: r,
                            media: i,
                            srcset: s
                        })
                    } else if (this.isAmpIframe(t) && n(t, "data-hero")) {
                        const r = this.getPlaceholderImage(t);
                        if (r) {
                            e.push(r)
                        }
                    }
                }
                isCandidateHeroImage(t) {
                    if (!t.tagName) {
                        return null
                    }
                    const e = t.attribs ? t.attribs.layout : "";
                    if (e === "nodisplay") {
                        return null
                    }
                    if (t.tagName === "amp-img") {
                        return this.isCandidateImageForPreloading(t)
                    }
                    if (t.tagName === "amp-video") {
                        return this.isCandidateVideoPosterImage(t)
                    }
                    if (this.isAmpIframe(t)) {
                        return this.isCandidateIframePlaceholderImage(t)
                    }
                    return null
                }
                isAmpIframe(t) {
                    return t.tagName === "amp-iframe" || t.tagName === "amp-video-iframe"
                }
                isCandidateVideoPosterImage(t) {
                    const e = t.attribs.poster;
                    if (!e) return null;
                    if (!d(e)) {
                        return null
                    }
                    const {
                        layout: r,
                        width: i,
                        height: s,
                        media: n
                    } = t.attribs;
                    if (this.isTinyNode(r, i, s)) {
                        return null
                    }
                    return {
                        src: e,
                        media: n,
                        srcset: ""
                    }
                }
                isCandidateIframePlaceholderImage(t) {
                    if (!t.children || t.children.length === 0) {
                        return null
                    }
                    const {
                        layout: e,
                        width: r,
                        height: i
                    } = t.attribs;
                    if (this.isTinyNode(e, r, i)) return null;
                    return this.getPlaceholderImage(t)
                }
                getPlaceholderImage(t) {
                    for (const e of t.children) {
                        if (e.tagName === "amp-img" && n(e, "placeholder") && d(e.attribs.src)) {
                            return {
                                ampImg: e,
                                src: e.attribs.src,
                                media: t.attribs.media,
                                srcset: e.attribs.srcset || ""
                            }
                        }
                    }
                    return null
                }
                isCandidateImageForPreloading(t) {
                    const e = t.attribs.src;
                    if (!e) {
                        return null
                    }
                    if (!d(e)) {
                        return null
                    }
                    let {
                        width: r,
                        height: i,
                        srcset: s,
                        layout: n,
                        media: a
                    } = t.attribs;
                    if (!r && !i) {
                        if (n === "fill") {
                            ({
                                width: r,
                                height: i
                            } = this.nodeDimensionsFromParent(t))
                        } else {
                            return null
                        }
                    }
                    if (this.isTinyNode(n, r, i)) {
                        return null
                    }
                    return {
                        ampImg: t,
                        src: e,
                        srcset: s,
                        media: a
                    }
                }
                isTinyNode(t, e, r) {
                    if (e <= 0 || r <= 0) return true;
                    if (t === "intrinsic" || t === "responsive") {
                        return false
                    }
                    return e < f || r < f
                }
                nodeDimensionsFromParent(t) {
                    while (t.parent) {
                        t = t.parent;
                        if (!t.attribs) {
                            continue
                        }
                        const e = t.attribs.width;
                        const r = t.attribs.height;
                        if (!e && !r) {
                            continue
                        }
                        return {
                            width: e,
                            height: r
                        }
                    }
                    return {
                        width: 0,
                        height: 0
                    }
                }
                generateImg(t) {
                    if (!t) {
                        return
                    }
                    const e = s("img", {
                        class: "i-amphtml-fill-content i-amphtml-replaced-content",
                        decoding: "async"
                    });
                    const r = ["alt", "attribution", "object-fit", "object-position", "referrerpolicy", "src", "srcset", "sizes", "title"];
                    for (const i of r) {
                        if (n(t, i)) {
                            e.attribs[i] = t.attribs[i]
                        }
                    }
                    t.attribs["i-amphtml-ssr"] = "";
                    t.attribs["data-hero"] = "";
                    i(t, e)
                }
            }
            t.exports = PreloadHeroImage
        },
        1523: (t, e, r) => {
            "use strict";
            const {
                createElement: i,
                nextNode: s,
                insertAfter: n,
                firstChildByTag: a
            } = r(7731);
            const {
                findMetaViewport: o,
                skipNodeAndChildren: l
            } = r(187);
            const c = 5;
            class PreloadImages {
                transform(t, e) {
                    const r = e.imagePreloadCount || c;
                    const i = a(t, "html");
                    const u = a(i, "head");
                    const d = a(i, "body");
                    const h = new Map;
                    let f = d;
                    while (f !== null) {
                        if (h.size >= r) {
                            break
                        }
                        if (f.tagName === "template") {
                            f = l(f)
                        } else {
                            this.addImage(h, f);
                            f = s(f)
                        }
                    }
                    let p = o(u);
                    for (const t of h.values()) {
                        n(u, t, p);
                        p = t
                    }
                }
                addImage(t, e) {
                    const r = this.extractImageUrl(e);
                    if (!r) {
                        return
                    }
                    if (e.attribs.srcset) {
                        return
                    }
                    t.set(r, this.createPreload(r, e.attribs.media))
                }
                extractImageUrl(t) {
                    if (!t.attribs) {
                        return null
                    }
                    if (t.tagName === "amp-img") {
                        return t.attribs.src
                    }
                    if (t.tagName === "amp-video") {
                        return t.attribs.poster
                    }
                    return null
                }
                createPreload(t, e) {
                    const r = i("link", {
                        rel: "preload",
                        href: t,
                        as: "image"
                    });
                    if (e) {
                        r.attribs.media = e
                    }
                    return r
                }
            }
            t.exports = PreloadImages
        },
        1545: (t, e, r) => {
            "use strict";
            const {
                firstChildByTag: i
            } = r(7731);
            const s = new Set(["dns-prefetch", "preconnect", "prefetch", "preload", "prerender"]);
            class PruneDuplicateResourceHints {
                transform(t) {
                    const e = new Map;
                    const r = i(t, "html");
                    if (!r) {
                        return
                    }
                    const s = i(r, "head");
                    if (!s) {
                        return
                    }
                    const n = [];
                    for (let t = s.firstChild; t !== null; t = t.nextSibling) {
                        if (this._notPruneableHintLink(t)) {
                            n.push(t)
                        } else if (!this._alreadyLoaded(t, e)) {
                            this._markPreloaded(t, e);
                            n.push(t)
                        }
                    }
                    s.childNodes = n
                }
                _notPruneableHintLink(t) {
                    if (t.tagName !== "link") {
                        return true
                    }
                    if (!t.attribs) {
                        return true
                    }
                    if (!t.attribs.rel) {
                        return true
                    }
                    if (!t.attribs.href) {
                        return true
                    }
                    if (t.attribs.rel === "preload" && !t.attribs.as) {
                        return true
                    }
                    return !s.has(t.attribs.rel)
                }
                _alreadyLoaded(t, e) {
                    const r = t.attribs.rel;
                    const i = t.attribs.href;
                    if (!e.has(i)) {
                        return false
                    }
                    const s = e.get(i);
                    return s.has(r)
                }
                _markPreloaded(t, e) {
                    const r = t.attribs.rel;
                    const i = t.attribs.href;
                    let s = e.get(i);
                    if (!s) {
                        s = new Set;
                        e.set(i, s)
                    }
                    s.add(r)
                }
            }
            t.exports = PruneDuplicateResourceHints
        },
        9609: (t, e, r) => {
            "use strict";
            const {
                firstChildByTag: i
            } = r(7731);
            const {
                AMP_TAGS: s
            } = r(1497);
            class RemoveAmpAttribute {
                transform(t) {
                    const e = i(t, "html");
                    if (!e) {
                        return
                    }
                    for (let t = 0, r = s.length; t < r; t++) {
                        delete e.attribs[s[t]]
                    }
                }
            }
            t.exports = RemoveAmpAttribute
        },
        4851: (t, e, r) => {
            "use strict";
            const {
                hasAttribute: i,
                firstChildByTag: s,
                nextNode: n
            } = r(7731);
            class RemoveCspNonce {
                transform(t) {
                    const e = s(t, "html");
                    if (!e) {
                        return
                    }
                    let r = e;
                    while (r) {
                        if (r.tagName === "script") {
                            if (i(r, "nonce")) {
                                delete r.attribs["nonce"]
                            }
                        }
                        r = n(r)
                    }
                }
            }
            t.exports = RemoveCspNonce
        },
        710: (t, e, r) => {
            "use strict";
            const {
                appendChild: i,
                appendAll: s,
                hasAttribute: n,
                firstChildByTag: a
            } = r(7731);
            const {
                isRenderDelayingExtension: o
            } = r(1993);
            class HeadNodes {
                constructor() {
                    this._styleAmpRuntime = null;
                    this._linkStyleAmpRuntime = null;
                    this._metaCharset = null;
                    this._scriptAmpEngine = null;
                    this._metaOther = [];
                    this._scriptRenderDelayingExtensions = [];
                    this._scriptNonRenderDelayingExtensions = [];
                    this._resourceHintLinks = [];
                    this._linkIcons = [];
                    this._styleAmpCustom = null;
                    this._linkStylesheetsBeforeAmpCustom = [];
                    this._others = [];
                    this._styleAmpBoilerplate = null;
                    this._noscript = null
                }
                register(t) {
                    t.forEach(this._registerNode.bind(this))
                }
                uniquifyAndSortCustomElements() {
                    this._scriptRenderDelayingExtensions = this._removeDuplicateCustomExtensions(this._scriptRenderDelayingExtensions);
                    this._scriptNonRenderDelayingExtensions = this._removeDuplicateCustomExtensions(this._scriptNonRenderDelayingExtensions)
                }
                _removeDuplicateCustomExtensions(t) {
                    const e = new Map;
                    for (const r of t) {
                        const t = this._getName(r);
                        e.set(t, r)
                    }
                    return Array.from(e.values())
                }
                appendToHead(t) {
                    i(t, this._metaCharset);
                    i(t, this._linkStyleAmpRuntime);
                    i(t, this._styleAmpRuntime);
                    s(t, this._metaOther);
                    i(t, this._scriptAmpEngine);
                    s(t, this._scriptRenderDelayingExtensions);
                    s(t, this._scriptNonRenderDelayingExtensions);
                    s(t, this._linkIcons);
                    s(t, this._resourceHintLinks);
                    s(t, this._linkStylesheetsBeforeAmpCustom);
                    i(t, this._styleAmpCustom);
                    s(t, this._others);
                    i(t, this._styleAmpBoilerplate);
                    i(t, this._noscript)
                }
                _registerNode(t) {
                    if (t.tagName === "meta") {
                        this._registerMeta(t)
                    } else if (t.tagName === "script") {
                        this._registerScript(t)
                    } else if (t.tagName === "style") {
                        this._registerStyle(t)
                    } else if (t.tagName === "link") {
                        this._registerLink(t)
                    } else if (t.tagName === "noscript") {
                        this._noscript = t
                    } else if (t.tagName) {
                        this._others.push(t)
                    }
                }
                _registerMeta(t) {
                    if (t.attribs.charset) {
                        this._metaCharset = t;
                        return
                    }
                    this._metaOther.push(t)
                }
                _registerScript(t) {
                    if (n(t, "src") && !this._getName(t)) {
                        this._scriptAmpEngine = t;
                        return
                    }
                    if (n(t, "custom-element")) {
                        if (o(t)) {
                            this._scriptRenderDelayingExtensions.push(t);
                            return
                        }
                        this._scriptNonRenderDelayingExtensions.push(t);
                        return
                    }
                    if (n(t, "custom-template")) {
                        this._scriptNonRenderDelayingExtensions.push(t);
                        return
                    }
                    this._others.push(t)
                }
                _registerStyle(t) {
                    if (n(t, "amp-runtime")) {
                        this._styleAmpRuntime = t;
                        return
                    }
                    if (n("node, amp-custom")) {
                        this._styleAmpCustom = t;
                        return
                    }
                    if (n(t, "amp-boilerplate") || n(t, "amp4ads-boilerplate")) {
                        this._styleAmpBoilerplate = t;
                        return
                    }
                    this._others.push(t)
                }
                _registerLink(t) {
                    const e = t.attribs.rel;
                    if (e === "stylesheet") {
                        if (t.attribs.href.endsWith("/v0.css")) {
                            this._linkStyleAmpRuntime = t;
                            return
                        }
                        if (!this._styleAmpCustom) {
                            this._linkStylesheetsBeforeAmpCustom.push(t);
                            return
                        }
                    }
                    if (e === "icon" || e === "shortcut icon" || e === "icon shortcut") {
                        this._linkIcons.push(t);
                        return
                    }
                    if (e === "preload" || e === "prefetch" || e === "dns-prefetch" || e === "preconnect") {
                        this._resourceHintLinks.push(t);
                        return
                    }
                    this._others.push(t)
                }
                _getName(t) {
                    return t.attribs["custom-element"] || t.attribs["custom-template"]
                }
            }
            class ReorderHeadTransformer {
                transform(t) {
                    const e = a(t, "html");
                    if (!e) {
                        return
                    }
                    const r = a(e, "head");
                    if (!r) {
                        return
                    }
                    if (!r.children) {
                        return
                    }
                    const i = new HeadNodes;
                    i.register(r.children);
                    i.uniquifyAndSortCustomElements();
                    r.children = [];
                    i.appendToHead(r)
                }
            }
            t.exports = ReorderHeadTransformer
        },
        9020: (t, e, r) => {
            "use strict";
            const {
                createElement: i,
                firstChildByTag: s,
                insertAfter: n,
                insertBefore: a,
                remove: o
            } = r(7731);
            const {
                AMP_CACHE_HOST: l
            } = r(1497);
            const {
                findMetaViewport: c
            } = r(187);
            const {
                calculateHost: u
            } = r(3800);
            class RewriteAmpUrls {
                constructor(t) {
                    this.esmModulesEnabled = t.experimentEsm;
                    this.log = t.log
                }
                transform(t, e) {
                    const r = s(t, "html");
                    const i = s(r, "head");
                    if (!i) return;
                    const a = u(e);
                    let l = i.firstChild;
                    let d = c(i);
                    const h = this.esmModulesEnabled || e.experimentEsm;
                    const f = [];
                    while (l) {
                        if (l.tagName === "script" && this._usesAmpCacheUrl(l.attribs.src)) {
                            l.attribs.src = this._replaceUrl(l.attribs.src, a);
                            if (h) {
                                f.push(this._addEsm(l))
                            } else {
                                f.push(this._createPreload(l.attribs.src, "script"))
                            }
                        } else if (l.tagName === "link" && l.attribs.rel === "stylesheet" && this._usesAmpCacheUrl(l.attribs.href)) {
                            l.attribs.href = this._replaceUrl(l.attribs.href, a);
                            f.push(this._createPreload(l.attribs.href, "style"))
                        } else if (l.tagName === "link" && l.attribs.rel === "preload" && this._usesAmpCacheUrl(l.attribs.href)) {
                            if (h && this._shouldPreload(l.attribs.href)) {
                                o(l)
                            } else {
                                l.attribs.href = this._replaceUrl(l.attribs.href, a)
                            }
                        }
                        l = l.nextSibling
                    }
                    for (const t of f) {
                        if (t) {
                            n(i, t, d)
                        }
                    }
                    if (!this._usesAmpCacheUrl(a) && !e.lts) {
                        try {
                            const t = new URL(a);
                            this._addMeta(i, "runtime-host", t.origin)
                        } catch (t) {
                            this.log.warn("ampUrlPrefix must be an absolute URL")
                        }
                    }
                    if (e.geoApiUrl && !e.lts) {
                        this._addMeta(i, "amp-geo-api", e.geoApiUrl)
                    }
                }
                _usesAmpCacheUrl(t) {
                    if (!t) {
                        return
                    }
                    return t.startsWith(l)
                }
                _replaceUrl(t, e) {
                    return e + t.substring(l.length)
                }
                _addEsm(t) {
                    let e = null;
                    const r = t.attribs.src.replace(/\.js$/, ".mjs");
                    if (this._shouldPreload(t.attribs.src)) {
                        const t = i("link", {
                            as: "script",
                            crossorigin: "anonymous",
                            href: r,
                            rel: "preload"
                        });
                        e = t
                    }
                    const s = i("script", {
                        async: "",
                        nomodule: "",
                        src: t.attribs.src
                    });
                    a(t.parent, s, t);
                    t.attribs.type = "module";
                    t.attribs.crossorigin = "anonymous";
                    t.attribs.src = r;
                    return e
                }
                _createPreload(t, e) {
                    if (!this._shouldPreload(t)) {
                        return null
                    }
                    return i("link", {
                        rel: "preload",
                        href: t,
                        as: e
                    })
                }
                _shouldPreload(t) {
                    return t.endsWith("v0.js") || t.endsWith("v0.css")
                }
                _addMeta(t, e, r) {
                    const n = i("meta", {
                        name: e,
                        content: r
                    });
                    a(t, n, s(t, "script"))
                }
                isAbsoluteUrl_(t) {
                    try {
                        new URL(t);
                        return true
                    } catch (t) {
                        return false
                    }
                }
            }
            t.exports = RewriteAmpUrls
        },
        5463: (t, e, r) => {
            "use strict";
            const {
                insertText: i,
                createElement: s,
                hasAttribute: n,
                firstChildByTag: a
            } = r(7731);
            const o = r(7595);
            const l = r(977);
            const c = r(8937);
            const u = new Set(["animation-timing-function", "offset-distance", "opacity", "visibility", "transform", "-webkit-transform", "-moz-transform", "-o-transform", "-ms-transform"]);
            class SeparateKeyframes {
                constructor(t) {
                    this.log_ = t.log.tag("SeparateKeyframes");
                    this.minify = t.minify !== false
                }
                async transform(t) {
                    const e = a(t, "html");
                    if (!e) return;
                    const r = a(e, "head");
                    if (!r) return;
                    const d = a(e, "body") || r;
                    if (this.isAmpStory(d)) {
                        return
                    }
                    let h;
                    let f;
                    r.children = r.children.filter((t => {
                        if (t.tagName !== "style") return true;
                        if (!f && n(t, "amp-keyframes")) {
                            f = t;
                            return false
                        }
                        if (!h && n(t, "amp-custom")) {
                            h = t
                        }
                        return true
                    }));
                    const p = this.minify ? [c] : [];
                    if (!h) return;
                    let m = h.children[0];
                    if (!m || !m.data) return;
                    m = m.data;
                    const g = l.parse("");
                    const isInvalidKeyframe = t => {
                        let e;
                        for (const r of t.nodes) {
                            for (const t of r.nodes) {
                                if (!u.has(t.prop)) {
                                    e = t.prop;
                                    break
                                }
                            }
                            if (e) break
                        }
                        return e
                    };
                    const b = l.plugin("postcss-amp-keyframes-mover", (() => t => {
                        t.nodes = t.nodes.filter((t => {
                            if (t.name === "keyframes") {
                                const e = isInvalidKeyframe(t);
                                if (e) {
                                    this.logInvalid(t.name, e);
                                    return true
                                }
                                g.nodes.push(t);
                                return false
                            }
                            if (t.name === "media" || t.name === "supports") {
                                const e = Object.assign({}, t, {
                                    nodes: []
                                });
                                t.nodes = t.nodes.filter((t => {
                                    if (t.name !== "keyframes") return true;
                                    const r = isInvalidKeyframe(t);
                                    if (r) {
                                        this.logInvalid(t.name, r);
                                        return true
                                    }
                                    e.nodes.push(t)
                                }));
                                if (e.nodes.length) {
                                    g.nodes.push(e)
                                }
                                return t.nodes.length
                            }
                            return true
                        }))
                    }));
                    const {
                        css: y
                    } = await l([...p, b]).process(m, {
                        from: undefined,
                        parser: o
                    }).catch((t => {
                        this.log_.warn(`Failed to process CSS`, t.message);
                        return {
                            css: m
                        }
                    }));
                    if (g.nodes.length === 0) {
                        h.children[0].data = y;
                        return
                    }
                    if (!f) {
                        d.children = d.children.filter((t => {
                            if (t.tagName === "style" && n(t, "amp-keyframes")) {
                                f = t;
                                return false
                            }
                            return true
                        }));
                        if (!f) {
                            f = s("style", {
                                "amp-keyframes": ""
                            })
                        }
                    }
                    const v = f.children[0];
                    const _ = l.parse(v && v.data || "");
                    _.nodes = g.nodes.concat(_.nodes);
                    let x = "";
                    l.stringify(_, (t => {
                        x += t
                    }));
                    if (p.length > 0) {
                        const t = await l(p).process(x, {
                            from: undefined,
                            parser: o
                        });
                        x = t.css
                    }
                    if (!v) {
                        i(f, x)
                    } else {
                        v.data = x
                    }
                    d.children.push(f);
                    h.children[0].data = y
                }
                logInvalid(t, e) {
                    this.log_.warn(`Found invalid keyframe property '${e}' in '${t}' not moving to style[amp-keyframes]`)
                }
                isAmpStory(t) {
                    return t.children.some((t => t.tagName === "amp-story"))
                }
            }
            t.exports = SeparateKeyframes
        },
        696: (t, e, r) => {
            "use strict";
            const {
                hasAttribute: i,
                remove: s,
                createElement: n,
                insertBefore: a,
                nextNode: o,
                firstChildByTag: l
            } = r(7731);
            const {
                isRenderDelayingExtension: c,
                isCustomElement: u
            } = r(1993);
            const {
                applyLayout: d
            } = r(7832);
            const h = r(4554);
            class ServerSideRendering {
                constructor(t) {
                    this.log_ = t.log.tag("ServerSideRendering")
                }
                _hasAncestorWithTag(t, e) {
                    for (let r = t.parent; r !== null; r = r.parent) {
                        if (r.tagName === e) {
                            return true
                        }
                    }
                    return false
                }
                transform(t) {
                    const e = new h(this.log_);
                    const r = l(t, "html");
                    if (!r) {
                        return
                    }
                    const f = l(r, "body");
                    const p = l(r, "head");
                    if (typeof r.attribs["i-amphtml-layout"] !== "undefined" && r.attribs["i-amphtml-layout"] !== null) {
                        return
                    }
                    r.attribs["i-amphtml-layout"] = "";
                    let m = true;
                    for (let t = f; t; t = o(t)) {
                        e.addNode(t);
                        if (!u(t)) {
                            continue
                        }
                        if (this._hasAncestorWithTag(t, "template")) {
                            continue
                        }
                        if (t.tagName === "amp-experiment" && this.isAmpExperimentUsed(t)) {
                            m = false;
                            this.log_.debug("cannot remove boilerplate: amp-experiment")
                        }
                        if (t.tagName === "amp-audio") {
                            m = false;
                            this.log_.debug("cannot remove boilerplate: amp-audio");
                            continue
                        }
                        if (!d(t, this.log_)) {
                            this.log_.debug("cannot remove boilerplate: unsupported layout");
                            m = false;
                            continue
                        }
                    }
                    e.apply();
                    const g = n("style", {
                        "amp-runtime": ""
                    });
                    const b = p.children && p.children.length ? p.children[0] : null;
                    a(p, g, b);
                    let y;
                    for (let t = p.firstChild; t; t = t.nextSibling) {
                        if (t.tagName === "script" && i(t, "custom-element") && t.attribs["custom-element"] === "amp-experiment") {
                            continue
                        }
                        if (c(t)) {
                            this.log_.debug("cannot remove boilerplate because of a render delaying extension: ", t.tagName);
                            m = false
                        }
                        if (i(t, "amp-custom")) {
                            y = t
                        }
                    }
                    e.applyToCustomStyles(p, y);
                    if (!e.canRemoveBoilerplate) {
                        m = false
                    }
                    if (!m) {
                        return
                    }
                    r.attribs["i-amphtml-no-boilerplate"] = "";
                    const v = [];
                    for (let t = p.firstChild; t; t = t.nextSibling) {
                        if (t.tagName === "noscript" || t.tagName === "style" && i(t, "amp-boilerplate")) {
                            v.push(t)
                        }
                    }
                    for (const t of v) {
                        s(t)
                    }
                }
                isAmpExperimentUsed(t) {
                    let e;
                    for (const r of t.children || []) {
                        if (r.tagName === "script" && r.attribs && r.attribs["type"] === "application/json") {
                            e = r;
                            break
                        }
                    }
                    if (!e) {
                        return false
                    }
                    if (e.children.length !== 1) {
                        return false
                    }
                    const r = e.firstChild;
                    if (r.type !== "text") {
                        return false
                    }
                    try {
                        const t = JSON.parse(r.data);
                        return typeof t === "object" && Object.keys(t).length > 0
                    } catch (t) {
                        return false
                    }
                }
            }
            t.exports = ServerSideRendering
        },
        8436: function (t, e, r) {
            "use strict";
            var i = this && this.__createBinding || (Object.create ? function (t, e, r, i) {
                if (i === undefined) i = r;
                Object.defineProperty(t, i, {
                    enumerable: true,
                    get: function () {
                        return e[r]
                    }
                })
            } : function (t, e, r, i) {
                if (i === undefined) i = r;
                t[i] = e[r]
            });
            var s = this && this.__exportStar || function (t, e) {
                for (var r in t)
                    if (r !== "default" && !Object.prototype.hasOwnProperty.call(e, r)) i(e, t, r)
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.DomHandler = void 0;
            var n = r(3970);
            s(r(3970), e);
            var a = /\s+/g;
            var o = {
                normalizeWhitespace: false,
                withStartIndices: false,
                withEndIndices: false
            };
            var l = function () {
                function DomHandler(t, e, r) {
                    this.dom = [];
                    this._done = false;
                    this._tagStack = [];
                    this._lastNode = null;
                    this._parser = null;
                    if (typeof e === "function") {
                        r = e;
                        e = o
                    }
                    if (typeof t === "object") {
                        e = t;
                        t = undefined
                    }
                    this._callback = t !== null && t !== void 0 ? t : null;
                    this._options = e !== null && e !== void 0 ? e : o;
                    this._elementCB = r !== null && r !== void 0 ? r : null
                }
                DomHandler.prototype.onparserinit = function (t) {
                    this._parser = t
                };
                DomHandler.prototype.onreset = function () {
                    var t;
                    this.dom = [];
                    this._done = false;
                    this._tagStack = [];
                    this._lastNode = null;
                    this._parser = (t = this._parser) !== null && t !== void 0 ? t : null
                };
                DomHandler.prototype.onend = function () {
                    if (this._done) return;
                    this._done = true;
                    this._parser = null;
                    this.handleCallback(null)
                };
                DomHandler.prototype.onerror = function (t) {
                    this.handleCallback(t)
                };
                DomHandler.prototype.onclosetag = function () {
                    this._lastNode = null;
                    var t = this._tagStack.pop();
                    if (!t || !this._parser) {
                        return
                    }
                    if (this._options.withEndIndices) {
                        t.endIndex = this._parser.endIndex
                    }
                    if (this._elementCB) this._elementCB(t)
                };
                DomHandler.prototype.onopentag = function (t, e) {
                    var r = new n.Element(t, e);
                    this.addNode(r);
                    this._tagStack.push(r)
                };
                DomHandler.prototype.ontext = function (t) {
                    var e = this._options.normalizeWhitespace;
                    var r = this._lastNode;
                    if (r && r.type === "text") {
                        if (e) {
                            r.data = (r.data + t).replace(a, " ")
                        } else {
                            r.data += t
                        }
                    } else {
                        if (e) {
                            t = t.replace(a, " ")
                        }
                        var i = new n.Text(t);
                        this.addNode(i);
                        this._lastNode = i
                    }
                };
                DomHandler.prototype.oncomment = function (t) {
                    if (this._lastNode && this._lastNode.type === "comment") {
                        this._lastNode.data += t;
                        return
                    }
                    var e = new n.Comment(t);
                    this.addNode(e);
                    this._lastNode = e
                };
                DomHandler.prototype.oncommentend = function () {
                    this._lastNode = null
                };
                DomHandler.prototype.oncdatastart = function () {
                    var t = new n.Text("");
                    var e = new n.NodeWithChildren("cdata", [t]);
                    this.addNode(e);
                    t.parent = e;
                    this._lastNode = t
                };
                DomHandler.prototype.oncdataend = function () {
                    this._lastNode = null
                };
                DomHandler.prototype.onprocessinginstruction = function (t, e) {
                    var r = new n.ProcessingInstruction(t, e);
                    this.addNode(r)
                };
                DomHandler.prototype.handleCallback = function (t) {
                    if (typeof this._callback === "function") {
                        this._callback(t, this.dom)
                    } else if (t) {
                        throw t
                    }
                };
                DomHandler.prototype.addNode = function (t) {
                    var e = this._tagStack[this._tagStack.length - 1];
                    var r = e ? e.children : this.dom;
                    var i = r[r.length - 1];
                    if (this._parser) {
                        if (this._options.withStartIndices) {
                            t.startIndex = this._parser.startIndex
                        }
                        if (this._options.withEndIndices) {
                            t.endIndex = this._parser.endIndex
                        }
                    }
                    r.push(t);
                    if (i) {
                        t.prev = i;
                        i.next = t
                    }
                    if (e) {
                        t.parent = e
                    }
                    this._lastNode = null
                };
                DomHandler.prototype.addDataNode = function (t) {
                    this.addNode(t);
                    this._lastNode = t
                };
                return DomHandler
            }();
            e.DomHandler = l;
            e["default"] = l
        },
        3970: function (t, e) {
            "use strict";
            var r = this && this.__extends || function () {
                var extendStatics = function (t, e) {
                    extendStatics = Object.setPrototypeOf || {
                        __proto__: []
                    }
                        instanceof Array && function (t, e) {
                            t.__proto__ = e
                        } || function (t, e) {
                            for (var r in e)
                                if (Object.prototype.hasOwnProperty.call(e, r)) t[r] = e[r]
                        };
                    return extendStatics(t, e)
                };
                return function (t, e) {
                    extendStatics(t, e);

                    function __() {
                        this.constructor = t
                    }
                    t.prototype = e === null ? Object.create(e) : (__.prototype = e.prototype, new __)
                }
            }();
            var i = this && this.__assign || function () {
                i = Object.assign || function (t) {
                    for (var e, r = 1, i = arguments.length; r < i; r++) {
                        e = arguments[r];
                        for (var s in e)
                            if (Object.prototype.hasOwnProperty.call(e, s)) t[s] = e[s]
                    }
                    return t
                };
                return i.apply(this, arguments)
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.cloneNode = e.Element = e.NodeWithChildren = e.ProcessingInstruction = e.Comment = e.Text = e.DataNode = e.Node = void 0;
            var s = new Map([
                ["tag", 1],
                ["script", 1],
                ["style", 1],
                ["directive", 1],
                ["text", 3],
                ["cdata", 4],
                ["comment", 8]
            ]);
            var n = function () {
                function Node(t) {
                    this.type = t;
                    this.parent = null;
                    this.prev = null;
                    this.next = null;
                    this.startIndex = null;
                    this.endIndex = null
                }
                Object.defineProperty(Node.prototype, "nodeType", {
                    get: function () {
                        var t;
                        return (t = s.get(this.type)) !== null && t !== void 0 ? t : 1
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Node.prototype, "parentNode", {
                    get: function () {
                        return this.parent
                    },
                    set: function (t) {
                        this.parent = t
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Node.prototype, "previousSibling", {
                    get: function () {
                        return this.prev
                    },
                    set: function (t) {
                        this.prev = t
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Node.prototype, "nextSibling", {
                    get: function () {
                        return this.next
                    },
                    set: function (t) {
                        this.next = t
                    },
                    enumerable: false,
                    configurable: true
                });
                Node.prototype.cloneNode = function (t) {
                    if (t === void 0) {
                        t = false
                    }
                    return cloneNode(this, t)
                };
                return Node
            }();
            e.Node = n;
            var a = function (t) {
                r(DataNode, t);

                function DataNode(e, r) {
                    var i = t.call(this, e) || this;
                    i.data = r;
                    return i
                }
                Object.defineProperty(DataNode.prototype, "nodeValue", {
                    get: function () {
                        return this.data
                    },
                    set: function (t) {
                        this.data = t
                    },
                    enumerable: false,
                    configurable: true
                });
                return DataNode
            }(n);
            e.DataNode = a;
            var o = function (t) {
                r(Text, t);

                function Text(e) {
                    return t.call(this, "text", e) || this
                }
                return Text
            }(a);
            e.Text = o;
            var l = function (t) {
                r(Comment, t);

                function Comment(e) {
                    return t.call(this, "comment", e) || this
                }
                return Comment
            }(a);
            e.Comment = l;
            var c = function (t) {
                r(ProcessingInstruction, t);

                function ProcessingInstruction(e, r) {
                    var i = t.call(this, "directive", r) || this;
                    i.name = e;
                    return i
                }
                return ProcessingInstruction
            }(a);
            e.ProcessingInstruction = c;
            var u = function (t) {
                r(NodeWithChildren, t);

                function NodeWithChildren(e, r) {
                    var i = t.call(this, e) || this;
                    i.children = r;
                    return i
                }
                Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
                    get: function () {
                        var t;
                        return (t = this.children[0]) !== null && t !== void 0 ? t : null
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
                    get: function () {
                        return this.children.length > 0 ? this.children[this.children.length - 1] : null
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
                    get: function () {
                        return this.children
                    },
                    set: function (t) {
                        this.children = t
                    },
                    enumerable: false,
                    configurable: true
                });
                return NodeWithChildren
            }(n);
            e.NodeWithChildren = u;
            var d = function (t) {
                r(Element, t);

                function Element(e, r, i) {
                    if (i === void 0) {
                        i = []
                    }
                    var s = t.call(this, e === "script" ? "script" : e === "style" ? "style" : "tag", i) || this;
                    s.name = e;
                    s.attribs = r;
                    s.attribs = r;
                    return s
                }
                Object.defineProperty(Element.prototype, "tagName", {
                    get: function () {
                        return this.name
                    },
                    set: function (t) {
                        this.name = t
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Element.prototype, "attributes", {
                    get: function () {
                        var t = this;
                        return Object.keys(this.attribs).map((function (e) {
                            return {
                                name: e,
                                value: t.attribs[e]
                            }
                        }))
                    },
                    enumerable: false,
                    configurable: true
                });
                return Element
            }(u);
            e.Element = d;

            function cloneNode(t, e) {
                if (e === void 0) {
                    e = false
                }
                switch (t.type) {
                    case "text":
                        return new o(t.data);
                    case "directive": {
                        var r = t;
                        return new c(r.name, r.data)
                    }
                    case "comment":
                        return new l(t.data);
                    case "tag":
                    case "script":
                    case "style": {
                        var s = t;
                        var n = e ? cloneChildren(s.children) : [];
                        var a = new d(s.name, i({}, s.attribs), n);
                        n.forEach((function (t) {
                            return t.parent = a
                        }));
                        return a
                    }
                    case "cdata": {
                        var h = t;
                        var n = e ? cloneChildren(h.children) : [];
                        var f = new u("cdata", n);
                        n.forEach((function (t) {
                            return t.parent = f
                        }));
                        return f
                    }
                    case "doctype": {
                        throw new Error("Not implemented yet: ElementType.Doctype case")
                    }
                }
            }
            e.cloneNode = cloneNode;

            function cloneChildren(t) {
                var e = t.map((function (t) {
                    return cloneNode(t, true)
                }));
                for (var r = 1; r < e.length; r++) {
                    e[r].prev = e[r - 1];
                    e[r - 1].next = e[r]
                }
                return e
            }
        },
        5412: (t, e, r) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.uniqueSort = e.compareDocumentPosition = e.removeSubsets = void 0;
            var i = r(6758);

            function removeSubsets(t) {
                var e = t.length;
                while (--e >= 0) {
                    var r = t[e];
                    if (e > 0 && t.lastIndexOf(r, e - 1) >= 0) {
                        t.splice(e, 1);
                        continue
                    }
                    for (var i = r.parent; i; i = i.parent) {
                        if (t.includes(i)) {
                            t.splice(e, 1);
                            break
                        }
                    }
                }
                return t
            }
            e.removeSubsets = removeSubsets;

            function compareDocumentPosition(t, e) {
                var r = [];
                var s = [];
                if (t === e) {
                    return 0
                }
                var n = i.hasChildren(t) ? t : t.parent;
                while (n) {
                    r.unshift(n);
                    n = n.parent
                }
                n = i.hasChildren(e) ? e : e.parent;
                while (n) {
                    s.unshift(n);
                    n = n.parent
                }
                var a = Math.min(r.length, s.length);
                var o = 0;
                while (o < a && r[o] === s[o]) {
                    o++
                }
                if (o === 0) {
                    return 1
                }
                var l = r[o - 1];
                var c = l.children;
                var u = r[o];
                var d = s[o];
                if (c.indexOf(u) > c.indexOf(d)) {
                    if (l === e) {
                        return 4 | 16
                    }
                    return 4
                }
                if (l === t) {
                    return 2 | 8
                }
                return 2
            }
            e.compareDocumentPosition = compareDocumentPosition;

            function uniqueSort(t) {
                t = t.filter((function (t, e, r) {
                    return !r.includes(t, e + 1)
                }));
                t.sort((function (t, e) {
                    var r = compareDocumentPosition(t, e);
                    if (r & 2) {
                        return -1
                    } else if (r & 4) {
                        return 1
                    }
                    return 0
                }));
                return t
            }
            e.uniqueSort = uniqueSort
        },
        3790: function (t, e, r) {
            "use strict";
            var i = this && this.__createBinding || (Object.create ? function (t, e, r, i) {
                if (i === undefined) i = r;
                Object.defineProperty(t, i, {
                    enumerable: true,
                    get: function () {
                        return e[r]
                    }
                })
            } : function (t, e, r, i) {
                if (i === undefined) i = r;
                t[i] = e[r]
            });
            var s = this && this.__exportStar || function (t, e) {
                for (var r in t)
                    if (r !== "default" && !Object.prototype.hasOwnProperty.call(e, r)) i(e, t, r)
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            s(r(4153), e);
            s(r(50), e);
            s(r(6716), e);
            s(r(630), e);
            s(r(5969), e);
            s(r(5412), e);
            s(r(6758), e)
        },
        5969: (t, e, r) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.getElementsByTagType = e.getElementsByTagName = e.getElementById = e.getElements = e.testElement = void 0;
            var i = r(630);
            var s = r(6758);
            var n = {
                tag_name: function (t) {
                    if (typeof t === "function") {
                        return function (e) {
                            return s.isTag(e) && t(e.name)
                        }
                    } else if (t === "*") {
                        return s.isTag
                    }
                    return function (e) {
                        return s.isTag(e) && e.name === t
                    }
                },
                tag_type: function (t) {
                    if (typeof t === "function") {
                        return function (e) {
                            return t(e.type)
                        }
                    }
                    return function (e) {
                        return e.type === t
                    }
                },
                tag_contains: function (t) {
                    if (typeof t === "function") {
                        return function (e) {
                            return s.isText(e) && t(e.data)
                        }
                    }
                    return function (e) {
                        return s.isText(e) && e.data === t
                    }
                }
            };

            function getAttribCheck(t, e) {
                if (typeof e === "function") {
                    return function (r) {
                        return s.isTag(r) && e(r.attribs[t])
                    }
                }
                return function (r) {
                    return s.isTag(r) && r.attribs[t] === e
                }
            }

            function combineFuncs(t, e) {
                return function (r) {
                    return t(r) || e(r)
                }
            }

            function compileTest(t) {
                var e = Object.keys(t).map((function (e) {
                    var r = t[e];
                    return e in n ? n[e](r) : getAttribCheck(e, r)
                }));
                return e.length === 0 ? null : e.reduce(combineFuncs)
            }

            function testElement(t, e) {
                var r = compileTest(t);
                return r ? r(e) : true
            }
            e.testElement = testElement;

            function getElements(t, e, r, s) {
                if (s === void 0) {
                    s = Infinity
                }
                var n = compileTest(t);
                return n ? i.filter(n, e, r, s) : []
            }
            e.getElements = getElements;

            function getElementById(t, e, r) {
                if (r === void 0) {
                    r = true
                }
                if (!Array.isArray(e)) e = [e];
                return i.findOne(getAttribCheck("id", t), e, r)
            }
            e.getElementById = getElementById;

            function getElementsByTagName(t, e, r, s) {
                if (r === void 0) {
                    r = true
                }
                if (s === void 0) {
                    s = Infinity
                }
                return i.filter(n.tag_name(t), e, r, s)
            }
            e.getElementsByTagName = getElementsByTagName;

            function getElementsByTagType(t, e, r, s) {
                if (r === void 0) {
                    r = true
                }
                if (s === void 0) {
                    s = Infinity
                }
                return i.filter(n.tag_type(t), e, r, s)
            }
            e.getElementsByTagType = getElementsByTagType
        },
        6716: (t, e) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.prepend = e.prependChild = e.append = e.appendChild = e.replaceElement = e.removeElement = void 0;

            function removeElement(t) {
                if (t.prev) t.prev.next = t.next;
                if (t.next) t.next.prev = t.prev;
                if (t.parent) {
                    var e = t.parent.children;
                    e.splice(e.lastIndexOf(t), 1)
                }
            }
            e.removeElement = removeElement;

            function replaceElement(t, e) {
                var r = e.prev = t.prev;
                if (r) {
                    r.next = e
                }
                var i = e.next = t.next;
                if (i) {
                    i.prev = e
                }
                var s = e.parent = t.parent;
                if (s) {
                    var n = s.children;
                    n[n.lastIndexOf(t)] = e
                }
            }
            e.replaceElement = replaceElement;

            function appendChild(t, e) {
                removeElement(e);
                e.next = null;
                e.parent = t;
                if (t.children.push(e) > 1) {
                    var r = t.children[t.children.length - 2];
                    r.next = e;
                    e.prev = r
                } else {
                    e.prev = null
                }
            }
            e.appendChild = appendChild;

            function append(t, e) {
                removeElement(e);
                var r = t.parent;
                var i = t.next;
                e.next = i;
                e.prev = t;
                t.next = e;
                e.parent = r;
                if (i) {
                    i.prev = e;
                    if (r) {
                        var s = r.children;
                        s.splice(s.lastIndexOf(i), 0, e)
                    }
                } else if (r) {
                    r.children.push(e)
                }
            }
            e.append = append;

            function prependChild(t, e) {
                removeElement(e);
                e.parent = t;
                e.prev = null;
                if (t.children.unshift(e) !== 1) {
                    var r = t.children[1];
                    r.prev = e;
                    e.next = r
                } else {
                    e.next = null
                }
            }
            e.prependChild = prependChild;

            function prepend(t, e) {
                removeElement(e);
                var r = t.parent;
                if (r) {
                    var i = r.children;
                    i.splice(i.indexOf(t), 0, e)
                }
                if (t.prev) {
                    t.prev.next = e
                }
                e.parent = r;
                e.prev = t.prev;
                e.next = t;
                t.prev = e
            }
            e.prepend = prepend
        },
        630: (t, e, r) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.findAll = e.existsOne = e.findOne = e.findOneChild = e.find = e.filter = void 0;
            var i = r(6758);

            function filter(t, e, r, i) {
                if (r === void 0) {
                    r = true
                }
                if (i === void 0) {
                    i = Infinity
                }
                if (!Array.isArray(e)) e = [e];
                return find(t, e, r, i)
            }
            e.filter = filter;

            function find(t, e, r, s) {
                var n = [];
                for (var a = 0, o = e; a < o.length; a++) {
                    var l = o[a];
                    if (t(l)) {
                        n.push(l);
                        if (--s <= 0) break
                    }
                    if (r && i.hasChildren(l) && l.children.length > 0) {
                        var c = find(t, l.children, r, s);
                        n.push.apply(n, c);
                        s -= c.length;
                        if (s <= 0) break
                    }
                }
                return n
            }
            e.find = find;

            function findOneChild(t, e) {
                return e.find(t)
            }
            e.findOneChild = findOneChild;

            function findOne(t, e, r) {
                if (r === void 0) {
                    r = true
                }
                var s = null;
                for (var n = 0; n < e.length && !s; n++) {
                    var a = e[n];
                    if (!i.isTag(a)) {
                        continue
                    } else if (t(a)) {
                        s = a
                    } else if (r && a.children.length > 0) {
                        s = findOne(t, a.children)
                    }
                }
                return s
            }
            e.findOne = findOne;

            function existsOne(t, e) {
                return e.some((function (e) {
                    return i.isTag(e) && (t(e) || e.children.length > 0 && existsOne(t, e.children))
                }))
            }
            e.existsOne = existsOne;

            function findAll(t, e) {
                var r;
                var s = [];
                var n = e.filter(i.isTag);
                var a;
                while (a = n.shift()) {
                    var o = (r = a.children) === null || r === void 0 ? void 0 : r.filter(i.isTag);
                    if (o && o.length > 0) {
                        n.unshift.apply(n, o)
                    }
                    if (t(a)) s.push(a)
                }
                return s
            }
            e.findAll = findAll
        },
        4153: function (t, e, r) {
            "use strict";
            var i = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.getText = e.getInnerHTML = e.getOuterHTML = void 0;
            var s = r(6758);
            var n = i(r(9312));

            function getOuterHTML(t, e) {
                return n.default(t, e)
            }
            e.getOuterHTML = getOuterHTML;

            function getInnerHTML(t, e) {
                return s.hasChildren(t) ? t.children.map((function (t) {
                    return getOuterHTML(t, e)
                })).join("") : ""
            }
            e.getInnerHTML = getInnerHTML;

            function getText(t) {
                if (Array.isArray(t)) return t.map(getText).join("");
                if (s.isTag(t)) return t.name === "br" ? "\n" : getText(t.children);
                if (s.isCDATA(t)) return getText(t.children);
                if (s.isText(t)) return t.data;
                return ""
            }
            e.getText = getText
        },
        6758: (t, e, r) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.hasChildren = e.isComment = e.isText = e.isCDATA = e.isTag = void 0;
            var i = r(2795);

            function isTag(t) {
                return i.isTag(t)
            }
            e.isTag = isTag;

            function isCDATA(t) {
                return t.type === "cdata"
            }
            e.isCDATA = isCDATA;

            function isText(t) {
                return t.type === "text"
            }
            e.isText = isText;

            function isComment(t) {
                return t.type === "comment"
            }
            e.isComment = isComment;

            function hasChildren(t) {
                return Object.prototype.hasOwnProperty.call(t, "children")
            }
            e.hasChildren = hasChildren
        },
        50: (t, e, r) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.nextElementSibling = e.getName = e.hasAttrib = e.getAttributeValue = e.getSiblings = e.getParent = e.getChildren = void 0;
            var i = r(6758);
            var s = [];

            function getChildren(t) {
                var e;
                return (e = t.children) !== null && e !== void 0 ? e : s
            }
            e.getChildren = getChildren;

            function getParent(t) {
                return t.parent || null
            }
            e.getParent = getParent;

            function getSiblings(t) {
                var e, r;
                var i = getParent(t);
                if (i != null) return getChildren(i);
                var s = [t];
                var n = t.prev,
                    a = t.next;
                while (n != null) {
                    s.unshift(n);
                    e = n, n = e.prev
                }
                while (a != null) {
                    s.push(a);
                    r = a, a = r.next
                }
                return s
            }
            e.getSiblings = getSiblings;

            function getAttributeValue(t, e) {
                var r;
                return (r = t.attribs) === null || r === void 0 ? void 0 : r[e]
            }
            e.getAttributeValue = getAttributeValue;

            function hasAttrib(t, e) {
                return t.attribs != null && Object.prototype.hasOwnProperty.call(t.attribs, e) && t.attribs[e] != null
            }
            e.hasAttrib = hasAttrib;

            function getName(t) {
                return t.name
            }
            e.getName = getName;

            function nextElementSibling(t) {
                var e;
                var r = t.next;
                while (r !== null && !i.isTag(r)) e = r, r = e.next;
                return r
            }
            e.nextElementSibling = nextElementSibling
        },
        9686: function (t, e, r) {
            "use strict";
            var i = this && this.__extends || function () {
                var extendStatics = function (t, e) {
                    extendStatics = Object.setPrototypeOf || {
                        __proto__: []
                    }
                        instanceof Array && function (t, e) {
                            t.__proto__ = e
                        } || function (t, e) {
                            for (var r in e)
                                if (Object.prototype.hasOwnProperty.call(e, r)) t[r] = e[r]
                        };
                    return extendStatics(t, e)
                };
                return function (t, e) {
                    extendStatics(t, e);

                    function __() {
                        this.constructor = t
                    }
                    t.prototype = e === null ? Object.create(e) : (__.prototype = e.prototype, new __)
                }
            }();
            var s = this && this.__createBinding || (Object.create ? function (t, e, r, i) {
                if (i === undefined) i = r;
                Object.defineProperty(t, i, {
                    enumerable: true,
                    get: function () {
                        return e[r]
                    }
                })
            } : function (t, e, r, i) {
                if (i === undefined) i = r;
                t[i] = e[r]
            });
            var n = this && this.__setModuleDefault || (Object.create ? function (t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: true,
                    value: e
                })
            } : function (t, e) {
                t["default"] = e
            });
            var a = this && this.__importStar || function (t) {
                if (t && t.__esModule) return t;
                var e = {};
                if (t != null)
                    for (var r in t)
                        if (r !== "default" && Object.prototype.hasOwnProperty.call(t, r)) s(e, t, r);
                n(e, t);
                return e
            };
            var o = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.parseFeed = e.FeedHandler = void 0;
            var l = o(r(8436));
            var c = a(r(3790));
            var u = r(6118);
            var d;
            (function (t) {
                t[t["image"] = 0] = "image";
                t[t["audio"] = 1] = "audio";
                t[t["video"] = 2] = "video";
                t[t["document"] = 3] = "document";
                t[t["executable"] = 4] = "executable"
            })(d || (d = {}));
            var h;
            (function (t) {
                t[t["sample"] = 0] = "sample";
                t[t["full"] = 1] = "full";
                t[t["nonstop"] = 2] = "nonstop"
            })(h || (h = {}));
            var f = function (t) {
                i(FeedHandler, t);

                function FeedHandler(e, r) {
                    var i = this;
                    if (typeof e === "object") {
                        e = undefined;
                        r = e
                    }
                    i = t.call(this, e, r) || this;
                    return i
                }
                FeedHandler.prototype.onend = function () {
                    var t, e;
                    var r = {};
                    var i = getOneElement(isValidFeed, this.dom);
                    if (i) {
                        if (i.name === "feed") {
                            var s = i.children;
                            r.type = "atom";
                            addConditionally(r, "id", "id", s);
                            addConditionally(r, "title", "title", s);
                            var n = getAttribute("href", getOneElement("link", s));
                            if (n) {
                                r.link = n
                            }
                            addConditionally(r, "description", "subtitle", s);
                            var a = fetch("updated", s);
                            if (a) {
                                r.updated = new Date(a)
                            }
                            addConditionally(r, "author", "email", s, true);
                            r.items = getElements("entry", s).map((function (t) {
                                var e = {};
                                var r = t.children;
                                addConditionally(e, "id", "id", r);
                                addConditionally(e, "title", "title", r);
                                var i = getAttribute("href", getOneElement("link", r));
                                if (i) {
                                    e.link = i
                                }
                                var s = fetch("summary", r) || fetch("content", r);
                                if (s) {
                                    e.description = s
                                }
                                var n = fetch("updated", r);
                                if (n) {
                                    e.pubDate = new Date(n)
                                }
                                e.media = getMediaElements(r);
                                return e
                            }))
                        } else {
                            var s = (e = (t = getOneElement("channel", i.children)) === null || t === void 0 ? void 0 : t.children) !== null && e !== void 0 ? e : [];
                            r.type = i.name.substr(0, 3);
                            r.id = "";
                            addConditionally(r, "title", "title", s);
                            addConditionally(r, "link", "link", s);
                            addConditionally(r, "description", "description", s);
                            var a = fetch("lastBuildDate", s);
                            if (a) {
                                r.updated = new Date(a)
                            }
                            addConditionally(r, "author", "managingEditor", s, true);
                            r.items = getElements("item", i.children).map((function (t) {
                                var e = {};
                                var r = t.children;
                                addConditionally(e, "id", "guid", r);
                                addConditionally(e, "title", "title", r);
                                addConditionally(e, "link", "link", r);
                                addConditionally(e, "description", "description", r);
                                var i = fetch("pubDate", r);
                                if (i) e.pubDate = new Date(i);
                                e.media = getMediaElements(r);
                                return e
                            }))
                        }
                    }
                    this.feed = r;
                    this.handleCallback(i ? null : Error("couldn't find root of feed"))
                };
                return FeedHandler
            }(l.default);
            e.FeedHandler = f;

            function getMediaElements(t) {
                return getElements("media:content", t).map((function (t) {
                    var e = {
                        medium: t.attribs.medium,
                        isDefault: !!t.attribs.isDefault
                    };
                    if (t.attribs.url) {
                        e.url = t.attribs.url
                    }
                    if (t.attribs.fileSize) {
                        e.fileSize = parseInt(t.attribs.fileSize, 10)
                    }
                    if (t.attribs.type) {
                        e.type = t.attribs.type
                    }
                    if (t.attribs.expression) {
                        e.expression = t.attribs.expression
                    }
                    if (t.attribs.bitrate) {
                        e.bitrate = parseInt(t.attribs.bitrate, 10)
                    }
                    if (t.attribs.framerate) {
                        e.framerate = parseInt(t.attribs.framerate, 10)
                    }
                    if (t.attribs.samplingrate) {
                        e.samplingrate = parseInt(t.attribs.samplingrate, 10)
                    }
                    if (t.attribs.channels) {
                        e.channels = parseInt(t.attribs.channels, 10)
                    }
                    if (t.attribs.duration) {
                        e.duration = parseInt(t.attribs.duration, 10)
                    }
                    if (t.attribs.height) {
                        e.height = parseInt(t.attribs.height, 10)
                    }
                    if (t.attribs.width) {
                        e.width = parseInt(t.attribs.width, 10)
                    }
                    if (t.attribs.lang) {
                        e.lang = t.attribs.lang
                    }
                    return e
                }))
            }

            function getElements(t, e) {
                return c.getElementsByTagName(t, e, true)
            }

            function getOneElement(t, e) {
                return c.getElementsByTagName(t, e, true, 1)[0]
            }

            function fetch(t, e, r) {
                if (r === void 0) {
                    r = false
                }
                return c.getText(c.getElementsByTagName(t, e, r, 1)).trim()
            }

            function getAttribute(t, e) {
                if (!e) {
                    return null
                }
                var r = e.attribs;
                return r[t]
            }

            function addConditionally(t, e, r, i, s) {
                if (s === void 0) {
                    s = false
                }
                var n = fetch(r, i, s);
                if (n) t[e] = n
            }

            function isValidFeed(t) {
                return t === "rss" || t === "feed" || t === "rdf:RDF"
            }
            var p = {
                xmlMode: true
            };

            function parseFeed(t, e) {
                if (e === void 0) {
                    e = p
                }
                var r = new f(e);
                new u.Parser(r, e).end(t);
                return r.feed
            }
            e.parseFeed = parseFeed
        },
        6118: function (t, e, r) {
            "use strict";
            var i = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.Parser = void 0;
            var s = i(r(9180));
            var n = new Set(["input", "option", "optgroup", "select", "button", "datalist", "textarea"]);
            var a = new Set(["p"]);
            var o = {
                tr: new Set(["tr", "th", "td"]),
                th: new Set(["th"]),
                td: new Set(["thead", "th", "td"]),
                body: new Set(["head", "link", "script"]),
                li: new Set(["li"]),
                p: a,
                h1: a,
                h2: a,
                h3: a,
                h4: a,
                h5: a,
                h6: a,
                select: n,
                input: n,
                output: n,
                button: n,
                datalist: n,
                textarea: n,
                option: new Set(["option"]),
                optgroup: new Set(["optgroup", "option"]),
                dd: new Set(["dt", "dd"]),
                dt: new Set(["dt", "dd"]),
                address: a,
                article: a,
                aside: a,
                blockquote: a,
                details: a,
                div: a,
                dl: a,
                fieldset: a,
                figcaption: a,
                figure: a,
                footer: a,
                form: a,
                header: a,
                hr: a,
                main: a,
                nav: a,
                ol: a,
                pre: a,
                section: a,
                table: a,
                ul: a,
                rt: new Set(["rt", "rp"]),
                rp: new Set(["rt", "rp"]),
                tbody: new Set(["thead", "tbody"]),
                tfoot: new Set(["thead", "tbody"])
            };
            var l = new Set(["area", "base", "basefont", "br", "col", "command", "embed", "frame", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
            var c = new Set(["math", "svg"]);
            var u = new Set(["mi", "mo", "mn", "ms", "mtext", "annotation-xml", "foreignObject", "desc", "title"]);
            var d = /\s|\//;
            var h = function () {
                function Parser(t, e) {
                    if (e === void 0) {
                        e = {}
                    }
                    var r, i, n, a, o;
                    this.startIndex = 0;
                    this.endIndex = null;
                    this.tagname = "";
                    this.attribname = "";
                    this.attribvalue = "";
                    this.attribs = null;
                    this.stack = [];
                    this.foreignContext = [];
                    this.options = e;
                    this.cbs = t !== null && t !== void 0 ? t : {};
                    this.lowerCaseTagNames = (r = e.lowerCaseTags) !== null && r !== void 0 ? r : !e.xmlMode;
                    this.lowerCaseAttributeNames = (i = e.lowerCaseAttributeNames) !== null && i !== void 0 ? i : !e.xmlMode;
                    this.tokenizer = new ((n = e.Tokenizer) !== null && n !== void 0 ? n : s.default)(this.options, this);
                    (o = (a = this.cbs).onparserinit) === null || o === void 0 ? void 0 : o.call(a, this)
                }
                Parser.prototype.updatePosition = function (t) {
                    if (this.endIndex === null) {
                        if (this.tokenizer.sectionStart <= t) {
                            this.startIndex = 0
                        } else {
                            this.startIndex = this.tokenizer.sectionStart - t
                        }
                    } else {
                        this.startIndex = this.endIndex + 1
                    }
                    this.endIndex = this.tokenizer.getAbsoluteIndex()
                };
                Parser.prototype.ontext = function (t) {
                    var e, r;
                    this.updatePosition(1);
                    this.endIndex--;
                    (r = (e = this.cbs).ontext) === null || r === void 0 ? void 0 : r.call(e, t)
                };
                Parser.prototype.onopentagname = function (t) {
                    var e, r;
                    if (this.lowerCaseTagNames) {
                        t = t.toLowerCase()
                    }
                    this.tagname = t;
                    if (!this.options.xmlMode && Object.prototype.hasOwnProperty.call(o, t)) {
                        var i = void 0;
                        while (this.stack.length > 0 && o[t].has(i = this.stack[this.stack.length - 1])) {
                            this.onclosetag(i)
                        }
                    }
                    if (this.options.xmlMode || !l.has(t)) {
                        this.stack.push(t);
                        if (c.has(t)) {
                            this.foreignContext.push(true)
                        } else if (u.has(t)) {
                            this.foreignContext.push(false)
                        }
                    } (r = (e = this.cbs).onopentagname) === null || r === void 0 ? void 0 : r.call(e, t);
                    if (this.cbs.onopentag) this.attribs = {}
                };
                Parser.prototype.onopentagend = function () {
                    var t, e;
                    this.updatePosition(1);
                    if (this.attribs) {
                        (e = (t = this.cbs).onopentag) === null || e === void 0 ? void 0 : e.call(t, this.tagname, this.attribs);
                        this.attribs = null
                    }
                    if (!this.options.xmlMode && this.cbs.onclosetag && l.has(this.tagname)) {
                        this.cbs.onclosetag(this.tagname)
                    }
                    this.tagname = ""
                };
                Parser.prototype.onclosetag = function (t) {
                    this.updatePosition(1);
                    if (this.lowerCaseTagNames) {
                        t = t.toLowerCase()
                    }
                    if (c.has(t) || u.has(t)) {
                        this.foreignContext.pop()
                    }
                    if (this.stack.length && (this.options.xmlMode || !l.has(t))) {
                        var e = this.stack.lastIndexOf(t);
                        if (e !== -1) {
                            if (this.cbs.onclosetag) {
                                e = this.stack.length - e;
                                while (e--) {
                                    this.cbs.onclosetag(this.stack.pop())
                                }
                            } else this.stack.length = e
                        } else if (t === "p" && !this.options.xmlMode) {
                            this.onopentagname(t);
                            this.closeCurrentTag()
                        }
                    } else if (!this.options.xmlMode && (t === "br" || t === "p")) {
                        this.onopentagname(t);
                        this.closeCurrentTag()
                    }
                };
                Parser.prototype.onselfclosingtag = function () {
                    if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
                        this.closeCurrentTag()
                    } else {
                        this.onopentagend()
                    }
                };
                Parser.prototype.closeCurrentTag = function () {
                    var t, e;
                    var r = this.tagname;
                    this.onopentagend();
                    if (this.stack[this.stack.length - 1] === r) {
                        (e = (t = this.cbs).onclosetag) === null || e === void 0 ? void 0 : e.call(t, r);
                        this.stack.pop()
                    }
                };
                Parser.prototype.onattribname = function (t) {
                    if (this.lowerCaseAttributeNames) {
                        t = t.toLowerCase()
                    }
                    this.attribname = t
                };
                Parser.prototype.onattribdata = function (t) {
                    this.attribvalue += t
                };
                Parser.prototype.onattribend = function (t) {
                    var e, r;
                    (r = (e = this.cbs).onattribute) === null || r === void 0 ? void 0 : r.call(e, this.attribname, this.attribvalue, t);
                    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
                        this.attribs[this.attribname] = this.attribvalue
                    }
                    this.attribname = "";
                    this.attribvalue = ""
                };
                Parser.prototype.getInstructionName = function (t) {
                    var e = t.search(d);
                    var r = e < 0 ? t : t.substr(0, e);
                    if (this.lowerCaseTagNames) {
                        r = r.toLowerCase()
                    }
                    return r
                };
                Parser.prototype.ondeclaration = function (t) {
                    if (this.cbs.onprocessinginstruction) {
                        var e = this.getInstructionName(t);
                        this.cbs.onprocessinginstruction("!" + e, "!" + t)
                    }
                };
                Parser.prototype.onprocessinginstruction = function (t) {
                    if (this.cbs.onprocessinginstruction) {
                        var e = this.getInstructionName(t);
                        this.cbs.onprocessinginstruction("?" + e, "?" + t)
                    }
                };
                Parser.prototype.oncomment = function (t) {
                    var e, r, i, s;
                    this.updatePosition(4);
                    (r = (e = this.cbs).oncomment) === null || r === void 0 ? void 0 : r.call(e, t);
                    (s = (i = this.cbs).oncommentend) === null || s === void 0 ? void 0 : s.call(i)
                };
                Parser.prototype.oncdata = function (t) {
                    var e, r, i, s, n, a;
                    this.updatePosition(1);
                    if (this.options.xmlMode || this.options.recognizeCDATA) {
                        (r = (e = this.cbs).oncdatastart) === null || r === void 0 ? void 0 : r.call(e);
                        (s = (i = this.cbs).ontext) === null || s === void 0 ? void 0 : s.call(i, t);
                        (a = (n = this.cbs).oncdataend) === null || a === void 0 ? void 0 : a.call(n)
                    } else {
                        this.oncomment("[CDATA[" + t + "]]")
                    }
                };
                Parser.prototype.onerror = function (t) {
                    var e, r;
                    (r = (e = this.cbs).onerror) === null || r === void 0 ? void 0 : r.call(e, t)
                };
                Parser.prototype.onend = function () {
                    var t, e;
                    if (this.cbs.onclosetag) {
                        for (var r = this.stack.length; r > 0; this.cbs.onclosetag(this.stack[--r]));
                    } (e = (t = this.cbs).onend) === null || e === void 0 ? void 0 : e.call(t)
                };
                Parser.prototype.reset = function () {
                    var t, e, r, i;
                    (e = (t = this.cbs).onreset) === null || e === void 0 ? void 0 : e.call(t);
                    this.tokenizer.reset();
                    this.tagname = "";
                    this.attribname = "";
                    this.attribs = null;
                    this.stack = [];
                    (i = (r = this.cbs).onparserinit) === null || i === void 0 ? void 0 : i.call(r, this)
                };
                Parser.prototype.parseComplete = function (t) {
                    this.reset();
                    this.end(t)
                };
                Parser.prototype.write = function (t) {
                    this.tokenizer.write(t)
                };
                Parser.prototype.end = function (t) {
                    this.tokenizer.end(t)
                };
                Parser.prototype.pause = function () {
                    this.tokenizer.pause()
                };
                Parser.prototype.resume = function () {
                    this.tokenizer.resume()
                };
                Parser.prototype.parseChunk = function (t) {
                    this.write(t)
                };
                Parser.prototype.done = function (t) {
                    this.end(t)
                };
                return Parser
            }();
            e.Parser = h
        },
        9180: function (t, e, r) {
            "use strict";
            var i = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            var s = i(r(6425));
            var n = i(r(2059));
            var a = i(r(2184));
            var o = i(r(1542));

            function whitespace(t) {
                return t === " " || t === "\n" || t === "\t" || t === "\f" || t === "\r"
            }

            function isASCIIAlpha(t) {
                return t >= "a" && t <= "z" || t >= "A" && t <= "Z"
            }

            function ifElseState(t, e, r) {
                var i = t.toLowerCase();
                if (t === i) {
                    return function (t, s) {
                        if (s === i) {
                            t._state = e
                        } else {
                            t._state = r;
                            t._index--
                        }
                    }
                }
                return function (s, n) {
                    if (n === i || n === t) {
                        s._state = e
                    } else {
                        s._state = r;
                        s._index--
                    }
                }
            }

            function consumeSpecialNameChar(t, e) {
                var r = t.toLowerCase();
                return function (i, s) {
                    if (s === r || s === t) {
                        i._state = e
                    } else {
                        i._state = 3;
                        i._index--
                    }
                }
            }
            var l = ifElseState("C", 24, 16);
            var c = ifElseState("D", 25, 16);
            var u = ifElseState("A", 26, 16);
            var d = ifElseState("T", 27, 16);
            var h = ifElseState("A", 28, 16);
            var f = consumeSpecialNameChar("R", 35);
            var p = consumeSpecialNameChar("I", 36);
            var m = consumeSpecialNameChar("P", 37);
            var g = consumeSpecialNameChar("T", 38);
            var b = ifElseState("R", 40, 1);
            var y = ifElseState("I", 41, 1);
            var v = ifElseState("P", 42, 1);
            var _ = ifElseState("T", 43, 1);
            var x = consumeSpecialNameChar("Y", 45);
            var w = consumeSpecialNameChar("L", 46);
            var S = consumeSpecialNameChar("E", 47);
            var A = ifElseState("Y", 49, 1);
            var T = ifElseState("L", 50, 1);
            var C = ifElseState("E", 51, 1);
            var N = consumeSpecialNameChar("I", 54);
            var E = consumeSpecialNameChar("T", 55);
            var k = consumeSpecialNameChar("L", 56);
            var P = consumeSpecialNameChar("E", 57);
            var D = ifElseState("I", 58, 1);
            var L = ifElseState("T", 59, 1);
            var I = ifElseState("L", 60, 1);
            var R = ifElseState("E", 61, 1);
            var O = ifElseState("#", 63, 64);
            var M = ifElseState("X", 66, 65);
            var q = function () {
                function Tokenizer(t, e) {
                    var r;
                    this._state = 1;
                    this.buffer = "";
                    this.sectionStart = 0;
                    this._index = 0;
                    this.bufferOffset = 0;
                    this.baseState = 1;
                    this.special = 1;
                    this.running = true;
                    this.ended = false;
                    this.cbs = e;
                    this.xmlMode = !!(t === null || t === void 0 ? void 0 : t.xmlMode);
                    this.decodeEntities = (r = t === null || t === void 0 ? void 0 : t.decodeEntities) !== null && r !== void 0 ? r : true
                }
                Tokenizer.prototype.reset = function () {
                    this._state = 1;
                    this.buffer = "";
                    this.sectionStart = 0;
                    this._index = 0;
                    this.bufferOffset = 0;
                    this.baseState = 1;
                    this.special = 1;
                    this.running = true;
                    this.ended = false
                };
                Tokenizer.prototype.write = function (t) {
                    if (this.ended) this.cbs.onerror(Error(".write() after done!"));
                    this.buffer += t;
                    this.parse()
                };
                Tokenizer.prototype.end = function (t) {
                    if (this.ended) this.cbs.onerror(Error(".end() after done!"));
                    if (t) this.write(t);
                    this.ended = true;
                    if (this.running) this.finish()
                };
                Tokenizer.prototype.pause = function () {
                    this.running = false
                };
                Tokenizer.prototype.resume = function () {
                    this.running = true;
                    if (this._index < this.buffer.length) {
                        this.parse()
                    }
                    if (this.ended) {
                        this.finish()
                    }
                };
                Tokenizer.prototype.getAbsoluteIndex = function () {
                    return this.bufferOffset + this._index
                };
                Tokenizer.prototype.stateText = function (t) {
                    if (t === "<") {
                        if (this._index > this.sectionStart) {
                            this.cbs.ontext(this.getSection())
                        }
                        this._state = 2;
                        this.sectionStart = this._index
                    } else if (this.decodeEntities && t === "&" && (this.special === 1 || this.special === 4)) {
                        if (this._index > this.sectionStart) {
                            this.cbs.ontext(this.getSection())
                        }
                        this.baseState = 1;
                        this._state = 62;
                        this.sectionStart = this._index
                    }
                };
                Tokenizer.prototype.stateBeforeTagName = function (t) {
                    if (t === "/") {
                        this._state = 5
                    } else if (t === "<") {
                        this.cbs.ontext(this.getSection());
                        this.sectionStart = this._index
                    } else if (t === ">" || this.special !== 1 || whitespace(t)) {
                        this._state = 1
                    } else if (t === "!") {
                        this._state = 15;
                        this.sectionStart = this._index + 1
                    } else if (t === "?") {
                        this._state = 17;
                        this.sectionStart = this._index + 1
                    } else if (!isASCIIAlpha(t)) {
                        this._state = 1
                    } else {
                        this._state = !this.xmlMode && (t === "s" || t === "S") ? 32 : !this.xmlMode && (t === "t" || t === "T") ? 52 : 3;
                        this.sectionStart = this._index
                    }
                };
                Tokenizer.prototype.stateInTagName = function (t) {
                    if (t === "/" || t === ">" || whitespace(t)) {
                        this.emitToken("onopentagname");
                        this._state = 8;
                        this._index--
                    }
                };
                Tokenizer.prototype.stateBeforeClosingTagName = function (t) {
                    if (whitespace(t)) { } else if (t === ">") {
                        this._state = 1
                    } else if (this.special !== 1) {
                        if (t === "s" || t === "S") {
                            this._state = 33
                        } else if (t === "t" || t === "T") {
                            this._state = 53
                        } else {
                            this._state = 1;
                            this._index--
                        }
                    } else if (!isASCIIAlpha(t)) {
                        this._state = 20;
                        this.sectionStart = this._index
                    } else {
                        this._state = 6;
                        this.sectionStart = this._index
                    }
                };
                Tokenizer.prototype.stateInClosingTagName = function (t) {
                    if (t === ">" || whitespace(t)) {
                        this.emitToken("onclosetag");
                        this._state = 7;
                        this._index--
                    }
                };
                Tokenizer.prototype.stateAfterClosingTagName = function (t) {
                    if (t === ">") {
                        this._state = 1;
                        this.sectionStart = this._index + 1
                    }
                };
                Tokenizer.prototype.stateBeforeAttributeName = function (t) {
                    if (t === ">") {
                        this.cbs.onopentagend();
                        this._state = 1;
                        this.sectionStart = this._index + 1
                    } else if (t === "/") {
                        this._state = 4
                    } else if (!whitespace(t)) {
                        this._state = 9;
                        this.sectionStart = this._index
                    }
                };
                Tokenizer.prototype.stateInSelfClosingTag = function (t) {
                    if (t === ">") {
                        this.cbs.onselfclosingtag();
                        this._state = 1;
                        this.sectionStart = this._index + 1;
                        this.special = 1
                    } else if (!whitespace(t)) {
                        this._state = 8;
                        this._index--
                    }
                };
                Tokenizer.prototype.stateInAttributeName = function (t) {
                    if (t === "=" || t === "/" || t === ">" || whitespace(t)) {
                        this.cbs.onattribname(this.getSection());
                        this.sectionStart = -1;
                        this._state = 10;
                        this._index--
                    }
                };
                Tokenizer.prototype.stateAfterAttributeName = function (t) {
                    if (t === "=") {
                        this._state = 11
                    } else if (t === "/" || t === ">") {
                        this.cbs.onattribend(undefined);
                        this._state = 8;
                        this._index--
                    } else if (!whitespace(t)) {
                        this.cbs.onattribend(undefined);
                        this._state = 9;
                        this.sectionStart = this._index
                    }
                };
                Tokenizer.prototype.stateBeforeAttributeValue = function (t) {
                    if (t === '"') {
                        this._state = 12;
                        this.sectionStart = this._index + 1
                    } else if (t === "'") {
                        this._state = 13;
                        this.sectionStart = this._index + 1
                    } else if (!whitespace(t)) {
                        this._state = 14;
                        this.sectionStart = this._index;
                        this._index--
                    }
                };
                Tokenizer.prototype.handleInAttributeValue = function (t, e) {
                    if (t === e) {
                        this.emitToken("onattribdata");
                        this.cbs.onattribend(e);
                        this._state = 8
                    } else if (this.decodeEntities && t === "&") {
                        this.emitToken("onattribdata");
                        this.baseState = this._state;
                        this._state = 62;
                        this.sectionStart = this._index
                    }
                };
                Tokenizer.prototype.stateInAttributeValueDoubleQuotes = function (t) {
                    this.handleInAttributeValue(t, '"')
                };
                Tokenizer.prototype.stateInAttributeValueSingleQuotes = function (t) {
                    this.handleInAttributeValue(t, "'")
                };
                Tokenizer.prototype.stateInAttributeValueNoQuotes = function (t) {
                    if (whitespace(t) || t === ">") {
                        this.emitToken("onattribdata");
                        this.cbs.onattribend(null);
                        this._state = 8;
                        this._index--
                    } else if (this.decodeEntities && t === "&") {
                        this.emitToken("onattribdata");
                        this.baseState = this._state;
                        this._state = 62;
                        this.sectionStart = this._index
                    }
                };
                Tokenizer.prototype.stateBeforeDeclaration = function (t) {
                    this._state = t === "[" ? 23 : t === "-" ? 18 : 16
                };
                Tokenizer.prototype.stateInDeclaration = function (t) {
                    if (t === ">") {
                        this.cbs.ondeclaration(this.getSection());
                        this._state = 1;
                        this.sectionStart = this._index + 1
                    }
                };
                Tokenizer.prototype.stateInProcessingInstruction = function (t) {
                    if (t === ">") {
                        this.cbs.onprocessinginstruction(this.getSection());
                        this._state = 1;
                        this.sectionStart = this._index + 1
                    }
                };
                Tokenizer.prototype.stateBeforeComment = function (t) {
                    if (t === "-") {
                        this._state = 19;
                        this.sectionStart = this._index + 1
                    } else {
                        this._state = 16
                    }
                };
                Tokenizer.prototype.stateInComment = function (t) {
                    if (t === "-") this._state = 21
                };
                Tokenizer.prototype.stateInSpecialComment = function (t) {
                    if (t === ">") {
                        this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index));
                        this._state = 1;
                        this.sectionStart = this._index + 1
                    }
                };
                Tokenizer.prototype.stateAfterComment1 = function (t) {
                    if (t === "-") {
                        this._state = 22
                    } else {
                        this._state = 19
                    }
                };
                Tokenizer.prototype.stateAfterComment2 = function (t) {
                    if (t === ">") {
                        this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index - 2));
                        this._state = 1;
                        this.sectionStart = this._index + 1
                    } else if (t !== "-") {
                        this._state = 19
                    }
                };
                Tokenizer.prototype.stateBeforeCdata6 = function (t) {
                    if (t === "[") {
                        this._state = 29;
                        this.sectionStart = this._index + 1
                    } else {
                        this._state = 16;
                        this._index--
                    }
                };
                Tokenizer.prototype.stateInCdata = function (t) {
                    if (t === "]") this._state = 30
                };
                Tokenizer.prototype.stateAfterCdata1 = function (t) {
                    if (t === "]") this._state = 31;
                    else this._state = 29
                };
                Tokenizer.prototype.stateAfterCdata2 = function (t) {
                    if (t === ">") {
                        this.cbs.oncdata(this.buffer.substring(this.sectionStart, this._index - 2));
                        this._state = 1;
                        this.sectionStart = this._index + 1
                    } else if (t !== "]") {
                        this._state = 29
                    }
                };
                Tokenizer.prototype.stateBeforeSpecialS = function (t) {
                    if (t === "c" || t === "C") {
                        this._state = 34
                    } else if (t === "t" || t === "T") {
                        this._state = 44
                    } else {
                        this._state = 3;
                        this._index--
                    }
                };
                Tokenizer.prototype.stateBeforeSpecialSEnd = function (t) {
                    if (this.special === 2 && (t === "c" || t === "C")) {
                        this._state = 39
                    } else if (this.special === 3 && (t === "t" || t === "T")) {
                        this._state = 48
                    } else this._state = 1
                };
                Tokenizer.prototype.stateBeforeSpecialLast = function (t, e) {
                    if (t === "/" || t === ">" || whitespace(t)) {
                        this.special = e
                    }
                    this._state = 3;
                    this._index--
                };
                Tokenizer.prototype.stateAfterSpecialLast = function (t, e) {
                    if (t === ">" || whitespace(t)) {
                        this.special = 1;
                        this._state = 6;
                        this.sectionStart = this._index - e;
                        this._index--
                    } else this._state = 1
                };
                Tokenizer.prototype.parseFixedEntity = function (t) {
                    if (t === void 0) {
                        t = this.xmlMode ? o.default : n.default
                    }
                    if (this.sectionStart + 1 < this._index) {
                        var e = this.buffer.substring(this.sectionStart + 1, this._index);
                        if (Object.prototype.hasOwnProperty.call(t, e)) {
                            this.emitPartial(t[e]);
                            this.sectionStart = this._index + 1
                        }
                    }
                };
                Tokenizer.prototype.parseLegacyEntity = function () {
                    var t = this.sectionStart + 1;
                    var e = Math.min(this._index - t, 6);
                    while (e >= 2) {
                        var r = this.buffer.substr(t, e);
                        if (Object.prototype.hasOwnProperty.call(a.default, r)) {
                            this.emitPartial(a.default[r]);
                            this.sectionStart += e + 1;
                            return
                        }
                        e--
                    }
                };
                Tokenizer.prototype.stateInNamedEntity = function (t) {
                    if (t === ";") {
                        this.parseFixedEntity();
                        if (this.baseState === 1 && this.sectionStart + 1 < this._index && !this.xmlMode) {
                            this.parseLegacyEntity()
                        }
                        this._state = this.baseState
                    } else if ((t < "0" || t > "9") && !isASCIIAlpha(t)) {
                        if (this.xmlMode || this.sectionStart + 1 === this._index) { } else if (this.baseState !== 1) {
                            if (t !== "=") {
                                this.parseFixedEntity(a.default)
                            }
                        } else {
                            this.parseLegacyEntity()
                        }
                        this._state = this.baseState;
                        this._index--
                    }
                };
                Tokenizer.prototype.decodeNumericEntity = function (t, e, r) {
                    var i = this.sectionStart + t;
                    if (i !== this._index) {
                        var n = this.buffer.substring(i, this._index);
                        var a = parseInt(n, e);
                        this.emitPartial(s.default(a));
                        this.sectionStart = r ? this._index + 1 : this._index
                    }
                    this._state = this.baseState
                };
                Tokenizer.prototype.stateInNumericEntity = function (t) {
                    if (t === ";") {
                        this.decodeNumericEntity(2, 10, true)
                    } else if (t < "0" || t > "9") {
                        if (!this.xmlMode) {
                            this.decodeNumericEntity(2, 10, false)
                        } else {
                            this._state = this.baseState
                        }
                        this._index--
                    }
                };
                Tokenizer.prototype.stateInHexEntity = function (t) {
                    if (t === ";") {
                        this.decodeNumericEntity(3, 16, true)
                    } else if ((t < "a" || t > "f") && (t < "A" || t > "F") && (t < "0" || t > "9")) {
                        if (!this.xmlMode) {
                            this.decodeNumericEntity(3, 16, false)
                        } else {
                            this._state = this.baseState
                        }
                        this._index--
                    }
                };
                Tokenizer.prototype.cleanup = function () {
                    if (this.sectionStart < 0) {
                        this.buffer = "";
                        this.bufferOffset += this._index;
                        this._index = 0
                    } else if (this.running) {
                        if (this._state === 1) {
                            if (this.sectionStart !== this._index) {
                                this.cbs.ontext(this.buffer.substr(this.sectionStart))
                            }
                            this.buffer = "";
                            this.bufferOffset += this._index;
                            this._index = 0
                        } else if (this.sectionStart === this._index) {
                            this.buffer = "";
                            this.bufferOffset += this._index;
                            this._index = 0
                        } else {
                            this.buffer = this.buffer.substr(this.sectionStart);
                            this._index -= this.sectionStart;
                            this.bufferOffset += this.sectionStart
                        }
                        this.sectionStart = 0
                    }
                };
                Tokenizer.prototype.parse = function () {
                    while (this._index < this.buffer.length && this.running) {
                        var t = this.buffer.charAt(this._index);
                        if (this._state === 1) {
                            this.stateText(t)
                        } else if (this._state === 12) {
                            this.stateInAttributeValueDoubleQuotes(t)
                        } else if (this._state === 9) {
                            this.stateInAttributeName(t)
                        } else if (this._state === 19) {
                            this.stateInComment(t)
                        } else if (this._state === 20) {
                            this.stateInSpecialComment(t)
                        } else if (this._state === 8) {
                            this.stateBeforeAttributeName(t)
                        } else if (this._state === 3) {
                            this.stateInTagName(t)
                        } else if (this._state === 6) {
                            this.stateInClosingTagName(t)
                        } else if (this._state === 2) {
                            this.stateBeforeTagName(t)
                        } else if (this._state === 10) {
                            this.stateAfterAttributeName(t)
                        } else if (this._state === 13) {
                            this.stateInAttributeValueSingleQuotes(t)
                        } else if (this._state === 11) {
                            this.stateBeforeAttributeValue(t)
                        } else if (this._state === 5) {
                            this.stateBeforeClosingTagName(t)
                        } else if (this._state === 7) {
                            this.stateAfterClosingTagName(t)
                        } else if (this._state === 32) {
                            this.stateBeforeSpecialS(t)
                        } else if (this._state === 21) {
                            this.stateAfterComment1(t)
                        } else if (this._state === 14) {
                            this.stateInAttributeValueNoQuotes(t)
                        } else if (this._state === 4) {
                            this.stateInSelfClosingTag(t)
                        } else if (this._state === 16) {
                            this.stateInDeclaration(t)
                        } else if (this._state === 15) {
                            this.stateBeforeDeclaration(t)
                        } else if (this._state === 22) {
                            this.stateAfterComment2(t)
                        } else if (this._state === 18) {
                            this.stateBeforeComment(t)
                        } else if (this._state === 33) {
                            this.stateBeforeSpecialSEnd(t)
                        } else if (this._state === 53) {
                            D(this, t)
                        } else if (this._state === 39) {
                            b(this, t)
                        } else if (this._state === 40) {
                            y(this, t)
                        } else if (this._state === 41) {
                            v(this, t)
                        } else if (this._state === 34) {
                            f(this, t)
                        } else if (this._state === 35) {
                            p(this, t)
                        } else if (this._state === 36) {
                            m(this, t)
                        } else if (this._state === 37) {
                            g(this, t)
                        } else if (this._state === 38) {
                            this.stateBeforeSpecialLast(t, 2)
                        } else if (this._state === 42) {
                            _(this, t)
                        } else if (this._state === 43) {
                            this.stateAfterSpecialLast(t, 6)
                        } else if (this._state === 44) {
                            x(this, t)
                        } else if (this._state === 29) {
                            this.stateInCdata(t)
                        } else if (this._state === 45) {
                            w(this, t)
                        } else if (this._state === 46) {
                            S(this, t)
                        } else if (this._state === 47) {
                            this.stateBeforeSpecialLast(t, 3)
                        } else if (this._state === 48) {
                            A(this, t)
                        } else if (this._state === 49) {
                            T(this, t)
                        } else if (this._state === 50) {
                            C(this, t)
                        } else if (this._state === 51) {
                            this.stateAfterSpecialLast(t, 5)
                        } else if (this._state === 52) {
                            N(this, t)
                        } else if (this._state === 54) {
                            E(this, t)
                        } else if (this._state === 55) {
                            k(this, t)
                        } else if (this._state === 56) {
                            P(this, t)
                        } else if (this._state === 57) {
                            this.stateBeforeSpecialLast(t, 4)
                        } else if (this._state === 58) {
                            L(this, t)
                        } else if (this._state === 59) {
                            I(this, t)
                        } else if (this._state === 60) {
                            R(this, t)
                        } else if (this._state === 61) {
                            this.stateAfterSpecialLast(t, 5)
                        } else if (this._state === 17) {
                            this.stateInProcessingInstruction(t)
                        } else if (this._state === 64) {
                            this.stateInNamedEntity(t)
                        } else if (this._state === 23) {
                            l(this, t)
                        } else if (this._state === 62) {
                            O(this, t)
                        } else if (this._state === 24) {
                            c(this, t)
                        } else if (this._state === 25) {
                            u(this, t)
                        } else if (this._state === 30) {
                            this.stateAfterCdata1(t)
                        } else if (this._state === 31) {
                            this.stateAfterCdata2(t)
                        } else if (this._state === 26) {
                            d(this, t)
                        } else if (this._state === 27) {
                            h(this, t)
                        } else if (this._state === 28) {
                            this.stateBeforeCdata6(t)
                        } else if (this._state === 66) {
                            this.stateInHexEntity(t)
                        } else if (this._state === 65) {
                            this.stateInNumericEntity(t)
                        } else if (this._state === 63) {
                            M(this, t)
                        } else {
                            this.cbs.onerror(Error("unknown _state"), this._state)
                        }
                        this._index++
                    }
                    this.cleanup()
                };
                Tokenizer.prototype.finish = function () {
                    if (this.sectionStart < this._index) {
                        this.handleTrailingData()
                    }
                    this.cbs.onend()
                };
                Tokenizer.prototype.handleTrailingData = function () {
                    var t = this.buffer.substr(this.sectionStart);
                    if (this._state === 29 || this._state === 30 || this._state === 31) {
                        this.cbs.oncdata(t)
                    } else if (this._state === 19 || this._state === 21 || this._state === 22) {
                        this.cbs.oncomment(t)
                    } else if (this._state === 64 && !this.xmlMode) {
                        this.parseLegacyEntity();
                        if (this.sectionStart < this._index) {
                            this._state = this.baseState;
                            this.handleTrailingData()
                        }
                    } else if (this._state === 65 && !this.xmlMode) {
                        this.decodeNumericEntity(2, 10, false);
                        if (this.sectionStart < this._index) {
                            this._state = this.baseState;
                            this.handleTrailingData()
                        }
                    } else if (this._state === 66 && !this.xmlMode) {
                        this.decodeNumericEntity(3, 16, false);
                        if (this.sectionStart < this._index) {
                            this._state = this.baseState;
                            this.handleTrailingData()
                        }
                    } else if (this._state !== 3 && this._state !== 8 && this._state !== 11 && this._state !== 10 && this._state !== 9 && this._state !== 13 && this._state !== 12 && this._state !== 14 && this._state !== 6) {
                        this.cbs.ontext(t)
                    }
                };
                Tokenizer.prototype.getSection = function () {
                    return this.buffer.substring(this.sectionStart, this._index)
                };
                Tokenizer.prototype.emitToken = function (t) {
                    this.cbs[t](this.getSection());
                    this.sectionStart = -1
                };
                Tokenizer.prototype.emitPartial = function (t) {
                    if (this.baseState !== 1) {
                        this.cbs.onattribdata(t)
                    } else {
                        this.cbs.ontext(t)
                    }
                };
                return Tokenizer
            }();
            e["default"] = q
        },
        91: function (t, e, r) {
            "use strict";
            var i = this && this.__createBinding || (Object.create ? function (t, e, r, i) {
                if (i === undefined) i = r;
                Object.defineProperty(t, i, {
                    enumerable: true,
                    get: function () {
                        return e[r]
                    }
                })
            } : function (t, e, r, i) {
                if (i === undefined) i = r;
                t[i] = e[r]
            });
            var s = this && this.__setModuleDefault || (Object.create ? function (t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: true,
                    value: e
                })
            } : function (t, e) {
                t["default"] = e
            });
            var n = this && this.__importStar || function (t) {
                if (t && t.__esModule) return t;
                var e = {};
                if (t != null)
                    for (var r in t)
                        if (r !== "default" && Object.prototype.hasOwnProperty.call(t, r)) i(e, t, r);
                s(e, t);
                return e
            };
            var a = this && this.__exportStar || function (t, e) {
                for (var r in t)
                    if (r !== "default" && !Object.prototype.hasOwnProperty.call(e, r)) i(e, t, r)
            };
            var o = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.RssHandler = e.DefaultHandler = e.DomUtils = e.ElementType = e.Tokenizer = e.createDomStream = e.parseDOM = e.DomHandler = e.Parser = void 0;
            var l = r(6118);
            Object.defineProperty(e, "Parser", {
                enumerable: true,
                get: function () {
                    return l.Parser
                }
            });
            var c = r(8436);
            Object.defineProperty(e, "DomHandler", {
                enumerable: true,
                get: function () {
                    return c.DomHandler
                }
            });
            Object.defineProperty(e, "DefaultHandler", {
                enumerable: true,
                get: function () {
                    return c.DomHandler
                }
            });

            function parseDOM(t, e) {
                var r = new c.DomHandler(void 0, e);
                new l.Parser(r, e).end(t);
                return r.dom
            }
            e.parseDOM = parseDOM;

            function createDomStream(t, e, r) {
                var i = new c.DomHandler(t, e, r);
                return new l.Parser(i, e)
            }
            e.createDomStream = createDomStream;
            var u = r(9180);
            Object.defineProperty(e, "Tokenizer", {
                enumerable: true,
                get: function () {
                    return o(u).default
                }
            });
            var d = n(r(2795));
            e.ElementType = d;
            a(r(9686), e);
            e.DomUtils = n(r(3790));
            var h = r(9686);
            Object.defineProperty(e, "RssHandler", {
                enumerable: true,
                get: function () {
                    return h.FeedHandler
                }
            })
        },
        4544: (t, e, r) => {
            "use strict";
            const i = r(6461).log.tag("AMP Runtime Version");
            const s = "https://cdn.ampproject.org";
            const n = "/rtv/metadata";
            const a = "/version.txt";
            const o = {
                canary: 0,
                prod: 1,
                lts: 2
            };
            class RuntimeVersion {
                constructor(t) {
                    this.fetch_ = t
                }
                async currentVersion(t = {}) {
                    if (t.ampUrlPrefix && !this.isAbsoluteUrl_(t.ampUrlPrefix)) {
                        throw new Error("host must be an absolute URL")
                    }
                    if (t.canary && t.lts) {
                        throw new Error("lts flag is not compatible with canary flag")
                    }
                    let e = o.prod;
                    if (t.canary) {
                        e = o.canary
                    } else if (t.lts) {
                        e = o.lts
                    }
                    const r = t.ampUrlPrefix ? t.ampUrlPrefix.replace(/\/$/, "") : s;
                    let i = await this.getVersionFromRuntimeMetadata_(r, e);
                    if (!i && e === o.prod) {
                        i = await this.getVersionFromVersionTxt_(r, e)
                    }
                    return i
                }
                async getVersionFromRuntimeMetadata_(t, e) {
                    const r = t + n;
                    i.debug(`Fetching version from ${r}`);
                    let s;
                    try {
                        s = await this.fetch_(r)
                    } catch (t) { }
                    if (!s || !s.ok) {
                        i.debug("RTV metadata endpoint did not respond with a successful status code");
                        return
                    }
                    let a;
                    try {
                        a = await s.json()
                    } catch (t) {
                        i.debug("RTV metadata JSON malformed");
                        return
                    }
                    let l;
                    if (e === o.canary) {
                        if (Array.isArray(a.diversions) && a.diversions[0] && a.diversions[0].startsWith(this.getRtvConfigCode_(e))) {
                            l = a.diversions[0]
                        }
                        if (!l) {
                            i.debug("RTV metadata JSON malformed, canary version not in diversions array")
                        }
                    } else if (e === o.lts) {
                        l = a.ltsRuntimeVersion;
                        if (!l) {
                            i.debug("RTV metadata JSON malformed, lts version not in ltsRuntimeVersion")
                        }
                    } else if (e === o.prod) {
                        l = a.ampRuntimeVersion;
                        if (!l) {
                            i.debug("RTV metadata JSON malformed, production version not in ampRuntimeVersion")
                        }
                    }
                    return l
                }
                async getVersionFromVersionTxt_(t, e) {
                    if (e !== o.prod) {
                        i.debug(`version.txt lookup only supported for prod releases`);
                        return
                    }
                    let r = t + a;
                    i.debug(`Falling back to ${r}`);
                    let s;
                    try {
                        s = await this.fetch_(r)
                    } catch (t) { }
                    if (!s || !s.ok) {
                        i.debug("version.txt endpoint did not respond with a successful status code");
                        return
                    }
                    let n;
                    try {
                        n = (await s.text()).trim();
                        if (n !== encodeURIComponent(n)) {
                            throw new Error
                        }
                    } catch (t) {
                        i.debug("Version string malformed, not URL compatible");
                        return
                    }
                    return this.getRtvConfigCode_(e) + n
                }
                getRtvConfigCode_(t) {
                    if (t === o.canary) {
                        return "00"
                    }
                    return "01"
                }
                isAbsoluteUrl_(t) {
                    try {
                        new URL(t);
                        return true
                    } catch (t) {
                        return false
                    }
                }
            }
            t.exports = RuntimeVersion
        },
        1815: (t, e, r) => {
            "use strict";
            const {
                calculateHash: i
            } = r(3727);
            t.exports = {
                calculateHash: i
            }
        },
        3727: (t, e, r) => {
            const i = r(6113);
            const s = new Set(["sha384"]);
            const n = "sha384";

            function calculateHash(t, {
                algorithm: e = n
            } = {}) {
                const r = e.toLowerCase();
                if (!s.has(r)) {
                    throw new Error(`Unsupported algorithm for CSP: ${r}`)
                }
                if (typeof t === "string") {
                    t = Buffer.from(t, "utf8")
                }
                const a = i.createHash(r);
                const o = a.update(t);
                const l = base64URLFormat(o.digest("base64"));
                return `${r}-${l}`
            }

            function base64URLFormat(t) {
                return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
            }
            t.exports = {
                calculateHash: calculateHash
            }
        },
        9219: (t, e, r) => {
            "use strict";
            const i = r(529);
            const s = r(5574);
            let n = null;
            async function fetch(t = {}) {
                if (!t.noCache && n) {
                    return n
                }
                let e = t.rules;
                if (!e) {
                    e = await i(t)
                }
                n = new s(e);
                return n
            }
            t.exports = {
                fetch: fetch
            }
        },
        5574: t => {
            class AmpValidatorRules {
                constructor(t) {
                    this.raw = t;
                    this.tags = [];
                    this.extensions = [];
                    this.errors = {};
                    this.extensionCache_ = {};
                    this.initRules_(t)
                }
                getTagsForFormat(t, e = false) {
                    t = t.toLowerCase();
                    return this.tags.filter((r => r.htmlFormat.includes(t.toUpperCase()) && this.checkEntityFormat_(r, t) && this.checkEntityTransformed_(r, e))).map((r => {
                        r = Object.assign({}, r);
                        r.attrs = r.attrs.filter((r => this.checkEntityFormat_(r, t) && this.checkEntityTransformed_(r, e)));
                        return r
                    }))
                }
                getExtension(t, e) {
                    t = t.toLowerCase();
                    e = e.toLowerCase();
                    const r = `${t}|${e}`;
                    return this.extensionCache_[r] || null
                }
                checkEntityTransformed_(t, e) {
                    const r = this.isEnabled_(t, "transformed");
                    const i = this.isDisabled_(t, "transformed");
                    if (e) {
                        return r !== false && i !== true
                    }
                    return r !== true && i !== false
                }
                checkEntityFormat_(t, e) {
                    e = e.toLowerCase();
                    const r = this.isEnabled_(t, e);
                    const i = this.isDisabled_(t, e);
                    return r !== false && i !== true
                }
                isEnabled_(t, e) {
                    if (!t.enabledBy) {
                        return null
                    }
                    return t.enabledBy.includes(e)
                }
                isDisabled_(t, e) {
                    if (!t.disabledBy) {
                        return null
                    }
                    return t.disabledBy.includes(e)
                }
                initRules_(t) {
                    this.initErrors_(t);
                    this.initAttrLists_(t);
                    this.initTags_(t);
                    this.initExtensions_(t)
                }
                initErrors_(t) {
                    this.errors = {};
                    for (const e of t.errorFormats) {
                        const t = this.errors[e.code] || {};
                        t.format = e.format;
                        this.errors[e.code] = t
                    }
                    for (const e of t.errorSpecificity) {
                        const t = this.errors[e.code] || {};
                        t.specificity = e.specificity;
                        this.errors[e.code] = t
                    }
                }
                initAttrLists_(t) {
                    this.attrLists_ = {};
                    this.specialAttrLists_ = {};
                    for (const {
                        name: e,
                        attrs: r
                    } of t.attrLists) {
                        if (e.startsWith("$")) {
                            this.specialAttrLists_[e] = r
                        } else {
                            this.attrLists_[e] = r
                        }
                    }
                    this.specialAttrLists_.$AMP_LAYOUT_ATTRS.forEach((t => t.layout = true));
                    this.specialAttrLists_.$GLOBAL_ATTRS.forEach((t => t.global = true))
                }
                initTags_(t) {
                    this.tags = t.tags.filter((t => !t.extensionSpec)).map((t => {
                        t.attrs = t.attrs || [];
                        if (t.attrLists) {
                            for (const e of t.attrLists) {
                                t.attrs.push(...this.attrLists_[e])
                            }
                            delete t.attrLists
                        }
                        if (t.ampLayout) {
                            t.attrs.push(...this.specialAttrLists_.$AMP_LAYOUT_ATTRS)
                        }
                        t.attrs.push(...this.specialAttrLists_.$GLOBAL_ATTRS);
                        return t
                    }))
                }
                initExtensions_(t) {
                    this.extensions = t.tags.filter((t => t.extensionSpec)).map((t => Object.assign({}, t.extensionSpec, {
                        htmlFormat: t.htmlFormat
                    })));
                    for (const t of this.extensions) {
                        const e = t.name.toLowerCase();
                        for (let r of t.htmlFormat) {
                            r = r.toLowerCase();
                            const i = `${r}|${e}`;
                            this.extensionCache_[i] = t
                        }
                    }
                }
            }
            t.exports = AmpValidatorRules
        },
        529: (t, e, r) => {
            const i = r(9796);
            const s = "https://cdn.ampproject.org/v0/validator.json";
            async function loadRemote(t) {
                const e = await i(t);
                return e.json()
            }
            async function loadRules({
                url: t
            }) {
                t = t || s;
                return loadRemote(t)
            }
            t.exports = loadRules
        },
        9796: (t, e, r) => {
            var i = r(4429);
            var s = i.default || i;
            var fetch = function (t, e) {
                if (/^\/\//.test(t)) {
                    t = "https:" + t
                }
                return s.call(this, t, e)
            };
            t.exports = e = fetch;
            e.fetch = fetch;
            e.Headers = i.Headers;
            e.Request = i.Request;
            e.Response = i.Response;
            e["default"] = fetch
        },
        5180: (t, e) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            e.attributeNames = e.elementNames = void 0;
            e.elementNames = new Map([
                ["altglyph", "altGlyph"],
                ["altglyphdef", "altGlyphDef"],
                ["altglyphitem", "altGlyphItem"],
                ["animatecolor", "animateColor"],
                ["animatemotion", "animateMotion"],
                ["animatetransform", "animateTransform"],
                ["clippath", "clipPath"],
                ["feblend", "feBlend"],
                ["fecolormatrix", "feColorMatrix"],
                ["fecomponenttransfer", "feComponentTransfer"],
                ["fecomposite", "feComposite"],
                ["feconvolvematrix", "feConvolveMatrix"],
                ["fediffuselighting", "feDiffuseLighting"],
                ["fedisplacementmap", "feDisplacementMap"],
                ["fedistantlight", "feDistantLight"],
                ["fedropshadow", "feDropShadow"],
                ["feflood", "feFlood"],
                ["fefunca", "feFuncA"],
                ["fefuncb", "feFuncB"],
                ["fefuncg", "feFuncG"],
                ["fefuncr", "feFuncR"],
                ["fegaussianblur", "feGaussianBlur"],
                ["feimage", "feImage"],
                ["femerge", "feMerge"],
                ["femergenode", "feMergeNode"],
                ["femorphology", "feMorphology"],
                ["feoffset", "feOffset"],
                ["fepointlight", "fePointLight"],
                ["fespecularlighting", "feSpecularLighting"],
                ["fespotlight", "feSpotLight"],
                ["fetile", "feTile"],
                ["feturbulence", "feTurbulence"],
                ["foreignobject", "foreignObject"],
                ["glyphref", "glyphRef"],
                ["lineargradient", "linearGradient"],
                ["radialgradient", "radialGradient"],
                ["textpath", "textPath"]
            ]);
            e.attributeNames = new Map([
                ["definitionurl", "definitionURL"],
                ["attributename", "attributeName"],
                ["attributetype", "attributeType"],
                ["basefrequency", "baseFrequency"],
                ["baseprofile", "baseProfile"],
                ["calcmode", "calcMode"],
                ["clippathunits", "clipPathUnits"],
                ["diffuseconstant", "diffuseConstant"],
                ["edgemode", "edgeMode"],
                ["filterunits", "filterUnits"],
                ["glyphref", "glyphRef"],
                ["gradienttransform", "gradientTransform"],
                ["gradientunits", "gradientUnits"],
                ["kernelmatrix", "kernelMatrix"],
                ["kernelunitlength", "kernelUnitLength"],
                ["keypoints", "keyPoints"],
                ["keysplines", "keySplines"],
                ["keytimes", "keyTimes"],
                ["lengthadjust", "lengthAdjust"],
                ["limitingconeangle", "limitingConeAngle"],
                ["markerheight", "markerHeight"],
                ["markerunits", "markerUnits"],
                ["markerwidth", "markerWidth"],
                ["maskcontentunits", "maskContentUnits"],
                ["maskunits", "maskUnits"],
                ["numoctaves", "numOctaves"],
                ["pathlength", "pathLength"],
                ["patterncontentunits", "patternContentUnits"],
                ["patterntransform", "patternTransform"],
                ["patternunits", "patternUnits"],
                ["pointsatx", "pointsAtX"],
                ["pointsaty", "pointsAtY"],
                ["pointsatz", "pointsAtZ"],
                ["preservealpha", "preserveAlpha"],
                ["preserveaspectratio", "preserveAspectRatio"],
                ["primitiveunits", "primitiveUnits"],
                ["refx", "refX"],
                ["refy", "refY"],
                ["repeatcount", "repeatCount"],
                ["repeatdur", "repeatDur"],
                ["requiredextensions", "requiredExtensions"],
                ["requiredfeatures", "requiredFeatures"],
                ["specularconstant", "specularConstant"],
                ["specularexponent", "specularExponent"],
                ["spreadmethod", "spreadMethod"],
                ["startoffset", "startOffset"],
                ["stddeviation", "stdDeviation"],
                ["stitchtiles", "stitchTiles"],
                ["surfacescale", "surfaceScale"],
                ["systemlanguage", "systemLanguage"],
                ["tablevalues", "tableValues"],
                ["targetx", "targetX"],
                ["targety", "targetY"],
                ["textlength", "textLength"],
                ["viewbox", "viewBox"],
                ["viewtarget", "viewTarget"],
                ["xchannelselector", "xChannelSelector"],
                ["ychannelselector", "yChannelSelector"],
                ["zoomandpan", "zoomAndPan"]
            ])
        },
        9312: function (t, e, r) {
            "use strict";
            var i = this && this.__assign || function () {
                i = Object.assign || function (t) {
                    for (var e, r = 1, i = arguments.length; r < i; r++) {
                        e = arguments[r];
                        for (var s in e)
                            if (Object.prototype.hasOwnProperty.call(e, s)) t[s] = e[s]
                    }
                    return t
                };
                return i.apply(this, arguments)
            };
            var s = this && this.__createBinding || (Object.create ? function (t, e, r, i) {
                if (i === undefined) i = r;
                Object.defineProperty(t, i, {
                    enumerable: true,
                    get: function () {
                        return e[r]
                    }
                })
            } : function (t, e, r, i) {
                if (i === undefined) i = r;
                t[i] = e[r]
            });
            var n = this && this.__setModuleDefault || (Object.create ? function (t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: true,
                    value: e
                })
            } : function (t, e) {
                t["default"] = e
            });
            var a = this && this.__importStar || function (t) {
                if (t && t.__esModule) return t;
                var e = {};
                if (t != null)
                    for (var r in t)
                        if (r !== "default" && Object.prototype.hasOwnProperty.call(t, r)) s(e, t, r);
                n(e, t);
                return e
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            var o = a(r(2795));
            var l = r(3231);
            var c = r(5180);
            var u = new Set(["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"]);

            function formatAttributes(t, e) {
                if (!t) return;
                return Object.keys(t).map((function (r) {
                    var i, s;
                    var n = (i = t[r]) !== null && i !== void 0 ? i : "";
                    if (e.xmlMode === "foreign") {
                        r = (s = c.attributeNames.get(r)) !== null && s !== void 0 ? s : r
                    }
                    if (!e.emptyAttrs && !e.xmlMode && n === "") {
                        return r
                    }
                    return r + '="' + (e.decodeEntities ? l.encodeXML(n) : n.replace(/"/g, "&quot;")) + '"'
                })).join(" ")
            }
            var d = new Set(["area", "base", "basefont", "br", "col", "command", "embed", "frame", "hr", "img", "input", "isindex", "keygen", "link", "meta", "param", "source", "track", "wbr"]);

            function render(t, e) {
                if (e === void 0) {
                    e = {}
                }
                var r = Array.isArray(t) || t.cheerio ? t : [t];
                var i = "";
                for (var s = 0; s < r.length; s++) {
                    i += renderNode(r[s], e)
                }
                return i
            }
            e["default"] = render;

            function renderNode(t, e) {
                switch (t.type) {
                    case "root":
                        return render(t.children, e);
                    case o.Directive:
                        return renderDirective(t);
                    case o.Comment:
                        return renderComment(t);
                    case o.CDATA:
                        return renderCdata(t);
                    default:
                        return o.isTag(t) ? renderTag(t, e) : renderText(t, e)
                }
            }
            var h = new Set(["mi", "mo", "mn", "ms", "mtext", "annotation-xml", "foreignObject", "desc", "title"]);
            var f = new Set(["svg", "math"]);

            function renderTag(t, e) {
                var r;
                if (e.xmlMode === "foreign") {
                    t.name = (r = c.elementNames.get(t.name)) !== null && r !== void 0 ? r : t.name;
                    if (t.parent && h.has(t.parent.name)) {
                        e = i(i({}, e), {
                            xmlMode: false
                        })
                    }
                }
                if (!e.xmlMode && f.has(t.name)) {
                    e = i(i({}, e), {
                        xmlMode: "foreign"
                    })
                }
                var s = "<" + t.name;
                var n = formatAttributes(t.attribs, e);
                if (n) {
                    s += " " + n
                }
                if (t.children.length === 0 && (e.xmlMode ? e.selfClosingTags !== false : e.selfClosingTags && d.has(t.name))) {
                    if (!e.xmlMode) s += " ";
                    s += "/>"
                } else {
                    s += ">";
                    if (t.children.length > 0) {
                        s += render(t.children, e)
                    }
                    if (e.xmlMode || !d.has(t.name)) {
                        s += "</" + t.name + ">"
                    }
                }
                return s
            }

            function renderDirective(t) {
                return "<" + t.data + ">"
            }

            function renderText(t, e) {
                var r = t.data || "";
                if (e.decodeEntities && !(t.parent && u.has(t.parent.name))) {
                    r = l.encodeXML(r)
                }
                return r
            }

            function renderCdata(t) {
                return "<![CDATA[" + t.children[0].data + "]]>"
            }

            function renderComment(t) {
                return "\x3c!--" + t.data + "--\x3e"
            }
        },
        2795: (t, e) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });

            function isTag(t) {
                return t.type === "tag" || t.type === "script" || t.type === "style"
            }
            e.isTag = isTag;
            e.Text = "text";
            e.Directive = "directive";
            e.Comment = "comment";
            e.Script = "script";
            e.Style = "style";
            e.Tag = "tag";
            e.CDATA = "cdata";
            e.Doctype = "doctype"
        },
        6974: function (t, e, r) {
            "use strict";
            var i = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            var s = i(r(2059));
            var n = i(r(2184));
            var a = i(r(1542));
            var o = i(r(6425));
            e.decodeXML = getStrictDecoder(a.default);
            e.decodeHTMLStrict = getStrictDecoder(s.default);

            function getStrictDecoder(t) {
                var e = Object.keys(t).join("|");
                var r = getReplacer(t);
                e += "|#[xX][\\da-fA-F]+|#\\d+";
                var i = new RegExp("&(?:" + e + ");", "g");
                return function (t) {
                    return String(t).replace(i, r)
                }
            }
            var sorter = function (t, e) {
                return t < e ? 1 : -1
            };
            e.decodeHTML = function () {
                var t = Object.keys(n.default).sort(sorter);
                var e = Object.keys(s.default).sort(sorter);
                for (var r = 0, i = 0; r < e.length; r++) {
                    if (t[i] === e[r]) {
                        e[r] += ";?";
                        i++
                    } else {
                        e[r] += ";"
                    }
                }
                var a = new RegExp("&(?:" + e.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
                var o = getReplacer(s.default);

                function replacer(t) {
                    if (t.substr(-1) !== ";") t += ";";
                    return o(t)
                }
                return function (t) {
                    return String(t).replace(a, replacer)
                }
            }();

            function getReplacer(t) {
                return function replace(e) {
                    if (e.charAt(1) === "#") {
                        if (e.charAt(2) === "X" || e.charAt(2) === "x") {
                            return o.default(parseInt(e.substr(3), 16))
                        }
                        return o.default(parseInt(e.substr(2), 10))
                    }
                    return t[e.slice(1, -1)]
                }
            }
        },
        6425: function (t, e, r) {
            "use strict";
            var i = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            var s = i(r(9388));

            function decodeCodePoint(t) {
                if (t >= 55296 && t <= 57343 || t > 1114111) {
                    return "�"
                }
                if (t in s.default) {
                    t = s.default[t]
                }
                var e = "";
                if (t > 65535) {
                    t -= 65536;
                    e += String.fromCharCode(t >>> 10 & 1023 | 55296);
                    t = 56320 | t & 1023
                }
                e += String.fromCharCode(t);
                return e
            }
            e["default"] = decodeCodePoint
        },
        1944: function (t, e, r) {
            "use strict";
            var i = this && this.__importDefault || function (t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            };
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            var s = i(r(1542));
            var n = getInverseObj(s.default);
            var a = getInverseReplacer(n);
            e.encodeXML = getInverse(n, a);
            var o = i(r(2059));
            var l = getInverseObj(o.default);
            var c = getInverseReplacer(l);
            e.encodeHTML = getInverse(l, c);

            function getInverseObj(t) {
                return Object.keys(t).sort().reduce((function (e, r) {
                    e[t[r]] = "&" + r + ";";
                    return e
                }), {})
            }

            function getInverseReplacer(t) {
                var e = [];
                var r = [];
                Object.keys(t).forEach((function (t) {
                    return t.length === 1 ? e.push("\\" + t) : r.push(t)
                }));
                r.unshift("[" + e.join("") + "]");
                return new RegExp(r.join("|"), "g")
            }
            var u = /[^\0-\x7F]/g;
            var d = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

            function singleCharReplacer(t) {
                return "&#x" + t.charCodeAt(0).toString(16).toUpperCase() + ";"
            }

            function astralReplacer(t, e) {
                var r = t.charCodeAt(0);
                var i = t.charCodeAt(1);
                var s = (r - 55296) * 1024 + i - 56320 + 65536;
                return "&#x" + s.toString(16).toUpperCase() + ";"
            }

            function getInverse(t, e) {
                return function (r) {
                    return r.replace(e, (function (e) {
                        return t[e]
                    })).replace(d, astralReplacer).replace(u, singleCharReplacer)
                }
            }
            var h = getInverseReplacer(n);

            function escape(t) {
                return t.replace(h, singleCharReplacer).replace(d, astralReplacer).replace(u, singleCharReplacer)
            }
            e.escape = escape
        },
        3231: (t, e, r) => {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: true
            });
            var i = r(6974);
            var s = r(1944);

            function decode(t, e) {
                return (!e || e <= 0 ? i.decodeXML : i.decodeHTML)(t)
            }
            e.decode = decode;

            function decodeStrict(t, e) {
                return (!e || e <= 0 ? i.decodeXML : i.decodeHTMLStrict)(t)
            }
            e.decodeStrict = decodeStrict;

            function encode(t, e) {
                return (!e || e <= 0 ? s.encodeXML : s.encodeHTML)(t)
            }
            e.encode = encode;
            var n = r(1944);
            e.encodeXML = n.encodeXML;
            e.encodeHTML = n.encodeHTML;
            e.escape = n.escape;
            e.encodeHTML4 = n.encodeHTML;
            e.encodeHTML5 = n.encodeHTML;
            var a = r(6974);
            e.decodeXML = a.decodeXML;
            e.decodeHTML = a.decodeHTML;
            e.decodeHTMLStrict = a.decodeHTMLStrict;
            e.decodeHTML4 = a.decodeHTML;
            e.decodeHTML5 = a.decodeHTML;
            e.decodeHTML4Strict = a.decodeHTMLStrict;
            e.decodeHTML5Strict = a.decodeHTMLStrict;
            e.decodeXMLStrict = a.decodeXML
        },
        3444: t => {
            "use strict";
            const e = /[\f\n\r\t\v ]{2,}/g;
            const r = " ";
            const normalize = t => t.replace(e, r);
            t.exports = normalize
        },
        1742: module => {
            module.exports = eval("require")("jimp")
        },
        8520: module => {
            module.exports = eval("require")("probe-image-size")
        },
        6113: t => {
            "use strict";
            t.exports = require("crypto")
        },
        7147: t => {
            "use strict";
            t.exports = require("fs")
        },
        8937: t => {
            "use strict";
            t.exports = require("next/dist/compiled/cssnano-simple")
        },
        7330: t => {
            "use strict";
            t.exports = require("next/dist/compiled/lru-cache")
        },
        4429: t => {
            "use strict";
            t.exports = require("next/dist/compiled/node-fetch")
        },
        7595: t => {
            "use strict";
            t.exports = require("next/dist/compiled/postcss-safe-parser")
        },
        6794: t => {
            "use strict";
            t.exports = require("next/dist/compiled/terser")
        },
        1017: t => {
            "use strict";
            t.exports = require("path")
        },
        977: t => {
            "use strict";
            t.exports = require("postcss")
        },
        7310: t => {
            "use strict";
            t.exports = require("url")
        },
        9388: t => {
            "use strict";
            t.exports = JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}')
        },
        2059: t => {
            "use strict";
            t.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"","InvisibleTimes":"","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"","NegativeThickSpace":"","NegativeThinSpace":"","NegativeVeryThinSpace":"","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}')
        },
        2184: t => {
            "use strict";
            t.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}')
        },
        1542: t => {
            "use strict";
            t.exports = JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}')
        }
    };
    var __webpack_module_cache__ = {};

    function __nccwpck_require__(t) {
        var e = __webpack_module_cache__[t];
        if (e !== undefined) {
            return e.exports
        }
        var r = __webpack_module_cache__[t] = {
            exports: {}
        };
        var i = true;
        try {
            __webpack_modules__[t].call(r.exports, r, r.exports, __nccwpck_require__);
            i = false
        } finally {
            if (i) delete __webpack_module_cache__[t]
        }
        return r.exports
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var __webpack_exports__ = __nccwpck_require__(6657);
    module.exports = __webpack_exports__
})();