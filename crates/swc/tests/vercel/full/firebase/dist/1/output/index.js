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
}(), p = ((e = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", e["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", e), u = new t.ErrorFactory("app-compat", "Firebase", p), s = function e() {
    var r, o, i, p, s, d, l, f = function(e) {
        t.deepExtend(g, e);
    }, g = (r = function(e) {
        delete d[e];
    }, o = function(e) {
        if (e = e || a._DEFAULT_ENTRY_NAME, !t.contains(d, e)) throw u.create("no-app", {
            appName: e
        });
        return d[e];
    }, i = function() {
        return Object.keys(d).map(function(e) {
            return d[e];
        });
    }, p = function(e) {
        var n = e.name, r = n.replace("-compat", "");
        if (a._registerComponent(e) && "PUBLIC" === e.type) {
            var i = function(e) {
                if (void 0 === e && (e = o()), "function" != typeof e[r]) throw u.create("invalid-app-argument", {
                    appName: n
                });
                return e[r]();
            };
            void 0 !== e.serviceProps && t.deepExtend(i, e.serviceProps), l[r] = i, c.prototype[r] = function() {
                for(var t = [], r = 0; r < arguments.length; r++)t[r] = arguments[r];
                return this._getService.bind(this, n).apply(this, e.multipleInstances ? t : []);
            };
        }
        return "PUBLIC" === e.type ? l[r] : null;
    }, s = function(e, t) {
        return "serverAuth" === t ? null : t;
    }, d = {}, (l = {
        __esModule: !0,
        initializeApp: function(e, n) {
            void 0 === n && (n = {});
            var r = a.initializeApp(e, n);
            if (t.contains(d, r.name)) return d[r.name];
            var o = new c(r, l);
            return d[r.name] = o, o;
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
            useAsService: s,
            modularAPIs: a
        }
    }).default = l, Object.defineProperty(l, "apps", {
        get: i
    }), o.App = c, l);
    return g.INTERNAL = n.__assign(n.__assign({}, g.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: f,
        createSubscribe: t.createSubscribe,
        ErrorFactory: t.ErrorFactory,
        deepExtend: t.deepExtend
    }), g;
}(), d = new i.Logger("@firebase/app-compat");
if (t.isBrowser() && void 0 !== self.firebase) {
    d.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var l = self.firebase.SDK_VERSION;
    l && l.indexOf("LITE") >= 0 && d.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
o.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = s;
