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
    var r, i, a, s, u, l, d, f, m = function(e) {
        t.deepExtend(b, e);
    }, b = (r = p, i = function(e) {
        delete d[e];
    }, a = function(e) {
        if (e = e || o._DEFAULT_ENTRY_NAME, !t.contains(d, e)) throw c.create("no-app", {
            appName: e
        });
        return d[e];
    }, s = function() {
        return Object.keys(d).map(function(e) {
            return d[e];
        });
    }, u = function(e) {
        var n = e.name, i = n.replace("-compat", "");
        if (o._registerComponent(e) && "PUBLIC" === e.type) {
            var p = function(e) {
                if (void 0 === e && (e = a()), "function" != typeof e[i]) throw c.create("invalid-app-argument", {
                    appName: n
                });
                return e[i]();
            };
            void 0 !== e.serviceProps && t.deepExtend(p, e.serviceProps), f[i] = p, r.prototype[i] = function() {
                for(var t = [], r = 0; r < arguments.length; r++)t[r] = arguments[r];
                return this._getService.bind(this, n).apply(this, e.multipleInstances ? t : []);
            };
        }
        return "PUBLIC" === e.type ? f[i] : null;
    }, l = function(e, t) {
        return "serverAuth" === t ? null : t;
    }, d = {}, (f = {
        __esModule: !0,
        initializeApp: function(e, n) {
            void 0 === n && (n = {});
            var i = o.initializeApp(e, n);
            if (t.contains(d, i.name)) return d[i.name];
            var a = new r(i, f);
            return d[i.name] = a, a;
        },
        app: a,
        registerVersion: o.registerVersion,
        setLogLevel: o.setLogLevel,
        onLog: o.onLog,
        apps: null,
        SDK_VERSION: o.SDK_VERSION,
        INTERNAL: {
            registerComponent: u,
            removeApp: i,
            useAsService: l,
            modularAPIs: o
        }
    }).default = f, Object.defineProperty(f, "apps", {
        get: s
    }), a.App = r, f);
    return b.INTERNAL = n.__assign(n.__assign({}, b.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: m,
        createSubscribe: t.createSubscribe,
        ErrorFactory: t.ErrorFactory,
        deepExtend: t.deepExtend
    }), b;
}(), l = new a.Logger("@firebase/app-compat");
if (t.isBrowser() && void 0 !== self.firebase) {
    l.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var d = self.firebase.SDK_VERSION;
    d && d.indexOf("LITE") >= 0 && l.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
i.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = u;
