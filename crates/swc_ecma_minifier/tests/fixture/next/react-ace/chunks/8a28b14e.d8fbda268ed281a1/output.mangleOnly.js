(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        281
    ],
    {
        3239: function(e, t, i) {
            e = i.nmd(e);
            (function() {
                var e = "ace";
                var t = (function() {
                    return this;
                })();
                if (!t && typeof window != "undefined") t = window;
                if (!e && typeof requirejs !== "undefined") return;
                var i = function(e, t, n) {
                    if (typeof e !== "string") {
                        if (i.original) i.original.apply(this, arguments);
                        else {
                            console.error("dropping module because define wasn't a string.");
                            console.trace();
                        }
                        return;
                    }
                    if (arguments.length == 2) n = t;
                    if (!i.modules[e]) {
                        i.payloads[e] = n;
                        i.modules[e] = null;
                    }
                };
                i.modules = {};
                i.payloads = {};
                var n = function(e, t, i) {
                    if (typeof t === "string") {
                        var n = o(e, t);
                        if (n != undefined) {
                            i && i();
                            return n;
                        }
                    } else if (Object.prototype.toString.call(t) === "[object Array]") {
                        var s = [];
                        for(var a = 0, l = t.length; a < l; ++a){
                            var h = o(e, t[a]);
                            if (h == undefined && r.original) return;
                            s.push(h);
                        }
                        return ((i && i.apply(null, s)) || true);
                    }
                };
                var r = function(e, t) {
                    var i = n("", e, t);
                    if (i == undefined && r.original) return r.original.apply(this, arguments);
                    return i;
                };
                var s = function(e, t) {
                    if (t.indexOf("!") !== -1) {
                        var i = t.split("!");
                        return (s(e, i[0]) + "!" + s(e, i[1]));
                    }
                    if (t.charAt(0) == ".") {
                        var n = e.split("/").slice(0, -1).join("/");
                        t = n + "/" + t;
                        while(t.indexOf(".") !== -1 && r != t){
                            var r = t;
                            t = t.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
                        }
                    }
                    return t;
                };
                var o = function(e, t) {
                    t = s(e, t);
                    var r = i.modules[t];
                    if (!r) {
                        r = i.payloads[t];
                        if (typeof r === "function") {
                            var o = {};
                            var a = {
                                id: t,
                                uri: "",
                                exports: o,
                                packaged: true
                            };
                            var l = function(e, i) {
                                return n(t, e, i);
                            };
                            var h = r(l, o, a);
                            o = h || a.exports;
                            i.modules[t] = o;
                            delete i.payloads[t];
                        }
                        r = i.modules[t] = o || r;
                    }
                    return r;
                };
                function a(e) {
                    var n = t;
                    if (e) {
                        if (!t[e]) t[e] = {};
                        n = t[e];
                    }
                    if (!n.define || !n.define.packaged) {
                        i.original = n.define;
                        n.define = i;
                        n.define.packaged = true;
                    }
                    if (!n.require || !n.require.packaged) {
                        r.original = n.require;
                        n.require = r;
                        n.require.packaged = true;
                    }
                }
                a(e);
            })();
            ace.define("ace/lib/fixoldbrowsers", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                if (typeof Element != "undefined" && !Element.prototype.remove) {
                    Object.defineProperty(Element.prototype, "remove", {
                        enumerable: false,
                        writable: true,
                        configurable: true,
                        value: function() {
                            this.parentNode && this.parentNode.removeChild(this);
                        }
                    });
                }
            });
            ace.define("ace/lib/useragent", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                t.OS = {
                    LINUX: "LINUX",
                    MAC: "MAC",
                    WINDOWS: "WINDOWS"
                };
                t.getOS = function() {
                    if (t.isMac) {
                        return t.OS.MAC;
                    } else if (t.isLinux) {
                        return t.OS.LINUX;
                    } else {
                        return t.OS.WINDOWS;
                    }
                };
                var n = typeof navigator == "object" ? navigator : {};
                var r = (/mac|win|linux/i.exec(n.platform) || [
                    "other", 
                ])[0].toLowerCase();
                var s = n.userAgent || "";
                var o = n.appName || "";
                t.isWin = r == "win";
                t.isMac = r == "mac";
                t.isLinux = r == "linux";
                t.isIE = o == "Microsoft Internet Explorer" || o.indexOf("MSAppHost") >= 0 ? parseFloat((s.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]) : parseFloat((s.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]);
                t.isOldIE = t.isIE && t.isIE < 9;
                t.isGecko = t.isMozilla = s.match(/ Gecko\/\d+/);
                t.isOpera = typeof opera == "object" && Object.prototype.toString.call(window.opera) == "[object Opera]";
                t.isWebKit = parseFloat(s.split("WebKit/")[1]) || undefined;
                t.isChrome = parseFloat(s.split(" Chrome/")[1]) || undefined;
                t.isEdge = parseFloat(s.split(" Edge/")[1]) || undefined;
                t.isAIR = s.indexOf("AdobeAIR") >= 0;
                t.isAndroid = s.indexOf("Android") >= 0;
                t.isChromeOS = s.indexOf(" CrOS ") >= 0;
                t.isIOS = /iPad|iPhone|iPod/.test(s) && !window.MSStream;
                if (t.isIOS) t.isMac = true;
                t.isMobile = t.isIOS || t.isAndroid;
            });
            ace.define("ace/lib/dom", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(e, t, i) {
                "use strict";
                var n = e("./useragent");
                var r = "http://www.w3.org/1999/xhtml";
                t.buildDom = function e(t, i, n) {
                    if (typeof t == "string" && t) {
                        var r = document.createTextNode(t);
                        if (i) i.appendChild(r);
                        return r;
                    }
                    if (!Array.isArray(t)) {
                        if (t && t.appendChild && i) i.appendChild(t);
                        return t;
                    }
                    if (typeof t[0] != "string" || !t[0]) {
                        var s = [];
                        for(var o = 0; o < t.length; o++){
                            var a = e(t[o], i, n);
                            a && s.push(a);
                        }
                        return s;
                    }
                    var l = document.createElement(t[0]);
                    var h = t[1];
                    var c = 1;
                    if (h && typeof h == "object" && !Array.isArray(h)) c = 2;
                    for(var o = c; o < t.length; o++)e(t[o], l, n);
                    if (c == 2) {
                        Object.keys(h).forEach(function(e) {
                            var t = h[e];
                            if (e === "class") {
                                l.className = Array.isArray(t) ? t.join(" ") : t;
                            } else if (typeof t == "function" || e == "value" || e[0] == "$") {
                                l[e] = t;
                            } else if (e === "ref") {
                                if (n) n[t] = l;
                            } else if (e === "style") {
                                if (typeof t == "string") l.style.cssText = t;
                            } else if (t != null) {
                                l.setAttribute(e, t);
                            }
                        });
                    }
                    if (i) i.appendChild(l);
                    return l;
                };
                t.getDocumentHead = function(e) {
                    if (!e) e = document;
                    return (e.head || e.getElementsByTagName("head")[0] || e.documentElement);
                };
                t.createElement = function(e, t) {
                    return document.createElementNS ? document.createElementNS(t || r, e) : document.createElement(e);
                };
                t.removeChildren = function(e) {
                    e.innerHTML = "";
                };
                t.createTextNode = function(e, t) {
                    var i = t ? t.ownerDocument : document;
                    return i.createTextNode(e);
                };
                t.createFragment = function(e) {
                    var t = e ? e.ownerDocument : document;
                    return t.createDocumentFragment();
                };
                t.hasCssClass = function(e, t) {
                    var i = (e.className + "").split(/\s+/g);
                    return i.indexOf(t) !== -1;
                };
                t.addCssClass = function(e, i) {
                    if (!t.hasCssClass(e, i)) {
                        e.className += " " + i;
                    }
                };
                t.removeCssClass = function(e, t) {
                    var i = e.className.split(/\s+/g);
                    while(true){
                        var n = i.indexOf(t);
                        if (n == -1) {
                            break;
                        }
                        i.splice(n, 1);
                    }
                    e.className = i.join(" ");
                };
                t.toggleCssClass = function(e, t) {
                    var i = e.className.split(/\s+/g), n = true;
                    while(true){
                        var r = i.indexOf(t);
                        if (r == -1) {
                            break;
                        }
                        n = false;
                        i.splice(r, 1);
                    }
                    if (n) i.push(t);
                    e.className = i.join(" ");
                    return n;
                };
                t.setCssClass = function(e, i, n) {
                    if (n) {
                        t.addCssClass(e, i);
                    } else {
                        t.removeCssClass(e, i);
                    }
                };
                t.hasCssString = function(e, t) {
                    var i = 0, n;
                    t = t || document;
                    if ((n = t.querySelectorAll("style"))) {
                        while(i < n.length)if (n[i++].id === e) return true;
                    }
                };
                var s;
                var o = [];
                t.useStrictCSP = function(e) {
                    s = e;
                    if (e == false) a();
                    else if (!o) o = [];
                };
                function a() {
                    var e = o;
                    o = null;
                    e && e.forEach(function(e) {
                        l(e[0], e[1]);
                    });
                }
                function l(e, i, n) {
                    if (typeof document == "undefined") return;
                    if (o) {
                        if (n) {
                            a();
                        } else if (n === false) {
                            return o.push([
                                e,
                                i
                            ]);
                        }
                    }
                    if (s) return;
                    var r = n;
                    if (!n || !n.getRootNode) {
                        r = document;
                    } else {
                        r = n.getRootNode();
                        if (!r || r == n) r = document;
                    }
                    var l = r.ownerDocument || r;
                    if (i && t.hasCssString(i, r)) return null;
                    if (i) e += "\n/*# sourceURL=ace/css/" + i + " */";
                    var h = t.createElement("style");
                    h.appendChild(l.createTextNode(e));
                    if (i) h.id = i;
                    if (r == l) r = t.getDocumentHead(l);
                    r.insertBefore(h, r.firstChild);
                }
                t.importCssString = l;
                t.importCssStylsheet = function(e, i) {
                    t.buildDom([
                        "link",
                        {
                            rel: "stylesheet",
                            href: e
                        }
                    ], t.getDocumentHead(i));
                };
                t.scrollbarWidth = function(e) {
                    var i = t.createElement("ace_inner");
                    i.style.width = "100%";
                    i.style.minWidth = "0px";
                    i.style.height = "200px";
                    i.style.display = "block";
                    var n = t.createElement("ace_outer");
                    var r = n.style;
                    r.position = "absolute";
                    r.left = "-10000px";
                    r.overflow = "hidden";
                    r.width = "200px";
                    r.minWidth = "0px";
                    r.height = "150px";
                    r.display = "block";
                    n.appendChild(i);
                    var s = e.documentElement;
                    s.appendChild(n);
                    var o = i.offsetWidth;
                    r.overflow = "scroll";
                    var a = i.offsetWidth;
                    if (o == a) {
                        a = n.clientWidth;
                    }
                    s.removeChild(n);
                    return o - a;
                };
                t.computedStyle = function(e, t) {
                    return window.getComputedStyle(e, "") || {};
                };
                t.setStyle = function(e, t, i) {
                    if (e[t] !== i) {
                        e[t] = i;
                    }
                };
                t.HAS_CSS_ANIMATION = false;
                t.HAS_CSS_TRANSFORMS = false;
                t.HI_DPI = n.isWin ? typeof window !== "undefined" && window.devicePixelRatio >= 1.5 : true;
                if (n.isChromeOS) t.HI_DPI = false;
                if (typeof document !== "undefined") {
                    var h = document.createElement("div");
                    if (t.HI_DPI && h.style.transform !== undefined) t.HAS_CSS_TRANSFORMS = true;
                    if (!n.isEdge && typeof h.style.animationName !== "undefined") t.HAS_CSS_ANIMATION = true;
                    h = null;
                }
                if (t.HAS_CSS_TRANSFORMS) {
                    t.translate = function(e, t, i) {
                        e.style.transform = "translate(" + Math.round(t) + "px, " + Math.round(i) + "px)";
                    };
                } else {
                    t.translate = function(e, t, i) {
                        e.style.top = Math.round(i) + "px";
                        e.style.left = Math.round(t) + "px";
                    };
                }
            });
            ace.define("ace/lib/oop", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                t.inherits = function(e, t) {
                    e.super_ = t;
                    e.prototype = Object.create(t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                };
                t.mixin = function(e, t) {
                    for(var i in t){
                        e[i] = t[i];
                    }
                    return e;
                };
                t.implement = function(e, i) {
                    t.mixin(e, i);
                };
            });
            ace.define("ace/lib/keys", [
                "require",
                "exports",
                "module",
                "ace/lib/oop"
            ], function(e, t, i) {
                "use strict";
                var n = e("./oop");
                var r = (function() {
                    var e = {
                        MODIFIER_KEYS: {
                            16: "Shift",
                            17: "Ctrl",
                            18: "Alt",
                            224: "Meta",
                            91: "MetaLeft",
                            92: "MetaRight",
                            93: "ContextMenu"
                        },
                        KEY_MODS: {
                            ctrl: 1,
                            alt: 2,
                            option: 2,
                            shift: 4,
                            super: 8,
                            meta: 8,
                            command: 8,
                            cmd: 8,
                            control: 1
                        },
                        FUNCTION_KEYS: {
                            8: "Backspace",
                            9: "Tab",
                            13: "Return",
                            19: "Pause",
                            27: "Esc",
                            32: "Space",
                            33: "PageUp",
                            34: "PageDown",
                            35: "End",
                            36: "Home",
                            37: "Left",
                            38: "Up",
                            39: "Right",
                            40: "Down",
                            44: "Print",
                            45: "Insert",
                            46: "Delete",
                            96: "Numpad0",
                            97: "Numpad1",
                            98: "Numpad2",
                            99: "Numpad3",
                            100: "Numpad4",
                            101: "Numpad5",
                            102: "Numpad6",
                            103: "Numpad7",
                            104: "Numpad8",
                            105: "Numpad9",
                            "-13": "NumpadEnter",
                            112: "F1",
                            113: "F2",
                            114: "F3",
                            115: "F4",
                            116: "F5",
                            117: "F6",
                            118: "F7",
                            119: "F8",
                            120: "F9",
                            121: "F10",
                            122: "F11",
                            123: "F12",
                            144: "Numlock",
                            145: "Scrolllock"
                        },
                        PRINTABLE_KEYS: {
                            32: " ",
                            48: "0",
                            49: "1",
                            50: "2",
                            51: "3",
                            52: "4",
                            53: "5",
                            54: "6",
                            55: "7",
                            56: "8",
                            57: "9",
                            59: ";",
                            61: "=",
                            65: "a",
                            66: "b",
                            67: "c",
                            68: "d",
                            69: "e",
                            70: "f",
                            71: "g",
                            72: "h",
                            73: "i",
                            74: "j",
                            75: "k",
                            76: "l",
                            77: "m",
                            78: "n",
                            79: "o",
                            80: "p",
                            81: "q",
                            82: "r",
                            83: "s",
                            84: "t",
                            85: "u",
                            86: "v",
                            87: "w",
                            88: "x",
                            89: "y",
                            90: "z",
                            107: "+",
                            109: "-",
                            110: ".",
                            186: ";",
                            187: "=",
                            188: ",",
                            189: "-",
                            190: ".",
                            191: "/",
                            192: "`",
                            219: "[",
                            220: "\\",
                            221: "]",
                            222: "'",
                            111: "/",
                            106: "*"
                        }
                    };
                    var t, i;
                    for(i in e.FUNCTION_KEYS){
                        t = e.FUNCTION_KEYS[i].toLowerCase();
                        e[t] = parseInt(i, 10);
                    }
                    for(i in e.PRINTABLE_KEYS){
                        t = e.PRINTABLE_KEYS[i].toLowerCase();
                        e[t] = parseInt(i, 10);
                    }
                    n.mixin(e, e.MODIFIER_KEYS);
                    n.mixin(e, e.PRINTABLE_KEYS);
                    n.mixin(e, e.FUNCTION_KEYS);
                    e.enter = e["return"];
                    e.escape = e.esc;
                    e.del = e["delete"];
                    e[173] = "-";
                    (function() {
                        var t = [
                            "cmd",
                            "ctrl",
                            "alt",
                            "shift"
                        ];
                        for(var i = Math.pow(2, t.length); i--;){
                            e.KEY_MODS[i] = t.filter(function(t) {
                                return i & e.KEY_MODS[t];
                            }).join("-") + "-";
                        }
                    })();
                    e.KEY_MODS[0] = "";
                    e.KEY_MODS[-1] = "input-";
                    return e;
                })();
                n.mixin(t, r);
                t.keyCodeToString = function(e) {
                    var t = r[e];
                    if (typeof t != "string") t = String.fromCharCode(e);
                    return t.toLowerCase();
                };
            });
            ace.define("ace/lib/event", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./keys");
                var r = e("./useragent");
                var s = null;
                var o = 0;
                var a;
                function l() {
                    a = false;
                    try {
                        document.createComment("").addEventListener("test", function() {}, {
                            get passive () {
                                a = {
                                    passive: false
                                };
                            }
                        });
                    } catch (e) {}
                }
                function h() {
                    if (a == undefined) l();
                    return a;
                }
                function c(e, t, i) {
                    this.elem = e;
                    this.type = t;
                    this.callback = i;
                }
                c.prototype.destroy = function() {
                    d(this.elem, this.type, this.callback);
                    this.elem = this.type = this.callback = undefined;
                };
                var u = (t.addListener = function(e, t, i, n) {
                    e.addEventListener(t, i, h());
                    if (n) n.$toDestroy.push(new c(e, t, i));
                });
                var d = (t.removeListener = function(e, t, i) {
                    e.removeEventListener(t, i, h());
                });
                t.stopEvent = function(e) {
                    t.stopPropagation(e);
                    t.preventDefault(e);
                    return false;
                };
                t.stopPropagation = function(e) {
                    if (e.stopPropagation) e.stopPropagation();
                };
                t.preventDefault = function(e) {
                    if (e.preventDefault) e.preventDefault();
                };
                t.getButton = function(e) {
                    if (e.type == "dblclick") return 0;
                    if (e.type == "contextmenu" || (r.isMac && e.ctrlKey && !e.altKey && !e.shiftKey)) return 2;
                    return e.button;
                };
                t.capture = function(e, t, i) {
                    var n = (e && e.ownerDocument) || document;
                    function r(e) {
                        t && t(e);
                        i && i(e);
                        d(n, "mousemove", t);
                        d(n, "mouseup", r);
                        d(n, "dragstart", r);
                    }
                    u(n, "mousemove", t);
                    u(n, "mouseup", r);
                    u(n, "dragstart", r);
                    return r;
                };
                t.addMouseWheelListener = function(e, t, i) {
                    if ("onmousewheel" in e) {
                        u(e, "mousewheel", function(e) {
                            var i = 8;
                            if (e.wheelDeltaX !== undefined) {
                                e.wheelX = -e.wheelDeltaX / i;
                                e.wheelY = -e.wheelDeltaY / i;
                            } else {
                                e.wheelX = 0;
                                e.wheelY = -e.wheelDelta / i;
                            }
                            t(e);
                        }, i);
                    } else if ("onwheel" in e) {
                        u(e, "wheel", function(e) {
                            var i = 0.35;
                            switch(e.deltaMode){
                                case e.DOM_DELTA_PIXEL:
                                    e.wheelX = e.deltaX * i || 0;
                                    e.wheelY = e.deltaY * i || 0;
                                    break;
                                case e.DOM_DELTA_LINE:
                                case e.DOM_DELTA_PAGE:
                                    e.wheelX = (e.deltaX || 0) * 5;
                                    e.wheelY = (e.deltaY || 0) * 5;
                                    break;
                            }
                            t(e);
                        }, i);
                    } else {
                        u(e, "DOMMouseScroll", function(e) {
                            if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                                e.wheelX = (e.detail || 0) * 5;
                                e.wheelY = 0;
                            } else {
                                e.wheelX = 0;
                                e.wheelY = (e.detail || 0) * 5;
                            }
                            t(e);
                        }, i);
                    }
                };
                t.addMultiMouseDownListener = function(e, i, n, s, o) {
                    var a = 0;
                    var l, h, c;
                    var d = {
                        2: "dblclick",
                        3: "tripleclick",
                        4: "quadclick"
                    };
                    function f(e) {
                        if (t.getButton(e) !== 0) {
                            a = 0;
                        } else if (e.detail > 1) {
                            a++;
                            if (a > 4) a = 1;
                        } else {
                            a = 1;
                        }
                        if (r.isIE) {
                            var o = Math.abs(e.clientX - l) > 5 || Math.abs(e.clientY - h) > 5;
                            if (!c || o) a = 1;
                            if (c) clearTimeout(c);
                            c = setTimeout(function() {
                                c = null;
                            }, i[a - 1] || 600);
                            if (a == 1) {
                                l = e.clientX;
                                h = e.clientY;
                            }
                        }
                        e._clicks = a;
                        n[s]("mousedown", e);
                        if (a > 4) a = 0;
                        else if (a > 1) return n[s](d[a], e);
                    }
                    if (!Array.isArray(e)) e = [
                        e
                    ];
                    e.forEach(function(e) {
                        u(e, "mousedown", f, o);
                    });
                };
                var f = function(e) {
                    return (0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0));
                };
                t.getModifierString = function(e) {
                    return n.KEY_MODS[f(e)];
                };
                function g(e, t, i) {
                    var a = f(t);
                    if (!r.isMac && s) {
                        if (t.getModifierState && (t.getModifierState("OS") || t.getModifierState("Win"))) a |= 8;
                        if (s.altGr) {
                            if ((3 & a) != 3) s.altGr = 0;
                            else return;
                        }
                        if (i === 18 || i === 17) {
                            var l = "location" in t ? t.location : t.keyLocation;
                            if (i === 17 && l === 1) {
                                if (s[i] == 1) o = t.timeStamp;
                            } else if (i === 18 && a === 3 && l === 2) {
                                var h = t.timeStamp - o;
                                if (h < 50) s.altGr = true;
                            }
                        }
                    }
                    if (i in n.MODIFIER_KEYS) {
                        i = -1;
                    }
                    if (!a && i === 13) {
                        var l = "location" in t ? t.location : t.keyLocation;
                        if (l === 3) {
                            e(t, a, -i);
                            if (t.defaultPrevented) return;
                        }
                    }
                    if (r.isChromeOS && a & 8) {
                        e(t, a, i);
                        if (t.defaultPrevented) return;
                        else a &= ~8;
                    }
                    if (!a && !(i in n.FUNCTION_KEYS) && !(i in n.PRINTABLE_KEYS)) {
                        return false;
                    }
                    return e(t, a, i);
                }
                t.addCommandKeyListener = function(e, i, n) {
                    if (r.isOldGecko || (r.isOpera && !("KeyboardEvent" in window))) {
                        var o = null;
                        u(e, "keydown", function(e) {
                            o = e.keyCode;
                        }, n);
                        u(e, "keypress", function(e) {
                            return g(i, e, o);
                        }, n);
                    } else {
                        var a = null;
                        u(e, "keydown", function(e) {
                            s[e.keyCode] = (s[e.keyCode] || 0) + 1;
                            var t = g(i, e, e.keyCode);
                            a = e.defaultPrevented;
                            return t;
                        }, n);
                        u(e, "keypress", function(e) {
                            if (a && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
                                t.stopEvent(e);
                                a = null;
                            }
                        }, n);
                        u(e, "keyup", function(e) {
                            s[e.keyCode] = null;
                        }, n);
                        if (!s) {
                            m();
                            u(window, "focus", m);
                        }
                    }
                };
                function m() {
                    s = Object.create(null);
                }
                if (typeof window == "object" && window.postMessage && !r.isOldIE) {
                    var v = 1;
                    t.nextTick = function(e, i) {
                        i = i || window;
                        var n = "zero-timeout-message-" + v++;
                        var r = function(s) {
                            if (s.data == n) {
                                t.stopPropagation(s);
                                d(i, "message", r);
                                e();
                            }
                        };
                        u(i, "message", r);
                        i.postMessage(n, "*");
                    };
                }
                t.$idleBlocked = false;
                t.onIdle = function(e, i) {
                    return setTimeout(function i() {
                        if (!t.$idleBlocked) {
                            e();
                        } else {
                            setTimeout(i, 100);
                        }
                    }, i);
                };
                t.$idleBlockId = null;
                t.blockIdle = function(e) {
                    if (t.$idleBlockId) clearTimeout(t.$idleBlockId);
                    t.$idleBlocked = true;
                    t.$idleBlockId = setTimeout(function() {
                        t.$idleBlocked = false;
                    }, e || 100);
                };
                t.nextFrame = typeof window == "object" && (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame);
                if (t.nextFrame) t.nextFrame = t.nextFrame.bind(window);
                else t.nextFrame = function(e) {
                    setTimeout(e, 17);
                };
            });
            ace.define("ace/range", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                var n = function(e, t) {
                    return e.row - t.row || e.column - t.column;
                };
                var r = function(e, t, i, n) {
                    this.start = {
                        row: e,
                        column: t
                    };
                    this.end = {
                        row: i,
                        column: n
                    };
                };
                (function() {
                    this.isEqual = function(e) {
                        return (this.start.row === e.start.row && this.end.row === e.end.row && this.start.column === e.start.column && this.end.column === e.end.column);
                    };
                    this.toString = function() {
                        return ("Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]");
                    };
                    this.contains = function(e, t) {
                        return this.compare(e, t) == 0;
                    };
                    this.compareRange = function(e) {
                        var t, i = e.end, n = e.start;
                        t = this.compare(i.row, i.column);
                        if (t == 1) {
                            t = this.compare(n.row, n.column);
                            if (t == 1) {
                                return 2;
                            } else if (t == 0) {
                                return 1;
                            } else {
                                return 0;
                            }
                        } else if (t == -1) {
                            return -2;
                        } else {
                            t = this.compare(n.row, n.column);
                            if (t == -1) {
                                return -1;
                            } else if (t == 1) {
                                return 42;
                            } else {
                                return 0;
                            }
                        }
                    };
                    this.comparePoint = function(e) {
                        return this.compare(e.row, e.column);
                    };
                    this.containsRange = function(e) {
                        return (this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0);
                    };
                    this.intersects = function(e) {
                        var t = this.compareRange(e);
                        return t == -1 || t == 0 || t == 1;
                    };
                    this.isEnd = function(e, t) {
                        return (this.end.row == e && this.end.column == t);
                    };
                    this.isStart = function(e, t) {
                        return (this.start.row == e && this.start.column == t);
                    };
                    this.setStart = function(e, t) {
                        if (typeof e == "object") {
                            this.start.column = e.column;
                            this.start.row = e.row;
                        } else {
                            this.start.row = e;
                            this.start.column = t;
                        }
                    };
                    this.setEnd = function(e, t) {
                        if (typeof e == "object") {
                            this.end.column = e.column;
                            this.end.row = e.row;
                        } else {
                            this.end.row = e;
                            this.end.column = t;
                        }
                    };
                    this.inside = function(e, t) {
                        if (this.compare(e, t) == 0) {
                            if (this.isEnd(e, t) || this.isStart(e, t)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.insideStart = function(e, t) {
                        if (this.compare(e, t) == 0) {
                            if (this.isEnd(e, t)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.insideEnd = function(e, t) {
                        if (this.compare(e, t) == 0) {
                            if (this.isStart(e, t)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.compare = function(e, t) {
                        if (!this.isMultiLine()) {
                            if (e === this.start.row) {
                                return t < this.start.column ? -1 : t > this.end.column ? 1 : 0;
                            }
                        }
                        if (e < this.start.row) return -1;
                        if (e > this.end.row) return 1;
                        if (this.start.row === e) return t >= this.start.column ? 0 : -1;
                        if (this.end.row === e) return t <= this.end.column ? 0 : 1;
                        return 0;
                    };
                    this.compareStart = function(e, t) {
                        if (this.start.row == e && this.start.column == t) {
                            return -1;
                        } else {
                            return this.compare(e, t);
                        }
                    };
                    this.compareEnd = function(e, t) {
                        if (this.end.row == e && this.end.column == t) {
                            return 1;
                        } else {
                            return this.compare(e, t);
                        }
                    };
                    this.compareInside = function(e, t) {
                        if (this.end.row == e && this.end.column == t) {
                            return 1;
                        } else if (this.start.row == e && this.start.column == t) {
                            return -1;
                        } else {
                            return this.compare(e, t);
                        }
                    };
                    this.clipRows = function(e, t) {
                        if (this.end.row > t) var i = {
                            row: t + 1,
                            column: 0
                        };
                        else if (this.end.row < e) var i = {
                            row: e,
                            column: 0
                        };
                        if (this.start.row > t) var n = {
                            row: t + 1,
                            column: 0
                        };
                        else if (this.start.row < e) var n = {
                            row: e,
                            column: 0
                        };
                        return r.fromPoints(n || this.start, i || this.end);
                    };
                    this.extend = function(e, t) {
                        var i = this.compare(e, t);
                        if (i == 0) return this;
                        else if (i == -1) var n = {
                            row: e,
                            column: t
                        };
                        else var s = {
                            row: e,
                            column: t
                        };
                        return r.fromPoints(n || this.start, s || this.end);
                    };
                    this.isEmpty = function() {
                        return (this.start.row === this.end.row && this.start.column === this.end.column);
                    };
                    this.isMultiLine = function() {
                        return this.start.row !== this.end.row;
                    };
                    this.clone = function() {
                        return r.fromPoints(this.start, this.end);
                    };
                    this.collapseRows = function() {
                        if (this.end.column == 0) return new r(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
                        else return new r(this.start.row, 0, this.end.row, 0);
                    };
                    this.toScreenRange = function(e) {
                        var t = e.documentToScreenPosition(this.start);
                        var i = e.documentToScreenPosition(this.end);
                        return new r(t.row, t.column, i.row, i.column);
                    };
                    this.moveBy = function(e, t) {
                        this.start.row += e;
                        this.start.column += t;
                        this.end.row += e;
                        this.end.column += t;
                    };
                }.call(r.prototype));
                r.fromPoints = function(e, t) {
                    return new r(e.row, e.column, t.row, t.column);
                };
                r.comparePoints = n;
                r.comparePoints = function(e, t) {
                    return e.row - t.row || e.column - t.column;
                };
                t.Range = r;
            });
            ace.define("ace/lib/lang", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                t.last = function(e) {
                    return e[e.length - 1];
                };
                t.stringReverse = function(e) {
                    return e.split("").reverse().join("");
                };
                t.stringRepeat = function(e, t) {
                    var i = "";
                    while(t > 0){
                        if (t & 1) i += e;
                        if ((t >>= 1)) e += e;
                    }
                    return i;
                };
                var n = /^\s\s*/;
                var r = /\s\s*$/;
                t.stringTrimLeft = function(e) {
                    return e.replace(n, "");
                };
                t.stringTrimRight = function(e) {
                    return e.replace(r, "");
                };
                t.copyObject = function(e) {
                    var t = {};
                    for(var i in e){
                        t[i] = e[i];
                    }
                    return t;
                };
                t.copyArray = function(e) {
                    var t = [];
                    for(var i = 0, n = e.length; i < n; i++){
                        if (e[i] && typeof e[i] == "object") t[i] = this.copyObject(e[i]);
                        else t[i] = e[i];
                    }
                    return t;
                };
                t.deepCopy = function e(t) {
                    if (typeof t !== "object" || !t) return t;
                    var i;
                    if (Array.isArray(t)) {
                        i = [];
                        for(var n = 0; n < t.length; n++){
                            i[n] = e(t[n]);
                        }
                        return i;
                    }
                    if (Object.prototype.toString.call(t) !== "[object Object]") return t;
                    i = {};
                    for(var n in t)i[n] = e(t[n]);
                    return i;
                };
                t.arrayToMap = function(e) {
                    var t = {};
                    for(var i = 0; i < e.length; i++){
                        t[e[i]] = 1;
                    }
                    return t;
                };
                t.createMap = function(e) {
                    var t = Object.create(null);
                    for(var i in e){
                        t[i] = e[i];
                    }
                    return t;
                };
                t.arrayRemove = function(e, t) {
                    for(var i = 0; i <= e.length; i++){
                        if (t === e[i]) {
                            e.splice(i, 1);
                        }
                    }
                };
                t.escapeRegExp = function(e) {
                    return e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
                };
                t.escapeHTML = function(e) {
                    return ("" + e).replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
                };
                t.getMatchOffsets = function(e, t) {
                    var i = [];
                    e.replace(t, function(e) {
                        i.push({
                            offset: arguments[arguments.length - 2],
                            length: e.length
                        });
                    });
                    return i;
                };
                t.deferredCall = function(e) {
                    var t = null;
                    var i = function() {
                        t = null;
                        e();
                    };
                    var n = function(e) {
                        n.cancel();
                        t = setTimeout(i, e || 0);
                        return n;
                    };
                    n.schedule = n;
                    n.call = function() {
                        this.cancel();
                        e();
                        return n;
                    };
                    n.cancel = function() {
                        clearTimeout(t);
                        t = null;
                        return n;
                    };
                    n.isPending = function() {
                        return t;
                    };
                    return n;
                };
                t.delayedCall = function(e, t) {
                    var i = null;
                    var n = function() {
                        i = null;
                        e();
                    };
                    var r = function(e) {
                        if (i == null) i = setTimeout(n, e || t);
                    };
                    r.delay = function(e) {
                        i && clearTimeout(i);
                        i = setTimeout(n, e || t);
                    };
                    r.schedule = r;
                    r.call = function() {
                        this.cancel();
                        e();
                    };
                    r.cancel = function() {
                        i && clearTimeout(i);
                        i = null;
                    };
                    r.isPending = function() {
                        return i;
                    };
                    return r;
                };
            });
            ace.define("ace/clipboard", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                var n;
                i.exports = {
                    lineMode: false,
                    pasteCancelled: function() {
                        if (n && n > Date.now() - 50) return true;
                        return (n = false);
                    },
                    cancel: function() {
                        n = Date.now();
                    }
                };
            });
            ace.define("ace/keyboard/textinput", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent",
                "ace/lib/dom",
                "ace/lib/lang",
                "ace/clipboard",
                "ace/lib/keys", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/event");
                var r = e("../lib/useragent");
                var s = e("../lib/dom");
                var o = e("../lib/lang");
                var a = e("../clipboard");
                var l = r.isChrome < 18;
                var h = r.isIE;
                var c = r.isChrome > 63;
                var u = 400;
                var d = e("../lib/keys");
                var f = d.KEY_MODS;
                var g = r.isIOS;
                var m = g ? /\s/ : /\n/;
                var v = r.isMobile;
                var p = function(e, t) {
                    var i = s.createElement("textarea");
                    i.className = "ace_text-input";
                    i.setAttribute("wrap", "off");
                    i.setAttribute("autocorrect", "off");
                    i.setAttribute("autocapitalize", "off");
                    i.setAttribute("spellcheck", false);
                    i.style.opacity = "0";
                    e.insertBefore(i, e.firstChild);
                    var p = false;
                    var w = false;
                    var $ = false;
                    var b = false;
                    var y = "";
                    if (!v) i.style.fontSize = "1px";
                    var C = false;
                    var S = false;
                    var k = "";
                    var x = 0;
                    var A = 0;
                    var L = 0;
                    try {
                        var R = document.activeElement === i;
                    } catch (M) {}
                    n.addListener(i, "blur", function(e) {
                        if (S) return;
                        t.onBlur(e);
                        R = false;
                    }, t);
                    n.addListener(i, "focus", function(e) {
                        if (S) return;
                        R = true;
                        if (r.isEdge) {
                            try {
                                if (!document.hasFocus()) return;
                            } catch (i) {}
                        }
                        t.onFocus(e);
                        if (r.isEdge) setTimeout(E);
                        else E();
                    }, t);
                    this.$focusScroll = false;
                    this.focus = function() {
                        if (y || c || this.$focusScroll == "browser") return i.focus({
                            preventScroll: true
                        });
                        var e = i.style.top;
                        i.style.position = "fixed";
                        i.style.top = "0px";
                        try {
                            var t = i.getBoundingClientRect().top != 0;
                        } catch (n) {
                            return;
                        }
                        var r = [];
                        if (t) {
                            var s = i.parentElement;
                            while(s && s.nodeType == 1){
                                r.push(s);
                                s.setAttribute("ace_nocontext", true);
                                if (!s.parentElement && s.getRootNode) s = s.getRootNode().host;
                                else s = s.parentElement;
                            }
                        }
                        i.focus({
                            preventScroll: true
                        });
                        if (t) {
                            r.forEach(function(e) {
                                e.removeAttribute("ace_nocontext");
                            });
                        }
                        setTimeout(function() {
                            i.style.position = "";
                            if (i.style.top == "0px") i.style.top = e;
                        }, 0);
                    };
                    this.blur = function() {
                        i.blur();
                    };
                    this.isFocused = function() {
                        return R;
                    };
                    t.on("beforeEndOperation", function() {
                        var e = t.curOp;
                        var n = e && e.command && e.command.name;
                        if (n == "insertstring") return;
                        var r = n && (e.docChanged || e.selectionChanged);
                        if ($ && r) {
                            k = i.value = "";
                            U();
                        }
                        E();
                    });
                    var E = g ? function(e) {
                        if (!R || (p && !e) || b) return;
                        if (!e) e = "";
                        var n = "\n ab" + e + "cde fg\n";
                        if (n != i.value) i.value = k = n;
                        var r = 4;
                        var s = 4 + (e.length || (t.selection.isEmpty() ? 0 : 1));
                        if (x != r || A != s) {
                            i.setSelectionRange(r, s);
                        }
                        x = r;
                        A = s;
                    } : function() {
                        if ($ || b) return;
                        if (!R && !I) return;
                        $ = true;
                        var e = 0;
                        var n = 0;
                        var r = "";
                        if (t.session) {
                            var s = t.selection;
                            var o = s.getRange();
                            var a = s.cursor.row;
                            e = o.start.column;
                            n = o.end.column;
                            r = t.session.getLine(a);
                            if (o.start.row != a) {
                                var l = t.session.getLine(a - 1);
                                e = o.start.row < a - 1 ? 0 : e;
                                n += l.length + 1;
                                r = l + "\n" + r;
                            } else if (o.end.row != a) {
                                var h = t.session.getLine(a + 1);
                                n = o.end.row > a + 1 ? h.length : n;
                                n += r.length + 1;
                                r = r + "\n" + h;
                            } else if (v && a > 0) {
                                r = "\n" + r;
                                n += 1;
                                e += 1;
                            }
                            if (r.length > u) {
                                if (e < u && n < u) {
                                    r = r.slice(0, u);
                                } else {
                                    r = "\n";
                                    if (e == n) {
                                        e = n = 0;
                                    } else {
                                        e = 0;
                                        n = 1;
                                    }
                                }
                            }
                        }
                        var c = r + "\n\n";
                        if (c != k) {
                            i.value = k = c;
                            x = A = c.length;
                        }
                        if (I) {
                            x = i.selectionStart;
                            A = i.selectionEnd;
                        }
                        if (A != n || x != e || i.selectionEnd != A) {
                            try {
                                i.setSelectionRange(e, n);
                                x = e;
                                A = n;
                            } catch (d) {}
                        }
                        $ = false;
                    };
                    this.resetSelection = E;
                    if (R) t.onFocus();
                    var T = function(e) {
                        return (e.selectionStart === 0 && e.selectionEnd >= k.length && e.value === k && k && e.selectionEnd !== A);
                    };
                    var _ = function(e) {
                        if ($) return;
                        if (p) {
                            p = false;
                        } else if (T(i)) {
                            t.selectAll();
                            E();
                        } else if (v && i.selectionStart != x) {
                            E();
                        }
                    };
                    var F = null;
                    this.setInputHandler = function(e) {
                        F = e;
                    };
                    this.getInputHandler = function() {
                        return F;
                    };
                    var I = false;
                    var O = function(e, n) {
                        if (I) I = false;
                        if (w) {
                            E();
                            if (e) t.onPaste(e);
                            w = false;
                            return "";
                        } else {
                            var s = i.selectionStart;
                            var o = i.selectionEnd;
                            var a = x;
                            var l = k.length - A;
                            var h = e;
                            var c = e.length - s;
                            var u = e.length - o;
                            var d = 0;
                            while(a > 0 && k[d] == e[d]){
                                d++;
                                a--;
                            }
                            h = h.slice(d);
                            d = 1;
                            while(l > 0 && k.length - d > x - 1 && k[k.length - d] == e[e.length - d]){
                                d++;
                                l--;
                            }
                            c -= d - 1;
                            u -= d - 1;
                            var f = h.length - d + 1;
                            if (f < 0) {
                                a = -f;
                                f = 0;
                            }
                            h = h.slice(0, f);
                            if (!n && !h && !c && !a && !l && !u) return "";
                            b = true;
                            var g = false;
                            if (r.isAndroid && h == ". ") {
                                h = "  ";
                                g = true;
                            }
                            if ((h && !a && !l && !c && !u) || C) {
                                t.onTextInput(h);
                            } else {
                                t.onTextInput(h, {
                                    extendLeft: a,
                                    extendRight: l,
                                    restoreStart: c,
                                    restoreEnd: u
                                });
                            }
                            b = false;
                            k = e;
                            x = s;
                            A = o;
                            L = u;
                            return g ? "\n" : h;
                        }
                    };
                    var W = function(e) {
                        if ($) return V();
                        if (e && e.inputType) {
                            if (e.inputType == "historyUndo") return t.execCommand("undo");
                            if (e.inputType == "historyRedo") return t.execCommand("redo");
                        }
                        var n = i.value;
                        var r = O(n, true);
                        if (n.length > u + 100 || m.test(r) || (v && x < 1 && x == A)) {
                            E();
                        }
                    };
                    var D = function(e, t, i) {
                        var n = e.clipboardData || window.clipboardData;
                        if (!n || l) return;
                        var r = h || i ? "Text" : "text/plain";
                        try {
                            if (t) {
                                return (n.setData(r, t) !== false);
                            } else {
                                return n.getData(r);
                            }
                        } catch (s) {
                            if (!i) return D(s, t, true);
                        }
                    };
                    var B = function(e, r) {
                        var s = t.getCopyText();
                        if (!s) return n.preventDefault(e);
                        if (D(e, s)) {
                            if (g) {
                                E(s);
                                p = s;
                                setTimeout(function() {
                                    p = false;
                                }, 10);
                            }
                            r ? t.onCut() : t.onCopy();
                            n.preventDefault(e);
                        } else {
                            p = true;
                            i.value = s;
                            i.select();
                            setTimeout(function() {
                                p = false;
                                E();
                                r ? t.onCut() : t.onCopy();
                            });
                        }
                    };
                    var H = function(e) {
                        B(e, true);
                    };
                    var P = function(e) {
                        B(e, false);
                    };
                    var N = function(e) {
                        var s = D(e);
                        if (a.pasteCancelled()) return;
                        if (typeof s == "string") {
                            if (s) t.onPaste(s, e);
                            if (r.isIE) setTimeout(E);
                            n.preventDefault(e);
                        } else {
                            i.value = "";
                            w = true;
                        }
                    };
                    n.addCommandKeyListener(i, t.onCommandKey.bind(t), t);
                    n.addListener(i, "select", _, t);
                    n.addListener(i, "input", W, t);
                    n.addListener(i, "cut", H, t);
                    n.addListener(i, "copy", P, t);
                    n.addListener(i, "paste", N, t);
                    if (!("oncut" in i) || !("oncopy" in i) || !("onpaste" in i)) {
                        n.addListener(e, "keydown", function(e) {
                            if ((r.isMac && !e.metaKey) || !e.ctrlKey) return;
                            switch(e.keyCode){
                                case 67:
                                    P(e);
                                    break;
                                case 86:
                                    N(e);
                                    break;
                                case 88:
                                    H(e);
                                    break;
                            }
                        }, t);
                    }
                    var z = function(e) {
                        if ($ || !t.onCompositionStart || t.$readOnly) return;
                        $ = {};
                        if (C) return;
                        if (e.data) $.useTextareaForIME = false;
                        setTimeout(V, 0);
                        t._signal("compositionStart");
                        t.on("mousedown", K);
                        var n = t.getSelectionRange();
                        n.end.row = n.start.row;
                        n.end.column = n.start.column;
                        $.markerRange = n;
                        $.selectionStart = x;
                        t.onCompositionStart($);
                        if ($.useTextareaForIME) {
                            k = i.value = "";
                            x = 0;
                            A = 0;
                        } else {
                            if (i.msGetInputContext) $.context = i.msGetInputContext();
                            if (i.getInputContext) $.context = i.getInputContext();
                        }
                    };
                    var V = function() {
                        if (!$ || !t.onCompositionUpdate || t.$readOnly) return;
                        if (C) return K();
                        if ($.useTextareaForIME) {
                            t.onCompositionUpdate(i.value);
                        } else {
                            var e = i.value;
                            O(e);
                            if ($.markerRange) {
                                if ($.context) {
                                    $.markerRange.start.column = $.selectionStart = $.context.compositionStartOffset;
                                }
                                $.markerRange.end.column = $.markerRange.start.column + A - $.selectionStart + L;
                            }
                        }
                    };
                    var U = function(e) {
                        if (!t.onCompositionEnd || t.$readOnly) return;
                        $ = false;
                        t.onCompositionEnd();
                        t.off("mousedown", K);
                        if (e) W();
                    };
                    function K() {
                        S = true;
                        i.blur();
                        i.focus();
                        S = false;
                    }
                    var G = o.delayedCall(V, 50).schedule.bind(null, null);
                    function j(e) {
                        if (e.keyCode == 27 && i.value.length < i.selectionStart) {
                            if (!$) k = i.value;
                            x = A = -1;
                            E();
                        }
                        G();
                    }
                    n.addListener(i, "compositionstart", z, t);
                    n.addListener(i, "compositionupdate", V, t);
                    n.addListener(i, "keyup", j, t);
                    n.addListener(i, "keydown", G, t);
                    n.addListener(i, "compositionend", U, t);
                    this.getElement = function() {
                        return i;
                    };
                    this.setCommandMode = function(e) {
                        C = e;
                        i.readOnly = false;
                    };
                    this.setReadOnly = function(e) {
                        if (!C) i.readOnly = e;
                    };
                    this.setCopyWithEmptySelection = function(e) {};
                    this.onContextMenu = function(e) {
                        I = true;
                        E();
                        t._emit("nativecontextmenu", {
                            target: t,
                            domEvent: e
                        });
                        this.moveToMouse(e, true);
                    };
                    this.moveToMouse = function(e, o) {
                        if (!y) y = i.style.cssText;
                        i.style.cssText = (o ? "z-index:100000;" : "") + (r.isIE ? "opacity:0.1;" : "") + "text-indent: -" + (x + A) * t.renderer.characterWidth * 0.5 + "px;";
                        var a = t.container.getBoundingClientRect();
                        var l = s.computedStyle(t.container);
                        var h = a.top + (parseInt(l.borderTopWidth) || 0);
                        var c = a.left + (parseInt(a.borderLeftWidth) || 0);
                        var u = a.bottom - h - i.clientHeight - 2;
                        var d = function(e) {
                            s.translate(i, e.clientX - c - 2, Math.min(e.clientY - h - 2, u));
                        };
                        d(e);
                        if (e.type != "mousedown") return;
                        t.renderer.$isMousePressed = true;
                        clearTimeout(q);
                        if (r.isWin) n.capture(t.container, d, Y);
                    };
                    this.onContextMenuClose = Y;
                    var q;
                    function Y() {
                        clearTimeout(q);
                        q = setTimeout(function() {
                            if (y) {
                                i.style.cssText = y;
                                y = "";
                            }
                            t.renderer.$isMousePressed = false;
                            if (t.renderer.$keepTextAreaAtCursor) t.renderer.$moveTextAreaToCursor();
                        }, 0);
                    }
                    var X = function(e) {
                        t.textInput.onContextMenu(e);
                        Y();
                    };
                    n.addListener(i, "mouseup", X, t);
                    n.addListener(i, "mousedown", function(e) {
                        e.preventDefault();
                        Y();
                    }, t);
                    n.addListener(t.renderer.scroller, "contextmenu", X, t);
                    n.addListener(i, "contextmenu", X, t);
                    if (g) Q(e, t, i);
                    function Q(e, t, i) {
                        var n = null;
                        var r = false;
                        i.addEventListener("keydown", function(e) {
                            if (n) clearTimeout(n);
                            r = true;
                        }, true);
                        i.addEventListener("keyup", function(e) {
                            n = setTimeout(function() {
                                r = false;
                            }, 100);
                        }, true);
                        var s = function(e) {
                            if (document.activeElement !== i) return;
                            if (r || $ || t.$mouseHandler.isMousePressed) return;
                            if (p) {
                                return;
                            }
                            var n = i.selectionStart;
                            var s = i.selectionEnd;
                            var o = null;
                            var a = 0;
                            if (n == 0) {
                                o = d.up;
                            } else if (n == 1) {
                                o = d.home;
                            } else if (s > A && k[s] == "\n") {
                                o = d.end;
                            } else if (n < x && k[n - 1] == " ") {
                                o = d.left;
                                a = f.option;
                            } else if (n < x || (n == x && A != x && n == s)) {
                                o = d.left;
                            } else if (s > A && k.slice(0, s).split("\n").length > 2) {
                                o = d.down;
                            } else if (s > A && k[s - 1] == " ") {
                                o = d.right;
                                a = f.option;
                            } else if (s > A || (s == A && A != x && n == s)) {
                                o = d.right;
                            }
                            if (n !== s) a |= f.shift;
                            if (o) {
                                var l = t.onCommandKey({}, a, o);
                                if (!l && t.commands) {
                                    o = d.keyCodeToString(o);
                                    var h = t.commands.findKeyCommand(a, o);
                                    if (h) t.execCommand(h);
                                }
                                x = n;
                                A = s;
                                E("");
                            }
                        };
                        document.addEventListener("selectionchange", s);
                        t.on("destroy", function() {
                            document.removeEventListener("selectionchange", s);
                        });
                    }
                };
                t.TextInput = p;
                t.$setUserAgentForTests = function(e, t) {
                    v = e;
                    g = t;
                };
            });
            ace.define("ace/mouse/default_handlers", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/useragent");
                var r = 0;
                var s = 550;
                function o(e) {
                    e.$clickSelection = null;
                    var t = e.editor;
                    t.setDefaultHandler("mousedown", this.onMouseDown.bind(e));
                    t.setDefaultHandler("dblclick", this.onDoubleClick.bind(e));
                    t.setDefaultHandler("tripleclick", this.onTripleClick.bind(e));
                    t.setDefaultHandler("quadclick", this.onQuadClick.bind(e));
                    t.setDefaultHandler("mousewheel", this.onMouseWheel.bind(e));
                    var i = [
                        "select",
                        "startSelect",
                        "selectEnd",
                        "selectAllEnd",
                        "selectByWordsEnd",
                        "selectByLinesEnd",
                        "dragWait",
                        "dragWaitEnd",
                        "focusWait", 
                    ];
                    i.forEach(function(t) {
                        e[t] = this[t];
                    }, this);
                    e.selectByLines = this.extendSelectionBy.bind(e, "getLineRange");
                    e.selectByWords = this.extendSelectionBy.bind(e, "getWordRange");
                }
                (function() {
                    this.onMouseDown = function(e) {
                        var t = e.inSelection();
                        var i = e.getDocumentPosition();
                        this.mousedownEvent = e;
                        var r = this.editor;
                        var s = e.getButton();
                        if (s !== 0) {
                            var o = r.getSelectionRange();
                            var a = o.isEmpty();
                            if (a || s == 1) r.selection.moveToPosition(i);
                            if (s == 2) {
                                r.textInput.onContextMenu(e.domEvent);
                                if (!n.isMozilla) e.preventDefault();
                            }
                            return;
                        }
                        this.mousedownEvent.time = Date.now();
                        if (t && !r.isFocused()) {
                            r.focus();
                            if (this.$focusTimeout && !this.$clickSelection && !r.inMultiSelectMode) {
                                this.setState("focusWait");
                                this.captureMouse(e);
                                return;
                            }
                        }
                        this.captureMouse(e);
                        this.startSelect(i, e.domEvent._clicks > 1);
                        return e.preventDefault();
                    };
                    this.startSelect = function(e, t) {
                        e = e || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
                        var i = this.editor;
                        if (!this.mousedownEvent) return;
                        if (this.mousedownEvent.getShiftKey()) i.selection.selectToPosition(e);
                        else if (!t) i.selection.moveToPosition(e);
                        if (!t) this.select();
                        if (i.renderer.scroller.setCapture) {
                            i.renderer.scroller.setCapture();
                        }
                        i.setStyle("ace_selecting");
                        this.setState("select");
                    };
                    this.select = function() {
                        var e, t = this.editor;
                        var i = t.renderer.screenToTextCoordinates(this.x, this.y);
                        if (this.$clickSelection) {
                            var n = this.$clickSelection.comparePoint(i);
                            if (n == -1) {
                                e = this.$clickSelection.end;
                            } else if (n == 1) {
                                e = this.$clickSelection.start;
                            } else {
                                var r = l(this.$clickSelection, i);
                                i = r.cursor;
                                e = r.anchor;
                            }
                            t.selection.setSelectionAnchor(e.row, e.column);
                        }
                        t.selection.selectToPosition(i);
                        t.renderer.scrollCursorIntoView();
                    };
                    this.extendSelectionBy = function(e) {
                        var t, i = this.editor;
                        var n = i.renderer.screenToTextCoordinates(this.x, this.y);
                        var r = i.selection[e](n.row, n.column);
                        if (this.$clickSelection) {
                            var s = this.$clickSelection.comparePoint(r.start);
                            var o = this.$clickSelection.comparePoint(r.end);
                            if (s == -1 && o <= 0) {
                                t = this.$clickSelection.end;
                                if (r.end.row != n.row || r.end.column != n.column) n = r.start;
                            } else if (o == 1 && s >= 0) {
                                t = this.$clickSelection.start;
                                if (r.start.row != n.row || r.start.column != n.column) n = r.end;
                            } else if (s == -1 && o == 1) {
                                n = r.end;
                                t = r.start;
                            } else {
                                var a = l(this.$clickSelection, n);
                                n = a.cursor;
                                t = a.anchor;
                            }
                            i.selection.setSelectionAnchor(t.row, t.column);
                        }
                        i.selection.selectToPosition(n);
                        i.renderer.scrollCursorIntoView();
                    };
                    this.selectEnd = this.selectAllEnd = this.selectByWordsEnd = this.selectByLinesEnd = function() {
                        this.$clickSelection = null;
                        this.editor.unsetStyle("ace_selecting");
                        if (this.editor.renderer.scroller.releaseCapture) {
                            this.editor.renderer.scroller.releaseCapture();
                        }
                    };
                    this.focusWait = function() {
                        var e = a(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                        var t = Date.now();
                        if (e > r || t - this.mousedownEvent.time > this.$focusTimeout) this.startSelect(this.mousedownEvent.getDocumentPosition());
                    };
                    this.onDoubleClick = function(e) {
                        var t = e.getDocumentPosition();
                        var i = this.editor;
                        var n = i.session;
                        var r = n.getBracketRange(t);
                        if (r) {
                            if (r.isEmpty()) {
                                r.start.column--;
                                r.end.column++;
                            }
                            this.setState("select");
                        } else {
                            r = i.selection.getWordRange(t.row, t.column);
                            this.setState("selectByWords");
                        }
                        this.$clickSelection = r;
                        this.select();
                    };
                    this.onTripleClick = function(e) {
                        var t = e.getDocumentPosition();
                        var i = this.editor;
                        this.setState("selectByLines");
                        var n = i.getSelectionRange();
                        if (n.isMultiLine() && n.contains(t.row, t.column)) {
                            this.$clickSelection = i.selection.getLineRange(n.start.row);
                            this.$clickSelection.end = i.selection.getLineRange(n.end.row).end;
                        } else {
                            this.$clickSelection = i.selection.getLineRange(t.row);
                        }
                        this.select();
                    };
                    this.onQuadClick = function(e) {
                        var t = this.editor;
                        t.selectAll();
                        this.$clickSelection = t.getSelectionRange();
                        this.setState("selectAll");
                    };
                    this.onMouseWheel = function(e) {
                        if (e.getAccelKey()) return;
                        if (e.getShiftKey() && e.wheelY && !e.wheelX) {
                            e.wheelX = e.wheelY;
                            e.wheelY = 0;
                        }
                        var t = this.editor;
                        if (!this.$lastScroll) this.$lastScroll = {
                            t: 0,
                            vx: 0,
                            vy: 0,
                            allowed: 0
                        };
                        var i = this.$lastScroll;
                        var n = e.domEvent.timeStamp;
                        var r = n - i.t;
                        var o = r ? e.wheelX / r : i.vx;
                        var a = r ? e.wheelY / r : i.vy;
                        if (r < s) {
                            o = (o + i.vx) / 2;
                            a = (a + i.vy) / 2;
                        }
                        var l = Math.abs(o / a);
                        var h = false;
                        if (l >= 1 && t.renderer.isScrollableBy(e.wheelX * e.speed, 0)) h = true;
                        if (l <= 1 && t.renderer.isScrollableBy(0, e.wheelY * e.speed)) h = true;
                        if (h) {
                            i.allowed = n;
                        } else if (n - i.allowed < s) {
                            var c = Math.abs(o) <= 1.5 * Math.abs(i.vx) && Math.abs(a) <= 1.5 * Math.abs(i.vy);
                            if (c) {
                                h = true;
                                i.allowed = n;
                            } else {
                                i.allowed = 0;
                            }
                        }
                        i.t = n;
                        i.vx = o;
                        i.vy = a;
                        if (h) {
                            t.renderer.scrollBy(e.wheelX * e.speed, e.wheelY * e.speed);
                            return e.stop();
                        }
                    };
                }.call(o.prototype));
                t.DefaultHandlers = o;
                function a(e, t, i, n) {
                    return Math.sqrt(Math.pow(i - e, 2) + Math.pow(n - t, 2));
                }
                function l(e, t) {
                    if (e.start.row == e.end.row) var i = 2 * t.column - e.start.column - e.end.column;
                    else if (e.start.row == e.end.row - 1 && !e.start.column && !e.end.column) var i = t.column - 4;
                    else var i = 2 * t.row - e.start.row - e.end.row;
                    if (i < 0) return {
                        cursor: e.start,
                        anchor: e.end
                    };
                    else return {
                        cursor: e.end,
                        anchor: e.start
                    };
                }
            });
            ace.define("ace/tooltip", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./lib/dom");
                function s(e) {
                    this.isOpen = false;
                    this.$element = null;
                    this.$parentNode = e;
                }
                (function() {
                    this.$init = function() {
                        this.$element = r.createElement("div");
                        this.$element.className = "ace_tooltip";
                        this.$element.style.display = "none";
                        this.$parentNode.appendChild(this.$element);
                        return this.$element;
                    };
                    this.getElement = function() {
                        return this.$element || this.$init();
                    };
                    this.setText = function(e) {
                        this.getElement().textContent = e;
                    };
                    this.setHtml = function(e) {
                        this.getElement().innerHTML = e;
                    };
                    this.setPosition = function(e, t) {
                        this.getElement().style.left = e + "px";
                        this.getElement().style.top = t + "px";
                    };
                    this.setClassName = function(e) {
                        r.addCssClass(this.getElement(), e);
                    };
                    this.show = function(e, t, i) {
                        if (e != null) this.setText(e);
                        if (t != null && i != null) this.setPosition(t, i);
                        if (!this.isOpen) {
                            this.getElement().style.display = "block";
                            this.isOpen = true;
                        }
                    };
                    this.hide = function() {
                        if (this.isOpen) {
                            this.getElement().style.display = "none";
                            this.isOpen = false;
                        }
                    };
                    this.getHeight = function() {
                        return this.getElement().offsetHeight;
                    };
                    this.getWidth = function() {
                        return this.getElement().offsetWidth;
                    };
                    this.destroy = function() {
                        this.isOpen = false;
                        if (this.$element && this.$element.parentNode) {
                            this.$element.parentNode.removeChild(this.$element);
                        }
                    };
                }.call(s.prototype));
                t.Tooltip = s;
            });
            ace.define("ace/mouse/default_gutter_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/oop",
                "ace/lib/event",
                "ace/tooltip", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/dom");
                var r = e("../lib/oop");
                var s = e("../lib/event");
                var o = e("../tooltip").Tooltip;
                function a(e) {
                    var t = e.editor;
                    var i = t.renderer.$gutterLayer;
                    var r = new l(t.container);
                    e.editor.setDefaultHandler("guttermousedown", function(n) {
                        if (!t.isFocused() || n.getButton() != 0) return;
                        var r = i.getRegion(n);
                        if (r == "foldWidgets") return;
                        var s = n.getDocumentPosition().row;
                        var o = t.session.selection;
                        if (n.getShiftKey()) o.selectTo(s, 0);
                        else {
                            if (n.domEvent.detail == 2) {
                                t.selectAll();
                                return n.preventDefault();
                            }
                            e.$clickSelection = t.selection.getLineRange(s);
                        }
                        e.setState("selectByLines");
                        e.captureMouse(n);
                        return n.preventDefault();
                    });
                    var o, a, h;
                    function c() {
                        var n = a.getDocumentPosition().row;
                        var s = i.$annotations[n];
                        if (!s) return u();
                        var o = t.session.getLength();
                        if (n == o) {
                            var l = t.renderer.pixelToScreenCoordinates(0, a.y).row;
                            var c = a.$pos;
                            if (l > t.session.documentToScreenRow(c.row, c.column)) return u();
                        }
                        if (h == s) return;
                        h = s.text.join("<br/>");
                        r.setHtml(h);
                        r.show();
                        t._signal("showGutterTooltip", r);
                        t.on("mousewheel", u);
                        if (e.$tooltipFollowsMouse) {
                            d(a);
                        } else {
                            var f = a.domEvent.target;
                            var g = f.getBoundingClientRect();
                            var m = r.getElement().style;
                            m.left = g.right + "px";
                            m.top = g.bottom + "px";
                        }
                    }
                    function u() {
                        if (o) o = clearTimeout(o);
                        if (h) {
                            r.hide();
                            h = null;
                            t._signal("hideGutterTooltip", r);
                            t.off("mousewheel", u);
                        }
                    }
                    function d(e) {
                        r.setPosition(e.x, e.y);
                    }
                    e.editor.setDefaultHandler("guttermousemove", function(t) {
                        var i = t.domEvent.target || t.domEvent.srcElement;
                        if (n.hasCssClass(i, "ace_fold-widget")) return u();
                        if (h && e.$tooltipFollowsMouse) d(t);
                        a = t;
                        if (o) return;
                        o = setTimeout(function() {
                            o = null;
                            if (a && !e.isMousePressed) c();
                            else u();
                        }, 50);
                    });
                    s.addListener(t.renderer.$gutter, "mouseout", function(e) {
                        a = null;
                        if (!h || o) return;
                        o = setTimeout(function() {
                            o = null;
                            u();
                        }, 50);
                    }, t);
                    t.on("changeSession", u);
                }
                function l(e) {
                    o.call(this, e);
                }
                r.inherits(l, o);
                (function() {
                    this.setPosition = function(e, t) {
                        var i = window.innerWidth || document.documentElement.clientWidth;
                        var n = window.innerHeight || document.documentElement.clientHeight;
                        var r = this.getWidth();
                        var s = this.getHeight();
                        e += 15;
                        t += 15;
                        if (e + r > i) {
                            e -= e + r - i;
                        }
                        if (t + s > n) {
                            t -= 20 + s;
                        }
                        o.prototype.setPosition.call(this, e, t);
                    };
                }.call(l.prototype));
                t.GutterHandler = a;
            });
            ace.define("ace/mouse/mouse_event", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/event");
                var r = e("../lib/useragent");
                var s = (t.MouseEvent = function(e, t) {
                    this.domEvent = e;
                    this.editor = t;
                    this.x = this.clientX = e.clientX;
                    this.y = this.clientY = e.clientY;
                    this.$pos = null;
                    this.$inSelection = null;
                    this.propagationStopped = false;
                    this.defaultPrevented = false;
                });
                (function() {
                    this.stopPropagation = function() {
                        n.stopPropagation(this.domEvent);
                        this.propagationStopped = true;
                    };
                    this.preventDefault = function() {
                        n.preventDefault(this.domEvent);
                        this.defaultPrevented = true;
                    };
                    this.stop = function() {
                        this.stopPropagation();
                        this.preventDefault();
                    };
                    this.getDocumentPosition = function() {
                        if (this.$pos) return this.$pos;
                        this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
                        return this.$pos;
                    };
                    this.inSelection = function() {
                        if (this.$inSelection !== null) return this.$inSelection;
                        var e = this.editor;
                        var t = e.getSelectionRange();
                        if (t.isEmpty()) this.$inSelection = false;
                        else {
                            var i = this.getDocumentPosition();
                            this.$inSelection = t.contains(i.row, i.column);
                        }
                        return this.$inSelection;
                    };
                    this.getButton = function() {
                        return n.getButton(this.domEvent);
                    };
                    this.getShiftKey = function() {
                        return this.domEvent.shiftKey;
                    };
                    this.getAccelKey = r.isMac ? function() {
                        return this.domEvent.metaKey;
                    } : function() {
                        return this.domEvent.ctrlKey;
                    };
                }.call(s.prototype));
            });
            ace.define("ace/mouse/dragdrop_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/dom");
                var r = e("../lib/event");
                var s = e("../lib/useragent");
                var o = 200;
                var a = 200;
                var l = 5;
                function h(e) {
                    var t = e.editor;
                    var i = n.createElement("div");
                    i.style.cssText = "top:-100px;position:absolute;z-index:2147483647;opacity:0.5";
                    i.textContent = "\xa0";
                    var h = [
                        "dragWait",
                        "dragWaitEnd",
                        "startDrag",
                        "dragReadyEnd",
                        "onMouseDrag", 
                    ];
                    h.forEach(function(t) {
                        e[t] = this[t];
                    }, this);
                    t.on("mousedown", this.onMouseDown.bind(e));
                    var u = t.container;
                    var d, f, g;
                    var m, v;
                    var p, w = 0;
                    var $;
                    var b;
                    var y;
                    var C;
                    var S;
                    this.onDragStart = function(e) {
                        if (this.cancelDrag || !u.draggable) {
                            var n = this;
                            setTimeout(function() {
                                n.startSelect();
                                n.captureMouse(e);
                            }, 0);
                            return e.preventDefault();
                        }
                        v = t.getSelectionRange();
                        var r = e.dataTransfer;
                        r.effectAllowed = t.getReadOnly() ? "copy" : "copyMove";
                        t.container.appendChild(i);
                        r.setDragImage && r.setDragImage(i, 0, 0);
                        setTimeout(function() {
                            t.container.removeChild(i);
                        });
                        r.clearData();
                        r.setData("Text", t.session.getTextRange());
                        b = true;
                        this.setState("drag");
                    };
                    this.onDragEnd = function(e) {
                        u.draggable = false;
                        b = false;
                        this.setState(null);
                        if (!t.getReadOnly()) {
                            var i = e.dataTransfer.dropEffect;
                            if (!$ && i == "move") t.session.remove(t.getSelectionRange());
                            t.$resetCursorStyle();
                        }
                        this.editor.unsetStyle("ace_dragging");
                        this.editor.renderer.setCursorStyle("");
                    };
                    this.onDragEnter = function(e) {
                        if (t.getReadOnly() || !T(e.dataTransfer)) return;
                        f = e.clientX;
                        g = e.clientY;
                        if (!d) L();
                        w++;
                        e.dataTransfer.dropEffect = $ = _(e);
                        return r.preventDefault(e);
                    };
                    this.onDragOver = function(e) {
                        if (t.getReadOnly() || !T(e.dataTransfer)) return;
                        f = e.clientX;
                        g = e.clientY;
                        if (!d) {
                            L();
                            w++;
                        }
                        if (M !== null) M = null;
                        e.dataTransfer.dropEffect = $ = _(e);
                        return r.preventDefault(e);
                    };
                    this.onDragLeave = function(e) {
                        w--;
                        if (w <= 0 && d) {
                            R();
                            $ = null;
                            return r.preventDefault(e);
                        }
                    };
                    this.onDrop = function(e) {
                        if (!p) return;
                        var i = e.dataTransfer;
                        if (b) {
                            switch($){
                                case "move":
                                    if (v.contains(p.row, p.column)) {
                                        v = {
                                            start: p,
                                            end: p
                                        };
                                    } else {
                                        v = t.moveText(v, p);
                                    }
                                    break;
                                case "copy":
                                    v = t.moveText(v, p, true);
                                    break;
                            }
                        } else {
                            var n = i.getData("Text");
                            v = {
                                start: p,
                                end: t.session.insert(p, n)
                            };
                            t.focus();
                            $ = null;
                        }
                        R();
                        return r.preventDefault(e);
                    };
                    r.addListener(u, "dragstart", this.onDragStart.bind(e), t);
                    r.addListener(u, "dragend", this.onDragEnd.bind(e), t);
                    r.addListener(u, "dragenter", this.onDragEnter.bind(e), t);
                    r.addListener(u, "dragover", this.onDragOver.bind(e), t);
                    r.addListener(u, "dragleave", this.onDragLeave.bind(e), t);
                    r.addListener(u, "drop", this.onDrop.bind(e), t);
                    function k(e, i) {
                        var n = Date.now();
                        var r = !i || e.row != i.row;
                        var s = !i || e.column != i.column;
                        if (!C || r || s) {
                            t.moveCursorToPosition(e);
                            C = n;
                            S = {
                                x: f,
                                y: g
                            };
                        } else {
                            var o = c(S.x, S.y, f, g);
                            if (o > l) {
                                C = null;
                            } else if (n - C >= a) {
                                t.renderer.scrollCursorIntoView();
                                C = null;
                            }
                        }
                    }
                    function x(e, i) {
                        var n = Date.now();
                        var r = t.renderer.layerConfig.lineHeight;
                        var s = t.renderer.layerConfig.characterWidth;
                        var a = t.renderer.scroller.getBoundingClientRect();
                        var l = {
                            x: {
                                left: f - a.left,
                                right: a.right - f
                            },
                            y: {
                                top: g - a.top,
                                bottom: a.bottom - g
                            }
                        };
                        var h = Math.min(l.x.left, l.x.right);
                        var c = Math.min(l.y.top, l.y.bottom);
                        var u = {
                            row: e.row,
                            column: e.column
                        };
                        if (h / s <= 2) {
                            u.column += l.x.left < l.x.right ? -3 : +2;
                        }
                        if (c / r <= 1) {
                            u.row += l.y.top < l.y.bottom ? -1 : +1;
                        }
                        var d = e.row != u.row;
                        var m = e.column != u.column;
                        var v = !i || e.row != i.row;
                        if (d || (m && !v)) {
                            if (!y) y = n;
                            else if (n - y >= o) t.renderer.scrollCursorIntoView(u);
                        } else {
                            y = null;
                        }
                    }
                    function A() {
                        var e = p;
                        p = t.renderer.screenToTextCoordinates(f, g);
                        k(p, e);
                        x(p, e);
                    }
                    function L() {
                        v = t.selection.toOrientedRange();
                        d = t.session.addMarker(v, "ace_selection", t.getSelectionStyle());
                        t.clearSelection();
                        if (t.isFocused()) t.renderer.$cursorLayer.setBlinking(false);
                        clearInterval(m);
                        A();
                        m = setInterval(A, 20);
                        w = 0;
                        r.addListener(document, "mousemove", E);
                    }
                    function R() {
                        clearInterval(m);
                        t.session.removeMarker(d);
                        d = null;
                        t.selection.fromOrientedRange(v);
                        if (t.isFocused() && !b) t.$resetCursorStyle();
                        v = null;
                        p = null;
                        w = 0;
                        y = null;
                        C = null;
                        r.removeListener(document, "mousemove", E);
                    }
                    var M = null;
                    function E() {
                        if (M == null) {
                            M = setTimeout(function() {
                                if (M != null && d) R();
                            }, 20);
                        }
                    }
                    function T(e) {
                        var t = e.types;
                        return (!t || Array.prototype.some.call(t, function(e) {
                            return (e == "text/plain" || e == "Text");
                        }));
                    }
                    function _(e) {
                        var t = [
                            "copy",
                            "copymove",
                            "all",
                            "uninitialized", 
                        ];
                        var i = [
                            "move",
                            "copymove",
                            "linkmove",
                            "all",
                            "uninitialized", 
                        ];
                        var n = s.isMac ? e.altKey : e.ctrlKey;
                        var r = "uninitialized";
                        try {
                            r = e.dataTransfer.effectAllowed.toLowerCase();
                        } catch (o) {}
                        var a = "none";
                        if (n && t.indexOf(r) >= 0) a = "copy";
                        else if (i.indexOf(r) >= 0) a = "move";
                        else if (t.indexOf(r) >= 0) a = "copy";
                        return a;
                    }
                }
                (function() {
                    this.dragWait = function() {
                        var e = Date.now() - this.mousedownEvent.time;
                        if (e > this.editor.getDragDelay()) this.startDrag();
                    };
                    this.dragWaitEnd = function() {
                        var e = this.editor.container;
                        e.draggable = false;
                        this.startSelect(this.mousedownEvent.getDocumentPosition());
                        this.selectEnd();
                    };
                    this.dragReadyEnd = function(e) {
                        this.editor.$resetCursorStyle();
                        this.editor.unsetStyle("ace_dragging");
                        this.editor.renderer.setCursorStyle("");
                        this.dragWaitEnd();
                    };
                    this.startDrag = function() {
                        this.cancelDrag = false;
                        var e = this.editor;
                        var t = e.container;
                        t.draggable = true;
                        e.renderer.$cursorLayer.setBlinking(false);
                        e.setStyle("ace_dragging");
                        var i = s.isWin ? "default" : "move";
                        e.renderer.setCursorStyle(i);
                        this.setState("dragReady");
                    };
                    this.onMouseDrag = function(e) {
                        var t = this.editor.container;
                        if (s.isIE && this.state == "dragReady") {
                            var i = c(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            if (i > 3) t.dragDrop();
                        }
                        if (this.state === "dragWait") {
                            var i = c(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            if (i > 0) {
                                t.draggable = false;
                                this.startSelect(this.mousedownEvent.getDocumentPosition());
                            }
                        }
                    };
                    this.onMouseDown = function(e) {
                        if (!this.$dragEnabled) return;
                        this.mousedownEvent = e;
                        var t = this.editor;
                        var i = e.inSelection();
                        var n = e.getButton();
                        var r = e.domEvent.detail || 1;
                        if (r === 1 && n === 0 && i) {
                            if (e.editor.inMultiSelectMode && (e.getAccelKey() || e.getShiftKey())) return;
                            this.mousedownEvent.time = Date.now();
                            var o = e.domEvent.target || e.domEvent.srcElement;
                            if ("unselectable" in o) o.unselectable = "on";
                            if (t.getDragDelay()) {
                                if (s.isWebKit) {
                                    this.cancelDrag = true;
                                    var a = t.container;
                                    a.draggable = true;
                                }
                                this.setState("dragWait");
                            } else {
                                this.startDrag();
                            }
                            this.captureMouse(e, this.onMouseDrag.bind(this));
                            e.defaultPrevented = true;
                        }
                    };
                }.call(h.prototype));
                function c(e, t, i, n) {
                    return Math.sqrt(Math.pow(i - e, 2) + Math.pow(n - t, 2));
                }
                t.DragdropHandler = h;
            });
            ace.define("ace/mouse/touch_handler", [
                "require",
                "exports",
                "module",
                "ace/mouse/mouse_event",
                "ace/lib/event",
                "ace/lib/dom", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./mouse_event").MouseEvent;
                var r = e("../lib/event");
                var s = e("../lib/dom");
                t.addTouchListeners = function(e, t) {
                    var i = "scroll";
                    var o;
                    var a;
                    var l;
                    var h;
                    var c;
                    var u;
                    var d = 0;
                    var f;
                    var g = 0;
                    var m = 0;
                    var v = 0;
                    var p;
                    var w;
                    function $() {
                        var e = window.navigator && window.navigator.clipboard;
                        var n = false;
                        var r = function() {
                            var i = t.getCopyText();
                            var r = t.session.getUndoManager().hasUndo();
                            w.replaceChild(s.buildDom(n ? [
                                "span",
                                !i && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "selectall"
                                    },
                                    "Select All", 
                                ],
                                i && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "copy"
                                    },
                                    "Copy", 
                                ],
                                i && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "cut"
                                    },
                                    "Cut", 
                                ],
                                e && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "paste"
                                    },
                                    "Paste", 
                                ],
                                r && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "undo"
                                    },
                                    "Undo", 
                                ],
                                [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "find"
                                    },
                                    "Find", 
                                ],
                                [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "openCommandPallete"
                                    },
                                    "Pallete", 
                                ], 
                            ] : [
                                "span"
                            ]), w.firstChild);
                        };
                        var o = function(i) {
                            var s = i.target.getAttribute("action");
                            if (s == "more" || !n) {
                                n = !n;
                                return r();
                            }
                            if (s == "paste") {
                                e.readText().then(function(e) {
                                    t.execCommand(s, e);
                                });
                            } else if (s) {
                                if (s == "cut" || s == "copy") {
                                    if (e) e.writeText(t.getCopyText());
                                    else document.execCommand("copy");
                                }
                                t.execCommand(s);
                            }
                            w.firstChild.style.display = "none";
                            n = false;
                            if (s != "openCommandPallete") t.focus();
                        };
                        w = s.buildDom([
                            "div",
                            {
                                class: "ace_mobile-menu",
                                ontouchstart: function(e) {
                                    i = "menu";
                                    e.stopPropagation();
                                    e.preventDefault();
                                    t.textInput.focus();
                                },
                                ontouchend: function(e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    o(e);
                                },
                                onclick: o
                            },
                            [
                                "span"
                            ],
                            [
                                "span",
                                {
                                    class: "ace_mobile-button",
                                    action: "more"
                                },
                                "...", 
                            ], 
                        ], t.container);
                    }
                    function b() {
                        if (!w) $();
                        var e = t.selection.cursor;
                        var i = t.renderer.textToScreenCoordinates(e.row, e.column);
                        var n = t.renderer.textToScreenCoordinates(0, 0).pageX;
                        var r = t.renderer.scrollLeft;
                        var s = t.container.getBoundingClientRect();
                        w.style.top = i.pageY - s.top - 3 + "px";
                        if (i.pageX - s.left < s.width - 70) {
                            w.style.left = "";
                            w.style.right = "10px";
                        } else {
                            w.style.right = "";
                            w.style.left = n + r - s.left + "px";
                        }
                        w.style.display = "";
                        w.firstChild.style.display = "none";
                        t.on("input", y);
                    }
                    function y(e) {
                        if (w) w.style.display = "none";
                        t.off("input", y);
                    }
                    function C() {
                        c = null;
                        clearTimeout(c);
                        var e = t.selection.getRange();
                        var n = e.contains(f.row, f.column);
                        if (e.isEmpty() || !n) {
                            t.selection.moveToPosition(f);
                            t.selection.selectWord();
                        }
                        i = "wait";
                        b();
                    }
                    function S() {
                        c = null;
                        clearTimeout(c);
                        t.selection.moveToPosition(f);
                        var e = g >= 2 ? t.selection.getLineRange(f.row) : t.session.getBracketRange(f);
                        if (e && !e.isEmpty()) {
                            t.selection.setRange(e);
                        } else {
                            t.selection.selectWord();
                        }
                        i = "wait";
                    }
                    r.addListener(e, "contextmenu", function(e) {
                        if (!p) return;
                        var i = t.textInput.getElement();
                        i.focus();
                    }, t);
                    r.addListener(e, "touchstart", function(e) {
                        var r = e.touches;
                        if (c || r.length > 1) {
                            clearTimeout(c);
                            c = null;
                            l = -1;
                            i = "zoom";
                            return;
                        }
                        p = t.$mouseHandler.isMousePressed = true;
                        var s = t.renderer.layerConfig.lineHeight;
                        var u = t.renderer.layerConfig.lineHeight;
                        var w = e.timeStamp;
                        h = w;
                        var $ = r[0];
                        var b = $.clientX;
                        var y = $.clientY;
                        if (Math.abs(o - b) + Math.abs(a - y) > s) l = -1;
                        o = e.clientX = b;
                        a = e.clientY = y;
                        m = v = 0;
                        var k = new n(e, t);
                        f = k.getDocumentPosition();
                        if (w - l < 500 && r.length == 1 && !d) {
                            g++;
                            e.preventDefault();
                            e.button = 0;
                            S();
                        } else {
                            g = 0;
                            var x = t.selection.cursor;
                            var A = t.selection.isEmpty() ? x : t.selection.anchor;
                            var L = t.renderer.$cursorLayer.getPixelPosition(x, true);
                            var R = t.renderer.$cursorLayer.getPixelPosition(A, true);
                            var M = t.renderer.scroller.getBoundingClientRect();
                            var E = t.renderer.layerConfig.offset;
                            var T = t.renderer.scrollLeft;
                            var _ = function(e, t) {
                                e = e / u;
                                t = t / s - 0.75;
                                return e * e + t * t;
                            };
                            if (e.clientX < M.left) {
                                i = "zoom";
                                return;
                            }
                            var F = _(e.clientX - M.left - L.left + T, e.clientY - M.top - L.top + E);
                            var I = _(e.clientX - M.left - R.left + T, e.clientY - M.top - R.top + E);
                            if (F < 3.5 && I < 3.5) i = F > I ? "cursor" : "anchor";
                            if (I < 3.5) i = "anchor";
                            else if (F < 3.5) i = "cursor";
                            else i = "scroll";
                            c = setTimeout(C, 450);
                        }
                        l = w;
                    }, t);
                    r.addListener(e, "touchend", function(e) {
                        p = t.$mouseHandler.isMousePressed = false;
                        if (u) clearInterval(u);
                        if (i == "zoom") {
                            i = "";
                            d = 0;
                        } else if (c) {
                            t.selection.moveToPosition(f);
                            d = 0;
                            b();
                        } else if (i == "scroll") {
                            k();
                            y();
                        } else {
                            b();
                        }
                        clearTimeout(c);
                        c = null;
                    }, t);
                    r.addListener(e, "touchmove", function(e) {
                        if (c) {
                            clearTimeout(c);
                            c = null;
                        }
                        var r = e.touches;
                        if (r.length > 1 || i == "zoom") return;
                        var s = r[0];
                        var l = o - s.clientX;
                        var u = a - s.clientY;
                        if (i == "wait") {
                            if (l * l + u * u > 4) i = "cursor";
                            else return e.preventDefault();
                        }
                        o = s.clientX;
                        a = s.clientY;
                        e.clientX = s.clientX;
                        e.clientY = s.clientY;
                        var d = e.timeStamp;
                        var f = d - h;
                        h = d;
                        if (i == "scroll") {
                            var g = new n(e, t);
                            g.speed = 1;
                            g.wheelX = l;
                            g.wheelY = u;
                            if (10 * Math.abs(l) < Math.abs(u)) l = 0;
                            if (10 * Math.abs(u) < Math.abs(l)) u = 0;
                            if (f != 0) {
                                m = l / f;
                                v = u / f;
                            }
                            t._emit("mousewheel", g);
                            if (!g.propagationStopped) {
                                m = v = 0;
                            }
                        } else {
                            var p = new n(e, t);
                            var w = p.getDocumentPosition();
                            if (i == "cursor") t.selection.moveCursorToPosition(w);
                            else if (i == "anchor") t.selection.setSelectionAnchor(w.row, w.column);
                            t.renderer.scrollCursorIntoView(w);
                            e.preventDefault();
                        }
                    }, t);
                    function k() {
                        d += 60;
                        u = setInterval(function() {
                            if (d-- <= 0) {
                                clearInterval(u);
                                u = null;
                            }
                            if (Math.abs(m) < 0.01) m = 0;
                            if (Math.abs(v) < 0.01) v = 0;
                            if (d < 20) m = 0.9 * m;
                            if (d < 20) v = 0.9 * v;
                            var e = t.session.getScrollTop();
                            t.renderer.scrollBy(10 * m, 10 * v);
                            if (e == t.session.getScrollTop()) d = 0;
                        }, 10);
                    }
                };
            });
            ace.define("ace/lib/net", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                var n = e("./dom");
                t.get = function(e, t) {
                    var i = new XMLHttpRequest();
                    i.open("GET", e, true);
                    i.onreadystatechange = function() {
                        if (i.readyState === 4) {
                            t(i.responseText);
                        }
                    };
                    i.send(null);
                };
                t.loadScript = function(e, t) {
                    var i = n.getDocumentHead();
                    var r = document.createElement("script");
                    r.src = e;
                    i.appendChild(r);
                    r.onload = r.onreadystatechange = function(e, i) {
                        if (i || !r.readyState || r.readyState == "loaded" || r.readyState == "complete") {
                            r = r.onload = r.onreadystatechange = null;
                            if (!i) t();
                        }
                    };
                };
                t.qualifyURL = function(e) {
                    var t = document.createElement("a");
                    t.href = e;
                    return t.href;
                };
            });
            ace.define("ace/lib/event_emitter", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                var n = {};
                var r = function() {
                    this.propagationStopped = true;
                };
                var s = function() {
                    this.defaultPrevented = true;
                };
                n._emit = n._dispatchEvent = function(e, t) {
                    this._eventRegistry || (this._eventRegistry = {});
                    this._defaultHandlers || (this._defaultHandlers = {});
                    var i = this._eventRegistry[e] || [];
                    var n = this._defaultHandlers[e];
                    if (!i.length && !n) return;
                    if (typeof t != "object" || !t) t = {};
                    if (!t.type) t.type = e;
                    if (!t.stopPropagation) t.stopPropagation = r;
                    if (!t.preventDefault) t.preventDefault = s;
                    i = i.slice();
                    for(var o = 0; o < i.length; o++){
                        i[o](t, this);
                        if (t.propagationStopped) break;
                    }
                    if (n && !t.defaultPrevented) return n(t, this);
                };
                n._signal = function(e, t) {
                    var i = (this._eventRegistry || {})[e];
                    if (!i) return;
                    i = i.slice();
                    for(var n = 0; n < i.length; n++)i[n](t, this);
                };
                n.once = function(e, t) {
                    var i = this;
                    this.on(e, function n() {
                        i.off(e, n);
                        t.apply(null, arguments);
                    });
                    if (!t) {
                        return new Promise(function(e) {
                            t = e;
                        });
                    }
                };
                n.setDefaultHandler = function(e, t) {
                    var i = this._defaultHandlers;
                    if (!i) i = this._defaultHandlers = {
                        _disabled_: {}
                    };
                    if (i[e]) {
                        var n = i[e];
                        var r = i._disabled_[e];
                        if (!r) i._disabled_[e] = r = [];
                        r.push(n);
                        var s = r.indexOf(t);
                        if (s != -1) r.splice(s, 1);
                    }
                    i[e] = t;
                };
                n.removeDefaultHandler = function(e, t) {
                    var i = this._defaultHandlers;
                    if (!i) return;
                    var n = i._disabled_[e];
                    if (i[e] == t) {
                        if (n) this.setDefaultHandler(e, n.pop());
                    } else if (n) {
                        var r = n.indexOf(t);
                        if (r != -1) n.splice(r, 1);
                    }
                };
                n.on = n.addEventListener = function(e, t, i) {
                    this._eventRegistry = this._eventRegistry || {};
                    var n = this._eventRegistry[e];
                    if (!n) n = this._eventRegistry[e] = [];
                    if (n.indexOf(t) == -1) n[i ? "unshift" : "push"](t);
                    return t;
                };
                n.off = n.removeListener = n.removeEventListener = function(e, t) {
                    this._eventRegistry = this._eventRegistry || {};
                    var i = this._eventRegistry[e];
                    if (!i) return;
                    var n = i.indexOf(t);
                    if (n !== -1) i.splice(n, 1);
                };
                n.removeAllListeners = function(e) {
                    if (!e) this._eventRegistry = this._defaultHandlers = undefined;
                    if (this._eventRegistry) this._eventRegistry[e] = undefined;
                    if (this._defaultHandlers) this._defaultHandlers[e] = undefined;
                };
                t.EventEmitter = n;
            });
            ace.define("ace/lib/app_config", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter", 
            ], function(e, t, i) {
                "no use strict";
                var n = e("./oop");
                var r = e("./event_emitter").EventEmitter;
                var s = {
                    setOptions: function(e) {
                        Object.keys(e).forEach(function(t) {
                            this.setOption(t, e[t]);
                        }, this);
                    },
                    getOptions: function(e) {
                        var t = {};
                        if (!e) {
                            var i = this.$options;
                            e = Object.keys(i).filter(function(e) {
                                return !i[e].hidden;
                            });
                        } else if (!Array.isArray(e)) {
                            t = e;
                            e = Object.keys(t);
                        }
                        e.forEach(function(e) {
                            t[e] = this.getOption(e);
                        }, this);
                        return t;
                    },
                    setOption: function(e, t) {
                        if (this["$" + e] === t) return;
                        var i = this.$options[e];
                        if (!i) {
                            return o('misspelled option "' + e + '"');
                        }
                        if (i.forwardTo) return (this[i.forwardTo] && this[i.forwardTo].setOption(e, t));
                        if (!i.handlesSet) this["$" + e] = t;
                        if (i && i.set) i.set.call(this, t);
                    },
                    getOption: function(e) {
                        var t = this.$options[e];
                        if (!t) {
                            return o('misspelled option "' + e + '"');
                        }
                        if (t.forwardTo) return (this[t.forwardTo] && this[t.forwardTo].getOption(e));
                        return t && t.get ? t.get.call(this) : this["$" + e];
                    }
                };
                function o(e) {
                    if (typeof console != "undefined" && console.warn) console.warn.apply(console, arguments);
                }
                function a(e, t) {
                    var i = new Error(e);
                    i.data = t;
                    if (typeof console == "object" && console.error) console.error(i);
                    setTimeout(function() {
                        throw i;
                    });
                }
                var l = function() {
                    this.$defaultOptions = {};
                };
                (function() {
                    n.implement(this, r);
                    this.defineOptions = function(e, t, i) {
                        if (!e.$options) this.$defaultOptions[t] = e.$options = {};
                        Object.keys(i).forEach(function(t) {
                            var n = i[t];
                            if (typeof n == "string") n = {
                                forwardTo: n
                            };
                            n.name || (n.name = t);
                            e.$options[n.name] = n;
                            if ("initialValue" in n) e["$" + n.name] = n.initialValue;
                        });
                        n.implement(e, s);
                        return this;
                    };
                    this.resetOptions = function(e) {
                        Object.keys(e.$options).forEach(function(t) {
                            var i = e.$options[t];
                            if ("value" in i) e.setOption(t, i.value);
                        });
                    };
                    this.setDefaultValue = function(e, t, i) {
                        if (!e) {
                            for(e in this.$defaultOptions)if (this.$defaultOptions[e][t]) break;
                            if (!this.$defaultOptions[e][t]) return false;
                        }
                        var n = this.$defaultOptions[e] || (this.$defaultOptions[e] = {});
                        if (n[t]) {
                            if (n.forwardTo) this.setDefaultValue(n.forwardTo, t, i);
                            else n[t].value = i;
                        }
                    };
                    this.setDefaultValues = function(e, t) {
                        Object.keys(t).forEach(function(i) {
                            this.setDefaultValue(e, i, t[i]);
                        }, this);
                    };
                    this.warn = o;
                    this.reportError = a;
                }.call(l.prototype));
                t.AppConfig = l;
            });
            ace.define("ace/config", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/lib/net",
                "ace/lib/dom",
                "ace/lib/app_config", 
            ], function(e, t, n) {
                "no use strict";
                var r = e("./lib/lang");
                var s = e("./lib/oop");
                var o = e("./lib/net");
                var a = e("./lib/dom");
                var l = e("./lib/app_config").AppConfig;
                n.exports = t = new l();
                var h = (function() {
                    return this || (typeof window != "undefined" && window);
                })();
                var c = {
                    packaged: false,
                    workerPath: null,
                    modePath: null,
                    themePath: null,
                    basePath: "",
                    suffix: ".js",
                    $moduleUrls: {},
                    loadWorkerFromBlob: true,
                    sharedPopups: false,
                    useStrictCSP: null
                };
                t.get = function(e) {
                    if (!c.hasOwnProperty(e)) throw new Error("Unknown config key: " + e);
                    return c[e];
                };
                t.set = function(e, t) {
                    if (c.hasOwnProperty(e)) c[e] = t;
                    else if (this.setDefaultValue("", e, t) == false) throw new Error("Unknown config key: " + e);
                    if (e == "useStrictCSP") a.useStrictCSP(t);
                };
                t.all = function() {
                    return r.copyObject(c);
                };
                t.$modes = {};
                t.moduleUrl = function(e, t) {
                    if (c.$moduleUrls[e]) return c.$moduleUrls[e];
                    var i = e.split("/");
                    t = t || i[i.length - 2] || "";
                    var n = t == "snippets" ? "/" : "-";
                    var r = i[i.length - 1];
                    if (t == "worker" && n == "-") {
                        var s = new RegExp("^" + t + "[\\-_]|[\\-_]" + t + "$", "g");
                        r = r.replace(s, "");
                    }
                    if ((!r || r == t) && i.length > 1) r = i[i.length - 2];
                    var o = c[t + "Path"];
                    if (o == null) {
                        o = c.basePath;
                    } else if (n == "/") {
                        t = n = "";
                    }
                    if (o && o.slice(-1) != "/") o += "/";
                    return (o + t + n + r + this.get("suffix"));
                };
                t.setModuleUrl = function(e, t) {
                    return (c.$moduleUrls[e] = t);
                };
                t.$loading = {};
                t.loadModule = function(i, n) {
                    var r, s;
                    if (Array.isArray(i)) {
                        s = i[0];
                        i = i[1];
                    }
                    try {
                        r = e(i);
                    } catch (a) {}
                    if (r && !t.$loading[i]) return n && n(r);
                    if (!t.$loading[i]) t.$loading[i] = [];
                    t.$loading[i].push(n);
                    if (t.$loading[i].length > 1) return;
                    var l = function() {
                        e([
                            i
                        ], function(e) {
                            t._emit("load.module", {
                                name: i,
                                module: e
                            });
                            var n = t.$loading[i];
                            t.$loading[i] = null;
                            n.forEach(function(t) {
                                t && t(e);
                            });
                        });
                    };
                    if (!t.get("packaged")) return l();
                    o.loadScript(t.moduleUrl(i, s), l);
                    u();
                };
                var u = function() {
                    if (!c.basePath && !c.workerPath && !c.modePath && !c.themePath && !Object.keys(c.$moduleUrls).length) {
                        console.error("Unable to infer path to ace from script src,", "use ace.config.set('basePath', 'path') to enable dynamic loading of modes and themes", "or with webpack use ace/webpack-resolver");
                        u = function() {};
                    }
                };
                d(true);
                function d(r) {
                    if (!h || !h.document) return;
                    c.packaged = r || e.packaged || n.packaged || (h.define && i.amdD.packaged);
                    var s = {};
                    var o = "";
                    var a = document.currentScript || document._currentScript;
                    var l = (a && a.ownerDocument) || document;
                    var u = l.getElementsByTagName("script");
                    for(var d = 0; d < u.length; d++){
                        var g = u[d];
                        var m = g.src || g.getAttribute("src");
                        if (!m) continue;
                        var v = g.attributes;
                        for(var p = 0, w = v.length; p < w; p++){
                            var $ = v[p];
                            if ($.name.indexOf("data-ace-") === 0) {
                                s[f($.name.replace(/^data-ace-/, ""))] = $.value;
                            }
                        }
                        var b = m.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
                        if (b) o = b[1];
                    }
                    if (o) {
                        s.base = s.base || o;
                        s.packaged = true;
                    }
                    s.basePath = s.base;
                    s.workerPath = s.workerPath || s.base;
                    s.modePath = s.modePath || s.base;
                    s.themePath = s.themePath || s.base;
                    delete s.base;
                    for(var y in s)if (typeof s[y] !== "undefined") t.set(y, s[y]);
                }
                t.init = d;
                function f(e) {
                    return e.replace(/-(.)/g, function(e, t) {
                        return t.toUpperCase();
                    });
                }
                t.version = "1.4.13";
            });
            ace.define("ace/mouse/mouse_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent",
                "ace/mouse/default_handlers",
                "ace/mouse/default_gutter_handler",
                "ace/mouse/mouse_event",
                "ace/mouse/dragdrop_handler",
                "ace/mouse/touch_handler",
                "ace/config", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/event");
                var r = e("../lib/useragent");
                var s = e("./default_handlers").DefaultHandlers;
                var o = e("./default_gutter_handler").GutterHandler;
                var a = e("./mouse_event").MouseEvent;
                var l = e("./dragdrop_handler").DragdropHandler;
                var h = e("./touch_handler").addTouchListeners;
                var c = e("../config");
                var u = function(e) {
                    var t = this;
                    this.editor = e;
                    new s(this);
                    new o(this);
                    new l(this);
                    var i = function(t) {
                        var i = !document.hasFocus || !document.hasFocus() || (!e.isFocused() && document.activeElement == (e.textInput && e.textInput.getElement()));
                        if (i) window.focus();
                        e.focus();
                    };
                    var a = e.renderer.getMouseEventTarget();
                    n.addListener(a, "click", this.onMouseEvent.bind(this, "click"), e);
                    n.addListener(a, "mousemove", this.onMouseMove.bind(this, "mousemove"), e);
                    n.addMultiMouseDownListener([
                        a,
                        e.renderer.scrollBarV && e.renderer.scrollBarV.inner,
                        e.renderer.scrollBarH && e.renderer.scrollBarH.inner,
                        e.textInput && e.textInput.getElement(), 
                    ].filter(Boolean), [
                        400,
                        300,
                        250
                    ], this, "onMouseEvent", e);
                    n.addMouseWheelListener(e.container, this.onMouseWheel.bind(this, "mousewheel"), e);
                    h(e.container, e);
                    var c = e.renderer.$gutter;
                    n.addListener(c, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"), e);
                    n.addListener(c, "click", this.onMouseEvent.bind(this, "gutterclick"), e);
                    n.addListener(c, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"), e);
                    n.addListener(c, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"), e);
                    n.addListener(a, "mousedown", i, e);
                    n.addListener(c, "mousedown", i, e);
                    if (r.isIE && e.renderer.scrollBarV) {
                        n.addListener(e.renderer.scrollBarV.element, "mousedown", i, e);
                        n.addListener(e.renderer.scrollBarH.element, "mousedown", i, e);
                    }
                    e.on("mousemove", function(i) {
                        if (t.state || t.$dragDelay || !t.$dragEnabled) return;
                        var n = e.renderer.screenToTextCoordinates(i.x, i.y);
                        var r = e.session.selection.getRange();
                        var s = e.renderer;
                        if (!r.isEmpty() && r.insideStart(n.row, n.column)) {
                            s.setCursorStyle("default");
                        } else {
                            s.setCursorStyle("");
                        }
                    }, e);
                };
                (function() {
                    this.onMouseEvent = function(e, t) {
                        if (!this.editor.session) return;
                        this.editor._emit(e, new a(t, this.editor));
                    };
                    this.onMouseMove = function(e, t) {
                        var i = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
                        if (!i || !i.length) return;
                        this.editor._emit(e, new a(t, this.editor));
                    };
                    this.onMouseWheel = function(e, t) {
                        var i = new a(t, this.editor);
                        i.speed = this.$scrollSpeed * 2;
                        i.wheelX = t.wheelX;
                        i.wheelY = t.wheelY;
                        this.editor._emit(e, i);
                    };
                    this.setState = function(e) {
                        this.state = e;
                    };
                    this.captureMouse = function(e, t) {
                        this.x = e.x;
                        this.y = e.y;
                        this.isMousePressed = true;
                        var i = this.editor;
                        var s = this.editor.renderer;
                        s.$isMousePressed = true;
                        var o = this;
                        var l = function(e) {
                            if (!e) return;
                            if (r.isWebKit && !e.which && o.releaseMouse) return o.releaseMouse();
                            o.x = e.clientX;
                            o.y = e.clientY;
                            t && t(e);
                            o.mouseEvent = new a(e, o.editor);
                            o.$mouseMoved = true;
                        };
                        var h = function(e) {
                            i.off("beforeEndOperation", u);
                            clearInterval(d);
                            if (i.session) c();
                            o[o.state + "End"] && o[o.state + "End"](e);
                            o.state = "";
                            o.isMousePressed = s.$isMousePressed = false;
                            if (s.$keepTextAreaAtCursor) s.$moveTextAreaToCursor();
                            o.$onCaptureMouseMove = o.releaseMouse = null;
                            e && o.onMouseEvent("mouseup", e);
                            i.endOperation();
                        };
                        var c = function() {
                            o[o.state] && o[o.state]();
                            o.$mouseMoved = false;
                        };
                        if (r.isOldIE && e.domEvent.type == "dblclick") {
                            return setTimeout(function() {
                                h(e);
                            });
                        }
                        var u = function(e) {
                            if (!o.releaseMouse) return;
                            if (i.curOp.command.name && i.curOp.selectionChanged) {
                                o[o.state + "End"] && o[o.state + "End"]();
                                o.state = "";
                                o.releaseMouse();
                            }
                        };
                        i.on("beforeEndOperation", u);
                        i.startOperation({
                            command: {
                                name: "mouse"
                            }
                        });
                        o.$onCaptureMouseMove = l;
                        o.releaseMouse = n.capture(this.editor.container, l, h);
                        var d = setInterval(c, 20);
                    };
                    this.releaseMouse = null;
                    this.cancelContextMenu = function() {
                        var e = function(t) {
                            if (t && t.domEvent && t.domEvent.type != "contextmenu") return;
                            this.editor.off("nativecontextmenu", e);
                            if (t && t.domEvent) n.stopEvent(t.domEvent);
                        }.bind(this);
                        setTimeout(e, 10);
                        this.editor.on("nativecontextmenu", e);
                    };
                    this.destroy = function() {
                        if (this.releaseMouse) this.releaseMouse();
                    };
                }.call(u.prototype));
                c.defineOptions(u.prototype, "mouseHandler", {
                    scrollSpeed: {
                        initialValue: 2
                    },
                    dragDelay: {
                        initialValue: r.isMac ? 150 : 0
                    },
                    dragEnabled: {
                        initialValue: true
                    },
                    focusTimeout: {
                        initialValue: 0
                    },
                    tooltipFollowsMouse: {
                        initialValue: true
                    }
                });
                t.MouseHandler = u;
            });
            ace.define("ace/mouse/fold_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/dom");
                function r(e) {
                    e.on("click", function(t) {
                        var i = t.getDocumentPosition();
                        var r = e.session;
                        var s = r.getFoldAt(i.row, i.column, 1);
                        if (s) {
                            if (t.getAccelKey()) r.removeFold(s);
                            else r.expandFold(s);
                            t.stop();
                        }
                        var o = t.domEvent && t.domEvent.target;
                        if (o && n.hasCssClass(o, "ace_inline_button")) {
                            if (n.hasCssClass(o, "ace_toggle_wrap")) {
                                r.setOption("wrap", !r.getUseWrapMode());
                                e.renderer.scrollCursorIntoView();
                            }
                        }
                    });
                    e.on("gutterclick", function(t) {
                        var i = e.renderer.$gutterLayer.getRegion(t);
                        if (i == "foldWidgets") {
                            var n = t.getDocumentPosition().row;
                            var r = e.session;
                            if (r.foldWidgets && r.foldWidgets[n]) e.session.onFoldWidgetClick(n, t);
                            if (!e.isFocused()) e.focus();
                            t.stop();
                        }
                    });
                    e.on("gutterdblclick", function(t) {
                        var i = e.renderer.$gutterLayer.getRegion(t);
                        if (i == "foldWidgets") {
                            var n = t.getDocumentPosition().row;
                            var r = e.session;
                            var s = r.getParentFoldRangeData(n, true);
                            var o = s.range || s.firstRange;
                            if (o) {
                                n = o.start.row;
                                var a = r.getFoldAt(n, r.getLine(n).length, 1);
                                if (a) {
                                    r.removeFold(a);
                                } else {
                                    r.addFold("...", o);
                                    e.renderer.scrollCursorIntoView({
                                        row: o.start.row,
                                        column: 0
                                    });
                                }
                            }
                            t.stop();
                        }
                    });
                }
                t.FoldHandler = r;
            });
            ace.define("ace/keyboard/keybinding", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/event", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/keys");
                var r = e("../lib/event");
                var s = function(e) {
                    this.$editor = e;
                    this.$data = {
                        editor: e
                    };
                    this.$handlers = [];
                    this.setDefaultHandler(e.commands);
                };
                (function() {
                    this.setDefaultHandler = function(e) {
                        this.removeKeyboardHandler(this.$defaultHandler);
                        this.$defaultHandler = e;
                        this.addKeyboardHandler(e, 0);
                    };
                    this.setKeyboardHandler = function(e) {
                        var t = this.$handlers;
                        if (t[t.length - 1] == e) return;
                        while(t[t.length - 1] && t[t.length - 1] != this.$defaultHandler)this.removeKeyboardHandler(t[t.length - 1]);
                        this.addKeyboardHandler(e, 1);
                    };
                    this.addKeyboardHandler = function(e, t) {
                        if (!e) return;
                        if (typeof e == "function" && !e.handleKeyboard) e.handleKeyboard = e;
                        var i = this.$handlers.indexOf(e);
                        if (i != -1) this.$handlers.splice(i, 1);
                        if (t == undefined) this.$handlers.push(e);
                        else this.$handlers.splice(t, 0, e);
                        if (i == -1 && e.attach) e.attach(this.$editor);
                    };
                    this.removeKeyboardHandler = function(e) {
                        var t = this.$handlers.indexOf(e);
                        if (t == -1) return false;
                        this.$handlers.splice(t, 1);
                        e.detach && e.detach(this.$editor);
                        return true;
                    };
                    this.getKeyboardHandler = function() {
                        return this.$handlers[this.$handlers.length - 1];
                    };
                    this.getStatusText = function() {
                        var e = this.$data;
                        var t = e.editor;
                        return this.$handlers.map(function(i) {
                            return ((i.getStatusText && i.getStatusText(t, e)) || "");
                        }).filter(Boolean).join(" ");
                    };
                    this.$callKeyboardHandlers = function(e, t, i, n) {
                        var s;
                        var o = false;
                        var a = this.$editor.commands;
                        for(var l = this.$handlers.length; l--;){
                            s = this.$handlers[l].handleKeyboard(this.$data, e, t, i, n);
                            if (!s || !s.command) continue;
                            if (s.command == "null") {
                                o = true;
                            } else {
                                o = a.exec(s.command, this.$editor, s.args, n);
                            }
                            if (o && n && e != -1 && s.passEvent != true && s.command.passEvent != true) {
                                r.stopEvent(n);
                            }
                            if (o) break;
                        }
                        if (!o && e == -1) {
                            s = {
                                command: "insertstring"
                            };
                            o = a.exec("insertstring", this.$editor, t);
                        }
                        if (o && this.$editor._signal) this.$editor._signal("keyboardActivity", s);
                        return o;
                    };
                    this.onCommandKey = function(e, t, i) {
                        var r = n.keyCodeToString(i);
                        return this.$callKeyboardHandlers(t, r, i, e);
                    };
                    this.onTextInput = function(e) {
                        return this.$callKeyboardHandlers(-1, e);
                    };
                }.call(s.prototype));
                t.KeyBinding = s;
            });
            ace.define("ace/lib/bidiutil", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                var n = [
                    "\u0621",
                    "\u0641"
                ];
                var r = [
                    "\u063A",
                    "\u064a"
                ];
                var s = 0, o = 0;
                var a = false, l = false, h = false, c = false, u = false, d = false;
                var f = [
                    [
                        0,
                        3,
                        0,
                        1,
                        0,
                        0,
                        0
                    ],
                    [
                        0,
                        3,
                        0,
                        1,
                        2,
                        2,
                        0
                    ],
                    [
                        0,
                        3,
                        0,
                        0x11,
                        2,
                        0,
                        1
                    ],
                    [
                        0,
                        3,
                        5,
                        5,
                        4,
                        1,
                        0
                    ],
                    [
                        0,
                        3,
                        0x15,
                        0x15,
                        4,
                        0,
                        1
                    ],
                    [
                        0,
                        3,
                        5,
                        5,
                        4,
                        2,
                        0
                    ], 
                ];
                var g = [
                    [
                        2,
                        0,
                        1,
                        1,
                        0,
                        1,
                        0
                    ],
                    [
                        2,
                        0,
                        1,
                        1,
                        0,
                        2,
                        0
                    ],
                    [
                        2,
                        0,
                        2,
                        1,
                        3,
                        2,
                        0
                    ],
                    [
                        2,
                        0,
                        2,
                        0x21,
                        3,
                        1,
                        1
                    ], 
                ];
                var m = 0, v = 1;
                var p = 0;
                var w = 1;
                var $ = 2;
                var b = 3;
                var y = 4;
                var C = 5;
                var S = 6;
                var k = 7;
                var x = 8;
                var A = 9;
                var L = 10;
                var R = 11;
                var M = 12;
                var E = 13;
                var T = 14;
                var _ = 15;
                var F = 16;
                var I = 17;
                var O = 18;
                var W = [
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    S,
                    C,
                    S,
                    x,
                    C,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    C,
                    C,
                    C,
                    S,
                    x,
                    y,
                    y,
                    R,
                    R,
                    R,
                    y,
                    y,
                    y,
                    y,
                    y,
                    L,
                    A,
                    L,
                    A,
                    A,
                    $,
                    $,
                    $,
                    $,
                    $,
                    $,
                    $,
                    $,
                    $,
                    $,
                    A,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    p,
                    y,
                    y,
                    y,
                    y,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    C,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    O,
                    A,
                    y,
                    R,
                    R,
                    R,
                    R,
                    y,
                    y,
                    y,
                    y,
                    p,
                    y,
                    y,
                    O,
                    y,
                    y,
                    R,
                    R,
                    $,
                    $,
                    y,
                    p,
                    y,
                    y,
                    y,
                    $,
                    p,
                    y,
                    y,
                    y,
                    y,
                    y, 
                ];
                var D = [
                    x,
                    x,
                    x,
                    x,
                    x,
                    x,
                    x,
                    x,
                    x,
                    x,
                    x,
                    O,
                    O,
                    O,
                    p,
                    w,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    x,
                    C,
                    E,
                    T,
                    _,
                    F,
                    I,
                    A,
                    R,
                    R,
                    R,
                    R,
                    R,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    A,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    y,
                    x, 
                ];
                function B(e, t, i, n) {
                    var r = s ? g : f, u = null, d = null, m = null, v = 0, p = null, w = null, $ = -1, b = null, y = null, k = [];
                    if (!n) {
                        for(b = 0, n = []; b < i; b++){
                            n[b] = N(e[b]);
                        }
                    }
                    o = s;
                    a = false;
                    l = false;
                    h = false;
                    c = false;
                    for(y = 0; y < i; y++){
                        u = v;
                        k[y] = d = P(e, n, k, y);
                        v = r[u][d];
                        p = v & 0xf0;
                        v &= 0x0f;
                        t[y] = m = r[v][5];
                        if (p > 0) {
                            if (p == 0x10) {
                                for(b = $; b < y; b++){
                                    t[b] = 1;
                                }
                                $ = -1;
                            } else {
                                $ = -1;
                            }
                        }
                        w = r[v][6];
                        if (w) {
                            if ($ == -1) {
                                $ = y;
                            }
                        } else {
                            if ($ > -1) {
                                for(b = $; b < y; b++){
                                    t[b] = m;
                                }
                                $ = -1;
                            }
                        }
                        if (n[y] == C) {
                            t[y] = 0;
                        }
                        o |= m;
                    }
                    if (c) {
                        for(b = 0; b < i; b++){
                            if (n[b] == S) {
                                t[b] = s;
                                for(var A = b - 1; A >= 0; A--){
                                    if (n[A] == x) {
                                        t[A] = s;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                function H(e, t, i) {
                    if (o < e) {
                        return;
                    }
                    if (e == 1 && s == v && !h) {
                        i.reverse();
                        return;
                    }
                    var n = i.length, r = 0, a, l, c, u;
                    while(r < n){
                        if (t[r] >= e) {
                            a = r + 1;
                            while(a < n && t[a] >= e){
                                a++;
                            }
                            for(l = r, c = a - 1; l < c; l++, c--){
                                u = i[l];
                                i[l] = i[c];
                                i[c] = u;
                            }
                            r = a;
                        }
                        r++;
                    }
                }
                function P(e, t, i, n) {
                    var r = t[n], o, u, d, f;
                    switch(r){
                        case p:
                        case w:
                            a = false;
                        case y:
                        case b:
                            return r;
                        case $:
                            return a ? b : $;
                        case k:
                            a = true;
                            l = true;
                            return w;
                        case x:
                            return y;
                        case A:
                            if (n < 1 || n + 1 >= t.length || ((o = i[n - 1]) != $ && o != b) || ((u = t[n + 1]) != $ && u != b)) {
                                return y;
                            }
                            if (a) {
                                u = b;
                            }
                            return u == o ? u : y;
                        case L:
                            o = n > 0 ? i[n - 1] : C;
                            if (o == $ && n + 1 < t.length && t[n + 1] == $) {
                                return $;
                            }
                            return y;
                        case R:
                            if (n > 0 && i[n - 1] == $) {
                                return $;
                            }
                            if (a) {
                                return y;
                            }
                            f = n + 1;
                            d = t.length;
                            while(f < d && t[f] == R){
                                f++;
                            }
                            if (f < d && t[f] == $) {
                                return $;
                            }
                            return y;
                        case M:
                            d = t.length;
                            f = n + 1;
                            while(f < d && t[f] == M){
                                f++;
                            }
                            if (f < d) {
                                var g = e[n], m = (g >= 0x0591 && g <= 0x08ff) || g == 0xfb1e;
                                o = t[f];
                                if (m && (o == w || o == k)) {
                                    return w;
                                }
                            }
                            if (n < 1 || (o = t[n - 1]) == C) {
                                return y;
                            }
                            return i[n - 1];
                        case C:
                            a = false;
                            h = true;
                            return s;
                        case S:
                            c = true;
                            return y;
                        case E:
                        case T:
                        case F:
                        case I:
                        case _:
                            a = false;
                        case O:
                            return y;
                    }
                }
                function N(e) {
                    var t = e.charCodeAt(0), i = t >> 8;
                    if (i == 0) {
                        return t > 0x00bf ? p : W[t];
                    } else if (i == 5) {
                        return /[\u0591-\u05f4]/.test(e) ? w : p;
                    } else if (i == 6) {
                        if (/[\u0610-\u061a\u064b-\u065f\u06d6-\u06e4\u06e7-\u06ed]/.test(e)) return M;
                        else if (/[\u0660-\u0669\u066b-\u066c]/.test(e)) return b;
                        else if (t == 0x066a) return R;
                        else if (/[\u06f0-\u06f9]/.test(e)) return $;
                        else return k;
                    } else if (i == 0x20 && t <= 0x205f) {
                        return D[t & 0xff];
                    } else if (i == 0xfe) {
                        return t >= 0xfe70 ? k : y;
                    }
                    return y;
                }
                function z(e) {
                    return e >= "\u064b" && e <= "\u0655";
                }
                t.L = p;
                t.R = w;
                t.EN = $;
                t.ON_R = 3;
                t.AN = 4;
                t.R_H = 5;
                t.B = 6;
                t.RLE = 7;
                t.DOT = "\xB7";
                t.doBidiReorder = function(e, i, n) {
                    if (e.length < 2) return {};
                    var r = e.split(""), o = new Array(r.length), a = new Array(r.length), l = [];
                    s = n ? v : m;
                    B(r, l, r.length, i);
                    for(var h = 0; h < o.length; o[h] = h, h++);
                    H(2, l, o);
                    H(1, l, o);
                    for(var h = 0; h < o.length - 1; h++){
                        if (i[h] === b) {
                            l[h] = t.AN;
                        } else if (l[h] === w && ((i[h] > k && i[h] < E) || i[h] === y || i[h] === O)) {
                            l[h] = t.ON_R;
                        } else if (h > 0 && r[h - 1] === "\u0644" && /\u0622|\u0623|\u0625|\u0627/.test(r[h])) {
                            l[h - 1] = l[h] = t.R_H;
                            h++;
                        }
                    }
                    if (r[r.length - 1] === t.DOT) l[r.length - 1] = t.B;
                    if (r[0] === "\u202B") l[0] = t.RLE;
                    for(var h = 0; h < o.length; h++){
                        a[h] = l[o[h]];
                    }
                    return {
                        logicalFromVisual: o,
                        bidiLevels: a
                    };
                };
                t.hasBidiCharacters = function(e, t) {
                    var i = false;
                    for(var n = 0; n < e.length; n++){
                        t[n] = N(e.charAt(n));
                        if (!i && (t[n] == w || t[n] == k || t[n] == b)) i = true;
                    }
                    return i;
                };
                t.getVisualFromLogicalIdx = function(e, t) {
                    for(var i = 0; i < t.logicalFromVisual.length; i++){
                        if (t.logicalFromVisual[i] == e) return i;
                    }
                    return 0;
                };
            });
            ace.define("ace/bidihandler", [
                "require",
                "exports",
                "module",
                "ace/lib/bidiutil",
                "ace/lib/lang", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/bidiutil");
                var r = e("./lib/lang");
                var s = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\u202B]/;
                var o = function(e) {
                    this.session = e;
                    this.bidiMap = {};
                    this.currentRow = null;
                    this.bidiUtil = n;
                    this.charWidths = [];
                    this.EOL = "\xAC";
                    this.showInvisibles = true;
                    this.isRtlDir = false;
                    this.$isRtl = false;
                    this.line = "";
                    this.wrapIndent = 0;
                    this.EOF = "\xB6";
                    this.RLE = "\u202B";
                    this.contentWidth = 0;
                    this.fontMetrics = null;
                    this.rtlLineOffset = 0;
                    this.wrapOffset = 0;
                    this.isMoveLeftOperation = false;
                    this.seenBidi = s.test(e.getValue());
                };
                (function() {
                    this.isBidiRow = function(e, t, i) {
                        if (!this.seenBidi) return false;
                        if (e !== this.currentRow) {
                            this.currentRow = e;
                            this.updateRowLine(t, i);
                            this.updateBidiMap();
                        }
                        return this.bidiMap.bidiLevels;
                    };
                    this.onChange = function(e) {
                        if (!this.seenBidi) {
                            if (e.action == "insert" && s.test(e.lines.join("\n"))) {
                                this.seenBidi = true;
                                this.currentRow = null;
                            }
                        } else {
                            this.currentRow = null;
                        }
                    };
                    this.getDocumentRow = function() {
                        var e = 0;
                        var t = this.session.$screenRowCache;
                        if (t.length) {
                            var i = this.session.$getRowCacheIndex(t, this.currentRow);
                            if (i >= 0) e = this.session.$docRowCache[i];
                        }
                        return e;
                    };
                    this.getSplitIndex = function() {
                        var e = 0;
                        var t = this.session.$screenRowCache;
                        if (t.length) {
                            var i, n = this.session.$getRowCacheIndex(t, this.currentRow);
                            while(this.currentRow - e > 0){
                                i = this.session.$getRowCacheIndex(t, this.currentRow - e - 1);
                                if (i !== n) break;
                                n = i;
                                e++;
                            }
                        } else {
                            e = this.currentRow;
                        }
                        return e;
                    };
                    this.updateRowLine = function(e, t) {
                        if (e === undefined) e = this.getDocumentRow();
                        var i = e === this.session.getLength() - 1, s = i ? this.EOF : this.EOL;
                        this.wrapIndent = 0;
                        this.line = this.session.getLine(e);
                        this.isRtlDir = this.$isRtl || this.line.charAt(0) === this.RLE;
                        if (this.session.$useWrapMode) {
                            var o = this.session.$wrapData[e];
                            if (o) {
                                if (t === undefined) t = this.getSplitIndex();
                                if (t > 0 && o.length) {
                                    this.wrapIndent = o.indent;
                                    this.wrapOffset = this.wrapIndent * this.charWidths[n.L];
                                    this.line = t < o.length ? this.line.substring(o[t - 1], o[t]) : this.line.substring(o[o.length - 1]);
                                } else {
                                    this.line = this.line.substring(0, o[t]);
                                }
                            }
                            if (t == o.length) this.line += this.showInvisibles ? s : n.DOT;
                        } else {
                            this.line += this.showInvisibles ? s : n.DOT;
                        }
                        var a = this.session, l = 0, h;
                        this.line = this.line.replace(/\t|[\u1100-\u2029, \u202F-\uFFE6]/g, function(e, t) {
                            if (e === "\t" || a.isFullWidth(e.charCodeAt(0))) {
                                h = e === "\t" ? a.getScreenTabSize(t + l) : 2;
                                l += h - 1;
                                return r.stringRepeat(n.DOT, h);
                            }
                            return e;
                        });
                        if (this.isRtlDir) {
                            this.fontMetrics.$main.textContent = this.line.charAt(this.line.length - 1) == n.DOT ? this.line.substr(0, this.line.length - 1) : this.line;
                            this.rtlLineOffset = this.contentWidth - this.fontMetrics.$main.getBoundingClientRect().width;
                        }
                    };
                    this.updateBidiMap = function() {
                        var e = [];
                        if (n.hasBidiCharacters(this.line, e) || this.isRtlDir) {
                            this.bidiMap = n.doBidiReorder(this.line, e, this.isRtlDir);
                        } else {
                            this.bidiMap = {};
                        }
                    };
                    this.markAsDirty = function() {
                        this.currentRow = null;
                    };
                    this.updateCharacterWidths = function(e) {
                        if (this.characterWidth === e.$characterSize.width) return;
                        this.fontMetrics = e;
                        var t = (this.characterWidth = e.$characterSize.width);
                        var i = e.$measureCharWidth("\u05d4");
                        this.charWidths[n.L] = this.charWidths[n.EN] = this.charWidths[n.ON_R] = t;
                        this.charWidths[n.R] = this.charWidths[n.AN] = i;
                        this.charWidths[n.R_H] = i * 0.45;
                        this.charWidths[n.B] = this.charWidths[n.RLE] = 0;
                        this.currentRow = null;
                    };
                    this.setShowInvisibles = function(e) {
                        this.showInvisibles = e;
                        this.currentRow = null;
                    };
                    this.setEolChar = function(e) {
                        this.EOL = e;
                    };
                    this.setContentWidth = function(e) {
                        this.contentWidth = e;
                    };
                    this.isRtlLine = function(e) {
                        if (this.$isRtl) return true;
                        if (e != undefined) return (this.session.getLine(e).charAt(0) == this.RLE);
                        else return this.isRtlDir;
                    };
                    this.setRtlDirection = function(e, t) {
                        var i = e.getCursorPosition();
                        for(var n = e.selection.getSelectionAnchor().row; n <= i.row; n++){
                            if (!t && e.session.getLine(n).charAt(0) === e.session.$bidiHandler.RLE) e.session.doc.removeInLine(n, 0, 1);
                            else if (t && e.session.getLine(n).charAt(0) !== e.session.$bidiHandler.RLE) e.session.doc.insert({
                                column: 0,
                                row: n
                            }, e.session.$bidiHandler.RLE);
                        }
                    };
                    this.getPosLeft = function(e) {
                        e -= this.wrapIndent;
                        var t = this.line.charAt(0) === this.RLE ? 1 : 0;
                        var i = e > t ? this.session.getOverwrite() ? e : e - 1 : t;
                        var r = n.getVisualFromLogicalIdx(i, this.bidiMap), s = this.bidiMap.bidiLevels, o = 0;
                        if (!this.session.getOverwrite() && e <= t && s[r] % 2 !== 0) r++;
                        for(var a = 0; a < r; a++){
                            o += this.charWidths[s[a]];
                        }
                        if (!this.session.getOverwrite() && e > t && s[r] % 2 === 0) o += this.charWidths[s[r]];
                        if (this.wrapIndent) o += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        if (this.isRtlDir) o += this.rtlLineOffset;
                        return o;
                    };
                    this.getSelections = function(e, t) {
                        var i = this.bidiMap, n = i.bidiLevels, r, s = [], o = 0, a = Math.min(e, t) - this.wrapIndent, l = Math.max(e, t) - this.wrapIndent, h = false, c = false, u = 0;
                        if (this.wrapIndent) o += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        for(var d, f = 0; f < n.length; f++){
                            d = i.logicalFromVisual[f];
                            r = n[f];
                            h = d >= a && d < l;
                            if (h && !c) {
                                u = o;
                            } else if (!h && c) {
                                s.push({
                                    left: u,
                                    width: o - u
                                });
                            }
                            o += this.charWidths[r];
                            c = h;
                        }
                        if (h && f === n.length) {
                            s.push({
                                left: u,
                                width: o - u
                            });
                        }
                        if (this.isRtlDir) {
                            for(var g = 0; g < s.length; g++){
                                s[g].left += this.rtlLineOffset;
                            }
                        }
                        return s;
                    };
                    this.offsetToCol = function(e) {
                        if (this.isRtlDir) e -= this.rtlLineOffset;
                        var t = 0, e = Math.max(e, 0), i = 0, n = 0, r = this.bidiMap.bidiLevels, s = this.charWidths[r[n]];
                        if (this.wrapIndent) e -= this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        while(e > i + s / 2){
                            i += s;
                            if (n === r.length - 1) {
                                s = 0;
                                break;
                            }
                            s = this.charWidths[r[++n]];
                        }
                        if (n > 0 && r[n - 1] % 2 !== 0 && r[n] % 2 === 0) {
                            if (e < i) n--;
                            t = this.bidiMap.logicalFromVisual[n];
                        } else if (n > 0 && r[n - 1] % 2 === 0 && r[n] % 2 !== 0) {
                            t = 1 + (e > i ? this.bidiMap.logicalFromVisual[n] : this.bidiMap.logicalFromVisual[n - 1]);
                        } else if ((this.isRtlDir && n === r.length - 1 && s === 0 && r[n - 1] % 2 === 0) || (!this.isRtlDir && n === 0 && r[n] % 2 !== 0)) {
                            t = 1 + this.bidiMap.logicalFromVisual[n];
                        } else {
                            if (n > 0 && r[n - 1] % 2 !== 0 && s !== 0) n--;
                            t = this.bidiMap.logicalFromVisual[n];
                        }
                        if (t === 0 && this.isRtlDir) t++;
                        return t + this.wrapIndent;
                    };
                }.call(o.prototype));
                t.BidiHandler = o;
            });
            ace.define("ace/selection", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/lib/event_emitter",
                "ace/range", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./lib/lang");
                var s = e("./lib/event_emitter").EventEmitter;
                var o = e("./range").Range;
                var a = function(e) {
                    this.session = e;
                    this.doc = e.getDocument();
                    this.clearSelection();
                    this.cursor = this.lead = this.doc.createAnchor(0, 0);
                    this.anchor = this.doc.createAnchor(0, 0);
                    this.$silent = false;
                    var t = this;
                    this.cursor.on("change", function(e) {
                        t.$cursorChanged = true;
                        if (!t.$silent) t._emit("changeCursor");
                        if (!t.$isEmpty && !t.$silent) t._emit("changeSelection");
                        if (!t.$keepDesiredColumnOnChange && e.old.column != e.value.column) t.$desiredColumn = null;
                    });
                    this.anchor.on("change", function() {
                        t.$anchorChanged = true;
                        if (!t.$isEmpty && !t.$silent) t._emit("changeSelection");
                    });
                };
                (function() {
                    n.implement(this, s);
                    this.isEmpty = function() {
                        return (this.$isEmpty || (this.anchor.row == this.lead.row && this.anchor.column == this.lead.column));
                    };
                    this.isMultiLine = function() {
                        return (!this.$isEmpty && this.anchor.row != this.cursor.row);
                    };
                    this.getCursor = function() {
                        return this.lead.getPosition();
                    };
                    this.setSelectionAnchor = function(e, t) {
                        this.$isEmpty = false;
                        this.anchor.setPosition(e, t);
                    };
                    this.getAnchor = this.getSelectionAnchor = function() {
                        if (this.$isEmpty) return this.getSelectionLead();
                        return this.anchor.getPosition();
                    };
                    this.getSelectionLead = function() {
                        return this.lead.getPosition();
                    };
                    this.isBackwards = function() {
                        var e = this.anchor;
                        var t = this.lead;
                        return (e.row > t.row || (e.row == t.row && e.column > t.column));
                    };
                    this.getRange = function() {
                        var e = this.anchor;
                        var t = this.lead;
                        if (this.$isEmpty) return o.fromPoints(t, t);
                        return this.isBackwards() ? o.fromPoints(t, e) : o.fromPoints(e, t);
                    };
                    this.clearSelection = function() {
                        if (!this.$isEmpty) {
                            this.$isEmpty = true;
                            this._emit("changeSelection");
                        }
                    };
                    this.selectAll = function() {
                        this.$setSelection(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
                    };
                    this.setRange = this.setSelectionRange = function(e, t) {
                        var i = t ? e.end : e.start;
                        var n = t ? e.start : e.end;
                        this.$setSelection(i.row, i.column, n.row, n.column);
                    };
                    this.$setSelection = function(e, t, i, n) {
                        if (this.$silent) return;
                        var r = this.$isEmpty;
                        var s = this.inMultiSelectMode;
                        this.$silent = true;
                        this.$cursorChanged = this.$anchorChanged = false;
                        this.anchor.setPosition(e, t);
                        this.cursor.setPosition(i, n);
                        this.$isEmpty = !o.comparePoints(this.anchor, this.cursor);
                        this.$silent = false;
                        if (this.$cursorChanged) this._emit("changeCursor");
                        if (this.$cursorChanged || this.$anchorChanged || r != this.$isEmpty || s) this._emit("changeSelection");
                    };
                    this.$moveSelection = function(e) {
                        var t = this.lead;
                        if (this.$isEmpty) this.setSelectionAnchor(t.row, t.column);
                        e.call(this);
                    };
                    this.selectTo = function(e, t) {
                        this.$moveSelection(function() {
                            this.moveCursorTo(e, t);
                        });
                    };
                    this.selectToPosition = function(e) {
                        this.$moveSelection(function() {
                            this.moveCursorToPosition(e);
                        });
                    };
                    this.moveTo = function(e, t) {
                        this.clearSelection();
                        this.moveCursorTo(e, t);
                    };
                    this.moveToPosition = function(e) {
                        this.clearSelection();
                        this.moveCursorToPosition(e);
                    };
                    this.selectUp = function() {
                        this.$moveSelection(this.moveCursorUp);
                    };
                    this.selectDown = function() {
                        this.$moveSelection(this.moveCursorDown);
                    };
                    this.selectRight = function() {
                        this.$moveSelection(this.moveCursorRight);
                    };
                    this.selectLeft = function() {
                        this.$moveSelection(this.moveCursorLeft);
                    };
                    this.selectLineStart = function() {
                        this.$moveSelection(this.moveCursorLineStart);
                    };
                    this.selectLineEnd = function() {
                        this.$moveSelection(this.moveCursorLineEnd);
                    };
                    this.selectFileEnd = function() {
                        this.$moveSelection(this.moveCursorFileEnd);
                    };
                    this.selectFileStart = function() {
                        this.$moveSelection(this.moveCursorFileStart);
                    };
                    this.selectWordRight = function() {
                        this.$moveSelection(this.moveCursorWordRight);
                    };
                    this.selectWordLeft = function() {
                        this.$moveSelection(this.moveCursorWordLeft);
                    };
                    this.getWordRange = function(e, t) {
                        if (typeof t == "undefined") {
                            var i = e || this.lead;
                            e = i.row;
                            t = i.column;
                        }
                        return this.session.getWordRange(e, t);
                    };
                    this.selectWord = function() {
                        this.setSelectionRange(this.getWordRange());
                    };
                    this.selectAWord = function() {
                        var e = this.getCursor();
                        var t = this.session.getAWordRange(e.row, e.column);
                        this.setSelectionRange(t);
                    };
                    this.getLineRange = function(e, t) {
                        var i = typeof e == "number" ? e : this.lead.row;
                        var n;
                        var r = this.session.getFoldLine(i);
                        if (r) {
                            i = r.start.row;
                            n = r.end.row;
                        } else {
                            n = i;
                        }
                        if (t === true) return new o(i, 0, n, this.session.getLine(n).length);
                        else return new o(i, 0, n + 1, 0);
                    };
                    this.selectLine = function() {
                        this.setSelectionRange(this.getLineRange());
                    };
                    this.moveCursorUp = function() {
                        this.moveCursorBy(-1, 0);
                    };
                    this.moveCursorDown = function() {
                        this.moveCursorBy(1, 0);
                    };
                    this.wouldMoveIntoSoftTab = function(e, t, i) {
                        var n = e.column;
                        var r = e.column + t;
                        if (i < 0) {
                            n = e.column - t;
                            r = e.column;
                        }
                        return (this.session.isTabStop(e) && this.doc.getLine(e.row).slice(n, r).split(" ").length - 1 == t);
                    };
                    this.moveCursorLeft = function() {
                        var e = this.lead.getPosition(), t;
                        if ((t = this.session.getFoldAt(e.row, e.column, -1))) {
                            this.moveCursorTo(t.start.row, t.start.column);
                        } else if (e.column === 0) {
                            if (e.row > 0) {
                                this.moveCursorTo(e.row - 1, this.doc.getLine(e.row - 1).length);
                            }
                        } else {
                            var i = this.session.getTabSize();
                            if (this.wouldMoveIntoSoftTab(e, i, -1) && !this.session.getNavigateWithinSoftTabs()) {
                                this.moveCursorBy(0, -i);
                            } else {
                                this.moveCursorBy(0, -1);
                            }
                        }
                    };
                    this.moveCursorRight = function() {
                        var e = this.lead.getPosition(), t;
                        if ((t = this.session.getFoldAt(e.row, e.column, 1))) {
                            this.moveCursorTo(t.end.row, t.end.column);
                        } else if (this.lead.column == this.doc.getLine(this.lead.row).length) {
                            if (this.lead.row < this.doc.getLength() - 1) {
                                this.moveCursorTo(this.lead.row + 1, 0);
                            }
                        } else {
                            var i = this.session.getTabSize();
                            var e = this.lead;
                            if (this.wouldMoveIntoSoftTab(e, i, 1) && !this.session.getNavigateWithinSoftTabs()) {
                                this.moveCursorBy(0, i);
                            } else {
                                this.moveCursorBy(0, 1);
                            }
                        }
                    };
                    this.moveCursorLineStart = function() {
                        var e = this.lead.row;
                        var t = this.lead.column;
                        var i = this.session.documentToScreenRow(e, t);
                        var n = this.session.screenToDocumentPosition(i, 0);
                        var r = this.session.getDisplayLine(e, null, n.row, n.column);
                        var s = r.match(/^\s*/);
                        if (s[0].length != t && !this.session.$useEmacsStyleLineStart) n.column += s[0].length;
                        this.moveCursorToPosition(n);
                    };
                    this.moveCursorLineEnd = function() {
                        var e = this.lead;
                        var t = this.session.getDocumentLastRowColumnPosition(e.row, e.column);
                        if (this.lead.column == t.column) {
                            var i = this.session.getLine(t.row);
                            if (t.column == i.length) {
                                var n = i.search(/\s+$/);
                                if (n > 0) t.column = n;
                            }
                        }
                        this.moveCursorTo(t.row, t.column);
                    };
                    this.moveCursorFileEnd = function() {
                        var e = this.doc.getLength() - 1;
                        var t = this.doc.getLine(e).length;
                        this.moveCursorTo(e, t);
                    };
                    this.moveCursorFileStart = function() {
                        this.moveCursorTo(0, 0);
                    };
                    this.moveCursorLongWordRight = function() {
                        var e = this.lead.row;
                        var t = this.lead.column;
                        var i = this.doc.getLine(e);
                        var n = i.substring(t);
                        this.session.nonTokenRe.lastIndex = 0;
                        this.session.tokenRe.lastIndex = 0;
                        var r = this.session.getFoldAt(e, t, 1);
                        if (r) {
                            this.moveCursorTo(r.end.row, r.end.column);
                            return;
                        }
                        if (this.session.nonTokenRe.exec(n)) {
                            t += this.session.nonTokenRe.lastIndex;
                            this.session.nonTokenRe.lastIndex = 0;
                            n = i.substring(t);
                        }
                        if (t >= i.length) {
                            this.moveCursorTo(e, i.length);
                            this.moveCursorRight();
                            if (e < this.doc.getLength() - 1) this.moveCursorWordRight();
                            return;
                        }
                        if (this.session.tokenRe.exec(n)) {
                            t += this.session.tokenRe.lastIndex;
                            this.session.tokenRe.lastIndex = 0;
                        }
                        this.moveCursorTo(e, t);
                    };
                    this.moveCursorLongWordLeft = function() {
                        var e = this.lead.row;
                        var t = this.lead.column;
                        var i;
                        if ((i = this.session.getFoldAt(e, t, -1))) {
                            this.moveCursorTo(i.start.row, i.start.column);
                            return;
                        }
                        var n = this.session.getFoldStringAt(e, t, -1);
                        if (n == null) {
                            n = this.doc.getLine(e).substring(0, t);
                        }
                        var s = r.stringReverse(n);
                        this.session.nonTokenRe.lastIndex = 0;
                        this.session.tokenRe.lastIndex = 0;
                        if (this.session.nonTokenRe.exec(s)) {
                            t -= this.session.nonTokenRe.lastIndex;
                            s = s.slice(this.session.nonTokenRe.lastIndex);
                            this.session.nonTokenRe.lastIndex = 0;
                        }
                        if (t <= 0) {
                            this.moveCursorTo(e, 0);
                            this.moveCursorLeft();
                            if (e > 0) this.moveCursorWordLeft();
                            return;
                        }
                        if (this.session.tokenRe.exec(s)) {
                            t -= this.session.tokenRe.lastIndex;
                            this.session.tokenRe.lastIndex = 0;
                        }
                        this.moveCursorTo(e, t);
                    };
                    this.$shortWordEndIndex = function(e) {
                        var t = 0, i;
                        var n = /\s/;
                        var r = this.session.tokenRe;
                        r.lastIndex = 0;
                        if (this.session.tokenRe.exec(e)) {
                            t = this.session.tokenRe.lastIndex;
                        } else {
                            while((i = e[t]) && n.test(i))t++;
                            if (t < 1) {
                                r.lastIndex = 0;
                                while((i = e[t]) && !r.test(i)){
                                    r.lastIndex = 0;
                                    t++;
                                    if (n.test(i)) {
                                        if (t > 2) {
                                            t--;
                                            break;
                                        } else {
                                            while((i = e[t]) && n.test(i))t++;
                                            if (t > 2) break;
                                        }
                                    }
                                }
                            }
                        }
                        r.lastIndex = 0;
                        return t;
                    };
                    this.moveCursorShortWordRight = function() {
                        var e = this.lead.row;
                        var t = this.lead.column;
                        var i = this.doc.getLine(e);
                        var n = i.substring(t);
                        var r = this.session.getFoldAt(e, t, 1);
                        if (r) return this.moveCursorTo(r.end.row, r.end.column);
                        if (t == i.length) {
                            var s = this.doc.getLength();
                            do {
                                e++;
                                n = this.doc.getLine(e);
                            }while (e < s && /^\s*$/.test(n))
                            if (!/^\s+/.test(n)) n = "";
                            t = 0;
                        }
                        var o = this.$shortWordEndIndex(n);
                        this.moveCursorTo(e, t + o);
                    };
                    this.moveCursorShortWordLeft = function() {
                        var e = this.lead.row;
                        var t = this.lead.column;
                        var i;
                        if ((i = this.session.getFoldAt(e, t, -1))) return this.moveCursorTo(i.start.row, i.start.column);
                        var n = this.session.getLine(e).substring(0, t);
                        if (t === 0) {
                            do {
                                e--;
                                n = this.doc.getLine(e);
                            }while (e > 0 && /^\s*$/.test(n))
                            t = n.length;
                            if (!/\s+$/.test(n)) n = "";
                        }
                        var s = r.stringReverse(n);
                        var o = this.$shortWordEndIndex(s);
                        return this.moveCursorTo(e, t - o);
                    };
                    this.moveCursorWordRight = function() {
                        if (this.session.$selectLongWords) this.moveCursorLongWordRight();
                        else this.moveCursorShortWordRight();
                    };
                    this.moveCursorWordLeft = function() {
                        if (this.session.$selectLongWords) this.moveCursorLongWordLeft();
                        else this.moveCursorShortWordLeft();
                    };
                    this.moveCursorBy = function(e, t) {
                        var i = this.session.documentToScreenPosition(this.lead.row, this.lead.column);
                        var n;
                        if (t === 0) {
                            if (e !== 0) {
                                if (this.session.$bidiHandler.isBidiRow(i.row, this.lead.row)) {
                                    n = this.session.$bidiHandler.getPosLeft(i.column);
                                    i.column = Math.round(n / this.session.$bidiHandler.charWidths[0]);
                                } else {
                                    n = i.column * this.session.$bidiHandler.charWidths[0];
                                }
                            }
                            if (this.$desiredColumn) i.column = this.$desiredColumn;
                            else this.$desiredColumn = i.column;
                        }
                        if (e != 0 && this.session.lineWidgets && this.session.lineWidgets[this.lead.row]) {
                            var r = this.session.lineWidgets[this.lead.row];
                            if (e < 0) e -= r.rowsAbove || 0;
                            else if (e > 0) e += r.rowCount - (r.rowsAbove || 0);
                        }
                        var s = this.session.screenToDocumentPosition(i.row + e, i.column, n);
                        if (e !== 0 && t === 0 && s.row === this.lead.row && s.column === this.lead.column) {}
                        this.moveCursorTo(s.row, s.column + t, t === 0);
                    };
                    this.moveCursorToPosition = function(e) {
                        this.moveCursorTo(e.row, e.column);
                    };
                    this.moveCursorTo = function(e, t, i) {
                        var n = this.session.getFoldAt(e, t, 1);
                        if (n) {
                            e = n.start.row;
                            t = n.start.column;
                        }
                        this.$keepDesiredColumnOnChange = true;
                        var r = this.session.getLine(e);
                        if (/[\uDC00-\uDFFF]/.test(r.charAt(t)) && r.charAt(t - 1)) {
                            if (this.lead.row == e && this.lead.column == t + 1) t = t - 1;
                            else t = t + 1;
                        }
                        this.lead.setPosition(e, t);
                        this.$keepDesiredColumnOnChange = false;
                        if (!i) this.$desiredColumn = null;
                    };
                    this.moveCursorToScreen = function(e, t, i) {
                        var n = this.session.screenToDocumentPosition(e, t);
                        this.moveCursorTo(n.row, n.column, i);
                    };
                    this.detach = function() {
                        this.lead.detach();
                        this.anchor.detach();
                    };
                    this.fromOrientedRange = function(e) {
                        this.setSelectionRange(e, e.cursor == e.start);
                        this.$desiredColumn = e.desiredColumn || this.$desiredColumn;
                    };
                    this.toOrientedRange = function(e) {
                        var t = this.getRange();
                        if (e) {
                            e.start.column = t.start.column;
                            e.start.row = t.start.row;
                            e.end.column = t.end.column;
                            e.end.row = t.end.row;
                        } else {
                            e = t;
                        }
                        e.cursor = this.isBackwards() ? e.start : e.end;
                        e.desiredColumn = this.$desiredColumn;
                        return e;
                    };
                    this.getRangeOfMovements = function(e) {
                        var t = this.getCursor();
                        try {
                            e(this);
                            var i = this.getCursor();
                            return o.fromPoints(t, i);
                        } catch (n) {
                            return o.fromPoints(t, t);
                        } finally{
                            this.moveCursorToPosition(t);
                        }
                    };
                    this.toJSON = function() {
                        if (this.rangeCount) {
                            var e = this.ranges.map(function(e) {
                                var t = e.clone();
                                t.isBackwards = e.cursor == e.start;
                                return t;
                            });
                        } else {
                            var e = this.getRange();
                            e.isBackwards = this.isBackwards();
                        }
                        return e;
                    };
                    this.fromJSON = function(e) {
                        if (e.start == undefined) {
                            if (this.rangeList && e.length > 1) {
                                this.toSingleRange(e[0]);
                                for(var t = e.length; t--;){
                                    var i = o.fromPoints(e[t].start, e[t].end);
                                    if (e[t].isBackwards) i.cursor = i.start;
                                    this.addRange(i, true);
                                }
                                return;
                            } else {
                                e = e[0];
                            }
                        }
                        if (this.rangeList) this.toSingleRange(e);
                        this.setSelectionRange(e, e.isBackwards);
                    };
                    this.isEqual = function(e) {
                        if ((e.length || this.rangeCount) && e.length != this.rangeCount) return false;
                        if (!e.length || !this.ranges) return this.getRange().isEqual(e);
                        for(var t = this.ranges.length; t--;){
                            if (!this.ranges[t].isEqual(e[t])) return false;
                        }
                        return true;
                    };
                }.call(a.prototype));
                t.Selection = a;
            });
            ace.define("ace/tokenizer", [
                "require",
                "exports",
                "module",
                "ace/config"
            ], function(e, t, i) {
                "use strict";
                var n = e("./config");
                var r = 2000;
                var s = function(e) {
                    this.states = e;
                    this.regExps = {};
                    this.matchMappings = {};
                    for(var t in this.states){
                        var i = this.states[t];
                        var n = [];
                        var r = 0;
                        var s = (this.matchMappings[t] = {
                            defaultToken: "text"
                        });
                        var o = "g";
                        var a = [];
                        for(var l = 0; l < i.length; l++){
                            var h = i[l];
                            if (h.defaultToken) s.defaultToken = h.defaultToken;
                            if (h.caseInsensitive) o = "gi";
                            if (h.regex == null) continue;
                            if (h.regex instanceof RegExp) h.regex = h.regex.toString().slice(1, -1);
                            var c = h.regex;
                            var u = new RegExp("(?:(" + c + ")|(.))").exec("a").length - 2;
                            if (Array.isArray(h.token)) {
                                if (h.token.length == 1 || u == 1) {
                                    h.token = h.token[0];
                                } else if (u - 1 != h.token.length) {
                                    this.reportError("number of classes and regexp groups doesn't match", {
                                        rule: h,
                                        groupCount: u - 1
                                    });
                                    h.token = h.token[0];
                                } else {
                                    h.tokenArray = h.token;
                                    h.token = null;
                                    h.onMatch = this.$arrayTokens;
                                }
                            } else if (typeof h.token == "function" && !h.onMatch) {
                                if (u > 1) h.onMatch = this.$applyToken;
                                else h.onMatch = h.token;
                            }
                            if (u > 1) {
                                if (/\\\d/.test(h.regex)) {
                                    c = h.regex.replace(/\\([0-9]+)/g, function(e, t) {
                                        return ("\\" + (parseInt(t, 10) + r + 1));
                                    });
                                } else {
                                    u = 1;
                                    c = this.removeCapturingGroups(h.regex);
                                }
                                if (!h.splitRegex && typeof h.token != "string") a.push(h);
                            }
                            s[r] = l;
                            r += u;
                            n.push(c);
                            if (!h.onMatch) h.onMatch = null;
                        }
                        if (!n.length) {
                            s[0] = 0;
                            n.push("$");
                        }
                        a.forEach(function(e) {
                            e.splitRegex = this.createSplitterRegexp(e.regex, o);
                        }, this);
                        this.regExps[t] = new RegExp("(" + n.join(")|(") + ")|($)", o);
                    }
                };
                (function() {
                    this.$setMaxTokenCount = function(e) {
                        r = e | 0;
                    };
                    this.$applyToken = function(e) {
                        var t = this.splitRegex.exec(e).slice(1);
                        var i = this.token.apply(this, t);
                        if (typeof i === "string") return [
                            {
                                type: i,
                                value: e
                            }
                        ];
                        var n = [];
                        for(var r = 0, s = i.length; r < s; r++){
                            if (t[r]) n[n.length] = {
                                type: i[r],
                                value: t[r]
                            };
                        }
                        return n;
                    };
                    this.$arrayTokens = function(e) {
                        if (!e) return [];
                        var t = this.splitRegex.exec(e);
                        if (!t) return "text";
                        var i = [];
                        var n = this.tokenArray;
                        for(var r = 0, s = n.length; r < s; r++){
                            if (t[r + 1]) i[i.length] = {
                                type: n[r],
                                value: t[r + 1]
                            };
                        }
                        return i;
                    };
                    this.removeCapturingGroups = function(e) {
                        var t = e.replace(/\\.|\[(?:\\.|[^\\\]])*|\(\?[:=!<]|(\()/g, function(e, t) {
                            return t ? "(?:" : e;
                        });
                        return t;
                    };
                    this.createSplitterRegexp = function(e, t) {
                        if (e.indexOf("(?=") != -1) {
                            var i = 0;
                            var n = false;
                            var r = {};
                            e.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(e, t, s, o, a, l) {
                                if (n) {
                                    n = a != "]";
                                } else if (a) {
                                    n = true;
                                } else if (o) {
                                    if (i == r.stack) {
                                        r.end = l + 1;
                                        r.stack = -1;
                                    }
                                    i--;
                                } else if (s) {
                                    i++;
                                    if (s.length != 1) {
                                        r.stack = i;
                                        r.start = l;
                                    }
                                }
                                return e;
                            });
                            if (r.end != null && /^\)*$/.test(e.substr(r.end))) e = e.substring(0, r.start) + e.substr(r.end);
                        }
                        if (e.charAt(0) != "^") e = "^" + e;
                        if (e.charAt(e.length - 1) != "$") e += "$";
                        return new RegExp(e, (t || "").replace("g", ""));
                    };
                    this.getLineTokens = function(e, t) {
                        if (t && typeof t != "string") {
                            var i = t.slice(0);
                            t = i[0];
                            if (t === "#tmp") {
                                i.shift();
                                t = i.shift();
                            }
                        } else var i = [];
                        var n = t || "start";
                        var s = this.states[n];
                        if (!s) {
                            n = "start";
                            s = this.states[n];
                        }
                        var o = this.matchMappings[n];
                        var a = this.regExps[n];
                        a.lastIndex = 0;
                        var l, h = [];
                        var c = 0;
                        var u = 0;
                        var d = {
                            type: null,
                            value: ""
                        };
                        while((l = a.exec(e))){
                            var f = o.defaultToken;
                            var g = null;
                            var m = l[0];
                            var v = a.lastIndex;
                            if (v - m.length > c) {
                                var p = e.substring(c, v - m.length);
                                if (d.type == f) {
                                    d.value += p;
                                } else {
                                    if (d.type) h.push(d);
                                    d = {
                                        type: f,
                                        value: p
                                    };
                                }
                            }
                            for(var w = 0; w < l.length - 2; w++){
                                if (l[w + 1] === undefined) continue;
                                g = s[o[w]];
                                if (g.onMatch) f = g.onMatch(m, n, i, e);
                                else f = g.token;
                                if (g.next) {
                                    if (typeof g.next == "string") {
                                        n = g.next;
                                    } else {
                                        n = g.next(n, i);
                                    }
                                    s = this.states[n];
                                    if (!s) {
                                        this.reportError("state doesn't exist", n);
                                        n = "start";
                                        s = this.states[n];
                                    }
                                    o = this.matchMappings[n];
                                    c = v;
                                    a = this.regExps[n];
                                    a.lastIndex = v;
                                }
                                if (g.consumeLineEnd) c = v;
                                break;
                            }
                            if (m) {
                                if (typeof f === "string") {
                                    if ((!g || g.merge !== false) && d.type === f) {
                                        d.value += m;
                                    } else {
                                        if (d.type) h.push(d);
                                        d = {
                                            type: f,
                                            value: m
                                        };
                                    }
                                } else if (f) {
                                    if (d.type) h.push(d);
                                    d = {
                                        type: null,
                                        value: ""
                                    };
                                    for(var w = 0; w < f.length; w++)h.push(f[w]);
                                }
                            }
                            if (c == e.length) break;
                            c = v;
                            if (u++ > r) {
                                if (u > 2 * e.length) {
                                    this.reportError("infinite loop with in ace tokenizer", {
                                        startState: t,
                                        line: e
                                    });
                                }
                                while(c < e.length){
                                    if (d.type) h.push(d);
                                    d = {
                                        value: e.substring(c, (c += 500)),
                                        type: "overflow"
                                    };
                                }
                                n = "start";
                                i = [];
                                break;
                            }
                        }
                        if (d.type) h.push(d);
                        if (i.length > 1) {
                            if (i[0] !== n) i.unshift("#tmp", n);
                        }
                        return {
                            tokens: h,
                            state: i.length ? i : n
                        };
                    };
                    this.reportError = n.reportError;
                }.call(s.prototype));
                t.Tokenizer = s;
            });
            ace.define("ace/mode/text_highlight_rules", [
                "require",
                "exports",
                "module",
                "ace/lib/lang"
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/lang");
                var r = function() {
                    this.$rules = {
                        start: [
                            {
                                token: "empty_line",
                                regex: "^$"
                            },
                            {
                                defaultToken: "text"
                            }, 
                        ]
                    };
                };
                (function() {
                    this.addRules = function(e, t) {
                        if (!t) {
                            for(var i in e)this.$rules[i] = e[i];
                            return;
                        }
                        for(var i in e){
                            var n = e[i];
                            for(var r = 0; r < n.length; r++){
                                var s = n[r];
                                if (s.next || s.onMatch) {
                                    if (typeof s.next == "string") {
                                        if (s.next.indexOf(t) !== 0) s.next = t + s.next;
                                    }
                                    if (s.nextState && s.nextState.indexOf(t) !== 0) s.nextState = t + s.nextState;
                                }
                            }
                            this.$rules[t + i] = n;
                        }
                    };
                    this.getRules = function() {
                        return this.$rules;
                    };
                    this.embedRules = function(e, t, i, r, s) {
                        var o = typeof e == "function" ? new e().getRules() : e;
                        if (r) {
                            for(var a = 0; a < r.length; a++)r[a] = t + r[a];
                        } else {
                            r = [];
                            for(var l in o)r.push(t + l);
                        }
                        this.addRules(o, t);
                        if (i) {
                            var h = Array.prototype[s ? "push" : "unshift"];
                            for(var a = 0; a < r.length; a++)h.apply(this.$rules[r[a]], n.deepCopy(i));
                        }
                        if (!this.$embeds) this.$embeds = [];
                        this.$embeds.push(t);
                    };
                    this.getEmbeds = function() {
                        return this.$embeds;
                    };
                    var e = function(e, t) {
                        if (e != "start" || t.length) t.unshift(this.nextState, e);
                        return this.nextState;
                    };
                    var t = function(e, t) {
                        t.shift();
                        return t.shift() || "start";
                    };
                    this.normalizeRules = function() {
                        var i = 0;
                        var n = this.$rules;
                        function r(s) {
                            var o = n[s];
                            o.processed = true;
                            for(var a = 0; a < o.length; a++){
                                var l = o[a];
                                var h = null;
                                if (Array.isArray(l)) {
                                    h = l;
                                    l = {};
                                }
                                if (!l.regex && l.start) {
                                    l.regex = l.start;
                                    if (!l.next) l.next = [];
                                    l.next.push({
                                        defaultToken: l.token
                                    }, {
                                        token: l.token + ".end",
                                        regex: l.end || l.start,
                                        next: "pop"
                                    });
                                    l.token = l.token + ".start";
                                    l.push = true;
                                }
                                var c = l.next || l.push;
                                if (c && Array.isArray(c)) {
                                    var u = l.stateName;
                                    if (!u) {
                                        u = l.token;
                                        if (typeof u != "string") u = u[0] || "";
                                        if (n[u]) u += i++;
                                    }
                                    n[u] = c;
                                    l.next = u;
                                    r(u);
                                } else if (c == "pop") {
                                    l.next = t;
                                }
                                if (l.push) {
                                    l.nextState = l.next || l.push;
                                    l.next = e;
                                    delete l.push;
                                }
                                if (l.rules) {
                                    for(var d in l.rules){
                                        if (n[d]) {
                                            if (n[d].push) n[d].push.apply(n[d], l.rules[d]);
                                        } else {
                                            n[d] = l.rules[d];
                                        }
                                    }
                                }
                                var f = typeof l == "string" ? l : l.include;
                                if (f) {
                                    if (Array.isArray(f)) h = f.map(function(e) {
                                        return n[e];
                                    });
                                    else h = n[f];
                                }
                                if (h) {
                                    var g = [
                                        a,
                                        1
                                    ].concat(h);
                                    if (l.noEscape) g = g.filter(function(e) {
                                        return !e.next;
                                    });
                                    o.splice.apply(o, g);
                                    a--;
                                }
                                if (l.keywordMap) {
                                    l.token = this.createKeywordMapper(l.keywordMap, l.defaultToken || "text", l.caseInsensitive);
                                    delete l.defaultToken;
                                }
                            }
                        }
                        Object.keys(n).forEach(r, this);
                    };
                    this.createKeywordMapper = function(e, t, i, n) {
                        var r = Object.create(null);
                        this.$keywordList = [];
                        Object.keys(e).forEach(function(t) {
                            var s = e[t];
                            var o = s.split(n || "|");
                            for(var a = o.length; a--;){
                                var l = o[a];
                                this.$keywordList.push(l);
                                if (i) l = l.toLowerCase();
                                r[l] = t;
                            }
                        }, this);
                        e = null;
                        return i ? function(e) {
                            return (r[e.toLowerCase()] || t);
                        } : function(e) {
                            return r[e] || t;
                        };
                    };
                    this.getKeywords = function() {
                        return this.$keywords;
                    };
                }.call(r.prototype));
                t.TextHighlightRules = r;
            });
            ace.define("ace/mode/behaviour", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                var n = function() {
                    this.$behaviours = {};
                };
                (function() {
                    this.add = function(e, t, i) {
                        switch(undefined){
                            case this.$behaviours:
                                this.$behaviours = {};
                            case this.$behaviours[e]:
                                this.$behaviours[e] = {};
                        }
                        this.$behaviours[e][t] = i;
                    };
                    this.addBehaviours = function(e) {
                        for(var t in e){
                            for(var i in e[t]){
                                this.add(t, i, e[t][i]);
                            }
                        }
                    };
                    this.remove = function(e) {
                        if (this.$behaviours && this.$behaviours[e]) {
                            delete this.$behaviours[e];
                        }
                    };
                    this.inherit = function(e, t) {
                        if (typeof e === "function") {
                            var i = new e().getBehaviours(t);
                        } else {
                            var i = e.getBehaviours(t);
                        }
                        this.addBehaviours(i);
                    };
                    this.getBehaviours = function(e) {
                        if (!e) {
                            return this.$behaviours;
                        } else {
                            var t = {};
                            for(var i = 0; i < e.length; i++){
                                if (this.$behaviours[e[i]]) {
                                    t[e[i]] = this.$behaviours[e[i]];
                                }
                            }
                            return t;
                        }
                    };
                }.call(n.prototype));
                t.Behaviour = n;
            });
            ace.define("ace/token_iterator", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(e, t, i) {
                "use strict";
                var n = e("./range").Range;
                var r = function(e, t, i) {
                    this.$session = e;
                    this.$row = t;
                    this.$rowTokens = e.getTokens(t);
                    var n = e.getTokenAt(t, i);
                    this.$tokenIndex = n ? n.index : -1;
                };
                (function() {
                    this.stepBackward = function() {
                        this.$tokenIndex -= 1;
                        while(this.$tokenIndex < 0){
                            this.$row -= 1;
                            if (this.$row < 0) {
                                this.$row = 0;
                                return null;
                            }
                            this.$rowTokens = this.$session.getTokens(this.$row);
                            this.$tokenIndex = this.$rowTokens.length - 1;
                        }
                        return this.$rowTokens[this.$tokenIndex];
                    };
                    this.stepForward = function() {
                        this.$tokenIndex += 1;
                        var e;
                        while(this.$tokenIndex >= this.$rowTokens.length){
                            this.$row += 1;
                            if (!e) e = this.$session.getLength();
                            if (this.$row >= e) {
                                this.$row = e - 1;
                                return null;
                            }
                            this.$rowTokens = this.$session.getTokens(this.$row);
                            this.$tokenIndex = 0;
                        }
                        return this.$rowTokens[this.$tokenIndex];
                    };
                    this.getCurrentToken = function() {
                        return this.$rowTokens[this.$tokenIndex];
                    };
                    this.getCurrentTokenRow = function() {
                        return this.$row;
                    };
                    this.getCurrentTokenColumn = function() {
                        var e = this.$rowTokens;
                        var t = this.$tokenIndex;
                        var i = e[t].start;
                        if (i !== undefined) return i;
                        i = 0;
                        while(t > 0){
                            t -= 1;
                            i += e[t].value.length;
                        }
                        return i;
                    };
                    this.getCurrentTokenPosition = function() {
                        return {
                            row: this.$row,
                            column: this.getCurrentTokenColumn()
                        };
                    };
                    this.getCurrentTokenRange = function() {
                        var e = this.$rowTokens[this.$tokenIndex];
                        var t = this.getCurrentTokenColumn();
                        return new n(this.$row, t, this.$row, t + e.value.length);
                    };
                }.call(r.prototype));
                t.TokenIterator = r;
            });
            ace.define("ace/mode/behaviour/cstyle", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/mode/behaviour",
                "ace/token_iterator",
                "ace/lib/lang", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../../lib/oop");
                var r = e("../behaviour").Behaviour;
                var s = e("../../token_iterator").TokenIterator;
                var o = e("../../lib/lang");
                var a = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator", 
                ];
                var l = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator",
                    "comment", 
                ];
                var h;
                var c = {};
                var u = {
                    '"': '"',
                    "'": "'"
                };
                var d = function(e) {
                    var t = -1;
                    if (e.multiSelect) {
                        t = e.selection.index;
                        if (c.rangeCount != e.multiSelect.rangeCount) c = {
                            rangeCount: e.multiSelect.rangeCount
                        };
                    }
                    if (c[t]) return (h = c[t]);
                    h = c[t] = {
                        autoInsertedBrackets: 0,
                        autoInsertedRow: -1,
                        autoInsertedLineEnd: "",
                        maybeInsertedBrackets: 0,
                        maybeInsertedRow: -1,
                        maybeInsertedLineStart: "",
                        maybeInsertedLineEnd: ""
                    };
                };
                var f = function(e, t, i, n) {
                    var r = e.end.row - e.start.row;
                    return {
                        text: i + t + n,
                        selection: [
                            0,
                            e.start.column + 1,
                            r,
                            e.end.column + (r ? 0 : 1), 
                        ]
                    };
                };
                var g = function(e) {
                    this.add("braces", "insertion", function(t, i, n, r, s) {
                        var a = n.getCursorPosition();
                        var l = r.doc.getLine(a.row);
                        if (s == "{") {
                            d(n);
                            var c = n.getSelectionRange();
                            var u = r.doc.getTextRange(c);
                            if (u !== "" && u !== "{" && n.getWrapBehavioursEnabled()) {
                                return f(c, u, "{", "}");
                            } else if (g.isSaneInsertion(n, r)) {
                                if (/[\]\}\)]/.test(l[a.column]) || n.inMultiSelectMode || (e && e.braces)) {
                                    g.recordAutoInsert(n, r, "}");
                                    return {
                                        text: "{}",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                } else {
                                    g.recordMaybeInsert(n, r, "{");
                                    return {
                                        text: "{",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        } else if (s == "}") {
                            d(n);
                            var m = l.substring(a.column, a.column + 1);
                            if (m == "}") {
                                var v = r.$findOpeningBracket("}", {
                                    column: a.column + 1,
                                    row: a.row
                                });
                                if (v !== null && g.isAutoInsertedClosing(a, l, s)) {
                                    g.popAutoInsertedClosing();
                                    return {
                                        text: "",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        } else if (s == "\n" || s == "\r\n") {
                            d(n);
                            var p = "";
                            if (g.isMaybeInsertedClosing(a, l)) {
                                p = o.stringRepeat("}", h.maybeInsertedBrackets);
                                g.clearMaybeInsertedClosing();
                            }
                            var m = l.substring(a.column, a.column + 1);
                            if (m === "}") {
                                var w = r.findMatchingBracket({
                                    row: a.row,
                                    column: a.column + 1
                                }, "}");
                                if (!w) return null;
                                var $ = this.$getIndent(r.getLine(w.row));
                            } else if (p) {
                                var $ = this.$getIndent(l);
                            } else {
                                g.clearMaybeInsertedClosing();
                                return;
                            }
                            var b = $ + r.getTabString();
                            return {
                                text: "\n" + b + "\n" + $ + p,
                                selection: [
                                    1,
                                    b.length,
                                    1,
                                    b.length, 
                                ]
                            };
                        } else {
                            g.clearMaybeInsertedClosing();
                        }
                    });
                    this.add("braces", "deletion", function(e, t, i, n, r) {
                        var s = n.doc.getTextRange(r);
                        if (!r.isMultiLine() && s == "{") {
                            d(i);
                            var o = n.doc.getLine(r.start.row);
                            var a = o.substring(r.end.column, r.end.column + 1);
                            if (a == "}") {
                                r.end.column++;
                                return r;
                            } else {
                                h.maybeInsertedBrackets--;
                            }
                        }
                    });
                    this.add("parens", "insertion", function(e, t, i, n, r) {
                        if (r == "(") {
                            d(i);
                            var s = i.getSelectionRange();
                            var o = n.doc.getTextRange(s);
                            if (o !== "" && i.getWrapBehavioursEnabled()) {
                                return f(s, o, "(", ")");
                            } else if (g.isSaneInsertion(i, n)) {
                                g.recordAutoInsert(i, n, ")");
                                return {
                                    text: "()",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        } else if (r == ")") {
                            d(i);
                            var a = i.getCursorPosition();
                            var l = n.doc.getLine(a.row);
                            var h = l.substring(a.column, a.column + 1);
                            if (h == ")") {
                                var c = n.$findOpeningBracket(")", {
                                    column: a.column + 1,
                                    row: a.row
                                });
                                if (c !== null && g.isAutoInsertedClosing(a, l, r)) {
                                    g.popAutoInsertedClosing();
                                    return {
                                        text: "",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        }
                    });
                    this.add("parens", "deletion", function(e, t, i, n, r) {
                        var s = n.doc.getTextRange(r);
                        if (!r.isMultiLine() && s == "(") {
                            d(i);
                            var o = n.doc.getLine(r.start.row);
                            var a = o.substring(r.start.column + 1, r.start.column + 2);
                            if (a == ")") {
                                r.end.column++;
                                return r;
                            }
                        }
                    });
                    this.add("brackets", "insertion", function(e, t, i, n, r) {
                        if (r == "[") {
                            d(i);
                            var s = i.getSelectionRange();
                            var o = n.doc.getTextRange(s);
                            if (o !== "" && i.getWrapBehavioursEnabled()) {
                                return f(s, o, "[", "]");
                            } else if (g.isSaneInsertion(i, n)) {
                                g.recordAutoInsert(i, n, "]");
                                return {
                                    text: "[]",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        } else if (r == "]") {
                            d(i);
                            var a = i.getCursorPosition();
                            var l = n.doc.getLine(a.row);
                            var h = l.substring(a.column, a.column + 1);
                            if (h == "]") {
                                var c = n.$findOpeningBracket("]", {
                                    column: a.column + 1,
                                    row: a.row
                                });
                                if (c !== null && g.isAutoInsertedClosing(a, l, r)) {
                                    g.popAutoInsertedClosing();
                                    return {
                                        text: "",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        }
                    });
                    this.add("brackets", "deletion", function(e, t, i, n, r) {
                        var s = n.doc.getTextRange(r);
                        if (!r.isMultiLine() && s == "[") {
                            d(i);
                            var o = n.doc.getLine(r.start.row);
                            var a = o.substring(r.start.column + 1, r.start.column + 2);
                            if (a == "]") {
                                r.end.column++;
                                return r;
                            }
                        }
                    });
                    this.add("string_dquotes", "insertion", function(e, t, i, n, r) {
                        var s = n.$mode.$quotes || u;
                        if (r.length == 1 && s[r]) {
                            if (this.lineCommentStart && this.lineCommentStart.indexOf(r) != -1) return;
                            d(i);
                            var o = r;
                            var a = i.getSelectionRange();
                            var l = n.doc.getTextRange(a);
                            if (l !== "" && (l.length != 1 || !s[l]) && i.getWrapBehavioursEnabled()) {
                                return f(a, l, o, o);
                            } else if (!l) {
                                var h = i.getCursorPosition();
                                var c = n.doc.getLine(h.row);
                                var g = c.substring(h.column - 1, h.column);
                                var m = c.substring(h.column, h.column + 1);
                                var v = n.getTokenAt(h.row, h.column);
                                var p = n.getTokenAt(h.row, h.column + 1);
                                if (g == "\\" && v && /escape/.test(v.type)) return null;
                                var w = v && /string|escape/.test(v.type);
                                var $ = !p || /string|escape/.test(p.type);
                                var b;
                                if (m == o) {
                                    b = w !== $;
                                    if (b && /string\.end/.test(p.type)) b = false;
                                } else {
                                    if (w && !$) return null;
                                    if (w && $) return null;
                                    var y = n.$mode.tokenRe;
                                    y.lastIndex = 0;
                                    var C = y.test(g);
                                    y.lastIndex = 0;
                                    var S = y.test(g);
                                    if (C || S) return null;
                                    if (m && !/[\s;,.})\]\\]/.test(m)) return null;
                                    var k = c[h.column - 2];
                                    if (g == o && (k == o || y.test(k))) return null;
                                    b = true;
                                }
                                return {
                                    text: b ? o + o : "",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        }
                    });
                    this.add("string_dquotes", "deletion", function(e, t, i, n, r) {
                        var s = n.$mode.$quotes || u;
                        var o = n.doc.getTextRange(r);
                        if (!r.isMultiLine() && s.hasOwnProperty(o)) {
                            d(i);
                            var a = n.doc.getLine(r.start.row);
                            var l = a.substring(r.start.column + 1, r.start.column + 2);
                            if (l == o) {
                                r.end.column++;
                                return r;
                            }
                        }
                    });
                };
                g.isSaneInsertion = function(e, t) {
                    var i = e.getCursorPosition();
                    var n = new s(t, i.row, i.column);
                    if (!this.$matchTokenType(n.getCurrentToken() || "text", a)) {
                        if (/[)}\]]/.test(e.session.getLine(i.row)[i.column])) return true;
                        var r = new s(t, i.row, i.column + 1);
                        if (!this.$matchTokenType(r.getCurrentToken() || "text", a)) return false;
                    }
                    n.stepForward();
                    return (n.getCurrentTokenRow() !== i.row || this.$matchTokenType(n.getCurrentToken() || "text", l));
                };
                g.$matchTokenType = function(e, t) {
                    return t.indexOf(e.type || e) > -1;
                };
                g.recordAutoInsert = function(e, t, i) {
                    var n = e.getCursorPosition();
                    var r = t.doc.getLine(n.row);
                    if (!this.isAutoInsertedClosing(n, r, h.autoInsertedLineEnd[0])) h.autoInsertedBrackets = 0;
                    h.autoInsertedRow = n.row;
                    h.autoInsertedLineEnd = i + r.substr(n.column);
                    h.autoInsertedBrackets++;
                };
                g.recordMaybeInsert = function(e, t, i) {
                    var n = e.getCursorPosition();
                    var r = t.doc.getLine(n.row);
                    if (!this.isMaybeInsertedClosing(n, r)) h.maybeInsertedBrackets = 0;
                    h.maybeInsertedRow = n.row;
                    h.maybeInsertedLineStart = r.substr(0, n.column) + i;
                    h.maybeInsertedLineEnd = r.substr(n.column);
                    h.maybeInsertedBrackets++;
                };
                g.isAutoInsertedClosing = function(e, t, i) {
                    return (h.autoInsertedBrackets > 0 && e.row === h.autoInsertedRow && i === h.autoInsertedLineEnd[0] && t.substr(e.column) === h.autoInsertedLineEnd);
                };
                g.isMaybeInsertedClosing = function(e, t) {
                    return (h.maybeInsertedBrackets > 0 && e.row === h.maybeInsertedRow && t.substr(e.column) === h.maybeInsertedLineEnd && t.substr(0, e.column) == h.maybeInsertedLineStart);
                };
                g.popAutoInsertedClosing = function() {
                    h.autoInsertedLineEnd = h.autoInsertedLineEnd.substr(1);
                    h.autoInsertedBrackets--;
                };
                g.clearMaybeInsertedClosing = function() {
                    if (h) {
                        h.maybeInsertedBrackets = 0;
                        h.maybeInsertedRow = -1;
                    }
                };
                n.inherits(g, r);
                t.CstyleBehaviour = g;
            });
            ace.define("ace/unicode", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                var n = [
                    48,
                    9,
                    8,
                    25,
                    5,
                    0,
                    2,
                    25,
                    48,
                    0,
                    11,
                    0,
                    5,
                    0,
                    6,
                    22,
                    2,
                    30,
                    2,
                    457,
                    5,
                    11,
                    15,
                    4,
                    8,
                    0,
                    2,
                    0,
                    18,
                    116,
                    2,
                    1,
                    3,
                    3,
                    9,
                    0,
                    2,
                    2,
                    2,
                    0,
                    2,
                    19,
                    2,
                    82,
                    2,
                    138,
                    2,
                    4,
                    3,
                    155,
                    12,
                    37,
                    3,
                    0,
                    8,
                    38,
                    10,
                    44,
                    2,
                    0,
                    2,
                    1,
                    2,
                    1,
                    2,
                    0,
                    9,
                    26,
                    6,
                    2,
                    30,
                    10,
                    7,
                    61,
                    2,
                    9,
                    5,
                    101,
                    2,
                    7,
                    3,
                    9,
                    2,
                    18,
                    3,
                    0,
                    17,
                    58,
                    3,
                    100,
                    15,
                    53,
                    5,
                    0,
                    6,
                    45,
                    211,
                    57,
                    3,
                    18,
                    2,
                    5,
                    3,
                    11,
                    3,
                    9,
                    2,
                    1,
                    7,
                    6,
                    2,
                    2,
                    2,
                    7,
                    3,
                    1,
                    3,
                    21,
                    2,
                    6,
                    2,
                    0,
                    4,
                    3,
                    3,
                    8,
                    3,
                    1,
                    3,
                    3,
                    9,
                    0,
                    5,
                    1,
                    2,
                    4,
                    3,
                    11,
                    16,
                    2,
                    2,
                    5,
                    5,
                    1,
                    3,
                    21,
                    2,
                    6,
                    2,
                    1,
                    2,
                    1,
                    2,
                    1,
                    3,
                    0,
                    2,
                    4,
                    5,
                    1,
                    3,
                    2,
                    4,
                    0,
                    8,
                    3,
                    2,
                    0,
                    8,
                    15,
                    12,
                    2,
                    2,
                    8,
                    2,
                    2,
                    2,
                    21,
                    2,
                    6,
                    2,
                    1,
                    2,
                    4,
                    3,
                    9,
                    2,
                    2,
                    2,
                    2,
                    3,
                    0,
                    16,
                    3,
                    3,
                    9,
                    18,
                    2,
                    2,
                    7,
                    3,
                    1,
                    3,
                    21,
                    2,
                    6,
                    2,
                    1,
                    2,
                    4,
                    3,
                    8,
                    3,
                    1,
                    3,
                    2,
                    9,
                    1,
                    5,
                    1,
                    2,
                    4,
                    3,
                    9,
                    2,
                    0,
                    17,
                    1,
                    2,
                    5,
                    4,
                    2,
                    2,
                    3,
                    4,
                    1,
                    2,
                    0,
                    2,
                    1,
                    4,
                    1,
                    4,
                    2,
                    4,
                    11,
                    5,
                    4,
                    4,
                    2,
                    2,
                    3,
                    3,
                    0,
                    7,
                    0,
                    15,
                    9,
                    18,
                    2,
                    2,
                    7,
                    2,
                    2,
                    2,
                    22,
                    2,
                    9,
                    2,
                    4,
                    4,
                    7,
                    2,
                    2,
                    2,
                    3,
                    8,
                    1,
                    2,
                    1,
                    7,
                    3,
                    3,
                    9,
                    19,
                    1,
                    2,
                    7,
                    2,
                    2,
                    2,
                    22,
                    2,
                    9,
                    2,
                    4,
                    3,
                    8,
                    2,
                    2,
                    2,
                    3,
                    8,
                    1,
                    8,
                    0,
                    2,
                    3,
                    3,
                    9,
                    19,
                    1,
                    2,
                    7,
                    2,
                    2,
                    2,
                    22,
                    2,
                    15,
                    4,
                    7,
                    2,
                    2,
                    2,
                    3,
                    10,
                    0,
                    9,
                    3,
                    3,
                    9,
                    11,
                    5,
                    3,
                    1,
                    2,
                    17,
                    4,
                    23,
                    2,
                    8,
                    2,
                    0,
                    3,
                    6,
                    4,
                    0,
                    5,
                    5,
                    2,
                    0,
                    2,
                    7,
                    19,
                    1,
                    14,
                    57,
                    6,
                    14,
                    2,
                    9,
                    40,
                    1,
                    2,
                    0,
                    3,
                    1,
                    2,
                    0,
                    3,
                    0,
                    7,
                    3,
                    2,
                    6,
                    2,
                    2,
                    2,
                    0,
                    2,
                    0,
                    3,
                    1,
                    2,
                    12,
                    2,
                    2,
                    3,
                    4,
                    2,
                    0,
                    2,
                    5,
                    3,
                    9,
                    3,
                    1,
                    35,
                    0,
                    24,
                    1,
                    7,
                    9,
                    12,
                    0,
                    2,
                    0,
                    2,
                    0,
                    5,
                    9,
                    2,
                    35,
                    5,
                    19,
                    2,
                    5,
                    5,
                    7,
                    2,
                    35,
                    10,
                    0,
                    58,
                    73,
                    7,
                    77,
                    3,
                    37,
                    11,
                    42,
                    2,
                    0,
                    4,
                    328,
                    2,
                    3,
                    3,
                    6,
                    2,
                    0,
                    2,
                    3,
                    3,
                    40,
                    2,
                    3,
                    3,
                    32,
                    2,
                    3,
                    3,
                    6,
                    2,
                    0,
                    2,
                    3,
                    3,
                    14,
                    2,
                    56,
                    2,
                    3,
                    3,
                    66,
                    5,
                    0,
                    33,
                    15,
                    17,
                    84,
                    13,
                    619,
                    3,
                    16,
                    2,
                    25,
                    6,
                    74,
                    22,
                    12,
                    2,
                    6,
                    12,
                    20,
                    12,
                    19,
                    13,
                    12,
                    2,
                    2,
                    2,
                    1,
                    13,
                    51,
                    3,
                    29,
                    4,
                    0,
                    5,
                    1,
                    3,
                    9,
                    34,
                    2,
                    3,
                    9,
                    7,
                    87,
                    9,
                    42,
                    6,
                    69,
                    11,
                    28,
                    4,
                    11,
                    5,
                    11,
                    11,
                    39,
                    3,
                    4,
                    12,
                    43,
                    5,
                    25,
                    7,
                    10,
                    38,
                    27,
                    5,
                    62,
                    2,
                    28,
                    3,
                    10,
                    7,
                    9,
                    14,
                    0,
                    89,
                    75,
                    5,
                    9,
                    18,
                    8,
                    13,
                    42,
                    4,
                    11,
                    71,
                    55,
                    9,
                    9,
                    4,
                    48,
                    83,
                    2,
                    2,
                    30,
                    14,
                    230,
                    23,
                    280,
                    3,
                    5,
                    3,
                    37,
                    3,
                    5,
                    3,
                    7,
                    2,
                    0,
                    2,
                    0,
                    2,
                    0,
                    2,
                    30,
                    3,
                    52,
                    2,
                    6,
                    2,
                    0,
                    4,
                    2,
                    2,
                    6,
                    4,
                    3,
                    3,
                    5,
                    5,
                    12,
                    6,
                    2,
                    2,
                    6,
                    67,
                    1,
                    20,
                    0,
                    29,
                    0,
                    14,
                    0,
                    17,
                    4,
                    60,
                    12,
                    5,
                    0,
                    4,
                    11,
                    18,
                    0,
                    5,
                    0,
                    3,
                    9,
                    2,
                    0,
                    4,
                    4,
                    7,
                    0,
                    2,
                    0,
                    2,
                    0,
                    2,
                    3,
                    2,
                    10,
                    3,
                    3,
                    6,
                    4,
                    5,
                    0,
                    53,
                    1,
                    2684,
                    46,
                    2,
                    46,
                    2,
                    132,
                    7,
                    6,
                    15,
                    37,
                    11,
                    53,
                    10,
                    0,
                    17,
                    22,
                    10,
                    6,
                    2,
                    6,
                    2,
                    6,
                    2,
                    6,
                    2,
                    6,
                    2,
                    6,
                    2,
                    6,
                    2,
                    6,
                    2,
                    31,
                    48,
                    0,
                    470,
                    1,
                    36,
                    5,
                    2,
                    4,
                    6,
                    1,
                    5,
                    85,
                    3,
                    1,
                    3,
                    2,
                    2,
                    89,
                    2,
                    3,
                    6,
                    40,
                    4,
                    93,
                    18,
                    23,
                    57,
                    15,
                    513,
                    6581,
                    75,
                    20939,
                    53,
                    1164,
                    68,
                    45,
                    3,
                    268,
                    4,
                    27,
                    21,
                    31,
                    3,
                    13,
                    13,
                    1,
                    2,
                    24,
                    9,
                    69,
                    11,
                    1,
                    38,
                    8,
                    3,
                    102,
                    3,
                    1,
                    111,
                    44,
                    25,
                    51,
                    13,
                    68,
                    12,
                    9,
                    7,
                    23,
                    4,
                    0,
                    5,
                    45,
                    3,
                    35,
                    13,
                    28,
                    4,
                    64,
                    15,
                    10,
                    39,
                    54,
                    10,
                    13,
                    3,
                    9,
                    7,
                    22,
                    4,
                    1,
                    5,
                    66,
                    25,
                    2,
                    227,
                    42,
                    2,
                    1,
                    3,
                    9,
                    7,
                    11171,
                    13,
                    22,
                    5,
                    48,
                    8453,
                    301,
                    3,
                    61,
                    3,
                    105,
                    39,
                    6,
                    13,
                    4,
                    6,
                    11,
                    2,
                    12,
                    2,
                    4,
                    2,
                    0,
                    2,
                    1,
                    2,
                    1,
                    2,
                    107,
                    34,
                    362,
                    19,
                    63,
                    3,
                    53,
                    41,
                    11,
                    5,
                    15,
                    17,
                    6,
                    13,
                    1,
                    25,
                    2,
                    33,
                    4,
                    2,
                    134,
                    20,
                    9,
                    8,
                    25,
                    5,
                    0,
                    2,
                    25,
                    12,
                    88,
                    4,
                    5,
                    3,
                    5,
                    3,
                    5,
                    3,
                    2, 
                ];
                var r = 0;
                var s = [];
                for(var o = 0; o < n.length; o += 2){
                    s.push((r += n[o]));
                    if (n[o + 1]) s.push(45, (r += n[o + 1]));
                }
                t.wordChars = String.fromCharCode.apply(null, s);
            });
            ace.define("ace/mode/text", [
                "require",
                "exports",
                "module",
                "ace/config",
                "ace/tokenizer",
                "ace/mode/text_highlight_rules",
                "ace/mode/behaviour/cstyle",
                "ace/unicode",
                "ace/lib/lang",
                "ace/token_iterator",
                "ace/range", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../config");
                var r = e("../tokenizer").Tokenizer;
                var s = e("./text_highlight_rules").TextHighlightRules;
                var o = e("./behaviour/cstyle").CstyleBehaviour;
                var a = e("../unicode");
                var l = e("../lib/lang");
                var h = e("../token_iterator").TokenIterator;
                var c = e("../range").Range;
                var u = function() {
                    this.HighlightRules = s;
                };
                (function() {
                    this.$defaultBehaviour = new o();
                    this.tokenRe = new RegExp("^[" + a.wordChars + "\\$_]+", "g");
                    this.nonTokenRe = new RegExp("^(?:[^" + a.wordChars + "\\$_]|\\s])+", "g");
                    this.getTokenizer = function() {
                        if (!this.$tokenizer) {
                            this.$highlightRules = this.$highlightRules || new this.HighlightRules(this.$highlightRuleConfig);
                            this.$tokenizer = new r(this.$highlightRules.getRules());
                        }
                        return this.$tokenizer;
                    };
                    this.lineCommentStart = "";
                    this.blockComment = "";
                    this.toggleCommentLines = function(e, t, i, n) {
                        var r = t.doc;
                        var s = true;
                        var o = true;
                        var a = Infinity;
                        var h = t.getTabSize();
                        var c = false;
                        if (!this.lineCommentStart) {
                            if (!this.blockComment) return false;
                            var u = this.blockComment.start;
                            var d = this.blockComment.end;
                            var f = new RegExp("^(\\s*)(?:" + l.escapeRegExp(u) + ")");
                            var g = new RegExp("(?:" + l.escapeRegExp(d) + ")\\s*$");
                            var m = function(e, t) {
                                if (p(e, t)) return;
                                if (!s || /\S/.test(e)) {
                                    r.insertInLine({
                                        row: t,
                                        column: e.length
                                    }, d);
                                    r.insertInLine({
                                        row: t,
                                        column: a
                                    }, u);
                                }
                            };
                            var v = function(e, t) {
                                var i;
                                if ((i = e.match(g))) r.removeInLine(t, e.length - i[0].length, e.length);
                                if ((i = e.match(f))) r.removeInLine(t, i[1].length, i[0].length);
                            };
                            var p = function(e, i) {
                                if (f.test(e)) return true;
                                var n = t.getTokens(i);
                                for(var r = 0; r < n.length; r++){
                                    if (n[r].type === "comment") return true;
                                }
                            };
                        } else {
                            if (Array.isArray(this.lineCommentStart)) {
                                var f = this.lineCommentStart.map(l.escapeRegExp).join("|");
                                var u = this.lineCommentStart[0];
                            } else {
                                var f = l.escapeRegExp(this.lineCommentStart);
                                var u = this.lineCommentStart;
                            }
                            f = new RegExp("^(\\s*)(?:" + f + ") ?");
                            c = t.getUseSoftTabs();
                            var v = function(e, t) {
                                var i = e.match(f);
                                if (!i) return;
                                var n = i[1].length, s = i[0].length;
                                if (!$(e, n, s) && i[0][s - 1] == " ") s--;
                                r.removeInLine(t, n, s);
                            };
                            var w = u + " ";
                            var m = function(e, t) {
                                if (!s || /\S/.test(e)) {
                                    if ($(e, a, a)) r.insertInLine({
                                        row: t,
                                        column: a
                                    }, w);
                                    else r.insertInLine({
                                        row: t,
                                        column: a
                                    }, u);
                                }
                            };
                            var p = function(e, t) {
                                return f.test(e);
                            };
                            var $ = function(e, t, i) {
                                var n = 0;
                                while(t-- && e.charAt(t) == " ")n++;
                                if (n % h != 0) return false;
                                var n = 0;
                                while(e.charAt(i++) == " ")n++;
                                if (h > 2) return n % h != h - 1;
                                else return n % h == 0;
                            };
                        }
                        function b(e) {
                            for(var t = i; t <= n; t++)e(r.getLine(t), t);
                        }
                        var y = Infinity;
                        b(function(e, t) {
                            var i = e.search(/\S/);
                            if (i !== -1) {
                                if (i < a) a = i;
                                if (o && !p(e, t)) o = false;
                            } else if (y > e.length) {
                                y = e.length;
                            }
                        });
                        if (a == Infinity) {
                            a = y;
                            s = false;
                            o = false;
                        }
                        if (c && a % h != 0) a = Math.floor(a / h) * h;
                        b(o ? v : m);
                    };
                    this.toggleBlockComment = function(e, t, i, n) {
                        var r = this.blockComment;
                        if (!r) return;
                        if (!r.start && r[0]) r = r[0];
                        var s = new h(t, n.row, n.column);
                        var o = s.getCurrentToken();
                        var a = t.selection;
                        var l = t.selection.toOrientedRange();
                        var u, d;
                        if (o && /comment/.test(o.type)) {
                            var f, g;
                            while(o && /comment/.test(o.type)){
                                var m = o.value.indexOf(r.start);
                                if (m != -1) {
                                    var v = s.getCurrentTokenRow();
                                    var p = s.getCurrentTokenColumn() + m;
                                    f = new c(v, p, v, p + r.start.length);
                                    break;
                                }
                                o = s.stepBackward();
                            }
                            var s = new h(t, n.row, n.column);
                            var o = s.getCurrentToken();
                            while(o && /comment/.test(o.type)){
                                var m = o.value.indexOf(r.end);
                                if (m != -1) {
                                    var v = s.getCurrentTokenRow();
                                    var p = s.getCurrentTokenColumn() + m;
                                    g = new c(v, p, v, p + r.end.length);
                                    break;
                                }
                                o = s.stepForward();
                            }
                            if (g) t.remove(g);
                            if (f) {
                                t.remove(f);
                                u = f.start.row;
                                d = -r.start.length;
                            }
                        } else {
                            d = r.start.length;
                            u = i.start.row;
                            t.insert(i.end, r.end);
                            t.insert(i.start, r.start);
                        }
                        if (l.start.row == u) l.start.column += d;
                        if (l.end.row == u) l.end.column += d;
                        t.selection.fromOrientedRange(l);
                    };
                    this.getNextLineIndent = function(e, t, i) {
                        return this.$getIndent(t);
                    };
                    this.checkOutdent = function(e, t, i) {
                        return false;
                    };
                    this.autoOutdent = function(e, t, i) {};
                    this.$getIndent = function(e) {
                        return e.match(/^\s*/)[0];
                    };
                    this.createWorker = function(e) {
                        return null;
                    };
                    this.createModeDelegates = function(e) {
                        this.$embeds = [];
                        this.$modes = {};
                        for(var t in e){
                            if (e[t]) {
                                var i = e[t];
                                var r = i.prototype.$id;
                                var s = n.$modes[r];
                                if (!s) n.$modes[r] = s = new i();
                                if (!n.$modes[t]) n.$modes[t] = s;
                                this.$embeds.push(t);
                                this.$modes[t] = s;
                            }
                        }
                        var o = [
                            "toggleBlockComment",
                            "toggleCommentLines",
                            "getNextLineIndent",
                            "checkOutdent",
                            "autoOutdent",
                            "transformAction",
                            "getCompletions", 
                        ];
                        for(var t = 0; t < o.length; t++){
                            (function(e) {
                                var i = o[t];
                                var n = e[i];
                                e[o[t]] = function() {
                                    return this.$delegator(i, arguments, n);
                                };
                            })(this);
                        }
                    };
                    this.$delegator = function(e, t, i) {
                        var n = t[0] || "start";
                        if (typeof n != "string") {
                            if (Array.isArray(n[2])) {
                                var r = n[2][n[2].length - 1];
                                var s = this.$modes[r];
                                if (s) return s[e].apply(s, [
                                    n[1]
                                ].concat([].slice.call(t, 1)));
                            }
                            n = n[0] || "start";
                        }
                        for(var o = 0; o < this.$embeds.length; o++){
                            if (!this.$modes[this.$embeds[o]]) continue;
                            var a = n.split(this.$embeds[o]);
                            if (!a[0] && a[1]) {
                                t[0] = a[1];
                                var s = this.$modes[this.$embeds[o]];
                                return s[e].apply(s, t);
                            }
                        }
                        var l = i.apply(this, t);
                        return i ? l : undefined;
                    };
                    this.transformAction = function(e, t, i, n, r) {
                        if (this.$behaviour) {
                            var s = this.$behaviour.getBehaviours();
                            for(var o in s){
                                if (s[o][t]) {
                                    var a = s[o][t].apply(this, arguments);
                                    if (a) {
                                        return a;
                                    }
                                }
                            }
                        }
                    };
                    this.getKeywords = function(e) {
                        if (!this.completionKeywords) {
                            var t = this.$tokenizer.rules;
                            var i = [];
                            for(var n in t){
                                var r = t[n];
                                for(var s = 0, o = r.length; s < o; s++){
                                    if (typeof r[s].token === "string") {
                                        if (/keyword|support|storage/.test(r[s].token)) i.push(r[s].regex);
                                    } else if (typeof r[s].token === "object") {
                                        for(var a = 0, l = r[s].token.length; a < l; a++){
                                            if (/keyword|support|storage/.test(r[s].token[a])) {
                                                var n = r[s].regex.match(/\(.+?\)/g)[a];
                                                i.push(n.substr(1, n.length - 2));
                                            }
                                        }
                                    }
                                }
                            }
                            this.completionKeywords = i;
                        }
                        if (!e) return this.$keywordList;
                        return i.concat(this.$keywordList || []);
                    };
                    this.$createKeywordList = function() {
                        if (!this.$highlightRules) this.getTokenizer();
                        return (this.$keywordList = this.$highlightRules.$keywordList || []);
                    };
                    this.getCompletions = function(e, t, i, n) {
                        var r = this.$keywordList || this.$createKeywordList();
                        return r.map(function(e) {
                            return {
                                name: e,
                                value: e,
                                score: 0,
                                meta: "keyword"
                            };
                        });
                    };
                    this.$id = "ace/mode/text";
                }.call(u.prototype));
                t.Mode = u;
            });
            ace.define("ace/apply_delta", [
                "require",
                "exports",
                "module"
            ], function(e, t, i) {
                "use strict";
                function n(e, t) {
                    console.log("Invalid Delta:", e);
                    throw "Invalid Delta: " + t;
                }
                function r(e, t) {
                    return (t.row >= 0 && t.row < e.length && t.column >= 0 && t.column <= e[t.row].length);
                }
                function s(e, t) {
                    if (t.action != "insert" && t.action != "remove") n(t, "delta.action must be 'insert' or 'remove'");
                    if (!(t.lines instanceof Array)) n(t, "delta.lines must be an Array");
                    if (!t.start || !t.end) n(t, "delta.start/end must be an present");
                    var i = t.start;
                    if (!r(e, t.start)) n(t, "delta.start must be contained in document");
                    var s = t.end;
                    if (t.action == "remove" && !r(e, s)) n(t, "delta.end must contained in document for 'remove' actions");
                    var o = s.row - i.row;
                    var a = s.column - (o == 0 ? i.column : 0);
                    if (o != t.lines.length - 1 || t.lines[o].length != a) n(t, "delta.range must match delta lines");
                }
                t.applyDelta = function(e, t, i) {
                    var n = t.start.row;
                    var r = t.start.column;
                    var s = e[n] || "";
                    switch(t.action){
                        case "insert":
                            var o = t.lines;
                            if (o.length === 1) {
                                e[n] = s.substring(0, r) + t.lines[0] + s.substring(r);
                            } else {
                                var a = [
                                    n,
                                    1
                                ].concat(t.lines);
                                e.splice.apply(e, a);
                                e[n] = s.substring(0, r) + e[n];
                                e[n + t.lines.length - 1] += s.substring(r);
                            }
                            break;
                        case "remove":
                            var l = t.end.column;
                            var h = t.end.row;
                            if (n === h) {
                                e[n] = s.substring(0, r) + s.substring(l);
                            } else {
                                e.splice(n, h - n + 1, s.substring(0, r) + e[h].substring(l));
                            }
                            break;
                    }
                };
            });
            ace.define("ace/anchor", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./lib/event_emitter").EventEmitter;
                var s = (t.Anchor = function(e, t, i) {
                    this.$onChange = this.onChange.bind(this);
                    this.attach(e);
                    if (typeof i == "undefined") this.setPosition(t.row, t.column);
                    else this.setPosition(t, i);
                });
                (function() {
                    n.implement(this, r);
                    this.getPosition = function() {
                        return this.$clipPositionToDocument(this.row, this.column);
                    };
                    this.getDocument = function() {
                        return this.document;
                    };
                    this.$insertRight = false;
                    this.onChange = function(e) {
                        if (e.start.row == e.end.row && e.start.row != this.row) return;
                        if (e.start.row > this.row) return;
                        var i = t(e, {
                            row: this.row,
                            column: this.column
                        }, this.$insertRight);
                        this.setPosition(i.row, i.column, true);
                    };
                    function e(e, t, i) {
                        var n = i ? e.column <= t.column : e.column < t.column;
                        return (e.row < t.row || (e.row == t.row && n));
                    }
                    function t(t, i, n) {
                        var r = t.action == "insert";
                        var s = (r ? 1 : -1) * (t.end.row - t.start.row);
                        var o = (r ? 1 : -1) * (t.end.column - t.start.column);
                        var a = t.start;
                        var l = r ? a : t.end;
                        if (e(i, a, n)) {
                            return {
                                row: i.row,
                                column: i.column
                            };
                        }
                        if (e(l, i, !n)) {
                            return {
                                row: i.row + s,
                                column: i.column + (i.row == l.row ? o : 0)
                            };
                        }
                        return {
                            row: a.row,
                            column: a.column
                        };
                    }
                    this.setPosition = function(e, t, i) {
                        var n;
                        if (i) {
                            n = {
                                row: e,
                                column: t
                            };
                        } else {
                            n = this.$clipPositionToDocument(e, t);
                        }
                        if (this.row == n.row && this.column == n.column) return;
                        var r = {
                            row: this.row,
                            column: this.column
                        };
                        this.row = n.row;
                        this.column = n.column;
                        this._signal("change", {
                            old: r,
                            value: n
                        });
                    };
                    this.detach = function() {
                        this.document.off("change", this.$onChange);
                    };
                    this.attach = function(e) {
                        this.document = e || this.document;
                        this.document.on("change", this.$onChange);
                    };
                    this.$clipPositionToDocument = function(e, t) {
                        var i = {};
                        if (e >= this.document.getLength()) {
                            i.row = Math.max(0, this.document.getLength() - 1);
                            i.column = this.document.getLine(i.row).length;
                        } else if (e < 0) {
                            i.row = 0;
                            i.column = 0;
                        } else {
                            i.row = e;
                            i.column = Math.min(this.document.getLine(i.row).length, Math.max(0, t));
                        }
                        if (t < 0) i.column = 0;
                        return i;
                    };
                }.call(s.prototype));
            });
            ace.define("ace/document", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/apply_delta",
                "ace/lib/event_emitter",
                "ace/range",
                "ace/anchor", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./apply_delta").applyDelta;
                var s = e("./lib/event_emitter").EventEmitter;
                var o = e("./range").Range;
                var a = e("./anchor").Anchor;
                var l = function(e) {
                    this.$lines = [
                        ""
                    ];
                    if (e.length === 0) {
                        this.$lines = [
                            ""
                        ];
                    } else if (Array.isArray(e)) {
                        this.insertMergedLines({
                            row: 0,
                            column: 0
                        }, e);
                    } else {
                        this.insert({
                            row: 0,
                            column: 0
                        }, e);
                    }
                };
                (function() {
                    n.implement(this, s);
                    this.setValue = function(e) {
                        var t = this.getLength() - 1;
                        this.remove(new o(0, 0, t, this.getLine(t).length));
                        this.insert({
                            row: 0,
                            column: 0
                        }, e);
                    };
                    this.getValue = function() {
                        return this.getAllLines().join(this.getNewLineCharacter());
                    };
                    this.createAnchor = function(e, t) {
                        return new a(this, e, t);
                    };
                    if ("aaa".split(/a/).length === 0) {
                        this.$split = function(e) {
                            return e.replace(/\r\n|\r/g, "\n").split("\n");
                        };
                    } else {
                        this.$split = function(e) {
                            return e.split(/\r\n|\r|\n/);
                        };
                    }
                    this.$detectNewLine = function(e) {
                        var t = e.match(/^.*?(\r\n|\r|\n)/m);
                        this.$autoNewLine = t ? t[1] : "\n";
                        this._signal("changeNewLineMode");
                    };
                    this.getNewLineCharacter = function() {
                        switch(this.$newLineMode){
                            case "windows":
                                return "\r\n";
                            case "unix":
                                return "\n";
                            default:
                                return this.$autoNewLine || "\n";
                        }
                    };
                    this.$autoNewLine = "";
                    this.$newLineMode = "auto";
                    this.setNewLineMode = function(e) {
                        if (this.$newLineMode === e) return;
                        this.$newLineMode = e;
                        this._signal("changeNewLineMode");
                    };
                    this.getNewLineMode = function() {
                        return this.$newLineMode;
                    };
                    this.isNewLine = function(e) {
                        return (e == "\r\n" || e == "\r" || e == "\n");
                    };
                    this.getLine = function(e) {
                        return this.$lines[e] || "";
                    };
                    this.getLines = function(e, t) {
                        return this.$lines.slice(e, t + 1);
                    };
                    this.getAllLines = function() {
                        return this.getLines(0, this.getLength());
                    };
                    this.getLength = function() {
                        return this.$lines.length;
                    };
                    this.getTextRange = function(e) {
                        return this.getLinesForRange(e).join(this.getNewLineCharacter());
                    };
                    this.getLinesForRange = function(e) {
                        var t;
                        if (e.start.row === e.end.row) {
                            t = [
                                this.getLine(e.start.row).substring(e.start.column, e.end.column), 
                            ];
                        } else {
                            t = this.getLines(e.start.row, e.end.row);
                            t[0] = (t[0] || "").substring(e.start.column);
                            var i = t.length - 1;
                            if (e.end.row - e.start.row == i) t[i] = t[i].substring(0, e.end.column);
                        }
                        return t;
                    };
                    this.insertLines = function(e, t) {
                        console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead.");
                        return this.insertFullLines(e, t);
                    };
                    this.removeLines = function(e, t) {
                        console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead.");
                        return this.removeFullLines(e, t);
                    };
                    this.insertNewLine = function(e) {
                        console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead.");
                        return this.insertMergedLines(e, [
                            "",
                            ""
                        ]);
                    };
                    this.insert = function(e, t) {
                        if (this.getLength() <= 1) this.$detectNewLine(t);
                        return this.insertMergedLines(e, this.$split(t));
                    };
                    this.insertInLine = function(e, t) {
                        var i = this.clippedPos(e.row, e.column);
                        var n = this.pos(e.row, e.column + t.length);
                        this.applyDelta({
                            start: i,
                            end: n,
                            action: "insert",
                            lines: [
                                t
                            ]
                        }, true);
                        return this.clonePos(n);
                    };
                    this.clippedPos = function(e, t) {
                        var i = this.getLength();
                        if (e === undefined) {
                            e = i;
                        } else if (e < 0) {
                            e = 0;
                        } else if (e >= i) {
                            e = i - 1;
                            t = undefined;
                        }
                        var n = this.getLine(e);
                        if (t == undefined) t = n.length;
                        t = Math.min(Math.max(t, 0), n.length);
                        return {
                            row: e,
                            column: t
                        };
                    };
                    this.clonePos = function(e) {
                        return {
                            row: e.row,
                            column: e.column
                        };
                    };
                    this.pos = function(e, t) {
                        return {
                            row: e,
                            column: t
                        };
                    };
                    this.$clipPosition = function(e) {
                        var t = this.getLength();
                        if (e.row >= t) {
                            e.row = Math.max(0, t - 1);
                            e.column = this.getLine(t - 1).length;
                        } else {
                            e.row = Math.max(0, e.row);
                            e.column = Math.min(Math.max(e.column, 0), this.getLine(e.row).length);
                        }
                        return e;
                    };
                    this.insertFullLines = function(e, t) {
                        e = Math.min(Math.max(e, 0), this.getLength());
                        var i = 0;
                        if (e < this.getLength()) {
                            t = t.concat([
                                ""
                            ]);
                            i = 0;
                        } else {
                            t = [
                                ""
                            ].concat(t);
                            e--;
                            i = this.$lines[e].length;
                        }
                        this.insertMergedLines({
                            row: e,
                            column: i
                        }, t);
                    };
                    this.insertMergedLines = function(e, t) {
                        var i = this.clippedPos(e.row, e.column);
                        var n = {
                            row: i.row + t.length - 1,
                            column: (t.length == 1 ? i.column : 0) + t[t.length - 1].length
                        };
                        this.applyDelta({
                            start: i,
                            end: n,
                            action: "insert",
                            lines: t
                        });
                        return this.clonePos(n);
                    };
                    this.remove = function(e) {
                        var t = this.clippedPos(e.start.row, e.start.column);
                        var i = this.clippedPos(e.end.row, e.end.column);
                        this.applyDelta({
                            start: t,
                            end: i,
                            action: "remove",
                            lines: this.getLinesForRange({
                                start: t,
                                end: i
                            })
                        });
                        return this.clonePos(t);
                    };
                    this.removeInLine = function(e, t, i) {
                        var n = this.clippedPos(e, t);
                        var r = this.clippedPos(e, i);
                        this.applyDelta({
                            start: n,
                            end: r,
                            action: "remove",
                            lines: this.getLinesForRange({
                                start: n,
                                end: r
                            })
                        }, true);
                        return this.clonePos(n);
                    };
                    this.removeFullLines = function(e, t) {
                        e = Math.min(Math.max(0, e), this.getLength() - 1);
                        t = Math.min(Math.max(0, t), this.getLength() - 1);
                        var i = t == this.getLength() - 1 && e > 0;
                        var n = t < this.getLength() - 1;
                        var r = i ? e - 1 : e;
                        var s = i ? this.getLine(r).length : 0;
                        var a = n ? t + 1 : t;
                        var l = n ? 0 : this.getLine(a).length;
                        var h = new o(r, s, a, l);
                        var c = this.$lines.slice(e, t + 1);
                        this.applyDelta({
                            start: h.start,
                            end: h.end,
                            action: "remove",
                            lines: this.getLinesForRange(h)
                        });
                        return c;
                    };
                    this.removeNewLine = function(e) {
                        if (e < this.getLength() - 1 && e >= 0) {
                            this.applyDelta({
                                start: this.pos(e, this.getLine(e).length),
                                end: this.pos(e + 1, 0),
                                action: "remove",
                                lines: [
                                    "",
                                    ""
                                ]
                            });
                        }
                    };
                    this.replace = function(e, t) {
                        if (!(e instanceof o)) e = o.fromPoints(e.start, e.end);
                        if (t.length === 0 && e.isEmpty()) return e.start;
                        if (t == this.getTextRange(e)) return e.end;
                        this.remove(e);
                        var i;
                        if (t) {
                            i = this.insert(e.start, t);
                        } else {
                            i = e.start;
                        }
                        return i;
                    };
                    this.applyDeltas = function(e) {
                        for(var t = 0; t < e.length; t++){
                            this.applyDelta(e[t]);
                        }
                    };
                    this.revertDeltas = function(e) {
                        for(var t = e.length - 1; t >= 0; t--){
                            this.revertDelta(e[t]);
                        }
                    };
                    this.applyDelta = function(e, t) {
                        var i = e.action == "insert";
                        if (i ? e.lines.length <= 1 && !e.lines[0] : !o.comparePoints(e.start, e.end)) {
                            return;
                        }
                        if (i && e.lines.length > 20000) {
                            this.$splitAndapplyLargeDelta(e, 20000);
                        } else {
                            r(this.$lines, e, t);
                            this._signal("change", e);
                        }
                    };
                    this.$safeApplyDelta = function(e) {
                        var t = this.$lines.length;
                        if ((e.action == "remove" && e.start.row < t && e.end.row < t) || (e.action == "insert" && e.start.row <= t)) {
                            this.applyDelta(e);
                        }
                    };
                    this.$splitAndapplyLargeDelta = function(e, t) {
                        var i = e.lines;
                        var n = i.length - t + 1;
                        var r = e.start.row;
                        var s = e.start.column;
                        for(var o = 0, a = 0; o < n; o = a){
                            a += t - 1;
                            var l = i.slice(o, a);
                            l.push("");
                            this.applyDelta({
                                start: this.pos(r + o, s),
                                end: this.pos(r + a, (s = 0)),
                                action: e.action,
                                lines: l
                            }, true);
                        }
                        e.lines = i.slice(o);
                        e.start.row = r + o;
                        e.start.column = s;
                        this.applyDelta(e, true);
                    };
                    this.revertDelta = function(e) {
                        this.$safeApplyDelta({
                            start: this.clonePos(e.start),
                            end: this.clonePos(e.end),
                            action: e.action == "insert" ? "remove" : "insert",
                            lines: e.lines.slice()
                        });
                    };
                    this.indexToPosition = function(e, t) {
                        var i = this.$lines || this.getAllLines();
                        var n = this.getNewLineCharacter().length;
                        for(var r = t || 0, s = i.length; r < s; r++){
                            e -= i[r].length + n;
                            if (e < 0) return {
                                row: r,
                                column: e + i[r].length + n
                            };
                        }
                        return {
                            row: s - 1,
                            column: e + i[s - 1].length + n
                        };
                    };
                    this.positionToIndex = function(e, t) {
                        var i = this.$lines || this.getAllLines();
                        var n = this.getNewLineCharacter().length;
                        var r = 0;
                        var s = Math.min(e.row, i.length);
                        for(var o = t || 0; o < s; ++o)r += i[o].length + n;
                        return r + e.column;
                    };
                }.call(l.prototype));
                t.Document = l;
            });
            ace.define("ace/background_tokenizer", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./lib/event_emitter").EventEmitter;
                var s = function(e, t) {
                    this.running = false;
                    this.lines = [];
                    this.states = [];
                    this.currentLine = 0;
                    this.tokenizer = e;
                    var i = this;
                    this.$worker = function() {
                        if (!i.running) {
                            return;
                        }
                        var e = new Date();
                        var t = i.currentLine;
                        var n = -1;
                        var r = i.doc;
                        var s = t;
                        while(i.lines[t])t++;
                        var o = r.getLength();
                        var a = 0;
                        i.running = false;
                        while(t < o){
                            i.$tokenizeRow(t);
                            n = t;
                            do {
                                t++;
                            }while (i.lines[t])
                            a++;
                            if (a % 5 === 0 && new Date() - e > 20) {
                                i.running = setTimeout(i.$worker, 20);
                                break;
                            }
                        }
                        i.currentLine = t;
                        if (n == -1) n = t;
                        if (s <= n) i.fireUpdateEvent(s, n);
                    };
                };
                (function() {
                    n.implement(this, r);
                    this.setTokenizer = function(e) {
                        this.tokenizer = e;
                        this.lines = [];
                        this.states = [];
                        this.start(0);
                    };
                    this.setDocument = function(e) {
                        this.doc = e;
                        this.lines = [];
                        this.states = [];
                        this.stop();
                    };
                    this.fireUpdateEvent = function(e, t) {
                        var i = {
                            first: e,
                            last: t
                        };
                        this._signal("update", {
                            data: i
                        });
                    };
                    this.start = function(e) {
                        this.currentLine = Math.min(e || 0, this.currentLine, this.doc.getLength());
                        this.lines.splice(this.currentLine, this.lines.length);
                        this.states.splice(this.currentLine, this.states.length);
                        this.stop();
                        this.running = setTimeout(this.$worker, 700);
                    };
                    this.scheduleStart = function() {
                        if (!this.running) this.running = setTimeout(this.$worker, 700);
                    };
                    this.$updateOnChange = function(e) {
                        var t = e.start.row;
                        var i = e.end.row - t;
                        if (i === 0) {
                            this.lines[t] = null;
                        } else if (e.action == "remove") {
                            this.lines.splice(t, i + 1, null);
                            this.states.splice(t, i + 1, null);
                        } else {
                            var n = Array(i + 1);
                            n.unshift(t, 1);
                            this.lines.splice.apply(this.lines, n);
                            this.states.splice.apply(this.states, n);
                        }
                        this.currentLine = Math.min(t, this.currentLine, this.doc.getLength());
                        this.stop();
                    };
                    this.stop = function() {
                        if (this.running) clearTimeout(this.running);
                        this.running = false;
                    };
                    this.getTokens = function(e) {
                        return this.lines[e] || this.$tokenizeRow(e);
                    };
                    this.getState = function(e) {
                        if (this.currentLine == e) this.$tokenizeRow(e);
                        return this.states[e] || "start";
                    };
                    this.$tokenizeRow = function(e) {
                        var t = this.doc.getLine(e);
                        var i = this.states[e - 1];
                        var n = this.tokenizer.getLineTokens(t, i, e);
                        if (this.states[e] + "" !== n.state + "") {
                            this.states[e] = n.state;
                            this.lines[e + 1] = null;
                            if (this.currentLine > e + 1) this.currentLine = e + 1;
                        } else if (this.currentLine == e) {
                            this.currentLine = e + 1;
                        }
                        return (this.lines[e] = n.tokens);
                    };
                }.call(s.prototype));
                t.BackgroundTokenizer = s;
            });
            ace.define("ace/search_highlight", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/lang");
                var r = e("./lib/oop");
                var s = e("./range").Range;
                var o = function(e, t, i) {
                    this.setRegexp(e);
                    this.clazz = t;
                    this.type = i || "text";
                };
                (function() {
                    this.MAX_RANGES = 500;
                    this.setRegexp = function(e) {
                        if (this.regExp + "" == e + "") return;
                        this.regExp = e;
                        this.cache = [];
                    };
                    this.update = function(e, t, i, r) {
                        if (!this.regExp) return;
                        var o = r.firstRow, a = r.lastRow;
                        for(var l = o; l <= a; l++){
                            var h = this.cache[l];
                            if (h == null) {
                                h = n.getMatchOffsets(i.getLine(l), this.regExp);
                                if (h.length > this.MAX_RANGES) h = h.slice(0, this.MAX_RANGES);
                                h = h.map(function(e) {
                                    return new s(l, e.offset, l, e.offset + e.length);
                                });
                                this.cache[l] = h.length ? h : "";
                            }
                            for(var c = h.length; c--;){
                                t.drawSingleLineMarker(e, h[c].toScreenRange(i), this.clazz, r);
                            }
                        }
                    };
                }.call(o.prototype));
                t.SearchHighlight = o;
            });
            ace.define("ace/edit_session/fold_line", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(e, t, i) {
                "use strict";
                var n = e("../range").Range;
                function r(e, t) {
                    this.foldData = e;
                    if (Array.isArray(t)) {
                        this.folds = t;
                    } else {
                        t = this.folds = [
                            t
                        ];
                    }
                    var i = t[t.length - 1];
                    this.range = new n(t[0].start.row, t[0].start.column, i.end.row, i.end.column);
                    this.start = this.range.start;
                    this.end = this.range.end;
                    this.folds.forEach(function(e) {
                        e.setFoldLine(this);
                    }, this);
                }
                (function() {
                    this.shiftRow = function(e) {
                        this.start.row += e;
                        this.end.row += e;
                        this.folds.forEach(function(t) {
                            t.start.row += e;
                            t.end.row += e;
                        });
                    };
                    this.addFold = function(e) {
                        if (e.sameRow) {
                            if (e.start.row < this.startRow || e.endRow > this.endRow) {
                                throw new Error("Can't add a fold to this FoldLine as it has no connection");
                            }
                            this.folds.push(e);
                            this.folds.sort(function(e, t) {
                                return -e.range.compareEnd(t.start.row, t.start.column);
                            });
                            if (this.range.compareEnd(e.start.row, e.start.column) > 0) {
                                this.end.row = e.end.row;
                                this.end.column = e.end.column;
                            } else if (this.range.compareStart(e.end.row, e.end.column) < 0) {
                                this.start.row = e.start.row;
                                this.start.column = e.start.column;
                            }
                        } else if (e.start.row == this.end.row) {
                            this.folds.push(e);
                            this.end.row = e.end.row;
                            this.end.column = e.end.column;
                        } else if (e.end.row == this.start.row) {
                            this.folds.unshift(e);
                            this.start.row = e.start.row;
                            this.start.column = e.start.column;
                        } else {
                            throw new Error("Trying to add fold to FoldRow that doesn't have a matching row");
                        }
                        e.foldLine = this;
                    };
                    this.containsRow = function(e) {
                        return e >= this.start.row && e <= this.end.row;
                    };
                    this.walk = function(e, t, i) {
                        var n = 0, r = this.folds, s, o, a, l = true;
                        if (t == null) {
                            t = this.end.row;
                            i = this.end.column;
                        }
                        for(var h = 0; h < r.length; h++){
                            s = r[h];
                            o = s.range.compareStart(t, i);
                            if (o == -1) {
                                e(null, t, i, n, l);
                                return;
                            }
                            a = e(null, s.start.row, s.start.column, n, l);
                            a = !a && e(s.placeholder, s.start.row, s.start.column, n);
                            if (a || o === 0) {
                                return;
                            }
                            l = !s.sameRow;
                            n = s.end.column;
                        }
                        e(null, t, i, n, l);
                    };
                    this.getNextFoldTo = function(e, t) {
                        var i, n;
                        for(var r = 0; r < this.folds.length; r++){
                            i = this.folds[r];
                            n = i.range.compareEnd(e, t);
                            if (n == -1) {
                                return {
                                    fold: i,
                                    kind: "after"
                                };
                            } else if (n === 0) {
                                return {
                                    fold: i,
                                    kind: "inside"
                                };
                            }
                        }
                        return null;
                    };
                    this.addRemoveChars = function(e, t, i) {
                        var n = this.getNextFoldTo(e, t), r, s;
                        if (n) {
                            r = n.fold;
                            if (n.kind == "inside" && r.start.column != t && r.start.row != e) {
                                window.console && window.console.log(e, t, r);
                            } else if (r.start.row == e) {
                                s = this.folds;
                                var o = s.indexOf(r);
                                if (o === 0) {
                                    this.start.column += i;
                                }
                                for(o; o < s.length; o++){
                                    r = s[o];
                                    r.start.column += i;
                                    if (!r.sameRow) {
                                        return;
                                    }
                                    r.end.column += i;
                                }
                                this.end.column += i;
                            }
                        }
                    };
                    this.split = function(e, t) {
                        var i = this.getNextFoldTo(e, t);
                        if (!i || i.kind == "inside") return null;
                        var n = i.fold;
                        var s = this.folds;
                        var o = this.foldData;
                        var a = s.indexOf(n);
                        var l = s[a - 1];
                        this.end.row = l.end.row;
                        this.end.column = l.end.column;
                        s = s.splice(a, s.length - a);
                        var h = new r(o, s);
                        o.splice(o.indexOf(this) + 1, 0, h);
                        return h;
                    };
                    this.merge = function(e) {
                        var t = e.folds;
                        for(var i = 0; i < t.length; i++){
                            this.addFold(t[i]);
                        }
                        var n = this.foldData;
                        n.splice(n.indexOf(e), 1);
                    };
                    this.toString = function() {
                        var e = [
                            this.range.toString() + ": ["
                        ];
                        this.folds.forEach(function(t) {
                            e.push("  " + t.toString());
                        });
                        e.push("]");
                        return e.join("\n");
                    };
                    this.idxToPosition = function(e) {
                        var t = 0;
                        for(var i = 0; i < this.folds.length; i++){
                            var n = this.folds[i];
                            e -= n.start.column - t;
                            if (e < 0) {
                                return {
                                    row: n.start.row,
                                    column: n.start.column + e
                                };
                            }
                            e -= n.placeholder.length;
                            if (e < 0) {
                                return n.start;
                            }
                            t = n.end.column;
                        }
                        return {
                            row: this.end.row,
                            column: this.end.column + e
                        };
                    };
                }.call(r.prototype));
                t.FoldLine = r;
            });
            ace.define("ace/range_list", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(e, t, i) {
                "use strict";
                var n = e("./range").Range;
                var r = n.comparePoints;
                var s = function() {
                    this.ranges = [];
                    this.$bias = 1;
                };
                (function() {
                    this.comparePoints = r;
                    this.pointIndex = function(e, t, i) {
                        var n = this.ranges;
                        for(var s = i || 0; s < n.length; s++){
                            var o = n[s];
                            var a = r(e, o.end);
                            if (a > 0) continue;
                            var l = r(e, o.start);
                            if (a === 0) return t && l !== 0 ? -s - 2 : s;
                            if (l > 0 || (l === 0 && !t)) return s;
                            return -s - 1;
                        }
                        return -s - 1;
                    };
                    this.add = function(e) {
                        var t = !e.isEmpty();
                        var i = this.pointIndex(e.start, t);
                        if (i < 0) i = -i - 1;
                        var n = this.pointIndex(e.end, t, i);
                        if (n < 0) n = -n - 1;
                        else n++;
                        return this.ranges.splice(i, n - i, e);
                    };
                    this.addList = function(e) {
                        var t = [];
                        for(var i = e.length; i--;){
                            t.push.apply(t, this.add(e[i]));
                        }
                        return t;
                    };
                    this.substractPoint = function(e) {
                        var t = this.pointIndex(e);
                        if (t >= 0) return this.ranges.splice(t, 1);
                    };
                    this.merge = function() {
                        var e = [];
                        var t = this.ranges;
                        t = t.sort(function(e, t) {
                            return r(e.start, t.start);
                        });
                        var i = t[0], n;
                        for(var s = 1; s < t.length; s++){
                            n = i;
                            i = t[s];
                            var o = r(n.end, i.start);
                            if (o < 0) continue;
                            if (o == 0 && !n.isEmpty() && !i.isEmpty()) continue;
                            if (r(n.end, i.end) < 0) {
                                n.end.row = i.end.row;
                                n.end.column = i.end.column;
                            }
                            t.splice(s, 1);
                            e.push(i);
                            i = n;
                            s--;
                        }
                        this.ranges = t;
                        return e;
                    };
                    this.contains = function(e, t) {
                        return (this.pointIndex({
                            row: e,
                            column: t
                        }) >= 0);
                    };
                    this.containsPoint = function(e) {
                        return this.pointIndex(e) >= 0;
                    };
                    this.rangeAtPoint = function(e) {
                        var t = this.pointIndex(e);
                        if (t >= 0) return this.ranges[t];
                    };
                    this.clipRows = function(e, t) {
                        var i = this.ranges;
                        if (i[0].start.row > t || i[i.length - 1].start.row < e) return [];
                        var n = this.pointIndex({
                            row: e,
                            column: 0
                        });
                        if (n < 0) n = -n - 1;
                        var r = this.pointIndex({
                            row: t,
                            column: 0
                        }, n);
                        if (r < 0) r = -r - 1;
                        var s = [];
                        for(var o = n; o < r; o++){
                            s.push(i[o]);
                        }
                        return s;
                    };
                    this.removeAll = function() {
                        return this.ranges.splice(0, this.ranges.length);
                    };
                    this.attach = function(e) {
                        if (this.session) this.detach();
                        this.session = e;
                        this.onChange = this.$onChange.bind(this);
                        this.session.on("change", this.onChange);
                    };
                    this.detach = function() {
                        if (!this.session) return;
                        this.session.removeListener("change", this.onChange);
                        this.session = null;
                    };
                    this.$onChange = function(e) {
                        var t = e.start;
                        var i = e.end;
                        var n = t.row;
                        var r = i.row;
                        var s = this.ranges;
                        for(var o = 0, a = s.length; o < a; o++){
                            var l = s[o];
                            if (l.end.row >= n) break;
                        }
                        if (e.action == "insert") {
                            var h = r - n;
                            var c = -t.column + i.column;
                            for(; o < a; o++){
                                var l = s[o];
                                if (l.start.row > n) break;
                                if (l.start.row == n && l.start.column >= t.column) {
                                    if (l.start.column == t.column && this.$bias <= 0) {} else {
                                        l.start.column += c;
                                        l.start.row += h;
                                    }
                                }
                                if (l.end.row == n && l.end.column >= t.column) {
                                    if (l.end.column == t.column && this.$bias < 0) {
                                        continue;
                                    }
                                    if (l.end.column == t.column && c > 0 && o < a - 1) {
                                        if (l.end.column > l.start.column && l.end.column == s[o + 1].start.column) l.end.column -= c;
                                    }
                                    l.end.column += c;
                                    l.end.row += h;
                                }
                            }
                        } else {
                            var h = n - r;
                            var c = t.column - i.column;
                            for(; o < a; o++){
                                var l = s[o];
                                if (l.start.row > r) break;
                                if (l.end.row < r && (n < l.end.row || (n == l.end.row && t.column < l.end.column))) {
                                    l.end.row = n;
                                    l.end.column = t.column;
                                } else if (l.end.row == r) {
                                    if (l.end.column <= i.column) {
                                        if (h || l.end.column > t.column) {
                                            l.end.column = t.column;
                                            l.end.row = t.row;
                                        }
                                    } else {
                                        l.end.column += c;
                                        l.end.row += h;
                                    }
                                } else if (l.end.row > r) {
                                    l.end.row += h;
                                }
                                if (l.start.row < r && (n < l.start.row || (n == l.start.row && t.column < l.start.column))) {
                                    l.start.row = n;
                                    l.start.column = t.column;
                                } else if (l.start.row == r) {
                                    if (l.start.column <= i.column) {
                                        if (h || l.start.column > t.column) {
                                            l.start.column = t.column;
                                            l.start.row = t.row;
                                        }
                                    } else {
                                        l.start.column += c;
                                        l.start.row += h;
                                    }
                                } else if (l.start.row > r) {
                                    l.start.row += h;
                                }
                            }
                        }
                        if (h != 0 && o < a) {
                            for(; o < a; o++){
                                var l = s[o];
                                l.start.row += h;
                                l.end.row += h;
                            }
                        }
                    };
                }.call(s.prototype));
                t.RangeList = s;
            });
            ace.define("ace/edit_session/fold", [
                "require",
                "exports",
                "module",
                "ace/range_list",
                "ace/lib/oop", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../range_list").RangeList;
                var r = e("../lib/oop");
                var s = (t.Fold = function(e, t) {
                    this.foldLine = null;
                    this.placeholder = t;
                    this.range = e;
                    this.start = e.start;
                    this.end = e.end;
                    this.sameRow = e.start.row == e.end.row;
                    this.subFolds = this.ranges = [];
                });
                r.inherits(s, n);
                (function() {
                    this.toString = function() {
                        return ('"' + this.placeholder + '" ' + this.range.toString());
                    };
                    this.setFoldLine = function(e) {
                        this.foldLine = e;
                        this.subFolds.forEach(function(t) {
                            t.setFoldLine(e);
                        });
                    };
                    this.clone = function() {
                        var e = this.range.clone();
                        var t = new s(e, this.placeholder);
                        this.subFolds.forEach(function(e) {
                            t.subFolds.push(e.clone());
                        });
                        t.collapseChildren = this.collapseChildren;
                        return t;
                    };
                    this.addSubFold = function(e) {
                        if (this.range.isEqual(e)) return;
                        a(e, this.start);
                        var t = e.start.row, i = e.start.column;
                        for(var n = 0, r = -1; n < this.subFolds.length; n++){
                            r = this.subFolds[n].range.compare(t, i);
                            if (r != 1) break;
                        }
                        var s = this.subFolds[n];
                        var o = 0;
                        if (r == 0) {
                            if (s.range.containsRange(e)) return s.addSubFold(e);
                            else o = 1;
                        }
                        var t = e.range.end.row, i = e.range.end.column;
                        for(var l = n, r = -1; l < this.subFolds.length; l++){
                            r = this.subFolds[l].range.compare(t, i);
                            if (r != 1) break;
                        }
                        if (r == 0) l++;
                        var h = this.subFolds.splice(n, l - n, e);
                        var c = r == 0 ? h.length - 1 : h.length;
                        for(var u = o; u < c; u++){
                            e.addSubFold(h[u]);
                        }
                        e.setFoldLine(this.foldLine);
                        return e;
                    };
                    this.restoreRange = function(e) {
                        return h(e, this.start);
                    };
                }.call(s.prototype));
                function o(e, t) {
                    e.row -= t.row;
                    if (e.row == 0) e.column -= t.column;
                }
                function a(e, t) {
                    o(e.start, t);
                    o(e.end, t);
                }
                function l(e, t) {
                    if (e.row == 0) e.column += t.column;
                    e.row += t.row;
                }
                function h(e, t) {
                    l(e.start, t);
                    l(e.end, t);
                }
            });
            ace.define("ace/edit_session/folding", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/edit_session/fold_line",
                "ace/edit_session/fold",
                "ace/token_iterator", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../range").Range;
                var r = e("./fold_line").FoldLine;
                var s = e("./fold").Fold;
                var o = e("../token_iterator").TokenIterator;
                function a() {
                    this.getFoldAt = function(e, t, i) {
                        var n = this.getFoldLine(e);
                        if (!n) return null;
                        var r = n.folds;
                        for(var s = 0; s < r.length; s++){
                            var o = r[s].range;
                            if (o.contains(e, t)) {
                                if (i == 1 && o.isEnd(e, t) && !o.isEmpty()) {
                                    continue;
                                } else if (i == -1 && o.isStart(e, t) && !o.isEmpty()) {
                                    continue;
                                }
                                return r[s];
                            }
                        }
                    };
                    this.getFoldsInRange = function(e) {
                        var t = e.start;
                        var i = e.end;
                        var n = this.$foldData;
                        var r = [];
                        t.column += 1;
                        i.column -= 1;
                        for(var s = 0; s < n.length; s++){
                            var o = n[s].range.compareRange(e);
                            if (o == 2) {
                                continue;
                            } else if (o == -2) {
                                break;
                            }
                            var a = n[s].folds;
                            for(var l = 0; l < a.length; l++){
                                var h = a[l];
                                o = h.range.compareRange(e);
                                if (o == -2) {
                                    break;
                                } else if (o == 2) {
                                    continue;
                                } else if (o == 42) {
                                    break;
                                }
                                r.push(h);
                            }
                        }
                        t.column -= 1;
                        i.column += 1;
                        return r;
                    };
                    this.getFoldsInRangeList = function(e) {
                        if (Array.isArray(e)) {
                            var t = [];
                            e.forEach(function(e) {
                                t = t.concat(this.getFoldsInRange(e));
                            }, this);
                        } else {
                            var t = this.getFoldsInRange(e);
                        }
                        return t;
                    };
                    this.getAllFolds = function() {
                        var e = [];
                        var t = this.$foldData;
                        for(var i = 0; i < t.length; i++)for(var n = 0; n < t[i].folds.length; n++)e.push(t[i].folds[n]);
                        return e;
                    };
                    this.getFoldStringAt = function(e, t, i, n) {
                        n = n || this.getFoldLine(e);
                        if (!n) return null;
                        var r = {
                            end: {
                                column: 0
                            }
                        };
                        var s, o;
                        for(var a = 0; a < n.folds.length; a++){
                            o = n.folds[a];
                            var l = o.range.compareEnd(e, t);
                            if (l == -1) {
                                s = this.getLine(o.start.row).substring(r.end.column, o.start.column);
                                break;
                            } else if (l === 0) {
                                return null;
                            }
                            r = o;
                        }
                        if (!s) s = this.getLine(o.start.row).substring(r.end.column);
                        if (i == -1) return s.substring(0, t - r.end.column);
                        else if (i == 1) return s.substring(t - r.end.column);
                        else return s;
                    };
                    this.getFoldLine = function(e, t) {
                        var i = this.$foldData;
                        var n = 0;
                        if (t) n = i.indexOf(t);
                        if (n == -1) n = 0;
                        for(n; n < i.length; n++){
                            var r = i[n];
                            if (r.start.row <= e && r.end.row >= e) {
                                return r;
                            } else if (r.end.row > e) {
                                return null;
                            }
                        }
                        return null;
                    };
                    this.getNextFoldLine = function(e, t) {
                        var i = this.$foldData;
                        var n = 0;
                        if (t) n = i.indexOf(t);
                        if (n == -1) n = 0;
                        for(n; n < i.length; n++){
                            var r = i[n];
                            if (r.end.row >= e) {
                                return r;
                            }
                        }
                        return null;
                    };
                    this.getFoldedRowCount = function(e, t) {
                        var i = this.$foldData, n = t - e + 1;
                        for(var r = 0; r < i.length; r++){
                            var s = i[r], o = s.end.row, a = s.start.row;
                            if (o >= t) {
                                if (a < t) {
                                    if (a >= e) n -= t - a;
                                    else n = 0;
                                }
                                break;
                            } else if (o >= e) {
                                if (a >= e) n -= o - a;
                                else n -= o - e + 1;
                            }
                        }
                        return n;
                    };
                    this.$addFoldLine = function(e) {
                        this.$foldData.push(e);
                        this.$foldData.sort(function(e, t) {
                            return e.start.row - t.start.row;
                        });
                        return e;
                    };
                    this.addFold = function(e, t) {
                        var i = this.$foldData;
                        var n = false;
                        var o;
                        if (e instanceof s) o = e;
                        else {
                            o = new s(t, e);
                            o.collapseChildren = t.collapseChildren;
                        }
                        this.$clipRangeToDocument(o.range);
                        var a = o.start.row;
                        var l = o.start.column;
                        var h = o.end.row;
                        var c = o.end.column;
                        var u = this.getFoldAt(a, l, 1);
                        var d = this.getFoldAt(h, c, -1);
                        if (u && d == u) return u.addSubFold(o);
                        if (u && !u.range.isStart(a, l)) this.removeFold(u);
                        if (d && !d.range.isEnd(h, c)) this.removeFold(d);
                        var f = this.getFoldsInRange(o.range);
                        if (f.length > 0) {
                            this.removeFolds(f);
                            if (!o.collapseChildren) {
                                f.forEach(function(e) {
                                    o.addSubFold(e);
                                });
                            }
                        }
                        for(var g = 0; g < i.length; g++){
                            var m = i[g];
                            if (h == m.start.row) {
                                m.addFold(o);
                                n = true;
                                break;
                            } else if (a == m.end.row) {
                                m.addFold(o);
                                n = true;
                                if (!o.sameRow) {
                                    var v = i[g + 1];
                                    if (v && v.start.row == h) {
                                        m.merge(v);
                                        break;
                                    }
                                }
                                break;
                            } else if (h <= m.start.row) {
                                break;
                            }
                        }
                        if (!n) m = this.$addFoldLine(new r(this.$foldData, o));
                        if (this.$useWrapMode) this.$updateWrapData(m.start.row, m.start.row);
                        else this.$updateRowLengthCache(m.start.row, m.start.row);
                        this.$modified = true;
                        this._signal("changeFold", {
                            data: o,
                            action: "add"
                        });
                        return o;
                    };
                    this.addFolds = function(e) {
                        e.forEach(function(e) {
                            this.addFold(e);
                        }, this);
                    };
                    this.removeFold = function(e) {
                        var t = e.foldLine;
                        var i = t.start.row;
                        var n = t.end.row;
                        var r = this.$foldData;
                        var s = t.folds;
                        if (s.length == 1) {
                            r.splice(r.indexOf(t), 1);
                        } else if (t.range.isEnd(e.end.row, e.end.column)) {
                            s.pop();
                            t.end.row = s[s.length - 1].end.row;
                            t.end.column = s[s.length - 1].end.column;
                        } else if (t.range.isStart(e.start.row, e.start.column)) {
                            s.shift();
                            t.start.row = s[0].start.row;
                            t.start.column = s[0].start.column;
                        } else if (e.sameRow) {
                            s.splice(s.indexOf(e), 1);
                        } else {
                            var o = t.split(e.start.row, e.start.column);
                            s = o.folds;
                            s.shift();
                            o.start.row = s[0].start.row;
                            o.start.column = s[0].start.column;
                        }
                        if (!this.$updating) {
                            if (this.$useWrapMode) this.$updateWrapData(i, n);
                            else this.$updateRowLengthCache(i, n);
                        }
                        this.$modified = true;
                        this._signal("changeFold", {
                            data: e,
                            action: "remove"
                        });
                    };
                    this.removeFolds = function(e) {
                        var t = [];
                        for(var i = 0; i < e.length; i++){
                            t.push(e[i]);
                        }
                        t.forEach(function(e) {
                            this.removeFold(e);
                        }, this);
                        this.$modified = true;
                    };
                    this.expandFold = function(e) {
                        this.removeFold(e);
                        e.subFolds.forEach(function(t) {
                            e.restoreRange(t);
                            this.addFold(t);
                        }, this);
                        if (e.collapseChildren > 0) {
                            this.foldAll(e.start.row + 1, e.end.row, e.collapseChildren - 1);
                        }
                        e.subFolds = [];
                    };
                    this.expandFolds = function(e) {
                        e.forEach(function(e) {
                            this.expandFold(e);
                        }, this);
                    };
                    this.unfold = function(e, t) {
                        var i, r;
                        if (e == null) {
                            i = new n(0, 0, this.getLength(), 0);
                            if (t == null) t = true;
                        } else if (typeof e == "number") {
                            i = new n(e, 0, e, this.getLine(e).length);
                        } else if ("row" in e) {
                            i = n.fromPoints(e, e);
                        } else if (Array.isArray(e)) {
                            r = [];
                            e.forEach(function(e) {
                                r = r.concat(this.unfold(e));
                            }, this);
                            return r;
                        } else {
                            i = e;
                        }
                        r = this.getFoldsInRangeList(i);
                        var s = r;
                        while(r.length == 1 && n.comparePoints(r[0].start, i.start) < 0 && n.comparePoints(r[0].end, i.end) > 0){
                            this.expandFolds(r);
                            r = this.getFoldsInRangeList(i);
                        }
                        if (t != false) {
                            this.removeFolds(r);
                        } else {
                            this.expandFolds(r);
                        }
                        if (s.length) return s;
                    };
                    this.isRowFolded = function(e, t) {
                        return !!this.getFoldLine(e, t);
                    };
                    this.getRowFoldEnd = function(e, t) {
                        var i = this.getFoldLine(e, t);
                        return i ? i.end.row : e;
                    };
                    this.getRowFoldStart = function(e, t) {
                        var i = this.getFoldLine(e, t);
                        return i ? i.start.row : e;
                    };
                    this.getFoldDisplayLine = function(e, t, i, n, r) {
                        if (n == null) n = e.start.row;
                        if (r == null) r = 0;
                        if (t == null) t = e.end.row;
                        if (i == null) i = this.getLine(t).length;
                        var s = this.doc;
                        var o = "";
                        e.walk(function(e, t, i, a) {
                            if (t < n) return;
                            if (t == n) {
                                if (i < r) return;
                                a = Math.max(r, a);
                            }
                            if (e != null) {
                                o += e;
                            } else {
                                o += s.getLine(t).substring(a, i);
                            }
                        }, t, i);
                        return o;
                    };
                    this.getDisplayLine = function(e, t, i, n) {
                        var r = this.getFoldLine(e);
                        if (!r) {
                            var s;
                            s = this.doc.getLine(e);
                            return s.substring(n || 0, t || s.length);
                        } else {
                            return this.getFoldDisplayLine(r, e, t, i, n);
                        }
                    };
                    this.$cloneFoldData = function() {
                        var e = [];
                        e = this.$foldData.map(function(t) {
                            var i = t.folds.map(function(e) {
                                return e.clone();
                            });
                            return new r(e, i);
                        });
                        return e;
                    };
                    this.toggleFold = function(e) {
                        var t = this.selection;
                        var i = t.getRange();
                        var n;
                        var r;
                        if (i.isEmpty()) {
                            var s = i.start;
                            n = this.getFoldAt(s.row, s.column);
                            if (n) {
                                this.expandFold(n);
                                return;
                            } else if ((r = this.findMatchingBracket(s))) {
                                if (i.comparePoint(r) == 1) {
                                    i.end = r;
                                } else {
                                    i.start = r;
                                    i.start.column++;
                                    i.end.column--;
                                }
                            } else if ((r = this.findMatchingBracket({
                                row: s.row,
                                column: s.column + 1
                            }))) {
                                if (i.comparePoint(r) == 1) i.end = r;
                                else i.start = r;
                                i.start.column++;
                            } else {
                                i = this.getCommentFoldRange(s.row, s.column) || i;
                            }
                        } else {
                            var o = this.getFoldsInRange(i);
                            if (e && o.length) {
                                this.expandFolds(o);
                                return;
                            } else if (o.length == 1) {
                                n = o[0];
                            }
                        }
                        if (!n) n = this.getFoldAt(i.start.row, i.start.column);
                        if (n && n.range.toString() == i.toString()) {
                            this.expandFold(n);
                            return;
                        }
                        var a = "...";
                        if (!i.isMultiLine()) {
                            a = this.getTextRange(i);
                            if (a.length < 4) return;
                            a = a.trim().substring(0, 2) + "..";
                        }
                        this.addFold(a, i);
                    };
                    this.getCommentFoldRange = function(e, t, i) {
                        var r = new o(this, e, t);
                        var s = r.getCurrentToken();
                        var a = s && s.type;
                        if (s && /^comment|string/.test(a)) {
                            a = a.match(/comment|string/)[0];
                            if (a == "comment") a += "|doc-start";
                            var l = new RegExp(a);
                            var h = new n();
                            if (i != 1) {
                                do {
                                    s = r.stepBackward();
                                }while (s && l.test(s.type))
                                r.stepForward();
                            }
                            h.start.row = r.getCurrentTokenRow();
                            h.start.column = r.getCurrentTokenColumn() + 2;
                            r = new o(this, e, t);
                            if (i != -1) {
                                var c = -1;
                                do {
                                    s = r.stepForward();
                                    if (c == -1) {
                                        var u = this.getState(r.$row);
                                        if (!l.test(u)) c = r.$row;
                                    } else if (r.$row > c) {
                                        break;
                                    }
                                }while (s && l.test(s.type))
                                s = r.stepBackward();
                            } else s = r.getCurrentToken();
                            h.end.row = r.getCurrentTokenRow();
                            h.end.column = r.getCurrentTokenColumn() + s.value.length - 2;
                            return h;
                        }
                    };
                    this.foldAll = function(e, t, i, n) {
                        if (i == undefined) i = 100000;
                        var r = this.foldWidgets;
                        if (!r) return;
                        t = t || this.getLength();
                        e = e || 0;
                        for(var s = e; s < t; s++){
                            if (r[s] == null) r[s] = this.getFoldWidget(s);
                            if (r[s] != "start") continue;
                            if (n && !n(s)) continue;
                            var o = this.getFoldWidgetRange(s);
                            if (o && o.isMultiLine() && o.end.row <= t && o.start.row >= e) {
                                s = o.end.row;
                                o.collapseChildren = i;
                                this.addFold("...", o);
                            }
                        }
                    };
                    this.foldToLevel = function(e) {
                        this.foldAll();
                        while(e-- > 0)this.unfold(null, false);
                    };
                    this.foldAllComments = function() {
                        var e = this;
                        this.foldAll(null, null, null, function(t) {
                            var i = e.getTokens(t);
                            for(var n = 0; n < i.length; n++){
                                var r = i[n];
                                if (r.type == "text" && /^\s+$/.test(r.value)) continue;
                                if (/comment/.test(r.type)) return true;
                                return false;
                            }
                        });
                    };
                    this.$foldStyles = {
                        manual: 1,
                        markbegin: 1,
                        markbeginend: 1
                    };
                    this.$foldStyle = "markbegin";
                    this.setFoldStyle = function(e) {
                        if (!this.$foldStyles[e]) throw new Error("invalid fold style: " + e + "[" + Object.keys(this.$foldStyles).join(", ") + "]");
                        if (this.$foldStyle == e) return;
                        this.$foldStyle = e;
                        if (e == "manual") this.unfold();
                        var t = this.$foldMode;
                        this.$setFolding(null);
                        this.$setFolding(t);
                    };
                    this.$setFolding = function(e) {
                        if (this.$foldMode == e) return;
                        this.$foldMode = e;
                        this.off("change", this.$updateFoldWidgets);
                        this.off("tokenizerUpdate", this.$tokenizerUpdateFoldWidgets);
                        this._signal("changeAnnotation");
                        if (!e || this.$foldStyle == "manual") {
                            this.foldWidgets = null;
                            return;
                        }
                        this.foldWidgets = [];
                        this.getFoldWidget = e.getFoldWidget.bind(e, this, this.$foldStyle);
                        this.getFoldWidgetRange = e.getFoldWidgetRange.bind(e, this, this.$foldStyle);
                        this.$updateFoldWidgets = this.updateFoldWidgets.bind(this);
                        this.$tokenizerUpdateFoldWidgets = this.tokenizerUpdateFoldWidgets.bind(this);
                        this.on("change", this.$updateFoldWidgets);
                        this.on("tokenizerUpdate", this.$tokenizerUpdateFoldWidgets);
                    };
                    this.getParentFoldRangeData = function(e, t) {
                        var i = this.foldWidgets;
                        if (!i || (t && i[e])) return {};
                        var n = e - 1, r;
                        while(n >= 0){
                            var s = i[n];
                            if (s == null) s = i[n] = this.getFoldWidget(n);
                            if (s == "start") {
                                var o = this.getFoldWidgetRange(n);
                                if (!r) r = o;
                                if (o && o.end.row >= e) break;
                            }
                            n--;
                        }
                        return {
                            range: n !== -1 && o,
                            firstRange: r
                        };
                    };
                    this.onFoldWidgetClick = function(e, t) {
                        t = t.domEvent;
                        var i = {
                            children: t.shiftKey,
                            all: t.ctrlKey || t.metaKey,
                            siblings: t.altKey
                        };
                        var n = this.$toggleFoldWidget(e, i);
                        if (!n) {
                            var r = t.target || t.srcElement;
                            if (r && /ace_fold-widget/.test(r.className)) r.className += " ace_invalid";
                        }
                    };
                    this.$toggleFoldWidget = function(e, t) {
                        if (!this.getFoldWidget) return;
                        var i = this.getFoldWidget(e);
                        var n = this.getLine(e);
                        var r = i === "end" ? -1 : 1;
                        var s = this.getFoldAt(e, r === -1 ? 0 : n.length, r);
                        if (s) {
                            if (t.children || t.all) this.removeFold(s);
                            else this.expandFold(s);
                            return s;
                        }
                        var o = this.getFoldWidgetRange(e, true);
                        if (o && !o.isMultiLine()) {
                            s = this.getFoldAt(o.start.row, o.start.column, 1);
                            if (s && o.isEqual(s.range)) {
                                this.removeFold(s);
                                return s;
                            }
                        }
                        if (t.siblings) {
                            var a = this.getParentFoldRangeData(e);
                            if (a.range) {
                                var l = a.range.start.row + 1;
                                var h = a.range.end.row;
                            }
                            this.foldAll(l, h, t.all ? 10000 : 0);
                        } else if (t.children) {
                            h = o ? o.end.row : this.getLength();
                            this.foldAll(e + 1, h, t.all ? 10000 : 0);
                        } else if (o) {
                            if (t.all) o.collapseChildren = 10000;
                            this.addFold("...", o);
                        }
                        return o;
                    };
                    this.toggleFoldWidget = function(e) {
                        var t = this.selection.getCursor().row;
                        t = this.getRowFoldStart(t);
                        var i = this.$toggleFoldWidget(t, {});
                        if (i) return;
                        var n = this.getParentFoldRangeData(t, true);
                        i = n.range || n.firstRange;
                        if (i) {
                            t = i.start.row;
                            var r = this.getFoldAt(t, this.getLine(t).length, 1);
                            if (r) {
                                this.removeFold(r);
                            } else {
                                this.addFold("...", i);
                            }
                        }
                    };
                    this.updateFoldWidgets = function(e) {
                        var t = e.start.row;
                        var i = e.end.row - t;
                        if (i === 0) {
                            this.foldWidgets[t] = null;
                        } else if (e.action == "remove") {
                            this.foldWidgets.splice(t, i + 1, null);
                        } else {
                            var n = Array(i + 1);
                            n.unshift(t, 1);
                            this.foldWidgets.splice.apply(this.foldWidgets, n);
                        }
                    };
                    this.tokenizerUpdateFoldWidgets = function(e) {
                        var t = e.data;
                        if (t.first != t.last) {
                            if (this.foldWidgets.length > t.first) this.foldWidgets.splice(t.first, this.foldWidgets.length);
                        }
                    };
                }
                t.Folding = a;
            });
            ace.define("ace/edit_session/bracket_match", [
                "require",
                "exports",
                "module",
                "ace/token_iterator",
                "ace/range", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../token_iterator").TokenIterator;
                var r = e("../range").Range;
                function s() {
                    this.findMatchingBracket = function(e, t) {
                        if (e.column == 0) return null;
                        var i = t || this.getLine(e.row).charAt(e.column - 1);
                        if (i == "") return null;
                        var n = i.match(/([\(\[\{])|([\)\]\}])/);
                        if (!n) return null;
                        if (n[1]) return this.$findClosingBracket(n[1], e);
                        else return this.$findOpeningBracket(n[2], e);
                    };
                    this.getBracketRange = function(e) {
                        var t = this.getLine(e.row);
                        var i = true, n;
                        var s = t.charAt(e.column - 1);
                        var o = s && s.match(/([\(\[\{])|([\)\]\}])/);
                        if (!o) {
                            s = t.charAt(e.column);
                            e = {
                                row: e.row,
                                column: e.column + 1
                            };
                            o = s && s.match(/([\(\[\{])|([\)\]\}])/);
                            i = false;
                        }
                        if (!o) return null;
                        if (o[1]) {
                            var a = this.$findClosingBracket(o[1], e);
                            if (!a) return null;
                            n = r.fromPoints(e, a);
                            if (!i) {
                                n.end.column++;
                                n.start.column--;
                            }
                            n.cursor = n.end;
                        } else {
                            var a = this.$findOpeningBracket(o[2], e);
                            if (!a) return null;
                            n = r.fromPoints(a, e);
                            if (!i) {
                                n.start.column++;
                                n.end.column--;
                            }
                            n.cursor = n.start;
                        }
                        return n;
                    };
                    this.getMatchingBracketRanges = function(e) {
                        var t = this.getLine(e.row);
                        var i = t.charAt(e.column - 1);
                        var n = i && i.match(/([\(\[\{])|([\)\]\}])/);
                        if (!n) {
                            i = t.charAt(e.column);
                            e = {
                                row: e.row,
                                column: e.column + 1
                            };
                            n = i && i.match(/([\(\[\{])|([\)\]\}])/);
                        }
                        if (!n) return null;
                        var s = new r(e.row, e.column - 1, e.row, e.column);
                        var o = n[1] ? this.$findClosingBracket(n[1], e) : this.$findOpeningBracket(n[2], e);
                        if (!o) return [
                            s
                        ];
                        var a = new r(o.row, o.column, o.row, o.column + 1);
                        return [
                            s,
                            a
                        ];
                    };
                    this.$brackets = {
                        ")": "(",
                        "(": ")",
                        "]": "[",
                        "[": "]",
                        "{": "}",
                        "}": "{",
                        "<": ">",
                        ">": "<"
                    };
                    this.$findOpeningBracket = function(e, t, i) {
                        var r = this.$brackets[e];
                        var s = 1;
                        var o = new n(this, t.row, t.column);
                        var a = o.getCurrentToken();
                        if (!a) a = o.stepForward();
                        if (!a) return;
                        if (!i) {
                            i = new RegExp("(\\.?" + a.type.replace(".", "\\.").replace("rparen", ".paren").replace(/\b(?:end)\b/, "(?:start|begin|end)") + ")+");
                        }
                        var l = t.column - o.getCurrentTokenColumn() - 2;
                        var h = a.value;
                        while(true){
                            while(l >= 0){
                                var c = h.charAt(l);
                                if (c == r) {
                                    s -= 1;
                                    if (s == 0) {
                                        return {
                                            row: o.getCurrentTokenRow(),
                                            column: l + o.getCurrentTokenColumn()
                                        };
                                    }
                                } else if (c == e) {
                                    s += 1;
                                }
                                l -= 1;
                            }
                            do {
                                a = o.stepBackward();
                            }while (a && !i.test(a.type))
                            if (a == null) break;
                            h = a.value;
                            l = h.length - 1;
                        }
                        return null;
                    };
                    this.$findClosingBracket = function(e, t, i) {
                        var r = this.$brackets[e];
                        var s = 1;
                        var o = new n(this, t.row, t.column);
                        var a = o.getCurrentToken();
                        if (!a) a = o.stepForward();
                        if (!a) return;
                        if (!i) {
                            i = new RegExp("(\\.?" + a.type.replace(".", "\\.").replace("lparen", ".paren").replace(/\b(?:start|begin)\b/, "(?:start|begin|end)") + ")+");
                        }
                        var l = t.column - o.getCurrentTokenColumn();
                        while(true){
                            var h = a.value;
                            var c = h.length;
                            while(l < c){
                                var u = h.charAt(l);
                                if (u == r) {
                                    s -= 1;
                                    if (s == 0) {
                                        return {
                                            row: o.getCurrentTokenRow(),
                                            column: l + o.getCurrentTokenColumn()
                                        };
                                    }
                                } else if (u == e) {
                                    s += 1;
                                }
                                l += 1;
                            }
                            do {
                                a = o.stepForward();
                            }while (a && !i.test(a.type))
                            if (a == null) break;
                            l = 0;
                        }
                        return null;
                    };
                }
                t.BracketMatch = s;
            });
            ace.define("ace/edit_session", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/bidihandler",
                "ace/config",
                "ace/lib/event_emitter",
                "ace/selection",
                "ace/mode/text",
                "ace/range",
                "ace/document",
                "ace/background_tokenizer",
                "ace/search_highlight",
                "ace/edit_session/folding",
                "ace/edit_session/bracket_match", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./lib/lang");
                var s = e("./bidihandler").BidiHandler;
                var o = e("./config");
                var a = e("./lib/event_emitter").EventEmitter;
                var l = e("./selection").Selection;
                var h = e("./mode/text").Mode;
                var c = e("./range").Range;
                var u = e("./document").Document;
                var d = e("./background_tokenizer").BackgroundTokenizer;
                var f = e("./search_highlight").SearchHighlight;
                var g = function(e, t) {
                    this.$breakpoints = [];
                    this.$decorations = [];
                    this.$frontMarkers = {};
                    this.$backMarkers = {};
                    this.$markerId = 1;
                    this.$undoSelect = true;
                    this.$foldData = [];
                    this.id = "session" + ++g.$uid;
                    this.$foldData.toString = function() {
                        return this.join("\n");
                    };
                    this.on("changeFold", this.onChangeFold.bind(this));
                    this.$onChange = this.onChange.bind(this);
                    if (typeof e != "object" || !e.getLine) e = new u(e);
                    this.setDocument(e);
                    this.selection = new l(this);
                    this.$bidiHandler = new s(this);
                    o.resetOptions(this);
                    this.setMode(t);
                    o._signal("session", this);
                };
                g.$uid = 0;
                (function() {
                    n.implement(this, a);
                    this.setDocument = function(e) {
                        if (this.doc) this.doc.off("change", this.$onChange);
                        this.doc = e;
                        e.on("change", this.$onChange);
                        if (this.bgTokenizer) this.bgTokenizer.setDocument(this.getDocument());
                        this.resetCaches();
                    };
                    this.getDocument = function() {
                        return this.doc;
                    };
                    this.$resetRowCache = function(e) {
                        if (!e) {
                            this.$docRowCache = [];
                            this.$screenRowCache = [];
                            return;
                        }
                        var t = this.$docRowCache.length;
                        var i = this.$getRowCacheIndex(this.$docRowCache, e) + 1;
                        if (t > i) {
                            this.$docRowCache.splice(i, t);
                            this.$screenRowCache.splice(i, t);
                        }
                    };
                    this.$getRowCacheIndex = function(e, t) {
                        var i = 0;
                        var n = e.length - 1;
                        while(i <= n){
                            var r = (i + n) >> 1;
                            var s = e[r];
                            if (t > s) i = r + 1;
                            else if (t < s) n = r - 1;
                            else return r;
                        }
                        return i - 1;
                    };
                    this.resetCaches = function() {
                        this.$modified = true;
                        this.$wrapData = [];
                        this.$rowLengthCache = [];
                        this.$resetRowCache(0);
                        if (this.bgTokenizer) this.bgTokenizer.start(0);
                    };
                    this.onChangeFold = function(e) {
                        var t = e.data;
                        this.$resetRowCache(t.start.row);
                    };
                    this.onChange = function(e) {
                        this.$modified = true;
                        this.$bidiHandler.onChange(e);
                        this.$resetRowCache(e.start.row);
                        var t = this.$updateInternalDataOnChange(e);
                        if (!this.$fromUndo && this.$undoManager) {
                            if (t && t.length) {
                                this.$undoManager.add({
                                    action: "removeFolds",
                                    folds: t
                                }, this.mergeUndoDeltas);
                                this.mergeUndoDeltas = true;
                            }
                            this.$undoManager.add(e, this.mergeUndoDeltas);
                            this.mergeUndoDeltas = true;
                            this.$informUndoManager.schedule();
                        }
                        this.bgTokenizer && this.bgTokenizer.$updateOnChange(e);
                        this._signal("change", e);
                    };
                    this.setValue = function(e) {
                        this.doc.setValue(e);
                        this.selection.moveTo(0, 0);
                        this.$resetRowCache(0);
                        this.setUndoManager(this.$undoManager);
                        this.getUndoManager().reset();
                    };
                    this.getValue = this.toString = function() {
                        return this.doc.getValue();
                    };
                    this.getSelection = function() {
                        return this.selection;
                    };
                    this.getState = function(e) {
                        return this.bgTokenizer.getState(e);
                    };
                    this.getTokens = function(e) {
                        return this.bgTokenizer.getTokens(e);
                    };
                    this.getTokenAt = function(e, t) {
                        var i = this.bgTokenizer.getTokens(e);
                        var n, r = 0;
                        if (t == null) {
                            var s = i.length - 1;
                            r = this.getLine(e).length;
                        } else {
                            for(var s = 0; s < i.length; s++){
                                r += i[s].value.length;
                                if (r >= t) break;
                            }
                        }
                        n = i[s];
                        if (!n) return null;
                        n.index = s;
                        n.start = r - n.value.length;
                        return n;
                    };
                    this.setUndoManager = function(e) {
                        this.$undoManager = e;
                        if (this.$informUndoManager) this.$informUndoManager.cancel();
                        if (e) {
                            var t = this;
                            e.addSession(this);
                            this.$syncInformUndoManager = function() {
                                t.$informUndoManager.cancel();
                                t.mergeUndoDeltas = false;
                            };
                            this.$informUndoManager = r.delayedCall(this.$syncInformUndoManager);
                        } else {
                            this.$syncInformUndoManager = function() {};
                        }
                    };
                    this.markUndoGroup = function() {
                        if (this.$syncInformUndoManager) this.$syncInformUndoManager();
                    };
                    this.$defaultUndoManager = {
                        undo: function() {},
                        redo: function() {},
                        hasUndo: function() {},
                        hasRedo: function() {},
                        reset: function() {},
                        add: function() {},
                        addSelection: function() {},
                        startNewGroup: function() {},
                        addSession: function() {}
                    };
                    this.getUndoManager = function() {
                        return (this.$undoManager || this.$defaultUndoManager);
                    };
                    this.getTabString = function() {
                        if (this.getUseSoftTabs()) {
                            return r.stringRepeat(" ", this.getTabSize());
                        } else {
                            return "\t";
                        }
                    };
                    this.setUseSoftTabs = function(e) {
                        this.setOption("useSoftTabs", e);
                    };
                    this.getUseSoftTabs = function() {
                        return (this.$useSoftTabs && !this.$mode.$indentWithTabs);
                    };
                    this.setTabSize = function(e) {
                        this.setOption("tabSize", e);
                    };
                    this.getTabSize = function() {
                        return this.$tabSize;
                    };
                    this.isTabStop = function(e) {
                        return (this.$useSoftTabs && e.column % this.$tabSize === 0);
                    };
                    this.setNavigateWithinSoftTabs = function(e) {
                        this.setOption("navigateWithinSoftTabs", e);
                    };
                    this.getNavigateWithinSoftTabs = function() {
                        return this.$navigateWithinSoftTabs;
                    };
                    this.$overwrite = false;
                    this.setOverwrite = function(e) {
                        this.setOption("overwrite", e);
                    };
                    this.getOverwrite = function() {
                        return this.$overwrite;
                    };
                    this.toggleOverwrite = function() {
                        this.setOverwrite(!this.$overwrite);
                    };
                    this.addGutterDecoration = function(e, t) {
                        if (!this.$decorations[e]) this.$decorations[e] = "";
                        this.$decorations[e] += " " + t;
                        this._signal("changeBreakpoint", {});
                    };
                    this.removeGutterDecoration = function(e, t) {
                        this.$decorations[e] = (this.$decorations[e] || "").replace(" " + t, "");
                        this._signal("changeBreakpoint", {});
                    };
                    this.getBreakpoints = function() {
                        return this.$breakpoints;
                    };
                    this.setBreakpoints = function(e) {
                        this.$breakpoints = [];
                        for(var t = 0; t < e.length; t++){
                            this.$breakpoints[e[t]] = "ace_breakpoint";
                        }
                        this._signal("changeBreakpoint", {});
                    };
                    this.clearBreakpoints = function() {
                        this.$breakpoints = [];
                        this._signal("changeBreakpoint", {});
                    };
                    this.setBreakpoint = function(e, t) {
                        if (t === undefined) t = "ace_breakpoint";
                        if (t) this.$breakpoints[e] = t;
                        else delete this.$breakpoints[e];
                        this._signal("changeBreakpoint", {});
                    };
                    this.clearBreakpoint = function(e) {
                        delete this.$breakpoints[e];
                        this._signal("changeBreakpoint", {});
                    };
                    this.addMarker = function(e, t, i, n) {
                        var r = this.$markerId++;
                        var s = {
                            range: e,
                            type: i || "line",
                            renderer: typeof i == "function" ? i : null,
                            clazz: t,
                            inFront: !!n,
                            id: r
                        };
                        if (n) {
                            this.$frontMarkers[r] = s;
                            this._signal("changeFrontMarker");
                        } else {
                            this.$backMarkers[r] = s;
                            this._signal("changeBackMarker");
                        }
                        return r;
                    };
                    this.addDynamicMarker = function(e, t) {
                        if (!e.update) return;
                        var i = this.$markerId++;
                        e.id = i;
                        e.inFront = !!t;
                        if (t) {
                            this.$frontMarkers[i] = e;
                            this._signal("changeFrontMarker");
                        } else {
                            this.$backMarkers[i] = e;
                            this._signal("changeBackMarker");
                        }
                        return e;
                    };
                    this.removeMarker = function(e) {
                        var t = this.$frontMarkers[e] || this.$backMarkers[e];
                        if (!t) return;
                        var i = t.inFront ? this.$frontMarkers : this.$backMarkers;
                        delete i[e];
                        this._signal(t.inFront ? "changeFrontMarker" : "changeBackMarker");
                    };
                    this.getMarkers = function(e) {
                        return e ? this.$frontMarkers : this.$backMarkers;
                    };
                    this.highlight = function(e) {
                        if (!this.$searchHighlight) {
                            var t = new f(null, "ace_selected-word", "text");
                            this.$searchHighlight = this.addDynamicMarker(t);
                        }
                        this.$searchHighlight.setRegexp(e);
                    };
                    this.highlightLines = function(e, t, i, n) {
                        if (typeof t != "number") {
                            i = t;
                            t = e;
                        }
                        if (!i) i = "ace_step";
                        var r = new c(e, 0, t, Infinity);
                        r.id = this.addMarker(r, i, "fullLine", n);
                        return r;
                    };
                    this.setAnnotations = function(e) {
                        this.$annotations = e;
                        this._signal("changeAnnotation", {});
                    };
                    this.getAnnotations = function() {
                        return this.$annotations || [];
                    };
                    this.clearAnnotations = function() {
                        this.setAnnotations([]);
                    };
                    this.$detectNewLine = function(e) {
                        var t = e.match(/^.*?(\r?\n)/m);
                        if (t) {
                            this.$autoNewLine = t[1];
                        } else {
                            this.$autoNewLine = "\n";
                        }
                    };
                    this.getWordRange = function(e, t) {
                        var i = this.getLine(e);
                        var n = false;
                        if (t > 0) n = !!i.charAt(t - 1).match(this.tokenRe);
                        if (!n) n = !!i.charAt(t).match(this.tokenRe);
                        if (n) var r = this.tokenRe;
                        else if (/^\s+$/.test(i.slice(t - 1, t + 1))) var r = /\s/;
                        else var r = this.nonTokenRe;
                        var s = t;
                        if (s > 0) {
                            do {
                                s--;
                            }while (s >= 0 && i.charAt(s).match(r))
                            s++;
                        }
                        var o = t;
                        while(o < i.length && i.charAt(o).match(r)){
                            o++;
                        }
                        return new c(e, s, e, o);
                    };
                    this.getAWordRange = function(e, t) {
                        var i = this.getWordRange(e, t);
                        var n = this.getLine(i.end.row);
                        while(n.charAt(i.end.column).match(/[ \t]/)){
                            i.end.column += 1;
                        }
                        return i;
                    };
                    this.setNewLineMode = function(e) {
                        this.doc.setNewLineMode(e);
                    };
                    this.getNewLineMode = function() {
                        return this.doc.getNewLineMode();
                    };
                    this.setUseWorker = function(e) {
                        this.setOption("useWorker", e);
                    };
                    this.getUseWorker = function() {
                        return this.$useWorker;
                    };
                    this.onReloadTokenizer = function(e) {
                        var t = e.data;
                        this.bgTokenizer.start(t.first);
                        this._signal("tokenizerUpdate", e);
                    };
                    this.$modes = o.$modes;
                    this.$mode = null;
                    this.$modeId = null;
                    this.setMode = function(e, t) {
                        if (e && typeof e === "object") {
                            if (e.getTokenizer) return this.$onChangeMode(e);
                            var i = e;
                            var n = i.path;
                        } else {
                            n = e || "ace/mode/text";
                        }
                        if (!this.$modes["ace/mode/text"]) this.$modes["ace/mode/text"] = new h();
                        if (this.$modes[n] && !i) {
                            this.$onChangeMode(this.$modes[n]);
                            t && t();
                            return;
                        }
                        this.$modeId = n;
                        o.loadModule([
                            "mode",
                            n
                        ], function(e) {
                            if (this.$modeId !== n) return t && t();
                            if (this.$modes[n] && !i) {
                                this.$onChangeMode(this.$modes[n]);
                            } else if (e && e.Mode) {
                                e = new e.Mode(i);
                                if (!i) {
                                    this.$modes[n] = e;
                                    e.$id = n;
                                }
                                this.$onChangeMode(e);
                            }
                            t && t();
                        }.bind(this));
                        if (!this.$mode) this.$onChangeMode(this.$modes["ace/mode/text"], true);
                    };
                    this.$onChangeMode = function(e, t) {
                        if (!t) this.$modeId = e.$id;
                        if (this.$mode === e) return;
                        var i = this.$mode;
                        this.$mode = e;
                        this.$stopWorker();
                        if (this.$useWorker) this.$startWorker();
                        var n = e.getTokenizer();
                        if (n.on !== undefined) {
                            var r = this.onReloadTokenizer.bind(this);
                            n.on("update", r);
                        }
                        if (!this.bgTokenizer) {
                            this.bgTokenizer = new d(n);
                            var s = this;
                            this.bgTokenizer.on("update", function(e) {
                                s._signal("tokenizerUpdate", e);
                            });
                        } else {
                            this.bgTokenizer.setTokenizer(n);
                        }
                        this.bgTokenizer.setDocument(this.getDocument());
                        this.tokenRe = e.tokenRe;
                        this.nonTokenRe = e.nonTokenRe;
                        if (!t) {
                            if (e.attachToSession) e.attachToSession(this);
                            this.$options.wrapMethod.set.call(this, this.$wrapMethod);
                            this.$setFolding(e.foldingRules);
                            this.bgTokenizer.start(0);
                            this._emit("changeMode", {
                                oldMode: i,
                                mode: e
                            });
                        }
                    };
                    this.$stopWorker = function() {
                        if (this.$worker) {
                            this.$worker.terminate();
                            this.$worker = null;
                        }
                    };
                    this.$startWorker = function() {
                        try {
                            this.$worker = this.$mode.createWorker(this);
                        } catch (e) {
                            o.warn("Could not load worker", e);
                            this.$worker = null;
                        }
                    };
                    this.getMode = function() {
                        return this.$mode;
                    };
                    this.$scrollTop = 0;
                    this.setScrollTop = function(e) {
                        if (this.$scrollTop === e || isNaN(e)) return;
                        this.$scrollTop = e;
                        this._signal("changeScrollTop", e);
                    };
                    this.getScrollTop = function() {
                        return this.$scrollTop;
                    };
                    this.$scrollLeft = 0;
                    this.setScrollLeft = function(e) {
                        if (this.$scrollLeft === e || isNaN(e)) return;
                        this.$scrollLeft = e;
                        this._signal("changeScrollLeft", e);
                    };
                    this.getScrollLeft = function() {
                        return this.$scrollLeft;
                    };
                    this.getScreenWidth = function() {
                        this.$computeWidth();
                        if (this.lineWidgets) return Math.max(this.getLineWidgetMaxWidth(), this.screenWidth);
                        return this.screenWidth;
                    };
                    this.getLineWidgetMaxWidth = function() {
                        if (this.lineWidgetsWidth != null) return this.lineWidgetsWidth;
                        var e = 0;
                        this.lineWidgets.forEach(function(t) {
                            if (t && t.screenWidth > e) e = t.screenWidth;
                        });
                        return (this.lineWidgetWidth = e);
                    };
                    this.$computeWidth = function(e) {
                        if (this.$modified || e) {
                            this.$modified = false;
                            if (this.$useWrapMode) return (this.screenWidth = this.$wrapLimit);
                            var t = this.doc.getAllLines();
                            var i = this.$rowLengthCache;
                            var n = 0;
                            var r = 0;
                            var s = this.$foldData[r];
                            var o = s ? s.start.row : Infinity;
                            var a = t.length;
                            for(var l = 0; l < a; l++){
                                if (l > o) {
                                    l = s.end.row + 1;
                                    if (l >= a) break;
                                    s = this.$foldData[r++];
                                    o = s ? s.start.row : Infinity;
                                }
                                if (i[l] == null) i[l] = this.$getStringScreenWidth(t[l])[0];
                                if (i[l] > n) n = i[l];
                            }
                            this.screenWidth = n;
                        }
                    };
                    this.getLine = function(e) {
                        return this.doc.getLine(e);
                    };
                    this.getLines = function(e, t) {
                        return this.doc.getLines(e, t);
                    };
                    this.getLength = function() {
                        return this.doc.getLength();
                    };
                    this.getTextRange = function(e) {
                        return this.doc.getTextRange(e || this.selection.getRange());
                    };
                    this.insert = function(e, t) {
                        return this.doc.insert(e, t);
                    };
                    this.remove = function(e) {
                        return this.doc.remove(e);
                    };
                    this.removeFullLines = function(e, t) {
                        return this.doc.removeFullLines(e, t);
                    };
                    this.undoChanges = function(e, t) {
                        if (!e.length) return;
                        this.$fromUndo = true;
                        for(var i = e.length - 1; i != -1; i--){
                            var n = e[i];
                            if (n.action == "insert" || n.action == "remove") {
                                this.doc.revertDelta(n);
                            } else if (n.folds) {
                                this.addFolds(n.folds);
                            }
                        }
                        if (!t && this.$undoSelect) {
                            if (e.selectionBefore) this.selection.fromJSON(e.selectionBefore);
                            else this.selection.setRange(this.$getUndoSelection(e, true));
                        }
                        this.$fromUndo = false;
                    };
                    this.redoChanges = function(e, t) {
                        if (!e.length) return;
                        this.$fromUndo = true;
                        for(var i = 0; i < e.length; i++){
                            var n = e[i];
                            if (n.action == "insert" || n.action == "remove") {
                                this.doc.$safeApplyDelta(n);
                            }
                        }
                        if (!t && this.$undoSelect) {
                            if (e.selectionAfter) this.selection.fromJSON(e.selectionAfter);
                            else this.selection.setRange(this.$getUndoSelection(e, false));
                        }
                        this.$fromUndo = false;
                    };
                    this.setUndoSelect = function(e) {
                        this.$undoSelect = e;
                    };
                    this.$getUndoSelection = function(e, t) {
                        function i(e) {
                            return t ? e.action !== "insert" : e.action === "insert";
                        }
                        var n, r;
                        for(var s = 0; s < e.length; s++){
                            var o = e[s];
                            if (!o.start) continue;
                            if (!n) {
                                if (i(o)) {
                                    n = c.fromPoints(o.start, o.end);
                                } else {
                                    n = c.fromPoints(o.start, o.start);
                                }
                                continue;
                            }
                            if (i(o)) {
                                r = o.start;
                                if (n.compare(r.row, r.column) == -1) {
                                    n.setStart(r);
                                }
                                r = o.end;
                                if (n.compare(r.row, r.column) == 1) {
                                    n.setEnd(r);
                                }
                            } else {
                                r = o.start;
                                if (n.compare(r.row, r.column) == -1) {
                                    n = c.fromPoints(o.start, o.start);
                                }
                            }
                        }
                        return n;
                    };
                    this.replace = function(e, t) {
                        return this.doc.replace(e, t);
                    };
                    this.moveText = function(e, t, i) {
                        var n = this.getTextRange(e);
                        var r = this.getFoldsInRange(e);
                        var s = c.fromPoints(t, t);
                        if (!i) {
                            this.remove(e);
                            var o = e.start.row - e.end.row;
                            var a = o ? -e.end.column : e.start.column - e.end.column;
                            if (a) {
                                if (s.start.row == e.end.row && s.start.column > e.end.column) s.start.column += a;
                                if (s.end.row == e.end.row && s.end.column > e.end.column) s.end.column += a;
                            }
                            if (o && s.start.row >= e.end.row) {
                                s.start.row += o;
                                s.end.row += o;
                            }
                        }
                        s.end = this.insert(s.start, n);
                        if (r.length) {
                            var l = e.start;
                            var h = s.start;
                            var o = h.row - l.row;
                            var a = h.column - l.column;
                            this.addFolds(r.map(function(e) {
                                e = e.clone();
                                if (e.start.row == l.row) e.start.column += a;
                                if (e.end.row == l.row) e.end.column += a;
                                e.start.row += o;
                                e.end.row += o;
                                return e;
                            }));
                        }
                        return s;
                    };
                    this.indentRows = function(e, t, i) {
                        i = i.replace(/\t/g, this.getTabString());
                        for(var n = e; n <= t; n++)this.doc.insertInLine({
                            row: n,
                            column: 0
                        }, i);
                    };
                    this.outdentRows = function(e) {
                        var t = e.collapseRows();
                        var i = new c(0, 0, 0, 0);
                        var n = this.getTabSize();
                        for(var r = t.start.row; r <= t.end.row; ++r){
                            var s = this.getLine(r);
                            i.start.row = r;
                            i.end.row = r;
                            for(var o = 0; o < n; ++o)if (s.charAt(o) != " ") break;
                            if (o < n && s.charAt(o) == "\t") {
                                i.start.column = o;
                                i.end.column = o + 1;
                            } else {
                                i.start.column = 0;
                                i.end.column = o;
                            }
                            this.remove(i);
                        }
                    };
                    this.$moveLines = function(e, t, i) {
                        e = this.getRowFoldStart(e);
                        t = this.getRowFoldEnd(t);
                        if (i < 0) {
                            var n = this.getRowFoldStart(e + i);
                            if (n < 0) return 0;
                            var r = n - e;
                        } else if (i > 0) {
                            var n = this.getRowFoldEnd(t + i);
                            if (n > this.doc.getLength() - 1) return 0;
                            var r = n - t;
                        } else {
                            e = this.$clipRowToDocument(e);
                            t = this.$clipRowToDocument(t);
                            var r = t - e + 1;
                        }
                        var s = new c(e, 0, t, Number.MAX_VALUE);
                        var o = this.getFoldsInRange(s).map(function(e) {
                            e = e.clone();
                            e.start.row += r;
                            e.end.row += r;
                            return e;
                        });
                        var a = i == 0 ? this.doc.getLines(e, t) : this.doc.removeFullLines(e, t);
                        this.doc.insertFullLines(e + r, a);
                        o.length && this.addFolds(o);
                        return r;
                    };
                    this.moveLinesUp = function(e, t) {
                        return this.$moveLines(e, t, -1);
                    };
                    this.moveLinesDown = function(e, t) {
                        return this.$moveLines(e, t, 1);
                    };
                    this.duplicateLines = function(e, t) {
                        return this.$moveLines(e, t, 0);
                    };
                    this.$clipRowToDocument = function(e) {
                        return Math.max(0, Math.min(e, this.doc.getLength() - 1));
                    };
                    this.$clipColumnToRow = function(e, t) {
                        if (t < 0) return 0;
                        return Math.min(this.doc.getLine(e).length, t);
                    };
                    this.$clipPositionToDocument = function(e, t) {
                        t = Math.max(0, t);
                        if (e < 0) {
                            e = 0;
                            t = 0;
                        } else {
                            var i = this.doc.getLength();
                            if (e >= i) {
                                e = i - 1;
                                t = this.doc.getLine(i - 1).length;
                            } else {
                                t = Math.min(this.doc.getLine(e).length, t);
                            }
                        }
                        return {
                            row: e,
                            column: t
                        };
                    };
                    this.$clipRangeToDocument = function(e) {
                        if (e.start.row < 0) {
                            e.start.row = 0;
                            e.start.column = 0;
                        } else {
                            e.start.column = this.$clipColumnToRow(e.start.row, e.start.column);
                        }
                        var t = this.doc.getLength() - 1;
                        if (e.end.row > t) {
                            e.end.row = t;
                            e.end.column = this.doc.getLine(t).length;
                        } else {
                            e.end.column = this.$clipColumnToRow(e.end.row, e.end.column);
                        }
                        return e;
                    };
                    this.$wrapLimit = 80;
                    this.$useWrapMode = false;
                    this.$wrapLimitRange = {
                        min: null,
                        max: null
                    };
                    this.setUseWrapMode = function(e) {
                        if (e != this.$useWrapMode) {
                            this.$useWrapMode = e;
                            this.$modified = true;
                            this.$resetRowCache(0);
                            if (e) {
                                var t = this.getLength();
                                this.$wrapData = Array(t);
                                this.$updateWrapData(0, t - 1);
                            }
                            this._signal("changeWrapMode");
                        }
                    };
                    this.getUseWrapMode = function() {
                        return this.$useWrapMode;
                    };
                    this.setWrapLimitRange = function(e, t) {
                        if (this.$wrapLimitRange.min !== e || this.$wrapLimitRange.max !== t) {
                            this.$wrapLimitRange = {
                                min: e,
                                max: t
                            };
                            this.$modified = true;
                            this.$bidiHandler.markAsDirty();
                            if (this.$useWrapMode) this._signal("changeWrapMode");
                        }
                    };
                    this.adjustWrapLimit = function(e, t) {
                        var i = this.$wrapLimitRange;
                        if (i.max < 0) i = {
                            min: t,
                            max: t
                        };
                        var n = this.$constrainWrapLimit(e, i.min, i.max);
                        if (n != this.$wrapLimit && n > 1) {
                            this.$wrapLimit = n;
                            this.$modified = true;
                            if (this.$useWrapMode) {
                                this.$updateWrapData(0, this.getLength() - 1);
                                this.$resetRowCache(0);
                                this._signal("changeWrapLimit");
                            }
                            return true;
                        }
                        return false;
                    };
                    this.$constrainWrapLimit = function(e, t, i) {
                        if (t) e = Math.max(t, e);
                        if (i) e = Math.min(i, e);
                        return e;
                    };
                    this.getWrapLimit = function() {
                        return this.$wrapLimit;
                    };
                    this.setWrapLimit = function(e) {
                        this.setWrapLimitRange(e, e);
                    };
                    this.getWrapLimitRange = function() {
                        return {
                            min: this.$wrapLimitRange.min,
                            max: this.$wrapLimitRange.max
                        };
                    };
                    this.$updateInternalDataOnChange = function(e) {
                        var t = this.$useWrapMode;
                        var i = e.action;
                        var n = e.start;
                        var r = e.end;
                        var s = n.row;
                        var o = r.row;
                        var a = o - s;
                        var l = null;
                        this.$updating = true;
                        if (a != 0) {
                            if (i === "remove") {
                                this[t ? "$wrapData" : "$rowLengthCache"].splice(s, a);
                                var h = this.$foldData;
                                l = this.getFoldsInRange(e);
                                this.removeFolds(l);
                                var c = this.getFoldLine(r.row);
                                var u = 0;
                                if (c) {
                                    c.addRemoveChars(r.row, r.column, n.column - r.column);
                                    c.shiftRow(-a);
                                    var d = this.getFoldLine(s);
                                    if (d && d !== c) {
                                        d.merge(c);
                                        c = d;
                                    }
                                    u = h.indexOf(c) + 1;
                                }
                                for(u; u < h.length; u++){
                                    var c = h[u];
                                    if (c.start.row >= r.row) {
                                        c.shiftRow(-a);
                                    }
                                }
                                o = s;
                            } else {
                                var f = Array(a);
                                f.unshift(s, 0);
                                var g = t ? this.$wrapData : this.$rowLengthCache;
                                g.splice.apply(g, f);
                                var h = this.$foldData;
                                var c = this.getFoldLine(s);
                                var u = 0;
                                if (c) {
                                    var m = c.range.compareInside(n.row, n.column);
                                    if (m == 0) {
                                        c = c.split(n.row, n.column);
                                        if (c) {
                                            c.shiftRow(a);
                                            c.addRemoveChars(o, 0, r.column - n.column);
                                        }
                                    } else if (m == -1) {
                                        c.addRemoveChars(s, 0, r.column - n.column);
                                        c.shiftRow(a);
                                    }
                                    u = h.indexOf(c) + 1;
                                }
                                for(u; u < h.length; u++){
                                    var c = h[u];
                                    if (c.start.row >= s) {
                                        c.shiftRow(a);
                                    }
                                }
                            }
                        } else {
                            a = Math.abs(e.start.column - e.end.column);
                            if (i === "remove") {
                                l = this.getFoldsInRange(e);
                                this.removeFolds(l);
                                a = -a;
                            }
                            var c = this.getFoldLine(s);
                            if (c) {
                                c.addRemoveChars(s, n.column, a);
                            }
                        }
                        if (t && this.$wrapData.length != this.doc.getLength()) {
                            console.error("doc.getLength() and $wrapData.length have to be the same!");
                        }
                        this.$updating = false;
                        if (t) this.$updateWrapData(s, o);
                        else this.$updateRowLengthCache(s, o);
                        return l;
                    };
                    this.$updateRowLengthCache = function(e, t, i) {
                        this.$rowLengthCache[e] = null;
                        this.$rowLengthCache[t] = null;
                    };
                    this.$updateWrapData = function(e, t) {
                        var n = this.doc.getAllLines();
                        var r = this.getTabSize();
                        var o = this.$wrapData;
                        var a = this.$wrapLimit;
                        var l;
                        var h;
                        var c = e;
                        t = Math.min(t, n.length - 1);
                        while(c <= t){
                            h = this.getFoldLine(c, h);
                            if (!h) {
                                l = this.$getDisplayTokens(n[c]);
                                o[c] = this.$computeWrapSplits(l, a, r);
                                c++;
                            } else {
                                l = [];
                                h.walk(function(e, t, r, o) {
                                    var a;
                                    if (e != null) {
                                        a = this.$getDisplayTokens(e, l.length);
                                        a[0] = i;
                                        for(var h = 1; h < a.length; h++){
                                            a[h] = s;
                                        }
                                    } else {
                                        a = this.$getDisplayTokens(n[t].substring(o, r), l.length);
                                    }
                                    l = l.concat(a);
                                }.bind(this), h.end.row, n[h.end.row].length + 1);
                                o[h.start.row] = this.$computeWrapSplits(l, a, r);
                                c = h.end.row + 1;
                            }
                        }
                    };
                    var e = 1, t = 2, i = 3, s = 4, l = 9, u = 10, g = 11, m = 12;
                    this.$computeWrapSplits = function(e, n, r) {
                        if (e.length == 0) {
                            return [];
                        }
                        var o = [];
                        var a = e.length;
                        var h = 0, c = 0;
                        var d = this.$wrapAsCode;
                        var f = this.$indentedSoftWrap;
                        var v = n <= Math.max(2 * r, 8) || f === false ? 0 : Math.floor(n / 2);
                        function p() {
                            var t = 0;
                            if (v === 0) return t;
                            if (f) {
                                for(var i = 0; i < e.length; i++){
                                    var n = e[i];
                                    if (n == u) t += 1;
                                    else if (n == g) t += r;
                                    else if (n == m) continue;
                                    else break;
                                }
                            }
                            if (d && f !== false) t += r;
                            return Math.min(t, v);
                        }
                        function w(t) {
                            var i = t - h;
                            for(var n = h; n < t; n++){
                                var r = e[n];
                                if (r === 12 || r === 2) i -= 1;
                            }
                            if (!o.length) {
                                $ = p();
                                o.indent = $;
                            }
                            c += i;
                            o.push(c);
                            h = t;
                        }
                        var $ = 0;
                        while(a - h > n - $){
                            var b = h + n - $;
                            if (e[b - 1] >= u && e[b] >= u) {
                                w(b);
                                continue;
                            }
                            if (e[b] == i || e[b] == s) {
                                for(b; b != h - 1; b--){
                                    if (e[b] == i) {
                                        break;
                                    }
                                }
                                if (b > h) {
                                    w(b);
                                    continue;
                                }
                                b = h + n;
                                for(b; b < e.length; b++){
                                    if (e[b] != s) {
                                        break;
                                    }
                                }
                                if (b == e.length) {
                                    break;
                                }
                                w(b);
                                continue;
                            }
                            var y = Math.max(b - (n - (n >> 2)), h - 1);
                            while(b > y && e[b] < i){
                                b--;
                            }
                            if (d) {
                                while(b > y && e[b] < i){
                                    b--;
                                }
                                while(b > y && e[b] == l){
                                    b--;
                                }
                            } else {
                                while(b > y && e[b] < u){
                                    b--;
                                }
                            }
                            if (b > y) {
                                w(++b);
                                continue;
                            }
                            b = h + n;
                            if (e[b] == t) b--;
                            w(b - $);
                        }
                        return o;
                    };
                    this.$getDisplayTokens = function(i, n) {
                        var r = [];
                        var s;
                        n = n || 0;
                        for(var o = 0; o < i.length; o++){
                            var a = i.charCodeAt(o);
                            if (a == 9) {
                                s = this.getScreenTabSize(r.length + n);
                                r.push(g);
                                for(var h = 1; h < s; h++){
                                    r.push(m);
                                }
                            } else if (a == 32) {
                                r.push(u);
                            } else if ((a > 39 && a < 48) || (a > 57 && a < 64)) {
                                r.push(l);
                            } else if (a >= 0x1100 && v(a)) {
                                r.push(e, t);
                            } else {
                                r.push(e);
                            }
                        }
                        return r;
                    };
                    this.$getStringScreenWidth = function(e, t, i) {
                        if (t == 0) return [
                            0,
                            0
                        ];
                        if (t == null) t = Infinity;
                        i = i || 0;
                        var n, r;
                        for(r = 0; r < e.length; r++){
                            n = e.charCodeAt(r);
                            if (n == 9) {
                                i += this.getScreenTabSize(i);
                            } else if (n >= 0x1100 && v(n)) {
                                i += 2;
                            } else {
                                i += 1;
                            }
                            if (i > t) {
                                break;
                            }
                        }
                        return [
                            i,
                            r
                        ];
                    };
                    this.lineWidgets = null;
                    this.getRowLength = function(e) {
                        var t = 1;
                        if (this.lineWidgets) t += (this.lineWidgets[e] && this.lineWidgets[e].rowCount) || 0;
                        if (!this.$useWrapMode || !this.$wrapData[e]) return t;
                        else return this.$wrapData[e].length + t;
                    };
                    this.getRowLineCount = function(e) {
                        if (!this.$useWrapMode || !this.$wrapData[e]) {
                            return 1;
                        } else {
                            return this.$wrapData[e].length + 1;
                        }
                    };
                    this.getRowWrapIndent = function(e) {
                        if (this.$useWrapMode) {
                            var t = this.screenToDocumentPosition(e, Number.MAX_VALUE);
                            var i = this.$wrapData[t.row];
                            return i.length && i[0] < t.column ? i.indent : 0;
                        } else {
                            return 0;
                        }
                    };
                    this.getScreenLastRowColumn = function(e) {
                        var t = this.screenToDocumentPosition(e, Number.MAX_VALUE);
                        return this.documentToScreenColumn(t.row, t.column);
                    };
                    this.getDocumentLastRowColumn = function(e, t) {
                        var i = this.documentToScreenRow(e, t);
                        return this.getScreenLastRowColumn(i);
                    };
                    this.getDocumentLastRowColumnPosition = function(e, t) {
                        var i = this.documentToScreenRow(e, t);
                        return this.screenToDocumentPosition(i, Number.MAX_VALUE / 10);
                    };
                    this.getRowSplitData = function(e) {
                        if (!this.$useWrapMode) {
                            return undefined;
                        } else {
                            return this.$wrapData[e];
                        }
                    };
                    this.getScreenTabSize = function(e) {
                        return (this.$tabSize - (e % this.$tabSize | 0));
                    };
                    this.screenToDocumentRow = function(e, t) {
                        return this.screenToDocumentPosition(e, t).row;
                    };
                    this.screenToDocumentColumn = function(e, t) {
                        return this.screenToDocumentPosition(e, t).column;
                    };
                    this.screenToDocumentPosition = function(e, t, i) {
                        if (e < 0) return {
                            row: 0,
                            column: 0
                        };
                        var n;
                        var r = 0;
                        var s = 0;
                        var o;
                        var a = 0;
                        var l = 0;
                        var h = this.$screenRowCache;
                        var c = this.$getRowCacheIndex(h, e);
                        var u = h.length;
                        if (u && c >= 0) {
                            var a = h[c];
                            var r = this.$docRowCache[c];
                            var d = e > h[u - 1];
                        } else {
                            var d = !u;
                        }
                        var f = this.getLength() - 1;
                        var g = this.getNextFoldLine(r);
                        var m = g ? g.start.row : Infinity;
                        while(a <= e){
                            l = this.getRowLength(r);
                            if (a + l > e || r >= f) {
                                break;
                            } else {
                                a += l;
                                r++;
                                if (r > m) {
                                    r = g.end.row + 1;
                                    g = this.getNextFoldLine(r, g);
                                    m = g ? g.start.row : Infinity;
                                }
                            }
                            if (d) {
                                this.$docRowCache.push(r);
                                this.$screenRowCache.push(a);
                            }
                        }
                        if (g && g.start.row <= r) {
                            n = this.getFoldDisplayLine(g);
                            r = g.start.row;
                        } else if (a + l <= e || r > f) {
                            return {
                                row: f,
                                column: this.getLine(f).length
                            };
                        } else {
                            n = this.getLine(r);
                            g = null;
                        }
                        var v = 0, p = Math.floor(e - a);
                        if (this.$useWrapMode) {
                            var w = this.$wrapData[r];
                            if (w) {
                                o = w[p];
                                if (p > 0 && w.length) {
                                    v = w.indent;
                                    s = w[p - 1] || w[w.length - 1];
                                    n = n.substring(s);
                                }
                            }
                        }
                        if (i !== undefined && this.$bidiHandler.isBidiRow(a + p, r, p)) t = this.$bidiHandler.offsetToCol(i);
                        s += this.$getStringScreenWidth(n, t - v)[1];
                        if (this.$useWrapMode && s >= o) s = o - 1;
                        if (g) return g.idxToPosition(s);
                        return {
                            row: r,
                            column: s
                        };
                    };
                    this.documentToScreenPosition = function(e, t) {
                        if (typeof t === "undefined") var i = this.$clipPositionToDocument(e.row, e.column);
                        else i = this.$clipPositionToDocument(e, t);
                        e = i.row;
                        t = i.column;
                        var n = 0;
                        var r = null;
                        var s = null;
                        s = this.getFoldAt(e, t, 1);
                        if (s) {
                            e = s.start.row;
                            t = s.start.column;
                        }
                        var o, a = 0;
                        var l = this.$docRowCache;
                        var h = this.$getRowCacheIndex(l, e);
                        var c = l.length;
                        if (c && h >= 0) {
                            var a = l[h];
                            var n = this.$screenRowCache[h];
                            var u = e > l[c - 1];
                        } else {
                            var u = !c;
                        }
                        var d = this.getNextFoldLine(a);
                        var f = d ? d.start.row : Infinity;
                        while(a < e){
                            if (a >= f) {
                                o = d.end.row + 1;
                                if (o > e) break;
                                d = this.getNextFoldLine(o, d);
                                f = d ? d.start.row : Infinity;
                            } else {
                                o = a + 1;
                            }
                            n += this.getRowLength(a);
                            a = o;
                            if (u) {
                                this.$docRowCache.push(a);
                                this.$screenRowCache.push(n);
                            }
                        }
                        var g = "";
                        if (d && a >= f) {
                            g = this.getFoldDisplayLine(d, e, t);
                            r = d.start.row;
                        } else {
                            g = this.getLine(e).substring(0, t);
                            r = e;
                        }
                        var m = 0;
                        if (this.$useWrapMode) {
                            var v = this.$wrapData[r];
                            if (v) {
                                var p = 0;
                                while(g.length >= v[p]){
                                    n++;
                                    p++;
                                }
                                g = g.substring(v[p - 1] || 0, g.length);
                                m = p > 0 ? v.indent : 0;
                            }
                        }
                        if (this.lineWidgets && this.lineWidgets[a] && this.lineWidgets[a].rowsAbove) n += this.lineWidgets[a].rowsAbove;
                        return {
                            row: n,
                            column: m + this.$getStringScreenWidth(g)[0]
                        };
                    };
                    this.documentToScreenColumn = function(e, t) {
                        return this.documentToScreenPosition(e, t).column;
                    };
                    this.documentToScreenRow = function(e, t) {
                        return this.documentToScreenPosition(e, t).row;
                    };
                    this.getScreenLength = function() {
                        var e = 0;
                        var t = null;
                        if (!this.$useWrapMode) {
                            e = this.getLength();
                            var i = this.$foldData;
                            for(var n = 0; n < i.length; n++){
                                t = i[n];
                                e -= t.end.row - t.start.row;
                            }
                        } else {
                            var r = this.$wrapData.length;
                            var s = 0, n = 0;
                            var t = this.$foldData[n++];
                            var o = t ? t.start.row : Infinity;
                            while(s < r){
                                var a = this.$wrapData[s];
                                e += a ? a.length + 1 : 1;
                                s++;
                                if (s > o) {
                                    s = t.end.row + 1;
                                    t = this.$foldData[n++];
                                    o = t ? t.start.row : Infinity;
                                }
                            }
                        }
                        if (this.lineWidgets) e += this.$getWidgetScreenLength();
                        return e;
                    };
                    this.$setFontMetrics = function(e) {
                        if (!this.$enableVarChar) return;
                        this.$getStringScreenWidth = function(t, i, n) {
                            if (i === 0) return [
                                0,
                                0
                            ];
                            if (!i) i = Infinity;
                            n = n || 0;
                            var r, s;
                            for(s = 0; s < t.length; s++){
                                r = t.charAt(s);
                                if (r === "\t") {
                                    n += this.getScreenTabSize(n);
                                } else {
                                    n += e.getCharacterWidth(r);
                                }
                                if (n > i) {
                                    break;
                                }
                            }
                            return [
                                n,
                                s
                            ];
                        };
                    };
                    this.destroy = function() {
                        if (this.bgTokenizer) {
                            this.bgTokenizer.setDocument(null);
                            this.bgTokenizer = null;
                        }
                        this.$stopWorker();
                        this.removeAllListeners();
                        if (this.doc) {
                            this.doc.off("change", this.$onChange);
                        }
                        this.selection.detach();
                    };
                    this.isFullWidth = v;
                    function v(e) {
                        if (e < 0x1100) return false;
                        return ((e >= 0x1100 && e <= 0x115f) || (e >= 0x11a3 && e <= 0x11a7) || (e >= 0x11fa && e <= 0x11ff) || (e >= 0x2329 && e <= 0x232a) || (e >= 0x2e80 && e <= 0x2e99) || (e >= 0x2e9b && e <= 0x2ef3) || (e >= 0x2f00 && e <= 0x2fd5) || (e >= 0x2ff0 && e <= 0x2ffb) || (e >= 0x3000 && e <= 0x303e) || (e >= 0x3041 && e <= 0x3096) || (e >= 0x3099 && e <= 0x30ff) || (e >= 0x3105 && e <= 0x312d) || (e >= 0x3131 && e <= 0x318e) || (e >= 0x3190 && e <= 0x31ba) || (e >= 0x31c0 && e <= 0x31e3) || (e >= 0x31f0 && e <= 0x321e) || (e >= 0x3220 && e <= 0x3247) || (e >= 0x3250 && e <= 0x32fe) || (e >= 0x3300 && e <= 0x4dbf) || (e >= 0x4e00 && e <= 0xa48c) || (e >= 0xa490 && e <= 0xa4c6) || (e >= 0xa960 && e <= 0xa97c) || (e >= 0xac00 && e <= 0xd7a3) || (e >= 0xd7b0 && e <= 0xd7c6) || (e >= 0xd7cb && e <= 0xd7fb) || (e >= 0xf900 && e <= 0xfaff) || (e >= 0xfe10 && e <= 0xfe19) || (e >= 0xfe30 && e <= 0xfe52) || (e >= 0xfe54 && e <= 0xfe66) || (e >= 0xfe68 && e <= 0xfe6b) || (e >= 0xff01 && e <= 0xff60) || (e >= 0xffe0 && e <= 0xffe6));
                    }
                }.call(g.prototype));
                e("./edit_session/folding").Folding.call(g.prototype);
                e("./edit_session/bracket_match").BracketMatch.call(g.prototype);
                o.defineOptions(g.prototype, "session", {
                    wrap: {
                        set: function(e) {
                            if (!e || e == "off") e = false;
                            else if (e == "free") e = true;
                            else if (e == "printMargin") e = -1;
                            else if (typeof e == "string") e = parseInt(e, 10) || false;
                            if (this.$wrap == e) return;
                            this.$wrap = e;
                            if (!e) {
                                this.setUseWrapMode(false);
                            } else {
                                var t = typeof e == "number" ? e : null;
                                this.setWrapLimitRange(t, t);
                                this.setUseWrapMode(true);
                            }
                        },
                        get: function() {
                            if (this.getUseWrapMode()) {
                                if (this.$wrap == -1) return "printMargin";
                                if (!this.getWrapLimitRange().min) return "free";
                                return this.$wrap;
                            }
                            return "off";
                        },
                        handlesSet: true
                    },
                    wrapMethod: {
                        set: function(e) {
                            e = e == "auto" ? this.$mode.type != "text" : e != "text";
                            if (e != this.$wrapAsCode) {
                                this.$wrapAsCode = e;
                                if (this.$useWrapMode) {
                                    this.$useWrapMode = false;
                                    this.setUseWrapMode(true);
                                }
                            }
                        },
                        initialValue: "auto"
                    },
                    indentedSoftWrap: {
                        set: function() {
                            if (this.$useWrapMode) {
                                this.$useWrapMode = false;
                                this.setUseWrapMode(true);
                            }
                        },
                        initialValue: true
                    },
                    firstLineNumber: {
                        set: function() {
                            this._signal("changeBreakpoint");
                        },
                        initialValue: 1
                    },
                    useWorker: {
                        set: function(e) {
                            this.$useWorker = e;
                            this.$stopWorker();
                            if (e) this.$startWorker();
                        },
                        initialValue: true
                    },
                    useSoftTabs: {
                        initialValue: true
                    },
                    tabSize: {
                        set: function(e) {
                            e = parseInt(e);
                            if (e > 0 && this.$tabSize !== e) {
                                this.$modified = true;
                                this.$rowLengthCache = [];
                                this.$tabSize = e;
                                this._signal("changeTabSize");
                            }
                        },
                        initialValue: 4,
                        handlesSet: true
                    },
                    navigateWithinSoftTabs: {
                        initialValue: false
                    },
                    foldStyle: {
                        set: function(e) {
                            this.setFoldStyle(e);
                        },
                        handlesSet: true
                    },
                    overwrite: {
                        set: function(e) {
                            this._signal("changeOverwrite");
                        },
                        initialValue: false
                    },
                    newLineMode: {
                        set: function(e) {
                            this.doc.setNewLineMode(e);
                        },
                        get: function() {
                            return this.doc.getNewLineMode();
                        },
                        handlesSet: true
                    },
                    mode: {
                        set: function(e) {
                            this.setMode(e);
                        },
                        get: function() {
                            return this.$modeId;
                        },
                        handlesSet: true
                    }
                });
                t.EditSession = g;
            });
            ace.define("ace/search", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/lang");
                var r = e("./lib/oop");
                var s = e("./range").Range;
                var o = function() {
                    this.$options = {};
                };
                (function() {
                    this.set = function(e) {
                        r.mixin(this.$options, e);
                        return this;
                    };
                    this.getOptions = function() {
                        return n.copyObject(this.$options);
                    };
                    this.setOptions = function(e) {
                        this.$options = e;
                    };
                    this.find = function(e) {
                        var t = this.$options;
                        var i = this.$matchIterator(e, t);
                        if (!i) return false;
                        var n = null;
                        i.forEach(function(e, i, r, o) {
                            n = new s(e, i, r, o);
                            if (i == o && t.start && t.start.start && t.skipCurrent != false && n.isEqual(t.start)) {
                                n = null;
                                return false;
                            }
                            return true;
                        });
                        return n;
                    };
                    this.findAll = function(e) {
                        var t = this.$options;
                        if (!t.needle) return [];
                        this.$assembleRegExp(t);
                        var i = t.range;
                        var r = i ? e.getLines(i.start.row, i.end.row) : e.doc.getAllLines();
                        var o = [];
                        var a = t.re;
                        if (t.$isMultiLine) {
                            var l = a.length;
                            var h = r.length - l;
                            var c;
                            outer: for(var u = a.offset || 0; u <= h; u++){
                                for(var d = 0; d < l; d++)if (r[u + d].search(a[d]) == -1) continue outer;
                                var f = r[u];
                                var g = r[u + l - 1];
                                var m = f.length - f.match(a[0])[0].length;
                                var v = g.match(a[l - 1])[0].length;
                                if (c && c.end.row === u && c.end.column > m) {
                                    continue;
                                }
                                o.push((c = new s(u, m, u + l - 1, v)));
                                if (l > 2) u = u + l - 2;
                            }
                        } else {
                            for(var p = 0; p < r.length; p++){
                                var w = n.getMatchOffsets(r[p], a);
                                for(var d = 0; d < w.length; d++){
                                    var $ = w[d];
                                    o.push(new s(p, $.offset, p, $.offset + $.length));
                                }
                            }
                        }
                        if (i) {
                            var b = i.start.column;
                            var y = i.start.column;
                            var p = 0, d = o.length - 1;
                            while(p < d && o[p].start.column < b && o[p].start.row == i.start.row)p++;
                            while(p < d && o[d].end.column > y && o[d].end.row == i.end.row)d--;
                            o = o.slice(p, d + 1);
                            for(p = 0, d = o.length; p < d; p++){
                                o[p].start.row += i.start.row;
                                o[p].end.row += i.start.row;
                            }
                        }
                        return o;
                    };
                    this.replace = function(e, t) {
                        var i = this.$options;
                        var n = this.$assembleRegExp(i);
                        if (i.$isMultiLine) return t;
                        if (!n) return;
                        var r = n.exec(e);
                        if (!r || r[0].length != e.length) return null;
                        t = e.replace(n, t);
                        if (i.preserveCase) {
                            t = t.split("");
                            for(var s = Math.min(e.length, e.length); s--;){
                                var o = e[s];
                                if (o && o.toLowerCase() != o) t[s] = t[s].toUpperCase();
                                else t[s] = t[s].toLowerCase();
                            }
                            t = t.join("");
                        }
                        return t;
                    };
                    this.$assembleRegExp = function(e, t) {
                        if (e.needle instanceof RegExp) return (e.re = e.needle);
                        var i = e.needle;
                        if (!e.needle) return (e.re = false);
                        if (!e.regExp) i = n.escapeRegExp(i);
                        if (e.wholeWord) i = a(i, e);
                        var r = e.caseSensitive ? "gm" : "gmi";
                        e.$isMultiLine = !t && /[\n\r]/.test(i);
                        if (e.$isMultiLine) return (e.re = this.$assembleMultilineRegExp(i, r));
                        try {
                            var s = new RegExp(i, r);
                        } catch (o) {
                            s = false;
                        }
                        return (e.re = s);
                    };
                    this.$assembleMultilineRegExp = function(e, t) {
                        var i = e.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
                        var n = [];
                        for(var r = 0; r < i.length; r++)try {
                            n.push(new RegExp(i[r], t));
                        } catch (s) {
                            return false;
                        }
                        return n;
                    };
                    this.$matchIterator = function(e, t) {
                        var i = this.$assembleRegExp(t);
                        if (!i) return false;
                        var n = t.backwards == true;
                        var r = t.skipCurrent != false;
                        var s = t.range;
                        var o = t.start;
                        if (!o) o = s ? s[n ? "end" : "start"] : e.selection.getRange();
                        if (o.start) o = o[r != n ? "end" : "start"];
                        var a = s ? s.start.row : 0;
                        var l = s ? s.end.row : e.getLength() - 1;
                        if (n) {
                            var h = function(e) {
                                var i = o.row;
                                if (u(i, o.column, e)) return;
                                for(i--; i >= a; i--)if (u(i, Number.MAX_VALUE, e)) return;
                                if (t.wrap == false) return;
                                for(i = l, a = o.row; i >= a; i--)if (u(i, Number.MAX_VALUE, e)) return;
                            };
                        } else {
                            var h = function(e) {
                                var i = o.row;
                                if (u(i, o.column, e)) return;
                                for(i = i + 1; i <= l; i++)if (u(i, 0, e)) return;
                                if (t.wrap == false) return;
                                for(i = a, l = o.row; i <= l; i++)if (u(i, 0, e)) return;
                            };
                        }
                        if (t.$isMultiLine) {
                            var c = i.length;
                            var u = function(t, r, s) {
                                var o = n ? t - c + 1 : t;
                                if (o < 0 || o + c > e.getLength()) return;
                                var a = e.getLine(o);
                                var l = a.search(i[0]);
                                if ((!n && l < r) || l === -1) return;
                                for(var h = 1; h < c; h++){
                                    a = e.getLine(o + h);
                                    if (a.search(i[h]) == -1) return;
                                }
                                var u = a.match(i[c - 1])[0].length;
                                if (n && u > r) return;
                                if (s(o, l, o + c - 1, u)) return true;
                            };
                        } else if (n) {
                            var u = function(t, n, r) {
                                var s = e.getLine(t);
                                var o = [];
                                var a, l = 0;
                                i.lastIndex = 0;
                                while((a = i.exec(s))){
                                    var h = a[0].length;
                                    l = a.index;
                                    if (!h) {
                                        if (l >= s.length) break;
                                        i.lastIndex = l += 1;
                                    }
                                    if (a.index + h > n) break;
                                    o.push(a.index, h);
                                }
                                for(var c = o.length - 1; c >= 0; c -= 2){
                                    var u = o[c - 1];
                                    var h = o[c];
                                    if (r(t, u, t, u + h)) return true;
                                }
                            };
                        } else {
                            var u = function(t, n, r) {
                                var s = e.getLine(t);
                                var o;
                                var a;
                                i.lastIndex = n;
                                while((a = i.exec(s))){
                                    var l = a[0].length;
                                    o = a.index;
                                    if (r(t, o, t, o + l)) return true;
                                    if (!l) {
                                        i.lastIndex = o += 1;
                                        if (o >= s.length) return false;
                                    }
                                }
                            };
                        }
                        return {
                            forEach: h
                        };
                    };
                }.call(o.prototype));
                function a(e, t) {
                    function i(e) {
                        if (/\w/.test(e) || t.regExp) return "\\b";
                        return "";
                    }
                    return (i(e[0]) + e + i(e[e.length - 1]));
                }
                t.Search = o;
            });
            ace.define("ace/keyboard/hash_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/keys");
                var r = e("../lib/useragent");
                var s = n.KEY_MODS;
                function o(e, t) {
                    this.platform = t || (r.isMac ? "mac" : "win");
                    this.commands = {};
                    this.commandKeyBinding = {};
                    this.addCommands(e);
                    this.$singleCommand = true;
                }
                function a(e, t) {
                    o.call(this, e, t);
                    this.$singleCommand = false;
                }
                a.prototype = o.prototype;
                (function() {
                    this.addCommand = function(e) {
                        if (this.commands[e.name]) this.removeCommand(e);
                        this.commands[e.name] = e;
                        if (e.bindKey) this._buildKeyHash(e);
                    };
                    this.removeCommand = function(e, t) {
                        var i = e && (typeof e === "string" ? e : e.name);
                        e = this.commands[i];
                        if (!t) delete this.commands[i];
                        var n = this.commandKeyBinding;
                        for(var r in n){
                            var s = n[r];
                            if (s == e) {
                                delete n[r];
                            } else if (Array.isArray(s)) {
                                var o = s.indexOf(e);
                                if (o != -1) {
                                    s.splice(o, 1);
                                    if (s.length == 1) n[r] = s[0];
                                }
                            }
                        }
                    };
                    this.bindKey = function(e, t, i) {
                        if (typeof e == "object" && e) {
                            if (i == undefined) i = e.position;
                            e = e[this.platform];
                        }
                        if (!e) return;
                        if (typeof t == "function") return this.addCommand({
                            exec: t,
                            bindKey: e,
                            name: t.name || e
                        });
                        e.split("|").forEach(function(e) {
                            var n = "";
                            if (e.indexOf(" ") != -1) {
                                var r = e.split(/\s+/);
                                e = r.pop();
                                r.forEach(function(e) {
                                    var t = this.parseKeys(e);
                                    var i = s[t.hashId] + t.key;
                                    n += (n ? " " : "") + i;
                                    this._addCommandToBinding(n, "chainKeys");
                                }, this);
                                n += " ";
                            }
                            var o = this.parseKeys(e);
                            var a = s[o.hashId] + o.key;
                            this._addCommandToBinding(n + a, t, i);
                        }, this);
                    };
                    function e(e) {
                        return ((typeof e == "object" && e.bindKey && e.bindKey.position) || (e.isDefault ? -100 : 0));
                    }
                    this._addCommandToBinding = function(t, i, n) {
                        var r = this.commandKeyBinding, s;
                        if (!i) {
                            delete r[t];
                        } else if (!r[t] || this.$singleCommand) {
                            r[t] = i;
                        } else {
                            if (!Array.isArray(r[t])) {
                                r[t] = [
                                    r[t]
                                ];
                            } else if ((s = r[t].indexOf(i)) != -1) {
                                r[t].splice(s, 1);
                            }
                            if (typeof n != "number") {
                                n = e(i);
                            }
                            var o = r[t];
                            for(s = 0; s < o.length; s++){
                                var a = o[s];
                                var l = e(a);
                                if (l > n) break;
                            }
                            o.splice(s, 0, i);
                        }
                    };
                    this.addCommands = function(e) {
                        e && Object.keys(e).forEach(function(t) {
                            var i = e[t];
                            if (!i) return;
                            if (typeof i === "string") return this.bindKey(i, t);
                            if (typeof i === "function") i = {
                                exec: i
                            };
                            if (typeof i !== "object") return;
                            if (!i.name) i.name = t;
                            this.addCommand(i);
                        }, this);
                    };
                    this.removeCommands = function(e) {
                        Object.keys(e).forEach(function(t) {
                            this.removeCommand(e[t]);
                        }, this);
                    };
                    this.bindKeys = function(e) {
                        Object.keys(e).forEach(function(t) {
                            this.bindKey(t, e[t]);
                        }, this);
                    };
                    this._buildKeyHash = function(e) {
                        this.bindKey(e.bindKey, e);
                    };
                    this.parseKeys = function(e) {
                        var t = e.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(e) {
                            return e;
                        });
                        var i = t.pop();
                        var r = n[i];
                        if (n.FUNCTION_KEYS[r]) i = n.FUNCTION_KEYS[r].toLowerCase();
                        else if (!t.length) return {
                            key: i,
                            hashId: -1
                        };
                        else if (t.length == 1 && t[0] == "shift") return {
                            key: i.toUpperCase(),
                            hashId: -1
                        };
                        var s = 0;
                        for(var o = t.length; o--;){
                            var a = n.KEY_MODS[t[o]];
                            if (a == null) {
                                if (typeof console != "undefined") console.error("invalid modifier " + t[o] + " in " + e);
                                return false;
                            }
                            s |= a;
                        }
                        return {
                            key: i,
                            hashId: s
                        };
                    };
                    this.findKeyCommand = function e(t, i) {
                        var n = s[t] + i;
                        return this.commandKeyBinding[n];
                    };
                    this.handleKeyboard = function(e, t, i, n) {
                        if (n < 0) return;
                        var r = s[t] + i;
                        var o = this.commandKeyBinding[r];
                        if (e.$keyChain) {
                            e.$keyChain += " " + r;
                            o = this.commandKeyBinding[e.$keyChain] || o;
                        }
                        if (o) {
                            if (o == "chainKeys" || o[o.length - 1] == "chainKeys") {
                                e.$keyChain = e.$keyChain || r;
                                return {
                                    command: "null"
                                };
                            }
                        }
                        if (e.$keyChain) {
                            if ((!t || t == 4) && i.length == 1) e.$keyChain = e.$keyChain.slice(0, -r.length - 1);
                            else if (t == -1 || n > 0) e.$keyChain = "";
                        }
                        return {
                            command: o
                        };
                    };
                    this.getStatusText = function(e, t) {
                        return t.$keyChain || "";
                    };
                }.call(o.prototype));
                t.HashHandler = o;
                t.MultiHashHandler = a;
            });
            ace.define("ace/commands/command_manager", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/keyboard/hash_handler",
                "ace/lib/event_emitter", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/oop");
                var r = e("../keyboard/hash_handler").MultiHashHandler;
                var s = e("../lib/event_emitter").EventEmitter;
                var o = function(e, t) {
                    r.call(this, t, e);
                    this.byName = this.commands;
                    this.setDefaultHandler("exec", function(e) {
                        return e.command.exec(e.editor, e.args || {});
                    });
                };
                n.inherits(o, r);
                (function() {
                    n.implement(this, s);
                    this.exec = function(e, t, i) {
                        if (Array.isArray(e)) {
                            for(var n = e.length; n--;){
                                if (this.exec(e[n], t, i)) return true;
                            }
                            return false;
                        }
                        if (typeof e === "string") e = this.commands[e];
                        if (!e) return false;
                        if (t && t.$readOnly && !e.readOnly) return false;
                        if (this.$checkCommandState != false && e.isAvailable && !e.isAvailable(t)) return false;
                        var r = {
                            editor: t,
                            command: e,
                            args: i
                        };
                        r.returnValue = this._emit("exec", r);
                        this._signal("afterExec", r);
                        return r.returnValue === false ? false : true;
                    };
                    this.toggleRecording = function(e) {
                        if (this.$inReplay) return;
                        e && e._emit("changeStatus");
                        if (this.recording) {
                            this.macro.pop();
                            this.off("exec", this.$addCommandToMacro);
                            if (!this.macro.length) this.macro = this.oldMacro;
                            return (this.recording = false);
                        }
                        if (!this.$addCommandToMacro) {
                            this.$addCommandToMacro = function(e) {
                                this.macro.push([
                                    e.command,
                                    e.args
                                ]);
                            }.bind(this);
                        }
                        this.oldMacro = this.macro;
                        this.macro = [];
                        this.on("exec", this.$addCommandToMacro);
                        return (this.recording = true);
                    };
                    this.replay = function(e) {
                        if (this.$inReplay || !this.macro) return;
                        if (this.recording) return this.toggleRecording(e);
                        try {
                            this.$inReplay = true;
                            this.macro.forEach(function(t) {
                                if (typeof t == "string") this.exec(t, e);
                                else this.exec(t[0], e, t[1]);
                            }, this);
                        } finally{
                            this.$inReplay = false;
                        }
                    };
                    this.trimMacro = function(e) {
                        return e.map(function(e) {
                            if (typeof e[0] != "string") e[0] = e[0].name;
                            if (!e[1]) e = e[0];
                            return e;
                        });
                    };
                }.call(o.prototype));
                t.CommandManager = o;
            });
            ace.define("ace/commands/default_commands", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/config",
                "ace/range", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/lang");
                var r = e("../config");
                var s = e("../range").Range;
                function o(e, t) {
                    return {
                        win: e,
                        mac: t
                    };
                }
                t.commands = [
                    {
                        name: "showSettingsMenu",
                        description: "Show settings menu",
                        bindKey: o("Ctrl-,", "Command-,"),
                        exec: function(e) {
                            r.loadModule("ace/ext/settings_menu", function(t) {
                                t.init(e);
                                e.showSettingsMenu();
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "goToNextError",
                        description: "Go to next error",
                        bindKey: o("Alt-E", "F4"),
                        exec: function(e) {
                            r.loadModule("./ext/error_marker", function(t) {
                                t.showErrorMarker(e, 1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "goToPreviousError",
                        description: "Go to previous error",
                        bindKey: o("Alt-Shift-E", "Shift-F4"),
                        exec: function(e) {
                            r.loadModule("./ext/error_marker", function(t) {
                                t.showErrorMarker(e, -1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "selectall",
                        description: "Select all",
                        bindKey: o("Ctrl-A", "Command-A"),
                        exec: function(e) {
                            e.selectAll();
                        },
                        readOnly: true
                    },
                    {
                        name: "centerselection",
                        description: "Center selection",
                        bindKey: o(null, "Ctrl-L"),
                        exec: function(e) {
                            e.centerSelection();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotoline",
                        description: "Go to line...",
                        bindKey: o("Ctrl-L", "Command-L"),
                        exec: function(e, t) {
                            if (typeof t === "number" && !isNaN(t)) e.gotoLine(t);
                            e.prompt({
                                $type: "gotoLine"
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "fold",
                        bindKey: o("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
                        exec: function(e) {
                            e.session.toggleFold(false);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "unfold",
                        bindKey: o("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
                        exec: function(e) {
                            e.session.toggleFold(true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "toggleFoldWidget",
                        description: "Toggle fold widget",
                        bindKey: o("F2", "F2"),
                        exec: function(e) {
                            e.session.toggleFoldWidget();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "toggleParentFoldWidget",
                        description: "Toggle parent fold widget",
                        bindKey: o("Alt-F2", "Alt-F2"),
                        exec: function(e) {
                            e.session.toggleFoldWidget(true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldall",
                        description: "Fold all",
                        bindKey: o(null, "Ctrl-Command-Option-0"),
                        exec: function(e) {
                            e.session.foldAll();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldAllComments",
                        description: "Fold all comments",
                        bindKey: o(null, "Ctrl-Command-Option-0"),
                        exec: function(e) {
                            e.session.foldAllComments();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldOther",
                        description: "Fold other",
                        bindKey: o("Alt-0", "Command-Option-0"),
                        exec: function(e) {
                            e.session.foldAll();
                            e.session.unfold(e.selection.getAllRanges());
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "unfoldall",
                        description: "Unfold all",
                        bindKey: o("Alt-Shift-0", "Command-Option-Shift-0"),
                        exec: function(e) {
                            e.session.unfold();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "findnext",
                        description: "Find next",
                        bindKey: o("Ctrl-K", "Command-G"),
                        exec: function(e) {
                            e.findNext();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "findprevious",
                        description: "Find previous",
                        bindKey: o("Ctrl-Shift-K", "Command-Shift-G"),
                        exec: function(e) {
                            e.findPrevious();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "selectOrFindNext",
                        description: "Select or find next",
                        bindKey: o("Alt-K", "Ctrl-G"),
                        exec: function(e) {
                            if (e.selection.isEmpty()) e.selection.selectWord();
                            else e.findNext();
                        },
                        readOnly: true
                    },
                    {
                        name: "selectOrFindPrevious",
                        description: "Select or find previous",
                        bindKey: o("Alt-Shift-K", "Ctrl-Shift-G"),
                        exec: function(e) {
                            if (e.selection.isEmpty()) e.selection.selectWord();
                            else e.findPrevious();
                        },
                        readOnly: true
                    },
                    {
                        name: "find",
                        description: "Find",
                        bindKey: o("Ctrl-F", "Command-F"),
                        exec: function(e) {
                            r.loadModule("ace/ext/searchbox", function(t) {
                                t.Search(e);
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "overwrite",
                        description: "Overwrite",
                        bindKey: "Insert",
                        exec: function(e) {
                            e.toggleOverwrite();
                        },
                        readOnly: true
                    },
                    {
                        name: "selecttostart",
                        description: "Select to start",
                        bindKey: o("Ctrl-Shift-Home", "Command-Shift-Home|Command-Shift-Up"),
                        exec: function(e) {
                            e.getSelection().selectFileStart();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "gotostart",
                        description: "Go to start",
                        bindKey: o("Ctrl-Home", "Command-Home|Command-Up"),
                        exec: function(e) {
                            e.navigateFileStart();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "selectup",
                        description: "Select up",
                        bindKey: o("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
                        exec: function(e) {
                            e.getSelection().selectUp();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "golineup",
                        description: "Go line up",
                        bindKey: o("Up", "Up|Ctrl-P"),
                        exec: function(e, t) {
                            e.navigateUp(t.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selecttoend",
                        description: "Select to end",
                        bindKey: o("Ctrl-Shift-End", "Command-Shift-End|Command-Shift-Down"),
                        exec: function(e) {
                            e.getSelection().selectFileEnd();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "gotoend",
                        description: "Go to end",
                        bindKey: o("Ctrl-End", "Command-End|Command-Down"),
                        exec: function(e) {
                            e.navigateFileEnd();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "selectdown",
                        description: "Select down",
                        bindKey: o("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
                        exec: function(e) {
                            e.getSelection().selectDown();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "golinedown",
                        description: "Go line down",
                        bindKey: o("Down", "Down|Ctrl-N"),
                        exec: function(e, t) {
                            e.navigateDown(t.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectwordleft",
                        description: "Select word left",
                        bindKey: o("Ctrl-Shift-Left", "Option-Shift-Left"),
                        exec: function(e) {
                            e.getSelection().selectWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotowordleft",
                        description: "Go to word left",
                        bindKey: o("Ctrl-Left", "Option-Left"),
                        exec: function(e) {
                            e.navigateWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selecttolinestart",
                        description: "Select to line start",
                        bindKey: o("Alt-Shift-Left", "Command-Shift-Left|Ctrl-Shift-A"),
                        exec: function(e) {
                            e.getSelection().selectLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotolinestart",
                        description: "Go to line start",
                        bindKey: o("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
                        exec: function(e) {
                            e.navigateLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectleft",
                        description: "Select left",
                        bindKey: o("Shift-Left", "Shift-Left|Ctrl-Shift-B"),
                        exec: function(e) {
                            e.getSelection().selectLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotoleft",
                        description: "Go to left",
                        bindKey: o("Left", "Left|Ctrl-B"),
                        exec: function(e, t) {
                            e.navigateLeft(t.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectwordright",
                        description: "Select word right",
                        bindKey: o("Ctrl-Shift-Right", "Option-Shift-Right"),
                        exec: function(e) {
                            e.getSelection().selectWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotowordright",
                        description: "Go to word right",
                        bindKey: o("Ctrl-Right", "Option-Right"),
                        exec: function(e) {
                            e.navigateWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selecttolineend",
                        description: "Select to line end",
                        bindKey: o("Alt-Shift-Right", "Command-Shift-Right|Shift-End|Ctrl-Shift-E"),
                        exec: function(e) {
                            e.getSelection().selectLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotolineend",
                        description: "Go to line end",
                        bindKey: o("Alt-Right|End", "Command-Right|End|Ctrl-E"),
                        exec: function(e) {
                            e.navigateLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectright",
                        description: "Select right",
                        bindKey: o("Shift-Right", "Shift-Right"),
                        exec: function(e) {
                            e.getSelection().selectRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotoright",
                        description: "Go to right",
                        bindKey: o("Right", "Right|Ctrl-F"),
                        exec: function(e, t) {
                            e.navigateRight(t.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectpagedown",
                        description: "Select page down",
                        bindKey: "Shift-PageDown",
                        exec: function(e) {
                            e.selectPageDown();
                        },
                        readOnly: true
                    },
                    {
                        name: "pagedown",
                        description: "Page down",
                        bindKey: o(null, "Option-PageDown"),
                        exec: function(e) {
                            e.scrollPageDown();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotopagedown",
                        description: "Go to page down",
                        bindKey: o("PageDown", "PageDown|Ctrl-V"),
                        exec: function(e) {
                            e.gotoPageDown();
                        },
                        readOnly: true
                    },
                    {
                        name: "selectpageup",
                        description: "Select page up",
                        bindKey: "Shift-PageUp",
                        exec: function(e) {
                            e.selectPageUp();
                        },
                        readOnly: true
                    },
                    {
                        name: "pageup",
                        description: "Page up",
                        bindKey: o(null, "Option-PageUp"),
                        exec: function(e) {
                            e.scrollPageUp();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotopageup",
                        description: "Go to page up",
                        bindKey: "PageUp",
                        exec: function(e) {
                            e.gotoPageUp();
                        },
                        readOnly: true
                    },
                    {
                        name: "scrollup",
                        description: "Scroll up",
                        bindKey: o("Ctrl-Up", null),
                        exec: function(e) {
                            e.renderer.scrollBy(0, -2 * e.renderer.layerConfig.lineHeight);
                        },
                        readOnly: true
                    },
                    {
                        name: "scrolldown",
                        description: "Scroll down",
                        bindKey: o("Ctrl-Down", null),
                        exec: function(e) {
                            e.renderer.scrollBy(0, 2 * e.renderer.layerConfig.lineHeight);
                        },
                        readOnly: true
                    },
                    {
                        name: "selectlinestart",
                        description: "Select line start",
                        bindKey: "Shift-Home",
                        exec: function(e) {
                            e.getSelection().selectLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectlineend",
                        description: "Select line end",
                        bindKey: "Shift-End",
                        exec: function(e) {
                            e.getSelection().selectLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "togglerecording",
                        description: "Toggle recording",
                        bindKey: o("Ctrl-Alt-E", "Command-Option-E"),
                        exec: function(e) {
                            e.commands.toggleRecording(e);
                        },
                        readOnly: true
                    },
                    {
                        name: "replaymacro",
                        description: "Replay macro",
                        bindKey: o("Ctrl-Shift-E", "Command-Shift-E"),
                        exec: function(e) {
                            e.commands.replay(e);
                        },
                        readOnly: true
                    },
                    {
                        name: "jumptomatching",
                        description: "Jump to matching",
                        bindKey: o("Ctrl-\\|Ctrl-P", "Command-\\"),
                        exec: function(e) {
                            e.jumpToMatching();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "selecttomatching",
                        description: "Select to matching",
                        bindKey: o("Ctrl-Shift-\\|Ctrl-Shift-P", "Command-Shift-\\"),
                        exec: function(e) {
                            e.jumpToMatching(true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "expandToMatching",
                        description: "Expand to matching",
                        bindKey: o("Ctrl-Shift-M", "Ctrl-Shift-M"),
                        exec: function(e) {
                            e.jumpToMatching(true, true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "passKeysToBrowser",
                        description: "Pass keys to browser",
                        bindKey: o(null, null),
                        exec: function() {},
                        passEvent: true,
                        readOnly: true
                    },
                    {
                        name: "copy",
                        description: "Copy",
                        exec: function(e) {},
                        readOnly: true
                    },
                    {
                        name: "cut",
                        description: "Cut",
                        exec: function(e) {
                            var t = e.$copyWithEmptySelection && e.selection.isEmpty();
                            var i = t ? e.selection.getLineRange() : e.selection.getRange();
                            e._emit("cut", i);
                            if (!i.isEmpty()) e.session.remove(i);
                            e.clearSelection();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "paste",
                        description: "Paste",
                        exec: function(e, t) {
                            e.$handlePaste(t);
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removeline",
                        description: "Remove line",
                        bindKey: o("Ctrl-D", "Command-D"),
                        exec: function(e) {
                            e.removeLines();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "duplicateSelection",
                        description: "Duplicate selection",
                        bindKey: o("Ctrl-Shift-D", "Command-Shift-D"),
                        exec: function(e) {
                            e.duplicateSelection();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "sortlines",
                        description: "Sort lines",
                        bindKey: o("Ctrl-Alt-S", "Command-Alt-S"),
                        exec: function(e) {
                            e.sortLines();
                        },
                        scrollIntoView: "selection",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "togglecomment",
                        description: "Toggle comment",
                        bindKey: o("Ctrl-/", "Command-/"),
                        exec: function(e) {
                            e.toggleCommentLines();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "toggleBlockComment",
                        description: "Toggle block comment",
                        bindKey: o("Ctrl-Shift-/", "Command-Shift-/"),
                        exec: function(e) {
                            e.toggleBlockComment();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "modifyNumberUp",
                        description: "Modify number up",
                        bindKey: o("Ctrl-Shift-Up", "Alt-Shift-Up"),
                        exec: function(e) {
                            e.modifyNumber(1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "modifyNumberDown",
                        description: "Modify number down",
                        bindKey: o("Ctrl-Shift-Down", "Alt-Shift-Down"),
                        exec: function(e) {
                            e.modifyNumber(-1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "replace",
                        description: "Replace",
                        bindKey: o("Ctrl-H", "Command-Option-F"),
                        exec: function(e) {
                            r.loadModule("ace/ext/searchbox", function(t) {
                                t.Search(e, true);
                            });
                        }
                    },
                    {
                        name: "undo",
                        description: "Undo",
                        bindKey: o("Ctrl-Z", "Command-Z"),
                        exec: function(e) {
                            e.undo();
                        }
                    },
                    {
                        name: "redo",
                        description: "Redo",
                        bindKey: o("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
                        exec: function(e) {
                            e.redo();
                        }
                    },
                    {
                        name: "copylinesup",
                        description: "Copy lines up",
                        bindKey: o("Alt-Shift-Up", "Command-Option-Up"),
                        exec: function(e) {
                            e.copyLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesup",
                        description: "Move lines up",
                        bindKey: o("Alt-Up", "Option-Up"),
                        exec: function(e) {
                            e.moveLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "copylinesdown",
                        description: "Copy lines down",
                        bindKey: o("Alt-Shift-Down", "Command-Option-Down"),
                        exec: function(e) {
                            e.copyLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesdown",
                        description: "Move lines down",
                        bindKey: o("Alt-Down", "Option-Down"),
                        exec: function(e) {
                            e.moveLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "del",
                        description: "Delete",
                        bindKey: o("Delete", "Delete|Ctrl-D|Shift-Delete"),
                        exec: function(e) {
                            e.remove("right");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "backspace",
                        description: "Backspace",
                        bindKey: o("Shift-Backspace|Backspace", "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"),
                        exec: function(e) {
                            e.remove("left");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "cut_or_delete",
                        description: "Cut or delete",
                        bindKey: o("Shift-Delete", null),
                        exec: function(e) {
                            if (e.selection.isEmpty()) {
                                e.remove("left");
                            } else {
                                return false;
                            }
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolinestart",
                        description: "Remove to line start",
                        bindKey: o("Alt-Backspace", "Command-Backspace"),
                        exec: function(e) {
                            e.removeToLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolineend",
                        description: "Remove to line end",
                        bindKey: o("Alt-Delete", "Ctrl-K|Command-Delete"),
                        exec: function(e) {
                            e.removeToLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolinestarthard",
                        description: "Remove to line start hard",
                        bindKey: o("Ctrl-Shift-Backspace", null),
                        exec: function(e) {
                            var t = e.selection.getRange();
                            t.start.column = 0;
                            e.session.remove(t);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolineendhard",
                        description: "Remove to line end hard",
                        bindKey: o("Ctrl-Shift-Delete", null),
                        exec: function(e) {
                            var t = e.selection.getRange();
                            t.end.column = Number.MAX_VALUE;
                            e.session.remove(t);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removewordleft",
                        description: "Remove word left",
                        bindKey: o("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
                        exec: function(e) {
                            e.removeWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removewordright",
                        description: "Remove word right",
                        bindKey: o("Ctrl-Delete", "Alt-Delete"),
                        exec: function(e) {
                            e.removeWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "outdent",
                        description: "Outdent",
                        bindKey: o("Shift-Tab", "Shift-Tab"),
                        exec: function(e) {
                            e.blockOutdent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "indent",
                        description: "Indent",
                        bindKey: o("Tab", "Tab"),
                        exec: function(e) {
                            e.indent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockoutdent",
                        description: "Block outdent",
                        bindKey: o("Ctrl-[", "Ctrl-["),
                        exec: function(e) {
                            e.blockOutdent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockindent",
                        description: "Block indent",
                        bindKey: o("Ctrl-]", "Ctrl-]"),
                        exec: function(e) {
                            e.blockIndent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "insertstring",
                        description: "Insert string",
                        exec: function(e, t) {
                            e.insert(t);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "inserttext",
                        description: "Insert text",
                        exec: function(e, t) {
                            e.insert(n.stringRepeat(t.text || "", t.times || 1));
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "splitline",
                        description: "Split line",
                        bindKey: o(null, "Ctrl-O"),
                        exec: function(e) {
                            e.splitLine();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "transposeletters",
                        description: "Transpose letters",
                        bindKey: o("Alt-Shift-X", "Ctrl-T"),
                        exec: function(e) {
                            e.transposeLetters();
                        },
                        multiSelectAction: function(e) {
                            e.transposeSelections(1);
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "touppercase",
                        description: "To uppercase",
                        bindKey: o("Ctrl-U", "Ctrl-U"),
                        exec: function(e) {
                            e.toUpperCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "tolowercase",
                        description: "To lowercase",
                        bindKey: o("Ctrl-Shift-U", "Ctrl-Shift-U"),
                        exec: function(e) {
                            e.toLowerCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "autoindent",
                        description: "Auto Indent",
                        bindKey: o(null, null),
                        exec: function(e) {
                            e.autoIndent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "animate"
                    },
                    {
                        name: "expandtoline",
                        description: "Expand to line",
                        bindKey: o("Ctrl-Shift-L", "Command-Shift-L"),
                        exec: function(e) {
                            var t = e.selection.getRange();
                            t.start.column = t.end.column = 0;
                            t.end.row++;
                            e.selection.setRange(t, false);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "joinlines",
                        description: "Join lines",
                        bindKey: o(null, null),
                        exec: function(e) {
                            var t = e.selection.isBackwards();
                            var i = t ? e.selection.getSelectionLead() : e.selection.getSelectionAnchor();
                            var r = t ? e.selection.getSelectionAnchor() : e.selection.getSelectionLead();
                            var o = e.session.doc.getLine(i.row).length;
                            var a = e.session.doc.getTextRange(e.selection.getRange());
                            var l = a.replace(/\n\s*/, " ").length;
                            var h = e.session.doc.getLine(i.row);
                            for(var c = i.row + 1; c <= r.row + 1; c++){
                                var u = n.stringTrimLeft(n.stringTrimRight(e.session.doc.getLine(c)));
                                if (u.length !== 0) {
                                    u = " " + u;
                                }
                                h += u;
                            }
                            if (r.row + 1 < e.session.doc.getLength() - 1) {
                                h += e.session.doc.getNewLineCharacter();
                            }
                            e.clearSelection();
                            e.session.doc.replace(new s(i.row, 0, r.row + 2, 0), h);
                            if (l > 0) {
                                e.selection.moveCursorTo(i.row, i.column);
                                e.selection.selectTo(i.row, i.column + l);
                            } else {
                                o = e.session.doc.getLine(i.row).length > o ? o + 1 : o;
                                e.selection.moveCursorTo(i.row, o);
                            }
                        },
                        multiSelectAction: "forEach",
                        readOnly: true
                    },
                    {
                        name: "invertSelection",
                        description: "Invert selection",
                        bindKey: o(null, null),
                        exec: function(e) {
                            var t = e.session.doc.getLength() - 1;
                            var i = e.session.doc.getLine(t).length;
                            var n = e.selection.rangeList.ranges;
                            var r = [];
                            if (n.length < 1) {
                                n = [
                                    e.selection.getRange()
                                ];
                            }
                            for(var o = 0; o < n.length; o++){
                                if (o == n.length - 1) {
                                    if (!(n[o].end.row === t && n[o].end.column === i)) {
                                        r.push(new s(n[o].end.row, n[o].end.column, t, i));
                                    }
                                }
                                if (o === 0) {
                                    if (!(n[o].start.row === 0 && n[o].start.column === 0)) {
                                        r.push(new s(0, 0, n[o].start.row, n[o].start.column));
                                    }
                                } else {
                                    r.push(new s(n[o - 1].end.row, n[o - 1].end.column, n[o].start.row, n[o].start.column));
                                }
                            }
                            e.exitMultiSelectMode();
                            e.clearSelection();
                            for(var o = 0; o < r.length; o++){
                                e.selection.addRange(r[o], false);
                            }
                        },
                        readOnly: true,
                        scrollIntoView: "none"
                    },
                    {
                        name: "addLineAfter",
                        description: "Add new line after the current line",
                        exec: function(e) {
                            e.selection.clearSelection();
                            e.navigateLineEnd();
                            e.insert("\n");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "addLineBefore",
                        description: "Add new line before the current line",
                        exec: function(e) {
                            e.selection.clearSelection();
                            var t = e.getCursorPosition();
                            e.selection.moveTo(t.row - 1, Number.MAX_VALUE);
                            e.insert("\n");
                            if (t.row === 0) e.navigateUp();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "openCommandPallete",
                        description: "Open command pallete",
                        bindKey: o("F1", "F1"),
                        exec: function(e) {
                            e.prompt({
                                $type: "commands"
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "modeSelect",
                        description: "Change language mode...",
                        bindKey: o(null, null),
                        exec: function(e) {
                            e.prompt({
                                $type: "modes"
                            });
                        },
                        readOnly: true
                    }, 
                ];
                for(var a = 1; a < 9; a++){
                    t.commands.push({
                        name: "foldToLevel" + a,
                        description: "Fold To Level " + a,
                        level: a,
                        exec: function(e) {
                            e.session.foldToLevel(this.level);
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    });
                }
            });
            ace.define("ace/editor", [
                "require",
                "exports",
                "module",
                "ace/lib/fixoldbrowsers",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/lang",
                "ace/lib/useragent",
                "ace/keyboard/textinput",
                "ace/mouse/mouse_handler",
                "ace/mouse/fold_handler",
                "ace/keyboard/keybinding",
                "ace/edit_session",
                "ace/search",
                "ace/range",
                "ace/lib/event_emitter",
                "ace/commands/command_manager",
                "ace/commands/default_commands",
                "ace/config",
                "ace/token_iterator",
                "ace/clipboard", 
            ], function(e, t, i) {
                "use strict";
                e("./lib/fixoldbrowsers");
                var n = e("./lib/oop");
                var r = e("./lib/dom");
                var s = e("./lib/lang");
                var o = e("./lib/useragent");
                var a = e("./keyboard/textinput").TextInput;
                var l = e("./mouse/mouse_handler").MouseHandler;
                var h = e("./mouse/fold_handler").FoldHandler;
                var c = e("./keyboard/keybinding").KeyBinding;
                var u = e("./edit_session").EditSession;
                var d = e("./search").Search;
                var f = e("./range").Range;
                var g = e("./lib/event_emitter").EventEmitter;
                var m = e("./commands/command_manager").CommandManager;
                var v = e("./commands/default_commands").commands;
                var p = e("./config");
                var w = e("./token_iterator").TokenIterator;
                var $ = e("./clipboard");
                var b = function(e, t, i) {
                    this.$toDestroy = [];
                    var n = e.getContainerElement();
                    this.container = n;
                    this.renderer = e;
                    this.id = "editor" + ++b.$uid;
                    this.commands = new m(o.isMac ? "mac" : "win", v);
                    if (typeof document == "object") {
                        this.textInput = new a(e.getTextAreaContainer(), this);
                        this.renderer.textarea = this.textInput.getElement();
                        this.$mouseHandler = new l(this);
                        new h(this);
                    }
                    this.keyBinding = new c(this);
                    this.$search = new d().set({
                        wrap: true
                    });
                    this.$historyTracker = this.$historyTracker.bind(this);
                    this.commands.on("exec", this.$historyTracker);
                    this.$initOperationListeners();
                    this._$emitInputEvent = s.delayedCall(function() {
                        this._signal("input", {});
                        if (this.session && this.session.bgTokenizer) this.session.bgTokenizer.scheduleStart();
                    }.bind(this));
                    this.on("change", function(e, t) {
                        t._$emitInputEvent.schedule(31);
                    });
                    this.setSession(t || (i && i.session) || new u(""));
                    p.resetOptions(this);
                    if (i) this.setOptions(i);
                    p._signal("editor", this);
                };
                b.$uid = 0;
                (function() {
                    n.implement(this, g);
                    this.$initOperationListeners = function() {
                        this.commands.on("exec", this.startOperation.bind(this), true);
                        this.commands.on("afterExec", this.endOperation.bind(this), true);
                        this.$opResetTimer = s.delayedCall(this.endOperation.bind(this, true));
                        this.on("change", function() {
                            if (!this.curOp) {
                                this.startOperation();
                                this.curOp.selectionBefore = this.$lastSel;
                            }
                            this.curOp.docChanged = true;
                        }.bind(this), true);
                        this.on("changeSelection", function() {
                            if (!this.curOp) {
                                this.startOperation();
                                this.curOp.selectionBefore = this.$lastSel;
                            }
                            this.curOp.selectionChanged = true;
                        }.bind(this), true);
                    };
                    this.curOp = null;
                    this.prevOp = {};
                    this.startOperation = function(e) {
                        if (this.curOp) {
                            if (!e || this.curOp.command) return;
                            this.prevOp = this.curOp;
                        }
                        if (!e) {
                            this.previousCommand = null;
                            e = {};
                        }
                        this.$opResetTimer.schedule();
                        this.curOp = this.session.curOp = {
                            command: e.command || {},
                            args: e.args,
                            scrollTop: this.renderer.scrollTop
                        };
                        this.curOp.selectionBefore = this.selection.toJSON();
                    };
                    this.endOperation = function(e) {
                        if (this.curOp && this.session) {
                            if ((e && e.returnValue === false) || !this.session) return (this.curOp = null);
                            if (e == true && this.curOp.command && this.curOp.command.name == "mouse") return;
                            this._signal("beforeEndOperation");
                            if (!this.curOp) return;
                            var t = this.curOp.command;
                            var i = t && t.scrollIntoView;
                            if (i) {
                                switch(i){
                                    case "center-animate":
                                        i = "animate";
                                    case "center":
                                        this.renderer.scrollCursorIntoView(null, 0.5);
                                        break;
                                    case "animate":
                                    case "cursor":
                                        this.renderer.scrollCursorIntoView();
                                        break;
                                    case "selectionPart":
                                        var n = this.selection.getRange();
                                        var r = this.renderer.layerConfig;
                                        if (n.start.row >= r.lastRow || n.end.row <= r.firstRow) {
                                            this.renderer.scrollSelectionIntoView(this.selection.anchor, this.selection.lead);
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                if (i == "animate") this.renderer.animateScrolling(this.curOp.scrollTop);
                            }
                            var s = this.selection.toJSON();
                            this.curOp.selectionAfter = s;
                            this.$lastSel = this.selection.toJSON();
                            this.session.getUndoManager().addSelection(s);
                            this.prevOp = this.curOp;
                            this.curOp = null;
                        }
                    };
                    this.$mergeableCommands = [
                        "backspace",
                        "del",
                        "insertstring", 
                    ];
                    this.$historyTracker = function(e) {
                        if (!this.$mergeUndoDeltas) return;
                        var t = this.prevOp;
                        var i = this.$mergeableCommands;
                        var n = t.command && e.command.name == t.command.name;
                        if (e.command.name == "insertstring") {
                            var r = e.args;
                            if (this.mergeNextCommand === undefined) this.mergeNextCommand = true;
                            n = n && this.mergeNextCommand && (!/\s/.test(r) || /\s/.test(t.args));
                            this.mergeNextCommand = true;
                        } else {
                            n = n && i.indexOf(e.command.name) !== -1;
                        }
                        if (this.$mergeUndoDeltas != "always" && Date.now() - this.sequenceStartTime > 2000) {
                            n = false;
                        }
                        if (n) this.session.mergeUndoDeltas = true;
                        else if (i.indexOf(e.command.name) !== -1) this.sequenceStartTime = Date.now();
                    };
                    this.setKeyboardHandler = function(e, t) {
                        if (e && typeof e === "string" && e != "ace") {
                            this.$keybindingId = e;
                            var i = this;
                            p.loadModule([
                                "keybinding",
                                e
                            ], function(n) {
                                if (i.$keybindingId == e) i.keyBinding.setKeyboardHandler(n && n.handler);
                                t && t();
                            });
                        } else {
                            this.$keybindingId = null;
                            this.keyBinding.setKeyboardHandler(e);
                            t && t();
                        }
                    };
                    this.getKeyboardHandler = function() {
                        return this.keyBinding.getKeyboardHandler();
                    };
                    this.setSession = function(e) {
                        if (this.session == e) return;
                        if (this.curOp) this.endOperation();
                        this.curOp = {};
                        var t = this.session;
                        if (t) {
                            this.session.off("change", this.$onDocumentChange);
                            this.session.off("changeMode", this.$onChangeMode);
                            this.session.off("tokenizerUpdate", this.$onTokenizerUpdate);
                            this.session.off("changeTabSize", this.$onChangeTabSize);
                            this.session.off("changeWrapLimit", this.$onChangeWrapLimit);
                            this.session.off("changeWrapMode", this.$onChangeWrapMode);
                            this.session.off("changeFold", this.$onChangeFold);
                            this.session.off("changeFrontMarker", this.$onChangeFrontMarker);
                            this.session.off("changeBackMarker", this.$onChangeBackMarker);
                            this.session.off("changeBreakpoint", this.$onChangeBreakpoint);
                            this.session.off("changeAnnotation", this.$onChangeAnnotation);
                            this.session.off("changeOverwrite", this.$onCursorChange);
                            this.session.off("changeScrollTop", this.$onScrollTopChange);
                            this.session.off("changeScrollLeft", this.$onScrollLeftChange);
                            var i = this.session.getSelection();
                            i.off("changeCursor", this.$onCursorChange);
                            i.off("changeSelection", this.$onSelectionChange);
                        }
                        this.session = e;
                        if (e) {
                            this.$onDocumentChange = this.onDocumentChange.bind(this);
                            e.on("change", this.$onDocumentChange);
                            this.renderer.setSession(e);
                            this.$onChangeMode = this.onChangeMode.bind(this);
                            e.on("changeMode", this.$onChangeMode);
                            this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
                            e.on("tokenizerUpdate", this.$onTokenizerUpdate);
                            this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
                            e.on("changeTabSize", this.$onChangeTabSize);
                            this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
                            e.on("changeWrapLimit", this.$onChangeWrapLimit);
                            this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
                            e.on("changeWrapMode", this.$onChangeWrapMode);
                            this.$onChangeFold = this.onChangeFold.bind(this);
                            e.on("changeFold", this.$onChangeFold);
                            this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
                            this.session.on("changeFrontMarker", this.$onChangeFrontMarker);
                            this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
                            this.session.on("changeBackMarker", this.$onChangeBackMarker);
                            this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
                            this.session.on("changeBreakpoint", this.$onChangeBreakpoint);
                            this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
                            this.session.on("changeAnnotation", this.$onChangeAnnotation);
                            this.$onCursorChange = this.onCursorChange.bind(this);
                            this.session.on("changeOverwrite", this.$onCursorChange);
                            this.$onScrollTopChange = this.onScrollTopChange.bind(this);
                            this.session.on("changeScrollTop", this.$onScrollTopChange);
                            this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
                            this.session.on("changeScrollLeft", this.$onScrollLeftChange);
                            this.selection = e.getSelection();
                            this.selection.on("changeCursor", this.$onCursorChange);
                            this.$onSelectionChange = this.onSelectionChange.bind(this);
                            this.selection.on("changeSelection", this.$onSelectionChange);
                            this.onChangeMode();
                            this.onCursorChange();
                            this.onScrollTopChange();
                            this.onScrollLeftChange();
                            this.onSelectionChange();
                            this.onChangeFrontMarker();
                            this.onChangeBackMarker();
                            this.onChangeBreakpoint();
                            this.onChangeAnnotation();
                            this.session.getUseWrapMode() && this.renderer.adjustWrapLimit();
                            this.renderer.updateFull();
                        } else {
                            this.selection = null;
                            this.renderer.setSession(e);
                        }
                        this._signal("changeSession", {
                            session: e,
                            oldSession: t
                        });
                        this.curOp = null;
                        t && t._signal("changeEditor", {
                            oldEditor: this
                        });
                        e && e._signal("changeEditor", {
                            editor: this
                        });
                        if (e && e.bgTokenizer) e.bgTokenizer.scheduleStart();
                    };
                    this.getSession = function() {
                        return this.session;
                    };
                    this.setValue = function(e, t) {
                        this.session.doc.setValue(e);
                        if (!t) this.selectAll();
                        else if (t == 1) this.navigateFileEnd();
                        else if (t == -1) this.navigateFileStart();
                        return e;
                    };
                    this.getValue = function() {
                        return this.session.getValue();
                    };
                    this.getSelection = function() {
                        return this.selection;
                    };
                    this.resize = function(e) {
                        this.renderer.onResize(e);
                    };
                    this.setTheme = function(e, t) {
                        this.renderer.setTheme(e, t);
                    };
                    this.getTheme = function() {
                        return this.renderer.getTheme();
                    };
                    this.setStyle = function(e) {
                        this.renderer.setStyle(e);
                    };
                    this.unsetStyle = function(e) {
                        this.renderer.unsetStyle(e);
                    };
                    this.getFontSize = function() {
                        return (this.getOption("fontSize") || r.computedStyle(this.container).fontSize);
                    };
                    this.setFontSize = function(e) {
                        this.setOption("fontSize", e);
                    };
                    this.$highlightBrackets = function() {
                        if (this.$highlightPending) {
                            return;
                        }
                        var e = this;
                        this.$highlightPending = true;
                        setTimeout(function() {
                            e.$highlightPending = false;
                            var t = e.session;
                            if (!t || !t.bgTokenizer) return;
                            if (t.$bracketHighlight) {
                                t.$bracketHighlight.markerIds.forEach(function(e) {
                                    t.removeMarker(e);
                                });
                                t.$bracketHighlight = null;
                            }
                            var i = t.getMatchingBracketRanges(e.getCursorPosition());
                            if (!i && t.$mode.getMatching) i = t.$mode.getMatching(e.session);
                            if (!i) return;
                            var n = "ace_bracket";
                            if (!Array.isArray(i)) {
                                i = [
                                    i
                                ];
                            } else if (i.length == 1) {
                                n = "ace_error_bracket";
                            }
                            if (i.length == 2) {
                                if (f.comparePoints(i[0].end, i[1].start) == 0) i = [
                                    f.fromPoints(i[0].start, i[1].end), 
                                ];
                                else if (f.comparePoints(i[0].start, i[1].end) == 0) i = [
                                    f.fromPoints(i[1].start, i[0].end), 
                                ];
                            }
                            t.$bracketHighlight = {
                                ranges: i,
                                markerIds: i.map(function(e) {
                                    return t.addMarker(e, n, "text");
                                })
                            };
                        }, 50);
                    };
                    this.$highlightTags = function() {
                        if (this.$highlightTagPending) return;
                        var e = this;
                        this.$highlightTagPending = true;
                        setTimeout(function() {
                            e.$highlightTagPending = false;
                            var t = e.session;
                            if (!t || !t.bgTokenizer) return;
                            var i = e.getCursorPosition();
                            var n = new w(e.session, i.row, i.column);
                            var r = n.getCurrentToken();
                            if (!r || !/\b(?:tag-open|tag-name)/.test(r.type)) {
                                t.removeMarker(t.$tagHighlight);
                                t.$tagHighlight = null;
                                return;
                            }
                            if (r.type.indexOf("tag-open") !== -1) {
                                r = n.stepForward();
                                if (!r) return;
                            }
                            var s = r.value;
                            var o = r.value;
                            var a = 0;
                            var l = n.stepBackward();
                            if (l.value === "<") {
                                do {
                                    l = r;
                                    r = n.stepForward();
                                    if (r) {
                                        if (r.type.indexOf("tag-name") !== -1) {
                                            o = r.value;
                                            if (s === o) {
                                                if (l.value === "<") {
                                                    a++;
                                                } else if (l.value === "</") {
                                                    a--;
                                                }
                                            }
                                        } else if (s === o && r.value === "/>") {
                                            a--;
                                        }
                                    }
                                }while (r && a >= 0)
                            } else {
                                do {
                                    r = l;
                                    l = n.stepBackward();
                                    if (r) {
                                        if (r.type.indexOf("tag-name") !== -1) {
                                            if (s === r.value) {
                                                if (l.value === "<") {
                                                    a++;
                                                } else if (l.value === "</") {
                                                    a--;
                                                }
                                            }
                                        } else if (r.value === "/>") {
                                            var h = 0;
                                            var c = l;
                                            while(c){
                                                if (c.type.indexOf("tag-name") !== -1 && c.value === s) {
                                                    a--;
                                                    break;
                                                } else if (c.value === "<") {
                                                    break;
                                                }
                                                c = n.stepBackward();
                                                h++;
                                            }
                                            for(var u = 0; u < h; u++){
                                                n.stepForward();
                                            }
                                        }
                                    }
                                }while (l && a <= 0)
                                n.stepForward();
                            }
                            if (!r) {
                                t.removeMarker(t.$tagHighlight);
                                t.$tagHighlight = null;
                                return;
                            }
                            var d = n.getCurrentTokenRow();
                            var g = n.getCurrentTokenColumn();
                            var m = new f(d, g, d, g + r.value.length);
                            var v = t.$backMarkers[t.$tagHighlight];
                            if (t.$tagHighlight && v != undefined && m.compareRange(v.range) !== 0) {
                                t.removeMarker(t.$tagHighlight);
                                t.$tagHighlight = null;
                            }
                            if (!t.$tagHighlight) t.$tagHighlight = t.addMarker(m, "ace_bracket", "text");
                        }, 50);
                    };
                    this.focus = function() {
                        var e = this;
                        setTimeout(function() {
                            if (!e.isFocused()) e.textInput.focus();
                        });
                        this.textInput.focus();
                    };
                    this.isFocused = function() {
                        return this.textInput.isFocused();
                    };
                    this.blur = function() {
                        this.textInput.blur();
                    };
                    this.onFocus = function(e) {
                        if (this.$isFocused) return;
                        this.$isFocused = true;
                        this.renderer.showCursor();
                        this.renderer.visualizeFocus();
                        this._emit("focus", e);
                    };
                    this.onBlur = function(e) {
                        if (!this.$isFocused) return;
                        this.$isFocused = false;
                        this.renderer.hideCursor();
                        this.renderer.visualizeBlur();
                        this._emit("blur", e);
                    };
                    this.$cursorChange = function() {
                        this.renderer.updateCursor();
                        this.$highlightBrackets();
                        this.$highlightTags();
                        this.$updateHighlightActiveLine();
                    };
                    this.onDocumentChange = function(e) {
                        var t = this.session.$useWrapMode;
                        var i = e.start.row == e.end.row ? e.end.row : Infinity;
                        this.renderer.updateLines(e.start.row, i, t);
                        this._signal("change", e);
                        this.$cursorChange();
                    };
                    this.onTokenizerUpdate = function(e) {
                        var t = e.data;
                        this.renderer.updateLines(t.first, t.last);
                    };
                    this.onScrollTopChange = function() {
                        this.renderer.scrollToY(this.session.getScrollTop());
                    };
                    this.onScrollLeftChange = function() {
                        this.renderer.scrollToX(this.session.getScrollLeft());
                    };
                    this.onCursorChange = function() {
                        this.$cursorChange();
                        this._signal("changeSelection");
                    };
                    this.$updateHighlightActiveLine = function() {
                        var e = this.getSession();
                        var t;
                        if (this.$highlightActiveLine) {
                            if (this.$selectionStyle != "line" || !this.selection.isMultiLine()) t = this.getCursorPosition();
                            if (this.renderer.theme && this.renderer.theme.$selectionColorConflict && !this.selection.isEmpty()) t = false;
                            if (this.renderer.$maxLines && this.session.getLength() === 1 && !(this.renderer.$minLines > 1)) t = false;
                        }
                        if (e.$highlightLineMarker && !t) {
                            e.removeMarker(e.$highlightLineMarker.id);
                            e.$highlightLineMarker = null;
                        } else if (!e.$highlightLineMarker && t) {
                            var i = new f(t.row, t.column, t.row, Infinity);
                            i.id = e.addMarker(i, "ace_active-line", "screenLine");
                            e.$highlightLineMarker = i;
                        } else if (t) {
                            e.$highlightLineMarker.start.row = t.row;
                            e.$highlightLineMarker.end.row = t.row;
                            e.$highlightLineMarker.start.column = t.column;
                            e._signal("changeBackMarker");
                        }
                    };
                    this.onSelectionChange = function(e) {
                        var t = this.session;
                        if (t.$selectionMarker) {
                            t.removeMarker(t.$selectionMarker);
                        }
                        t.$selectionMarker = null;
                        if (!this.selection.isEmpty()) {
                            var i = this.selection.getRange();
                            var n = this.getSelectionStyle();
                            t.$selectionMarker = t.addMarker(i, "ace_selection", n);
                        } else {
                            this.$updateHighlightActiveLine();
                        }
                        var r = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
                        this.session.highlight(r);
                        this._signal("changeSelection");
                    };
                    this.$getSelectionHighLightRegexp = function() {
                        var e = this.session;
                        var t = this.getSelectionRange();
                        if (t.isEmpty() || t.isMultiLine()) return;
                        var i = t.start.column;
                        var n = t.end.column;
                        var r = e.getLine(t.start.row);
                        var s = r.substring(i, n);
                        if (s.length > 5000 || !/[\w\d]/.test(s)) return;
                        var o = this.$search.$assembleRegExp({
                            wholeWord: true,
                            caseSensitive: true,
                            needle: s
                        });
                        var a = r.substring(i - 1, n + 1);
                        if (!o.test(a)) return;
                        return o;
                    };
                    this.onChangeFrontMarker = function() {
                        this.renderer.updateFrontMarkers();
                    };
                    this.onChangeBackMarker = function() {
                        this.renderer.updateBackMarkers();
                    };
                    this.onChangeBreakpoint = function() {
                        this.renderer.updateBreakpoints();
                    };
                    this.onChangeAnnotation = function() {
                        this.renderer.setAnnotations(this.session.getAnnotations());
                    };
                    this.onChangeMode = function(e) {
                        this.renderer.updateText();
                        this._emit("changeMode", e);
                    };
                    this.onChangeWrapLimit = function() {
                        this.renderer.updateFull();
                    };
                    this.onChangeWrapMode = function() {
                        this.renderer.onResize(true);
                    };
                    this.onChangeFold = function() {
                        this.$updateHighlightActiveLine();
                        this.renderer.updateFull();
                    };
                    this.getSelectedText = function() {
                        return this.session.getTextRange(this.getSelectionRange());
                    };
                    this.getCopyText = function() {
                        var e = this.getSelectedText();
                        var t = this.session.doc.getNewLineCharacter();
                        var i = false;
                        if (!e && this.$copyWithEmptySelection) {
                            i = true;
                            var n = this.selection.getAllRanges();
                            for(var r = 0; r < n.length; r++){
                                var s = n[r];
                                if (r && n[r - 1].start.row == s.start.row) continue;
                                e += this.session.getLine(s.start.row) + t;
                            }
                        }
                        var o = {
                            text: e
                        };
                        this._signal("copy", o);
                        $.lineMode = i ? o.text : false;
                        return o.text;
                    };
                    this.onCopy = function() {
                        this.commands.exec("copy", this);
                    };
                    this.onCut = function() {
                        this.commands.exec("cut", this);
                    };
                    this.onPaste = function(e, t) {
                        var i = {
                            text: e,
                            event: t
                        };
                        this.commands.exec("paste", this, i);
                    };
                    this.$handlePaste = function(e) {
                        if (typeof e == "string") e = {
                            text: e
                        };
                        this._signal("paste", e);
                        var t = e.text;
                        var i = t === $.lineMode;
                        var n = this.session;
                        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) {
                            if (i) n.insert({
                                row: this.selection.lead.row,
                                column: 0
                            }, t);
                            else this.insert(t);
                        } else if (i) {
                            this.selection.rangeList.ranges.forEach(function(e) {
                                n.insert({
                                    row: e.start.row,
                                    column: 0
                                }, t);
                            });
                        } else {
                            var r = t.split(/\r\n|\r|\n/);
                            var s = this.selection.rangeList.ranges;
                            var o = r.length == 2 && (!r[0] || !r[1]);
                            if (r.length != s.length || o) return this.commands.exec("insertstring", this, t);
                            for(var a = s.length; a--;){
                                var l = s[a];
                                if (!l.isEmpty()) n.remove(l);
                                n.insert(l.start, r[a]);
                            }
                        }
                    };
                    this.execCommand = function(e, t) {
                        return this.commands.exec(e, this, t);
                    };
                    this.insert = function(e, t) {
                        var i = this.session;
                        var n = i.getMode();
                        var r = this.getCursorPosition();
                        if (this.getBehavioursEnabled() && !t) {
                            var s = n.transformAction(i.getState(r.row), "insertion", this, i, e);
                            if (s) {
                                if (e !== s.text) {
                                    if (!this.inVirtualSelectionMode) {
                                        this.session.mergeUndoDeltas = false;
                                        this.mergeNextCommand = false;
                                    }
                                }
                                e = s.text;
                            }
                        }
                        if (e == "\t") e = this.session.getTabString();
                        if (!this.selection.isEmpty()) {
                            var o = this.getSelectionRange();
                            r = this.session.remove(o);
                            this.clearSelection();
                        } else if (this.session.getOverwrite() && e.indexOf("\n") == -1) {
                            var o = new f.fromPoints(r, r);
                            o.end.column += e.length;
                            this.session.remove(o);
                        }
                        if (e == "\n" || e == "\r\n") {
                            var a = i.getLine(r.row);
                            if (r.column > a.search(/\S|$/)) {
                                var l = a.substr(r.column).search(/\S|$/);
                                i.doc.removeInLine(r.row, r.column, r.column + l);
                            }
                        }
                        this.clearSelection();
                        var h = r.column;
                        var c = i.getState(r.row);
                        var a = i.getLine(r.row);
                        var u = n.checkOutdent(c, a, e);
                        i.insert(r, e);
                        if (s && s.selection) {
                            if (s.selection.length == 2) {
                                this.selection.setSelectionRange(new f(r.row, h + s.selection[0], r.row, h + s.selection[1]));
                            } else {
                                this.selection.setSelectionRange(new f(r.row + s.selection[0], s.selection[1], r.row + s.selection[2], s.selection[3]));
                            }
                        }
                        if (this.$enableAutoIndent) {
                            if (i.getDocument().isNewLine(e)) {
                                var d = n.getNextLineIndent(c, a.slice(0, r.column), i.getTabString());
                                i.insert({
                                    row: r.row + 1,
                                    column: 0
                                }, d);
                            }
                            if (u) n.autoOutdent(c, i, r.row);
                        }
                    };
                    this.autoIndent = function() {
                        var e = this.session;
                        var t = e.getMode();
                        var i, n;
                        if (this.selection.isEmpty()) {
                            i = 0;
                            n = e.doc.getLength() - 1;
                        } else {
                            var r = this.getSelectionRange();
                            i = r.start.row;
                            n = r.end.row;
                        }
                        var s = "";
                        var o = "";
                        var a = "";
                        var l, h, c;
                        var u = e.getTabString();
                        for(var d = i; d <= n; d++){
                            if (d > 0) {
                                s = e.getState(d - 1);
                                o = e.getLine(d - 1);
                                a = t.getNextLineIndent(s, o, u);
                            }
                            l = e.getLine(d);
                            h = t.$getIndent(l);
                            if (a !== h) {
                                if (h.length > 0) {
                                    c = new f(d, 0, d, h.length);
                                    e.remove(c);
                                }
                                if (a.length > 0) {
                                    e.insert({
                                        row: d,
                                        column: 0
                                    }, a);
                                }
                            }
                            t.autoOutdent(s, e, d);
                        }
                    };
                    this.onTextInput = function(e, t) {
                        if (!t) return this.keyBinding.onTextInput(e);
                        this.startOperation({
                            command: {
                                name: "insertstring"
                            }
                        });
                        var i = this.applyComposition.bind(this, e, t);
                        if (this.selection.rangeCount) this.forEachSelection(i);
                        else i();
                        this.endOperation();
                    };
                    this.applyComposition = function(e, t) {
                        if (t.extendLeft || t.extendRight) {
                            var i = this.selection.getRange();
                            i.start.column -= t.extendLeft;
                            i.end.column += t.extendRight;
                            if (i.start.column < 0) {
                                i.start.row--;
                                i.start.column += this.session.getLine(i.start.row).length + 1;
                            }
                            this.selection.setRange(i);
                            if (!e && !i.isEmpty()) this.remove();
                        }
                        if (e || !this.selection.isEmpty()) this.insert(e, true);
                        if (t.restoreStart || t.restoreEnd) {
                            var i = this.selection.getRange();
                            i.start.column -= t.restoreStart;
                            i.end.column -= t.restoreEnd;
                            this.selection.setRange(i);
                        }
                    };
                    this.onCommandKey = function(e, t, i) {
                        return this.keyBinding.onCommandKey(e, t, i);
                    };
                    this.setOverwrite = function(e) {
                        this.session.setOverwrite(e);
                    };
                    this.getOverwrite = function() {
                        return this.session.getOverwrite();
                    };
                    this.toggleOverwrite = function() {
                        this.session.toggleOverwrite();
                    };
                    this.setScrollSpeed = function(e) {
                        this.setOption("scrollSpeed", e);
                    };
                    this.getScrollSpeed = function() {
                        return this.getOption("scrollSpeed");
                    };
                    this.setDragDelay = function(e) {
                        this.setOption("dragDelay", e);
                    };
                    this.getDragDelay = function() {
                        return this.getOption("dragDelay");
                    };
                    this.setSelectionStyle = function(e) {
                        this.setOption("selectionStyle", e);
                    };
                    this.getSelectionStyle = function() {
                        return this.getOption("selectionStyle");
                    };
                    this.setHighlightActiveLine = function(e) {
                        this.setOption("highlightActiveLine", e);
                    };
                    this.getHighlightActiveLine = function() {
                        return this.getOption("highlightActiveLine");
                    };
                    this.setHighlightGutterLine = function(e) {
                        this.setOption("highlightGutterLine", e);
                    };
                    this.getHighlightGutterLine = function() {
                        return this.getOption("highlightGutterLine");
                    };
                    this.setHighlightSelectedWord = function(e) {
                        this.setOption("highlightSelectedWord", e);
                    };
                    this.getHighlightSelectedWord = function() {
                        return this.$highlightSelectedWord;
                    };
                    this.setAnimatedScroll = function(e) {
                        this.renderer.setAnimatedScroll(e);
                    };
                    this.getAnimatedScroll = function() {
                        return this.renderer.getAnimatedScroll();
                    };
                    this.setShowInvisibles = function(e) {
                        this.renderer.setShowInvisibles(e);
                    };
                    this.getShowInvisibles = function() {
                        return this.renderer.getShowInvisibles();
                    };
                    this.setDisplayIndentGuides = function(e) {
                        this.renderer.setDisplayIndentGuides(e);
                    };
                    this.getDisplayIndentGuides = function() {
                        return this.renderer.getDisplayIndentGuides();
                    };
                    this.setShowPrintMargin = function(e) {
                        this.renderer.setShowPrintMargin(e);
                    };
                    this.getShowPrintMargin = function() {
                        return this.renderer.getShowPrintMargin();
                    };
                    this.setPrintMarginColumn = function(e) {
                        this.renderer.setPrintMarginColumn(e);
                    };
                    this.getPrintMarginColumn = function() {
                        return this.renderer.getPrintMarginColumn();
                    };
                    this.setReadOnly = function(e) {
                        this.setOption("readOnly", e);
                    };
                    this.getReadOnly = function() {
                        return this.getOption("readOnly");
                    };
                    this.setBehavioursEnabled = function(e) {
                        this.setOption("behavioursEnabled", e);
                    };
                    this.getBehavioursEnabled = function() {
                        return this.getOption("behavioursEnabled");
                    };
                    this.setWrapBehavioursEnabled = function(e) {
                        this.setOption("wrapBehavioursEnabled", e);
                    };
                    this.getWrapBehavioursEnabled = function() {
                        return this.getOption("wrapBehavioursEnabled");
                    };
                    this.setShowFoldWidgets = function(e) {
                        this.setOption("showFoldWidgets", e);
                    };
                    this.getShowFoldWidgets = function() {
                        return this.getOption("showFoldWidgets");
                    };
                    this.setFadeFoldWidgets = function(e) {
                        this.setOption("fadeFoldWidgets", e);
                    };
                    this.getFadeFoldWidgets = function() {
                        return this.getOption("fadeFoldWidgets");
                    };
                    this.remove = function(e) {
                        if (this.selection.isEmpty()) {
                            if (e == "left") this.selection.selectLeft();
                            else this.selection.selectRight();
                        }
                        var t = this.getSelectionRange();
                        if (this.getBehavioursEnabled()) {
                            var i = this.session;
                            var n = i.getState(t.start.row);
                            var r = i.getMode().transformAction(n, "deletion", this, i, t);
                            if (t.end.column === 0) {
                                var s = i.getTextRange(t);
                                if (s[s.length - 1] == "\n") {
                                    var o = i.getLine(t.end.row);
                                    if (/^\s+$/.test(o)) {
                                        t.end.column = o.length;
                                    }
                                }
                            }
                            if (r) t = r;
                        }
                        this.session.remove(t);
                        this.clearSelection();
                    };
                    this.removeWordRight = function() {
                        if (this.selection.isEmpty()) this.selection.selectWordRight();
                        this.session.remove(this.getSelectionRange());
                        this.clearSelection();
                    };
                    this.removeWordLeft = function() {
                        if (this.selection.isEmpty()) this.selection.selectWordLeft();
                        this.session.remove(this.getSelectionRange());
                        this.clearSelection();
                    };
                    this.removeToLineStart = function() {
                        if (this.selection.isEmpty()) this.selection.selectLineStart();
                        if (this.selection.isEmpty()) this.selection.selectLeft();
                        this.session.remove(this.getSelectionRange());
                        this.clearSelection();
                    };
                    this.removeToLineEnd = function() {
                        if (this.selection.isEmpty()) this.selection.selectLineEnd();
                        var e = this.getSelectionRange();
                        if (e.start.column == e.end.column && e.start.row == e.end.row) {
                            e.end.column = 0;
                            e.end.row++;
                        }
                        this.session.remove(e);
                        this.clearSelection();
                    };
                    this.splitLine = function() {
                        if (!this.selection.isEmpty()) {
                            this.session.remove(this.getSelectionRange());
                            this.clearSelection();
                        }
                        var e = this.getCursorPosition();
                        this.insert("\n");
                        this.moveCursorToPosition(e);
                    };
                    this.transposeLetters = function() {
                        if (!this.selection.isEmpty()) {
                            return;
                        }
                        var e = this.getCursorPosition();
                        var t = e.column;
                        if (t === 0) return;
                        var i = this.session.getLine(e.row);
                        var n, r;
                        if (t < i.length) {
                            n = i.charAt(t) + i.charAt(t - 1);
                            r = new f(e.row, t - 1, e.row, t + 1);
                        } else {
                            n = i.charAt(t - 1) + i.charAt(t - 2);
                            r = new f(e.row, t - 2, e.row, t);
                        }
                        this.session.replace(r, n);
                        this.session.selection.moveToPosition(r.end);
                    };
                    this.toLowerCase = function() {
                        var e = this.getSelectionRange();
                        if (this.selection.isEmpty()) {
                            this.selection.selectWord();
                        }
                        var t = this.getSelectionRange();
                        var i = this.session.getTextRange(t);
                        this.session.replace(t, i.toLowerCase());
                        this.selection.setSelectionRange(e);
                    };
                    this.toUpperCase = function() {
                        var e = this.getSelectionRange();
                        if (this.selection.isEmpty()) {
                            this.selection.selectWord();
                        }
                        var t = this.getSelectionRange();
                        var i = this.session.getTextRange(t);
                        this.session.replace(t, i.toUpperCase());
                        this.selection.setSelectionRange(e);
                    };
                    this.indent = function() {
                        var e = this.session;
                        var t = this.getSelectionRange();
                        if (t.start.row < t.end.row) {
                            var i = this.$getSelectedRows();
                            e.indentRows(i.first, i.last, "\t");
                            return;
                        } else if (t.start.column < t.end.column) {
                            var n = e.getTextRange(t);
                            if (!/^\s+$/.test(n)) {
                                var i = this.$getSelectedRows();
                                e.indentRows(i.first, i.last, "\t");
                                return;
                            }
                        }
                        var r = e.getLine(t.start.row);
                        var o = t.start;
                        var a = e.getTabSize();
                        var l = e.documentToScreenColumn(o.row, o.column);
                        if (this.session.getUseSoftTabs()) {
                            var h = a - (l % a);
                            var c = s.stringRepeat(" ", h);
                        } else {
                            var h = l % a;
                            while(r[t.start.column - 1] == " " && h){
                                t.start.column--;
                                h--;
                            }
                            this.selection.setSelectionRange(t);
                            c = "\t";
                        }
                        return this.insert(c);
                    };
                    this.blockIndent = function() {
                        var e = this.$getSelectedRows();
                        this.session.indentRows(e.first, e.last, "\t");
                    };
                    this.blockOutdent = function() {
                        var e = this.session.getSelection();
                        this.session.outdentRows(e.getRange());
                    };
                    this.sortLines = function() {
                        var e = this.$getSelectedRows();
                        var t = this.session;
                        var i = [];
                        for(var n = e.first; n <= e.last; n++)i.push(t.getLine(n));
                        i.sort(function(e, t) {
                            if (e.toLowerCase() < t.toLowerCase()) return -1;
                            if (e.toLowerCase() > t.toLowerCase()) return 1;
                            return 0;
                        });
                        var r = new f(0, 0, 0, 0);
                        for(var n = e.first; n <= e.last; n++){
                            var s = t.getLine(n);
                            r.start.row = n;
                            r.end.row = n;
                            r.end.column = s.length;
                            t.replace(r, i[n - e.first]);
                        }
                    };
                    this.toggleCommentLines = function() {
                        var e = this.session.getState(this.getCursorPosition().row);
                        var t = this.$getSelectedRows();
                        this.session.getMode().toggleCommentLines(e, this.session, t.first, t.last);
                    };
                    this.toggleBlockComment = function() {
                        var e = this.getCursorPosition();
                        var t = this.session.getState(e.row);
                        var i = this.getSelectionRange();
                        this.session.getMode().toggleBlockComment(t, this.session, i, e);
                    };
                    this.getNumberAt = function(e, t) {
                        var i = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
                        i.lastIndex = 0;
                        var n = this.session.getLine(e);
                        while(i.lastIndex < t){
                            var r = i.exec(n);
                            if (r.index <= t && r.index + r[0].length >= t) {
                                var s = {
                                    value: r[0],
                                    start: r.index,
                                    end: r.index + r[0].length
                                };
                                return s;
                            }
                        }
                        return null;
                    };
                    this.modifyNumber = function(e) {
                        var t = this.selection.getCursor().row;
                        var i = this.selection.getCursor().column;
                        var n = new f(t, i - 1, t, i);
                        var r = this.session.getTextRange(n);
                        if (!isNaN(parseFloat(r)) && isFinite(r)) {
                            var s = this.getNumberAt(t, i);
                            if (s) {
                                var o = s.value.indexOf(".") >= 0 ? s.start + s.value.indexOf(".") + 1 : s.end;
                                var a = s.start + s.value.length - o;
                                var l = parseFloat(s.value);
                                l *= Math.pow(10, a);
                                if (o !== s.end && i < o) {
                                    e *= Math.pow(10, s.end - i - 1);
                                } else {
                                    e *= Math.pow(10, s.end - i);
                                }
                                l += e;
                                l /= Math.pow(10, a);
                                var h = l.toFixed(a);
                                var c = new f(t, s.start, t, s.end);
                                this.session.replace(c, h);
                                this.moveCursorTo(t, Math.max(s.start + 1, i + h.length - s.value.length));
                            }
                        } else {
                            this.toggleWord();
                        }
                    };
                    this.$toggleWordPairs = [
                        [
                            "first",
                            "last"
                        ],
                        [
                            "true",
                            "false"
                        ],
                        [
                            "yes",
                            "no"
                        ],
                        [
                            "width",
                            "height"
                        ],
                        [
                            "top",
                            "bottom"
                        ],
                        [
                            "right",
                            "left"
                        ],
                        [
                            "on",
                            "off"
                        ],
                        [
                            "x",
                            "y"
                        ],
                        [
                            "get",
                            "set"
                        ],
                        [
                            "max",
                            "min"
                        ],
                        [
                            "horizontal",
                            "vertical"
                        ],
                        [
                            "show",
                            "hide"
                        ],
                        [
                            "add",
                            "remove"
                        ],
                        [
                            "up",
                            "down"
                        ],
                        [
                            "before",
                            "after"
                        ],
                        [
                            "even",
                            "odd"
                        ],
                        [
                            "in",
                            "out"
                        ],
                        [
                            "inside",
                            "outside"
                        ],
                        [
                            "next",
                            "previous"
                        ],
                        [
                            "increase",
                            "decrease"
                        ],
                        [
                            "attach",
                            "detach"
                        ],
                        [
                            "&&",
                            "||"
                        ],
                        [
                            "==",
                            "!="
                        ], 
                    ];
                    this.toggleWord = function() {
                        var e = this.selection.getCursor().row;
                        var t = this.selection.getCursor().column;
                        this.selection.selectWord();
                        var i = this.getSelectedText();
                        var n = this.selection.getWordRange().start.column;
                        var r = i.replace(/([a-z]+|[A-Z]+)(?=[A-Z_]|$)/g, "$1 ").split(/\s/);
                        var o = t - n - 1;
                        if (o < 0) o = 0;
                        var a = 0, l = 0;
                        var h = this;
                        if (i.match(/[A-Za-z0-9_]+/)) {
                            r.forEach(function(t, r) {
                                l = a + t.length;
                                if (o >= a && o <= l) {
                                    i = t;
                                    h.selection.clearSelection();
                                    h.moveCursorTo(e, a + n);
                                    h.selection.selectTo(e, l + n);
                                }
                                a = l;
                            });
                        }
                        var c = this.$toggleWordPairs;
                        var u;
                        for(var d = 0; d < c.length; d++){
                            var f = c[d];
                            for(var g = 0; g <= 1; g++){
                                var m = +!g;
                                var v = i.match(new RegExp("^\\s?_?(" + s.escapeRegExp(f[g]) + ")\\s?$", "i"));
                                if (v) {
                                    var p = i.match(new RegExp("([_]|^|\\s)(" + s.escapeRegExp(v[1]) + ")($|\\s)", "g"));
                                    if (p) {
                                        u = i.replace(new RegExp(s.escapeRegExp(f[g]), "i"), function(e) {
                                            var t = f[m];
                                            if (e.toUpperCase() == e) {
                                                t = t.toUpperCase();
                                            } else if (e.charAt(0).toUpperCase() == e.charAt(0)) {
                                                t = t.substr(0, 0) + f[m].charAt(0).toUpperCase() + t.substr(1);
                                            }
                                            return t;
                                        });
                                        this.insert(u);
                                        u = "";
                                    }
                                }
                            }
                        }
                    };
                    this.removeLines = function() {
                        var e = this.$getSelectedRows();
                        this.session.removeFullLines(e.first, e.last);
                        this.clearSelection();
                    };
                    this.duplicateSelection = function() {
                        var e = this.selection;
                        var t = this.session;
                        var i = e.getRange();
                        var n = e.isBackwards();
                        if (i.isEmpty()) {
                            var r = i.start.row;
                            t.duplicateLines(r, r);
                        } else {
                            var s = n ? i.start : i.end;
                            var o = t.insert(s, t.getTextRange(i), false);
                            i.start = s;
                            i.end = o;
                            e.setSelectionRange(i, n);
                        }
                    };
                    this.moveLinesDown = function() {
                        this.$moveLines(1, false);
                    };
                    this.moveLinesUp = function() {
                        this.$moveLines(-1, false);
                    };
                    this.moveText = function(e, t, i) {
                        return this.session.moveText(e, t, i);
                    };
                    this.copyLinesUp = function() {
                        this.$moveLines(-1, true);
                    };
                    this.copyLinesDown = function() {
                        this.$moveLines(1, true);
                    };
                    this.$moveLines = function(e, t) {
                        var i, n;
                        var r = this.selection;
                        if (!r.inMultiSelectMode || this.inVirtualSelectionMode) {
                            var s = r.toOrientedRange();
                            i = this.$getSelectedRows(s);
                            n = this.session.$moveLines(i.first, i.last, t ? 0 : e);
                            if (t && e == -1) n = 0;
                            s.moveBy(n, 0);
                            r.fromOrientedRange(s);
                        } else {
                            var o = r.rangeList.ranges;
                            r.rangeList.detach(this.session);
                            this.inVirtualSelectionMode = true;
                            var a = 0;
                            var l = 0;
                            var h = o.length;
                            for(var c = 0; c < h; c++){
                                var u = c;
                                o[c].moveBy(a, 0);
                                i = this.$getSelectedRows(o[c]);
                                var d = i.first;
                                var f = i.last;
                                while(++c < h){
                                    if (l) o[c].moveBy(l, 0);
                                    var g = this.$getSelectedRows(o[c]);
                                    if (t && g.first != f) break;
                                    else if (!t && g.first > f + 1) break;
                                    f = g.last;
                                }
                                c--;
                                a = this.session.$moveLines(d, f, t ? 0 : e);
                                if (t && e == -1) u = c + 1;
                                while(u <= c){
                                    o[u].moveBy(a, 0);
                                    u++;
                                }
                                if (!t) a = 0;
                                l += a;
                            }
                            r.fromOrientedRange(r.ranges[0]);
                            r.rangeList.attach(this.session);
                            this.inVirtualSelectionMode = false;
                        }
                    };
                    this.$getSelectedRows = function(e) {
                        e = (e || this.getSelectionRange()).collapseRows();
                        return {
                            first: this.session.getRowFoldStart(e.start.row),
                            last: this.session.getRowFoldEnd(e.end.row)
                        };
                    };
                    this.onCompositionStart = function(e) {
                        this.renderer.showComposition(e);
                    };
                    this.onCompositionUpdate = function(e) {
                        this.renderer.setCompositionText(e);
                    };
                    this.onCompositionEnd = function() {
                        this.renderer.hideComposition();
                    };
                    this.getFirstVisibleRow = function() {
                        return this.renderer.getFirstVisibleRow();
                    };
                    this.getLastVisibleRow = function() {
                        return this.renderer.getLastVisibleRow();
                    };
                    this.isRowVisible = function(e) {
                        return (e >= this.getFirstVisibleRow() && e <= this.getLastVisibleRow());
                    };
                    this.isRowFullyVisible = function(e) {
                        return (e >= this.renderer.getFirstFullyVisibleRow() && e <= this.renderer.getLastFullyVisibleRow());
                    };
                    this.$getVisibleRowCount = function() {
                        return (this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1);
                    };
                    this.$moveByPage = function(e, t) {
                        var i = this.renderer;
                        var n = this.renderer.layerConfig;
                        var r = e * Math.floor(n.height / n.lineHeight);
                        if (t === true) {
                            this.selection.$moveSelection(function() {
                                this.moveCursorBy(r, 0);
                            });
                        } else if (t === false) {
                            this.selection.moveCursorBy(r, 0);
                            this.selection.clearSelection();
                        }
                        var s = i.scrollTop;
                        i.scrollBy(0, r * n.lineHeight);
                        if (t != null) i.scrollCursorIntoView(null, 0.5);
                        i.animateScrolling(s);
                    };
                    this.selectPageDown = function() {
                        this.$moveByPage(1, true);
                    };
                    this.selectPageUp = function() {
                        this.$moveByPage(-1, true);
                    };
                    this.gotoPageDown = function() {
                        this.$moveByPage(1, false);
                    };
                    this.gotoPageUp = function() {
                        this.$moveByPage(-1, false);
                    };
                    this.scrollPageDown = function() {
                        this.$moveByPage(1);
                    };
                    this.scrollPageUp = function() {
                        this.$moveByPage(-1);
                    };
                    this.scrollToRow = function(e) {
                        this.renderer.scrollToRow(e);
                    };
                    this.scrollToLine = function(e, t, i, n) {
                        this.renderer.scrollToLine(e, t, i, n);
                    };
                    this.centerSelection = function() {
                        var e = this.getSelectionRange();
                        var t = {
                            row: Math.floor(e.start.row + (e.end.row - e.start.row) / 2),
                            column: Math.floor(e.start.column + (e.end.column - e.start.column) / 2)
                        };
                        this.renderer.alignCursor(t, 0.5);
                    };
                    this.getCursorPosition = function() {
                        return this.selection.getCursor();
                    };
                    this.getCursorPositionScreen = function() {
                        return this.session.documentToScreenPosition(this.getCursorPosition());
                    };
                    this.getSelectionRange = function() {
                        return this.selection.getRange();
                    };
                    this.selectAll = function() {
                        this.selection.selectAll();
                    };
                    this.clearSelection = function() {
                        this.selection.clearSelection();
                    };
                    this.moveCursorTo = function(e, t) {
                        this.selection.moveCursorTo(e, t);
                    };
                    this.moveCursorToPosition = function(e) {
                        this.selection.moveCursorToPosition(e);
                    };
                    this.jumpToMatching = function(e, t) {
                        var i = this.getCursorPosition();
                        var n = new w(this.session, i.row, i.column);
                        var r = n.getCurrentToken();
                        var s = r || n.stepForward();
                        if (!s) return;
                        var o;
                        var a = false;
                        var l = {};
                        var h = i.column - s.start;
                        var c;
                        var u = {
                            ")": "(",
                            "(": "(",
                            "]": "[",
                            "[": "[",
                            "{": "{",
                            "}": "{"
                        };
                        do {
                            if (s.value.match(/[{}()\[\]]/g)) {
                                for(; h < s.value.length && !a; h++){
                                    if (!u[s.value[h]]) {
                                        continue;
                                    }
                                    c = u[s.value[h]] + "." + s.type.replace("rparen", "lparen");
                                    if (isNaN(l[c])) {
                                        l[c] = 0;
                                    }
                                    switch(s.value[h]){
                                        case "(":
                                        case "[":
                                        case "{":
                                            l[c]++;
                                            break;
                                        case ")":
                                        case "]":
                                        case "}":
                                            l[c]--;
                                            if (l[c] === -1) {
                                                o = "bracket";
                                                a = true;
                                            }
                                            break;
                                    }
                                }
                            } else if (s.type.indexOf("tag-name") !== -1) {
                                if (isNaN(l[s.value])) {
                                    l[s.value] = 0;
                                }
                                if (r.value === "<") {
                                    l[s.value]++;
                                } else if (r.value === "</") {
                                    l[s.value]--;
                                }
                                if (l[s.value] === -1) {
                                    o = "tag";
                                    a = true;
                                }
                            }
                            if (!a) {
                                r = s;
                                s = n.stepForward();
                                h = 0;
                            }
                        }while (s && !a)
                        if (!o) return;
                        var d, g;
                        if (o === "bracket") {
                            d = this.session.getBracketRange(i);
                            if (!d) {
                                d = new f(n.getCurrentTokenRow(), n.getCurrentTokenColumn() + h - 1, n.getCurrentTokenRow(), n.getCurrentTokenColumn() + h - 1);
                                g = d.start;
                                if (t || (g.row === i.row && Math.abs(g.column - i.column) < 2)) d = this.session.getBracketRange(g);
                            }
                        } else if (o === "tag") {
                            if (s && s.type.indexOf("tag-name") !== -1) var m = s.value;
                            else return;
                            d = new f(n.getCurrentTokenRow(), n.getCurrentTokenColumn() - 2, n.getCurrentTokenRow(), n.getCurrentTokenColumn() - 2);
                            if (d.compare(i.row, i.column) === 0) {
                                a = false;
                                do {
                                    s = r;
                                    r = n.stepBackward();
                                    if (r) {
                                        if (r.type.indexOf("tag-close") !== -1) {
                                            d.setEnd(n.getCurrentTokenRow(), n.getCurrentTokenColumn() + 1);
                                        }
                                        if (s.value === m && s.type.indexOf("tag-name") !== -1) {
                                            if (r.value === "<") {
                                                l[m]++;
                                            } else if (r.value === "</") {
                                                l[m]--;
                                            }
                                            if (l[m] === 0) a = true;
                                        }
                                    }
                                }while (r && !a)
                            }
                            if (s && s.type.indexOf("tag-name")) {
                                g = d.start;
                                if (g.row == i.row && Math.abs(g.column - i.column) < 2) g = d.end;
                            }
                        }
                        g = (d && d.cursor) || g;
                        if (g) {
                            if (e) {
                                if (d && t) {
                                    this.selection.setRange(d);
                                } else if (d && d.isEqual(this.getSelectionRange())) {
                                    this.clearSelection();
                                } else {
                                    this.selection.selectTo(g.row, g.column);
                                }
                            } else {
                                this.selection.moveTo(g.row, g.column);
                            }
                        }
                    };
                    this.gotoLine = function(e, t, i) {
                        this.selection.clearSelection();
                        this.session.unfold({
                            row: e - 1,
                            column: t || 0
                        });
                        this.exitMultiSelectMode && this.exitMultiSelectMode();
                        this.moveCursorTo(e - 1, t || 0);
                        if (!this.isRowFullyVisible(e - 1)) this.scrollToLine(e - 1, true, i);
                    };
                    this.navigateTo = function(e, t) {
                        this.selection.moveTo(e, t);
                    };
                    this.navigateUp = function(e) {
                        if (this.selection.isMultiLine() && !this.selection.isBackwards()) {
                            var t = this.selection.anchor.getPosition();
                            return this.moveCursorToPosition(t);
                        }
                        this.selection.clearSelection();
                        this.selection.moveCursorBy(-e || -1, 0);
                    };
                    this.navigateDown = function(e) {
                        if (this.selection.isMultiLine() && this.selection.isBackwards()) {
                            var t = this.selection.anchor.getPosition();
                            return this.moveCursorToPosition(t);
                        }
                        this.selection.clearSelection();
                        this.selection.moveCursorBy(e || 1, 0);
                    };
                    this.navigateLeft = function(e) {
                        if (!this.selection.isEmpty()) {
                            var t = this.getSelectionRange().start;
                            this.moveCursorToPosition(t);
                        } else {
                            e = e || 1;
                            while(e--){
                                this.selection.moveCursorLeft();
                            }
                        }
                        this.clearSelection();
                    };
                    this.navigateRight = function(e) {
                        if (!this.selection.isEmpty()) {
                            var t = this.getSelectionRange().end;
                            this.moveCursorToPosition(t);
                        } else {
                            e = e || 1;
                            while(e--){
                                this.selection.moveCursorRight();
                            }
                        }
                        this.clearSelection();
                    };
                    this.navigateLineStart = function() {
                        this.selection.moveCursorLineStart();
                        this.clearSelection();
                    };
                    this.navigateLineEnd = function() {
                        this.selection.moveCursorLineEnd();
                        this.clearSelection();
                    };
                    this.navigateFileEnd = function() {
                        this.selection.moveCursorFileEnd();
                        this.clearSelection();
                    };
                    this.navigateFileStart = function() {
                        this.selection.moveCursorFileStart();
                        this.clearSelection();
                    };
                    this.navigateWordRight = function() {
                        this.selection.moveCursorWordRight();
                        this.clearSelection();
                    };
                    this.navigateWordLeft = function() {
                        this.selection.moveCursorWordLeft();
                        this.clearSelection();
                    };
                    this.replace = function(e, t) {
                        if (t) this.$search.set(t);
                        var i = this.$search.find(this.session);
                        var n = 0;
                        if (!i) return n;
                        if (this.$tryReplace(i, e)) {
                            n = 1;
                        }
                        this.selection.setSelectionRange(i);
                        this.renderer.scrollSelectionIntoView(i.start, i.end);
                        return n;
                    };
                    this.replaceAll = function(e, t) {
                        if (t) {
                            this.$search.set(t);
                        }
                        var i = this.$search.findAll(this.session);
                        var n = 0;
                        if (!i.length) return n;
                        var r = this.getSelectionRange();
                        this.selection.moveTo(0, 0);
                        for(var s = i.length - 1; s >= 0; --s){
                            if (this.$tryReplace(i[s], e)) {
                                n++;
                            }
                        }
                        this.selection.setSelectionRange(r);
                        return n;
                    };
                    this.$tryReplace = function(e, t) {
                        var i = this.session.getTextRange(e);
                        t = this.$search.replace(i, t);
                        if (t !== null) {
                            e.end = this.session.replace(e, t);
                            return e;
                        } else {
                            return null;
                        }
                    };
                    this.getLastSearchOptions = function() {
                        return this.$search.getOptions();
                    };
                    this.find = function(e, t, i) {
                        if (!t) t = {};
                        if (typeof e == "string" || e instanceof RegExp) t.needle = e;
                        else if (typeof e == "object") n.mixin(t, e);
                        var r = this.selection.getRange();
                        if (t.needle == null) {
                            e = this.session.getTextRange(r) || this.$search.$options.needle;
                            if (!e) {
                                r = this.session.getWordRange(r.start.row, r.start.column);
                                e = this.session.getTextRange(r);
                            }
                            this.$search.set({
                                needle: e
                            });
                        }
                        this.$search.set(t);
                        if (!t.start) this.$search.set({
                            start: r
                        });
                        var s = this.$search.find(this.session);
                        if (t.preventScroll) return s;
                        if (s) {
                            this.revealRange(s, i);
                            return s;
                        }
                        if (t.backwards) r.start = r.end;
                        else r.end = r.start;
                        this.selection.setRange(r);
                    };
                    this.findNext = function(e, t) {
                        this.find({
                            skipCurrent: true,
                            backwards: false
                        }, e, t);
                    };
                    this.findPrevious = function(e, t) {
                        this.find(e, {
                            skipCurrent: true,
                            backwards: true
                        }, t);
                    };
                    this.revealRange = function(e, t) {
                        this.session.unfold(e);
                        this.selection.setSelectionRange(e);
                        var i = this.renderer.scrollTop;
                        this.renderer.scrollSelectionIntoView(e.start, e.end, 0.5);
                        if (t !== false) this.renderer.animateScrolling(i);
                    };
                    this.undo = function() {
                        this.session.getUndoManager().undo(this.session);
                        this.renderer.scrollCursorIntoView(null, 0.5);
                    };
                    this.redo = function() {
                        this.session.getUndoManager().redo(this.session);
                        this.renderer.scrollCursorIntoView(null, 0.5);
                    };
                    this.destroy = function() {
                        if (this.$toDestroy) {
                            this.$toDestroy.forEach(function(e) {
                                e.destroy();
                            });
                            this.$toDestroy = null;
                        }
                        if (this.$mouseHandler) this.$mouseHandler.destroy();
                        this.renderer.destroy();
                        this._signal("destroy", this);
                        if (this.session) this.session.destroy();
                        if (this._$emitInputEvent) this._$emitInputEvent.cancel();
                        this.removeAllListeners();
                    };
                    this.setAutoScrollEditorIntoView = function(e) {
                        if (!e) return;
                        var t;
                        var i = this;
                        var n = false;
                        if (!this.$scrollAnchor) this.$scrollAnchor = document.createElement("div");
                        var r = this.$scrollAnchor;
                        r.style.cssText = "position:absolute";
                        this.container.insertBefore(r, this.container.firstChild);
                        var s = this.on("changeSelection", function() {
                            n = true;
                        });
                        var o = this.renderer.on("beforeRender", function() {
                            if (n) t = i.renderer.container.getBoundingClientRect();
                        });
                        var a = this.renderer.on("afterRender", function() {
                            if (n && t && (i.isFocused() || (i.searchBox && i.searchBox.isFocused()))) {
                                var e = i.renderer;
                                var s = e.$cursorLayer.$pixelPos;
                                var o = e.layerConfig;
                                var a = s.top - o.offset;
                                if (s.top >= 0 && a + t.top < 0) {
                                    n = true;
                                } else if (s.top < o.height && s.top + t.top + o.lineHeight > window.innerHeight) {
                                    n = false;
                                } else {
                                    n = null;
                                }
                                if (n != null) {
                                    r.style.top = a + "px";
                                    r.style.left = s.left + "px";
                                    r.style.height = o.lineHeight + "px";
                                    r.scrollIntoView(n);
                                }
                                n = t = null;
                            }
                        });
                        this.setAutoScrollEditorIntoView = function(e) {
                            if (e) return;
                            delete this.setAutoScrollEditorIntoView;
                            this.off("changeSelection", s);
                            this.renderer.off("afterRender", a);
                            this.renderer.off("beforeRender", o);
                        };
                    };
                    this.$resetCursorStyle = function() {
                        var e = this.$cursorStyle || "ace";
                        var t = this.renderer.$cursorLayer;
                        if (!t) return;
                        t.setSmoothBlinking(/smooth/.test(e));
                        t.isBlinking = !this.$readOnly && e != "wide";
                        r.setCssClass(t.element, "ace_slim-cursors", /slim/.test(e));
                    };
                    this.prompt = function(e, t, i) {
                        var n = this;
                        p.loadModule("./ext/prompt", function(r) {
                            r.prompt(n, e, t, i);
                        });
                    };
                }.call(b.prototype));
                p.defineOptions(b.prototype, "editor", {
                    selectionStyle: {
                        set: function(e) {
                            this.onSelectionChange();
                            this._signal("changeSelectionStyle", {
                                data: e
                            });
                        },
                        initialValue: "line"
                    },
                    highlightActiveLine: {
                        set: function() {
                            this.$updateHighlightActiveLine();
                        },
                        initialValue: true
                    },
                    highlightSelectedWord: {
                        set: function(e) {
                            this.$onSelectionChange();
                        },
                        initialValue: true
                    },
                    readOnly: {
                        set: function(e) {
                            this.textInput.setReadOnly(e);
                            this.$resetCursorStyle();
                        },
                        initialValue: false
                    },
                    copyWithEmptySelection: {
                        set: function(e) {
                            this.textInput.setCopyWithEmptySelection(e);
                        },
                        initialValue: false
                    },
                    cursorStyle: {
                        set: function(e) {
                            this.$resetCursorStyle();
                        },
                        values: [
                            "ace",
                            "slim",
                            "smooth",
                            "wide"
                        ],
                        initialValue: "ace"
                    },
                    mergeUndoDeltas: {
                        values: [
                            false,
                            true,
                            "always"
                        ],
                        initialValue: true
                    },
                    behavioursEnabled: {
                        initialValue: true
                    },
                    wrapBehavioursEnabled: {
                        initialValue: true
                    },
                    enableAutoIndent: {
                        initialValue: true
                    },
                    autoScrollEditorIntoView: {
                        set: function(e) {
                            this.setAutoScrollEditorIntoView(e);
                        }
                    },
                    keyboardHandler: {
                        set: function(e) {
                            this.setKeyboardHandler(e);
                        },
                        get: function() {
                            return this.$keybindingId;
                        },
                        handlesSet: true
                    },
                    value: {
                        set: function(e) {
                            this.session.setValue(e);
                        },
                        get: function() {
                            return this.getValue();
                        },
                        handlesSet: true,
                        hidden: true
                    },
                    session: {
                        set: function(e) {
                            this.setSession(e);
                        },
                        get: function() {
                            return this.session;
                        },
                        handlesSet: true,
                        hidden: true
                    },
                    showLineNumbers: {
                        set: function(e) {
                            this.renderer.$gutterLayer.setShowLineNumbers(e);
                            this.renderer.$loop.schedule(this.renderer.CHANGE_GUTTER);
                            if (e && this.$relativeLineNumbers) y.attach(this);
                            else y.detach(this);
                        },
                        initialValue: true
                    },
                    relativeLineNumbers: {
                        set: function(e) {
                            if (this.$showLineNumbers && e) y.attach(this);
                            else y.detach(this);
                        }
                    },
                    placeholder: {
                        set: function(e) {
                            if (!this.$updatePlaceholder) {
                                this.$updatePlaceholder = function() {
                                    var e = this.session && (this.renderer.$composition || this.getValue());
                                    if (e && this.renderer.placeholderNode) {
                                        this.renderer.off("afterRender", this.$updatePlaceholder);
                                        r.removeCssClass(this.container, "ace_hasPlaceholder");
                                        this.renderer.placeholderNode.remove();
                                        this.renderer.placeholderNode = null;
                                    } else if (!e && !this.renderer.placeholderNode) {
                                        this.renderer.on("afterRender", this.$updatePlaceholder);
                                        r.addCssClass(this.container, "ace_hasPlaceholder");
                                        var t = r.createElement("div");
                                        t.className = "ace_placeholder";
                                        t.textContent = this.$placeholder || "";
                                        this.renderer.placeholderNode = t;
                                        this.renderer.content.appendChild(this.renderer.placeholderNode);
                                    } else if (!e && this.renderer.placeholderNode) {
                                        this.renderer.placeholderNode.textContent = this.$placeholder || "";
                                    }
                                }.bind(this);
                                this.on("input", this.$updatePlaceholder);
                            }
                            this.$updatePlaceholder();
                        }
                    },
                    hScrollBarAlwaysVisible: "renderer",
                    vScrollBarAlwaysVisible: "renderer",
                    highlightGutterLine: "renderer",
                    animatedScroll: "renderer",
                    showInvisibles: "renderer",
                    showPrintMargin: "renderer",
                    printMarginColumn: "renderer",
                    printMargin: "renderer",
                    fadeFoldWidgets: "renderer",
                    showFoldWidgets: "renderer",
                    displayIndentGuides: "renderer",
                    showGutter: "renderer",
                    fontSize: "renderer",
                    fontFamily: "renderer",
                    maxLines: "renderer",
                    minLines: "renderer",
                    scrollPastEnd: "renderer",
                    fixedWidthGutter: "renderer",
                    theme: "renderer",
                    hasCssTransforms: "renderer",
                    maxPixelHeight: "renderer",
                    useTextareaForIME: "renderer",
                    scrollSpeed: "$mouseHandler",
                    dragDelay: "$mouseHandler",
                    dragEnabled: "$mouseHandler",
                    focusTimeout: "$mouseHandler",
                    tooltipFollowsMouse: "$mouseHandler",
                    firstLineNumber: "session",
                    overwrite: "session",
                    newLineMode: "session",
                    useWorker: "session",
                    useSoftTabs: "session",
                    navigateWithinSoftTabs: "session",
                    tabSize: "session",
                    wrap: "session",
                    indentedSoftWrap: "session",
                    foldStyle: "session",
                    mode: "session"
                });
                var y = {
                    getText: function(e, t) {
                        return ((Math.abs(e.selection.lead.row - t) || t + 1 + (t < 9 ? "\xb7" : "")) + "");
                    },
                    getWidth: function(e, t, i) {
                        return (Math.max(t.toString().length, (i.lastRow + 1).toString().length, 2) * i.characterWidth);
                    },
                    update: function(e, t) {
                        t.renderer.$loop.schedule(t.renderer.CHANGE_GUTTER);
                    },
                    attach: function(e) {
                        e.renderer.$gutterLayer.$renderer = this;
                        e.on("changeSelection", this.update);
                        this.update(null, e);
                    },
                    detach: function(e) {
                        if (e.renderer.$gutterLayer.$renderer == this) e.renderer.$gutterLayer.$renderer = null;
                        e.off("changeSelection", this.update);
                        this.update(null, e);
                    }
                };
                t.Editor = b;
            });
            ace.define("ace/undomanager", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(e, t, i) {
                "use strict";
                var n = function() {
                    this.$maxRev = 0;
                    this.$fromUndo = false;
                    this.reset();
                };
                (function() {
                    this.addSession = function(e) {
                        this.$session = e;
                    };
                    this.add = function(e, t, i) {
                        if (this.$fromUndo) return;
                        if (e == this.$lastDelta) return;
                        if (!this.$keepRedoStack) this.$redoStack.length = 0;
                        if (t === false || !this.lastDeltas) {
                            this.lastDeltas = [];
                            this.$undoStack.push(this.lastDeltas);
                            e.id = this.$rev = ++this.$maxRev;
                        }
                        if (e.action == "remove" || e.action == "insert") this.$lastDelta = e;
                        this.lastDeltas.push(e);
                    };
                    this.addSelection = function(e, t) {
                        this.selections.push({
                            value: e,
                            rev: t || this.$rev
                        });
                    };
                    this.startNewGroup = function() {
                        this.lastDeltas = null;
                        return this.$rev;
                    };
                    this.markIgnored = function(e, t) {
                        if (t == null) t = this.$rev + 1;
                        var i = this.$undoStack;
                        for(var n = i.length; n--;){
                            var r = i[n][0];
                            if (r.id <= e) break;
                            if (r.id < t) r.ignore = true;
                        }
                        this.lastDeltas = null;
                    };
                    this.getSelection = function(e, t) {
                        var i = this.selections;
                        for(var n = i.length; n--;){
                            var r = i[n];
                            if (r.rev < e) {
                                if (t) r = i[n + 1];
                                return r;
                            }
                        }
                    };
                    this.getRevision = function() {
                        return this.$rev;
                    };
                    this.getDeltas = function(e, t) {
                        if (t == null) t = this.$rev + 1;
                        var i = this.$undoStack;
                        var n = null, r = 0;
                        for(var s = i.length; s--;){
                            var o = i[s][0];
                            if (o.id < t && !n) n = s + 1;
                            if (o.id <= e) {
                                r = s + 1;
                                break;
                            }
                        }
                        return i.slice(r, n);
                    };
                    this.getChangedRanges = function(e, t) {
                        if (t == null) t = this.$rev + 1;
                    };
                    this.getChangedLines = function(e, t) {
                        if (t == null) t = this.$rev + 1;
                    };
                    this.undo = function(e, t) {
                        this.lastDeltas = null;
                        var i = this.$undoStack;
                        if (!r(i, i.length)) return;
                        if (!e) e = this.$session;
                        if (this.$redoStackBaseRev !== this.$rev && this.$redoStack.length) this.$redoStack = [];
                        this.$fromUndo = true;
                        var n = i.pop();
                        var s = null;
                        if (n) {
                            s = e.undoChanges(n, t);
                            this.$redoStack.push(n);
                            this.$syncRev();
                        }
                        this.$fromUndo = false;
                        return s;
                    };
                    this.redo = function(e, t) {
                        this.lastDeltas = null;
                        if (!e) e = this.$session;
                        this.$fromUndo = true;
                        if (this.$redoStackBaseRev != this.$rev) {
                            var i = this.getDeltas(this.$redoStackBaseRev, this.$rev + 1);
                            b(this.$redoStack, i);
                            this.$redoStackBaseRev = this.$rev;
                            this.$redoStack.forEach(function(e) {
                                e[0].id = ++this.$maxRev;
                            }, this);
                        }
                        var n = this.$redoStack.pop();
                        var r = null;
                        if (n) {
                            r = e.redoChanges(n, t);
                            this.$undoStack.push(n);
                            this.$syncRev();
                        }
                        this.$fromUndo = false;
                        return r;
                    };
                    this.$syncRev = function() {
                        var e = this.$undoStack;
                        var t = e[e.length - 1];
                        var i = (t && t[0].id) || 0;
                        this.$redoStackBaseRev = i;
                        this.$rev = i;
                    };
                    this.reset = function() {
                        this.lastDeltas = null;
                        this.$lastDelta = null;
                        this.$undoStack = [];
                        this.$redoStack = [];
                        this.$rev = 0;
                        this.mark = 0;
                        this.$redoStackBaseRev = this.$rev;
                        this.selections = [];
                    };
                    this.canUndo = function() {
                        return this.$undoStack.length > 0;
                    };
                    this.canRedo = function() {
                        return this.$redoStack.length > 0;
                    };
                    this.bookmark = function(e) {
                        if (e == undefined) e = this.$rev;
                        this.mark = e;
                    };
                    this.isAtBookmark = function() {
                        return this.$rev === this.mark;
                    };
                    this.toJSON = function() {};
                    this.fromJSON = function() {};
                    this.hasUndo = this.canUndo;
                    this.hasRedo = this.canRedo;
                    this.isClean = this.isAtBookmark;
                    this.markClean = this.bookmark;
                    this.$prettyPrint = function(e) {
                        if (e) return u(e);
                        return (u(this.$undoStack) + "\n---\n" + u(this.$redoStack));
                    };
                }.call(n.prototype));
                function r(e, t) {
                    for(var i = t; i--;){
                        var n = e[i];
                        if (n && !n[0].ignore) {
                            while(i < t - 1){
                                var r = g(e[i], e[i + 1]);
                                e[i] = r[0];
                                e[i + 1] = r[1];
                                i++;
                            }
                            return true;
                        }
                    }
                }
                var s = e("./range").Range;
                var o = s.comparePoints;
                var a = s.comparePoints;
                function l(e) {
                    var t = e.action == "insert";
                    var i = e.start;
                    var n = e.end;
                    var r = (n.row - i.row) * (t ? 1 : -1);
                    var s = (n.column - i.column) * (t ? 1 : -1);
                    if (t) n = i;
                    for(var o in this.marks){
                        var l = this.marks[o];
                        var h = a(l, i);
                        if (h < 0) {
                            continue;
                        }
                        if (h === 0) {
                            if (t) {
                                if (l.bias == 1) {
                                    h = 1;
                                } else {
                                    l.bias == -1;
                                    continue;
                                }
                            }
                        }
                        var c = t ? h : a(l, n);
                        if (c > 0) {
                            l.row += r;
                            l.column += l.row == n.row ? s : 0;
                            continue;
                        }
                        if (!t && c <= 0) {
                            l.row = i.row;
                            l.column = i.column;
                            if (c === 0) l.bias = 1;
                        }
                    }
                }
                function h(e) {
                    return {
                        row: e.row,
                        column: e.column
                    };
                }
                function c(e) {
                    return {
                        start: h(e.start),
                        end: h(e.end),
                        action: e.action,
                        lines: e.lines.slice()
                    };
                }
                function u(e) {
                    e = e || this;
                    if (Array.isArray(e)) {
                        return e.map(u).join("\n");
                    }
                    var t = "";
                    if (e.action) {
                        t = e.action == "insert" ? "+" : "-";
                        t += "[" + e.lines + "]";
                    } else if (e.value) {
                        if (Array.isArray(e.value)) {
                            t = e.value.map(d).join("\n");
                        } else {
                            t = d(e.value);
                        }
                    }
                    if (e.start) {
                        t += d(e);
                    }
                    if (e.id || e.rev) {
                        t += "\t(" + (e.id || e.rev) + ")";
                    }
                    return t;
                }
                function d(e) {
                    return (e.start.row + ":" + e.start.column + "=>" + e.end.row + ":" + e.end.column);
                }
                function f(e, t) {
                    var i = e.action == "insert";
                    var n = t.action == "insert";
                    if (i && n) {
                        if (o(t.start, e.end) >= 0) {
                            v(t, e, -1);
                        } else if (o(t.start, e.start) <= 0) {
                            v(e, t, +1);
                        } else {
                            return null;
                        }
                    } else if (i && !n) {
                        if (o(t.start, e.end) >= 0) {
                            v(t, e, -1);
                        } else if (o(t.end, e.start) <= 0) {
                            v(e, t, -1);
                        } else {
                            return null;
                        }
                    } else if (!i && n) {
                        if (o(t.start, e.start) >= 0) {
                            v(t, e, +1);
                        } else if (o(t.start, e.start) <= 0) {
                            v(e, t, +1);
                        } else {
                            return null;
                        }
                    } else if (!i && !n) {
                        if (o(t.start, e.start) >= 0) {
                            v(t, e, +1);
                        } else if (o(t.end, e.start) <= 0) {
                            v(e, t, -1);
                        } else {
                            return null;
                        }
                    }
                    return [
                        t,
                        e
                    ];
                }
                function g(e, t) {
                    for(var i = e.length; i--;){
                        for(var n = 0; n < t.length; n++){
                            if (!f(e[i], t[n])) {
                                while(i < e.length){
                                    while(n--){
                                        f(t[n], e[i]);
                                    }
                                    n = t.length;
                                    i++;
                                }
                                return [
                                    e,
                                    t
                                ];
                            }
                        }
                    }
                    e.selectionBefore = t.selectionBefore = e.selectionAfter = t.selectionAfter = null;
                    return [
                        t,
                        e
                    ];
                }
                function m(e, t) {
                    var i = e.action == "insert";
                    var n = t.action == "insert";
                    if (i && n) {
                        if (o(e.start, t.start) < 0) {
                            v(t, e, 1);
                        } else {
                            v(e, t, 1);
                        }
                    } else if (i && !n) {
                        if (o(e.start, t.end) >= 0) {
                            v(e, t, -1);
                        } else if (o(e.start, t.start) <= 0) {
                            v(t, e, +1);
                        } else {
                            v(e, s.fromPoints(t.start, e.start), -1);
                            v(t, e, +1);
                        }
                    } else if (!i && n) {
                        if (o(t.start, e.end) >= 0) {
                            v(t, e, -1);
                        } else if (o(t.start, e.start) <= 0) {
                            v(e, t, +1);
                        } else {
                            v(t, s.fromPoints(e.start, t.start), -1);
                            v(e, t, +1);
                        }
                    } else if (!i && !n) {
                        if (o(t.start, e.end) >= 0) {
                            v(t, e, -1);
                        } else if (o(t.end, e.start) <= 0) {
                            v(e, t, -1);
                        } else {
                            var r, a;
                            if (o(e.start, t.start) < 0) {
                                r = e;
                                e = w(e, t.start);
                            }
                            if (o(e.end, t.end) > 0) {
                                a = w(e, t.end);
                            }
                            p(t.end, e.start, e.end, -1);
                            if (a && !r) {
                                e.lines = a.lines;
                                e.start = a.start;
                                e.end = a.end;
                                a = e;
                            }
                            return [
                                t,
                                r,
                                a
                            ].filter(Boolean);
                        }
                    }
                    return [
                        t,
                        e
                    ];
                }
                function v(e, t, i) {
                    p(e.start, t.start, t.end, i);
                    p(e.end, t.start, t.end, i);
                }
                function p(e, t, i, n) {
                    if (e.row == (n == 1 ? t : i).row) {
                        e.column += n * (i.column - t.column);
                    }
                    e.row += n * (i.row - t.row);
                }
                function w(e, t) {
                    var i = e.lines;
                    var n = e.end;
                    e.end = h(t);
                    var r = e.end.row - e.start.row;
                    var s = i.splice(r, i.length);
                    var o = r ? t.column : t.column - e.start.column;
                    i.push(s[0].substring(0, o));
                    s[0] = s[0].substr(o);
                    var a = {
                        start: h(t),
                        end: n,
                        lines: s,
                        action: e.action
                    };
                    return a;
                }
                function $(e, t) {
                    t = c(t);
                    for(var i = e.length; i--;){
                        var n = e[i];
                        for(var r = 0; r < n.length; r++){
                            var s = n[r];
                            var o = m(s, t);
                            t = o[0];
                            if (o.length != 2) {
                                if (o[2]) {
                                    n.splice(r + 1, 1, o[1], o[2]);
                                    r++;
                                } else if (!o[1]) {
                                    n.splice(r, 1);
                                    r--;
                                }
                            }
                        }
                        if (!n.length) {
                            e.splice(i, 1);
                        }
                    }
                    return e;
                }
                function b(e, t) {
                    for(var i = 0; i < t.length; i++){
                        var n = t[i];
                        for(var r = 0; r < n.length; r++){
                            $(e, n[r]);
                        }
                    }
                }
                t.UndoManager = n;
            });
            ace.define("ace/layer/lines", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/dom");
                var r = function(e, t) {
                    this.element = e;
                    this.canvasHeight = t || 500000;
                    this.element.style.height = this.canvasHeight * 2 + "px";
                    this.cells = [];
                    this.cellCache = [];
                    this.$offsetCoefficient = 0;
                };
                (function() {
                    this.moveContainer = function(e) {
                        n.translate(this.element, 0, -((e.firstRowScreen * e.lineHeight) % this.canvasHeight) - e.offset * this.$offsetCoefficient);
                    };
                    this.pageChanged = function(e, t) {
                        return (Math.floor((e.firstRowScreen * e.lineHeight) / this.canvasHeight) !== Math.floor((t.firstRowScreen * t.lineHeight) / this.canvasHeight));
                    };
                    this.computeLineTop = function(e, t, i) {
                        var n = t.firstRowScreen * t.lineHeight;
                        var r = Math.floor(n / this.canvasHeight);
                        var s = i.documentToScreenRow(e, 0) * t.lineHeight;
                        return s - r * this.canvasHeight;
                    };
                    this.computeLineHeight = function(e, t, i) {
                        return (t.lineHeight * i.getRowLineCount(e));
                    };
                    this.getLength = function() {
                        return this.cells.length;
                    };
                    this.get = function(e) {
                        return this.cells[e];
                    };
                    this.shift = function() {
                        this.$cacheCell(this.cells.shift());
                    };
                    this.pop = function() {
                        this.$cacheCell(this.cells.pop());
                    };
                    this.push = function(e) {
                        if (Array.isArray(e)) {
                            this.cells.push.apply(this.cells, e);
                            var t = n.createFragment(this.element);
                            for(var i = 0; i < e.length; i++){
                                t.appendChild(e[i].element);
                            }
                            this.element.appendChild(t);
                        } else {
                            this.cells.push(e);
                            this.element.appendChild(e.element);
                        }
                    };
                    this.unshift = function(e) {
                        if (Array.isArray(e)) {
                            this.cells.unshift.apply(this.cells, e);
                            var t = n.createFragment(this.element);
                            for(var i = 0; i < e.length; i++){
                                t.appendChild(e[i].element);
                            }
                            if (this.element.firstChild) this.element.insertBefore(t, this.element.firstChild);
                            else this.element.appendChild(t);
                        } else {
                            this.cells.unshift(e);
                            this.element.insertAdjacentElement("afterbegin", e.element);
                        }
                    };
                    this.last = function() {
                        if (this.cells.length) return this.cells[this.cells.length - 1];
                        else return null;
                    };
                    this.$cacheCell = function(e) {
                        if (!e) return;
                        e.element.remove();
                        this.cellCache.push(e);
                    };
                    this.createCell = function(e, t, i, r) {
                        var s = this.cellCache.pop();
                        if (!s) {
                            var o = n.createElement("div");
                            if (r) r(o);
                            this.element.appendChild(o);
                            s = {
                                element: o,
                                text: "",
                                row: e
                            };
                        }
                        s.row = e;
                        return s;
                    };
                }.call(r.prototype));
                t.Lines = r;
            });
            ace.define("ace/layer/gutter", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/lib/event_emitter",
                "ace/layer/lines", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/dom");
                var r = e("../lib/oop");
                var s = e("../lib/lang");
                var o = e("../lib/event_emitter").EventEmitter;
                var a = e("./lines").Lines;
                var l = function(e) {
                    this.element = n.createElement("div");
                    this.element.className = "ace_layer ace_gutter-layer";
                    e.appendChild(this.element);
                    this.setShowFoldWidgets(this.$showFoldWidgets);
                    this.gutterWidth = 0;
                    this.$annotations = [];
                    this.$updateAnnotations = this.$updateAnnotations.bind(this);
                    this.$lines = new a(this.element);
                    this.$lines.$offsetCoefficient = 1;
                };
                (function() {
                    r.implement(this, o);
                    this.setSession = function(e) {
                        if (this.session) this.session.off("change", this.$updateAnnotations);
                        this.session = e;
                        if (e) e.on("change", this.$updateAnnotations);
                    };
                    this.addGutterDecoration = function(e, t) {
                        if (window.console) console.warn && console.warn("deprecated use session.addGutterDecoration");
                        this.session.addGutterDecoration(e, t);
                    };
                    this.removeGutterDecoration = function(e, t) {
                        if (window.console) console.warn && console.warn("deprecated use session.removeGutterDecoration");
                        this.session.removeGutterDecoration(e, t);
                    };
                    this.setAnnotations = function(e) {
                        this.$annotations = [];
                        for(var t = 0; t < e.length; t++){
                            var i = e[t];
                            var n = i.row;
                            var r = this.$annotations[n];
                            if (!r) r = this.$annotations[n] = {
                                text: []
                            };
                            var o = i.text;
                            o = o ? s.escapeHTML(o) : i.html || "";
                            if (r.text.indexOf(o) === -1) r.text.push(o);
                            var a = i.type;
                            if (a == "error") r.className = " ace_error";
                            else if (a == "warning" && r.className != " ace_error") r.className = " ace_warning";
                            else if (a == "info" && !r.className) r.className = " ace_info";
                        }
                    };
                    this.$updateAnnotations = function(e) {
                        if (!this.$annotations.length) return;
                        var t = e.start.row;
                        var i = e.end.row - t;
                        if (i === 0) {} else if (e.action == "remove") {
                            this.$annotations.splice(t, i + 1, null);
                        } else {
                            var n = new Array(i + 1);
                            n.unshift(t, 1);
                            this.$annotations.splice.apply(this.$annotations, n);
                        }
                    };
                    this.update = function(e) {
                        this.config = e;
                        var t = this.session;
                        var i = e.firstRow;
                        var n = Math.min(e.lastRow + e.gutterOffset, t.getLength() - 1);
                        this.oldLastRow = n;
                        this.config = e;
                        this.$lines.moveContainer(e);
                        this.$updateCursorRow();
                        var r = t.getNextFoldLine(i);
                        var s = r ? r.start.row : Infinity;
                        var o = null;
                        var a = -1;
                        var l = i;
                        while(true){
                            if (l > s) {
                                l = r.end.row + 1;
                                r = t.getNextFoldLine(l, r);
                                s = r ? r.start.row : Infinity;
                            }
                            if (l > n) {
                                while(this.$lines.getLength() > a + 1)this.$lines.pop();
                                break;
                            }
                            o = this.$lines.get(++a);
                            if (o) {
                                o.row = l;
                            } else {
                                o = this.$lines.createCell(l, e, this.session, h);
                                this.$lines.push(o);
                            }
                            this.$renderCell(o, e, r, l);
                            l++;
                        }
                        this._signal("afterRender");
                        this.$updateGutterWidth(e);
                    };
                    this.$updateGutterWidth = function(e) {
                        var t = this.session;
                        var i = t.gutterRenderer || this.$renderer;
                        var n = t.$firstLineNumber;
                        var r = this.$lines.last() ? this.$lines.last().text : "";
                        if (this.$fixedWidth || t.$useWrapMode) r = t.getLength() + n - 1;
                        var s = i ? i.getWidth(t, r, e) : r.toString().length * e.characterWidth;
                        var o = this.$padding || this.$computePadding();
                        s += o.left + o.right;
                        if (s !== this.gutterWidth && !isNaN(s)) {
                            this.gutterWidth = s;
                            this.element.parentNode.style.width = this.element.style.width = Math.ceil(this.gutterWidth) + "px";
                            this._signal("changeGutterWidth", s);
                        }
                    };
                    this.$updateCursorRow = function() {
                        if (!this.$highlightGutterLine) return;
                        var e = this.session.selection.getCursor();
                        if (this.$cursorRow === e.row) return;
                        this.$cursorRow = e.row;
                    };
                    this.updateLineHighlight = function() {
                        if (!this.$highlightGutterLine) return;
                        var e = this.session.selection.cursor.row;
                        this.$cursorRow = e;
                        if (this.$cursorCell && this.$cursorCell.row == e) return;
                        if (this.$cursorCell) this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
                        var t = this.$lines.cells;
                        this.$cursorCell = null;
                        for(var i = 0; i < t.length; i++){
                            var n = t[i];
                            if (n.row >= this.$cursorRow) {
                                if (n.row > this.$cursorRow) {
                                    var r = this.session.getFoldLine(this.$cursorRow);
                                    if (i > 0 && r && r.start.row == t[i - 1].row) n = t[i - 1];
                                    else break;
                                }
                                n.element.className = "ace_gutter-active-line " + n.element.className;
                                this.$cursorCell = n;
                                break;
                            }
                        }
                    };
                    this.scrollLines = function(e) {
                        var t = this.config;
                        this.config = e;
                        this.$updateCursorRow();
                        if (this.$lines.pageChanged(t, e)) return this.update(e);
                        this.$lines.moveContainer(e);
                        var i = Math.min(e.lastRow + e.gutterOffset, this.session.getLength() - 1);
                        var n = this.oldLastRow;
                        this.oldLastRow = i;
                        if (!t || n < e.firstRow) return this.update(e);
                        if (i < t.firstRow) return this.update(e);
                        if (t.firstRow < e.firstRow) for(var r = this.session.getFoldedRowCount(t.firstRow, e.firstRow - 1); r > 0; r--)this.$lines.shift();
                        if (n > i) for(var r = this.session.getFoldedRowCount(i + 1, n); r > 0; r--)this.$lines.pop();
                        if (e.firstRow < t.firstRow) {
                            this.$lines.unshift(this.$renderLines(e, e.firstRow, t.firstRow - 1));
                        }
                        if (i > n) {
                            this.$lines.push(this.$renderLines(e, n + 1, i));
                        }
                        this.updateLineHighlight();
                        this._signal("afterRender");
                        this.$updateGutterWidth(e);
                    };
                    this.$renderLines = function(e, t, i) {
                        var n = [];
                        var r = t;
                        var s = this.session.getNextFoldLine(r);
                        var o = s ? s.start.row : Infinity;
                        while(true){
                            if (r > o) {
                                r = s.end.row + 1;
                                s = this.session.getNextFoldLine(r, s);
                                o = s ? s.start.row : Infinity;
                            }
                            if (r > i) break;
                            var a = this.$lines.createCell(r, e, this.session, h);
                            this.$renderCell(a, e, s, r);
                            n.push(a);
                            r++;
                        }
                        return n;
                    };
                    this.$renderCell = function(e, t, i, r) {
                        var s = e.element;
                        var o = this.session;
                        var a = s.childNodes[0];
                        var l = s.childNodes[1];
                        var h = o.$firstLineNumber;
                        var c = o.$breakpoints;
                        var u = o.$decorations;
                        var d = o.gutterRenderer || this.$renderer;
                        var f = this.$showFoldWidgets && o.foldWidgets;
                        var g = i ? i.start.row : Number.MAX_VALUE;
                        var m = "ace_gutter-cell ";
                        if (this.$highlightGutterLine) {
                            if (r == this.$cursorRow || (i && r < this.$cursorRow && r >= g && this.$cursorRow <= i.end.row)) {
                                m += "ace_gutter-active-line ";
                                if (this.$cursorCell != e) {
                                    if (this.$cursorCell) this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
                                    this.$cursorCell = e;
                                }
                            }
                        }
                        if (c[r]) m += c[r];
                        if (u[r]) m += u[r];
                        if (this.$annotations[r]) m += this.$annotations[r].className;
                        if (s.className != m) s.className = m;
                        if (f) {
                            var v = f[r];
                            if (v == null) v = f[r] = o.getFoldWidget(r);
                        }
                        if (v) {
                            var m = "ace_fold-widget ace_" + v;
                            if (v == "start" && r == g && r < i.end.row) m += " ace_closed";
                            else m += " ace_open";
                            if (l.className != m) l.className = m;
                            var p = t.lineHeight + "px";
                            n.setStyle(l.style, "height", p);
                            n.setStyle(l.style, "display", "inline-block");
                        } else {
                            if (l) {
                                n.setStyle(l.style, "display", "none");
                            }
                        }
                        var w = (d ? d.getText(o, r) : r + h).toString();
                        if (w !== a.data) {
                            a.data = w;
                        }
                        n.setStyle(e.element.style, "height", this.$lines.computeLineHeight(r, t, o) + "px");
                        n.setStyle(e.element.style, "top", this.$lines.computeLineTop(r, t, o) + "px");
                        e.text = w;
                        return e;
                    };
                    this.$fixedWidth = false;
                    this.$highlightGutterLine = true;
                    this.$renderer = "";
                    this.setHighlightGutterLine = function(e) {
                        this.$highlightGutterLine = e;
                    };
                    this.$showLineNumbers = true;
                    this.$renderer = "";
                    this.setShowLineNumbers = function(e) {
                        this.$renderer = !e && {
                            getWidth: function() {
                                return 0;
                            },
                            getText: function() {
                                return "";
                            }
                        };
                    };
                    this.getShowLineNumbers = function() {
                        return this.$showLineNumbers;
                    };
                    this.$showFoldWidgets = true;
                    this.setShowFoldWidgets = function(e) {
                        if (e) n.addCssClass(this.element, "ace_folding-enabled");
                        else n.removeCssClass(this.element, "ace_folding-enabled");
                        this.$showFoldWidgets = e;
                        this.$padding = null;
                    };
                    this.getShowFoldWidgets = function() {
                        return this.$showFoldWidgets;
                    };
                    this.$computePadding = function() {
                        if (!this.element.firstChild) return {
                            left: 0,
                            right: 0
                        };
                        var e = n.computedStyle(this.element.firstChild);
                        this.$padding = {};
                        this.$padding.left = (parseInt(e.borderLeftWidth) || 0) + (parseInt(e.paddingLeft) || 0) + 1;
                        this.$padding.right = (parseInt(e.borderRightWidth) || 0) + (parseInt(e.paddingRight) || 0);
                        return this.$padding;
                    };
                    this.getRegion = function(e) {
                        var t = this.$padding || this.$computePadding();
                        var i = this.element.getBoundingClientRect();
                        if (e.x < t.left + i.left) return "markers";
                        if (this.$showFoldWidgets && e.x > i.right - t.right) return "foldWidgets";
                    };
                }.call(l.prototype));
                function h(e) {
                    var t = document.createTextNode("");
                    e.appendChild(t);
                    var i = n.createElement("span");
                    e.appendChild(i);
                    return e;
                }
                t.Gutter = l;
            });
            ace.define("ace/layer/marker", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                var n = e("../range").Range;
                var r = e("../lib/dom");
                var s = function(e) {
                    this.element = r.createElement("div");
                    this.element.className = "ace_layer ace_marker-layer";
                    e.appendChild(this.element);
                };
                (function() {
                    this.$padding = 0;
                    this.setPadding = function(e) {
                        this.$padding = e;
                    };
                    this.setSession = function(e) {
                        this.session = e;
                    };
                    this.setMarkers = function(e) {
                        this.markers = e;
                    };
                    this.elt = function(e, t) {
                        var i = this.i != -1 && this.element.childNodes[this.i];
                        if (!i) {
                            i = document.createElement("div");
                            this.element.appendChild(i);
                            this.i = -1;
                        } else {
                            this.i++;
                        }
                        i.style.cssText = t;
                        i.className = e;
                    };
                    this.update = function(e) {
                        if (!e) return;
                        this.config = e;
                        this.i = 0;
                        var t;
                        for(var i in this.markers){
                            var n = this.markers[i];
                            if (!n.range) {
                                n.update(t, this, this.session, e);
                                continue;
                            }
                            var r = n.range.clipRows(e.firstRow, e.lastRow);
                            if (r.isEmpty()) continue;
                            r = r.toScreenRange(this.session);
                            if (n.renderer) {
                                var s = this.$getTop(r.start.row, e);
                                var o = this.$padding + r.start.column * e.characterWidth;
                                n.renderer(t, r, o, s, e);
                            } else if (n.type == "fullLine") {
                                this.drawFullLineMarker(t, r, n.clazz, e);
                            } else if (n.type == "screenLine") {
                                this.drawScreenLineMarker(t, r, n.clazz, e);
                            } else if (r.isMultiLine()) {
                                if (n.type == "text") this.drawTextMarker(t, r, n.clazz, e);
                                else this.drawMultiLineMarker(t, r, n.clazz, e);
                            } else {
                                this.drawSingleLineMarker(t, r, n.clazz + " ace_start" + " ace_br15", e);
                            }
                        }
                        if (this.i != -1) {
                            while(this.i < this.element.childElementCount)this.element.removeChild(this.element.lastChild);
                        }
                    };
                    this.$getTop = function(e, t) {
                        return ((e - t.firstRowScreen) * t.lineHeight);
                    };
                    function e(e, t, i, n) {
                        return ((e ? 1 : 0) | (t ? 2 : 0) | (i ? 4 : 0) | (n ? 8 : 0));
                    }
                    this.drawTextMarker = function(t, i, r, s, o) {
                        var a = this.session;
                        var l = i.start.row;
                        var h = i.end.row;
                        var c = l;
                        var u = 0;
                        var d = 0;
                        var f = a.getScreenLastRowColumn(c);
                        var g = new n(c, i.start.column, c, d);
                        for(; c <= h; c++){
                            g.start.row = g.end.row = c;
                            g.start.column = c == l ? i.start.column : a.getRowWrapIndent(c);
                            g.end.column = f;
                            u = d;
                            d = f;
                            f = c + 1 < h ? a.getScreenLastRowColumn(c + 1) : c == h ? 0 : i.end.column;
                            this.drawSingleLineMarker(t, g, r + (c == l ? " ace_start" : "") + " ace_br" + e(c == l || (c == l + 1 && i.start.column), u < d, d > f, c == h), s, c == h ? 0 : 1, o);
                        }
                    };
                    this.drawMultiLineMarker = function(e, t, i, n, r) {
                        var s = this.$padding;
                        var o = n.lineHeight;
                        var a = this.$getTop(t.start.row, n);
                        var l = s + t.start.column * n.characterWidth;
                        r = r || "";
                        if (this.session.$bidiHandler.isBidiRow(t.start.row)) {
                            var h = t.clone();
                            h.end.row = h.start.row;
                            h.end.column = this.session.getLine(h.start.row).length;
                            this.drawBidiSingleLineMarker(e, h, i + " ace_br1 ace_start", n, null, r);
                        } else {
                            this.elt(i + " ace_br1 ace_start", "height:" + o + "px;" + "right:0;" + "top:" + a + "px;left:" + l + "px;" + (r || ""));
                        }
                        if (this.session.$bidiHandler.isBidiRow(t.end.row)) {
                            var h = t.clone();
                            h.start.row = h.end.row;
                            h.start.column = 0;
                            this.drawBidiSingleLineMarker(e, h, i + " ace_br12", n, null, r);
                        } else {
                            a = this.$getTop(t.end.row, n);
                            var c = t.end.column * n.characterWidth;
                            this.elt(i + " ace_br12", "height:" + o + "px;" + "width:" + c + "px;" + "top:" + a + "px;" + "left:" + s + "px;" + (r || ""));
                        }
                        o = (t.end.row - t.start.row - 1) * n.lineHeight;
                        if (o <= 0) return;
                        a = this.$getTop(t.start.row + 1, n);
                        var u = (t.start.column ? 1 : 0) | (t.end.column ? 0 : 8);
                        this.elt(i + (u ? " ace_br" + u : ""), "height:" + o + "px;" + "right:0;" + "top:" + a + "px;" + "left:" + s + "px;" + (r || ""));
                    };
                    this.drawSingleLineMarker = function(e, t, i, n, r, s) {
                        if (this.session.$bidiHandler.isBidiRow(t.start.row)) return this.drawBidiSingleLineMarker(e, t, i, n, r, s);
                        var o = n.lineHeight;
                        var a = (t.end.column + (r || 0) - t.start.column) * n.characterWidth;
                        var l = this.$getTop(t.start.row, n);
                        var h = this.$padding + t.start.column * n.characterWidth;
                        this.elt(i, "height:" + o + "px;" + "width:" + a + "px;" + "top:" + l + "px;" + "left:" + h + "px;" + (s || ""));
                    };
                    this.drawBidiSingleLineMarker = function(e, t, i, n, r, s) {
                        var o = n.lineHeight, a = this.$getTop(t.start.row, n), l = this.$padding;
                        var h = this.session.$bidiHandler.getSelections(t.start.column, t.end.column);
                        h.forEach(function(e) {
                            this.elt(i, "height:" + o + "px;" + "width:" + e.width + (r || 0) + "px;" + "top:" + a + "px;" + "left:" + (l + e.left) + "px;" + (s || ""));
                        }, this);
                    };
                    this.drawFullLineMarker = function(e, t, i, n, r) {
                        var s = this.$getTop(t.start.row, n);
                        var o = n.lineHeight;
                        if (t.start.row != t.end.row) o += this.$getTop(t.end.row, n) - s;
                        this.elt(i, "height:" + o + "px;" + "top:" + s + "px;" + "left:0;right:0;" + (r || ""));
                    };
                    this.drawScreenLineMarker = function(e, t, i, n, r) {
                        var s = this.$getTop(t.start.row, n);
                        var o = n.lineHeight;
                        this.elt(i, "height:" + o + "px;" + "top:" + s + "px;" + "left:0;right:0;" + (r || ""));
                    };
                }.call(s.prototype));
                t.Marker = s;
            });
            ace.define("ace/layer/text", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/lang",
                "ace/layer/lines",
                "ace/lib/event_emitter", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/oop");
                var r = e("../lib/dom");
                var s = e("../lib/lang");
                var o = e("./lines").Lines;
                var a = e("../lib/event_emitter").EventEmitter;
                var l = function(e) {
                    this.dom = r;
                    this.element = this.dom.createElement("div");
                    this.element.className = "ace_layer ace_text-layer";
                    e.appendChild(this.element);
                    this.$updateEolChar = this.$updateEolChar.bind(this);
                    this.$lines = new o(this.element);
                };
                (function() {
                    n.implement(this, a);
                    this.EOF_CHAR = "\xB6";
                    this.EOL_CHAR_LF = "\xAC";
                    this.EOL_CHAR_CRLF = "\xa4";
                    this.EOL_CHAR = this.EOL_CHAR_LF;
                    this.TAB_CHAR = "\u2014";
                    this.SPACE_CHAR = "\xB7";
                    this.$padding = 0;
                    this.MAX_LINE_LENGTH = 10000;
                    this.$updateEolChar = function() {
                        var e = this.session.doc;
                        var t = e.getNewLineCharacter() == "\n" && e.getNewLineMode() != "windows";
                        var i = t ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
                        if (this.EOL_CHAR != i) {
                            this.EOL_CHAR = i;
                            return true;
                        }
                    };
                    this.setPadding = function(e) {
                        this.$padding = e;
                        this.element.style.margin = "0 " + e + "px";
                    };
                    this.getLineHeight = function() {
                        return this.$fontMetrics.$characterSize.height || 0;
                    };
                    this.getCharacterWidth = function() {
                        return this.$fontMetrics.$characterSize.width || 0;
                    };
                    this.$setFontMetrics = function(e) {
                        this.$fontMetrics = e;
                        this.$fontMetrics.on("changeCharacterSize", function(e) {
                            this._signal("changeCharacterSize", e);
                        }.bind(this));
                        this.$pollSizeChanges();
                    };
                    this.checkForSizeChanges = function() {
                        this.$fontMetrics.checkForSizeChanges();
                    };
                    this.$pollSizeChanges = function() {
                        return (this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges());
                    };
                    this.setSession = function(e) {
                        this.session = e;
                        if (e) this.$computeTabString();
                    };
                    this.showInvisibles = false;
                    this.showSpaces = false;
                    this.showTabs = false;
                    this.showEOL = false;
                    this.setShowInvisibles = function(e) {
                        if (this.showInvisibles == e) return false;
                        this.showInvisibles = e;
                        if (typeof e == "string") {
                            this.showSpaces = /tab/i.test(e);
                            this.showTabs = /space/i.test(e);
                            this.showEOL = /eol/i.test(e);
                        } else {
                            this.showSpaces = this.showTabs = this.showEOL = e;
                        }
                        this.$computeTabString();
                        return true;
                    };
                    this.displayIndentGuides = true;
                    this.setDisplayIndentGuides = function(e) {
                        if (this.displayIndentGuides == e) return false;
                        this.displayIndentGuides = e;
                        this.$computeTabString();
                        return true;
                    };
                    this.$tabStrings = [];
                    this.onChangeTabSize = this.$computeTabString = function() {
                        var e = this.session.getTabSize();
                        this.tabSize = e;
                        var t = (this.$tabStrings = [
                            0
                        ]);
                        for(var i = 1; i < e + 1; i++){
                            if (this.showTabs) {
                                var n = this.dom.createElement("span");
                                n.className = "ace_invisible ace_invisible_tab";
                                n.textContent = s.stringRepeat(this.TAB_CHAR, i);
                                t.push(n);
                            } else {
                                t.push(this.dom.createTextNode(s.stringRepeat(" ", i), this.element));
                            }
                        }
                        if (this.displayIndentGuides) {
                            this.$indentGuideRe = /\s\S| \t|\t |\s$/;
                            var r = "ace_indent-guide";
                            var o = this.showSpaces ? " ace_invisible ace_invisible_space" : "";
                            var a = this.showSpaces ? s.stringRepeat(this.SPACE_CHAR, this.tabSize) : s.stringRepeat(" ", this.tabSize);
                            var l = this.showTabs ? " ace_invisible ace_invisible_tab" : "";
                            var h = this.showTabs ? s.stringRepeat(this.TAB_CHAR, this.tabSize) : a;
                            var n = this.dom.createElement("span");
                            n.className = r + o;
                            n.textContent = a;
                            this.$tabStrings[" "] = n;
                            var n = this.dom.createElement("span");
                            n.className = r + l;
                            n.textContent = h;
                            this.$tabStrings["\t"] = n;
                        }
                    };
                    this.updateLines = function(e, t, i) {
                        if (this.config.lastRow != e.lastRow || this.config.firstRow != e.firstRow) {
                            return this.update(e);
                        }
                        this.config = e;
                        var n = Math.max(t, e.firstRow);
                        var r = Math.min(i, e.lastRow);
                        var s = this.element.childNodes;
                        var o = 0;
                        for(var a = e.firstRow; a < n; a++){
                            var l = this.session.getFoldLine(a);
                            if (l) {
                                if (l.containsRow(n)) {
                                    n = l.start.row;
                                    break;
                                } else {
                                    a = l.end.row;
                                }
                            }
                            o++;
                        }
                        var h = false;
                        var a = n;
                        var l = this.session.getNextFoldLine(a);
                        var c = l ? l.start.row : Infinity;
                        while(true){
                            if (a > c) {
                                a = l.end.row + 1;
                                l = this.session.getNextFoldLine(a, l);
                                c = l ? l.start.row : Infinity;
                            }
                            if (a > r) break;
                            var u = s[o++];
                            if (u) {
                                this.dom.removeChildren(u);
                                this.$renderLine(u, a, a == c ? l : false);
                                if (h) u.style.top = this.$lines.computeLineTop(a, e, this.session) + "px";
                                var d = e.lineHeight * this.session.getRowLength(a) + "px";
                                if (u.style.height != d) {
                                    h = true;
                                    u.style.height = d;
                                }
                            }
                            a++;
                        }
                        if (h) {
                            while(o < this.$lines.cells.length){
                                var f = this.$lines.cells[o++];
                                f.element.style.top = this.$lines.computeLineTop(f.row, e, this.session) + "px";
                            }
                        }
                    };
                    this.scrollLines = function(e) {
                        var t = this.config;
                        this.config = e;
                        if (this.$lines.pageChanged(t, e)) return this.update(e);
                        this.$lines.moveContainer(e);
                        var i = e.lastRow;
                        var n = t ? t.lastRow : -1;
                        if (!t || n < e.firstRow) return this.update(e);
                        if (i < t.firstRow) return this.update(e);
                        if (!t || t.lastRow < e.firstRow) return this.update(e);
                        if (e.lastRow < t.firstRow) return this.update(e);
                        if (t.firstRow < e.firstRow) for(var r = this.session.getFoldedRowCount(t.firstRow, e.firstRow - 1); r > 0; r--)this.$lines.shift();
                        if (t.lastRow > e.lastRow) for(var r = this.session.getFoldedRowCount(e.lastRow + 1, t.lastRow); r > 0; r--)this.$lines.pop();
                        if (e.firstRow < t.firstRow) {
                            this.$lines.unshift(this.$renderLinesFragment(e, e.firstRow, t.firstRow - 1));
                        }
                        if (e.lastRow > t.lastRow) {
                            this.$lines.push(this.$renderLinesFragment(e, t.lastRow + 1, e.lastRow));
                        }
                    };
                    this.$renderLinesFragment = function(e, t, i) {
                        var n = [];
                        var s = t;
                        var o = this.session.getNextFoldLine(s);
                        var a = o ? o.start.row : Infinity;
                        while(true){
                            if (s > a) {
                                s = o.end.row + 1;
                                o = this.session.getNextFoldLine(s, o);
                                a = o ? o.start.row : Infinity;
                            }
                            if (s > i) break;
                            var l = this.$lines.createCell(s, e, this.session);
                            var h = l.element;
                            this.dom.removeChildren(h);
                            r.setStyle(h.style, "height", this.$lines.computeLineHeight(s, e, this.session) + "px");
                            r.setStyle(h.style, "top", this.$lines.computeLineTop(s, e, this.session) + "px");
                            this.$renderLine(h, s, s == a ? o : false);
                            if (this.$useLineGroups()) {
                                h.className = "ace_line_group";
                            } else {
                                h.className = "ace_line";
                            }
                            n.push(l);
                            s++;
                        }
                        return n;
                    };
                    this.update = function(e) {
                        this.$lines.moveContainer(e);
                        this.config = e;
                        var t = e.firstRow;
                        var i = e.lastRow;
                        var n = this.$lines;
                        while(n.getLength())n.pop();
                        n.push(this.$renderLinesFragment(e, t, i));
                    };
                    this.$textToken = {
                        text: true,
                        rparen: true,
                        lparen: true
                    };
                    this.$renderToken = function(e, t, i, n) {
                        var r = this;
                        var o = /(\t)|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\uFEFF\uFFF9-\uFFFC]+)|(\u3000)|([\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g;
                        var a = this.dom.createFragment(this.element);
                        var l;
                        var h = 0;
                        while((l = o.exec(n))){
                            var c = l[1];
                            var u = l[2];
                            var d = l[3];
                            var f = l[4];
                            var g = l[5];
                            if (!r.showSpaces && u) continue;
                            var m = h != l.index ? n.slice(h, l.index) : "";
                            h = l.index + l[0].length;
                            if (m) {
                                a.appendChild(this.dom.createTextNode(m, this.element));
                            }
                            if (c) {
                                var v = r.session.getScreenTabSize(t + l.index);
                                a.appendChild(r.$tabStrings[v].cloneNode(true));
                                t += v - 1;
                            } else if (u) {
                                if (r.showSpaces) {
                                    var p = this.dom.createElement("span");
                                    p.className = "ace_invisible ace_invisible_space";
                                    p.textContent = s.stringRepeat(r.SPACE_CHAR, u.length);
                                    a.appendChild(p);
                                } else {
                                    a.appendChild(this.com.createTextNode(u, this.element));
                                }
                            } else if (d) {
                                var p = this.dom.createElement("span");
                                p.className = "ace_invisible ace_invisible_space ace_invalid";
                                p.textContent = s.stringRepeat(r.SPACE_CHAR, d.length);
                                a.appendChild(p);
                            } else if (f) {
                                t += 1;
                                var p = this.dom.createElement("span");
                                p.style.width = r.config.characterWidth * 2 + "px";
                                p.className = r.showSpaces ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                                p.textContent = r.showSpaces ? r.SPACE_CHAR : f;
                                a.appendChild(p);
                            } else if (g) {
                                t += 1;
                                var p = this.dom.createElement("span");
                                p.style.width = r.config.characterWidth * 2 + "px";
                                p.className = "ace_cjk";
                                p.textContent = g;
                                a.appendChild(p);
                            }
                        }
                        a.appendChild(this.dom.createTextNode(h ? n.slice(h) : n, this.element));
                        if (!this.$textToken[i.type]) {
                            var w = "ace_" + i.type.replace(/\./g, " ace_");
                            var p = this.dom.createElement("span");
                            if (i.type == "fold") p.style.width = i.value.length * this.config.characterWidth + "px";
                            p.className = w;
                            p.appendChild(a);
                            e.appendChild(p);
                        } else {
                            e.appendChild(a);
                        }
                        return t + n.length;
                    };
                    this.renderIndentGuide = function(e, t, i) {
                        var n = t.search(this.$indentGuideRe);
                        if (n <= 0 || n >= i) return t;
                        if (t[0] == " ") {
                            n -= n % this.tabSize;
                            var r = n / this.tabSize;
                            for(var s = 0; s < r; s++){
                                e.appendChild(this.$tabStrings[" "].cloneNode(true));
                            }
                            return t.substr(n);
                        } else if (t[0] == "\t") {
                            for(var s = 0; s < n; s++){
                                e.appendChild(this.$tabStrings["\t"].cloneNode(true));
                            }
                            return t.substr(n);
                        }
                        return t;
                    };
                    this.$createLineElement = function(e) {
                        var t = this.dom.createElement("div");
                        t.className = "ace_line";
                        t.style.height = this.config.lineHeight + "px";
                        return t;
                    };
                    this.$renderWrappedLine = function(e, t, i) {
                        var n = 0;
                        var r = 0;
                        var o = i[0];
                        var a = 0;
                        var l = this.$createLineElement();
                        e.appendChild(l);
                        for(var h = 0; h < t.length; h++){
                            var c = t[h];
                            var u = c.value;
                            if (h == 0 && this.displayIndentGuides) {
                                n = u.length;
                                u = this.renderIndentGuide(l, u, o);
                                if (!u) continue;
                                n -= u.length;
                            }
                            if (n + u.length < o) {
                                a = this.$renderToken(l, a, c, u);
                                n += u.length;
                            } else {
                                while(n + u.length >= o){
                                    a = this.$renderToken(l, a, c, u.substring(0, o - n));
                                    u = u.substring(o - n);
                                    n = o;
                                    l = this.$createLineElement();
                                    e.appendChild(l);
                                    l.appendChild(this.dom.createTextNode(s.stringRepeat("\xa0", i.indent), this.element));
                                    r++;
                                    a = 0;
                                    o = i[r] || Number.MAX_VALUE;
                                }
                                if (u.length != 0) {
                                    n += u.length;
                                    a = this.$renderToken(l, a, c, u);
                                }
                            }
                        }
                        if (i[i.length - 1] > this.MAX_LINE_LENGTH) this.$renderOverflowMessage(l, a, null, "", true);
                    };
                    this.$renderSimpleLine = function(e, t) {
                        var i = 0;
                        var n = t[0];
                        var r = n.value;
                        if (this.displayIndentGuides) r = this.renderIndentGuide(e, r);
                        if (r) i = this.$renderToken(e, i, n, r);
                        for(var s = 1; s < t.length; s++){
                            n = t[s];
                            r = n.value;
                            if (i + r.length > this.MAX_LINE_LENGTH) return this.$renderOverflowMessage(e, i, n, r);
                            i = this.$renderToken(e, i, n, r);
                        }
                    };
                    this.$renderOverflowMessage = function(e, t, i, n, r) {
                        i && this.$renderToken(e, t, i, n.slice(0, this.MAX_LINE_LENGTH - t));
                        var s = this.dom.createElement("span");
                        s.className = "ace_inline_button ace_keyword ace_toggle_wrap";
                        s.textContent = r ? "<hide>" : "<click to see more...>";
                        e.appendChild(s);
                    };
                    this.$renderLine = function(e, t, i) {
                        if (!i && i != false) i = this.session.getFoldLine(t);
                        if (i) var n = this.$getFoldLineTokens(t, i);
                        else var n = this.session.getTokens(t);
                        var r = e;
                        if (n.length) {
                            var s = this.session.getRowSplitData(t);
                            if (s && s.length) {
                                this.$renderWrappedLine(e, n, s);
                                var r = e.lastChild;
                            } else {
                                var r = e;
                                if (this.$useLineGroups()) {
                                    r = this.$createLineElement();
                                    e.appendChild(r);
                                }
                                this.$renderSimpleLine(r, n);
                            }
                        } else if (this.$useLineGroups()) {
                            r = this.$createLineElement();
                            e.appendChild(r);
                        }
                        if (this.showEOL && r) {
                            if (i) t = i.end.row;
                            var o = this.dom.createElement("span");
                            o.className = "ace_invisible ace_invisible_eol";
                            o.textContent = t == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR;
                            r.appendChild(o);
                        }
                    };
                    this.$getFoldLineTokens = function(e, t) {
                        var i = this.session;
                        var n = [];
                        function r(e, t, i) {
                            var r = 0, s = 0;
                            while(s + e[r].value.length < t){
                                s += e[r].value.length;
                                r++;
                                if (r == e.length) return;
                            }
                            if (s != t) {
                                var o = e[r].value.substring(t - s);
                                if (o.length > i - t) o = o.substring(0, i - t);
                                n.push({
                                    type: e[r].type,
                                    value: o
                                });
                                s = t + o.length;
                                r += 1;
                            }
                            while(s < i && r < e.length){
                                var o = e[r].value;
                                if (o.length + s > i) {
                                    n.push({
                                        type: e[r].type,
                                        value: o.substring(0, i - s)
                                    });
                                } else n.push(e[r]);
                                s += o.length;
                                r += 1;
                            }
                        }
                        var s = i.getTokens(e);
                        t.walk(function(e, t, o, a, l) {
                            if (e != null) {
                                n.push({
                                    type: "fold",
                                    value: e
                                });
                            } else {
                                if (l) s = i.getTokens(t);
                                if (s.length) r(s, a, o);
                            }
                        }, t.end.row, this.session.getLine(t.end.row).length);
                        return n;
                    };
                    this.$useLineGroups = function() {
                        return this.session.getUseWrapMode();
                    };
                    this.destroy = function() {};
                }.call(l.prototype));
                t.Text = l;
            });
            ace.define("ace/layer/cursor", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/dom");
                var r = function(e) {
                    this.element = n.createElement("div");
                    this.element.className = "ace_layer ace_cursor-layer";
                    e.appendChild(this.element);
                    this.isVisible = false;
                    this.isBlinking = true;
                    this.blinkInterval = 1000;
                    this.smoothBlinking = false;
                    this.cursors = [];
                    this.cursor = this.addCursor();
                    n.addCssClass(this.element, "ace_hidden-cursors");
                    this.$updateCursors = this.$updateOpacity.bind(this);
                };
                (function() {
                    this.$updateOpacity = function(e) {
                        var t = this.cursors;
                        for(var i = t.length; i--;)n.setStyle(t[i].style, "opacity", e ? "" : "0");
                    };
                    this.$startCssAnimation = function() {
                        var e = this.cursors;
                        for(var t = e.length; t--;)e[t].style.animationDuration = this.blinkInterval + "ms";
                        this.$isAnimating = true;
                        setTimeout(function() {
                            if (this.$isAnimating) {
                                n.addCssClass(this.element, "ace_animate-blinking");
                            }
                        }.bind(this));
                    };
                    this.$stopCssAnimation = function() {
                        this.$isAnimating = false;
                        n.removeCssClass(this.element, "ace_animate-blinking");
                    };
                    this.$padding = 0;
                    this.setPadding = function(e) {
                        this.$padding = e;
                    };
                    this.setSession = function(e) {
                        this.session = e;
                    };
                    this.setBlinking = function(e) {
                        if (e != this.isBlinking) {
                            this.isBlinking = e;
                            this.restartTimer();
                        }
                    };
                    this.setBlinkInterval = function(e) {
                        if (e != this.blinkInterval) {
                            this.blinkInterval = e;
                            this.restartTimer();
                        }
                    };
                    this.setSmoothBlinking = function(e) {
                        if (e != this.smoothBlinking) {
                            this.smoothBlinking = e;
                            n.setCssClass(this.element, "ace_smooth-blinking", e);
                            this.$updateCursors(true);
                            this.restartTimer();
                        }
                    };
                    this.addCursor = function() {
                        var e = n.createElement("div");
                        e.className = "ace_cursor";
                        this.element.appendChild(e);
                        this.cursors.push(e);
                        return e;
                    };
                    this.removeCursor = function() {
                        if (this.cursors.length > 1) {
                            var e = this.cursors.pop();
                            e.parentNode.removeChild(e);
                            return e;
                        }
                    };
                    this.hideCursor = function() {
                        this.isVisible = false;
                        n.addCssClass(this.element, "ace_hidden-cursors");
                        this.restartTimer();
                    };
                    this.showCursor = function() {
                        this.isVisible = true;
                        n.removeCssClass(this.element, "ace_hidden-cursors");
                        this.restartTimer();
                    };
                    this.restartTimer = function() {
                        var e = this.$updateCursors;
                        clearInterval(this.intervalId);
                        clearTimeout(this.timeoutId);
                        this.$stopCssAnimation();
                        if (this.smoothBlinking) {
                            this.$isSmoothBlinking = false;
                            n.removeCssClass(this.element, "ace_smooth-blinking");
                        }
                        e(true);
                        if (!this.isBlinking || !this.blinkInterval || !this.isVisible) {
                            this.$stopCssAnimation();
                            return;
                        }
                        if (this.smoothBlinking) {
                            this.$isSmoothBlinking = true;
                            setTimeout(function() {
                                if (this.$isSmoothBlinking) {
                                    n.addCssClass(this.element, "ace_smooth-blinking");
                                }
                            }.bind(this));
                        }
                        if (n.HAS_CSS_ANIMATION) {
                            this.$startCssAnimation();
                        } else {
                            var t = function() {
                                this.timeoutId = setTimeout(function() {
                                    e(false);
                                }, 0.6 * this.blinkInterval);
                            }.bind(this);
                            this.intervalId = setInterval(function() {
                                e(true);
                                t();
                            }, this.blinkInterval);
                            t();
                        }
                    };
                    this.getPixelPosition = function(e, t) {
                        if (!this.config || !this.session) return {
                            left: 0,
                            top: 0
                        };
                        if (!e) e = this.session.selection.getCursor();
                        var i = this.session.documentToScreenPosition(e);
                        var n = this.$padding + (this.session.$bidiHandler.isBidiRow(i.row, e.row) ? this.session.$bidiHandler.getPosLeft(i.column) : i.column * this.config.characterWidth);
                        var r = (i.row - (t ? this.config.firstRowScreen : 0)) * this.config.lineHeight;
                        return {
                            left: n,
                            top: r
                        };
                    };
                    this.isCursorInView = function(e, t) {
                        return (e.top >= 0 && e.top < t.maxHeight);
                    };
                    this.update = function(e) {
                        this.config = e;
                        var t = this.session.$selectionMarkers;
                        var i = 0, r = 0;
                        if (t === undefined || t.length === 0) {
                            t = [
                                {
                                    cursor: null
                                }
                            ];
                        }
                        for(var i = 0, s = t.length; i < s; i++){
                            var o = this.getPixelPosition(t[i].cursor, true);
                            if ((o.top > e.height + e.offset || o.top < 0) && i > 1) {
                                continue;
                            }
                            var a = this.cursors[r++] || this.addCursor();
                            var l = a.style;
                            if (!this.drawCursor) {
                                if (!this.isCursorInView(o, e)) {
                                    n.setStyle(l, "display", "none");
                                } else {
                                    n.setStyle(l, "display", "block");
                                    n.translate(a, o.left, o.top);
                                    n.setStyle(l, "width", Math.round(e.characterWidth) + "px");
                                    n.setStyle(l, "height", e.lineHeight + "px");
                                }
                            } else {
                                this.drawCursor(a, o, e, t[i], this.session);
                            }
                        }
                        while(this.cursors.length > r)this.removeCursor();
                        var h = this.session.getOverwrite();
                        this.$setOverwrite(h);
                        this.$pixelPos = o;
                        this.restartTimer();
                    };
                    this.drawCursor = null;
                    this.$setOverwrite = function(e) {
                        if (e != this.overwrite) {
                            this.overwrite = e;
                            if (e) n.addCssClass(this.element, "ace_overwrite-cursors");
                            else n.removeCssClass(this.element, "ace_overwrite-cursors");
                        }
                    };
                    this.destroy = function() {
                        clearInterval(this.intervalId);
                        clearTimeout(this.timeoutId);
                    };
                }.call(r.prototype));
                t.Cursor = r;
            });
            ace.define("ace/scrollbar", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/event_emitter", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./lib/dom");
                var s = e("./lib/event");
                var o = e("./lib/event_emitter").EventEmitter;
                var a = 0x8000;
                var l = function(e) {
                    this.element = r.createElement("div");
                    this.element.className = "ace_scrollbar ace_scrollbar" + this.classSuffix;
                    this.inner = r.createElement("div");
                    this.inner.className = "ace_scrollbar-inner";
                    this.inner.textContent = "\xa0";
                    this.element.appendChild(this.inner);
                    e.appendChild(this.element);
                    this.setVisible(false);
                    this.skipEvent = false;
                    s.addListener(this.element, "scroll", this.onScroll.bind(this));
                    s.addListener(this.element, "mousedown", s.preventDefault);
                };
                (function() {
                    n.implement(this, o);
                    this.setVisible = function(e) {
                        this.element.style.display = e ? "" : "none";
                        this.isVisible = e;
                        this.coeff = 1;
                    };
                }.call(l.prototype));
                var h = function(e, t) {
                    l.call(this, e);
                    this.scrollTop = 0;
                    this.scrollHeight = 0;
                    t.$scrollbarWidth = this.width = r.scrollbarWidth(e.ownerDocument);
                    this.inner.style.width = this.element.style.width = (this.width || 15) + 5 + "px";
                    this.$minWidth = 0;
                };
                n.inherits(h, l);
                (function() {
                    this.classSuffix = "-v";
                    this.onScroll = function() {
                        if (!this.skipEvent) {
                            this.scrollTop = this.element.scrollTop;
                            if (this.coeff != 1) {
                                var e = this.element.clientHeight / this.scrollHeight;
                                this.scrollTop = (this.scrollTop * (1 - e)) / (this.coeff - e);
                            }
                            this._emit("scroll", {
                                data: this.scrollTop
                            });
                        }
                        this.skipEvent = false;
                    };
                    this.getWidth = function() {
                        return Math.max(this.isVisible ? this.width : 0, this.$minWidth || 0);
                    };
                    this.setHeight = function(e) {
                        this.element.style.height = e + "px";
                    };
                    this.setInnerHeight = this.setScrollHeight = function(e) {
                        this.scrollHeight = e;
                        if (e > a) {
                            this.coeff = a / e;
                            e = a;
                        } else if (this.coeff != 1) {
                            this.coeff = 1;
                        }
                        this.inner.style.height = e + "px";
                    };
                    this.setScrollTop = function(e) {
                        if (this.scrollTop != e) {
                            this.skipEvent = true;
                            this.scrollTop = e;
                            this.element.scrollTop = e * this.coeff;
                        }
                    };
                }.call(h.prototype));
                var c = function(e, t) {
                    l.call(this, e);
                    this.scrollLeft = 0;
                    this.height = t.$scrollbarWidth;
                    this.inner.style.height = this.element.style.height = (this.height || 15) + 5 + "px";
                };
                n.inherits(c, l);
                (function() {
                    this.classSuffix = "-h";
                    this.onScroll = function() {
                        if (!this.skipEvent) {
                            this.scrollLeft = this.element.scrollLeft;
                            this._emit("scroll", {
                                data: this.scrollLeft
                            });
                        }
                        this.skipEvent = false;
                    };
                    this.getHeight = function() {
                        return this.isVisible ? this.height : 0;
                    };
                    this.setWidth = function(e) {
                        this.element.style.width = e + "px";
                    };
                    this.setInnerWidth = function(e) {
                        this.inner.style.width = e + "px";
                    };
                    this.setScrollWidth = function(e) {
                        this.inner.style.width = e + "px";
                    };
                    this.setScrollLeft = function(e) {
                        if (this.scrollLeft != e) {
                            this.skipEvent = true;
                            this.scrollLeft = this.element.scrollLeft = e;
                        }
                    };
                }.call(c.prototype));
                t.ScrollBar = h;
                t.ScrollBarV = h;
                t.ScrollBarH = c;
                t.VScrollBar = h;
                t.HScrollBar = c;
            });
            ace.define("ace/renderloop", [
                "require",
                "exports",
                "module",
                "ace/lib/event"
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/event");
                var r = function(e, t) {
                    this.onRender = e;
                    this.pending = false;
                    this.changes = 0;
                    this.$recursionLimit = 2;
                    this.window = t || window;
                    var i = this;
                    this._flush = function(e) {
                        i.pending = false;
                        var t = i.changes;
                        if (t) {
                            n.blockIdle(100);
                            i.changes = 0;
                            i.onRender(t);
                        }
                        if (i.changes) {
                            if (i.$recursionLimit-- < 0) return;
                            i.schedule();
                        } else {
                            i.$recursionLimit = 2;
                        }
                    };
                };
                (function() {
                    this.schedule = function(e) {
                        this.changes = this.changes | e;
                        if (this.changes && !this.pending) {
                            n.nextFrame(this._flush);
                            this.pending = true;
                        }
                    };
                    this.clear = function(e) {
                        var t = this.changes;
                        this.changes = 0;
                        return t;
                    };
                }.call(r.prototype));
                t.RenderLoop = r;
            });
            ace.define("ace/layer/font_metrics", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/lang",
                "ace/lib/event",
                "ace/lib/useragent",
                "ace/lib/event_emitter", 
            ], function(e, t, i) {
                var n = e("../lib/oop");
                var r = e("../lib/dom");
                var s = e("../lib/lang");
                var o = e("../lib/event");
                var a = e("../lib/useragent");
                var l = e("../lib/event_emitter").EventEmitter;
                var h = 256;
                var c = typeof ResizeObserver == "function";
                var u = 200;
                var d = (t.FontMetrics = function(e) {
                    this.el = r.createElement("div");
                    this.$setMeasureNodeStyles(this.el.style, true);
                    this.$main = r.createElement("div");
                    this.$setMeasureNodeStyles(this.$main.style);
                    this.$measureNode = r.createElement("div");
                    this.$setMeasureNodeStyles(this.$measureNode.style);
                    this.el.appendChild(this.$main);
                    this.el.appendChild(this.$measureNode);
                    e.appendChild(this.el);
                    this.$measureNode.textContent = s.stringRepeat("X", h);
                    this.$characterSize = {
                        width: 0,
                        height: 0
                    };
                    if (c) this.$addObserver();
                    else this.checkForSizeChanges();
                });
                (function() {
                    n.implement(this, l);
                    this.$characterSize = {
                        width: 0,
                        height: 0
                    };
                    this.$setMeasureNodeStyles = function(e, t) {
                        e.width = e.height = "auto";
                        e.left = e.top = "0px";
                        e.visibility = "hidden";
                        e.position = "absolute";
                        e.whiteSpace = "pre";
                        if (a.isIE < 8) {
                            e["font-family"] = "inherit";
                        } else {
                            e.font = "inherit";
                        }
                        e.overflow = t ? "hidden" : "visible";
                    };
                    this.checkForSizeChanges = function(e) {
                        if (e === undefined) e = this.$measureSizes();
                        if (e && (this.$characterSize.width !== e.width || this.$characterSize.height !== e.height)) {
                            this.$measureNode.style.fontWeight = "bold";
                            var t = this.$measureSizes();
                            this.$measureNode.style.fontWeight = "";
                            this.$characterSize = e;
                            this.charSizes = Object.create(null);
                            this.allowBoldFonts = t && t.width === e.width && t.height === e.height;
                            this._emit("changeCharacterSize", {
                                data: e
                            });
                        }
                    };
                    this.$addObserver = function() {
                        var e = this;
                        this.$observer = new window.ResizeObserver(function(t) {
                            e.checkForSizeChanges();
                        });
                        this.$observer.observe(this.$measureNode);
                    };
                    this.$pollSizeChanges = function() {
                        if (this.$pollSizeChangesTimer || this.$observer) return this.$pollSizeChangesTimer;
                        var e = this;
                        return (this.$pollSizeChangesTimer = o.onIdle(function t() {
                            e.checkForSizeChanges();
                            o.onIdle(t, 500);
                        }, 500));
                    };
                    this.setPolling = function(e) {
                        if (e) {
                            this.$pollSizeChanges();
                        } else if (this.$pollSizeChangesTimer) {
                            clearInterval(this.$pollSizeChangesTimer);
                            this.$pollSizeChangesTimer = 0;
                        }
                    };
                    this.$measureSizes = function(e) {
                        var t = {
                            height: (e || this.$measureNode).clientHeight,
                            width: (e || this.$measureNode).clientWidth / h
                        };
                        if (t.width === 0 || t.height === 0) return null;
                        return t;
                    };
                    this.$measureCharWidth = function(e) {
                        this.$main.textContent = s.stringRepeat(e, h);
                        var t = this.$main.getBoundingClientRect();
                        return t.width / h;
                    };
                    this.getCharacterWidth = function(e) {
                        var t = this.charSizes[e];
                        if (t === undefined) {
                            t = this.charSizes[e] = this.$measureCharWidth(e) / this.$characterSize.width;
                        }
                        return t;
                    };
                    this.destroy = function() {
                        clearInterval(this.$pollSizeChangesTimer);
                        if (this.$observer) this.$observer.disconnect();
                        if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
                    };
                    this.$getZoom = function e(t) {
                        if (!t || !t.parentElement) return 1;
                        return ((window.getComputedStyle(t).zoom || 1) * e(t.parentElement));
                    };
                    this.$initTransformMeasureNodes = function() {
                        var e = function(e, t) {
                            return [
                                "div",
                                {
                                    style: "position: absolute;top:" + e + "px;left:" + t + "px;"
                                }, 
                            ];
                        };
                        this.els = r.buildDom([
                            e(0, 0),
                            e(u, 0),
                            e(0, u),
                            e(u, u)
                        ], this.el);
                    };
                    this.transformCoordinates = function(e, t) {
                        if (e) {
                            var i = this.$getZoom(this.el);
                            e = o(1 / i, e);
                        }
                        function n(e, t, i) {
                            var n = e[1] * t[0] - e[0] * t[1];
                            return [
                                (-t[1] * i[0] + t[0] * i[1]) / n,
                                (+e[1] * i[0] - e[0] * i[1]) / n, 
                            ];
                        }
                        function r(e, t) {
                            return [
                                e[0] - t[0],
                                e[1] - t[1]
                            ];
                        }
                        function s(e, t) {
                            return [
                                e[0] + t[0],
                                e[1] + t[1]
                            ];
                        }
                        function o(e, t) {
                            return [
                                e * t[0],
                                e * t[1]
                            ];
                        }
                        if (!this.els) this.$initTransformMeasureNodes();
                        function a(e) {
                            var t = e.getBoundingClientRect();
                            return [
                                t.left,
                                t.top
                            ];
                        }
                        var l = a(this.els[0]);
                        var h = a(this.els[1]);
                        var c = a(this.els[2]);
                        var d = a(this.els[3]);
                        var f = n(r(d, h), r(d, c), r(s(h, c), s(d, l)));
                        var g = o(1 + f[0], r(h, l));
                        var m = o(1 + f[1], r(c, l));
                        if (t) {
                            var v = t;
                            var p = (f[0] * v[0]) / u + (f[1] * v[1]) / u + 1;
                            var w = s(o(v[0], g), o(v[1], m));
                            return s(o(1 / p / u, w), l);
                        }
                        var $ = r(e, l);
                        var b = n(r(g, o(f[0], $)), r(m, o(f[1], $)), $);
                        return o(u, b);
                    };
                }.call(d.prototype));
            });
            ace.define("ace/virtual_renderer", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/config",
                "ace/layer/gutter",
                "ace/layer/marker",
                "ace/layer/text",
                "ace/layer/cursor",
                "ace/scrollbar",
                "ace/scrollbar",
                "ace/renderloop",
                "ace/layer/font_metrics",
                "ace/lib/event_emitter",
                "ace/lib/useragent", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/oop");
                var r = e("./lib/dom");
                var s = e("./config");
                var o = e("./layer/gutter").Gutter;
                var a = e("./layer/marker").Marker;
                var l = e("./layer/text").Text;
                var h = e("./layer/cursor").Cursor;
                var c = e("./scrollbar").HScrollBar;
                var u = e("./scrollbar").VScrollBar;
                var d = e("./renderloop").RenderLoop;
                var f = e("./layer/font_metrics").FontMetrics;
                var g = e("./lib/event_emitter").EventEmitter;
                var m = '\
.ace_br1 {border-top-left-radius    : 3px;}\
.ace_br2 {border-top-right-radius   : 3px;}\
.ace_br3 {border-top-left-radius    : 3px; border-top-right-radius:    3px;}\
.ace_br4 {border-bottom-right-radius: 3px;}\
.ace_br5 {border-top-left-radius    : 3px; border-bottom-right-radius: 3px;}\
.ace_br6 {border-top-right-radius   : 3px; border-bottom-right-radius: 3px;}\
.ace_br7 {border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px;}\
.ace_br8 {border-bottom-left-radius : 3px;}\
.ace_br9 {border-top-left-radius    : 3px; border-bottom-left-radius:  3px;}\
.ace_br10{border-top-right-radius   : 3px; border-bottom-left-radius:  3px;}\
.ace_br11{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-left-radius:  3px;}\
.ace_br12{border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br13{border-top-left-radius    : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br14{border-top-right-radius   : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br15{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;}\
.ace_editor {\
position: relative;\
overflow: hidden;\
padding: 0;\
font: 12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace;\
direction: ltr;\
text-align: left;\
-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\
}\
.ace_scroller {\
position: absolute;\
overflow: hidden;\
top: 0;\
bottom: 0;\
background-color: inherit;\
-ms-user-select: none;\
-moz-user-select: none;\
-webkit-user-select: none;\
user-select: none;\
cursor: text;\
}\
.ace_content {\
position: absolute;\
box-sizing: border-box;\
min-width: 100%;\
contain: style size layout;\
font-variant-ligatures: no-common-ligatures;\
}\
.ace_dragging .ace_scroller:before{\
position: absolute;\
top: 0;\
left: 0;\
right: 0;\
bottom: 0;\
content: \'\';\
background: rgba(250, 250, 250, 0.01);\
z-index: 1000;\
}\
.ace_dragging.ace_dark .ace_scroller:before{\
background: rgba(0, 0, 0, 0.01);\
}\
.ace_selecting, .ace_selecting * {\
cursor: text !important;\
}\
.ace_gutter {\
position: absolute;\
overflow : hidden;\
width: auto;\
top: 0;\
bottom: 0;\
left: 0;\
cursor: default;\
z-index: 4;\
-ms-user-select: none;\
-moz-user-select: none;\
-webkit-user-select: none;\
user-select: none;\
contain: style size layout;\
}\
.ace_gutter-active-line {\
position: absolute;\
left: 0;\
right: 0;\
}\
.ace_scroller.ace_scroll-left {\
box-shadow: 17px 0 16px -16px rgba(0, 0, 0, 0.4) inset;\
}\
.ace_gutter-cell {\
position: absolute;\
top: 0;\
left: 0;\
right: 0;\
padding-left: 19px;\
padding-right: 6px;\
background-repeat: no-repeat;\
}\
.ace_gutter-cell.ace_error {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==");\
background-repeat: no-repeat;\
background-position: 2px center;\
}\
.ace_gutter-cell.ace_warning {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==");\
background-position: 2px center;\
}\
.ace_gutter-cell.ace_info {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAJ0Uk5TAAB2k804AAAAPklEQVQY02NgIB68QuO3tiLznjAwpKTgNyDbMegwisCHZUETUZV0ZqOquBpXj2rtnpSJT1AEnnRmL2OgGgAAIKkRQap2htgAAAAASUVORK5CYII=");\
background-position: 2px center;\
}\
.ace_dark .ace_gutter-cell.ace_info {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAChoaGAgIAqKiq+vr6tra1ZWVmUlJSbm5s8PDxubm56enrdgzg3AAAAAXRSTlMAQObYZgAAAClJREFUeNpjYMAPdsMYHegyJZFQBlsUlMFVCWUYKkAZMxZAGdxlDMQBAG+TBP4B6RyJAAAAAElFTkSuQmCC");\
}\
.ace_scrollbar {\
contain: strict;\
position: absolute;\
right: 0;\
bottom: 0;\
z-index: 6;\
}\
.ace_scrollbar-inner {\
position: absolute;\
cursor: text;\
left: 0;\
top: 0;\
}\
.ace_scrollbar-v{\
overflow-x: hidden;\
overflow-y: scroll;\
top: 0;\
}\
.ace_scrollbar-h {\
overflow-x: scroll;\
overflow-y: hidden;\
left: 0;\
}\
.ace_print-margin {\
position: absolute;\
height: 100%;\
}\
.ace_text-input {\
position: absolute;\
z-index: 0;\
width: 0.5em;\
height: 1em;\
opacity: 0;\
background: transparent;\
-moz-appearance: none;\
appearance: none;\
border: none;\
resize: none;\
outline: none;\
overflow: hidden;\
font: inherit;\
padding: 0 1px;\
margin: 0 -1px;\
contain: strict;\
-ms-user-select: text;\
-moz-user-select: text;\
-webkit-user-select: text;\
user-select: text;\
white-space: pre!important;\
}\
.ace_text-input.ace_composition {\
background: transparent;\
color: inherit;\
z-index: 1000;\
opacity: 1;\
}\
.ace_composition_placeholder { color: transparent }\
.ace_composition_marker { \
border-bottom: 1px solid;\
position: absolute;\
border-radius: 0;\
margin-top: 1px;\
}\
[ace_nocontext=true] {\
transform: none!important;\
filter: none!important;\
clip-path: none!important;\
mask : none!important;\
contain: none!important;\
perspective: none!important;\
mix-blend-mode: initial!important;\
z-index: auto;\
}\
.ace_layer {\
z-index: 1;\
position: absolute;\
overflow: hidden;\
word-wrap: normal;\
white-space: pre;\
height: 100%;\
width: 100%;\
box-sizing: border-box;\
pointer-events: none;\
}\
.ace_gutter-layer {\
position: relative;\
width: auto;\
text-align: right;\
pointer-events: auto;\
height: 1000000px;\
contain: style size layout;\
}\
.ace_text-layer {\
font: inherit !important;\
position: absolute;\
height: 1000000px;\
width: 1000000px;\
contain: style size layout;\
}\
.ace_text-layer > .ace_line, .ace_text-layer > .ace_line_group {\
contain: style size layout;\
position: absolute;\
top: 0;\
left: 0;\
right: 0;\
}\
.ace_hidpi .ace_text-layer,\
.ace_hidpi .ace_gutter-layer,\
.ace_hidpi .ace_content,\
.ace_hidpi .ace_gutter {\
contain: strict;\
will-change: transform;\
}\
.ace_hidpi .ace_text-layer > .ace_line, \
.ace_hidpi .ace_text-layer > .ace_line_group {\
contain: strict;\
}\
.ace_cjk {\
display: inline-block;\
text-align: center;\
}\
.ace_cursor-layer {\
z-index: 4;\
}\
.ace_cursor {\
z-index: 4;\
position: absolute;\
box-sizing: border-box;\
border-left: 2px solid;\
transform: translatez(0);\
}\
.ace_multiselect .ace_cursor {\
border-left-width: 1px;\
}\
.ace_slim-cursors .ace_cursor {\
border-left-width: 1px;\
}\
.ace_overwrite-cursors .ace_cursor {\
border-left-width: 0;\
border-bottom: 1px solid;\
}\
.ace_hidden-cursors .ace_cursor {\
opacity: 0.2;\
}\
.ace_hasPlaceholder .ace_hidden-cursors .ace_cursor {\
opacity: 0;\
}\
.ace_smooth-blinking .ace_cursor {\
transition: opacity 0.18s;\
}\
.ace_animate-blinking .ace_cursor {\
animation-duration: 1000ms;\
animation-timing-function: step-end;\
animation-name: blink-ace-animate;\
animation-iteration-count: infinite;\
}\
.ace_animate-blinking.ace_smooth-blinking .ace_cursor {\
animation-duration: 1000ms;\
animation-timing-function: ease-in-out;\
animation-name: blink-ace-animate-smooth;\
}\
@keyframes blink-ace-animate {\
from, to { opacity: 1; }\
60% { opacity: 0; }\
}\
@keyframes blink-ace-animate-smooth {\
from, to { opacity: 1; }\
45% { opacity: 1; }\
60% { opacity: 0; }\
85% { opacity: 0; }\
}\
.ace_marker-layer .ace_step, .ace_marker-layer .ace_stack {\
position: absolute;\
z-index: 3;\
}\
.ace_marker-layer .ace_selection {\
position: absolute;\
z-index: 5;\
}\
.ace_marker-layer .ace_bracket {\
position: absolute;\
z-index: 6;\
}\
.ace_marker-layer .ace_error_bracket {\
position: absolute;\
border-bottom: 1px solid #DE5555;\
border-radius: 0;\
}\
.ace_marker-layer .ace_active-line {\
position: absolute;\
z-index: 2;\
}\
.ace_marker-layer .ace_selected-word {\
position: absolute;\
z-index: 4;\
box-sizing: border-box;\
}\
.ace_line .ace_fold {\
box-sizing: border-box;\
display: inline-block;\
height: 11px;\
margin-top: -2px;\
vertical-align: middle;\
background-image:\
url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),\
url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACJJREFUeNpi+P//fxgTAwPDBxDxD078RSX+YeEyDFMCIMAAI3INmXiwf2YAAAAASUVORK5CYII=");\
background-repeat: no-repeat, repeat-x;\
background-position: center center, top left;\
color: transparent;\
border: 1px solid black;\
border-radius: 2px;\
cursor: pointer;\
pointer-events: auto;\
}\
.ace_dark .ace_fold {\
}\
.ace_fold:hover{\
background-image:\
url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),\
url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACBJREFUeNpi+P//fz4TAwPDZxDxD5X4i5fLMEwJgAADAEPVDbjNw87ZAAAAAElFTkSuQmCC");\
}\
.ace_tooltip {\
background-color: #FFF;\
background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));\
border: 1px solid gray;\
border-radius: 1px;\
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);\
color: black;\
max-width: 100%;\
padding: 3px 4px;\
position: fixed;\
z-index: 999999;\
box-sizing: border-box;\
cursor: default;\
white-space: pre;\
word-wrap: break-word;\
line-height: normal;\
font-style: normal;\
font-weight: normal;\
letter-spacing: normal;\
pointer-events: none;\
}\
.ace_folding-enabled > .ace_gutter-cell {\
padding-right: 13px;\
}\
.ace_fold-widget {\
box-sizing: border-box;\
margin: 0 -12px 0 1px;\
display: none;\
width: 11px;\
vertical-align: top;\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42mWKsQ0AMAzC8ixLlrzQjzmBiEjp0A6WwBCSPgKAXoLkqSot7nN3yMwR7pZ32NzpKkVoDBUxKAAAAABJRU5ErkJggg==");\
background-repeat: no-repeat;\
background-position: center;\
border-radius: 3px;\
border: 1px solid transparent;\
cursor: pointer;\
}\
.ace_folding-enabled .ace_fold-widget {\
display: inline-block;   \
}\
.ace_fold-widget.ace_end {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42m3HwQkAMAhD0YzsRchFKI7sAikeWkrxwScEB0nh5e7KTPWimZki4tYfVbX+MNl4pyZXejUO1QAAAABJRU5ErkJggg==");\
}\
.ace_fold-widget.ace_closed {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGCAYAAAAG5SQMAAAAOUlEQVR42jXKwQkAMAgDwKwqKD4EwQ26sSOkVWjgIIHAzPiCgaqiqnJHZnKICBERHN194O5b9vbLuAVRL+l0YWnZAAAAAElFTkSuQmCCXA==");\
}\
.ace_fold-widget:hover {\
border: 1px solid rgba(0, 0, 0, 0.3);\
background-color: rgba(255, 255, 255, 0.2);\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);\
}\
.ace_fold-widget:active {\
border: 1px solid rgba(0, 0, 0, 0.4);\
background-color: rgba(0, 0, 0, 0.05);\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);\
}\
.ace_dark .ace_fold-widget {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHklEQVQIW2P4//8/AzoGEQ7oGCaLLAhWiSwB146BAQCSTPYocqT0AAAAAElFTkSuQmCC");\
}\
.ace_dark .ace_fold-widget.ace_end {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAH0lEQVQIW2P4//8/AxQ7wNjIAjDMgC4AxjCVKBirIAAF0kz2rlhxpAAAAABJRU5ErkJggg==");\
}\
.ace_dark .ace_fold-widget.ace_closed {\
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAHElEQVQIW2P4//+/AxAzgDADlOOAznHAKgPWAwARji8UIDTfQQAAAABJRU5ErkJggg==");\
}\
.ace_dark .ace_fold-widget:hover {\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);\
background-color: rgba(255, 255, 255, 0.1);\
}\
.ace_dark .ace_fold-widget:active {\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);\
}\
.ace_inline_button {\
border: 1px solid lightgray;\
display: inline-block;\
margin: -1px 8px;\
padding: 0 5px;\
pointer-events: auto;\
cursor: pointer;\
}\
.ace_inline_button:hover {\
border-color: gray;\
background: rgba(200,200,200,0.2);\
display: inline-block;\
pointer-events: auto;\
}\
.ace_fold-widget.ace_invalid {\
background-color: #FFB4B4;\
border-color: #DE5555;\
}\
.ace_fade-fold-widgets .ace_fold-widget {\
transition: opacity 0.4s ease 0.05s;\
opacity: 0;\
}\
.ace_fade-fold-widgets:hover .ace_fold-widget {\
transition: opacity 0.05s ease 0.05s;\
opacity:1;\
}\
.ace_underline {\
text-decoration: underline;\
}\
.ace_bold {\
font-weight: bold;\
}\
.ace_nobold .ace_bold {\
font-weight: normal;\
}\
.ace_italic {\
font-style: italic;\
}\
.ace_error-marker {\
background-color: rgba(255, 0, 0,0.2);\
position: absolute;\
z-index: 9;\
}\
.ace_highlight-marker {\
background-color: rgba(255, 255, 0,0.2);\
position: absolute;\
z-index: 8;\
}\
.ace_mobile-menu {\
position: absolute;\
line-height: 1.5;\
border-radius: 4px;\
-ms-user-select: none;\
-moz-user-select: none;\
-webkit-user-select: none;\
user-select: none;\
background: white;\
box-shadow: 1px 3px 2px grey;\
border: 1px solid #dcdcdc;\
color: black;\
}\
.ace_dark > .ace_mobile-menu {\
background: #333;\
color: #ccc;\
box-shadow: 1px 3px 2px grey;\
border: 1px solid #444;\
}\
.ace_mobile-button {\
padding: 2px;\
cursor: pointer;\
overflow: hidden;\
}\
.ace_mobile-button:hover {\
background-color: #eee;\
opacity:1;\
}\
.ace_mobile-button:active {\
background-color: #ddd;\
}\
.ace_placeholder {\
font-family: arial;\
transform: scale(0.9);\
transform-origin: left;\
white-space: pre;\
opacity: 0.7;\
margin: 0 10px;\
}';
                var v = e("./lib/useragent");
                var p = v.isIE;
                r.importCssString(m, "ace_editor.css", false);
                var w = function(e, t) {
                    var i = this;
                    this.container = e || r.createElement("div");
                    r.addCssClass(this.container, "ace_editor");
                    if (r.HI_DPI) r.addCssClass(this.container, "ace_hidpi");
                    this.setTheme(t);
                    if (s.get("useStrictCSP") == null) s.set("useStrictCSP", false);
                    this.$gutter = r.createElement("div");
                    this.$gutter.className = "ace_gutter";
                    this.container.appendChild(this.$gutter);
                    this.$gutter.setAttribute("aria-hidden", true);
                    this.scroller = r.createElement("div");
                    this.scroller.className = "ace_scroller";
                    this.container.appendChild(this.scroller);
                    this.content = r.createElement("div");
                    this.content.className = "ace_content";
                    this.scroller.appendChild(this.content);
                    this.$gutterLayer = new o(this.$gutter);
                    this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));
                    this.$markerBack = new a(this.content);
                    var n = (this.$textLayer = new l(this.content));
                    this.canvas = n.element;
                    this.$markerFront = new a(this.content);
                    this.$cursorLayer = new h(this.content);
                    this.$horizScroll = false;
                    this.$vScroll = false;
                    this.scrollBar = this.scrollBarV = new u(this.container, this);
                    this.scrollBarH = new c(this.container, this);
                    this.scrollBarV.on("scroll", function(e) {
                        if (!i.$scrollAnimation) i.session.setScrollTop(e.data - i.scrollMargin.top);
                    });
                    this.scrollBarH.on("scroll", function(e) {
                        if (!i.$scrollAnimation) i.session.setScrollLeft(e.data - i.scrollMargin.left);
                    });
                    this.scrollTop = 0;
                    this.scrollLeft = 0;
                    this.cursorPos = {
                        row: 0,
                        column: 0
                    };
                    this.$fontMetrics = new f(this.container);
                    this.$textLayer.$setFontMetrics(this.$fontMetrics);
                    this.$textLayer.on("changeCharacterSize", function(e) {
                        i.updateCharacterSize();
                        i.onResize(true, i.gutterWidth, i.$size.width, i.$size.height);
                        i._signal("changeCharacterSize", e);
                    });
                    this.$size = {
                        width: 0,
                        height: 0,
                        scrollerHeight: 0,
                        scrollerWidth: 0,
                        $dirty: true
                    };
                    this.layerConfig = {
                        width: 1,
                        padding: 0,
                        firstRow: 0,
                        firstRowScreen: 0,
                        lastRow: 0,
                        lineHeight: 0,
                        characterWidth: 0,
                        minHeight: 1,
                        maxHeight: 1,
                        offset: 0,
                        height: 1,
                        gutterOffset: 1
                    };
                    this.scrollMargin = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        v: 0,
                        h: 0
                    };
                    this.margin = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        v: 0,
                        h: 0
                    };
                    this.$keepTextAreaAtCursor = !v.isIOS;
                    this.$loop = new d(this.$renderChanges.bind(this), this.container.ownerDocument.defaultView);
                    this.$loop.schedule(this.CHANGE_FULL);
                    this.updateCharacterSize();
                    this.setPadding(4);
                    s.resetOptions(this);
                    s._signal("renderer", this);
                };
                (function() {
                    this.CHANGE_CURSOR = 1;
                    this.CHANGE_MARKER = 2;
                    this.CHANGE_GUTTER = 4;
                    this.CHANGE_SCROLL = 8;
                    this.CHANGE_LINES = 16;
                    this.CHANGE_TEXT = 32;
                    this.CHANGE_SIZE = 64;
                    this.CHANGE_MARKER_BACK = 128;
                    this.CHANGE_MARKER_FRONT = 256;
                    this.CHANGE_FULL = 512;
                    this.CHANGE_H_SCROLL = 1024;
                    n.implement(this, g);
                    this.updateCharacterSize = function() {
                        if (this.$textLayer.allowBoldFonts != this.$allowBoldFonts) {
                            this.$allowBoldFonts = this.$textLayer.allowBoldFonts;
                            this.setStyle("ace_nobold", !this.$allowBoldFonts);
                        }
                        this.layerConfig.characterWidth = this.characterWidth = this.$textLayer.getCharacterWidth();
                        this.layerConfig.lineHeight = this.lineHeight = this.$textLayer.getLineHeight();
                        this.$updatePrintMargin();
                        r.setStyle(this.scroller.style, "line-height", this.lineHeight + "px");
                    };
                    this.setSession = function(e) {
                        if (this.session) this.session.doc.off("changeNewLineMode", this.onChangeNewLineMode);
                        this.session = e;
                        if (e && this.scrollMargin.top && e.getScrollTop() <= 0) e.setScrollTop(-this.scrollMargin.top);
                        this.$cursorLayer.setSession(e);
                        this.$markerBack.setSession(e);
                        this.$markerFront.setSession(e);
                        this.$gutterLayer.setSession(e);
                        this.$textLayer.setSession(e);
                        if (!e) return;
                        this.$loop.schedule(this.CHANGE_FULL);
                        this.session.$setFontMetrics(this.$fontMetrics);
                        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
                        this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this);
                        this.onChangeNewLineMode();
                        this.session.doc.on("changeNewLineMode", this.onChangeNewLineMode);
                    };
                    this.updateLines = function(e, t, i) {
                        if (t === undefined) t = Infinity;
                        if (!this.$changedLines) {
                            this.$changedLines = {
                                firstRow: e,
                                lastRow: t
                            };
                        } else {
                            if (this.$changedLines.firstRow > e) this.$changedLines.firstRow = e;
                            if (this.$changedLines.lastRow < t) this.$changedLines.lastRow = t;
                        }
                        if (this.$changedLines.lastRow < this.layerConfig.firstRow) {
                            if (i) this.$changedLines.lastRow = this.layerConfig.lastRow;
                            else return;
                        }
                        if (this.$changedLines.firstRow > this.layerConfig.lastRow) return;
                        this.$loop.schedule(this.CHANGE_LINES);
                    };
                    this.onChangeNewLineMode = function() {
                        this.$loop.schedule(this.CHANGE_TEXT);
                        this.$textLayer.$updateEolChar();
                        this.session.$bidiHandler.setEolChar(this.$textLayer.EOL_CHAR);
                    };
                    this.onChangeTabSize = function() {
                        this.$loop.schedule(this.CHANGE_TEXT | this.CHANGE_MARKER);
                        this.$textLayer.onChangeTabSize();
                    };
                    this.updateText = function() {
                        this.$loop.schedule(this.CHANGE_TEXT);
                    };
                    this.updateFull = function(e) {
                        if (e) this.$renderChanges(this.CHANGE_FULL, true);
                        else this.$loop.schedule(this.CHANGE_FULL);
                    };
                    this.updateFontSize = function() {
                        this.$textLayer.checkForSizeChanges();
                    };
                    this.$changes = 0;
                    this.$updateSizeAsync = function() {
                        if (this.$loop.pending) this.$size.$dirty = true;
                        else this.onResize();
                    };
                    this.onResize = function(e, t, i, n) {
                        if (this.resizing > 2) return;
                        else if (this.resizing > 0) this.resizing++;
                        else this.resizing = e ? 1 : 0;
                        var r = this.container;
                        if (!n) n = r.clientHeight || r.scrollHeight;
                        if (!i) i = r.clientWidth || r.scrollWidth;
                        var s = this.$updateCachedSize(e, t, i, n);
                        if (!this.$size.scrollerHeight || (!i && !n)) return (this.resizing = 0);
                        if (e) this.$gutterLayer.$padding = null;
                        if (e) this.$renderChanges(s | this.$changes, true);
                        else this.$loop.schedule(s | this.$changes);
                        if (this.resizing) this.resizing = 0;
                        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
                    };
                    this.$updateCachedSize = function(e, t, i, n) {
                        n -= this.$extraHeight || 0;
                        var s = 0;
                        var o = this.$size;
                        var a = {
                            width: o.width,
                            height: o.height,
                            scrollerHeight: o.scrollerHeight,
                            scrollerWidth: o.scrollerWidth
                        };
                        if (n && (e || o.height != n)) {
                            o.height = n;
                            s |= this.CHANGE_SIZE;
                            o.scrollerHeight = o.height;
                            if (this.$horizScroll) o.scrollerHeight -= this.scrollBarH.getHeight();
                            this.scrollBarV.element.style.bottom = this.scrollBarH.getHeight() + "px";
                            s = s | this.CHANGE_SCROLL;
                        }
                        if (i && (e || o.width != i)) {
                            s |= this.CHANGE_SIZE;
                            o.width = i;
                            if (t == null) t = this.$showGutter ? this.$gutter.offsetWidth : 0;
                            this.gutterWidth = t;
                            r.setStyle(this.scrollBarH.element.style, "left", t + "px");
                            r.setStyle(this.scroller.style, "left", t + this.margin.left + "px");
                            o.scrollerWidth = Math.max(0, i - t - this.scrollBarV.getWidth() - this.margin.h);
                            r.setStyle(this.$gutter.style, "left", this.margin.left + "px");
                            var l = this.scrollBarV.getWidth() + "px";
                            r.setStyle(this.scrollBarH.element.style, "right", l);
                            r.setStyle(this.scroller.style, "right", l);
                            r.setStyle(this.scroller.style, "bottom", this.scrollBarH.getHeight());
                            if ((this.session && this.session.getUseWrapMode() && this.adjustWrapLimit()) || e) {
                                s |= this.CHANGE_FULL;
                            }
                        }
                        o.$dirty = !i || !n;
                        if (s) this._signal("resize", a);
                        return s;
                    };
                    this.onGutterResize = function(e) {
                        var t = this.$showGutter ? e : 0;
                        if (t != this.gutterWidth) this.$changes |= this.$updateCachedSize(true, t, this.$size.width, this.$size.height);
                        if (this.session.getUseWrapMode() && this.adjustWrapLimit()) {
                            this.$loop.schedule(this.CHANGE_FULL);
                        } else if (this.$size.$dirty) {
                            this.$loop.schedule(this.CHANGE_FULL);
                        } else {
                            this.$computeLayerConfig();
                        }
                    };
                    this.adjustWrapLimit = function() {
                        var e = this.$size.scrollerWidth - this.$padding * 2;
                        var t = Math.floor(e / this.characterWidth);
                        return this.session.adjustWrapLimit(t, this.$showPrintMargin && this.$printMarginColumn);
                    };
                    this.setAnimatedScroll = function(e) {
                        this.setOption("animatedScroll", e);
                    };
                    this.getAnimatedScroll = function() {
                        return this.$animatedScroll;
                    };
                    this.setShowInvisibles = function(e) {
                        this.setOption("showInvisibles", e);
                        this.session.$bidiHandler.setShowInvisibles(e);
                    };
                    this.getShowInvisibles = function() {
                        return this.getOption("showInvisibles");
                    };
                    this.getDisplayIndentGuides = function() {
                        return this.getOption("displayIndentGuides");
                    };
                    this.setDisplayIndentGuides = function(e) {
                        this.setOption("displayIndentGuides", e);
                    };
                    this.setShowPrintMargin = function(e) {
                        this.setOption("showPrintMargin", e);
                    };
                    this.getShowPrintMargin = function() {
                        return this.getOption("showPrintMargin");
                    };
                    this.setPrintMarginColumn = function(e) {
                        this.setOption("printMarginColumn", e);
                    };
                    this.getPrintMarginColumn = function() {
                        return this.getOption("printMarginColumn");
                    };
                    this.getShowGutter = function() {
                        return this.getOption("showGutter");
                    };
                    this.setShowGutter = function(e) {
                        return this.setOption("showGutter", e);
                    };
                    this.getFadeFoldWidgets = function() {
                        return this.getOption("fadeFoldWidgets");
                    };
                    this.setFadeFoldWidgets = function(e) {
                        this.setOption("fadeFoldWidgets", e);
                    };
                    this.setHighlightGutterLine = function(e) {
                        this.setOption("highlightGutterLine", e);
                    };
                    this.getHighlightGutterLine = function() {
                        return this.getOption("highlightGutterLine");
                    };
                    this.$updatePrintMargin = function() {
                        if (!this.$showPrintMargin && !this.$printMarginEl) return;
                        if (!this.$printMarginEl) {
                            var e = r.createElement("div");
                            e.className = "ace_layer ace_print-margin-layer";
                            this.$printMarginEl = r.createElement("div");
                            this.$printMarginEl.className = "ace_print-margin";
                            e.appendChild(this.$printMarginEl);
                            this.content.insertBefore(e, this.content.firstChild);
                        }
                        var t = this.$printMarginEl.style;
                        t.left = Math.round(this.characterWidth * this.$printMarginColumn + this.$padding) + "px";
                        t.visibility = this.$showPrintMargin ? "visible" : "hidden";
                        if (this.session && this.session.$wrap == -1) this.adjustWrapLimit();
                    };
                    this.getContainerElement = function() {
                        return this.container;
                    };
                    this.getMouseEventTarget = function() {
                        return this.scroller;
                    };
                    this.getTextAreaContainer = function() {
                        return this.container;
                    };
                    this.$moveTextAreaToCursor = function() {
                        if (this.$isMousePressed) return;
                        var e = this.textarea.style;
                        var t = this.$composition;
                        if (!this.$keepTextAreaAtCursor && !t) {
                            r.translate(this.textarea, -100, 0);
                            return;
                        }
                        var i = this.$cursorLayer.$pixelPos;
                        if (!i) return;
                        if (t && t.markerRange) i = this.$cursorLayer.getPixelPosition(t.markerRange.start, true);
                        var n = this.layerConfig;
                        var s = i.top;
                        var o = i.left;
                        s -= n.offset;
                        var a = t && t.useTextareaForIME ? this.lineHeight : p ? 0 : 1;
                        if (s < 0 || s > n.height - a) {
                            r.translate(this.textarea, 0, 0);
                            return;
                        }
                        var l = 1;
                        var h = this.$size.height - a;
                        if (!t) {
                            s += this.lineHeight;
                        } else {
                            if (t.useTextareaForIME) {
                                var c = this.textarea.value;
                                l = this.characterWidth * this.session.$getStringScreenWidth(c)[0];
                            } else {
                                s += this.lineHeight + 2;
                            }
                        }
                        o -= this.scrollLeft;
                        if (o > this.$size.scrollerWidth - l) o = this.$size.scrollerWidth - l;
                        o += this.gutterWidth + this.margin.left;
                        r.setStyle(e, "height", a + "px");
                        r.setStyle(e, "width", l + "px");
                        r.translate(this.textarea, Math.min(o, this.$size.scrollerWidth - l), Math.min(s, h));
                    };
                    this.getFirstVisibleRow = function() {
                        return this.layerConfig.firstRow;
                    };
                    this.getFirstFullyVisibleRow = function() {
                        return (this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1));
                    };
                    this.getLastFullyVisibleRow = function() {
                        var e = this.layerConfig;
                        var t = e.lastRow;
                        var i = this.session.documentToScreenRow(t, 0) * e.lineHeight;
                        if (i - this.session.getScrollTop() > e.height - e.lineHeight) return t - 1;
                        return t;
                    };
                    this.getLastVisibleRow = function() {
                        return this.layerConfig.lastRow;
                    };
                    this.$padding = null;
                    this.setPadding = function(e) {
                        this.$padding = e;
                        this.$textLayer.setPadding(e);
                        this.$cursorLayer.setPadding(e);
                        this.$markerFront.setPadding(e);
                        this.$markerBack.setPadding(e);
                        this.$loop.schedule(this.CHANGE_FULL);
                        this.$updatePrintMargin();
                    };
                    this.setScrollMargin = function(e, t, i, n) {
                        var r = this.scrollMargin;
                        r.top = e | 0;
                        r.bottom = t | 0;
                        r.right = n | 0;
                        r.left = i | 0;
                        r.v = r.top + r.bottom;
                        r.h = r.left + r.right;
                        if (r.top && this.scrollTop <= 0 && this.session) this.session.setScrollTop(-r.top);
                        this.updateFull();
                    };
                    this.setMargin = function(e, t, i, n) {
                        var r = this.margin;
                        r.top = e | 0;
                        r.bottom = t | 0;
                        r.right = n | 0;
                        r.left = i | 0;
                        r.v = r.top + r.bottom;
                        r.h = r.left + r.right;
                        this.$updateCachedSize(true, this.gutterWidth, this.$size.width, this.$size.height);
                        this.updateFull();
                    };
                    this.getHScrollBarAlwaysVisible = function() {
                        return this.$hScrollBarAlwaysVisible;
                    };
                    this.setHScrollBarAlwaysVisible = function(e) {
                        this.setOption("hScrollBarAlwaysVisible", e);
                    };
                    this.getVScrollBarAlwaysVisible = function() {
                        return this.$vScrollBarAlwaysVisible;
                    };
                    this.setVScrollBarAlwaysVisible = function(e) {
                        this.setOption("vScrollBarAlwaysVisible", e);
                    };
                    this.$updateScrollBarV = function() {
                        var e = this.layerConfig.maxHeight;
                        var t = this.$size.scrollerHeight;
                        if (!this.$maxLines && this.$scrollPastEnd) {
                            e -= (t - this.lineHeight) * this.$scrollPastEnd;
                            if (this.scrollTop > e - t) {
                                e = this.scrollTop + t;
                                this.scrollBarV.scrollTop = null;
                            }
                        }
                        this.scrollBarV.setScrollHeight(e + this.scrollMargin.v);
                        this.scrollBarV.setScrollTop(this.scrollTop + this.scrollMargin.top);
                    };
                    this.$updateScrollBarH = function() {
                        this.scrollBarH.setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h);
                        this.scrollBarH.setScrollLeft(this.scrollLeft + this.scrollMargin.left);
                    };
                    this.$frozen = false;
                    this.freeze = function() {
                        this.$frozen = true;
                    };
                    this.unfreeze = function() {
                        this.$frozen = false;
                    };
                    this.$renderChanges = function(e, t) {
                        if (this.$changes) {
                            e |= this.$changes;
                            this.$changes = 0;
                        }
                        if (!this.session || !this.container.offsetWidth || this.$frozen || (!e && !t)) {
                            this.$changes |= e;
                            return;
                        }
                        if (this.$size.$dirty) {
                            this.$changes |= e;
                            return this.onResize(true);
                        }
                        if (!this.lineHeight) {
                            this.$textLayer.checkForSizeChanges();
                        }
                        this._signal("beforeRender", e);
                        if (this.session && this.session.$bidiHandler) this.session.$bidiHandler.updateCharacterWidths(this.$fontMetrics);
                        var i = this.layerConfig;
                        if (e & this.CHANGE_FULL || e & this.CHANGE_SIZE || e & this.CHANGE_TEXT || e & this.CHANGE_LINES || e & this.CHANGE_SCROLL || e & this.CHANGE_H_SCROLL) {
                            e |= this.$computeLayerConfig() | this.$loop.clear();
                            if (i.firstRow != this.layerConfig.firstRow && i.firstRowScreen == this.layerConfig.firstRowScreen) {
                                var n = this.scrollTop + (i.firstRow - this.layerConfig.firstRow) * this.lineHeight;
                                if (n > 0) {
                                    this.scrollTop = n;
                                    e = e | this.CHANGE_SCROLL;
                                    e |= this.$computeLayerConfig() | this.$loop.clear();
                                }
                            }
                            i = this.layerConfig;
                            this.$updateScrollBarV();
                            if (e & this.CHANGE_H_SCROLL) this.$updateScrollBarH();
                            r.translate(this.content, -this.scrollLeft, -i.offset);
                            var s = i.width + 2 * this.$padding + "px";
                            var o = i.minHeight + "px";
                            r.setStyle(this.content.style, "width", s);
                            r.setStyle(this.content.style, "height", o);
                        }
                        if (e & this.CHANGE_H_SCROLL) {
                            r.translate(this.content, -this.scrollLeft, -i.offset);
                            this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller" : "ace_scroller ace_scroll-left";
                        }
                        if (e & this.CHANGE_FULL) {
                            this.$changedLines = null;
                            this.$textLayer.update(i);
                            if (this.$showGutter) this.$gutterLayer.update(i);
                            this.$markerBack.update(i);
                            this.$markerFront.update(i);
                            this.$cursorLayer.update(i);
                            this.$moveTextAreaToCursor();
                            this._signal("afterRender", e);
                            return;
                        }
                        if (e & this.CHANGE_SCROLL) {
                            this.$changedLines = null;
                            if (e & this.CHANGE_TEXT || e & this.CHANGE_LINES) this.$textLayer.update(i);
                            else this.$textLayer.scrollLines(i);
                            if (this.$showGutter) {
                                if (e & this.CHANGE_GUTTER || e & this.CHANGE_LINES) this.$gutterLayer.update(i);
                                else this.$gutterLayer.scrollLines(i);
                            }
                            this.$markerBack.update(i);
                            this.$markerFront.update(i);
                            this.$cursorLayer.update(i);
                            this.$moveTextAreaToCursor();
                            this._signal("afterRender", e);
                            return;
                        }
                        if (e & this.CHANGE_TEXT) {
                            this.$changedLines = null;
                            this.$textLayer.update(i);
                            if (this.$showGutter) this.$gutterLayer.update(i);
                        } else if (e & this.CHANGE_LINES) {
                            if (this.$updateLines() || (e & this.CHANGE_GUTTER && this.$showGutter)) this.$gutterLayer.update(i);
                        } else if (e & this.CHANGE_TEXT || e & this.CHANGE_GUTTER) {
                            if (this.$showGutter) this.$gutterLayer.update(i);
                        } else if (e & this.CHANGE_CURSOR) {
                            if (this.$highlightGutterLine) this.$gutterLayer.updateLineHighlight(i);
                        }
                        if (e & this.CHANGE_CURSOR) {
                            this.$cursorLayer.update(i);
                            this.$moveTextAreaToCursor();
                        }
                        if (e & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
                            this.$markerFront.update(i);
                        }
                        if (e & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
                            this.$markerBack.update(i);
                        }
                        this._signal("afterRender", e);
                    };
                    this.$autosize = function() {
                        var e = this.session.getScreenLength() * this.lineHeight;
                        var t = this.$maxLines * this.lineHeight;
                        var i = Math.min(t, Math.max((this.$minLines || 1) * this.lineHeight, e)) + this.scrollMargin.v + (this.$extraHeight || 0);
                        if (this.$horizScroll) i += this.scrollBarH.getHeight();
                        if (this.$maxPixelHeight && i > this.$maxPixelHeight) i = this.$maxPixelHeight;
                        var n = i <= 2 * this.lineHeight;
                        var r = !n && e > t;
                        if (i != this.desiredHeight || this.$size.height != this.desiredHeight || r != this.$vScroll) {
                            if (r != this.$vScroll) {
                                this.$vScroll = r;
                                this.scrollBarV.setVisible(r);
                            }
                            var s = this.container.clientWidth;
                            this.container.style.height = i + "px";
                            this.$updateCachedSize(true, this.$gutterWidth, s, i);
                            this.desiredHeight = i;
                            this._signal("autosize");
                        }
                    };
                    this.$computeLayerConfig = function() {
                        var e = this.session;
                        var t = this.$size;
                        var i = t.height <= 2 * this.lineHeight;
                        var n = this.session.getScreenLength();
                        var r = n * this.lineHeight;
                        var s = this.$getLongestLine();
                        var o = !i && (this.$hScrollBarAlwaysVisible || t.scrollerWidth - s - 2 * this.$padding < 0);
                        var a = this.$horizScroll !== o;
                        if (a) {
                            this.$horizScroll = o;
                            this.scrollBarH.setVisible(o);
                        }
                        var l = this.$vScroll;
                        if (this.$maxLines && this.lineHeight > 1) this.$autosize();
                        var h = t.scrollerHeight + this.lineHeight;
                        var c = !this.$maxLines && this.$scrollPastEnd ? (t.scrollerHeight - this.lineHeight) * this.$scrollPastEnd : 0;
                        r += c;
                        var u = this.scrollMargin;
                        this.session.setScrollTop(Math.max(-u.top, Math.min(this.scrollTop, r - t.scrollerHeight + u.bottom)));
                        this.session.setScrollLeft(Math.max(-u.left, Math.min(this.scrollLeft, s + 2 * this.$padding - t.scrollerWidth + u.right)));
                        var d = !i && (this.$vScrollBarAlwaysVisible || t.scrollerHeight - r + c < 0 || this.scrollTop > u.top);
                        var f = l !== d;
                        if (f) {
                            this.$vScroll = d;
                            this.scrollBarV.setVisible(d);
                        }
                        var g = this.scrollTop % this.lineHeight;
                        var m = Math.ceil(h / this.lineHeight) - 1;
                        var v = Math.max(0, Math.round((this.scrollTop - g) / this.lineHeight));
                        var p = v + m;
                        var w, $;
                        var b = this.lineHeight;
                        v = e.screenToDocumentRow(v, 0);
                        var y = e.getFoldLine(v);
                        if (y) {
                            v = y.start.row;
                        }
                        w = e.documentToScreenRow(v, 0);
                        $ = e.getRowLength(v) * b;
                        p = Math.min(e.screenToDocumentRow(p, 0), e.getLength() - 1);
                        h = t.scrollerHeight + e.getRowLength(p) * b + $;
                        g = this.scrollTop - w * b;
                        var C = 0;
                        if (this.layerConfig.width != s || a) C = this.CHANGE_H_SCROLL;
                        if (a || f) {
                            C |= this.$updateCachedSize(true, this.gutterWidth, t.width, t.height);
                            this._signal("scrollbarVisibilityChanged");
                            if (f) s = this.$getLongestLine();
                        }
                        this.layerConfig = {
                            width: s,
                            padding: this.$padding,
                            firstRow: v,
                            firstRowScreen: w,
                            lastRow: p,
                            lineHeight: b,
                            characterWidth: this.characterWidth,
                            minHeight: h,
                            maxHeight: r,
                            offset: g,
                            gutterOffset: b ? Math.max(0, Math.ceil((g + t.height - t.scrollerHeight) / b)) : 0,
                            height: this.$size.scrollerHeight
                        };
                        if (this.session.$bidiHandler) this.session.$bidiHandler.setContentWidth(s - this.$padding);
                        return C;
                    };
                    this.$updateLines = function() {
                        if (!this.$changedLines) return;
                        var e = this.$changedLines.firstRow;
                        var t = this.$changedLines.lastRow;
                        this.$changedLines = null;
                        var i = this.layerConfig;
                        if (e > i.lastRow + 1) {
                            return;
                        }
                        if (t < i.firstRow) {
                            return;
                        }
                        if (t === Infinity) {
                            if (this.$showGutter) this.$gutterLayer.update(i);
                            this.$textLayer.update(i);
                            return;
                        }
                        this.$textLayer.updateLines(i, e, t);
                        return true;
                    };
                    this.$getLongestLine = function() {
                        var e = this.session.getScreenWidth();
                        if (this.showInvisibles && !this.session.$useWrapMode) e += 1;
                        if (this.$textLayer && e > this.$textLayer.MAX_LINE_LENGTH) e = this.$textLayer.MAX_LINE_LENGTH + 30;
                        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(e * this.characterWidth));
                    };
                    this.updateFrontMarkers = function() {
                        this.$markerFront.setMarkers(this.session.getMarkers(true));
                        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
                    };
                    this.updateBackMarkers = function() {
                        this.$markerBack.setMarkers(this.session.getMarkers());
                        this.$loop.schedule(this.CHANGE_MARKER_BACK);
                    };
                    this.addGutterDecoration = function(e, t) {
                        this.$gutterLayer.addGutterDecoration(e, t);
                    };
                    this.removeGutterDecoration = function(e, t) {
                        this.$gutterLayer.removeGutterDecoration(e, t);
                    };
                    this.updateBreakpoints = function(e) {
                        this.$loop.schedule(this.CHANGE_GUTTER);
                    };
                    this.setAnnotations = function(e) {
                        this.$gutterLayer.setAnnotations(e);
                        this.$loop.schedule(this.CHANGE_GUTTER);
                    };
                    this.updateCursor = function() {
                        this.$loop.schedule(this.CHANGE_CURSOR);
                    };
                    this.hideCursor = function() {
                        this.$cursorLayer.hideCursor();
                    };
                    this.showCursor = function() {
                        this.$cursorLayer.showCursor();
                    };
                    this.scrollSelectionIntoView = function(e, t, i) {
                        this.scrollCursorIntoView(e, i);
                        this.scrollCursorIntoView(t, i);
                    };
                    this.scrollCursorIntoView = function(e, t, i) {
                        if (this.$size.scrollerHeight === 0) return;
                        var n = this.$cursorLayer.getPixelPosition(e);
                        var r = n.left;
                        var s = n.top;
                        var o = (i && i.top) || 0;
                        var a = (i && i.bottom) || 0;
                        var l = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;
                        if (l + o > s) {
                            if (t && l + o > s + this.lineHeight) s -= t * this.$size.scrollerHeight;
                            if (s === 0) s = -this.scrollMargin.top;
                            this.session.setScrollTop(s);
                        } else if (l + this.$size.scrollerHeight - a < s + this.lineHeight) {
                            if (t && l + this.$size.scrollerHeight - a < s - this.lineHeight) s += t * this.$size.scrollerHeight;
                            this.session.setScrollTop(s + this.lineHeight + a - this.$size.scrollerHeight);
                        }
                        var h = this.scrollLeft;
                        if (h > r) {
                            if (r < this.$padding + 2 * this.layerConfig.characterWidth) r = -this.scrollMargin.left;
                            this.session.setScrollLeft(r);
                        } else if (h + this.$size.scrollerWidth < r + this.characterWidth) {
                            this.session.setScrollLeft(Math.round(r + this.characterWidth - this.$size.scrollerWidth));
                        } else if (h <= this.$padding && r - h < this.characterWidth) {
                            this.session.setScrollLeft(0);
                        }
                    };
                    this.getScrollTop = function() {
                        return this.session.getScrollTop();
                    };
                    this.getScrollLeft = function() {
                        return this.session.getScrollLeft();
                    };
                    this.getScrollTopRow = function() {
                        return this.scrollTop / this.lineHeight;
                    };
                    this.getScrollBottomRow = function() {
                        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
                    };
                    this.scrollToRow = function(e) {
                        this.session.setScrollTop(e * this.lineHeight);
                    };
                    this.alignCursor = function(e, t) {
                        if (typeof e == "number") e = {
                            row: e,
                            column: 0
                        };
                        var i = this.$cursorLayer.getPixelPosition(e);
                        var n = this.$size.scrollerHeight - this.lineHeight;
                        var r = i.top - n * (t || 0);
                        this.session.setScrollTop(r);
                        return r;
                    };
                    this.STEPS = 8;
                    this.$calcSteps = function(e, t) {
                        var i = 0;
                        var n = this.STEPS;
                        var r = [];
                        var s = function(e, t, i) {
                            return i * (Math.pow(e - 1, 3) + 1) + t;
                        };
                        for(i = 0; i < n; ++i)r.push(s(i / this.STEPS, e, t - e));
                        return r;
                    };
                    this.scrollToLine = function(e, t, i, n) {
                        var r = this.$cursorLayer.getPixelPosition({
                            row: e,
                            column: 0
                        });
                        var s = r.top;
                        if (t) s -= this.$size.scrollerHeight / 2;
                        var o = this.scrollTop;
                        this.session.setScrollTop(s);
                        if (i !== false) this.animateScrolling(o, n);
                    };
                    this.animateScrolling = function(e, t) {
                        var i = this.scrollTop;
                        if (!this.$animatedScroll) return;
                        var n = this;
                        if (e == i) return;
                        if (this.$scrollAnimation) {
                            var r = this.$scrollAnimation.steps;
                            if (r.length) {
                                e = r[0];
                                if (e == i) return;
                            }
                        }
                        var s = n.$calcSteps(e, i);
                        this.$scrollAnimation = {
                            from: e,
                            to: i,
                            steps: s
                        };
                        clearInterval(this.$timer);
                        n.session.setScrollTop(s.shift());
                        n.session.$scrollTop = i;
                        this.$timer = setInterval(function() {
                            if (!n.session) return clearInterval(n.$timer);
                            if (s.length) {
                                n.session.setScrollTop(s.shift());
                                n.session.$scrollTop = i;
                            } else if (i != null) {
                                n.session.$scrollTop = -1;
                                n.session.setScrollTop(i);
                                i = null;
                            } else {
                                n.$timer = clearInterval(n.$timer);
                                n.$scrollAnimation = null;
                                t && t();
                            }
                        }, 10);
                    };
                    this.scrollToY = function(e) {
                        if (this.scrollTop !== e) {
                            this.$loop.schedule(this.CHANGE_SCROLL);
                            this.scrollTop = e;
                        }
                    };
                    this.scrollToX = function(e) {
                        if (this.scrollLeft !== e) this.scrollLeft = e;
                        this.$loop.schedule(this.CHANGE_H_SCROLL);
                    };
                    this.scrollTo = function(e, t) {
                        this.session.setScrollTop(t);
                        this.session.setScrollLeft(e);
                    };
                    this.scrollBy = function(e, t) {
                        t && this.session.setScrollTop(this.session.getScrollTop() + t);
                        e && this.session.setScrollLeft(this.session.getScrollLeft() + e);
                    };
                    this.isScrollableBy = function(e, t) {
                        if (t < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top) return true;
                        if (t > 0 && this.session.getScrollTop() + this.$size.scrollerHeight - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom) return true;
                        if (e < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left) return true;
                        if (e > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth - this.layerConfig.width < -1 + this.scrollMargin.right) return true;
                    };
                    this.pixelToScreenCoordinates = function(e, t) {
                        var i;
                        if (this.$hasCssTransforms) {
                            i = {
                                top: 0,
                                left: 0
                            };
                            var n = this.$fontMetrics.transformCoordinates([
                                e,
                                t, 
                            ]);
                            e = n[1] - this.gutterWidth - this.margin.left;
                            t = n[0];
                        } else {
                            i = this.scroller.getBoundingClientRect();
                        }
                        var r = e + this.scrollLeft - i.left - this.$padding;
                        var s = r / this.characterWidth;
                        var o = Math.floor((t + this.scrollTop - i.top) / this.lineHeight);
                        var a = this.$blockCursor ? Math.floor(s) : Math.round(s);
                        return {
                            row: o,
                            column: a,
                            side: s - a > 0 ? 1 : -1,
                            offsetX: r
                        };
                    };
                    this.screenToTextCoordinates = function(e, t) {
                        var i;
                        if (this.$hasCssTransforms) {
                            i = {
                                top: 0,
                                left: 0
                            };
                            var n = this.$fontMetrics.transformCoordinates([
                                e,
                                t, 
                            ]);
                            e = n[1] - this.gutterWidth - this.margin.left;
                            t = n[0];
                        } else {
                            i = this.scroller.getBoundingClientRect();
                        }
                        var r = e + this.scrollLeft - i.left - this.$padding;
                        var s = r / this.characterWidth;
                        var o = this.$blockCursor ? Math.floor(s) : Math.round(s);
                        var a = Math.floor((t + this.scrollTop - i.top) / this.lineHeight);
                        return this.session.screenToDocumentPosition(a, Math.max(o, 0), r);
                    };
                    this.textToScreenCoordinates = function(e, t) {
                        var i = this.scroller.getBoundingClientRect();
                        var n = this.session.documentToScreenPosition(e, t);
                        var r = this.$padding + (this.session.$bidiHandler.isBidiRow(n.row, e) ? this.session.$bidiHandler.getPosLeft(n.column) : Math.round(n.column * this.characterWidth));
                        var s = n.row * this.lineHeight;
                        return {
                            pageX: i.left + r - this.scrollLeft,
                            pageY: i.top + s - this.scrollTop
                        };
                    };
                    this.visualizeFocus = function() {
                        r.addCssClass(this.container, "ace_focus");
                    };
                    this.visualizeBlur = function() {
                        r.removeCssClass(this.container, "ace_focus");
                    };
                    this.showComposition = function(e) {
                        this.$composition = e;
                        if (!e.cssText) {
                            e.cssText = this.textarea.style.cssText;
                        }
                        if (e.useTextareaForIME == undefined) e.useTextareaForIME = this.$useTextareaForIME;
                        if (this.$useTextareaForIME) {
                            r.addCssClass(this.textarea, "ace_composition");
                            this.textarea.style.cssText = "";
                            this.$moveTextAreaToCursor();
                            this.$cursorLayer.element.style.display = "none";
                        } else {
                            e.markerId = this.session.addMarker(e.markerRange, "ace_composition_marker", "text");
                        }
                    };
                    this.setCompositionText = function(e) {
                        var t = this.session.selection.cursor;
                        this.addToken(e, "composition_placeholder", t.row, t.column);
                        this.$moveTextAreaToCursor();
                    };
                    this.hideComposition = function() {
                        if (!this.$composition) return;
                        if (this.$composition.markerId) this.session.removeMarker(this.$composition.markerId);
                        r.removeCssClass(this.textarea, "ace_composition");
                        this.textarea.style.cssText = this.$composition.cssText;
                        var e = this.session.selection.cursor;
                        this.removeExtraToken(e.row, e.column);
                        this.$composition = null;
                        this.$cursorLayer.element.style.display = "";
                    };
                    this.addToken = function(e, t, i, n) {
                        var r = this.session;
                        r.bgTokenizer.lines[i] = null;
                        var s = {
                            type: t,
                            value: e
                        };
                        var o = r.getTokens(i);
                        if (n == null) {
                            o.push(s);
                        } else {
                            var a = 0;
                            for(var l = 0; l < o.length; l++){
                                var h = o[l];
                                a += h.value.length;
                                if (n <= a) {
                                    var c = h.value.length - (a - n);
                                    var u = h.value.slice(0, c);
                                    var d = h.value.slice(c);
                                    o.splice(l, 1, {
                                        type: h.type,
                                        value: u
                                    }, s, {
                                        type: h.type,
                                        value: d
                                    });
                                    break;
                                }
                            }
                        }
                        this.updateLines(i, i);
                    };
                    this.removeExtraToken = function(e, t) {
                        this.updateLines(e, e);
                    };
                    this.setTheme = function(e, t) {
                        var i = this;
                        this.$themeId = e;
                        i._dispatchEvent("themeChange", {
                            theme: e
                        });
                        if (!e || typeof e == "string") {
                            var n = e || this.$options.theme.initialValue;
                            s.loadModule([
                                "theme",
                                n
                            ], o);
                        } else {
                            o(e);
                        }
                        function o(n) {
                            if (i.$themeId != e) return t && t();
                            if (!n || !n.cssClass) throw new Error("couldn't load module " + e + " or it didn't call define");
                            if (n.$id) i.$themeId = n.$id;
                            r.importCssString(n.cssText, n.cssClass, i.container);
                            if (i.theme) r.removeCssClass(i.container, i.theme.cssClass);
                            var s = "padding" in n ? n.padding : "padding" in (i.theme || {}) ? 4 : i.$padding;
                            if (i.$padding && s != i.$padding) i.setPadding(s);
                            i.$theme = n.cssClass;
                            i.theme = n;
                            r.addCssClass(i.container, n.cssClass);
                            r.setCssClass(i.container, "ace_dark", n.isDark);
                            if (i.$size) {
                                i.$size.width = 0;
                                i.$updateSizeAsync();
                            }
                            i._dispatchEvent("themeLoaded", {
                                theme: n
                            });
                            t && t();
                        }
                    };
                    this.getTheme = function() {
                        return this.$themeId;
                    };
                    this.setStyle = function(e, t) {
                        r.setCssClass(this.container, e, t !== false);
                    };
                    this.unsetStyle = function(e) {
                        r.removeCssClass(this.container, e);
                    };
                    this.setCursorStyle = function(e) {
                        r.setStyle(this.scroller.style, "cursor", e);
                    };
                    this.setMouseCursor = function(e) {
                        r.setStyle(this.scroller.style, "cursor", e);
                    };
                    this.attachToShadowRoot = function() {
                        r.importCssString(m, "ace_editor.css", this.container);
                    };
                    this.destroy = function() {
                        this.freeze();
                        this.$fontMetrics.destroy();
                        this.$cursorLayer.destroy();
                        this.removeAllListeners();
                        this.container.textContent = "";
                    };
                }.call(w.prototype));
                s.defineOptions(w.prototype, "renderer", {
                    animatedScroll: {
                        initialValue: false
                    },
                    showInvisibles: {
                        set: function(e) {
                            if (this.$textLayer.setShowInvisibles(e)) this.$loop.schedule(this.CHANGE_TEXT);
                        },
                        initialValue: false
                    },
                    showPrintMargin: {
                        set: function() {
                            this.$updatePrintMargin();
                        },
                        initialValue: true
                    },
                    printMarginColumn: {
                        set: function() {
                            this.$updatePrintMargin();
                        },
                        initialValue: 80
                    },
                    printMargin: {
                        set: function(e) {
                            if (typeof e == "number") this.$printMarginColumn = e;
                            this.$showPrintMargin = !!e;
                            this.$updatePrintMargin();
                        },
                        get: function() {
                            return (this.$showPrintMargin && this.$printMarginColumn);
                        }
                    },
                    showGutter: {
                        set: function(e) {
                            this.$gutter.style.display = e ? "block" : "none";
                            this.$loop.schedule(this.CHANGE_FULL);
                            this.onGutterResize();
                        },
                        initialValue: true
                    },
                    fadeFoldWidgets: {
                        set: function(e) {
                            r.setCssClass(this.$gutter, "ace_fade-fold-widgets", e);
                        },
                        initialValue: false
                    },
                    showFoldWidgets: {
                        set: function(e) {
                            this.$gutterLayer.setShowFoldWidgets(e);
                            this.$loop.schedule(this.CHANGE_GUTTER);
                        },
                        initialValue: true
                    },
                    displayIndentGuides: {
                        set: function(e) {
                            if (this.$textLayer.setDisplayIndentGuides(e)) this.$loop.schedule(this.CHANGE_TEXT);
                        },
                        initialValue: true
                    },
                    highlightGutterLine: {
                        set: function(e) {
                            this.$gutterLayer.setHighlightGutterLine(e);
                            this.$loop.schedule(this.CHANGE_GUTTER);
                        },
                        initialValue: true
                    },
                    hScrollBarAlwaysVisible: {
                        set: function(e) {
                            if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll) this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: false
                    },
                    vScrollBarAlwaysVisible: {
                        set: function(e) {
                            if (!this.$vScrollBarAlwaysVisible || !this.$vScroll) this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: false
                    },
                    fontSize: {
                        set: function(e) {
                            if (typeof e == "number") e = e + "px";
                            this.container.style.fontSize = e;
                            this.updateFontSize();
                        },
                        initialValue: 12
                    },
                    fontFamily: {
                        set: function(e) {
                            this.container.style.fontFamily = e;
                            this.updateFontSize();
                        }
                    },
                    maxLines: {
                        set: function(e) {
                            this.updateFull();
                        }
                    },
                    minLines: {
                        set: function(e) {
                            if (!(this.$minLines < 0x1ffffffffffff)) this.$minLines = 0;
                            this.updateFull();
                        }
                    },
                    maxPixelHeight: {
                        set: function(e) {
                            this.updateFull();
                        },
                        initialValue: 0
                    },
                    scrollPastEnd: {
                        set: function(e) {
                            e = +e || 0;
                            if (this.$scrollPastEnd == e) return;
                            this.$scrollPastEnd = e;
                            this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: 0,
                        handlesSet: true
                    },
                    fixedWidthGutter: {
                        set: function(e) {
                            this.$gutterLayer.$fixedWidth = !!e;
                            this.$loop.schedule(this.CHANGE_GUTTER);
                        }
                    },
                    theme: {
                        set: function(e) {
                            this.setTheme(e);
                        },
                        get: function() {
                            return this.$themeId || this.theme;
                        },
                        initialValue: "./theme/textmate",
                        handlesSet: true
                    },
                    hasCssTransforms: {},
                    useTextareaForIME: {
                        initialValue: !v.isMobile && !v.isIE
                    }
                });
                t.VirtualRenderer = w;
            });
            ace.define("ace/worker/worker_client", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/net",
                "ace/lib/event_emitter",
                "ace/config", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../lib/oop");
                var r = e("../lib/net");
                var s = e("../lib/event_emitter").EventEmitter;
                var o = e("../config");
                function a(e) {
                    var t = "importScripts('" + r.qualifyURL(e) + "');";
                    try {
                        return new Blob([
                            t
                        ], {
                            type: "application/javascript"
                        });
                    } catch (i) {
                        var n = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                        var s = new n();
                        s.append(t);
                        return s.getBlob("application/javascript");
                    }
                }
                function l(e) {
                    if (typeof Worker == "undefined") return {
                        postMessage: function() {},
                        terminate: function() {}
                    };
                    if (o.get("loadWorkerFromBlob")) {
                        var t = a(e);
                        var i = window.URL || window.webkitURL;
                        var n = i.createObjectURL(t);
                        return new Worker(n);
                    }
                    return new Worker(e);
                }
                var h = function(e) {
                    if (!e.postMessage) e = this.$createWorkerFromOldConfig.apply(this, arguments);
                    this.$worker = e;
                    this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this);
                    this.changeListener = this.changeListener.bind(this);
                    this.onMessage = this.onMessage.bind(this);
                    this.callbackId = 1;
                    this.callbacks = {};
                    this.$worker.onmessage = this.onMessage;
                };
                (function() {
                    n.implement(this, s);
                    this.$createWorkerFromOldConfig = function(t, i, n, r, s) {
                        if (e.nameToUrl && !e.toUrl) e.toUrl = e.nameToUrl;
                        if (o.get("packaged") || !e.toUrl) {
                            r = r || o.moduleUrl(i, "worker");
                        } else {
                            var a = this.$normalizePath;
                            r = r || a(e.toUrl("ace/worker/worker.js", null, "_"));
                            var h = {};
                            t.forEach(function(t) {
                                h[t] = a(e.toUrl(t, null, "_").replace(/(\.js)?(\?.*)?$/, ""));
                            });
                        }
                        this.$worker = l(r);
                        if (s) {
                            this.send("importScripts", s);
                        }
                        this.$worker.postMessage({
                            init: true,
                            tlns: h,
                            module: i,
                            classname: n
                        });
                        return this.$worker;
                    };
                    this.onMessage = function(e) {
                        var t = e.data;
                        switch(t.type){
                            case "event":
                                this._signal(t.name, {
                                    data: t.data
                                });
                                break;
                            case "call":
                                var i = this.callbacks[t.id];
                                if (i) {
                                    i(t.data);
                                    delete this.callbacks[t.id];
                                }
                                break;
                            case "error":
                                this.reportError(t.data);
                                break;
                            case "log":
                                window.console && console.log && console.log.apply(console, t.data);
                                break;
                        }
                    };
                    this.reportError = function(e) {
                        window.console && console.error && console.error(e);
                    };
                    this.$normalizePath = function(e) {
                        return r.qualifyURL(e);
                    };
                    this.terminate = function() {
                        this._signal("terminate", {});
                        this.deltaQueue = null;
                        this.$worker.terminate();
                        this.$worker = null;
                        if (this.$doc) this.$doc.off("change", this.changeListener);
                        this.$doc = null;
                    };
                    this.send = function(e, t) {
                        this.$worker.postMessage({
                            command: e,
                            args: t
                        });
                    };
                    this.call = function(e, t, i) {
                        if (i) {
                            var n = this.callbackId++;
                            this.callbacks[n] = i;
                            t.push(n);
                        }
                        this.send(e, t);
                    };
                    this.emit = function(e, t) {
                        try {
                            if (t.data && t.data.err) t.data.err = {
                                message: t.data.err.message,
                                stack: t.data.err.stack,
                                code: t.data.err.code
                            };
                            this.$worker.postMessage({
                                event: e,
                                data: {
                                    data: t.data
                                }
                            });
                        } catch (i) {
                            console.error(i.stack);
                        }
                    };
                    this.attachToDocument = function(e) {
                        if (this.$doc) this.terminate();
                        this.$doc = e;
                        this.call("setValue", [
                            e.getValue()
                        ]);
                        e.on("change", this.changeListener);
                    };
                    this.changeListener = function(e) {
                        if (!this.deltaQueue) {
                            this.deltaQueue = [];
                            setTimeout(this.$sendDeltaQueue, 0);
                        }
                        if (e.action == "insert") this.deltaQueue.push(e.start, e.lines);
                        else this.deltaQueue.push(e.start, e.end);
                    };
                    this.$sendDeltaQueue = function() {
                        var e = this.deltaQueue;
                        if (!e) return;
                        this.deltaQueue = null;
                        if (e.length > 50 && e.length > this.$doc.getLength() >> 1) {
                            this.call("setValue", [
                                this.$doc.getValue()
                            ]);
                        } else this.emit("change", {
                            data: e
                        });
                    };
                }.call(h.prototype));
                var c = function(e, t, i) {
                    var n = null;
                    var r = false;
                    var a = Object.create(s);
                    var l = [];
                    var c = new h({
                        messageBuffer: l,
                        terminate: function() {},
                        postMessage: function(e) {
                            l.push(e);
                            if (!n) return;
                            if (r) setTimeout(u);
                            else u();
                        }
                    });
                    c.setEmitSync = function(e) {
                        r = e;
                    };
                    var u = function() {
                        var e = l.shift();
                        if (e.command) n[e.command].apply(n, e.args);
                        else if (e.event) a._signal(e.event, e.data);
                    };
                    a.postMessage = function(e) {
                        c.onMessage({
                            data: e
                        });
                    };
                    a.callback = function(e, t) {
                        this.postMessage({
                            type: "call",
                            id: t,
                            data: e
                        });
                    };
                    a.emit = function(e, t) {
                        this.postMessage({
                            type: "event",
                            name: e,
                            data: t
                        });
                    };
                    o.loadModule([
                        "worker",
                        t
                    ], function(e) {
                        n = new e[i](a);
                        while(l.length)u();
                    });
                    return c;
                };
                t.UIWorkerClient = c;
                t.WorkerClient = h;
                t.createWorker = l;
            });
            ace.define("ace/placeholder", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/event_emitter",
                "ace/lib/oop", 
            ], function(e, t, i) {
                "use strict";
                var n = e("./range").Range;
                var r = e("./lib/event_emitter").EventEmitter;
                var s = e("./lib/oop");
                var o = function(e, t, i, n, r, s) {
                    var o = this;
                    this.length = t;
                    this.session = e;
                    this.doc = e.getDocument();
                    this.mainClass = r;
                    this.othersClass = s;
                    this.$onUpdate = this.onUpdate.bind(this);
                    this.doc.on("change", this.$onUpdate);
                    this.$others = n;
                    this.$onCursorChange = function() {
                        setTimeout(function() {
                            o.onCursorChange();
                        });
                    };
                    this.$pos = i;
                    var a = e.getUndoManager().$undoStack || e.getUndoManager().$undostack || {
                        length: -1
                    };
                    this.$undoStackDepth = a.length;
                    this.setup();
                    e.selection.on("changeCursor", this.$onCursorChange);
                };
                (function() {
                    s.implement(this, r);
                    this.setup = function() {
                        var e = this;
                        var t = this.doc;
                        var i = this.session;
                        this.selectionBefore = i.selection.toJSON();
                        if (i.selection.inMultiSelectMode) i.selection.toSingleRange();
                        this.pos = t.createAnchor(this.$pos.row, this.$pos.column);
                        var r = this.pos;
                        r.$insertRight = true;
                        r.detach();
                        r.markerId = i.addMarker(new n(r.row, r.column, r.row, r.column + this.length), this.mainClass, null, false);
                        this.others = [];
                        this.$others.forEach(function(i) {
                            var n = t.createAnchor(i.row, i.column);
                            n.$insertRight = true;
                            n.detach();
                            e.others.push(n);
                        });
                        i.setUndoSelect(false);
                    };
                    this.showOtherMarkers = function() {
                        if (this.othersActive) return;
                        var e = this.session;
                        var t = this;
                        this.othersActive = true;
                        this.others.forEach(function(i) {
                            i.markerId = e.addMarker(new n(i.row, i.column, i.row, i.column + t.length), t.othersClass, null, false);
                        });
                    };
                    this.hideOtherMarkers = function() {
                        if (!this.othersActive) return;
                        this.othersActive = false;
                        for(var e = 0; e < this.others.length; e++){
                            this.session.removeMarker(this.others[e].markerId);
                        }
                    };
                    this.onUpdate = function(e) {
                        if (this.$updating) return this.updateAnchors(e);
                        var t = e;
                        if (t.start.row !== t.end.row) return;
                        if (t.start.row !== this.pos.row) return;
                        this.$updating = true;
                        var i = e.action === "insert" ? t.end.column - t.start.column : t.start.column - t.end.column;
                        var r = t.start.column >= this.pos.column && t.start.column <= this.pos.column + this.length + 1;
                        var s = t.start.column - this.pos.column;
                        this.updateAnchors(e);
                        if (r) this.length += i;
                        if (r && !this.session.$fromUndo) {
                            if (e.action === "insert") {
                                for(var o = this.others.length - 1; o >= 0; o--){
                                    var a = this.others[o];
                                    var l = {
                                        row: a.row,
                                        column: a.column + s
                                    };
                                    this.doc.insertMergedLines(l, e.lines);
                                }
                            } else if (e.action === "remove") {
                                for(var o = this.others.length - 1; o >= 0; o--){
                                    var a = this.others[o];
                                    var l = {
                                        row: a.row,
                                        column: a.column + s
                                    };
                                    this.doc.remove(new n(l.row, l.column, l.row, l.column - i));
                                }
                            }
                        }
                        this.$updating = false;
                        this.updateMarkers();
                    };
                    this.updateAnchors = function(e) {
                        this.pos.onChange(e);
                        for(var t = this.others.length; t--;)this.others[t].onChange(e);
                        this.updateMarkers();
                    };
                    this.updateMarkers = function() {
                        if (this.$updating) return;
                        var e = this;
                        var t = this.session;
                        var i = function(i, r) {
                            t.removeMarker(i.markerId);
                            i.markerId = t.addMarker(new n(i.row, i.column, i.row, i.column + e.length), r, null, false);
                        };
                        i(this.pos, this.mainClass);
                        for(var r = this.others.length; r--;)i(this.others[r], this.othersClass);
                    };
                    this.onCursorChange = function(e) {
                        if (this.$updating || !this.session) return;
                        var t = this.session.selection.getCursor();
                        if (t.row === this.pos.row && t.column >= this.pos.column && t.column <= this.pos.column + this.length) {
                            this.showOtherMarkers();
                            this._emit("cursorEnter", e);
                        } else {
                            this.hideOtherMarkers();
                            this._emit("cursorLeave", e);
                        }
                    };
                    this.detach = function() {
                        this.session.removeMarker(this.pos && this.pos.markerId);
                        this.hideOtherMarkers();
                        this.doc.off("change", this.$onUpdate);
                        this.session.selection.off("changeCursor", this.$onCursorChange);
                        this.session.setUndoSelect(true);
                        this.session = null;
                    };
                    this.cancel = function() {
                        if (this.$undoStackDepth === -1) return;
                        var e = this.session.getUndoManager();
                        var t = (e.$undoStack || e.$undostack).length - this.$undoStackDepth;
                        for(var i = 0; i < t; i++){
                            e.undo(this.session, true);
                        }
                        if (this.selectionBefore) this.session.selection.fromJSON(this.selectionBefore);
                    };
                }.call(o.prototype));
                t.PlaceHolder = o;
            });
            ace.define("ace/mouse/multi_select_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(e, t, i) {
                var n = e("../lib/event");
                var r = e("../lib/useragent");
                function s(e, t) {
                    return e.row == t.row && e.column == t.column;
                }
                function o(e) {
                    var t = e.domEvent;
                    var i = t.altKey;
                    var o = t.shiftKey;
                    var a = t.ctrlKey;
                    var l = e.getAccelKey();
                    var h = e.getButton();
                    if (a && r.isMac) h = t.button;
                    if (e.editor.inMultiSelectMode && h == 2) {
                        e.editor.textInput.onContextMenu(e.domEvent);
                        return;
                    }
                    if (!a && !i && !l) {
                        if (h === 0 && e.editor.inMultiSelectMode) e.editor.exitMultiSelectMode();
                        return;
                    }
                    if (h !== 0) return;
                    var c = e.editor;
                    var u = c.selection;
                    var d = c.inMultiSelectMode;
                    var f = e.getDocumentPosition();
                    var g = u.getCursor();
                    var m = e.inSelection() || (u.isEmpty() && s(f, g));
                    var v = e.x, p = e.y;
                    var w = function(e) {
                        v = e.clientX;
                        p = e.clientY;
                    };
                    var $ = c.session;
                    var b = c.renderer.pixelToScreenCoordinates(v, p);
                    var y = b;
                    var C;
                    if (c.$mouseHandler.$enableJumpToDef) {
                        if ((a && i) || (l && i)) C = o ? "block" : "add";
                        else if (i && c.$blockSelectEnabled) C = "block";
                    } else {
                        if (l && !i) {
                            C = "add";
                            if (!d && o) return;
                        } else if (i && c.$blockSelectEnabled) {
                            C = "block";
                        }
                    }
                    if (C && r.isMac && t.ctrlKey) {
                        c.$mouseHandler.cancelContextMenu();
                    }
                    if (C == "add") {
                        if (!d && m) return;
                        if (!d) {
                            var S = u.toOrientedRange();
                            c.addSelectionMarker(S);
                        }
                        var k = u.rangeList.rangeAtPoint(f);
                        c.inVirtualSelectionMode = true;
                        if (o) {
                            k = null;
                            S = u.ranges[0] || S;
                            c.removeSelectionMarker(S);
                        }
                        c.once("mouseup", function() {
                            var e = u.toOrientedRange();
                            if (k && e.isEmpty() && s(k.cursor, e.cursor)) u.substractPoint(e.cursor);
                            else {
                                if (o) {
                                    u.substractPoint(S.cursor);
                                } else if (S) {
                                    c.removeSelectionMarker(S);
                                    u.addRange(S);
                                }
                                u.addRange(e);
                            }
                            c.inVirtualSelectionMode = false;
                        });
                    } else if (C == "block") {
                        e.stop();
                        c.inVirtualSelectionMode = true;
                        var x;
                        var A = [];
                        var L = function() {
                            var e = c.renderer.pixelToScreenCoordinates(v, p);
                            var t = $.screenToDocumentPosition(e.row, e.column, e.offsetX);
                            if (s(y, e) && s(t, u.lead)) return;
                            y = e;
                            c.selection.moveToPosition(t);
                            c.renderer.scrollCursorIntoView();
                            c.removeSelectionMarkers(A);
                            A = u.rectangularRangeBlock(y, b);
                            if (c.$mouseHandler.$clickSelection && A.length == 1 && A[0].isEmpty()) A[0] = c.$mouseHandler.$clickSelection.clone();
                            A.forEach(c.addSelectionMarker, c);
                            c.updateSelectionMarkers();
                        };
                        if (d && !l) {
                            u.toSingleRange();
                        } else if (!d && l) {
                            x = u.toOrientedRange();
                            c.addSelectionMarker(x);
                        }
                        if (o) b = $.documentToScreenPosition(u.lead);
                        else u.moveToPosition(f);
                        y = {
                            row: -1,
                            column: -1
                        };
                        var R = function(e) {
                            L();
                            clearInterval(E);
                            c.removeSelectionMarkers(A);
                            if (!A.length) A = [
                                u.toOrientedRange()
                            ];
                            if (x) {
                                c.removeSelectionMarker(x);
                                u.toSingleRange(x);
                            }
                            for(var t = 0; t < A.length; t++)u.addRange(A[t]);
                            c.inVirtualSelectionMode = false;
                            c.$mouseHandler.$clickSelection = null;
                        };
                        var M = L;
                        n.capture(c.container, w, R);
                        var E = setInterval(function() {
                            M();
                        }, 20);
                        return e.preventDefault();
                    }
                }
                t.onMouseDown = o;
            });
            ace.define("ace/commands/multi_select_commands", [
                "require",
                "exports",
                "module",
                "ace/keyboard/hash_handler"
            ], function(e, t, i) {
                t.defaultCommands = [
                    {
                        name: "addCursorAbove",
                        description: "Add cursor above",
                        exec: function(e) {
                            e.selectMoreLines(-1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Up",
                            mac: "Ctrl-Alt-Up"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "addCursorBelow",
                        description: "Add cursor below",
                        exec: function(e) {
                            e.selectMoreLines(1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Down",
                            mac: "Ctrl-Alt-Down"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "addCursorAboveSkipCurrent",
                        description: "Add cursor above (skip current)",
                        exec: function(e) {
                            e.selectMoreLines(-1, true);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Up",
                            mac: "Ctrl-Alt-Shift-Up"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "addCursorBelowSkipCurrent",
                        description: "Add cursor below (skip current)",
                        exec: function(e) {
                            e.selectMoreLines(1, true);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Down",
                            mac: "Ctrl-Alt-Shift-Down"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectMoreBefore",
                        description: "Select more before",
                        exec: function(e) {
                            e.selectMore(-1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Left",
                            mac: "Ctrl-Alt-Left"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectMoreAfter",
                        description: "Select more after",
                        exec: function(e) {
                            e.selectMore(1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Right",
                            mac: "Ctrl-Alt-Right"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectNextBefore",
                        description: "Select next before",
                        exec: function(e) {
                            e.selectMore(-1, true);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Left",
                            mac: "Ctrl-Alt-Shift-Left"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectNextAfter",
                        description: "Select next after",
                        exec: function(e) {
                            e.selectMore(1, true);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Right",
                            mac: "Ctrl-Alt-Shift-Right"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "toggleSplitSelectionIntoLines",
                        description: "Split into lines",
                        exec: function(e) {
                            if (e.multiSelect.rangeCount > 1) e.multiSelect.joinSelections();
                            else e.multiSelect.splitIntoLines();
                        },
                        bindKey: {
                            win: "Ctrl-Alt-L",
                            mac: "Ctrl-Alt-L"
                        },
                        readOnly: true
                    },
                    {
                        name: "splitSelectionIntoLines",
                        description: "Split into lines",
                        exec: function(e) {
                            e.multiSelect.splitIntoLines();
                        },
                        readOnly: true
                    },
                    {
                        name: "alignCursors",
                        description: "Align cursors",
                        exec: function(e) {
                            e.alignCursors();
                        },
                        bindKey: {
                            win: "Ctrl-Alt-A",
                            mac: "Ctrl-Alt-A"
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "findAll",
                        description: "Find all",
                        exec: function(e) {
                            e.findAll();
                        },
                        bindKey: {
                            win: "Ctrl-Alt-K",
                            mac: "Ctrl-Alt-G"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    }, 
                ];
                t.multiSelectCommands = [
                    {
                        name: "singleSelection",
                        description: "Single selection",
                        bindKey: "esc",
                        exec: function(e) {
                            e.exitMultiSelectMode();
                        },
                        scrollIntoView: "cursor",
                        readOnly: true,
                        isAvailable: function(e) {
                            return e && e.inMultiSelectMode;
                        }
                    }, 
                ];
                var n = e("../keyboard/hash_handler").HashHandler;
                t.keyboardHandler = new n(t.multiSelectCommands);
            });
            ace.define("ace/multi_select", [
                "require",
                "exports",
                "module",
                "ace/range_list",
                "ace/range",
                "ace/selection",
                "ace/mouse/multi_select_handler",
                "ace/lib/event",
                "ace/lib/lang",
                "ace/commands/multi_select_commands",
                "ace/search",
                "ace/edit_session",
                "ace/editor",
                "ace/config", 
            ], function(e, t, i) {
                var n = e("./range_list").RangeList;
                var r = e("./range").Range;
                var s = e("./selection").Selection;
                var o = e("./mouse/multi_select_handler").onMouseDown;
                var a = e("./lib/event");
                var l = e("./lib/lang");
                var h = e("./commands/multi_select_commands");
                t.commands = h.defaultCommands.concat(h.multiSelectCommands);
                var c = e("./search").Search;
                var u = new c();
                function d(e, t, i) {
                    u.$options.wrap = true;
                    u.$options.needle = t;
                    u.$options.backwards = i == -1;
                    return u.find(e);
                }
                var f = e("./edit_session").EditSession;
                (function() {
                    this.getSelectionMarkers = function() {
                        return this.$selectionMarkers;
                    };
                }.call(f.prototype));
                (function() {
                    this.ranges = null;
                    this.rangeList = null;
                    this.addRange = function(e, t) {
                        if (!e) return;
                        if (!this.inMultiSelectMode && this.rangeCount === 0) {
                            var i = this.toOrientedRange();
                            this.rangeList.add(i);
                            this.rangeList.add(e);
                            if (this.rangeList.ranges.length != 2) {
                                this.rangeList.removeAll();
                                return (t || this.fromOrientedRange(e));
                            }
                            this.rangeList.removeAll();
                            this.rangeList.add(i);
                            this.$onAddRange(i);
                        }
                        if (!e.cursor) e.cursor = e.end;
                        var n = this.rangeList.add(e);
                        this.$onAddRange(e);
                        if (n.length) this.$onRemoveRange(n);
                        if (this.rangeCount > 1 && !this.inMultiSelectMode) {
                            this._signal("multiSelect");
                            this.inMultiSelectMode = true;
                            this.session.$undoSelect = false;
                            this.rangeList.attach(this.session);
                        }
                        return (t || this.fromOrientedRange(e));
                    };
                    this.toSingleRange = function(e) {
                        e = e || this.ranges[0];
                        var t = this.rangeList.removeAll();
                        if (t.length) this.$onRemoveRange(t);
                        e && this.fromOrientedRange(e);
                    };
                    this.substractPoint = function(e) {
                        var t = this.rangeList.substractPoint(e);
                        if (t) {
                            this.$onRemoveRange(t);
                            return t[0];
                        }
                    };
                    this.mergeOverlappingRanges = function() {
                        var e = this.rangeList.merge();
                        if (e.length) this.$onRemoveRange(e);
                    };
                    this.$onAddRange = function(e) {
                        this.rangeCount = this.rangeList.ranges.length;
                        this.ranges.unshift(e);
                        this._signal("addRange", {
                            range: e
                        });
                    };
                    this.$onRemoveRange = function(e) {
                        this.rangeCount = this.rangeList.ranges.length;
                        if (this.rangeCount == 1 && this.inMultiSelectMode) {
                            var t = this.rangeList.ranges.pop();
                            e.push(t);
                            this.rangeCount = 0;
                        }
                        for(var i = e.length; i--;){
                            var n = this.ranges.indexOf(e[i]);
                            this.ranges.splice(n, 1);
                        }
                        this._signal("removeRange", {
                            ranges: e
                        });
                        if (this.rangeCount === 0 && this.inMultiSelectMode) {
                            this.inMultiSelectMode = false;
                            this._signal("singleSelect");
                            this.session.$undoSelect = true;
                            this.rangeList.detach(this.session);
                        }
                        t = t || this.ranges[0];
                        if (t && !t.isEqual(this.getRange())) this.fromOrientedRange(t);
                    };
                    this.$initRangeList = function() {
                        if (this.rangeList) return;
                        this.rangeList = new n();
                        this.ranges = [];
                        this.rangeCount = 0;
                    };
                    this.getAllRanges = function() {
                        return this.rangeCount ? this.rangeList.ranges.concat() : [
                            this.getRange()
                        ];
                    };
                    this.splitIntoLines = function() {
                        var e = this.ranges.length ? this.ranges : [
                            this.getRange()
                        ];
                        var t = [];
                        for(var i = 0; i < e.length; i++){
                            var n = e[i];
                            var s = n.start.row;
                            var o = n.end.row;
                            if (s === o) {
                                t.push(n.clone());
                            } else {
                                t.push(new r(s, n.start.column, s, this.session.getLine(s).length));
                                while(++s < o)t.push(this.getLineRange(s, true));
                                t.push(new r(o, 0, o, n.end.column));
                            }
                            if (i == 0 && !this.isBackwards()) t = t.reverse();
                        }
                        this.toSingleRange();
                        for(var i = t.length; i--;)this.addRange(t[i]);
                    };
                    this.joinSelections = function() {
                        var e = this.rangeList.ranges;
                        var t = e[e.length - 1];
                        var i = r.fromPoints(e[0].start, t.end);
                        this.toSingleRange();
                        this.setSelectionRange(i, t.cursor == t.start);
                    };
                    this.toggleBlockSelection = function() {
                        if (this.rangeCount > 1) {
                            var e = this.rangeList.ranges;
                            var t = e[e.length - 1];
                            var i = r.fromPoints(e[0].start, t.end);
                            this.toSingleRange();
                            this.setSelectionRange(i, t.cursor == t.start);
                        } else {
                            var n = this.session.documentToScreenPosition(this.cursor);
                            var s = this.session.documentToScreenPosition(this.anchor);
                            var o = this.rectangularRangeBlock(n, s);
                            o.forEach(this.addRange, this);
                        }
                    };
                    this.rectangularRangeBlock = function(e, t, i) {
                        var n = [];
                        var s = e.column < t.column;
                        if (s) {
                            var o = e.column;
                            var a = t.column;
                            var l = e.offsetX;
                            var h = t.offsetX;
                        } else {
                            var o = t.column;
                            var a = e.column;
                            var l = t.offsetX;
                            var h = e.offsetX;
                        }
                        var c = e.row < t.row;
                        if (c) {
                            var u = e.row;
                            var d = t.row;
                        } else {
                            var u = t.row;
                            var d = e.row;
                        }
                        if (o < 0) o = 0;
                        if (u < 0) u = 0;
                        if (u == d) i = true;
                        var f;
                        for(var g = u; g <= d; g++){
                            var v = r.fromPoints(this.session.screenToDocumentPosition(g, o, l), this.session.screenToDocumentPosition(g, a, h));
                            if (v.isEmpty()) {
                                if (f && m(v.end, f)) break;
                                f = v.end;
                            }
                            v.cursor = s ? v.start : v.end;
                            n.push(v);
                        }
                        if (c) n.reverse();
                        if (!i) {
                            var p = n.length - 1;
                            while(n[p].isEmpty() && p > 0)p--;
                            if (p > 0) {
                                var w = 0;
                                while(n[w].isEmpty())w++;
                            }
                            for(var $ = p; $ >= w; $--){
                                if (n[$].isEmpty()) n.splice($, 1);
                            }
                        }
                        return n;
                    };
                }.call(s.prototype));
                var g = e("./editor").Editor;
                (function() {
                    this.updateSelectionMarkers = function() {
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.addSelectionMarker = function(e) {
                        if (!e.cursor) e.cursor = e.end;
                        var t = this.getSelectionStyle();
                        e.marker = this.session.addMarker(e, "ace_selection", t);
                        this.session.$selectionMarkers.push(e);
                        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
                        return e;
                    };
                    this.removeSelectionMarker = function(e) {
                        if (!e.marker) return;
                        this.session.removeMarker(e.marker);
                        var t = this.session.$selectionMarkers.indexOf(e);
                        if (t != -1) this.session.$selectionMarkers.splice(t, 1);
                        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
                    };
                    this.removeSelectionMarkers = function(e) {
                        var t = this.session.$selectionMarkers;
                        for(var i = e.length; i--;){
                            var n = e[i];
                            if (!n.marker) continue;
                            this.session.removeMarker(n.marker);
                            var r = t.indexOf(n);
                            if (r != -1) t.splice(r, 1);
                        }
                        this.session.selectionMarkerCount = t.length;
                    };
                    this.$onAddRange = function(e) {
                        this.addSelectionMarker(e.range);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.$onRemoveRange = function(e) {
                        this.removeSelectionMarkers(e.ranges);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.$onMultiSelect = function(e) {
                        if (this.inMultiSelectMode) return;
                        this.inMultiSelectMode = true;
                        this.setStyle("ace_multiselect");
                        this.keyBinding.addKeyboardHandler(h.keyboardHandler);
                        this.commands.setDefaultHandler("exec", this.$onMultiSelectExec);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.$onSingleSelect = function(e) {
                        if (this.session.multiSelect.inVirtualMode) return;
                        this.inMultiSelectMode = false;
                        this.unsetStyle("ace_multiselect");
                        this.keyBinding.removeKeyboardHandler(h.keyboardHandler);
                        this.commands.removeDefaultHandler("exec", this.$onMultiSelectExec);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                        this._emit("changeSelection");
                    };
                    this.$onMultiSelectExec = function(e) {
                        var t = e.command;
                        var i = e.editor;
                        if (!i.multiSelect) return;
                        if (!t.multiSelectAction) {
                            var n = t.exec(i, e.args || {});
                            i.multiSelect.addRange(i.multiSelect.toOrientedRange());
                            i.multiSelect.mergeOverlappingRanges();
                        } else if (t.multiSelectAction == "forEach") {
                            n = i.forEachSelection(t, e.args);
                        } else if (t.multiSelectAction == "forEachLine") {
                            n = i.forEachSelection(t, e.args, true);
                        } else if (t.multiSelectAction == "single") {
                            i.exitMultiSelectMode();
                            n = t.exec(i, e.args || {});
                        } else {
                            n = t.multiSelectAction(i, e.args || {});
                        }
                        return n;
                    };
                    this.forEachSelection = function(e, t, i) {
                        if (this.inVirtualSelectionMode) return;
                        var n = i && i.keepOrder;
                        var r = i == true || (i && i.$byLines);
                        var o = this.session;
                        var a = this.selection;
                        var l = a.rangeList;
                        var h = (n ? a : l).ranges;
                        var c;
                        if (!h.length) return e.exec ? e.exec(this, t || {}) : e(this, t || {});
                        var u = a._eventRegistry;
                        a._eventRegistry = {};
                        var d = new s(o);
                        this.inVirtualSelectionMode = true;
                        for(var f = h.length; f--;){
                            if (r) {
                                while(f > 0 && h[f].start.row == h[f - 1].end.row)f--;
                            }
                            d.fromOrientedRange(h[f]);
                            d.index = f;
                            this.selection = o.selection = d;
                            var g = e.exec ? e.exec(this, t || {}) : e(this, t || {});
                            if (!c && g !== undefined) c = g;
                            d.toOrientedRange(h[f]);
                        }
                        d.detach();
                        this.selection = o.selection = a;
                        this.inVirtualSelectionMode = false;
                        a._eventRegistry = u;
                        a.mergeOverlappingRanges();
                        if (a.ranges[0]) a.fromOrientedRange(a.ranges[0]);
                        var m = this.renderer.$scrollAnimation;
                        this.onCursorChange();
                        this.onSelectionChange();
                        if (m && m.from == m.to) this.renderer.animateScrolling(m.from);
                        return c;
                    };
                    this.exitMultiSelectMode = function() {
                        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) return;
                        this.multiSelect.toSingleRange();
                    };
                    this.getSelectedText = function() {
                        var e = "";
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            var t = this.multiSelect.rangeList.ranges;
                            var i = [];
                            for(var n = 0; n < t.length; n++){
                                i.push(this.session.getTextRange(t[n]));
                            }
                            var r = this.session.getDocument().getNewLineCharacter();
                            e = i.join(r);
                            if (e.length == (i.length - 1) * r.length) e = "";
                        } else if (!this.selection.isEmpty()) {
                            e = this.session.getTextRange(this.getSelectionRange());
                        }
                        return e;
                    };
                    this.$checkMultiselectChange = function(e, t) {
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            var i = this.multiSelect.ranges[0];
                            if (this.multiSelect.isEmpty() && t == this.multiSelect.anchor) return;
                            var n = t == this.multiSelect.anchor ? i.cursor == i.start ? i.end : i.start : i.cursor;
                            if (n.row != t.row || this.session.$clipPositionToDocument(n.row, n.column).column != t.column) this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange());
                            else this.multiSelect.mergeOverlappingRanges();
                        }
                    };
                    this.findAll = function(e, t, i) {
                        t = t || {};
                        t.needle = e || t.needle;
                        if (t.needle == undefined) {
                            var n = this.selection.isEmpty() ? this.selection.getWordRange() : this.selection.getRange();
                            t.needle = this.session.getTextRange(n);
                        }
                        this.$search.set(t);
                        var r = this.$search.findAll(this.session);
                        if (!r.length) return 0;
                        var s = this.multiSelect;
                        if (!i) s.toSingleRange(r[0]);
                        for(var o = r.length; o--;)s.addRange(r[o], true);
                        if (n && s.rangeList.rangeAtPoint(n.start)) s.addRange(n, true);
                        return r.length;
                    };
                    this.selectMoreLines = function(e, t) {
                        var i = this.selection.toOrientedRange();
                        var n = i.cursor == i.end;
                        var s = this.session.documentToScreenPosition(i.cursor);
                        if (this.selection.$desiredColumn) s.column = this.selection.$desiredColumn;
                        var o = this.session.screenToDocumentPosition(s.row + e, s.column);
                        if (!i.isEmpty()) {
                            var a = this.session.documentToScreenPosition(n ? i.end : i.start);
                            var l = this.session.screenToDocumentPosition(a.row + e, a.column);
                        } else {
                            var l = o;
                        }
                        if (n) {
                            var h = r.fromPoints(o, l);
                            h.cursor = h.start;
                        } else {
                            var h = r.fromPoints(l, o);
                            h.cursor = h.end;
                        }
                        h.desiredColumn = s.column;
                        if (!this.selection.inMultiSelectMode) {
                            this.selection.addRange(i);
                        } else {
                            if (t) var c = i.cursor;
                        }
                        this.selection.addRange(h);
                        if (c) this.selection.substractPoint(c);
                    };
                    this.transposeSelections = function(e) {
                        var t = this.session;
                        var i = t.multiSelect;
                        var n = i.ranges;
                        for(var r = n.length; r--;){
                            var s = n[r];
                            if (s.isEmpty()) {
                                var o = t.getWordRange(s.start.row, s.start.column);
                                s.start.row = o.start.row;
                                s.start.column = o.start.column;
                                s.end.row = o.end.row;
                                s.end.column = o.end.column;
                            }
                        }
                        i.mergeOverlappingRanges();
                        var a = [];
                        for(var r = n.length; r--;){
                            var s = n[r];
                            a.unshift(t.getTextRange(s));
                        }
                        if (e < 0) a.unshift(a.pop());
                        else a.push(a.shift());
                        for(var r = n.length; r--;){
                            var s = n[r];
                            var o = s.clone();
                            t.replace(s, a[r]);
                            s.start.row = o.start.row;
                            s.start.column = o.start.column;
                        }
                        i.fromOrientedRange(i.ranges[0]);
                    };
                    this.selectMore = function(e, t, i) {
                        var n = this.session;
                        var r = n.multiSelect;
                        var s = r.toOrientedRange();
                        if (s.isEmpty()) {
                            s = n.getWordRange(s.start.row, s.start.column);
                            s.cursor = e == -1 ? s.start : s.end;
                            this.multiSelect.addRange(s);
                            if (i) return;
                        }
                        var o = n.getTextRange(s);
                        var a = d(n, o, e);
                        if (a) {
                            a.cursor = e == -1 ? a.start : a.end;
                            this.session.unfold(a);
                            this.multiSelect.addRange(a);
                            this.renderer.scrollCursorIntoView(null, 0.5);
                        }
                        if (t) this.multiSelect.substractPoint(s.cursor);
                    };
                    this.alignCursors = function() {
                        var e = this.session;
                        var t = e.multiSelect;
                        var i = t.ranges;
                        var n = -1;
                        var s = i.filter(function(e) {
                            if (e.cursor.row == n) return true;
                            n = e.cursor.row;
                        });
                        if (!i.length || s.length == i.length - 1) {
                            var o = this.selection.getRange();
                            var a = o.start.row, h = o.end.row;
                            var c = a == h;
                            if (c) {
                                var u = this.session.getLength();
                                var d;
                                do {
                                    d = this.session.getLine(h);
                                }while (/[=:]/.test(d) && ++h < u)
                                do {
                                    d = this.session.getLine(a);
                                }while (/[=:]/.test(d) && --a > 0)
                                if (a < 0) a = 0;
                                if (h >= u) h = u - 1;
                            }
                            var f = this.session.removeFullLines(a, h);
                            f = this.$reAlignText(f, c);
                            this.session.insert({
                                row: a,
                                column: 0
                            }, f.join("\n") + "\n");
                            if (!c) {
                                o.start.column = 0;
                                o.end.column = f[f.length - 1].length;
                            }
                            this.selection.setRange(o);
                        } else {
                            s.forEach(function(e) {
                                t.substractPoint(e.cursor);
                            });
                            var g = 0;
                            var m = Infinity;
                            var v = i.map(function(t) {
                                var i = t.cursor;
                                var n = e.getLine(i.row);
                                var r = n.substr(i.column).search(/\S/g);
                                if (r == -1) r = 0;
                                if (i.column > g) g = i.column;
                                if (r < m) m = r;
                                return r;
                            });
                            i.forEach(function(t, i) {
                                var n = t.cursor;
                                var s = g - n.column;
                                var o = v[i] - m;
                                if (s > o) e.insert(n, l.stringRepeat(" ", s - o));
                                else e.remove(new r(n.row, n.column, n.row, n.column - s + o));
                                t.start.column = t.end.column = g;
                                t.start.row = t.end.row = n.row;
                                t.cursor = t.end;
                            });
                            t.fromOrientedRange(i[0]);
                            this.renderer.updateCursor();
                            this.renderer.updateBackMarkers();
                        }
                    };
                    this.$reAlignText = function(e, t) {
                        var i = true, n = true;
                        var r, s, o;
                        return e.map(function(e) {
                            var t = e.match(/(\s*)(.*?)(\s*)([=:].*)/);
                            if (!t) return [
                                e
                            ];
                            if (r == null) {
                                r = t[1].length;
                                s = t[2].length;
                                o = t[3].length;
                                return t;
                            }
                            if (r + s + o != t[1].length + t[2].length + t[3].length) n = false;
                            if (r != t[1].length) i = false;
                            if (r > t[1].length) r = t[1].length;
                            if (s < t[2].length) s = t[2].length;
                            if (o > t[3].length) o = t[3].length;
                            return t;
                        }).map(t ? h : i ? n ? c : h : u);
                        function a(e) {
                            return l.stringRepeat(" ", e);
                        }
                        function h(e) {
                            return !e[2] ? e[0] : a(r) + e[2] + a(s - e[2].length + o) + e[4].replace(/^([=:])\s+/, "$1 ");
                        }
                        function c(e) {
                            return !e[2] ? e[0] : a(r + s - e[2].length) + e[2] + a(o) + e[4].replace(/^([=:])\s+/, "$1 ");
                        }
                        function u(e) {
                            return !e[2] ? e[0] : a(r) + e[2] + a(o) + e[4].replace(/^([=:])\s+/, "$1 ");
                        }
                    };
                }.call(g.prototype));
                function m(e, t) {
                    return e.row == t.row && e.column == t.column;
                }
                t.onSessionChange = function(e) {
                    var t = e.session;
                    if (t && !t.multiSelect) {
                        t.$selectionMarkers = [];
                        t.selection.$initRangeList();
                        t.multiSelect = t.selection;
                    }
                    this.multiSelect = t && t.multiSelect;
                    var i = e.oldSession;
                    if (i) {
                        i.multiSelect.off("addRange", this.$onAddRange);
                        i.multiSelect.off("removeRange", this.$onRemoveRange);
                        i.multiSelect.off("multiSelect", this.$onMultiSelect);
                        i.multiSelect.off("singleSelect", this.$onSingleSelect);
                        i.multiSelect.lead.off("change", this.$checkMultiselectChange);
                        i.multiSelect.anchor.off("change", this.$checkMultiselectChange);
                    }
                    if (t) {
                        t.multiSelect.on("addRange", this.$onAddRange);
                        t.multiSelect.on("removeRange", this.$onRemoveRange);
                        t.multiSelect.on("multiSelect", this.$onMultiSelect);
                        t.multiSelect.on("singleSelect", this.$onSingleSelect);
                        t.multiSelect.lead.on("change", this.$checkMultiselectChange);
                        t.multiSelect.anchor.on("change", this.$checkMultiselectChange);
                    }
                    if (t && this.inMultiSelectMode != t.selection.inMultiSelectMode) {
                        if (t.selection.inMultiSelectMode) this.$onMultiSelect();
                        else this.$onSingleSelect();
                    }
                };
                function v(e) {
                    if (e.$multiselectOnSessionChange) return;
                    e.$onAddRange = e.$onAddRange.bind(e);
                    e.$onRemoveRange = e.$onRemoveRange.bind(e);
                    e.$onMultiSelect = e.$onMultiSelect.bind(e);
                    e.$onSingleSelect = e.$onSingleSelect.bind(e);
                    e.$multiselectOnSessionChange = t.onSessionChange.bind(e);
                    e.$checkMultiselectChange = e.$checkMultiselectChange.bind(e);
                    e.$multiselectOnSessionChange(e);
                    e.on("changeSession", e.$multiselectOnSessionChange);
                    e.on("mousedown", o);
                    e.commands.addCommands(h.defaultCommands);
                    p(e);
                }
                function p(e) {
                    if (!e.textInput) return;
                    var t = e.textInput.getElement();
                    var i = false;
                    a.addListener(t, "keydown", function(t) {
                        var r = t.keyCode == 18 && !(t.ctrlKey || t.shiftKey || t.metaKey);
                        if (e.$blockSelectEnabled && r) {
                            if (!i) {
                                e.renderer.setMouseCursor("crosshair");
                                i = true;
                            }
                        } else if (i) {
                            n();
                        }
                    }, e);
                    a.addListener(t, "keyup", n, e);
                    a.addListener(t, "blur", n, e);
                    function n(t) {
                        if (i) {
                            e.renderer.setMouseCursor("");
                            i = false;
                        }
                    }
                }
                t.MultiSelect = v;
                e("./config").defineOptions(g.prototype, "editor", {
                    enableMultiselect: {
                        set: function(e) {
                            v(this);
                            if (e) {
                                this.on("changeSession", this.$multiselectOnSessionChange);
                                this.on("mousedown", o);
                            } else {
                                this.off("changeSession", this.$multiselectOnSessionChange);
                                this.off("mousedown", o);
                            }
                        },
                        value: true
                    },
                    enableBlockSelect: {
                        set: function(e) {
                            this.$blockSelectEnabled = e;
                        },
                        value: true
                    }
                });
            });
            ace.define("ace/mode/folding/fold_mode", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(e, t, i) {
                "use strict";
                var n = e("../../range").Range;
                var r = (t.FoldMode = function() {});
                (function() {
                    this.foldingStartMarker = null;
                    this.foldingStopMarker = null;
                    this.getFoldWidget = function(e, t, i) {
                        var n = e.getLine(i);
                        if (this.foldingStartMarker.test(n)) return "start";
                        if (t == "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(n)) return "end";
                        return "";
                    };
                    this.getFoldWidgetRange = function(e, t, i) {
                        return null;
                    };
                    this.indentationBlock = function(e, t, i) {
                        var r = /\S/;
                        var s = e.getLine(t);
                        var o = s.search(r);
                        if (o == -1) return;
                        var a = i || s.length;
                        var l = e.getLength();
                        var h = t;
                        var c = t;
                        while(++t < l){
                            var u = e.getLine(t).search(r);
                            if (u == -1) continue;
                            if (u <= o) {
                                var d = e.getTokenAt(t, 0);
                                if (!d || d.type !== "string") break;
                            }
                            c = t;
                        }
                        if (c > h) {
                            var f = e.getLine(c).length;
                            return new n(h, a, c, f);
                        }
                    };
                    this.openingBracketBlock = function(e, t, i, r, s) {
                        var o = {
                            row: i,
                            column: r + 1
                        };
                        var a = e.$findClosingBracket(t, o, s);
                        if (!a) return;
                        var l = e.foldWidgets[a.row];
                        if (l == null) l = e.getFoldWidget(a.row);
                        if (l == "start" && a.row > o.row) {
                            a.row--;
                            a.column = e.getLine(a.row).length;
                        }
                        return n.fromPoints(o, a);
                    };
                    this.closingBracketBlock = function(e, t, i, r, s) {
                        var o = {
                            row: i,
                            column: r
                        };
                        var a = e.$findOpeningBracket(t, o);
                        if (!a) return;
                        a.column++;
                        o.column--;
                        return n.fromPoints(a, o);
                    };
                }.call(r.prototype));
            });
            ace.define("ace/theme/textmate", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                t.isDark = false;
                t.cssClass = "ace-tm";
                t.cssText = '.ace-tm .ace_gutter {\
background: #f0f0f0;\
color: #333;\
}\
.ace-tm .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-tm .ace_fold {\
background-color: #6B72E6;\
}\
.ace-tm {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-tm .ace_cursor {\
color: black;\
}\
.ace-tm .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-tm .ace_storage,\
.ace-tm .ace_keyword {\
color: blue;\
}\
.ace-tm .ace_constant {\
color: rgb(197, 6, 11);\
}\
.ace-tm .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-tm .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-tm .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-tm .ace_invalid {\
background-color: rgba(255, 0, 0, 0.1);\
color: red;\
}\
.ace-tm .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-tm .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-tm .ace_support.ace_type,\
.ace-tm .ace_support.ace_class {\
color: rgb(109, 121, 222);\
}\
.ace-tm .ace_keyword.ace_operator {\
color: rgb(104, 118, 135);\
}\
.ace-tm .ace_string {\
color: rgb(3, 106, 7);\
}\
.ace-tm .ace_comment {\
color: rgb(76, 136, 107);\
}\
.ace-tm .ace_comment.ace_doc {\
color: rgb(0, 102, 255);\
}\
.ace-tm .ace_comment.ace_doc.ace_tag {\
color: rgb(128, 159, 191);\
}\
.ace-tm .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-tm .ace_variable {\
color: rgb(49, 132, 149);\
}\
.ace-tm .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-tm .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-tm .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-tm .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-tm .ace_meta.ace_tag {\
color:rgb(0, 22, 142);\
}\
.ace-tm .ace_string.ace_regex {\
color: rgb(255, 0, 0)\
}\
.ace-tm .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-tm.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px white;\
}\
.ace-tm .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-tm .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-tm .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-tm .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.07);\
}\
.ace-tm .ace_gutter-active-line {\
background-color : #dcdcdc;\
}\
.ace-tm .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-tm .ace_indent-guide {\
background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y;\
}\
';
                t.$id = "ace/theme/textmate";
                var n = e("../lib/dom");
                n.importCssString(t.cssText, t.cssClass, false);
            });
            ace.define("ace/line_widgets", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(e, t, i) {
                "use strict";
                var n = e("./lib/dom");
                function r(e) {
                    this.session = e;
                    this.session.widgetManager = this;
                    this.session.getRowLength = this.getRowLength;
                    this.session.$getWidgetScreenLength = this.$getWidgetScreenLength;
                    this.updateOnChange = this.updateOnChange.bind(this);
                    this.renderWidgets = this.renderWidgets.bind(this);
                    this.measureWidgets = this.measureWidgets.bind(this);
                    this.session._changedWidgets = [];
                    this.$onChangeEditor = this.$onChangeEditor.bind(this);
                    this.session.on("change", this.updateOnChange);
                    this.session.on("changeFold", this.updateOnFold);
                    this.session.on("changeEditor", this.$onChangeEditor);
                }
                (function() {
                    this.getRowLength = function(e) {
                        var t;
                        if (this.lineWidgets) t = (this.lineWidgets[e] && this.lineWidgets[e].rowCount) || 0;
                        else t = 0;
                        if (!this.$useWrapMode || !this.$wrapData[e]) {
                            return 1 + t;
                        } else {
                            return this.$wrapData[e].length + 1 + t;
                        }
                    };
                    this.$getWidgetScreenLength = function() {
                        var e = 0;
                        this.lineWidgets.forEach(function(t) {
                            if (t && t.rowCount && !t.hidden) e += t.rowCount;
                        });
                        return e;
                    };
                    this.$onChangeEditor = function(e) {
                        this.attach(e.editor);
                    };
                    this.attach = function(e) {
                        if (e && e.widgetManager && e.widgetManager != this) e.widgetManager.detach();
                        if (this.editor == e) return;
                        this.detach();
                        this.editor = e;
                        if (e) {
                            e.widgetManager = this;
                            e.renderer.on("beforeRender", this.measureWidgets);
                            e.renderer.on("afterRender", this.renderWidgets);
                        }
                    };
                    this.detach = function(e) {
                        var t = this.editor;
                        if (!t) return;
                        this.editor = null;
                        t.widgetManager = null;
                        t.renderer.off("beforeRender", this.measureWidgets);
                        t.renderer.off("afterRender", this.renderWidgets);
                        var i = this.session.lineWidgets;
                        i && i.forEach(function(e) {
                            if (e && e.el && e.el.parentNode) {
                                e._inDocument = false;
                                e.el.parentNode.removeChild(e.el);
                            }
                        });
                    };
                    this.updateOnFold = function(e, t) {
                        var i = t.lineWidgets;
                        if (!i || !e.action) return;
                        var n = e.data;
                        var r = n.start.row;
                        var s = n.end.row;
                        var o = e.action == "add";
                        for(var a = r + 1; a < s; a++){
                            if (i[a]) i[a].hidden = o;
                        }
                        if (i[s]) {
                            if (o) {
                                if (!i[r]) i[r] = i[s];
                                else i[s].hidden = o;
                            } else {
                                if (i[r] == i[s]) i[r] = undefined;
                                i[s].hidden = o;
                            }
                        }
                    };
                    this.updateOnChange = function(e) {
                        var t = this.session.lineWidgets;
                        if (!t) return;
                        var i = e.start.row;
                        var n = e.end.row - i;
                        if (n === 0) {} else if (e.action == "remove") {
                            var r = t.splice(i + 1, n);
                            if (!t[i] && r[r.length - 1]) {
                                t[i] = r.pop();
                            }
                            r.forEach(function(e) {
                                e && this.removeLineWidget(e);
                            }, this);
                            this.$updateRows();
                        } else {
                            var s = new Array(n);
                            if (t[i] && t[i].column != null) {
                                if (e.start.column > t[i].column) i++;
                            }
                            s.unshift(i, 0);
                            t.splice.apply(t, s);
                            this.$updateRows();
                        }
                    };
                    this.$updateRows = function() {
                        var e = this.session.lineWidgets;
                        if (!e) return;
                        var t = true;
                        e.forEach(function(e, i) {
                            if (e) {
                                t = false;
                                e.row = i;
                                while(e.$oldWidget){
                                    e.$oldWidget.row = i;
                                    e = e.$oldWidget;
                                }
                            }
                        });
                        if (t) this.session.lineWidgets = null;
                    };
                    this.$registerLineWidget = function(e) {
                        if (!this.session.lineWidgets) this.session.lineWidgets = new Array(this.session.getLength());
                        var t = this.session.lineWidgets[e.row];
                        if (t) {
                            e.$oldWidget = t;
                            if (t.el && t.el.parentNode) {
                                t.el.parentNode.removeChild(t.el);
                                t._inDocument = false;
                            }
                        }
                        this.session.lineWidgets[e.row] = e;
                        return e;
                    };
                    this.addLineWidget = function(e) {
                        this.$registerLineWidget(e);
                        e.session = this.session;
                        if (!this.editor) return e;
                        var t = this.editor.renderer;
                        if (e.html && !e.el) {
                            e.el = n.createElement("div");
                            e.el.innerHTML = e.html;
                        }
                        if (e.el) {
                            n.addCssClass(e.el, "ace_lineWidgetContainer");
                            e.el.style.position = "absolute";
                            e.el.style.zIndex = 5;
                            t.container.appendChild(e.el);
                            e._inDocument = true;
                            if (!e.coverGutter) {
                                e.el.style.zIndex = 3;
                            }
                            if (e.pixelHeight == null) {
                                e.pixelHeight = e.el.offsetHeight;
                            }
                        }
                        if (e.rowCount == null) {
                            e.rowCount = e.pixelHeight / t.layerConfig.lineHeight;
                        }
                        var i = this.session.getFoldAt(e.row, 0);
                        e.$fold = i;
                        if (i) {
                            var r = this.session.lineWidgets;
                            if (e.row == i.end.row && !r[i.start.row]) r[i.start.row] = e;
                            else e.hidden = true;
                        }
                        this.session._emit("changeFold", {
                            data: {
                                start: {
                                    row: e.row
                                }
                            }
                        });
                        this.$updateRows();
                        this.renderWidgets(null, t);
                        this.onWidgetChanged(e);
                        return e;
                    };
                    this.removeLineWidget = function(e) {
                        e._inDocument = false;
                        e.session = null;
                        if (e.el && e.el.parentNode) e.el.parentNode.removeChild(e.el);
                        if (e.editor && e.editor.destroy) try {
                            e.editor.destroy();
                        } catch (t) {}
                        if (this.session.lineWidgets) {
                            var i = this.session.lineWidgets[e.row];
                            if (i == e) {
                                this.session.lineWidgets[e.row] = e.$oldWidget;
                                if (e.$oldWidget) this.onWidgetChanged(e.$oldWidget);
                            } else {
                                while(i){
                                    if (i.$oldWidget == e) {
                                        i.$oldWidget = e.$oldWidget;
                                        break;
                                    }
                                    i = i.$oldWidget;
                                }
                            }
                        }
                        this.session._emit("changeFold", {
                            data: {
                                start: {
                                    row: e.row
                                }
                            }
                        });
                        this.$updateRows();
                    };
                    this.getWidgetsAtRow = function(e) {
                        var t = this.session.lineWidgets;
                        var i = t && t[e];
                        var n = [];
                        while(i){
                            n.push(i);
                            i = i.$oldWidget;
                        }
                        return n;
                    };
                    this.onWidgetChanged = function(e) {
                        this.session._changedWidgets.push(e);
                        this.editor && this.editor.renderer.updateFull();
                    };
                    this.measureWidgets = function(e, t) {
                        var i = this.session._changedWidgets;
                        var n = t.layerConfig;
                        if (!i || !i.length) return;
                        var r = Infinity;
                        for(var s = 0; s < i.length; s++){
                            var o = i[s];
                            if (!o || !o.el) continue;
                            if (o.session != this.session) continue;
                            if (!o._inDocument) {
                                if (this.session.lineWidgets[o.row] != o) continue;
                                o._inDocument = true;
                                t.container.appendChild(o.el);
                            }
                            o.h = o.el.offsetHeight;
                            if (!o.fixedWidth) {
                                o.w = o.el.offsetWidth;
                                o.screenWidth = Math.ceil(o.w / n.characterWidth);
                            }
                            var a = o.h / n.lineHeight;
                            if (o.coverLine) {
                                a -= this.session.getRowLineCount(o.row);
                                if (a < 0) a = 0;
                            }
                            if (o.rowCount != a) {
                                o.rowCount = a;
                                if (o.row < r) r = o.row;
                            }
                        }
                        if (r != Infinity) {
                            this.session._emit("changeFold", {
                                data: {
                                    start: {
                                        row: r
                                    }
                                }
                            });
                            this.session.lineWidgetWidth = null;
                        }
                        this.session._changedWidgets = [];
                    };
                    this.renderWidgets = function(e, t) {
                        var i = t.layerConfig;
                        var n = this.session.lineWidgets;
                        if (!n) return;
                        var r = Math.min(this.firstRow, i.firstRow);
                        var s = Math.max(this.lastRow, i.lastRow, n.length);
                        while(r > 0 && !n[r])r--;
                        this.firstRow = i.firstRow;
                        this.lastRow = i.lastRow;
                        t.$cursorLayer.config = i;
                        for(var o = r; o <= s; o++){
                            var a = n[o];
                            if (!a || !a.el) continue;
                            if (a.hidden) {
                                a.el.style.top = -100 - (a.pixelHeight || 0) + "px";
                                continue;
                            }
                            if (!a._inDocument) {
                                a._inDocument = true;
                                t.container.appendChild(a.el);
                            }
                            var l = t.$cursorLayer.getPixelPosition({
                                row: o,
                                column: 0
                            }, true).top;
                            if (!a.coverLine) l += i.lineHeight * this.session.getRowLineCount(a.row);
                            a.el.style.top = l - i.offset + "px";
                            var h = a.coverGutter ? 0 : t.gutterWidth;
                            if (!a.fixedWidth) h -= t.scrollLeft;
                            a.el.style.left = h + "px";
                            if (a.fullWidth && a.screenWidth) {
                                a.el.style.minWidth = i.width + 2 * i.padding + "px";
                            }
                            if (a.fixedWidth) {
                                a.el.style.right = t.scrollBar.getWidth() + "px";
                            } else {
                                a.el.style.right = "";
                            }
                        }
                    };
                }.call(r.prototype));
                t.LineWidgets = r;
            });
            ace.define("ace/ext/error_marker", [
                "require",
                "exports",
                "module",
                "ace/line_widgets",
                "ace/lib/dom",
                "ace/range", 
            ], function(e, t, i) {
                "use strict";
                var n = e("../line_widgets").LineWidgets;
                var r = e("../lib/dom");
                var s = e("../range").Range;
                function o(e, t, i) {
                    var n = 0;
                    var r = e.length - 1;
                    while(n <= r){
                        var s = (n + r) >> 1;
                        var o = i(t, e[s]);
                        if (o > 0) n = s + 1;
                        else if (o < 0) r = s - 1;
                        else return s;
                    }
                    return -(n + 1);
                }
                function a(e, t, i) {
                    var n = e.getAnnotations().sort(s.comparePoints);
                    if (!n.length) return;
                    var r = o(n, {
                        row: t,
                        column: -1
                    }, s.comparePoints);
                    if (r < 0) r = -r - 1;
                    if (r >= n.length) r = i > 0 ? 0 : n.length - 1;
                    else if (r === 0 && i < 0) r = n.length - 1;
                    var a = n[r];
                    if (!a || !i) return;
                    if (a.row === t) {
                        do {
                            a = n[(r += i)];
                        }while (a && a.row === t)
                        if (!a) return n.slice();
                    }
                    var l = [];
                    t = a.row;
                    do {
                        l[i < 0 ? "unshift" : "push"](a);
                        a = n[(r += i)];
                    }while (a && a.row == t)
                    return l.length && l;
                }
                t.showErrorMarker = function(e, t) {
                    var i = e.session;
                    if (!i.widgetManager) {
                        i.widgetManager = new n(i);
                        i.widgetManager.attach(e);
                    }
                    var s = e.getCursorPosition();
                    var o = s.row;
                    var l = i.widgetManager.getWidgetsAtRow(o).filter(function(e) {
                        return e.type == "errorMarker";
                    })[0];
                    if (l) {
                        l.destroy();
                    } else {
                        o -= t;
                    }
                    var h = a(i, o, t);
                    var c;
                    if (h) {
                        var u = h[0];
                        s.column = (u.pos && typeof u.column != "number" ? u.pos.sc : u.column) || 0;
                        s.row = u.row;
                        c = e.renderer.$gutterLayer.$annotations[s.row];
                    } else if (l) {
                        return;
                    } else {
                        c = {
                            text: [
                                "Looks good!"
                            ],
                            className: "ace_ok"
                        };
                    }
                    e.session.unfold(s.row);
                    e.selection.moveToPosition(s);
                    var d = {
                        row: s.row,
                        fixedWidth: true,
                        coverGutter: true,
                        el: r.createElement("div"),
                        type: "errorMarker"
                    };
                    var f = d.el.appendChild(r.createElement("div"));
                    var g = d.el.appendChild(r.createElement("div"));
                    g.className = "error_widget_arrow " + c.className;
                    var m = e.renderer.$cursorLayer.getPixelPosition(s).left;
                    g.style.left = m + e.renderer.gutterWidth - 5 + "px";
                    d.el.className = "error_widget_wrapper";
                    f.className = "error_widget " + c.className;
                    f.innerHTML = c.text.join("<br>");
                    f.appendChild(r.createElement("div"));
                    var v = function(e, t, i) {
                        if (t === 0 && (i === "esc" || i === "return")) {
                            d.destroy();
                            return {
                                command: "null"
                            };
                        }
                    };
                    d.destroy = function() {
                        if (e.$mouseHandler.isMousePressed) return;
                        e.keyBinding.removeKeyboardHandler(v);
                        i.widgetManager.removeLineWidget(d);
                        e.off("changeSelection", d.destroy);
                        e.off("changeSession", d.destroy);
                        e.off("mouseup", d.destroy);
                        e.off("change", d.destroy);
                    };
                    e.keyBinding.addKeyboardHandler(v);
                    e.on("changeSelection", d.destroy);
                    e.on("changeSession", d.destroy);
                    e.on("mouseup", d.destroy);
                    e.on("change", d.destroy);
                    e.session.widgetManager.addLineWidget(d);
                    d.el.onmousedown = e.focus.bind(e);
                    e.renderer.scrollCursorIntoView(null, 0.5, {
                        bottom: d.el.offsetHeight
                    });
                };
                r.importCssString("\
    .error_widget_wrapper {\
        background: inherit;\
        color: inherit;\
        border:none\
    }\
    .error_widget {\
        border-top: solid 2px;\
        border-bottom: solid 2px;\
        margin: 5px 0;\
        padding: 10px 40px;\
        white-space: pre-wrap;\
    }\
    .error_widget.ace_error, .error_widget_arrow.ace_error{\
        border-color: #ff5a5a\
    }\
    .error_widget.ace_warning, .error_widget_arrow.ace_warning{\
        border-color: #F1D817\
    }\
    .error_widget.ace_info, .error_widget_arrow.ace_info{\
        border-color: #5a5a5a\
    }\
    .error_widget.ace_ok, .error_widget_arrow.ace_ok{\
        border-color: #5aaa5a\
    }\
    .error_widget_arrow {\
        position: absolute;\
        border: solid 5px;\
        border-top-color: transparent!important;\
        border-right-color: transparent!important;\
        border-left-color: transparent!important;\
        top: -5px;\
    }\
", "error_marker.css", false);
            });
            ace.define("ace/ace", [
                "require",
                "exports",
                "module",
                "ace/lib/fixoldbrowsers",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/range",
                "ace/editor",
                "ace/edit_session",
                "ace/undomanager",
                "ace/virtual_renderer",
                "ace/worker/worker_client",
                "ace/keyboard/hash_handler",
                "ace/placeholder",
                "ace/multi_select",
                "ace/mode/folding/fold_mode",
                "ace/theme/textmate",
                "ace/ext/error_marker",
                "ace/config", 
            ], function(e, t, n) {
                "use strict";
                e("./lib/fixoldbrowsers");
                var r = e("./lib/dom");
                var s = e("./lib/event");
                var o = e("./range").Range;
                var a = e("./editor").Editor;
                var l = e("./edit_session").EditSession;
                var h = e("./undomanager").UndoManager;
                var c = e("./virtual_renderer").VirtualRenderer;
                e("./worker/worker_client");
                e("./keyboard/hash_handler");
                e("./placeholder");
                e("./multi_select");
                e("./mode/folding/fold_mode");
                e("./theme/textmate");
                e("./ext/error_marker");
                t.config = e("./config");
                t.require = e;
                if (true) t.define = i.amdD;
                t.edit = function(e, i) {
                    if (typeof e == "string") {
                        var n = e;
                        e = document.getElementById(n);
                        if (!e) throw new Error("ace.edit can't find div #" + n);
                    }
                    if (e && e.env && e.env.editor instanceof a) return e.env.editor;
                    var o = "";
                    if (e && /input|textarea/i.test(e.tagName)) {
                        var l = e;
                        o = l.value;
                        e = r.createElement("pre");
                        l.parentNode.replaceChild(e, l);
                    } else if (e) {
                        o = e.textContent;
                        e.innerHTML = "";
                    }
                    var h = t.createEditSession(o);
                    var u = new a(new c(e), h, i);
                    var d = {
                        document: h,
                        editor: u,
                        onResize: u.resize.bind(u, null)
                    };
                    if (l) d.textarea = l;
                    s.addListener(window, "resize", d.onResize);
                    u.on("destroy", function() {
                        s.removeListener(window, "resize", d.onResize);
                        d.editor.container.env = null;
                    });
                    u.container.env = u.env = d;
                    return u;
                };
                t.createEditSession = function(e, t) {
                    var i = new l(e, t);
                    i.setUndoManager(new h());
                    return i;
                };
                t.Range = o;
                t.Editor = a;
                t.EditSession = l;
                t.UndoManager = h;
                t.VirtualRenderer = c;
                t.version = t.config.version;
            });
            (function() {
                ace.require([
                    "ace/ace"
                ], function(t) {
                    if (t) {
                        t.config.init(true);
                        t.define = ace.define;
                    }
                    if (!window.ace) window.ace = t;
                    for(var i in t)if (t.hasOwnProperty(i)) window.ace[i] = t[i];
                    window.ace["default"] = window.ace;
                    if (true && e) {
                        e.exports = window.ace;
                    }
                });
            })();
        }
    }, 
]);
