(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        281
    ],
    {
        3239: function(a, c, b) {
            a = b.nmd(a);
            (function() {
                var a = "ace";
                var b = (function() {
                    return this;
                })();
                if (!b && typeof window != "undefined") b = window;
                if (!a && typeof requirejs !== "undefined") return;
                var c = function(a, d, b) {
                    if (typeof a !== "string") {
                        if (c.original) c.original.apply(this, arguments);
                        else {
                            console.error("dropping module because define wasn't a string.");
                            console.trace();
                        }
                        return;
                    }
                    if (arguments.length == 2) b = d;
                    if (!c.modules[a]) {
                        c.payloads[a] = b;
                        c.modules[a] = null;
                    }
                };
                c.modules = {};
                c.payloads = {};
                var e = function(d, a, b) {
                    if (typeof a === "string") {
                        var e = h(d, a);
                        if (e != undefined) {
                            b && b();
                            return e;
                        }
                    } else if (Object.prototype.toString.call(a) === "[object Array]") {
                        var g = [];
                        for(var c = 0, j = a.length; c < j; ++c){
                            var i = h(d, a[c]);
                            if (i == undefined && f.original) return;
                            g.push(i);
                        }
                        return ((b && b.apply(null, g)) || true);
                    }
                };
                var f = function(b, c) {
                    var a = e("", b, c);
                    if (a == undefined && f.original) return f.original.apply(this, arguments);
                    return a;
                };
                var g = function(b, a) {
                    if (a.indexOf("!") !== -1) {
                        var c = a.split("!");
                        return (g(b, c[0]) + "!" + g(b, c[1]));
                    }
                    if (a.charAt(0) == ".") {
                        var d = b.split("/").slice(0, -1).join("/");
                        a = d + "/" + a;
                        while(a.indexOf(".") !== -1 && e != a){
                            var e = a;
                            a = a.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
                        }
                    }
                    return a;
                };
                var h = function(h, a) {
                    a = g(h, a);
                    var b = c.modules[a];
                    if (!b) {
                        b = c.payloads[a];
                        if (typeof b === "function") {
                            var d = {};
                            var f = {
                                id: a,
                                uri: "",
                                exports: d,
                                packaged: true
                            };
                            var i = function(b, c) {
                                return e(a, b, c);
                            };
                            var j = b(i, d, f);
                            d = j || f.exports;
                            c.modules[a] = d;
                            delete c.payloads[a];
                        }
                        b = c.modules[a] = d || b;
                    }
                    return b;
                };
                function d(d) {
                    var a = b;
                    if (d) {
                        if (!b[d]) b[d] = {};
                        a = b[d];
                    }
                    if (!a.define || !a.define.packaged) {
                        c.original = a.define;
                        a.define = c;
                        a.define.packaged = true;
                    }
                    if (!a.require || !a.require.packaged) {
                        f.original = a.require;
                        a.require = f;
                        a.require.packaged = true;
                    }
                }
                d(a);
            })();
            ace.define("ace/lib/fixoldbrowsers", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
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
            ], function(f, a, g) {
                "use strict";
                a.OS = {
                    LINUX: "LINUX",
                    MAC: "MAC",
                    WINDOWS: "WINDOWS"
                };
                a.getOS = function() {
                    if (a.isMac) {
                        return a.OS.MAC;
                    } else if (a.isLinux) {
                        return a.OS.LINUX;
                    } else {
                        return a.OS.WINDOWS;
                    }
                };
                var c = typeof navigator == "object" ? navigator : {};
                var d = (/mac|win|linux/i.exec(c.platform) || [
                    "other", 
                ])[0].toLowerCase();
                var b = c.userAgent || "";
                var e = c.appName || "";
                a.isWin = d == "win";
                a.isMac = d == "mac";
                a.isLinux = d == "linux";
                a.isIE = e == "Microsoft Internet Explorer" || e.indexOf("MSAppHost") >= 0 ? parseFloat((b.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]) : parseFloat((b.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]);
                a.isOldIE = a.isIE && a.isIE < 9;
                a.isGecko = a.isMozilla = b.match(/ Gecko\/\d+/);
                a.isOpera = typeof opera == "object" && Object.prototype.toString.call(window.opera) == "[object Opera]";
                a.isWebKit = parseFloat(b.split("WebKit/")[1]) || undefined;
                a.isChrome = parseFloat(b.split(" Chrome/")[1]) || undefined;
                a.isEdge = parseFloat(b.split(" Edge/")[1]) || undefined;
                a.isAIR = b.indexOf("AdobeAIR") >= 0;
                a.isAndroid = b.indexOf("Android") >= 0;
                a.isChromeOS = b.indexOf(" CrOS ") >= 0;
                a.isIOS = /iPad|iPhone|iPod/.test(b) && !window.MSStream;
                if (a.isIOS) a.isMac = true;
                a.isMobile = a.isIOS || a.isAndroid;
            });
            ace.define("ace/lib/dom", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(d, a, f) {
                "use strict";
                var b = d("./useragent");
                var g = "http://www.w3.org/1999/xhtml";
                a.buildDom = function g(a, b, h) {
                    if (typeof a == "string" && a) {
                        var i = document.createTextNode(a);
                        if (b) b.appendChild(i);
                        return i;
                    }
                    if (!Array.isArray(a)) {
                        if (a && a.appendChild && b) b.appendChild(a);
                        return a;
                    }
                    if (typeof a[0] != "string" || !a[0]) {
                        var j = [];
                        for(var c = 0; c < a.length; c++){
                            var k = g(a[c], b, h);
                            k && j.push(k);
                        }
                        return j;
                    }
                    var e = document.createElement(a[0]);
                    var d = a[1];
                    var f = 1;
                    if (d && typeof d == "object" && !Array.isArray(d)) f = 2;
                    for(var c = f; c < a.length; c++)g(a[c], e, h);
                    if (f == 2) {
                        Object.keys(d).forEach(function(b) {
                            var a = d[b];
                            if (b === "class") {
                                e.className = Array.isArray(a) ? a.join(" ") : a;
                            } else if (typeof a == "function" || b == "value" || b[0] == "$") {
                                e[b] = a;
                            } else if (b === "ref") {
                                if (h) h[a] = e;
                            } else if (b === "style") {
                                if (typeof a == "string") e.style.cssText = a;
                            } else if (a != null) {
                                e.setAttribute(b, a);
                            }
                        });
                    }
                    if (b) b.appendChild(e);
                    return e;
                };
                a.getDocumentHead = function(a) {
                    if (!a) a = document;
                    return (a.head || a.getElementsByTagName("head")[0] || a.documentElement);
                };
                a.createElement = function(a, b) {
                    return document.createElementNS ? document.createElementNS(b || g, a) : document.createElement(a);
                };
                a.removeChildren = function(a) {
                    a.innerHTML = "";
                };
                a.createTextNode = function(b, a) {
                    var c = a ? a.ownerDocument : document;
                    return c.createTextNode(b);
                };
                a.createFragment = function(a) {
                    var b = a ? a.ownerDocument : document;
                    return b.createDocumentFragment();
                };
                a.hasCssClass = function(a, b) {
                    var c = (a.className + "").split(/\s+/g);
                    return c.indexOf(b) !== -1;
                };
                a.addCssClass = function(b, c) {
                    if (!a.hasCssClass(b, c)) {
                        b.className += " " + c;
                    }
                };
                a.removeCssClass = function(b, d) {
                    var a = b.className.split(/\s+/g);
                    while(true){
                        var c = a.indexOf(d);
                        if (c == -1) {
                            break;
                        }
                        a.splice(c, 1);
                    }
                    b.className = a.join(" ");
                };
                a.toggleCssClass = function(c, d) {
                    var a = c.className.split(/\s+/g), b = true;
                    while(true){
                        var e = a.indexOf(d);
                        if (e == -1) {
                            break;
                        }
                        b = false;
                        a.splice(e, 1);
                    }
                    if (b) a.push(d);
                    c.className = a.join(" ");
                    return b;
                };
                a.setCssClass = function(b, c, d) {
                    if (d) {
                        a.addCssClass(b, c);
                    } else {
                        a.removeCssClass(b, c);
                    }
                };
                a.hasCssString = function(d, a) {
                    var c = 0, b;
                    a = a || document;
                    if ((b = a.querySelectorAll("style"))) {
                        while(c < b.length)if (b[c++].id === d) return true;
                    }
                };
                var h;
                var i = [];
                a.useStrictCSP = function(a) {
                    h = a;
                    if (a == false) j();
                    else if (!i) i = [];
                };
                function j() {
                    var a = i;
                    i = null;
                    a && a.forEach(function(a) {
                        e(a[0], a[1]);
                    });
                }
                function e(e, c, d) {
                    if (typeof document == "undefined") return;
                    if (i) {
                        if (d) {
                            j();
                        } else if (d === false) {
                            return i.push([
                                e,
                                c
                            ]);
                        }
                    }
                    if (h) return;
                    var b = d;
                    if (!d || !d.getRootNode) {
                        b = document;
                    } else {
                        b = d.getRootNode();
                        if (!b || b == d) b = document;
                    }
                    var f = b.ownerDocument || b;
                    if (c && a.hasCssString(c, b)) return null;
                    if (c) e += "\n/*# sourceURL=ace/css/" + c + " */";
                    var g = a.createElement("style");
                    g.appendChild(f.createTextNode(e));
                    if (c) g.id = c;
                    if (b == f) b = a.getDocumentHead(f);
                    b.insertBefore(g, b.firstChild);
                }
                a.importCssString = e;
                a.importCssStylsheet = function(b, c) {
                    a.buildDom([
                        "link",
                        {
                            rel: "stylesheet",
                            href: b
                        }
                    ], a.getDocumentHead(c));
                };
                a.scrollbarWidth = function(h) {
                    var c = a.createElement("ace_inner");
                    c.style.width = "100%";
                    c.style.minWidth = "0px";
                    c.style.height = "200px";
                    c.style.display = "block";
                    var d = a.createElement("ace_outer");
                    var b = d.style;
                    b.position = "absolute";
                    b.left = "-10000px";
                    b.overflow = "hidden";
                    b.width = "200px";
                    b.minWidth = "0px";
                    b.height = "150px";
                    b.display = "block";
                    d.appendChild(c);
                    var f = h.documentElement;
                    f.appendChild(d);
                    var g = c.offsetWidth;
                    b.overflow = "scroll";
                    var e = c.offsetWidth;
                    if (g == e) {
                        e = d.clientWidth;
                    }
                    f.removeChild(d);
                    return g - e;
                };
                a.computedStyle = function(a, b) {
                    return window.getComputedStyle(a, "") || {};
                };
                a.setStyle = function(a, b, c) {
                    if (a[b] !== c) {
                        a[b] = c;
                    }
                };
                a.HAS_CSS_ANIMATION = false;
                a.HAS_CSS_TRANSFORMS = false;
                a.HI_DPI = b.isWin ? typeof window !== "undefined" && window.devicePixelRatio >= 1.5 : true;
                if (b.isChromeOS) a.HI_DPI = false;
                if (typeof document !== "undefined") {
                    var c = document.createElement("div");
                    if (a.HI_DPI && c.style.transform !== undefined) a.HAS_CSS_TRANSFORMS = true;
                    if (!b.isEdge && typeof c.style.animationName !== "undefined") a.HAS_CSS_ANIMATION = true;
                    c = null;
                }
                if (a.HAS_CSS_TRANSFORMS) {
                    a.translate = function(a, b, c) {
                        a.style.transform = "translate(" + Math.round(b) + "px, " + Math.round(c) + "px)";
                    };
                } else {
                    a.translate = function(a, b, c) {
                        a.style.top = Math.round(c) + "px";
                        a.style.left = Math.round(b) + "px";
                    };
                }
            });
            ace.define("ace/lib/oop", [
                "require",
                "exports",
                "module"
            ], function(b, a, c) {
                "use strict";
                a.inherits = function(a, b) {
                    a.super_ = b;
                    a.prototype = Object.create(b.prototype, {
                        constructor: {
                            value: a,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                };
                a.mixin = function(a, b) {
                    for(var c in b){
                        a[c] = b[c];
                    }
                    return a;
                };
                a.implement = function(b, c) {
                    a.mixin(b, c);
                };
            });
            ace.define("ace/lib/keys", [
                "require",
                "exports",
                "module",
                "ace/lib/oop"
            ], function(b, a, e) {
                "use strict";
                var c = b("./oop");
                var d = (function() {
                    var a = {
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
                    var d, b;
                    for(b in a.FUNCTION_KEYS){
                        d = a.FUNCTION_KEYS[b].toLowerCase();
                        a[d] = parseInt(b, 10);
                    }
                    for(b in a.PRINTABLE_KEYS){
                        d = a.PRINTABLE_KEYS[b].toLowerCase();
                        a[d] = parseInt(b, 10);
                    }
                    c.mixin(a, a.MODIFIER_KEYS);
                    c.mixin(a, a.PRINTABLE_KEYS);
                    c.mixin(a, a.FUNCTION_KEYS);
                    a.enter = a["return"];
                    a.escape = a.esc;
                    a.del = a["delete"];
                    a[173] = "-";
                    (function() {
                        var b = [
                            "cmd",
                            "ctrl",
                            "alt",
                            "shift"
                        ];
                        for(var c = Math.pow(2, b.length); c--;){
                            a.KEY_MODS[c] = b.filter(function(b) {
                                return c & a.KEY_MODS[b];
                            }).join("-") + "-";
                        }
                    })();
                    a.KEY_MODS[0] = "";
                    a.KEY_MODS[-1] = "input-";
                    return a;
                })();
                c.mixin(a, d);
                a.keyCodeToString = function(b) {
                    var a = d[b];
                    if (typeof a != "string") a = String.fromCharCode(b);
                    return a.toLowerCase();
                };
            });
            ace.define("ace/lib/event", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent", 
            ], function(b, a, e) {
                "use strict";
                var f = b("./keys");
                var c = b("./useragent");
                var g = null;
                var h = 0;
                var i;
                function j() {
                    i = false;
                    try {
                        document.createComment("").addEventListener("test", function() {}, {
                            get passive () {
                                i = {
                                    passive: false
                                };
                            }
                        });
                    } catch (a) {}
                }
                function k() {
                    if (i == undefined) j();
                    return i;
                }
                function d(a, b, c) {
                    this.elem = a;
                    this.type = b;
                    this.callback = c;
                }
                d.prototype.destroy = function() {
                    m(this.elem, this.type, this.callback);
                    this.elem = this.type = this.callback = undefined;
                };
                var l = (a.addListener = function(a, b, c, e) {
                    a.addEventListener(b, c, k());
                    if (e) e.$toDestroy.push(new d(a, b, c));
                });
                var m = (a.removeListener = function(a, b, c) {
                    a.removeEventListener(b, c, k());
                });
                a.stopEvent = function(b) {
                    a.stopPropagation(b);
                    a.preventDefault(b);
                    return false;
                };
                a.stopPropagation = function(a) {
                    if (a.stopPropagation) a.stopPropagation();
                };
                a.preventDefault = function(a) {
                    if (a.preventDefault) a.preventDefault();
                };
                a.getButton = function(a) {
                    if (a.type == "dblclick") return 0;
                    if (a.type == "contextmenu" || (c.isMac && a.ctrlKey && !a.altKey && !a.shiftKey)) return 2;
                    return a.button;
                };
                a.capture = function(c, d, e) {
                    var a = (c && c.ownerDocument) || document;
                    function b(c) {
                        d && d(c);
                        e && e(c);
                        m(a, "mousemove", d);
                        m(a, "mouseup", b);
                        m(a, "dragstart", b);
                    }
                    l(a, "mousemove", d);
                    l(a, "mouseup", b);
                    l(a, "dragstart", b);
                    return b;
                };
                a.addMouseWheelListener = function(a, c, b) {
                    if ("onmousewheel" in a) {
                        l(a, "mousewheel", function(a) {
                            var b = 8;
                            if (a.wheelDeltaX !== undefined) {
                                a.wheelX = -a.wheelDeltaX / b;
                                a.wheelY = -a.wheelDeltaY / b;
                            } else {
                                a.wheelX = 0;
                                a.wheelY = -a.wheelDelta / b;
                            }
                            c(a);
                        }, b);
                    } else if ("onwheel" in a) {
                        l(a, "wheel", function(a) {
                            var b = 0.35;
                            switch(a.deltaMode){
                                case a.DOM_DELTA_PIXEL:
                                    a.wheelX = a.deltaX * b || 0;
                                    a.wheelY = a.deltaY * b || 0;
                                    break;
                                case a.DOM_DELTA_LINE:
                                case a.DOM_DELTA_PAGE:
                                    a.wheelX = (a.deltaX || 0) * 5;
                                    a.wheelY = (a.deltaY || 0) * 5;
                                    break;
                            }
                            c(a);
                        }, b);
                    } else {
                        l(a, "DOMMouseScroll", function(a) {
                            if (a.axis && a.axis == a.HORIZONTAL_AXIS) {
                                a.wheelX = (a.detail || 0) * 5;
                                a.wheelY = 0;
                            } else {
                                a.wheelX = 0;
                                a.wheelY = (a.detail || 0) * 5;
                            }
                            c(a);
                        }, b);
                    }
                };
                a.addMultiMouseDownListener = function(b, d, e, f, g) {
                    var h = 0;
                    var i, j, k;
                    var m = {
                        2: "dblclick",
                        3: "tripleclick",
                        4: "quadclick"
                    };
                    function n(b) {
                        if (a.getButton(b) !== 0) {
                            h = 0;
                        } else if (b.detail > 1) {
                            h++;
                            if (h > 4) h = 1;
                        } else {
                            h = 1;
                        }
                        if (c.isIE) {
                            var g = Math.abs(b.clientX - i) > 5 || Math.abs(b.clientY - j) > 5;
                            if (!k || g) h = 1;
                            if (k) clearTimeout(k);
                            k = setTimeout(function() {
                                k = null;
                            }, d[h - 1] || 600);
                            if (h == 1) {
                                i = b.clientX;
                                j = b.clientY;
                            }
                        }
                        b._clicks = h;
                        e[f]("mousedown", b);
                        if (h > 4) h = 0;
                        else if (h > 1) return e[f](m[h], b);
                    }
                    if (!Array.isArray(b)) b = [
                        b
                    ];
                    b.forEach(function(a) {
                        l(a, "mousedown", n, g);
                    });
                };
                var n = function(a) {
                    return (0 | (a.ctrlKey ? 1 : 0) | (a.altKey ? 2 : 0) | (a.shiftKey ? 4 : 0) | (a.metaKey ? 8 : 0));
                };
                a.getModifierString = function(a) {
                    return f.KEY_MODS[n(a)];
                };
                function o(i, a, b) {
                    var d = n(a);
                    if (!c.isMac && g) {
                        if (a.getModifierState && (a.getModifierState("OS") || a.getModifierState("Win"))) d |= 8;
                        if (g.altGr) {
                            if ((3 & d) != 3) g.altGr = 0;
                            else return;
                        }
                        if (b === 18 || b === 17) {
                            var e = "location" in a ? a.location : a.keyLocation;
                            if (b === 17 && e === 1) {
                                if (g[b] == 1) h = a.timeStamp;
                            } else if (b === 18 && d === 3 && e === 2) {
                                var j = a.timeStamp - h;
                                if (j < 50) g.altGr = true;
                            }
                        }
                    }
                    if (b in f.MODIFIER_KEYS) {
                        b = -1;
                    }
                    if (!d && b === 13) {
                        var e = "location" in a ? a.location : a.keyLocation;
                        if (e === 3) {
                            i(a, d, -b);
                            if (a.defaultPrevented) return;
                        }
                    }
                    if (c.isChromeOS && d & 8) {
                        i(a, d, b);
                        if (a.defaultPrevented) return;
                        else d &= ~8;
                    }
                    if (!d && !(b in f.FUNCTION_KEYS) && !(b in f.PRINTABLE_KEYS)) {
                        return false;
                    }
                    return i(a, d, b);
                }
                a.addCommandKeyListener = function(b, e, d) {
                    if (c.isOldGecko || (c.isOpera && !("KeyboardEvent" in window))) {
                        var f = null;
                        l(b, "keydown", function(a) {
                            f = a.keyCode;
                        }, d);
                        l(b, "keypress", function(a) {
                            return o(e, a, f);
                        }, d);
                    } else {
                        var h = null;
                        l(b, "keydown", function(a) {
                            g[a.keyCode] = (g[a.keyCode] || 0) + 1;
                            var b = o(e, a, a.keyCode);
                            h = a.defaultPrevented;
                            return b;
                        }, d);
                        l(b, "keypress", function(b) {
                            if (h && (b.ctrlKey || b.altKey || b.shiftKey || b.metaKey)) {
                                a.stopEvent(b);
                                h = null;
                            }
                        }, d);
                        l(b, "keyup", function(a) {
                            g[a.keyCode] = null;
                        }, d);
                        if (!g) {
                            p();
                            l(window, "focus", p);
                        }
                    }
                };
                function p() {
                    g = Object.create(null);
                }
                if (typeof window == "object" && window.postMessage && !c.isOldIE) {
                    var q = 1;
                    a.nextTick = function(e, b) {
                        b = b || window;
                        var c = "zero-timeout-message-" + q++;
                        var d = function(f) {
                            if (f.data == c) {
                                a.stopPropagation(f);
                                m(b, "message", d);
                                e();
                            }
                        };
                        l(b, "message", d);
                        b.postMessage(c, "*");
                    };
                }
                a.$idleBlocked = false;
                a.onIdle = function(c, b) {
                    return setTimeout(function b() {
                        if (!a.$idleBlocked) {
                            c();
                        } else {
                            setTimeout(b, 100);
                        }
                    }, b);
                };
                a.$idleBlockId = null;
                a.blockIdle = function(b) {
                    if (a.$idleBlockId) clearTimeout(a.$idleBlockId);
                    a.$idleBlocked = true;
                    a.$idleBlockId = setTimeout(function() {
                        a.$idleBlocked = false;
                    }, b || 100);
                };
                a.nextFrame = typeof window == "object" && (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame);
                if (a.nextFrame) a.nextFrame = a.nextFrame.bind(window);
                else a.nextFrame = function(a) {
                    setTimeout(a, 17);
                };
            });
            ace.define("ace/range", [
                "require",
                "exports",
                "module"
            ], function(d, b, e) {
                "use strict";
                var c = function(a, b) {
                    return a.row - b.row || a.column - b.column;
                };
                var a = function(a, b, c, d) {
                    this.start = {
                        row: a,
                        column: b
                    };
                    this.end = {
                        row: c,
                        column: d
                    };
                };
                (function() {
                    this.isEqual = function(a) {
                        return (this.start.row === a.start.row && this.end.row === a.end.row && this.start.column === a.start.column && this.end.column === a.end.column);
                    };
                    this.toString = function() {
                        return ("Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]");
                    };
                    this.contains = function(a, b) {
                        return this.compare(a, b) == 0;
                    };
                    this.compareRange = function(c) {
                        var a, d = c.end, b = c.start;
                        a = this.compare(d.row, d.column);
                        if (a == 1) {
                            a = this.compare(b.row, b.column);
                            if (a == 1) {
                                return 2;
                            } else if (a == 0) {
                                return 1;
                            } else {
                                return 0;
                            }
                        } else if (a == -1) {
                            return -2;
                        } else {
                            a = this.compare(b.row, b.column);
                            if (a == -1) {
                                return -1;
                            } else if (a == 1) {
                                return 42;
                            } else {
                                return 0;
                            }
                        }
                    };
                    this.comparePoint = function(a) {
                        return this.compare(a.row, a.column);
                    };
                    this.containsRange = function(a) {
                        return (this.comparePoint(a.start) == 0 && this.comparePoint(a.end) == 0);
                    };
                    this.intersects = function(b) {
                        var a = this.compareRange(b);
                        return a == -1 || a == 0 || a == 1;
                    };
                    this.isEnd = function(a, b) {
                        return (this.end.row == a && this.end.column == b);
                    };
                    this.isStart = function(a, b) {
                        return (this.start.row == a && this.start.column == b);
                    };
                    this.setStart = function(a, b) {
                        if (typeof a == "object") {
                            this.start.column = a.column;
                            this.start.row = a.row;
                        } else {
                            this.start.row = a;
                            this.start.column = b;
                        }
                    };
                    this.setEnd = function(a, b) {
                        if (typeof a == "object") {
                            this.end.column = a.column;
                            this.end.row = a.row;
                        } else {
                            this.end.row = a;
                            this.end.column = b;
                        }
                    };
                    this.inside = function(a, b) {
                        if (this.compare(a, b) == 0) {
                            if (this.isEnd(a, b) || this.isStart(a, b)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.insideStart = function(a, b) {
                        if (this.compare(a, b) == 0) {
                            if (this.isEnd(a, b)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.insideEnd = function(a, b) {
                        if (this.compare(a, b) == 0) {
                            if (this.isStart(a, b)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.compare = function(a, b) {
                        if (!this.isMultiLine()) {
                            if (a === this.start.row) {
                                return b < this.start.column ? -1 : b > this.end.column ? 1 : 0;
                            }
                        }
                        if (a < this.start.row) return -1;
                        if (a > this.end.row) return 1;
                        if (this.start.row === a) return b >= this.start.column ? 0 : -1;
                        if (this.end.row === a) return b <= this.end.column ? 0 : 1;
                        return 0;
                    };
                    this.compareStart = function(a, b) {
                        if (this.start.row == a && this.start.column == b) {
                            return -1;
                        } else {
                            return this.compare(a, b);
                        }
                    };
                    this.compareEnd = function(a, b) {
                        if (this.end.row == a && this.end.column == b) {
                            return 1;
                        } else {
                            return this.compare(a, b);
                        }
                    };
                    this.compareInside = function(a, b) {
                        if (this.end.row == a && this.end.column == b) {
                            return 1;
                        } else if (this.start.row == a && this.start.column == b) {
                            return -1;
                        } else {
                            return this.compare(a, b);
                        }
                    };
                    this.clipRows = function(b, c) {
                        if (this.end.row > c) var d = {
                            row: c + 1,
                            column: 0
                        };
                        else if (this.end.row < b) var d = {
                            row: b,
                            column: 0
                        };
                        if (this.start.row > c) var e = {
                            row: c + 1,
                            column: 0
                        };
                        else if (this.start.row < b) var e = {
                            row: b,
                            column: 0
                        };
                        return a.fromPoints(e || this.start, d || this.end);
                    };
                    this.extend = function(b, c) {
                        var d = this.compare(b, c);
                        if (d == 0) return this;
                        else if (d == -1) var e = {
                            row: b,
                            column: c
                        };
                        else var f = {
                            row: b,
                            column: c
                        };
                        return a.fromPoints(e || this.start, f || this.end);
                    };
                    this.isEmpty = function() {
                        return (this.start.row === this.end.row && this.start.column === this.end.column);
                    };
                    this.isMultiLine = function() {
                        return this.start.row !== this.end.row;
                    };
                    this.clone = function() {
                        return a.fromPoints(this.start, this.end);
                    };
                    this.collapseRows = function() {
                        if (this.end.column == 0) return new a(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
                        else return new a(this.start.row, 0, this.end.row, 0);
                    };
                    this.toScreenRange = function(b) {
                        var c = b.documentToScreenPosition(this.start);
                        var d = b.documentToScreenPosition(this.end);
                        return new a(c.row, c.column, d.row, d.column);
                    };
                    this.moveBy = function(a, b) {
                        this.start.row += a;
                        this.start.column += b;
                        this.end.row += a;
                        this.end.column += b;
                    };
                }.call(a.prototype));
                a.fromPoints = function(b, c) {
                    return new a(b.row, b.column, c.row, c.column);
                };
                a.comparePoints = c;
                a.comparePoints = function(a, b) {
                    return a.row - b.row || a.column - b.column;
                };
                b.Range = a;
            });
            ace.define("ace/lib/lang", [
                "require",
                "exports",
                "module"
            ], function(b, a, c) {
                "use strict";
                a.last = function(a) {
                    return a[a.length - 1];
                };
                a.stringReverse = function(a) {
                    return a.split("").reverse().join("");
                };
                a.stringRepeat = function(a, b) {
                    var c = "";
                    while(b > 0){
                        if (b & 1) c += a;
                        if ((b >>= 1)) a += a;
                    }
                    return c;
                };
                var d = /^\s\s*/;
                var e = /\s\s*$/;
                a.stringTrimLeft = function(a) {
                    return a.replace(d, "");
                };
                a.stringTrimRight = function(a) {
                    return a.replace(e, "");
                };
                a.copyObject = function(a) {
                    var b = {};
                    for(var c in a){
                        b[c] = a[c];
                    }
                    return b;
                };
                a.copyArray = function(b) {
                    var c = [];
                    for(var a = 0, d = b.length; a < d; a++){
                        if (b[a] && typeof b[a] == "object") c[a] = this.copyObject(b[a]);
                        else c[a] = b[a];
                    }
                    return c;
                };
                a.deepCopy = function d(a) {
                    if (typeof a !== "object" || !a) return a;
                    var c;
                    if (Array.isArray(a)) {
                        c = [];
                        for(var b = 0; b < a.length; b++){
                            c[b] = d(a[b]);
                        }
                        return c;
                    }
                    if (Object.prototype.toString.call(a) !== "[object Object]") return a;
                    c = {};
                    for(var b in a)c[b] = d(a[b]);
                    return c;
                };
                a.arrayToMap = function(b) {
                    var c = {};
                    for(var a = 0; a < b.length; a++){
                        c[b[a]] = 1;
                    }
                    return c;
                };
                a.createMap = function(a) {
                    var b = Object.create(null);
                    for(var c in a){
                        b[c] = a[c];
                    }
                    return b;
                };
                a.arrayRemove = function(b, c) {
                    for(var a = 0; a <= b.length; a++){
                        if (c === b[a]) {
                            b.splice(a, 1);
                        }
                    }
                };
                a.escapeRegExp = function(a) {
                    return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
                };
                a.escapeHTML = function(a) {
                    return ("" + a).replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
                };
                a.getMatchOffsets = function(a, b) {
                    var c = [];
                    a.replace(b, function(a) {
                        c.push({
                            offset: arguments[arguments.length - 2],
                            length: a.length
                        });
                    });
                    return c;
                };
                a.deferredCall = function(b) {
                    var c = null;
                    var d = function() {
                        c = null;
                        b();
                    };
                    var a = function(b) {
                        a.cancel();
                        c = setTimeout(d, b || 0);
                        return a;
                    };
                    a.schedule = a;
                    a.call = function() {
                        this.cancel();
                        b();
                        return a;
                    };
                    a.cancel = function() {
                        clearTimeout(c);
                        c = null;
                        return a;
                    };
                    a.isPending = function() {
                        return c;
                    };
                    return a;
                };
                a.delayedCall = function(b, c) {
                    var d = null;
                    var e = function() {
                        d = null;
                        b();
                    };
                    var a = function(a) {
                        if (d == null) d = setTimeout(e, a || c);
                    };
                    a.delay = function(a) {
                        d && clearTimeout(d);
                        d = setTimeout(e, a || c);
                    };
                    a.schedule = a;
                    a.call = function() {
                        this.cancel();
                        b();
                    };
                    a.cancel = function() {
                        d && clearTimeout(d);
                        d = null;
                    };
                    a.isPending = function() {
                        return d;
                    };
                    return a;
                };
            });
            ace.define("ace/clipboard", [
                "require",
                "exports",
                "module"
            ], function(b, c, a) {
                "use strict";
                var d;
                a.exports = {
                    lineMode: false,
                    pasteCancelled: function() {
                        if (d && d > Date.now() - 50) return true;
                        return (d = false);
                    },
                    cancel: function() {
                        d = Date.now();
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
            ], function(a, c, g) {
                "use strict";
                var h = a("../lib/event");
                var b = a("../lib/useragent");
                var i = a("../lib/dom");
                var j = a("../lib/lang");
                var k = a("../clipboard");
                var l = b.isChrome < 18;
                var m = b.isIE;
                var n = b.isChrome > 63;
                var o = 400;
                var d = a("../lib/keys");
                var p = d.KEY_MODS;
                var e = b.isIOS;
                var q = e ? /\s/ : /\n/;
                var r = b.isMobile;
                var f = function(f, c) {
                    var a = i.createElement("textarea");
                    a.className = "ace_text-input";
                    a.setAttribute("wrap", "off");
                    a.setAttribute("autocorrect", "off");
                    a.setAttribute("autocapitalize", "off");
                    a.setAttribute("spellcheck", false);
                    a.style.opacity = "0";
                    f.insertBefore(a, f.firstChild);
                    var E = false;
                    var F = false;
                    var G = false;
                    var H = false;
                    var I = "";
                    if (!r) a.style.fontSize = "1px";
                    var J = false;
                    var K = false;
                    var L = "";
                    var M = 0;
                    var N = 0;
                    var O = 0;
                    try {
                        var t = document.activeElement === a;
                    } catch (P) {}
                    h.addListener(a, "blur", function(a) {
                        if (K) return;
                        c.onBlur(a);
                        t = false;
                    }, c);
                    h.addListener(a, "focus", function(a) {
                        if (K) return;
                        t = true;
                        if (b.isEdge) {
                            try {
                                if (!document.hasFocus()) return;
                            } catch (d) {}
                        }
                        c.onFocus(a);
                        if (b.isEdge) setTimeout(u);
                        else u();
                    }, c);
                    this.$focusScroll = false;
                    this.focus = function() {
                        if (I || n || this.$focusScroll == "browser") return a.focus({
                            preventScroll: true
                        });
                        var e = a.style.top;
                        a.style.position = "fixed";
                        a.style.top = "0px";
                        try {
                            var c = a.getBoundingClientRect().top != 0;
                        } catch (f) {
                            return;
                        }
                        var d = [];
                        if (c) {
                            var b = a.parentElement;
                            while(b && b.nodeType == 1){
                                d.push(b);
                                b.setAttribute("ace_nocontext", true);
                                if (!b.parentElement && b.getRootNode) b = b.getRootNode().host;
                                else b = b.parentElement;
                            }
                        }
                        a.focus({
                            preventScroll: true
                        });
                        if (c) {
                            d.forEach(function(a) {
                                a.removeAttribute("ace_nocontext");
                            });
                        }
                        setTimeout(function() {
                            a.style.position = "";
                            if (a.style.top == "0px") a.style.top = e;
                        }, 0);
                    };
                    this.blur = function() {
                        a.blur();
                    };
                    this.isFocused = function() {
                        return t;
                    };
                    c.on("beforeEndOperation", function() {
                        var b = c.curOp;
                        var d = b && b.command && b.command.name;
                        if (d == "insertstring") return;
                        var e = d && (b.docChanged || b.selectionChanged);
                        if (G && e) {
                            L = a.value = "";
                            B();
                        }
                        u();
                    });
                    var u = e ? function(b) {
                        if (!t || (E && !b) || H) return;
                        if (!b) b = "";
                        var f = "\n ab" + b + "cde fg\n";
                        if (f != a.value) a.value = L = f;
                        var d = 4;
                        var e = 4 + (b.length || (c.selection.isEmpty() ? 0 : 1));
                        if (M != d || N != e) {
                            a.setSelectionRange(d, e);
                        }
                        M = d;
                        N = e;
                    } : function() {
                        if (G || H) return;
                        if (!t && !S) return;
                        G = true;
                        var e = 0;
                        var b = 0;
                        var d = "";
                        if (c.session) {
                            var i = c.selection;
                            var g = i.getRange();
                            var f = i.cursor.row;
                            e = g.start.column;
                            b = g.end.column;
                            d = c.session.getLine(f);
                            if (g.start.row != f) {
                                var j = c.session.getLine(f - 1);
                                e = g.start.row < f - 1 ? 0 : e;
                                b += j.length + 1;
                                d = j + "\n" + d;
                            } else if (g.end.row != f) {
                                var k = c.session.getLine(f + 1);
                                b = g.end.row > f + 1 ? k.length : b;
                                b += d.length + 1;
                                d = d + "\n" + k;
                            } else if (r && f > 0) {
                                d = "\n" + d;
                                b += 1;
                                e += 1;
                            }
                            if (d.length > o) {
                                if (e < o && b < o) {
                                    d = d.slice(0, o);
                                } else {
                                    d = "\n";
                                    if (e == b) {
                                        e = b = 0;
                                    } else {
                                        e = 0;
                                        b = 1;
                                    }
                                }
                            }
                        }
                        var h = d + "\n\n";
                        if (h != L) {
                            a.value = L = h;
                            M = N = h.length;
                        }
                        if (S) {
                            M = a.selectionStart;
                            N = a.selectionEnd;
                        }
                        if (N != b || M != e || a.selectionEnd != N) {
                            try {
                                a.setSelectionRange(e, b);
                                M = e;
                                N = b;
                            } catch (l) {}
                        }
                        G = false;
                    };
                    this.resetSelection = u;
                    if (t) c.onFocus();
                    var Q = function(a) {
                        return (a.selectionStart === 0 && a.selectionEnd >= L.length && a.value === L && L && a.selectionEnd !== N);
                    };
                    var v = function(b) {
                        if (G) return;
                        if (E) {
                            E = false;
                        } else if (Q(a)) {
                            c.selectAll();
                            u();
                        } else if (r && a.selectionStart != M) {
                            u();
                        }
                    };
                    var R = null;
                    this.setInputHandler = function(a) {
                        R = a;
                    };
                    this.getInputHandler = function() {
                        return R;
                    };
                    var S = false;
                    var T = function(f, o) {
                        if (S) S = false;
                        if (F) {
                            u();
                            if (f) c.onPaste(f);
                            F = false;
                            return "";
                        } else {
                            var l = a.selectionStart;
                            var m = a.selectionEnd;
                            var g = M;
                            var h = L.length - N;
                            var d = f;
                            var j = f.length - l;
                            var i = f.length - m;
                            var e = 0;
                            while(g > 0 && L[e] == f[e]){
                                e++;
                                g--;
                            }
                            d = d.slice(e);
                            e = 1;
                            while(h > 0 && L.length - e > M - 1 && L[L.length - e] == f[f.length - e]){
                                e++;
                                h--;
                            }
                            j -= e - 1;
                            i -= e - 1;
                            var k = d.length - e + 1;
                            if (k < 0) {
                                g = -k;
                                k = 0;
                            }
                            d = d.slice(0, k);
                            if (!o && !d && !j && !g && !h && !i) return "";
                            H = true;
                            var n = false;
                            if (b.isAndroid && d == ". ") {
                                d = "  ";
                                n = true;
                            }
                            if ((d && !g && !h && !j && !i) || J) {
                                c.onTextInput(d);
                            } else {
                                c.onTextInput(d, {
                                    extendLeft: g,
                                    extendRight: h,
                                    restoreStart: j,
                                    restoreEnd: i
                                });
                            }
                            H = false;
                            L = f;
                            M = l;
                            N = m;
                            O = i;
                            return n ? "\n" : d;
                        }
                    };
                    var w = function(b) {
                        if (G) return s();
                        if (b && b.inputType) {
                            if (b.inputType == "historyUndo") return c.execCommand("undo");
                            if (b.inputType == "historyRedo") return c.execCommand("redo");
                        }
                        var d = a.value;
                        var e = T(d, true);
                        if (d.length > o + 100 || q.test(e) || (r && M < 1 && M == N)) {
                            u();
                        }
                    };
                    var U = function(e, a, c) {
                        var b = e.clipboardData || window.clipboardData;
                        if (!b || l) return;
                        var d = m || c ? "Text" : "text/plain";
                        try {
                            if (a) {
                                return (b.setData(d, a) !== false);
                            } else {
                                return b.getData(d);
                            }
                        } catch (f) {
                            if (!c) return U(f, a, true);
                        }
                    };
                    var V = function(d, f) {
                        var b = c.getCopyText();
                        if (!b) return h.preventDefault(d);
                        if (U(d, b)) {
                            if (e) {
                                u(b);
                                E = b;
                                setTimeout(function() {
                                    E = false;
                                }, 10);
                            }
                            f ? c.onCut() : c.onCopy();
                            h.preventDefault(d);
                        } else {
                            E = true;
                            a.value = b;
                            a.select();
                            setTimeout(function() {
                                E = false;
                                u();
                                f ? c.onCut() : c.onCopy();
                            });
                        }
                    };
                    var x = function(a) {
                        V(a, true);
                    };
                    var y = function(a) {
                        V(a, false);
                    };
                    var z = function(d) {
                        var e = U(d);
                        if (k.pasteCancelled()) return;
                        if (typeof e == "string") {
                            if (e) c.onPaste(e, d);
                            if (b.isIE) setTimeout(u);
                            h.preventDefault(d);
                        } else {
                            a.value = "";
                            F = true;
                        }
                    };
                    h.addCommandKeyListener(a, c.onCommandKey.bind(c), c);
                    h.addListener(a, "select", v, c);
                    h.addListener(a, "input", w, c);
                    h.addListener(a, "cut", x, c);
                    h.addListener(a, "copy", y, c);
                    h.addListener(a, "paste", z, c);
                    if (!("oncut" in a) || !("oncopy" in a) || !("onpaste" in a)) {
                        h.addListener(f, "keydown", function(a) {
                            if ((b.isMac && !a.metaKey) || !a.ctrlKey) return;
                            switch(a.keyCode){
                                case 67:
                                    y(a);
                                    break;
                                case 86:
                                    z(a);
                                    break;
                                case 88:
                                    x(a);
                                    break;
                            }
                        }, c);
                    }
                    var A = function(d) {
                        if (G || !c.onCompositionStart || c.$readOnly) return;
                        G = {};
                        if (J) return;
                        if (d.data) G.useTextareaForIME = false;
                        setTimeout(s, 0);
                        c._signal("compositionStart");
                        c.on("mousedown", W);
                        var b = c.getSelectionRange();
                        b.end.row = b.start.row;
                        b.end.column = b.start.column;
                        G.markerRange = b;
                        G.selectionStart = M;
                        c.onCompositionStart(G);
                        if (G.useTextareaForIME) {
                            L = a.value = "";
                            M = 0;
                            N = 0;
                        } else {
                            if (a.msGetInputContext) G.context = a.msGetInputContext();
                            if (a.getInputContext) G.context = a.getInputContext();
                        }
                    };
                    var s = function() {
                        if (!G || !c.onCompositionUpdate || c.$readOnly) return;
                        if (J) return W();
                        if (G.useTextareaForIME) {
                            c.onCompositionUpdate(a.value);
                        } else {
                            var b = a.value;
                            T(b);
                            if (G.markerRange) {
                                if (G.context) {
                                    G.markerRange.start.column = G.selectionStart = G.context.compositionStartOffset;
                                }
                                G.markerRange.end.column = G.markerRange.start.column + N - G.selectionStart + O;
                            }
                        }
                    };
                    var B = function(a) {
                        if (!c.onCompositionEnd || c.$readOnly) return;
                        G = false;
                        c.onCompositionEnd();
                        c.off("mousedown", W);
                        if (a) w();
                    };
                    function W() {
                        K = true;
                        a.blur();
                        a.focus();
                        K = false;
                    }
                    var C = j.delayedCall(s, 50).schedule.bind(null, null);
                    function D(b) {
                        if (b.keyCode == 27 && a.value.length < a.selectionStart) {
                            if (!G) L = a.value;
                            M = N = -1;
                            u();
                        }
                        C();
                    }
                    h.addListener(a, "compositionstart", A, c);
                    h.addListener(a, "compositionupdate", s, c);
                    h.addListener(a, "keyup", D, c);
                    h.addListener(a, "keydown", C, c);
                    h.addListener(a, "compositionend", B, c);
                    this.getElement = function() {
                        return a;
                    };
                    this.setCommandMode = function(b) {
                        J = b;
                        a.readOnly = false;
                    };
                    this.setReadOnly = function(b) {
                        if (!J) a.readOnly = b;
                    };
                    this.setCopyWithEmptySelection = function(a) {};
                    this.onContextMenu = function(a) {
                        S = true;
                        u();
                        c._emit("nativecontextmenu", {
                            target: c,
                            domEvent: a
                        });
                        this.moveToMouse(a, true);
                    };
                    this.moveToMouse = function(e, g) {
                        if (!I) I = a.style.cssText;
                        a.style.cssText = (g ? "z-index:100000;" : "") + (b.isIE ? "opacity:0.1;" : "") + "text-indent: -" + (M + N) * c.renderer.characterWidth * 0.5 + "px;";
                        var d = c.container.getBoundingClientRect();
                        var j = i.computedStyle(c.container);
                        var k = d.top + (parseInt(j.borderTopWidth) || 0);
                        var l = d.left + (parseInt(d.borderLeftWidth) || 0);
                        var m = d.bottom - k - a.clientHeight - 2;
                        var f = function(b) {
                            i.translate(a, b.clientX - l - 2, Math.min(b.clientY - k - 2, m));
                        };
                        f(e);
                        if (e.type != "mousedown") return;
                        c.renderer.$isMousePressed = true;
                        clearTimeout(X);
                        if (b.isWin) h.capture(c.container, f, Y);
                    };
                    this.onContextMenuClose = Y;
                    var X;
                    function Y() {
                        clearTimeout(X);
                        X = setTimeout(function() {
                            if (I) {
                                a.style.cssText = I;
                                I = "";
                            }
                            c.renderer.$isMousePressed = false;
                            if (c.renderer.$keepTextAreaAtCursor) c.renderer.$moveTextAreaToCursor();
                        }, 0);
                    }
                    var g = function(a) {
                        c.textInput.onContextMenu(a);
                        Y();
                    };
                    h.addListener(a, "mouseup", g, c);
                    h.addListener(a, "mousedown", function(a) {
                        a.preventDefault();
                        Y();
                    }, c);
                    h.addListener(c.renderer.scroller, "contextmenu", g, c);
                    h.addListener(a, "contextmenu", g, c);
                    if (e) Z(f, c, a);
                    function Z(e, b, a) {
                        var f = null;
                        var g = false;
                        a.addEventListener("keydown", function(a) {
                            if (f) clearTimeout(f);
                            g = true;
                        }, true);
                        a.addEventListener("keyup", function(a) {
                            f = setTimeout(function() {
                                g = false;
                            }, 100);
                        }, true);
                        var c = function(k) {
                            if (document.activeElement !== a) return;
                            if (g || G || b.$mouseHandler.isMousePressed) return;
                            if (E) {
                                return;
                            }
                            var f = a.selectionStart;
                            var e = a.selectionEnd;
                            var c = null;
                            var h = 0;
                            if (f == 0) {
                                c = d.up;
                            } else if (f == 1) {
                                c = d.home;
                            } else if (e > N && L[e] == "\n") {
                                c = d.end;
                            } else if (f < M && L[f - 1] == " ") {
                                c = d.left;
                                h = p.option;
                            } else if (f < M || (f == M && N != M && f == e)) {
                                c = d.left;
                            } else if (e > N && L.slice(0, e).split("\n").length > 2) {
                                c = d.down;
                            } else if (e > N && L[e - 1] == " ") {
                                c = d.right;
                                h = p.option;
                            } else if (e > N || (e == N && N != M && f == e)) {
                                c = d.right;
                            }
                            if (f !== e) h |= p.shift;
                            if (c) {
                                var j = b.onCommandKey({}, h, c);
                                if (!j && b.commands) {
                                    c = d.keyCodeToString(c);
                                    var i = b.commands.findKeyCommand(h, c);
                                    if (i) b.execCommand(i);
                                }
                                M = f;
                                N = e;
                                u("");
                            }
                        };
                        document.addEventListener("selectionchange", c);
                        b.on("destroy", function() {
                            document.removeEventListener("selectionchange", c);
                        });
                    }
                };
                c.TextInput = f;
                c.$setUserAgentForTests = function(a, b) {
                    r = a;
                    e = b;
                };
            });
            ace.define("ace/mouse/default_handlers", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(b, c, d) {
                "use strict";
                var e = b("../lib/useragent");
                var f = 0;
                var g = 550;
                function a(a) {
                    a.$clickSelection = null;
                    var b = a.editor;
                    b.setDefaultHandler("mousedown", this.onMouseDown.bind(a));
                    b.setDefaultHandler("dblclick", this.onDoubleClick.bind(a));
                    b.setDefaultHandler("tripleclick", this.onTripleClick.bind(a));
                    b.setDefaultHandler("quadclick", this.onQuadClick.bind(a));
                    b.setDefaultHandler("mousewheel", this.onMouseWheel.bind(a));
                    var c = [
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
                    c.forEach(function(b) {
                        a[b] = this[b];
                    }, this);
                    a.selectByLines = this.extendSelectionBy.bind(a, "getLineRange");
                    a.selectByWords = this.extendSelectionBy.bind(a, "getWordRange");
                }
                (function() {
                    this.onMouseDown = function(a) {
                        var f = a.inSelection();
                        var d = a.getDocumentPosition();
                        this.mousedownEvent = a;
                        var b = this.editor;
                        var c = a.getButton();
                        if (c !== 0) {
                            var g = b.getSelectionRange();
                            var h = g.isEmpty();
                            if (h || c == 1) b.selection.moveToPosition(d);
                            if (c == 2) {
                                b.textInput.onContextMenu(a.domEvent);
                                if (!e.isMozilla) a.preventDefault();
                            }
                            return;
                        }
                        this.mousedownEvent.time = Date.now();
                        if (f && !b.isFocused()) {
                            b.focus();
                            if (this.$focusTimeout && !this.$clickSelection && !b.inMultiSelectMode) {
                                this.setState("focusWait");
                                this.captureMouse(a);
                                return;
                            }
                        }
                        this.captureMouse(a);
                        this.startSelect(d, a.domEvent._clicks > 1);
                        return a.preventDefault();
                    };
                    this.startSelect = function(b, c) {
                        b = b || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
                        var a = this.editor;
                        if (!this.mousedownEvent) return;
                        if (this.mousedownEvent.getShiftKey()) a.selection.selectToPosition(b);
                        else if (!c) a.selection.moveToPosition(b);
                        if (!c) this.select();
                        if (a.renderer.scroller.setCapture) {
                            a.renderer.scroller.setCapture();
                        }
                        a.setStyle("ace_selecting");
                        this.setState("select");
                    };
                    this.select = function() {
                        var a, b = this.editor;
                        var c = b.renderer.screenToTextCoordinates(this.x, this.y);
                        if (this.$clickSelection) {
                            var d = this.$clickSelection.comparePoint(c);
                            if (d == -1) {
                                a = this.$clickSelection.end;
                            } else if (d == 1) {
                                a = this.$clickSelection.start;
                            } else {
                                var e = i(this.$clickSelection, c);
                                c = e.cursor;
                                a = e.anchor;
                            }
                            b.selection.setSelectionAnchor(a.row, a.column);
                        }
                        b.selection.selectToPosition(c);
                        b.renderer.scrollCursorIntoView();
                    };
                    this.extendSelectionBy = function(h) {
                        var c, d = this.editor;
                        var a = d.renderer.screenToTextCoordinates(this.x, this.y);
                        var b = d.selection[h](a.row, a.column);
                        if (this.$clickSelection) {
                            var e = this.$clickSelection.comparePoint(b.start);
                            var f = this.$clickSelection.comparePoint(b.end);
                            if (e == -1 && f <= 0) {
                                c = this.$clickSelection.end;
                                if (b.end.row != a.row || b.end.column != a.column) a = b.start;
                            } else if (f == 1 && e >= 0) {
                                c = this.$clickSelection.start;
                                if (b.start.row != a.row || b.start.column != a.column) a = b.end;
                            } else if (e == -1 && f == 1) {
                                a = b.end;
                                c = b.start;
                            } else {
                                var g = i(this.$clickSelection, a);
                                a = g.cursor;
                                c = g.anchor;
                            }
                            d.selection.setSelectionAnchor(c.row, c.column);
                        }
                        d.selection.selectToPosition(a);
                        d.renderer.scrollCursorIntoView();
                    };
                    this.selectEnd = this.selectAllEnd = this.selectByWordsEnd = this.selectByLinesEnd = function() {
                        this.$clickSelection = null;
                        this.editor.unsetStyle("ace_selecting");
                        if (this.editor.renderer.scroller.releaseCapture) {
                            this.editor.renderer.scroller.releaseCapture();
                        }
                    };
                    this.focusWait = function() {
                        var a = h(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                        var b = Date.now();
                        if (a > f || b - this.mousedownEvent.time > this.$focusTimeout) this.startSelect(this.mousedownEvent.getDocumentPosition());
                    };
                    this.onDoubleClick = function(d) {
                        var b = d.getDocumentPosition();
                        var c = this.editor;
                        var e = c.session;
                        var a = e.getBracketRange(b);
                        if (a) {
                            if (a.isEmpty()) {
                                a.start.column--;
                                a.end.column++;
                            }
                            this.setState("select");
                        } else {
                            a = c.selection.getWordRange(b.row, b.column);
                            this.setState("selectByWords");
                        }
                        this.$clickSelection = a;
                        this.select();
                    };
                    this.onTripleClick = function(d) {
                        var c = d.getDocumentPosition();
                        var a = this.editor;
                        this.setState("selectByLines");
                        var b = a.getSelectionRange();
                        if (b.isMultiLine() && b.contains(c.row, c.column)) {
                            this.$clickSelection = a.selection.getLineRange(b.start.row);
                            this.$clickSelection.end = a.selection.getLineRange(b.end.row).end;
                        } else {
                            this.$clickSelection = a.selection.getLineRange(c.row);
                        }
                        this.select();
                    };
                    this.onQuadClick = function(b) {
                        var a = this.editor;
                        a.selectAll();
                        this.$clickSelection = a.getSelectionRange();
                        this.setState("selectAll");
                    };
                    this.onMouseWheel = function(a) {
                        if (a.getAccelKey()) return;
                        if (a.getShiftKey() && a.wheelY && !a.wheelX) {
                            a.wheelX = a.wheelY;
                            a.wheelY = 0;
                        }
                        var i = this.editor;
                        if (!this.$lastScroll) this.$lastScroll = {
                            t: 0,
                            vx: 0,
                            vy: 0,
                            allowed: 0
                        };
                        var b = this.$lastScroll;
                        var c = a.domEvent.timeStamp;
                        var d = c - b.t;
                        var e = d ? a.wheelX / d : b.vx;
                        var f = d ? a.wheelY / d : b.vy;
                        if (d < g) {
                            e = (e + b.vx) / 2;
                            f = (f + b.vy) / 2;
                        }
                        var j = Math.abs(e / f);
                        var h = false;
                        if (j >= 1 && i.renderer.isScrollableBy(a.wheelX * a.speed, 0)) h = true;
                        if (j <= 1 && i.renderer.isScrollableBy(0, a.wheelY * a.speed)) h = true;
                        if (h) {
                            b.allowed = c;
                        } else if (c - b.allowed < g) {
                            var k = Math.abs(e) <= 1.5 * Math.abs(b.vx) && Math.abs(f) <= 1.5 * Math.abs(b.vy);
                            if (k) {
                                h = true;
                                b.allowed = c;
                            } else {
                                b.allowed = 0;
                            }
                        }
                        b.t = c;
                        b.vx = e;
                        b.vy = f;
                        if (h) {
                            i.renderer.scrollBy(a.wheelX * a.speed, a.wheelY * a.speed);
                            return a.stop();
                        }
                    };
                }.call(a.prototype));
                c.DefaultHandlers = a;
                function h(a, b, c, d) {
                    return Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2));
                }
                function i(a, b) {
                    if (a.start.row == a.end.row) var c = 2 * b.column - a.start.column - a.end.column;
                    else if (a.start.row == a.end.row - 1 && !a.start.column && !a.end.column) var c = b.column - 4;
                    else var c = 2 * b.row - a.start.row - a.end.row;
                    if (c < 0) return {
                        cursor: a.start,
                        anchor: a.end
                    };
                    else return {
                        cursor: a.end,
                        anchor: a.start
                    };
                }
            });
            ace.define("ace/tooltip", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom"
            ], function(a, c, d) {
                "use strict";
                var e = a("./lib/oop");
                var f = a("./lib/dom");
                function b(a) {
                    this.isOpen = false;
                    this.$element = null;
                    this.$parentNode = a;
                }
                (function() {
                    this.$init = function() {
                        this.$element = f.createElement("div");
                        this.$element.className = "ace_tooltip";
                        this.$element.style.display = "none";
                        this.$parentNode.appendChild(this.$element);
                        return this.$element;
                    };
                    this.getElement = function() {
                        return this.$element || this.$init();
                    };
                    this.setText = function(a) {
                        this.getElement().textContent = a;
                    };
                    this.setHtml = function(a) {
                        this.getElement().innerHTML = a;
                    };
                    this.setPosition = function(a, b) {
                        this.getElement().style.left = a + "px";
                        this.getElement().style.top = b + "px";
                    };
                    this.setClassName = function(a) {
                        f.addCssClass(this.getElement(), a);
                    };
                    this.show = function(a, b, c) {
                        if (a != null) this.setText(a);
                        if (b != null && c != null) this.setPosition(b, c);
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
                }.call(b.prototype));
                c.Tooltip = b;
            });
            ace.define("ace/mouse/default_gutter_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/oop",
                "ace/lib/event",
                "ace/tooltip", 
            ], function(a, c, g) {
                "use strict";
                var h = a("../lib/dom");
                var d = a("../lib/oop");
                var i = a("../lib/event");
                var e = a("../tooltip").Tooltip;
                function f(c) {
                    var a = c.editor;
                    var e = a.renderer.$gutterLayer;
                    var f = new b(a.container);
                    c.editor.setDefaultHandler("guttermousedown", function(b) {
                        if (!a.isFocused() || b.getButton() != 0) return;
                        var f = e.getRegion(b);
                        if (f == "foldWidgets") return;
                        var d = b.getDocumentPosition().row;
                        var g = a.session.selection;
                        if (b.getShiftKey()) g.selectTo(d, 0);
                        else {
                            if (b.domEvent.detail == 2) {
                                a.selectAll();
                                return b.preventDefault();
                            }
                            c.$clickSelection = a.selection.getLineRange(d);
                        }
                        c.setState("selectByLines");
                        c.captureMouse(b);
                        return b.preventDefault();
                    });
                    var g, j, k;
                    function l() {
                        var g = j.getDocumentPosition().row;
                        var b = e.$annotations[g];
                        if (!b) return d();
                        var n = a.session.getLength();
                        if (g == n) {
                            var o = a.renderer.pixelToScreenCoordinates(0, j.y).row;
                            var h = j.$pos;
                            if (o > a.session.documentToScreenRow(h.row, h.column)) return d();
                        }
                        if (k == b) return;
                        k = b.text.join("<br/>");
                        f.setHtml(k);
                        f.show();
                        a._signal("showGutterTooltip", f);
                        a.on("mousewheel", d);
                        if (c.$tooltipFollowsMouse) {
                            m(j);
                        } else {
                            var p = j.domEvent.target;
                            var i = p.getBoundingClientRect();
                            var l = f.getElement().style;
                            l.left = i.right + "px";
                            l.top = i.bottom + "px";
                        }
                    }
                    function d() {
                        if (g) g = clearTimeout(g);
                        if (k) {
                            f.hide();
                            k = null;
                            a._signal("hideGutterTooltip", f);
                            a.off("mousewheel", d);
                        }
                    }
                    function m(a) {
                        f.setPosition(a.x, a.y);
                    }
                    c.editor.setDefaultHandler("guttermousemove", function(a) {
                        var b = a.domEvent.target || a.domEvent.srcElement;
                        if (h.hasCssClass(b, "ace_fold-widget")) return d();
                        if (k && c.$tooltipFollowsMouse) m(a);
                        j = a;
                        if (g) return;
                        g = setTimeout(function() {
                            g = null;
                            if (j && !c.isMousePressed) l();
                            else d();
                        }, 50);
                    });
                    i.addListener(a.renderer.$gutter, "mouseout", function(a) {
                        j = null;
                        if (!k || g) return;
                        g = setTimeout(function() {
                            g = null;
                            d();
                        }, 50);
                    }, a);
                    a.on("changeSession", d);
                }
                function b(a) {
                    e.call(this, a);
                }
                d.inherits(b, e);
                (function() {
                    this.setPosition = function(a, b) {
                        var c = window.innerWidth || document.documentElement.clientWidth;
                        var g = window.innerHeight || document.documentElement.clientHeight;
                        var d = this.getWidth();
                        var f = this.getHeight();
                        a += 15;
                        b += 15;
                        if (a + d > c) {
                            a -= a + d - c;
                        }
                        if (b + f > g) {
                            b -= 20 + f;
                        }
                        e.prototype.setPosition.call(this, a, b);
                    };
                }.call(b.prototype));
                c.GutterHandler = f;
            });
            ace.define("ace/mouse/mouse_event", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(a, b, d) {
                "use strict";
                var e = a("../lib/event");
                var f = a("../lib/useragent");
                var c = (b.MouseEvent = function(a, b) {
                    this.domEvent = a;
                    this.editor = b;
                    this.x = this.clientX = a.clientX;
                    this.y = this.clientY = a.clientY;
                    this.$pos = null;
                    this.$inSelection = null;
                    this.propagationStopped = false;
                    this.defaultPrevented = false;
                });
                (function() {
                    this.stopPropagation = function() {
                        e.stopPropagation(this.domEvent);
                        this.propagationStopped = true;
                    };
                    this.preventDefault = function() {
                        e.preventDefault(this.domEvent);
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
                        var c = this.editor;
                        var a = c.getSelectionRange();
                        if (a.isEmpty()) this.$inSelection = false;
                        else {
                            var b = this.getDocumentPosition();
                            this.$inSelection = a.contains(b.row, b.column);
                        }
                        return this.$inSelection;
                    };
                    this.getButton = function() {
                        return e.getButton(this.domEvent);
                    };
                    this.getShiftKey = function() {
                        return this.domEvent.shiftKey;
                    };
                    this.getAccelKey = f.isMac ? function() {
                        return this.domEvent.metaKey;
                    } : function() {
                        return this.domEvent.ctrlKey;
                    };
                }.call(c.prototype));
            });
            ace.define("ace/mouse/dragdrop_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(a, c, d) {
                "use strict";
                var e = a("../lib/dom");
                var f = a("../lib/event");
                var g = a("../lib/useragent");
                var h = 200;
                var i = 200;
                var j = 5;
                function b(a) {
                    var b = a.editor;
                    var d = e.createElement("div");
                    d.style.cssText = "top:-100px;position:absolute;z-index:2147483647;opacity:0.5";
                    d.textContent = "\xa0";
                    var l = [
                        "dragWait",
                        "dragWaitEnd",
                        "startDrag",
                        "dragReadyEnd",
                        "onMouseDrag", 
                    ];
                    l.forEach(function(b) {
                        a[b] = this[b];
                    }, this);
                    b.on("mousedown", this.onMouseDown.bind(a));
                    var c = b.container;
                    var m, n, o;
                    var p, q;
                    var r, s = 0;
                    var t;
                    var u;
                    var v;
                    var w;
                    var x;
                    this.onDragStart = function(e) {
                        if (this.cancelDrag || !c.draggable) {
                            var f = this;
                            setTimeout(function() {
                                f.startSelect();
                                f.captureMouse(e);
                            }, 0);
                            return e.preventDefault();
                        }
                        q = b.getSelectionRange();
                        var a = e.dataTransfer;
                        a.effectAllowed = b.getReadOnly() ? "copy" : "copyMove";
                        b.container.appendChild(d);
                        a.setDragImage && a.setDragImage(d, 0, 0);
                        setTimeout(function() {
                            b.container.removeChild(d);
                        });
                        a.clearData();
                        a.setData("Text", b.session.getTextRange());
                        u = true;
                        this.setState("drag");
                    };
                    this.onDragEnd = function(a) {
                        c.draggable = false;
                        u = false;
                        this.setState(null);
                        if (!b.getReadOnly()) {
                            var d = a.dataTransfer.dropEffect;
                            if (!t && d == "move") b.session.remove(b.getSelectionRange());
                            b.$resetCursorStyle();
                        }
                        this.editor.unsetStyle("ace_dragging");
                        this.editor.renderer.setCursorStyle("");
                    };
                    this.onDragEnter = function(a) {
                        if (b.getReadOnly() || !F(a.dataTransfer)) return;
                        n = a.clientX;
                        o = a.clientY;
                        if (!m) B();
                        s++;
                        a.dataTransfer.dropEffect = t = G(a);
                        return f.preventDefault(a);
                    };
                    this.onDragOver = function(a) {
                        if (b.getReadOnly() || !F(a.dataTransfer)) return;
                        n = a.clientX;
                        o = a.clientY;
                        if (!m) {
                            B();
                            s++;
                        }
                        if (D !== null) D = null;
                        a.dataTransfer.dropEffect = t = G(a);
                        return f.preventDefault(a);
                    };
                    this.onDragLeave = function(a) {
                        s--;
                        if (s <= 0 && m) {
                            C();
                            t = null;
                            return f.preventDefault(a);
                        }
                    };
                    this.onDrop = function(a) {
                        if (!r) return;
                        var c = a.dataTransfer;
                        if (u) {
                            switch(t){
                                case "move":
                                    if (q.contains(r.row, r.column)) {
                                        q = {
                                            start: r,
                                            end: r
                                        };
                                    } else {
                                        q = b.moveText(q, r);
                                    }
                                    break;
                                case "copy":
                                    q = b.moveText(q, r, true);
                                    break;
                            }
                        } else {
                            var d = c.getData("Text");
                            q = {
                                start: r,
                                end: b.session.insert(r, d)
                            };
                            b.focus();
                            t = null;
                        }
                        C();
                        return f.preventDefault(a);
                    };
                    f.addListener(c, "dragstart", this.onDragStart.bind(a), b);
                    f.addListener(c, "dragend", this.onDragEnd.bind(a), b);
                    f.addListener(c, "dragenter", this.onDragEnter.bind(a), b);
                    f.addListener(c, "dragover", this.onDragOver.bind(a), b);
                    f.addListener(c, "dragleave", this.onDragLeave.bind(a), b);
                    f.addListener(c, "drop", this.onDrop.bind(a), b);
                    function y(c, a) {
                        var d = Date.now();
                        var e = !a || c.row != a.row;
                        var f = !a || c.column != a.column;
                        if (!w || e || f) {
                            b.moveCursorToPosition(c);
                            w = d;
                            x = {
                                x: n,
                                y: o
                            };
                        } else {
                            var g = k(x.x, x.y, n, o);
                            if (g > j) {
                                w = null;
                            } else if (d - w >= i) {
                                b.renderer.scrollCursorIntoView();
                                w = null;
                            }
                        }
                    }
                    function z(c, f) {
                        var g = Date.now();
                        var i = b.renderer.layerConfig.lineHeight;
                        var j = b.renderer.layerConfig.characterWidth;
                        var e = b.renderer.scroller.getBoundingClientRect();
                        var a = {
                            x: {
                                left: n - e.left,
                                right: e.right - n
                            },
                            y: {
                                top: o - e.top,
                                bottom: e.bottom - o
                            }
                        };
                        var k = Math.min(a.x.left, a.x.right);
                        var l = Math.min(a.y.top, a.y.bottom);
                        var d = {
                            row: c.row,
                            column: c.column
                        };
                        if (k / j <= 2) {
                            d.column += a.x.left < a.x.right ? -3 : +2;
                        }
                        if (l / i <= 1) {
                            d.row += a.y.top < a.y.bottom ? -1 : +1;
                        }
                        var m = c.row != d.row;
                        var p = c.column != d.column;
                        var q = !f || c.row != f.row;
                        if (m || (p && !q)) {
                            if (!v) v = g;
                            else if (g - v >= h) b.renderer.scrollCursorIntoView(d);
                        } else {
                            v = null;
                        }
                    }
                    function A() {
                        var a = r;
                        r = b.renderer.screenToTextCoordinates(n, o);
                        y(r, a);
                        z(r, a);
                    }
                    function B() {
                        q = b.selection.toOrientedRange();
                        m = b.session.addMarker(q, "ace_selection", b.getSelectionStyle());
                        b.clearSelection();
                        if (b.isFocused()) b.renderer.$cursorLayer.setBlinking(false);
                        clearInterval(p);
                        A();
                        p = setInterval(A, 20);
                        s = 0;
                        f.addListener(document, "mousemove", E);
                    }
                    function C() {
                        clearInterval(p);
                        b.session.removeMarker(m);
                        m = null;
                        b.selection.fromOrientedRange(q);
                        if (b.isFocused() && !u) b.$resetCursorStyle();
                        q = null;
                        r = null;
                        s = 0;
                        v = null;
                        w = null;
                        f.removeListener(document, "mousemove", E);
                    }
                    var D = null;
                    function E() {
                        if (D == null) {
                            D = setTimeout(function() {
                                if (D != null && m) C();
                            }, 20);
                        }
                    }
                    function F(b) {
                        var a = b.types;
                        return (!a || Array.prototype.some.call(a, function(a) {
                            return (a == "text/plain" || a == "Text");
                        }));
                    }
                    function G(c) {
                        var d = [
                            "copy",
                            "copymove",
                            "all",
                            "uninitialized", 
                        ];
                        var e = [
                            "move",
                            "copymove",
                            "linkmove",
                            "all",
                            "uninitialized", 
                        ];
                        var f = g.isMac ? c.altKey : c.ctrlKey;
                        var a = "uninitialized";
                        try {
                            a = c.dataTransfer.effectAllowed.toLowerCase();
                        } catch (h) {}
                        var b = "none";
                        if (f && d.indexOf(a) >= 0) b = "copy";
                        else if (e.indexOf(a) >= 0) b = "move";
                        else if (d.indexOf(a) >= 0) b = "copy";
                        return b;
                    }
                }
                (function() {
                    this.dragWait = function() {
                        var a = Date.now() - this.mousedownEvent.time;
                        if (a > this.editor.getDragDelay()) this.startDrag();
                    };
                    this.dragWaitEnd = function() {
                        var a = this.editor.container;
                        a.draggable = false;
                        this.startSelect(this.mousedownEvent.getDocumentPosition());
                        this.selectEnd();
                    };
                    this.dragReadyEnd = function(a) {
                        this.editor.$resetCursorStyle();
                        this.editor.unsetStyle("ace_dragging");
                        this.editor.renderer.setCursorStyle("");
                        this.dragWaitEnd();
                    };
                    this.startDrag = function() {
                        this.cancelDrag = false;
                        var a = this.editor;
                        var b = a.container;
                        b.draggable = true;
                        a.renderer.$cursorLayer.setBlinking(false);
                        a.setStyle("ace_dragging");
                        var c = g.isWin ? "default" : "move";
                        a.renderer.setCursorStyle(c);
                        this.setState("dragReady");
                    };
                    this.onMouseDrag = function(c) {
                        var b = this.editor.container;
                        if (g.isIE && this.state == "dragReady") {
                            var a = k(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            if (a > 3) b.dragDrop();
                        }
                        if (this.state === "dragWait") {
                            var a = k(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            if (a > 0) {
                                b.draggable = false;
                                this.startSelect(this.mousedownEvent.getDocumentPosition());
                            }
                        }
                    };
                    this.onMouseDown = function(a) {
                        if (!this.$dragEnabled) return;
                        this.mousedownEvent = a;
                        var b = this.editor;
                        var d = a.inSelection();
                        var e = a.getButton();
                        var f = a.domEvent.detail || 1;
                        if (f === 1 && e === 0 && d) {
                            if (a.editor.inMultiSelectMode && (a.getAccelKey() || a.getShiftKey())) return;
                            this.mousedownEvent.time = Date.now();
                            var c = a.domEvent.target || a.domEvent.srcElement;
                            if ("unselectable" in c) c.unselectable = "on";
                            if (b.getDragDelay()) {
                                if (g.isWebKit) {
                                    this.cancelDrag = true;
                                    var h = b.container;
                                    h.draggable = true;
                                }
                                this.setState("dragWait");
                            } else {
                                this.startDrag();
                            }
                            this.captureMouse(a, this.onMouseDrag.bind(this));
                            a.defaultPrevented = true;
                        }
                    };
                }.call(b.prototype));
                function k(a, b, c, d) {
                    return Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2));
                }
                c.DragdropHandler = b;
            });
            ace.define("ace/mouse/touch_handler", [
                "require",
                "exports",
                "module",
                "ace/mouse/mouse_event",
                "ace/lib/event",
                "ace/lib/dom", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./mouse_event").MouseEvent;
                var e = a("../lib/event");
                var f = a("../lib/dom");
                b.addTouchListeners = function(a, b) {
                    var c = "scroll";
                    var g;
                    var h;
                    var i;
                    var j;
                    var k;
                    var l;
                    var m = 0;
                    var n;
                    var o = 0;
                    var p = 0;
                    var q = 0;
                    var r;
                    var s;
                    function t() {
                        var d = window.navigator && window.navigator.clipboard;
                        var e = false;
                        var g = function() {
                            var a = b.getCopyText();
                            var c = b.session.getUndoManager().hasUndo();
                            s.replaceChild(f.buildDom(e ? [
                                "span",
                                !a && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "selectall"
                                    },
                                    "Select All", 
                                ],
                                a && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "copy"
                                    },
                                    "Copy", 
                                ],
                                a && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "cut"
                                    },
                                    "Cut", 
                                ],
                                d && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "paste"
                                    },
                                    "Paste", 
                                ],
                                c && [
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
                            ]), s.firstChild);
                        };
                        var a = function(c) {
                            var a = c.target.getAttribute("action");
                            if (a == "more" || !e) {
                                e = !e;
                                return g();
                            }
                            if (a == "paste") {
                                d.readText().then(function(c) {
                                    b.execCommand(a, c);
                                });
                            } else if (a) {
                                if (a == "cut" || a == "copy") {
                                    if (d) d.writeText(b.getCopyText());
                                    else document.execCommand("copy");
                                }
                                b.execCommand(a);
                            }
                            s.firstChild.style.display = "none";
                            e = false;
                            if (a != "openCommandPallete") b.focus();
                        };
                        s = f.buildDom([
                            "div",
                            {
                                class: "ace_mobile-menu",
                                ontouchstart: function(a) {
                                    c = "menu";
                                    a.stopPropagation();
                                    a.preventDefault();
                                    b.textInput.focus();
                                },
                                ontouchend: function(b) {
                                    b.stopPropagation();
                                    b.preventDefault();
                                    a(b);
                                },
                                onclick: a
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
                        ], b.container);
                    }
                    function u() {
                        if (!s) t();
                        var c = b.selection.cursor;
                        var d = b.renderer.textToScreenCoordinates(c.row, c.column);
                        var e = b.renderer.textToScreenCoordinates(0, 0).pageX;
                        var f = b.renderer.scrollLeft;
                        var a = b.container.getBoundingClientRect();
                        s.style.top = d.pageY - a.top - 3 + "px";
                        if (d.pageX - a.left < a.width - 70) {
                            s.style.left = "";
                            s.style.right = "10px";
                        } else {
                            s.style.right = "";
                            s.style.left = e + f - a.left + "px";
                        }
                        s.style.display = "";
                        s.firstChild.style.display = "none";
                        b.on("input", v);
                    }
                    function v(a) {
                        if (s) s.style.display = "none";
                        b.off("input", v);
                    }
                    function w() {
                        k = null;
                        clearTimeout(k);
                        var a = b.selection.getRange();
                        var d = a.contains(n.row, n.column);
                        if (a.isEmpty() || !d) {
                            b.selection.moveToPosition(n);
                            b.selection.selectWord();
                        }
                        c = "wait";
                        u();
                    }
                    function x() {
                        k = null;
                        clearTimeout(k);
                        b.selection.moveToPosition(n);
                        var a = o >= 2 ? b.selection.getLineRange(n.row) : b.session.getBracketRange(n);
                        if (a && !a.isEmpty()) {
                            b.selection.setRange(a);
                        } else {
                            b.selection.selectWord();
                        }
                        c = "wait";
                    }
                    e.addListener(a, "contextmenu", function(c) {
                        if (!r) return;
                        var a = b.textInput.getElement();
                        a.focus();
                    }, b);
                    e.addListener(a, "touchstart", function(a) {
                        var f = a.touches;
                        if (k || f.length > 1) {
                            clearTimeout(k);
                            k = null;
                            i = -1;
                            c = "zoom";
                            return;
                        }
                        r = b.$mouseHandler.isMousePressed = true;
                        var F = b.renderer.layerConfig.lineHeight;
                        var I = b.renderer.layerConfig.lineHeight;
                        var l = a.timeStamp;
                        j = l;
                        var u = f[0];
                        var v = u.clientX;
                        var y = u.clientY;
                        if (Math.abs(g - v) + Math.abs(h - y) > F) i = -1;
                        g = a.clientX = v;
                        h = a.clientY = y;
                        p = q = 0;
                        var G = new d(a, b);
                        n = G.getDocumentPosition();
                        if (l - i < 500 && f.length == 1 && !m) {
                            o++;
                            a.preventDefault();
                            a.button = 0;
                            x();
                        } else {
                            o = 0;
                            var z = b.selection.cursor;
                            var H = b.selection.isEmpty() ? z : b.selection.anchor;
                            var A = b.renderer.$cursorLayer.getPixelPosition(z, true);
                            var B = b.renderer.$cursorLayer.getPixelPosition(H, true);
                            var e = b.renderer.scroller.getBoundingClientRect();
                            var C = b.renderer.layerConfig.offset;
                            var D = b.renderer.scrollLeft;
                            var E = function(a, b) {
                                a = a / I;
                                b = b / F - 0.75;
                                return a * a + b * b;
                            };
                            if (a.clientX < e.left) {
                                c = "zoom";
                                return;
                            }
                            var s = E(a.clientX - e.left - A.left + D, a.clientY - e.top - A.top + C);
                            var t = E(a.clientX - e.left - B.left + D, a.clientY - e.top - B.top + C);
                            if (s < 3.5 && t < 3.5) c = s > t ? "cursor" : "anchor";
                            if (t < 3.5) c = "anchor";
                            else if (s < 3.5) c = "cursor";
                            else c = "scroll";
                            k = setTimeout(w, 450);
                        }
                        i = l;
                    }, b);
                    e.addListener(a, "touchend", function(a) {
                        r = b.$mouseHandler.isMousePressed = false;
                        if (l) clearInterval(l);
                        if (c == "zoom") {
                            c = "";
                            m = 0;
                        } else if (k) {
                            b.selection.moveToPosition(n);
                            m = 0;
                            u();
                        } else if (c == "scroll") {
                            y();
                            v();
                        } else {
                            u();
                        }
                        clearTimeout(k);
                        k = null;
                    }, b);
                    e.addListener(a, "touchmove", function(a) {
                        if (k) {
                            clearTimeout(k);
                            k = null;
                        }
                        var o = a.touches;
                        if (o.length > 1 || c == "zoom") return;
                        var i = o[0];
                        var e = g - i.clientX;
                        var f = h - i.clientY;
                        if (c == "wait") {
                            if (e * e + f * f > 4) c = "cursor";
                            else return a.preventDefault();
                        }
                        g = i.clientX;
                        h = i.clientY;
                        a.clientX = i.clientX;
                        a.clientY = i.clientY;
                        var r = a.timeStamp;
                        var n = r - j;
                        j = r;
                        if (c == "scroll") {
                            var l = new d(a, b);
                            l.speed = 1;
                            l.wheelX = e;
                            l.wheelY = f;
                            if (10 * Math.abs(e) < Math.abs(f)) e = 0;
                            if (10 * Math.abs(f) < Math.abs(e)) f = 0;
                            if (n != 0) {
                                p = e / n;
                                q = f / n;
                            }
                            b._emit("mousewheel", l);
                            if (!l.propagationStopped) {
                                p = q = 0;
                            }
                        } else {
                            var s = new d(a, b);
                            var m = s.getDocumentPosition();
                            if (c == "cursor") b.selection.moveCursorToPosition(m);
                            else if (c == "anchor") b.selection.setSelectionAnchor(m.row, m.column);
                            b.renderer.scrollCursorIntoView(m);
                            a.preventDefault();
                        }
                    }, b);
                    function y() {
                        m += 60;
                        l = setInterval(function() {
                            if (m-- <= 0) {
                                clearInterval(l);
                                l = null;
                            }
                            if (Math.abs(p) < 0.01) p = 0;
                            if (Math.abs(q) < 0.01) q = 0;
                            if (m < 20) p = 0.9 * p;
                            if (m < 20) q = 0.9 * q;
                            var a = b.session.getScrollTop();
                            b.renderer.scrollBy(10 * p, 10 * q);
                            if (a == b.session.getScrollTop()) m = 0;
                        }, 10);
                    }
                };
            });
            ace.define("ace/lib/net", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(b, a, c) {
                "use strict";
                var d = b("./dom");
                a.get = function(b, c) {
                    var a = new XMLHttpRequest();
                    a.open("GET", b, true);
                    a.onreadystatechange = function() {
                        if (a.readyState === 4) {
                            c(a.responseText);
                        }
                    };
                    a.send(null);
                };
                a.loadScript = function(b, e) {
                    var c = d.getDocumentHead();
                    var a = document.createElement("script");
                    a.src = b;
                    c.appendChild(a);
                    a.onload = a.onreadystatechange = function(c, b) {
                        if (b || !a.readyState || a.readyState == "loaded" || a.readyState == "complete") {
                            a = a.onload = a.onreadystatechange = null;
                            if (!b) e();
                        }
                    };
                };
                a.qualifyURL = function(b) {
                    var a = document.createElement("a");
                    a.href = b;
                    return a.href;
                };
            });
            ace.define("ace/lib/event_emitter", [
                "require",
                "exports",
                "module"
            ], function(c, b, d) {
                "use strict";
                var a = {};
                var e = function() {
                    this.propagationStopped = true;
                };
                var f = function() {
                    this.defaultPrevented = true;
                };
                a._emit = a._dispatchEvent = function(c, a) {
                    this._eventRegistry || (this._eventRegistry = {});
                    this._defaultHandlers || (this._defaultHandlers = {});
                    var b = this._eventRegistry[c] || [];
                    var d = this._defaultHandlers[c];
                    if (!b.length && !d) return;
                    if (typeof a != "object" || !a) a = {};
                    if (!a.type) a.type = c;
                    if (!a.stopPropagation) a.stopPropagation = e;
                    if (!a.preventDefault) a.preventDefault = f;
                    b = b.slice();
                    for(var g = 0; g < b.length; g++){
                        b[g](a, this);
                        if (a.propagationStopped) break;
                    }
                    if (d && !a.defaultPrevented) return d(a, this);
                };
                a._signal = function(c, d) {
                    var a = (this._eventRegistry || {})[c];
                    if (!a) return;
                    a = a.slice();
                    for(var b = 0; b < a.length; b++)a[b](d, this);
                };
                a.once = function(a, b) {
                    var c = this;
                    this.on(a, function d() {
                        c.off(a, d);
                        b.apply(null, arguments);
                    });
                    if (!b) {
                        return new Promise(function(a) {
                            b = a;
                        });
                    }
                };
                a.setDefaultHandler = function(b, d) {
                    var a = this._defaultHandlers;
                    if (!a) a = this._defaultHandlers = {
                        _disabled_: {}
                    };
                    if (a[b]) {
                        var f = a[b];
                        var c = a._disabled_[b];
                        if (!c) a._disabled_[b] = c = [];
                        c.push(f);
                        var e = c.indexOf(d);
                        if (e != -1) c.splice(e, 1);
                    }
                    a[b] = d;
                };
                a.removeDefaultHandler = function(b, d) {
                    var c = this._defaultHandlers;
                    if (!c) return;
                    var a = c._disabled_[b];
                    if (c[b] == d) {
                        if (a) this.setDefaultHandler(b, a.pop());
                    } else if (a) {
                        var e = a.indexOf(d);
                        if (e != -1) a.splice(e, 1);
                    }
                };
                a.on = a.addEventListener = function(c, b, d) {
                    this._eventRegistry = this._eventRegistry || {};
                    var a = this._eventRegistry[c];
                    if (!a) a = this._eventRegistry[c] = [];
                    if (a.indexOf(b) == -1) a[d ? "unshift" : "push"](b);
                    return b;
                };
                a.off = a.removeListener = a.removeEventListener = function(c, d) {
                    this._eventRegistry = this._eventRegistry || {};
                    var a = this._eventRegistry[c];
                    if (!a) return;
                    var b = a.indexOf(d);
                    if (b !== -1) a.splice(b, 1);
                };
                a.removeAllListeners = function(a) {
                    if (!a) this._eventRegistry = this._defaultHandlers = undefined;
                    if (this._eventRegistry) this._eventRegistry[a] = undefined;
                    if (this._defaultHandlers) this._defaultHandlers[a] = undefined;
                };
                b.EventEmitter = a;
            });
            ace.define("ace/lib/app_config", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter", 
            ], function(a, c, d) {
                "no use strict";
                var e = a("./oop");
                var f = a("./event_emitter").EventEmitter;
                var g = {
                    setOptions: function(a) {
                        Object.keys(a).forEach(function(b) {
                            this.setOption(b, a[b]);
                        }, this);
                    },
                    getOptions: function(a) {
                        var b = {};
                        if (!a) {
                            var c = this.$options;
                            a = Object.keys(c).filter(function(a) {
                                return !c[a].hidden;
                            });
                        } else if (!Array.isArray(a)) {
                            b = a;
                            a = Object.keys(b);
                        }
                        a.forEach(function(a) {
                            b[a] = this.getOption(a);
                        }, this);
                        return b;
                    },
                    setOption: function(b, c) {
                        if (this["$" + b] === c) return;
                        var a = this.$options[b];
                        if (!a) {
                            return h('misspelled option "' + b + '"');
                        }
                        if (a.forwardTo) return (this[a.forwardTo] && this[a.forwardTo].setOption(b, c));
                        if (!a.handlesSet) this["$" + b] = c;
                        if (a && a.set) a.set.call(this, c);
                    },
                    getOption: function(b) {
                        var a = this.$options[b];
                        if (!a) {
                            return h('misspelled option "' + b + '"');
                        }
                        if (a.forwardTo) return (this[a.forwardTo] && this[a.forwardTo].getOption(b));
                        return a && a.get ? a.get.call(this) : this["$" + b];
                    }
                };
                function h(a) {
                    if (typeof console != "undefined" && console.warn) console.warn.apply(console, arguments);
                }
                function i(b, c) {
                    var a = new Error(b);
                    a.data = c;
                    if (typeof console == "object" && console.error) console.error(a);
                    setTimeout(function() {
                        throw a;
                    });
                }
                var b = function() {
                    this.$defaultOptions = {};
                };
                (function() {
                    e.implement(this, f);
                    this.defineOptions = function(a, b, c) {
                        if (!a.$options) this.$defaultOptions[b] = a.$options = {};
                        Object.keys(c).forEach(function(d) {
                            var b = c[d];
                            if (typeof b == "string") b = {
                                forwardTo: b
                            };
                            b.name || (b.name = d);
                            a.$options[b.name] = b;
                            if ("initialValue" in b) a["$" + b.name] = b.initialValue;
                        });
                        e.implement(a, g);
                        return this;
                    };
                    this.resetOptions = function(a) {
                        Object.keys(a.$options).forEach(function(b) {
                            var c = a.$options[b];
                            if ("value" in c) a.setOption(b, c.value);
                        });
                    };
                    this.setDefaultValue = function(a, b, d) {
                        if (!a) {
                            for(a in this.$defaultOptions)if (this.$defaultOptions[a][b]) break;
                            if (!this.$defaultOptions[a][b]) return false;
                        }
                        var c = this.$defaultOptions[a] || (this.$defaultOptions[a] = {});
                        if (c[b]) {
                            if (c.forwardTo) this.setDefaultValue(c.forwardTo, b, d);
                            else c[b].value = d;
                        }
                    };
                    this.setDefaultValues = function(b, a) {
                        Object.keys(a).forEach(function(c) {
                            this.setDefaultValue(b, c, a[c]);
                        }, this);
                    };
                    this.warn = h;
                    this.reportError = i;
                }.call(b.prototype));
                c.AppConfig = b;
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
            ], function(c, a, d) {
                "no use strict";
                var g = c("./lib/lang");
                var h = c("./lib/oop");
                var i = c("./lib/net");
                var j = c("./lib/dom");
                var e = c("./lib/app_config").AppConfig;
                d.exports = a = new e();
                var k = (function() {
                    return this || (typeof window != "undefined" && window);
                })();
                var l = {
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
                a.get = function(a) {
                    if (!l.hasOwnProperty(a)) throw new Error("Unknown config key: " + a);
                    return l[a];
                };
                a.set = function(a, b) {
                    if (l.hasOwnProperty(a)) l[a] = b;
                    else if (this.setDefaultValue("", a, b) == false) throw new Error("Unknown config key: " + a);
                    if (a == "useStrictCSP") j.useStrictCSP(b);
                };
                a.all = function() {
                    return g.copyObject(l);
                };
                a.$modes = {};
                a.moduleUrl = function(f, a) {
                    if (l.$moduleUrls[f]) return l.$moduleUrls[f];
                    var b = f.split("/");
                    a = a || b[b.length - 2] || "";
                    var e = a == "snippets" ? "/" : "-";
                    var c = b[b.length - 1];
                    if (a == "worker" && e == "-") {
                        var g = new RegExp("^" + a + "[\\-_]|[\\-_]" + a + "$", "g");
                        c = c.replace(g, "");
                    }
                    if ((!c || c == a) && b.length > 1) c = b[b.length - 2];
                    var d = l[a + "Path"];
                    if (d == null) {
                        d = l.basePath;
                    } else if (e == "/") {
                        a = e = "";
                    }
                    if (d && d.slice(-1) != "/") d += "/";
                    return (d + a + e + c + this.get("suffix"));
                };
                a.setModuleUrl = function(a, b) {
                    return (l.$moduleUrls[a] = b);
                };
                a.$loading = {};
                a.loadModule = function(b, d) {
                    var e, f;
                    if (Array.isArray(b)) {
                        f = b[0];
                        b = b[1];
                    }
                    try {
                        e = c(b);
                    } catch (h) {}
                    if (e && !a.$loading[b]) return d && d(e);
                    if (!a.$loading[b]) a.$loading[b] = [];
                    a.$loading[b].push(d);
                    if (a.$loading[b].length > 1) return;
                    var g = function() {
                        c([
                            b
                        ], function(c) {
                            a._emit("load.module", {
                                name: b,
                                module: c
                            });
                            var d = a.$loading[b];
                            a.$loading[b] = null;
                            d.forEach(function(a) {
                                a && a(c);
                            });
                        });
                    };
                    if (!a.get("packaged")) return g();
                    i.loadScript(a.moduleUrl(b, f), g);
                    m();
                };
                var m = function() {
                    if (!l.basePath && !l.workerPath && !l.modePath && !l.themePath && !Object.keys(l.$moduleUrls).length) {
                        console.error("Unable to infer path to ace from script src,", "use ace.config.set('basePath', 'path') to enable dynamic loading of modes and themes", "or with webpack use ace/webpack-resolver");
                        m = function() {};
                    }
                };
                f(true);
                function f(t) {
                    if (!k || !k.document) return;
                    l.packaged = t || c.packaged || d.packaged || (k.define && b.amdD.packaged);
                    var e = {};
                    var f = "";
                    var o = document.currentScript || document._currentScript;
                    var u = (o && o.ownerDocument) || document;
                    var p = u.getElementsByTagName("script");
                    for(var g = 0; g < p.length; g++){
                        var h = p[g];
                        var q = h.src || h.getAttribute("src");
                        if (!q) continue;
                        var r = h.attributes;
                        for(var i = 0, v = r.length; i < v; i++){
                            var j = r[i];
                            if (j.name.indexOf("data-ace-") === 0) {
                                e[n(j.name.replace(/^data-ace-/, ""))] = j.value;
                            }
                        }
                        var s = q.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
                        if (s) f = s[1];
                    }
                    if (f) {
                        e.base = e.base || f;
                        e.packaged = true;
                    }
                    e.basePath = e.base;
                    e.workerPath = e.workerPath || e.base;
                    e.modePath = e.modePath || e.base;
                    e.themePath = e.themePath || e.base;
                    delete e.base;
                    for(var m in e)if (typeof e[m] !== "undefined") a.set(m, e[m]);
                }
                a.init = f;
                function n(a) {
                    return a.replace(/-(.)/g, function(b, a) {
                        return a.toUpperCase();
                    });
                }
                a.version = "1.4.13";
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
            ], function(a, c, f) {
                "use strict";
                var g = a("../lib/event");
                var d = a("../lib/useragent");
                var h = a("./default_handlers").DefaultHandlers;
                var i = a("./default_gutter_handler").GutterHandler;
                var j = a("./mouse_event").MouseEvent;
                var k = a("./dragdrop_handler").DragdropHandler;
                var l = a("./touch_handler").addTouchListeners;
                var e = a("../config");
                var b = function(a) {
                    var f = this;
                    this.editor = a;
                    new h(this);
                    new i(this);
                    new k(this);
                    var c = function(c) {
                        var b = !document.hasFocus || !document.hasFocus() || (!a.isFocused() && document.activeElement == (a.textInput && a.textInput.getElement()));
                        if (b) window.focus();
                        a.focus();
                    };
                    var e = a.renderer.getMouseEventTarget();
                    g.addListener(e, "click", this.onMouseEvent.bind(this, "click"), a);
                    g.addListener(e, "mousemove", this.onMouseMove.bind(this, "mousemove"), a);
                    g.addMultiMouseDownListener([
                        e,
                        a.renderer.scrollBarV && a.renderer.scrollBarV.inner,
                        a.renderer.scrollBarH && a.renderer.scrollBarH.inner,
                        a.textInput && a.textInput.getElement(), 
                    ].filter(Boolean), [
                        400,
                        300,
                        250
                    ], this, "onMouseEvent", a);
                    g.addMouseWheelListener(a.container, this.onMouseWheel.bind(this, "mousewheel"), a);
                    l(a.container, a);
                    var b = a.renderer.$gutter;
                    g.addListener(b, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"), a);
                    g.addListener(b, "click", this.onMouseEvent.bind(this, "gutterclick"), a);
                    g.addListener(b, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"), a);
                    g.addListener(b, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"), a);
                    g.addListener(e, "mousedown", c, a);
                    g.addListener(b, "mousedown", c, a);
                    if (d.isIE && a.renderer.scrollBarV) {
                        g.addListener(a.renderer.scrollBarV.element, "mousedown", c, a);
                        g.addListener(a.renderer.scrollBarH.element, "mousedown", c, a);
                    }
                    a.on("mousemove", function(b) {
                        if (f.state || f.$dragDelay || !f.$dragEnabled) return;
                        var c = a.renderer.screenToTextCoordinates(b.x, b.y);
                        var d = a.session.selection.getRange();
                        var e = a.renderer;
                        if (!d.isEmpty() && d.insideStart(c.row, c.column)) {
                            e.setCursorStyle("default");
                        } else {
                            e.setCursorStyle("");
                        }
                    }, a);
                };
                (function() {
                    this.onMouseEvent = function(a, b) {
                        if (!this.editor.session) return;
                        this.editor._emit(a, new j(b, this.editor));
                    };
                    this.onMouseMove = function(b, c) {
                        var a = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
                        if (!a || !a.length) return;
                        this.editor._emit(b, new j(c, this.editor));
                    };
                    this.onMouseWheel = function(c, b) {
                        var a = new j(b, this.editor);
                        a.speed = this.$scrollSpeed * 2;
                        a.wheelX = b.wheelX;
                        a.wheelY = b.wheelY;
                        this.editor._emit(c, a);
                    };
                    this.setState = function(a) {
                        this.state = a;
                    };
                    this.captureMouse = function(a, l) {
                        this.x = a.x;
                        this.y = a.y;
                        this.isMousePressed = true;
                        var b = this.editor;
                        var f = this.editor.renderer;
                        f.$isMousePressed = true;
                        var c = this;
                        var e = function(a) {
                            if (!a) return;
                            if (d.isWebKit && !a.which && c.releaseMouse) return c.releaseMouse();
                            c.x = a.clientX;
                            c.y = a.clientY;
                            l && l(a);
                            c.mouseEvent = new j(a, c.editor);
                            c.$mouseMoved = true;
                        };
                        var h = function(a) {
                            b.off("beforeEndOperation", k);
                            clearInterval(m);
                            if (b.session) i();
                            c[c.state + "End"] && c[c.state + "End"](a);
                            c.state = "";
                            c.isMousePressed = f.$isMousePressed = false;
                            if (f.$keepTextAreaAtCursor) f.$moveTextAreaToCursor();
                            c.$onCaptureMouseMove = c.releaseMouse = null;
                            a && c.onMouseEvent("mouseup", a);
                            b.endOperation();
                        };
                        var i = function() {
                            c[c.state] && c[c.state]();
                            c.$mouseMoved = false;
                        };
                        if (d.isOldIE && a.domEvent.type == "dblclick") {
                            return setTimeout(function() {
                                h(a);
                            });
                        }
                        var k = function(a) {
                            if (!c.releaseMouse) return;
                            if (b.curOp.command.name && b.curOp.selectionChanged) {
                                c[c.state + "End"] && c[c.state + "End"]();
                                c.state = "";
                                c.releaseMouse();
                            }
                        };
                        b.on("beforeEndOperation", k);
                        b.startOperation({
                            command: {
                                name: "mouse"
                            }
                        });
                        c.$onCaptureMouseMove = e;
                        c.releaseMouse = g.capture(this.editor.container, e, h);
                        var m = setInterval(i, 20);
                    };
                    this.releaseMouse = null;
                    this.cancelContextMenu = function() {
                        var a = function(b) {
                            if (b && b.domEvent && b.domEvent.type != "contextmenu") return;
                            this.editor.off("nativecontextmenu", a);
                            if (b && b.domEvent) g.stopEvent(b.domEvent);
                        }.bind(this);
                        setTimeout(a, 10);
                        this.editor.on("nativecontextmenu", a);
                    };
                    this.destroy = function() {
                        if (this.releaseMouse) this.releaseMouse();
                    };
                }.call(b.prototype));
                e.defineOptions(b.prototype, "mouseHandler", {
                    scrollSpeed: {
                        initialValue: 2
                    },
                    dragDelay: {
                        initialValue: d.isMac ? 150 : 0
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
                c.MouseHandler = b;
            });
            ace.define("ace/mouse/fold_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(a, b, d) {
                "use strict";
                var e = a("../lib/dom");
                function c(a) {
                    a.on("click", function(b) {
                        var g = b.getDocumentPosition();
                        var c = a.session;
                        var d = c.getFoldAt(g.row, g.column, 1);
                        if (d) {
                            if (b.getAccelKey()) c.removeFold(d);
                            else c.expandFold(d);
                            b.stop();
                        }
                        var f = b.domEvent && b.domEvent.target;
                        if (f && e.hasCssClass(f, "ace_inline_button")) {
                            if (e.hasCssClass(f, "ace_toggle_wrap")) {
                                c.setOption("wrap", !c.getUseWrapMode());
                                a.renderer.scrollCursorIntoView();
                            }
                        }
                    });
                    a.on("gutterclick", function(b) {
                        var e = a.renderer.$gutterLayer.getRegion(b);
                        if (e == "foldWidgets") {
                            var c = b.getDocumentPosition().row;
                            var d = a.session;
                            if (d.foldWidgets && d.foldWidgets[c]) a.session.onFoldWidgetClick(c, b);
                            if (!a.isFocused()) a.focus();
                            b.stop();
                        }
                    });
                    a.on("gutterdblclick", function(e) {
                        var h = a.renderer.$gutterLayer.getRegion(e);
                        if (h == "foldWidgets") {
                            var c = e.getDocumentPosition().row;
                            var b = a.session;
                            var f = b.getParentFoldRangeData(c, true);
                            var d = f.range || f.firstRange;
                            if (d) {
                                c = d.start.row;
                                var g = b.getFoldAt(c, b.getLine(c).length, 1);
                                if (g) {
                                    b.removeFold(g);
                                } else {
                                    b.addFold("...", d);
                                    a.renderer.scrollCursorIntoView({
                                        row: d.start.row,
                                        column: 0
                                    });
                                }
                            }
                            e.stop();
                        }
                    });
                }
                b.FoldHandler = c;
            });
            ace.define("ace/keyboard/keybinding", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/event", 
            ], function(a, c, d) {
                "use strict";
                var e = a("../lib/keys");
                var f = a("../lib/event");
                var b = function(a) {
                    this.$editor = a;
                    this.$data = {
                        editor: a
                    };
                    this.$handlers = [];
                    this.setDefaultHandler(a.commands);
                };
                (function() {
                    this.setDefaultHandler = function(a) {
                        this.removeKeyboardHandler(this.$defaultHandler);
                        this.$defaultHandler = a;
                        this.addKeyboardHandler(a, 0);
                    };
                    this.setKeyboardHandler = function(b) {
                        var a = this.$handlers;
                        if (a[a.length - 1] == b) return;
                        while(a[a.length - 1] && a[a.length - 1] != this.$defaultHandler)this.removeKeyboardHandler(a[a.length - 1]);
                        this.addKeyboardHandler(b, 1);
                    };
                    this.addKeyboardHandler = function(a, c) {
                        if (!a) return;
                        if (typeof a == "function" && !a.handleKeyboard) a.handleKeyboard = a;
                        var b = this.$handlers.indexOf(a);
                        if (b != -1) this.$handlers.splice(b, 1);
                        if (c == undefined) this.$handlers.push(a);
                        else this.$handlers.splice(c, 0, a);
                        if (b == -1 && a.attach) a.attach(this.$editor);
                    };
                    this.removeKeyboardHandler = function(a) {
                        var b = this.$handlers.indexOf(a);
                        if (b == -1) return false;
                        this.$handlers.splice(b, 1);
                        a.detach && a.detach(this.$editor);
                        return true;
                    };
                    this.getKeyboardHandler = function() {
                        return this.$handlers[this.$handlers.length - 1];
                    };
                    this.getStatusText = function() {
                        var a = this.$data;
                        var b = a.editor;
                        return this.$handlers.map(function(c) {
                            return ((c.getStatusText && c.getStatusText(b, a)) || "");
                        }).filter(Boolean).join(" ");
                    };
                    this.$callKeyboardHandlers = function(d, e, i, c) {
                        var a;
                        var b = false;
                        var g = this.$editor.commands;
                        for(var h = this.$handlers.length; h--;){
                            a = this.$handlers[h].handleKeyboard(this.$data, d, e, i, c);
                            if (!a || !a.command) continue;
                            if (a.command == "null") {
                                b = true;
                            } else {
                                b = g.exec(a.command, this.$editor, a.args, c);
                            }
                            if (b && c && d != -1 && a.passEvent != true && a.command.passEvent != true) {
                                f.stopEvent(c);
                            }
                            if (b) break;
                        }
                        if (!b && d == -1) {
                            a = {
                                command: "insertstring"
                            };
                            b = g.exec("insertstring", this.$editor, e);
                        }
                        if (b && this.$editor._signal) this.$editor._signal("keyboardActivity", a);
                        return b;
                    };
                    this.onCommandKey = function(b, c, a) {
                        var d = e.keyCodeToString(a);
                        return this.$callKeyboardHandlers(c, d, a, b);
                    };
                    this.onTextInput = function(a) {
                        return this.$callKeyboardHandlers(-1, a);
                    };
                }.call(b.prototype));
                c.KeyBinding = b;
            });
            ace.define("ace/lib/bidiutil", [
                "require",
                "exports",
                "module"
            ], function(r, g, s) {
                "use strict";
                var t = [
                    "\u0621",
                    "\u0641"
                ];
                var u = [
                    "\u063A",
                    "\u064a"
                ];
                var v = 0, w = 0;
                var x = false, y = false, z = false, A = false, B = false, C = false;
                var D = [
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
                var E = [
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
                var F = 0, G = 1;
                var c = 0;
                var k = 1;
                var e = 2;
                var H = 3;
                var a = 4;
                var h = 5;
                var j = 6;
                var I = 7;
                var d = 8;
                var i = 9;
                var l = 10;
                var f = 11;
                var J = 12;
                var m = 13;
                var n = 14;
                var o = 15;
                var p = 16;
                var q = 17;
                var b = 18;
                var K = [
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    j,
                    h,
                    j,
                    d,
                    h,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    h,
                    h,
                    h,
                    j,
                    d,
                    a,
                    a,
                    f,
                    f,
                    f,
                    a,
                    a,
                    a,
                    a,
                    a,
                    l,
                    i,
                    l,
                    i,
                    i,
                    e,
                    e,
                    e,
                    e,
                    e,
                    e,
                    e,
                    e,
                    e,
                    e,
                    i,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    c,
                    a,
                    a,
                    a,
                    a,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    h,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    b,
                    i,
                    a,
                    f,
                    f,
                    f,
                    f,
                    a,
                    a,
                    a,
                    a,
                    c,
                    a,
                    a,
                    b,
                    a,
                    a,
                    f,
                    f,
                    e,
                    e,
                    a,
                    c,
                    a,
                    a,
                    a,
                    e,
                    c,
                    a,
                    a,
                    a,
                    a,
                    a, 
                ];
                var L = [
                    d,
                    d,
                    d,
                    d,
                    d,
                    d,
                    d,
                    d,
                    d,
                    d,
                    d,
                    b,
                    b,
                    b,
                    c,
                    k,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    d,
                    h,
                    m,
                    n,
                    o,
                    p,
                    q,
                    i,
                    f,
                    f,
                    f,
                    f,
                    f,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    i,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    a,
                    d, 
                ];
                function M(o, f, k, e) {
                    var l = v ? E : D, p = null, q = null, m = null, g = 0, n = null, r = null, c = -1, a = null, b = null, s = [];
                    if (!e) {
                        for(a = 0, e = []; a < k; a++){
                            e[a] = P(o[a]);
                        }
                    }
                    w = v;
                    x = false;
                    y = false;
                    z = false;
                    A = false;
                    for(b = 0; b < k; b++){
                        p = g;
                        s[b] = q = O(o, e, s, b);
                        g = l[p][q];
                        n = g & 0xf0;
                        g &= 0x0f;
                        f[b] = m = l[g][5];
                        if (n > 0) {
                            if (n == 0x10) {
                                for(a = c; a < b; a++){
                                    f[a] = 1;
                                }
                                c = -1;
                            } else {
                                c = -1;
                            }
                        }
                        r = l[g][6];
                        if (r) {
                            if (c == -1) {
                                c = b;
                            }
                        } else {
                            if (c > -1) {
                                for(a = c; a < b; a++){
                                    f[a] = m;
                                }
                                c = -1;
                            }
                        }
                        if (e[b] == h) {
                            f[b] = 0;
                        }
                        w |= m;
                    }
                    if (A) {
                        for(a = 0; a < k; a++){
                            if (e[a] == j) {
                                f[a] = v;
                                for(var i = a - 1; i >= 0; i--){
                                    if (e[i] == d) {
                                        f[i] = v;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                function N(f, g, a) {
                    if (w < f) {
                        return;
                    }
                    if (f == 1 && v == G && !z) {
                        a.reverse();
                        return;
                    }
                    var h = a.length, b = 0, c, d, e, i;
                    while(b < h){
                        if (g[b] >= f) {
                            c = b + 1;
                            while(c < h && g[c] >= f){
                                c++;
                            }
                            for(d = b, e = c - 1; d < e; d++, e--){
                                i = a[d];
                                a[d] = a[e];
                                a[e] = i;
                            }
                            b = c;
                        }
                        b++;
                    }
                }
                function O(E, r, B, g) {
                    var D = r[g], t, w, u, s;
                    switch(D){
                        case c:
                        case k:
                            x = false;
                        case a:
                        case H:
                            return D;
                        case e:
                            return x ? H : e;
                        case I:
                            x = true;
                            y = true;
                            return k;
                        case d:
                            return a;
                        case i:
                            if (g < 1 || g + 1 >= r.length || ((t = B[g - 1]) != e && t != H) || ((w = r[g + 1]) != e && w != H)) {
                                return a;
                            }
                            if (x) {
                                w = H;
                            }
                            return w == t ? w : a;
                        case l:
                            t = g > 0 ? B[g - 1] : h;
                            if (t == e && g + 1 < r.length && r[g + 1] == e) {
                                return e;
                            }
                            return a;
                        case f:
                            if (g > 0 && B[g - 1] == e) {
                                return e;
                            }
                            if (x) {
                                return a;
                            }
                            s = g + 1;
                            u = r.length;
                            while(s < u && r[s] == f){
                                s++;
                            }
                            if (s < u && r[s] == e) {
                                return e;
                            }
                            return a;
                        case J:
                            u = r.length;
                            s = g + 1;
                            while(s < u && r[s] == J){
                                s++;
                            }
                            if (s < u) {
                                var C = E[g], F = (C >= 0x0591 && C <= 0x08ff) || C == 0xfb1e;
                                t = r[s];
                                if (F && (t == k || t == I)) {
                                    return k;
                                }
                            }
                            if (g < 1 || (t = r[g - 1]) == h) {
                                return a;
                            }
                            return B[g - 1];
                        case h:
                            x = false;
                            z = true;
                            return v;
                        case j:
                            A = true;
                            return a;
                        case m:
                        case n:
                        case p:
                        case q:
                        case o:
                            x = false;
                        case b:
                            return a;
                    }
                }
                function P(d) {
                    var b = d.charCodeAt(0), g = b >> 8;
                    if (g == 0) {
                        return b > 0x00bf ? c : K[b];
                    } else if (g == 5) {
                        return /[\u0591-\u05f4]/.test(d) ? k : c;
                    } else if (g == 6) {
                        if (/[\u0610-\u061a\u064b-\u065f\u06d6-\u06e4\u06e7-\u06ed]/.test(d)) return J;
                        else if (/[\u0660-\u0669\u066b-\u066c]/.test(d)) return H;
                        else if (b == 0x066a) return f;
                        else if (/[\u06f0-\u06f9]/.test(d)) return e;
                        else return I;
                    } else if (g == 0x20 && b <= 0x205f) {
                        return L[b & 0xff];
                    } else if (g == 0xfe) {
                        return b >= 0xfe70 ? I : a;
                    }
                    return a;
                }
                function Q(a) {
                    return a >= "\u064b" && a <= "\u0655";
                }
                g.L = c;
                g.R = k;
                g.EN = e;
                g.ON_R = 3;
                g.AN = 4;
                g.R_H = 5;
                g.B = 6;
                g.RLE = 7;
                g.DOT = "\xB7";
                g.doBidiReorder = function(i, h, l) {
                    if (i.length < 2) return {};
                    var e = i.split(""), f = new Array(e.length), j = new Array(e.length), d = [];
                    v = l ? G : F;
                    M(e, d, e.length, h);
                    for(var c = 0; c < f.length; f[c] = c, c++);
                    N(2, d, f);
                    N(1, d, f);
                    for(var c = 0; c < f.length - 1; c++){
                        if (h[c] === H) {
                            d[c] = g.AN;
                        } else if (d[c] === k && ((h[c] > I && h[c] < m) || h[c] === a || h[c] === b)) {
                            d[c] = g.ON_R;
                        } else if (c > 0 && e[c - 1] === "\u0644" && /\u0622|\u0623|\u0625|\u0627/.test(e[c])) {
                            d[c - 1] = d[c] = g.R_H;
                            c++;
                        }
                    }
                    if (e[e.length - 1] === g.DOT) d[e.length - 1] = g.B;
                    if (e[0] === "\u202B") d[0] = g.RLE;
                    for(var c = 0; c < f.length; c++){
                        j[c] = d[f[c]];
                    }
                    return {
                        logicalFromVisual: f,
                        bidiLevels: j
                    };
                };
                g.hasBidiCharacters = function(d, b) {
                    var c = false;
                    for(var a = 0; a < d.length; a++){
                        b[a] = P(d.charAt(a));
                        if (!c && (b[a] == k || b[a] == I || b[a] == H)) c = true;
                    }
                    return c;
                };
                g.getVisualFromLogicalIdx = function(c, b) {
                    for(var a = 0; a < b.logicalFromVisual.length; a++){
                        if (b.logicalFromVisual[a] == c) return a;
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
            ], function(a, c, d) {
                "use strict";
                var e = a("./lib/bidiutil");
                var f = a("./lib/lang");
                var g = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\u202B]/;
                var b = function(a) {
                    this.session = a;
                    this.bidiMap = {};
                    this.currentRow = null;
                    this.bidiUtil = e;
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
                    this.seenBidi = g.test(a.getValue());
                };
                (function() {
                    this.isBidiRow = function(a, b, c) {
                        if (!this.seenBidi) return false;
                        if (a !== this.currentRow) {
                            this.currentRow = a;
                            this.updateRowLine(b, c);
                            this.updateBidiMap();
                        }
                        return this.bidiMap.bidiLevels;
                    };
                    this.onChange = function(a) {
                        if (!this.seenBidi) {
                            if (a.action == "insert" && g.test(a.lines.join("\n"))) {
                                this.seenBidi = true;
                                this.currentRow = null;
                            }
                        } else {
                            this.currentRow = null;
                        }
                    };
                    this.getDocumentRow = function() {
                        var a = 0;
                        var b = this.session.$screenRowCache;
                        if (b.length) {
                            var c = this.session.$getRowCacheIndex(b, this.currentRow);
                            if (c >= 0) a = this.session.$docRowCache[c];
                        }
                        return a;
                    };
                    this.getSplitIndex = function() {
                        var a = 0;
                        var b = this.session.$screenRowCache;
                        if (b.length) {
                            var c, d = this.session.$getRowCacheIndex(b, this.currentRow);
                            while(this.currentRow - a > 0){
                                c = this.session.$getRowCacheIndex(b, this.currentRow - a - 1);
                                if (c !== d) break;
                                d = c;
                                a++;
                            }
                        } else {
                            a = this.currentRow;
                        }
                        return a;
                    };
                    this.updateRowLine = function(c, b) {
                        if (c === undefined) c = this.getDocumentRow();
                        var g = c === this.session.getLength() - 1, d = g ? this.EOF : this.EOL;
                        this.wrapIndent = 0;
                        this.line = this.session.getLine(c);
                        this.isRtlDir = this.$isRtl || this.line.charAt(0) === this.RLE;
                        if (this.session.$useWrapMode) {
                            var a = this.session.$wrapData[c];
                            if (a) {
                                if (b === undefined) b = this.getSplitIndex();
                                if (b > 0 && a.length) {
                                    this.wrapIndent = a.indent;
                                    this.wrapOffset = this.wrapIndent * this.charWidths[e.L];
                                    this.line = b < a.length ? this.line.substring(a[b - 1], a[b]) : this.line.substring(a[a.length - 1]);
                                } else {
                                    this.line = this.line.substring(0, a[b]);
                                }
                            }
                            if (b == a.length) this.line += this.showInvisibles ? d : e.DOT;
                        } else {
                            this.line += this.showInvisibles ? d : e.DOT;
                        }
                        var h = this.session, i = 0, j;
                        this.line = this.line.replace(/\t|[\u1100-\u2029, \u202F-\uFFE6]/g, function(a, b) {
                            if (a === "\t" || h.isFullWidth(a.charCodeAt(0))) {
                                j = a === "\t" ? h.getScreenTabSize(b + i) : 2;
                                i += j - 1;
                                return f.stringRepeat(e.DOT, j);
                            }
                            return a;
                        });
                        if (this.isRtlDir) {
                            this.fontMetrics.$main.textContent = this.line.charAt(this.line.length - 1) == e.DOT ? this.line.substr(0, this.line.length - 1) : this.line;
                            this.rtlLineOffset = this.contentWidth - this.fontMetrics.$main.getBoundingClientRect().width;
                        }
                    };
                    this.updateBidiMap = function() {
                        var a = [];
                        if (e.hasBidiCharacters(this.line, a) || this.isRtlDir) {
                            this.bidiMap = e.doBidiReorder(this.line, a, this.isRtlDir);
                        } else {
                            this.bidiMap = {};
                        }
                    };
                    this.markAsDirty = function() {
                        this.currentRow = null;
                    };
                    this.updateCharacterWidths = function(a) {
                        if (this.characterWidth === a.$characterSize.width) return;
                        this.fontMetrics = a;
                        var c = (this.characterWidth = a.$characterSize.width);
                        var b = a.$measureCharWidth("\u05d4");
                        this.charWidths[e.L] = this.charWidths[e.EN] = this.charWidths[e.ON_R] = c;
                        this.charWidths[e.R] = this.charWidths[e.AN] = b;
                        this.charWidths[e.R_H] = b * 0.45;
                        this.charWidths[e.B] = this.charWidths[e.RLE] = 0;
                        this.currentRow = null;
                    };
                    this.setShowInvisibles = function(a) {
                        this.showInvisibles = a;
                        this.currentRow = null;
                    };
                    this.setEolChar = function(a) {
                        this.EOL = a;
                    };
                    this.setContentWidth = function(a) {
                        this.contentWidth = a;
                    };
                    this.isRtlLine = function(a) {
                        if (this.$isRtl) return true;
                        if (a != undefined) return (this.session.getLine(a).charAt(0) == this.RLE);
                        else return this.isRtlDir;
                    };
                    this.setRtlDirection = function(a, c) {
                        var d = a.getCursorPosition();
                        for(var b = a.selection.getSelectionAnchor().row; b <= d.row; b++){
                            if (!c && a.session.getLine(b).charAt(0) === a.session.$bidiHandler.RLE) a.session.doc.removeInLine(b, 0, 1);
                            else if (c && a.session.getLine(b).charAt(0) !== a.session.$bidiHandler.RLE) a.session.doc.insert({
                                column: 0,
                                row: b
                            }, a.session.$bidiHandler.RLE);
                        }
                    };
                    this.getPosLeft = function(a) {
                        a -= this.wrapIndent;
                        var d = this.line.charAt(0) === this.RLE ? 1 : 0;
                        var h = a > d ? this.session.getOverwrite() ? a : a - 1 : d;
                        var b = e.getVisualFromLogicalIdx(h, this.bidiMap), f = this.bidiMap.bidiLevels, c = 0;
                        if (!this.session.getOverwrite() && a <= d && f[b] % 2 !== 0) b++;
                        for(var g = 0; g < b; g++){
                            c += this.charWidths[f[g]];
                        }
                        if (!this.session.getOverwrite() && a > d && f[b] % 2 === 0) c += this.charWidths[f[b]];
                        if (this.wrapIndent) c += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        if (this.isRtlDir) c += this.rtlLineOffset;
                        return c;
                    };
                    this.getSelections = function(j, k) {
                        var l = this.bidiMap, f = l.bidiLevels, m, a = [], b = 0, n = Math.min(j, k) - this.wrapIndent, o = Math.max(j, k) - this.wrapIndent, c = false, g = false, d = 0;
                        if (this.wrapIndent) b += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        for(var h, e = 0; e < f.length; e++){
                            h = l.logicalFromVisual[e];
                            m = f[e];
                            c = h >= n && h < o;
                            if (c && !g) {
                                d = b;
                            } else if (!c && g) {
                                a.push({
                                    left: d,
                                    width: b - d
                                });
                            }
                            b += this.charWidths[m];
                            g = c;
                        }
                        if (c && e === f.length) {
                            a.push({
                                left: d,
                                width: b - d
                            });
                        }
                        if (this.isRtlDir) {
                            for(var i = 0; i < a.length; i++){
                                a[i].left += this.rtlLineOffset;
                            }
                        }
                        return a;
                    };
                    this.offsetToCol = function(c) {
                        if (this.isRtlDir) c -= this.rtlLineOffset;
                        var d = 0, c = Math.max(c, 0), f = 0, a = 0, b = this.bidiMap.bidiLevels, e = this.charWidths[b[a]];
                        if (this.wrapIndent) c -= this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        while(c > f + e / 2){
                            f += e;
                            if (a === b.length - 1) {
                                e = 0;
                                break;
                            }
                            e = this.charWidths[b[++a]];
                        }
                        if (a > 0 && b[a - 1] % 2 !== 0 && b[a] % 2 === 0) {
                            if (c < f) a--;
                            d = this.bidiMap.logicalFromVisual[a];
                        } else if (a > 0 && b[a - 1] % 2 === 0 && b[a] % 2 !== 0) {
                            d = 1 + (c > f ? this.bidiMap.logicalFromVisual[a] : this.bidiMap.logicalFromVisual[a - 1]);
                        } else if ((this.isRtlDir && a === b.length - 1 && e === 0 && b[a - 1] % 2 === 0) || (!this.isRtlDir && a === 0 && b[a] % 2 !== 0)) {
                            d = 1 + this.bidiMap.logicalFromVisual[a];
                        } else {
                            if (a > 0 && b[a - 1] % 2 !== 0 && e !== 0) a--;
                            d = this.bidiMap.logicalFromVisual[a];
                        }
                        if (d === 0 && this.isRtlDir) d++;
                        return d + this.wrapIndent;
                    };
                }.call(b.prototype));
                c.BidiHandler = b;
            });
            ace.define("ace/selection", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/lib/event_emitter",
                "ace/range", 
            ], function(a, c, d) {
                "use strict";
                var e = a("./lib/oop");
                var f = a("./lib/lang");
                var g = a("./lib/event_emitter").EventEmitter;
                var h = a("./range").Range;
                var b = function(a) {
                    this.session = a;
                    this.doc = a.getDocument();
                    this.clearSelection();
                    this.cursor = this.lead = this.doc.createAnchor(0, 0);
                    this.anchor = this.doc.createAnchor(0, 0);
                    this.$silent = false;
                    var b = this;
                    this.cursor.on("change", function(a) {
                        b.$cursorChanged = true;
                        if (!b.$silent) b._emit("changeCursor");
                        if (!b.$isEmpty && !b.$silent) b._emit("changeSelection");
                        if (!b.$keepDesiredColumnOnChange && a.old.column != a.value.column) b.$desiredColumn = null;
                    });
                    this.anchor.on("change", function() {
                        b.$anchorChanged = true;
                        if (!b.$isEmpty && !b.$silent) b._emit("changeSelection");
                    });
                };
                (function() {
                    e.implement(this, g);
                    this.isEmpty = function() {
                        return (this.$isEmpty || (this.anchor.row == this.lead.row && this.anchor.column == this.lead.column));
                    };
                    this.isMultiLine = function() {
                        return (!this.$isEmpty && this.anchor.row != this.cursor.row);
                    };
                    this.getCursor = function() {
                        return this.lead.getPosition();
                    };
                    this.setSelectionAnchor = function(a, b) {
                        this.$isEmpty = false;
                        this.anchor.setPosition(a, b);
                    };
                    this.getAnchor = this.getSelectionAnchor = function() {
                        if (this.$isEmpty) return this.getSelectionLead();
                        return this.anchor.getPosition();
                    };
                    this.getSelectionLead = function() {
                        return this.lead.getPosition();
                    };
                    this.isBackwards = function() {
                        var a = this.anchor;
                        var b = this.lead;
                        return (a.row > b.row || (a.row == b.row && a.column > b.column));
                    };
                    this.getRange = function() {
                        var b = this.anchor;
                        var a = this.lead;
                        if (this.$isEmpty) return h.fromPoints(a, a);
                        return this.isBackwards() ? h.fromPoints(a, b) : h.fromPoints(b, a);
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
                    this.setRange = this.setSelectionRange = function(a, b) {
                        var c = b ? a.end : a.start;
                        var d = b ? a.start : a.end;
                        this.$setSelection(c.row, c.column, d.row, d.column);
                    };
                    this.$setSelection = function(a, b, c, d) {
                        if (this.$silent) return;
                        var e = this.$isEmpty;
                        var f = this.inMultiSelectMode;
                        this.$silent = true;
                        this.$cursorChanged = this.$anchorChanged = false;
                        this.anchor.setPosition(a, b);
                        this.cursor.setPosition(c, d);
                        this.$isEmpty = !h.comparePoints(this.anchor, this.cursor);
                        this.$silent = false;
                        if (this.$cursorChanged) this._emit("changeCursor");
                        if (this.$cursorChanged || this.$anchorChanged || e != this.$isEmpty || f) this._emit("changeSelection");
                    };
                    this.$moveSelection = function(b) {
                        var a = this.lead;
                        if (this.$isEmpty) this.setSelectionAnchor(a.row, a.column);
                        b.call(this);
                    };
                    this.selectTo = function(a, b) {
                        this.$moveSelection(function() {
                            this.moveCursorTo(a, b);
                        });
                    };
                    this.selectToPosition = function(a) {
                        this.$moveSelection(function() {
                            this.moveCursorToPosition(a);
                        });
                    };
                    this.moveTo = function(a, b) {
                        this.clearSelection();
                        this.moveCursorTo(a, b);
                    };
                    this.moveToPosition = function(a) {
                        this.clearSelection();
                        this.moveCursorToPosition(a);
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
                    this.getWordRange = function(a, b) {
                        if (typeof b == "undefined") {
                            var c = a || this.lead;
                            a = c.row;
                            b = c.column;
                        }
                        return this.session.getWordRange(a, b);
                    };
                    this.selectWord = function() {
                        this.setSelectionRange(this.getWordRange());
                    };
                    this.selectAWord = function() {
                        var a = this.getCursor();
                        var b = this.session.getAWordRange(a.row, a.column);
                        this.setSelectionRange(b);
                    };
                    this.getLineRange = function(d, e) {
                        var a = typeof d == "number" ? d : this.lead.row;
                        var b;
                        var c = this.session.getFoldLine(a);
                        if (c) {
                            a = c.start.row;
                            b = c.end.row;
                        } else {
                            b = a;
                        }
                        if (e === true) return new h(a, 0, b, this.session.getLine(b).length);
                        else return new h(a, 0, b + 1, 0);
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
                    this.wouldMoveIntoSoftTab = function(a, b, e) {
                        var c = a.column;
                        var d = a.column + b;
                        if (e < 0) {
                            c = a.column - b;
                            d = a.column;
                        }
                        return (this.session.isTabStop(a) && this.doc.getLine(a.row).slice(c, d).split(" ").length - 1 == b);
                    };
                    this.moveCursorLeft = function() {
                        var a = this.lead.getPosition(), b;
                        if ((b = this.session.getFoldAt(a.row, a.column, -1))) {
                            this.moveCursorTo(b.start.row, b.start.column);
                        } else if (a.column === 0) {
                            if (a.row > 0) {
                                this.moveCursorTo(a.row - 1, this.doc.getLine(a.row - 1).length);
                            }
                        } else {
                            var c = this.session.getTabSize();
                            if (this.wouldMoveIntoSoftTab(a, c, -1) && !this.session.getNavigateWithinSoftTabs()) {
                                this.moveCursorBy(0, -c);
                            } else {
                                this.moveCursorBy(0, -1);
                            }
                        }
                    };
                    this.moveCursorRight = function() {
                        var a = this.lead.getPosition(), b;
                        if ((b = this.session.getFoldAt(a.row, a.column, 1))) {
                            this.moveCursorTo(b.end.row, b.end.column);
                        } else if (this.lead.column == this.doc.getLine(this.lead.row).length) {
                            if (this.lead.row < this.doc.getLength() - 1) {
                                this.moveCursorTo(this.lead.row + 1, 0);
                            }
                        } else {
                            var c = this.session.getTabSize();
                            var a = this.lead;
                            if (this.wouldMoveIntoSoftTab(a, c, 1) && !this.session.getNavigateWithinSoftTabs()) {
                                this.moveCursorBy(0, c);
                            } else {
                                this.moveCursorBy(0, 1);
                            }
                        }
                    };
                    this.moveCursorLineStart = function() {
                        var b = this.lead.row;
                        var c = this.lead.column;
                        var e = this.session.documentToScreenRow(b, c);
                        var a = this.session.screenToDocumentPosition(e, 0);
                        var f = this.session.getDisplayLine(b, null, a.row, a.column);
                        var d = f.match(/^\s*/);
                        if (d[0].length != c && !this.session.$useEmacsStyleLineStart) a.column += d[0].length;
                        this.moveCursorToPosition(a);
                    };
                    this.moveCursorLineEnd = function() {
                        var b = this.lead;
                        var a = this.session.getDocumentLastRowColumnPosition(b.row, b.column);
                        if (this.lead.column == a.column) {
                            var c = this.session.getLine(a.row);
                            if (a.column == c.length) {
                                var d = c.search(/\s+$/);
                                if (d > 0) a.column = d;
                            }
                        }
                        this.moveCursorTo(a.row, a.column);
                    };
                    this.moveCursorFileEnd = function() {
                        var a = this.doc.getLength() - 1;
                        var b = this.doc.getLine(a).length;
                        this.moveCursorTo(a, b);
                    };
                    this.moveCursorFileStart = function() {
                        this.moveCursorTo(0, 0);
                    };
                    this.moveCursorLongWordRight = function() {
                        var b = this.lead.row;
                        var a = this.lead.column;
                        var c = this.doc.getLine(b);
                        var d = c.substring(a);
                        this.session.nonTokenRe.lastIndex = 0;
                        this.session.tokenRe.lastIndex = 0;
                        var e = this.session.getFoldAt(b, a, 1);
                        if (e) {
                            this.moveCursorTo(e.end.row, e.end.column);
                            return;
                        }
                        if (this.session.nonTokenRe.exec(d)) {
                            a += this.session.nonTokenRe.lastIndex;
                            this.session.nonTokenRe.lastIndex = 0;
                            d = c.substring(a);
                        }
                        if (a >= c.length) {
                            this.moveCursorTo(b, c.length);
                            this.moveCursorRight();
                            if (b < this.doc.getLength() - 1) this.moveCursorWordRight();
                            return;
                        }
                        if (this.session.tokenRe.exec(d)) {
                            a += this.session.tokenRe.lastIndex;
                            this.session.tokenRe.lastIndex = 0;
                        }
                        this.moveCursorTo(b, a);
                    };
                    this.moveCursorLongWordLeft = function() {
                        var b = this.lead.row;
                        var a = this.lead.column;
                        var d;
                        if ((d = this.session.getFoldAt(b, a, -1))) {
                            this.moveCursorTo(d.start.row, d.start.column);
                            return;
                        }
                        var e = this.session.getFoldStringAt(b, a, -1);
                        if (e == null) {
                            e = this.doc.getLine(b).substring(0, a);
                        }
                        var c = f.stringReverse(e);
                        this.session.nonTokenRe.lastIndex = 0;
                        this.session.tokenRe.lastIndex = 0;
                        if (this.session.nonTokenRe.exec(c)) {
                            a -= this.session.nonTokenRe.lastIndex;
                            c = c.slice(this.session.nonTokenRe.lastIndex);
                            this.session.nonTokenRe.lastIndex = 0;
                        }
                        if (a <= 0) {
                            this.moveCursorTo(b, 0);
                            this.moveCursorLeft();
                            if (b > 0) this.moveCursorWordLeft();
                            return;
                        }
                        if (this.session.tokenRe.exec(c)) {
                            a -= this.session.tokenRe.lastIndex;
                            this.session.tokenRe.lastIndex = 0;
                        }
                        this.moveCursorTo(b, a);
                    };
                    this.$shortWordEndIndex = function(d) {
                        var a = 0, b;
                        var e = /\s/;
                        var c = this.session.tokenRe;
                        c.lastIndex = 0;
                        if (this.session.tokenRe.exec(d)) {
                            a = this.session.tokenRe.lastIndex;
                        } else {
                            while((b = d[a]) && e.test(b))a++;
                            if (a < 1) {
                                c.lastIndex = 0;
                                while((b = d[a]) && !c.test(b)){
                                    c.lastIndex = 0;
                                    a++;
                                    if (e.test(b)) {
                                        if (a > 2) {
                                            a--;
                                            break;
                                        } else {
                                            while((b = d[a]) && e.test(b))a++;
                                            if (a > 2) break;
                                        }
                                    }
                                }
                            }
                        }
                        c.lastIndex = 0;
                        return a;
                    };
                    this.moveCursorShortWordRight = function() {
                        var a = this.lead.row;
                        var b = this.lead.column;
                        var e = this.doc.getLine(a);
                        var c = e.substring(b);
                        var d = this.session.getFoldAt(a, b, 1);
                        if (d) return this.moveCursorTo(d.end.row, d.end.column);
                        if (b == e.length) {
                            var f = this.doc.getLength();
                            do {
                                a++;
                                c = this.doc.getLine(a);
                            }while (a < f && /^\s*$/.test(c))
                            if (!/^\s+/.test(c)) c = "";
                            b = 0;
                        }
                        var g = this.$shortWordEndIndex(c);
                        this.moveCursorTo(a, b + g);
                    };
                    this.moveCursorShortWordLeft = function() {
                        var a = this.lead.row;
                        var c = this.lead.column;
                        var d;
                        if ((d = this.session.getFoldAt(a, c, -1))) return this.moveCursorTo(d.start.row, d.start.column);
                        var b = this.session.getLine(a).substring(0, c);
                        if (c === 0) {
                            do {
                                a--;
                                b = this.doc.getLine(a);
                            }while (a > 0 && /^\s*$/.test(b))
                            c = b.length;
                            if (!/\s+$/.test(b)) b = "";
                        }
                        var e = f.stringReverse(b);
                        var g = this.$shortWordEndIndex(e);
                        return this.moveCursorTo(a, c - g);
                    };
                    this.moveCursorWordRight = function() {
                        if (this.session.$selectLongWords) this.moveCursorLongWordRight();
                        else this.moveCursorShortWordRight();
                    };
                    this.moveCursorWordLeft = function() {
                        if (this.session.$selectLongWords) this.moveCursorLongWordLeft();
                        else this.moveCursorShortWordLeft();
                    };
                    this.moveCursorBy = function(a, c) {
                        var b = this.session.documentToScreenPosition(this.lead.row, this.lead.column);
                        var d;
                        if (c === 0) {
                            if (a !== 0) {
                                if (this.session.$bidiHandler.isBidiRow(b.row, this.lead.row)) {
                                    d = this.session.$bidiHandler.getPosLeft(b.column);
                                    b.column = Math.round(d / this.session.$bidiHandler.charWidths[0]);
                                } else {
                                    d = b.column * this.session.$bidiHandler.charWidths[0];
                                }
                            }
                            if (this.$desiredColumn) b.column = this.$desiredColumn;
                            else this.$desiredColumn = b.column;
                        }
                        if (a != 0 && this.session.lineWidgets && this.session.lineWidgets[this.lead.row]) {
                            var f = this.session.lineWidgets[this.lead.row];
                            if (a < 0) a -= f.rowsAbove || 0;
                            else if (a > 0) a += f.rowCount - (f.rowsAbove || 0);
                        }
                        var e = this.session.screenToDocumentPosition(b.row + a, b.column, d);
                        if (a !== 0 && c === 0 && e.row === this.lead.row && e.column === this.lead.column) {}
                        this.moveCursorTo(e.row, e.column + c, c === 0);
                    };
                    this.moveCursorToPosition = function(a) {
                        this.moveCursorTo(a.row, a.column);
                    };
                    this.moveCursorTo = function(b, a, e) {
                        var c = this.session.getFoldAt(b, a, 1);
                        if (c) {
                            b = c.start.row;
                            a = c.start.column;
                        }
                        this.$keepDesiredColumnOnChange = true;
                        var d = this.session.getLine(b);
                        if (/[\uDC00-\uDFFF]/.test(d.charAt(a)) && d.charAt(a - 1)) {
                            if (this.lead.row == b && this.lead.column == a + 1) a = a - 1;
                            else a = a + 1;
                        }
                        this.lead.setPosition(b, a);
                        this.$keepDesiredColumnOnChange = false;
                        if (!e) this.$desiredColumn = null;
                    };
                    this.moveCursorToScreen = function(b, c, d) {
                        var a = this.session.screenToDocumentPosition(b, c);
                        this.moveCursorTo(a.row, a.column, d);
                    };
                    this.detach = function() {
                        this.lead.detach();
                        this.anchor.detach();
                    };
                    this.fromOrientedRange = function(a) {
                        this.setSelectionRange(a, a.cursor == a.start);
                        this.$desiredColumn = a.desiredColumn || this.$desiredColumn;
                    };
                    this.toOrientedRange = function(a) {
                        var b = this.getRange();
                        if (a) {
                            a.start.column = b.start.column;
                            a.start.row = b.start.row;
                            a.end.column = b.end.column;
                            a.end.row = b.end.row;
                        } else {
                            a = b;
                        }
                        a.cursor = this.isBackwards() ? a.start : a.end;
                        a.desiredColumn = this.$desiredColumn;
                        return a;
                    };
                    this.getRangeOfMovements = function(b) {
                        var a = this.getCursor();
                        try {
                            b(this);
                            var c = this.getCursor();
                            return h.fromPoints(a, c);
                        } catch (d) {
                            return h.fromPoints(a, a);
                        } finally{
                            this.moveCursorToPosition(a);
                        }
                    };
                    this.toJSON = function() {
                        if (this.rangeCount) {
                            var a = this.ranges.map(function(a) {
                                var b = a.clone();
                                b.isBackwards = a.cursor == a.start;
                                return b;
                            });
                        } else {
                            var a = this.getRange();
                            a.isBackwards = this.isBackwards();
                        }
                        return a;
                    };
                    this.fromJSON = function(a) {
                        if (a.start == undefined) {
                            if (this.rangeList && a.length > 1) {
                                this.toSingleRange(a[0]);
                                for(var b = a.length; b--;){
                                    var c = h.fromPoints(a[b].start, a[b].end);
                                    if (a[b].isBackwards) c.cursor = c.start;
                                    this.addRange(c, true);
                                }
                                return;
                            } else {
                                a = a[0];
                            }
                        }
                        if (this.rangeList) this.toSingleRange(a);
                        this.setSelectionRange(a, a.isBackwards);
                    };
                    this.isEqual = function(a) {
                        if ((a.length || this.rangeCount) && a.length != this.rangeCount) return false;
                        if (!a.length || !this.ranges) return this.getRange().isEqual(a);
                        for(var b = this.ranges.length; b--;){
                            if (!this.ranges[b].isEqual(a[b])) return false;
                        }
                        return true;
                    };
                }.call(b.prototype));
                c.Selection = b;
            });
            ace.define("ace/tokenizer", [
                "require",
                "exports",
                "module",
                "ace/config"
            ], function(b, c, d) {
                "use strict";
                var e = b("./config");
                var f = 2000;
                var a = function(l) {
                    this.states = l;
                    this.regExps = {};
                    this.matchMappings = {};
                    for(var f in this.states){
                        var h = this.states[f];
                        var c = [];
                        var i = 0;
                        var g = (this.matchMappings[f] = {
                            defaultToken: "text"
                        });
                        var j = "g";
                        var k = [];
                        for(var d = 0; d < h.length; d++){
                            var a = h[d];
                            if (a.defaultToken) g.defaultToken = a.defaultToken;
                            if (a.caseInsensitive) j = "gi";
                            if (a.regex == null) continue;
                            if (a.regex instanceof RegExp) a.regex = a.regex.toString().slice(1, -1);
                            var e = a.regex;
                            var b = new RegExp("(?:(" + e + ")|(.))").exec("a").length - 2;
                            if (Array.isArray(a.token)) {
                                if (a.token.length == 1 || b == 1) {
                                    a.token = a.token[0];
                                } else if (b - 1 != a.token.length) {
                                    this.reportError("number of classes and regexp groups doesn't match", {
                                        rule: a,
                                        groupCount: b - 1
                                    });
                                    a.token = a.token[0];
                                } else {
                                    a.tokenArray = a.token;
                                    a.token = null;
                                    a.onMatch = this.$arrayTokens;
                                }
                            } else if (typeof a.token == "function" && !a.onMatch) {
                                if (b > 1) a.onMatch = this.$applyToken;
                                else a.onMatch = a.token;
                            }
                            if (b > 1) {
                                if (/\\\d/.test(a.regex)) {
                                    e = a.regex.replace(/\\([0-9]+)/g, function(b, a) {
                                        return ("\\" + (parseInt(a, 10) + i + 1));
                                    });
                                } else {
                                    b = 1;
                                    e = this.removeCapturingGroups(a.regex);
                                }
                                if (!a.splitRegex && typeof a.token != "string") k.push(a);
                            }
                            g[i] = d;
                            i += b;
                            c.push(e);
                            if (!a.onMatch) a.onMatch = null;
                        }
                        if (!c.length) {
                            g[0] = 0;
                            c.push("$");
                        }
                        k.forEach(function(a) {
                            a.splitRegex = this.createSplitterRegexp(a.regex, j);
                        }, this);
                        this.regExps[f] = new RegExp("(" + c.join(")|(") + ")|($)", j);
                    }
                };
                (function() {
                    this.$setMaxTokenCount = function(a) {
                        f = a | 0;
                    };
                    this.$applyToken = function(e) {
                        var c = this.splitRegex.exec(e).slice(1);
                        var b = this.token.apply(this, c);
                        if (typeof b === "string") return [
                            {
                                type: b,
                                value: e
                            }
                        ];
                        var d = [];
                        for(var a = 0, f = b.length; a < f; a++){
                            if (c[a]) d[d.length] = {
                                type: b[a],
                                value: c[a]
                            };
                        }
                        return d;
                    };
                    this.$arrayTokens = function(d) {
                        if (!d) return [];
                        var b = this.splitRegex.exec(d);
                        if (!b) return "text";
                        var c = [];
                        var e = this.tokenArray;
                        for(var a = 0, f = e.length; a < f; a++){
                            if (b[a + 1]) c[c.length] = {
                                type: e[a],
                                value: b[a + 1]
                            };
                        }
                        return c;
                    };
                    this.removeCapturingGroups = function(a) {
                        var b = a.replace(/\\.|\[(?:\\.|[^\\\]])*|\(\?[:=!<]|(\()/g, function(a, b) {
                            return b ? "(?:" : a;
                        });
                        return b;
                    };
                    this.createSplitterRegexp = function(a, c) {
                        if (a.indexOf("(?=") != -1) {
                            var d = 0;
                            var e = false;
                            var b = {};
                            a.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(g, i, a, h, c, f) {
                                if (e) {
                                    e = c != "]";
                                } else if (c) {
                                    e = true;
                                } else if (h) {
                                    if (d == b.stack) {
                                        b.end = f + 1;
                                        b.stack = -1;
                                    }
                                    d--;
                                } else if (a) {
                                    d++;
                                    if (a.length != 1) {
                                        b.stack = d;
                                        b.start = f;
                                    }
                                }
                                return g;
                            });
                            if (b.end != null && /^\)*$/.test(a.substr(b.end))) a = a.substring(0, b.start) + a.substr(b.end);
                        }
                        if (a.charAt(0) != "^") a = "^" + a;
                        if (a.charAt(a.length - 1) != "$") a += "$";
                        return new RegExp(a, (c || "").replace("g", ""));
                    };
                    this.getLineTokens = function(h, i) {
                        if (i && typeof i != "string") {
                            var c = i.slice(0);
                            i = c[0];
                            if (i === "#tmp") {
                                c.shift();
                                i = c.shift();
                            }
                        } else var c = [];
                        var a = i || "start";
                        var l = this.states[a];
                        if (!l) {
                            a = "start";
                            l = this.states[a];
                        }
                        var q = this.matchMappings[a];
                        var o = this.regExps[a];
                        o.lastIndex = 0;
                        var p, k = [];
                        var g = 0;
                        var r = 0;
                        var b = {
                            type: null,
                            value: ""
                        };
                        while((p = o.exec(h))){
                            var e = q.defaultToken;
                            var d = null;
                            var m = p[0];
                            var n = o.lastIndex;
                            if (n - m.length > g) {
                                var s = h.substring(g, n - m.length);
                                if (b.type == e) {
                                    b.value += s;
                                } else {
                                    if (b.type) k.push(b);
                                    b = {
                                        type: e,
                                        value: s
                                    };
                                }
                            }
                            for(var j = 0; j < p.length - 2; j++){
                                if (p[j + 1] === undefined) continue;
                                d = l[q[j]];
                                if (d.onMatch) e = d.onMatch(m, a, c, h);
                                else e = d.token;
                                if (d.next) {
                                    if (typeof d.next == "string") {
                                        a = d.next;
                                    } else {
                                        a = d.next(a, c);
                                    }
                                    l = this.states[a];
                                    if (!l) {
                                        this.reportError("state doesn't exist", a);
                                        a = "start";
                                        l = this.states[a];
                                    }
                                    q = this.matchMappings[a];
                                    g = n;
                                    o = this.regExps[a];
                                    o.lastIndex = n;
                                }
                                if (d.consumeLineEnd) g = n;
                                break;
                            }
                            if (m) {
                                if (typeof e === "string") {
                                    if ((!d || d.merge !== false) && b.type === e) {
                                        b.value += m;
                                    } else {
                                        if (b.type) k.push(b);
                                        b = {
                                            type: e,
                                            value: m
                                        };
                                    }
                                } else if (e) {
                                    if (b.type) k.push(b);
                                    b = {
                                        type: null,
                                        value: ""
                                    };
                                    for(var j = 0; j < e.length; j++)k.push(e[j]);
                                }
                            }
                            if (g == h.length) break;
                            g = n;
                            if (r++ > f) {
                                if (r > 2 * h.length) {
                                    this.reportError("infinite loop with in ace tokenizer", {
                                        startState: i,
                                        line: h
                                    });
                                }
                                while(g < h.length){
                                    if (b.type) k.push(b);
                                    b = {
                                        value: h.substring(g, (g += 500)),
                                        type: "overflow"
                                    };
                                }
                                a = "start";
                                c = [];
                                break;
                            }
                        }
                        if (b.type) k.push(b);
                        if (c.length > 1) {
                            if (c[0] !== a) c.unshift("#tmp", a);
                        }
                        return {
                            tokens: k,
                            state: c.length ? c : a
                        };
                    };
                    this.reportError = e.reportError;
                }.call(a.prototype));
                c.Tokenizer = a;
            });
            ace.define("ace/mode/text_highlight_rules", [
                "require",
                "exports",
                "module",
                "ace/lib/lang"
            ], function(b, c, d) {
                "use strict";
                var e = b("../lib/lang");
                var a = function() {
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
                    this.addRules = function(d, b) {
                        if (!b) {
                            for(var c in d)this.$rules[c] = d[c];
                            return;
                        }
                        for(var c in d){
                            var e = d[c];
                            for(var f = 0; f < e.length; f++){
                                var a = e[f];
                                if (a.next || a.onMatch) {
                                    if (typeof a.next == "string") {
                                        if (a.next.indexOf(b) !== 0) a.next = b + a.next;
                                    }
                                    if (a.nextState && a.nextState.indexOf(b) !== 0) a.nextState = b + a.nextState;
                                }
                            }
                            this.$rules[b + c] = e;
                        }
                    };
                    this.getRules = function() {
                        return this.$rules;
                    };
                    this.embedRules = function(d, c, f, a, h) {
                        var g = typeof d == "function" ? new d().getRules() : d;
                        if (a) {
                            for(var b = 0; b < a.length; b++)a[b] = c + a[b];
                        } else {
                            a = [];
                            for(var i in g)a.push(c + i);
                        }
                        this.addRules(g, c);
                        if (f) {
                            var j = Array.prototype[h ? "push" : "unshift"];
                            for(var b = 0; b < a.length; b++)j.apply(this.$rules[a[b]], e.deepCopy(f));
                        }
                        if (!this.$embeds) this.$embeds = [];
                        this.$embeds.push(c);
                    };
                    this.getEmbeds = function() {
                        return this.$embeds;
                    };
                    var a = function(a, b) {
                        if (a != "start" || b.length) b.unshift(this.nextState, a);
                        return this.nextState;
                    };
                    var b = function(b, a) {
                        a.shift();
                        return a.shift() || "start";
                    };
                    this.normalizeRules = function() {
                        var e = 0;
                        var c = this.$rules;
                        function d(o) {
                            var i = c[o];
                            i.processed = true;
                            for(var j = 0; j < i.length; j++){
                                var f = i[j];
                                var k = null;
                                if (Array.isArray(f)) {
                                    k = f;
                                    f = {};
                                }
                                if (!f.regex && f.start) {
                                    f.regex = f.start;
                                    if (!f.next) f.next = [];
                                    f.next.push({
                                        defaultToken: f.token
                                    }, {
                                        token: f.token + ".end",
                                        regex: f.end || f.start,
                                        next: "pop"
                                    });
                                    f.token = f.token + ".start";
                                    f.push = true;
                                }
                                var l = f.next || f.push;
                                if (l && Array.isArray(l)) {
                                    var g = f.stateName;
                                    if (!g) {
                                        g = f.token;
                                        if (typeof g != "string") g = g[0] || "";
                                        if (c[g]) g += e++;
                                    }
                                    c[g] = l;
                                    f.next = g;
                                    d(g);
                                } else if (l == "pop") {
                                    f.next = b;
                                }
                                if (f.push) {
                                    f.nextState = f.next || f.push;
                                    f.next = a;
                                    delete f.push;
                                }
                                if (f.rules) {
                                    for(var h in f.rules){
                                        if (c[h]) {
                                            if (c[h].push) c[h].push.apply(c[h], f.rules[h]);
                                        } else {
                                            c[h] = f.rules[h];
                                        }
                                    }
                                }
                                var m = typeof f == "string" ? f : f.include;
                                if (m) {
                                    if (Array.isArray(m)) k = m.map(function(a) {
                                        return c[a];
                                    });
                                    else k = c[m];
                                }
                                if (k) {
                                    var n = [
                                        j,
                                        1
                                    ].concat(k);
                                    if (f.noEscape) n = n.filter(function(a) {
                                        return !a.next;
                                    });
                                    i.splice.apply(i, n);
                                    j--;
                                }
                                if (f.keywordMap) {
                                    f.token = this.createKeywordMapper(f.keywordMap, f.defaultToken || "text", f.caseInsensitive);
                                    delete f.defaultToken;
                                }
                            }
                        }
                        Object.keys(c).forEach(d, this);
                    };
                    this.createKeywordMapper = function(a, c, b, d) {
                        var e = Object.create(null);
                        this.$keywordList = [];
                        Object.keys(a).forEach(function(f) {
                            var i = a[f];
                            var g = i.split(d || "|");
                            for(var h = g.length; h--;){
                                var c = g[h];
                                this.$keywordList.push(c);
                                if (b) c = c.toLowerCase();
                                e[c] = f;
                            }
                        }, this);
                        a = null;
                        return b ? function(a) {
                            return (e[a.toLowerCase()] || c);
                        } : function(a) {
                            return e[a] || c;
                        };
                    };
                    this.getKeywords = function() {
                        return this.$keywords;
                    };
                }.call(a.prototype));
                c.TextHighlightRules = a;
            });
            ace.define("ace/mode/behaviour", [
                "require",
                "exports",
                "module"
            ], function(c, b, d) {
                "use strict";
                var a = function() {
                    this.$behaviours = {};
                };
                (function() {
                    this.add = function(a, b, c) {
                        switch(undefined){
                            case this.$behaviours:
                                this.$behaviours = {};
                            case this.$behaviours[a]:
                                this.$behaviours[a] = {};
                        }
                        this.$behaviours[a][b] = c;
                    };
                    this.addBehaviours = function(a) {
                        for(var b in a){
                            for(var c in a[b]){
                                this.add(b, c, a[b][c]);
                            }
                        }
                    };
                    this.remove = function(a) {
                        if (this.$behaviours && this.$behaviours[a]) {
                            delete this.$behaviours[a];
                        }
                    };
                    this.inherit = function(a, b) {
                        if (typeof a === "function") {
                            var c = new a().getBehaviours(b);
                        } else {
                            var c = a.getBehaviours(b);
                        }
                        this.addBehaviours(c);
                    };
                    this.getBehaviours = function(a) {
                        if (!a) {
                            return this.$behaviours;
                        } else {
                            var c = {};
                            for(var b = 0; b < a.length; b++){
                                if (this.$behaviours[a[b]]) {
                                    c[a[b]] = this.$behaviours[a[b]];
                                }
                            }
                            return c;
                        }
                    };
                }.call(a.prototype));
                b.Behaviour = a;
            });
            ace.define("ace/token_iterator", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(b, c, d) {
                "use strict";
                var e = b("./range").Range;
                var a = function(a, b, d) {
                    this.$session = a;
                    this.$row = b;
                    this.$rowTokens = a.getTokens(b);
                    var c = a.getTokenAt(b, d);
                    this.$tokenIndex = c ? c.index : -1;
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
                        var a;
                        while(this.$tokenIndex >= this.$rowTokens.length){
                            this.$row += 1;
                            if (!a) a = this.$session.getLength();
                            if (this.$row >= a) {
                                this.$row = a - 1;
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
                        var c = this.$rowTokens;
                        var b = this.$tokenIndex;
                        var a = c[b].start;
                        if (a !== undefined) return a;
                        a = 0;
                        while(b > 0){
                            b -= 1;
                            a += c[b].value.length;
                        }
                        return a;
                    };
                    this.getCurrentTokenPosition = function() {
                        return {
                            row: this.$row,
                            column: this.getCurrentTokenColumn()
                        };
                    };
                    this.getCurrentTokenRange = function() {
                        var b = this.$rowTokens[this.$tokenIndex];
                        var a = this.getCurrentTokenColumn();
                        return new e(this.$row, a, this.$row, a + b.value.length);
                    };
                }.call(a.prototype));
                c.TokenIterator = a;
            });
            ace.define("ace/mode/behaviour/cstyle", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/mode/behaviour",
                "ace/token_iterator",
                "ace/lib/lang", 
            ], function(b, c, f) {
                "use strict";
                var d = b("../../lib/oop");
                var e = b("../behaviour").Behaviour;
                var g = b("../../token_iterator").TokenIterator;
                var h = b("../../lib/lang");
                var i = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator", 
                ];
                var j = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator",
                    "comment", 
                ];
                var k;
                var l = {};
                var m = {
                    '"': '"',
                    "'": "'"
                };
                var n = function(a) {
                    var b = -1;
                    if (a.multiSelect) {
                        b = a.selection.index;
                        if (l.rangeCount != a.multiSelect.rangeCount) l = {
                            rangeCount: a.multiSelect.rangeCount
                        };
                    }
                    if (l[b]) return (k = l[b]);
                    k = l[b] = {
                        autoInsertedBrackets: 0,
                        autoInsertedRow: -1,
                        autoInsertedLineEnd: "",
                        maybeInsertedBrackets: 0,
                        maybeInsertedRow: -1,
                        maybeInsertedLineStart: "",
                        maybeInsertedLineEnd: ""
                    };
                };
                var o = function(a, c, d, e) {
                    var b = a.end.row - a.start.row;
                    return {
                        text: d + c + e,
                        selection: [
                            0,
                            a.start.column + 1,
                            b,
                            a.end.column + (b ? 0 : 1), 
                        ]
                    };
                };
                var a = function(b) {
                    this.add("braces", "insertion", function(t, u, d, e, g) {
                        var c = d.getCursorPosition();
                        var f = e.doc.getLine(c.row);
                        if (g == "{") {
                            n(d);
                            var q = d.getSelectionRange();
                            var i = e.doc.getTextRange(q);
                            if (i !== "" && i !== "{" && d.getWrapBehavioursEnabled()) {
                                return o(q, i, "{", "}");
                            } else if (a.isSaneInsertion(d, e)) {
                                if (/[\]\}\)]/.test(f[c.column]) || d.inMultiSelectMode || (b && b.braces)) {
                                    a.recordAutoInsert(d, e, "}");
                                    return {
                                        text: "{}",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                } else {
                                    a.recordMaybeInsert(d, e, "{");
                                    return {
                                        text: "{",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        } else if (g == "}") {
                            n(d);
                            var j = f.substring(c.column, c.column + 1);
                            if (j == "}") {
                                var s = e.$findOpeningBracket("}", {
                                    column: c.column + 1,
                                    row: c.row
                                });
                                if (s !== null && a.isAutoInsertedClosing(c, f, g)) {
                                    a.popAutoInsertedClosing();
                                    return {
                                        text: "",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        } else if (g == "\n" || g == "\r\n") {
                            n(d);
                            var l = "";
                            if (a.isMaybeInsertedClosing(c, f)) {
                                l = h.stringRepeat("}", k.maybeInsertedBrackets);
                                a.clearMaybeInsertedClosing();
                            }
                            var j = f.substring(c.column, c.column + 1);
                            if (j === "}") {
                                var r = e.findMatchingBracket({
                                    row: c.row,
                                    column: c.column + 1
                                }, "}");
                                if (!r) return null;
                                var m = this.$getIndent(e.getLine(r.row));
                            } else if (l) {
                                var m = this.$getIndent(f);
                            } else {
                                a.clearMaybeInsertedClosing();
                                return;
                            }
                            var p = m + e.getTabString();
                            return {
                                text: "\n" + p + "\n" + m + l,
                                selection: [
                                    1,
                                    p.length,
                                    1,
                                    p.length, 
                                ]
                            };
                        } else {
                            a.clearMaybeInsertedClosing();
                        }
                    });
                    this.add("braces", "deletion", function(g, h, c, b, a) {
                        var d = b.doc.getTextRange(a);
                        if (!a.isMultiLine() && d == "{") {
                            n(c);
                            var e = b.doc.getLine(a.start.row);
                            var f = e.substring(a.end.column, a.end.column + 1);
                            if (f == "}") {
                                a.end.column++;
                                return a;
                            } else {
                                k.maybeInsertedBrackets--;
                            }
                        }
                    });
                    this.add("parens", "insertion", function(k, l, b, d, e) {
                        if (e == "(") {
                            n(b);
                            var f = b.getSelectionRange();
                            var g = d.doc.getTextRange(f);
                            if (g !== "" && b.getWrapBehavioursEnabled()) {
                                return o(f, g, "(", ")");
                            } else if (a.isSaneInsertion(b, d)) {
                                a.recordAutoInsert(b, d, ")");
                                return {
                                    text: "()",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        } else if (e == ")") {
                            n(b);
                            var c = b.getCursorPosition();
                            var h = d.doc.getLine(c.row);
                            var i = h.substring(c.column, c.column + 1);
                            if (i == ")") {
                                var j = d.$findOpeningBracket(")", {
                                    column: c.column + 1,
                                    row: c.row
                                });
                                if (j !== null && a.isAutoInsertedClosing(c, h, e)) {
                                    a.popAutoInsertedClosing();
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
                    this.add("parens", "deletion", function(g, h, c, b, a) {
                        var d = b.doc.getTextRange(a);
                        if (!a.isMultiLine() && d == "(") {
                            n(c);
                            var e = b.doc.getLine(a.start.row);
                            var f = e.substring(a.start.column + 1, a.start.column + 2);
                            if (f == ")") {
                                a.end.column++;
                                return a;
                            }
                        }
                    });
                    this.add("brackets", "insertion", function(k, l, b, d, e) {
                        if (e == "[") {
                            n(b);
                            var f = b.getSelectionRange();
                            var g = d.doc.getTextRange(f);
                            if (g !== "" && b.getWrapBehavioursEnabled()) {
                                return o(f, g, "[", "]");
                            } else if (a.isSaneInsertion(b, d)) {
                                a.recordAutoInsert(b, d, "]");
                                return {
                                    text: "[]",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        } else if (e == "]") {
                            n(b);
                            var c = b.getCursorPosition();
                            var h = d.doc.getLine(c.row);
                            var i = h.substring(c.column, c.column + 1);
                            if (i == "]") {
                                var j = d.$findOpeningBracket("]", {
                                    column: c.column + 1,
                                    row: c.row
                                });
                                if (j !== null && a.isAutoInsertedClosing(c, h, e)) {
                                    a.popAutoInsertedClosing();
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
                    this.add("brackets", "deletion", function(g, h, c, b, a) {
                        var d = b.doc.getTextRange(a);
                        if (!a.isMultiLine() && d == "[") {
                            n(c);
                            var e = b.doc.getLine(a.start.row);
                            var f = e.substring(a.start.column + 1, a.start.column + 2);
                            if (f == "]") {
                                a.end.column++;
                                return a;
                            }
                        }
                    });
                    this.add("string_dquotes", "insertion", function(x, y, g, c, h) {
                        var s = c.$mode.$quotes || m;
                        if (h.length == 1 && s[h]) {
                            if (this.lineCommentStart && this.lineCommentStart.indexOf(h) != -1) return;
                            n(g);
                            var b = h;
                            var t = g.getSelectionRange();
                            var d = c.doc.getTextRange(t);
                            if (d !== "" && (d.length != 1 || !s[d]) && g.getWrapBehavioursEnabled()) {
                                return o(t, d, b, b);
                            } else if (!d) {
                                var a = g.getCursorPosition();
                                var k = c.doc.getLine(a.row);
                                var i = k.substring(a.column - 1, a.column);
                                var l = k.substring(a.column, a.column + 1);
                                var j = c.getTokenAt(a.row, a.column);
                                var p = c.getTokenAt(a.row, a.column + 1);
                                if (i == "\\" && j && /escape/.test(j.type)) return null;
                                var q = j && /string|escape/.test(j.type);
                                var r = !p || /string|escape/.test(p.type);
                                var e;
                                if (l == b) {
                                    e = q !== r;
                                    if (e && /string\.end/.test(p.type)) e = false;
                                } else {
                                    if (q && !r) return null;
                                    if (q && r) return null;
                                    var f = c.$mode.tokenRe;
                                    f.lastIndex = 0;
                                    var v = f.test(i);
                                    f.lastIndex = 0;
                                    var w = f.test(i);
                                    if (v || w) return null;
                                    if (l && !/[\s;,.})\]\\]/.test(l)) return null;
                                    var u = k[a.column - 2];
                                    if (i == b && (u == b || f.test(u))) return null;
                                    e = true;
                                }
                                return {
                                    text: e ? b + b : "",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        }
                    });
                    this.add("string_dquotes", "deletion", function(h, i, d, b, a) {
                        var e = b.$mode.$quotes || m;
                        var c = b.doc.getTextRange(a);
                        if (!a.isMultiLine() && e.hasOwnProperty(c)) {
                            n(d);
                            var f = b.doc.getLine(a.start.row);
                            var g = f.substring(a.start.column + 1, a.start.column + 2);
                            if (g == c) {
                                a.end.column++;
                                return a;
                            }
                        }
                    });
                };
                a.isSaneInsertion = function(c, d) {
                    var a = c.getCursorPosition();
                    var b = new g(d, a.row, a.column);
                    if (!this.$matchTokenType(b.getCurrentToken() || "text", i)) {
                        if (/[)}\]]/.test(c.session.getLine(a.row)[a.column])) return true;
                        var e = new g(d, a.row, a.column + 1);
                        if (!this.$matchTokenType(e.getCurrentToken() || "text", i)) return false;
                    }
                    b.stepForward();
                    return (b.getCurrentTokenRow() !== a.row || this.$matchTokenType(b.getCurrentToken() || "text", j));
                };
                a.$matchTokenType = function(a, b) {
                    return b.indexOf(a.type || a) > -1;
                };
                a.recordAutoInsert = function(c, d, e) {
                    var a = c.getCursorPosition();
                    var b = d.doc.getLine(a.row);
                    if (!this.isAutoInsertedClosing(a, b, k.autoInsertedLineEnd[0])) k.autoInsertedBrackets = 0;
                    k.autoInsertedRow = a.row;
                    k.autoInsertedLineEnd = e + b.substr(a.column);
                    k.autoInsertedBrackets++;
                };
                a.recordMaybeInsert = function(c, d, e) {
                    var a = c.getCursorPosition();
                    var b = d.doc.getLine(a.row);
                    if (!this.isMaybeInsertedClosing(a, b)) k.maybeInsertedBrackets = 0;
                    k.maybeInsertedRow = a.row;
                    k.maybeInsertedLineStart = b.substr(0, a.column) + e;
                    k.maybeInsertedLineEnd = b.substr(a.column);
                    k.maybeInsertedBrackets++;
                };
                a.isAutoInsertedClosing = function(a, b, c) {
                    return (k.autoInsertedBrackets > 0 && a.row === k.autoInsertedRow && c === k.autoInsertedLineEnd[0] && b.substr(a.column) === k.autoInsertedLineEnd);
                };
                a.isMaybeInsertedClosing = function(a, b) {
                    return (k.maybeInsertedBrackets > 0 && a.row === k.maybeInsertedRow && b.substr(a.column) === k.maybeInsertedLineEnd && b.substr(0, a.column) == k.maybeInsertedLineStart);
                };
                a.popAutoInsertedClosing = function() {
                    k.autoInsertedLineEnd = k.autoInsertedLineEnd.substr(1);
                    k.autoInsertedBrackets--;
                };
                a.clearMaybeInsertedClosing = function() {
                    if (k) {
                        k.maybeInsertedBrackets = 0;
                        k.maybeInsertedRow = -1;
                    }
                };
                d.inherits(a, e);
                c.CstyleBehaviour = a;
            });
            ace.define("ace/unicode", [
                "require",
                "exports",
                "module"
            ], function(f, e, g) {
                "use strict";
                var b = [
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
                var d = 0;
                var c = [];
                for(var a = 0; a < b.length; a += 2){
                    c.push((d += b[a]));
                    if (b[a + 1]) c.push(45, (d += b[a + 1]));
                }
                e.wordChars = String.fromCharCode.apply(null, c);
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
            ], function(a, c, d) {
                "use strict";
                var e = a("../config");
                var f = a("../tokenizer").Tokenizer;
                var g = a("./text_highlight_rules").TextHighlightRules;
                var h = a("./behaviour/cstyle").CstyleBehaviour;
                var i = a("../unicode");
                var j = a("../lib/lang");
                var k = a("../token_iterator").TokenIterator;
                var l = a("../range").Range;
                var b = function() {
                    this.HighlightRules = g;
                };
                (function() {
                    this.$defaultBehaviour = new h();
                    this.tokenRe = new RegExp("^[" + i.wordChars + "\\$_]+", "g");
                    this.nonTokenRe = new RegExp("^(?:[^" + i.wordChars + "\\$_]|\\s])+", "g");
                    this.getTokenizer = function() {
                        if (!this.$tokenizer) {
                            this.$highlightRules = this.$highlightRules || new this.HighlightRules(this.$highlightRuleConfig);
                            this.$tokenizer = new f(this.$highlightRules.getRules());
                        }
                        return this.$tokenizer;
                    };
                    this.lineCommentStart = "";
                    this.blockComment = "";
                    this.toggleCommentLines = function(p, d, q, r) {
                        var s = d.doc;
                        var l = true;
                        var f = true;
                        var a = Infinity;
                        var e = d.getTabSize();
                        var g = false;
                        if (!this.lineCommentStart) {
                            if (!this.blockComment) return false;
                            var b = this.blockComment.start;
                            var m = this.blockComment.end;
                            var c = new RegExp("^(\\s*)(?:" + j.escapeRegExp(b) + ")");
                            var t = new RegExp("(?:" + j.escapeRegExp(m) + ")\\s*$");
                            var h = function(c, d) {
                                if (n(c, d)) return;
                                if (!l || /\S/.test(c)) {
                                    s.insertInLine({
                                        row: d,
                                        column: c.length
                                    }, m);
                                    s.insertInLine({
                                        row: d,
                                        column: a
                                    }, b);
                                }
                            };
                            var i = function(b, d) {
                                var a;
                                if ((a = b.match(t))) s.removeInLine(d, b.length - a[0].length, b.length);
                                if ((a = b.match(c))) s.removeInLine(d, a[1].length, a[0].length);
                            };
                            var n = function(e, f) {
                                if (c.test(e)) return true;
                                var b = d.getTokens(f);
                                for(var a = 0; a < b.length; a++){
                                    if (b[a].type === "comment") return true;
                                }
                            };
                        } else {
                            if (Array.isArray(this.lineCommentStart)) {
                                var c = this.lineCommentStart.map(j.escapeRegExp).join("|");
                                var b = this.lineCommentStart[0];
                            } else {
                                var c = j.escapeRegExp(this.lineCommentStart);
                                var b = this.lineCommentStart;
                            }
                            c = new RegExp("^(\\s*)(?:" + c + ") ?");
                            g = d.getUseSoftTabs();
                            var i = function(d, f) {
                                var a = d.match(c);
                                if (!a) return;
                                var e = a[1].length, b = a[0].length;
                                if (!v(d, e, b) && a[0][b - 1] == " ") b--;
                                s.removeInLine(f, e, b);
                            };
                            var u = b + " ";
                            var h = function(c, d) {
                                if (!l || /\S/.test(c)) {
                                    if (v(c, a, a)) s.insertInLine({
                                        row: d,
                                        column: a
                                    }, u);
                                    else s.insertInLine({
                                        row: d,
                                        column: a
                                    }, b);
                                }
                            };
                            var n = function(a, b) {
                                return c.test(a);
                            };
                            var v = function(b, c, d) {
                                var a = 0;
                                while(c-- && b.charAt(c) == " ")a++;
                                if (a % e != 0) return false;
                                var a = 0;
                                while(b.charAt(d++) == " ")a++;
                                if (e > 2) return a % e != e - 1;
                                else return a % e == 0;
                            };
                        }
                        function k(b) {
                            for(var a = q; a <= r; a++)b(s.getLine(a), a);
                        }
                        var o = Infinity;
                        k(function(b, d) {
                            var c = b.search(/\S/);
                            if (c !== -1) {
                                if (c < a) a = c;
                                if (f && !n(b, d)) f = false;
                            } else if (o > b.length) {
                                o = b.length;
                            }
                        });
                        if (a == Infinity) {
                            a = o;
                            l = false;
                            f = false;
                        }
                        if (g && a % e != 0) a = Math.floor(a / e) * e;
                        k(f ? i : h);
                    };
                    this.toggleBlockComment = function(q, c, o, i) {
                        var a = this.blockComment;
                        if (!a) return;
                        if (!a.start && a[0]) a = a[0];
                        var d = new k(c, i.row, i.column);
                        var b = d.getCurrentToken();
                        var r = c.selection;
                        var e = c.selection.toOrientedRange();
                        var j, m;
                        if (b && /comment/.test(b.type)) {
                            var n, p;
                            while(b && /comment/.test(b.type)){
                                var f = b.value.indexOf(a.start);
                                if (f != -1) {
                                    var g = d.getCurrentTokenRow();
                                    var h = d.getCurrentTokenColumn() + f;
                                    n = new l(g, h, g, h + a.start.length);
                                    break;
                                }
                                b = d.stepBackward();
                            }
                            var d = new k(c, i.row, i.column);
                            var b = d.getCurrentToken();
                            while(b && /comment/.test(b.type)){
                                var f = b.value.indexOf(a.end);
                                if (f != -1) {
                                    var g = d.getCurrentTokenRow();
                                    var h = d.getCurrentTokenColumn() + f;
                                    p = new l(g, h, g, h + a.end.length);
                                    break;
                                }
                                b = d.stepForward();
                            }
                            if (p) c.remove(p);
                            if (n) {
                                c.remove(n);
                                j = n.start.row;
                                m = -a.start.length;
                            }
                        } else {
                            m = a.start.length;
                            j = o.start.row;
                            c.insert(o.end, a.end);
                            c.insert(o.start, a.start);
                        }
                        if (e.start.row == j) e.start.column += m;
                        if (e.end.row == j) e.end.column += m;
                        c.selection.fromOrientedRange(e);
                    };
                    this.getNextLineIndent = function(b, a, c) {
                        return this.$getIndent(a);
                    };
                    this.checkOutdent = function(a, b, c) {
                        return false;
                    };
                    this.autoOutdent = function(a, b, c) {};
                    this.$getIndent = function(a) {
                        return a.match(/^\s*/)[0];
                    };
                    this.createWorker = function(a) {
                        return null;
                    };
                    this.createModeDelegates = function(c) {
                        this.$embeds = [];
                        this.$modes = {};
                        for(var a in c){
                            if (c[a]) {
                                var d = c[a];
                                var f = d.prototype.$id;
                                var b = e.$modes[f];
                                if (!b) e.$modes[f] = b = new d();
                                if (!e.$modes[a]) e.$modes[a] = b;
                                this.$embeds.push(a);
                                this.$modes[a] = b;
                            }
                        }
                        var g = [
                            "toggleBlockComment",
                            "toggleCommentLines",
                            "getNextLineIndent",
                            "checkOutdent",
                            "autoOutdent",
                            "transformAction",
                            "getCompletions", 
                        ];
                        for(var a = 0; a < g.length; a++){
                            (function(b) {
                                var c = g[a];
                                var d = b[c];
                                b[g[a]] = function() {
                                    return this.$delegator(c, arguments, d);
                                };
                            })(this);
                        }
                    };
                    this.$delegator = function(f, c, g) {
                        var a = c[0] || "start";
                        if (typeof a != "string") {
                            if (Array.isArray(a[2])) {
                                var h = a[2][a[2].length - 1];
                                var b = this.$modes[h];
                                if (b) return b[f].apply(b, [
                                    a[1]
                                ].concat([].slice.call(c, 1)));
                            }
                            a = a[0] || "start";
                        }
                        for(var d = 0; d < this.$embeds.length; d++){
                            if (!this.$modes[this.$embeds[d]]) continue;
                            var e = a.split(this.$embeds[d]);
                            if (!e[0] && e[1]) {
                                c[0] = e[1];
                                var b = this.$modes[this.$embeds[d]];
                                return b[f].apply(b, c);
                            }
                        }
                        var i = g.apply(this, c);
                        return g ? i : undefined;
                    };
                    this.transformAction = function(e, b, f, g, h) {
                        if (this.$behaviour) {
                            var a = this.$behaviour.getBehaviours();
                            for(var c in a){
                                if (a[c][b]) {
                                    var d = a[c][b].apply(this, arguments);
                                    if (d) {
                                        return d;
                                    }
                                }
                            }
                        }
                    };
                    this.getKeywords = function(g) {
                        if (!this.completionKeywords) {
                            var f = this.$tokenizer.rules;
                            var c = [];
                            for(var d in f){
                                var b = f[d];
                                for(var a = 0, h = b.length; a < h; a++){
                                    if (typeof b[a].token === "string") {
                                        if (/keyword|support|storage/.test(b[a].token)) c.push(b[a].regex);
                                    } else if (typeof b[a].token === "object") {
                                        for(var e = 0, i = b[a].token.length; e < i; e++){
                                            if (/keyword|support|storage/.test(b[a].token[e])) {
                                                var d = b[a].regex.match(/\(.+?\)/g)[e];
                                                c.push(d.substr(1, d.length - 2));
                                            }
                                        }
                                    }
                                }
                            }
                            this.completionKeywords = c;
                        }
                        if (!g) return this.$keywordList;
                        return c.concat(this.$keywordList || []);
                    };
                    this.$createKeywordList = function() {
                        if (!this.$highlightRules) this.getTokenizer();
                        return (this.$keywordList = this.$highlightRules.$keywordList || []);
                    };
                    this.getCompletions = function(b, c, d, e) {
                        var a = this.$keywordList || this.$createKeywordList();
                        return a.map(function(a) {
                            return {
                                name: a,
                                value: a,
                                score: 0,
                                meta: "keyword"
                            };
                        });
                    };
                    this.$id = "ace/mode/text";
                }.call(b.prototype));
                c.Mode = b;
            });
            ace.define("ace/apply_delta", [
                "require",
                "exports",
                "module"
            ], function(b, a, c) {
                "use strict";
                function d(a, b) {
                    console.log("Invalid Delta:", a);
                    throw "Invalid Delta: " + b;
                }
                function e(b, a) {
                    return (a.row >= 0 && a.row < b.length && a.column >= 0 && a.column <= b[a.row].length);
                }
                function f(f, a) {
                    if (a.action != "insert" && a.action != "remove") d(a, "delta.action must be 'insert' or 'remove'");
                    if (!(a.lines instanceof Array)) d(a, "delta.lines must be an Array");
                    if (!a.start || !a.end) d(a, "delta.start/end must be an present");
                    var g = a.start;
                    if (!e(f, a.start)) d(a, "delta.start must be contained in document");
                    var b = a.end;
                    if (a.action == "remove" && !e(f, b)) d(a, "delta.end must contained in document for 'remove' actions");
                    var c = b.row - g.row;
                    var h = b.column - (c == 0 ? g.column : 0);
                    if (c != a.lines.length - 1 || a.lines[c].length != h) d(a, "delta.range must match delta lines");
                }
                a.applyDelta = function(a, c, j) {
                    var b = c.start.row;
                    var e = c.start.column;
                    var d = a[b] || "";
                    switch(c.action){
                        case "insert":
                            var h = c.lines;
                            if (h.length === 1) {
                                a[b] = d.substring(0, e) + c.lines[0] + d.substring(e);
                            } else {
                                var i = [
                                    b,
                                    1
                                ].concat(c.lines);
                                a.splice.apply(a, i);
                                a[b] = d.substring(0, e) + a[b];
                                a[b + c.lines.length - 1] += d.substring(e);
                            }
                            break;
                        case "remove":
                            var g = c.end.column;
                            var f = c.end.row;
                            if (b === f) {
                                a[b] = d.substring(0, e) + d.substring(g);
                            } else {
                                a.splice(b, f - b + 1, d.substring(0, e) + a[f].substring(g));
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
            ], function(a, b, d) {
                "use strict";
                var e = a("./lib/oop");
                var f = a("./lib/event_emitter").EventEmitter;
                var c = (b.Anchor = function(c, a, b) {
                    this.$onChange = this.onChange.bind(this);
                    this.attach(c);
                    if (typeof b == "undefined") this.setPosition(a.row, a.column);
                    else this.setPosition(a, b);
                });
                (function() {
                    e.implement(this, f);
                    this.getPosition = function() {
                        return this.$clipPositionToDocument(this.row, this.column);
                    };
                    this.getDocument = function() {
                        return this.document;
                    };
                    this.$insertRight = false;
                    this.onChange = function(a) {
                        if (a.start.row == a.end.row && a.start.row != this.row) return;
                        if (a.start.row > this.row) return;
                        var c = b(a, {
                            row: this.row,
                            column: this.column
                        }, this.$insertRight);
                        this.setPosition(c.row, c.column, true);
                    };
                    function a(a, b, c) {
                        var d = c ? a.column <= b.column : a.column < b.column;
                        return (a.row < b.row || (a.row == b.row && d));
                    }
                    function b(b, c, f) {
                        var e = b.action == "insert";
                        var h = (e ? 1 : -1) * (b.end.row - b.start.row);
                        var i = (e ? 1 : -1) * (b.end.column - b.start.column);
                        var d = b.start;
                        var g = e ? d : b.end;
                        if (a(c, d, f)) {
                            return {
                                row: c.row,
                                column: c.column
                            };
                        }
                        if (a(g, c, !f)) {
                            return {
                                row: c.row + h,
                                column: c.column + (c.row == g.row ? i : 0)
                            };
                        }
                        return {
                            row: d.row,
                            column: d.column
                        };
                    }
                    this.setPosition = function(b, c, d) {
                        var a;
                        if (d) {
                            a = {
                                row: b,
                                column: c
                            };
                        } else {
                            a = this.$clipPositionToDocument(b, c);
                        }
                        if (this.row == a.row && this.column == a.column) return;
                        var e = {
                            row: this.row,
                            column: this.column
                        };
                        this.row = a.row;
                        this.column = a.column;
                        this._signal("change", {
                            old: e,
                            value: a
                        });
                    };
                    this.detach = function() {
                        this.document.off("change", this.$onChange);
                    };
                    this.attach = function(a) {
                        this.document = a || this.document;
                        this.document.on("change", this.$onChange);
                    };
                    this.$clipPositionToDocument = function(b, c) {
                        var a = {};
                        if (b >= this.document.getLength()) {
                            a.row = Math.max(0, this.document.getLength() - 1);
                            a.column = this.document.getLine(a.row).length;
                        } else if (b < 0) {
                            a.row = 0;
                            a.column = 0;
                        } else {
                            a.row = b;
                            a.column = Math.min(this.document.getLine(a.row).length, Math.max(0, c));
                        }
                        if (c < 0) a.column = 0;
                        return a;
                    };
                }.call(c.prototype));
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
            ], function(a, c, d) {
                "use strict";
                var e = a("./lib/oop");
                var f = a("./apply_delta").applyDelta;
                var g = a("./lib/event_emitter").EventEmitter;
                var h = a("./range").Range;
                var i = a("./anchor").Anchor;
                var b = function(a) {
                    this.$lines = [
                        ""
                    ];
                    if (a.length === 0) {
                        this.$lines = [
                            ""
                        ];
                    } else if (Array.isArray(a)) {
                        this.insertMergedLines({
                            row: 0,
                            column: 0
                        }, a);
                    } else {
                        this.insert({
                            row: 0,
                            column: 0
                        }, a);
                    }
                };
                (function() {
                    e.implement(this, g);
                    this.setValue = function(b) {
                        var a = this.getLength() - 1;
                        this.remove(new h(0, 0, a, this.getLine(a).length));
                        this.insert({
                            row: 0,
                            column: 0
                        }, b);
                    };
                    this.getValue = function() {
                        return this.getAllLines().join(this.getNewLineCharacter());
                    };
                    this.createAnchor = function(a, b) {
                        return new i(this, a, b);
                    };
                    if ("aaa".split(/a/).length === 0) {
                        this.$split = function(a) {
                            return a.replace(/\r\n|\r/g, "\n").split("\n");
                        };
                    } else {
                        this.$split = function(a) {
                            return a.split(/\r\n|\r|\n/);
                        };
                    }
                    this.$detectNewLine = function(b) {
                        var a = b.match(/^.*?(\r\n|\r|\n)/m);
                        this.$autoNewLine = a ? a[1] : "\n";
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
                    this.setNewLineMode = function(a) {
                        if (this.$newLineMode === a) return;
                        this.$newLineMode = a;
                        this._signal("changeNewLineMode");
                    };
                    this.getNewLineMode = function() {
                        return this.$newLineMode;
                    };
                    this.isNewLine = function(a) {
                        return (a == "\r\n" || a == "\r" || a == "\n");
                    };
                    this.getLine = function(a) {
                        return this.$lines[a] || "";
                    };
                    this.getLines = function(a, b) {
                        return this.$lines.slice(a, b + 1);
                    };
                    this.getAllLines = function() {
                        return this.getLines(0, this.getLength());
                    };
                    this.getLength = function() {
                        return this.$lines.length;
                    };
                    this.getTextRange = function(a) {
                        return this.getLinesForRange(a).join(this.getNewLineCharacter());
                    };
                    this.getLinesForRange = function(a) {
                        var b;
                        if (a.start.row === a.end.row) {
                            b = [
                                this.getLine(a.start.row).substring(a.start.column, a.end.column), 
                            ];
                        } else {
                            b = this.getLines(a.start.row, a.end.row);
                            b[0] = (b[0] || "").substring(a.start.column);
                            var c = b.length - 1;
                            if (a.end.row - a.start.row == c) b[c] = b[c].substring(0, a.end.column);
                        }
                        return b;
                    };
                    this.insertLines = function(a, b) {
                        console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead.");
                        return this.insertFullLines(a, b);
                    };
                    this.removeLines = function(a, b) {
                        console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead.");
                        return this.removeFullLines(a, b);
                    };
                    this.insertNewLine = function(a) {
                        console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead.");
                        return this.insertMergedLines(a, [
                            "",
                            ""
                        ]);
                    };
                    this.insert = function(b, a) {
                        if (this.getLength() <= 1) this.$detectNewLine(a);
                        return this.insertMergedLines(b, this.$split(a));
                    };
                    this.insertInLine = function(a, b) {
                        var d = this.clippedPos(a.row, a.column);
                        var c = this.pos(a.row, a.column + b.length);
                        this.applyDelta({
                            start: d,
                            end: c,
                            action: "insert",
                            lines: [
                                b
                            ]
                        }, true);
                        return this.clonePos(c);
                    };
                    this.clippedPos = function(a, b) {
                        var c = this.getLength();
                        if (a === undefined) {
                            a = c;
                        } else if (a < 0) {
                            a = 0;
                        } else if (a >= c) {
                            a = c - 1;
                            b = undefined;
                        }
                        var d = this.getLine(a);
                        if (b == undefined) b = d.length;
                        b = Math.min(Math.max(b, 0), d.length);
                        return {
                            row: a,
                            column: b
                        };
                    };
                    this.clonePos = function(a) {
                        return {
                            row: a.row,
                            column: a.column
                        };
                    };
                    this.pos = function(a, b) {
                        return {
                            row: a,
                            column: b
                        };
                    };
                    this.$clipPosition = function(a) {
                        var b = this.getLength();
                        if (a.row >= b) {
                            a.row = Math.max(0, b - 1);
                            a.column = this.getLine(b - 1).length;
                        } else {
                            a.row = Math.max(0, a.row);
                            a.column = Math.min(Math.max(a.column, 0), this.getLine(a.row).length);
                        }
                        return a;
                    };
                    this.insertFullLines = function(a, b) {
                        a = Math.min(Math.max(a, 0), this.getLength());
                        var c = 0;
                        if (a < this.getLength()) {
                            b = b.concat([
                                ""
                            ]);
                            c = 0;
                        } else {
                            b = [
                                ""
                            ].concat(b);
                            a--;
                            c = this.$lines[a].length;
                        }
                        this.insertMergedLines({
                            row: a,
                            column: c
                        }, b);
                    };
                    this.insertMergedLines = function(c, a) {
                        var b = this.clippedPos(c.row, c.column);
                        var d = {
                            row: b.row + a.length - 1,
                            column: (a.length == 1 ? b.column : 0) + a[a.length - 1].length
                        };
                        this.applyDelta({
                            start: b,
                            end: d,
                            action: "insert",
                            lines: a
                        });
                        return this.clonePos(d);
                    };
                    this.remove = function(a) {
                        var b = this.clippedPos(a.start.row, a.start.column);
                        var c = this.clippedPos(a.end.row, a.end.column);
                        this.applyDelta({
                            start: b,
                            end: c,
                            action: "remove",
                            lines: this.getLinesForRange({
                                start: b,
                                end: c
                            })
                        });
                        return this.clonePos(b);
                    };
                    this.removeInLine = function(b, d, e) {
                        var a = this.clippedPos(b, d);
                        var c = this.clippedPos(b, e);
                        this.applyDelta({
                            start: a,
                            end: c,
                            action: "remove",
                            lines: this.getLinesForRange({
                                start: a,
                                end: c
                            })
                        }, true);
                        return this.clonePos(a);
                    };
                    this.removeFullLines = function(b, a) {
                        b = Math.min(Math.max(0, b), this.getLength() - 1);
                        a = Math.min(Math.max(0, a), this.getLength() - 1);
                        var d = a == this.getLength() - 1 && b > 0;
                        var e = a < this.getLength() - 1;
                        var f = d ? b - 1 : b;
                        var i = d ? this.getLine(f).length : 0;
                        var g = e ? a + 1 : a;
                        var j = e ? 0 : this.getLine(g).length;
                        var c = new h(f, i, g, j);
                        var k = this.$lines.slice(b, a + 1);
                        this.applyDelta({
                            start: c.start,
                            end: c.end,
                            action: "remove",
                            lines: this.getLinesForRange(c)
                        });
                        return k;
                    };
                    this.removeNewLine = function(a) {
                        if (a < this.getLength() - 1 && a >= 0) {
                            this.applyDelta({
                                start: this.pos(a, this.getLine(a).length),
                                end: this.pos(a + 1, 0),
                                action: "remove",
                                lines: [
                                    "",
                                    ""
                                ]
                            });
                        }
                    };
                    this.replace = function(a, b) {
                        if (!(a instanceof h)) a = h.fromPoints(a.start, a.end);
                        if (b.length === 0 && a.isEmpty()) return a.start;
                        if (b == this.getTextRange(a)) return a.end;
                        this.remove(a);
                        var c;
                        if (b) {
                            c = this.insert(a.start, b);
                        } else {
                            c = a.start;
                        }
                        return c;
                    };
                    this.applyDeltas = function(b) {
                        for(var a = 0; a < b.length; a++){
                            this.applyDelta(b[a]);
                        }
                    };
                    this.revertDeltas = function(b) {
                        for(var a = b.length - 1; a >= 0; a--){
                            this.revertDelta(b[a]);
                        }
                    };
                    this.applyDelta = function(a, c) {
                        var b = a.action == "insert";
                        if (b ? a.lines.length <= 1 && !a.lines[0] : !h.comparePoints(a.start, a.end)) {
                            return;
                        }
                        if (b && a.lines.length > 20000) {
                            this.$splitAndapplyLargeDelta(a, 20000);
                        } else {
                            f(this.$lines, a, c);
                            this._signal("change", a);
                        }
                    };
                    this.$safeApplyDelta = function(a) {
                        var b = this.$lines.length;
                        if ((a.action == "remove" && a.start.row < b && a.end.row < b) || (a.action == "insert" && a.start.row <= b)) {
                            this.applyDelta(a);
                        }
                    };
                    this.$splitAndapplyLargeDelta = function(a, g) {
                        var d = a.lines;
                        var i = d.length - g + 1;
                        var e = a.start.row;
                        var f = a.start.column;
                        for(var b = 0, c = 0; b < i; b = c){
                            c += g - 1;
                            var h = d.slice(b, c);
                            h.push("");
                            this.applyDelta({
                                start: this.pos(e + b, f),
                                end: this.pos(e + c, (f = 0)),
                                action: a.action,
                                lines: h
                            }, true);
                        }
                        a.lines = d.slice(b);
                        a.start.row = e + b;
                        a.start.column = f;
                        this.applyDelta(a, true);
                    };
                    this.revertDelta = function(a) {
                        this.$safeApplyDelta({
                            start: this.clonePos(a.start),
                            end: this.clonePos(a.end),
                            action: a.action == "insert" ? "remove" : "insert",
                            lines: a.lines.slice()
                        });
                    };
                    this.indexToPosition = function(b, f) {
                        var c = this.$lines || this.getAllLines();
                        var d = this.getNewLineCharacter().length;
                        for(var a = f || 0, e = c.length; a < e; a++){
                            b -= c[a].length + d;
                            if (b < 0) return {
                                row: a,
                                column: b + c[a].length + d
                            };
                        }
                        return {
                            row: e - 1,
                            column: b + c[e - 1].length + d
                        };
                    };
                    this.positionToIndex = function(b, e) {
                        var c = this.$lines || this.getAllLines();
                        var f = this.getNewLineCharacter().length;
                        var d = 0;
                        var g = Math.min(b.row, c.length);
                        for(var a = e || 0; a < g; ++a)d += c[a].length + f;
                        return d + b.column;
                    };
                }.call(b.prototype));
                c.Document = b;
            });
            ace.define("ace/background_tokenizer", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter", 
            ], function(a, c, d) {
                "use strict";
                var e = a("./lib/oop");
                var f = a("./lib/event_emitter").EventEmitter;
                var b = function(a, b) {
                    this.running = false;
                    this.lines = [];
                    this.states = [];
                    this.currentLine = 0;
                    this.tokenizer = a;
                    var c = this;
                    this.$worker = function() {
                        if (!c.running) {
                            return;
                        }
                        var f = new Date();
                        var a = c.currentLine;
                        var b = -1;
                        var g = c.doc;
                        var d = a;
                        while(c.lines[a])a++;
                        var h = g.getLength();
                        var e = 0;
                        c.running = false;
                        while(a < h){
                            c.$tokenizeRow(a);
                            b = a;
                            do {
                                a++;
                            }while (c.lines[a])
                            e++;
                            if (e % 5 === 0 && new Date() - f > 20) {
                                c.running = setTimeout(c.$worker, 20);
                                break;
                            }
                        }
                        c.currentLine = a;
                        if (b == -1) b = a;
                        if (d <= b) c.fireUpdateEvent(d, b);
                    };
                };
                (function() {
                    e.implement(this, f);
                    this.setTokenizer = function(a) {
                        this.tokenizer = a;
                        this.lines = [];
                        this.states = [];
                        this.start(0);
                    };
                    this.setDocument = function(a) {
                        this.doc = a;
                        this.lines = [];
                        this.states = [];
                        this.stop();
                    };
                    this.fireUpdateEvent = function(a, b) {
                        var c = {
                            first: a,
                            last: b
                        };
                        this._signal("update", {
                            data: c
                        });
                    };
                    this.start = function(a) {
                        this.currentLine = Math.min(a || 0, this.currentLine, this.doc.getLength());
                        this.lines.splice(this.currentLine, this.lines.length);
                        this.states.splice(this.currentLine, this.states.length);
                        this.stop();
                        this.running = setTimeout(this.$worker, 700);
                    };
                    this.scheduleStart = function() {
                        if (!this.running) this.running = setTimeout(this.$worker, 700);
                    };
                    this.$updateOnChange = function(c) {
                        var a = c.start.row;
                        var b = c.end.row - a;
                        if (b === 0) {
                            this.lines[a] = null;
                        } else if (c.action == "remove") {
                            this.lines.splice(a, b + 1, null);
                            this.states.splice(a, b + 1, null);
                        } else {
                            var d = Array(b + 1);
                            d.unshift(a, 1);
                            this.lines.splice.apply(this.lines, d);
                            this.states.splice.apply(this.states, d);
                        }
                        this.currentLine = Math.min(a, this.currentLine, this.doc.getLength());
                        this.stop();
                    };
                    this.stop = function() {
                        if (this.running) clearTimeout(this.running);
                        this.running = false;
                    };
                    this.getTokens = function(a) {
                        return this.lines[a] || this.$tokenizeRow(a);
                    };
                    this.getState = function(a) {
                        if (this.currentLine == a) this.$tokenizeRow(a);
                        return this.states[a] || "start";
                    };
                    this.$tokenizeRow = function(a) {
                        var c = this.doc.getLine(a);
                        var d = this.states[a - 1];
                        var b = this.tokenizer.getLineTokens(c, d, a);
                        if (this.states[a] + "" !== b.state + "") {
                            this.states[a] = b.state;
                            this.lines[a + 1] = null;
                            if (this.currentLine > a + 1) this.currentLine = a + 1;
                        } else if (this.currentLine == a) {
                            this.currentLine = a + 1;
                        }
                        return (this.lines[a] = b.tokens);
                    };
                }.call(b.prototype));
                c.BackgroundTokenizer = b;
            });
            ace.define("ace/search_highlight", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range", 
            ], function(a, c, d) {
                "use strict";
                var e = a("./lib/lang");
                var f = a("./lib/oop");
                var g = a("./range").Range;
                var b = function(a, b, c) {
                    this.setRegexp(a);
                    this.clazz = b;
                    this.type = c || "text";
                };
                (function() {
                    this.MAX_RANGES = 500;
                    this.setRegexp = function(a) {
                        if (this.regExp + "" == a + "") return;
                        this.regExp = a;
                        this.cache = [];
                    };
                    this.update = function(h, i, d, c) {
                        if (!this.regExp) return;
                        var j = c.firstRow, k = c.lastRow;
                        for(var b = j; b <= k; b++){
                            var a = this.cache[b];
                            if (a == null) {
                                a = e.getMatchOffsets(d.getLine(b), this.regExp);
                                if (a.length > this.MAX_RANGES) a = a.slice(0, this.MAX_RANGES);
                                a = a.map(function(a) {
                                    return new g(b, a.offset, b, a.offset + a.length);
                                });
                                this.cache[b] = a.length ? a : "";
                            }
                            for(var f = a.length; f--;){
                                i.drawSingleLineMarker(h, a[f].toScreenRange(d), this.clazz, c);
                            }
                        }
                    };
                }.call(b.prototype));
                c.SearchHighlight = b;
            });
            ace.define("ace/edit_session/fold_line", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(b, c, d) {
                "use strict";
                var e = b("../range").Range;
                function a(c, a) {
                    this.foldData = c;
                    if (Array.isArray(a)) {
                        this.folds = a;
                    } else {
                        a = this.folds = [
                            a
                        ];
                    }
                    var b = a[a.length - 1];
                    this.range = new e(a[0].start.row, a[0].start.column, b.end.row, b.end.column);
                    this.start = this.range.start;
                    this.end = this.range.end;
                    this.folds.forEach(function(a) {
                        a.setFoldLine(this);
                    }, this);
                }
                (function() {
                    this.shiftRow = function(a) {
                        this.start.row += a;
                        this.end.row += a;
                        this.folds.forEach(function(b) {
                            b.start.row += a;
                            b.end.row += a;
                        });
                    };
                    this.addFold = function(a) {
                        if (a.sameRow) {
                            if (a.start.row < this.startRow || a.endRow > this.endRow) {
                                throw new Error("Can't add a fold to this FoldLine as it has no connection");
                            }
                            this.folds.push(a);
                            this.folds.sort(function(b, a) {
                                return -b.range.compareEnd(a.start.row, a.start.column);
                            });
                            if (this.range.compareEnd(a.start.row, a.start.column) > 0) {
                                this.end.row = a.end.row;
                                this.end.column = a.end.column;
                            } else if (this.range.compareStart(a.end.row, a.end.column) < 0) {
                                this.start.row = a.start.row;
                                this.start.column = a.start.column;
                            }
                        } else if (a.start.row == this.end.row) {
                            this.folds.push(a);
                            this.end.row = a.end.row;
                            this.end.column = a.end.column;
                        } else if (a.end.row == this.start.row) {
                            this.folds.unshift(a);
                            this.start.row = a.start.row;
                            this.start.column = a.start.column;
                        } else {
                            throw new Error("Trying to add fold to FoldRow that doesn't have a matching row");
                        }
                        a.foldLine = this;
                    };
                    this.containsRow = function(a) {
                        return a >= this.start.row && a <= this.end.row;
                    };
                    this.walk = function(d, b, e) {
                        var c = 0, j = this.folds, a, h, f, g = true;
                        if (b == null) {
                            b = this.end.row;
                            e = this.end.column;
                        }
                        for(var i = 0; i < j.length; i++){
                            a = j[i];
                            h = a.range.compareStart(b, e);
                            if (h == -1) {
                                d(null, b, e, c, g);
                                return;
                            }
                            f = d(null, a.start.row, a.start.column, c, g);
                            f = !f && d(a.placeholder, a.start.row, a.start.column, c);
                            if (f || h === 0) {
                                return;
                            }
                            g = !a.sameRow;
                            c = a.end.column;
                        }
                        d(null, b, e, c, g);
                    };
                    this.getNextFoldTo = function(d, e) {
                        var a, b;
                        for(var c = 0; c < this.folds.length; c++){
                            a = this.folds[c];
                            b = a.range.compareEnd(d, e);
                            if (b == -1) {
                                return {
                                    fold: a,
                                    kind: "after"
                                };
                            } else if (b === 0) {
                                return {
                                    fold: a,
                                    kind: "inside"
                                };
                            }
                        }
                        return null;
                    };
                    this.addRemoveChars = function(c, f, d) {
                        var g = this.getNextFoldTo(c, f), a, e;
                        if (g) {
                            a = g.fold;
                            if (g.kind == "inside" && a.start.column != f && a.start.row != c) {
                                window.console && window.console.log(c, f, a);
                            } else if (a.start.row == c) {
                                e = this.folds;
                                var b = e.indexOf(a);
                                if (b === 0) {
                                    this.start.column += d;
                                }
                                for(b; b < e.length; b++){
                                    a = e[b];
                                    a.start.column += d;
                                    if (!a.sameRow) {
                                        return;
                                    }
                                    a.end.column += d;
                                }
                                this.end.column += d;
                            }
                        }
                    };
                    this.split = function(h, i) {
                        var c = this.getNextFoldTo(h, i);
                        if (!c || c.kind == "inside") return null;
                        var j = c.fold;
                        var b = this.folds;
                        var d = this.foldData;
                        var e = b.indexOf(j);
                        var f = b[e - 1];
                        this.end.row = f.end.row;
                        this.end.column = f.end.column;
                        b = b.splice(e, b.length - e);
                        var g = new a(d, b);
                        d.splice(d.indexOf(this) + 1, 0, g);
                        return g;
                    };
                    this.merge = function(b) {
                        var c = b.folds;
                        for(var a = 0; a < c.length; a++){
                            this.addFold(c[a]);
                        }
                        var d = this.foldData;
                        d.splice(d.indexOf(b), 1);
                    };
                    this.toString = function() {
                        var a = [
                            this.range.toString() + ": ["
                        ];
                        this.folds.forEach(function(b) {
                            a.push("  " + b.toString());
                        });
                        a.push("]");
                        return a.join("\n");
                    };
                    this.idxToPosition = function(a) {
                        var d = 0;
                        for(var c = 0; c < this.folds.length; c++){
                            var b = this.folds[c];
                            a -= b.start.column - d;
                            if (a < 0) {
                                return {
                                    row: b.start.row,
                                    column: b.start.column + a
                                };
                            }
                            a -= b.placeholder.length;
                            if (a < 0) {
                                return b.start;
                            }
                            d = b.end.column;
                        }
                        return {
                            row: this.end.row,
                            column: this.end.column + a
                        };
                    };
                }.call(a.prototype));
                c.FoldLine = a;
            });
            ace.define("ace/range_list", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(b, c, e) {
                "use strict";
                var d = b("./range").Range;
                var f = d.comparePoints;
                var a = function() {
                    this.ranges = [];
                    this.$bias = 1;
                };
                (function() {
                    this.comparePoints = f;
                    this.pointIndex = function(c, d, i) {
                        var e = this.ranges;
                        for(var a = i || 0; a < e.length; a++){
                            var g = e[a];
                            var h = f(c, g.end);
                            if (h > 0) continue;
                            var b = f(c, g.start);
                            if (h === 0) return d && b !== 0 ? -a - 2 : a;
                            if (b > 0 || (b === 0 && !d)) return a;
                            return -a - 1;
                        }
                        return -a - 1;
                    };
                    this.add = function(c) {
                        var d = !c.isEmpty();
                        var a = this.pointIndex(c.start, d);
                        if (a < 0) a = -a - 1;
                        var b = this.pointIndex(c.end, d, a);
                        if (b < 0) b = -b - 1;
                        else b++;
                        return this.ranges.splice(a, b - a, c);
                    };
                    this.addList = function(b) {
                        var a = [];
                        for(var c = b.length; c--;){
                            a.push.apply(a, this.add(b[c]));
                        }
                        return a;
                    };
                    this.substractPoint = function(b) {
                        var a = this.pointIndex(b);
                        if (a >= 0) return this.ranges.splice(a, 1);
                    };
                    this.merge = function() {
                        var e = [];
                        var b = this.ranges;
                        b = b.sort(function(a, b) {
                            return f(a.start, b.start);
                        });
                        var a = b[0], c;
                        for(var d = 1; d < b.length; d++){
                            c = a;
                            a = b[d];
                            var g = f(c.end, a.start);
                            if (g < 0) continue;
                            if (g == 0 && !c.isEmpty() && !a.isEmpty()) continue;
                            if (f(c.end, a.end) < 0) {
                                c.end.row = a.end.row;
                                c.end.column = a.end.column;
                            }
                            b.splice(d, 1);
                            e.push(a);
                            a = c;
                            d--;
                        }
                        this.ranges = b;
                        return e;
                    };
                    this.contains = function(a, b) {
                        return (this.pointIndex({
                            row: a,
                            column: b
                        }) >= 0);
                    };
                    this.containsPoint = function(a) {
                        return this.pointIndex(a) >= 0;
                    };
                    this.rangeAtPoint = function(b) {
                        var a = this.pointIndex(b);
                        if (a >= 0) return this.ranges[a];
                    };
                    this.clipRows = function(e, f) {
                        var b = this.ranges;
                        if (b[0].start.row > f || b[b.length - 1].start.row < e) return [];
                        var a = this.pointIndex({
                            row: e,
                            column: 0
                        });
                        if (a < 0) a = -a - 1;
                        var c = this.pointIndex({
                            row: f,
                            column: 0
                        }, a);
                        if (c < 0) c = -c - 1;
                        var g = [];
                        for(var d = a; d < c; d++){
                            g.push(b[d]);
                        }
                        return g;
                    };
                    this.removeAll = function() {
                        return this.ranges.splice(0, this.ranges.length);
                    };
                    this.attach = function(a) {
                        if (this.session) this.detach();
                        this.session = a;
                        this.onChange = this.$onChange.bind(this);
                        this.session.on("change", this.onChange);
                    };
                    this.detach = function() {
                        if (!this.session) return;
                        this.session.removeListener("change", this.onChange);
                        this.session = null;
                    };
                    this.$onChange = function(k) {
                        var b = k.start;
                        var j = k.end;
                        var d = b.row;
                        var f = j.row;
                        var h = this.ranges;
                        for(var c = 0, i = h.length; c < i; c++){
                            var a = h[c];
                            if (a.end.row >= d) break;
                        }
                        if (k.action == "insert") {
                            var e = f - d;
                            var g = -b.column + j.column;
                            for(; c < i; c++){
                                var a = h[c];
                                if (a.start.row > d) break;
                                if (a.start.row == d && a.start.column >= b.column) {
                                    if (a.start.column == b.column && this.$bias <= 0) {} else {
                                        a.start.column += g;
                                        a.start.row += e;
                                    }
                                }
                                if (a.end.row == d && a.end.column >= b.column) {
                                    if (a.end.column == b.column && this.$bias < 0) {
                                        continue;
                                    }
                                    if (a.end.column == b.column && g > 0 && c < i - 1) {
                                        if (a.end.column > a.start.column && a.end.column == h[c + 1].start.column) a.end.column -= g;
                                    }
                                    a.end.column += g;
                                    a.end.row += e;
                                }
                            }
                        } else {
                            var e = d - f;
                            var g = b.column - j.column;
                            for(; c < i; c++){
                                var a = h[c];
                                if (a.start.row > f) break;
                                if (a.end.row < f && (d < a.end.row || (d == a.end.row && b.column < a.end.column))) {
                                    a.end.row = d;
                                    a.end.column = b.column;
                                } else if (a.end.row == f) {
                                    if (a.end.column <= j.column) {
                                        if (e || a.end.column > b.column) {
                                            a.end.column = b.column;
                                            a.end.row = b.row;
                                        }
                                    } else {
                                        a.end.column += g;
                                        a.end.row += e;
                                    }
                                } else if (a.end.row > f) {
                                    a.end.row += e;
                                }
                                if (a.start.row < f && (d < a.start.row || (d == a.start.row && b.column < a.start.column))) {
                                    a.start.row = d;
                                    a.start.column = b.column;
                                } else if (a.start.row == f) {
                                    if (a.start.column <= j.column) {
                                        if (e || a.start.column > b.column) {
                                            a.start.column = b.column;
                                            a.start.row = b.row;
                                        }
                                    } else {
                                        a.start.column += g;
                                        a.start.row += e;
                                    }
                                } else if (a.start.row > f) {
                                    a.start.row += e;
                                }
                            }
                        }
                        if (e != 0 && c < i) {
                            for(; c < i; c++){
                                var a = h[c];
                                a.start.row += e;
                                a.end.row += e;
                            }
                        }
                    };
                }.call(a.prototype));
                c.RangeList = a;
            });
            ace.define("ace/edit_session/fold", [
                "require",
                "exports",
                "module",
                "ace/range_list",
                "ace/lib/oop", 
            ], function(a, c, f) {
                "use strict";
                var d = a("../range_list").RangeList;
                var e = a("../lib/oop");
                var b = (c.Fold = function(a, b) {
                    this.foldLine = null;
                    this.placeholder = b;
                    this.range = a;
                    this.start = a.start;
                    this.end = a.end;
                    this.sameRow = a.start.row == a.end.row;
                    this.subFolds = this.ranges = [];
                });
                e.inherits(b, d);
                (function() {
                    this.toString = function() {
                        return ('"' + this.placeholder + '" ' + this.range.toString());
                    };
                    this.setFoldLine = function(a) {
                        this.foldLine = a;
                        this.subFolds.forEach(function(b) {
                            b.setFoldLine(a);
                        });
                    };
                    this.clone = function() {
                        var c = this.range.clone();
                        var a = new b(c, this.placeholder);
                        this.subFolds.forEach(function(b) {
                            a.subFolds.push(b.clone());
                        });
                        a.collapseChildren = this.collapseChildren;
                        return a;
                    };
                    this.addSubFold = function(a) {
                        if (this.range.isEqual(a)) return;
                        h(a, this.start);
                        var e = a.start.row, f = a.start.column;
                        for(var c = 0, b = -1; c < this.subFolds.length; c++){
                            b = this.subFolds[c].range.compare(e, f);
                            if (b != 1) break;
                        }
                        var j = this.subFolds[c];
                        var k = 0;
                        if (b == 0) {
                            if (j.range.containsRange(a)) return j.addSubFold(a);
                            else k = 1;
                        }
                        var e = a.range.end.row, f = a.range.end.column;
                        for(var d = c, b = -1; d < this.subFolds.length; d++){
                            b = this.subFolds[d].range.compare(e, f);
                            if (b != 1) break;
                        }
                        if (b == 0) d++;
                        var g = this.subFolds.splice(c, d - c, a);
                        var l = b == 0 ? g.length - 1 : g.length;
                        for(var i = k; i < l; i++){
                            a.addSubFold(g[i]);
                        }
                        a.setFoldLine(this.foldLine);
                        return a;
                    };
                    this.restoreRange = function(a) {
                        return j(a, this.start);
                    };
                }.call(b.prototype));
                function g(a, b) {
                    a.row -= b.row;
                    if (a.row == 0) a.column -= b.column;
                }
                function h(a, b) {
                    g(a.start, b);
                    g(a.end, b);
                }
                function i(a, b) {
                    if (a.row == 0) a.column += b.column;
                    a.row += b.row;
                }
                function j(a, b) {
                    i(a.start, b);
                    i(a.end, b);
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
            ], function(a, b, d) {
                "use strict";
                var e = a("../range").Range;
                var f = a("./fold_line").FoldLine;
                var g = a("./fold").Fold;
                var h = a("../token_iterator").TokenIterator;
                function c() {
                    this.getFoldAt = function(b, d, f) {
                        var g = this.getFoldLine(b);
                        if (!g) return null;
                        var e = g.folds;
                        for(var c = 0; c < e.length; c++){
                            var a = e[c].range;
                            if (a.contains(b, d)) {
                                if (f == 1 && a.isEnd(b, d) && !a.isEmpty()) {
                                    continue;
                                } else if (f == -1 && a.isStart(b, d) && !a.isEmpty()) {
                                    continue;
                                }
                                return e[c];
                            }
                        }
                    };
                    this.getFoldsInRange = function(b) {
                        var f = b.start;
                        var g = b.end;
                        var d = this.$foldData;
                        var h = [];
                        f.column += 1;
                        g.column -= 1;
                        for(var c = 0; c < d.length; c++){
                            var a = d[c].range.compareRange(b);
                            if (a == 2) {
                                continue;
                            } else if (a == -2) {
                                break;
                            }
                            var i = d[c].folds;
                            for(var e = 0; e < i.length; e++){
                                var j = i[e];
                                a = j.range.compareRange(b);
                                if (a == -2) {
                                    break;
                                } else if (a == 2) {
                                    continue;
                                } else if (a == 42) {
                                    break;
                                }
                                h.push(j);
                            }
                        }
                        f.column -= 1;
                        g.column += 1;
                        return h;
                    };
                    this.getFoldsInRangeList = function(a) {
                        if (Array.isArray(a)) {
                            var b = [];
                            a.forEach(function(a) {
                                b = b.concat(this.getFoldsInRange(a));
                            }, this);
                        } else {
                            var b = this.getFoldsInRange(a);
                        }
                        return b;
                    };
                    this.getAllFolds = function() {
                        var d = [];
                        var b = this.$foldData;
                        for(var a = 0; a < b.length; a++)for(var c = 0; c < b[a].folds.length; c++)d.push(b[a].folds[c]);
                        return d;
                    };
                    this.getFoldStringAt = function(g, e, h, c) {
                        c = c || this.getFoldLine(g);
                        if (!c) return null;
                        var d = {
                            end: {
                                column: 0
                            }
                        };
                        var a, b;
                        for(var f = 0; f < c.folds.length; f++){
                            b = c.folds[f];
                            var i = b.range.compareEnd(g, e);
                            if (i == -1) {
                                a = this.getLine(b.start.row).substring(d.end.column, b.start.column);
                                break;
                            } else if (i === 0) {
                                return null;
                            }
                            d = b;
                        }
                        if (!a) a = this.getLine(b.start.row).substring(d.end.column);
                        if (h == -1) return a.substring(0, e - d.end.column);
                        else if (h == 1) return a.substring(e - d.end.column);
                        else return a;
                    };
                    this.getFoldLine = function(c, e) {
                        var d = this.$foldData;
                        var a = 0;
                        if (e) a = d.indexOf(e);
                        if (a == -1) a = 0;
                        for(a; a < d.length; a++){
                            var b = d[a];
                            if (b.start.row <= c && b.end.row >= c) {
                                return b;
                            } else if (b.end.row > c) {
                                return null;
                            }
                        }
                        return null;
                    };
                    this.getNextFoldLine = function(e, c) {
                        var b = this.$foldData;
                        var a = 0;
                        if (c) a = b.indexOf(c);
                        if (a == -1) a = 0;
                        for(a; a < b.length; a++){
                            var d = b[a];
                            if (d.end.row >= e) {
                                return d;
                            }
                        }
                        return null;
                    };
                    this.getFoldedRowCount = function(a, d) {
                        var g = this.$foldData, b = d - a + 1;
                        for(var f = 0; f < g.length; f++){
                            var h = g[f], e = h.end.row, c = h.start.row;
                            if (e >= d) {
                                if (c < d) {
                                    if (c >= a) b -= d - c;
                                    else b = 0;
                                }
                                break;
                            } else if (e >= a) {
                                if (c >= a) b -= e - c;
                                else b -= e - a + 1;
                            }
                        }
                        return b;
                    };
                    this.$addFoldLine = function(a) {
                        this.$foldData.push(a);
                        this.$foldData.sort(function(a, b) {
                            return a.start.row - b.start.row;
                        });
                        return a;
                    };
                    this.addFold = function(i, o) {
                        var j = this.$foldData;
                        var k = false;
                        var a;
                        if (i instanceof g) a = i;
                        else {
                            a = new g(o, i);
                            a.collapseChildren = o.collapseChildren;
                        }
                        this.$clipRangeToDocument(a.range);
                        var l = a.start.row;
                        var p = a.start.column;
                        var d = a.end.row;
                        var q = a.end.column;
                        var c = this.getFoldAt(l, p, 1);
                        var e = this.getFoldAt(d, q, -1);
                        if (c && e == c) return c.addSubFold(a);
                        if (c && !c.range.isStart(l, p)) this.removeFold(c);
                        if (e && !e.range.isEnd(d, q)) this.removeFold(e);
                        var m = this.getFoldsInRange(a.range);
                        if (m.length > 0) {
                            this.removeFolds(m);
                            if (!a.collapseChildren) {
                                m.forEach(function(b) {
                                    a.addSubFold(b);
                                });
                            }
                        }
                        for(var h = 0; h < j.length; h++){
                            var b = j[h];
                            if (d == b.start.row) {
                                b.addFold(a);
                                k = true;
                                break;
                            } else if (l == b.end.row) {
                                b.addFold(a);
                                k = true;
                                if (!a.sameRow) {
                                    var n = j[h + 1];
                                    if (n && n.start.row == d) {
                                        b.merge(n);
                                        break;
                                    }
                                }
                                break;
                            } else if (d <= b.start.row) {
                                break;
                            }
                        }
                        if (!k) b = this.$addFoldLine(new f(this.$foldData, a));
                        if (this.$useWrapMode) this.$updateWrapData(b.start.row, b.start.row);
                        else this.$updateRowLengthCache(b.start.row, b.start.row);
                        this.$modified = true;
                        this._signal("changeFold", {
                            data: a,
                            action: "add"
                        });
                        return a;
                    };
                    this.addFolds = function(a) {
                        a.forEach(function(a) {
                            this.addFold(a);
                        }, this);
                    };
                    this.removeFold = function(c) {
                        var b = c.foldLine;
                        var e = b.start.row;
                        var f = b.end.row;
                        var g = this.$foldData;
                        var a = b.folds;
                        if (a.length == 1) {
                            g.splice(g.indexOf(b), 1);
                        } else if (b.range.isEnd(c.end.row, c.end.column)) {
                            a.pop();
                            b.end.row = a[a.length - 1].end.row;
                            b.end.column = a[a.length - 1].end.column;
                        } else if (b.range.isStart(c.start.row, c.start.column)) {
                            a.shift();
                            b.start.row = a[0].start.row;
                            b.start.column = a[0].start.column;
                        } else if (c.sameRow) {
                            a.splice(a.indexOf(c), 1);
                        } else {
                            var d = b.split(c.start.row, c.start.column);
                            a = d.folds;
                            a.shift();
                            d.start.row = a[0].start.row;
                            d.start.column = a[0].start.column;
                        }
                        if (!this.$updating) {
                            if (this.$useWrapMode) this.$updateWrapData(e, f);
                            else this.$updateRowLengthCache(e, f);
                        }
                        this.$modified = true;
                        this._signal("changeFold", {
                            data: c,
                            action: "remove"
                        });
                    };
                    this.removeFolds = function(b) {
                        var c = [];
                        for(var a = 0; a < b.length; a++){
                            c.push(b[a]);
                        }
                        c.forEach(function(a) {
                            this.removeFold(a);
                        }, this);
                        this.$modified = true;
                    };
                    this.expandFold = function(a) {
                        this.removeFold(a);
                        a.subFolds.forEach(function(b) {
                            a.restoreRange(b);
                            this.addFold(b);
                        }, this);
                        if (a.collapseChildren > 0) {
                            this.foldAll(a.start.row + 1, a.end.row, a.collapseChildren - 1);
                        }
                        a.subFolds = [];
                    };
                    this.expandFolds = function(a) {
                        a.forEach(function(a) {
                            this.expandFold(a);
                        }, this);
                    };
                    this.unfold = function(a, d) {
                        var c, b;
                        if (a == null) {
                            c = new e(0, 0, this.getLength(), 0);
                            if (d == null) d = true;
                        } else if (typeof a == "number") {
                            c = new e(a, 0, a, this.getLine(a).length);
                        } else if ("row" in a) {
                            c = e.fromPoints(a, a);
                        } else if (Array.isArray(a)) {
                            b = [];
                            a.forEach(function(a) {
                                b = b.concat(this.unfold(a));
                            }, this);
                            return b;
                        } else {
                            c = a;
                        }
                        b = this.getFoldsInRangeList(c);
                        var f = b;
                        while(b.length == 1 && e.comparePoints(b[0].start, c.start) < 0 && e.comparePoints(b[0].end, c.end) > 0){
                            this.expandFolds(b);
                            b = this.getFoldsInRangeList(c);
                        }
                        if (d != false) {
                            this.removeFolds(b);
                        } else {
                            this.expandFolds(b);
                        }
                        if (f.length) return f;
                    };
                    this.isRowFolded = function(a, b) {
                        return !!this.getFoldLine(a, b);
                    };
                    this.getRowFoldEnd = function(a, c) {
                        var b = this.getFoldLine(a, c);
                        return b ? b.end.row : a;
                    };
                    this.getRowFoldStart = function(a, c) {
                        var b = this.getFoldLine(a, c);
                        return b ? b.start.row : a;
                    };
                    this.getFoldDisplayLine = function(b, a, c, d, e) {
                        if (d == null) d = b.start.row;
                        if (e == null) e = 0;
                        if (a == null) a = b.end.row;
                        if (c == null) c = this.getLine(a).length;
                        var g = this.doc;
                        var f = "";
                        b.walk(function(c, a, h, b) {
                            if (a < d) return;
                            if (a == d) {
                                if (h < e) return;
                                b = Math.max(e, b);
                            }
                            if (c != null) {
                                f += c;
                            } else {
                                f += g.getLine(a).substring(b, h);
                            }
                        }, a, c);
                        return f;
                    };
                    this.getDisplayLine = function(a, c, f, d) {
                        var e = this.getFoldLine(a);
                        if (!e) {
                            var b;
                            b = this.doc.getLine(a);
                            return b.substring(d || 0, c || b.length);
                        } else {
                            return this.getFoldDisplayLine(e, a, c, f, d);
                        }
                    };
                    this.$cloneFoldData = function() {
                        var a = [];
                        a = this.$foldData.map(function(b) {
                            var c = b.folds.map(function(a) {
                                return a.clone();
                            });
                            return new f(a, c);
                        });
                        return a;
                    };
                    this.toggleFold = function(g) {
                        var h = this.selection;
                        var a = h.getRange();
                        var b;
                        var c;
                        if (a.isEmpty()) {
                            var d = a.start;
                            b = this.getFoldAt(d.row, d.column);
                            if (b) {
                                this.expandFold(b);
                                return;
                            } else if ((c = this.findMatchingBracket(d))) {
                                if (a.comparePoint(c) == 1) {
                                    a.end = c;
                                } else {
                                    a.start = c;
                                    a.start.column++;
                                    a.end.column--;
                                }
                            } else if ((c = this.findMatchingBracket({
                                row: d.row,
                                column: d.column + 1
                            }))) {
                                if (a.comparePoint(c) == 1) a.end = c;
                                else a.start = c;
                                a.start.column++;
                            } else {
                                a = this.getCommentFoldRange(d.row, d.column) || a;
                            }
                        } else {
                            var f = this.getFoldsInRange(a);
                            if (g && f.length) {
                                this.expandFolds(f);
                                return;
                            } else if (f.length == 1) {
                                b = f[0];
                            }
                        }
                        if (!b) b = this.getFoldAt(a.start.row, a.start.column);
                        if (b && b.range.toString() == a.toString()) {
                            this.expandFold(b);
                            return;
                        }
                        var e = "...";
                        if (!a.isMultiLine()) {
                            e = this.getTextRange(a);
                            if (e.length < 4) return;
                            e = e.trim().substring(0, 2) + "..";
                        }
                        this.addFold(e, a);
                    };
                    this.getCommentFoldRange = function(i, j, k) {
                        var a = new h(this, i, j);
                        var b = a.getCurrentToken();
                        var c = b && b.type;
                        if (b && /^comment|string/.test(c)) {
                            c = c.match(/comment|string/)[0];
                            if (c == "comment") c += "|doc-start";
                            var f = new RegExp(c);
                            var d = new e();
                            if (k != 1) {
                                do {
                                    b = a.stepBackward();
                                }while (b && f.test(b.type))
                                a.stepForward();
                            }
                            d.start.row = a.getCurrentTokenRow();
                            d.start.column = a.getCurrentTokenColumn() + 2;
                            a = new h(this, i, j);
                            if (k != -1) {
                                var g = -1;
                                do {
                                    b = a.stepForward();
                                    if (g == -1) {
                                        var l = this.getState(a.$row);
                                        if (!f.test(l)) g = a.$row;
                                    } else if (a.$row > g) {
                                        break;
                                    }
                                }while (b && f.test(b.type))
                                b = a.stepBackward();
                            } else b = a.getCurrentToken();
                            d.end.row = a.getCurrentTokenRow();
                            d.end.column = a.getCurrentTokenColumn() + b.value.length - 2;
                            return d;
                        }
                    };
                    this.foldAll = function(c, d, f, g) {
                        if (f == undefined) f = 100000;
                        var e = this.foldWidgets;
                        if (!e) return;
                        d = d || this.getLength();
                        c = c || 0;
                        for(var a = c; a < d; a++){
                            if (e[a] == null) e[a] = this.getFoldWidget(a);
                            if (e[a] != "start") continue;
                            if (g && !g(a)) continue;
                            var b = this.getFoldWidgetRange(a);
                            if (b && b.isMultiLine() && b.end.row <= d && b.start.row >= c) {
                                a = b.end.row;
                                b.collapseChildren = f;
                                this.addFold("...", b);
                            }
                        }
                    };
                    this.foldToLevel = function(a) {
                        this.foldAll();
                        while(a-- > 0)this.unfold(null, false);
                    };
                    this.foldAllComments = function() {
                        var a = this;
                        this.foldAll(null, null, null, function(e) {
                            var d = a.getTokens(e);
                            for(var b = 0; b < d.length; b++){
                                var c = d[b];
                                if (c.type == "text" && /^\s+$/.test(c.value)) continue;
                                if (/comment/.test(c.type)) return true;
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
                    this.setFoldStyle = function(a) {
                        if (!this.$foldStyles[a]) throw new Error("invalid fold style: " + a + "[" + Object.keys(this.$foldStyles).join(", ") + "]");
                        if (this.$foldStyle == a) return;
                        this.$foldStyle = a;
                        if (a == "manual") this.unfold();
                        var b = this.$foldMode;
                        this.$setFolding(null);
                        this.$setFolding(b);
                    };
                    this.$setFolding = function(a) {
                        if (this.$foldMode == a) return;
                        this.$foldMode = a;
                        this.off("change", this.$updateFoldWidgets);
                        this.off("tokenizerUpdate", this.$tokenizerUpdateFoldWidgets);
                        this._signal("changeAnnotation");
                        if (!a || this.$foldStyle == "manual") {
                            this.foldWidgets = null;
                            return;
                        }
                        this.foldWidgets = [];
                        this.getFoldWidget = a.getFoldWidget.bind(a, this, this.$foldStyle);
                        this.getFoldWidgetRange = a.getFoldWidgetRange.bind(a, this, this.$foldStyle);
                        this.$updateFoldWidgets = this.updateFoldWidgets.bind(this);
                        this.$tokenizerUpdateFoldWidgets = this.tokenizerUpdateFoldWidgets.bind(this);
                        this.on("change", this.$updateFoldWidgets);
                        this.on("tokenizerUpdate", this.$tokenizerUpdateFoldWidgets);
                    };
                    this.getParentFoldRangeData = function(d, g) {
                        var b = this.foldWidgets;
                        if (!b || (g && b[d])) return {};
                        var a = d - 1, e;
                        while(a >= 0){
                            var f = b[a];
                            if (f == null) f = b[a] = this.getFoldWidget(a);
                            if (f == "start") {
                                var c = this.getFoldWidgetRange(a);
                                if (!e) e = c;
                                if (c && c.end.row >= d) break;
                            }
                            a--;
                        }
                        return {
                            range: a !== -1 && c,
                            firstRange: e
                        };
                    };
                    this.onFoldWidgetClick = function(c, a) {
                        a = a.domEvent;
                        var d = {
                            children: a.shiftKey,
                            all: a.ctrlKey || a.metaKey,
                            siblings: a.altKey
                        };
                        var e = this.$toggleFoldWidget(c, d);
                        if (!e) {
                            var b = a.target || a.srcElement;
                            if (b && /ace_fold-widget/.test(b.className)) b.className += " ace_invalid";
                        }
                    };
                    this.$toggleFoldWidget = function(d, c) {
                        if (!this.getFoldWidget) return;
                        var h = this.getFoldWidget(d);
                        var i = this.getLine(d);
                        var g = h === "end" ? -1 : 1;
                        var b = this.getFoldAt(d, g === -1 ? 0 : i.length, g);
                        if (b) {
                            if (c.children || c.all) this.removeFold(b);
                            else this.expandFold(b);
                            return b;
                        }
                        var a = this.getFoldWidgetRange(d, true);
                        if (a && !a.isMultiLine()) {
                            b = this.getFoldAt(a.start.row, a.start.column, 1);
                            if (b && a.isEqual(b.range)) {
                                this.removeFold(b);
                                return b;
                            }
                        }
                        if (c.siblings) {
                            var e = this.getParentFoldRangeData(d);
                            if (e.range) {
                                var j = e.range.start.row + 1;
                                var f = e.range.end.row;
                            }
                            this.foldAll(j, f, c.all ? 10000 : 0);
                        } else if (c.children) {
                            f = a ? a.end.row : this.getLength();
                            this.foldAll(d + 1, f, c.all ? 10000 : 0);
                        } else if (a) {
                            if (c.all) a.collapseChildren = 10000;
                            this.addFold("...", a);
                        }
                        return a;
                    };
                    this.toggleFoldWidget = function(e) {
                        var a = this.selection.getCursor().row;
                        a = this.getRowFoldStart(a);
                        var b = this.$toggleFoldWidget(a, {});
                        if (b) return;
                        var c = this.getParentFoldRangeData(a, true);
                        b = c.range || c.firstRange;
                        if (b) {
                            a = b.start.row;
                            var d = this.getFoldAt(a, this.getLine(a).length, 1);
                            if (d) {
                                this.removeFold(d);
                            } else {
                                this.addFold("...", b);
                            }
                        }
                    };
                    this.updateFoldWidgets = function(b) {
                        var a = b.start.row;
                        var c = b.end.row - a;
                        if (c === 0) {
                            this.foldWidgets[a] = null;
                        } else if (b.action == "remove") {
                            this.foldWidgets.splice(a, c + 1, null);
                        } else {
                            var d = Array(c + 1);
                            d.unshift(a, 1);
                            this.foldWidgets.splice.apply(this.foldWidgets, d);
                        }
                    };
                    this.tokenizerUpdateFoldWidgets = function(b) {
                        var a = b.data;
                        if (a.first != a.last) {
                            if (this.foldWidgets.length > a.first) this.foldWidgets.splice(a.first, this.foldWidgets.length);
                        }
                    };
                }
                b.Folding = c;
            });
            ace.define("ace/edit_session/bracket_match", [
                "require",
                "exports",
                "module",
                "ace/token_iterator",
                "ace/range", 
            ], function(a, b, d) {
                "use strict";
                var e = a("../token_iterator").TokenIterator;
                var f = a("../range").Range;
                function c() {
                    this.findMatchingBracket = function(a, d) {
                        if (a.column == 0) return null;
                        var c = d || this.getLine(a.row).charAt(a.column - 1);
                        if (c == "") return null;
                        var b = c.match(/([\(\[\{])|([\)\]\}])/);
                        if (!b) return null;
                        if (b[1]) return this.$findClosingBracket(b[1], a);
                        else return this.$findOpeningBracket(b[2], a);
                    };
                    this.getBracketRange = function(b) {
                        var h = this.getLine(b.row);
                        var g = true, a;
                        var d = h.charAt(b.column - 1);
                        var c = d && d.match(/([\(\[\{])|([\)\]\}])/);
                        if (!c) {
                            d = h.charAt(b.column);
                            b = {
                                row: b.row,
                                column: b.column + 1
                            };
                            c = d && d.match(/([\(\[\{])|([\)\]\}])/);
                            g = false;
                        }
                        if (!c) return null;
                        if (c[1]) {
                            var e = this.$findClosingBracket(c[1], b);
                            if (!e) return null;
                            a = f.fromPoints(b, e);
                            if (!g) {
                                a.end.column++;
                                a.start.column--;
                            }
                            a.cursor = a.end;
                        } else {
                            var e = this.$findOpeningBracket(c[2], b);
                            if (!e) return null;
                            a = f.fromPoints(e, b);
                            if (!g) {
                                a.start.column++;
                                a.end.column--;
                            }
                            a.cursor = a.start;
                        }
                        return a;
                    };
                    this.getMatchingBracketRanges = function(a) {
                        var e = this.getLine(a.row);
                        var c = e.charAt(a.column - 1);
                        var b = c && c.match(/([\(\[\{])|([\)\]\}])/);
                        if (!b) {
                            c = e.charAt(a.column);
                            a = {
                                row: a.row,
                                column: a.column + 1
                            };
                            b = c && c.match(/([\(\[\{])|([\)\]\}])/);
                        }
                        if (!b) return null;
                        var g = new f(a.row, a.column - 1, a.row, a.column);
                        var d = b[1] ? this.$findClosingBracket(b[1], a) : this.$findOpeningBracket(b[2], a);
                        if (!d) return [
                            g
                        ];
                        var h = new f(d.row, d.column, d.row, d.column + 1);
                        return [
                            g,
                            h
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
                    this.$findOpeningBracket = function(i, d, f) {
                        var k = this.$brackets[i];
                        var g = 1;
                        var b = new e(this, d.row, d.column);
                        var a = b.getCurrentToken();
                        if (!a) a = b.stepForward();
                        if (!a) return;
                        if (!f) {
                            f = new RegExp("(\\.?" + a.type.replace(".", "\\.").replace("rparen", ".paren").replace(/\b(?:end)\b/, "(?:start|begin|end)") + ")+");
                        }
                        var c = d.column - b.getCurrentTokenColumn() - 2;
                        var h = a.value;
                        while(true){
                            while(c >= 0){
                                var j = h.charAt(c);
                                if (j == k) {
                                    g -= 1;
                                    if (g == 0) {
                                        return {
                                            row: b.getCurrentTokenRow(),
                                            column: c + b.getCurrentTokenColumn()
                                        };
                                    }
                                } else if (j == i) {
                                    g += 1;
                                }
                                c -= 1;
                            }
                            do {
                                a = b.stepBackward();
                            }while (a && !f.test(a.type))
                            if (a == null) break;
                            h = a.value;
                            c = h.length - 1;
                        }
                        return null;
                    };
                    this.$findClosingBracket = function(h, d, f) {
                        var k = this.$brackets[h];
                        var g = 1;
                        var b = new e(this, d.row, d.column);
                        var a = b.getCurrentToken();
                        if (!a) a = b.stepForward();
                        if (!a) return;
                        if (!f) {
                            f = new RegExp("(\\.?" + a.type.replace(".", "\\.").replace("lparen", ".paren").replace(/\b(?:start|begin)\b/, "(?:start|begin|end)") + ")+");
                        }
                        var c = d.column - b.getCurrentTokenColumn();
                        while(true){
                            var i = a.value;
                            var l = i.length;
                            while(c < l){
                                var j = i.charAt(c);
                                if (j == k) {
                                    g -= 1;
                                    if (g == 0) {
                                        return {
                                            row: b.getCurrentTokenRow(),
                                            column: c + b.getCurrentTokenColumn()
                                        };
                                    }
                                } else if (j == h) {
                                    g += 1;
                                }
                                c += 1;
                            }
                            do {
                                a = b.stepForward();
                            }while (a && !f.test(a.type))
                            if (a == null) break;
                            c = 0;
                        }
                        return null;
                    };
                }
                b.BracketMatch = c;
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
            ], function(a, c, e) {
                "use strict";
                var f = a("./lib/oop");
                var g = a("./lib/lang");
                var h = a("./bidihandler").BidiHandler;
                var d = a("./config");
                var i = a("./lib/event_emitter").EventEmitter;
                var j = a("./selection").Selection;
                var k = a("./mode/text").Mode;
                var l = a("./range").Range;
                var m = a("./document").Document;
                var n = a("./background_tokenizer").BackgroundTokenizer;
                var o = a("./search_highlight").SearchHighlight;
                var b = function(a, c) {
                    this.$breakpoints = [];
                    this.$decorations = [];
                    this.$frontMarkers = {};
                    this.$backMarkers = {};
                    this.$markerId = 1;
                    this.$undoSelect = true;
                    this.$foldData = [];
                    this.id = "session" + ++b.$uid;
                    this.$foldData.toString = function() {
                        return this.join("\n");
                    };
                    this.on("changeFold", this.onChangeFold.bind(this));
                    this.$onChange = this.onChange.bind(this);
                    if (typeof a != "object" || !a.getLine) a = new m(a);
                    this.setDocument(a);
                    this.selection = new j(this);
                    this.$bidiHandler = new h(this);
                    d.resetOptions(this);
                    this.setMode(c);
                    d._signal("session", this);
                };
                b.$uid = 0;
                (function() {
                    f.implement(this, i);
                    this.setDocument = function(a) {
                        if (this.doc) this.doc.off("change", this.$onChange);
                        this.doc = a;
                        a.on("change", this.$onChange);
                        if (this.bgTokenizer) this.bgTokenizer.setDocument(this.getDocument());
                        this.resetCaches();
                    };
                    this.getDocument = function() {
                        return this.doc;
                    };
                    this.$resetRowCache = function(c) {
                        if (!c) {
                            this.$docRowCache = [];
                            this.$screenRowCache = [];
                            return;
                        }
                        var a = this.$docRowCache.length;
                        var b = this.$getRowCacheIndex(this.$docRowCache, c) + 1;
                        if (a > b) {
                            this.$docRowCache.splice(b, a);
                            this.$screenRowCache.splice(b, a);
                        }
                    };
                    this.$getRowCacheIndex = function(d, e) {
                        var a = 0;
                        var c = d.length - 1;
                        while(a <= c){
                            var b = (a + c) >> 1;
                            var f = d[b];
                            if (e > f) a = b + 1;
                            else if (e < f) c = b - 1;
                            else return b;
                        }
                        return a - 1;
                    };
                    this.resetCaches = function() {
                        this.$modified = true;
                        this.$wrapData = [];
                        this.$rowLengthCache = [];
                        this.$resetRowCache(0);
                        if (this.bgTokenizer) this.bgTokenizer.start(0);
                    };
                    this.onChangeFold = function(a) {
                        var b = a.data;
                        this.$resetRowCache(b.start.row);
                    };
                    this.onChange = function(a) {
                        this.$modified = true;
                        this.$bidiHandler.onChange(a);
                        this.$resetRowCache(a.start.row);
                        var b = this.$updateInternalDataOnChange(a);
                        if (!this.$fromUndo && this.$undoManager) {
                            if (b && b.length) {
                                this.$undoManager.add({
                                    action: "removeFolds",
                                    folds: b
                                }, this.mergeUndoDeltas);
                                this.mergeUndoDeltas = true;
                            }
                            this.$undoManager.add(a, this.mergeUndoDeltas);
                            this.mergeUndoDeltas = true;
                            this.$informUndoManager.schedule();
                        }
                        this.bgTokenizer && this.bgTokenizer.$updateOnChange(a);
                        this._signal("change", a);
                    };
                    this.setValue = function(a) {
                        this.doc.setValue(a);
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
                    this.getState = function(a) {
                        return this.bgTokenizer.getState(a);
                    };
                    this.getTokens = function(a) {
                        return this.bgTokenizer.getTokens(a);
                    };
                    this.getTokenAt = function(e, f) {
                        var c = this.bgTokenizer.getTokens(e);
                        var a, d = 0;
                        if (f == null) {
                            var b = c.length - 1;
                            d = this.getLine(e).length;
                        } else {
                            for(var b = 0; b < c.length; b++){
                                d += c[b].value.length;
                                if (d >= f) break;
                            }
                        }
                        a = c[b];
                        if (!a) return null;
                        a.index = b;
                        a.start = d - a.value.length;
                        return a;
                    };
                    this.setUndoManager = function(a) {
                        this.$undoManager = a;
                        if (this.$informUndoManager) this.$informUndoManager.cancel();
                        if (a) {
                            var b = this;
                            a.addSession(this);
                            this.$syncInformUndoManager = function() {
                                b.$informUndoManager.cancel();
                                b.mergeUndoDeltas = false;
                            };
                            this.$informUndoManager = g.delayedCall(this.$syncInformUndoManager);
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
                            return g.stringRepeat(" ", this.getTabSize());
                        } else {
                            return "\t";
                        }
                    };
                    this.setUseSoftTabs = function(a) {
                        this.setOption("useSoftTabs", a);
                    };
                    this.getUseSoftTabs = function() {
                        return (this.$useSoftTabs && !this.$mode.$indentWithTabs);
                    };
                    this.setTabSize = function(a) {
                        this.setOption("tabSize", a);
                    };
                    this.getTabSize = function() {
                        return this.$tabSize;
                    };
                    this.isTabStop = function(a) {
                        return (this.$useSoftTabs && a.column % this.$tabSize === 0);
                    };
                    this.setNavigateWithinSoftTabs = function(a) {
                        this.setOption("navigateWithinSoftTabs", a);
                    };
                    this.getNavigateWithinSoftTabs = function() {
                        return this.$navigateWithinSoftTabs;
                    };
                    this.$overwrite = false;
                    this.setOverwrite = function(a) {
                        this.setOption("overwrite", a);
                    };
                    this.getOverwrite = function() {
                        return this.$overwrite;
                    };
                    this.toggleOverwrite = function() {
                        this.setOverwrite(!this.$overwrite);
                    };
                    this.addGutterDecoration = function(a, b) {
                        if (!this.$decorations[a]) this.$decorations[a] = "";
                        this.$decorations[a] += " " + b;
                        this._signal("changeBreakpoint", {});
                    };
                    this.removeGutterDecoration = function(a, b) {
                        this.$decorations[a] = (this.$decorations[a] || "").replace(" " + b, "");
                        this._signal("changeBreakpoint", {});
                    };
                    this.getBreakpoints = function() {
                        return this.$breakpoints;
                    };
                    this.setBreakpoints = function(b) {
                        this.$breakpoints = [];
                        for(var a = 0; a < b.length; a++){
                            this.$breakpoints[b[a]] = "ace_breakpoint";
                        }
                        this._signal("changeBreakpoint", {});
                    };
                    this.clearBreakpoints = function() {
                        this.$breakpoints = [];
                        this._signal("changeBreakpoint", {});
                    };
                    this.setBreakpoint = function(b, a) {
                        if (a === undefined) a = "ace_breakpoint";
                        if (a) this.$breakpoints[b] = a;
                        else delete this.$breakpoints[b];
                        this._signal("changeBreakpoint", {});
                    };
                    this.clearBreakpoint = function(a) {
                        delete this.$breakpoints[a];
                        this._signal("changeBreakpoint", {});
                    };
                    this.addMarker = function(e, f, b, c) {
                        var a = this.$markerId++;
                        var d = {
                            range: e,
                            type: b || "line",
                            renderer: typeof b == "function" ? b : null,
                            clazz: f,
                            inFront: !!c,
                            id: a
                        };
                        if (c) {
                            this.$frontMarkers[a] = d;
                            this._signal("changeFrontMarker");
                        } else {
                            this.$backMarkers[a] = d;
                            this._signal("changeBackMarker");
                        }
                        return a;
                    };
                    this.addDynamicMarker = function(a, c) {
                        if (!a.update) return;
                        var b = this.$markerId++;
                        a.id = b;
                        a.inFront = !!c;
                        if (c) {
                            this.$frontMarkers[b] = a;
                            this._signal("changeFrontMarker");
                        } else {
                            this.$backMarkers[b] = a;
                            this._signal("changeBackMarker");
                        }
                        return a;
                    };
                    this.removeMarker = function(a) {
                        var b = this.$frontMarkers[a] || this.$backMarkers[a];
                        if (!b) return;
                        var c = b.inFront ? this.$frontMarkers : this.$backMarkers;
                        delete c[a];
                        this._signal(b.inFront ? "changeFrontMarker" : "changeBackMarker");
                    };
                    this.getMarkers = function(a) {
                        return a ? this.$frontMarkers : this.$backMarkers;
                    };
                    this.highlight = function(a) {
                        if (!this.$searchHighlight) {
                            var b = new o(null, "ace_selected-word", "text");
                            this.$searchHighlight = this.addDynamicMarker(b);
                        }
                        this.$searchHighlight.setRegexp(a);
                    };
                    this.highlightLines = function(d, a, b, e) {
                        if (typeof a != "number") {
                            b = a;
                            a = d;
                        }
                        if (!b) b = "ace_step";
                        var c = new l(d, 0, a, Infinity);
                        c.id = this.addMarker(c, b, "fullLine", e);
                        return c;
                    };
                    this.setAnnotations = function(a) {
                        this.$annotations = a;
                        this._signal("changeAnnotation", {});
                    };
                    this.getAnnotations = function() {
                        return this.$annotations || [];
                    };
                    this.clearAnnotations = function() {
                        this.setAnnotations([]);
                    };
                    this.$detectNewLine = function(b) {
                        var a = b.match(/^.*?(\r?\n)/m);
                        if (a) {
                            this.$autoNewLine = a[1];
                        } else {
                            this.$autoNewLine = "\n";
                        }
                    };
                    this.getWordRange = function(g, a) {
                        var b = this.getLine(g);
                        var d = false;
                        if (a > 0) d = !!b.charAt(a - 1).match(this.tokenRe);
                        if (!d) d = !!b.charAt(a).match(this.tokenRe);
                        if (d) var e = this.tokenRe;
                        else if (/^\s+$/.test(b.slice(a - 1, a + 1))) var e = /\s/;
                        else var e = this.nonTokenRe;
                        var c = a;
                        if (c > 0) {
                            do {
                                c--;
                            }while (c >= 0 && b.charAt(c).match(e))
                            c++;
                        }
                        var f = a;
                        while(f < b.length && b.charAt(f).match(e)){
                            f++;
                        }
                        return new l(g, c, g, f);
                    };
                    this.getAWordRange = function(b, c) {
                        var a = this.getWordRange(b, c);
                        var d = this.getLine(a.end.row);
                        while(d.charAt(a.end.column).match(/[ \t]/)){
                            a.end.column += 1;
                        }
                        return a;
                    };
                    this.setNewLineMode = function(a) {
                        this.doc.setNewLineMode(a);
                    };
                    this.getNewLineMode = function() {
                        return this.doc.getNewLineMode();
                    };
                    this.setUseWorker = function(a) {
                        this.setOption("useWorker", a);
                    };
                    this.getUseWorker = function() {
                        return this.$useWorker;
                    };
                    this.onReloadTokenizer = function(a) {
                        var b = a.data;
                        this.bgTokenizer.start(b.first);
                        this._signal("tokenizerUpdate", a);
                    };
                    this.$modes = d.$modes;
                    this.$mode = null;
                    this.$modeId = null;
                    this.setMode = function(a, c) {
                        if (a && typeof a === "object") {
                            if (a.getTokenizer) return this.$onChangeMode(a);
                            var e = a;
                            var b = e.path;
                        } else {
                            b = a || "ace/mode/text";
                        }
                        if (!this.$modes["ace/mode/text"]) this.$modes["ace/mode/text"] = new k();
                        if (this.$modes[b] && !e) {
                            this.$onChangeMode(this.$modes[b]);
                            c && c();
                            return;
                        }
                        this.$modeId = b;
                        d.loadModule([
                            "mode",
                            b
                        ], function(a) {
                            if (this.$modeId !== b) return c && c();
                            if (this.$modes[b] && !e) {
                                this.$onChangeMode(this.$modes[b]);
                            } else if (a && a.Mode) {
                                a = new a.Mode(e);
                                if (!e) {
                                    this.$modes[b] = a;
                                    a.$id = b;
                                }
                                this.$onChangeMode(a);
                            }
                            c && c();
                        }.bind(this));
                        if (!this.$mode) this.$onChangeMode(this.$modes["ace/mode/text"], true);
                    };
                    this.$onChangeMode = function(a, c) {
                        if (!c) this.$modeId = a.$id;
                        if (this.$mode === a) return;
                        var d = this.$mode;
                        this.$mode = a;
                        this.$stopWorker();
                        if (this.$useWorker) this.$startWorker();
                        var b = a.getTokenizer();
                        if (b.on !== undefined) {
                            var e = this.onReloadTokenizer.bind(this);
                            b.on("update", e);
                        }
                        if (!this.bgTokenizer) {
                            this.bgTokenizer = new n(b);
                            var f = this;
                            this.bgTokenizer.on("update", function(a) {
                                f._signal("tokenizerUpdate", a);
                            });
                        } else {
                            this.bgTokenizer.setTokenizer(b);
                        }
                        this.bgTokenizer.setDocument(this.getDocument());
                        this.tokenRe = a.tokenRe;
                        this.nonTokenRe = a.nonTokenRe;
                        if (!c) {
                            if (a.attachToSession) a.attachToSession(this);
                            this.$options.wrapMethod.set.call(this, this.$wrapMethod);
                            this.$setFolding(a.foldingRules);
                            this.bgTokenizer.start(0);
                            this._emit("changeMode", {
                                oldMode: d,
                                mode: a
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
                        } catch (a) {
                            d.warn("Could not load worker", a);
                            this.$worker = null;
                        }
                    };
                    this.getMode = function() {
                        return this.$mode;
                    };
                    this.$scrollTop = 0;
                    this.setScrollTop = function(a) {
                        if (this.$scrollTop === a || isNaN(a)) return;
                        this.$scrollTop = a;
                        this._signal("changeScrollTop", a);
                    };
                    this.getScrollTop = function() {
                        return this.$scrollTop;
                    };
                    this.$scrollLeft = 0;
                    this.setScrollLeft = function(a) {
                        if (this.$scrollLeft === a || isNaN(a)) return;
                        this.$scrollLeft = a;
                        this._signal("changeScrollLeft", a);
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
                        var a = 0;
                        this.lineWidgets.forEach(function(b) {
                            if (b && b.screenWidth > a) a = b.screenWidth;
                        });
                        return (this.lineWidgetWidth = a);
                    };
                    this.$computeWidth = function(i) {
                        if (this.$modified || i) {
                            this.$modified = false;
                            if (this.$useWrapMode) return (this.screenWidth = this.$wrapLimit);
                            var e = this.doc.getAllLines();
                            var c = this.$rowLengthCache;
                            var d = 0;
                            var f = 0;
                            var b = this.$foldData[f];
                            var g = b ? b.start.row : Infinity;
                            var h = e.length;
                            for(var a = 0; a < h; a++){
                                if (a > g) {
                                    a = b.end.row + 1;
                                    if (a >= h) break;
                                    b = this.$foldData[f++];
                                    g = b ? b.start.row : Infinity;
                                }
                                if (c[a] == null) c[a] = this.$getStringScreenWidth(e[a])[0];
                                if (c[a] > d) d = c[a];
                            }
                            this.screenWidth = d;
                        }
                    };
                    this.getLine = function(a) {
                        return this.doc.getLine(a);
                    };
                    this.getLines = function(a, b) {
                        return this.doc.getLines(a, b);
                    };
                    this.getLength = function() {
                        return this.doc.getLength();
                    };
                    this.getTextRange = function(a) {
                        return this.doc.getTextRange(a || this.selection.getRange());
                    };
                    this.insert = function(a, b) {
                        return this.doc.insert(a, b);
                    };
                    this.remove = function(a) {
                        return this.doc.remove(a);
                    };
                    this.removeFullLines = function(a, b) {
                        return this.doc.removeFullLines(a, b);
                    };
                    this.undoChanges = function(a, d) {
                        if (!a.length) return;
                        this.$fromUndo = true;
                        for(var c = a.length - 1; c != -1; c--){
                            var b = a[c];
                            if (b.action == "insert" || b.action == "remove") {
                                this.doc.revertDelta(b);
                            } else if (b.folds) {
                                this.addFolds(b.folds);
                            }
                        }
                        if (!d && this.$undoSelect) {
                            if (a.selectionBefore) this.selection.fromJSON(a.selectionBefore);
                            else this.selection.setRange(this.$getUndoSelection(a, true));
                        }
                        this.$fromUndo = false;
                    };
                    this.redoChanges = function(a, d) {
                        if (!a.length) return;
                        this.$fromUndo = true;
                        for(var b = 0; b < a.length; b++){
                            var c = a[b];
                            if (c.action == "insert" || c.action == "remove") {
                                this.doc.$safeApplyDelta(c);
                            }
                        }
                        if (!d && this.$undoSelect) {
                            if (a.selectionAfter) this.selection.fromJSON(a.selectionAfter);
                            else this.selection.setRange(this.$getUndoSelection(a, false));
                        }
                        this.$fromUndo = false;
                    };
                    this.setUndoSelect = function(a) {
                        this.$undoSelect = a;
                    };
                    this.$getUndoSelection = function(e, g) {
                        function f(a) {
                            return g ? a.action !== "insert" : a.action === "insert";
                        }
                        var c, b;
                        for(var d = 0; d < e.length; d++){
                            var a = e[d];
                            if (!a.start) continue;
                            if (!c) {
                                if (f(a)) {
                                    c = l.fromPoints(a.start, a.end);
                                } else {
                                    c = l.fromPoints(a.start, a.start);
                                }
                                continue;
                            }
                            if (f(a)) {
                                b = a.start;
                                if (c.compare(b.row, b.column) == -1) {
                                    c.setStart(b);
                                }
                                b = a.end;
                                if (c.compare(b.row, b.column) == 1) {
                                    c.setEnd(b);
                                }
                            } else {
                                b = a.start;
                                if (c.compare(b.row, b.column) == -1) {
                                    c = l.fromPoints(a.start, a.start);
                                }
                            }
                        }
                        return c;
                    };
                    this.replace = function(a, b) {
                        return this.doc.replace(a, b);
                    };
                    this.moveText = function(a, e, i) {
                        var j = this.getTextRange(a);
                        var f = this.getFoldsInRange(a);
                        var b = l.fromPoints(e, e);
                        if (!i) {
                            this.remove(a);
                            var c = a.start.row - a.end.row;
                            var d = c ? -a.end.column : a.start.column - a.end.column;
                            if (d) {
                                if (b.start.row == a.end.row && b.start.column > a.end.column) b.start.column += d;
                                if (b.end.row == a.end.row && b.end.column > a.end.column) b.end.column += d;
                            }
                            if (c && b.start.row >= a.end.row) {
                                b.start.row += c;
                                b.end.row += c;
                            }
                        }
                        b.end = this.insert(b.start, j);
                        if (f.length) {
                            var g = a.start;
                            var h = b.start;
                            var c = h.row - g.row;
                            var d = h.column - g.column;
                            this.addFolds(f.map(function(a) {
                                a = a.clone();
                                if (a.start.row == g.row) a.start.column += d;
                                if (a.end.row == g.row) a.end.column += d;
                                a.start.row += c;
                                a.end.row += c;
                                return a;
                            }));
                        }
                        return b;
                    };
                    this.indentRows = function(c, d, a) {
                        a = a.replace(/\t/g, this.getTabString());
                        for(var b = c; b <= d; b++)this.doc.insertInLine({
                            row: b,
                            column: 0
                        }, a);
                    };
                    this.outdentRows = function(g) {
                        var d = g.collapseRows();
                        var b = new l(0, 0, 0, 0);
                        var e = this.getTabSize();
                        for(var c = d.start.row; c <= d.end.row; ++c){
                            var f = this.getLine(c);
                            b.start.row = c;
                            b.end.row = c;
                            for(var a = 0; a < e; ++a)if (f.charAt(a) != " ") break;
                            if (a < e && f.charAt(a) == "\t") {
                                b.start.column = a;
                                b.end.column = a + 1;
                            } else {
                                b.start.column = 0;
                                b.end.column = a;
                            }
                            this.remove(b);
                        }
                    };
                    this.$moveLines = function(a, b, c) {
                        a = this.getRowFoldStart(a);
                        b = this.getRowFoldEnd(b);
                        if (c < 0) {
                            var d = this.getRowFoldStart(a + c);
                            if (d < 0) return 0;
                            var e = d - a;
                        } else if (c > 0) {
                            var d = this.getRowFoldEnd(b + c);
                            if (d > this.doc.getLength() - 1) return 0;
                            var e = d - b;
                        } else {
                            a = this.$clipRowToDocument(a);
                            b = this.$clipRowToDocument(b);
                            var e = b - a + 1;
                        }
                        var g = new l(a, 0, b, Number.MAX_VALUE);
                        var f = this.getFoldsInRange(g).map(function(a) {
                            a = a.clone();
                            a.start.row += e;
                            a.end.row += e;
                            return a;
                        });
                        var h = c == 0 ? this.doc.getLines(a, b) : this.doc.removeFullLines(a, b);
                        this.doc.insertFullLines(a + e, h);
                        f.length && this.addFolds(f);
                        return e;
                    };
                    this.moveLinesUp = function(a, b) {
                        return this.$moveLines(a, b, -1);
                    };
                    this.moveLinesDown = function(a, b) {
                        return this.$moveLines(a, b, 1);
                    };
                    this.duplicateLines = function(a, b) {
                        return this.$moveLines(a, b, 0);
                    };
                    this.$clipRowToDocument = function(a) {
                        return Math.max(0, Math.min(a, this.doc.getLength() - 1));
                    };
                    this.$clipColumnToRow = function(b, a) {
                        if (a < 0) return 0;
                        return Math.min(this.doc.getLine(b).length, a);
                    };
                    this.$clipPositionToDocument = function(b, a) {
                        a = Math.max(0, a);
                        if (b < 0) {
                            b = 0;
                            a = 0;
                        } else {
                            var c = this.doc.getLength();
                            if (b >= c) {
                                b = c - 1;
                                a = this.doc.getLine(c - 1).length;
                            } else {
                                a = Math.min(this.doc.getLine(b).length, a);
                            }
                        }
                        return {
                            row: b,
                            column: a
                        };
                    };
                    this.$clipRangeToDocument = function(a) {
                        if (a.start.row < 0) {
                            a.start.row = 0;
                            a.start.column = 0;
                        } else {
                            a.start.column = this.$clipColumnToRow(a.start.row, a.start.column);
                        }
                        var b = this.doc.getLength() - 1;
                        if (a.end.row > b) {
                            a.end.row = b;
                            a.end.column = this.doc.getLine(b).length;
                        } else {
                            a.end.column = this.$clipColumnToRow(a.end.row, a.end.column);
                        }
                        return a;
                    };
                    this.$wrapLimit = 80;
                    this.$useWrapMode = false;
                    this.$wrapLimitRange = {
                        min: null,
                        max: null
                    };
                    this.setUseWrapMode = function(a) {
                        if (a != this.$useWrapMode) {
                            this.$useWrapMode = a;
                            this.$modified = true;
                            this.$resetRowCache(0);
                            if (a) {
                                var b = this.getLength();
                                this.$wrapData = Array(b);
                                this.$updateWrapData(0, b - 1);
                            }
                            this._signal("changeWrapMode");
                        }
                    };
                    this.getUseWrapMode = function() {
                        return this.$useWrapMode;
                    };
                    this.setWrapLimitRange = function(a, b) {
                        if (this.$wrapLimitRange.min !== a || this.$wrapLimitRange.max !== b) {
                            this.$wrapLimitRange = {
                                min: a,
                                max: b
                            };
                            this.$modified = true;
                            this.$bidiHandler.markAsDirty();
                            if (this.$useWrapMode) this._signal("changeWrapMode");
                        }
                    };
                    this.adjustWrapLimit = function(d, c) {
                        var a = this.$wrapLimitRange;
                        if (a.max < 0) a = {
                            min: c,
                            max: c
                        };
                        var b = this.$constrainWrapLimit(d, a.min, a.max);
                        if (b != this.$wrapLimit && b > 1) {
                            this.$wrapLimit = b;
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
                    this.$constrainWrapLimit = function(a, b, c) {
                        if (b) a = Math.max(b, a);
                        if (c) a = Math.min(c, a);
                        return a;
                    };
                    this.getWrapLimit = function() {
                        return this.$wrapLimit;
                    };
                    this.setWrapLimit = function(a) {
                        this.setWrapLimitRange(a, a);
                    };
                    this.getWrapLimitRange = function() {
                        return {
                            min: this.$wrapLimitRange.min,
                            max: this.$wrapLimitRange.max
                        };
                    };
                    this.$updateInternalDataOnChange = function(g) {
                        var k = this.$useWrapMode;
                        var m = g.action;
                        var e = g.start;
                        var f = g.end;
                        var b = e.row;
                        var i = f.row;
                        var c = i - b;
                        var j = null;
                        this.$updating = true;
                        if (c != 0) {
                            if (m === "remove") {
                                this[k ? "$wrapData" : "$rowLengthCache"].splice(b, c);
                                var h = this.$foldData;
                                j = this.getFoldsInRange(g);
                                this.removeFolds(j);
                                var a = this.getFoldLine(f.row);
                                var d = 0;
                                if (a) {
                                    a.addRemoveChars(f.row, f.column, e.column - f.column);
                                    a.shiftRow(-c);
                                    var l = this.getFoldLine(b);
                                    if (l && l !== a) {
                                        l.merge(a);
                                        a = l;
                                    }
                                    d = h.indexOf(a) + 1;
                                }
                                for(d; d < h.length; d++){
                                    var a = h[d];
                                    if (a.start.row >= f.row) {
                                        a.shiftRow(-c);
                                    }
                                }
                                i = b;
                            } else {
                                var n = Array(c);
                                n.unshift(b, 0);
                                var o = k ? this.$wrapData : this.$rowLengthCache;
                                o.splice.apply(o, n);
                                var h = this.$foldData;
                                var a = this.getFoldLine(b);
                                var d = 0;
                                if (a) {
                                    var p = a.range.compareInside(e.row, e.column);
                                    if (p == 0) {
                                        a = a.split(e.row, e.column);
                                        if (a) {
                                            a.shiftRow(c);
                                            a.addRemoveChars(i, 0, f.column - e.column);
                                        }
                                    } else if (p == -1) {
                                        a.addRemoveChars(b, 0, f.column - e.column);
                                        a.shiftRow(c);
                                    }
                                    d = h.indexOf(a) + 1;
                                }
                                for(d; d < h.length; d++){
                                    var a = h[d];
                                    if (a.start.row >= b) {
                                        a.shiftRow(c);
                                    }
                                }
                            }
                        } else {
                            c = Math.abs(g.start.column - g.end.column);
                            if (m === "remove") {
                                j = this.getFoldsInRange(g);
                                this.removeFolds(j);
                                c = -c;
                            }
                            var a = this.getFoldLine(b);
                            if (a) {
                                a.addRemoveChars(b, e.column, c);
                            }
                        }
                        if (k && this.$wrapData.length != this.doc.getLength()) {
                            console.error("doc.getLength() and $wrapData.length have to be the same!");
                        }
                        this.$updating = false;
                        if (k) this.$updateWrapData(b, i);
                        else this.$updateRowLengthCache(b, i);
                        return j;
                    };
                    this.$updateRowLengthCache = function(a, b, c) {
                        this.$rowLengthCache[a] = null;
                        this.$rowLengthCache[b] = null;
                    };
                    this.$updateWrapData = function(k, f) {
                        var g = this.doc.getAllLines();
                        var h = this.getTabSize();
                        var i = this.$wrapData;
                        var j = this.$wrapLimit;
                        var d;
                        var a;
                        var b = k;
                        f = Math.min(f, g.length - 1);
                        while(b <= f){
                            a = this.getFoldLine(b, a);
                            if (!a) {
                                d = this.$getDisplayTokens(g[b]);
                                i[b] = this.$computeWrapSplits(d, j, h);
                                b++;
                            } else {
                                d = [];
                                a.walk(function(f, h, i, j) {
                                    var a;
                                    if (f != null) {
                                        a = this.$getDisplayTokens(f, d.length);
                                        a[0] = c;
                                        for(var b = 1; b < a.length; b++){
                                            a[b] = e;
                                        }
                                    } else {
                                        a = this.$getDisplayTokens(g[h].substring(j, i), d.length);
                                    }
                                    d = d.concat(a);
                                }.bind(this), a.end.row, g[a.end.row].length + 1);
                                i[a.start.row] = this.$computeWrapSplits(d, j, h);
                                b = a.end.row + 1;
                            }
                        }
                    };
                    var a = 1, b = 2, c = 3, e = 4, h = 9, j = 10, m = 11, p = 12;
                    this.$computeWrapSplits = function(d, f, n) {
                        if (d.length == 0) {
                            return [];
                        }
                        var o = [];
                        var q = d.length;
                        var g = 0, t = 0;
                        var r = this.$wrapAsCode;
                        var s = this.$indentedSoftWrap;
                        var u = f <= Math.max(2 * n, 8) || s === false ? 0 : Math.floor(f / 2);
                        function v() {
                            var a = 0;
                            if (u === 0) return a;
                            if (s) {
                                for(var b = 0; b < d.length; b++){
                                    var c = d[b];
                                    if (c == j) a += 1;
                                    else if (c == m) a += n;
                                    else if (c == p) continue;
                                    else break;
                                }
                            }
                            if (r && s !== false) a += n;
                            return Math.min(a, u);
                        }
                        function i(a) {
                            var c = a - g;
                            for(var b = g; b < a; b++){
                                var e = d[b];
                                if (e === 12 || e === 2) c -= 1;
                            }
                            if (!o.length) {
                                l = v();
                                o.indent = l;
                            }
                            t += c;
                            o.push(t);
                            g = a;
                        }
                        var l = 0;
                        while(q - g > f - l){
                            var a = g + f - l;
                            if (d[a - 1] >= j && d[a] >= j) {
                                i(a);
                                continue;
                            }
                            if (d[a] == c || d[a] == e) {
                                for(a; a != g - 1; a--){
                                    if (d[a] == c) {
                                        break;
                                    }
                                }
                                if (a > g) {
                                    i(a);
                                    continue;
                                }
                                a = g + f;
                                for(a; a < d.length; a++){
                                    if (d[a] != e) {
                                        break;
                                    }
                                }
                                if (a == d.length) {
                                    break;
                                }
                                i(a);
                                continue;
                            }
                            var k = Math.max(a - (f - (f >> 2)), g - 1);
                            while(a > k && d[a] < c){
                                a--;
                            }
                            if (r) {
                                while(a > k && d[a] < c){
                                    a--;
                                }
                                while(a > k && d[a] == h){
                                    a--;
                                }
                            } else {
                                while(a > k && d[a] < j){
                                    a--;
                                }
                            }
                            if (a > k) {
                                i(++a);
                                continue;
                            }
                            a = g + f;
                            if (d[a] == b) a--;
                            i(a - l);
                        }
                        return o;
                    };
                    this.$getDisplayTokens = function(g, e) {
                        var c = [];
                        var i;
                        e = e || 0;
                        for(var f = 0; f < g.length; f++){
                            var d = g.charCodeAt(f);
                            if (d == 9) {
                                i = this.getScreenTabSize(c.length + e);
                                c.push(m);
                                for(var k = 1; k < i; k++){
                                    c.push(p);
                                }
                            } else if (d == 32) {
                                c.push(j);
                            } else if ((d > 39 && d < 48) || (d > 57 && d < 64)) {
                                c.push(h);
                            } else if (d >= 0x1100 && q(d)) {
                                c.push(a, b);
                            } else {
                                c.push(a);
                            }
                        }
                        return c;
                    };
                    this.$getStringScreenWidth = function(e, c, a) {
                        if (c == 0) return [
                            0,
                            0
                        ];
                        if (c == null) c = Infinity;
                        a = a || 0;
                        var d, b;
                        for(b = 0; b < e.length; b++){
                            d = e.charCodeAt(b);
                            if (d == 9) {
                                a += this.getScreenTabSize(a);
                            } else if (d >= 0x1100 && q(d)) {
                                a += 2;
                            } else {
                                a += 1;
                            }
                            if (a > c) {
                                break;
                            }
                        }
                        return [
                            a,
                            b
                        ];
                    };
                    this.lineWidgets = null;
                    this.getRowLength = function(a) {
                        var b = 1;
                        if (this.lineWidgets) b += (this.lineWidgets[a] && this.lineWidgets[a].rowCount) || 0;
                        if (!this.$useWrapMode || !this.$wrapData[a]) return b;
                        else return this.$wrapData[a].length + b;
                    };
                    this.getRowLineCount = function(a) {
                        if (!this.$useWrapMode || !this.$wrapData[a]) {
                            return 1;
                        } else {
                            return this.$wrapData[a].length + 1;
                        }
                    };
                    this.getRowWrapIndent = function(c) {
                        if (this.$useWrapMode) {
                            var b = this.screenToDocumentPosition(c, Number.MAX_VALUE);
                            var a = this.$wrapData[b.row];
                            return a.length && a[0] < b.column ? a.indent : 0;
                        } else {
                            return 0;
                        }
                    };
                    this.getScreenLastRowColumn = function(b) {
                        var a = this.screenToDocumentPosition(b, Number.MAX_VALUE);
                        return this.documentToScreenColumn(a.row, a.column);
                    };
                    this.getDocumentLastRowColumn = function(a, b) {
                        var c = this.documentToScreenRow(a, b);
                        return this.getScreenLastRowColumn(c);
                    };
                    this.getDocumentLastRowColumnPosition = function(a, b) {
                        var c = this.documentToScreenRow(a, b);
                        return this.screenToDocumentPosition(c, Number.MAX_VALUE / 10);
                    };
                    this.getRowSplitData = function(a) {
                        if (!this.$useWrapMode) {
                            return undefined;
                        } else {
                            return this.$wrapData[a];
                        }
                    };
                    this.getScreenTabSize = function(a) {
                        return (this.$tabSize - (a % this.$tabSize | 0));
                    };
                    this.screenToDocumentRow = function(a, b) {
                        return this.screenToDocumentPosition(a, b).row;
                    };
                    this.screenToDocumentColumn = function(a, b) {
                        return this.screenToDocumentPosition(a, b).column;
                    };
                    this.screenToDocumentPosition = function(d, o, p) {
                        if (d < 0) return {
                            row: 0,
                            column: 0
                        };
                        var g;
                        var a = 0;
                        var e = 0;
                        var l;
                        var c = 0;
                        var i = 0;
                        var j = this.$screenRowCache;
                        var m = this.$getRowCacheIndex(j, d);
                        var n = j.length;
                        if (n && m >= 0) {
                            var c = j[m];
                            var a = this.$docRowCache[m];
                            var q = d > j[n - 1];
                        } else {
                            var q = !n;
                        }
                        var k = this.getLength() - 1;
                        var b = this.getNextFoldLine(a);
                        var r = b ? b.start.row : Infinity;
                        while(c <= d){
                            i = this.getRowLength(a);
                            if (c + i > d || a >= k) {
                                break;
                            } else {
                                c += i;
                                a++;
                                if (a > r) {
                                    a = b.end.row + 1;
                                    b = this.getNextFoldLine(a, b);
                                    r = b ? b.start.row : Infinity;
                                }
                            }
                            if (q) {
                                this.$docRowCache.push(a);
                                this.$screenRowCache.push(c);
                            }
                        }
                        if (b && b.start.row <= a) {
                            g = this.getFoldDisplayLine(b);
                            a = b.start.row;
                        } else if (c + i <= d || a > k) {
                            return {
                                row: k,
                                column: this.getLine(k).length
                            };
                        } else {
                            g = this.getLine(a);
                            b = null;
                        }
                        var s = 0, h = Math.floor(d - c);
                        if (this.$useWrapMode) {
                            var f = this.$wrapData[a];
                            if (f) {
                                l = f[h];
                                if (h > 0 && f.length) {
                                    s = f.indent;
                                    e = f[h - 1] || f[f.length - 1];
                                    g = g.substring(e);
                                }
                            }
                        }
                        if (p !== undefined && this.$bidiHandler.isBidiRow(c + h, a, h)) o = this.$bidiHandler.offsetToCol(p);
                        e += this.$getStringScreenWidth(g, o - s)[1];
                        if (this.$useWrapMode && e >= l) e = l - 1;
                        if (b) return b.idxToPosition(e);
                        return {
                            row: a,
                            column: e
                        };
                    };
                    this.documentToScreenPosition = function(a, d) {
                        if (typeof d === "undefined") var l = this.$clipPositionToDocument(a.row, a.column);
                        else l = this.$clipPositionToDocument(a, d);
                        a = l.row;
                        d = l.column;
                        var f = 0;
                        var m = null;
                        var h = null;
                        h = this.getFoldAt(a, d, 1);
                        if (h) {
                            a = h.start.row;
                            d = h.start.column;
                        }
                        var g, b = 0;
                        var i = this.$docRowCache;
                        var n = this.$getRowCacheIndex(i, a);
                        var o = i.length;
                        if (o && n >= 0) {
                            var b = i[n];
                            var f = this.$screenRowCache[n];
                            var q = a > i[o - 1];
                        } else {
                            var q = !o;
                        }
                        var c = this.getNextFoldLine(b);
                        var p = c ? c.start.row : Infinity;
                        while(b < a){
                            if (b >= p) {
                                g = c.end.row + 1;
                                if (g > a) break;
                                c = this.getNextFoldLine(g, c);
                                p = c ? c.start.row : Infinity;
                            } else {
                                g = b + 1;
                            }
                            f += this.getRowLength(b);
                            b = g;
                            if (q) {
                                this.$docRowCache.push(b);
                                this.$screenRowCache.push(f);
                            }
                        }
                        var e = "";
                        if (c && b >= p) {
                            e = this.getFoldDisplayLine(c, a, d);
                            m = c.start.row;
                        } else {
                            e = this.getLine(a).substring(0, d);
                            m = a;
                        }
                        var r = 0;
                        if (this.$useWrapMode) {
                            var j = this.$wrapData[m];
                            if (j) {
                                var k = 0;
                                while(e.length >= j[k]){
                                    f++;
                                    k++;
                                }
                                e = e.substring(j[k - 1] || 0, e.length);
                                r = k > 0 ? j.indent : 0;
                            }
                        }
                        if (this.lineWidgets && this.lineWidgets[b] && this.lineWidgets[b].rowsAbove) f += this.lineWidgets[b].rowsAbove;
                        return {
                            row: f,
                            column: r + this.$getStringScreenWidth(e)[0]
                        };
                    };
                    this.documentToScreenColumn = function(a, b) {
                        return this.documentToScreenPosition(a, b).column;
                    };
                    this.documentToScreenRow = function(a, b) {
                        return this.documentToScreenPosition(a, b).row;
                    };
                    this.getScreenLength = function() {
                        var c = 0;
                        var a = null;
                        if (!this.$useWrapMode) {
                            c = this.getLength();
                            var e = this.$foldData;
                            for(var b = 0; b < e.length; b++){
                                a = e[b];
                                c -= a.end.row - a.start.row;
                            }
                        } else {
                            var h = this.$wrapData.length;
                            var d = 0, b = 0;
                            var a = this.$foldData[b++];
                            var f = a ? a.start.row : Infinity;
                            while(d < h){
                                var g = this.$wrapData[d];
                                c += g ? g.length + 1 : 1;
                                d++;
                                if (d > f) {
                                    d = a.end.row + 1;
                                    a = this.$foldData[b++];
                                    f = a ? a.start.row : Infinity;
                                }
                            }
                        }
                        if (this.lineWidgets) c += this.$getWidgetScreenLength();
                        return c;
                    };
                    this.$setFontMetrics = function(a) {
                        if (!this.$enableVarChar) return;
                        this.$getStringScreenWidth = function(f, d, b) {
                            if (d === 0) return [
                                0,
                                0
                            ];
                            if (!d) d = Infinity;
                            b = b || 0;
                            var e, c;
                            for(c = 0; c < f.length; c++){
                                e = f.charAt(c);
                                if (e === "\t") {
                                    b += this.getScreenTabSize(b);
                                } else {
                                    b += a.getCharacterWidth(e);
                                }
                                if (b > d) {
                                    break;
                                }
                            }
                            return [
                                b,
                                c
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
                    this.isFullWidth = q;
                    function q(a) {
                        if (a < 0x1100) return false;
                        return ((a >= 0x1100 && a <= 0x115f) || (a >= 0x11a3 && a <= 0x11a7) || (a >= 0x11fa && a <= 0x11ff) || (a >= 0x2329 && a <= 0x232a) || (a >= 0x2e80 && a <= 0x2e99) || (a >= 0x2e9b && a <= 0x2ef3) || (a >= 0x2f00 && a <= 0x2fd5) || (a >= 0x2ff0 && a <= 0x2ffb) || (a >= 0x3000 && a <= 0x303e) || (a >= 0x3041 && a <= 0x3096) || (a >= 0x3099 && a <= 0x30ff) || (a >= 0x3105 && a <= 0x312d) || (a >= 0x3131 && a <= 0x318e) || (a >= 0x3190 && a <= 0x31ba) || (a >= 0x31c0 && a <= 0x31e3) || (a >= 0x31f0 && a <= 0x321e) || (a >= 0x3220 && a <= 0x3247) || (a >= 0x3250 && a <= 0x32fe) || (a >= 0x3300 && a <= 0x4dbf) || (a >= 0x4e00 && a <= 0xa48c) || (a >= 0xa490 && a <= 0xa4c6) || (a >= 0xa960 && a <= 0xa97c) || (a >= 0xac00 && a <= 0xd7a3) || (a >= 0xd7b0 && a <= 0xd7c6) || (a >= 0xd7cb && a <= 0xd7fb) || (a >= 0xf900 && a <= 0xfaff) || (a >= 0xfe10 && a <= 0xfe19) || (a >= 0xfe30 && a <= 0xfe52) || (a >= 0xfe54 && a <= 0xfe66) || (a >= 0xfe68 && a <= 0xfe6b) || (a >= 0xff01 && a <= 0xff60) || (a >= 0xffe0 && a <= 0xffe6));
                    }
                }.call(b.prototype));
                a("./edit_session/folding").Folding.call(b.prototype);
                a("./edit_session/bracket_match").BracketMatch.call(b.prototype);
                d.defineOptions(b.prototype, "session", {
                    wrap: {
                        set: function(a) {
                            if (!a || a == "off") a = false;
                            else if (a == "free") a = true;
                            else if (a == "printMargin") a = -1;
                            else if (typeof a == "string") a = parseInt(a, 10) || false;
                            if (this.$wrap == a) return;
                            this.$wrap = a;
                            if (!a) {
                                this.setUseWrapMode(false);
                            } else {
                                var b = typeof a == "number" ? a : null;
                                this.setWrapLimitRange(b, b);
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
                        set: function(a) {
                            a = a == "auto" ? this.$mode.type != "text" : a != "text";
                            if (a != this.$wrapAsCode) {
                                this.$wrapAsCode = a;
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
                        set: function(a) {
                            this.$useWorker = a;
                            this.$stopWorker();
                            if (a) this.$startWorker();
                        },
                        initialValue: true
                    },
                    useSoftTabs: {
                        initialValue: true
                    },
                    tabSize: {
                        set: function(a) {
                            a = parseInt(a);
                            if (a > 0 && this.$tabSize !== a) {
                                this.$modified = true;
                                this.$rowLengthCache = [];
                                this.$tabSize = a;
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
                        set: function(a) {
                            this.setFoldStyle(a);
                        },
                        handlesSet: true
                    },
                    overwrite: {
                        set: function(a) {
                            this._signal("changeOverwrite");
                        },
                        initialValue: false
                    },
                    newLineMode: {
                        set: function(a) {
                            this.doc.setNewLineMode(a);
                        },
                        get: function() {
                            return this.doc.getNewLineMode();
                        },
                        handlesSet: true
                    },
                    mode: {
                        set: function(a) {
                            this.setMode(a);
                        },
                        get: function() {
                            return this.$modeId;
                        },
                        handlesSet: true
                    }
                });
                c.EditSession = b;
            });
            ace.define("ace/search", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range", 
            ], function(a, c, d) {
                "use strict";
                var e = a("./lib/lang");
                var f = a("./lib/oop");
                var g = a("./range").Range;
                var b = function() {
                    this.$options = {};
                };
                (function() {
                    this.set = function(a) {
                        f.mixin(this.$options, a);
                        return this;
                    };
                    this.getOptions = function() {
                        return e.copyObject(this.$options);
                    };
                    this.setOptions = function(a) {
                        this.$options = a;
                    };
                    this.find = function(b) {
                        var c = this.$options;
                        var a = this.$matchIterator(b, c);
                        if (!a) return false;
                        var d = null;
                        a.forEach(function(e, a, f, b) {
                            d = new g(e, a, f, b);
                            if (a == b && c.start && c.start.start && c.skipCurrent != false && d.isEqual(c.start)) {
                                d = null;
                                return false;
                            }
                            return true;
                        });
                        return d;
                    };
                    this.findAll = function(n) {
                        var k = this.$options;
                        if (!k.needle) return [];
                        this.$assembleRegExp(k);
                        var d = k.range;
                        var i = d ? n.getLines(d.start.row, d.end.row) : n.doc.getAllLines();
                        var c = [];
                        var j = k.re;
                        if (k.$isMultiLine) {
                            var h = j.length;
                            var r = i.length - h;
                            var l;
                            outer: for(var f = j.offset || 0; f <= r; f++){
                                for(var a = 0; a < h; a++)if (i[f + a].search(j[a]) == -1) continue outer;
                                var o = i[f];
                                var s = i[f + h - 1];
                                var p = o.length - o.match(j[0])[0].length;
                                var t = s.match(j[h - 1])[0].length;
                                if (l && l.end.row === f && l.end.column > p) {
                                    continue;
                                }
                                c.push((l = new g(f, p, f + h - 1, t)));
                                if (h > 2) f = f + h - 2;
                            }
                        } else {
                            for(var b = 0; b < i.length; b++){
                                var q = e.getMatchOffsets(i[b], j);
                                for(var a = 0; a < q.length; a++){
                                    var m = q[a];
                                    c.push(new g(b, m.offset, b, m.offset + m.length));
                                }
                            }
                        }
                        if (d) {
                            var u = d.start.column;
                            var v = d.start.column;
                            var b = 0, a = c.length - 1;
                            while(b < a && c[b].start.column < u && c[b].start.row == d.start.row)b++;
                            while(b < a && c[a].end.column > v && c[a].end.row == d.end.row)a--;
                            c = c.slice(b, a + 1);
                            for(b = 0, a = c.length; b < a; b++){
                                c[b].start.row += d.start.row;
                                c[b].end.row += d.start.row;
                            }
                        }
                        return c;
                    };
                    this.replace = function(b, a) {
                        var d = this.$options;
                        var e = this.$assembleRegExp(d);
                        if (d.$isMultiLine) return a;
                        if (!e) return;
                        var g = e.exec(b);
                        if (!g || g[0].length != b.length) return null;
                        a = b.replace(e, a);
                        if (d.preserveCase) {
                            a = a.split("");
                            for(var c = Math.min(b.length, b.length); c--;){
                                var f = b[c];
                                if (f && f.toLowerCase() != f) a[c] = a[c].toUpperCase();
                                else a[c] = a[c].toLowerCase();
                            }
                            a = a.join("");
                        }
                        return a;
                    };
                    this.$assembleRegExp = function(a, f) {
                        if (a.needle instanceof RegExp) return (a.re = a.needle);
                        var b = a.needle;
                        if (!a.needle) return (a.re = false);
                        if (!a.regExp) b = e.escapeRegExp(b);
                        if (a.wholeWord) b = h(b, a);
                        var c = a.caseSensitive ? "gm" : "gmi";
                        a.$isMultiLine = !f && /[\n\r]/.test(b);
                        if (a.$isMultiLine) return (a.re = this.$assembleMultilineRegExp(b, c));
                        try {
                            var d = new RegExp(b, c);
                        } catch (g) {
                            d = false;
                        }
                        return (a.re = d);
                    };
                    this.$assembleMultilineRegExp = function(d, e) {
                        var b = d.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
                        var c = [];
                        for(var a = 0; a < b.length; a++)try {
                            c.push(new RegExp(b[a], e));
                        } catch (f) {
                            return false;
                        }
                        return c;
                    };
                    this.$matchIterator = function(e, a) {
                        var f = this.$assembleRegExp(a);
                        if (!f) return false;
                        var d = a.backwards == true;
                        var i = a.skipCurrent != false;
                        var b = a.range;
                        var c = a.start;
                        if (!c) c = b ? b[d ? "end" : "start"] : e.selection.getRange();
                        if (c.start) c = c[i != d ? "end" : "start"];
                        var j = b ? b.start.row : 0;
                        var k = b ? b.end.row : e.getLength() - 1;
                        if (d) {
                            var g = function(d) {
                                var b = c.row;
                                if (h(b, c.column, d)) return;
                                for(b--; b >= j; b--)if (h(b, Number.MAX_VALUE, d)) return;
                                if (a.wrap == false) return;
                                for(b = k, j = c.row; b >= j; b--)if (h(b, Number.MAX_VALUE, d)) return;
                            };
                        } else {
                            var g = function(d) {
                                var b = c.row;
                                if (h(b, c.column, d)) return;
                                for(b = b + 1; b <= k; b++)if (h(b, 0, d)) return;
                                if (a.wrap == false) return;
                                for(b = j, k = c.row; b <= k; b++)if (h(b, 0, d)) return;
                            };
                        }
                        if (a.$isMultiLine) {
                            var l = f.length;
                            var h = function(h, i, k) {
                                var a = d ? h - l + 1 : h;
                                if (a < 0 || a + l > e.getLength()) return;
                                var b = e.getLine(a);
                                var g = b.search(f[0]);
                                if ((!d && g < i) || g === -1) return;
                                for(var c = 1; c < l; c++){
                                    b = e.getLine(a + c);
                                    if (b.search(f[c]) == -1) return;
                                }
                                var j = b.match(f[l - 1])[0].length;
                                if (d && j > i) return;
                                if (k(a, g, a + l - 1, j)) return true;
                            };
                        } else if (d) {
                            var h = function(g, k, l) {
                                var i = e.getLine(g);
                                var c = [];
                                var a, h = 0;
                                f.lastIndex = 0;
                                while((a = f.exec(i))){
                                    var b = a[0].length;
                                    h = a.index;
                                    if (!b) {
                                        if (h >= i.length) break;
                                        f.lastIndex = h += 1;
                                    }
                                    if (a.index + b > k) break;
                                    c.push(a.index, b);
                                }
                                for(var d = c.length - 1; d >= 0; d -= 2){
                                    var j = c[d - 1];
                                    var b = c[d];
                                    if (l(g, j, g, j + b)) return true;
                                }
                            };
                        } else {
                            var h = function(b, h, i) {
                                var d = e.getLine(b);
                                var a;
                                var c;
                                f.lastIndex = h;
                                while((c = f.exec(d))){
                                    var g = c[0].length;
                                    a = c.index;
                                    if (i(b, a, b, a + g)) return true;
                                    if (!g) {
                                        f.lastIndex = a += 1;
                                        if (a >= d.length) return false;
                                    }
                                }
                            };
                        }
                        return {
                            forEach: g
                        };
                    };
                }.call(b.prototype));
                function h(a, c) {
                    function b(a) {
                        if (/\w/.test(a) || c.regExp) return "\\b";
                        return "";
                    }
                    return (b(a[0]) + a + b(a[a.length - 1]));
                }
                c.Search = b;
            });
            ace.define("ace/keyboard/hash_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent", 
            ], function(b, c, f) {
                "use strict";
                var e = b("../lib/keys");
                var g = b("../lib/useragent");
                var h = e.KEY_MODS;
                function a(a, b) {
                    this.platform = b || (g.isMac ? "mac" : "win");
                    this.commands = {};
                    this.commandKeyBinding = {};
                    this.addCommands(a);
                    this.$singleCommand = true;
                }
                function d(b, c) {
                    a.call(this, b, c);
                    this.$singleCommand = false;
                }
                d.prototype = a.prototype;
                (function() {
                    this.addCommand = function(a) {
                        if (this.commands[a.name]) this.removeCommand(a);
                        this.commands[a.name] = a;
                        if (a.bindKey) this._buildKeyHash(a);
                    };
                    this.removeCommand = function(a, g) {
                        var e = a && (typeof a === "string" ? a : a.name);
                        a = this.commands[e];
                        if (!g) delete this.commands[e];
                        var c = this.commandKeyBinding;
                        for(var d in c){
                            var b = c[d];
                            if (b == a) {
                                delete c[d];
                            } else if (Array.isArray(b)) {
                                var f = b.indexOf(a);
                                if (f != -1) {
                                    b.splice(f, 1);
                                    if (b.length == 1) c[d] = b[0];
                                }
                            }
                        }
                    };
                    this.bindKey = function(a, b, c) {
                        if (typeof a == "object" && a) {
                            if (c == undefined) c = a.position;
                            a = a[this.platform];
                        }
                        if (!a) return;
                        if (typeof b == "function") return this.addCommand({
                            exec: b,
                            bindKey: a,
                            name: b.name || a
                        });
                        a.split("|").forEach(function(a) {
                            var d = "";
                            if (a.indexOf(" ") != -1) {
                                var e = a.split(/\s+/);
                                a = e.pop();
                                e.forEach(function(b) {
                                    var a = this.parseKeys(b);
                                    var c = h[a.hashId] + a.key;
                                    d += (d ? " " : "") + c;
                                    this._addCommandToBinding(d, "chainKeys");
                                }, this);
                                d += " ";
                            }
                            var f = this.parseKeys(a);
                            var g = h[f.hashId] + f.key;
                            this._addCommandToBinding(d + g, b, c);
                        }, this);
                    };
                    function a(a) {
                        return ((typeof a == "object" && a.bindKey && a.bindKey.position) || (a.isDefault ? -100 : 0));
                    }
                    this._addCommandToBinding = function(b, e, f) {
                        var c = this.commandKeyBinding, d;
                        if (!e) {
                            delete c[b];
                        } else if (!c[b] || this.$singleCommand) {
                            c[b] = e;
                        } else {
                            if (!Array.isArray(c[b])) {
                                c[b] = [
                                    c[b]
                                ];
                            } else if ((d = c[b].indexOf(e)) != -1) {
                                c[b].splice(d, 1);
                            }
                            if (typeof f != "number") {
                                f = a(e);
                            }
                            var g = c[b];
                            for(d = 0; d < g.length; d++){
                                var h = g[d];
                                var i = a(h);
                                if (i > f) break;
                            }
                            g.splice(d, 0, e);
                        }
                    };
                    this.addCommands = function(a) {
                        a && Object.keys(a).forEach(function(c) {
                            var b = a[c];
                            if (!b) return;
                            if (typeof b === "string") return this.bindKey(b, c);
                            if (typeof b === "function") b = {
                                exec: b
                            };
                            if (typeof b !== "object") return;
                            if (!b.name) b.name = c;
                            this.addCommand(b);
                        }, this);
                    };
                    this.removeCommands = function(a) {
                        Object.keys(a).forEach(function(b) {
                            this.removeCommand(a[b]);
                        }, this);
                    };
                    this.bindKeys = function(a) {
                        Object.keys(a).forEach(function(b) {
                            this.bindKey(b, a[b]);
                        }, this);
                    };
                    this._buildKeyHash = function(a) {
                        this.bindKey(a.bindKey, a);
                    };
                    this.parseKeys = function(d) {
                        var a = d.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(a) {
                            return a;
                        });
                        var b = a.pop();
                        var f = e[b];
                        if (e.FUNCTION_KEYS[f]) b = e.FUNCTION_KEYS[f].toLowerCase();
                        else if (!a.length) return {
                            key: b,
                            hashId: -1
                        };
                        else if (a.length == 1 && a[0] == "shift") return {
                            key: b.toUpperCase(),
                            hashId: -1
                        };
                        var g = 0;
                        for(var c = a.length; c--;){
                            var h = e.KEY_MODS[a[c]];
                            if (h == null) {
                                if (typeof console != "undefined") console.error("invalid modifier " + a[c] + " in " + d);
                                return false;
                            }
                            g |= h;
                        }
                        return {
                            key: b,
                            hashId: g
                        };
                    };
                    this.findKeyCommand = function d(a, b) {
                        var c = h[a] + b;
                        return this.commandKeyBinding[c];
                    };
                    this.handleKeyboard = function(a, c, e, f) {
                        if (f < 0) return;
                        var d = h[c] + e;
                        var b = this.commandKeyBinding[d];
                        if (a.$keyChain) {
                            a.$keyChain += " " + d;
                            b = this.commandKeyBinding[a.$keyChain] || b;
                        }
                        if (b) {
                            if (b == "chainKeys" || b[b.length - 1] == "chainKeys") {
                                a.$keyChain = a.$keyChain || d;
                                return {
                                    command: "null"
                                };
                            }
                        }
                        if (a.$keyChain) {
                            if ((!c || c == 4) && e.length == 1) a.$keyChain = a.$keyChain.slice(0, -d.length - 1);
                            else if (c == -1 || f > 0) a.$keyChain = "";
                        }
                        return {
                            command: b
                        };
                    };
                    this.getStatusText = function(b, a) {
                        return a.$keyChain || "";
                    };
                }.call(a.prototype));
                c.HashHandler = a;
                c.MultiHashHandler = d;
            });
            ace.define("ace/commands/command_manager", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/keyboard/hash_handler",
                "ace/lib/event_emitter", 
            ], function(a, c, f) {
                "use strict";
                var d = a("../lib/oop");
                var e = a("../keyboard/hash_handler").MultiHashHandler;
                var g = a("../lib/event_emitter").EventEmitter;
                var b = function(a, b) {
                    e.call(this, b, a);
                    this.byName = this.commands;
                    this.setDefaultHandler("exec", function(a) {
                        return a.command.exec(a.editor, a.args || {});
                    });
                };
                d.inherits(b, e);
                (function() {
                    d.implement(this, g);
                    this.exec = function(a, b, d) {
                        if (Array.isArray(a)) {
                            for(var e = a.length; e--;){
                                if (this.exec(a[e], b, d)) return true;
                            }
                            return false;
                        }
                        if (typeof a === "string") a = this.commands[a];
                        if (!a) return false;
                        if (b && b.$readOnly && !a.readOnly) return false;
                        if (this.$checkCommandState != false && a.isAvailable && !a.isAvailable(b)) return false;
                        var c = {
                            editor: b,
                            command: a,
                            args: d
                        };
                        c.returnValue = this._emit("exec", c);
                        this._signal("afterExec", c);
                        return c.returnValue === false ? false : true;
                    };
                    this.toggleRecording = function(a) {
                        if (this.$inReplay) return;
                        a && a._emit("changeStatus");
                        if (this.recording) {
                            this.macro.pop();
                            this.off("exec", this.$addCommandToMacro);
                            if (!this.macro.length) this.macro = this.oldMacro;
                            return (this.recording = false);
                        }
                        if (!this.$addCommandToMacro) {
                            this.$addCommandToMacro = function(a) {
                                this.macro.push([
                                    a.command,
                                    a.args
                                ]);
                            }.bind(this);
                        }
                        this.oldMacro = this.macro;
                        this.macro = [];
                        this.on("exec", this.$addCommandToMacro);
                        return (this.recording = true);
                    };
                    this.replay = function(a) {
                        if (this.$inReplay || !this.macro) return;
                        if (this.recording) return this.toggleRecording(a);
                        try {
                            this.$inReplay = true;
                            this.macro.forEach(function(b) {
                                if (typeof b == "string") this.exec(b, a);
                                else this.exec(b[0], a, b[1]);
                            }, this);
                        } finally{
                            this.$inReplay = false;
                        }
                    };
                    this.trimMacro = function(a) {
                        return a.map(function(a) {
                            if (typeof a[0] != "string") a[0] = a[0].name;
                            if (!a[1]) a = a[0];
                            return a;
                        });
                    };
                }.call(b.prototype));
                c.CommandManager = b;
            });
            ace.define("ace/commands/default_commands", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/config",
                "ace/range", 
            ], function(c, d, e) {
                "use strict";
                var f = c("../lib/lang");
                var g = c("../config");
                var h = c("../range").Range;
                function a(a, b) {
                    return {
                        win: a,
                        mac: b
                    };
                }
                d.commands = [
                    {
                        name: "showSettingsMenu",
                        description: "Show settings menu",
                        bindKey: a("Ctrl-,", "Command-,"),
                        exec: function(a) {
                            g.loadModule("ace/ext/settings_menu", function(b) {
                                b.init(a);
                                a.showSettingsMenu();
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "goToNextError",
                        description: "Go to next error",
                        bindKey: a("Alt-E", "F4"),
                        exec: function(a) {
                            g.loadModule("./ext/error_marker", function(b) {
                                b.showErrorMarker(a, 1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "goToPreviousError",
                        description: "Go to previous error",
                        bindKey: a("Alt-Shift-E", "Shift-F4"),
                        exec: function(a) {
                            g.loadModule("./ext/error_marker", function(b) {
                                b.showErrorMarker(a, -1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "selectall",
                        description: "Select all",
                        bindKey: a("Ctrl-A", "Command-A"),
                        exec: function(a) {
                            a.selectAll();
                        },
                        readOnly: true
                    },
                    {
                        name: "centerselection",
                        description: "Center selection",
                        bindKey: a(null, "Ctrl-L"),
                        exec: function(a) {
                            a.centerSelection();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotoline",
                        description: "Go to line...",
                        bindKey: a("Ctrl-L", "Command-L"),
                        exec: function(b, a) {
                            if (typeof a === "number" && !isNaN(a)) b.gotoLine(a);
                            b.prompt({
                                $type: "gotoLine"
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "fold",
                        bindKey: a("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
                        exec: function(a) {
                            a.session.toggleFold(false);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "unfold",
                        bindKey: a("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
                        exec: function(a) {
                            a.session.toggleFold(true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "toggleFoldWidget",
                        description: "Toggle fold widget",
                        bindKey: a("F2", "F2"),
                        exec: function(a) {
                            a.session.toggleFoldWidget();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "toggleParentFoldWidget",
                        description: "Toggle parent fold widget",
                        bindKey: a("Alt-F2", "Alt-F2"),
                        exec: function(a) {
                            a.session.toggleFoldWidget(true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldall",
                        description: "Fold all",
                        bindKey: a(null, "Ctrl-Command-Option-0"),
                        exec: function(a) {
                            a.session.foldAll();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldAllComments",
                        description: "Fold all comments",
                        bindKey: a(null, "Ctrl-Command-Option-0"),
                        exec: function(a) {
                            a.session.foldAllComments();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldOther",
                        description: "Fold other",
                        bindKey: a("Alt-0", "Command-Option-0"),
                        exec: function(a) {
                            a.session.foldAll();
                            a.session.unfold(a.selection.getAllRanges());
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "unfoldall",
                        description: "Unfold all",
                        bindKey: a("Alt-Shift-0", "Command-Option-Shift-0"),
                        exec: function(a) {
                            a.session.unfold();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "findnext",
                        description: "Find next",
                        bindKey: a("Ctrl-K", "Command-G"),
                        exec: function(a) {
                            a.findNext();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "findprevious",
                        description: "Find previous",
                        bindKey: a("Ctrl-Shift-K", "Command-Shift-G"),
                        exec: function(a) {
                            a.findPrevious();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "selectOrFindNext",
                        description: "Select or find next",
                        bindKey: a("Alt-K", "Ctrl-G"),
                        exec: function(a) {
                            if (a.selection.isEmpty()) a.selection.selectWord();
                            else a.findNext();
                        },
                        readOnly: true
                    },
                    {
                        name: "selectOrFindPrevious",
                        description: "Select or find previous",
                        bindKey: a("Alt-Shift-K", "Ctrl-Shift-G"),
                        exec: function(a) {
                            if (a.selection.isEmpty()) a.selection.selectWord();
                            else a.findPrevious();
                        },
                        readOnly: true
                    },
                    {
                        name: "find",
                        description: "Find",
                        bindKey: a("Ctrl-F", "Command-F"),
                        exec: function(a) {
                            g.loadModule("ace/ext/searchbox", function(b) {
                                b.Search(a);
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "overwrite",
                        description: "Overwrite",
                        bindKey: "Insert",
                        exec: function(a) {
                            a.toggleOverwrite();
                        },
                        readOnly: true
                    },
                    {
                        name: "selecttostart",
                        description: "Select to start",
                        bindKey: a("Ctrl-Shift-Home", "Command-Shift-Home|Command-Shift-Up"),
                        exec: function(a) {
                            a.getSelection().selectFileStart();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "gotostart",
                        description: "Go to start",
                        bindKey: a("Ctrl-Home", "Command-Home|Command-Up"),
                        exec: function(a) {
                            a.navigateFileStart();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "selectup",
                        description: "Select up",
                        bindKey: a("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
                        exec: function(a) {
                            a.getSelection().selectUp();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "golineup",
                        description: "Go line up",
                        bindKey: a("Up", "Up|Ctrl-P"),
                        exec: function(a, b) {
                            a.navigateUp(b.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selecttoend",
                        description: "Select to end",
                        bindKey: a("Ctrl-Shift-End", "Command-Shift-End|Command-Shift-Down"),
                        exec: function(a) {
                            a.getSelection().selectFileEnd();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "gotoend",
                        description: "Go to end",
                        bindKey: a("Ctrl-End", "Command-End|Command-Down"),
                        exec: function(a) {
                            a.navigateFileEnd();
                        },
                        multiSelectAction: "forEach",
                        readOnly: true,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "selectdown",
                        description: "Select down",
                        bindKey: a("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
                        exec: function(a) {
                            a.getSelection().selectDown();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "golinedown",
                        description: "Go line down",
                        bindKey: a("Down", "Down|Ctrl-N"),
                        exec: function(a, b) {
                            a.navigateDown(b.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectwordleft",
                        description: "Select word left",
                        bindKey: a("Ctrl-Shift-Left", "Option-Shift-Left"),
                        exec: function(a) {
                            a.getSelection().selectWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotowordleft",
                        description: "Go to word left",
                        bindKey: a("Ctrl-Left", "Option-Left"),
                        exec: function(a) {
                            a.navigateWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selecttolinestart",
                        description: "Select to line start",
                        bindKey: a("Alt-Shift-Left", "Command-Shift-Left|Ctrl-Shift-A"),
                        exec: function(a) {
                            a.getSelection().selectLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotolinestart",
                        description: "Go to line start",
                        bindKey: a("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
                        exec: function(a) {
                            a.navigateLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectleft",
                        description: "Select left",
                        bindKey: a("Shift-Left", "Shift-Left|Ctrl-Shift-B"),
                        exec: function(a) {
                            a.getSelection().selectLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotoleft",
                        description: "Go to left",
                        bindKey: a("Left", "Left|Ctrl-B"),
                        exec: function(a, b) {
                            a.navigateLeft(b.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectwordright",
                        description: "Select word right",
                        bindKey: a("Ctrl-Shift-Right", "Option-Shift-Right"),
                        exec: function(a) {
                            a.getSelection().selectWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotowordright",
                        description: "Go to word right",
                        bindKey: a("Ctrl-Right", "Option-Right"),
                        exec: function(a) {
                            a.navigateWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selecttolineend",
                        description: "Select to line end",
                        bindKey: a("Alt-Shift-Right", "Command-Shift-Right|Shift-End|Ctrl-Shift-E"),
                        exec: function(a) {
                            a.getSelection().selectLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotolineend",
                        description: "Go to line end",
                        bindKey: a("Alt-Right|End", "Command-Right|End|Ctrl-E"),
                        exec: function(a) {
                            a.navigateLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectright",
                        description: "Select right",
                        bindKey: a("Shift-Right", "Shift-Right"),
                        exec: function(a) {
                            a.getSelection().selectRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "gotoright",
                        description: "Go to right",
                        bindKey: a("Right", "Right|Ctrl-F"),
                        exec: function(a, b) {
                            a.navigateRight(b.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectpagedown",
                        description: "Select page down",
                        bindKey: "Shift-PageDown",
                        exec: function(a) {
                            a.selectPageDown();
                        },
                        readOnly: true
                    },
                    {
                        name: "pagedown",
                        description: "Page down",
                        bindKey: a(null, "Option-PageDown"),
                        exec: function(a) {
                            a.scrollPageDown();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotopagedown",
                        description: "Go to page down",
                        bindKey: a("PageDown", "PageDown|Ctrl-V"),
                        exec: function(a) {
                            a.gotoPageDown();
                        },
                        readOnly: true
                    },
                    {
                        name: "selectpageup",
                        description: "Select page up",
                        bindKey: "Shift-PageUp",
                        exec: function(a) {
                            a.selectPageUp();
                        },
                        readOnly: true
                    },
                    {
                        name: "pageup",
                        description: "Page up",
                        bindKey: a(null, "Option-PageUp"),
                        exec: function(a) {
                            a.scrollPageUp();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotopageup",
                        description: "Go to page up",
                        bindKey: "PageUp",
                        exec: function(a) {
                            a.gotoPageUp();
                        },
                        readOnly: true
                    },
                    {
                        name: "scrollup",
                        description: "Scroll up",
                        bindKey: a("Ctrl-Up", null),
                        exec: function(a) {
                            a.renderer.scrollBy(0, -2 * a.renderer.layerConfig.lineHeight);
                        },
                        readOnly: true
                    },
                    {
                        name: "scrolldown",
                        description: "Scroll down",
                        bindKey: a("Ctrl-Down", null),
                        exec: function(a) {
                            a.renderer.scrollBy(0, 2 * a.renderer.layerConfig.lineHeight);
                        },
                        readOnly: true
                    },
                    {
                        name: "selectlinestart",
                        description: "Select line start",
                        bindKey: "Shift-Home",
                        exec: function(a) {
                            a.getSelection().selectLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "selectlineend",
                        description: "Select line end",
                        bindKey: "Shift-End",
                        exec: function(a) {
                            a.getSelection().selectLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "togglerecording",
                        description: "Toggle recording",
                        bindKey: a("Ctrl-Alt-E", "Command-Option-E"),
                        exec: function(a) {
                            a.commands.toggleRecording(a);
                        },
                        readOnly: true
                    },
                    {
                        name: "replaymacro",
                        description: "Replay macro",
                        bindKey: a("Ctrl-Shift-E", "Command-Shift-E"),
                        exec: function(a) {
                            a.commands.replay(a);
                        },
                        readOnly: true
                    },
                    {
                        name: "jumptomatching",
                        description: "Jump to matching",
                        bindKey: a("Ctrl-\\|Ctrl-P", "Command-\\"),
                        exec: function(a) {
                            a.jumpToMatching();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "selecttomatching",
                        description: "Select to matching",
                        bindKey: a("Ctrl-Shift-\\|Ctrl-Shift-P", "Command-Shift-\\"),
                        exec: function(a) {
                            a.jumpToMatching(true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "expandToMatching",
                        description: "Expand to matching",
                        bindKey: a("Ctrl-Shift-M", "Ctrl-Shift-M"),
                        exec: function(a) {
                            a.jumpToMatching(true, true);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "passKeysToBrowser",
                        description: "Pass keys to browser",
                        bindKey: a(null, null),
                        exec: function() {},
                        passEvent: true,
                        readOnly: true
                    },
                    {
                        name: "copy",
                        description: "Copy",
                        exec: function(a) {},
                        readOnly: true
                    },
                    {
                        name: "cut",
                        description: "Cut",
                        exec: function(a) {
                            var c = a.$copyWithEmptySelection && a.selection.isEmpty();
                            var b = c ? a.selection.getLineRange() : a.selection.getRange();
                            a._emit("cut", b);
                            if (!b.isEmpty()) a.session.remove(b);
                            a.clearSelection();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "paste",
                        description: "Paste",
                        exec: function(a, b) {
                            a.$handlePaste(b);
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removeline",
                        description: "Remove line",
                        bindKey: a("Ctrl-D", "Command-D"),
                        exec: function(a) {
                            a.removeLines();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "duplicateSelection",
                        description: "Duplicate selection",
                        bindKey: a("Ctrl-Shift-D", "Command-Shift-D"),
                        exec: function(a) {
                            a.duplicateSelection();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "sortlines",
                        description: "Sort lines",
                        bindKey: a("Ctrl-Alt-S", "Command-Alt-S"),
                        exec: function(a) {
                            a.sortLines();
                        },
                        scrollIntoView: "selection",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "togglecomment",
                        description: "Toggle comment",
                        bindKey: a("Ctrl-/", "Command-/"),
                        exec: function(a) {
                            a.toggleCommentLines();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "toggleBlockComment",
                        description: "Toggle block comment",
                        bindKey: a("Ctrl-Shift-/", "Command-Shift-/"),
                        exec: function(a) {
                            a.toggleBlockComment();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "modifyNumberUp",
                        description: "Modify number up",
                        bindKey: a("Ctrl-Shift-Up", "Alt-Shift-Up"),
                        exec: function(a) {
                            a.modifyNumber(1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "modifyNumberDown",
                        description: "Modify number down",
                        bindKey: a("Ctrl-Shift-Down", "Alt-Shift-Down"),
                        exec: function(a) {
                            a.modifyNumber(-1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "replace",
                        description: "Replace",
                        bindKey: a("Ctrl-H", "Command-Option-F"),
                        exec: function(a) {
                            g.loadModule("ace/ext/searchbox", function(b) {
                                b.Search(a, true);
                            });
                        }
                    },
                    {
                        name: "undo",
                        description: "Undo",
                        bindKey: a("Ctrl-Z", "Command-Z"),
                        exec: function(a) {
                            a.undo();
                        }
                    },
                    {
                        name: "redo",
                        description: "Redo",
                        bindKey: a("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
                        exec: function(a) {
                            a.redo();
                        }
                    },
                    {
                        name: "copylinesup",
                        description: "Copy lines up",
                        bindKey: a("Alt-Shift-Up", "Command-Option-Up"),
                        exec: function(a) {
                            a.copyLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesup",
                        description: "Move lines up",
                        bindKey: a("Alt-Up", "Option-Up"),
                        exec: function(a) {
                            a.moveLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "copylinesdown",
                        description: "Copy lines down",
                        bindKey: a("Alt-Shift-Down", "Command-Option-Down"),
                        exec: function(a) {
                            a.copyLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesdown",
                        description: "Move lines down",
                        bindKey: a("Alt-Down", "Option-Down"),
                        exec: function(a) {
                            a.moveLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "del",
                        description: "Delete",
                        bindKey: a("Delete", "Delete|Ctrl-D|Shift-Delete"),
                        exec: function(a) {
                            a.remove("right");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "backspace",
                        description: "Backspace",
                        bindKey: a("Shift-Backspace|Backspace", "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"),
                        exec: function(a) {
                            a.remove("left");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "cut_or_delete",
                        description: "Cut or delete",
                        bindKey: a("Shift-Delete", null),
                        exec: function(a) {
                            if (a.selection.isEmpty()) {
                                a.remove("left");
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
                        bindKey: a("Alt-Backspace", "Command-Backspace"),
                        exec: function(a) {
                            a.removeToLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolineend",
                        description: "Remove to line end",
                        bindKey: a("Alt-Delete", "Ctrl-K|Command-Delete"),
                        exec: function(a) {
                            a.removeToLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolinestarthard",
                        description: "Remove to line start hard",
                        bindKey: a("Ctrl-Shift-Backspace", null),
                        exec: function(a) {
                            var b = a.selection.getRange();
                            b.start.column = 0;
                            a.session.remove(b);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolineendhard",
                        description: "Remove to line end hard",
                        bindKey: a("Ctrl-Shift-Delete", null),
                        exec: function(a) {
                            var b = a.selection.getRange();
                            b.end.column = Number.MAX_VALUE;
                            a.session.remove(b);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removewordleft",
                        description: "Remove word left",
                        bindKey: a("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
                        exec: function(a) {
                            a.removeWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removewordright",
                        description: "Remove word right",
                        bindKey: a("Ctrl-Delete", "Alt-Delete"),
                        exec: function(a) {
                            a.removeWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "outdent",
                        description: "Outdent",
                        bindKey: a("Shift-Tab", "Shift-Tab"),
                        exec: function(a) {
                            a.blockOutdent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "indent",
                        description: "Indent",
                        bindKey: a("Tab", "Tab"),
                        exec: function(a) {
                            a.indent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockoutdent",
                        description: "Block outdent",
                        bindKey: a("Ctrl-[", "Ctrl-["),
                        exec: function(a) {
                            a.blockOutdent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockindent",
                        description: "Block indent",
                        bindKey: a("Ctrl-]", "Ctrl-]"),
                        exec: function(a) {
                            a.blockIndent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "insertstring",
                        description: "Insert string",
                        exec: function(a, b) {
                            a.insert(b);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "inserttext",
                        description: "Insert text",
                        exec: function(b, a) {
                            b.insert(f.stringRepeat(a.text || "", a.times || 1));
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "splitline",
                        description: "Split line",
                        bindKey: a(null, "Ctrl-O"),
                        exec: function(a) {
                            a.splitLine();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "transposeletters",
                        description: "Transpose letters",
                        bindKey: a("Alt-Shift-X", "Ctrl-T"),
                        exec: function(a) {
                            a.transposeLetters();
                        },
                        multiSelectAction: function(a) {
                            a.transposeSelections(1);
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "touppercase",
                        description: "To uppercase",
                        bindKey: a("Ctrl-U", "Ctrl-U"),
                        exec: function(a) {
                            a.toUpperCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "tolowercase",
                        description: "To lowercase",
                        bindKey: a("Ctrl-Shift-U", "Ctrl-Shift-U"),
                        exec: function(a) {
                            a.toLowerCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "autoindent",
                        description: "Auto Indent",
                        bindKey: a(null, null),
                        exec: function(a) {
                            a.autoIndent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "animate"
                    },
                    {
                        name: "expandtoline",
                        description: "Expand to line",
                        bindKey: a("Ctrl-Shift-L", "Command-Shift-L"),
                        exec: function(b) {
                            var a = b.selection.getRange();
                            a.start.column = a.end.column = 0;
                            a.end.row++;
                            b.selection.setRange(a, false);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "joinlines",
                        description: "Join lines",
                        bindKey: a(null, null),
                        exec: function(a) {
                            var j = a.selection.isBackwards();
                            var b = j ? a.selection.getSelectionLead() : a.selection.getSelectionAnchor();
                            var e = j ? a.selection.getSelectionAnchor() : a.selection.getSelectionLead();
                            var c = a.session.doc.getLine(b.row).length;
                            var l = a.session.doc.getTextRange(a.selection.getRange());
                            var k = l.replace(/\n\s*/, " ").length;
                            var g = a.session.doc.getLine(b.row);
                            for(var i = b.row + 1; i <= e.row + 1; i++){
                                var d = f.stringTrimLeft(f.stringTrimRight(a.session.doc.getLine(i)));
                                if (d.length !== 0) {
                                    d = " " + d;
                                }
                                g += d;
                            }
                            if (e.row + 1 < a.session.doc.getLength() - 1) {
                                g += a.session.doc.getNewLineCharacter();
                            }
                            a.clearSelection();
                            a.session.doc.replace(new h(b.row, 0, e.row + 2, 0), g);
                            if (k > 0) {
                                a.selection.moveCursorTo(b.row, b.column);
                                a.selection.selectTo(b.row, b.column + k);
                            } else {
                                c = a.session.doc.getLine(b.row).length > c ? c + 1 : c;
                                a.selection.moveCursorTo(b.row, c);
                            }
                        },
                        multiSelectAction: "forEach",
                        readOnly: true
                    },
                    {
                        name: "invertSelection",
                        description: "Invert selection",
                        bindKey: a(null, null),
                        exec: function(c) {
                            var e = c.session.doc.getLength() - 1;
                            var f = c.session.doc.getLine(e).length;
                            var b = c.selection.rangeList.ranges;
                            var d = [];
                            if (b.length < 1) {
                                b = [
                                    c.selection.getRange()
                                ];
                            }
                            for(var a = 0; a < b.length; a++){
                                if (a == b.length - 1) {
                                    if (!(b[a].end.row === e && b[a].end.column === f)) {
                                        d.push(new h(b[a].end.row, b[a].end.column, e, f));
                                    }
                                }
                                if (a === 0) {
                                    if (!(b[a].start.row === 0 && b[a].start.column === 0)) {
                                        d.push(new h(0, 0, b[a].start.row, b[a].start.column));
                                    }
                                } else {
                                    d.push(new h(b[a - 1].end.row, b[a - 1].end.column, b[a].start.row, b[a].start.column));
                                }
                            }
                            c.exitMultiSelectMode();
                            c.clearSelection();
                            for(var a = 0; a < d.length; a++){
                                c.selection.addRange(d[a], false);
                            }
                        },
                        readOnly: true,
                        scrollIntoView: "none"
                    },
                    {
                        name: "addLineAfter",
                        description: "Add new line after the current line",
                        exec: function(a) {
                            a.selection.clearSelection();
                            a.navigateLineEnd();
                            a.insert("\n");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "addLineBefore",
                        description: "Add new line before the current line",
                        exec: function(a) {
                            a.selection.clearSelection();
                            var b = a.getCursorPosition();
                            a.selection.moveTo(b.row - 1, Number.MAX_VALUE);
                            a.insert("\n");
                            if (b.row === 0) a.navigateUp();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "openCommandPallete",
                        description: "Open command pallete",
                        bindKey: a("F1", "F1"),
                        exec: function(a) {
                            a.prompt({
                                $type: "commands"
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "modeSelect",
                        description: "Change language mode...",
                        bindKey: a(null, null),
                        exec: function(a) {
                            a.prompt({
                                $type: "modes"
                            });
                        },
                        readOnly: true
                    }, 
                ];
                for(var b = 1; b < 9; b++){
                    d.commands.push({
                        name: "foldToLevel" + b,
                        description: "Fold To Level " + b,
                        level: b,
                        exec: function(a) {
                            a.session.foldToLevel(this.level);
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
            ], function(a, c, e) {
                "use strict";
                a("./lib/fixoldbrowsers");
                var f = a("./lib/oop");
                var g = a("./lib/dom");
                var h = a("./lib/lang");
                var i = a("./lib/useragent");
                var j = a("./keyboard/textinput").TextInput;
                var k = a("./mouse/mouse_handler").MouseHandler;
                var l = a("./mouse/fold_handler").FoldHandler;
                var m = a("./keyboard/keybinding").KeyBinding;
                var n = a("./edit_session").EditSession;
                var o = a("./search").Search;
                var p = a("./range").Range;
                var q = a("./lib/event_emitter").EventEmitter;
                var r = a("./commands/command_manager").CommandManager;
                var s = a("./commands/default_commands").commands;
                var d = a("./config");
                var t = a("./token_iterator").TokenIterator;
                var u = a("./clipboard");
                var b = function(c, e, a) {
                    this.$toDestroy = [];
                    var f = c.getContainerElement();
                    this.container = f;
                    this.renderer = c;
                    this.id = "editor" + ++b.$uid;
                    this.commands = new r(i.isMac ? "mac" : "win", s);
                    if (typeof document == "object") {
                        this.textInput = new j(c.getTextAreaContainer(), this);
                        this.renderer.textarea = this.textInput.getElement();
                        this.$mouseHandler = new k(this);
                        new l(this);
                    }
                    this.keyBinding = new m(this);
                    this.$search = new o().set({
                        wrap: true
                    });
                    this.$historyTracker = this.$historyTracker.bind(this);
                    this.commands.on("exec", this.$historyTracker);
                    this.$initOperationListeners();
                    this._$emitInputEvent = h.delayedCall(function() {
                        this._signal("input", {});
                        if (this.session && this.session.bgTokenizer) this.session.bgTokenizer.scheduleStart();
                    }.bind(this));
                    this.on("change", function(b, a) {
                        a._$emitInputEvent.schedule(31);
                    });
                    this.setSession(e || (a && a.session) || new n(""));
                    d.resetOptions(this);
                    if (a) this.setOptions(a);
                    d._signal("editor", this);
                };
                b.$uid = 0;
                (function() {
                    f.implement(this, q);
                    this.$initOperationListeners = function() {
                        this.commands.on("exec", this.startOperation.bind(this), true);
                        this.commands.on("afterExec", this.endOperation.bind(this), true);
                        this.$opResetTimer = h.delayedCall(this.endOperation.bind(this, true));
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
                    this.startOperation = function(a) {
                        if (this.curOp) {
                            if (!a || this.curOp.command) return;
                            this.prevOp = this.curOp;
                        }
                        if (!a) {
                            this.previousCommand = null;
                            a = {};
                        }
                        this.$opResetTimer.schedule();
                        this.curOp = this.session.curOp = {
                            command: a.command || {},
                            args: a.args,
                            scrollTop: this.renderer.scrollTop
                        };
                        this.curOp.selectionBefore = this.selection.toJSON();
                    };
                    this.endOperation = function(b) {
                        if (this.curOp && this.session) {
                            if ((b && b.returnValue === false) || !this.session) return (this.curOp = null);
                            if (b == true && this.curOp.command && this.curOp.command.name == "mouse") return;
                            this._signal("beforeEndOperation");
                            if (!this.curOp) return;
                            var c = this.curOp.command;
                            var a = c && c.scrollIntoView;
                            if (a) {
                                switch(a){
                                    case "center-animate":
                                        a = "animate";
                                    case "center":
                                        this.renderer.scrollCursorIntoView(null, 0.5);
                                        break;
                                    case "animate":
                                    case "cursor":
                                        this.renderer.scrollCursorIntoView();
                                        break;
                                    case "selectionPart":
                                        var d = this.selection.getRange();
                                        var e = this.renderer.layerConfig;
                                        if (d.start.row >= e.lastRow || d.end.row <= e.firstRow) {
                                            this.renderer.scrollSelectionIntoView(this.selection.anchor, this.selection.lead);
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                if (a == "animate") this.renderer.animateScrolling(this.curOp.scrollTop);
                            }
                            var f = this.selection.toJSON();
                            this.curOp.selectionAfter = f;
                            this.$lastSel = this.selection.toJSON();
                            this.session.getUndoManager().addSelection(f);
                            this.prevOp = this.curOp;
                            this.curOp = null;
                        }
                    };
                    this.$mergeableCommands = [
                        "backspace",
                        "del",
                        "insertstring", 
                    ];
                    this.$historyTracker = function(b) {
                        if (!this.$mergeUndoDeltas) return;
                        var c = this.prevOp;
                        var d = this.$mergeableCommands;
                        var a = c.command && b.command.name == c.command.name;
                        if (b.command.name == "insertstring") {
                            var e = b.args;
                            if (this.mergeNextCommand === undefined) this.mergeNextCommand = true;
                            a = a && this.mergeNextCommand && (!/\s/.test(e) || /\s/.test(c.args));
                            this.mergeNextCommand = true;
                        } else {
                            a = a && d.indexOf(b.command.name) !== -1;
                        }
                        if (this.$mergeUndoDeltas != "always" && Date.now() - this.sequenceStartTime > 2000) {
                            a = false;
                        }
                        if (a) this.session.mergeUndoDeltas = true;
                        else if (d.indexOf(b.command.name) !== -1) this.sequenceStartTime = Date.now();
                    };
                    this.setKeyboardHandler = function(a, b) {
                        if (a && typeof a === "string" && a != "ace") {
                            this.$keybindingId = a;
                            var c = this;
                            d.loadModule([
                                "keybinding",
                                a
                            ], function(d) {
                                if (c.$keybindingId == a) c.keyBinding.setKeyboardHandler(d && d.handler);
                                b && b();
                            });
                        } else {
                            this.$keybindingId = null;
                            this.keyBinding.setKeyboardHandler(a);
                            b && b();
                        }
                    };
                    this.getKeyboardHandler = function() {
                        return this.keyBinding.getKeyboardHandler();
                    };
                    this.setSession = function(a) {
                        if (this.session == a) return;
                        if (this.curOp) this.endOperation();
                        this.curOp = {};
                        var b = this.session;
                        if (b) {
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
                            var c = this.session.getSelection();
                            c.off("changeCursor", this.$onCursorChange);
                            c.off("changeSelection", this.$onSelectionChange);
                        }
                        this.session = a;
                        if (a) {
                            this.$onDocumentChange = this.onDocumentChange.bind(this);
                            a.on("change", this.$onDocumentChange);
                            this.renderer.setSession(a);
                            this.$onChangeMode = this.onChangeMode.bind(this);
                            a.on("changeMode", this.$onChangeMode);
                            this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
                            a.on("tokenizerUpdate", this.$onTokenizerUpdate);
                            this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
                            a.on("changeTabSize", this.$onChangeTabSize);
                            this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
                            a.on("changeWrapLimit", this.$onChangeWrapLimit);
                            this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
                            a.on("changeWrapMode", this.$onChangeWrapMode);
                            this.$onChangeFold = this.onChangeFold.bind(this);
                            a.on("changeFold", this.$onChangeFold);
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
                            this.selection = a.getSelection();
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
                            this.renderer.setSession(a);
                        }
                        this._signal("changeSession", {
                            session: a,
                            oldSession: b
                        });
                        this.curOp = null;
                        b && b._signal("changeEditor", {
                            oldEditor: this
                        });
                        a && a._signal("changeEditor", {
                            editor: this
                        });
                        if (a && a.bgTokenizer) a.bgTokenizer.scheduleStart();
                    };
                    this.getSession = function() {
                        return this.session;
                    };
                    this.setValue = function(b, a) {
                        this.session.doc.setValue(b);
                        if (!a) this.selectAll();
                        else if (a == 1) this.navigateFileEnd();
                        else if (a == -1) this.navigateFileStart();
                        return b;
                    };
                    this.getValue = function() {
                        return this.session.getValue();
                    };
                    this.getSelection = function() {
                        return this.selection;
                    };
                    this.resize = function(a) {
                        this.renderer.onResize(a);
                    };
                    this.setTheme = function(a, b) {
                        this.renderer.setTheme(a, b);
                    };
                    this.getTheme = function() {
                        return this.renderer.getTheme();
                    };
                    this.setStyle = function(a) {
                        this.renderer.setStyle(a);
                    };
                    this.unsetStyle = function(a) {
                        this.renderer.unsetStyle(a);
                    };
                    this.getFontSize = function() {
                        return (this.getOption("fontSize") || g.computedStyle(this.container).fontSize);
                    };
                    this.setFontSize = function(a) {
                        this.setOption("fontSize", a);
                    };
                    this.$highlightBrackets = function() {
                        if (this.$highlightPending) {
                            return;
                        }
                        var a = this;
                        this.$highlightPending = true;
                        setTimeout(function() {
                            a.$highlightPending = false;
                            var c = a.session;
                            if (!c || !c.bgTokenizer) return;
                            if (c.$bracketHighlight) {
                                c.$bracketHighlight.markerIds.forEach(function(a) {
                                    c.removeMarker(a);
                                });
                                c.$bracketHighlight = null;
                            }
                            var b = c.getMatchingBracketRanges(a.getCursorPosition());
                            if (!b && c.$mode.getMatching) b = c.$mode.getMatching(a.session);
                            if (!b) return;
                            var d = "ace_bracket";
                            if (!Array.isArray(b)) {
                                b = [
                                    b
                                ];
                            } else if (b.length == 1) {
                                d = "ace_error_bracket";
                            }
                            if (b.length == 2) {
                                if (p.comparePoints(b[0].end, b[1].start) == 0) b = [
                                    p.fromPoints(b[0].start, b[1].end), 
                                ];
                                else if (p.comparePoints(b[0].start, b[1].end) == 0) b = [
                                    p.fromPoints(b[1].start, b[0].end), 
                                ];
                            }
                            c.$bracketHighlight = {
                                ranges: b,
                                markerIds: b.map(function(a) {
                                    return c.addMarker(a, d, "text");
                                })
                            };
                        }, 50);
                    };
                    this.$highlightTags = function() {
                        if (this.$highlightTagPending) return;
                        var a = this;
                        this.$highlightTagPending = true;
                        setTimeout(function() {
                            a.$highlightTagPending = false;
                            var c = a.session;
                            if (!c || !c.bgTokenizer) return;
                            var j = a.getCursorPosition();
                            var d = new t(a.session, j.row, j.column);
                            var b = d.getCurrentToken();
                            if (!b || !/\b(?:tag-open|tag-name)/.test(b.type)) {
                                c.removeMarker(c.$tagHighlight);
                                c.$tagHighlight = null;
                                return;
                            }
                            if (b.type.indexOf("tag-open") !== -1) {
                                b = d.stepForward();
                                if (!b) return;
                            }
                            var h = b.value;
                            var i = b.value;
                            var f = 0;
                            var e = d.stepBackward();
                            if (e.value === "<") {
                                do {
                                    e = b;
                                    b = d.stepForward();
                                    if (b) {
                                        if (b.type.indexOf("tag-name") !== -1) {
                                            i = b.value;
                                            if (h === i) {
                                                if (e.value === "<") {
                                                    f++;
                                                } else if (e.value === "</") {
                                                    f--;
                                                }
                                            }
                                        } else if (h === i && b.value === "/>") {
                                            f--;
                                        }
                                    }
                                }while (b && f >= 0)
                            } else {
                                do {
                                    b = e;
                                    e = d.stepBackward();
                                    if (b) {
                                        if (b.type.indexOf("tag-name") !== -1) {
                                            if (h === b.value) {
                                                if (e.value === "<") {
                                                    f++;
                                                } else if (e.value === "</") {
                                                    f--;
                                                }
                                            }
                                        } else if (b.value === "/>") {
                                            var k = 0;
                                            var g = e;
                                            while(g){
                                                if (g.type.indexOf("tag-name") !== -1 && g.value === h) {
                                                    f--;
                                                    break;
                                                } else if (g.value === "<") {
                                                    break;
                                                }
                                                g = d.stepBackward();
                                                k++;
                                            }
                                            for(var l = 0; l < k; l++){
                                                d.stepForward();
                                            }
                                        }
                                    }
                                }while (e && f <= 0)
                                d.stepForward();
                            }
                            if (!b) {
                                c.removeMarker(c.$tagHighlight);
                                c.$tagHighlight = null;
                                return;
                            }
                            var m = d.getCurrentTokenRow();
                            var n = d.getCurrentTokenColumn();
                            var o = new p(m, n, m, n + b.value.length);
                            var q = c.$backMarkers[c.$tagHighlight];
                            if (c.$tagHighlight && q != undefined && o.compareRange(q.range) !== 0) {
                                c.removeMarker(c.$tagHighlight);
                                c.$tagHighlight = null;
                            }
                            if (!c.$tagHighlight) c.$tagHighlight = c.addMarker(o, "ace_bracket", "text");
                        }, 50);
                    };
                    this.focus = function() {
                        var a = this;
                        setTimeout(function() {
                            if (!a.isFocused()) a.textInput.focus();
                        });
                        this.textInput.focus();
                    };
                    this.isFocused = function() {
                        return this.textInput.isFocused();
                    };
                    this.blur = function() {
                        this.textInput.blur();
                    };
                    this.onFocus = function(a) {
                        if (this.$isFocused) return;
                        this.$isFocused = true;
                        this.renderer.showCursor();
                        this.renderer.visualizeFocus();
                        this._emit("focus", a);
                    };
                    this.onBlur = function(a) {
                        if (!this.$isFocused) return;
                        this.$isFocused = false;
                        this.renderer.hideCursor();
                        this.renderer.visualizeBlur();
                        this._emit("blur", a);
                    };
                    this.$cursorChange = function() {
                        this.renderer.updateCursor();
                        this.$highlightBrackets();
                        this.$highlightTags();
                        this.$updateHighlightActiveLine();
                    };
                    this.onDocumentChange = function(a) {
                        var b = this.session.$useWrapMode;
                        var c = a.start.row == a.end.row ? a.end.row : Infinity;
                        this.renderer.updateLines(a.start.row, c, b);
                        this._signal("change", a);
                        this.$cursorChange();
                    };
                    this.onTokenizerUpdate = function(b) {
                        var a = b.data;
                        this.renderer.updateLines(a.first, a.last);
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
                        var b = this.getSession();
                        var a;
                        if (this.$highlightActiveLine) {
                            if (this.$selectionStyle != "line" || !this.selection.isMultiLine()) a = this.getCursorPosition();
                            if (this.renderer.theme && this.renderer.theme.$selectionColorConflict && !this.selection.isEmpty()) a = false;
                            if (this.renderer.$maxLines && this.session.getLength() === 1 && !(this.renderer.$minLines > 1)) a = false;
                        }
                        if (b.$highlightLineMarker && !a) {
                            b.removeMarker(b.$highlightLineMarker.id);
                            b.$highlightLineMarker = null;
                        } else if (!b.$highlightLineMarker && a) {
                            var c = new p(a.row, a.column, a.row, Infinity);
                            c.id = b.addMarker(c, "ace_active-line", "screenLine");
                            b.$highlightLineMarker = c;
                        } else if (a) {
                            b.$highlightLineMarker.start.row = a.row;
                            b.$highlightLineMarker.end.row = a.row;
                            b.$highlightLineMarker.start.column = a.column;
                            b._signal("changeBackMarker");
                        }
                    };
                    this.onSelectionChange = function(e) {
                        var a = this.session;
                        if (a.$selectionMarker) {
                            a.removeMarker(a.$selectionMarker);
                        }
                        a.$selectionMarker = null;
                        if (!this.selection.isEmpty()) {
                            var b = this.selection.getRange();
                            var c = this.getSelectionStyle();
                            a.$selectionMarker = a.addMarker(b, "ace_selection", c);
                        } else {
                            this.$updateHighlightActiveLine();
                        }
                        var d = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
                        this.session.highlight(d);
                        this._signal("changeSelection");
                    };
                    this.$getSelectionHighLightRegexp = function() {
                        var g = this.session;
                        var a = this.getSelectionRange();
                        if (a.isEmpty() || a.isMultiLine()) return;
                        var c = a.start.column;
                        var d = a.end.column;
                        var e = g.getLine(a.start.row);
                        var b = e.substring(c, d);
                        if (b.length > 5000 || !/[\w\d]/.test(b)) return;
                        var f = this.$search.$assembleRegExp({
                            wholeWord: true,
                            caseSensitive: true,
                            needle: b
                        });
                        var h = e.substring(c - 1, d + 1);
                        if (!f.test(h)) return;
                        return f;
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
                    this.onChangeMode = function(a) {
                        this.renderer.updateText();
                        this._emit("changeMode", a);
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
                        var b = this.getSelectedText();
                        var g = this.session.doc.getNewLineCharacter();
                        var e = false;
                        if (!b && this.$copyWithEmptySelection) {
                            e = true;
                            var c = this.selection.getAllRanges();
                            for(var a = 0; a < c.length; a++){
                                var f = c[a];
                                if (a && c[a - 1].start.row == f.start.row) continue;
                                b += this.session.getLine(f.start.row) + g;
                            }
                        }
                        var d = {
                            text: b
                        };
                        this._signal("copy", d);
                        u.lineMode = e ? d.text : false;
                        return d.text;
                    };
                    this.onCopy = function() {
                        this.commands.exec("copy", this);
                    };
                    this.onCut = function() {
                        this.commands.exec("cut", this);
                    };
                    this.onPaste = function(a, b) {
                        var c = {
                            text: a,
                            event: b
                        };
                        this.commands.exec("paste", this, c);
                    };
                    this.$handlePaste = function(a) {
                        if (typeof a == "string") a = {
                            text: a
                        };
                        this._signal("paste", a);
                        var b = a.text;
                        var h = b === u.lineMode;
                        var d = this.session;
                        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) {
                            if (h) d.insert({
                                row: this.selection.lead.row,
                                column: 0
                            }, b);
                            else this.insert(b);
                        } else if (h) {
                            this.selection.rangeList.ranges.forEach(function(a) {
                                d.insert({
                                    row: a.start.row,
                                    column: 0
                                }, b);
                            });
                        } else {
                            var c = b.split(/\r\n|\r|\n/);
                            var e = this.selection.rangeList.ranges;
                            var i = c.length == 2 && (!c[0] || !c[1]);
                            if (c.length != e.length || i) return this.commands.exec("insertstring", this, b);
                            for(var f = e.length; f--;){
                                var g = e[f];
                                if (!g.isEmpty()) d.remove(g);
                                d.insert(g.start, c[f]);
                            }
                        }
                    };
                    this.execCommand = function(a, b) {
                        return this.commands.exec(a, this, b);
                    };
                    this.insert = function(b, j) {
                        var c = this.session;
                        var f = c.getMode();
                        var a = this.getCursorPosition();
                        if (this.getBehavioursEnabled() && !j) {
                            var d = f.transformAction(c.getState(a.row), "insertion", this, c, b);
                            if (d) {
                                if (b !== d.text) {
                                    if (!this.inVirtualSelectionMode) {
                                        this.session.mergeUndoDeltas = false;
                                        this.mergeNextCommand = false;
                                    }
                                }
                                b = d.text;
                            }
                        }
                        if (b == "\t") b = this.session.getTabString();
                        if (!this.selection.isEmpty()) {
                            var g = this.getSelectionRange();
                            a = this.session.remove(g);
                            this.clearSelection();
                        } else if (this.session.getOverwrite() && b.indexOf("\n") == -1) {
                            var g = new p.fromPoints(a, a);
                            g.end.column += b.length;
                            this.session.remove(g);
                        }
                        if (b == "\n" || b == "\r\n") {
                            var e = c.getLine(a.row);
                            if (a.column > e.search(/\S|$/)) {
                                var k = e.substr(a.column).search(/\S|$/);
                                c.doc.removeInLine(a.row, a.column, a.column + k);
                            }
                        }
                        this.clearSelection();
                        var i = a.column;
                        var h = c.getState(a.row);
                        var e = c.getLine(a.row);
                        var l = f.checkOutdent(h, e, b);
                        c.insert(a, b);
                        if (d && d.selection) {
                            if (d.selection.length == 2) {
                                this.selection.setSelectionRange(new p(a.row, i + d.selection[0], a.row, i + d.selection[1]));
                            } else {
                                this.selection.setSelectionRange(new p(a.row + d.selection[0], d.selection[1], a.row + d.selection[2], d.selection[3]));
                            }
                        }
                        if (this.$enableAutoIndent) {
                            if (c.getDocument().isNewLine(b)) {
                                var m = f.getNextLineIndent(h, e.slice(0, a.column), c.getTabString());
                                c.insert({
                                    row: a.row + 1,
                                    column: 0
                                }, m);
                            }
                            if (l) f.autoOutdent(h, c, a.row);
                        }
                    };
                    this.autoIndent = function() {
                        var b = this.session;
                        var e = b.getMode();
                        var f, g;
                        if (this.selection.isEmpty()) {
                            f = 0;
                            g = b.doc.getLength() - 1;
                        } else {
                            var i = this.getSelectionRange();
                            f = i.start.row;
                            g = i.end.row;
                        }
                        var h = "";
                        var j = "";
                        var c = "";
                        var k, d, l;
                        var m = b.getTabString();
                        for(var a = f; a <= g; a++){
                            if (a > 0) {
                                h = b.getState(a - 1);
                                j = b.getLine(a - 1);
                                c = e.getNextLineIndent(h, j, m);
                            }
                            k = b.getLine(a);
                            d = e.$getIndent(k);
                            if (c !== d) {
                                if (d.length > 0) {
                                    l = new p(a, 0, a, d.length);
                                    b.remove(l);
                                }
                                if (c.length > 0) {
                                    b.insert({
                                        row: a,
                                        column: 0
                                    }, c);
                                }
                            }
                            e.autoOutdent(h, b, a);
                        }
                    };
                    this.onTextInput = function(a, b) {
                        if (!b) return this.keyBinding.onTextInput(a);
                        this.startOperation({
                            command: {
                                name: "insertstring"
                            }
                        });
                        var c = this.applyComposition.bind(this, a, b);
                        if (this.selection.rangeCount) this.forEachSelection(c);
                        else c();
                        this.endOperation();
                    };
                    this.applyComposition = function(c, b) {
                        if (b.extendLeft || b.extendRight) {
                            var a = this.selection.getRange();
                            a.start.column -= b.extendLeft;
                            a.end.column += b.extendRight;
                            if (a.start.column < 0) {
                                a.start.row--;
                                a.start.column += this.session.getLine(a.start.row).length + 1;
                            }
                            this.selection.setRange(a);
                            if (!c && !a.isEmpty()) this.remove();
                        }
                        if (c || !this.selection.isEmpty()) this.insert(c, true);
                        if (b.restoreStart || b.restoreEnd) {
                            var a = this.selection.getRange();
                            a.start.column -= b.restoreStart;
                            a.end.column -= b.restoreEnd;
                            this.selection.setRange(a);
                        }
                    };
                    this.onCommandKey = function(a, b, c) {
                        return this.keyBinding.onCommandKey(a, b, c);
                    };
                    this.setOverwrite = function(a) {
                        this.session.setOverwrite(a);
                    };
                    this.getOverwrite = function() {
                        return this.session.getOverwrite();
                    };
                    this.toggleOverwrite = function() {
                        this.session.toggleOverwrite();
                    };
                    this.setScrollSpeed = function(a) {
                        this.setOption("scrollSpeed", a);
                    };
                    this.getScrollSpeed = function() {
                        return this.getOption("scrollSpeed");
                    };
                    this.setDragDelay = function(a) {
                        this.setOption("dragDelay", a);
                    };
                    this.getDragDelay = function() {
                        return this.getOption("dragDelay");
                    };
                    this.setSelectionStyle = function(a) {
                        this.setOption("selectionStyle", a);
                    };
                    this.getSelectionStyle = function() {
                        return this.getOption("selectionStyle");
                    };
                    this.setHighlightActiveLine = function(a) {
                        this.setOption("highlightActiveLine", a);
                    };
                    this.getHighlightActiveLine = function() {
                        return this.getOption("highlightActiveLine");
                    };
                    this.setHighlightGutterLine = function(a) {
                        this.setOption("highlightGutterLine", a);
                    };
                    this.getHighlightGutterLine = function() {
                        return this.getOption("highlightGutterLine");
                    };
                    this.setHighlightSelectedWord = function(a) {
                        this.setOption("highlightSelectedWord", a);
                    };
                    this.getHighlightSelectedWord = function() {
                        return this.$highlightSelectedWord;
                    };
                    this.setAnimatedScroll = function(a) {
                        this.renderer.setAnimatedScroll(a);
                    };
                    this.getAnimatedScroll = function() {
                        return this.renderer.getAnimatedScroll();
                    };
                    this.setShowInvisibles = function(a) {
                        this.renderer.setShowInvisibles(a);
                    };
                    this.getShowInvisibles = function() {
                        return this.renderer.getShowInvisibles();
                    };
                    this.setDisplayIndentGuides = function(a) {
                        this.renderer.setDisplayIndentGuides(a);
                    };
                    this.getDisplayIndentGuides = function() {
                        return this.renderer.getDisplayIndentGuides();
                    };
                    this.setShowPrintMargin = function(a) {
                        this.renderer.setShowPrintMargin(a);
                    };
                    this.getShowPrintMargin = function() {
                        return this.renderer.getShowPrintMargin();
                    };
                    this.setPrintMarginColumn = function(a) {
                        this.renderer.setPrintMarginColumn(a);
                    };
                    this.getPrintMarginColumn = function() {
                        return this.renderer.getPrintMarginColumn();
                    };
                    this.setReadOnly = function(a) {
                        this.setOption("readOnly", a);
                    };
                    this.getReadOnly = function() {
                        return this.getOption("readOnly");
                    };
                    this.setBehavioursEnabled = function(a) {
                        this.setOption("behavioursEnabled", a);
                    };
                    this.getBehavioursEnabled = function() {
                        return this.getOption("behavioursEnabled");
                    };
                    this.setWrapBehavioursEnabled = function(a) {
                        this.setOption("wrapBehavioursEnabled", a);
                    };
                    this.getWrapBehavioursEnabled = function() {
                        return this.getOption("wrapBehavioursEnabled");
                    };
                    this.setShowFoldWidgets = function(a) {
                        this.setOption("showFoldWidgets", a);
                    };
                    this.getShowFoldWidgets = function() {
                        return this.getOption("showFoldWidgets");
                    };
                    this.setFadeFoldWidgets = function(a) {
                        this.setOption("fadeFoldWidgets", a);
                    };
                    this.getFadeFoldWidgets = function() {
                        return this.getOption("fadeFoldWidgets");
                    };
                    this.remove = function(f) {
                        if (this.selection.isEmpty()) {
                            if (f == "left") this.selection.selectLeft();
                            else this.selection.selectRight();
                        }
                        var a = this.getSelectionRange();
                        if (this.getBehavioursEnabled()) {
                            var b = this.session;
                            var g = b.getState(a.start.row);
                            var c = b.getMode().transformAction(g, "deletion", this, b, a);
                            if (a.end.column === 0) {
                                var d = b.getTextRange(a);
                                if (d[d.length - 1] == "\n") {
                                    var e = b.getLine(a.end.row);
                                    if (/^\s+$/.test(e)) {
                                        a.end.column = e.length;
                                    }
                                }
                            }
                            if (c) a = c;
                        }
                        this.session.remove(a);
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
                        var a = this.getSelectionRange();
                        if (a.start.column == a.end.column && a.start.row == a.end.row) {
                            a.end.column = 0;
                            a.end.row++;
                        }
                        this.session.remove(a);
                        this.clearSelection();
                    };
                    this.splitLine = function() {
                        if (!this.selection.isEmpty()) {
                            this.session.remove(this.getSelectionRange());
                            this.clearSelection();
                        }
                        var a = this.getCursorPosition();
                        this.insert("\n");
                        this.moveCursorToPosition(a);
                    };
                    this.transposeLetters = function() {
                        if (!this.selection.isEmpty()) {
                            return;
                        }
                        var b = this.getCursorPosition();
                        var a = b.column;
                        if (a === 0) return;
                        var c = this.session.getLine(b.row);
                        var e, d;
                        if (a < c.length) {
                            e = c.charAt(a) + c.charAt(a - 1);
                            d = new p(b.row, a - 1, b.row, a + 1);
                        } else {
                            e = c.charAt(a - 1) + c.charAt(a - 2);
                            d = new p(b.row, a - 2, b.row, a);
                        }
                        this.session.replace(d, e);
                        this.session.selection.moveToPosition(d.end);
                    };
                    this.toLowerCase = function() {
                        var b = this.getSelectionRange();
                        if (this.selection.isEmpty()) {
                            this.selection.selectWord();
                        }
                        var a = this.getSelectionRange();
                        var c = this.session.getTextRange(a);
                        this.session.replace(a, c.toLowerCase());
                        this.selection.setSelectionRange(b);
                    };
                    this.toUpperCase = function() {
                        var b = this.getSelectionRange();
                        if (this.selection.isEmpty()) {
                            this.selection.selectWord();
                        }
                        var a = this.getSelectionRange();
                        var c = this.session.getTextRange(a);
                        this.session.replace(a, c.toUpperCase());
                        this.selection.setSelectionRange(b);
                    };
                    this.indent = function() {
                        var b = this.session;
                        var a = this.getSelectionRange();
                        if (a.start.row < a.end.row) {
                            var c = this.$getSelectedRows();
                            b.indentRows(c.first, c.last, "\t");
                            return;
                        } else if (a.start.column < a.end.column) {
                            var j = b.getTextRange(a);
                            if (!/^\s+$/.test(j)) {
                                var c = this.$getSelectedRows();
                                b.indentRows(c.first, c.last, "\t");
                                return;
                            }
                        }
                        var k = b.getLine(a.start.row);
                        var f = a.start;
                        var e = b.getTabSize();
                        var g = b.documentToScreenColumn(f.row, f.column);
                        if (this.session.getUseSoftTabs()) {
                            var d = e - (g % e);
                            var i = h.stringRepeat(" ", d);
                        } else {
                            var d = g % e;
                            while(k[a.start.column - 1] == " " && d){
                                a.start.column--;
                                d--;
                            }
                            this.selection.setSelectionRange(a);
                            i = "\t";
                        }
                        return this.insert(i);
                    };
                    this.blockIndent = function() {
                        var a = this.$getSelectedRows();
                        this.session.indentRows(a.first, a.last, "\t");
                    };
                    this.blockOutdent = function() {
                        var a = this.session.getSelection();
                        this.session.outdentRows(a.getRange());
                    };
                    this.sortLines = function() {
                        var b = this.$getSelectedRows();
                        var d = this.session;
                        var e = [];
                        for(var a = b.first; a <= b.last; a++)e.push(d.getLine(a));
                        e.sort(function(a, b) {
                            if (a.toLowerCase() < b.toLowerCase()) return -1;
                            if (a.toLowerCase() > b.toLowerCase()) return 1;
                            return 0;
                        });
                        var c = new p(0, 0, 0, 0);
                        for(var a = b.first; a <= b.last; a++){
                            var f = d.getLine(a);
                            c.start.row = a;
                            c.end.row = a;
                            c.end.column = f.length;
                            d.replace(c, e[a - b.first]);
                        }
                    };
                    this.toggleCommentLines = function() {
                        var b = this.session.getState(this.getCursorPosition().row);
                        var a = this.$getSelectedRows();
                        this.session.getMode().toggleCommentLines(b, this.session, a.first, a.last);
                    };
                    this.toggleBlockComment = function() {
                        var a = this.getCursorPosition();
                        var b = this.session.getState(a.row);
                        var c = this.getSelectionRange();
                        this.session.getMode().toggleBlockComment(b, this.session, c, a);
                    };
                    this.getNumberAt = function(d, b) {
                        var c = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
                        c.lastIndex = 0;
                        var e = this.session.getLine(d);
                        while(c.lastIndex < b){
                            var a = c.exec(e);
                            if (a.index <= b && a.index + a[0].length >= b) {
                                var f = {
                                    value: a[0],
                                    start: a.index,
                                    end: a.index + a[0].length
                                };
                                return f;
                            }
                        }
                        return null;
                    };
                    this.modifyNumber = function(e) {
                        var c = this.selection.getCursor().row;
                        var b = this.selection.getCursor().column;
                        var j = new p(c, b - 1, c, b);
                        var h = this.session.getTextRange(j);
                        if (!isNaN(parseFloat(h)) && isFinite(h)) {
                            var a = this.getNumberAt(c, b);
                            if (a) {
                                var f = a.value.indexOf(".") >= 0 ? a.start + a.value.indexOf(".") + 1 : a.end;
                                var g = a.start + a.value.length - f;
                                var d = parseFloat(a.value);
                                d *= Math.pow(10, g);
                                if (f !== a.end && b < f) {
                                    e *= Math.pow(10, a.end - b - 1);
                                } else {
                                    e *= Math.pow(10, a.end - b);
                                }
                                d += e;
                                d /= Math.pow(10, g);
                                var i = d.toFixed(g);
                                var k = new p(c, a.start, c, a.end);
                                this.session.replace(k, i);
                                this.moveCursorTo(c, Math.max(a.start + 1, b + i.length - a.value.length));
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
                        var n = this.selection.getCursor().row;
                        var j = this.selection.getCursor().column;
                        this.selection.selectWord();
                        var a = this.getSelectedText();
                        var k = this.selection.getWordRange().start.column;
                        var l = a.replace(/([a-z]+|[A-Z]+)(?=[A-Z_]|$)/g, "$1 ").split(/\s/);
                        var e = j - k - 1;
                        if (e < 0) e = 0;
                        var o = 0, p = 0;
                        var q = this;
                        if (a.match(/[A-Za-z0-9_]+/)) {
                            l.forEach(function(b, c) {
                                p = o + b.length;
                                if (e >= o && e <= p) {
                                    a = b;
                                    q.selection.clearSelection();
                                    q.moveCursorTo(n, o + k);
                                    q.selection.selectTo(n, p + k);
                                }
                                o = p;
                            });
                        }
                        var f = this.$toggleWordPairs;
                        var c;
                        for(var d = 0; d < f.length; d++){
                            var g = f[d];
                            for(var b = 0; b <= 1; b++){
                                var r = +!b;
                                var i = a.match(new RegExp("^\\s?_?(" + h.escapeRegExp(g[b]) + ")\\s?$", "i"));
                                if (i) {
                                    var m = a.match(new RegExp("([_]|^|\\s)(" + h.escapeRegExp(i[1]) + ")($|\\s)", "g"));
                                    if (m) {
                                        c = a.replace(new RegExp(h.escapeRegExp(g[b]), "i"), function(b) {
                                            var a = g[r];
                                            if (b.toUpperCase() == b) {
                                                a = a.toUpperCase();
                                            } else if (b.charAt(0).toUpperCase() == b.charAt(0)) {
                                                a = a.substr(0, 0) + g[r].charAt(0).toUpperCase() + a.substr(1);
                                            }
                                            return a;
                                        });
                                        this.insert(c);
                                        c = "";
                                    }
                                }
                            }
                        }
                    };
                    this.removeLines = function() {
                        var a = this.$getSelectedRows();
                        this.session.removeFullLines(a.first, a.last);
                        this.clearSelection();
                    };
                    this.duplicateSelection = function() {
                        var b = this.selection;
                        var c = this.session;
                        var a = b.getRange();
                        var d = b.isBackwards();
                        if (a.isEmpty()) {
                            var e = a.start.row;
                            c.duplicateLines(e, e);
                        } else {
                            var f = d ? a.start : a.end;
                            var g = c.insert(f, c.getTextRange(a), false);
                            a.start = f;
                            a.end = g;
                            b.setSelectionRange(a, d);
                        }
                    };
                    this.moveLinesDown = function() {
                        this.$moveLines(1, false);
                    };
                    this.moveLinesUp = function() {
                        this.$moveLines(-1, false);
                    };
                    this.moveText = function(a, b, c) {
                        return this.session.moveText(a, b, c);
                    };
                    this.copyLinesUp = function() {
                        this.$moveLines(-1, true);
                    };
                    this.copyLinesDown = function() {
                        this.$moveLines(1, true);
                    };
                    this.$moveLines = function(g, c) {
                        var d, j;
                        var b = this.selection;
                        if (!b.inMultiSelectMode || this.inVirtualSelectionMode) {
                            var k = b.toOrientedRange();
                            d = this.$getSelectedRows(k);
                            j = this.session.$moveLines(d.first, d.last, c ? 0 : g);
                            if (c && g == -1) j = 0;
                            k.moveBy(j, 0);
                            b.fromOrientedRange(k);
                        } else {
                            var e = b.rangeList.ranges;
                            b.rangeList.detach(this.session);
                            this.inVirtualSelectionMode = true;
                            var f = 0;
                            var l = 0;
                            var n = e.length;
                            for(var a = 0; a < n; a++){
                                var h = a;
                                e[a].moveBy(f, 0);
                                d = this.$getSelectedRows(e[a]);
                                var o = d.first;
                                var i = d.last;
                                while(++a < n){
                                    if (l) e[a].moveBy(l, 0);
                                    var m = this.$getSelectedRows(e[a]);
                                    if (c && m.first != i) break;
                                    else if (!c && m.first > i + 1) break;
                                    i = m.last;
                                }
                                a--;
                                f = this.session.$moveLines(o, i, c ? 0 : g);
                                if (c && g == -1) h = a + 1;
                                while(h <= a){
                                    e[h].moveBy(f, 0);
                                    h++;
                                }
                                if (!c) f = 0;
                                l += f;
                            }
                            b.fromOrientedRange(b.ranges[0]);
                            b.rangeList.attach(this.session);
                            this.inVirtualSelectionMode = false;
                        }
                    };
                    this.$getSelectedRows = function(a) {
                        a = (a || this.getSelectionRange()).collapseRows();
                        return {
                            first: this.session.getRowFoldStart(a.start.row),
                            last: this.session.getRowFoldEnd(a.end.row)
                        };
                    };
                    this.onCompositionStart = function(a) {
                        this.renderer.showComposition(a);
                    };
                    this.onCompositionUpdate = function(a) {
                        this.renderer.setCompositionText(a);
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
                    this.isRowVisible = function(a) {
                        return (a >= this.getFirstVisibleRow() && a <= this.getLastVisibleRow());
                    };
                    this.isRowFullyVisible = function(a) {
                        return (a >= this.renderer.getFirstFullyVisibleRow() && a <= this.renderer.getLastFullyVisibleRow());
                    };
                    this.$getVisibleRowCount = function() {
                        return (this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1);
                    };
                    this.$moveByPage = function(e, b) {
                        var a = this.renderer;
                        var c = this.renderer.layerConfig;
                        var d = e * Math.floor(c.height / c.lineHeight);
                        if (b === true) {
                            this.selection.$moveSelection(function() {
                                this.moveCursorBy(d, 0);
                            });
                        } else if (b === false) {
                            this.selection.moveCursorBy(d, 0);
                            this.selection.clearSelection();
                        }
                        var f = a.scrollTop;
                        a.scrollBy(0, d * c.lineHeight);
                        if (b != null) a.scrollCursorIntoView(null, 0.5);
                        a.animateScrolling(f);
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
                    this.scrollToRow = function(a) {
                        this.renderer.scrollToRow(a);
                    };
                    this.scrollToLine = function(a, b, c, d) {
                        this.renderer.scrollToLine(a, b, c, d);
                    };
                    this.centerSelection = function() {
                        var a = this.getSelectionRange();
                        var b = {
                            row: Math.floor(a.start.row + (a.end.row - a.start.row) / 2),
                            column: Math.floor(a.start.column + (a.end.column - a.start.column) / 2)
                        };
                        this.renderer.alignCursor(b, 0.5);
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
                    this.moveCursorTo = function(a, b) {
                        this.selection.moveCursorTo(a, b);
                    };
                    this.moveCursorToPosition = function(a) {
                        this.selection.moveCursorToPosition(a);
                    };
                    this.jumpToMatching = function(o, m) {
                        var g = this.getCursorPosition();
                        var d = new t(this.session, g.row, g.column);
                        var f = d.getCurrentToken();
                        var a = f || d.stepForward();
                        if (!a) return;
                        var k;
                        var h = false;
                        var e = {};
                        var i = g.column - a.start;
                        var j;
                        var n = {
                            ")": "(",
                            "(": "(",
                            "]": "[",
                            "[": "[",
                            "{": "{",
                            "}": "{"
                        };
                        do {
                            if (a.value.match(/[{}()\[\]]/g)) {
                                for(; i < a.value.length && !h; i++){
                                    if (!n[a.value[i]]) {
                                        continue;
                                    }
                                    j = n[a.value[i]] + "." + a.type.replace("rparen", "lparen");
                                    if (isNaN(e[j])) {
                                        e[j] = 0;
                                    }
                                    switch(a.value[i]){
                                        case "(":
                                        case "[":
                                        case "{":
                                            e[j]++;
                                            break;
                                        case ")":
                                        case "]":
                                        case "}":
                                            e[j]--;
                                            if (e[j] === -1) {
                                                k = "bracket";
                                                h = true;
                                            }
                                            break;
                                    }
                                }
                            } else if (a.type.indexOf("tag-name") !== -1) {
                                if (isNaN(e[a.value])) {
                                    e[a.value] = 0;
                                }
                                if (f.value === "<") {
                                    e[a.value]++;
                                } else if (f.value === "</") {
                                    e[a.value]--;
                                }
                                if (e[a.value] === -1) {
                                    k = "tag";
                                    h = true;
                                }
                            }
                            if (!h) {
                                f = a;
                                a = d.stepForward();
                                i = 0;
                            }
                        }while (a && !h)
                        if (!k) return;
                        var b, c;
                        if (k === "bracket") {
                            b = this.session.getBracketRange(g);
                            if (!b) {
                                b = new p(d.getCurrentTokenRow(), d.getCurrentTokenColumn() + i - 1, d.getCurrentTokenRow(), d.getCurrentTokenColumn() + i - 1);
                                c = b.start;
                                if (m || (c.row === g.row && Math.abs(c.column - g.column) < 2)) b = this.session.getBracketRange(c);
                            }
                        } else if (k === "tag") {
                            if (a && a.type.indexOf("tag-name") !== -1) var l = a.value;
                            else return;
                            b = new p(d.getCurrentTokenRow(), d.getCurrentTokenColumn() - 2, d.getCurrentTokenRow(), d.getCurrentTokenColumn() - 2);
                            if (b.compare(g.row, g.column) === 0) {
                                h = false;
                                do {
                                    a = f;
                                    f = d.stepBackward();
                                    if (f) {
                                        if (f.type.indexOf("tag-close") !== -1) {
                                            b.setEnd(d.getCurrentTokenRow(), d.getCurrentTokenColumn() + 1);
                                        }
                                        if (a.value === l && a.type.indexOf("tag-name") !== -1) {
                                            if (f.value === "<") {
                                                e[l]++;
                                            } else if (f.value === "</") {
                                                e[l]--;
                                            }
                                            if (e[l] === 0) h = true;
                                        }
                                    }
                                }while (f && !h)
                            }
                            if (a && a.type.indexOf("tag-name")) {
                                c = b.start;
                                if (c.row == g.row && Math.abs(c.column - g.column) < 2) c = b.end;
                            }
                        }
                        c = (b && b.cursor) || c;
                        if (c) {
                            if (o) {
                                if (b && m) {
                                    this.selection.setRange(b);
                                } else if (b && b.isEqual(this.getSelectionRange())) {
                                    this.clearSelection();
                                } else {
                                    this.selection.selectTo(c.row, c.column);
                                }
                            } else {
                                this.selection.moveTo(c.row, c.column);
                            }
                        }
                    };
                    this.gotoLine = function(a, b, c) {
                        this.selection.clearSelection();
                        this.session.unfold({
                            row: a - 1,
                            column: b || 0
                        });
                        this.exitMultiSelectMode && this.exitMultiSelectMode();
                        this.moveCursorTo(a - 1, b || 0);
                        if (!this.isRowFullyVisible(a - 1)) this.scrollToLine(a - 1, true, c);
                    };
                    this.navigateTo = function(a, b) {
                        this.selection.moveTo(a, b);
                    };
                    this.navigateUp = function(a) {
                        if (this.selection.isMultiLine() && !this.selection.isBackwards()) {
                            var b = this.selection.anchor.getPosition();
                            return this.moveCursorToPosition(b);
                        }
                        this.selection.clearSelection();
                        this.selection.moveCursorBy(-a || -1, 0);
                    };
                    this.navigateDown = function(a) {
                        if (this.selection.isMultiLine() && this.selection.isBackwards()) {
                            var b = this.selection.anchor.getPosition();
                            return this.moveCursorToPosition(b);
                        }
                        this.selection.clearSelection();
                        this.selection.moveCursorBy(a || 1, 0);
                    };
                    this.navigateLeft = function(a) {
                        if (!this.selection.isEmpty()) {
                            var b = this.getSelectionRange().start;
                            this.moveCursorToPosition(b);
                        } else {
                            a = a || 1;
                            while(a--){
                                this.selection.moveCursorLeft();
                            }
                        }
                        this.clearSelection();
                    };
                    this.navigateRight = function(a) {
                        if (!this.selection.isEmpty()) {
                            var b = this.getSelectionRange().end;
                            this.moveCursorToPosition(b);
                        } else {
                            a = a || 1;
                            while(a--){
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
                    this.replace = function(d, c) {
                        if (c) this.$search.set(c);
                        var a = this.$search.find(this.session);
                        var b = 0;
                        if (!a) return b;
                        if (this.$tryReplace(a, d)) {
                            b = 1;
                        }
                        this.selection.setSelectionRange(a);
                        this.renderer.scrollSelectionIntoView(a.start, a.end);
                        return b;
                    };
                    this.replaceAll = function(e, d) {
                        if (d) {
                            this.$search.set(d);
                        }
                        var a = this.$search.findAll(this.session);
                        var b = 0;
                        if (!a.length) return b;
                        var f = this.getSelectionRange();
                        this.selection.moveTo(0, 0);
                        for(var c = a.length - 1; c >= 0; --c){
                            if (this.$tryReplace(a[c], e)) {
                                b++;
                            }
                        }
                        this.selection.setSelectionRange(f);
                        return b;
                    };
                    this.$tryReplace = function(a, b) {
                        var c = this.session.getTextRange(a);
                        b = this.$search.replace(c, b);
                        if (b !== null) {
                            a.end = this.session.replace(a, b);
                            return a;
                        } else {
                            return null;
                        }
                    };
                    this.getLastSearchOptions = function() {
                        return this.$search.getOptions();
                    };
                    this.find = function(b, c, e) {
                        if (!c) c = {};
                        if (typeof b == "string" || b instanceof RegExp) c.needle = b;
                        else if (typeof b == "object") f.mixin(c, b);
                        var a = this.selection.getRange();
                        if (c.needle == null) {
                            b = this.session.getTextRange(a) || this.$search.$options.needle;
                            if (!b) {
                                a = this.session.getWordRange(a.start.row, a.start.column);
                                b = this.session.getTextRange(a);
                            }
                            this.$search.set({
                                needle: b
                            });
                        }
                        this.$search.set(c);
                        if (!c.start) this.$search.set({
                            start: a
                        });
                        var d = this.$search.find(this.session);
                        if (c.preventScroll) return d;
                        if (d) {
                            this.revealRange(d, e);
                            return d;
                        }
                        if (c.backwards) a.start = a.end;
                        else a.end = a.start;
                        this.selection.setRange(a);
                    };
                    this.findNext = function(a, b) {
                        this.find({
                            skipCurrent: true,
                            backwards: false
                        }, a, b);
                    };
                    this.findPrevious = function(a, b) {
                        this.find(a, {
                            skipCurrent: true,
                            backwards: true
                        }, b);
                    };
                    this.revealRange = function(a, b) {
                        this.session.unfold(a);
                        this.selection.setSelectionRange(a);
                        var c = this.renderer.scrollTop;
                        this.renderer.scrollSelectionIntoView(a.start, a.end, 0.5);
                        if (b !== false) this.renderer.animateScrolling(c);
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
                            this.$toDestroy.forEach(function(a) {
                                a.destroy();
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
                    this.setAutoScrollEditorIntoView = function(b) {
                        if (!b) return;
                        var c;
                        var d = this;
                        var e = false;
                        if (!this.$scrollAnchor) this.$scrollAnchor = document.createElement("div");
                        var a = this.$scrollAnchor;
                        a.style.cssText = "position:absolute";
                        this.container.insertBefore(a, this.container.firstChild);
                        var f = this.on("changeSelection", function() {
                            e = true;
                        });
                        var g = this.renderer.on("beforeRender", function() {
                            if (e) c = d.renderer.container.getBoundingClientRect();
                        });
                        var h = this.renderer.on("afterRender", function() {
                            if (e && c && (d.isFocused() || (d.searchBox && d.searchBox.isFocused()))) {
                                var g = d.renderer;
                                var b = g.$cursorLayer.$pixelPos;
                                var f = g.layerConfig;
                                var h = b.top - f.offset;
                                if (b.top >= 0 && h + c.top < 0) {
                                    e = true;
                                } else if (b.top < f.height && b.top + c.top + f.lineHeight > window.innerHeight) {
                                    e = false;
                                } else {
                                    e = null;
                                }
                                if (e != null) {
                                    a.style.top = h + "px";
                                    a.style.left = b.left + "px";
                                    a.style.height = f.lineHeight + "px";
                                    a.scrollIntoView(e);
                                }
                                e = c = null;
                            }
                        });
                        this.setAutoScrollEditorIntoView = function(a) {
                            if (a) return;
                            delete this.setAutoScrollEditorIntoView;
                            this.off("changeSelection", f);
                            this.renderer.off("afterRender", h);
                            this.renderer.off("beforeRender", g);
                        };
                    };
                    this.$resetCursorStyle = function() {
                        var b = this.$cursorStyle || "ace";
                        var a = this.renderer.$cursorLayer;
                        if (!a) return;
                        a.setSmoothBlinking(/smooth/.test(b));
                        a.isBlinking = !this.$readOnly && b != "wide";
                        g.setCssClass(a.element, "ace_slim-cursors", /slim/.test(b));
                    };
                    this.prompt = function(a, b, c) {
                        var e = this;
                        d.loadModule("./ext/prompt", function(d) {
                            d.prompt(e, a, b, c);
                        });
                    };
                }.call(b.prototype));
                d.defineOptions(b.prototype, "editor", {
                    selectionStyle: {
                        set: function(a) {
                            this.onSelectionChange();
                            this._signal("changeSelectionStyle", {
                                data: a
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
                        set: function(a) {
                            this.$onSelectionChange();
                        },
                        initialValue: true
                    },
                    readOnly: {
                        set: function(a) {
                            this.textInput.setReadOnly(a);
                            this.$resetCursorStyle();
                        },
                        initialValue: false
                    },
                    copyWithEmptySelection: {
                        set: function(a) {
                            this.textInput.setCopyWithEmptySelection(a);
                        },
                        initialValue: false
                    },
                    cursorStyle: {
                        set: function(a) {
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
                        set: function(a) {
                            this.setAutoScrollEditorIntoView(a);
                        }
                    },
                    keyboardHandler: {
                        set: function(a) {
                            this.setKeyboardHandler(a);
                        },
                        get: function() {
                            return this.$keybindingId;
                        },
                        handlesSet: true
                    },
                    value: {
                        set: function(a) {
                            this.session.setValue(a);
                        },
                        get: function() {
                            return this.getValue();
                        },
                        handlesSet: true,
                        hidden: true
                    },
                    session: {
                        set: function(a) {
                            this.setSession(a);
                        },
                        get: function() {
                            return this.session;
                        },
                        handlesSet: true,
                        hidden: true
                    },
                    showLineNumbers: {
                        set: function(a) {
                            this.renderer.$gutterLayer.setShowLineNumbers(a);
                            this.renderer.$loop.schedule(this.renderer.CHANGE_GUTTER);
                            if (a && this.$relativeLineNumbers) v.attach(this);
                            else v.detach(this);
                        },
                        initialValue: true
                    },
                    relativeLineNumbers: {
                        set: function(a) {
                            if (this.$showLineNumbers && a) v.attach(this);
                            else v.detach(this);
                        }
                    },
                    placeholder: {
                        set: function(a) {
                            if (!this.$updatePlaceholder) {
                                this.$updatePlaceholder = function() {
                                    var a = this.session && (this.renderer.$composition || this.getValue());
                                    if (a && this.renderer.placeholderNode) {
                                        this.renderer.off("afterRender", this.$updatePlaceholder);
                                        g.removeCssClass(this.container, "ace_hasPlaceholder");
                                        this.renderer.placeholderNode.remove();
                                        this.renderer.placeholderNode = null;
                                    } else if (!a && !this.renderer.placeholderNode) {
                                        this.renderer.on("afterRender", this.$updatePlaceholder);
                                        g.addCssClass(this.container, "ace_hasPlaceholder");
                                        var b = g.createElement("div");
                                        b.className = "ace_placeholder";
                                        b.textContent = this.$placeholder || "";
                                        this.renderer.placeholderNode = b;
                                        this.renderer.content.appendChild(this.renderer.placeholderNode);
                                    } else if (!a && this.renderer.placeholderNode) {
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
                var v = {
                    getText: function(b, a) {
                        return ((Math.abs(b.selection.lead.row - a) || a + 1 + (a < 9 ? "\xb7" : "")) + "");
                    },
                    getWidth: function(c, b, a) {
                        return (Math.max(b.toString().length, (a.lastRow + 1).toString().length, 2) * a.characterWidth);
                    },
                    update: function(b, a) {
                        a.renderer.$loop.schedule(a.renderer.CHANGE_GUTTER);
                    },
                    attach: function(a) {
                        a.renderer.$gutterLayer.$renderer = this;
                        a.on("changeSelection", this.update);
                        this.update(null, a);
                    },
                    detach: function(a) {
                        if (a.renderer.$gutterLayer.$renderer == this) a.renderer.$gutterLayer.$renderer = null;
                        a.off("changeSelection", this.update);
                        this.update(null, a);
                    }
                };
                c.Editor = b;
            });
            ace.define("ace/undomanager", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(c, d, e) {
                "use strict";
                var a = function() {
                    this.$maxRev = 0;
                    this.$fromUndo = false;
                    this.reset();
                };
                (function() {
                    this.addSession = function(a) {
                        this.$session = a;
                    };
                    this.add = function(a, b, c) {
                        if (this.$fromUndo) return;
                        if (a == this.$lastDelta) return;
                        if (!this.$keepRedoStack) this.$redoStack.length = 0;
                        if (b === false || !this.lastDeltas) {
                            this.lastDeltas = [];
                            this.$undoStack.push(this.lastDeltas);
                            a.id = this.$rev = ++this.$maxRev;
                        }
                        if (a.action == "remove" || a.action == "insert") this.$lastDelta = a;
                        this.lastDeltas.push(a);
                    };
                    this.addSelection = function(a, b) {
                        this.selections.push({
                            value: a,
                            rev: b || this.$rev
                        });
                    };
                    this.startNewGroup = function() {
                        this.lastDeltas = null;
                        return this.$rev;
                    };
                    this.markIgnored = function(e, a) {
                        if (a == null) a = this.$rev + 1;
                        var c = this.$undoStack;
                        for(var d = c.length; d--;){
                            var b = c[d][0];
                            if (b.id <= e) break;
                            if (b.id < a) b.ignore = true;
                        }
                        this.lastDeltas = null;
                    };
                    this.getSelection = function(d, e) {
                        var a = this.selections;
                        for(var b = a.length; b--;){
                            var c = a[b];
                            if (c.rev < d) {
                                if (e) c = a[b + 1];
                                return c;
                            }
                        }
                    };
                    this.getRevision = function() {
                        return this.$rev;
                    };
                    this.getDeltas = function(g, b) {
                        if (b == null) b = this.$rev + 1;
                        var c = this.$undoStack;
                        var d = null, e = 0;
                        for(var a = c.length; a--;){
                            var f = c[a][0];
                            if (f.id < b && !d) d = a + 1;
                            if (f.id <= g) {
                                e = a + 1;
                                break;
                            }
                        }
                        return c.slice(e, d);
                    };
                    this.getChangedRanges = function(b, a) {
                        if (a == null) a = this.$rev + 1;
                    };
                    this.getChangedLines = function(b, a) {
                        if (a == null) a = this.$rev + 1;
                    };
                    this.undo = function(a, e) {
                        this.lastDeltas = null;
                        var b = this.$undoStack;
                        if (!f(b, b.length)) return;
                        if (!a) a = this.$session;
                        if (this.$redoStackBaseRev !== this.$rev && this.$redoStack.length) this.$redoStack = [];
                        this.$fromUndo = true;
                        var c = b.pop();
                        var d = null;
                        if (c) {
                            d = a.undoChanges(c, e);
                            this.$redoStack.push(c);
                            this.$syncRev();
                        }
                        this.$fromUndo = false;
                        return d;
                    };
                    this.redo = function(a, d) {
                        this.lastDeltas = null;
                        if (!a) a = this.$session;
                        this.$fromUndo = true;
                        if (this.$redoStackBaseRev != this.$rev) {
                            var e = this.getDeltas(this.$redoStackBaseRev, this.$rev + 1);
                            u(this.$redoStack, e);
                            this.$redoStackBaseRev = this.$rev;
                            this.$redoStack.forEach(function(a) {
                                a[0].id = ++this.$maxRev;
                            }, this);
                        }
                        var b = this.$redoStack.pop();
                        var c = null;
                        if (b) {
                            c = a.redoChanges(b, d);
                            this.$undoStack.push(b);
                            this.$syncRev();
                        }
                        this.$fromUndo = false;
                        return c;
                    };
                    this.$syncRev = function() {
                        var a = this.$undoStack;
                        var b = a[a.length - 1];
                        var c = (b && b[0].id) || 0;
                        this.$redoStackBaseRev = c;
                        this.$rev = c;
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
                    this.bookmark = function(a) {
                        if (a == undefined) a = this.$rev;
                        this.mark = a;
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
                    this.$prettyPrint = function(a) {
                        if (a) return l(a);
                        return (l(this.$undoStack) + "\n---\n" + l(this.$redoStack));
                    };
                }.call(a.prototype));
                function f(b, c) {
                    for(var a = c; a--;){
                        var d = b[a];
                        if (d && !d[0].ignore) {
                            while(a < c - 1){
                                var e = o(b[a], b[a + 1]);
                                b[a] = e[0];
                                b[a + 1] = e[1];
                                a++;
                            }
                            return true;
                        }
                    }
                }
                var b = c("./range").Range;
                var g = b.comparePoints;
                var h = b.comparePoints;
                function i(f) {
                    var b = f.action == "insert";
                    var c = f.start;
                    var d = f.end;
                    var i = (d.row - c.row) * (b ? 1 : -1);
                    var j = (d.column - c.column) * (b ? 1 : -1);
                    if (b) d = c;
                    for(var k in this.marks){
                        var a = this.marks[k];
                        var e = h(a, c);
                        if (e < 0) {
                            continue;
                        }
                        if (e === 0) {
                            if (b) {
                                if (a.bias == 1) {
                                    e = 1;
                                } else {
                                    a.bias == -1;
                                    continue;
                                }
                            }
                        }
                        var g = b ? e : h(a, d);
                        if (g > 0) {
                            a.row += i;
                            a.column += a.row == d.row ? j : 0;
                            continue;
                        }
                        if (!b && g <= 0) {
                            a.row = c.row;
                            a.column = c.column;
                            if (g === 0) a.bias = 1;
                        }
                    }
                }
                function j(a) {
                    return {
                        row: a.row,
                        column: a.column
                    };
                }
                function k(a) {
                    return {
                        start: j(a.start),
                        end: j(a.end),
                        action: a.action,
                        lines: a.lines.slice()
                    };
                }
                function l(a) {
                    a = a || this;
                    if (Array.isArray(a)) {
                        return a.map(l).join("\n");
                    }
                    var b = "";
                    if (a.action) {
                        b = a.action == "insert" ? "+" : "-";
                        b += "[" + a.lines + "]";
                    } else if (a.value) {
                        if (Array.isArray(a.value)) {
                            b = a.value.map(m).join("\n");
                        } else {
                            b = m(a.value);
                        }
                    }
                    if (a.start) {
                        b += m(a);
                    }
                    if (a.id || a.rev) {
                        b += "\t(" + (a.id || a.rev) + ")";
                    }
                    return b;
                }
                function m(a) {
                    return (a.start.row + ":" + a.start.column + "=>" + a.end.row + ":" + a.end.column);
                }
                function n(a, b) {
                    var c = a.action == "insert";
                    var d = b.action == "insert";
                    if (c && d) {
                        if (g(b.start, a.end) >= 0) {
                            q(b, a, -1);
                        } else if (g(b.start, a.start) <= 0) {
                            q(a, b, +1);
                        } else {
                            return null;
                        }
                    } else if (c && !d) {
                        if (g(b.start, a.end) >= 0) {
                            q(b, a, -1);
                        } else if (g(b.end, a.start) <= 0) {
                            q(a, b, -1);
                        } else {
                            return null;
                        }
                    } else if (!c && d) {
                        if (g(b.start, a.start) >= 0) {
                            q(b, a, +1);
                        } else if (g(b.start, a.start) <= 0) {
                            q(a, b, +1);
                        } else {
                            return null;
                        }
                    } else if (!c && !d) {
                        if (g(b.start, a.start) >= 0) {
                            q(b, a, +1);
                        } else if (g(b.end, a.start) <= 0) {
                            q(a, b, -1);
                        } else {
                            return null;
                        }
                    }
                    return [
                        b,
                        a
                    ];
                }
                function o(a, b) {
                    for(var d = a.length; d--;){
                        for(var c = 0; c < b.length; c++){
                            if (!n(a[d], b[c])) {
                                while(d < a.length){
                                    while(c--){
                                        n(b[c], a[d]);
                                    }
                                    c = b.length;
                                    d++;
                                }
                                return [
                                    a,
                                    b
                                ];
                            }
                        }
                    }
                    a.selectionBefore = b.selectionBefore = a.selectionAfter = b.selectionAfter = null;
                    return [
                        b,
                        a
                    ];
                }
                function p(a, c) {
                    var e = a.action == "insert";
                    var f = c.action == "insert";
                    if (e && f) {
                        if (g(a.start, c.start) < 0) {
                            q(c, a, 1);
                        } else {
                            q(a, c, 1);
                        }
                    } else if (e && !f) {
                        if (g(a.start, c.end) >= 0) {
                            q(a, c, -1);
                        } else if (g(a.start, c.start) <= 0) {
                            q(c, a, +1);
                        } else {
                            q(a, b.fromPoints(c.start, a.start), -1);
                            q(c, a, +1);
                        }
                    } else if (!e && f) {
                        if (g(c.start, a.end) >= 0) {
                            q(c, a, -1);
                        } else if (g(c.start, a.start) <= 0) {
                            q(a, c, +1);
                        } else {
                            q(c, b.fromPoints(a.start, c.start), -1);
                            q(a, c, +1);
                        }
                    } else if (!e && !f) {
                        if (g(c.start, a.end) >= 0) {
                            q(c, a, -1);
                        } else if (g(c.end, a.start) <= 0) {
                            q(a, c, -1);
                        } else {
                            var h, d;
                            if (g(a.start, c.start) < 0) {
                                h = a;
                                a = s(a, c.start);
                            }
                            if (g(a.end, c.end) > 0) {
                                d = s(a, c.end);
                            }
                            r(c.end, a.start, a.end, -1);
                            if (d && !h) {
                                a.lines = d.lines;
                                a.start = d.start;
                                a.end = d.end;
                                d = a;
                            }
                            return [
                                c,
                                h,
                                d
                            ].filter(Boolean);
                        }
                    }
                    return [
                        c,
                        a
                    ];
                }
                function q(b, a, c) {
                    r(b.start, a.start, a.end, c);
                    r(b.end, a.start, a.end, c);
                }
                function r(a, b, c, d) {
                    if (a.row == (d == 1 ? b : c).row) {
                        a.column += d * (c.column - b.column);
                    }
                    a.row += d * (c.row - b.row);
                }
                function s(a, b) {
                    var d = a.lines;
                    var g = a.end;
                    a.end = j(b);
                    var e = a.end.row - a.start.row;
                    var c = d.splice(e, d.length);
                    var f = e ? b.column : b.column - a.start.column;
                    d.push(c[0].substring(0, f));
                    c[0] = c[0].substr(f);
                    var h = {
                        start: j(b),
                        end: g,
                        lines: c,
                        action: a.action
                    };
                    return h;
                }
                function t(d, e) {
                    e = k(e);
                    for(var f = d.length; f--;){
                        var c = d[f];
                        for(var a = 0; a < c.length; a++){
                            var g = c[a];
                            var b = p(g, e);
                            e = b[0];
                            if (b.length != 2) {
                                if (b[2]) {
                                    c.splice(a + 1, 1, b[1], b[2]);
                                    a++;
                                } else if (!b[1]) {
                                    c.splice(a, 1);
                                    a--;
                                }
                            }
                        }
                        if (!c.length) {
                            d.splice(f, 1);
                        }
                    }
                    return d;
                }
                function u(e, c) {
                    for(var a = 0; a < c.length; a++){
                        var d = c[a];
                        for(var b = 0; b < d.length; b++){
                            t(e, d[b]);
                        }
                    }
                }
                d.UndoManager = a;
            });
            ace.define("ace/layer/lines", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(b, c, d) {
                "use strict";
                var e = b("../lib/dom");
                var a = function(a, b) {
                    this.element = a;
                    this.canvasHeight = b || 500000;
                    this.element.style.height = this.canvasHeight * 2 + "px";
                    this.cells = [];
                    this.cellCache = [];
                    this.$offsetCoefficient = 0;
                };
                (function() {
                    this.moveContainer = function(a) {
                        e.translate(this.element, 0, -((a.firstRowScreen * a.lineHeight) % this.canvasHeight) - a.offset * this.$offsetCoefficient);
                    };
                    this.pageChanged = function(a, b) {
                        return (Math.floor((a.firstRowScreen * a.lineHeight) / this.canvasHeight) !== Math.floor((b.firstRowScreen * b.lineHeight) / this.canvasHeight));
                    };
                    this.computeLineTop = function(b, a, c) {
                        var d = a.firstRowScreen * a.lineHeight;
                        var e = Math.floor(d / this.canvasHeight);
                        var f = c.documentToScreenRow(b, 0) * a.lineHeight;
                        return f - e * this.canvasHeight;
                    };
                    this.computeLineHeight = function(a, b, c) {
                        return (b.lineHeight * c.getRowLineCount(a));
                    };
                    this.getLength = function() {
                        return this.cells.length;
                    };
                    this.get = function(a) {
                        return this.cells[a];
                    };
                    this.shift = function() {
                        this.$cacheCell(this.cells.shift());
                    };
                    this.pop = function() {
                        this.$cacheCell(this.cells.pop());
                    };
                    this.push = function(a) {
                        if (Array.isArray(a)) {
                            this.cells.push.apply(this.cells, a);
                            var c = e.createFragment(this.element);
                            for(var b = 0; b < a.length; b++){
                                c.appendChild(a[b].element);
                            }
                            this.element.appendChild(c);
                        } else {
                            this.cells.push(a);
                            this.element.appendChild(a.element);
                        }
                    };
                    this.unshift = function(a) {
                        if (Array.isArray(a)) {
                            this.cells.unshift.apply(this.cells, a);
                            var b = e.createFragment(this.element);
                            for(var c = 0; c < a.length; c++){
                                b.appendChild(a[c].element);
                            }
                            if (this.element.firstChild) this.element.insertBefore(b, this.element.firstChild);
                            else this.element.appendChild(b);
                        } else {
                            this.cells.unshift(a);
                            this.element.insertAdjacentElement("afterbegin", a.element);
                        }
                    };
                    this.last = function() {
                        if (this.cells.length) return this.cells[this.cells.length - 1];
                        else return null;
                    };
                    this.$cacheCell = function(a) {
                        if (!a) return;
                        a.element.remove();
                        this.cellCache.push(a);
                    };
                    this.createCell = function(c, f, g, d) {
                        var a = this.cellCache.pop();
                        if (!a) {
                            var b = e.createElement("div");
                            if (d) d(b);
                            this.element.appendChild(b);
                            a = {
                                element: b,
                                text: "",
                                row: c
                            };
                        }
                        a.row = c;
                        return a;
                    };
                }.call(a.prototype));
                c.Lines = a;
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
            ], function(a, c, d) {
                "use strict";
                var e = a("../lib/dom");
                var f = a("../lib/oop");
                var g = a("../lib/lang");
                var h = a("../lib/event_emitter").EventEmitter;
                var i = a("./lines").Lines;
                var b = function(a) {
                    this.element = e.createElement("div");
                    this.element.className = "ace_layer ace_gutter-layer";
                    a.appendChild(this.element);
                    this.setShowFoldWidgets(this.$showFoldWidgets);
                    this.gutterWidth = 0;
                    this.$annotations = [];
                    this.$updateAnnotations = this.$updateAnnotations.bind(this);
                    this.$lines = new i(this.element);
                    this.$lines.$offsetCoefficient = 1;
                };
                (function() {
                    f.implement(this, h);
                    this.setSession = function(a) {
                        if (this.session) this.session.off("change", this.$updateAnnotations);
                        this.session = a;
                        if (a) a.on("change", this.$updateAnnotations);
                    };
                    this.addGutterDecoration = function(a, b) {
                        if (window.console) console.warn && console.warn("deprecated use session.addGutterDecoration");
                        this.session.addGutterDecoration(a, b);
                    };
                    this.removeGutterDecoration = function(a, b) {
                        if (window.console) console.warn && console.warn("deprecated use session.removeGutterDecoration");
                        this.session.removeGutterDecoration(a, b);
                    };
                    this.setAnnotations = function(f) {
                        this.$annotations = [];
                        for(var d = 0; d < f.length; d++){
                            var c = f[d];
                            var h = c.row;
                            var a = this.$annotations[h];
                            if (!a) a = this.$annotations[h] = {
                                text: []
                            };
                            var b = c.text;
                            b = b ? g.escapeHTML(b) : c.html || "";
                            if (a.text.indexOf(b) === -1) a.text.push(b);
                            var e = c.type;
                            if (e == "error") a.className = " ace_error";
                            else if (e == "warning" && a.className != " ace_error") a.className = " ace_warning";
                            else if (e == "info" && !a.className) a.className = " ace_info";
                        }
                    };
                    this.$updateAnnotations = function(a) {
                        if (!this.$annotations.length) return;
                        var b = a.start.row;
                        var c = a.end.row - b;
                        if (c === 0) {} else if (a.action == "remove") {
                            this.$annotations.splice(b, c + 1, null);
                        } else {
                            var d = new Array(c + 1);
                            d.unshift(b, 1);
                            this.$annotations.splice.apply(this.$annotations, d);
                        }
                    };
                    this.update = function(a) {
                        this.config = a;
                        var e = this.session;
                        var f = a.firstRow;
                        var g = Math.min(a.lastRow + a.gutterOffset, e.getLength() - 1);
                        this.oldLastRow = g;
                        this.config = a;
                        this.$lines.moveContainer(a);
                        this.$updateCursorRow();
                        var b = e.getNextFoldLine(f);
                        var h = b ? b.start.row : Infinity;
                        var d = null;
                        var i = -1;
                        var c = f;
                        while(true){
                            if (c > h) {
                                c = b.end.row + 1;
                                b = e.getNextFoldLine(c, b);
                                h = b ? b.start.row : Infinity;
                            }
                            if (c > g) {
                                while(this.$lines.getLength() > i + 1)this.$lines.pop();
                                break;
                            }
                            d = this.$lines.get(++i);
                            if (d) {
                                d.row = c;
                            } else {
                                d = this.$lines.createCell(c, a, this.session, j);
                                this.$lines.push(d);
                            }
                            this.$renderCell(d, a, b, c);
                            c++;
                        }
                        this._signal("afterRender");
                        this.$updateGutterWidth(a);
                    };
                    this.$updateGutterWidth = function(d) {
                        var a = this.session;
                        var e = a.gutterRenderer || this.$renderer;
                        var g = a.$firstLineNumber;
                        var c = this.$lines.last() ? this.$lines.last().text : "";
                        if (this.$fixedWidth || a.$useWrapMode) c = a.getLength() + g - 1;
                        var b = e ? e.getWidth(a, c, d) : c.toString().length * d.characterWidth;
                        var f = this.$padding || this.$computePadding();
                        b += f.left + f.right;
                        if (b !== this.gutterWidth && !isNaN(b)) {
                            this.gutterWidth = b;
                            this.element.parentNode.style.width = this.element.style.width = Math.ceil(this.gutterWidth) + "px";
                            this._signal("changeGutterWidth", b);
                        }
                    };
                    this.$updateCursorRow = function() {
                        if (!this.$highlightGutterLine) return;
                        var a = this.session.selection.getCursor();
                        if (this.$cursorRow === a.row) return;
                        this.$cursorRow = a.row;
                    };
                    this.updateLineHighlight = function() {
                        if (!this.$highlightGutterLine) return;
                        var d = this.session.selection.cursor.row;
                        this.$cursorRow = d;
                        if (this.$cursorCell && this.$cursorCell.row == d) return;
                        if (this.$cursorCell) this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
                        var c = this.$lines.cells;
                        this.$cursorCell = null;
                        for(var a = 0; a < c.length; a++){
                            var b = c[a];
                            if (b.row >= this.$cursorRow) {
                                if (b.row > this.$cursorRow) {
                                    var e = this.session.getFoldLine(this.$cursorRow);
                                    if (a > 0 && e && e.start.row == c[a - 1].row) b = c[a - 1];
                                    else break;
                                }
                                b.element.className = "ace_gutter-active-line " + b.element.className;
                                this.$cursorCell = b;
                                break;
                            }
                        }
                    };
                    this.scrollLines = function(a) {
                        var b = this.config;
                        this.config = a;
                        this.$updateCursorRow();
                        if (this.$lines.pageChanged(b, a)) return this.update(a);
                        this.$lines.moveContainer(a);
                        var c = Math.min(a.lastRow + a.gutterOffset, this.session.getLength() - 1);
                        var d = this.oldLastRow;
                        this.oldLastRow = c;
                        if (!b || d < a.firstRow) return this.update(a);
                        if (c < b.firstRow) return this.update(a);
                        if (b.firstRow < a.firstRow) for(var e = this.session.getFoldedRowCount(b.firstRow, a.firstRow - 1); e > 0; e--)this.$lines.shift();
                        if (d > c) for(var e = this.session.getFoldedRowCount(c + 1, d); e > 0; e--)this.$lines.pop();
                        if (a.firstRow < b.firstRow) {
                            this.$lines.unshift(this.$renderLines(a, a.firstRow, b.firstRow - 1));
                        }
                        if (c > d) {
                            this.$lines.push(this.$renderLines(a, d + 1, c));
                        }
                        this.updateLineHighlight();
                        this._signal("afterRender");
                        this.$updateGutterWidth(a);
                    };
                    this.$renderLines = function(c, g, h) {
                        var d = [];
                        var a = g;
                        var b = this.session.getNextFoldLine(a);
                        var e = b ? b.start.row : Infinity;
                        while(true){
                            if (a > e) {
                                a = b.end.row + 1;
                                b = this.session.getNextFoldLine(a, b);
                                e = b ? b.start.row : Infinity;
                            }
                            if (a > h) break;
                            var f = this.$lines.createCell(a, c, this.session, j);
                            this.$renderCell(f, c, b, a);
                            d.push(f);
                            a++;
                        }
                        return d;
                    };
                    this.$renderCell = function(d, j, g, a) {
                        var i = d.element;
                        var c = this.session;
                        var m = i.childNodes[0];
                        var f = i.childNodes[1];
                        var r = c.$firstLineNumber;
                        var n = c.$breakpoints;
                        var o = c.$decorations;
                        var p = c.gutterRenderer || this.$renderer;
                        var k = this.$showFoldWidgets && c.foldWidgets;
                        var q = g ? g.start.row : Number.MAX_VALUE;
                        var b = "ace_gutter-cell ";
                        if (this.$highlightGutterLine) {
                            if (a == this.$cursorRow || (g && a < this.$cursorRow && a >= q && this.$cursorRow <= g.end.row)) {
                                b += "ace_gutter-active-line ";
                                if (this.$cursorCell != d) {
                                    if (this.$cursorCell) this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
                                    this.$cursorCell = d;
                                }
                            }
                        }
                        if (n[a]) b += n[a];
                        if (o[a]) b += o[a];
                        if (this.$annotations[a]) b += this.$annotations[a].className;
                        if (i.className != b) i.className = b;
                        if (k) {
                            var h = k[a];
                            if (h == null) h = k[a] = c.getFoldWidget(a);
                        }
                        if (h) {
                            var b = "ace_fold-widget ace_" + h;
                            if (h == "start" && a == q && a < g.end.row) b += " ace_closed";
                            else b += " ace_open";
                            if (f.className != b) f.className = b;
                            var s = j.lineHeight + "px";
                            e.setStyle(f.style, "height", s);
                            e.setStyle(f.style, "display", "inline-block");
                        } else {
                            if (f) {
                                e.setStyle(f.style, "display", "none");
                            }
                        }
                        var l = (p ? p.getText(c, a) : a + r).toString();
                        if (l !== m.data) {
                            m.data = l;
                        }
                        e.setStyle(d.element.style, "height", this.$lines.computeLineHeight(a, j, c) + "px");
                        e.setStyle(d.element.style, "top", this.$lines.computeLineTop(a, j, c) + "px");
                        d.text = l;
                        return d;
                    };
                    this.$fixedWidth = false;
                    this.$highlightGutterLine = true;
                    this.$renderer = "";
                    this.setHighlightGutterLine = function(a) {
                        this.$highlightGutterLine = a;
                    };
                    this.$showLineNumbers = true;
                    this.$renderer = "";
                    this.setShowLineNumbers = function(a) {
                        this.$renderer = !a && {
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
                    this.setShowFoldWidgets = function(a) {
                        if (a) e.addCssClass(this.element, "ace_folding-enabled");
                        else e.removeCssClass(this.element, "ace_folding-enabled");
                        this.$showFoldWidgets = a;
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
                        var a = e.computedStyle(this.element.firstChild);
                        this.$padding = {};
                        this.$padding.left = (parseInt(a.borderLeftWidth) || 0) + (parseInt(a.paddingLeft) || 0) + 1;
                        this.$padding.right = (parseInt(a.borderRightWidth) || 0) + (parseInt(a.paddingRight) || 0);
                        return this.$padding;
                    };
                    this.getRegion = function(a) {
                        var b = this.$padding || this.$computePadding();
                        var c = this.element.getBoundingClientRect();
                        if (a.x < b.left + c.left) return "markers";
                        if (this.$showFoldWidgets && a.x > c.right - b.right) return "foldWidgets";
                    };
                }.call(b.prototype));
                function j(a) {
                    var b = document.createTextNode("");
                    a.appendChild(b);
                    var c = e.createElement("span");
                    a.appendChild(c);
                    return a;
                }
                c.Gutter = b;
            });
            ace.define("ace/layer/marker", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/dom"
            ], function(a, c, d) {
                "use strict";
                var e = a("../range").Range;
                var f = a("../lib/dom");
                var b = function(a) {
                    this.element = f.createElement("div");
                    this.element.className = "ace_layer ace_marker-layer";
                    a.appendChild(this.element);
                };
                (function() {
                    this.$padding = 0;
                    this.setPadding = function(a) {
                        this.$padding = a;
                    };
                    this.setSession = function(a) {
                        this.session = a;
                    };
                    this.setMarkers = function(a) {
                        this.markers = a;
                    };
                    this.elt = function(b, c) {
                        var a = this.i != -1 && this.element.childNodes[this.i];
                        if (!a) {
                            a = document.createElement("div");
                            this.element.appendChild(a);
                            this.i = -1;
                        } else {
                            this.i++;
                        }
                        a.style.cssText = c;
                        a.className = b;
                    };
                    this.update = function(a) {
                        if (!a) return;
                        this.config = a;
                        this.i = 0;
                        var d;
                        for(var e in this.markers){
                            var b = this.markers[e];
                            if (!b.range) {
                                b.update(d, this, this.session, a);
                                continue;
                            }
                            var c = b.range.clipRows(a.firstRow, a.lastRow);
                            if (c.isEmpty()) continue;
                            c = c.toScreenRange(this.session);
                            if (b.renderer) {
                                var f = this.$getTop(c.start.row, a);
                                var g = this.$padding + c.start.column * a.characterWidth;
                                b.renderer(d, c, g, f, a);
                            } else if (b.type == "fullLine") {
                                this.drawFullLineMarker(d, c, b.clazz, a);
                            } else if (b.type == "screenLine") {
                                this.drawScreenLineMarker(d, c, b.clazz, a);
                            } else if (c.isMultiLine()) {
                                if (b.type == "text") this.drawTextMarker(d, c, b.clazz, a);
                                else this.drawMultiLineMarker(d, c, b.clazz, a);
                            } else {
                                this.drawSingleLineMarker(d, c, b.clazz + " ace_start" + " ace_br15", a);
                            }
                        }
                        if (this.i != -1) {
                            while(this.i < this.element.childElementCount)this.element.removeChild(this.element.lastChild);
                        }
                    };
                    this.$getTop = function(b, a) {
                        return ((b - a.firstRowScreen) * a.lineHeight);
                    };
                    function a(a, b, c, d) {
                        return ((a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0));
                    }
                    this.drawTextMarker = function(l, c, m, n, o) {
                        var j = this.session;
                        var d = c.start.row;
                        var f = c.end.row;
                        var b = d;
                        var k = 0;
                        var g = 0;
                        var i = j.getScreenLastRowColumn(b);
                        var h = new e(b, c.start.column, b, g);
                        for(; b <= f; b++){
                            h.start.row = h.end.row = b;
                            h.start.column = b == d ? c.start.column : j.getRowWrapIndent(b);
                            h.end.column = i;
                            k = g;
                            g = i;
                            i = b + 1 < f ? j.getScreenLastRowColumn(b + 1) : b == f ? 0 : c.end.column;
                            this.drawSingleLineMarker(l, h, m + (b == d ? " ace_start" : "") + " ace_br" + a(b == d || (b == d + 1 && c.start.column), k < g, g > i, b == f), n, b == f ? 0 : 1, o);
                        }
                    };
                    this.drawMultiLineMarker = function(i, a, e, c, d) {
                        var h = this.$padding;
                        var f = c.lineHeight;
                        var g = this.$getTop(a.start.row, c);
                        var k = h + a.start.column * c.characterWidth;
                        d = d || "";
                        if (this.session.$bidiHandler.isBidiRow(a.start.row)) {
                            var b = a.clone();
                            b.end.row = b.start.row;
                            b.end.column = this.session.getLine(b.start.row).length;
                            this.drawBidiSingleLineMarker(i, b, e + " ace_br1 ace_start", c, null, d);
                        } else {
                            this.elt(e + " ace_br1 ace_start", "height:" + f + "px;" + "right:0;" + "top:" + g + "px;left:" + k + "px;" + (d || ""));
                        }
                        if (this.session.$bidiHandler.isBidiRow(a.end.row)) {
                            var b = a.clone();
                            b.start.row = b.end.row;
                            b.start.column = 0;
                            this.drawBidiSingleLineMarker(i, b, e + " ace_br12", c, null, d);
                        } else {
                            g = this.$getTop(a.end.row, c);
                            var l = a.end.column * c.characterWidth;
                            this.elt(e + " ace_br12", "height:" + f + "px;" + "width:" + l + "px;" + "top:" + g + "px;" + "left:" + h + "px;" + (d || ""));
                        }
                        f = (a.end.row - a.start.row - 1) * c.lineHeight;
                        if (f <= 0) return;
                        g = this.$getTop(a.start.row + 1, c);
                        var j = (a.start.column ? 1 : 0) | (a.end.column ? 0 : 8);
                        this.elt(e + (j ? " ace_br" + j : ""), "height:" + f + "px;" + "right:0;" + "top:" + g + "px;" + "left:" + h + "px;" + (d || ""));
                    };
                    this.drawSingleLineMarker = function(f, a, c, b, d, e) {
                        if (this.session.$bidiHandler.isBidiRow(a.start.row)) return this.drawBidiSingleLineMarker(f, a, c, b, d, e);
                        var g = b.lineHeight;
                        var h = (a.end.column + (d || 0) - a.start.column) * b.characterWidth;
                        var i = this.$getTop(a.start.row, b);
                        var j = this.$padding + a.start.column * b.characterWidth;
                        this.elt(c, "height:" + g + "px;" + "width:" + h + "px;" + "top:" + i + "px;" + "left:" + j + "px;" + (e || ""));
                    };
                    this.drawBidiSingleLineMarker = function(d, a, e, b, f, g) {
                        var h = b.lineHeight, i = this.$getTop(a.start.row, b), j = this.$padding;
                        var c = this.session.$bidiHandler.getSelections(a.start.column, a.end.column);
                        c.forEach(function(a) {
                            this.elt(e, "height:" + h + "px;" + "width:" + a.width + (f || 0) + "px;" + "top:" + i + "px;" + "left:" + (j + a.left) + "px;" + (g || ""));
                        }, this);
                    };
                    this.drawFullLineMarker = function(g, a, e, b, f) {
                        var c = this.$getTop(a.start.row, b);
                        var d = b.lineHeight;
                        if (a.start.row != a.end.row) d += this.$getTop(a.end.row, b) - c;
                        this.elt(e, "height:" + d + "px;" + "top:" + c + "px;" + "left:0;right:0;" + (f || ""));
                    };
                    this.drawScreenLineMarker = function(g, b, c, a, d) {
                        var e = this.$getTop(b.start.row, a);
                        var f = a.lineHeight;
                        this.elt(c, "height:" + f + "px;" + "top:" + e + "px;" + "left:0;right:0;" + (d || ""));
                    };
                }.call(b.prototype));
                c.Marker = b;
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
            ], function(a, c, d) {
                "use strict";
                var e = a("../lib/oop");
                var f = a("../lib/dom");
                var g = a("../lib/lang");
                var h = a("./lines").Lines;
                var i = a("../lib/event_emitter").EventEmitter;
                var b = function(a) {
                    this.dom = f;
                    this.element = this.dom.createElement("div");
                    this.element.className = "ace_layer ace_text-layer";
                    a.appendChild(this.element);
                    this.$updateEolChar = this.$updateEolChar.bind(this);
                    this.$lines = new h(this.element);
                };
                (function() {
                    e.implement(this, i);
                    this.EOF_CHAR = "\xB6";
                    this.EOL_CHAR_LF = "\xAC";
                    this.EOL_CHAR_CRLF = "\xa4";
                    this.EOL_CHAR = this.EOL_CHAR_LF;
                    this.TAB_CHAR = "\u2014";
                    this.SPACE_CHAR = "\xB7";
                    this.$padding = 0;
                    this.MAX_LINE_LENGTH = 10000;
                    this.$updateEolChar = function() {
                        var a = this.session.doc;
                        var c = a.getNewLineCharacter() == "\n" && a.getNewLineMode() != "windows";
                        var b = c ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
                        if (this.EOL_CHAR != b) {
                            this.EOL_CHAR = b;
                            return true;
                        }
                    };
                    this.setPadding = function(a) {
                        this.$padding = a;
                        this.element.style.margin = "0 " + a + "px";
                    };
                    this.getLineHeight = function() {
                        return this.$fontMetrics.$characterSize.height || 0;
                    };
                    this.getCharacterWidth = function() {
                        return this.$fontMetrics.$characterSize.width || 0;
                    };
                    this.$setFontMetrics = function(a) {
                        this.$fontMetrics = a;
                        this.$fontMetrics.on("changeCharacterSize", function(a) {
                            this._signal("changeCharacterSize", a);
                        }.bind(this));
                        this.$pollSizeChanges();
                    };
                    this.checkForSizeChanges = function() {
                        this.$fontMetrics.checkForSizeChanges();
                    };
                    this.$pollSizeChanges = function() {
                        return (this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges());
                    };
                    this.setSession = function(a) {
                        this.session = a;
                        if (a) this.$computeTabString();
                    };
                    this.showInvisibles = false;
                    this.showSpaces = false;
                    this.showTabs = false;
                    this.showEOL = false;
                    this.setShowInvisibles = function(a) {
                        if (this.showInvisibles == a) return false;
                        this.showInvisibles = a;
                        if (typeof a == "string") {
                            this.showSpaces = /tab/i.test(a);
                            this.showTabs = /space/i.test(a);
                            this.showEOL = /eol/i.test(a);
                        } else {
                            this.showSpaces = this.showTabs = this.showEOL = a;
                        }
                        this.$computeTabString();
                        return true;
                    };
                    this.displayIndentGuides = true;
                    this.setDisplayIndentGuides = function(a) {
                        if (this.displayIndentGuides == a) return false;
                        this.displayIndentGuides = a;
                        this.$computeTabString();
                        return true;
                    };
                    this.$tabStrings = [];
                    this.onChangeTabSize = this.$computeTabString = function() {
                        var c = this.session.getTabSize();
                        this.tabSize = c;
                        var d = (this.$tabStrings = [
                            0
                        ]);
                        for(var b = 1; b < c + 1; b++){
                            if (this.showTabs) {
                                var a = this.dom.createElement("span");
                                a.className = "ace_invisible ace_invisible_tab";
                                a.textContent = g.stringRepeat(this.TAB_CHAR, b);
                                d.push(a);
                            } else {
                                d.push(this.dom.createTextNode(g.stringRepeat(" ", b), this.element));
                            }
                        }
                        if (this.displayIndentGuides) {
                            this.$indentGuideRe = /\s\S| \t|\t |\s$/;
                            var e = "ace_indent-guide";
                            var h = this.showSpaces ? " ace_invisible ace_invisible_space" : "";
                            var f = this.showSpaces ? g.stringRepeat(this.SPACE_CHAR, this.tabSize) : g.stringRepeat(" ", this.tabSize);
                            var i = this.showTabs ? " ace_invisible ace_invisible_tab" : "";
                            var j = this.showTabs ? g.stringRepeat(this.TAB_CHAR, this.tabSize) : f;
                            var a = this.dom.createElement("span");
                            a.className = e + h;
                            a.textContent = f;
                            this.$tabStrings[" "] = a;
                            var a = this.dom.createElement("span");
                            a.className = e + i;
                            a.textContent = j;
                            this.$tabStrings["\t"] = a;
                        }
                    };
                    this.updateLines = function(c, k, l) {
                        if (this.config.lastRow != c.lastRow || this.config.firstRow != c.firstRow) {
                            return this.update(c);
                        }
                        this.config = c;
                        var e = Math.max(k, c.firstRow);
                        var m = Math.min(l, c.lastRow);
                        var n = this.element.childNodes;
                        var f = 0;
                        for(var a = c.firstRow; a < e; a++){
                            var b = this.session.getFoldLine(a);
                            if (b) {
                                if (b.containsRow(e)) {
                                    e = b.start.row;
                                    break;
                                } else {
                                    a = b.end.row;
                                }
                            }
                            f++;
                        }
                        var g = false;
                        var a = e;
                        var b = this.session.getNextFoldLine(a);
                        var h = b ? b.start.row : Infinity;
                        while(true){
                            if (a > h) {
                                a = b.end.row + 1;
                                b = this.session.getNextFoldLine(a, b);
                                h = b ? b.start.row : Infinity;
                            }
                            if (a > m) break;
                            var d = n[f++];
                            if (d) {
                                this.dom.removeChildren(d);
                                this.$renderLine(d, a, a == h ? b : false);
                                if (g) d.style.top = this.$lines.computeLineTop(a, c, this.session) + "px";
                                var i = c.lineHeight * this.session.getRowLength(a) + "px";
                                if (d.style.height != i) {
                                    g = true;
                                    d.style.height = i;
                                }
                            }
                            a++;
                        }
                        if (g) {
                            while(f < this.$lines.cells.length){
                                var j = this.$lines.cells[f++];
                                j.element.style.top = this.$lines.computeLineTop(j.row, c, this.session) + "px";
                            }
                        }
                    };
                    this.scrollLines = function(a) {
                        var b = this.config;
                        this.config = a;
                        if (this.$lines.pageChanged(b, a)) return this.update(a);
                        this.$lines.moveContainer(a);
                        var d = a.lastRow;
                        var e = b ? b.lastRow : -1;
                        if (!b || e < a.firstRow) return this.update(a);
                        if (d < b.firstRow) return this.update(a);
                        if (!b || b.lastRow < a.firstRow) return this.update(a);
                        if (a.lastRow < b.firstRow) return this.update(a);
                        if (b.firstRow < a.firstRow) for(var c = this.session.getFoldedRowCount(b.firstRow, a.firstRow - 1); c > 0; c--)this.$lines.shift();
                        if (b.lastRow > a.lastRow) for(var c = this.session.getFoldedRowCount(a.lastRow + 1, b.lastRow); c > 0; c--)this.$lines.pop();
                        if (a.firstRow < b.firstRow) {
                            this.$lines.unshift(this.$renderLinesFragment(a, a.firstRow, b.firstRow - 1));
                        }
                        if (a.lastRow > b.lastRow) {
                            this.$lines.push(this.$renderLinesFragment(a, b.lastRow + 1, a.lastRow));
                        }
                    };
                    this.$renderLinesFragment = function(d, i, j) {
                        var g = [];
                        var a = i;
                        var b = this.session.getNextFoldLine(a);
                        var e = b ? b.start.row : Infinity;
                        while(true){
                            if (a > e) {
                                a = b.end.row + 1;
                                b = this.session.getNextFoldLine(a, b);
                                e = b ? b.start.row : Infinity;
                            }
                            if (a > j) break;
                            var h = this.$lines.createCell(a, d, this.session);
                            var c = h.element;
                            this.dom.removeChildren(c);
                            f.setStyle(c.style, "height", this.$lines.computeLineHeight(a, d, this.session) + "px");
                            f.setStyle(c.style, "top", this.$lines.computeLineTop(a, d, this.session) + "px");
                            this.$renderLine(c, a, a == e ? b : false);
                            if (this.$useLineGroups()) {
                                c.className = "ace_line_group";
                            } else {
                                c.className = "ace_line";
                            }
                            g.push(h);
                            a++;
                        }
                        return g;
                    };
                    this.update = function(a) {
                        this.$lines.moveContainer(a);
                        this.config = a;
                        var c = a.firstRow;
                        var d = a.lastRow;
                        var b = this.$lines;
                        while(b.getLength())b.pop();
                        b.push(this.$renderLinesFragment(a, c, d));
                    };
                    this.$textToken = {
                        text: true,
                        rparen: true,
                        lparen: true
                    };
                    this.$renderToken = function(k, e, i, f) {
                        var b = this;
                        var q = /(\t)|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\uFEFF\uFFF9-\uFFFC]+)|(\u3000)|([\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g;
                        var d = this.dom.createFragment(this.element);
                        var c;
                        var h = 0;
                        while((c = q.exec(f))){
                            var r = c[1];
                            var j = c[2];
                            var l = c[3];
                            var m = c[4];
                            var n = c[5];
                            if (!b.showSpaces && j) continue;
                            var o = h != c.index ? f.slice(h, c.index) : "";
                            h = c.index + c[0].length;
                            if (o) {
                                d.appendChild(this.dom.createTextNode(o, this.element));
                            }
                            if (r) {
                                var p = b.session.getScreenTabSize(e + c.index);
                                d.appendChild(b.$tabStrings[p].cloneNode(true));
                                e += p - 1;
                            } else if (j) {
                                if (b.showSpaces) {
                                    var a = this.dom.createElement("span");
                                    a.className = "ace_invisible ace_invisible_space";
                                    a.textContent = g.stringRepeat(b.SPACE_CHAR, j.length);
                                    d.appendChild(a);
                                } else {
                                    d.appendChild(this.com.createTextNode(j, this.element));
                                }
                            } else if (l) {
                                var a = this.dom.createElement("span");
                                a.className = "ace_invisible ace_invisible_space ace_invalid";
                                a.textContent = g.stringRepeat(b.SPACE_CHAR, l.length);
                                d.appendChild(a);
                            } else if (m) {
                                e += 1;
                                var a = this.dom.createElement("span");
                                a.style.width = b.config.characterWidth * 2 + "px";
                                a.className = b.showSpaces ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                                a.textContent = b.showSpaces ? b.SPACE_CHAR : m;
                                d.appendChild(a);
                            } else if (n) {
                                e += 1;
                                var a = this.dom.createElement("span");
                                a.style.width = b.config.characterWidth * 2 + "px";
                                a.className = "ace_cjk";
                                a.textContent = n;
                                d.appendChild(a);
                            }
                        }
                        d.appendChild(this.dom.createTextNode(h ? f.slice(h) : f, this.element));
                        if (!this.$textToken[i.type]) {
                            var s = "ace_" + i.type.replace(/\./g, " ace_");
                            var a = this.dom.createElement("span");
                            if (i.type == "fold") a.style.width = i.value.length * this.config.characterWidth + "px";
                            a.className = s;
                            a.appendChild(d);
                            k.appendChild(a);
                        } else {
                            k.appendChild(d);
                        }
                        return e + f.length;
                    };
                    this.renderIndentGuide = function(d, b, e) {
                        var a = b.search(this.$indentGuideRe);
                        if (a <= 0 || a >= e) return b;
                        if (b[0] == " ") {
                            a -= a % this.tabSize;
                            var f = a / this.tabSize;
                            for(var c = 0; c < f; c++){
                                d.appendChild(this.$tabStrings[" "].cloneNode(true));
                            }
                            return b.substr(a);
                        } else if (b[0] == "\t") {
                            for(var c = 0; c < a; c++){
                                d.appendChild(this.$tabStrings["\t"].cloneNode(true));
                            }
                            return b.substr(a);
                        }
                        return b;
                    };
                    this.$createLineElement = function(b) {
                        var a = this.dom.createElement("div");
                        a.className = "ace_line";
                        a.style.height = this.config.lineHeight + "px";
                        return a;
                    };
                    this.$renderWrappedLine = function(j, k, f) {
                        var b = 0;
                        var l = 0;
                        var e = f[0];
                        var d = 0;
                        var c = this.$createLineElement();
                        j.appendChild(c);
                        for(var h = 0; h < k.length; h++){
                            var i = k[h];
                            var a = i.value;
                            if (h == 0 && this.displayIndentGuides) {
                                b = a.length;
                                a = this.renderIndentGuide(c, a, e);
                                if (!a) continue;
                                b -= a.length;
                            }
                            if (b + a.length < e) {
                                d = this.$renderToken(c, d, i, a);
                                b += a.length;
                            } else {
                                while(b + a.length >= e){
                                    d = this.$renderToken(c, d, i, a.substring(0, e - b));
                                    a = a.substring(e - b);
                                    b = e;
                                    c = this.$createLineElement();
                                    j.appendChild(c);
                                    c.appendChild(this.dom.createTextNode(g.stringRepeat("\xa0", f.indent), this.element));
                                    l++;
                                    d = 0;
                                    e = f[l] || Number.MAX_VALUE;
                                }
                                if (a.length != 0) {
                                    b += a.length;
                                    d = this.$renderToken(c, d, i, a);
                                }
                            }
                        }
                        if (f[f.length - 1] > this.MAX_LINE_LENGTH) this.$renderOverflowMessage(c, d, null, "", true);
                    };
                    this.$renderSimpleLine = function(d, e) {
                        var b = 0;
                        var c = e[0];
                        var a = c.value;
                        if (this.displayIndentGuides) a = this.renderIndentGuide(d, a);
                        if (a) b = this.$renderToken(d, b, c, a);
                        for(var f = 1; f < e.length; f++){
                            c = e[f];
                            a = c.value;
                            if (b + a.length > this.MAX_LINE_LENGTH) return this.$renderOverflowMessage(d, b, c, a);
                            b = this.$renderToken(d, b, c, a);
                        }
                    };
                    this.$renderOverflowMessage = function(b, c, d, e, f) {
                        d && this.$renderToken(b, c, d, e.slice(0, this.MAX_LINE_LENGTH - c));
                        var a = this.dom.createElement("span");
                        a.className = "ace_inline_button ace_keyword ace_toggle_wrap";
                        a.textContent = f ? "<hide>" : "<click to see more...>";
                        b.appendChild(a);
                    };
                    this.$renderLine = function(c, d, b) {
                        if (!b && b != false) b = this.session.getFoldLine(d);
                        if (b) var e = this.$getFoldLineTokens(d, b);
                        else var e = this.session.getTokens(d);
                        var a = c;
                        if (e.length) {
                            var f = this.session.getRowSplitData(d);
                            if (f && f.length) {
                                this.$renderWrappedLine(c, e, f);
                                var a = c.lastChild;
                            } else {
                                var a = c;
                                if (this.$useLineGroups()) {
                                    a = this.$createLineElement();
                                    c.appendChild(a);
                                }
                                this.$renderSimpleLine(a, e);
                            }
                        } else if (this.$useLineGroups()) {
                            a = this.$createLineElement();
                            c.appendChild(a);
                        }
                        if (this.showEOL && a) {
                            if (b) d = b.end.row;
                            var g = this.dom.createElement("span");
                            g.className = "ace_invisible ace_invisible_eol";
                            g.textContent = d == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR;
                            a.appendChild(g);
                        }
                    };
                    this.$getFoldLineTokens = function(b, a) {
                        var c = this.session;
                        var d = [];
                        function e(b, f, g) {
                            var a = 0, c = 0;
                            while(c + b[a].value.length < f){
                                c += b[a].value.length;
                                a++;
                                if (a == b.length) return;
                            }
                            if (c != f) {
                                var e = b[a].value.substring(f - c);
                                if (e.length > g - f) e = e.substring(0, g - f);
                                d.push({
                                    type: b[a].type,
                                    value: e
                                });
                                c = f + e.length;
                                a += 1;
                            }
                            while(c < g && a < b.length){
                                var e = b[a].value;
                                if (e.length + c > g) {
                                    d.push({
                                        type: b[a].type,
                                        value: e.substring(0, g - c)
                                    });
                                } else d.push(b[a]);
                                c += e.length;
                                a += 1;
                            }
                        }
                        var f = c.getTokens(b);
                        a.walk(function(a, b, g, h, i) {
                            if (a != null) {
                                d.push({
                                    type: "fold",
                                    value: a
                                });
                            } else {
                                if (i) f = c.getTokens(b);
                                if (f.length) e(f, h, g);
                            }
                        }, a.end.row, this.session.getLine(a.end.row).length);
                        return d;
                    };
                    this.$useLineGroups = function() {
                        return this.session.getUseWrapMode();
                    };
                    this.destroy = function() {};
                }.call(b.prototype));
                c.Text = b;
            });
            ace.define("ace/layer/cursor", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(b, c, d) {
                "use strict";
                var e = b("../lib/dom");
                var a = function(a) {
                    this.element = e.createElement("div");
                    this.element.className = "ace_layer ace_cursor-layer";
                    a.appendChild(this.element);
                    this.isVisible = false;
                    this.isBlinking = true;
                    this.blinkInterval = 1000;
                    this.smoothBlinking = false;
                    this.cursors = [];
                    this.cursor = this.addCursor();
                    e.addCssClass(this.element, "ace_hidden-cursors");
                    this.$updateCursors = this.$updateOpacity.bind(this);
                };
                (function() {
                    this.$updateOpacity = function(c) {
                        var a = this.cursors;
                        for(var b = a.length; b--;)e.setStyle(a[b].style, "opacity", c ? "" : "0");
                    };
                    this.$startCssAnimation = function() {
                        var a = this.cursors;
                        for(var b = a.length; b--;)a[b].style.animationDuration = this.blinkInterval + "ms";
                        this.$isAnimating = true;
                        setTimeout(function() {
                            if (this.$isAnimating) {
                                e.addCssClass(this.element, "ace_animate-blinking");
                            }
                        }.bind(this));
                    };
                    this.$stopCssAnimation = function() {
                        this.$isAnimating = false;
                        e.removeCssClass(this.element, "ace_animate-blinking");
                    };
                    this.$padding = 0;
                    this.setPadding = function(a) {
                        this.$padding = a;
                    };
                    this.setSession = function(a) {
                        this.session = a;
                    };
                    this.setBlinking = function(a) {
                        if (a != this.isBlinking) {
                            this.isBlinking = a;
                            this.restartTimer();
                        }
                    };
                    this.setBlinkInterval = function(a) {
                        if (a != this.blinkInterval) {
                            this.blinkInterval = a;
                            this.restartTimer();
                        }
                    };
                    this.setSmoothBlinking = function(a) {
                        if (a != this.smoothBlinking) {
                            this.smoothBlinking = a;
                            e.setCssClass(this.element, "ace_smooth-blinking", a);
                            this.$updateCursors(true);
                            this.restartTimer();
                        }
                    };
                    this.addCursor = function() {
                        var a = e.createElement("div");
                        a.className = "ace_cursor";
                        this.element.appendChild(a);
                        this.cursors.push(a);
                        return a;
                    };
                    this.removeCursor = function() {
                        if (this.cursors.length > 1) {
                            var a = this.cursors.pop();
                            a.parentNode.removeChild(a);
                            return a;
                        }
                    };
                    this.hideCursor = function() {
                        this.isVisible = false;
                        e.addCssClass(this.element, "ace_hidden-cursors");
                        this.restartTimer();
                    };
                    this.showCursor = function() {
                        this.isVisible = true;
                        e.removeCssClass(this.element, "ace_hidden-cursors");
                        this.restartTimer();
                    };
                    this.restartTimer = function() {
                        var a = this.$updateCursors;
                        clearInterval(this.intervalId);
                        clearTimeout(this.timeoutId);
                        this.$stopCssAnimation();
                        if (this.smoothBlinking) {
                            this.$isSmoothBlinking = false;
                            e.removeCssClass(this.element, "ace_smooth-blinking");
                        }
                        a(true);
                        if (!this.isBlinking || !this.blinkInterval || !this.isVisible) {
                            this.$stopCssAnimation();
                            return;
                        }
                        if (this.smoothBlinking) {
                            this.$isSmoothBlinking = true;
                            setTimeout(function() {
                                if (this.$isSmoothBlinking) {
                                    e.addCssClass(this.element, "ace_smooth-blinking");
                                }
                            }.bind(this));
                        }
                        if (e.HAS_CSS_ANIMATION) {
                            this.$startCssAnimation();
                        } else {
                            var b = function() {
                                this.timeoutId = setTimeout(function() {
                                    a(false);
                                }, 0.6 * this.blinkInterval);
                            }.bind(this);
                            this.intervalId = setInterval(function() {
                                a(true);
                                b();
                            }, this.blinkInterval);
                            b();
                        }
                    };
                    this.getPixelPosition = function(a, c) {
                        if (!this.config || !this.session) return {
                            left: 0,
                            top: 0
                        };
                        if (!a) a = this.session.selection.getCursor();
                        var b = this.session.documentToScreenPosition(a);
                        var d = this.$padding + (this.session.$bidiHandler.isBidiRow(b.row, a.row) ? this.session.$bidiHandler.getPosLeft(b.column) : b.column * this.config.characterWidth);
                        var e = (b.row - (c ? this.config.firstRowScreen : 0)) * this.config.lineHeight;
                        return {
                            left: d,
                            top: e
                        };
                    };
                    this.isCursorInView = function(a, b) {
                        return (a.top >= 0 && a.top < b.maxHeight);
                    };
                    this.update = function(a) {
                        this.config = a;
                        var c = this.session.$selectionMarkers;
                        var d = 0, h = 0;
                        if (c === undefined || c.length === 0) {
                            c = [
                                {
                                    cursor: null
                                }
                            ];
                        }
                        for(var d = 0, i = c.length; d < i; d++){
                            var b = this.getPixelPosition(c[d].cursor, true);
                            if ((b.top > a.height + a.offset || b.top < 0) && d > 1) {
                                continue;
                            }
                            var g = this.cursors[h++] || this.addCursor();
                            var f = g.style;
                            if (!this.drawCursor) {
                                if (!this.isCursorInView(b, a)) {
                                    e.setStyle(f, "display", "none");
                                } else {
                                    e.setStyle(f, "display", "block");
                                    e.translate(g, b.left, b.top);
                                    e.setStyle(f, "width", Math.round(a.characterWidth) + "px");
                                    e.setStyle(f, "height", a.lineHeight + "px");
                                }
                            } else {
                                this.drawCursor(g, b, a, c[d], this.session);
                            }
                        }
                        while(this.cursors.length > h)this.removeCursor();
                        var j = this.session.getOverwrite();
                        this.$setOverwrite(j);
                        this.$pixelPos = b;
                        this.restartTimer();
                    };
                    this.drawCursor = null;
                    this.$setOverwrite = function(a) {
                        if (a != this.overwrite) {
                            this.overwrite = a;
                            if (a) e.addCssClass(this.element, "ace_overwrite-cursors");
                            else e.removeCssClass(this.element, "ace_overwrite-cursors");
                        }
                    };
                    this.destroy = function() {
                        clearInterval(this.intervalId);
                        clearTimeout(this.timeoutId);
                    };
                }.call(a.prototype));
                c.Cursor = a;
            });
            ace.define("ace/scrollbar", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/event_emitter", 
            ], function(c, a, g) {
                "use strict";
                var f = c("./lib/oop");
                var h = c("./lib/dom");
                var i = c("./lib/event");
                var j = c("./lib/event_emitter").EventEmitter;
                var k = 0x8000;
                var e = function(a) {
                    this.element = h.createElement("div");
                    this.element.className = "ace_scrollbar ace_scrollbar" + this.classSuffix;
                    this.inner = h.createElement("div");
                    this.inner.className = "ace_scrollbar-inner";
                    this.inner.textContent = "\xa0";
                    this.element.appendChild(this.inner);
                    a.appendChild(this.element);
                    this.setVisible(false);
                    this.skipEvent = false;
                    i.addListener(this.element, "scroll", this.onScroll.bind(this));
                    i.addListener(this.element, "mousedown", i.preventDefault);
                };
                (function() {
                    f.implement(this, j);
                    this.setVisible = function(a) {
                        this.element.style.display = a ? "" : "none";
                        this.isVisible = a;
                        this.coeff = 1;
                    };
                }.call(e.prototype));
                var b = function(a, b) {
                    e.call(this, a);
                    this.scrollTop = 0;
                    this.scrollHeight = 0;
                    b.$scrollbarWidth = this.width = h.scrollbarWidth(a.ownerDocument);
                    this.inner.style.width = this.element.style.width = (this.width || 15) + 5 + "px";
                    this.$minWidth = 0;
                };
                f.inherits(b, e);
                (function() {
                    this.classSuffix = "-v";
                    this.onScroll = function() {
                        if (!this.skipEvent) {
                            this.scrollTop = this.element.scrollTop;
                            if (this.coeff != 1) {
                                var a = this.element.clientHeight / this.scrollHeight;
                                this.scrollTop = (this.scrollTop * (1 - a)) / (this.coeff - a);
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
                    this.setHeight = function(a) {
                        this.element.style.height = a + "px";
                    };
                    this.setInnerHeight = this.setScrollHeight = function(a) {
                        this.scrollHeight = a;
                        if (a > k) {
                            this.coeff = k / a;
                            a = k;
                        } else if (this.coeff != 1) {
                            this.coeff = 1;
                        }
                        this.inner.style.height = a + "px";
                    };
                    this.setScrollTop = function(a) {
                        if (this.scrollTop != a) {
                            this.skipEvent = true;
                            this.scrollTop = a;
                            this.element.scrollTop = a * this.coeff;
                        }
                    };
                }.call(b.prototype));
                var d = function(a, b) {
                    e.call(this, a);
                    this.scrollLeft = 0;
                    this.height = b.$scrollbarWidth;
                    this.inner.style.height = this.element.style.height = (this.height || 15) + 5 + "px";
                };
                f.inherits(d, e);
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
                    this.setWidth = function(a) {
                        this.element.style.width = a + "px";
                    };
                    this.setInnerWidth = function(a) {
                        this.inner.style.width = a + "px";
                    };
                    this.setScrollWidth = function(a) {
                        this.inner.style.width = a + "px";
                    };
                    this.setScrollLeft = function(a) {
                        if (this.scrollLeft != a) {
                            this.skipEvent = true;
                            this.scrollLeft = this.element.scrollLeft = a;
                        }
                    };
                }.call(d.prototype));
                a.ScrollBar = b;
                a.ScrollBarV = b;
                a.ScrollBarH = d;
                a.VScrollBar = b;
                a.HScrollBar = d;
            });
            ace.define("ace/renderloop", [
                "require",
                "exports",
                "module",
                "ace/lib/event"
            ], function(b, c, d) {
                "use strict";
                var e = b("./lib/event");
                var a = function(a, b) {
                    this.onRender = a;
                    this.pending = false;
                    this.changes = 0;
                    this.$recursionLimit = 2;
                    this.window = b || window;
                    var c = this;
                    this._flush = function(b) {
                        c.pending = false;
                        var a = c.changes;
                        if (a) {
                            e.blockIdle(100);
                            c.changes = 0;
                            c.onRender(a);
                        }
                        if (c.changes) {
                            if (c.$recursionLimit-- < 0) return;
                            c.schedule();
                        } else {
                            c.$recursionLimit = 2;
                        }
                    };
                };
                (function() {
                    this.schedule = function(a) {
                        this.changes = this.changes | a;
                        if (this.changes && !this.pending) {
                            e.nextFrame(this._flush);
                            this.pending = true;
                        }
                    };
                    this.clear = function(b) {
                        var a = this.changes;
                        this.changes = 0;
                        return a;
                    };
                }.call(a.prototype));
                c.RenderLoop = a;
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
            ], function(a, b, d) {
                var e = a("../lib/oop");
                var f = a("../lib/dom");
                var g = a("../lib/lang");
                var h = a("../lib/event");
                var i = a("../lib/useragent");
                var j = a("../lib/event_emitter").EventEmitter;
                var k = 256;
                var l = typeof ResizeObserver == "function";
                var m = 200;
                var c = (b.FontMetrics = function(a) {
                    this.el = f.createElement("div");
                    this.$setMeasureNodeStyles(this.el.style, true);
                    this.$main = f.createElement("div");
                    this.$setMeasureNodeStyles(this.$main.style);
                    this.$measureNode = f.createElement("div");
                    this.$setMeasureNodeStyles(this.$measureNode.style);
                    this.el.appendChild(this.$main);
                    this.el.appendChild(this.$measureNode);
                    a.appendChild(this.el);
                    this.$measureNode.textContent = g.stringRepeat("X", k);
                    this.$characterSize = {
                        width: 0,
                        height: 0
                    };
                    if (l) this.$addObserver();
                    else this.checkForSizeChanges();
                });
                (function() {
                    e.implement(this, j);
                    this.$characterSize = {
                        width: 0,
                        height: 0
                    };
                    this.$setMeasureNodeStyles = function(a, b) {
                        a.width = a.height = "auto";
                        a.left = a.top = "0px";
                        a.visibility = "hidden";
                        a.position = "absolute";
                        a.whiteSpace = "pre";
                        if (i.isIE < 8) {
                            a["font-family"] = "inherit";
                        } else {
                            a.font = "inherit";
                        }
                        a.overflow = b ? "hidden" : "visible";
                    };
                    this.checkForSizeChanges = function(a) {
                        if (a === undefined) a = this.$measureSizes();
                        if (a && (this.$characterSize.width !== a.width || this.$characterSize.height !== a.height)) {
                            this.$measureNode.style.fontWeight = "bold";
                            var b = this.$measureSizes();
                            this.$measureNode.style.fontWeight = "";
                            this.$characterSize = a;
                            this.charSizes = Object.create(null);
                            this.allowBoldFonts = b && b.width === a.width && b.height === a.height;
                            this._emit("changeCharacterSize", {
                                data: a
                            });
                        }
                    };
                    this.$addObserver = function() {
                        var a = this;
                        this.$observer = new window.ResizeObserver(function(b) {
                            a.checkForSizeChanges();
                        });
                        this.$observer.observe(this.$measureNode);
                    };
                    this.$pollSizeChanges = function() {
                        if (this.$pollSizeChangesTimer || this.$observer) return this.$pollSizeChangesTimer;
                        var a = this;
                        return (this.$pollSizeChangesTimer = h.onIdle(function b() {
                            a.checkForSizeChanges();
                            h.onIdle(b, 500);
                        }, 500));
                    };
                    this.setPolling = function(a) {
                        if (a) {
                            this.$pollSizeChanges();
                        } else if (this.$pollSizeChangesTimer) {
                            clearInterval(this.$pollSizeChangesTimer);
                            this.$pollSizeChangesTimer = 0;
                        }
                    };
                    this.$measureSizes = function(b) {
                        var a = {
                            height: (b || this.$measureNode).clientHeight,
                            width: (b || this.$measureNode).clientWidth / k
                        };
                        if (a.width === 0 || a.height === 0) return null;
                        return a;
                    };
                    this.$measureCharWidth = function(a) {
                        this.$main.textContent = g.stringRepeat(a, k);
                        var b = this.$main.getBoundingClientRect();
                        return b.width / k;
                    };
                    this.getCharacterWidth = function(a) {
                        var b = this.charSizes[a];
                        if (b === undefined) {
                            b = this.charSizes[a] = this.$measureCharWidth(a) / this.$characterSize.width;
                        }
                        return b;
                    };
                    this.destroy = function() {
                        clearInterval(this.$pollSizeChangesTimer);
                        if (this.$observer) this.$observer.disconnect();
                        if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
                    };
                    this.$getZoom = function b(a) {
                        if (!a || !a.parentElement) return 1;
                        return ((window.getComputedStyle(a).zoom || 1) * b(a.parentElement));
                    };
                    this.$initTransformMeasureNodes = function() {
                        var a = function(a, b) {
                            return [
                                "div",
                                {
                                    style: "position: absolute;top:" + a + "px;left:" + b + "px;"
                                }, 
                            ];
                        };
                        this.els = f.buildDom([
                            a(0, 0),
                            a(m, 0),
                            a(0, m),
                            a(m, m)
                        ], this.el);
                    };
                    this.transformCoordinates = function(e, n) {
                        if (e) {
                            var r = this.$getZoom(this.el);
                            e = b(1 / r, e);
                        }
                        function o(a, b, c) {
                            var d = a[1] * b[0] - a[0] * b[1];
                            return [
                                (-b[1] * c[0] + b[0] * c[1]) / d,
                                (+a[1] * c[0] - a[0] * c[1]) / d, 
                            ];
                        }
                        function a(a, b) {
                            return [
                                a[0] - b[0],
                                a[1] - b[1]
                            ];
                        }
                        function f(a, b) {
                            return [
                                a[0] + b[0],
                                a[1] + b[1]
                            ];
                        }
                        function b(a, b) {
                            return [
                                a * b[0],
                                a * b[1]
                            ];
                        }
                        if (!this.els) this.$initTransformMeasureNodes();
                        function g(b) {
                            var a = b.getBoundingClientRect();
                            return [
                                a.left,
                                a.top
                            ];
                        }
                        var d = g(this.els[0]);
                        var i = g(this.els[1]);
                        var j = g(this.els[2]);
                        var k = g(this.els[3]);
                        var c = o(a(k, i), a(k, j), a(f(i, j), f(k, d)));
                        var p = b(1 + c[0], a(i, d));
                        var q = b(1 + c[1], a(j, d));
                        if (n) {
                            var h = n;
                            var s = (c[0] * h[0]) / m + (c[1] * h[1]) / m + 1;
                            var t = f(b(h[0], p), b(h[1], q));
                            return f(b(1 / s / m, t), d);
                        }
                        var l = a(e, d);
                        var u = o(a(p, b(c[0], l)), a(q, b(c[1], l)), l);
                        return b(m, u);
                    };
                }.call(c.prototype));
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
            ], function(a, d, h) {
                "use strict";
                var i = a("./lib/oop");
                var e = a("./lib/dom");
                var f = a("./config");
                var j = a("./layer/gutter").Gutter;
                var k = a("./layer/marker").Marker;
                var l = a("./layer/text").Text;
                var m = a("./layer/cursor").Cursor;
                var n = a("./scrollbar").HScrollBar;
                var o = a("./scrollbar").VScrollBar;
                var p = a("./renderloop").RenderLoop;
                var q = a("./layer/font_metrics").FontMetrics;
                var r = a("./lib/event_emitter").EventEmitter;
                var g = '\
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
                var b = a("./lib/useragent");
                var s = b.isIE;
                e.importCssString(g, "ace_editor.css", false);
                var c = function(a, c) {
                    var g = this;
                    this.container = a || e.createElement("div");
                    e.addCssClass(this.container, "ace_editor");
                    if (e.HI_DPI) e.addCssClass(this.container, "ace_hidpi");
                    this.setTheme(c);
                    if (f.get("useStrictCSP") == null) f.set("useStrictCSP", false);
                    this.$gutter = e.createElement("div");
                    this.$gutter.className = "ace_gutter";
                    this.container.appendChild(this.$gutter);
                    this.$gutter.setAttribute("aria-hidden", true);
                    this.scroller = e.createElement("div");
                    this.scroller.className = "ace_scroller";
                    this.container.appendChild(this.scroller);
                    this.content = e.createElement("div");
                    this.content.className = "ace_content";
                    this.scroller.appendChild(this.content);
                    this.$gutterLayer = new j(this.$gutter);
                    this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));
                    this.$markerBack = new k(this.content);
                    var d = (this.$textLayer = new l(this.content));
                    this.canvas = d.element;
                    this.$markerFront = new k(this.content);
                    this.$cursorLayer = new m(this.content);
                    this.$horizScroll = false;
                    this.$vScroll = false;
                    this.scrollBar = this.scrollBarV = new o(this.container, this);
                    this.scrollBarH = new n(this.container, this);
                    this.scrollBarV.on("scroll", function(a) {
                        if (!g.$scrollAnimation) g.session.setScrollTop(a.data - g.scrollMargin.top);
                    });
                    this.scrollBarH.on("scroll", function(a) {
                        if (!g.$scrollAnimation) g.session.setScrollLeft(a.data - g.scrollMargin.left);
                    });
                    this.scrollTop = 0;
                    this.scrollLeft = 0;
                    this.cursorPos = {
                        row: 0,
                        column: 0
                    };
                    this.$fontMetrics = new q(this.container);
                    this.$textLayer.$setFontMetrics(this.$fontMetrics);
                    this.$textLayer.on("changeCharacterSize", function(a) {
                        g.updateCharacterSize();
                        g.onResize(true, g.gutterWidth, g.$size.width, g.$size.height);
                        g._signal("changeCharacterSize", a);
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
                    this.$keepTextAreaAtCursor = !b.isIOS;
                    this.$loop = new p(this.$renderChanges.bind(this), this.container.ownerDocument.defaultView);
                    this.$loop.schedule(this.CHANGE_FULL);
                    this.updateCharacterSize();
                    this.setPadding(4);
                    f.resetOptions(this);
                    f._signal("renderer", this);
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
                    i.implement(this, r);
                    this.updateCharacterSize = function() {
                        if (this.$textLayer.allowBoldFonts != this.$allowBoldFonts) {
                            this.$allowBoldFonts = this.$textLayer.allowBoldFonts;
                            this.setStyle("ace_nobold", !this.$allowBoldFonts);
                        }
                        this.layerConfig.characterWidth = this.characterWidth = this.$textLayer.getCharacterWidth();
                        this.layerConfig.lineHeight = this.lineHeight = this.$textLayer.getLineHeight();
                        this.$updatePrintMargin();
                        e.setStyle(this.scroller.style, "line-height", this.lineHeight + "px");
                    };
                    this.setSession = function(a) {
                        if (this.session) this.session.doc.off("changeNewLineMode", this.onChangeNewLineMode);
                        this.session = a;
                        if (a && this.scrollMargin.top && a.getScrollTop() <= 0) a.setScrollTop(-this.scrollMargin.top);
                        this.$cursorLayer.setSession(a);
                        this.$markerBack.setSession(a);
                        this.$markerFront.setSession(a);
                        this.$gutterLayer.setSession(a);
                        this.$textLayer.setSession(a);
                        if (!a) return;
                        this.$loop.schedule(this.CHANGE_FULL);
                        this.session.$setFontMetrics(this.$fontMetrics);
                        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
                        this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this);
                        this.onChangeNewLineMode();
                        this.session.doc.on("changeNewLineMode", this.onChangeNewLineMode);
                    };
                    this.updateLines = function(b, a, c) {
                        if (a === undefined) a = Infinity;
                        if (!this.$changedLines) {
                            this.$changedLines = {
                                firstRow: b,
                                lastRow: a
                            };
                        } else {
                            if (this.$changedLines.firstRow > b) this.$changedLines.firstRow = b;
                            if (this.$changedLines.lastRow < a) this.$changedLines.lastRow = a;
                        }
                        if (this.$changedLines.lastRow < this.layerConfig.firstRow) {
                            if (c) this.$changedLines.lastRow = this.layerConfig.lastRow;
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
                    this.updateFull = function(a) {
                        if (a) this.$renderChanges(this.CHANGE_FULL, true);
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
                    this.onResize = function(a, f, b, c) {
                        if (this.resizing > 2) return;
                        else if (this.resizing > 0) this.resizing++;
                        else this.resizing = a ? 1 : 0;
                        var d = this.container;
                        if (!c) c = d.clientHeight || d.scrollHeight;
                        if (!b) b = d.clientWidth || d.scrollWidth;
                        var e = this.$updateCachedSize(a, f, b, c);
                        if (!this.$size.scrollerHeight || (!b && !c)) return (this.resizing = 0);
                        if (a) this.$gutterLayer.$padding = null;
                        if (a) this.$renderChanges(e | this.$changes, true);
                        else this.$loop.schedule(e | this.$changes);
                        if (this.resizing) this.resizing = 0;
                        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
                    };
                    this.$updateCachedSize = function(g, c, d, f) {
                        f -= this.$extraHeight || 0;
                        var b = 0;
                        var a = this.$size;
                        var i = {
                            width: a.width,
                            height: a.height,
                            scrollerHeight: a.scrollerHeight,
                            scrollerWidth: a.scrollerWidth
                        };
                        if (f && (g || a.height != f)) {
                            a.height = f;
                            b |= this.CHANGE_SIZE;
                            a.scrollerHeight = a.height;
                            if (this.$horizScroll) a.scrollerHeight -= this.scrollBarH.getHeight();
                            this.scrollBarV.element.style.bottom = this.scrollBarH.getHeight() + "px";
                            b = b | this.CHANGE_SCROLL;
                        }
                        if (d && (g || a.width != d)) {
                            b |= this.CHANGE_SIZE;
                            a.width = d;
                            if (c == null) c = this.$showGutter ? this.$gutter.offsetWidth : 0;
                            this.gutterWidth = c;
                            e.setStyle(this.scrollBarH.element.style, "left", c + "px");
                            e.setStyle(this.scroller.style, "left", c + this.margin.left + "px");
                            a.scrollerWidth = Math.max(0, d - c - this.scrollBarV.getWidth() - this.margin.h);
                            e.setStyle(this.$gutter.style, "left", this.margin.left + "px");
                            var h = this.scrollBarV.getWidth() + "px";
                            e.setStyle(this.scrollBarH.element.style, "right", h);
                            e.setStyle(this.scroller.style, "right", h);
                            e.setStyle(this.scroller.style, "bottom", this.scrollBarH.getHeight());
                            if ((this.session && this.session.getUseWrapMode() && this.adjustWrapLimit()) || g) {
                                b |= this.CHANGE_FULL;
                            }
                        }
                        a.$dirty = !d || !f;
                        if (b) this._signal("resize", i);
                        return b;
                    };
                    this.onGutterResize = function(b) {
                        var a = this.$showGutter ? b : 0;
                        if (a != this.gutterWidth) this.$changes |= this.$updateCachedSize(true, a, this.$size.width, this.$size.height);
                        if (this.session.getUseWrapMode() && this.adjustWrapLimit()) {
                            this.$loop.schedule(this.CHANGE_FULL);
                        } else if (this.$size.$dirty) {
                            this.$loop.schedule(this.CHANGE_FULL);
                        } else {
                            this.$computeLayerConfig();
                        }
                    };
                    this.adjustWrapLimit = function() {
                        var a = this.$size.scrollerWidth - this.$padding * 2;
                        var b = Math.floor(a / this.characterWidth);
                        return this.session.adjustWrapLimit(b, this.$showPrintMargin && this.$printMarginColumn);
                    };
                    this.setAnimatedScroll = function(a) {
                        this.setOption("animatedScroll", a);
                    };
                    this.getAnimatedScroll = function() {
                        return this.$animatedScroll;
                    };
                    this.setShowInvisibles = function(a) {
                        this.setOption("showInvisibles", a);
                        this.session.$bidiHandler.setShowInvisibles(a);
                    };
                    this.getShowInvisibles = function() {
                        return this.getOption("showInvisibles");
                    };
                    this.getDisplayIndentGuides = function() {
                        return this.getOption("displayIndentGuides");
                    };
                    this.setDisplayIndentGuides = function(a) {
                        this.setOption("displayIndentGuides", a);
                    };
                    this.setShowPrintMargin = function(a) {
                        this.setOption("showPrintMargin", a);
                    };
                    this.getShowPrintMargin = function() {
                        return this.getOption("showPrintMargin");
                    };
                    this.setPrintMarginColumn = function(a) {
                        this.setOption("printMarginColumn", a);
                    };
                    this.getPrintMarginColumn = function() {
                        return this.getOption("printMarginColumn");
                    };
                    this.getShowGutter = function() {
                        return this.getOption("showGutter");
                    };
                    this.setShowGutter = function(a) {
                        return this.setOption("showGutter", a);
                    };
                    this.getFadeFoldWidgets = function() {
                        return this.getOption("fadeFoldWidgets");
                    };
                    this.setFadeFoldWidgets = function(a) {
                        this.setOption("fadeFoldWidgets", a);
                    };
                    this.setHighlightGutterLine = function(a) {
                        this.setOption("highlightGutterLine", a);
                    };
                    this.getHighlightGutterLine = function() {
                        return this.getOption("highlightGutterLine");
                    };
                    this.$updatePrintMargin = function() {
                        if (!this.$showPrintMargin && !this.$printMarginEl) return;
                        if (!this.$printMarginEl) {
                            var a = e.createElement("div");
                            a.className = "ace_layer ace_print-margin-layer";
                            this.$printMarginEl = e.createElement("div");
                            this.$printMarginEl.className = "ace_print-margin";
                            a.appendChild(this.$printMarginEl);
                            this.content.insertBefore(a, this.content.firstChild);
                        }
                        var b = this.$printMarginEl.style;
                        b.left = Math.round(this.characterWidth * this.$printMarginColumn + this.$padding) + "px";
                        b.visibility = this.$showPrintMargin ? "visible" : "hidden";
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
                        var h = this.textarea.style;
                        var a = this.$composition;
                        if (!this.$keepTextAreaAtCursor && !a) {
                            e.translate(this.textarea, -100, 0);
                            return;
                        }
                        var f = this.$cursorLayer.$pixelPos;
                        if (!f) return;
                        if (a && a.markerRange) f = this.$cursorLayer.getPixelPosition(a.markerRange.start, true);
                        var i = this.layerConfig;
                        var b = f.top;
                        var c = f.left;
                        b -= i.offset;
                        var g = a && a.useTextareaForIME ? this.lineHeight : s ? 0 : 1;
                        if (b < 0 || b > i.height - g) {
                            e.translate(this.textarea, 0, 0);
                            return;
                        }
                        var d = 1;
                        var j = this.$size.height - g;
                        if (!a) {
                            b += this.lineHeight;
                        } else {
                            if (a.useTextareaForIME) {
                                var k = this.textarea.value;
                                d = this.characterWidth * this.session.$getStringScreenWidth(k)[0];
                            } else {
                                b += this.lineHeight + 2;
                            }
                        }
                        c -= this.scrollLeft;
                        if (c > this.$size.scrollerWidth - d) c = this.$size.scrollerWidth - d;
                        c += this.gutterWidth + this.margin.left;
                        e.setStyle(h, "height", g + "px");
                        e.setStyle(h, "width", d + "px");
                        e.translate(this.textarea, Math.min(c, this.$size.scrollerWidth - d), Math.min(b, j));
                    };
                    this.getFirstVisibleRow = function() {
                        return this.layerConfig.firstRow;
                    };
                    this.getFirstFullyVisibleRow = function() {
                        return (this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1));
                    };
                    this.getLastFullyVisibleRow = function() {
                        var a = this.layerConfig;
                        var b = a.lastRow;
                        var c = this.session.documentToScreenRow(b, 0) * a.lineHeight;
                        if (c - this.session.getScrollTop() > a.height - a.lineHeight) return b - 1;
                        return b;
                    };
                    this.getLastVisibleRow = function() {
                        return this.layerConfig.lastRow;
                    };
                    this.$padding = null;
                    this.setPadding = function(a) {
                        this.$padding = a;
                        this.$textLayer.setPadding(a);
                        this.$cursorLayer.setPadding(a);
                        this.$markerFront.setPadding(a);
                        this.$markerBack.setPadding(a);
                        this.$loop.schedule(this.CHANGE_FULL);
                        this.$updatePrintMargin();
                    };
                    this.setScrollMargin = function(b, c, d, e) {
                        var a = this.scrollMargin;
                        a.top = b | 0;
                        a.bottom = c | 0;
                        a.right = e | 0;
                        a.left = d | 0;
                        a.v = a.top + a.bottom;
                        a.h = a.left + a.right;
                        if (a.top && this.scrollTop <= 0 && this.session) this.session.setScrollTop(-a.top);
                        this.updateFull();
                    };
                    this.setMargin = function(b, c, d, e) {
                        var a = this.margin;
                        a.top = b | 0;
                        a.bottom = c | 0;
                        a.right = e | 0;
                        a.left = d | 0;
                        a.v = a.top + a.bottom;
                        a.h = a.left + a.right;
                        this.$updateCachedSize(true, this.gutterWidth, this.$size.width, this.$size.height);
                        this.updateFull();
                    };
                    this.getHScrollBarAlwaysVisible = function() {
                        return this.$hScrollBarAlwaysVisible;
                    };
                    this.setHScrollBarAlwaysVisible = function(a) {
                        this.setOption("hScrollBarAlwaysVisible", a);
                    };
                    this.getVScrollBarAlwaysVisible = function() {
                        return this.$vScrollBarAlwaysVisible;
                    };
                    this.setVScrollBarAlwaysVisible = function(a) {
                        this.setOption("vScrollBarAlwaysVisible", a);
                    };
                    this.$updateScrollBarV = function() {
                        var a = this.layerConfig.maxHeight;
                        var b = this.$size.scrollerHeight;
                        if (!this.$maxLines && this.$scrollPastEnd) {
                            a -= (b - this.lineHeight) * this.$scrollPastEnd;
                            if (this.scrollTop > a - b) {
                                a = this.scrollTop + b;
                                this.scrollBarV.scrollTop = null;
                            }
                        }
                        this.scrollBarV.setScrollHeight(a + this.scrollMargin.v);
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
                    this.$renderChanges = function(a, d) {
                        if (this.$changes) {
                            a |= this.$changes;
                            this.$changes = 0;
                        }
                        if (!this.session || !this.container.offsetWidth || this.$frozen || (!a && !d)) {
                            this.$changes |= a;
                            return;
                        }
                        if (this.$size.$dirty) {
                            this.$changes |= a;
                            return this.onResize(true);
                        }
                        if (!this.lineHeight) {
                            this.$textLayer.checkForSizeChanges();
                        }
                        this._signal("beforeRender", a);
                        if (this.session && this.session.$bidiHandler) this.session.$bidiHandler.updateCharacterWidths(this.$fontMetrics);
                        var b = this.layerConfig;
                        if (a & this.CHANGE_FULL || a & this.CHANGE_SIZE || a & this.CHANGE_TEXT || a & this.CHANGE_LINES || a & this.CHANGE_SCROLL || a & this.CHANGE_H_SCROLL) {
                            a |= this.$computeLayerConfig() | this.$loop.clear();
                            if (b.firstRow != this.layerConfig.firstRow && b.firstRowScreen == this.layerConfig.firstRowScreen) {
                                var c = this.scrollTop + (b.firstRow - this.layerConfig.firstRow) * this.lineHeight;
                                if (c > 0) {
                                    this.scrollTop = c;
                                    a = a | this.CHANGE_SCROLL;
                                    a |= this.$computeLayerConfig() | this.$loop.clear();
                                }
                            }
                            b = this.layerConfig;
                            this.$updateScrollBarV();
                            if (a & this.CHANGE_H_SCROLL) this.$updateScrollBarH();
                            e.translate(this.content, -this.scrollLeft, -b.offset);
                            var f = b.width + 2 * this.$padding + "px";
                            var g = b.minHeight + "px";
                            e.setStyle(this.content.style, "width", f);
                            e.setStyle(this.content.style, "height", g);
                        }
                        if (a & this.CHANGE_H_SCROLL) {
                            e.translate(this.content, -this.scrollLeft, -b.offset);
                            this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller" : "ace_scroller ace_scroll-left";
                        }
                        if (a & this.CHANGE_FULL) {
                            this.$changedLines = null;
                            this.$textLayer.update(b);
                            if (this.$showGutter) this.$gutterLayer.update(b);
                            this.$markerBack.update(b);
                            this.$markerFront.update(b);
                            this.$cursorLayer.update(b);
                            this.$moveTextAreaToCursor();
                            this._signal("afterRender", a);
                            return;
                        }
                        if (a & this.CHANGE_SCROLL) {
                            this.$changedLines = null;
                            if (a & this.CHANGE_TEXT || a & this.CHANGE_LINES) this.$textLayer.update(b);
                            else this.$textLayer.scrollLines(b);
                            if (this.$showGutter) {
                                if (a & this.CHANGE_GUTTER || a & this.CHANGE_LINES) this.$gutterLayer.update(b);
                                else this.$gutterLayer.scrollLines(b);
                            }
                            this.$markerBack.update(b);
                            this.$markerFront.update(b);
                            this.$cursorLayer.update(b);
                            this.$moveTextAreaToCursor();
                            this._signal("afterRender", a);
                            return;
                        }
                        if (a & this.CHANGE_TEXT) {
                            this.$changedLines = null;
                            this.$textLayer.update(b);
                            if (this.$showGutter) this.$gutterLayer.update(b);
                        } else if (a & this.CHANGE_LINES) {
                            if (this.$updateLines() || (a & this.CHANGE_GUTTER && this.$showGutter)) this.$gutterLayer.update(b);
                        } else if (a & this.CHANGE_TEXT || a & this.CHANGE_GUTTER) {
                            if (this.$showGutter) this.$gutterLayer.update(b);
                        } else if (a & this.CHANGE_CURSOR) {
                            if (this.$highlightGutterLine) this.$gutterLayer.updateLineHighlight(b);
                        }
                        if (a & this.CHANGE_CURSOR) {
                            this.$cursorLayer.update(b);
                            this.$moveTextAreaToCursor();
                        }
                        if (a & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
                            this.$markerFront.update(b);
                        }
                        if (a & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
                            this.$markerBack.update(b);
                        }
                        this._signal("afterRender", a);
                    };
                    this.$autosize = function() {
                        var c = this.session.getScreenLength() * this.lineHeight;
                        var d = this.$maxLines * this.lineHeight;
                        var a = Math.min(d, Math.max((this.$minLines || 1) * this.lineHeight, c)) + this.scrollMargin.v + (this.$extraHeight || 0);
                        if (this.$horizScroll) a += this.scrollBarH.getHeight();
                        if (this.$maxPixelHeight && a > this.$maxPixelHeight) a = this.$maxPixelHeight;
                        var e = a <= 2 * this.lineHeight;
                        var b = !e && c > d;
                        if (a != this.desiredHeight || this.$size.height != this.desiredHeight || b != this.$vScroll) {
                            if (b != this.$vScroll) {
                                this.$vScroll = b;
                                this.scrollBarV.setVisible(b);
                            }
                            var f = this.container.clientWidth;
                            this.container.style.height = a + "px";
                            this.$updateCachedSize(true, this.$gutterWidth, f, a);
                            this.desiredHeight = a;
                            this._signal("autosize");
                        }
                    };
                    this.$computeLayerConfig = function() {
                        var c = this.session;
                        var a = this.$size;
                        var q = a.height <= 2 * this.lineHeight;
                        var u = this.session.getScreenLength();
                        var g = u * this.lineHeight;
                        var d = this.$getLongestLine();
                        var j = !q && (this.$hScrollBarAlwaysVisible || a.scrollerWidth - d - 2 * this.$padding < 0);
                        var k = this.$horizScroll !== j;
                        if (k) {
                            this.$horizScroll = j;
                            this.scrollBarH.setVisible(j);
                        }
                        var v = this.$vScroll;
                        if (this.$maxLines && this.lineHeight > 1) this.$autosize();
                        var l = a.scrollerHeight + this.lineHeight;
                        var r = !this.$maxLines && this.$scrollPastEnd ? (a.scrollerHeight - this.lineHeight) * this.$scrollPastEnd : 0;
                        g += r;
                        var f = this.scrollMargin;
                        this.session.setScrollTop(Math.max(-f.top, Math.min(this.scrollTop, g - a.scrollerHeight + f.bottom)));
                        this.session.setScrollLeft(Math.max(-f.left, Math.min(this.scrollLeft, d + 2 * this.$padding - a.scrollerWidth + f.right)));
                        var m = !q && (this.$vScrollBarAlwaysVisible || a.scrollerHeight - g + r < 0 || this.scrollTop > f.top);
                        var n = v !== m;
                        if (n) {
                            this.$vScroll = m;
                            this.scrollBarV.setVisible(m);
                        }
                        var h = this.scrollTop % this.lineHeight;
                        var w = Math.ceil(l / this.lineHeight) - 1;
                        var b = Math.max(0, Math.round((this.scrollTop - h) / this.lineHeight));
                        var i = b + w;
                        var o, s;
                        var e = this.lineHeight;
                        b = c.screenToDocumentRow(b, 0);
                        var t = c.getFoldLine(b);
                        if (t) {
                            b = t.start.row;
                        }
                        o = c.documentToScreenRow(b, 0);
                        s = c.getRowLength(b) * e;
                        i = Math.min(c.screenToDocumentRow(i, 0), c.getLength() - 1);
                        l = a.scrollerHeight + c.getRowLength(i) * e + s;
                        h = this.scrollTop - o * e;
                        var p = 0;
                        if (this.layerConfig.width != d || k) p = this.CHANGE_H_SCROLL;
                        if (k || n) {
                            p |= this.$updateCachedSize(true, this.gutterWidth, a.width, a.height);
                            this._signal("scrollbarVisibilityChanged");
                            if (n) d = this.$getLongestLine();
                        }
                        this.layerConfig = {
                            width: d,
                            padding: this.$padding,
                            firstRow: b,
                            firstRowScreen: o,
                            lastRow: i,
                            lineHeight: e,
                            characterWidth: this.characterWidth,
                            minHeight: l,
                            maxHeight: g,
                            offset: h,
                            gutterOffset: e ? Math.max(0, Math.ceil((h + a.height - a.scrollerHeight) / e)) : 0,
                            height: this.$size.scrollerHeight
                        };
                        if (this.session.$bidiHandler) this.session.$bidiHandler.setContentWidth(d - this.$padding);
                        return p;
                    };
                    this.$updateLines = function() {
                        if (!this.$changedLines) return;
                        var c = this.$changedLines.firstRow;
                        var b = this.$changedLines.lastRow;
                        this.$changedLines = null;
                        var a = this.layerConfig;
                        if (c > a.lastRow + 1) {
                            return;
                        }
                        if (b < a.firstRow) {
                            return;
                        }
                        if (b === Infinity) {
                            if (this.$showGutter) this.$gutterLayer.update(a);
                            this.$textLayer.update(a);
                            return;
                        }
                        this.$textLayer.updateLines(a, c, b);
                        return true;
                    };
                    this.$getLongestLine = function() {
                        var a = this.session.getScreenWidth();
                        if (this.showInvisibles && !this.session.$useWrapMode) a += 1;
                        if (this.$textLayer && a > this.$textLayer.MAX_LINE_LENGTH) a = this.$textLayer.MAX_LINE_LENGTH + 30;
                        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(a * this.characterWidth));
                    };
                    this.updateFrontMarkers = function() {
                        this.$markerFront.setMarkers(this.session.getMarkers(true));
                        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
                    };
                    this.updateBackMarkers = function() {
                        this.$markerBack.setMarkers(this.session.getMarkers());
                        this.$loop.schedule(this.CHANGE_MARKER_BACK);
                    };
                    this.addGutterDecoration = function(a, b) {
                        this.$gutterLayer.addGutterDecoration(a, b);
                    };
                    this.removeGutterDecoration = function(a, b) {
                        this.$gutterLayer.removeGutterDecoration(a, b);
                    };
                    this.updateBreakpoints = function(a) {
                        this.$loop.schedule(this.CHANGE_GUTTER);
                    };
                    this.setAnnotations = function(a) {
                        this.$gutterLayer.setAnnotations(a);
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
                    this.scrollSelectionIntoView = function(b, c, a) {
                        this.scrollCursorIntoView(b, a);
                        this.scrollCursorIntoView(c, a);
                    };
                    this.scrollCursorIntoView = function(j, c, d) {
                        if (this.$size.scrollerHeight === 0) return;
                        var h = this.$cursorLayer.getPixelPosition(j);
                        var b = h.left;
                        var a = h.top;
                        var i = (d && d.top) || 0;
                        var g = (d && d.bottom) || 0;
                        var e = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;
                        if (e + i > a) {
                            if (c && e + i > a + this.lineHeight) a -= c * this.$size.scrollerHeight;
                            if (a === 0) a = -this.scrollMargin.top;
                            this.session.setScrollTop(a);
                        } else if (e + this.$size.scrollerHeight - g < a + this.lineHeight) {
                            if (c && e + this.$size.scrollerHeight - g < a - this.lineHeight) a += c * this.$size.scrollerHeight;
                            this.session.setScrollTop(a + this.lineHeight + g - this.$size.scrollerHeight);
                        }
                        var f = this.scrollLeft;
                        if (f > b) {
                            if (b < this.$padding + 2 * this.layerConfig.characterWidth) b = -this.scrollMargin.left;
                            this.session.setScrollLeft(b);
                        } else if (f + this.$size.scrollerWidth < b + this.characterWidth) {
                            this.session.setScrollLeft(Math.round(b + this.characterWidth - this.$size.scrollerWidth));
                        } else if (f <= this.$padding && b - f < this.characterWidth) {
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
                    this.scrollToRow = function(a) {
                        this.session.setScrollTop(a * this.lineHeight);
                    };
                    this.alignCursor = function(a, c) {
                        if (typeof a == "number") a = {
                            row: a,
                            column: 0
                        };
                        var d = this.$cursorLayer.getPixelPosition(a);
                        var e = this.$size.scrollerHeight - this.lineHeight;
                        var b = d.top - e * (c || 0);
                        this.session.setScrollTop(b);
                        return b;
                    };
                    this.STEPS = 8;
                    this.$calcSteps = function(b, d) {
                        var a = 0;
                        var e = this.STEPS;
                        var c = [];
                        var f = function(a, b, c) {
                            return c * (Math.pow(a - 1, 3) + 1) + b;
                        };
                        for(a = 0; a < e; ++a)c.push(f(a / this.STEPS, b, d - b));
                        return c;
                    };
                    this.scrollToLine = function(b, c, d, e) {
                        var f = this.$cursorLayer.getPixelPosition({
                            row: b,
                            column: 0
                        });
                        var a = f.top;
                        if (c) a -= this.$size.scrollerHeight / 2;
                        var g = this.scrollTop;
                        this.session.setScrollTop(a);
                        if (d !== false) this.animateScrolling(g, e);
                    };
                    this.animateScrolling = function(a, f) {
                        var b = this.scrollTop;
                        if (!this.$animatedScroll) return;
                        var c = this;
                        if (a == b) return;
                        if (this.$scrollAnimation) {
                            var d = this.$scrollAnimation.steps;
                            if (d.length) {
                                a = d[0];
                                if (a == b) return;
                            }
                        }
                        var e = c.$calcSteps(a, b);
                        this.$scrollAnimation = {
                            from: a,
                            to: b,
                            steps: e
                        };
                        clearInterval(this.$timer);
                        c.session.setScrollTop(e.shift());
                        c.session.$scrollTop = b;
                        this.$timer = setInterval(function() {
                            if (!c.session) return clearInterval(c.$timer);
                            if (e.length) {
                                c.session.setScrollTop(e.shift());
                                c.session.$scrollTop = b;
                            } else if (b != null) {
                                c.session.$scrollTop = -1;
                                c.session.setScrollTop(b);
                                b = null;
                            } else {
                                c.$timer = clearInterval(c.$timer);
                                c.$scrollAnimation = null;
                                f && f();
                            }
                        }, 10);
                    };
                    this.scrollToY = function(a) {
                        if (this.scrollTop !== a) {
                            this.$loop.schedule(this.CHANGE_SCROLL);
                            this.scrollTop = a;
                        }
                    };
                    this.scrollToX = function(a) {
                        if (this.scrollLeft !== a) this.scrollLeft = a;
                        this.$loop.schedule(this.CHANGE_H_SCROLL);
                    };
                    this.scrollTo = function(a, b) {
                        this.session.setScrollTop(b);
                        this.session.setScrollLeft(a);
                    };
                    this.scrollBy = function(a, b) {
                        b && this.session.setScrollTop(this.session.getScrollTop() + b);
                        a && this.session.setScrollLeft(this.session.getScrollLeft() + a);
                    };
                    this.isScrollableBy = function(a, b) {
                        if (b < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top) return true;
                        if (b > 0 && this.session.getScrollTop() + this.$size.scrollerHeight - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom) return true;
                        if (a < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left) return true;
                        if (a > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth - this.layerConfig.width < -1 + this.scrollMargin.right) return true;
                    };
                    this.pixelToScreenCoordinates = function(b, c) {
                        var a;
                        if (this.$hasCssTransforms) {
                            a = {
                                top: 0,
                                left: 0
                            };
                            var e = this.$fontMetrics.transformCoordinates([
                                b,
                                c, 
                            ]);
                            b = e[1] - this.gutterWidth - this.margin.left;
                            c = e[0];
                        } else {
                            a = this.scroller.getBoundingClientRect();
                        }
                        var f = b + this.scrollLeft - a.left - this.$padding;
                        var d = f / this.characterWidth;
                        var h = Math.floor((c + this.scrollTop - a.top) / this.lineHeight);
                        var g = this.$blockCursor ? Math.floor(d) : Math.round(d);
                        return {
                            row: h,
                            column: g,
                            side: d - g > 0 ? 1 : -1,
                            offsetX: f
                        };
                    };
                    this.screenToTextCoordinates = function(b, c) {
                        var a;
                        if (this.$hasCssTransforms) {
                            a = {
                                top: 0,
                                left: 0
                            };
                            var d = this.$fontMetrics.transformCoordinates([
                                b,
                                c, 
                            ]);
                            b = d[1] - this.gutterWidth - this.margin.left;
                            c = d[0];
                        } else {
                            a = this.scroller.getBoundingClientRect();
                        }
                        var e = b + this.scrollLeft - a.left - this.$padding;
                        var f = e / this.characterWidth;
                        var g = this.$blockCursor ? Math.floor(f) : Math.round(f);
                        var h = Math.floor((c + this.scrollTop - a.top) / this.lineHeight);
                        return this.session.screenToDocumentPosition(h, Math.max(g, 0), e);
                    };
                    this.textToScreenCoordinates = function(b, d) {
                        var c = this.scroller.getBoundingClientRect();
                        var a = this.session.documentToScreenPosition(b, d);
                        var e = this.$padding + (this.session.$bidiHandler.isBidiRow(a.row, b) ? this.session.$bidiHandler.getPosLeft(a.column) : Math.round(a.column * this.characterWidth));
                        var f = a.row * this.lineHeight;
                        return {
                            pageX: c.left + e - this.scrollLeft,
                            pageY: c.top + f - this.scrollTop
                        };
                    };
                    this.visualizeFocus = function() {
                        e.addCssClass(this.container, "ace_focus");
                    };
                    this.visualizeBlur = function() {
                        e.removeCssClass(this.container, "ace_focus");
                    };
                    this.showComposition = function(a) {
                        this.$composition = a;
                        if (!a.cssText) {
                            a.cssText = this.textarea.style.cssText;
                        }
                        if (a.useTextareaForIME == undefined) a.useTextareaForIME = this.$useTextareaForIME;
                        if (this.$useTextareaForIME) {
                            e.addCssClass(this.textarea, "ace_composition");
                            this.textarea.style.cssText = "";
                            this.$moveTextAreaToCursor();
                            this.$cursorLayer.element.style.display = "none";
                        } else {
                            a.markerId = this.session.addMarker(a.markerRange, "ace_composition_marker", "text");
                        }
                    };
                    this.setCompositionText = function(b) {
                        var a = this.session.selection.cursor;
                        this.addToken(b, "composition_placeholder", a.row, a.column);
                        this.$moveTextAreaToCursor();
                    };
                    this.hideComposition = function() {
                        if (!this.$composition) return;
                        if (this.$composition.markerId) this.session.removeMarker(this.$composition.markerId);
                        e.removeCssClass(this.textarea, "ace_composition");
                        this.textarea.style.cssText = this.$composition.cssText;
                        var a = this.session.selection.cursor;
                        this.removeExtraToken(a.row, a.column);
                        this.$composition = null;
                        this.$cursorLayer.element.style.display = "";
                    };
                    this.addToken = function(j, k, b, e) {
                        var g = this.session;
                        g.bgTokenizer.lines[b] = null;
                        var h = {
                            type: k,
                            value: j
                        };
                        var c = g.getTokens(b);
                        if (e == null) {
                            c.push(h);
                        } else {
                            var f = 0;
                            for(var d = 0; d < c.length; d++){
                                var a = c[d];
                                f += a.value.length;
                                if (e <= f) {
                                    var i = a.value.length - (f - e);
                                    var l = a.value.slice(0, i);
                                    var m = a.value.slice(i);
                                    c.splice(d, 1, {
                                        type: a.type,
                                        value: l
                                    }, h, {
                                        type: a.type,
                                        value: m
                                    });
                                    break;
                                }
                            }
                        }
                        this.updateLines(b, b);
                    };
                    this.removeExtraToken = function(a, b) {
                        this.updateLines(a, a);
                    };
                    this.setTheme = function(a, d) {
                        var b = this;
                        this.$themeId = a;
                        b._dispatchEvent("themeChange", {
                            theme: a
                        });
                        if (!a || typeof a == "string") {
                            var c = a || this.$options.theme.initialValue;
                            f.loadModule([
                                "theme",
                                c
                            ], g);
                        } else {
                            g(a);
                        }
                        function g(c) {
                            if (b.$themeId != a) return d && d();
                            if (!c || !c.cssClass) throw new Error("couldn't load module " + a + " or it didn't call define");
                            if (c.$id) b.$themeId = c.$id;
                            e.importCssString(c.cssText, c.cssClass, b.container);
                            if (b.theme) e.removeCssClass(b.container, b.theme.cssClass);
                            var f = "padding" in c ? c.padding : "padding" in (b.theme || {}) ? 4 : b.$padding;
                            if (b.$padding && f != b.$padding) b.setPadding(f);
                            b.$theme = c.cssClass;
                            b.theme = c;
                            e.addCssClass(b.container, c.cssClass);
                            e.setCssClass(b.container, "ace_dark", c.isDark);
                            if (b.$size) {
                                b.$size.width = 0;
                                b.$updateSizeAsync();
                            }
                            b._dispatchEvent("themeLoaded", {
                                theme: c
                            });
                            d && d();
                        }
                    };
                    this.getTheme = function() {
                        return this.$themeId;
                    };
                    this.setStyle = function(a, b) {
                        e.setCssClass(this.container, a, b !== false);
                    };
                    this.unsetStyle = function(a) {
                        e.removeCssClass(this.container, a);
                    };
                    this.setCursorStyle = function(a) {
                        e.setStyle(this.scroller.style, "cursor", a);
                    };
                    this.setMouseCursor = function(a) {
                        e.setStyle(this.scroller.style, "cursor", a);
                    };
                    this.attachToShadowRoot = function() {
                        e.importCssString(g, "ace_editor.css", this.container);
                    };
                    this.destroy = function() {
                        this.freeze();
                        this.$fontMetrics.destroy();
                        this.$cursorLayer.destroy();
                        this.removeAllListeners();
                        this.container.textContent = "";
                    };
                }.call(c.prototype));
                f.defineOptions(c.prototype, "renderer", {
                    animatedScroll: {
                        initialValue: false
                    },
                    showInvisibles: {
                        set: function(a) {
                            if (this.$textLayer.setShowInvisibles(a)) this.$loop.schedule(this.CHANGE_TEXT);
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
                        set: function(a) {
                            if (typeof a == "number") this.$printMarginColumn = a;
                            this.$showPrintMargin = !!a;
                            this.$updatePrintMargin();
                        },
                        get: function() {
                            return (this.$showPrintMargin && this.$printMarginColumn);
                        }
                    },
                    showGutter: {
                        set: function(a) {
                            this.$gutter.style.display = a ? "block" : "none";
                            this.$loop.schedule(this.CHANGE_FULL);
                            this.onGutterResize();
                        },
                        initialValue: true
                    },
                    fadeFoldWidgets: {
                        set: function(a) {
                            e.setCssClass(this.$gutter, "ace_fade-fold-widgets", a);
                        },
                        initialValue: false
                    },
                    showFoldWidgets: {
                        set: function(a) {
                            this.$gutterLayer.setShowFoldWidgets(a);
                            this.$loop.schedule(this.CHANGE_GUTTER);
                        },
                        initialValue: true
                    },
                    displayIndentGuides: {
                        set: function(a) {
                            if (this.$textLayer.setDisplayIndentGuides(a)) this.$loop.schedule(this.CHANGE_TEXT);
                        },
                        initialValue: true
                    },
                    highlightGutterLine: {
                        set: function(a) {
                            this.$gutterLayer.setHighlightGutterLine(a);
                            this.$loop.schedule(this.CHANGE_GUTTER);
                        },
                        initialValue: true
                    },
                    hScrollBarAlwaysVisible: {
                        set: function(a) {
                            if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll) this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: false
                    },
                    vScrollBarAlwaysVisible: {
                        set: function(a) {
                            if (!this.$vScrollBarAlwaysVisible || !this.$vScroll) this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: false
                    },
                    fontSize: {
                        set: function(a) {
                            if (typeof a == "number") a = a + "px";
                            this.container.style.fontSize = a;
                            this.updateFontSize();
                        },
                        initialValue: 12
                    },
                    fontFamily: {
                        set: function(a) {
                            this.container.style.fontFamily = a;
                            this.updateFontSize();
                        }
                    },
                    maxLines: {
                        set: function(a) {
                            this.updateFull();
                        }
                    },
                    minLines: {
                        set: function(a) {
                            if (!(this.$minLines < 0x1ffffffffffff)) this.$minLines = 0;
                            this.updateFull();
                        }
                    },
                    maxPixelHeight: {
                        set: function(a) {
                            this.updateFull();
                        },
                        initialValue: 0
                    },
                    scrollPastEnd: {
                        set: function(a) {
                            a = +a || 0;
                            if (this.$scrollPastEnd == a) return;
                            this.$scrollPastEnd = a;
                            this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: 0,
                        handlesSet: true
                    },
                    fixedWidthGutter: {
                        set: function(a) {
                            this.$gutterLayer.$fixedWidth = !!a;
                            this.$loop.schedule(this.CHANGE_GUTTER);
                        }
                    },
                    theme: {
                        set: function(a) {
                            this.setTheme(a);
                        },
                        get: function() {
                            return this.$themeId || this.theme;
                        },
                        initialValue: "./theme/textmate",
                        handlesSet: true
                    },
                    hasCssTransforms: {},
                    useTextareaForIME: {
                        initialValue: !b.isMobile && !b.isIE
                    }
                });
                d.VirtualRenderer = c;
            });
            ace.define("ace/worker/worker_client", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/net",
                "ace/lib/event_emitter",
                "ace/config", 
            ], function(a, b, f) {
                "use strict";
                var g = a("../lib/oop");
                var h = a("../lib/net");
                var i = a("../lib/event_emitter").EventEmitter;
                var j = a("../config");
                function k(c) {
                    var a = "importScripts('" + h.qualifyURL(c) + "');";
                    try {
                        return new Blob([
                            a
                        ], {
                            type: "application/javascript"
                        });
                    } catch (e) {
                        var d = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                        var b = new d();
                        b.append(a);
                        return b.getBlob("application/javascript");
                    }
                }
                function d(a) {
                    if (typeof Worker == "undefined") return {
                        postMessage: function() {},
                        terminate: function() {}
                    };
                    if (j.get("loadWorkerFromBlob")) {
                        var b = k(a);
                        var c = window.URL || window.webkitURL;
                        var d = c.createObjectURL(b);
                        return new Worker(d);
                    }
                    return new Worker(a);
                }
                var c = function(a) {
                    if (!a.postMessage) a = this.$createWorkerFromOldConfig.apply(this, arguments);
                    this.$worker = a;
                    this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this);
                    this.changeListener = this.changeListener.bind(this);
                    this.onMessage = this.onMessage.bind(this);
                    this.callbackId = 1;
                    this.callbacks = {};
                    this.$worker.onmessage = this.onMessage;
                };
                (function() {
                    g.implement(this, i);
                    this.$createWorkerFromOldConfig = function(f, c, g, b, e) {
                        if (a.nameToUrl && !a.toUrl) a.toUrl = a.nameToUrl;
                        if (j.get("packaged") || !a.toUrl) {
                            b = b || j.moduleUrl(c, "worker");
                        } else {
                            var h = this.$normalizePath;
                            b = b || h(a.toUrl("ace/worker/worker.js", null, "_"));
                            var i = {};
                            f.forEach(function(b) {
                                i[b] = h(a.toUrl(b, null, "_").replace(/(\.js)?(\?.*)?$/, ""));
                            });
                        }
                        this.$worker = d(b);
                        if (e) {
                            this.send("importScripts", e);
                        }
                        this.$worker.postMessage({
                            init: true,
                            tlns: i,
                            module: c,
                            classname: g
                        });
                        return this.$worker;
                    };
                    this.onMessage = function(c) {
                        var a = c.data;
                        switch(a.type){
                            case "event":
                                this._signal(a.name, {
                                    data: a.data
                                });
                                break;
                            case "call":
                                var b = this.callbacks[a.id];
                                if (b) {
                                    b(a.data);
                                    delete this.callbacks[a.id];
                                }
                                break;
                            case "error":
                                this.reportError(a.data);
                                break;
                            case "log":
                                window.console && console.log && console.log.apply(console, a.data);
                                break;
                        }
                    };
                    this.reportError = function(a) {
                        window.console && console.error && console.error(a);
                    };
                    this.$normalizePath = function(a) {
                        return h.qualifyURL(a);
                    };
                    this.terminate = function() {
                        this._signal("terminate", {});
                        this.deltaQueue = null;
                        this.$worker.terminate();
                        this.$worker = null;
                        if (this.$doc) this.$doc.off("change", this.changeListener);
                        this.$doc = null;
                    };
                    this.send = function(a, b) {
                        this.$worker.postMessage({
                            command: a,
                            args: b
                        });
                    };
                    this.call = function(d, a, b) {
                        if (b) {
                            var c = this.callbackId++;
                            this.callbacks[c] = b;
                            a.push(c);
                        }
                        this.send(d, a);
                    };
                    this.emit = function(b, a) {
                        try {
                            if (a.data && a.data.err) a.data.err = {
                                message: a.data.err.message,
                                stack: a.data.err.stack,
                                code: a.data.err.code
                            };
                            this.$worker.postMessage({
                                event: b,
                                data: {
                                    data: a.data
                                }
                            });
                        } catch (c) {
                            console.error(c.stack);
                        }
                    };
                    this.attachToDocument = function(a) {
                        if (this.$doc) this.terminate();
                        this.$doc = a;
                        this.call("setValue", [
                            a.getValue()
                        ]);
                        a.on("change", this.changeListener);
                    };
                    this.changeListener = function(a) {
                        if (!this.deltaQueue) {
                            this.deltaQueue = [];
                            setTimeout(this.$sendDeltaQueue, 0);
                        }
                        if (a.action == "insert") this.deltaQueue.push(a.start, a.lines);
                        else this.deltaQueue.push(a.start, a.end);
                    };
                    this.$sendDeltaQueue = function() {
                        var a = this.deltaQueue;
                        if (!a) return;
                        this.deltaQueue = null;
                        if (a.length > 50 && a.length > this.$doc.getLength() >> 1) {
                            this.call("setValue", [
                                this.$doc.getValue()
                            ]);
                        } else this.emit("change", {
                            data: a
                        });
                    };
                }.call(c.prototype));
                var e = function(f, d, g) {
                    var h = null;
                    var k = false;
                    var a = Object.create(i);
                    var e = [];
                    var b = new c({
                        messageBuffer: e,
                        terminate: function() {},
                        postMessage: function(a) {
                            e.push(a);
                            if (!h) return;
                            if (k) setTimeout(l);
                            else l();
                        }
                    });
                    b.setEmitSync = function(a) {
                        k = a;
                    };
                    var l = function() {
                        var b = e.shift();
                        if (b.command) h[b.command].apply(h, b.args);
                        else if (b.event) a._signal(b.event, b.data);
                    };
                    a.postMessage = function(a) {
                        b.onMessage({
                            data: a
                        });
                    };
                    a.callback = function(a, b) {
                        this.postMessage({
                            type: "call",
                            id: b,
                            data: a
                        });
                    };
                    a.emit = function(a, b) {
                        this.postMessage({
                            type: "event",
                            name: a,
                            data: b
                        });
                    };
                    j.loadModule([
                        "worker",
                        d
                    ], function(b) {
                        h = new b[g](a);
                        while(e.length)l();
                    });
                    return b;
                };
                b.UIWorkerClient = e;
                b.WorkerClient = c;
                b.createWorker = d;
            });
            ace.define("ace/placeholder", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/event_emitter",
                "ace/lib/oop", 
            ], function(a, c, d) {
                "use strict";
                var e = a("./range").Range;
                var f = a("./lib/event_emitter").EventEmitter;
                var g = a("./lib/oop");
                var b = function(a, b, c, d, e, f) {
                    var h = this;
                    this.length = b;
                    this.session = a;
                    this.doc = a.getDocument();
                    this.mainClass = e;
                    this.othersClass = f;
                    this.$onUpdate = this.onUpdate.bind(this);
                    this.doc.on("change", this.$onUpdate);
                    this.$others = d;
                    this.$onCursorChange = function() {
                        setTimeout(function() {
                            h.onCursorChange();
                        });
                    };
                    this.$pos = c;
                    var g = a.getUndoManager().$undoStack || a.getUndoManager().$undostack || {
                        length: -1
                    };
                    this.$undoStackDepth = g.length;
                    this.setup();
                    a.selection.on("changeCursor", this.$onCursorChange);
                };
                (function() {
                    g.implement(this, f);
                    this.setup = function() {
                        var d = this;
                        var c = this.doc;
                        var b = this.session;
                        this.selectionBefore = b.selection.toJSON();
                        if (b.selection.inMultiSelectMode) b.selection.toSingleRange();
                        this.pos = c.createAnchor(this.$pos.row, this.$pos.column);
                        var a = this.pos;
                        a.$insertRight = true;
                        a.detach();
                        a.markerId = b.addMarker(new e(a.row, a.column, a.row, a.column + this.length), this.mainClass, null, false);
                        this.others = [];
                        this.$others.forEach(function(b) {
                            var a = c.createAnchor(b.row, b.column);
                            a.$insertRight = true;
                            a.detach();
                            d.others.push(a);
                        });
                        b.setUndoSelect(false);
                    };
                    this.showOtherMarkers = function() {
                        if (this.othersActive) return;
                        var a = this.session;
                        var b = this;
                        this.othersActive = true;
                        this.others.forEach(function(c) {
                            c.markerId = a.addMarker(new e(c.row, c.column, c.row, c.column + b.length), b.othersClass, null, false);
                        });
                    };
                    this.hideOtherMarkers = function() {
                        if (!this.othersActive) return;
                        this.othersActive = false;
                        for(var a = 0; a < this.others.length; a++){
                            this.session.removeMarker(this.others[a].markerId);
                        }
                    };
                    this.onUpdate = function(b) {
                        if (this.$updating) return this.updateAnchors(b);
                        var a = b;
                        if (a.start.row !== a.end.row) return;
                        if (a.start.row !== this.pos.row) return;
                        this.$updating = true;
                        var g = b.action === "insert" ? a.end.column - a.start.column : a.start.column - a.end.column;
                        var h = a.start.column >= this.pos.column && a.start.column <= this.pos.column + this.length + 1;
                        var i = a.start.column - this.pos.column;
                        this.updateAnchors(b);
                        if (h) this.length += g;
                        if (h && !this.session.$fromUndo) {
                            if (b.action === "insert") {
                                for(var c = this.others.length - 1; c >= 0; c--){
                                    var f = this.others[c];
                                    var d = {
                                        row: f.row,
                                        column: f.column + i
                                    };
                                    this.doc.insertMergedLines(d, b.lines);
                                }
                            } else if (b.action === "remove") {
                                for(var c = this.others.length - 1; c >= 0; c--){
                                    var f = this.others[c];
                                    var d = {
                                        row: f.row,
                                        column: f.column + i
                                    };
                                    this.doc.remove(new e(d.row, d.column, d.row, d.column - g));
                                }
                            }
                        }
                        this.$updating = false;
                        this.updateMarkers();
                    };
                    this.updateAnchors = function(a) {
                        this.pos.onChange(a);
                        for(var b = this.others.length; b--;)this.others[b].onChange(a);
                        this.updateMarkers();
                    };
                    this.updateMarkers = function() {
                        if (this.$updating) return;
                        var c = this;
                        var d = this.session;
                        var a = function(a, b) {
                            d.removeMarker(a.markerId);
                            a.markerId = d.addMarker(new e(a.row, a.column, a.row, a.column + c.length), b, null, false);
                        };
                        a(this.pos, this.mainClass);
                        for(var b = this.others.length; b--;)a(this.others[b], this.othersClass);
                    };
                    this.onCursorChange = function(b) {
                        if (this.$updating || !this.session) return;
                        var a = this.session.selection.getCursor();
                        if (a.row === this.pos.row && a.column >= this.pos.column && a.column <= this.pos.column + this.length) {
                            this.showOtherMarkers();
                            this._emit("cursorEnter", b);
                        } else {
                            this.hideOtherMarkers();
                            this._emit("cursorLeave", b);
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
                        var a = this.session.getUndoManager();
                        var c = (a.$undoStack || a.$undostack).length - this.$undoStackDepth;
                        for(var b = 0; b < c; b++){
                            a.undo(this.session, true);
                        }
                        if (this.selectionBefore) this.session.selection.fromJSON(this.selectionBefore);
                    };
                }.call(b.prototype));
                c.PlaceHolder = b;
            });
            ace.define("ace/mouse/multi_select_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(a, b, d) {
                var e = a("../lib/event");
                var f = a("../lib/useragent");
                function g(a, b) {
                    return a.row == b.row && a.column == b.column;
                }
                function c(a) {
                    var i = a.domEvent;
                    var h = i.altKey;
                    var l = i.shiftKey;
                    var o = i.ctrlKey;
                    var j = a.getAccelKey();
                    var m = a.getButton();
                    if (o && f.isMac) m = i.button;
                    if (a.editor.inMultiSelectMode && m == 2) {
                        a.editor.textInput.onContextMenu(a.domEvent);
                        return;
                    }
                    if (!o && !h && !j) {
                        if (m === 0 && a.editor.inMultiSelectMode) a.editor.exitMultiSelectMode();
                        return;
                    }
                    if (m !== 0) return;
                    var b = a.editor;
                    var c = b.selection;
                    var k = b.inMultiSelectMode;
                    var p = a.getDocumentPosition();
                    var s = c.getCursor();
                    var t = a.inSelection() || (c.isEmpty() && g(p, s));
                    var u = a.x, v = a.y;
                    var w = function(a) {
                        u = a.clientX;
                        v = a.clientY;
                    };
                    var x = b.session;
                    var q = b.renderer.pixelToScreenCoordinates(u, v);
                    var y = q;
                    var d;
                    if (b.$mouseHandler.$enableJumpToDef) {
                        if ((o && h) || (j && h)) d = l ? "block" : "add";
                        else if (h && b.$blockSelectEnabled) d = "block";
                    } else {
                        if (j && !h) {
                            d = "add";
                            if (!k && l) return;
                        } else if (h && b.$blockSelectEnabled) {
                            d = "block";
                        }
                    }
                    if (d && f.isMac && i.ctrlKey) {
                        b.$mouseHandler.cancelContextMenu();
                    }
                    if (d == "add") {
                        if (!k && t) return;
                        if (!k) {
                            var n = c.toOrientedRange();
                            b.addSelectionMarker(n);
                        }
                        var z = c.rangeList.rangeAtPoint(p);
                        b.inVirtualSelectionMode = true;
                        if (l) {
                            z = null;
                            n = c.ranges[0] || n;
                            b.removeSelectionMarker(n);
                        }
                        b.once("mouseup", function() {
                            var a = c.toOrientedRange();
                            if (z && a.isEmpty() && g(z.cursor, a.cursor)) c.substractPoint(a.cursor);
                            else {
                                if (l) {
                                    c.substractPoint(n.cursor);
                                } else if (n) {
                                    b.removeSelectionMarker(n);
                                    c.addRange(n);
                                }
                                c.addRange(a);
                            }
                            b.inVirtualSelectionMode = false;
                        });
                    } else if (d == "block") {
                        a.stop();
                        b.inVirtualSelectionMode = true;
                        var r;
                        var C = [];
                        var A = function() {
                            var a = b.renderer.pixelToScreenCoordinates(u, v);
                            var d = x.screenToDocumentPosition(a.row, a.column, a.offsetX);
                            if (g(y, a) && g(d, c.lead)) return;
                            y = a;
                            b.selection.moveToPosition(d);
                            b.renderer.scrollCursorIntoView();
                            b.removeSelectionMarkers(C);
                            C = c.rectangularRangeBlock(y, q);
                            if (b.$mouseHandler.$clickSelection && C.length == 1 && C[0].isEmpty()) C[0] = b.$mouseHandler.$clickSelection.clone();
                            C.forEach(b.addSelectionMarker, b);
                            b.updateSelectionMarkers();
                        };
                        if (k && !j) {
                            c.toSingleRange();
                        } else if (!k && j) {
                            r = c.toOrientedRange();
                            b.addSelectionMarker(r);
                        }
                        if (l) q = x.documentToScreenPosition(c.lead);
                        else c.moveToPosition(p);
                        y = {
                            row: -1,
                            column: -1
                        };
                        var B = function(d) {
                            A();
                            clearInterval(E);
                            b.removeSelectionMarkers(C);
                            if (!C.length) C = [
                                c.toOrientedRange()
                            ];
                            if (r) {
                                b.removeSelectionMarker(r);
                                c.toSingleRange(r);
                            }
                            for(var a = 0; a < C.length; a++)c.addRange(C[a]);
                            b.inVirtualSelectionMode = false;
                            b.$mouseHandler.$clickSelection = null;
                        };
                        var D = A;
                        e.capture(b.container, w, B);
                        var E = setInterval(function() {
                            D();
                        }, 20);
                        return a.preventDefault();
                    }
                }
                b.onMouseDown = c;
            });
            ace.define("ace/commands/multi_select_commands", [
                "require",
                "exports",
                "module",
                "ace/keyboard/hash_handler"
            ], function(b, a, d) {
                a.defaultCommands = [
                    {
                        name: "addCursorAbove",
                        description: "Add cursor above",
                        exec: function(a) {
                            a.selectMoreLines(-1);
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
                        exec: function(a) {
                            a.selectMoreLines(1);
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
                        exec: function(a) {
                            a.selectMoreLines(-1, true);
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
                        exec: function(a) {
                            a.selectMoreLines(1, true);
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
                        exec: function(a) {
                            a.selectMore(-1);
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
                        exec: function(a) {
                            a.selectMore(1);
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
                        exec: function(a) {
                            a.selectMore(-1, true);
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
                        exec: function(a) {
                            a.selectMore(1, true);
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
                        exec: function(a) {
                            if (a.multiSelect.rangeCount > 1) a.multiSelect.joinSelections();
                            else a.multiSelect.splitIntoLines();
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
                        exec: function(a) {
                            a.multiSelect.splitIntoLines();
                        },
                        readOnly: true
                    },
                    {
                        name: "alignCursors",
                        description: "Align cursors",
                        exec: function(a) {
                            a.alignCursors();
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
                        exec: function(a) {
                            a.findAll();
                        },
                        bindKey: {
                            win: "Ctrl-Alt-K",
                            mac: "Ctrl-Alt-G"
                        },
                        scrollIntoView: "cursor",
                        readOnly: true
                    }, 
                ];
                a.multiSelectCommands = [
                    {
                        name: "singleSelection",
                        description: "Single selection",
                        bindKey: "esc",
                        exec: function(a) {
                            a.exitMultiSelectMode();
                        },
                        scrollIntoView: "cursor",
                        readOnly: true,
                        isAvailable: function(a) {
                            return a && a.inMultiSelectMode;
                        }
                    }, 
                ];
                var c = b("../keyboard/hash_handler").HashHandler;
                a.keyboardHandler = new c(a.multiSelectCommands);
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
            ], function(a, b, i) {
                var j = a("./range_list").RangeList;
                var k = a("./range").Range;
                var e = a("./selection").Selection;
                var l = a("./mouse/multi_select_handler").onMouseDown;
                var m = a("./lib/event");
                var n = a("./lib/lang");
                var c = a("./commands/multi_select_commands");
                b.commands = c.defaultCommands.concat(c.multiSelectCommands);
                var f = a("./search").Search;
                var o = new f();
                function p(a, b, c) {
                    o.$options.wrap = true;
                    o.$options.needle = b;
                    o.$options.backwards = c == -1;
                    return o.find(a);
                }
                var g = a("./edit_session").EditSession;
                (function() {
                    this.getSelectionMarkers = function() {
                        return this.$selectionMarkers;
                    };
                }.call(g.prototype));
                (function() {
                    this.ranges = null;
                    this.rangeList = null;
                    this.addRange = function(a, c) {
                        if (!a) return;
                        if (!this.inMultiSelectMode && this.rangeCount === 0) {
                            var b = this.toOrientedRange();
                            this.rangeList.add(b);
                            this.rangeList.add(a);
                            if (this.rangeList.ranges.length != 2) {
                                this.rangeList.removeAll();
                                return (c || this.fromOrientedRange(a));
                            }
                            this.rangeList.removeAll();
                            this.rangeList.add(b);
                            this.$onAddRange(b);
                        }
                        if (!a.cursor) a.cursor = a.end;
                        var d = this.rangeList.add(a);
                        this.$onAddRange(a);
                        if (d.length) this.$onRemoveRange(d);
                        if (this.rangeCount > 1 && !this.inMultiSelectMode) {
                            this._signal("multiSelect");
                            this.inMultiSelectMode = true;
                            this.session.$undoSelect = false;
                            this.rangeList.attach(this.session);
                        }
                        return (c || this.fromOrientedRange(a));
                    };
                    this.toSingleRange = function(a) {
                        a = a || this.ranges[0];
                        var b = this.rangeList.removeAll();
                        if (b.length) this.$onRemoveRange(b);
                        a && this.fromOrientedRange(a);
                    };
                    this.substractPoint = function(b) {
                        var a = this.rangeList.substractPoint(b);
                        if (a) {
                            this.$onRemoveRange(a);
                            return a[0];
                        }
                    };
                    this.mergeOverlappingRanges = function() {
                        var a = this.rangeList.merge();
                        if (a.length) this.$onRemoveRange(a);
                    };
                    this.$onAddRange = function(a) {
                        this.rangeCount = this.rangeList.ranges.length;
                        this.ranges.unshift(a);
                        this._signal("addRange", {
                            range: a
                        });
                    };
                    this.$onRemoveRange = function(b) {
                        this.rangeCount = this.rangeList.ranges.length;
                        if (this.rangeCount == 1 && this.inMultiSelectMode) {
                            var a = this.rangeList.ranges.pop();
                            b.push(a);
                            this.rangeCount = 0;
                        }
                        for(var c = b.length; c--;){
                            var d = this.ranges.indexOf(b[c]);
                            this.ranges.splice(d, 1);
                        }
                        this._signal("removeRange", {
                            ranges: b
                        });
                        if (this.rangeCount === 0 && this.inMultiSelectMode) {
                            this.inMultiSelectMode = false;
                            this._signal("singleSelect");
                            this.session.$undoSelect = true;
                            this.rangeList.detach(this.session);
                        }
                        a = a || this.ranges[0];
                        if (a && !a.isEqual(this.getRange())) this.fromOrientedRange(a);
                    };
                    this.$initRangeList = function() {
                        if (this.rangeList) return;
                        this.rangeList = new j();
                        this.ranges = [];
                        this.rangeCount = 0;
                    };
                    this.getAllRanges = function() {
                        return this.rangeCount ? this.rangeList.ranges.concat() : [
                            this.getRange()
                        ];
                    };
                    this.splitIntoLines = function() {
                        var f = this.ranges.length ? this.ranges : [
                            this.getRange()
                        ];
                        var a = [];
                        for(var b = 0; b < f.length; b++){
                            var d = f[b];
                            var c = d.start.row;
                            var e = d.end.row;
                            if (c === e) {
                                a.push(d.clone());
                            } else {
                                a.push(new k(c, d.start.column, c, this.session.getLine(c).length));
                                while(++c < e)a.push(this.getLineRange(c, true));
                                a.push(new k(e, 0, e, d.end.column));
                            }
                            if (b == 0 && !this.isBackwards()) a = a.reverse();
                        }
                        this.toSingleRange();
                        for(var b = a.length; b--;)this.addRange(a[b]);
                    };
                    this.joinSelections = function() {
                        var a = this.rangeList.ranges;
                        var b = a[a.length - 1];
                        var c = k.fromPoints(a[0].start, b.end);
                        this.toSingleRange();
                        this.setSelectionRange(c, b.cursor == b.start);
                    };
                    this.toggleBlockSelection = function() {
                        if (this.rangeCount > 1) {
                            var a = this.rangeList.ranges;
                            var b = a[a.length - 1];
                            var c = k.fromPoints(a[0].start, b.end);
                            this.toSingleRange();
                            this.setSelectionRange(c, b.cursor == b.start);
                        } else {
                            var d = this.session.documentToScreenPosition(this.cursor);
                            var e = this.session.documentToScreenPosition(this.anchor);
                            var f = this.rectangularRangeBlock(d, e);
                            f.forEach(this.addRange, this);
                        }
                    };
                    this.rectangularRangeBlock = function(a, b, n) {
                        var c = [];
                        var o = a.column < b.column;
                        if (o) {
                            var g = a.column;
                            var p = b.column;
                            var r = a.offsetX;
                            var s = b.offsetX;
                        } else {
                            var g = b.column;
                            var p = a.column;
                            var r = b.offsetX;
                            var s = a.offsetX;
                        }
                        var t = a.row < b.row;
                        if (t) {
                            var e = a.row;
                            var j = b.row;
                        } else {
                            var e = b.row;
                            var j = a.row;
                        }
                        if (g < 0) g = 0;
                        if (e < 0) e = 0;
                        if (e == j) n = true;
                        var l;
                        for(var h = e; h <= j; h++){
                            var d = k.fromPoints(this.session.screenToDocumentPosition(h, g, r), this.session.screenToDocumentPosition(h, p, s));
                            if (d.isEmpty()) {
                                if (l && q(d.end, l)) break;
                                l = d.end;
                            }
                            d.cursor = o ? d.start : d.end;
                            c.push(d);
                        }
                        if (t) c.reverse();
                        if (!n) {
                            var f = c.length - 1;
                            while(c[f].isEmpty() && f > 0)f--;
                            if (f > 0) {
                                var m = 0;
                                while(c[m].isEmpty())m++;
                            }
                            for(var i = f; i >= m; i--){
                                if (c[i].isEmpty()) c.splice(i, 1);
                            }
                        }
                        return c;
                    };
                }.call(e.prototype));
                var d = a("./editor").Editor;
                (function() {
                    this.updateSelectionMarkers = function() {
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.addSelectionMarker = function(a) {
                        if (!a.cursor) a.cursor = a.end;
                        var b = this.getSelectionStyle();
                        a.marker = this.session.addMarker(a, "ace_selection", b);
                        this.session.$selectionMarkers.push(a);
                        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
                        return a;
                    };
                    this.removeSelectionMarker = function(a) {
                        if (!a.marker) return;
                        this.session.removeMarker(a.marker);
                        var b = this.session.$selectionMarkers.indexOf(a);
                        if (b != -1) this.session.$selectionMarkers.splice(b, 1);
                        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
                    };
                    this.removeSelectionMarkers = function(c) {
                        var a = this.session.$selectionMarkers;
                        for(var d = c.length; d--;){
                            var b = c[d];
                            if (!b.marker) continue;
                            this.session.removeMarker(b.marker);
                            var e = a.indexOf(b);
                            if (e != -1) a.splice(e, 1);
                        }
                        this.session.selectionMarkerCount = a.length;
                    };
                    this.$onAddRange = function(a) {
                        this.addSelectionMarker(a.range);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.$onRemoveRange = function(a) {
                        this.removeSelectionMarkers(a.ranges);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.$onMultiSelect = function(a) {
                        if (this.inMultiSelectMode) return;
                        this.inMultiSelectMode = true;
                        this.setStyle("ace_multiselect");
                        this.keyBinding.addKeyboardHandler(c.keyboardHandler);
                        this.commands.setDefaultHandler("exec", this.$onMultiSelectExec);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.$onSingleSelect = function(a) {
                        if (this.session.multiSelect.inVirtualMode) return;
                        this.inMultiSelectMode = false;
                        this.unsetStyle("ace_multiselect");
                        this.keyBinding.removeKeyboardHandler(c.keyboardHandler);
                        this.commands.removeDefaultHandler("exec", this.$onMultiSelectExec);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                        this._emit("changeSelection");
                    };
                    this.$onMultiSelectExec = function(c) {
                        var b = c.command;
                        var a = c.editor;
                        if (!a.multiSelect) return;
                        if (!b.multiSelectAction) {
                            var d = b.exec(a, c.args || {});
                            a.multiSelect.addRange(a.multiSelect.toOrientedRange());
                            a.multiSelect.mergeOverlappingRanges();
                        } else if (b.multiSelectAction == "forEach") {
                            d = a.forEachSelection(b, c.args);
                        } else if (b.multiSelectAction == "forEachLine") {
                            d = a.forEachSelection(b, c.args, true);
                        } else if (b.multiSelectAction == "single") {
                            a.exitMultiSelectMode();
                            d = b.exec(a, c.args || {});
                        } else {
                            d = b.multiSelectAction(a, c.args || {});
                        }
                        return d;
                    };
                    this.forEachSelection = function(c, h, f) {
                        if (this.inVirtualSelectionMode) return;
                        var m = f && f.keepOrder;
                        var n = f == true || (f && f.$byLines);
                        var j = this.session;
                        var a = this.selection;
                        var o = a.rangeList;
                        var d = (m ? a : o).ranges;
                        var k;
                        if (!d.length) return c.exec ? c.exec(this, h || {}) : c(this, h || {});
                        var p = a._eventRegistry;
                        a._eventRegistry = {};
                        var g = new e(j);
                        this.inVirtualSelectionMode = true;
                        for(var b = d.length; b--;){
                            if (n) {
                                while(b > 0 && d[b].start.row == d[b - 1].end.row)b--;
                            }
                            g.fromOrientedRange(d[b]);
                            g.index = b;
                            this.selection = j.selection = g;
                            var l = c.exec ? c.exec(this, h || {}) : c(this, h || {});
                            if (!k && l !== undefined) k = l;
                            g.toOrientedRange(d[b]);
                        }
                        g.detach();
                        this.selection = j.selection = a;
                        this.inVirtualSelectionMode = false;
                        a._eventRegistry = p;
                        a.mergeOverlappingRanges();
                        if (a.ranges[0]) a.fromOrientedRange(a.ranges[0]);
                        var i = this.renderer.$scrollAnimation;
                        this.onCursorChange();
                        this.onSelectionChange();
                        if (i && i.from == i.to) this.renderer.animateScrolling(i.from);
                        return k;
                    };
                    this.exitMultiSelectMode = function() {
                        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) return;
                        this.multiSelect.toSingleRange();
                    };
                    this.getSelectedText = function() {
                        var a = "";
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            var d = this.multiSelect.rangeList.ranges;
                            var b = [];
                            for(var c = 0; c < d.length; c++){
                                b.push(this.session.getTextRange(d[c]));
                            }
                            var e = this.session.getDocument().getNewLineCharacter();
                            a = b.join(e);
                            if (a.length == (b.length - 1) * e.length) a = "";
                        } else if (!this.selection.isEmpty()) {
                            a = this.session.getTextRange(this.getSelectionRange());
                        }
                        return a;
                    };
                    this.$checkMultiselectChange = function(d, b) {
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            var a = this.multiSelect.ranges[0];
                            if (this.multiSelect.isEmpty() && b == this.multiSelect.anchor) return;
                            var c = b == this.multiSelect.anchor ? a.cursor == a.start ? a.end : a.start : a.cursor;
                            if (c.row != b.row || this.session.$clipPositionToDocument(c.row, c.column).column != b.column) this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange());
                            else this.multiSelect.mergeOverlappingRanges();
                        }
                    };
                    this.findAll = function(f, a, g) {
                        a = a || {};
                        a.needle = f || a.needle;
                        if (a.needle == undefined) {
                            var c = this.selection.isEmpty() ? this.selection.getWordRange() : this.selection.getRange();
                            a.needle = this.session.getTextRange(c);
                        }
                        this.$search.set(a);
                        var b = this.$search.findAll(this.session);
                        if (!b.length) return 0;
                        var d = this.multiSelect;
                        if (!g) d.toSingleRange(b[0]);
                        for(var e = b.length; e--;)d.addRange(b[e], true);
                        if (c && d.rangeList.rangeAtPoint(c.start)) d.addRange(c, true);
                        return b.length;
                    };
                    this.selectMoreLines = function(f, j) {
                        var a = this.selection.toOrientedRange();
                        var g = a.cursor == a.end;
                        var c = this.session.documentToScreenPosition(a.cursor);
                        if (this.selection.$desiredColumn) c.column = this.selection.$desiredColumn;
                        var d = this.session.screenToDocumentPosition(c.row + f, c.column);
                        if (!a.isEmpty()) {
                            var h = this.session.documentToScreenPosition(g ? a.end : a.start);
                            var e = this.session.screenToDocumentPosition(h.row + f, h.column);
                        } else {
                            var e = d;
                        }
                        if (g) {
                            var b = k.fromPoints(d, e);
                            b.cursor = b.start;
                        } else {
                            var b = k.fromPoints(e, d);
                            b.cursor = b.end;
                        }
                        b.desiredColumn = c.column;
                        if (!this.selection.inMultiSelectMode) {
                            this.selection.addRange(a);
                        } else {
                            if (j) var i = a.cursor;
                        }
                        this.selection.addRange(b);
                        if (i) this.selection.substractPoint(i);
                    };
                    this.transposeSelections = function(h) {
                        var f = this.session;
                        var g = f.multiSelect;
                        var d = g.ranges;
                        for(var b = d.length; b--;){
                            var a = d[b];
                            if (a.isEmpty()) {
                                var c = f.getWordRange(a.start.row, a.start.column);
                                a.start.row = c.start.row;
                                a.start.column = c.start.column;
                                a.end.row = c.end.row;
                                a.end.column = c.end.column;
                            }
                        }
                        g.mergeOverlappingRanges();
                        var e = [];
                        for(var b = d.length; b--;){
                            var a = d[b];
                            e.unshift(f.getTextRange(a));
                        }
                        if (h < 0) e.unshift(e.pop());
                        else e.push(e.shift());
                        for(var b = d.length; b--;){
                            var a = d[b];
                            var c = a.clone();
                            f.replace(a, e[b]);
                            a.start.row = c.start.row;
                            a.start.column = c.start.column;
                        }
                        g.fromOrientedRange(g.ranges[0]);
                    };
                    this.selectMore = function(d, e, f) {
                        var c = this.session;
                        var g = c.multiSelect;
                        var a = g.toOrientedRange();
                        if (a.isEmpty()) {
                            a = c.getWordRange(a.start.row, a.start.column);
                            a.cursor = d == -1 ? a.start : a.end;
                            this.multiSelect.addRange(a);
                            if (f) return;
                        }
                        var h = c.getTextRange(a);
                        var b = p(c, h, d);
                        if (b) {
                            b.cursor = d == -1 ? b.start : b.end;
                            this.session.unfold(b);
                            this.multiSelect.addRange(b);
                            this.renderer.scrollCursorIntoView(null, 0.5);
                        }
                        if (e) this.multiSelect.substractPoint(a.cursor);
                    };
                    this.alignCursors = function() {
                        var l = this.session;
                        var i = l.multiSelect;
                        var b = i.ranges;
                        var m = -1;
                        var j = b.filter(function(a) {
                            if (a.cursor.row == m) return true;
                            m = a.cursor.row;
                        });
                        if (!b.length || j.length == b.length - 1) {
                            var d = this.selection.getRange();
                            var a = d.start.row, c = d.end.row;
                            var g = a == c;
                            if (g) {
                                var h = this.session.getLength();
                                var f;
                                do {
                                    f = this.session.getLine(c);
                                }while (/[=:]/.test(f) && ++c < h)
                                do {
                                    f = this.session.getLine(a);
                                }while (/[=:]/.test(f) && --a > 0)
                                if (a < 0) a = 0;
                                if (c >= h) c = h - 1;
                            }
                            var e = this.session.removeFullLines(a, c);
                            e = this.$reAlignText(e, g);
                            this.session.insert({
                                row: a,
                                column: 0
                            }, e.join("\n") + "\n");
                            if (!g) {
                                d.start.column = 0;
                                d.end.column = e[e.length - 1].length;
                            }
                            this.selection.setRange(d);
                        } else {
                            j.forEach(function(a) {
                                i.substractPoint(a.cursor);
                            });
                            var o = 0;
                            var p = Infinity;
                            var q = b.map(function(c) {
                                var b = c.cursor;
                                var d = l.getLine(b.row);
                                var a = d.substr(b.column).search(/\S/g);
                                if (a == -1) a = 0;
                                if (b.column > o) o = b.column;
                                if (a < p) p = a;
                                return a;
                            });
                            b.forEach(function(a, e) {
                                var b = a.cursor;
                                var c = o - b.column;
                                var d = q[e] - p;
                                if (c > d) l.insert(b, n.stringRepeat(" ", c - d));
                                else l.remove(new k(b.row, b.column, b.row, b.column - c + d));
                                a.start.column = a.end.column = o;
                                a.start.row = a.end.row = b.row;
                                a.cursor = a.end;
                            });
                            i.fromOrientedRange(b[0]);
                            this.renderer.updateCursor();
                            this.renderer.updateBackMarkers();
                        }
                    };
                    this.$reAlignText = function(a, b) {
                        var c = true, d = true;
                        var e, f, g;
                        return a.map(function(b) {
                            var a = b.match(/(\s*)(.*?)(\s*)([=:].*)/);
                            if (!a) return [
                                b
                            ];
                            if (e == null) {
                                e = a[1].length;
                                f = a[2].length;
                                g = a[3].length;
                                return a;
                            }
                            if (e + f + g != a[1].length + a[2].length + a[3].length) d = false;
                            if (e != a[1].length) c = false;
                            if (e > a[1].length) e = a[1].length;
                            if (f < a[2].length) f = a[2].length;
                            if (g > a[3].length) g = a[3].length;
                            return a;
                        }).map(b ? i : c ? d ? j : i : k);
                        function h(a) {
                            return n.stringRepeat(" ", a);
                        }
                        function i(a) {
                            return !a[2] ? a[0] : h(e) + a[2] + h(f - a[2].length + g) + a[4].replace(/^([=:])\s+/, "$1 ");
                        }
                        function j(a) {
                            return !a[2] ? a[0] : h(e + f - a[2].length) + a[2] + h(g) + a[4].replace(/^([=:])\s+/, "$1 ");
                        }
                        function k(a) {
                            return !a[2] ? a[0] : h(e) + a[2] + h(g) + a[4].replace(/^([=:])\s+/, "$1 ");
                        }
                    };
                }.call(d.prototype));
                function q(a, b) {
                    return a.row == b.row && a.column == b.column;
                }
                b.onSessionChange = function(c) {
                    var a = c.session;
                    if (a && !a.multiSelect) {
                        a.$selectionMarkers = [];
                        a.selection.$initRangeList();
                        a.multiSelect = a.selection;
                    }
                    this.multiSelect = a && a.multiSelect;
                    var b = c.oldSession;
                    if (b) {
                        b.multiSelect.off("addRange", this.$onAddRange);
                        b.multiSelect.off("removeRange", this.$onRemoveRange);
                        b.multiSelect.off("multiSelect", this.$onMultiSelect);
                        b.multiSelect.off("singleSelect", this.$onSingleSelect);
                        b.multiSelect.lead.off("change", this.$checkMultiselectChange);
                        b.multiSelect.anchor.off("change", this.$checkMultiselectChange);
                    }
                    if (a) {
                        a.multiSelect.on("addRange", this.$onAddRange);
                        a.multiSelect.on("removeRange", this.$onRemoveRange);
                        a.multiSelect.on("multiSelect", this.$onMultiSelect);
                        a.multiSelect.on("singleSelect", this.$onSingleSelect);
                        a.multiSelect.lead.on("change", this.$checkMultiselectChange);
                        a.multiSelect.anchor.on("change", this.$checkMultiselectChange);
                    }
                    if (a && this.inMultiSelectMode != a.selection.inMultiSelectMode) {
                        if (a.selection.inMultiSelectMode) this.$onMultiSelect();
                        else this.$onSingleSelect();
                    }
                };
                function h(a) {
                    if (a.$multiselectOnSessionChange) return;
                    a.$onAddRange = a.$onAddRange.bind(a);
                    a.$onRemoveRange = a.$onRemoveRange.bind(a);
                    a.$onMultiSelect = a.$onMultiSelect.bind(a);
                    a.$onSingleSelect = a.$onSingleSelect.bind(a);
                    a.$multiselectOnSessionChange = b.onSessionChange.bind(a);
                    a.$checkMultiselectChange = a.$checkMultiselectChange.bind(a);
                    a.$multiselectOnSessionChange(a);
                    a.on("changeSession", a.$multiselectOnSessionChange);
                    a.on("mousedown", l);
                    a.commands.addCommands(c.defaultCommands);
                    r(a);
                }
                function r(a) {
                    if (!a.textInput) return;
                    var b = a.textInput.getElement();
                    var c = false;
                    m.addListener(b, "keydown", function(b) {
                        var e = b.keyCode == 18 && !(b.ctrlKey || b.shiftKey || b.metaKey);
                        if (a.$blockSelectEnabled && e) {
                            if (!c) {
                                a.renderer.setMouseCursor("crosshair");
                                c = true;
                            }
                        } else if (c) {
                            d();
                        }
                    }, a);
                    m.addListener(b, "keyup", d, a);
                    m.addListener(b, "blur", d, a);
                    function d(b) {
                        if (c) {
                            a.renderer.setMouseCursor("");
                            c = false;
                        }
                    }
                }
                b.MultiSelect = h;
                a("./config").defineOptions(d.prototype, "editor", {
                    enableMultiselect: {
                        set: function(a) {
                            h(this);
                            if (a) {
                                this.on("changeSession", this.$multiselectOnSessionChange);
                                this.on("mousedown", l);
                            } else {
                                this.off("changeSession", this.$multiselectOnSessionChange);
                                this.off("mousedown", l);
                            }
                        },
                        value: true
                    },
                    enableBlockSelect: {
                        set: function(a) {
                            this.$blockSelectEnabled = a;
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
            ], function(a, b, d) {
                "use strict";
                var e = a("../../range").Range;
                var c = (b.FoldMode = function() {});
                (function() {
                    this.foldingStartMarker = null;
                    this.foldingStopMarker = null;
                    this.getFoldWidget = function(b, c, d) {
                        var a = b.getLine(d);
                        if (this.foldingStartMarker.test(a)) return "start";
                        if (c == "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(a)) return "end";
                        return "";
                    };
                    this.getFoldWidgetRange = function(a, b, c) {
                        return null;
                    };
                    this.indentationBlock = function(b, a, k) {
                        var d = /\S/;
                        var f = b.getLine(a);
                        var g = f.search(d);
                        if (g == -1) return;
                        var l = k || f.length;
                        var m = b.getLength();
                        var h = a;
                        var c = a;
                        while(++a < m){
                            var i = b.getLine(a).search(d);
                            if (i == -1) continue;
                            if (i <= g) {
                                var j = b.getTokenAt(a, 0);
                                if (!j || j.type !== "string") break;
                            }
                            c = a;
                        }
                        if (c > h) {
                            var n = b.getLine(c).length;
                            return new e(h, l, c, n);
                        }
                    };
                    this.openingBracketBlock = function(b, f, g, h, i) {
                        var c = {
                            row: g,
                            column: h + 1
                        };
                        var a = b.$findClosingBracket(f, c, i);
                        if (!a) return;
                        var d = b.foldWidgets[a.row];
                        if (d == null) d = b.getFoldWidget(a.row);
                        if (d == "start" && a.row > c.row) {
                            a.row--;
                            a.column = b.getLine(a.row).length;
                        }
                        return e.fromPoints(c, a);
                    };
                    this.closingBracketBlock = function(c, d, f, g, h) {
                        var a = {
                            row: f,
                            column: g
                        };
                        var b = c.$findOpeningBracket(d, a);
                        if (!b) return;
                        b.column++;
                        a.column--;
                        return e.fromPoints(b, a);
                    };
                }.call(c.prototype));
            });
            ace.define("ace/theme/textmate", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(b, a, d) {
                "use strict";
                a.isDark = false;
                a.cssClass = "ace-tm";
                a.cssText = '.ace-tm .ace_gutter {\
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
                a.$id = "ace/theme/textmate";
                var c = b("../lib/dom");
                c.importCssString(a.cssText, a.cssClass, false);
            });
            ace.define("ace/line_widgets", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(b, c, d) {
                "use strict";
                var e = b("./lib/dom");
                function a(a) {
                    this.session = a;
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
                    this.getRowLength = function(a) {
                        var b;
                        if (this.lineWidgets) b = (this.lineWidgets[a] && this.lineWidgets[a].rowCount) || 0;
                        else b = 0;
                        if (!this.$useWrapMode || !this.$wrapData[a]) {
                            return 1 + b;
                        } else {
                            return this.$wrapData[a].length + 1 + b;
                        }
                    };
                    this.$getWidgetScreenLength = function() {
                        var a = 0;
                        this.lineWidgets.forEach(function(b) {
                            if (b && b.rowCount && !b.hidden) a += b.rowCount;
                        });
                        return a;
                    };
                    this.$onChangeEditor = function(a) {
                        this.attach(a.editor);
                    };
                    this.attach = function(a) {
                        if (a && a.widgetManager && a.widgetManager != this) a.widgetManager.detach();
                        if (this.editor == a) return;
                        this.detach();
                        this.editor = a;
                        if (a) {
                            a.widgetManager = this;
                            a.renderer.on("beforeRender", this.measureWidgets);
                            a.renderer.on("afterRender", this.renderWidgets);
                        }
                    };
                    this.detach = function(c) {
                        var a = this.editor;
                        if (!a) return;
                        this.editor = null;
                        a.widgetManager = null;
                        a.renderer.off("beforeRender", this.measureWidgets);
                        a.renderer.off("afterRender", this.renderWidgets);
                        var b = this.session.lineWidgets;
                        b && b.forEach(function(a) {
                            if (a && a.el && a.el.parentNode) {
                                a._inDocument = false;
                                a.el.parentNode.removeChild(a.el);
                            }
                        });
                    };
                    this.updateOnFold = function(f, h) {
                        var a = h.lineWidgets;
                        if (!a || !f.action) return;
                        var g = f.data;
                        var c = g.start.row;
                        var b = g.end.row;
                        var d = f.action == "add";
                        for(var e = c + 1; e < b; e++){
                            if (a[e]) a[e].hidden = d;
                        }
                        if (a[b]) {
                            if (d) {
                                if (!a[c]) a[c] = a[b];
                                else a[b].hidden = d;
                            } else {
                                if (a[c] == a[b]) a[c] = undefined;
                                a[b].hidden = d;
                            }
                        }
                    };
                    this.updateOnChange = function(c) {
                        var a = this.session.lineWidgets;
                        if (!a) return;
                        var b = c.start.row;
                        var e = c.end.row - b;
                        if (e === 0) {} else if (c.action == "remove") {
                            var d = a.splice(b + 1, e);
                            if (!a[b] && d[d.length - 1]) {
                                a[b] = d.pop();
                            }
                            d.forEach(function(a) {
                                a && this.removeLineWidget(a);
                            }, this);
                            this.$updateRows();
                        } else {
                            var f = new Array(e);
                            if (a[b] && a[b].column != null) {
                                if (c.start.column > a[b].column) b++;
                            }
                            f.unshift(b, 0);
                            a.splice.apply(a, f);
                            this.$updateRows();
                        }
                    };
                    this.$updateRows = function() {
                        var a = this.session.lineWidgets;
                        if (!a) return;
                        var b = true;
                        a.forEach(function(a, c) {
                            if (a) {
                                b = false;
                                a.row = c;
                                while(a.$oldWidget){
                                    a.$oldWidget.row = c;
                                    a = a.$oldWidget;
                                }
                            }
                        });
                        if (b) this.session.lineWidgets = null;
                    };
                    this.$registerLineWidget = function(b) {
                        if (!this.session.lineWidgets) this.session.lineWidgets = new Array(this.session.getLength());
                        var a = this.session.lineWidgets[b.row];
                        if (a) {
                            b.$oldWidget = a;
                            if (a.el && a.el.parentNode) {
                                a.el.parentNode.removeChild(a.el);
                                a._inDocument = false;
                            }
                        }
                        this.session.lineWidgets[b.row] = b;
                        return b;
                    };
                    this.addLineWidget = function(a) {
                        this.$registerLineWidget(a);
                        a.session = this.session;
                        if (!this.editor) return a;
                        var c = this.editor.renderer;
                        if (a.html && !a.el) {
                            a.el = e.createElement("div");
                            a.el.innerHTML = a.html;
                        }
                        if (a.el) {
                            e.addCssClass(a.el, "ace_lineWidgetContainer");
                            a.el.style.position = "absolute";
                            a.el.style.zIndex = 5;
                            c.container.appendChild(a.el);
                            a._inDocument = true;
                            if (!a.coverGutter) {
                                a.el.style.zIndex = 3;
                            }
                            if (a.pixelHeight == null) {
                                a.pixelHeight = a.el.offsetHeight;
                            }
                        }
                        if (a.rowCount == null) {
                            a.rowCount = a.pixelHeight / c.layerConfig.lineHeight;
                        }
                        var b = this.session.getFoldAt(a.row, 0);
                        a.$fold = b;
                        if (b) {
                            var d = this.session.lineWidgets;
                            if (a.row == b.end.row && !d[b.start.row]) d[b.start.row] = a;
                            else a.hidden = true;
                        }
                        this.session._emit("changeFold", {
                            data: {
                                start: {
                                    row: a.row
                                }
                            }
                        });
                        this.$updateRows();
                        this.renderWidgets(null, c);
                        this.onWidgetChanged(a);
                        return a;
                    };
                    this.removeLineWidget = function(a) {
                        a._inDocument = false;
                        a.session = null;
                        if (a.el && a.el.parentNode) a.el.parentNode.removeChild(a.el);
                        if (a.editor && a.editor.destroy) try {
                            a.editor.destroy();
                        } catch (c) {}
                        if (this.session.lineWidgets) {
                            var b = this.session.lineWidgets[a.row];
                            if (b == a) {
                                this.session.lineWidgets[a.row] = a.$oldWidget;
                                if (a.$oldWidget) this.onWidgetChanged(a.$oldWidget);
                            } else {
                                while(b){
                                    if (b.$oldWidget == a) {
                                        b.$oldWidget = a.$oldWidget;
                                        break;
                                    }
                                    b = b.$oldWidget;
                                }
                            }
                        }
                        this.session._emit("changeFold", {
                            data: {
                                start: {
                                    row: a.row
                                }
                            }
                        });
                        this.$updateRows();
                    };
                    this.getWidgetsAtRow = function(d) {
                        var b = this.session.lineWidgets;
                        var a = b && b[d];
                        var c = [];
                        while(a){
                            c.push(a);
                            a = a.$oldWidget;
                        }
                        return c;
                    };
                    this.onWidgetChanged = function(a) {
                        this.session._changedWidgets.push(a);
                        this.editor && this.editor.renderer.updateFull();
                    };
                    this.measureWidgets = function(h, f) {
                        var c = this.session._changedWidgets;
                        var g = f.layerConfig;
                        if (!c || !c.length) return;
                        var d = Infinity;
                        for(var e = 0; e < c.length; e++){
                            var a = c[e];
                            if (!a || !a.el) continue;
                            if (a.session != this.session) continue;
                            if (!a._inDocument) {
                                if (this.session.lineWidgets[a.row] != a) continue;
                                a._inDocument = true;
                                f.container.appendChild(a.el);
                            }
                            a.h = a.el.offsetHeight;
                            if (!a.fixedWidth) {
                                a.w = a.el.offsetWidth;
                                a.screenWidth = Math.ceil(a.w / g.characterWidth);
                            }
                            var b = a.h / g.lineHeight;
                            if (a.coverLine) {
                                b -= this.session.getRowLineCount(a.row);
                                if (b < 0) b = 0;
                            }
                            if (a.rowCount != b) {
                                a.rowCount = b;
                                if (a.row < d) d = a.row;
                            }
                        }
                        if (d != Infinity) {
                            this.session._emit("changeFold", {
                                data: {
                                    start: {
                                        row: d
                                    }
                                }
                            });
                            this.session.lineWidgetWidth = null;
                        }
                        this.session._changedWidgets = [];
                    };
                    this.renderWidgets = function(j, c) {
                        var b = c.layerConfig;
                        var d = this.session.lineWidgets;
                        if (!d) return;
                        var e = Math.min(this.firstRow, b.firstRow);
                        var i = Math.max(this.lastRow, b.lastRow, d.length);
                        while(e > 0 && !d[e])e--;
                        this.firstRow = b.firstRow;
                        this.lastRow = b.lastRow;
                        c.$cursorLayer.config = b;
                        for(var f = e; f <= i; f++){
                            var a = d[f];
                            if (!a || !a.el) continue;
                            if (a.hidden) {
                                a.el.style.top = -100 - (a.pixelHeight || 0) + "px";
                                continue;
                            }
                            if (!a._inDocument) {
                                a._inDocument = true;
                                c.container.appendChild(a.el);
                            }
                            var g = c.$cursorLayer.getPixelPosition({
                                row: f,
                                column: 0
                            }, true).top;
                            if (!a.coverLine) g += b.lineHeight * this.session.getRowLineCount(a.row);
                            a.el.style.top = g - b.offset + "px";
                            var h = a.coverGutter ? 0 : c.gutterWidth;
                            if (!a.fixedWidth) h -= c.scrollLeft;
                            a.el.style.left = h + "px";
                            if (a.fullWidth && a.screenWidth) {
                                a.el.style.minWidth = b.width + 2 * b.padding + "px";
                            }
                            if (a.fixedWidth) {
                                a.el.style.right = c.scrollBar.getWidth() + "px";
                            } else {
                                a.el.style.right = "";
                            }
                        }
                    };
                }.call(a.prototype));
                c.LineWidgets = a;
            });
            ace.define("ace/ext/error_marker", [
                "require",
                "exports",
                "module",
                "ace/line_widgets",
                "ace/lib/dom",
                "ace/range", 
            ], function(a, b, d) {
                "use strict";
                var e = a("../line_widgets").LineWidgets;
                var c = a("../lib/dom");
                var f = a("../range").Range;
                function g(d, f, g) {
                    var a = 0;
                    var c = d.length - 1;
                    while(a <= c){
                        var b = (a + c) >> 1;
                        var e = g(f, d[b]);
                        if (e > 0) a = b + 1;
                        else if (e < 0) c = b - 1;
                        else return b;
                    }
                    return -(a + 1);
                }
                function h(i, e, d) {
                    var c = i.getAnnotations().sort(f.comparePoints);
                    if (!c.length) return;
                    var b = g(c, {
                        row: e,
                        column: -1
                    }, f.comparePoints);
                    if (b < 0) b = -b - 1;
                    if (b >= c.length) b = d > 0 ? 0 : c.length - 1;
                    else if (b === 0 && d < 0) b = c.length - 1;
                    var a = c[b];
                    if (!a || !d) return;
                    if (a.row === e) {
                        do {
                            a = c[(b += d)];
                        }while (a && a.row === e)
                        if (!a) return c.slice();
                    }
                    var h = [];
                    e = a.row;
                    do {
                        h[d < 0 ? "unshift" : "push"](a);
                        a = c[(b += d)];
                    }while (a && a.row == e)
                    return h.length && h;
                }
                b.showErrorMarker = function(a, m) {
                    var f = a.session;
                    if (!f.widgetManager) {
                        f.widgetManager = new e(f);
                        f.widgetManager.attach(a);
                    }
                    var d = a.getCursorPosition();
                    var j = d.row;
                    var k = f.widgetManager.getWidgetsAtRow(j).filter(function(a) {
                        return a.type == "errorMarker";
                    })[0];
                    if (k) {
                        k.destroy();
                    } else {
                        j -= m;
                    }
                    var n = h(f, j, m);
                    var g;
                    if (n) {
                        var i = n[0];
                        d.column = (i.pos && typeof i.column != "number" ? i.pos.sc : i.column) || 0;
                        d.row = i.row;
                        g = a.renderer.$gutterLayer.$annotations[d.row];
                    } else if (k) {
                        return;
                    } else {
                        g = {
                            text: [
                                "Looks good!"
                            ],
                            className: "ace_ok"
                        };
                    }
                    a.session.unfold(d.row);
                    a.selection.moveToPosition(d);
                    var b = {
                        row: d.row,
                        fixedWidth: true,
                        coverGutter: true,
                        el: c.createElement("div"),
                        type: "errorMarker"
                    };
                    var l = b.el.appendChild(c.createElement("div"));
                    var o = b.el.appendChild(c.createElement("div"));
                    o.className = "error_widget_arrow " + g.className;
                    var p = a.renderer.$cursorLayer.getPixelPosition(d).left;
                    o.style.left = p + a.renderer.gutterWidth - 5 + "px";
                    b.el.className = "error_widget_wrapper";
                    l.className = "error_widget " + g.className;
                    l.innerHTML = g.text.join("<br>");
                    l.appendChild(c.createElement("div"));
                    var q = function(d, c, a) {
                        if (c === 0 && (a === "esc" || a === "return")) {
                            b.destroy();
                            return {
                                command: "null"
                            };
                        }
                    };
                    b.destroy = function() {
                        if (a.$mouseHandler.isMousePressed) return;
                        a.keyBinding.removeKeyboardHandler(q);
                        f.widgetManager.removeLineWidget(b);
                        a.off("changeSelection", b.destroy);
                        a.off("changeSession", b.destroy);
                        a.off("mouseup", b.destroy);
                        a.off("change", b.destroy);
                    };
                    a.keyBinding.addKeyboardHandler(q);
                    a.on("changeSelection", b.destroy);
                    a.on("changeSession", b.destroy);
                    a.on("mouseup", b.destroy);
                    a.on("change", b.destroy);
                    a.session.widgetManager.addLineWidget(b);
                    b.el.onmousedown = a.focus.bind(a);
                    a.renderer.scrollCursorIntoView(null, 0.5, {
                        bottom: b.el.offsetHeight
                    });
                };
                c.importCssString("\
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
            ], function(a, c, i) {
                "use strict";
                a("./lib/fixoldbrowsers");
                var j = a("./lib/dom");
                var k = a("./lib/event");
                var d = a("./range").Range;
                var e = a("./editor").Editor;
                var f = a("./edit_session").EditSession;
                var g = a("./undomanager").UndoManager;
                var h = a("./virtual_renderer").VirtualRenderer;
                a("./worker/worker_client");
                a("./keyboard/hash_handler");
                a("./placeholder");
                a("./multi_select");
                a("./mode/folding/fold_mode");
                a("./theme/textmate");
                a("./ext/error_marker");
                c.config = a("./config");
                c.require = a;
                if (true) c.define = b.amdD;
                c.edit = function(a, m) {
                    if (typeof a == "string") {
                        var i = a;
                        a = document.getElementById(i);
                        if (!a) throw new Error("ace.edit can't find div #" + i);
                    }
                    if (a && a.env && a.env.editor instanceof e) return a.env.editor;
                    var f = "";
                    if (a && /input|textarea/i.test(a.tagName)) {
                        var d = a;
                        f = d.value;
                        a = j.createElement("pre");
                        d.parentNode.replaceChild(a, d);
                    } else if (a) {
                        f = a.textContent;
                        a.innerHTML = "";
                    }
                    var l = c.createEditSession(f);
                    var b = new e(new h(a), l, m);
                    var g = {
                        document: l,
                        editor: b,
                        onResize: b.resize.bind(b, null)
                    };
                    if (d) g.textarea = d;
                    k.addListener(window, "resize", g.onResize);
                    b.on("destroy", function() {
                        k.removeListener(window, "resize", g.onResize);
                        g.editor.container.env = null;
                    });
                    b.container.env = b.env = g;
                    return b;
                };
                c.createEditSession = function(b, c) {
                    var a = new f(b, c);
                    a.setUndoManager(new g());
                    return a;
                };
                c.Range = d;
                c.Editor = e;
                c.EditSession = f;
                c.UndoManager = g;
                c.VirtualRenderer = h;
                c.version = c.config.version;
            });
            (function() {
                ace.require([
                    "ace/ace"
                ], function(b) {
                    if (b) {
                        b.config.init(true);
                        b.define = ace.define;
                    }
                    if (!window.ace) window.ace = b;
                    for(var c in b)if (b.hasOwnProperty(c)) window.ace[c] = b[c];
                    window.ace["default"] = window.ace;
                    if (true && a) {
                        a.exports = window.ace;
                    }
                });
            })();
        }
    }, 
]);
