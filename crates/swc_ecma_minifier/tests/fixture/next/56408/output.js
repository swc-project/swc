exports.id = 675;
exports.ids = [
    675
];
exports.modules = {
    /***/ 4622: /***/ function(e, t, n) {
        void function(e, t, n) {
            "use strict";
            function r(e) {
                return e && "object" == typeof e && "default" in e ? e : {
                    default: e
                };
            }
            var i = r(t), b = r(n);
            function a(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    t && (i = i.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    })), n.push.apply(n, i);
                }
                return n;
            }
            function c(e) {
                for(var t = 1; t < arguments.length; t++){
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? a(Object(n), !0).forEach(function(t) {
                        u(e, t, n[t]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach(function(t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                    });
                }
                return e;
            }
            function u(e, t, n) {
                return t in e ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = n, e;
            }
            function l(e, t) {
                if (null == e) return {};
                var n, i, b = function(e, t) {
                    if (null == e) return {};
                    var n, i, b = {}, w = Object.keys(e);
                    for(i = 0; i < w.length; i++)n = w[i], t.indexOf(n) >= 0 || (b[n] = e[n]);
                    return b;
                }(e, t);
                if (Object.getOwnPropertySymbols) {
                    var w = Object.getOwnPropertySymbols(e);
                    for(i = 0; i < w.length; i++)n = w[i], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (b[n] = e[n]);
                }
                return b;
            }
            function s(e, t) {
                return function(e) {
                    if (Array.isArray(e)) return e;
                }(e) || function(e, t) {
                    var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                    if (null == n) return;
                    var i, b, w = [], R = !0, T = !1;
                    try {
                        for(n = n.call(e); !(R = (i = n.next()).done) && (w.push(i.value), !t || w.length !== t); R = !0);
                    } catch (e) {
                        T = !0, b = e;
                    } finally{
                        try {
                            R || null == n.return || n.return();
                        } finally{
                            if (T) throw b;
                        }
                    }
                    return w;
                }(e, t) || p(e, t) || function() {
                    throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }();
            }
            function f(e) {
                return function(e) {
                    if (Array.isArray(e)) return d(e);
                }(e) || function(e) {
                    if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e);
                }(e) || p(e) || function() {
                    throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }();
            }
            function p(e, t) {
                if (e) {
                    if ("string" == typeof e) return d(e, t);
                    var n = Object.prototype.toString.call(e).slice(8, -1);
                    return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? d(e, t) : void 0;
                }
            }
            function d(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for(var n = 0, i = Array(t); n < t; n++)i[n] = e[n];
                return i;
            }
            function v(e, t, n, i) {
                return new (n || (n = Promise))(function(b, w) {
                    function a(e) {
                        try {
                            u(i.next(e));
                        } catch (e) {
                            w(e);
                        }
                    }
                    function c(e) {
                        try {
                            u(i.throw(e));
                        } catch (e) {
                            w(e);
                        }
                    }
                    function u(e) {
                        var t;
                        e.done ? b(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
                            e(t);
                        })).then(a, c);
                    }
                    u((i = i.apply(e, t || [])).next());
                });
            }
            function m(e, t) {
                var n, i, b, w, R = {
                    label: 0,
                    sent: function() {
                        if (1 & b[0]) throw b[1];
                        return b[1];
                    },
                    trys: [],
                    ops: []
                };
                return w = {
                    next: c(0),
                    throw: c(1),
                    return: c(2)
                }, "function" == typeof Symbol && (w[Symbol.iterator] = function() {
                    return this;
                }), w;
                function c(w) {
                    return function(T) {
                        return function(w) {
                            if (n) throw TypeError("Generator is already executing.");
                            for(; R;)try {
                                if (n = 1, i && (b = 2 & w[0] ? i.return : w[0] ? i.throw || ((b = i.return) && b.call(i), 0) : i.next) && !(b = b.call(i, w[1])).done) return b;
                                switch(i = 0, b && (w = [
                                    2 & w[0],
                                    b.value
                                ]), w[0]){
                                    case 0:
                                    case 1:
                                        b = w;
                                        break;
                                    case 4:
                                        return R.label++, {
                                            value: w[1],
                                            done: !1
                                        };
                                    case 5:
                                        R.label++, i = w[1], w = [
                                            0
                                        ];
                                        continue;
                                    case 7:
                                        w = R.ops.pop(), R.trys.pop();
                                        continue;
                                    default:
                                        if (b = R.trys, !(b = b.length > 0 && b[b.length - 1]) && (6 === w[0] || 2 === w[0])) {
                                            R = 0;
                                            continue;
                                        }
                                        if (3 === w[0] && (!b || w[1] > b[0] && w[1] < b[3])) {
                                            R.label = w[1];
                                            break;
                                        }
                                        if (6 === w[0] && R.label < b[1]) {
                                            R.label = b[1], b = w;
                                            break;
                                        }
                                        if (b && R.label < b[2]) {
                                            R.label = b[2], R.ops.push(w);
                                            break;
                                        }
                                        b[2] && R.ops.pop(), R.trys.pop();
                                        continue;
                                }
                                w = t.call(e, R);
                            } catch (e) {
                                w = [
                                    6,
                                    e
                                ], i = 0;
                            } finally{
                                n = b = 0;
                            }
                            if (5 & w[0]) throw w[1];
                            return {
                                value: w[0] ? w[1] : void 0,
                                done: !0
                            };
                        }([
                            w,
                            T
                        ]);
                    };
                }
            }
            function g(e, t) {
                var n = "function" == typeof Symbol && e[Symbol.iterator];
                if (!n) return e;
                var i, b, w = n.call(e), R = [];
                try {
                    for(; (void 0 === t || t-- > 0) && !(i = w.next()).done;)R.push(i.value);
                } catch (e) {
                    b = {
                        error: e
                    };
                } finally{
                    try {
                        i && !i.done && (n = w.return) && n.call(w);
                    } finally{
                        if (b) throw b.error;
                    }
                }
                return R;
            }
            function y(e, t, n) {
                if (n || 2 == arguments.length) for(var i, b = 0, w = t.length; b < w; b++)!i && b in t || (i || (i = Array.prototype.slice.call(t, 0, b)), i[b] = t[b]);
                return e.concat(i || Array.prototype.slice.call(t));
            }
            var w = new Map([
                [
                    "aac",
                    "audio/aac"
                ],
                [
                    "abw",
                    "application/x-abiword"
                ],
                [
                    "arc",
                    "application/x-freearc"
                ],
                [
                    "avif",
                    "image/avif"
                ],
                [
                    "avi",
                    "video/x-msvideo"
                ],
                [
                    "azw",
                    "application/vnd.amazon.ebook"
                ],
                [
                    "bin",
                    "application/octet-stream"
                ],
                [
                    "bmp",
                    "image/bmp"
                ],
                [
                    "bz",
                    "application/x-bzip"
                ],
                [
                    "bz2",
                    "application/x-bzip2"
                ],
                [
                    "cda",
                    "application/x-cdf"
                ],
                [
                    "csh",
                    "application/x-csh"
                ],
                [
                    "css",
                    "text/css"
                ],
                [
                    "csv",
                    "text/csv"
                ],
                [
                    "doc",
                    "application/msword"
                ],
                [
                    "docx",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ],
                [
                    "eot",
                    "application/vnd.ms-fontobject"
                ],
                [
                    "epub",
                    "application/epub+zip"
                ],
                [
                    "gz",
                    "application/gzip"
                ],
                [
                    "gif",
                    "image/gif"
                ],
                [
                    "heic",
                    "image/heic"
                ],
                [
                    "heif",
                    "image/heif"
                ],
                [
                    "htm",
                    "text/html"
                ],
                [
                    "html",
                    "text/html"
                ],
                [
                    "ico",
                    "image/vnd.microsoft.icon"
                ],
                [
                    "ics",
                    "text/calendar"
                ],
                [
                    "jar",
                    "application/java-archive"
                ],
                [
                    "jpeg",
                    "image/jpeg"
                ],
                [
                    "jpg",
                    "image/jpeg"
                ],
                [
                    "js",
                    "text/javascript"
                ],
                [
                    "json",
                    "application/json"
                ],
                [
                    "jsonld",
                    "application/ld+json"
                ],
                [
                    "mid",
                    "audio/midi"
                ],
                [
                    "midi",
                    "audio/midi"
                ],
                [
                    "mjs",
                    "text/javascript"
                ],
                [
                    "mp3",
                    "audio/mpeg"
                ],
                [
                    "mp4",
                    "video/mp4"
                ],
                [
                    "mpeg",
                    "video/mpeg"
                ],
                [
                    "mpkg",
                    "application/vnd.apple.installer+xml"
                ],
                [
                    "odp",
                    "application/vnd.oasis.opendocument.presentation"
                ],
                [
                    "ods",
                    "application/vnd.oasis.opendocument.spreadsheet"
                ],
                [
                    "odt",
                    "application/vnd.oasis.opendocument.text"
                ],
                [
                    "oga",
                    "audio/ogg"
                ],
                [
                    "ogv",
                    "video/ogg"
                ],
                [
                    "ogx",
                    "application/ogg"
                ],
                [
                    "opus",
                    "audio/opus"
                ],
                [
                    "otf",
                    "font/otf"
                ],
                [
                    "png",
                    "image/png"
                ],
                [
                    "pdf",
                    "application/pdf"
                ],
                [
                    "php",
                    "application/x-httpd-php"
                ],
                [
                    "ppt",
                    "application/vnd.ms-powerpoint"
                ],
                [
                    "pptx",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                ],
                [
                    "rar",
                    "application/vnd.rar"
                ],
                [
                    "rtf",
                    "application/rtf"
                ],
                [
                    "sh",
                    "application/x-sh"
                ],
                [
                    "svg",
                    "image/svg+xml"
                ],
                [
                    "swf",
                    "application/x-shockwave-flash"
                ],
                [
                    "tar",
                    "application/x-tar"
                ],
                [
                    "tif",
                    "image/tiff"
                ],
                [
                    "tiff",
                    "image/tiff"
                ],
                [
                    "ts",
                    "video/mp2t"
                ],
                [
                    "ttf",
                    "font/ttf"
                ],
                [
                    "txt",
                    "text/plain"
                ],
                [
                    "vsd",
                    "application/vnd.visio"
                ],
                [
                    "wav",
                    "audio/wav"
                ],
                [
                    "weba",
                    "audio/webm"
                ],
                [
                    "webm",
                    "video/webm"
                ],
                [
                    "webp",
                    "image/webp"
                ],
                [
                    "woff",
                    "font/woff"
                ],
                [
                    "woff2",
                    "font/woff2"
                ],
                [
                    "xhtml",
                    "application/xhtml+xml"
                ],
                [
                    "xls",
                    "application/vnd.ms-excel"
                ],
                [
                    "xlsx",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ],
                [
                    "xml",
                    "application/xml"
                ],
                [
                    "xul",
                    "application/vnd.mozilla.xul+xml"
                ],
                [
                    "zip",
                    "application/zip"
                ],
                [
                    "7z",
                    "application/x-7z-compressed"
                ],
                [
                    "mkv",
                    "video/x-matroska"
                ],
                [
                    "mov",
                    "video/quicktime"
                ],
                [
                    "msg",
                    "application/vnd.ms-outlook"
                ]
            ]);
            function h(e, t) {
                var n = function(e) {
                    var t = e.name;
                    if (t && -1 !== t.lastIndexOf(".") && !e.type) {
                        var n = t.split(".").pop().toLowerCase(), i = w.get(n);
                        i && Object.defineProperty(e, "type", {
                            value: i,
                            writable: !1,
                            configurable: !1,
                            enumerable: !0
                        });
                    }
                    return e;
                }(e);
                if ("string" != typeof n.path) {
                    var i = e.webkitRelativePath;
                    Object.defineProperty(n, "path", {
                        value: "string" == typeof t ? t : "string" == typeof i && i.length > 0 ? i : e.name,
                        writable: !1,
                        configurable: !1,
                        enumerable: !0
                    });
                }
                return n;
            }
            var R = [
                ".DS_Store",
                "Thumbs.db"
            ];
            function D(e) {
                return "object" == typeof e && null !== e;
            }
            function x(e) {
                return O(e.target.files).map(function(e) {
                    return h(e);
                });
            }
            function F(e) {
                return v(this, void 0, void 0, function() {
                    return m(this, function(t) {
                        switch(t.label){
                            case 0:
                                return [
                                    4,
                                    Promise.all(e.map(function(e) {
                                        return e.getFile();
                                    }))
                                ];
                            case 1:
                                return [
                                    2,
                                    t.sent().map(function(e) {
                                        return h(e);
                                    })
                                ];
                        }
                    });
                });
            }
            function j(e, t) {
                return v(this, void 0, void 0, function() {
                    var n;
                    return m(this, function(i) {
                        switch(i.label){
                            case 0:
                                return e.items ? (n = O(e.items).filter(function(e) {
                                    return "file" === e.kind;
                                }), "drop" !== t ? [
                                    2,
                                    n
                                ] : [
                                    4,
                                    Promise.all(n.map(E))
                                ]) : [
                                    3,
                                    2
                                ];
                            case 1:
                                return [
                                    2,
                                    A(k(i.sent()))
                                ];
                            case 2:
                                return [
                                    2,
                                    A(O(e.files).map(function(e) {
                                        return h(e);
                                    }))
                                ];
                        }
                    });
                });
            }
            function A(e) {
                return e.filter(function(e) {
                    return -1 === R.indexOf(e.name);
                });
            }
            function O(e) {
                if (null === e) return [];
                for(var t = [], n = 0; n < e.length; n++){
                    var i = e[n];
                    t.push(i);
                }
                return t;
            }
            function E(e) {
                if ("function" != typeof e.webkitGetAsEntry) return P(e);
                var t = e.webkitGetAsEntry();
                return t && t.isDirectory ? C(t) : P(e);
            }
            function k(e) {
                return e.reduce(function(e, t) {
                    return y(y([], g(e), !1), g(Array.isArray(t) ? k(t) : [
                        t
                    ]), !1);
                }, []);
            }
            function P(e) {
                var t = e.getAsFile();
                if (!t) return Promise.reject("".concat(e, " is not a File"));
                return Promise.resolve(h(t));
            }
            function S(e) {
                return v(this, void 0, void 0, function() {
                    return m(this, function(t) {
                        return [
                            2,
                            e.isDirectory ? C(e) : z(e)
                        ];
                    });
                });
            }
            function C(e) {
                var t = e.createReader();
                return new Promise(function(e, n) {
                    var i = [];
                    !function o() {
                        var b = this;
                        t.readEntries(function(t) {
                            return v(b, void 0, void 0, function() {
                                var b, w, R;
                                return m(this, function(T) {
                                    switch(T.label){
                                        case 0:
                                            if (t.length) return [
                                                3,
                                                5
                                            ];
                                            T.label = 1;
                                        case 1:
                                            return T.trys.push([
                                                1,
                                                3,
                                                ,
                                                4
                                            ]), [
                                                4,
                                                Promise.all(i)
                                            ];
                                        case 2:
                                            return b = T.sent(), e(b), [
                                                3,
                                                4
                                            ];
                                        case 3:
                                            return w = T.sent(), n(w), [
                                                3,
                                                4
                                            ];
                                        case 4:
                                            return [
                                                3,
                                                6
                                            ];
                                        case 5:
                                            R = Promise.all(t.map(S)), i.push(R), o(), T.label = 6;
                                        case 6:
                                            return [
                                                2
                                            ];
                                    }
                                });
                            });
                        }, function(e) {
                            n(e);
                        });
                    }();
                });
            }
            function z(e) {
                return v(this, void 0, void 0, function() {
                    return m(this, function(t) {
                        return [
                            2,
                            new Promise(function(t, n) {
                                e.file(function(n) {
                                    t(h(n, e.fullPath));
                                }, function(e) {
                                    n(e);
                                });
                            })
                        ];
                    });
                });
            }
            var T = "file-invalid-type", I = "file-too-large", M = "file-too-small", L = "too-many-files", _ = function(e) {
                var t = Array.isArray(e = Array.isArray(e) && 1 === e.length ? e[0] : e) ? "one of ".concat(e.join(", ")) : e;
                return {
                    code: T,
                    message: "File type must be ".concat(t)
                };
            }, B = function(e) {
                return {
                    code: I,
                    message: "File is larger than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                };
            }, K = function(e) {
                return {
                    code: M,
                    message: "File is smaller than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                };
            }, q = {
                code: L,
                message: "Too many files"
            };
            function U(e, t) {
                var n = "application/x-moz-file" === e.type || function(e, t) {
                    if (e && t) {
                        var n = Array.isArray(t) ? t : t.split(","), i = e.name || "", b = (e.type || "").toLowerCase(), w = b.replace(/\/.*$/, "");
                        return n.some(function(e) {
                            var t = e.trim().toLowerCase();
                            return "." === t.charAt(0) ? i.toLowerCase().endsWith(t) : t.endsWith("/*") ? w === t.replace(/\/.*$/, "") : b === t;
                        });
                    }
                    return !0;
                }(e, t);
                return [
                    n,
                    n ? null : _(t)
                ];
            }
            function W(e, t, n) {
                if ($(e.size)) if ($(t) && $(n)) {
                    if (e.size > n) return [
                        !1,
                        B(n)
                    ];
                    if (e.size < t) return [
                        !1,
                        K(t)
                    ];
                } else {
                    if ($(t) && e.size < t) return [
                        !1,
                        K(t)
                    ];
                    if ($(n) && e.size > n) return [
                        !1,
                        B(n)
                    ];
                }
                return [
                    !0,
                    null
                ];
            }
            function $(e) {
                return null != e;
            }
            function G(e) {
                var t = e.files, n = e.accept, i = e.minSize, b = e.maxSize, w = e.multiple, R = e.maxFiles, T = e.validator;
                return !(!w && t.length > 1 || w && R >= 1 && t.length > R) && t.every(function(e) {
                    var t = s(U(e, n), 1)[0], w = s(W(e, i, b), 1)[0], R = T ? T(e) : null;
                    return t && w && !R;
                });
            }
            function H(e) {
                return "function" == typeof e.isPropagationStopped ? e.isPropagationStopped() : void 0 !== e.cancelBubble && e.cancelBubble;
            }
            function N(e) {
                return e.dataTransfer ? Array.prototype.some.call(e.dataTransfer.types, function(e) {
                    return "Files" === e || "application/x-moz-file" === e;
                }) : !!e.target && !!e.target.files;
            }
            function Y(e) {
                e.preventDefault();
            }
            function J(e) {
                return -1 !== e.indexOf("MSIE") || -1 !== e.indexOf("Trident/");
            }
            function Q(e) {
                return -1 !== e.indexOf("Edge/");
            }
            function V() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.navigator.userAgent;
                return J(e) || Q(e);
            }
            function X() {
                for(var e = arguments.length, t = Array(e), n = 0; n < e; n++)t[n] = arguments[n];
                return function(e) {
                    for(var n = arguments.length, i = Array(n > 1 ? n - 1 : 0), b = 1; b < n; b++)i[b - 1] = arguments[b];
                    return t.some(function(t) {
                        return !H(e) && t && t.apply(void 0, [
                            e
                        ].concat(i)), H(e);
                    });
                };
            }
            function Z() {
                return "showOpenFilePicker" in window;
            }
            function ee(e) {
                return $(e) ? [
                    {
                        description: "Files",
                        accept: Object.entries(e).filter(function(e) {
                            var t = s(e, 2), n = t[0], i = t[1], b = !0;
                            return oe(n) || (console.warn('Skipped "'.concat(n, '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')), b = !1), Array.isArray(i) && i.every(ie) || (console.warn('Skipped "'.concat(n, '" because an invalid file extension was provided.')), b = !1), b;
                        }).reduce(function(e, t) {
                            var n = s(t, 2), i = n[0], b = n[1];
                            return c(c({}, e), {}, u({}, i, b));
                        }, {})
                    }
                ] : e;
            }
            function te(e) {
                if ($(e)) return Object.entries(e).reduce(function(e, t) {
                    var n = s(t, 2), i = n[0], b = n[1];
                    return [].concat(f(e), [
                        i
                    ], f(b));
                }, []).filter(function(e) {
                    return oe(e) || ie(e);
                }).join(",");
            }
            function ne(e) {
                return e instanceof DOMException && ("AbortError" === e.name || e.code === e.ABORT_ERR);
            }
            function re(e) {
                return e instanceof DOMException && ("SecurityError" === e.name || e.code === e.SECURITY_ERR);
            }
            function oe(e) {
                return "audio/*" === e || "video/*" === e || "image/*" === e || "text/*" === e || /\w+\/[-+.\w]+/g.test(e);
            }
            function ie(e) {
                return /^.*\.[\w]+$/.test(e);
            }
            var et = [
                "children"
            ], en = [
                "open"
            ], er = [
                "refKey",
                "role",
                "onKeyDown",
                "onFocus",
                "onBlur",
                "onClick",
                "onDragEnter",
                "onDragOver",
                "onDragLeave",
                "onDrop"
            ], eo = [
                "refKey",
                "onChange",
                "onClick"
            ], ei = t.forwardRef(function(e, n) {
                var b = e.children, w = de(l(e, et)), R = w.open, T = l(w, en);
                return t.useImperativeHandle(n, function() {
                    return {
                        open: R
                    };
                }, [
                    R
                ]), i.default.createElement(t.Fragment, null, b(c(c({}, T), {}, {
                    open: R
                })));
            });
            ei.displayName = "Dropzone";
            var ea = {
                disabled: !1,
                getFilesFromEvent: function(e) {
                    return v(this, void 0, void 0, function() {
                        return m(this, function(t) {
                            return D(e) && D(e.dataTransfer) ? [
                                2,
                                j(e.dataTransfer, e.type)
                            ] : D(e) && D(e.target) ? [
                                2,
                                x(e)
                            ] : Array.isArray(e) && e.every(function(e) {
                                return "getFile" in e && "function" == typeof e.getFile;
                            }) ? [
                                2,
                                F(e)
                            ] : [
                                2,
                                []
                            ];
                        });
                    });
                },
                maxSize: 1 / 0,
                minSize: 0,
                multiple: !0,
                maxFiles: 0,
                preventDropOnDocument: !0,
                noClick: !1,
                noKeyboard: !1,
                noDrag: !1,
                noDragEventsBubbling: !1,
                validator: null,
                useFsAccessApi: !0,
                autoFocus: !1
            };
            ei.defaultProps = ea, ei.propTypes = {
                children: b.default.func,
                accept: b.default.objectOf(b.default.arrayOf(b.default.string)),
                multiple: b.default.bool,
                preventDropOnDocument: b.default.bool,
                noClick: b.default.bool,
                noKeyboard: b.default.bool,
                noDrag: b.default.bool,
                noDragEventsBubbling: b.default.bool,
                minSize: b.default.number,
                maxSize: b.default.number,
                maxFiles: b.default.number,
                disabled: b.default.bool,
                getFilesFromEvent: b.default.func,
                onFileDialogCancel: b.default.func,
                onFileDialogOpen: b.default.func,
                useFsAccessApi: b.default.bool,
                autoFocus: b.default.bool,
                onDragEnter: b.default.func,
                onDragLeave: b.default.func,
                onDragOver: b.default.func,
                onDrop: b.default.func,
                onDropAccepted: b.default.func,
                onDropRejected: b.default.func,
                onError: b.default.func,
                validator: b.default.func
            };
            var ec = {
                isFocused: !1,
                isFileDialogActive: !1,
                isDragActive: !1,
                isDragAccept: !1,
                isDragReject: !1,
                acceptedFiles: [],
                fileRejections: []
            };
            function de() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = c(c({}, ea), e), i = n.accept, b = n.disabled, w = n.getFilesFromEvent, R = n.maxSize, T = n.minSize, I = n.multiple, M = n.maxFiles, L = n.onDragEnter, et = n.onDragLeave, en = n.onDragOver, ei = n.onDrop, eu = n.onDropAccepted, el = n.onDropRejected, es = n.onFileDialogCancel, ef = n.onFileDialogOpen, ep = n.useFsAccessApi, ed = n.autoFocus, ev = n.preventDropOnDocument, em = n.noClick, eg = n.noKeyboard, ey = n.noDrag, eb = n.noDragEventsBubbling, eh = n.onError, eD = n.validator, ew = t.useMemo(function() {
                    return te(i);
                }, [
                    i
                ]), ex = t.useMemo(function() {
                    return ee(i);
                }, [
                    i
                ]), eA = t.useMemo(function() {
                    return "function" == typeof ef ? ef : me;
                }, [
                    ef
                ]), eO = t.useMemo(function() {
                    return "function" == typeof es ? es : me;
                }, [
                    es
                ]), eF = t.useRef(null), ej = t.useRef(null), ek = s(t.useReducer(ve, ec), 2), eE = ek[0], eP = ek[1], eC = eE.isFocused, eS = eE.isFileDialogActive, ez = t.useRef("undefined" != typeof window && window.isSecureContext && ep && Z()), ie = function() {
                    !ez.current && eS && setTimeout(function() {
                        ej.current && (ej.current.files.length || (eP({
                            type: "closeDialog"
                        }), eO()));
                    }, 300);
                };
                t.useEffect(function() {
                    return window.addEventListener("focus", ie, !1), function() {
                        window.removeEventListener("focus", ie, !1);
                    };
                }, [
                    ej,
                    eS,
                    eO,
                    ez
                ]);
                var eR = t.useRef([]), ce = function(e) {
                    eF.current && eF.current.contains(e.target) || (e.preventDefault(), eR.current = []);
                };
                t.useEffect(function() {
                    return ev && (document.addEventListener("dragover", Y, !1), document.addEventListener("drop", ce, !1)), function() {
                        ev && (document.removeEventListener("dragover", Y), document.removeEventListener("drop", ce));
                    };
                }, [
                    eF,
                    ev
                ]), t.useEffect(function() {
                    return !b && ed && eF.current && eF.current.focus(), function() {};
                }, [
                    eF,
                    ed,
                    b
                ]);
                var eT = t.useCallback(function(e) {
                    eh ? eh(e) : console.error(e);
                }, [
                    eh
                ]), eI = t.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e), eR.current = [].concat(f(eR.current), [
                        e.target
                    ]), N(e) && Promise.resolve(w(e)).then(function(t) {
                        if (!H(e) || eb) {
                            var n = t.length, i = n > 0 && G({
                                files: t,
                                accept: ew,
                                minSize: T,
                                maxSize: R,
                                multiple: I,
                                maxFiles: M,
                                validator: eD
                            });
                            eP({
                                isDragAccept: i,
                                isDragReject: n > 0 && !i,
                                isDragActive: !0,
                                type: "setDraggedFiles"
                            }), L && L(e);
                        }
                    }).catch(function(e) {
                        return eT(e);
                    });
                }, [
                    w,
                    L,
                    eT,
                    eb,
                    ew,
                    T,
                    R,
                    I,
                    M,
                    eD
                ]), eM = t.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e);
                    var t = N(e);
                    if (t && e.dataTransfer) try {
                        e.dataTransfer.dropEffect = "copy";
                    } catch (e) {}
                    return t && en && en(e), !1;
                }, [
                    en,
                    eb
                ]), eL = t.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e);
                    var t = eR.current.filter(function(e) {
                        return eF.current && eF.current.contains(e);
                    }), n = t.indexOf(e.target);
                    -1 !== n && t.splice(n, 1), eR.current = t, t.length > 0 || (eP({
                        type: "setDraggedFiles",
                        isDragActive: !1,
                        isDragAccept: !1,
                        isDragReject: !1
                    }), N(e) && et && et(e));
                }, [
                    eF,
                    et,
                    eb
                ]), e_ = t.useCallback(function(e, t) {
                    var n = [], i = [];
                    e.forEach(function(e) {
                        var t = s(U(e, ew), 2), b = t[0], w = t[1], I = s(W(e, T, R), 2), M = I[0], L = I[1], q = eD ? eD(e) : null;
                        if (b && M && !q) n.push(e);
                        else {
                            var et = [
                                w,
                                L
                            ];
                            q && (et = et.concat(q)), i.push({
                                file: e,
                                errors: et.filter(function(e) {
                                    return e;
                                })
                            });
                        }
                    }), (!I && n.length > 1 || I && M >= 1 && n.length > M) && (n.forEach(function(e) {
                        i.push({
                            file: e,
                            errors: [
                                q
                            ]
                        });
                    }), n.splice(0)), eP({
                        acceptedFiles: n,
                        fileRejections: i,
                        type: "setFiles"
                    }), ei && ei(n, i, t), i.length > 0 && el && el(i, t), n.length > 0 && eu && eu(n, t);
                }, [
                    eP,
                    I,
                    ew,
                    T,
                    R,
                    M,
                    ei,
                    eu,
                    el,
                    eD
                ]), eB = t.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e), eR.current = [], N(e) && Promise.resolve(w(e)).then(function(t) {
                        H(e) && !eb || e_(t, e);
                    }).catch(function(e) {
                        return eT(e);
                    }), eP({
                        type: "reset"
                    });
                }, [
                    w,
                    e_,
                    eT,
                    eb
                ]), eK = t.useCallback(function() {
                    if (ez.current) {
                        eP({
                            type: "openDialog"
                        }), eA();
                        window.showOpenFilePicker({
                            multiple: I,
                            types: ex
                        }).then(function(e) {
                            return w(e);
                        }).then(function(e) {
                            e_(e, null), eP({
                                type: "closeDialog"
                            });
                        }).catch(function(e) {
                            ne(e) ? (eO(e), eP({
                                type: "closeDialog"
                            })) : re(e) ? (ez.current = !1, ej.current ? (ej.current.value = null, ej.current.click()) : eT(Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))) : eT(e);
                        });
                    } else ej.current && (eP({
                        type: "openDialog"
                    }), eA(), ej.current.value = null, ej.current.click());
                }, [
                    eP,
                    eA,
                    eO,
                    ep,
                    e_,
                    eT,
                    ex,
                    I
                ]), e$ = t.useCallback(function(e) {
                    eF.current && eF.current.isEqualNode(e.target) && (" " !== e.key && "Enter" !== e.key && 32 !== e.keyCode && 13 !== e.keyCode || (e.preventDefault(), eK()));
                }, [
                    eF,
                    eK
                ]), eX = t.useCallback(function() {
                    eP({
                        type: "focus"
                    });
                }, []), eH = t.useCallback(function() {
                    eP({
                        type: "blur"
                    });
                }, []), eN = t.useCallback(function() {
                    em || (V() ? setTimeout(eK, 0) : eK());
                }, [
                    em,
                    eK
                ]), Ae = function(e) {
                    return b ? null : e;
                }, Oe = function(e) {
                    return eg ? null : Ae(e);
                }, Ee = function(e) {
                    return ey ? null : Ae(e);
                }, ke = function(e) {
                    eb && e.stopPropagation();
                }, eU = t.useMemo(function() {
                    return function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.refKey, n = e.role, i = e.onKeyDown, w = e.onFocus, R = e.onBlur, T = e.onClick, I = e.onDragEnter, M = e.onDragOver, L = e.onDragLeave, q = e.onDrop, et = l(e, er);
                        return c(c(u({
                            onKeyDown: Oe(X(i, e$)),
                            onFocus: Oe(X(w, eX)),
                            onBlur: Oe(X(R, eH)),
                            onClick: Ae(X(T, eN)),
                            onDragEnter: Ee(X(I, eI)),
                            onDragOver: Ee(X(M, eM)),
                            onDragLeave: Ee(X(L, eL)),
                            onDrop: Ee(X(q, eB)),
                            role: "string" == typeof n && "" !== n ? n : "presentation"
                        }, void 0 === t ? "ref" : t, eF), b || eg ? {} : {
                            tabIndex: 0
                        }), et);
                    };
                }, [
                    eF,
                    e$,
                    eX,
                    eH,
                    eN,
                    eI,
                    eM,
                    eL,
                    eB,
                    eg,
                    ey,
                    b
                ]), eW = t.useCallback(function(e) {
                    e.stopPropagation();
                }, []), eG = t.useMemo(function() {
                    return function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.refKey, n = e.onChange, i = e.onClick, b = l(e, eo);
                        return c(c({}, u({
                            accept: ew,
                            multiple: I,
                            type: "file",
                            style: {
                                display: "none"
                            },
                            onChange: Ae(X(n, eB)),
                            onClick: Ae(X(i, eW)),
                            tabIndex: -1
                        }, void 0 === t ? "ref" : t, ej)), b);
                    };
                }, [
                    ej,
                    i,
                    I,
                    eB,
                    b
                ]);
                return c(c({}, eE), {}, {
                    isFocused: eC && !b,
                    getRootProps: eU,
                    getInputProps: eG,
                    rootRef: eF,
                    inputRef: ej,
                    open: Ae(eK)
                });
            }
            function ve(e, t) {
                switch(t.type){
                    case "focus":
                        return c(c({}, e), {}, {
                            isFocused: !0
                        });
                    case "blur":
                        return c(c({}, e), {}, {
                            isFocused: !1
                        });
                    case "openDialog":
                        return c(c({}, ec), {}, {
                            isFileDialogActive: !0
                        });
                    case "closeDialog":
                        return c(c({}, e), {}, {
                            isFileDialogActive: !1
                        });
                    case "setDraggedFiles":
                        return c(c({}, e), {}, {
                            isDragActive: t.isDragActive,
                            isDragAccept: t.isDragAccept,
                            isDragReject: t.isDragReject
                        });
                    case "setFiles":
                        return c(c({}, e), {}, {
                            acceptedFiles: t.acceptedFiles,
                            fileRejections: t.fileRejections
                        });
                    case "reset":
                        return c({}, ec);
                    default:
                        return e;
                }
            }
            function me() {}
            e.ErrorCode = {
                FileInvalidType: T,
                FileTooLarge: I,
                FileTooSmall: M,
                TooManyFiles: L
            }, e.default = ei, e.useDropzone = de, Object.defineProperty(e, "__esModule", {
                value: !0
            });
        }(t, n(9885), n(5601));
    /***/ }
};
