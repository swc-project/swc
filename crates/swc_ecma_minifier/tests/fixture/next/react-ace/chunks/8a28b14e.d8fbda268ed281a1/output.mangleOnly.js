(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        281
    ],
    {
        3239: function(a, b, c) {
            a = c.nmd(a);
            (function() {
                var a = "ace";
                var b = (function() {
                    return this;
                })();
                if (!b && typeof window != "undefined") b = window;
                if (!a && typeof requirejs !== "undefined") return;
                var c = function(a, b, d) {
                    if (typeof a !== "string") {
                        if (c.original) c.original.apply(this, arguments);
                        else {
                            console.error("dropping module because define wasn't a string.");
                            console.trace();
                        }
                        return;
                    }
                    if (arguments.length == 2) d = b;
                    if (!c.modules[a]) {
                        c.payloads[a] = d;
                        c.modules[a] = null;
                    }
                };
                c.modules = {};
                c.payloads = {};
                var d = function(a, b, c) {
                    if (typeof b === "string") {
                        var d = g(a, b);
                        if (d != undefined) {
                            c && c();
                            return d;
                        }
                    } else if (Object.prototype.toString.call(b) === "[object Array]") {
                        var f = [];
                        for(var h = 0, i = b.length; h < i; ++h){
                            var j = g(a, b[h]);
                            if (j == undefined && e.original) return;
                            f.push(j);
                        }
                        return ((c && c.apply(null, f)) || true);
                    }
                };
                var e = function(a, b) {
                    var c = d("", a, b);
                    if (c == undefined && e.original) return e.original.apply(this, arguments);
                    return c;
                };
                var f = function(a, b) {
                    if (b.indexOf("!") !== -1) {
                        var c = b.split("!");
                        return (f(a, c[0]) + "!" + f(a, c[1]));
                    }
                    if (b.charAt(0) == ".") {
                        var d = a.split("/").slice(0, -1).join("/");
                        b = d + "/" + b;
                        while(b.indexOf(".") !== -1 && e != b){
                            var e = b;
                            b = b.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
                        }
                    }
                    return b;
                };
                var g = function(a, b) {
                    b = f(a, b);
                    var e = c.modules[b];
                    if (!e) {
                        e = c.payloads[b];
                        if (typeof e === "function") {
                            var g = {};
                            var h = {
                                id: b,
                                uri: "",
                                exports: g,
                                packaged: true
                            };
                            var i = function(a, c) {
                                return d(b, a, c);
                            };
                            var j = e(i, g, h);
                            g = j || h.exports;
                            c.modules[b] = g;
                            delete c.payloads[b];
                        }
                        e = c.modules[b] = g || e;
                    }
                    return e;
                };
                function h(a) {
                    var d = b;
                    if (a) {
                        if (!b[a]) b[a] = {};
                        d = b[a];
                    }
                    if (!d.define || !d.define.packaged) {
                        c.original = d.define;
                        d.define = c;
                        d.define.packaged = true;
                    }
                    if (!d.require || !d.require.packaged) {
                        e.original = d.require;
                        d.require = e;
                        d.require.packaged = true;
                    }
                }
                h(a);
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
            ], function(a, b, c) {
                "use strict";
                b.OS = {
                    LINUX: "LINUX",
                    MAC: "MAC",
                    WINDOWS: "WINDOWS"
                };
                b.getOS = function() {
                    if (b.isMac) {
                        return b.OS.MAC;
                    } else if (b.isLinux) {
                        return b.OS.LINUX;
                    } else {
                        return b.OS.WINDOWS;
                    }
                };
                var d = typeof navigator == "object" ? navigator : {};
                var e = (/mac|win|linux/i.exec(d.platform) || [
                    "other", 
                ])[0].toLowerCase();
                var f = d.userAgent || "";
                var g = d.appName || "";
                b.isWin = e == "win";
                b.isMac = e == "mac";
                b.isLinux = e == "linux";
                b.isIE = g == "Microsoft Internet Explorer" || g.indexOf("MSAppHost") >= 0 ? parseFloat((f.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]) : parseFloat((f.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]);
                b.isOldIE = b.isIE && b.isIE < 9;
                b.isGecko = b.isMozilla = f.match(/ Gecko\/\d+/);
                b.isOpera = typeof opera == "object" && Object.prototype.toString.call(window.opera) == "[object Opera]";
                b.isWebKit = parseFloat(f.split("WebKit/")[1]) || undefined;
                b.isChrome = parseFloat(f.split(" Chrome/")[1]) || undefined;
                b.isEdge = parseFloat(f.split(" Edge/")[1]) || undefined;
                b.isAIR = f.indexOf("AdobeAIR") >= 0;
                b.isAndroid = f.indexOf("Android") >= 0;
                b.isChromeOS = f.indexOf(" CrOS ") >= 0;
                b.isIOS = /iPad|iPhone|iPod/.test(f) && !window.MSStream;
                if (b.isIOS) b.isMac = true;
                b.isMobile = b.isIOS || b.isAndroid;
            });
            ace.define("ace/lib/dom", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(a, b, c) {
                "use strict";
                var d = a("./useragent");
                var e = "http://www.w3.org/1999/xhtml";
                b.buildDom = function a(b, c, d) {
                    if (typeof b == "string" && b) {
                        var e = document.createTextNode(b);
                        if (c) c.appendChild(e);
                        return e;
                    }
                    if (!Array.isArray(b)) {
                        if (b && b.appendChild && c) c.appendChild(b);
                        return b;
                    }
                    if (typeof b[0] != "string" || !b[0]) {
                        var f = [];
                        for(var g = 0; g < b.length; g++){
                            var h = a(b[g], c, d);
                            h && f.push(h);
                        }
                        return f;
                    }
                    var i = document.createElement(b[0]);
                    var j = b[1];
                    var k = 1;
                    if (j && typeof j == "object" && !Array.isArray(j)) k = 2;
                    for(var g = k; g < b.length; g++)a(b[g], i, d);
                    if (k == 2) {
                        Object.keys(j).forEach(function(a) {
                            var b = j[a];
                            if (a === "class") {
                                i.className = Array.isArray(b) ? b.join(" ") : b;
                            } else if (typeof b == "function" || a == "value" || a[0] == "$") {
                                i[a] = b;
                            } else if (a === "ref") {
                                if (d) d[b] = i;
                            } else if (a === "style") {
                                if (typeof b == "string") i.style.cssText = b;
                            } else if (b != null) {
                                i.setAttribute(a, b);
                            }
                        });
                    }
                    if (c) c.appendChild(i);
                    return i;
                };
                b.getDocumentHead = function(a) {
                    if (!a) a = document;
                    return (a.head || a.getElementsByTagName("head")[0] || a.documentElement);
                };
                b.createElement = function(a, b) {
                    return document.createElementNS ? document.createElementNS(b || e, a) : document.createElement(a);
                };
                b.removeChildren = function(a) {
                    a.innerHTML = "";
                };
                b.createTextNode = function(a, b) {
                    var c = b ? b.ownerDocument : document;
                    return c.createTextNode(a);
                };
                b.createFragment = function(a) {
                    var b = a ? a.ownerDocument : document;
                    return b.createDocumentFragment();
                };
                b.hasCssClass = function(a, b) {
                    var c = (a.className + "").split(/\s+/g);
                    return c.indexOf(b) !== -1;
                };
                b.addCssClass = function(a, c) {
                    if (!b.hasCssClass(a, c)) {
                        a.className += " " + c;
                    }
                };
                b.removeCssClass = function(a, b) {
                    var c = a.className.split(/\s+/g);
                    while(true){
                        var d = c.indexOf(b);
                        if (d == -1) {
                            break;
                        }
                        c.splice(d, 1);
                    }
                    a.className = c.join(" ");
                };
                b.toggleCssClass = function(a, b) {
                    var c = a.className.split(/\s+/g), d = true;
                    while(true){
                        var e = c.indexOf(b);
                        if (e == -1) {
                            break;
                        }
                        d = false;
                        c.splice(e, 1);
                    }
                    if (d) c.push(b);
                    a.className = c.join(" ");
                    return d;
                };
                b.setCssClass = function(a, c, d) {
                    if (d) {
                        b.addCssClass(a, c);
                    } else {
                        b.removeCssClass(a, c);
                    }
                };
                b.hasCssString = function(a, b) {
                    var c = 0, d;
                    b = b || document;
                    if ((d = b.querySelectorAll("style"))) {
                        while(c < d.length)if (d[c++].id === a) return true;
                    }
                };
                var f;
                var g = [];
                b.useStrictCSP = function(a) {
                    f = a;
                    if (a == false) h();
                    else if (!g) g = [];
                };
                function h() {
                    var a = g;
                    g = null;
                    a && a.forEach(function(a) {
                        i(a[0], a[1]);
                    });
                }
                function i(a, c, d) {
                    if (typeof document == "undefined") return;
                    if (g) {
                        if (d) {
                            h();
                        } else if (d === false) {
                            return g.push([
                                a,
                                c
                            ]);
                        }
                    }
                    if (f) return;
                    var e = d;
                    if (!d || !d.getRootNode) {
                        e = document;
                    } else {
                        e = d.getRootNode();
                        if (!e || e == d) e = document;
                    }
                    var i = e.ownerDocument || e;
                    if (c && b.hasCssString(c, e)) return null;
                    if (c) a += "\n/*# sourceURL=ace/css/" + c + " */";
                    var j = b.createElement("style");
                    j.appendChild(i.createTextNode(a));
                    if (c) j.id = c;
                    if (e == i) e = b.getDocumentHead(i);
                    e.insertBefore(j, e.firstChild);
                }
                b.importCssString = i;
                b.importCssStylsheet = function(a, c) {
                    b.buildDom([
                        "link",
                        {
                            rel: "stylesheet",
                            href: a
                        }
                    ], b.getDocumentHead(c));
                };
                b.scrollbarWidth = function(a) {
                    var c = b.createElement("ace_inner");
                    c.style.width = "100%";
                    c.style.minWidth = "0px";
                    c.style.height = "200px";
                    c.style.display = "block";
                    var d = b.createElement("ace_outer");
                    var e = d.style;
                    e.position = "absolute";
                    e.left = "-10000px";
                    e.overflow = "hidden";
                    e.width = "200px";
                    e.minWidth = "0px";
                    e.height = "150px";
                    e.display = "block";
                    d.appendChild(c);
                    var f = a.documentElement;
                    f.appendChild(d);
                    var g = c.offsetWidth;
                    e.overflow = "scroll";
                    var h = c.offsetWidth;
                    if (g == h) {
                        h = d.clientWidth;
                    }
                    f.removeChild(d);
                    return g - h;
                };
                b.computedStyle = function(a, b) {
                    return window.getComputedStyle(a, "") || {};
                };
                b.setStyle = function(a, b, c) {
                    if (a[b] !== c) {
                        a[b] = c;
                    }
                };
                b.HAS_CSS_ANIMATION = false;
                b.HAS_CSS_TRANSFORMS = false;
                b.HI_DPI = d.isWin ? typeof window !== "undefined" && window.devicePixelRatio >= 1.5 : true;
                if (d.isChromeOS) b.HI_DPI = false;
                if (typeof document !== "undefined") {
                    var j = document.createElement("div");
                    if (b.HI_DPI && j.style.transform !== undefined) b.HAS_CSS_TRANSFORMS = true;
                    if (!d.isEdge && typeof j.style.animationName !== "undefined") b.HAS_CSS_ANIMATION = true;
                    j = null;
                }
                if (b.HAS_CSS_TRANSFORMS) {
                    b.translate = function(a, b, c) {
                        a.style.transform = "translate(" + Math.round(b) + "px, " + Math.round(c) + "px)";
                    };
                } else {
                    b.translate = function(a, b, c) {
                        a.style.top = Math.round(c) + "px";
                        a.style.left = Math.round(b) + "px";
                    };
                }
            });
            ace.define("ace/lib/oop", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                b.inherits = function(a, b) {
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
                b.mixin = function(a, b) {
                    for(var c in b){
                        a[c] = b[c];
                    }
                    return a;
                };
                b.implement = function(a, c) {
                    b.mixin(a, c);
                };
            });
            ace.define("ace/lib/keys", [
                "require",
                "exports",
                "module",
                "ace/lib/oop"
            ], function(a, b, c) {
                "use strict";
                var d = a("./oop");
                var e = (function() {
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
                    var b, c;
                    for(c in a.FUNCTION_KEYS){
                        b = a.FUNCTION_KEYS[c].toLowerCase();
                        a[b] = parseInt(c, 10);
                    }
                    for(c in a.PRINTABLE_KEYS){
                        b = a.PRINTABLE_KEYS[c].toLowerCase();
                        a[b] = parseInt(c, 10);
                    }
                    d.mixin(a, a.MODIFIER_KEYS);
                    d.mixin(a, a.PRINTABLE_KEYS);
                    d.mixin(a, a.FUNCTION_KEYS);
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
                d.mixin(b, e);
                b.keyCodeToString = function(a) {
                    var b = e[a];
                    if (typeof b != "string") b = String.fromCharCode(a);
                    return b.toLowerCase();
                };
            });
            ace.define("ace/lib/event", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./keys");
                var e = a("./useragent");
                var f = null;
                var g = 0;
                var h;
                function i() {
                    h = false;
                    try {
                        document.createComment("").addEventListener("test", function() {}, {
                            get passive () {
                                h = {
                                    passive: false
                                };
                            }
                        });
                    } catch (a) {}
                }
                function j() {
                    if (h == undefined) i();
                    return h;
                }
                function k(a, b, c) {
                    this.elem = a;
                    this.type = b;
                    this.callback = c;
                }
                k.prototype.destroy = function() {
                    m(this.elem, this.type, this.callback);
                    this.elem = this.type = this.callback = undefined;
                };
                var l = (b.addListener = function(a, b, c, d) {
                    a.addEventListener(b, c, j());
                    if (d) d.$toDestroy.push(new k(a, b, c));
                });
                var m = (b.removeListener = function(a, b, c) {
                    a.removeEventListener(b, c, j());
                });
                b.stopEvent = function(a) {
                    b.stopPropagation(a);
                    b.preventDefault(a);
                    return false;
                };
                b.stopPropagation = function(a) {
                    if (a.stopPropagation) a.stopPropagation();
                };
                b.preventDefault = function(a) {
                    if (a.preventDefault) a.preventDefault();
                };
                b.getButton = function(a) {
                    if (a.type == "dblclick") return 0;
                    if (a.type == "contextmenu" || (e.isMac && a.ctrlKey && !a.altKey && !a.shiftKey)) return 2;
                    return a.button;
                };
                b.capture = function(a, b, c) {
                    var d = (a && a.ownerDocument) || document;
                    function e(a) {
                        b && b(a);
                        c && c(a);
                        m(d, "mousemove", b);
                        m(d, "mouseup", e);
                        m(d, "dragstart", e);
                    }
                    l(d, "mousemove", b);
                    l(d, "mouseup", e);
                    l(d, "dragstart", e);
                    return e;
                };
                b.addMouseWheelListener = function(a, b, c) {
                    if ("onmousewheel" in a) {
                        l(a, "mousewheel", function(a) {
                            var c = 8;
                            if (a.wheelDeltaX !== undefined) {
                                a.wheelX = -a.wheelDeltaX / c;
                                a.wheelY = -a.wheelDeltaY / c;
                            } else {
                                a.wheelX = 0;
                                a.wheelY = -a.wheelDelta / c;
                            }
                            b(a);
                        }, c);
                    } else if ("onwheel" in a) {
                        l(a, "wheel", function(a) {
                            var c = 0.35;
                            switch(a.deltaMode){
                                case a.DOM_DELTA_PIXEL:
                                    a.wheelX = a.deltaX * c || 0;
                                    a.wheelY = a.deltaY * c || 0;
                                    break;
                                case a.DOM_DELTA_LINE:
                                case a.DOM_DELTA_PAGE:
                                    a.wheelX = (a.deltaX || 0) * 5;
                                    a.wheelY = (a.deltaY || 0) * 5;
                                    break;
                            }
                            b(a);
                        }, c);
                    } else {
                        l(a, "DOMMouseScroll", function(a) {
                            if (a.axis && a.axis == a.HORIZONTAL_AXIS) {
                                a.wheelX = (a.detail || 0) * 5;
                                a.wheelY = 0;
                            } else {
                                a.wheelX = 0;
                                a.wheelY = (a.detail || 0) * 5;
                            }
                            b(a);
                        }, c);
                    }
                };
                b.addMultiMouseDownListener = function(a, c, d, f, g) {
                    var h = 0;
                    var i, j, k;
                    var m = {
                        2: "dblclick",
                        3: "tripleclick",
                        4: "quadclick"
                    };
                    function n(a) {
                        if (b.getButton(a) !== 0) {
                            h = 0;
                        } else if (a.detail > 1) {
                            h++;
                            if (h > 4) h = 1;
                        } else {
                            h = 1;
                        }
                        if (e.isIE) {
                            var g = Math.abs(a.clientX - i) > 5 || Math.abs(a.clientY - j) > 5;
                            if (!k || g) h = 1;
                            if (k) clearTimeout(k);
                            k = setTimeout(function() {
                                k = null;
                            }, c[h - 1] || 600);
                            if (h == 1) {
                                i = a.clientX;
                                j = a.clientY;
                            }
                        }
                        a._clicks = h;
                        d[f]("mousedown", a);
                        if (h > 4) h = 0;
                        else if (h > 1) return d[f](m[h], a);
                    }
                    if (!Array.isArray(a)) a = [
                        a
                    ];
                    a.forEach(function(a) {
                        l(a, "mousedown", n, g);
                    });
                };
                var n = function(a) {
                    return (0 | (a.ctrlKey ? 1 : 0) | (a.altKey ? 2 : 0) | (a.shiftKey ? 4 : 0) | (a.metaKey ? 8 : 0));
                };
                b.getModifierString = function(a) {
                    return d.KEY_MODS[n(a)];
                };
                function o(a, b, c) {
                    var h = n(b);
                    if (!e.isMac && f) {
                        if (b.getModifierState && (b.getModifierState("OS") || b.getModifierState("Win"))) h |= 8;
                        if (f.altGr) {
                            if ((3 & h) != 3) f.altGr = 0;
                            else return;
                        }
                        if (c === 18 || c === 17) {
                            var i = "location" in b ? b.location : b.keyLocation;
                            if (c === 17 && i === 1) {
                                if (f[c] == 1) g = b.timeStamp;
                            } else if (c === 18 && h === 3 && i === 2) {
                                var j = b.timeStamp - g;
                                if (j < 50) f.altGr = true;
                            }
                        }
                    }
                    if (c in d.MODIFIER_KEYS) {
                        c = -1;
                    }
                    if (!h && c === 13) {
                        var i = "location" in b ? b.location : b.keyLocation;
                        if (i === 3) {
                            a(b, h, -c);
                            if (b.defaultPrevented) return;
                        }
                    }
                    if (e.isChromeOS && h & 8) {
                        a(b, h, c);
                        if (b.defaultPrevented) return;
                        else h &= ~8;
                    }
                    if (!h && !(c in d.FUNCTION_KEYS) && !(c in d.PRINTABLE_KEYS)) {
                        return false;
                    }
                    return a(b, h, c);
                }
                b.addCommandKeyListener = function(a, c, d) {
                    if (e.isOldGecko || (e.isOpera && !("KeyboardEvent" in window))) {
                        var g = null;
                        l(a, "keydown", function(a) {
                            g = a.keyCode;
                        }, d);
                        l(a, "keypress", function(a) {
                            return o(c, a, g);
                        }, d);
                    } else {
                        var h = null;
                        l(a, "keydown", function(a) {
                            f[a.keyCode] = (f[a.keyCode] || 0) + 1;
                            var b = o(c, a, a.keyCode);
                            h = a.defaultPrevented;
                            return b;
                        }, d);
                        l(a, "keypress", function(a) {
                            if (h && (a.ctrlKey || a.altKey || a.shiftKey || a.metaKey)) {
                                b.stopEvent(a);
                                h = null;
                            }
                        }, d);
                        l(a, "keyup", function(a) {
                            f[a.keyCode] = null;
                        }, d);
                        if (!f) {
                            p();
                            l(window, "focus", p);
                        }
                    }
                };
                function p() {
                    f = Object.create(null);
                }
                if (typeof window == "object" && window.postMessage && !e.isOldIE) {
                    var q = 1;
                    b.nextTick = function(a, c) {
                        c = c || window;
                        var d = "zero-timeout-message-" + q++;
                        var e = function(f) {
                            if (f.data == d) {
                                b.stopPropagation(f);
                                m(c, "message", e);
                                a();
                            }
                        };
                        l(c, "message", e);
                        c.postMessage(d, "*");
                    };
                }
                b.$idleBlocked = false;
                b.onIdle = function(a, c) {
                    return setTimeout(function c() {
                        if (!b.$idleBlocked) {
                            a();
                        } else {
                            setTimeout(c, 100);
                        }
                    }, c);
                };
                b.$idleBlockId = null;
                b.blockIdle = function(a) {
                    if (b.$idleBlockId) clearTimeout(b.$idleBlockId);
                    b.$idleBlocked = true;
                    b.$idleBlockId = setTimeout(function() {
                        b.$idleBlocked = false;
                    }, a || 100);
                };
                b.nextFrame = typeof window == "object" && (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame);
                if (b.nextFrame) b.nextFrame = b.nextFrame.bind(window);
                else b.nextFrame = function(a) {
                    setTimeout(a, 17);
                };
            });
            ace.define("ace/range", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                var d = function(a, b) {
                    return a.row - b.row || a.column - b.column;
                };
                var e = function(a, b, c, d) {
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
                    this.compareRange = function(a) {
                        var b, c = a.end, d = a.start;
                        b = this.compare(c.row, c.column);
                        if (b == 1) {
                            b = this.compare(d.row, d.column);
                            if (b == 1) {
                                return 2;
                            } else if (b == 0) {
                                return 1;
                            } else {
                                return 0;
                            }
                        } else if (b == -1) {
                            return -2;
                        } else {
                            b = this.compare(d.row, d.column);
                            if (b == -1) {
                                return -1;
                            } else if (b == 1) {
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
                    this.intersects = function(a) {
                        var b = this.compareRange(a);
                        return b == -1 || b == 0 || b == 1;
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
                    this.clipRows = function(a, b) {
                        if (this.end.row > b) var c = {
                            row: b + 1,
                            column: 0
                        };
                        else if (this.end.row < a) var c = {
                            row: a,
                            column: 0
                        };
                        if (this.start.row > b) var d = {
                            row: b + 1,
                            column: 0
                        };
                        else if (this.start.row < a) var d = {
                            row: a,
                            column: 0
                        };
                        return e.fromPoints(d || this.start, c || this.end);
                    };
                    this.extend = function(a, b) {
                        var c = this.compare(a, b);
                        if (c == 0) return this;
                        else if (c == -1) var d = {
                            row: a,
                            column: b
                        };
                        else var f = {
                            row: a,
                            column: b
                        };
                        return e.fromPoints(d || this.start, f || this.end);
                    };
                    this.isEmpty = function() {
                        return (this.start.row === this.end.row && this.start.column === this.end.column);
                    };
                    this.isMultiLine = function() {
                        return this.start.row !== this.end.row;
                    };
                    this.clone = function() {
                        return e.fromPoints(this.start, this.end);
                    };
                    this.collapseRows = function() {
                        if (this.end.column == 0) return new e(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
                        else return new e(this.start.row, 0, this.end.row, 0);
                    };
                    this.toScreenRange = function(a) {
                        var b = a.documentToScreenPosition(this.start);
                        var c = a.documentToScreenPosition(this.end);
                        return new e(b.row, b.column, c.row, c.column);
                    };
                    this.moveBy = function(a, b) {
                        this.start.row += a;
                        this.start.column += b;
                        this.end.row += a;
                        this.end.column += b;
                    };
                }.call(e.prototype));
                e.fromPoints = function(a, b) {
                    return new e(a.row, a.column, b.row, b.column);
                };
                e.comparePoints = d;
                e.comparePoints = function(a, b) {
                    return a.row - b.row || a.column - b.column;
                };
                b.Range = e;
            });
            ace.define("ace/lib/lang", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                b.last = function(a) {
                    return a[a.length - 1];
                };
                b.stringReverse = function(a) {
                    return a.split("").reverse().join("");
                };
                b.stringRepeat = function(a, b) {
                    var c = "";
                    while(b > 0){
                        if (b & 1) c += a;
                        if ((b >>= 1)) a += a;
                    }
                    return c;
                };
                var d = /^\s\s*/;
                var e = /\s\s*$/;
                b.stringTrimLeft = function(a) {
                    return a.replace(d, "");
                };
                b.stringTrimRight = function(a) {
                    return a.replace(e, "");
                };
                b.copyObject = function(a) {
                    var b = {};
                    for(var c in a){
                        b[c] = a[c];
                    }
                    return b;
                };
                b.copyArray = function(a) {
                    var b = [];
                    for(var c = 0, d = a.length; c < d; c++){
                        if (a[c] && typeof a[c] == "object") b[c] = this.copyObject(a[c]);
                        else b[c] = a[c];
                    }
                    return b;
                };
                b.deepCopy = function a(b) {
                    if (typeof b !== "object" || !b) return b;
                    var c;
                    if (Array.isArray(b)) {
                        c = [];
                        for(var d = 0; d < b.length; d++){
                            c[d] = a(b[d]);
                        }
                        return c;
                    }
                    if (Object.prototype.toString.call(b) !== "[object Object]") return b;
                    c = {};
                    for(var d in b)c[d] = a(b[d]);
                    return c;
                };
                b.arrayToMap = function(a) {
                    var b = {};
                    for(var c = 0; c < a.length; c++){
                        b[a[c]] = 1;
                    }
                    return b;
                };
                b.createMap = function(a) {
                    var b = Object.create(null);
                    for(var c in a){
                        b[c] = a[c];
                    }
                    return b;
                };
                b.arrayRemove = function(a, b) {
                    for(var c = 0; c <= a.length; c++){
                        if (b === a[c]) {
                            a.splice(c, 1);
                        }
                    }
                };
                b.escapeRegExp = function(a) {
                    return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
                };
                b.escapeHTML = function(a) {
                    return ("" + a).replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
                };
                b.getMatchOffsets = function(a, b) {
                    var c = [];
                    a.replace(b, function(a) {
                        c.push({
                            offset: arguments[arguments.length - 2],
                            length: a.length
                        });
                    });
                    return c;
                };
                b.deferredCall = function(a) {
                    var b = null;
                    var c = function() {
                        b = null;
                        a();
                    };
                    var d = function(a) {
                        d.cancel();
                        b = setTimeout(c, a || 0);
                        return d;
                    };
                    d.schedule = d;
                    d.call = function() {
                        this.cancel();
                        a();
                        return d;
                    };
                    d.cancel = function() {
                        clearTimeout(b);
                        b = null;
                        return d;
                    };
                    d.isPending = function() {
                        return b;
                    };
                    return d;
                };
                b.delayedCall = function(a, b) {
                    var c = null;
                    var d = function() {
                        c = null;
                        a();
                    };
                    var e = function(a) {
                        if (c == null) c = setTimeout(d, a || b);
                    };
                    e.delay = function(a) {
                        c && clearTimeout(c);
                        c = setTimeout(d, a || b);
                    };
                    e.schedule = e;
                    e.call = function() {
                        this.cancel();
                        a();
                    };
                    e.cancel = function() {
                        c && clearTimeout(c);
                        c = null;
                    };
                    e.isPending = function() {
                        return c;
                    };
                    return e;
                };
            });
            ace.define("ace/clipboard", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                var d;
                c.exports = {
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
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/event");
                var e = a("../lib/useragent");
                var f = a("../lib/dom");
                var g = a("../lib/lang");
                var h = a("../clipboard");
                var i = e.isChrome < 18;
                var j = e.isIE;
                var k = e.isChrome > 63;
                var l = 400;
                var m = a("../lib/keys");
                var n = m.KEY_MODS;
                var o = e.isIOS;
                var p = o ? /\s/ : /\n/;
                var q = e.isMobile;
                var r = function(a, b) {
                    var c = f.createElement("textarea");
                    c.className = "ace_text-input";
                    c.setAttribute("wrap", "off");
                    c.setAttribute("autocorrect", "off");
                    c.setAttribute("autocapitalize", "off");
                    c.setAttribute("spellcheck", false);
                    c.style.opacity = "0";
                    a.insertBefore(c, a.firstChild);
                    var r = false;
                    var s = false;
                    var t = false;
                    var u = false;
                    var v = "";
                    if (!q) c.style.fontSize = "1px";
                    var w = false;
                    var x = false;
                    var y = "";
                    var z = 0;
                    var A = 0;
                    var B = 0;
                    try {
                        var C = document.activeElement === c;
                    } catch (D) {}
                    d.addListener(c, "blur", function(a) {
                        if (x) return;
                        b.onBlur(a);
                        C = false;
                    }, b);
                    d.addListener(c, "focus", function(a) {
                        if (x) return;
                        C = true;
                        if (e.isEdge) {
                            try {
                                if (!document.hasFocus()) return;
                            } catch (c) {}
                        }
                        b.onFocus(a);
                        if (e.isEdge) setTimeout(E);
                        else E();
                    }, b);
                    this.$focusScroll = false;
                    this.focus = function() {
                        if (v || k || this.$focusScroll == "browser") return c.focus({
                            preventScroll: true
                        });
                        var a = c.style.top;
                        c.style.position = "fixed";
                        c.style.top = "0px";
                        try {
                            var b = c.getBoundingClientRect().top != 0;
                        } catch (d) {
                            return;
                        }
                        var e = [];
                        if (b) {
                            var f = c.parentElement;
                            while(f && f.nodeType == 1){
                                e.push(f);
                                f.setAttribute("ace_nocontext", true);
                                if (!f.parentElement && f.getRootNode) f = f.getRootNode().host;
                                else f = f.parentElement;
                            }
                        }
                        c.focus({
                            preventScroll: true
                        });
                        if (b) {
                            e.forEach(function(a) {
                                a.removeAttribute("ace_nocontext");
                            });
                        }
                        setTimeout(function() {
                            c.style.position = "";
                            if (c.style.top == "0px") c.style.top = a;
                        }, 0);
                    };
                    this.blur = function() {
                        c.blur();
                    };
                    this.isFocused = function() {
                        return C;
                    };
                    b.on("beforeEndOperation", function() {
                        var a = b.curOp;
                        var d = a && a.command && a.command.name;
                        if (d == "insertstring") return;
                        var e = d && (a.docChanged || a.selectionChanged);
                        if (t && e) {
                            y = c.value = "";
                            S();
                        }
                        E();
                    });
                    var E = o ? function(a) {
                        if (!C || (r && !a) || u) return;
                        if (!a) a = "";
                        var d = "\n ab" + a + "cde fg\n";
                        if (d != c.value) c.value = y = d;
                        var e = 4;
                        var f = 4 + (a.length || (b.selection.isEmpty() ? 0 : 1));
                        if (z != e || A != f) {
                            c.setSelectionRange(e, f);
                        }
                        z = e;
                        A = f;
                    } : function() {
                        if (t || u) return;
                        if (!C && !I) return;
                        t = true;
                        var a = 0;
                        var d = 0;
                        var e = "";
                        if (b.session) {
                            var f = b.selection;
                            var g = f.getRange();
                            var h = f.cursor.row;
                            a = g.start.column;
                            d = g.end.column;
                            e = b.session.getLine(h);
                            if (g.start.row != h) {
                                var i = b.session.getLine(h - 1);
                                a = g.start.row < h - 1 ? 0 : a;
                                d += i.length + 1;
                                e = i + "\n" + e;
                            } else if (g.end.row != h) {
                                var j = b.session.getLine(h + 1);
                                d = g.end.row > h + 1 ? j.length : d;
                                d += e.length + 1;
                                e = e + "\n" + j;
                            } else if (q && h > 0) {
                                e = "\n" + e;
                                d += 1;
                                a += 1;
                            }
                            if (e.length > l) {
                                if (a < l && d < l) {
                                    e = e.slice(0, l);
                                } else {
                                    e = "\n";
                                    if (a == d) {
                                        a = d = 0;
                                    } else {
                                        a = 0;
                                        d = 1;
                                    }
                                }
                            }
                        }
                        var k = e + "\n\n";
                        if (k != y) {
                            c.value = y = k;
                            z = A = k.length;
                        }
                        if (I) {
                            z = c.selectionStart;
                            A = c.selectionEnd;
                        }
                        if (A != d || z != a || c.selectionEnd != A) {
                            try {
                                c.setSelectionRange(a, d);
                                z = a;
                                A = d;
                            } catch (m) {}
                        }
                        t = false;
                    };
                    this.resetSelection = E;
                    if (C) b.onFocus();
                    var F = function(a) {
                        return (a.selectionStart === 0 && a.selectionEnd >= y.length && a.value === y && y && a.selectionEnd !== A);
                    };
                    var G = function(a) {
                        if (t) return;
                        if (r) {
                            r = false;
                        } else if (F(c)) {
                            b.selectAll();
                            E();
                        } else if (q && c.selectionStart != z) {
                            E();
                        }
                    };
                    var H = null;
                    this.setInputHandler = function(a) {
                        H = a;
                    };
                    this.getInputHandler = function() {
                        return H;
                    };
                    var I = false;
                    var J = function(a, d) {
                        if (I) I = false;
                        if (s) {
                            E();
                            if (a) b.onPaste(a);
                            s = false;
                            return "";
                        } else {
                            var f = c.selectionStart;
                            var g = c.selectionEnd;
                            var h = z;
                            var i = y.length - A;
                            var j = a;
                            var k = a.length - f;
                            var l = a.length - g;
                            var m = 0;
                            while(h > 0 && y[m] == a[m]){
                                m++;
                                h--;
                            }
                            j = j.slice(m);
                            m = 1;
                            while(i > 0 && y.length - m > z - 1 && y[y.length - m] == a[a.length - m]){
                                m++;
                                i--;
                            }
                            k -= m - 1;
                            l -= m - 1;
                            var n = j.length - m + 1;
                            if (n < 0) {
                                h = -n;
                                n = 0;
                            }
                            j = j.slice(0, n);
                            if (!d && !j && !k && !h && !i && !l) return "";
                            u = true;
                            var o = false;
                            if (e.isAndroid && j == ". ") {
                                j = "  ";
                                o = true;
                            }
                            if ((j && !h && !i && !k && !l) || w) {
                                b.onTextInput(j);
                            } else {
                                b.onTextInput(j, {
                                    extendLeft: h,
                                    extendRight: i,
                                    restoreStart: k,
                                    restoreEnd: l
                                });
                            }
                            u = false;
                            y = a;
                            z = f;
                            A = g;
                            B = l;
                            return o ? "\n" : j;
                        }
                    };
                    var K = function(a) {
                        if (t) return R();
                        if (a && a.inputType) {
                            if (a.inputType == "historyUndo") return b.execCommand("undo");
                            if (a.inputType == "historyRedo") return b.execCommand("redo");
                        }
                        var d = c.value;
                        var e = J(d, true);
                        if (d.length > l + 100 || p.test(e) || (q && z < 1 && z == A)) {
                            E();
                        }
                    };
                    var L = function(a, b, c) {
                        var d = a.clipboardData || window.clipboardData;
                        if (!d || i) return;
                        var e = j || c ? "Text" : "text/plain";
                        try {
                            if (b) {
                                return (d.setData(e, b) !== false);
                            } else {
                                return d.getData(e);
                            }
                        } catch (f) {
                            if (!c) return L(f, b, true);
                        }
                    };
                    var M = function(a, e) {
                        var f = b.getCopyText();
                        if (!f) return d.preventDefault(a);
                        if (L(a, f)) {
                            if (o) {
                                E(f);
                                r = f;
                                setTimeout(function() {
                                    r = false;
                                }, 10);
                            }
                            e ? b.onCut() : b.onCopy();
                            d.preventDefault(a);
                        } else {
                            r = true;
                            c.value = f;
                            c.select();
                            setTimeout(function() {
                                r = false;
                                E();
                                e ? b.onCut() : b.onCopy();
                            });
                        }
                    };
                    var N = function(a) {
                        M(a, true);
                    };
                    var O = function(a) {
                        M(a, false);
                    };
                    var P = function(a) {
                        var f = L(a);
                        if (h.pasteCancelled()) return;
                        if (typeof f == "string") {
                            if (f) b.onPaste(f, a);
                            if (e.isIE) setTimeout(E);
                            d.preventDefault(a);
                        } else {
                            c.value = "";
                            s = true;
                        }
                    };
                    d.addCommandKeyListener(c, b.onCommandKey.bind(b), b);
                    d.addListener(c, "select", G, b);
                    d.addListener(c, "input", K, b);
                    d.addListener(c, "cut", N, b);
                    d.addListener(c, "copy", O, b);
                    d.addListener(c, "paste", P, b);
                    if (!("oncut" in c) || !("oncopy" in c) || !("onpaste" in c)) {
                        d.addListener(a, "keydown", function(a) {
                            if ((e.isMac && !a.metaKey) || !a.ctrlKey) return;
                            switch(a.keyCode){
                                case 67:
                                    O(a);
                                    break;
                                case 86:
                                    P(a);
                                    break;
                                case 88:
                                    N(a);
                                    break;
                            }
                        }, b);
                    }
                    var Q = function(a) {
                        if (t || !b.onCompositionStart || b.$readOnly) return;
                        t = {};
                        if (w) return;
                        if (a.data) t.useTextareaForIME = false;
                        setTimeout(R, 0);
                        b._signal("compositionStart");
                        b.on("mousedown", T);
                        var d = b.getSelectionRange();
                        d.end.row = d.start.row;
                        d.end.column = d.start.column;
                        t.markerRange = d;
                        t.selectionStart = z;
                        b.onCompositionStart(t);
                        if (t.useTextareaForIME) {
                            y = c.value = "";
                            z = 0;
                            A = 0;
                        } else {
                            if (c.msGetInputContext) t.context = c.msGetInputContext();
                            if (c.getInputContext) t.context = c.getInputContext();
                        }
                    };
                    var R = function() {
                        if (!t || !b.onCompositionUpdate || b.$readOnly) return;
                        if (w) return T();
                        if (t.useTextareaForIME) {
                            b.onCompositionUpdate(c.value);
                        } else {
                            var a = c.value;
                            J(a);
                            if (t.markerRange) {
                                if (t.context) {
                                    t.markerRange.start.column = t.selectionStart = t.context.compositionStartOffset;
                                }
                                t.markerRange.end.column = t.markerRange.start.column + A - t.selectionStart + B;
                            }
                        }
                    };
                    var S = function(a) {
                        if (!b.onCompositionEnd || b.$readOnly) return;
                        t = false;
                        b.onCompositionEnd();
                        b.off("mousedown", T);
                        if (a) K();
                    };
                    function T() {
                        x = true;
                        c.blur();
                        c.focus();
                        x = false;
                    }
                    var U = g.delayedCall(R, 50).schedule.bind(null, null);
                    function V(a) {
                        if (a.keyCode == 27 && c.value.length < c.selectionStart) {
                            if (!t) y = c.value;
                            z = A = -1;
                            E();
                        }
                        U();
                    }
                    d.addListener(c, "compositionstart", Q, b);
                    d.addListener(c, "compositionupdate", R, b);
                    d.addListener(c, "keyup", V, b);
                    d.addListener(c, "keydown", U, b);
                    d.addListener(c, "compositionend", S, b);
                    this.getElement = function() {
                        return c;
                    };
                    this.setCommandMode = function(a) {
                        w = a;
                        c.readOnly = false;
                    };
                    this.setReadOnly = function(a) {
                        if (!w) c.readOnly = a;
                    };
                    this.setCopyWithEmptySelection = function(a) {};
                    this.onContextMenu = function(a) {
                        I = true;
                        E();
                        b._emit("nativecontextmenu", {
                            target: b,
                            domEvent: a
                        });
                        this.moveToMouse(a, true);
                    };
                    this.moveToMouse = function(a, g) {
                        if (!v) v = c.style.cssText;
                        c.style.cssText = (g ? "z-index:100000;" : "") + (e.isIE ? "opacity:0.1;" : "") + "text-indent: -" + (z + A) * b.renderer.characterWidth * 0.5 + "px;";
                        var h = b.container.getBoundingClientRect();
                        var i = f.computedStyle(b.container);
                        var j = h.top + (parseInt(i.borderTopWidth) || 0);
                        var k = h.left + (parseInt(h.borderLeftWidth) || 0);
                        var l = h.bottom - j - c.clientHeight - 2;
                        var m = function(a) {
                            f.translate(c, a.clientX - k - 2, Math.min(a.clientY - j - 2, l));
                        };
                        m(a);
                        if (a.type != "mousedown") return;
                        b.renderer.$isMousePressed = true;
                        clearTimeout(W);
                        if (e.isWin) d.capture(b.container, m, X);
                    };
                    this.onContextMenuClose = X;
                    var W;
                    function X() {
                        clearTimeout(W);
                        W = setTimeout(function() {
                            if (v) {
                                c.style.cssText = v;
                                v = "";
                            }
                            b.renderer.$isMousePressed = false;
                            if (b.renderer.$keepTextAreaAtCursor) b.renderer.$moveTextAreaToCursor();
                        }, 0);
                    }
                    var Y = function(a) {
                        b.textInput.onContextMenu(a);
                        X();
                    };
                    d.addListener(c, "mouseup", Y, b);
                    d.addListener(c, "mousedown", function(a) {
                        a.preventDefault();
                        X();
                    }, b);
                    d.addListener(b.renderer.scroller, "contextmenu", Y, b);
                    d.addListener(c, "contextmenu", Y, b);
                    if (o) Z(a, b, c);
                    function Z(a, b, c) {
                        var d = null;
                        var e = false;
                        c.addEventListener("keydown", function(a) {
                            if (d) clearTimeout(d);
                            e = true;
                        }, true);
                        c.addEventListener("keyup", function(a) {
                            d = setTimeout(function() {
                                e = false;
                            }, 100);
                        }, true);
                        var f = function(a) {
                            if (document.activeElement !== c) return;
                            if (e || t || b.$mouseHandler.isMousePressed) return;
                            if (r) {
                                return;
                            }
                            var d = c.selectionStart;
                            var f = c.selectionEnd;
                            var g = null;
                            var h = 0;
                            if (d == 0) {
                                g = m.up;
                            } else if (d == 1) {
                                g = m.home;
                            } else if (f > A && y[f] == "\n") {
                                g = m.end;
                            } else if (d < z && y[d - 1] == " ") {
                                g = m.left;
                                h = n.option;
                            } else if (d < z || (d == z && A != z && d == f)) {
                                g = m.left;
                            } else if (f > A && y.slice(0, f).split("\n").length > 2) {
                                g = m.down;
                            } else if (f > A && y[f - 1] == " ") {
                                g = m.right;
                                h = n.option;
                            } else if (f > A || (f == A && A != z && d == f)) {
                                g = m.right;
                            }
                            if (d !== f) h |= n.shift;
                            if (g) {
                                var i = b.onCommandKey({}, h, g);
                                if (!i && b.commands) {
                                    g = m.keyCodeToString(g);
                                    var j = b.commands.findKeyCommand(h, g);
                                    if (j) b.execCommand(j);
                                }
                                z = d;
                                A = f;
                                E("");
                            }
                        };
                        document.addEventListener("selectionchange", f);
                        b.on("destroy", function() {
                            document.removeEventListener("selectionchange", f);
                        });
                    }
                };
                b.TextInput = r;
                b.$setUserAgentForTests = function(a, b) {
                    q = a;
                    o = b;
                };
            });
            ace.define("ace/mouse/default_handlers", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/useragent");
                var e = 0;
                var f = 550;
                function g(a) {
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
                        var b = a.inSelection();
                        var c = a.getDocumentPosition();
                        this.mousedownEvent = a;
                        var e = this.editor;
                        var f = a.getButton();
                        if (f !== 0) {
                            var g = e.getSelectionRange();
                            var h = g.isEmpty();
                            if (h || f == 1) e.selection.moveToPosition(c);
                            if (f == 2) {
                                e.textInput.onContextMenu(a.domEvent);
                                if (!d.isMozilla) a.preventDefault();
                            }
                            return;
                        }
                        this.mousedownEvent.time = Date.now();
                        if (b && !e.isFocused()) {
                            e.focus();
                            if (this.$focusTimeout && !this.$clickSelection && !e.inMultiSelectMode) {
                                this.setState("focusWait");
                                this.captureMouse(a);
                                return;
                            }
                        }
                        this.captureMouse(a);
                        this.startSelect(c, a.domEvent._clicks > 1);
                        return a.preventDefault();
                    };
                    this.startSelect = function(a, b) {
                        a = a || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
                        var c = this.editor;
                        if (!this.mousedownEvent) return;
                        if (this.mousedownEvent.getShiftKey()) c.selection.selectToPosition(a);
                        else if (!b) c.selection.moveToPosition(a);
                        if (!b) this.select();
                        if (c.renderer.scroller.setCapture) {
                            c.renderer.scroller.setCapture();
                        }
                        c.setStyle("ace_selecting");
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
                    this.extendSelectionBy = function(a) {
                        var b, c = this.editor;
                        var d = c.renderer.screenToTextCoordinates(this.x, this.y);
                        var e = c.selection[a](d.row, d.column);
                        if (this.$clickSelection) {
                            var f = this.$clickSelection.comparePoint(e.start);
                            var g = this.$clickSelection.comparePoint(e.end);
                            if (f == -1 && g <= 0) {
                                b = this.$clickSelection.end;
                                if (e.end.row != d.row || e.end.column != d.column) d = e.start;
                            } else if (g == 1 && f >= 0) {
                                b = this.$clickSelection.start;
                                if (e.start.row != d.row || e.start.column != d.column) d = e.end;
                            } else if (f == -1 && g == 1) {
                                d = e.end;
                                b = e.start;
                            } else {
                                var h = i(this.$clickSelection, d);
                                d = h.cursor;
                                b = h.anchor;
                            }
                            c.selection.setSelectionAnchor(b.row, b.column);
                        }
                        c.selection.selectToPosition(d);
                        c.renderer.scrollCursorIntoView();
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
                        if (a > e || b - this.mousedownEvent.time > this.$focusTimeout) this.startSelect(this.mousedownEvent.getDocumentPosition());
                    };
                    this.onDoubleClick = function(a) {
                        var b = a.getDocumentPosition();
                        var c = this.editor;
                        var d = c.session;
                        var e = d.getBracketRange(b);
                        if (e) {
                            if (e.isEmpty()) {
                                e.start.column--;
                                e.end.column++;
                            }
                            this.setState("select");
                        } else {
                            e = c.selection.getWordRange(b.row, b.column);
                            this.setState("selectByWords");
                        }
                        this.$clickSelection = e;
                        this.select();
                    };
                    this.onTripleClick = function(a) {
                        var b = a.getDocumentPosition();
                        var c = this.editor;
                        this.setState("selectByLines");
                        var d = c.getSelectionRange();
                        if (d.isMultiLine() && d.contains(b.row, b.column)) {
                            this.$clickSelection = c.selection.getLineRange(d.start.row);
                            this.$clickSelection.end = c.selection.getLineRange(d.end.row).end;
                        } else {
                            this.$clickSelection = c.selection.getLineRange(b.row);
                        }
                        this.select();
                    };
                    this.onQuadClick = function(a) {
                        var b = this.editor;
                        b.selectAll();
                        this.$clickSelection = b.getSelectionRange();
                        this.setState("selectAll");
                    };
                    this.onMouseWheel = function(a) {
                        if (a.getAccelKey()) return;
                        if (a.getShiftKey() && a.wheelY && !a.wheelX) {
                            a.wheelX = a.wheelY;
                            a.wheelY = 0;
                        }
                        var b = this.editor;
                        if (!this.$lastScroll) this.$lastScroll = {
                            t: 0,
                            vx: 0,
                            vy: 0,
                            allowed: 0
                        };
                        var c = this.$lastScroll;
                        var d = a.domEvent.timeStamp;
                        var e = d - c.t;
                        var g = e ? a.wheelX / e : c.vx;
                        var h = e ? a.wheelY / e : c.vy;
                        if (e < f) {
                            g = (g + c.vx) / 2;
                            h = (h + c.vy) / 2;
                        }
                        var i = Math.abs(g / h);
                        var j = false;
                        if (i >= 1 && b.renderer.isScrollableBy(a.wheelX * a.speed, 0)) j = true;
                        if (i <= 1 && b.renderer.isScrollableBy(0, a.wheelY * a.speed)) j = true;
                        if (j) {
                            c.allowed = d;
                        } else if (d - c.allowed < f) {
                            var k = Math.abs(g) <= 1.5 * Math.abs(c.vx) && Math.abs(h) <= 1.5 * Math.abs(c.vy);
                            if (k) {
                                j = true;
                                c.allowed = d;
                            } else {
                                c.allowed = 0;
                            }
                        }
                        c.t = d;
                        c.vx = g;
                        c.vy = h;
                        if (j) {
                            b.renderer.scrollBy(a.wheelX * a.speed, a.wheelY * a.speed);
                            return a.stop();
                        }
                    };
                }.call(g.prototype));
                b.DefaultHandlers = g;
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
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./lib/dom");
                function f(a) {
                    this.isOpen = false;
                    this.$element = null;
                    this.$parentNode = a;
                }
                (function() {
                    this.$init = function() {
                        this.$element = e.createElement("div");
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
                        e.addCssClass(this.getElement(), a);
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
                }.call(f.prototype));
                b.Tooltip = f;
            });
            ace.define("ace/mouse/default_gutter_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/oop",
                "ace/lib/event",
                "ace/tooltip", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/dom");
                var e = a("../lib/oop");
                var f = a("../lib/event");
                var g = a("../tooltip").Tooltip;
                function h(a) {
                    var b = a.editor;
                    var c = b.renderer.$gutterLayer;
                    var e = new i(b.container);
                    a.editor.setDefaultHandler("guttermousedown", function(d) {
                        if (!b.isFocused() || d.getButton() != 0) return;
                        var e = c.getRegion(d);
                        if (e == "foldWidgets") return;
                        var f = d.getDocumentPosition().row;
                        var g = b.session.selection;
                        if (d.getShiftKey()) g.selectTo(f, 0);
                        else {
                            if (d.domEvent.detail == 2) {
                                b.selectAll();
                                return d.preventDefault();
                            }
                            a.$clickSelection = b.selection.getLineRange(f);
                        }
                        a.setState("selectByLines");
                        a.captureMouse(d);
                        return d.preventDefault();
                    });
                    var g, h, j;
                    function k() {
                        var d = h.getDocumentPosition().row;
                        var f = c.$annotations[d];
                        if (!f) return l();
                        var g = b.session.getLength();
                        if (d == g) {
                            var i = b.renderer.pixelToScreenCoordinates(0, h.y).row;
                            var k = h.$pos;
                            if (i > b.session.documentToScreenRow(k.row, k.column)) return l();
                        }
                        if (j == f) return;
                        j = f.text.join("<br/>");
                        e.setHtml(j);
                        e.show();
                        b._signal("showGutterTooltip", e);
                        b.on("mousewheel", l);
                        if (a.$tooltipFollowsMouse) {
                            m(h);
                        } else {
                            var n = h.domEvent.target;
                            var o = n.getBoundingClientRect();
                            var p = e.getElement().style;
                            p.left = o.right + "px";
                            p.top = o.bottom + "px";
                        }
                    }
                    function l() {
                        if (g) g = clearTimeout(g);
                        if (j) {
                            e.hide();
                            j = null;
                            b._signal("hideGutterTooltip", e);
                            b.off("mousewheel", l);
                        }
                    }
                    function m(a) {
                        e.setPosition(a.x, a.y);
                    }
                    a.editor.setDefaultHandler("guttermousemove", function(b) {
                        var c = b.domEvent.target || b.domEvent.srcElement;
                        if (d.hasCssClass(c, "ace_fold-widget")) return l();
                        if (j && a.$tooltipFollowsMouse) m(b);
                        h = b;
                        if (g) return;
                        g = setTimeout(function() {
                            g = null;
                            if (h && !a.isMousePressed) k();
                            else l();
                        }, 50);
                    });
                    f.addListener(b.renderer.$gutter, "mouseout", function(a) {
                        h = null;
                        if (!j || g) return;
                        g = setTimeout(function() {
                            g = null;
                            l();
                        }, 50);
                    }, b);
                    b.on("changeSession", l);
                }
                function i(a) {
                    g.call(this, a);
                }
                e.inherits(i, g);
                (function() {
                    this.setPosition = function(a, b) {
                        var c = window.innerWidth || document.documentElement.clientWidth;
                        var d = window.innerHeight || document.documentElement.clientHeight;
                        var e = this.getWidth();
                        var f = this.getHeight();
                        a += 15;
                        b += 15;
                        if (a + e > c) {
                            a -= a + e - c;
                        }
                        if (b + f > d) {
                            b -= 20 + f;
                        }
                        g.prototype.setPosition.call(this, a, b);
                    };
                }.call(i.prototype));
                b.GutterHandler = h;
            });
            ace.define("ace/mouse/mouse_event", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/event");
                var e = a("../lib/useragent");
                var f = (b.MouseEvent = function(a, b) {
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
                        d.stopPropagation(this.domEvent);
                        this.propagationStopped = true;
                    };
                    this.preventDefault = function() {
                        d.preventDefault(this.domEvent);
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
                        var a = this.editor;
                        var b = a.getSelectionRange();
                        if (b.isEmpty()) this.$inSelection = false;
                        else {
                            var c = this.getDocumentPosition();
                            this.$inSelection = b.contains(c.row, c.column);
                        }
                        return this.$inSelection;
                    };
                    this.getButton = function() {
                        return d.getButton(this.domEvent);
                    };
                    this.getShiftKey = function() {
                        return this.domEvent.shiftKey;
                    };
                    this.getAccelKey = e.isMac ? function() {
                        return this.domEvent.metaKey;
                    } : function() {
                        return this.domEvent.ctrlKey;
                    };
                }.call(f.prototype));
            });
            ace.define("ace/mouse/dragdrop_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/dom");
                var e = a("../lib/event");
                var f = a("../lib/useragent");
                var g = 200;
                var h = 200;
                var i = 5;
                function j(a) {
                    var b = a.editor;
                    var c = d.createElement("div");
                    c.style.cssText = "top:-100px;position:absolute;z-index:2147483647;opacity:0.5";
                    c.textContent = "\xa0";
                    var j = [
                        "dragWait",
                        "dragWaitEnd",
                        "startDrag",
                        "dragReadyEnd",
                        "onMouseDrag", 
                    ];
                    j.forEach(function(b) {
                        a[b] = this[b];
                    }, this);
                    b.on("mousedown", this.onMouseDown.bind(a));
                    var l = b.container;
                    var m, n, o;
                    var p, q;
                    var r, s = 0;
                    var t;
                    var u;
                    var v;
                    var w;
                    var x;
                    this.onDragStart = function(a) {
                        if (this.cancelDrag || !l.draggable) {
                            var d = this;
                            setTimeout(function() {
                                d.startSelect();
                                d.captureMouse(a);
                            }, 0);
                            return a.preventDefault();
                        }
                        q = b.getSelectionRange();
                        var e = a.dataTransfer;
                        e.effectAllowed = b.getReadOnly() ? "copy" : "copyMove";
                        b.container.appendChild(c);
                        e.setDragImage && e.setDragImage(c, 0, 0);
                        setTimeout(function() {
                            b.container.removeChild(c);
                        });
                        e.clearData();
                        e.setData("Text", b.session.getTextRange());
                        u = true;
                        this.setState("drag");
                    };
                    this.onDragEnd = function(a) {
                        l.draggable = false;
                        u = false;
                        this.setState(null);
                        if (!b.getReadOnly()) {
                            var c = a.dataTransfer.dropEffect;
                            if (!t && c == "move") b.session.remove(b.getSelectionRange());
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
                        return e.preventDefault(a);
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
                        return e.preventDefault(a);
                    };
                    this.onDragLeave = function(a) {
                        s--;
                        if (s <= 0 && m) {
                            C();
                            t = null;
                            return e.preventDefault(a);
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
                        return e.preventDefault(a);
                    };
                    e.addListener(l, "dragstart", this.onDragStart.bind(a), b);
                    e.addListener(l, "dragend", this.onDragEnd.bind(a), b);
                    e.addListener(l, "dragenter", this.onDragEnter.bind(a), b);
                    e.addListener(l, "dragover", this.onDragOver.bind(a), b);
                    e.addListener(l, "dragleave", this.onDragLeave.bind(a), b);
                    e.addListener(l, "drop", this.onDrop.bind(a), b);
                    function y(a, c) {
                        var d = Date.now();
                        var e = !c || a.row != c.row;
                        var f = !c || a.column != c.column;
                        if (!w || e || f) {
                            b.moveCursorToPosition(a);
                            w = d;
                            x = {
                                x: n,
                                y: o
                            };
                        } else {
                            var g = k(x.x, x.y, n, o);
                            if (g > i) {
                                w = null;
                            } else if (d - w >= h) {
                                b.renderer.scrollCursorIntoView();
                                w = null;
                            }
                        }
                    }
                    function z(a, c) {
                        var d = Date.now();
                        var e = b.renderer.layerConfig.lineHeight;
                        var f = b.renderer.layerConfig.characterWidth;
                        var h = b.renderer.scroller.getBoundingClientRect();
                        var i = {
                            x: {
                                left: n - h.left,
                                right: h.right - n
                            },
                            y: {
                                top: o - h.top,
                                bottom: h.bottom - o
                            }
                        };
                        var j = Math.min(i.x.left, i.x.right);
                        var k = Math.min(i.y.top, i.y.bottom);
                        var l = {
                            row: a.row,
                            column: a.column
                        };
                        if (j / f <= 2) {
                            l.column += i.x.left < i.x.right ? -3 : +2;
                        }
                        if (k / e <= 1) {
                            l.row += i.y.top < i.y.bottom ? -1 : +1;
                        }
                        var m = a.row != l.row;
                        var p = a.column != l.column;
                        var q = !c || a.row != c.row;
                        if (m || (p && !q)) {
                            if (!v) v = d;
                            else if (d - v >= g) b.renderer.scrollCursorIntoView(l);
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
                        e.addListener(document, "mousemove", E);
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
                        e.removeListener(document, "mousemove", E);
                    }
                    var D = null;
                    function E() {
                        if (D == null) {
                            D = setTimeout(function() {
                                if (D != null && m) C();
                            }, 20);
                        }
                    }
                    function F(a) {
                        var b = a.types;
                        return (!b || Array.prototype.some.call(b, function(a) {
                            return (a == "text/plain" || a == "Text");
                        }));
                    }
                    function G(a) {
                        var b = [
                            "copy",
                            "copymove",
                            "all",
                            "uninitialized", 
                        ];
                        var c = [
                            "move",
                            "copymove",
                            "linkmove",
                            "all",
                            "uninitialized", 
                        ];
                        var d = f.isMac ? a.altKey : a.ctrlKey;
                        var e = "uninitialized";
                        try {
                            e = a.dataTransfer.effectAllowed.toLowerCase();
                        } catch (g) {}
                        var h = "none";
                        if (d && b.indexOf(e) >= 0) h = "copy";
                        else if (c.indexOf(e) >= 0) h = "move";
                        else if (b.indexOf(e) >= 0) h = "copy";
                        return h;
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
                        var c = f.isWin ? "default" : "move";
                        a.renderer.setCursorStyle(c);
                        this.setState("dragReady");
                    };
                    this.onMouseDrag = function(a) {
                        var b = this.editor.container;
                        if (f.isIE && this.state == "dragReady") {
                            var c = k(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            if (c > 3) b.dragDrop();
                        }
                        if (this.state === "dragWait") {
                            var c = k(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            if (c > 0) {
                                b.draggable = false;
                                this.startSelect(this.mousedownEvent.getDocumentPosition());
                            }
                        }
                    };
                    this.onMouseDown = function(a) {
                        if (!this.$dragEnabled) return;
                        this.mousedownEvent = a;
                        var b = this.editor;
                        var c = a.inSelection();
                        var d = a.getButton();
                        var e = a.domEvent.detail || 1;
                        if (e === 1 && d === 0 && c) {
                            if (a.editor.inMultiSelectMode && (a.getAccelKey() || a.getShiftKey())) return;
                            this.mousedownEvent.time = Date.now();
                            var g = a.domEvent.target || a.domEvent.srcElement;
                            if ("unselectable" in g) g.unselectable = "on";
                            if (b.getDragDelay()) {
                                if (f.isWebKit) {
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
                }.call(j.prototype));
                function k(a, b, c, d) {
                    return Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2));
                }
                b.DragdropHandler = j;
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
                        var a = window.navigator && window.navigator.clipboard;
                        var d = false;
                        var e = function() {
                            var c = b.getCopyText();
                            var e = b.session.getUndoManager().hasUndo();
                            s.replaceChild(f.buildDom(d ? [
                                "span",
                                !c && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "selectall"
                                    },
                                    "Select All", 
                                ],
                                c && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "copy"
                                    },
                                    "Copy", 
                                ],
                                c && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "cut"
                                    },
                                    "Cut", 
                                ],
                                a && [
                                    "span",
                                    {
                                        class: "ace_mobile-button",
                                        action: "paste"
                                    },
                                    "Paste", 
                                ],
                                e && [
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
                        var g = function(c) {
                            var f = c.target.getAttribute("action");
                            if (f == "more" || !d) {
                                d = !d;
                                return e();
                            }
                            if (f == "paste") {
                                a.readText().then(function(a) {
                                    b.execCommand(f, a);
                                });
                            } else if (f) {
                                if (f == "cut" || f == "copy") {
                                    if (a) a.writeText(b.getCopyText());
                                    else document.execCommand("copy");
                                }
                                b.execCommand(f);
                            }
                            s.firstChild.style.display = "none";
                            d = false;
                            if (f != "openCommandPallete") b.focus();
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
                                ontouchend: function(a) {
                                    a.stopPropagation();
                                    a.preventDefault();
                                    g(a);
                                },
                                onclick: g
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
                        var a = b.selection.cursor;
                        var c = b.renderer.textToScreenCoordinates(a.row, a.column);
                        var d = b.renderer.textToScreenCoordinates(0, 0).pageX;
                        var e = b.renderer.scrollLeft;
                        var f = b.container.getBoundingClientRect();
                        s.style.top = c.pageY - f.top - 3 + "px";
                        if (c.pageX - f.left < f.width - 70) {
                            s.style.left = "";
                            s.style.right = "10px";
                        } else {
                            s.style.right = "";
                            s.style.left = d + e - f.left + "px";
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
                    e.addListener(a, "contextmenu", function(a) {
                        if (!r) return;
                        var c = b.textInput.getElement();
                        c.focus();
                    }, b);
                    e.addListener(a, "touchstart", function(a) {
                        var e = a.touches;
                        if (k || e.length > 1) {
                            clearTimeout(k);
                            k = null;
                            i = -1;
                            c = "zoom";
                            return;
                        }
                        r = b.$mouseHandler.isMousePressed = true;
                        var f = b.renderer.layerConfig.lineHeight;
                        var l = b.renderer.layerConfig.lineHeight;
                        var s = a.timeStamp;
                        j = s;
                        var t = e[0];
                        var u = t.clientX;
                        var v = t.clientY;
                        if (Math.abs(g - u) + Math.abs(h - v) > f) i = -1;
                        g = a.clientX = u;
                        h = a.clientY = v;
                        p = q = 0;
                        var y = new d(a, b);
                        n = y.getDocumentPosition();
                        if (s - i < 500 && e.length == 1 && !m) {
                            o++;
                            a.preventDefault();
                            a.button = 0;
                            x();
                        } else {
                            o = 0;
                            var z = b.selection.cursor;
                            var A = b.selection.isEmpty() ? z : b.selection.anchor;
                            var B = b.renderer.$cursorLayer.getPixelPosition(z, true);
                            var C = b.renderer.$cursorLayer.getPixelPosition(A, true);
                            var D = b.renderer.scroller.getBoundingClientRect();
                            var E = b.renderer.layerConfig.offset;
                            var F = b.renderer.scrollLeft;
                            var G = function(a, b) {
                                a = a / l;
                                b = b / f - 0.75;
                                return a * a + b * b;
                            };
                            if (a.clientX < D.left) {
                                c = "zoom";
                                return;
                            }
                            var H = G(a.clientX - D.left - B.left + F, a.clientY - D.top - B.top + E);
                            var I = G(a.clientX - D.left - C.left + F, a.clientY - D.top - C.top + E);
                            if (H < 3.5 && I < 3.5) c = H > I ? "cursor" : "anchor";
                            if (I < 3.5) c = "anchor";
                            else if (H < 3.5) c = "cursor";
                            else c = "scroll";
                            k = setTimeout(w, 450);
                        }
                        i = s;
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
                        var e = a.touches;
                        if (e.length > 1 || c == "zoom") return;
                        var f = e[0];
                        var i = g - f.clientX;
                        var l = h - f.clientY;
                        if (c == "wait") {
                            if (i * i + l * l > 4) c = "cursor";
                            else return a.preventDefault();
                        }
                        g = f.clientX;
                        h = f.clientY;
                        a.clientX = f.clientX;
                        a.clientY = f.clientY;
                        var m = a.timeStamp;
                        var n = m - j;
                        j = m;
                        if (c == "scroll") {
                            var o = new d(a, b);
                            o.speed = 1;
                            o.wheelX = i;
                            o.wheelY = l;
                            if (10 * Math.abs(i) < Math.abs(l)) i = 0;
                            if (10 * Math.abs(l) < Math.abs(i)) l = 0;
                            if (n != 0) {
                                p = i / n;
                                q = l / n;
                            }
                            b._emit("mousewheel", o);
                            if (!o.propagationStopped) {
                                p = q = 0;
                            }
                        } else {
                            var r = new d(a, b);
                            var s = r.getDocumentPosition();
                            if (c == "cursor") b.selection.moveCursorToPosition(s);
                            else if (c == "anchor") b.selection.setSelectionAnchor(s.row, s.column);
                            b.renderer.scrollCursorIntoView(s);
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
            ], function(a, b, c) {
                "use strict";
                var d = a("./dom");
                b.get = function(a, b) {
                    var c = new XMLHttpRequest();
                    c.open("GET", a, true);
                    c.onreadystatechange = function() {
                        if (c.readyState === 4) {
                            b(c.responseText);
                        }
                    };
                    c.send(null);
                };
                b.loadScript = function(a, b) {
                    var c = d.getDocumentHead();
                    var e = document.createElement("script");
                    e.src = a;
                    c.appendChild(e);
                    e.onload = e.onreadystatechange = function(a, c) {
                        if (c || !e.readyState || e.readyState == "loaded" || e.readyState == "complete") {
                            e = e.onload = e.onreadystatechange = null;
                            if (!c) b();
                        }
                    };
                };
                b.qualifyURL = function(a) {
                    var b = document.createElement("a");
                    b.href = a;
                    return b.href;
                };
            });
            ace.define("ace/lib/event_emitter", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                var d = {};
                var e = function() {
                    this.propagationStopped = true;
                };
                var f = function() {
                    this.defaultPrevented = true;
                };
                d._emit = d._dispatchEvent = function(a, b) {
                    this._eventRegistry || (this._eventRegistry = {});
                    this._defaultHandlers || (this._defaultHandlers = {});
                    var c = this._eventRegistry[a] || [];
                    var d = this._defaultHandlers[a];
                    if (!c.length && !d) return;
                    if (typeof b != "object" || !b) b = {};
                    if (!b.type) b.type = a;
                    if (!b.stopPropagation) b.stopPropagation = e;
                    if (!b.preventDefault) b.preventDefault = f;
                    c = c.slice();
                    for(var g = 0; g < c.length; g++){
                        c[g](b, this);
                        if (b.propagationStopped) break;
                    }
                    if (d && !b.defaultPrevented) return d(b, this);
                };
                d._signal = function(a, b) {
                    var c = (this._eventRegistry || {})[a];
                    if (!c) return;
                    c = c.slice();
                    for(var d = 0; d < c.length; d++)c[d](b, this);
                };
                d.once = function(a, b) {
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
                d.setDefaultHandler = function(a, b) {
                    var c = this._defaultHandlers;
                    if (!c) c = this._defaultHandlers = {
                        _disabled_: {}
                    };
                    if (c[a]) {
                        var d = c[a];
                        var e = c._disabled_[a];
                        if (!e) c._disabled_[a] = e = [];
                        e.push(d);
                        var f = e.indexOf(b);
                        if (f != -1) e.splice(f, 1);
                    }
                    c[a] = b;
                };
                d.removeDefaultHandler = function(a, b) {
                    var c = this._defaultHandlers;
                    if (!c) return;
                    var d = c._disabled_[a];
                    if (c[a] == b) {
                        if (d) this.setDefaultHandler(a, d.pop());
                    } else if (d) {
                        var e = d.indexOf(b);
                        if (e != -1) d.splice(e, 1);
                    }
                };
                d.on = d.addEventListener = function(a, b, c) {
                    this._eventRegistry = this._eventRegistry || {};
                    var d = this._eventRegistry[a];
                    if (!d) d = this._eventRegistry[a] = [];
                    if (d.indexOf(b) == -1) d[c ? "unshift" : "push"](b);
                    return b;
                };
                d.off = d.removeListener = d.removeEventListener = function(a, b) {
                    this._eventRegistry = this._eventRegistry || {};
                    var c = this._eventRegistry[a];
                    if (!c) return;
                    var d = c.indexOf(b);
                    if (d !== -1) c.splice(d, 1);
                };
                d.removeAllListeners = function(a) {
                    if (!a) this._eventRegistry = this._defaultHandlers = undefined;
                    if (this._eventRegistry) this._eventRegistry[a] = undefined;
                    if (this._defaultHandlers) this._defaultHandlers[a] = undefined;
                };
                b.EventEmitter = d;
            });
            ace.define("ace/lib/app_config", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter", 
            ], function(a, b, c) {
                "no use strict";
                var d = a("./oop");
                var e = a("./event_emitter").EventEmitter;
                var f = {
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
                    setOption: function(a, b) {
                        if (this["$" + a] === b) return;
                        var c = this.$options[a];
                        if (!c) {
                            return g('misspelled option "' + a + '"');
                        }
                        if (c.forwardTo) return (this[c.forwardTo] && this[c.forwardTo].setOption(a, b));
                        if (!c.handlesSet) this["$" + a] = b;
                        if (c && c.set) c.set.call(this, b);
                    },
                    getOption: function(a) {
                        var b = this.$options[a];
                        if (!b) {
                            return g('misspelled option "' + a + '"');
                        }
                        if (b.forwardTo) return (this[b.forwardTo] && this[b.forwardTo].getOption(a));
                        return b && b.get ? b.get.call(this) : this["$" + a];
                    }
                };
                function g(a) {
                    if (typeof console != "undefined" && console.warn) console.warn.apply(console, arguments);
                }
                function h(a, b) {
                    var c = new Error(a);
                    c.data = b;
                    if (typeof console == "object" && console.error) console.error(c);
                    setTimeout(function() {
                        throw c;
                    });
                }
                var i = function() {
                    this.$defaultOptions = {};
                };
                (function() {
                    d.implement(this, e);
                    this.defineOptions = function(a, b, c) {
                        if (!a.$options) this.$defaultOptions[b] = a.$options = {};
                        Object.keys(c).forEach(function(b) {
                            var d = c[b];
                            if (typeof d == "string") d = {
                                forwardTo: d
                            };
                            d.name || (d.name = b);
                            a.$options[d.name] = d;
                            if ("initialValue" in d) a["$" + d.name] = d.initialValue;
                        });
                        d.implement(a, f);
                        return this;
                    };
                    this.resetOptions = function(a) {
                        Object.keys(a.$options).forEach(function(b) {
                            var c = a.$options[b];
                            if ("value" in c) a.setOption(b, c.value);
                        });
                    };
                    this.setDefaultValue = function(a, b, c) {
                        if (!a) {
                            for(a in this.$defaultOptions)if (this.$defaultOptions[a][b]) break;
                            if (!this.$defaultOptions[a][b]) return false;
                        }
                        var d = this.$defaultOptions[a] || (this.$defaultOptions[a] = {});
                        if (d[b]) {
                            if (d.forwardTo) this.setDefaultValue(d.forwardTo, b, c);
                            else d[b].value = c;
                        }
                    };
                    this.setDefaultValues = function(a, b) {
                        Object.keys(b).forEach(function(c) {
                            this.setDefaultValue(a, c, b[c]);
                        }, this);
                    };
                    this.warn = g;
                    this.reportError = h;
                }.call(i.prototype));
                b.AppConfig = i;
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
            ], function(a, b, d) {
                "no use strict";
                var e = a("./lib/lang");
                var f = a("./lib/oop");
                var g = a("./lib/net");
                var h = a("./lib/dom");
                var i = a("./lib/app_config").AppConfig;
                d.exports = b = new i();
                var j = (function() {
                    return this || (typeof window != "undefined" && window);
                })();
                var k = {
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
                b.get = function(a) {
                    if (!k.hasOwnProperty(a)) throw new Error("Unknown config key: " + a);
                    return k[a];
                };
                b.set = function(a, b) {
                    if (k.hasOwnProperty(a)) k[a] = b;
                    else if (this.setDefaultValue("", a, b) == false) throw new Error("Unknown config key: " + a);
                    if (a == "useStrictCSP") h.useStrictCSP(b);
                };
                b.all = function() {
                    return e.copyObject(k);
                };
                b.$modes = {};
                b.moduleUrl = function(a, b) {
                    if (k.$moduleUrls[a]) return k.$moduleUrls[a];
                    var c = a.split("/");
                    b = b || c[c.length - 2] || "";
                    var d = b == "snippets" ? "/" : "-";
                    var e = c[c.length - 1];
                    if (b == "worker" && d == "-") {
                        var f = new RegExp("^" + b + "[\\-_]|[\\-_]" + b + "$", "g");
                        e = e.replace(f, "");
                    }
                    if ((!e || e == b) && c.length > 1) e = c[c.length - 2];
                    var g = k[b + "Path"];
                    if (g == null) {
                        g = k.basePath;
                    } else if (d == "/") {
                        b = d = "";
                    }
                    if (g && g.slice(-1) != "/") g += "/";
                    return (g + b + d + e + this.get("suffix"));
                };
                b.setModuleUrl = function(a, b) {
                    return (k.$moduleUrls[a] = b);
                };
                b.$loading = {};
                b.loadModule = function(c, d) {
                    var e, f;
                    if (Array.isArray(c)) {
                        f = c[0];
                        c = c[1];
                    }
                    try {
                        e = a(c);
                    } catch (h) {}
                    if (e && !b.$loading[c]) return d && d(e);
                    if (!b.$loading[c]) b.$loading[c] = [];
                    b.$loading[c].push(d);
                    if (b.$loading[c].length > 1) return;
                    var i = function() {
                        a([
                            c
                        ], function(a) {
                            b._emit("load.module", {
                                name: c,
                                module: a
                            });
                            var d = b.$loading[c];
                            b.$loading[c] = null;
                            d.forEach(function(b) {
                                b && b(a);
                            });
                        });
                    };
                    if (!b.get("packaged")) return i();
                    g.loadScript(b.moduleUrl(c, f), i);
                    l();
                };
                var l = function() {
                    if (!k.basePath && !k.workerPath && !k.modePath && !k.themePath && !Object.keys(k.$moduleUrls).length) {
                        console.error("Unable to infer path to ace from script src,", "use ace.config.set('basePath', 'path') to enable dynamic loading of modes and themes", "or with webpack use ace/webpack-resolver");
                        l = function() {};
                    }
                };
                m(true);
                function m(e) {
                    if (!j || !j.document) return;
                    k.packaged = e || a.packaged || d.packaged || (j.define && c.amdD.packaged);
                    var f = {};
                    var g = "";
                    var h = document.currentScript || document._currentScript;
                    var i = (h && h.ownerDocument) || document;
                    var l = i.getElementsByTagName("script");
                    for(var m = 0; m < l.length; m++){
                        var o = l[m];
                        var p = o.src || o.getAttribute("src");
                        if (!p) continue;
                        var q = o.attributes;
                        for(var r = 0, s = q.length; r < s; r++){
                            var t = q[r];
                            if (t.name.indexOf("data-ace-") === 0) {
                                f[n(t.name.replace(/^data-ace-/, ""))] = t.value;
                            }
                        }
                        var u = p.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
                        if (u) g = u[1];
                    }
                    if (g) {
                        f.base = f.base || g;
                        f.packaged = true;
                    }
                    f.basePath = f.base;
                    f.workerPath = f.workerPath || f.base;
                    f.modePath = f.modePath || f.base;
                    f.themePath = f.themePath || f.base;
                    delete f.base;
                    for(var v in f)if (typeof f[v] !== "undefined") b.set(v, f[v]);
                }
                b.init = m;
                function n(a) {
                    return a.replace(/-(.)/g, function(a, b) {
                        return b.toUpperCase();
                    });
                }
                b.version = "1.4.13";
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
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/event");
                var e = a("../lib/useragent");
                var f = a("./default_handlers").DefaultHandlers;
                var g = a("./default_gutter_handler").GutterHandler;
                var h = a("./mouse_event").MouseEvent;
                var i = a("./dragdrop_handler").DragdropHandler;
                var j = a("./touch_handler").addTouchListeners;
                var k = a("../config");
                var l = function(a) {
                    var b = this;
                    this.editor = a;
                    new f(this);
                    new g(this);
                    new i(this);
                    var c = function(b) {
                        var c = !document.hasFocus || !document.hasFocus() || (!a.isFocused() && document.activeElement == (a.textInput && a.textInput.getElement()));
                        if (c) window.focus();
                        a.focus();
                    };
                    var h = a.renderer.getMouseEventTarget();
                    d.addListener(h, "click", this.onMouseEvent.bind(this, "click"), a);
                    d.addListener(h, "mousemove", this.onMouseMove.bind(this, "mousemove"), a);
                    d.addMultiMouseDownListener([
                        h,
                        a.renderer.scrollBarV && a.renderer.scrollBarV.inner,
                        a.renderer.scrollBarH && a.renderer.scrollBarH.inner,
                        a.textInput && a.textInput.getElement(), 
                    ].filter(Boolean), [
                        400,
                        300,
                        250
                    ], this, "onMouseEvent", a);
                    d.addMouseWheelListener(a.container, this.onMouseWheel.bind(this, "mousewheel"), a);
                    j(a.container, a);
                    var k = a.renderer.$gutter;
                    d.addListener(k, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"), a);
                    d.addListener(k, "click", this.onMouseEvent.bind(this, "gutterclick"), a);
                    d.addListener(k, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"), a);
                    d.addListener(k, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"), a);
                    d.addListener(h, "mousedown", c, a);
                    d.addListener(k, "mousedown", c, a);
                    if (e.isIE && a.renderer.scrollBarV) {
                        d.addListener(a.renderer.scrollBarV.element, "mousedown", c, a);
                        d.addListener(a.renderer.scrollBarH.element, "mousedown", c, a);
                    }
                    a.on("mousemove", function(c) {
                        if (b.state || b.$dragDelay || !b.$dragEnabled) return;
                        var d = a.renderer.screenToTextCoordinates(c.x, c.y);
                        var e = a.session.selection.getRange();
                        var f = a.renderer;
                        if (!e.isEmpty() && e.insideStart(d.row, d.column)) {
                            f.setCursorStyle("default");
                        } else {
                            f.setCursorStyle("");
                        }
                    }, a);
                };
                (function() {
                    this.onMouseEvent = function(a, b) {
                        if (!this.editor.session) return;
                        this.editor._emit(a, new h(b, this.editor));
                    };
                    this.onMouseMove = function(a, b) {
                        var c = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
                        if (!c || !c.length) return;
                        this.editor._emit(a, new h(b, this.editor));
                    };
                    this.onMouseWheel = function(a, b) {
                        var c = new h(b, this.editor);
                        c.speed = this.$scrollSpeed * 2;
                        c.wheelX = b.wheelX;
                        c.wheelY = b.wheelY;
                        this.editor._emit(a, c);
                    };
                    this.setState = function(a) {
                        this.state = a;
                    };
                    this.captureMouse = function(a, b) {
                        this.x = a.x;
                        this.y = a.y;
                        this.isMousePressed = true;
                        var c = this.editor;
                        var f = this.editor.renderer;
                        f.$isMousePressed = true;
                        var g = this;
                        var i = function(a) {
                            if (!a) return;
                            if (e.isWebKit && !a.which && g.releaseMouse) return g.releaseMouse();
                            g.x = a.clientX;
                            g.y = a.clientY;
                            b && b(a);
                            g.mouseEvent = new h(a, g.editor);
                            g.$mouseMoved = true;
                        };
                        var j = function(a) {
                            c.off("beforeEndOperation", l);
                            clearInterval(m);
                            if (c.session) k();
                            g[g.state + "End"] && g[g.state + "End"](a);
                            g.state = "";
                            g.isMousePressed = f.$isMousePressed = false;
                            if (f.$keepTextAreaAtCursor) f.$moveTextAreaToCursor();
                            g.$onCaptureMouseMove = g.releaseMouse = null;
                            a && g.onMouseEvent("mouseup", a);
                            c.endOperation();
                        };
                        var k = function() {
                            g[g.state] && g[g.state]();
                            g.$mouseMoved = false;
                        };
                        if (e.isOldIE && a.domEvent.type == "dblclick") {
                            return setTimeout(function() {
                                j(a);
                            });
                        }
                        var l = function(a) {
                            if (!g.releaseMouse) return;
                            if (c.curOp.command.name && c.curOp.selectionChanged) {
                                g[g.state + "End"] && g[g.state + "End"]();
                                g.state = "";
                                g.releaseMouse();
                            }
                        };
                        c.on("beforeEndOperation", l);
                        c.startOperation({
                            command: {
                                name: "mouse"
                            }
                        });
                        g.$onCaptureMouseMove = i;
                        g.releaseMouse = d.capture(this.editor.container, i, j);
                        var m = setInterval(k, 20);
                    };
                    this.releaseMouse = null;
                    this.cancelContextMenu = function() {
                        var a = function(b) {
                            if (b && b.domEvent && b.domEvent.type != "contextmenu") return;
                            this.editor.off("nativecontextmenu", a);
                            if (b && b.domEvent) d.stopEvent(b.domEvent);
                        }.bind(this);
                        setTimeout(a, 10);
                        this.editor.on("nativecontextmenu", a);
                    };
                    this.destroy = function() {
                        if (this.releaseMouse) this.releaseMouse();
                    };
                }.call(l.prototype));
                k.defineOptions(l.prototype, "mouseHandler", {
                    scrollSpeed: {
                        initialValue: 2
                    },
                    dragDelay: {
                        initialValue: e.isMac ? 150 : 0
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
                b.MouseHandler = l;
            });
            ace.define("ace/mouse/fold_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/dom");
                function e(a) {
                    a.on("click", function(b) {
                        var c = b.getDocumentPosition();
                        var e = a.session;
                        var f = e.getFoldAt(c.row, c.column, 1);
                        if (f) {
                            if (b.getAccelKey()) e.removeFold(f);
                            else e.expandFold(f);
                            b.stop();
                        }
                        var g = b.domEvent && b.domEvent.target;
                        if (g && d.hasCssClass(g, "ace_inline_button")) {
                            if (d.hasCssClass(g, "ace_toggle_wrap")) {
                                e.setOption("wrap", !e.getUseWrapMode());
                                a.renderer.scrollCursorIntoView();
                            }
                        }
                    });
                    a.on("gutterclick", function(b) {
                        var c = a.renderer.$gutterLayer.getRegion(b);
                        if (c == "foldWidgets") {
                            var d = b.getDocumentPosition().row;
                            var e = a.session;
                            if (e.foldWidgets && e.foldWidgets[d]) a.session.onFoldWidgetClick(d, b);
                            if (!a.isFocused()) a.focus();
                            b.stop();
                        }
                    });
                    a.on("gutterdblclick", function(b) {
                        var c = a.renderer.$gutterLayer.getRegion(b);
                        if (c == "foldWidgets") {
                            var d = b.getDocumentPosition().row;
                            var e = a.session;
                            var f = e.getParentFoldRangeData(d, true);
                            var g = f.range || f.firstRange;
                            if (g) {
                                d = g.start.row;
                                var h = e.getFoldAt(d, e.getLine(d).length, 1);
                                if (h) {
                                    e.removeFold(h);
                                } else {
                                    e.addFold("...", g);
                                    a.renderer.scrollCursorIntoView({
                                        row: g.start.row,
                                        column: 0
                                    });
                                }
                            }
                            b.stop();
                        }
                    });
                }
                b.FoldHandler = e;
            });
            ace.define("ace/keyboard/keybinding", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/event", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/keys");
                var e = a("../lib/event");
                var f = function(a) {
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
                    this.setKeyboardHandler = function(a) {
                        var b = this.$handlers;
                        if (b[b.length - 1] == a) return;
                        while(b[b.length - 1] && b[b.length - 1] != this.$defaultHandler)this.removeKeyboardHandler(b[b.length - 1]);
                        this.addKeyboardHandler(a, 1);
                    };
                    this.addKeyboardHandler = function(a, b) {
                        if (!a) return;
                        if (typeof a == "function" && !a.handleKeyboard) a.handleKeyboard = a;
                        var c = this.$handlers.indexOf(a);
                        if (c != -1) this.$handlers.splice(c, 1);
                        if (b == undefined) this.$handlers.push(a);
                        else this.$handlers.splice(b, 0, a);
                        if (c == -1 && a.attach) a.attach(this.$editor);
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
                    this.$callKeyboardHandlers = function(a, b, c, d) {
                        var f;
                        var g = false;
                        var h = this.$editor.commands;
                        for(var i = this.$handlers.length; i--;){
                            f = this.$handlers[i].handleKeyboard(this.$data, a, b, c, d);
                            if (!f || !f.command) continue;
                            if (f.command == "null") {
                                g = true;
                            } else {
                                g = h.exec(f.command, this.$editor, f.args, d);
                            }
                            if (g && d && a != -1 && f.passEvent != true && f.command.passEvent != true) {
                                e.stopEvent(d);
                            }
                            if (g) break;
                        }
                        if (!g && a == -1) {
                            f = {
                                command: "insertstring"
                            };
                            g = h.exec("insertstring", this.$editor, b);
                        }
                        if (g && this.$editor._signal) this.$editor._signal("keyboardActivity", f);
                        return g;
                    };
                    this.onCommandKey = function(a, b, c) {
                        var e = d.keyCodeToString(c);
                        return this.$callKeyboardHandlers(b, e, c, a);
                    };
                    this.onTextInput = function(a) {
                        return this.$callKeyboardHandlers(-1, a);
                    };
                }.call(f.prototype));
                b.KeyBinding = f;
            });
            ace.define("ace/lib/bidiutil", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                var d = [
                    "\u0621",
                    "\u0641"
                ];
                var e = [
                    "\u063A",
                    "\u064a"
                ];
                var f = 0, g = 0;
                var h = false, i = false, j = false, k = false, l = false, m = false;
                var n = [
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
                var o = [
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
                var p = 0, q = 1;
                var r = 0;
                var s = 1;
                var t = 2;
                var u = 3;
                var v = 4;
                var w = 5;
                var x = 6;
                var y = 7;
                var z = 8;
                var A = 9;
                var B = 10;
                var C = 11;
                var D = 12;
                var E = 13;
                var F = 14;
                var G = 15;
                var H = 16;
                var I = 17;
                var J = 18;
                var K = [
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    x,
                    w,
                    x,
                    z,
                    w,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    w,
                    w,
                    w,
                    x,
                    z,
                    v,
                    v,
                    C,
                    C,
                    C,
                    v,
                    v,
                    v,
                    v,
                    v,
                    B,
                    A,
                    B,
                    A,
                    A,
                    t,
                    t,
                    t,
                    t,
                    t,
                    t,
                    t,
                    t,
                    t,
                    t,
                    A,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    r,
                    v,
                    v,
                    v,
                    v,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    w,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    J,
                    A,
                    v,
                    C,
                    C,
                    C,
                    C,
                    v,
                    v,
                    v,
                    v,
                    r,
                    v,
                    v,
                    J,
                    v,
                    v,
                    C,
                    C,
                    t,
                    t,
                    v,
                    r,
                    v,
                    v,
                    v,
                    t,
                    r,
                    v,
                    v,
                    v,
                    v,
                    v, 
                ];
                var L = [
                    z,
                    z,
                    z,
                    z,
                    z,
                    z,
                    z,
                    z,
                    z,
                    z,
                    z,
                    J,
                    J,
                    J,
                    r,
                    s,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    z,
                    w,
                    E,
                    F,
                    G,
                    H,
                    I,
                    A,
                    C,
                    C,
                    C,
                    C,
                    C,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    A,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    v,
                    z, 
                ];
                function M(a, b, c, d) {
                    var e = f ? o : n, l = null, m = null, p = null, q = 0, r = null, s = null, t = -1, u = null, v = null, y = [];
                    if (!d) {
                        for(u = 0, d = []; u < c; u++){
                            d[u] = P(a[u]);
                        }
                    }
                    g = f;
                    h = false;
                    i = false;
                    j = false;
                    k = false;
                    for(v = 0; v < c; v++){
                        l = q;
                        y[v] = m = O(a, d, y, v);
                        q = e[l][m];
                        r = q & 0xf0;
                        q &= 0x0f;
                        b[v] = p = e[q][5];
                        if (r > 0) {
                            if (r == 0x10) {
                                for(u = t; u < v; u++){
                                    b[u] = 1;
                                }
                                t = -1;
                            } else {
                                t = -1;
                            }
                        }
                        s = e[q][6];
                        if (s) {
                            if (t == -1) {
                                t = v;
                            }
                        } else {
                            if (t > -1) {
                                for(u = t; u < v; u++){
                                    b[u] = p;
                                }
                                t = -1;
                            }
                        }
                        if (d[v] == w) {
                            b[v] = 0;
                        }
                        g |= p;
                    }
                    if (k) {
                        for(u = 0; u < c; u++){
                            if (d[u] == x) {
                                b[u] = f;
                                for(var A = u - 1; A >= 0; A--){
                                    if (d[A] == z) {
                                        b[A] = f;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                function N(a, b, c) {
                    if (g < a) {
                        return;
                    }
                    if (a == 1 && f == q && !j) {
                        c.reverse();
                        return;
                    }
                    var d = c.length, e = 0, h, i, k, l;
                    while(e < d){
                        if (b[e] >= a) {
                            h = e + 1;
                            while(h < d && b[h] >= a){
                                h++;
                            }
                            for(i = e, k = h - 1; i < k; i++, k--){
                                l = c[i];
                                c[i] = c[k];
                                c[k] = l;
                            }
                            e = h;
                        }
                        e++;
                    }
                }
                function O(a, b, c, d) {
                    var e = b[d], g, l, m, n;
                    switch(e){
                        case r:
                        case s:
                            h = false;
                        case v:
                        case u:
                            return e;
                        case t:
                            return h ? u : t;
                        case y:
                            h = true;
                            i = true;
                            return s;
                        case z:
                            return v;
                        case A:
                            if (d < 1 || d + 1 >= b.length || ((g = c[d - 1]) != t && g != u) || ((l = b[d + 1]) != t && l != u)) {
                                return v;
                            }
                            if (h) {
                                l = u;
                            }
                            return l == g ? l : v;
                        case B:
                            g = d > 0 ? c[d - 1] : w;
                            if (g == t && d + 1 < b.length && b[d + 1] == t) {
                                return t;
                            }
                            return v;
                        case C:
                            if (d > 0 && c[d - 1] == t) {
                                return t;
                            }
                            if (h) {
                                return v;
                            }
                            n = d + 1;
                            m = b.length;
                            while(n < m && b[n] == C){
                                n++;
                            }
                            if (n < m && b[n] == t) {
                                return t;
                            }
                            return v;
                        case D:
                            m = b.length;
                            n = d + 1;
                            while(n < m && b[n] == D){
                                n++;
                            }
                            if (n < m) {
                                var o = a[d], p = (o >= 0x0591 && o <= 0x08ff) || o == 0xfb1e;
                                g = b[n];
                                if (p && (g == s || g == y)) {
                                    return s;
                                }
                            }
                            if (d < 1 || (g = b[d - 1]) == w) {
                                return v;
                            }
                            return c[d - 1];
                        case w:
                            h = false;
                            j = true;
                            return f;
                        case x:
                            k = true;
                            return v;
                        case E:
                        case F:
                        case H:
                        case I:
                        case G:
                            h = false;
                        case J:
                            return v;
                    }
                }
                function P(a) {
                    var b = a.charCodeAt(0), c = b >> 8;
                    if (c == 0) {
                        return b > 0x00bf ? r : K[b];
                    } else if (c == 5) {
                        return /[\u0591-\u05f4]/.test(a) ? s : r;
                    } else if (c == 6) {
                        if (/[\u0610-\u061a\u064b-\u065f\u06d6-\u06e4\u06e7-\u06ed]/.test(a)) return D;
                        else if (/[\u0660-\u0669\u066b-\u066c]/.test(a)) return u;
                        else if (b == 0x066a) return C;
                        else if (/[\u06f0-\u06f9]/.test(a)) return t;
                        else return y;
                    } else if (c == 0x20 && b <= 0x205f) {
                        return L[b & 0xff];
                    } else if (c == 0xfe) {
                        return b >= 0xfe70 ? y : v;
                    }
                    return v;
                }
                function Q(a) {
                    return a >= "\u064b" && a <= "\u0655";
                }
                b.L = r;
                b.R = s;
                b.EN = t;
                b.ON_R = 3;
                b.AN = 4;
                b.R_H = 5;
                b.B = 6;
                b.RLE = 7;
                b.DOT = "\xB7";
                b.doBidiReorder = function(a, c, d) {
                    if (a.length < 2) return {};
                    var e = a.split(""), g = new Array(e.length), h = new Array(e.length), i = [];
                    f = d ? q : p;
                    M(e, i, e.length, c);
                    for(var j = 0; j < g.length; g[j] = j, j++);
                    N(2, i, g);
                    N(1, i, g);
                    for(var j = 0; j < g.length - 1; j++){
                        if (c[j] === u) {
                            i[j] = b.AN;
                        } else if (i[j] === s && ((c[j] > y && c[j] < E) || c[j] === v || c[j] === J)) {
                            i[j] = b.ON_R;
                        } else if (j > 0 && e[j - 1] === "\u0644" && /\u0622|\u0623|\u0625|\u0627/.test(e[j])) {
                            i[j - 1] = i[j] = b.R_H;
                            j++;
                        }
                    }
                    if (e[e.length - 1] === b.DOT) i[e.length - 1] = b.B;
                    if (e[0] === "\u202B") i[0] = b.RLE;
                    for(var j = 0; j < g.length; j++){
                        h[j] = i[g[j]];
                    }
                    return {
                        logicalFromVisual: g,
                        bidiLevels: h
                    };
                };
                b.hasBidiCharacters = function(a, b) {
                    var c = false;
                    for(var d = 0; d < a.length; d++){
                        b[d] = P(a.charAt(d));
                        if (!c && (b[d] == s || b[d] == y || b[d] == u)) c = true;
                    }
                    return c;
                };
                b.getVisualFromLogicalIdx = function(a, b) {
                    for(var c = 0; c < b.logicalFromVisual.length; c++){
                        if (b.logicalFromVisual[c] == a) return c;
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
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/bidiutil");
                var e = a("./lib/lang");
                var f = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\u202B]/;
                var g = function(a) {
                    this.session = a;
                    this.bidiMap = {};
                    this.currentRow = null;
                    this.bidiUtil = d;
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
                    this.seenBidi = f.test(a.getValue());
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
                            if (a.action == "insert" && f.test(a.lines.join("\n"))) {
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
                    this.updateRowLine = function(a, b) {
                        if (a === undefined) a = this.getDocumentRow();
                        var c = a === this.session.getLength() - 1, f = c ? this.EOF : this.EOL;
                        this.wrapIndent = 0;
                        this.line = this.session.getLine(a);
                        this.isRtlDir = this.$isRtl || this.line.charAt(0) === this.RLE;
                        if (this.session.$useWrapMode) {
                            var g = this.session.$wrapData[a];
                            if (g) {
                                if (b === undefined) b = this.getSplitIndex();
                                if (b > 0 && g.length) {
                                    this.wrapIndent = g.indent;
                                    this.wrapOffset = this.wrapIndent * this.charWidths[d.L];
                                    this.line = b < g.length ? this.line.substring(g[b - 1], g[b]) : this.line.substring(g[g.length - 1]);
                                } else {
                                    this.line = this.line.substring(0, g[b]);
                                }
                            }
                            if (b == g.length) this.line += this.showInvisibles ? f : d.DOT;
                        } else {
                            this.line += this.showInvisibles ? f : d.DOT;
                        }
                        var h = this.session, i = 0, j;
                        this.line = this.line.replace(/\t|[\u1100-\u2029, \u202F-\uFFE6]/g, function(a, b) {
                            if (a === "\t" || h.isFullWidth(a.charCodeAt(0))) {
                                j = a === "\t" ? h.getScreenTabSize(b + i) : 2;
                                i += j - 1;
                                return e.stringRepeat(d.DOT, j);
                            }
                            return a;
                        });
                        if (this.isRtlDir) {
                            this.fontMetrics.$main.textContent = this.line.charAt(this.line.length - 1) == d.DOT ? this.line.substr(0, this.line.length - 1) : this.line;
                            this.rtlLineOffset = this.contentWidth - this.fontMetrics.$main.getBoundingClientRect().width;
                        }
                    };
                    this.updateBidiMap = function() {
                        var a = [];
                        if (d.hasBidiCharacters(this.line, a) || this.isRtlDir) {
                            this.bidiMap = d.doBidiReorder(this.line, a, this.isRtlDir);
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
                        var b = (this.characterWidth = a.$characterSize.width);
                        var c = a.$measureCharWidth("\u05d4");
                        this.charWidths[d.L] = this.charWidths[d.EN] = this.charWidths[d.ON_R] = b;
                        this.charWidths[d.R] = this.charWidths[d.AN] = c;
                        this.charWidths[d.R_H] = c * 0.45;
                        this.charWidths[d.B] = this.charWidths[d.RLE] = 0;
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
                    this.setRtlDirection = function(a, b) {
                        var c = a.getCursorPosition();
                        for(var d = a.selection.getSelectionAnchor().row; d <= c.row; d++){
                            if (!b && a.session.getLine(d).charAt(0) === a.session.$bidiHandler.RLE) a.session.doc.removeInLine(d, 0, 1);
                            else if (b && a.session.getLine(d).charAt(0) !== a.session.$bidiHandler.RLE) a.session.doc.insert({
                                column: 0,
                                row: d
                            }, a.session.$bidiHandler.RLE);
                        }
                    };
                    this.getPosLeft = function(a) {
                        a -= this.wrapIndent;
                        var b = this.line.charAt(0) === this.RLE ? 1 : 0;
                        var c = a > b ? this.session.getOverwrite() ? a : a - 1 : b;
                        var e = d.getVisualFromLogicalIdx(c, this.bidiMap), f = this.bidiMap.bidiLevels, g = 0;
                        if (!this.session.getOverwrite() && a <= b && f[e] % 2 !== 0) e++;
                        for(var h = 0; h < e; h++){
                            g += this.charWidths[f[h]];
                        }
                        if (!this.session.getOverwrite() && a > b && f[e] % 2 === 0) g += this.charWidths[f[e]];
                        if (this.wrapIndent) g += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        if (this.isRtlDir) g += this.rtlLineOffset;
                        return g;
                    };
                    this.getSelections = function(a, b) {
                        var c = this.bidiMap, d = c.bidiLevels, e, f = [], g = 0, h = Math.min(a, b) - this.wrapIndent, i = Math.max(a, b) - this.wrapIndent, j = false, k = false, l = 0;
                        if (this.wrapIndent) g += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        for(var m, n = 0; n < d.length; n++){
                            m = c.logicalFromVisual[n];
                            e = d[n];
                            j = m >= h && m < i;
                            if (j && !k) {
                                l = g;
                            } else if (!j && k) {
                                f.push({
                                    left: l,
                                    width: g - l
                                });
                            }
                            g += this.charWidths[e];
                            k = j;
                        }
                        if (j && n === d.length) {
                            f.push({
                                left: l,
                                width: g - l
                            });
                        }
                        if (this.isRtlDir) {
                            for(var o = 0; o < f.length; o++){
                                f[o].left += this.rtlLineOffset;
                            }
                        }
                        return f;
                    };
                    this.offsetToCol = function(a) {
                        if (this.isRtlDir) a -= this.rtlLineOffset;
                        var b = 0, a = Math.max(a, 0), c = 0, d = 0, e = this.bidiMap.bidiLevels, f = this.charWidths[e[d]];
                        if (this.wrapIndent) a -= this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset;
                        while(a > c + f / 2){
                            c += f;
                            if (d === e.length - 1) {
                                f = 0;
                                break;
                            }
                            f = this.charWidths[e[++d]];
                        }
                        if (d > 0 && e[d - 1] % 2 !== 0 && e[d] % 2 === 0) {
                            if (a < c) d--;
                            b = this.bidiMap.logicalFromVisual[d];
                        } else if (d > 0 && e[d - 1] % 2 === 0 && e[d] % 2 !== 0) {
                            b = 1 + (a > c ? this.bidiMap.logicalFromVisual[d] : this.bidiMap.logicalFromVisual[d - 1]);
                        } else if ((this.isRtlDir && d === e.length - 1 && f === 0 && e[d - 1] % 2 === 0) || (!this.isRtlDir && d === 0 && e[d] % 2 !== 0)) {
                            b = 1 + this.bidiMap.logicalFromVisual[d];
                        } else {
                            if (d > 0 && e[d - 1] % 2 !== 0 && f !== 0) d--;
                            b = this.bidiMap.logicalFromVisual[d];
                        }
                        if (b === 0 && this.isRtlDir) b++;
                        return b + this.wrapIndent;
                    };
                }.call(g.prototype));
                b.BidiHandler = g;
            });
            ace.define("ace/selection", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/lib/event_emitter",
                "ace/range", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./lib/lang");
                var f = a("./lib/event_emitter").EventEmitter;
                var g = a("./range").Range;
                var h = function(a) {
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
                    d.implement(this, f);
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
                        var a = this.anchor;
                        var b = this.lead;
                        if (this.$isEmpty) return g.fromPoints(b, b);
                        return this.isBackwards() ? g.fromPoints(b, a) : g.fromPoints(a, b);
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
                        this.$isEmpty = !g.comparePoints(this.anchor, this.cursor);
                        this.$silent = false;
                        if (this.$cursorChanged) this._emit("changeCursor");
                        if (this.$cursorChanged || this.$anchorChanged || e != this.$isEmpty || f) this._emit("changeSelection");
                    };
                    this.$moveSelection = function(a) {
                        var b = this.lead;
                        if (this.$isEmpty) this.setSelectionAnchor(b.row, b.column);
                        a.call(this);
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
                    this.getLineRange = function(a, b) {
                        var c = typeof a == "number" ? a : this.lead.row;
                        var d;
                        var e = this.session.getFoldLine(c);
                        if (e) {
                            c = e.start.row;
                            d = e.end.row;
                        } else {
                            d = c;
                        }
                        if (b === true) return new g(c, 0, d, this.session.getLine(d).length);
                        else return new g(c, 0, d + 1, 0);
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
                    this.wouldMoveIntoSoftTab = function(a, b, c) {
                        var d = a.column;
                        var e = a.column + b;
                        if (c < 0) {
                            d = a.column - b;
                            e = a.column;
                        }
                        return (this.session.isTabStop(a) && this.doc.getLine(a.row).slice(d, e).split(" ").length - 1 == b);
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
                        var a = this.lead.row;
                        var b = this.lead.column;
                        var c = this.session.documentToScreenRow(a, b);
                        var d = this.session.screenToDocumentPosition(c, 0);
                        var e = this.session.getDisplayLine(a, null, d.row, d.column);
                        var f = e.match(/^\s*/);
                        if (f[0].length != b && !this.session.$useEmacsStyleLineStart) d.column += f[0].length;
                        this.moveCursorToPosition(d);
                    };
                    this.moveCursorLineEnd = function() {
                        var a = this.lead;
                        var b = this.session.getDocumentLastRowColumnPosition(a.row, a.column);
                        if (this.lead.column == b.column) {
                            var c = this.session.getLine(b.row);
                            if (b.column == c.length) {
                                var d = c.search(/\s+$/);
                                if (d > 0) b.column = d;
                            }
                        }
                        this.moveCursorTo(b.row, b.column);
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
                        var a = this.lead.row;
                        var b = this.lead.column;
                        var c = this.doc.getLine(a);
                        var d = c.substring(b);
                        this.session.nonTokenRe.lastIndex = 0;
                        this.session.tokenRe.lastIndex = 0;
                        var e = this.session.getFoldAt(a, b, 1);
                        if (e) {
                            this.moveCursorTo(e.end.row, e.end.column);
                            return;
                        }
                        if (this.session.nonTokenRe.exec(d)) {
                            b += this.session.nonTokenRe.lastIndex;
                            this.session.nonTokenRe.lastIndex = 0;
                            d = c.substring(b);
                        }
                        if (b >= c.length) {
                            this.moveCursorTo(a, c.length);
                            this.moveCursorRight();
                            if (a < this.doc.getLength() - 1) this.moveCursorWordRight();
                            return;
                        }
                        if (this.session.tokenRe.exec(d)) {
                            b += this.session.tokenRe.lastIndex;
                            this.session.tokenRe.lastIndex = 0;
                        }
                        this.moveCursorTo(a, b);
                    };
                    this.moveCursorLongWordLeft = function() {
                        var a = this.lead.row;
                        var b = this.lead.column;
                        var c;
                        if ((c = this.session.getFoldAt(a, b, -1))) {
                            this.moveCursorTo(c.start.row, c.start.column);
                            return;
                        }
                        var d = this.session.getFoldStringAt(a, b, -1);
                        if (d == null) {
                            d = this.doc.getLine(a).substring(0, b);
                        }
                        var f = e.stringReverse(d);
                        this.session.nonTokenRe.lastIndex = 0;
                        this.session.tokenRe.lastIndex = 0;
                        if (this.session.nonTokenRe.exec(f)) {
                            b -= this.session.nonTokenRe.lastIndex;
                            f = f.slice(this.session.nonTokenRe.lastIndex);
                            this.session.nonTokenRe.lastIndex = 0;
                        }
                        if (b <= 0) {
                            this.moveCursorTo(a, 0);
                            this.moveCursorLeft();
                            if (a > 0) this.moveCursorWordLeft();
                            return;
                        }
                        if (this.session.tokenRe.exec(f)) {
                            b -= this.session.tokenRe.lastIndex;
                            this.session.tokenRe.lastIndex = 0;
                        }
                        this.moveCursorTo(a, b);
                    };
                    this.$shortWordEndIndex = function(a) {
                        var b = 0, c;
                        var d = /\s/;
                        var e = this.session.tokenRe;
                        e.lastIndex = 0;
                        if (this.session.tokenRe.exec(a)) {
                            b = this.session.tokenRe.lastIndex;
                        } else {
                            while((c = a[b]) && d.test(c))b++;
                            if (b < 1) {
                                e.lastIndex = 0;
                                while((c = a[b]) && !e.test(c)){
                                    e.lastIndex = 0;
                                    b++;
                                    if (d.test(c)) {
                                        if (b > 2) {
                                            b--;
                                            break;
                                        } else {
                                            while((c = a[b]) && d.test(c))b++;
                                            if (b > 2) break;
                                        }
                                    }
                                }
                            }
                        }
                        e.lastIndex = 0;
                        return b;
                    };
                    this.moveCursorShortWordRight = function() {
                        var a = this.lead.row;
                        var b = this.lead.column;
                        var c = this.doc.getLine(a);
                        var d = c.substring(b);
                        var e = this.session.getFoldAt(a, b, 1);
                        if (e) return this.moveCursorTo(e.end.row, e.end.column);
                        if (b == c.length) {
                            var f = this.doc.getLength();
                            do {
                                a++;
                                d = this.doc.getLine(a);
                            }while (a < f && /^\s*$/.test(d))
                            if (!/^\s+/.test(d)) d = "";
                            b = 0;
                        }
                        var g = this.$shortWordEndIndex(d);
                        this.moveCursorTo(a, b + g);
                    };
                    this.moveCursorShortWordLeft = function() {
                        var a = this.lead.row;
                        var b = this.lead.column;
                        var c;
                        if ((c = this.session.getFoldAt(a, b, -1))) return this.moveCursorTo(c.start.row, c.start.column);
                        var d = this.session.getLine(a).substring(0, b);
                        if (b === 0) {
                            do {
                                a--;
                                d = this.doc.getLine(a);
                            }while (a > 0 && /^\s*$/.test(d))
                            b = d.length;
                            if (!/\s+$/.test(d)) d = "";
                        }
                        var f = e.stringReverse(d);
                        var g = this.$shortWordEndIndex(f);
                        return this.moveCursorTo(a, b - g);
                    };
                    this.moveCursorWordRight = function() {
                        if (this.session.$selectLongWords) this.moveCursorLongWordRight();
                        else this.moveCursorShortWordRight();
                    };
                    this.moveCursorWordLeft = function() {
                        if (this.session.$selectLongWords) this.moveCursorLongWordLeft();
                        else this.moveCursorShortWordLeft();
                    };
                    this.moveCursorBy = function(a, b) {
                        var c = this.session.documentToScreenPosition(this.lead.row, this.lead.column);
                        var d;
                        if (b === 0) {
                            if (a !== 0) {
                                if (this.session.$bidiHandler.isBidiRow(c.row, this.lead.row)) {
                                    d = this.session.$bidiHandler.getPosLeft(c.column);
                                    c.column = Math.round(d / this.session.$bidiHandler.charWidths[0]);
                                } else {
                                    d = c.column * this.session.$bidiHandler.charWidths[0];
                                }
                            }
                            if (this.$desiredColumn) c.column = this.$desiredColumn;
                            else this.$desiredColumn = c.column;
                        }
                        if (a != 0 && this.session.lineWidgets && this.session.lineWidgets[this.lead.row]) {
                            var e = this.session.lineWidgets[this.lead.row];
                            if (a < 0) a -= e.rowsAbove || 0;
                            else if (a > 0) a += e.rowCount - (e.rowsAbove || 0);
                        }
                        var f = this.session.screenToDocumentPosition(c.row + a, c.column, d);
                        if (a !== 0 && b === 0 && f.row === this.lead.row && f.column === this.lead.column) {}
                        this.moveCursorTo(f.row, f.column + b, b === 0);
                    };
                    this.moveCursorToPosition = function(a) {
                        this.moveCursorTo(a.row, a.column);
                    };
                    this.moveCursorTo = function(a, b, c) {
                        var d = this.session.getFoldAt(a, b, 1);
                        if (d) {
                            a = d.start.row;
                            b = d.start.column;
                        }
                        this.$keepDesiredColumnOnChange = true;
                        var e = this.session.getLine(a);
                        if (/[\uDC00-\uDFFF]/.test(e.charAt(b)) && e.charAt(b - 1)) {
                            if (this.lead.row == a && this.lead.column == b + 1) b = b - 1;
                            else b = b + 1;
                        }
                        this.lead.setPosition(a, b);
                        this.$keepDesiredColumnOnChange = false;
                        if (!c) this.$desiredColumn = null;
                    };
                    this.moveCursorToScreen = function(a, b, c) {
                        var d = this.session.screenToDocumentPosition(a, b);
                        this.moveCursorTo(d.row, d.column, c);
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
                    this.getRangeOfMovements = function(a) {
                        var b = this.getCursor();
                        try {
                            a(this);
                            var c = this.getCursor();
                            return g.fromPoints(b, c);
                        } catch (d) {
                            return g.fromPoints(b, b);
                        } finally{
                            this.moveCursorToPosition(b);
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
                                    var c = g.fromPoints(a[b].start, a[b].end);
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
                }.call(h.prototype));
                b.Selection = h;
            });
            ace.define("ace/tokenizer", [
                "require",
                "exports",
                "module",
                "ace/config"
            ], function(a, b, c) {
                "use strict";
                var d = a("./config");
                var e = 2000;
                var f = function(a) {
                    this.states = a;
                    this.regExps = {};
                    this.matchMappings = {};
                    for(var b in this.states){
                        var c = this.states[b];
                        var d = [];
                        var e = 0;
                        var f = (this.matchMappings[b] = {
                            defaultToken: "text"
                        });
                        var g = "g";
                        var h = [];
                        for(var i = 0; i < c.length; i++){
                            var j = c[i];
                            if (j.defaultToken) f.defaultToken = j.defaultToken;
                            if (j.caseInsensitive) g = "gi";
                            if (j.regex == null) continue;
                            if (j.regex instanceof RegExp) j.regex = j.regex.toString().slice(1, -1);
                            var k = j.regex;
                            var l = new RegExp("(?:(" + k + ")|(.))").exec("a").length - 2;
                            if (Array.isArray(j.token)) {
                                if (j.token.length == 1 || l == 1) {
                                    j.token = j.token[0];
                                } else if (l - 1 != j.token.length) {
                                    this.reportError("number of classes and regexp groups doesn't match", {
                                        rule: j,
                                        groupCount: l - 1
                                    });
                                    j.token = j.token[0];
                                } else {
                                    j.tokenArray = j.token;
                                    j.token = null;
                                    j.onMatch = this.$arrayTokens;
                                }
                            } else if (typeof j.token == "function" && !j.onMatch) {
                                if (l > 1) j.onMatch = this.$applyToken;
                                else j.onMatch = j.token;
                            }
                            if (l > 1) {
                                if (/\\\d/.test(j.regex)) {
                                    k = j.regex.replace(/\\([0-9]+)/g, function(a, b) {
                                        return ("\\" + (parseInt(b, 10) + e + 1));
                                    });
                                } else {
                                    l = 1;
                                    k = this.removeCapturingGroups(j.regex);
                                }
                                if (!j.splitRegex && typeof j.token != "string") h.push(j);
                            }
                            f[e] = i;
                            e += l;
                            d.push(k);
                            if (!j.onMatch) j.onMatch = null;
                        }
                        if (!d.length) {
                            f[0] = 0;
                            d.push("$");
                        }
                        h.forEach(function(a) {
                            a.splitRegex = this.createSplitterRegexp(a.regex, g);
                        }, this);
                        this.regExps[b] = new RegExp("(" + d.join(")|(") + ")|($)", g);
                    }
                };
                (function() {
                    this.$setMaxTokenCount = function(a) {
                        e = a | 0;
                    };
                    this.$applyToken = function(a) {
                        var b = this.splitRegex.exec(a).slice(1);
                        var c = this.token.apply(this, b);
                        if (typeof c === "string") return [
                            {
                                type: c,
                                value: a
                            }
                        ];
                        var d = [];
                        for(var e = 0, f = c.length; e < f; e++){
                            if (b[e]) d[d.length] = {
                                type: c[e],
                                value: b[e]
                            };
                        }
                        return d;
                    };
                    this.$arrayTokens = function(a) {
                        if (!a) return [];
                        var b = this.splitRegex.exec(a);
                        if (!b) return "text";
                        var c = [];
                        var d = this.tokenArray;
                        for(var e = 0, f = d.length; e < f; e++){
                            if (b[e + 1]) c[c.length] = {
                                type: d[e],
                                value: b[e + 1]
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
                    this.createSplitterRegexp = function(a, b) {
                        if (a.indexOf("(?=") != -1) {
                            var c = 0;
                            var d = false;
                            var e = {};
                            a.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(a, b, f, g, h, i) {
                                if (d) {
                                    d = h != "]";
                                } else if (h) {
                                    d = true;
                                } else if (g) {
                                    if (c == e.stack) {
                                        e.end = i + 1;
                                        e.stack = -1;
                                    }
                                    c--;
                                } else if (f) {
                                    c++;
                                    if (f.length != 1) {
                                        e.stack = c;
                                        e.start = i;
                                    }
                                }
                                return a;
                            });
                            if (e.end != null && /^\)*$/.test(a.substr(e.end))) a = a.substring(0, e.start) + a.substr(e.end);
                        }
                        if (a.charAt(0) != "^") a = "^" + a;
                        if (a.charAt(a.length - 1) != "$") a += "$";
                        return new RegExp(a, (b || "").replace("g", ""));
                    };
                    this.getLineTokens = function(a, b) {
                        if (b && typeof b != "string") {
                            var c = b.slice(0);
                            b = c[0];
                            if (b === "#tmp") {
                                c.shift();
                                b = c.shift();
                            }
                        } else var c = [];
                        var d = b || "start";
                        var f = this.states[d];
                        if (!f) {
                            d = "start";
                            f = this.states[d];
                        }
                        var g = this.matchMappings[d];
                        var h = this.regExps[d];
                        h.lastIndex = 0;
                        var i, j = [];
                        var k = 0;
                        var l = 0;
                        var m = {
                            type: null,
                            value: ""
                        };
                        while((i = h.exec(a))){
                            var n = g.defaultToken;
                            var o = null;
                            var p = i[0];
                            var q = h.lastIndex;
                            if (q - p.length > k) {
                                var r = a.substring(k, q - p.length);
                                if (m.type == n) {
                                    m.value += r;
                                } else {
                                    if (m.type) j.push(m);
                                    m = {
                                        type: n,
                                        value: r
                                    };
                                }
                            }
                            for(var s = 0; s < i.length - 2; s++){
                                if (i[s + 1] === undefined) continue;
                                o = f[g[s]];
                                if (o.onMatch) n = o.onMatch(p, d, c, a);
                                else n = o.token;
                                if (o.next) {
                                    if (typeof o.next == "string") {
                                        d = o.next;
                                    } else {
                                        d = o.next(d, c);
                                    }
                                    f = this.states[d];
                                    if (!f) {
                                        this.reportError("state doesn't exist", d);
                                        d = "start";
                                        f = this.states[d];
                                    }
                                    g = this.matchMappings[d];
                                    k = q;
                                    h = this.regExps[d];
                                    h.lastIndex = q;
                                }
                                if (o.consumeLineEnd) k = q;
                                break;
                            }
                            if (p) {
                                if (typeof n === "string") {
                                    if ((!o || o.merge !== false) && m.type === n) {
                                        m.value += p;
                                    } else {
                                        if (m.type) j.push(m);
                                        m = {
                                            type: n,
                                            value: p
                                        };
                                    }
                                } else if (n) {
                                    if (m.type) j.push(m);
                                    m = {
                                        type: null,
                                        value: ""
                                    };
                                    for(var s = 0; s < n.length; s++)j.push(n[s]);
                                }
                            }
                            if (k == a.length) break;
                            k = q;
                            if (l++ > e) {
                                if (l > 2 * a.length) {
                                    this.reportError("infinite loop with in ace tokenizer", {
                                        startState: b,
                                        line: a
                                    });
                                }
                                while(k < a.length){
                                    if (m.type) j.push(m);
                                    m = {
                                        value: a.substring(k, (k += 500)),
                                        type: "overflow"
                                    };
                                }
                                d = "start";
                                c = [];
                                break;
                            }
                        }
                        if (m.type) j.push(m);
                        if (c.length > 1) {
                            if (c[0] !== d) c.unshift("#tmp", d);
                        }
                        return {
                            tokens: j,
                            state: c.length ? c : d
                        };
                    };
                    this.reportError = d.reportError;
                }.call(f.prototype));
                b.Tokenizer = f;
            });
            ace.define("ace/mode/text_highlight_rules", [
                "require",
                "exports",
                "module",
                "ace/lib/lang"
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/lang");
                var e = function() {
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
                    this.addRules = function(a, b) {
                        if (!b) {
                            for(var c in a)this.$rules[c] = a[c];
                            return;
                        }
                        for(var c in a){
                            var d = a[c];
                            for(var e = 0; e < d.length; e++){
                                var f = d[e];
                                if (f.next || f.onMatch) {
                                    if (typeof f.next == "string") {
                                        if (f.next.indexOf(b) !== 0) f.next = b + f.next;
                                    }
                                    if (f.nextState && f.nextState.indexOf(b) !== 0) f.nextState = b + f.nextState;
                                }
                            }
                            this.$rules[b + c] = d;
                        }
                    };
                    this.getRules = function() {
                        return this.$rules;
                    };
                    this.embedRules = function(a, b, c, e, f) {
                        var g = typeof a == "function" ? new a().getRules() : a;
                        if (e) {
                            for(var h = 0; h < e.length; h++)e[h] = b + e[h];
                        } else {
                            e = [];
                            for(var i in g)e.push(b + i);
                        }
                        this.addRules(g, b);
                        if (c) {
                            var j = Array.prototype[f ? "push" : "unshift"];
                            for(var h = 0; h < e.length; h++)j.apply(this.$rules[e[h]], d.deepCopy(c));
                        }
                        if (!this.$embeds) this.$embeds = [];
                        this.$embeds.push(b);
                    };
                    this.getEmbeds = function() {
                        return this.$embeds;
                    };
                    var a = function(a, b) {
                        if (a != "start" || b.length) b.unshift(this.nextState, a);
                        return this.nextState;
                    };
                    var b = function(a, b) {
                        b.shift();
                        return b.shift() || "start";
                    };
                    this.normalizeRules = function() {
                        var c = 0;
                        var d = this.$rules;
                        function e(f) {
                            var g = d[f];
                            g.processed = true;
                            for(var h = 0; h < g.length; h++){
                                var i = g[h];
                                var j = null;
                                if (Array.isArray(i)) {
                                    j = i;
                                    i = {};
                                }
                                if (!i.regex && i.start) {
                                    i.regex = i.start;
                                    if (!i.next) i.next = [];
                                    i.next.push({
                                        defaultToken: i.token
                                    }, {
                                        token: i.token + ".end",
                                        regex: i.end || i.start,
                                        next: "pop"
                                    });
                                    i.token = i.token + ".start";
                                    i.push = true;
                                }
                                var k = i.next || i.push;
                                if (k && Array.isArray(k)) {
                                    var l = i.stateName;
                                    if (!l) {
                                        l = i.token;
                                        if (typeof l != "string") l = l[0] || "";
                                        if (d[l]) l += c++;
                                    }
                                    d[l] = k;
                                    i.next = l;
                                    e(l);
                                } else if (k == "pop") {
                                    i.next = b;
                                }
                                if (i.push) {
                                    i.nextState = i.next || i.push;
                                    i.next = a;
                                    delete i.push;
                                }
                                if (i.rules) {
                                    for(var m in i.rules){
                                        if (d[m]) {
                                            if (d[m].push) d[m].push.apply(d[m], i.rules[m]);
                                        } else {
                                            d[m] = i.rules[m];
                                        }
                                    }
                                }
                                var n = typeof i == "string" ? i : i.include;
                                if (n) {
                                    if (Array.isArray(n)) j = n.map(function(a) {
                                        return d[a];
                                    });
                                    else j = d[n];
                                }
                                if (j) {
                                    var o = [
                                        h,
                                        1
                                    ].concat(j);
                                    if (i.noEscape) o = o.filter(function(a) {
                                        return !a.next;
                                    });
                                    g.splice.apply(g, o);
                                    h--;
                                }
                                if (i.keywordMap) {
                                    i.token = this.createKeywordMapper(i.keywordMap, i.defaultToken || "text", i.caseInsensitive);
                                    delete i.defaultToken;
                                }
                            }
                        }
                        Object.keys(d).forEach(e, this);
                    };
                    this.createKeywordMapper = function(a, b, c, d) {
                        var e = Object.create(null);
                        this.$keywordList = [];
                        Object.keys(a).forEach(function(b) {
                            var f = a[b];
                            var g = f.split(d || "|");
                            for(var h = g.length; h--;){
                                var i = g[h];
                                this.$keywordList.push(i);
                                if (c) i = i.toLowerCase();
                                e[i] = b;
                            }
                        }, this);
                        a = null;
                        return c ? function(a) {
                            return (e[a.toLowerCase()] || b);
                        } : function(a) {
                            return e[a] || b;
                        };
                    };
                    this.getKeywords = function() {
                        return this.$keywords;
                    };
                }.call(e.prototype));
                b.TextHighlightRules = e;
            });
            ace.define("ace/mode/behaviour", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                var d = function() {
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
                            var b = {};
                            for(var c = 0; c < a.length; c++){
                                if (this.$behaviours[a[c]]) {
                                    b[a[c]] = this.$behaviours[a[c]];
                                }
                            }
                            return b;
                        }
                    };
                }.call(d.prototype));
                b.Behaviour = d;
            });
            ace.define("ace/token_iterator", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(a, b, c) {
                "use strict";
                var d = a("./range").Range;
                var e = function(a, b, c) {
                    this.$session = a;
                    this.$row = b;
                    this.$rowTokens = a.getTokens(b);
                    var d = a.getTokenAt(b, c);
                    this.$tokenIndex = d ? d.index : -1;
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
                        var a = this.$rowTokens;
                        var b = this.$tokenIndex;
                        var c = a[b].start;
                        if (c !== undefined) return c;
                        c = 0;
                        while(b > 0){
                            b -= 1;
                            c += a[b].value.length;
                        }
                        return c;
                    };
                    this.getCurrentTokenPosition = function() {
                        return {
                            row: this.$row,
                            column: this.getCurrentTokenColumn()
                        };
                    };
                    this.getCurrentTokenRange = function() {
                        var a = this.$rowTokens[this.$tokenIndex];
                        var b = this.getCurrentTokenColumn();
                        return new d(this.$row, b, this.$row, b + a.value.length);
                    };
                }.call(e.prototype));
                b.TokenIterator = e;
            });
            ace.define("ace/mode/behaviour/cstyle", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/mode/behaviour",
                "ace/token_iterator",
                "ace/lib/lang", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../../lib/oop");
                var e = a("../behaviour").Behaviour;
                var f = a("../../token_iterator").TokenIterator;
                var g = a("../../lib/lang");
                var h = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator", 
                ];
                var i = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator",
                    "comment", 
                ];
                var j;
                var k = {};
                var l = {
                    '"': '"',
                    "'": "'"
                };
                var m = function(a) {
                    var b = -1;
                    if (a.multiSelect) {
                        b = a.selection.index;
                        if (k.rangeCount != a.multiSelect.rangeCount) k = {
                            rangeCount: a.multiSelect.rangeCount
                        };
                    }
                    if (k[b]) return (j = k[b]);
                    j = k[b] = {
                        autoInsertedBrackets: 0,
                        autoInsertedRow: -1,
                        autoInsertedLineEnd: "",
                        maybeInsertedBrackets: 0,
                        maybeInsertedRow: -1,
                        maybeInsertedLineStart: "",
                        maybeInsertedLineEnd: ""
                    };
                };
                var n = function(a, b, c, d) {
                    var e = a.end.row - a.start.row;
                    return {
                        text: c + b + d,
                        selection: [
                            0,
                            a.start.column + 1,
                            e,
                            a.end.column + (e ? 0 : 1), 
                        ]
                    };
                };
                var o = function(a) {
                    this.add("braces", "insertion", function(b, c, d, e, f) {
                        var h = d.getCursorPosition();
                        var i = e.doc.getLine(h.row);
                        if (f == "{") {
                            m(d);
                            var k = d.getSelectionRange();
                            var l = e.doc.getTextRange(k);
                            if (l !== "" && l !== "{" && d.getWrapBehavioursEnabled()) {
                                return n(k, l, "{", "}");
                            } else if (o.isSaneInsertion(d, e)) {
                                if (/[\]\}\)]/.test(i[h.column]) || d.inMultiSelectMode || (a && a.braces)) {
                                    o.recordAutoInsert(d, e, "}");
                                    return {
                                        text: "{}",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                } else {
                                    o.recordMaybeInsert(d, e, "{");
                                    return {
                                        text: "{",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        } else if (f == "}") {
                            m(d);
                            var p = i.substring(h.column, h.column + 1);
                            if (p == "}") {
                                var q = e.$findOpeningBracket("}", {
                                    column: h.column + 1,
                                    row: h.row
                                });
                                if (q !== null && o.isAutoInsertedClosing(h, i, f)) {
                                    o.popAutoInsertedClosing();
                                    return {
                                        text: "",
                                        selection: [
                                            1,
                                            1
                                        ]
                                    };
                                }
                            }
                        } else if (f == "\n" || f == "\r\n") {
                            m(d);
                            var r = "";
                            if (o.isMaybeInsertedClosing(h, i)) {
                                r = g.stringRepeat("}", j.maybeInsertedBrackets);
                                o.clearMaybeInsertedClosing();
                            }
                            var p = i.substring(h.column, h.column + 1);
                            if (p === "}") {
                                var s = e.findMatchingBracket({
                                    row: h.row,
                                    column: h.column + 1
                                }, "}");
                                if (!s) return null;
                                var t = this.$getIndent(e.getLine(s.row));
                            } else if (r) {
                                var t = this.$getIndent(i);
                            } else {
                                o.clearMaybeInsertedClosing();
                                return;
                            }
                            var u = t + e.getTabString();
                            return {
                                text: "\n" + u + "\n" + t + r,
                                selection: [
                                    1,
                                    u.length,
                                    1,
                                    u.length, 
                                ]
                            };
                        } else {
                            o.clearMaybeInsertedClosing();
                        }
                    });
                    this.add("braces", "deletion", function(a, b, c, d, e) {
                        var f = d.doc.getTextRange(e);
                        if (!e.isMultiLine() && f == "{") {
                            m(c);
                            var g = d.doc.getLine(e.start.row);
                            var h = g.substring(e.end.column, e.end.column + 1);
                            if (h == "}") {
                                e.end.column++;
                                return e;
                            } else {
                                j.maybeInsertedBrackets--;
                            }
                        }
                    });
                    this.add("parens", "insertion", function(a, b, c, d, e) {
                        if (e == "(") {
                            m(c);
                            var f = c.getSelectionRange();
                            var g = d.doc.getTextRange(f);
                            if (g !== "" && c.getWrapBehavioursEnabled()) {
                                return n(f, g, "(", ")");
                            } else if (o.isSaneInsertion(c, d)) {
                                o.recordAutoInsert(c, d, ")");
                                return {
                                    text: "()",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        } else if (e == ")") {
                            m(c);
                            var h = c.getCursorPosition();
                            var i = d.doc.getLine(h.row);
                            var j = i.substring(h.column, h.column + 1);
                            if (j == ")") {
                                var k = d.$findOpeningBracket(")", {
                                    column: h.column + 1,
                                    row: h.row
                                });
                                if (k !== null && o.isAutoInsertedClosing(h, i, e)) {
                                    o.popAutoInsertedClosing();
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
                    this.add("parens", "deletion", function(a, b, c, d, e) {
                        var f = d.doc.getTextRange(e);
                        if (!e.isMultiLine() && f == "(") {
                            m(c);
                            var g = d.doc.getLine(e.start.row);
                            var h = g.substring(e.start.column + 1, e.start.column + 2);
                            if (h == ")") {
                                e.end.column++;
                                return e;
                            }
                        }
                    });
                    this.add("brackets", "insertion", function(a, b, c, d, e) {
                        if (e == "[") {
                            m(c);
                            var f = c.getSelectionRange();
                            var g = d.doc.getTextRange(f);
                            if (g !== "" && c.getWrapBehavioursEnabled()) {
                                return n(f, g, "[", "]");
                            } else if (o.isSaneInsertion(c, d)) {
                                o.recordAutoInsert(c, d, "]");
                                return {
                                    text: "[]",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        } else if (e == "]") {
                            m(c);
                            var h = c.getCursorPosition();
                            var i = d.doc.getLine(h.row);
                            var j = i.substring(h.column, h.column + 1);
                            if (j == "]") {
                                var k = d.$findOpeningBracket("]", {
                                    column: h.column + 1,
                                    row: h.row
                                });
                                if (k !== null && o.isAutoInsertedClosing(h, i, e)) {
                                    o.popAutoInsertedClosing();
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
                    this.add("brackets", "deletion", function(a, b, c, d, e) {
                        var f = d.doc.getTextRange(e);
                        if (!e.isMultiLine() && f == "[") {
                            m(c);
                            var g = d.doc.getLine(e.start.row);
                            var h = g.substring(e.start.column + 1, e.start.column + 2);
                            if (h == "]") {
                                e.end.column++;
                                return e;
                            }
                        }
                    });
                    this.add("string_dquotes", "insertion", function(a, b, c, d, e) {
                        var f = d.$mode.$quotes || l;
                        if (e.length == 1 && f[e]) {
                            if (this.lineCommentStart && this.lineCommentStart.indexOf(e) != -1) return;
                            m(c);
                            var g = e;
                            var h = c.getSelectionRange();
                            var i = d.doc.getTextRange(h);
                            if (i !== "" && (i.length != 1 || !f[i]) && c.getWrapBehavioursEnabled()) {
                                return n(h, i, g, g);
                            } else if (!i) {
                                var j = c.getCursorPosition();
                                var k = d.doc.getLine(j.row);
                                var o = k.substring(j.column - 1, j.column);
                                var p = k.substring(j.column, j.column + 1);
                                var q = d.getTokenAt(j.row, j.column);
                                var r = d.getTokenAt(j.row, j.column + 1);
                                if (o == "\\" && q && /escape/.test(q.type)) return null;
                                var s = q && /string|escape/.test(q.type);
                                var t = !r || /string|escape/.test(r.type);
                                var u;
                                if (p == g) {
                                    u = s !== t;
                                    if (u && /string\.end/.test(r.type)) u = false;
                                } else {
                                    if (s && !t) return null;
                                    if (s && t) return null;
                                    var v = d.$mode.tokenRe;
                                    v.lastIndex = 0;
                                    var w = v.test(o);
                                    v.lastIndex = 0;
                                    var x = v.test(o);
                                    if (w || x) return null;
                                    if (p && !/[\s;,.})\]\\]/.test(p)) return null;
                                    var y = k[j.column - 2];
                                    if (o == g && (y == g || v.test(y))) return null;
                                    u = true;
                                }
                                return {
                                    text: u ? g + g : "",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        }
                    });
                    this.add("string_dquotes", "deletion", function(a, b, c, d, e) {
                        var f = d.$mode.$quotes || l;
                        var g = d.doc.getTextRange(e);
                        if (!e.isMultiLine() && f.hasOwnProperty(g)) {
                            m(c);
                            var h = d.doc.getLine(e.start.row);
                            var i = h.substring(e.start.column + 1, e.start.column + 2);
                            if (i == g) {
                                e.end.column++;
                                return e;
                            }
                        }
                    });
                };
                o.isSaneInsertion = function(a, b) {
                    var c = a.getCursorPosition();
                    var d = new f(b, c.row, c.column);
                    if (!this.$matchTokenType(d.getCurrentToken() || "text", h)) {
                        if (/[)}\]]/.test(a.session.getLine(c.row)[c.column])) return true;
                        var e = new f(b, c.row, c.column + 1);
                        if (!this.$matchTokenType(e.getCurrentToken() || "text", h)) return false;
                    }
                    d.stepForward();
                    return (d.getCurrentTokenRow() !== c.row || this.$matchTokenType(d.getCurrentToken() || "text", i));
                };
                o.$matchTokenType = function(a, b) {
                    return b.indexOf(a.type || a) > -1;
                };
                o.recordAutoInsert = function(a, b, c) {
                    var d = a.getCursorPosition();
                    var e = b.doc.getLine(d.row);
                    if (!this.isAutoInsertedClosing(d, e, j.autoInsertedLineEnd[0])) j.autoInsertedBrackets = 0;
                    j.autoInsertedRow = d.row;
                    j.autoInsertedLineEnd = c + e.substr(d.column);
                    j.autoInsertedBrackets++;
                };
                o.recordMaybeInsert = function(a, b, c) {
                    var d = a.getCursorPosition();
                    var e = b.doc.getLine(d.row);
                    if (!this.isMaybeInsertedClosing(d, e)) j.maybeInsertedBrackets = 0;
                    j.maybeInsertedRow = d.row;
                    j.maybeInsertedLineStart = e.substr(0, d.column) + c;
                    j.maybeInsertedLineEnd = e.substr(d.column);
                    j.maybeInsertedBrackets++;
                };
                o.isAutoInsertedClosing = function(a, b, c) {
                    return (j.autoInsertedBrackets > 0 && a.row === j.autoInsertedRow && c === j.autoInsertedLineEnd[0] && b.substr(a.column) === j.autoInsertedLineEnd);
                };
                o.isMaybeInsertedClosing = function(a, b) {
                    return (j.maybeInsertedBrackets > 0 && a.row === j.maybeInsertedRow && b.substr(a.column) === j.maybeInsertedLineEnd && b.substr(0, a.column) == j.maybeInsertedLineStart);
                };
                o.popAutoInsertedClosing = function() {
                    j.autoInsertedLineEnd = j.autoInsertedLineEnd.substr(1);
                    j.autoInsertedBrackets--;
                };
                o.clearMaybeInsertedClosing = function() {
                    if (j) {
                        j.maybeInsertedBrackets = 0;
                        j.maybeInsertedRow = -1;
                    }
                };
                d.inherits(o, e);
                b.CstyleBehaviour = o;
            });
            ace.define("ace/unicode", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                var d = [
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
                var e = 0;
                var f = [];
                for(var g = 0; g < d.length; g += 2){
                    f.push((e += d[g]));
                    if (d[g + 1]) f.push(45, (e += d[g + 1]));
                }
                b.wordChars = String.fromCharCode.apply(null, f);
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
            ], function(a, b, c) {
                "use strict";
                var d = a("../config");
                var e = a("../tokenizer").Tokenizer;
                var f = a("./text_highlight_rules").TextHighlightRules;
                var g = a("./behaviour/cstyle").CstyleBehaviour;
                var h = a("../unicode");
                var i = a("../lib/lang");
                var j = a("../token_iterator").TokenIterator;
                var k = a("../range").Range;
                var l = function() {
                    this.HighlightRules = f;
                };
                (function() {
                    this.$defaultBehaviour = new g();
                    this.tokenRe = new RegExp("^[" + h.wordChars + "\\$_]+", "g");
                    this.nonTokenRe = new RegExp("^(?:[^" + h.wordChars + "\\$_]|\\s])+", "g");
                    this.getTokenizer = function() {
                        if (!this.$tokenizer) {
                            this.$highlightRules = this.$highlightRules || new this.HighlightRules(this.$highlightRuleConfig);
                            this.$tokenizer = new e(this.$highlightRules.getRules());
                        }
                        return this.$tokenizer;
                    };
                    this.lineCommentStart = "";
                    this.blockComment = "";
                    this.toggleCommentLines = function(a, b, c, d) {
                        var e = b.doc;
                        var f = true;
                        var g = true;
                        var h = Infinity;
                        var j = b.getTabSize();
                        var k = false;
                        if (!this.lineCommentStart) {
                            if (!this.blockComment) return false;
                            var l = this.blockComment.start;
                            var m = this.blockComment.end;
                            var n = new RegExp("^(\\s*)(?:" + i.escapeRegExp(l) + ")");
                            var o = new RegExp("(?:" + i.escapeRegExp(m) + ")\\s*$");
                            var p = function(a, b) {
                                if (r(a, b)) return;
                                if (!f || /\S/.test(a)) {
                                    e.insertInLine({
                                        row: b,
                                        column: a.length
                                    }, m);
                                    e.insertInLine({
                                        row: b,
                                        column: h
                                    }, l);
                                }
                            };
                            var q = function(a, b) {
                                var c;
                                if ((c = a.match(o))) e.removeInLine(b, a.length - c[0].length, a.length);
                                if ((c = a.match(n))) e.removeInLine(b, c[1].length, c[0].length);
                            };
                            var r = function(a, c) {
                                if (n.test(a)) return true;
                                var d = b.getTokens(c);
                                for(var e = 0; e < d.length; e++){
                                    if (d[e].type === "comment") return true;
                                }
                            };
                        } else {
                            if (Array.isArray(this.lineCommentStart)) {
                                var n = this.lineCommentStart.map(i.escapeRegExp).join("|");
                                var l = this.lineCommentStart[0];
                            } else {
                                var n = i.escapeRegExp(this.lineCommentStart);
                                var l = this.lineCommentStart;
                            }
                            n = new RegExp("^(\\s*)(?:" + n + ") ?");
                            k = b.getUseSoftTabs();
                            var q = function(a, b) {
                                var c = a.match(n);
                                if (!c) return;
                                var d = c[1].length, f = c[0].length;
                                if (!t(a, d, f) && c[0][f - 1] == " ") f--;
                                e.removeInLine(b, d, f);
                            };
                            var s = l + " ";
                            var p = function(a, b) {
                                if (!f || /\S/.test(a)) {
                                    if (t(a, h, h)) e.insertInLine({
                                        row: b,
                                        column: h
                                    }, s);
                                    else e.insertInLine({
                                        row: b,
                                        column: h
                                    }, l);
                                }
                            };
                            var r = function(a, b) {
                                return n.test(a);
                            };
                            var t = function(a, b, c) {
                                var d = 0;
                                while(b-- && a.charAt(b) == " ")d++;
                                if (d % j != 0) return false;
                                var d = 0;
                                while(a.charAt(c++) == " ")d++;
                                if (j > 2) return d % j != j - 1;
                                else return d % j == 0;
                            };
                        }
                        function u(a) {
                            for(var b = c; b <= d; b++)a(e.getLine(b), b);
                        }
                        var v = Infinity;
                        u(function(a, b) {
                            var c = a.search(/\S/);
                            if (c !== -1) {
                                if (c < h) h = c;
                                if (g && !r(a, b)) g = false;
                            } else if (v > a.length) {
                                v = a.length;
                            }
                        });
                        if (h == Infinity) {
                            h = v;
                            f = false;
                            g = false;
                        }
                        if (k && h % j != 0) h = Math.floor(h / j) * j;
                        u(g ? q : p);
                    };
                    this.toggleBlockComment = function(a, b, c, d) {
                        var e = this.blockComment;
                        if (!e) return;
                        if (!e.start && e[0]) e = e[0];
                        var f = new j(b, d.row, d.column);
                        var g = f.getCurrentToken();
                        var h = b.selection;
                        var i = b.selection.toOrientedRange();
                        var l, m;
                        if (g && /comment/.test(g.type)) {
                            var n, o;
                            while(g && /comment/.test(g.type)){
                                var p = g.value.indexOf(e.start);
                                if (p != -1) {
                                    var q = f.getCurrentTokenRow();
                                    var r = f.getCurrentTokenColumn() + p;
                                    n = new k(q, r, q, r + e.start.length);
                                    break;
                                }
                                g = f.stepBackward();
                            }
                            var f = new j(b, d.row, d.column);
                            var g = f.getCurrentToken();
                            while(g && /comment/.test(g.type)){
                                var p = g.value.indexOf(e.end);
                                if (p != -1) {
                                    var q = f.getCurrentTokenRow();
                                    var r = f.getCurrentTokenColumn() + p;
                                    o = new k(q, r, q, r + e.end.length);
                                    break;
                                }
                                g = f.stepForward();
                            }
                            if (o) b.remove(o);
                            if (n) {
                                b.remove(n);
                                l = n.start.row;
                                m = -e.start.length;
                            }
                        } else {
                            m = e.start.length;
                            l = c.start.row;
                            b.insert(c.end, e.end);
                            b.insert(c.start, e.start);
                        }
                        if (i.start.row == l) i.start.column += m;
                        if (i.end.row == l) i.end.column += m;
                        b.selection.fromOrientedRange(i);
                    };
                    this.getNextLineIndent = function(a, b, c) {
                        return this.$getIndent(b);
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
                    this.createModeDelegates = function(a) {
                        this.$embeds = [];
                        this.$modes = {};
                        for(var b in a){
                            if (a[b]) {
                                var c = a[b];
                                var e = c.prototype.$id;
                                var f = d.$modes[e];
                                if (!f) d.$modes[e] = f = new c();
                                if (!d.$modes[b]) d.$modes[b] = f;
                                this.$embeds.push(b);
                                this.$modes[b] = f;
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
                        for(var b = 0; b < g.length; b++){
                            (function(a) {
                                var c = g[b];
                                var d = a[c];
                                a[g[b]] = function() {
                                    return this.$delegator(c, arguments, d);
                                };
                            })(this);
                        }
                    };
                    this.$delegator = function(a, b, c) {
                        var d = b[0] || "start";
                        if (typeof d != "string") {
                            if (Array.isArray(d[2])) {
                                var e = d[2][d[2].length - 1];
                                var f = this.$modes[e];
                                if (f) return f[a].apply(f, [
                                    d[1]
                                ].concat([].slice.call(b, 1)));
                            }
                            d = d[0] || "start";
                        }
                        for(var g = 0; g < this.$embeds.length; g++){
                            if (!this.$modes[this.$embeds[g]]) continue;
                            var h = d.split(this.$embeds[g]);
                            if (!h[0] && h[1]) {
                                b[0] = h[1];
                                var f = this.$modes[this.$embeds[g]];
                                return f[a].apply(f, b);
                            }
                        }
                        var i = c.apply(this, b);
                        return c ? i : undefined;
                    };
                    this.transformAction = function(a, b, c, d, e) {
                        if (this.$behaviour) {
                            var f = this.$behaviour.getBehaviours();
                            for(var g in f){
                                if (f[g][b]) {
                                    var h = f[g][b].apply(this, arguments);
                                    if (h) {
                                        return h;
                                    }
                                }
                            }
                        }
                    };
                    this.getKeywords = function(a) {
                        if (!this.completionKeywords) {
                            var b = this.$tokenizer.rules;
                            var c = [];
                            for(var d in b){
                                var e = b[d];
                                for(var f = 0, g = e.length; f < g; f++){
                                    if (typeof e[f].token === "string") {
                                        if (/keyword|support|storage/.test(e[f].token)) c.push(e[f].regex);
                                    } else if (typeof e[f].token === "object") {
                                        for(var h = 0, i = e[f].token.length; h < i; h++){
                                            if (/keyword|support|storage/.test(e[f].token[h])) {
                                                var d = e[f].regex.match(/\(.+?\)/g)[h];
                                                c.push(d.substr(1, d.length - 2));
                                            }
                                        }
                                    }
                                }
                            }
                            this.completionKeywords = c;
                        }
                        if (!a) return this.$keywordList;
                        return c.concat(this.$keywordList || []);
                    };
                    this.$createKeywordList = function() {
                        if (!this.$highlightRules) this.getTokenizer();
                        return (this.$keywordList = this.$highlightRules.$keywordList || []);
                    };
                    this.getCompletions = function(a, b, c, d) {
                        var e = this.$keywordList || this.$createKeywordList();
                        return e.map(function(a) {
                            return {
                                name: a,
                                value: a,
                                score: 0,
                                meta: "keyword"
                            };
                        });
                    };
                    this.$id = "ace/mode/text";
                }.call(l.prototype));
                b.Mode = l;
            });
            ace.define("ace/apply_delta", [
                "require",
                "exports",
                "module"
            ], function(a, b, c) {
                "use strict";
                function d(a, b) {
                    console.log("Invalid Delta:", a);
                    throw "Invalid Delta: " + b;
                }
                function e(a, b) {
                    return (b.row >= 0 && b.row < a.length && b.column >= 0 && b.column <= a[b.row].length);
                }
                function f(a, b) {
                    if (b.action != "insert" && b.action != "remove") d(b, "delta.action must be 'insert' or 'remove'");
                    if (!(b.lines instanceof Array)) d(b, "delta.lines must be an Array");
                    if (!b.start || !b.end) d(b, "delta.start/end must be an present");
                    var c = b.start;
                    if (!e(a, b.start)) d(b, "delta.start must be contained in document");
                    var f = b.end;
                    if (b.action == "remove" && !e(a, f)) d(b, "delta.end must contained in document for 'remove' actions");
                    var g = f.row - c.row;
                    var h = f.column - (g == 0 ? c.column : 0);
                    if (g != b.lines.length - 1 || b.lines[g].length != h) d(b, "delta.range must match delta lines");
                }
                b.applyDelta = function(a, b, c) {
                    var d = b.start.row;
                    var e = b.start.column;
                    var f = a[d] || "";
                    switch(b.action){
                        case "insert":
                            var g = b.lines;
                            if (g.length === 1) {
                                a[d] = f.substring(0, e) + b.lines[0] + f.substring(e);
                            } else {
                                var h = [
                                    d,
                                    1
                                ].concat(b.lines);
                                a.splice.apply(a, h);
                                a[d] = f.substring(0, e) + a[d];
                                a[d + b.lines.length - 1] += f.substring(e);
                            }
                            break;
                        case "remove":
                            var i = b.end.column;
                            var j = b.end.row;
                            if (d === j) {
                                a[d] = f.substring(0, e) + f.substring(i);
                            } else {
                                a.splice(d, j - d + 1, f.substring(0, e) + a[j].substring(i));
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
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./lib/event_emitter").EventEmitter;
                var f = (b.Anchor = function(a, b, c) {
                    this.$onChange = this.onChange.bind(this);
                    this.attach(a);
                    if (typeof c == "undefined") this.setPosition(b.row, b.column);
                    else this.setPosition(b, c);
                });
                (function() {
                    d.implement(this, e);
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
                    function b(b, c, d) {
                        var e = b.action == "insert";
                        var f = (e ? 1 : -1) * (b.end.row - b.start.row);
                        var g = (e ? 1 : -1) * (b.end.column - b.start.column);
                        var h = b.start;
                        var i = e ? h : b.end;
                        if (a(c, h, d)) {
                            return {
                                row: c.row,
                                column: c.column
                            };
                        }
                        if (a(i, c, !d)) {
                            return {
                                row: c.row + f,
                                column: c.column + (c.row == i.row ? g : 0)
                            };
                        }
                        return {
                            row: h.row,
                            column: h.column
                        };
                    }
                    this.setPosition = function(a, b, c) {
                        var d;
                        if (c) {
                            d = {
                                row: a,
                                column: b
                            };
                        } else {
                            d = this.$clipPositionToDocument(a, b);
                        }
                        if (this.row == d.row && this.column == d.column) return;
                        var e = {
                            row: this.row,
                            column: this.column
                        };
                        this.row = d.row;
                        this.column = d.column;
                        this._signal("change", {
                            old: e,
                            value: d
                        });
                    };
                    this.detach = function() {
                        this.document.off("change", this.$onChange);
                    };
                    this.attach = function(a) {
                        this.document = a || this.document;
                        this.document.on("change", this.$onChange);
                    };
                    this.$clipPositionToDocument = function(a, b) {
                        var c = {};
                        if (a >= this.document.getLength()) {
                            c.row = Math.max(0, this.document.getLength() - 1);
                            c.column = this.document.getLine(c.row).length;
                        } else if (a < 0) {
                            c.row = 0;
                            c.column = 0;
                        } else {
                            c.row = a;
                            c.column = Math.min(this.document.getLine(c.row).length, Math.max(0, b));
                        }
                        if (b < 0) c.column = 0;
                        return c;
                    };
                }.call(f.prototype));
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
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./apply_delta").applyDelta;
                var f = a("./lib/event_emitter").EventEmitter;
                var g = a("./range").Range;
                var h = a("./anchor").Anchor;
                var i = function(a) {
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
                    d.implement(this, f);
                    this.setValue = function(a) {
                        var b = this.getLength() - 1;
                        this.remove(new g(0, 0, b, this.getLine(b).length));
                        this.insert({
                            row: 0,
                            column: 0
                        }, a);
                    };
                    this.getValue = function() {
                        return this.getAllLines().join(this.getNewLineCharacter());
                    };
                    this.createAnchor = function(a, b) {
                        return new h(this, a, b);
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
                    this.$detectNewLine = function(a) {
                        var b = a.match(/^.*?(\r\n|\r|\n)/m);
                        this.$autoNewLine = b ? b[1] : "\n";
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
                    this.insert = function(a, b) {
                        if (this.getLength() <= 1) this.$detectNewLine(b);
                        return this.insertMergedLines(a, this.$split(b));
                    };
                    this.insertInLine = function(a, b) {
                        var c = this.clippedPos(a.row, a.column);
                        var d = this.pos(a.row, a.column + b.length);
                        this.applyDelta({
                            start: c,
                            end: d,
                            action: "insert",
                            lines: [
                                b
                            ]
                        }, true);
                        return this.clonePos(d);
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
                    this.insertMergedLines = function(a, b) {
                        var c = this.clippedPos(a.row, a.column);
                        var d = {
                            row: c.row + b.length - 1,
                            column: (b.length == 1 ? c.column : 0) + b[b.length - 1].length
                        };
                        this.applyDelta({
                            start: c,
                            end: d,
                            action: "insert",
                            lines: b
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
                    this.removeInLine = function(a, b, c) {
                        var d = this.clippedPos(a, b);
                        var e = this.clippedPos(a, c);
                        this.applyDelta({
                            start: d,
                            end: e,
                            action: "remove",
                            lines: this.getLinesForRange({
                                start: d,
                                end: e
                            })
                        }, true);
                        return this.clonePos(d);
                    };
                    this.removeFullLines = function(a, b) {
                        a = Math.min(Math.max(0, a), this.getLength() - 1);
                        b = Math.min(Math.max(0, b), this.getLength() - 1);
                        var c = b == this.getLength() - 1 && a > 0;
                        var d = b < this.getLength() - 1;
                        var e = c ? a - 1 : a;
                        var f = c ? this.getLine(e).length : 0;
                        var h = d ? b + 1 : b;
                        var i = d ? 0 : this.getLine(h).length;
                        var j = new g(e, f, h, i);
                        var k = this.$lines.slice(a, b + 1);
                        this.applyDelta({
                            start: j.start,
                            end: j.end,
                            action: "remove",
                            lines: this.getLinesForRange(j)
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
                        if (!(a instanceof g)) a = g.fromPoints(a.start, a.end);
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
                    this.applyDeltas = function(a) {
                        for(var b = 0; b < a.length; b++){
                            this.applyDelta(a[b]);
                        }
                    };
                    this.revertDeltas = function(a) {
                        for(var b = a.length - 1; b >= 0; b--){
                            this.revertDelta(a[b]);
                        }
                    };
                    this.applyDelta = function(a, b) {
                        var c = a.action == "insert";
                        if (c ? a.lines.length <= 1 && !a.lines[0] : !g.comparePoints(a.start, a.end)) {
                            return;
                        }
                        if (c && a.lines.length > 20000) {
                            this.$splitAndapplyLargeDelta(a, 20000);
                        } else {
                            e(this.$lines, a, b);
                            this._signal("change", a);
                        }
                    };
                    this.$safeApplyDelta = function(a) {
                        var b = this.$lines.length;
                        if ((a.action == "remove" && a.start.row < b && a.end.row < b) || (a.action == "insert" && a.start.row <= b)) {
                            this.applyDelta(a);
                        }
                    };
                    this.$splitAndapplyLargeDelta = function(a, b) {
                        var c = a.lines;
                        var d = c.length - b + 1;
                        var e = a.start.row;
                        var f = a.start.column;
                        for(var g = 0, h = 0; g < d; g = h){
                            h += b - 1;
                            var i = c.slice(g, h);
                            i.push("");
                            this.applyDelta({
                                start: this.pos(e + g, f),
                                end: this.pos(e + h, (f = 0)),
                                action: a.action,
                                lines: i
                            }, true);
                        }
                        a.lines = c.slice(g);
                        a.start.row = e + g;
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
                    this.indexToPosition = function(a, b) {
                        var c = this.$lines || this.getAllLines();
                        var d = this.getNewLineCharacter().length;
                        for(var e = b || 0, f = c.length; e < f; e++){
                            a -= c[e].length + d;
                            if (a < 0) return {
                                row: e,
                                column: a + c[e].length + d
                            };
                        }
                        return {
                            row: f - 1,
                            column: a + c[f - 1].length + d
                        };
                    };
                    this.positionToIndex = function(a, b) {
                        var c = this.$lines || this.getAllLines();
                        var d = this.getNewLineCharacter().length;
                        var e = 0;
                        var f = Math.min(a.row, c.length);
                        for(var g = b || 0; g < f; ++g)e += c[g].length + d;
                        return e + a.column;
                    };
                }.call(i.prototype));
                b.Document = i;
            });
            ace.define("ace/background_tokenizer", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./lib/event_emitter").EventEmitter;
                var f = function(a, b) {
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
                        var a = new Date();
                        var b = c.currentLine;
                        var d = -1;
                        var e = c.doc;
                        var f = b;
                        while(c.lines[b])b++;
                        var g = e.getLength();
                        var h = 0;
                        c.running = false;
                        while(b < g){
                            c.$tokenizeRow(b);
                            d = b;
                            do {
                                b++;
                            }while (c.lines[b])
                            h++;
                            if (h % 5 === 0 && new Date() - a > 20) {
                                c.running = setTimeout(c.$worker, 20);
                                break;
                            }
                        }
                        c.currentLine = b;
                        if (d == -1) d = b;
                        if (f <= d) c.fireUpdateEvent(f, d);
                    };
                };
                (function() {
                    d.implement(this, e);
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
                    this.$updateOnChange = function(a) {
                        var b = a.start.row;
                        var c = a.end.row - b;
                        if (c === 0) {
                            this.lines[b] = null;
                        } else if (a.action == "remove") {
                            this.lines.splice(b, c + 1, null);
                            this.states.splice(b, c + 1, null);
                        } else {
                            var d = Array(c + 1);
                            d.unshift(b, 1);
                            this.lines.splice.apply(this.lines, d);
                            this.states.splice.apply(this.states, d);
                        }
                        this.currentLine = Math.min(b, this.currentLine, this.doc.getLength());
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
                        var b = this.doc.getLine(a);
                        var c = this.states[a - 1];
                        var d = this.tokenizer.getLineTokens(b, c, a);
                        if (this.states[a] + "" !== d.state + "") {
                            this.states[a] = d.state;
                            this.lines[a + 1] = null;
                            if (this.currentLine > a + 1) this.currentLine = a + 1;
                        } else if (this.currentLine == a) {
                            this.currentLine = a + 1;
                        }
                        return (this.lines[a] = d.tokens);
                    };
                }.call(f.prototype));
                b.BackgroundTokenizer = f;
            });
            ace.define("ace/search_highlight", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/lang");
                var e = a("./lib/oop");
                var f = a("./range").Range;
                var g = function(a, b, c) {
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
                    this.update = function(a, b, c, e) {
                        if (!this.regExp) return;
                        var g = e.firstRow, h = e.lastRow;
                        for(var i = g; i <= h; i++){
                            var j = this.cache[i];
                            if (j == null) {
                                j = d.getMatchOffsets(c.getLine(i), this.regExp);
                                if (j.length > this.MAX_RANGES) j = j.slice(0, this.MAX_RANGES);
                                j = j.map(function(a) {
                                    return new f(i, a.offset, i, a.offset + a.length);
                                });
                                this.cache[i] = j.length ? j : "";
                            }
                            for(var k = j.length; k--;){
                                b.drawSingleLineMarker(a, j[k].toScreenRange(c), this.clazz, e);
                            }
                        }
                    };
                }.call(g.prototype));
                b.SearchHighlight = g;
            });
            ace.define("ace/edit_session/fold_line", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(a, b, c) {
                "use strict";
                var d = a("../range").Range;
                function e(a, b) {
                    this.foldData = a;
                    if (Array.isArray(b)) {
                        this.folds = b;
                    } else {
                        b = this.folds = [
                            b
                        ];
                    }
                    var c = b[b.length - 1];
                    this.range = new d(b[0].start.row, b[0].start.column, c.end.row, c.end.column);
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
                            this.folds.sort(function(a, b) {
                                return -a.range.compareEnd(b.start.row, b.start.column);
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
                    this.walk = function(a, b, c) {
                        var d = 0, e = this.folds, f, g, h, i = true;
                        if (b == null) {
                            b = this.end.row;
                            c = this.end.column;
                        }
                        for(var j = 0; j < e.length; j++){
                            f = e[j];
                            g = f.range.compareStart(b, c);
                            if (g == -1) {
                                a(null, b, c, d, i);
                                return;
                            }
                            h = a(null, f.start.row, f.start.column, d, i);
                            h = !h && a(f.placeholder, f.start.row, f.start.column, d);
                            if (h || g === 0) {
                                return;
                            }
                            i = !f.sameRow;
                            d = f.end.column;
                        }
                        a(null, b, c, d, i);
                    };
                    this.getNextFoldTo = function(a, b) {
                        var c, d;
                        for(var e = 0; e < this.folds.length; e++){
                            c = this.folds[e];
                            d = c.range.compareEnd(a, b);
                            if (d == -1) {
                                return {
                                    fold: c,
                                    kind: "after"
                                };
                            } else if (d === 0) {
                                return {
                                    fold: c,
                                    kind: "inside"
                                };
                            }
                        }
                        return null;
                    };
                    this.addRemoveChars = function(a, b, c) {
                        var d = this.getNextFoldTo(a, b), e, f;
                        if (d) {
                            e = d.fold;
                            if (d.kind == "inside" && e.start.column != b && e.start.row != a) {
                                window.console && window.console.log(a, b, e);
                            } else if (e.start.row == a) {
                                f = this.folds;
                                var g = f.indexOf(e);
                                if (g === 0) {
                                    this.start.column += c;
                                }
                                for(g; g < f.length; g++){
                                    e = f[g];
                                    e.start.column += c;
                                    if (!e.sameRow) {
                                        return;
                                    }
                                    e.end.column += c;
                                }
                                this.end.column += c;
                            }
                        }
                    };
                    this.split = function(a, b) {
                        var c = this.getNextFoldTo(a, b);
                        if (!c || c.kind == "inside") return null;
                        var d = c.fold;
                        var f = this.folds;
                        var g = this.foldData;
                        var h = f.indexOf(d);
                        var i = f[h - 1];
                        this.end.row = i.end.row;
                        this.end.column = i.end.column;
                        f = f.splice(h, f.length - h);
                        var j = new e(g, f);
                        g.splice(g.indexOf(this) + 1, 0, j);
                        return j;
                    };
                    this.merge = function(a) {
                        var b = a.folds;
                        for(var c = 0; c < b.length; c++){
                            this.addFold(b[c]);
                        }
                        var d = this.foldData;
                        d.splice(d.indexOf(a), 1);
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
                        var b = 0;
                        for(var c = 0; c < this.folds.length; c++){
                            var d = this.folds[c];
                            a -= d.start.column - b;
                            if (a < 0) {
                                return {
                                    row: d.start.row,
                                    column: d.start.column + a
                                };
                            }
                            a -= d.placeholder.length;
                            if (a < 0) {
                                return d.start;
                            }
                            b = d.end.column;
                        }
                        return {
                            row: this.end.row,
                            column: this.end.column + a
                        };
                    };
                }.call(e.prototype));
                b.FoldLine = e;
            });
            ace.define("ace/range_list", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(a, b, c) {
                "use strict";
                var d = a("./range").Range;
                var e = d.comparePoints;
                var f = function() {
                    this.ranges = [];
                    this.$bias = 1;
                };
                (function() {
                    this.comparePoints = e;
                    this.pointIndex = function(a, b, c) {
                        var d = this.ranges;
                        for(var f = c || 0; f < d.length; f++){
                            var g = d[f];
                            var h = e(a, g.end);
                            if (h > 0) continue;
                            var i = e(a, g.start);
                            if (h === 0) return b && i !== 0 ? -f - 2 : f;
                            if (i > 0 || (i === 0 && !b)) return f;
                            return -f - 1;
                        }
                        return -f - 1;
                    };
                    this.add = function(a) {
                        var b = !a.isEmpty();
                        var c = this.pointIndex(a.start, b);
                        if (c < 0) c = -c - 1;
                        var d = this.pointIndex(a.end, b, c);
                        if (d < 0) d = -d - 1;
                        else d++;
                        return this.ranges.splice(c, d - c, a);
                    };
                    this.addList = function(a) {
                        var b = [];
                        for(var c = a.length; c--;){
                            b.push.apply(b, this.add(a[c]));
                        }
                        return b;
                    };
                    this.substractPoint = function(a) {
                        var b = this.pointIndex(a);
                        if (b >= 0) return this.ranges.splice(b, 1);
                    };
                    this.merge = function() {
                        var a = [];
                        var b = this.ranges;
                        b = b.sort(function(a, b) {
                            return e(a.start, b.start);
                        });
                        var c = b[0], d;
                        for(var f = 1; f < b.length; f++){
                            d = c;
                            c = b[f];
                            var g = e(d.end, c.start);
                            if (g < 0) continue;
                            if (g == 0 && !d.isEmpty() && !c.isEmpty()) continue;
                            if (e(d.end, c.end) < 0) {
                                d.end.row = c.end.row;
                                d.end.column = c.end.column;
                            }
                            b.splice(f, 1);
                            a.push(c);
                            c = d;
                            f--;
                        }
                        this.ranges = b;
                        return a;
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
                    this.rangeAtPoint = function(a) {
                        var b = this.pointIndex(a);
                        if (b >= 0) return this.ranges[b];
                    };
                    this.clipRows = function(a, b) {
                        var c = this.ranges;
                        if (c[0].start.row > b || c[c.length - 1].start.row < a) return [];
                        var d = this.pointIndex({
                            row: a,
                            column: 0
                        });
                        if (d < 0) d = -d - 1;
                        var e = this.pointIndex({
                            row: b,
                            column: 0
                        }, d);
                        if (e < 0) e = -e - 1;
                        var f = [];
                        for(var g = d; g < e; g++){
                            f.push(c[g]);
                        }
                        return f;
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
                    this.$onChange = function(a) {
                        var b = a.start;
                        var c = a.end;
                        var d = b.row;
                        var e = c.row;
                        var f = this.ranges;
                        for(var g = 0, h = f.length; g < h; g++){
                            var i = f[g];
                            if (i.end.row >= d) break;
                        }
                        if (a.action == "insert") {
                            var j = e - d;
                            var k = -b.column + c.column;
                            for(; g < h; g++){
                                var i = f[g];
                                if (i.start.row > d) break;
                                if (i.start.row == d && i.start.column >= b.column) {
                                    if (i.start.column == b.column && this.$bias <= 0) {} else {
                                        i.start.column += k;
                                        i.start.row += j;
                                    }
                                }
                                if (i.end.row == d && i.end.column >= b.column) {
                                    if (i.end.column == b.column && this.$bias < 0) {
                                        continue;
                                    }
                                    if (i.end.column == b.column && k > 0 && g < h - 1) {
                                        if (i.end.column > i.start.column && i.end.column == f[g + 1].start.column) i.end.column -= k;
                                    }
                                    i.end.column += k;
                                    i.end.row += j;
                                }
                            }
                        } else {
                            var j = d - e;
                            var k = b.column - c.column;
                            for(; g < h; g++){
                                var i = f[g];
                                if (i.start.row > e) break;
                                if (i.end.row < e && (d < i.end.row || (d == i.end.row && b.column < i.end.column))) {
                                    i.end.row = d;
                                    i.end.column = b.column;
                                } else if (i.end.row == e) {
                                    if (i.end.column <= c.column) {
                                        if (j || i.end.column > b.column) {
                                            i.end.column = b.column;
                                            i.end.row = b.row;
                                        }
                                    } else {
                                        i.end.column += k;
                                        i.end.row += j;
                                    }
                                } else if (i.end.row > e) {
                                    i.end.row += j;
                                }
                                if (i.start.row < e && (d < i.start.row || (d == i.start.row && b.column < i.start.column))) {
                                    i.start.row = d;
                                    i.start.column = b.column;
                                } else if (i.start.row == e) {
                                    if (i.start.column <= c.column) {
                                        if (j || i.start.column > b.column) {
                                            i.start.column = b.column;
                                            i.start.row = b.row;
                                        }
                                    } else {
                                        i.start.column += k;
                                        i.start.row += j;
                                    }
                                } else if (i.start.row > e) {
                                    i.start.row += j;
                                }
                            }
                        }
                        if (j != 0 && g < h) {
                            for(; g < h; g++){
                                var i = f[g];
                                i.start.row += j;
                                i.end.row += j;
                            }
                        }
                    };
                }.call(f.prototype));
                b.RangeList = f;
            });
            ace.define("ace/edit_session/fold", [
                "require",
                "exports",
                "module",
                "ace/range_list",
                "ace/lib/oop", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../range_list").RangeList;
                var e = a("../lib/oop");
                var f = (b.Fold = function(a, b) {
                    this.foldLine = null;
                    this.placeholder = b;
                    this.range = a;
                    this.start = a.start;
                    this.end = a.end;
                    this.sameRow = a.start.row == a.end.row;
                    this.subFolds = this.ranges = [];
                });
                e.inherits(f, d);
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
                        var a = this.range.clone();
                        var b = new f(a, this.placeholder);
                        this.subFolds.forEach(function(a) {
                            b.subFolds.push(a.clone());
                        });
                        b.collapseChildren = this.collapseChildren;
                        return b;
                    };
                    this.addSubFold = function(a) {
                        if (this.range.isEqual(a)) return;
                        h(a, this.start);
                        var b = a.start.row, c = a.start.column;
                        for(var d = 0, e = -1; d < this.subFolds.length; d++){
                            e = this.subFolds[d].range.compare(b, c);
                            if (e != 1) break;
                        }
                        var f = this.subFolds[d];
                        var g = 0;
                        if (e == 0) {
                            if (f.range.containsRange(a)) return f.addSubFold(a);
                            else g = 1;
                        }
                        var b = a.range.end.row, c = a.range.end.column;
                        for(var i = d, e = -1; i < this.subFolds.length; i++){
                            e = this.subFolds[i].range.compare(b, c);
                            if (e != 1) break;
                        }
                        if (e == 0) i++;
                        var j = this.subFolds.splice(d, i - d, a);
                        var k = e == 0 ? j.length - 1 : j.length;
                        for(var l = g; l < k; l++){
                            a.addSubFold(j[l]);
                        }
                        a.setFoldLine(this.foldLine);
                        return a;
                    };
                    this.restoreRange = function(a) {
                        return j(a, this.start);
                    };
                }.call(f.prototype));
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
            ], function(a, b, c) {
                "use strict";
                var d = a("../range").Range;
                var e = a("./fold_line").FoldLine;
                var f = a("./fold").Fold;
                var g = a("../token_iterator").TokenIterator;
                function h() {
                    this.getFoldAt = function(a, b, c) {
                        var d = this.getFoldLine(a);
                        if (!d) return null;
                        var e = d.folds;
                        for(var f = 0; f < e.length; f++){
                            var g = e[f].range;
                            if (g.contains(a, b)) {
                                if (c == 1 && g.isEnd(a, b) && !g.isEmpty()) {
                                    continue;
                                } else if (c == -1 && g.isStart(a, b) && !g.isEmpty()) {
                                    continue;
                                }
                                return e[f];
                            }
                        }
                    };
                    this.getFoldsInRange = function(a) {
                        var b = a.start;
                        var c = a.end;
                        var d = this.$foldData;
                        var e = [];
                        b.column += 1;
                        c.column -= 1;
                        for(var f = 0; f < d.length; f++){
                            var g = d[f].range.compareRange(a);
                            if (g == 2) {
                                continue;
                            } else if (g == -2) {
                                break;
                            }
                            var h = d[f].folds;
                            for(var i = 0; i < h.length; i++){
                                var j = h[i];
                                g = j.range.compareRange(a);
                                if (g == -2) {
                                    break;
                                } else if (g == 2) {
                                    continue;
                                } else if (g == 42) {
                                    break;
                                }
                                e.push(j);
                            }
                        }
                        b.column -= 1;
                        c.column += 1;
                        return e;
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
                        var a = [];
                        var b = this.$foldData;
                        for(var c = 0; c < b.length; c++)for(var d = 0; d < b[c].folds.length; d++)a.push(b[c].folds[d]);
                        return a;
                    };
                    this.getFoldStringAt = function(a, b, c, d) {
                        d = d || this.getFoldLine(a);
                        if (!d) return null;
                        var e = {
                            end: {
                                column: 0
                            }
                        };
                        var f, g;
                        for(var h = 0; h < d.folds.length; h++){
                            g = d.folds[h];
                            var i = g.range.compareEnd(a, b);
                            if (i == -1) {
                                f = this.getLine(g.start.row).substring(e.end.column, g.start.column);
                                break;
                            } else if (i === 0) {
                                return null;
                            }
                            e = g;
                        }
                        if (!f) f = this.getLine(g.start.row).substring(e.end.column);
                        if (c == -1) return f.substring(0, b - e.end.column);
                        else if (c == 1) return f.substring(b - e.end.column);
                        else return f;
                    };
                    this.getFoldLine = function(a, b) {
                        var c = this.$foldData;
                        var d = 0;
                        if (b) d = c.indexOf(b);
                        if (d == -1) d = 0;
                        for(d; d < c.length; d++){
                            var e = c[d];
                            if (e.start.row <= a && e.end.row >= a) {
                                return e;
                            } else if (e.end.row > a) {
                                return null;
                            }
                        }
                        return null;
                    };
                    this.getNextFoldLine = function(a, b) {
                        var c = this.$foldData;
                        var d = 0;
                        if (b) d = c.indexOf(b);
                        if (d == -1) d = 0;
                        for(d; d < c.length; d++){
                            var e = c[d];
                            if (e.end.row >= a) {
                                return e;
                            }
                        }
                        return null;
                    };
                    this.getFoldedRowCount = function(a, b) {
                        var c = this.$foldData, d = b - a + 1;
                        for(var e = 0; e < c.length; e++){
                            var f = c[e], g = f.end.row, h = f.start.row;
                            if (g >= b) {
                                if (h < b) {
                                    if (h >= a) d -= b - h;
                                    else d = 0;
                                }
                                break;
                            } else if (g >= a) {
                                if (h >= a) d -= g - h;
                                else d -= g - a + 1;
                            }
                        }
                        return d;
                    };
                    this.$addFoldLine = function(a) {
                        this.$foldData.push(a);
                        this.$foldData.sort(function(a, b) {
                            return a.start.row - b.start.row;
                        });
                        return a;
                    };
                    this.addFold = function(a, b) {
                        var c = this.$foldData;
                        var d = false;
                        var g;
                        if (a instanceof f) g = a;
                        else {
                            g = new f(b, a);
                            g.collapseChildren = b.collapseChildren;
                        }
                        this.$clipRangeToDocument(g.range);
                        var h = g.start.row;
                        var i = g.start.column;
                        var j = g.end.row;
                        var k = g.end.column;
                        var l = this.getFoldAt(h, i, 1);
                        var m = this.getFoldAt(j, k, -1);
                        if (l && m == l) return l.addSubFold(g);
                        if (l && !l.range.isStart(h, i)) this.removeFold(l);
                        if (m && !m.range.isEnd(j, k)) this.removeFold(m);
                        var n = this.getFoldsInRange(g.range);
                        if (n.length > 0) {
                            this.removeFolds(n);
                            if (!g.collapseChildren) {
                                n.forEach(function(a) {
                                    g.addSubFold(a);
                                });
                            }
                        }
                        for(var o = 0; o < c.length; o++){
                            var p = c[o];
                            if (j == p.start.row) {
                                p.addFold(g);
                                d = true;
                                break;
                            } else if (h == p.end.row) {
                                p.addFold(g);
                                d = true;
                                if (!g.sameRow) {
                                    var q = c[o + 1];
                                    if (q && q.start.row == j) {
                                        p.merge(q);
                                        break;
                                    }
                                }
                                break;
                            } else if (j <= p.start.row) {
                                break;
                            }
                        }
                        if (!d) p = this.$addFoldLine(new e(this.$foldData, g));
                        if (this.$useWrapMode) this.$updateWrapData(p.start.row, p.start.row);
                        else this.$updateRowLengthCache(p.start.row, p.start.row);
                        this.$modified = true;
                        this._signal("changeFold", {
                            data: g,
                            action: "add"
                        });
                        return g;
                    };
                    this.addFolds = function(a) {
                        a.forEach(function(a) {
                            this.addFold(a);
                        }, this);
                    };
                    this.removeFold = function(a) {
                        var b = a.foldLine;
                        var c = b.start.row;
                        var d = b.end.row;
                        var e = this.$foldData;
                        var f = b.folds;
                        if (f.length == 1) {
                            e.splice(e.indexOf(b), 1);
                        } else if (b.range.isEnd(a.end.row, a.end.column)) {
                            f.pop();
                            b.end.row = f[f.length - 1].end.row;
                            b.end.column = f[f.length - 1].end.column;
                        } else if (b.range.isStart(a.start.row, a.start.column)) {
                            f.shift();
                            b.start.row = f[0].start.row;
                            b.start.column = f[0].start.column;
                        } else if (a.sameRow) {
                            f.splice(f.indexOf(a), 1);
                        } else {
                            var g = b.split(a.start.row, a.start.column);
                            f = g.folds;
                            f.shift();
                            g.start.row = f[0].start.row;
                            g.start.column = f[0].start.column;
                        }
                        if (!this.$updating) {
                            if (this.$useWrapMode) this.$updateWrapData(c, d);
                            else this.$updateRowLengthCache(c, d);
                        }
                        this.$modified = true;
                        this._signal("changeFold", {
                            data: a,
                            action: "remove"
                        });
                    };
                    this.removeFolds = function(a) {
                        var b = [];
                        for(var c = 0; c < a.length; c++){
                            b.push(a[c]);
                        }
                        b.forEach(function(a) {
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
                    this.unfold = function(a, b) {
                        var c, e;
                        if (a == null) {
                            c = new d(0, 0, this.getLength(), 0);
                            if (b == null) b = true;
                        } else if (typeof a == "number") {
                            c = new d(a, 0, a, this.getLine(a).length);
                        } else if ("row" in a) {
                            c = d.fromPoints(a, a);
                        } else if (Array.isArray(a)) {
                            e = [];
                            a.forEach(function(a) {
                                e = e.concat(this.unfold(a));
                            }, this);
                            return e;
                        } else {
                            c = a;
                        }
                        e = this.getFoldsInRangeList(c);
                        var f = e;
                        while(e.length == 1 && d.comparePoints(e[0].start, c.start) < 0 && d.comparePoints(e[0].end, c.end) > 0){
                            this.expandFolds(e);
                            e = this.getFoldsInRangeList(c);
                        }
                        if (b != false) {
                            this.removeFolds(e);
                        } else {
                            this.expandFolds(e);
                        }
                        if (f.length) return f;
                    };
                    this.isRowFolded = function(a, b) {
                        return !!this.getFoldLine(a, b);
                    };
                    this.getRowFoldEnd = function(a, b) {
                        var c = this.getFoldLine(a, b);
                        return c ? c.end.row : a;
                    };
                    this.getRowFoldStart = function(a, b) {
                        var c = this.getFoldLine(a, b);
                        return c ? c.start.row : a;
                    };
                    this.getFoldDisplayLine = function(a, b, c, d, e) {
                        if (d == null) d = a.start.row;
                        if (e == null) e = 0;
                        if (b == null) b = a.end.row;
                        if (c == null) c = this.getLine(b).length;
                        var f = this.doc;
                        var g = "";
                        a.walk(function(a, b, c, h) {
                            if (b < d) return;
                            if (b == d) {
                                if (c < e) return;
                                h = Math.max(e, h);
                            }
                            if (a != null) {
                                g += a;
                            } else {
                                g += f.getLine(b).substring(h, c);
                            }
                        }, b, c);
                        return g;
                    };
                    this.getDisplayLine = function(a, b, c, d) {
                        var e = this.getFoldLine(a);
                        if (!e) {
                            var f;
                            f = this.doc.getLine(a);
                            return f.substring(d || 0, b || f.length);
                        } else {
                            return this.getFoldDisplayLine(e, a, b, c, d);
                        }
                    };
                    this.$cloneFoldData = function() {
                        var a = [];
                        a = this.$foldData.map(function(b) {
                            var c = b.folds.map(function(a) {
                                return a.clone();
                            });
                            return new e(a, c);
                        });
                        return a;
                    };
                    this.toggleFold = function(a) {
                        var b = this.selection;
                        var c = b.getRange();
                        var d;
                        var e;
                        if (c.isEmpty()) {
                            var f = c.start;
                            d = this.getFoldAt(f.row, f.column);
                            if (d) {
                                this.expandFold(d);
                                return;
                            } else if ((e = this.findMatchingBracket(f))) {
                                if (c.comparePoint(e) == 1) {
                                    c.end = e;
                                } else {
                                    c.start = e;
                                    c.start.column++;
                                    c.end.column--;
                                }
                            } else if ((e = this.findMatchingBracket({
                                row: f.row,
                                column: f.column + 1
                            }))) {
                                if (c.comparePoint(e) == 1) c.end = e;
                                else c.start = e;
                                c.start.column++;
                            } else {
                                c = this.getCommentFoldRange(f.row, f.column) || c;
                            }
                        } else {
                            var g = this.getFoldsInRange(c);
                            if (a && g.length) {
                                this.expandFolds(g);
                                return;
                            } else if (g.length == 1) {
                                d = g[0];
                            }
                        }
                        if (!d) d = this.getFoldAt(c.start.row, c.start.column);
                        if (d && d.range.toString() == c.toString()) {
                            this.expandFold(d);
                            return;
                        }
                        var h = "...";
                        if (!c.isMultiLine()) {
                            h = this.getTextRange(c);
                            if (h.length < 4) return;
                            h = h.trim().substring(0, 2) + "..";
                        }
                        this.addFold(h, c);
                    };
                    this.getCommentFoldRange = function(a, b, c) {
                        var e = new g(this, a, b);
                        var f = e.getCurrentToken();
                        var h = f && f.type;
                        if (f && /^comment|string/.test(h)) {
                            h = h.match(/comment|string/)[0];
                            if (h == "comment") h += "|doc-start";
                            var i = new RegExp(h);
                            var j = new d();
                            if (c != 1) {
                                do {
                                    f = e.stepBackward();
                                }while (f && i.test(f.type))
                                e.stepForward();
                            }
                            j.start.row = e.getCurrentTokenRow();
                            j.start.column = e.getCurrentTokenColumn() + 2;
                            e = new g(this, a, b);
                            if (c != -1) {
                                var k = -1;
                                do {
                                    f = e.stepForward();
                                    if (k == -1) {
                                        var l = this.getState(e.$row);
                                        if (!i.test(l)) k = e.$row;
                                    } else if (e.$row > k) {
                                        break;
                                    }
                                }while (f && i.test(f.type))
                                f = e.stepBackward();
                            } else f = e.getCurrentToken();
                            j.end.row = e.getCurrentTokenRow();
                            j.end.column = e.getCurrentTokenColumn() + f.value.length - 2;
                            return j;
                        }
                    };
                    this.foldAll = function(a, b, c, d) {
                        if (c == undefined) c = 100000;
                        var e = this.foldWidgets;
                        if (!e) return;
                        b = b || this.getLength();
                        a = a || 0;
                        for(var f = a; f < b; f++){
                            if (e[f] == null) e[f] = this.getFoldWidget(f);
                            if (e[f] != "start") continue;
                            if (d && !d(f)) continue;
                            var g = this.getFoldWidgetRange(f);
                            if (g && g.isMultiLine() && g.end.row <= b && g.start.row >= a) {
                                f = g.end.row;
                                g.collapseChildren = c;
                                this.addFold("...", g);
                            }
                        }
                    };
                    this.foldToLevel = function(a) {
                        this.foldAll();
                        while(a-- > 0)this.unfold(null, false);
                    };
                    this.foldAllComments = function() {
                        var a = this;
                        this.foldAll(null, null, null, function(b) {
                            var c = a.getTokens(b);
                            for(var d = 0; d < c.length; d++){
                                var e = c[d];
                                if (e.type == "text" && /^\s+$/.test(e.value)) continue;
                                if (/comment/.test(e.type)) return true;
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
                    this.getParentFoldRangeData = function(a, b) {
                        var c = this.foldWidgets;
                        if (!c || (b && c[a])) return {};
                        var d = a - 1, e;
                        while(d >= 0){
                            var f = c[d];
                            if (f == null) f = c[d] = this.getFoldWidget(d);
                            if (f == "start") {
                                var g = this.getFoldWidgetRange(d);
                                if (!e) e = g;
                                if (g && g.end.row >= a) break;
                            }
                            d--;
                        }
                        return {
                            range: d !== -1 && g,
                            firstRange: e
                        };
                    };
                    this.onFoldWidgetClick = function(a, b) {
                        b = b.domEvent;
                        var c = {
                            children: b.shiftKey,
                            all: b.ctrlKey || b.metaKey,
                            siblings: b.altKey
                        };
                        var d = this.$toggleFoldWidget(a, c);
                        if (!d) {
                            var e = b.target || b.srcElement;
                            if (e && /ace_fold-widget/.test(e.className)) e.className += " ace_invalid";
                        }
                    };
                    this.$toggleFoldWidget = function(a, b) {
                        if (!this.getFoldWidget) return;
                        var c = this.getFoldWidget(a);
                        var d = this.getLine(a);
                        var e = c === "end" ? -1 : 1;
                        var f = this.getFoldAt(a, e === -1 ? 0 : d.length, e);
                        if (f) {
                            if (b.children || b.all) this.removeFold(f);
                            else this.expandFold(f);
                            return f;
                        }
                        var g = this.getFoldWidgetRange(a, true);
                        if (g && !g.isMultiLine()) {
                            f = this.getFoldAt(g.start.row, g.start.column, 1);
                            if (f && g.isEqual(f.range)) {
                                this.removeFold(f);
                                return f;
                            }
                        }
                        if (b.siblings) {
                            var h = this.getParentFoldRangeData(a);
                            if (h.range) {
                                var i = h.range.start.row + 1;
                                var j = h.range.end.row;
                            }
                            this.foldAll(i, j, b.all ? 10000 : 0);
                        } else if (b.children) {
                            j = g ? g.end.row : this.getLength();
                            this.foldAll(a + 1, j, b.all ? 10000 : 0);
                        } else if (g) {
                            if (b.all) g.collapseChildren = 10000;
                            this.addFold("...", g);
                        }
                        return g;
                    };
                    this.toggleFoldWidget = function(a) {
                        var b = this.selection.getCursor().row;
                        b = this.getRowFoldStart(b);
                        var c = this.$toggleFoldWidget(b, {});
                        if (c) return;
                        var d = this.getParentFoldRangeData(b, true);
                        c = d.range || d.firstRange;
                        if (c) {
                            b = c.start.row;
                            var e = this.getFoldAt(b, this.getLine(b).length, 1);
                            if (e) {
                                this.removeFold(e);
                            } else {
                                this.addFold("...", c);
                            }
                        }
                    };
                    this.updateFoldWidgets = function(a) {
                        var b = a.start.row;
                        var c = a.end.row - b;
                        if (c === 0) {
                            this.foldWidgets[b] = null;
                        } else if (a.action == "remove") {
                            this.foldWidgets.splice(b, c + 1, null);
                        } else {
                            var d = Array(c + 1);
                            d.unshift(b, 1);
                            this.foldWidgets.splice.apply(this.foldWidgets, d);
                        }
                    };
                    this.tokenizerUpdateFoldWidgets = function(a) {
                        var b = a.data;
                        if (b.first != b.last) {
                            if (this.foldWidgets.length > b.first) this.foldWidgets.splice(b.first, this.foldWidgets.length);
                        }
                    };
                }
                b.Folding = h;
            });
            ace.define("ace/edit_session/bracket_match", [
                "require",
                "exports",
                "module",
                "ace/token_iterator",
                "ace/range", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../token_iterator").TokenIterator;
                var e = a("../range").Range;
                function f() {
                    this.findMatchingBracket = function(a, b) {
                        if (a.column == 0) return null;
                        var c = b || this.getLine(a.row).charAt(a.column - 1);
                        if (c == "") return null;
                        var d = c.match(/([\(\[\{])|([\)\]\}])/);
                        if (!d) return null;
                        if (d[1]) return this.$findClosingBracket(d[1], a);
                        else return this.$findOpeningBracket(d[2], a);
                    };
                    this.getBracketRange = function(a) {
                        var b = this.getLine(a.row);
                        var c = true, d;
                        var f = b.charAt(a.column - 1);
                        var g = f && f.match(/([\(\[\{])|([\)\]\}])/);
                        if (!g) {
                            f = b.charAt(a.column);
                            a = {
                                row: a.row,
                                column: a.column + 1
                            };
                            g = f && f.match(/([\(\[\{])|([\)\]\}])/);
                            c = false;
                        }
                        if (!g) return null;
                        if (g[1]) {
                            var h = this.$findClosingBracket(g[1], a);
                            if (!h) return null;
                            d = e.fromPoints(a, h);
                            if (!c) {
                                d.end.column++;
                                d.start.column--;
                            }
                            d.cursor = d.end;
                        } else {
                            var h = this.$findOpeningBracket(g[2], a);
                            if (!h) return null;
                            d = e.fromPoints(h, a);
                            if (!c) {
                                d.start.column++;
                                d.end.column--;
                            }
                            d.cursor = d.start;
                        }
                        return d;
                    };
                    this.getMatchingBracketRanges = function(a) {
                        var b = this.getLine(a.row);
                        var c = b.charAt(a.column - 1);
                        var d = c && c.match(/([\(\[\{])|([\)\]\}])/);
                        if (!d) {
                            c = b.charAt(a.column);
                            a = {
                                row: a.row,
                                column: a.column + 1
                            };
                            d = c && c.match(/([\(\[\{])|([\)\]\}])/);
                        }
                        if (!d) return null;
                        var f = new e(a.row, a.column - 1, a.row, a.column);
                        var g = d[1] ? this.$findClosingBracket(d[1], a) : this.$findOpeningBracket(d[2], a);
                        if (!g) return [
                            f
                        ];
                        var h = new e(g.row, g.column, g.row, g.column + 1);
                        return [
                            f,
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
                    this.$findOpeningBracket = function(a, b, c) {
                        var e = this.$brackets[a];
                        var f = 1;
                        var g = new d(this, b.row, b.column);
                        var h = g.getCurrentToken();
                        if (!h) h = g.stepForward();
                        if (!h) return;
                        if (!c) {
                            c = new RegExp("(\\.?" + h.type.replace(".", "\\.").replace("rparen", ".paren").replace(/\b(?:end)\b/, "(?:start|begin|end)") + ")+");
                        }
                        var i = b.column - g.getCurrentTokenColumn() - 2;
                        var j = h.value;
                        while(true){
                            while(i >= 0){
                                var k = j.charAt(i);
                                if (k == e) {
                                    f -= 1;
                                    if (f == 0) {
                                        return {
                                            row: g.getCurrentTokenRow(),
                                            column: i + g.getCurrentTokenColumn()
                                        };
                                    }
                                } else if (k == a) {
                                    f += 1;
                                }
                                i -= 1;
                            }
                            do {
                                h = g.stepBackward();
                            }while (h && !c.test(h.type))
                            if (h == null) break;
                            j = h.value;
                            i = j.length - 1;
                        }
                        return null;
                    };
                    this.$findClosingBracket = function(a, b, c) {
                        var e = this.$brackets[a];
                        var f = 1;
                        var g = new d(this, b.row, b.column);
                        var h = g.getCurrentToken();
                        if (!h) h = g.stepForward();
                        if (!h) return;
                        if (!c) {
                            c = new RegExp("(\\.?" + h.type.replace(".", "\\.").replace("lparen", ".paren").replace(/\b(?:start|begin)\b/, "(?:start|begin|end)") + ")+");
                        }
                        var i = b.column - g.getCurrentTokenColumn();
                        while(true){
                            var j = h.value;
                            var k = j.length;
                            while(i < k){
                                var l = j.charAt(i);
                                if (l == e) {
                                    f -= 1;
                                    if (f == 0) {
                                        return {
                                            row: g.getCurrentTokenRow(),
                                            column: i + g.getCurrentTokenColumn()
                                        };
                                    }
                                } else if (l == a) {
                                    f += 1;
                                }
                                i += 1;
                            }
                            do {
                                h = g.stepForward();
                            }while (h && !c.test(h.type))
                            if (h == null) break;
                            i = 0;
                        }
                        return null;
                    };
                }
                b.BracketMatch = f;
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
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./lib/lang");
                var f = a("./bidihandler").BidiHandler;
                var g = a("./config");
                var h = a("./lib/event_emitter").EventEmitter;
                var i = a("./selection").Selection;
                var j = a("./mode/text").Mode;
                var k = a("./range").Range;
                var l = a("./document").Document;
                var m = a("./background_tokenizer").BackgroundTokenizer;
                var n = a("./search_highlight").SearchHighlight;
                var o = function(a, b) {
                    this.$breakpoints = [];
                    this.$decorations = [];
                    this.$frontMarkers = {};
                    this.$backMarkers = {};
                    this.$markerId = 1;
                    this.$undoSelect = true;
                    this.$foldData = [];
                    this.id = "session" + ++o.$uid;
                    this.$foldData.toString = function() {
                        return this.join("\n");
                    };
                    this.on("changeFold", this.onChangeFold.bind(this));
                    this.$onChange = this.onChange.bind(this);
                    if (typeof a != "object" || !a.getLine) a = new l(a);
                    this.setDocument(a);
                    this.selection = new i(this);
                    this.$bidiHandler = new f(this);
                    g.resetOptions(this);
                    this.setMode(b);
                    g._signal("session", this);
                };
                o.$uid = 0;
                (function() {
                    d.implement(this, h);
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
                    this.$resetRowCache = function(a) {
                        if (!a) {
                            this.$docRowCache = [];
                            this.$screenRowCache = [];
                            return;
                        }
                        var b = this.$docRowCache.length;
                        var c = this.$getRowCacheIndex(this.$docRowCache, a) + 1;
                        if (b > c) {
                            this.$docRowCache.splice(c, b);
                            this.$screenRowCache.splice(c, b);
                        }
                    };
                    this.$getRowCacheIndex = function(a, b) {
                        var c = 0;
                        var d = a.length - 1;
                        while(c <= d){
                            var e = (c + d) >> 1;
                            var f = a[e];
                            if (b > f) c = e + 1;
                            else if (b < f) d = e - 1;
                            else return e;
                        }
                        return c - 1;
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
                    this.getTokenAt = function(a, b) {
                        var c = this.bgTokenizer.getTokens(a);
                        var d, e = 0;
                        if (b == null) {
                            var f = c.length - 1;
                            e = this.getLine(a).length;
                        } else {
                            for(var f = 0; f < c.length; f++){
                                e += c[f].value.length;
                                if (e >= b) break;
                            }
                        }
                        d = c[f];
                        if (!d) return null;
                        d.index = f;
                        d.start = e - d.value.length;
                        return d;
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
                            this.$informUndoManager = e.delayedCall(this.$syncInformUndoManager);
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
                            return e.stringRepeat(" ", this.getTabSize());
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
                    this.setBreakpoints = function(a) {
                        this.$breakpoints = [];
                        for(var b = 0; b < a.length; b++){
                            this.$breakpoints[a[b]] = "ace_breakpoint";
                        }
                        this._signal("changeBreakpoint", {});
                    };
                    this.clearBreakpoints = function() {
                        this.$breakpoints = [];
                        this._signal("changeBreakpoint", {});
                    };
                    this.setBreakpoint = function(a, b) {
                        if (b === undefined) b = "ace_breakpoint";
                        if (b) this.$breakpoints[a] = b;
                        else delete this.$breakpoints[a];
                        this._signal("changeBreakpoint", {});
                    };
                    this.clearBreakpoint = function(a) {
                        delete this.$breakpoints[a];
                        this._signal("changeBreakpoint", {});
                    };
                    this.addMarker = function(a, b, c, d) {
                        var e = this.$markerId++;
                        var f = {
                            range: a,
                            type: c || "line",
                            renderer: typeof c == "function" ? c : null,
                            clazz: b,
                            inFront: !!d,
                            id: e
                        };
                        if (d) {
                            this.$frontMarkers[e] = f;
                            this._signal("changeFrontMarker");
                        } else {
                            this.$backMarkers[e] = f;
                            this._signal("changeBackMarker");
                        }
                        return e;
                    };
                    this.addDynamicMarker = function(a, b) {
                        if (!a.update) return;
                        var c = this.$markerId++;
                        a.id = c;
                        a.inFront = !!b;
                        if (b) {
                            this.$frontMarkers[c] = a;
                            this._signal("changeFrontMarker");
                        } else {
                            this.$backMarkers[c] = a;
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
                            var b = new n(null, "ace_selected-word", "text");
                            this.$searchHighlight = this.addDynamicMarker(b);
                        }
                        this.$searchHighlight.setRegexp(a);
                    };
                    this.highlightLines = function(a, b, c, d) {
                        if (typeof b != "number") {
                            c = b;
                            b = a;
                        }
                        if (!c) c = "ace_step";
                        var e = new k(a, 0, b, Infinity);
                        e.id = this.addMarker(e, c, "fullLine", d);
                        return e;
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
                    this.$detectNewLine = function(a) {
                        var b = a.match(/^.*?(\r?\n)/m);
                        if (b) {
                            this.$autoNewLine = b[1];
                        } else {
                            this.$autoNewLine = "\n";
                        }
                    };
                    this.getWordRange = function(a, b) {
                        var c = this.getLine(a);
                        var d = false;
                        if (b > 0) d = !!c.charAt(b - 1).match(this.tokenRe);
                        if (!d) d = !!c.charAt(b).match(this.tokenRe);
                        if (d) var e = this.tokenRe;
                        else if (/^\s+$/.test(c.slice(b - 1, b + 1))) var e = /\s/;
                        else var e = this.nonTokenRe;
                        var f = b;
                        if (f > 0) {
                            do {
                                f--;
                            }while (f >= 0 && c.charAt(f).match(e))
                            f++;
                        }
                        var g = b;
                        while(g < c.length && c.charAt(g).match(e)){
                            g++;
                        }
                        return new k(a, f, a, g);
                    };
                    this.getAWordRange = function(a, b) {
                        var c = this.getWordRange(a, b);
                        var d = this.getLine(c.end.row);
                        while(d.charAt(c.end.column).match(/[ \t]/)){
                            c.end.column += 1;
                        }
                        return c;
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
                    this.$modes = g.$modes;
                    this.$mode = null;
                    this.$modeId = null;
                    this.setMode = function(a, b) {
                        if (a && typeof a === "object") {
                            if (a.getTokenizer) return this.$onChangeMode(a);
                            var c = a;
                            var d = c.path;
                        } else {
                            d = a || "ace/mode/text";
                        }
                        if (!this.$modes["ace/mode/text"]) this.$modes["ace/mode/text"] = new j();
                        if (this.$modes[d] && !c) {
                            this.$onChangeMode(this.$modes[d]);
                            b && b();
                            return;
                        }
                        this.$modeId = d;
                        g.loadModule([
                            "mode",
                            d
                        ], function(a) {
                            if (this.$modeId !== d) return b && b();
                            if (this.$modes[d] && !c) {
                                this.$onChangeMode(this.$modes[d]);
                            } else if (a && a.Mode) {
                                a = new a.Mode(c);
                                if (!c) {
                                    this.$modes[d] = a;
                                    a.$id = d;
                                }
                                this.$onChangeMode(a);
                            }
                            b && b();
                        }.bind(this));
                        if (!this.$mode) this.$onChangeMode(this.$modes["ace/mode/text"], true);
                    };
                    this.$onChangeMode = function(a, b) {
                        if (!b) this.$modeId = a.$id;
                        if (this.$mode === a) return;
                        var c = this.$mode;
                        this.$mode = a;
                        this.$stopWorker();
                        if (this.$useWorker) this.$startWorker();
                        var d = a.getTokenizer();
                        if (d.on !== undefined) {
                            var e = this.onReloadTokenizer.bind(this);
                            d.on("update", e);
                        }
                        if (!this.bgTokenizer) {
                            this.bgTokenizer = new m(d);
                            var f = this;
                            this.bgTokenizer.on("update", function(a) {
                                f._signal("tokenizerUpdate", a);
                            });
                        } else {
                            this.bgTokenizer.setTokenizer(d);
                        }
                        this.bgTokenizer.setDocument(this.getDocument());
                        this.tokenRe = a.tokenRe;
                        this.nonTokenRe = a.nonTokenRe;
                        if (!b) {
                            if (a.attachToSession) a.attachToSession(this);
                            this.$options.wrapMethod.set.call(this, this.$wrapMethod);
                            this.$setFolding(a.foldingRules);
                            this.bgTokenizer.start(0);
                            this._emit("changeMode", {
                                oldMode: c,
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
                            g.warn("Could not load worker", a);
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
                    this.$computeWidth = function(a) {
                        if (this.$modified || a) {
                            this.$modified = false;
                            if (this.$useWrapMode) return (this.screenWidth = this.$wrapLimit);
                            var b = this.doc.getAllLines();
                            var c = this.$rowLengthCache;
                            var d = 0;
                            var e = 0;
                            var f = this.$foldData[e];
                            var g = f ? f.start.row : Infinity;
                            var h = b.length;
                            for(var i = 0; i < h; i++){
                                if (i > g) {
                                    i = f.end.row + 1;
                                    if (i >= h) break;
                                    f = this.$foldData[e++];
                                    g = f ? f.start.row : Infinity;
                                }
                                if (c[i] == null) c[i] = this.$getStringScreenWidth(b[i])[0];
                                if (c[i] > d) d = c[i];
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
                    this.undoChanges = function(a, b) {
                        if (!a.length) return;
                        this.$fromUndo = true;
                        for(var c = a.length - 1; c != -1; c--){
                            var d = a[c];
                            if (d.action == "insert" || d.action == "remove") {
                                this.doc.revertDelta(d);
                            } else if (d.folds) {
                                this.addFolds(d.folds);
                            }
                        }
                        if (!b && this.$undoSelect) {
                            if (a.selectionBefore) this.selection.fromJSON(a.selectionBefore);
                            else this.selection.setRange(this.$getUndoSelection(a, true));
                        }
                        this.$fromUndo = false;
                    };
                    this.redoChanges = function(a, b) {
                        if (!a.length) return;
                        this.$fromUndo = true;
                        for(var c = 0; c < a.length; c++){
                            var d = a[c];
                            if (d.action == "insert" || d.action == "remove") {
                                this.doc.$safeApplyDelta(d);
                            }
                        }
                        if (!b && this.$undoSelect) {
                            if (a.selectionAfter) this.selection.fromJSON(a.selectionAfter);
                            else this.selection.setRange(this.$getUndoSelection(a, false));
                        }
                        this.$fromUndo = false;
                    };
                    this.setUndoSelect = function(a) {
                        this.$undoSelect = a;
                    };
                    this.$getUndoSelection = function(a, b) {
                        function c(a) {
                            return b ? a.action !== "insert" : a.action === "insert";
                        }
                        var d, e;
                        for(var f = 0; f < a.length; f++){
                            var g = a[f];
                            if (!g.start) continue;
                            if (!d) {
                                if (c(g)) {
                                    d = k.fromPoints(g.start, g.end);
                                } else {
                                    d = k.fromPoints(g.start, g.start);
                                }
                                continue;
                            }
                            if (c(g)) {
                                e = g.start;
                                if (d.compare(e.row, e.column) == -1) {
                                    d.setStart(e);
                                }
                                e = g.end;
                                if (d.compare(e.row, e.column) == 1) {
                                    d.setEnd(e);
                                }
                            } else {
                                e = g.start;
                                if (d.compare(e.row, e.column) == -1) {
                                    d = k.fromPoints(g.start, g.start);
                                }
                            }
                        }
                        return d;
                    };
                    this.replace = function(a, b) {
                        return this.doc.replace(a, b);
                    };
                    this.moveText = function(a, b, c) {
                        var d = this.getTextRange(a);
                        var e = this.getFoldsInRange(a);
                        var f = k.fromPoints(b, b);
                        if (!c) {
                            this.remove(a);
                            var g = a.start.row - a.end.row;
                            var h = g ? -a.end.column : a.start.column - a.end.column;
                            if (h) {
                                if (f.start.row == a.end.row && f.start.column > a.end.column) f.start.column += h;
                                if (f.end.row == a.end.row && f.end.column > a.end.column) f.end.column += h;
                            }
                            if (g && f.start.row >= a.end.row) {
                                f.start.row += g;
                                f.end.row += g;
                            }
                        }
                        f.end = this.insert(f.start, d);
                        if (e.length) {
                            var i = a.start;
                            var j = f.start;
                            var g = j.row - i.row;
                            var h = j.column - i.column;
                            this.addFolds(e.map(function(a) {
                                a = a.clone();
                                if (a.start.row == i.row) a.start.column += h;
                                if (a.end.row == i.row) a.end.column += h;
                                a.start.row += g;
                                a.end.row += g;
                                return a;
                            }));
                        }
                        return f;
                    };
                    this.indentRows = function(a, b, c) {
                        c = c.replace(/\t/g, this.getTabString());
                        for(var d = a; d <= b; d++)this.doc.insertInLine({
                            row: d,
                            column: 0
                        }, c);
                    };
                    this.outdentRows = function(a) {
                        var b = a.collapseRows();
                        var c = new k(0, 0, 0, 0);
                        var d = this.getTabSize();
                        for(var e = b.start.row; e <= b.end.row; ++e){
                            var f = this.getLine(e);
                            c.start.row = e;
                            c.end.row = e;
                            for(var g = 0; g < d; ++g)if (f.charAt(g) != " ") break;
                            if (g < d && f.charAt(g) == "\t") {
                                c.start.column = g;
                                c.end.column = g + 1;
                            } else {
                                c.start.column = 0;
                                c.end.column = g;
                            }
                            this.remove(c);
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
                        var f = new k(a, 0, b, Number.MAX_VALUE);
                        var g = this.getFoldsInRange(f).map(function(a) {
                            a = a.clone();
                            a.start.row += e;
                            a.end.row += e;
                            return a;
                        });
                        var h = c == 0 ? this.doc.getLines(a, b) : this.doc.removeFullLines(a, b);
                        this.doc.insertFullLines(a + e, h);
                        g.length && this.addFolds(g);
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
                    this.$clipColumnToRow = function(a, b) {
                        if (b < 0) return 0;
                        return Math.min(this.doc.getLine(a).length, b);
                    };
                    this.$clipPositionToDocument = function(a, b) {
                        b = Math.max(0, b);
                        if (a < 0) {
                            a = 0;
                            b = 0;
                        } else {
                            var c = this.doc.getLength();
                            if (a >= c) {
                                a = c - 1;
                                b = this.doc.getLine(c - 1).length;
                            } else {
                                b = Math.min(this.doc.getLine(a).length, b);
                            }
                        }
                        return {
                            row: a,
                            column: b
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
                    this.adjustWrapLimit = function(a, b) {
                        var c = this.$wrapLimitRange;
                        if (c.max < 0) c = {
                            min: b,
                            max: b
                        };
                        var d = this.$constrainWrapLimit(a, c.min, c.max);
                        if (d != this.$wrapLimit && d > 1) {
                            this.$wrapLimit = d;
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
                    this.$updateInternalDataOnChange = function(a) {
                        var b = this.$useWrapMode;
                        var c = a.action;
                        var d = a.start;
                        var e = a.end;
                        var f = d.row;
                        var g = e.row;
                        var h = g - f;
                        var i = null;
                        this.$updating = true;
                        if (h != 0) {
                            if (c === "remove") {
                                this[b ? "$wrapData" : "$rowLengthCache"].splice(f, h);
                                var j = this.$foldData;
                                i = this.getFoldsInRange(a);
                                this.removeFolds(i);
                                var k = this.getFoldLine(e.row);
                                var l = 0;
                                if (k) {
                                    k.addRemoveChars(e.row, e.column, d.column - e.column);
                                    k.shiftRow(-h);
                                    var m = this.getFoldLine(f);
                                    if (m && m !== k) {
                                        m.merge(k);
                                        k = m;
                                    }
                                    l = j.indexOf(k) + 1;
                                }
                                for(l; l < j.length; l++){
                                    var k = j[l];
                                    if (k.start.row >= e.row) {
                                        k.shiftRow(-h);
                                    }
                                }
                                g = f;
                            } else {
                                var n = Array(h);
                                n.unshift(f, 0);
                                var o = b ? this.$wrapData : this.$rowLengthCache;
                                o.splice.apply(o, n);
                                var j = this.$foldData;
                                var k = this.getFoldLine(f);
                                var l = 0;
                                if (k) {
                                    var p = k.range.compareInside(d.row, d.column);
                                    if (p == 0) {
                                        k = k.split(d.row, d.column);
                                        if (k) {
                                            k.shiftRow(h);
                                            k.addRemoveChars(g, 0, e.column - d.column);
                                        }
                                    } else if (p == -1) {
                                        k.addRemoveChars(f, 0, e.column - d.column);
                                        k.shiftRow(h);
                                    }
                                    l = j.indexOf(k) + 1;
                                }
                                for(l; l < j.length; l++){
                                    var k = j[l];
                                    if (k.start.row >= f) {
                                        k.shiftRow(h);
                                    }
                                }
                            }
                        } else {
                            h = Math.abs(a.start.column - a.end.column);
                            if (c === "remove") {
                                i = this.getFoldsInRange(a);
                                this.removeFolds(i);
                                h = -h;
                            }
                            var k = this.getFoldLine(f);
                            if (k) {
                                k.addRemoveChars(f, d.column, h);
                            }
                        }
                        if (b && this.$wrapData.length != this.doc.getLength()) {
                            console.error("doc.getLength() and $wrapData.length have to be the same!");
                        }
                        this.$updating = false;
                        if (b) this.$updateWrapData(f, g);
                        else this.$updateRowLengthCache(f, g);
                        return i;
                    };
                    this.$updateRowLengthCache = function(a, b, c) {
                        this.$rowLengthCache[a] = null;
                        this.$rowLengthCache[b] = null;
                    };
                    this.$updateWrapData = function(a, b) {
                        var d = this.doc.getAllLines();
                        var e = this.getTabSize();
                        var g = this.$wrapData;
                        var h = this.$wrapLimit;
                        var i;
                        var j;
                        var k = a;
                        b = Math.min(b, d.length - 1);
                        while(k <= b){
                            j = this.getFoldLine(k, j);
                            if (!j) {
                                i = this.$getDisplayTokens(d[k]);
                                g[k] = this.$computeWrapSplits(i, h, e);
                                k++;
                            } else {
                                i = [];
                                j.walk(function(a, b, e, g) {
                                    var h;
                                    if (a != null) {
                                        h = this.$getDisplayTokens(a, i.length);
                                        h[0] = c;
                                        for(var j = 1; j < h.length; j++){
                                            h[j] = f;
                                        }
                                    } else {
                                        h = this.$getDisplayTokens(d[b].substring(g, e), i.length);
                                    }
                                    i = i.concat(h);
                                }.bind(this), j.end.row, d[j.end.row].length + 1);
                                g[j.start.row] = this.$computeWrapSplits(i, h, e);
                                k = j.end.row + 1;
                            }
                        }
                    };
                    var a = 1, b = 2, c = 3, f = 4, i = 9, l = 10, o = 11, p = 12;
                    this.$computeWrapSplits = function(a, d, e) {
                        if (a.length == 0) {
                            return [];
                        }
                        var g = [];
                        var h = a.length;
                        var j = 0, k = 0;
                        var m = this.$wrapAsCode;
                        var n = this.$indentedSoftWrap;
                        var q = d <= Math.max(2 * e, 8) || n === false ? 0 : Math.floor(d / 2);
                        function r() {
                            var b = 0;
                            if (q === 0) return b;
                            if (n) {
                                for(var c = 0; c < a.length; c++){
                                    var d = a[c];
                                    if (d == l) b += 1;
                                    else if (d == o) b += e;
                                    else if (d == p) continue;
                                    else break;
                                }
                            }
                            if (m && n !== false) b += e;
                            return Math.min(b, q);
                        }
                        function s(b) {
                            var c = b - j;
                            for(var d = j; d < b; d++){
                                var e = a[d];
                                if (e === 12 || e === 2) c -= 1;
                            }
                            if (!g.length) {
                                t = r();
                                g.indent = t;
                            }
                            k += c;
                            g.push(k);
                            j = b;
                        }
                        var t = 0;
                        while(h - j > d - t){
                            var u = j + d - t;
                            if (a[u - 1] >= l && a[u] >= l) {
                                s(u);
                                continue;
                            }
                            if (a[u] == c || a[u] == f) {
                                for(u; u != j - 1; u--){
                                    if (a[u] == c) {
                                        break;
                                    }
                                }
                                if (u > j) {
                                    s(u);
                                    continue;
                                }
                                u = j + d;
                                for(u; u < a.length; u++){
                                    if (a[u] != f) {
                                        break;
                                    }
                                }
                                if (u == a.length) {
                                    break;
                                }
                                s(u);
                                continue;
                            }
                            var v = Math.max(u - (d - (d >> 2)), j - 1);
                            while(u > v && a[u] < c){
                                u--;
                            }
                            if (m) {
                                while(u > v && a[u] < c){
                                    u--;
                                }
                                while(u > v && a[u] == i){
                                    u--;
                                }
                            } else {
                                while(u > v && a[u] < l){
                                    u--;
                                }
                            }
                            if (u > v) {
                                s(++u);
                                continue;
                            }
                            u = j + d;
                            if (a[u] == b) u--;
                            s(u - t);
                        }
                        return g;
                    };
                    this.$getDisplayTokens = function(c, d) {
                        var e = [];
                        var f;
                        d = d || 0;
                        for(var g = 0; g < c.length; g++){
                            var h = c.charCodeAt(g);
                            if (h == 9) {
                                f = this.getScreenTabSize(e.length + d);
                                e.push(o);
                                for(var j = 1; j < f; j++){
                                    e.push(p);
                                }
                            } else if (h == 32) {
                                e.push(l);
                            } else if ((h > 39 && h < 48) || (h > 57 && h < 64)) {
                                e.push(i);
                            } else if (h >= 0x1100 && q(h)) {
                                e.push(a, b);
                            } else {
                                e.push(a);
                            }
                        }
                        return e;
                    };
                    this.$getStringScreenWidth = function(a, b, c) {
                        if (b == 0) return [
                            0,
                            0
                        ];
                        if (b == null) b = Infinity;
                        c = c || 0;
                        var d, e;
                        for(e = 0; e < a.length; e++){
                            d = a.charCodeAt(e);
                            if (d == 9) {
                                c += this.getScreenTabSize(c);
                            } else if (d >= 0x1100 && q(d)) {
                                c += 2;
                            } else {
                                c += 1;
                            }
                            if (c > b) {
                                break;
                            }
                        }
                        return [
                            c,
                            e
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
                    this.getRowWrapIndent = function(a) {
                        if (this.$useWrapMode) {
                            var b = this.screenToDocumentPosition(a, Number.MAX_VALUE);
                            var c = this.$wrapData[b.row];
                            return c.length && c[0] < b.column ? c.indent : 0;
                        } else {
                            return 0;
                        }
                    };
                    this.getScreenLastRowColumn = function(a) {
                        var b = this.screenToDocumentPosition(a, Number.MAX_VALUE);
                        return this.documentToScreenColumn(b.row, b.column);
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
                    this.screenToDocumentPosition = function(a, b, c) {
                        if (a < 0) return {
                            row: 0,
                            column: 0
                        };
                        var d;
                        var e = 0;
                        var f = 0;
                        var g;
                        var h = 0;
                        var i = 0;
                        var j = this.$screenRowCache;
                        var k = this.$getRowCacheIndex(j, a);
                        var l = j.length;
                        if (l && k >= 0) {
                            var h = j[k];
                            var e = this.$docRowCache[k];
                            var m = a > j[l - 1];
                        } else {
                            var m = !l;
                        }
                        var n = this.getLength() - 1;
                        var o = this.getNextFoldLine(e);
                        var p = o ? o.start.row : Infinity;
                        while(h <= a){
                            i = this.getRowLength(e);
                            if (h + i > a || e >= n) {
                                break;
                            } else {
                                h += i;
                                e++;
                                if (e > p) {
                                    e = o.end.row + 1;
                                    o = this.getNextFoldLine(e, o);
                                    p = o ? o.start.row : Infinity;
                                }
                            }
                            if (m) {
                                this.$docRowCache.push(e);
                                this.$screenRowCache.push(h);
                            }
                        }
                        if (o && o.start.row <= e) {
                            d = this.getFoldDisplayLine(o);
                            e = o.start.row;
                        } else if (h + i <= a || e > n) {
                            return {
                                row: n,
                                column: this.getLine(n).length
                            };
                        } else {
                            d = this.getLine(e);
                            o = null;
                        }
                        var q = 0, r = Math.floor(a - h);
                        if (this.$useWrapMode) {
                            var s = this.$wrapData[e];
                            if (s) {
                                g = s[r];
                                if (r > 0 && s.length) {
                                    q = s.indent;
                                    f = s[r - 1] || s[s.length - 1];
                                    d = d.substring(f);
                                }
                            }
                        }
                        if (c !== undefined && this.$bidiHandler.isBidiRow(h + r, e, r)) b = this.$bidiHandler.offsetToCol(c);
                        f += this.$getStringScreenWidth(d, b - q)[1];
                        if (this.$useWrapMode && f >= g) f = g - 1;
                        if (o) return o.idxToPosition(f);
                        return {
                            row: e,
                            column: f
                        };
                    };
                    this.documentToScreenPosition = function(a, b) {
                        if (typeof b === "undefined") var c = this.$clipPositionToDocument(a.row, a.column);
                        else c = this.$clipPositionToDocument(a, b);
                        a = c.row;
                        b = c.column;
                        var d = 0;
                        var e = null;
                        var f = null;
                        f = this.getFoldAt(a, b, 1);
                        if (f) {
                            a = f.start.row;
                            b = f.start.column;
                        }
                        var g, h = 0;
                        var i = this.$docRowCache;
                        var j = this.$getRowCacheIndex(i, a);
                        var k = i.length;
                        if (k && j >= 0) {
                            var h = i[j];
                            var d = this.$screenRowCache[j];
                            var l = a > i[k - 1];
                        } else {
                            var l = !k;
                        }
                        var m = this.getNextFoldLine(h);
                        var n = m ? m.start.row : Infinity;
                        while(h < a){
                            if (h >= n) {
                                g = m.end.row + 1;
                                if (g > a) break;
                                m = this.getNextFoldLine(g, m);
                                n = m ? m.start.row : Infinity;
                            } else {
                                g = h + 1;
                            }
                            d += this.getRowLength(h);
                            h = g;
                            if (l) {
                                this.$docRowCache.push(h);
                                this.$screenRowCache.push(d);
                            }
                        }
                        var o = "";
                        if (m && h >= n) {
                            o = this.getFoldDisplayLine(m, a, b);
                            e = m.start.row;
                        } else {
                            o = this.getLine(a).substring(0, b);
                            e = a;
                        }
                        var p = 0;
                        if (this.$useWrapMode) {
                            var q = this.$wrapData[e];
                            if (q) {
                                var r = 0;
                                while(o.length >= q[r]){
                                    d++;
                                    r++;
                                }
                                o = o.substring(q[r - 1] || 0, o.length);
                                p = r > 0 ? q.indent : 0;
                            }
                        }
                        if (this.lineWidgets && this.lineWidgets[h] && this.lineWidgets[h].rowsAbove) d += this.lineWidgets[h].rowsAbove;
                        return {
                            row: d,
                            column: p + this.$getStringScreenWidth(o)[0]
                        };
                    };
                    this.documentToScreenColumn = function(a, b) {
                        return this.documentToScreenPosition(a, b).column;
                    };
                    this.documentToScreenRow = function(a, b) {
                        return this.documentToScreenPosition(a, b).row;
                    };
                    this.getScreenLength = function() {
                        var a = 0;
                        var b = null;
                        if (!this.$useWrapMode) {
                            a = this.getLength();
                            var c = this.$foldData;
                            for(var d = 0; d < c.length; d++){
                                b = c[d];
                                a -= b.end.row - b.start.row;
                            }
                        } else {
                            var e = this.$wrapData.length;
                            var f = 0, d = 0;
                            var b = this.$foldData[d++];
                            var g = b ? b.start.row : Infinity;
                            while(f < e){
                                var h = this.$wrapData[f];
                                a += h ? h.length + 1 : 1;
                                f++;
                                if (f > g) {
                                    f = b.end.row + 1;
                                    b = this.$foldData[d++];
                                    g = b ? b.start.row : Infinity;
                                }
                            }
                        }
                        if (this.lineWidgets) a += this.$getWidgetScreenLength();
                        return a;
                    };
                    this.$setFontMetrics = function(a) {
                        if (!this.$enableVarChar) return;
                        this.$getStringScreenWidth = function(b, c, d) {
                            if (c === 0) return [
                                0,
                                0
                            ];
                            if (!c) c = Infinity;
                            d = d || 0;
                            var e, f;
                            for(f = 0; f < b.length; f++){
                                e = b.charAt(f);
                                if (e === "\t") {
                                    d += this.getScreenTabSize(d);
                                } else {
                                    d += a.getCharacterWidth(e);
                                }
                                if (d > c) {
                                    break;
                                }
                            }
                            return [
                                d,
                                f
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
                }.call(o.prototype));
                a("./edit_session/folding").Folding.call(o.prototype);
                a("./edit_session/bracket_match").BracketMatch.call(o.prototype);
                g.defineOptions(o.prototype, "session", {
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
                b.EditSession = o;
            });
            ace.define("ace/search", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/lang");
                var e = a("./lib/oop");
                var f = a("./range").Range;
                var g = function() {
                    this.$options = {};
                };
                (function() {
                    this.set = function(a) {
                        e.mixin(this.$options, a);
                        return this;
                    };
                    this.getOptions = function() {
                        return d.copyObject(this.$options);
                    };
                    this.setOptions = function(a) {
                        this.$options = a;
                    };
                    this.find = function(a) {
                        var b = this.$options;
                        var c = this.$matchIterator(a, b);
                        if (!c) return false;
                        var d = null;
                        c.forEach(function(a, c, e, g) {
                            d = new f(a, c, e, g);
                            if (c == g && b.start && b.start.start && b.skipCurrent != false && d.isEqual(b.start)) {
                                d = null;
                                return false;
                            }
                            return true;
                        });
                        return d;
                    };
                    this.findAll = function(a) {
                        var b = this.$options;
                        if (!b.needle) return [];
                        this.$assembleRegExp(b);
                        var c = b.range;
                        var e = c ? a.getLines(c.start.row, c.end.row) : a.doc.getAllLines();
                        var g = [];
                        var h = b.re;
                        if (b.$isMultiLine) {
                            var i = h.length;
                            var j = e.length - i;
                            var k;
                            outer: for(var l = h.offset || 0; l <= j; l++){
                                for(var m = 0; m < i; m++)if (e[l + m].search(h[m]) == -1) continue outer;
                                var n = e[l];
                                var o = e[l + i - 1];
                                var p = n.length - n.match(h[0])[0].length;
                                var q = o.match(h[i - 1])[0].length;
                                if (k && k.end.row === l && k.end.column > p) {
                                    continue;
                                }
                                g.push((k = new f(l, p, l + i - 1, q)));
                                if (i > 2) l = l + i - 2;
                            }
                        } else {
                            for(var r = 0; r < e.length; r++){
                                var s = d.getMatchOffsets(e[r], h);
                                for(var m = 0; m < s.length; m++){
                                    var t = s[m];
                                    g.push(new f(r, t.offset, r, t.offset + t.length));
                                }
                            }
                        }
                        if (c) {
                            var u = c.start.column;
                            var v = c.start.column;
                            var r = 0, m = g.length - 1;
                            while(r < m && g[r].start.column < u && g[r].start.row == c.start.row)r++;
                            while(r < m && g[m].end.column > v && g[m].end.row == c.end.row)m--;
                            g = g.slice(r, m + 1);
                            for(r = 0, m = g.length; r < m; r++){
                                g[r].start.row += c.start.row;
                                g[r].end.row += c.start.row;
                            }
                        }
                        return g;
                    };
                    this.replace = function(a, b) {
                        var c = this.$options;
                        var d = this.$assembleRegExp(c);
                        if (c.$isMultiLine) return b;
                        if (!d) return;
                        var e = d.exec(a);
                        if (!e || e[0].length != a.length) return null;
                        b = a.replace(d, b);
                        if (c.preserveCase) {
                            b = b.split("");
                            for(var f = Math.min(a.length, a.length); f--;){
                                var g = a[f];
                                if (g && g.toLowerCase() != g) b[f] = b[f].toUpperCase();
                                else b[f] = b[f].toLowerCase();
                            }
                            b = b.join("");
                        }
                        return b;
                    };
                    this.$assembleRegExp = function(a, b) {
                        if (a.needle instanceof RegExp) return (a.re = a.needle);
                        var c = a.needle;
                        if (!a.needle) return (a.re = false);
                        if (!a.regExp) c = d.escapeRegExp(c);
                        if (a.wholeWord) c = h(c, a);
                        var e = a.caseSensitive ? "gm" : "gmi";
                        a.$isMultiLine = !b && /[\n\r]/.test(c);
                        if (a.$isMultiLine) return (a.re = this.$assembleMultilineRegExp(c, e));
                        try {
                            var f = new RegExp(c, e);
                        } catch (g) {
                            f = false;
                        }
                        return (a.re = f);
                    };
                    this.$assembleMultilineRegExp = function(a, b) {
                        var c = a.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
                        var d = [];
                        for(var e = 0; e < c.length; e++)try {
                            d.push(new RegExp(c[e], b));
                        } catch (f) {
                            return false;
                        }
                        return d;
                    };
                    this.$matchIterator = function(a, b) {
                        var c = this.$assembleRegExp(b);
                        if (!c) return false;
                        var d = b.backwards == true;
                        var e = b.skipCurrent != false;
                        var f = b.range;
                        var g = b.start;
                        if (!g) g = f ? f[d ? "end" : "start"] : a.selection.getRange();
                        if (g.start) g = g[e != d ? "end" : "start"];
                        var h = f ? f.start.row : 0;
                        var i = f ? f.end.row : a.getLength() - 1;
                        if (d) {
                            var j = function(a) {
                                var c = g.row;
                                if (l(c, g.column, a)) return;
                                for(c--; c >= h; c--)if (l(c, Number.MAX_VALUE, a)) return;
                                if (b.wrap == false) return;
                                for(c = i, h = g.row; c >= h; c--)if (l(c, Number.MAX_VALUE, a)) return;
                            };
                        } else {
                            var j = function(a) {
                                var c = g.row;
                                if (l(c, g.column, a)) return;
                                for(c = c + 1; c <= i; c++)if (l(c, 0, a)) return;
                                if (b.wrap == false) return;
                                for(c = h, i = g.row; c <= i; c++)if (l(c, 0, a)) return;
                            };
                        }
                        if (b.$isMultiLine) {
                            var k = c.length;
                            var l = function(b, e, f) {
                                var g = d ? b - k + 1 : b;
                                if (g < 0 || g + k > a.getLength()) return;
                                var h = a.getLine(g);
                                var i = h.search(c[0]);
                                if ((!d && i < e) || i === -1) return;
                                for(var j = 1; j < k; j++){
                                    h = a.getLine(g + j);
                                    if (h.search(c[j]) == -1) return;
                                }
                                var l = h.match(c[k - 1])[0].length;
                                if (d && l > e) return;
                                if (f(g, i, g + k - 1, l)) return true;
                            };
                        } else if (d) {
                            var l = function(b, d, e) {
                                var f = a.getLine(b);
                                var g = [];
                                var h, i = 0;
                                c.lastIndex = 0;
                                while((h = c.exec(f))){
                                    var j = h[0].length;
                                    i = h.index;
                                    if (!j) {
                                        if (i >= f.length) break;
                                        c.lastIndex = i += 1;
                                    }
                                    if (h.index + j > d) break;
                                    g.push(h.index, j);
                                }
                                for(var k = g.length - 1; k >= 0; k -= 2){
                                    var l = g[k - 1];
                                    var j = g[k];
                                    if (e(b, l, b, l + j)) return true;
                                }
                            };
                        } else {
                            var l = function(b, d, e) {
                                var f = a.getLine(b);
                                var g;
                                var h;
                                c.lastIndex = d;
                                while((h = c.exec(f))){
                                    var i = h[0].length;
                                    g = h.index;
                                    if (e(b, g, b, g + i)) return true;
                                    if (!i) {
                                        c.lastIndex = g += 1;
                                        if (g >= f.length) return false;
                                    }
                                }
                            };
                        }
                        return {
                            forEach: j
                        };
                    };
                }.call(g.prototype));
                function h(a, b) {
                    function c(a) {
                        if (/\w/.test(a) || b.regExp) return "\\b";
                        return "";
                    }
                    return (c(a[0]) + a + c(a[a.length - 1]));
                }
                b.Search = g;
            });
            ace.define("ace/keyboard/hash_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/keys");
                var e = a("../lib/useragent");
                var f = d.KEY_MODS;
                function g(a, b) {
                    this.platform = b || (e.isMac ? "mac" : "win");
                    this.commands = {};
                    this.commandKeyBinding = {};
                    this.addCommands(a);
                    this.$singleCommand = true;
                }
                function h(a, b) {
                    g.call(this, a, b);
                    this.$singleCommand = false;
                }
                h.prototype = g.prototype;
                (function() {
                    this.addCommand = function(a) {
                        if (this.commands[a.name]) this.removeCommand(a);
                        this.commands[a.name] = a;
                        if (a.bindKey) this._buildKeyHash(a);
                    };
                    this.removeCommand = function(a, b) {
                        var c = a && (typeof a === "string" ? a : a.name);
                        a = this.commands[c];
                        if (!b) delete this.commands[c];
                        var d = this.commandKeyBinding;
                        for(var e in d){
                            var f = d[e];
                            if (f == a) {
                                delete d[e];
                            } else if (Array.isArray(f)) {
                                var g = f.indexOf(a);
                                if (g != -1) {
                                    f.splice(g, 1);
                                    if (f.length == 1) d[e] = f[0];
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
                                e.forEach(function(a) {
                                    var b = this.parseKeys(a);
                                    var c = f[b.hashId] + b.key;
                                    d += (d ? " " : "") + c;
                                    this._addCommandToBinding(d, "chainKeys");
                                }, this);
                                d += " ";
                            }
                            var g = this.parseKeys(a);
                            var h = f[g.hashId] + g.key;
                            this._addCommandToBinding(d + h, b, c);
                        }, this);
                    };
                    function a(a) {
                        return ((typeof a == "object" && a.bindKey && a.bindKey.position) || (a.isDefault ? -100 : 0));
                    }
                    this._addCommandToBinding = function(b, c, d) {
                        var e = this.commandKeyBinding, f;
                        if (!c) {
                            delete e[b];
                        } else if (!e[b] || this.$singleCommand) {
                            e[b] = c;
                        } else {
                            if (!Array.isArray(e[b])) {
                                e[b] = [
                                    e[b]
                                ];
                            } else if ((f = e[b].indexOf(c)) != -1) {
                                e[b].splice(f, 1);
                            }
                            if (typeof d != "number") {
                                d = a(c);
                            }
                            var g = e[b];
                            for(f = 0; f < g.length; f++){
                                var h = g[f];
                                var i = a(h);
                                if (i > d) break;
                            }
                            g.splice(f, 0, c);
                        }
                    };
                    this.addCommands = function(a) {
                        a && Object.keys(a).forEach(function(b) {
                            var c = a[b];
                            if (!c) return;
                            if (typeof c === "string") return this.bindKey(c, b);
                            if (typeof c === "function") c = {
                                exec: c
                            };
                            if (typeof c !== "object") return;
                            if (!c.name) c.name = b;
                            this.addCommand(c);
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
                    this.parseKeys = function(a) {
                        var b = a.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(a) {
                            return a;
                        });
                        var c = b.pop();
                        var e = d[c];
                        if (d.FUNCTION_KEYS[e]) c = d.FUNCTION_KEYS[e].toLowerCase();
                        else if (!b.length) return {
                            key: c,
                            hashId: -1
                        };
                        else if (b.length == 1 && b[0] == "shift") return {
                            key: c.toUpperCase(),
                            hashId: -1
                        };
                        var f = 0;
                        for(var g = b.length; g--;){
                            var h = d.KEY_MODS[b[g]];
                            if (h == null) {
                                if (typeof console != "undefined") console.error("invalid modifier " + b[g] + " in " + a);
                                return false;
                            }
                            f |= h;
                        }
                        return {
                            key: c,
                            hashId: f
                        };
                    };
                    this.findKeyCommand = function a(b, c) {
                        var d = f[b] + c;
                        return this.commandKeyBinding[d];
                    };
                    this.handleKeyboard = function(a, b, c, d) {
                        if (d < 0) return;
                        var e = f[b] + c;
                        var g = this.commandKeyBinding[e];
                        if (a.$keyChain) {
                            a.$keyChain += " " + e;
                            g = this.commandKeyBinding[a.$keyChain] || g;
                        }
                        if (g) {
                            if (g == "chainKeys" || g[g.length - 1] == "chainKeys") {
                                a.$keyChain = a.$keyChain || e;
                                return {
                                    command: "null"
                                };
                            }
                        }
                        if (a.$keyChain) {
                            if ((!b || b == 4) && c.length == 1) a.$keyChain = a.$keyChain.slice(0, -e.length - 1);
                            else if (b == -1 || d > 0) a.$keyChain = "";
                        }
                        return {
                            command: g
                        };
                    };
                    this.getStatusText = function(a, b) {
                        return b.$keyChain || "";
                    };
                }.call(g.prototype));
                b.HashHandler = g;
                b.MultiHashHandler = h;
            });
            ace.define("ace/commands/command_manager", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/keyboard/hash_handler",
                "ace/lib/event_emitter", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/oop");
                var e = a("../keyboard/hash_handler").MultiHashHandler;
                var f = a("../lib/event_emitter").EventEmitter;
                var g = function(a, b) {
                    e.call(this, b, a);
                    this.byName = this.commands;
                    this.setDefaultHandler("exec", function(a) {
                        return a.command.exec(a.editor, a.args || {});
                    });
                };
                d.inherits(g, e);
                (function() {
                    d.implement(this, f);
                    this.exec = function(a, b, c) {
                        if (Array.isArray(a)) {
                            for(var d = a.length; d--;){
                                if (this.exec(a[d], b, c)) return true;
                            }
                            return false;
                        }
                        if (typeof a === "string") a = this.commands[a];
                        if (!a) return false;
                        if (b && b.$readOnly && !a.readOnly) return false;
                        if (this.$checkCommandState != false && a.isAvailable && !a.isAvailable(b)) return false;
                        var e = {
                            editor: b,
                            command: a,
                            args: c
                        };
                        e.returnValue = this._emit("exec", e);
                        this._signal("afterExec", e);
                        return e.returnValue === false ? false : true;
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
                }.call(g.prototype));
                b.CommandManager = g;
            });
            ace.define("ace/commands/default_commands", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/config",
                "ace/range", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/lang");
                var e = a("../config");
                var f = a("../range").Range;
                function g(a, b) {
                    return {
                        win: a,
                        mac: b
                    };
                }
                b.commands = [
                    {
                        name: "showSettingsMenu",
                        description: "Show settings menu",
                        bindKey: g("Ctrl-,", "Command-,"),
                        exec: function(a) {
                            e.loadModule("ace/ext/settings_menu", function(b) {
                                b.init(a);
                                a.showSettingsMenu();
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "goToNextError",
                        description: "Go to next error",
                        bindKey: g("Alt-E", "F4"),
                        exec: function(a) {
                            e.loadModule("./ext/error_marker", function(b) {
                                b.showErrorMarker(a, 1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "goToPreviousError",
                        description: "Go to previous error",
                        bindKey: g("Alt-Shift-E", "Shift-F4"),
                        exec: function(a) {
                            e.loadModule("./ext/error_marker", function(b) {
                                b.showErrorMarker(a, -1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: true
                    },
                    {
                        name: "selectall",
                        description: "Select all",
                        bindKey: g("Ctrl-A", "Command-A"),
                        exec: function(a) {
                            a.selectAll();
                        },
                        readOnly: true
                    },
                    {
                        name: "centerselection",
                        description: "Center selection",
                        bindKey: g(null, "Ctrl-L"),
                        exec: function(a) {
                            a.centerSelection();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotoline",
                        description: "Go to line...",
                        bindKey: g("Ctrl-L", "Command-L"),
                        exec: function(a, b) {
                            if (typeof b === "number" && !isNaN(b)) a.gotoLine(b);
                            a.prompt({
                                $type: "gotoLine"
                            });
                        },
                        readOnly: true
                    },
                    {
                        name: "fold",
                        bindKey: g("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
                        exec: function(a) {
                            a.session.toggleFold(false);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "unfold",
                        bindKey: g("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
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
                        bindKey: g("F2", "F2"),
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
                        bindKey: g("Alt-F2", "Alt-F2"),
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
                        bindKey: g(null, "Ctrl-Command-Option-0"),
                        exec: function(a) {
                            a.session.foldAll();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldAllComments",
                        description: "Fold all comments",
                        bindKey: g(null, "Ctrl-Command-Option-0"),
                        exec: function(a) {
                            a.session.foldAllComments();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "foldOther",
                        description: "Fold other",
                        bindKey: g("Alt-0", "Command-Option-0"),
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
                        bindKey: g("Alt-Shift-0", "Command-Option-Shift-0"),
                        exec: function(a) {
                            a.session.unfold();
                        },
                        scrollIntoView: "center",
                        readOnly: true
                    },
                    {
                        name: "findnext",
                        description: "Find next",
                        bindKey: g("Ctrl-K", "Command-G"),
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
                        bindKey: g("Ctrl-Shift-K", "Command-Shift-G"),
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
                        bindKey: g("Alt-K", "Ctrl-G"),
                        exec: function(a) {
                            if (a.selection.isEmpty()) a.selection.selectWord();
                            else a.findNext();
                        },
                        readOnly: true
                    },
                    {
                        name: "selectOrFindPrevious",
                        description: "Select or find previous",
                        bindKey: g("Alt-Shift-K", "Ctrl-Shift-G"),
                        exec: function(a) {
                            if (a.selection.isEmpty()) a.selection.selectWord();
                            else a.findPrevious();
                        },
                        readOnly: true
                    },
                    {
                        name: "find",
                        description: "Find",
                        bindKey: g("Ctrl-F", "Command-F"),
                        exec: function(a) {
                            e.loadModule("ace/ext/searchbox", function(b) {
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
                        bindKey: g("Ctrl-Shift-Home", "Command-Shift-Home|Command-Shift-Up"),
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
                        bindKey: g("Ctrl-Home", "Command-Home|Command-Up"),
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
                        bindKey: g("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
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
                        bindKey: g("Up", "Up|Ctrl-P"),
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
                        bindKey: g("Ctrl-Shift-End", "Command-Shift-End|Command-Shift-Down"),
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
                        bindKey: g("Ctrl-End", "Command-End|Command-Down"),
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
                        bindKey: g("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
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
                        bindKey: g("Down", "Down|Ctrl-N"),
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
                        bindKey: g("Ctrl-Shift-Left", "Option-Shift-Left"),
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
                        bindKey: g("Ctrl-Left", "Option-Left"),
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
                        bindKey: g("Alt-Shift-Left", "Command-Shift-Left|Ctrl-Shift-A"),
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
                        bindKey: g("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
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
                        bindKey: g("Shift-Left", "Shift-Left|Ctrl-Shift-B"),
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
                        bindKey: g("Left", "Left|Ctrl-B"),
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
                        bindKey: g("Ctrl-Shift-Right", "Option-Shift-Right"),
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
                        bindKey: g("Ctrl-Right", "Option-Right"),
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
                        bindKey: g("Alt-Shift-Right", "Command-Shift-Right|Shift-End|Ctrl-Shift-E"),
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
                        bindKey: g("Alt-Right|End", "Command-Right|End|Ctrl-E"),
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
                        bindKey: g("Shift-Right", "Shift-Right"),
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
                        bindKey: g("Right", "Right|Ctrl-F"),
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
                        bindKey: g(null, "Option-PageDown"),
                        exec: function(a) {
                            a.scrollPageDown();
                        },
                        readOnly: true
                    },
                    {
                        name: "gotopagedown",
                        description: "Go to page down",
                        bindKey: g("PageDown", "PageDown|Ctrl-V"),
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
                        bindKey: g(null, "Option-PageUp"),
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
                        bindKey: g("Ctrl-Up", null),
                        exec: function(a) {
                            a.renderer.scrollBy(0, -2 * a.renderer.layerConfig.lineHeight);
                        },
                        readOnly: true
                    },
                    {
                        name: "scrolldown",
                        description: "Scroll down",
                        bindKey: g("Ctrl-Down", null),
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
                        bindKey: g("Ctrl-Alt-E", "Command-Option-E"),
                        exec: function(a) {
                            a.commands.toggleRecording(a);
                        },
                        readOnly: true
                    },
                    {
                        name: "replaymacro",
                        description: "Replay macro",
                        bindKey: g("Ctrl-Shift-E", "Command-Shift-E"),
                        exec: function(a) {
                            a.commands.replay(a);
                        },
                        readOnly: true
                    },
                    {
                        name: "jumptomatching",
                        description: "Jump to matching",
                        bindKey: g("Ctrl-\\|Ctrl-P", "Command-\\"),
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
                        bindKey: g("Ctrl-Shift-\\|Ctrl-Shift-P", "Command-Shift-\\"),
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
                        bindKey: g("Ctrl-Shift-M", "Ctrl-Shift-M"),
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
                        bindKey: g(null, null),
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
                            var b = a.$copyWithEmptySelection && a.selection.isEmpty();
                            var c = b ? a.selection.getLineRange() : a.selection.getRange();
                            a._emit("cut", c);
                            if (!c.isEmpty()) a.session.remove(c);
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
                        bindKey: g("Ctrl-D", "Command-D"),
                        exec: function(a) {
                            a.removeLines();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "duplicateSelection",
                        description: "Duplicate selection",
                        bindKey: g("Ctrl-Shift-D", "Command-Shift-D"),
                        exec: function(a) {
                            a.duplicateSelection();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "sortlines",
                        description: "Sort lines",
                        bindKey: g("Ctrl-Alt-S", "Command-Alt-S"),
                        exec: function(a) {
                            a.sortLines();
                        },
                        scrollIntoView: "selection",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "togglecomment",
                        description: "Toggle comment",
                        bindKey: g("Ctrl-/", "Command-/"),
                        exec: function(a) {
                            a.toggleCommentLines();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "toggleBlockComment",
                        description: "Toggle block comment",
                        bindKey: g("Ctrl-Shift-/", "Command-Shift-/"),
                        exec: function(a) {
                            a.toggleBlockComment();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "modifyNumberUp",
                        description: "Modify number up",
                        bindKey: g("Ctrl-Shift-Up", "Alt-Shift-Up"),
                        exec: function(a) {
                            a.modifyNumber(1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "modifyNumberDown",
                        description: "Modify number down",
                        bindKey: g("Ctrl-Shift-Down", "Alt-Shift-Down"),
                        exec: function(a) {
                            a.modifyNumber(-1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "replace",
                        description: "Replace",
                        bindKey: g("Ctrl-H", "Command-Option-F"),
                        exec: function(a) {
                            e.loadModule("ace/ext/searchbox", function(b) {
                                b.Search(a, true);
                            });
                        }
                    },
                    {
                        name: "undo",
                        description: "Undo",
                        bindKey: g("Ctrl-Z", "Command-Z"),
                        exec: function(a) {
                            a.undo();
                        }
                    },
                    {
                        name: "redo",
                        description: "Redo",
                        bindKey: g("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
                        exec: function(a) {
                            a.redo();
                        }
                    },
                    {
                        name: "copylinesup",
                        description: "Copy lines up",
                        bindKey: g("Alt-Shift-Up", "Command-Option-Up"),
                        exec: function(a) {
                            a.copyLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesup",
                        description: "Move lines up",
                        bindKey: g("Alt-Up", "Option-Up"),
                        exec: function(a) {
                            a.moveLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "copylinesdown",
                        description: "Copy lines down",
                        bindKey: g("Alt-Shift-Down", "Command-Option-Down"),
                        exec: function(a) {
                            a.copyLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesdown",
                        description: "Move lines down",
                        bindKey: g("Alt-Down", "Option-Down"),
                        exec: function(a) {
                            a.moveLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "del",
                        description: "Delete",
                        bindKey: g("Delete", "Delete|Ctrl-D|Shift-Delete"),
                        exec: function(a) {
                            a.remove("right");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "backspace",
                        description: "Backspace",
                        bindKey: g("Shift-Backspace|Backspace", "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"),
                        exec: function(a) {
                            a.remove("left");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "cut_or_delete",
                        description: "Cut or delete",
                        bindKey: g("Shift-Delete", null),
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
                        bindKey: g("Alt-Backspace", "Command-Backspace"),
                        exec: function(a) {
                            a.removeToLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolineend",
                        description: "Remove to line end",
                        bindKey: g("Alt-Delete", "Ctrl-K|Command-Delete"),
                        exec: function(a) {
                            a.removeToLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolinestarthard",
                        description: "Remove to line start hard",
                        bindKey: g("Ctrl-Shift-Backspace", null),
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
                        bindKey: g("Ctrl-Shift-Delete", null),
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
                        bindKey: g("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
                        exec: function(a) {
                            a.removeWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removewordright",
                        description: "Remove word right",
                        bindKey: g("Ctrl-Delete", "Alt-Delete"),
                        exec: function(a) {
                            a.removeWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "outdent",
                        description: "Outdent",
                        bindKey: g("Shift-Tab", "Shift-Tab"),
                        exec: function(a) {
                            a.blockOutdent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "indent",
                        description: "Indent",
                        bindKey: g("Tab", "Tab"),
                        exec: function(a) {
                            a.indent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockoutdent",
                        description: "Block outdent",
                        bindKey: g("Ctrl-[", "Ctrl-["),
                        exec: function(a) {
                            a.blockOutdent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockindent",
                        description: "Block indent",
                        bindKey: g("Ctrl-]", "Ctrl-]"),
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
                        exec: function(a, b) {
                            a.insert(d.stringRepeat(b.text || "", b.times || 1));
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "splitline",
                        description: "Split line",
                        bindKey: g(null, "Ctrl-O"),
                        exec: function(a) {
                            a.splitLine();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "transposeletters",
                        description: "Transpose letters",
                        bindKey: g("Alt-Shift-X", "Ctrl-T"),
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
                        bindKey: g("Ctrl-U", "Ctrl-U"),
                        exec: function(a) {
                            a.toUpperCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "tolowercase",
                        description: "To lowercase",
                        bindKey: g("Ctrl-Shift-U", "Ctrl-Shift-U"),
                        exec: function(a) {
                            a.toLowerCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "autoindent",
                        description: "Auto Indent",
                        bindKey: g(null, null),
                        exec: function(a) {
                            a.autoIndent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "animate"
                    },
                    {
                        name: "expandtoline",
                        description: "Expand to line",
                        bindKey: g("Ctrl-Shift-L", "Command-Shift-L"),
                        exec: function(a) {
                            var b = a.selection.getRange();
                            b.start.column = b.end.column = 0;
                            b.end.row++;
                            a.selection.setRange(b, false);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: true
                    },
                    {
                        name: "joinlines",
                        description: "Join lines",
                        bindKey: g(null, null),
                        exec: function(a) {
                            var b = a.selection.isBackwards();
                            var c = b ? a.selection.getSelectionLead() : a.selection.getSelectionAnchor();
                            var e = b ? a.selection.getSelectionAnchor() : a.selection.getSelectionLead();
                            var g = a.session.doc.getLine(c.row).length;
                            var h = a.session.doc.getTextRange(a.selection.getRange());
                            var i = h.replace(/\n\s*/, " ").length;
                            var j = a.session.doc.getLine(c.row);
                            for(var k = c.row + 1; k <= e.row + 1; k++){
                                var l = d.stringTrimLeft(d.stringTrimRight(a.session.doc.getLine(k)));
                                if (l.length !== 0) {
                                    l = " " + l;
                                }
                                j += l;
                            }
                            if (e.row + 1 < a.session.doc.getLength() - 1) {
                                j += a.session.doc.getNewLineCharacter();
                            }
                            a.clearSelection();
                            a.session.doc.replace(new f(c.row, 0, e.row + 2, 0), j);
                            if (i > 0) {
                                a.selection.moveCursorTo(c.row, c.column);
                                a.selection.selectTo(c.row, c.column + i);
                            } else {
                                g = a.session.doc.getLine(c.row).length > g ? g + 1 : g;
                                a.selection.moveCursorTo(c.row, g);
                            }
                        },
                        multiSelectAction: "forEach",
                        readOnly: true
                    },
                    {
                        name: "invertSelection",
                        description: "Invert selection",
                        bindKey: g(null, null),
                        exec: function(a) {
                            var b = a.session.doc.getLength() - 1;
                            var c = a.session.doc.getLine(b).length;
                            var d = a.selection.rangeList.ranges;
                            var e = [];
                            if (d.length < 1) {
                                d = [
                                    a.selection.getRange()
                                ];
                            }
                            for(var g = 0; g < d.length; g++){
                                if (g == d.length - 1) {
                                    if (!(d[g].end.row === b && d[g].end.column === c)) {
                                        e.push(new f(d[g].end.row, d[g].end.column, b, c));
                                    }
                                }
                                if (g === 0) {
                                    if (!(d[g].start.row === 0 && d[g].start.column === 0)) {
                                        e.push(new f(0, 0, d[g].start.row, d[g].start.column));
                                    }
                                } else {
                                    e.push(new f(d[g - 1].end.row, d[g - 1].end.column, d[g].start.row, d[g].start.column));
                                }
                            }
                            a.exitMultiSelectMode();
                            a.clearSelection();
                            for(var g = 0; g < e.length; g++){
                                a.selection.addRange(e[g], false);
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
                        bindKey: g("F1", "F1"),
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
                        bindKey: g(null, null),
                        exec: function(a) {
                            a.prompt({
                                $type: "modes"
                            });
                        },
                        readOnly: true
                    }, 
                ];
                for(var h = 1; h < 9; h++){
                    b.commands.push({
                        name: "foldToLevel" + h,
                        description: "Fold To Level " + h,
                        level: h,
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
            ], function(a, b, c) {
                "use strict";
                a("./lib/fixoldbrowsers");
                var d = a("./lib/oop");
                var e = a("./lib/dom");
                var f = a("./lib/lang");
                var g = a("./lib/useragent");
                var h = a("./keyboard/textinput").TextInput;
                var i = a("./mouse/mouse_handler").MouseHandler;
                var j = a("./mouse/fold_handler").FoldHandler;
                var k = a("./keyboard/keybinding").KeyBinding;
                var l = a("./edit_session").EditSession;
                var m = a("./search").Search;
                var n = a("./range").Range;
                var o = a("./lib/event_emitter").EventEmitter;
                var p = a("./commands/command_manager").CommandManager;
                var q = a("./commands/default_commands").commands;
                var r = a("./config");
                var s = a("./token_iterator").TokenIterator;
                var t = a("./clipboard");
                var u = function(a, b, c) {
                    this.$toDestroy = [];
                    var d = a.getContainerElement();
                    this.container = d;
                    this.renderer = a;
                    this.id = "editor" + ++u.$uid;
                    this.commands = new p(g.isMac ? "mac" : "win", q);
                    if (typeof document == "object") {
                        this.textInput = new h(a.getTextAreaContainer(), this);
                        this.renderer.textarea = this.textInput.getElement();
                        this.$mouseHandler = new i(this);
                        new j(this);
                    }
                    this.keyBinding = new k(this);
                    this.$search = new m().set({
                        wrap: true
                    });
                    this.$historyTracker = this.$historyTracker.bind(this);
                    this.commands.on("exec", this.$historyTracker);
                    this.$initOperationListeners();
                    this._$emitInputEvent = f.delayedCall(function() {
                        this._signal("input", {});
                        if (this.session && this.session.bgTokenizer) this.session.bgTokenizer.scheduleStart();
                    }.bind(this));
                    this.on("change", function(a, b) {
                        b._$emitInputEvent.schedule(31);
                    });
                    this.setSession(b || (c && c.session) || new l(""));
                    r.resetOptions(this);
                    if (c) this.setOptions(c);
                    r._signal("editor", this);
                };
                u.$uid = 0;
                (function() {
                    d.implement(this, o);
                    this.$initOperationListeners = function() {
                        this.commands.on("exec", this.startOperation.bind(this), true);
                        this.commands.on("afterExec", this.endOperation.bind(this), true);
                        this.$opResetTimer = f.delayedCall(this.endOperation.bind(this, true));
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
                    this.endOperation = function(a) {
                        if (this.curOp && this.session) {
                            if ((a && a.returnValue === false) || !this.session) return (this.curOp = null);
                            if (a == true && this.curOp.command && this.curOp.command.name == "mouse") return;
                            this._signal("beforeEndOperation");
                            if (!this.curOp) return;
                            var b = this.curOp.command;
                            var c = b && b.scrollIntoView;
                            if (c) {
                                switch(c){
                                    case "center-animate":
                                        c = "animate";
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
                                if (c == "animate") this.renderer.animateScrolling(this.curOp.scrollTop);
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
                    this.$historyTracker = function(a) {
                        if (!this.$mergeUndoDeltas) return;
                        var b = this.prevOp;
                        var c = this.$mergeableCommands;
                        var d = b.command && a.command.name == b.command.name;
                        if (a.command.name == "insertstring") {
                            var e = a.args;
                            if (this.mergeNextCommand === undefined) this.mergeNextCommand = true;
                            d = d && this.mergeNextCommand && (!/\s/.test(e) || /\s/.test(b.args));
                            this.mergeNextCommand = true;
                        } else {
                            d = d && c.indexOf(a.command.name) !== -1;
                        }
                        if (this.$mergeUndoDeltas != "always" && Date.now() - this.sequenceStartTime > 2000) {
                            d = false;
                        }
                        if (d) this.session.mergeUndoDeltas = true;
                        else if (c.indexOf(a.command.name) !== -1) this.sequenceStartTime = Date.now();
                    };
                    this.setKeyboardHandler = function(a, b) {
                        if (a && typeof a === "string" && a != "ace") {
                            this.$keybindingId = a;
                            var c = this;
                            r.loadModule([
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
                    this.setValue = function(a, b) {
                        this.session.doc.setValue(a);
                        if (!b) this.selectAll();
                        else if (b == 1) this.navigateFileEnd();
                        else if (b == -1) this.navigateFileStart();
                        return a;
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
                        return (this.getOption("fontSize") || e.computedStyle(this.container).fontSize);
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
                            var b = a.session;
                            if (!b || !b.bgTokenizer) return;
                            if (b.$bracketHighlight) {
                                b.$bracketHighlight.markerIds.forEach(function(a) {
                                    b.removeMarker(a);
                                });
                                b.$bracketHighlight = null;
                            }
                            var c = b.getMatchingBracketRanges(a.getCursorPosition());
                            if (!c && b.$mode.getMatching) c = b.$mode.getMatching(a.session);
                            if (!c) return;
                            var d = "ace_bracket";
                            if (!Array.isArray(c)) {
                                c = [
                                    c
                                ];
                            } else if (c.length == 1) {
                                d = "ace_error_bracket";
                            }
                            if (c.length == 2) {
                                if (n.comparePoints(c[0].end, c[1].start) == 0) c = [
                                    n.fromPoints(c[0].start, c[1].end), 
                                ];
                                else if (n.comparePoints(c[0].start, c[1].end) == 0) c = [
                                    n.fromPoints(c[1].start, c[0].end), 
                                ];
                            }
                            b.$bracketHighlight = {
                                ranges: c,
                                markerIds: c.map(function(a) {
                                    return b.addMarker(a, d, "text");
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
                            var b = a.session;
                            if (!b || !b.bgTokenizer) return;
                            var c = a.getCursorPosition();
                            var d = new s(a.session, c.row, c.column);
                            var e = d.getCurrentToken();
                            if (!e || !/\b(?:tag-open|tag-name)/.test(e.type)) {
                                b.removeMarker(b.$tagHighlight);
                                b.$tagHighlight = null;
                                return;
                            }
                            if (e.type.indexOf("tag-open") !== -1) {
                                e = d.stepForward();
                                if (!e) return;
                            }
                            var f = e.value;
                            var g = e.value;
                            var h = 0;
                            var i = d.stepBackward();
                            if (i.value === "<") {
                                do {
                                    i = e;
                                    e = d.stepForward();
                                    if (e) {
                                        if (e.type.indexOf("tag-name") !== -1) {
                                            g = e.value;
                                            if (f === g) {
                                                if (i.value === "<") {
                                                    h++;
                                                } else if (i.value === "</") {
                                                    h--;
                                                }
                                            }
                                        } else if (f === g && e.value === "/>") {
                                            h--;
                                        }
                                    }
                                }while (e && h >= 0)
                            } else {
                                do {
                                    e = i;
                                    i = d.stepBackward();
                                    if (e) {
                                        if (e.type.indexOf("tag-name") !== -1) {
                                            if (f === e.value) {
                                                if (i.value === "<") {
                                                    h++;
                                                } else if (i.value === "</") {
                                                    h--;
                                                }
                                            }
                                        } else if (e.value === "/>") {
                                            var j = 0;
                                            var k = i;
                                            while(k){
                                                if (k.type.indexOf("tag-name") !== -1 && k.value === f) {
                                                    h--;
                                                    break;
                                                } else if (k.value === "<") {
                                                    break;
                                                }
                                                k = d.stepBackward();
                                                j++;
                                            }
                                            for(var l = 0; l < j; l++){
                                                d.stepForward();
                                            }
                                        }
                                    }
                                }while (i && h <= 0)
                                d.stepForward();
                            }
                            if (!e) {
                                b.removeMarker(b.$tagHighlight);
                                b.$tagHighlight = null;
                                return;
                            }
                            var m = d.getCurrentTokenRow();
                            var o = d.getCurrentTokenColumn();
                            var p = new n(m, o, m, o + e.value.length);
                            var q = b.$backMarkers[b.$tagHighlight];
                            if (b.$tagHighlight && q != undefined && p.compareRange(q.range) !== 0) {
                                b.removeMarker(b.$tagHighlight);
                                b.$tagHighlight = null;
                            }
                            if (!b.$tagHighlight) b.$tagHighlight = b.addMarker(p, "ace_bracket", "text");
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
                    this.onTokenizerUpdate = function(a) {
                        var b = a.data;
                        this.renderer.updateLines(b.first, b.last);
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
                        var a = this.getSession();
                        var b;
                        if (this.$highlightActiveLine) {
                            if (this.$selectionStyle != "line" || !this.selection.isMultiLine()) b = this.getCursorPosition();
                            if (this.renderer.theme && this.renderer.theme.$selectionColorConflict && !this.selection.isEmpty()) b = false;
                            if (this.renderer.$maxLines && this.session.getLength() === 1 && !(this.renderer.$minLines > 1)) b = false;
                        }
                        if (a.$highlightLineMarker && !b) {
                            a.removeMarker(a.$highlightLineMarker.id);
                            a.$highlightLineMarker = null;
                        } else if (!a.$highlightLineMarker && b) {
                            var c = new n(b.row, b.column, b.row, Infinity);
                            c.id = a.addMarker(c, "ace_active-line", "screenLine");
                            a.$highlightLineMarker = c;
                        } else if (b) {
                            a.$highlightLineMarker.start.row = b.row;
                            a.$highlightLineMarker.end.row = b.row;
                            a.$highlightLineMarker.start.column = b.column;
                            a._signal("changeBackMarker");
                        }
                    };
                    this.onSelectionChange = function(a) {
                        var b = this.session;
                        if (b.$selectionMarker) {
                            b.removeMarker(b.$selectionMarker);
                        }
                        b.$selectionMarker = null;
                        if (!this.selection.isEmpty()) {
                            var c = this.selection.getRange();
                            var d = this.getSelectionStyle();
                            b.$selectionMarker = b.addMarker(c, "ace_selection", d);
                        } else {
                            this.$updateHighlightActiveLine();
                        }
                        var e = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
                        this.session.highlight(e);
                        this._signal("changeSelection");
                    };
                    this.$getSelectionHighLightRegexp = function() {
                        var a = this.session;
                        var b = this.getSelectionRange();
                        if (b.isEmpty() || b.isMultiLine()) return;
                        var c = b.start.column;
                        var d = b.end.column;
                        var e = a.getLine(b.start.row);
                        var f = e.substring(c, d);
                        if (f.length > 5000 || !/[\w\d]/.test(f)) return;
                        var g = this.$search.$assembleRegExp({
                            wholeWord: true,
                            caseSensitive: true,
                            needle: f
                        });
                        var h = e.substring(c - 1, d + 1);
                        if (!g.test(h)) return;
                        return g;
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
                        var a = this.getSelectedText();
                        var b = this.session.doc.getNewLineCharacter();
                        var c = false;
                        if (!a && this.$copyWithEmptySelection) {
                            c = true;
                            var d = this.selection.getAllRanges();
                            for(var e = 0; e < d.length; e++){
                                var f = d[e];
                                if (e && d[e - 1].start.row == f.start.row) continue;
                                a += this.session.getLine(f.start.row) + b;
                            }
                        }
                        var g = {
                            text: a
                        };
                        this._signal("copy", g);
                        t.lineMode = c ? g.text : false;
                        return g.text;
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
                        var c = b === t.lineMode;
                        var d = this.session;
                        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) {
                            if (c) d.insert({
                                row: this.selection.lead.row,
                                column: 0
                            }, b);
                            else this.insert(b);
                        } else if (c) {
                            this.selection.rangeList.ranges.forEach(function(a) {
                                d.insert({
                                    row: a.start.row,
                                    column: 0
                                }, b);
                            });
                        } else {
                            var e = b.split(/\r\n|\r|\n/);
                            var f = this.selection.rangeList.ranges;
                            var g = e.length == 2 && (!e[0] || !e[1]);
                            if (e.length != f.length || g) return this.commands.exec("insertstring", this, b);
                            for(var h = f.length; h--;){
                                var i = f[h];
                                if (!i.isEmpty()) d.remove(i);
                                d.insert(i.start, e[h]);
                            }
                        }
                    };
                    this.execCommand = function(a, b) {
                        return this.commands.exec(a, this, b);
                    };
                    this.insert = function(a, b) {
                        var c = this.session;
                        var d = c.getMode();
                        var e = this.getCursorPosition();
                        if (this.getBehavioursEnabled() && !b) {
                            var f = d.transformAction(c.getState(e.row), "insertion", this, c, a);
                            if (f) {
                                if (a !== f.text) {
                                    if (!this.inVirtualSelectionMode) {
                                        this.session.mergeUndoDeltas = false;
                                        this.mergeNextCommand = false;
                                    }
                                }
                                a = f.text;
                            }
                        }
                        if (a == "\t") a = this.session.getTabString();
                        if (!this.selection.isEmpty()) {
                            var g = this.getSelectionRange();
                            e = this.session.remove(g);
                            this.clearSelection();
                        } else if (this.session.getOverwrite() && a.indexOf("\n") == -1) {
                            var g = new n.fromPoints(e, e);
                            g.end.column += a.length;
                            this.session.remove(g);
                        }
                        if (a == "\n" || a == "\r\n") {
                            var h = c.getLine(e.row);
                            if (e.column > h.search(/\S|$/)) {
                                var i = h.substr(e.column).search(/\S|$/);
                                c.doc.removeInLine(e.row, e.column, e.column + i);
                            }
                        }
                        this.clearSelection();
                        var j = e.column;
                        var k = c.getState(e.row);
                        var h = c.getLine(e.row);
                        var l = d.checkOutdent(k, h, a);
                        c.insert(e, a);
                        if (f && f.selection) {
                            if (f.selection.length == 2) {
                                this.selection.setSelectionRange(new n(e.row, j + f.selection[0], e.row, j + f.selection[1]));
                            } else {
                                this.selection.setSelectionRange(new n(e.row + f.selection[0], f.selection[1], e.row + f.selection[2], f.selection[3]));
                            }
                        }
                        if (this.$enableAutoIndent) {
                            if (c.getDocument().isNewLine(a)) {
                                var m = d.getNextLineIndent(k, h.slice(0, e.column), c.getTabString());
                                c.insert({
                                    row: e.row + 1,
                                    column: 0
                                }, m);
                            }
                            if (l) d.autoOutdent(k, c, e.row);
                        }
                    };
                    this.autoIndent = function() {
                        var a = this.session;
                        var b = a.getMode();
                        var c, d;
                        if (this.selection.isEmpty()) {
                            c = 0;
                            d = a.doc.getLength() - 1;
                        } else {
                            var e = this.getSelectionRange();
                            c = e.start.row;
                            d = e.end.row;
                        }
                        var f = "";
                        var g = "";
                        var h = "";
                        var i, j, k;
                        var l = a.getTabString();
                        for(var m = c; m <= d; m++){
                            if (m > 0) {
                                f = a.getState(m - 1);
                                g = a.getLine(m - 1);
                                h = b.getNextLineIndent(f, g, l);
                            }
                            i = a.getLine(m);
                            j = b.$getIndent(i);
                            if (h !== j) {
                                if (j.length > 0) {
                                    k = new n(m, 0, m, j.length);
                                    a.remove(k);
                                }
                                if (h.length > 0) {
                                    a.insert({
                                        row: m,
                                        column: 0
                                    }, h);
                                }
                            }
                            b.autoOutdent(f, a, m);
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
                    this.applyComposition = function(a, b) {
                        if (b.extendLeft || b.extendRight) {
                            var c = this.selection.getRange();
                            c.start.column -= b.extendLeft;
                            c.end.column += b.extendRight;
                            if (c.start.column < 0) {
                                c.start.row--;
                                c.start.column += this.session.getLine(c.start.row).length + 1;
                            }
                            this.selection.setRange(c);
                            if (!a && !c.isEmpty()) this.remove();
                        }
                        if (a || !this.selection.isEmpty()) this.insert(a, true);
                        if (b.restoreStart || b.restoreEnd) {
                            var c = this.selection.getRange();
                            c.start.column -= b.restoreStart;
                            c.end.column -= b.restoreEnd;
                            this.selection.setRange(c);
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
                    this.remove = function(a) {
                        if (this.selection.isEmpty()) {
                            if (a == "left") this.selection.selectLeft();
                            else this.selection.selectRight();
                        }
                        var b = this.getSelectionRange();
                        if (this.getBehavioursEnabled()) {
                            var c = this.session;
                            var d = c.getState(b.start.row);
                            var e = c.getMode().transformAction(d, "deletion", this, c, b);
                            if (b.end.column === 0) {
                                var f = c.getTextRange(b);
                                if (f[f.length - 1] == "\n") {
                                    var g = c.getLine(b.end.row);
                                    if (/^\s+$/.test(g)) {
                                        b.end.column = g.length;
                                    }
                                }
                            }
                            if (e) b = e;
                        }
                        this.session.remove(b);
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
                        var a = this.getCursorPosition();
                        var b = a.column;
                        if (b === 0) return;
                        var c = this.session.getLine(a.row);
                        var d, e;
                        if (b < c.length) {
                            d = c.charAt(b) + c.charAt(b - 1);
                            e = new n(a.row, b - 1, a.row, b + 1);
                        } else {
                            d = c.charAt(b - 1) + c.charAt(b - 2);
                            e = new n(a.row, b - 2, a.row, b);
                        }
                        this.session.replace(e, d);
                        this.session.selection.moveToPosition(e.end);
                    };
                    this.toLowerCase = function() {
                        var a = this.getSelectionRange();
                        if (this.selection.isEmpty()) {
                            this.selection.selectWord();
                        }
                        var b = this.getSelectionRange();
                        var c = this.session.getTextRange(b);
                        this.session.replace(b, c.toLowerCase());
                        this.selection.setSelectionRange(a);
                    };
                    this.toUpperCase = function() {
                        var a = this.getSelectionRange();
                        if (this.selection.isEmpty()) {
                            this.selection.selectWord();
                        }
                        var b = this.getSelectionRange();
                        var c = this.session.getTextRange(b);
                        this.session.replace(b, c.toUpperCase());
                        this.selection.setSelectionRange(a);
                    };
                    this.indent = function() {
                        var a = this.session;
                        var b = this.getSelectionRange();
                        if (b.start.row < b.end.row) {
                            var c = this.$getSelectedRows();
                            a.indentRows(c.first, c.last, "\t");
                            return;
                        } else if (b.start.column < b.end.column) {
                            var d = a.getTextRange(b);
                            if (!/^\s+$/.test(d)) {
                                var c = this.$getSelectedRows();
                                a.indentRows(c.first, c.last, "\t");
                                return;
                            }
                        }
                        var e = a.getLine(b.start.row);
                        var g = b.start;
                        var h = a.getTabSize();
                        var i = a.documentToScreenColumn(g.row, g.column);
                        if (this.session.getUseSoftTabs()) {
                            var j = h - (i % h);
                            var k = f.stringRepeat(" ", j);
                        } else {
                            var j = i % h;
                            while(e[b.start.column - 1] == " " && j){
                                b.start.column--;
                                j--;
                            }
                            this.selection.setSelectionRange(b);
                            k = "\t";
                        }
                        return this.insert(k);
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
                        var a = this.$getSelectedRows();
                        var b = this.session;
                        var c = [];
                        for(var d = a.first; d <= a.last; d++)c.push(b.getLine(d));
                        c.sort(function(a, b) {
                            if (a.toLowerCase() < b.toLowerCase()) return -1;
                            if (a.toLowerCase() > b.toLowerCase()) return 1;
                            return 0;
                        });
                        var e = new n(0, 0, 0, 0);
                        for(var d = a.first; d <= a.last; d++){
                            var f = b.getLine(d);
                            e.start.row = d;
                            e.end.row = d;
                            e.end.column = f.length;
                            b.replace(e, c[d - a.first]);
                        }
                    };
                    this.toggleCommentLines = function() {
                        var a = this.session.getState(this.getCursorPosition().row);
                        var b = this.$getSelectedRows();
                        this.session.getMode().toggleCommentLines(a, this.session, b.first, b.last);
                    };
                    this.toggleBlockComment = function() {
                        var a = this.getCursorPosition();
                        var b = this.session.getState(a.row);
                        var c = this.getSelectionRange();
                        this.session.getMode().toggleBlockComment(b, this.session, c, a);
                    };
                    this.getNumberAt = function(a, b) {
                        var c = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
                        c.lastIndex = 0;
                        var d = this.session.getLine(a);
                        while(c.lastIndex < b){
                            var e = c.exec(d);
                            if (e.index <= b && e.index + e[0].length >= b) {
                                var f = {
                                    value: e[0],
                                    start: e.index,
                                    end: e.index + e[0].length
                                };
                                return f;
                            }
                        }
                        return null;
                    };
                    this.modifyNumber = function(a) {
                        var b = this.selection.getCursor().row;
                        var c = this.selection.getCursor().column;
                        var d = new n(b, c - 1, b, c);
                        var e = this.session.getTextRange(d);
                        if (!isNaN(parseFloat(e)) && isFinite(e)) {
                            var f = this.getNumberAt(b, c);
                            if (f) {
                                var g = f.value.indexOf(".") >= 0 ? f.start + f.value.indexOf(".") + 1 : f.end;
                                var h = f.start + f.value.length - g;
                                var i = parseFloat(f.value);
                                i *= Math.pow(10, h);
                                if (g !== f.end && c < g) {
                                    a *= Math.pow(10, f.end - c - 1);
                                } else {
                                    a *= Math.pow(10, f.end - c);
                                }
                                i += a;
                                i /= Math.pow(10, h);
                                var j = i.toFixed(h);
                                var k = new n(b, f.start, b, f.end);
                                this.session.replace(k, j);
                                this.moveCursorTo(b, Math.max(f.start + 1, c + j.length - f.value.length));
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
                        var a = this.selection.getCursor().row;
                        var b = this.selection.getCursor().column;
                        this.selection.selectWord();
                        var c = this.getSelectedText();
                        var d = this.selection.getWordRange().start.column;
                        var e = c.replace(/([a-z]+|[A-Z]+)(?=[A-Z_]|$)/g, "$1 ").split(/\s/);
                        var g = b - d - 1;
                        if (g < 0) g = 0;
                        var h = 0, i = 0;
                        var j = this;
                        if (c.match(/[A-Za-z0-9_]+/)) {
                            e.forEach(function(b, e) {
                                i = h + b.length;
                                if (g >= h && g <= i) {
                                    c = b;
                                    j.selection.clearSelection();
                                    j.moveCursorTo(a, h + d);
                                    j.selection.selectTo(a, i + d);
                                }
                                h = i;
                            });
                        }
                        var k = this.$toggleWordPairs;
                        var l;
                        for(var m = 0; m < k.length; m++){
                            var n = k[m];
                            for(var o = 0; o <= 1; o++){
                                var p = +!o;
                                var q = c.match(new RegExp("^\\s?_?(" + f.escapeRegExp(n[o]) + ")\\s?$", "i"));
                                if (q) {
                                    var r = c.match(new RegExp("([_]|^|\\s)(" + f.escapeRegExp(q[1]) + ")($|\\s)", "g"));
                                    if (r) {
                                        l = c.replace(new RegExp(f.escapeRegExp(n[o]), "i"), function(a) {
                                            var b = n[p];
                                            if (a.toUpperCase() == a) {
                                                b = b.toUpperCase();
                                            } else if (a.charAt(0).toUpperCase() == a.charAt(0)) {
                                                b = b.substr(0, 0) + n[p].charAt(0).toUpperCase() + b.substr(1);
                                            }
                                            return b;
                                        });
                                        this.insert(l);
                                        l = "";
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
                        var a = this.selection;
                        var b = this.session;
                        var c = a.getRange();
                        var d = a.isBackwards();
                        if (c.isEmpty()) {
                            var e = c.start.row;
                            b.duplicateLines(e, e);
                        } else {
                            var f = d ? c.start : c.end;
                            var g = b.insert(f, b.getTextRange(c), false);
                            c.start = f;
                            c.end = g;
                            a.setSelectionRange(c, d);
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
                    this.$moveLines = function(a, b) {
                        var c, d;
                        var e = this.selection;
                        if (!e.inMultiSelectMode || this.inVirtualSelectionMode) {
                            var f = e.toOrientedRange();
                            c = this.$getSelectedRows(f);
                            d = this.session.$moveLines(c.first, c.last, b ? 0 : a);
                            if (b && a == -1) d = 0;
                            f.moveBy(d, 0);
                            e.fromOrientedRange(f);
                        } else {
                            var g = e.rangeList.ranges;
                            e.rangeList.detach(this.session);
                            this.inVirtualSelectionMode = true;
                            var h = 0;
                            var i = 0;
                            var j = g.length;
                            for(var k = 0; k < j; k++){
                                var l = k;
                                g[k].moveBy(h, 0);
                                c = this.$getSelectedRows(g[k]);
                                var m = c.first;
                                var n = c.last;
                                while(++k < j){
                                    if (i) g[k].moveBy(i, 0);
                                    var o = this.$getSelectedRows(g[k]);
                                    if (b && o.first != n) break;
                                    else if (!b && o.first > n + 1) break;
                                    n = o.last;
                                }
                                k--;
                                h = this.session.$moveLines(m, n, b ? 0 : a);
                                if (b && a == -1) l = k + 1;
                                while(l <= k){
                                    g[l].moveBy(h, 0);
                                    l++;
                                }
                                if (!b) h = 0;
                                i += h;
                            }
                            e.fromOrientedRange(e.ranges[0]);
                            e.rangeList.attach(this.session);
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
                    this.$moveByPage = function(a, b) {
                        var c = this.renderer;
                        var d = this.renderer.layerConfig;
                        var e = a * Math.floor(d.height / d.lineHeight);
                        if (b === true) {
                            this.selection.$moveSelection(function() {
                                this.moveCursorBy(e, 0);
                            });
                        } else if (b === false) {
                            this.selection.moveCursorBy(e, 0);
                            this.selection.clearSelection();
                        }
                        var f = c.scrollTop;
                        c.scrollBy(0, e * d.lineHeight);
                        if (b != null) c.scrollCursorIntoView(null, 0.5);
                        c.animateScrolling(f);
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
                    this.jumpToMatching = function(a, b) {
                        var c = this.getCursorPosition();
                        var d = new s(this.session, c.row, c.column);
                        var e = d.getCurrentToken();
                        var f = e || d.stepForward();
                        if (!f) return;
                        var g;
                        var h = false;
                        var i = {};
                        var j = c.column - f.start;
                        var k;
                        var l = {
                            ")": "(",
                            "(": "(",
                            "]": "[",
                            "[": "[",
                            "{": "{",
                            "}": "{"
                        };
                        do {
                            if (f.value.match(/[{}()\[\]]/g)) {
                                for(; j < f.value.length && !h; j++){
                                    if (!l[f.value[j]]) {
                                        continue;
                                    }
                                    k = l[f.value[j]] + "." + f.type.replace("rparen", "lparen");
                                    if (isNaN(i[k])) {
                                        i[k] = 0;
                                    }
                                    switch(f.value[j]){
                                        case "(":
                                        case "[":
                                        case "{":
                                            i[k]++;
                                            break;
                                        case ")":
                                        case "]":
                                        case "}":
                                            i[k]--;
                                            if (i[k] === -1) {
                                                g = "bracket";
                                                h = true;
                                            }
                                            break;
                                    }
                                }
                            } else if (f.type.indexOf("tag-name") !== -1) {
                                if (isNaN(i[f.value])) {
                                    i[f.value] = 0;
                                }
                                if (e.value === "<") {
                                    i[f.value]++;
                                } else if (e.value === "</") {
                                    i[f.value]--;
                                }
                                if (i[f.value] === -1) {
                                    g = "tag";
                                    h = true;
                                }
                            }
                            if (!h) {
                                e = f;
                                f = d.stepForward();
                                j = 0;
                            }
                        }while (f && !h)
                        if (!g) return;
                        var m, o;
                        if (g === "bracket") {
                            m = this.session.getBracketRange(c);
                            if (!m) {
                                m = new n(d.getCurrentTokenRow(), d.getCurrentTokenColumn() + j - 1, d.getCurrentTokenRow(), d.getCurrentTokenColumn() + j - 1);
                                o = m.start;
                                if (b || (o.row === c.row && Math.abs(o.column - c.column) < 2)) m = this.session.getBracketRange(o);
                            }
                        } else if (g === "tag") {
                            if (f && f.type.indexOf("tag-name") !== -1) var p = f.value;
                            else return;
                            m = new n(d.getCurrentTokenRow(), d.getCurrentTokenColumn() - 2, d.getCurrentTokenRow(), d.getCurrentTokenColumn() - 2);
                            if (m.compare(c.row, c.column) === 0) {
                                h = false;
                                do {
                                    f = e;
                                    e = d.stepBackward();
                                    if (e) {
                                        if (e.type.indexOf("tag-close") !== -1) {
                                            m.setEnd(d.getCurrentTokenRow(), d.getCurrentTokenColumn() + 1);
                                        }
                                        if (f.value === p && f.type.indexOf("tag-name") !== -1) {
                                            if (e.value === "<") {
                                                i[p]++;
                                            } else if (e.value === "</") {
                                                i[p]--;
                                            }
                                            if (i[p] === 0) h = true;
                                        }
                                    }
                                }while (e && !h)
                            }
                            if (f && f.type.indexOf("tag-name")) {
                                o = m.start;
                                if (o.row == c.row && Math.abs(o.column - c.column) < 2) o = m.end;
                            }
                        }
                        o = (m && m.cursor) || o;
                        if (o) {
                            if (a) {
                                if (m && b) {
                                    this.selection.setRange(m);
                                } else if (m && m.isEqual(this.getSelectionRange())) {
                                    this.clearSelection();
                                } else {
                                    this.selection.selectTo(o.row, o.column);
                                }
                            } else {
                                this.selection.moveTo(o.row, o.column);
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
                    this.replace = function(a, b) {
                        if (b) this.$search.set(b);
                        var c = this.$search.find(this.session);
                        var d = 0;
                        if (!c) return d;
                        if (this.$tryReplace(c, a)) {
                            d = 1;
                        }
                        this.selection.setSelectionRange(c);
                        this.renderer.scrollSelectionIntoView(c.start, c.end);
                        return d;
                    };
                    this.replaceAll = function(a, b) {
                        if (b) {
                            this.$search.set(b);
                        }
                        var c = this.$search.findAll(this.session);
                        var d = 0;
                        if (!c.length) return d;
                        var e = this.getSelectionRange();
                        this.selection.moveTo(0, 0);
                        for(var f = c.length - 1; f >= 0; --f){
                            if (this.$tryReplace(c[f], a)) {
                                d++;
                            }
                        }
                        this.selection.setSelectionRange(e);
                        return d;
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
                    this.find = function(a, b, c) {
                        if (!b) b = {};
                        if (typeof a == "string" || a instanceof RegExp) b.needle = a;
                        else if (typeof a == "object") d.mixin(b, a);
                        var e = this.selection.getRange();
                        if (b.needle == null) {
                            a = this.session.getTextRange(e) || this.$search.$options.needle;
                            if (!a) {
                                e = this.session.getWordRange(e.start.row, e.start.column);
                                a = this.session.getTextRange(e);
                            }
                            this.$search.set({
                                needle: a
                            });
                        }
                        this.$search.set(b);
                        if (!b.start) this.$search.set({
                            start: e
                        });
                        var f = this.$search.find(this.session);
                        if (b.preventScroll) return f;
                        if (f) {
                            this.revealRange(f, c);
                            return f;
                        }
                        if (b.backwards) e.start = e.end;
                        else e.end = e.start;
                        this.selection.setRange(e);
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
                    this.setAutoScrollEditorIntoView = function(a) {
                        if (!a) return;
                        var b;
                        var c = this;
                        var d = false;
                        if (!this.$scrollAnchor) this.$scrollAnchor = document.createElement("div");
                        var e = this.$scrollAnchor;
                        e.style.cssText = "position:absolute";
                        this.container.insertBefore(e, this.container.firstChild);
                        var f = this.on("changeSelection", function() {
                            d = true;
                        });
                        var g = this.renderer.on("beforeRender", function() {
                            if (d) b = c.renderer.container.getBoundingClientRect();
                        });
                        var h = this.renderer.on("afterRender", function() {
                            if (d && b && (c.isFocused() || (c.searchBox && c.searchBox.isFocused()))) {
                                var a = c.renderer;
                                var f = a.$cursorLayer.$pixelPos;
                                var g = a.layerConfig;
                                var h = f.top - g.offset;
                                if (f.top >= 0 && h + b.top < 0) {
                                    d = true;
                                } else if (f.top < g.height && f.top + b.top + g.lineHeight > window.innerHeight) {
                                    d = false;
                                } else {
                                    d = null;
                                }
                                if (d != null) {
                                    e.style.top = h + "px";
                                    e.style.left = f.left + "px";
                                    e.style.height = g.lineHeight + "px";
                                    e.scrollIntoView(d);
                                }
                                d = b = null;
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
                        var a = this.$cursorStyle || "ace";
                        var b = this.renderer.$cursorLayer;
                        if (!b) return;
                        b.setSmoothBlinking(/smooth/.test(a));
                        b.isBlinking = !this.$readOnly && a != "wide";
                        e.setCssClass(b.element, "ace_slim-cursors", /slim/.test(a));
                    };
                    this.prompt = function(a, b, c) {
                        var d = this;
                        r.loadModule("./ext/prompt", function(e) {
                            e.prompt(d, a, b, c);
                        });
                    };
                }.call(u.prototype));
                r.defineOptions(u.prototype, "editor", {
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
                                        e.removeCssClass(this.container, "ace_hasPlaceholder");
                                        this.renderer.placeholderNode.remove();
                                        this.renderer.placeholderNode = null;
                                    } else if (!a && !this.renderer.placeholderNode) {
                                        this.renderer.on("afterRender", this.$updatePlaceholder);
                                        e.addCssClass(this.container, "ace_hasPlaceholder");
                                        var b = e.createElement("div");
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
                    getText: function(a, b) {
                        return ((Math.abs(a.selection.lead.row - b) || b + 1 + (b < 9 ? "\xb7" : "")) + "");
                    },
                    getWidth: function(a, b, c) {
                        return (Math.max(b.toString().length, (c.lastRow + 1).toString().length, 2) * c.characterWidth);
                    },
                    update: function(a, b) {
                        b.renderer.$loop.schedule(b.renderer.CHANGE_GUTTER);
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
                b.Editor = u;
            });
            ace.define("ace/undomanager", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(a, b, c) {
                "use strict";
                var d = function() {
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
                    this.markIgnored = function(a, b) {
                        if (b == null) b = this.$rev + 1;
                        var c = this.$undoStack;
                        for(var d = c.length; d--;){
                            var e = c[d][0];
                            if (e.id <= a) break;
                            if (e.id < b) e.ignore = true;
                        }
                        this.lastDeltas = null;
                    };
                    this.getSelection = function(a, b) {
                        var c = this.selections;
                        for(var d = c.length; d--;){
                            var e = c[d];
                            if (e.rev < a) {
                                if (b) e = c[d + 1];
                                return e;
                            }
                        }
                    };
                    this.getRevision = function() {
                        return this.$rev;
                    };
                    this.getDeltas = function(a, b) {
                        if (b == null) b = this.$rev + 1;
                        var c = this.$undoStack;
                        var d = null, e = 0;
                        for(var f = c.length; f--;){
                            var g = c[f][0];
                            if (g.id < b && !d) d = f + 1;
                            if (g.id <= a) {
                                e = f + 1;
                                break;
                            }
                        }
                        return c.slice(e, d);
                    };
                    this.getChangedRanges = function(a, b) {
                        if (b == null) b = this.$rev + 1;
                    };
                    this.getChangedLines = function(a, b) {
                        if (b == null) b = this.$rev + 1;
                    };
                    this.undo = function(a, b) {
                        this.lastDeltas = null;
                        var c = this.$undoStack;
                        if (!e(c, c.length)) return;
                        if (!a) a = this.$session;
                        if (this.$redoStackBaseRev !== this.$rev && this.$redoStack.length) this.$redoStack = [];
                        this.$fromUndo = true;
                        var d = c.pop();
                        var f = null;
                        if (d) {
                            f = a.undoChanges(d, b);
                            this.$redoStack.push(d);
                            this.$syncRev();
                        }
                        this.$fromUndo = false;
                        return f;
                    };
                    this.redo = function(a, b) {
                        this.lastDeltas = null;
                        if (!a) a = this.$session;
                        this.$fromUndo = true;
                        if (this.$redoStackBaseRev != this.$rev) {
                            var c = this.getDeltas(this.$redoStackBaseRev, this.$rev + 1);
                            u(this.$redoStack, c);
                            this.$redoStackBaseRev = this.$rev;
                            this.$redoStack.forEach(function(a) {
                                a[0].id = ++this.$maxRev;
                            }, this);
                        }
                        var d = this.$redoStack.pop();
                        var e = null;
                        if (d) {
                            e = a.redoChanges(d, b);
                            this.$undoStack.push(d);
                            this.$syncRev();
                        }
                        this.$fromUndo = false;
                        return e;
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
                }.call(d.prototype));
                function e(a, b) {
                    for(var c = b; c--;){
                        var d = a[c];
                        if (d && !d[0].ignore) {
                            while(c < b - 1){
                                var e = o(a[c], a[c + 1]);
                                a[c] = e[0];
                                a[c + 1] = e[1];
                                c++;
                            }
                            return true;
                        }
                    }
                }
                var f = a("./range").Range;
                var g = f.comparePoints;
                var h = f.comparePoints;
                function i(a) {
                    var b = a.action == "insert";
                    var c = a.start;
                    var d = a.end;
                    var e = (d.row - c.row) * (b ? 1 : -1);
                    var f = (d.column - c.column) * (b ? 1 : -1);
                    if (b) d = c;
                    for(var g in this.marks){
                        var i = this.marks[g];
                        var j = h(i, c);
                        if (j < 0) {
                            continue;
                        }
                        if (j === 0) {
                            if (b) {
                                if (i.bias == 1) {
                                    j = 1;
                                } else {
                                    i.bias == -1;
                                    continue;
                                }
                            }
                        }
                        var k = b ? j : h(i, d);
                        if (k > 0) {
                            i.row += e;
                            i.column += i.row == d.row ? f : 0;
                            continue;
                        }
                        if (!b && k <= 0) {
                            i.row = c.row;
                            i.column = c.column;
                            if (k === 0) i.bias = 1;
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
                    for(var c = a.length; c--;){
                        for(var d = 0; d < b.length; d++){
                            if (!n(a[c], b[d])) {
                                while(c < a.length){
                                    while(d--){
                                        n(b[d], a[c]);
                                    }
                                    d = b.length;
                                    c++;
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
                function p(a, b) {
                    var c = a.action == "insert";
                    var d = b.action == "insert";
                    if (c && d) {
                        if (g(a.start, b.start) < 0) {
                            q(b, a, 1);
                        } else {
                            q(a, b, 1);
                        }
                    } else if (c && !d) {
                        if (g(a.start, b.end) >= 0) {
                            q(a, b, -1);
                        } else if (g(a.start, b.start) <= 0) {
                            q(b, a, +1);
                        } else {
                            q(a, f.fromPoints(b.start, a.start), -1);
                            q(b, a, +1);
                        }
                    } else if (!c && d) {
                        if (g(b.start, a.end) >= 0) {
                            q(b, a, -1);
                        } else if (g(b.start, a.start) <= 0) {
                            q(a, b, +1);
                        } else {
                            q(b, f.fromPoints(a.start, b.start), -1);
                            q(a, b, +1);
                        }
                    } else if (!c && !d) {
                        if (g(b.start, a.end) >= 0) {
                            q(b, a, -1);
                        } else if (g(b.end, a.start) <= 0) {
                            q(a, b, -1);
                        } else {
                            var e, h;
                            if (g(a.start, b.start) < 0) {
                                e = a;
                                a = s(a, b.start);
                            }
                            if (g(a.end, b.end) > 0) {
                                h = s(a, b.end);
                            }
                            r(b.end, a.start, a.end, -1);
                            if (h && !e) {
                                a.lines = h.lines;
                                a.start = h.start;
                                a.end = h.end;
                                h = a;
                            }
                            return [
                                b,
                                e,
                                h
                            ].filter(Boolean);
                        }
                    }
                    return [
                        b,
                        a
                    ];
                }
                function q(a, b, c) {
                    r(a.start, b.start, b.end, c);
                    r(a.end, b.start, b.end, c);
                }
                function r(a, b, c, d) {
                    if (a.row == (d == 1 ? b : c).row) {
                        a.column += d * (c.column - b.column);
                    }
                    a.row += d * (c.row - b.row);
                }
                function s(a, b) {
                    var c = a.lines;
                    var d = a.end;
                    a.end = j(b);
                    var e = a.end.row - a.start.row;
                    var f = c.splice(e, c.length);
                    var g = e ? b.column : b.column - a.start.column;
                    c.push(f[0].substring(0, g));
                    f[0] = f[0].substr(g);
                    var h = {
                        start: j(b),
                        end: d,
                        lines: f,
                        action: a.action
                    };
                    return h;
                }
                function t(a, b) {
                    b = k(b);
                    for(var c = a.length; c--;){
                        var d = a[c];
                        for(var e = 0; e < d.length; e++){
                            var f = d[e];
                            var g = p(f, b);
                            b = g[0];
                            if (g.length != 2) {
                                if (g[2]) {
                                    d.splice(e + 1, 1, g[1], g[2]);
                                    e++;
                                } else if (!g[1]) {
                                    d.splice(e, 1);
                                    e--;
                                }
                            }
                        }
                        if (!d.length) {
                            a.splice(c, 1);
                        }
                    }
                    return a;
                }
                function u(a, b) {
                    for(var c = 0; c < b.length; c++){
                        var d = b[c];
                        for(var e = 0; e < d.length; e++){
                            t(a, d[e]);
                        }
                    }
                }
                b.UndoManager = d;
            });
            ace.define("ace/layer/lines", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/dom");
                var e = function(a, b) {
                    this.element = a;
                    this.canvasHeight = b || 500000;
                    this.element.style.height = this.canvasHeight * 2 + "px";
                    this.cells = [];
                    this.cellCache = [];
                    this.$offsetCoefficient = 0;
                };
                (function() {
                    this.moveContainer = function(a) {
                        d.translate(this.element, 0, -((a.firstRowScreen * a.lineHeight) % this.canvasHeight) - a.offset * this.$offsetCoefficient);
                    };
                    this.pageChanged = function(a, b) {
                        return (Math.floor((a.firstRowScreen * a.lineHeight) / this.canvasHeight) !== Math.floor((b.firstRowScreen * b.lineHeight) / this.canvasHeight));
                    };
                    this.computeLineTop = function(a, b, c) {
                        var d = b.firstRowScreen * b.lineHeight;
                        var e = Math.floor(d / this.canvasHeight);
                        var f = c.documentToScreenRow(a, 0) * b.lineHeight;
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
                            var b = d.createFragment(this.element);
                            for(var c = 0; c < a.length; c++){
                                b.appendChild(a[c].element);
                            }
                            this.element.appendChild(b);
                        } else {
                            this.cells.push(a);
                            this.element.appendChild(a.element);
                        }
                    };
                    this.unshift = function(a) {
                        if (Array.isArray(a)) {
                            this.cells.unshift.apply(this.cells, a);
                            var b = d.createFragment(this.element);
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
                    this.createCell = function(a, b, c, e) {
                        var f = this.cellCache.pop();
                        if (!f) {
                            var g = d.createElement("div");
                            if (e) e(g);
                            this.element.appendChild(g);
                            f = {
                                element: g,
                                text: "",
                                row: a
                            };
                        }
                        f.row = a;
                        return f;
                    };
                }.call(e.prototype));
                b.Lines = e;
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
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/dom");
                var e = a("../lib/oop");
                var f = a("../lib/lang");
                var g = a("../lib/event_emitter").EventEmitter;
                var h = a("./lines").Lines;
                var i = function(a) {
                    this.element = d.createElement("div");
                    this.element.className = "ace_layer ace_gutter-layer";
                    a.appendChild(this.element);
                    this.setShowFoldWidgets(this.$showFoldWidgets);
                    this.gutterWidth = 0;
                    this.$annotations = [];
                    this.$updateAnnotations = this.$updateAnnotations.bind(this);
                    this.$lines = new h(this.element);
                    this.$lines.$offsetCoefficient = 1;
                };
                (function() {
                    e.implement(this, g);
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
                    this.setAnnotations = function(a) {
                        this.$annotations = [];
                        for(var b = 0; b < a.length; b++){
                            var c = a[b];
                            var d = c.row;
                            var e = this.$annotations[d];
                            if (!e) e = this.$annotations[d] = {
                                text: []
                            };
                            var g = c.text;
                            g = g ? f.escapeHTML(g) : c.html || "";
                            if (e.text.indexOf(g) === -1) e.text.push(g);
                            var h = c.type;
                            if (h == "error") e.className = " ace_error";
                            else if (h == "warning" && e.className != " ace_error") e.className = " ace_warning";
                            else if (h == "info" && !e.className) e.className = " ace_info";
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
                        var b = this.session;
                        var c = a.firstRow;
                        var d = Math.min(a.lastRow + a.gutterOffset, b.getLength() - 1);
                        this.oldLastRow = d;
                        this.config = a;
                        this.$lines.moveContainer(a);
                        this.$updateCursorRow();
                        var e = b.getNextFoldLine(c);
                        var f = e ? e.start.row : Infinity;
                        var g = null;
                        var h = -1;
                        var i = c;
                        while(true){
                            if (i > f) {
                                i = e.end.row + 1;
                                e = b.getNextFoldLine(i, e);
                                f = e ? e.start.row : Infinity;
                            }
                            if (i > d) {
                                while(this.$lines.getLength() > h + 1)this.$lines.pop();
                                break;
                            }
                            g = this.$lines.get(++h);
                            if (g) {
                                g.row = i;
                            } else {
                                g = this.$lines.createCell(i, a, this.session, j);
                                this.$lines.push(g);
                            }
                            this.$renderCell(g, a, e, i);
                            i++;
                        }
                        this._signal("afterRender");
                        this.$updateGutterWidth(a);
                    };
                    this.$updateGutterWidth = function(a) {
                        var b = this.session;
                        var c = b.gutterRenderer || this.$renderer;
                        var d = b.$firstLineNumber;
                        var e = this.$lines.last() ? this.$lines.last().text : "";
                        if (this.$fixedWidth || b.$useWrapMode) e = b.getLength() + d - 1;
                        var f = c ? c.getWidth(b, e, a) : e.toString().length * a.characterWidth;
                        var g = this.$padding || this.$computePadding();
                        f += g.left + g.right;
                        if (f !== this.gutterWidth && !isNaN(f)) {
                            this.gutterWidth = f;
                            this.element.parentNode.style.width = this.element.style.width = Math.ceil(this.gutterWidth) + "px";
                            this._signal("changeGutterWidth", f);
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
                        var a = this.session.selection.cursor.row;
                        this.$cursorRow = a;
                        if (this.$cursorCell && this.$cursorCell.row == a) return;
                        if (this.$cursorCell) this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
                        var b = this.$lines.cells;
                        this.$cursorCell = null;
                        for(var c = 0; c < b.length; c++){
                            var d = b[c];
                            if (d.row >= this.$cursorRow) {
                                if (d.row > this.$cursorRow) {
                                    var e = this.session.getFoldLine(this.$cursorRow);
                                    if (c > 0 && e && e.start.row == b[c - 1].row) d = b[c - 1];
                                    else break;
                                }
                                d.element.className = "ace_gutter-active-line " + d.element.className;
                                this.$cursorCell = d;
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
                    this.$renderLines = function(a, b, c) {
                        var d = [];
                        var e = b;
                        var f = this.session.getNextFoldLine(e);
                        var g = f ? f.start.row : Infinity;
                        while(true){
                            if (e > g) {
                                e = f.end.row + 1;
                                f = this.session.getNextFoldLine(e, f);
                                g = f ? f.start.row : Infinity;
                            }
                            if (e > c) break;
                            var h = this.$lines.createCell(e, a, this.session, j);
                            this.$renderCell(h, a, f, e);
                            d.push(h);
                            e++;
                        }
                        return d;
                    };
                    this.$renderCell = function(a, b, c, e) {
                        var f = a.element;
                        var g = this.session;
                        var h = f.childNodes[0];
                        var i = f.childNodes[1];
                        var j = g.$firstLineNumber;
                        var k = g.$breakpoints;
                        var l = g.$decorations;
                        var m = g.gutterRenderer || this.$renderer;
                        var n = this.$showFoldWidgets && g.foldWidgets;
                        var o = c ? c.start.row : Number.MAX_VALUE;
                        var p = "ace_gutter-cell ";
                        if (this.$highlightGutterLine) {
                            if (e == this.$cursorRow || (c && e < this.$cursorRow && e >= o && this.$cursorRow <= c.end.row)) {
                                p += "ace_gutter-active-line ";
                                if (this.$cursorCell != a) {
                                    if (this.$cursorCell) this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "");
                                    this.$cursorCell = a;
                                }
                            }
                        }
                        if (k[e]) p += k[e];
                        if (l[e]) p += l[e];
                        if (this.$annotations[e]) p += this.$annotations[e].className;
                        if (f.className != p) f.className = p;
                        if (n) {
                            var q = n[e];
                            if (q == null) q = n[e] = g.getFoldWidget(e);
                        }
                        if (q) {
                            var p = "ace_fold-widget ace_" + q;
                            if (q == "start" && e == o && e < c.end.row) p += " ace_closed";
                            else p += " ace_open";
                            if (i.className != p) i.className = p;
                            var r = b.lineHeight + "px";
                            d.setStyle(i.style, "height", r);
                            d.setStyle(i.style, "display", "inline-block");
                        } else {
                            if (i) {
                                d.setStyle(i.style, "display", "none");
                            }
                        }
                        var s = (m ? m.getText(g, e) : e + j).toString();
                        if (s !== h.data) {
                            h.data = s;
                        }
                        d.setStyle(a.element.style, "height", this.$lines.computeLineHeight(e, b, g) + "px");
                        d.setStyle(a.element.style, "top", this.$lines.computeLineTop(e, b, g) + "px");
                        a.text = s;
                        return a;
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
                        if (a) d.addCssClass(this.element, "ace_folding-enabled");
                        else d.removeCssClass(this.element, "ace_folding-enabled");
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
                        var a = d.computedStyle(this.element.firstChild);
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
                }.call(i.prototype));
                function j(a) {
                    var b = document.createTextNode("");
                    a.appendChild(b);
                    var c = d.createElement("span");
                    a.appendChild(c);
                    return a;
                }
                b.Gutter = i;
            });
            ace.define("ace/layer/marker", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/dom"
            ], function(a, b, c) {
                "use strict";
                var d = a("../range").Range;
                var e = a("../lib/dom");
                var f = function(a) {
                    this.element = e.createElement("div");
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
                    this.elt = function(a, b) {
                        var c = this.i != -1 && this.element.childNodes[this.i];
                        if (!c) {
                            c = document.createElement("div");
                            this.element.appendChild(c);
                            this.i = -1;
                        } else {
                            this.i++;
                        }
                        c.style.cssText = b;
                        c.className = a;
                    };
                    this.update = function(a) {
                        if (!a) return;
                        this.config = a;
                        this.i = 0;
                        var b;
                        for(var c in this.markers){
                            var d = this.markers[c];
                            if (!d.range) {
                                d.update(b, this, this.session, a);
                                continue;
                            }
                            var e = d.range.clipRows(a.firstRow, a.lastRow);
                            if (e.isEmpty()) continue;
                            e = e.toScreenRange(this.session);
                            if (d.renderer) {
                                var f = this.$getTop(e.start.row, a);
                                var g = this.$padding + e.start.column * a.characterWidth;
                                d.renderer(b, e, g, f, a);
                            } else if (d.type == "fullLine") {
                                this.drawFullLineMarker(b, e, d.clazz, a);
                            } else if (d.type == "screenLine") {
                                this.drawScreenLineMarker(b, e, d.clazz, a);
                            } else if (e.isMultiLine()) {
                                if (d.type == "text") this.drawTextMarker(b, e, d.clazz, a);
                                else this.drawMultiLineMarker(b, e, d.clazz, a);
                            } else {
                                this.drawSingleLineMarker(b, e, d.clazz + " ace_start" + " ace_br15", a);
                            }
                        }
                        if (this.i != -1) {
                            while(this.i < this.element.childElementCount)this.element.removeChild(this.element.lastChild);
                        }
                    };
                    this.$getTop = function(a, b) {
                        return ((a - b.firstRowScreen) * b.lineHeight);
                    };
                    function a(a, b, c, d) {
                        return ((a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0));
                    }
                    this.drawTextMarker = function(b, c, e, f, g) {
                        var h = this.session;
                        var i = c.start.row;
                        var j = c.end.row;
                        var k = i;
                        var l = 0;
                        var m = 0;
                        var n = h.getScreenLastRowColumn(k);
                        var o = new d(k, c.start.column, k, m);
                        for(; k <= j; k++){
                            o.start.row = o.end.row = k;
                            o.start.column = k == i ? c.start.column : h.getRowWrapIndent(k);
                            o.end.column = n;
                            l = m;
                            m = n;
                            n = k + 1 < j ? h.getScreenLastRowColumn(k + 1) : k == j ? 0 : c.end.column;
                            this.drawSingleLineMarker(b, o, e + (k == i ? " ace_start" : "") + " ace_br" + a(k == i || (k == i + 1 && c.start.column), l < m, m > n, k == j), f, k == j ? 0 : 1, g);
                        }
                    };
                    this.drawMultiLineMarker = function(a, b, c, d, e) {
                        var f = this.$padding;
                        var g = d.lineHeight;
                        var h = this.$getTop(b.start.row, d);
                        var i = f + b.start.column * d.characterWidth;
                        e = e || "";
                        if (this.session.$bidiHandler.isBidiRow(b.start.row)) {
                            var j = b.clone();
                            j.end.row = j.start.row;
                            j.end.column = this.session.getLine(j.start.row).length;
                            this.drawBidiSingleLineMarker(a, j, c + " ace_br1 ace_start", d, null, e);
                        } else {
                            this.elt(c + " ace_br1 ace_start", "height:" + g + "px;" + "right:0;" + "top:" + h + "px;left:" + i + "px;" + (e || ""));
                        }
                        if (this.session.$bidiHandler.isBidiRow(b.end.row)) {
                            var j = b.clone();
                            j.start.row = j.end.row;
                            j.start.column = 0;
                            this.drawBidiSingleLineMarker(a, j, c + " ace_br12", d, null, e);
                        } else {
                            h = this.$getTop(b.end.row, d);
                            var k = b.end.column * d.characterWidth;
                            this.elt(c + " ace_br12", "height:" + g + "px;" + "width:" + k + "px;" + "top:" + h + "px;" + "left:" + f + "px;" + (e || ""));
                        }
                        g = (b.end.row - b.start.row - 1) * d.lineHeight;
                        if (g <= 0) return;
                        h = this.$getTop(b.start.row + 1, d);
                        var l = (b.start.column ? 1 : 0) | (b.end.column ? 0 : 8);
                        this.elt(c + (l ? " ace_br" + l : ""), "height:" + g + "px;" + "right:0;" + "top:" + h + "px;" + "left:" + f + "px;" + (e || ""));
                    };
                    this.drawSingleLineMarker = function(a, b, c, d, e, f) {
                        if (this.session.$bidiHandler.isBidiRow(b.start.row)) return this.drawBidiSingleLineMarker(a, b, c, d, e, f);
                        var g = d.lineHeight;
                        var h = (b.end.column + (e || 0) - b.start.column) * d.characterWidth;
                        var i = this.$getTop(b.start.row, d);
                        var j = this.$padding + b.start.column * d.characterWidth;
                        this.elt(c, "height:" + g + "px;" + "width:" + h + "px;" + "top:" + i + "px;" + "left:" + j + "px;" + (f || ""));
                    };
                    this.drawBidiSingleLineMarker = function(a, b, c, d, e, f) {
                        var g = d.lineHeight, h = this.$getTop(b.start.row, d), i = this.$padding;
                        var j = this.session.$bidiHandler.getSelections(b.start.column, b.end.column);
                        j.forEach(function(a) {
                            this.elt(c, "height:" + g + "px;" + "width:" + a.width + (e || 0) + "px;" + "top:" + h + "px;" + "left:" + (i + a.left) + "px;" + (f || ""));
                        }, this);
                    };
                    this.drawFullLineMarker = function(a, b, c, d, e) {
                        var f = this.$getTop(b.start.row, d);
                        var g = d.lineHeight;
                        if (b.start.row != b.end.row) g += this.$getTop(b.end.row, d) - f;
                        this.elt(c, "height:" + g + "px;" + "top:" + f + "px;" + "left:0;right:0;" + (e || ""));
                    };
                    this.drawScreenLineMarker = function(a, b, c, d, e) {
                        var f = this.$getTop(b.start.row, d);
                        var g = d.lineHeight;
                        this.elt(c, "height:" + g + "px;" + "top:" + f + "px;" + "left:0;right:0;" + (e || ""));
                    };
                }.call(f.prototype));
                b.Marker = f;
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
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/oop");
                var e = a("../lib/dom");
                var f = a("../lib/lang");
                var g = a("./lines").Lines;
                var h = a("../lib/event_emitter").EventEmitter;
                var i = function(a) {
                    this.dom = e;
                    this.element = this.dom.createElement("div");
                    this.element.className = "ace_layer ace_text-layer";
                    a.appendChild(this.element);
                    this.$updateEolChar = this.$updateEolChar.bind(this);
                    this.$lines = new g(this.element);
                };
                (function() {
                    d.implement(this, h);
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
                        var b = a.getNewLineCharacter() == "\n" && a.getNewLineMode() != "windows";
                        var c = b ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
                        if (this.EOL_CHAR != c) {
                            this.EOL_CHAR = c;
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
                        var a = this.session.getTabSize();
                        this.tabSize = a;
                        var b = (this.$tabStrings = [
                            0
                        ]);
                        for(var c = 1; c < a + 1; c++){
                            if (this.showTabs) {
                                var d = this.dom.createElement("span");
                                d.className = "ace_invisible ace_invisible_tab";
                                d.textContent = f.stringRepeat(this.TAB_CHAR, c);
                                b.push(d);
                            } else {
                                b.push(this.dom.createTextNode(f.stringRepeat(" ", c), this.element));
                            }
                        }
                        if (this.displayIndentGuides) {
                            this.$indentGuideRe = /\s\S| \t|\t |\s$/;
                            var e = "ace_indent-guide";
                            var g = this.showSpaces ? " ace_invisible ace_invisible_space" : "";
                            var h = this.showSpaces ? f.stringRepeat(this.SPACE_CHAR, this.tabSize) : f.stringRepeat(" ", this.tabSize);
                            var i = this.showTabs ? " ace_invisible ace_invisible_tab" : "";
                            var j = this.showTabs ? f.stringRepeat(this.TAB_CHAR, this.tabSize) : h;
                            var d = this.dom.createElement("span");
                            d.className = e + g;
                            d.textContent = h;
                            this.$tabStrings[" "] = d;
                            var d = this.dom.createElement("span");
                            d.className = e + i;
                            d.textContent = j;
                            this.$tabStrings["\t"] = d;
                        }
                    };
                    this.updateLines = function(a, b, c) {
                        if (this.config.lastRow != a.lastRow || this.config.firstRow != a.firstRow) {
                            return this.update(a);
                        }
                        this.config = a;
                        var d = Math.max(b, a.firstRow);
                        var e = Math.min(c, a.lastRow);
                        var f = this.element.childNodes;
                        var g = 0;
                        for(var h = a.firstRow; h < d; h++){
                            var i = this.session.getFoldLine(h);
                            if (i) {
                                if (i.containsRow(d)) {
                                    d = i.start.row;
                                    break;
                                } else {
                                    h = i.end.row;
                                }
                            }
                            g++;
                        }
                        var j = false;
                        var h = d;
                        var i = this.session.getNextFoldLine(h);
                        var k = i ? i.start.row : Infinity;
                        while(true){
                            if (h > k) {
                                h = i.end.row + 1;
                                i = this.session.getNextFoldLine(h, i);
                                k = i ? i.start.row : Infinity;
                            }
                            if (h > e) break;
                            var l = f[g++];
                            if (l) {
                                this.dom.removeChildren(l);
                                this.$renderLine(l, h, h == k ? i : false);
                                if (j) l.style.top = this.$lines.computeLineTop(h, a, this.session) + "px";
                                var m = a.lineHeight * this.session.getRowLength(h) + "px";
                                if (l.style.height != m) {
                                    j = true;
                                    l.style.height = m;
                                }
                            }
                            h++;
                        }
                        if (j) {
                            while(g < this.$lines.cells.length){
                                var n = this.$lines.cells[g++];
                                n.element.style.top = this.$lines.computeLineTop(n.row, a, this.session) + "px";
                            }
                        }
                    };
                    this.scrollLines = function(a) {
                        var b = this.config;
                        this.config = a;
                        if (this.$lines.pageChanged(b, a)) return this.update(a);
                        this.$lines.moveContainer(a);
                        var c = a.lastRow;
                        var d = b ? b.lastRow : -1;
                        if (!b || d < a.firstRow) return this.update(a);
                        if (c < b.firstRow) return this.update(a);
                        if (!b || b.lastRow < a.firstRow) return this.update(a);
                        if (a.lastRow < b.firstRow) return this.update(a);
                        if (b.firstRow < a.firstRow) for(var e = this.session.getFoldedRowCount(b.firstRow, a.firstRow - 1); e > 0; e--)this.$lines.shift();
                        if (b.lastRow > a.lastRow) for(var e = this.session.getFoldedRowCount(a.lastRow + 1, b.lastRow); e > 0; e--)this.$lines.pop();
                        if (a.firstRow < b.firstRow) {
                            this.$lines.unshift(this.$renderLinesFragment(a, a.firstRow, b.firstRow - 1));
                        }
                        if (a.lastRow > b.lastRow) {
                            this.$lines.push(this.$renderLinesFragment(a, b.lastRow + 1, a.lastRow));
                        }
                    };
                    this.$renderLinesFragment = function(a, b, c) {
                        var d = [];
                        var f = b;
                        var g = this.session.getNextFoldLine(f);
                        var h = g ? g.start.row : Infinity;
                        while(true){
                            if (f > h) {
                                f = g.end.row + 1;
                                g = this.session.getNextFoldLine(f, g);
                                h = g ? g.start.row : Infinity;
                            }
                            if (f > c) break;
                            var i = this.$lines.createCell(f, a, this.session);
                            var j = i.element;
                            this.dom.removeChildren(j);
                            e.setStyle(j.style, "height", this.$lines.computeLineHeight(f, a, this.session) + "px");
                            e.setStyle(j.style, "top", this.$lines.computeLineTop(f, a, this.session) + "px");
                            this.$renderLine(j, f, f == h ? g : false);
                            if (this.$useLineGroups()) {
                                j.className = "ace_line_group";
                            } else {
                                j.className = "ace_line";
                            }
                            d.push(i);
                            f++;
                        }
                        return d;
                    };
                    this.update = function(a) {
                        this.$lines.moveContainer(a);
                        this.config = a;
                        var b = a.firstRow;
                        var c = a.lastRow;
                        var d = this.$lines;
                        while(d.getLength())d.pop();
                        d.push(this.$renderLinesFragment(a, b, c));
                    };
                    this.$textToken = {
                        text: true,
                        rparen: true,
                        lparen: true
                    };
                    this.$renderToken = function(a, b, c, d) {
                        var e = this;
                        var g = /(\t)|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\uFEFF\uFFF9-\uFFFC]+)|(\u3000)|([\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g;
                        var h = this.dom.createFragment(this.element);
                        var i;
                        var j = 0;
                        while((i = g.exec(d))){
                            var k = i[1];
                            var l = i[2];
                            var m = i[3];
                            var n = i[4];
                            var o = i[5];
                            if (!e.showSpaces && l) continue;
                            var p = j != i.index ? d.slice(j, i.index) : "";
                            j = i.index + i[0].length;
                            if (p) {
                                h.appendChild(this.dom.createTextNode(p, this.element));
                            }
                            if (k) {
                                var q = e.session.getScreenTabSize(b + i.index);
                                h.appendChild(e.$tabStrings[q].cloneNode(true));
                                b += q - 1;
                            } else if (l) {
                                if (e.showSpaces) {
                                    var r = this.dom.createElement("span");
                                    r.className = "ace_invisible ace_invisible_space";
                                    r.textContent = f.stringRepeat(e.SPACE_CHAR, l.length);
                                    h.appendChild(r);
                                } else {
                                    h.appendChild(this.com.createTextNode(l, this.element));
                                }
                            } else if (m) {
                                var r = this.dom.createElement("span");
                                r.className = "ace_invisible ace_invisible_space ace_invalid";
                                r.textContent = f.stringRepeat(e.SPACE_CHAR, m.length);
                                h.appendChild(r);
                            } else if (n) {
                                b += 1;
                                var r = this.dom.createElement("span");
                                r.style.width = e.config.characterWidth * 2 + "px";
                                r.className = e.showSpaces ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                                r.textContent = e.showSpaces ? e.SPACE_CHAR : n;
                                h.appendChild(r);
                            } else if (o) {
                                b += 1;
                                var r = this.dom.createElement("span");
                                r.style.width = e.config.characterWidth * 2 + "px";
                                r.className = "ace_cjk";
                                r.textContent = o;
                                h.appendChild(r);
                            }
                        }
                        h.appendChild(this.dom.createTextNode(j ? d.slice(j) : d, this.element));
                        if (!this.$textToken[c.type]) {
                            var s = "ace_" + c.type.replace(/\./g, " ace_");
                            var r = this.dom.createElement("span");
                            if (c.type == "fold") r.style.width = c.value.length * this.config.characterWidth + "px";
                            r.className = s;
                            r.appendChild(h);
                            a.appendChild(r);
                        } else {
                            a.appendChild(h);
                        }
                        return b + d.length;
                    };
                    this.renderIndentGuide = function(a, b, c) {
                        var d = b.search(this.$indentGuideRe);
                        if (d <= 0 || d >= c) return b;
                        if (b[0] == " ") {
                            d -= d % this.tabSize;
                            var e = d / this.tabSize;
                            for(var f = 0; f < e; f++){
                                a.appendChild(this.$tabStrings[" "].cloneNode(true));
                            }
                            return b.substr(d);
                        } else if (b[0] == "\t") {
                            for(var f = 0; f < d; f++){
                                a.appendChild(this.$tabStrings["\t"].cloneNode(true));
                            }
                            return b.substr(d);
                        }
                        return b;
                    };
                    this.$createLineElement = function(a) {
                        var b = this.dom.createElement("div");
                        b.className = "ace_line";
                        b.style.height = this.config.lineHeight + "px";
                        return b;
                    };
                    this.$renderWrappedLine = function(a, b, c) {
                        var d = 0;
                        var e = 0;
                        var g = c[0];
                        var h = 0;
                        var i = this.$createLineElement();
                        a.appendChild(i);
                        for(var j = 0; j < b.length; j++){
                            var k = b[j];
                            var l = k.value;
                            if (j == 0 && this.displayIndentGuides) {
                                d = l.length;
                                l = this.renderIndentGuide(i, l, g);
                                if (!l) continue;
                                d -= l.length;
                            }
                            if (d + l.length < g) {
                                h = this.$renderToken(i, h, k, l);
                                d += l.length;
                            } else {
                                while(d + l.length >= g){
                                    h = this.$renderToken(i, h, k, l.substring(0, g - d));
                                    l = l.substring(g - d);
                                    d = g;
                                    i = this.$createLineElement();
                                    a.appendChild(i);
                                    i.appendChild(this.dom.createTextNode(f.stringRepeat("\xa0", c.indent), this.element));
                                    e++;
                                    h = 0;
                                    g = c[e] || Number.MAX_VALUE;
                                }
                                if (l.length != 0) {
                                    d += l.length;
                                    h = this.$renderToken(i, h, k, l);
                                }
                            }
                        }
                        if (c[c.length - 1] > this.MAX_LINE_LENGTH) this.$renderOverflowMessage(i, h, null, "", true);
                    };
                    this.$renderSimpleLine = function(a, b) {
                        var c = 0;
                        var d = b[0];
                        var e = d.value;
                        if (this.displayIndentGuides) e = this.renderIndentGuide(a, e);
                        if (e) c = this.$renderToken(a, c, d, e);
                        for(var f = 1; f < b.length; f++){
                            d = b[f];
                            e = d.value;
                            if (c + e.length > this.MAX_LINE_LENGTH) return this.$renderOverflowMessage(a, c, d, e);
                            c = this.$renderToken(a, c, d, e);
                        }
                    };
                    this.$renderOverflowMessage = function(a, b, c, d, e) {
                        c && this.$renderToken(a, b, c, d.slice(0, this.MAX_LINE_LENGTH - b));
                        var f = this.dom.createElement("span");
                        f.className = "ace_inline_button ace_keyword ace_toggle_wrap";
                        f.textContent = e ? "<hide>" : "<click to see more...>";
                        a.appendChild(f);
                    };
                    this.$renderLine = function(a, b, c) {
                        if (!c && c != false) c = this.session.getFoldLine(b);
                        if (c) var d = this.$getFoldLineTokens(b, c);
                        else var d = this.session.getTokens(b);
                        var e = a;
                        if (d.length) {
                            var f = this.session.getRowSplitData(b);
                            if (f && f.length) {
                                this.$renderWrappedLine(a, d, f);
                                var e = a.lastChild;
                            } else {
                                var e = a;
                                if (this.$useLineGroups()) {
                                    e = this.$createLineElement();
                                    a.appendChild(e);
                                }
                                this.$renderSimpleLine(e, d);
                            }
                        } else if (this.$useLineGroups()) {
                            e = this.$createLineElement();
                            a.appendChild(e);
                        }
                        if (this.showEOL && e) {
                            if (c) b = c.end.row;
                            var g = this.dom.createElement("span");
                            g.className = "ace_invisible ace_invisible_eol";
                            g.textContent = b == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR;
                            e.appendChild(g);
                        }
                    };
                    this.$getFoldLineTokens = function(a, b) {
                        var c = this.session;
                        var d = [];
                        function e(a, b, c) {
                            var e = 0, f = 0;
                            while(f + a[e].value.length < b){
                                f += a[e].value.length;
                                e++;
                                if (e == a.length) return;
                            }
                            if (f != b) {
                                var g = a[e].value.substring(b - f);
                                if (g.length > c - b) g = g.substring(0, c - b);
                                d.push({
                                    type: a[e].type,
                                    value: g
                                });
                                f = b + g.length;
                                e += 1;
                            }
                            while(f < c && e < a.length){
                                var g = a[e].value;
                                if (g.length + f > c) {
                                    d.push({
                                        type: a[e].type,
                                        value: g.substring(0, c - f)
                                    });
                                } else d.push(a[e]);
                                f += g.length;
                                e += 1;
                            }
                        }
                        var f = c.getTokens(a);
                        b.walk(function(a, b, g, h, i) {
                            if (a != null) {
                                d.push({
                                    type: "fold",
                                    value: a
                                });
                            } else {
                                if (i) f = c.getTokens(b);
                                if (f.length) e(f, h, g);
                            }
                        }, b.end.row, this.session.getLine(b.end.row).length);
                        return d;
                    };
                    this.$useLineGroups = function() {
                        return this.session.getUseWrapMode();
                    };
                    this.destroy = function() {};
                }.call(i.prototype));
                b.Text = i;
            });
            ace.define("ace/layer/cursor", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/dom");
                var e = function(a) {
                    this.element = d.createElement("div");
                    this.element.className = "ace_layer ace_cursor-layer";
                    a.appendChild(this.element);
                    this.isVisible = false;
                    this.isBlinking = true;
                    this.blinkInterval = 1000;
                    this.smoothBlinking = false;
                    this.cursors = [];
                    this.cursor = this.addCursor();
                    d.addCssClass(this.element, "ace_hidden-cursors");
                    this.$updateCursors = this.$updateOpacity.bind(this);
                };
                (function() {
                    this.$updateOpacity = function(a) {
                        var b = this.cursors;
                        for(var c = b.length; c--;)d.setStyle(b[c].style, "opacity", a ? "" : "0");
                    };
                    this.$startCssAnimation = function() {
                        var a = this.cursors;
                        for(var b = a.length; b--;)a[b].style.animationDuration = this.blinkInterval + "ms";
                        this.$isAnimating = true;
                        setTimeout(function() {
                            if (this.$isAnimating) {
                                d.addCssClass(this.element, "ace_animate-blinking");
                            }
                        }.bind(this));
                    };
                    this.$stopCssAnimation = function() {
                        this.$isAnimating = false;
                        d.removeCssClass(this.element, "ace_animate-blinking");
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
                            d.setCssClass(this.element, "ace_smooth-blinking", a);
                            this.$updateCursors(true);
                            this.restartTimer();
                        }
                    };
                    this.addCursor = function() {
                        var a = d.createElement("div");
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
                        d.addCssClass(this.element, "ace_hidden-cursors");
                        this.restartTimer();
                    };
                    this.showCursor = function() {
                        this.isVisible = true;
                        d.removeCssClass(this.element, "ace_hidden-cursors");
                        this.restartTimer();
                    };
                    this.restartTimer = function() {
                        var a = this.$updateCursors;
                        clearInterval(this.intervalId);
                        clearTimeout(this.timeoutId);
                        this.$stopCssAnimation();
                        if (this.smoothBlinking) {
                            this.$isSmoothBlinking = false;
                            d.removeCssClass(this.element, "ace_smooth-blinking");
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
                                    d.addCssClass(this.element, "ace_smooth-blinking");
                                }
                            }.bind(this));
                        }
                        if (d.HAS_CSS_ANIMATION) {
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
                    this.getPixelPosition = function(a, b) {
                        if (!this.config || !this.session) return {
                            left: 0,
                            top: 0
                        };
                        if (!a) a = this.session.selection.getCursor();
                        var c = this.session.documentToScreenPosition(a);
                        var d = this.$padding + (this.session.$bidiHandler.isBidiRow(c.row, a.row) ? this.session.$bidiHandler.getPosLeft(c.column) : c.column * this.config.characterWidth);
                        var e = (c.row - (b ? this.config.firstRowScreen : 0)) * this.config.lineHeight;
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
                        var b = this.session.$selectionMarkers;
                        var c = 0, e = 0;
                        if (b === undefined || b.length === 0) {
                            b = [
                                {
                                    cursor: null
                                }
                            ];
                        }
                        for(var c = 0, f = b.length; c < f; c++){
                            var g = this.getPixelPosition(b[c].cursor, true);
                            if ((g.top > a.height + a.offset || g.top < 0) && c > 1) {
                                continue;
                            }
                            var h = this.cursors[e++] || this.addCursor();
                            var i = h.style;
                            if (!this.drawCursor) {
                                if (!this.isCursorInView(g, a)) {
                                    d.setStyle(i, "display", "none");
                                } else {
                                    d.setStyle(i, "display", "block");
                                    d.translate(h, g.left, g.top);
                                    d.setStyle(i, "width", Math.round(a.characterWidth) + "px");
                                    d.setStyle(i, "height", a.lineHeight + "px");
                                }
                            } else {
                                this.drawCursor(h, g, a, b[c], this.session);
                            }
                        }
                        while(this.cursors.length > e)this.removeCursor();
                        var j = this.session.getOverwrite();
                        this.$setOverwrite(j);
                        this.$pixelPos = g;
                        this.restartTimer();
                    };
                    this.drawCursor = null;
                    this.$setOverwrite = function(a) {
                        if (a != this.overwrite) {
                            this.overwrite = a;
                            if (a) d.addCssClass(this.element, "ace_overwrite-cursors");
                            else d.removeCssClass(this.element, "ace_overwrite-cursors");
                        }
                    };
                    this.destroy = function() {
                        clearInterval(this.intervalId);
                        clearTimeout(this.timeoutId);
                    };
                }.call(e.prototype));
                b.Cursor = e;
            });
            ace.define("ace/scrollbar", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/event_emitter", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./lib/dom");
                var f = a("./lib/event");
                var g = a("./lib/event_emitter").EventEmitter;
                var h = 0x8000;
                var i = function(a) {
                    this.element = e.createElement("div");
                    this.element.className = "ace_scrollbar ace_scrollbar" + this.classSuffix;
                    this.inner = e.createElement("div");
                    this.inner.className = "ace_scrollbar-inner";
                    this.inner.textContent = "\xa0";
                    this.element.appendChild(this.inner);
                    a.appendChild(this.element);
                    this.setVisible(false);
                    this.skipEvent = false;
                    f.addListener(this.element, "scroll", this.onScroll.bind(this));
                    f.addListener(this.element, "mousedown", f.preventDefault);
                };
                (function() {
                    d.implement(this, g);
                    this.setVisible = function(a) {
                        this.element.style.display = a ? "" : "none";
                        this.isVisible = a;
                        this.coeff = 1;
                    };
                }.call(i.prototype));
                var j = function(a, b) {
                    i.call(this, a);
                    this.scrollTop = 0;
                    this.scrollHeight = 0;
                    b.$scrollbarWidth = this.width = e.scrollbarWidth(a.ownerDocument);
                    this.inner.style.width = this.element.style.width = (this.width || 15) + 5 + "px";
                    this.$minWidth = 0;
                };
                d.inherits(j, i);
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
                        if (a > h) {
                            this.coeff = h / a;
                            a = h;
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
                }.call(j.prototype));
                var k = function(a, b) {
                    i.call(this, a);
                    this.scrollLeft = 0;
                    this.height = b.$scrollbarWidth;
                    this.inner.style.height = this.element.style.height = (this.height || 15) + 5 + "px";
                };
                d.inherits(k, i);
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
                }.call(k.prototype));
                b.ScrollBar = j;
                b.ScrollBarV = j;
                b.ScrollBarH = k;
                b.VScrollBar = j;
                b.HScrollBar = k;
            });
            ace.define("ace/renderloop", [
                "require",
                "exports",
                "module",
                "ace/lib/event"
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/event");
                var e = function(a, b) {
                    this.onRender = a;
                    this.pending = false;
                    this.changes = 0;
                    this.$recursionLimit = 2;
                    this.window = b || window;
                    var c = this;
                    this._flush = function(a) {
                        c.pending = false;
                        var b = c.changes;
                        if (b) {
                            d.blockIdle(100);
                            c.changes = 0;
                            c.onRender(b);
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
                            d.nextFrame(this._flush);
                            this.pending = true;
                        }
                    };
                    this.clear = function(a) {
                        var b = this.changes;
                        this.changes = 0;
                        return b;
                    };
                }.call(e.prototype));
                b.RenderLoop = e;
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
            ], function(a, b, c) {
                var d = a("../lib/oop");
                var e = a("../lib/dom");
                var f = a("../lib/lang");
                var g = a("../lib/event");
                var h = a("../lib/useragent");
                var i = a("../lib/event_emitter").EventEmitter;
                var j = 256;
                var k = typeof ResizeObserver == "function";
                var l = 200;
                var m = (b.FontMetrics = function(a) {
                    this.el = e.createElement("div");
                    this.$setMeasureNodeStyles(this.el.style, true);
                    this.$main = e.createElement("div");
                    this.$setMeasureNodeStyles(this.$main.style);
                    this.$measureNode = e.createElement("div");
                    this.$setMeasureNodeStyles(this.$measureNode.style);
                    this.el.appendChild(this.$main);
                    this.el.appendChild(this.$measureNode);
                    a.appendChild(this.el);
                    this.$measureNode.textContent = f.stringRepeat("X", j);
                    this.$characterSize = {
                        width: 0,
                        height: 0
                    };
                    if (k) this.$addObserver();
                    else this.checkForSizeChanges();
                });
                (function() {
                    d.implement(this, i);
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
                        if (h.isIE < 8) {
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
                        return (this.$pollSizeChangesTimer = g.onIdle(function b() {
                            a.checkForSizeChanges();
                            g.onIdle(b, 500);
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
                    this.$measureSizes = function(a) {
                        var b = {
                            height: (a || this.$measureNode).clientHeight,
                            width: (a || this.$measureNode).clientWidth / j
                        };
                        if (b.width === 0 || b.height === 0) return null;
                        return b;
                    };
                    this.$measureCharWidth = function(a) {
                        this.$main.textContent = f.stringRepeat(a, j);
                        var b = this.$main.getBoundingClientRect();
                        return b.width / j;
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
                    this.$getZoom = function a(b) {
                        if (!b || !b.parentElement) return 1;
                        return ((window.getComputedStyle(b).zoom || 1) * a(b.parentElement));
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
                        this.els = e.buildDom([
                            a(0, 0),
                            a(l, 0),
                            a(0, l),
                            a(l, l)
                        ], this.el);
                    };
                    this.transformCoordinates = function(a, b) {
                        if (a) {
                            var c = this.$getZoom(this.el);
                            a = g(1 / c, a);
                        }
                        function d(a, b, c) {
                            var d = a[1] * b[0] - a[0] * b[1];
                            return [
                                (-b[1] * c[0] + b[0] * c[1]) / d,
                                (+a[1] * c[0] - a[0] * c[1]) / d, 
                            ];
                        }
                        function e(a, b) {
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
                        function g(a, b) {
                            return [
                                a * b[0],
                                a * b[1]
                            ];
                        }
                        if (!this.els) this.$initTransformMeasureNodes();
                        function h(a) {
                            var b = a.getBoundingClientRect();
                            return [
                                b.left,
                                b.top
                            ];
                        }
                        var i = h(this.els[0]);
                        var j = h(this.els[1]);
                        var k = h(this.els[2]);
                        var m = h(this.els[3]);
                        var n = d(e(m, j), e(m, k), e(f(j, k), f(m, i)));
                        var o = g(1 + n[0], e(j, i));
                        var p = g(1 + n[1], e(k, i));
                        if (b) {
                            var q = b;
                            var r = (n[0] * q[0]) / l + (n[1] * q[1]) / l + 1;
                            var s = f(g(q[0], o), g(q[1], p));
                            return f(g(1 / r / l, s), i);
                        }
                        var t = e(a, i);
                        var u = d(e(o, g(n[0], t)), e(p, g(n[1], t)), t);
                        return g(l, u);
                    };
                }.call(m.prototype));
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
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/oop");
                var e = a("./lib/dom");
                var f = a("./config");
                var g = a("./layer/gutter").Gutter;
                var h = a("./layer/marker").Marker;
                var i = a("./layer/text").Text;
                var j = a("./layer/cursor").Cursor;
                var k = a("./scrollbar").HScrollBar;
                var l = a("./scrollbar").VScrollBar;
                var m = a("./renderloop").RenderLoop;
                var n = a("./layer/font_metrics").FontMetrics;
                var o = a("./lib/event_emitter").EventEmitter;
                var p = '\
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
                var q = a("./lib/useragent");
                var r = q.isIE;
                e.importCssString(p, "ace_editor.css", false);
                var s = function(a, b) {
                    var c = this;
                    this.container = a || e.createElement("div");
                    e.addCssClass(this.container, "ace_editor");
                    if (e.HI_DPI) e.addCssClass(this.container, "ace_hidpi");
                    this.setTheme(b);
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
                    this.$gutterLayer = new g(this.$gutter);
                    this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));
                    this.$markerBack = new h(this.content);
                    var d = (this.$textLayer = new i(this.content));
                    this.canvas = d.element;
                    this.$markerFront = new h(this.content);
                    this.$cursorLayer = new j(this.content);
                    this.$horizScroll = false;
                    this.$vScroll = false;
                    this.scrollBar = this.scrollBarV = new l(this.container, this);
                    this.scrollBarH = new k(this.container, this);
                    this.scrollBarV.on("scroll", function(a) {
                        if (!c.$scrollAnimation) c.session.setScrollTop(a.data - c.scrollMargin.top);
                    });
                    this.scrollBarH.on("scroll", function(a) {
                        if (!c.$scrollAnimation) c.session.setScrollLeft(a.data - c.scrollMargin.left);
                    });
                    this.scrollTop = 0;
                    this.scrollLeft = 0;
                    this.cursorPos = {
                        row: 0,
                        column: 0
                    };
                    this.$fontMetrics = new n(this.container);
                    this.$textLayer.$setFontMetrics(this.$fontMetrics);
                    this.$textLayer.on("changeCharacterSize", function(a) {
                        c.updateCharacterSize();
                        c.onResize(true, c.gutterWidth, c.$size.width, c.$size.height);
                        c._signal("changeCharacterSize", a);
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
                    this.$keepTextAreaAtCursor = !q.isIOS;
                    this.$loop = new m(this.$renderChanges.bind(this), this.container.ownerDocument.defaultView);
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
                    d.implement(this, o);
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
                    this.updateLines = function(a, b, c) {
                        if (b === undefined) b = Infinity;
                        if (!this.$changedLines) {
                            this.$changedLines = {
                                firstRow: a,
                                lastRow: b
                            };
                        } else {
                            if (this.$changedLines.firstRow > a) this.$changedLines.firstRow = a;
                            if (this.$changedLines.lastRow < b) this.$changedLines.lastRow = b;
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
                    this.onResize = function(a, b, c, d) {
                        if (this.resizing > 2) return;
                        else if (this.resizing > 0) this.resizing++;
                        else this.resizing = a ? 1 : 0;
                        var e = this.container;
                        if (!d) d = e.clientHeight || e.scrollHeight;
                        if (!c) c = e.clientWidth || e.scrollWidth;
                        var f = this.$updateCachedSize(a, b, c, d);
                        if (!this.$size.scrollerHeight || (!c && !d)) return (this.resizing = 0);
                        if (a) this.$gutterLayer.$padding = null;
                        if (a) this.$renderChanges(f | this.$changes, true);
                        else this.$loop.schedule(f | this.$changes);
                        if (this.resizing) this.resizing = 0;
                        this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
                    };
                    this.$updateCachedSize = function(a, b, c, d) {
                        d -= this.$extraHeight || 0;
                        var f = 0;
                        var g = this.$size;
                        var h = {
                            width: g.width,
                            height: g.height,
                            scrollerHeight: g.scrollerHeight,
                            scrollerWidth: g.scrollerWidth
                        };
                        if (d && (a || g.height != d)) {
                            g.height = d;
                            f |= this.CHANGE_SIZE;
                            g.scrollerHeight = g.height;
                            if (this.$horizScroll) g.scrollerHeight -= this.scrollBarH.getHeight();
                            this.scrollBarV.element.style.bottom = this.scrollBarH.getHeight() + "px";
                            f = f | this.CHANGE_SCROLL;
                        }
                        if (c && (a || g.width != c)) {
                            f |= this.CHANGE_SIZE;
                            g.width = c;
                            if (b == null) b = this.$showGutter ? this.$gutter.offsetWidth : 0;
                            this.gutterWidth = b;
                            e.setStyle(this.scrollBarH.element.style, "left", b + "px");
                            e.setStyle(this.scroller.style, "left", b + this.margin.left + "px");
                            g.scrollerWidth = Math.max(0, c - b - this.scrollBarV.getWidth() - this.margin.h);
                            e.setStyle(this.$gutter.style, "left", this.margin.left + "px");
                            var i = this.scrollBarV.getWidth() + "px";
                            e.setStyle(this.scrollBarH.element.style, "right", i);
                            e.setStyle(this.scroller.style, "right", i);
                            e.setStyle(this.scroller.style, "bottom", this.scrollBarH.getHeight());
                            if ((this.session && this.session.getUseWrapMode() && this.adjustWrapLimit()) || a) {
                                f |= this.CHANGE_FULL;
                            }
                        }
                        g.$dirty = !c || !d;
                        if (f) this._signal("resize", h);
                        return f;
                    };
                    this.onGutterResize = function(a) {
                        var b = this.$showGutter ? a : 0;
                        if (b != this.gutterWidth) this.$changes |= this.$updateCachedSize(true, b, this.$size.width, this.$size.height);
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
                        var a = this.textarea.style;
                        var b = this.$composition;
                        if (!this.$keepTextAreaAtCursor && !b) {
                            e.translate(this.textarea, -100, 0);
                            return;
                        }
                        var c = this.$cursorLayer.$pixelPos;
                        if (!c) return;
                        if (b && b.markerRange) c = this.$cursorLayer.getPixelPosition(b.markerRange.start, true);
                        var d = this.layerConfig;
                        var f = c.top;
                        var g = c.left;
                        f -= d.offset;
                        var h = b && b.useTextareaForIME ? this.lineHeight : r ? 0 : 1;
                        if (f < 0 || f > d.height - h) {
                            e.translate(this.textarea, 0, 0);
                            return;
                        }
                        var i = 1;
                        var j = this.$size.height - h;
                        if (!b) {
                            f += this.lineHeight;
                        } else {
                            if (b.useTextareaForIME) {
                                var k = this.textarea.value;
                                i = this.characterWidth * this.session.$getStringScreenWidth(k)[0];
                            } else {
                                f += this.lineHeight + 2;
                            }
                        }
                        g -= this.scrollLeft;
                        if (g > this.$size.scrollerWidth - i) g = this.$size.scrollerWidth - i;
                        g += this.gutterWidth + this.margin.left;
                        e.setStyle(a, "height", h + "px");
                        e.setStyle(a, "width", i + "px");
                        e.translate(this.textarea, Math.min(g, this.$size.scrollerWidth - i), Math.min(f, j));
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
                    this.setScrollMargin = function(a, b, c, d) {
                        var e = this.scrollMargin;
                        e.top = a | 0;
                        e.bottom = b | 0;
                        e.right = d | 0;
                        e.left = c | 0;
                        e.v = e.top + e.bottom;
                        e.h = e.left + e.right;
                        if (e.top && this.scrollTop <= 0 && this.session) this.session.setScrollTop(-e.top);
                        this.updateFull();
                    };
                    this.setMargin = function(a, b, c, d) {
                        var e = this.margin;
                        e.top = a | 0;
                        e.bottom = b | 0;
                        e.right = d | 0;
                        e.left = c | 0;
                        e.v = e.top + e.bottom;
                        e.h = e.left + e.right;
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
                    this.$renderChanges = function(a, b) {
                        if (this.$changes) {
                            a |= this.$changes;
                            this.$changes = 0;
                        }
                        if (!this.session || !this.container.offsetWidth || this.$frozen || (!a && !b)) {
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
                        var c = this.layerConfig;
                        if (a & this.CHANGE_FULL || a & this.CHANGE_SIZE || a & this.CHANGE_TEXT || a & this.CHANGE_LINES || a & this.CHANGE_SCROLL || a & this.CHANGE_H_SCROLL) {
                            a |= this.$computeLayerConfig() | this.$loop.clear();
                            if (c.firstRow != this.layerConfig.firstRow && c.firstRowScreen == this.layerConfig.firstRowScreen) {
                                var d = this.scrollTop + (c.firstRow - this.layerConfig.firstRow) * this.lineHeight;
                                if (d > 0) {
                                    this.scrollTop = d;
                                    a = a | this.CHANGE_SCROLL;
                                    a |= this.$computeLayerConfig() | this.$loop.clear();
                                }
                            }
                            c = this.layerConfig;
                            this.$updateScrollBarV();
                            if (a & this.CHANGE_H_SCROLL) this.$updateScrollBarH();
                            e.translate(this.content, -this.scrollLeft, -c.offset);
                            var f = c.width + 2 * this.$padding + "px";
                            var g = c.minHeight + "px";
                            e.setStyle(this.content.style, "width", f);
                            e.setStyle(this.content.style, "height", g);
                        }
                        if (a & this.CHANGE_H_SCROLL) {
                            e.translate(this.content, -this.scrollLeft, -c.offset);
                            this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller" : "ace_scroller ace_scroll-left";
                        }
                        if (a & this.CHANGE_FULL) {
                            this.$changedLines = null;
                            this.$textLayer.update(c);
                            if (this.$showGutter) this.$gutterLayer.update(c);
                            this.$markerBack.update(c);
                            this.$markerFront.update(c);
                            this.$cursorLayer.update(c);
                            this.$moveTextAreaToCursor();
                            this._signal("afterRender", a);
                            return;
                        }
                        if (a & this.CHANGE_SCROLL) {
                            this.$changedLines = null;
                            if (a & this.CHANGE_TEXT || a & this.CHANGE_LINES) this.$textLayer.update(c);
                            else this.$textLayer.scrollLines(c);
                            if (this.$showGutter) {
                                if (a & this.CHANGE_GUTTER || a & this.CHANGE_LINES) this.$gutterLayer.update(c);
                                else this.$gutterLayer.scrollLines(c);
                            }
                            this.$markerBack.update(c);
                            this.$markerFront.update(c);
                            this.$cursorLayer.update(c);
                            this.$moveTextAreaToCursor();
                            this._signal("afterRender", a);
                            return;
                        }
                        if (a & this.CHANGE_TEXT) {
                            this.$changedLines = null;
                            this.$textLayer.update(c);
                            if (this.$showGutter) this.$gutterLayer.update(c);
                        } else if (a & this.CHANGE_LINES) {
                            if (this.$updateLines() || (a & this.CHANGE_GUTTER && this.$showGutter)) this.$gutterLayer.update(c);
                        } else if (a & this.CHANGE_TEXT || a & this.CHANGE_GUTTER) {
                            if (this.$showGutter) this.$gutterLayer.update(c);
                        } else if (a & this.CHANGE_CURSOR) {
                            if (this.$highlightGutterLine) this.$gutterLayer.updateLineHighlight(c);
                        }
                        if (a & this.CHANGE_CURSOR) {
                            this.$cursorLayer.update(c);
                            this.$moveTextAreaToCursor();
                        }
                        if (a & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
                            this.$markerFront.update(c);
                        }
                        if (a & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
                            this.$markerBack.update(c);
                        }
                        this._signal("afterRender", a);
                    };
                    this.$autosize = function() {
                        var a = this.session.getScreenLength() * this.lineHeight;
                        var b = this.$maxLines * this.lineHeight;
                        var c = Math.min(b, Math.max((this.$minLines || 1) * this.lineHeight, a)) + this.scrollMargin.v + (this.$extraHeight || 0);
                        if (this.$horizScroll) c += this.scrollBarH.getHeight();
                        if (this.$maxPixelHeight && c > this.$maxPixelHeight) c = this.$maxPixelHeight;
                        var d = c <= 2 * this.lineHeight;
                        var e = !d && a > b;
                        if (c != this.desiredHeight || this.$size.height != this.desiredHeight || e != this.$vScroll) {
                            if (e != this.$vScroll) {
                                this.$vScroll = e;
                                this.scrollBarV.setVisible(e);
                            }
                            var f = this.container.clientWidth;
                            this.container.style.height = c + "px";
                            this.$updateCachedSize(true, this.$gutterWidth, f, c);
                            this.desiredHeight = c;
                            this._signal("autosize");
                        }
                    };
                    this.$computeLayerConfig = function() {
                        var a = this.session;
                        var b = this.$size;
                        var c = b.height <= 2 * this.lineHeight;
                        var d = this.session.getScreenLength();
                        var e = d * this.lineHeight;
                        var f = this.$getLongestLine();
                        var g = !c && (this.$hScrollBarAlwaysVisible || b.scrollerWidth - f - 2 * this.$padding < 0);
                        var h = this.$horizScroll !== g;
                        if (h) {
                            this.$horizScroll = g;
                            this.scrollBarH.setVisible(g);
                        }
                        var i = this.$vScroll;
                        if (this.$maxLines && this.lineHeight > 1) this.$autosize();
                        var j = b.scrollerHeight + this.lineHeight;
                        var k = !this.$maxLines && this.$scrollPastEnd ? (b.scrollerHeight - this.lineHeight) * this.$scrollPastEnd : 0;
                        e += k;
                        var l = this.scrollMargin;
                        this.session.setScrollTop(Math.max(-l.top, Math.min(this.scrollTop, e - b.scrollerHeight + l.bottom)));
                        this.session.setScrollLeft(Math.max(-l.left, Math.min(this.scrollLeft, f + 2 * this.$padding - b.scrollerWidth + l.right)));
                        var m = !c && (this.$vScrollBarAlwaysVisible || b.scrollerHeight - e + k < 0 || this.scrollTop > l.top);
                        var n = i !== m;
                        if (n) {
                            this.$vScroll = m;
                            this.scrollBarV.setVisible(m);
                        }
                        var o = this.scrollTop % this.lineHeight;
                        var p = Math.ceil(j / this.lineHeight) - 1;
                        var q = Math.max(0, Math.round((this.scrollTop - o) / this.lineHeight));
                        var r = q + p;
                        var s, t;
                        var u = this.lineHeight;
                        q = a.screenToDocumentRow(q, 0);
                        var v = a.getFoldLine(q);
                        if (v) {
                            q = v.start.row;
                        }
                        s = a.documentToScreenRow(q, 0);
                        t = a.getRowLength(q) * u;
                        r = Math.min(a.screenToDocumentRow(r, 0), a.getLength() - 1);
                        j = b.scrollerHeight + a.getRowLength(r) * u + t;
                        o = this.scrollTop - s * u;
                        var w = 0;
                        if (this.layerConfig.width != f || h) w = this.CHANGE_H_SCROLL;
                        if (h || n) {
                            w |= this.$updateCachedSize(true, this.gutterWidth, b.width, b.height);
                            this._signal("scrollbarVisibilityChanged");
                            if (n) f = this.$getLongestLine();
                        }
                        this.layerConfig = {
                            width: f,
                            padding: this.$padding,
                            firstRow: q,
                            firstRowScreen: s,
                            lastRow: r,
                            lineHeight: u,
                            characterWidth: this.characterWidth,
                            minHeight: j,
                            maxHeight: e,
                            offset: o,
                            gutterOffset: u ? Math.max(0, Math.ceil((o + b.height - b.scrollerHeight) / u)) : 0,
                            height: this.$size.scrollerHeight
                        };
                        if (this.session.$bidiHandler) this.session.$bidiHandler.setContentWidth(f - this.$padding);
                        return w;
                    };
                    this.$updateLines = function() {
                        if (!this.$changedLines) return;
                        var a = this.$changedLines.firstRow;
                        var b = this.$changedLines.lastRow;
                        this.$changedLines = null;
                        var c = this.layerConfig;
                        if (a > c.lastRow + 1) {
                            return;
                        }
                        if (b < c.firstRow) {
                            return;
                        }
                        if (b === Infinity) {
                            if (this.$showGutter) this.$gutterLayer.update(c);
                            this.$textLayer.update(c);
                            return;
                        }
                        this.$textLayer.updateLines(c, a, b);
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
                    this.scrollSelectionIntoView = function(a, b, c) {
                        this.scrollCursorIntoView(a, c);
                        this.scrollCursorIntoView(b, c);
                    };
                    this.scrollCursorIntoView = function(a, b, c) {
                        if (this.$size.scrollerHeight === 0) return;
                        var d = this.$cursorLayer.getPixelPosition(a);
                        var e = d.left;
                        var f = d.top;
                        var g = (c && c.top) || 0;
                        var h = (c && c.bottom) || 0;
                        var i = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;
                        if (i + g > f) {
                            if (b && i + g > f + this.lineHeight) f -= b * this.$size.scrollerHeight;
                            if (f === 0) f = -this.scrollMargin.top;
                            this.session.setScrollTop(f);
                        } else if (i + this.$size.scrollerHeight - h < f + this.lineHeight) {
                            if (b && i + this.$size.scrollerHeight - h < f - this.lineHeight) f += b * this.$size.scrollerHeight;
                            this.session.setScrollTop(f + this.lineHeight + h - this.$size.scrollerHeight);
                        }
                        var j = this.scrollLeft;
                        if (j > e) {
                            if (e < this.$padding + 2 * this.layerConfig.characterWidth) e = -this.scrollMargin.left;
                            this.session.setScrollLeft(e);
                        } else if (j + this.$size.scrollerWidth < e + this.characterWidth) {
                            this.session.setScrollLeft(Math.round(e + this.characterWidth - this.$size.scrollerWidth));
                        } else if (j <= this.$padding && e - j < this.characterWidth) {
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
                    this.alignCursor = function(a, b) {
                        if (typeof a == "number") a = {
                            row: a,
                            column: 0
                        };
                        var c = this.$cursorLayer.getPixelPosition(a);
                        var d = this.$size.scrollerHeight - this.lineHeight;
                        var e = c.top - d * (b || 0);
                        this.session.setScrollTop(e);
                        return e;
                    };
                    this.STEPS = 8;
                    this.$calcSteps = function(a, b) {
                        var c = 0;
                        var d = this.STEPS;
                        var e = [];
                        var f = function(a, b, c) {
                            return c * (Math.pow(a - 1, 3) + 1) + b;
                        };
                        for(c = 0; c < d; ++c)e.push(f(c / this.STEPS, a, b - a));
                        return e;
                    };
                    this.scrollToLine = function(a, b, c, d) {
                        var e = this.$cursorLayer.getPixelPosition({
                            row: a,
                            column: 0
                        });
                        var f = e.top;
                        if (b) f -= this.$size.scrollerHeight / 2;
                        var g = this.scrollTop;
                        this.session.setScrollTop(f);
                        if (c !== false) this.animateScrolling(g, d);
                    };
                    this.animateScrolling = function(a, b) {
                        var c = this.scrollTop;
                        if (!this.$animatedScroll) return;
                        var d = this;
                        if (a == c) return;
                        if (this.$scrollAnimation) {
                            var e = this.$scrollAnimation.steps;
                            if (e.length) {
                                a = e[0];
                                if (a == c) return;
                            }
                        }
                        var f = d.$calcSteps(a, c);
                        this.$scrollAnimation = {
                            from: a,
                            to: c,
                            steps: f
                        };
                        clearInterval(this.$timer);
                        d.session.setScrollTop(f.shift());
                        d.session.$scrollTop = c;
                        this.$timer = setInterval(function() {
                            if (!d.session) return clearInterval(d.$timer);
                            if (f.length) {
                                d.session.setScrollTop(f.shift());
                                d.session.$scrollTop = c;
                            } else if (c != null) {
                                d.session.$scrollTop = -1;
                                d.session.setScrollTop(c);
                                c = null;
                            } else {
                                d.$timer = clearInterval(d.$timer);
                                d.$scrollAnimation = null;
                                b && b();
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
                    this.pixelToScreenCoordinates = function(a, b) {
                        var c;
                        if (this.$hasCssTransforms) {
                            c = {
                                top: 0,
                                left: 0
                            };
                            var d = this.$fontMetrics.transformCoordinates([
                                a,
                                b, 
                            ]);
                            a = d[1] - this.gutterWidth - this.margin.left;
                            b = d[0];
                        } else {
                            c = this.scroller.getBoundingClientRect();
                        }
                        var e = a + this.scrollLeft - c.left - this.$padding;
                        var f = e / this.characterWidth;
                        var g = Math.floor((b + this.scrollTop - c.top) / this.lineHeight);
                        var h = this.$blockCursor ? Math.floor(f) : Math.round(f);
                        return {
                            row: g,
                            column: h,
                            side: f - h > 0 ? 1 : -1,
                            offsetX: e
                        };
                    };
                    this.screenToTextCoordinates = function(a, b) {
                        var c;
                        if (this.$hasCssTransforms) {
                            c = {
                                top: 0,
                                left: 0
                            };
                            var d = this.$fontMetrics.transformCoordinates([
                                a,
                                b, 
                            ]);
                            a = d[1] - this.gutterWidth - this.margin.left;
                            b = d[0];
                        } else {
                            c = this.scroller.getBoundingClientRect();
                        }
                        var e = a + this.scrollLeft - c.left - this.$padding;
                        var f = e / this.characterWidth;
                        var g = this.$blockCursor ? Math.floor(f) : Math.round(f);
                        var h = Math.floor((b + this.scrollTop - c.top) / this.lineHeight);
                        return this.session.screenToDocumentPosition(h, Math.max(g, 0), e);
                    };
                    this.textToScreenCoordinates = function(a, b) {
                        var c = this.scroller.getBoundingClientRect();
                        var d = this.session.documentToScreenPosition(a, b);
                        var e = this.$padding + (this.session.$bidiHandler.isBidiRow(d.row, a) ? this.session.$bidiHandler.getPosLeft(d.column) : Math.round(d.column * this.characterWidth));
                        var f = d.row * this.lineHeight;
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
                    this.setCompositionText = function(a) {
                        var b = this.session.selection.cursor;
                        this.addToken(a, "composition_placeholder", b.row, b.column);
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
                    this.addToken = function(a, b, c, d) {
                        var e = this.session;
                        e.bgTokenizer.lines[c] = null;
                        var f = {
                            type: b,
                            value: a
                        };
                        var g = e.getTokens(c);
                        if (d == null) {
                            g.push(f);
                        } else {
                            var h = 0;
                            for(var i = 0; i < g.length; i++){
                                var j = g[i];
                                h += j.value.length;
                                if (d <= h) {
                                    var k = j.value.length - (h - d);
                                    var l = j.value.slice(0, k);
                                    var m = j.value.slice(k);
                                    g.splice(i, 1, {
                                        type: j.type,
                                        value: l
                                    }, f, {
                                        type: j.type,
                                        value: m
                                    });
                                    break;
                                }
                            }
                        }
                        this.updateLines(c, c);
                    };
                    this.removeExtraToken = function(a, b) {
                        this.updateLines(a, a);
                    };
                    this.setTheme = function(a, b) {
                        var c = this;
                        this.$themeId = a;
                        c._dispatchEvent("themeChange", {
                            theme: a
                        });
                        if (!a || typeof a == "string") {
                            var d = a || this.$options.theme.initialValue;
                            f.loadModule([
                                "theme",
                                d
                            ], g);
                        } else {
                            g(a);
                        }
                        function g(d) {
                            if (c.$themeId != a) return b && b();
                            if (!d || !d.cssClass) throw new Error("couldn't load module " + a + " or it didn't call define");
                            if (d.$id) c.$themeId = d.$id;
                            e.importCssString(d.cssText, d.cssClass, c.container);
                            if (c.theme) e.removeCssClass(c.container, c.theme.cssClass);
                            var f = "padding" in d ? d.padding : "padding" in (c.theme || {}) ? 4 : c.$padding;
                            if (c.$padding && f != c.$padding) c.setPadding(f);
                            c.$theme = d.cssClass;
                            c.theme = d;
                            e.addCssClass(c.container, d.cssClass);
                            e.setCssClass(c.container, "ace_dark", d.isDark);
                            if (c.$size) {
                                c.$size.width = 0;
                                c.$updateSizeAsync();
                            }
                            c._dispatchEvent("themeLoaded", {
                                theme: d
                            });
                            b && b();
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
                        e.importCssString(p, "ace_editor.css", this.container);
                    };
                    this.destroy = function() {
                        this.freeze();
                        this.$fontMetrics.destroy();
                        this.$cursorLayer.destroy();
                        this.removeAllListeners();
                        this.container.textContent = "";
                    };
                }.call(s.prototype));
                f.defineOptions(s.prototype, "renderer", {
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
                        initialValue: !q.isMobile && !q.isIE
                    }
                });
                b.VirtualRenderer = s;
            });
            ace.define("ace/worker/worker_client", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/net",
                "ace/lib/event_emitter",
                "ace/config", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../lib/oop");
                var e = a("../lib/net");
                var f = a("../lib/event_emitter").EventEmitter;
                var g = a("../config");
                function h(a) {
                    var b = "importScripts('" + e.qualifyURL(a) + "');";
                    try {
                        return new Blob([
                            b
                        ], {
                            type: "application/javascript"
                        });
                    } catch (c) {
                        var d = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                        var f = new d();
                        f.append(b);
                        return f.getBlob("application/javascript");
                    }
                }
                function i(a) {
                    if (typeof Worker == "undefined") return {
                        postMessage: function() {},
                        terminate: function() {}
                    };
                    if (g.get("loadWorkerFromBlob")) {
                        var b = h(a);
                        var c = window.URL || window.webkitURL;
                        var d = c.createObjectURL(b);
                        return new Worker(d);
                    }
                    return new Worker(a);
                }
                var j = function(a) {
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
                    d.implement(this, f);
                    this.$createWorkerFromOldConfig = function(b, c, d, e, f) {
                        if (a.nameToUrl && !a.toUrl) a.toUrl = a.nameToUrl;
                        if (g.get("packaged") || !a.toUrl) {
                            e = e || g.moduleUrl(c, "worker");
                        } else {
                            var h = this.$normalizePath;
                            e = e || h(a.toUrl("ace/worker/worker.js", null, "_"));
                            var j = {};
                            b.forEach(function(b) {
                                j[b] = h(a.toUrl(b, null, "_").replace(/(\.js)?(\?.*)?$/, ""));
                            });
                        }
                        this.$worker = i(e);
                        if (f) {
                            this.send("importScripts", f);
                        }
                        this.$worker.postMessage({
                            init: true,
                            tlns: j,
                            module: c,
                            classname: d
                        });
                        return this.$worker;
                    };
                    this.onMessage = function(a) {
                        var b = a.data;
                        switch(b.type){
                            case "event":
                                this._signal(b.name, {
                                    data: b.data
                                });
                                break;
                            case "call":
                                var c = this.callbacks[b.id];
                                if (c) {
                                    c(b.data);
                                    delete this.callbacks[b.id];
                                }
                                break;
                            case "error":
                                this.reportError(b.data);
                                break;
                            case "log":
                                window.console && console.log && console.log.apply(console, b.data);
                                break;
                        }
                    };
                    this.reportError = function(a) {
                        window.console && console.error && console.error(a);
                    };
                    this.$normalizePath = function(a) {
                        return e.qualifyURL(a);
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
                    this.call = function(a, b, c) {
                        if (c) {
                            var d = this.callbackId++;
                            this.callbacks[d] = c;
                            b.push(d);
                        }
                        this.send(a, b);
                    };
                    this.emit = function(a, b) {
                        try {
                            if (b.data && b.data.err) b.data.err = {
                                message: b.data.err.message,
                                stack: b.data.err.stack,
                                code: b.data.err.code
                            };
                            this.$worker.postMessage({
                                event: a,
                                data: {
                                    data: b.data
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
                }.call(j.prototype));
                var k = function(a, b, c) {
                    var d = null;
                    var e = false;
                    var h = Object.create(f);
                    var i = [];
                    var k = new j({
                        messageBuffer: i,
                        terminate: function() {},
                        postMessage: function(a) {
                            i.push(a);
                            if (!d) return;
                            if (e) setTimeout(l);
                            else l();
                        }
                    });
                    k.setEmitSync = function(a) {
                        e = a;
                    };
                    var l = function() {
                        var a = i.shift();
                        if (a.command) d[a.command].apply(d, a.args);
                        else if (a.event) h._signal(a.event, a.data);
                    };
                    h.postMessage = function(a) {
                        k.onMessage({
                            data: a
                        });
                    };
                    h.callback = function(a, b) {
                        this.postMessage({
                            type: "call",
                            id: b,
                            data: a
                        });
                    };
                    h.emit = function(a, b) {
                        this.postMessage({
                            type: "event",
                            name: a,
                            data: b
                        });
                    };
                    g.loadModule([
                        "worker",
                        b
                    ], function(a) {
                        d = new a[c](h);
                        while(i.length)l();
                    });
                    return k;
                };
                b.UIWorkerClient = k;
                b.WorkerClient = j;
                b.createWorker = i;
            });
            ace.define("ace/placeholder", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/event_emitter",
                "ace/lib/oop", 
            ], function(a, b, c) {
                "use strict";
                var d = a("./range").Range;
                var e = a("./lib/event_emitter").EventEmitter;
                var f = a("./lib/oop");
                var g = function(a, b, c, d, e, f) {
                    var g = this;
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
                            g.onCursorChange();
                        });
                    };
                    this.$pos = c;
                    var h = a.getUndoManager().$undoStack || a.getUndoManager().$undostack || {
                        length: -1
                    };
                    this.$undoStackDepth = h.length;
                    this.setup();
                    a.selection.on("changeCursor", this.$onCursorChange);
                };
                (function() {
                    f.implement(this, e);
                    this.setup = function() {
                        var a = this;
                        var b = this.doc;
                        var c = this.session;
                        this.selectionBefore = c.selection.toJSON();
                        if (c.selection.inMultiSelectMode) c.selection.toSingleRange();
                        this.pos = b.createAnchor(this.$pos.row, this.$pos.column);
                        var e = this.pos;
                        e.$insertRight = true;
                        e.detach();
                        e.markerId = c.addMarker(new d(e.row, e.column, e.row, e.column + this.length), this.mainClass, null, false);
                        this.others = [];
                        this.$others.forEach(function(c) {
                            var d = b.createAnchor(c.row, c.column);
                            d.$insertRight = true;
                            d.detach();
                            a.others.push(d);
                        });
                        c.setUndoSelect(false);
                    };
                    this.showOtherMarkers = function() {
                        if (this.othersActive) return;
                        var a = this.session;
                        var b = this;
                        this.othersActive = true;
                        this.others.forEach(function(c) {
                            c.markerId = a.addMarker(new d(c.row, c.column, c.row, c.column + b.length), b.othersClass, null, false);
                        });
                    };
                    this.hideOtherMarkers = function() {
                        if (!this.othersActive) return;
                        this.othersActive = false;
                        for(var a = 0; a < this.others.length; a++){
                            this.session.removeMarker(this.others[a].markerId);
                        }
                    };
                    this.onUpdate = function(a) {
                        if (this.$updating) return this.updateAnchors(a);
                        var b = a;
                        if (b.start.row !== b.end.row) return;
                        if (b.start.row !== this.pos.row) return;
                        this.$updating = true;
                        var c = a.action === "insert" ? b.end.column - b.start.column : b.start.column - b.end.column;
                        var e = b.start.column >= this.pos.column && b.start.column <= this.pos.column + this.length + 1;
                        var f = b.start.column - this.pos.column;
                        this.updateAnchors(a);
                        if (e) this.length += c;
                        if (e && !this.session.$fromUndo) {
                            if (a.action === "insert") {
                                for(var g = this.others.length - 1; g >= 0; g--){
                                    var h = this.others[g];
                                    var i = {
                                        row: h.row,
                                        column: h.column + f
                                    };
                                    this.doc.insertMergedLines(i, a.lines);
                                }
                            } else if (a.action === "remove") {
                                for(var g = this.others.length - 1; g >= 0; g--){
                                    var h = this.others[g];
                                    var i = {
                                        row: h.row,
                                        column: h.column + f
                                    };
                                    this.doc.remove(new d(i.row, i.column, i.row, i.column - c));
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
                        var a = this;
                        var b = this.session;
                        var c = function(c, e) {
                            b.removeMarker(c.markerId);
                            c.markerId = b.addMarker(new d(c.row, c.column, c.row, c.column + a.length), e, null, false);
                        };
                        c(this.pos, this.mainClass);
                        for(var e = this.others.length; e--;)c(this.others[e], this.othersClass);
                    };
                    this.onCursorChange = function(a) {
                        if (this.$updating || !this.session) return;
                        var b = this.session.selection.getCursor();
                        if (b.row === this.pos.row && b.column >= this.pos.column && b.column <= this.pos.column + this.length) {
                            this.showOtherMarkers();
                            this._emit("cursorEnter", a);
                        } else {
                            this.hideOtherMarkers();
                            this._emit("cursorLeave", a);
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
                        var b = (a.$undoStack || a.$undostack).length - this.$undoStackDepth;
                        for(var c = 0; c < b; c++){
                            a.undo(this.session, true);
                        }
                        if (this.selectionBefore) this.session.selection.fromJSON(this.selectionBefore);
                    };
                }.call(g.prototype));
                b.PlaceHolder = g;
            });
            ace.define("ace/mouse/multi_select_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent", 
            ], function(a, b, c) {
                var d = a("../lib/event");
                var e = a("../lib/useragent");
                function f(a, b) {
                    return a.row == b.row && a.column == b.column;
                }
                function g(a) {
                    var b = a.domEvent;
                    var c = b.altKey;
                    var g = b.shiftKey;
                    var h = b.ctrlKey;
                    var i = a.getAccelKey();
                    var j = a.getButton();
                    if (h && e.isMac) j = b.button;
                    if (a.editor.inMultiSelectMode && j == 2) {
                        a.editor.textInput.onContextMenu(a.domEvent);
                        return;
                    }
                    if (!h && !c && !i) {
                        if (j === 0 && a.editor.inMultiSelectMode) a.editor.exitMultiSelectMode();
                        return;
                    }
                    if (j !== 0) return;
                    var k = a.editor;
                    var l = k.selection;
                    var m = k.inMultiSelectMode;
                    var n = a.getDocumentPosition();
                    var o = l.getCursor();
                    var p = a.inSelection() || (l.isEmpty() && f(n, o));
                    var q = a.x, r = a.y;
                    var s = function(a) {
                        q = a.clientX;
                        r = a.clientY;
                    };
                    var t = k.session;
                    var u = k.renderer.pixelToScreenCoordinates(q, r);
                    var v = u;
                    var w;
                    if (k.$mouseHandler.$enableJumpToDef) {
                        if ((h && c) || (i && c)) w = g ? "block" : "add";
                        else if (c && k.$blockSelectEnabled) w = "block";
                    } else {
                        if (i && !c) {
                            w = "add";
                            if (!m && g) return;
                        } else if (c && k.$blockSelectEnabled) {
                            w = "block";
                        }
                    }
                    if (w && e.isMac && b.ctrlKey) {
                        k.$mouseHandler.cancelContextMenu();
                    }
                    if (w == "add") {
                        if (!m && p) return;
                        if (!m) {
                            var x = l.toOrientedRange();
                            k.addSelectionMarker(x);
                        }
                        var y = l.rangeList.rangeAtPoint(n);
                        k.inVirtualSelectionMode = true;
                        if (g) {
                            y = null;
                            x = l.ranges[0] || x;
                            k.removeSelectionMarker(x);
                        }
                        k.once("mouseup", function() {
                            var a = l.toOrientedRange();
                            if (y && a.isEmpty() && f(y.cursor, a.cursor)) l.substractPoint(a.cursor);
                            else {
                                if (g) {
                                    l.substractPoint(x.cursor);
                                } else if (x) {
                                    k.removeSelectionMarker(x);
                                    l.addRange(x);
                                }
                                l.addRange(a);
                            }
                            k.inVirtualSelectionMode = false;
                        });
                    } else if (w == "block") {
                        a.stop();
                        k.inVirtualSelectionMode = true;
                        var z;
                        var A = [];
                        var B = function() {
                            var a = k.renderer.pixelToScreenCoordinates(q, r);
                            var b = t.screenToDocumentPosition(a.row, a.column, a.offsetX);
                            if (f(v, a) && f(b, l.lead)) return;
                            v = a;
                            k.selection.moveToPosition(b);
                            k.renderer.scrollCursorIntoView();
                            k.removeSelectionMarkers(A);
                            A = l.rectangularRangeBlock(v, u);
                            if (k.$mouseHandler.$clickSelection && A.length == 1 && A[0].isEmpty()) A[0] = k.$mouseHandler.$clickSelection.clone();
                            A.forEach(k.addSelectionMarker, k);
                            k.updateSelectionMarkers();
                        };
                        if (m && !i) {
                            l.toSingleRange();
                        } else if (!m && i) {
                            z = l.toOrientedRange();
                            k.addSelectionMarker(z);
                        }
                        if (g) u = t.documentToScreenPosition(l.lead);
                        else l.moveToPosition(n);
                        v = {
                            row: -1,
                            column: -1
                        };
                        var C = function(a) {
                            B();
                            clearInterval(E);
                            k.removeSelectionMarkers(A);
                            if (!A.length) A = [
                                l.toOrientedRange()
                            ];
                            if (z) {
                                k.removeSelectionMarker(z);
                                l.toSingleRange(z);
                            }
                            for(var b = 0; b < A.length; b++)l.addRange(A[b]);
                            k.inVirtualSelectionMode = false;
                            k.$mouseHandler.$clickSelection = null;
                        };
                        var D = B;
                        d.capture(k.container, s, C);
                        var E = setInterval(function() {
                            D();
                        }, 20);
                        return a.preventDefault();
                    }
                }
                b.onMouseDown = g;
            });
            ace.define("ace/commands/multi_select_commands", [
                "require",
                "exports",
                "module",
                "ace/keyboard/hash_handler"
            ], function(a, b, c) {
                b.defaultCommands = [
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
                b.multiSelectCommands = [
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
                var d = a("../keyboard/hash_handler").HashHandler;
                b.keyboardHandler = new d(b.multiSelectCommands);
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
            ], function(a, b, c) {
                var d = a("./range_list").RangeList;
                var e = a("./range").Range;
                var f = a("./selection").Selection;
                var g = a("./mouse/multi_select_handler").onMouseDown;
                var h = a("./lib/event");
                var i = a("./lib/lang");
                var j = a("./commands/multi_select_commands");
                b.commands = j.defaultCommands.concat(j.multiSelectCommands);
                var k = a("./search").Search;
                var l = new k();
                function m(a, b, c) {
                    l.$options.wrap = true;
                    l.$options.needle = b;
                    l.$options.backwards = c == -1;
                    return l.find(a);
                }
                var n = a("./edit_session").EditSession;
                (function() {
                    this.getSelectionMarkers = function() {
                        return this.$selectionMarkers;
                    };
                }.call(n.prototype));
                (function() {
                    this.ranges = null;
                    this.rangeList = null;
                    this.addRange = function(a, b) {
                        if (!a) return;
                        if (!this.inMultiSelectMode && this.rangeCount === 0) {
                            var c = this.toOrientedRange();
                            this.rangeList.add(c);
                            this.rangeList.add(a);
                            if (this.rangeList.ranges.length != 2) {
                                this.rangeList.removeAll();
                                return (b || this.fromOrientedRange(a));
                            }
                            this.rangeList.removeAll();
                            this.rangeList.add(c);
                            this.$onAddRange(c);
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
                        return (b || this.fromOrientedRange(a));
                    };
                    this.toSingleRange = function(a) {
                        a = a || this.ranges[0];
                        var b = this.rangeList.removeAll();
                        if (b.length) this.$onRemoveRange(b);
                        a && this.fromOrientedRange(a);
                    };
                    this.substractPoint = function(a) {
                        var b = this.rangeList.substractPoint(a);
                        if (b) {
                            this.$onRemoveRange(b);
                            return b[0];
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
                    this.$onRemoveRange = function(a) {
                        this.rangeCount = this.rangeList.ranges.length;
                        if (this.rangeCount == 1 && this.inMultiSelectMode) {
                            var b = this.rangeList.ranges.pop();
                            a.push(b);
                            this.rangeCount = 0;
                        }
                        for(var c = a.length; c--;){
                            var d = this.ranges.indexOf(a[c]);
                            this.ranges.splice(d, 1);
                        }
                        this._signal("removeRange", {
                            ranges: a
                        });
                        if (this.rangeCount === 0 && this.inMultiSelectMode) {
                            this.inMultiSelectMode = false;
                            this._signal("singleSelect");
                            this.session.$undoSelect = true;
                            this.rangeList.detach(this.session);
                        }
                        b = b || this.ranges[0];
                        if (b && !b.isEqual(this.getRange())) this.fromOrientedRange(b);
                    };
                    this.$initRangeList = function() {
                        if (this.rangeList) return;
                        this.rangeList = new d();
                        this.ranges = [];
                        this.rangeCount = 0;
                    };
                    this.getAllRanges = function() {
                        return this.rangeCount ? this.rangeList.ranges.concat() : [
                            this.getRange()
                        ];
                    };
                    this.splitIntoLines = function() {
                        var a = this.ranges.length ? this.ranges : [
                            this.getRange()
                        ];
                        var b = [];
                        for(var c = 0; c < a.length; c++){
                            var d = a[c];
                            var f = d.start.row;
                            var g = d.end.row;
                            if (f === g) {
                                b.push(d.clone());
                            } else {
                                b.push(new e(f, d.start.column, f, this.session.getLine(f).length));
                                while(++f < g)b.push(this.getLineRange(f, true));
                                b.push(new e(g, 0, g, d.end.column));
                            }
                            if (c == 0 && !this.isBackwards()) b = b.reverse();
                        }
                        this.toSingleRange();
                        for(var c = b.length; c--;)this.addRange(b[c]);
                    };
                    this.joinSelections = function() {
                        var a = this.rangeList.ranges;
                        var b = a[a.length - 1];
                        var c = e.fromPoints(a[0].start, b.end);
                        this.toSingleRange();
                        this.setSelectionRange(c, b.cursor == b.start);
                    };
                    this.toggleBlockSelection = function() {
                        if (this.rangeCount > 1) {
                            var a = this.rangeList.ranges;
                            var b = a[a.length - 1];
                            var c = e.fromPoints(a[0].start, b.end);
                            this.toSingleRange();
                            this.setSelectionRange(c, b.cursor == b.start);
                        } else {
                            var d = this.session.documentToScreenPosition(this.cursor);
                            var f = this.session.documentToScreenPosition(this.anchor);
                            var g = this.rectangularRangeBlock(d, f);
                            g.forEach(this.addRange, this);
                        }
                    };
                    this.rectangularRangeBlock = function(a, b, c) {
                        var d = [];
                        var f = a.column < b.column;
                        if (f) {
                            var g = a.column;
                            var h = b.column;
                            var i = a.offsetX;
                            var j = b.offsetX;
                        } else {
                            var g = b.column;
                            var h = a.column;
                            var i = b.offsetX;
                            var j = a.offsetX;
                        }
                        var k = a.row < b.row;
                        if (k) {
                            var l = a.row;
                            var m = b.row;
                        } else {
                            var l = b.row;
                            var m = a.row;
                        }
                        if (g < 0) g = 0;
                        if (l < 0) l = 0;
                        if (l == m) c = true;
                        var n;
                        for(var o = l; o <= m; o++){
                            var q = e.fromPoints(this.session.screenToDocumentPosition(o, g, i), this.session.screenToDocumentPosition(o, h, j));
                            if (q.isEmpty()) {
                                if (n && p(q.end, n)) break;
                                n = q.end;
                            }
                            q.cursor = f ? q.start : q.end;
                            d.push(q);
                        }
                        if (k) d.reverse();
                        if (!c) {
                            var r = d.length - 1;
                            while(d[r].isEmpty() && r > 0)r--;
                            if (r > 0) {
                                var s = 0;
                                while(d[s].isEmpty())s++;
                            }
                            for(var t = r; t >= s; t--){
                                if (d[t].isEmpty()) d.splice(t, 1);
                            }
                        }
                        return d;
                    };
                }.call(f.prototype));
                var o = a("./editor").Editor;
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
                    this.removeSelectionMarkers = function(a) {
                        var b = this.session.$selectionMarkers;
                        for(var c = a.length; c--;){
                            var d = a[c];
                            if (!d.marker) continue;
                            this.session.removeMarker(d.marker);
                            var e = b.indexOf(d);
                            if (e != -1) b.splice(e, 1);
                        }
                        this.session.selectionMarkerCount = b.length;
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
                        this.keyBinding.addKeyboardHandler(j.keyboardHandler);
                        this.commands.setDefaultHandler("exec", this.$onMultiSelectExec);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                    };
                    this.$onSingleSelect = function(a) {
                        if (this.session.multiSelect.inVirtualMode) return;
                        this.inMultiSelectMode = false;
                        this.unsetStyle("ace_multiselect");
                        this.keyBinding.removeKeyboardHandler(j.keyboardHandler);
                        this.commands.removeDefaultHandler("exec", this.$onMultiSelectExec);
                        this.renderer.updateCursor();
                        this.renderer.updateBackMarkers();
                        this._emit("changeSelection");
                    };
                    this.$onMultiSelectExec = function(a) {
                        var b = a.command;
                        var c = a.editor;
                        if (!c.multiSelect) return;
                        if (!b.multiSelectAction) {
                            var d = b.exec(c, a.args || {});
                            c.multiSelect.addRange(c.multiSelect.toOrientedRange());
                            c.multiSelect.mergeOverlappingRanges();
                        } else if (b.multiSelectAction == "forEach") {
                            d = c.forEachSelection(b, a.args);
                        } else if (b.multiSelectAction == "forEachLine") {
                            d = c.forEachSelection(b, a.args, true);
                        } else if (b.multiSelectAction == "single") {
                            c.exitMultiSelectMode();
                            d = b.exec(c, a.args || {});
                        } else {
                            d = b.multiSelectAction(c, a.args || {});
                        }
                        return d;
                    };
                    this.forEachSelection = function(a, b, c) {
                        if (this.inVirtualSelectionMode) return;
                        var d = c && c.keepOrder;
                        var e = c == true || (c && c.$byLines);
                        var g = this.session;
                        var h = this.selection;
                        var i = h.rangeList;
                        var j = (d ? h : i).ranges;
                        var k;
                        if (!j.length) return a.exec ? a.exec(this, b || {}) : a(this, b || {});
                        var l = h._eventRegistry;
                        h._eventRegistry = {};
                        var m = new f(g);
                        this.inVirtualSelectionMode = true;
                        for(var n = j.length; n--;){
                            if (e) {
                                while(n > 0 && j[n].start.row == j[n - 1].end.row)n--;
                            }
                            m.fromOrientedRange(j[n]);
                            m.index = n;
                            this.selection = g.selection = m;
                            var o = a.exec ? a.exec(this, b || {}) : a(this, b || {});
                            if (!k && o !== undefined) k = o;
                            m.toOrientedRange(j[n]);
                        }
                        m.detach();
                        this.selection = g.selection = h;
                        this.inVirtualSelectionMode = false;
                        h._eventRegistry = l;
                        h.mergeOverlappingRanges();
                        if (h.ranges[0]) h.fromOrientedRange(h.ranges[0]);
                        var p = this.renderer.$scrollAnimation;
                        this.onCursorChange();
                        this.onSelectionChange();
                        if (p && p.from == p.to) this.renderer.animateScrolling(p.from);
                        return k;
                    };
                    this.exitMultiSelectMode = function() {
                        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) return;
                        this.multiSelect.toSingleRange();
                    };
                    this.getSelectedText = function() {
                        var a = "";
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            var b = this.multiSelect.rangeList.ranges;
                            var c = [];
                            for(var d = 0; d < b.length; d++){
                                c.push(this.session.getTextRange(b[d]));
                            }
                            var e = this.session.getDocument().getNewLineCharacter();
                            a = c.join(e);
                            if (a.length == (c.length - 1) * e.length) a = "";
                        } else if (!this.selection.isEmpty()) {
                            a = this.session.getTextRange(this.getSelectionRange());
                        }
                        return a;
                    };
                    this.$checkMultiselectChange = function(a, b) {
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            var c = this.multiSelect.ranges[0];
                            if (this.multiSelect.isEmpty() && b == this.multiSelect.anchor) return;
                            var d = b == this.multiSelect.anchor ? c.cursor == c.start ? c.end : c.start : c.cursor;
                            if (d.row != b.row || this.session.$clipPositionToDocument(d.row, d.column).column != b.column) this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange());
                            else this.multiSelect.mergeOverlappingRanges();
                        }
                    };
                    this.findAll = function(a, b, c) {
                        b = b || {};
                        b.needle = a || b.needle;
                        if (b.needle == undefined) {
                            var d = this.selection.isEmpty() ? this.selection.getWordRange() : this.selection.getRange();
                            b.needle = this.session.getTextRange(d);
                        }
                        this.$search.set(b);
                        var e = this.$search.findAll(this.session);
                        if (!e.length) return 0;
                        var f = this.multiSelect;
                        if (!c) f.toSingleRange(e[0]);
                        for(var g = e.length; g--;)f.addRange(e[g], true);
                        if (d && f.rangeList.rangeAtPoint(d.start)) f.addRange(d, true);
                        return e.length;
                    };
                    this.selectMoreLines = function(a, b) {
                        var c = this.selection.toOrientedRange();
                        var d = c.cursor == c.end;
                        var f = this.session.documentToScreenPosition(c.cursor);
                        if (this.selection.$desiredColumn) f.column = this.selection.$desiredColumn;
                        var g = this.session.screenToDocumentPosition(f.row + a, f.column);
                        if (!c.isEmpty()) {
                            var h = this.session.documentToScreenPosition(d ? c.end : c.start);
                            var i = this.session.screenToDocumentPosition(h.row + a, h.column);
                        } else {
                            var i = g;
                        }
                        if (d) {
                            var j = e.fromPoints(g, i);
                            j.cursor = j.start;
                        } else {
                            var j = e.fromPoints(i, g);
                            j.cursor = j.end;
                        }
                        j.desiredColumn = f.column;
                        if (!this.selection.inMultiSelectMode) {
                            this.selection.addRange(c);
                        } else {
                            if (b) var k = c.cursor;
                        }
                        this.selection.addRange(j);
                        if (k) this.selection.substractPoint(k);
                    };
                    this.transposeSelections = function(a) {
                        var b = this.session;
                        var c = b.multiSelect;
                        var d = c.ranges;
                        for(var e = d.length; e--;){
                            var f = d[e];
                            if (f.isEmpty()) {
                                var g = b.getWordRange(f.start.row, f.start.column);
                                f.start.row = g.start.row;
                                f.start.column = g.start.column;
                                f.end.row = g.end.row;
                                f.end.column = g.end.column;
                            }
                        }
                        c.mergeOverlappingRanges();
                        var h = [];
                        for(var e = d.length; e--;){
                            var f = d[e];
                            h.unshift(b.getTextRange(f));
                        }
                        if (a < 0) h.unshift(h.pop());
                        else h.push(h.shift());
                        for(var e = d.length; e--;){
                            var f = d[e];
                            var g = f.clone();
                            b.replace(f, h[e]);
                            f.start.row = g.start.row;
                            f.start.column = g.start.column;
                        }
                        c.fromOrientedRange(c.ranges[0]);
                    };
                    this.selectMore = function(a, b, c) {
                        var d = this.session;
                        var e = d.multiSelect;
                        var f = e.toOrientedRange();
                        if (f.isEmpty()) {
                            f = d.getWordRange(f.start.row, f.start.column);
                            f.cursor = a == -1 ? f.start : f.end;
                            this.multiSelect.addRange(f);
                            if (c) return;
                        }
                        var g = d.getTextRange(f);
                        var h = m(d, g, a);
                        if (h) {
                            h.cursor = a == -1 ? h.start : h.end;
                            this.session.unfold(h);
                            this.multiSelect.addRange(h);
                            this.renderer.scrollCursorIntoView(null, 0.5);
                        }
                        if (b) this.multiSelect.substractPoint(f.cursor);
                    };
                    this.alignCursors = function() {
                        var a = this.session;
                        var b = a.multiSelect;
                        var c = b.ranges;
                        var d = -1;
                        var f = c.filter(function(a) {
                            if (a.cursor.row == d) return true;
                            d = a.cursor.row;
                        });
                        if (!c.length || f.length == c.length - 1) {
                            var g = this.selection.getRange();
                            var h = g.start.row, j = g.end.row;
                            var k = h == j;
                            if (k) {
                                var l = this.session.getLength();
                                var m;
                                do {
                                    m = this.session.getLine(j);
                                }while (/[=:]/.test(m) && ++j < l)
                                do {
                                    m = this.session.getLine(h);
                                }while (/[=:]/.test(m) && --h > 0)
                                if (h < 0) h = 0;
                                if (j >= l) j = l - 1;
                            }
                            var n = this.session.removeFullLines(h, j);
                            n = this.$reAlignText(n, k);
                            this.session.insert({
                                row: h,
                                column: 0
                            }, n.join("\n") + "\n");
                            if (!k) {
                                g.start.column = 0;
                                g.end.column = n[n.length - 1].length;
                            }
                            this.selection.setRange(g);
                        } else {
                            f.forEach(function(a) {
                                b.substractPoint(a.cursor);
                            });
                            var o = 0;
                            var p = Infinity;
                            var q = c.map(function(b) {
                                var c = b.cursor;
                                var d = a.getLine(c.row);
                                var e = d.substr(c.column).search(/\S/g);
                                if (e == -1) e = 0;
                                if (c.column > o) o = c.column;
                                if (e < p) p = e;
                                return e;
                            });
                            c.forEach(function(b, c) {
                                var d = b.cursor;
                                var f = o - d.column;
                                var g = q[c] - p;
                                if (f > g) a.insert(d, i.stringRepeat(" ", f - g));
                                else a.remove(new e(d.row, d.column, d.row, d.column - f + g));
                                b.start.column = b.end.column = o;
                                b.start.row = b.end.row = d.row;
                                b.cursor = b.end;
                            });
                            b.fromOrientedRange(c[0]);
                            this.renderer.updateCursor();
                            this.renderer.updateBackMarkers();
                        }
                    };
                    this.$reAlignText = function(a, b) {
                        var c = true, d = true;
                        var e, f, g;
                        return a.map(function(a) {
                            var b = a.match(/(\s*)(.*?)(\s*)([=:].*)/);
                            if (!b) return [
                                a
                            ];
                            if (e == null) {
                                e = b[1].length;
                                f = b[2].length;
                                g = b[3].length;
                                return b;
                            }
                            if (e + f + g != b[1].length + b[2].length + b[3].length) d = false;
                            if (e != b[1].length) c = false;
                            if (e > b[1].length) e = b[1].length;
                            if (f < b[2].length) f = b[2].length;
                            if (g > b[3].length) g = b[3].length;
                            return b;
                        }).map(b ? j : c ? d ? k : j : l);
                        function h(a) {
                            return i.stringRepeat(" ", a);
                        }
                        function j(a) {
                            return !a[2] ? a[0] : h(e) + a[2] + h(f - a[2].length + g) + a[4].replace(/^([=:])\s+/, "$1 ");
                        }
                        function k(a) {
                            return !a[2] ? a[0] : h(e + f - a[2].length) + a[2] + h(g) + a[4].replace(/^([=:])\s+/, "$1 ");
                        }
                        function l(a) {
                            return !a[2] ? a[0] : h(e) + a[2] + h(g) + a[4].replace(/^([=:])\s+/, "$1 ");
                        }
                    };
                }.call(o.prototype));
                function p(a, b) {
                    return a.row == b.row && a.column == b.column;
                }
                b.onSessionChange = function(a) {
                    var b = a.session;
                    if (b && !b.multiSelect) {
                        b.$selectionMarkers = [];
                        b.selection.$initRangeList();
                        b.multiSelect = b.selection;
                    }
                    this.multiSelect = b && b.multiSelect;
                    var c = a.oldSession;
                    if (c) {
                        c.multiSelect.off("addRange", this.$onAddRange);
                        c.multiSelect.off("removeRange", this.$onRemoveRange);
                        c.multiSelect.off("multiSelect", this.$onMultiSelect);
                        c.multiSelect.off("singleSelect", this.$onSingleSelect);
                        c.multiSelect.lead.off("change", this.$checkMultiselectChange);
                        c.multiSelect.anchor.off("change", this.$checkMultiselectChange);
                    }
                    if (b) {
                        b.multiSelect.on("addRange", this.$onAddRange);
                        b.multiSelect.on("removeRange", this.$onRemoveRange);
                        b.multiSelect.on("multiSelect", this.$onMultiSelect);
                        b.multiSelect.on("singleSelect", this.$onSingleSelect);
                        b.multiSelect.lead.on("change", this.$checkMultiselectChange);
                        b.multiSelect.anchor.on("change", this.$checkMultiselectChange);
                    }
                    if (b && this.inMultiSelectMode != b.selection.inMultiSelectMode) {
                        if (b.selection.inMultiSelectMode) this.$onMultiSelect();
                        else this.$onSingleSelect();
                    }
                };
                function q(a) {
                    if (a.$multiselectOnSessionChange) return;
                    a.$onAddRange = a.$onAddRange.bind(a);
                    a.$onRemoveRange = a.$onRemoveRange.bind(a);
                    a.$onMultiSelect = a.$onMultiSelect.bind(a);
                    a.$onSingleSelect = a.$onSingleSelect.bind(a);
                    a.$multiselectOnSessionChange = b.onSessionChange.bind(a);
                    a.$checkMultiselectChange = a.$checkMultiselectChange.bind(a);
                    a.$multiselectOnSessionChange(a);
                    a.on("changeSession", a.$multiselectOnSessionChange);
                    a.on("mousedown", g);
                    a.commands.addCommands(j.defaultCommands);
                    r(a);
                }
                function r(a) {
                    if (!a.textInput) return;
                    var b = a.textInput.getElement();
                    var c = false;
                    h.addListener(b, "keydown", function(b) {
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
                    h.addListener(b, "keyup", d, a);
                    h.addListener(b, "blur", d, a);
                    function d(b) {
                        if (c) {
                            a.renderer.setMouseCursor("");
                            c = false;
                        }
                    }
                }
                b.MultiSelect = q;
                a("./config").defineOptions(o.prototype, "editor", {
                    enableMultiselect: {
                        set: function(a) {
                            q(this);
                            if (a) {
                                this.on("changeSession", this.$multiselectOnSessionChange);
                                this.on("mousedown", g);
                            } else {
                                this.off("changeSession", this.$multiselectOnSessionChange);
                                this.off("mousedown", g);
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
            ], function(a, b, c) {
                "use strict";
                var d = a("../../range").Range;
                var e = (b.FoldMode = function() {});
                (function() {
                    this.foldingStartMarker = null;
                    this.foldingStopMarker = null;
                    this.getFoldWidget = function(a, b, c) {
                        var d = a.getLine(c);
                        if (this.foldingStartMarker.test(d)) return "start";
                        if (b == "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(d)) return "end";
                        return "";
                    };
                    this.getFoldWidgetRange = function(a, b, c) {
                        return null;
                    };
                    this.indentationBlock = function(a, b, c) {
                        var e = /\S/;
                        var f = a.getLine(b);
                        var g = f.search(e);
                        if (g == -1) return;
                        var h = c || f.length;
                        var i = a.getLength();
                        var j = b;
                        var k = b;
                        while(++b < i){
                            var l = a.getLine(b).search(e);
                            if (l == -1) continue;
                            if (l <= g) {
                                var m = a.getTokenAt(b, 0);
                                if (!m || m.type !== "string") break;
                            }
                            k = b;
                        }
                        if (k > j) {
                            var n = a.getLine(k).length;
                            return new d(j, h, k, n);
                        }
                    };
                    this.openingBracketBlock = function(a, b, c, e, f) {
                        var g = {
                            row: c,
                            column: e + 1
                        };
                        var h = a.$findClosingBracket(b, g, f);
                        if (!h) return;
                        var i = a.foldWidgets[h.row];
                        if (i == null) i = a.getFoldWidget(h.row);
                        if (i == "start" && h.row > g.row) {
                            h.row--;
                            h.column = a.getLine(h.row).length;
                        }
                        return d.fromPoints(g, h);
                    };
                    this.closingBracketBlock = function(a, b, c, e, f) {
                        var g = {
                            row: c,
                            column: e
                        };
                        var h = a.$findOpeningBracket(b, g);
                        if (!h) return;
                        h.column++;
                        g.column--;
                        return d.fromPoints(h, g);
                    };
                }.call(e.prototype));
            });
            ace.define("ace/theme/textmate", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(a, b, c) {
                "use strict";
                b.isDark = false;
                b.cssClass = "ace-tm";
                b.cssText = '.ace-tm .ace_gutter {\
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
                b.$id = "ace/theme/textmate";
                var d = a("../lib/dom");
                d.importCssString(b.cssText, b.cssClass, false);
            });
            ace.define("ace/line_widgets", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(a, b, c) {
                "use strict";
                var d = a("./lib/dom");
                function e(a) {
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
                    this.detach = function(a) {
                        var b = this.editor;
                        if (!b) return;
                        this.editor = null;
                        b.widgetManager = null;
                        b.renderer.off("beforeRender", this.measureWidgets);
                        b.renderer.off("afterRender", this.renderWidgets);
                        var c = this.session.lineWidgets;
                        c && c.forEach(function(a) {
                            if (a && a.el && a.el.parentNode) {
                                a._inDocument = false;
                                a.el.parentNode.removeChild(a.el);
                            }
                        });
                    };
                    this.updateOnFold = function(a, b) {
                        var c = b.lineWidgets;
                        if (!c || !a.action) return;
                        var d = a.data;
                        var e = d.start.row;
                        var f = d.end.row;
                        var g = a.action == "add";
                        for(var h = e + 1; h < f; h++){
                            if (c[h]) c[h].hidden = g;
                        }
                        if (c[f]) {
                            if (g) {
                                if (!c[e]) c[e] = c[f];
                                else c[f].hidden = g;
                            } else {
                                if (c[e] == c[f]) c[e] = undefined;
                                c[f].hidden = g;
                            }
                        }
                    };
                    this.updateOnChange = function(a) {
                        var b = this.session.lineWidgets;
                        if (!b) return;
                        var c = a.start.row;
                        var d = a.end.row - c;
                        if (d === 0) {} else if (a.action == "remove") {
                            var e = b.splice(c + 1, d);
                            if (!b[c] && e[e.length - 1]) {
                                b[c] = e.pop();
                            }
                            e.forEach(function(a) {
                                a && this.removeLineWidget(a);
                            }, this);
                            this.$updateRows();
                        } else {
                            var f = new Array(d);
                            if (b[c] && b[c].column != null) {
                                if (a.start.column > b[c].column) c++;
                            }
                            f.unshift(c, 0);
                            b.splice.apply(b, f);
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
                    this.$registerLineWidget = function(a) {
                        if (!this.session.lineWidgets) this.session.lineWidgets = new Array(this.session.getLength());
                        var b = this.session.lineWidgets[a.row];
                        if (b) {
                            a.$oldWidget = b;
                            if (b.el && b.el.parentNode) {
                                b.el.parentNode.removeChild(b.el);
                                b._inDocument = false;
                            }
                        }
                        this.session.lineWidgets[a.row] = a;
                        return a;
                    };
                    this.addLineWidget = function(a) {
                        this.$registerLineWidget(a);
                        a.session = this.session;
                        if (!this.editor) return a;
                        var b = this.editor.renderer;
                        if (a.html && !a.el) {
                            a.el = d.createElement("div");
                            a.el.innerHTML = a.html;
                        }
                        if (a.el) {
                            d.addCssClass(a.el, "ace_lineWidgetContainer");
                            a.el.style.position = "absolute";
                            a.el.style.zIndex = 5;
                            b.container.appendChild(a.el);
                            a._inDocument = true;
                            if (!a.coverGutter) {
                                a.el.style.zIndex = 3;
                            }
                            if (a.pixelHeight == null) {
                                a.pixelHeight = a.el.offsetHeight;
                            }
                        }
                        if (a.rowCount == null) {
                            a.rowCount = a.pixelHeight / b.layerConfig.lineHeight;
                        }
                        var c = this.session.getFoldAt(a.row, 0);
                        a.$fold = c;
                        if (c) {
                            var e = this.session.lineWidgets;
                            if (a.row == c.end.row && !e[c.start.row]) e[c.start.row] = a;
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
                        this.renderWidgets(null, b);
                        this.onWidgetChanged(a);
                        return a;
                    };
                    this.removeLineWidget = function(a) {
                        a._inDocument = false;
                        a.session = null;
                        if (a.el && a.el.parentNode) a.el.parentNode.removeChild(a.el);
                        if (a.editor && a.editor.destroy) try {
                            a.editor.destroy();
                        } catch (b) {}
                        if (this.session.lineWidgets) {
                            var c = this.session.lineWidgets[a.row];
                            if (c == a) {
                                this.session.lineWidgets[a.row] = a.$oldWidget;
                                if (a.$oldWidget) this.onWidgetChanged(a.$oldWidget);
                            } else {
                                while(c){
                                    if (c.$oldWidget == a) {
                                        c.$oldWidget = a.$oldWidget;
                                        break;
                                    }
                                    c = c.$oldWidget;
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
                    this.getWidgetsAtRow = function(a) {
                        var b = this.session.lineWidgets;
                        var c = b && b[a];
                        var d = [];
                        while(c){
                            d.push(c);
                            c = c.$oldWidget;
                        }
                        return d;
                    };
                    this.onWidgetChanged = function(a) {
                        this.session._changedWidgets.push(a);
                        this.editor && this.editor.renderer.updateFull();
                    };
                    this.measureWidgets = function(a, b) {
                        var c = this.session._changedWidgets;
                        var d = b.layerConfig;
                        if (!c || !c.length) return;
                        var e = Infinity;
                        for(var f = 0; f < c.length; f++){
                            var g = c[f];
                            if (!g || !g.el) continue;
                            if (g.session != this.session) continue;
                            if (!g._inDocument) {
                                if (this.session.lineWidgets[g.row] != g) continue;
                                g._inDocument = true;
                                b.container.appendChild(g.el);
                            }
                            g.h = g.el.offsetHeight;
                            if (!g.fixedWidth) {
                                g.w = g.el.offsetWidth;
                                g.screenWidth = Math.ceil(g.w / d.characterWidth);
                            }
                            var h = g.h / d.lineHeight;
                            if (g.coverLine) {
                                h -= this.session.getRowLineCount(g.row);
                                if (h < 0) h = 0;
                            }
                            if (g.rowCount != h) {
                                g.rowCount = h;
                                if (g.row < e) e = g.row;
                            }
                        }
                        if (e != Infinity) {
                            this.session._emit("changeFold", {
                                data: {
                                    start: {
                                        row: e
                                    }
                                }
                            });
                            this.session.lineWidgetWidth = null;
                        }
                        this.session._changedWidgets = [];
                    };
                    this.renderWidgets = function(a, b) {
                        var c = b.layerConfig;
                        var d = this.session.lineWidgets;
                        if (!d) return;
                        var e = Math.min(this.firstRow, c.firstRow);
                        var f = Math.max(this.lastRow, c.lastRow, d.length);
                        while(e > 0 && !d[e])e--;
                        this.firstRow = c.firstRow;
                        this.lastRow = c.lastRow;
                        b.$cursorLayer.config = c;
                        for(var g = e; g <= f; g++){
                            var h = d[g];
                            if (!h || !h.el) continue;
                            if (h.hidden) {
                                h.el.style.top = -100 - (h.pixelHeight || 0) + "px";
                                continue;
                            }
                            if (!h._inDocument) {
                                h._inDocument = true;
                                b.container.appendChild(h.el);
                            }
                            var i = b.$cursorLayer.getPixelPosition({
                                row: g,
                                column: 0
                            }, true).top;
                            if (!h.coverLine) i += c.lineHeight * this.session.getRowLineCount(h.row);
                            h.el.style.top = i - c.offset + "px";
                            var j = h.coverGutter ? 0 : b.gutterWidth;
                            if (!h.fixedWidth) j -= b.scrollLeft;
                            h.el.style.left = j + "px";
                            if (h.fullWidth && h.screenWidth) {
                                h.el.style.minWidth = c.width + 2 * c.padding + "px";
                            }
                            if (h.fixedWidth) {
                                h.el.style.right = b.scrollBar.getWidth() + "px";
                            } else {
                                h.el.style.right = "";
                            }
                        }
                    };
                }.call(e.prototype));
                b.LineWidgets = e;
            });
            ace.define("ace/ext/error_marker", [
                "require",
                "exports",
                "module",
                "ace/line_widgets",
                "ace/lib/dom",
                "ace/range", 
            ], function(a, b, c) {
                "use strict";
                var d = a("../line_widgets").LineWidgets;
                var e = a("../lib/dom");
                var f = a("../range").Range;
                function g(a, b, c) {
                    var d = 0;
                    var e = a.length - 1;
                    while(d <= e){
                        var f = (d + e) >> 1;
                        var g = c(b, a[f]);
                        if (g > 0) d = f + 1;
                        else if (g < 0) e = f - 1;
                        else return f;
                    }
                    return -(d + 1);
                }
                function h(a, b, c) {
                    var d = a.getAnnotations().sort(f.comparePoints);
                    if (!d.length) return;
                    var e = g(d, {
                        row: b,
                        column: -1
                    }, f.comparePoints);
                    if (e < 0) e = -e - 1;
                    if (e >= d.length) e = c > 0 ? 0 : d.length - 1;
                    else if (e === 0 && c < 0) e = d.length - 1;
                    var h = d[e];
                    if (!h || !c) return;
                    if (h.row === b) {
                        do {
                            h = d[(e += c)];
                        }while (h && h.row === b)
                        if (!h) return d.slice();
                    }
                    var i = [];
                    b = h.row;
                    do {
                        i[c < 0 ? "unshift" : "push"](h);
                        h = d[(e += c)];
                    }while (h && h.row == b)
                    return i.length && i;
                }
                b.showErrorMarker = function(a, b) {
                    var c = a.session;
                    if (!c.widgetManager) {
                        c.widgetManager = new d(c);
                        c.widgetManager.attach(a);
                    }
                    var f = a.getCursorPosition();
                    var g = f.row;
                    var i = c.widgetManager.getWidgetsAtRow(g).filter(function(a) {
                        return a.type == "errorMarker";
                    })[0];
                    if (i) {
                        i.destroy();
                    } else {
                        g -= b;
                    }
                    var j = h(c, g, b);
                    var k;
                    if (j) {
                        var l = j[0];
                        f.column = (l.pos && typeof l.column != "number" ? l.pos.sc : l.column) || 0;
                        f.row = l.row;
                        k = a.renderer.$gutterLayer.$annotations[f.row];
                    } else if (i) {
                        return;
                    } else {
                        k = {
                            text: [
                                "Looks good!"
                            ],
                            className: "ace_ok"
                        };
                    }
                    a.session.unfold(f.row);
                    a.selection.moveToPosition(f);
                    var m = {
                        row: f.row,
                        fixedWidth: true,
                        coverGutter: true,
                        el: e.createElement("div"),
                        type: "errorMarker"
                    };
                    var n = m.el.appendChild(e.createElement("div"));
                    var o = m.el.appendChild(e.createElement("div"));
                    o.className = "error_widget_arrow " + k.className;
                    var p = a.renderer.$cursorLayer.getPixelPosition(f).left;
                    o.style.left = p + a.renderer.gutterWidth - 5 + "px";
                    m.el.className = "error_widget_wrapper";
                    n.className = "error_widget " + k.className;
                    n.innerHTML = k.text.join("<br>");
                    n.appendChild(e.createElement("div"));
                    var q = function(a, b, c) {
                        if (b === 0 && (c === "esc" || c === "return")) {
                            m.destroy();
                            return {
                                command: "null"
                            };
                        }
                    };
                    m.destroy = function() {
                        if (a.$mouseHandler.isMousePressed) return;
                        a.keyBinding.removeKeyboardHandler(q);
                        c.widgetManager.removeLineWidget(m);
                        a.off("changeSelection", m.destroy);
                        a.off("changeSession", m.destroy);
                        a.off("mouseup", m.destroy);
                        a.off("change", m.destroy);
                    };
                    a.keyBinding.addKeyboardHandler(q);
                    a.on("changeSelection", m.destroy);
                    a.on("changeSession", m.destroy);
                    a.on("mouseup", m.destroy);
                    a.on("change", m.destroy);
                    a.session.widgetManager.addLineWidget(m);
                    m.el.onmousedown = a.focus.bind(a);
                    a.renderer.scrollCursorIntoView(null, 0.5, {
                        bottom: m.el.offsetHeight
                    });
                };
                e.importCssString("\
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
            ], function(a, b, d) {
                "use strict";
                a("./lib/fixoldbrowsers");
                var e = a("./lib/dom");
                var f = a("./lib/event");
                var g = a("./range").Range;
                var h = a("./editor").Editor;
                var i = a("./edit_session").EditSession;
                var j = a("./undomanager").UndoManager;
                var k = a("./virtual_renderer").VirtualRenderer;
                a("./worker/worker_client");
                a("./keyboard/hash_handler");
                a("./placeholder");
                a("./multi_select");
                a("./mode/folding/fold_mode");
                a("./theme/textmate");
                a("./ext/error_marker");
                b.config = a("./config");
                b.require = a;
                if (true) b.define = c.amdD;
                b.edit = function(a, c) {
                    if (typeof a == "string") {
                        var d = a;
                        a = document.getElementById(d);
                        if (!a) throw new Error("ace.edit can't find div #" + d);
                    }
                    if (a && a.env && a.env.editor instanceof h) return a.env.editor;
                    var g = "";
                    if (a && /input|textarea/i.test(a.tagName)) {
                        var i = a;
                        g = i.value;
                        a = e.createElement("pre");
                        i.parentNode.replaceChild(a, i);
                    } else if (a) {
                        g = a.textContent;
                        a.innerHTML = "";
                    }
                    var j = b.createEditSession(g);
                    var l = new h(new k(a), j, c);
                    var m = {
                        document: j,
                        editor: l,
                        onResize: l.resize.bind(l, null)
                    };
                    if (i) m.textarea = i;
                    f.addListener(window, "resize", m.onResize);
                    l.on("destroy", function() {
                        f.removeListener(window, "resize", m.onResize);
                        m.editor.container.env = null;
                    });
                    l.container.env = l.env = m;
                    return l;
                };
                b.createEditSession = function(a, b) {
                    var c = new i(a, b);
                    c.setUndoManager(new j());
                    return c;
                };
                b.Range = g;
                b.Editor = h;
                b.EditSession = i;
                b.UndoManager = j;
                b.VirtualRenderer = k;
                b.version = b.config.version;
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
