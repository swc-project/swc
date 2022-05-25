(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [214],
    {
        /***/ 5158: /***/ function (module) {
            // Adapted from https://github.com/Flet/prettier-bytes/
            // Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
            // ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
            module.exports = function prettierBytes(num) {
                if (typeof num !== "number" || isNaN(num)) {
                    throw new TypeError("Expected a number, got " + typeof num);
                }

                var neg = num < 0;
                var units = [
                    "B",
                    "KB",
                    "MB",
                    "GB",
                    "TB",
                    "PB",
                    "EB",
                    "ZB",
                    "YB",
                ];

                if (neg) {
                    num = -num;
                }

                if (num < 1) {
                    return (neg ? "-" : "") + num + " B";
                }

                var exponent = Math.min(
                    Math.floor(Math.log(num) / Math.log(1024)),
                    units.length - 1
                );
                num = Number(num / Math.pow(1024, exponent));
                var unit = units[exponent];

                if (num >= 10 || num % 1 === 0) {
                    // Do not show decimals when the number is two-digit, or if the number has no
                    // decimal component.
                    return (neg ? "-" : "") + num.toFixed(0) + " " + unit;
                } else {
                    return (neg ? "-" : "") + num.toFixed(1) + " " + unit;
                }
            };

            /***/
        },

        /***/ 8937: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            /**
             * Core plugin logic that all plugins share.
             *
             * BasePlugin does not contain DOM rendering so it can be used for plugins
             * without a user interface.
             *
             * See `Plugin` for the extended version with Preact rendering for interfaces.
             */
            const Translator = __webpack_require__(3363);

            module.exports = class BasePlugin {
                constructor(uppy, opts) {
                    if (opts === void 0) {
                        opts = {};
                    }

                    this.uppy = uppy;
                    this.opts = opts;
                }

                getPluginState() {
                    const { plugins } = this.uppy.getState();
                    return plugins[this.id] || {};
                }

                setPluginState(update) {
                    const { plugins } = this.uppy.getState();
                    this.uppy.setState({
                        plugins: {
                            ...plugins,
                            [this.id]: { ...plugins[this.id], ...update },
                        },
                    });
                }

                setOptions(newOpts) {
                    this.opts = { ...this.opts, ...newOpts };
                    this.setPluginState(); // so that UI re-renders with new options

                    this.i18nInit();
                }

                i18nInit() {
                    const translator = new Translator([
                        this.defaultLocale,
                        this.uppy.locale,
                        this.opts.locale,
                    ]);
                    this.i18n = translator.translate.bind(translator);
                    this.i18nArray = translator.translateArray.bind(translator);
                    this.setPluginState(); // so that UI re-renders and we see the updated locale
                }
                /**
                 * Extendable methods
                 * ==================
                 * These methods are here to serve as an overview of the extendable methods as well as
                 * making them not conditional in use, such as `if (this.afterUpdate)`.
                 */
                // eslint-disable-next-line class-methods-use-this

                addTarget() {
                    throw new Error(
                        "Extend the addTarget method to add your plugin to another plugin's target"
                    );
                } // eslint-disable-next-line class-methods-use-this

                install() {} // eslint-disable-next-line class-methods-use-this

                uninstall() {}
                /**
                 * Called when plugin is mounted, whether in DOM or into another plugin.
                 * Needed because sometimes plugins are mounted separately/after `install`,
                 * so this.el and this.parent might not be available in `install`.
                 * This is the case with @uppy/react plugins, for example.
                 */

                render() {
                    throw new Error(
                        "Extend the render method to add your plugin to a DOM element"
                    );
                } // TODO: remove in the next major version. It's not feasible to
                // try to use plugins with other frameworks.
                // eslint-disable-next-line class-methods-use-this

                update() {} // Called after every state update, after everything's mounted. Debounced.
                // eslint-disable-next-line class-methods-use-this

                afterUpdate() {}
            };

            /***/
        },

        /***/ 3000: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            /* eslint-disable max-classes-per-file, class-methods-use-this */

            /* global AggregateError */
            const prettierBytes = __webpack_require__(5158);

            const match = __webpack_require__(4193);

            const defaultOptions = {
                maxFileSize: null,
                minFileSize: null,
                maxTotalFileSize: null,
                maxNumberOfFiles: null,
                minNumberOfFiles: null,
                allowedFileTypes: null,
                requiredMetaFields: [],
            };

            class RestrictionError extends Error {
                constructor() {
                    super(...arguments);
                    this.isRestriction = true;
                }
            }

            if (typeof AggregateError === "undefined") {
                // eslint-disable-next-line no-global-assign
                // TODO: remove this "polyfill" in the next major.
                globalThis.AggregateError = class AggregateError extends Error {
                    constructor(errors, message) {
                        super(message);
                        this.errors = errors;
                    }
                };
            }

            class Restricter {
                constructor(getOpts, i18n) {
                    this.i18n = i18n;

                    this.getOpts = () => {
                        const opts = getOpts();

                        if (
                            opts.restrictions.allowedFileTypes != null &&
                            !Array.isArray(opts.restrictions.allowedFileTypes)
                        ) {
                            throw new TypeError(
                                "`restrictions.allowedFileTypes` must be an array"
                            );
                        }

                        return opts;
                    };
                }

                validate(file, files) {
                    const {
                        maxFileSize,
                        minFileSize,
                        maxTotalFileSize,
                        maxNumberOfFiles,
                        allowedFileTypes,
                    } = this.getOpts().restrictions;

                    if (
                        maxNumberOfFiles &&
                        files.length + 1 > maxNumberOfFiles
                    ) {
                        throw new RestrictionError(
                            `${this.i18n("youCanOnlyUploadX", {
                                smart_count: maxNumberOfFiles,
                            })}`
                        );
                    }

                    if (allowedFileTypes) {
                        const isCorrectFileType = allowedFileTypes.some(
                            (type) => {
                                // check if this is a mime-type
                                if (type.includes("/")) {
                                    if (!file.type) return false;
                                    return match(
                                        file.type.replace(/;.*?$/, ""),
                                        type
                                    );
                                } // otherwise this is likely an extension

                                if (type[0] === "." && file.extension) {
                                    return (
                                        file.extension.toLowerCase() ===
                                        type.slice(1).toLowerCase()
                                    );
                                }

                                return false;
                            }
                        );

                        if (!isCorrectFileType) {
                            const allowedFileTypesString =
                                allowedFileTypes.join(", ");
                            throw new RestrictionError(
                                this.i18n("youCanOnlyUploadFileTypes", {
                                    types: allowedFileTypesString,
                                })
                            );
                        }
                    } // We can't check maxTotalFileSize if the size is unknown.

                    if (maxTotalFileSize && file.size != null) {
                        const totalFilesSize = files.reduce(
                            (total, f) => total + f.size,
                            file.size
                        );

                        if (totalFilesSize > maxTotalFileSize) {
                            throw new RestrictionError(
                                this.i18n("exceedsSize", {
                                    size: prettierBytes(maxTotalFileSize),
                                    file: file.name,
                                })
                            );
                        }
                    } // We can't check maxFileSize if the size is unknown.

                    if (
                        maxFileSize &&
                        file.size != null &&
                        file.size > maxFileSize
                    ) {
                        throw new RestrictionError(
                            this.i18n("exceedsSize", {
                                size: prettierBytes(maxFileSize),
                                file: file.name,
                            })
                        );
                    } // We can't check minFileSize if the size is unknown.

                    if (
                        minFileSize &&
                        file.size != null &&
                        file.size < minFileSize
                    ) {
                        throw new RestrictionError(
                            this.i18n("inferiorSize", {
                                size: prettierBytes(minFileSize),
                            })
                        );
                    }
                }

                validateMinNumberOfFiles(files) {
                    const { minNumberOfFiles } = this.getOpts().restrictions;

                    if (Object.keys(files).length < minNumberOfFiles) {
                        throw new RestrictionError(
                            this.i18n("youHaveToAtLeastSelectX", {
                                smart_count: minNumberOfFiles,
                            })
                        );
                    }
                }

                getMissingRequiredMetaFields(file) {
                    const error = new RestrictionError(
                        this.i18n("missingRequiredMetaFieldOnFile", {
                            fileName: file.name,
                        })
                    );
                    const { requiredMetaFields } = this.getOpts().restrictions; // TODO: migrate to Object.hasOwn in the next major.

                    const own = Object.prototype.hasOwnProperty;
                    const missingFields = [];

                    for (const field of requiredMetaFields) {
                        if (
                            !own.call(file.meta, field) ||
                            file.meta[field] === ""
                        ) {
                            missingFields.push(field);
                        }
                    }

                    return {
                        missingFields,
                        error,
                    };
                }
            }

            module.exports = {
                Restricter,
                defaultOptions,
                RestrictionError,
            };

            /***/
        },

        /***/ 4649: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            function _classPrivateFieldLooseBase(receiver, privateKey) {
                if (
                    !Object.prototype.hasOwnProperty.call(receiver, privateKey)
                ) {
                    throw new TypeError(
                        "attempted to use private field on non-instance"
                    );
                }
                return receiver;
            }

            var id = 0;

            function _classPrivateFieldLooseKey(name) {
                return "__private_" + id++ + "_" + name;
            }

            const { render } = __webpack_require__(6400);

            const findDOMElement = __webpack_require__(2729);

            const getTextDirection = __webpack_require__(8958);

            const BasePlugin = __webpack_require__(8937);
            /**
             * Defer a frequent call to the microtask queue.
             *
             * @param {() => T} fn
             * @returns {Promise<T>}
             */

            function debounce(fn) {
                let calling = null;
                let latestArgs = null;
                return function () {
                    for (
                        var _len = arguments.length,
                            args = new Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    ) {
                        args[_key] = arguments[_key];
                    }

                    latestArgs = args;

                    if (!calling) {
                        calling = Promise.resolve().then(() => {
                            calling = null; // At this point `args` may be different from the most
                            // recent state, if multiple calls happened since this task
                            // was queued. So we use the `latestArgs`, which definitely
                            // is the most recent call.

                            return fn(...latestArgs);
                        });
                    }

                    return calling;
                };
            }
            /**
             * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
             * Use this for plugins that need a user interface.
             *
             * For plugins without an user interface, see BasePlugin.
             */

            var _updateUI =
                /*#__PURE__*/ _classPrivateFieldLooseKey("updateUI");

            class UIPlugin extends BasePlugin {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, _updateUI, {
                        writable: true,
                        value: void 0,
                    });
                }

                /**
                 * Check if supplied `target` is a DOM element or an `object`.
                 * If it’s an object — target is a plugin, and we search `plugins`
                 * for a plugin with same name and return its target.
                 */
                mount(target, plugin) {
                    const callerPluginName = plugin.id;
                    const targetElement = findDOMElement(target);

                    if (targetElement) {
                        this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
                        // Preact thinks it’s the Uppy root element in there when doing a diff,
                        // and destroys it. So we are creating a fragment (could be empty div)

                        const uppyRootElement = document.createElement("div");
                        uppyRootElement.classList.add("uppy-Root"); // API for plugins that require a synchronous rerender.

                        _classPrivateFieldLooseBase(this, _updateUI)[
                            _updateUI
                        ] = debounce((state) => {
                            // plugin could be removed, but this.rerender is debounced below,
                            // so it could still be called even after uppy.removePlugin or uppy.close
                            // hence the check
                            if (!this.uppy.getPlugin(this.id)) return;
                            render(this.render(state), uppyRootElement);
                            this.afterUpdate();
                        });
                        this.uppy.log(
                            `Installing ${callerPluginName} to a DOM element '${target}'`
                        );

                        if (this.opts.replaceTargetContent) {
                            // Doing render(h(null), targetElement), which should have been
                            // a better way, since because the component might need to do additional cleanup when it is removed,
                            // stopped working — Preact just adds null into target, not replacing
                            targetElement.innerHTML = "";
                        }

                        render(
                            this.render(this.uppy.getState()),
                            uppyRootElement
                        );
                        this.el = uppyRootElement;
                        targetElement.appendChild(uppyRootElement); // Set the text direction if the page has not defined one.

                        uppyRootElement.dir =
                            this.opts.direction ||
                            getTextDirection(uppyRootElement) ||
                            "ltr";
                        this.onMount();
                        return this.el;
                    }

                    let targetPlugin;

                    if (
                        typeof target === "object" &&
                        target instanceof UIPlugin
                    ) {
                        // Targeting a plugin *instance*
                        targetPlugin = target;
                    } else if (typeof target === "function") {
                        // Targeting a plugin type
                        const Target = target; // Find the target plugin instance.

                        this.uppy.iteratePlugins((p) => {
                            if (p instanceof Target) {
                                targetPlugin = p;
                                return false;
                            }
                        });
                    }

                    if (targetPlugin) {
                        this.uppy.log(
                            `Installing ${callerPluginName} to ${targetPlugin.id}`
                        );
                        this.parent = targetPlugin;
                        this.el = targetPlugin.addTarget(plugin);
                        this.onMount();
                        return this.el;
                    }

                    this.uppy.log(`Not installing ${callerPluginName}`);
                    let message = `Invalid target option given to ${callerPluginName}.`;

                    if (typeof target === "function") {
                        message +=
                            " The given target is not a Plugin class. " +
                            "Please check that you're not specifying a React Component instead of a plugin. " +
                            "If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: " +
                            "run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.";
                    } else {
                        message +=
                            "If you meant to target an HTML element, please make sure that the element exists. " +
                            "Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. " +
                            "(see https://github.com/transloadit/uppy/issues/1042)\n\n" +
                            "If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.";
                    }

                    throw new Error(message);
                }

                update(state) {
                    if (this.el != null) {
                        var _classPrivateFieldLoo, _classPrivateFieldLoo2;

                        (_classPrivateFieldLoo = (_classPrivateFieldLoo2 =
                            _classPrivateFieldLooseBase(this, _updateUI))[
                            _updateUI
                        ]) == null
                            ? void 0
                            : _classPrivateFieldLoo.call(
                                  _classPrivateFieldLoo2,
                                  state
                              );
                    }
                }

                unmount() {
                    if (this.isTargetDOMEl) {
                        var _this$el;

                        (_this$el = this.el) == null
                            ? void 0
                            : _this$el.remove();
                    }

                    this.onUnmount();
                } // eslint-disable-next-line class-methods-use-this

                onMount() {} // eslint-disable-next-line class-methods-use-this

                onUnmount() {}
            }

            module.exports = UIPlugin;

            /***/
        },

        /***/ 1790: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";
            /* eslint-disable max-classes-per-file */

            /* global AggregateError */

            let _Symbol$for, _Symbol$for2;

            function _classPrivateFieldLooseBase(receiver, privateKey) {
                if (
                    !Object.prototype.hasOwnProperty.call(receiver, privateKey)
                ) {
                    throw new TypeError(
                        "attempted to use private field on non-instance"
                    );
                }
                return receiver;
            }

            var id = 0;

            function _classPrivateFieldLooseKey(name) {
                return "__private_" + id++ + "_" + name;
            }

            const Translator = __webpack_require__(3363);

            const ee = __webpack_require__(4800);

            const { nanoid } = __webpack_require__(2961);

            const throttle = __webpack_require__(3096);

            const DefaultStore = __webpack_require__(6273);

            const getFileType = __webpack_require__(9404);

            const getFileNameAndExtension = __webpack_require__(8744);

            const generateFileID = __webpack_require__(8619);

            const supportsUploadProgress = __webpack_require__(8585);

            const getFileName = __webpack_require__(2008);

            const { justErrorsLogger, debugLogger } = __webpack_require__(4519);

            const {
                Restricter,
                defaultOptions: defaultRestrictionOptions,
                RestrictionError,
            } = __webpack_require__(3000);

            const locale = __webpack_require__(8998); // Exported from here.

            /**
             * Uppy Core module.
             * Manages plugins, state updates, acts as an event bus,
             * adds/removes files and metadata.
             */

            var _plugins = /*#__PURE__*/ _classPrivateFieldLooseKey("plugins");

            var _restricter =
                /*#__PURE__*/ _classPrivateFieldLooseKey("restricter");

            var _storeUnsubscribe =
                /*#__PURE__*/ _classPrivateFieldLooseKey("storeUnsubscribe");

            var _emitter = /*#__PURE__*/ _classPrivateFieldLooseKey("emitter");

            var _preProcessors =
                /*#__PURE__*/ _classPrivateFieldLooseKey("preProcessors");

            var _uploaders =
                /*#__PURE__*/ _classPrivateFieldLooseKey("uploaders");

            var _postProcessors =
                /*#__PURE__*/ _classPrivateFieldLooseKey("postProcessors");

            var _informAndEmit =
                /*#__PURE__*/ _classPrivateFieldLooseKey("informAndEmit");

            var _checkRequiredMetaFieldsOnFile =
                /*#__PURE__*/ _classPrivateFieldLooseKey(
                    "checkRequiredMetaFieldsOnFile"
                );

            var _checkRequiredMetaFields =
                /*#__PURE__*/ _classPrivateFieldLooseKey(
                    "checkRequiredMetaFields"
                );

            var _assertNewUploadAllowed =
                /*#__PURE__*/ _classPrivateFieldLooseKey(
                    "assertNewUploadAllowed"
                );

            var _checkAndCreateFileStateObject =
                /*#__PURE__*/ _classPrivateFieldLooseKey(
                    "checkAndCreateFileStateObject"
                );

            var _startIfAutoProceed =
                /*#__PURE__*/ _classPrivateFieldLooseKey("startIfAutoProceed");

            var _addListeners =
                /*#__PURE__*/ _classPrivateFieldLooseKey("addListeners");

            var _updateOnlineStatus =
                /*#__PURE__*/ _classPrivateFieldLooseKey("updateOnlineStatus");

            var _createUpload =
                /*#__PURE__*/ _classPrivateFieldLooseKey("createUpload");

            var _getUpload =
                /*#__PURE__*/ _classPrivateFieldLooseKey("getUpload");

            var _removeUpload =
                /*#__PURE__*/ _classPrivateFieldLooseKey("removeUpload");

            var _runUpload =
                /*#__PURE__*/ _classPrivateFieldLooseKey("runUpload");

            _Symbol$for = Symbol.for("uppy test: getPlugins");
            _Symbol$for2 = Symbol.for("uppy test: createUpload");

            class Uppy {
                // eslint-disable-next-line global-require

                /** @type {Record<string, BasePlugin[]>} */

                /**
                 * Instantiate Uppy
                 *
                 * @param {object} opts — Uppy options
                 */
                constructor(_opts) {
                    Object.defineProperty(this, _runUpload, {
                        value: _runUpload2,
                    });
                    Object.defineProperty(this, _removeUpload, {
                        value: _removeUpload2,
                    });
                    Object.defineProperty(this, _getUpload, {
                        value: _getUpload2,
                    });
                    Object.defineProperty(this, _createUpload, {
                        value: _createUpload2,
                    });
                    Object.defineProperty(this, _addListeners, {
                        value: _addListeners2,
                    });
                    Object.defineProperty(this, _startIfAutoProceed, {
                        value: _startIfAutoProceed2,
                    });
                    Object.defineProperty(
                        this,
                        _checkAndCreateFileStateObject,
                        {
                            value: _checkAndCreateFileStateObject2,
                        }
                    );
                    Object.defineProperty(this, _assertNewUploadAllowed, {
                        value: _assertNewUploadAllowed2,
                    });
                    Object.defineProperty(this, _checkRequiredMetaFields, {
                        value: _checkRequiredMetaFields2,
                    });
                    Object.defineProperty(
                        this,
                        _checkRequiredMetaFieldsOnFile,
                        {
                            value: _checkRequiredMetaFieldsOnFile2,
                        }
                    );
                    Object.defineProperty(this, _informAndEmit, {
                        value: _informAndEmit2,
                    });
                    Object.defineProperty(this, _plugins, {
                        writable: true,
                        value: Object.create(null),
                    });
                    Object.defineProperty(this, _restricter, {
                        writable: true,
                        value: void 0,
                    });
                    Object.defineProperty(this, _storeUnsubscribe, {
                        writable: true,
                        value: void 0,
                    });
                    Object.defineProperty(this, _emitter, {
                        writable: true,
                        value: ee(),
                    });
                    Object.defineProperty(this, _preProcessors, {
                        writable: true,
                        value: new Set(),
                    });
                    Object.defineProperty(this, _uploaders, {
                        writable: true,
                        value: new Set(),
                    });
                    Object.defineProperty(this, _postProcessors, {
                        writable: true,
                        value: new Set(),
                    });
                    Object.defineProperty(this, _updateOnlineStatus, {
                        writable: true,
                        value: this.updateOnlineStatus.bind(this),
                    });
                    this.defaultLocale = locale;
                    const defaultOptions = {
                        id: "uppy",
                        autoProceed: false,

                        /**
                         * @deprecated The method should not be used
                         */
                        allowMultipleUploads: true,
                        allowMultipleUploadBatches: true,
                        debug: false,
                        restrictions: defaultRestrictionOptions,
                        meta: {},
                        onBeforeFileAdded: (currentFile) => currentFile,
                        onBeforeUpload: (files) => files,
                        store: DefaultStore(),
                        logger: justErrorsLogger,
                        infoTimeout: 5000,
                    }; // Merge default options with the ones set by user,
                    // making sure to merge restrictions too

                    this.opts = {
                        ...defaultOptions,
                        ..._opts,
                        restrictions: {
                            ...defaultOptions.restrictions,
                            ...(_opts && _opts.restrictions),
                        },
                    }; // Support debug: true for backwards-compatability, unless logger is set in opts
                    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

                    if (_opts && _opts.logger && _opts.debug) {
                        this.log(
                            "You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.",
                            "warning"
                        );
                    } else if (_opts && _opts.debug) {
                        this.opts.logger = debugLogger;
                    }

                    this.log(`Using Core v${this.constructor.VERSION}`);
                    this.i18nInit(); // ___Why throttle at 500ms?
                    //    - We must throttle at >250ms for superfocus in Dashboard to work well
                    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
                    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
                    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
                    //    - We must throttle at around >500ms to avoid performance lags.
                    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

                    this.calculateProgress = throttle(
                        this.calculateProgress.bind(this),
                        500,
                        {
                            leading: true,
                            trailing: true,
                        }
                    );
                    this.store = this.opts.store;
                    this.setState({
                        plugins: {},
                        files: {},
                        currentUploads: {},
                        allowNewUpload: true,
                        capabilities: {
                            uploadProgress: supportsUploadProgress(),
                            individualCancellation: true,
                            resumableUploads: false,
                        },
                        totalProgress: 0,
                        meta: { ...this.opts.meta },
                        info: [],
                        recoveredState: null,
                    });
                    _classPrivateFieldLooseBase(this, _restricter)[
                        _restricter
                    ] = new Restricter(() => this.opts, this.i18n);
                    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[
                        _storeUnsubscribe
                    ] = this.store.subscribe((prevState, nextState, patch) => {
                        this.emit("state-update", prevState, nextState, patch);
                        this.updateAll(nextState);
                    }); // Exposing uppy object on window for debugging and testing

                    if (this.opts.debug && typeof window !== "undefined") {
                        window[this.opts.id] = this;
                    }

                    _classPrivateFieldLooseBase(this, _addListeners)[
                        _addListeners
                    ]();
                }

                emit(event) {
                    for (
                        var _len = arguments.length,
                            args = new Array(_len > 1 ? _len - 1 : 0),
                            _key = 1;
                        _key < _len;
                        _key++
                    ) {
                        args[_key - 1] = arguments[_key];
                    }

                    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(
                        event,
                        ...args
                    );
                }

                on(event, callback) {
                    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(
                        event,
                        callback
                    );

                    return this;
                }

                once(event, callback) {
                    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(
                        event,
                        callback
                    );

                    return this;
                }

                off(event, callback) {
                    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(
                        event,
                        callback
                    );

                    return this;
                }
                /**
                 * Iterate on all plugins and run `update` on them.
                 * Called each time state changes.
                 *
                 */

                updateAll(state) {
                    this.iteratePlugins((plugin) => {
                        plugin.update(state);
                    });
                }
                /**
                 * Updates state with a patch
                 *
                 * @param {object} patch {foo: 'bar'}
                 */

                setState(patch) {
                    this.store.setState(patch);
                }
                /**
                 * Returns current state.
                 *
                 * @returns {object}
                 */

                getState() {
                    return this.store.getState();
                }
                /**
                 * Back compat for when uppy.state is used instead of uppy.getState().
                 *
                 * @deprecated
                 */

                get state() {
                    // Here, state is a non-enumerable property.
                    return this.getState();
                }
                /**
                 * Shorthand to set state for a specific file.
                 */

                setFileState(fileID, state) {
                    if (!this.getState().files[fileID]) {
                        throw new Error(
                            `Can’t set state for ${fileID} (the file could have been removed)`
                        );
                    }

                    this.setState({
                        files: {
                            ...this.getState().files,
                            [fileID]: {
                                ...this.getState().files[fileID],
                                ...state,
                            },
                        },
                    });
                }

                i18nInit() {
                    const translator = new Translator([
                        this.defaultLocale,
                        this.opts.locale,
                    ]);
                    this.i18n = translator.translate.bind(translator);
                    this.i18nArray = translator.translateArray.bind(translator);
                    this.locale = translator.locale;
                }

                setOptions(newOpts) {
                    this.opts = {
                        ...this.opts,
                        ...newOpts,
                        restrictions: {
                            ...this.opts.restrictions,
                            ...(newOpts && newOpts.restrictions),
                        },
                    };

                    if (newOpts.meta) {
                        this.setMeta(newOpts.meta);
                    }

                    this.i18nInit();

                    if (newOpts.locale) {
                        this.iteratePlugins((plugin) => {
                            plugin.setOptions();
                        });
                    } // Note: this is not the preact `setState`, it's an internal function that has the same name.

                    this.setState(); // so that UI re-renders with new options
                }

                resetProgress() {
                    const defaultProgress = {
                        percentage: 0,
                        bytesUploaded: 0,
                        uploadComplete: false,
                        uploadStarted: null,
                    };
                    const files = { ...this.getState().files };
                    const updatedFiles = {};
                    Object.keys(files).forEach((fileID) => {
                        const updatedFile = { ...files[fileID] };
                        updatedFile.progress = {
                            ...updatedFile.progress,
                            ...defaultProgress,
                        };
                        updatedFiles[fileID] = updatedFile;
                    });
                    this.setState({
                        files: updatedFiles,
                        totalProgress: 0,
                    });
                    this.emit("reset-progress");
                }

                addPreProcessor(fn) {
                    _classPrivateFieldLooseBase(this, _preProcessors)[
                        _preProcessors
                    ].add(fn);
                }

                removePreProcessor(fn) {
                    return _classPrivateFieldLooseBase(this, _preProcessors)[
                        _preProcessors
                    ].delete(fn);
                }

                addPostProcessor(fn) {
                    _classPrivateFieldLooseBase(this, _postProcessors)[
                        _postProcessors
                    ].add(fn);
                }

                removePostProcessor(fn) {
                    return _classPrivateFieldLooseBase(this, _postProcessors)[
                        _postProcessors
                    ].delete(fn);
                }

                addUploader(fn) {
                    _classPrivateFieldLooseBase(this, _uploaders)[
                        _uploaders
                    ].add(fn);
                }

                removeUploader(fn) {
                    return _classPrivateFieldLooseBase(this, _uploaders)[
                        _uploaders
                    ].delete(fn);
                }

                setMeta(data) {
                    const updatedMeta = { ...this.getState().meta, ...data };
                    const updatedFiles = { ...this.getState().files };
                    Object.keys(updatedFiles).forEach((fileID) => {
                        updatedFiles[fileID] = {
                            ...updatedFiles[fileID],
                            meta: { ...updatedFiles[fileID].meta, ...data },
                        };
                    });
                    this.log("Adding metadata:");
                    this.log(data);
                    this.setState({
                        meta: updatedMeta,
                        files: updatedFiles,
                    });
                }

                setFileMeta(fileID, data) {
                    const updatedFiles = { ...this.getState().files };

                    if (!updatedFiles[fileID]) {
                        this.log(
                            "Was trying to set metadata for a file that has been removed: ",
                            fileID
                        );
                        return;
                    }

                    const newMeta = { ...updatedFiles[fileID].meta, ...data };
                    updatedFiles[fileID] = {
                        ...updatedFiles[fileID],
                        meta: newMeta,
                    };
                    this.setState({
                        files: updatedFiles,
                    });
                }
                /**
                 * Get a file object.
                 *
                 * @param {string} fileID The ID of the file object to return.
                 */

                getFile(fileID) {
                    return this.getState().files[fileID];
                }
                /**
                 * Get all files in an array.
                 */

                getFiles() {
                    const { files } = this.getState();
                    return Object.values(files);
                }

                getObjectOfFilesPerState() {
                    const {
                        files: filesObject,
                        totalProgress,
                        error,
                    } = this.getState();
                    const files = Object.values(filesObject);
                    const inProgressFiles = files.filter((_ref) => {
                        let { progress } = _ref;
                        return (
                            !progress.uploadComplete && progress.uploadStarted
                        );
                    });
                    const newFiles = files.filter(
                        (file) => !file.progress.uploadStarted
                    );
                    const startedFiles = files.filter(
                        (file) =>
                            file.progress.uploadStarted ||
                            file.progress.preprocess ||
                            file.progress.postprocess
                    );
                    const uploadStartedFiles = files.filter(
                        (file) => file.progress.uploadStarted
                    );
                    const pausedFiles = files.filter((file) => file.isPaused);
                    const completeFiles = files.filter(
                        (file) => file.progress.uploadComplete
                    );
                    const erroredFiles = files.filter((file) => file.error);
                    const inProgressNotPausedFiles = inProgressFiles.filter(
                        (file) => !file.isPaused
                    );
                    const processingFiles = files.filter(
                        (file) =>
                            file.progress.preprocess ||
                            file.progress.postprocess
                    );
                    return {
                        newFiles,
                        startedFiles,
                        uploadStartedFiles,
                        pausedFiles,
                        completeFiles,
                        erroredFiles,
                        inProgressFiles,
                        inProgressNotPausedFiles,
                        processingFiles,
                        isUploadStarted: uploadStartedFiles.length > 0,
                        isAllComplete:
                            totalProgress === 100 &&
                            completeFiles.length === files.length &&
                            processingFiles.length === 0,
                        isAllErrored:
                            !!error && erroredFiles.length === files.length,
                        isAllPaused:
                            inProgressFiles.length !== 0 &&
                            pausedFiles.length === inProgressFiles.length,
                        isUploadInProgress: inProgressFiles.length > 0,
                        isSomeGhost: files.some((file) => file.isGhost),
                    };
                }
                /*
                 * @constructs
                 * @param { Error } error
                 * @param { undefined } file
                 */

                /*
                 * @constructs
                 * @param { RestrictionError } error
                 * @param { UppyFile | undefined } file
                 */

                validateRestrictions(file, files) {
                    if (files === void 0) {
                        files = this.getFiles();
                    }

                    // TODO: directly return the Restriction error in next major version.
                    // we create RestrictionError's just to discard immediately, which doesn't make sense.
                    try {
                        _classPrivateFieldLooseBase(this, _restricter)[
                            _restricter
                        ].validate(file, files);

                        return {
                            result: true,
                        };
                    } catch (err) {
                        return {
                            result: false,
                            reason: err.message,
                        };
                    }
                }

                checkIfFileAlreadyExists(fileID) {
                    const { files } = this.getState();

                    if (files[fileID] && !files[fileID].isGhost) {
                        return true;
                    }

                    return false;
                }
                /**
                 * Create a file state object based on user-provided `addFile()` options.
                 *
                 * Note this is extremely side-effectful and should only be done when a file state object
                 * will be added to state immediately afterward!
                 *
                 * The `files` value is passed in because it may be updated by the caller without updating the store.
                 */

                /**
                 * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
                 * try to guess file type in a clever way, check file against restrictions,
                 * and start an upload if `autoProceed === true`.
                 *
                 * @param {object} file object to add
                 * @returns {string} id for the added file
                 */
                addFile(file) {
                    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[
                        _assertNewUploadAllowed
                    ](file);

                    const { files } = this.getState();

                    let newFile = _classPrivateFieldLooseBase(
                        this,
                        _checkAndCreateFileStateObject
                    )[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
                    // and to keep the progress, meta and everthing else, we only replace said data

                    if (files[newFile.id] && files[newFile.id].isGhost) {
                        newFile = {
                            ...files[newFile.id],
                            data: file.data,
                            isGhost: false,
                        };
                        this.log(
                            `Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`
                        );
                    }

                    this.setState({
                        files: { ...files, [newFile.id]: newFile },
                    });
                    this.emit("file-added", newFile);
                    this.emit("files-added", [newFile]);
                    this.log(
                        `Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`
                    );

                    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[
                        _startIfAutoProceed
                    ]();

                    return newFile.id;
                }
                /**
                 * Add multiple files to `state.files`. See the `addFile()` documentation.
                 *
                 * If an error occurs while adding a file, it is logged and the user is notified.
                 * This is good for UI plugins, but not for programmatic use.
                 * Programmatic users should usually still use `addFile()` on individual files.
                 */

                addFiles(fileDescriptors) {
                    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[
                        _assertNewUploadAllowed
                    ](); // create a copy of the files object only once

                    const files = { ...this.getState().files };
                    const newFiles = [];
                    const errors = [];

                    for (let i = 0; i < fileDescriptors.length; i++) {
                        try {
                            let newFile = _classPrivateFieldLooseBase(
                                this,
                                _checkAndCreateFileStateObject
                            )[_checkAndCreateFileStateObject](
                                files,
                                fileDescriptors[i]
                            ); // Users are asked to re-select recovered files without data,
                            // and to keep the progress, meta and everthing else, we only replace said data

                            if (
                                files[newFile.id] &&
                                files[newFile.id].isGhost
                            ) {
                                newFile = {
                                    ...files[newFile.id],
                                    data: fileDescriptors[i].data,
                                    isGhost: false,
                                };
                                this.log(
                                    `Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`
                                );
                            }

                            files[newFile.id] = newFile;
                            newFiles.push(newFile);
                        } catch (err) {
                            if (!err.isRestriction) {
                                errors.push(err);
                            }
                        }
                    }

                    this.setState({
                        files,
                    });
                    newFiles.forEach((newFile) => {
                        this.emit("file-added", newFile);
                    });
                    this.emit("files-added", newFiles);

                    if (newFiles.length > 5) {
                        this.log(`Added batch of ${newFiles.length} files`);
                    } else {
                        Object.keys(newFiles).forEach((fileID) => {
                            this.log(
                                `Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`
                            );
                        });
                    }

                    if (newFiles.length > 0) {
                        _classPrivateFieldLooseBase(this, _startIfAutoProceed)[
                            _startIfAutoProceed
                        ]();
                    }

                    if (errors.length > 0) {
                        let message =
                            "Multiple errors occurred while adding files:\n";
                        errors.forEach((subError) => {
                            message += `\n * ${subError.message}`;
                        });
                        this.info(
                            {
                                message: this.i18n("addBulkFilesFailed", {
                                    smart_count: errors.length,
                                }),
                                details: message,
                            },
                            "error",
                            this.opts.infoTimeout
                        );

                        if (typeof AggregateError === "function") {
                            throw new AggregateError(errors, message);
                        } else {
                            const err = new Error(message);
                            err.errors = errors;
                            throw err;
                        }
                    }
                }

                removeFiles(fileIDs, reason) {
                    const { files, currentUploads } = this.getState();
                    const updatedFiles = { ...files };
                    const updatedUploads = { ...currentUploads };
                    const removedFiles = Object.create(null);
                    fileIDs.forEach((fileID) => {
                        if (files[fileID]) {
                            removedFiles[fileID] = files[fileID];
                            delete updatedFiles[fileID];
                        }
                    }); // Remove files from the `fileIDs` list in each upload.

                    function fileIsNotRemoved(uploadFileID) {
                        return removedFiles[uploadFileID] === undefined;
                    }

                    Object.keys(updatedUploads).forEach((uploadID) => {
                        const newFileIDs =
                            currentUploads[uploadID].fileIDs.filter(
                                fileIsNotRemoved
                            ); // Remove the upload if no files are associated with it anymore.

                        if (newFileIDs.length === 0) {
                            delete updatedUploads[uploadID];
                            return;
                        }

                        updatedUploads[uploadID] = {
                            ...currentUploads[uploadID],
                            fileIDs: newFileIDs,
                        };
                    });
                    const stateUpdate = {
                        currentUploads: updatedUploads,
                        files: updatedFiles,
                    }; // If all files were removed - allow new uploads,
                    // and clear recoveredState

                    if (Object.keys(updatedFiles).length === 0) {
                        stateUpdate.allowNewUpload = true;
                        stateUpdate.error = null;
                        stateUpdate.recoveredState = null;
                    }

                    this.setState(stateUpdate);
                    this.calculateTotalProgress();
                    const removedFileIDs = Object.keys(removedFiles);
                    removedFileIDs.forEach((fileID) => {
                        this.emit("file-removed", removedFiles[fileID], reason);
                    });

                    if (removedFileIDs.length > 5) {
                        this.log(`Removed ${removedFileIDs.length} files`);
                    } else {
                        this.log(`Removed files: ${removedFileIDs.join(", ")}`);
                    }
                }

                removeFile(fileID, reason) {
                    if (reason === void 0) {
                        reason = null;
                    }

                    this.removeFiles([fileID], reason);
                }

                pauseResume(fileID) {
                    if (
                        !this.getState().capabilities.resumableUploads ||
                        this.getFile(fileID).uploadComplete
                    ) {
                        return undefined;
                    }

                    const wasPaused = this.getFile(fileID).isPaused || false;
                    const isPaused = !wasPaused;
                    this.setFileState(fileID, {
                        isPaused,
                    });
                    this.emit("upload-pause", fileID, isPaused);
                    return isPaused;
                }

                pauseAll() {
                    const updatedFiles = { ...this.getState().files };
                    const inProgressUpdatedFiles = Object.keys(
                        updatedFiles
                    ).filter((file) => {
                        return (
                            !updatedFiles[file].progress.uploadComplete &&
                            updatedFiles[file].progress.uploadStarted
                        );
                    });
                    inProgressUpdatedFiles.forEach((file) => {
                        const updatedFile = {
                            ...updatedFiles[file],
                            isPaused: true,
                        };
                        updatedFiles[file] = updatedFile;
                    });
                    this.setState({
                        files: updatedFiles,
                    });
                    this.emit("pause-all");
                }

                resumeAll() {
                    const updatedFiles = { ...this.getState().files };
                    const inProgressUpdatedFiles = Object.keys(
                        updatedFiles
                    ).filter((file) => {
                        return (
                            !updatedFiles[file].progress.uploadComplete &&
                            updatedFiles[file].progress.uploadStarted
                        );
                    });
                    inProgressUpdatedFiles.forEach((file) => {
                        const updatedFile = {
                            ...updatedFiles[file],
                            isPaused: false,
                            error: null,
                        };
                        updatedFiles[file] = updatedFile;
                    });
                    this.setState({
                        files: updatedFiles,
                    });
                    this.emit("resume-all");
                }

                retryAll() {
                    const updatedFiles = { ...this.getState().files };
                    const filesToRetry = Object.keys(updatedFiles).filter(
                        (file) => {
                            return updatedFiles[file].error;
                        }
                    );
                    filesToRetry.forEach((file) => {
                        const updatedFile = {
                            ...updatedFiles[file],
                            isPaused: false,
                            error: null,
                        };
                        updatedFiles[file] = updatedFile;
                    });
                    this.setState({
                        files: updatedFiles,
                        error: null,
                    });
                    this.emit("retry-all", filesToRetry);

                    if (filesToRetry.length === 0) {
                        return Promise.resolve({
                            successful: [],
                            failed: [],
                        });
                    }

                    const uploadID = _classPrivateFieldLooseBase(
                        this,
                        _createUpload
                    )[_createUpload](filesToRetry, {
                        forceAllowNewUpload: true, // create new upload even if allowNewUpload: false
                    });

                    return _classPrivateFieldLooseBase(this, _runUpload)[
                        _runUpload
                    ](uploadID);
                }

                cancelAll(_temp) {
                    let { reason = "user" } = _temp === void 0 ? {} : _temp;
                    this.emit("cancel-all", {
                        reason,
                    }); // Only remove existing uploads if user is canceling

                    if (reason === "user") {
                        const { files } = this.getState();
                        const fileIDs = Object.keys(files);

                        if (fileIDs.length) {
                            this.removeFiles(fileIDs, "cancel-all");
                        }

                        this.setState({
                            totalProgress: 0,
                            error: null,
                            recoveredState: null,
                        });
                    }
                }

                retryUpload(fileID) {
                    this.setFileState(fileID, {
                        error: null,
                        isPaused: false,
                    });
                    this.emit("upload-retry", fileID);

                    const uploadID = _classPrivateFieldLooseBase(
                        this,
                        _createUpload
                    )[_createUpload]([fileID], {
                        forceAllowNewUpload: true, // create new upload even if allowNewUpload: false
                    });

                    return _classPrivateFieldLooseBase(this, _runUpload)[
                        _runUpload
                    ](uploadID);
                } // todo remove in next major. what is the point of the reset method when we have cancelAll or vice versa?

                reset() {
                    this.cancelAll(...arguments);
                }

                logout() {
                    this.iteratePlugins((plugin) => {
                        if (plugin.provider && plugin.provider.logout) {
                            plugin.provider.logout();
                        }
                    });
                }

                calculateProgress(file, data) {
                    if (file == null || !this.getFile(file.id)) {
                        this.log(
                            `Not setting progress for a file that has been removed: ${
                                file == null ? void 0 : file.id
                            }`
                        );
                        return;
                    } // bytesTotal may be null or zero; in that case we can't divide by it

                    const canHavePercentage =
                        Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
                    this.setFileState(file.id, {
                        progress: {
                            ...this.getFile(file.id).progress,
                            bytesUploaded: data.bytesUploaded,
                            bytesTotal: data.bytesTotal,
                            percentage: canHavePercentage
                                ? Math.round(
                                      (data.bytesUploaded / data.bytesTotal) *
                                          100
                                  )
                                : 0,
                        },
                    });
                    this.calculateTotalProgress();
                }

                calculateTotalProgress() {
                    // calculate total progress, using the number of files currently uploading,
                    // multiplied by 100 and the summ of individual progress of each file
                    const files = this.getFiles();
                    const inProgress = files.filter((file) => {
                        return (
                            file.progress.uploadStarted ||
                            file.progress.preprocess ||
                            file.progress.postprocess
                        );
                    });

                    if (inProgress.length === 0) {
                        this.emit("progress", 0);
                        this.setState({
                            totalProgress: 0,
                        });
                        return;
                    }

                    const sizedFiles = inProgress.filter(
                        (file) => file.progress.bytesTotal != null
                    );
                    const unsizedFiles = inProgress.filter(
                        (file) => file.progress.bytesTotal == null
                    );

                    if (sizedFiles.length === 0) {
                        const progressMax = inProgress.length * 100;
                        const currentProgress = unsizedFiles.reduce(
                            (acc, file) => {
                                return acc + file.progress.percentage;
                            },
                            0
                        );
                        const totalProgress = Math.round(
                            (currentProgress / progressMax) * 100
                        );
                        this.setState({
                            totalProgress,
                        });
                        return;
                    }

                    let totalSize = sizedFiles.reduce((acc, file) => {
                        return acc + file.progress.bytesTotal;
                    }, 0);
                    const averageSize = totalSize / sizedFiles.length;
                    totalSize += averageSize * unsizedFiles.length;
                    let uploadedSize = 0;
                    sizedFiles.forEach((file) => {
                        uploadedSize += file.progress.bytesUploaded;
                    });
                    unsizedFiles.forEach((file) => {
                        uploadedSize +=
                            (averageSize * (file.progress.percentage || 0)) /
                            100;
                    });
                    let totalProgress =
                        totalSize === 0
                            ? 0
                            : Math.round((uploadedSize / totalSize) * 100); // hot fix, because:
                    // uploadedSize ended up larger than totalSize, resulting in 1325% total

                    if (totalProgress > 100) {
                        totalProgress = 100;
                    }

                    this.setState({
                        totalProgress,
                    });
                    this.emit("progress", totalProgress);
                }
                /**
                 * Registers listeners for all global actions, like:
                 * `error`, `file-removed`, `upload-progress`
                 */

                updateOnlineStatus() {
                    const online =
                        typeof window.navigator.onLine !== "undefined"
                            ? window.navigator.onLine
                            : true;

                    if (!online) {
                        this.emit("is-offline");
                        this.info(
                            this.i18n("noInternetConnection"),
                            "error",
                            0
                        );
                        this.wasOffline = true;
                    } else {
                        this.emit("is-online");

                        if (this.wasOffline) {
                            this.emit("back-online");
                            this.info(
                                this.i18n("connectedToInternet"),
                                "success",
                                3000
                            );
                            this.wasOffline = false;
                        }
                    }
                }

                getID() {
                    return this.opts.id;
                }
                /**
                 * Registers a plugin with Core.
                 *
                 * @param {object} Plugin object
                 * @param {object} [opts] object with options to be passed to Plugin
                 * @returns {object} self for chaining
                 */
                // eslint-disable-next-line no-shadow

                use(Plugin, opts) {
                    if (typeof Plugin !== "function") {
                        const msg =
                            `Expected a plugin class, but got ${
                                Plugin === null ? "null" : typeof Plugin
                            }.` +
                            " Please verify that the plugin was imported and spelled correctly.";
                        throw new TypeError(msg);
                    } // Instantiate

                    const plugin = new Plugin(this, opts);
                    const pluginId = plugin.id;

                    if (!pluginId) {
                        throw new Error("Your plugin must have an id");
                    }

                    if (!plugin.type) {
                        throw new Error("Your plugin must have a type");
                    }

                    const existsPluginAlready = this.getPlugin(pluginId);

                    if (existsPluginAlready) {
                        const msg =
                            `Already found a plugin named '${existsPluginAlready.id}'. ` +
                            `Tried to use: '${pluginId}'.\n` +
                            "Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.";
                        throw new Error(msg);
                    }

                    if (Plugin.VERSION) {
                        this.log(`Using ${pluginId} v${Plugin.VERSION}`);
                    }

                    if (
                        plugin.type in
                        _classPrivateFieldLooseBase(this, _plugins)[_plugins]
                    ) {
                        _classPrivateFieldLooseBase(this, _plugins)[_plugins][
                            plugin.type
                        ].push(plugin);
                    } else {
                        _classPrivateFieldLooseBase(this, _plugins)[_plugins][
                            plugin.type
                        ] = [plugin];
                    }

                    plugin.install();
                    return this;
                }
                /**
                 * Find one Plugin by name.
                 *
                 * @param {string} id plugin id
                 * @returns {BasePlugin|undefined}
                 */

                getPlugin(id) {
                    for (const plugins of Object.values(
                        _classPrivateFieldLooseBase(this, _plugins)[_plugins]
                    )) {
                        const foundPlugin = plugins.find(
                            (plugin) => plugin.id === id
                        );
                        if (foundPlugin != null) return foundPlugin;
                    }

                    return undefined;
                }

                [_Symbol$for](type) {
                    return _classPrivateFieldLooseBase(this, _plugins)[
                        _plugins
                    ][type];
                }
                /**
                 * Iterate through all `use`d plugins.
                 *
                 * @param {Function} method that will be run on each plugin
                 */

                iteratePlugins(method) {
                    Object.values(
                        _classPrivateFieldLooseBase(this, _plugins)[_plugins]
                    )
                        .flat(1)
                        .forEach(method);
                }
                /**
                 * Uninstall and remove a plugin.
                 *
                 * @param {object} instance The plugin instance to remove.
                 */

                removePlugin(instance) {
                    this.log(`Removing plugin ${instance.id}`);
                    this.emit("plugin-remove", instance);

                    if (instance.uninstall) {
                        instance.uninstall();
                    }

                    const list = _classPrivateFieldLooseBase(this, _plugins)[
                        _plugins
                    ][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
                    // to a Proxy object, which failed the strict comparison test:
                    // obj !== objProxy

                    const index = list.findIndex(
                        (item) => item.id === instance.id
                    );

                    if (index !== -1) {
                        list.splice(index, 1);
                    }

                    const state = this.getState();
                    const updatedState = {
                        plugins: { ...state.plugins, [instance.id]: undefined },
                    };
                    this.setState(updatedState);
                }
                /**
                 * Uninstall all plugins and close down this Uppy instance.
                 */

                close(_temp2) {
                    let { reason } = _temp2 === void 0 ? {} : _temp2;
                    this.log(
                        `Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`
                    );
                    this.cancelAll({
                        reason,
                    });

                    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[
                        _storeUnsubscribe
                    ]();

                    this.iteratePlugins((plugin) => {
                        this.removePlugin(plugin);
                    });

                    if (
                        typeof window !== "undefined" &&
                        window.removeEventListener
                    ) {
                        window.removeEventListener(
                            "online",
                            _classPrivateFieldLooseBase(
                                this,
                                _updateOnlineStatus
                            )[_updateOnlineStatus]
                        );
                        window.removeEventListener(
                            "offline",
                            _classPrivateFieldLooseBase(
                                this,
                                _updateOnlineStatus
                            )[_updateOnlineStatus]
                        );
                    }
                }

                hideInfo() {
                    const { info } = this.getState();
                    this.setState({
                        info: info.slice(1),
                    });
                    this.emit("info-hidden");
                }
                /**
                 * Set info message in `state.info`, so that UI plugins like `Informer`
                 * can display the message.
                 *
                 * @param {string | object} message Message to be displayed by the informer
                 * @param {string} [type]
                 * @param {number} [duration]
                 */

                info(message, type, duration) {
                    if (type === void 0) {
                        type = "info";
                    }

                    if (duration === void 0) {
                        duration = 3000;
                    }

                    const isComplexMessage = typeof message === "object";
                    this.setState({
                        info: [
                            ...this.getState().info,
                            {
                                type,
                                message: isComplexMessage
                                    ? message.message
                                    : message,
                                details: isComplexMessage
                                    ? message.details
                                    : null,
                            },
                        ],
                    });
                    setTimeout(() => this.hideInfo(), duration);
                    this.emit("info-visible");
                }
                /**
                 * Passes messages to a function, provided in `opts.logger`.
                 * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
                 *
                 * @param {string|object} message to log
                 * @param {string} [type] optional `error` or `warning`
                 */

                log(message, type) {
                    const { logger } = this.opts;

                    switch (type) {
                        case "error":
                            logger.error(message);
                            break;

                        case "warning":
                            logger.warn(message);
                            break;

                        default:
                            logger.debug(message);
                            break;
                    }
                }
                /**
                 * Restore an upload by its ID.
                 */

                restore(uploadID) {
                    this.log(
                        `Core: attempting to restore upload "${uploadID}"`
                    );

                    if (!this.getState().currentUploads[uploadID]) {
                        _classPrivateFieldLooseBase(this, _removeUpload)[
                            _removeUpload
                        ](uploadID);

                        return Promise.reject(new Error("Nonexistent upload"));
                    }

                    return _classPrivateFieldLooseBase(this, _runUpload)[
                        _runUpload
                    ](uploadID);
                }
                /**
                 * Create an upload for a bunch of files.
                 *
                 * @param {Array<string>} fileIDs File IDs to include in this upload.
                 * @returns {string} ID of this upload.
                 */

                [_Symbol$for2]() {
                    return _classPrivateFieldLooseBase(this, _createUpload)[
                        _createUpload
                    ](...arguments);
                }

                /**
                 * Add data to an upload's result object.
                 *
                 * @param {string} uploadID The ID of the upload.
                 * @param {object} data Data properties to add to the result object.
                 */
                addResultData(uploadID, data) {
                    if (
                        !_classPrivateFieldLooseBase(this, _getUpload)[
                            _getUpload
                        ](uploadID)
                    ) {
                        this.log(
                            `Not setting result for an upload that has been removed: ${uploadID}`
                        );
                        return;
                    }

                    const { currentUploads } = this.getState();
                    const currentUpload = {
                        ...currentUploads[uploadID],
                        result: { ...currentUploads[uploadID].result, ...data },
                    };
                    this.setState({
                        currentUploads: {
                            ...currentUploads,
                            [uploadID]: currentUpload,
                        },
                    });
                }
                /**
                 * Remove an upload, eg. if it has been canceled or completed.
                 *
                 * @param {string} uploadID The ID of the upload.
                 */

                /**
                 * Start an upload for all the files that are not currently being uploaded.
                 *
                 * @returns {Promise}
                 */
                upload() {
                    var _classPrivateFieldLoo;

                    if (
                        !(
                            (_classPrivateFieldLoo =
                                _classPrivateFieldLooseBase(this, _plugins)[
                                    _plugins
                                ].uploader) != null &&
                            _classPrivateFieldLoo.length
                        )
                    ) {
                        this.log(
                            "No uploader type plugins are used",
                            "warning"
                        );
                    }

                    let { files } = this.getState();
                    const onBeforeUploadResult =
                        this.opts.onBeforeUpload(files);

                    if (onBeforeUploadResult === false) {
                        return Promise.reject(
                            new Error(
                                "Not starting the upload because onBeforeUpload returned false"
                            )
                        );
                    }

                    if (
                        onBeforeUploadResult &&
                        typeof onBeforeUploadResult === "object"
                    ) {
                        files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
                        // and then fetch the actual file object from state

                        this.setState({
                            files,
                        });
                    }

                    return Promise.resolve()
                        .then(() =>
                            _classPrivateFieldLooseBase(this, _restricter)[
                                _restricter
                            ].validateMinNumberOfFiles(files)
                        )
                        .catch((err) => {
                            _classPrivateFieldLooseBase(this, _informAndEmit)[
                                _informAndEmit
                            ](err);

                            throw err;
                        })
                        .then(() => {
                            if (
                                !_classPrivateFieldLooseBase(
                                    this,
                                    _checkRequiredMetaFields
                                )[_checkRequiredMetaFields](files)
                            ) {
                                throw new RestrictionError(
                                    this.i18n("missingRequiredMetaField")
                                );
                            }
                        })
                        .catch((err) => {
                            // Doing this in a separate catch because we already emited and logged
                            // all the errors in `checkRequiredMetaFields` so we only throw a generic
                            // missing fields error here.
                            throw err;
                        })
                        .then(() => {
                            const { currentUploads } = this.getState(); // get a list of files that are currently assigned to uploads

                            const currentlyUploadingFiles = Object.values(
                                currentUploads
                            ).flatMap((curr) => curr.fileIDs);
                            const waitingFileIDs = [];
                            Object.keys(files).forEach((fileID) => {
                                const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

                                if (
                                    !file.progress.uploadStarted &&
                                    currentlyUploadingFiles.indexOf(fileID) ===
                                        -1
                                ) {
                                    waitingFileIDs.push(file.id);
                                }
                            });

                            const uploadID = _classPrivateFieldLooseBase(
                                this,
                                _createUpload
                            )[_createUpload](waitingFileIDs);

                            return _classPrivateFieldLooseBase(
                                this,
                                _runUpload
                            )[_runUpload](uploadID);
                        })
                        .catch((err) => {
                            this.emit("error", err);
                            this.log(err, "error");
                            throw err;
                        });
                }
            }

            function _informAndEmit2(error, file) {
                const { message, details = "" } = error;

                if (error.isRestriction) {
                    this.emit("restriction-failed", file, error);
                } else {
                    this.emit("error", error);
                }

                this.info(
                    {
                        message,
                        details,
                    },
                    "error",
                    this.opts.infoTimeout
                );
                this.log(`${message} ${details}`.trim(), "error");
            }

            function _checkRequiredMetaFieldsOnFile2(file) {
                const { missingFields, error } = _classPrivateFieldLooseBase(
                    this,
                    _restricter
                )[_restricter].getMissingRequiredMetaFields(file);

                if (missingFields.length > 0) {
                    this.setFileState(file.id, {
                        missingRequiredMetaFields: missingFields,
                    });
                    this.log(error.message);
                    this.emit("restriction-failed", file, error);
                    return false;
                }

                return true;
            }

            function _checkRequiredMetaFields2(files) {
                let success = true;

                for (const file of Object.values(files)) {
                    if (
                        !_classPrivateFieldLooseBase(
                            this,
                            _checkRequiredMetaFieldsOnFile
                        )[_checkRequiredMetaFieldsOnFile](file)
                    ) {
                        success = false;
                    }
                }

                return success;
            }

            function _assertNewUploadAllowed2(file) {
                const { allowNewUpload } = this.getState();

                if (allowNewUpload === false) {
                    const error = new RestrictionError(
                        this.i18n("noMoreFilesAllowed")
                    );

                    _classPrivateFieldLooseBase(this, _informAndEmit)[
                        _informAndEmit
                    ](error, file);

                    throw error;
                }
            }

            function _checkAndCreateFileStateObject2(files, fileDescriptor) {
                const fileType = getFileType(fileDescriptor);
                const fileName = getFileName(fileType, fileDescriptor);
                const fileExtension =
                    getFileNameAndExtension(fileName).extension;
                const isRemote = Boolean(fileDescriptor.isRemote);
                const fileID = generateFileID({
                    ...fileDescriptor,
                    type: fileType,
                });

                if (this.checkIfFileAlreadyExists(fileID)) {
                    const error = new RestrictionError(
                        this.i18n("noDuplicates", {
                            fileName,
                        })
                    );

                    _classPrivateFieldLooseBase(this, _informAndEmit)[
                        _informAndEmit
                    ](error, fileDescriptor);

                    throw error;
                }

                const meta = fileDescriptor.meta || {};
                meta.name = fileName;
                meta.type = fileType; // `null` means the size is unknown.

                const size = Number.isFinite(fileDescriptor.data.size)
                    ? fileDescriptor.data.size
                    : null;
                let newFile = {
                    source: fileDescriptor.source || "",
                    id: fileID,
                    name: fileName,
                    extension: fileExtension || "",
                    meta: { ...this.getState().meta, ...meta },
                    type: fileType,
                    data: fileDescriptor.data,
                    progress: {
                        percentage: 0,
                        bytesUploaded: 0,
                        bytesTotal: size,
                        uploadComplete: false,
                        uploadStarted: null,
                    },
                    size,
                    isRemote,
                    remote: fileDescriptor.remote || "",
                    preview: fileDescriptor.preview,
                };
                const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(
                    newFile,
                    files
                );

                if (onBeforeFileAddedResult === false) {
                    // Don’t show UI info for this error, as it should be done by the developer
                    const error = new RestrictionError(
                        "Cannot add the file because onBeforeFileAdded returned false."
                    );
                    this.emit("restriction-failed", fileDescriptor, error);
                    throw error;
                } else if (
                    typeof onBeforeFileAddedResult === "object" &&
                    onBeforeFileAddedResult !== null
                ) {
                    newFile = onBeforeFileAddedResult;
                }

                try {
                    const filesArray = Object.keys(files).map((i) => files[i]);

                    _classPrivateFieldLooseBase(this, _restricter)[
                        _restricter
                    ].validate(newFile, filesArray);
                } catch (err) {
                    _classPrivateFieldLooseBase(this, _informAndEmit)[
                        _informAndEmit
                    ](err, newFile);

                    throw err;
                }

                return newFile;
            }

            function _startIfAutoProceed2() {
                if (this.opts.autoProceed && !this.scheduledAutoProceed) {
                    this.scheduledAutoProceed = setTimeout(() => {
                        this.scheduledAutoProceed = null;
                        this.upload().catch((err) => {
                            if (!err.isRestriction) {
                                this.log(err.stack || err.message || err);
                            }
                        });
                    }, 4);
                }
            }

            function _addListeners2() {
                /**
                 * @param {Error} error
                 * @param {object} [file]
                 * @param {object} [response]
                 */
                const errorHandler = (error, file, response) => {
                    let errorMsg = error.message || "Unknown error";

                    if (error.details) {
                        errorMsg += ` ${error.details}`;
                    }

                    this.setState({
                        error: errorMsg,
                    });

                    if (file != null && file.id in this.getState().files) {
                        this.setFileState(file.id, {
                            error: errorMsg,
                            response,
                        });
                    }
                };

                this.on("error", errorHandler);
                this.on("upload-error", (file, error, response) => {
                    errorHandler(error, file, response);

                    if (typeof error === "object" && error.message) {
                        const newError = new Error(error.message);
                        newError.details = error.message;

                        if (error.details) {
                            newError.details += ` ${error.details}`;
                        }

                        newError.message = this.i18n("failedToUpload", {
                            file: file.name,
                        });

                        _classPrivateFieldLooseBase(this, _informAndEmit)[
                            _informAndEmit
                        ](newError);
                    } else {
                        _classPrivateFieldLooseBase(this, _informAndEmit)[
                            _informAndEmit
                        ](error);
                    }
                });
                this.on("upload", () => {
                    this.setState({
                        error: null,
                    });
                });
                this.on("upload-started", (file) => {
                    if (file == null || !this.getFile(file.id)) {
                        this.log(
                            `Not setting progress for a file that has been removed: ${
                                file == null ? void 0 : file.id
                            }`
                        );
                        return;
                    }

                    this.setFileState(file.id, {
                        progress: {
                            uploadStarted: Date.now(),
                            uploadComplete: false,
                            percentage: 0,
                            bytesUploaded: 0,
                            bytesTotal: file.size,
                        },
                    });
                });
                this.on("upload-progress", this.calculateProgress);
                this.on("upload-success", (file, uploadResp) => {
                    if (file == null || !this.getFile(file.id)) {
                        this.log(
                            `Not setting progress for a file that has been removed: ${
                                file == null ? void 0 : file.id
                            }`
                        );
                        return;
                    }

                    const currentProgress = this.getFile(file.id).progress;
                    this.setFileState(file.id, {
                        progress: {
                            ...currentProgress,
                            postprocess:
                                _classPrivateFieldLooseBase(
                                    this,
                                    _postProcessors
                                )[_postProcessors].size > 0
                                    ? {
                                          mode: "indeterminate",
                                      }
                                    : null,
                            uploadComplete: true,
                            percentage: 100,
                            bytesUploaded: currentProgress.bytesTotal,
                        },
                        response: uploadResp,
                        uploadURL: uploadResp.uploadURL,
                        isPaused: false,
                    }); // Remote providers sometimes don't tell us the file size,
                    // but we can know how many bytes we uploaded once the upload is complete.

                    if (file.size == null) {
                        this.setFileState(file.id, {
                            size:
                                uploadResp.bytesUploaded ||
                                currentProgress.bytesTotal,
                        });
                    }

                    this.calculateTotalProgress();
                });
                this.on("preprocess-progress", (file, progress) => {
                    if (file == null || !this.getFile(file.id)) {
                        this.log(
                            `Not setting progress for a file that has been removed: ${
                                file == null ? void 0 : file.id
                            }`
                        );
                        return;
                    }

                    this.setFileState(file.id, {
                        progress: {
                            ...this.getFile(file.id).progress,
                            preprocess: progress,
                        },
                    });
                });
                this.on("preprocess-complete", (file) => {
                    if (file == null || !this.getFile(file.id)) {
                        this.log(
                            `Not setting progress for a file that has been removed: ${
                                file == null ? void 0 : file.id
                            }`
                        );
                        return;
                    }

                    const files = { ...this.getState().files };
                    files[file.id] = {
                        ...files[file.id],
                        progress: { ...files[file.id].progress },
                    };
                    delete files[file.id].progress.preprocess;
                    this.setState({
                        files,
                    });
                });
                this.on("postprocess-progress", (file, progress) => {
                    if (file == null || !this.getFile(file.id)) {
                        this.log(
                            `Not setting progress for a file that has been removed: ${
                                file == null ? void 0 : file.id
                            }`
                        );
                        return;
                    }

                    this.setFileState(file.id, {
                        progress: {
                            ...this.getState().files[file.id].progress,
                            postprocess: progress,
                        },
                    });
                });
                this.on("postprocess-complete", (file) => {
                    if (file == null || !this.getFile(file.id)) {
                        this.log(
                            `Not setting progress for a file that has been removed: ${
                                file == null ? void 0 : file.id
                            }`
                        );
                        return;
                    }

                    const files = { ...this.getState().files };
                    files[file.id] = {
                        ...files[file.id],
                        progress: { ...files[file.id].progress },
                    };
                    delete files[file.id].progress.postprocess;
                    this.setState({
                        files,
                    });
                });
                this.on("restored", () => {
                    // Files may have changed--ensure progress is still accurate.
                    this.calculateTotalProgress();
                });
                this.on("dashboard:file-edit-complete", (file) => {
                    if (file) {
                        _classPrivateFieldLooseBase(
                            this,
                            _checkRequiredMetaFieldsOnFile
                        )[_checkRequiredMetaFieldsOnFile](file);
                    }
                }); // show informer if offline

                if (typeof window !== "undefined" && window.addEventListener) {
                    window.addEventListener(
                        "online",
                        _classPrivateFieldLooseBase(this, _updateOnlineStatus)[
                            _updateOnlineStatus
                        ]
                    );
                    window.addEventListener(
                        "offline",
                        _classPrivateFieldLooseBase(this, _updateOnlineStatus)[
                            _updateOnlineStatus
                        ]
                    );
                    setTimeout(
                        _classPrivateFieldLooseBase(this, _updateOnlineStatus)[
                            _updateOnlineStatus
                        ],
                        3000
                    );
                }
            }

            function _createUpload2(fileIDs, opts) {
                if (opts === void 0) {
                    opts = {};
                }

                // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
                const { forceAllowNewUpload = false } = opts;
                const { allowNewUpload, currentUploads } = this.getState();

                if (!allowNewUpload && !forceAllowNewUpload) {
                    throw new Error(
                        "Cannot create a new upload: already uploading."
                    );
                }

                const uploadID = nanoid();
                this.emit("upload", {
                    id: uploadID,
                    fileIDs,
                });
                this.setState({
                    allowNewUpload:
                        this.opts.allowMultipleUploadBatches !== false &&
                        this.opts.allowMultipleUploads !== false,
                    currentUploads: {
                        ...currentUploads,
                        [uploadID]: {
                            fileIDs,
                            step: 0,
                            result: {},
                        },
                    },
                });
                return uploadID;
            }

            function _getUpload2(uploadID) {
                const { currentUploads } = this.getState();
                return currentUploads[uploadID];
            }

            function _removeUpload2(uploadID) {
                const currentUploads = { ...this.getState().currentUploads };
                delete currentUploads[uploadID];
                this.setState({
                    currentUploads,
                });
            }

            async function _runUpload2(uploadID) {
                let { currentUploads } = this.getState();
                let currentUpload = currentUploads[uploadID];
                const restoreStep = currentUpload.step || 0;
                const steps = [
                    ..._classPrivateFieldLooseBase(this, _preProcessors)[
                        _preProcessors
                    ],
                    ..._classPrivateFieldLooseBase(this, _uploaders)[
                        _uploaders
                    ],
                    ..._classPrivateFieldLooseBase(this, _postProcessors)[
                        _postProcessors
                    ],
                ];

                try {
                    for (let step = restoreStep; step < steps.length; step++) {
                        if (!currentUpload) {
                            break;
                        }

                        const fn = steps[step];
                        const updatedUpload = { ...currentUpload, step };
                        this.setState({
                            currentUploads: {
                                ...currentUploads,
                                [uploadID]: updatedUpload,
                            },
                        }); // TODO give this the `updatedUpload` object as its only parameter maybe?
                        // Otherwise when more metadata may be added to the upload this would keep getting more parameters

                        await fn(updatedUpload.fileIDs, uploadID); // Update currentUpload value in case it was modified asynchronously.

                        currentUploads = this.getState().currentUploads;
                        currentUpload = currentUploads[uploadID];
                    }
                } catch (err) {
                    _classPrivateFieldLooseBase(this, _removeUpload)[
                        _removeUpload
                    ](uploadID);

                    throw err;
                } // Set result data.

                if (currentUpload) {
                    // Mark postprocessing step as complete if necessary; this addresses a case where we might get
                    // stuck in the postprocessing UI while the upload is fully complete.
                    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
                    // all, and never mark the postprocessing as complete. This is fine on its own but we
                    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
                    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
                    // before the postprocessing plugins can emit events.
                    //
                    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
                    // postprocessing completion, we do it instead.
                    currentUpload.fileIDs.forEach((fileID) => {
                        const file = this.getFile(fileID);

                        if (file && file.progress.postprocess) {
                            this.emit("postprocess-complete", file);
                        }
                    });
                    const files = currentUpload.fileIDs.map((fileID) =>
                        this.getFile(fileID)
                    );
                    const successful = files.filter((file) => !file.error);
                    const failed = files.filter((file) => file.error);
                    await this.addResultData(uploadID, {
                        successful,
                        failed,
                        uploadID,
                    }); // Update currentUpload value in case it was modified asynchronously.

                    currentUploads = this.getState().currentUploads;
                    currentUpload = currentUploads[uploadID];
                } // Emit completion events.
                // This is in a separate function so that the `currentUploads` variable
                // always refers to the latest state. In the handler right above it refers
                // to an outdated object without the `.result` property.

                let result;

                if (currentUpload) {
                    result = currentUpload.result;
                    this.emit("complete", result);

                    _classPrivateFieldLooseBase(this, _removeUpload)[
                        _removeUpload
                    ](uploadID);
                }

                if (result == null) {
                    this.log(
                        `Not setting result for an upload that has been removed: ${uploadID}`
                    );
                }

                return result;
            }

            Uppy.VERSION = "2.2.0";
            module.exports = Uppy;

            /***/
        },

        /***/ 2008: /***/ function (module) {
            module.exports = function getFileName(fileType, fileDescriptor) {
                if (fileDescriptor.name) {
                    return fileDescriptor.name;
                }

                if (fileType.split("/")[0] === "image") {
                    return `${fileType.split("/")[0]}.${
                        fileType.split("/")[1]
                    }`;
                }

                return "noname";
            };

            /***/
        },

        /***/ 9429: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            const Uppy = __webpack_require__(1790);

            const UIPlugin = __webpack_require__(4649);

            const BasePlugin = __webpack_require__(8937);

            const { debugLogger } = __webpack_require__(4519);

            module.exports = Uppy;
            module.exports.Uppy = Uppy;
            module.exports.UIPlugin = UIPlugin;
            module.exports.BasePlugin = BasePlugin;
            module.exports.debugLogger = debugLogger;

            /***/
        },

        /***/ 8998: /***/ function (module) {
            module.exports = {
                strings: {
                    addBulkFilesFailed: {
                        0: "Failed to add %{smart_count} file due to an internal error",
                        1: "Failed to add %{smart_count} files due to internal errors",
                    },
                    youCanOnlyUploadX: {
                        0: "You can only upload %{smart_count} file",
                        1: "You can only upload %{smart_count} files",
                    },
                    youHaveToAtLeastSelectX: {
                        0: "You have to select at least %{smart_count} file",
                        1: "You have to select at least %{smart_count} files",
                    },
                    exceedsSize:
                        "%{file} exceeds maximum allowed size of %{size}",
                    missingRequiredMetaField: "Missing required meta fields",
                    missingRequiredMetaFieldOnFile:
                        "Missing required meta fields in %{fileName}",
                    inferiorSize:
                        "This file is smaller than the allowed size of %{size}",
                    youCanOnlyUploadFileTypes: "You can only upload: %{types}",
                    noMoreFilesAllowed: "Cannot add more files",
                    noDuplicates:
                        "Cannot add the duplicate file '%{fileName}', it already exists",
                    companionError: "Connection with Companion failed",
                    authAborted: "Authentication aborted",
                    companionUnauthorizeHint:
                        "To unauthorize to your %{provider} account, please go to %{url}",
                    failedToUpload: "Failed to upload %{file}",
                    noInternetConnection: "No Internet connection",
                    connectedToInternet: "Connected to the Internet",
                    // Strings for remote providers
                    noFilesFound: "You have no files or folders here",
                    selectX: {
                        0: "Select %{smart_count}",
                        1: "Select %{smart_count}",
                    },
                    allFilesFromFolderNamed: "All files from folder %{name}",
                    openFolderNamed: "Open folder %{name}",
                    cancel: "Cancel",
                    logOut: "Log out",
                    filter: "Filter",
                    resetFilter: "Reset filter",
                    loading: "Loading...",
                    authenticateWithTitle:
                        "Please authenticate with %{pluginName} to select files",
                    authenticateWith: "Connect to %{pluginName}",
                    signInWithGoogle: "Sign in with Google",
                    searchImages: "Search for images",
                    enterTextToSearch: "Enter text to search for images",
                    search: "Search",
                    emptyFolderAdded: "No files were added from empty folder",
                    folderAlreadyAdded:
                        'The folder "%{folder}" was already added',
                    folderAdded: {
                        0: "Added %{smart_count} file from %{folder}",
                        1: "Added %{smart_count} files from %{folder}",
                    },
                },
            };

            /***/
        },

        /***/ 4519: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            /* eslint-disable no-console */
            const getTimeStamp = __webpack_require__(6770); // Swallow all logs, except errors.
            // default if logger is not set or debug: false

            const justErrorsLogger = {
                debug: () => {},
                warn: () => {},
                error: function () {
                    for (
                        var _len = arguments.length,
                            args = new Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    ) {
                        args[_key] = arguments[_key];
                    }

                    return console.error(`[Uppy] [${getTimeStamp()}]`, ...args);
                },
            }; // Print logs to console with namespace + timestamp,
            // set by logger: Uppy.debugLogger or debug: true

            const debugLogger = {
                debug: function () {
                    for (
                        var _len2 = arguments.length,
                            args = new Array(_len2),
                            _key2 = 0;
                        _key2 < _len2;
                        _key2++
                    ) {
                        args[_key2] = arguments[_key2];
                    }

                    return console.debug(`[Uppy] [${getTimeStamp()}]`, ...args);
                },
                warn: function () {
                    for (
                        var _len3 = arguments.length,
                            args = new Array(_len3),
                            _key3 = 0;
                        _key3 < _len3;
                        _key3++
                    ) {
                        args[_key3] = arguments[_key3];
                    }

                    return console.warn(`[Uppy] [${getTimeStamp()}]`, ...args);
                },
                error: function () {
                    for (
                        var _len4 = arguments.length,
                            args = new Array(_len4),
                            _key4 = 0;
                        _key4 < _len4;
                        _key4++
                    ) {
                        args[_key4] = arguments[_key4];
                    }

                    return console.error(`[Uppy] [${getTimeStamp()}]`, ...args);
                },
            };
            module.exports = {
                justErrorsLogger,
                debugLogger,
            };

            /***/
        },

        /***/ 8585: /***/ function (module) {
            // Edge 15.x does not fire 'progress' events on uploads.
            // See https://github.com/transloadit/uppy/issues/945
            // And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
            module.exports = function supportsUploadProgress(userAgent) {
                // Allow passing in userAgent for tests
                if (userAgent == null) {
                    userAgent =
                        typeof navigator !== "undefined"
                            ? navigator.userAgent
                            : null;
                } // Assume it works because basically everything supports progress events.

                if (!userAgent) return true;
                const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
                if (!m) return true;
                const edgeVersion = m[1];
                let [major, minor] = edgeVersion.split(".");
                major = parseInt(major, 10);
                minor = parseInt(minor, 10); // Worked before:
                // Edge 40.15063.0.0
                // Microsoft EdgeHTML 15.15063

                if (major < 15 || (major === 15 && minor < 15063)) {
                    return true;
                } // Fixed in:
                // Microsoft EdgeHTML 18.18218

                if (major > 18 || (major === 18 && minor >= 18218)) {
                    return true;
                } // other versions don't work.

                return false;
            };

            /***/
        },

        /***/ 6052: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            let _Symbol$for;

            const { h, Component } = __webpack_require__(6400);

            _Symbol$for = Symbol.for(
                "uppy test: disable unused locale key warning"
            );

            class AddFiles extends Component {
                constructor() {
                    super(...arguments);

                    this.triggerFileInputClick = () => {
                        this.fileInput.click();
                    };

                    this.triggerFolderInputClick = () => {
                        this.folderInput.click();
                    };

                    this.onFileInputChange = (event) => {
                        this.props.handleInputChange(event); // We clear the input after a file is selected, because otherwise
                        // change event is not fired in Chrome and Safari when a file
                        // with the same name is selected.
                        // ___Why not use value="" on <input/> instead?
                        //    Because if we use that method of clearing the input,
                        //    Chrome will not trigger change if we drop the same file twice (Issue #768).

                        event.target.value = null;
                    };

                    this.renderHiddenInput = (isFolder, refCallback) => {
                        return h("input", {
                            className: "uppy-Dashboard-input",
                            hidden: true,
                            "aria-hidden": "true",
                            tabIndex: -1,
                            webkitdirectory: isFolder,
                            type: "file",
                            name: "files[]",
                            multiple: this.props.maxNumberOfFiles !== 1,
                            onChange: this.onFileInputChange,
                            accept: this.props.allowedFileTypes,
                            ref: refCallback,
                        });
                    };

                    this.renderMyDeviceAcquirer = () => {
                        return h(
                            "div",
                            {
                                className: "uppy-DashboardTab",
                                role: "presentation",
                                "data-uppy-acquirer-id": "MyDevice",
                            },
                            h(
                                "button",
                                {
                                    type: "button",
                                    className:
                                        "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn",
                                    role: "tab",
                                    tabIndex: 0,
                                    "data-uppy-super-focusable": true,
                                    onClick: this.triggerFileInputClick,
                                },
                                h(
                                    "svg",
                                    {
                                        "aria-hidden": "true",
                                        focusable: "false",
                                        width: "32",
                                        height: "32",
                                        viewBox: "0 0 32 32",
                                    },
                                    h(
                                        "g",
                                        {
                                            fill: "none",
                                            fillRule: "evenodd",
                                        },
                                        h("rect", {
                                            className: "uppy-ProviderIconBg",
                                            width: "32",
                                            height: "32",
                                            rx: "16",
                                            fill: "#2275D7",
                                        }),
                                        h("path", {
                                            d: "M21.973 21.152H9.863l-1.108-5.087h14.464l-1.246 5.087zM9.935 11.37h3.958l.886 1.444a.673.673 0 0 0 .585.316h6.506v1.37H9.935v-3.13zm14.898 3.44a.793.793 0 0 0-.616-.31h-.978v-2.126c0-.379-.275-.613-.653-.613H15.75l-.886-1.445a.673.673 0 0 0-.585-.316H9.232c-.378 0-.667.209-.667.587V14.5h-.782a.793.793 0 0 0-.61.303.795.795 0 0 0-.155.663l1.45 6.633c.078.36.396.618.764.618h13.354c.36 0 .674-.246.76-.595l1.631-6.636a.795.795 0 0 0-.144-.675z",
                                            fill: "#FFF",
                                        })
                                    )
                                ),
                                h(
                                    "div",
                                    {
                                        className: "uppy-DashboardTab-name",
                                    },
                                    this.props.i18n("myDevice")
                                )
                            )
                        );
                    };

                    this.renderBrowseButton = (text, onClickFn) => {
                        const numberOfAcquirers = this.props.acquirers.length;
                        return h(
                            "button",
                            {
                                type: "button",
                                className: "uppy-u-reset uppy-Dashboard-browse",
                                onClick: onClickFn,
                                "data-uppy-super-focusable":
                                    numberOfAcquirers === 0,
                            },
                            text
                        );
                    };

                    this.renderDropPasteBrowseTagline = () => {
                        const numberOfAcquirers = this.props.acquirers.length;
                        const browseFiles = this.renderBrowseButton(
                            this.props.i18n("browseFiles"),
                            this.triggerFileInputClick
                        );
                        const browseFolders = this.renderBrowseButton(
                            this.props.i18n("browseFolders"),
                            this.triggerFolderInputClick
                        ); // in order to keep the i18n CamelCase and options lower (as are defaults) we will want to transform a lower
                        // to Camel

                        const lowerFMSelectionType =
                            this.props.fileManagerSelectionType;
                        const camelFMSelectionType =
                            lowerFMSelectionType.charAt(0).toUpperCase() +
                            lowerFMSelectionType.slice(1);
                        return h(
                            "div",
                            {
                                class: "uppy-Dashboard-AddFiles-title",
                            }, // eslint-disable-next-line no-nested-ternary
                            this.props.disableLocalFiles
                                ? this.props.i18n("importFiles")
                                : numberOfAcquirers > 0
                                ? this.props.i18nArray(
                                      `dropPasteImport${camelFMSelectionType}`,
                                      {
                                          browseFiles,
                                          browseFolders,
                                          browse: browseFiles,
                                      }
                                  )
                                : this.props.i18nArray(
                                      `dropPaste${camelFMSelectionType}`,
                                      {
                                          browseFiles,
                                          browseFolders,
                                          browse: browseFiles,
                                      }
                                  )
                        );
                    };

                    this.renderAcquirer = (acquirer) => {
                        return h(
                            "div",
                            {
                                className: "uppy-DashboardTab",
                                role: "presentation",
                                "data-uppy-acquirer-id": acquirer.id,
                            },
                            h(
                                "button",
                                {
                                    type: "button",
                                    className:
                                        "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn",
                                    role: "tab",
                                    tabIndex: 0,
                                    "data-cy": acquirer.id,
                                    "aria-controls": `uppy-DashboardContent-panel--${acquirer.id}`,
                                    "aria-selected":
                                        this.props.activePickerPanel.id ===
                                        acquirer.id,
                                    "data-uppy-super-focusable": true,
                                    onClick: () =>
                                        this.props.showPanel(acquirer.id),
                                },
                                acquirer.icon(),
                                h(
                                    "div",
                                    {
                                        className: "uppy-DashboardTab-name",
                                    },
                                    acquirer.name
                                )
                            )
                        );
                    };

                    this.renderAcquirers = (acquirers, disableLocalFiles) => {
                        // Group last two buttons, so we don’t end up with
                        // just one button on a new line
                        const acquirersWithoutLastTwo = [...acquirers];
                        const lastTwoAcquirers = acquirersWithoutLastTwo.splice(
                            acquirers.length - 2,
                            acquirers.length
                        );
                        return h(
                            "div",
                            {
                                className: "uppy-Dashboard-AddFiles-list",
                                role: "tablist",
                            },
                            !disableLocalFiles && this.renderMyDeviceAcquirer(),
                            acquirersWithoutLastTwo.map((acquirer) =>
                                this.renderAcquirer(acquirer)
                            ),
                            h(
                                "span",
                                {
                                    role: "presentation",
                                    style: {
                                        "white-space": "nowrap",
                                    },
                                },
                                lastTwoAcquirers.map((acquirer) =>
                                    this.renderAcquirer(acquirer)
                                )
                            )
                        );
                    };
                }

                [_Symbol$for]() {
                    // Those are actually used in `renderDropPasteBrowseTagline` method.
                    this.props.i18nArray("dropPasteBoth");
                    this.props.i18nArray("dropPasteFiles");
                    this.props.i18nArray("dropPasteFolders");
                    this.props.i18nArray("dropPasteImportBoth");
                    this.props.i18nArray("dropPasteImportFiles");
                    this.props.i18nArray("dropPasteImportFolders");
                }

                renderPoweredByUppy() {
                    const { i18nArray } = this.props;
                    const uppyBranding = h(
                        "span",
                        null,
                        h(
                            "svg",
                            {
                                "aria-hidden": "true",
                                focusable: "false",
                                className:
                                    "uppy-c-icon uppy-Dashboard-poweredByIcon",
                                width: "11",
                                height: "11",
                                viewBox: "0 0 11 11",
                            },
                            h("path", {
                                d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z",
                                fillRule: "evenodd",
                            })
                        ),
                        h(
                            "span",
                            {
                                className: "uppy-Dashboard-poweredByUppy",
                            },
                            "Uppy"
                        )
                    );
                    const linkText = i18nArray("poweredBy", {
                        uppy: uppyBranding,
                    });
                    return h(
                        "a",
                        {
                            tabIndex: "-1",
                            href: "https://uppy.io",
                            rel: "noreferrer noopener",
                            target: "_blank",
                            className: "uppy-Dashboard-poweredBy",
                        },
                        linkText
                    );
                }

                render() {
                    return h(
                        "div",
                        {
                            className: "uppy-Dashboard-AddFiles",
                        },
                        this.renderHiddenInput(false, (ref) => {
                            this.fileInput = ref;
                        }),
                        this.renderHiddenInput(true, (ref) => {
                            this.folderInput = ref;
                        }),
                        this.renderDropPasteBrowseTagline(),
                        this.props.acquirers.length > 0 &&
                            this.renderAcquirers(
                                this.props.acquirers,
                                this.props.disableLocalFiles
                            ),
                        h(
                            "div",
                            {
                                className: "uppy-Dashboard-AddFiles-info",
                            },
                            this.props.note &&
                                h(
                                    "div",
                                    {
                                        className: "uppy-Dashboard-note",
                                    },
                                    this.props.note
                                ),
                            this.props.proudlyDisplayPoweredByUppy &&
                                this.renderPoweredByUppy(this.props)
                        )
                    );
                }
            }

            module.exports = AddFiles;

            /***/
        },

        /***/ 5808: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            const AddFiles = __webpack_require__(6052);

            const AddFilesPanel = (props) => {
                return h(
                    "div",
                    {
                        className: classNames(
                            "uppy-Dashboard-AddFilesPanel",
                            props.className
                        ),
                        "data-uppy-panelType": "AddFiles",
                        "aria-hidden": props.showAddFilesPanel,
                    },
                    h(
                        "div",
                        {
                            className: "uppy-DashboardContent-bar",
                        },
                        h(
                            "div",
                            {
                                className: "uppy-DashboardContent-title",
                                role: "heading",
                                "aria-level": "1",
                            },
                            props.i18n("addingMoreFiles")
                        ),
                        h(
                            "button",
                            {
                                className: "uppy-DashboardContent-back",
                                type: "button",
                                onClick: () => props.toggleAddFilesPanel(false),
                            },
                            props.i18n("back")
                        )
                    ),
                    h(AddFiles, props)
                );
            };

            module.exports = AddFilesPanel;

            /***/
        },

        /***/ 5519: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
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

            const { h } = __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            const isDragDropSupported = __webpack_require__(3754);

            const FileList = __webpack_require__(8689);

            const AddFiles = __webpack_require__(6052);

            const AddFilesPanel = __webpack_require__(5808);

            const PickerPanelContent = __webpack_require__(5859);

            const EditorPanel = __webpack_require__(4477);

            const PanelTopBar = __webpack_require__(7246);

            const FileCard = __webpack_require__(5261);

            const Slide = __webpack_require__(9167); // http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
            // https://github.com/ghosh/micromodal

            const WIDTH_XL = 900;
            const WIDTH_LG = 700;
            const WIDTH_MD = 576;
            const HEIGHT_MD = 400;

            module.exports = function Dashboard(props) {
                const noFiles = props.totalFileCount === 0;
                const isSizeMD = props.containerWidth > WIDTH_MD;
                const dashboardClassName = classNames({
                    "uppy-Dashboard": true,
                    "uppy-Dashboard--isDisabled": props.disabled,
                    "uppy-Dashboard--animateOpenClose": props.animateOpenClose,
                    "uppy-Dashboard--isClosing": props.isClosing,
                    "uppy-Dashboard--isDraggingOver": props.isDraggingOver,
                    "uppy-Dashboard--modal": !props.inline,
                    "uppy-size--md": props.containerWidth > WIDTH_MD,
                    "uppy-size--lg": props.containerWidth > WIDTH_LG,
                    "uppy-size--xl": props.containerWidth > WIDTH_XL,
                    "uppy-size--height-md": props.containerHeight > HEIGHT_MD,
                    "uppy-Dashboard--isAddFilesPanelVisible":
                        props.showAddFilesPanel,
                    "uppy-Dashboard--isInnerWrapVisible":
                        props.areInsidesReadyToBeVisible,
                }); // Important: keep these in sync with the percent width values in `src/components/FileItem/index.scss`.

                let itemsPerRow = 1; // mobile

                if (props.containerWidth > WIDTH_XL) {
                    itemsPerRow = 5;
                } else if (props.containerWidth > WIDTH_LG) {
                    itemsPerRow = 4;
                } else if (props.containerWidth > WIDTH_MD) {
                    itemsPerRow = 3;
                }

                const showFileList = props.showSelectedFiles && !noFiles;
                const numberOfFilesForRecovery = props.recoveredState
                    ? Object.keys(props.recoveredState.files).length
                    : null;
                const numberOfGhosts = props.files
                    ? Object.keys(props.files).filter(
                          (fileID) => props.files[fileID].isGhost
                      ).length
                    : null;

                const renderRestoredText = () => {
                    if (numberOfGhosts > 0) {
                        return props.i18n("recoveredXFiles", {
                            smart_count: numberOfGhosts,
                        });
                    }

                    return props.i18n("recoveredAllFiles");
                };

                const dashboard = h(
                    "div",
                    {
                        className: dashboardClassName,
                        "data-uppy-theme": props.theme,
                        "data-uppy-num-acquirers": props.acquirers.length,
                        "data-uppy-drag-drop-supported":
                            !props.disableLocalFiles && isDragDropSupported(),
                        "aria-hidden": props.inline ? "false" : props.isHidden,
                        "aria-disabled": props.disabled,
                        "aria-label": !props.inline
                            ? props.i18n("dashboardWindowTitle")
                            : props.i18n("dashboardTitle"),
                        onPaste: props.handlePaste,
                        onDragOver: props.handleDragOver,
                        onDragLeave: props.handleDragLeave,
                        onDrop: props.handleDrop,
                    },
                    h("div", {
                        "aria-hidden": "true",
                        className: "uppy-Dashboard-overlay",
                        tabIndex: -1,
                        onClick: props.handleClickOutside,
                    }),
                    h(
                        "div",
                        {
                            className: "uppy-Dashboard-inner",
                            "aria-modal": !props.inline && "true",
                            role: !props.inline && "dialog",
                            style: {
                                width:
                                    props.inline && props.width
                                        ? props.width
                                        : "",
                                height:
                                    props.inline && props.height
                                        ? props.height
                                        : "",
                            },
                        },
                        !props.inline
                            ? h(
                                  "button",
                                  {
                                      className:
                                          "uppy-u-reset uppy-Dashboard-close",
                                      type: "button",
                                      "aria-label": props.i18n("closeModal"),
                                      title: props.i18n("closeModal"),
                                      onClick: props.closeModal,
                                  },
                                  h(
                                      "span",
                                      {
                                          "aria-hidden": "true",
                                      },
                                      "\xD7"
                                  )
                              )
                            : null,
                        h(
                            "div",
                            {
                                className: "uppy-Dashboard-innerWrap",
                            },
                            h(
                                "div",
                                {
                                    className:
                                        "uppy-Dashboard-dropFilesHereHint",
                                },
                                props.i18n("dropHint")
                            ),
                            showFileList && h(PanelTopBar, props),
                            numberOfFilesForRecovery &&
                                h(
                                    "div",
                                    {
                                        className: "uppy-Dashboard-serviceMsg",
                                    },
                                    h(
                                        "svg",
                                        {
                                            className:
                                                "uppy-Dashboard-serviceMsg-icon",
                                            "aria-hidden": "true",
                                            focusable: "false",
                                            width: "21",
                                            height: "16",
                                            viewBox: "0 0 24 19",
                                        },
                                        h(
                                            "g",
                                            {
                                                transform: "translate(0 -1)",
                                                fill: "none",
                                                fillRule: "evenodd",
                                            },
                                            h("path", {
                                                d: "M12.857 1.43l10.234 17.056A1 1 0 0122.234 20H1.766a1 1 0 01-.857-1.514L11.143 1.429a1 1 0 011.714 0z",
                                                fill: "#FFD300",
                                            }),
                                            h("path", {
                                                fill: "#000",
                                                d: "M11 6h2l-.3 8h-1.4z",
                                            }),
                                            h("circle", {
                                                fill: "#000",
                                                cx: "12",
                                                cy: "17",
                                                r: "1",
                                            })
                                        )
                                    ),
                                    h(
                                        "strong",
                                        {
                                            className:
                                                "uppy-Dashboard-serviceMsg-title",
                                        },
                                        props.i18n("sessionRestored")
                                    ),
                                    h(
                                        "div",
                                        {
                                            className:
                                                "uppy-Dashboard-serviceMsg-text",
                                        },
                                        renderRestoredText()
                                    )
                                ),
                            showFileList
                                ? h(
                                      FileList,
                                      _extends({}, props, {
                                          itemsPerRow: itemsPerRow,
                                      })
                                  )
                                : h(
                                      AddFiles,
                                      _extends({}, props, {
                                          isSizeMD: isSizeMD,
                                      })
                                  ),
                            h(
                                Slide,
                                null,
                                props.showAddFilesPanel
                                    ? h(
                                          AddFilesPanel,
                                          _extends(
                                              {
                                                  key: "AddFiles",
                                              },
                                              props,
                                              {
                                                  isSizeMD: isSizeMD,
                                              }
                                          )
                                      )
                                    : null
                            ),
                            h(
                                Slide,
                                null,
                                props.fileCardFor
                                    ? h(
                                          FileCard,
                                          _extends(
                                              {
                                                  key: "FileCard",
                                              },
                                              props
                                          )
                                      )
                                    : null
                            ),
                            h(
                                Slide,
                                null,
                                props.activePickerPanel
                                    ? h(
                                          PickerPanelContent,
                                          _extends(
                                              {
                                                  key: "Picker",
                                              },
                                              props
                                          )
                                      )
                                    : null
                            ),
                            h(
                                Slide,
                                null,
                                props.showFileEditor
                                    ? h(
                                          EditorPanel,
                                          _extends(
                                              {
                                                  key: "Editor",
                                              },
                                              props
                                          )
                                      )
                                    : null
                            ),
                            h(
                                "div",
                                {
                                    className:
                                        "uppy-Dashboard-progressindicators",
                                },
                                props.progressindicators.map((target) => {
                                    return props.uppy
                                        .getPlugin(target.id)
                                        .render(props.state);
                                })
                            )
                        )
                    )
                );
                return dashboard;
            };

            /***/
        },

        /***/ 4477: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            function EditorPanel(props) {
                const file = props.files[props.fileCardFor];
                return h(
                    "div",
                    {
                        className: classNames(
                            "uppy-DashboardContent-panel",
                            props.className
                        ),
                        role: "tabpanel",
                        "data-uppy-panelType": "FileEditor",
                        id: "uppy-DashboardContent-panel--editor",
                    },
                    h(
                        "div",
                        {
                            className: "uppy-DashboardContent-bar",
                        },
                        h(
                            "div",
                            {
                                className: "uppy-DashboardContent-title",
                                role: "heading",
                                "aria-level": "1",
                            },
                            props.i18nArray("editing", {
                                file: h(
                                    "span",
                                    {
                                        className:
                                            "uppy-DashboardContent-titleFile",
                                    },
                                    file.meta ? file.meta.name : file.name
                                ),
                            })
                        ),
                        h(
                            "button",
                            {
                                className: "uppy-DashboardContent-back",
                                type: "button",
                                onClick: props.hideAllPanels,
                            },
                            props.i18n("cancel")
                        ),
                        h(
                            "button",
                            {
                                className: "uppy-DashboardContent-save",
                                type: "button",
                                onClick: props.saveFileEditor,
                            },
                            props.i18n("save")
                        )
                    ),
                    h(
                        "div",
                        {
                            className: "uppy-DashboardContent-panelBody",
                        },
                        props.editors.map((target) => {
                            return props.uppy
                                .getPlugin(target.id)
                                .render(props.state);
                        })
                    )
                );
            }

            module.exports = EditorPanel;

            /***/
        },

        /***/ 5261: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h, Component } = __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            const { nanoid } = __webpack_require__(2961);

            const getFileTypeIcon = __webpack_require__(1882);

            const ignoreEvent = __webpack_require__(8805);

            const FilePreview = __webpack_require__(9282);

            class FileCard extends Component {
                constructor(props) {
                    super(props);
                    this.form = document.createElement("form");

                    this.updateMeta = (newVal, name) => {
                        this.setState((_ref) => {
                            let { formState } = _ref;
                            return {
                                formState: { ...formState, [name]: newVal },
                            };
                        });
                    };

                    this.handleSave = (e) => {
                        e.preventDefault();
                        const fileID = this.props.fileCardFor;
                        this.props.saveFileCard(this.state.formState, fileID);
                    };

                    this.handleCancel = () => {
                        this.props.toggleFileCard(false);
                    };

                    this.saveOnEnter = (ev) => {
                        if (ev.keyCode === 13) {
                            ev.stopPropagation();
                            ev.preventDefault();
                            const file =
                                this.props.files[this.props.fileCardFor];
                            this.props.saveFileCard(
                                this.state.formState,
                                file.id
                            );
                        }
                    };

                    this.renderMetaFields = () => {
                        const metaFields = this.getMetaFields() || [];
                        const fieldCSSClasses = {
                            text: "uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input",
                        };
                        return metaFields.map((field) => {
                            const id = `uppy-Dashboard-FileCard-input-${field.id}`;
                            const required =
                                this.props.requiredMetaFields.includes(
                                    field.id
                                );
                            return h(
                                "fieldset",
                                {
                                    key: field.id,
                                    className:
                                        "uppy-Dashboard-FileCard-fieldset",
                                },
                                h(
                                    "label",
                                    {
                                        className:
                                            "uppy-Dashboard-FileCard-label",
                                        htmlFor: id,
                                    },
                                    field.name
                                ),
                                field.render !== undefined
                                    ? field.render(
                                          {
                                              value: this.state.formState[
                                                  field.id
                                              ],
                                              onChange: (newVal) =>
                                                  this.updateMeta(
                                                      newVal,
                                                      field.id
                                                  ),
                                              fieldCSSClasses,
                                              required,
                                              form: this.form.id,
                                          },
                                          h
                                      )
                                    : h("input", {
                                          className: fieldCSSClasses.text,
                                          id: id,
                                          form: this.form.id,
                                          type: field.type || "text",
                                          required: required,
                                          value: this.state.formState[field.id],
                                          placeholder: field.placeholder, // If `form` attribute is not supported, we need to capture pressing Enter to avoid bubbling in case Uppy is
                                          // embedded inside a <form>.
                                          onKeyUp:
                                              "form" in
                                              HTMLInputElement.prototype
                                                  ? undefined
                                                  : this.saveOnEnter,
                                          onKeyDown:
                                              "form" in
                                              HTMLInputElement.prototype
                                                  ? undefined
                                                  : this.saveOnEnter,
                                          onKeyPress:
                                              "form" in
                                              HTMLInputElement.prototype
                                                  ? undefined
                                                  : this.saveOnEnter,
                                          onInput: (ev) =>
                                              this.updateMeta(
                                                  ev.target.value,
                                                  field.id
                                              ),
                                          "data-uppy-super-focusable": true,
                                      })
                            );
                        });
                    };

                    const _file = this.props.files[this.props.fileCardFor];

                    const _metaFields = this.getMetaFields() || [];

                    const storedMetaData = {};

                    _metaFields.forEach((field) => {
                        storedMetaData[field.id] = _file.meta[field.id] || "";
                    });

                    this.state = {
                        formState: storedMetaData,
                    };
                    this.form.id = nanoid();
                } // TODO(aduh95): move this to `UNSAFE_componentWillMount` when updating to Preact X+.

                componentWillMount() {
                    // eslint-disable-line react/no-deprecated
                    this.form.addEventListener("submit", this.handleSave);
                    document.body.appendChild(this.form);
                }

                componentWillUnmount() {
                    this.form.removeEventListener("submit", this.handleSave);
                    document.body.removeChild(this.form);
                }

                getMetaFields() {
                    return typeof this.props.metaFields === "function"
                        ? this.props.metaFields(
                              this.props.files[this.props.fileCardFor]
                          )
                        : this.props.metaFields;
                }

                render() {
                    const file = this.props.files[this.props.fileCardFor];
                    const showEditButton = this.props.canEditFile(file);
                    return h(
                        "div",
                        {
                            className: classNames(
                                "uppy-Dashboard-FileCard",
                                this.props.className
                            ),
                            "data-uppy-panelType": "FileCard",
                            onDragOver: ignoreEvent,
                            onDragLeave: ignoreEvent,
                            onDrop: ignoreEvent,
                            onPaste: ignoreEvent,
                        },
                        h(
                            "div",
                            {
                                className: "uppy-DashboardContent-bar",
                            },
                            h(
                                "div",
                                {
                                    className: "uppy-DashboardContent-title",
                                    role: "heading",
                                    "aria-level": "1",
                                },
                                this.props.i18nArray("editing", {
                                    file: h(
                                        "span",
                                        {
                                            className:
                                                "uppy-DashboardContent-titleFile",
                                        },
                                        file.meta ? file.meta.name : file.name
                                    ),
                                })
                            ),
                            h(
                                "button",
                                {
                                    className: "uppy-DashboardContent-back",
                                    type: "button",
                                    form: this.form.id,
                                    title: this.props.i18n("finishEditingFile"),
                                    onClick: this.handleCancel,
                                },
                                this.props.i18n("cancel")
                            )
                        ),
                        h(
                            "div",
                            {
                                className: "uppy-Dashboard-FileCard-inner",
                            },
                            h(
                                "div",
                                {
                                    className:
                                        "uppy-Dashboard-FileCard-preview",
                                    style: {
                                        backgroundColor: getFileTypeIcon(
                                            file.type
                                        ).color,
                                    },
                                },
                                h(FilePreview, {
                                    file: file,
                                }),
                                showEditButton &&
                                    h(
                                        "button",
                                        {
                                            type: "button",
                                            className:
                                                "uppy-u-reset uppy-c-btn uppy-Dashboard-FileCard-edit",
                                            onClick: (event) => {
                                                // When opening the image editor we want to save any meta fields changes.
                                                // Otherwise it's confusing for the user to click save in the editor,
                                                // but the changes here are discarded. This bypasses validation,
                                                // but we are okay with that.
                                                this.handleSave(event);
                                                this.props.openFileEditor(file);
                                            },
                                            form: this.form.id,
                                        },
                                        this.props.i18n("editFile")
                                    )
                            ),
                            h(
                                "div",
                                {
                                    className: "uppy-Dashboard-FileCard-info",
                                },
                                this.renderMetaFields()
                            ),
                            h(
                                "div",
                                {
                                    className:
                                        "uppy-Dashboard-FileCard-actions",
                                },
                                h(
                                    "button",
                                    {
                                        className:
                                            "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn", // If `form` attribute is supported, we want a submit button to trigger the form validation.
                                        // Otherwise, fallback to a classic button with a onClick event handler.
                                        type:
                                            "form" in
                                            HTMLButtonElement.prototype
                                                ? "submit"
                                                : "button",
                                        onClick:
                                            "form" in
                                            HTMLButtonElement.prototype
                                                ? undefined
                                                : this.handleSave,
                                        form: this.form.id,
                                    },
                                    this.props.i18n("saveChanges")
                                ),
                                h(
                                    "button",
                                    {
                                        className:
                                            "uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn",
                                        type: "button",
                                        onClick: this.handleCancel,
                                        form: this.form.id,
                                    },
                                    this.props.i18n("cancel")
                                )
                            )
                        )
                    );
                }
            }

            module.exports = FileCard;

            /***/
        },

        /***/ 6757: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const copyToClipboard = __webpack_require__(818);

            function EditButton(_ref) {
                let {
                    file,
                    uploadInProgressOrComplete,
                    metaFields,
                    canEditFile,
                    i18n,
                    onClick,
                } = _ref;

                if (
                    (!uploadInProgressOrComplete &&
                        metaFields &&
                        metaFields.length > 0) ||
                    (!uploadInProgressOrComplete && canEditFile(file))
                ) {
                    return h(
                        "button",
                        {
                            className:
                                "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--edit",
                            type: "button",
                            "aria-label": i18n("editFileWithFilename", {
                                file: file.meta.name,
                            }),
                            title: i18n("editFileWithFilename", {
                                file: file.meta.name,
                            }),
                            onClick: () => onClick(),
                        },
                        h(
                            "svg",
                            {
                                "aria-hidden": "true",
                                focusable: "false",
                                className: "uppy-c-icon",
                                width: "14",
                                height: "14",
                                viewBox: "0 0 14 14",
                            },
                            h(
                                "g",
                                {
                                    fillRule: "evenodd",
                                },
                                h("path", {
                                    d: "M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z",
                                    fillRule: "nonzero",
                                }),
                                h("rect", {
                                    x: "1",
                                    y: "12.293",
                                    width: "11",
                                    height: "1",
                                    rx: ".5",
                                }),
                                h("path", {
                                    fillRule: "nonzero",
                                    d: "M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z",
                                })
                            )
                        )
                    );
                }

                return null;
            }

            function RemoveButton(_ref2) {
                let { i18n, onClick, file } = _ref2;
                return h(
                    "button",
                    {
                        className:
                            "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--remove",
                        type: "button",
                        "aria-label": i18n("removeFile", {
                            file: file.meta.name,
                        }),
                        title: i18n("removeFile", {
                            file: file.meta.name,
                        }),
                        onClick: () => onClick(),
                    },
                    h(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className: "uppy-c-icon",
                            width: "18",
                            height: "18",
                            viewBox: "0 0 18 18",
                        },
                        h("path", {
                            d: "M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z",
                        }),
                        h("path", {
                            fill: "#FFF",
                            d: "M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z",
                        })
                    )
                );
            }

            const copyLinkToClipboard = (event, props) => {
                copyToClipboard(
                    props.file.uploadURL,
                    props.i18n("copyLinkToClipboardFallback")
                )
                    .then(() => {
                        props.uppy.log("Link copied to clipboard.");
                        props.uppy.info(
                            props.i18n("copyLinkToClipboardSuccess"),
                            "info",
                            3000
                        );
                    })
                    .catch(props.uppy.log) // avoid losing focus
                    .then(() =>
                        event.target.focus({
                            preventScroll: true,
                        })
                    );
            };

            function CopyLinkButton(props) {
                const { i18n } = props;
                return h(
                    "button",
                    {
                        className:
                            "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--copyLink",
                        type: "button",
                        "aria-label": i18n("copyLink"),
                        title: i18n("copyLink"),
                        onClick: (event) => copyLinkToClipboard(event, props),
                    },
                    h(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className: "uppy-c-icon",
                            width: "14",
                            height: "14",
                            viewBox: "0 0 14 12",
                        },
                        h("path", {
                            d: "M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z",
                        })
                    )
                );
            }

            module.exports = function Buttons(props) {
                const {
                    uppy,
                    file,
                    uploadInProgressOrComplete,
                    canEditFile,
                    metaFields,
                    showLinkToFileUploadResult,
                    showRemoveButton,
                    i18n,
                    toggleFileCard,
                    openFileEditor,
                } = props;

                const editAction = () => {
                    if (metaFields && metaFields.length > 0) {
                        toggleFileCard(true, file.id);
                    } else {
                        openFileEditor(file);
                    }
                };

                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-actionWrapper",
                    },
                    h(EditButton, {
                        i18n: i18n,
                        file: file,
                        uploadInProgressOrComplete: uploadInProgressOrComplete,
                        canEditFile: canEditFile,
                        metaFields: metaFields,
                        onClick: editAction,
                    }),
                    showLinkToFileUploadResult && file.uploadURL
                        ? h(CopyLinkButton, {
                              file: file,
                              uppy: uppy,
                              i18n: i18n,
                          })
                        : null,
                    showRemoveButton
                        ? h(RemoveButton, {
                              i18n: i18n,
                              file: file,
                              uppy: uppy,
                              onClick: () =>
                                  props.uppy.removeFile(
                                      file.id,
                                      "removed-by-user"
                                  ),
                          })
                        : null
                );
            };

            /***/
        },

        /***/ 3844: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h, Fragment } = __webpack_require__(6400);

            const prettierBytes = __webpack_require__(5158);

            const truncateString = __webpack_require__(469);

            const MetaErrorMessage = __webpack_require__(8092);

            const renderFileName = (props) => {
                const { author, name } = props.file.meta;

                function getMaxNameLength() {
                    if (props.containerWidth <= 352) {
                        return 35;
                    }

                    if (props.containerWidth <= 576) {
                        return 60;
                    } // When `author` is present, we want to make sure
                    // the file name fits on one line so we can place
                    // the author on the second line.

                    return author ? 20 : 30;
                }

                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-name",
                        title: name,
                    },
                    truncateString(name, getMaxNameLength())
                );
            };

            const renderAuthor = (props) => {
                const { author } = props.file.meta;
                const { providerName } = props.file.remote;
                const dot = `\u00B7`;

                if (!author) {
                    return null;
                }

                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-author",
                    },
                    h(
                        "a",
                        {
                            href: `${author.url}?utm_source=Companion&utm_medium=referral`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                        },
                        truncateString(author.name, 13)
                    ),
                    providerName
                        ? h(
                              Fragment,
                              null,
                              ` ${dot} `,
                              providerName,
                              ` ${dot} `
                          )
                        : null
                );
            };

            const renderFileSize = (props) =>
                props.file.size &&
                h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-statusSize",
                    },
                    prettierBytes(props.file.size)
                );

            const ReSelectButton = (props) =>
                props.file.isGhost &&
                h(
                    "span",
                    null,
                    " \u2022 ",
                    h(
                        "button",
                        {
                            className:
                                "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-reSelect",
                            type: "button",
                            onClick: props.toggleAddFilesPanel,
                        },
                        props.i18n("reSelect")
                    )
                );

            const ErrorButton = (_ref) => {
                let { file, onClick } = _ref;

                if (file.error) {
                    return h(
                        "button",
                        {
                            className:
                                "uppy-u-reset uppy-Dashboard-Item-errorDetails",
                            "aria-label": file.error,
                            "data-microtip-position": "bottom",
                            "data-microtip-size": "medium",
                            onClick: onClick,
                            type: "button",
                        },
                        "?"
                    );
                }

                return null;
            };

            module.exports = function FileInfo(props) {
                const { file } = props;
                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-fileInfo",
                        "data-uppy-file-source": file.source,
                    },
                    h(
                        "div",
                        {
                            className: "uppy-Dashboard-Item-fileName",
                        },
                        renderFileName(props),
                        h(ErrorButton, {
                            file: props.file, // eslint-disable-next-line no-alert
                            onClick: () => alert(props.file.error), // TODO: move to a custom alert implementation
                        })
                    ),
                    h(
                        "div",
                        {
                            className: "uppy-Dashboard-Item-status",
                        },
                        renderAuthor(props),
                        renderFileSize(props),
                        ReSelectButton(props)
                    ),
                    h(MetaErrorMessage, {
                        file: props.file,
                        i18n: props.i18n,
                        toggleFileCard: props.toggleFileCard,
                        metaFields: props.metaFields,
                    })
                );
            };

            /***/
        },

        /***/ 6012: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const FilePreview = __webpack_require__(9282);

            const MetaErrorMessage = __webpack_require__(8092);

            const getFileTypeIcon = __webpack_require__(1882);

            module.exports = function FilePreviewAndLink(props) {
                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-previewInnerWrap",
                        style: {
                            backgroundColor: getFileTypeIcon(props.file.type)
                                .color,
                        },
                    },
                    props.showLinkToFileUploadResult &&
                        props.file.uploadURL &&
                        h(
                            "a",
                            {
                                className: "uppy-Dashboard-Item-previewLink",
                                href: props.file.uploadURL,
                                rel: "noreferrer noopener",
                                target: "_blank",
                                "aria-label": props.file.meta.name,
                            },
                            h(
                                "span",
                                {
                                    hidden: true,
                                },
                                props.file.meta.name
                            )
                        ),
                    h(FilePreview, {
                        file: props.file,
                    }),
                    h(MetaErrorMessage, {
                        file: props.file,
                        i18n: props.i18n,
                        toggleFileCard: props.toggleFileCard,
                        metaFields: props.metaFields,
                    })
                );
            };

            /***/
        },

        /***/ 1911: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            function onPauseResumeCancelRetry(props) {
                if (props.isUploaded) return;

                if (props.error && !props.hideRetryButton) {
                    props.uppy.retryUpload(props.file.id);
                    return;
                }

                if (props.resumableUploads && !props.hidePauseResumeButton) {
                    props.uppy.pauseResume(props.file.id);
                } else if (
                    props.individualCancellation &&
                    !props.hideCancelButton
                ) {
                    props.uppy.removeFile(props.file.id);
                }
            }

            function progressIndicatorTitle(props) {
                if (props.isUploaded) {
                    return props.i18n("uploadComplete");
                }

                if (props.error) {
                    return props.i18n("retryUpload");
                }

                if (props.resumableUploads) {
                    if (props.file.isPaused) {
                        return props.i18n("resumeUpload");
                    }

                    return props.i18n("pauseUpload");
                }

                if (props.individualCancellation) {
                    return props.i18n("cancelUpload");
                }

                return "";
            }

            function ProgressIndicatorButton(props) {
                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-progress",
                    },
                    h(
                        "button",
                        {
                            className:
                                "uppy-u-reset uppy-Dashboard-Item-progressIndicator",
                            type: "button",
                            "aria-label": progressIndicatorTitle(props),
                            title: progressIndicatorTitle(props),
                            onClick: () => onPauseResumeCancelRetry(props),
                        },
                        props.children
                    )
                );
            }

            function ProgressCircleContainer(_ref) {
                let { children } = _ref;
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        width: "70",
                        height: "70",
                        viewBox: "0 0 36 36",
                        className:
                            "uppy-c-icon uppy-Dashboard-Item-progressIcon--circle",
                    },
                    children
                );
            }

            function ProgressCircle(_ref2) {
                let { progress } = _ref2;
                // circle length equals 2 * PI * R
                const circleLength = 2 * Math.PI * 15;
                return h(
                    "g",
                    null,
                    h("circle", {
                        className: "uppy-Dashboard-Item-progressIcon--bg",
                        r: "15",
                        cx: "18",
                        cy: "18",
                        "stroke-width": "2",
                        fill: "none",
                    }),
                    h("circle", {
                        className: "uppy-Dashboard-Item-progressIcon--progress",
                        r: "15",
                        cx: "18",
                        cy: "18",
                        transform: "rotate(-90, 18, 18)",
                        fill: "none",
                        "stroke-width": "2",
                        "stroke-dasharray": circleLength,
                        "stroke-dashoffset":
                            circleLength - (circleLength / 100) * progress,
                    })
                );
            }

            module.exports = function FileProgress(props) {
                // Nothing if upload has not started
                if (!props.file.progress.uploadStarted) {
                    return null;
                } // Green checkmark when complete

                if (props.isUploaded) {
                    return h(
                        "div",
                        {
                            className: "uppy-Dashboard-Item-progress",
                        },
                        h(
                            "div",
                            {
                                className:
                                    "uppy-Dashboard-Item-progressIndicator",
                            },
                            h(
                                ProgressCircleContainer,
                                null,
                                h("circle", {
                                    r: "15",
                                    cx: "18",
                                    cy: "18",
                                    fill: "#1bb240",
                                }),
                                h("polygon", {
                                    className:
                                        "uppy-Dashboard-Item-progressIcon--check",
                                    transform: "translate(2, 3)",
                                    points: "14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634",
                                })
                            )
                        )
                    );
                }

                if (props.recoveredState) {
                    return;
                } // Retry button for error

                if (props.error && !props.hideRetryButton) {
                    return h(
                        ProgressIndicatorButton,
                        props,
                        h(
                            "svg",
                            {
                                "aria-hidden": "true",
                                focusable: "false",
                                className:
                                    "uppy-c-icon uppy-Dashboard-Item-progressIcon--retry",
                                width: "28",
                                height: "31",
                                viewBox: "0 0 16 19",
                            },
                            h("path", {
                                d: "M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z",
                            }),
                            h("path", {
                                d: "M7.9 3H10v2H7.9z",
                            }),
                            h("path", {
                                d: "M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z",
                            }),
                            h("path", {
                                d: "M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z",
                            })
                        )
                    );
                } // Pause/resume button for resumable uploads

                if (props.resumableUploads && !props.hidePauseResumeButton) {
                    return h(
                        ProgressIndicatorButton,
                        props,
                        h(
                            ProgressCircleContainer,
                            null,
                            h(ProgressCircle, {
                                progress: props.file.progress.percentage,
                            }),
                            props.file.isPaused
                                ? h("polygon", {
                                      className:
                                          "uppy-Dashboard-Item-progressIcon--play",
                                      transform: "translate(3, 3)",
                                      points: "12 20 12 10 20 15",
                                  })
                                : h(
                                      "g",
                                      {
                                          className:
                                              "uppy-Dashboard-Item-progressIcon--pause",
                                          transform: "translate(14.5, 13)",
                                      },
                                      h("rect", {
                                          x: "0",
                                          y: "0",
                                          width: "2",
                                          height: "10",
                                          rx: "0",
                                      }),
                                      h("rect", {
                                          x: "5",
                                          y: "0",
                                          width: "2",
                                          height: "10",
                                          rx: "0",
                                      })
                                  )
                        )
                    );
                } // Cancel button for non-resumable uploads if individualCancellation is supported (not bundled)

                if (
                    !props.resumableUploads &&
                    props.individualCancellation &&
                    !props.hideCancelButton
                ) {
                    return h(
                        ProgressIndicatorButton,
                        props,
                        h(
                            ProgressCircleContainer,
                            null,
                            h(ProgressCircle, {
                                progress: props.file.progress.percentage,
                            }),
                            h("polygon", {
                                className: "cancel",
                                transform: "translate(2, 2)",
                                points: "19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12",
                            })
                        )
                    );
                } // Just progress when buttons are disabled

                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-progress",
                    },
                    h(
                        "div",
                        {
                            className: "uppy-Dashboard-Item-progressIndicator",
                        },
                        h(
                            ProgressCircleContainer,
                            null,
                            h(ProgressCircle, {
                                progress: props.file.progress.percentage,
                            })
                        )
                    )
                );
            };

            /***/
        },

        /***/ 8092: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const metaFieldIdToName = (metaFieldId, metaFields) => {
                const field = metaFields.filter((f) => f.id === metaFieldId);
                return field[0].name;
            };

            module.exports = function renderMissingMetaFieldsError(props) {
                const { file, toggleFileCard, i18n, metaFields } = props;
                const { missingRequiredMetaFields } = file;

                if (
                    !(
                        missingRequiredMetaFields != null &&
                        missingRequiredMetaFields.length
                    )
                ) {
                    return null;
                }

                const metaFieldsString = missingRequiredMetaFields
                    .map((missingMetaField) =>
                        metaFieldIdToName(missingMetaField, metaFields)
                    )
                    .join(", ");
                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-errorMessage",
                    },
                    i18n("missingRequiredMetaFields", {
                        smart_count: missingRequiredMetaFields.length,
                        fields: metaFieldsString,
                    }),
                    " ",
                    h(
                        "button",
                        {
                            type: "button",
                            class: "uppy-u-reset uppy-Dashboard-Item-errorMessageBtn",
                            onClick: () => toggleFileCard(true, file.id),
                        },
                        i18n("editFile")
                    )
                );
            };

            /***/
        },

        /***/ 5845: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h, Component } = __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            const shallowEqual = __webpack_require__(81);

            const FilePreviewAndLink = __webpack_require__(6012);

            const FileProgress = __webpack_require__(1911);

            const FileInfo = __webpack_require__(3844);

            const Buttons = __webpack_require__(6757);

            module.exports = class FileItem extends Component {
                componentDidMount() {
                    const { file } = this.props;

                    if (!file.preview) {
                        this.props.handleRequestThumbnail(file);
                    }
                }

                shouldComponentUpdate(nextProps) {
                    return !shallowEqual(this.props, nextProps);
                } // VirtualList mounts FileItems again and they emit `thumbnail:request`
                // Otherwise thumbnails are broken or missing after Golden Retriever restores files

                componentDidUpdate() {
                    const { file } = this.props;

                    if (!file.preview) {
                        this.props.handleRequestThumbnail(file);
                    }
                }

                componentWillUnmount() {
                    const { file } = this.props;

                    if (!file.preview) {
                        this.props.handleCancelThumbnail(file);
                    }
                }

                render() {
                    const { file } = this.props;
                    const isProcessing =
                        file.progress.preprocess || file.progress.postprocess;
                    const isUploaded =
                        file.progress.uploadComplete &&
                        !isProcessing &&
                        !file.error;
                    const uploadInProgressOrComplete =
                        file.progress.uploadStarted || isProcessing;
                    const uploadInProgress =
                        (file.progress.uploadStarted &&
                            !file.progress.uploadComplete) ||
                        isProcessing;
                    const error = file.error || false; // File that Golden Retriever was able to partly restore (only meta, not blob),
                    // users still need to re-add it, so it’s a ghost

                    const { isGhost } = file;
                    let showRemoveButton = this.props.individualCancellation
                        ? !isUploaded
                        : !uploadInProgress && !isUploaded;

                    if (
                        isUploaded &&
                        this.props.showRemoveButtonAfterComplete
                    ) {
                        showRemoveButton = true;
                    }

                    const dashboardItemClass = classNames({
                        "uppy-Dashboard-Item": true,
                        "is-inprogress":
                            uploadInProgress && !this.props.recoveredState,
                        "is-processing": isProcessing,
                        "is-complete": isUploaded,
                        "is-error": !!error,
                        "is-resumable": this.props.resumableUploads,
                        "is-noIndividualCancellation":
                            !this.props.individualCancellation,
                        "is-ghost": isGhost,
                    });
                    return h(
                        "div",
                        {
                            className: dashboardItemClass,
                            id: `uppy_${file.id}`,
                            role: this.props.role,
                        },
                        h(
                            "div",
                            {
                                className: "uppy-Dashboard-Item-preview",
                            },
                            h(FilePreviewAndLink, {
                                file: file,
                                showLinkToFileUploadResult:
                                    this.props.showLinkToFileUploadResult,
                                i18n: this.props.i18n,
                                toggleFileCard: this.props.toggleFileCard,
                                metaFields: this.props.metaFields,
                            }),
                            h(FileProgress, {
                                uppy: this.props.uppy,
                                file: file,
                                error: error,
                                isUploaded: isUploaded,
                                hideRetryButton: this.props.hideRetryButton,
                                hideCancelButton: this.props.hideCancelButton,
                                hidePauseResumeButton:
                                    this.props.hidePauseResumeButton,
                                recoveredState: this.props.recoveredState,
                                showRemoveButtonAfterComplete:
                                    this.props.showRemoveButtonAfterComplete,
                                resumableUploads: this.props.resumableUploads,
                                individualCancellation:
                                    this.props.individualCancellation,
                                i18n: this.props.i18n,
                            })
                        ),
                        h(
                            "div",
                            {
                                className:
                                    "uppy-Dashboard-Item-fileInfoAndButtons",
                            },
                            h(FileInfo, {
                                file: file,
                                id: this.props.id,
                                acquirers: this.props.acquirers,
                                containerWidth: this.props.containerWidth,
                                i18n: this.props.i18n,
                                toggleAddFilesPanel:
                                    this.props.toggleAddFilesPanel,
                                toggleFileCard: this.props.toggleFileCard,
                                metaFields: this.props.metaFields,
                            }),
                            h(Buttons, {
                                file: file,
                                metaFields: this.props.metaFields,
                                showLinkToFileUploadResult:
                                    this.props.showLinkToFileUploadResult,
                                showRemoveButton: showRemoveButton,
                                canEditFile: this.props.canEditFile,
                                uploadInProgressOrComplete:
                                    uploadInProgressOrComplete,
                                toggleFileCard: this.props.toggleFileCard,
                                openFileEditor: this.props.openFileEditor,
                                uppy: this.props.uppy,
                                i18n: this.props.i18n,
                            })
                        )
                    );
                }
            };

            /***/
        },

        /***/ 8689: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
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

            const classNames = __webpack_require__(4184);

            const { h } = __webpack_require__(6400);

            const FileItem = __webpack_require__(5845);

            const VirtualList = __webpack_require__(4825);

            function chunks(list, size) {
                const chunked = [];
                let currentChunk = [];
                list.forEach((item) => {
                    if (currentChunk.length < size) {
                        currentChunk.push(item);
                    } else {
                        chunked.push(currentChunk);
                        currentChunk = [item];
                    }
                });
                if (currentChunk.length) chunked.push(currentChunk);
                return chunked;
            }

            module.exports = (props) => {
                const noFiles = props.totalFileCount === 0;
                const dashboardFilesClass = classNames("uppy-Dashboard-files", {
                    "uppy-Dashboard-files--noFiles": noFiles,
                }); // It's not great that this is hardcoded!
                // It's ESPECIALLY not great that this is checking against `itemsPerRow`!

                const rowHeight =
                    props.itemsPerRow === 1 // Mobile
                        ? 71 // 190px height + 2 * 5px margin
                        : 200;
                const fileProps = {
                    // FIXME This is confusing, it's actually the Dashboard's plugin ID
                    id: props.id,
                    error: props.error,
                    // TODO move this to context
                    i18n: props.i18n,
                    uppy: props.uppy,
                    // features
                    acquirers: props.acquirers,
                    resumableUploads: props.resumableUploads,
                    individualCancellation: props.individualCancellation,
                    // visual options
                    hideRetryButton: props.hideRetryButton,
                    hidePauseResumeButton: props.hidePauseResumeButton,
                    hideCancelButton: props.hideCancelButton,
                    showLinkToFileUploadResult:
                        props.showLinkToFileUploadResult,
                    showRemoveButtonAfterComplete:
                        props.showRemoveButtonAfterComplete,
                    isWide: props.isWide,
                    metaFields: props.metaFields,
                    recoveredState: props.recoveredState,
                    // callbacks
                    toggleFileCard: props.toggleFileCard,
                    handleRequestThumbnail: props.handleRequestThumbnail,
                    handleCancelThumbnail: props.handleCancelThumbnail,
                };

                const sortByGhostComesFirst = (file1, file2) => {
                    return (
                        props.files[file2].isGhost - props.files[file1].isGhost
                    );
                }; // Sort files by file.isGhost, ghost files first, only if recoveredState is present

                const files = Object.keys(props.files);
                if (props.recoveredState) files.sort(sortByGhostComesFirst);
                const rows = chunks(files, props.itemsPerRow);

                const renderRow = (
                    row // The `role="presentation` attribute ensures that the list items are properly
                ) =>
                    // associated with the `VirtualList` element.
                    // We use the first file ID as the key—this should not change across scroll rerenders
                    h(
                        "div",
                        {
                            role: "presentation",
                            key: row[0],
                        },
                        row.map((fileID) =>
                            h(
                                FileItem,
                                _extends(
                                    {
                                        key: fileID,
                                        uppy: props.uppy,
                                    },
                                    fileProps,
                                    {
                                        role: "listitem",
                                        openFileEditor: props.openFileEditor,
                                        canEditFile: props.canEditFile,
                                        toggleAddFilesPanel:
                                            props.toggleAddFilesPanel,
                                        file: props.files[fileID],
                                    }
                                )
                            )
                        )
                    );

                return h(VirtualList, {
                    class: dashboardFilesClass,
                    role: "list",
                    data: rows,
                    renderRow: renderRow,
                    rowHeight: rowHeight,
                });
            };

            /***/
        },

        /***/ 9282: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const getFileTypeIcon = __webpack_require__(1882);

            module.exports = function FilePreview(props) {
                const { file } = props;

                if (file.preview) {
                    return h("img", {
                        className: "uppy-Dashboard-Item-previewImg",
                        alt: file.name,
                        src: file.preview,
                    });
                }

                const { color, icon } = getFileTypeIcon(file.type);
                return h(
                    "div",
                    {
                        className: "uppy-Dashboard-Item-previewIconWrap",
                    },
                    h(
                        "span",
                        {
                            className: "uppy-Dashboard-Item-previewIcon",
                            style: {
                                color,
                            },
                        },
                        icon
                    ),
                    h(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className: "uppy-Dashboard-Item-previewIconBg",
                            width: "58",
                            height: "76",
                            viewBox: "0 0 58 76",
                        },
                        h("rect", {
                            fill: "#FFF",
                            width: "58",
                            height: "76",
                            rx: "3",
                            fillRule: "evenodd",
                        })
                    )
                );
            };

            /***/
        },

        /***/ 5859: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            const ignoreEvent = __webpack_require__(8805);

            function PickerPanelContent(props) {
                return h(
                    "div",
                    {
                        className: classNames(
                            "uppy-DashboardContent-panel",
                            props.className
                        ),
                        role: "tabpanel",
                        "data-uppy-panelType": "PickerPanel",
                        id: `uppy-DashboardContent-panel--${props.activePickerPanel.id}`,
                        onDragOver: ignoreEvent,
                        onDragLeave: ignoreEvent,
                        onDrop: ignoreEvent,
                        onPaste: ignoreEvent,
                    },
                    h(
                        "div",
                        {
                            className: "uppy-DashboardContent-bar",
                        },
                        h(
                            "div",
                            {
                                className: "uppy-DashboardContent-title",
                                role: "heading",
                                "aria-level": "1",
                            },
                            props.i18n("importFrom", {
                                name: props.activePickerPanel.name,
                            })
                        ),
                        h(
                            "button",
                            {
                                className: "uppy-DashboardContent-back",
                                type: "button",
                                onClick: props.hideAllPanels,
                            },
                            props.i18n("cancel")
                        )
                    ),
                    h(
                        "div",
                        {
                            className: "uppy-DashboardContent-panelBody",
                        },
                        props.uppy
                            .getPlugin(props.activePickerPanel.id)
                            .render(props.state)
                    )
                );
            }

            module.exports = PickerPanelContent;

            /***/
        },

        /***/ 7246: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            const uploadStates = {
                STATE_ERROR: "error",
                STATE_WAITING: "waiting",
                STATE_PREPROCESSING: "preprocessing",
                STATE_UPLOADING: "uploading",
                STATE_POSTPROCESSING: "postprocessing",
                STATE_COMPLETE: "complete",
                STATE_PAUSED: "paused",
            };

            function getUploadingState(
                isAllErrored,
                isAllComplete,
                isAllPaused,
                files
            ) {
                if (files === void 0) {
                    files = {};
                }

                if (isAllErrored) {
                    return uploadStates.STATE_ERROR;
                }

                if (isAllComplete) {
                    return uploadStates.STATE_COMPLETE;
                }

                if (isAllPaused) {
                    return uploadStates.STATE_PAUSED;
                }

                let state = uploadStates.STATE_WAITING;
                const fileIDs = Object.keys(files);

                for (let i = 0; i < fileIDs.length; i++) {
                    const { progress } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

                    if (progress.uploadStarted && !progress.uploadComplete) {
                        return uploadStates.STATE_UPLOADING;
                    } // If files are being preprocessed AND postprocessed at this time, we show the
                    // preprocess state. If any files are being uploaded we show uploading.

                    if (
                        progress.preprocess &&
                        state !== uploadStates.STATE_UPLOADING
                    ) {
                        state = uploadStates.STATE_PREPROCESSING;
                    } // If NO files are being preprocessed or uploaded right now, but some files are
                    // being postprocessed, show the postprocess state.

                    if (
                        progress.postprocess &&
                        state !== uploadStates.STATE_UPLOADING &&
                        state !== uploadStates.STATE_PREPROCESSING
                    ) {
                        state = uploadStates.STATE_POSTPROCESSING;
                    }
                }

                return state;
            }

            function UploadStatus(props) {
                const uploadingState = getUploadingState(
                    props.isAllErrored,
                    props.isAllComplete,
                    props.isAllPaused,
                    props.files
                );

                switch (uploadingState) {
                    case "uploading":
                        return props.i18n("uploadingXFiles", {
                            smart_count: props.inProgressNotPausedFiles.length,
                        });

                    case "preprocessing":
                    case "postprocessing":
                        return props.i18n("processingXFiles", {
                            smart_count: props.processingFiles.length,
                        });

                    case "paused":
                        return props.i18n("uploadPaused");

                    case "waiting":
                        return props.i18n("xFilesSelected", {
                            smart_count: props.newFiles.length,
                        });

                    case "complete":
                        return props.i18n("uploadComplete");
                }
            }

            function PanelTopBar(props) {
                let { allowNewUpload } = props; // TODO maybe this should be done in ../index.js, then just pass that down as `allowNewUpload`

                if (allowNewUpload && props.maxNumberOfFiles) {
                    allowNewUpload =
                        props.totalFileCount < props.maxNumberOfFiles;
                }

                return h(
                    "div",
                    {
                        className: "uppy-DashboardContent-bar",
                    },
                    !props.isAllComplete && !props.hideCancelButton
                        ? h(
                              "button",
                              {
                                  className: "uppy-DashboardContent-back",
                                  type: "button",
                                  onClick: () => props.uppy.cancelAll(),
                              },
                              props.i18n("cancel")
                          )
                        : h("div", null),
                    h(
                        "div",
                        {
                            className: "uppy-DashboardContent-title",
                            role: "heading",
                            "aria-level": "1",
                        },
                        h(UploadStatus, props)
                    ),
                    allowNewUpload
                        ? h(
                              "button",
                              {
                                  className: "uppy-DashboardContent-addMore",
                                  type: "button",
                                  "aria-label": props.i18n("addMoreFiles"),
                                  title: props.i18n("addMoreFiles"),
                                  onClick: () =>
                                      props.toggleAddFilesPanel(true),
                              },
                              h(
                                  "svg",
                                  {
                                      "aria-hidden": "true",
                                      focusable: "false",
                                      className: "uppy-c-icon",
                                      width: "15",
                                      height: "15",
                                      viewBox: "0 0 15 15",
                                  },
                                  h("path", {
                                      d: "M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z",
                                  })
                              ),
                              h(
                                  "span",
                                  {
                                      className:
                                          "uppy-DashboardContent-addMoreCaption",
                                  },
                                  props.i18n("addMore")
                              )
                          )
                        : h("div", null)
                );
            }

            module.exports = PanelTopBar;

            /***/
        },

        /***/ 9167: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { cloneElement, Component, toChildArray } =
                __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            const transitionName = "uppy-transition-slideDownUp";
            const duration = 250;
            /**
             * Vertical slide transition.
             *
             * This can take a _single_ child component, which _must_ accept a `className` prop.
             *
             * Currently this is specific to the `uppy-transition-slideDownUp` transition,
             * but it should be simple to extend this for any type of single-element
             * transition by setting the CSS name and duration as props.
             */

            class Slide extends Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        cachedChildren: null,
                        className: "",
                    };
                } // TODO: refactor to stable lifecycle method
                // eslint-disable-next-line

                componentWillUpdate(nextProps) {
                    const { cachedChildren } = this.state;
                    const child = toChildArray(nextProps.children)[0];
                    if (cachedChildren === child) return null;
                    const patch = {
                        cachedChildren: child,
                    }; // Enter transition

                    if (child && !cachedChildren) {
                        patch.className = `${transitionName}-enter`;
                        cancelAnimationFrame(this.animationFrame);
                        clearTimeout(this.leaveTimeout);
                        this.leaveTimeout = undefined;
                        this.animationFrame = requestAnimationFrame(() => {
                            // Force it to render before we add the active class
                            // this.base.getBoundingClientRect()
                            this.setState({
                                className: `${transitionName}-enter ${transitionName}-enter-active`,
                            });
                            this.enterTimeout = setTimeout(() => {
                                this.setState({
                                    className: "",
                                });
                            }, duration);
                        });
                    } // Leave transition

                    if (
                        cachedChildren &&
                        !child &&
                        this.leaveTimeout === undefined
                    ) {
                        patch.cachedChildren = cachedChildren;
                        patch.className = `${transitionName}-leave`;
                        cancelAnimationFrame(this.animationFrame);
                        clearTimeout(this.enterTimeout);
                        this.enterTimeout = undefined;
                        this.animationFrame = requestAnimationFrame(() => {
                            this.setState({
                                className: `${transitionName}-leave ${transitionName}-leave-active`,
                            });
                            this.leaveTimeout = setTimeout(() => {
                                this.setState({
                                    cachedChildren: null,
                                    className: "",
                                });
                            }, duration);
                        });
                    } // eslint-disable-next-line

                    this.setState(patch);
                }

                render() {
                    const { cachedChildren, className } = this.state;

                    if (!cachedChildren) {
                        return null;
                    }

                    return cloneElement(cachedChildren, {
                        className: classNames(
                            className,
                            cachedChildren.props.className
                        ),
                    });
                }
            }

            module.exports = Slide;

            /***/
        },

        /***/ 4825: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
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

            /**
             * Adapted from preact-virtual-list: https://github.com/developit/preact-virtual-list
             *
             * © 2016 Jason Miller
             *
             * Permission is hereby granted, free of charge, to any person obtaining a copy
             * of this software and associated documentation files (the "Software"), to deal
             * in the Software without restriction, including without limitation the rights
             * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
             * copies of the Software, and to permit persons to whom the Software is
             * furnished to do so, subject to the following conditions:
             *
             * The above copyright notice and this permission notice shall be included in all
             * copies or substantial portions of the Software.
             *
             * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
             * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
             * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
             * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
             * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
             * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
             * SOFTWARE.
             *
             * Adaptations:
             * - Added role=presentation to helper elements
             * - Tweaked styles for Uppy's Dashboard use case
             */
            const { h, Component } = __webpack_require__(6400);

            const STYLE_INNER = {
                position: "relative",
                // Disabled for our use case: the wrapper elements around FileList already deal with overflow,
                // and this additional property would hide things that we want to show.
                //
                // overflow: 'hidden',
                width: "100%",
                minHeight: "100%",
            };
            const STYLE_CONTENT = {
                position: "absolute",
                top: 0,
                left: 0,
                // Because the `top` value gets set to some offset, this `height` being 100% would make the scrollbar
                // stretch far beyond the content. For our use case, the content div actually can get its height from
                // the elements inside it, so we don't need to specify a `height` property at all.
                //
                // height: '100%',
                width: "100%",
                overflow: "visible",
            };

            class VirtualList extends Component {
                constructor(props) {
                    super(props); // The currently focused node, used to retain focus when the visible rows change.
                    // To avoid update loops, this should not cause state updates, so it's kept as a plain property.

                    this.handleScroll = () => {
                        this.setState({
                            offset: this.base.scrollTop,
                        });
                    };

                    this.handleResize = () => {
                        this.resize();
                    };

                    this.focusElement = null;
                    this.state = {
                        offset: 0,
                        height: 0,
                    };
                }

                componentDidMount() {
                    this.resize();
                    window.addEventListener("resize", this.handleResize);
                } // TODO: refactor to stable lifecycle method
                // eslint-disable-next-line

                componentWillUpdate() {
                    if (this.base.contains(document.activeElement)) {
                        this.focusElement = document.activeElement;
                    }
                }

                componentDidUpdate() {
                    // Maintain focus when rows are added and removed.
                    if (
                        this.focusElement &&
                        this.focusElement.parentNode &&
                        document.activeElement !== this.focusElement
                    ) {
                        this.focusElement.focus();
                    }

                    this.focusElement = null;
                    this.resize();
                }

                componentWillUnmount() {
                    window.removeEventListener("resize", this.handleResize);
                }

                resize() {
                    const { height } = this.state;

                    if (height !== this.base.offsetHeight) {
                        this.setState({
                            height: this.base.offsetHeight,
                        });
                    }
                }

                render(_ref) {
                    let {
                        data,
                        rowHeight,
                        renderRow,
                        overscanCount = 10,
                        ...props
                    } = _ref;
                    const { offset, height } = this.state; // first visible row index

                    let start = Math.floor(offset / rowHeight); // actual number of visible rows (without overscan)

                    let visibleRowCount = Math.floor(height / rowHeight); // Overscan: render blocks of rows modulo an overscan row count
                    // This dramatically reduces DOM writes during scrolling

                    if (overscanCount) {
                        start = Math.max(0, start - (start % overscanCount));
                        visibleRowCount += overscanCount;
                    } // last visible + overscan row index + padding to allow keyboard focus to travel past the visible area

                    const end = start + visibleRowCount + 4; // data slice currently in viewport plus overscan items

                    const selection = data.slice(start, end);
                    const styleInner = {
                        ...STYLE_INNER,
                        height: data.length * rowHeight,
                    };
                    const styleContent = {
                        ...STYLE_CONTENT,
                        top: start * rowHeight,
                    }; // The `role="presentation"` attributes ensure that these wrapper elements are not treated as list
                    // items by accessibility and outline tools.

                    return h(
                        "div",
                        _extends(
                            {
                                onScroll: this.handleScroll,
                            },
                            props
                        ),
                        h(
                            "div",
                            {
                                role: "presentation",
                                style: styleInner,
                            },
                            h(
                                "div",
                                {
                                    role: "presentation",
                                    style: styleContent,
                                },
                                selection.map(renderRow)
                            )
                        )
                    );
                }
            }

            module.exports = VirtualList;

            /***/
        },

        /***/ 3014: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var _class,
                _openFileEditorWhenFilesAdded,
                _attachRenderFunctionToTarget,
                _isTargetSupported,
                _getAcquirers,
                _getProgressIndicators,
                _getEditors,
                _temp;

            function _classPrivateFieldLooseBase(receiver, privateKey) {
                if (
                    !Object.prototype.hasOwnProperty.call(receiver, privateKey)
                ) {
                    throw new TypeError(
                        "attempted to use private field on non-instance"
                    );
                }
                return receiver;
            }

            var id = 0;

            function _classPrivateFieldLooseKey(name) {
                return "__private_" + id++ + "_" + name;
            }

            const { h } = __webpack_require__(6400);

            const { UIPlugin } = __webpack_require__(9429);

            const StatusBar = __webpack_require__(2310);

            const Informer = __webpack_require__(873);

            const ThumbnailGenerator = __webpack_require__(7753);

            const findAllDOMElements = __webpack_require__(1147);

            const toArray = __webpack_require__(6361);

            const getDroppedFiles = __webpack_require__(4031);

            const { nanoid } = __webpack_require__(2961);

            const trapFocus = __webpack_require__(3962);

            const createSuperFocus = __webpack_require__(6673);

            const memoize =
                __webpack_require__(845)["default"] || __webpack_require__(845);

            const FOCUSABLE_ELEMENTS = __webpack_require__(9045);

            const DashboardUI = __webpack_require__(5519);

            const locale = __webpack_require__(5233);

            const TAB_KEY = 9;
            const ESC_KEY = 27;

            function createPromise() {
                const o = {};
                o.promise = new Promise((resolve, reject) => {
                    o.resolve = resolve;
                    o.reject = reject;
                });
                return o;
            }

            function defaultPickerIcon() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        width: "30",
                        height: "30",
                        viewBox: "0 0 30 30",
                    },
                    h("path", {
                        d: "M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z",
                    })
                );
            }
            /**
             * Dashboard UI with previews, metadata editing, tabs for various services and more
             */

            module.exports =
                ((_temp =
                    ((_openFileEditorWhenFilesAdded =
                        /*#__PURE__*/ _classPrivateFieldLooseKey(
                            "openFileEditorWhenFilesAdded"
                        )),
                    (_attachRenderFunctionToTarget =
                        /*#__PURE__*/ _classPrivateFieldLooseKey(
                            "attachRenderFunctionToTarget"
                        )),
                    (_isTargetSupported =
                        /*#__PURE__*/ _classPrivateFieldLooseKey(
                            "isTargetSupported"
                        )),
                    (_getAcquirers =
                        /*#__PURE__*/ _classPrivateFieldLooseKey(
                            "getAcquirers"
                        )),
                    (_getProgressIndicators =
                        /*#__PURE__*/ _classPrivateFieldLooseKey(
                            "getProgressIndicators"
                        )),
                    (_getEditors =
                        /*#__PURE__*/ _classPrivateFieldLooseKey("getEditors")),
                    (_class = class Dashboard extends UIPlugin {
                        constructor(uppy, _opts) {
                            var _this;

                            super(uppy, _opts);
                            _this = this;

                            this.removeTarget = (plugin) => {
                                const pluginState = this.getPluginState(); // filter out the one we want to remove

                                const newTargets = pluginState.targets.filter(
                                    (target) => target.id !== plugin.id
                                );
                                this.setPluginState({
                                    targets: newTargets,
                                });
                            };

                            this.addTarget = (plugin) => {
                                const callerPluginId =
                                    plugin.id || plugin.constructor.name;
                                const callerPluginName =
                                    plugin.title || callerPluginId;
                                const callerPluginType = plugin.type;

                                if (
                                    callerPluginType !== "acquirer" &&
                                    callerPluginType !== "progressindicator" &&
                                    callerPluginType !== "editor"
                                ) {
                                    const msg =
                                        "Dashboard: can only be targeted by plugins of types: acquirer, progressindicator, editor";
                                    this.uppy.log(msg, "error");
                                    return;
                                }

                                const target = {
                                    id: callerPluginId,
                                    name: callerPluginName,
                                    type: callerPluginType,
                                };
                                const state = this.getPluginState();
                                const newTargets = state.targets.slice();
                                newTargets.push(target);
                                this.setPluginState({
                                    targets: newTargets,
                                });
                                return this.el;
                            };

                            this.hideAllPanels = () => {
                                const state = this.getPluginState();
                                const update = {
                                    activePickerPanel: false,
                                    showAddFilesPanel: false,
                                    activeOverlayType: null,
                                    fileCardFor: null,
                                    showFileEditor: false,
                                };

                                if (
                                    state.activePickerPanel ===
                                        update.activePickerPanel &&
                                    state.showAddFilesPanel ===
                                        update.showAddFilesPanel &&
                                    state.showFileEditor ===
                                        update.showFileEditor &&
                                    state.activeOverlayType ===
                                        update.activeOverlayType
                                ) {
                                    // avoid doing a state update if nothing changed
                                    return;
                                }

                                this.setPluginState(update);
                            };

                            this.showPanel = (id) => {
                                const { targets } = this.getPluginState();
                                const activePickerPanel = targets.filter(
                                    (target) => {
                                        return (
                                            target.type === "acquirer" &&
                                            target.id === id
                                        );
                                    }
                                )[0];
                                this.setPluginState({
                                    activePickerPanel,
                                    activeOverlayType: "PickerPanel",
                                });
                            };

                            this.canEditFile = (file) => {
                                const { targets } = this.getPluginState();

                                const editors = _classPrivateFieldLooseBase(
                                    this,
                                    _getEditors
                                )[_getEditors](targets);

                                return editors.some((target) =>
                                    this.uppy
                                        .getPlugin(target.id)
                                        .canEditFile(file)
                                );
                            };

                            this.openFileEditor = (file) => {
                                const { targets } = this.getPluginState();

                                const editors = _classPrivateFieldLooseBase(
                                    this,
                                    _getEditors
                                )[_getEditors](targets);

                                this.setPluginState({
                                    showFileEditor: true,
                                    fileCardFor: file.id || null,
                                    activeOverlayType: "FileEditor",
                                });
                                editors.forEach((editor) => {
                                    this.uppy
                                        .getPlugin(editor.id)
                                        .selectFile(file);
                                });
                            };

                            this.saveFileEditor = () => {
                                const { targets } = this.getPluginState();

                                const editors = _classPrivateFieldLooseBase(
                                    this,
                                    _getEditors
                                )[_getEditors](targets);

                                editors.forEach((editor) => {
                                    this.uppy.getPlugin(editor.id).save();
                                });
                                this.hideAllPanels();
                            };

                            this.openModal = () => {
                                const { promise, resolve } = createPromise(); // save scroll position

                                this.savedScrollPosition = window.pageYOffset; // save active element, so we can restore focus when modal is closed

                                this.savedActiveElement =
                                    document.activeElement;

                                if (this.opts.disablePageScrollWhenModalOpen) {
                                    document.body.classList.add(
                                        "uppy-Dashboard-isFixed"
                                    );
                                }

                                if (
                                    this.opts.animateOpenClose &&
                                    this.getPluginState().isClosing
                                ) {
                                    const handler = () => {
                                        this.setPluginState({
                                            isHidden: false,
                                        });
                                        this.el.removeEventListener(
                                            "animationend",
                                            handler,
                                            false
                                        );
                                        resolve();
                                    };

                                    this.el.addEventListener(
                                        "animationend",
                                        handler,
                                        false
                                    );
                                } else {
                                    this.setPluginState({
                                        isHidden: false,
                                    });
                                    resolve();
                                }

                                if (this.opts.browserBackButtonClose) {
                                    this.updateBrowserHistory();
                                } // handle ESC and TAB keys in modal dialog

                                document.addEventListener(
                                    "keydown",
                                    this.handleKeyDownInModal
                                );
                                this.uppy.emit("dashboard:modal-open");
                                return promise;
                            };

                            this.closeModal = function (opts) {
                                if (opts === void 0) {
                                    opts = {};
                                }

                                const {
                                    // Whether the modal is being closed by the user (`true`) or by other means (e.g. browser back button)
                                    manualClose = true,
                                } = opts;

                                const { isHidden, isClosing } =
                                    _this.getPluginState();

                                if (isHidden || isClosing) {
                                    // short-circuit if animation is ongoing
                                    return;
                                }

                                const { promise, resolve } = createPromise();

                                if (_this.opts.disablePageScrollWhenModalOpen) {
                                    document.body.classList.remove(
                                        "uppy-Dashboard-isFixed"
                                    );
                                }

                                if (_this.opts.animateOpenClose) {
                                    _this.setPluginState({
                                        isClosing: true,
                                    });

                                    const handler = () => {
                                        _this.setPluginState({
                                            isHidden: true,
                                            isClosing: false,
                                        });

                                        _this.superFocus.cancel();

                                        _this.savedActiveElement.focus();

                                        _this.el.removeEventListener(
                                            "animationend",
                                            handler,
                                            false
                                        );

                                        resolve();
                                    };

                                    _this.el.addEventListener(
                                        "animationend",
                                        handler,
                                        false
                                    );
                                } else {
                                    _this.setPluginState({
                                        isHidden: true,
                                    });

                                    _this.superFocus.cancel();

                                    _this.savedActiveElement.focus();

                                    resolve();
                                } // handle ESC and TAB keys in modal dialog

                                document.removeEventListener(
                                    "keydown",
                                    _this.handleKeyDownInModal
                                );

                                if (manualClose) {
                                    if (_this.opts.browserBackButtonClose) {
                                        var _history$state;

                                        // Make sure that the latest entry in the history state is our modal name
                                        // eslint-disable-next-line no-restricted-globals
                                        if (
                                            (_history$state = history.state) !=
                                                null &&
                                            _history$state[_this.modalName]
                                        ) {
                                            // Go back in history to clear out the entry we created (ultimately closing the modal)
                                            // eslint-disable-next-line no-restricted-globals
                                            history.back();
                                        }
                                    }
                                }

                                _this.uppy.emit("dashboard:modal-closed");

                                return promise;
                            };

                            this.isModalOpen = () => {
                                return !this.getPluginState().isHidden || false;
                            };

                            this.requestCloseModal = () => {
                                if (this.opts.onRequestCloseModal) {
                                    return this.opts.onRequestCloseModal();
                                }

                                return this.closeModal();
                            };

                            this.setDarkModeCapability = (isDarkModeOn) => {
                                const { capabilities } = this.uppy.getState();
                                this.uppy.setState({
                                    capabilities: {
                                        ...capabilities,
                                        darkMode: isDarkModeOn,
                                    },
                                });
                            };

                            this.handleSystemDarkModeChange = (event) => {
                                const isDarkModeOnNow = event.matches;
                                this.uppy.log(
                                    `[Dashboard] Dark mode is ${
                                        isDarkModeOnNow ? "on" : "off"
                                    }`
                                );
                                this.setDarkModeCapability(isDarkModeOnNow);
                            };

                            this.toggleFileCard = (show, fileID) => {
                                const file = this.uppy.getFile(fileID);

                                if (show) {
                                    this.uppy.emit(
                                        "dashboard:file-edit-start",
                                        file
                                    );
                                } else {
                                    this.uppy.emit(
                                        "dashboard:file-edit-complete",
                                        file
                                    );
                                }

                                this.setPluginState({
                                    fileCardFor: show ? fileID : null,
                                    activeOverlayType: show ? "FileCard" : null,
                                });
                            };

                            this.toggleAddFilesPanel = (show) => {
                                this.setPluginState({
                                    showAddFilesPanel: show,
                                    activeOverlayType: show ? "AddFiles" : null,
                                });
                            };

                            this.addFiles = (files) => {
                                const descriptors = files.map((file) => ({
                                    source: this.id,
                                    name: file.name,
                                    type: file.type,
                                    data: file,
                                    meta: {
                                        // path of the file relative to the ancestor directory the user selected.
                                        // e.g. 'docs/Old Prague/airbnb.pdf'
                                        relativePath: file.relativePath || null,
                                    },
                                }));

                                try {
                                    this.uppy.addFiles(descriptors);
                                } catch (err) {
                                    this.uppy.log(err);
                                }
                            };

                            this.startListeningToResize = () => {
                                // Watch for Dashboard container (`.uppy-Dashboard-inner`) resize
                                // and update containerWidth/containerHeight in plugin state accordingly.
                                // Emits first event on initialization.
                                this.resizeObserver = new ResizeObserver(
                                    (entries) => {
                                        const uppyDashboardInnerEl = entries[0];
                                        const { width, height } =
                                            uppyDashboardInnerEl.contentRect;
                                        this.uppy.log(
                                            `[Dashboard] resized: ${width} / ${height}`,
                                            "debug"
                                        );
                                        this.setPluginState({
                                            containerWidth: width,
                                            containerHeight: height,
                                            areInsidesReadyToBeVisible: true,
                                        });
                                    }
                                );
                                this.resizeObserver.observe(
                                    this.el.querySelector(
                                        ".uppy-Dashboard-inner"
                                    )
                                ); // If ResizeObserver fails to emit an event telling us what size to use - default to the mobile view

                                this.makeDashboardInsidesVisibleAnywayTimeout =
                                    setTimeout(() => {
                                        const pluginState =
                                            this.getPluginState();
                                        const isModalAndClosed =
                                            !this.opts.inline &&
                                            pluginState.isHidden;

                                        if (
                                            // if ResizeObserver hasn't yet fired,
                                            !pluginState.areInsidesReadyToBeVisible && // and it's not due to the modal being closed
                                            !isModalAndClosed
                                        ) {
                                            this.uppy.log(
                                                "[Dashboard] resize event didn't fire on time: defaulted to mobile layout",
                                                "debug"
                                            );
                                            this.setPluginState({
                                                areInsidesReadyToBeVisible: true,
                                            });
                                        }
                                    }, 1000);
                            };

                            this.stopListeningToResize = () => {
                                this.resizeObserver.disconnect();
                                clearTimeout(
                                    this
                                        .makeDashboardInsidesVisibleAnywayTimeout
                                );
                            };

                            this.recordIfFocusedOnUppyRecently = (event) => {
                                if (this.el.contains(event.target)) {
                                    this.ifFocusedOnUppyRecently = true;
                                } else {
                                    this.ifFocusedOnUppyRecently = false; // ___Why run this.superFocus.cancel here when it already runs in superFocusOnEachUpdate?
                                    //    Because superFocus is debounced, when we move from Uppy to some other element on the page,
                                    //    previously run superFocus sometimes hits and moves focus back to Uppy.

                                    this.superFocus.cancel();
                                }
                            };

                            this.disableAllFocusableElements = (disable) => {
                                const focusableNodes = toArray(
                                    this.el.querySelectorAll(FOCUSABLE_ELEMENTS)
                                );

                                if (disable) {
                                    focusableNodes.forEach((node) => {
                                        // save previous tabindex in a data-attribute, to restore when enabling
                                        const currentTabIndex =
                                            node.getAttribute("tabindex");

                                        if (currentTabIndex) {
                                            node.dataset.inertTabindex =
                                                currentTabIndex;
                                        }

                                        node.setAttribute("tabindex", "-1");
                                    });
                                } else {
                                    focusableNodes.forEach((node) => {
                                        if ("inertTabindex" in node.dataset) {
                                            node.setAttribute(
                                                "tabindex",
                                                node.dataset.inertTabindex
                                            );
                                        } else {
                                            node.removeAttribute("tabindex");
                                        }
                                    });
                                }

                                this.dashboardIsDisabled = disable;
                            };

                            this.updateBrowserHistory = () => {
                                var _history$state2;

                                // Ensure history state does not already contain our modal name to avoid double-pushing
                                // eslint-disable-next-line no-restricted-globals
                                if (
                                    !(
                                        (_history$state2 = history.state) !=
                                            null &&
                                        _history$state2[this.modalName]
                                    )
                                ) {
                                    // Push to history so that the page is not lost on browser back button press
                                    // eslint-disable-next-line no-restricted-globals
                                    history.pushState(
                                        {
                                            // eslint-disable-next-line no-restricted-globals
                                            ...history.state,
                                            [this.modalName]: true,
                                        },
                                        ""
                                    );
                                } // Listen for back button presses

                                window.addEventListener(
                                    "popstate",
                                    this.handlePopState,
                                    false
                                );
                            };

                            this.handlePopState = (event) => {
                                var _event$state;

                                // Close the modal if the history state no longer contains our modal name
                                if (
                                    this.isModalOpen() &&
                                    (!event.state ||
                                        !event.state[this.modalName])
                                ) {
                                    this.closeModal({
                                        manualClose: false,
                                    });
                                } // When the browser back button is pressed and uppy is now the latest entry
                                // in the history but the modal is closed, fix the history by removing the
                                // uppy history entry.
                                // This occurs when another entry is added into the history state while the
                                // modal is open, and then the modal gets manually closed.
                                // Solves PR #575 (https://github.com/transloadit/uppy/pull/575)

                                if (
                                    !this.isModalOpen() &&
                                    (_event$state = event.state) != null &&
                                    _event$state[this.modalName]
                                ) {
                                    // eslint-disable-next-line no-restricted-globals
                                    history.back();
                                }
                            };

                            this.handleKeyDownInModal = (event) => {
                                // close modal on esc key press
                                if (event.keyCode === ESC_KEY)
                                    this.requestCloseModal(event); // trap focus on tab key press

                                if (event.keyCode === TAB_KEY)
                                    trapFocus.forModal(
                                        event,
                                        this.getPluginState().activeOverlayType,
                                        this.el
                                    );
                            };

                            this.handleClickOutside = () => {
                                if (this.opts.closeModalOnClickOutside)
                                    this.requestCloseModal();
                            };

                            this.handlePaste = (event) => {
                                // Let any acquirer plugin (Url/Webcam/etc.) handle pastes to the root
                                this.uppy.iteratePlugins((plugin) => {
                                    if (plugin.type === "acquirer") {
                                        // Every Plugin with .type acquirer can define handleRootPaste(event)
                                        plugin.handleRootPaste == null
                                            ? void 0
                                            : plugin.handleRootPaste(event);
                                    }
                                }); // Add all dropped files

                                const files = toArray(
                                    event.clipboardData.files
                                );

                                if (files.length > 0) {
                                    this.uppy.log("[Dashboard] Files pasted");
                                    this.addFiles(files);
                                }
                            };

                            this.handleInputChange = (event) => {
                                event.preventDefault();
                                const files = toArray(event.target.files);

                                if (files.length > 0) {
                                    this.uppy.log(
                                        "[Dashboard] Files selected through input"
                                    );
                                    this.addFiles(files);
                                }
                            };

                            this.handleDragOver = (event) => {
                                var _this$opts$onDragOver, _this$opts;

                                event.preventDefault();
                                event.stopPropagation(); // Check if some plugin can handle the datatransfer without files —
                                // for instance, the Url plugin can import a url

                                const canSomePluginHandleRootDrop = () => {
                                    let somePluginCanHandleRootDrop = true;
                                    this.uppy.iteratePlugins((plugin) => {
                                        if (
                                            plugin.canHandleRootDrop != null &&
                                            plugin.canHandleRootDrop(event)
                                        ) {
                                            somePluginCanHandleRootDrop = true;
                                        }
                                    });
                                    return somePluginCanHandleRootDrop;
                                }; // Check if the "type" of the datatransfer object includes files

                                const doesEventHaveFiles = () => {
                                    const { types } = event.dataTransfer;
                                    return types.some(
                                        (type) => type === "Files"
                                    );
                                }; // Deny drop, if no plugins can handle datatransfer, there are no files,
                                // or when opts.disabled is set, or new uploads are not allowed

                                const somePluginCanHandleRootDrop =
                                    canSomePluginHandleRootDrop(event);
                                const hasFiles = doesEventHaveFiles(event);

                                if (
                                    (!somePluginCanHandleRootDrop &&
                                        !hasFiles) ||
                                    this.opts.disabled || // opts.disableLocalFiles should only be taken into account if no plugins
                                    // can handle the datatransfer
                                    (this.opts.disableLocalFiles &&
                                        (hasFiles ||
                                            !somePluginCanHandleRootDrop)) ||
                                    !this.uppy.getState().allowNewUpload
                                ) {
                                    event.dataTransfer.dropEffect = "none";
                                    clearTimeout(
                                        this.removeDragOverClassTimeout
                                    );
                                    return;
                                } // Add a small (+) icon on drop
                                // (and prevent browsers from interpreting this as files being _moved_ into the
                                // browser, https://github.com/transloadit/uppy/issues/1978).

                                event.dataTransfer.dropEffect = "copy";
                                clearTimeout(this.removeDragOverClassTimeout);
                                this.setPluginState({
                                    isDraggingOver: true,
                                });
                                (_this$opts$onDragOver = (_this$opts =
                                    this.opts).onDragOver) == null
                                    ? void 0
                                    : _this$opts$onDragOver.call(
                                          _this$opts,
                                          event
                                      );
                            };

                            this.handleDragLeave = (event) => {
                                var _this$opts$onDragLeav, _this$opts2;

                                event.preventDefault();
                                event.stopPropagation();
                                clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library.
                                // Solution with 'pointer-events: none' didn't work across browsers.

                                this.removeDragOverClassTimeout = setTimeout(
                                    () => {
                                        this.setPluginState({
                                            isDraggingOver: false,
                                        });
                                    },
                                    50
                                );
                                (_this$opts$onDragLeav = (_this$opts2 =
                                    this.opts).onDragLeave) == null
                                    ? void 0
                                    : _this$opts$onDragLeav.call(
                                          _this$opts2,
                                          event
                                      );
                            };

                            this.handleDrop = async (event) => {
                                var _this$opts$onDrop, _this$opts3;

                                event.preventDefault();
                                event.stopPropagation();
                                clearTimeout(this.removeDragOverClassTimeout);
                                this.setPluginState({
                                    isDraggingOver: false,
                                }); // Let any acquirer plugin (Url/Webcam/etc.) handle drops to the root

                                this.uppy.iteratePlugins((plugin) => {
                                    if (plugin.type === "acquirer") {
                                        // Every Plugin with .type acquirer can define handleRootDrop(event)
                                        plugin.handleRootDrop == null
                                            ? void 0
                                            : plugin.handleRootDrop(event);
                                    }
                                }); // Add all dropped files

                                let executedDropErrorOnce = false;

                                const logDropError = (error) => {
                                    this.uppy.log(error, "error"); // In practice all drop errors are most likely the same,
                                    // so let's just show one to avoid overwhelming the user

                                    if (!executedDropErrorOnce) {
                                        this.uppy.info(error.message, "error");
                                        executedDropErrorOnce = true;
                                    }
                                }; // Add all dropped files

                                const files = await getDroppedFiles(
                                    event.dataTransfer,
                                    {
                                        logDropError,
                                    }
                                );

                                if (files.length > 0) {
                                    this.uppy.log("[Dashboard] Files dropped");
                                    this.addFiles(files);
                                }

                                (_this$opts$onDrop = (_this$opts3 = this.opts)
                                    .onDrop) == null
                                    ? void 0
                                    : _this$opts$onDrop.call(
                                          _this$opts3,
                                          event
                                      );
                            };

                            this.handleRequestThumbnail = (file) => {
                                if (!this.opts.waitForThumbnailsBeforeUpload) {
                                    this.uppy.emit("thumbnail:request", file);
                                }
                            };

                            this.handleCancelThumbnail = (file) => {
                                if (!this.opts.waitForThumbnailsBeforeUpload) {
                                    this.uppy.emit("thumbnail:cancel", file);
                                }
                            };

                            this.handleKeyDownInInline = (event) => {
                                // Trap focus on tab key press.
                                if (event.keyCode === TAB_KEY)
                                    trapFocus.forInline(
                                        event,
                                        this.getPluginState().activeOverlayType,
                                        this.el
                                    );
                            };

                            this.handlePasteOnBody = (event) => {
                                const isFocusInOverlay = this.el.contains(
                                    document.activeElement
                                );

                                if (isFocusInOverlay) {
                                    this.handlePaste(event);
                                }
                            };

                            this.handleComplete = (_ref) => {
                                let { failed } = _ref;

                                if (
                                    this.opts.closeAfterFinish &&
                                    failed.length === 0
                                ) {
                                    // All uploads are done
                                    this.requestCloseModal();
                                }
                            };

                            this.handleCancelRestore = () => {
                                this.uppy.emit("restore-canceled");
                            };

                            Object.defineProperty(
                                this,
                                _openFileEditorWhenFilesAdded,
                                {
                                    writable: true,
                                    value: (files) => {
                                        const firstFile = files[0];

                                        if (this.canEditFile(firstFile)) {
                                            this.openFileEditor(firstFile);
                                        }
                                    },
                                }
                            );

                            this.initEvents = () => {
                                // Modal open button
                                if (this.opts.trigger && !this.opts.inline) {
                                    const showModalTrigger = findAllDOMElements(
                                        this.opts.trigger
                                    );

                                    if (showModalTrigger) {
                                        showModalTrigger.forEach((trigger) =>
                                            trigger.addEventListener(
                                                "click",
                                                this.openModal
                                            )
                                        );
                                    } else {
                                        this.uppy.log(
                                            "Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself",
                                            "warning"
                                        );
                                    }
                                }

                                this.startListeningToResize();
                                document.addEventListener(
                                    "paste",
                                    this.handlePasteOnBody
                                );
                                this.uppy.on(
                                    "plugin-remove",
                                    this.removeTarget
                                );
                                this.uppy.on("file-added", this.hideAllPanels);
                                this.uppy.on(
                                    "dashboard:modal-closed",
                                    this.hideAllPanels
                                );
                                this.uppy.on(
                                    "file-editor:complete",
                                    this.hideAllPanels
                                );
                                this.uppy.on("complete", this.handleComplete); // ___Why fire on capture?
                                //    Because this.ifFocusedOnUppyRecently needs to change before onUpdate() fires.

                                document.addEventListener(
                                    "focus",
                                    this.recordIfFocusedOnUppyRecently,
                                    true
                                );
                                document.addEventListener(
                                    "click",
                                    this.recordIfFocusedOnUppyRecently,
                                    true
                                );

                                if (this.opts.inline) {
                                    this.el.addEventListener(
                                        "keydown",
                                        this.handleKeyDownInInline
                                    );
                                }

                                if (this.opts.autoOpenFileEditor) {
                                    this.uppy.on(
                                        "files-added",
                                        _classPrivateFieldLooseBase(
                                            this,
                                            _openFileEditorWhenFilesAdded
                                        )[_openFileEditorWhenFilesAdded]
                                    );
                                }
                            };

                            this.removeEvents = () => {
                                const showModalTrigger = findAllDOMElements(
                                    this.opts.trigger
                                );

                                if (!this.opts.inline && showModalTrigger) {
                                    showModalTrigger.forEach((trigger) =>
                                        trigger.removeEventListener(
                                            "click",
                                            this.openModal
                                        )
                                    );
                                }

                                this.stopListeningToResize();
                                document.removeEventListener(
                                    "paste",
                                    this.handlePasteOnBody
                                );
                                window.removeEventListener(
                                    "popstate",
                                    this.handlePopState,
                                    false
                                );
                                this.uppy.off(
                                    "plugin-remove",
                                    this.removeTarget
                                );
                                this.uppy.off("file-added", this.hideAllPanels);
                                this.uppy.off(
                                    "dashboard:modal-closed",
                                    this.hideAllPanels
                                );
                                this.uppy.off(
                                    "file-editor:complete",
                                    this.hideAllPanels
                                );
                                this.uppy.off("complete", this.handleComplete);
                                document.removeEventListener(
                                    "focus",
                                    this.recordIfFocusedOnUppyRecently
                                );
                                document.removeEventListener(
                                    "click",
                                    this.recordIfFocusedOnUppyRecently
                                );

                                if (this.opts.inline) {
                                    this.el.removeEventListener(
                                        "keydown",
                                        this.handleKeyDownInInline
                                    );
                                }

                                if (this.opts.autoOpenFileEditor) {
                                    this.uppy.off(
                                        "files-added",
                                        _classPrivateFieldLooseBase(
                                            this,
                                            _openFileEditorWhenFilesAdded
                                        )[_openFileEditorWhenFilesAdded]
                                    );
                                }
                            };

                            this.superFocusOnEachUpdate = () => {
                                const isFocusInUppy = this.el.contains(
                                    document.activeElement
                                ); // When focus is lost on the page (== focus is on body for most browsers, or focus is null for IE11)

                                const isFocusNowhere =
                                    document.activeElement === document.body ||
                                    document.activeElement === null;
                                const isInformerHidden =
                                    this.uppy.getState().info.length === 0;
                                const isModal = !this.opts.inline;

                                if (
                                    // If update is connected to showing the Informer - let the screen reader calmly read it.
                                    isInformerHidden && // If we are in a modal - always superfocus without concern for other elements
                                    // on the page (user is unlikely to want to interact with the rest of the page)
                                    (isModal || // If we are already inside of Uppy, or
                                        isFocusInUppy || // If we are not focused on anything BUT we have already, at least once, focused on uppy
                                        //   1. We focus when isFocusNowhere, because when the element we were focused
                                        //      on disappears (e.g. an overlay), - focus gets lost. If user is typing
                                        //      something somewhere else on the page, - focus won't be 'nowhere'.
                                        //   2. We only focus when focus is nowhere AND this.ifFocusedOnUppyRecently,
                                        //      to avoid focus jumps if we do something else on the page.
                                        //   [Practical check] Without '&& this.ifFocusedOnUppyRecently', in Safari, in inline mode,
                                        //                     when file is uploading, - navigate via tab to the checkbox,
                                        //                     try to press space multiple times. Focus will jump to Uppy.
                                        (isFocusNowhere &&
                                            this.ifFocusedOnUppyRecently))
                                ) {
                                    this.superFocus(
                                        this.el,
                                        this.getPluginState().activeOverlayType
                                    );
                                } else {
                                    this.superFocus.cancel();
                                }
                            };

                            this.afterUpdate = () => {
                                if (
                                    this.opts.disabled &&
                                    !this.dashboardIsDisabled
                                ) {
                                    this.disableAllFocusableElements(true);
                                    return;
                                }

                                if (
                                    !this.opts.disabled &&
                                    this.dashboardIsDisabled
                                ) {
                                    this.disableAllFocusableElements(false);
                                }

                                this.superFocusOnEachUpdate();
                            };

                            this.saveFileCard = (meta, fileID) => {
                                this.uppy.setFileMeta(fileID, meta);
                                this.toggleFileCard(false, fileID);
                            };

                            Object.defineProperty(
                                this,
                                _attachRenderFunctionToTarget,
                                {
                                    writable: true,
                                    value: (target) => {
                                        const plugin = this.uppy.getPlugin(
                                            target.id
                                        );
                                        return {
                                            ...target,
                                            icon:
                                                plugin.icon ||
                                                this.opts.defaultPickerIcon,
                                            render: plugin.render,
                                        };
                                    },
                                }
                            );
                            Object.defineProperty(this, _isTargetSupported, {
                                writable: true,
                                value: (target) => {
                                    const plugin = this.uppy.getPlugin(
                                        target.id
                                    ); // If the plugin does not provide a `supported` check, assume the plugin works everywhere.

                                    if (
                                        typeof plugin.isSupported !== "function"
                                    ) {
                                        return true;
                                    }

                                    return plugin.isSupported();
                                },
                            });
                            Object.defineProperty(this, _getAcquirers, {
                                writable: true,
                                value: memoize((targets) => {
                                    return targets
                                        .filter(
                                            (target) =>
                                                target.type === "acquirer" &&
                                                _classPrivateFieldLooseBase(
                                                    this,
                                                    _isTargetSupported
                                                )[_isTargetSupported](target)
                                        )
                                        .map(
                                            _classPrivateFieldLooseBase(
                                                this,
                                                _attachRenderFunctionToTarget
                                            )[_attachRenderFunctionToTarget]
                                        );
                                }),
                            });
                            Object.defineProperty(
                                this,
                                _getProgressIndicators,
                                {
                                    writable: true,
                                    value: memoize((targets) => {
                                        return targets
                                            .filter(
                                                (target) =>
                                                    target.type ===
                                                    "progressindicator"
                                            )
                                            .map(
                                                _classPrivateFieldLooseBase(
                                                    this,
                                                    _attachRenderFunctionToTarget
                                                )[_attachRenderFunctionToTarget]
                                            );
                                    }),
                                }
                            );
                            Object.defineProperty(this, _getEditors, {
                                writable: true,
                                value: memoize((targets) => {
                                    return targets
                                        .filter(
                                            (target) => target.type === "editor"
                                        )
                                        .map(
                                            _classPrivateFieldLooseBase(
                                                this,
                                                _attachRenderFunctionToTarget
                                            )[_attachRenderFunctionToTarget]
                                        );
                                }),
                            });

                            this.render = (state) => {
                                const pluginState = this.getPluginState();
                                const { files, capabilities, allowNewUpload } =
                                    state;
                                const {
                                    newFiles,
                                    uploadStartedFiles,
                                    completeFiles,
                                    erroredFiles,
                                    inProgressFiles,
                                    inProgressNotPausedFiles,
                                    processingFiles,
                                    isUploadStarted,
                                    isAllComplete,
                                    isAllErrored,
                                    isAllPaused,
                                } = this.uppy.getObjectOfFilesPerState();

                                const acquirers = _classPrivateFieldLooseBase(
                                    this,
                                    _getAcquirers
                                )[_getAcquirers](pluginState.targets);

                                const progressindicators =
                                    _classPrivateFieldLooseBase(
                                        this,
                                        _getProgressIndicators
                                    )[_getProgressIndicators](
                                        pluginState.targets
                                    );

                                const editors = _classPrivateFieldLooseBase(
                                    this,
                                    _getEditors
                                )[_getEditors](pluginState.targets);

                                let theme;

                                if (this.opts.theme === "auto") {
                                    theme = capabilities.darkMode
                                        ? "dark"
                                        : "light";
                                } else {
                                    theme = this.opts.theme;
                                }

                                if (
                                    ["files", "folders", "both"].indexOf(
                                        this.opts.fileManagerSelectionType
                                    ) < 0
                                ) {
                                    this.opts.fileManagerSelectionType =
                                        "files"; // eslint-disable-next-line no-console

                                    console.warn(
                                        `Unsupported option for "fileManagerSelectionType". Using default of "${this.opts.fileManagerSelectionType}".`
                                    );
                                }

                                return DashboardUI({
                                    state,
                                    isHidden: pluginState.isHidden,
                                    files,
                                    newFiles,
                                    uploadStartedFiles,
                                    completeFiles,
                                    erroredFiles,
                                    inProgressFiles,
                                    inProgressNotPausedFiles,
                                    processingFiles,
                                    isUploadStarted,
                                    isAllComplete,
                                    isAllErrored,
                                    isAllPaused,
                                    totalFileCount: Object.keys(files).length,
                                    totalProgress: state.totalProgress,
                                    allowNewUpload,
                                    acquirers,
                                    theme,
                                    disabled: this.opts.disabled,
                                    disableLocalFiles:
                                        this.opts.disableLocalFiles,
                                    direction: this.opts.direction,
                                    activePickerPanel:
                                        pluginState.activePickerPanel,
                                    showFileEditor: pluginState.showFileEditor,
                                    saveFileEditor: this.saveFileEditor,
                                    disableAllFocusableElements:
                                        this.disableAllFocusableElements,
                                    animateOpenClose:
                                        this.opts.animateOpenClose,
                                    isClosing: pluginState.isClosing,
                                    progressindicators,
                                    editors,
                                    autoProceed: this.uppy.opts.autoProceed,
                                    id: this.id,
                                    closeModal: this.requestCloseModal,
                                    handleClickOutside: this.handleClickOutside,
                                    handleInputChange: this.handleInputChange,
                                    handlePaste: this.handlePaste,
                                    inline: this.opts.inline,
                                    showPanel: this.showPanel,
                                    hideAllPanels: this.hideAllPanels,
                                    i18n: this.i18n,
                                    i18nArray: this.i18nArray,
                                    uppy: this.uppy,
                                    note: this.opts.note,
                                    recoveredState: state.recoveredState,
                                    metaFields: pluginState.metaFields,
                                    resumableUploads:
                                        capabilities.resumableUploads || false,
                                    individualCancellation:
                                        capabilities.individualCancellation,
                                    isMobileDevice: capabilities.isMobileDevice,
                                    fileCardFor: pluginState.fileCardFor,
                                    toggleFileCard: this.toggleFileCard,
                                    toggleAddFilesPanel:
                                        this.toggleAddFilesPanel,
                                    showAddFilesPanel:
                                        pluginState.showAddFilesPanel,
                                    saveFileCard: this.saveFileCard,
                                    openFileEditor: this.openFileEditor,
                                    canEditFile: this.canEditFile,
                                    width: this.opts.width,
                                    height: this.opts.height,
                                    showLinkToFileUploadResult:
                                        this.opts.showLinkToFileUploadResult,
                                    fileManagerSelectionType:
                                        this.opts.fileManagerSelectionType,
                                    proudlyDisplayPoweredByUppy:
                                        this.opts.proudlyDisplayPoweredByUppy,
                                    hideCancelButton:
                                        this.opts.hideCancelButton,
                                    hideRetryButton: this.opts.hideRetryButton,
                                    hidePauseResumeButton:
                                        this.opts.hidePauseResumeButton,
                                    showRemoveButtonAfterComplete:
                                        this.opts.showRemoveButtonAfterComplete,
                                    containerWidth: pluginState.containerWidth,
                                    containerHeight:
                                        pluginState.containerHeight,
                                    areInsidesReadyToBeVisible:
                                        pluginState.areInsidesReadyToBeVisible,
                                    isTargetDOMEl: this.isTargetDOMEl,
                                    parentElement: this.el,
                                    allowedFileTypes:
                                        this.uppy.opts.restrictions
                                            .allowedFileTypes,
                                    maxNumberOfFiles:
                                        this.uppy.opts.restrictions
                                            .maxNumberOfFiles,
                                    requiredMetaFields:
                                        this.uppy.opts.restrictions
                                            .requiredMetaFields,
                                    showSelectedFiles:
                                        this.opts.showSelectedFiles,
                                    handleCancelRestore:
                                        this.handleCancelRestore,
                                    handleRequestThumbnail:
                                        this.handleRequestThumbnail,
                                    handleCancelThumbnail:
                                        this.handleCancelThumbnail,
                                    // drag props
                                    isDraggingOver: pluginState.isDraggingOver,
                                    handleDragOver: this.handleDragOver,
                                    handleDragLeave: this.handleDragLeave,
                                    handleDrop: this.handleDrop,
                                });
                            };

                            this.discoverProviderPlugins = () => {
                                this.uppy.iteratePlugins((plugin) => {
                                    if (
                                        plugin &&
                                        !plugin.target &&
                                        plugin.opts &&
                                        plugin.opts.target === this.constructor
                                    ) {
                                        this.addTarget(plugin);
                                    }
                                });
                            };

                            this.install = () => {
                                // Set default state for Dashboard
                                this.setPluginState({
                                    isHidden: true,
                                    fileCardFor: null,
                                    activeOverlayType: null,
                                    showAddFilesPanel: false,
                                    activePickerPanel: false,
                                    showFileEditor: false,
                                    metaFields: this.opts.metaFields,
                                    targets: [],
                                    // We'll make them visible once .containerWidth is determined
                                    areInsidesReadyToBeVisible: false,
                                    isDraggingOver: false,
                                });
                                const { inline, closeAfterFinish } = this.opts;

                                if (inline && closeAfterFinish) {
                                    throw new Error(
                                        "[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option."
                                    );
                                }

                                const {
                                    allowMultipleUploads,
                                    allowMultipleUploadBatches,
                                } = this.uppy.opts;

                                if (
                                    (allowMultipleUploads ||
                                        allowMultipleUploadBatches) &&
                                    closeAfterFinish
                                ) {
                                    this.uppy.log(
                                        "[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploadBatches` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true",
                                        "warning"
                                    );
                                }

                                const { target } = this.opts;

                                if (target) {
                                    this.mount(target, this);
                                }

                                const plugins = this.opts.plugins || [];
                                plugins.forEach((pluginID) => {
                                    const plugin =
                                        this.uppy.getPlugin(pluginID);

                                    if (plugin) {
                                        plugin.mount(this, plugin);
                                    }
                                });

                                if (!this.opts.disableStatusBar) {
                                    this.uppy.use(StatusBar, {
                                        id: `${this.id}:StatusBar`,
                                        target: this,
                                        hideUploadButton:
                                            this.opts.hideUploadButton,
                                        hideRetryButton:
                                            this.opts.hideRetryButton,
                                        hidePauseResumeButton:
                                            this.opts.hidePauseResumeButton,
                                        hideCancelButton:
                                            this.opts.hideCancelButton,
                                        showProgressDetails:
                                            this.opts.showProgressDetails,
                                        hideAfterFinish:
                                            this.opts.hideProgressAfterFinish,
                                        locale: this.opts.locale,
                                        doneButtonHandler:
                                            this.opts.doneButtonHandler,
                                    });
                                }

                                if (!this.opts.disableInformer) {
                                    this.uppy.use(Informer, {
                                        id: `${this.id}:Informer`,
                                        target: this,
                                    });
                                }

                                if (!this.opts.disableThumbnailGenerator) {
                                    this.uppy.use(ThumbnailGenerator, {
                                        id: `${this.id}:ThumbnailGenerator`,
                                        thumbnailWidth:
                                            this.opts.thumbnailWidth,
                                        thumbnailHeight:
                                            this.opts.thumbnailHeight,
                                        thumbnailType: this.opts.thumbnailType,
                                        waitForThumbnailsBeforeUpload:
                                            this.opts
                                                .waitForThumbnailsBeforeUpload,
                                        // If we don't block on thumbnails, we can lazily generate them
                                        lazy: !this.opts
                                            .waitForThumbnailsBeforeUpload,
                                    });
                                } // Dark Mode / theme

                                this.darkModeMediaQuery =
                                    typeof window !== "undefined" &&
                                    window.matchMedia
                                        ? window.matchMedia(
                                              "(prefers-color-scheme: dark)"
                                          )
                                        : null;
                                const isDarkModeOnFromTheStart = this
                                    .darkModeMediaQuery
                                    ? this.darkModeMediaQuery.matches
                                    : false;
                                this.uppy.log(
                                    `[Dashboard] Dark mode is ${
                                        isDarkModeOnFromTheStart ? "on" : "off"
                                    }`
                                );
                                this.setDarkModeCapability(
                                    isDarkModeOnFromTheStart
                                );

                                if (this.opts.theme === "auto") {
                                    this.darkModeMediaQuery.addListener(
                                        this.handleSystemDarkModeChange
                                    );
                                }

                                this.discoverProviderPlugins();
                                this.initEvents();
                            };

                            this.uninstall = () => {
                                if (!this.opts.disableInformer) {
                                    const informer = this.uppy.getPlugin(
                                        `${this.id}:Informer`
                                    ); // Checking if this plugin exists, in case it was removed by uppy-core
                                    // before the Dashboard was.

                                    if (informer)
                                        this.uppy.removePlugin(informer);
                                }

                                if (!this.opts.disableStatusBar) {
                                    const statusBar = this.uppy.getPlugin(
                                        `${this.id}:StatusBar`
                                    );
                                    if (statusBar)
                                        this.uppy.removePlugin(statusBar);
                                }

                                if (!this.opts.disableThumbnailGenerator) {
                                    const thumbnail = this.uppy.getPlugin(
                                        `${this.id}:ThumbnailGenerator`
                                    );
                                    if (thumbnail)
                                        this.uppy.removePlugin(thumbnail);
                                }

                                const plugins = this.opts.plugins || [];
                                plugins.forEach((pluginID) => {
                                    const plugin =
                                        this.uppy.getPlugin(pluginID);
                                    if (plugin) plugin.unmount();
                                });

                                if (this.opts.theme === "auto") {
                                    this.darkModeMediaQuery.removeListener(
                                        this.handleSystemDarkModeChange
                                    );
                                }

                                this.unmount();
                                this.removeEvents();
                            };

                            this.id = this.opts.id || "Dashboard";
                            this.title = "Dashboard";
                            this.type = "orchestrator";
                            this.modalName = `uppy-Dashboard-${nanoid()}`;
                            this.defaultLocale = locale; // set default options

                            const defaultOptions = {
                                target: "body",
                                metaFields: [],
                                trigger: null,
                                inline: false,
                                width: 750,
                                height: 550,
                                thumbnailWidth: 280,
                                thumbnailType: "image/jpeg",
                                waitForThumbnailsBeforeUpload: false,
                                defaultPickerIcon,
                                showLinkToFileUploadResult: false,
                                showProgressDetails: false,
                                hideUploadButton: false,
                                hideCancelButton: false,
                                hideRetryButton: false,
                                hidePauseResumeButton: false,
                                hideProgressAfterFinish: false,
                                doneButtonHandler: () => {
                                    this.uppy.reset();
                                    this.requestCloseModal();
                                },
                                note: null,
                                closeModalOnClickOutside: false,
                                closeAfterFinish: false,
                                disableStatusBar: false,
                                disableInformer: false,
                                disableThumbnailGenerator: false,
                                disablePageScrollWhenModalOpen: true,
                                animateOpenClose: true,
                                fileManagerSelectionType: "files",
                                proudlyDisplayPoweredByUppy: true,
                                onRequestCloseModal: () => this.closeModal(),
                                showSelectedFiles: true,
                                showRemoveButtonAfterComplete: false,
                                browserBackButtonClose: false,
                                theme: "light",
                                autoOpenFileEditor: false,
                                disabled: false,
                                disableLocalFiles: false,
                            }; // merge default options with the ones set by user

                            this.opts = { ...defaultOptions, ..._opts };
                            this.i18nInit();
                            this.superFocus = createSuperFocus();
                            this.ifFocusedOnUppyRecently = false; // Timeouts

                            this.makeDashboardInsidesVisibleAnywayTimeout =
                                null;
                            this.removeDragOverClassTimeout = null;
                        }
                    }))),
                (_class.VERSION = "2.2.0"),
                _temp);

            /***/
        },

        /***/ 5233: /***/ function (module) {
            module.exports = {
                strings: {
                    // When `inline: false`, used as the screen reader label for the button that closes the modal.
                    closeModal: "Close Modal",
                    // Used as the screen reader label for the plus (+) button that shows the “Add more files” screen
                    addMoreFiles: "Add more files",
                    addingMoreFiles: "Adding more files",
                    // Used as the header for import panels, e.g., “Import from Google Drive”.
                    importFrom: "Import from %{name}",
                    // When `inline: false`, used as the screen reader label for the dashboard modal.
                    dashboardWindowTitle:
                        "Uppy Dashboard Window (Press escape to close)",
                    // When `inline: true`, used as the screen reader label for the dashboard area.
                    dashboardTitle: "Uppy Dashboard",
                    // Shown in the Informer when a link to a file was copied to the clipboard.
                    copyLinkToClipboardSuccess: "Link copied to clipboard.",
                    // Used when a link cannot be copied automatically — the user has to select the text from the
                    // input element below this string.
                    copyLinkToClipboardFallback: "Copy the URL below",
                    // Used as the hover title and screen reader label for buttons that copy a file link.
                    copyLink: "Copy link",
                    back: "Back",
                    // Used as the screen reader label for buttons that remove a file.
                    removeFile: "Remove file",
                    // Used as the screen reader label for buttons that open the metadata editor panel for a file.
                    editFile: "Edit file",
                    // Shown in the panel header for the metadata editor. Rendered as “Editing image.png”.
                    editing: "Editing %{file}",
                    // Used as the screen reader label for the button that saves metadata edits and returns to the
                    // file list view.
                    finishEditingFile: "Finish editing file",
                    saveChanges: "Save changes",
                    // Used as the label for the tab button that opens the system file selection dialog.
                    myDevice: "My Device",
                    dropHint: "Drop your files here",
                    // Used as the hover text and screen reader label for file progress indicators when
                    // they have been fully uploaded.
                    uploadComplete: "Upload complete",
                    uploadPaused: "Upload paused",
                    // Used as the hover text and screen reader label for the buttons to resume paused uploads.
                    resumeUpload: "Resume upload",
                    // Used as the hover text and screen reader label for the buttons to pause uploads.
                    pauseUpload: "Pause upload",
                    // Used as the hover text and screen reader label for the buttons to retry failed uploads.
                    retryUpload: "Retry upload",
                    // Used as the hover text and screen reader label for the buttons to cancel uploads.
                    cancelUpload: "Cancel upload",
                    // Used in a title, how many files are currently selected
                    xFilesSelected: {
                        0: "%{smart_count} file selected",
                        1: "%{smart_count} files selected",
                    },
                    uploadingXFiles: {
                        0: "Uploading %{smart_count} file",
                        1: "Uploading %{smart_count} files",
                    },
                    processingXFiles: {
                        0: "Processing %{smart_count} file",
                        1: "Processing %{smart_count} files",
                    },
                    // The "powered by Uppy" link at the bottom of the Dashboard.
                    poweredBy: "Powered by %{uppy}",
                    addMore: "Add more",
                    editFileWithFilename: "Edit file %{file}",
                    save: "Save",
                    cancel: "Cancel",
                    dropPasteFiles: "Drop files here or %{browseFiles}",
                    dropPasteFolders: "Drop files here or %{browseFolders}",
                    dropPasteBoth:
                        "Drop files here, %{browseFiles} or %{browseFolders}",
                    dropPasteImportFiles:
                        "Drop files here, %{browseFiles} or import from:",
                    dropPasteImportFolders:
                        "Drop files here, %{browseFolders} or import from:",
                    dropPasteImportBoth:
                        "Drop files here, %{browseFiles}, %{browseFolders} or import from:",
                    importFiles: "Import files from:",
                    browseFiles: "browse files",
                    browseFolders: "browse folders",
                    recoveredXFiles: {
                        0: "We could not fully recover 1 file. Please re-select it and resume the upload.",
                        1: "We could not fully recover %{smart_count} files. Please re-select them and resume the upload.",
                    },
                    recoveredAllFiles:
                        "We restored all files. You can now resume the upload.",
                    sessionRestored: "Session restored",
                    reSelect: "Re-select",
                    missingRequiredMetaFields: {
                        0: "Missing required meta field: %{fields}.",
                        1: "Missing required meta fields: %{fields}.",
                    },
                },
            };

            /***/
        },

        /***/ 818: /***/ function (module) {
            /**
             * Copies text to clipboard by creating an almost invisible textarea,
             * adding text there, then running execCommand('copy').
             * Falls back to prompt() when the easy way fails (hello, Safari!)
             * From http://stackoverflow.com/a/30810322
             *
             * @param {string} textToCopy
             * @param {string} fallbackString
             * @returns {Promise}
             */
            module.exports = function copyToClipboard(
                textToCopy,
                fallbackString
            ) {
                fallbackString = fallbackString || "Copy the URL below";
                return new Promise((resolve) => {
                    const textArea = document.createElement("textarea");
                    textArea.setAttribute("style", {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "2em",
                        height: "2em",
                        padding: 0,
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        background: "transparent",
                    });
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();

                    const magicCopyFailed = () => {
                        document.body.removeChild(textArea); // eslint-disable-next-line no-alert

                        window.prompt(fallbackString, textToCopy);
                        resolve();
                    };

                    try {
                        const successful = document.execCommand("copy");

                        if (!successful) {
                            return magicCopyFailed("copy command unavailable");
                        }

                        document.body.removeChild(textArea);
                        return resolve();
                    } catch (err) {
                        document.body.removeChild(textArea);
                        return magicCopyFailed(err);
                    }
                });
            };

            /***/
        },

        /***/ 6673: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const debounce = __webpack_require__(1296);

            const FOCUSABLE_ELEMENTS = __webpack_require__(9045);

            const getActiveOverlayEl = __webpack_require__(6470);
            /*
  Focuses on some element in the currently topmost overlay.

  1. If there are some [data-uppy-super-focusable] elements rendered already - focuses
     on the first superfocusable element, and leaves focus up to the control of
     a user (until currently focused element disappears from the screen [which
     can happen when overlay changes, or, e.g., when we click on a folder in googledrive]).
  2. If there are no [data-uppy-super-focusable] elements yet (or ever) - focuses
     on the first focusable element, but switches focus if superfocusable elements appear on next render.
*/

            module.exports = function createSuperFocus() {
                let lastFocusWasOnSuperFocusableEl = false;

                const superFocus = (dashboardEl, activeOverlayType) => {
                    const overlayEl = getActiveOverlayEl(
                        dashboardEl,
                        activeOverlayType
                    );
                    const isFocusInOverlay = overlayEl.contains(
                        document.activeElement
                    ); // If focus is already in the topmost overlay, AND on last update we focused on the superfocusable
                    // element - then leave focus up to the user.
                    // [Practical check] without this line, typing in the search input in googledrive overlay won't work.

                    if (isFocusInOverlay && lastFocusWasOnSuperFocusableEl)
                        return;
                    const superFocusableEl = overlayEl.querySelector(
                        "[data-uppy-super-focusable]"
                    ); // If we are already in the topmost overlay, AND there are no super focusable elements yet, - leave focus up to the user.
                    // [Practical check] without this line, if you are in an empty folder in google drive, and something's uploading in the
                    // bg, - focus will be jumping to Done all the time.

                    if (isFocusInOverlay && !superFocusableEl) return;

                    if (superFocusableEl) {
                        superFocusableEl.focus({
                            preventScroll: true,
                        });
                        lastFocusWasOnSuperFocusableEl = true;
                    } else {
                        const firstEl =
                            overlayEl.querySelector(FOCUSABLE_ELEMENTS);
                        firstEl == null
                            ? void 0
                            : firstEl.focus({
                                  preventScroll: true,
                              });
                        lastFocusWasOnSuperFocusableEl = false;
                    }
                }; // ___Why do we need to debounce?
                //    1. To deal with animations: overlay changes via animations, which results in the DOM updating AFTER plugin.update()
                //       already executed.
                //    [Practical check] without debounce, if we open the Url overlay, and click 'Done', Dashboard won't get focused again.
                //    [Practical check] if we delay 250ms instead of 260ms - IE11 won't get focused in same situation.
                //    2. Performance: there can be many state update()s in a second, and this function is called every time.

                return debounce(superFocus, 260);
            };

            /***/
        },

        /***/ 6470: /***/ function (module) {
            /**
             * @returns {HTMLElement} - either dashboard element, or the overlay that's most on top
             */
            module.exports = function getActiveOverlayEl(
                dashboardEl,
                activeOverlayType
            ) {
                if (activeOverlayType) {
                    const overlayEl = dashboardEl.querySelector(
                        `[data-uppy-paneltype="${activeOverlayType}"]`
                    ); // if an overlay is already mounted

                    if (overlayEl) return overlayEl;
                }

                return dashboardEl;
            };

            /***/
        },

        /***/ 1882: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { h } = __webpack_require__(6400);

            function iconImage() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        width: "25",
                        height: "25",
                        viewBox: "0 0 25 25",
                    },
                    h(
                        "g",
                        {
                            fill: "#686DE0",
                            fillRule: "evenodd",
                        },
                        h("path", {
                            d: "M5 7v10h15V7H5zm0-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z",
                            fillRule: "nonzero",
                        }),
                        h("path", {
                            d: "M6.35 17.172l4.994-5.026a.5.5 0 0 1 .707 0l2.16 2.16 3.505-3.505a.5.5 0 0 1 .707 0l2.336 2.31-.707.72-1.983-1.97-3.505 3.505a.5.5 0 0 1-.707 0l-2.16-2.159-3.938 3.939-1.409.026z",
                            fillRule: "nonzero",
                        }),
                        h("circle", {
                            cx: "7.5",
                            cy: "9.5",
                            r: "1.5",
                        })
                    )
                );
            }

            function iconAudio() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        className: "uppy-c-icon",
                        width: "25",
                        height: "25",
                        viewBox: "0 0 25 25",
                    },
                    h("path", {
                        d: "M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z",
                        fill: "#049BCF",
                        fillRule: "nonzero",
                    })
                );
            }

            function iconVideo() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        className: "uppy-c-icon",
                        width: "25",
                        height: "25",
                        viewBox: "0 0 25 25",
                    },
                    h("path", {
                        d: "M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z",
                        fill: "#19AF67",
                        fillRule: "nonzero",
                    })
                );
            }

            function iconPDF() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        className: "uppy-c-icon",
                        width: "25",
                        height: "25",
                        viewBox: "0 0 25 25",
                    },
                    h("path", {
                        d: "M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z",
                        fill: "#E2514A",
                        fillRule: "nonzero",
                    })
                );
            }

            function iconArchive() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        width: "25",
                        height: "25",
                        viewBox: "0 0 25 25",
                    },
                    h("path", {
                        d: "M10.45 2.05h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V2.55a.5.5 0 0 1 .5-.5zm2.05 1.024h1.05a.5.5 0 0 1 .5.5V3.6a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5v-.001zM10.45 0h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 3.074h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 1.024h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm-2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-1.656 3.074l-.82 5.946c.52.302 1.174.458 1.976.458.803 0 1.455-.156 1.975-.458l-.82-5.946h-2.311zm0-1.025h2.312c.512 0 .946.378 1.015.885l.82 5.946c.056.412-.142.817-.501 1.026-.686.398-1.515.597-2.49.597-.974 0-1.804-.199-2.49-.597a1.025 1.025 0 0 1-.5-1.026l.819-5.946c.07-.507.503-.885 1.015-.885zm.545 6.6a.5.5 0 0 1-.397-.561l.143-.999a.5.5 0 0 1 .495-.429h.74a.5.5 0 0 1 .495.43l.143.998a.5.5 0 0 1-.397.561c-.404.08-.819.08-1.222 0z",
                        fill: "#00C469",
                        fillRule: "nonzero",
                    })
                );
            }

            function iconFile() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        className: "uppy-c-icon",
                        width: "25",
                        height: "25",
                        viewBox: "0 0 25 25",
                    },
                    h(
                        "g",
                        {
                            fill: "#A7AFB7",
                            fillRule: "nonzero",
                        },
                        h("path", {
                            d: "M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z",
                        }),
                        h("path", {
                            d: "M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z",
                        })
                    )
                );
            }

            function iconText() {
                return h(
                    "svg",
                    {
                        "aria-hidden": "true",
                        focusable: "false",
                        className: "uppy-c-icon",
                        width: "25",
                        height: "25",
                        viewBox: "0 0 25 25",
                    },
                    h("path", {
                        d: "M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z",
                        fill: "#5A5E69",
                        fillRule: "nonzero",
                    })
                );
            }

            module.exports = function getIconByMime(fileType) {
                const defaultChoice = {
                    color: "#838999",
                    icon: iconFile(),
                };
                if (!fileType) return defaultChoice;
                const fileTypeGeneral = fileType.split("/")[0];
                const fileTypeSpecific = fileType.split("/")[1]; // Text

                if (fileTypeGeneral === "text") {
                    return {
                        color: "#5a5e69",
                        icon: iconText(),
                    };
                } // Image

                if (fileTypeGeneral === "image") {
                    return {
                        color: "#686de0",
                        icon: iconImage(),
                    };
                } // Audio

                if (fileTypeGeneral === "audio") {
                    return {
                        color: "#068dbb",
                        icon: iconAudio(),
                    };
                } // Video

                if (fileTypeGeneral === "video") {
                    return {
                        color: "#19af67",
                        icon: iconVideo(),
                    };
                } // PDF

                if (
                    fileTypeGeneral === "application" &&
                    fileTypeSpecific === "pdf"
                ) {
                    return {
                        color: "#e25149",
                        icon: iconPDF(),
                    };
                } // Archive

                const archiveTypes = [
                    "zip",
                    "x-7z-compressed",
                    "x-rar-compressed",
                    "x-tar",
                    "x-gzip",
                    "x-apple-diskimage",
                ];

                if (
                    fileTypeGeneral === "application" &&
                    archiveTypes.indexOf(fileTypeSpecific) !== -1
                ) {
                    return {
                        color: "#00C469",
                        icon: iconArchive(),
                    };
                }

                return defaultChoice;
            };

            /***/
        },

        /***/ 8805: /***/ function (module) {
            // ignore drop/paste events if they are not in input or textarea —
            // otherwise when Url plugin adds drop/paste listeners to this.el,
            // draging UI elements or pasting anything into any field triggers those events —
            // Url treats them as URLs that need to be imported
            function ignoreEvent(ev) {
                const { tagName } = ev.target;

                if (tagName === "INPUT" || tagName === "TEXTAREA") {
                    ev.stopPropagation();
                    return;
                }

                ev.preventDefault();
                ev.stopPropagation();
            }

            module.exports = ignoreEvent;

            /***/
        },

        /***/ 3962: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const toArray = __webpack_require__(6361);

            const FOCUSABLE_ELEMENTS = __webpack_require__(9045);

            const getActiveOverlayEl = __webpack_require__(6470);

            function focusOnFirstNode(event, nodes) {
                const node = nodes[0];

                if (node) {
                    node.focus();
                    event.preventDefault();
                }
            }

            function focusOnLastNode(event, nodes) {
                const node = nodes[nodes.length - 1];

                if (node) {
                    node.focus();
                    event.preventDefault();
                }
            } // ___Why not just use (focusedItemIndex === -1)?
            //    Firefox thinks <ul> is focusable, but we don't have <ul>s in our FOCUSABLE_ELEMENTS. Which means that if we tab into
            //    the <ul>, code will think that we are not in the active overlay, and we should focusOnFirstNode() of the currently
            //    active overlay!
            //    [Practical check] if we use (focusedItemIndex === -1), instagram provider in firefox will never get focus on its pics
            //    in the <ul>.

            function isFocusInOverlay(activeOverlayEl) {
                return activeOverlayEl.contains(document.activeElement);
            }

            function trapFocus(event, activeOverlayType, dashboardEl) {
                const activeOverlayEl = getActiveOverlayEl(
                    dashboardEl,
                    activeOverlayType
                );
                const focusableNodes = toArray(
                    activeOverlayEl.querySelectorAll(FOCUSABLE_ELEMENTS)
                );
                const focusedItemIndex = focusableNodes.indexOf(
                    document.activeElement
                ); // If we pressed tab, and focus is not yet within the current overlay - focus on
                // the first element within the current overlay.
                // This is a safety measure (for when user returns from another tab e.g.), most
                // plugins will try to focus on some important element as it loads.

                if (!isFocusInOverlay(activeOverlayEl)) {
                    focusOnFirstNode(event, focusableNodes); // If we pressed shift + tab, and we're on the first element of a modal
                } else if (event.shiftKey && focusedItemIndex === 0) {
                    focusOnLastNode(event, focusableNodes); // If we pressed tab, and we're on the last element of the modal
                } else if (
                    !event.shiftKey &&
                    focusedItemIndex === focusableNodes.length - 1
                ) {
                    focusOnFirstNode(event, focusableNodes);
                }
            }

            module.exports = {
                // Traps focus inside of the currently open overlay (e.g. Dashboard, or e.g. Instagram),
                // never lets focus disappear from the modal.
                forModal: (event, activeOverlayType, dashboardEl) => {
                    trapFocus(event, activeOverlayType, dashboardEl);
                },
                // Traps focus inside of the currently open overlay, unless overlay is null - then let the user tab away.
                forInline: (event, activeOverlayType, dashboardEl) => {
                    // ___When we're in the bare 'Drop files here, paste, browse or import from' screen
                    if (activeOverlayType === null) {
                        // Do nothing and let the browser handle it, user can tab away from Uppy to other elements on the page
                        // ___When there is some overlay with 'Done' button
                    } else {
                        // Trap the focus inside this overlay!
                        // User can close the overlay (click 'Done') if they want to travel away from Uppy.
                        trapFocus(event, activeOverlayType, dashboardEl);
                    }
                },
            };

            /***/
        },

        /***/ 1623: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            const { h, Component, createRef } = __webpack_require__(6400);

            const TRANSITION_MS = 300;
            module.exports = class FadeIn extends Component {
                constructor() {
                    super(...arguments);
                    this.ref = createRef();
                }

                componentWillEnter(callback) {
                    this.ref.current.style.opacity = "1";
                    this.ref.current.style.transform = "none";
                    setTimeout(callback, TRANSITION_MS);
                }

                componentWillLeave(callback) {
                    this.ref.current.style.opacity = "0";
                    this.ref.current.style.transform = "translateY(350%)";
                    setTimeout(callback, TRANSITION_MS);
                }

                render() {
                    const { children } = this.props;
                    return h(
                        "div",
                        {
                            className: "uppy-Informer-animated",
                            ref: this.ref,
                        },
                        children
                    );
                }
            };

            /***/
        },

        /***/ 6455: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";
            /* eslint-disable */

            /**
             * @source https://github.com/developit/preact-transition-group
             */

            const { Component, cloneElement, h, toChildArray } =
                __webpack_require__(6400);

            function assign(obj, props) {
                return Object.assign(obj, props);
            }

            function getKey(vnode, fallback) {
                var _vnode$key;

                return (_vnode$key = vnode == null ? void 0 : vnode.key) != null
                    ? _vnode$key
                    : fallback;
            }

            function linkRef(component, name) {
                const cache =
                    component._ptgLinkedRefs || (component._ptgLinkedRefs = {});
                return (
                    cache[name] ||
                    (cache[name] = (c) => {
                        component.refs[name] = c;
                    })
                );
            }

            function getChildMapping(children) {
                const out = {};

                for (let i = 0; i < children.length; i++) {
                    if (children[i] != null) {
                        const key = getKey(children[i], i.toString(36));
                        out[key] = children[i];
                    }
                }

                return out;
            }

            function mergeChildMappings(prev, next) {
                prev = prev || {};
                next = next || {};

                const getValueForKey = (key) =>
                    next.hasOwnProperty(key) ? next[key] : prev[key]; // For each key of `next`, the list of keys to insert before that key in
                // the combined list

                const nextKeysPending = {};
                let pendingKeys = [];

                for (const prevKey in prev) {
                    if (next.hasOwnProperty(prevKey)) {
                        if (pendingKeys.length) {
                            nextKeysPending[prevKey] = pendingKeys;
                            pendingKeys = [];
                        }
                    } else {
                        pendingKeys.push(prevKey);
                    }
                }

                const childMapping = {};

                for (const nextKey in next) {
                    if (nextKeysPending.hasOwnProperty(nextKey)) {
                        for (
                            let i = 0;
                            i < nextKeysPending[nextKey].length;
                            i++
                        ) {
                            const pendingNextKey = nextKeysPending[nextKey][i];
                            childMapping[nextKeysPending[nextKey][i]] =
                                getValueForKey(pendingNextKey);
                        }
                    }

                    childMapping[nextKey] = getValueForKey(nextKey);
                } // Finally, add the keys which didn't appear before any key in `next`

                for (let i = 0; i < pendingKeys.length; i++) {
                    childMapping[pendingKeys[i]] = getValueForKey(
                        pendingKeys[i]
                    );
                }

                return childMapping;
            }

            const identity = (i) => i;

            class TransitionGroup extends Component {
                constructor(props, context) {
                    super(props, context);
                    this.refs = {};
                    this.state = {
                        children: getChildMapping(
                            toChildArray(toChildArray(this.props.children)) ||
                                []
                        ),
                    };
                    this.performAppear = this.performAppear.bind(this);
                    this.performEnter = this.performEnter.bind(this);
                    this.performLeave = this.performLeave.bind(this);
                }

                componentWillMount() {
                    this.currentlyTransitioningKeys = {};
                    this.keysToAbortLeave = [];
                    this.keysToEnter = [];
                    this.keysToLeave = [];
                }

                componentDidMount() {
                    const initialChildMapping = this.state.children;

                    for (const key in initialChildMapping) {
                        if (initialChildMapping[key]) {
                            // this.performAppear(getKey(initialChildMapping[key], key));
                            this.performAppear(key);
                        }
                    }
                }

                componentWillReceiveProps(nextProps) {
                    const nextChildMapping = getChildMapping(
                        toChildArray(nextProps.children) || []
                    );
                    const prevChildMapping = this.state.children;
                    this.setState((prevState) => ({
                        children: mergeChildMappings(
                            prevState.children,
                            nextChildMapping
                        ),
                    }));
                    let key;

                    for (key in nextChildMapping) {
                        if (nextChildMapping.hasOwnProperty(key)) {
                            const hasPrev =
                                prevChildMapping &&
                                prevChildMapping.hasOwnProperty(key); // We should re-enter the component and abort its leave function

                            if (
                                nextChildMapping[key] &&
                                hasPrev &&
                                this.currentlyTransitioningKeys[key]
                            ) {
                                this.keysToEnter.push(key);
                                this.keysToAbortLeave.push(key);
                            } else if (
                                nextChildMapping[key] &&
                                !hasPrev &&
                                !this.currentlyTransitioningKeys[key]
                            ) {
                                this.keysToEnter.push(key);
                            }
                        }
                    }

                    for (key in prevChildMapping) {
                        if (prevChildMapping.hasOwnProperty(key)) {
                            const hasNext =
                                nextChildMapping &&
                                nextChildMapping.hasOwnProperty(key);

                            if (
                                prevChildMapping[key] &&
                                !hasNext &&
                                !this.currentlyTransitioningKeys[key]
                            ) {
                                this.keysToLeave.push(key);
                            }
                        }
                    }
                }

                componentDidUpdate() {
                    const { keysToEnter } = this;
                    this.keysToEnter = [];
                    keysToEnter.forEach(this.performEnter);
                    const { keysToLeave } = this;
                    this.keysToLeave = [];
                    keysToLeave.forEach(this.performLeave);
                }

                _finishAbort(key) {
                    const idx = this.keysToAbortLeave.indexOf(key);

                    if (idx !== -1) {
                        this.keysToAbortLeave.splice(idx, 1);
                    }
                }

                performAppear(key) {
                    this.currentlyTransitioningKeys[key] = true;
                    const component = this.refs[key];

                    if (component.componentWillAppear) {
                        component.componentWillAppear(
                            this._handleDoneAppearing.bind(this, key)
                        );
                    } else {
                        this._handleDoneAppearing(key);
                    }
                }

                _handleDoneAppearing(key) {
                    const component = this.refs[key];

                    if (component.componentDidAppear) {
                        component.componentDidAppear();
                    }

                    delete this.currentlyTransitioningKeys[key];

                    this._finishAbort(key);

                    const currentChildMapping = getChildMapping(
                        toChildArray(this.props.children) || []
                    );

                    if (
                        !currentChildMapping ||
                        !currentChildMapping.hasOwnProperty(key)
                    ) {
                        // This was removed before it had fully appeared. Remove it.
                        this.performLeave(key);
                    }
                }

                performEnter(key) {
                    this.currentlyTransitioningKeys[key] = true;
                    const component = this.refs[key];

                    if (component.componentWillEnter) {
                        component.componentWillEnter(
                            this._handleDoneEntering.bind(this, key)
                        );
                    } else {
                        this._handleDoneEntering(key);
                    }
                }

                _handleDoneEntering(key) {
                    const component = this.refs[key];

                    if (component.componentDidEnter) {
                        component.componentDidEnter();
                    }

                    delete this.currentlyTransitioningKeys[key];

                    this._finishAbort(key);

                    const currentChildMapping = getChildMapping(
                        toChildArray(this.props.children) || []
                    );

                    if (
                        !currentChildMapping ||
                        !currentChildMapping.hasOwnProperty(key)
                    ) {
                        // This was removed before it had fully entered. Remove it.
                        this.performLeave(key);
                    }
                }

                performLeave(key) {
                    // If we should immediately abort this leave function,
                    // don't run the leave transition at all.
                    const idx = this.keysToAbortLeave.indexOf(key);

                    if (idx !== -1) {
                        return;
                    }

                    this.currentlyTransitioningKeys[key] = true;
                    const component = this.refs[key];

                    if (component.componentWillLeave) {
                        component.componentWillLeave(
                            this._handleDoneLeaving.bind(this, key)
                        );
                    } else {
                        // Note that this is somewhat dangerous b/c it calls setState()
                        // again, effectively mutating the component before all the work
                        // is done.
                        this._handleDoneLeaving(key);
                    }
                }

                _handleDoneLeaving(key) {
                    // If we should immediately abort the leave,
                    // then skip this altogether
                    const idx = this.keysToAbortLeave.indexOf(key);

                    if (idx !== -1) {
                        return;
                    }

                    const component = this.refs[key];

                    if (component.componentDidLeave) {
                        component.componentDidLeave();
                    }

                    delete this.currentlyTransitioningKeys[key];
                    const currentChildMapping = getChildMapping(
                        toChildArray(this.props.children) || []
                    );

                    if (
                        currentChildMapping &&
                        currentChildMapping.hasOwnProperty(key)
                    ) {
                        // This entered again before it fully left. Add it again.
                        this.performEnter(key);
                    } else {
                        const children = assign({}, this.state.children);
                        delete children[key];
                        this.setState({
                            children,
                        });
                    }
                }

                render(_ref, _ref2) {
                    let {
                        childFactory,
                        transitionLeave,
                        transitionName,
                        transitionAppear,
                        transitionEnter,
                        transitionLeaveTimeout,
                        transitionEnterTimeout,
                        transitionAppearTimeout,
                        component,
                        ...props
                    } = _ref;
                    let { children } = _ref2;
                    // TODO: we could get rid of the need for the wrapper node
                    // by cloning a single child
                    const childrenToRender = [];

                    for (const key in children) {
                        if (children.hasOwnProperty(key)) {
                            const child = children[key];

                            if (child) {
                                const ref = linkRef(this, key),
                                    el = cloneElement(childFactory(child), {
                                        ref,
                                        key,
                                    });
                                childrenToRender.push(el);
                            }
                        }
                    }

                    return h(component, props, childrenToRender);
                }
            }

            TransitionGroup.defaultProps = {
                component: "span",
                childFactory: identity,
            };
            module.exports = TransitionGroup;

            /***/
        },

        /***/ 873: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var _class, _temp;

            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions  */

            /* eslint-disable jsx-a11y/click-events-have-key-events */
            const { h } = __webpack_require__(6400);

            const { UIPlugin } = __webpack_require__(9429);

            const FadeIn = __webpack_require__(1623);

            const TransitionGroup = __webpack_require__(6455);
            /**
             * Informer
             * Shows rad message bubbles
             * used like this: `uppy.info('hello world', 'info', 5000)`
             * or for errors: `uppy.info('Error uploading img.jpg', 'error', 5000)`
             *
             */

            module.exports =
                ((_temp = _class =
                    class Informer extends UIPlugin {
                        // eslint-disable-next-line global-require
                        constructor(uppy, opts) {
                            super(uppy, opts);

                            this.render = (state) => {
                                return h(
                                    "div",
                                    {
                                        className: "uppy uppy-Informer",
                                    },
                                    h(
                                        TransitionGroup,
                                        null,
                                        state.info.map((info) =>
                                            h(
                                                FadeIn,
                                                {
                                                    key: info.message,
                                                },
                                                h(
                                                    "p",
                                                    {
                                                        role: "alert",
                                                    },
                                                    info.message,
                                                    " ",
                                                    info.details &&
                                                        h(
                                                            "span",
                                                            {
                                                                "aria-label":
                                                                    info.details,
                                                                "data-microtip-position":
                                                                    "top-left",
                                                                "data-microtip-size":
                                                                    "medium",
                                                                role: "tooltip", // eslint-disable-next-line no-alert
                                                                onClick: () =>
                                                                    alert(
                                                                        `${info.message} \n\n ${info.details}`
                                                                    ),
                                                            },
                                                            "?"
                                                        )
                                                )
                                            )
                                        )
                                    )
                                );
                            };

                            this.type = "progressindicator";
                            this.id = this.opts.id || "Informer";
                            this.title = "Informer"; // set default options

                            const defaultOptions = {}; // merge default options with the ones set by user

                            this.opts = { ...defaultOptions, ...opts };
                        }

                        install() {
                            const { target } = this.opts;

                            if (target) {
                                this.mount(target, this);
                            }
                        }
                    }),
                (_class.VERSION = "2.0.5"),
                _temp);

            /***/
        },

        /***/ 5033: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const React = __webpack_require__(7294);

            const DashboardPlugin = __webpack_require__(3014);

            const basePropTypes = __webpack_require__(6411).dashboard;

            const getHTMLProps = __webpack_require__(5716);

            const nonHtmlPropsHaveChanged = __webpack_require__(510);

            const h = React.createElement;
            /**
             * React Component that renders a Dashboard for an Uppy instance. This component
             * renders the Dashboard inline, so you can put it anywhere you want.
             */

            class Dashboard extends React.Component {
                componentDidMount() {
                    this.installPlugin();
                }

                componentDidUpdate(prevProps) {
                    if (prevProps.uppy !== this.props.uppy) {
                        this.uninstallPlugin(prevProps);
                        this.installPlugin();
                    } else if (nonHtmlPropsHaveChanged(this, prevProps)) {
                        const options = {
                            ...this.props,
                            target: this.container,
                        };
                        delete options.uppy;
                        this.plugin.setOptions(options);
                    }
                }

                componentWillUnmount() {
                    this.uninstallPlugin();
                }

                installPlugin() {
                    const { uppy } = this.props;
                    const options = {
                        id: "react:Dashboard",
                        ...this.props,
                        target: this.container,
                    };
                    delete options.uppy;
                    uppy.use(DashboardPlugin, options);
                    this.plugin = uppy.getPlugin(options.id);
                }

                uninstallPlugin(props) {
                    if (props === void 0) {
                        props = this.props;
                    }

                    const { uppy } = props;
                    uppy.removePlugin(this.plugin);
                }

                render() {
                    // TODO: stop exposing `validProps` as a public property and rename it to `htmlProps`
                    this.validProps = getHTMLProps(this.props);
                    return h("div", {
                        className: "uppy-Container",
                        ref: (container) => {
                            this.container = container;
                        },
                        ...this.validProps,
                    });
                }
            }

            Dashboard.propTypes = basePropTypes;
            Dashboard.defaultProps = {
                inline: true,
            };
            module.exports = Dashboard;

            /***/
        },

        /***/ 7624: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const React = __webpack_require__(7294);

            const PropTypes = __webpack_require__(5697);

            const DashboardPlugin = __webpack_require__(3014);

            const basePropTypes = __webpack_require__(6411).dashboard;

            const getHTMLProps = __webpack_require__(5716);

            const nonHtmlPropsHaveChanged = __webpack_require__(510);

            const h = React.createElement;
            /**
             * React Component that renders a Dashboard for an Uppy instance in a Modal
             * dialog. Visibility of the Modal is toggled using the `open` prop.
             */

            class DashboardModal extends React.Component {
                componentDidMount() {
                    this.installPlugin();
                }

                componentDidUpdate(prevProps) {
                    if (prevProps.uppy !== this.props.uppy) {
                        this.uninstallPlugin(prevProps);
                        this.installPlugin();
                    } else if (nonHtmlPropsHaveChanged(this, prevProps)) {
                        const options = {
                            ...this.props,
                            onRequestCloseModal: this.props.onRequestClose,
                        };
                        delete options.uppy;
                        this.plugin.setOptions(options);
                    }

                    if (prevProps.open && !this.props.open) {
                        this.plugin.closeModal();
                    } else if (!prevProps.open && this.props.open) {
                        this.plugin.openModal();
                    }
                }

                componentWillUnmount() {
                    this.uninstallPlugin();
                }

                installPlugin() {
                    const { uppy } = this.props;
                    const options = {
                        id: "react:DashboardModal",
                        ...this.props,
                        onRequestCloseModal: this.props.onRequestClose,
                    };

                    if (!options.target) {
                        options.target = this.container;
                    }

                    delete options.uppy;
                    uppy.use(DashboardPlugin, options);
                    this.plugin = uppy.getPlugin(options.id);

                    if (this.props.open) {
                        this.plugin.openModal();
                    }
                }

                uninstallPlugin(props) {
                    if (props === void 0) {
                        props = this.props;
                    }

                    const { uppy } = props;
                    uppy.removePlugin(this.plugin);
                }

                render() {
                    // TODO: stop exposing `validProps` as a public property and rename it to `htmlProps`
                    this.validProps = getHTMLProps(this.props);
                    return h("div", {
                        className: "uppy-Container",
                        ref: (container) => {
                            this.container = container;
                        },
                        ...this.validProps,
                    });
                }
            }

            DashboardModal.propTypes = {
                target:
                    typeof window !== "undefined"
                        ? PropTypes.instanceOf(window.HTMLElement)
                        : PropTypes.any,
                open: PropTypes.bool,
                onRequestClose: PropTypes.func,
                closeModalOnClickOutside: PropTypes.bool,
                disablePageScrollWhenModalOpen: PropTypes.bool,
                ...basePropTypes,
            };
            module.exports = DashboardModal;

            /***/
        },

        /***/ 7727: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const React = __webpack_require__(7294);

            const DragDropPlugin = __webpack_require__(4163);

            const propTypes = __webpack_require__(6411);

            const getHTMLProps = __webpack_require__(5716);

            const nonHtmlPropsHaveChanged = __webpack_require__(510);

            const h = React.createElement;
            /**
             * React component that renders an area in which files can be dropped to be
             * uploaded.
             */

            class DragDrop extends React.Component {
                componentDidMount() {
                    this.installPlugin();
                }

                componentDidUpdate(prevProps) {
                    if (prevProps.uppy !== this.props.uppy) {
                        this.uninstallPlugin(prevProps);
                        this.installPlugin();
                    } else if (nonHtmlPropsHaveChanged(this, prevProps)) {
                        const options = {
                            ...this.props,
                            target: this.container,
                        };
                        delete options.uppy;
                        this.plugin.setOptions(options);
                    }
                }

                componentWillUnmount() {
                    this.uninstallPlugin();
                }

                installPlugin() {
                    const { uppy } = this.props;
                    const options = {
                        id: "react:DragDrop",
                        ...this.props,
                        target: this.container,
                    };
                    delete options.uppy;
                    uppy.use(DragDropPlugin, options);
                    this.plugin = uppy.getPlugin(options.id);
                }

                uninstallPlugin(props) {
                    if (props === void 0) {
                        props = this.props;
                    }

                    const { uppy } = props;
                    uppy.removePlugin(this.plugin);
                }

                render() {
                    // TODO: stop exposing `validProps` as a public property and rename it to `htmlProps`
                    this.validProps = getHTMLProps(this.props);
                    return h("div", {
                        className: "uppy-Container",
                        ref: (container) => {
                            this.container = container;
                        },
                        ...this.validProps,
                    });
                }
            }

            DragDrop.propTypes = {
                uppy: propTypes.uppy,
                locale: propTypes.locale,
            };
            DragDrop.defaultProps = {};
            module.exports = DragDrop;

            /***/
        },

        /***/ 1189: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const PropTypes = __webpack_require__(5697);

            const React = __webpack_require__(7294);

            const FileInputPlugin = __webpack_require__(3993);

            const propTypes = __webpack_require__(6411);

            const h = React.createElement;
            /**
             * React component that renders an area in which files can be dropped to be
             * uploaded.
             */

            class FileInput extends React.Component {
                componentDidMount() {
                    this.installPlugin();
                }

                componentDidUpdate(prevProps) {
                    if (prevProps.uppy !== this.props.uppy) {
                        this.uninstallPlugin(prevProps);
                        this.installPlugin();
                    }
                }

                componentWillUnmount() {
                    this.uninstallPlugin();
                }

                installPlugin() {
                    const { uppy } = this.props;
                    const options = {
                        id: "react:FileInput",
                        ...this.props,
                        target: this.container,
                    };
                    delete options.uppy;
                    uppy.use(FileInputPlugin, options);
                    this.plugin = uppy.getPlugin(options.id);
                }

                uninstallPlugin(props) {
                    if (props === void 0) {
                        props = this.props;
                    }

                    const { uppy } = props;
                    uppy.removePlugin(this.plugin);
                }

                render() {
                    return h("div", {
                        className: "uppy-Container",
                        ref: (container) => {
                            this.container = container;
                        },
                    });
                }
            }

            FileInput.propTypes = {
                uppy: propTypes.uppy,
                locale: propTypes.locale,
                pretty: PropTypes.bool,
                inputName: PropTypes.string,
            };
            FileInput.defaultProps = {};
            module.exports = FileInput;

            /***/
        },

        /***/ 1810: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const React = __webpack_require__(7294);

            const PropTypes = __webpack_require__(5697);

            const ProgressBarPlugin = __webpack_require__(5117);

            const uppyPropType = __webpack_require__(6411).uppy;

            const getHTMLProps = __webpack_require__(5716);

            const nonHtmlPropsHaveChanged = __webpack_require__(510);

            const h = React.createElement;
            /**
             * React component that renders a progress bar at the top of the page.
             */

            class ProgressBar extends React.Component {
                componentDidMount() {
                    this.installPlugin();
                }

                componentDidUpdate(prevProps) {
                    if (prevProps.uppy !== this.props.uppy) {
                        this.uninstallPlugin(prevProps);
                        this.installPlugin();
                    } else if (nonHtmlPropsHaveChanged(this, prevProps)) {
                        const options = {
                            ...this.props,
                            target: this.container,
                        };
                        delete options.uppy;
                        this.plugin.setOptions(options);
                    }
                }

                componentWillUnmount() {
                    this.uninstallPlugin();
                }

                installPlugin() {
                    const { uppy } = this.props;
                    const options = {
                        id: "react:ProgressBar",
                        ...this.props,
                        target: this.container,
                    };
                    delete options.uppy;
                    uppy.use(ProgressBarPlugin, options);
                    this.plugin = uppy.getPlugin(options.id);
                }

                uninstallPlugin(props) {
                    if (props === void 0) {
                        props = this.props;
                    }

                    const { uppy } = props;
                    uppy.removePlugin(this.plugin);
                }

                render() {
                    // TODO: stop exposing `validProps` as a public property and rename it to `htmlProps`
                    this.validProps = getHTMLProps(this.props);
                    return h("div", {
                        className: "uppy-Container",
                        ref: (container) => {
                            this.container = container;
                        },
                        ...this.validProps,
                    });
                }
            }

            ProgressBar.propTypes = {
                uppy: uppyPropType,
                fixed: PropTypes.bool,
                hideAfterFinish: PropTypes.bool,
            };
            ProgressBar.defaultProps = {};
            module.exports = ProgressBar;

            /***/
        },

        /***/ 7026: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const React = __webpack_require__(7294);

            const PropTypes = __webpack_require__(5697);

            const StatusBarPlugin = __webpack_require__(2310);

            const uppyPropType = __webpack_require__(6411).uppy;

            const getHTMLProps = __webpack_require__(5716);

            const nonHtmlPropsHaveChanged = __webpack_require__(510);

            const h = React.createElement;
            /**
             * React component that renders a status bar containing upload progress and speed,
             * processing progress and pause/resume/cancel controls.
             */

            class StatusBar extends React.Component {
                componentDidMount() {
                    this.installPlugin();
                }

                componentDidUpdate(prevProps) {
                    if (prevProps.uppy !== this.props.uppy) {
                        this.uninstallPlugin(prevProps);
                        this.installPlugin();
                    } else if (nonHtmlPropsHaveChanged(this, prevProps)) {
                        const options = {
                            ...this.props,
                            target: this.container,
                        };
                        delete options.uppy;
                        this.plugin.setOptions(options);
                    }
                }

                componentWillUnmount() {
                    this.uninstallPlugin();
                }

                installPlugin() {
                    const { uppy } = this.props;
                    const options = {
                        id: "react:StatusBar",
                        ...this.props,
                        target: this.container,
                    };
                    delete options.uppy;
                    uppy.use(StatusBarPlugin, options);
                    this.plugin = uppy.getPlugin(options.id);
                }

                uninstallPlugin(props) {
                    if (props === void 0) {
                        props = this.props;
                    }

                    const { uppy } = props;
                    uppy.removePlugin(this.plugin);
                }

                render() {
                    // TODO: stop exposing `validProps` as a public property and rename it to `htmlProps`
                    this.validProps = getHTMLProps(this.props);
                    return h("div", {
                        className: "uppy-Container",
                        ref: (container) => {
                            this.container = container;
                        },
                        ...this.validProps,
                    });
                }
            }

            StatusBar.propTypes = {
                uppy: uppyPropType,
                hideAfterFinish: PropTypes.bool,
                showProgressDetails: PropTypes.bool,
            };
            StatusBar.defaultProps = {};
            module.exports = StatusBar;

            /***/
        },

        /***/ 5716: /***/ function (module) {
            // List taken from React.HTMLAttributes supported properties:
            // https://unpkg.com/@types/react@17.0.22/index.d.ts:1821
            const reactSupportedHtmlAttr = [
                // React-specific Attributes
                "defaultChecked",
                "defaultValue",
                "suppressContentEditableWarning",
                "suppressHydrationWarning",
                "dangerouslySetInnerHTML", // Standard HTML Attributes
                "accessKey",
                "className",
                "contentEditable",
                "contextMenu",
                "dir",
                "draggable",
                "hidden",
                "id",
                "lang",
                "placeholder",
                "slot",
                "spellCheck",
                "style",
                "tabIndex",
                "title",
                "translate", // Unknown
                "radioGroup", // WAI-ARIA
                "role", // RDFa Attributes
                "about",
                "datatype",
                "inlist",
                "prefix",
                "property",
                "resource",
                "typeof",
                "vocab", // Non-standard Attributes
                "autoCapitalize",
                "autoCorrect",
                "autoSave",
                "color",
                "itemProp",
                "itemScope",
                "itemType",
                "itemID",
                "itemRef",
                "results",
                "security",
                "unselectable", // Living Standard
                "inputMode",
                "is", // Clipboard Events
                "onCopy",
                "onCopyCapture",
                "onCut",
                "onCutCapture",
                "onPaste",
                "onPasteCapture", // Composition Events
                "onCompositionEnd",
                "onCompositionEndCapture",
                "onCompositionStart",
                "onCompositionStartCapture",
                "onCompositionUpdate",
                "onCompositionUpdateCapture", // Focus Events
                "onFocus",
                "onFocusCapture",
                "onBlur",
                "onBlurCapture", // Form Events
                "onChange",
                "onChangeCapture",
                "onBeforeInput",
                "onBeforeInputCapture",
                "onInput",
                "onInputCapture",
                "onReset",
                "onResetCapture",
                "onSubmit",
                "onSubmitCapture",
                "onInvalid",
                "onInvalidCapture", // Image Events
                "onLoad",
                "onLoadCapture",
                "onError", // also a Media Event
                "onErrorCapture", // also a Media Event
                // Keyboard Events
                "onKeyDown",
                "onKeyDownCapture",
                "onKeyPress",
                "onKeyPressCapture",
                "onKeyUp",
                "onKeyUpCapture", // Media Events
                "onAbort",
                "onAbortCapture",
                "onCanPlay",
                "onCanPlayCapture",
                "onCanPlayThrough",
                "onCanPlayThroughCapture",
                "onDurationChange",
                "onDurationChangeCapture",
                "onEmptied",
                "onEmptiedCapture",
                "onEncrypted",
                "onEncryptedCapture",
                "onEnded",
                "onEndedCapture",
                "onLoadedData",
                "onLoadedDataCapture",
                "onLoadedMetadata",
                "onLoadedMetadataCapture",
                "onLoadStart",
                "onLoadStartCapture",
                "onPause",
                "onPauseCapture",
                "onPlay",
                "onPlayCapture",
                "onPlaying",
                "onPlayingCapture",
                "onProgress",
                "onProgressCapture",
                "onRateChange",
                "onRateChangeCapture",
                "onSeeked",
                "onSeekedCapture",
                "onSeeking",
                "onSeekingCapture",
                "onStalled",
                "onStalledCapture",
                "onSuspend",
                "onSuspendCapture",
                "onTimeUpdate",
                "onTimeUpdateCapture",
                "onVolumeChange",
                "onVolumeChangeCapture",
                "onWaiting",
                "onWaitingCapture", // MouseEvents
                "onAuxClick",
                "onAuxClickCapture",
                "onClick",
                "onClickCapture",
                "onContextMenu",
                "onContextMenuCapture",
                "onDoubleClick",
                "onDoubleClickCapture",
                "onDrag",
                "onDragCapture",
                "onDragEnd",
                "onDragEndCapture",
                "onDragEnter",
                "onDragEnterCapture",
                "onDragExit",
                "onDragExitCapture",
                "onDragLeave",
                "onDragLeaveCapture",
                "onDragOver",
                "onDragOverCapture",
                "onDragStart",
                "onDragStartCapture",
                "onDrop",
                "onDropCapture",
                "onMouseDown",
                "onMouseDownCapture",
                "onMouseEnter",
                "onMouseLeave",
                "onMouseMove",
                "onMouseMoveCapture",
                "onMouseOut",
                "onMouseOutCapture",
                "onMouseOver",
                "onMouseOverCapture",
                "onMouseUp",
                "onMouseUpCapture", // Selection Events
                "onSelect",
                "onSelectCapture", // Touch Events
                "onTouchCancel",
                "onTouchCancelCapture",
                "onTouchEnd",
                "onTouchEndCapture",
                "onTouchMove",
                "onTouchMoveCapture",
                "onTouchStart",
                "onTouchStartCapture", // Pointer Events
                "onPointerDown",
                "onPointerDownCapture",
                "onPointerMove",
                "onPointerMoveCapture",
                "onPointerUp",
                "onPointerUpCapture",
                "onPointerCancel",
                "onPointerCancelCapture",
                "onPointerEnter",
                "onPointerEnterCapture",
                "onPointerLeave",
                "onPointerLeaveCapture",
                "onPointerOver",
                "onPointerOverCapture",
                "onPointerOut",
                "onPointerOutCapture",
                "onGotPointerCapture",
                "onGotPointerCaptureCapture",
                "onLostPointerCapture",
                "onLostPointerCaptureCapture", // UI Events
                "onScroll",
                "onScrollCapture", // Wheel Events
                "onWheel",
                "onWheelCapture", // Animation Events
                "onAnimationStart",
                "onAnimationStartCapture",
                "onAnimationEnd",
                "onAnimationEndCapture",
                "onAnimationIteration",
                "onAnimationIterationCapture", // Transition Events
                "onTransitionEnd",
                "onTransitionEndCapture",
            ];
            const validHTMLAttribute = /^(aria-|data-)/;

            const getHTMLProps = (props) => {
                // Gets all the React props
                return Object.fromEntries(
                    Object.entries(props).filter((_ref) => {
                        let [key] = _ref;
                        return (
                            validHTMLAttribute.test(key) ||
                            reactSupportedHtmlAttr.includes(key)
                        );
                    })
                );
            };

            module.exports = getHTMLProps;

            /***/
        },

        /***/ 510: /***/ function (module) {
            "use strict";
            // TODO: replace with `Object.hasOwn` when dropping support for older browsers.

            const hasOwn = (obj, key) =>
                Object.prototype.hasOwnProperty.call(obj, key);

            module.exports = function nonHtmlPropsHaveChanged(
                component,
                prevProps
            ) {
                return Object.keys(component.props) // TODO: replace `validProps` with an exported `Symbol('htmlProps')`.
                    .some(
                        (key) =>
                            !hasOwn(component.validProps, key) &&
                            component.props[key] !== prevProps[key]
                    );
            };

            /***/
        },

        /***/ 6411: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const PropTypes = __webpack_require__(5697);

            const UppyCore = __webpack_require__(9429).Uppy; // The `uppy` prop receives the Uppy core instance.

            const uppy = PropTypes.instanceOf(UppyCore).isRequired; // A list of plugins to mount inside this component.

            const plugins = PropTypes.arrayOf(PropTypes.string); // Language strings for this component.

            const locale = PropTypes.shape({
                strings: PropTypes.object,
                // eslint-disable-line react/forbid-prop-types
                pluralize: PropTypes.func,
            }); // List of meta fields for the editor in the Dashboard.

            const metaField = PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                placeholder: PropTypes.string,
            });
            const metaFields = PropTypes.oneOfType([
                PropTypes.arrayOf(metaField),
                PropTypes.func,
            ]); // A size in pixels (number) or with some other unit (string).

            const cssSize = PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]); // Common props for dashboardy components (Dashboard and DashboardModal).

            const dashboard = {
                uppy,
                inline: PropTypes.bool,
                plugins,
                width: cssSize,
                height: cssSize,
                showProgressDetails: PropTypes.bool,
                hideUploadButton: PropTypes.bool,
                hideProgressAfterFinish: PropTypes.bool,
                note: PropTypes.string,
                metaFields,
                proudlyDisplayPoweredByUppy: PropTypes.bool,
                disableStatusBar: PropTypes.bool,
                disableInformer: PropTypes.bool,
                disableThumbnailGenerator: PropTypes.bool,
                // pass-through to ThumbnailGenerator
                thumbnailWidth: PropTypes.number,
                locale,
            };
            module.exports = {
                uppy,
                locale,
                dashboard,
            };

            /***/
        },

        /***/ 8436: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const { useEffect, useRef } = __webpack_require__(7294);

            const UppyCore = __webpack_require__(9429).Uppy;

            module.exports = function useUppy(factory) {
                if (typeof factory !== "function") {
                    throw new TypeError(
                        "useUppy: expected a function that returns a new Uppy instance"
                    );
                }

                const uppy = useRef(undefined);

                if (uppy.current === undefined) {
                    uppy.current = factory();

                    if (!(uppy.current instanceof UppyCore)) {
                        throw new TypeError(
                            `useUppy: factory function must return an Uppy instance, got ${typeof uppy.current}`
                        );
                    }
                }

                useEffect(() => {
                    return () => {
                        uppy.current.close({
                            reason: "unmount",
                        });
                    };
                }, []);
                return uppy.current;
            };

            /***/
        },

        /***/ 6273: /***/ function (module) {
            "use strict";

            function _classPrivateFieldLooseBase(receiver, privateKey) {
                if (
                    !Object.prototype.hasOwnProperty.call(receiver, privateKey)
                ) {
                    throw new TypeError(
                        "attempted to use private field on non-instance"
                    );
                }
                return receiver;
            }

            var id = 0;

            function _classPrivateFieldLooseKey(name) {
                return "__private_" + id++ + "_" + name;
            }

            var _publish = /*#__PURE__*/ _classPrivateFieldLooseKey("publish");

            /**
             * Default store that keeps state in a simple object.
             */
            class DefaultStore {
                constructor() {
                    Object.defineProperty(this, _publish, {
                        value: _publish2,
                    });
                    this.state = {};
                    this.callbacks = [];
                }

                getState() {
                    return this.state;
                }

                setState(patch) {
                    const prevState = { ...this.state };
                    const nextState = { ...this.state, ...patch };
                    this.state = nextState;

                    _classPrivateFieldLooseBase(this, _publish)[_publish](
                        prevState,
                        nextState,
                        patch
                    );
                }

                subscribe(listener) {
                    this.callbacks.push(listener);
                    return () => {
                        // Remove the listener.
                        this.callbacks.splice(
                            this.callbacks.indexOf(listener),
                            1
                        );
                    };
                }
            }

            function _publish2() {
                for (
                    var _len = arguments.length,
                        args = new Array(_len),
                        _key = 0;
                    _key < _len;
                    _key++
                ) {
                    args[_key] = arguments[_key];
                }

                this.callbacks.forEach((listener) => {
                    listener(...args);
                });
            }

            DefaultStore.VERSION = "2.0.3";

            module.exports = function defaultStore() {
                return new DefaultStore();
            };

            /***/
        },

        /***/ 7753: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var _class, _temp;

            const { UIPlugin } = __webpack_require__(9429);

            const dataURItoBlob = __webpack_require__(3517);

            const isObjectURL = __webpack_require__(6508);

            const isPreviewSupported = __webpack_require__(9373);

            const { rotation } = __webpack_require__(1443);

            const locale = __webpack_require__(3107);
            /**
             * The Thumbnail Generator plugin
             */

            module.exports =
                ((_temp = _class =
                    class ThumbnailGenerator extends UIPlugin {
                        constructor(uppy, opts) {
                            super(uppy, opts);

                            this.onFileAdded = (file) => {
                                if (
                                    !file.preview &&
                                    file.data &&
                                    isPreviewSupported(file.type) &&
                                    !file.isRemote
                                ) {
                                    this.addToQueue(file.id);
                                }
                            };

                            this.onCancelRequest = (file) => {
                                const index = this.queue.indexOf(file.id);

                                if (index !== -1) {
                                    this.queue.splice(index, 1);
                                }
                            };

                            this.onFileRemoved = (file) => {
                                const index = this.queue.indexOf(file.id);

                                if (index !== -1) {
                                    this.queue.splice(index, 1);
                                } // Clean up object URLs.

                                if (file.preview && isObjectURL(file.preview)) {
                                    URL.revokeObjectURL(file.preview);
                                }
                            };

                            this.onRestored = () => {
                                const restoredFiles = this.uppy
                                    .getFiles()
                                    .filter((file) => file.isRestored);
                                restoredFiles.forEach((file) => {
                                    // Only add blob URLs; they are likely invalid after being restored.
                                    if (
                                        !file.preview ||
                                        isObjectURL(file.preview)
                                    ) {
                                        this.addToQueue(file.id);
                                    }
                                });
                            };

                            this.onAllFilesRemoved = () => {
                                this.queue = [];
                            };

                            this.waitUntilAllProcessed = (fileIDs) => {
                                fileIDs.forEach((fileID) => {
                                    const file = this.uppy.getFile(fileID);
                                    this.uppy.emit(
                                        "preprocess-progress",
                                        file,
                                        {
                                            mode: "indeterminate",
                                            message: this.i18n(
                                                "generatingThumbnails"
                                            ),
                                        }
                                    );
                                });

                                const emitPreprocessCompleteForAll = () => {
                                    fileIDs.forEach((fileID) => {
                                        const file = this.uppy.getFile(fileID);
                                        this.uppy.emit(
                                            "preprocess-complete",
                                            file
                                        );
                                    });
                                };

                                return new Promise((resolve) => {
                                    if (this.queueProcessing) {
                                        this.uppy.once(
                                            "thumbnail:all-generated",
                                            () => {
                                                emitPreprocessCompleteForAll();
                                                resolve();
                                            }
                                        );
                                    } else {
                                        emitPreprocessCompleteForAll();
                                        resolve();
                                    }
                                });
                            };

                            this.type = "modifier";
                            this.id = this.opts.id || "ThumbnailGenerator";
                            this.title = "Thumbnail Generator";
                            this.queue = [];
                            this.queueProcessing = false;
                            this.defaultThumbnailDimension = 200;
                            this.thumbnailType =
                                this.opts.thumbnailType || "image/jpeg";
                            this.defaultLocale = locale;
                            const defaultOptions = {
                                thumbnailWidth: null,
                                thumbnailHeight: null,
                                waitForThumbnailsBeforeUpload: false,
                                lazy: false,
                            };
                            this.opts = { ...defaultOptions, ...opts };
                            this.i18nInit();

                            if (
                                this.opts.lazy &&
                                this.opts.waitForThumbnailsBeforeUpload
                            ) {
                                throw new Error(
                                    "ThumbnailGenerator: The `lazy` and `waitForThumbnailsBeforeUpload` options are mutually exclusive. Please ensure at most one of them is set to `true`."
                                );
                            }
                        }
                        /**
                         * Create a thumbnail for the given Uppy file object.
                         *
                         * @param {{data: Blob}} file
                         * @param {number} targetWidth
                         * @param {number} targetHeight
                         * @returns {Promise}
                         */

                        createThumbnail(file, targetWidth, targetHeight) {
                            const originalUrl = URL.createObjectURL(file.data);
                            const onload = new Promise((resolve, reject) => {
                                const image = new Image();
                                image.src = originalUrl;
                                image.addEventListener("load", () => {
                                    URL.revokeObjectURL(originalUrl);
                                    resolve(image);
                                });
                                image.addEventListener("error", (event) => {
                                    URL.revokeObjectURL(originalUrl);
                                    reject(
                                        event.error ||
                                            new Error(
                                                "Could not create thumbnail"
                                            )
                                    );
                                });
                            });
                            const orientationPromise = rotation(
                                file.data
                            ).catch(() => 1);
                            return Promise.all([onload, orientationPromise])
                                .then((_ref) => {
                                    let [image, orientation] = _ref;
                                    const dimensions =
                                        this.getProportionalDimensions(
                                            image,
                                            targetWidth,
                                            targetHeight,
                                            orientation.deg
                                        );
                                    const rotatedImage = this.rotateImage(
                                        image,
                                        orientation
                                    );
                                    const resizedImage = this.resizeImage(
                                        rotatedImage,
                                        dimensions.width,
                                        dimensions.height
                                    );
                                    return this.canvasToBlob(
                                        resizedImage,
                                        this.thumbnailType,
                                        80
                                    );
                                })
                                .then((blob) => {
                                    return URL.createObjectURL(blob);
                                });
                        }
                        /**
                         * Get the new calculated dimensions for the given image and a target width
                         * or height. If both width and height are given, only width is taken into
                         * account. If neither width nor height are given, the default dimension
                         * is used.
                         */

                        getProportionalDimensions(
                            img,
                            width,
                            height,
                            rotation
                        ) {
                            let aspect = img.width / img.height;

                            if (rotation === 90 || rotation === 270) {
                                aspect = img.height / img.width;
                            }

                            if (width != null) {
                                return {
                                    width,
                                    height: Math.round(width / aspect),
                                };
                            }

                            if (height != null) {
                                return {
                                    width: Math.round(height * aspect),
                                    height,
                                };
                            }

                            return {
                                width: this.defaultThumbnailDimension,
                                height: Math.round(
                                    this.defaultThumbnailDimension / aspect
                                ),
                            };
                        }
                        /**
                         * Make sure the image doesn’t exceed browser/device canvas limits.
                         * For ios with 256 RAM and ie
                         */

                        protect(image) {
                            // https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
                            const ratio = image.width / image.height;
                            const maxSquare = 5000000; // ios max canvas square

                            const maxSize = 4096; // ie max canvas dimensions

                            let maxW = Math.floor(Math.sqrt(maxSquare * ratio));
                            let maxH = Math.floor(
                                maxSquare / Math.sqrt(maxSquare * ratio)
                            );

                            if (maxW > maxSize) {
                                maxW = maxSize;
                                maxH = Math.round(maxW / ratio);
                            }

                            if (maxH > maxSize) {
                                maxH = maxSize;
                                maxW = Math.round(ratio * maxH);
                            }

                            if (image.width > maxW) {
                                const canvas = document.createElement("canvas");
                                canvas.width = maxW;
                                canvas.height = maxH;
                                canvas
                                    .getContext("2d")
                                    .drawImage(image, 0, 0, maxW, maxH);
                                image = canvas;
                            }

                            return image;
                        }
                        /**
                         * Resize an image to the target `width` and `height`.
                         *
                         * Returns a Canvas with the resized image on it.
                         */

                        resizeImage(image, targetWidth, targetHeight) {
                            // Resizing in steps refactored to use a solution from
                            // https://blog.uploadcare.com/image-resize-in-browsers-is-broken-e38eed08df01
                            image = this.protect(image);
                            let steps = Math.ceil(
                                Math.log2(image.width / targetWidth)
                            );

                            if (steps < 1) {
                                steps = 1;
                            }

                            let sW = targetWidth * 2 ** (steps - 1);
                            let sH = targetHeight * 2 ** (steps - 1);
                            const x = 2;

                            while (steps--) {
                                const canvas = document.createElement("canvas");
                                canvas.width = sW;
                                canvas.height = sH;
                                canvas
                                    .getContext("2d")
                                    .drawImage(image, 0, 0, sW, sH);
                                image = canvas;
                                sW = Math.round(sW / x);
                                sH = Math.round(sH / x);
                            }

                            return image;
                        }

                        rotateImage(image, translate) {
                            let w = image.width;
                            let h = image.height;

                            if (translate.deg === 90 || translate.deg === 270) {
                                w = image.height;
                                h = image.width;
                            }

                            const canvas = document.createElement("canvas");
                            canvas.width = w;
                            canvas.height = h;
                            const context = canvas.getContext("2d");
                            context.translate(w / 2, h / 2);

                            if (translate.canvas) {
                                context.rotate(translate.rad);
                                context.scale(
                                    translate.scaleX,
                                    translate.scaleY
                                );
                            }

                            context.drawImage(
                                image,
                                -image.width / 2,
                                -image.height / 2,
                                image.width,
                                image.height
                            );
                            return canvas;
                        }
                        /**
                         * Save a <canvas> element's content to a Blob object.
                         *
                         * @param {HTMLCanvasElement} canvas
                         * @returns {Promise}
                         */

                        canvasToBlob(canvas, type, quality) {
                            try {
                                canvas
                                    .getContext("2d")
                                    .getImageData(0, 0, 1, 1);
                            } catch (err) {
                                if (err.code === 18) {
                                    return Promise.reject(
                                        new Error(
                                            "cannot read image, probably an svg with external resources"
                                        )
                                    );
                                }
                            }

                            if (canvas.toBlob) {
                                return new Promise((resolve) => {
                                    canvas.toBlob(resolve, type, quality);
                                }).then((blob) => {
                                    if (blob === null) {
                                        throw new Error(
                                            "cannot read image, probably an svg with external resources"
                                        );
                                    }

                                    return blob;
                                });
                            }

                            return Promise.resolve()
                                .then(() => {
                                    return dataURItoBlob(
                                        canvas.toDataURL(type, quality),
                                        {}
                                    );
                                })
                                .then((blob) => {
                                    if (blob === null) {
                                        throw new Error(
                                            "could not extract blob, probably an old browser"
                                        );
                                    }

                                    return blob;
                                });
                        }
                        /**
                         * Set the preview URL for a file.
                         */

                        setPreviewURL(fileID, preview) {
                            this.uppy.setFileState(fileID, {
                                preview,
                            });
                        }

                        addToQueue(item) {
                            this.queue.push(item);

                            if (this.queueProcessing === false) {
                                this.processQueue();
                            }
                        }

                        processQueue() {
                            this.queueProcessing = true;

                            if (this.queue.length > 0) {
                                const current = this.uppy.getFile(
                                    this.queue.shift()
                                );

                                if (!current) {
                                    this.uppy.log(
                                        "[ThumbnailGenerator] file was removed before a thumbnail could be generated, but not removed from the queue. This is probably a bug",
                                        "error"
                                    );
                                    return;
                                }

                                return this.requestThumbnail(current)
                                    .catch(() => {}) // eslint-disable-line node/handle-callback-err
                                    .then(() => this.processQueue());
                            }

                            this.queueProcessing = false;
                            this.uppy.log(
                                "[ThumbnailGenerator] Emptied thumbnail queue"
                            );
                            this.uppy.emit("thumbnail:all-generated");
                        }

                        requestThumbnail(file) {
                            if (
                                isPreviewSupported(file.type) &&
                                !file.isRemote
                            ) {
                                return this.createThumbnail(
                                    file,
                                    this.opts.thumbnailWidth,
                                    this.opts.thumbnailHeight
                                )
                                    .then((preview) => {
                                        this.setPreviewURL(file.id, preview);
                                        this.uppy.log(
                                            `[ThumbnailGenerator] Generated thumbnail for ${file.id}`
                                        );
                                        this.uppy.emit(
                                            "thumbnail:generated",
                                            this.uppy.getFile(file.id),
                                            preview
                                        );
                                    })
                                    .catch((err) => {
                                        this.uppy.log(
                                            `[ThumbnailGenerator] Failed thumbnail for ${file.id}:`,
                                            "warning"
                                        );
                                        this.uppy.log(err, "warning");
                                        this.uppy.emit(
                                            "thumbnail:error",
                                            this.uppy.getFile(file.id),
                                            err
                                        );
                                    });
                            }

                            return Promise.resolve();
                        }

                        install() {
                            this.uppy.on("file-removed", this.onFileRemoved);
                            this.uppy.on("cancel-all", this.onAllFilesRemoved);

                            if (this.opts.lazy) {
                                this.uppy.on(
                                    "thumbnail:request",
                                    this.onFileAdded
                                );
                                this.uppy.on(
                                    "thumbnail:cancel",
                                    this.onCancelRequest
                                );
                            } else {
                                this.uppy.on("file-added", this.onFileAdded);
                                this.uppy.on("restored", this.onRestored);
                            }

                            if (this.opts.waitForThumbnailsBeforeUpload) {
                                this.uppy.addPreProcessor(
                                    this.waitUntilAllProcessed
                                );
                            }
                        }

                        uninstall() {
                            this.uppy.off("file-removed", this.onFileRemoved);
                            this.uppy.off("cancel-all", this.onAllFilesRemoved);

                            if (this.opts.lazy) {
                                this.uppy.off(
                                    "thumbnail:request",
                                    this.onFileAdded
                                );
                                this.uppy.off(
                                    "thumbnail:cancel",
                                    this.onCancelRequest
                                );
                            } else {
                                this.uppy.off("file-added", this.onFileAdded);
                                this.uppy.off("restored", this.onRestored);
                            }

                            if (this.opts.waitForThumbnailsBeforeUpload) {
                                this.uppy.removePreProcessor(
                                    this.waitUntilAllProcessed
                                );
                            }
                        }
                    }),
                (_class.VERSION = "2.1.1"),
                _temp);

            /***/
        },

        /***/ 3107: /***/ function (module) {
            module.exports = {
                strings: {
                    generatingThumbnails: "Generating thumbnails...",
                },
            };

            /***/
        },

        /***/ 9045: /***/ function (module) {
            module.exports = [
                'a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
                'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
                "input:not([disabled]):not([inert]):not([aria-hidden])",
                "select:not([disabled]):not([inert]):not([aria-hidden])",
                "textarea:not([disabled]):not([inert]):not([aria-hidden])",
                "button:not([disabled]):not([inert]):not([aria-hidden])",
                'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
                'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
                'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
                '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
                '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
            ];

            /***/
        },

        /***/ 3363: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var _apply;

            function _classPrivateFieldLooseBase(receiver, privateKey) {
                if (
                    !Object.prototype.hasOwnProperty.call(receiver, privateKey)
                ) {
                    throw new TypeError(
                        "attempted to use private field on non-instance"
                    );
                }
                return receiver;
            }

            var id = 0;

            function _classPrivateFieldLooseKey(name) {
                return "__private_" + id++ + "_" + name;
            }

            const has = __webpack_require__(4114);

            function insertReplacement(source, rx, replacement) {
                const newParts = [];
                source.forEach((chunk) => {
                    // When the source contains multiple placeholders for interpolation,
                    // we should ignore chunks that are not strings, because those
                    // can be JSX objects and will be otherwise incorrectly turned into strings.
                    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
                    if (typeof chunk !== "string") {
                        return newParts.push(chunk);
                    }

                    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
                        if (raw !== "") {
                            newParts.push(raw);
                        } // Interlace with the `replacement` value

                        if (i < list.length - 1) {
                            newParts.push(replacement);
                        }
                    });
                });
                return newParts;
            }
            /**
             * Takes a string with placeholder variables like `%{smart_count} file selected`
             * and replaces it with values from options `{smart_count: 5}`
             *
             * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
             * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
             *
             * @param {string} phrase that needs interpolation, with placeholders
             * @param {object} options with values that will be used to replace placeholders
             * @returns {any[]} interpolated
             */

            function interpolate(phrase, options) {
                const dollarRegex = /\$/g;
                const dollarBillsYall = "$$$$";
                let interpolated = [phrase];
                if (options == null) return interpolated;

                for (const arg of Object.keys(options)) {
                    if (arg !== "_") {
                        // Ensure replacement value is escaped to prevent special $-prefixed
                        // regex replace tokens. the "$$$$" is needed because each "$" needs to
                        // be escaped with "$" itself, and we need two in the resulting output.
                        let replacement = options[arg];

                        if (typeof replacement === "string") {
                            replacement = dollarRegex[Symbol.replace](
                                replacement,
                                dollarBillsYall
                            );
                        } // We create a new `RegExp` each time instead of using a more-efficient
                        // string replace so that the same argument can be replaced multiple times
                        // in the same phrase.

                        interpolated = insertReplacement(
                            interpolated,
                            new RegExp(`%\\{${arg}\\}`, "g"),
                            replacement
                        );
                    }
                }

                return interpolated;
            }
            /**
             * Translates strings with interpolation & pluralization support.
             * Extensible with custom dictionaries and pluralization functions.
             *
             * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
             * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
             * and can be easily added among with dictionaries, nested objects are used for pluralization
             * as opposed to `||||` delimeter
             *
             * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
             */

            module.exports =
                ((_apply = /*#__PURE__*/ _classPrivateFieldLooseKey("apply")),
                class Translator {
                    /**
                     * @param {object|Array<object>} locales - locale or list of locales.
                     */
                    constructor(locales) {
                        Object.defineProperty(this, _apply, {
                            value: _apply2,
                        });
                        this.locale = {
                            strings: {},

                            pluralize(n) {
                                if (n === 1) {
                                    return 0;
                                }

                                return 1;
                            },
                        };

                        if (Array.isArray(locales)) {
                            locales.forEach(
                                _classPrivateFieldLooseBase(this, _apply)[
                                    _apply
                                ],
                                this
                            );
                        } else {
                            _classPrivateFieldLooseBase(this, _apply)[_apply](
                                locales
                            );
                        }
                    }

                    /**
                     * Public translate method
                     *
                     * @param {string} key
                     * @param {object} options with values that will be used later to replace placeholders in string
                     * @returns {string} translated (and interpolated)
                     */
                    translate(key, options) {
                        return this.translateArray(key, options).join("");
                    }
                    /**
                     * Get a translation and return the translated and interpolated parts as an array.
                     *
                     * @param {string} key
                     * @param {object} options with values that will be used to replace placeholders
                     * @returns {Array} The translated and interpolated parts, in order.
                     */

                    translateArray(key, options) {
                        if (!has(this.locale.strings, key)) {
                            throw new Error(`missing string: ${key}`);
                        }

                        const string = this.locale.strings[key];
                        const hasPluralForms = typeof string === "object";

                        if (hasPluralForms) {
                            if (
                                options &&
                                typeof options.smart_count !== "undefined"
                            ) {
                                const plural = this.locale.pluralize(
                                    options.smart_count
                                );
                                return interpolate(string[plural], options);
                            }

                            throw new Error(
                                "Attempted to use a string with plural forms, but no value was given for %{smart_count}"
                            );
                        }

                        return interpolate(string, options);
                    }
                });

            function _apply2(locale) {
                if (!(locale != null && locale.strings)) {
                    return;
                }

                const prevLocale = this.locale;
                this.locale = {
                    ...prevLocale,
                    strings: { ...prevLocale.strings, ...locale.strings },
                };
                this.locale.pluralize =
                    locale.pluralize || prevLocale.pluralize;
            }

            /***/
        },

        /***/ 3517: /***/ function (module) {
            const DATA_URL_PATTERN =
                /^data:([^/]+\/[^,;]+(?:[^,]*?))(;base64)?,([\s\S]*)$/;

            module.exports = function dataURItoBlob(dataURI, opts, toFile) {
                var _ref, _opts$mimeType;

                // get the base64 data
                const dataURIData = DATA_URL_PATTERN.exec(dataURI); // user may provide mime type, if not get it from data URI

                const mimeType =
                    (_ref =
                        (_opts$mimeType = opts.mimeType) != null
                            ? _opts$mimeType
                            : dataURIData == null
                            ? void 0
                            : dataURIData[1]) != null
                        ? _ref
                        : "plain/text";
                let data;

                if (dataURIData[2] != null) {
                    const binary = atob(decodeURIComponent(dataURIData[3]));
                    const bytes = new Uint8Array(binary.length);

                    for (let i = 0; i < binary.length; i++) {
                        bytes[i] = binary.charCodeAt(i);
                    }

                    data = [bytes];
                } else {
                    data = [decodeURIComponent(dataURIData[3])];
                } // Convert to a File?

                if (toFile) {
                    return new File(data, opts.name || "", {
                        type: mimeType,
                    });
                }

                return new Blob(data, {
                    type: mimeType,
                });
            };

            /***/
        },

        /***/ 1147: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const isDOMElement = __webpack_require__(5031);
            /**
             * Find one or more DOM elements.
             *
             * @param {string|Node} element
             * @returns {Node[]|null}
             */

            module.exports = function findAllDOMElements(element) {
                if (typeof element === "string") {
                    const elements = document.querySelectorAll(element);
                    return elements.length === 0 ? null : Array.from(elements);
                }

                if (typeof element === "object" && isDOMElement(element)) {
                    return [element];
                }

                return null;
            };

            /***/
        },

        /***/ 2729: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const isDOMElement = __webpack_require__(5031);
            /**
             * Find a DOM element.
             *
             * @param {Node|string} element
             * @returns {Node|null}
             */

            module.exports = function findDOMElement(element, context) {
                if (context === void 0) {
                    context = document;
                }

                if (typeof element === "string") {
                    return context.querySelector(element);
                }

                if (isDOMElement(element)) {
                    return element;
                }

                return null;
            };

            /***/
        },

        /***/ 8619: /***/ function (module) {
            function encodeCharacter(character) {
                return character.charCodeAt(0).toString(32);
            }

            function encodeFilename(name) {
                let suffix = "";
                return (
                    name.replace(/[^A-Z0-9]/gi, (character) => {
                        suffix += `-${encodeCharacter(character)}`;
                        return "/";
                    }) + suffix
                );
            }
            /**
             * Takes a file object and turns it into fileID, by converting file.name to lowercase,
             * removing extra characters and adding type, size and lastModified
             *
             * @param {object} file
             * @returns {string} the fileID
             */

            module.exports = function generateFileID(file) {
                // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
                // is slower! simple string concatenation is fast
                let id = "uppy";

                if (typeof file.name === "string") {
                    id += `-${encodeFilename(file.name.toLowerCase())}`;
                }

                if (file.type !== undefined) {
                    id += `-${file.type}`;
                }

                if (file.meta && typeof file.meta.relativePath === "string") {
                    id += `-${encodeFilename(
                        file.meta.relativePath.toLowerCase()
                    )}`;
                }

                if (file.data.size !== undefined) {
                    id += `-${file.data.size}`;
                }

                if (file.data.lastModified !== undefined) {
                    id += `-${file.data.lastModified}`;
                }

                return id;
            };

            /***/
        },

        /***/ 9599: /***/ function (module) {
            module.exports = function getBytesRemaining(fileProgress) {
                return fileProgress.bytesTotal - fileProgress.bytesUploaded;
            };

            /***/
        },

        /***/ 4031: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const webkitGetAsEntryApi = __webpack_require__(9324);

            const fallbackApi = __webpack_require__(180);
            /**
             * Returns a promise that resolves to the array of dropped files (if a folder is
             * dropped, and browser supports folder parsing - promise resolves to the flat
             * array of all files in all directories).
             * Each file has .relativePath prop appended to it (e.g. "/docs/Prague/ticket_from_prague_to_ufa.pdf")
             * if browser supports it. Otherwise it's undefined.
             *
             * @param {DataTransfer} dataTransfer
             * @param {Function} logDropError - a function that's called every time some
             * folder or some file error out (e.g. because of the folder name being too long
             * on Windows). Notice that resulting promise will always be resolved anyway.
             *
             * @returns {Promise} - Array<File>
             */

            module.exports = function getDroppedFiles(dataTransfer, _temp) {
                var _dataTransfer$items;

                let { logDropError = () => {} } = _temp === void 0 ? {} : _temp;

                // Get all files from all subdirs. Works (at least) in Chrome, Mozilla, and Safari
                if (
                    (_dataTransfer$items = dataTransfer.items) != null &&
                    _dataTransfer$items[0] &&
                    "webkitGetAsEntry" in dataTransfer.items[0]
                ) {
                    return webkitGetAsEntryApi(dataTransfer, logDropError); // Otherwise just return all first-order files
                }

                return fallbackApi(dataTransfer);
            };

            /***/
        },

        /***/ 180: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const toArray = __webpack_require__(6361); // .files fallback, should be implemented in any browser

            module.exports = function fallbackApi(dataTransfer) {
                const files = toArray(dataTransfer.files);
                return Promise.resolve(files);
            };

            /***/
        },

        /***/ 9083: /***/ function (module) {
            /**
             * Recursive function, calls the original callback() when the directory is entirely parsed.
             *
             * @param {FileSystemDirectoryReader} directoryReader
             * @param {Array} oldEntries
             * @param {Function} logDropError
             * @param {Function} callback - called with ([ all files and directories in that directoryReader ])
             */
            module.exports = function getFilesAndDirectoriesFromDirectory(
                directoryReader,
                oldEntries,
                logDropError,
                _ref
            ) {
                let { onSuccess } = _ref;
                directoryReader.readEntries(
                    (entries) => {
                        const newEntries = [...oldEntries, ...entries]; // According to the FileSystem API spec, getFilesAndDirectoriesFromDirectory()
                        // must be called until it calls the onSuccess with an empty array.

                        if (entries.length) {
                            setTimeout(() => {
                                getFilesAndDirectoriesFromDirectory(
                                    directoryReader,
                                    newEntries,
                                    logDropError,
                                    {
                                        onSuccess,
                                    }
                                );
                            }, 0); // Done iterating this particular directory
                        } else {
                            onSuccess(newEntries);
                        }
                    }, // Make sure we resolve on error anyway, it's fine if only one directory couldn't be parsed!
                    (error) => {
                        logDropError(error);
                        onSuccess(oldEntries);
                    }
                );
            };

            /***/
        },

        /***/ 2871: /***/ function (module) {
            /**
             * Get the relative path from the FileEntry#fullPath, because File#webkitRelativePath is always '', at least onDrop.
             *
             * @param {FileEntry} fileEntry
             *
             * @returns {string|null} - if file is not in a folder - return null (this is to
             * be consistent with .relativePath-s of files selected from My Device). If file
             * is in a folder - return its fullPath, e.g. '/simpsons/hi.jpeg'.
             */
            module.exports = function getRelativePath(fileEntry) {
                // fileEntry.fullPath - "/simpsons/hi.jpeg" or undefined (for browsers that don't support it)
                // fileEntry.name - "hi.jpeg"
                if (
                    !fileEntry.fullPath ||
                    fileEntry.fullPath === `/${fileEntry.name}`
                ) {
                    return null;
                }

                return fileEntry.fullPath;
            };

            /***/
        },

        /***/ 9324: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const toArray = __webpack_require__(6361);

            const getRelativePath = __webpack_require__(2871);

            const getFilesAndDirectoriesFromDirectory =
                __webpack_require__(9083);

            module.exports = function webkitGetAsEntryApi(
                dataTransfer,
                logDropError
            ) {
                const files = [];
                const rootPromises = [];
                /**
                 * Returns a resolved promise, when :files array is enhanced
                 *
                 * @param {(FileSystemFileEntry|FileSystemDirectoryEntry)} entry
                 * @returns {Promise} - empty promise that resolves when :files is enhanced with a file
                 */

                const createPromiseToAddFileOrParseDirectory = (entry) =>
                    new Promise((resolve) => {
                        // This is a base call
                        if (entry.isFile) {
                            // Creates a new File object which can be used to read the file.
                            entry.file(
                                (file) => {
                                    // eslint-disable-next-line no-param-reassign
                                    file.relativePath = getRelativePath(entry);
                                    files.push(file);
                                    resolve();
                                }, // Make sure we resolve on error anyway, it's fine if only one file couldn't be read!
                                (error) => {
                                    logDropError(error);
                                    resolve();
                                }
                            ); // This is a recursive call
                        } else if (entry.isDirectory) {
                            const directoryReader = entry.createReader();
                            getFilesAndDirectoriesFromDirectory(
                                directoryReader,
                                [],
                                logDropError,
                                {
                                    onSuccess: (entries) =>
                                        resolve(
                                            Promise.all(
                                                entries.map(
                                                    createPromiseToAddFileOrParseDirectory
                                                )
                                            )
                                        ),
                                }
                            );
                        }
                    }); // For each dropped item, - make sure it's a file/directory, and start deepening in!

                toArray(dataTransfer.items).forEach((item) => {
                    const entry = item.webkitGetAsEntry(); // :entry can be null when we drop the url e.g.

                    if (entry) {
                        rootPromises.push(
                            createPromiseToAddFileOrParseDirectory(entry)
                        );
                    }
                });
                return Promise.all(rootPromises).then(() => files);
            };

            /***/
        },

        /***/ 8744: /***/ function (module) {
            /**
             * Takes a full filename string and returns an object {name, extension}
             *
             * @param {string} fullFileName
             * @returns {object} {name, extension}
             */
            module.exports = function getFileNameAndExtension(fullFileName) {
                const lastDot = fullFileName.lastIndexOf("."); // these count as no extension: "no-dot", "trailing-dot."

                if (lastDot === -1 || lastDot === fullFileName.length - 1) {
                    return {
                        name: fullFileName,
                        extension: undefined,
                    };
                }

                return {
                    name: fullFileName.slice(0, lastDot),
                    extension: fullFileName.slice(lastDot + 1),
                };
            };

            /***/
        },

        /***/ 9404: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const getFileNameAndExtension = __webpack_require__(8744);

            const mimeTypes = __webpack_require__(5624);

            module.exports = function getFileType(file) {
                var _getFileNameAndExtens;

                if (file.type) return file.type;
                const fileExtension = file.name
                    ? (_getFileNameAndExtens = getFileNameAndExtension(
                          file.name
                      ).extension) == null
                        ? void 0
                        : _getFileNameAndExtens.toLowerCase()
                    : null;

                if (fileExtension && fileExtension in mimeTypes) {
                    // else, see if we can map extension to a mime type
                    return mimeTypes[fileExtension];
                } // if all fails, fall back to a generic byte stream type

                return "application/octet-stream";
            };

            /***/
        },

        /***/ 522: /***/ function (module) {
            module.exports = function getSpeed(fileProgress) {
                if (!fileProgress.bytesUploaded) return 0;
                const timeElapsed = Date.now() - fileProgress.uploadStarted;
                const uploadSpeed =
                    fileProgress.bytesUploaded / (timeElapsed / 1000);
                return uploadSpeed;
            };

            /***/
        },

        /***/ 8958: /***/ function (module) {
            /**
             * Get the declared text direction for an element.
             *
             * @param {Node} element
             * @returns {string|undefined}
             */
            function getTextDirection(element) {
                var _element;

                // There is another way to determine text direction using getComputedStyle(), as done here:
                // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
                //
                // We do not use that approach because we are interested specifically in the _declared_ text direction.
                // If no text direction is declared, we have to provide our own explicit text direction so our
                // bidirectional CSS style sheets work.
                while (element && !element.dir) {
                    // eslint-disable-next-line no-param-reassign
                    element = element.parentNode;
                }

                return (_element = element) == null ? void 0 : _element.dir;
            }

            module.exports = getTextDirection;

            /***/
        },

        /***/ 6770: /***/ function (module) {
            /**
             * Adds zero to strings shorter than two characters.
             *
             * @param {number} number
             * @returns {string}
             */
            function pad(number) {
                return number < 10 ? `0${number}` : number.toString();
            }
            /**
             * Returns a timestamp in the format of `hours:minutes:seconds`
             */

            module.exports = function getTimeStamp() {
                const date = new Date();
                const hours = pad(date.getHours());
                const minutes = pad(date.getMinutes());
                const seconds = pad(date.getSeconds());
                return `${hours}:${minutes}:${seconds}`;
            };

            /***/
        },

        /***/ 4114: /***/ function (module) {
            module.exports = function has(object, key) {
                return Object.prototype.hasOwnProperty.call(object, key);
            };

            /***/
        },

        /***/ 5031: /***/ function (module) {
            /**
             * Check if an object is a DOM element. Duck-typing based on `nodeType`.
             *
             * @param {*} obj
             */
            module.exports = function isDOMElement(obj) {
                return (
                    (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE
                );
            };

            /***/
        },

        /***/ 3754: /***/ function (module) {
            /**
             * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
             *
             * @returns {boolean}
             */
            module.exports = function isDragDropSupported() {
                const div = document.body;

                if (
                    !("draggable" in div) ||
                    !("ondragstart" in div && "ondrop" in div)
                ) {
                    return false;
                }

                if (!("FormData" in window)) {
                    return false;
                }

                if (!("FileReader" in window)) {
                    return false;
                }

                return true;
            };

            /***/
        },

        /***/ 6508: /***/ function (module) {
            /**
             * Check if a URL string is an object URL from `URL.createObjectURL`.
             *
             * @param {string} url
             * @returns {boolean}
             */
            module.exports = function isObjectURL(url) {
                return url.startsWith("blob:");
            };

            /***/
        },

        /***/ 9373: /***/ function (module) {
            module.exports = function isPreviewSupported(fileType) {
                if (!fileType) return false; // list of images that browsers can preview

                return /^[^/]+\/(jpe?g|gif|png|svg|svg\+xml|bmp|webp|avif)$/.test(
                    fileType
                );
            };

            /***/
        },

        /***/ 5624: /***/ function (module) {
            // ___Why not add the mime-types package?
            //    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
            // ___Where to take new extensions from?
            //    https://github.com/jshttp/mime-db/blob/master/db.json
            module.exports = {
                md: "text/markdown",
                markdown: "text/markdown",
                mp4: "video/mp4",
                mp3: "audio/mp3",
                svg: "image/svg+xml",
                jpg: "image/jpeg",
                png: "image/png",
                gif: "image/gif",
                heic: "image/heic",
                heif: "image/heif",
                yaml: "text/yaml",
                yml: "text/yaml",
                csv: "text/csv",
                tsv: "text/tab-separated-values",
                tab: "text/tab-separated-values",
                avi: "video/x-msvideo",
                mks: "video/x-matroska",
                mkv: "video/x-matroska",
                mov: "video/quicktime",
                dicom: "application/dicom",
                doc: "application/msword",
                docm: "application/vnd.ms-word.document.macroenabled.12",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                dot: "application/msword",
                dotm: "application/vnd.ms-word.template.macroenabled.12",
                dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
                xla: "application/vnd.ms-excel",
                xlam: "application/vnd.ms-excel.addin.macroenabled.12",
                xlc: "application/vnd.ms-excel",
                xlf: "application/x-xliff+xml",
                xlm: "application/vnd.ms-excel",
                xls: "application/vnd.ms-excel",
                xlsb: "application/vnd.ms-excel.sheet.binary.macroenabled.12",
                xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                xlt: "application/vnd.ms-excel",
                xltm: "application/vnd.ms-excel.template.macroenabled.12",
                xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
                xlw: "application/vnd.ms-excel",
                txt: "text/plain",
                text: "text/plain",
                conf: "text/plain",
                log: "text/plain",
                pdf: "application/pdf",
                zip: "application/zip",
                "7z": "application/x-7z-compressed",
                rar: "application/x-rar-compressed",
                tar: "application/x-tar",
                gz: "application/gzip",
                dmg: "application/x-apple-diskimage",
            };

            /***/
        },

        /***/ 1011: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            const secondsToTime = __webpack_require__(8920);

            module.exports = function prettyETA(seconds) {
                const time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
                // display minutes if hours is being displayed
                // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

                const hoursStr = time.hours === 0 ? "" : `${time.hours}h`;
                const minutesStr =
                    time.minutes === 0
                        ? ""
                        : `${
                              time.hours === 0
                                  ? time.minutes
                                  : ` ${time.minutes
                                        .toString(10)
                                        .padStart(2, "0")}`
                          }m`;
                const secondsStr =
                    time.hours !== 0
                        ? ""
                        : `${
                              time.minutes === 0
                                  ? time.seconds
                                  : ` ${time.seconds
                                        .toString(10)
                                        .padStart(2, "0")}`
                          }s`;
                return `${hoursStr}${minutesStr}${secondsStr}`;
            };

            /***/
        },

        /***/ 8920: /***/ function (module) {
            module.exports = function secondsToTime(rawSeconds) {
                const hours = Math.floor(rawSeconds / 3600) % 24;
                const minutes = Math.floor(rawSeconds / 60) % 60;
                const seconds = Math.floor(rawSeconds % 60);
                return {
                    hours,
                    minutes,
                    seconds,
                };
            };

            /***/
        },

        /***/ 6361: /***/ function (module) {
            /**
             * Converts list into array
             */
            module.exports = Array.from;

            /***/
        },

        /***/ 469: /***/ function (module) {
            /**
             * Truncates a string to the given number of chars (maxLength) by inserting '...' in the middle of that string.
             * Partially taken from https://stackoverflow.com/a/5723274/3192470.
             *
             * @param {string} string - string to be truncated
             * @param {number} maxLength - maximum size of the resulting string
             * @returns {string}
             */
            const separator = "...";

            module.exports = function truncateString(string, maxLength) {
                // Return the empty string if maxLength is zero
                if (maxLength === 0) return ""; // Return original string if it's already shorter than maxLength

                if (string.length <= maxLength) return string; // Return truncated substring appended of the ellipsis char if string can't be meaningfully truncated

                if (maxLength <= separator.length + 1)
                    return `${string.slice(0, maxLength - 1)}…`;
                const charsToShow = maxLength - separator.length;
                const frontChars = Math.ceil(charsToShow / 2);
                const backChars = Math.floor(charsToShow / 2);
                return (
                    string.slice(0, frontChars) +
                    separator +
                    string.slice(-backChars)
                );
            };

            /***/
        },

        /***/ 4184: /***/ function (module, exports) {
            var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; /*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
            /* global define */

            (function () {
                "use strict";

                var hasOwn = {}.hasOwnProperty;

                function classNames() {
                    var classes = [];

                    for (var i = 0; i < arguments.length; i++) {
                        var arg = arguments[i];
                        if (!arg) continue;

                        var argType = typeof arg;

                        if (argType === "string" || argType === "number") {
                            classes.push(arg);
                        } else if (Array.isArray(arg)) {
                            if (arg.length) {
                                var inner = classNames.apply(null, arg);
                                if (inner) {
                                    classes.push(inner);
                                }
                            }
                        } else if (argType === "object") {
                            if (arg.toString === Object.prototype.toString) {
                                for (var key in arg) {
                                    if (hasOwn.call(arg, key) && arg[key]) {
                                        classes.push(key);
                                    }
                                }
                            } else {
                                classes.push(arg.toString());
                            }
                        }
                    }

                    return classes.join(" ");
                }

                if (true && module.exports) {
                    classNames.default = classNames;
                    module.exports = classNames;
                } else if (true) {
                    // register as 'classnames', consistent with npm package name
                    !((__WEBPACK_AMD_DEFINE_ARRAY__ = []),
                    (__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                        return classNames;
                    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)),
                    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
                        (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                } else {
                }
            })();

            /***/
        },

        /***/ 1443: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            /* provided dependency */ var process = __webpack_require__(3454);
            /* provided dependency */ var Buffer =
                __webpack_require__(1876)["Buffer"];
            !(function (e, t) {
                true ? t(exports) : 0;
            })(this, function (e) {
                "use strict";
                function t(e, t, s) {
                    return (
                        t in e
                            ? Object.defineProperty(e, t, {
                                  value: s,
                                  enumerable: !0,
                                  configurable: !0,
                                  writable: !0,
                              })
                            : (e[t] = s),
                        e
                    );
                }
                var s =
                    "undefined" != typeof self ? self : __webpack_require__.g;
                const i = "undefined" != typeof navigator,
                    n = i && "undefined" == typeof HTMLImageElement,
                    r = !(
                        "undefined" == typeof __webpack_require__.g ||
                        "undefined" == typeof process ||
                        !process.versions ||
                        !process.versions.node
                    ),
                    a = s.Buffer,
                    h = !!a,
                    f = (e) => void 0 !== e;
                function l(e) {
                    return (
                        void 0 === e ||
                        (e instanceof Map
                            ? 0 === e.size
                            : 0 === Object.values(e).filter(f).length)
                    );
                }
                function o(e) {
                    let t = new Error(e);
                    throw (delete t.stack, t);
                }
                function u(e) {
                    let t = (function (e) {
                        let t = 0;
                        return (
                            e.ifd0.enabled && (t += 1024),
                            e.exif.enabled && (t += 2048),
                            e.makerNote && (t += 2048),
                            e.userComment && (t += 1024),
                            e.gps.enabled && (t += 512),
                            e.interop.enabled && (t += 100),
                            e.ifd1.enabled && (t += 1024),
                            t + 2048
                        );
                    })(e);
                    return (
                        e.jfif.enabled && (t += 50),
                        e.xmp.enabled && (t += 2e4),
                        e.iptc.enabled && (t += 14e3),
                        e.icc.enabled && (t += 6e3),
                        t
                    );
                }
                const d = (e) => String.fromCharCode.apply(null, e),
                    c =
                        "undefined" != typeof TextDecoder
                            ? new TextDecoder("utf-8")
                            : void 0;
                class p {
                    static from(e, t) {
                        return e instanceof this && e.le === t
                            ? e
                            : new p(e, void 0, void 0, t);
                    }
                    constructor(e, t = 0, s, i) {
                        if (
                            ("boolean" == typeof i && (this.le = i),
                            Array.isArray(e) && (e = new Uint8Array(e)),
                            0 === e)
                        )
                            (this.byteOffset = 0), (this.byteLength = 0);
                        else if (e instanceof ArrayBuffer) {
                            void 0 === s && (s = e.byteLength - t);
                            let i = new DataView(e, t, s);
                            this._swapDataView(i);
                        } else if (
                            e instanceof Uint8Array ||
                            e instanceof DataView ||
                            e instanceof p
                        ) {
                            void 0 === s && (s = e.byteLength - t),
                                (t += e.byteOffset) + s >
                                    e.byteOffset + e.byteLength &&
                                    o(
                                        "Creating view outside of available memory in ArrayBuffer"
                                    );
                            let i = new DataView(e.buffer, t, s);
                            this._swapDataView(i);
                        } else if ("number" == typeof e) {
                            let t = new DataView(new ArrayBuffer(e));
                            this._swapDataView(t);
                        } else o("Invalid input argument for BufferView: " + e);
                    }
                    _swapArrayBuffer(e) {
                        this._swapDataView(new DataView(e));
                    }
                    _swapBuffer(e) {
                        this._swapDataView(
                            new DataView(e.buffer, e.byteOffset, e.byteLength)
                        );
                    }
                    _swapDataView(e) {
                        (this.dataView = e),
                            (this.buffer = e.buffer),
                            (this.byteOffset = e.byteOffset),
                            (this.byteLength = e.byteLength);
                    }
                    _lengthToEnd(e) {
                        return this.byteLength - e;
                    }
                    set(e, t, s = p) {
                        return (
                            e instanceof DataView || e instanceof p
                                ? (e = new Uint8Array(
                                      e.buffer,
                                      e.byteOffset,
                                      e.byteLength
                                  ))
                                : e instanceof ArrayBuffer &&
                                  (e = new Uint8Array(e)),
                            e instanceof Uint8Array ||
                                o("BufferView.set(): Invalid data argument."),
                            this.toUint8().set(e, t),
                            new s(this, t, e.byteLength)
                        );
                    }
                    subarray(e, t) {
                        return (
                            (t = t || this._lengthToEnd(e)), new p(this, e, t)
                        );
                    }
                    toUint8() {
                        return new Uint8Array(
                            this.buffer,
                            this.byteOffset,
                            this.byteLength
                        );
                    }
                    getUint8Array(e, t) {
                        return new Uint8Array(
                            this.buffer,
                            this.byteOffset + e,
                            t
                        );
                    }
                    getString(e = 0, t = this.byteLength) {
                        let s = this.getUint8Array(e, t);
                        return (
                            (i = s),
                            c
                                ? c.decode(i)
                                : h
                                ? Buffer.from(i).toString("utf8")
                                : decodeURIComponent(escape(d(i)))
                        );
                        var i;
                    }
                    getLatin1String(e = 0, t = this.byteLength) {
                        let s = this.getUint8Array(e, t);
                        return d(s);
                    }
                    getUnicodeString(e = 0, t = this.byteLength) {
                        const s = [];
                        for (
                            let i = 0;
                            i < t && e + i < this.byteLength;
                            i += 2
                        )
                            s.push(this.getUint16(e + i));
                        return d(s);
                    }
                    getInt8(e) {
                        return this.dataView.getInt8(e);
                    }
                    getUint8(e) {
                        return this.dataView.getUint8(e);
                    }
                    getInt16(e, t = this.le) {
                        return this.dataView.getInt16(e, t);
                    }
                    getInt32(e, t = this.le) {
                        return this.dataView.getInt32(e, t);
                    }
                    getUint16(e, t = this.le) {
                        return this.dataView.getUint16(e, t);
                    }
                    getUint32(e, t = this.le) {
                        return this.dataView.getUint32(e, t);
                    }
                    getFloat32(e, t = this.le) {
                        return this.dataView.getFloat32(e, t);
                    }
                    getFloat64(e, t = this.le) {
                        return this.dataView.getFloat64(e, t);
                    }
                    getFloat(e, t = this.le) {
                        return this.dataView.getFloat32(e, t);
                    }
                    getDouble(e, t = this.le) {
                        return this.dataView.getFloat64(e, t);
                    }
                    getUintBytes(e, t, s) {
                        switch (t) {
                            case 1:
                                return this.getUint8(e, s);
                            case 2:
                                return this.getUint16(e, s);
                            case 4:
                                return this.getUint32(e, s);
                            case 8:
                                return this.getUint64 && this.getUint64(e, s);
                        }
                    }
                    getUint(e, t, s) {
                        switch (t) {
                            case 8:
                                return this.getUint8(e, s);
                            case 16:
                                return this.getUint16(e, s);
                            case 32:
                                return this.getUint32(e, s);
                            case 64:
                                return this.getUint64 && this.getUint64(e, s);
                        }
                    }
                    toString(e) {
                        return this.dataView.toString(e, this.constructor.name);
                    }
                    ensureChunk() {}
                }
                function g(e, t) {
                    o(
                        `${e} '${t}' was not loaded, try using full build of exifr.`
                    );
                }
                class m extends Map {
                    constructor(e) {
                        super(), (this.kind = e);
                    }
                    get(e, t) {
                        return (
                            this.has(e) || g(this.kind, e),
                            t &&
                                (e in t ||
                                    (function (e, t) {
                                        o(`Unknown ${e} '${t}'.`);
                                    })(this.kind, e),
                                t[e].enabled || g(this.kind, e)),
                            super.get(e)
                        );
                    }
                    keyList() {
                        return Array.from(this.keys());
                    }
                }
                var y = new m("file parser"),
                    b = new m("segment parser"),
                    w = new m("file reader");
                let k = s.fetch;
                const O = "Invalid input argument";
                function v(e, t) {
                    return (s = e).startsWith("data:") || s.length > 1e4
                        ? A(e, t, "base64")
                        : r && e.includes("://")
                        ? S(e, t, "url", U)
                        : r
                        ? A(e, t, "fs")
                        : i
                        ? S(e, t, "url", U)
                        : void o(O);
                    var s;
                }
                async function S(e, t, s, i) {
                    return w.has(s)
                        ? A(e, t, s)
                        : i
                        ? (async function (e, t) {
                              let s = await t(e);
                              return new p(s);
                          })(e, i)
                        : void o(`Parser ${s} is not loaded`);
                }
                async function A(e, t, s) {
                    let i = new (w.get(s))(e, t);
                    return await i.read(), i;
                }
                const U = (e) => k(e).then((e) => e.arrayBuffer()),
                    x = (e) =>
                        new Promise((t, s) => {
                            let i = new FileReader();
                            (i.onloadend = () =>
                                t(i.result || new ArrayBuffer())),
                                (i.onerror = s),
                                i.readAsArrayBuffer(e);
                        });
                class C extends Map {
                    get tagKeys() {
                        return (
                            this.allKeys ||
                                (this.allKeys = Array.from(this.keys())),
                            this.allKeys
                        );
                    }
                    get tagValues() {
                        return (
                            this.allValues ||
                                (this.allValues = Array.from(this.values())),
                            this.allValues
                        );
                    }
                }
                function B(e, t, s) {
                    let i = new C();
                    for (let [e, t] of s) i.set(e, t);
                    if (Array.isArray(t)) for (let s of t) e.set(s, i);
                    else e.set(t, i);
                    return i;
                }
                function V(e, t, s) {
                    let i,
                        n = e.get(t);
                    for (i of s) n.set(i[0], i[1]);
                }
                const I = new Map(),
                    L = new Map(),
                    T = new Map(),
                    P = 37500,
                    z = 37510,
                    F = 33723,
                    j = 34675,
                    E = 34665,
                    _ = 34853,
                    D = 40965,
                    M = [
                        "chunked",
                        "firstChunkSize",
                        "firstChunkSizeNode",
                        "firstChunkSizeBrowser",
                        "chunkSize",
                        "chunkLimit",
                    ],
                    N = ["jfif", "xmp", "icc", "iptc", "ihdr"],
                    R = ["tiff", ...N],
                    $ = ["ifd0", "ifd1", "exif", "gps", "interop"],
                    K = [...R, ...$],
                    W = ["makerNote", "userComment"],
                    X = [
                        "translateKeys",
                        "translateValues",
                        "reviveValues",
                        "multiSegment",
                    ],
                    H = [...X, "sanitize", "mergeOutput", "silentErrors"];
                class Y {
                    get translate() {
                        return (
                            this.translateKeys ||
                            this.translateValues ||
                            this.reviveValues
                        );
                    }
                }
                class G extends Y {
                    get needed() {
                        return this.enabled || this.deps.size > 0;
                    }
                    constructor(e, s, i, n) {
                        if (
                            (super(),
                            t(this, "enabled", !1),
                            t(this, "skip", new Set()),
                            t(this, "pick", new Set()),
                            t(this, "deps", new Set()),
                            t(this, "translateKeys", !1),
                            t(this, "translateValues", !1),
                            t(this, "reviveValues", !1),
                            (this.key = e),
                            (this.enabled = s),
                            (this.parse = this.enabled),
                            this.applyInheritables(n),
                            (this.canBeFiltered = $.includes(e)),
                            this.canBeFiltered && (this.dict = I.get(e)),
                            void 0 !== i)
                        )
                            if (Array.isArray(i))
                                (this.parse = this.enabled = !0),
                                    this.canBeFiltered &&
                                        i.length > 0 &&
                                        this.translateTagSet(i, this.pick);
                            else if ("object" == typeof i) {
                                if (
                                    ((this.enabled = !0),
                                    (this.parse = !1 !== i.parse),
                                    this.canBeFiltered)
                                ) {
                                    let { pick: e, skip: t } = i;
                                    e &&
                                        e.length > 0 &&
                                        this.translateTagSet(e, this.pick),
                                        t &&
                                            t.length > 0 &&
                                            this.translateTagSet(t, this.skip);
                                }
                                this.applyInheritables(i);
                            } else
                                !0 === i || !1 === i
                                    ? (this.parse = this.enabled = i)
                                    : o(`Invalid options argument: ${i}`);
                    }
                    applyInheritables(e) {
                        let t, s;
                        for (t of X) (s = e[t]), void 0 !== s && (this[t] = s);
                    }
                    translateTagSet(e, t) {
                        if (this.dict) {
                            let s,
                                i,
                                { tagKeys: n, tagValues: r } = this.dict;
                            for (s of e)
                                "string" == typeof s
                                    ? ((i = r.indexOf(s)),
                                      -1 === i && (i = n.indexOf(Number(s))),
                                      -1 !== i && t.add(Number(n[i])))
                                    : t.add(s);
                        } else for (let s of e) t.add(s);
                    }
                    finalizeFilters() {
                        !this.enabled && this.deps.size > 0
                            ? ((this.enabled = !0), te(this.pick, this.deps))
                            : this.enabled &&
                              this.pick.size > 0 &&
                              te(this.pick, this.deps);
                    }
                }
                var J = {
                        jfif: !1,
                        tiff: !0,
                        xmp: !1,
                        icc: !1,
                        iptc: !1,
                        ifd0: !0,
                        ifd1: !1,
                        exif: !0,
                        gps: !0,
                        interop: !1,
                        ihdr: void 0,
                        makerNote: !1,
                        userComment: !1,
                        multiSegment: !1,
                        skip: [],
                        pick: [],
                        translateKeys: !0,
                        translateValues: !0,
                        reviveValues: !0,
                        sanitize: !0,
                        mergeOutput: !0,
                        silentErrors: !0,
                        chunked: !0,
                        firstChunkSize: void 0,
                        firstChunkSizeNode: 512,
                        firstChunkSizeBrowser: 65536,
                        chunkSize: 65536,
                        chunkLimit: 5,
                    },
                    q = new Map();
                class Q extends Y {
                    static useCached(e) {
                        let t = q.get(e);
                        return (
                            void 0 !== t || ((t = new this(e)), q.set(e, t)), t
                        );
                    }
                    constructor(e) {
                        super(),
                            !0 === e
                                ? this.setupFromTrue()
                                : void 0 === e
                                ? this.setupFromUndefined()
                                : Array.isArray(e)
                                ? this.setupFromArray(e)
                                : "object" == typeof e
                                ? this.setupFromObject(e)
                                : o(`Invalid options argument ${e}`),
                            void 0 === this.firstChunkSize &&
                                (this.firstChunkSize = i
                                    ? this.firstChunkSizeBrowser
                                    : this.firstChunkSizeNode),
                            this.mergeOutput && (this.ifd1.enabled = !1),
                            this.filterNestedSegmentTags(),
                            this.traverseTiffDependencyTree(),
                            this.checkLoadedPlugins();
                    }
                    setupFromUndefined() {
                        let e;
                        for (e of M) this[e] = J[e];
                        for (e of H) this[e] = J[e];
                        for (e of W) this[e] = J[e];
                        for (e of K) this[e] = new G(e, J[e], void 0, this);
                    }
                    setupFromTrue() {
                        let e;
                        for (e of M) this[e] = J[e];
                        for (e of H) this[e] = J[e];
                        for (e of W) this[e] = !0;
                        for (e of K) this[e] = new G(e, !0, void 0, this);
                    }
                    setupFromArray(e) {
                        let t;
                        for (t of M) this[t] = J[t];
                        for (t of H) this[t] = J[t];
                        for (t of W) this[t] = J[t];
                        for (t of K) this[t] = new G(t, !1, void 0, this);
                        this.setupGlobalFilters(e, void 0, $);
                    }
                    setupFromObject(e) {
                        let t;
                        for (t of (($.ifd0 = $.ifd0 || $.image),
                        ($.ifd1 = $.ifd1 || $.thumbnail),
                        Object.assign(this, e),
                        M))
                            this[t] = ee(e[t], J[t]);
                        for (t of H) this[t] = ee(e[t], J[t]);
                        for (t of W) this[t] = ee(e[t], J[t]);
                        for (t of R) this[t] = new G(t, J[t], e[t], this);
                        for (t of $) this[t] = new G(t, J[t], e[t], this.tiff);
                        this.setupGlobalFilters(e.pick, e.skip, $, K),
                            !0 === e.tiff
                                ? this.batchEnableWithBool($, !0)
                                : !1 === e.tiff
                                ? this.batchEnableWithUserValue($, e)
                                : Array.isArray(e.tiff)
                                ? this.setupGlobalFilters(e.tiff, void 0, $)
                                : "object" == typeof e.tiff &&
                                  this.setupGlobalFilters(
                                      e.tiff.pick,
                                      e.tiff.skip,
                                      $
                                  );
                    }
                    batchEnableWithBool(e, t) {
                        for (let s of e) this[s].enabled = t;
                    }
                    batchEnableWithUserValue(e, t) {
                        for (let s of e) {
                            let e = t[s];
                            this[s].enabled = !1 !== e && void 0 !== e;
                        }
                    }
                    setupGlobalFilters(e, t, s, i = s) {
                        if (e && e.length) {
                            for (let e of i) this[e].enabled = !1;
                            let t = Z(e, s);
                            for (let [e, s] of t)
                                te(this[e].pick, s), (this[e].enabled = !0);
                        } else if (t && t.length) {
                            let e = Z(t, s);
                            for (let [t, s] of e) te(this[t].skip, s);
                        }
                    }
                    filterNestedSegmentTags() {
                        let {
                            ifd0: e,
                            exif: t,
                            xmp: s,
                            iptc: i,
                            icc: n,
                        } = this;
                        this.makerNote ? t.deps.add(P) : t.skip.add(P),
                            this.userComment ? t.deps.add(z) : t.skip.add(z),
                            s.enabled || e.skip.add(700),
                            i.enabled || e.skip.add(F),
                            n.enabled || e.skip.add(j);
                    }
                    traverseTiffDependencyTree() {
                        let { ifd0: e, exif: t, gps: s, interop: i } = this;
                        i.needed && (t.deps.add(D), e.deps.add(D)),
                            t.needed && e.deps.add(E),
                            s.needed && e.deps.add(_),
                            (this.tiff.enabled =
                                $.some((e) => !0 === this[e].enabled) ||
                                this.makerNote ||
                                this.userComment);
                        for (let e of $) this[e].finalizeFilters();
                    }
                    get onlyTiff() {
                        return (
                            !N.map((e) => this[e].enabled).some(
                                (e) => !0 === e
                            ) && this.tiff.enabled
                        );
                    }
                    checkLoadedPlugins() {
                        for (let e of R)
                            this[e].enabled &&
                                !b.has(e) &&
                                g("segment parser", e);
                    }
                }
                function Z(e, t) {
                    let s,
                        i,
                        n,
                        r,
                        a = [];
                    for (n of t) {
                        for (r of ((s = I.get(n)), (i = []), s))
                            (e.includes(r[0]) || e.includes(r[1])) &&
                                i.push(r[0]);
                        i.length && a.push([n, i]);
                    }
                    return a;
                }
                function ee(e, t) {
                    return void 0 !== e ? e : void 0 !== t ? t : void 0;
                }
                function te(e, t) {
                    for (let s of t) e.add(s);
                }
                t(Q, "default", J);
                class se {
                    constructor(e) {
                        t(this, "parsers", {}),
                            t(this, "output", {}),
                            t(this, "errors", []),
                            t(this, "pushToErrors", (e) => this.errors.push(e)),
                            (this.options = Q.useCached(e));
                    }
                    async read(e) {
                        this.file = await (function (e, t) {
                            return "string" == typeof e
                                ? v(e, t)
                                : i && !n && e instanceof HTMLImageElement
                                ? v(e.src, t)
                                : e instanceof Uint8Array ||
                                  e instanceof ArrayBuffer ||
                                  e instanceof DataView
                                ? new p(e)
                                : i && e instanceof Blob
                                ? S(e, t, "blob", x)
                                : void o(O);
                        })(e, this.options);
                    }
                    setup() {
                        if (this.fileParser) return;
                        let { file: e } = this,
                            t = e.getUint16(0);
                        for (let [s, i] of y)
                            if (i.canHandle(e, t))
                                return (
                                    (this.fileParser = new i(
                                        this.options,
                                        this.file,
                                        this.parsers
                                    )),
                                    (e[s] = !0)
                                );
                        this.file.close && this.file.close(),
                            o("Unknown file format");
                    }
                    async parse() {
                        let { output: e, errors: t } = this;
                        return (
                            this.setup(),
                            this.options.silentErrors
                                ? (await this.executeParsers().catch(
                                      this.pushToErrors
                                  ),
                                  t.push(...this.fileParser.errors))
                                : await this.executeParsers(),
                            this.file.close && this.file.close(),
                            this.options.silentErrors &&
                                t.length > 0 &&
                                (e.errors = t),
                            l((s = e)) ? void 0 : s
                        );
                        var s;
                    }
                    async executeParsers() {
                        let { output: e } = this;
                        await this.fileParser.parse();
                        let t = Object.values(this.parsers).map(async (t) => {
                            let s = await t.parse();
                            t.assignToOutput(e, s);
                        });
                        this.options.silentErrors &&
                            (t = t.map((e) => e.catch(this.pushToErrors))),
                            await Promise.all(t);
                    }
                    async extractThumbnail() {
                        this.setup();
                        let { options: e, file: t } = this,
                            s = b.get("tiff", e);
                        var i;
                        if (
                            (t.tiff
                                ? (i = { start: 0, type: "tiff" })
                                : t.jpeg &&
                                  (i = await this.fileParser.getOrFindSegment(
                                      "tiff"
                                  )),
                            void 0 === i)
                        )
                            return;
                        let n = await this.fileParser.ensureSegmentChunk(i),
                            r = (this.parsers.tiff = new s(n, e, t)),
                            a = await r.extractThumbnail();
                        return t.close && t.close(), a;
                    }
                }
                async function ie(e, t) {
                    let s = new se(t);
                    return await s.read(e), s.parse();
                }
                var ne = Object.freeze({
                    __proto__: null,
                    parse: ie,
                    Exifr: se,
                    fileParsers: y,
                    segmentParsers: b,
                    fileReaders: w,
                    tagKeys: I,
                    tagValues: L,
                    tagRevivers: T,
                    createDictionary: B,
                    extendDictionary: V,
                    fetchUrlAsArrayBuffer: U,
                    readBlobAsArrayBuffer: x,
                    chunkedProps: M,
                    otherSegments: N,
                    segments: R,
                    tiffBlocks: $,
                    segmentsAndBlocks: K,
                    tiffExtractables: W,
                    inheritables: X,
                    allFormatters: H,
                    Options: Q,
                });
                class re {
                    static findPosition(e, t) {
                        let s = e.getUint16(t + 2) + 2,
                            i =
                                "function" == typeof this.headerLength
                                    ? this.headerLength(e, t, s)
                                    : this.headerLength,
                            n = t + i,
                            r = s - i;
                        return {
                            offset: t,
                            length: s,
                            headerLength: i,
                            start: n,
                            size: r,
                            end: n + r,
                        };
                    }
                    static parse(e, t = {}) {
                        return new this(
                            e,
                            new Q({ [this.type]: t }),
                            e
                        ).parse();
                    }
                    normalizeInput(e) {
                        return e instanceof p ? e : new p(e);
                    }
                    constructor(e, s = {}, i) {
                        t(this, "errors", []),
                            t(this, "raw", new Map()),
                            t(this, "handleError", (e) => {
                                if (!this.options.silentErrors) throw e;
                                this.errors.push(e.message);
                            }),
                            (this.chunk = this.normalizeInput(e)),
                            (this.file = i),
                            (this.type = this.constructor.type),
                            (this.globalOptions = this.options = s),
                            (this.localOptions = s[this.type]),
                            (this.canTranslate =
                                this.localOptions &&
                                this.localOptions.translate);
                    }
                    translate() {
                        this.canTranslate &&
                            (this.translated = this.translateBlock(
                                this.raw,
                                this.type
                            ));
                    }
                    get output() {
                        return this.translated
                            ? this.translated
                            : this.raw
                            ? Object.fromEntries(this.raw)
                            : void 0;
                    }
                    translateBlock(e, t) {
                        let s = T.get(t),
                            i = L.get(t),
                            n = I.get(t),
                            r = this.options[t],
                            a = r.reviveValues && !!s,
                            h = r.translateValues && !!i,
                            f = r.translateKeys && !!n,
                            l = {};
                        for (let [t, r] of e)
                            a && s.has(t)
                                ? (r = s.get(t)(r))
                                : h &&
                                  i.has(t) &&
                                  (r = this.translateValue(r, i.get(t))),
                                f && n.has(t) && (t = n.get(t) || t),
                                (l[t] = r);
                        return l;
                    }
                    translateValue(e, t) {
                        return t[e] || t.DEFAULT || e;
                    }
                    assignToOutput(e, t) {
                        this.assignObjectToOutput(e, this.constructor.type, t);
                    }
                    assignObjectToOutput(e, t, s) {
                        if (this.globalOptions.mergeOutput)
                            return Object.assign(e, s);
                        e[t] ? Object.assign(e[t], s) : (e[t] = s);
                    }
                }
                t(re, "headerLength", 4),
                    t(re, "type", void 0),
                    t(re, "multiSegment", !1),
                    t(re, "canHandle", () => !1);
                function ae(e) {
                    return (
                        192 === e ||
                        194 === e ||
                        196 === e ||
                        219 === e ||
                        221 === e ||
                        218 === e ||
                        254 === e
                    );
                }
                function he(e) {
                    return e >= 224 && e <= 239;
                }
                function fe(e, t, s) {
                    for (let [i, n] of b) if (n.canHandle(e, t, s)) return i;
                }
                class le extends class {
                    constructor(e, s, i) {
                        t(this, "errors", []),
                            t(this, "ensureSegmentChunk", async (e) => {
                                let t = e.start,
                                    s = e.size || 65536;
                                if (this.file.chunked)
                                    if (this.file.available(t, s))
                                        e.chunk = this.file.subarray(t, s);
                                    else
                                        try {
                                            e.chunk = await this.file.readChunk(
                                                t,
                                                s
                                            );
                                        } catch (t) {
                                            o(
                                                `Couldn't read segment: ${JSON.stringify(
                                                    e
                                                )}. ${t.message}`
                                            );
                                        }
                                else
                                    this.file.byteLength > t + s
                                        ? (e.chunk = this.file.subarray(t, s))
                                        : void 0 === e.size
                                        ? (e.chunk = this.file.subarray(t))
                                        : o(
                                              "Segment unreachable: " +
                                                  JSON.stringify(e)
                                          );
                                return e.chunk;
                            }),
                            this.extendOptions && this.extendOptions(e),
                            (this.options = e),
                            (this.file = s),
                            (this.parsers = i);
                    }
                    injectSegment(e, t) {
                        this.options[e].enabled && this.createParser(e, t);
                    }
                    createParser(e, t) {
                        let s = new (b.get(e))(t, this.options, this.file);
                        return (this.parsers[e] = s);
                    }
                    createParsers(e) {
                        for (let t of e) {
                            let { type: e, chunk: s } = t,
                                i = this.options[e];
                            if (i && i.enabled) {
                                let t = this.parsers[e];
                                (t && t.append) || t || this.createParser(e, s);
                            }
                        }
                    }
                    async readSegments(e) {
                        let t = e.map(this.ensureSegmentChunk);
                        await Promise.all(t);
                    }
                } {
                    constructor(...e) {
                        super(...e),
                            t(this, "appSegments", []),
                            t(this, "jpegSegments", []),
                            t(this, "unknownSegments", []);
                    }
                    static canHandle(e, t) {
                        return 65496 === t;
                    }
                    async parse() {
                        await this.findAppSegments(),
                            await this.readSegments(this.appSegments),
                            this.mergeMultiSegments(),
                            this.createParsers(
                                this.mergedAppSegments || this.appSegments
                            );
                    }
                    setupSegmentFinderArgs(e) {
                        !0 === e
                            ? ((this.findAll = !0),
                              (this.wanted = new Set(b.keyList())))
                            : ((e =
                                  void 0 === e
                                      ? b
                                            .keyList()
                                            .filter(
                                                (e) => this.options[e].enabled
                                            )
                                      : e.filter(
                                            (e) =>
                                                this.options[e].enabled &&
                                                b.has(e)
                                        )),
                              (this.findAll = !1),
                              (this.remaining = new Set(e)),
                              (this.wanted = new Set(e))),
                            (this.unfinishedMultiSegment = !1);
                    }
                    async findAppSegments(e = 0, t) {
                        this.setupSegmentFinderArgs(t);
                        let {
                            file: s,
                            findAll: i,
                            wanted: n,
                            remaining: r,
                        } = this;
                        if (
                            (!i &&
                                this.file.chunked &&
                                ((i = Array.from(n).some((e) => {
                                    let t = b.get(e),
                                        s = this.options[e];
                                    return t.multiSegment && s.multiSegment;
                                })),
                                i && (await this.file.readWhole())),
                            (e = this.findAppSegmentsInRange(e, s.byteLength)),
                            !this.options.onlyTiff && s.chunked)
                        ) {
                            let t = !1;
                            for (
                                ;
                                r.size > 0 &&
                                !t &&
                                (s.canReadNextChunk ||
                                    this.unfinishedMultiSegment);

                            ) {
                                let { nextChunkOffset: i } = s,
                                    n = this.appSegments.some(
                                        (e) =>
                                            !this.file.available(
                                                e.offset || e.start,
                                                e.length || e.size
                                            )
                                    );
                                if (
                                    ((t =
                                        e > i && !n
                                            ? !(await s.readNextChunk(e))
                                            : !(await s.readNextChunk(i))),
                                    void 0 ===
                                        (e = this.findAppSegmentsInRange(
                                            e,
                                            s.byteLength
                                        )))
                                )
                                    return;
                            }
                        }
                    }
                    findAppSegmentsInRange(e, t) {
                        t -= 2;
                        let s,
                            i,
                            n,
                            r,
                            a,
                            h,
                            {
                                file: f,
                                findAll: l,
                                wanted: o,
                                remaining: u,
                                options: d,
                            } = this;
                        for (; e < t; e++)
                            if (255 === f.getUint8(e))
                                if (((s = f.getUint8(e + 1)), he(s))) {
                                    if (
                                        ((i = f.getUint16(e + 2)),
                                        (n = fe(f, e, i)),
                                        n &&
                                            o.has(n) &&
                                            ((r = b.get(n)),
                                            (a = r.findPosition(f, e)),
                                            (h = d[n]),
                                            (a.type = n),
                                            this.appSegments.push(a),
                                            !l &&
                                                (r.multiSegment &&
                                                h.multiSegment
                                                    ? ((this.unfinishedMultiSegment =
                                                          a.chunkNumber <
                                                          a.chunkCount),
                                                      this
                                                          .unfinishedMultiSegment ||
                                                          u.delete(n))
                                                    : u.delete(n),
                                                0 === u.size)))
                                    )
                                        break;
                                    d.recordUnknownSegments &&
                                        ((a = re.findPosition(f, e)),
                                        (a.marker = s),
                                        this.unknownSegments.push(a)),
                                        (e += i + 1);
                                } else if (ae(s)) {
                                    if (
                                        ((i = f.getUint16(e + 2)),
                                        218 === s && !1 !== d.stopAfterSos)
                                    )
                                        return;
                                    d.recordJpegSegments &&
                                        this.jpegSegments.push({
                                            offset: e,
                                            length: i,
                                            marker: s,
                                        }),
                                        (e += i + 1);
                                }
                        return e;
                    }
                    mergeMultiSegments() {
                        if (!this.appSegments.some((e) => e.multiSegment))
                            return;
                        let e = (function (e, t) {
                            let s,
                                i,
                                n,
                                r = new Map();
                            for (let a = 0; a < e.length; a++)
                                (s = e[a]),
                                    (i = s[t]),
                                    r.has(i)
                                        ? (n = r.get(i))
                                        : r.set(i, (n = [])),
                                    n.push(s);
                            return Array.from(r);
                        })(this.appSegments, "type");
                        this.mergedAppSegments = e.map(([e, t]) => {
                            let s = b.get(e, this.options);
                            if (s.handleMultiSegments) {
                                return {
                                    type: e,
                                    chunk: s.handleMultiSegments(t),
                                };
                            }
                            return t[0];
                        });
                    }
                    getSegment(e) {
                        return this.appSegments.find((t) => t.type === e);
                    }
                    async getOrFindSegment(e) {
                        let t = this.getSegment(e);
                        return (
                            void 0 === t &&
                                (await this.findAppSegments(0, [e]),
                                (t = this.getSegment(e))),
                            t
                        );
                    }
                }
                t(le, "type", "jpeg"), y.set("jpeg", le);
                const oe = [void 0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4];
                class ue extends re {
                    parseHeader() {
                        var e = this.chunk.getUint16();
                        18761 === e
                            ? (this.le = !0)
                            : 19789 === e && (this.le = !1),
                            (this.chunk.le = this.le),
                            (this.headerParsed = !0);
                    }
                    parseTags(e, t, s = new Map()) {
                        let { pick: i, skip: n } = this.options[t];
                        i = new Set(i);
                        let r = i.size > 0,
                            a = 0 === n.size,
                            h = this.chunk.getUint16(e);
                        e += 2;
                        for (let f = 0; f < h; f++) {
                            let h = this.chunk.getUint16(e);
                            if (r) {
                                if (
                                    i.has(h) &&
                                    (s.set(h, this.parseTag(e, h, t)),
                                    i.delete(h),
                                    0 === i.size)
                                )
                                    break;
                            } else
                                (!a && n.has(h)) ||
                                    s.set(h, this.parseTag(e, h, t));
                            e += 12;
                        }
                        return s;
                    }
                    parseTag(e, t, s) {
                        let { chunk: i } = this,
                            n = i.getUint16(e + 2),
                            r = i.getUint32(e + 4),
                            a = oe[n];
                        if (
                            (a * r <= 4 ? (e += 8) : (e = i.getUint32(e + 8)),
                            (n < 1 || n > 13) &&
                                o(
                                    `Invalid TIFF value type. block: ${s.toUpperCase()}, tag: ${t.toString(
                                        16
                                    )}, type: ${n}, offset ${e}`
                                ),
                            e > i.byteLength &&
                                o(
                                    `Invalid TIFF value offset. block: ${s.toUpperCase()}, tag: ${t.toString(
                                        16
                                    )}, type: ${n}, offset ${e} is outside of chunk size ${
                                        i.byteLength
                                    }`
                                ),
                            1 === n)
                        )
                            return i.getUint8Array(e, r);
                        if (2 === n)
                            return "" ===
                                (h = (function (e) {
                                    for (; e.endsWith("\0"); )
                                        e = e.slice(0, -1);
                                    return e;
                                })((h = i.getString(e, r))).trim())
                                ? void 0
                                : h;
                        var h;
                        if (7 === n) return i.getUint8Array(e, r);
                        if (1 === r) return this.parseTagValue(n, e);
                        {
                            let t = new ((function (e) {
                                    switch (e) {
                                        case 1:
                                            return Uint8Array;
                                        case 3:
                                            return Uint16Array;
                                        case 4:
                                            return Uint32Array;
                                        case 5:
                                            return Array;
                                        case 6:
                                            return Int8Array;
                                        case 8:
                                            return Int16Array;
                                        case 9:
                                            return Int32Array;
                                        case 10:
                                            return Array;
                                        case 11:
                                            return Float32Array;
                                        case 12:
                                            return Float64Array;
                                        default:
                                            return Array;
                                    }
                                })(n))(r),
                                s = a;
                            for (let i = 0; i < r; i++)
                                (t[i] = this.parseTagValue(n, e)), (e += s);
                            return t;
                        }
                    }
                    parseTagValue(e, t) {
                        let { chunk: s } = this;
                        switch (e) {
                            case 1:
                                return s.getUint8(t);
                            case 3:
                                return s.getUint16(t);
                            case 4:
                                return s.getUint32(t);
                            case 5:
                                return s.getUint32(t) / s.getUint32(t + 4);
                            case 6:
                                return s.getInt8(t);
                            case 8:
                                return s.getInt16(t);
                            case 9:
                                return s.getInt32(t);
                            case 10:
                                return s.getInt32(t) / s.getInt32(t + 4);
                            case 11:
                                return s.getFloat(t);
                            case 12:
                                return s.getDouble(t);
                            case 13:
                                return s.getUint32(t);
                            default:
                                o(`Invalid tiff type ${e}`);
                        }
                    }
                }
                class de extends ue {
                    static canHandle(e, t) {
                        return (
                            225 === e.getUint8(t + 1) &&
                            1165519206 === e.getUint32(t + 4) &&
                            0 === e.getUint16(t + 8)
                        );
                    }
                    async parse() {
                        this.parseHeader();
                        let { options: e } = this;
                        return (
                            e.ifd0.enabled && (await this.parseIfd0Block()),
                            e.exif.enabled &&
                                (await this.safeParse("parseExifBlock")),
                            e.gps.enabled &&
                                (await this.safeParse("parseGpsBlock")),
                            e.interop.enabled &&
                                (await this.safeParse("parseInteropBlock")),
                            e.ifd1.enabled &&
                                (await this.safeParse("parseThumbnailBlock")),
                            this.createOutput()
                        );
                    }
                    safeParse(e) {
                        let t = this[e]();
                        return (
                            void 0 !== t.catch &&
                                (t = t.catch(this.handleError)),
                            t
                        );
                    }
                    findIfd0Offset() {
                        void 0 === this.ifd0Offset &&
                            (this.ifd0Offset = this.chunk.getUint32(4));
                    }
                    findIfd1Offset() {
                        if (void 0 === this.ifd1Offset) {
                            this.findIfd0Offset();
                            let e = this.chunk.getUint16(this.ifd0Offset),
                                t = this.ifd0Offset + 2 + 12 * e;
                            this.ifd1Offset = this.chunk.getUint32(t);
                        }
                    }
                    parseBlock(e, t) {
                        let s = new Map();
                        return (this[t] = s), this.parseTags(e, t, s), s;
                    }
                    async parseIfd0Block() {
                        if (this.ifd0) return;
                        let { file: e } = this;
                        this.findIfd0Offset(),
                            this.ifd0Offset < 8 && o("Malformed EXIF data"),
                            !e.chunked &&
                                this.ifd0Offset > e.byteLength &&
                                o(
                                    `IFD0 offset points to outside of file.\nthis.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`
                                ),
                            e.tiff &&
                                (await e.ensureChunk(
                                    this.ifd0Offset,
                                    u(this.options)
                                ));
                        let t = this.parseBlock(this.ifd0Offset, "ifd0");
                        return 0 !== t.size
                            ? ((this.exifOffset = t.get(E)),
                              (this.interopOffset = t.get(D)),
                              (this.gpsOffset = t.get(_)),
                              (this.xmp = t.get(700)),
                              (this.iptc = t.get(F)),
                              (this.icc = t.get(j)),
                              this.options.sanitize &&
                                  (t.delete(E),
                                  t.delete(D),
                                  t.delete(_),
                                  t.delete(700),
                                  t.delete(F),
                                  t.delete(j)),
                              t)
                            : void 0;
                    }
                    async parseExifBlock() {
                        if (this.exif) return;
                        if (
                            (this.ifd0 || (await this.parseIfd0Block()),
                            void 0 === this.exifOffset)
                        )
                            return;
                        this.file.tiff &&
                            (await this.file.ensureChunk(
                                this.exifOffset,
                                u(this.options)
                            ));
                        let e = this.parseBlock(this.exifOffset, "exif");
                        return (
                            this.interopOffset ||
                                (this.interopOffset = e.get(D)),
                            (this.makerNote = e.get(P)),
                            (this.userComment = e.get(z)),
                            this.options.sanitize &&
                                (e.delete(D), e.delete(P), e.delete(z)),
                            this.unpack(e, 41728),
                            this.unpack(e, 41729),
                            e
                        );
                    }
                    unpack(e, t) {
                        let s = e.get(t);
                        s && 1 === s.length && e.set(t, s[0]);
                    }
                    async parseGpsBlock() {
                        if (this.gps) return;
                        if (
                            (this.ifd0 || (await this.parseIfd0Block()),
                            void 0 === this.gpsOffset)
                        )
                            return;
                        let e = this.parseBlock(this.gpsOffset, "gps");
                        return (
                            e &&
                                e.has(2) &&
                                e.has(4) &&
                                (e.set("latitude", ce(...e.get(2), e.get(1))),
                                e.set("longitude", ce(...e.get(4), e.get(3)))),
                            e
                        );
                    }
                    async parseInteropBlock() {
                        if (
                            !this.interop &&
                            (this.ifd0 || (await this.parseIfd0Block()),
                            void 0 !== this.interopOffset ||
                                this.exif ||
                                (await this.parseExifBlock()),
                            void 0 !== this.interopOffset)
                        )
                            return this.parseBlock(
                                this.interopOffset,
                                "interop"
                            );
                    }
                    async parseThumbnailBlock(e = !1) {
                        if (
                            !this.ifd1 &&
                            !this.ifd1Parsed &&
                            (!this.options.mergeOutput || e)
                        )
                            return (
                                this.findIfd1Offset(),
                                this.ifd1Offset > 0 &&
                                    (this.parseBlock(this.ifd1Offset, "ifd1"),
                                    (this.ifd1Parsed = !0)),
                                this.ifd1
                            );
                    }
                    async extractThumbnail() {
                        if (
                            (this.headerParsed || this.parseHeader(),
                            this.ifd1Parsed ||
                                (await this.parseThumbnailBlock(!0)),
                            void 0 === this.ifd1)
                        )
                            return;
                        let e = this.ifd1.get(513),
                            t = this.ifd1.get(514);
                        return this.chunk.getUint8Array(e, t);
                    }
                    get image() {
                        return this.ifd0;
                    }
                    get thumbnail() {
                        return this.ifd1;
                    }
                    createOutput() {
                        let e,
                            t,
                            s,
                            i = {};
                        for (t of $)
                            if (((e = this[t]), !l(e)))
                                if (
                                    ((s = this.canTranslate
                                        ? this.translateBlock(e, t)
                                        : Object.fromEntries(e)),
                                    this.options.mergeOutput)
                                ) {
                                    if ("ifd1" === t) continue;
                                    Object.assign(i, s);
                                } else i[t] = s;
                        return (
                            this.makerNote && (i.makerNote = this.makerNote),
                            this.userComment &&
                                (i.userComment = this.userComment),
                            i
                        );
                    }
                    assignToOutput(e, t) {
                        if (this.globalOptions.mergeOutput) Object.assign(e, t);
                        else
                            for (let [s, i] of Object.entries(t))
                                this.assignObjectToOutput(e, s, i);
                    }
                }
                function ce(e, t, s, i) {
                    var n = e + t / 60 + s / 3600;
                    return ("S" !== i && "W" !== i) || (n *= -1), n;
                }
                t(de, "type", "tiff"),
                    t(de, "headerLength", 10),
                    b.set("tiff", de);
                var pe = Object.freeze({
                    __proto__: null,
                    default: ne,
                    Exifr: se,
                    fileParsers: y,
                    segmentParsers: b,
                    fileReaders: w,
                    tagKeys: I,
                    tagValues: L,
                    tagRevivers: T,
                    createDictionary: B,
                    extendDictionary: V,
                    fetchUrlAsArrayBuffer: U,
                    readBlobAsArrayBuffer: x,
                    chunkedProps: M,
                    otherSegments: N,
                    segments: R,
                    tiffBlocks: $,
                    segmentsAndBlocks: K,
                    tiffExtractables: W,
                    inheritables: X,
                    allFormatters: H,
                    Options: Q,
                    parse: ie,
                });
                const ge = {
                        ifd0: !1,
                        ifd1: !1,
                        exif: !1,
                        gps: !1,
                        interop: !1,
                        sanitize: !1,
                        reviveValues: !0,
                        translateKeys: !1,
                        translateValues: !1,
                        mergeOutput: !1,
                    },
                    me = Object.assign({}, ge, {
                        firstChunkSize: 4e4,
                        gps: [1, 2, 3, 4],
                    });
                const ye = Object.assign({}, ge, {
                    tiff: !1,
                    ifd1: !0,
                    mergeOutput: !1,
                });
                const be = Object.assign({}, ge, {
                    firstChunkSize: 4e4,
                    ifd0: [274],
                });
                async function we(e) {
                    let t = new se(be);
                    await t.read(e);
                    let s = await t.parse();
                    if (s && s.ifd0) return s.ifd0[274];
                }
                const ke = Object.freeze({
                    1: {
                        dimensionSwapped: !1,
                        scaleX: 1,
                        scaleY: 1,
                        deg: 0,
                        rad: 0,
                    },
                    2: {
                        dimensionSwapped: !1,
                        scaleX: -1,
                        scaleY: 1,
                        deg: 0,
                        rad: 0,
                    },
                    3: {
                        dimensionSwapped: !1,
                        scaleX: 1,
                        scaleY: 1,
                        deg: 180,
                        rad: (180 * Math.PI) / 180,
                    },
                    4: {
                        dimensionSwapped: !1,
                        scaleX: -1,
                        scaleY: 1,
                        deg: 180,
                        rad: (180 * Math.PI) / 180,
                    },
                    5: {
                        dimensionSwapped: !0,
                        scaleX: 1,
                        scaleY: -1,
                        deg: 90,
                        rad: (90 * Math.PI) / 180,
                    },
                    6: {
                        dimensionSwapped: !0,
                        scaleX: 1,
                        scaleY: 1,
                        deg: 90,
                        rad: (90 * Math.PI) / 180,
                    },
                    7: {
                        dimensionSwapped: !0,
                        scaleX: 1,
                        scaleY: -1,
                        deg: 270,
                        rad: (270 * Math.PI) / 180,
                    },
                    8: {
                        dimensionSwapped: !0,
                        scaleX: 1,
                        scaleY: 1,
                        deg: 270,
                        rad: (270 * Math.PI) / 180,
                    },
                });
                if (
                    ((e.rotateCanvas = !0),
                    (e.rotateCss = !0),
                    "object" == typeof navigator)
                ) {
                    let t = navigator.userAgent;
                    if (t.includes("iPad") || t.includes("iPhone")) {
                        let s = t.match(/OS (\d+)_(\d+)/);
                        if (s) {
                            let [, t, i] = s,
                                n = Number(t) + 0.1 * Number(i);
                            (e.rotateCanvas = n < 13.4), (e.rotateCss = !1);
                        }
                    } else if (t.includes("OS X 10")) {
                        let [, s] = t.match(/OS X 10[_.](\d+)/);
                        e.rotateCanvas = e.rotateCss = Number(s) < 15;
                    }
                    if (t.includes("Chrome/")) {
                        let [, s] = t.match(/Chrome\/(\d+)/);
                        e.rotateCanvas = e.rotateCss = Number(s) < 81;
                    } else if (t.includes("Firefox/")) {
                        let [, s] = t.match(/Firefox\/(\d+)/);
                        e.rotateCanvas = e.rotateCss = Number(s) < 77;
                    }
                }
                class Oe extends p {
                    constructor(...e) {
                        super(...e),
                            t(this, "ranges", new ve()),
                            0 !== this.byteLength &&
                                this.ranges.add(0, this.byteLength);
                    }
                    _tryExtend(e, t, s) {
                        if (0 === e && 0 === this.byteLength && s) {
                            let e = new DataView(
                                s.buffer || s,
                                s.byteOffset,
                                s.byteLength
                            );
                            this._swapDataView(e);
                        } else {
                            let s = e + t;
                            if (s > this.byteLength) {
                                let { dataView: e } = this._extend(s);
                                this._swapDataView(e);
                            }
                        }
                    }
                    _extend(e) {
                        let t;
                        t = h ? a.allocUnsafe(e) : new Uint8Array(e);
                        let s = new DataView(
                            t.buffer,
                            t.byteOffset,
                            t.byteLength
                        );
                        return (
                            t.set(
                                new Uint8Array(
                                    this.buffer,
                                    this.byteOffset,
                                    this.byteLength
                                ),
                                0
                            ),
                            { uintView: t, dataView: s }
                        );
                    }
                    subarray(e, t, s = !1) {
                        return (
                            (t = t || this._lengthToEnd(e)),
                            s && this._tryExtend(e, t),
                            this.ranges.add(e, t),
                            super.subarray(e, t)
                        );
                    }
                    set(e, t, s = !1) {
                        s && this._tryExtend(t, e.byteLength, e);
                        let i = super.set(e, t);
                        return this.ranges.add(t, i.byteLength), i;
                    }
                    async ensureChunk(e, t) {
                        this.chunked &&
                            (this.ranges.available(e, t) ||
                                (await this.readChunk(e, t)));
                    }
                    available(e, t) {
                        return this.ranges.available(e, t);
                    }
                }
                class ve {
                    constructor() {
                        t(this, "list", []);
                    }
                    get length() {
                        return this.list.length;
                    }
                    add(e, t, s = 0) {
                        let i = e + t,
                            n = this.list.filter(
                                (t) => Se(e, t.offset, i) || Se(e, t.end, i)
                            );
                        if (n.length > 0) {
                            (e = Math.min(e, ...n.map((e) => e.offset))),
                                (i = Math.max(i, ...n.map((e) => e.end))),
                                (t = i - e);
                            let s = n.shift();
                            (s.offset = e),
                                (s.length = t),
                                (s.end = i),
                                (this.list = this.list.filter(
                                    (e) => !n.includes(e)
                                ));
                        } else this.list.push({ offset: e, length: t, end: i });
                    }
                    available(e, t) {
                        let s = e + t;
                        return this.list.some(
                            (t) => t.offset <= e && s <= t.end
                        );
                    }
                }
                function Se(e, t, s) {
                    return e <= t && t <= s;
                }
                class Ae extends Oe {
                    constructor(e, s) {
                        super(0),
                            t(this, "chunksRead", 0),
                            (this.input = e),
                            (this.options = s);
                    }
                    async readWhole() {
                        (this.chunked = !1),
                            await this.readChunk(this.nextChunkOffset);
                    }
                    async readChunked() {
                        (this.chunked = !0),
                            await this.readChunk(
                                0,
                                this.options.firstChunkSize
                            );
                    }
                    async readNextChunk(e = this.nextChunkOffset) {
                        if (this.fullyRead) return this.chunksRead++, !1;
                        let t = this.options.chunkSize,
                            s = await this.readChunk(e, t);
                        return !!s && s.byteLength === t;
                    }
                    async readChunk(e, t) {
                        if (
                            (this.chunksRead++,
                            0 !== (t = this.safeWrapAddress(e, t)))
                        )
                            return this._readChunk(e, t);
                    }
                    safeWrapAddress(e, t) {
                        return void 0 !== this.size && e + t > this.size
                            ? Math.max(0, this.size - e)
                            : t;
                    }
                    get nextChunkOffset() {
                        if (0 !== this.ranges.list.length)
                            return this.ranges.list[0].length;
                    }
                    get canReadNextChunk() {
                        return this.chunksRead < this.options.chunkLimit;
                    }
                    get fullyRead() {
                        return (
                            void 0 !== this.size &&
                            this.nextChunkOffset === this.size
                        );
                    }
                    read() {
                        return this.options.chunked
                            ? this.readChunked()
                            : this.readWhole();
                    }
                    close() {}
                }
                w.set(
                    "blob",
                    class extends Ae {
                        async readWhole() {
                            this.chunked = !1;
                            let e = await x(this.input);
                            this._swapArrayBuffer(e);
                        }
                        readChunked() {
                            return (
                                (this.chunked = !0),
                                (this.size = this.input.size),
                                super.readChunked()
                            );
                        }
                        async _readChunk(e, t) {
                            let s = t ? e + t : void 0,
                                i = this.input.slice(e, s),
                                n = await x(i);
                            return this.set(n, e, !0);
                        }
                    }
                ),
                    (e.Exifr = se),
                    (e.Options = Q),
                    (e.allFormatters = H),
                    (e.chunkedProps = M),
                    (e.createDictionary = B),
                    (e.default = pe),
                    (e.extendDictionary = V),
                    (e.fetchUrlAsArrayBuffer = U),
                    (e.fileParsers = y),
                    (e.fileReaders = w),
                    (e.gps = async function (e) {
                        let t = new se(me);
                        await t.read(e);
                        let s = await t.parse();
                        if (s && s.gps) {
                            let { latitude: e, longitude: t } = s.gps;
                            return { latitude: e, longitude: t };
                        }
                    }),
                    (e.gpsOnlyOptions = me),
                    (e.inheritables = X),
                    (e.orientation = we),
                    (e.orientationOnlyOptions = be),
                    (e.otherSegments = N),
                    (e.parse = ie),
                    (e.readBlobAsArrayBuffer = x),
                    (e.rotation = async function (t) {
                        let s = await we(t);
                        return Object.assign(
                            { canvas: e.rotateCanvas, css: e.rotateCss },
                            ke[s]
                        );
                    }),
                    (e.rotations = ke),
                    (e.segmentParsers = b),
                    (e.segments = R),
                    (e.segmentsAndBlocks = K),
                    (e.tagKeys = I),
                    (e.tagRevivers = T),
                    (e.tagValues = L),
                    (e.thumbnail = async function (e) {
                        let t = new se(ye);
                        await t.read(e);
                        let s = await t.extractThumbnail();
                        return s && h ? a.from(s) : s;
                    }),
                    (e.thumbnailOnlyOptions = ye),
                    (e.thumbnailUrl = async function (e) {
                        let t = await this.thumbnail(e);
                        if (void 0 !== t) {
                            let e = new Blob([t]);
                            return URL.createObjectURL(e);
                        }
                    }),
                    (e.tiffBlocks = $),
                    (e.tiffExtractables = W),
                    Object.defineProperty(e, "__esModule", { value: !0 });
            });

            /***/
        },

        /***/ 81: /***/ function (module) {
            module.exports = function isShallowEqual(a, b) {
                if (a === b) return true;
                for (var i in a) if (!(i in b)) return false;
                for (var i in b) if (a[i] !== b[i]) return false;
                return true;
            };

            /***/
        },

        /***/ 1296: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            /**
             * lodash (Custom Build) <https://lodash.com/>
             * Build: `lodash modularize exports="npm" -o ./`
             * Copyright jQuery Foundation and other contributors <https://jquery.org/>
             * Released under MIT license <https://lodash.com/license>
             * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
             * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
             */

            /** Used as the `TypeError` message for "Functions" methods. */
            var FUNC_ERROR_TEXT = "Expected a function";

            /** Used as references for various `Number` constants. */
            var NAN = 0 / 0;

            /** `Object#toString` result references. */
            var symbolTag = "[object Symbol]";

            /** Used to match leading and trailing whitespace. */
            var reTrim = /^\s+|\s+$/g;

            /** Used to detect bad signed hexadecimal string values. */
            var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

            /** Used to detect binary string values. */
            var reIsBinary = /^0b[01]+$/i;

            /** Used to detect octal string values. */
            var reIsOctal = /^0o[0-7]+$/i;

            /** Built-in method references without a dependency on `root`. */
            var freeParseInt = parseInt;

            /** Detect free variable `global` from Node.js. */
            var freeGlobal =
                typeof __webpack_require__.g == "object" &&
                __webpack_require__.g &&
                __webpack_require__.g.Object === Object &&
                __webpack_require__.g;

            /** Detect free variable `self`. */
            var freeSelf =
                typeof self == "object" &&
                self &&
                self.Object === Object &&
                self;

            /** Used as a reference to the global object. */
            var root = freeGlobal || freeSelf || Function("return this")();

            /** Used for built-in method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the
             * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objectToString = objectProto.toString;

            /* Built-in method references for those with the same name as other `lodash` methods. */
            var nativeMax = Math.max,
                nativeMin = Math.min;

            /**
             * Gets the timestamp of the number of milliseconds that have elapsed since
             * the Unix epoch (1 January 1970 00:00:00 UTC).
             *
             * @static
             * @memberOf _
             * @since 2.4.0
             * @category Date
             * @returns {number} Returns the timestamp.
             * @example
             *
             * _.defer(function(stamp) {
             *   console.log(_.now() - stamp);
             * }, _.now());
             * // => Logs the number of milliseconds it took for the deferred invocation.
             */
            var now = function () {
                return root.Date.now();
            };

            /**
             * Creates a debounced function that delays invoking `func` until after `wait`
             * milliseconds have elapsed since the last time the debounced function was
             * invoked. The debounced function comes with a `cancel` method to cancel
             * delayed `func` invocations and a `flush` method to immediately invoke them.
             * Provide `options` to indicate whether `func` should be invoked on the
             * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
             * with the last arguments provided to the debounced function. Subsequent
             * calls to the debounced function return the result of the last `func`
             * invocation.
             *
             * **Note:** If `leading` and `trailing` options are `true`, `func` is
             * invoked on the trailing edge of the timeout only if the debounced function
             * is invoked more than once during the `wait` timeout.
             *
             * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
             * until to the next tick, similar to `setTimeout` with a timeout of `0`.
             *
             * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
             * for details over the differences between `_.debounce` and `_.throttle`.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Function
             * @param {Function} func The function to debounce.
             * @param {number} [wait=0] The number of milliseconds to delay.
             * @param {Object} [options={}] The options object.
             * @param {boolean} [options.leading=false]
             *  Specify invoking on the leading edge of the timeout.
             * @param {number} [options.maxWait]
             *  The maximum time `func` is allowed to be delayed before it's invoked.
             * @param {boolean} [options.trailing=true]
             *  Specify invoking on the trailing edge of the timeout.
             * @returns {Function} Returns the new debounced function.
             * @example
             *
             * // Avoid costly calculations while the window size is in flux.
             * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
             *
             * // Invoke `sendMail` when clicked, debouncing subsequent calls.
             * jQuery(element).on('click', _.debounce(sendMail, 300, {
             *   'leading': true,
             *   'trailing': false
             * }));
             *
             * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
             * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
             * var source = new EventSource('/stream');
             * jQuery(source).on('message', debounced);
             *
             * // Cancel the trailing debounced invocation.
             * jQuery(window).on('popstate', debounced.cancel);
             */
            function debounce(func, wait, options) {
                var lastArgs,
                    lastThis,
                    maxWait,
                    result,
                    timerId,
                    lastCallTime,
                    lastInvokeTime = 0,
                    leading = false,
                    maxing = false,
                    trailing = true;

                if (typeof func != "function") {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                wait = toNumber(wait) || 0;
                if (isObject(options)) {
                    leading = !!options.leading;
                    maxing = "maxWait" in options;
                    maxWait = maxing
                        ? nativeMax(toNumber(options.maxWait) || 0, wait)
                        : maxWait;
                    trailing =
                        "trailing" in options ? !!options.trailing : trailing;
                }

                function invokeFunc(time) {
                    var args = lastArgs,
                        thisArg = lastThis;

                    lastArgs = lastThis = undefined;
                    lastInvokeTime = time;
                    result = func.apply(thisArg, args);
                    return result;
                }

                function leadingEdge(time) {
                    // Reset any `maxWait` timer.
                    lastInvokeTime = time;
                    // Start the timer for the trailing edge.
                    timerId = setTimeout(timerExpired, wait);
                    // Invoke the leading edge.
                    return leading ? invokeFunc(time) : result;
                }

                function remainingWait(time) {
                    var timeSinceLastCall = time - lastCallTime,
                        timeSinceLastInvoke = time - lastInvokeTime,
                        result = wait - timeSinceLastCall;

                    return maxing
                        ? nativeMin(result, maxWait - timeSinceLastInvoke)
                        : result;
                }

                function shouldInvoke(time) {
                    var timeSinceLastCall = time - lastCallTime,
                        timeSinceLastInvoke = time - lastInvokeTime;

                    // Either this is the first call, activity has stopped and we're at the
                    // trailing edge, the system time has gone backwards and we're treating
                    // it as the trailing edge, or we've hit the `maxWait` limit.
                    return (
                        lastCallTime === undefined ||
                        timeSinceLastCall >= wait ||
                        timeSinceLastCall < 0 ||
                        (maxing && timeSinceLastInvoke >= maxWait)
                    );
                }

                function timerExpired() {
                    var time = now();
                    if (shouldInvoke(time)) {
                        return trailingEdge(time);
                    }
                    // Restart the timer.
                    timerId = setTimeout(timerExpired, remainingWait(time));
                }

                function trailingEdge(time) {
                    timerId = undefined;

                    // Only invoke if we have `lastArgs` which means `func` has been
                    // debounced at least once.
                    if (trailing && lastArgs) {
                        return invokeFunc(time);
                    }
                    lastArgs = lastThis = undefined;
                    return result;
                }

                function cancel() {
                    if (timerId !== undefined) {
                        clearTimeout(timerId);
                    }
                    lastInvokeTime = 0;
                    lastArgs = lastCallTime = lastThis = timerId = undefined;
                }

                function flush() {
                    return timerId === undefined ? result : trailingEdge(now());
                }

                function debounced() {
                    var time = now(),
                        isInvoking = shouldInvoke(time);

                    lastArgs = arguments;
                    lastThis = this;
                    lastCallTime = time;

                    if (isInvoking) {
                        if (timerId === undefined) {
                            return leadingEdge(lastCallTime);
                        }
                        if (maxing) {
                            // Handle invocations in a tight loop.
                            timerId = setTimeout(timerExpired, wait);
                            return invokeFunc(lastCallTime);
                        }
                    }
                    if (timerId === undefined) {
                        timerId = setTimeout(timerExpired, wait);
                    }
                    return result;
                }
                debounced.cancel = cancel;
                debounced.flush = flush;
                return debounced;
            }

            /**
             * Checks if `value` is the
             * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
             * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an object, else `false`.
             * @example
             *
             * _.isObject({});
             * // => true
             *
             * _.isObject([1, 2, 3]);
             * // => true
             *
             * _.isObject(_.noop);
             * // => true
             *
             * _.isObject(null);
             * // => false
             */
            function isObject(value) {
                var type = typeof value;
                return !!value && (type == "object" || type == "function");
            }

            /**
             * Checks if `value` is object-like. A value is object-like if it's not `null`
             * and has a `typeof` result of "object".
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
             * @example
             *
             * _.isObjectLike({});
             * // => true
             *
             * _.isObjectLike([1, 2, 3]);
             * // => true
             *
             * _.isObjectLike(_.noop);
             * // => false
             *
             * _.isObjectLike(null);
             * // => false
             */
            function isObjectLike(value) {
                return !!value && typeof value == "object";
            }

            /**
             * Checks if `value` is classified as a `Symbol` primitive or object.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
             * @example
             *
             * _.isSymbol(Symbol.iterator);
             * // => true
             *
             * _.isSymbol('abc');
             * // => false
             */
            function isSymbol(value) {
                return (
                    typeof value == "symbol" ||
                    (isObjectLike(value) &&
                        objectToString.call(value) == symbolTag)
                );
            }

            /**
             * Converts `value` to a number.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to process.
             * @returns {number} Returns the number.
             * @example
             *
             * _.toNumber(3.2);
             * // => 3.2
             *
             * _.toNumber(Number.MIN_VALUE);
             * // => 5e-324
             *
             * _.toNumber(Infinity);
             * // => Infinity
             *
             * _.toNumber('3.2');
             * // => 3.2
             */
            function toNumber(value) {
                if (typeof value == "number") {
                    return value;
                }
                if (isSymbol(value)) {
                    return NAN;
                }
                if (isObject(value)) {
                    var other =
                        typeof value.valueOf == "function"
                            ? value.valueOf()
                            : value;
                    value = isObject(other) ? other + "" : other;
                }
                if (typeof value != "string") {
                    return value === 0 ? value : +value;
                }
                value = value.replace(reTrim, "");
                var isBinary = reIsBinary.test(value);
                return isBinary || reIsOctal.test(value)
                    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
                    : reIsBadHex.test(value)
                    ? NAN
                    : +value;
            }

            module.exports = debounce;

            /***/
        },

        /***/ 3096: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            /**
             * lodash (Custom Build) <https://lodash.com/>
             * Build: `lodash modularize exports="npm" -o ./`
             * Copyright jQuery Foundation and other contributors <https://jquery.org/>
             * Released under MIT license <https://lodash.com/license>
             * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
             * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
             */

            /** Used as the `TypeError` message for "Functions" methods. */
            var FUNC_ERROR_TEXT = "Expected a function";

            /** Used as references for various `Number` constants. */
            var NAN = 0 / 0;

            /** `Object#toString` result references. */
            var symbolTag = "[object Symbol]";

            /** Used to match leading and trailing whitespace. */
            var reTrim = /^\s+|\s+$/g;

            /** Used to detect bad signed hexadecimal string values. */
            var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

            /** Used to detect binary string values. */
            var reIsBinary = /^0b[01]+$/i;

            /** Used to detect octal string values. */
            var reIsOctal = /^0o[0-7]+$/i;

            /** Built-in method references without a dependency on `root`. */
            var freeParseInt = parseInt;

            /** Detect free variable `global` from Node.js. */
            var freeGlobal =
                typeof __webpack_require__.g == "object" &&
                __webpack_require__.g &&
                __webpack_require__.g.Object === Object &&
                __webpack_require__.g;

            /** Detect free variable `self`. */
            var freeSelf =
                typeof self == "object" &&
                self &&
                self.Object === Object &&
                self;

            /** Used as a reference to the global object. */
            var root = freeGlobal || freeSelf || Function("return this")();

            /** Used for built-in method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the
             * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objectToString = objectProto.toString;

            /* Built-in method references for those with the same name as other `lodash` methods. */
            var nativeMax = Math.max,
                nativeMin = Math.min;

            /**
             * Gets the timestamp of the number of milliseconds that have elapsed since
             * the Unix epoch (1 January 1970 00:00:00 UTC).
             *
             * @static
             * @memberOf _
             * @since 2.4.0
             * @category Date
             * @returns {number} Returns the timestamp.
             * @example
             *
             * _.defer(function(stamp) {
             *   console.log(_.now() - stamp);
             * }, _.now());
             * // => Logs the number of milliseconds it took for the deferred invocation.
             */
            var now = function () {
                return root.Date.now();
            };

            /**
             * Creates a debounced function that delays invoking `func` until after `wait`
             * milliseconds have elapsed since the last time the debounced function was
             * invoked. The debounced function comes with a `cancel` method to cancel
             * delayed `func` invocations and a `flush` method to immediately invoke them.
             * Provide `options` to indicate whether `func` should be invoked on the
             * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
             * with the last arguments provided to the debounced function. Subsequent
             * calls to the debounced function return the result of the last `func`
             * invocation.
             *
             * **Note:** If `leading` and `trailing` options are `true`, `func` is
             * invoked on the trailing edge of the timeout only if the debounced function
             * is invoked more than once during the `wait` timeout.
             *
             * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
             * until to the next tick, similar to `setTimeout` with a timeout of `0`.
             *
             * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
             * for details over the differences between `_.debounce` and `_.throttle`.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Function
             * @param {Function} func The function to debounce.
             * @param {number} [wait=0] The number of milliseconds to delay.
             * @param {Object} [options={}] The options object.
             * @param {boolean} [options.leading=false]
             *  Specify invoking on the leading edge of the timeout.
             * @param {number} [options.maxWait]
             *  The maximum time `func` is allowed to be delayed before it's invoked.
             * @param {boolean} [options.trailing=true]
             *  Specify invoking on the trailing edge of the timeout.
             * @returns {Function} Returns the new debounced function.
             * @example
             *
             * // Avoid costly calculations while the window size is in flux.
             * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
             *
             * // Invoke `sendMail` when clicked, debouncing subsequent calls.
             * jQuery(element).on('click', _.debounce(sendMail, 300, {
             *   'leading': true,
             *   'trailing': false
             * }));
             *
             * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
             * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
             * var source = new EventSource('/stream');
             * jQuery(source).on('message', debounced);
             *
             * // Cancel the trailing debounced invocation.
             * jQuery(window).on('popstate', debounced.cancel);
             */
            function debounce(func, wait, options) {
                var lastArgs,
                    lastThis,
                    maxWait,
                    result,
                    timerId,
                    lastCallTime,
                    lastInvokeTime = 0,
                    leading = false,
                    maxing = false,
                    trailing = true;

                if (typeof func != "function") {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                wait = toNumber(wait) || 0;
                if (isObject(options)) {
                    leading = !!options.leading;
                    maxing = "maxWait" in options;
                    maxWait = maxing
                        ? nativeMax(toNumber(options.maxWait) || 0, wait)
                        : maxWait;
                    trailing =
                        "trailing" in options ? !!options.trailing : trailing;
                }

                function invokeFunc(time) {
                    var args = lastArgs,
                        thisArg = lastThis;

                    lastArgs = lastThis = undefined;
                    lastInvokeTime = time;
                    result = func.apply(thisArg, args);
                    return result;
                }

                function leadingEdge(time) {
                    // Reset any `maxWait` timer.
                    lastInvokeTime = time;
                    // Start the timer for the trailing edge.
                    timerId = setTimeout(timerExpired, wait);
                    // Invoke the leading edge.
                    return leading ? invokeFunc(time) : result;
                }

                function remainingWait(time) {
                    var timeSinceLastCall = time - lastCallTime,
                        timeSinceLastInvoke = time - lastInvokeTime,
                        result = wait - timeSinceLastCall;

                    return maxing
                        ? nativeMin(result, maxWait - timeSinceLastInvoke)
                        : result;
                }

                function shouldInvoke(time) {
                    var timeSinceLastCall = time - lastCallTime,
                        timeSinceLastInvoke = time - lastInvokeTime;

                    // Either this is the first call, activity has stopped and we're at the
                    // trailing edge, the system time has gone backwards and we're treating
                    // it as the trailing edge, or we've hit the `maxWait` limit.
                    return (
                        lastCallTime === undefined ||
                        timeSinceLastCall >= wait ||
                        timeSinceLastCall < 0 ||
                        (maxing && timeSinceLastInvoke >= maxWait)
                    );
                }

                function timerExpired() {
                    var time = now();
                    if (shouldInvoke(time)) {
                        return trailingEdge(time);
                    }
                    // Restart the timer.
                    timerId = setTimeout(timerExpired, remainingWait(time));
                }

                function trailingEdge(time) {
                    timerId = undefined;

                    // Only invoke if we have `lastArgs` which means `func` has been
                    // debounced at least once.
                    if (trailing && lastArgs) {
                        return invokeFunc(time);
                    }
                    lastArgs = lastThis = undefined;
                    return result;
                }

                function cancel() {
                    if (timerId !== undefined) {
                        clearTimeout(timerId);
                    }
                    lastInvokeTime = 0;
                    lastArgs = lastCallTime = lastThis = timerId = undefined;
                }

                function flush() {
                    return timerId === undefined ? result : trailingEdge(now());
                }

                function debounced() {
                    var time = now(),
                        isInvoking = shouldInvoke(time);

                    lastArgs = arguments;
                    lastThis = this;
                    lastCallTime = time;

                    if (isInvoking) {
                        if (timerId === undefined) {
                            return leadingEdge(lastCallTime);
                        }
                        if (maxing) {
                            // Handle invocations in a tight loop.
                            timerId = setTimeout(timerExpired, wait);
                            return invokeFunc(lastCallTime);
                        }
                    }
                    if (timerId === undefined) {
                        timerId = setTimeout(timerExpired, wait);
                    }
                    return result;
                }
                debounced.cancel = cancel;
                debounced.flush = flush;
                return debounced;
            }

            /**
             * Creates a throttled function that only invokes `func` at most once per
             * every `wait` milliseconds. The throttled function comes with a `cancel`
             * method to cancel delayed `func` invocations and a `flush` method to
             * immediately invoke them. Provide `options` to indicate whether `func`
             * should be invoked on the leading and/or trailing edge of the `wait`
             * timeout. The `func` is invoked with the last arguments provided to the
             * throttled function. Subsequent calls to the throttled function return the
             * result of the last `func` invocation.
             *
             * **Note:** If `leading` and `trailing` options are `true`, `func` is
             * invoked on the trailing edge of the timeout only if the throttled function
             * is invoked more than once during the `wait` timeout.
             *
             * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
             * until to the next tick, similar to `setTimeout` with a timeout of `0`.
             *
             * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
             * for details over the differences between `_.throttle` and `_.debounce`.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Function
             * @param {Function} func The function to throttle.
             * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
             * @param {Object} [options={}] The options object.
             * @param {boolean} [options.leading=true]
             *  Specify invoking on the leading edge of the timeout.
             * @param {boolean} [options.trailing=true]
             *  Specify invoking on the trailing edge of the timeout.
             * @returns {Function} Returns the new throttled function.
             * @example
             *
             * // Avoid excessively updating the position while scrolling.
             * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
             *
             * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
             * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
             * jQuery(element).on('click', throttled);
             *
             * // Cancel the trailing throttled invocation.
             * jQuery(window).on('popstate', throttled.cancel);
             */
            function throttle(func, wait, options) {
                var leading = true,
                    trailing = true;

                if (typeof func != "function") {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                if (isObject(options)) {
                    leading =
                        "leading" in options ? !!options.leading : leading;
                    trailing =
                        "trailing" in options ? !!options.trailing : trailing;
                }
                return debounce(func, wait, {
                    leading: leading,
                    maxWait: wait,
                    trailing: trailing,
                });
            }

            /**
             * Checks if `value` is the
             * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
             * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an object, else `false`.
             * @example
             *
             * _.isObject({});
             * // => true
             *
             * _.isObject([1, 2, 3]);
             * // => true
             *
             * _.isObject(_.noop);
             * // => true
             *
             * _.isObject(null);
             * // => false
             */
            function isObject(value) {
                var type = typeof value;
                return !!value && (type == "object" || type == "function");
            }

            /**
             * Checks if `value` is object-like. A value is object-like if it's not `null`
             * and has a `typeof` result of "object".
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
             * @example
             *
             * _.isObjectLike({});
             * // => true
             *
             * _.isObjectLike([1, 2, 3]);
             * // => true
             *
             * _.isObjectLike(_.noop);
             * // => false
             *
             * _.isObjectLike(null);
             * // => false
             */
            function isObjectLike(value) {
                return !!value && typeof value == "object";
            }

            /**
             * Checks if `value` is classified as a `Symbol` primitive or object.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
             * @example
             *
             * _.isSymbol(Symbol.iterator);
             * // => true
             *
             * _.isSymbol('abc');
             * // => false
             */
            function isSymbol(value) {
                return (
                    typeof value == "symbol" ||
                    (isObjectLike(value) &&
                        objectToString.call(value) == symbolTag)
                );
            }

            /**
             * Converts `value` to a number.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to process.
             * @returns {number} Returns the number.
             * @example
             *
             * _.toNumber(3.2);
             * // => 3.2
             *
             * _.toNumber(Number.MIN_VALUE);
             * // => 5e-324
             *
             * _.toNumber(Infinity);
             * // => Infinity
             *
             * _.toNumber('3.2');
             * // => 3.2
             */
            function toNumber(value) {
                if (typeof value == "number") {
                    return value;
                }
                if (isSymbol(value)) {
                    return NAN;
                }
                if (isObject(value)) {
                    var other =
                        typeof value.valueOf == "function"
                            ? value.valueOf()
                            : value;
                    value = isObject(other) ? other + "" : other;
                }
                if (typeof value != "string") {
                    return value === 0 ? value : +value;
                }
                value = value.replace(reTrim, "");
                var isBinary = reIsBinary.test(value);
                return isBinary || reIsOctal.test(value)
                    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
                    : reIsBadHex.test(value)
                    ? NAN
                    : +value;
            }

            module.exports = throttle;

            /***/
        },

        /***/ 845: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var safeIsNaN =
                Number.isNaN ||
                function ponyfill(value) {
                    return typeof value === "number" && value !== value;
                };
            function isEqual(first, second) {
                if (first === second) {
                    return true;
                }
                if (safeIsNaN(first) && safeIsNaN(second)) {
                    return true;
                }
                return false;
            }
            function areInputsEqual(newInputs, lastInputs) {
                if (newInputs.length !== lastInputs.length) {
                    return false;
                }
                for (var i = 0; i < newInputs.length; i++) {
                    if (!isEqual(newInputs[i], lastInputs[i])) {
                        return false;
                    }
                }
                return true;
            }

            function memoizeOne(resultFn, isEqual) {
                if (isEqual === void 0) {
                    isEqual = areInputsEqual;
                }
                var lastThis;
                var lastArgs = [];
                var lastResult;
                var calledOnce = false;
                function memoized() {
                    var newArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        newArgs[_i] = arguments[_i];
                    }
                    if (
                        calledOnce &&
                        lastThis === this &&
                        isEqual(newArgs, lastArgs)
                    ) {
                        return lastResult;
                    }
                    lastResult = resultFn.apply(this, newArgs);
                    calledOnce = true;
                    lastThis = this;
                    lastArgs = newArgs;
                    return lastResult;
                }
                return memoized;
            }

            /* harmony default export */ __webpack_exports__["default"] =
                memoizeOne;

            /***/
        },

        /***/ 4193: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var wildcard = __webpack_require__(1196);
            var reMimePartSplit = /[\/\+\.]/;

            /**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
            module.exports = function (target, pattern) {
                function test(pattern) {
                    var result = wildcard(pattern, target, reMimePartSplit);

                    // ensure that we have a valid mime type (should have two parts)
                    return result && result.length >= 2;
                }

                return pattern ? test(pattern.split(";")[0]) : test;
            };

            /***/
        },

        /***/ 4800: /***/ function (module) {
            /**
             * Create an event emitter with namespaces
             * @name createNamespaceEmitter
             * @example
             * var emitter = require('./index')()
             *
             * emitter.on('*', function () {
             *   console.log('all events emitted', this.event)
             * })
             *
             * emitter.on('example', function () {
             *   console.log('example event emitted')
             * })
             */
            module.exports = function createNamespaceEmitter() {
                var emitter = {};
                var _fns = (emitter._fns = {});

                /**
                 * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
                 * @name emit
                 * @param {String} event – the name of the event, with optional namespace
                 * @param {...*} data – up to 6 arguments that are passed to the event listener
                 * @example
                 * emitter.emit('example')
                 * emitter.emit('demo:test')
                 * emitter.emit('data', { example: true}, 'a string', 1)
                 */
                emitter.emit = function emit(
                    event,
                    arg1,
                    arg2,
                    arg3,
                    arg4,
                    arg5,
                    arg6
                ) {
                    var toEmit = getListeners(event);

                    if (toEmit.length) {
                        emitAll(event, toEmit, [
                            arg1,
                            arg2,
                            arg3,
                            arg4,
                            arg5,
                            arg6,
                        ]);
                    }
                };

                /**
                 * Create en event listener.
                 * @name on
                 * @param {String} event
                 * @param {Function} fn
                 * @example
                 * emitter.on('example', function () {})
                 * emitter.on('demo', function () {})
                 */
                emitter.on = function on(event, fn) {
                    if (!_fns[event]) {
                        _fns[event] = [];
                    }

                    _fns[event].push(fn);
                };

                /**
                 * Create en event listener that fires once.
                 * @name once
                 * @param {String} event
                 * @param {Function} fn
                 * @example
                 * emitter.once('example', function () {})
                 * emitter.once('demo', function () {})
                 */
                emitter.once = function once(event, fn) {
                    function one() {
                        fn.apply(this, arguments);
                        emitter.off(event, one);
                    }
                    this.on(event, one);
                };

                /**
                 * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
                 * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
                 * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
                 * @name off
                 * @param {String} event
                 * @param {Function} [fn] – the specific handler
                 * @example
                 * emitter.off('example')
                 * emitter.off('demo', function () {})
                 */
                emitter.off = function off(event, fn) {
                    var keep = [];

                    if (event && fn) {
                        var fns = this._fns[event];
                        var i = 0;
                        var l = fns ? fns.length : 0;

                        for (i; i < l; i++) {
                            if (fns[i] !== fn) {
                                keep.push(fns[i]);
                            }
                        }
                    }

                    keep.length
                        ? (this._fns[event] = keep)
                        : delete this._fns[event];
                };

                function getListeners(e) {
                    var out = _fns[e] ? _fns[e] : [];
                    var idx = e.indexOf(":");
                    var args =
                        idx === -1
                            ? [e]
                            : [e.substring(0, idx), e.substring(idx + 1)];

                    var keys = Object.keys(_fns);
                    var i = 0;
                    var l = keys.length;

                    for (i; i < l; i++) {
                        var key = keys[i];
                        if (key === "*") {
                            out = out.concat(_fns[key]);
                        }

                        if (args.length === 2 && args[0] === key) {
                            out = out.concat(_fns[key]);
                            break;
                        }
                    }

                    return out;
                }

                function emitAll(e, fns, args) {
                    var i = 0;
                    var l = fns.length;

                    for (i; i < l; i++) {
                        if (!fns[i]) break;
                        fns[i].event = e;
                        fns[i].apply(fns[i], args);
                    }
                }

                return emitter;
            };

            /***/
        },

        /***/ 3454: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var ref, ref1;
            module.exports =
                ((ref = __webpack_require__.g.process) === null ||
                ref === void 0
                    ? void 0
                    : ref.env) &&
                typeof ((ref1 = __webpack_require__.g.process) === null ||
                ref1 === void 0
                    ? void 0
                    : ref1.env) === "object"
                    ? __webpack_require__.g.process
                    : __webpack_require__(7663);

            //# sourceMappingURL=process.js.map

            /***/
        },

        /***/ 1876: /***/ function (module) {
            var __dirname = "/";
            (function () {
                var e = {
                    991: function (e, r) {
                        "use strict";
                        r.byteLength = byteLength;
                        r.toByteArray = toByteArray;
                        r.fromByteArray = fromByteArray;
                        var t = [];
                        var f = [];
                        var n =
                            typeof Uint8Array !== "undefined"
                                ? Uint8Array
                                : Array;
                        var i =
                            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        for (var o = 0, u = i.length; o < u; ++o) {
                            t[o] = i[o];
                            f[i.charCodeAt(o)] = o;
                        }
                        f["-".charCodeAt(0)] = 62;
                        f["_".charCodeAt(0)] = 63;
                        function getLens(e) {
                            var r = e.length;
                            if (r % 4 > 0) {
                                throw new Error(
                                    "Invalid string. Length must be a multiple of 4"
                                );
                            }
                            var t = e.indexOf("=");
                            if (t === -1) t = r;
                            var f = t === r ? 0 : 4 - (t % 4);
                            return [t, f];
                        }
                        function byteLength(e) {
                            var r = getLens(e);
                            var t = r[0];
                            var f = r[1];
                            return ((t + f) * 3) / 4 - f;
                        }
                        function _byteLength(e, r, t) {
                            return ((r + t) * 3) / 4 - t;
                        }
                        function toByteArray(e) {
                            var r;
                            var t = getLens(e);
                            var i = t[0];
                            var o = t[1];
                            var u = new n(_byteLength(e, i, o));
                            var a = 0;
                            var s = o > 0 ? i - 4 : i;
                            var h;
                            for (h = 0; h < s; h += 4) {
                                r =
                                    (f[e.charCodeAt(h)] << 18) |
                                    (f[e.charCodeAt(h + 1)] << 12) |
                                    (f[e.charCodeAt(h + 2)] << 6) |
                                    f[e.charCodeAt(h + 3)];
                                u[a++] = (r >> 16) & 255;
                                u[a++] = (r >> 8) & 255;
                                u[a++] = r & 255;
                            }
                            if (o === 2) {
                                r =
                                    (f[e.charCodeAt(h)] << 2) |
                                    (f[e.charCodeAt(h + 1)] >> 4);
                                u[a++] = r & 255;
                            }
                            if (o === 1) {
                                r =
                                    (f[e.charCodeAt(h)] << 10) |
                                    (f[e.charCodeAt(h + 1)] << 4) |
                                    (f[e.charCodeAt(h + 2)] >> 2);
                                u[a++] = (r >> 8) & 255;
                                u[a++] = r & 255;
                            }
                            return u;
                        }
                        function tripletToBase64(e) {
                            return (
                                t[(e >> 18) & 63] +
                                t[(e >> 12) & 63] +
                                t[(e >> 6) & 63] +
                                t[e & 63]
                            );
                        }
                        function encodeChunk(e, r, t) {
                            var f;
                            var n = [];
                            for (var i = r; i < t; i += 3) {
                                f =
                                    ((e[i] << 16) & 16711680) +
                                    ((e[i + 1] << 8) & 65280) +
                                    (e[i + 2] & 255);
                                n.push(tripletToBase64(f));
                            }
                            return n.join("");
                        }
                        function fromByteArray(e) {
                            var r;
                            var f = e.length;
                            var n = f % 3;
                            var i = [];
                            var o = 16383;
                            for (var u = 0, a = f - n; u < a; u += o) {
                                i.push(
                                    encodeChunk(e, u, u + o > a ? a : u + o)
                                );
                            }
                            if (n === 1) {
                                r = e[f - 1];
                                i.push(t[r >> 2] + t[(r << 4) & 63] + "==");
                            } else if (n === 2) {
                                r = (e[f - 2] << 8) + e[f - 1];
                                i.push(
                                    t[r >> 10] +
                                        t[(r >> 4) & 63] +
                                        t[(r << 2) & 63] +
                                        "="
                                );
                            }
                            return i.join("");
                        }
                    },
                    293: function (e, r, t) {
                        "use strict";
                        /*!
                         * The buffer module from node.js, for the browser.
                         *
                         * @author   Feross Aboukhadijeh <https://feross.org>
                         * @license  MIT
                         */ var f = t(991);
                        var n = t(759);
                        var i =
                            typeof Symbol === "function" &&
                            typeof Symbol.for === "function"
                                ? Symbol.for("nodejs.util.inspect.custom")
                                : null;
                        r.Buffer = Buffer;
                        r.SlowBuffer = SlowBuffer;
                        r.INSPECT_MAX_BYTES = 50;
                        var o = 2147483647;
                        r.kMaxLength = o;
                        Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
                        if (
                            !Buffer.TYPED_ARRAY_SUPPORT &&
                            typeof console !== "undefined" &&
                            typeof console.error === "function"
                        ) {
                            console.error(
                                "This browser lacks typed array (Uint8Array) support which is required by " +
                                    "`buffer` v5.x. Use `buffer` v4.x if you require old browser support."
                            );
                        }
                        function typedArraySupport() {
                            try {
                                var e = new Uint8Array(1);
                                var r = {
                                    foo: function () {
                                        return 42;
                                    },
                                };
                                Object.setPrototypeOf(r, Uint8Array.prototype);
                                Object.setPrototypeOf(e, r);
                                return e.foo() === 42;
                            } catch (e) {
                                return false;
                            }
                        }
                        Object.defineProperty(Buffer.prototype, "parent", {
                            enumerable: true,
                            get: function () {
                                if (!Buffer.isBuffer(this)) return undefined;
                                return this.buffer;
                            },
                        });
                        Object.defineProperty(Buffer.prototype, "offset", {
                            enumerable: true,
                            get: function () {
                                if (!Buffer.isBuffer(this)) return undefined;
                                return this.byteOffset;
                            },
                        });
                        function createBuffer(e) {
                            if (e > o) {
                                throw new RangeError(
                                    'The value "' +
                                        e +
                                        '" is invalid for option "size"'
                                );
                            }
                            var r = new Uint8Array(e);
                            Object.setPrototypeOf(r, Buffer.prototype);
                            return r;
                        }
                        function Buffer(e, r, t) {
                            if (typeof e === "number") {
                                if (typeof r === "string") {
                                    throw new TypeError(
                                        'The "string" argument must be of type string. Received type number'
                                    );
                                }
                                return allocUnsafe(e);
                            }
                            return from(e, r, t);
                        }
                        Buffer.poolSize = 8192;
                        function from(e, r, t) {
                            if (typeof e === "string") {
                                return fromString(e, r);
                            }
                            if (ArrayBuffer.isView(e)) {
                                return fromArrayLike(e);
                            }
                            if (e == null) {
                                throw new TypeError(
                                    "The first argument must be one of type string, Buffer, ArrayBuffer, Array, " +
                                        "or Array-like Object. Received type " +
                                        typeof e
                                );
                            }
                            if (
                                isInstance(e, ArrayBuffer) ||
                                (e && isInstance(e.buffer, ArrayBuffer))
                            ) {
                                return fromArrayBuffer(e, r, t);
                            }
                            if (
                                typeof SharedArrayBuffer !== "undefined" &&
                                (isInstance(e, SharedArrayBuffer) ||
                                    (e &&
                                        isInstance(
                                            e.buffer,
                                            SharedArrayBuffer
                                        )))
                            ) {
                                return fromArrayBuffer(e, r, t);
                            }
                            if (typeof e === "number") {
                                throw new TypeError(
                                    'The "value" argument must not be of type number. Received type number'
                                );
                            }
                            var f = e.valueOf && e.valueOf();
                            if (f != null && f !== e) {
                                return Buffer.from(f, r, t);
                            }
                            var n = fromObject(e);
                            if (n) return n;
                            if (
                                typeof Symbol !== "undefined" &&
                                Symbol.toPrimitive != null &&
                                typeof e[Symbol.toPrimitive] === "function"
                            ) {
                                return Buffer.from(
                                    e[Symbol.toPrimitive]("string"),
                                    r,
                                    t
                                );
                            }
                            throw new TypeError(
                                "The first argument must be one of type string, Buffer, ArrayBuffer, Array, " +
                                    "or Array-like Object. Received type " +
                                    typeof e
                            );
                        }
                        Buffer.from = function (e, r, t) {
                            return from(e, r, t);
                        };
                        Object.setPrototypeOf(
                            Buffer.prototype,
                            Uint8Array.prototype
                        );
                        Object.setPrototypeOf(Buffer, Uint8Array);
                        function assertSize(e) {
                            if (typeof e !== "number") {
                                throw new TypeError(
                                    '"size" argument must be of type number'
                                );
                            } else if (e < 0) {
                                throw new RangeError(
                                    'The value "' +
                                        e +
                                        '" is invalid for option "size"'
                                );
                            }
                        }
                        function alloc(e, r, t) {
                            assertSize(e);
                            if (e <= 0) {
                                return createBuffer(e);
                            }
                            if (r !== undefined) {
                                return typeof t === "string"
                                    ? createBuffer(e).fill(r, t)
                                    : createBuffer(e).fill(r);
                            }
                            return createBuffer(e);
                        }
                        Buffer.alloc = function (e, r, t) {
                            return alloc(e, r, t);
                        };
                        function allocUnsafe(e) {
                            assertSize(e);
                            return createBuffer(e < 0 ? 0 : checked(e) | 0);
                        }
                        Buffer.allocUnsafe = function (e) {
                            return allocUnsafe(e);
                        };
                        Buffer.allocUnsafeSlow = function (e) {
                            return allocUnsafe(e);
                        };
                        function fromString(e, r) {
                            if (typeof r !== "string" || r === "") {
                                r = "utf8";
                            }
                            if (!Buffer.isEncoding(r)) {
                                throw new TypeError("Unknown encoding: " + r);
                            }
                            var t = byteLength(e, r) | 0;
                            var f = createBuffer(t);
                            var n = f.write(e, r);
                            if (n !== t) {
                                f = f.slice(0, n);
                            }
                            return f;
                        }
                        function fromArrayLike(e) {
                            var r = e.length < 0 ? 0 : checked(e.length) | 0;
                            var t = createBuffer(r);
                            for (var f = 0; f < r; f += 1) {
                                t[f] = e[f] & 255;
                            }
                            return t;
                        }
                        function fromArrayBuffer(e, r, t) {
                            if (r < 0 || e.byteLength < r) {
                                throw new RangeError(
                                    '"offset" is outside of buffer bounds'
                                );
                            }
                            if (e.byteLength < r + (t || 0)) {
                                throw new RangeError(
                                    '"length" is outside of buffer bounds'
                                );
                            }
                            var f;
                            if (r === undefined && t === undefined) {
                                f = new Uint8Array(e);
                            } else if (t === undefined) {
                                f = new Uint8Array(e, r);
                            } else {
                                f = new Uint8Array(e, r, t);
                            }
                            Object.setPrototypeOf(f, Buffer.prototype);
                            return f;
                        }
                        function fromObject(e) {
                            if (Buffer.isBuffer(e)) {
                                var r = checked(e.length) | 0;
                                var t = createBuffer(r);
                                if (t.length === 0) {
                                    return t;
                                }
                                e.copy(t, 0, 0, r);
                                return t;
                            }
                            if (e.length !== undefined) {
                                if (
                                    typeof e.length !== "number" ||
                                    numberIsNaN(e.length)
                                ) {
                                    return createBuffer(0);
                                }
                                return fromArrayLike(e);
                            }
                            if (e.type === "Buffer" && Array.isArray(e.data)) {
                                return fromArrayLike(e.data);
                            }
                        }
                        function checked(e) {
                            if (e >= o) {
                                throw new RangeError(
                                    "Attempt to allocate Buffer larger than maximum " +
                                        "size: 0x" +
                                        o.toString(16) +
                                        " bytes"
                                );
                            }
                            return e | 0;
                        }
                        function SlowBuffer(e) {
                            if (+e != e) {
                                e = 0;
                            }
                            return Buffer.alloc(+e);
                        }
                        Buffer.isBuffer = function isBuffer(e) {
                            return (
                                e != null &&
                                e._isBuffer === true &&
                                e !== Buffer.prototype
                            );
                        };
                        Buffer.compare = function compare(e, r) {
                            if (isInstance(e, Uint8Array))
                                e = Buffer.from(e, e.offset, e.byteLength);
                            if (isInstance(r, Uint8Array))
                                r = Buffer.from(r, r.offset, r.byteLength);
                            if (!Buffer.isBuffer(e) || !Buffer.isBuffer(r)) {
                                throw new TypeError(
                                    'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
                                );
                            }
                            if (e === r) return 0;
                            var t = e.length;
                            var f = r.length;
                            for (var n = 0, i = Math.min(t, f); n < i; ++n) {
                                if (e[n] !== r[n]) {
                                    t = e[n];
                                    f = r[n];
                                    break;
                                }
                            }
                            if (t < f) return -1;
                            if (f < t) return 1;
                            return 0;
                        };
                        Buffer.isEncoding = function isEncoding(e) {
                            switch (String(e).toLowerCase()) {
                                case "hex":
                                case "utf8":
                                case "utf-8":
                                case "ascii":
                                case "latin1":
                                case "binary":
                                case "base64":
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return true;
                                default:
                                    return false;
                            }
                        };
                        Buffer.concat = function concat(e, r) {
                            if (!Array.isArray(e)) {
                                throw new TypeError(
                                    '"list" argument must be an Array of Buffers'
                                );
                            }
                            if (e.length === 0) {
                                return Buffer.alloc(0);
                            }
                            var t;
                            if (r === undefined) {
                                r = 0;
                                for (t = 0; t < e.length; ++t) {
                                    r += e[t].length;
                                }
                            }
                            var f = Buffer.allocUnsafe(r);
                            var n = 0;
                            for (t = 0; t < e.length; ++t) {
                                var i = e[t];
                                if (isInstance(i, Uint8Array)) {
                                    i = Buffer.from(i);
                                }
                                if (!Buffer.isBuffer(i)) {
                                    throw new TypeError(
                                        '"list" argument must be an Array of Buffers'
                                    );
                                }
                                i.copy(f, n);
                                n += i.length;
                            }
                            return f;
                        };
                        function byteLength(e, r) {
                            if (Buffer.isBuffer(e)) {
                                return e.length;
                            }
                            if (
                                ArrayBuffer.isView(e) ||
                                isInstance(e, ArrayBuffer)
                            ) {
                                return e.byteLength;
                            }
                            if (typeof e !== "string") {
                                throw new TypeError(
                                    'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
                                        "Received type " +
                                        typeof e
                                );
                            }
                            var t = e.length;
                            var f =
                                arguments.length > 2 && arguments[2] === true;
                            if (!f && t === 0) return 0;
                            var n = false;
                            for (;;) {
                                switch (r) {
                                    case "ascii":
                                    case "latin1":
                                    case "binary":
                                        return t;
                                    case "utf8":
                                    case "utf-8":
                                        return utf8ToBytes(e).length;
                                    case "ucs2":
                                    case "ucs-2":
                                    case "utf16le":
                                    case "utf-16le":
                                        return t * 2;
                                    case "hex":
                                        return t >>> 1;
                                    case "base64":
                                        return base64ToBytes(e).length;
                                    default:
                                        if (n) {
                                            return f
                                                ? -1
                                                : utf8ToBytes(e).length;
                                        }
                                        r = ("" + r).toLowerCase();
                                        n = true;
                                }
                            }
                        }
                        Buffer.byteLength = byteLength;
                        function slowToString(e, r, t) {
                            var f = false;
                            if (r === undefined || r < 0) {
                                r = 0;
                            }
                            if (r > this.length) {
                                return "";
                            }
                            if (t === undefined || t > this.length) {
                                t = this.length;
                            }
                            if (t <= 0) {
                                return "";
                            }
                            t >>>= 0;
                            r >>>= 0;
                            if (t <= r) {
                                return "";
                            }
                            if (!e) e = "utf8";
                            while (true) {
                                switch (e) {
                                    case "hex":
                                        return hexSlice(this, r, t);
                                    case "utf8":
                                    case "utf-8":
                                        return utf8Slice(this, r, t);
                                    case "ascii":
                                        return asciiSlice(this, r, t);
                                    case "latin1":
                                    case "binary":
                                        return latin1Slice(this, r, t);
                                    case "base64":
                                        return base64Slice(this, r, t);
                                    case "ucs2":
                                    case "ucs-2":
                                    case "utf16le":
                                    case "utf-16le":
                                        return utf16leSlice(this, r, t);
                                    default:
                                        if (f)
                                            throw new TypeError(
                                                "Unknown encoding: " + e
                                            );
                                        e = (e + "").toLowerCase();
                                        f = true;
                                }
                            }
                        }
                        Buffer.prototype._isBuffer = true;
                        function swap(e, r, t) {
                            var f = e[r];
                            e[r] = e[t];
                            e[t] = f;
                        }
                        Buffer.prototype.swap16 = function swap16() {
                            var e = this.length;
                            if (e % 2 !== 0) {
                                throw new RangeError(
                                    "Buffer size must be a multiple of 16-bits"
                                );
                            }
                            for (var r = 0; r < e; r += 2) {
                                swap(this, r, r + 1);
                            }
                            return this;
                        };
                        Buffer.prototype.swap32 = function swap32() {
                            var e = this.length;
                            if (e % 4 !== 0) {
                                throw new RangeError(
                                    "Buffer size must be a multiple of 32-bits"
                                );
                            }
                            for (var r = 0; r < e; r += 4) {
                                swap(this, r, r + 3);
                                swap(this, r + 1, r + 2);
                            }
                            return this;
                        };
                        Buffer.prototype.swap64 = function swap64() {
                            var e = this.length;
                            if (e % 8 !== 0) {
                                throw new RangeError(
                                    "Buffer size must be a multiple of 64-bits"
                                );
                            }
                            for (var r = 0; r < e; r += 8) {
                                swap(this, r, r + 7);
                                swap(this, r + 1, r + 6);
                                swap(this, r + 2, r + 5);
                                swap(this, r + 3, r + 4);
                            }
                            return this;
                        };
                        Buffer.prototype.toString = function toString() {
                            var e = this.length;
                            if (e === 0) return "";
                            if (arguments.length === 0)
                                return utf8Slice(this, 0, e);
                            return slowToString.apply(this, arguments);
                        };
                        Buffer.prototype.toLocaleString =
                            Buffer.prototype.toString;
                        Buffer.prototype.equals = function equals(e) {
                            if (!Buffer.isBuffer(e))
                                throw new TypeError(
                                    "Argument must be a Buffer"
                                );
                            if (this === e) return true;
                            return Buffer.compare(this, e) === 0;
                        };
                        Buffer.prototype.inspect = function inspect() {
                            var e = "";
                            var t = r.INSPECT_MAX_BYTES;
                            e = this.toString("hex", 0, t)
                                .replace(/(.{2})/g, "$1 ")
                                .trim();
                            if (this.length > t) e += " ... ";
                            return "<Buffer " + e + ">";
                        };
                        if (i) {
                            Buffer.prototype[i] = Buffer.prototype.inspect;
                        }
                        Buffer.prototype.compare = function compare(
                            e,
                            r,
                            t,
                            f,
                            n
                        ) {
                            if (isInstance(e, Uint8Array)) {
                                e = Buffer.from(e, e.offset, e.byteLength);
                            }
                            if (!Buffer.isBuffer(e)) {
                                throw new TypeError(
                                    'The "target" argument must be one of type Buffer or Uint8Array. ' +
                                        "Received type " +
                                        typeof e
                                );
                            }
                            if (r === undefined) {
                                r = 0;
                            }
                            if (t === undefined) {
                                t = e ? e.length : 0;
                            }
                            if (f === undefined) {
                                f = 0;
                            }
                            if (n === undefined) {
                                n = this.length;
                            }
                            if (
                                r < 0 ||
                                t > e.length ||
                                f < 0 ||
                                n > this.length
                            ) {
                                throw new RangeError("out of range index");
                            }
                            if (f >= n && r >= t) {
                                return 0;
                            }
                            if (f >= n) {
                                return -1;
                            }
                            if (r >= t) {
                                return 1;
                            }
                            r >>>= 0;
                            t >>>= 0;
                            f >>>= 0;
                            n >>>= 0;
                            if (this === e) return 0;
                            var i = n - f;
                            var o = t - r;
                            var u = Math.min(i, o);
                            var a = this.slice(f, n);
                            var s = e.slice(r, t);
                            for (var h = 0; h < u; ++h) {
                                if (a[h] !== s[h]) {
                                    i = a[h];
                                    o = s[h];
                                    break;
                                }
                            }
                            if (i < o) return -1;
                            if (o < i) return 1;
                            return 0;
                        };
                        function bidirectionalIndexOf(e, r, t, f, n) {
                            if (e.length === 0) return -1;
                            if (typeof t === "string") {
                                f = t;
                                t = 0;
                            } else if (t > 2147483647) {
                                t = 2147483647;
                            } else if (t < -2147483648) {
                                t = -2147483648;
                            }
                            t = +t;
                            if (numberIsNaN(t)) {
                                t = n ? 0 : e.length - 1;
                            }
                            if (t < 0) t = e.length + t;
                            if (t >= e.length) {
                                if (n) return -1;
                                else t = e.length - 1;
                            } else if (t < 0) {
                                if (n) t = 0;
                                else return -1;
                            }
                            if (typeof r === "string") {
                                r = Buffer.from(r, f);
                            }
                            if (Buffer.isBuffer(r)) {
                                if (r.length === 0) {
                                    return -1;
                                }
                                return arrayIndexOf(e, r, t, f, n);
                            } else if (typeof r === "number") {
                                r = r & 255;
                                if (
                                    typeof Uint8Array.prototype.indexOf ===
                                    "function"
                                ) {
                                    if (n) {
                                        return Uint8Array.prototype.indexOf.call(
                                            e,
                                            r,
                                            t
                                        );
                                    } else {
                                        return Uint8Array.prototype.lastIndexOf.call(
                                            e,
                                            r,
                                            t
                                        );
                                    }
                                }
                                return arrayIndexOf(e, [r], t, f, n);
                            }
                            throw new TypeError(
                                "val must be string, number or Buffer"
                            );
                        }
                        function arrayIndexOf(e, r, t, f, n) {
                            var i = 1;
                            var o = e.length;
                            var u = r.length;
                            if (f !== undefined) {
                                f = String(f).toLowerCase();
                                if (
                                    f === "ucs2" ||
                                    f === "ucs-2" ||
                                    f === "utf16le" ||
                                    f === "utf-16le"
                                ) {
                                    if (e.length < 2 || r.length < 2) {
                                        return -1;
                                    }
                                    i = 2;
                                    o /= 2;
                                    u /= 2;
                                    t /= 2;
                                }
                            }
                            function read(e, r) {
                                if (i === 1) {
                                    return e[r];
                                } else {
                                    return e.readUInt16BE(r * i);
                                }
                            }
                            var a;
                            if (n) {
                                var s = -1;
                                for (a = t; a < o; a++) {
                                    if (
                                        read(e, a) ===
                                        read(r, s === -1 ? 0 : a - s)
                                    ) {
                                        if (s === -1) s = a;
                                        if (a - s + 1 === u) return s * i;
                                    } else {
                                        if (s !== -1) a -= a - s;
                                        s = -1;
                                    }
                                }
                            } else {
                                if (t + u > o) t = o - u;
                                for (a = t; a >= 0; a--) {
                                    var h = true;
                                    for (var c = 0; c < u; c++) {
                                        if (read(e, a + c) !== read(r, c)) {
                                            h = false;
                                            break;
                                        }
                                    }
                                    if (h) return a;
                                }
                            }
                            return -1;
                        }
                        Buffer.prototype.includes = function includes(e, r, t) {
                            return this.indexOf(e, r, t) !== -1;
                        };
                        Buffer.prototype.indexOf = function indexOf(e, r, t) {
                            return bidirectionalIndexOf(this, e, r, t, true);
                        };
                        Buffer.prototype.lastIndexOf = function lastIndexOf(
                            e,
                            r,
                            t
                        ) {
                            return bidirectionalIndexOf(this, e, r, t, false);
                        };
                        function hexWrite(e, r, t, f) {
                            t = Number(t) || 0;
                            var n = e.length - t;
                            if (!f) {
                                f = n;
                            } else {
                                f = Number(f);
                                if (f > n) {
                                    f = n;
                                }
                            }
                            var i = r.length;
                            if (f > i / 2) {
                                f = i / 2;
                            }
                            for (var o = 0; o < f; ++o) {
                                var u = parseInt(r.substr(o * 2, 2), 16);
                                if (numberIsNaN(u)) return o;
                                e[t + o] = u;
                            }
                            return o;
                        }
                        function utf8Write(e, r, t, f) {
                            return blitBuffer(
                                utf8ToBytes(r, e.length - t),
                                e,
                                t,
                                f
                            );
                        }
                        function asciiWrite(e, r, t, f) {
                            return blitBuffer(asciiToBytes(r), e, t, f);
                        }
                        function latin1Write(e, r, t, f) {
                            return asciiWrite(e, r, t, f);
                        }
                        function base64Write(e, r, t, f) {
                            return blitBuffer(base64ToBytes(r), e, t, f);
                        }
                        function ucs2Write(e, r, t, f) {
                            return blitBuffer(
                                utf16leToBytes(r, e.length - t),
                                e,
                                t,
                                f
                            );
                        }
                        Buffer.prototype.write = function write(e, r, t, f) {
                            if (r === undefined) {
                                f = "utf8";
                                t = this.length;
                                r = 0;
                            } else if (
                                t === undefined &&
                                typeof r === "string"
                            ) {
                                f = r;
                                t = this.length;
                                r = 0;
                            } else if (isFinite(r)) {
                                r = r >>> 0;
                                if (isFinite(t)) {
                                    t = t >>> 0;
                                    if (f === undefined) f = "utf8";
                                } else {
                                    f = t;
                                    t = undefined;
                                }
                            } else {
                                throw new Error(
                                    "Buffer.write(string, encoding, offset[, length]) is no longer supported"
                                );
                            }
                            var n = this.length - r;
                            if (t === undefined || t > n) t = n;
                            if (
                                (e.length > 0 && (t < 0 || r < 0)) ||
                                r > this.length
                            ) {
                                throw new RangeError(
                                    "Attempt to write outside buffer bounds"
                                );
                            }
                            if (!f) f = "utf8";
                            var i = false;
                            for (;;) {
                                switch (f) {
                                    case "hex":
                                        return hexWrite(this, e, r, t);
                                    case "utf8":
                                    case "utf-8":
                                        return utf8Write(this, e, r, t);
                                    case "ascii":
                                        return asciiWrite(this, e, r, t);
                                    case "latin1":
                                    case "binary":
                                        return latin1Write(this, e, r, t);
                                    case "base64":
                                        return base64Write(this, e, r, t);
                                    case "ucs2":
                                    case "ucs-2":
                                    case "utf16le":
                                    case "utf-16le":
                                        return ucs2Write(this, e, r, t);
                                    default:
                                        if (i)
                                            throw new TypeError(
                                                "Unknown encoding: " + f
                                            );
                                        f = ("" + f).toLowerCase();
                                        i = true;
                                }
                            }
                        };
                        Buffer.prototype.toJSON = function toJSON() {
                            return {
                                type: "Buffer",
                                data: Array.prototype.slice.call(
                                    this._arr || this,
                                    0
                                ),
                            };
                        };
                        function base64Slice(e, r, t) {
                            if (r === 0 && t === e.length) {
                                return f.fromByteArray(e);
                            } else {
                                return f.fromByteArray(e.slice(r, t));
                            }
                        }
                        function utf8Slice(e, r, t) {
                            t = Math.min(e.length, t);
                            var f = [];
                            var n = r;
                            while (n < t) {
                                var i = e[n];
                                var o = null;
                                var u =
                                    i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
                                if (n + u <= t) {
                                    var a, s, h, c;
                                    switch (u) {
                                        case 1:
                                            if (i < 128) {
                                                o = i;
                                            }
                                            break;
                                        case 2:
                                            a = e[n + 1];
                                            if ((a & 192) === 128) {
                                                c = ((i & 31) << 6) | (a & 63);
                                                if (c > 127) {
                                                    o = c;
                                                }
                                            }
                                            break;
                                        case 3:
                                            a = e[n + 1];
                                            s = e[n + 2];
                                            if (
                                                (a & 192) === 128 &&
                                                (s & 192) === 128
                                            ) {
                                                c =
                                                    ((i & 15) << 12) |
                                                    ((a & 63) << 6) |
                                                    (s & 63);
                                                if (
                                                    c > 2047 &&
                                                    (c < 55296 || c > 57343)
                                                ) {
                                                    o = c;
                                                }
                                            }
                                            break;
                                        case 4:
                                            a = e[n + 1];
                                            s = e[n + 2];
                                            h = e[n + 3];
                                            if (
                                                (a & 192) === 128 &&
                                                (s & 192) === 128 &&
                                                (h & 192) === 128
                                            ) {
                                                c =
                                                    ((i & 15) << 18) |
                                                    ((a & 63) << 12) |
                                                    ((s & 63) << 6) |
                                                    (h & 63);
                                                if (c > 65535 && c < 1114112) {
                                                    o = c;
                                                }
                                            }
                                    }
                                }
                                if (o === null) {
                                    o = 65533;
                                    u = 1;
                                } else if (o > 65535) {
                                    o -= 65536;
                                    f.push(((o >>> 10) & 1023) | 55296);
                                    o = 56320 | (o & 1023);
                                }
                                f.push(o);
                                n += u;
                            }
                            return decodeCodePointsArray(f);
                        }
                        var u = 4096;
                        function decodeCodePointsArray(e) {
                            var r = e.length;
                            if (r <= u) {
                                return String.fromCharCode.apply(String, e);
                            }
                            var t = "";
                            var f = 0;
                            while (f < r) {
                                t += String.fromCharCode.apply(
                                    String,
                                    e.slice(f, (f += u))
                                );
                            }
                            return t;
                        }
                        function asciiSlice(e, r, t) {
                            var f = "";
                            t = Math.min(e.length, t);
                            for (var n = r; n < t; ++n) {
                                f += String.fromCharCode(e[n] & 127);
                            }
                            return f;
                        }
                        function latin1Slice(e, r, t) {
                            var f = "";
                            t = Math.min(e.length, t);
                            for (var n = r; n < t; ++n) {
                                f += String.fromCharCode(e[n]);
                            }
                            return f;
                        }
                        function hexSlice(e, r, t) {
                            var f = e.length;
                            if (!r || r < 0) r = 0;
                            if (!t || t < 0 || t > f) t = f;
                            var n = "";
                            for (var i = r; i < t; ++i) {
                                n += s[e[i]];
                            }
                            return n;
                        }
                        function utf16leSlice(e, r, t) {
                            var f = e.slice(r, t);
                            var n = "";
                            for (var i = 0; i < f.length; i += 2) {
                                n += String.fromCharCode(f[i] + f[i + 1] * 256);
                            }
                            return n;
                        }
                        Buffer.prototype.slice = function slice(e, r) {
                            var t = this.length;
                            e = ~~e;
                            r = r === undefined ? t : ~~r;
                            if (e < 0) {
                                e += t;
                                if (e < 0) e = 0;
                            } else if (e > t) {
                                e = t;
                            }
                            if (r < 0) {
                                r += t;
                                if (r < 0) r = 0;
                            } else if (r > t) {
                                r = t;
                            }
                            if (r < e) r = e;
                            var f = this.subarray(e, r);
                            Object.setPrototypeOf(f, Buffer.prototype);
                            return f;
                        };
                        function checkOffset(e, r, t) {
                            if (e % 1 !== 0 || e < 0)
                                throw new RangeError("offset is not uint");
                            if (e + r > t)
                                throw new RangeError(
                                    "Trying to access beyond buffer length"
                                );
                        }
                        Buffer.prototype.readUIntLE = function readUIntLE(
                            e,
                            r,
                            t
                        ) {
                            e = e >>> 0;
                            r = r >>> 0;
                            if (!t) checkOffset(e, r, this.length);
                            var f = this[e];
                            var n = 1;
                            var i = 0;
                            while (++i < r && (n *= 256)) {
                                f += this[e + i] * n;
                            }
                            return f;
                        };
                        Buffer.prototype.readUIntBE = function readUIntBE(
                            e,
                            r,
                            t
                        ) {
                            e = e >>> 0;
                            r = r >>> 0;
                            if (!t) {
                                checkOffset(e, r, this.length);
                            }
                            var f = this[e + --r];
                            var n = 1;
                            while (r > 0 && (n *= 256)) {
                                f += this[e + --r] * n;
                            }
                            return f;
                        };
                        Buffer.prototype.readUInt8 = function readUInt8(e, r) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 1, this.length);
                            return this[e];
                        };
                        Buffer.prototype.readUInt16LE = function readUInt16LE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 2, this.length);
                            return this[e] | (this[e + 1] << 8);
                        };
                        Buffer.prototype.readUInt16BE = function readUInt16BE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 2, this.length);
                            return (this[e] << 8) | this[e + 1];
                        };
                        Buffer.prototype.readUInt32LE = function readUInt32LE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 4, this.length);
                            return (
                                (this[e] |
                                    (this[e + 1] << 8) |
                                    (this[e + 2] << 16)) +
                                this[e + 3] * 16777216
                            );
                        };
                        Buffer.prototype.readUInt32BE = function readUInt32BE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 4, this.length);
                            return (
                                this[e] * 16777216 +
                                ((this[e + 1] << 16) |
                                    (this[e + 2] << 8) |
                                    this[e + 3])
                            );
                        };
                        Buffer.prototype.readIntLE = function readIntLE(
                            e,
                            r,
                            t
                        ) {
                            e = e >>> 0;
                            r = r >>> 0;
                            if (!t) checkOffset(e, r, this.length);
                            var f = this[e];
                            var n = 1;
                            var i = 0;
                            while (++i < r && (n *= 256)) {
                                f += this[e + i] * n;
                            }
                            n *= 128;
                            if (f >= n) f -= Math.pow(2, 8 * r);
                            return f;
                        };
                        Buffer.prototype.readIntBE = function readIntBE(
                            e,
                            r,
                            t
                        ) {
                            e = e >>> 0;
                            r = r >>> 0;
                            if (!t) checkOffset(e, r, this.length);
                            var f = r;
                            var n = 1;
                            var i = this[e + --f];
                            while (f > 0 && (n *= 256)) {
                                i += this[e + --f] * n;
                            }
                            n *= 128;
                            if (i >= n) i -= Math.pow(2, 8 * r);
                            return i;
                        };
                        Buffer.prototype.readInt8 = function readInt8(e, r) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 1, this.length);
                            if (!(this[e] & 128)) return this[e];
                            return (255 - this[e] + 1) * -1;
                        };
                        Buffer.prototype.readInt16LE = function readInt16LE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 2, this.length);
                            var t = this[e] | (this[e + 1] << 8);
                            return t & 32768 ? t | 4294901760 : t;
                        };
                        Buffer.prototype.readInt16BE = function readInt16BE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 2, this.length);
                            var t = this[e + 1] | (this[e] << 8);
                            return t & 32768 ? t | 4294901760 : t;
                        };
                        Buffer.prototype.readInt32LE = function readInt32LE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 4, this.length);
                            return (
                                this[e] |
                                (this[e + 1] << 8) |
                                (this[e + 2] << 16) |
                                (this[e + 3] << 24)
                            );
                        };
                        Buffer.prototype.readInt32BE = function readInt32BE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 4, this.length);
                            return (
                                (this[e] << 24) |
                                (this[e + 1] << 16) |
                                (this[e + 2] << 8) |
                                this[e + 3]
                            );
                        };
                        Buffer.prototype.readFloatLE = function readFloatLE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 4, this.length);
                            return n.read(this, e, true, 23, 4);
                        };
                        Buffer.prototype.readFloatBE = function readFloatBE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 4, this.length);
                            return n.read(this, e, false, 23, 4);
                        };
                        Buffer.prototype.readDoubleLE = function readDoubleLE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 8, this.length);
                            return n.read(this, e, true, 52, 8);
                        };
                        Buffer.prototype.readDoubleBE = function readDoubleBE(
                            e,
                            r
                        ) {
                            e = e >>> 0;
                            if (!r) checkOffset(e, 8, this.length);
                            return n.read(this, e, false, 52, 8);
                        };
                        function checkInt(e, r, t, f, n, i) {
                            if (!Buffer.isBuffer(e))
                                throw new TypeError(
                                    '"buffer" argument must be a Buffer instance'
                                );
                            if (r > n || r < i)
                                throw new RangeError(
                                    '"value" argument is out of bounds'
                                );
                            if (t + f > e.length)
                                throw new RangeError("Index out of range");
                        }
                        Buffer.prototype.writeUIntLE = function writeUIntLE(
                            e,
                            r,
                            t,
                            f
                        ) {
                            e = +e;
                            r = r >>> 0;
                            t = t >>> 0;
                            if (!f) {
                                var n = Math.pow(2, 8 * t) - 1;
                                checkInt(this, e, r, t, n, 0);
                            }
                            var i = 1;
                            var o = 0;
                            this[r] = e & 255;
                            while (++o < t && (i *= 256)) {
                                this[r + o] = (e / i) & 255;
                            }
                            return r + t;
                        };
                        Buffer.prototype.writeUIntBE = function writeUIntBE(
                            e,
                            r,
                            t,
                            f
                        ) {
                            e = +e;
                            r = r >>> 0;
                            t = t >>> 0;
                            if (!f) {
                                var n = Math.pow(2, 8 * t) - 1;
                                checkInt(this, e, r, t, n, 0);
                            }
                            var i = t - 1;
                            var o = 1;
                            this[r + i] = e & 255;
                            while (--i >= 0 && (o *= 256)) {
                                this[r + i] = (e / o) & 255;
                            }
                            return r + t;
                        };
                        Buffer.prototype.writeUInt8 = function writeUInt8(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 1, 255, 0);
                            this[r] = e & 255;
                            return r + 1;
                        };
                        Buffer.prototype.writeUInt16LE = function writeUInt16LE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 2, 65535, 0);
                            this[r] = e & 255;
                            this[r + 1] = e >>> 8;
                            return r + 2;
                        };
                        Buffer.prototype.writeUInt16BE = function writeUInt16BE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 2, 65535, 0);
                            this[r] = e >>> 8;
                            this[r + 1] = e & 255;
                            return r + 2;
                        };
                        Buffer.prototype.writeUInt32LE = function writeUInt32LE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                            this[r + 3] = e >>> 24;
                            this[r + 2] = e >>> 16;
                            this[r + 1] = e >>> 8;
                            this[r] = e & 255;
                            return r + 4;
                        };
                        Buffer.prototype.writeUInt32BE = function writeUInt32BE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                            this[r] = e >>> 24;
                            this[r + 1] = e >>> 16;
                            this[r + 2] = e >>> 8;
                            this[r + 3] = e & 255;
                            return r + 4;
                        };
                        Buffer.prototype.writeIntLE = function writeIntLE(
                            e,
                            r,
                            t,
                            f
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!f) {
                                var n = Math.pow(2, 8 * t - 1);
                                checkInt(this, e, r, t, n - 1, -n);
                            }
                            var i = 0;
                            var o = 1;
                            var u = 0;
                            this[r] = e & 255;
                            while (++i < t && (o *= 256)) {
                                if (e < 0 && u === 0 && this[r + i - 1] !== 0) {
                                    u = 1;
                                }
                                this[r + i] = (((e / o) >> 0) - u) & 255;
                            }
                            return r + t;
                        };
                        Buffer.prototype.writeIntBE = function writeIntBE(
                            e,
                            r,
                            t,
                            f
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!f) {
                                var n = Math.pow(2, 8 * t - 1);
                                checkInt(this, e, r, t, n - 1, -n);
                            }
                            var i = t - 1;
                            var o = 1;
                            var u = 0;
                            this[r + i] = e & 255;
                            while (--i >= 0 && (o *= 256)) {
                                if (e < 0 && u === 0 && this[r + i + 1] !== 0) {
                                    u = 1;
                                }
                                this[r + i] = (((e / o) >> 0) - u) & 255;
                            }
                            return r + t;
                        };
                        Buffer.prototype.writeInt8 = function writeInt8(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 1, 127, -128);
                            if (e < 0) e = 255 + e + 1;
                            this[r] = e & 255;
                            return r + 1;
                        };
                        Buffer.prototype.writeInt16LE = function writeInt16LE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 2, 32767, -32768);
                            this[r] = e & 255;
                            this[r + 1] = e >>> 8;
                            return r + 2;
                        };
                        Buffer.prototype.writeInt16BE = function writeInt16BE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t) checkInt(this, e, r, 2, 32767, -32768);
                            this[r] = e >>> 8;
                            this[r + 1] = e & 255;
                            return r + 2;
                        };
                        Buffer.prototype.writeInt32LE = function writeInt32LE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t)
                                checkInt(
                                    this,
                                    e,
                                    r,
                                    4,
                                    2147483647,
                                    -2147483648
                                );
                            this[r] = e & 255;
                            this[r + 1] = e >>> 8;
                            this[r + 2] = e >>> 16;
                            this[r + 3] = e >>> 24;
                            return r + 4;
                        };
                        Buffer.prototype.writeInt32BE = function writeInt32BE(
                            e,
                            r,
                            t
                        ) {
                            e = +e;
                            r = r >>> 0;
                            if (!t)
                                checkInt(
                                    this,
                                    e,
                                    r,
                                    4,
                                    2147483647,
                                    -2147483648
                                );
                            if (e < 0) e = 4294967295 + e + 1;
                            this[r] = e >>> 24;
                            this[r + 1] = e >>> 16;
                            this[r + 2] = e >>> 8;
                            this[r + 3] = e & 255;
                            return r + 4;
                        };
                        function checkIEEE754(e, r, t, f, n, i) {
                            if (t + f > e.length)
                                throw new RangeError("Index out of range");
                            if (t < 0)
                                throw new RangeError("Index out of range");
                        }
                        function writeFloat(e, r, t, f, i) {
                            r = +r;
                            t = t >>> 0;
                            if (!i) {
                                checkIEEE754(
                                    e,
                                    r,
                                    t,
                                    4,
                                    34028234663852886e22,
                                    -34028234663852886e22
                                );
                            }
                            n.write(e, r, t, f, 23, 4);
                            return t + 4;
                        }
                        Buffer.prototype.writeFloatLE = function writeFloatLE(
                            e,
                            r,
                            t
                        ) {
                            return writeFloat(this, e, r, true, t);
                        };
                        Buffer.prototype.writeFloatBE = function writeFloatBE(
                            e,
                            r,
                            t
                        ) {
                            return writeFloat(this, e, r, false, t);
                        };
                        function writeDouble(e, r, t, f, i) {
                            r = +r;
                            t = t >>> 0;
                            if (!i) {
                                checkIEEE754(
                                    e,
                                    r,
                                    t,
                                    8,
                                    17976931348623157e292,
                                    -17976931348623157e292
                                );
                            }
                            n.write(e, r, t, f, 52, 8);
                            return t + 8;
                        }
                        Buffer.prototype.writeDoubleLE = function writeDoubleLE(
                            e,
                            r,
                            t
                        ) {
                            return writeDouble(this, e, r, true, t);
                        };
                        Buffer.prototype.writeDoubleBE = function writeDoubleBE(
                            e,
                            r,
                            t
                        ) {
                            return writeDouble(this, e, r, false, t);
                        };
                        Buffer.prototype.copy = function copy(e, r, t, f) {
                            if (!Buffer.isBuffer(e))
                                throw new TypeError(
                                    "argument should be a Buffer"
                                );
                            if (!t) t = 0;
                            if (!f && f !== 0) f = this.length;
                            if (r >= e.length) r = e.length;
                            if (!r) r = 0;
                            if (f > 0 && f < t) f = t;
                            if (f === t) return 0;
                            if (e.length === 0 || this.length === 0) return 0;
                            if (r < 0) {
                                throw new RangeError(
                                    "targetStart out of bounds"
                                );
                            }
                            if (t < 0 || t >= this.length)
                                throw new RangeError("Index out of range");
                            if (f < 0)
                                throw new RangeError("sourceEnd out of bounds");
                            if (f > this.length) f = this.length;
                            if (e.length - r < f - t) {
                                f = e.length - r + t;
                            }
                            var n = f - t;
                            if (
                                this === e &&
                                typeof Uint8Array.prototype.copyWithin ===
                                    "function"
                            ) {
                                this.copyWithin(r, t, f);
                            } else if (this === e && t < r && r < f) {
                                for (var i = n - 1; i >= 0; --i) {
                                    e[i + r] = this[i + t];
                                }
                            } else {
                                Uint8Array.prototype.set.call(
                                    e,
                                    this.subarray(t, f),
                                    r
                                );
                            }
                            return n;
                        };
                        Buffer.prototype.fill = function fill(e, r, t, f) {
                            if (typeof e === "string") {
                                if (typeof r === "string") {
                                    f = r;
                                    r = 0;
                                    t = this.length;
                                } else if (typeof t === "string") {
                                    f = t;
                                    t = this.length;
                                }
                                if (f !== undefined && typeof f !== "string") {
                                    throw new TypeError(
                                        "encoding must be a string"
                                    );
                                }
                                if (
                                    typeof f === "string" &&
                                    !Buffer.isEncoding(f)
                                ) {
                                    throw new TypeError(
                                        "Unknown encoding: " + f
                                    );
                                }
                                if (e.length === 1) {
                                    var n = e.charCodeAt(0);
                                    if (
                                        (f === "utf8" && n < 128) ||
                                        f === "latin1"
                                    ) {
                                        e = n;
                                    }
                                }
                            } else if (typeof e === "number") {
                                e = e & 255;
                            } else if (typeof e === "boolean") {
                                e = Number(e);
                            }
                            if (r < 0 || this.length < r || this.length < t) {
                                throw new RangeError("Out of range index");
                            }
                            if (t <= r) {
                                return this;
                            }
                            r = r >>> 0;
                            t = t === undefined ? this.length : t >>> 0;
                            if (!e) e = 0;
                            var i;
                            if (typeof e === "number") {
                                for (i = r; i < t; ++i) {
                                    this[i] = e;
                                }
                            } else {
                                var o = Buffer.isBuffer(e)
                                    ? e
                                    : Buffer.from(e, f);
                                var u = o.length;
                                if (u === 0) {
                                    throw new TypeError(
                                        'The value "' +
                                            e +
                                            '" is invalid for argument "value"'
                                    );
                                }
                                for (i = 0; i < t - r; ++i) {
                                    this[i + r] = o[i % u];
                                }
                            }
                            return this;
                        };
                        var a = /[^+/0-9A-Za-z-_]/g;
                        function base64clean(e) {
                            e = e.split("=")[0];
                            e = e.trim().replace(a, "");
                            if (e.length < 2) return "";
                            while (e.length % 4 !== 0) {
                                e = e + "=";
                            }
                            return e;
                        }
                        function utf8ToBytes(e, r) {
                            r = r || Infinity;
                            var t;
                            var f = e.length;
                            var n = null;
                            var i = [];
                            for (var o = 0; o < f; ++o) {
                                t = e.charCodeAt(o);
                                if (t > 55295 && t < 57344) {
                                    if (!n) {
                                        if (t > 56319) {
                                            if ((r -= 3) > -1)
                                                i.push(239, 191, 189);
                                            continue;
                                        } else if (o + 1 === f) {
                                            if ((r -= 3) > -1)
                                                i.push(239, 191, 189);
                                            continue;
                                        }
                                        n = t;
                                        continue;
                                    }
                                    if (t < 56320) {
                                        if ((r -= 3) > -1)
                                            i.push(239, 191, 189);
                                        n = t;
                                        continue;
                                    }
                                    t =
                                        (((n - 55296) << 10) | (t - 56320)) +
                                        65536;
                                } else if (n) {
                                    if ((r -= 3) > -1) i.push(239, 191, 189);
                                }
                                n = null;
                                if (t < 128) {
                                    if ((r -= 1) < 0) break;
                                    i.push(t);
                                } else if (t < 2048) {
                                    if ((r -= 2) < 0) break;
                                    i.push((t >> 6) | 192, (t & 63) | 128);
                                } else if (t < 65536) {
                                    if ((r -= 3) < 0) break;
                                    i.push(
                                        (t >> 12) | 224,
                                        ((t >> 6) & 63) | 128,
                                        (t & 63) | 128
                                    );
                                } else if (t < 1114112) {
                                    if ((r -= 4) < 0) break;
                                    i.push(
                                        (t >> 18) | 240,
                                        ((t >> 12) & 63) | 128,
                                        ((t >> 6) & 63) | 128,
                                        (t & 63) | 128
                                    );
                                } else {
                                    throw new Error("Invalid code point");
                                }
                            }
                            return i;
                        }
                        function asciiToBytes(e) {
                            var r = [];
                            for (var t = 0; t < e.length; ++t) {
                                r.push(e.charCodeAt(t) & 255);
                            }
                            return r;
                        }
                        function utf16leToBytes(e, r) {
                            var t, f, n;
                            var i = [];
                            for (var o = 0; o < e.length; ++o) {
                                if ((r -= 2) < 0) break;
                                t = e.charCodeAt(o);
                                f = t >> 8;
                                n = t % 256;
                                i.push(n);
                                i.push(f);
                            }
                            return i;
                        }
                        function base64ToBytes(e) {
                            return f.toByteArray(base64clean(e));
                        }
                        function blitBuffer(e, r, t, f) {
                            for (var n = 0; n < f; ++n) {
                                if (n + t >= r.length || n >= e.length) break;
                                r[n + t] = e[n];
                            }
                            return n;
                        }
                        function isInstance(e, r) {
                            return (
                                e instanceof r ||
                                (e != null &&
                                    e.constructor != null &&
                                    e.constructor.name != null &&
                                    e.constructor.name === r.name)
                            );
                        }
                        function numberIsNaN(e) {
                            return e !== e;
                        }
                        var s = (function () {
                            var e = "0123456789abcdef";
                            var r = new Array(256);
                            for (var t = 0; t < 16; ++t) {
                                var f = t * 16;
                                for (var n = 0; n < 16; ++n) {
                                    r[f + n] = e[t] + e[n];
                                }
                            }
                            return r;
                        })();
                    },
                    759: function (e, r) {
                        r.read = function (e, r, t, f, n) {
                            var i, o;
                            var u = n * 8 - f - 1;
                            var a = (1 << u) - 1;
                            var s = a >> 1;
                            var h = -7;
                            var c = t ? n - 1 : 0;
                            var l = t ? -1 : 1;
                            var p = e[r + c];
                            c += l;
                            i = p & ((1 << -h) - 1);
                            p >>= -h;
                            h += u;
                            for (
                                ;
                                h > 0;
                                i = i * 256 + e[r + c], c += l, h -= 8
                            ) {}
                            o = i & ((1 << -h) - 1);
                            i >>= -h;
                            h += f;
                            for (
                                ;
                                h > 0;
                                o = o * 256 + e[r + c], c += l, h -= 8
                            ) {}
                            if (i === 0) {
                                i = 1 - s;
                            } else if (i === a) {
                                return o ? NaN : (p ? -1 : 1) * Infinity;
                            } else {
                                o = o + Math.pow(2, f);
                                i = i - s;
                            }
                            return (p ? -1 : 1) * o * Math.pow(2, i - f);
                        };
                        r.write = function (e, r, t, f, n, i) {
                            var o, u, a;
                            var s = i * 8 - n - 1;
                            var h = (1 << s) - 1;
                            var c = h >> 1;
                            var l =
                                n === 23
                                    ? Math.pow(2, -24) - Math.pow(2, -77)
                                    : 0;
                            var p = f ? 0 : i - 1;
                            var y = f ? 1 : -1;
                            var g = r < 0 || (r === 0 && 1 / r < 0) ? 1 : 0;
                            r = Math.abs(r);
                            if (isNaN(r) || r === Infinity) {
                                u = isNaN(r) ? 1 : 0;
                                o = h;
                            } else {
                                o = Math.floor(Math.log(r) / Math.LN2);
                                if (r * (a = Math.pow(2, -o)) < 1) {
                                    o--;
                                    a *= 2;
                                }
                                if (o + c >= 1) {
                                    r += l / a;
                                } else {
                                    r += l * Math.pow(2, 1 - c);
                                }
                                if (r * a >= 2) {
                                    o++;
                                    a /= 2;
                                }
                                if (o + c >= h) {
                                    u = 0;
                                    o = h;
                                } else if (o + c >= 1) {
                                    u = (r * a - 1) * Math.pow(2, n);
                                    o = o + c;
                                } else {
                                    u = r * Math.pow(2, c - 1) * Math.pow(2, n);
                                    o = 0;
                                }
                            }
                            for (
                                ;
                                n >= 8;
                                e[t + p] = u & 255, p += y, u /= 256, n -= 8
                            ) {}
                            o = (o << n) | u;
                            s += n;
                            for (
                                ;
                                s > 0;
                                e[t + p] = o & 255, p += y, o /= 256, s -= 8
                            ) {}
                            e[t + p - y] |= g * 128;
                        };
                    },
                };
                var r = {};
                function __nccwpck_require__(t) {
                    var f = r[t];
                    if (f !== undefined) {
                        return f.exports;
                    }
                    var n = (r[t] = { exports: {} });
                    var i = true;
                    try {
                        e[t](n, n.exports, __nccwpck_require__);
                        i = false;
                    } finally {
                        if (i) delete r[t];
                    }
                    return n.exports;
                }
                if (typeof __nccwpck_require__ !== "undefined")
                    __nccwpck_require__.ab = __dirname + "/";
                var t = __nccwpck_require__(293);
                module.exports = t;
            })();

            /***/
        },

        /***/ 7663: /***/ function (module) {
            var __dirname = "/";
            (function () {
                var e = {
                    162: function (e) {
                        var t = (e.exports = {});
                        var r;
                        var n;
                        function defaultSetTimout() {
                            throw new Error("setTimeout has not been defined");
                        }
                        function defaultClearTimeout() {
                            throw new Error(
                                "clearTimeout has not been defined"
                            );
                        }
                        (function () {
                            try {
                                if (typeof setTimeout === "function") {
                                    r = setTimeout;
                                } else {
                                    r = defaultSetTimout;
                                }
                            } catch (e) {
                                r = defaultSetTimout;
                            }
                            try {
                                if (typeof clearTimeout === "function") {
                                    n = clearTimeout;
                                } else {
                                    n = defaultClearTimeout;
                                }
                            } catch (e) {
                                n = defaultClearTimeout;
                            }
                        })();
                        function runTimeout(e) {
                            if (r === setTimeout) {
                                return setTimeout(e, 0);
                            }
                            if ((r === defaultSetTimout || !r) && setTimeout) {
                                r = setTimeout;
                                return setTimeout(e, 0);
                            }
                            try {
                                return r(e, 0);
                            } catch (t) {
                                try {
                                    return r.call(null, e, 0);
                                } catch (t) {
                                    return r.call(this, e, 0);
                                }
                            }
                        }
                        function runClearTimeout(e) {
                            if (n === clearTimeout) {
                                return clearTimeout(e);
                            }
                            if (
                                (n === defaultClearTimeout || !n) &&
                                clearTimeout
                            ) {
                                n = clearTimeout;
                                return clearTimeout(e);
                            }
                            try {
                                return n(e);
                            } catch (t) {
                                try {
                                    return n.call(null, e);
                                } catch (t) {
                                    return n.call(this, e);
                                }
                            }
                        }
                        var i = [];
                        var o = false;
                        var u;
                        var a = -1;
                        function cleanUpNextTick() {
                            if (!o || !u) {
                                return;
                            }
                            o = false;
                            if (u.length) {
                                i = u.concat(i);
                            } else {
                                a = -1;
                            }
                            if (i.length) {
                                drainQueue();
                            }
                        }
                        function drainQueue() {
                            if (o) {
                                return;
                            }
                            var e = runTimeout(cleanUpNextTick);
                            o = true;
                            var t = i.length;
                            while (t) {
                                u = i;
                                i = [];
                                while (++a < t) {
                                    if (u) {
                                        u[a].run();
                                    }
                                }
                                a = -1;
                                t = i.length;
                            }
                            u = null;
                            o = false;
                            runClearTimeout(e);
                        }
                        t.nextTick = function (e) {
                            var t = new Array(arguments.length - 1);
                            if (arguments.length > 1) {
                                for (var r = 1; r < arguments.length; r++) {
                                    t[r - 1] = arguments[r];
                                }
                            }
                            i.push(new Item(e, t));
                            if (i.length === 1 && !o) {
                                runTimeout(drainQueue);
                            }
                        };
                        function Item(e, t) {
                            this.fun = e;
                            this.array = t;
                        }
                        Item.prototype.run = function () {
                            this.fun.apply(null, this.array);
                        };
                        t.title = "browser";
                        t.browser = true;
                        t.env = {};
                        t.argv = [];
                        t.version = "";
                        t.versions = {};
                        function noop() {}
                        t.on = noop;
                        t.addListener = noop;
                        t.once = noop;
                        t.off = noop;
                        t.removeListener = noop;
                        t.removeAllListeners = noop;
                        t.emit = noop;
                        t.prependListener = noop;
                        t.prependOnceListener = noop;
                        t.listeners = function (e) {
                            return [];
                        };
                        t.binding = function (e) {
                            throw new Error("process.binding is not supported");
                        };
                        t.cwd = function () {
                            return "/";
                        };
                        t.chdir = function (e) {
                            throw new Error("process.chdir is not supported");
                        };
                        t.umask = function () {
                            return 0;
                        };
                    },
                };
                var t = {};
                function __nccwpck_require__(r) {
                    var n = t[r];
                    if (n !== undefined) {
                        return n.exports;
                    }
                    var i = (t[r] = { exports: {} });
                    var o = true;
                    try {
                        e[r](i, i.exports, __nccwpck_require__);
                        o = false;
                    } finally {
                        if (o) delete t[r];
                    }
                    return i.exports;
                }
                if (typeof __nccwpck_require__ !== "undefined")
                    __nccwpck_require__.ab = __dirname + "/";
                var r = __nccwpck_require__(162);
                module.exports = r;
            })();

            /***/
        },

        /***/ 6400: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Component: function () {
                    return /* binding */ _;
                },
                /* harmony export */ Fragment: function () {
                    return /* binding */ d;
                },
                /* harmony export */ cloneElement: function () {
                    return /* binding */ B;
                },
                /* harmony export */ createContext: function () {
                    return /* binding */ D;
                },
                /* harmony export */ createElement: function () {
                    return /* binding */ v;
                },
                /* harmony export */ createRef: function () {
                    return /* binding */ p;
                },
                /* harmony export */ h: function () {
                    return /* binding */ v;
                },
                /* harmony export */ hydrate: function () {
                    return /* binding */ q;
                },
                /* harmony export */ isValidElement: function () {
                    return /* binding */ i;
                },
                /* harmony export */ options: function () {
                    return /* binding */ l;
                },
                /* harmony export */ render: function () {
                    return /* binding */ S;
                },
                /* harmony export */ toChildArray: function () {
                    return /* binding */ A;
                },
                /* harmony export */
            });
            var n,
                l,
                u,
                i,
                t,
                o,
                r,
                f,
                e = {},
                c = [],
                s =
                    /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
            function a(n, l) {
                for (var u in l) n[u] = l[u];
                return n;
            }
            function h(n) {
                var l = n.parentNode;
                l && l.removeChild(n);
            }
            function v(l, u, i) {
                var t,
                    o,
                    r,
                    f = {};
                for (r in u)
                    "key" == r
                        ? (t = u[r])
                        : "ref" == r
                        ? (o = u[r])
                        : (f[r] = u[r]);
                if (
                    (arguments.length > 2 &&
                        (f.children =
                            arguments.length > 3 ? n.call(arguments, 2) : i),
                    "function" == typeof l && null != l.defaultProps)
                )
                    for (r in l.defaultProps)
                        void 0 === f[r] && (f[r] = l.defaultProps[r]);
                return y(l, f, t, o, null);
            }
            function y(n, i, t, o, r) {
                var f = {
                    type: n,
                    props: i,
                    key: t,
                    ref: o,
                    __k: null,
                    __: null,
                    __b: 0,
                    __e: null,
                    __d: void 0,
                    __c: null,
                    __h: null,
                    constructor: void 0,
                    __v: null == r ? ++u : r,
                };
                return null == r && null != l.vnode && l.vnode(f), f;
            }
            function p() {
                return { current: null };
            }
            function d(n) {
                return n.children;
            }
            function _(n, l) {
                (this.props = n), (this.context = l);
            }
            function k(n, l) {
                if (null == l)
                    return n.__ ? k(n.__, n.__.__k.indexOf(n) + 1) : null;
                for (var u; l < n.__k.length; l++)
                    if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
                return "function" == typeof n.type ? k(n) : null;
            }
            function b(n) {
                var l, u;
                if (null != (n = n.__) && null != n.__c) {
                    for (
                        n.__e = n.__c.base = null, l = 0;
                        l < n.__k.length;
                        l++
                    )
                        if (null != (u = n.__k[l]) && null != u.__e) {
                            n.__e = n.__c.base = u.__e;
                            break;
                        }
                    return b(n);
                }
            }
            function m(n) {
                ((!n.__d && (n.__d = !0) && t.push(n) && !g.__r++) ||
                    r !== l.debounceRendering) &&
                    ((r = l.debounceRendering) || o)(g);
            }
            function g() {
                for (var n; (g.__r = t.length); )
                    (n = t.sort(function (n, l) {
                        return n.__v.__b - l.__v.__b;
                    })),
                        (t = []),
                        n.some(function (n) {
                            var l, u, i, t, o, r;
                            n.__d &&
                                ((o = (t = (l = n).__v).__e),
                                (r = l.__P) &&
                                    ((u = []),
                                    ((i = a({}, t)).__v = t.__v + 1),
                                    j(
                                        r,
                                        t,
                                        i,
                                        l.__n,
                                        void 0 !== r.ownerSVGElement,
                                        null != t.__h ? [o] : null,
                                        u,
                                        null == o ? k(t) : o,
                                        t.__h
                                    ),
                                    z(u, t),
                                    t.__e != o && b(t)));
                        });
            }
            function w(n, l, u, i, t, o, r, f, s, a) {
                var h,
                    v,
                    p,
                    _,
                    b,
                    m,
                    g,
                    w = (i && i.__k) || c,
                    A = w.length;
                for (u.__k = [], h = 0; h < l.length; h++)
                    if (
                        null !=
                        (_ = u.__k[h] =
                            null == (_ = l[h]) || "boolean" == typeof _
                                ? null
                                : "string" == typeof _ ||
                                  "number" == typeof _ ||
                                  "bigint" == typeof _
                                ? y(null, _, null, null, _)
                                : Array.isArray(_)
                                ? y(d, { children: _ }, null, null, null)
                                : _.__b > 0
                                ? y(_.type, _.props, _.key, null, _.__v)
                                : _)
                    ) {
                        if (
                            ((_.__ = u),
                            (_.__b = u.__b + 1),
                            null === (p = w[h]) ||
                                (p && _.key == p.key && _.type === p.type))
                        )
                            w[h] = void 0;
                        else
                            for (v = 0; v < A; v++) {
                                if (
                                    (p = w[v]) &&
                                    _.key == p.key &&
                                    _.type === p.type
                                ) {
                                    w[v] = void 0;
                                    break;
                                }
                                p = null;
                            }
                        j(n, _, (p = p || e), t, o, r, f, s, a),
                            (b = _.__e),
                            (v = _.ref) &&
                                p.ref != v &&
                                (g || (g = []),
                                p.ref && g.push(p.ref, null, _),
                                g.push(v, _.__c || b, _)),
                            null != b
                                ? (null == m && (m = b),
                                  "function" == typeof _.type && _.__k === p.__k
                                      ? (_.__d = s = x(_, s, n))
                                      : (s = P(n, _, p, w, b, s)),
                                  "function" == typeof u.type && (u.__d = s))
                                : s &&
                                  p.__e == s &&
                                  s.parentNode != n &&
                                  (s = k(p));
                    }
                for (u.__e = m, h = A; h--; )
                    null != w[h] &&
                        ("function" == typeof u.type &&
                            null != w[h].__e &&
                            w[h].__e == u.__d &&
                            (u.__d = k(i, h + 1)),
                        N(w[h], w[h]));
                if (g) for (h = 0; h < g.length; h++) M(g[h], g[++h], g[++h]);
            }
            function x(n, l, u) {
                for (var i, t = n.__k, o = 0; t && o < t.length; o++)
                    (i = t[o]) &&
                        ((i.__ = n),
                        (l =
                            "function" == typeof i.type
                                ? x(i, l, u)
                                : P(u, i, i, t, i.__e, l)));
                return l;
            }
            function A(n, l) {
                return (
                    (l = l || []),
                    null == n ||
                        "boolean" == typeof n ||
                        (Array.isArray(n)
                            ? n.some(function (n) {
                                  A(n, l);
                              })
                            : l.push(n)),
                    l
                );
            }
            function P(n, l, u, i, t, o) {
                var r, f, e;
                if (void 0 !== l.__d) (r = l.__d), (l.__d = void 0);
                else if (null == u || t != o || null == t.parentNode)
                    n: if (null == o || o.parentNode !== n)
                        n.appendChild(t), (r = null);
                    else {
                        for (
                            f = o, e = 0;
                            (f = f.nextSibling) && e < i.length;
                            e += 2
                        )
                            if (f == t) break n;
                        n.insertBefore(t, o), (r = o);
                    }
                return void 0 !== r ? r : t.nextSibling;
            }
            function C(n, l, u, i, t) {
                var o;
                for (o in u)
                    "children" === o ||
                        "key" === o ||
                        o in l ||
                        H(n, o, null, u[o], i);
                for (o in l)
                    (t && "function" != typeof l[o]) ||
                        "children" === o ||
                        "key" === o ||
                        "value" === o ||
                        "checked" === o ||
                        u[o] === l[o] ||
                        H(n, o, l[o], u[o], i);
            }
            function $(n, l, u) {
                "-" === l[0]
                    ? n.setProperty(l, u)
                    : (n[l] =
                          null == u
                              ? ""
                              : "number" != typeof u || s.test(l)
                              ? u
                              : u + "px");
            }
            function H(n, l, u, i, t) {
                var o;
                n: if ("style" === l)
                    if ("string" == typeof u) n.style.cssText = u;
                    else {
                        if (
                            ("string" == typeof i && (n.style.cssText = i = ""),
                            i)
                        )
                            for (l in i) (u && l in u) || $(n.style, l, "");
                        if (u)
                            for (l in u)
                                (i && u[l] === i[l]) || $(n.style, l, u[l]);
                    }
                else if ("o" === l[0] && "n" === l[1])
                    (o = l !== (l = l.replace(/Capture$/, ""))),
                        (l =
                            l.toLowerCase() in n
                                ? l.toLowerCase().slice(2)
                                : l.slice(2)),
                        n.l || (n.l = {}),
                        (n.l[l + o] = u),
                        u
                            ? i || n.addEventListener(l, o ? T : I, o)
                            : n.removeEventListener(l, o ? T : I, o);
                else if ("dangerouslySetInnerHTML" !== l) {
                    if (t)
                        l = l
                            .replace(/xlink(H|:h)/, "h")
                            .replace(/sName$/, "s");
                    else if (
                        "href" !== l &&
                        "list" !== l &&
                        "form" !== l &&
                        "tabIndex" !== l &&
                        "download" !== l &&
                        l in n
                    )
                        try {
                            n[l] = null == u ? "" : u;
                            break n;
                        } catch (n) {}
                    "function" == typeof u ||
                        (null != u &&
                        (!1 !== u || ("a" === l[0] && "r" === l[1]))
                            ? n.setAttribute(l, u)
                            : n.removeAttribute(l));
                }
            }
            function I(n) {
                this.l[n.type + !1](l.event ? l.event(n) : n);
            }
            function T(n) {
                this.l[n.type + !0](l.event ? l.event(n) : n);
            }
            function j(n, u, i, t, o, r, f, e, c) {
                var s,
                    h,
                    v,
                    y,
                    p,
                    k,
                    b,
                    m,
                    g,
                    x,
                    A,
                    P = u.type;
                if (void 0 !== u.constructor) return null;
                null != i.__h &&
                    ((c = i.__h),
                    (e = u.__e = i.__e),
                    (u.__h = null),
                    (r = [e])),
                    (s = l.__b) && s(u);
                try {
                    n: if ("function" == typeof P) {
                        if (
                            ((m = u.props),
                            (g = (s = P.contextType) && t[s.__c]),
                            (x = s ? (g ? g.props.value : s.__) : t),
                            i.__c
                                ? (b = (h = u.__c = i.__c).__ = h.__E)
                                : ("prototype" in P && P.prototype.render
                                      ? (u.__c = h = new P(m, x))
                                      : ((u.__c = h = new _(m, x)),
                                        (h.constructor = P),
                                        (h.render = O)),
                                  g && g.sub(h),
                                  (h.props = m),
                                  h.state || (h.state = {}),
                                  (h.context = x),
                                  (h.__n = t),
                                  (v = h.__d = !0),
                                  (h.__h = [])),
                            null == h.__s && (h.__s = h.state),
                            null != P.getDerivedStateFromProps &&
                                (h.__s == h.state && (h.__s = a({}, h.__s)),
                                a(h.__s, P.getDerivedStateFromProps(m, h.__s))),
                            (y = h.props),
                            (p = h.state),
                            v)
                        )
                            null == P.getDerivedStateFromProps &&
                                null != h.componentWillMount &&
                                h.componentWillMount(),
                                null != h.componentDidMount &&
                                    h.__h.push(h.componentDidMount);
                        else {
                            if (
                                (null == P.getDerivedStateFromProps &&
                                    m !== y &&
                                    null != h.componentWillReceiveProps &&
                                    h.componentWillReceiveProps(m, x),
                                (!h.__e &&
                                    null != h.shouldComponentUpdate &&
                                    !1 ===
                                        h.shouldComponentUpdate(m, h.__s, x)) ||
                                    u.__v === i.__v)
                            ) {
                                (h.props = m),
                                    (h.state = h.__s),
                                    u.__v !== i.__v && (h.__d = !1),
                                    (h.__v = u),
                                    (u.__e = i.__e),
                                    (u.__k = i.__k),
                                    u.__k.forEach(function (n) {
                                        n && (n.__ = u);
                                    }),
                                    h.__h.length && f.push(h);
                                break n;
                            }
                            null != h.componentWillUpdate &&
                                h.componentWillUpdate(m, h.__s, x),
                                null != h.componentDidUpdate &&
                                    h.__h.push(function () {
                                        h.componentDidUpdate(y, p, k);
                                    });
                        }
                        (h.context = x),
                            (h.props = m),
                            (h.state = h.__s),
                            (s = l.__r) && s(u),
                            (h.__d = !1),
                            (h.__v = u),
                            (h.__P = n),
                            (s = h.render(h.props, h.state, h.context)),
                            (h.state = h.__s),
                            null != h.getChildContext &&
                                (t = a(a({}, t), h.getChildContext())),
                            v ||
                                null == h.getSnapshotBeforeUpdate ||
                                (k = h.getSnapshotBeforeUpdate(y, p)),
                            (A =
                                null != s && s.type === d && null == s.key
                                    ? s.props.children
                                    : s),
                            w(
                                n,
                                Array.isArray(A) ? A : [A],
                                u,
                                i,
                                t,
                                o,
                                r,
                                f,
                                e,
                                c
                            ),
                            (h.base = u.__e),
                            (u.__h = null),
                            h.__h.length && f.push(h),
                            b && (h.__E = h.__ = null),
                            (h.__e = !1);
                    } else
                        null == r && u.__v === i.__v
                            ? ((u.__k = i.__k), (u.__e = i.__e))
                            : (u.__e = L(i.__e, u, i, t, o, r, f, c));
                    (s = l.diffed) && s(u);
                } catch (n) {
                    (u.__v = null),
                        (c || null != r) &&
                            ((u.__e = e),
                            (u.__h = !!c),
                            (r[r.indexOf(e)] = null)),
                        l.__e(n, u, i);
                }
            }
            function z(n, u) {
                l.__c && l.__c(u, n),
                    n.some(function (u) {
                        try {
                            (n = u.__h),
                                (u.__h = []),
                                n.some(function (n) {
                                    n.call(u);
                                });
                        } catch (n) {
                            l.__e(n, u.__v);
                        }
                    });
            }
            function L(l, u, i, t, o, r, f, c) {
                var s,
                    a,
                    v,
                    y = i.props,
                    p = u.props,
                    d = u.type,
                    _ = 0;
                if (("svg" === d && (o = !0), null != r))
                    for (; _ < r.length; _++)
                        if (
                            (s = r[_]) &&
                            "setAttribute" in s == !!d &&
                            (d ? s.localName === d : 3 === s.nodeType)
                        ) {
                            (l = s), (r[_] = null);
                            break;
                        }
                if (null == l) {
                    if (null === d) return document.createTextNode(p);
                    (l = o
                        ? document.createElementNS(
                              "http://www.w3.org/2000/svg",
                              d
                          )
                        : document.createElement(d, p.is && p)),
                        (r = null),
                        (c = !1);
                }
                if (null === d) y === p || (c && l.data === p) || (l.data = p);
                else {
                    if (
                        ((r = r && n.call(l.childNodes)),
                        (a = (y = i.props || e).dangerouslySetInnerHTML),
                        (v = p.dangerouslySetInnerHTML),
                        !c)
                    ) {
                        if (null != r)
                            for (y = {}, _ = 0; _ < l.attributes.length; _++)
                                y[l.attributes[_].name] = l.attributes[_].value;
                        (v || a) &&
                            ((v &&
                                ((a && v.__html == a.__html) ||
                                    v.__html === l.innerHTML)) ||
                                (l.innerHTML = (v && v.__html) || ""));
                    }
                    if ((C(l, p, y, o, c), v)) u.__k = [];
                    else if (
                        ((_ = u.props.children),
                        w(
                            l,
                            Array.isArray(_) ? _ : [_],
                            u,
                            i,
                            t,
                            o && "foreignObject" !== d,
                            r,
                            f,
                            r ? r[0] : i.__k && k(i, 0),
                            c
                        ),
                        null != r)
                    )
                        for (_ = r.length; _--; ) null != r[_] && h(r[_]);
                    c ||
                        ("value" in p &&
                            void 0 !== (_ = p.value) &&
                            (_ !== l.value ||
                                ("progress" === d && !_) ||
                                ("option" === d && _ !== y.value)) &&
                            H(l, "value", _, y.value, !1),
                        "checked" in p &&
                            void 0 !== (_ = p.checked) &&
                            _ !== l.checked &&
                            H(l, "checked", _, y.checked, !1));
                }
                return l;
            }
            function M(n, u, i) {
                try {
                    "function" == typeof n ? n(u) : (n.current = u);
                } catch (n) {
                    l.__e(n, i);
                }
            }
            function N(n, u, i) {
                var t, o;
                if (
                    (l.unmount && l.unmount(n),
                    (t = n.ref) &&
                        ((t.current && t.current !== n.__e) || M(t, null, u)),
                    null != (t = n.__c))
                ) {
                    if (t.componentWillUnmount)
                        try {
                            t.componentWillUnmount();
                        } catch (n) {
                            l.__e(n, u);
                        }
                    t.base = t.__P = null;
                }
                if ((t = n.__k))
                    for (o = 0; o < t.length; o++)
                        t[o] && N(t[o], u, "function" != typeof n.type);
                i || null == n.__e || h(n.__e), (n.__e = n.__d = void 0);
            }
            function O(n, l, u) {
                return this.constructor(n, u);
            }
            function S(u, i, t) {
                var o, r, f;
                l.__ && l.__(u, i),
                    (r = (o = "function" == typeof t)
                        ? null
                        : (t && t.__k) || i.__k),
                    (f = []),
                    j(
                        i,
                        (u = ((!o && t) || i).__k = v(d, null, [u])),
                        r || e,
                        e,
                        void 0 !== i.ownerSVGElement,
                        !o && t
                            ? [t]
                            : r
                            ? null
                            : i.firstChild
                            ? n.call(i.childNodes)
                            : null,
                        f,
                        !o && t ? t : r ? r.__e : i.firstChild,
                        o
                    ),
                    z(f, u);
            }
            function q(n, l) {
                S(n, l, q);
            }
            function B(l, u, i) {
                var t,
                    o,
                    r,
                    f = a({}, l.props);
                for (r in u)
                    "key" == r
                        ? (t = u[r])
                        : "ref" == r
                        ? (o = u[r])
                        : (f[r] = u[r]);
                return (
                    arguments.length > 2 &&
                        (f.children =
                            arguments.length > 3 ? n.call(arguments, 2) : i),
                    y(l.type, f, t || l.key, o || l.ref, null)
                );
            }
            function D(n, l) {
                var u = {
                    __c: (l = "__cC" + f++),
                    __: n,
                    Consumer: function (n, l) {
                        return n.children(l);
                    },
                    Provider: function (n) {
                        var u, i;
                        return (
                            this.getChildContext ||
                                ((u = []),
                                ((i = {})[l] = this),
                                (this.getChildContext = function () {
                                    return i;
                                }),
                                (this.shouldComponentUpdate = function (n) {
                                    this.props.value !== n.value && u.some(m);
                                }),
                                (this.sub = function (n) {
                                    u.push(n);
                                    var l = n.componentWillUnmount;
                                    n.componentWillUnmount = function () {
                                        u.splice(u.indexOf(n), 1),
                                            l && l.call(n);
                                    };
                                })),
                            n.children
                        );
                    },
                };
                return (u.Provider.__ = u.Consumer.contextType = u);
            }
            (n = c.slice),
                (l = {
                    __e: function (n, l, u, i) {
                        for (var t, o, r; (l = l.__); )
                            if ((t = l.__c) && !t.__)
                                try {
                                    if (
                                        ((o = t.constructor) &&
                                            null !=
                                                o.getDerivedStateFromError &&
                                            (t.setState(
                                                o.getDerivedStateFromError(n)
                                            ),
                                            (r = t.__d)),
                                        null != t.componentDidCatch &&
                                            (t.componentDidCatch(n, i || {}),
                                            (r = t.__d)),
                                        r)
                                    )
                                        return (t.__E = t);
                                } catch (l) {
                                    n = l;
                                }
                        throw n;
                    },
                }),
                (u = 0),
                (i = function (n) {
                    return null != n && void 0 === n.constructor;
                }),
                (_.prototype.setState = function (n, l) {
                    var u;
                    (u =
                        null != this.__s && this.__s !== this.state
                            ? this.__s
                            : (this.__s = a({}, this.state))),
                        "function" == typeof n && (n = n(a({}, u), this.props)),
                        n && a(u, n),
                        null != n &&
                            this.__v &&
                            (l && this.__h.push(l), m(this));
                }),
                (_.prototype.forceUpdate = function (n) {
                    this.__v &&
                        ((this.__e = !0), n && this.__h.push(n), m(this));
                }),
                (_.prototype.render = d),
                (t = []),
                (o =
                    "function" == typeof Promise
                        ? Promise.prototype.then.bind(Promise.resolve())
                        : setTimeout),
                (g.__r = 0),
                (f = 0);
            //# sourceMappingURL=preact.module.js.map

            /***/
        },

        /***/ 2703: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var ReactPropTypesSecret = __webpack_require__(414);

            function emptyFunction() {}
            function emptyFunctionWithReset() {}
            emptyFunctionWithReset.resetWarningCache = emptyFunction;

            module.exports = function () {
                function shim(
                    props,
                    propName,
                    componentName,
                    location,
                    propFullName,
                    secret
                ) {
                    if (secret === ReactPropTypesSecret) {
                        // It is still safe when called from React.
                        return;
                    }
                    var err = new Error(
                        "Calling PropTypes validators directly is not supported by the `prop-types` package. " +
                            "Use PropTypes.checkPropTypes() to call them. " +
                            "Read more at http://fb.me/use-check-prop-types"
                    );
                    err.name = "Invariant Violation";
                    throw err;
                }
                shim.isRequired = shim;
                function getShim() {
                    return shim;
                }
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
                    resetWarningCache: emptyFunction,
                };

                ReactPropTypes.PropTypes = ReactPropTypes;

                return ReactPropTypes;
            };

            /***/
        },

        /***/ 5697: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
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
                module.exports = __webpack_require__(2703)();
            }

            /***/
        },

        /***/ 414: /***/ function (module) {
            "use strict";
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var ReactPropTypesSecret =
                "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";

            module.exports = ReactPropTypesSecret;

            /***/
        },

        /***/ 1196: /***/ function (module) {
            "use strict";
            /* jshint node: true */

            /**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

            function WildcardMatcher(text, separator) {
                this.text = text = text || "";
                this.hasWild = ~text.indexOf("*");
                this.separator = separator;
                this.parts = text.split(separator);
            }

            WildcardMatcher.prototype.match = function (input) {
                var matches = true;
                var parts = this.parts;
                var ii;
                var partsCount = parts.length;
                var testParts;

                if (typeof input == "string" || input instanceof String) {
                    if (!this.hasWild && this.text != input) {
                        matches = false;
                    } else {
                        testParts = (input || "").split(this.separator);
                        for (ii = 0; matches && ii < partsCount; ii++) {
                            if (parts[ii] === "*") {
                                continue;
                            } else if (ii < testParts.length) {
                                matches = parts[ii] === testParts[ii];
                            } else {
                                matches = false;
                            }
                        }

                        // If matches, then return the component parts
                        matches = matches && testParts;
                    }
                } else if (typeof input.splice == "function") {
                    matches = [];

                    for (ii = input.length; ii--; ) {
                        if (this.match(input[ii])) {
                            matches[matches.length] = input[ii];
                        }
                    }
                } else if (typeof input == "object") {
                    matches = {};

                    for (var key in input) {
                        if (this.match(key)) {
                            matches[key] = input[key];
                        }
                    }
                }

                return matches;
            };

            module.exports = function (text, test, separator) {
                var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
                if (typeof test != "undefined") {
                    return matcher.match(test);
                }

                return matcher;
            };

            /***/
        },

        /***/ 1903: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var _core = __webpack_require__(9429);

            var _preact = __webpack_require__(6400);

            const toArray = __webpack_require__(6361);

            const isDragDropSupported = __webpack_require__(3754);

            const getDroppedFiles = __webpack_require__(4031);

            const packageJson = {
                version: "2.1.0",
            };

            const locale = __webpack_require__(7823);
            /**
             * Drag & Drop plugin
             *
             */

            class DragDrop extends _core.UIPlugin {
                constructor(uppy, opts) {
                    super(uppy, opts);

                    this.handleDrop = async (event) => {
                        var _this$opts$onDrop, _this$opts;

                        event.preventDefault();
                        event.stopPropagation();
                        clearTimeout(this.removeDragOverClassTimeout); // Remove dragover class

                        this.setPluginState({
                            isDraggingOver: false,
                        });

                        const logDropError = (error) => {
                            this.uppy.log(error, "error");
                        }; // Add all dropped files

                        const files = await getDroppedFiles(
                            event.dataTransfer,
                            {
                                logDropError,
                            }
                        );

                        if (files.length > 0) {
                            this.uppy.log("[DragDrop] Files dropped");
                            this.addFiles(files);
                        }

                        (_this$opts$onDrop = (_this$opts = this.opts).onDrop) ==
                        null
                            ? void 0
                            : _this$opts$onDrop.call(_this$opts, event);
                    };

                    this.type = "acquirer";
                    this.id = this.opts.id || "DragDrop";
                    this.title = "Drag & Drop";
                    this.defaultLocale = locale; // Default options

                    const defaultOpts = {
                        target: null,
                        inputName: "files[]",
                        width: "100%",
                        height: "100%",
                        note: null,
                    }; // Merge default options with the ones set by user

                    this.opts = { ...defaultOpts, ...opts };
                    this.i18nInit(); // Check for browser dragDrop support

                    this.isDragDropSupported = isDragDropSupported();
                    this.removeDragOverClassTimeout = null; // Bind `this` to class methods

                    this.onInputChange = this.onInputChange.bind(this);
                    this.handleDragOver = this.handleDragOver.bind(this);
                    this.handleDragLeave = this.handleDragLeave.bind(this);
                    this.handleDrop = this.handleDrop.bind(this);
                    this.addFiles = this.addFiles.bind(this);
                    this.render = this.render.bind(this);
                }

                addFiles(files) {
                    const descriptors = files.map((file) => ({
                        source: this.id,
                        name: file.name,
                        type: file.type,
                        data: file,
                        meta: {
                            // path of the file relative to the ancestor directory the user selected.
                            // e.g. 'docs/Old Prague/airbnb.pdf'
                            relativePath: file.relativePath || null,
                        },
                    }));

                    try {
                        this.uppy.addFiles(descriptors);
                    } catch (err) {
                        this.uppy.log(err);
                    }
                }

                onInputChange(event) {
                    const files = toArray(event.target.files);

                    if (files.length > 0) {
                        this.uppy.log(
                            "[DragDrop] Files selected through input"
                        );
                        this.addFiles(files);
                    } // We clear the input after a file is selected, because otherwise
                    // change event is not fired in Chrome and Safari when a file
                    // with the same name is selected.
                    // ___Why not use value="" on <input/> instead?
                    //    Because if we use that method of clearing the input,
                    //    Chrome will not trigger change if we drop the same file twice (Issue #768).
                    // eslint-disable-next-line no-param-reassign

                    event.target.value = null;
                }

                handleDragOver(event) {
                    var _this$opts$onDragOver, _this$opts2;

                    event.preventDefault();
                    event.stopPropagation(); // Check if the "type" of the datatransfer object includes files. If not, deny drop.

                    const { types } = event.dataTransfer;
                    const hasFiles = types.some((type) => type === "Files");
                    const { allowNewUpload } = this.uppy.getState();

                    if (!hasFiles || !allowNewUpload) {
                        // eslint-disable-next-line no-param-reassign
                        event.dataTransfer.dropEffect = "none";
                        clearTimeout(this.removeDragOverClassTimeout);
                        return;
                    } // Add a small (+) icon on drop
                    // (and prevent browsers from interpreting this as files being _moved_ into the browser
                    // https://github.com/transloadit/uppy/issues/1978)
                    //
                    // eslint-disable-next-line no-param-reassign

                    event.dataTransfer.dropEffect = "copy";
                    clearTimeout(this.removeDragOverClassTimeout);
                    this.setPluginState({
                        isDraggingOver: true,
                    });
                    (_this$opts$onDragOver = (_this$opts2 = this.opts)
                        .onDragOver) == null
                        ? void 0
                        : _this$opts$onDragOver.call(_this$opts2, event);
                }

                handleDragLeave(event) {
                    var _this$opts$onDragLeav, _this$opts3;

                    event.preventDefault();
                    event.stopPropagation();
                    clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library.
                    // Solution with 'pointer-events: none' didn't work across browsers.

                    this.removeDragOverClassTimeout = setTimeout(() => {
                        this.setPluginState({
                            isDraggingOver: false,
                        });
                    }, 50);
                    (_this$opts$onDragLeav = (_this$opts3 = this.opts)
                        .onDragLeave) == null
                        ? void 0
                        : _this$opts$onDragLeav.call(_this$opts3, event);
                }

                renderHiddenFileInput() {
                    const { restrictions } = this.uppy.opts;
                    return (0, _preact.h)("input", {
                        className: "uppy-DragDrop-input",
                        type: "file",
                        hidden: true,
                        ref: (ref) => {
                            this.fileInputRef = ref;
                        },
                        name: this.opts.inputName,
                        multiple: restrictions.maxNumberOfFiles !== 1,
                        accept: restrictions.allowedFileTypes,
                        onChange: this.onInputChange,
                    });
                }

                static renderArrowSvg() {
                    return (0, _preact.h)(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className: "uppy-c-icon uppy-DragDrop-arrow",
                            width: "16",
                            height: "16",
                            viewBox: "0 0 16 16",
                        },
                        (0, _preact.h)("path", {
                            d: "M11 10V0H5v10H2l6 6 6-6h-3zm0 0",
                            fillRule: "evenodd",
                        })
                    );
                }

                renderLabel() {
                    return (0, _preact.h)(
                        "div",
                        {
                            className: "uppy-DragDrop-label",
                        },
                        this.i18nArray("dropHereOr", {
                            browse: (0, _preact.h)(
                                "span",
                                {
                                    className: "uppy-DragDrop-browse",
                                },
                                this.i18n("browse")
                            ),
                        })
                    );
                }

                renderNote() {
                    return (0, _preact.h)(
                        "span",
                        {
                            className: "uppy-DragDrop-note",
                        },
                        this.opts.note
                    );
                }

                render() {
                    const dragDropClass = `uppy-u-reset
      uppy-DragDrop-container
      ${this.isDragDropSupported ? "uppy-DragDrop--isDragDropSupported" : ""}
      ${
          this.getPluginState().isDraggingOver
              ? "uppy-DragDrop--isDraggingOver"
              : ""
      }
    `;
                    const dragDropStyle = {
                        width: this.opts.width,
                        height: this.opts.height,
                    };
                    return (0, _preact.h)(
                        "button",
                        {
                            type: "button",
                            className: dragDropClass,
                            style: dragDropStyle,
                            onClick: () => this.fileInputRef.click(),
                            onDragOver: this.handleDragOver,
                            onDragLeave: this.handleDragLeave,
                            onDrop: this.handleDrop,
                        },
                        this.renderHiddenFileInput(),
                        (0, _preact.h)(
                            "div",
                            {
                                className: "uppy-DragDrop-inner",
                            },
                            DragDrop.renderArrowSvg(),
                            this.renderLabel(),
                            this.renderNote()
                        )
                    );
                }

                install() {
                    const { target } = this.opts;
                    this.setPluginState({
                        isDraggingOver: false,
                    });

                    if (target) {
                        this.mount(target, this);
                    }
                }

                uninstall() {
                    this.unmount();
                }
            }

            DragDrop.VERSION = packageJson.version;
            module.exports = DragDrop;

            /***/
        },

        /***/ 4163: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            module.exports = __webpack_require__(1903);

            /***/
        },

        /***/ 7823: /***/ function (module) {
            "use strict";

            module.exports = {
                strings: {
                    // Text to show on the droppable area.
                    // `%{browse}` is replaced with a link that opens the system file selection dialog.
                    dropHereOr: "Drop here or %{browse}",
                    // Used as the label for the link that opens the system file selection dialog.
                    browse: "browse",
                },
            };

            /***/
        },

        /***/ 3417: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var _core = __webpack_require__(9429);

            var _preact = __webpack_require__(6400);

            const toArray = __webpack_require__(6361);

            const packageJson = {
                version: "2.1.0",
            };

            const locale = __webpack_require__(3762);

            class FileInput extends _core.UIPlugin {
                constructor(uppy, opts) {
                    super(uppy, opts);
                    this.id = this.opts.id || "FileInput";
                    this.title = "File Input";
                    this.type = "acquirer";
                    this.defaultLocale = locale; // Default options

                    const defaultOptions = {
                        target: null,
                        pretty: true,
                        inputName: "files[]",
                    }; // Merge default options with the ones set by user

                    this.opts = { ...defaultOptions, ...opts };
                    this.i18nInit();
                    this.render = this.render.bind(this);
                    this.handleInputChange = this.handleInputChange.bind(this);
                    this.handleClick = this.handleClick.bind(this);
                }

                addFiles(files) {
                    const descriptors = files.map((file) => ({
                        source: this.id,
                        name: file.name,
                        type: file.type,
                        data: file,
                    }));

                    try {
                        this.uppy.addFiles(descriptors);
                    } catch (err) {
                        this.uppy.log(err);
                    }
                }

                handleInputChange(event) {
                    this.uppy.log(
                        "[FileInput] Something selected through input..."
                    );
                    const files = toArray(event.target.files);
                    this.addFiles(files); // We clear the input after a file is selected, because otherwise
                    // change event is not fired in Chrome and Safari when a file
                    // with the same name is selected.
                    // ___Why not use value="" on <input/> instead?
                    //    Because if we use that method of clearing the input,
                    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

                    event.target.value = null; // eslint-disable-line no-param-reassign
                }

                handleClick() {
                    this.input.click();
                }

                render() {
                    /* http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
                    const hiddenInputStyle = {
                        width: "0.1px",
                        height: "0.1px",
                        opacity: 0,
                        overflow: "hidden",
                        position: "absolute",
                        zIndex: -1,
                    };
                    const { restrictions } = this.uppy.opts;
                    const accept = restrictions.allowedFileTypes
                        ? restrictions.allowedFileTypes.join(",")
                        : null;
                    return (0, _preact.h)(
                        "div",
                        {
                            className: "uppy-FileInput-container",
                        },
                        (0, _preact.h)("input", {
                            className: "uppy-FileInput-input",
                            style: this.opts.pretty && hiddenInputStyle,
                            type: "file",
                            name: this.opts.inputName,
                            onChange: this.handleInputChange,
                            multiple: restrictions.maxNumberOfFiles !== 1,
                            accept: accept,
                            ref: (input) => {
                                this.input = input;
                            },
                        }),
                        this.opts.pretty &&
                            (0, _preact.h)(
                                "button",
                                {
                                    className: "uppy-FileInput-btn",
                                    type: "button",
                                    onClick: this.handleClick,
                                },
                                this.i18n("chooseFiles")
                            )
                    );
                }

                install() {
                    const { target } = this.opts;

                    if (target) {
                        this.mount(target, this);
                    }
                }

                uninstall() {
                    this.unmount();
                }
            }

            FileInput.VERSION = packageJson.version;
            module.exports = FileInput;

            /***/
        },

        /***/ 3993: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            module.exports = __webpack_require__(3417);

            /***/
        },

        /***/ 3762: /***/ function (module) {
            "use strict";

            module.exports = {
                strings: {
                    // The same key is used for the same purpose by @uppy/robodog's `form()` API, but our
                    // locale pack scripts can't access it in Robodog. If it is updated here, it should
                    // also be updated there!
                    chooseFiles: "Choose files",
                },
            };

            /***/
        },

        /***/ 7320: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var _preact = __webpack_require__(6400);

            var _core = __webpack_require__(9429);

            const packageJson = {
                version: "2.1.0",
            };
            /**
             * Progress bar
             *
             */

            class ProgressBar extends _core.UIPlugin {
                constructor(uppy, opts) {
                    super(uppy, opts);
                    this.id = this.opts.id || "ProgressBar";
                    this.title = "Progress Bar";
                    this.type = "progressindicator"; // set default options

                    const defaultOptions = {
                        target: "body",
                        fixed: false,
                        hideAfterFinish: true,
                    }; // merge default options with the ones set by user

                    this.opts = { ...defaultOptions, ...opts };
                    this.render = this.render.bind(this);
                }

                render(state) {
                    const progress = state.totalProgress || 0; // before starting and after finish should be hidden if specified in the options

                    const isHidden =
                        (progress === 0 || progress === 100) &&
                        this.opts.hideAfterFinish;
                    return (0, _preact.h)(
                        "div",
                        {
                            className: "uppy uppy-ProgressBar",
                            style: {
                                position: this.opts.fixed ? "fixed" : "initial",
                            },
                            "aria-hidden": isHidden,
                        },
                        (0, _preact.h)("div", {
                            className: "uppy-ProgressBar-inner",
                            style: {
                                width: `${progress}%`,
                            },
                        }),
                        (0, _preact.h)(
                            "div",
                            {
                                className: "uppy-ProgressBar-percentage",
                            },
                            progress
                        )
                    );
                }

                install() {
                    const { target } = this.opts;

                    if (target) {
                        this.mount(target, this);
                    }
                }

                uninstall() {
                    this.unmount();
                }
            }

            ProgressBar.VERSION = packageJson.version;
            module.exports = ProgressBar;

            /***/
        },

        /***/ 5117: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            module.exports = __webpack_require__(7320);

            /***/
        },

        /***/ 8350: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.CancelBtn = CancelBtn;
            exports.DoneBtn = DoneBtn;
            exports.LoadingSpinner = LoadingSpinner;
            exports.PauseResumeButton = PauseResumeButton;
            exports.ProgressBarComplete = ProgressBarComplete;
            exports.ProgressBarError = ProgressBarError;
            exports.ProgressBarProcessing = ProgressBarProcessing;
            exports.ProgressBarUploading = ProgressBarUploading;
            exports.ProgressDetails = ProgressDetails;
            exports.RetryBtn = RetryBtn;
            exports.UploadBtn = UploadBtn;

            var _preact = __webpack_require__(6400);

            const classNames = __webpack_require__(4184);

            const throttle = __webpack_require__(3096);

            const prettierBytes = __webpack_require__(5158);

            const prettyETA = __webpack_require__(1011);

            const statusBarStates = __webpack_require__(8297);

            const DOT = `\u00B7`;

            const renderDot = () => ` ${DOT} `;

            function UploadBtn(props) {
                const {
                    newFiles,
                    isUploadStarted,
                    recoveredState,
                    i18n,
                    uploadState,
                    isSomeGhost,
                    startUpload,
                } = props;
                const uploadBtnClassNames = classNames(
                    "uppy-u-reset",
                    "uppy-c-btn",
                    "uppy-StatusBar-actionBtn",
                    "uppy-StatusBar-actionBtn--upload",
                    {
                        "uppy-c-btn-primary":
                            uploadState === statusBarStates.STATE_WAITING,
                    },
                    {
                        "uppy-StatusBar-actionBtn--disabled": isSomeGhost,
                    }
                );
                const uploadBtnText =
                    newFiles && isUploadStarted && !recoveredState
                        ? i18n("uploadXNewFiles", {
                              smart_count: newFiles,
                          })
                        : i18n("uploadXFiles", {
                              smart_count: newFiles,
                          });
                return (0, _preact.h)(
                    "button",
                    {
                        type: "button",
                        className: uploadBtnClassNames,
                        "aria-label": i18n("uploadXFiles", {
                            smart_count: newFiles,
                        }),
                        onClick: startUpload,
                        disabled: isSomeGhost,
                        "data-uppy-super-focusable": true,
                    },
                    uploadBtnText
                );
            }

            function RetryBtn(props) {
                const { i18n, uppy } = props;
                return (0, _preact.h)(
                    "button",
                    {
                        type: "button",
                        className:
                            "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
                        "aria-label": i18n("retryUpload"),
                        onClick: () => uppy.retryAll(),
                        "data-uppy-super-focusable": true,
                    },
                    (0, _preact.h)(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className: "uppy-c-icon",
                            width: "8",
                            height: "10",
                            viewBox: "0 0 8 10",
                        },
                        (0, _preact.h)("path", {
                            d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z",
                        })
                    ),
                    i18n("retry")
                );
            }

            function CancelBtn(props) {
                const { i18n, uppy } = props;
                return (0, _preact.h)(
                    "button",
                    {
                        type: "button",
                        className:
                            "uppy-u-reset uppy-StatusBar-actionCircleBtn",
                        title: i18n("cancel"),
                        "aria-label": i18n("cancel"),
                        onClick: () => uppy.cancelAll(),
                        "data-cy": "cancel",
                        "data-uppy-super-focusable": true,
                    },
                    (0, _preact.h)(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className: "uppy-c-icon",
                            width: "16",
                            height: "16",
                            viewBox: "0 0 16 16",
                        },
                        (0, _preact.h)(
                            "g",
                            {
                                fill: "none",
                                fillRule: "evenodd",
                            },
                            (0, _preact.h)("circle", {
                                fill: "#888",
                                cx: "8",
                                cy: "8",
                                r: "8",
                            }),
                            (0, _preact.h)("path", {
                                fill: "#FFF",
                                d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z",
                            })
                        )
                    )
                );
            }

            function PauseResumeButton(props) {
                const {
                    isAllPaused,
                    i18n,
                    isAllComplete,
                    resumableUploads,
                    uppy,
                } = props;
                const title = isAllPaused ? i18n("resume") : i18n("pause");

                function togglePauseResume() {
                    if (isAllComplete) return null;

                    if (!resumableUploads) {
                        return uppy.cancelAll();
                    }

                    if (isAllPaused) {
                        return uppy.resumeAll();
                    }

                    return uppy.pauseAll();
                }

                return (0, _preact.h)(
                    "button",
                    {
                        title: title,
                        "aria-label": title,
                        className:
                            "uppy-u-reset uppy-StatusBar-actionCircleBtn",
                        type: "button",
                        onClick: togglePauseResume,
                        "data-uppy-super-focusable": true,
                    },
                    (0, _preact.h)(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className: "uppy-c-icon",
                            width: "16",
                            height: "16",
                            viewBox: "0 0 16 16",
                        },
                        (0, _preact.h)(
                            "g",
                            {
                                fill: "none",
                                fillRule: "evenodd",
                            },
                            (0, _preact.h)("circle", {
                                fill: "#888",
                                cx: "8",
                                cy: "8",
                                r: "8",
                            }),
                            (0, _preact.h)("path", {
                                fill: "#FFF",
                                d: isAllPaused
                                    ? "M6 4.25L11.5 8 6 11.75z"
                                    : "M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z",
                            })
                        )
                    )
                );
            }

            function DoneBtn(props) {
                const { i18n, doneButtonHandler } = props;
                return (0, _preact.h)(
                    "button",
                    {
                        type: "button",
                        className:
                            "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done",
                        onClick: doneButtonHandler,
                        "data-uppy-super-focusable": true,
                    },
                    i18n("done")
                );
            }

            function LoadingSpinner() {
                return (0, _preact.h)(
                    "svg",
                    {
                        className: "uppy-StatusBar-spinner",
                        "aria-hidden": "true",
                        focusable: "false",
                        width: "14",
                        height: "14",
                    },
                    (0, _preact.h)("path", {
                        d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
                        fillRule: "evenodd",
                    })
                );
            }

            function ProgressBarProcessing(props) {
                const { progress } = props;
                const { value, mode, message } = progress;
                const roundedValue = Math.round(value * 100);
                const dot = `\u00B7`;
                return (0, _preact.h)(
                    "div",
                    {
                        className: "uppy-StatusBar-content",
                    },
                    (0, _preact.h)(LoadingSpinner, null),
                    mode === "determinate" ? `${roundedValue}% ${dot} ` : "",
                    message
                );
            }

            function ProgressDetails(props) {
                const {
                    numUploads,
                    complete,
                    totalUploadedSize,
                    totalSize,
                    totalETA,
                    i18n,
                } = props;
                const ifShowFilesUploadedOfTotal = numUploads > 1;
                return (0, _preact.h)(
                    "div",
                    {
                        className: "uppy-StatusBar-statusSecondary",
                    },
                    ifShowFilesUploadedOfTotal &&
                        i18n("filesUploadedOfTotal", {
                            complete,
                            smart_count: numUploads,
                        }),
                    (0, _preact.h)(
                        "span",
                        {
                            className: "uppy-StatusBar-additionalInfo",
                        },
                        ifShowFilesUploadedOfTotal && renderDot(),
                        i18n("dataUploadedOfTotal", {
                            complete: prettierBytes(totalUploadedSize),
                            total: prettierBytes(totalSize),
                        }),
                        renderDot(),
                        i18n("xTimeLeft", {
                            time: prettyETA(totalETA),
                        })
                    )
                );
            }

            function FileUploadCount(props) {
                const { i18n, complete, numUploads } = props;
                return (0, _preact.h)(
                    "div",
                    {
                        className: "uppy-StatusBar-statusSecondary",
                    },
                    i18n("filesUploadedOfTotal", {
                        complete,
                        smart_count: numUploads,
                    })
                );
            }

            function UploadNewlyAddedFiles(props) {
                const { i18n, newFiles, startUpload } = props;
                const uploadBtnClassNames = classNames(
                    "uppy-u-reset",
                    "uppy-c-btn",
                    "uppy-StatusBar-actionBtn",
                    "uppy-StatusBar-actionBtn--uploadNewlyAdded"
                );
                return (0, _preact.h)(
                    "div",
                    {
                        className: "uppy-StatusBar-statusSecondary",
                    },
                    (0, _preact.h)(
                        "div",
                        {
                            className: "uppy-StatusBar-statusSecondaryHint",
                        },
                        i18n("xMoreFilesAdded", {
                            smart_count: newFiles,
                        })
                    ),
                    (0, _preact.h)(
                        "button",
                        {
                            type: "button",
                            className: uploadBtnClassNames,
                            "aria-label": i18n("uploadXFiles", {
                                smart_count: newFiles,
                            }),
                            onClick: startUpload,
                        },
                        i18n("upload")
                    )
                );
            }

            const ThrottledProgressDetails = throttle(ProgressDetails, 500, {
                leading: true,
                trailing: true,
            });

            function ProgressBarUploading(props) {
                const {
                    i18n,
                    supportsUploadProgress,
                    totalProgress,
                    showProgressDetails,
                    isUploadStarted,
                    isAllComplete,
                    isAllPaused,
                    newFiles,
                    numUploads,
                    complete,
                    totalUploadedSize,
                    totalSize,
                    totalETA,
                    startUpload,
                } = props;
                const showUploadNewlyAddedFiles = newFiles && isUploadStarted;

                if (!isUploadStarted || isAllComplete) {
                    return null;
                }

                const title = isAllPaused ? i18n("paused") : i18n("uploading");

                function renderProgressDetails() {
                    if (
                        !isAllPaused &&
                        !showUploadNewlyAddedFiles &&
                        showProgressDetails
                    ) {
                        if (supportsUploadProgress) {
                            return (0, _preact.h)(ThrottledProgressDetails, {
                                numUploads: numUploads,
                                complete: complete,
                                totalUploadedSize: totalUploadedSize,
                                totalSize: totalSize,
                                totalETA: totalETA,
                                i18n: i18n,
                            });
                        }

                        return (0, _preact.h)(FileUploadCount, {
                            i18n: i18n,
                            complete: complete,
                            numUploads: numUploads,
                        });
                    }

                    return null;
                }

                return (0, _preact.h)(
                    "div",
                    {
                        className: "uppy-StatusBar-content",
                        "aria-label": title,
                        title: title,
                    },
                    !isAllPaused ? (0, _preact.h)(LoadingSpinner, null) : null,
                    (0, _preact.h)(
                        "div",
                        {
                            className: "uppy-StatusBar-status",
                        },
                        (0, _preact.h)(
                            "div",
                            {
                                className: "uppy-StatusBar-statusPrimary",
                            },
                            supportsUploadProgress
                                ? `${title}: ${totalProgress}%`
                                : title
                        ),
                        renderProgressDetails(),
                        showUploadNewlyAddedFiles
                            ? (0, _preact.h)(UploadNewlyAddedFiles, {
                                  i18n: i18n,
                                  newFiles: newFiles,
                                  startUpload: startUpload,
                              })
                            : null
                    )
                );
            }

            function ProgressBarComplete(props) {
                const { i18n } = props;
                return (0, _preact.h)(
                    "div",
                    {
                        className: "uppy-StatusBar-content",
                        role: "status",
                        title: i18n("complete"),
                    },
                    (0, _preact.h)(
                        "div",
                        {
                            className: "uppy-StatusBar-status",
                        },
                        (0, _preact.h)(
                            "div",
                            {
                                className: "uppy-StatusBar-statusPrimary",
                            },
                            (0, _preact.h)(
                                "svg",
                                {
                                    "aria-hidden": "true",
                                    focusable: "false",
                                    className:
                                        "uppy-StatusBar-statusIndicator uppy-c-icon",
                                    width: "15",
                                    height: "11",
                                    viewBox: "0 0 15 11",
                                },
                                (0, _preact.h)("path", {
                                    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z",
                                })
                            ),
                            i18n("complete")
                        )
                    )
                );
            }

            function ProgressBarError(props) {
                const { error, i18n, complete, numUploads } = props;

                function displayErrorAlert() {
                    const errorMessage = `${i18n(
                        "uploadFailed"
                    )} \n\n ${error}`; // eslint-disable-next-line no-alert

                    alert(errorMessage); // TODO: move to custom alert implementation
                }

                return (0, _preact.h)(
                    "div",
                    {
                        className: "uppy-StatusBar-content",
                        title: i18n("uploadFailed"),
                    },
                    (0, _preact.h)(
                        "svg",
                        {
                            "aria-hidden": "true",
                            focusable: "false",
                            className:
                                "uppy-StatusBar-statusIndicator uppy-c-icon",
                            width: "11",
                            height: "11",
                            viewBox: "0 0 11 11",
                        },
                        (0, _preact.h)("path", {
                            d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z",
                        })
                    ),
                    (0, _preact.h)(
                        "div",
                        {
                            className: "uppy-StatusBar-status",
                        },
                        (0, _preact.h)(
                            "div",
                            {
                                className: "uppy-StatusBar-statusPrimary",
                            },
                            i18n("uploadFailed"),
                            (0, _preact.h)(
                                "button",
                                {
                                    className:
                                        "uppy-u-reset uppy-StatusBar-details",
                                    "aria-label": i18n("showErrorDetails"),
                                    "data-microtip-position": "top-right",
                                    "data-microtip-size": "medium",
                                    onClick: displayErrorAlert,
                                    type: "button",
                                },
                                "?"
                            )
                        ),
                        (0, _preact.h)(FileUploadCount, {
                            i18n: i18n,
                            complete: complete,
                            numUploads: numUploads,
                        })
                    )
                );
            }

            /***/
        },

        /***/ 5333: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var _preact = __webpack_require__(6400);

            var _Components = __webpack_require__(8350);

            // TODO: rename this file to StatusBarUI>jsx on the next major.
            const classNames = __webpack_require__(4184);

            const statusBarStates = __webpack_require__(8297);

            const calculateProcessingProgress = __webpack_require__(4573);

            const {
                STATE_ERROR,
                STATE_WAITING,
                STATE_PREPROCESSING,
                STATE_UPLOADING,
                STATE_POSTPROCESSING,
                STATE_COMPLETE,
            } = statusBarStates; // TODO: rename the function to StatusBarUI on the next major.

            function StatusBar(props) {
                const {
                    newFiles,
                    allowNewUpload,
                    isUploadInProgress,
                    isAllPaused,
                    resumableUploads,
                    error,
                    hideUploadButton,
                    hidePauseResumeButton,
                    hideCancelButton,
                    hideRetryButton,
                    recoveredState,
                    uploadState,
                    totalProgress,
                    files,
                    supportsUploadProgress,
                    hideAfterFinish,
                    isSomeGhost,
                    doneButtonHandler,
                    isUploadStarted,
                    i18n,
                    startUpload,
                    uppy,
                    isAllComplete,
                    showProgressDetails,
                    numUploads,
                    complete,
                    totalSize,
                    totalETA,
                    totalUploadedSize,
                } = props;

                function getProgressValue() {
                    switch (uploadState) {
                        case STATE_POSTPROCESSING:
                        case STATE_PREPROCESSING: {
                            const progress = calculateProcessingProgress(files);

                            if (progress.mode === "determinate") {
                                return progress.value * 100;
                            }

                            return totalProgress;
                        }

                        case STATE_ERROR: {
                            return null;
                        }

                        case STATE_UPLOADING: {
                            if (!supportsUploadProgress) {
                                return null;
                            }

                            return totalProgress;
                        }

                        default:
                            return totalProgress;
                    }
                }

                function getIsIndeterminate() {
                    switch (uploadState) {
                        case STATE_POSTPROCESSING:
                        case STATE_PREPROCESSING: {
                            const { mode } = calculateProcessingProgress(files);
                            return mode === "indeterminate";
                        }

                        case STATE_UPLOADING: {
                            if (!supportsUploadProgress) {
                                return true;
                            }

                            return false;
                        }

                        default:
                            return false;
                    }
                }

                function getIsHidden() {
                    if (recoveredState) {
                        return false;
                    }

                    switch (uploadState) {
                        case STATE_WAITING:
                            return hideUploadButton || newFiles === 0;

                        case STATE_COMPLETE:
                            return hideAfterFinish;

                        default:
                            return false;
                    }
                }

                const progressValue = getProgressValue();
                const isHidden = getIsHidden();
                const width = progressValue != null ? progressValue : 100;
                const showUploadBtn =
                    !error &&
                    newFiles &&
                    !isUploadInProgress &&
                    !isAllPaused &&
                    allowNewUpload &&
                    !hideUploadButton;
                const showCancelBtn =
                    !hideCancelButton &&
                    uploadState !== STATE_WAITING &&
                    uploadState !== STATE_COMPLETE;
                const showPauseResumeBtn =
                    resumableUploads &&
                    !hidePauseResumeButton &&
                    uploadState === STATE_UPLOADING;
                const showRetryBtn =
                    error && !isAllComplete && !hideRetryButton;
                const showDoneBtn =
                    doneButtonHandler && uploadState === STATE_COMPLETE;
                const progressClassNames = classNames(
                    "uppy-StatusBar-progress",
                    {
                        "is-indeterminate": getIsIndeterminate(),
                    }
                );
                const statusBarClassNames = classNames(
                    "uppy-StatusBar",
                    `is-${uploadState}`,
                    {
                        "has-ghosts": isSomeGhost,
                    }
                );
                return (0, _preact.h)(
                    "div",
                    {
                        className: statusBarClassNames,
                        "aria-hidden": isHidden,
                    },
                    (0, _preact.h)("div", {
                        className: progressClassNames,
                        style: {
                            width: `${width}%`,
                        },
                        role: "progressbar",
                        "aria-label": `${width}%`,
                        "aria-valuetext": `${width}%`,
                        "aria-valuemin": "0",
                        "aria-valuemax": "100",
                        "aria-valuenow": progressValue,
                    }),
                    (() => {
                        switch (uploadState) {
                            case STATE_PREPROCESSING:
                            case STATE_POSTPROCESSING:
                                return (0, _preact.h)(
                                    _Components.ProgressBarProcessing,
                                    {
                                        progress:
                                            calculateProcessingProgress(files),
                                    }
                                );

                            case STATE_COMPLETE:
                                return (0, _preact.h)(
                                    _Components.ProgressBarComplete,
                                    {
                                        i18n: i18n,
                                    }
                                );

                            case STATE_ERROR:
                                return (0, _preact.h)(
                                    _Components.ProgressBarError,
                                    {
                                        error: error,
                                        i18n: i18n,
                                        numUploads: numUploads,
                                        complete: complete,
                                    }
                                );

                            case STATE_UPLOADING:
                                return (0, _preact.h)(
                                    _Components.ProgressBarUploading,
                                    {
                                        i18n: i18n,
                                        supportsUploadProgress:
                                            supportsUploadProgress,
                                        totalProgress: totalProgress,
                                        showProgressDetails:
                                            showProgressDetails,
                                        isUploadStarted: isUploadStarted,
                                        isAllComplete: isAllComplete,
                                        isAllPaused: isAllPaused,
                                        newFiles: newFiles,
                                        numUploads: numUploads,
                                        complete: complete,
                                        totalUploadedSize: totalUploadedSize,
                                        totalSize: totalSize,
                                        totalETA: totalETA,
                                        startUpload: startUpload,
                                    }
                                );

                            default:
                                return null;
                        }
                    })(),
                    (0, _preact.h)(
                        "div",
                        {
                            className: "uppy-StatusBar-actions",
                        },
                        recoveredState || showUploadBtn
                            ? (0, _preact.h)(_Components.UploadBtn, {
                                  newFiles: newFiles,
                                  isUploadStarted: isUploadStarted,
                                  recoveredState: recoveredState,
                                  i18n: i18n,
                                  isSomeGhost: isSomeGhost,
                                  startUpload: startUpload,
                                  uploadState: uploadState,
                              })
                            : null,
                        showRetryBtn
                            ? (0, _preact.h)(_Components.RetryBtn, {
                                  i18n: i18n,
                                  uppy: uppy,
                              })
                            : null,
                        showPauseResumeBtn
                            ? (0, _preact.h)(_Components.PauseResumeButton, {
                                  isAllPaused: isAllPaused,
                                  i18n: i18n,
                                  isAllComplete: isAllComplete,
                                  resumableUploads: resumableUploads,
                                  uppy: uppy,
                              })
                            : null,
                        showCancelBtn
                            ? (0, _preact.h)(_Components.CancelBtn, {
                                  i18n: i18n,
                                  uppy: uppy,
                              })
                            : null,
                        showDoneBtn
                            ? (0, _preact.h)(_Components.DoneBtn, {
                                  i18n: i18n,
                                  doneButtonHandler: doneButtonHandler,
                              })
                            : null
                    )
                );
            }

            module.exports = StatusBar;

            /***/
        },

        /***/ 8297: /***/ function (module) {
            "use strict";

            module.exports = {
                STATE_ERROR: "error",
                STATE_WAITING: "waiting",
                STATE_PREPROCESSING: "preprocessing",
                STATE_UPLOADING: "uploading",
                STATE_POSTPROCESSING: "postprocessing",
                STATE_COMPLETE: "complete",
            };

            /***/
        },

        /***/ 382: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var _core = __webpack_require__(9429);

            // TODO: rename this file to StatusBar.jsx on the next major.
            const getSpeed = __webpack_require__(522);

            const getBytesRemaining = __webpack_require__(9599);

            const getTextDirection = __webpack_require__(8958);

            const statusBarStates = __webpack_require__(8297);

            const StatusBarUI = __webpack_require__(5333);

            const packageJson = {
                version: "2.2.0",
            };

            const locale = __webpack_require__(1652);
            /**
             * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
             * progress percentage and time remaining.
             */

            class StatusBar extends _core.UIPlugin {
                constructor(uppy, opts) {
                    super(uppy, opts);

                    this.startUpload = () => {
                        const { recoveredState } = this.uppy.getState();

                        if (recoveredState) {
                            this.uppy.emit("restore-confirmed");
                            return undefined;
                        }

                        return this.uppy.upload().catch(() => {
                            // Error logged in Core
                        });
                    };

                    this.id = this.opts.id || "StatusBar";
                    this.title = "StatusBar";
                    this.type = "progressindicator";
                    this.defaultLocale = locale; // set default options

                    const defaultOptions = {
                        target: "body",
                        hideUploadButton: false,
                        hideRetryButton: false,
                        hidePauseResumeButton: false,
                        hideCancelButton: false,
                        showProgressDetails: false,
                        hideAfterFinish: true,
                        doneButtonHandler: null,
                    };
                    this.opts = { ...defaultOptions, ...opts };
                    this.i18nInit();
                    this.render = this.render.bind(this);
                    this.install = this.install.bind(this);
                }

                render(state) {
                    const {
                        capabilities,
                        files,
                        allowNewUpload,
                        totalProgress,
                        error,
                        recoveredState,
                    } = state;
                    const {
                        newFiles,
                        startedFiles,
                        completeFiles,
                        inProgressNotPausedFiles,
                        isUploadStarted,
                        isAllComplete,
                        isAllErrored,
                        isAllPaused,
                        isUploadInProgress,
                        isSomeGhost,
                    } = this.uppy.getObjectOfFilesPerState(); // If some state was recovered, we want to show Upload button/counter
                    // for all the files, because in this case it’s not an Upload button,
                    // but “Confirm Restore Button”

                    const newFilesOrRecovered = recoveredState
                        ? Object.values(files)
                        : newFiles;
                    const totalETA = getTotalETA(inProgressNotPausedFiles);
                    const resumableUploads = !!capabilities.resumableUploads;
                    const supportsUploadProgress =
                        capabilities.uploadProgress !== false;
                    let totalSize = 0;
                    let totalUploadedSize = 0;
                    startedFiles.forEach((file) => {
                        totalSize += file.progress.bytesTotal || 0;
                        totalUploadedSize += file.progress.bytesUploaded || 0;
                    });
                    return StatusBarUI({
                        error,
                        uploadState: getUploadingState(
                            error,
                            isAllComplete,
                            recoveredState,
                            state.files || {}
                        ),
                        allowNewUpload,
                        totalProgress,
                        totalSize,
                        totalUploadedSize,
                        isAllComplete: false,
                        isAllPaused,
                        isAllErrored,
                        isUploadStarted,
                        isUploadInProgress,
                        isSomeGhost,
                        recoveredState,
                        complete: completeFiles.length,
                        newFiles: newFilesOrRecovered.length,
                        numUploads: startedFiles.length,
                        totalETA,
                        files,
                        i18n: this.i18n,
                        uppy: this.uppy,
                        startUpload: this.startUpload,
                        doneButtonHandler: this.opts.doneButtonHandler,
                        resumableUploads,
                        supportsUploadProgress,
                        showProgressDetails: this.opts.showProgressDetails,
                        hideUploadButton: this.opts.hideUploadButton,
                        hideRetryButton: this.opts.hideRetryButton,
                        hidePauseResumeButton: this.opts.hidePauseResumeButton,
                        hideCancelButton: this.opts.hideCancelButton,
                        hideAfterFinish: this.opts.hideAfterFinish,
                        isTargetDOMEl: this.isTargetDOMEl,
                    });
                }

                onMount() {
                    // Set the text direction if the page has not defined one.
                    const element = this.el;
                    const direction = getTextDirection(element);

                    if (!direction) {
                        element.dir = "ltr";
                    }
                }

                install() {
                    const { target } = this.opts;

                    if (target) {
                        this.mount(target, this);
                    }
                }

                uninstall() {
                    this.unmount();
                }
            }

            StatusBar.VERSION = packageJson.version;
            module.exports = StatusBar;

            function getTotalSpeed(files) {
                let totalSpeed = 0;
                files.forEach((file) => {
                    totalSpeed += getSpeed(file.progress);
                });
                return totalSpeed;
            }

            function getTotalETA(files) {
                const totalSpeed = getTotalSpeed(files);

                if (totalSpeed === 0) {
                    return 0;
                }

                const totalBytesRemaining = files.reduce((total, file) => {
                    return total + getBytesRemaining(file.progress);
                }, 0);
                return Math.round((totalBytesRemaining / totalSpeed) * 10) / 10;
            }

            function getUploadingState(
                error,
                isAllComplete,
                recoveredState,
                files
            ) {
                if (error && !isAllComplete) {
                    return statusBarStates.STATE_ERROR;
                }

                if (isAllComplete) {
                    return statusBarStates.STATE_COMPLETE;
                }

                if (recoveredState) {
                    return statusBarStates.STATE_WAITING;
                }

                let state = statusBarStates.STATE_WAITING;
                const fileIDs = Object.keys(files);

                for (let i = 0; i < fileIDs.length; i++) {
                    const { progress } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

                    if (progress.uploadStarted && !progress.uploadComplete) {
                        return statusBarStates.STATE_UPLOADING;
                    } // If files are being preprocessed AND postprocessed at this time, we show the
                    // preprocess state. If any files are being uploaded we show uploading.

                    if (
                        progress.preprocess &&
                        state !== statusBarStates.STATE_UPLOADING
                    ) {
                        state = statusBarStates.STATE_PREPROCESSING;
                    } // If NO files are being preprocessed or uploaded right now, but some files are
                    // being postprocessed, show the postprocess state.

                    if (
                        progress.postprocess &&
                        state !== statusBarStates.STATE_UPLOADING &&
                        state !== statusBarStates.STATE_PREPROCESSING
                    ) {
                        state = statusBarStates.STATE_POSTPROCESSING;
                    }
                }

                return state;
            }

            /***/
        },

        /***/ 4573: /***/ function (module) {
            "use strict";

            function calculateProcessingProgress(files) {
                const values = [];
                let mode;
                let message;

                for (const { progress } of Object.values(files)) {
                    const { preprocess, postprocess } = progress; // In the future we should probably do this differently. For now we'll take the
                    // mode and message from the first file…

                    if (message == null && (preprocess || postprocess)) {
                        ({ mode, message } = preprocess || postprocess);
                    }

                    if (
                        (preprocess == null ? void 0 : preprocess.mode) ===
                        "determinate"
                    )
                        values.push(preprocess.value);
                    if (
                        (postprocess == null ? void 0 : postprocess.mode) ===
                        "determinate"
                    )
                        values.push(postprocess.value);
                }

                const value = values.reduce((total, progressValue) => {
                    return total + progressValue / values.length;
                }, 0);
                return {
                    mode,
                    message,
                    value,
                };
            }

            module.exports = calculateProcessingProgress;

            /***/
        },

        /***/ 2310: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            module.exports = __webpack_require__(382);

            /***/
        },

        /***/ 1652: /***/ function (module) {
            "use strict";

            module.exports = {
                strings: {
                    // Shown in the status bar while files are being uploaded.
                    uploading: "Uploading",
                    // Shown in the status bar once all files have been uploaded.
                    complete: "Complete",
                    // Shown in the status bar if an upload failed.
                    uploadFailed: "Upload failed",
                    // Shown in the status bar while the upload is paused.
                    paused: "Paused",
                    // Used as the label for the button that retries an upload.
                    retry: "Retry",
                    // Used as the label for the button that cancels an upload.
                    cancel: "Cancel",
                    // Used as the label for the button that pauses an upload.
                    pause: "Pause",
                    // Used as the label for the button that resumes an upload.
                    resume: "Resume",
                    // Used as the label for the button that resets the upload state after an upload
                    done: "Done",
                    // When `showProgressDetails` is set, shows the number of files that have been fully uploaded so far.
                    filesUploadedOfTotal: {
                        0: "%{complete} of %{smart_count} file uploaded",
                        1: "%{complete} of %{smart_count} files uploaded",
                    },
                    // When `showProgressDetails` is set, shows the amount of bytes that have been uploaded so far.
                    dataUploadedOfTotal: "%{complete} of %{total}",
                    // When `showProgressDetails` is set, shows an estimation of how long the upload will take to complete.
                    xTimeLeft: "%{time} left",
                    // Used as the label for the button that starts an upload.
                    uploadXFiles: {
                        0: "Upload %{smart_count} file",
                        1: "Upload %{smart_count} files",
                    },
                    // Used as the label for the button that starts an upload, if another upload has been started in the past
                    // and new files were added later.
                    uploadXNewFiles: {
                        0: "Upload +%{smart_count} file",
                        1: "Upload +%{smart_count} files",
                    },
                    upload: "Upload",
                    retryUpload: "Retry upload",
                    xMoreFilesAdded: {
                        0: "%{smart_count} more file added",
                        1: "%{smart_count} more files added",
                    },
                    showErrorDetails: "Show error details",
                },
            };

            /***/
        },

        /***/ 2961: /***/ function (module) {
            let urlAlphabet =
                "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
            let customAlphabet = (alphabet, defaultSize = 21) => {
                return (size = defaultSize) => {
                    let id = "";
                    let i = size;
                    while (i--) {
                        id += alphabet[(Math.random() * alphabet.length) | 0];
                    }
                    return id;
                };
            };
            let nanoid = (size = 21) => {
                let id = "";
                let i = size;
                while (i--) {
                    id += urlAlphabet[(Math.random() * 64) | 0];
                }
                return id;
            };
            module.exports = { nanoid, customAlphabet };

            /***/
        },

        /***/ 6214: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ S2: function () {
                    return /* reexport default export from named module */ _lib_FileInput_js__WEBPACK_IMPORTED_MODULE_5__;
                },
                /* harmony export */ vo: function () {
                    return /* reexport default export from named module */ _lib_useUppy_js__WEBPACK_IMPORTED_MODULE_6__;
                },
                /* harmony export */
            });
            /* harmony import */ var _lib_Dashboard_js__WEBPACK_IMPORTED_MODULE_0__ =
                __webpack_require__(5033);
            /* harmony import */ var _lib_DashboardModal_js__WEBPACK_IMPORTED_MODULE_1__ =
                __webpack_require__(7624);
            /* harmony import */ var _lib_DragDrop_js__WEBPACK_IMPORTED_MODULE_2__ =
                __webpack_require__(7727);
            /* harmony import */ var _lib_ProgressBar_js__WEBPACK_IMPORTED_MODULE_3__ =
                __webpack_require__(1810);
            /* harmony import */ var _lib_StatusBar_js__WEBPACK_IMPORTED_MODULE_4__ =
                __webpack_require__(7026);
            /* harmony import */ var _lib_FileInput_js__WEBPACK_IMPORTED_MODULE_5__ =
                __webpack_require__(1189);
            /* harmony import */ var _lib_useUppy_js__WEBPACK_IMPORTED_MODULE_6__ =
                __webpack_require__(8436);

            /***/
        },
    },
]);
