"use strict";
var e = require("@firebase/util");
var t = require("tslib");
var r = require("@firebase/component");
var n = require("@firebase/app");
var i = require("@firebase/logger");
function o(e) {
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
var a = o(n);
var u = (function() {
    function e(e, t) {
        var i = this;
        this._delegate = e;
        this.firebase = t;
        n._addComponent(e, new r.Component("app-compat", function() {
            return i;
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
        var i = this._delegate.container.getProvider(e);
        if (!i.isInitialized() && ((r = i.getComponent()) === null || r === void 0 ? void 0 : r.instantiationMode) === "EXPLICIT") {
            i.initialize();
        }
        return i.getImmediate({
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
var c;
var s = ((c = {}), (c["no-app"] = "No Firebase App '{$appName}' has been created - " + "call Firebase App.initializeApp()"), (c["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a " + "Firebase App instance."), c);
var p = new e.ErrorFactory("app-compat", "Firebase", s);
function f(t) {
    var r = {};
    var n = {
        __esModule: true,
        initializeApp: u,
        app: o,
        registerVersion: a.registerVersion,
        setLogLevel: a.setLogLevel,
        onLog: a.onLog,
        apps: null,
        SDK_VERSION: a.SDK_VERSION,
        INTERNAL: {
            registerComponent: s,
            removeApp: i,
            useAsService: f,
            modularAPIs: a
        }
    };
    n["default"] = n;
    Object.defineProperty(n, "apps", {
        get: c
    });
    function i(e) {
        delete r[e];
    }
    function o(t) {
        t = t || a._DEFAULT_ENTRY_NAME;
        if (!e.contains(r, t)) {
            throw p.create("no-app", {
                appName: t
            });
        }
        return r[t];
    }
    o["App"] = t;
    function u(i, o) {
        if (o === void 0) {
            o = {};
        }
        var u = a.initializeApp(i, o);
        if (e.contains(r, u.name)) {
            return r[u.name];
        }
        var c = new t(u, n);
        r[u.name] = c;
        return c;
    }
    function c() {
        return Object.keys(r).map(function(e) {
            return r[e];
        });
    }
    function s(r) {
        var i = r.name;
        var u = i.replace("-compat", "");
        if (a._registerComponent(r) && r.type === "PUBLIC") {
            var c = function(e) {
                if (e === void 0) {
                    e = o();
                }
                if (typeof e[u] !== "function") {
                    throw p.create("invalid-app-argument", {
                        appName: i
                    });
                }
                return e[u]();
            };
            if (r.serviceProps !== undefined) {
                e.deepExtend(c, r.serviceProps);
            }
            n[u] = c;
            t.prototype[u] = function() {
                var e = [];
                for(var t = 0; t < arguments.length; t++){
                    e[t] = arguments[t];
                }
                var n = this._getService.bind(this, i);
                return n.apply(this, r.multipleInstances ? e : []);
            };
        }
        return r.type === "PUBLIC" ? n[u] : null;
    }
    function f(e, t) {
        if (t === "serverAuth") {
            return null;
        }
        var r = t;
        return r;
    }
    return n;
}
function d() {
    var r = f(u);
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
var l = d();
var v = new i.Logger("@firebase/app-compat");
var g = "@firebase/app-compat";
var m = "0.1.5";
function E(e) {
    n.registerVersion(g, m, e);
}
if (e.isBrowser() && self.firebase !== undefined) {
    v.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var h = self.firebase.SDK_VERSION;
    if (h && h.indexOf("LITE") >= 0) {
        v.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
    }
}
var y = l;
E();
module.exports = y;
