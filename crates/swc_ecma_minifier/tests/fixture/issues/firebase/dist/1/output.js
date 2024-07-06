"use strict";
var _a, util = require("@firebase/util"), tslib = require("tslib"), component = require("@firebase/component"), modularAPIs = require("@firebase/app"), logger$1 = require("@firebase/logger"), modularAPIs__namespace = /*#__PURE__*/ function(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    return e && Object.keys(e).forEach(function(k) {
        if ("default" !== k) {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
                enumerable: !0,
                get: function() {
                    return e[k];
                }
            });
        }
    }), n.default = e, Object.freeze(n);
}(modularAPIs), FirebaseAppImpl = /** @class */ function() {
    function FirebaseAppImpl(_delegate, firebase) {
        var _this = this;
        this._delegate = _delegate, this.firebase = firebase, // add itself to container
        modularAPIs._addComponent(_delegate, new component.Component("app-compat", function() {
            return _this;
        }, "PUBLIC" /* PUBLIC */ )), this.container = _delegate.container;
    }
    return Object.defineProperty(FirebaseAppImpl.prototype, "automaticDataCollectionEnabled", {
        get: function() {
            return this._delegate.automaticDataCollectionEnabled;
        },
        set: function(val) {
            this._delegate.automaticDataCollectionEnabled = val;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(FirebaseAppImpl.prototype, "name", {
        get: function() {
            return this._delegate.name;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(FirebaseAppImpl.prototype, "options", {
        get: function() {
            return this._delegate.options;
        },
        enumerable: !1,
        configurable: !0
    }), FirebaseAppImpl.prototype.delete = function() {
        var _this = this;
        return new Promise(function(resolve) {
            _this._delegate.checkDestroyed(), resolve();
        }).then(function() {
            return _this.firebase.INTERNAL.removeApp(_this.name), modularAPIs.deleteApp(_this._delegate);
        });
    }, /**
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
     */ FirebaseAppImpl.prototype._getService = function(name, instanceIdentifier) {
        void 0 === instanceIdentifier && (instanceIdentifier = modularAPIs._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        // Initialize instance if InstatiationMode is `EXPLICIT`.
        var _a, provider = this._delegate.container.getProvider(name);
        // getImmediate will always succeed because _getService is only called for registered components.
        return provider.isInitialized() || (null === (_a = provider.getComponent()) || void 0 === _a ? void 0 : _a.instantiationMode) !== "EXPLICIT" /* EXPLICIT */  || provider.initialize(), provider.getImmediate({
            identifier: instanceIdentifier
        });
    }, /**
     * Remove a service instance from the cache, so we will create a new instance for this service
     * when people try to get it again.
     *
     * NOTE: currently only firestore uses this functionality to support firestore shutdown.
     *
     * @param name The service name
     * @param instanceIdentifier instance identifier in case multiple instances are allowed
     * @internal
     */ FirebaseAppImpl.prototype._removeServiceInstance = function(name, instanceIdentifier) {
        void 0 === instanceIdentifier && (instanceIdentifier = modularAPIs._DEFAULT_ENTRY_NAME), this._delegate.container// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .getProvider(name).clearInstance(instanceIdentifier);
    }, /**
     * @param component the component being added to this app's container
     * @internal
     */ FirebaseAppImpl.prototype._addComponent = function(component) {
        modularAPIs._addComponent(this._delegate, component);
    }, FirebaseAppImpl.prototype._addOrOverwriteComponent = function(component) {
        modularAPIs._addOrOverwriteComponent(this._delegate, component);
    }, FirebaseAppImpl.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, FirebaseAppImpl;
}(), ERRORS = ((_a = {})["no-app" /* NO_APP */ ] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", _a["invalid-app-argument" /* INVALID_APP_ARGUMENT */ ] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", _a), ERROR_FACTORY = new util.ErrorFactory("app-compat", "Firebase", ERRORS), firebase$1 = /**
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
 */ /**
 * Return a firebase namespace object.
 *
 * In production, this will be called exactly once and the result
 * assigned to the 'firebase' global.  It may be called multiple times
 * in unit tests.
 */ function createFirebaseNamespace() {
    var namespace = /**
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
 */ /**
 * Because auth can't share code with other components, we attach the utility functions
 * in an internal namespace to share code.
 * This function return a firebase namespace object without
 * any utility functions, so it can be shared between the regular firebaseNamespace and
 * the lite version.
 */ function(firebaseAppImpl) {
        var apps = {}, namespace = {
            // Hack to prevent Babel from modifying the object returned
            // as the firebase namespace.
            // @ts-ignore
            __esModule: !0,
            initializeApp: /**
     * Create a new App instance (name must be unique).
     *
     * This function is idempotent. It can be called more than once and return the same instance using the same options and config.
     */ function(options, rawConfig) {
                void 0 === rawConfig && (rawConfig = {});
                var app = modularAPIs__namespace.initializeApp(options, rawConfig);
                if (util.contains(apps, app.name)) return apps[app.name];
                var appCompat = new firebaseAppImpl(app, namespace);
                return apps[app.name] = appCompat, appCompat;
            },
            // @ts-ignore
            app: app,
            registerVersion: modularAPIs__namespace.registerVersion,
            setLogLevel: modularAPIs__namespace.setLogLevel,
            onLog: modularAPIs__namespace.onLog,
            // @ts-ignore
            apps: null,
            SDK_VERSION: modularAPIs__namespace.SDK_VERSION,
            INTERNAL: {
                registerComponent: function(component) {
                    var componentName = component.name, componentNameWithoutCompat = componentName.replace("-compat", "");
                    if (modularAPIs__namespace._registerComponent(component) && "PUBLIC" /* PUBLIC */  === component.type) {
                        // create service namespace for public components
                        // The Service namespace is an accessor function ...
                        var serviceNamespace = function(appArg) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if (void 0 === appArg && (appArg = app()), "function" != typeof appArg[componentNameWithoutCompat]) // Invalid argument.
                            // This happens in the following case: firebase.storage('gs:/')
                            throw ERROR_FACTORY.create("invalid-app-argument" /* INVALID_APP_ARGUMENT */ , {
                                appName: componentName
                            });
                            // Forward service instance lookup to the FirebaseApp.
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            return appArg[componentNameWithoutCompat]();
                        };
                        void 0 !== component.serviceProps && util.deepExtend(serviceNamespace, component.serviceProps), // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        namespace[componentNameWithoutCompat] = serviceNamespace, // Patch the FirebaseAppImpl prototype
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        firebaseAppImpl.prototype[componentNameWithoutCompat] = // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
                        // option added to the no-explicit-any rule when ESlint releases it.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        function() {
                            for(var args = [], _i = 0; _i < arguments.length; _i++)args[_i] = arguments[_i];
                            return this._getService.bind(this, componentName).apply(this, component.multipleInstances ? args : []);
                        };
                    }
                    return "PUBLIC" /* PUBLIC */  === component.type ? namespace[componentNameWithoutCompat] : null;
                },
                removeApp: /**
     * Called by App.delete() - but before any services associated with the App
     * are deleted.
     */ function(name) {
                    delete apps[name];
                },
                useAsService: // Map the requested service to a registered service name
                // (used to map auth to serverAuth service when needed).
                function(app, name) {
                    return "serverAuth" === name ? null : name;
                },
                modularAPIs: modularAPIs__namespace
            }
        };
        /**
     * Get the App object for a given name (or DEFAULT).
     */ function app(name) {
            if (name = name || modularAPIs__namespace._DEFAULT_ENTRY_NAME, !util.contains(apps, name)) throw ERROR_FACTORY.create("no-app" /* NO_APP */ , {
                appName: name
            });
            return apps[name];
        }
        return(// Inject a circular default export to allow Babel users who were previously
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
        namespace.default = namespace, // firebase.apps is a read-only getter.
        Object.defineProperty(namespace, "apps", {
            get: /*
     * Return an array of all the non-deleted FirebaseApps.
     */ function() {
                // Make a copy so caller cannot mutate the apps list.
                return Object.keys(apps).map(function(name) {
                    return apps[name];
                });
            }
        }), // @ts-ignore
        app.App = firebaseAppImpl, namespace);
    }(FirebaseAppImpl);
    return namespace.INTERNAL = tslib.__assign(tslib.__assign({}, namespace.INTERNAL), {
        createFirebaseNamespace: createFirebaseNamespace,
        extendNamespace: /**
     * Patch the top-level firebase namespace with additional properties.
     *
     * firebase.INTERNAL.extendNamespace()
     */ function(props) {
            util.deepExtend(namespace, props);
        },
        createSubscribe: util.createSubscribe,
        ErrorFactory: util.ErrorFactory,
        deepExtend: util.deepExtend
    }), namespace;
}(), logger = new logger$1.Logger("@firebase/app-compat");
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
 */ // Firebase Lite detection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (util.isBrowser() && void 0 !== self.firebase) {
    logger.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    // eslint-disable-next-line
    var sdkVersion = self.firebase.SDK_VERSION;
    sdkVersion && sdkVersion.indexOf("LITE") >= 0 && logger.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
// Register `app` package.
modularAPIs.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = firebase$1;
 //# sourceMappingURL=index.cjs.js.map
