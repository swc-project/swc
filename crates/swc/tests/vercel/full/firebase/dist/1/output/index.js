"use strict";
var e, t = require("@firebase/util"), o = require("tslib"), p = require("@firebase/component"), n = require("@firebase/app"), r = require("@firebase/logger"), s = function(e) {
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
}(n), c = function() {
    function e(e, t) {
        var r = this;
        this._delegate = e, this.firebase = t, n._addComponent(e, new p.Component("app-compat", function() {
            return r;
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
            return e.firebase.INTERNAL.removeApp(e.name), n.deleteApp(e._delegate);
        });
    }, e.prototype._getService = function(i, t) {
        void 0 === t && (t = n._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var r, e = this._delegate.container.getProvider(i);
        return e.isInitialized() || (null === (r = e.getComponent()) || void 0 === r ? void 0 : r.instantiationMode) !== "EXPLICIT" || e.initialize(), e.getImmediate({
            identifier: t
        });
    }, e.prototype._removeServiceInstance = function(t, e) {
        void 0 === e && (e = n._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(t).clearInstance(e);
    }, e.prototype._addComponent = function(e) {
        n._addComponent(this._delegate, e);
    }, e.prototype._addOrOverwriteComponent = function(e) {
        n._addOrOverwriteComponent(this._delegate, e);
    }, e.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, e;
}(), i = ((e = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", e["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", e), u = new t.ErrorFactory("app-compat", "Firebase", i), a = /**
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
    var n = /**
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
 */ function(r) {
        var i = {}, e = {
            __esModule: !0,
            initializeApp: function(p, a) {
                void 0 === a && (a = {});
                var n = s.initializeApp(p, a);
                if (t.contains(i, n.name)) return i[n.name];
                var o = new r(n, e);
                return i[n.name] = o, o;
            },
            app: n,
            registerVersion: s.registerVersion,
            setLogLevel: s.setLogLevel,
            onLog: s.onLog,
            apps: null,
            SDK_VERSION: s.SDK_VERSION,
            INTERNAL: {
                registerComponent: function(i) {
                    var a = i.name, o = a.replace("-compat", "");
                    if (s._registerComponent(i) && "PUBLIC" === i.type) {
                        var p = function(e) {
                            if (void 0 === e && (e = n()), "function" != typeof e[o]) throw u.create("invalid-app-argument", {
                                appName: a
                            });
                            return e[o]();
                        };
                        void 0 !== i.serviceProps && t.deepExtend(p, i.serviceProps), e[o] = p, r.prototype[o] = function() {
                            for(var e = [], t = 0; t < arguments.length; t++)e[t] = arguments[t];
                            return this._getService.bind(this, a).apply(this, i.multipleInstances ? e : []);
                        };
                    }
                    return "PUBLIC" === i.type ? e[o] : null;
                },
                removeApp: function(e) {
                    delete i[e];
                },
                useAsService: function(t, e) {
                    return "serverAuth" === e ? null : e;
                },
                modularAPIs: s
            }
        };
        function n(e) {
            if (e = e || s._DEFAULT_ENTRY_NAME, !t.contains(i, e)) throw u.create("no-app", {
                appName: e
            });
            return i[e];
        }
        return e.default = e, Object.defineProperty(e, "apps", {
            get: function() {
                return Object.keys(i).map(function(e) {
                    return i[e];
                });
            }
        }), n.App = r, e;
    }(c);
    return n.INTERNAL = o.__assign(o.__assign({}, n.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: function(e) {
            t.deepExtend(n, e);
        },
        createSubscribe: t.createSubscribe,
        ErrorFactory: t.ErrorFactory,
        deepExtend: t.deepExtend
    }), n;
}(), l = new r.Logger("@firebase/app-compat");
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
n.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = a;
