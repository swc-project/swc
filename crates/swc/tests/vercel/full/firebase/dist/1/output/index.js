let e;
var t, n = require("@firebase/util"), r = require("tslib"), i = require("@firebase/component"), a = require("@firebase/app"), o = require("@firebase/logger"), p = function(e) {
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
}(a), s = function() {
    function e(e, t) {
        var n = this;
        this._delegate = e, this.firebase = t, a._addComponent(e, new i.Component("app-compat", function() {
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
            return e.firebase.INTERNAL.removeApp(e.name), a.deleteApp(e._delegate);
        });
    }, e.prototype._getService = function(e, t) {
        void 0 === t && (t = a._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var n, r = this._delegate.container.getProvider(e);
        return r.isInitialized() || (null == (n = r.getComponent()) ? void 0 : n.instantiationMode) !== "EXPLICIT" || r.initialize(), r.getImmediate({
            identifier: t
        });
    }, e.prototype._removeServiceInstance = function(e, t) {
        void 0 === t && (t = a._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(e).clearInstance(t);
    }, e.prototype._addComponent = function(e) {
        a._addComponent(this._delegate, e);
    }, e.prototype._addOrOverwriteComponent = function(e) {
        a._addOrOverwriteComponent(this._delegate, e);
    }, e.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, e;
}(), c = ((t = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", t["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", t), u = new n.ErrorFactory("app-compat", "Firebase", c), l = function e() {
    var t = function(e) {
        var t = {}, r = {
            __esModule: !0,
            initializeApp: function(i, a) {
                void 0 === a && (a = {});
                var o = p.initializeApp(i, a);
                if (n.contains(t, o.name)) return t[o.name];
                var s = new e(o, r);
                return t[o.name] = s, s;
            },
            app: i,
            registerVersion: p.registerVersion,
            setLogLevel: p.setLogLevel,
            onLog: p.onLog,
            apps: null,
            SDK_VERSION: p.SDK_VERSION,
            INTERNAL: {
                registerComponent: function(t) {
                    var a = t.name, o = a.replace("-compat", "");
                    if (p._registerComponent(t) && "PUBLIC" === t.type) {
                        var s = function(e) {
                            if (void 0 === e && (e = i()), "function" != typeof e[o]) throw u.create("invalid-app-argument", {
                                appName: a
                            });
                            return e[o]();
                        };
                        void 0 !== t.serviceProps && n.deepExtend(s, t.serviceProps), r[o] = s, e.prototype[o] = function() {
                            for(var e = [], n = 0; n < arguments.length; n++)e[n] = arguments[n];
                            return this._getService.bind(this, a).apply(this, t.multipleInstances ? e : []);
                        };
                    }
                    return "PUBLIC" === t.type ? r[o] : null;
                },
                removeApp: function(e) {
                    delete t[e];
                },
                useAsService: function(e, t) {
                    return "serverAuth" === t ? null : t;
                },
                modularAPIs: p
            }
        };
        function i(e) {
            if (e = e || p._DEFAULT_ENTRY_NAME, !n.contains(t, e)) throw u.create("no-app", {
                appName: e
            });
            return t[e];
        }
        return r.default = r, Object.defineProperty(r, "apps", {
            get: function() {
                return Object.keys(t).map(function(e) {
                    return t[e];
                });
            }
        }), i.App = e, r;
    }(s);
    return t.INTERNAL = r.__assign(r.__assign({}, t.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: function(e) {
            n.deepExtend(t, e);
        },
        createSubscribe: n.createSubscribe,
        ErrorFactory: n.ErrorFactory,
        deepExtend: n.deepExtend
    }), t;
}(), d = new o.Logger("@firebase/app-compat");
if (n.isBrowser() && void 0 !== self.firebase) {
    d.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var f = self.firebase.SDK_VERSION;
    f && f.indexOf("LITE") >= 0 && d.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
a.registerVersion("@firebase/app-compat", "0.1.5", e), module.exports = l;
