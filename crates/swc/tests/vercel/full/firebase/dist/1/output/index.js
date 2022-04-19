"use strict";
var a, b = require("@firebase/util"), j = require("tslib"), k = require("@firebase/component"), c = require("@firebase/app"), f = require("@firebase/logger"), l = function(a) {
    if (a && a.__esModule) return a;
    var b = Object.create(null);
    return a && Object.keys(a).forEach(function(c) {
        if ("default" !== c) {
            var d = Object.getOwnPropertyDescriptor(a, c);
            Object.defineProperty(b, c, d.get ? d : {
                enumerable: !0,
                get: function() {
                    return a[c];
                }
            });
        }
    }), b.default = a, Object.freeze(b);
}(c), m = function() {
    var a = function(a, b) {
        var d = this;
        this._delegate = a, this.firebase = b, c._addComponent(a, new k.Component("app-compat", function() {
            return d;
        }, "PUBLIC")), this.container = a.container;
    };
    return Object.defineProperty(a.prototype, "automaticDataCollectionEnabled", {
        get: function() {
            return this._delegate.automaticDataCollectionEnabled;
        },
        set: function(a) {
            this._delegate.automaticDataCollectionEnabled = a;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(a.prototype, "name", {
        get: function() {
            return this._delegate.name;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(a.prototype, "options", {
        get: function() {
            return this._delegate.options;
        },
        enumerable: !1,
        configurable: !0
    }), a.prototype.delete = function() {
        var a = this;
        return new Promise(function(b) {
            a._delegate.checkDestroyed(), b();
        }).then(function() {
            return a.firebase.INTERNAL.removeApp(a.name), c.deleteApp(a._delegate);
        });
    }, a.prototype._getService = function(e, b) {
        void 0 === b && (b = c._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var d, a = this._delegate.container.getProvider(e);
        return a.isInitialized() || (null === (d = a.getComponent()) || void 0 === d ? void 0 : d.instantiationMode) !== "EXPLICIT" || a.initialize(), a.getImmediate({
            identifier: b
        });
    }, a.prototype._removeServiceInstance = function(b, a) {
        void 0 === a && (a = c._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(b).clearInstance(a);
    }, a.prototype._addComponent = function(a) {
        c._addComponent(this._delegate, a);
    }, a.prototype._addOrOverwriteComponent = function(a) {
        c._addOrOverwriteComponent(this._delegate, a);
    }, a.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, a;
}(), g = ((a = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", a["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", a), n = new b.ErrorFactory("app-compat", "Firebase", g);
function h() {
    var e, c, f, a, d = (e = m, c = function(a) {
        if (a = a || l._DEFAULT_ENTRY_NAME, !b.contains(f, a)) throw n.create("no-app", {
            appName: a
        });
        return f[a];
    }, f = {}, (a = {
        __esModule: !0,
        initializeApp: function(h, d) {
            void 0 === d && (d = {});
            var c = l.initializeApp(h, d);
            if (b.contains(f, c.name)) return f[c.name];
            var g = new e(c, a);
            return f[c.name] = g, g;
        },
        app: c,
        registerVersion: l.registerVersion,
        setLogLevel: l.setLogLevel,
        onLog: l.onLog,
        apps: null,
        SDK_VERSION: l.SDK_VERSION,
        INTERNAL: {
            registerComponent: function(d) {
                var h = d.name, f = h.replace("-compat", "");
                if (l._registerComponent(d) && "PUBLIC" === d.type) {
                    var g = function(a) {
                        if (void 0 === a && (a = c()), "function" != typeof a[f]) throw n.create("invalid-app-argument", {
                            appName: h
                        });
                        return a[f]();
                    };
                    void 0 !== d.serviceProps && b.deepExtend(g, d.serviceProps), a[f] = g, e.prototype[f] = function() {
                        for(var b = [], a = 0; a < arguments.length; a++)b[a] = arguments[a];
                        return this._getService.bind(this, h).apply(this, d.multipleInstances ? b : []);
                    };
                }
                return "PUBLIC" === d.type ? a[f] : null;
            },
            removeApp: function(a) {
                delete f[a];
            },
            useAsService: function(b, a) {
                return "serverAuth" === a ? null : a;
            },
            modularAPIs: l
        }
    }).default = a, Object.defineProperty(a, "apps", {
        get: function() {
            return Object.keys(f).map(function(a) {
                return f[a];
            });
        }
    }), c.App = e, a);
    return d.INTERNAL = j.__assign(j.__assign({}, d.INTERNAL), {
        createFirebaseNamespace: h,
        extendNamespace: function(a) {
            b.deepExtend(d, a);
        },
        createSubscribe: b.createSubscribe,
        ErrorFactory: b.ErrorFactory,
        deepExtend: b.deepExtend
    }), d;
}
var i = h(), d = new f.Logger("@firebase/app-compat");
if (b.isBrowser() && void 0 !== self.firebase) {
    d.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var e = self.firebase.SDK_VERSION;
    e && e.indexOf("LITE") >= 0 && d.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
c.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = i;
