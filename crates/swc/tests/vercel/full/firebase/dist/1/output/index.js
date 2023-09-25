var e, t = require("@firebase/util"), n = require("tslib"), r = require("@firebase/component"), i = require("@firebase/app"), a = require("@firebase/logger"), o = /*#__PURE__*/ function(e) {
    if (e && e.__esModule) return e;
    var t = Object.create(null);
    return e && Object.keys(e).forEach(function(n) {
        if ("default" !== n) {
            var r = Object.getOwnPropertyDescriptor(e, n);
            Object.defineProperty(t, n, r.get ? r : {
                enumerable: !0,
                get: function() {
                    return e[n];
                }
            });
        }
    }), t.default = e, Object.freeze(t);
}(i), p = /** @class */ function() {
    function e(e, t) {
        var n = this;
        this._delegate = e, this.firebase = t, // add itself to container
        i._addComponent(e, new r.Component("app-compat", function() {
            return n;
        }, "PUBLIC" /* PUBLIC */ )), this.container = e.container;
    }
    return Object.defineProperty(e.prototype, "automaticDataCollectionEnabled", {
        get: function() {
            return this._delegate.automaticDataCollectionEnabled;
        },
        set: function(e) {
            this._delegate.automaticDataCollectionEnabled = e;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e.prototype, "name", {
        get: function() {
            return this._delegate.name;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e.prototype, "options", {
        get: function() {
            return this._delegate.options;
        },
        enumerable: !1,
        configurable: !0
    }), e.prototype.delete = function() {
        var e = this;
        return new Promise(function(t) {
            e._delegate.checkDestroyed(), t();
        }).then(function() {
            return e.firebase.INTERNAL.removeApp(e.name), i.deleteApp(e._delegate);
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
     */ e.prototype._getService = function(e, t) {
        void 0 === t && (t = i._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        // Initialize instance if InstatiationMode is `EXPLICIT`.
        var n, r = this._delegate.container.getProvider(e);
        // getImmediate will always succeed because _getService is only called for registered components.
        return r.isInitialized() || (null === (n = r.getComponent()) || void 0 === n ? void 0 : n.instantiationMode) !== "EXPLICIT" /* EXPLICIT */  || r.initialize(), r.getImmediate({
            identifier: t
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
     */ e.prototype._removeServiceInstance = function(e, t) {
        void 0 === t && (t = i._DEFAULT_ENTRY_NAME), this._delegate.container// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .getProvider(e).clearInstance(t);
    }, /**
     * @param component the component being added to this app's container
     * @internal
     */ e.prototype._addComponent = function(e) {
        i._addComponent(this._delegate, e);
    }, e.prototype._addOrOverwriteComponent = function(e) {
        i._addOrOverwriteComponent(this._delegate, e);
    }, e.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, e;
}(), s = ((e = {})["no-app" /* NO_APP */ ] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", e["invalid-app-argument" /* INVALID_APP_ARGUMENT */ ] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", e), c = new t.ErrorFactory("app-compat", "Firebase", s), u = /**
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
 */ function e() {
    var r = /**
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
 */ function(e) {
        var n = {}, r = {
            // Hack to prevent Babel from modifying the object returned
            // as the firebase namespace.
            // @ts-ignore
            __esModule: !0,
            initializeApp: /**
     * Create a new App instance (name must be unique).
     *
     * This function is idempotent. It can be called more than once and return the same instance using the same options and config.
     */ function(i, a) {
                void 0 === a && (a = {});
                var p = o.initializeApp(i, a);
                if (t.contains(n, p.name)) return n[p.name];
                var s = new e(p, r);
                return n[p.name] = s, s;
            },
            // @ts-ignore
            app: i,
            registerVersion: o.registerVersion,
            setLogLevel: o.setLogLevel,
            onLog: o.onLog,
            // @ts-ignore
            apps: null,
            SDK_VERSION: o.SDK_VERSION,
            INTERNAL: {
                registerComponent: function(n) {
                    var a = n.name, p = a.replace("-compat", "");
                    if (o._registerComponent(n) && "PUBLIC" /* PUBLIC */  === n.type) {
                        // create service namespace for public components
                        // The Service namespace is an accessor function ...
                        var s = function(e) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if (void 0 === e && (e = i()), "function" != typeof e[p]) // Invalid argument.
                            // This happens in the following case: firebase.storage('gs:/')
                            throw c.create("invalid-app-argument" /* INVALID_APP_ARGUMENT */ , {
                                appName: a
                            });
                            // Forward service instance lookup to the FirebaseApp.
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            return e[p]();
                        };
                        void 0 !== n.serviceProps && t.deepExtend(s, n.serviceProps), // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        r[p] = s, // Patch the FirebaseAppImpl prototype
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        e.prototype[p] = // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
                        // option added to the no-explicit-any rule when ESlint releases it.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        function() {
                            for(var e = [], t = 0; t < arguments.length; t++)e[t] = arguments[t];
                            return this._getService.bind(this, a).apply(this, n.multipleInstances ? e : []);
                        };
                    }
                    return "PUBLIC" /* PUBLIC */  === n.type ? r[p] : null;
                },
                removeApp: /**
     * Called by App.delete() - but before any services associated with the App
     * are deleted.
     */ function(e) {
                    delete n[e];
                },
                useAsService: // Map the requested service to a registered service name
                // (used to map auth to serverAuth service when needed).
                function(e, t) {
                    return "serverAuth" === t ? null : t;
                },
                modularAPIs: o
            }
        };
        /**
     * Get the App object for a given name (or DEFAULT).
     */ function i(e) {
            if (e = e || o._DEFAULT_ENTRY_NAME, !t.contains(n, e)) throw c.create("no-app" /* NO_APP */ , {
                appName: e
            });
            return n[e];
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
        r.default = r, // firebase.apps is a read-only getter.
        Object.defineProperty(r, "apps", {
            get: /*
     * Return an array of all the non-deleted FirebaseApps.
     */ function() {
                // Make a copy so caller cannot mutate the apps list.
                return Object.keys(n).map(function(e) {
                    return n[e];
                });
            }
        }), // @ts-ignore
        i.App = e, r);
    }(p);
    return r.INTERNAL = n.__assign(n.__assign({}, r.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: /**
     * Patch the top-level firebase namespace with additional properties.
     *
     * firebase.INTERNAL.extendNamespace()
     */ function(e) {
            t.deepExtend(r, e);
        },
        createSubscribe: t.createSubscribe,
        ErrorFactory: t.ErrorFactory,
        deepExtend: t.deepExtend
    }), r;
}(), l = new a.Logger("@firebase/app-compat");
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
if (t.isBrowser() && void 0 !== self.firebase) {
    l.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    // eslint-disable-next-line
    var d = self.firebase.SDK_VERSION;
    d && d.indexOf("LITE") >= 0 && l.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
// Register `app` package.
i.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = u;
 //# sourceMappingURL=index.cjs.js.map
