"use strict";
var _a1, util = require("@firebase/util"), tslib = require("tslib"), component1 = require("@firebase/component"), modularAPIs = require("@firebase/app"), logger$1 = require("@firebase/logger"), modularAPIs__namespace = function(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    return e && Object.keys(e).forEach(function(k) {
        if ("default" !== k) {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
                enumerable: !0,
                get: function() {
                    return e[k];
                }
            });
        }
    }), n.default = e, Object.freeze(n);
}(modularAPIs), FirebaseAppImpl1 = function() {
    function FirebaseAppImpl(_delegate, firebase) {
        var _this = this;
        this._delegate = _delegate, this.firebase = firebase, modularAPIs._addComponent(_delegate, new component1.Component("app-compat", function() {
            return _this;
        }, "PUBLIC")), this.container = _delegate.container;
    }
    return Object.defineProperty(FirebaseAppImpl.prototype, "automaticDataCollectionEnabled", {
        get: function() {
            return this._delegate.automaticDataCollectionEnabled;
        },
        set: function(val) {
            this._delegate.automaticDataCollectionEnabled = val;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(FirebaseAppImpl.prototype, "name", {
        get: function() {
            return this._delegate.name;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(FirebaseAppImpl.prototype, "options", {
        get: function() {
            return this._delegate.options;
        },
        enumerable: !1,
        configurable: !0
    }), FirebaseAppImpl.prototype.delete = function() {
        var _this = this;
        return new Promise(function(resolve) {
            _this._delegate.checkDestroyed(), resolve();
        }).then(function() {
            return _this.firebase.INTERNAL.removeApp(_this.name), modularAPIs.deleteApp(_this._delegate);
        });
    }, FirebaseAppImpl.prototype._getService = function(name, instanceIdentifier) {
        var _a;
        void 0 === instanceIdentifier && (instanceIdentifier = modularAPIs._DEFAULT_ENTRY_NAME), this._delegate.checkDestroyed();
        var provider = this._delegate.container.getProvider(name);
        return provider.isInitialized() || (null === (_a = provider.getComponent()) || void 0 === _a ? void 0 : _a.instantiationMode) !== "EXPLICIT" || provider.initialize(), provider.getImmediate({
            identifier: instanceIdentifier
        });
    }, FirebaseAppImpl.prototype._removeServiceInstance = function(name, instanceIdentifier) {
        void 0 === instanceIdentifier && (instanceIdentifier = modularAPIs._DEFAULT_ENTRY_NAME), this._delegate.container.getProvider(name).clearInstance(instanceIdentifier);
    }, FirebaseAppImpl.prototype._addComponent = function(component) {
        modularAPIs._addComponent(this._delegate, component);
    }, FirebaseAppImpl.prototype._addOrOverwriteComponent = function(component) {
        modularAPIs._addOrOverwriteComponent(this._delegate, component);
    }, FirebaseAppImpl.prototype.toJSON = function() {
        return {
            name: this.name,
            automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
            options: this.options
        };
    }, FirebaseAppImpl;
}(), ERRORS = ((_a1 = {
})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", _a1["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", _a1), ERROR_FACTORY = new util.ErrorFactory("app-compat", "Firebase", ERRORS);
function createFirebaseNamespace() {
    var namespace1 = function(firebaseAppImpl) {
        var apps = {
        }, namespace = {
            __esModule: !0,
            initializeApp: function(options, rawConfig) {
                void 0 === rawConfig && (rawConfig = {
                });
                var app = modularAPIs__namespace.initializeApp(options, rawConfig);
                if (util.contains(apps, app.name)) return apps[app.name];
                var appCompat = new firebaseAppImpl(app, namespace);
                return apps[app.name] = appCompat, appCompat;
            },
            app: app1,
            registerVersion: modularAPIs__namespace.registerVersion,
            setLogLevel: modularAPIs__namespace.setLogLevel,
            onLog: modularAPIs__namespace.onLog,
            apps: null,
            SDK_VERSION: modularAPIs__namespace.SDK_VERSION,
            INTERNAL: {
                registerComponent: function(component) {
                    var componentName = component.name, componentNameWithoutCompat = componentName.replace("-compat", "");
                    if (modularAPIs__namespace._registerComponent(component) && "PUBLIC" === component.type) {
                        var serviceNamespace = function(appArg) {
                            if (void 0 === appArg && (appArg = app1()), "function" != typeof appArg[componentNameWithoutCompat]) throw ERROR_FACTORY.create("invalid-app-argument", {
                                appName: componentName
                            });
                            return appArg[componentNameWithoutCompat]();
                        };
                        void 0 !== component.serviceProps && util.deepExtend(serviceNamespace, component.serviceProps), namespace[componentNameWithoutCompat] = serviceNamespace, firebaseAppImpl.prototype[componentNameWithoutCompat] = function() {
                            for(var args = [], _i = 0; _i < arguments.length; _i++)args[_i] = arguments[_i];
                            return this._getService.bind(this, componentName).apply(this, component.multipleInstances ? args : []);
                        };
                    }
                    return "PUBLIC" === component.type ? namespace[componentNameWithoutCompat] : null;
                },
                removeApp: function(name) {
                    delete apps[name];
                },
                useAsService: function(app, name) {
                    return "serverAuth" === name ? null : name;
                },
                modularAPIs: modularAPIs__namespace
            }
        };
        function app1(name) {
            if (name = name || modularAPIs__namespace._DEFAULT_ENTRY_NAME, !util.contains(apps, name)) throw ERROR_FACTORY.create("no-app", {
                appName: name
            });
            return apps[name];
        }
        return namespace.default = namespace, Object.defineProperty(namespace, "apps", {
            get: function() {
                return Object.keys(apps).map(function(name) {
                    return apps[name];
                });
            }
        }), app1.App = firebaseAppImpl, namespace;
    }(FirebaseAppImpl1);
    return namespace1.INTERNAL = tslib.__assign(tslib.__assign({
    }, namespace1.INTERNAL), {
        createFirebaseNamespace: createFirebaseNamespace,
        extendNamespace: function(props) {
            util.deepExtend(namespace1, props);
        },
        createSubscribe: util.createSubscribe,
        ErrorFactory: util.ErrorFactory,
        deepExtend: util.deepExtend
    }), namespace1;
}
var firebase$1 = createFirebaseNamespace(), logger = new logger$1.Logger("@firebase/app-compat");
if (util.isBrowser() && void 0 !== self.firebase) {
    logger.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var sdkVersion = self.firebase.SDK_VERSION;
    sdkVersion && sdkVersion.indexOf("LITE") >= 0 && logger.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
}
modularAPIs.registerVersion("@firebase/app-compat", "0.1.5", void 0), module.exports = firebase$1;
