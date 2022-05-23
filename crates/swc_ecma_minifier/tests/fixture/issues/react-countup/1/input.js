(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [463],
    {
        /***/
        8273:
            /***/
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    CountUp: function () {
                        return /* binding */ CountUp;
                    },
                    /* harmony export */
                });
                var __assign =
                        (undefined && undefined.__assign) ||
                        function () {
                            return (__assign =
                                Object.assign ||
                                function (t) {
                                    for (
                                        var i, a = 1, s = arguments.length;
                                        a < s;
                                        a++
                                    )
                                        for (var n in (i = arguments[a]))
                                            Object.prototype.hasOwnProperty.call(
                                                i,
                                                n
                                            ) && (t[n] = i[n]);
                                    return t;
                                }).apply(this, arguments);
                        },
                    CountUp = (function () {
                        function t(t, i, a) {
                            var s = this;
                            (this.target = t),
                                (this.endVal = i),
                                (this.options = a),
                                (this.version = "2.0.8"),
                                (this.defaults = {
                                    startVal: 0,
                                    decimalPlaces: 0,
                                    duration: 2,
                                    useEasing: !0,
                                    useGrouping: !0,
                                    smartEasingThreshold: 999,
                                    smartEasingAmount: 333,
                                    separator: ",",
                                    decimal: ".",
                                    prefix: "",
                                    suffix: "",
                                }),
                                (this.finalEndVal = null),
                                (this.useEasing = !0),
                                (this.countDown = !1),
                                (this.error = ""),
                                (this.startVal = 0),
                                (this.paused = !0),
                                (this.count = function (t) {
                                    s.startTime || (s.startTime = t);
                                    var i = t - s.startTime;
                                    (s.remaining = s.duration - i),
                                        s.useEasing
                                            ? s.countDown
                                                ? (s.frameVal =
                                                      s.startVal -
                                                      s.easingFn(
                                                          i,
                                                          0,
                                                          s.startVal - s.endVal,
                                                          s.duration
                                                      ))
                                                : (s.frameVal = s.easingFn(
                                                      i,
                                                      s.startVal,
                                                      s.endVal - s.startVal,
                                                      s.duration
                                                  ))
                                            : s.countDown
                                            ? (s.frameVal =
                                                  s.startVal -
                                                  (s.startVal - s.endVal) *
                                                      (i / s.duration))
                                            : (s.frameVal =
                                                  s.startVal +
                                                  (s.endVal - s.startVal) *
                                                      (i / s.duration)),
                                        s.countDown
                                            ? (s.frameVal =
                                                  s.frameVal < s.endVal
                                                      ? s.endVal
                                                      : s.frameVal)
                                            : (s.frameVal =
                                                  s.frameVal > s.endVal
                                                      ? s.endVal
                                                      : s.frameVal),
                                        (s.frameVal = Number(
                                            s.frameVal.toFixed(
                                                s.options.decimalPlaces
                                            )
                                        )),
                                        s.printValue(s.frameVal),
                                        i < s.duration
                                            ? (s.rAF = requestAnimationFrame(
                                                  s.count
                                              ))
                                            : null !== s.finalEndVal
                                            ? s.update(s.finalEndVal)
                                            : s.callback && s.callback();
                                }),
                                (this.formatNumber = function (t) {
                                    var i,
                                        a,
                                        n,
                                        e,
                                        r = t < 0 ? "-" : "";
                                    i = Math.abs(t).toFixed(
                                        s.options.decimalPlaces
                                    );
                                    var o = (i += "").split(".");
                                    if (
                                        ((a = o[0]),
                                        (n =
                                            o.length > 1
                                                ? s.options.decimal + o[1]
                                                : ""),
                                        s.options.useGrouping)
                                    ) {
                                        e = "";
                                        for (
                                            var l = 0, h = a.length;
                                            l < h;
                                            ++l
                                        )
                                            0 !== l &&
                                                l % 3 == 0 &&
                                                (e = s.options.separator + e),
                                                (e = a[h - l - 1] + e);
                                        a = e;
                                    }
                                    return (
                                        s.options.numerals &&
                                            s.options.numerals.length &&
                                            ((a = a.replace(
                                                /[0-9]/g,
                                                function (t) {
                                                    return s.options.numerals[
                                                        +t
                                                    ];
                                                }
                                            )),
                                            (n = n.replace(
                                                /[0-9]/g,
                                                function (t) {
                                                    return s.options.numerals[
                                                        +t
                                                    ];
                                                }
                                            ))),
                                        r +
                                            s.options.prefix +
                                            a +
                                            n +
                                            s.options.suffix
                                    );
                                }),
                                (this.easeOutExpo = function (t, i, a, s) {
                                    return (
                                        (a *
                                            (1 - Math.pow(2, (-10 * t) / s)) *
                                            1024) /
                                            1023 +
                                        i
                                    );
                                }),
                                (this.options = __assign(
                                    __assign({}, this.defaults),
                                    a
                                )),
                                (this.formattingFn = this.options.formattingFn
                                    ? this.options.formattingFn
                                    : this.formatNumber),
                                (this.easingFn = this.options.easingFn
                                    ? this.options.easingFn
                                    : this.easeOutExpo),
                                (this.startVal = this.validateValue(
                                    this.options.startVal
                                )),
                                (this.frameVal = this.startVal),
                                (this.endVal = this.validateValue(i)),
                                (this.options.decimalPlaces = Math.max(
                                    this.options.decimalPlaces
                                )),
                                this.resetDuration(),
                                (this.options.separator = String(
                                    this.options.separator
                                )),
                                (this.useEasing = this.options.useEasing),
                                "" === this.options.separator &&
                                    (this.options.useGrouping = !1),
                                (this.el =
                                    "string" == typeof t
                                        ? document.getElementById(t)
                                        : t),
                                this.el
                                    ? this.printValue(this.startVal)
                                    : (this.error =
                                          "[CountUp] target is null or undefined");
                        }
                        return (
                            (t.prototype.determineDirectionAndSmartEasing =
                                function () {
                                    var t = this.finalEndVal
                                        ? this.finalEndVal
                                        : this.endVal;
                                    this.countDown = this.startVal > t;
                                    var i = t - this.startVal;
                                    if (
                                        Math.abs(i) >
                                        this.options.smartEasingThreshold
                                    ) {
                                        this.finalEndVal = t;
                                        var a = this.countDown ? 1 : -1;
                                        (this.endVal =
                                            t +
                                            a * this.options.smartEasingAmount),
                                            (this.duration = this.duration / 2);
                                    } else
                                        (this.endVal = t),
                                            (this.finalEndVal = null);
                                    this.finalEndVal
                                        ? (this.useEasing = !1)
                                        : (this.useEasing =
                                              this.options.useEasing);
                                }),
                            (t.prototype.start = function (t) {
                                this.error ||
                                    ((this.callback = t),
                                    this.duration > 0
                                        ? (this.determineDirectionAndSmartEasing(),
                                          (this.paused = !1),
                                          (this.rAF = requestAnimationFrame(
                                              this.count
                                          )))
                                        : this.printValue(this.endVal));
                            }),
                            (t.prototype.pauseResume = function () {
                                this.paused
                                    ? ((this.startTime = null),
                                      (this.duration = this.remaining),
                                      (this.startVal = this.frameVal),
                                      this.determineDirectionAndSmartEasing(),
                                      (this.rAF = requestAnimationFrame(
                                          this.count
                                      )))
                                    : cancelAnimationFrame(this.rAF),
                                    (this.paused = !this.paused);
                            }),
                            (t.prototype.reset = function () {
                                cancelAnimationFrame(this.rAF),
                                    (this.paused = !0),
                                    this.resetDuration(),
                                    (this.startVal = this.validateValue(
                                        this.options.startVal
                                    )),
                                    (this.frameVal = this.startVal),
                                    this.printValue(this.startVal);
                            }),
                            (t.prototype.update = function (t) {
                                cancelAnimationFrame(this.rAF),
                                    (this.startTime = null),
                                    (this.endVal = this.validateValue(t)),
                                    this.endVal !== this.frameVal &&
                                        ((this.startVal = this.frameVal),
                                        this.finalEndVal ||
                                            this.resetDuration(),
                                        (this.finalEndVal = null),
                                        this.determineDirectionAndSmartEasing(),
                                        (this.rAF = requestAnimationFrame(
                                            this.count
                                        )));
                            }),
                            (t.prototype.printValue = function (t) {
                                var i = this.formattingFn(t);
                                "INPUT" === this.el.tagName
                                    ? (this.el.value = i)
                                    : "text" === this.el.tagName ||
                                      "tspan" === this.el.tagName
                                    ? (this.el.textContent = i)
                                    : (this.el.innerHTML = i);
                            }),
                            (t.prototype.ensureNumber = function (t) {
                                return "number" == typeof t && !isNaN(t);
                            }),
                            (t.prototype.validateValue = function (t) {
                                var i = Number(t);
                                return this.ensureNumber(i)
                                    ? i
                                    : ((this.error =
                                          "[CountUp] invalid start or end value: " +
                                          t),
                                      null);
                            }),
                            (t.prototype.resetDuration = function () {
                                (this.startTime = null),
                                    (this.duration =
                                        1e3 * Number(this.options.duration)),
                                    (this.remaining = this.duration);
                            }),
                            t
                        );
                    })();

                /***/
            },

        /***/
        8045:
            /***/
            function (__unused_webpack_module, exports, __webpack_require__) {
                "use strict";
                var __webpack_unused_export__;

                function _arrayWithHoles(arr) {
                    if (Array.isArray(arr)) return arr;
                }

                function _arrayWithoutHoles(arr) {
                    if (Array.isArray(arr)) {
                        for (
                            var i = 0, arr2 = new Array(arr.length);
                            i < arr.length;
                            i++
                        ) {
                            arr2[i] = arr[i];
                        }
                        return arr2;
                    }
                }

                function _iterableToArray(iter) {
                    if (
                        Symbol.iterator in Object(iter) ||
                        Object.prototype.toString.call(iter) ===
                            "[object Arguments]"
                    )
                        return Array.from(iter);
                }

                function _iterableToArrayLimit(arr, i) {
                    var _arr = [];
                    var _n = true;
                    var _d = false;
                    var _e = undefined;
                    try {
                        for (
                            var _i = arr[Symbol.iterator](), _s;
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

                function _nonIterableRest() {
                    throw new TypeError(
                        "Invalid attempt to destructure non-iterable instance"
                    );
                }

                function _nonIterableSpread() {
                    throw new TypeError(
                        "Invalid attempt to spread non-iterable instance"
                    );
                }

                function _slicedToArray(arr, i) {
                    return (
                        _arrayWithHoles(arr) ||
                        _iterableToArrayLimit(arr, i) ||
                        _nonIterableRest()
                    );
                }

                function _toConsumableArray(arr) {
                    return (
                        _arrayWithoutHoles(arr) ||
                        _iterableToArray(arr) ||
                        _nonIterableSpread()
                    );
                }
                __webpack_unused_export__ = {
                    value: true,
                };
                exports["default"] = Image;
                var _react = _interopRequireDefault(__webpack_require__(7294));
                var _head = _interopRequireDefault(__webpack_require__(5443));
                var _toBase64 = __webpack_require__(6978);
                var _imageConfig = __webpack_require__(5809);
                var _useIntersection = __webpack_require__(7190);

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

                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          };
                }

                function _objectSpread(target) {
                    var _arguments = arguments,
                        _loop = function (i) {
                            var source =
                                _arguments[i] != null ? _arguments[i] : {};
                            var ownKeys = Object.keys(source);
                            if (
                                typeof Object.getOwnPropertySymbols ===
                                "function"
                            ) {
                                ownKeys = ownKeys.concat(
                                    Object.getOwnPropertySymbols(source).filter(
                                        function (sym) {
                                            return Object.getOwnPropertyDescriptor(
                                                source,
                                                sym
                                            ).enumerable;
                                        }
                                    )
                                );
                            }
                            ownKeys.forEach(function (key) {
                                _defineProperty(target, key, source[key]);
                            });
                        };
                    for (var i = 1; i < arguments.length; i++) _loop(i);
                    return target;
                }

                function _objectWithoutProperties(source, excluded) {
                    if (source == null) return {};
                    var target = _objectWithoutPropertiesLoose(
                        source,
                        excluded
                    );
                    var key, i;
                    if (Object.getOwnPropertySymbols) {
                        var sourceSymbolKeys =
                            Object.getOwnPropertySymbols(source);
                        for (i = 0; i < sourceSymbolKeys.length; i++) {
                            key = sourceSymbolKeys[i];
                            if (excluded.indexOf(key) >= 0) continue;
                            if (
                                !Object.prototype.propertyIsEnumerable.call(
                                    source,
                                    key
                                )
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
                var loadedImageURLs = new Set();
                var allImgs = new Map();
                var perfObserver;
                var emptyDataURL =
                    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                if (false) {
                }
                var VALID_LOADING_VALUES = ["lazy", "eager", undefined];
                var loaders = new Map([
                    ["default", defaultLoader],
                    ["imgix", imgixLoader],
                    ["cloudinary", cloudinaryLoader],
                    ["akamai", akamaiLoader],
                    ["custom", customLoader],
                ]);
                var VALID_LAYOUT_VALUES = [
                    "fill",
                    "fixed",
                    "intrinsic",
                    "responsive",
                    undefined,
                ];

                function isStaticRequire(src) {
                    return src.default !== undefined;
                }

                function isStaticImageData(src) {
                    return src.src !== undefined;
                }

                function isStaticImport(src) {
                    return (
                        typeof src === "object" &&
                        (isStaticRequire(src) || isStaticImageData(src))
                    );
                }
                var ref1 =
                        {
                            deviceSizes: [
                                640, 750, 828, 1080, 1200, 1920, 2048, 3840,
                            ],
                            imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
                            path: "/_next/image",
                            loader: "default",
                        } || _imageConfig.imageConfigDefault,
                    configDeviceSizes = ref1.deviceSizes,
                    configImageSizes = ref1.imageSizes,
                    configLoader = ref1.loader,
                    configPath = ref1.path,
                    configDomains = ref1.domains;
                // sort smallest to largest
                var allSizes = _toConsumableArray(configDeviceSizes).concat(
                    _toConsumableArray(configImageSizes)
                );
                configDeviceSizes.sort(function (a, b) {
                    return a - b;
                });
                allSizes.sort(function (a, b) {
                    return a - b;
                });

                function getWidths(width, layout, sizes) {
                    if (
                        sizes &&
                        (layout === "fill" || layout === "responsive")
                    ) {
                        // Find all the "vw" percent sizes used in the sizes prop
                        var viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
                        var percentSizes = [];
                        for (
                            var match;
                            (match = viewportWidthRe.exec(sizes));
                            match
                        ) {
                            percentSizes.push(parseInt(match[2]));
                        }
                        if (percentSizes.length) {
                            var _Math;
                            var smallestRatio =
                                (_Math = Math).min.apply(
                                    _Math,
                                    _toConsumableArray(percentSizes)
                                ) * 0.01;
                            return {
                                widths: allSizes.filter(function (s) {
                                    return (
                                        s >=
                                        configDeviceSizes[0] * smallestRatio
                                    );
                                }),
                                kind: "w",
                            };
                        }
                        return {
                            widths: allSizes,
                            kind: "w",
                        };
                    }
                    if (
                        typeof width !== "number" ||
                        layout === "fill" ||
                        layout === "responsive"
                    ) {
                        return {
                            widths: configDeviceSizes,
                            kind: "w",
                        };
                    }
                    var widths = _toConsumableArray(
                        new Set( // > are actually 3x in the green color, but only 1.5x in the red and
                            // > blue colors. Showing a 3x resolution image in the app vs a 2x
                            // > resolution image will be visually the same, though the 3x image
                            // > takes significantly more data. Even true 3x resolution screens are
                            // > wasteful as the human eye cannot see that level of detail without
                            // > something like a magnifying glass.
                            // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
                            [width, width * 2 /*, width * 3*/].map(function (
                                w
                            ) {
                                return (
                                    allSizes.find(function (p) {
                                        return p >= w;
                                    }) || allSizes[allSizes.length - 1]
                                );
                            })
                        )
                    );
                    return {
                        widths: widths,
                        kind: "x",
                    };
                }

                function generateImgAttrs(param) {
                    var src = param.src,
                        unoptimized = param.unoptimized,
                        layout = param.layout,
                        width = param.width,
                        quality = param.quality,
                        sizes = param.sizes,
                        loader = param.loader;
                    if (unoptimized) {
                        return {
                            src: src,
                            srcSet: undefined,
                            sizes: undefined,
                        };
                    }
                    var ref = getWidths(width, layout, sizes),
                        widths = ref.widths,
                        kind = ref.kind;
                    var last = widths.length - 1;
                    return {
                        sizes: !sizes && kind === "w" ? "100vw" : sizes,
                        srcSet: widths
                            .map(function (w, i) {
                                return ""
                                    .concat(
                                        loader({
                                            src: src,
                                            quality: quality,
                                            width: w,
                                        }),
                                        " "
                                    )
                                    .concat(kind === "w" ? w : i + 1)
                                    .concat(kind);
                            })
                            .join(", "),
                        // It's intended to keep `src` the last attribute because React updates
                        // attributes in order. If we keep `src` the first one, Safari will
                        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
                        // updated by React. That causes multiple unnecessary requests if `srcSet`
                        // and `sizes` are defined.
                        // This bug cannot be reproduced in Chrome or Firefox.
                        src: loader({
                            src: src,
                            quality: quality,
                            width: widths[last],
                        }),
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
                    var load = loaders.get(configLoader);
                    if (load) {
                        return load(
                            _objectSpread(
                                {
                                    root: configPath,
                                },
                                loaderProps
                            )
                        );
                    }
                    throw new Error(
                        'Unknown "loader" found in "next.config.js". Expected: '
                            .concat(
                                _imageConfig.VALID_LOADERS.join(", "),
                                ". Received: "
                            )
                            .concat(configLoader)
                    );
                }
                // See https://stackoverflow.com/q/39777833/266535 for why we use this ref
                // handler instead of the img's onLoad attribute.
                function handleLoading(
                    img,
                    src,
                    layout,
                    placeholder,
                    onLoadingComplete
                ) {
                    if (!img) {
                        return;
                    }
                    var handleLoad = function () {
                        if (img.src !== emptyDataURL) {
                            var p =
                                "decode" in img
                                    ? img.decode()
                                    : Promise.resolve();
                            p.catch(function () {}).then(function () {
                                if (placeholder === "blur") {
                                    img.style.filter = "none";
                                    img.style.backgroundSize = "none";
                                    img.style.backgroundImage = "none";
                                }
                                loadedImageURLs.add(src);
                                if (onLoadingComplete) {
                                    var naturalWidth = img.naturalWidth,
                                        naturalHeight = img.naturalHeight;
                                    // Pass back read-only primitive values but not the
                                    // underlying DOM element because it could be misused.
                                    onLoadingComplete({
                                        naturalWidth: naturalWidth,
                                        naturalHeight: naturalHeight,
                                    });
                                }
                                if (false) {
                                    var parent, ref;
                                }
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

                function Image(_param) {
                    var src = _param.src,
                        sizes = _param.sizes,
                        _unoptimized = _param.unoptimized,
                        unoptimized =
                            _unoptimized === void 0 ? false : _unoptimized,
                        _priority = _param.priority,
                        priority = _priority === void 0 ? false : _priority,
                        loading = _param.loading,
                        _lazyBoundary = _param.lazyBoundary,
                        lazyBoundary =
                            _lazyBoundary === void 0 ? "200px" : _lazyBoundary,
                        className = _param.className,
                        quality = _param.quality,
                        width = _param.width,
                        height = _param.height,
                        objectFit = _param.objectFit,
                        objectPosition = _param.objectPosition,
                        onLoadingComplete = _param.onLoadingComplete,
                        _loader = _param.loader,
                        loader =
                            _loader === void 0 ? defaultImageLoader : _loader,
                        _placeholder = _param.placeholder,
                        placeholder =
                            _placeholder === void 0 ? "empty" : _placeholder,
                        blurDataURL = _param.blurDataURL,
                        all = _objectWithoutProperties(_param, [
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
                            "blurDataURL",
                        ]);
                    var rest = all;
                    var layout = sizes ? "responsive" : "intrinsic";
                    if ("layout" in rest) {
                        // Override default layout if the user specified one:
                        if (rest.layout) layout = rest.layout;
                        // Remove property so it's not spread into image:
                        delete rest["layout"];
                    }
                    var staticSrc = "";
                    if (isStaticImport(src)) {
                        var staticImageData = isStaticRequire(src)
                            ? src.default
                            : src;
                        if (!staticImageData.src) {
                            throw new Error(
                                "An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(
                                    JSON.stringify(staticImageData)
                                )
                            );
                        }
                        blurDataURL =
                            blurDataURL || staticImageData.blurDataURL;
                        staticSrc = staticImageData.src;
                        if (!layout || layout !== "fill") {
                            height = height || staticImageData.height;
                            width = width || staticImageData.width;
                            if (
                                !staticImageData.height ||
                                !staticImageData.width
                            ) {
                                throw new Error(
                                    "An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(
                                        JSON.stringify(staticImageData)
                                    )
                                );
                            }
                        }
                    }
                    src = typeof src === "string" ? src : staticSrc;
                    var widthInt = getInt(width);
                    var heightInt = getInt(height);
                    var qualityInt = getInt(quality);
                    var isLazy =
                        !priority &&
                        (loading === "lazy" || typeof loading === "undefined");
                    if (src.startsWith("data:") || src.startsWith("blob:")) {
                        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
                        unoptimized = true;
                        isLazy = false;
                    }
                    if (true && loadedImageURLs.has(src)) {
                        isLazy = false;
                    }
                    if (false) {
                        var url, urlStr, VALID_BLUR_EXT;
                    }
                    var ref2 = _slicedToArray(
                            (0, _useIntersection).useIntersection({
                                rootMargin: lazyBoundary,
                                disabled: !isLazy,
                            }),
                            2
                        ),
                        setRef = ref2[0],
                        isIntersected = ref2[1];
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
                        padding: 0,
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
                        padding: 0,
                    };
                    var hasSizer = false;
                    var sizerSvg;
                    var imgStyle = {
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
                        objectPosition: objectPosition,
                    };
                    var blurStyle =
                        placeholder === "blur"
                            ? {
                                  filter: "blur(20px)",
                                  backgroundSize: objectFit || "cover",
                                  backgroundImage: 'url("'.concat(
                                      blurDataURL,
                                      '")'
                                  ),
                                  backgroundPosition: objectPosition || "0% 0%",
                              }
                            : {};
                    if (layout === "fill") {
                        // <Image src="i.png" layout="fill" />
                        wrapperStyle.display = "block";
                        wrapperStyle.position = "absolute";
                        wrapperStyle.top = 0;
                        wrapperStyle.left = 0;
                        wrapperStyle.bottom = 0;
                        wrapperStyle.right = 0;
                    } else if (
                        typeof widthInt !== "undefined" &&
                        typeof heightInt !== "undefined"
                    ) {
                        // <Image src="i.png" width="100" height="100" />
                        var quotient = heightInt / widthInt;
                        var paddingTop = isNaN(quotient)
                            ? "100%"
                            : "".concat(quotient * 100, "%");
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
                            sizerSvg = '<svg width="'
                                .concat(widthInt, '" height="')
                                .concat(
                                    heightInt,
                                    '" xmlns="http://www.w3.org/2000/svg" version="1.1"/>'
                                );
                        } else if (layout === "fixed") {
                            // <Image src="i.png" width="100" height="100" layout="fixed" />
                            wrapperStyle.display = "inline-block";
                            wrapperStyle.position = "relative";
                            wrapperStyle.width = widthInt;
                            wrapperStyle.height = heightInt;
                        }
                    } else {
                        // <Image src="i.png" />
                        if (false) {
                        }
                    }
                    var imgAttributes = {
                        src: emptyDataURL,
                        srcSet: undefined,
                        sizes: undefined,
                    };
                    if (isVisible) {
                        imgAttributes = generateImgAttrs({
                            src: src,
                            unoptimized: unoptimized,
                            layout: layout,
                            width: widthInt,
                            quality: qualityInt,
                            sizes: sizes,
                            loader: loader,
                        });
                    }
                    var srcString = src;
                    if (false) {
                        var fullUrl;
                    }
                    return /*#__PURE__*/ _react.default.createElement(
                        "span",
                        {
                            style: wrapperStyle,
                        },
                        hasSizer
                            ? /*#__PURE__*/ _react.default.createElement(
                                  "span",
                                  {
                                      style: sizerStyle,
                                  },
                                  sizerSvg
                                      ? /*#__PURE__*/ _react.default.createElement(
                                            "img",
                                            {
                                                style: {
                                                    display: "block",
                                                    maxWidth: "100%",
                                                    width: "initial",
                                                    height: "initial",
                                                    background: "none",
                                                    opacity: 1,
                                                    border: 0,
                                                    margin: 0,
                                                    padding: 0,
                                                },
                                                alt: "",
                                                "aria-hidden": true,
                                                src: "data:image/svg+xml;base64,".concat(
                                                    (0, _toBase64).toBase64(
                                                        sizerSvg
                                                    )
                                                ),
                                            }
                                        )
                                      : null
                              )
                            : null,
                        /*#__PURE__*/ _react.default.createElement(
                            "img",
                            Object.assign({}, rest, imgAttributes, {
                                decoding: "async",
                                "data-nimg": layout,
                                className: className,
                                ref: function (img) {
                                    setRef(img);
                                    handleLoading(
                                        img,
                                        srcString,
                                        layout,
                                        placeholder,
                                        onLoadingComplete
                                    );
                                },
                                style: _objectSpread({}, imgStyle, blurStyle),
                            })
                        ),
                        /*#__PURE__*/ _react.default.createElement(
                            "noscript",
                            null,
                            /*#__PURE__*/ _react.default.createElement(
                                "img",
                                Object.assign(
                                    {},
                                    rest,
                                    generateImgAttrs({
                                        src: src,
                                        unoptimized: unoptimized,
                                        layout: layout,
                                        width: widthInt,
                                        quality: qualityInt,
                                        sizes: sizes,
                                        loader: loader,
                                    }),
                                    {
                                        decoding: "async",
                                        "data-nimg": layout,
                                        style: imgStyle,
                                        className: className,
                                        // @ts-ignore - TODO: upgrade to `@types/react@17`
                                        loading: loading || "lazy",
                                    }
                                )
                            )
                        ),
                        priority // for browsers that do not support `imagesrcset`, and in those cases
                            ? // it would likely cause the incorrect image to be preloaded.
                              //
                              // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
                              /*#__PURE__*/
                              _react.default.createElement(
                                  _head.default,
                                  null,
                                  /*#__PURE__*/ _react.default.createElement(
                                      "link",
                                      {
                                          key:
                                              "__nimg-" +
                                              imgAttributes.src +
                                              imgAttributes.srcSet +
                                              imgAttributes.sizes,
                                          rel: "preload",
                                          as: "image",
                                          href: imgAttributes.srcSet
                                              ? undefined
                                              : imgAttributes.src,
                                          // @ts-ignore: imagesrcset is not yet in the link element type.
                                          imagesrcset: imgAttributes.srcSet,
                                          // @ts-ignore: imagesizes is not yet in the link element type.
                                          imagesizes: imgAttributes.sizes,
                                      }
                                  )
                              )
                            : null
                    );
                }

                function normalizeSrc(src) {
                    return src[0] === "/" ? src.slice(1) : src;
                }

                function imgixLoader(param) {
                    var root = param.root,
                        src = param.src,
                        width = param.width,
                        quality = param.quality;
                    // Demo: https://static.imgix.net/daisy.png?auto=format&fit=max&w=300
                    var url = new URL(
                        "".concat(root).concat(normalizeSrc(src))
                    );
                    var params = url.searchParams;
                    params.set("auto", params.get("auto") || "format");
                    params.set("fit", params.get("fit") || "max");
                    params.set("w", params.get("w") || width.toString());
                    if (quality) {
                        params.set("q", quality.toString());
                    }
                    return url.href;
                }

                function akamaiLoader(param) {
                    var root = param.root,
                        src = param.src,
                        width = param.width;
                    return ""
                        .concat(root)
                        .concat(normalizeSrc(src), "?imwidth=")
                        .concat(width);
                }

                function cloudinaryLoader(param) {
                    var root = param.root,
                        src = param.src,
                        width = param.width,
                        quality = param.quality;
                    // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
                    var params = [
                        "f_auto",
                        "c_limit",
                        "w_" + width,
                        "q_" + (quality || "auto"),
                    ];
                    var paramsString = params.join(",") + "/";
                    return ""
                        .concat(root)
                        .concat(paramsString)
                        .concat(normalizeSrc(src));
                }

                function customLoader(param) {
                    var src = param.src;
                    throw new Error(
                        'Image with src "'.concat(
                            src,
                            '" is missing "loader" prop.'
                        ) +
                            "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader"
                    );
                }

                function defaultLoader(param) {
                    var root = param.root,
                        src = param.src,
                        width = param.width,
                        quality = param.quality;
                    if (false) {
                        var parsedSrc, missingValues;
                    }
                    return ""
                        .concat(root, "?url=")
                        .concat(encodeURIComponent(src), "&w=")
                        .concat(width, "&q=")
                        .concat(quality || 75);
                } //# sourceMappingURL=image.js.map

                /***/
            },

        /***/
        7190:
            /***/
            function (__unused_webpack_module, exports, __webpack_require__) {
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
                        for (
                            var _i = arr[Symbol.iterator](), _s;
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

                function _nonIterableRest() {
                    throw new TypeError(
                        "Invalid attempt to destructure non-iterable instance"
                    );
                }

                function _slicedToArray(arr, i) {
                    return (
                        _arrayWithHoles(arr) ||
                        _iterableToArrayLimit(arr, i) ||
                        _nonIterableRest()
                    );
                }
                Object.defineProperty(exports, "__esModule", {
                    value: true,
                });
                exports.useIntersection = useIntersection;
                var _react = __webpack_require__(7294);
                var _requestIdleCallback = __webpack_require__(9311);
                var hasIntersectionObserver =
                    typeof IntersectionObserver !== "undefined";

                function useIntersection(param) {
                    var rootMargin = param.rootMargin,
                        disabled = param.disabled;
                    var isDisabled = disabled || !hasIntersectionObserver;
                    var unobserve = (0, _react).useRef();
                    var ref = _slicedToArray((0, _react).useState(false), 2),
                        visible = ref[0],
                        setVisible = ref[1];
                    var setRef = (0, _react).useCallback(
                        function (el) {
                            if (unobserve.current) {
                                unobserve.current();
                                unobserve.current = undefined;
                            }
                            if (isDisabled || visible) return;
                            if (el && el.tagName) {
                                unobserve.current = observe(
                                    el,
                                    function (isVisible) {
                                        return (
                                            isVisible && setVisible(isVisible)
                                        );
                                    },
                                    {
                                        rootMargin: rootMargin,
                                    }
                                );
                            }
                        },
                        [isDisabled, rootMargin, visible]
                    );
                    (0, _react).useEffect(
                        function () {
                            if (!hasIntersectionObserver) {
                                if (!visible) {
                                    var idleCallback = (0,
                                    _requestIdleCallback).requestIdleCallback(
                                        function () {
                                            return setVisible(true);
                                        }
                                    );
                                    return function () {
                                        return (0,
                                        _requestIdleCallback).cancelIdleCallback(
                                            idleCallback
                                        );
                                    };
                                }
                            }
                        },
                        [visible]
                    );
                    return [setRef, visible];
                }

                function observe(element, callback, options) {
                    var ref = createObserver(options),
                        id = ref.id,
                        observer = ref.observer,
                        elements = ref.elements;
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
                    var id = options.rootMargin || "";
                    var instance = observers.get(id);
                    if (instance) {
                        return instance;
                    }
                    var elements = new Map();
                    var observer = new IntersectionObserver(function (entries) {
                        entries.forEach(function (entry) {
                            var callback = elements.get(entry.target);
                            var isVisible =
                                entry.isIntersecting ||
                                entry.intersectionRatio > 0;
                            if (callback && isVisible) {
                                callback(isVisible);
                            }
                        });
                    }, options);
                    observers.set(
                        id,
                        (instance = {
                            id: id,
                            observer: observer,
                            elements: elements,
                        })
                    );
                    return instance;
                } //# sourceMappingURL=use-intersection.js.map

                /***/
            },

        /***/
        6978:
            /***/
            function (__unused_webpack_module, exports) {
                "use strict";

                Object.defineProperty(exports, "__esModule", {
                    value: true,
                });
                exports.toBase64 = toBase64;

                function toBase64(str) {
                    if (false) {
                    } else {
                        return window.btoa(str);
                    }
                } //# sourceMappingURL=to-base-64.js.map

                /***/
            },

        /***/
        5809:
            /***/
            function (__unused_webpack_module, exports) {
                "use strict";

                Object.defineProperty(exports, "__esModule", {
                    value: true,
                });
                exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
                const VALID_LOADERS = [
                    "default",
                    "imgix",
                    "cloudinary",
                    "akamai",
                    "custom",
                ];
                exports.VALID_LOADERS = VALID_LOADERS;
                const imageConfigDefault = {
                    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
                    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
                    path: "/_next/image",
                    loader: "default",
                    domains: [],
                    disableStaticImages: false,
                    minimumCacheTTL: 60,
                    formats: ["image/webp"],
                };
                exports.imageConfigDefault = imageConfigDefault;

                //# sourceMappingURL=image-config.js.map

                /***/
            },

        /***/
        9008:
            /***/
            function (module, __unused_webpack_exports, __webpack_require__) {
                module.exports = __webpack_require__(5443);

                /***/
            },

        /***/
        5675:
            /***/
            function (module, __unused_webpack_exports, __webpack_require__) {
                module.exports = __webpack_require__(8045);

                /***/
            },

        /***/
        7857:
            /***/
            function (__unused_webpack_module, exports, __webpack_require__) {
                "use strict";
                var __webpack_unused_export__;

                __webpack_unused_export__ = {
                    value: true,
                };

                var React = __webpack_require__(7294);
                var countup_js = __webpack_require__(8273);

                function _interopDefaultLegacy(e) {
                    return e && typeof e === "object" && "default" in e
                        ? e
                        : {
                              default: e,
                          };
                }

                var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);

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

                function _objectSpread2(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(Object(source), true).forEach(function (
                                key
                            ) {
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

                function _objectWithoutProperties(source, excluded) {
                    if (source == null) return {};

                    var target = _objectWithoutPropertiesLoose(
                        source,
                        excluded
                    );

                    var key, i;

                    if (Object.getOwnPropertySymbols) {
                        var sourceSymbolKeys =
                            Object.getOwnPropertySymbols(source);

                        for (i = 0; i < sourceSymbolKeys.length; i++) {
                            key = sourceSymbolKeys[i];
                            if (excluded.indexOf(key) >= 0) continue;
                            if (
                                !Object.prototype.propertyIsEnumerable.call(
                                    source,
                                    key
                                )
                            )
                                continue;
                            target[key] = source[key];
                        }
                    }

                    return target;
                }

                /**
                 * Silence SSR Warnings.
                 * Borrowed from Formik v2.1.1, Licensed MIT.
                 *
                 * https://github.com/formium/formik/blob/9316a864478f8fcd4fa99a0735b1d37afdf507dc/LICENSE
                 */

                var useIsomorphicLayoutEffect =
                    typeof window !== "undefined" &&
                    typeof window.document !== "undefined" &&
                    typeof window.document.createElement !== "undefined"
                        ? React.useLayoutEffect
                        : React.useEffect;

                /* eslint-disable @typescript-eslint/no-explicit-any */
                /**
                 * Create a stable reference to a callback which is updated after each render is committed.
                 * Typed version borrowed from Formik v2.2.1. Licensed MIT.
                 *
                 * https://github.com/formium/formik/blob/9316a864478f8fcd4fa99a0735b1d37afdf507dc/LICENSE
                 */

                function useEventCallback(fn) {
                    var ref = React.useRef(fn); // we copy a ref to the callback scoped to the current state/props on each render

                    useIsomorphicLayoutEffect(function () {
                        ref.current = fn;
                    });
                    return React.useCallback(function () {
                        for (
                            var _len = arguments.length,
                                args = new Array(_len),
                                _key = 0;
                            _key < _len;
                            _key++
                        ) {
                            args[_key] = arguments[_key];
                        }

                        return ref.current.apply(void 0, args);
                    }, []);
                }

                var createCountUpInstance = function createCountUpInstance(
                    el,
                    props
                ) {
                    var decimal = props.decimal,
                        decimals = props.decimals,
                        duration = props.duration,
                        easingFn = props.easingFn,
                        end = props.end,
                        formattingFn = props.formattingFn,
                        numerals = props.numerals,
                        prefix = props.prefix,
                        separator = props.separator,
                        start = props.start,
                        suffix = props.suffix,
                        useEasing = props.useEasing;
                    return new countup_js.CountUp(el, end, {
                        startVal: start,
                        duration: duration,
                        decimal: decimal,
                        decimalPlaces: decimals,
                        easingFn: easingFn,
                        formattingFn: formattingFn,
                        numerals: numerals,
                        separator: separator,
                        prefix: prefix,
                        suffix: suffix,
                        useEasing: useEasing,
                        useGrouping: !!separator,
                    });
                };

                var _excluded$1 = [
                    "ref",
                    "startOnMount",
                    "enableReinitialize",
                    "delay",
                    "onEnd",
                    "onStart",
                    "onPauseResume",
                    "onReset",
                    "onUpdate",
                ];
                var DEFAULTS = {
                    decimal: ".",
                    delay: null,
                    prefix: "",
                    suffix: "",
                    start: 0,
                    startOnMount: true,
                    enableReinitialize: true,
                };

                var useCountUp = function useCountUp(props) {
                    var _useMemo = React.useMemo(
                            function () {
                                return _objectSpread2(
                                    _objectSpread2({}, DEFAULTS),
                                    props
                                );
                            },
                            [props]
                        ),
                        ref = _useMemo.ref,
                        startOnMount = _useMemo.startOnMount,
                        enableReinitialize = _useMemo.enableReinitialize,
                        delay = _useMemo.delay,
                        onEnd = _useMemo.onEnd,
                        onStart = _useMemo.onStart,
                        onPauseResume = _useMemo.onPauseResume,
                        onReset = _useMemo.onReset,
                        onUpdate = _useMemo.onUpdate,
                        instanceProps = _objectWithoutProperties(
                            _useMemo,
                            _excluded$1
                        );

                    var countUpRef = React.useRef();
                    var timerRef = React.useRef();
                    var isInitializedRef = React.useRef(false);
                    var createInstance = useEventCallback(function () {
                        return createCountUpInstance(
                            typeof ref === "string" ? ref : ref.current,
                            instanceProps
                        );
                    });
                    var getCountUp = useEventCallback(function (recreate) {
                        var countUp = countUpRef.current;

                        if (countUp && !recreate) {
                            return countUp;
                        }

                        var newCountUp = createInstance();
                        countUpRef.current = newCountUp;
                        return newCountUp;
                    });
                    var start = useEventCallback(function () {
                        var run = function run() {
                            return getCountUp(true).start(function () {
                                onEnd === null || onEnd === void 0
                                    ? void 0
                                    : onEnd({
                                          pauseResume: pauseResume,
                                          reset: reset,
                                          start: restart,
                                          update: update,
                                      });
                            });
                        };

                        if (delay && delay > 0) {
                            timerRef.current = setTimeout(run, delay * 1000);
                        } else {
                            run();
                        }

                        onStart === null || onStart === void 0
                            ? void 0
                            : onStart({
                                  pauseResume: pauseResume,
                                  reset: reset,
                                  update: update,
                              });
                    });
                    var pauseResume = useEventCallback(function () {
                        getCountUp().pauseResume();
                        onPauseResume === null || onPauseResume === void 0
                            ? void 0
                            : onPauseResume({
                                  reset: reset,
                                  start: restart,
                                  update: update,
                              });
                    });
                    var reset = useEventCallback(function () {
                        timerRef.current && clearTimeout(timerRef.current);
                        getCountUp().reset();
                        onReset === null || onReset === void 0
                            ? void 0
                            : onReset({
                                  pauseResume: pauseResume,
                                  start: restart,
                                  update: update,
                              });
                    });
                    var update = useEventCallback(function (newEnd) {
                        getCountUp().update(newEnd);
                        onUpdate === null || onUpdate === void 0
                            ? void 0
                            : onUpdate({
                                  pauseResume: pauseResume,
                                  reset: reset,
                                  start: restart,
                              });
                    });
                    var restart = useEventCallback(function () {
                        reset();
                        start();
                    });
                    var maybeInitialize = useEventCallback(function (
                        shouldReset
                    ) {
                        if (startOnMount) {
                            if (shouldReset) {
                                reset();
                            }

                            start();
                        }
                    });
                    React.useEffect(
                        function () {
                            if (!isInitializedRef.current) {
                                isInitializedRef.current = true;
                                maybeInitialize();
                            } else if (enableReinitialize) {
                                maybeInitialize(true);
                            }
                        },
                        [
                            enableReinitialize,
                            isInitializedRef,
                            maybeInitialize,
                            delay,
                            props.start,
                            props.suffix,
                            props.prefix,
                            props.duration,
                            props.separator,
                            props.decimals,
                            props.decimal,
                            props.formattingFn,
                        ]
                    );
                    React.useEffect(
                        function () {
                            return function () {
                                reset();
                            };
                        },
                        [reset]
                    );
                    return {
                        start: restart,
                        pauseResume: pauseResume,
                        reset: reset,
                        update: update,
                        getCountUp: getCountUp,
                    };
                };

                var _excluded = [
                    "className",
                    "redraw",
                    "containerProps",
                    "children",
                    "style",
                ];

                var CountUp = function CountUp(props) {
                    var className = props.className,
                        redraw = props.redraw,
                        containerProps = props.containerProps,
                        children = props.children,
                        style = props.style,
                        useCountUpProps = _objectWithoutProperties(
                            props,
                            _excluded
                        );

                    var containerRef = React__default["default"].useRef(null);
                    var isInitializedRef =
                        React__default["default"].useRef(false);

                    var _useCountUp = useCountUp(
                            _objectSpread2(
                                _objectSpread2({}, useCountUpProps),
                                {},
                                {
                                    ref: containerRef,
                                    startOnMount:
                                        typeof children !== "function" ||
                                        props.delay === 0,
                                    // component manually restarts
                                    enableReinitialize: false,
                                }
                            )
                        ),
                        start = _useCountUp.start,
                        reset = _useCountUp.reset,
                        updateCountUp = _useCountUp.update,
                        pauseResume = _useCountUp.pauseResume,
                        getCountUp = _useCountUp.getCountUp;

                    var restart = useEventCallback(function () {
                        start();
                    });
                    var update = useEventCallback(function (end) {
                        if (!props.preserveValue) {
                            reset();
                        }

                        updateCountUp(end);
                    });
                    var initializeOnMount = useEventCallback(function () {
                        if (typeof props.children === "function") {
                            // Warn when user didn't use containerRef at all
                            if (!(containerRef.current instanceof Element)) {
                                console.error(
                                    'Couldn\'t find attached element to hook the CountUp instance into! Try to attach "containerRef" from the render prop to a an Element, eg. <span ref={containerRef} />.'
                                );
                                return;
                            }
                        } // unlike the hook, the CountUp component initializes on mount

                        getCountUp();
                    });
                    React.useEffect(
                        function () {
                            initializeOnMount();
                        },
                        [initializeOnMount]
                    );
                    React.useEffect(
                        function () {
                            if (isInitializedRef.current) {
                                update(props.end);
                            }
                        },
                        [props.end, update]
                    );
                    var redrawDependencies = redraw && props; // if props.redraw, call this effect on every props change

                    React.useEffect(
                        function () {
                            if (redraw && isInitializedRef.current) {
                                restart();
                            }
                        },
                        [restart, redraw, redrawDependencies]
                    ); // if not props.redraw, call this effect only when certain props are changed

                    React.useEffect(
                        function () {
                            if (!redraw && isInitializedRef.current) {
                                restart();
                            }
                        },
                        [
                            restart,
                            redraw,
                            props.start,
                            props.suffix,
                            props.prefix,
                            props.duration,
                            props.separator,
                            props.decimals,
                            props.decimal,
                            props.className,
                            props.formattingFn,
                        ]
                    );
                    React.useEffect(function () {
                        isInitializedRef.current = true;
                    }, []);

                    if (typeof children === "function") {
                        // TypeScript forces functional components to return JSX.Element | null.
                        return children({
                            countUpRef: containerRef,
                            start: start,
                            reset: reset,
                            update: updateCountUp,
                            pauseResume: pauseResume,
                            getCountUp: getCountUp,
                        });
                    }

                    return /*#__PURE__*/ React__default[
                        "default"
                    ].createElement(
                        "span",
                        _extends(
                            {
                                className: className,
                                ref: containerRef,
                                style: style,
                            },
                            containerProps
                        )
                    );
                };

                exports.ZP = CountUp;
                __webpack_unused_export__ = useCountUp;

                /***/
            },
    },
]);
