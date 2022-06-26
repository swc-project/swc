"use strict";
var a = require("@firebase/util");
var b = require("tslib");
var c = require("@firebase/component");
var d = require("@firebase/app");
var e = require("@firebase/logger");
function f(a) {
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
var g = f(d);
var h = (function() {
    function a(a, b) {
        var e = this;
        this._delegate = a;
        this.firebase = b;
        d._addComponent(a, new c.Component("app-compat", function() {
            return e;
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
            return d.deleteApp(a._delegate);
        });
    };
    a.prototype._getService = function(a, b) {
        var c;
        if (b === void 0) {
            b = d._DEFAULT_ENTRY_NAME;
        }
        this._delegate.checkDestroyed();
        var e = this._delegate.container.getProvider(a);
        if (!e.isInitialized() && ((c = e.getComponent()) === null || c === void 0 ? void 0 : c.instantiationMode) === "EXPLICIT") {
            e.initialize();
        }
        return e.getImmediate({
            identifier: b
        });
    };
    a.prototype._removeServiceInstance = function(a, b) {
        if (b === void 0) {
            b = d._DEFAULT_ENTRY_NAME;
        }
        this._delegate.container.getProvider(a).clearInstance(b);
    };
    a.prototype._addComponent = function(a) {
        d._addComponent(this._delegate, a);
    };
    a.prototype._addOrOverwriteComponent = function(a) {
        d._addOrOverwriteComponent(this._delegate, a);
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
var i;
var j = ((i = {}), (i["no-app"] = "No Firebase App '{$appName}' has been created - " + "call Firebase App.initializeApp()"), (i["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a " + "Firebase App instance."), i);
var k = new a.ErrorFactory("app-compat", "Firebase", j);
function l(b) {
    var c = {};
    var d = {
        __esModule: true,
        initializeApp: h,
        app: f,
        registerVersion: g.registerVersion,
        setLogLevel: g.setLogLevel,
        onLog: g.onLog,
        apps: null,
        SDK_VERSION: g.SDK_VERSION,
        INTERNAL: {
            registerComponent: j,
            removeApp: e,
            useAsService: l,
            modularAPIs: g
        }
    };
    d["default"] = d;
    Object.defineProperty(d, "apps", {
        get: i
    });
    function e(a) {
        delete c[a];
    }
    function f(b) {
        b = b || g._DEFAULT_ENTRY_NAME;
        if (!a.contains(c, b)) {
            throw k.create("no-app", {
                appName: b
            });
        }
        return c[b];
    }
    f["App"] = b;
    function h(e, f) {
        if (f === void 0) {
            f = {};
        }
        var h = g.initializeApp(e, f);
        if (a.contains(c, h.name)) {
            return c[h.name];
        }
        var i = new b(h, d);
        c[h.name] = i;
        return i;
    }
    function i() {
        return Object.keys(c).map(function(a) {
            return c[a];
        });
    }
    function j(c) {
        var e = c.name;
        var h = e.replace("-compat", "");
        if (g._registerComponent(c) && c.type === "PUBLIC") {
            var i = function(a) {
                if (a === void 0) {
                    a = f();
                }
                if (typeof a[h] !== "function") {
                    throw k.create("invalid-app-argument", {
                        appName: e
                    });
                }
                return a[h]();
            };
            if (c.serviceProps !== undefined) {
                a.deepExtend(i, c.serviceProps);
            }
            d[h] = i;
            b.prototype[h] = function() {
                var a = [];
                for(var b = 0; b < arguments.length; b++){
                    a[b] = arguments[b];
                }
                var d = this._getService.bind(this, e);
                return d.apply(this, c.multipleInstances ? a : []);
            };
        }
        return c.type === "PUBLIC" ? d[h] : null;
    }
    function l(a, b) {
        if (b === "serverAuth") {
            return null;
        }
        var c = b;
        return c;
    }
    return d;
}
function m() {
    var c = l(h);
    c.INTERNAL = b.__assign(b.__assign({}, c.INTERNAL), {
        createFirebaseNamespace: m,
        extendNamespace: d,
        createSubscribe: a.createSubscribe,
        ErrorFactory: a.ErrorFactory,
        deepExtend: a.deepExtend
    });
    function d(b) {
        a.deepExtend(c, b);
    }
    return c;
}
var n = m();
var o = new e.Logger("@firebase/app-compat");
var p = "@firebase/app-compat";
var q = "0.1.5";
function r(a) {
    d.registerVersion(p, q, a);
}
if (a.isBrowser() && self.firebase !== undefined) {
    o.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var s = self.firebase.SDK_VERSION;
    if (s && s.indexOf("LITE") >= 0) {
        o.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
    }
}
var t = n;
r();
module.exports = t;
