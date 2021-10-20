"use strict";
var a, b = require("@firebase/util"), c = require("tslib"), d = require("@firebase/component"), e = require("@firebase/app"), f = require("@firebase/logger"), g = function(h) {
    if (h && h.__esModule) return h;
    var i = Object.create(null);
    return h && Object.keys(h).forEach(function(j) {
        if ("default" !== j) {
            var k = Object.getOwnPropertyDescriptor(h, j);
            Object.defineProperty(i, j, k.get ? k : {
                enumerable: !0,
                get: function() {
                    return h[j];
                }
            });
        }
    }), i.default = h, Object.freeze(i);
}(e), l = function() {
    var m = function(n, o) {
        var p = this;
        this._delegate = n, this.firebase = o, e._addComponent(n, new d.Component("app-compat", function() {
            return p;
        }, "PUBLIC")), this.container = n.container;
    };
    return Object.defineProperty(m.prototype, "automaticDataCollectionEnabled", {
        get: function() {
            return this._delegate.automaticDataCollectionEnabled;
        },
        set: function(q) {
            this._delegate.automaticDataCollectionEnabled = q;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(m.prototype, "name", {
        get: function() {
            return this._delegate.name;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(m.prototype, "options", {
        get: function() {
            return this._delegate.options;
        },
        enumerable: !1,
        configurable: !0
    }), m.prototype.delete = function() {
        var r = this;
        return new Promise(function(s) {
            r._delegate.checkDestroyed(), s();
        }).then(function() {
            return r.firebase.INTERNAL.removeApp(r.name), e.deleteApp(r._delegate);
        });
    }, m.prototype._getService = function(t, u) {
        var v;
        void 0 === u && (u = e._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var w = this._delegate.container.getProvider(t);
        return w.isInitialized() || (null === (v = w.getComponent()) || void 0 === v ? void 0 : v.instantiationMode) !== "EXPLICIT" || w.initialize(), w.getImmediate({
            identifier: u
        });
    }, m.prototype._removeServiceInstance = function(x, y) {
        void 0 === y && (y = e._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(x).clearInstance(y);
    }, m.prototype._addComponent = function(z) {
        e._addComponent(this._delegate, z);
    }, m.prototype._addOrOverwriteComponent = function(A) {
        e._addOrOverwriteComponent(this._delegate, A);
    }, m.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, m;
}(), B = ((a = {
})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", a["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", a), C = new b.ErrorFactory("app-compat", "Firebase", B);
function D() {
    var E = function(F) {
        var G = function(H) {
            if (H = H || g._DEFAULT_ENTRY_NAME, !b.contains(I, H)) throw C.create("no-app", {
                appName: H
            });
            return I[H];
        }, I = {
        }, J = {
            __esModule: !0,
            initializeApp: function(K, L) {
                void 0 === L && (L = {
                });
                var M = g.initializeApp(K, L);
                if (b.contains(I, M.name)) return I[M.name];
                var N = new F(M, J);
                return I[M.name] = N, N;
            },
            app: G,
            registerVersion: g.registerVersion,
            setLogLevel: g.setLogLevel,
            onLog: g.onLog,
            apps: null,
            SDK_VERSION: g.SDK_VERSION,
            INTERNAL: {
                registerComponent: function(O) {
                    var P = O.name, Q = P.replace("-compat", "");
                    if (g._registerComponent(O) && "PUBLIC" === O.type) {
                        var R = function(S) {
                            if (void 0 === S && (S = G()), "function" != typeof S[Q]) throw C.create("invalid-app-argument", {
                                appName: P
                            });
                            return S[Q]();
                        };
                        void 0 !== O.serviceProps && b.deepExtend(R, O.serviceProps), J[Q] = R, F.prototype[Q] = function() {
                            for(var T = [], U = 0; U < arguments.length; U++)T[U] = arguments[U];
                            return this._getService.bind(this, P).apply(this, O.multipleInstances ? T : []);
                        };
                    }
                    return "PUBLIC" === O.type ? J[Q] : null;
                },
                removeApp: function(V) {
                    delete I[V];
                },
                useAsService: function(W, X) {
                    return "serverAuth" === X ? null : X;
                },
                modularAPIs: g
            }
        };
        return J.default = J, Object.defineProperty(J, "apps", {
            get: function() {
                return Object.keys(I).map(function(Y) {
                    return I[Y];
                });
            }
        }), G.App = F, J;
    }(l);
    return E.INTERNAL = c.__assign(c.__assign({
    }, E.INTERNAL), {
        createFirebaseNamespace: D,
        extendNamespace: function(Z) {
            b.deepExtend(E, Z);
        },
        createSubscribe: b.createSubscribe,
        ErrorFactory: b.ErrorFactory,
        deepExtend: b.deepExtend
    }), E;
}
var $ = D(), _ = new f.Logger("@firebase/app-compat");
if (b.isBrowser() && void 0 !== self.firebase) {
    _.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var aa = self.firebase.SDK_VERSION;
    aa && aa.indexOf("LITE") >= 0 && _.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
e.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = $;
