exports.id = 675;
exports.ids = [675];
exports.modules = {


    /***/
    4622:
        /***/
        (function (__unused_webpack_module, exports, __webpack_require__) {

            ! function (e, t) {
                true ? t(exports, __webpack_require__(9885), __webpack_require__(5601)) : 0
            }(this, (function (e, t, n) {
                "use strict";

                function r(e) {
                    return e && "object" == typeof e && "default" in e ? e : {
                        default: e
                    }
                }
                var o = r(t),
                    i = r(n);

                function a(e, t) {
                    var n = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                        var r = Object.getOwnPropertySymbols(e);
                        t && (r = r.filter((function (t) {
                            return Object.getOwnPropertyDescriptor(e, t).enumerable
                        }))), n.push.apply(n, r)
                    }
                    return n
                }

                function c(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? a(Object(n), !0).forEach((function (t) {
                            u(e, t, n[t])
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach((function (t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                        }))
                    }
                    return e
                }

                function u(e, t, n) {
                    return t in e ? Object.defineProperty(e, t, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = n, e
                }

                function l(e, t) {
                    if (null == e) return {};
                    var n, r, o = function (e, t) {
                        if (null == e) return {};
                        var n, r, o = {},
                            i = Object.keys(e);
                        for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || (o[n] = e[n]);
                        return o
                    }(e, t);
                    if (Object.getOwnPropertySymbols) {
                        var i = Object.getOwnPropertySymbols(e);
                        for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n])
                    }
                    return o
                }

                function s(e, t) {
                    return function (e) {
                        if (Array.isArray(e)) return e
                    }(e) || function (e, t) {
                        var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                        if (null == n) return;
                        var r, o, i = [],
                            a = !0,
                            c = !1;
                        try {
                            for (n = n.call(e); !(a = (r = n.next()).done) && (i.push(r.value), !t || i.length !== t); a = !0);
                        } catch (e) {
                            c = !0, o = e
                        } finally {
                            try {
                                a || null == n.return || n.return()
                            } finally {
                                if (c) throw o
                            }
                        }
                        return i
                    }(e, t) || p(e, t) || function () {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function f(e) {
                    return function (e) {
                        if (Array.isArray(e)) return d(e)
                    }(e) || function (e) {
                        if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
                    }(e) || p(e) || function () {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function p(e, t) {
                    if (e) {
                        if ("string" == typeof e) return d(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? d(e, t) : void 0
                    }
                }

                function d(e, t) {
                    (null == t || t > e.length) && (t = e.length);
                    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                    return r
                }

                function v(e, t, n, r) {
                    return new (n || (n = Promise))((function (o, i) {
                        function a(e) {
                            try {
                                u(r.next(e))
                            } catch (e) {
                                i(e)
                            }
                        }

                        function c(e) {
                            try {
                                u(r.throw(e))
                            } catch (e) {
                                i(e)
                            }
                        }

                        function u(e) {
                            var t;
                            e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                                e(t)
                            }))).then(a, c)
                        }
                        u((r = r.apply(e, t || [])).next())
                    }))
                }

                function m(e, t) {
                    var n, r, o, i, a = {
                        label: 0,
                        sent: function () {
                            if (1 & o[0]) throw o[1];
                            return o[1]
                        },
                        trys: [],
                        ops: []
                    };
                    return i = {
                        next: c(0),
                        throw: c(1),
                        return: c(2)
                    }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
                        return this
                    }), i;

                    function c(i) {
                        return function (c) {
                            return function (i) {
                                if (n) throw new TypeError("Generator is already executing.");
                                for (; a;) try {
                                    if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                                    switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
                                        case 0:
                                        case 1:
                                            o = i;
                                            break;
                                        case 4:
                                            return a.label++, {
                                                value: i[1],
                                                done: !1
                                            };
                                        case 5:
                                            a.label++, r = i[1], i = [0];
                                            continue;
                                        case 7:
                                            i = a.ops.pop(), a.trys.pop();
                                            continue;
                                        default:
                                            if (!(o = a.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                                                a = 0;
                                                continue
                                            }
                                            if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
                                                a.label = i[1];
                                                break
                                            }
                                            if (6 === i[0] && a.label < o[1]) {
                                                a.label = o[1], o = i;
                                                break
                                            }
                                            if (o && a.label < o[2]) {
                                                a.label = o[2], a.ops.push(i);
                                                break
                                            }
                                            o[2] && a.ops.pop(), a.trys.pop();
                                            continue
                                    }
                                    i = t.call(e, a)
                                } catch (e) {
                                    i = [6, e], r = 0
                                } finally {
                                        n = o = 0
                                    }
                                if (5 & i[0]) throw i[1];
                                return {
                                    value: i[0] ? i[1] : void 0,
                                    done: !0
                                }
                            }([i, c])
                        }
                    }
                }

                function g(e, t) {
                    var n = "function" == typeof Symbol && e[Symbol.iterator];
                    if (!n) return e;
                    var r, o, i = n.call(e),
                        a = [];
                    try {
                        for (;
                            (void 0 === t || t-- > 0) && !(r = i.next()).done;) a.push(r.value)
                    } catch (e) {
                        o = {
                            error: e
                        }
                    } finally {
                        try {
                            r && !r.done && (n = i.return) && n.call(i)
                        } finally {
                            if (o) throw o.error
                        }
                    }
                    return a
                }

                function y(e, t, n) {
                    if (n || 2 === arguments.length)
                        for (var r, o = 0, i = t.length; o < i; o++) !r && o in t || (r || (r = Array.prototype.slice.call(t, 0, o)), r[o] = t[o]);
                    return e.concat(r || Array.prototype.slice.call(t))
                }
                var b = new Map([
                    ["aac", "audio/aac"],
                    ["abw", "application/x-abiword"],
                    ["arc", "application/x-freearc"],
                    ["avif", "image/avif"],
                    ["avi", "video/x-msvideo"],
                    ["azw", "application/vnd.amazon.ebook"],
                    ["bin", "application/octet-stream"],
                    ["bmp", "image/bmp"],
                    ["bz", "application/x-bzip"],
                    ["bz2", "application/x-bzip2"],
                    ["cda", "application/x-cdf"],
                    ["csh", "application/x-csh"],
                    ["css", "text/css"],
                    ["csv", "text/csv"],
                    ["doc", "application/msword"],
                    ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
                    ["eot", "application/vnd.ms-fontobject"],
                    ["epub", "application/epub+zip"],
                    ["gz", "application/gzip"],
                    ["gif", "image/gif"],
                    ["heic", "image/heic"],
                    ["heif", "image/heif"],
                    ["htm", "text/html"],
                    ["html", "text/html"],
                    ["ico", "image/vnd.microsoft.icon"],
                    ["ics", "text/calendar"],
                    ["jar", "application/java-archive"],
                    ["jpeg", "image/jpeg"],
                    ["jpg", "image/jpeg"],
                    ["js", "text/javascript"],
                    ["json", "application/json"],
                    ["jsonld", "application/ld+json"],
                    ["mid", "audio/midi"],
                    ["midi", "audio/midi"],
                    ["mjs", "text/javascript"],
                    ["mp3", "audio/mpeg"],
                    ["mp4", "video/mp4"],
                    ["mpeg", "video/mpeg"],
                    ["mpkg", "application/vnd.apple.installer+xml"],
                    ["odp", "application/vnd.oasis.opendocument.presentation"],
                    ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
                    ["odt", "application/vnd.oasis.opendocument.text"],
                    ["oga", "audio/ogg"],
                    ["ogv", "video/ogg"],
                    ["ogx", "application/ogg"],
                    ["opus", "audio/opus"],
                    ["otf", "font/otf"],
                    ["png", "image/png"],
                    ["pdf", "application/pdf"],
                    ["php", "application/x-httpd-php"],
                    ["ppt", "application/vnd.ms-powerpoint"],
                    ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
                    ["rar", "application/vnd.rar"],
                    ["rtf", "application/rtf"],
                    ["sh", "application/x-sh"],
                    ["svg", "image/svg+xml"],
                    ["swf", "application/x-shockwave-flash"],
                    ["tar", "application/x-tar"],
                    ["tif", "image/tiff"],
                    ["tiff", "image/tiff"],
                    ["ts", "video/mp2t"],
                    ["ttf", "font/ttf"],
                    ["txt", "text/plain"],
                    ["vsd", "application/vnd.visio"],
                    ["wav", "audio/wav"],
                    ["weba", "audio/webm"],
                    ["webm", "video/webm"],
                    ["webp", "image/webp"],
                    ["woff", "font/woff"],
                    ["woff2", "font/woff2"],
                    ["xhtml", "application/xhtml+xml"],
                    ["xls", "application/vnd.ms-excel"],
                    ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
                    ["xml", "application/xml"],
                    ["xul", "application/vnd.mozilla.xul+xml"],
                    ["zip", "application/zip"],
                    ["7z", "application/x-7z-compressed"],
                    ["mkv", "video/x-matroska"],
                    ["mov", "video/quicktime"],
                    ["msg", "application/vnd.ms-outlook"]
                ]);

                function h(e, t) {
                    var n = function (e) {
                        var t = e.name;
                        if (t && -1 !== t.lastIndexOf(".") && !e.type) {
                            var n = t.split(".").pop().toLowerCase(),
                                r = b.get(n);
                            r && Object.defineProperty(e, "type", {
                                value: r,
                                writable: !1,
                                configurable: !1,
                                enumerable: !0
                            })
                        }
                        return e
                    }(e);
                    if ("string" != typeof n.path) {
                        var r = e.webkitRelativePath;
                        Object.defineProperty(n, "path", {
                            value: "string" == typeof t ? t : "string" == typeof r && r.length > 0 ? r : e.name,
                            writable: !1,
                            configurable: !1,
                            enumerable: !0
                        })
                    }
                    return n
                }
                var w = [".DS_Store", "Thumbs.db"];

                function D(e) {
                    return "object" == typeof e && null !== e
                }

                function x(e) {
                    return O(e.target.files).map((function (e) {
                        return h(e)
                    }))
                }

                function F(e) {
                    return v(this, void 0, void 0, (function () {
                        return m(this, (function (t) {
                            switch (t.label) {
                                case 0:
                                    return [4, Promise.all(e.map((function (e) {
                                        return e.getFile()
                                    })))];
                                case 1:
                                    return [2, t.sent().map((function (e) {
                                        return h(e)
                                    }))]
                            }
                        }))
                    }))
                }

                function j(e, t) {
                    return v(this, void 0, void 0, (function () {
                        var n;
                        return m(this, (function (r) {
                            switch (r.label) {
                                case 0:
                                    return e.items ? (n = O(e.items).filter((function (e) {
                                        return "file" === e.kind
                                    })), "drop" !== t ? [2, n] : [4, Promise.all(n.map(E))]) : [3, 2];
                                case 1:
                                    return [2, A(k(r.sent()))];
                                case 2:
                                    return [2, A(O(e.files).map((function (e) {
                                        return h(e)
                                    })))]
                            }
                        }))
                    }))
                }

                function A(e) {
                    return e.filter((function (e) {
                        return -1 === w.indexOf(e.name)
                    }))
                }

                function O(e) {
                    if (null === e) return [];
                    for (var t = [], n = 0; n < e.length; n++) {
                        var r = e[n];
                        t.push(r)
                    }
                    return t
                }

                function E(e) {
                    if ("function" != typeof e.webkitGetAsEntry) return P(e);
                    var t = e.webkitGetAsEntry();
                    return t && t.isDirectory ? C(t) : P(e)
                }

                function k(e) {
                    return e.reduce((function (e, t) {
                        return y(y([], g(e), !1), g(Array.isArray(t) ? k(t) : [t]), !1)
                    }), [])
                }

                function P(e) {
                    var t = e.getAsFile();
                    if (!t) return Promise.reject("".concat(e, " is not a File"));
                    var n = h(t);
                    return Promise.resolve(n)
                }

                function S(e) {
                    return v(this, void 0, void 0, (function () {
                        return m(this, (function (t) {
                            return [2, e.isDirectory ? C(e) : z(e)]
                        }))
                    }))
                }

                function C(e) {
                    var t = e.createReader();
                    return new Promise((function (e, n) {
                        var r = [];
                        ! function o() {
                            var i = this;
                            t.readEntries((function (t) {
                                return v(i, void 0, void 0, (function () {
                                    var i, a, c;
                                    return m(this, (function (u) {
                                        switch (u.label) {
                                            case 0:
                                                if (t.length) return [3, 5];
                                                u.label = 1;
                                            case 1:
                                                return u.trys.push([1, 3, , 4]), [4, Promise.all(r)];
                                            case 2:
                                                return i = u.sent(), e(i), [3, 4];
                                            case 3:
                                                return a = u.sent(), n(a), [3, 4];
                                            case 4:
                                                return [3, 6];
                                            case 5:
                                                c = Promise.all(t.map(S)), r.push(c), o(), u.label = 6;
                                            case 6:
                                                return [2]
                                        }
                                    }))
                                }))
                            }), (function (e) {
                                n(e)
                            }))
                        }()
                    }))
                }

                function z(e) {
                    return v(this, void 0, void 0, (function () {
                        return m(this, (function (t) {
                            return [2, new Promise((function (t, n) {
                                e.file((function (n) {
                                    var r = h(n, e.fullPath);
                                    t(r)
                                }), (function (e) {
                                    n(e)
                                }))
                            }))]
                        }))
                    }))
                }
                var R = "file-invalid-type",
                    T = "file-too-large",
                    I = "file-too-small",
                    M = "too-many-files",
                    L = {
                        FileInvalidType: R,
                        FileTooLarge: T,
                        FileTooSmall: I,
                        TooManyFiles: M
                    },
                    _ = function (e) {
                        e = Array.isArray(e) && 1 === e.length ? e[0] : e;
                        var t = Array.isArray(e) ? "one of ".concat(e.join(", ")) : e;
                        return {
                            code: R,
                            message: "File type must be ".concat(t)
                        }
                    },
                    B = function (e) {
                        return {
                            code: T,
                            message: "File is larger than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                        }
                    },
                    K = function (e) {
                        return {
                            code: I,
                            message: "File is smaller than ".concat(e, " ").concat(1 === e ? "byte" : "bytes")
                        }
                    },
                    q = {
                        code: M,
                        message: "Too many files"
                    };

                function U(e, t) {
                    var n = "application/x-moz-file" === e.type || function (e, t) {
                        if (e && t) {
                            var n = Array.isArray(t) ? t : t.split(","),
                                r = e.name || "",
                                o = (e.type || "").toLowerCase(),
                                i = o.replace(/\/.*$/, "");
                            return n.some((function (e) {
                                var t = e.trim().toLowerCase();
                                return "." === t.charAt(0) ? r.toLowerCase().endsWith(t) : t.endsWith("/*") ? i === t.replace(/\/.*$/, "") : o === t
                            }))
                        }
                        return !0
                    }(e, t);
                    return [n, n ? null : _(t)]
                }

                function W(e, t, n) {
                    if ($(e.size))
                        if ($(t) && $(n)) {
                            if (e.size > n) return [!1, B(n)];
                            if (e.size < t) return [!1, K(t)]
                        } else {
                            if ($(t) && e.size < t) return [!1, K(t)];
                            if ($(n) && e.size > n) return [!1, B(n)]
                        } return [!0, null]
                }

                function $(e) {
                    return null != e
                }

                function G(e) {
                    var t = e.files,
                        n = e.accept,
                        r = e.minSize,
                        o = e.maxSize,
                        i = e.multiple,
                        a = e.maxFiles,
                        c = e.validator;
                    return !(!i && t.length > 1 || i && a >= 1 && t.length > a) && t.every((function (e) {
                        var t = s(U(e, n), 1)[0],
                            i = s(W(e, r, o), 1)[0],
                            a = c ? c(e) : null;
                        return t && i && !a
                    }))
                }

                function H(e) {
                    return "function" == typeof e.isPropagationStopped ? e.isPropagationStopped() : void 0 !== e.cancelBubble && e.cancelBubble
                }

                function N(e) {
                    return e.dataTransfer ? Array.prototype.some.call(e.dataTransfer.types, (function (e) {
                        return "Files" === e || "application/x-moz-file" === e
                    })) : !!e.target && !!e.target.files
                }

                function Y(e) {
                    e.preventDefault()
                }

                function J(e) {
                    return -1 !== e.indexOf("MSIE") || -1 !== e.indexOf("Trident/")
                }

                function Q(e) {
                    return -1 !== e.indexOf("Edge/")
                }

                function V() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.navigator.userAgent;
                    return J(e) || Q(e)
                }

                function X() {
                    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                    return function (e) {
                        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) r[o - 1] = arguments[o];
                        return t.some((function (t) {
                            return !H(e) && t && t.apply(void 0, [e].concat(r)), H(e)
                        }))
                    }
                }

                function Z() {
                    return "showOpenFilePicker" in window
                }

                function ee(e) {
                    return $(e) ? [{
                        description: "Files",
                        accept: Object.entries(e).filter((function (e) {
                            var t = s(e, 2),
                                n = t[0],
                                r = t[1],
                                o = !0;
                            return oe(n) || (console.warn('Skipped "'.concat(n, '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')), o = !1), Array.isArray(r) && r.every(ie) || (console.warn('Skipped "'.concat(n, '" because an invalid file extension was provided.')), o = !1), o
                        })).reduce((function (e, t) {
                            var n = s(t, 2),
                                r = n[0],
                                o = n[1];
                            return c(c({}, e), {}, u({}, r, o))
                        }), {})
                    }] : e
                }

                function te(e) {
                    if ($(e)) return Object.entries(e).reduce((function (e, t) {
                        var n = s(t, 2),
                            r = n[0],
                            o = n[1];
                        return [].concat(f(e), [r], f(o))
                    }), []).filter((function (e) {
                        return oe(e) || ie(e)
                    })).join(",")
                }

                function ne(e) {
                    return e instanceof DOMException && ("AbortError" === e.name || e.code === e.ABORT_ERR)
                }

                function re(e) {
                    return e instanceof DOMException && ("SecurityError" === e.name || e.code === e.SECURITY_ERR)
                }

                function oe(e) {
                    return "audio/*" === e || "video/*" === e || "image/*" === e || "text/*" === e || /\w+\/[-+.\w]+/g.test(e)
                }

                function ie(e) {
                    return /^.*\.[\w]+$/.test(e)
                }
                var ae = ["children"],
                    ce = ["open"],
                    ue = ["refKey", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"],
                    le = ["refKey", "onChange", "onClick"],
                    se = t.forwardRef((function (e, n) {
                        var r = e.children,
                            i = de(l(e, ae)),
                            a = i.open,
                            u = l(i, ce);
                        return t.useImperativeHandle(n, (function () {
                            return {
                                open: a
                            }
                        }), [a]), o.default.createElement(t.Fragment, null, r(c(c({}, u), {}, {
                            open: a
                        })))
                    }));
                se.displayName = "Dropzone";
                var fe = {
                    disabled: !1,
                    getFilesFromEvent: function (e) {
                        return v(this, void 0, void 0, (function () {
                            return m(this, (function (t) {
                                return D(e) && D(e.dataTransfer) ? [2, j(e.dataTransfer, e.type)] : function (e) {
                                    return D(e) && D(e.target)
                                }(e) ? [2, x(e)] : Array.isArray(e) && e.every((function (e) {
                                    return "getFile" in e && "function" == typeof e.getFile
                                })) ? [2, F(e)] : [2, []]
                            }))
                        }))
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
                se.defaultProps = fe, se.propTypes = {
                    children: i.default.func,
                    accept: i.default.objectOf(i.default.arrayOf(i.default.string)),
                    multiple: i.default.bool,
                    preventDropOnDocument: i.default.bool,
                    noClick: i.default.bool,
                    noKeyboard: i.default.bool,
                    noDrag: i.default.bool,
                    noDragEventsBubbling: i.default.bool,
                    minSize: i.default.number,
                    maxSize: i.default.number,
                    maxFiles: i.default.number,
                    disabled: i.default.bool,
                    getFilesFromEvent: i.default.func,
                    onFileDialogCancel: i.default.func,
                    onFileDialogOpen: i.default.func,
                    useFsAccessApi: i.default.bool,
                    autoFocus: i.default.bool,
                    onDragEnter: i.default.func,
                    onDragLeave: i.default.func,
                    onDragOver: i.default.func,
                    onDrop: i.default.func,
                    onDropAccepted: i.default.func,
                    onDropRejected: i.default.func,
                    onError: i.default.func,
                    validator: i.default.func
                };
                var pe = {
                    isFocused: !1,
                    isFileDialogActive: !1,
                    isDragActive: !1,
                    isDragAccept: !1,
                    isDragReject: !1,
                    acceptedFiles: [],
                    fileRejections: []
                };

                function de() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        n = c(c({}, fe), e),
                        r = n.accept,
                        o = n.disabled,
                        i = n.getFilesFromEvent,
                        a = n.maxSize,
                        p = n.minSize,
                        d = n.multiple,
                        v = n.maxFiles,
                        m = n.onDragEnter,
                        g = n.onDragLeave,
                        y = n.onDragOver,
                        b = n.onDrop,
                        h = n.onDropAccepted,
                        w = n.onDropRejected,
                        D = n.onFileDialogCancel,
                        x = n.onFileDialogOpen,
                        F = n.useFsAccessApi,
                        j = n.autoFocus,
                        A = n.preventDropOnDocument,
                        O = n.noClick,
                        E = n.noKeyboard,
                        k = n.noDrag,
                        P = n.noDragEventsBubbling,
                        S = n.onError,
                        C = n.validator,
                        z = t.useMemo((function () {
                            return te(r)
                        }), [r]),
                        R = t.useMemo((function () {
                            return ee(r)
                        }), [r]),
                        T = t.useMemo((function () {
                            return "function" == typeof x ? x : me
                        }), [x]),
                        I = t.useMemo((function () {
                            return "function" == typeof D ? D : me
                        }), [D]),
                        M = t.useRef(null),
                        L = t.useRef(null),
                        _ = t.useReducer(ve, pe),
                        B = s(_, 2),
                        K = B[0],
                        $ = B[1],
                        J = K.isFocused,
                        Q = K.isFileDialogActive,
                        oe = t.useRef("undefined" != typeof window && window.isSecureContext && F && Z()),
                        ie = function () {
                            !oe.current && Q && setTimeout((function () {
                                L.current && (L.current.files.length || ($({
                                    type: "closeDialog"
                                }), I()))
                            }), 300)
                        };
                    t.useEffect((function () {
                        return window.addEventListener("focus", ie, !1),
                            function () {
                                window.removeEventListener("focus", ie, !1)
                            }
                    }), [L, Q, I, oe]);
                    var ae = t.useRef([]),
                        ce = function (e) {
                            M.current && M.current.contains(e.target) || (e.preventDefault(), ae.current = [])
                        };
                    t.useEffect((function () {
                        return A && (document.addEventListener("dragover", Y, !1), document.addEventListener("drop", ce, !1)),
                            function () {
                                A && (document.removeEventListener("dragover", Y), document.removeEventListener("drop", ce))
                            }
                    }), [M, A]), t.useEffect((function () {
                        return !o && j && M.current && M.current.focus(),
                            function () { }
                    }), [M, j, o]);
                    var se = t.useCallback((function (e) {
                        S ? S(e) : console.error(e)
                    }), [S]),
                        de = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e), ae.current = [].concat(f(ae.current), [e.target]), N(e) && Promise.resolve(i(e)).then((function (t) {
                                if (!H(e) || P) {
                                    var n = t.length,
                                        r = n > 0 && G({
                                            files: t,
                                            accept: z,
                                            minSize: p,
                                            maxSize: a,
                                            multiple: d,
                                            maxFiles: v,
                                            validator: C
                                        });
                                    $({
                                        isDragAccept: r,
                                        isDragReject: n > 0 && !r,
                                        isDragActive: !0,
                                        type: "setDraggedFiles"
                                    }), m && m(e)
                                }
                            })).catch((function (e) {
                                return se(e)
                            }))
                        }), [i, m, se, P, z, p, a, d, v, C]),
                        ge = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e);
                            var t = N(e);
                            if (t && e.dataTransfer) try {
                                e.dataTransfer.dropEffect = "copy"
                            } catch (e) { }
                            return t && y && y(e), !1
                        }), [y, P]),
                        ye = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e);
                            var t = ae.current.filter((function (e) {
                                return M.current && M.current.contains(e)
                            })),
                                n = t.indexOf(e.target); - 1 !== n && t.splice(n, 1), ae.current = t, t.length > 0 || ($({
                                    type: "setDraggedFiles",
                                    isDragActive: !1,
                                    isDragAccept: !1,
                                    isDragReject: !1
                                }), N(e) && g && g(e))
                        }), [M, g, P]),
                        be = t.useCallback((function (e, t) {
                            var n = [],
                                r = [];
                            e.forEach((function (e) {
                                var t = s(U(e, z), 2),
                                    o = t[0],
                                    i = t[1],
                                    c = s(W(e, p, a), 2),
                                    u = c[0],
                                    l = c[1],
                                    f = C ? C(e) : null;
                                if (o && u && !f) n.push(e);
                                else {
                                    var d = [i, l];
                                    f && (d = d.concat(f)), r.push({
                                        file: e,
                                        errors: d.filter((function (e) {
                                            return e
                                        }))
                                    })
                                }
                            })), (!d && n.length > 1 || d && v >= 1 && n.length > v) && (n.forEach((function (e) {
                                r.push({
                                    file: e,
                                    errors: [q]
                                })
                            })), n.splice(0)), $({
                                acceptedFiles: n,
                                fileRejections: r,
                                type: "setFiles"
                            }), b && b(n, r, t), r.length > 0 && w && w(r, t), n.length > 0 && h && h(n, t)
                        }), [$, d, z, p, a, v, b, h, w, C]),
                        he = t.useCallback((function (e) {
                            e.preventDefault(), e.persist(), ke(e), ae.current = [], N(e) && Promise.resolve(i(e)).then((function (t) {
                                H(e) && !P || be(t, e)
                            })).catch((function (e) {
                                return se(e)
                            })), $({
                                type: "reset"
                            })
                        }), [i, be, se, P]),
                        we = t.useCallback((function () {
                            if (oe.current) {
                                $({
                                    type: "openDialog"
                                }), T();
                                var e = {
                                    multiple: d,
                                    types: R
                                };
                                window.showOpenFilePicker(e).then((function (e) {
                                    return i(e)
                                })).then((function (e) {
                                    be(e, null), $({
                                        type: "closeDialog"
                                    })
                                })).catch((function (e) {
                                    ne(e) ? (I(e), $({
                                        type: "closeDialog"
                                    })) : re(e) ? (oe.current = !1, L.current ? (L.current.value = null, L.current.click()) : se(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))) : se(e)
                                }))
                            } else L.current && ($({
                                type: "openDialog"
                            }), T(), L.current.value = null, L.current.click())
                        }), [$, T, I, F, be, se, R, d]),
                        De = t.useCallback((function (e) {
                            M.current && M.current.isEqualNode(e.target) && (" " !== e.key && "Enter" !== e.key && 32 !== e.keyCode && 13 !== e.keyCode || (e.preventDefault(), we()))
                        }), [M, we]),
                        xe = t.useCallback((function () {
                            $({
                                type: "focus"
                            })
                        }), []),
                        Fe = t.useCallback((function () {
                            $({
                                type: "blur"
                            })
                        }), []),
                        je = t.useCallback((function () {
                            O || (V() ? setTimeout(we, 0) : we())
                        }), [O, we]),
                        Ae = function (e) {
                            return o ? null : e
                        },
                        Oe = function (e) {
                            return E ? null : Ae(e)
                        },
                        Ee = function (e) {
                            return k ? null : Ae(e)
                        },
                        ke = function (e) {
                            P && e.stopPropagation()
                        },
                        Pe = t.useMemo((function () {
                            return function () {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                                    t = e.refKey,
                                    n = void 0 === t ? "ref" : t,
                                    r = e.role,
                                    i = e.onKeyDown,
                                    a = e.onFocus,
                                    s = e.onBlur,
                                    f = e.onClick,
                                    p = e.onDragEnter,
                                    d = e.onDragOver,
                                    v = e.onDragLeave,
                                    m = e.onDrop,
                                    g = l(e, ue);
                                return c(c(u({
                                    onKeyDown: Oe(X(i, De)),
                                    onFocus: Oe(X(a, xe)),
                                    onBlur: Oe(X(s, Fe)),
                                    onClick: Ae(X(f, je)),
                                    onDragEnter: Ee(X(p, de)),
                                    onDragOver: Ee(X(d, ge)),
                                    onDragLeave: Ee(X(v, ye)),
                                    onDrop: Ee(X(m, he)),
                                    role: "string" == typeof r && "" !== r ? r : "presentation"
                                }, n, M), o || E ? {} : {
                                    tabIndex: 0
                                }), g)
                            }
                        }), [M, De, xe, Fe, je, de, ge, ye, he, E, k, o]),
                        Se = t.useCallback((function (e) {
                            e.stopPropagation()
                        }), []),
                        Ce = t.useMemo((function () {
                            return function () {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                                    t = e.refKey,
                                    n = void 0 === t ? "ref" : t,
                                    r = e.onChange,
                                    o = e.onClick,
                                    i = l(e, le),
                                    a = u({
                                        accept: z,
                                        multiple: d,
                                        type: "file",
                                        style: {
                                            display: "none"
                                        },
                                        onChange: Ae(X(r, he)),
                                        onClick: Ae(X(o, Se)),
                                        tabIndex: -1
                                    }, n, L);
                                return c(c({}, a), i)
                            }
                        }), [L, r, d, he, o]);
                    return c(c({}, K), {}, {
                        isFocused: J && !o,
                        getRootProps: Pe,
                        getInputProps: Ce,
                        rootRef: M,
                        inputRef: L,
                        open: Ae(we)
                    })
                }

                function ve(e, t) {
                    switch (t.type) {
                        case "focus":
                            return c(c({}, e), {}, {
                                isFocused: !0
                            });
                        case "blur":
                            return c(c({}, e), {}, {
                                isFocused: !1
                            });
                        case "openDialog":
                            return c(c({}, pe), {}, {
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
                            return c({}, pe);
                        default:
                            return e
                    }
                }

                function me() { }
                e.ErrorCode = L, e.default = se, e.useDropzone = de, Object.defineProperty(e, "__esModule", {
                    value: !0
                })
            }));


            /***/
        })

};;