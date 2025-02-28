exports.id = 675;
exports.ids = [
    675
];
exports.modules = {
    /***/ 4622: /***/ function(n, t, e) {
        void function(t, i, w) {
            "use strict";
            function r(e) {
                return e && "object" == typeof e && "default" in e ? e : {
                    default: e
                };
            }
            var L = r(i), e = r(w);
            function a(e, n) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    n && (i = i.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    })), t.push.apply(t, i);
                }
                return t;
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
                var i, b, n = function(e, n) {
                    if (null == e) return {};
                    var i, b, t = {}, w = Object.keys(e);
                    for(b = 0; b < w.length; b++)i = w[b], n.indexOf(i) >= 0 || (t[i] = e[i]);
                    return t;
                }(e, t);
                if (Object.getOwnPropertySymbols) {
                    var w = Object.getOwnPropertySymbols(e);
                    for(b = 0; b < w.length; b++)i = w[b], t.indexOf(i) >= 0 || Object.prototype.propertyIsEnumerable.call(e, i) && (n[i] = e[i]);
                }
                return n;
            }
            function s(e, t) {
                return function(e) {
                    if (Array.isArray(e)) return e;
                }(e) || function(e, i) {
                    var t = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                    if (null == t) return;
                    var b, w, n = [], R = !0, T = !1;
                    try {
                        for(t = t.call(e); !(R = (b = t.next()).done) && (n.push(b.value), !i || n.length !== i); R = !0);
                    } catch (e) {
                        T = !0, w = e;
                    } finally{
                        try {
                            R || null == t.return || t.return();
                        } finally{
                            if (T) throw w;
                        }
                    }
                    return n;
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
            function d(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for(var i = 0, n = Array(e); i < e; i++)n[i] = t[i];
                return n;
            }
            function v(t, n, e, i) {
                return new (e || (e = Promise))(function(b, w) {
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
                    function u(t) {
                        var n;
                        t.done ? b(t.value) : (n = t.value, n instanceof e ? n : new e(function(e) {
                            e(n);
                        })).then(a, c);
                    }
                    u((i = i.apply(t, n || [])).next());
                });
            }
            function m(t, n) {
                var i, b, w, e, R = {
                    label: 0,
                    sent: function() {
                        if (1 & w[0]) throw w[1];
                        return w[1];
                    },
                    trys: [],
                    ops: []
                };
                return e = {
                    next: c(0),
                    throw: c(1),
                    return: c(2)
                }, "function" == typeof Symbol && (e[Symbol.iterator] = function() {
                    return this;
                }), e;
                function c(e) {
                    return function(T) {
                        return function(e) {
                            if (i) throw TypeError("Generator is already executing.");
                            for(; R;)try {
                                if (i = 1, b && (w = 2 & e[0] ? b.return : e[0] ? b.throw || ((w = b.return) && w.call(b), 0) : b.next) && !(w = w.call(b, e[1])).done) return w;
                                switch(b = 0, w && (e = [
                                    2 & e[0],
                                    w.value
                                ]), e[0]){
                                    case 0:
                                    case 1:
                                        w = e;
                                        break;
                                    case 4:
                                        return R.label++, {
                                            value: e[1],
                                            done: !1
                                        };
                                    case 5:
                                        R.label++, b = e[1], e = [
                                            0
                                        ];
                                        continue;
                                    case 7:
                                        e = R.ops.pop(), R.trys.pop();
                                        continue;
                                    default:
                                        if (w = R.trys, !(w = w.length > 0 && w[w.length - 1]) && (6 === e[0] || 2 === e[0])) {
                                            R = 0;
                                            continue;
                                        }
                                        if (3 === e[0] && (!w || e[1] > w[0] && e[1] < w[3])) {
                                            R.label = e[1];
                                            break;
                                        }
                                        if (6 === e[0] && R.label < w[1]) {
                                            R.label = w[1], w = e;
                                            break;
                                        }
                                        if (w && R.label < w[2]) {
                                            R.label = w[2], R.ops.push(e);
                                            break;
                                        }
                                        w[2] && R.ops.pop(), R.trys.pop();
                                        continue;
                                }
                                e = n.call(t, R);
                            } catch (t) {
                                e = [
                                    6,
                                    t
                                ], b = 0;
                            } finally{
                                i = w = 0;
                            }
                            if (5 & e[0]) throw e[1];
                            return {
                                value: e[0] ? e[1] : void 0,
                                done: !0
                            };
                        }([
                            e,
                            T
                        ]);
                    };
                }
            }
            function g(e, i) {
                var t = "function" == typeof Symbol && e[Symbol.iterator];
                if (!t) return e;
                var b, w, R = t.call(e), n = [];
                try {
                    for(; (void 0 === i || i-- > 0) && !(b = R.next()).done;)n.push(b.value);
                } catch (e) {
                    w = {
                        error: e
                    };
                } finally{
                    try {
                        b && !b.done && (t = R.return) && t.call(R);
                    } finally{
                        if (w) throw w.error;
                    }
                }
                return n;
            }
            function y(e, t, n) {
                if (n || 2 == arguments.length) for(var i, b = 0, w = t.length; b < w; b++)!i && b in t || (i || (i = Array.prototype.slice.call(t, 0, b)), i[b] = t[b]);
                return e.concat(i || Array.prototype.slice.call(t));
            }
            var q = new Map([
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
            function h(t, n) {
                var e = function(e) {
                    var t = e.name;
                    if (t && -1 !== t.lastIndexOf(".") && !e.type) {
                        var n = t.split(".").pop().toLowerCase(), i = q.get(n);
                        i && Object.defineProperty(e, "type", {
                            value: i,
                            writable: !1,
                            configurable: !1,
                            enumerable: !0
                        });
                    }
                    return e;
                }(t);
                if ("string" != typeof e.path) {
                    var i = t.webkitRelativePath;
                    Object.defineProperty(e, "path", {
                        value: "string" == typeof n ? n : "string" == typeof i && i.length > 0 ? i : t.name,
                        writable: !1,
                        configurable: !1,
                        enumerable: !0
                    });
                }
                return e;
            }
            var et = [
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
                    return -1 === et.indexOf(e.name);
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
                return e.reduce(function(t, e) {
                    return y(y([], g(t), !1), g(Array.isArray(e) ? k(e) : [
                        e
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
            var R = "file-invalid-type", T = "file-too-large", I = "file-too-small", b = "too-many-files", _ = function(e) {
                var t = Array.isArray(e = Array.isArray(e) && 1 === e.length ? e[0] : e) ? "one of ".concat(e.join(", ")) : e;
                return {
                    code: R,
                    message: "File type must be ".concat(t)
                };
            }, B = function(e) {
                return {
                    code: T,
                    message: "File is larger than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                };
            }, K = function(e) {
                return {
                    code: I,
                    message: "File is smaller than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                };
            }, en = {
                code: b,
                message: "Too many files"
            };
            function U(e, t) {
                var n = "application/x-moz-file" === e.type || function(e, t) {
                    if (e && t) {
                        var n = Array.isArray(t) ? t : t.split(","), i = e.name || "", b = (e.type || "").toLowerCase(), w = b.replace(/\/.*$/, "");
                        return n.some(function(t) {
                            var e = t.trim().toLowerCase();
                            return "." === e.charAt(0) ? i.toLowerCase().endsWith(e) : e.endsWith("/*") ? w === e.replace(/\/.*$/, "") : b === e;
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
                var t = e.files, b = e.accept, w = e.minSize, R = e.maxSize, n = e.multiple, i = e.maxFiles, T = e.validator;
                return !(!n && t.length > 1 || n && i >= 1 && t.length > i) && t.every(function(e) {
                    var t = s(U(e, b), 1)[0], n = s(W(e, w, R), 1)[0], i = T ? T(e) : null;
                    return t && n && !i;
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
                        accept: Object.entries(e).filter(function(b) {
                            var n = s(b, 2), e = n[0], i = n[1], t = !0;
                            return oe(e) || (console.warn('Skipped "'.concat(e, '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')), t = !1), Array.isArray(i) && i.every(ie) || (console.warn('Skipped "'.concat(e, '" because an invalid file extension was provided.')), t = !1), t;
                        }).reduce(function(t, n) {
                            var e = s(n, 2), i = e[0], b = e[1];
                            return c(c({}, t), {}, u({}, i, b));
                        }, {})
                    }
                ] : e;
            }
            function te(e) {
                if ($(e)) return Object.entries(e).reduce(function(t, n) {
                    var e = s(n, 2), i = e[0], b = e[1];
                    return [].concat(f(t), [
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
            var er = [
                "children"
            ], eo = [
                "open"
            ], ei = [
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
            ], ea = [
                "refKey",
                "onChange",
                "onClick"
            ], n = i.forwardRef(function(e, b) {
                var w = e.children, t = de(l(e, er)), n = t.open, R = l(t, eo);
                return i.useImperativeHandle(b, function() {
                    return {
                        open: n
                    };
                }, [
                    n
                ]), L.default.createElement(i.Fragment, null, w(c(c({}, R), {}, {
                    open: n
                })));
            });
            n.displayName = "Dropzone";
            var M = {
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
            n.defaultProps = M, n.propTypes = {
                children: e.default.func,
                accept: e.default.objectOf(e.default.arrayOf(e.default.string)),
                multiple: e.default.bool,
                preventDropOnDocument: e.default.bool,
                noClick: e.default.bool,
                noKeyboard: e.default.bool,
                noDrag: e.default.bool,
                noDragEventsBubbling: e.default.bool,
                minSize: e.default.number,
                maxSize: e.default.number,
                maxFiles: e.default.number,
                disabled: e.default.bool,
                getFilesFromEvent: e.default.func,
                onFileDialogCancel: e.default.func,
                onFileDialogOpen: e.default.func,
                useFsAccessApi: e.default.bool,
                autoFocus: e.default.bool,
                onDragEnter: e.default.func,
                onDragLeave: e.default.func,
                onDragOver: e.default.func,
                onDrop: e.default.func,
                onDropAccepted: e.default.func,
                onDropRejected: e.default.func,
                onError: e.default.func,
                validator: e.default.func
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
                var ey = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = c(c({}, M), ey), R = e.accept, n = e.disabled, et = e.getFilesFromEvent, er = e.maxSize, eo = e.minSize, b = e.multiple, eu = e.maxFiles, eb = e.onDragEnter, eh = e.onDragLeave, eD = e.onDragOver, ew = e.onDrop, ex = e.onDropAccepted, eA = e.onDropRejected, eO = e.onFileDialogCancel, eF = e.onFileDialogOpen, el = e.useFsAccessApi, ej = e.autoFocus, ek = e.preventDropOnDocument, eE = e.noClick, eP = e.noKeyboard, eC = e.noDrag, w = e.noDragEventsBubbling, eS = e.onError, es = e.validator, ef = i.useMemo(function() {
                    return te(R);
                }, [
                    R
                ]), ez = i.useMemo(function() {
                    return ee(R);
                }, [
                    R
                ]), eR = i.useMemo(function() {
                    return "function" == typeof eF ? eF : me;
                }, [
                    eF
                ]), ep = i.useMemo(function() {
                    return "function" == typeof eO ? eO : me;
                }, [
                    eO
                ]), t = i.useRef(null), T = i.useRef(null), ed = s(i.useReducer(ve, ec), 2), I = ed[0], ev = ed[1], eT = I.isFocused, eI = I.isFileDialogActive, eM = i.useRef("undefined" != typeof window && window.isSecureContext && el && Z()), ie = function() {
                    !eM.current && eI && setTimeout(function() {
                        T.current && (T.current.files.length || (ev({
                            type: "closeDialog"
                        }), ep()));
                    }, 300);
                };
                i.useEffect(function() {
                    return window.addEventListener("focus", ie, !1), function() {
                        window.removeEventListener("focus", ie, !1);
                    };
                }, [
                    T,
                    eI,
                    ep,
                    eM
                ]);
                var eW = i.useRef([]), ce = function(e) {
                    t.current && t.current.contains(e.target) || (e.preventDefault(), eW.current = []);
                };
                i.useEffect(function() {
                    return ek && (document.addEventListener("dragover", Y, !1), document.addEventListener("drop", ce, !1)), function() {
                        ek && (document.removeEventListener("dragover", Y), document.removeEventListener("drop", ce));
                    };
                }, [
                    t,
                    ek
                ]), i.useEffect(function() {
                    return !n && ej && t.current && t.current.focus(), function() {};
                }, [
                    t,
                    ej,
                    n
                ]);
                var L = i.useCallback(function(e) {
                    eS ? eS(e) : console.error(e);
                }, [
                    eS
                ]), eL = i.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e), eW.current = [].concat(f(eW.current), [
                        e.target
                    ]), N(e) && Promise.resolve(et(e)).then(function(t) {
                        if (!H(e) || w) {
                            var n = t.length, i = n > 0 && G({
                                files: t,
                                accept: ef,
                                minSize: eo,
                                maxSize: er,
                                multiple: b,
                                maxFiles: eu,
                                validator: es
                            });
                            ev({
                                isDragAccept: i,
                                isDragReject: n > 0 && !i,
                                isDragActive: !0,
                                type: "setDraggedFiles"
                            }), eb && eb(e);
                        }
                    }).catch(function(e) {
                        return L(e);
                    });
                }, [
                    et,
                    eb,
                    L,
                    w,
                    ef,
                    eo,
                    er,
                    b,
                    eu,
                    es
                ]), e_ = i.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e);
                    var t = N(e);
                    if (t && e.dataTransfer) try {
                        e.dataTransfer.dropEffect = "copy";
                    } catch (e) {}
                    return t && eD && eD(e), !1;
                }, [
                    eD,
                    w
                ]), eB = i.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e);
                    var n = eW.current.filter(function(e) {
                        return t.current && t.current.contains(e);
                    }), i = n.indexOf(e.target);
                    -1 !== i && n.splice(i, 1), eW.current = n, n.length > 0 || (ev({
                        type: "setDraggedFiles",
                        isDragActive: !1,
                        isDragAccept: !1,
                        isDragReject: !1
                    }), N(e) && eh && eh(e));
                }, [
                    t,
                    eh,
                    w
                ]), em = i.useCallback(function(i, n) {
                    var e = [], t = [];
                    i.forEach(function(n) {
                        var i = s(U(n, ef), 2), w = i[0], I = i[1], b = s(W(n, eo, er), 2), R = b[0], M = b[1], T = es ? es(n) : null;
                        if (w && R && !T) e.push(n);
                        else {
                            var L = [
                                I,
                                M
                            ];
                            T && (L = L.concat(T)), t.push({
                                file: n,
                                errors: L.filter(function(e) {
                                    return e;
                                })
                            });
                        }
                    }), (!b && e.length > 1 || b && eu >= 1 && e.length > eu) && (e.forEach(function(e) {
                        t.push({
                            file: e,
                            errors: [
                                en
                            ]
                        });
                    }), e.splice(0)), ev({
                        acceptedFiles: e,
                        fileRejections: t,
                        type: "setFiles"
                    }), ew && ew(e, t, n), t.length > 0 && eA && eA(t, n), e.length > 0 && ex && ex(e, n);
                }, [
                    ev,
                    b,
                    ef,
                    eo,
                    er,
                    eu,
                    ew,
                    ex,
                    eA,
                    es
                ]), eg = i.useCallback(function(e) {
                    e.preventDefault(), e.persist(), ke(e), eW.current = [], N(e) && Promise.resolve(et(e)).then(function(t) {
                        H(e) && !w || em(t, e);
                    }).catch(function(e) {
                        return L(e);
                    }), ev({
                        type: "reset"
                    });
                }, [
                    et,
                    em,
                    L,
                    w
                ]), q = i.useCallback(function() {
                    if (eM.current) {
                        ev({
                            type: "openDialog"
                        }), eR();
                        window.showOpenFilePicker({
                            multiple: b,
                            types: ez
                        }).then(function(e) {
                            return et(e);
                        }).then(function(e) {
                            em(e, null), ev({
                                type: "closeDialog"
                            });
                        }).catch(function(e) {
                            ne(e) ? (ep(e), ev({
                                type: "closeDialog"
                            })) : re(e) ? (eM.current = !1, T.current ? (T.current.value = null, T.current.click()) : L(Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))) : L(e);
                        });
                    } else T.current && (ev({
                        type: "openDialog"
                    }), eR(), T.current.value = null, T.current.click());
                }, [
                    ev,
                    eR,
                    ep,
                    el,
                    em,
                    L,
                    ez,
                    b
                ]), eK = i.useCallback(function(e) {
                    t.current && t.current.isEqualNode(e.target) && (" " !== e.key && "Enter" !== e.key && 32 !== e.keyCode && 13 !== e.keyCode || (e.preventDefault(), q()));
                }, [
                    t,
                    q
                ]), e$ = i.useCallback(function() {
                    ev({
                        type: "focus"
                    });
                }, []), eX = i.useCallback(function() {
                    ev({
                        type: "blur"
                    });
                }, []), eH = i.useCallback(function() {
                    eE || (V() ? setTimeout(q, 0) : q());
                }, [
                    eE,
                    q
                ]), Ae = function(e) {
                    return n ? null : e;
                }, Oe = function(e) {
                    return eP ? null : Ae(e);
                }, Ee = function(e) {
                    return eC ? null : Ae(e);
                }, ke = function(e) {
                    w && e.stopPropagation();
                }, eN = i.useMemo(function() {
                    return function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, b = e.refKey, i = e.role, w = e.onKeyDown, R = e.onFocus, T = e.onBlur, I = e.onClick, M = e.onDragEnter, L = e.onDragOver, q = e.onDragLeave, et = e.onDrop, en = l(e, ei);
                        return c(c(u({
                            onKeyDown: Oe(X(w, eK)),
                            onFocus: Oe(X(R, e$)),
                            onBlur: Oe(X(T, eX)),
                            onClick: Ae(X(I, eH)),
                            onDragEnter: Ee(X(M, eL)),
                            onDragOver: Ee(X(L, e_)),
                            onDragLeave: Ee(X(q, eB)),
                            onDrop: Ee(X(et, eg)),
                            role: "string" == typeof i && "" !== i ? i : "presentation"
                        }, void 0 === b ? "ref" : b, t), n || eP ? {} : {
                            tabIndex: 0
                        }), en);
                    };
                }, [
                    t,
                    eK,
                    e$,
                    eX,
                    eH,
                    eL,
                    e_,
                    eB,
                    eg,
                    eP,
                    eC,
                    n
                ]), eG = i.useCallback(function(e) {
                    e.stopPropagation();
                }, []), eU = i.useMemo(function() {
                    return function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.refKey, n = e.onChange, i = e.onClick, w = l(e, ea);
                        return c(c({}, u({
                            accept: ef,
                            multiple: b,
                            type: "file",
                            style: {
                                display: "none"
                            },
                            onChange: Ae(X(n, eg)),
                            onClick: Ae(X(i, eG)),
                            tabIndex: -1
                        }, void 0 === t ? "ref" : t, T)), w);
                    };
                }, [
                    T,
                    R,
                    b,
                    eg,
                    n
                ]);
                return c(c({}, I), {}, {
                    isFocused: eT && !n,
                    getRootProps: eN,
                    getInputProps: eU,
                    rootRef: t,
                    inputRef: T,
                    open: Ae(q)
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
            t.ErrorCode = {
                FileInvalidType: R,
                FileTooLarge: T,
                FileTooSmall: I,
                TooManyFiles: b
            }, t.default = n, t.useDropzone = de, Object.defineProperty(t, "__esModule", {
                value: !0
            });
        }(t, e(9885), e(5601));
    /***/ }
};
