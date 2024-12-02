"use strict";
var e, t = require("@firebase/util"), n = require("tslib"), r = require("@firebase/component"), i = require("@firebase/app"), a = require("@firebase/logger"), o = function(e) {
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
}(i), p = function() {
    function e(e, t) {
        var n = this;
        this._delegate = e, this.firebase = t, i._addComponent(e, new r.Component("app-compat", function() {
            return n;
        }, "PUBLIC")), this.container = e.container;
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
    }, e.prototype._getService = function(e, t) {
        void 0 === t && (t = i._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var n, r = this._delegate.container.getProvider(e);
        return r.isInitialized() || (null === (n = r.getComponent()) || void 0 === n ? void 0 : n.instantiationMode) !== "EXPLICIT" || r.initialize(), r.getImmediate({
            identifier: t
        });
    }, e.prototype._removeServiceInstance = function(e, t) {
        void 0 === t && (t = i._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(e).clearInstance(t);
    }, e.prototype._addComponent = function(e) {
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
}(), s = ((e = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", e["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", e), c = new t.ErrorFactory("app-compat", "Firebase", s), u = /**
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
 */ function(e) {
        var n = {}, r = {
            __esModule: !0,
            initializeApp: function(i, a) {
                void 0 === a && (a = {});
                var p = o.initializeApp(i, a);
                if (t.contains(n, p.name)) return n[p.name];
                var s = new e(p, r);
                return n[p.name] = s, s;
            },
            app: i,
            registerVersion: o.registerVersion,
            setLogLevel: o.setLogLevel,
            onLog: o.onLog,
            apps: null,
            SDK_VERSION: o.SDK_VERSION,
            INTERNAL: {
                registerComponent: function(n) {
                    var a = n.name, p = a.replace("-compat", "");
                    if (o._registerComponent(n) && "PUBLIC" === n.type) {
                        var s = function(e) {
                            if (void 0 === e && (e = i()), "function" != typeof e[p]) throw c.create("invalid-app-argument", {
                                appName: a
                            });
                            return e[p]();
                        };
                        void 0 !== n.serviceProps && t.deepExtend(s, n.serviceProps), r[p] = s, e.prototype[p] = function() {
                            for(var e = [], t = 0; t < arguments.length; t++)e[t] = arguments[t];
                            return this._getService.bind(this, a).apply(this, n.multipleInstances ? e : []);
                        };
                    }
                    return "PUBLIC" === n.type ? r[p] : null;
                },
                removeApp: function(e) {
                    delete n[e];
                },
                useAsService: function(e, t) {
                    return "serverAuth" === t ? null : t;
                },
                modularAPIs: o
            }
        };
        function i(e) {
            if (e = e || o._DEFAULT_ENTRY_NAME, !t.contains(n, e)) throw c.create("no-app", {
                appName: e
            });
            return n[e];
        }
        return r.default = r, Object.defineProperty(r, "apps", {
            get: function() {
                return Object.keys(n).map(function(e) {
                    return n[e];
                });
            }
        }), i.App = e, r;
    }(p);
    return r.INTERNAL = n.__assign(n.__assign({}, r.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: function(e) {
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
 */ if (t.isBrowser() && void 0 !== self.firebase) {
    l.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var d = self.firebase.SDK_VERSION;
    d && d.indexOf("LITE") >= 0 && l.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
i.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = u;
