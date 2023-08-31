var e, t, n = require("@firebase/util"), r = require("tslib"), i = require("@firebase/component"), a = require("@firebase/app"), o = require("@firebase/logger"), p = /*#__PURE__*/ function(e) {
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
}(a), s = (Object.defineProperty((e = function(e, t) {
    var n = this;
    this._delegate = e, this.firebase = t, // add itself to container
    a._addComponent(e, new i.Component("app-compat", function() {
        return n;
    }, "PUBLIC" /* PUBLIC */ )), this.container = e.container;
}).prototype, "automaticDataCollectionEnabled", {
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
        return e.firebase.INTERNAL.removeApp(e.name), a.deleteApp(e._delegate);
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
    void 0 === t && (t = a._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
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
    void 0 === t && (t = a._DEFAULT_ENTRY_NAME), this._delegate.container// eslint-disable-next-line @typescript-eslint/no-explicit-any
    .getProvider(e).clearInstance(t);
}, /**
     * @param component the component being added to this app's container
     * @internal
     */ e.prototype._addComponent = function(e) {
    a._addComponent(this._delegate, e);
}, e.prototype._addOrOverwriteComponent = function(e) {
    a._addOrOverwriteComponent(this._delegate, e);
}, e.prototype.toJSON = function() {
    return {
        name: this.name,
        automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
        options: this.options
    };
}, e), c = ((t = {})["no-app" /* NO_APP */ ] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", t["invalid-app-argument" /* INVALID_APP_ARGUMENT */ ] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", t), u = new n.ErrorFactory("app-compat", "Firebase", c), l = /**
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
    var t, i, a, o = (t = /**
     * Get the App object for a given name (or DEFAULT).
     */ function(e) {
        if (e = e || p._DEFAULT_ENTRY_NAME, !n.contains(i, e)) throw u.create("no-app" /* NO_APP */ , {
            appName: e
        });
        return i[e];
    }, i = {}, // Inject a circular default export to allow Babel users who were previously
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
    (a = {
        // Hack to prevent Babel from modifying the object returned
        // as the firebase namespace.
        // @ts-ignore
        __esModule: !0,
        initializeApp: /**
     * Create a new App instance (name must be unique).
     *
     * This function is idempotent. It can be called more than once and return the same instance using the same options and config.
     */ function(e, t) {
            void 0 === t && (t = {});
            var r = p.initializeApp(e, t);
            if (n.contains(i, r.name)) return i[r.name];
            var o = new s(r, a);
            return i[r.name] = o, o;
        },
        // @ts-ignore
        app: t,
        registerVersion: p.registerVersion,
        setLogLevel: p.setLogLevel,
        onLog: p.onLog,
        // @ts-ignore
        apps: null,
        SDK_VERSION: p.SDK_VERSION,
        INTERNAL: {
            registerComponent: function(e) {
                var r = e.name, i = r.replace("-compat", "");
                if (p._registerComponent(e) && "PUBLIC" /* PUBLIC */  === e.type) {
                    // create service namespace for public components
                    // The Service namespace is an accessor function ...
                    var o = function(e) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (void 0 === e && (e = t()), "function" != typeof e[i]) // Invalid argument.
                        // This happens in the following case: firebase.storage('gs:/')
                        throw u.create("invalid-app-argument" /* INVALID_APP_ARGUMENT */ , {
                            appName: r
                        });
                        // Forward service instance lookup to the FirebaseApp.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return e[i]();
                    };
                    void 0 !== e.serviceProps && n.deepExtend(o, e.serviceProps), // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    a[i] = o, // Patch the FirebaseAppImpl prototype
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    s.prototype[i] = // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
                    // option added to the no-explicit-any rule when ESlint releases it.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    function() {
                        for(var t = [], n = 0; n < arguments.length; n++)t[n] = arguments[n];
                        return this._getService.bind(this, r).apply(this, e.multipleInstances ? t : []);
                    };
                }
                return "PUBLIC" /* PUBLIC */  === e.type ? a[i] : null;
            },
            removeApp: /**
     * Called by App.delete() - but before any services associated with the App
     * are deleted.
     */ function(e) {
                delete i[e];
            },
            useAsService: // Map the requested service to a registered service name
            // (used to map auth to serverAuth service when needed).
            function(e, t) {
                return "serverAuth" === t ? null : t;
            },
            modularAPIs: p
        }
    }).default = a, // firebase.apps is a read-only getter.
    Object.defineProperty(a, "apps", {
        get: /*
     * Return an array of all the non-deleted FirebaseApps.
     */ function() {
            // Make a copy so caller cannot mutate the apps list.
            return Object.keys(i).map(function(e) {
                return i[e];
            });
        }
    }), // @ts-ignore
    t.App = s, a);
    return o.INTERNAL = r.__assign(r.__assign({}, o.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: /**
     * Patch the top-level firebase namespace with additional properties.
     *
     * firebase.INTERNAL.extendNamespace()
     */ function(e) {
            n.deepExtend(o, e);
        },
        createSubscribe: n.createSubscribe,
        ErrorFactory: n.ErrorFactory,
        deepExtend: n.deepExtend
    }), o;
}(), d = new o.Logger("@firebase/app-compat");
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
if (n.isBrowser() && void 0 !== self.firebase) {
    d.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    // eslint-disable-next-line
    var f = self.firebase.SDK_VERSION;
    f && f.indexOf("LITE") >= 0 && d.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
// Register `app` package.
a.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = l;
 //# sourceMappingURL=index.cjs.js.map
