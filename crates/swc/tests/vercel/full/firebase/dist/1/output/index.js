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
    var e = function(e, t) {
        var n = this;
        this._delegate = e, this.firebase = t, i._addComponent(e, new r.Component("app-compat", function() {
            return n;
        }, "PUBLIC")), this.container = e.container;
    };
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
}(), s = ((e = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", e["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", e), c = new t.ErrorFactory("app-compat", "Firebase", s), u = function e() {
    var r, i, a, s, u = (r = p, i = function(e) {
        if (e = e || o._DEFAULT_ENTRY_NAME, !t.contains(a, e)) throw c.create("no-app", {
            appName: e
        });
        return a[e];
    }, a = {}, (s = {
        __esModule: !0,
        initializeApp: function(e, n) {
            void 0 === n && (n = {});
            var i = o.initializeApp(e, n);
            if (t.contains(a, i.name)) return a[i.name];
            var p = new r(i, s);
            return a[i.name] = p, p;
        },
        app: i,
        registerVersion: o.registerVersion,
        setLogLevel: o.setLogLevel,
        onLog: o.onLog,
        apps: null,
        SDK_VERSION: o.SDK_VERSION,
        INTERNAL: {
            registerComponent: function(e) {
                var n = e.name, a = n.replace("-compat", "");
                if (o._registerComponent(e) && "PUBLIC" === e.type) {
                    var p = function(e) {
                        if (void 0 === e && (e = i()), "function" != typeof e[a]) throw c.create("invalid-app-argument", {
                            appName: n
                        });
                        return e[a]();
                    };
                    void 0 !== e.serviceProps && t.deepExtend(p, e.serviceProps), s[a] = p, r.prototype[a] = function() {
                        for(var t = [], r = 0; r < arguments.length; r++)t[r] = arguments[r];
                        return this._getService.bind(this, n).apply(this, e.multipleInstances ? t : []);
                    };
                }
                return "PUBLIC" === e.type ? s[a] : null;
            },
            removeApp: function(e) {
                delete a[e];
            },
            useAsService: function(e, t) {
                return "serverAuth" === t ? null : t;
            },
            modularAPIs: o
        }
    }).default = s, Object.defineProperty(s, "apps", {
        get: function() {
            return Object.keys(a).map(function(e) {
                return a[e];
            });
        }
    }), i.App = r, s);
    return u.INTERNAL = n.__assign(n.__assign({}, u.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: function(e) {
            t.deepExtend(u, e);
        },
        createSubscribe: t.createSubscribe,
        ErrorFactory: t.ErrorFactory,
        deepExtend: t.deepExtend
    }), u;
}(), l = new a.Logger("@firebase/app-compat");
if (t.isBrowser() && void 0 !== self.firebase) {
    l.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var d = self.firebase.SDK_VERSION;
    d && d.indexOf("LITE") >= 0 && l.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
i.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = u;
