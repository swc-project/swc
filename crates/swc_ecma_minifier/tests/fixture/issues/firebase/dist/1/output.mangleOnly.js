"use strict";
var e = require("@firebase/util");
var t = require("tslib");
var r = require("@firebase/component");
var n = require("@firebase/app");
var a = require("@firebase/logger");
function i(e) {
    if (e && e.__esModule) return e;
    var t = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function(r) {
            if (r !== "default") {
                var n = Object.getOwnPropertyDescriptor(e, r);
                Object.defineProperty(t, r, n.get ? n : {
                    enumerable: true,
                    get: function() {
                        return e[r];
                    }
                });
            }
        });
    }
    t["default"] = e;
    return Object.freeze(t);
}
var o = i(n);
var p = (function() {
    function e(e, t) {
        var a = this;
        this._delegate = e;
        this.firebase = t;
        n._addComponent(e, new r.Component("app-compat", function() {
            return a;
        }, "PUBLIC"));
        this.container = e.container;
    }
    Object.defineProperty(e.prototype, "automaticDataCollectionEnabled", {
        get: function() {
            return this._delegate.automaticDataCollectionEnabled;
        },
        set: function(e) {
            this._delegate.automaticDataCollectionEnabled = e;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(e.prototype, "name", {
        get: function() {
            return this._delegate.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(e.prototype, "options", {
        get: function() {
            return this._delegate.options;
        },
        enumerable: false,
        configurable: true
    });
    e.prototype.delete = function() {
        var e = this;
        return new Promise(function(t) {
            e._delegate.checkDestroyed();
            t();
        }).then(function() {
            e.firebase.INTERNAL.removeApp(e.name);
            return n.deleteApp(e._delegate);
        });
    };
    e.prototype._getService = function(e, t) {
        var r;
        if (t === void 0) {
            t = n._DEFAULT_ENTRY_NAME;
        }
        this._delegate.checkDestroyed();
        var a = this._delegate.container.getProvider(e);
        if (!a.isInitialized() && ((r = a.getComponent()) === null || r === void 0 ? void 0 : r.instantiationMode) === "EXPLICIT") {
            a.initialize();
        }
        return a.getImmediate({
            identifier: t
        });
    };
    e.prototype._removeServiceInstance = function(e, t) {
        if (t === void 0) {
            t = n._DEFAULT_ENTRY_NAME;
        }
        this._delegate.container.getProvider(e).clearInstance(t);
    };
    e.prototype._addComponent = function(e) {
        n._addComponent(this._delegate, e);
    };
    e.prototype._addOrOverwriteComponent = function(e) {
        n._addOrOverwriteComponent(this._delegate, e);
    };
    e.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    };
    return e;
})();
var s;
var c = ((s = {}), (s["no-app"] = "No Firebase App '{$appName}' has been created - " + "call Firebase App.initializeApp()"), (s["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a " + "Firebase App instance."), s);
var u = new e.ErrorFactory("app-compat", "Firebase", c);
function l(t) {
    var r = {};
    var n = {
        __esModule: true,
        initializeApp: p,
        app: i,
        registerVersion: o.registerVersion,
        setLogLevel: o.setLogLevel,
        onLog: o.onLog,
        apps: null,
        SDK_VERSION: o.SDK_VERSION,
        INTERNAL: {
            registerComponent: c,
            removeApp: a,
            useAsService: l,
            modularAPIs: o
        }
    };
    n["default"] = n;
    Object.defineProperty(n, "apps", {
        get: s
    });
    function a(e) {
        delete r[e];
    }
    function i(t) {
        t = t || o._DEFAULT_ENTRY_NAME;
        if (!e.contains(r, t)) {
            throw u.create("no-app", {
                appName: t
            });
        }
        return r[t];
    }
    i["App"] = t;
    function p(a, i) {
        if (i === void 0) {
            i = {};
        }
        var p = o.initializeApp(a, i);
        if (e.contains(r, p.name)) {
            return r[p.name];
        }
        var s = new t(p, n);
        r[p.name] = s;
        return s;
    }
    function s() {
        return Object.keys(r).map(function(e) {
            return r[e];
        });
    }
    function c(r) {
        var a = r.name;
        var p = a.replace("-compat", "");
        if (o._registerComponent(r) && r.type === "PUBLIC") {
            var s = function(e) {
                if (e === void 0) {
                    e = i();
                }
                if (typeof e[p] !== "function") {
                    throw u.create("invalid-app-argument", {
                        appName: a
                    });
                }
                return e[p]();
            };
            if (r.serviceProps !== undefined) {
                e.deepExtend(s, r.serviceProps);
            }
            n[p] = s;
            t.prototype[p] = function() {
                var e = [];
                for(var t = 0; t < arguments.length; t++){
                    e[t] = arguments[t];
                }
                var n = this._getService.bind(this, a);
                return n.apply(this, r.multipleInstances ? e : []);
            };
        }
        return r.type === "PUBLIC" ? n[p] : null;
    }
    function l(e, t) {
        if (t === "serverAuth") {
            return null;
        }
        var r = t;
        return r;
    }
    return n;
}
function d() {
    var r = l(p);
    r.INTERNAL = t.__assign(t.__assign({}, r.INTERNAL), {
        createFirebaseNamespace: d,
        extendNamespace: n,
        createSubscribe: e.createSubscribe,
        ErrorFactory: e.ErrorFactory,
        deepExtend: e.deepExtend
    });
    function n(t) {
        e.deepExtend(r, t);
    }
    return r;
}
var f = d();
var v = new a.Logger("@firebase/app-compat");
var m = "@firebase/app-compat";
var b = "0.1.5";
function g(e) {
    n.registerVersion(m, b, e);
}
if (e.isBrowser() && self.firebase !== undefined) {
    v.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var _ = self.firebase.SDK_VERSION;
    if (_ && _.indexOf("LITE") >= 0) {
        v.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
    }
}
var h = f;
g();
module.exports = h;
