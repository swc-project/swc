"use strict";
var a, b = require("@firebase/util"), c = require("tslib"), d = require("@firebase/component"), e = require("@firebase/app"), f = require("@firebase/logger"), g = function(a) {
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
}(e), h = function() {
    var a = function(a, b) {
        var c = this;
        this._delegate = a, this.firebase = b, e._addComponent(a, new d.Component("app-compat", function() {
            return c;
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
            return a.firebase.INTERNAL.removeApp(a.name), e.deleteApp(a._delegate);
        });
    }, a.prototype._getService = function(a, b) {
        void 0 === b && (b = e._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var c, d = this._delegate.container.getProvider(a);
        return d.isInitialized() || (null === (c = d.getComponent()) || void 0 === c ? void 0 : c.instantiationMode) !== "EXPLICIT" || d.initialize(), d.getImmediate({
            identifier: b
        });
    }, a.prototype._removeServiceInstance = function(a, b) {
        void 0 === b && (b = e._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(a).clearInstance(b);
    }, a.prototype._addComponent = function(a) {
        e._addComponent(this._delegate, a);
    }, a.prototype._addOrOverwriteComponent = function(a) {
        e._addOrOverwriteComponent(this._delegate, a);
    }, a.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, a;
}(), i = ((a = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", a["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", a), j = new b.ErrorFactory("app-compat", "Firebase", i);
function k() {
    var a, d, e, f, i = (a = h, d = function(a) {
        if (a = a || g._DEFAULT_ENTRY_NAME, !b.contains(e, a)) throw j.create("no-app", {
            appName: a
        });
        return e[a];
    }, e = {}, (f = {
        __esModule: !0,
        initializeApp: function(c, d) {
            void 0 === d && (d = {});
            var h = g.initializeApp(c, d);
            if (b.contains(e, h.name)) return e[h.name];
            var i = new a(h, f);
            return e[h.name] = i, i;
        },
        app: d,
        registerVersion: g.registerVersion,
        setLogLevel: g.setLogLevel,
        onLog: g.onLog,
        apps: null,
        SDK_VERSION: g.SDK_VERSION,
        INTERNAL: {
            registerComponent: function(c) {
                var e = c.name, h = e.replace("-compat", "");
                if (g._registerComponent(c) && "PUBLIC" === c.type) {
                    var i = function(a) {
                        if (void 0 === a && (a = d()), "function" != typeof a[h]) throw j.create("invalid-app-argument", {
                            appName: e
                        });
                        return a[h]();
                    };
                    void 0 !== c.serviceProps && b.deepExtend(i, c.serviceProps), f[h] = i, a.prototype[h] = function() {
                        for(var a = [], b = 0; b < arguments.length; b++)a[b] = arguments[b];
                        return this._getService.bind(this, e).apply(this, c.multipleInstances ? a : []);
                    };
                }
                return "PUBLIC" === c.type ? f[h] : null;
            },
            removeApp: function(a) {
                delete e[a];
            },
            useAsService: function(a, b) {
                return "serverAuth" === b ? null : b;
            },
            modularAPIs: g
        }
    }).default = f, Object.defineProperty(f, "apps", {
        get: function() {
            return Object.keys(e).map(function(a) {
                return e[a];
            });
        }
    }), d.App = a, f);
    return i.INTERNAL = c.__assign(c.__assign({}, i.INTERNAL), {
        createFirebaseNamespace: k,
        extendNamespace: function(a) {
            b.deepExtend(i, a);
        },
        createSubscribe: b.createSubscribe,
        ErrorFactory: b.ErrorFactory,
        deepExtend: b.deepExtend
    }), i;
}
var l = k(), m = new f.Logger("@firebase/app-compat");
if (b.isBrowser() && void 0 !== self.firebase) {
    m.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var n = self.firebase.SDK_VERSION;
    n && n.indexOf("LITE") >= 0 && m.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
e.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = l;
