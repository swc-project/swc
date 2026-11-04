"use strict";

var util = require("@firebase/util");
var tslib = require("tslib");
var component = require("@firebase/component");
var modularAPIs = require("@firebase/app");
var logger$1 = require("@firebase/logger");

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== "default") {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(
                    n,
                    k,
                    d.get
                        ? d
                        : {
                              enumerable: true,
                              get: function () {
                                  return e[k];
                              },
                          }
                );
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var modularAPIs__namespace = /*#__PURE__*/ _interopNamespace(modularAPIs);

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Global context object for a collection of services using
 * a shared authentication state.
 *
 * marked as internal because it references internal types exported from @firebase/app
 * @internal
 */
var FirebaseAppImpl = /** @class */ (function () {
    function FirebaseAppImpl(_delegate, firebase) {
        var _this = this;
        this._delegate = _delegate;
        this.firebase = firebase;
        // add itself to container
        modularAPIs._addComponent(
            _delegate,
            new component.Component(
                "app-compat",
                function () {
                    return _this;
                },
                "PUBLIC" /* PUBLIC */
            )
        );
        this.container = _delegate.container;
    }
    Object.defineProperty(
        FirebaseAppImpl.prototype,
        "automaticDataCollectionEnabled",
        {
            get: function () {
                return this._delegate.automaticDataCollectionEnabled;
            },
            set: function (val) {
                this._delegate.automaticDataCollectionEnabled = val;
            },
            enumerable: false,
            configurable: true,
        }
    );
    Object.defineProperty(FirebaseAppImpl.prototype, "name", {
        get: function () {
            return this._delegate.name;
        },
        enumerable: false,
        configurable: true,
    });
    Object.defineProperty(FirebaseAppImpl.prototype, "options", {
        get: function () {
            return this._delegate.options;
        },
        enumerable: false,
        configurable: true,
    });
    FirebaseAppImpl.prototype.delete = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this._delegate.checkDestroyed();
            resolve();
        }).then(function () {
            _this.firebase.INTERNAL.removeApp(_this.name);
            return modularAPIs.deleteApp(_this._delegate);
        });
    };
    /**
     * Return a service instance associated with this app (creating it
     * on demand), identified by the passed instanceIdentifier.
     *
     * NOTE: Currently storage and functions are the only ones that are leveraging this
     * functionality. They invoke it by calling:
     *
     * ```javascript
     * firebase.app().storage('STORAGE BUCKET ID')
     * ```
     *
     * The service name is passed to this already
     * @internal
     */
    FirebaseAppImpl.prototype._getService = function (
        name,
        instanceIdentifier
    ) {
        var _a;
        if (instanceIdentifier === void 0) {
            instanceIdentifier = modularAPIs._DEFAULT_ENTRY_NAME;
        }
        this._delegate.checkDestroyed();
        // Initialize instance if InstatiationMode is `EXPLICIT`.
        var provider = this._delegate.container.getProvider(name);
        if (
            !provider.isInitialized() &&
            ((_a = provider.getComponent()) === null || _a === void 0
                ? void 0
                : _a.instantiationMode) === "EXPLICIT" /* EXPLICIT */
        ) {
            provider.initialize();
        }
        // getImmediate will always succeed because _getService is only called for registered components.
        return provider.getImmediate({
            identifier: instanceIdentifier,
        });
    };
    /**
     * Remove a service instance from the cache, so we will create a new instance for this service
     * when people try to get it again.
     *
     * NOTE: currently only firestore uses this functionality to support firestore shutdown.
     *
     * @param name The service name
     * @param instanceIdentifier instance identifier in case multiple instances are allowed
     * @internal
     */
    FirebaseAppImpl.prototype._removeServiceInstance = function (
        name,
        instanceIdentifier
    ) {
        if (instanceIdentifier === void 0) {
            instanceIdentifier = modularAPIs._DEFAULT_ENTRY_NAME;
        }
        this._delegate.container
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .getProvider(name)
            .clearInstance(instanceIdentifier);
    };
    /**
     * @param component the component being added to this app's container
     * @internal
     */
    FirebaseAppImpl.prototype._addComponent = function (component) {
        modularAPIs._addComponent(this._delegate, component);
    };
    FirebaseAppImpl.prototype._addOrOverwriteComponent = function (component) {
        modularAPIs._addOrOverwriteComponent(this._delegate, component);
    };
    FirebaseAppImpl.prototype.toJSON = function () {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options,
        };
    };
    return FirebaseAppImpl;
})();
// TODO: investigate why the following needs to be commented out
// Prevent dead-code elimination of these methods w/o invalid property
// copying.
// (FirebaseAppImpl.prototype.name && FirebaseAppImpl.prototype.options) ||
//   FirebaseAppImpl.prototype.delete ||
//   console.log('dc');

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a;
var ERRORS =
    ((_a = {}),
    (_a["no-app" /* NO_APP */] =
        "No Firebase App '{$appName}' has been created - " +
        "call Firebase App.initializeApp()"),
    (_a["invalid-app-argument" /* INVALID_APP_ARGUMENT */] =
        "firebase.{$appName}() takes either no argument or a " +
        "Firebase App instance."),
    _a);
var ERROR_FACTORY = new util.ErrorFactory("app-compat", "Firebase", ERRORS);

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Because auth can't share code with other components, we attach the utility functions
 * in an internal namespace to share code.
 * This function return a firebase namespace object without
 * any utility functions, so it can be shared between the regular firebaseNamespace and
 * the lite version.
 */
function createFirebaseNamespaceCore(firebaseAppImpl) {
    var apps = {};
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const components = new Map<string, Component<any>>();
    // A namespace is a plain JavaScript Object.
    var namespace = {
        // Hack to prevent Babel from modifying the object returned
        // as the firebase namespace.
        // @ts-ignore
        __esModule: true,
        initializeApp: initializeAppCompat,
        // @ts-ignore
        app: app,
        registerVersion: modularAPIs__namespace.registerVersion,
        setLogLevel: modularAPIs__namespace.setLogLevel,
        onLog: modularAPIs__namespace.onLog,
        // @ts-ignore
        apps: null,
        SDK_VERSION: modularAPIs__namespace.SDK_VERSION,
        INTERNAL: {
            registerComponent: registerComponentCompat,
            removeApp: removeApp,
            useAsService: useAsService,
            modularAPIs: modularAPIs__namespace,
        },
    };
    // Inject a circular default export to allow Babel users who were previously
    // using:
    //
    //   import firebase from 'firebase';
    //   which becomes: var firebase = require('firebase').default;
    //
    // instead of
    //
    //   import * as firebase from 'firebase';
    //   which becomes: var firebase = require('firebase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    namespace["default"] = namespace;
    // firebase.apps is a read-only getter.
    Object.defineProperty(namespace, "apps", {
        get: getApps,
    });
    /**
     * Called by App.delete() - but before any services associated with the App
     * are deleted.
     */
    function removeApp(name) {
        delete apps[name];
    }
    /**
     * Get the App object for a given name (or DEFAULT).
     */
    function app(name) {
        name = name || modularAPIs__namespace._DEFAULT_ENTRY_NAME;
        if (!util.contains(apps, name)) {
            throw ERROR_FACTORY.create("no-app" /* NO_APP */, {
                appName: name,
            });
        }
        return apps[name];
    }
    // @ts-ignore
    app["App"] = firebaseAppImpl;
    /**
     * Create a new App instance (name must be unique).
     *
     * This function is idempotent. It can be called more than once and return the same instance using the same options and config.
     */
    function initializeAppCompat(options, rawConfig) {
        if (rawConfig === void 0) {
            rawConfig = {};
        }
        var app = modularAPIs__namespace.initializeApp(options, rawConfig);
        if (util.contains(apps, app.name)) {
            return apps[app.name];
        }
        var appCompat = new firebaseAppImpl(app, namespace);
        apps[app.name] = appCompat;
        return appCompat;
    }
    /*
     * Return an array of all the non-deleted FirebaseApps.
     */
    function getApps() {
        // Make a copy so caller cannot mutate the apps list.
        return Object.keys(apps).map(function (name) {
            return apps[name];
        });
    }
    function registerComponentCompat(component) {
        var componentName = component.name;
        var componentNameWithoutCompat = componentName.replace("-compat", "");
        if (
            modularAPIs__namespace._registerComponent(component) &&
            component.type === "PUBLIC" /* PUBLIC */
        ) {
            // create service namespace for public components
            // The Service namespace is an accessor function ...
            var serviceNamespace = function (appArg) {
                if (appArg === void 0) {
                    appArg = app();
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof appArg[componentNameWithoutCompat] !== "function") {
                    // Invalid argument.
                    // This happens in the following case: firebase.storage('gs:/')
                    throw ERROR_FACTORY.create(
                        "invalid-app-argument" /* INVALID_APP_ARGUMENT */,
                        {
                            appName: componentName,
                        }
                    );
                }
                // Forward service instance lookup to the FirebaseApp.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return appArg[componentNameWithoutCompat]();
            };
            // ... and a container for service-level properties.
            if (component.serviceProps !== undefined) {
                util.deepExtend(serviceNamespace, component.serviceProps);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            namespace[componentNameWithoutCompat] = serviceNamespace;
            // Patch the FirebaseAppImpl prototype
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            firebaseAppImpl.prototype[componentNameWithoutCompat] =
                // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
                // option added to the no-explicit-any rule when ESlint releases it.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var serviceFxn = this._getService.bind(this, componentName);
                    return serviceFxn.apply(
                        this,
                        component.multipleInstances ? args : []
                    );
                };
        }
        return component.type === "PUBLIC" /* PUBLIC */
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              namespace[componentNameWithoutCompat]
            : null;
    }
    // Map the requested service to a registered service name
    // (used to map auth to serverAuth service when needed).
    function useAsService(app, name) {
        if (name === "serverAuth") {
            return null;
        }
        var useService = name;
        return useService;
    }
    return namespace;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Return a firebase namespace object.
 *
 * In production, this will be called exactly once and the result
 * assigned to the 'firebase' global.  It may be called multiple times
 * in unit tests.
 */
function createFirebaseNamespace() {
    var namespace = createFirebaseNamespaceCore(FirebaseAppImpl);
    namespace.INTERNAL = tslib.__assign(
        tslib.__assign({}, namespace.INTERNAL),
        {
            createFirebaseNamespace: createFirebaseNamespace,
            extendNamespace: extendNamespace,
            createSubscribe: util.createSubscribe,
            ErrorFactory: util.ErrorFactory,
            deepExtend: util.deepExtend,
        }
    );
    /**
     * Patch the top-level firebase namespace with additional properties.
     *
     * firebase.INTERNAL.extendNamespace()
     */
    function extendNamespace(props) {
        util.deepExtend(namespace, props);
    }
    return namespace;
}
var firebase$1 = createFirebaseNamespace();

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var logger = new logger$1.Logger("@firebase/app-compat");

var name = "@firebase/app-compat";
var version = "0.1.5";

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function registerCoreComponents(variant) {
    // Register `app` package.
    modularAPIs.registerVersion(name, version, variant);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Firebase Lite detection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (util.isBrowser() && self.firebase !== undefined) {
    logger.warn(
        "\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  "
    );
    // eslint-disable-next-line
    var sdkVersion = self.firebase.SDK_VERSION;
    if (sdkVersion && sdkVersion.indexOf("LITE") >= 0) {
        logger.warn(
            "\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    "
        );
    }
}
var firebase = firebase$1;
registerCoreComponents();

module.exports = firebase;
//# sourceMappingURL=index.cjs.js.map
