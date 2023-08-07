var e, t, n = require("@firebase/util"), r = require("tslib"), i = require("@firebase/component"), a = require("@firebase/app"), o = require("@firebase/logger"), p = function(e) {
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
    this._delegate = e, this.firebase = t, a._addComponent(e, new i.Component("app-compat", function() {
        return n;
    }, "PUBLIC")), this.container = e.container;
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
}, e.prototype._getService = function(e, t) {
    void 0 === t && (t = a._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
    var n, r = this._delegate.container.getProvider(e);
    return r.isInitialized() || (null === (n = r.getComponent()) || void 0 === n ? void 0 : n.instantiationMode) !== "EXPLICIT" || r.initialize(), r.getImmediate({
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
}, e), c = ((t = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", t["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", t), u = new n.ErrorFactory("app-compat", "Firebase", c), l = function e() {
    var t, i, a, o = (t = function(e) {
        if (e = e || p._DEFAULT_ENTRY_NAME, !n.contains(i, e)) throw u.create("no-app", {
            appName: e
        });
        return i[e];
    }, i = {}, (a = {
        __esModule: !0,
        initializeApp: function(e, t) {
            void 0 === t && (t = {});
            var r = p.initializeApp(e, t);
            if (n.contains(i, r.name)) return i[r.name];
            var o = new s(r, a);
            return i[r.name] = o, o;
        },
        app: t,
        registerVersion: p.registerVersion,
        setLogLevel: p.setLogLevel,
        onLog: p.onLog,
        apps: null,
        SDK_VERSION: p.SDK_VERSION,
        INTERNAL: {
            registerComponent: function(e) {
                var r = e.name, i = r.replace("-compat", "");
                if (p._registerComponent(e) && "PUBLIC" === e.type) {
                    var o = function(e) {
                        if (void 0 === e && (e = t()), "function" != typeof e[i]) throw u.create("invalid-app-argument", {
                            appName: r
                        });
                        return e[i]();
                    };
                    void 0 !== e.serviceProps && n.deepExtend(o, e.serviceProps), a[i] = o, s.prototype[i] = function() {
                        for(var t = [], n = 0; n < arguments.length; n++)t[n] = arguments[n];
                        return this._getService.bind(this, r).apply(this, e.multipleInstances ? t : []);
                    };
                }
                return "PUBLIC" === e.type ? a[i] : null;
            },
            removeApp: function(e) {
                delete i[e];
            },
            useAsService: function(e, t) {
                return "serverAuth" === t ? null : t;
            },
            modularAPIs: p
        }
    }).default = a, Object.defineProperty(a, "apps", {
        get: function() {
            return Object.keys(i).map(function(e) {
                return i[e];
            });
        }
    }), t.App = s, a);
    return o.INTERNAL = r.__assign(r.__assign({}, o.INTERNAL), {
        createFirebaseNamespace: e,
        extendNamespace: function(e) {
            n.deepExtend(o, e);
        },
        createSubscribe: n.createSubscribe,
        ErrorFactory: n.ErrorFactory,
        deepExtend: n.deepExtend
    }), o;
}(), d = new o.Logger("@firebase/app-compat");
if (n.isBrowser() && void 0 !== self.firebase) {
    d.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var f = self.firebase.SDK_VERSION;
    f && f.indexOf("LITE") >= 0 && d.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
a.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = l;
