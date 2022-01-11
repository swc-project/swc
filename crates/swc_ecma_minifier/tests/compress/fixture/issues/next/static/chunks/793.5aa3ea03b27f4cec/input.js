"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[793],{

/***/ 3793:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Workspace; }
});

// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4637);
// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/index.js
var react = __webpack_require__(9496);
// EXTERNAL MODULE: ./node_modules/.pnpm/jotai@1.4.0_react@17.0.2/node_modules/jotai/esm/index.js
var esm = __webpack_require__(4968);
// EXTERNAL MODULE: ./node_modules/.pnpm/swr@1.0.1_react@17.0.2/node_modules/swr/dist/index.esm.js + 1 modules
var index_esm = __webpack_require__(8624);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+react@1.6.10_ef216fd07ecfbd7a9aaa3879b655b45c/node_modules/@chakra-ui/react/dist/esm/index.js
var dist_esm = __webpack_require__(113);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/center.js
var center = __webpack_require__(7154);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+progress@1.1.15_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/progress/dist/esm/circular-progress.js + 2 modules
var circular_progress = __webpack_require__(2069);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/stack.js + 3 modules
var stack = __webpack_require__(7783);
// EXTERNAL MODULE: ./node_modules/.pnpm/@monaco-editor+react@4.3.1_f0689466c0c38bde0d57c82418990dab/node_modules/@monaco-editor/react/lib/es/index.js + 25 modules
var es = __webpack_require__(4702);
// EXTERNAL MODULE: ./node_modules/.pnpm/ts-results@3.3.0/node_modules/ts-results/esm/index.js + 3 modules
var ts_results_esm = __webpack_require__(993);
;// CONCATENATED MODULE: ./src/state.ts

var defaultCompressOptions = {
    arguments: false,
    arrows: true,
    booleans: true,
    booleans_as_integers: false,
    collapse_vars: true,
    comparisons: true,
    computed_props: false,
    conditionals: false,
    dead_code: false,
    directives: false,
    drop_console: false,
    drop_debugger: true,
    evaluate: true,
    expression: false,
    hoist_funs: false,
    hoist_props: true,
    hoist_vars: false,
    if_return: true,
    join_vars: true,
    keep_classnames: false,
    keep_fargs: true,
    keep_fnames: false,
    keep_infinity: false,
    loops: true,
    negate_iife: true,
    properties: true,
    reduce_funcs: false,
    reduce_vars: false,
    side_effects: true,
    switches: false,
    typeofs: true,
    unsafe: false,
    unsafe_arrows: false,
    unsafe_comps: false,
    unsafe_Function: false,
    unsafe_math: false,
    unsafe_symbols: false,
    unsafe_methods: false,
    unsafe_proto: false,
    unsafe_regexp: false,
    unsafe_undefined: false,
    unused: true
};
var defaultMangleOptions = {
    toplevel: false,
    keep_classnames: false,
    keep_fnames: false,
    keep_private_props: false,
    ie8: false,
    safari10: false
};
var defaultEnvOptions = {
    targets: ''
};
var codeAtom = (0,esm/* atom */.cn)('');
var swcConfigAtom = (0,esm/* atom */.cn)({
    jsc: {
        parser: {
            syntax: 'ecmascript',
            jsx: false
        },
        target: 'es5',
        loose: false,
        minify: {
            compress: false,
            mangle: false
        }
    },
    module: {
        type: 'es6'
    },
    minify: false,
    isModule: true
});
var fileNameAtom = (0,esm/* atom */.cn)(function(get) {
    var config = get(swcConfigAtom);
    if (config.jsc.parser.syntax === 'ecmascript') {
        if (config.jsc.parser.jsx) {
            return 'input.jsx';
        } else {
            return 'input.js';
        }
    } else {
        if (config.jsc.parser.tsx) {
            return 'input.tsx';
        } else {
            return 'input.ts';
        }
    }
});

// EXTERNAL MODULE: ./node_modules/.pnpm/next@12.0.8-canary.13_react-dom@17.0.2+react@17.0.2/node_modules/next/dist/compiled/regenerator-runtime/runtime.js
var runtime = __webpack_require__(8356);
var runtime_default = /*#__PURE__*/__webpack_require__.n(runtime);
;// CONCATENATED MODULE: ./src/swc.ts



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var ref;
var swcVersionAtom = (0,esm/* atom */.cn)((ref = new URLSearchParams(location.search).get('version')) !== null && ref !== void 0 ? ref : '1.2.124');
function loadSwc(version) {
    return _loadSwc.apply(this, arguments);
}
function _loadSwc() {
    _loadSwc = _asyncToGenerator(runtime_default().mark(function _callee(version) {
        var module;
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return import(/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/@swc/wasm-web@".concat(version, "/wasm.js"));
                case 2:
                    module = _ctx.sent;
                    _ctx.next = 5;
                    return module.default();
                case 5:
                    return _ctx.abrupt("return", module);
                case 6:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _loadSwc.apply(this, arguments);
}
function transform(param) {
    var code = param.code, config = param.config, fileName = param.fileName, swc = param.swc;
    try {
        return (0,ts_results_esm.Ok)(swc.transformSync(code, _objectSpread({
        }, config, {
            filename: fileName
        })));
    } catch (error) {
        return handleSwcError(error);
    }
}
function parse(param) {
    var code = param.code, config = param.config, swc = param.swc;
    try {
        return (0,ts_results_esm.Ok)(swc.parseSync(code, config.jsc.parser));
    } catch (error) {
        return handleSwcError(error);
    }
}
function handleSwcError(error) {
    if (typeof error === 'string') {
        return (0,ts_results_esm/* Err */.UG)(error);
    } else if (_instanceof(error, Error)) {
        return (0,ts_results_esm/* Err */.UG)("".concat(error.toString(), "\n\n").concat(error.stack));
    } else {
        return (0,ts_results_esm/* Err */.UG)(String(error));
    }
}
var configSchema = {
    type: 'object',
    properties: {
        jsc: {
            type: 'object',
            properties: {
                parser: {
                    type: 'object',
                    required: [
                        'syntax'
                    ],
                    oneOf: [
                        {
                            type: 'object',
                            properties: {
                                syntax: {
                                    type: 'string',
                                    enum: [
                                        'ecmascript'
                                    ]
                                },
                                jsx: {
                                    type: 'boolean'
                                },
                                functionBind: {
                                    type: 'boolean'
                                },
                                decorators: {
                                    type: 'boolean'
                                },
                                decoratorsBeforeExport: {
                                    type: 'boolean'
                                },
                                exportDefaultFrom: {
                                    type: 'boolean'
                                },
                                importAssertions: {
                                    type: 'boolean'
                                },
                                staticBlocks: {
                                    type: 'boolean'
                                },
                                privateInObject: {
                                    type: 'boolean'
                                }
                            },
                            additionalProperties: false
                        },
                        {
                            type: 'object',
                            properties: {
                                syntax: {
                                    type: 'string',
                                    enum: [
                                        'typescript'
                                    ]
                                },
                                tsx: {
                                    type: 'boolean'
                                },
                                decorators: {
                                    type: 'boolean'
                                }
                            },
                            additionalProperties: false
                        }, 
                    ]
                },
                target: {
                    type: 'string',
                    enum: [
                        'es3',
                        'es5',
                        'es2015',
                        'es2016',
                        'es2017',
                        'es2018',
                        'es2019',
                        'es2020',
                        'es2021',
                        'es2022', 
                    ]
                },
                loose: {
                    type: 'boolean'
                },
                minify: {
                    type: 'object',
                    properties: {
                        compress: {
                            anyOf: [
                                {
                                    type: 'boolean'
                                },
                                {
                                    type: 'object',
                                    properties: {
                                        arguments: {
                                            type: 'boolean'
                                        },
                                        arrows: {
                                            type: 'boolean'
                                        },
                                        booleans: {
                                            type: 'boolean'
                                        },
                                        booleans_as_integers: {
                                            type: 'boolean'
                                        },
                                        collapse_vars: {
                                            type: 'boolean'
                                        },
                                        comparisons: {
                                            type: 'boolean'
                                        },
                                        computed_props: {
                                            type: 'boolean'
                                        },
                                        conditionals: {
                                            type: 'boolean'
                                        },
                                        dead_code: {
                                            type: 'boolean'
                                        },
                                        defaults: {
                                            type: 'boolean',
                                            default: true
                                        },
                                        directives: {
                                            type: 'boolean'
                                        },
                                        drop_console: {
                                            type: 'boolean'
                                        },
                                        drop_debugger: {
                                            type: 'boolean'
                                        },
                                        ecma: {
                                            anyOf: [
                                                {
                                                    type: 'integer',
                                                    minimum: 0
                                                },
                                                {
                                                    type: 'string'
                                                }, 
                                            ]
                                        },
                                        evaluate: {
                                            type: 'boolean'
                                        },
                                        expression: {
                                            type: 'boolean'
                                        },
                                        global_defs: {
                                            type: 'object'
                                        },
                                        hoist_funs: {
                                            type: 'boolean'
                                        },
                                        hoist_props: {
                                            type: 'boolean'
                                        },
                                        hoist_vars: {
                                            type: 'boolean'
                                        },
                                        ie8: {
                                            type: 'boolean'
                                        },
                                        if_return: {
                                            type: 'boolean'
                                        },
                                        inline: {
                                            anyOf: [
                                                {
                                                    type: 'boolean'
                                                },
                                                {
                                                    type: 'integer',
                                                    minimum: 0,
                                                    maximum: 255
                                                }, 
                                            ]
                                        },
                                        join_vars: {
                                            type: 'boolean'
                                        },
                                        keep_classnames: {
                                            type: 'boolean'
                                        },
                                        keep_fargs: {
                                            type: 'boolean'
                                        },
                                        keep_fnames: {
                                            type: 'boolean'
                                        },
                                        keep_infinity: {
                                            type: 'boolean'
                                        },
                                        loops: {
                                            type: 'boolean'
                                        },
                                        negate_iife: {
                                            type: 'boolean'
                                        },
                                        passes: {
                                            type: 'integer',
                                            minimum: 0
                                        },
                                        properties: {
                                            type: 'boolean'
                                        },
                                        pure_getters: {
                                            anyOf: [
                                                {
                                                    type: 'boolean'
                                                },
                                                {
                                                    type: 'string',
                                                    enum: [
                                                        'strict'
                                                    ]
                                                },
                                                {
                                                    type: 'string'
                                                }, 
                                            ]
                                        },
                                        pure_funcs: {
                                            type: 'array',
                                            items: {
                                                type: 'string'
                                            }
                                        },
                                        reduce_funcs: {
                                            type: 'boolean'
                                        },
                                        reduce_vars: {
                                            type: 'boolean'
                                        },
                                        sequences: {
                                            anyOf: [
                                                {
                                                    type: 'boolean'
                                                },
                                                {
                                                    type: 'integer',
                                                    minimum: 0,
                                                    maximum: 255
                                                }, 
                                            ]
                                        },
                                        side_effects: {
                                            type: 'boolean'
                                        },
                                        switches: {
                                            type: 'boolean'
                                        },
                                        top_retain: {
                                            anyOf: [
                                                {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string'
                                                    }
                                                },
                                                {
                                                    type: 'string'
                                                },
                                                {
                                                    type: 'null'
                                                }, 
                                            ]
                                        },
                                        toplevel: {
                                            anyOf: [
                                                {
                                                    type: 'boolean'
                                                },
                                                {
                                                    type: 'string'
                                                }
                                            ]
                                        },
                                        typeofs: {
                                            type: 'boolean'
                                        },
                                        unsafe: {
                                            type: 'boolean'
                                        },
                                        unsafe_arrows: {
                                            type: 'boolean'
                                        },
                                        unsafe_comps: {
                                            type: 'boolean'
                                        },
                                        unsafe_Function: {
                                            type: 'boolean'
                                        },
                                        unsafe_math: {
                                            type: 'boolean'
                                        },
                                        unsafe_symbols: {
                                            type: 'boolean'
                                        },
                                        unsafe_methods: {
                                            type: 'boolean'
                                        },
                                        unsafe_proto: {
                                            type: 'boolean'
                                        },
                                        unsafe_regexp: {
                                            type: 'boolean'
                                        },
                                        unsafe_undefined: {
                                            type: 'boolean'
                                        },
                                        unused: {
                                            type: 'boolean'
                                        },
                                        module: {
                                            type: 'boolean'
                                        }
                                    },
                                    additionalProperties: false
                                }, 
                            ]
                        },
                        mangle: {
                            anyOf: [
                                {
                                    type: 'boolean'
                                },
                                {
                                    type: 'object',
                                    properties: {
                                        props: {
                                            type: 'object',
                                            properties: {
                                                reserved: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string'
                                                    }
                                                },
                                                undeclared: {
                                                    type: 'boolean'
                                                },
                                                regex: {
                                                    anyOf: [
                                                        {
                                                            type: 'null'
                                                        },
                                                        {
                                                            type: 'string'
                                                        }
                                                    ]
                                                }
                                            },
                                            additionalProperties: false
                                        },
                                        toplevel: {
                                            type: 'boolean'
                                        },
                                        keep_classnames: {
                                            type: 'boolean'
                                        },
                                        keep_fnames: {
                                            type: 'boolean'
                                        },
                                        keep_private_props: {
                                            type: 'boolean'
                                        },
                                        ie8: {
                                            type: 'boolean'
                                        },
                                        safari10: {
                                            type: 'boolean'
                                        }
                                    },
                                    additionalProperties: false
                                }, 
                            ]
                        },
                        format: {
                            type: 'object'
                        },
                        ecma: {
                            anyOf: [
                                {
                                    type: 'integer',
                                    minimum: 0
                                },
                                {
                                    type: 'string'
                                }
                            ]
                        },
                        keepClassnames: {
                            type: 'boolean'
                        },
                        keepFnames: {
                            type: 'boolean'
                        },
                        module: {
                            type: 'boolean'
                        },
                        safari10: {
                            type: 'boolean'
                        },
                        toplevel: {
                            type: 'boolean'
                        },
                        sourceMap: {
                            type: 'object',
                            properties: {
                                filename: {
                                    type: 'string'
                                },
                                url: {
                                    type: 'string'
                                },
                                root: {
                                    type: 'string'
                                },
                                content: {
                                    type: 'string'
                                }
                            },
                            additionalProperties: false
                        },
                        outputPath: {
                            type: 'string'
                        },
                        inlineSourcesContent: {
                            type: 'boolean',
                            default: true
                        }
                    },
                    additionalProperties: false
                },
                transform: {
                    type: 'object',
                    properties: {
                        react: {
                            type: 'object',
                            properties: {
                                runtime: {
                                    type: 'string',
                                    enum: [
                                        'automatic',
                                        'classic'
                                    ]
                                },
                                importSource: {
                                    type: 'string'
                                },
                                pragma: {
                                    type: 'string'
                                },
                                pragmaFrag: {
                                    type: 'string'
                                },
                                throwIfNamespace: {
                                    type: 'boolean'
                                },
                                development: {
                                    type: 'boolean'
                                },
                                useSpread: {
                                    type: 'boolean'
                                },
                                refresh: {
                                    type: 'object',
                                    properties: {
                                        refreshReg: {
                                            type: 'string'
                                        },
                                        refreshSig: {
                                            type: 'string'
                                        },
                                        emitFullSignatures: {
                                            type: 'boolean'
                                        }
                                    },
                                    additionalProperties: false
                                }
                            },
                            additionalProperties: false
                        },
                        constModules: {
                            type: 'object',
                            properties: {
                                globals: {
                                    type: 'object',
                                    additionalProperties: {
                                        type: 'object',
                                        additionalProperties: {
                                            type: 'string'
                                        }
                                    }
                                }
                            },
                            additionalProperties: false
                        },
                        optimizer: {
                            type: 'object',
                            properties: {
                                globals: {
                                    type: 'object',
                                    properties: {
                                        vars: {
                                            type: 'object',
                                            additionalProperties: {
                                                type: 'string'
                                            }
                                        },
                                        envs: {
                                            anyOf: [
                                                {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string'
                                                    }
                                                },
                                                {
                                                    type: 'object',
                                                    additionalProperties: {
                                                        type: 'string'
                                                    }
                                                }, 
                                            ]
                                        },
                                        typeofs: {
                                            type: 'object',
                                            additionalProperties: {
                                                type: 'string'
                                            }
                                        }
                                    },
                                    additionalProperties: false
                                },
                                simplify: {
                                    type: 'boolean'
                                },
                                jsonify: {
                                    type: 'object',
                                    properties: {
                                        minCost: {
                                            type: 'integer',
                                            default: 1024
                                        }
                                    },
                                    additionalProperties: false
                                }
                            },
                            additionalProperties: false
                        },
                        legacyDecorator: {
                            type: 'boolean'
                        },
                        decoratorMetadata: {
                            type: 'boolean'
                        }
                    },
                    additionalProperties: false
                },
                externalHelpers: {
                    type: 'boolean',
                    default: false
                },
                keepClassNames: {
                    type: 'boolean',
                    default: false
                },
                baseUrl: {
                    type: 'string'
                },
                paths: {
                    type: 'object',
                    additionalProperties: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                }
            },
            additionalProperties: false
        },
        module: {
            type: 'object',
            anyOf: [
                {
                    type: 'object',
                    required: [
                        'type'
                    ],
                    properties: {
                        type: {
                            type: 'string',
                            enum: [
                                'es6'
                            ]
                        },
                        strict: {
                            type: 'boolean',
                            default: false
                        },
                        strictMode: {
                            type: 'boolean',
                            default: true
                        },
                        lazy: {
                            type: 'boolean',
                            default: false
                        },
                        noInterop: {
                            type: 'boolean',
                            default: false
                        }
                    },
                    additionalProperties: false
                },
                {
                    type: 'object',
                    required: [
                        'type'
                    ],
                    properties: {
                        type: {
                            type: 'string',
                            enum: [
                                'commonjs'
                            ]
                        },
                        strict: {
                            type: 'boolean',
                            default: false
                        },
                        strictMode: {
                            type: 'boolean',
                            default: true
                        },
                        lazy: {
                            type: 'boolean',
                            default: false
                        },
                        noInterop: {
                            type: 'boolean',
                            default: false
                        }
                    },
                    additionalProperties: false
                },
                {
                    type: 'object',
                    required: [
                        'type'
                    ],
                    properties: {
                        type: {
                            type: 'string',
                            enum: [
                                'amd'
                            ]
                        },
                        moduleId: {
                            type: 'string'
                        },
                        strict: {
                            type: 'boolean',
                            default: false
                        },
                        strictMode: {
                            type: 'boolean',
                            default: true
                        },
                        lazy: {
                            type: 'boolean',
                            default: false
                        },
                        noInterop: {
                            type: 'boolean',
                            default: false
                        }
                    },
                    additionalProperties: false
                },
                {
                    type: 'object',
                    required: [
                        'type'
                    ],
                    properties: {
                        type: {
                            type: 'string',
                            enum: [
                                'umd'
                            ]
                        },
                        globals: {
                            type: 'object',
                            additionalProperties: {
                                type: 'string'
                            }
                        },
                        strict: {
                            type: 'boolean',
                            default: false
                        },
                        strictMode: {
                            type: 'boolean',
                            default: true
                        },
                        lazy: {
                            type: 'boolean',
                            default: false
                        },
                        noInterop: {
                            type: 'boolean',
                            default: false
                        }
                    },
                    additionalProperties: false
                }, 
            ]
        },
        minify: {
            type: 'boolean'
        },
        isModule: {
            type: 'boolean'
        },
        env: {
            type: 'object',
            properties: {
                targets: {
                    anyOf: [
                        {
                            type: 'string'
                        },
                        {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        {
                            type: 'object',
                            properties: {
                                chrome: {
                                    type: 'string'
                                },
                                opera: {
                                    type: 'string'
                                },
                                edge: {
                                    type: 'string'
                                },
                                firefox: {
                                    type: 'string'
                                },
                                safari: {
                                    type: 'string'
                                },
                                ie: {
                                    type: 'string'
                                },
                                ios: {
                                    type: 'string'
                                },
                                android: {
                                    type: 'string'
                                },
                                node: {
                                    type: 'string'
                                },
                                electron: {
                                    type: 'string'
                                }
                            }
                        }, 
                    ]
                },
                mode: {
                    type: 'string',
                    enum: [
                        'usage',
                        'entry'
                    ]
                },
                skip: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                dynamicImport: {
                    type: 'boolean'
                },
                loose: {
                    type: 'boolean'
                },
                include: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                exclude: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                coreJs: {
                    type: 'integer',
                    enum: [
                        2,
                        3
                    ]
                },
                shippedProposals: {
                    type: 'boolean'
                },
                forceAllTransforms: {
                    type: 'boolean'
                }
            },
            additionalProperties: false
        },
        sourceMaps: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'string',
                    enum: [
                        'inline'
                    ]
                }
            ]
        },
        inlineSourcesContent: {
            type: 'boolean'
        },
        experimental: {
            type: 'object',
            additionalProperties: false
        }
    },
    additionalProperties: false
};

// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/flex.js
var flex = __webpack_require__(4294);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/heading.js
var heading = __webpack_require__(4374);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+form-control@1.4.2_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/form-control/dist/esm/form-control.js
var form_control = __webpack_require__(2262);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+form-control@1.4.2_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/form-control/dist/esm/form-label.js
var form_label = __webpack_require__(3371);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+select@1.1.16_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/select/dist/esm/select.js
var esm_select = __webpack_require__(683);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+switch@1.2.11_d271f19db16d06f6063d36368dff37a6/node_modules/@chakra-ui/switch/dist/esm/switch.js
var esm_switch = __webpack_require__(4614);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+input@1.2.11_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/input/dist/esm/input.js
var input = __webpack_require__(1978);
// EXTERNAL MODULE: ./node_modules/.pnpm/js-base64@3.7.2/node_modules/js-base64/base64.mjs
var base64 = __webpack_require__(1377);
// EXTERNAL MODULE: ./node_modules/.pnpm/pako@2.0.4/node_modules/pako/dist/pako.esm.mjs
var pako_esm = __webpack_require__(8213);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+hooks@1.6.1_react@17.0.2/node_modules/@chakra-ui/hooks/dist/esm/use-disclosure.js
var use_disclosure = __webpack_require__(847);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+button@1.4.5_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/button/dist/esm/button.js + 6 modules
var esm_button = __webpack_require__(8328);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+modal@1.9.2_cacd6ee922b9c38ab3f71436888dc32b/node_modules/@chakra-ui/modal/dist/esm/modal.js + 65 modules
var modal = __webpack_require__(7577);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/text.js
var esm_text = __webpack_require__(9292);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/grid.js
var grid = __webpack_require__(9982);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+checkbox@1.5.8_d271f19db16d06f6063d36368dff37a6/node_modules/@chakra-ui/checkbox/dist/esm/checkbox.js + 3 modules
var esm_checkbox = __webpack_require__(1225);
;// CONCATENATED MODULE: ./src/components/CompressOptionsModal.tsx





function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function CompressOptionsModal_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function CompressOptionsModal_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            CompressOptionsModal_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function CompressOptionsModal() {
    var ref6, ref1;
    var ref2 = _slicedToArray((0,esm/* useAtom */.KO)(swcConfigAtom), 2), swcConfig = ref2[0], setSwcConfig = ref2[1];
    var ref3 = (0,react.useState)((ref6 = swcConfig.jsc) === null || ref6 === void 0 ? void 0 : (ref1 = ref6.minify) === null || ref1 === void 0 ? void 0 : ref1.compress), options1 = ref3[0], setOptions = ref3[1];
    var ref4 = (0,use_disclosure/* useDisclosure */.q)(), isOpen = ref4.isOpen, onOpen = ref4.onOpen, onClose = ref4.onClose;
    var handleApply = function() {
        setSwcConfig(function(config) {
            return CompressOptionsModal_objectSpread({
            }, config, {
                jsc: CompressOptionsModal_objectSpread({
                }, config.jsc, {
                    minify: CompressOptionsModal_objectSpread({
                    }, config.jsc.minify, {
                        compress: options1
                    })
                })
            });
        });
        onClose();
    };
    var handleOpen = function() {
        var ref, ref5;
        setOptions((ref = swcConfig.jsc) === null || ref === void 0 ? void 0 : (ref5 = ref.minify) === null || ref5 === void 0 ? void 0 : ref5.compress);
        onOpen();
    };
    var handleClose = function() {
        var ref, ref7;
        setOptions((ref = swcConfig.jsc) === null || ref === void 0 ? void 0 : (ref7 = ref.minify) === null || ref7 === void 0 ? void 0 : ref7.compress);
        onClose();
    };
    if (!options1) {
        return null;
    }
    var handleOptionChange = function(key, event) {
        setOptions(function(options) {
            return options && typeof options === 'object' ? CompressOptionsModal_objectSpread({
            }, options, CompressOptionsModal_defineProperty({
            }, key, event.target.checked)) : options;
        });
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                size: "xs",
                onClick: handleOpen,
                children: "More"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* Modal */.u_, {
                isCentered: true,
                scrollBehavior: "inside",
                size: "xl",
                isOpen: isOpen,
                onClose: handleClose,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalOverlay */.ZA, {
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalContent */.hz, {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalHeader */.xB, {
                                children: "Compress Options"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalCloseButton */.ol, {
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalBody */.fe, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_text/* Text */.x, {
                                        mb: "4",
                                        children: "Not all options are shown here. You can also configure by closing this dialog then clicking the \"Edit as JSON\" button."
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(grid/* Grid */.r, {
                                        templateColumns: [
                                            '1fr',
                                            '1fr',
                                            'repeat(3, 1fr)'
                                        ],
                                        rowGap: "2",
                                        columnGap: "2",
                                        children: Object.entries(options1).map(function(param) {
                                            var _param = _slicedToArray(param, 2), key = _param[0], value = _param[1];
                                            /*#__PURE__*/ return (0,jsx_runtime.jsx)(esm_checkbox/* Checkbox */.X, {
                                                isChecked: value,
                                                onChange: function(event) {
                                                    return handleOptionChange(key, event);
                                                },
                                                children: key
                                            }, key);
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalFooter */.mz, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                        colorScheme: "blue",
                                        mr: 3,
                                        onClick: handleApply,
                                        children: "Apply"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                        onClick: handleClose,
                                        children: "Cancel"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/MangleOptionsModal.tsx





function MangleOptionsModal_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function MangleOptionsModal_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function MangleOptionsModal_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function MangleOptionsModal_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function MangleOptionsModal_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function MangleOptionsModal_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            MangleOptionsModal_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function MangleOptionsModal_slicedToArray(arr, i) {
    return MangleOptionsModal_arrayWithHoles(arr) || MangleOptionsModal_iterableToArrayLimit(arr, i) || MangleOptionsModal_unsupportedIterableToArray(arr, i) || MangleOptionsModal_nonIterableRest();
}
function MangleOptionsModal_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return MangleOptionsModal_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MangleOptionsModal_arrayLikeToArray(o, minLen);
}
function MangleOptionsModal() {
    var ref6, ref1;
    var ref2 = MangleOptionsModal_slicedToArray((0,esm/* useAtom */.KO)(swcConfigAtom), 2), swcConfig = ref2[0], setSwcConfig = ref2[1];
    var ref3 = (0,react.useState)((ref6 = swcConfig.jsc) === null || ref6 === void 0 ? void 0 : (ref1 = ref6.minify) === null || ref1 === void 0 ? void 0 : ref1.mangle), options1 = ref3[0], setOptions = ref3[1];
    var ref4 = (0,use_disclosure/* useDisclosure */.q)(), isOpen = ref4.isOpen, onOpen = ref4.onOpen, onClose = ref4.onClose;
    var handleApply = function() {
        setSwcConfig(function(config) {
            return MangleOptionsModal_objectSpread({
            }, config, {
                jsc: MangleOptionsModal_objectSpread({
                }, config.jsc, {
                    minify: MangleOptionsModal_objectSpread({
                    }, config.jsc.minify, {
                        mangle: options1
                    })
                })
            });
        });
        onClose();
    };
    var handleOpen = function() {
        var ref, ref5;
        setOptions((ref = swcConfig.jsc) === null || ref === void 0 ? void 0 : (ref5 = ref.minify) === null || ref5 === void 0 ? void 0 : ref5.mangle);
        onOpen();
    };
    var handleClose = function() {
        var ref, ref7;
        setOptions((ref = swcConfig.jsc) === null || ref === void 0 ? void 0 : (ref7 = ref.minify) === null || ref7 === void 0 ? void 0 : ref7.mangle);
        onClose();
    };
    if (!options1) {
        return null;
    }
    var handleOptionChange = function(key, event) {
        setOptions(function(options) {
            return options && typeof options === 'object' ? MangleOptionsModal_objectSpread({
            }, options, MangleOptionsModal_defineProperty({
            }, key, event.target.checked)) : options;
        });
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                size: "xs",
                onClick: handleOpen,
                children: "More"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* Modal */.u_, {
                isCentered: true,
                isOpen: isOpen,
                onClose: handleClose,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalOverlay */.ZA, {
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalContent */.hz, {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalHeader */.xB, {
                                children: "Mangle Options"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalCloseButton */.ol, {
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalBody */.fe, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_text/* Text */.x, {
                                        mb: "4",
                                        children: "Not all options are shown here. You can also configure by closing this dialog then clicking the \"Edit as JSON\" button."
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(stack/* VStack */.gC, {
                                        align: "flex-start",
                                        children: Object.entries(options1).map(function(param) {
                                            var _param = MangleOptionsModal_slicedToArray(param, 2), key = _param[0], value = _param[1];
                                            /*#__PURE__*/ return (0,jsx_runtime.jsx)(esm_checkbox/* Checkbox */.X, {
                                                isChecked: value,
                                                onChange: function(event) {
                                                    return handleOptionChange(key, event);
                                                },
                                                children: key
                                            }, key);
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalFooter */.mz, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                        colorScheme: "blue",
                                        mr: 3,
                                        onClick: handleApply,
                                        children: "Apply"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                        onClick: handleClose,
                                        children: "Cancel"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    }));
};

// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/code.js
var code = __webpack_require__(7217);
;// CONCATENATED MODULE: ./src/utils.ts

var editorOptions = {
    fontFamily: '"Cascadia Code", "Jetbrains Mono", "Fira Code", "Menlo", "Consolas", monospace',
    fontLigatures: true,
    fontSize: 14,
    lineHeight: 24,
    minimap: {
        enabled: false
    },
    tabSize: 2
};
function useMonacoThemeValue() {
    return (0,dist_esm.useColorModeValue)('light', 'vs-dark');
}
function useBorderColor() {
    return (0,dist_esm.useColorModeValue)('gray.400', 'gray.600');
}
function useBgColor() {
    return (0,dist_esm.useColorModeValue)('white', 'gray.700');
}
var RE_SWC_ERROR = /error:\s(.+?)\n\s-->\s.+?:(\d+):(\d+)/gm;
function parseSWCError(message) {
    return message.matchAll(RE_SWC_ERROR);
}

;// CONCATENATED MODULE: ./src/components/ConfigEditorModal.tsx








function ConfigEditorModal_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function ConfigEditorModal_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function ConfigEditorModal_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function ConfigEditorModal_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function ConfigEditorModal_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ConfigEditorModal_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            ConfigEditorModal_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ConfigEditorModal_slicedToArray(arr, i) {
    return ConfigEditorModal_arrayWithHoles(arr) || ConfigEditorModal_iterableToArrayLimit(arr, i) || ConfigEditorModal_unsupportedIterableToArray(arr, i) || ConfigEditorModal_nonIterableRest();
}
function ConfigEditorModal_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return ConfigEditorModal_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ConfigEditorModal_arrayLikeToArray(o, minLen);
}
var ConfigEditorModal_editorOptions = ConfigEditorModal_objectSpread({
}, editorOptions, {
    scrollBeyondLastLine: false
});
function ConfigEditorModal() {
    var ref = ConfigEditorModal_slicedToArray((0,esm/* useAtom */.KO)(swcConfigAtom), 2), swcConfig = ref[0], setSwcConfig = ref[1];
    var ref1 = (0,react.useState)(JSON.stringify(swcConfig, null, 2)), editingConfig = ref1[0], setEditingConfig = ref1[1];
    var monacoTheme = useMonacoThemeValue();
    var monaco = (0,es/* useMonaco */.Ik)();
    var ref2 = (0,use_disclosure/* useDisclosure */.q)(), isOpen = ref2.isOpen, onOpen = ref2.onOpen, onClose = ref2.onClose;
    var toast = (0,dist_esm.useToast)();
    (0,react.useEffect)(function() {
        if (!monaco) {
            return;
        }
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemas: [
                {
                    uri: 'http://server/swcrc-schema.json',
                    fileMatch: [
                        '.swcrc'
                    ],
                    schema: configSchema
                }, 
            ]
        });
    }, [
        monaco
    ]);
    var handleOpen = function() {
        setEditingConfig(JSON.stringify(swcConfig, null, 2));
        onOpen();
    };
    var handleClose = function() {
        setEditingConfig(JSON.stringify(swcConfig, null, 2));
        onClose();
    };
    var handleApply = function() {
        try {
            setSwcConfig(JSON.parse(editingConfig));
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: String(error),
                status: 'error',
                duration: 5000,
                position: 'top',
                isClosable: true
            });
        }
    };
    var handleEditorChange = function(value) {
        if (value != null) {
            setEditingConfig(value);
        }
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                mt: "3",
                onClick: handleOpen,
                children: "Edit as JSON"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* Modal */.u_, {
                size: "3xl",
                isCentered: true,
                isOpen: isOpen,
                onClose: handleClose,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalOverlay */.ZA, {
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalContent */.hz, {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalHeader */.xB, {
                                children: [
                                    "SWC Configuration (",
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(code/* Code */.E, {
                                        children: ".swcrc"
                                    }),
                                    ")"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(modal/* ModalCloseButton */.ol, {
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalBody */.fe, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_text/* Text */.x, {
                                        mb: "4",
                                        children: "You can paste your config here, or just manually type directly."
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(es/* default */.ZP, {
                                        value: editingConfig,
                                        defaultLanguage: "json",
                                        path: ".swcrc",
                                        options: ConfigEditorModal_editorOptions,
                                        theme: monacoTheme,
                                        height: "40vh",
                                        onChange: handleEditorChange
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(modal/* ModalFooter */.mz, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                        colorScheme: "blue",
                                        mr: 3,
                                        onClick: handleApply,
                                        children: "Apply"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                        onClick: handleClose,
                                        children: "Cancel"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/Configuration.tsx











function Configuration_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function Configuration_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function Configuration_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function Configuration_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function Configuration_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Configuration_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            Configuration_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function Configuration_slicedToArray(arr, i) {
    return Configuration_arrayWithHoles(arr) || Configuration_iterableToArrayLimit(arr, i) || Configuration_unsupportedIterableToArray(arr, i) || Configuration_nonIterableRest();
}
function Configuration_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return Configuration_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Configuration_arrayLikeToArray(o, minLen);
}
var STORAGE_KEY = 'v1.config';
function Configuration() {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11;
    var ref12 = Configuration_slicedToArray((0,esm/* useAtom */.KO)(swcConfigAtom), 2), swcConfig = ref12[0], setSwcConfig = ref12[1];
    var bg = useBgColor();
    var borderColor = useBorderColor();
    (0,react.useEffect)(function() {
        var url = new URL(location.href);
        var encodedConfig = url.searchParams.get('config');
        var storedConfig = localStorage.getItem(STORAGE_KEY);
        if (encodedConfig) {
            setSwcConfig(JSON.parse((0,pako_esm/* ungzip */.ec)(base64/* Base64.toUint8Array */.DS.toUint8Array(encodedConfig), {
                to: 'string'
            })));
        } else if (storedConfig) {
            setSwcConfig(JSON.parse(storedConfig));
        }
    }, [
        setSwcConfig
    ]);
    (0,react.useEffect)(function() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(swcConfig));
    }, [
        swcConfig
    ]);
    var handleLanguageChange = function(event) {
        setSwcConfig(function(config) {
            var jsxOrTsx = config.jsc.parser.syntax === 'typescript' ? config.jsc.parser.tsx : config.jsc.parser.jsx;
            var parserOptions = event.target.value === 'typescript' ? {
                syntax: 'typescript',
                tsx: jsxOrTsx
            } : {
                syntax: 'ecmascript',
                jsx: jsxOrTsx
            };
            return Configuration_objectSpread({
            }, config, {
                jsc: Configuration_objectSpread({
                }, config.jsc, {
                    parser: parserOptions
                })
            });
        });
    };
    var handleTargetChange = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                jsc: Configuration_objectSpread({
                }, config.jsc, {
                    target: event.target.value
                })
            });
        });
    };
    var handleModuleChange = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                module: Configuration_objectSpread({
                }, config.module, {
                    type: event.target.value
                })
            });
        });
    };
    var handleSourceTypeChange = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                isModule: event.target.value === 'module'
            });
        });
    };
    var handleToggleJSX = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                jsc: Configuration_objectSpread({
                }, config.jsc, {
                    parser: Configuration_objectSpread({
                    }, config.jsc.parser, {
                        jsx: event.target.checked
                    })
                })
            });
        });
    };
    var handleToggleTSX = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                jsc: Configuration_objectSpread({
                }, config.jsc, {
                    parser: Configuration_objectSpread({
                    }, config.jsc.parser, {
                        tsx: event.target.checked
                    })
                })
            });
        });
    };
    var handleToggleMinify = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                minify: event.target.checked
            });
        });
    };
    var handleToggleCompress = function(event) {
        var options = event.target.checked ? defaultCompressOptions : false;
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                jsc: Configuration_objectSpread({
                }, config.jsc, {
                    minify: Configuration_objectSpread({
                    }, config.jsc.minify, {
                        compress: options
                    })
                })
            });
        });
    };
    var handleToggleMangle = function(event) {
        var options = event.target.checked ? defaultMangleOptions : false;
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                jsc: Configuration_objectSpread({
                }, config.jsc, {
                    minify: Configuration_objectSpread({
                    }, config.jsc.minify, {
                        mangle: options
                    })
                })
            });
        });
    };
    var handleToggleLoose = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                jsc: Configuration_objectSpread({
                }, config.jsc, {
                    loose: event.target.checked
                })
            });
        });
    };
    var handleToggleEnvTargets = function(event) {
        var options = event.target.checked ? defaultEnvOptions : undefined;
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                env: options
            });
        });
    };
    var handleEnvTargetsChange = function(event) {
        setSwcConfig(function(config) {
            return Configuration_objectSpread({
            }, config, {
                env: Configuration_objectSpread({
                }, config.env, {
                    targets: event.target.value
                })
            });
        });
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
        direction: "column",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(heading/* Heading */.X, {
                size: "md",
                mb: "8px",
                children: "Configuration"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
                direction: "column",
                p: "2",
                bg: bg,
                borderColor: borderColor,
                borderWidth: "1px",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(stack/* VStack */.gC, {
                        spacing: "2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-syntax",
                                        children: "Language"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_select/* Select */.Ph, {
                                        id: "swc-syntax",
                                        value: swcConfig.jsc.parser.syntax,
                                        onInput: handleLanguageChange,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "ecmascript",
                                                children: "JavaScript"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "typescript",
                                                children: "TypeScript"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                isDisabled: ((ref = swcConfig.env) === null || ref === void 0 ? void 0 : ref.targets) != null,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-target",
                                        children: "Target"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_select/* Select */.Ph, {
                                        id: "swc-target",
                                        value: swcConfig.jsc.target,
                                        onChange: handleTargetChange,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es3",
                                                children: "ES3"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es5",
                                                children: "ES5"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2015",
                                                children: "ES2015"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2016",
                                                children: "ES2016"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2017",
                                                children: "ES2017"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2018",
                                                children: "ES2018"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2019",
                                                children: "ES2019"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2020",
                                                children: "ES2020"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2021",
                                                children: "ES2021"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es2022",
                                                children: "ES2022"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-module",
                                        children: "Module"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_select/* Select */.Ph, {
                                        id: "swc-module",
                                        value: (ref1 = swcConfig.module) === null || ref1 === void 0 ? void 0 : ref1.type,
                                        onChange: handleModuleChange,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "es6",
                                                children: "ES Modules"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "commonjs",
                                                children: "CommonJS"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "amd",
                                                children: "AMD"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "umd",
                                                children: "UMD"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-source-type",
                                        children: "Source Type"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_select/* Select */.Ph, {
                                        id: "swc-source-type",
                                        value: swcConfig.isModule ? 'module' : 'script',
                                        onChange: handleSourceTypeChange,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "module",
                                                children: "Module"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "script",
                                                children: "Script"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            swcConfig.jsc.parser.syntax === 'ecmascript' ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_switch/* Switch */.r, {
                                        id: "swc-jsx",
                                        isChecked: swcConfig.jsc.parser.jsx,
                                        onChange: handleToggleJSX
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-jsx",
                                        ml: "2",
                                        mb: "0",
                                        children: "JSX"
                                    })
                                ]
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_switch/* Switch */.r, {
                                        id: "swc-tsx",
                                        isChecked: swcConfig.jsc.parser.tsx,
                                        onChange: handleToggleTSX
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-tsx",
                                        ml: "2",
                                        mb: "0",
                                        children: "TSX"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_switch/* Switch */.r, {
                                        id: "swc-loose",
                                        isChecked: swcConfig.jsc.loose,
                                        onChange: handleToggleLoose
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-loose",
                                        ml: "2",
                                        mb: "0",
                                        children: "Loose"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_switch/* Switch */.r, {
                                        id: "swc-minify",
                                        isChecked: swcConfig.minify,
                                        onChange: handleToggleMinify
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-minify",
                                        ml: "2",
                                        mb: "0",
                                        children: "Minify"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_switch/* Switch */.r, {
                                        id: "swc-compress",
                                        isChecked: !!((ref2 = swcConfig.jsc) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.minify) === null || ref3 === void 0 ? void 0 : ref3.compress),
                                        onChange: handleToggleCompress
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-copress",
                                        ml: "2",
                                        mb: "0",
                                        children: "Compress"
                                    }),
                                    ((ref4 = swcConfig.jsc) === null || ref4 === void 0 ? void 0 : (ref5 = ref4.minify) === null || ref5 === void 0 ? void 0 : ref5.compress) && /*#__PURE__*/ (0,jsx_runtime.jsx)(CompressOptionsModal, {
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_switch/* Switch */.r, {
                                        id: "swc-mangle",
                                        isChecked: !!((ref6 = swcConfig.jsc) === null || ref6 === void 0 ? void 0 : (ref7 = ref6.minify) === null || ref7 === void 0 ? void 0 : ref7.mangle),
                                        onChange: handleToggleMangle
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-mangle",
                                        ml: "2",
                                        mb: "0",
                                        children: "Mangle"
                                    }),
                                    ((ref8 = swcConfig.jsc) === null || ref8 === void 0 ? void 0 : (ref9 = ref8.minify) === null || ref9 === void 0 ? void 0 : ref9.mangle) && /*#__PURE__*/ (0,jsx_runtime.jsx)(MangleOptionsModal, {
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_switch/* Switch */.r, {
                                        id: "swc-env-targets",
                                        isChecked: ((ref10 = swcConfig.env) === null || ref10 === void 0 ? void 0 : ref10.targets) != null,
                                        onChange: handleToggleEnvTargets
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(form_label/* FormLabel */.l, {
                                        htmlFor: "swc-env-targets",
                                        ml: "2",
                                        mb: "0",
                                        children: "Env Targets"
                                    })
                                ]
                            }),
                            typeof ((ref11 = swcConfig.env) === null || ref11 === void 0 ? void 0 : ref11.targets) === 'string' && /*#__PURE__*/ (0,jsx_runtime.jsx)(form_control/* FormControl */.NI, {
                                display: "flex",
                                alignItems: "center",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(input/* Input */.I, {
                                    display: "block",
                                    placeholder: "Browserslist query",
                                    value: swcConfig.env.targets,
                                    onChange: handleEnvTargetsChange
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(ConfigEditorModal, {
                    })
                ]
            })
        ]
    }));
};

// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/link.js
var esm_link = __webpack_require__(3364);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/box.js
var box = __webpack_require__(5560);
// EXTERNAL MODULE: ./node_modules/.pnpm/react-icons@4.3.1_react@17.0.2/node_modules/react-icons/hi/index.esm.js
var hi_index_esm = __webpack_require__(405);
;// CONCATENATED MODULE: ./src/components/VersionSelect.tsx







function VersionSelect_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function VersionSelect_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function VersionSelect_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function VersionSelect_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function VersionSelect_slicedToArray(arr, i) {
    return VersionSelect_arrayWithHoles(arr) || VersionSelect_iterableToArrayLimit(arr, i) || VersionSelect_unsupportedIterableToArray(arr, i) || VersionSelect_nonIterableRest();
}
function VersionSelect_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return VersionSelect_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return VersionSelect_arrayLikeToArray(o, minLen);
}
var fetchSwcVersions = function(packageName) {
    return fetch("https://data.jsdelivr.com/v1/package/npm/".concat(packageName)).then(function(response) {
        return response.json();
    });
};
function VersionSelect(param) {
    var isLoadingSwc = param.isLoadingSwc;
    var ref = VersionSelect_slicedToArray((0,esm/* useAtom */.KO)(swcVersionAtom), 2), swcVersion = ref[0], setSwcVersion = ref[1];
    var ref1 = (0,index_esm/* default */.ZP)('@swc/wasm-web', fetchSwcVersions), data = ref1.data, error = ref1.error;
    var bg = useBgColor();
    var borderColor = useBorderColor();
    var handleCurrentVersionChange = function(event) {
        setSwcVersion(event.target.value);
    };
    var isLoading = isLoadingSwc || !data && !error;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
        direction: "column",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(heading/* Heading */.X, {
                size: "md",
                mb: "8px",
                children: "Version"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
                direction: "column",
                p: "2",
                bg: bg,
                borderColor: borderColor,
                borderWidth: "1px",
                children: [
                    data ? /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_select/* Select */.Ph, {
                        value: swcVersion,
                        onChange: handleCurrentVersionChange,
                        children: data.versions.map(function(version) {
                            /*#__PURE__*/ return (0,jsx_runtime.jsx)("option", {
                                value: version,
                                children: version
                            }, version);
                        })
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_select/* Select */.Ph, {
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                            children: swcVersion
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(flex/* Flex */.k, {
                        alignItems: "center",
                        my: "2",
                        height: "8",
                        children: isLoading && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(circular_progress/* CircularProgress */.D, {
                                    size: "7",
                                    isIndeterminate: true
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_text/* Text */.x, {
                                    ml: "2",
                                    children: "Please wait..."
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
                        px: "2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_text/* Text */.x, {
                                children: "More links:"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(stack/* HStack */.Ug, {
                                spacing: "4",
                                ml: "1",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_link/* Link */.r, {
                                        href: "https://swc.rs/",
                                        isExternal: true,
                                        display: "flex",
                                        alignItems: "center",
                                        children: [
                                            "Docs",
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(box/* Box */.xu, {
                                                display: "inline-block",
                                                ml: "1px",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(hi_index_esm/* HiExternalLink */.x9Z, {
                                                })
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_link/* Link */.r, {
                                        href: "https://github.com/swc-project/swc",
                                        isExternal: true,
                                        display: "flex",
                                        alignItems: "center",
                                        children: [
                                            "GitHub",
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(box/* Box */.xu, {
                                                display: "inline-block",
                                                ml: "1px",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(hi_index_esm/* HiExternalLink */.x9Z, {
                                                })
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    }));
};

// EXTERNAL MODULE: ./node_modules/.pnpm/react-icons@4.3.1_react@17.0.2/node_modules/react-icons/cg/index.esm.js
var cg_index_esm = __webpack_require__(7511);
;// CONCATENATED MODULE: ./src/components/InputEditor.tsx












function InputEditor_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function InputEditor_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function InputEditor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function InputEditor_asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                InputEditor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                InputEditor_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function InputEditor_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function InputEditor_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function InputEditor_slicedToArray(arr, i) {
    return InputEditor_arrayWithHoles(arr) || InputEditor_iterableToArrayLimit(arr, i) || InputEditor_unsupportedIterableToArray(arr, i) || InputEditor_nonIterableRest();
}
function InputEditor_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return InputEditor_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return InputEditor_arrayLikeToArray(o, minLen);
}
var InputEditor_STORAGE_KEY = 'v1.code';
function getIssueReportUrl(param) {
    var code = param.code, version = param.version, config = param.config, playgroundLink = param.playgroundLink;
    var reportUrl = new URL("https://github.com/swc-project/swc/issues/new?assignees=&labels=C-bug&template=bug_report.yml");
    reportUrl.searchParams.set('code', code);
    reportUrl.searchParams.set('config', JSON.stringify(config, null, 2));
    reportUrl.searchParams.set('repro-link', playgroundLink);
    reportUrl.searchParams.set('version', version);
    return reportUrl.toString();
}
function InputEditor(param1) {
    var output = param1.output;
    var ref3 = InputEditor_slicedToArray((0,esm/* useAtom */.KO)(codeAtom), 2), code = ref3[0], setCode = ref3[1];
    var ref1 = InputEditor_slicedToArray((0,esm/* useAtom */.KO)(swcConfigAtom), 1), swcConfig = ref1[0];
    var ref2 = InputEditor_slicedToArray((0,esm/* useAtom */.KO)(swcVersionAtom), 1), swcVersion = ref2[0];
    var monacoTheme = useMonacoThemeValue();
    var borderColor = useBorderColor();
    var monaco = (0,es/* useMonaco */.Ik)();
    var editorRef = (0,react.useRef)(null);
    var toast = (0,dist_esm.useToast)();
    (0,react.useEffect)(function() {
        monaco === null || monaco === void 0 ? void 0 : monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSyntaxValidation: true,
            noSemanticValidation: true,
            noSuggestionDiagnostics: true
        });
    }, [
        monaco
    ]);
    (0,react.useEffect)(function() {
        var ref;
        var model = (ref = editorRef.current) === null || ref === void 0 ? void 0 : ref.getModel();
        if (!monaco || !model) {
            return;
        }
        if (output.err) {
            var markers = Array.from(parseSWCError(output.val)).map(function(param) {
                var _param = InputEditor_slicedToArray(param, 4), _ = _param[0], message = _param[1], line = _param[2], col = _param[3];
                var lineNumber = Number.parseInt(line), column = Number.parseInt(col);
                return {
                    source: 'swc',
                    message: message,
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: lineNumber,
                    startColumn: column,
                    endLineNumber: lineNumber,
                    endColumn: column
                };
            });
            monaco.editor.setModelMarkers(model, 'swc', markers);
        }
        return function() {
            return monaco.editor.setModelMarkers(model, 'swc', []);
        };
    }, [
        output,
        monaco
    ]);
    (0,react.useEffect)(function() {
        var url = new URL(location.href);
        var encodedInput = url.searchParams.get('code');
        var storedInput = localStorage.getItem(InputEditor_STORAGE_KEY);
        if (encodedInput) {
            setCode((0,pako_esm/* ungzip */.ec)(base64/* Base64.toUint8Array */.DS.toUint8Array(encodedInput), {
                to: 'string'
            }));
        } else if (storedInput) {
            setCode(storedInput);
        }
    }, [
        setCode
    ]);
    (0,react.useEffect)(function() {
        localStorage.setItem(InputEditor_STORAGE_KEY, code);
    }, [
        code
    ]);
    var shareUrl = (0,react.useMemo)(function() {
        var url = new URL(location.href);
        url.searchParams.set('version', swcVersion);
        var encodedInput = base64/* Base64.fromUint8Array */.DS.fromUint8Array((0,pako_esm/* gzip */.iv)(code));
        url.searchParams.set('code', encodedInput);
        var encodedConfig = base64/* Base64.fromUint8Array */.DS.fromUint8Array((0,pako_esm/* gzip */.iv)(JSON.stringify(swcConfig)));
        url.searchParams.set('config', encodedConfig);
        return url.toString();
    }, [
        code,
        swcConfig,
        swcVersion
    ]);
    var issueReportUrl = (0,react.useMemo)(function() {
        return getIssueReportUrl({
            code: code,
            config: swcConfig,
            version: swcVersion,
            playgroundLink: shareUrl
        });
    }, [
        code,
        swcConfig,
        swcVersion,
        shareUrl
    ]);
    var handleShare = InputEditor_asyncToGenerator(runtime_default().mark(function _callee() {
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    if (navigator.clipboard) {
                        _ctx.next = 3;
                        break;
                    }
                    toast({
                        title: 'Error',
                        description: 'Clipboard is not supported in your environment.',
                        status: 'error',
                        duration: 3000,
                        position: 'top',
                        isClosable: true
                    });
                    return _ctx.abrupt("return");
                case 3:
                    window.history.replaceState(null, '', shareUrl);
                    _ctx.next = 6;
                    return navigator.clipboard.writeText(shareUrl);
                case 6:
                    toast({
                        title: 'URL is copied to clipboard.',
                        status: 'success',
                        duration: 3000,
                        position: 'top',
                        isClosable: true
                    });
                case 7:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    var handleEditorDidMount = function(instance) {
        editorRef.current = instance;
    };
    var handleEditorChange = function(value) {
        if (value != null) {
            setCode(value);
        }
    };
    var language = swcConfig.jsc.parser.syntax === 'ecmascript' ? 'javascript' : 'typescript';
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
        direction: "column",
        width: [
            'full',
            'full',
            '40vw'
        ],
        height: [
            '45vh',
            '45vh',
            'full'
        ],
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
                justifyContent: "space-between",
                alignItems: "center",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(heading/* Heading */.X, {
                        size: "md",
                        mb: "8px",
                        children: "Input"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(stack/* HStack */.Ug, {
                        spacing: "10px",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                size: "xs",
                                leftIcon: /*#__PURE__*/ (0,jsx_runtime.jsx)(cg_index_esm/* CgFileDocument */.K46, {
                                }),
                                as: "a",
                                href: issueReportUrl,
                                target: "_blank",
                                rel: "noopener",
                                children: "Report Issue"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                                size: "xs",
                                leftIcon: /*#__PURE__*/ (0,jsx_runtime.jsx)(cg_index_esm/* CgShare */.b0_, {
                                }),
                                onClick: handleShare,
                                children: "Share"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(box/* Box */.xu, {
                width: "full",
                height: "full",
                borderColor: borderColor,
                borderWidth: "1px",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(es/* default */.ZP, {
                    value: code,
                    language: language,
                    defaultLanguage: "javascript",
                    theme: monacoTheme,
                    options: editorOptions,
                    onMount: handleEditorDidMount,
                    onChange: handleEditorChange
                })
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/OutputEditor.tsx





function OutputEditor_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function OutputEditor_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            OutputEditor_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function isTransformedCode(value) {
    return typeof value.code === 'string';
}
function stringifyOutput(output) {
    if (output.err) {
        return output.val;
    } else if (isTransformedCode(output.val)) {
        return output.val.code;
    } else {
        return JSON.stringify(output.val, null, 2);
    }
}
var OutputEditor_editorOptions = OutputEditor_objectSpread({
}, editorOptions, {
    readOnly: true,
    wordWrap: 'on',
    tabSize: 4
});
function OutputEditor(param) {
    var output = param.output, viewMode = param.viewMode, onViewModeChange = param.onViewModeChange;
    var borderColor = useBorderColor();
    var bg = useBgColor();
    var monacoTheme = useMonacoThemeValue();
    var monaco = (0,es/* useMonaco */.Ik)();
    (0,react.useEffect)(function() {
        monaco === null || monaco === void 0 ? void 0 : monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSyntaxValidation: true,
            noSemanticValidation: true,
            noSuggestionDiagnostics: true
        });
    }, [
        monaco
    ]);
    var handleViewModeChange = function(event) {
        onViewModeChange(event.target.value);
    };
    var outputContent = stringifyOutput(output);
    var editorLanguage = output.err ? 'text' : viewMode === 'code' ? 'javascript' : 'json';
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
        direction: "column",
        width: [
            'full',
            'full',
            '40vw'
        ],
        height: [
            '45vh',
            '45vh',
            'full'
        ],
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
                justifyContent: "space-between",
                alignItems: "center",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(heading/* Heading */.X, {
                        size: "md",
                        mb: "8px",
                        children: "Output"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
                        alignItems: "center",
                        children: [
                            "View:",
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_select/* Select */.Ph, {
                                size: "xs",
                                ml: "1",
                                bg: bg,
                                value: viewMode,
                                onChange: handleViewModeChange,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                        value: "code",
                                        children: "Compiled Code"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                        value: "ast",
                                        children: "AST"
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(box/* Box */.xu, {
                height: "full",
                borderColor: borderColor,
                borderWidth: "1px",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(es/* default */.ZP, {
                    value: outputContent,
                    language: editorLanguage,
                    defaultLanguage: "javascript",
                    path: viewMode === 'code' ? 'output.js' : 'output.json',
                    theme: monacoTheme,
                    options: OutputEditor_editorOptions
                })
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/Workspace.tsx













function Workspace_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function Workspace_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function Workspace_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function Workspace_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Workspace_slicedToArray(arr, i) {
    return Workspace_arrayWithHoles(arr) || Workspace_iterableToArrayLimit(arr, i) || Workspace_unsupportedIterableToArray(arr, i) || Workspace_nonIterableRest();
}
function Workspace_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return Workspace_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Workspace_arrayLikeToArray(o, minLen);
}
function Workspace() {
    var ref = (0,index_esm/* default */.ZP)('monaco', function() {
        return es/* loader.init */._m.init();
    }), monaco = ref.data;
    var ref1 = Workspace_slicedToArray((0,esm/* useAtom */.KO)(swcVersionAtom), 1), swcVersion = ref1[0];
    var ref2 = (0,index_esm/* default */.ZP)(swcVersion, loadSwc), swc = ref2.data, error = ref2.error;
    var ref3 = Workspace_slicedToArray((0,esm/* useAtom */.KO)(codeAtom), 1), code = ref3[0];
    var ref4 = Workspace_slicedToArray((0,esm/* useAtom */.KO)(swcConfigAtom), 1), swcConfig = ref4[0];
    var ref5 = Workspace_slicedToArray((0,esm/* useAtom */.KO)(fileNameAtom), 1), fileName = ref5[0];
    var ref6 = (0,react.useState)('code'), viewMode = ref6[0], setViewMode = ref6[1];
    var output = (0,react.useMemo)(function() {
        if (error) {
            return (0,ts_results_esm/* Err */.UG)(String(error));
        }
        if (!swc) {
            return (0,ts_results_esm/* Err */.UG)('Loading swc...');
        }
        switch(viewMode){
            case 'ast':
                return parse({
                    code: code,
                    config: swcConfig,
                    swc: swc
                });
            case 'code':
            default:
                return transform({
                    code: code,
                    fileName: fileName,
                    config: swcConfig,
                    swc: swc
                });
        }
    }, [
        code,
        fileName,
        swc,
        error,
        swcConfig,
        viewMode
    ]);
    var toast = (0,dist_esm.useToast)();
    (0,react.useEffect)(function() {
        if (error) {
            toast({
                title: 'Failed to load swc.',
                description: String(error),
                status: 'error',
                duration: 5000,
                position: 'top',
                isClosable: true
            });
        }
    }, [
        error,
        toast
    ]);
    var isLoadingMonaco = !monaco;
    if (isLoadingMonaco && !swc) {
        return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(center/* Center */.M, {
            width: "full",
            height: "88vh",
            display: "flex",
            flexDirection: "column",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(circular_progress/* CircularProgress */.D, {
                    isIndeterminate: true,
                    mb: "3"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    children: [
                        "Loading swc ",
                        swcVersion,
                        isLoadingMonaco && ' and editor',
                        "..."
                    ]
                })
            ]
        }));
    }
    if (output.ok === true && viewMode === 'ast') {
        var val = output.val;
        adjustOffsetOfAst(val, val.span.start);
    }
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(stack/* Stack */.Kq, {
        direction: [
            'column',
            'column',
            'row'
        ],
        spacing: "6",
        height: "88vh",
        mt: "3",
        mx: [
            4,
            4,
            8
        ],
        as: "main",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(stack/* VStack */.gC, {
                spacing: "4",
                alignItems: "unset",
                width: [
                    'full',
                    'full',
                    '16vw'
                ],
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Configuration, {
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(VersionSelect, {
                        isLoadingSwc: !swc && !error
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(InputEditor, {
                output: output
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(OutputEditor, {
                output: output,
                viewMode: viewMode,
                onViewModeChange: setViewMode
            })
        ]
    }));
};
function adjustOffsetOfAst(obj, startOffset) {
    if (Array.isArray(obj)) {
        obj.forEach(function(item) {
            return adjustOffsetOfAst(item, startOffset);
        });
    } else if (isRecord(obj)) {
        Object.entries(obj).forEach(function(param) {
            var _param = Workspace_slicedToArray(param, 2), key = _param[0], value = _param[1];
            if (key === 'span' && value && isSpan(value)) {
                var span = value;
                span.start -= startOffset;
                span.end -= startOffset;
            } else {
                adjustOffsetOfAst(obj[key], startOffset);
            }
        });
    }
}
function isRecord(obj) {
    return typeof obj === 'object' && obj !== null;
}
function isSpan(obj) {
    return typeof obj === 'object' && obj !== null && 'start' in obj && 'end' in obj;
}


/***/ })

}]);