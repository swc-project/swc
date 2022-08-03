"use strict";
var e, t = require("@firebase/util"), n = require("tslib"), r = require("@firebase/component"), o = require("@firebase/app"), i = require("@firebase/logger"), a = function(e) {
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
}(o), c = function() {
    var e = function(e, t) {
        var n = this;
        this._delegate = e, this.firebase = t, o._addComponent(e, new r.Component("app-compat", function() {
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
            return e.firebase.INTERNAL.removeApp(e.name), o.deleteApp(e._delegate);
        });
    }, e.prototype._getService = function(e, t) {
        void 0 === t && (t = o._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var n, r = this._delegate.container.getProvider(e);
        return r.isInitialized() || (null === (n = r.getComponent()) || void 0 === n ? void 0 : n.instantiationMode) !== "EXPLICIT" || r.initialize(), r.getImmediate({
            identifier: t
        });
    }, e.prototype._removeServiceInstance = function(e, t) {
        void 0 === t && (t = o._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(e).clearInstance(t);
    }, e.prototype._addComponent = function(e) {
        o._addComponent(this._delegate, e);
    }, e.prototype._addOrOverwriteComponent = function(e) {
        o._addOrOverwriteComponent(this._delegate, e);
    }, e.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, e;
}(), p = ((e = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", e["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", e), u = new t.ErrorFactory("app-compat", "Firebase", p);
function s() {
    var e, r, o, i, p, d, l, f, g = function(e) {
        t.deepExtend(v, e);
    }, v = (e = c, r = function(e) {
        delete l[e];
    }, o = function(e) {
        if (e = e || a._DEFAULT_ENTRY_NAME, !t.contains(l, e)) throw u.create("no-app", {
            appName: e
        });
        return l[e];
    }, i = function() {
        return Object.keys(l).map(function(e) {
            return l[e];
        });
    }, p = function(n) {
        var r = n.name, i = r.replace("-compat", "");
        if (a._registerComponent(n) && "PUBLIC" === n.type) {
            var c = function(e) {
                if (void 0 === e && (e = o()), "function" != typeof e[i]) throw u.create("invalid-app-argument", {
                    appName: r
                });
                return e[i]();
            };
            void 0 !== n.serviceProps && t.deepExtend(c, n.serviceProps), f[i] = c, e.prototype[i] = function() {
                for(var e = [], t = 0; t < arguments.length; t++)e[t] = arguments[t];
                return this._getService.bind(this, r).apply(this, n.multipleInstances ? e : []);
            };
        }
        return "PUBLIC" === n.type ? f[i] : null;
    }, d = function(e, t) {
        return "serverAuth" === t ? null : t;
    }, l = {}, (f = {
        __esModule: !0,
        initializeApp: function(n, r) {
            void 0 === r && (r = {});
            var o = a.initializeApp(n, r);
            if (t.contains(l, o.name)) return l[o.name];
            var i = new e(o, f);
            return l[o.name] = i, i;
        },
        app: o,
        registerVersion: a.registerVersion,
        setLogLevel: a.setLogLevel,
        onLog: a.onLog,
        apps: null,
        SDK_VERSION: a.SDK_VERSION,
        INTERNAL: {
            registerComponent: p,
            removeApp: r,
            useAsService: d,
            modularAPIs: a
        }
    }).default = f, Object.defineProperty(f, "apps", {
        get: i
    }), o.App = e, f);
    return v.INTERNAL = n.__assign(n.__assign({}, v.INTERNAL), {
        createFirebaseNamespace: s,
        extendNamespace: g,
        createSubscribe: t.createSubscribe,
        ErrorFactory: t.ErrorFactory,
        deepExtend: t.deepExtend
    }), v;
}
var d = s(), l = new i.Logger("@firebase/app-compat");
if (t.isBrowser() && void 0 !== self.firebase) {
    l.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var f = self.firebase.SDK_VERSION;
    f && f.indexOf("LITE") >= 0 && l.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
o.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = d;
