"use strict";
var b = require("@firebase/util");
var m = require("tslib");
var n = require("@firebase/component");
var e = require("@firebase/app");
var f = require("@firebase/logger");
function g(a) {
    if (a && a.__esModule) return a;
    var b = Object.create(null);
    if (a) {
        Object.keys(a).forEach(function(c) {
            if (c !== "default") {
                var d = Object.getOwnPropertyDescriptor(a, c);
                Object.defineProperty(b, c, d.get ? d : {
                    enumerable: true,
                    get: function() {
                        return a[c];
                    }
                });
            }
        });
    }
    b["default"] = a;
    return Object.freeze(b);
}
var o = g(e);
var p = (function() {
    function a(a, b) {
        var c = this;
        this._delegate = a;
        this.firebase = b;
        e._addComponent(a, new n.Component("app-compat", function() {
            return c;
        }, "PUBLIC"));
        this.container = a.container;
    }
    Object.defineProperty(a.prototype, "automaticDataCollectionEnabled", {
        get: function() {
            return this._delegate.automaticDataCollectionEnabled;
        },
        set: function(a) {
            this._delegate.automaticDataCollectionEnabled = a;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(a.prototype, "name", {
        get: function() {
            return this._delegate.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(a.prototype, "options", {
        get: function() {
            return this._delegate.options;
        },
        enumerable: false,
        configurable: true
    });
    a.prototype.delete = function() {
        var a = this;
        return new Promise(function(b) {
            a._delegate.checkDestroyed();
            b();
        }).then(function() {
            a.firebase.INTERNAL.removeApp(a.name);
            return e.deleteApp(a._delegate);
        });
    };
    a.prototype._getService = function(d, b) {
        var c;
        if (b === void 0) {
            b = e._DEFAULT_ENTRY_NAME;
        }
        this._delegate.checkDestroyed();
        var a = this._delegate.container.getProvider(d);
        if (!a.isInitialized() && ((c = a.getComponent()) === null || c === void 0 ? void 0 : c.instantiationMode) === "EXPLICIT") {
            a.initialize();
        }
        return a.getImmediate({
            identifier: b
        });
    };
    a.prototype._removeServiceInstance = function(b, a) {
        if (a === void 0) {
            a = e._DEFAULT_ENTRY_NAME;
        }
        this._delegate.container.getProvider(b).clearInstance(a);
    };
    a.prototype._addComponent = function(a) {
        e._addComponent(this._delegate, a);
    };
    a.prototype._addOrOverwriteComponent = function(a) {
        e._addOrOverwriteComponent(this._delegate, a);
    };
    a.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    };
    return a;
})();
var a;
var h = ((a = {}), (a["no-app"] = "No Firebase App '{$appName}' has been created - " + "call Firebase App.initializeApp()"), (a["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a " + "Firebase App instance."), a);
var q = new b.ErrorFactory("app-compat", "Firebase", h);
function r(c) {
    var e = {};
    var a = {
        __esModule: true,
        initializeApp: g,
        app: d,
        registerVersion: o.registerVersion,
        setLogLevel: o.setLogLevel,
        onLog: o.onLog,
        apps: null,
        SDK_VERSION: o.SDK_VERSION,
        INTERNAL: {
            registerComponent: i,
            removeApp: f,
            useAsService: j,
            modularAPIs: o
        }
    };
    a["default"] = a;
    Object.defineProperty(a, "apps", {
        get: h
    });
    function f(a) {
        delete e[a];
    }
    function d(a) {
        a = a || o._DEFAULT_ENTRY_NAME;
        if (!b.contains(e, a)) {
            throw q.create("no-app", {
                appName: a
            });
        }
        return e[a];
    }
    d["App"] = c;
    function g(h, f) {
        if (f === void 0) {
            f = {};
        }
        var d = o.initializeApp(h, f);
        if (b.contains(e, d.name)) {
            return e[d.name];
        }
        var g = new c(d, a);
        e[d.name] = g;
        return g;
    }
    function h() {
        return Object.keys(e).map(function(a) {
            return e[a];
        });
    }
    function i(e) {
        var h = e.name;
        var f = h.replace("-compat", "");
        if (o._registerComponent(e) && e.type === "PUBLIC") {
            var g = function(a) {
                if (a === void 0) {
                    a = d();
                }
                if (typeof a[f] !== "function") {
                    throw q.create("invalid-app-argument", {
                        appName: h
                    });
                }
                return a[f]();
            };
            if (e.serviceProps !== undefined) {
                b.deepExtend(g, e.serviceProps);
            }
            a[f] = g;
            c.prototype[f] = function() {
                var b = [];
                for(var a = 0; a < arguments.length; a++){
                    b[a] = arguments[a];
                }
                var c = this._getService.bind(this, h);
                return c.apply(this, e.multipleInstances ? b : []);
            };
        }
        return e.type === "PUBLIC" ? a[f] : null;
    }
    function j(c, a) {
        if (a === "serverAuth") {
            return null;
        }
        var b = a;
        return b;
    }
    return a;
}
function i() {
    var a = r(p);
    a.INTERNAL = m.__assign(m.__assign({}, a.INTERNAL), {
        createFirebaseNamespace: i,
        extendNamespace: c,
        createSubscribe: b.createSubscribe,
        ErrorFactory: b.ErrorFactory,
        deepExtend: b.deepExtend
    });
    function c(c) {
        b.deepExtend(a, c);
    }
    return a;
}
var j = i();
var c = new f.Logger("@firebase/app-compat");
var s = "@firebase/app-compat";
var t = "0.1.5";
function k(a) {
    e.registerVersion(s, t, a);
}
if (b.isBrowser() && self.firebase !== undefined) {
    c.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var d = self.firebase.SDK_VERSION;
    if (d && d.indexOf("LITE") >= 0) {
        c.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
    }
}
var l = j;
k();
module.exports = l;
