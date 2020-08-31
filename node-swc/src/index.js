"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EXTENSIONS = exports.bundle = exports.transformFileSync = exports.transformFile = exports.transformSync = exports.transform = exports.printSync = exports.print = exports.parseFileSync = exports.parseFile = exports.parseSync = exports.parse = exports.Compiler = exports.plugins = exports.version = void 0;
__exportStar(require("./types"), exports);
var spack_1 = require("./spack");
var helper_1 = require("@node-rs/helper");
var os_1 = require("os");
var bindings;
var linuxError = null;
try {
    bindings = helper_1.loadBinding(__dirname, 'swc');
}
catch (e) {
    var platformName = os_1.platform();
    try {
        bindings = require("@swc/core-" + platformName);
    }
    catch (e) {
        if (platformName !== 'linux') {
            throw new TypeError('Not compatible with your platform. Error message: ' + e.message);
        }
        else {
            linuxError = e;
        }
    }
}
if (!bindings) {
    try {
        require.resolve('@swc/core-linux-musl');
    }
    catch (e) {
        throw new TypeError("Could not load @swc/core-linux, You may need add @swc/core-linux-musl to optionalDependencies of your project");
    }
    try {
        bindings = require('@swc/core-linux-musl');
    }
    catch (e) {
        throw new TypeError("Linux glibc version load error: " + linuxError.message + "; Linux musl version load error: Error message: " + e.message);
    }
}
/**
 * Version of the swc binding.
 */
exports.version = require("./package.json").version;
function plugins(ps) {
    return function (mod) {
        var m = mod;
        for (var _i = 0, ps_1 = ps; _i < ps_1.length; _i++) {
            var p = ps_1[_i];
            m = p(m);
        }
        return m;
    };
}
exports.plugins = plugins;
var Compiler = /** @class */ (function () {
    function Compiler() {
    }
    Compiler.prototype.parse = function (src, options) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = options || { syntax: "ecmascript" };
                        options.syntax = options.syntax || "ecmascript";
                        return [4 /*yield*/, bindings.parse(src, toBuffer(options))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    Compiler.prototype.parseSync = function (src, options) {
        options = options || { syntax: "ecmascript" };
        options.syntax = options.syntax || "ecmascript";
        return JSON.parse(bindings.parseSync(src, toBuffer(options)));
    };
    Compiler.prototype.parseFile = function (path, options) {
        options = options || { syntax: "ecmascript" };
        options.syntax = options.syntax || "ecmascript";
        var res = bindings.parseFile(path, toBuffer(options));
        return JSON.parse(res);
    };
    Compiler.prototype.parseFileSync = function (path, options) {
        options = options || { syntax: "ecmascript" };
        options.syntax = options.syntax || "ecmascript";
        return JSON.parse(bindings.parseFileSync(path, toBuffer(options)));
    };
    /**
     * Note: this method should be invoked on the compiler instance used
     *  for `parse()` / `parseSync()`.
     */
    Compiler.prototype.print = function (m, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                options = options || {};
                return [2 /*return*/, bindings.print(JSON.stringify(m), toBuffer(options))];
            });
        });
    };
    /**
     * Note: this method should be invoked on the compiler instance used
     *  for `parse()` / `parseSync()`.
     */
    Compiler.prototype.printSync = function (m, options) {
        options = options || {};
        return bindings.printSync(JSON.stringify(m), toBuffer(options));
    };
    Compiler.prototype.transform = function (src, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var isModule, plugin, m, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        isModule = typeof src !== "string";
                        options = options || {};
                        if ((_a = options === null || options === void 0 ? void 0 : options.jsc) === null || _a === void 0 ? void 0 : _a.parser) {
                            options.jsc.parser.syntax = (_b = options.jsc.parser.syntax) !== null && _b !== void 0 ? _b : 'ecmascript';
                        }
                        plugin = options.plugin;
                        delete options.plugin;
                        if (!plugin) return [3 /*break*/, 4];
                        if (!(typeof src === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.parse(src, (_c = options === null || options === void 0 ? void 0 : options.jsc) === null || _c === void 0 ? void 0 : _c.parser)];
                    case 1:
                        _d = _e.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _d = src;
                        _e.label = 3;
                    case 3:
                        m = _d;
                        return [2 /*return*/, this.transform(plugin(m), options)];
                    case 4: return [2 /*return*/, bindings.transform(isModule ? JSON.stringify(src) : src, isModule, toBuffer(options))];
                }
            });
        });
    };
    Compiler.prototype.transformSync = function (src, options) {
        var _a, _b, _c;
        var isModule = typeof src !== "string";
        options = options || {};
        if ((_a = options === null || options === void 0 ? void 0 : options.jsc) === null || _a === void 0 ? void 0 : _a.parser) {
            options.jsc.parser.syntax = (_b = options.jsc.parser.syntax) !== null && _b !== void 0 ? _b : 'ecmascript';
        }
        var plugin = options.plugin;
        delete options.plugin;
        if (plugin) {
            var m = typeof src === "string" ? this.parseSync(src, (_c = options === null || options === void 0 ? void 0 : options.jsc) === null || _c === void 0 ? void 0 : _c.parser) : src;
            return this.transformSync(plugin(m), options);
        }
        return bindings.transformSync(isModule ? JSON.stringify(src) : src, isModule, toBuffer(options));
    };
    Compiler.prototype.transformFile = function (path, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var plugin, m;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        options = options || {};
                        if ((_a = options === null || options === void 0 ? void 0 : options.jsc) === null || _a === void 0 ? void 0 : _a.parser) {
                            options.jsc.parser.syntax = (_b = options.jsc.parser.syntax) !== null && _b !== void 0 ? _b : 'ecmascript';
                        }
                        plugin = options.plugin;
                        delete options.plugin;
                        if (!plugin) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.parseFile(path, (_c = options === null || options === void 0 ? void 0 : options.jsc) === null || _c === void 0 ? void 0 : _c.parser)];
                    case 1:
                        m = _d.sent();
                        return [2 /*return*/, this.transform(plugin(m), options)];
                    case 2: return [2 /*return*/, bindings.transformFile(path, false, toBuffer(options))];
                }
            });
        });
    };
    Compiler.prototype.transformFileSync = function (path, options) {
        var _a, _b, _c;
        options = options || {};
        if ((_a = options === null || options === void 0 ? void 0 : options.jsc) === null || _a === void 0 ? void 0 : _a.parser) {
            options.jsc.parser.syntax = (_b = options.jsc.parser.syntax) !== null && _b !== void 0 ? _b : 'ecmascript';
        }
        var plugin = options === null || options === void 0 ? void 0 : options.plugin;
        options === null || options === void 0 ? true : delete options.plugin;
        if (plugin) {
            var m = this.parseFileSync(path, (_c = options === null || options === void 0 ? void 0 : options.jsc) === null || _c === void 0 ? void 0 : _c.parser);
            return this.transformSync(plugin(m), options);
        }
        return bindings.transformFileSync(path, /* isModule */ false, toBuffer(options));
    };
    Compiler.prototype.bundle = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var opts, all, obj, _i, all_1, o;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, spack_1.compileBundleOptions(options)];
                    case 1:
                        opts = _a.sent();
                        if (!Array.isArray(opts)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(opts.map(function (opt) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, this.bundle(opt)];
                                });
                            }); }))];
                    case 2:
                        all = _a.sent();
                        obj = {};
                        for (_i = 0, all_1 = all; _i < all_1.length; _i++) {
                            o = all_1[_i];
                            obj = __assign(__assign({}, obj), o);
                        }
                        return [2 /*return*/, obj];
                    case 3: return [2 /*return*/, bindings.bundle(toBuffer(__assign({}, opts)))];
                }
            });
        });
    };
    return Compiler;
}());
exports.Compiler = Compiler;
var compiler = new Compiler();
function parse(src, options) {
    return compiler.parse(src, options);
}
exports.parse = parse;
function parseSync(src, options) {
    return compiler.parseSync(src, options);
}
exports.parseSync = parseSync;
function parseFile(path, options) {
    return compiler.parseFile(path, options);
}
exports.parseFile = parseFile;
function parseFileSync(path, options) {
    return compiler.parseFileSync(path, options);
}
exports.parseFileSync = parseFileSync;
function print(m, options) {
    return compiler.print(m, options);
}
exports.print = print;
function printSync(m, options) {
    return compiler.printSync(m, options);
}
exports.printSync = printSync;
function transform(src, options) {
    return compiler.transform(src, options);
}
exports.transform = transform;
function transformSync(src, options) {
    return compiler.transformSync(src, options);
}
exports.transformSync = transformSync;
function transformFile(path, options) {
    return compiler.transformFile(path, options);
}
exports.transformFile = transformFile;
function transformFileSync(path, options) {
    return compiler.transformFileSync(path, options);
}
exports.transformFileSync = transformFileSync;
function bundle(options) {
    return compiler.bundle(options);
}
exports.bundle = bundle;
exports.DEFAULT_EXTENSIONS = Object.freeze([
    ".js",
    ".jsx",
    ".es6",
    ".es",
    ".mjs",
    ".ts",
    ".tsx"
]);
function toBuffer(t) {
    return Buffer.from(JSON.stringify(t));
}
